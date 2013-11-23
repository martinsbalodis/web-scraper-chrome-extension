describe("Link Selector", function () {

	beforeEach(function () {

	});

	it("should extract single link", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorLink',
			multiple: false,
			selector: "a"
		});

		var data = selector.getData($("#selector-follow"));
		expect(data).toEqual([
			{
				a: "a",
				'a-href': "http://example.com/a",
				_follow: "http://example.com/a",
				_followSelectorId: "a"
			}
		]);
	});

	it("should extract multiple links", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorLink',
			multiple: true,
			selector: "a"
		});

		var data = selector.getData($("#selector-follow"));
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

		var data = selector.getData($("#not-exist"));
		expect(data).toEqual([]);
	});
});
