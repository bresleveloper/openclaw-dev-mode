import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as sanitizeExtraParamsRecord, i as resolveModelExtraParamSources, r as resolveAliasedParamValue } from "./model-extra-params-C1g6s41K.mjs";
import { n as ensureProviderRuntimePluginHandle, r as getModelProviderRuntimePluginHandle } from "./provider-hook-runtime-v-FSBQP8.mjs";
import { r as isNativeWebSearchAllowedByToolPolicy } from "./codex-native-web-search-core-TdPPHJ29.mjs";
import { i as streamSimple } from "./stream-CL_UFGCU.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { T as resolveAnthropicCacheRetentionFamily, h as createOpenAIStringContentWrapper, l as createOpenAICompletionsStrictMessageKeysWrapper, n as createOpenRouterSystemCacheWrapper, o as createMinimaxThinkingDisabledWrapper, p as createOpenAIResponsesContextManagementWrapper, u as createOpenAICompletionsToolsCompatWrapper } from "./proxy-BUToql5i.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-BoUixBWV.mjs";
import { r as createOpenAICompletionsPayloadPolicyWrapper } from "./ai-transport-runtime-host-Csx7HNwj.mjs";
import { l as createGoogleThinkingPayloadWrapper, m as createThinkingOnlyFinalTextWrapper, s as createDeepSeekV4OpenAICompatibleThinkingWrapper } from "./provider-stream-shared-CU7Z6wj0.mjs";
import { canonicalizeMaxTokensParam, detectOpenAICompletionsCompat, resolveMaxTokensParam, resolveOpenAICompletionsCompat, resolveOpenAIPromptCacheKeySupport } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-runner/prompt-cache-retention.ts
/**
* Resolves provider/model prompt-cache retention behavior.
*/
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
	const resolvedExtraParams = params.resolvedExtraParams ?? resolveExtraParams({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId
	});
	const override = stripRequestScopedExtraParams(sanitizeExtraParamsOverride(params.extraParamsOverride));
	const merged = {
		...sanitizeExtraParamsRecord(resolvedExtraParams),
		...override
	};
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
function hasRequestScopedExtraParams(value) {
	return [...REQUEST_SCOPED_EXTRA_PARAM_KEYS].some((key) => Object.hasOwn(value, key));
}
function applyDefaultOpenAIGptRuntimeParams(params, merged) {
	if (params.provider !== "openai" || !/^gpt-5(?:[.-]|$)/i.test(params.modelId)) return;
	if (!Object.hasOwn(merged, "parallel_tool_calls") && !Object.hasOwn(merged, "parallelToolCalls")) merged.parallel_tool_calls = true;
	if (!Object.hasOwn(merged, "text_verbosity") && !Object.hasOwn(merged, "textVerbosity")) merged.text_verbosity = "low";
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
	if (typeof extraParams.topP === "number") streamParams.topP = extraParams.topP;
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
	const cachedContent = typeof extraParams.cachedContent === "string" ? extraParams.cachedContent : typeof extraParams.cached_content === "string" ? extraParams.cached_content : void 0;
	if (typeof cachedContent === "string" && cachedContent.trim()) streamParams.cachedContent = cachedContent.trim();
	for (const keys of [["frequencyPenalty", "frequency_penalty"], ["presencePenalty", "presence_penalty"]]) {
		const value = resolveAliasedParamValue([extraParams], keys);
		if (typeof value === "number") streamParams[keys[0]] = value;
	}
	if (typeof extraParams.seed === "number") streamParams.seed = extraParams.seed;
	const resolvedStop = normalizeStopSequences(extraParams.stop);
	if (resolvedStop) streamParams.stop = resolvedStop;
	const readCacheCompat = (m) => m?.api === "openai-completions" ? resolveOpenAICompletionsCompat(m) : m?.compat;
	if (log.isEnabled("debug")) {
		const initialCacheRetention = resolveCacheRetention(extraParams, provider, typeof model?.api === "string" ? model.api : void 0, typeof model?.id === "string" ? model.id : void 0, readCacheCompat(model), model?.baseUrl);
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
		const cacheRetention = resolveCacheRetention(extraParams, provider, typeof callModel.api === "string" ? callModel.api : void 0, typeof callModel.id === "string" ? callModel.id : void 0, readCacheCompat(callModel), callModel.baseUrl);
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
function applyPrePluginStreamWrappers(ctx) {
	const baseExtraParams = ctx.override && hasRequestScopedExtraParams(ctx.override) ? stripRequestScopedExtraParams(ctx.effectiveExtraParams) : ctx.effectiveExtraParams;
	const streamParams = ctx.override ? {
		...baseExtraParams,
		...ctx.override
	} : baseExtraParams;
	const wrappedStreamFn = createStreamFnWithExtraParams(ctx.agent.streamFn, streamParams, ctx.provider, ctx.model);
	if (wrappedStreamFn) {
		log.debug(`applying extraParams to agent streamFn for ${ctx.provider}/${ctx.modelId}`);
		ctx.agent.streamFn = wrappedStreamFn;
	}
	if (shouldApplySiliconFlowThinkingOffCompat({
		provider: ctx.provider,
		modelId: ctx.modelId,
		thinkingLevel: ctx.thinkingLevel
	})) {
		log.debug(`normalizing thinking=off to thinking=null for SiliconFlow compatibility (${ctx.provider}/${ctx.modelId})`);
		ctx.agent.streamFn = createSiliconFlowThinkingWrapper(ctx.agent.streamFn);
	}
}
function applyPostPluginStreamWrappers(ctx) {
	const streamParams = ctx.override ? {
		...ctx.effectiveExtraParams,
		...ctx.override
	} : ctx.effectiveExtraParams;
	ctx.agent.streamFn = createOpenRouterSystemCacheWrapper(ctx.agent.streamFn, streamParams);
	ctx.agent.streamFn = createOpenAIStringContentWrapper(ctx.agent.streamFn);
	ctx.agent.streamFn = createOpenAICompletionsStrictMessageKeysWrapper(ctx.agent.streamFn);
	ctx.agent.streamFn = createOpenAICompletionsToolsCompatWrapper(ctx.agent.streamFn);
	if (!ctx.providerWrapperHandled) {
		ctx.agent.streamFn = createDeepSeekV4OpenAICompatibleThinkingWrapper({
			baseStreamFn: ctx.agent.streamFn,
			thinkingLevel: ctx.thinkingLevel,
			shouldPatchModel: (model) => isDeepSeekV4OpenAICompletionsModel(model) && !isMicrosoftFoundryProviderId(model.provider) && deepSeekV4NativeThinkingAllowedByCompat(model)
		});
		ctx.agent.streamFn = createDeepSeekV4NonNativeCompatSanitizerWrapper(ctx.agent.streamFn);
		ctx.agent.streamFn = createDeepSeekV4OpenAICompatibleThinkingWrapper({
			baseStreamFn: ctx.agent.streamFn,
			thinkingLevel: ctx.thinkingLevel,
			shouldPatchModel: (model) => isMiMoOpenAICompatibleModel(model, MIMO_REASONING_OPENAI_COMPATIBLE_MODEL_IDS)
		});
		ctx.agent.streamFn = createThinkingOnlyFinalTextWrapper({
			baseStreamFn: ctx.agent.streamFn,
			shouldPatchModel: (model) => isMiMoOpenAICompatibleModel(model, MIMO_REASONING_AS_VISIBLE_TEXT_MODEL_IDS)
		});
		ctx.agent.streamFn = createGoogleThinkingPayloadWrapper(ctx.agent.streamFn, ctx.thinkingLevel);
		ctx.agent.streamFn = createOpenAIResponsesContextManagementWrapper(ctx.agent.streamFn, ctx.effectiveExtraParams);
	}
	ctx.agent.streamFn = createMinimaxThinkingDisabledWrapper(ctx.agent.streamFn, ctx.thinkingLevel);
	ctx.agent.streamFn = createOpenAICompletionsPayloadPolicyWrapper(requireBaseStreamFn(ctx.agent.streamFn), [ctx.effectiveExtraParams, ctx.override]);
	const rawParallelToolCalls = resolveAliasedParamValue([ctx.effectiveExtraParams, ctx.override], ["parallel_tool_calls", "parallelToolCalls"]);
	if (rawParallelToolCalls === void 0) return;
	if (typeof rawParallelToolCalls === "boolean") {
		ctx.agent.streamFn = createParallelToolCallsWrapper(ctx.agent.streamFn, rawParallelToolCalls);
		return;
	}
	if (rawParallelToolCalls === null) {
		log.debug("parallel_tool_calls suppressed by null override, skipping injection");
		return;
	}
	const summary = typeof rawParallelToolCalls === "string" ? rawParallelToolCalls : typeof rawParallelToolCalls;
	log.warn(`ignoring invalid parallel_tool_calls param: ${summary}`);
}
function normalizeDeepSeekV4CandidateId(modelId) {
	if (typeof modelId !== "string") return;
	const normalized = modelId.trim().toLowerCase();
	const suffixIndex = normalized.indexOf(":");
	return (suffixIndex === -1 ? normalized : normalized.slice(0, suffixIndex)).split("/").pop();
}
function isDeepSeekV4OpenAICompletionsModel(model) {
	const normalizedModelId = normalizeDeepSeekV4CandidateId(model.id);
	return model.api === "openai-completions" && (normalizedModelId === "deepseek-flash" || normalizedModelId === "deepseek-v4-flash" || normalizedModelId === "deepseek-v4-pro");
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
	const thinkingFormat = resolveDeepSeekV4ThinkingFormatOverride(model);
	return thinkingFormat === void 0 || thinkingFormat === "deepseek";
}
function resolveDeepSeekV4ThinkingFormatOverride(model) {
	const compat = model.compat;
	const configured = compat && typeof compat === "object" ? compat.thinkingFormat : void 0;
	if (typeof configured === "string") return configured;
	const detected = detectOpenAICompletionsCompat(model).defaults.thinkingFormat;
	return detected === "openrouter" || detected === "together" || detected === "zai" ? detected : void 0;
}
function createDeepSeekV4NonNativeCompatSanitizerWrapper(baseStreamFn) {
	if (!baseStreamFn) return;
	return (model, context, options) => {
		if (!isDeepSeekV4OpenAICompletionsModel(model) || !isMicrosoftFoundryProviderId(model.provider) && deepSeekV4NativeThinkingAllowedByCompat(model)) return baseStreamFn(model, context, options);
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
function isMiMoOpenAICompatibleModel(model, modelIds) {
	const normalizedModelId = normalizeDeepSeekV4CandidateId(model.id);
	return model.api === "openai-completions" && normalizedModelId !== void 0 && modelIds.has(normalizedModelId);
}
function applyExtraParamsToAgent(agent, cfg, provider, modelId, extraParamsOverride, thinkingLevel, agentId, workspaceDir, model, agentDir, resolvedTransport, options) {
	const providerRuntimeHandle = ensureProviderRuntimePluginHandle({
		provider,
		modelId,
		config: cfg,
		workspaceDir,
		runtimeHandle: getModelProviderRuntimePluginHandle(model)
	});
	const resolvedExtraParams = resolveExtraParams({
		cfg,
		provider,
		modelId,
		agentId
	});
	const override = sanitizeExtraParamsOverride(extraParamsOverride);
	const effectiveExtraParams = options?.preparedExtraParams ?? resolvePreparedExtraParams({
		cfg,
		provider,
		modelId,
		extraParamsOverride,
		thinkingLevel,
		agentId,
		agentDir,
		workspaceDir,
		resolvedExtraParams,
		model,
		resolvedTransport,
		providerRuntimeHandle,
		auth: options?.auth
	});
	const wrapperContext = {
		agent,
		provider,
		modelId,
		thinkingLevel,
		model,
		effectiveExtraParams,
		override
	};
	const providerStreamBase = agent.streamFn;
	const nativeWebSearchAllowedByToolPolicy = options?.nativeWebSearchPolicyContext ? isNativeWebSearchAllowedByToolPolicy({
		config: cfg,
		modelProvider: model?.provider,
		modelId: model?.id,
		agentId,
		...options.nativeWebSearchPolicyContext
	}) : void 0;
	const pluginWrappedStreamFn = providerRuntimeHandle.plugin?.wrapStreamFn?.({
		config: cfg,
		agentDir,
		workspaceDir,
		agentId,
		auth: options?.auth,
		nativeWebSearchAllowedByToolPolicy,
		provider,
		modelId,
		extraParams: effectiveExtraParams,
		thinkingLevel,
		model,
		streamFn: providerStreamBase
	}) ?? void 0;
	agent.streamFn = pluginWrappedStreamFn ?? providerStreamBase;
	applyPrePluginStreamWrappers(wrapperContext);
	const providerWrapperHandled = pluginWrappedStreamFn !== void 0 && pluginWrappedStreamFn !== providerStreamBase;
	applyPostPluginStreamWrappers({
		...wrapperContext,
		providerWrapperHandled
	});
	return {
		effectiveExtraParams,
		nativeWebSearchAllowedByToolPolicy
	};
}
//#endregion
export { resolvePreparedExtraParams as a, resolveExtraParams as i, resolveAgentTransportOverride as n, isGooglePromptCacheEligible as o, resolveExplicitSettingsTransport as r, resolveCacheRetention as s, applyExtraParamsToAgent as t };
