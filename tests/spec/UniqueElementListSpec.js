describe("UniqueElementList", function () {
	var $el;

	beforeEach(function () {

		$el = jQuery("#tests").html("");
		if($el.length === 0) {
			$el = $("<div id='tests' style='display:none'></div>").appendTo("body");
		}
	});

	it("it should add only unique elements", function () {

		$el.html("<a>1</a><a>2</a>");

		var list = new UniqueElementList();
		expect(list.length).toEqual(0);

		var $a = $el.find("a");
		list.push($a[0]);
		expect(list.length).toEqual(1);
		list.push($a[0]);
		expect(list.length).toEqual(1);
		list.push($a[1]);
		expect(list.length).toEqual(2);
		list.push($a[1]);
		expect(list.length).toEqual(2);
	});
});