describe("Image Selector", function () {

	var $el;

	beforeEach(function () {

		this.addMatchers(selectorMatchers);

		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
	});

	it("should extract single image", function () {

		var selector = new Selector({
			id: 'img',
			type: 'SelectorImage',
			multiple: false,
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
						'img-src': "http://aa/"
					}
				]);
			});
		});
	});

	it("should extract multiple images", function () {

		var selector = new Selector({
			id: 'img',
			type: 'SelectorImage',
			multiple: true,
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
						'img-src': "http://aa/"
					},
					{
						'img-src': "http://bb/"
					}
				]);
			});
		});
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

	it("should be able to download image as base64", function() {

		var deferredImage = SelectorImage.downloadImageBase64("../docs/images/chrome-store-logo.png");

		waitsFor(function() {
			return deferredImage.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			deferredImage.done(function(imageResponse) {
				expect(imageResponse.imageBase64.length > 100).toEqual(true);
			});
		});
	});

	it("should be able to get data with image data attached", function() {

		$el.append('<img src="../docs/images/chrome-store-logo.png">');

		var selector = new Selector({
			id: 'img',
			type: 'SelectorImage',
			multiple: true,
			selector: "img",
			downloadImage: true
		});
		var deferredData = selector.getData($el[0]);

		waitsFor(function() {
			return deferredData.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			deferredData.done(function(data) {
				expect(!!data[0]['_imageBase64-img']).toEqual(true);
				expect(!!data[0]['_imageMimeType-img']).toEqual(true);
			});
		});
	});
});
