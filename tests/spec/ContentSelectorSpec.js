describe("ContentSelector", function () {

	beforeEach(function () {

	});

	it("should be able to extract needed selectors from all selector tree", function () {

		var selectors = [
			{
				id: "url",
				multiple: true,
				selector: "a",
				type: 'SelectorLink',
				parentSelectors: ['_root']
			},
			{
				id: "main-div",
				multiple: false,
				selector: "#content-selector-tests",
				type: 'SelectorElement',
				parentSelectors: ['url']
			},
			{
				id: "div",
				type: "SelectorElement",
				selector: "div",
				multiple: true,
				parentSelectors: ['main-div']
			},
			{
				id: "span",
				type: "SelectorElement",
				selector: "span",
				multiple: true,
				parentSelectors: ['div']
			},
			{
				id: "el",
				type: "SelectorElement",
				selector: "el",
				multiple: true,
				parentSelectors: ['span']
			}
		];

		var sitemap = new Sitemap({
			selectors: selectors
		});

		var generatedSelector;
		var cs = new ContentSelector({
			sitemap: sitemap,
			selectorId: 'el'
		});
		cs.selectSelector(function (selector) {
			generatedSelector = selector;
		});

		cs.selectedElements = $("#content-selector-tests-expected").children();

		var expectedParent = $("#content-selector-tests-expected")[0];
		var parent = cs.getParentElement();
		expect(parent).toEqual(expectedParent);
		cs.selectionFinished();

		expect(generatedSelector).toEqual("table");
	});

	it("should be able to return body when there are no parent selectors", function () {

		var sitemap = new Sitemap({
			selectors: [{
					id: "el",
					type: "SelectorElement",
					selector: "el",
					multiple: true,
					parentSelectors: ['_root']
				}]
		});

		var generatedSelector;
		var cs = new ContentSelector({
			sitemap: sitemap,
			selectorId: 'el'
		});
		cs.selectSelector(function (selector) {
		});
		cs.selectedElements = $("#content-selector-tests-expected").children();

		// webpage playground forced this to be #webpage :(
		var expectedParent = $("#webpage")[0];
		var parent = cs.getParentElement();
		expect(parent).toEqual(expectedParent);
		cs.selectionFinished();
	});

});