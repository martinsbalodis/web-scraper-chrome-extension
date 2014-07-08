var SelectorElement = {

	canReturnMultipleRecords: function () {
		return true;
	},

	canHaveChildSelectors: function () {
		return true;
	},

	canHaveLocalChildSelectors: function () {
		return true;
	},

	canCreateNewJobs: function () {
		return false;
	},
	willReturnElements: function () {
		return true;
	},

	getData: function (parentElement) {
		var elements = this.getDataElements(parentElement);
		return jQuery.makeArray(elements);
	},

	getDataColumns: function () {
		return [];
	},

	getFeatures: function () {
		return ['multiple', 'delay']
	}
};
