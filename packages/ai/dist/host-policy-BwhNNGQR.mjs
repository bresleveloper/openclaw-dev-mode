import { r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
//#region packages/ai/src/transports/host-policy.ts
function buildGuardedModelFetch(model, timeoutMs, options) {
	const host = getAiTransportHost();
	if (options !== void 0) return host.buildModelFetch(model, timeoutMs, options) ?? globalThis.fetch;
	if (timeoutMs !== void 0) return host.buildModelFetch(model, timeoutMs) ?? globalThis.fetch;
	return host.buildModelFetch(model) ?? globalThis.fetch;
}
/** SDKs keep their default transport unless their embedding owner requires an explicit one. */
function buildManagedModelFetch(model, host = getAiTransportHost()) {
	if (!host.requiresManagedTransport(model)) return;
	const fetcher = host.buildModelFetch(model);
	if (!fetcher) throw new Error("The embedding host requires a managed provider transport");
	return fetcher;
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
function resolveModelRequestTimeoutMs(model, timeoutMs) {
	return timeoutMs ?? getAiTransportHost().resolveModelRequestTimeoutMs(model);
}
//#endregion
export { resolveProviderRequestCapabilities as a, resolveProviderEndpoint as i, buildManagedModelFetch as n, resolveModelRequestTimeoutMs as r, buildGuardedModelFetch as t };
