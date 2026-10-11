import { n as getEnvApiKey } from "./env-api-keys-DrgeBuva.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-D8PARQfL.mjs";
import { n as getAiTransportHost } from "./host-yTvBrYM2.mjs";
import { n as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-CjV_2IRI.mjs";
import { n as buildBaseOptions } from "./simple-options-np1XPuhm.mjs";
import { g as resolveOpenAISimpleReasoningEffort } from "./openai-transport-params-DZKOTSfH.mjs";
import { a as runResponsesStreamLifecycle, i as createResponsesAssistantOutput, r as convertResponsesMessages, t as applyCommonResponsesParams } from "./openai-responses-shared-DvSqtJ6_.mjs";
import { i as resolveAzureDeploymentNameFromMap, t as isOpenAICompatibleAzureResponsesBaseUrl } from "./azure-openai-responses-client-compat-C7K7QfUE.mjs";
import OpenAI, { AzureOpenAI } from "openai";
//#region packages/ai/src/providers/azure-openai-responses.ts
const DEFAULT_AZURE_API_VERSION = "v1";
const AZURE_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"opencode",
	"azure-openai-responses"
]);
function resolveDeploymentName(model, options) {
	if (options?.azureDeploymentName) return options.azureDeploymentName;
	return resolveAzureDeploymentNameFromMap({
		modelId: model.id,
		deploymentMap: process.env.AZURE_OPENAI_DEPLOYMENT_NAME_MAP
	});
}
const streamAzureOpenAIResponses = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	const output = createResponsesAssistantOutput(model, "azure-openai-responses");
	runResponsesStreamLifecycle({
		stream,
		model,
		output,
		options,
		resolveRequestModel: (requestModel) => {
			const { baseUrl } = resolveAzureConfig(requestModel, options);
			return baseUrl === requestModel.baseUrl ? requestModel : {
				...requestModel,
				baseUrl
			};
		},
		createClient: (requestModel) => {
			return createClient(requestModel, options?.apiKey || getEnvApiKey(model.provider) || "", options);
		},
		buildParams: (requestModel, replayMode) => buildParams(requestModel, context, options, resolveDeploymentName(model, options), replayMode)
	});
	return stream;
};
const streamSimpleAzureOpenAIResponses = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	const authProfileId = options?.authProfileId;
	return streamAzureOpenAIResponses(model, context, {
		...base,
		authProfileId,
		reasoningEffort: resolveOpenAISimpleReasoningEffort(model, options?.reasoning)
	});
};
function normalizeAzureBaseUrl(baseUrl) {
	const trimmed = baseUrl.trim().replace(/\/+$/, "");
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		throw new Error(`Invalid Azure OpenAI base URL: ${baseUrl}`);
	}
	const isAzureHost = url.hostname.endsWith(".openai.azure.com") || url.hostname.endsWith(".cognitiveservices.azure.com");
	const normalizedPath = url.pathname.replace(/\/+$/, "");
	if (isAzureHost && (normalizedPath === "" || normalizedPath === "/" || normalizedPath === "/openai")) {
		url.pathname = "/openai/v1";
		url.search = "";
	}
	return url.toString().replace(/\/+$/, "");
}
function buildDefaultBaseUrl(resourceName) {
	return `https://${resourceName}.openai.azure.com/openai/v1`;
}
function resolveAzureConfig(model, options) {
	const apiVersion = options?.azureApiVersion || process.env.AZURE_OPENAI_API_VERSION || DEFAULT_AZURE_API_VERSION;
	const baseUrl = options?.azureBaseUrl?.trim() || process.env.AZURE_OPENAI_BASE_URL?.trim() || void 0;
	const resourceName = options?.azureResourceName || process.env.AZURE_OPENAI_RESOURCE_NAME;
	let resolvedBaseUrl = baseUrl;
	if (!resolvedBaseUrl && resourceName) resolvedBaseUrl = buildDefaultBaseUrl(resourceName);
	if (!resolvedBaseUrl && model.baseUrl) resolvedBaseUrl = model.baseUrl;
	if (!resolvedBaseUrl) throw new Error("Azure OpenAI base URL is required. Set AZURE_OPENAI_BASE_URL or AZURE_OPENAI_RESOURCE_NAME, or pass azureBaseUrl, azureResourceName, or model.baseUrl.");
	return {
		baseUrl: normalizeAzureBaseUrl(resolvedBaseUrl),
		apiVersion
	};
}
function createClient(model, apiKeyInput, options) {
	const apiKey = apiKeyInput.trim();
	if (!apiKey) throw new Error("Azure OpenAI API key is required. Set AZURE_OPENAI_API_KEY environment variable or pass it as an argument.");
	const headers = { ...model.headers };
	if (options?.headers) Object.assign(headers, options.headers);
	const { baseUrl, apiVersion } = resolveAzureConfig(model, options);
	const guardedFetch = getAiTransportHost().buildModelFetch({
		...model,
		baseUrl
	});
	if (isOpenAICompatibleAzureResponsesBaseUrl(baseUrl)) return new OpenAI({
		apiKey,
		dangerouslyAllowBrowser: true,
		defaultHeaders: headers,
		baseURL: baseUrl,
		fetch: guardedFetch,
		maxRetries: 0
	});
	return new AzureOpenAI({
		apiKey,
		apiVersion,
		dangerouslyAllowBrowser: true,
		defaultHeaders: headers,
		baseURL: baseUrl,
		fetch: guardedFetch,
		maxRetries: 0
	});
}
function buildParams(model, context, options, deploymentName, replayMode = "checkpoint") {
	const params = {
		model: deploymentName,
		input: convertResponsesMessages(model, context, AZURE_TOOL_CALL_PROVIDERS, {
			sessionId: options?.sessionId,
			authProfileId: options?.authProfileId,
			replayMode
		}),
		stream: true,
		prompt_cache_key: options?.cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
		store: false
	};
	applyCommonResponsesParams(params, model, context, options);
	return params;
}
//#endregion
export { streamAzureOpenAIResponses, streamSimpleAzureOpenAIResponses };
