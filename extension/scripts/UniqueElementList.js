/**
 * Only Elements with unique text will be added to this array
 * @constructor
 */
UniqueElementList = function() {
	this.addedElements = {};
};

UniqueElementList.prototype = new Array;

UniqueElementList.prototype.push = function(element) {

	if(this.isAdded(element)) {
		return false;
	}
	else {
		var elementTxt = this.getElementText(element);
		this.addedElements[elementTxt] = true;
		Array.prototype.push.call(this, $(element).clone(true)[0]);
		return true;
	}
};

UniqueElementList.prototype.getElementText = function(element) {

	var elementTxt = $(element).text().trim();
	return elementTxt;
};

UniqueElementList.prototype.isAdded = function(element) {

	var elementTxt = this.getElementText(element);
	var isAdded = elementTxt in this.addedElements;
	return isAdded;
};
