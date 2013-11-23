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

		var data = selector.getData($("#selector-group-text"));
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

	it("should extract text urls", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorGroup',
			multiple: false,
			selector: "a"
		});

		var data = selector.getData($("#selector-group-url"));
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

	it("should extract image src", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorGroup',
			multiple: false,
			selector: "img"
		});

		var data = selector.getData($("#selector-group-img"));
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