$(function () {

	// init bootstrap alerts
	$(".alert").alert();

	var store = new StoreDevtools();
	new SitemapController({
		store: store,
		templateDir: 'views/'
	});
});