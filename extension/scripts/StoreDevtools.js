/**
 * From devtools panel there is no possibility to execute XHR requests. So all requests to a remote CouchDb must be
 * handled through Background page. StoreDevtools is a simply a proxy store
 * @constructor
 */
var StoreDevtools = function () {

};

StoreDevtools.prototype = {
	createSitemap: function (sitemap, callback) {

		var request = {
			createSitemap: true,
			sitemap: JSON.parse(JSON.stringify(sitemap))
		};

		chrome.runtime.sendMessage(request, function (callbackFn, originalSitemap, newSitemap) {
			originalSitemap._rev = newSitemap._rev;
			callbackFn(originalSitemap);
		}.bind(this, callback, sitemap));
	},
	saveSitemap: function (sitemap, callback) {
		this.createSitemap(sitemap, callback);
	},
	deleteSitemap: function (sitemap, callback) {

		var request = {
			deleteSitemap: true,
			sitemap: JSON.parse(JSON.stringify(sitemap))
		};
		chrome.runtime.sendMessage(request, function (response) {
			callback();
		});
	},
	getAllSitemaps: function (callback) {

		var request = {
			getAllSitemaps: true
		};

		chrome.runtime.sendMessage(request, function (response) {

			var sitemaps = [];

			for (var i in response) {
				sitemaps.push(new Sitemap(response[i]));
			}
			callback(sitemaps);
		});
	},
	getSitemapData: function (sitemap, callback) {
		var request = {
			getSitemapData: true,
			sitemap: JSON.parse(JSON.stringify(sitemap))
		};

		chrome.runtime.sendMessage(request, function (response) {
			callback(response);
		});
	},
	sitemapExists: function (sitemapId, callback) {

		var request = {
			sitemapExists: true,
			sitemapId: sitemapId
		};

		chrome.runtime.sendMessage(request, function (response) {
			callback(response);
		});
	}
};