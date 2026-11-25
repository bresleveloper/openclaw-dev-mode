import { r as getAiTransportHost } from "./host-Dm4e6L6R.mjs";
import { t as buildGuardedModelFetch } from "./host-policy-fDXTduGF.mjs";
import { An as withOpenAIErrorResponseHook, D as resolveAzureOpenAIApiVersion, On as resolveOpenAIClientBaseUrl, nn as buildOpenAISdkClientOptions } from "./openai-responses-shared-CZBZVeqY.mjs";
import { n as resolveCloudflareBaseUrl, t as isCloudflareProvider } from "./cloudflare-BCLfDuew.mjs";
import { t as isOpenAICompatibleAzureResponsesBaseUrl } from "./azure-openai-responses-client-compat-DLsS6V6z.mjs";
import OpenAI, { t as AzureOpenAI } from "./openai-jBu3eumF.mjs";
// packages/ai/src/providers/openai-provider-client.ts
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
function createOpenAIResponsesClient(model, apiKey, defaultHeaders, fetchOverride) {
	return new OpenAI({
		apiKey,
		baseURL: resolveOpenAIClientBaseUrl(model),
		dangerouslyAllowBrowser: true,
		defaultHeaders,
		fetch: fetchOverride ?? buildGuardedModelFetch(model),
		...buildOpenAISdkClientOptions(model)
	});
}
function createAzureOpenAIClient(model, apiKey, defaultHeaders, fetchOverride) {
	const baseURL = model.baseUrl.replace(/\/+$/, "");
	const clientOptions = {
		apiKey,
		dangerouslyAllowBrowser: true,
		defaultHeaders,
		baseURL,
		fetch: fetchOverride ?? buildGuardedModelFetch(model),
		...buildOpenAISdkClientOptions(model)
	};
	if (isOpenAICompatibleAzureResponsesBaseUrl(baseURL)) return new OpenAI(clientOptions);
	return new AzureOpenAI({
		...clientOptions,
		apiVersion: resolveAzureOpenAIApiVersion()
	});
}
export { createAzureOpenAIClient, createOpenAIProviderClient, createOpenAIResponsesClient };
