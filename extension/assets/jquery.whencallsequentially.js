/**
 * @author Martins Balodis
 *
 * An alternative version of $.when which can be used to execute asynchronous
 * calls sequentially one after another. This is limited to JS engine stack size.
 *
 * @returns $.Deferred().promise()
 */
$.whenCallSequentially = function(functionCalls) {

	var deferredResonse = $.Deferred();

	var resultData = new Array();

	var execute = function() {
		if(functionCalls.length === 0) {
			deferredResonse.resolve(resultData);
			return;
		}

		var nextCall = functionCalls.shift();
		var deferredDataResonse = nextCall();
		deferredDataResonse.done(function(data) {
            resultData.push(data);
			execute();
		});
	};

	// might throw stack size errors :(
	execute();

	return deferredResonse.promise();
};
