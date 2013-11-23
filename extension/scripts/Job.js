var Job = function (url, parentSelector, scraper, parentJob, baseData) {

	if (parentJob !== undefined) {
		this.url = this.combineUrls(parentJob.url, url);
	}
	else {
		this.url = url;
	}
	this.parentSelector = parentSelector;
	this.scraper = scraper;
	this.dataItems = [];
	this.baseData = baseData || {};
};

Job.prototype = {

	combineUrls: function (parentUrl, childUrl) {

		var urlMatcher = new RegExp("(https?://)?([a-z0-9\\-\\.]+\\.[a-z]+)?(/.*)?(.*)?", "i");

		var parentMatches = parentUrl.match(urlMatcher);
		var childMatches = childUrl.match(urlMatcher);

		// special case for urls like this: ?a=1  or like-this/
		if (childMatches[1] === undefined && childMatches[2] === undefined && childMatches[3] === undefined) {

			var url = parentMatches[1] + parentMatches[2] + parentMatches[3] + childMatches[4];
			return url;
		}

		for (var i = 1; i <= 2; i++) {
			if (childMatches[i] === undefined) {
				childMatches[i] = parentMatches[i];
			}
		}
		if (childMatches[3] === undefined) {
			childMatches[3] = "/";
		}
		if (childMatches[4] === undefined) {
			childMatches[4] = "";
		}

		return childMatches[1] + childMatches[2] + childMatches[3] + childMatches[4];
	},

	execute: function (browser, callback, scope) {

		var sitemap = this.scraper.sitemap;
		var job = this;
		browser.fetchData(this.url, sitemap, this.parentSelector, function (results) {
			// merge data with data from initialization
			for (var i in results) {
				var result = results[i];
				for (var key in this.baseData) {
					result[key] = this.baseData[key];
				}
				this.dataItems.push(result);
			}
			console.log(job);
			callback(job);
		}, this);
	},
	getResults: function () {
		return this.dataItems;
	}
};
