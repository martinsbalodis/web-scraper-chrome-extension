var CreateSitemapView = BaseView.extend({
	events: {
		"click #submit-create-sitemap": "createSitemap"
	},
	initialize: function(options) {
		this.store = options.store;
		this.setActiveNavigationButton('create-sitemap-create');
		var sitemapForm = ich.SitemapCreate();
		this.$el.html(sitemapForm);
		this.initMultipleStartUrlHelper();
	},
	/**
	 * Simple info popup for sitemap start url input field
	 */
	initMultipleStartUrlHelper: function () {
		$("#startUrl")
			.popover({
				title: 'Multiple start urls',
				html: true,
				content: "You can create ranged start urls like this:<br />http://example.com/[1-100].html",
				placement: 'bottom'
			})
			.blur(function () {
				$(this).popover('hide');
			});
	},
	getFormSitemap: function(){
		var id = $("#create-sitemap input[name=_id]").val();
		var startUrl = $("#create-sitemap input[name=startUrl]").val();
		var sitemap = new Sitemap({
			_id: id,
			startUrl: startUrl,
			selectors: []
		});
		return sitemap;
	},
	createSitemap: function (e) {
		var sitemap = this.getFormSitemap();
		this.store.createSitemap(sitemap, function (sitemap) {
			// @TODO change url to sitemap editing
		}.bind(this, sitemap));
		return false;
	}
});