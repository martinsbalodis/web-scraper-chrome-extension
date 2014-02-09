describe("Sitemap", function () {

	beforeEach(function () {
		this.addMatchers(selectorMatchers);
	});

	it("should be able to rename selector with a parent", function () {

		var selectors = [
			{
				id: "parent",
				type: "SelectorElement",
				parentSelectors: [
					"_root"
				]
			},
			{
				id: "a",
				type: "SelectorText",
				parentSelectors: [
					"parent"
				]
			}
		];

		var sitemap = new Sitemap({
			selectors: selectors
		});

		var expected = new Selector({
			id: "b",
			type: "SelectorText",
			parentSelectors: [
				"parent"
			]
		});

		// no hard decidions here
		sitemap.updateSelector(sitemap.selectors[1], expected);
		expect(sitemap.selectors[1]).toEqual(expected);
	});

	it("should be able to rename selector with child selectors", function () {

		var selectors = [
			{
				id: "child",
				type: "SelectorText",
				parentSelectors: [
					"a"
				]
			},
			{
				id: "a",
				type: "SelectorElement",
				parentSelectors: [
					"_root"
				]
			}
		];

		var sitemap = new Sitemap({
			selectors: selectors
		});

		var expected = new Selector({
			id: "b",
			type: "SelectorElement",
			parentSelectors: [
				"_root"
			]
		});

		var expectedChild = new Selector({
			id: "child",
			type: "SelectorText",
			parentSelectors: [
				"b"
			]
		});

		// no hard decidions here
		sitemap.updateSelector(sitemap.selectors[1], expected);
		expect(sitemap.selectors[1]).toEqual(expected);
		expect(sitemap.selectors[0]).toEqual(expectedChild);
	});

	it("should be able to rename selector who is his own parent", function () {

		var selectors = [
			{
				id: "a",
				type: "SelectorElement",
				parentSelectors: [
					"a"
				]
			}
		];

		var sitemap = new Sitemap({
			selectors: selectors
		});

		var update = new Selector({
			id: "b",
			type: "SelectorElement",
			parentSelectors: [
				"a"
			]
		});

		var expected = new Selector({
			id: "b",
			type: "SelectorElement",
			parentSelectors: [
				"b"
			]
		});

		// no hard decidions here
		sitemap.updateSelector(sitemap.selectors[0], update);
		expect(sitemap.selectors[0]).toEqual(expected);
	});

	it("should be able to change selector type", function () {

		var sitemap = new Sitemap({
			selectors: [
				{
					id: "a",
					type: "SelectorText",
					parentSelectors: [
						"a"
					]
				}
			]
		});

		var update = new Selector({
			id: "a",
			type: "SelectorLink",
			parentSelectors: [
				"a"
			]
		});

		expect(sitemap.selectors[0].canCreateNewJobs()).toEqual(false);
		sitemap.updateSelector(sitemap.selectors[0], update);
		expect(sitemap.selectors[0].canCreateNewJobs()).toEqual(true);
	});

	it("should be able to export as JSON", function () {

		var sitemap = new Sitemap({
			_id: 'id',
			_rev: 'rev',
			selectors: [
				{
					id: "a",
					type: "SelectorElement",
					parentSelectors: [
						"a"
					]
				}
			]
		});

		var sitemapJSON = sitemap.exportSitemap();
		var expectedJSON = '{"_id":"id","selectors":[{"id":"a","type":"SelectorElement","parentSelectors":["a"]}]}';
		expect(sitemapJSON).toEqual(expectedJSON);
	});

	it("should be able to import from JSON", function () {

		var expectedSitemap = new Sitemap({
			_id: 'id',
			selectors: [
				{
					id: "a",
					type: "SelectorElement",
					parentSelectors: [
						"a"
					]
				}
			]
		});

		var sitemapJSON = '{"_id":"id","selectors":[{"id":"a","type":"SelectorElement","parentSelectors":["a"]}]}';
		var sitemap = new Sitemap();
		sitemap.importSitemap(sitemapJSON);
		expect(sitemap).toEqual(expectedSitemap);
	});

	it("should be able to export data as CSV", function () {

		var sitemap = new Sitemap({
			selectors: [
				{
					id: "a",
					type: "SelectorText",
					selector: "div"
				},
				{
					id: "b",
					type: "SelectorText",
					selector: "b"
				}
			]
		});

		var data = [
			{a: 'a', b: 'b', c: 'c'}
		];
		var blob = sitemap.getDataExportCsvBlob(data);
		// can't access the data so I'm just checking whether this runs
		expect(blob.toString()).toEqual("[object Blob]");
	});

	it("should know what data columns is it going to return", function () {

		var sitemap = new Sitemap({
			selectors: [
				{
					id: "a",
					type: "SelectorText",
					selector: "div"
				},
				{
					id: "b",
					type: "SelectorLink",
					selector: "b"
				}
			]
		});

		var columns = sitemap.getDataColumns();
		expect(columns).toEqual(['a', 'b', 'b-href']);

	});

	it("should be able to delete a selector", function () {
		var sitemap = new Sitemap({
			selectors: [
				{
					id: "a",
					type: "SelectorText",
					selector: "div",
					parentSelectors: ["_root"]
				},
				{
					id: "b",
					type: "SelectorLink",
					selector: "b",
					parentSelectors: ["_root"]
				}
			]
		});

		sitemap.deleteSelector(sitemap.selectors[0]);

		expect(sitemap.selectors.length).toEqual(1);
	});

	it("should be able to delete a selector with child selectors", function () {
		var sitemap = new Sitemap({
			selectors: [
				{
					id: "a",
					type: "SelectorText",
					selector: "div",
					parentSelectors: ["_root"]
				},
				{
					id: "b",
					type: "SelectorLink",
					selector: "b",
					parentSelectors: ["a"]
				}
			]
		});

		sitemap.deleteSelector(sitemap.selectors[0]);
		expect(sitemap.selectors.length).toEqual(0);
	});

	it("should not delete selectors if they have multiple parent selectors when deleting one of their parent", function () {
		var sitemap = new Sitemap({
			selectors: [
				{
					id: "a",
					type: "SelectorText",
					selector: "div",
					parentSelectors: ["_root"]
				},
				{
					id: "b",
					type: "SelectorLink",
					selector: "b",
					parentSelectors: ["a"]
				},
				{
					id: "c",
					type: "SelectorLink",
					selector: "c",
					parentSelectors: ["b", "_root"]
				}
			]
		});
		var expectedSelector = new Selector({
			id: "c",
			type: "SelectorLink",
			selector: "c",
			parentSelectors: ["_root"]
		});

		sitemap.deleteSelector(sitemap.selectors[0]);
		expect(sitemap.selectors).toEqual(new SelectorList([expectedSelector]));
	});

	it("Should return one start url", function(){
		var sitemap = new Sitemap({
			startUrl:"http://example.com/"
		});
		var expectedURLS = ["http://example.com/"];
		expect(sitemap.getStartUrls()).toEqual(expectedURLS);
	});

	it("Should return multiple start urls", function () {
		var sitemap = new Sitemap({
			startUrl: "http://example.com/[1-3].html"
		});
		var expectedURLS = [
			"http://example.com/1.html",
			"http://example.com/2.html",
			"http://example.com/3.html"
		];
		expect(sitemap.getStartUrls()).toEqual(expectedURLS);
	});

	it("Should return multiple start urls with id at the end", function () {
		var sitemap = new Sitemap({
			startUrl: "http://example.com/?id=[1-3]"
		});
		var expectedURLS = [
			"http://example.com/?id=1",
			"http://example.com/?id=2",
			"http://example.com/?id=3"
		];
		expect(sitemap.getStartUrls()).toEqual(expectedURLS);
	});

	it("Should return multiple start urls with padding", function () {
		var sitemap = new Sitemap({
			startUrl: "http://example.com/[001-003].html"
		});
		var expectedURLS = [
			"http://example.com/001.html",
			"http://example.com/002.html",
			"http://example.com/003.html"
		];
		expect(sitemap.getStartUrls()).toEqual(expectedURLS);
	});
});