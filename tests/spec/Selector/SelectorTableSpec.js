describe("Table Selector", function () {

	beforeEach(function () {

	});

	it("should extract table header columns", function () {
		var selector = new Selector({
			id: 'a',
			type: 'SelectorTable',
			multiple: false,
			selector: "table",
			columns: [
				{
					header: "a",
					name: "a_renamed",
					extract: true
				}
			]
		});

		var $table = $("#selector-table-single-table-single-row table");
		var columns = selector.getTableHeaderColumns($table);
		expect(columns).toEqual({
			a: {
				index: 1
			}
		});
	});

	it("should extract single text record from one table", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorTable',
			multiple: false,
			selector: "table",
			columns: [
				{
					header: "a",
					name: "a_renamed",
					extract: true
				}
			]
		});

		var data = selector.getData($("#selector-table-single-table-single-row"));
		expect(data).toEqual([
			{
				a_renamed: "abc"
			}
		]);
	});

	it("should extract multiple text records from one table", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorTable',
			multiple: false,
			selector: "table",
			columns: [
				{
					header: "a",
					name: "a_renamed",
					extract: true
				},
				{
					header: "b",
					name: "b_renamed",
					extract: true
				}
			]
		});

		var data = selector.getData($("#selector-table-single-table-multiple-rows"));
		expect(data).toEqual([
			{
				a_renamed: "aaa",
				b_renamed: "bbb"
			},
			{
				a_renamed: "ccc",
				b_renamed: "ddd"
			}
		]);
	});

	it("should return data columns based on its configuration", function () {
		var selector = new Selector({
			id: 'a',
			type: 'SelectorTable',
			multiple: false,
			selector: "table",
			columns: [
				{
					header: "a",
					name: "a_renamed",
					extract: true
				},
				{
					header: "b",
					name: "b_renamed",
					extract: true
				},
				{
					header: "c",
					name: "c_renamed",
					extract: false
				}
			]
		});

		var columns = selector.getDataColumns();
		expect(columns).toEqual(['a_renamed', 'b_renamed']);
	});
});