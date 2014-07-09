/**
 * @author Martins Balodis
 *
 * An alternative version of $.when which can be used to execute asynchronous
 * calls sequentially one after another. This is limited to JS engine stack size.
 *
 * @returns $.Deferred().promise()
 */
$.whenCallSequentially = function() {

	var deferredResonse = $.Deferred();
	var functionCalls = arguments;
	var functionCalls = [];
	Array.prototype.push.apply(functionCalls, arguments);

	var resultArguments = new Array();

	var execute = function() {
		if(functionCalls.length === 0) {
			deferredResonse.resolve(resultArguments);
			return;
		}

		var nextCall = functionCalls.shift();
		var deferredDataResonse = nextCall();
		deferredDataResonse.done(function() {
			resultArguments.push(arguments);
			execute();
		});
	};

	// might throw stack size errors :(
	execute();

	return deferredResonse.promise();
};
