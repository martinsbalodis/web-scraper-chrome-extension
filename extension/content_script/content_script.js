chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		console.log("chrome.runtime.onMessage", request);

		if (request.selectSelector) {

			window.cs = new ContentSelector({
				sitemap: request.sitemap,
				selectorId: request.selectorId
			});
			window.cs.selectSelector(function (resultCSSSelector) {
				var response = {
					selector: resultCSSSelector
				};
				// @TODO implement additional data response somehow better
				// @TODO add test to table selector
				if(window.cs.selector.type === "SelectorTable") {
					var $tables = $(resultCSSSelector);
					if($tables.length > 0) {
						var columns = [];
						var $headerRow = $($tables[0]).find("thead tr");
						if ($headerRow.length > 0) {
							$headerRow.find("td,th").each(function (i) {
								var header = $(this).text().trim();
								columns.push({
									header:header,
									name:header,
									extract:true
								});
							});
						}
						response.columns = columns;
					}
				}
				sendResponse(response);
			});

			// response will be returned later
			return true;
		}
		else if (request.selectSelectorParent) {
			if (window.cs !== undefined) {
				window.cs.selectParent();
				window.cs.highlightSelectedElements();
			}
			return false;
		}
		else if (request.selectSelectorChild) {
			if (window.cs !== undefined) {
				window.cs.selectChild();
				window.cs.highlightSelectedElements();
			}
			return false;
		}
		else if (request.previewSelector) {

			var cs = new ContentSelector({
				sitemap: request.sitemap,
				selectorId: request.selectorId
			});
			cs.previewSelector();
			return false;
		}
		else if (request.cancelPreviewSelector) {
			ContentSelector.prototype.unbindElementSelectionHighlight();
		}
		else if (request.extractData) {
			console.log("received data extraction request", request);
			var extractor = new DataExtractor(request);
			var deferredData = extractor.getData();
			deferredData.done(function(data){
				console.log("dataextractor data", data);
				sendResponse(data);
			});
			return true;
		}
		else if(request.previewSelectorData) {
			console.log("received data-preview extraction request", request);
			var extractor = new DataExtractor(request);
			var deferredData = extractor.getSingleSelectorData(request.parentSelectorIds, request.selectorId);
			deferredData.done(function(data){
				console.log("dataextractor data", data);
				sendResponse(data);
			});
			return true;
		}
	}
);