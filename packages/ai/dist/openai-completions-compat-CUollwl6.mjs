import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { a as resolveProviderRequestCapabilities } from "./host-policy-DZO3oPPk.mjs";
//#region packages/ai/src/providers/openai-response-format.ts
const JSON_SCHEMA_RESPONSE_FORMAT_NAME = "openclaw_response";
const OLLAMA_CLOUD_ORIGIN = "https://ollama.com";
function isKnownOpenAIJsonSchemaModelId(modelId) {
	if (typeof modelId !== "string") return false;
	if (/^gpt-5(?:[.-]|$)/i.test(modelId) || /^gpt-4\.1(?:-|$)/i.test(modelId)) return true;
	const gpt4o = /^gpt-4o(-mini)?(?:-(\d{4}-\d{2}-\d{2}))?$/i.exec(modelId);
	if (gpt4o) {
		const snapshot = gpt4o[2];
		return !snapshot || snapshot >= (gpt4o[1] ? "2024-07-18" : "2024-08-06");
	}
	return /^(?:o1|o3(?:-mini|-pro)?|o4-mini)(?:-\d{4}-\d{2}-\d{2})?$/i.test(modelId);
}
function shouldOmitOllamaCompatResponseFormat(params) {
	if (!params.provider.includes("ollama")) return false;
	if (params.hasTools()) return true;
	try {
		return new URL(params.baseUrl).origin === OLLAMA_CLOUD_ORIGIN;
	} catch {
		return false;
	}
}
/**
* Maps the shared JSON Schema option to Chat Completions while preserving the
* older provider-shaped json_object/json_schema inputs accepted by model params.
*/
function resolveOpenAICompletionsResponseFormat(responseFormat, supportsJsonSchemaResponseFormat) {
	if (!responseFormat) return;
	if (responseFormat.type === "json_object") return responseFormat;
	if (responseFormat.type === "text") return responseFormat;
	if (responseFormat.type === "json_schema" && isRecord(responseFormat.json_schema)) return responseFormat;
	if (!supportsJsonSchemaResponseFormat) return;
	return {
		type: "json_schema",
		json_schema: {
			name: JSON_SCHEMA_RESPONSE_FORMAT_NAME,
			schema: responseFormat
		}
	};
}
//#endregion
//#region packages/ai/src/transports/openai-completions-compat.ts
function isDefaultRouteProvider(provider, ...ids) {
	return provider !== void 0 && ids.includes(provider);
}
/** Native OpenAI defaults never apply to a configured proxy endpoint. */
function isNativeOpenAIEndpoint(model) {
	const baseUrl = model.baseUrl?.trim();
	if (!baseUrl) return model.provider === "openai";
	const endpoint = URL.parse(baseUrl);
	return endpoint?.protocol === "https:" && (endpoint.hostname === "api.openai.com" || endpoint.hostname.endsWith(".api.openai.com"));
}
function isOpenAICodexResponsesModel(model) {
	return model.provider === "openai" && (model.api === "openai-chatgpt-responses" || model.api === "openclaw-openai-chatgpt-responses-transport");
}
function isNativeOpenAICodexResponsesBaseUrl(baseUrl) {
	const trimmed = typeof baseUrl === "string" ? baseUrl.trim() : "";
	if (!trimmed) return false;
	try {
		const url = new URL(trimmed);
		if (url.protocol !== "http:" && url.protocol !== "https:") return false;
		if (url.hostname.toLowerCase() !== "chatgpt.com") return false;
		const pathname = url.pathname.replace(/\/+$/u, "").toLowerCase();
		return [
			"/backend-api",
			"/backend-api/v1",
			"/backend-api/codex",
			"/backend-api/codex/v1",
			"/backend-api/codex/responses"
		].includes(pathname);
	} catch {
		return false;
	}
}
function usesNativeOpenAICodexResponsesBackend(model) {
	return isOpenAICodexResponsesModel(model) && isNativeOpenAICodexResponsesBaseUrl(model.baseUrl);
}
function resolveOpenAIPromptCacheKeySupport(model) {
	return model.compat?.supportsPromptCacheKey ?? (isNativeOpenAIEndpoint(model) || usesNativeOpenAICodexResponsesBackend(model));
}
/** Resolves default request flags for an OpenAI-compatible completions endpoint. */
function resolveOpenAICompletionsCompatDefaults(input) {
	const { provider, modelId, endpointClass, knownProviderFamily, supportsNativeStreamingUsageCompat = false, supportsOpenAICompletionsStreamingUsageCompat = false, usesExplicitProxyLikeEndpoint = false } = input;
	const isDefaultRoute = endpointClass === "default";
	const usesConfiguredNonOpenAIEndpoint = endpointClass !== "default" && endpointClass !== "openai-public";
	const isMoonshot = knownProviderFamily === "moonshot" || endpointClass === "moonshot-native";
	const isMoonshotLike = isMoonshot || knownProviderFamily === "modelstudio" || endpointClass === "modelstudio-native";
	const isModelStudioLike = knownProviderFamily === "modelstudio" || endpointClass === "modelstudio-native" || isDefaultRoute && isDefaultRouteProvider(provider, "dashscope", "modelstudio", "qwen");
	const isZai = endpointClass === "zai-native" || isDefaultRoute && isDefaultRouteProvider(input.provider, "zai");
	const isDeepSeek = endpointClass === "deepseek-native" || isDefaultRoute && isDefaultRouteProvider(input.provider, "deepseek");
	const isTogether = knownProviderFamily === "together" || input.baseUrl?.includes("api.together.ai") === true || input.baseUrl?.includes("api.together.xyz") === true || isDefaultRoute && isDefaultRouteProvider(input.provider, "together");
	const isCloudflareAiGateway = provider === "cloudflare-ai-gateway" || input.baseUrl?.includes("gateway.ai.cloudflare.com") === true;
	const isXiaomi = endpointClass === "xiaomi-native" || isDefaultRoute && isDefaultRouteProvider(input.provider, "xiaomi");
	const isNonStandard = endpointClass === "cerebras-native" || endpointClass === "chutes-native" || endpointClass === "deepseek-native" || endpointClass === "mistral-public" || endpointClass === "opencode-native" || endpointClass === "opencode-go-native" || endpointClass === "xai-native" || isXiaomi || isZai || isDefaultRoute && isDefaultRouteProvider(input.provider, "cerebras", "chutes", "deepseek", "opencode", "xai");
	const isOpenRouterLike = input.provider === "openrouter" || endpointClass === "openrouter";
	const isLocalEndpoint = endpointClass === "local";
	const usesMaxTokens = endpointClass === "chutes-native" || endpointClass === "mistral-public" || knownProviderFamily === "mistral" || isMoonshot || isCloudflareAiGateway || isZai || isTogether || isDefaultRoute && isDefaultRouteProvider(provider, "chutes");
	return {
		supportsStore: !isNonStandard && knownProviderFamily !== "mistral" && !usesExplicitProxyLikeEndpoint,
		supportsDeveloperRole: !isNonStandard && !isMoonshotLike && !usesConfiguredNonOpenAIEndpoint,
		supportsReasoningEffort: !isZai && !isTogether && knownProviderFamily !== "mistral" && endpointClass !== "xai-native" && !usesExplicitProxyLikeEndpoint,
		supportsUsageInStreaming: supportsOpenAICompletionsStreamingUsageCompat || !isNonStandard && (isLocalEndpoint || !usesConfiguredNonOpenAIEndpoint || supportsNativeStreamingUsageCompat),
		maxTokensField: usesMaxTokens ? "max_tokens" : "max_completion_tokens",
		thinkingFormat: isDeepSeek || isXiaomi ? "deepseek" : isZai ? "zai" : isTogether ? "together" : isOpenRouterLike ? "openrouter" : "openai",
		visibleReasoningDetailTypes: isOpenRouterLike ? ["response.output_text", "response.text"] : [],
		supportsStrictMode: !isZai && !usesConfiguredNonOpenAIEndpoint,
		supportsJsonSchemaResponseFormat: (endpointClass === "openai-public" || isDefaultRoute && isDefaultRouteProvider(provider, "openai")) && isKnownOpenAIJsonSchemaModelId(modelId),
		requiresReasoningContentOnAssistantMessages: isDeepSeek || isXiaomi,
		requiresNonEmptyUserOrAssistantMessage: isModelStudioLike,
		cacheControlFormat: isModelStudioLike && endpointClass !== "custom" || modelId?.toLowerCase().startsWith("anthropic/") === true && (endpointClass === "openrouter" || isDefaultRoute && provider === "openrouter" || provider === "deepinfra") ? "anthropic" : void 0,
		sessionAffinityFormat: isOpenRouterLike ? "openrouter" : "openai",
		supportsLongCacheRetention: !isModelStudioLike && provider !== "cloudflare-workers-ai" && provider !== "cloudflare-ai-gateway" && knownProviderFamily !== "together" && !input.baseUrl?.includes("api.cloudflare.com") && !input.baseUrl?.includes("gateway.ai.cloudflare.com") && !input.baseUrl?.includes("api.together.ai") && !input.baseUrl?.includes("api.together.xyz")
	};
}
/** Detects endpoint capabilities and defaults for an OpenAI-completions model. */
function detectOpenAICompletionsCompat(model, resolveCapabilities) {
	const capabilities = (resolveCapabilities ?? ((input) => resolveProviderRequestCapabilities(input, model)))({
		provider: model.provider,
		api: "openai-completions",
		baseUrl: model.baseUrl,
		capability: "llm",
		transport: "stream",
		modelId: model.id,
		compat: model.compat && typeof model.compat === "object" ? model.compat : void 0
	});
	return {
		capabilities,
		defaults: resolveOpenAICompletionsCompatDefaults({
			provider: model.provider,
			modelId: model.id,
			baseUrl: model.baseUrl,
			...capabilities
		})
	};
}
function resolveSessionAffinity(model, detectedFormat) {
	if (model.compat?.sendSessionAffinityHeaders !== true) return "none";
	if (detectedFormat === "openrouter" || model.compat.thinkingFormat === "openrouter" || model.compat.openRouterRouting !== void 0) return "openrouter";
	return "openai";
}
/** Applies explicit model overrides once on top of the canonical transport defaults. */
function resolveOpenAICompletionsCompat(model, resolveCapabilities) {
	const { defaults } = detectOpenAICompletionsCompat(model, resolveCapabilities);
	const configured = model.compat;
	return {
		supportsStore: configured?.supportsStore ?? defaults.supportsStore,
		supportsDeveloperRole: configured?.supportsDeveloperRole ?? defaults.supportsDeveloperRole,
		supportsReasoningEffort: configured?.supportsReasoningEffort ?? defaults.supportsReasoningEffort,
		supportedReasoningEfforts: configured?.supportedReasoningEfforts,
		reasoningEffortMap: configured?.reasoningEffortMap,
		supportsUsageInStreaming: configured?.supportsUsageInStreaming ?? defaults.supportsUsageInStreaming,
		maxTokensField: configured?.maxTokensField ?? defaults.maxTokensField,
		requiresToolResultName: configured?.requiresToolResultName ?? false,
		requiresAssistantAfterToolResult: configured?.requiresAssistantAfterToolResult ?? false,
		requiresThinkingAsText: configured?.requiresThinkingAsText ?? false,
		requiresReasoningContentOnAssistantMessages: configured?.requiresReasoningContentOnAssistantMessages ?? defaults.requiresReasoningContentOnAssistantMessages,
		thinkingFormat: configured?.thinkingFormat ?? defaults.thinkingFormat,
		openRouterRouting: configured?.openRouterRouting,
		vercelGatewayRouting: configured?.vercelGatewayRouting ?? {},
		zaiToolStream: configured?.zaiToolStream ?? false,
		supportsStrictMode: configured?.supportsStrictMode ?? defaults.supportsStrictMode,
		supportsJsonSchemaResponseFormat: configured?.supportsJsonSchemaResponseFormat ?? defaults.supportsJsonSchemaResponseFormat,
		cacheControlFormat: configured?.cacheControlFormat ?? defaults.cacheControlFormat,
		sessionAffinity: resolveSessionAffinity(model, defaults.sessionAffinityFormat),
		supportsPromptCacheKey: resolveOpenAIPromptCacheKeySupport(model),
		supportsLongCacheRetention: configured?.supportsLongCacheRetention ?? (usesNativeOpenAICodexResponsesBackend(model) ? false : defaults.supportsLongCacheRetention),
		configuredSupportsLongCacheRetention: configured?.supportsLongCacheRetention,
		visibleReasoningDetailTypes: configured && "visibleReasoningDetailTypes" in configured ? configured.visibleReasoningDetailTypes ?? defaults.visibleReasoningDetailTypes : defaults.visibleReasoningDetailTypes,
		requiresNonEmptyUserOrAssistantMessage: defaults.requiresNonEmptyUserOrAssistantMessage
	};
}
//#endregion
export { resolveOpenAIPromptCacheKeySupport as a, shouldOmitOllamaCompatResponseFormat as c, resolveOpenAICompletionsCompat as i, isNativeOpenAIEndpoint as n, usesNativeOpenAICodexResponsesBackend as o, isOpenAICodexResponsesModel as r, resolveOpenAICompletionsResponseFormat as s, detectOpenAICompletionsCompat as t };
