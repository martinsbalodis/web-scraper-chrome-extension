var ChromePopupBrowser = function (options) {

	this.pageLoadDelay = options.pageLoadDelay;
	this.resetPopupWindowTab();
};

ChromePopupBrowser.prototype = {

	popupWindowTabDeferred: null,

	resetPopupWindowTab: function() {

		// @TODO remove previous window

		var popupWindowTabDeferred = $.Deferred();
		this.popupWindowTabDeferred = popupWindowTabDeferred;

		chrome.windows.create({'type': 'popup', width: 1042, height: 768, focused: true, url: 'chrome://newtab'}, function (window) {
			var tab = window.tabs[0];
			popupWindowTabDeferred.resolve(tab.id);
		});
	},

	loadUrl: function (tabId, url) {

		var deferredURLLoaded = $.Deferred();

		// callback when url is loaded
		var tabLoadListener = function (tabIdLoaded, changeInfo, tab) {
			if(tabIdLoaded === tabId) {
				if (changeInfo.status === 'complete') {

					// @TODO check url ? maybe it would be bad because some sites might use redirects

					// remove event listener
					chrome.tabs.onUpdated.removeListener(tabLoadListener);

					// callback tab is loaded after page load delay
					setTimeout(deferredURLLoaded.resolve, this.pageLoadDelay);
				}
			}
		}.bind(this);
		chrome.tabs.onUpdated.addListener(tabLoadListener);

		// load url
		chrome.tabs.update(tabId, {url: url});

		return deferredURLLoaded.promise();
	},

	close: function () {
		chrome.windows.remove(this.window.id);
	},

	fetchData: function (url, sitemap, parentSelectorId, callback, scope) {

		this.popupWindowTabDeferred.done(function(tabId) {

			var deferredURLLoaded = this.loadUrl(tabId, url);
			deferredURLLoaded.done(function() {

				var message = {
					extractData: true,
					sitemap: JSON.parse(JSON.stringify(sitemap)),
					parentSelectorId: parentSelectorId
				};

				chrome.tabs.sendMessage(tabId, message, function (data) {
					console.log("extracted data from web page", data);
					callback.call(scope, data);
				});

			}.bind(this));
		}.bind(this));
	}
};