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

		var dfd = $.Deferred();

		// cannot reuse this.getDataElements because it depends on *multiple* property
		var elements = $(this.selector, parentElement);

		var records = [];
		$(elements).each(function (k, element) {
			var data = {};

			data[this.id] = $(element).text();

			if(this.extractAttribute) {
				data[this.id+'-'+this.extractAttribute] = $(element).attr(this.extractAttribute);
			}

			records.push(data);
		}.bind(this));

		var result = {};
		result[this.id] = records;

		dfd.resolve([result]);
		return dfd.promise();
	},

	getDataColumns: function () {
		return [this.id];
	},

	getFeatures: function () {
		return ['delay','extractAttribute']
	}
};