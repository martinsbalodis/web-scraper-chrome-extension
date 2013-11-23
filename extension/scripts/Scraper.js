Scraper = function (options) {
	this.queue = options.queue;
	this.sitemap = options.sitemap;
	this.store = options.store;
	this.browser = options.browser;
	this.resultWriter = null; // db instance for scraped data writing
};

Scraper.prototype = {

	/**
	 * Scraping delay between two page opening requests
	 */
	delay: 2000,
	_time_previous_scraped: 0,

	run: function (executionCallback) {

		var scraper = this;

		// callback when scraping is finished
		this.executionCallback = executionCallback;

		var firstJob = new Job(this.sitemap.startUrl, "_root", this);

		this.queue.add(firstJob);

		this.store.initSitemapDataDb(this.sitemap._id, function (resultWriter) {
			scraper.resultWriter = resultWriter;
			scraper._run();
		});
	},

	recordCanHaveChildJobs: function (record) {
		if (record._follow === undefined) {
			return false;
		}

		var selectorId = record._followSelectorId;
		var childSelectors = this.sitemap.getDirectChildSelectors(selectorId);
		if (childSelectors.length === 0) {
			return false;
		}
		else {
			return true;
		}
	},

	_run: function () {

		var job = this.queue.getNextJob();
		if (job === false) {
			console.log("Scraper execution is finished");
			this.executionCallback();
			return;
		}

		job.execute(this.browser, function (job) {

			var scrapedRecords = [];

			var records = job.getResults();
			records.forEach(function (rec) {
				var record = JSON.parse(JSON.stringify(rec));
				if (this.recordCanHaveChildJobs(record)) {
					var followSelectorId = record._followSelectorId;
					delete record['_follow'];
					delete record['_followSelectorId'];
					var job = new Job(rec['_follow'], rec['_followSelectorId'], this, job, record);
					if (this.queue.canBeAdded(job)) {
						this.queue.add(job);
					}
					// store already scraped links
					else {
						console.log("Ignoring next")
						console.log(record);
//						scrapedRecords.push(record);
					}
				}
				else {
					if (record._follow !== undefined) {
						delete record['_follow'];
						delete record['_followSelectorId'];
					}
					scrapedRecords.push(record);
				}

			}.bind(this));

			this.resultWriter.writeDocs(scrapedRecords, function () {

				var now = (new Date()).getTime();
				// delay next job if needed
				if(now > this._time_previous_scraped + this.delay) {
					this._time_previous_scraped = now;
					this._run();
				}
				else {
					var delay = this.delay-now-this._time_previous_scraped;
					setTimeout(function(){
						this._time_previous_scraped = now;
						this._run();
					}.bind(this),delay);
				}
			}.bind(this));
		}.bind(this));
	}
};