import { A as supportsClaudeNativeMaxEffort, C as resolveClaudeOpus5ModelIdentity, N as usesClaude5RequestContract, S as resolveClaudeOpus55ModelIdentity, T as resolveClaudeSonnet5ModelIdentity, _ as resolveClaudeFable5ModelIdentity, a as CLAUDE_FABLE_5_THINKING_PROFILE, d as bindsClaudeThinkingPrefix, g as requiresClaudeMandatoryAdaptiveThinking, h as requiresClaudeDefaultSampling, j as supportsClaudeNativeXhighEffort, l as CLAUDE_SONNET_55_THINKING_PROFILE, o as CLAUDE_HAIKU_55_THINKING_PROFILE, p as rejectsClaudeAssistantPrefill, s as CLAUDE_OPUS_55_THINKING_PROFILE, t as calculateUsageCost, v as resolveClaudeHaiku55ModelIdentity, w as resolveClaudeSonnet55ModelIdentity, x as resolveClaudeNativeThinkingLevelMap, y as resolveClaudeModelIdentity } from "./src-Ii137Gdc.mjs";
import { t as DEFAULT_MISSING_TOOL_RESULT_TEXT } from "./types-DIBUKaTM.mjs";
import { i as asOptionalRecord, o as isRecord } from "./record-coerce-BgUo6bj4.mjs";
import { r as normalizeLowercaseStringOrEmpty } from "./string-coerce-CpcyRbc6.mjs";
import { I as MODEL_CATALOG_THINKING_LEVELS, L as listMappedModelThinkingLevels, i as OPENAI_RESPONSES_APIS, k as resolveOpenAIModelReasoningEfforts, z as resolveOpenAIThinkingApi } from "./openai-responses-contracts-BTBx9zkC.mjs";
// packages/ai/src/media-payload.ts
/** Media metadata alone is not an attachment; provider emitters need inline bytes. */
function hasMediaPayload(block) {
	return isRecord(block) && typeof block.data === "string" && block.data.trim().length > 0;
}
/** Image metadata alone is not an attachment; provider emitters need inline bytes. */
function isImageWithMediaPayload(block) {
	return isRecord(block) && block.type === "image" && hasMediaPayload(block);
}
// packages/ai/src/model-utils.ts
/** Calculates and stores model cost fields from token usage and per-million pricing. */
function calculateCost(model, usage) {
	Object.assign(usage.cost, calculateUsageCost(usage, model.cost));
	return usage.cost;
}
/** Replaces the catalog estimate when the provider reports an authoritative billed total. */
function applyProviderReportedUsageCost(usage, reportedCost) {
	if (typeof reportedCost !== "number" || !Number.isFinite(reportedCost) || reportedCost < 0) return;
	usage.cost.total = reportedCost;
	usage.cost.totalOrigin = "provider-billed";
}
function resolveThinkingLevelMap(model) {
	return model.api === "anthropic-messages" ? resolveClaudeNativeThinkingLevelMap(model) ?? model.thinkingLevelMap : model.thinkingLevelMap;
}
/** Returns thinking levels exposed by a reasoning-capable model. */
function getSupportedThinkingLevels(model) {
	const mandatoryAdaptiveContract = model.api === "anthropic-messages" && requiresClaudeMandatoryAdaptiveThinking(model);
	if (!model.reasoning && !mandatoryAdaptiveContract) return ["off"];
	const thinkingLevelMap = resolveThinkingLevelMap(model);
	const reasoningEfforts = resolveOpenAIThinkingApi(model.api) ? resolveOpenAIModelReasoningEfforts(model) : void 0;
	const mappedLevels = listMappedModelThinkingLevels(model);
	return MODEL_CATALOG_THINKING_LEVELS.filter((level) => {
		const mapped = thinkingLevelMap?.[level];
		if (mapped === null) return false;
		if (level === "xhigh" || level === "max") return reasoningEfforts?.length !== 0 && (mapped !== void 0 || mappedLevels.includes(level) || reasoningEfforts?.includes(level) === true);
		return true;
	});
}
/** Clamps a requested thinking level to the closest supported level for a model. */
function clampThinkingLevel(model, level) {
	const availableLevels = getSupportedThinkingLevels(model);
	if (availableLevels.includes(level)) return level;
	const requestedIndex = MODEL_CATALOG_THINKING_LEVELS.indexOf(level);
	if (requestedIndex === -1) return availableLevels[0] ?? "off";
	const thinkingLevelMap = resolveThinkingLevelMap(model);
	const lowerFirst = (level === "xhigh" || level === "max") && thinkingLevelMap?.[level] === null;
	const lowerLevels = MODEL_CATALOG_THINKING_LEVELS.slice(0, requestedIndex).toReversed();
	const upperLevels = MODEL_CATALOG_THINKING_LEVELS.slice(requestedIndex);
	return (lowerFirst ? [...lowerLevels, ...upperLevels] : [...upperLevels, ...lowerLevels]).find((candidate) => availableLevels.includes(candidate)) ?? availableLevels[0] ?? "off";
}
/** Compares model identity by provider and id. */
function modelsAreEqual(a, b) {
	if (!a || !b) return false;
	return a.id === b.id && a.provider === b.provider;
}
// packages/ai/src/utils/headers.ts
/** Converts a Headers object to a plain record for provider request handling. */
function headersToRecord(headers) {
	const result = {};
	for (const [key, value] of headers.entries()) result[key] = value;
	return result;
}
// packages/ai/src/providers/anthropic-model-contract.ts
const ANTHROPIC_CLAUDE_CODE_VERSION = "2.1.280";
let learnedClaudeCodeVersion;
function parseClaudeCodeVersion(value) {
	const parts = (value?.match(/^(\d+)\.(\d+)\.(\d+)$/))?.slice(1).map(Number);
	return parts?.every(Number.isSafeInteger) ? parts : void 0;
}
function isNewerClaudeCodeVersion(candidate, current) {
	const next = parseClaudeCodeVersion(candidate);
	const base = parseClaudeCodeVersion(current);
	if (!next || !base) return false;
	for (const [index, part] of next.entries()) {
		const other = base[index] ?? 0;
		if (part !== other) return part > other;
	}
	return false;
}
function currentClaudeCodeVersionFloor() {
	return learnedClaudeCodeVersion ?? "2.1.280";
}
/**
* Read the Claude Code version Anthropic requires from a
* claude_code_version_too_old rejection (SDK APIError or transport error body).
*/
function readRequiredClaudeCodeVersion(error) {
	if (!isRecord(error) || error.status !== 400) return;
	const body = error.errorBody ?? error.error;
	const payload = isRecord(body) && isRecord(body.error) ? body.error : body;
	if (!isRecord(payload) || typeof payload.message !== "string") return;
	const details = payload.details;
	if (!isRecord(details) || details.error_code !== "claude_code_version_too_old") return;
	const required = payload.message.match(/version (\d+\.\d+\.\d+) or newer is required/)?.[1];
	return parseClaudeCodeVersion(required) ? required : void 0;
}
/** Adopt a version Anthropic required; true when it raised the floor and a retry can help. */
function raiseClaudeCodeVersionFloor(required) {
	if (!isNewerClaudeCodeVersion(required, currentClaudeCodeVersionFloor())) return false;
	learnedClaudeCodeVersion = required;
	return true;
}
/** Test seam: forget the learned requirement. */
function resetLearnedClaudeCodeVersionForTest() {
	learnedClaudeCodeVersion = void 0;
}
/** Whether Anthropic rejected a request because the model has no native fast mode. */
function isUnsupportedClaudeFastModeError(error) {
	if (!isRecord(error) || error.status !== 400) return false;
	const body = error.errorBody ?? error.error;
	const payload = isRecord(body) && isRecord(body.error) ? body.error : body;
	return isRecord(payload) && typeof payload.message === "string" && payload.message.includes("does not support the `speed` parameter");
}
/** Build OAuth headers and the matching billing identity from one request snapshot. */
function buildAnthropicClaudeCodeIdentity(betaHeader, ...headerSources) {
	const headers = new Headers({
		accept: "application/json",
		"anthropic-dangerous-direct-browser-access": "true",
		...betaHeader ? { "anthropic-beta": betaHeader } : {},
		"x-app": "cli"
	});
	for (const source of headerSources) for (const [name, value] of Object.entries(source ?? {})) if (value === null) headers.delete(name);
	else headers.set(name, value);
	const floor = currentClaudeCodeVersionFloor();
	const candidate = headers.get("user-agent")?.match(/^claude-cli\/(\d+\.\d+\.\d+)$/)?.[1];
	const version = candidate && isNewerClaudeCodeVersion(candidate, floor) ? candidate : floor;
	headers.set("user-agent", `claude-cli/${version}`);
	return {
		headers: headersToRecord(headers),
		version
	};
}
function normalizeModelId(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
function normalizeApi(api) {
	const normalized = normalizeLowercaseStringOrEmpty(api);
	return normalized === "openclaw-anthropic-messages-transport" ? "anthropic-messages" : normalized;
}
function hasConcreteResponseModel(ref) {
	const responseModelId = normalizeModelId(ref.responseModelId);
	return responseModelId.length > 0 && responseModelId !== normalizeModelId(ref.modelId);
}
function usesClaudeFable5MessagesContract(model) {
	return normalizeApi(model.api) === "anthropic-messages" && resolveClaudeFable5ModelIdentity(model) !== void 0;
}
/** Return whether streamed output must wait for the terminal refusal decision. */
function usesClaudeStreamingRefusalContract(model) {
	return normalizeApi(model.api) === "anthropic-messages" && usesClaude5RequestContract(model);
}
function requiresClaudeAdaptiveThinking(model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return false;
	return requiresClaudeMandatoryAdaptiveThinking(model);
}
/** Return whether omitted thinking should default to adaptive mode. */
function defaultsClaudeAdaptiveThinking(model) {
	return requiresClaudeAdaptiveThinking(model) || normalizeApi(model.api) === "anthropic-messages" && usesClaude5RequestContract(model);
}
/** Resolve provider-native effort once for direct and managed Claude requests. */
function resolveAnthropicThinkingEffort(model, level) {
	const requestedLevel = level ?? (resolveClaudeHaiku55ModelIdentity(model) ? CLAUDE_HAIKU_55_THINKING_PROFILE.defaultLevel : resolveClaudeOpus55ModelIdentity(model) ? CLAUDE_OPUS_55_THINKING_PROFILE.defaultLevel : resolveClaudeSonnet55ModelIdentity(model) ? CLAUDE_SONNET_55_THINKING_PROFILE.defaultLevel : resolveClaudeFable5ModelIdentity(model) ? CLAUDE_FABLE_5_THINKING_PROFILE.defaultLevel : void 0);
	const thinkingLevelMap = resolveClaudeNativeThinkingLevelMap(model);
	const clampModel = {
		...model,
		...typeof model.params?.canonicalModelId === "string" ? { reasoning: true } : {},
		...thinkingLevelMap ? { thinkingLevelMap } : {}
	};
	const resolvedLevel = requestedLevel ? clampThinkingLevel(clampModel, requestedLevel) : void 0;
	const mapped = resolvedLevel ? thinkingLevelMap?.[resolvedLevel] : void 0;
	if (typeof mapped === "string") return mapped;
	switch (resolvedLevel) {
		case "off":
		case "minimal":
		case "low": return "low";
		case "medium": return "medium";
		case "xhigh": return supportsClaudeNativeXhighEffort(model) ? "xhigh" : "high";
		case "max": return supportsClaudeNativeMaxEffort(model) ? "max" : "high";
		default: return "high";
	}
}
/** Normalize Anthropic and Anthropic-compatible terminal reasons identically. */
function mapAnthropicStopReason(reason) {
	switch (reason) {
		case "end_turn":
		case "pause_turn":
		case "compaction":
		case "stop_sequence": return "stop";
		case "max_tokens":
		case "model_context_window_exceeded": return "length";
		case "tool_use": return "toolUse";
		case "refusal":
		case "sensitive": return "error";
		default: throw new Error(`Unhandled stop reason: ${String(reason)}`);
	}
}
/** Remove unsupported assistant prefills while preserving completed tool-use turns. */
function prepareClaudeNoPrefillRequestContext(model, context) {
	if (!rejectsClaudeAssistantPrefill(model)) return context;
	let end = context.messages.length;
	while (end > 0) {
		const message = context.messages[end - 1];
		if (message?.role !== "assistant" || Array.isArray(message.content) && message.content.some((block) => block.type === "toolCall")) break;
		end -= 1;
	}
	return end === context.messages.length ? context : {
		...context,
		messages: context.messages.slice(0, end)
	};
}
function applyClaudeRequestContract(params, model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return;
	if (!requiresClaudeDefaultSampling(model)) return;
	delete params.temperature;
	delete params.top_p;
	delete params.top_k;
	if (resolveClaudeOpus5ModelIdentity(model) !== void 0 || resolveClaudeSonnet5ModelIdentity(model) !== void 0 || resolveClaudeHaiku55ModelIdentity(model) !== void 0) delete params.service_tier;
}
/**
* Claude identity of a transcript or target model on the Messages API. The
* response model wins when it differs, so server-side fallbacks keep their own identity.
*/
function resolveReplayClaudeIdentity(ref) {
	if (normalizeApi(ref.api) !== "anthropic-messages") return;
	const modelRef = hasConcreteResponseModel(ref) ? { id: ref.responseModelId } : {
		id: ref.modelId,
		params: ref.modelParams
	};
	const identity = resolveClaudeModelIdentity(modelRef);
	return identity.startsWith("claude-") ? identity : void 0;
}
/** The destination is fixed during one synchronous history transform. */
function prepareModelBoundThinkingReplay(target) {
	const targetApi = normalizeApi(target.api);
	const targetIdentity = resolveReplayClaudeIdentity({
		api: target.api,
		modelId: target.id,
		modelParams: target.params
	});
	const targetProvider = normalizeLowercaseStringOrEmpty(target.provider);
	const targetModelId = normalizeModelId(target.id);
	return (source) => {
		const sourceApi = normalizeApi(source.api);
		const sourceIdentity = resolveReplayClaudeIdentity(source);
		if (!sourceIdentity && !targetIdentity) return "default";
		if (sourceIdentity && targetIdentity && sourceApi === targetApi) return sourceIdentity === targetIdentity || !bindsClaudeThinkingPrefix({ id: sourceIdentity }) ? "preserve" : "drop";
		if (!sourceIdentity && !hasConcreteResponseModel(source) && targetIdentity && normalizeLowercaseStringOrEmpty(source.provider) === targetProvider && sourceApi === targetApi && normalizeModelId(source.modelId) === targetModelId) return "preserve";
		return sourceApi === targetApi && sourceIdentity === targetIdentity ? "preserve" : "drop";
	};
}
// packages/ai/src/replay-turn-classification.ts
/** Returns true when an assistant turn contains only provider reasoning and blank text. */
function hasOnlyAssistantReasoningContent(message) {
	if (message.role !== "assistant") return false;
	const content = Array.isArray(message.content) ? message.content : message.content != null && typeof message.content === "object" ? [message.content] : [];
	let hasThinking = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		if (!("type" in block)) return false;
		if (block.type === "thinking" || block.type === "redacted_thinking") {
			hasThinking = true;
			continue;
		}
		if (block.type === "text" && "text" in block && typeof block.text === "string" && !block.text.trim()) continue;
		return false;
	}
	return hasThinking;
}
/** Returns true when a token-limited turn contains only incomplete provider reasoning. */
function isReasoningOnlyLengthAssistantTurn(message) {
	return message.stopReason === "length" && hasOnlyAssistantReasoningContent(message);
}
const STREAM_ERROR_FALLBACK_TEXT = "[assistant turn failed before producing content]";
function isStreamErrorFallbackContent(content) {
	if (content == null) return true;
	if (typeof content === "string") return !content.trim() || content.trim() === "[assistant turn failed before producing content]";
	return Array.isArray(content) && content.every((value) => {
		const block = asOptionalRecord(value);
		return block && (block.type === "text" || block.type === "input_text" || block.type === "output_text") && typeof block.text === "string" && isStreamErrorFallbackContent(block.text);
	});
}
const FAILED_ASSISTANT_REPLAY_TEXT = "[This turn failed before it completed. Do not redo its work without confirming with the user first.]";
/** Classify failed source content before model-specific thinking or tool projection. */
function resolveFailedAssistantReplay(message, options) {
	if (message.role !== "assistant" || message.stopReason !== "error" && message.stopReason !== "aborted") return "keep";
	if (message.errorCode === "openclaw_repetitive_output") return "keep";
	const content = Array.isArray(message.content) ? message.content : [];
	if (content.some((block) => asOptionalRecord(block)?.type === "toolCall")) return options.pairingAware ? "keep" : "drop";
	return content.some((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "text" && typeof record.text === "string" && !isStreamErrorFallbackContent(record.text);
	}) ? "marker" : "drop";
}
// packages/ai/src/transcript-transform.ts
const NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
const NON_VISION_TOOL_IMAGE_PLACEHOLDER = "(tool image omitted: model does not support images)";
function replaceImagesWithPlaceholder(content, placeholder) {
	const result = [];
	for (const block of content) {
		if (block.type !== "image") {
			result.push(block);
			continue;
		}
		const previous = result.at(-1);
		const repeated = previous?.type === "text" && previous.text === placeholder;
		if (isImageWithMediaPayload(block) && !repeated) result.push({
			type: "text",
			text: placeholder
		});
	}
	return Object.isFrozen(content) && result.length === content.length && result.every((block, index) => block === content[index]) ? content : result;
}
function transformAssistant(message, model, toolCallIdMap, thinkingReplay, normalizeToolCallId) {
	const replayMode = thinkingReplay({
		provider: message.provider,
		api: message.api,
		modelId: message.model,
		responseModelId: message.responseModel
	});
	const sameModel = replayMode === "preserve" || message.provider === model.provider && message.api === model.api && message.model === model.id;
	const content = (typeof message.content === "string" ? [{
		type: "text",
		text: message.content
	}] : message.content).flatMap((block) => {
		if (block.type === "thinking") {
			if (replayMode === "drop") return [];
			if (block.redacted) return sameModel ? block : [];
			if (sameModel && block.thinkingSignature) return block;
			if (!block.thinking?.trim()) return [];
			return sameModel ? block : {
				type: "text",
				text: block.thinking
			};
		}
		if (block.type === "text") return sameModel ? block : {
			type: "text",
			text: block.text
		};
		const trimmedId = block.id.trim();
		if (sameModel) return trimmedId === block.id ? block : Object.assign({}, block, { id: trimmedId });
		const { thoughtSignature: _, async: _async, ...unsigned } = block;
		const id = normalizeToolCallId?.(trimmedId, model, message) ?? trimmedId;
		if (id !== trimmedId) toolCallIdMap.set(trimmedId, id);
		return id === block.id ? unsigned : Object.assign({}, unsigned, { id });
	});
	return Array.isArray(message.content) && Object.isFrozen(message) && Object.isFrozen(message.content) && content.length === message.content.length && content.every((block, index) => block === message.content[index]) ? message : {
		...message,
		content
	};
}
function transformMessages(messages, model, normalizeToolCallId) {
	const toolCallIdMap = /* @__PURE__ */ new Map();
	const thinkingReplay = prepareModelBoundThinkingReplay(model);
	const asyncOwners = /* @__PURE__ */ new Map();
	const relocated = /* @__PURE__ */ new Map();
	const movedResults = /* @__PURE__ */ new Set();
	for (const message of messages) if (message.role === "assistant") {
		const sameModel = message.provider === model.provider && message.api === model.api && message.model === model.id;
		for (const block of message.content ?? []) if (block.type === "toolCall") {
			const id = block.id.trim();
			if (block.async && !sameModel) asyncOwners.set(id, message);
			else asyncOwners.delete(id);
		}
	} else if (message.role === "toolResult") {
		const id = message.toolCallId.trim();
		const owner = asyncOwners.get(id);
		if (owner) {
			const results = relocated.get(owner) ?? [];
			results.push(message);
			relocated.set(owner, results);
			movedResults.add(message);
			asyncOwners.delete(id);
		}
	}
	const source = movedResults.size > 0 ? messages.flatMap((message) => movedResults.has(message) ? [] : [message, ...message.role === "assistant" ? relocated.get(message) ?? [] : []]) : messages;
	const supportsImages = model.input.includes("image");
	const missingResultText = OPENAI_RESPONSES_APIS.has(model.api) ? "aborted" : DEFAULT_MISSING_TOOL_RESULT_TEXT;
	const result = [];
	const pendingAsyncCalls = /* @__PURE__ */ new Map();
	let pendingToolCalls = [];
	let existingToolResultIds = /* @__PURE__ */ new Set();
	const flushToolCalls = () => {
		for (const { call, timestamp } of pendingToolCalls) if (!existingToolResultIds.has(call.id)) result.push({
			role: "toolResult",
			toolCallId: call.id,
			toolName: call.name,
			content: [{
				type: "text",
				text: missingResultText
			}],
			details: { openclawSyntheticMissingToolResult: true },
			isError: true,
			timestamp
		});
		pendingToolCalls = [];
		existingToolResultIds = /* @__PURE__ */ new Set();
	};
	for (let message of source) {
		if (message.content == null) message = {
			...message,
			content: []
		};
		if (message.role === "assistant") {
			const failedReplay = resolveFailedAssistantReplay(message, { pairingAware: false });
			message = transformAssistant(message, model, toolCallIdMap, thinkingReplay, normalizeToolCallId);
			flushToolCalls();
			if (failedReplay === "drop") continue;
			if (failedReplay === "marker") {
				result.push({
					...message,
					content: [{
						type: "text",
						text: FAILED_ASSISTANT_REPLAY_TEXT
					}]
				});
				continue;
			}
			pendingToolCalls = message.content.flatMap((block) => {
				if (block.type !== "toolCall") return [];
				const pending = {
					call: block,
					timestamp: message.timestamp ?? 0
				};
				if (block.async) {
					pendingAsyncCalls.set(block.id, pending);
					return [];
				}
				return [pending];
			});
		} else {
			if (!supportsImages && typeof message.content !== "string") {
				const content = replaceImagesWithPlaceholder(message.content, message.role === "user" ? NON_VISION_USER_IMAGE_PLACEHOLDER : NON_VISION_TOOL_IMAGE_PLACEHOLDER);
				if (!Object.isFrozen(message) || content !== message.content) message = {
					...message,
					content
				};
			}
			if (message.role === "toolResult") {
				const trimmedId = message.toolCallId.trim();
				const toolCallId = toolCallIdMap.get(trimmedId) ?? trimmedId;
				if (toolCallId !== message.toolCallId) message = {
					...message,
					toolCallId
				};
				existingToolResultIds.add(toolCallId);
				pendingAsyncCalls.delete(toolCallId);
			} else flushToolCalls();
		}
		result.push(message);
	}
	pendingToolCalls.push(...pendingAsyncCalls.values());
	flushToolCalls();
	return result;
}
// packages/ai/src/host.ts
const MAX_PENDING_CUSTOM_API_REGISTRATIONS = 32;
function queueCustomApiRegistration(registry, api, streamFn) {
	const existing = hostState.pendingRegistrations.find((registration) => registration.registry === registry && registration.api === api);
	if (existing) {
		existing.streamFn = streamFn;
		return false;
	}
	if (hostState.pendingRegistrations.length >= MAX_PENDING_CUSTOM_API_REGISTRATIONS) throw new Error("Too many custom transport APIs were registered before host configuration");
	hostState.pendingRegistrations.push({
		registry,
		api,
		streamFn
	});
	return false;
}
const inertAiTransportHost = {
	runInDetachedAsyncContext: (run) => run(),
	buildModelFetch: () => void 0,
	resolveSecretSentinel: (value) => value,
	redactToolPayloadText: (text) => text,
	normalizeAnthropicInlineContentBlocks: async (content) => [...content],
	resolveOpenAIStrictToolSetting: (_model, options) => options?.supportsStrictMode ? false : void 0,
	plugin: {
		resolveProviderStream: () => void 0,
		resolveTransportTurnState: () => void 0,
		wrapSimpleCompletionStream: () => void 0,
		createAnthropicVertexStream: () => {
			throw new Error("Anthropic Vertex transport is not configured by the embedding host");
		}
	},
	buildCopilotDynamicHeaders: () => ({}),
	resolveProviderRequestCapabilities: () => ({
		endpointClass: "default",
		knownProviderFamily: "",
		supportsNativeStreamingUsageCompat: false,
		supportsOpenAICompletionsStreamingUsageCompat: false,
		usesExplicitProxyLikeEndpoint: false,
		allowsAnthropicServiceTier: false
	}),
	resolveProviderRequestHeaders: ({ providerHeaders, callerHeaders, precedence }) => ({
		...precedence === "caller-wins" ? providerHeaders : callerHeaders,
		...precedence === "caller-wins" ? callerHeaders : providerHeaders
	}),
	resolveModelRequestTimeoutMs: () => void 0,
	requiresManagedTransport: () => false,
	inheritManagedTransport: (_source, target) => target,
	transformTransportMessages: (messages, model, normalizeToolCallId) => transformMessages(messages, model, normalizeToolCallId),
	registerCustomApi: queueCustomApiRegistration,
	isLogEnabled: () => true,
	logDebug: () => {},
	logInfo: () => {},
	logWarn: () => {}
};
function createAiTransportHostScope() {
	if (typeof process === "undefined") return;
	const asyncHooks = process.getBuiltinModule?.("node:async_hooks");
	return asyncHooks ? new asyncHooks.AsyncLocalStorage() : void 0;
}
const HOST_STATE_KEY = Symbol.for("openclaw.ai.transportHost");
function resolveAiTransportHostState() {
	const globalStore = globalThis;
	if (Object.hasOwn(globalStore, HOST_STATE_KEY)) return globalStore[HOST_STATE_KEY];
	const state = {
		inert: inertAiTransportHost,
		active: inertAiTransportHost,
		scope: createAiTransportHostScope(),
		pendingHost: void 0,
		pendingOperations: 0,
		pendingRegistrations: []
	};
	globalStore[HOST_STATE_KEY] = state;
	return state;
}
const hostState = resolveAiTransportHostState();
function isPromiseLike(value) {
	return value !== null && (typeof value === "object" || typeof value === "function") && typeof Reflect.get(value, "then") === "function";
}
function trackUnscopedOperation(host, result) {
	if (!isPromiseLike(result)) return;
	hostState.pendingHost = host;
	hostState.pendingOperations += 1;
	const release = () => {
		hostState.pendingOperations -= 1;
		if (hostState.pendingOperations === 0) hostState.pendingHost = void 0;
	};
	Promise.resolve(result).then(release, release);
}
/** Reports whether distinct host policy can survive asynchronous work. */
function supportsScopedAiTransportHosts() {
	return hostState.scope !== void 0;
}
/** Resolves an explicit embedding policy without replacing the process default. */
function createAiTransportHost(host = {}) {
	return {
		...hostState.inert,
		...host,
		normalizeAnthropicInlineContentBlocks: host.normalizeAnthropicInlineContentBlocks ?? hostState.inert.normalizeAnthropicInlineContentBlocks,
		plugin: {
			...hostState.inert.plugin,
			...host.plugin
		}
	};
}
/** Provider operations retain their policy across lazy loads and asynchronous I/O. */
function runWithAiTransportHost(host, run) {
	if (!hostState.scope) {
		if (host !== hostState.active) throw new Error("Scoped AI transport hosts require Node.js async context support");
		if (hostState.pendingHost && hostState.pendingHost !== host) throw new Error("AI transport host changed while browser provider work was still pending");
		const result = run();
		trackUnscopedOperation(host, result);
		return result;
	}
	return hostState.scope.run(host, run);
}
/** Installers must read the process default, never an unrelated operation's scoped policy. */
function getDefaultAiTransportHost() {
	return hostState.active;
}
/** Installs host implementations for the transport policy ports. */
function configureAiTransportHost(host) {
	if (!hostState.scope && hostState.pendingOperations > 0) throw new Error("Cannot replace the AI transport host while browser provider work is pending");
	hostState.active = createAiTransportHost(host);
	const transportHost = hostState.active;
	if (transportHost.registerCustomApi === hostState.inert.registerCustomApi || hostState.pendingRegistrations.length === 0) return;
	const pending = hostState.pendingRegistrations.splice(0);
	for (const registration of pending) transportHost.registerCustomApi(registration.registry, registration.api, registration.streamFn);
}
/** Returns the active transport host (inert defaults unless configured). */
function getAiTransportHost() {
	return hostState.scope?.getStore() ?? hostState.active;
}
/** Resolves sentinel substrings in custom headers at a no-fetch adapter boundary. */
function resolveAiTransportHeaderSentinels(headers) {
	if (!headers) return;
	const host = getAiTransportHost();
	let resolvedHeaders;
	for (const [name, value] of Object.entries(headers)) {
		if (value === null) continue;
		const resolved = host.resolveSecretSentinel(value);
		if (resolved !== value) {
			resolvedHeaders ??= { ...headers };
			resolvedHeaders[name] = resolved;
		}
	}
	return resolvedHeaders ?? headers;
}
export { headersToRecord as A, raiseClaudeCodeVersionFloor as C, resolveAnthropicThinkingEffort as D, resetLearnedClaudeCodeVersionForTest as E, modelsAreEqual as F, hasMediaPayload as I, isImageWithMediaPayload as L, calculateCost as M, clampThinkingLevel as N, usesClaudeFable5MessagesContract as O, getSupportedThinkingLevels as P, prepareModelBoundThinkingReplay as S, requiresClaudeAdaptiveThinking as T, buildAnthropicClaudeCodeIdentity as _, resolveAiTransportHeaderSentinels as a, mapAnthropicStopReason as b, transformMessages as c, hasOnlyAssistantReasoningContent as d, isReasoningOnlyLengthAssistantTurn as f, applyClaudeRequestContract as g, ANTHROPIC_CLAUDE_CODE_VERSION as h, getDefaultAiTransportHost as i, applyProviderReportedUsageCost as j, usesClaudeStreamingRefusalContract as k, FAILED_ASSISTANT_REPLAY_TEXT as l, resolveFailedAssistantReplay as m, createAiTransportHost as n, runWithAiTransportHost as o, isStreamErrorFallbackContent as p, getAiTransportHost as r, supportsScopedAiTransportHosts as s, configureAiTransportHost as t, STREAM_ERROR_FALLBACK_TEXT as u, defaultsClaudeAdaptiveThinking as v, readRequiredClaudeCodeVersion as w, prepareClaudeNoPrefillRequestContext as x, isUnsupportedClaudeFastModeError as y };
