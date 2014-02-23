var ImportSitemapView = BaseView.extend({
	events: {
		"click #submit-import-sitemap": "importSitemap"
	},
	initialize: function(options) {
		this.store = options.store;
		this.setActiveNavigationButton('create-sitemap-import');
		var sitemapForm = ich.SitemapImport();
		this.$el.html(sitemapForm);
	},
	importSitemap: function () {
		var sitemapJSON = $("[name=sitemapJSON]").val();
		var sitemap = new Sitemap();
		sitemap.importSitemap(sitemapJSON);
		this.store.createSitemap(sitemap, function (sitemap) {
			// @TODO change url to sitemap editing
		}.bind(this, sitemap));
		return false;
	}
});