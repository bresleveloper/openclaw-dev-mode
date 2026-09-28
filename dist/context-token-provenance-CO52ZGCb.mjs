import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/config/sessions/context-token-provenance.ts
function resolvePositiveContextTokens(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function isExactProducerSelection(params) {
	const entryProvider = normalizeLowercaseStringOrEmpty(params.entry?.modelProvider);
	const entryModel = normalizeLowercaseStringOrEmpty(params.entry?.model);
	const entryHarness = normalizeLowercaseStringOrEmpty(params.entry?.agentHarnessId);
	const currentProvider = normalizeLowercaseStringOrEmpty(params.provider);
	const currentModel = normalizeLowercaseStringOrEmpty(params.model);
	const currentHarness = normalizeLowercaseStringOrEmpty(params.agentHarnessId);
	return Boolean(entryProvider && entryModel && entryHarness && currentProvider && currentModel && currentHarness && entryProvider === currentProvider && entryModel === currentModel && entryHarness === currentHarness);
}
/** Returns a persisted effective resolution only for its exact producing selection. */
function resolveMatchingPersistedResolution(params) {
	if (params.entry?.contextTokensSource !== "resolved-v1") return;
	return isExactProducerSelection(params) ? resolvePositiveContextTokens(params.entry?.contextTokens) : void 0;
}
/** Returns persisted telemetry only when it belongs to the current producing selection. */
function resolveTrustedSessionContextTokens(params) {
	const contextTokens = resolvePositiveContextTokens(params.entry?.contextTokens);
	if (contextTokens === void 0) return;
	if (params.entry?.modelSelectionLocked === true) {
		const entryProvider = normalizeLowercaseStringOrEmpty(params.entry?.modelProvider);
		const entryModel = normalizeLowercaseStringOrEmpty(params.entry?.model);
		const currentProvider = normalizeLowercaseStringOrEmpty(params.provider);
		const currentModel = normalizeLowercaseStringOrEmpty(params.model);
		if (entryProvider && currentProvider && entryProvider !== currentProvider || entryModel && currentModel && entryModel !== currentModel) return;
		return contextTokens;
	}
	if (params.entry?.contextTokensSource !== "runtime") return;
	return isExactProducerSelection(params) ? contextTokens : void 0;
}
/** Projects the context window owned by the current session selection. */
function resolveProjectedSessionContextTokens(params) {
	const resolvedContextTokens = resolvePositiveContextTokens(params.resolvedContextTokens);
	const authoredContextTokens = resolvePositiveContextTokens(params.authoredContextTokens);
	const trustedContextTokens = resolveTrustedSessionContextTokens(params);
	const persistedResolution = resolvedContextTokens === void 0 && authoredContextTokens === void 0 ? resolveMatchingPersistedResolution(params) : void 0;
	const currentContextTokens = authoredContextTokens !== void 0 ? resolvedContextTokens === void 0 ? authoredContextTokens : Math.min(authoredContextTokens, resolvedContextTokens) : trustedContextTokens !== void 0 && resolvedContextTokens !== void 0 ? Math.min(trustedContextTokens, resolvedContextTokens) : trustedContextTokens ?? resolvedContextTokens ?? persistedResolution;
	return params.entry?.modelSelectionLocked === true ? trustedContextTokens ?? currentContextTokens : currentContextTokens;
}
/** Only publish a last-run prompt budget for the current session selection and cap. */
function resolveProjectedSessionContextBudgetStatus(params) {
	const status = params.entry?.contextBudgetStatus;
	const provider = normalizeLowercaseStringOrEmpty(params.provider);
	const model = normalizeLowercaseStringOrEmpty(params.model);
	if (!status || !provider || !model || resolvePositiveContextTokens(params.contextTokens) === void 0 || params.entry?.liveModelSwitchPending || normalizeLowercaseStringOrEmpty(status.provider) !== provider || normalizeLowercaseStringOrEmpty(status.model) !== model || !status.sessionId?.trim() || status.sessionId !== params.entry?.sessionId || status.contextTokenBudget !== params.contextTokens) return;
	return status;
}
//#endregion
export { resolveProjectedSessionContextTokens as n, resolveTrustedSessionContextTokens as r, resolveProjectedSessionContextBudgetStatus as t };
