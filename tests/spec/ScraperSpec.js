describe("Scraper", function () {

	var q, store;

	beforeEach(function () {
		q = new Queue();
		store = new FakeStore();
		window.chromeAPI.reset();
	});

	it("should be able to scrape one page", function () {

		var sitemap = new Sitemap({
			id: 'test',
			startUrl: 'http://test.lv/',
			selectors: [
				{
					"id": "a",
					"selector": "#scraper-test-one-page a",
					"multiple": false,
					type: 'SelectorText',
					"parentSelectors": [
						"_root"
					]
				}
			]
		});

		var browser = new ChromePopupBrowser();

		var s = new Scraper({
			queue: q,
			sitemap: sitemap,
			browser: browser,
			store: store
		});

		var executed = false;
		runs(function () {
			s.run(function () {
				executed = true;
			});
		});

		waitsFor(function () {
			return executed;
		}, 1000);
		runs(function () {
			expect(executed).toBe(true);
			expect(JSON.stringify(store.data[0])).toBe(JSON.stringify({a: 'a'}));
		});
	});

	it("should be able to scrape a child page", function () {

		var sitemap = new Sitemap({
			id: 'test',
			startUrl: 'http://test.lv/',
			selectors: [
				{
					"id": "link",
					"selector": "#scraper-test-child-page a",
					"multiple": true,
					type: "SelectorLink",
					"parentSelectors": ["_root"]
				},
				{
					"id": "b",
					"selector": "#scraper-test-child-page b",
					"multiple": false,
					type: "SelectorText",
					"parentSelectors": ["link"]
				}
			]
		});

		var browser = new ChromePopupBrowser();

		var s = new Scraper({
			queue: q,
			sitemap: sitemap,
			browser: browser,
			store: store,
			delay: 0
		});

		var executed = false;
		runs(function () {
			s.run(function () {
				executed = true;
			});
		});

		waitsFor(function () {
			return executed;
		}, 3000);

		runs(function () {
			expect(executed).toBe(true);
			expect(store.data).toEqual([
				{'link': 'test', 'link-href': 'http://test.lv/1/', 'b': 'b'}
			]);
		});
	});

	it("should be able to tell whether a data record can have child jobs", function () {

		var sitemap = new Sitemap({
			id: 'test',
			startUrl: 'http://test.lv/',
			selectors: [
				{
					"id": "link-w-children",
					"selector": "a",
					"multiple": true,
					type: "SelectorLink",
					"parentSelectors": ["_root"]
				},
				{
					"id": "link-wo-children",
					"selector": "a",
					"multiple": true,
					type: "SelectorLink",
					"parentSelectors": ["_root"]
				},
				{
					"id": "b",
					"selector": "#scraper-test-child-page b",
					"multiple": false,
					type: "SelectorText",
					"parentSelectors": ["link-w-children"]
				}
			]
		});

		var s = new Scraper({
			queue: q,
			sitemap: sitemap,
			store: store
		});

		var follow = s.recordCanHaveChildJobs({
			_follow: 'http://example.com/',
			_followSelectorId: 'link-w-children'
		});
		expect(follow).toBe(true);

		follow = s.recordCanHaveChildJobs({
			_follow: 'http://example.com/',
			_followSelectorId: 'link-wo-children'
		});
		expect(follow).toBe(false);

	});

	it("should be able to create multiple start jobs", function () {

		var sitemap = new Sitemap({
			startUrl: 'http://test.lv/[1-100].html'
		});

		var s = new Scraper({
			queue: q,
			sitemap: sitemap,
			store: store
		});

		s.initFirstJobs();
		expect(q.jobs.length).toBe(100);
	});

	it("should create multiple start jobs if multiple urls provided", function(){

		var sitemap = new Sitemap({
			startUrl: ['http://example.com/1', 'http://example.com/2', 'http://example.com/3']
		});

		var s = new Scraper({
			queue: q,
			sitemap: sitemap,
			store: store
		});

		s.initFirstJobs();
		expect(q.jobs.length).toBe(3);
	});
});
