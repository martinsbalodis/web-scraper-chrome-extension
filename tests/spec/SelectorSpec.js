describe("Selector", function () {
	var $el;

	beforeEach(function () {

		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'>aaaaaaaaaaaa</div>").appendTo("body");
		}
	});

	it("should be able to select elements", function () {

		$el.html("<a></a>");

		var selector = new Selector({
			selector: "a",
			type: 'SelectorLink'
		});
		var elements = selector.getDataElements($el.get());

		expect(elements).toEqual($el.find("a").get());
	});

	it("should be able to select parent", function () {

		$el.html("<a></a>");

		var selector = new Selector({
			selector: "_parent_",
			type: 'SelectorLink'
		});
		var elements = selector.getDataElements($el.get());

		expect(elements.get()).toEqual($el.get());
	});

	it("should be able to select elements with delay", function() {

		var selector = new Selector({
			id: 'a',
			selector: "a",
			type: 'SelectorText',
			delay:100
		});
		var dataDeferred = selector.getData($el.get());

		// add data after data extraction called
		$el.html("<a>a</a>");

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						'a': "a"
					}
				]);
			});
		});
	});
});