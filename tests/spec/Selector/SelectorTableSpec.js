describe("Table Selector", function () {

	var $el;

	beforeEach(function () {

		this.addMatchers(selectorMatchers);

		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
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

		var dataDeferred = selector.getData($("#selector-table-single-table-single-row"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a_renamed: "abc"
					}
				]);
			});
		});
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

		var dataDeferred = selector.getData($("#selector-table-single-table-multiple-rows"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
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
		});
	});

	it("should only extract records from columns which are marked as extract", function () {

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
					extract: false
				}
			]
		});

		var dataDeferred = selector.getData($("#selector-table-single-table-multiple-rows"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a_renamed: "aaa"
					},
					{
						a_renamed: "ccc"
					}
				]);
			});
		});
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

	it("should return thead tr as table header selector for legacy table selectors", function() {

		var selector = new Selector({
			type: 'SelectorTable'
		});

		var headerSelector = selector.getTableHeaderRowSelector();

		expect(headerSelector).toEqual("thead tr");
	});

	it("should return tbody tr as table row selector for legacy table selectors", function() {

		var selector = new Selector({
			type: 'SelectorTable'
		});

		var headerSelector = selector.getTableDataRowSelector();

		expect(headerSelector).toEqual("tbody tr");
	});

	it("should return thead tr while selecting tableHeaderRow when single row available within thead", function() {

		var html = "<table><thead><tr><td>asd</td></tr></thead></table>";
		var tableHeaderRowSelector = SelectorTable.getTableHeaderRowSelectorFromTableHTML(html);
		expect(tableHeaderRowSelector).toEqual("thead tr");
	});

	it("should return thead tr:nth-of-type while selecting tableHeaderRow when multiple rows available within thead", function() {

		var html;

		html = "<table><thead><tr><td>asd</td></tr><tr><td>asd</td></tr></thead></table>";
		var tableHeaderRowSelector = SelectorTable.getTableHeaderRowSelectorFromTableHTML(html);
		expect(tableHeaderRowSelector).toEqual("thead tr:nth-of-type(1)");

		html = "<table><thead><tr><td></td></tr><tr><td>asd</td></tr></thead></table>";
		var tableHeaderRowSelector = SelectorTable.getTableHeaderRowSelectorFromTableHTML(html);
		expect(tableHeaderRowSelector).toEqual("thead tr:nth-of-type(2)");

		html = "<table><thead><tr><td>asd</td></tr><tr><th>asd</th></tr></thead></table>";
		var tableHeaderRowSelector = SelectorTable.getTableHeaderRowSelectorFromTableHTML(html);
		expect(tableHeaderRowSelector).toEqual("thead tr:nth-of-type(1)");

		html = "<table><thead><tr><td></td></tr><tr><th>asd</th></tr></thead></table>";
		var tableHeaderRowSelector = SelectorTable.getTableHeaderRowSelectorFromTableHTML(html);
		expect(tableHeaderRowSelector).toEqual("thead tr:nth-of-type(2)");
	});

	it("should return empty string while selecting tableHeaderRow when no rows with data available", function() {

		var html = "<table><thead><tr><td></td></tr></thead><tr><td></td></tr></table>";
		var tableHeaderRowSelector = SelectorTable.getTableHeaderRowSelectorFromTableHTML(html);
		expect(tableHeaderRowSelector).toEqual("");
	});

	it("should return tbody tr while selecting tableDataRow when thead is available", function() {

		var html = "<table><thead><tr><td>asd</td></tr></thead></table>";
		var tableDataRowSelector = SelectorTable.getTableDataRowSelectorFromTableHTML(html);
		expect(tableDataRowSelector).toEqual("tbody tr");
	});

	it("should return tr:nth-of-type while selecting tableDataRow when thead is not available", function() {

		var html;

		html = "<table><tr><td>asd</td></tr><tr><td>asd</td></tr></table>";
		var tableDataRowSelector = SelectorTable.getTableDataRowSelectorFromTableHTML(html);
		expect(tableDataRowSelector).toEqual("tr:nth-of-type(n+2)");

		html = "<table><tr><td></td></tr><tr><td>asd</td></tr><</table>";
		var tableDataRowSelector = SelectorTable.getTableDataRowSelectorFromTableHTML(html);
		expect(tableDataRowSelector).toEqual("tr:nth-of-type(n+3)");

		html = "<table><tr><td>asd</td></tr><tr><th>asd</th></tr></table>";
		var tableDataRowSelector = SelectorTable.getTableDataRowSelectorFromTableHTML(html);
		expect(tableDataRowSelector).toEqual("tr:nth-of-type(n+2)");

		html = "<table><tr><td></td></tr><tr><th>asd</th></tr></table>";
		var tableDataRowSelector = SelectorTable.getTableDataRowSelectorFromTableHTML(html);
		expect(tableDataRowSelector).toEqual("tr:nth-of-type(n+3)");
	});

	it("should return empty string when selecting tableDataRow with no data rows", function() {

		var html = "<table><thead><tr><td></td></tr></thead><tr><td></td></tr></table>";
		var tableDataRowSelector = SelectorTable.getTableDataRowSelectorFromTableHTML(html);
		expect(tableDataRowSelector).toEqual("");
	});

	it("should get heder columns from html", function(){

		var html = "<table><thead><tr><td>a</td><td>b</td></tr></thead></table>";
		var tableHeaderSelector = "thead tr";
		var headerColumns = SelectorTable.getTableHeaderColumnsFromHTML(tableHeaderSelector, html);

		expect(headerColumns).toEqual([{ header : 'a', name : 'a', extract : true }, { header : 'b', name : 'b', extract : true }]);
	});

	it("should ignore empty columns when getting table header columns", function(){

		var html = "<table><thead><tr><td>a</td><td> </td></tr></thead></table>";
		var tableHeaderSelector = "thead tr";
		var headerColumns = SelectorTable.getTableHeaderColumnsFromHTML(tableHeaderSelector, html);

		expect(headerColumns).toEqual([{ header : 'a', name : 'a', extract : true }]);
	});

	it("should extract data using specified header row", function() {

		var html = "<table>" +
			"<thead>" +
				"<tr><td>a</td><td>b</td></tr>" +
				"<tr><td>c</td><td>d</td></tr>" +
			"</thead>" +
			"<tbody>" +
				"<tr><td>e</td><td>f</td></tr>" +
			"</tbody>" +
			"</table>";

		$el.append(html);

		var selector = new Selector({

			id: 'a',
			type: 'SelectorTable',
			multiple: false,
			selector: "table",
			tableHeaderRowSelector: "thead tr:nth-of-type(2)",
			tableDataRowSelector: "tbody tr",
			columns: [
				{
					header: "c",
					name: "c",
					extract: true
				},
				{
					header: "d",
					name: "d",
					extract: true
				}
			]
		});

		var dataDeferred = selector.getData($el);

		expect(dataDeferred).deferredToEqual([{c:"e",d:"f"}]);
	});

	it("should extract data from specified data rows", function() {

		var html = "<table>" +
			"<thead>" +
			"<tr><td>a</td><td>b</td></tr>" +
			"<tr><td>c</td><td>d</td></tr>" +
			"</thead>" +
			"<tbody>" +
			"<tr><td>e</td><td>f</td></tr>" +
			"<tr><td>g</td><td>h</td></tr>" +
			"</tbody>" +
			"</table>";

		$el.append(html);

		var selector = new Selector({

			id: 'a',
			type: 'SelectorTable',
			multiple: false,
			selector: "table",
			tableHeaderRowSelector: "thead tr:nth-of-type(2)",
			tableDataRowSelector: "tbody tr:nth-of-type(2)",
			columns: [
				{
					header: "c",
					name: "c",
					extract: true
				},
				{
					header: "d",
					name: "d",
					extract: true
				}
			]
		});

		var dataDeferred = selector.getData($el);

		expect(dataDeferred).deferredToEqual([{c:"g",d:"h"}]);
	});

});