import { o as isRecord } from "./record-coerce-BgUo6bj4.mjs";
import { t as shortHash } from "./hash-Cx359qsb.mjs";
// packages/ai/src/transports/provider-replay-context.ts
function isProviderReplayContext(value) {
	return isRecord(value) && typeof value.provider === "string" && typeof value.api === "string" && typeof value.model === "string" && (value.baseUrlHash === void 0 || typeof value.baseUrlHash === "string") && (value.sessionHash === void 0 || typeof value.sessionHash === "string") && (value.authProfileHash === void 0 || typeof value.authProfileHash === "string");
}
function hashReplayContextValue(value) {
	const normalized = value?.trim();
	return normalized ? shortHash(normalized) : void 0;
}
function buildProviderReplayContext(model, options) {
	return {
		provider: model.provider,
		api: model.api,
		model: model.id,
		baseUrlHash: hashReplayContextValue(model.baseUrl),
		sessionHash: hashReplayContextValue(options?.sessionId)
	};
}
function providerReplayContextMatches(state, context) {
	return state.provider === context.provider && state.api === context.api && state.baseUrlHash === context.baseUrlHash && state.sessionHash === context.sessionHash;
}
export { isProviderReplayContext as n, providerReplayContextMatches as r, buildProviderReplayContext as t };
