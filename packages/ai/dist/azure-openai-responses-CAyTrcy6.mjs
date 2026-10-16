import { t as AssistantMessageEventStream } from "./event-stream-C5AbCAaZ.mjs";
import { r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { n as buildBaseOptions } from "./simple-options-7QuSKriJ.mjs";
import { P as convertProviderResponsesMessages, Pt as resolvePromptCacheKey, gt as resolveOpenAISimpleReasoningEffort, r as runResponsesStreamLifecycle, t as applyCommonResponsesParams } from "./openai-responses-shared-BMx2NAS-.mjs";
import { n as getEnvApiKey } from "./env-api-keys-CyX4VKGO.mjs";
import { t as createAssistantOutput } from "./assistant-output-D5762GPH.mjs";
import { i as resolveAzureDeploymentNameFromMap, n as isTraditionalAzureOpenAIHost, t as isOpenAICompatibleAzureResponsesBaseUrl } from "./azure-openai-responses-client-compat-D0dvJMbZ.mjs";
import { t as requireApiKey } from "./required-api-key-D4kn3252.mjs";
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
	const output = createAssistantOutput(model, "azure-openai-responses");
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
	const apiKey = requireApiKey(model.provider, options?.apiKey);
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
	const url = URL.parse(trimmed);
	if (!url) throw new Error(`Invalid Azure OpenAI base URL: ${baseUrl}`);
	const normalizedPath = url.pathname.replace(/\/+$/, "");
	if (isTraditionalAzureOpenAIHost(url.hostname) && (normalizedPath === "" || normalizedPath === "/" || normalizedPath === "/openai")) {
		url.pathname = "/openai/v1";
		url.search = "";
	}
	return url.toString().replace(/\/+$/, "");
}
function resolveAzureConfig(model, options) {
	const apiVersion = options?.azureApiVersion || process.env.AZURE_OPENAI_API_VERSION || DEFAULT_AZURE_API_VERSION;
	const baseUrl = options?.azureBaseUrl?.trim() || process.env.AZURE_OPENAI_BASE_URL?.trim() || void 0;
	const resourceName = options?.azureResourceName || process.env.AZURE_OPENAI_RESOURCE_NAME;
	const resolvedBaseUrl = baseUrl || (resourceName ? `https://${resourceName}.openai.azure.com/openai/v1` : model.baseUrl);
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
	const clientOptions = {
		apiKey,
		dangerouslyAllowBrowser: true,
		defaultHeaders: headers,
		baseURL: baseUrl,
		fetch: getAiTransportHost().buildModelFetch({
			...model,
			baseUrl
		}),
		maxRetries: 0
	};
	return isOpenAICompatibleAzureResponsesBaseUrl(baseUrl) ? new OpenAI(clientOptions) : new AzureOpenAI({
		...clientOptions,
		apiVersion
	});
}
function buildParams(model, context, options, deploymentName, replayMode = "checkpoint") {
	const params = {
		model: deploymentName,
		input: convertProviderResponsesMessages(model, context, AZURE_TOOL_CALL_PROVIDERS, {
			sessionId: options?.sessionId,
			authProfileId: options?.authProfileId,
			replayMode
		}),
		stream: true,
		prompt_cache_key: resolvePromptCacheKey(options, options?.cacheRetention ?? "short"),
		store: false
	};
	applyCommonResponsesParams(params, model, context, options);
	return params;
}
//#endregion
export { streamAzureOpenAIResponses, streamSimpleAzureOpenAIResponses };
