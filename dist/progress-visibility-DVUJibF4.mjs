//#region src/channels/progress-visibility.ts
/** Await progress without changing the legacy `void` acceptance contract. */
async function settleProgressVisibilityCallbackResult(callbackResult) {
	const result = await callbackResult;
	return {
		result,
		visible: result !== false
	};
}
//#endregion
export { settleProgressVisibilityCallbackResult as t };
