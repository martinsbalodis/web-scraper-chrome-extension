describe("BackgroundScript", function () {

	var backgroundScript = getBackgroundScript("BackgroundScript");
	var contentScript = getContentScript("BackgroundScript");
	var $el;

	beforeEach(function () {

		this.addMatchers(selectorMatchers);

		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
	});

	it("should be able to call BackgroundScript functions from background script", function () {

		var deferredResponse = backgroundScript.dummy();

		expect(deferredResponse).deferredToEqual('dummy');
	});

	it("should be able to call BackgroundScript from Devtools", function() {

		var backgroundScript = getBackgroundScript("DevTools");
		var deferredResponse = backgroundScript.dummy();
		expect(deferredResponse).deferredToEqual('dummy');
	});
});