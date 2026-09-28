import { n as getAiTransportHost } from "./host-yTvBrYM2.mjs";
import { k as resolveOpenAIClientBaseUrl } from "./openai-transport-params-DZKOTSfH.mjs";
import { i as resolveCloudflareBaseUrl, r as isCloudflareProvider } from "./github-copilot-headers-B37TB3rB.mjs";
import OpenAI from "openai";
//#region packages/ai/src/providers/openai-provider-client.ts
function createOpenAIProviderClient(model, apiKey, headers, optionsHeaders) {
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
		fetch: getAiTransportHost().buildModelFetch(model)
	});
}
//#endregion
export { createOpenAIProviderClient as t };
