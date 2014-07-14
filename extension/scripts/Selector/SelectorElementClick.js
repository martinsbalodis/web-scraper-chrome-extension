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

	_getData: function (parentElement) {

		var delay = parseInt(this.delay) || 0;

		// elements that are available before clicking
		var startElements = this.getDataElements(parentElement);

		// @TODO do we need here _parent_ ?
		var clickElements = $(parent).find(this.clickElementSelector);

		var deferredResultCalls = [];
		$(clickElements).each(function(clickElement) {

			deferredResultCalls.push(function() {

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
						"el.onclick(); " +
					"})();";
				document.body.appendChild(script);

				// sleep for `delay` and the extract elements
				var deferredResponse = $.Deferred();
				setTimeout(function() {
					var elements = this.getDataElements(parentElement);
					deferredResponse.resolve(elements);
				}.bind(this), delay);
				return deferredResponse.promise();
			}.bind(this));
		}.bind(this));


		var deferredResponse = $.Deferred();
		$.whenCallSequentially.apply(this, deferredResultCalls).done(function(results) {

			var dataElements = [];

			// elements that we got after clicking
			results.forEach(function(args) {
				$(args[0]).each(function(i, element){
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
		return ['multiple', 'delay']
	}
};
