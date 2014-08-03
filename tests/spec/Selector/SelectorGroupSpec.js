describe("Group Selector", function () {

	beforeEach(function () {

	});

	it("should extract text data", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorGroup',
			multiple: false,
			selector: "div"
		});

		var dataDeferred = selector.getData($("#selector-group-text"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: [
							{
								a: "a"
							},
							{
								a: "b"
							}
						]
					}
				]);
			});
		});
	});

	it("should extract text urls", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorGroup',
			multiple: false,
			selector: "a"
		});

		var dataDeferred = selector.getData($("#selector-group-url"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: [
							{
								a: "a",
								'a-href': "http://aa/"
							},
							{
								a: "b",
								'a-href': "http://bb/"
							}
						]
					}
				]);
			});
		});
	});

	it("should extract image src", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorGroup',
			multiple: false,
			selector: "img"
		});

		var dataDeferred = selector.getData($("#selector-group-img"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: [
							{
								'a-src': "http://aa/"
							},
							{
								'a-src': "http://bb/"
							}
						]
					}
				]);
			});
		});
	});

	it("should extract multiple src attributes", function () {

		var selector = new Selector({
			id: 'img',
			type: 'SelectorGroup',
			multiple: true,
			extractAttribute: "src",
			selector: "img"
		});

		var dataDeferred = selector.getData($("#selector-image-multiple-images"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						img: [
							{
								'img-src': "http://aa/"
							},
							{
								'img-src': "http://bb/"
							}
						]
					}
				]);
			});
		});
	});

	it("should return only one data column", function () {
		var selector = new Selector({
			id: 'id',
			type: 'SelectorGroup',
			multiple: true,
			selector: "div"
		});

		var columns = selector.getDataColumns();
		expect(columns).toEqual(['id']);
	});
});