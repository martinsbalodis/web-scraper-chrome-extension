var ContentSelector = function (options) {
	this.sitemap = new Sitemap(options.sitemap);
	this.selectorId = options.selectorId;
	this.selector = this.sitemap.getSelectorById(this.selectorId);
	this.parentSelectorId = this.selector.parentSelectors[0];
	this.parentSelector = this.sitemap.getSelectorById(this.parentSelectorId);

	this.selectedElements = [];
	this.top = 0;

	this.parent = this.getParentElement();

	this.cssSelector = new CssSelector({
		enableSmartTableSelector: true,
		parent: this.parent,
		ignoredClasses: [
			"-sitemap-select-item-selected",
			"-sitemap-select-item-hover",
			"-sitemap-parent"
		],
		query: jQuery
	});
};

ContentSelector.prototype = {

	selectSelector: function (selectionCallback) {
		this.selectionCallback = selectionCallback;
		this.initSelection();
	},

	previewSelector: function () {

		this.highlightParent();
		var $elements = this.selector.getDataElements(this.parent);
		$elements.addClass('-sitemap-select-item-selected');
	},

	initSelection: function () {

		this.highlightParent();

		// all elements except toolbar
		var itemCSSSelector = this.selector.getItemCSSSelector();
		this.$allElements = $(itemCSSSelector+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);

		this.bindElementHighlight();
		this.bindElementSelection();
		this.bindKeyboardSelectionManipulations();
		// @TODO remove toolbar
		this.attachToolbar();
	},

	/**
	 * Returns element in which the selections should occur. Usually its body but in case the parent selector is
	 * SelectorElement then returns an element selected by the parent selector
	 */
	getParentElement: function () {

		var parentSelectors = [];
		var parentSelectorId = this.parentSelectorId;
		while (true) {
			var selector = this.sitemap.getSelectorById(parentSelectorId);
			if (selector && selector.willReturnElements()) {
				parentSelectors.push(selector);
				if (selector.parentSelectors.length === 0) {
					break;
				}
				parentSelectorId = selector.parentSelectors[0];
			}
			else {
				break;
			}
		}

		var parent = $("body")[0];

		// special case for playground
		if(chrome.extension === undefined) {
			parent = $("#webpage")[0];
		}

		for (var i = parentSelectors.length - 1; i >= 0; i--) {
			var selector = parentSelectors[i];
			var $parents = $(parent).find(selector.selector);
			if ($parents.length === 0) {
				return null;
			}
			else {
				parent = $parents[0];
			}
		}

		if (parent === null) {
			alert("Could not find the parent element");
			this.selectionFinished();
			return;
		}

		return parent;
	},

	bindElementSelection: function () {

		this.$allElements.bind("click.elementSelector", function (e) {
			this.selectedElements.push(e.currentTarget);
			this.highlightSelectedElements();

			// Cancel all other events
			return false;
		}.bind(this));
	},

	bindElementHighlight: function () {
		this.$allElements.bind("mouseenter.elementSelector",function () {

			$(this).addClass("-sitemap-select-item-hover");

			var $el = $(this).parent();
			setTimeout(function () {
				// remove highlight from paret elements
				while ($el.parent().length) {
					$el.removeClass("-sitemap-select-item-hover");
					$el = $el.parent();
				}
			}, 1);
			return false;
		}).bind("mouseleave.elementSelector", function () {
				$(this).removeClass("-sitemap-select-item-hover");
			}
		);
	},

	selectChild: function () {
		this.top--;
		if (this.top < 0) {
			this.top = 0;
		}
	},
	selectParent: function () {
		this.top++;
	},

	// User with keyboard arrows can select child or paret elements of selected elements.
	bindKeyboardSelectionManipulations: function () {

		// Using up/down arrows user can select elements from top of the
		// selected element
		$(document).bind("keydown.selectionManipulation", function (event) {

			// up
			if (event.keyCode === 38) {
				this.selectChild();
			}
			// down
			else if (event.keyCode === 40) {
				this.selectParent();
			}

			this.highlightSelectedElements();
		}.bind(this));
	},

	highlightSelectedElements: function () {
		var resultCssSelector = this.cssSelector.getCssSelector(this.selectedElements, this.top);

		$("body #-selector-toolbar .selector").text(resultCssSelector);
		// highlight selected elements
		$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
		$(resultCssSelector, this.parent).addClass('-sitemap-select-item-selected');
	},

	attachToolbar: function () {

		var $toolbar = '<div id="-selector-toolbar">' +
			'<span class="selector">&nbsp;</span>' +
			'<a>Done selecting!</a>' +
			'</div>';
		$("body").append($toolbar);

		$("body #-selector-toolbar a").click(function () {
			this.selectionFinished();
		}.bind(this));
	},
	highlightParent: function () {
		$(this.parent).addClass("-sitemap-parent");
	},

	unbindElementSelection: function () {
		this.$allElements.unbind("click.elementSelector");
		// remove highlighted element classes
		this.unbindElementSelectionHighlight();
	},
	unbindElementSelectionHighlight: function () {
		$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
		$(".-sitemap-parent").removeClass('-sitemap-parent');
	},
	unbindElementHighlight: function () {
		this.$allElements.unbind("mouseenter.elementSelector")
			.unbind("mouseleave.elementSelector");
	},
	unbindKeyboardSelectionMaipulatios: function () {
		$(document).unbind("keydown.selectionManipulation");
	},
	removeToolbar: function () {
		$("body #-selector-toolbar a").unbind("click");
		$("#-selector-toolbar").remove();
	},

	selectionFinished: function () {

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.unbindKeyboardSelectionMaipulatios();
		this.removeToolbar();

		var resultCssSelector = this.cssSelector.getCssSelector(this.selectedElements, this.top);
		this.selectionCallback(resultCssSelector);
	}
};
