var SitemapsView = BaseView.extend({
	events: {
		"click #sitemaps button[action=delete-sitemap]": "deleteSitemap",
		"click #sitemaps tr": "editSitemap"
	},
	initialize: function (options) {
		this.store = options.store;
		this.setActiveNavigationButton('create-sitemap-import');
		this.showSitemaps();
	},
	showSitemaps: function () {
		this.setActiveNavigationButton("sitemaps");
		this.store.getAllSitemaps(function (sitemaps) {
			this.sitemaps = sitemaps;
			$sitemapListPanel = ich.SitemapList();
			sitemaps.forEach(function (sitemap) {
				$sitemap = ich.SitemapListItem(sitemap);
				$sitemap.data("sitemap", sitemap);
				$sitemapListPanel.find("tbody").append($sitemap);
			});
			this.$el.html($sitemapListPanel);
		}.bind(this));
	},
	deleteSitemap: function (e) {
		var $button = $(e.currentTarget);
		var sitemapId = $button.data("sitemap-id");
		var sitemap = this.getSitemap(sitemapId);
		this.store.deleteSitemap(sitemap, function () {
			this.showSitemaps();
		}.bind(this));
	},
	/**
	 * Open sitemap in editing mode
	 * @param e
	 */
	editSitemap:function(e) {
		var $button = $(e.currentTarget);
		var sitemapId = $button.data("sitemap-id");
		window.location.hash = "sitemap/"+sitemapId+"/selectors"
	},
	/**
	 * Find sitemap by its id
	 * @param sitemapId
	 * @returns Sitemap
	 */
	getSitemap: function (sitemapId) {
		for (var i = 0; i < this.sitemaps.length; i++) {
			if (this.sitemaps[i]._id == sitemapId) {
				return this.sitemaps[i];
			}
		}
		throw "Cannot find sitemap " + sitemapId;
	}
});