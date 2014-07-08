var SelectorLink = {
	canReturnMultipleRecords: function () {
		return true;
	},

	canHaveChildSelectors: function () {
		return true;
	},

	canHaveLocalChildSelectors: function () {
		return false;
	},

	canCreateNewJobs: function () {
		return true;
	},
	willReturnElements: function () {
		return false;
	},
	getData: function (parentElement) {
		var elements = this.getDataElements(parentElement);

		var result = [];
		$(elements).each(function (k, element) {
			var data = {};

			data[this.id] = $(element).text();
			data[this.id + '-href'] = element.href;
			data._follow = element.href;
			data._followSelectorId = this.id;

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
		return [this.id, this.id + '-href'];
	},

	getFeatures: function () {
		return ['multiple', 'delay']
	},

	getItemCSSSelector: function() {
		return "a";
	}
};