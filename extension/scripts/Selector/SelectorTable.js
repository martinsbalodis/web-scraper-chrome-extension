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
		var $headerRow = $table.find("thead tr");
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

		var elements = this.getDataElements(parentElement);

		var result = [];
		$(elements).each(function (k, element) {

			var columns = this.getTableHeaderColumns($(element));

			$(element).find("tbody tr").each(function (i, row) {
				var data = {};
				this.columns.forEach(function (column) {
					if(column.extract === true) {
						if (columns[column.header] === undefined) {
							data[column.name] = null;
						}
						else {
							var rowText = $(row).find("td:nth-child(" + columns[column.header].index + ")").text().trim();
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
		return ['multiple', 'columns', 'delay']
	},

	getItemCSSSelector: function () {
		return "table:has(thead)";
	}
};
