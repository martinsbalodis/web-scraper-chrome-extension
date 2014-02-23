/**
 * Router for single sitemap
 */
var DevtoolsRouterSitemap = Backbone.Router.extend({

	routes: {
		"sitemap/:sitemapId/selectors": "selectorList",
		"sitemap/:sitemapId/add-selector": "addSelector"
	},
	initialize: function (options) {
		this.sitemap = options.sitemap;
		this.store = options.store;
		this.selectorListOpenSelectors = [{
			id:'_root'
		}];
	},
	selectorList: function () {
		if(this.selectorListView === undefined) {
			this.selectorListView = new SitemapSelectorsView({
				el: $("#viewport"),
				store: this.store,
				sitemap: this.sitemap,
				selectorListOpenSelectors: this.selectorListOpenSelectors
			});
		}
		this.selectorListView.render();
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