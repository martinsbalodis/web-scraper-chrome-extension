/**
 * Router for single sitemap
 */
var DevtoolsRouterSitemap = Backbone.Router.extend({

	routes: {
		"sitemap/:sitemapId/selectors": "sitemapSelectors",
		"sitemap/:sitemapId/add-selector": "addSelector"
	},
	initialize: function (options) {
		this.sitemap = options.sitemap;
		this.store = options.store;
	},
	sitemapSelectors: function () {
		new SitemapSelectorsView({
			el: $("#viewport"),
			store: this.store,
			sitemap: this.sitemap
		});
	},
	addSelector: function () {

		var parentSelectorId = "_root";
		//var sitemap = this.state.currentSitemap;

		var selector = new Selector({
			parentSelectors: [parentSelectorId],
			type: 'SelectorText',
			multiple: false
		});

		this._editSelector(selector);
	},
	_editSelector: function (selector) {
		new SitemapEditSelectorView({
			el: $("#viewport"),
			store: this.store,
			sitemap: this.sitemap,
			selector: selector
		});
	}
});