chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		console.log("chrome.runtime.onMessage", request);

		if (request.selectSelector) {

			window.cs = new ContentSelector({
				sitemap: request.sitemap,
				parentSelectorId: request.parentSelectorId
			});
			window.cs.selectSelector(function (resultSelector) {
				sendResponse({
					selector: resultSelector
				});
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
				parentSelectorId: request.parentSelectorId
			});
			cs.previewSelector(request.selector);
			return false;
		}
		else if (request.cancelPreviewSelector) {
			ContentSelector.prototype.unbindElementSelectionHighlight();
		}
		else if (request.extractData) {
			console.log("received data extraction request", request);
			var extractor = new DataExtractor(request);
			var data = extractor.getData();
			console.log("dataextractor data", data);
			sendResponse(data);
		}
	}
);