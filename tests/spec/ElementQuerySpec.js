describe("ElementQuery", function () {

	var $el;

	beforeEach(function () {

		$el = jQuery("#tests").html("");
		if ($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
	});

	it("should be able to select elements", function () {

		$el.append('<a></a><span></span>');

		var selectedElements = ElementQuery("a, span", $el);
		var expectedElements = $("a, span", $el);

		expect(selectedElements.sort()).toEqual(expectedElements.get().sort());
	});

	it("should be able to select parent", function () {

		$el.append('<a></a><span></span>');

		var selectedElements = ElementQuery("a, span, _parent_", $el);
		var expectedElements = $("a, span", $el);
		expectedElements = expectedElements.add($el);

		expect(selectedElements.sort()).toEqual(expectedElements.get().sort());
	});

	it("should should not return duplicates", function () {

		$el.append('<a></a><span></span>');

		var selectedElements = ElementQuery("*, a, span, _parent_", $el);
		var expectedElements = $("a, span", $el);
		expectedElements = expectedElements.add($el);

		expect(selectedElements.length).toEqual(3);
		expect(selectedElements.sort()).toEqual(expectedElements.get().sort());
	});

	it("should be able to select parent when parent there are multiple parents", function(){

		$el.append('<span></span><span></span>');

		var selectedElements = ElementQuery("_parent_", $("span", $el));
		var expectedElements = $("span", $el);

		expect(selectedElements.length).toEqual(2);
		expect(selectedElements.sort()).toEqual(expectedElements.get().sort());
	});

	it("should be able to select element with a comma ,", function(){

		$el.append('<span>,</span>');

		var selectedElements = ElementQuery(":contains(',')", $el);
		var expectedElements = $("span", $el);

		expect(selectedElements.length).toEqual(1);
		expect(selectedElements.sort()).toEqual(expectedElements.get().sort());
	});
});