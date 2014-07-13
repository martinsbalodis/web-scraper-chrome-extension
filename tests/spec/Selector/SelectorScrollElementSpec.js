describe("Scroll Element Selector", function () {

	var $el;

	beforeEach(function () {
		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
	});

	it("should return one element", function () {

		$el.append("<div>a</div><div>b</div>");
		var selector = new Selector({
			id: 'a',
			type: 'SelectorElement',
			multiple: false,
			selector: "div"
		});

		var dataDeferred = selector.getData($el[0]);

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([$el.find("div")[0]]);
			});
		});
	});

	it("should return multiple elements", function () {

		$el.append("<div>a</div><div>b</div>");
		var selector = new Selector({
			id: 'a',
			type: 'SelectorElement',
			multiple: true,
			selector: "div"
		});

		var dataDeferred = selector.getData($el[0]);

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual($el.find("div").get());
			});
		});
	});

	it("should get elements when scrolling is not needed", function() {

		$el.append($("<a>a</a>"));
		var selector = new Selector({
			id: 'a',
			type: 'SelectorScrollElement',
			multiple: true,
			selector: "a",
			delay: 100
		});

		var dataDeferred = selector.getData($el[0]);

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual($el.find("a").get());
			});
		});
	});

	it("should get elements which are added a delay", function() {

		$el.append($("<a>a</a>"));
		// add extra element after a little delay
		setTimeout(function() {
			$el.append($("<a>a</a>"));
		}, 100);

		var selector = new Selector({
			id: 'a',
			type: 'SelectorScrollElement',
			multiple: true,
			selector: "a",
			delay: 200
		});

		var dataDeferred = selector.getData($el[0]);

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect($el.find("a").length).toEqual(2);
				expect(data).toEqual($el.find("a").get());
			});
		});
	});

	it("should return no data columns", function () {
		var selector = new Selector({
			id: 'a',
			type: 'SelectorElement',
			multiple: true,
			selector: "div"
		});

		var columns = selector.getDataColumns();
		expect(columns).toEqual([]);
	});
});
