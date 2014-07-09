describe("Element Attribute Selector", function () {

	beforeEach(function () {

	});

	it("should extract image src tag", function () {

		var selector = new Selector({
			id: 'img',
			type: 'SelectorElementAttribute',
			multiple: false,
			extractAttribute: "src",
			selector: "img"
		});

		var dataDeferred = selector.getData($("#selector-image-one-image"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						'img': "http://aa/"
					}
				]);
			});
		});
	});

	it("should extract multiple src tags", function () {

		var selector = new Selector({
			id: 'img',
			type: 'SelectorElementAttribute',
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
						'img': "http://aa/"
					},
					{
						'img': "http://bb/"
					}
				]);
			});
		});
	});

	it("should return only one data column", function () {
		var selector = new Selector({
			id: 'id',
			type: 'SelectorElementAttribute',
			multiple: true,
			selector: "img"
		});

		var columns = selector.getDataColumns();
		expect(columns).toEqual(['id']);
	});

	it("should return empty array when no images are found", function () {
		var selector = new Selector({
			id: 'img',
			type: 'SelectorElementAttribute',
			multiple: true,
			selector: "img.not-exist",
			extractAttribute: "src"
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
