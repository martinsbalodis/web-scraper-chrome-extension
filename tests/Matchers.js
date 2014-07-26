var getSelectorIds = function (selectors) {

	var ids = [];
	selectors.forEach(function (selector) {
		ids.push(selector.id);
	});
	return ids;
};

var selectorListSorter = function (a, b) {
	if (a.id === b.id) {
		return 0;
	}
	else if (a.id > b.id) {
		return 1;
	}
	else {
		return -1;
	}
};

var selectorMatchers = {
	matchSelectors: function (expectedIds) {

		expectedIds = expectedIds.sort();
		var actualIds = getSelectorIds(this.actual).sort();

		expect(actualIds).toEqual(expectedIds);
		return true;
	},
	matchSelectorList: function (expectedSelectors) {

		var actualSelectors = this.actual
		if (expectedSelectors.length !== actualSelectors.length) {
			return false;
		}
		expectedSelectors.sort(selectorListSorter);
		actualSelectors.sort(selectorListSorter);

		for (var i in expectedSelectors) {
			if (expectedSelectors[i].id !== actualSelectors[i].id) {
				return false;
			}
		}
		return true;
	},
	// @REFACTOR use match selector list
	matchSelectorTrees: function (expectedSelectorTrees) {
		var actualSelectorTrees = this.actual;

		if (actualSelectorTrees.length !== expectedSelectorTrees.length) {
			return false;
		}

		for (var i in expectedSelectorTrees) {
			expect(actualSelectorTrees[i]).matchSelectors(expectedSelectorTrees[i]);
		}
		return true;
	},
	deferredToEqual: function(expectedData) {

		var deferredData = this.actual;
		var data;

		waitsFor(function() {
			var state = deferredData.state();
			if(state === "resolved") return true;
			if(state === "rejected") {
				expect(state).toEqual("resolved");
				return true;
			}

			return false;
		}, "wait for data extraction", 5000);

		runs(function () {
			deferredData.done(function(d) {
				data = d;
			});
			expect(data).toEqual(expectedData);
		});
		return true;
	},
	deferredToFail: function() {

		var deferredData = this.actual;

		waitsFor(function() {
			var state = deferredData.state();
			if(state === "rejected") return true;
			if(state === "resolved") {
				expect(state).toEqual("rejected");
				return true;
			}

			return false;
		}, "wait for data extraction", 5000);

		return true;
	}
};