import { O as shortHash } from "./transport-stream-shared-B5RioB_Q.mjs";
//#region packages/ai/src/transports/provider-replay-context.ts
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
export { providerReplayContextMatches as n, buildProviderReplayContext as t };
