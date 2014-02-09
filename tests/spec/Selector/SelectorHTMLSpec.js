describe("HTML Selector", function () {

	beforeEach(function () {

	});

	it("should extract single text record", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorHTML',
			multiple: false,
			selector: "div"
		});

		var data = selector.getData($("#selector-html-single-html"));
		expect(data).toEqual([
			{
				a: "aaa<b>bbb</b>ccc"
			}
		]);
	});

	it("should extract multiple text records", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorHTML',
			multiple: true,
			selector: "div"
		});

		var data = selector.getData($("#selector-html-multiple-html"));
		expect(data).toEqual([
			{
				a: "aaa<b>bbb</b>ccc"
			},
			{
				a: "ddd<b>eee</b>fff"
			}
		]);
	});

	it("should extract null when there are no elements", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorHTML',
			multiple: false,
			selector: "div"
		});

		var data = selector.getData($("#selector-html-single-not-exist"));
		expect(data).toEqual([
			{
				a: null
			}
		]);
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