describe("ContentScript", function () {

	var contentScript = getContentScript("ContentScript");
	var $el;

	beforeEach(function () {

		this.addMatchers(selectorMatchers);

		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
	});

	it("should be able to extract html", function () {

		$el.append('<div id="content-script-html-selector-test"></div>');

		var deferredHMTL = contentScript.getHTML({
			CSSSelector: "div#content-script-html-selector-test"
		});

		expect(deferredHMTL).deferredToEqual('<div id="content-script-html-selector-test"></div>');
	});

	it("should be able to call ContentScript from background script", function() {

		contentScript = getContentScript("BackgroundScript");

		$el.append('<div id="content-script-html-selector-test"></div>');

		var deferredHMTL = contentScript.getHTML({
			CSSSelector: "div#content-script-html-selector-test"
		});

		expect(deferredHMTL).deferredToEqual('<div id="content-script-html-selector-test"></div>');
	});

	it("should be able to call ContentScript from devtools", function() {

		contentScript = getContentScript("DevTools");

		$el.append('<div id="content-script-html-selector-test"></div>');

		var deferredHMTL = contentScript.getHTML({
			CSSSelector: "div#content-script-html-selector-test"
		});

		expect(deferredHMTL).deferredToEqual('<div id="content-script-html-selector-test"></div>');
	});

	it("should be able to get css selector from user", function() {

		contentScript = getContentScript("DevTools");
		$el.append('<div id="content-script-css-selector-test"><a class="needed"></a><a></a></div>');

		var deferredCSSSelector = contentScript.selectSelector({
			parentCSSSelector: "div#content-script-css-selector-test",
			allowedElements: "a"
		});

		// click on the element that will be selected
		$el.find("a.needed").click();

		// finish selection
		$("body #-selector-toolbar a").click();

		expect(deferredCSSSelector).deferredToEqual({CSSSelector: "a.needed"});

		expect(window.cs).toEqual(undefined);
	});

	it("should be return empty css selector when no element selected", function() {

		contentScript = getContentScript("DevTools");
		$el.append('<div id="content-script-css-selector-test"></div>');

		var deferredCSSSelector = contentScript.selectSelector({
			parentCSSSelector: "div#content-script-css-selector-test",
			allowedElements: "a"
		});

		// finish selection
		$("body #-selector-toolbar a").click();

		expect(deferredCSSSelector).deferredToEqual({CSSSelector: ""});

		expect(window.cs).toEqual(undefined);
	});

	it("should be able to preview elements", function() {

		contentScript = getContentScript("DevTools");
		$el.append('<div id="content-script-css-selector-test"><a></a></div>');

		var deferredSelectorPreview = contentScript.previewSelector({
			parentCSSSelector: "div#content-script-css-selector-test",
			elementCSSSelector: "a"
		});

		expect($(".-sitemap-select-item-selected").length).toEqual(1);
		expect($el.find("#content-script-css-selector-test").hasClass("-sitemap-parent")).toEqual(true);
		expect($el.find("a").hasClass("-sitemap-select-item-selected")).toEqual(true);

		var deferredSelectorPreviewCancel = contentScript.removeCurrentContentSelector();
		expect(deferredSelectorPreviewCancel).deferredToEqual(undefined);

		expect($(".-sitemap-select-item-selected").length).toEqual(0);
		expect($el.find("#content-script-css-selector-test").hasClass("-sitemap-parent")).toEqual(false);
		expect($el.find("a").hasClass("-sitemap-select-item-selected")).toEqual(false);

		expect(window.cs).toEqual(undefined);
	});
});