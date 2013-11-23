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
	}
};