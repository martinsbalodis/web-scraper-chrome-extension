var SelectorPopupLink = {
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
	_getData: function (parentElement) {
		var elements = this.getDataElements(parentElement);

		var dfd = $.Deferred();

		// return empty record if not multiple type and no elements found
		if (this.multiple === false && elements.length === 0) {
			var data = {};
			data[this.id] = null;
			dfd.resolve([data]);
			return dfd;
		}

		// extract links one by one
		var deferredDataExtractionCalls = [];
		$(elements).each(function (k, element) {

			deferredDataExtractionCalls.push(function(element) {

				var deferredData = $.Deferred();

				var data = {};
				data[this.id] = $(element).text();
				data._followSelectorId = this.id;

				var deferredPopupURL = this.getPopupURL(element);
				deferredPopupURL.done(function(url) {
					data[this.id + '-href'] = url;
					data._follow = url;
					deferredData.resolve(data);
				}.bind(this));

				return deferredData;
			}.bind(this, element));
		}.bind(this));

		$.whenCallSequentially(deferredDataExtractionCalls).done(function(responses) {
			var result = [];
			responses.forEach(function(dataResult) {
				result.push(dataResult);
			});
			dfd.resolve(result);
		});

		return dfd.promise();
	},

	getElementCSSSelector: function(element) {

		var nthChild, prev;
		for(nthChild = 1, prev = element.previousElementSibling; prev !== null;prev = prev.previousElementSibling, nthChild++);
		var tagName = element.tagName.toLocaleLowerCase();
		var cssSelector = tagName+":nth-child("+nthChild+")";

		while(element.parentElement) {
			element = element.parentElement;
			var tagName = element.tagName.toLocaleLowerCase();
			if(tagName === 'body' || tagName === 'html') {
				cssSelector = tagName+">"+cssSelector;
			}
			else {
				for(nthChild = 1, prev = element.previousElementSibling; prev !== null;prev = prev.previousElementSibling, nthChild++);
				cssSelector = tagName+":nth-child("+nthChild+")>"+cssSelector;
			}
		}

		return cssSelector;
	},

	/**
	 * Gets an url from a window.open call by mocking the window.open function
	 * @param element
	 * @returns $.Deferred()
	 */
	getPopupURL: function(element) {

		// override window.open function. we need to execute this in page scope.
		// we need to know how to find this element from page scope.
		var cssSelector = this.getElementCSSSelector(element);

		// this function will catch window.open call and place the requested url as the elements data attribute
		var script   = document.createElement("script");
		script.type  = "text/javascript";
		script.text  = "" +
			"(function(){ " +
			"var open = window.open; " +
			"var el = document.querySelectorAll('"+cssSelector+"')[0]; " +
			"var openNew = function() { " +
			"var url = arguments[0]; " +
			"el.dataset.webScraperExtractUrl = url; " +
			"window.open = open; " +
			"};" +
			"window.open = openNew; " +
			"el.click(); " +
			"})();";
		document.body.appendChild(script);

		// wait for url to be available
		var deferredURL = $.Deferred();
		var timeout = Math.abs(5000/30); // 5s timeout to generate an url for popup
		var interval = setInterval(function() {
			var url = $(element).data("web-scraper-extract-url");
			if(url) {
				deferredURL.resolve(url);
				clearInterval(interval);
				script.remove();
			}
			// timeout popup opening
			if(timeout-- <= 0) {
				clearInterval(interval);
				script.remove();
			}
		}, 30);

		return deferredURL.promise();
	},

	getDataColumns: function () {
		return [this.id, this.id + '-href'];
	},

	getFeatures: function () {
		return ['multiple', 'delay']
	},

	getItemCSSSelector: function() {
		return "*";
	}
};