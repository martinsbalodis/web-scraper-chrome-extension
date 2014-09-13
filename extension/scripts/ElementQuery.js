/**
 * Element selector. Uses jQuery as base and adds some more features
 * @param parentElement
 * @param selector
 */
ElementQuery = function(CSSSelector, parentElement) {

	CSSSelector = CSSSelector || "";

	var selectedElements = [];

	var addElement = function(element) {
		if(selectedElements.indexOf(element) === -1) {
			selectedElements.push(element);
		}
	};

	var selectorParts = ElementQuery.getSelectorParts(CSSSelector);
	selectorParts.forEach(function(selector) {

		// handle special case when parent is selected
		if(selector === "_parent_") {
			$(parentElement).each(function(i, element){
				addElement(element);
			});
		}
		else {
			var elements = $(selector, parentElement);
			elements.each(function(i, element) {
				addElement(element);
			});
		}
	});

	return selectedElements;
};

ElementQuery.getSelectorParts = function(CSSSelector) {

	var selectors = CSSSelector.split(/(,|".*?"|'.*?'|\(.*?\))/);

	var resultSelectors = [];
	var currentSelector = "";
	selectors.forEach(function(selector) {
		if(selector === ',') {
			if(currentSelector.trim().length) {
				resultSelectors.push(currentSelector.trim());
			}
			currentSelector = "";
		}
		else {
			currentSelector += selector;
		}
	});
	if(currentSelector.trim().length) {
		resultSelectors.push(currentSelector.trim());
	}
	
	return resultSelectors;
};
