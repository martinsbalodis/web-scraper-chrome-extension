var SelectorTable = {

	canReturnMultipleRecords: function () {
		return true;
	},

	canHaveChildSelectors: function () {
		return false;
	},

	canHaveLocalChildSelectors: function () {
		return false;
	},

	canCreateNewJobs: function () {
		return false;
	},
	willReturnElements: function () {
		return false;
	},
	getTableHeaderColumns: function ($table) {
		var columns = {};
		var headerRowSelector = this.getTableHeaderRowSelector();
		var $headerRow = $table.find(headerRowSelector);
		if ($headerRow.length > 0) {
			$headerRow.find("td,th").each(function (i) {
				var header = $(this).text().trim();
				columns[header] = {
					index: i + 1
				};
			});
		}
		return columns;
	},
	_getData: function (parentElement) {

		var dfd = $.Deferred();

		var tables = this.getDataElements(parentElement);

		var result = [];
		$(tables).each(function (k, table) {

			var columns = this.getTableHeaderColumns($(table));

			var dataRowSelector = this.getTableDataRowSelector();
			$(table).find(dataRowSelector).each(function (i, row) {
				var data = {};
				this.columns.forEach(function (column) {
					if(column.extract === true) {
						if (columns[column.header] === undefined) {
							data[column.name] = null;
						}
						else {
							var rowText = $(row).find(">:nth-child(" + columns[column.header].index + ")").text().trim();
							data[column.name] = rowText;
						}
					}
				});
				result.push(data);
			}.bind(this));
		}.bind(this));

		dfd.resolve(result);
		return dfd.promise();
	},

	getDataColumns: function () {

		var dataColumns = [];
		this.columns.forEach(function (column) {
			if (column.extract === true) {
				dataColumns.push(column.name);
			}
		});
		return dataColumns;
	},

	getFeatures: function () {
		return ['multiple', 'columns', 'delay', 'tableDataRowSelector', 'tableHeaderRowSelector']
	},

	getItemCSSSelector: function () {
		return "table";
	},

	getTableHeaderRowSelectorFromTableHTML: function(html) {

		var $table = $(html);
		if($table.find("thead tr:has(td:not(:empty)), thead tr:has(th:not(:empty))").length) {

			if($table.find("thead tr").length === 1) {
				return "thead tr";
			}
			else {
				var $rows = $table.find("thead tr");
				// first row with data
				var rowIndex = $rows.index($rows.filter(":has(td:not(:empty)),:has(th:not(:empty))")[0]);
				return "thead tr:nth-of-type("+(rowIndex+1)+")";
			}
		}
		else if($table.find("tr td:not(:empty), tr th:not(:empty)").length) {
			var $rows = $table.find("tr");
			// first row with data
			var rowIndex = $rows.index($rows.filter(":has(td:not(:empty)),:has(th:not(:empty))")[0]);
			return  "tr:nth-of-type("+(rowIndex+1)+")";
		}
		else {
			return "";
		}
	},

	getTableDataRowSelectorFromTableHTML: function(html) {

		var $table = $(html);
		if($table.find("thead tr:has(td:not(:empty)), thead tr:has(th:not(:empty))").length) {

			return "tbody tr";
		}
		else if($table.find("tr td:not(:empty), tr th:not(:empty)").length) {
			var $rows = $table.find("tr");
			// first row with data
			var rowIndex = $rows.index($rows.filter(":has(td:not(:empty)),:has(th:not(:empty))")[0]);
			return "tr:nth-of-type(n+"+(rowIndex+2)+")";
		}
		else {
			return "";
		}
	},

	getTableHeaderRowSelector: function() {

		// handle legacy selectors
		if(this.tableHeaderRowSelector === undefined) {
			return "thead tr";
		}
		else {
			return this.tableHeaderRowSelector;
		}
	},

	getTableDataRowSelector: function(){

		// handle legacy selectors
		if(this.tableDataRowSelector === undefined) {
			return "tbody tr";
		}
		else {
			return this.tableDataRowSelector;
		}
	},

	/**
	 * Extract table header column info from html
	 * @param html
	 */
	getTableHeaderColumnsFromHTML: function(headerRowSelector, html) {

		var $table = $(html);
		var $headerRowColumns = $table.find(headerRowSelector).find("td,th");

		var columns = [];

		$headerRowColumns.each(function(i, columnEl) {
			var header = $(columnEl).text().trim();
			var name =  header;
			if(header.length !== 0) {
				columns.push({
					header: header,
					name: name,
					extract: true
				});
			}
		});
		return columns;
	}
};
