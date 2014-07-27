chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		console.log("chrome.runtime.onMessage", request);

		if (request.extractData) {
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
		// Universal ContentScript communication handler
		else if(request.contentScriptCall) {

			var contentScript = getContentScript("ContentScript");

			console.log("received ContentScript request", request);

			var deferredResponse = contentScript[request.fn](request.request);
			deferredResponse.done(function(response) {
				sendResponse(response);
			});

			return true;
		}
	}
);