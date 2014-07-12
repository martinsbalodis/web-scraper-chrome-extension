describe("Job", function () {

	beforeEach(function () {
		window.chromeAPI.reset();
	});

	it("should be able to create correct url from parent job", function () {

		var parent = new Job("http://example.com/");
		var child = new Job("/test/", null, null, parent);
		expect(child.url).toBe("http://example.com/test/");

		var parent = new Job("http://example.com/asdasdad");
		var child = new Job("tvnet.lv", null, null, parent);
		expect(child.url).toBe("http://tvnet.lv/");

		var parent = new Job("http://example.com/asdasdad");
		var child = new Job("?test", null, null, parent);
		expect(child.url).toBe("http://example.com/asdasdad?test");

		var parent = new Job("http://example.com/1/");
		var child = new Job("2/", null, null, parent);
		expect(child.url).toBe("http://example.com/1/2/");

	});

	it("should be able to create correct url from parent job with slashes after question mark", function () {

		var parent = new Job("http://www.sportstoto.com.my/results_past.asp?date=5/1/1992");
		var child = new Job("popup_past_results.asp?drawNo=418/92", null, null, parent);
		expect(child.url).toBe("http://www.sportstoto.com.my/popup_past_results.asp?drawNo=418/92");
	});
});