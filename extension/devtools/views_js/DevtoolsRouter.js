var DevtoolsRouter = Backbone.Router.extend({

	routes: {
		"": "index",
		"create-sitemap": "createSitemap"
	},
	initialize: function (options) {
		this.store = options.store;
		this.templateDir = options.templateDir;

		new SitemapController({
			store: this.store,
			templateDir: this.templateDir
		});
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
	}

});