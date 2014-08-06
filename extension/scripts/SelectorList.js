var SelectorList = function (selectors) {

	if(selectors === undefined) {
		return;
	}

	for(var i = 0;i<selectors.length;i++) {
		this.push(selectors[i]);
	}
};

SelectorList.prototype = new Array;

SelectorList.prototype.push = function(selector) {

	if(!this.hasSelector(selector.id)) {
		if(!(selector instanceof Selector)) {
			selector = new Selector(selector);
		}
		Array.prototype.push.call(this, selector);
	}
};

SelectorList.prototype.hasSelector = function(selectorId) {

	if(selectorId instanceof Object) {
		selectorId = selectorId.id;
	}

	for (var i = 0; i < this.length; i++) {
		if(this[i].id === selectorId) {
			return true;
		}
	}
	return false;
};

/**
 * Returns all selectors or recursively find and return all child selectors of a parent selector.
 * @param parentSelectorId
 * @returns {Array}
 */
SelectorList.prototype.getAllSelectors = function(parentSelectorId) {

	if(parentSelectorId === undefined) {
		return this;
	}

	var getAllChildSelectors = function(parentSelectorId, resultSelectors) {
		this.forEach(function(selector) {
			if(selector.hasParentSelector(parentSelectorId)) {
				if(resultSelectors.indexOf(selector) === -1) {
					resultSelectors.push(selector);
					getAllChildSelectors(selector.id, resultSelectors);
				}
			}
		}.bind(this));
	}.bind(this);

	var resultSelectors = [];
	getAllChildSelectors(parentSelectorId, resultSelectors);
	return resultSelectors;
};

/**
 * Returns only selectors that are directly under a parent
 * @param parentSelectorId
 * @returns {Array}
 */
SelectorList.prototype.getDirectChildSelectors = function(parentSelectorId) {
	var resultSelectors = new SelectorList();
	this.forEach(function(selector) {
		if(selector.hasParentSelector(parentSelectorId)) {
			resultSelectors.push(selector);
		}
	});
	return resultSelectors;
};

SelectorList.prototype.clone = function() {
	var resultList = new SelectorList();
	this.forEach(function(selector){
		resultList.push(selector);
	});
	return resultList;
};

SelectorList.prototype.fullClone = function() {
	var resultList = new SelectorList();
	this.forEach(function(selector){
		resultList.push(JSON.parse(JSON.stringify(selector)));
	});
	return resultList;
};

SelectorList.prototype.concat = function() {
	var resultList = this.clone();
	for(var i in arguments) {
		arguments[i].forEach(function(selector) {
			resultList.push(selector);
		}.bind(this));
	}
	return resultList;
};

SelectorList.prototype.getSelector = function(selectorId) {
	for (var i = 0; i < this.length; i++) {
		var selector = this[i];
		if (selector.id === selectorId) {
			return selector;
		}
	}
};

/**
 * Returns all selectors if this selectors including all parent selectors within this page
 * @TODO not used any more.
 * @param selectorId
 * @returns {*}
 */
SelectorList.prototype.getOnePageSelectors = function (selectorId) {
	var resultList = new SelectorList();
	var selector = this.getSelector(selectorId);
	resultList.push(this.getSelector(selectorId));

	// recursively find all parent selectors that could lead to the page where selectorId is used.
	var findParentSelectors = function(selector) {

		selector.parentSelectors.forEach(function(parentSelectorId) {

			if(parentSelectorId === "_root") return;
			var parentSelector = this.getSelector(parentSelectorId);
			if(resultList.indexOf(parentSelector) !== -1) return;
			if(parentSelector.willReturnElements()) {
				resultList.push(parentSelector);
				findParentSelectors(parentSelector);
			}
		}.bind(this));
	}.bind(this);

	findParentSelectors(selector);

	// add all child selectors
	resultList = resultList.concat(this.getSinglePageAllChildSelectors(selector.id));
	return resultList;
};

/**
 * Returns all child selectors of a selector which can be used within one page.
 * @param parentSelectorId
 */
SelectorList.prototype.getSinglePageAllChildSelectors = function(parentSelectorId) {

	var resultList = new SelectorList();
	var addChildSelectors = function(parentSelector) {
		if(parentSelector.willReturnElements()) {
			var childSelectors = this.getDirectChildSelectors(parentSelector.id);
			childSelectors.forEach(function (childSelector) {
				if(resultList.indexOf(childSelector) === -1) {
					resultList.push(childSelector);
					addChildSelectors(childSelector);
				}
			}.bind(this));
		}
	}.bind(this);

	var parentSelector = this.getSelector(parentSelectorId);
	addChildSelectors(parentSelector);
	return resultList;
};

SelectorList.prototype.willReturnMultipleRecords = function(selectorId) {
	
	// handle reuqested selector
	var selector = this.getSelector(selectorId);
	if(selector.willReturnMultipleRecords() === true) {
		return true;
	}
	
	// handle all its child selectors
	var childSelectors = this.getAllSelectors(selectorId);
	for (var i = 0; i < childSelectors.length; i++) {
		var selector = childSelectors[i];
		if (selector.willReturnMultipleRecords() === true) {
			return true;
		}
	}
	
	return false;
};

/**
 * When serializing to JSON convert to an array
 * @returns {Array}
 */
SelectorList.prototype.toJSON = function() {
	var result = [];
	this.forEach(function(selector) {
		result.push(selector);
	});
	return result;
};

SelectorList.prototype.getSelectorById = function (selectorId) {
	for (var i = 0; i < this.length; i++) {
		var selector = this[i];
		if (selector.id === selectorId) {
			return selector;
		}
	}
};

/**
 * returns css selector for a given element. css selector includes all parent element selectors
 * @param selectorId
 * @param parentSelectorIds array of parent selector ids from devtools Breadcumb
 * @returns string
 */
SelectorList.prototype.getCSSSelectorWithinOnePage = function (selectorId, parentSelectorIds) {

	var CSSSelector = this.getSelector(selectorId).selector;
	var parentCSSSelector = this.getParentCSSSelectorWithinOnePage(parentSelectorIds);
	CSSSelector = parentCSSSelector+CSSSelector;

	return CSSSelector;
};

/**
 * returns css selector for parent selectors that are within one page
 * @param parentSelectorIds array of parent selector ids from devtools Breadcumb
 * @returns string
 */
SelectorList.prototype.getParentCSSSelectorWithinOnePage = function (parentSelectorIds) {

	var CSSSelector = "";

	for (var i = parentSelectorIds.length-1; i > 0; i--) {

		var parentSelectorId = parentSelectorIds[i];
		var parentSelector = this.getSelector(parentSelectorId);
		if(parentSelector.willReturnElements()) {
			CSSSelector = parentSelector.selector + " " + CSSSelector;
		}
		else {
			break;
		}
	}

	return CSSSelector;
};

SelectorList.prototype.hasRecursiveElementSelectors = function() {

	var RecursionFound = false;

	this.forEach(function(topSelector) {
		var visitedSelectors = [];

		var checkRecursion = function(parentSelector) {

			// already visited
			if(visitedSelectors.indexOf(parentSelector) !== -1) {
				RecursionFound = true;
				return;
			}

			if(parentSelector.willReturnElements()) {
				visitedSelectors.push(parentSelector);
				var childSelectors = this.getDirectChildSelectors(parentSelector.id);
				childSelectors.forEach(checkRecursion);
				visitedSelectors.pop();
			}
		}.bind(this);

		checkRecursion(topSelector);

	}.bind(this));

	return RecursionFound;
};

