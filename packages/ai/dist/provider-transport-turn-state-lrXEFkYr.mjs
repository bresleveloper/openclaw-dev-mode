import { n as getAiTransportHost } from "./host-yTvBrYM2.mjs";
import { n as resolveOpencodeSessionHeaders, t as hasOpencodeSessionHeader } from "./session-affinity-Bcunsn4I.mjs";
import { randomUUID } from "node:crypto";
//#region packages/ai/src/transports/provider-transport-turn-state.ts
function resolveProviderTransportTurnState(model, params) {
	const normalizedProvider = model.provider.trim().toLowerCase();
	const allowRuntimePluginLoad = normalizedProvider === "openai" || normalizedProvider === "azure-openai" || normalizedProvider === "azure-openai-responses";
	return getAiTransportHost().plugin.resolveTransportTurnState({
		provider: model.provider,
		modelId: model.id,
		allowRuntimePluginLoad,
		context: {
			provider: model.provider,
			modelId: model.id,
			model,
			sessionId: params.sessionId,
			turnId: params.turnId,
			attempt: params.attempt,
			transport: params.transport
		}
	});
}
function filterProviderTurnHeadersForExplicitOpencodeSession(model, options, turnHeaders) {
	if (!turnHeaders || !hasOpencodeSessionHeader(model, options)) return turnHeaders;
	const filtered = Object.fromEntries(Object.entries(turnHeaders).filter(([name]) => name.toLowerCase() !== "x-opencode-session"));
	return Object.keys(filtered).length > 0 ? filtered : void 0;
}
function resolveProviderSimpleCompletionHeaders(model, options) {
	const optionHeaders = resolveOpencodeSessionHeaders(model, options);
	const turnState = resolveProviderTransportTurnState(model, {
		sessionId: options?.sessionId,
		turnId: randomUUID(),
		attempt: 1,
		transport: "stream"
	});
	return {
		...filterProviderTurnHeadersForExplicitOpencodeSession(model, { headers: optionHeaders }, turnState?.headers),
		...optionHeaders
	};
}
//#endregion
export { resolveProviderSimpleCompletionHeaders as n, resolveProviderTransportTurnState as r, filterProviderTurnHeadersForExplicitOpencodeSession as t };
