var config = new Config();
var store;
config.loadConfiguration(function () {
	console.log("initial configuration", config);
	store = new Store(config);
});

chrome.storage.onChanged.addListener(function () {
	config.loadConfiguration(function () {
		console.log("configuration changed", config);
		store = new Store(config);
	});
});

var sendToActiveTab = function(request, callback) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		if (tabs.length < 1) {
			this.console.log("couldn't find active tab");
		}
		else {
			var tab = tabs[0];
			chrome.tabs.sendMessage(tab.id, request, callback);
		}
	});
};

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		console.log("chrome.runtime.onMessage", request);

		if (request.createSitemap) {
			store.createSitemap(request.sitemap, sendResponse);
			return true;
		}
		else if (request.saveSitemap) {
			store.saveSitemap(request.sitemap, sendResponse);
			return true;
		}
		else if (request.deleteSitemap) {
			store.deleteSitemap(request.sitemap, sendResponse);
			return true;
		}
		else if (request.getAllSitemaps) {
			store.getAllSitemaps(sendResponse);
			return true;
		}
		else if (request.sitemapExists) {
			store.sitemapExists(request.sitemap, sendResponse);
			return true;
		}
		else if (request.getSitemapData) {
			store.getSitemapData(new Sitemap(request.sitemap), sendResponse);
			return true;
		}

		else if (request.selectSelector) {

			sendToActiveTab(request, function (response) {
				console.log("selectors selected", response);
				sendResponse(response);
			});
			return true;
		}
		else if (request.selectSelectorParent || request.selectSelectorChild) {

			sendToActiveTab(request, function (response) {
				sendResponse(response);
			});
			return true;
		}
		else if (request.previewSelector || request.cancelPreviewSelector) {
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function (tabs) {
				if (tabs.length < 1) {
					this.console.log("couldn't find active tab");
				}
				else {
					var tab = tabs[0];
					chrome.tabs.sendMessage(tab.id, request);
				}
			});
			return false;
		}
		else if (request.scrapeSitemap) {
			var sitemap = new Sitemap(request.sitemap);
			var queue = new Queue();
			var browser = new ChromePopupBrowser();

			var scraper = new Scraper({
				queue: queue,
				sitemap: sitemap,
				browser: browser,
				store: store
			});

			try {
				scraper.run(function () {
					browser.close();
					if (window.webkitNotifications.checkPermission() == 0) {
						var notification = webkitNotifications.createNotification(
							'assets/images/icon38.png',
							'Scraping finished1',
							'Finished scraping ' + sitemap._id
						);
						notification.show();
					}
				});
			}
			catch (e) {
				console.log("Scraper execution cancelled".e);
			}
		}
		else if(request.previewSelectorData) {
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function (tabs) {
				if (tabs.length < 1) {
					this.console.log("couldn't find active tab");
				}
				else {
					var tab = tabs[0];
					chrome.tabs.sendMessage(tab.id, request, sendResponse);
				}
			});
			return true;
		}
	}
);
