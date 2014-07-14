describe("Click Element Selector", function () {

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
			type: 'SelectorElementClick',
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
			type: 'SelectorElementClick',
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

	it("should get elements that are available immediately after clicking", function() {

		$el.append($("<a>a</a>"));
		$el.find("a").click(function() {
			$el.append("<div>test</div>");
		});

		var selector = new Selector({
			id: 'div',
			type: 'SelectorElementClick',
			multiple: true,
			clickElementSelector: "a",
			selector: "div"
		});

		var dataDeferred = selector.getData($el[0]);

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {

			var data;
			dataDeferred.done(function(resultData) {
				data = resultData;
			});
			expect(data.length).toEqual(1);
			expect(data).toEqual($el.find("div").get());
		});
	});

	it("should skip clicking if click element is removed from dom", function(){

		$el.append($("<a>a</a><a class='remove'>b</a>"));
		$el.find("a").click(function() {
			$el.append("<div>test</div>");
			$el.find(".remove").remove();
		});

		var selector = new Selector({
			id: 'div',
			type: 'SelectorElementClick',
			multiple: true,
			clickElementSelector: "a",
			selector: "div",
			delay: 100
		});

		var dataDeferred = selector.getData($el[0]);

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {

			var data;
			dataDeferred.done(function(resultData) {
				data = resultData;
			});
			expect(data.length).toEqual(1);
			expect(data).toEqual($el.find("div").get());
		});
	});

	it("should get elements that are not available immediately after clicking but after some time", function() {

		$el.append($("<a>a</a>"));
		$el.find("a").click(function() {
			setTimeout(function(){
				$el.append("<div>test</div>");
			}, 50);
		});

		var selector = new Selector({
			id: 'div',
			type: 'SelectorElementClick',
			multiple: true,
			clickElementSelector: "a",
			selector: "div",
			delay: 100
		});

		var dataDeferred = selector.getData($el[0]);

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {

			var data;
			dataDeferred.done(function(resultData) {
				data = resultData;
			});
			expect(data.length).toEqual(1);
			expect(data).toEqual($el.find("div").get());
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
