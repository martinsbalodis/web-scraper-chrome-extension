var ChromePopupBrowser = function (options) {

	this.pageLoadDelay = options.pageLoadDelay;

	// @TODO this limits to a single scraping window
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		if (changeInfo.status === 'complete') {
			setTimeout(function () {
				this.cbTabUpdated.call(window, tabId, changeInfo, tab);
			}.bind(this), this.pageLoadDelay);
		}
	}.bind(this));

	// @TODO somehow handle the closed window
};

ChromePopupBrowser.prototype = {

	_initPopupWindow: function (callback, scope) {

		var browser = this;
		if (this.window !== undefined) {
			console.log(JSON.stringify(this.window));
			// check if tab exists
			chrome.tabs.get(this.tab.id, function (tab) {
				if (!tab) {
					throw "Scraping window closed";
				}
			});


			callback.call(scope);
			return;
		}

		chrome.windows.create({'type': 'popup', width: 1042, height: 768, focused: true, url: 'chrome://newtab'}, function (window) {
			browser.window = window;
			browser.tab = window.tabs[0];


			callback.call(scope);
		});
	},

	loadUrl: function (url, callback) {

		var tab = this.tab;

		chrome.tabs.update(tab.id, {url: url});

		this.cbTabUpdated = function (tabId, changeInfo, tabUpdated) {

			if (tabId === tab.id) {

				// @TODO check url
				callback.call();
			}
		};

	},

	close: function () {
		chrome.windows.remove(this.window.id);
	},

	fetchData: function (url, sitemap, parentSelectorId, callback, scope) {

		var browser = this;

		this._initPopupWindow(function () {
			var tab = browser.tab;

			browser.loadUrl(url, function () {

				var message = {
					extractData: true,
					sitemap: JSON.parse(JSON.stringify(sitemap)),
					parentSelectorId: parentSelectorId
				};

				chrome.tabs.sendMessage(tab.id, message, function (data) {
					console.log("extracted data from web page", data);
					callback.call(scope, data);
				});
			}.bind(this));
		}, this);
	}
};