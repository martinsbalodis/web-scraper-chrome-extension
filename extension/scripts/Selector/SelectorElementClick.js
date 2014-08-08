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
		var clickElements = ElementQuery(this.clickElementSelector, parentElement);
		return clickElements;
	},

	getDataElements: function (parentElement) {

		// special case when you need to select parent selector.
		if(this.selector === this.parentSelectionSelector) {
			return $(parentElement).clone(true);
		}

		var elements = $(this.selector, parentElement).clone(true);
		if (this.multiple) {
			return elements;
		}
		else if (elements.length > 0) {
			return [elements[0]];
		}
		else {
			return [];
		}
	},

	extractElementsAfterClick: function(clickElement, parentElement) {

		var delay = parseInt(this.delay) || 0;

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
	},

	_getData: function (parentElement) {

		var delay = parseInt(this.delay) || 0;

		// elements that are available before clicking
		var startElements = this.getDataElements(parentElement);

		var deferredResultCalls = [];

		// will be clicking all click buttons with unique texts
		var clickedButtons = {};
		var extractElementsAfterUniqueButtonClick = function(button) {

			var buttonText = $(button).text().trim();
			if(!(buttonText in clickedButtons)) {
				clickedButtons[buttonText] = true;

				deferredResultCalls.push(function() {

					// extracts elements
					var deferredElements = this.extractElementsAfterClick(button, parentElement);

					// adds additional buttons to click on
					deferredElements.done(function(elements) {
						// @FIXME limited to recursion stack size
						var clickElements = this.getClickElements(parentElement);
						clickElements.forEach(extractElementsAfterUniqueButtonClick);
					}.bind(this));

					return deferredElements;

				}.bind(this));
			}
		}.bind(this);

		var clickElements = this.getClickElements(parentElement);
		clickElements.forEach(extractElementsAfterUniqueButtonClick);

		var deferredResponse = $.Deferred();
		$.whenCallSequentially(deferredResultCalls).done(function(results) {

			var dataElements = [];

			// elements that we got after clicking
			results.forEach(function(elements) {
				$(elements).each(function(i, element){
					dataElements.push(element);
				});
			});

			// add StartElements
			$(startElements).each(function(i, element){
				dataElements.push(element);
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
