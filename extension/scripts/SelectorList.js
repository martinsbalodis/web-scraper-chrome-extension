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

	for(var i in this) {
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

SelectorList.prototype.getSelectorById = function(selectorId) {
	for(var i in this) {
		var selector = this[i];
		if(selector.id === selectorId) {
			return selector;
		}
	}
}