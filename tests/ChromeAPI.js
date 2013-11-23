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
		this.tabUpdateCb = function () {
		}
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
	bindOnTabUpdated: function (callback) {
		this.tabUpdateCb = callback;
	},
	tabUpdate: function (tabId, data) {
		this.tabData[tabId] = data;

		// call that tab is updated
		// Asynchronous execution is essential
		setTimeout(function () {
			// @TODO all features
			this.tabUpdateCb(tabId, {
				status: 'complete'
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
	defineAPI: function () {
		window.chrome = {
			windows: {
				create: this.createWindow.bind(this),
				remove: function () {
				}
			},
			tabs: {
				onUpdated: {
					addListener: this.bindOnTabUpdated.bind(this)
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
			}
		};

		window.webkitNotifications = {
			createNotification: function () {
			}
		}
	}
};

