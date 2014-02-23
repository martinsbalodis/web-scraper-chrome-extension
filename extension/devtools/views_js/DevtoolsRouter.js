var DevtoolsRouter = Backbone.Router.extend({

	routes: {
		"": "index",
		"create-sitemap": "createSitemap",
		"import-sitemap": "importSitemap"
	},
	initialize: function (options) {
		this.store = options.store;
		this.templateDir = options.templateDir;

		new SitemapController({
			store: this.store,
			templateDir: this.templateDir
		});

		// Fixed: hash tags don't work in devtools
		$("body").on("click", "a", function(e){
			var href = $(e.currentTarget).attr("href");
			if(href) {
				window.location.hash = href;
			}
		}.bind(this));
	},
	/**
	 * Init old controller
	 */
	index: function () {

	},
	createSitemap: function () {
		new CreateSitemapView({
			el: $("#viewport"),
			store:this.store
		});
	},
	importSitemap: function () {
		new ImportSitemapView({
			el: $("#viewport"),
			store:this.store
		});
	}

});