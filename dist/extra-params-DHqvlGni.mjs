import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as sanitizeExtraParamsRecord, i as resolveModelExtraParamSources, r as resolveAliasedParamValue } from "./model-extra-params-HwiZgNCH.mjs";
import { n as ensureProviderRuntimePluginHandle, r as getModelProviderRuntimePluginHandle } from "./provider-hook-runtime-DHSjZAkW.mjs";
import { r as isNativeWebSearchAllowedByToolPolicy } from "./codex-native-web-search-core-DjHnWmPI.mjs";
import { i as streamSimple } from "./stream-NAsW_bVF.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { C as resolveAnthropicCacheRetentionFamily, h as createOpenAIStringContentWrapper, l as createOpenAICompletionsStrictMessageKeysWrapper, n as createOpenRouterSystemCacheWrapper, o as createMinimaxThinkingDisabledWrapper, p as createOpenAIResponsesContextManagementWrapper, u as createOpenAICompletionsToolsCompatWrapper } from "./proxy-5w6qPw5I.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-DKyCtmRd.mjs";
import { r as createOpenAICompletionsPayloadPolicyWrapper } from "./ai-transport-runtime-host-DG6Jnqf2.mjs";
import { c as createDeepSeekV4OpenAICompatibleThinkingWrapper, h as createThinkingOnlyFinalTextWrapper, u as createGoogleThinkingPayloadWrapper } from "./provider-stream-shared-Ond8mlRx.mjs";
import { canonicalizeMaxTokensParam, detectOpenAICompletionsCompat, resolveMaxTokensParam, resolveOpenAICompletionsCompat, resolveOpenAIPromptCacheKeySupport } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-runner/prompt-cache-retention.ts
/**
* Resolves provider/model prompt-cache retention behavior.
*/
function resolveExplicitCachedContent(extraParams) {
	return (typeof extraParams?.cachedContent === "string" ? extraParams.cachedContent : typeof extraParams?.cached_content === "string" ? extraParams.cached_content : void 0)?.trim() || void 0;
}
function parseCacheRetention(value) {
	return value === "none" || value === "short" || value === "long" ? value : void 0;
}
function isGooglePromptCacheEligible(params) {
	if (params.modelApi !== "google-generative-ai") return false;
	const normalizedModelId = normalizeLowercaseStringOrEmpty(params.modelId);
	return normalizedModelId.startsWith("gemini-2.5") || normalizedModelId.startsWith("gemini-3");
}
function resolveCacheRetention(extraParams, provider, modelApi, modelId, compat, baseUrl) {
	const hasExplicitCacheConfig = extraParams?.cacheRetention !== void 0 || extraParams?.cacheControlTtl !== void 0;
	const family = resolveAnthropicCacheRetentionFamily({
		provider,
		modelApi,
		modelId,
		hasExplicitCacheConfig
	});
	const openAIEligible = (modelApi === "openai-responses" || modelApi === "openai-chatgpt-responses" || modelApi === "openai-completions") && resolveOpenAIPromptCacheKeySupport({
		provider,
		api: modelApi,
		baseUrl,
		compat
	});
	const googleEligible = isGooglePromptCacheEligible({
		modelApi,
		modelId
	});
	const compatEligible = compat?.supportsPromptCacheKey === true || compat?.cacheControlFormat === "anthropic";
	if (!family && !googleEligible && !openAIEligible && !compatEligible && !(modelApi === "bedrock-converse-stream")) return;
	const newVal = parseCacheRetention(extraParams?.cacheRetention);
	if (newVal) return newVal;
	const legacy = extraParams?.cacheControlTtl;
	if (legacy === "5m" && (family || googleEligible)) return "short";
	if (legacy === "1h" && (family || googleEligible)) return "long";
	return family === "anthropic-direct" ? "short" : void 0;
}
//#endregion
//#region src/llm/providers/stream-wrappers/moonshot.ts
/** Detects SiliconFlow Pro models that require thinking=null instead of thinking="off". */
function shouldApplySiliconFlowThinkingOffCompat(params) {
	return params.provider === "siliconflow" && params.thinkingLevel === "off" && params.modelId.startsWith("Pro/");
}
/** Wraps Moonshot-compatible requests to rewrite SiliconFlow thinking-off payloads. */
function createSiliconFlowThinkingWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
		if (payloadObj.thinking === "off") payloadObj.thinking = null;
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/extra-params.ts
function requireBaseStreamFn(streamFn) {
	if (!streamFn) throw new Error("Cannot apply stream policy without a lifecycle-owned base stream.");
	return streamFn;
}
const REQUEST_SCOPED_EXTRA_PARAM_KEYS = /* @__PURE__ */ new Set([
	"response_format",
	"responseFormat",
	"stop"
]);
const GPT_PARALLEL_TOOL_CALLS_APIS = /* @__PURE__ */ new Set([
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses"
]);
function resolveExtraParams(params) {
	const { defaultParams, modelParams, agentModelParams, agentParams } = resolveModelExtraParamSources({
		config: params.cfg,
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId
	});
	const sources = [
		defaultParams,
		modelParams,
		agentModelParams,
		agentParams
	];
	const merged = Object.assign({}, ...sources);
	canonicalizeExtraParamAlias(merged, sources, ["serviceTier", "service_tier"]);
	canonicalizeExtraParamAlias(merged, sources, ["fastMode", "fast_mode"]);
	canonicalizeExtraParamAlias(merged, sources, ["parallel_tool_calls", "parallelToolCalls"]);
	canonicalizeExtraParamAlias(merged, [
		modelParams,
		agentModelParams,
		agentParams
	], ["text_verbosity", "textVerbosity"]);
	canonicalizeExtraParamAlias(merged, sources, ["response_format", "responseFormat"]);
	canonicalizeMaxTokensParam({
		merged,
		sources
	});
	canonicalizeExtraParamAlias(merged, sources, ["cached_content", "cachedContent"], "cachedContent");
	if (params.provider === "openrouter") canonicalizeOpenRouterResponseCacheParams(merged, sources);
	applyDefaultOpenAIGptRuntimeParams(params, merged);
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function resolveSupportedTransport(value) {
	return value === "sse" || value === "websocket" || value === "websocket-cached" || value === "auto" ? value : void 0;
}
function resolvePreparedExtraParams(params) {
	const resolvedExtraParams = params.resolvedExtraParams ?? resolveExtraParams(params);
	const override = stripRequestScopedExtraParams(sanitizeExtraParamsOverride(params.extraParamsOverride));
	const merged = {
		...sanitizeExtraParamsRecord(resolvedExtraParams),
		...override
	};
	canonicalizeExtraParamAlias(merged, [resolvedExtraParams, override], ["serviceTier", "service_tier"]);
	canonicalizeExtraParamAlias(merged, [resolvedExtraParams, override], ["fastMode", "fast_mode"]);
	canonicalizeMaxTokensParam({
		merged,
		sources: [resolvedExtraParams, override]
	});
	canonicalizeExtraParamAlias(merged, [resolvedExtraParams, override], ["cached_content", "cachedContent"], "cachedContent");
	if (params.provider === "openrouter") canonicalizeOpenRouterResponseCacheParams(merged, [resolvedExtraParams, override]);
	const { plugin } = ensureProviderRuntimePluginHandle({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHandle: params.providerRuntimeHandle ?? getModelProviderRuntimePluginHandle(params.model)
	});
	const context = {
		config: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		provider: params.provider,
		modelId: params.modelId,
		model: params.model,
		thinkingLevel: params.thinkingLevel,
		auth: params.auth
	};
	const prepared = plugin?.prepareExtraParams?.({
		...context,
		extraParams: merged
	}) ?? merged;
	const transportPatch = plugin?.extraParamsForTransport?.({
		...context,
		extraParams: prepared,
		transport: params.resolvedTransport ?? resolveSupportedTransport(prepared.transport)
	})?.patch;
	const result = transportPatch ? {
		...prepared,
		...transportPatch
	} : prepared;
	canonicalizeMaxTokensParam({
		merged: result,
		sources: [prepared, transportPatch ?? void 0]
	});
	return result;
}
function sanitizeExtraParamsOverride(value) {
	return value && Object.keys(value).length > 0 ? sanitizeExtraParamsRecord(Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== void 0))) : void 0;
}
function stripRequestScopedExtraParams(value) {
	if (!value) return;
	const filtered = Object.fromEntries(Object.entries(value).filter(([key]) => !REQUEST_SCOPED_EXTRA_PARAM_KEYS.has(key)));
	return Object.keys(filtered).length > 0 ? filtered : void 0;
}
function applyDefaultOpenAIGptRuntimeParams(params, merged) {
	if (params.provider !== "openai" || !/^gpt-5(?:[.-]|$)/i.test(params.modelId)) return;
	for (const [canonical, alias, value] of [[
		"parallel_tool_calls",
		"parallelToolCalls",
		true
	], [
		"text_verbosity",
		"textVerbosity",
		"low"
	]]) if (!Object.hasOwn(merged, canonical) && !Object.hasOwn(merged, alias)) merged[canonical] = value;
}
function resolveAgentTransportOverride(params) {
	const globalSettings = params.settingsManager.getGlobalSettings();
	const projectSettings = params.settingsManager.getProjectSettings();
	if (Object.hasOwn(globalSettings, "transport") || Object.hasOwn(projectSettings, "transport")) return;
	return resolveSupportedTransport(params.effectiveExtraParams?.transport);
}
function resolveExplicitSettingsTransport(params) {
	const globalSettings = params.settingsManager.getGlobalSettings();
	const projectSettings = params.settingsManager.getProjectSettings();
	if (!Object.hasOwn(globalSettings, "transport") && !Object.hasOwn(projectSettings, "transport")) return;
	return resolveSupportedTransport(params.sessionTransport);
}
function normalizeStopSequences(value) {
	const list = typeof value === "string" ? [value] : Array.isArray(value) ? value : void 0;
	if (!list) return;
	const sequences = list.filter((item) => typeof item === "string" && item.length > 0);
	return sequences.length > 0 ? sequences : void 0;
}
function createStreamFnWithExtraParams(baseStreamFn, extraParams, provider, model) {
	if (!extraParams || Object.keys(extraParams).length === 0) return;
	if (Object.hasOwn(extraParams, "cacheRetention") && parseCacheRetention(extraParams.cacheRetention) === void 0) log.warn("ignoring invalid cacheRetention param; expected \"none\", \"short\", or \"long\"");
	const streamParams = {};
	if (typeof extraParams.temperature === "number") streamParams.temperature = extraParams.temperature;
	if (typeof extraParams.streaming === "boolean") streamParams.streaming = extraParams.streaming;
	const maxTokens = resolveMaxTokensParam(extraParams);
	if (maxTokens !== void 0) streamParams.maxTokens = maxTokens;
	const resolvedResponseFormat = resolveAliasedParamValue([extraParams], ["response_format", "responseFormat"]);
	if (resolvedResponseFormat && typeof resolvedResponseFormat === "object" && !Array.isArray(resolvedResponseFormat)) streamParams.responseFormat = resolvedResponseFormat;
	const transport = resolveSupportedTransport(extraParams.transport);
	if (transport) streamParams.transport = transport;
	else if (extraParams.transport != null) {
		const transportSummary = typeof extraParams.transport === "string" ? extraParams.transport : typeof extraParams.transport;
		log.warn(`ignoring invalid transport param: ${transportSummary}`);
	}
	const cachedContent = resolveExplicitCachedContent(extraParams);
	if (cachedContent) streamParams.cachedContent = cachedContent;
	for (const keys of [
		["topP", "top_p"],
		["frequencyPenalty", "frequency_penalty"],
		["presencePenalty", "presence_penalty"]
	]) {
		const value = resolveAliasedParamValue([extraParams], keys);
		if (typeof value === "number") streamParams[keys[0]] = value;
	}
	if (typeof extraParams.seed === "number") streamParams.seed = extraParams.seed;
	const resolvedStop = normalizeStopSequences(extraParams.stop);
	if (resolvedStop) streamParams.stop = resolvedStop;
	const resolveModelCacheRetention = (candidate) => resolveCacheRetention(extraParams, provider, typeof candidate?.api === "string" ? candidate.api : void 0, typeof candidate?.id === "string" ? candidate.id : void 0, candidate?.api === "openai-completions" ? resolveOpenAICompletionsCompat(candidate) : candidate?.compat, candidate?.baseUrl);
	if (log.isEnabled("debug")) {
		const initialCacheRetention = resolveModelCacheRetention(model);
		if (Object.keys(streamParams).length > 0 || initialCacheRetention) {
			const debugParams = {
				...streamParams,
				cacheRetention: initialCacheRetention
			};
			log.debug(`creating streamFn wrapper with params: ${JSON.stringify(debugParams)}`);
		}
	}
	const underlying = requireBaseStreamFn(baseStreamFn);
	return (callModel, context, options) => {
		const cacheRetention = resolveModelCacheRetention(callModel);
		if (Object.keys(streamParams).length === 0 && !cacheRetention) return underlying(callModel, context, options);
		const effectiveCacheRetention = options?.cacheRetention ?? cacheRetention;
		return underlying(callModel, context, {
			...streamParams,
			...options,
			...effectiveCacheRetention ? { cacheRetention: effectiveCacheRetention } : {}
		});
	};
}
function canonicalizeExtraParamAlias(merged, sources, keys, canonical = keys[0]) {
	const resolved = resolveAliasedParamValue(sources, keys);
	if (resolved !== void 0) {
		merged[canonical] = resolved;
		delete merged[keys[0] === canonical ? keys[1] : keys[0]];
	}
}
const OPENROUTER_RESPONSE_CACHE_PARAM_ALIASES = [
	["responseCache", "response_cache"],
	[
		"responseCacheTtlSeconds",
		"response_cache_ttl_seconds",
		"responseCacheTtl",
		"response_cache_ttl"
	],
	["responseCacheClear", "response_cache_clear"]
];
function canonicalizeOpenRouterResponseCacheParams(merged, sources) {
	for (const keys of OPENROUTER_RESPONSE_CACHE_PARAM_ALIASES) {
		const resolved = resolveAliasedParamValue(sources, keys);
		if (resolved === void 0) continue;
		for (const key of keys) delete merged[key];
		merged[keys[0]] = resolved;
	}
}
function createParallelToolCallsWrapper(baseStreamFn, enabled) {
	const underlying = requireBaseStreamFn(baseStreamFn);
	return (model, context, options) => {
		if (!GPT_PARALLEL_TOOL_CALLS_APIS.has(model.api)) return underlying(model, context, options);
		log.debug(`applying parallel_tool_calls=${enabled} for ${model.provider ?? "unknown"}/${model.id ?? "unknown"} api=${model.api}`);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			payloadObj.parallel_tool_calls = enabled;
		});
	};
}
const DEEPSEEK_V4_MODEL_IDS = /* @__PURE__ */ new Set([
	"deepseek-flash",
	"deepseek-v4-flash",
	"deepseek-v4-pro"
]);
function normalizeCompatibleModelId(modelId) {
	if (typeof modelId !== "string") return;
	const normalized = modelId.trim().toLowerCase();
	const suffixIndex = normalized.indexOf(":");
	return (suffixIndex === -1 ? normalized : normalized.slice(0, suffixIndex)).split("/").pop();
}
function isOpenAICompletionsModel(model, modelIds) {
	const normalizedModelId = normalizeCompatibleModelId(model.id);
	return model.api === "openai-completions" && normalizedModelId !== void 0 && modelIds.has(normalizedModelId);
}
function isMicrosoftFoundryProviderId(provider) {
	if (typeof provider !== "string") return false;
	const normalizedProvider = provider.trim().toLowerCase();
	return normalizedProvider === "microsoft-foundry" || normalizedProvider.startsWith("microsoft-foundry-");
}
/**
* Foundry and other non-native routes reject even thinking.type=disabled.
* Explicit compat wins, then detected non-native formats; unknown proxy routes
* retain the model-ID fallback to DeepSeek's native wire format.
*/
function deepSeekV4NativeThinkingAllowedByCompat(model) {
	const compat = model.compat;
	const configured = compat && typeof compat === "object" ? compat.thinkingFormat : void 0;
	if (typeof configured === "string") return configured === "deepseek";
	const detected = detectOpenAICompletionsCompat(model).defaults.thinkingFormat;
	return detected !== "openrouter" && detected !== "together" && detected !== "zai";
}
function createDeepSeekV4NonNativeCompatSanitizerWrapper(baseStreamFn) {
	if (!baseStreamFn) return;
	return (model, context, options) => {
		if (!isOpenAICompletionsModel(model, DEEPSEEK_V4_MODEL_IDS) || !isMicrosoftFoundryProviderId(model.provider) && deepSeekV4NativeThinkingAllowedByCompat(model)) return baseStreamFn(model, context, options);
		return streamWithPayloadPatch(baseStreamFn, model, context, options, (payload) => {
			delete payload.thinking;
			if (Array.isArray(payload.messages)) {
				for (const message of payload.messages) if (message && typeof message === "object") delete message.reasoning_content;
			}
		});
	};
}
const MIMO_REASONING_OPENAI_COMPATIBLE_MODEL_IDS = /* @__PURE__ */ new Set([
	"mimo-v2-pro",
	"mimo-v2-omni",
	"mimo-v2.5",
	"mimo-v2.5-pro",
	...[
		"flash",
		"pro",
		"pro-ultraspeed"
	].map((variant) => `mimo-v2.6-${variant}`)
]);
const MIMO_REASONING_AS_VISIBLE_TEXT_MODEL_IDS = /* @__PURE__ */ new Set(["mimo-v2-pro", "mimo-v2-omni"]);
function applyExtraParamsToAgent(agent, cfg, provider, modelId, extraParamsOverride, thinkingLevel, agentId, workspaceDir, model, agentDir, resolvedTransport, options) {
	const selectedModel = {
		provider,
		modelId
	};
	const providerRuntimeHandle = ensureProviderRuntimePluginHandle({
		...selectedModel,
		config: cfg,
		workspaceDir,
		runtimeHandle: getModelProviderRuntimePluginHandle(model)
	});
	const override = sanitizeExtraParamsOverride(extraParamsOverride);
	const effectiveExtraParams = options?.preparedExtraParams ?? resolvePreparedExtraParams({
		cfg,
		...selectedModel,
		extraParamsOverride,
		thinkingLevel,
		agentId,
		agentDir,
		workspaceDir,
		model,
		resolvedTransport,
		providerRuntimeHandle,
		auth: options?.auth
	});
	const providerStreamBase = agent.streamFn;
	const nativeWebSearchAllowedByToolPolicy = options?.nativeWebSearchPolicyContext ? isNativeWebSearchAllowedByToolPolicy({
		config: cfg,
		modelProvider: model?.provider,
		modelId: model?.id,
		agentId,
		...options.nativeWebSearchPolicyContext
	}) : void 0;
	const { modelParams, agentModelParams } = resolveModelExtraParamSources({
		config: cfg,
		provider,
		modelId,
		agentId
	});
	const pluginWrappedStreamFn = providerRuntimeHandle.plugin?.wrapStreamFn?.({
		config: cfg,
		agentDir,
		workspaceDir,
		agentId,
		auth: options?.auth,
		nativeWebSearchAllowedByToolPolicy,
		...selectedModel,
		extraParams: effectiveExtraParams,
		modelParams: {
			...modelParams,
			...agentModelParams
		},
		modelCallUrgency: options?.modelCallUrgency,
		thinkingLevel,
		model,
		streamFn: providerStreamBase
	}) ?? void 0;
	agent.streamFn = pluginWrappedStreamFn ?? providerStreamBase;
	const baseExtraParams = override && [...REQUEST_SCOPED_EXTRA_PARAM_KEYS].some((key) => Object.hasOwn(override, key)) ? stripRequestScopedExtraParams(effectiveExtraParams) : effectiveExtraParams;
	const streamParams = override ? {
		...baseExtraParams,
		...override
	} : baseExtraParams;
	const wrappedStreamFn = createStreamFnWithExtraParams(agent.streamFn, streamParams, provider, model);
	if (wrappedStreamFn) {
		log.debug(`applying extraParams to agent streamFn for ${provider}/${modelId}`);
		agent.streamFn = wrappedStreamFn;
	}
	if (shouldApplySiliconFlowThinkingOffCompat({
		...selectedModel,
		thinkingLevel
	})) {
		log.debug(`normalizing thinking=off to thinking=null for SiliconFlow compatibility (${provider}/${modelId})`);
		agent.streamFn = createSiliconFlowThinkingWrapper(agent.streamFn);
	}
	const providerWrapperHandled = pluginWrappedStreamFn !== void 0 && pluginWrappedStreamFn !== providerStreamBase && !pluginWrappedStreamFn.preservesGenericCompatibility;
	const cacheStreamParams = override ? {
		...effectiveExtraParams,
		...override
	} : effectiveExtraParams;
	agent.streamFn = createOpenRouterSystemCacheWrapper(agent.streamFn, cacheStreamParams);
	agent.streamFn = createOpenAIStringContentWrapper(agent.streamFn);
	agent.streamFn = createOpenAICompletionsStrictMessageKeysWrapper(agent.streamFn);
	agent.streamFn = createOpenAICompletionsToolsCompatWrapper(agent.streamFn);
	if (!providerWrapperHandled) {
		agent.streamFn = createDeepSeekV4OpenAICompatibleThinkingWrapper({
			baseStreamFn: agent.streamFn,
			thinkingLevel,
			shouldPatchModel: (candidateModel) => isOpenAICompletionsModel(candidateModel, DEEPSEEK_V4_MODEL_IDS) && !isMicrosoftFoundryProviderId(candidateModel.provider) && deepSeekV4NativeThinkingAllowedByCompat(candidateModel)
		});
		agent.streamFn = createDeepSeekV4NonNativeCompatSanitizerWrapper(agent.streamFn);
		agent.streamFn = createDeepSeekV4OpenAICompatibleThinkingWrapper({
			baseStreamFn: agent.streamFn,
			thinkingLevel,
			shouldPatchModel: (candidateModel) => isOpenAICompletionsModel(candidateModel, MIMO_REASONING_OPENAI_COMPATIBLE_MODEL_IDS)
		});
		agent.streamFn = createThinkingOnlyFinalTextWrapper({
			baseStreamFn: agent.streamFn,
			shouldPatchModel: (candidateModel) => isOpenAICompletionsModel(candidateModel, MIMO_REASONING_AS_VISIBLE_TEXT_MODEL_IDS)
		});
		agent.streamFn = createGoogleThinkingPayloadWrapper(agent.streamFn, thinkingLevel);
		agent.streamFn = createOpenAIResponsesContextManagementWrapper(agent.streamFn, effectiveExtraParams);
	}
	agent.streamFn = createMinimaxThinkingDisabledWrapper(agent.streamFn, thinkingLevel);
	agent.streamFn = createOpenAICompletionsPayloadPolicyWrapper(requireBaseStreamFn(agent.streamFn), [effectiveExtraParams, override]);
	const rawParallelToolCalls = resolveAliasedParamValue([effectiveExtraParams, override], ["parallel_tool_calls", "parallelToolCalls"]);
	if (typeof rawParallelToolCalls === "boolean") agent.streamFn = createParallelToolCallsWrapper(agent.streamFn, rawParallelToolCalls);
	else if (rawParallelToolCalls === null) log.debug("parallel_tool_calls suppressed by null override, skipping injection");
	else if (rawParallelToolCalls !== void 0) {
		const summary = typeof rawParallelToolCalls === "string" ? rawParallelToolCalls : typeof rawParallelToolCalls;
		log.warn(`ignoring invalid parallel_tool_calls param: ${summary}`);
	}
	return {
		effectiveExtraParams,
		nativeWebSearchAllowedByToolPolicy
	};
}
//#endregion
export { resolvePreparedExtraParams as a, resolveExplicitCachedContent as c, resolveExtraParams as i, resolveAgentTransportOverride as n, isGooglePromptCacheEligible as o, resolveExplicitSettingsTransport as r, resolveCacheRetention as s, applyExtraParamsToAgent as t };
