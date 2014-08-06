var ChromePopupBrowser = function (options) {

	this.pageLoadDelay = options.pageLoadDelay;

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

		var tabLoadListener = function (tabId, changeInfo, tab) {
			if(tabId === this.tab.id) {
				if (changeInfo.status === 'complete') {

					// @TODO check url ? maybe it would be bad because some sites might use redirects

					// remove event listener
					chrome.tabs.onUpdated.removeListener(tabLoadListener);

					// callback tab is loaded after page load delay
					setTimeout(callback, this.pageLoadDelay);
				}
			}
		}.bind(this);
		chrome.tabs.onUpdated.addListener(tabLoadListener);

		chrome.tabs.update(tab.id, {url: url});
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