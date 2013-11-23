var Queue = function () {
	this.jobs = [];
	this.scrapedUrls = {};
};

Queue.prototype = {

	/**
	 * Returns false if page is already scraped
	 * @param job
	 * @returns {boolean}
	 */
	add: function (job) {

		if (this.canBeAdded(job)) {
			this.jobs.push(job);
			this._setUrlScraped(job.url);
			return true;
		}
		return false;
	},

	canBeAdded: function (job) {
		if (this.isScraped(job.url)) {
			return false;
		}

		// reject documents
		if (job.url.match(/\.(doc|docx|pdf|ppt|pptx|odt)$/i) !== null) {
			return false;
		}
		return true;
	},

	getQueueSize: function () {
		return this.jobs.length;
	},

	isScraped: function (url) {
		return (this.scrapedUrls[url] !== undefined);
	},

	_setUrlScraped: function (url) {
		this.scrapedUrls[url] = true;
	},

	getNextJob: function () {

		// @TODO test this
		if (this.getQueueSize() > 0) {
			return this.jobs.pop();
		}
		else {
			return false;
		}
	}
};