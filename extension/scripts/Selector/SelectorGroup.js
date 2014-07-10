var SelectorGroup = {

	canReturnMultipleRecords: function () {
		return false;
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
		// cannot reuse this.getDataElements because it depends on *multiple* property
		var elements = $(this.selector, parentElement);

		var records = [];
		$(elements).each(function (k, element) {
			var data = {};

			if (element.src) {
				data[this.id + '-src'] = element.src;
			}
			else {
				data[this.id] = $(element).text();

				if (element.href) {
					data[this.id + '-href'] = element.href;
				}
			}
			records.push(data);
		}.bind(this));

		var result = {};
		result[this.id] = records;
		return [result];
	},

	getDataColumns: function () {
		return [this.id];
	},

	getFeatures: function () {
		return ['delay']
	}
};