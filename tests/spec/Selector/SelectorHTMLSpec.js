describe("HTML Selector", function () {

	beforeEach(function () {

	});

	it("should extract single html element", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorHTML',
			multiple: false,
			selector: "div"
		});

		var dataDeferred = selector.getData($("#selector-html-single-html"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: "aaa<b>bbb</b>ccc"
					}
				]);
			});
		});
	});

	it("should extract multiple html elements", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorHTML',
			multiple: true,
			selector: "div"
		});

		var dataDeferred = selector.getData($("#selector-html-multiple-html"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: "aaa<b>bbb</b>ccc"
					},
					{
						a: "ddd<b>eee</b>fff"
					}
				]);
			});
		});
	});

	it("should extract null when there are no elements", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorHTML',
			multiple: false,
			selector: "div"
		});

		var dataDeferred = selector.getData($("#selector-html-single-not-exist"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: null
					}
				]);
			});
		});
	});

	it("should extract null when there is no regex match", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorHTML',
			multiple: false,
			selector: "div",
			regex: "wontmatch"
		});

		var dataDeferred = selector.getData($("#selector-html-single-html"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: null
					}
				]);
			});
		});
	});

	it("should extract html+text using regex", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorHTML',
			multiple: false,
			selector: "div",
			regex: "<b>\\w+"
		});

		var dataDeferred = selector.getData($("#selector-html-single-html"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: '<b>bbb'
					}
				]);
			});
		});
	});

	it("should return only one data column", function () {
		var selector = new Selector({
			id: 'id',
			type: 'SelectorHTML',
			multiple: true,
			selector: "div"
		});

		var columns = selector.getDataColumns();
		expect(columns).toEqual(['id']);
	});
});