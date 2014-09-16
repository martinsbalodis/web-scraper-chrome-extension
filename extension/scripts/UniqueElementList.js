/**
 * Only Elements unique will be added to this array
 * @constructor
 */
UniqueElementList = function(clickElementUniquenessType) {
	this.clickElementUniquenessType = clickElementUniquenessType;
	this.addedElements = {};
};

UniqueElementList.prototype = new Array;

UniqueElementList.prototype.push = function(element) {

	if(this.isAdded(element)) {
		return false;
	}
	else {
		var elementUniqueId = this.getElementUniqueId(element);
		this.addedElements[elementUniqueId] = true;
		Array.prototype.push.call(this, $(element).clone(true)[0]);
		return true;
	}
};

UniqueElementList.prototype.getElementUniqueId = function(element) {

	if(this.clickElementUniquenessType === 'uniqueText') {
		var elementText = $(element).text().trim();
		return elementText;
	}
	else if(this.clickElementUniquenessType === 'uniqueHTMLText') {

		var elementHTML =  $("<div class='-web-scraper-should-not-be-visible'>").append($(element).eq(0).clone()).html();
		return elementHTML;
	}
	else if(this.clickElementUniquenessType === 'uniqueHTML') {

		// get element without text
		var $element = $(element).eq(0).clone();

		var removeText = function($element) {
			$element.contents()
				.filter(function() {
					if(this.nodeType !== 3) {
						removeText($(this));
					}
					return this.nodeType == 3; //Node.TEXT_NODE
				}).remove();
		};
		removeText($element);

		var elementHTML =  $("<div class='-web-scraper-should-not-be-visible'>").append($element).html();
		return elementHTML;
	}
	else if(this.clickElementUniquenessType === 'uniqueCSSSelector') {
		var cs = new CssSelector({
			enableSmartTableSelector: false,
			parent: $("body")[0],
			enableResultStripping:false
		});
		var CSSSelector = cs.getCssSelector([element]);
		return CSSSelector;
	}
	else {
		throw "Invalid clickElementUniquenessType "+this.clickElementUniquenessType;
	}
};

UniqueElementList.prototype.isAdded = function(element) {

	var elementUniqueId = this.getElementUniqueId(element);
	var isAdded = elementUniqueId in this.addedElements;
	return isAdded;
};
