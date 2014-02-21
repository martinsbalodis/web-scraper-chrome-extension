var DevtoolsRouter = Backbone.Router.extend({

	routes: {
		"": "index"
	},
	initialize: function(options){
		this.store = options.store;
		this.templateDir = options.templateDir;
	},
	/**
	 * Init old controller
	 */
	index: function () {
		new SitemapController({
			store: this.store,
			templateDir: this.templateDir
		});
	}

});