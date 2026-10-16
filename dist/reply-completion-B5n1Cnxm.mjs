//#region src/agents/reply-completion.ts
/** Returns true when a lifecycle turn must not redefine session-stable reply policy. */
function isSyntheticSourceReplyTurn(params) {
	return params.isHeartbeat === true || params.inputProvenance?.kind === "inter_session" || params.inputProvenance?.kind === "internal_system";
}
/** Resolve legacy runtime inputs once; explicit host requiredness always wins. */
function resolveReplyExpectation(params) {
	return params.terminalReplyExpectation ?? (isSyntheticSourceReplyTurn(params) || (params.allowEmptyAssistantReplyAsSilent ?? (params.trigger !== void 0 && params.trigger !== "user" && params.trigger !== "manual")) ? "optional" : "required");
}
/** Reconcile host policy with output/custody facts, never with a model's silence request. */
function resolveReplyCompletion(expectation, evidence) {
	return expectation === "required" ? {
		expectation,
		outcome: evidence === "empty" ? "missing" : evidence
	} : {
		expectation,
		outcome: evidence === "empty" ? "silent" : evidence
	};
}
/** Failure to observe a send is not proof that it is safe to generate or send another reply. */
async function observeReplyDelivery(observer, minimumAssistantMessageIndex, onError) {
	try {
		return await observer?.(minimumAssistantMessageIndex) ?? "missing";
	} catch (error) {
		onError(error);
		return "pending";
	}
}
//#endregion
export { resolveReplyExpectation as i, observeReplyDelivery as n, resolveReplyCompletion as r, isSyntheticSourceReplyTurn as t };
