describe("Element Selector", function () {

	beforeEach(function () {

	});

	it("should return one element", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorElement',
			multiple: false,
			selector: "div"
		});

		var data = selector.getData($("#selector-element-nodata"));
		expect(data).toEqual([$("#selector-element-nodata div")[0]]);
	});

	it("should return multiple elements", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorElement',
			multiple: true,
			selector: "div"
		});

		var data = selector.getData($("#selector-element-nodata"));
		expect(data).toEqual([$("#selector-element-nodata div")[0], $("#selector-element-nodata div")[1]]);
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