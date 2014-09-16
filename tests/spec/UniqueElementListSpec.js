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

		var list = new UniqueElementList('uniqueText');
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

	it("it should add only unique elements when using uniqueHTMLText type", function () {

		$el.html("<a id='1'>a</a><a id='2'>a</a>");

		var list = new UniqueElementList('uniqueHTMLText');
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

	it("it should add only unique elements when using uniqueHTML type", function () {

		$el.html("<a class='1'>a<span>a</span></a><a class='2'>a<span>b</span></a><a class='1'>c<span>c</span></a>");

		var list = new UniqueElementList('uniqueHTML');
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
		list.push($a[2]);
		expect(list.length).toEqual(2);
	});

	it("it should add only unique elements when using uniqueCSSSelector type", function () {

		$el.html("<a></a><a></a>");

		var list = new UniqueElementList('uniqueCSSSelector');
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