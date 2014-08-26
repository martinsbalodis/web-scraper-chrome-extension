describe("Chrome popup browser", function () {

	beforeEach(function () {

		this.addMatchers(selectorMatchers);
		window.chromeAPI.reset();
	});

	it("should init a popup window", function () {

		var browser = new ChromePopupBrowser({
			pageLoadDelay: 500
		});
		expect(browser.popupWindowTabDeferred).deferredToEqual(0);
	});

	it("should load a page", function () {

		var browser = new ChromePopupBrowser({
			pageLoadDelay: 500
		});

		var tabLoadSuccess = false;

		browser.popupWindowTabDeferred.done(function(tabId){
			var deferredUrlLoaded = browser.loadUrl(tabId, "http://example,com/");
			deferredUrlLoaded.done(function(){
				tabLoadSuccess = true;
			});
		});

		waitsFor(function () {
			return tabLoadSuccess;
		}, 1000);

		runs(function () {
			expect(tabLoadSuccess).toEqual(true);
		});
	});

	it("should sendMessage to popup contentscript when data extraction is needed", function () {

		var sitemap = new Sitemap({
			selectors: [
				{
					id: 'a',
					selector: '#browserTest',
					type: 'SelectorText',
					multiple: false,
					parentSelectors: ['_root']
				}
			]
		});

		var browser = new ChromePopupBrowser({
			pageLoadDelay: 500
		});

		var fetched = false;
		var dataFetched = {};
		browser.fetchData("http://example,com/", sitemap, '_root', function (data) {
			fetched = true;
			dataFetched = data;
		});

		waitsFor(function (data) {
			return fetched;
		}, 1000);

		runs(function () {
			expect(fetched).toEqual(true);
			expect(dataFetched).toEqual([
				{
					'a': 'a'
				}
			]);
		});

	});
});