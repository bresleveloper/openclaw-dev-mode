import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { s as buildBaseOptions } from "./sanitize-unicode-DcA7E1vi.js";
import { n as getEnvApiKey } from "./env-api-keys-8q9bEA0v.js";
import { n as resolveAzureDeploymentNameFromMap, t as isOpenAICompatibleAzureResponsesBaseUrl } from "./azure-openai-responses-client-compat-CgdMPTuU.js";
import { t as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-Ki7_LdG-.js";
import { a as resolveResponsesReasoningEffort, n as convertResponsesMessages, o as runResponsesStreamLifecycle, r as createResponsesAssistantOutput, t as applyCommonResponsesParams } from "./openai-responses-shared-C2-Tl1CB.js";
import OpenAI, { AzureOpenAI } from "openai";
//#region src/llm/providers/azure-openai-responses.ts
const DEFAULT_AZURE_API_VERSION = "v1";
const AZURE_TOOL_CALL_PROVIDERS = new Set([
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
function formatAzureOpenAIError(error) {
	if (error instanceof Error) {
		const status = error.status;
		const statusCode = typeof status === "number" ? status : void 0;
		if (statusCode !== void 0) return `Azure OpenAI API error (${statusCode}): ${error.message}`;
		return error.message;
	}
	try {
		return JSON.stringify(error);
	} catch {
		return String(error);
	}
}
/**
* Generate function for Azure OpenAI Responses API
*/
const streamAzureOpenAIResponses = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	runResponsesStreamLifecycle({
		stream,
		model,
		output: createResponsesAssistantOutput(model, "azure-openai-responses"),
		options,
		createClient: () => {
			return createClient(model, options?.apiKey || getEnvApiKey(model.provider) || "", options);
		},
		buildParams: () => buildParams(model, context, options, resolveDeploymentName(model, options)),
		formatError: formatAzureOpenAIError
	});
	return stream;
};
const streamSimpleAzureOpenAIResponses = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	return streamAzureOpenAIResponses(model, context, {
		...buildBaseOptions(model, options, apiKey),
		reasoningEffort: resolveResponsesReasoningEffort(model, options?.reasoning)
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
	let apiKey = apiKeyInput;
	if (!apiKey) {
		if (!process.env.AZURE_OPENAI_API_KEY) throw new Error("Azure OpenAI API key is required. Set AZURE_OPENAI_API_KEY environment variable or pass it as an argument.");
		apiKey = process.env.AZURE_OPENAI_API_KEY;
	}
	const headers = { ...model.headers };
	if (options?.headers) Object.assign(headers, options.headers);
	const { baseUrl, apiVersion } = resolveAzureConfig(model, options);
	if (isOpenAICompatibleAzureResponsesBaseUrl(baseUrl)) return new OpenAI({
		apiKey,
		dangerouslyAllowBrowser: true,
		defaultHeaders: headers,
		baseURL: baseUrl
	});
	return new AzureOpenAI({
		apiKey,
		apiVersion,
		dangerouslyAllowBrowser: true,
		defaultHeaders: headers,
		baseURL: baseUrl
	});
}
function buildParams(model, context, options, deploymentName) {
	const params = {
		model: deploymentName,
		input: convertResponsesMessages(model, context, AZURE_TOOL_CALL_PROVIDERS),
		stream: true,
		prompt_cache_key: options?.cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId)
	};
	applyCommonResponsesParams(params, model, context, options);
	return params;
}
const testing = {
	isOpenAICompatibleAzureResponsesBaseUrl,
	normalizeAzureBaseUrl,
	resolveAzureConfig
};
//#endregion
export { streamAzureOpenAIResponses, streamSimpleAzureOpenAIResponses, testing };
