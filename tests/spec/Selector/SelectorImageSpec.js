describe("Image Selector", function () {

	beforeEach(function () {

	});

	it("should extract single image", function () {

		var selector = new Selector({
			id: 'img',
			type: 'SelectorImage',
			multiple: false,
			selector: "img"
		});

		var data = selector.getData($("#selector-image-one-image"));
		expect(data).toEqual([
			{
				'img-src': "http://aa/"
			}
		]);
	});

	it("should extract multiple images", function () {

		var selector = new Selector({
			id: 'img',
			type: 'SelectorImage',
			multiple: true,
			selector: "img"
		});

		var data = selector.getData($("#selector-image-multiple-images"));
		expect(data).toEqual([
			{
				'img-src': "http://aa/"
			},
			{
				'img-src': "http://bb/"
			}
		]);
	});

	it("should return only src column", function () {
		var selector = new Selector({
			id: 'id',
			type: 'SelectorImage',
			multiple: true,
			selector: "img"
		});

		var columns = selector.getDataColumns();
		expect(columns).toEqual(['id-src']);
	});

	it("should return empty array when no images are found", function () {
		var selector = new Selector({
			id: 'img',
			type: 'SelectorImage',
			multiple: true,
			selector: "img.not-exist"
		});

		var data = selector.getData($("#not-exist"));
		expect(data).toEqual([]);
	});
});
