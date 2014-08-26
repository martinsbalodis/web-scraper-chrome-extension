var ChromePopupBrowser = function (options) {

	this.pageLoadDelay = options.pageLoadDelay;
	this.dataExtractionTimeout = options.dataExtractionTimeout || 60000;
	this.resetPopupWindowTab();
};

ChromePopupBrowser.prototype = {

	popupWindowTabDeferred: null,

	resetPopupWindowTab: function() {

		// remove previous window
		// @TODO maybe there are some tab event listeners left behind?
		this.close();

		var popupWindowTabDeferred = $.Deferred();
		this.popupWindowTabDeferred = popupWindowTabDeferred;

		chrome.windows.create({'type': 'popup', width: 1042, height: 768, focused: true, url: 'chrome://newtab'}, function (window) {
			var tab = window.tabs[0];
			popupWindowTabDeferred.resolve(tab.id, window.id);
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
		// @TODO check tab exists
		chrome.tabs.update(tabId, {url: url});

		return deferredURLLoaded.promise();
	},

	close: function () {
		if(this.popupWindowTabDeferred !== null) {
			// @TODO check window still exists
			this.popupWindowTabDeferred.done(function(tabId, windowId) {
				chrome.windows.remove(windowId);
			});
		}
	},

	fetchData: function (url, sitemap, parentSelectorId, callback, scope) {

		var deferredDataExtracted = $.Deferred();
		deferredDataExtracted.done(function(data) {
			console.log("extracted data from web page", data);
			callback.call(scope, data);
		});

		if(this.dataExtractionTimeout) {
			var dataExtractionTimeoutCall = setTimeout(function() {
				deferredDataExtracted.reject();
				this.resetPopupWindowTab();
				this.fetchData(url, sitemap, parentSelectorId, callback, scope);

			}.bind(this), this.dataExtractionTimeout);
		}

		this.popupWindowTabDeferred.done(function(tabId) {

			var deferredURLLoaded = this.loadUrl(tabId, url);
			deferredURLLoaded.done(function() {

				var message = {
					extractData: true,
					sitemap: JSON.parse(JSON.stringify(sitemap)),
					parentSelectorId: parentSelectorId
				};

				chrome.tabs.sendMessage(tabId, message, function (data) {

					// undefined is returned if window is closed
					if(!data) {
						return;
					}

					if(dataExtractionTimeoutCall) {
						clearTimeout(dataExtractionTimeoutCall);
					}
					deferredDataExtracted.resolve(data);
				});

			}.bind(this));

			// probably failed because the window is closed
			// @TODO this wont be executed because deferred is not being rejected when tab goes missing
			deferredURLLoaded.fail(function() {
				console.log("failed opening url. will retry");

				if(dataExtractionTimeoutCall) {
					clearTimeout(dataExtractionTimeoutCall);
				}

				// retry data extraction
				deferredDataExtracted.reject();
				this.resetPopupWindowTab();
				this.fetchData(url, sitemap, parentSelectorId, callback, scope);
			}.bind(this));
		}.bind(this));
	}
};