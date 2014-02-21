describe("SelectorList", function () {

	beforeEach(function () {
		this.addMatchers(selectorMatchers);
	});

	it("should init selectors", function () {

		var selectors = [
			{
				id: 'a',
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['_root']
			}
		];

		var selectorList = new SelectorList(selectors);

		expect(selectorList[0] instanceof Selector).toBe(true);
	});

	it("should be able to create a selector list", function () {

		var selectors = [
			{
				id: 'a',
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['_root']
			}
		];

		var selectorList = new SelectorList(selectors);

		expect(selectorList[0]).toEqual(new Selector(selectors[0]));
	});

	it("should ignore repeating selectors", function () {

		var selectors = [
			{
				id: 'a',
				type: 'SelectorText'
			},
			{
				id: 'a',
				type: 'SelectorText'
			}
		];

		var selectorList = new SelectorList(selectors);

		expect(selectorList.length).toBe(1);
		expect(selectorList[0]).toEqual(new Selector(selectors[0]));
		expect(selectorList[0]).toEqual(new Selector(selectors[1]));
	});

	it("should be able to return all of its selectors", function () {

		var selectors = [
			{
				id: "a",
				type: 'SelectorText'
			},
			{
				id: "b",
				type: 'SelectorText'
			}
		];

		var selectorList = new SelectorList(selectors);

		var foundSelectors = selectorList.getAllSelectors();
		expect(foundSelectors).matchSelectorList(selectors);
	});

	it("should be able to return all child selectors of a parent selector", function () {

		var expectedSelectors = [
			{
				id: "a",
				type: 'SelectorElement',
				parentSelectors: ['_root', 'c']
			},
			{
				id: "b",
				type: 'SelectorElement',
				parentSelectors: ['a']
			},
			{
				id: "c",
				type: 'SelectorElement',
				parentSelectors: ['b']
			}
		];
		var selectors = expectedSelectors.concat([
			{
				id: "d",
				type: 'SelectorElement',
				parentSelectors: ['_root']
			}
		]);

		var selectorList = new SelectorList(selectors);

		var foundSelectors = selectorList.getAllSelectors('a');
		expect(foundSelectors).matchSelectorList(expectedSelectors);
	});

	it("should be able to return direct child selectors of a parent selector", function () {

		var expectedSelectors = [
			{
				id: "b",
				type: 'SelectorElement',
				parentSelectors: ['a']
			},
			{
				id: "c",
				type: 'SelectorElement',
				parentSelectors: ['a']
			}
		];
		var selectors = expectedSelectors.concat([
			{
				id: "a",
				type: 'SelectorElement',
				parentSelectors: ['_root', 'c']
			},
			{
				id: "d",
				type: 'SelectorElement',
				parentSelectors: ['_root']
			}
		]);

		var selectorList = new SelectorList(selectors);

		var foundSelectors = selectorList.getDirectChildSelectors('a');
		expect(foundSelectors).matchSelectorList(expectedSelectors);
	});

	it("should be able to clone itself", function () {
		var selectorList = new SelectorList([
			{
				id: "a",
				type: 'SelectorText'
			}
		]);
		var resultList = selectorList.clone();
		selectorList.pop();
		expect(selectorList.length).toBe(0);
		expect(resultList.length).toBe(1);
	});

	it("should be able to execute concat", function () {
		var selectorList = new SelectorList([
			{
				id: "a",
				type: 'SelectorText'
			}
		]);

		var newList = selectorList.concat([
			{
				id: "b",
				type: "SelectorText"
			}
		]);

		expect(newList.length).toBe(2);
	});

	it("should be able to tell whether selector or its child selectors will return multiple items", function () {
		var selectorList = new SelectorList([
			{
				id: "a",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['_root']
			},
			{
				id: "b",
				type: 'SelectorElement',
				multiple: true,
				parentSelectors: ['a']
			},
			{
				id: "c",
				type: 'SelectorText',
				multiple: true,
				parentSelectors: ['b']
			}
		]);

		expect(selectorList.willReturnMultipleRecords("a")).toBe(true);
	});

	it("should be able to tell whether selector or its child selectors will NOT return multiple items", function () {
		var selectorList = new SelectorList([
			{
				id: "a",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['_root']
			},
			{
				id: "b",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['a']
			},
			{
				id: "c",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['b']
			}
		]);

		expect(selectorList.willReturnMultipleRecords("a")).toBe(false);
	});

	it("should serialize as JSON array", function () {

		var selectorList = new SelectorList([
			{
				id: "a",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['_root']
			}
		]);
		var selectorListJSON = JSON.stringify(selectorList);

		expect(selectorListJSON).toEqual('[{"id":"a","type":"SelectorElement","multiple":false,"parentSelectors":["_root"]}]');
	});

	it("should allow to create list from JSON unserialized selectorList", function () {
		var selectorList = new SelectorList([
			{
				id: "a",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['_root']
			}
		]);
		var selectorListNew = new SelectorList(JSON.parse(JSON.stringify(selectorList)));

		expect(selectorListNew).toEqual(selectorList);
	});

	it("should select child selectors within one page", function () {
		var expectedSelectorList = new SelectorList([
			{
				id: "child1",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['parent2']
			},
			{
				id: "child2",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['parent2']
			},
			{
				id: "child3",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['parent2']
			},
			{
				id: "child4",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['child3']
			},
			{
				id: "child5",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['child4']
			},
			{
				id: "SelectorLink",
				type: 'SelectorLink',
				multiple: false,
				parentSelectors: ['parent2']
			}
		]);

		var selectorList = expectedSelectorList.concat([
			{
				id: "ignoredText",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['SelectorLink']
			},
			{
				id: "ignoredText2",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['SelectorLink']
			},
			{
				id: "ignoredParent",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['_root']
			},
			{
				id: "ignoredParent2",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['parent1']
			}
		]);

		var pageChildSelectors = selectorList.getSinglePageAllChildSelectors("parent2");
		expect(pageChildSelectors).matchSelectorList(expectedSelectorList);
	});

	it("should extract all child selectors and parent within one page", function () {
		var expectedSelectorList = new SelectorList([
			{
				id: "parent1",
				type: 'SelectorElement',
				multiple: true,
				parentSelectors: ['_root']
			},
			{
				id: "parent2",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['parent1']
			},
			{
				id: "child1",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['parent2']
			},
			{
				id: "child2",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['parent2']
			},
			{
				id: "child3",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['parent2']
			},
			{
				id: "child4",
				type: 'SelectorElement',
				multiple: false,
				parentSelectors: ['child3']
			},
			{
				id: "child5",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['child4']
			},
			{
				id: "SelectorLink",
				type: 'SelectorLink',
				multiple: false,
				parentSelectors: ['parent2']
			}
		]);

		var selectorList = expectedSelectorList.concat([
			{
				id: "ignoredText",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['SelectorLink']
			},
			{
				id: "ignoredText2",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['SelectorLink']
			},
			{
				id: "ignoredParent",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['_root']
			},
			{
				id: "ignoredParent2",
				type: 'SelectorText',
				multiple: false,
				parentSelectors: ['parent1']
			}
		]);

		var pageSelectors = selectorList.getOnePageSelectors("parent2");
		expect(pageSelectors).matchSelectorList(expectedSelectorList);
	});
});