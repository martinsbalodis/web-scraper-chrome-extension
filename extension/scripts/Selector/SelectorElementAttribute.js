var SelectorElementAttribute = {
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
	_getData: function (parentElement) {

		var dfd = $.Deferred();

		var elements = this.getDataElements(parentElement);

		var result = [];
		$(elements).each(function (k, element) {
			var data = {};

			data[this.id] = $(element).attr(this.extractAttribute);
			result.push(data);
		}.bind(this));

		if (this.multiple === false && elements.length === 0) {
			var data = {};
			data[this.id + '-src'] = null;
			result.push(data);
		}
		dfd.resolve(result);

		return dfd.promise();
	},

	getDataColumns: function () {
		return [this.id];
	},

	getFeatures: function () {
		return ['multiple', 'extractAttribute', 'delay']
	}
};