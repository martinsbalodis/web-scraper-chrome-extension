/**
 * Router for single sitemap
 */
var DevtoolsRouterSitemap = Backbone.Router.extend({

	routes: {
		"sitemap/:sitemapId/selectors": "sitemapSelectors"
	},
	initialize: function (path, sitemap) {
		this.sitemap = sitemap;
	},
	sitemapSelectors: function() {
		new SitemapSelectorsView({
			el: $("#viewport"),
			store:this.store,
			sitemap:this.sitemap
		});
	}
});