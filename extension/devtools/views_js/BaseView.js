var BaseView = Backbone.View.extend({
	setActiveNavigationButton: function (navigationId) {
		$(".nav .active").removeClass("active");
		$("#" + navigationId + "-nav-button").closest("li").addClass("active");

		// @TODO menu highlighting
//		if (navigationId.match(/^sitemap-/)) {
//			$("#sitemap-nav-button").removeClass("disabled");
//			$("#sitemap-nav-button").closest("li").addClass('active');
//			$("#navbar-active-sitemap-id").text("(" + this.state.currentSitemap._id + ")");
//		}
//		else {
//			$("#sitemap-nav-button").addClass("disabled");
//			$("#navbar-active-sitemap-id").text("");
//		}
//
//		if (navigationId.match(/^create-sitemap-/)) {
//			$("#create-sitemap-nav-button").closest("li").addClass('active');
//		}
	}
});