import { r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { n as resolveCloudflareBaseUrl, t as isCloudflareProvider } from "./cloudflare-Dttf8jKq.mjs";
import { n as resolveOpencodeSessionHeaders, t as hasOpencodeSessionHeader } from "./session-affinity-DA4WHv1h.mjs";
import { It as resolveOpenAIClientBaseUrl, Rt as withOpenAIErrorResponseHook } from "./openai-responses-shared-XoSAyCHj.mjs";
import { n as OpenAI } from "./openai-CMTVUemR.mjs";
import { randomUUID } from "node:crypto";
//#region packages/ai/src/providers/openai-provider-client.ts
function createOpenAIProviderClient(model, apiKey, headers, optionsHeaders, onResponse) {
	if (optionsHeaders) Object.assign(headers, optionsHeaders);
	const defaultHeaders = model.provider === "cloudflare-ai-gateway" ? {
		...headers,
		Authorization: headers.Authorization ?? null,
		"cf-aig-authorization": `Bearer ${apiKey}`
	} : headers;
	const baseUrl = isCloudflareProvider(model.provider) ? resolveCloudflareBaseUrl(model) : model.baseUrl;
	return new OpenAI({
		apiKey,
		baseURL: resolveOpenAIClientBaseUrl(model, baseUrl),
		dangerouslyAllowBrowser: true,
		defaultHeaders,
		maxRetries: 0,
		fetch: withOpenAIErrorResponseHook(getAiTransportHost().buildModelFetch(model) ?? globalThis.fetch, onResponse, model)
	});
}
//#endregion
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
export { createOpenAIProviderClient as i, resolveProviderSimpleCompletionHeaders as n, resolveProviderTransportTurnState as r, filterProviderTurnHeadersForExplicitOpencodeSession as t };
