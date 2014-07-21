Scraper = function (options) {
	this.queue = options.queue;
	this.sitemap = options.sitemap;
	this.store = options.store;
	this.browser = options.browser;
	this.resultWriter = null; // db instance for scraped data writing
	this.requestInterval = parseInt(options.requestInterval);
	this.pageLoadDelay = parseInt(optons.pageLoadDelay);
};

Scraper.prototype = {

	/**
	 * Scraping delay between two page opening requests
	 */
	requestInterval: 2000,
	pageLoadDelay: 1000,
	_timeNextScrapeAvailable: 0,

	initFirstJobs: function () {

		var urls = this.sitemap.getStartUrls();

		urls.forEach(function (url) {
			var firstJob = new Job(url, "_root", this);
			this.queue.add(firstJob);
		}.bind(this));
	},

	run: function (executionCallback) {

		var scraper = this;

		// callback when scraping is finished
		this.executionCallback = executionCallback;

		this.initFirstJobs();

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
					var newJob = new Job(rec['_follow'], rec['_followSelectorId'], this, job, record);
					if (this.queue.canBeAdded(newJob)) {
						this.queue.add(newJob);
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
				this._timeNextScrapeAvailable = now + this.requestInterval;
				if(now >= this._timeNextScrapeAvailable) {
					this._run();
				}
				else {
					var delay = this._timeNextScrapeAvailable - now;
					setTimeout(function() {
						this._run();
					}.bind(this), delay);
				}
			}.bind(this));
		}.bind(this));
	}
};