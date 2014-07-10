describe("Text Selector", function () {

	beforeEach(function () {

	});

	it("should extract single text record", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorText',
			multiple: false,
			selector: "div"
		});

		var dataDeferred = selector.getData($("#selector-text-single-text"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: "a"
					}
				]);
			});
		});
	});

	it("should extract multiple text records", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorText',
			multiple: true,
			selector: "div"
		});

		var dataDeferred = selector.getData($("#selector-text-multiple-text"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: "a"
					},
					{
						a: "b"
					}
				]);
			});
		});
	});

	it("should extract null when there are no elements", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorText',
			multiple: false,
			selector: "div"
		});

		var dataDeferred = selector.getData($("#selector-text-single-not-exist"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: null
					}
				]);
			});
		});
	});

	it("should extract null when there is no regex match", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorText',
			multiple: false,
			selector: "div",
			regex: "wontmatch"
		});

		var dataDeferred = selector.getData($("#selector-text-single-regex"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: null
					}
				]);
			});
		});
	});

	it("should extract text using regex", function () {

		var selector = new Selector({
			id: 'a',
			type: 'SelectorText',
			multiple: false,
			selector: "div",
			regex: "\\d+"
		});

		var dataDeferred = selector.getData($("#selector-text-single-regex"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: '11113123'
					}
				]);
			});
		});
	});

	it("should return only one data column", function () {
		var selector = new Selector({
			id: 'id',
			type: 'SelectorText',
			multiple: true,
			selector: "div"
		});

		var columns = selector.getDataColumns();
		expect(columns).toEqual(['id']);
	});

	it("should ignore script tag content", function(){

		var selector = new Selector({
			id: 'a',
			type: 'SelectorText',
			multiple: false,
			selector: "div"
		});

		var dataDeferred = selector.getData($("#selector-text-ignore-script"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						a: "aaa"
					}
				]);
			});
		});
	});

	it("should replace br tags with newlines", function(){

		var selector = new Selector({
			id: 'p',
			type: 'SelectorText',
			multiple: false,
			selector: "p"
		});

		var dataDeferred = selector.getData($("#selector-text-newlines"));

		waitsFor(function() {
			return dataDeferred.state() === 'resolved';
		}, "wait for data extraction", 5000);

		runs(function () {
			dataDeferred.done(function(data) {
				expect(data).toEqual([
					{
						p: "aaa\naaa\naaa\naaa\naaa"
					}
				]);
			});
		});
	});

//    it("should extract records with url", function () {
//
//        var selector = new Selector({
//            id: 'a',
//            type: 'SelectorText',
//            multiple: true,
//            selector: "a"
//        });
//
//        var data = selector.getData($("#selector-text-url-multiple-text"));
//        expect(data).toEqual([
//            {
//                a: "a",
//                'a-href': "http://aa/"
//            },
//            {
//                a: "b",
//                'a-href': "http://bb/"
//            }
//        ]);
//    });
});