var SelectorHTML = {

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
	getData: function (parentElement) {
		var elements = this.getDataElements(parentElement);

		var result = [];
		$(elements).each(function (k, element) {
			var data = {};
			var html = $(element).html();

			if (this.regex !== undefined && this.regex.length) {
				var matches = html.match(new RegExp(this.regex));
				if (matches !== null) {
					html = matches[0];
				}
				else {
					html = null;
				}
			}
			data[this.id] = html;

			result.push(data);
		}.bind(this));

		if (this.multiple === false && elements.length === 0) {
			var data = {};
			data[this.id] = null;
			result.push(data);
		}

		return result;
	},

	getDataColumns: function () {
		return [this.id];
	},

	getFeatures: function () {
		return ['multiple', 'regex', 'delay']
	}
};
