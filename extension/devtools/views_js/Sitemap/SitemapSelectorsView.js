var SitemapSelectorsView = BaseView.extend({
	events: {
		"click #sitemaps button[action=delete-sitemap]": "deleteSitemap",
		"click #sitemaps tr": "editSitemap"
	},
	initialize: function (options) {
		this.store = options.store;
		this.sitemap = options.sitemap;
		this.setActiveNavigationButton('sitemap-selector-list');
		this.parentSelectors = ['_root'];
		this.parentSelectorId = '_root';
		this.showSitemapSelectorList();
	},
	showSitemapSelectorList: function () {

		var sitemap = this.sitemap;
		var parentSelectors = this.parentSelectors;
		var parentSelectorId = this.parentSelectorId;

		var $selectorListPanel = ich.SelectorList({
			parentSelectors: parentSelectors
		});
		var selectors = sitemap.getDirectChildSelectors(parentSelectorId);
		selectors.forEach(function (selector) {
			var $selector = ich.SelectorListItem(selector);
			$selector.data("selector", selector);
			$selectorListPanel.find("tbody").append($selector);
		});
		this.$el.html($selectorListPanel);
	}
});