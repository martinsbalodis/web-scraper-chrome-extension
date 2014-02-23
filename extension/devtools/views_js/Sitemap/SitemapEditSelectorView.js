var SitemapEditSelectorView = BaseView.extend({
	events: {
		"click #edit-selector button[action=save-selector]": "saveSelector"
	},
	initialize: function (options) {
		console.log(options);
		this.store = options.store;
		this.sitemap = options.sitemap;
		this.selector = options.selector;
		this.setActiveNavigationButton('sitemap-selector-list');
		this.parentSelectors = ['_root'];
		this.parentSelectorId = '_root';
		this.showSitemapSelectorList();
	},
	showSitemapSelectorList: function () {

		var sitemap = this.sitemap;
		var selectorIds = sitemap.getPossibleParentSelectorIds();

		var $editSelectorForm = ich.SelectorEdit({
			selector: this.selector,
			selectorIds: selectorIds,
			selectorTypes: this.selectorTypes
		});
		$("#viewport").html($editSelectorForm);

		// handle selects seperately
		$editSelectorForm.find("[name=type]").val(this.selector.type);
		this.selector.parentSelectors.forEach(function (parentSelectorId) {
			$editSelectorForm.find("#parentSelectors [value='" + parentSelectorId + "']").attr("selected", "selected");
		});
		//this.selectorTypeChanged();
	},
	saveSelector: function (e) {
		var sitemap = this.sitemap;
		var selector = this.selector;
		var newSelector = this.getCurrentlyEditedSelector();

		sitemap.updateSelector(selector, newSelector);

		this.store.saveSitemap(sitemap, function () {
			window.location = "#sitemap/"+this.sitemap._id+"/selectors";
		}.bind(this));
		return false;
	},
	/**
	 * Get selector from selector editing form
	 */
	getCurrentlyEditedSelector: function () {
		var id = $("#edit-selector [name=id]").val();
		var selectorsSelector = $("#edit-selector [name=selector]").val();
		var type = $("#edit-selector [name=type]").val();
		var multiple = $("#edit-selector [name=multiple]").is(":checked");
		var regex = $("#edit-selector [name=regex]").val();
		var parentSelectors = $("#edit-selector [name=parentSelectors]").val();
		var extractAttribute = $("#edit-selector [name=extractAttribute]").val();

		var newSelector = new Selector({
			id: id,
			selector: selectorsSelector,
			type: type,
			multiple: multiple,
			regex: regex,
			extractAttribute:extractAttribute,
			parentSelectors: parentSelectors
		});
		return newSelector;
	},
	selectorTypes: [
		{
			type: 'SelectorText',
			title: 'Text'
		},
		{
			type: 'SelectorLink',
			title: 'Url'
		},
		{
			type: 'SelectorElement',
			title: 'Element'
		},
		{
			type: 'SelectorImage',
			title: 'Image'
		},
		{
			type: 'SelectorGroup',
			title: 'Grouped'
		},
		{
			type: 'SelectorHTML',
			title: 'HTML'
		},
		{
			type: 'SelectorElementAttribute',
			title: 'Element attribute'
		}
	]
});