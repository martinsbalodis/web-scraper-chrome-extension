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

		var urlMatcher = new RegExp("(https?://)?([a-z0-9\\-\\.]+\\.[a-z0-9\\-]+(:\\d+)?|\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d+)?)?(\\/[^\\?]*\\/|\\/)?([^\\?]*)?(\\?.*)?", "i");

		var parentMatches = parentUrl.match(urlMatcher);
		var childMatches = childUrl.match(urlMatcher);

		// special case for urls like this: ?a=1  or like-this/
		if (childMatches[1] === undefined && childMatches[2] === undefined && childMatches[5] === undefined && childMatches[6] === undefined) {

			var url = parentMatches[1] + parentMatches[2] + parentMatches[5] + parentMatches[6] + childMatches[7];
			return url;
		}

		if (childMatches[1] === undefined) {
			childMatches[1] = parentMatches[1];
		}
		if (childMatches[2] === undefined) {
			childMatches[2] = parentMatches[2];
		}
		if (childMatches[5] === undefined) {
			if(parentMatches[5] === undefined) {
				childMatches[5] = '/';
			}
			else {
				childMatches[5] = parentMatches[5];
			}
		}

		if (childMatches[6] === undefined) {
			childMatches[6] = "";
		}
		if (childMatches[7] === undefined) {
			childMatches[7] = "";
		}

		return childMatches[1] + childMatches[2] + childMatches[5] + childMatches[6] + childMatches[7];
	},

	execute: function (browser, callback, scope) {

		var sitemap = this.scraper.sitemap;
		var job = this;
		browser.fetchData(this.url, sitemap, this.parentSelector, function (results) {
			// merge data with data from initialization
			for (var i in results) {
				var result = results[i];
				for (var key in this.baseData) {
					if(!(key in result)) {
						result[key] = this.baseData[key];
					}
				}
				this.dataItems.push(result);
			}
			console.log(job);
			callback(job);
		}.bind(this), this);
	},
	getResults: function () {
		return this.dataItems;
	}
};
