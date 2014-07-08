DataExtractor = function (options) {

	if (options.sitemap instanceof Sitemap) {
		this.sitemap = options.sitemap;
	}
	else {
		this.sitemap = new Sitemap(options.sitemap);
	}

	this.parentSelectorId = options.parentSelectorId;
	this.parentElement = options.parentElement || $("body")[0];
};

DataExtractor.prototype = {

	/**
	 * Returns a list of independent selector lists. follow=true splits selectors in trees.
	 * Two side by side type=multiple selectors split trees.
	 */
	findSelectorTrees: function () {
		return this._findSelectorTrees(this.parentSelectorId, new SelectorList());
	},

	/**
	 * the selector cannot return multiple records and it also cannot create new jobs. Also all of its child selectors
	 * must have the same features
	 * @param selector
	 * @returns {boolean}
	 */
	selectorIsCommonToAllTrees: function (selector) {

		// selectors which return mutiple items cannot be common to all 
		// selectors
		if (selector.willReturnMultipleRecords()) {
			return false;
		}

		// Link selectors which will follow to a new page also cannot be common 
		// to all selectors
		if (selector.canCreateNewJobs()
			&& this.sitemap.getDirectChildSelectors(selector.id) > 0) {
			return false;
		}

		// also all child selectors must have the same features
		var childSelectors = this.sitemap.getAllSelectors(selector.id);
		for (var i in childSelectors) {
			var childSelector = childSelectors[i];
			if (!this.selectorIsCommonToAllTrees(childSelector)) {
				return false;
			}
		}
		return true;
	},

	getSelectorsCommonToAllTrees: function (parentSelectorId) {
		var commonSelectors = [];
		var childSelectors = this.sitemap.getDirectChildSelectors(parentSelectorId);

		childSelectors.forEach(function (childSelector) {

			if (this.selectorIsCommonToAllTrees(childSelector)) {
				commonSelectors.push(childSelector);
				// also add all child selectors which. Child selectors were also checked

				var selectorChildSelectors = this.sitemap.getAllSelectors(childSelector.id);
				selectorChildSelectors.forEach(function (selector) {
					if (commonSelectors.indexOf(selector) === -1) {
						commonSelectors.push(selector);
					}
				});

			}
		}.bind(this));

		return commonSelectors;
	},

	_findSelectorTrees: function (parentSelectorId, commonSelectorsFromParent) {

		var commonSelectors = commonSelectorsFromParent.concat(this.getSelectorsCommonToAllTrees(parentSelectorId));

		// find selectors that will be making a selector tree
		var selectorTrees = [];
		var childSelectors = this.sitemap.getDirectChildSelectors(parentSelectorId);
		childSelectors.forEach(function (selector) {

			if (!this.selectorIsCommonToAllTrees(selector)) {
				// this selector will be making a new selector tree. But this selector might contain some child
				// selectors that are making more trees so here should be a some kind of seperation for that
				if (!selector.canHaveLocalChildSelectors()) {
					var selectorTree = commonSelectors.concat([selector]);
					selectorTrees.push(selectorTree);
				}
				else {
					// find selector tree within this selector
					var commonSelectorsFromParent = commonSelectors.concat([selector]);
					var childSelectorTrees = this._findSelectorTrees(selector.id, commonSelectorsFromParent);
					selectorTrees = selectorTrees.concat(childSelectorTrees);
				}
			}
		}.bind(this));

		// it there were not any selectors that make a separate tree then all common selectors make up a single selector tree
		if (selectorTrees.length === 0) {
			return [commonSelectors];
		}
		else {
			return selectorTrees;
		}
	},

	getSelectorTreeCommonData: function (selectors, parentSelectorId, parentElement) {

		var commonData = {};
		var childSelectors = selectors.getDirectChildSelectors(parentSelectorId);
		childSelectors.forEach(function (selector) {
			if (!selectors.willReturnMultipleRecords(selector.id)) {

				var data = selector.getData(parentElement);

				if (selector.willReturnElements()) {
					var newParentElement = data[0];
					var childCommonData = this.getSelectorTreeCommonData(selectors, selector.id, newParentElement);
					commonData = Object.merge(commonData, childCommonData);
				}
				else {
					commonData = Object.merge(commonData, data[0]);
				}
			}
		}.bind(this));
		return commonData;
	},

	getSelectorTreeData: function (selectors, parentSelectorId, parentElement, commonData) {

		var childSelectors = selectors.getDirectChildSelectors(parentSelectorId);
		var childCommonData = this.getSelectorTreeCommonData(selectors, parentSelectorId, parentElement);
		commonData = Object.merge(commonData, childCommonData);

		var resultData = [];
		// handle multiple result selectors
		childSelectors.forEach(function (selector) {
			if (selectors.willReturnMultipleRecords(selector.id)) {
				var data = selector.getData(parentElement);

				data.forEach(function (record) {
					if (selector.willReturnElements()) {
						var newCommonData = Object.clone(commonData, true);
						var childRecords = this.getSelectorTreeData(selectors, selector.id, record, newCommonData);
						childRecords.forEach(function (childRecord) {
							var rec = new Object();
							Object.merge(rec, childRecord, true);
							resultData.push(rec);
						}.bind(this));
					}
					else {
						Object.merge(record, commonData, true);
						resultData.push(record);
					}
				}.bind(this));
			}
		}.bind(this));

		if (resultData.length === 0) {
			// If there are no multi record groups then return common data.
			// In a case where common data is empty return nothing.
			if(Object.keys(commonData).length === 0) {
				return [];
			}
			else {
				return [commonData];
			}
		}
		else {
			return resultData;
		}
	},

	getData: function () {

		var results = [];
		var selectorTrees = this.findSelectorTrees();
		selectorTrees.forEach(function (selectorTree) {
			var treeData = this.getSelectorTreeData(selectorTree, this.parentSelectorId, this.parentElement, {});
			results = results.concat(treeData);
		}.bind(this));
		return results;
	},

	getSingleSelectorData: function(parentSelectorIds, selectorId) {

		// to fetch only single selectors data we will create a sitemap that only contains this selector, his
		// parents and all child selectors
		var sitemap = this.sitemap;
		var selector = this.sitemap.selectors.getSelector(selectorId);
		var childSelectors = sitemap.selectors.getAllSelectors(selectorId);
		var parentSelectors = [];
		for(var i = parentSelectorIds.length-1;i>=0;i--) {
			var id = parentSelectorIds[i];
			if(id === '_root') break;
			var parentSelector = this.sitemap.selectors.getSelector(id);
			parentSelectors.push(parentSelector);
		}

		// merge all needed selectors together
		var selectors = parentSelectors.concat(childSelectors);
		selectors.push(selector);
		sitemap.selectors = new SelectorList(selectors);

		var parentSelectorId;
		// find the parent that leaded to the page where required selector is being used
		for(var i = parentSelectorIds.length-1;i>=0;i--) {
			var id = parentSelectorIds[i];
			if(id === '_root') {
				parentSelectorId = id;
				break;
			}
			var parentSelector = this.sitemap.selectors.getSelector(parentSelectorIds[i]);
			if(!parentSelector.willReturnElements()) {
				parentSelectorId = id;
				break;
			}
		}
		this.parentSelectorId = parentSelectorId;

		return this.getData();
	}
};
