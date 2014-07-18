var SelectorElementClick = {

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

	getClickElements: function(parentElement) {
		// @TODO do we need here _parent_ ?
		var clickElements = $(parentElement).find(this.clickElementSelector);
		return clickElements;
	},

	_getData: function (parentElement) {

		var delay = parseInt(this.delay) || 0;

		// elements that are available before clicking
		var startElements = this.getDataElements(parentElement);

		var clickElements = this.getClickElements(parentElement);

		var deferredResultCalls = [];
		$(clickElements).each(function(i, clickElement) {

			deferredResultCalls.push(function() {

				var deferredResponse = $.Deferred();

				// check whether this element is still available in dom. If its not then there is no data to extract.
				if($(clickElement).closest("html").length === 0) {
					deferredResponse.resolve([]);
					return deferredResponse.promise();
				}

				// click clickElement. executed in browsers scope
				var cs = new CssSelector({
					enableSmartTableSelector: false,
					parent: $("body")[0],
					enableResultStripping:false
				});
				var cssSelector = cs.getCssSelector([clickElement]);

				// this function will catch window.open call and place the requested url as the elements data attribute
				var script   = document.createElement("script");
				script.type  = "text/javascript";
				script.text  = "" +
					"(function(){ " +
						"var el = document.querySelectorAll('"+cssSelector+"')[0]; " +
						"el.click(); " +
					"})();";
				document.body.appendChild(script);

				// sleep for `delay` and the extract elements
				setTimeout(function() {
					var elements = this.getDataElements(parentElement);
					deferredResponse.resolve(elements);
				}.bind(this), delay);
				return deferredResponse.promise();
			}.bind(this));
		}.bind(this));


		var deferredResponse = $.Deferred();
		$.whenCallSequentially(deferredResultCalls).done(function(results) {

			var dataElements = [];

			// elements that we got after clicking
			results.forEach(function(elements) {
				$(elements).each(function(i, element){
					if(dataElements.indexOf(element) === -1) {
						dataElements.push(element);
					}
				});
			});

			// add StartElements
			$(startElements).each(function(i, element){
				if(dataElements.indexOf(element) === -1) {
					dataElements.push(element);
				}
			});

			deferredResponse.resolve(dataElements);
		});
		return deferredResponse.promise();
	},

	getDataColumns: function () {
		return [];
	},

	getFeatures: function () {
		return ['multiple', 'delay', 'clickElementSelector']
	}
};
