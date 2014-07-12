var SelectorText = {

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

			// remove script, style tag contents from text results
			var $element_clone = $(element).clone();
			$element_clone.find("script, style").remove();
			// <br> replace br tags with newlines
			$element_clone.find("br").after("\n");

			var text = $element_clone.text();
			if (this.regex !== undefined && this.regex.length) {
				var matches = text.match(new RegExp(this.regex));
				if (matches !== null) {
					text = matches[0];
				}
				else {
					text = null;
				}
			}
			data[this.id] = text;

			result.push(data);
		}.bind(this));

		if (this.multiple === false && elements.length === 0) {
			var data = {};
			data[this.id] = null;
			result.push(data);
		}

		dfd.resolve(result);
		return dfd.promise();
	},

	getDataColumns: function () {
		return [this.id];
	},

	getFeatures: function () {
		return ['multiple', 'regex', 'delay']
	}
};
