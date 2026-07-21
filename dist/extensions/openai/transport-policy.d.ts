import { Yt as ProviderResolveWebSocketSessionPolicyContext, in as ProviderWebSocketSessionPolicy, qt as ProviderResolveTransportTurnStateContext, tn as ProviderTransportTurnState } from "../../plugin-entry-L7QTXRH5.js";

//#region extensions/openai/transport-policy.d.ts
declare function resolveOpenAITransportTurnState(ctx: ProviderResolveTransportTurnStateContext): ProviderTransportTurnState | undefined;
declare function resolveOpenAIWebSocketSessionPolicy(ctx: ProviderResolveWebSocketSessionPolicyContext): ProviderWebSocketSessionPolicy | undefined;
//#endregion
export { resolveOpenAITransportTurnState, resolveOpenAIWebSocketSessionPolicy };