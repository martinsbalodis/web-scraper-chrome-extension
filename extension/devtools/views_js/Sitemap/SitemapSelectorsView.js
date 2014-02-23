var SitemapSelectorsView = BaseView.extend({
	events: {
		"click #sitemaps button[action=delete-sitemap]": "deleteSitemap",
		"click #sitemaps tr": "editSitemap",
		"click #selector-tree tbody tr": "showChildSelectors",
		"click #selector-tree .breadcrumb a": "treeNavigationshowSitemapSelectorList"
	},
	initialize: function (options) {
		this.store = options.store;
		this.sitemap = options.sitemap;
		this.selectorListOpenSelectors = options.selectorListOpenSelectors;
		this.setActiveNavigationButton('sitemap-selector-list');
		this.parentSelectorId = '_root';
		this.showSitemapSelectorList();
	},
	showSitemapSelectorList: function () {

		var sitemap = this.sitemap;
		var parentSelectorId = this.parentSelectorId;

		var $selectorListPanel = ich.SelectorList({
			parentSelectors: this.selectorListOpenSelectors,
			sitemap: sitemap
		});
		var selectors = sitemap.getDirectChildSelectors(parentSelectorId);
		selectors.forEach(function (selector) {
			var $selector = ich.SelectorListItem(selector);
			$selector.data("selector", selector);
			$selectorListPanel.find("tbody").append($selector);
		});
		this.$el.html($selectorListPanel);
	},
	showChildSelectors: function (e) {
		var $tr = $(e.currentTarget);
		var selectorId = $tr.data("selector-id")+"";
		var selector = this.sitemap.getSelectorById(selectorId);
		this.selectorListOpenSelectors.push(selector);
		this.parentSelectorId = selector.id;
		this.showSitemapSelectorList();
	},
	treeNavigationshowSitemapSelectorList: function (e) {
		var button = e.currentTarget;
		$("#selector-tree .breadcrumb li a").each(function (i, parentSelectorButton) {
			if (parentSelectorButton === button) {
				this.selectorListOpenSelectors = this.selectorListOpenSelectors.splice(i + 1);
				this.parentSelectorId = this.selectorListOpenSelectors[i].id;
			}
		}.bind(this));
		this.showSitemapSelectorList();
	}
});