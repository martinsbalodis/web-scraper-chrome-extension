var ChromeAPI = function () {
	this.backgroundPageMessageHandler = null;
	this.contentScriptMessageHandler = null;
	this.reset();
	this.defineAPI();

};

ChromeAPI.prototype = {
	reset: function () {
		this.currentTab = 0;
		this.tabData = [];
		this.tabs = [];
		this.prevDownloaId = 0;
		this.downloadsOnChangedListeners = [];
		this.tabsOnUpdatedLinsteners = [];
	},
	createWindow: function (data, callback) {
		var tabId = this.currentTab;
		this.currentTab++;

		var tab = {
			id: tabId
		};
		this.tabs[tabId] = tab;

		callback({
			tabs: this.tabs
		});
	},
	bindOnTabUpdated: function (listener) {

		this.tabsOnUpdatedLinsteners.push(listener);
	},
	tabsOnUpdatedRemoveListener: function(listener) {

		var index = this.tabsOnUpdatedLinsteners.indexOf(listener);
		if(index !== -1) {
			this.tabsOnUpdatedLinsteners[index] = function(){};
		}
	},
	tabUpdate: function (tabId, data) {
		this.tabData[tabId] = data;

		// call that tab is updated
		// Asynchronous execution is essential
		setTimeout(function () {
			// @TODO all features
			this.tabsOnUpdatedLinsteners.forEach(function(listener) {
				listener(tabId, {
					status: 'complete'
				});
			});
		}.bind(this), 1);
	},
	tabGet: function (tabId, callback) {
		callback(this.tabs[tabId]);
	},
	// @TODO use real message pasing
	tabSendMessage: function (tabId, request, callback) {

		this.contentScriptMessageHandler.call(window, request, {}, callback);
	},
	sendMessageToBackgroundPage: function (request, callback) {
		this.backgroundPageMessageHandler.call(window, request, {}, callback);
	},
	registerMessageHandler: function (handler) {
		// This method is called from the background page and also from content scripts
		// I'll asume that the first handler is for the background page and the second
		// one will be for content script.
		if (this.backgroundPageMessageHandler === null) {
			this.backgroundPageMessageHandler = handler;
		}
		else {
			this.contentScriptMessageHandler = handler;
		}
	},
	tabQuery: function (query, callback) {
		callback([
			{'id': 666}
		]);
	},
	chromeStorageSyncGet: function (items, callback) {
		callback({});
	},
	downloadsDownload: function(request, callback) {

		var downloadId = this.prevDownloaId++;
		callback(downloadId);

		setTimeout(function() {
			this.downloadsOnChangedListeners.forEach(function(listener) {

				var downloadItem = {
					id: downloadId,
					state: {
						current: "complete"
					}
				};

				listener(downloadItem);
			}.bind(this));
		}.bind(this),1);
	},
	downloadsOnChangedAddListener: function(listener) {

		this.downloadsOnChangedListeners.push(listener);
	},
	downloadsOnChangedRemoveListener: function(listener) {

		var index = this.downloadsOnChangedListeners.indexOf(listener);
		if(index !== -1) {
			this.downloadsOnChangedListeners[index] = function(){};
		}
	},
	defineAPI: function () {
		window.chrome = {
			windows: {
				create: this.createWindow.bind(this),
				remove: function () {
				}
			},
			tabs: {
				onUpdated: {
					addListener: this.bindOnTabUpdated.bind(this),
					removeListener: this.tabsOnUpdatedRemoveListener.bind(this)
				},
				update: this.tabUpdate.bind(this),
				get: this.tabGet.bind(this),
				sendMessage: this.tabSendMessage.bind(this),
				query: this.tabQuery.bind(this)
			},
			runtime: {
				sendMessage: this.sendMessageToBackgroundPage.bind(this),
				onMessage: {
					addListener: this.registerMessageHandler.bind(this)
				}
			},
			storage: {
				onChanged: {
					addListener: function () {
					}
				},
				sync: {
					get: this.chromeStorageSyncGet.bind(this)
				}
			},
			downloads: {
				download: this.downloadsDownload.bind(this),
				onChanged: {
					addListener: this.downloadsOnChangedAddListener.bind(this),
					removeListener: this.downloadsOnChangedRemoveListener.bind(this)
				}
			}
		};

		window.webkitNotifications = {
			createNotification: function () {
			}
		}
	}
};

