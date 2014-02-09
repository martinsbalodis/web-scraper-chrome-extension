var SitemapController = function (options) {

	for (var i in options) {
		this[i] = options[i];
	}
	this.init();
};

SitemapController.prototype = {

	control: function (controls) {
		var controller = this;

		for (var selector in controls) {
			for (var event in controls[selector]) {
				$(document).on(event, selector, (function (selector, event) {
					return function () {
						var continueBubbling = controls[selector][event].call(controller, this);
						if (continueBubbling !== true) {
							return false;
						}
					}
				})(selector, event));
			}
		}
	},

	/**
	 * Loads templates for ICanHaz
	 */
	loadTemplates: function (cbAllTemplatesLoaded) {
		var templateIds = [
			'Viewport',
			'SitemapList',
			'SitemapListItem',
			'SitemapCreate',
			'SitemapImport',
			'SitemapExport',
			'SitemapBrowseData',
			'SitemapExportDataCSV',
			'SitemapEditMetadata',
			'SelectorList',
			'SelectorListItem',
			'SelectorEdit',
			'SitemapSelectorGraph'
		];
		var templatesLoaded = 0;
		var cbLoaded = function (templateId, template) {
			templatesLoaded++;
			ich.addTemplate(templateId, template);
			if (templatesLoaded === templateIds.length) {
				cbAllTemplatesLoaded();
			}
		}

		templateIds.forEach(function (templateId) {
			$.get(this.templateDir + templateId + '.html', cbLoaded.bind(this, templateId));
		}.bind(this));
	},

	init: function () {

		this.loadTemplates(function () {
			// currently viewed objects
			this.clearState();

			// render main viewport
			ich.Viewport().appendTo("body");

			// cancel all form submits
			$("form").bind("submit", function () {
				return false;
			});

			this.control({
				'#sitemaps-nav-button': {
					click: this.showSitemaps
				},
				'#create-sitemap-create-nav-button': {
					click: this.showCreateSitemap
				},
				'#create-sitemap-import-nav-button': {
					click: this.showImportSitemapPanel
				},
				'#sitemap-export-nav-button': {
					click: this.showSitemapExportPanel
				},
				'#sitemap-export-data-csv-nav-button': {
					click: this.showSitemapExportDataCsvPanel
				},
				'#submit-create-sitemap': {
					click: this.createSitemap
				},
				'#submit-import-sitemap': {
					click: this.importSitemap
				},
				'#sitemap-edit-metadata-nav-button': {
					click: this.editSitemapMetadata
				},
				'#sitemap-selector-list-nav-button': {
					click: this.showSitemapSelectorList
				},
				'#sitemap-selector-graph-nav-button': {
					click: this.showSitemapSelectorGraph
				},
				'#sitemap-browse-nav-button': {
					click: this.browseSitemapData
				},
				'button#submit-edit-sitemap': {
					click: this.editSitemapMetadataSave
				},
				'#sitemaps tr': {
					click: this.editSitemap
				},
				'#sitemaps button[action=delete-sitemap]': {
					click: this.deleteSitemap
				},
				'#sitemap-scrape-nav-button': {
					click: this.scrapeSitemap
				},
				"#sitemaps button[action=browse-sitemap-data]": {
					click: this.sitemapListBrowseSitemapData
				},
				'#sitemaps button[action=csv-download-sitemap-data]': {
					click: this.downloadSitemapData
				},
				// @TODO move to tr
				'#selector-tree tbody tr': {
					click: this.showChildSelectors
				},
				'#selector-tree .breadcrumb a': {
					click: this.treeNavigationshowSitemapSelectorList
				},
				'#selector-tree tr button[action=edit-selector]': {
					click: this.editSelector
				},
				'#edit-selector select[name=type]': {
					change: this.selectorTypeChanged
				},
				'#edit-selector button[action=save-selector]': {
					click: this.saveSelector
				},
				'#edit-selector button[action=cancel-selector-editing]': {
					click: this.cancelSelectorEditing
				},
				'#selector-tree button[action=add-selector]': {
					click: this.addSelector
				},
				"#selector-tree tr button[action=delete-selector]": {
					click: this.deleteSelector
				},
				"#selector-tree tr button[action=preview-selector]": {
					click: this.previewSelectorFromSelectorTree
				},
				"#edit-selector button[action=select-selector]": {
					click: this.selectSelector
				},
				"#edit-selector button[action=select-selector-parent]": {
					click: this.selectSelectorParent
				},
				"#edit-selector button[action=select-selector-child]": {
					click: this.selectSelectorChild
				},
				"#edit-selector button[action=preview-selector]": {
					click: this.previewSelector
				}
			});
			this.showSitemaps();
		}.bind(this));
	},

	clearState: function () {
		this.state = {
			// sitemap that is currently open
			currentSitemap: null,
			// selector ids that are shown in the navigation
			editSitemapBreadcumbsSelectors: null,
			currentParentSelectorId: null,
			currentSelector: null
		};
	},

	setStateEditSitemap: function (sitemap) {
		this.state.currentSitemap = sitemap;
		this.state.editSitemapBreadcumbsSelectors = [
			{id: '_root'}
		];
		this.state.currentParentSelectorId = '_root';
	},

	setActiveNavigationButton: function (navigationId) {
		$(".nav .active").removeClass("active");
		$("#" + navigationId + "-nav-button").closest("li").addClass("active");

		if (navigationId.match(/^sitemap-/)) {
			$("#sitemap-nav-button").removeClass("disabled");
			$("#sitemap-nav-button").closest("li").addClass('active');
			$("#navbar-active-sitemap-id").text("(" + this.state.currentSitemap._id + ")");
		}
		else {
			$("#sitemap-nav-button").addClass("disabled");
			$("#navbar-active-sitemap-id").text("");
		}

		if (navigationId.match(/^create-sitemap-/)) {
			$("#create-sitemap-nav-button").closest("li").addClass('active');
		}
	},

	/**
	 * Simple info popup for sitemap start url input field
	 */
	initMultipleStartUrlHelper: function () {
		$("#startUrl")
			.popover({
				title: 'Multiple start urls',
				html: true,
				content: "You can create ranged start urls like this:<br />http://example.com/[1-100].html",
				placement: 'bottom'
			})
			.blur(function () {
				$(this).popover('hide');
			});
	},

	showCreateSitemap: function () {
		this.setActiveNavigationButton('create-sitemap-create');
		var sitemapForm = ich.SitemapCreate();
		$("#viewport").html(sitemapForm);
		this.initMultipleStartUrlHelper();
		return true;
	},

	showImportSitemapPanel: function () {
		this.setActiveNavigationButton('create-sitemap-import');
		var sitemapForm = ich.SitemapImport();
		$("#viewport").html(sitemapForm);
		return true;
	},

	showSitemapExportPanel: function () {
		this.setActiveNavigationButton('sitemap-export');
		var sitemap = this.state.currentSitemap;
		var sitemapJSON = sitemap.exportSitemap();
		var sitemapExportForm = ich.SitemapExport({
			sitemapJSON: sitemapJSON
		});
		$("#viewport").html(sitemapExportForm);
		return true;
	},

	showSitemaps: function () {

		this.clearState();
		this.setActiveNavigationButton("sitemaps");

		this.store.getAllSitemaps(function (sitemaps) {
			$sitemapListPanel = ich.SitemapList();
			sitemaps.forEach(function (sitemap) {
				$sitemap = ich.SitemapListItem(sitemap);
				$sitemap.data("sitemap", sitemap);
				$sitemapListPanel.find("tbody").append($sitemap);
			});
			$("#viewport").html($sitemapListPanel);
		});
	},

	createSitemap: function (form) {
		var id = $("#create-sitemap input[name=_id]").val();
		var startUrl = $("#create-sitemap input[name=startUrl]").val();
		var sitemap = new Sitemap({
			_id: id,
			startUrl: startUrl,
			selectors: []
		});
		this.store.createSitemap(sitemap, function (sitemap) {
			this._editSitemap(sitemap, ['_root']);
		}.bind(this, sitemap));
	},

	importSitemap: function () {
		var sitemapJSON = $("[name=sitemapJSON]").val();
		var sitemap = new Sitemap();
		sitemap.importSitemap(sitemapJSON);
		this.store.createSitemap(sitemap, function (sitemap) {
			this._editSitemap(sitemap, ['_root']);
		}.bind(this, sitemap));
	},

	editSitemapMetadata: function (button) {

		this.setActiveNavigationButton('sitemap-edit-metadata');

		var sitemap = this.state.currentSitemap;
		var $sitemapMetadataForm = ich.SitemapEditMetadata(sitemap);
		$("#viewport").html($sitemapMetadataForm);
		this.initMultipleStartUrlHelper();

		return true;
	},

	editSitemapMetadataSave: function (button) {
		var sitemap = this.state.currentSitemap;
		var data = {
			id: $("#edit-sitemap input[name=_id]").val(),
			startUrl: $("#edit-sitemap input[name=startUrl]").val()
		};

		var controller = this;

		// change data
		sitemap.startUrl = data.startUrl;

		// just change sitemaps url
		if (data.id === sitemap._id) {
			controller.store.saveSitemap(sitemap, function (sitemap) {
				controller.showSitemapSelectorList();
			});
		}
		// id changed. we need to delete the old one and create a new one
		else {
			var newSitemap = new Sitemap(sitemap);
			var oldSitemap = sitemap;
			newSitemap._id = data.id;
			controller.store.createSitemap(newSitemap, function (newSitemap) {
				controller.store.deleteSitemap(oldSitemap, function () {
					this.state.currentSitemap = newSitemap;
					controller.showSitemapSelectorList();
				}.bind(this));
			}.bind(this));
		}
	},

	/**
	 * Callback when sitemap edit button is clicked in sitemap grid
	 */
	editSitemap: function (tr) {

		var sitemap = $(tr).data("sitemap");
		this._editSitemap(sitemap);
	},
	_editSitemap: function (sitemap) {
		this.setStateEditSitemap(sitemap);
		this.setActiveNavigationButton("sitemap");

		this.showSitemapSelectorList();
	},
	showSitemapSelectorList: function () {

		this.setActiveNavigationButton('sitemap-selector-list');

		var sitemap = this.state.currentSitemap;
		var parentSelectors = this.state.editSitemapBreadcumbsSelectors;
		var parentSelectorId = this.state.currentParentSelectorId;

		var $selectorListPanel = ich.SelectorList({
			parentSelectors: parentSelectors
		});
		var selectors = sitemap.getDirectChildSelectors(parentSelectorId);
		selectors.forEach(function (selector) {
			$selector = ich.SelectorListItem(selector);
			$selector.data("selector", selector);
			$selectorListPanel.find("tbody").append($selector);
		});
		$("#viewport").html($selectorListPanel);

		return true;
	},
	showSitemapSelectorGraph: function () {
		this.setActiveNavigationButton('sitemap-selector-graph');
		var sitemap = this.state.currentSitemap;
		var $selectorGraphPanel = ich.SitemapSelectorGraph();
		$("#viewport").html($selectorGraphPanel);
		var graphDiv = $("#selector-graph")[0];
		var graph = new SelectorGraphv2(sitemap);
		graph.draw(graphDiv, $(document).width(), 200);
		return true;
	},
	showChildSelectors: function (tr) {
		var selector = $(tr).data('selector');
		var parentSelectors = this.state.editSitemapBreadcumbsSelectors;
		this.state.currentParentSelectorId = selector.id;
		parentSelectors.push(selector);

		this.showSitemapSelectorList();
	},

	treeNavigationshowSitemapSelectorList: function (button) {
		var parentSelectors = this.state.editSitemapBreadcumbsSelectors;
		var controller = this;
		$("#selector-tree .breadcrumb li a").each(function (i, parentSelectorButton) {
			if (parentSelectorButton === button) {
				parentSelectors.splice(i + 1);
				controller.state.currentParentSelectorId = parentSelectors[i].id;
			}
		});
		this.showSitemapSelectorList();
	},

	editSelector: function (button) {
		var selector = $(button).closest("tr").data('selector');
		this._editSelector(selector);
	},
	_editSelector: function (selector) {

		var sitemap = this.state.currentSitemap;
		var selectorIds = sitemap.getPossibleParentSelectorIds();

		var $editSelectorForm = ich.SelectorEdit({
			selector: selector,
			selectorIds: selectorIds,
			selectorTypes: [
				{
					type: 'SelectorText',
					title: 'Text'
				},
				{
					type: 'SelectorLink',
					title: 'Url'
				},
				{
					type: 'SelectorElement',
					title: 'Element'
				},
				{
					type: 'SelectorImage',
					title: 'Image'
				},
				{
					type: 'SelectorGroup',
					title: 'Grouped'
				},
				{
					type: 'SelectorHTML',
					title: 'HTML'
				},
				{
					type: 'SelectorElementAttribute',
					title: 'Element attribute'
				}
			]
		});
		$("#viewport").html($editSelectorForm);

		// handle selects seperately
		$editSelectorForm.find("[name=type]").val(selector.type);
		selector.parentSelectors.forEach(function (parentSelectorId) {
			$editSelectorForm.find("#parentSelectors [value='" + parentSelectorId + "']").attr("selected", "selected");
		});

		this.state.currentSelector = selector;
		this.selectorTypeChanged();
	},
	selectorTypeChanged: function () {
		var type = $("#edit-selector select[name=type]").val();
		var features = window[type].getFeatures();
		$("#edit-selector .feature").hide();
		features.forEach(function (feature) {
			$("#edit-selector .feature-" + feature).show();
		})
	},
	saveSelector: function (button) {
		var sitemap = this.state.currentSitemap;
		var selector = this.state.currentSelector;
		var id = $("#edit-selector [name=id]").val();
		var selectorsSelector = $("#edit-selector [name=selector]").val();
		var type = $("#edit-selector [name=type]").val();
		var multiple = $("#edit-selector [name=multiple]").is(":checked");
		var regex = $("#edit-selector [name=regex]").val();
		var parentSelectors = $("#edit-selector [name=parentSelectors]").val();
		var extractAttribute = $("#edit-selector [name=extractAttribute]").val();

		var newSelector = new Selector({
			id: id,
			selector: selectorsSelector,
			type: type,
			multiple: multiple,
			regex: regex,
			extractAttribute:extractAttribute,
			parentSelectors: parentSelectors
		});

		sitemap.updateSelector(selector, newSelector);

		var controller = this;

		this.store.saveSitemap(sitemap, function () {
			this.showSitemapSelectorList();
		}.bind(this));
	},
	cancelSelectorEditing: function (button) {
		this.showSitemapSelectorList();
	},
	addSelector: function () {

		var parentSelectorId = this.state.currentParentSelectorId;
		var sitemap = this.state.currentSitemap;

		var selector = new Selector({
			parentSelectors: [parentSelectorId],
			type: 'SelectorText',
			multiple: false
		});

		this._editSelector(selector, sitemap);
	},
	deleteSelector: function (button) {

		var sitemap = this.state.currentSitemap;
		var selector = $(button).closest("tr").data('selector');
		sitemap.deleteSelector(selector);

		this.store.saveSitemap(sitemap, function () {
			this.showSitemapSelectorList();
		}.bind(this));
	},
	deleteSitemap: function (button) {
		var sitemap = $(button).closest("tr").data("sitemap");
		var controller = this;
		this.store.deleteSitemap(sitemap, function () {
			controller.showSitemaps();
		});
	},
	scrapeSitemap: function () {
		var sitemap = this.state.currentSitemap;
		var request = {
			scrapeSitemap: true,
			sitemap: JSON.parse(JSON.stringify(sitemap))
		};
		chrome.runtime.sendMessage(request, function (response) {
			// sitemap scraped
		});
		return true;
	},
	sitemapListBrowseSitemapData: function (button) {
		var sitemap = $(button).closest("tr").data("sitemap");
		this.setStateEditSitemap(sitemap);
		this.browseSitemapData();
	},
	browseSitemapData: function () {
		this.setActiveNavigationButton('sitemap-browse');
		var sitemap = this.state.currentSitemap;
		this.store.getSitemapData(sitemap, function (data) {

			var dataColumns = sitemap.getDataColumns();

			var dataPanel = ich.SitemapBrowseData({
				columns: dataColumns
			});
			$("#viewport").html(dataPanel);

			// display data
			// Doing this the long way so there aren't xss vulnerubilites 
			// while working with data or with the selector titles
			var $tbody = $("#sitemap-data tbody");
			data.forEach(function (row) {
				var $tr = $("<tr></tr>");
				dataColumns.forEach(function (column) {
					var $td = $("<td></td>");
					var cellData = row[column];
					if (typeof cellData === 'object') {
						cellData = JSON.stringify(cellData);
					}
					$td.text(cellData);
					$tr.append($td);
				});
				$tbody.append($tr);
			});
		}.bind(this));

		return true;
	},

	showSitemapExportDataCsvPanel: function () {
		this.setActiveNavigationButton('sitemap-export-data-csv');

		var sitemap = this.state.currentSitemap;
		var exportPanel = ich.SitemapExportDataCSV(sitemap);
		$("#viewport").html(exportPanel);

		// generate data
		$(".download-button").hide();
		this.store.getSitemapData(sitemap, function (data) {
			var blob = sitemap.getDataExportCsvBlob(data);
			$(".download-button a").attr("href", window.URL.createObjectURL(blob));
			$(".download-button a").attr("download", sitemap._id + ".csv");
			$(".download-button").show();
		}.bind(this));

		return true;
	},

	selectSelector: function (button) {

		var sitemap = this.state.currentSitemap;
		var selector = this.state.currentSelector;
		var parentSelectorId = selector.parentSelectors[0];

		// run css selector through background page
		var request = {
			selectSelector: true,
			parentSelectorId: parentSelectorId,
			sitemap: JSON.parse(JSON.stringify(sitemap))
		};
		chrome.runtime.sendMessage(request, function (response) {
			$("#edit-selector input[name=selector]").val(response.selector);
		});
	},

	selectSelectorParent: function(button) {
		var request = {
			selectSelectorParent: true
		};
		chrome.runtime.sendMessage(request);
	},
	selectSelectorChild: function(button) {
		var request = {
			selectSelectorChild: true
		};
		chrome.runtime.sendMessage(request);
	},
	previewSelector: function (button) {

		if ($(button).hasClass('active')) {
			var sitemap = this.state.currentSitemap;
			var selector = this.state.currentSelector;
			var parentSelectorId = selector.parentSelectors[0];

			// run css selector through background page
			var request = {
				previewSelector: true,
				parentSelectorId: parentSelectorId,
				sitemap: JSON.parse(JSON.stringify(sitemap)),
				selector: $("#edit-selector input[name=selector]").val()
			};
			chrome.runtime.sendMessage(request);
		}
		else {
			var request = {
				cancelPreviewSelector: true
			};
			chrome.runtime.sendMessage(request);
		}
	},
	previewSelectorFromSelectorTree: function (button) {

		if (!$(button).hasClass('active')) {
			$(button).addClass('active');

			var sitemap = this.state.currentSitemap;
			var selector = $(button).closest("tr").data('selector');
			var parentSelectorId = selector.parentSelectors[0];

			// run css selector through background page
			var request = {
				previewSelector: true,
				parentSelectorId: parentSelectorId,
				sitemap: JSON.parse(JSON.stringify(sitemap)),
				selector: selector.selector
			};
			chrome.runtime.sendMessage(request);
		}
		else {
			$(button).removeClass('active');
			var request = {
				cancelPreviewSelector: true
			};
			chrome.runtime.sendMessage(request);
		}
	}
};
