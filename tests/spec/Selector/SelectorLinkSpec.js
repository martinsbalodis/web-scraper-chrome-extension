describe("Link Selector", function () {

	var $el;

	beforeEach(function () {
		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
	});

	it("should extract single link", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorLink',
			multiple: false,
			selector: "a"
		});

		var dataDeferred = selector.getData($("#selector-follow"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: "a",
						'a-href': "http://example.com/a",
						_follow: "http://example.com/a",
						_followSelectorId: "a"
					}
				]);
			});
		});
	});

	it("should extract multiple links", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorLink',
			multiple: true,
			selector: "a"
		});

		var dataDeferred = selector.getData($("#selector-follow"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: "a",
						'a-href': "http://example.com/a",
						_follow: "http://example.com/a",
						_followSelectorId: "a"
					},
					{
						a: "b",
						'a-href': "http://example.com/b",
						_follow: "http://example.com/b",
						_followSelectorId: "a"
					}
				]);
			});
		});
	});

	it("should return data and url columns", function () {
		var selector = new Selector({
			id: 'id',
			type: 'SelectorLink',
			multiple: true,
			selector: "div"
		});

		var columns = selector.getDataColumns();
		expect(columns).toEqual(['id', 'id-href']);
	});

	it("should return empty array when no links are found", function () {
		var selector = new Selector({
			id: 'a',
			type: 'SelectorLink',
			multiple: true,
			selector: "a"
		});

		var dataDeferred = selector.getData($("#not-exist"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([]);
			});
		});
	});
});
