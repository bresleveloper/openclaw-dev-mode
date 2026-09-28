import { n as getAiTransportHost } from "./host-yTvBrYM2.mjs";
//#region packages/ai/src/transports/host-policy.ts
function buildGuardedModelFetch(model, timeoutMs, options) {
	const host = getAiTransportHost();
	if (options !== void 0) return host.buildModelFetch(model, timeoutMs, options) ?? globalThis.fetch;
	if (timeoutMs !== void 0) return host.buildModelFetch(model, timeoutMs) ?? globalThis.fetch;
	return host.buildModelFetch(model) ?? globalThis.fetch;
}
function resolveProviderEndpoint(model) {
	return { endpointClass: getAiTransportHost().resolveProviderRequestCapabilities({
		baseUrl: model.baseUrl,
		model
	}).endpointClass };
}
function resolveProviderRequestCapabilities(input, model) {
	return getAiTransportHost().resolveProviderRequestCapabilities({
		...input,
		model
	});
}
function resolveProviderRequestPolicyConfig(model, input) {
	return { headers: getAiTransportHost().resolveProviderRequestHeaders({
		...input,
		model
	}) };
}
function resolveModelRequestTimeoutMs(model, timeoutMs) {
	return timeoutMs ?? getAiTransportHost().resolveModelRequestTimeoutMs(model);
}
function resolveOpenAIStrictToolSetting(model, options) {
	return getAiTransportHost().resolveOpenAIStrictToolSetting(model, options);
}
function transformTransportMessages(messages, model, normalizeToolCallId, options) {
	return getAiTransportHost().transformTransportMessages(messages, model, normalizeToolCallId, options);
}
//#endregion
export { resolveProviderRequestCapabilities as a, resolveProviderEndpoint as i, resolveModelRequestTimeoutMs as n, resolveProviderRequestPolicyConfig as o, resolveOpenAIStrictToolSetting as r, transformTransportMessages as s, buildGuardedModelFetch as t };
