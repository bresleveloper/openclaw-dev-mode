import { o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { A as shortHash } from "./transport-stream-shared-lhgkTOz3.mjs";
//#region packages/ai/src/transports/provider-replay-context.ts
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
		sessionHash: hashReplayContextValue(options?.sessionId),
		authProfileHash: hashReplayContextValue(options?.authProfileId)
	};
}
function providerReplayContextMatches(state, context) {
	return state.provider === context.provider && state.api === context.api && state.model === context.model && state.baseUrlHash === context.baseUrlHash && state.sessionHash === context.sessionHash && state.authProfileHash === context.authProfileHash;
}
//#endregion
export { isProviderReplayContext as n, providerReplayContextMatches as r, buildProviderReplayContext as t };
