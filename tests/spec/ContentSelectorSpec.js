describe("ContentSelector", function () {

	var $el;

	beforeEach(function () {

		this.addMatchers(selectorMatchers);

		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
	});

	var removeContentSelectorGUI = function(contentSelector) {

		expect($("#-selector-toolbar").length).toEqual(1);
		contentSelector.removeGUI();
		expect($("#-selector-toolbar").length).toEqual(0);
	};

	it("should be able to get css selector from user", function() {

		$el.append('<div id="content-script-css-selector-test"><a class="needed"></a><a></a></div>');

		var contentSelector = new ContentSelector({
			parentCSSSelector: "div#content-script-css-selector-test",
			allowedElements: "a"
		});

		var deferredCSSSelector = contentSelector.getCSSSelector();

		// click on the element that will be selected
		$el.find("a.needed").click();

		// finish selection
		$("#-selector-toolbar .done-selecting-button").click();

		expect(deferredCSSSelector).deferredToEqual({CSSSelector: "a.needed"});

		removeContentSelectorGUI(contentSelector);
	});

	it("should be return empty css selector when no element selected", function() {

		$el.append('<div id="content-script-css-selector-test"></div>');

		var contentSelector = new ContentSelector({
			parentCSSSelector: "div#content-script-css-selector-test",
			allowedElements: "a"
		});

		var currentCSSSelector = contentSelector.getCurrentCSSSelector();
		expect(currentCSSSelector).toEqual("");

		var deferredCSSSelector = contentSelector.getCSSSelector();

		// finish selection
		$("#-selector-toolbar .done-selecting-button").click();

		expect(deferredCSSSelector).deferredToEqual({CSSSelector: ""});

		removeContentSelectorGUI(contentSelector);
	});

	it("should use body as parent element when no parent selector specified", function() {

		var contentSelector = new ContentSelector({
			parentCSSSelector: " ",
			allowedElements: "a"
		});

		// finish selection
		$("#-selector-toolbar .done-selecting-button").click();

		expect(contentSelector.parent).toEqual($("body")[0]);
	});

	it("should reject selection when parent selector not found", function() {

		var contentSelector = new ContentSelector({
			parentCSSSelector: "div#content-script-css-selector-test",
			allowedElements: "a",
			alert: function(){}
		});

		var deferredCSSSelector = contentSelector.getCSSSelector();
		expect(deferredCSSSelector).deferredToFail();
	});

	it("should be able to preview selected elements", function() {

		$el.append('<div id="content-script-css-selector-test"><a></a></div>');

		var contentSelector = new ContentSelector({
			parentCSSSelector: "div#content-script-css-selector-test"
		});

		contentSelector.previewSelector("a");

		expect($(".-sitemap-select-item-selected").length).toEqual(1);
		expect($el.find("#content-script-css-selector-test").hasClass("-sitemap-parent")).toEqual(true);
		expect($el.find("a").hasClass("-sitemap-select-item-selected")).toEqual(true);

		contentSelector.removeGUI();

		expect($(".-sitemap-select-item-selected").length).toEqual(0);
		expect($el.find("#content-script-css-selector-test").hasClass("-sitemap-parent")).toEqual(false);
		expect($el.find("a").hasClass("-sitemap-select-item-selected")).toEqual(false);
	});

	it("should reject selector preview request when parent element not found", function() {

		var contentSelector = new ContentSelector({
			parentCSSSelector: "div#content-script-css-selector-test",
			alert: function(){}
		});

		var deferredSelectorPreview = contentSelector.previewSelector("a");
		expect(deferredSelectorPreview).deferredToFail();

		expect($(".-sitemap-select-item-selected").length).toEqual(0);
	});
});