import { a as normalizeFastMode, c as normalizeOptionalLowercaseString, g as readStringValue, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { x as parseStrictFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { n as parseBooleanValue } from "./boolean-BEb0Fdt8.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as resolveProviderRequestPolicy } from "./provider-attribution-DCsKu1Yv.mjs";
import { a as getModelProviderRequestRouteFacts, f as resolveProviderRequestPolicyConfig } from "./provider-request-config-By9R9pyt.mjs";
import { a as resolveCodexNativeSearchActivation, i as patchCodexNativeWebSearchPayload } from "./codex-native-web-search-core-DhhrLV_S.mjs";
import { i as streamSimple } from "./stream-4ZQq1Iyd.mjs";
import { t as log$1 } from "./logger-BpegRAAz.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-BoUixBWV.mjs";
import { n as normalizeOpenAIServiceTier, r as supportsOpenAIResponsesFastMode, t as normalizeOpenAIFastMode } from "./openai-fast-mode-B8-SEg6R.mjs";
import { n as createOpenAIResponsesTransportStreamFn } from "./openai-transport-stream-ChSr0UrP.mjs";
import { x as normalizeOpenAICompatibleReasoningPayload, z as mapThinkingLevelToReasoningEffort } from "./provider-stream-shared-D8q3R1a-.mjs";
import { t as resolveMinimaxFastModelId } from "./minimax-fast-mode-ChePImzI.mjs";
import { applyAnthropicEphemeralCacheControlMarkers, applyCompletionsAnthropicCacheControl, applyOpenAIResponsesPayloadPolicy, filterCodeModePayloadTools, flattenCompletionMessagesToStringContent, isCodeModeModelVisibleToolName, readCodeModePayloadToolName, resolveAnthropicEphemeralCacheControl, resolveOpenAIResponsesPayloadPolicy, stripCompletionMessagesToRoleContent } from "@openclaw/ai/transports";
import { codeModeToolSurfaceObserver, hasResponsesWebSearchTool, resolveOpenAIModelReasoningEfforts, resolveOpenAIReasoningEffortForModel, supportsOpenAIReasoningEffort } from "@openclaw/ai/internal/openai";
//#region src/llm/providers/stream-wrappers/anthropic-family-cache-semantics.ts
function isAnthropicModelRef(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).startsWith("anthropic/");
}
/** Matches Application Inference Profile ARNs across all AWS partitions with Bedrock. */
const BEDROCK_APP_INFERENCE_PROFILE_ARN_RE = /^arn:aws(-cn|-us-gov)?:bedrock:/;
function isAnthropicBedrockModel(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (normalized.includes("anthropic.claude") || normalized.includes("anthropic/claude")) return true;
	if (BEDROCK_APP_INFERENCE_PROFILE_ARN_RE.test(normalized) && normalized.includes(":application-inference-profile/")) return (normalized.split(":application-inference-profile/")[1] ?? "").includes("claude");
	return false;
}
function isAnthropicFamilyCacheTtlEligible(params) {
	const normalizedProvider = normalizeOptionalLowercaseString(params.provider);
	if (normalizedProvider === "anthropic" || normalizedProvider === "anthropic-vertex") return true;
	if (normalizedProvider === "amazon-bedrock") return isAnthropicBedrockModel(params.modelId);
	return params.modelApi === "anthropic-messages";
}
function resolveAnthropicCacheRetentionFamily(params) {
	const normalizedProvider = normalizeOptionalLowercaseString(params.provider);
	if (normalizedProvider === "anthropic" || normalizedProvider === "anthropic-vertex") return "anthropic-direct";
	if (normalizedProvider === "amazon-bedrock" && params.hasExplicitCacheConfig && typeof params.modelId === "string") {
		if (isAnthropicBedrockModel(params.modelId)) return "anthropic-bedrock";
		if (BEDROCK_APP_INFERENCE_PROFILE_ARN_RE.test(normalizeLowercaseStringOrEmpty(params.modelId)) && normalizeLowercaseStringOrEmpty(params.modelId).includes(":application-inference-profile/")) return "anthropic-bedrock";
	}
	if (normalizedProvider !== "amazon-bedrock" && params.hasExplicitCacheConfig && params.modelApi === "anthropic-messages") return "custom-anthropic-api";
}
//#endregion
//#region src/agents/openai-text-verbosity.ts
/**
* OpenAI text verbosity normalization for provider-owned stream parameters.
*
* Invalid operator-supplied values are ignored with a warning instead of leaking into API payloads.
*/
function normalizeOpenAITextVerbosity(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "low" || normalized === "medium" || normalized === "high") return normalized;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function resolveOpenAITextVerbosity(extraParams) {
	const raw = extraParams?.textVerbosity ?? extraParams?.text_verbosity;
	const normalized = normalizeOpenAITextVerbosity(raw);
	if (raw !== void 0 && normalized === void 0) {
		const rawSummary = typeof raw === "string" ? raw : typeof raw;
		log$1.warn(`ignoring invalid OpenAI text verbosity param: ${rawSummary}`);
	}
	return normalized;
}
//#endregion
//#region src/logging/code-mode-diagnostic.ts
const MAX_NAMES = 24;
const MAX_NAME_LENGTH = 80;
function isCodeModeDiagnosticEnabled() {
	return isTruthyEnvValue(process.env.OPENCLAW_DEBUG_CODE_MODE);
}
function logCodeModeDiagnostic(log, boundary, fields) {
	if (!isCodeModeDiagnosticEnabled()) return;
	const bounded = Object.fromEntries(Object.entries(fields).map(([key, value]) => {
		if (Array.isArray(value)) {
			const names = [...new Set(value.map((name) => name.slice(0, MAX_NAME_LENGTH)))];
			names.sort((left, right) => left.localeCompare(right));
			return [key, names.slice(0, MAX_NAMES)];
		}
		return [key, typeof value === "string" ? value.slice(0, MAX_NAME_LENGTH) : value];
	}));
	log.info(redactToolPayloadText(`code-mode diagnostic ${JSON.stringify({
		boundary,
		...bounded
	})}`));
}
//#endregion
//#region src/llm/providers/stream-wrappers/openai.ts
const log = createSubsystemLogger("llm/providers/stream-wrappers");
function resolveOpenAITextVerbosityForModel(model, verbosity) {
	const api = normalizeOptionalLowercaseString(model.api);
	const provider = normalizeOptionalLowercaseString(model.provider);
	const id = normalizeOptionalLowercaseString(model.id);
	if (api === "openai-responses" && provider === "openai" && id === "chat-latest") return "medium";
	return verbosity;
}
function resolveOpenAIRequestCapabilities(model) {
	const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
	return resolveProviderRequestPolicyConfig({
		provider: readStringValue(model.provider),
		api: readStringValue(model.api),
		baseUrl: readStringValue(model.baseUrl),
		compat,
		capability: "llm",
		transport: "stream",
		routeFacts: getModelProviderRequestRouteFacts(model)
	}).capabilities;
}
function shouldApplyOpenAIServiceTier(model) {
	return resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "disable" }).allowsServiceTier;
}
function isCodeModeEnabled(config) {
	const tools = config?.tools;
	if (!tools || typeof tools !== "object") return false;
	const codeMode = tools.codeMode;
	if (codeMode === true) return true;
	return Boolean(codeMode && typeof codeMode === "object" && codeMode.enabled === true);
}
function filterCodeModePayloadHookResult(payload, nextPayload, visibleToolNames, allowedHostedToolTypes, observer) {
	const finalPayload = nextPayload === void 0 ? payload : nextPayload;
	filterCodeModePayloadTools(finalPayload, visibleToolNames, allowedHostedToolTypes, observer);
	return nextPayload === void 0 ? void 0 : finalPayload;
}
function resolveCodeModeVisibleToolNames(context) {
	if (!Array.isArray(context.tools)) return;
	const names = new Set(context.tools.map(readCodeModePayloadToolName).filter((name) => typeof name === "string"));
	return isCodeModeModelVisibleToolName("exec", names) && isCodeModeModelVisibleToolName("wait", names) ? names : void 0;
}
function shouldApplyOpenAIReasoningCompatibility(model) {
	const api = readStringValue(model.api);
	const provider = readStringValue(model.provider);
	if (!api || !provider) return false;
	return resolveOpenAIRequestCapabilities(model).supportsOpenAIReasoningCompatPayload;
}
function readOpenAICompletionsCompat(model) {
	return model.api === "openai-completions" && model.compat && typeof model.compat === "object" ? model.compat : void 0;
}
function resolveOpenAIThinkingPayloadEffort(params) {
	const provider = normalizeOptionalLowercaseString(params.model.provider);
	const defaultEffort = mapThinkingLevelToReasoningEffort(params.thinkingLevel);
	const usesNativeMax = provider === "openai" && supportsOpenAIReasoningEffort(params.model, "max");
	const mapped = provider === "openai" && (params.thinkingLevel === "max" || params.thinkingLevel === "minimal" && usesNativeMax) ? resolveOpenAIReasoningEffortForModel({
		model: params.model,
		effort: params.thinkingLevel
	}) ?? defaultEffort : defaultEffort;
	if (mapped !== "minimal" || !hasResponsesWebSearchTool(params.payloadObj.tools)) return mapped;
	return resolveOpenAIReasoningEffortForModel({
		model: params.model,
		effort: "low"
	}) ?? mapped;
}
function raiseMinimalReasoningForResponsesWebSearchPayload(params) {
	const reasoning = params.payloadObj.reasoning;
	if (!isRecord(reasoning) || reasoning.effort !== "minimal") return;
	if (!hasResponsesWebSearchTool(params.payloadObj.tools)) return;
	const nextEffort = resolveOpenAIReasoningEffortForModel({
		model: params.model,
		effort: "low"
	});
	if (nextEffort && nextEffort !== "minimal" && nextEffort !== "none") reasoning.effort = nextEffort;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function resolveOpenAIServiceTier(extraParams) {
	const raw = extraParams?.serviceTier ?? extraParams?.service_tier;
	const normalized = normalizeOpenAIServiceTier(raw);
	if (raw !== void 0 && normalized === void 0) {
		const rawSummary = typeof raw === "string" ? raw : typeof raw;
		log.warn(`ignoring invalid OpenAI service tier param: ${rawSummary}`);
	}
	return normalized;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function resolveOpenAIFastMode(extraParams) {
	const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
	const normalized = normalizeOpenAIFastMode(raw);
	if (raw !== void 0 && normalized === void 0 && typeof raw !== "function" && normalizeFastMode(raw) !== "auto") {
		const rawSummary = typeof raw === "string" ? raw : typeof raw;
		log.warn(`ignoring invalid OpenAI fast mode param: ${rawSummary}`);
	}
	return normalized;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIResponsesContextManagementWrapper(baseStreamFn, extraParams) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const policy = resolveOpenAIResponsesPayloadPolicy(model, {
			extraParams,
			enablePromptCacheStripping: true,
			enableServerCompaction: true,
			storeMode: "provider-policy"
		});
		if (policy.explicitStore === void 0 && !policy.useServerCompaction && !policy.shouldStripStore && !policy.shouldStripPromptCache && !policy.shouldStripDisabledReasoningPayload) return underlying(model, context, options);
		const replayResponsesItemIds = (policy.shouldStripStore ? false : policy.explicitStore) ?? options?.replayResponsesItemIds;
		const nextOptions = {
			...options,
			...replayResponsesItemIds === void 0 ? {} : { replayResponsesItemIds }
		};
		return streamWithPayloadPatch(underlying, model, context, nextOptions, (payload) => {
			applyOpenAIResponsesPayloadPolicy(payload, policy);
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIReasoningCompatibilityWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!shouldApplyOpenAIReasoningCompatibility(model)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			applyOpenAIResponsesPayloadPolicy(payloadObj, resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "preserve" }));
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIStringContentWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (readOpenAICompletionsCompat(model)?.requiresStringContent !== true) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			if (!Array.isArray(payloadObj.messages)) return;
			payloadObj.messages = flattenCompletionMessagesToStringContent(payloadObj.messages);
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAICompletionsStrictMessageKeysWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (readOpenAICompletionsCompat(model)?.strictMessageKeys !== true) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			if (!Array.isArray(payloadObj.messages)) return;
			payloadObj.messages = stripCompletionMessagesToRoleContent(payloadObj.messages);
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAICompletionsToolsCompatWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (readOpenAICompletionsCompat(model)?.supportsTools !== false) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			delete payloadObj.tools;
			delete payloadObj.tool_choice;
			delete payloadObj.parallel_tool_calls;
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIThinkingLevelWrapper(baseStreamFn, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	if (!thinkingLevel) return underlying;
	return (model, context, options) => {
		if (!shouldApplyOpenAIReasoningCompatibility(model)) {
			if (thinkingLevel === "off") return underlying(model, context, options);
			return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
				raiseMinimalReasoningForResponsesWebSearchPayload({
					model,
					payloadObj
				});
			});
		}
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			const existingReasoning = payloadObj.reasoning;
			if (thinkingLevel === "off") {
				if (existingReasoning !== void 0) delete payloadObj.reasoning;
				return;
			}
			const reasoningEffort = resolveOpenAIThinkingPayloadEffort({
				model,
				payloadObj,
				thinkingLevel
			});
			if (existingReasoning === "none") {
				payloadObj.reasoning = { effort: reasoningEffort };
				return;
			}
			if (isRecord(existingReasoning)) {
				existingReasoning.effort = reasoningEffort;
				raiseMinimalReasoningForResponsesWebSearchPayload({
					model,
					payloadObj
				});
			}
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIFastModeWrapper(baseStreamFn, enabled = true) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const fastMode = normalizeOpenAIFastMode(enabled);
		if (!fastMode || !supportsOpenAIResponsesFastMode(model)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (payload.service_tier === void 0 && shouldApplyOpenAIServiceTier(model)) payload.service_tier = fastMode === "ultrafast" ? "ultrafast" : "priority";
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIServiceTierWrapper(baseStreamFn, serviceTier) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!shouldApplyOpenAIServiceTier(model)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			if (payloadObj.service_tier === void 0) payloadObj.service_tier = serviceTier;
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAITextVerbosityWrapper(baseStreamFn, verbosity) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.api !== "openai-responses" && model.api !== "openai-chatgpt-responses") return underlying(model, context, options);
		const resolvedVerbosity = resolveOpenAITextVerbosityForModel(model, verbosity);
		const shouldOverrideExistingVerbosity = model.api === "openai-chatgpt-responses" || resolvedVerbosity !== verbosity;
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			const existingText = payload.text && typeof payload.text === "object" ? payload.text : {};
			if (shouldOverrideExistingVerbosity || existingText.verbosity === void 0) payload.text = {
				...existingText,
				verbosity: resolvedVerbosity
			};
		});
	};
}
/** @deprecated OpenAI Codex provider-owned stream helper; do not use from third-party plugins. */
function createCodexNativeWebSearchWrapper(baseStreamFn, params) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const codeModeSurfaceFromOptions = options?.openclawCodeModeToolSurface === true;
		const codeModeVisibleToolNames = resolveCodeModeVisibleToolNames(context);
		const resolveNativeSearchActivation = () => resolveCodexNativeSearchActivation({
			config: params.config,
			modelProvider: readStringValue(model.provider),
			modelApi: readStringValue(model.api),
			modelId: readStringValue(model.id),
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sandboxToolPolicy: params.sandboxToolPolicy,
			messageProvider: params.messageProvider,
			agentAccountId: params.agentAccountId,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			agentDir: params.agentDir
		});
		if ((params.codeModeToolSurfaceEnabled === true || codeModeSurfaceFromOptions || isCodeModeEnabled(params.config)) && codeModeVisibleToolNames) {
			const allowedHostedToolTypes = options?.openclawCodeModeAllowedHostedToolTypes ?? /* @__PURE__ */ new Set();
			const activation = params.nativeWebSearchAllowedByToolPolicy === false ? void 0 : resolveNativeSearchActivation();
			if (activation?.state === "native_active") allowedHostedToolTypes.add("web_search");
			if (activation?.state === "native_active" || activation?.codexNativeEnabled) {
				const outcome = activation.state === "native_active" ? `activating (${activation.codexMode})` : `skipping (${activation.inactiveReason ?? "inactive"})`;
				log.debug(`${outcome} Codex native web search alongside code mode for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`);
			}
			const originalOnPayload = options?.onPayload;
			const codeModeDiagnosticsEnabled = isCodeModeDiagnosticEnabled();
			const existingToolSurfaceObserver = codeModeToolSurfaceObserver.get(options);
			const existingToolSurfaceCollector = codeModeToolSurfaceObserver.getCollector(options);
			const observedBeforeToolIdentities = /* @__PURE__ */ new Set();
			const collectToolSurface = existingToolSurfaceCollector ?? (codeModeDiagnosticsEnabled ? ({ beforeToolIdentities }) => {
				for (const identity of beforeToolIdentities) observedBeforeToolIdentities.add(identity);
			} : void 0);
			let diagnosticEmitted = false;
			const observeToolSurface = existingToolSurfaceObserver ?? (codeModeDiagnosticsEnabled ? ({ beforeToolIdentities, afterToolIdentities }) => {
				for (const identity of beforeToolIdentities) observedBeforeToolIdentities.add(identity);
				if (diagnosticEmitted) return;
				diagnosticEmitted = true;
				const retained = new Set(afterToolIdentities);
				const allBeforeToolIdentities = [...observedBeforeToolIdentities];
				logCodeModeDiagnostic(log, "provider-tool-surface", {
					provider: readStringValue(model.provider),
					model: readStringValue(model.id),
					beforeToolIdentities: allBeforeToolIdentities,
					afterToolIdentities,
					removedToolIdentities: allBeforeToolIdentities.filter((identity) => !retained.has(identity))
				});
			} : void 0);
			const codeModeOptions = {
				...options,
				openclawCodeModeToolSurface: true,
				openclawCodeModeAllowedHostedToolTypes: allowedHostedToolTypes,
				onPayload: (payload) => {
					if (activation?.state === "native_active") patchCodexNativeWebSearchPayload({
						payload,
						config: params.config
					});
					filterCodeModePayloadHookResult(payload, void 0, codeModeVisibleToolNames, allowedHostedToolTypes, collectToolSurface);
					const nextPayload = originalOnPayload?.(payload, model);
					if (isPromiseLike(nextPayload)) return Promise.resolve(nextPayload).then((resolvedPayload) => filterCodeModePayloadHookResult(payload, resolvedPayload, codeModeVisibleToolNames, allowedHostedToolTypes, observeToolSurface));
					return filterCodeModePayloadHookResult(payload, nextPayload, codeModeVisibleToolNames, allowedHostedToolTypes, observeToolSurface);
				}
			};
			if (observeToolSurface && !existingToolSurfaceObserver) codeModeToolSurfaceObserver.set(codeModeOptions, observeToolSurface, collectToolSurface);
			return underlying(model, context, codeModeOptions);
		}
		if (params.nativeWebSearchAllowedByToolPolicy === false) {
			log.debug(`skipping Codex native web search (tool_policy_denied) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`);
			return underlying(model, context, options);
		}
		const activation = resolveNativeSearchActivation();
		if (activation.state !== "native_active") {
			if (activation.codexNativeEnabled) log.debug(`skipping Codex native web search (${activation.inactiveReason ?? "inactive"}) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`);
			return underlying(model, context, options);
		}
		log.debug(`activating Codex native web search (${activation.codexMode}) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`);
		const originalOnPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			onPayload: (payload) => {
				const result = patchCodexNativeWebSearchPayload({
					payload,
					config: params.config
				});
				if (result.status === "payload_not_object") log.debug("Skipping Codex native web search injection because provider payload is not an object");
				else if (result.status === "native_tool_already_present") log.debug("Codex native web search tool already present in provider payload");
				else if (result.status === "injected") log.debug("Injected Codex native web search tool into provider payload");
				return originalOnPayload?.(payload, model);
			}
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIAttributionHeadersWrapper(baseStreamFn, opts) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const capabilities = resolveOpenAIRequestCapabilities(model);
		const attributionProvider = capabilities.attributionProvider;
		if (attributionProvider !== "openai") return underlying(model, context, options);
		return (readStringValue(model.api) === "openai-chatgpt-responses" && capabilities.endpointClass === "openai" && (baseStreamFn === void 0 || baseStreamFn === streamSimple) ? opts?.codexNativeTransportStreamFn ?? createOpenAIResponsesTransportStreamFn() : underlying)(model, context, {
			...options,
			headers: resolveProviderRequestPolicyConfig({
				provider: attributionProvider,
				api: readStringValue(model.api),
				baseUrl: readStringValue(model.baseUrl),
				capability: "llm",
				transport: "stream",
				routeFacts: getModelProviderRequestRouteFacts(model),
				callerHeaders: options?.headers,
				precedence: "defaults-win"
			}).headers
		});
	};
}
//#endregion
//#region src/llm/providers/stream-wrappers/minimax.ts
function isMinimaxAnthropicMessagesModel(model) {
	return model.api === "anthropic-messages" && (model.provider === "minimax" || model.provider === "minimax-portal");
}
function isMinimaxM3Model(model) {
	const modelId = typeof model.id === "string" ? model.id.trim() : "";
	return /^MiniMax-M3(\b|[-.])/i.test(modelId);
}
function resolvePositiveMaxTokens(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
/** @deprecated MiniMax provider-owned stream helper; do not use from third-party plugins. */
function createMinimaxFastModeWrapper(baseStreamFn, fastMode) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if ((typeof fastMode === "function" ? fastMode() : fastMode) !== true) return underlying(model, context, options);
		const fastModelId = resolveMinimaxFastModelId(model);
		if (!fastModelId) return underlying(model, context, options);
		return underlying({
			...model,
			id: fastModelId
		}, context, options);
	};
}
function createMinimaxThinkingDisabledWrapper(baseStreamFn, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!isMinimaxAnthropicMessagesModel(model)) return underlying(model, context, options);
		const isM3 = isMinimaxM3Model(model);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (isM3) {
				const thinkingType = asOptionalRecord(payload.thinking)?.type;
				if (thinkingLevel === void 0 && thinkingType === "disabled") delete payload.thinking;
				else if (thinkingLevel !== "off" && (thinkingType === "enabled" || thinkingType === "disabled")) {
					payload.thinking = { type: "adaptive" };
					const maxTokens = resolvePositiveMaxTokens(options?.maxTokens);
					if (maxTokens !== void 0) payload.max_tokens = maxTokens;
				}
			}
			if (!isM3 && payload.thinking === void 0) payload.thinking = { type: "disabled" };
		});
	};
}
//#endregion
//#region src/llm/providers/stream-wrappers/proxy.ts
const BOOLEAN_PARAM_PARSE_OPTIONS = {
	truthy: [
		"1",
		"true",
		"yes",
		"on",
		"enable",
		"enabled"
	],
	falsy: [
		"0",
		"false",
		"no",
		"off",
		"disable",
		"disabled"
	]
};
function resolveModelEndpointClass(model) {
	return getModelProviderRequestRouteFacts(model)?.capabilities.endpointClass ?? resolveProviderRequestPolicy({
		provider: readStringValue(model.provider),
		api: readStringValue(model.api),
		baseUrl: readStringValue(model.baseUrl),
		capability: "llm",
		transport: "stream"
	}).endpointClass;
}
function readExtraParam(extraParams, keys) {
	if (!extraParams) return;
	for (const key of keys) if (Object.hasOwn(extraParams, key)) return extraParams[key];
}
function resolveOpenRouterResponseCacheTtlSeconds(value) {
	const parsed = typeof value === "number" ? value : typeof value === "string" ? parseStrictFiniteNumber(value) : void 0;
	if (parsed === void 0) return;
	return String(Math.max(1, Math.min(86400, Math.trunc(parsed))));
}
function isOpenRouterEndpoint(model) {
	const provider = readStringValue(model.provider);
	const endpointClass = resolveModelEndpointClass(model);
	return endpointClass === "openrouter" || endpointClass === "default" && normalizeOptionalLowercaseString(provider) === "openrouter";
}
function resolveOpenRouterResponseCacheHeaders(model, extraParams) {
	if (!isOpenRouterEndpoint(model)) return;
	const configuredCache = parseBooleanValue(readExtraParam(extraParams, ["responseCache", "response_cache"]), BOOLEAN_PARAM_PARSE_OPTIONS);
	const clearCache = parseBooleanValue(readExtraParam(extraParams, ["responseCacheClear", "response_cache_clear"]), BOOLEAN_PARAM_PARSE_OPTIONS);
	const cacheEnabled = configuredCache ?? (clearCache ? true : void 0);
	if (cacheEnabled === void 0) return;
	const headers = { "X-OpenRouter-Cache": cacheEnabled ? "true" : "false" };
	if (!cacheEnabled) return headers;
	const ttl = resolveOpenRouterResponseCacheTtlSeconds(readExtraParam(extraParams, [
		"responseCacheTtlSeconds",
		"response_cache_ttl_seconds",
		"responseCacheTtl",
		"response_cache_ttl"
	]));
	if (ttl) headers["X-OpenRouter-Cache-TTL"] = ttl;
	if (clearCache) headers["X-OpenRouter-Cache-Clear"] = "true";
	return headers;
}
/** @deprecated OpenRouter provider-owned stream helper; do not use from third-party plugins. */
function createOpenRouterSystemCacheWrapper(baseStreamFn, extraParams) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const modelId = readStringValue(model.id);
		if (!isOpenRouterEndpoint(model) || !modelId || !isAnthropicModelRef(modelId)) return underlying(model, context, options);
		const isCompletions = model.api === "openai-completions";
		const cacheRetention = readCacheRetention(options?.cacheRetention) ?? readCacheRetention(extraParams?.cacheRetention);
		return streamWithPayloadPatch(underlying, model, context, isCompletions ? {
			...options,
			cacheRetention
		} : stripCacheRetentionOption(options), (payloadObj) => {
			(isCompletions ? applyCompletionsAnthropicCacheControl : applyAnthropicEphemeralCacheControlMarkers)(payloadObj, resolveAnthropicEphemeralCacheControl(readStringValue(model.baseUrl), cacheRetention) ?? null);
		});
	};
}
function readCacheRetention(value) {
	return value === "long" || value === "none" || value === "short" ? value : void 0;
}
function stripCacheRetentionOption(options) {
	if (!options || !Object.hasOwn(options, "cacheRetention")) return options;
	const { cacheRetention: _cacheRetention, ...rest } = options;
	return rest;
}
/** @deprecated OpenRouter provider-owned stream helper; do not use from third-party plugins. */
function createOpenRouterWrapper(baseStreamFn, thinkingLevel, extraParams) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const providerHeaders = resolveOpenRouterResponseCacheHeaders(model, extraParams);
		const headers = resolveProviderRequestPolicyConfig({
			provider: readStringValue(model.provider) ?? "openrouter",
			api: readStringValue(model.api),
			baseUrl: readStringValue(model.baseUrl),
			capability: "llm",
			transport: "stream",
			routeFacts: getModelProviderRequestRouteFacts(model),
			callerHeaders: options?.headers,
			providerHeaders,
			precedence: "caller-wins"
		}).headers;
		return streamWithPayloadPatch(underlying, model, context, {
			...options,
			headers
		}, (payload) => {
			normalizeOpenAICompatibleReasoningPayload(payload, resolveOpenAIModelReasoningEfforts({ compat: model.compat })?.length === 0 ? void 0 : thinkingLevel);
		});
	};
}
/** @deprecated Proxy provider-owned stream helper; do not use from third-party plugins. */
function isProxyReasoningUnsupported(modelId) {
	return normalizeOptionalLowercaseString(modelId)?.startsWith("x-ai/") ?? false;
}
/** @deprecated Kilocode provider-owned stream helper; do not use from third-party plugins. */
function createKilocodeWrapper(baseStreamFn, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const headers = resolveProviderRequestPolicyConfig({
			provider: readStringValue(model.provider) ?? "kilocode",
			api: readStringValue(model.api),
			baseUrl: readStringValue(model.baseUrl),
			capability: "llm",
			transport: "stream",
			routeFacts: getModelProviderRequestRouteFacts(model),
			callerHeaders: options?.headers,
			providerHeaders: { "X-KILOCODE-FEATURE": process.env.KILOCODE_FEATURE?.trim() || "openclaw" },
			precedence: "defaults-win"
		}).headers;
		return streamWithPayloadPatch(underlying, model, context, {
			...options,
			headers
		}, (payload) => {
			normalizeOpenAICompatibleReasoningPayload(payload, thinkingLevel);
		});
	};
}
//#endregion
export { isAnthropicFamilyCacheTtlEligible as C, resolveOpenAITextVerbosity as S, resolveAnthropicCacheRetentionFamily as T, createOpenAIThinkingLevelWrapper as _, createMinimaxFastModeWrapper as a, isCodeModeDiagnosticEnabled as b, createOpenAIAttributionHeadersWrapper as c, createOpenAIFastModeWrapper as d, createOpenAIReasoningCompatibilityWrapper as f, createOpenAITextVerbosityWrapper as g, createOpenAIStringContentWrapper as h, isProxyReasoningUnsupported as i, createOpenAICompletionsStrictMessageKeysWrapper as l, createOpenAIServiceTierWrapper as m, createOpenRouterSystemCacheWrapper as n, createMinimaxThinkingDisabledWrapper as o, createOpenAIResponsesContextManagementWrapper as p, createOpenRouterWrapper as r, createCodexNativeWebSearchWrapper as s, createKilocodeWrapper as t, createOpenAICompletionsToolsCompatWrapper as u, resolveOpenAIFastMode as v, isAnthropicModelRef as w, logCodeModeDiagnostic as x, resolveOpenAIServiceTier as y };
