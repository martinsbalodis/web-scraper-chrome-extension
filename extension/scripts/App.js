$(function () {

	// init bootstrap alerts
	$(".alert").alert();

	var store = new StoreDevtools();
	var app = new DevtoolsRouter({
		store: store,
		templateDir: 'views/'
	});
	Backbone.history.start({pushState: false, root: '/'});

});