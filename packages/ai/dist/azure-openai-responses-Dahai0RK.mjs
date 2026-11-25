import { t as AssistantMessageEventStream } from "./event-stream-Bf6cK7-d.mjs";
import { r as getAiTransportHost } from "./host-Dm4e6L6R.mjs";
import { n as buildBaseOptions } from "./simple-options-Bet1Zroc.mjs";
import { n as getEnvApiKey } from "./env-api-keys-DlUbTgKq.mjs";
import { t as createAssistantOutput } from "./assistant-output-DPK9pdyx.mjs";
import { An as withOpenAIErrorResponseHook, Dt as convertProviderResponsesMessages, dn as resolveOpenAISimpleReasoningEffort, kn as resolvePromptCacheKey, r as runResponsesStreamLifecycle, t as applyCommonResponsesParams } from "./openai-responses-shared-CZBZVeqY.mjs";
import { n as resolveAzureDeploymentNameFromMap } from "./azure-deployment-map-hwDQc3uL.mjs";
import { t as requireApiKey } from "./required-api-key-BniLGxy4.mjs";
import { n as isTraditionalAzureOpenAIHost, t as isOpenAICompatibleAzureResponsesBaseUrl } from "./azure-openai-responses-client-compat-DLsS6V6z.mjs";
import OpenAI, { t as AzureOpenAI } from "./openai-jBu3eumF.mjs";
// packages/ai/src/providers/azure-openai-responses.ts
const DEFAULT_AZURE_API_VERSION = "v1";
const AZURE_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"opencode",
	"azure-openai-responses"
]);
const streamAzureOpenAIResponses = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	const output = createAssistantOutput(model, "azure-openai-responses");
	runResponsesStreamLifecycle({
		stream,
		model,
		output,
		context,
		options,
		resolveRequestModel: (requestModel) => {
			const { baseUrl } = resolveAzureConfig(requestModel, options);
			return baseUrl === requestModel.baseUrl ? requestModel : {
				...requestModel,
				baseUrl
			};
		},
		createClient: (requestModel) => {
			const apiKey = (options?.apiKey || getEnvApiKey(model.provider) || "").trim();
			if (!apiKey) throw new Error("Azure OpenAI API key is required. Set AZURE_OPENAI_API_KEY environment variable or pass it as an argument.");
			const headers = { ...requestModel.headers };
			if (options?.headers) Object.assign(headers, options.headers);
			const { baseUrl, apiVersion } = resolveAzureConfig(requestModel, options);
			const clientOptions = {
				apiKey,
				dangerouslyAllowBrowser: true,
				defaultHeaders: headers,
				baseURL: baseUrl,
				fetch: withOpenAIErrorResponseHook(getAiTransportHost().buildModelFetch({
					...requestModel,
					baseUrl
				}) ?? globalThis.fetch, options?.onResponse, requestModel),
				maxRetries: 0
			};
			return isOpenAICompatibleAzureResponsesBaseUrl(baseUrl) ? new OpenAI(clientOptions) : new AzureOpenAI({
				...clientOptions,
				apiVersion
			});
		},
		buildParams: (requestModel, replayMode) => {
			const params = {
				model: options?.azureDeploymentName ? options.azureDeploymentName : resolveAzureDeploymentNameFromMap({
					modelId: model.id,
					deploymentMap: process.env.AZURE_OPENAI_DEPLOYMENT_NAME_MAP
				}),
				input: convertProviderResponsesMessages(requestModel, context, AZURE_TOOL_CALL_PROVIDERS, {
					sessionId: options?.sessionId,
					mutableInput: Boolean(options?.onPayload),
					replayMode
				}),
				stream: true,
				prompt_cache_key: resolvePromptCacheKey(requestModel.compat?.supportsPromptCacheKey === false ? void 0 : options, options?.cacheRetention ?? "short"),
				store: false
			};
			applyCommonResponsesParams(params, requestModel, context, options);
			return params;
		}
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
	if (!baseUrl && resourceName && !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(resourceName)) throw new Error("Invalid Azure OpenAI resource name: expected a single DNS label");
	const resolvedBaseUrl = baseUrl || (resourceName ? `https://${resourceName}.openai.azure.com/openai/v1` : model.baseUrl);
	if (!resolvedBaseUrl) throw new Error("Azure OpenAI base URL is required. Set AZURE_OPENAI_BASE_URL or AZURE_OPENAI_RESOURCE_NAME, or pass azureBaseUrl, azureResourceName, or model.baseUrl.");
	return {
		baseUrl: normalizeAzureBaseUrl(resolvedBaseUrl),
		apiVersion
	};
}
export { streamAzureOpenAIResponses, streamSimpleAzureOpenAIResponses };
