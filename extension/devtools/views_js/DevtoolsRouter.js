var DevtoolsRouter = Backbone.Router.extend({

	routes: {
		"": "index",
		"create-sitemap": "createSitemap",
		"import-sitemap": "importSitemap",
		"sitemaps": "sitemaps"
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
		this.loadTemplates();
		// render main viewport
		ich.Viewport().appendTo("body");
	},
	/**
	 * Loads templates for ICanHaz
	 */
	loadTemplates: function () {
		var templateIds = [
			'Viewport',
			'SitemapList',
			'SitemapListItem',
			'SitemapCreate',
			'SitemapImport',
			'SitemapExport',
			'SitemapBrowseData',
			'SitemapExportDataCSV',
			'SitemapEditMetadata',
			'SelectorList',
			'SelectorListItem',
			'SelectorEdit',
			'SitemapSelectorGraph',
			'DataPreview'
		];
		var cbLoaded = function (templateId, template) {
			ich.addTemplate(templateId, template);
		}

		templateIds.forEach(function (templateId) {
			jQuery.ajax({
				url:this.templateDir + templateId + '.html',
				success: cbLoaded.bind(this, templateId),
				async: false
			});
		}.bind(this));
	},
	/**
	 * Init old controller
	 */
	index: function () {
		this.sitemaps();
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
	},
	sitemaps: function() {
		new SitemapsView({
			el: $("#viewport"),
			store:this.store
		});
	}
});