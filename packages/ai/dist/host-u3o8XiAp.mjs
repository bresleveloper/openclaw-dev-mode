import { D as supportsClaudeNativeMaxEffort, O as supportsClaudeNativeXhighEffort, S as resolveClaudeSonnet5ModelIdentity, _ as resolveClaudeMythos5ModelIdentity, a as CLAUDE_HAIKU_55_THINKING_PROFILE, b as resolveClaudeOpus5ModelIdentity, c as CLAUDE_SONNET_55_THINKING_PROFILE, f as requiresClaudeDefaultSampling, h as resolveClaudeHaiku55ModelIdentity, i as CLAUDE_FABLE_5_THINKING_PROFILE, m as resolveClaudeFable5ModelIdentity, o as CLAUDE_OPUS_55_THINKING_PROFILE, p as requiresClaudeMandatoryAdaptiveThinking, t as calculateUsageCost, v as resolveClaudeNativeThinkingLevelMap, x as resolveClaudeSonnet55ModelIdentity, y as resolveClaudeOpus55ModelIdentity } from "./src-VWy9E7DZ.mjs";
import { t as DEFAULT_MISSING_TOOL_RESULT_TEXT } from "./types-CQc6JNG4.mjs";
import { i as asOptionalRecord, o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { n as normalizeLowercaseStringOrEmpty } from "./string-coerce-CtgOVOSv.mjs";
import { A as resolveOpenAIThinkingApi, O as MODEL_CATALOG_THINKING_LEVELS, S as resolveOpenAIModelReasoningEfforts, i as OPENAI_RESPONSES_APIS, k as listMappedModelThinkingLevels } from "./openai-responses-contracts-BKu8O7l4.mjs";
//#region packages/ai/src/media-payload.ts
/** Media metadata alone is not an attachment; provider emitters need inline bytes. */
function hasMediaPayload(block) {
	return isRecord(block) && typeof block.data === "string" && block.data.trim().length > 0;
}
/** Image metadata alone is not an attachment; provider emitters need inline bytes. */
function isImageWithMediaPayload(block) {
	return isRecord(block) && block.type === "image" && hasMediaPayload(block);
}
//#endregion
//#region packages/ai/src/model-utils.ts
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
//#endregion
//#region packages/ai/src/utils/headers.ts
/** Converts a Headers object to a plain record for provider request handling. */
function headersToRecord(headers) {
	const result = {};
	for (const [key, value] of headers.entries()) result[key] = value;
	return result;
}
//#endregion
//#region packages/ai/src/providers/anthropic-model-contract.ts
const ANTHROPIC_CLAUDE_CODE_VERSION = "2.1.280";
/** Build OAuth headers and the matching billing identity from one request snapshot. */
function buildAnthropicClaudeCodeIdentity(betaHeader, ...headerSources) {
	const headers = new Headers({
		accept: "application/json",
		"anthropic-dangerous-direct-browser-access": "true",
		...betaHeader ? { "anthropic-beta": betaHeader } : {},
		"x-app": "cli"
	});
	for (const source of headerSources) for (const [name, value] of Object.entries(source ?? {})) headers.set(name, value);
	let version = ANTHROPIC_CLAUDE_CODE_VERSION;
	const candidate = headers.get("user-agent")?.match(/^claude-cli\/(\d+\.\d+\.\d+)$/)?.[1];
	if (candidate) {
		const components = candidate.split(".").map(Number);
		const minimum = version.split(".").map(Number);
		const differing = components.findIndex((component, index) => component !== minimum[index]);
		const component = components[differing];
		const minimumComponent = minimum[differing];
		if (components.every(Number.isSafeInteger) && component !== void 0 && minimumComponent !== void 0 && component > minimumComponent) version = candidate;
	}
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
	if (normalizeApi(model.api) !== "anthropic-messages") return false;
	return resolveClaudeHaiku55ModelIdentity(model) !== void 0 || resolveClaudeFable5ModelIdentity(model) !== void 0 || resolveClaudeMythos5ModelIdentity(model) !== void 0 || resolveClaudeOpus5ModelIdentity(model) !== void 0 || resolveClaudeSonnet5ModelIdentity(model) !== void 0;
}
function requiresClaudeAdaptiveThinking(model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return false;
	return requiresClaudeMandatoryAdaptiveThinking(model);
}
/** Return whether omitted thinking should default to adaptive mode. */
function defaultsClaudeAdaptiveThinking(model) {
	return requiresClaudeAdaptiveThinking(model) || normalizeApi(model.api) === "anthropic-messages" && (resolveClaudeOpus5ModelIdentity(model) !== void 0 || resolveClaudeHaiku55ModelIdentity(model) !== void 0 || resolveClaudeSonnet5ModelIdentity(model) !== void 0);
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
	if (!resolveClaudeOpus5ModelIdentity(model) && !resolveClaudeSonnet5ModelIdentity(model) && !resolveClaudeHaiku55ModelIdentity(model)) return context;
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
	const opus5 = resolveClaudeOpus5ModelIdentity(model) !== void 0;
	const sonnet5 = resolveClaudeSonnet5ModelIdentity(model) !== void 0;
	const haiku55 = resolveClaudeHaiku55ModelIdentity(model) !== void 0;
	if (!requiresClaudeDefaultSampling(model) && !opus5 && !sonnet5) return;
	delete params.temperature;
	delete params.top_p;
	delete params.top_k;
	if (opus5 || sonnet5 || haiku55) delete params.service_tier;
}
function resolveReplayModelBoundIdentity(ref) {
	if (normalizeApi(ref.api) !== "anthropic-messages") return;
	const modelRef = hasConcreteResponseModel(ref) ? { id: ref.responseModelId } : {
		id: ref.modelId,
		params: ref.modelParams
	};
	const fableIdentity = resolveClaudeFable5ModelIdentity(modelRef);
	const haikuIdentity = resolveClaudeHaiku55ModelIdentity(modelRef);
	if (haikuIdentity) return `haiku:${haikuIdentity}`;
	if (fableIdentity) return `fable:${fableIdentity}`;
	const mythosIdentity = resolveClaudeMythos5ModelIdentity(modelRef);
	if (mythosIdentity) return `mythos:${mythosIdentity}`;
	const opusIdentity = resolveClaudeOpus5ModelIdentity(modelRef);
	if (opusIdentity) return `opus:${opusIdentity}`;
	const sonnetIdentity = resolveClaudeSonnet5ModelIdentity(modelRef);
	return sonnetIdentity ? `sonnet:${sonnetIdentity}` : void 0;
}
const FABLE_51_REPLAY_IDENTITY = /^fable:claude-fable-5-1(?=$|[^a-z0-9])/;
const SONNET_55_REPLAY_IDENTITY = /^sonnet:claude-sonnet-5-5(?=$|[^a-z0-9])/;
/**
* Verified live (2026-09-28): Fable 5.1 reads every earlier Claude generation
* except Sonnet 5.5; Sonnet 5.5 reads Sonnet 5 and pre-Claude-5 thinking but
* not Opus 5, Fable, or Mythos; no other model reads Sonnet 5.5 thinking. The
* API drops what a target cannot read, and every other cross-identity move
* stays dropped here until its replay contract is proven separately.
*/
function readsPriorClaudeThinking(targetIdentity, sourceIdentity) {
	if (targetIdentity === void 0) return false;
	if (FABLE_51_REPLAY_IDENTITY.test(targetIdentity)) return sourceIdentity === void 0 || !SONNET_55_REPLAY_IDENTITY.test(sourceIdentity) && !sourceIdentity.startsWith("haiku:");
	if (SONNET_55_REPLAY_IDENTITY.test(targetIdentity)) return sourceIdentity === void 0 || sourceIdentity.startsWith("sonnet:");
	return false;
}
function isClaudeReplaySource(ref) {
	const modelId = hasConcreteResponseModel(ref) ? ref.responseModelId : ref.modelId;
	return /(?:^|[-/])claude-/.test(normalizeModelId(modelId));
}
function resolveModelBoundThinkingReplayMode(params) {
	const sourceApi = normalizeApi(params.source.api);
	const targetApi = normalizeApi(params.target.api);
	const sourceIdentity = resolveReplayModelBoundIdentity(params.source);
	const targetIdentity = resolveReplayModelBoundIdentity(params.target);
	const sameRoute = normalizeLowercaseStringOrEmpty(params.source.provider) === normalizeLowercaseStringOrEmpty(params.target.provider) && sourceApi === targetApi && normalizeModelId(params.source.modelId) === normalizeModelId(params.target.modelId);
	if (!sourceIdentity && !targetIdentity) return "default";
	if (sourceApi === targetApi && readsPriorClaudeThinking(targetIdentity, sourceIdentity) && isClaudeReplaySource(params.source)) return "preserve";
	if (!sourceIdentity && !hasConcreteResponseModel(params.source) && targetIdentity && sameRoute) return "preserve";
	return sourceApi === targetApi && sourceIdentity === targetIdentity ? "preserve" : "drop";
}
//#endregion
//#region packages/ai/src/replay-turn-classification.ts
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
	const content = Array.isArray(message.content) ? message.content : [];
	if (content.some((block) => asOptionalRecord(block)?.type === "toolCall")) return options.pairingAware ? "keep" : "drop";
	return content.some((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "text" && typeof record.text === "string" && !isStreamErrorFallbackContent(record.text);
	}) ? "marker" : "drop";
}
//#endregion
//#region packages/ai/src/transcript-transform.ts
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
	return result;
}
function transformAssistant(message, model, toolCallIdMap, normalizeToolCallId) {
	const replayMode = resolveModelBoundThinkingReplayMode({
		source: {
			provider: message.provider,
			api: message.api,
			modelId: message.model,
			responseModelId: message.responseModel
		},
		target: {
			provider: model.provider,
			api: model.api,
			modelId: model.id,
			modelParams: model.params
		}
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
	return {
		...message,
		content
	};
}
function transformMessages(messages, model, normalizeToolCallId) {
	const toolCallIdMap = /* @__PURE__ */ new Map();
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
		for (const call of pendingToolCalls) if (!existingToolResultIds.has(call.id)) result.push({
			role: "toolResult",
			toolCallId: call.id,
			toolName: call.name,
			content: [{
				type: "text",
				text: missingResultText
			}],
			details: { openclawSyntheticMissingToolResult: true },
			isError: true,
			timestamp: Date.now()
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
			message = transformAssistant(message, model, toolCallIdMap, normalizeToolCallId);
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
			pendingToolCalls = message.content.filter((block) => {
				if (block.type !== "toolCall") return false;
				if (block.async) {
					pendingAsyncCalls.set(block.id, block);
					return false;
				}
				return true;
			});
		} else {
			if (!supportsImages && typeof message.content !== "string") message = {
				...message,
				content: replaceImagesWithPlaceholder(message.content, message.role === "user" ? NON_VISION_USER_IMAGE_PLACEHOLDER : NON_VISION_TOOL_IMAGE_PLACEHOLDER)
			};
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
//#endregion
//#region packages/ai/src/host.ts
const MAX_PENDING_CUSTOM_API_REGISTRATIONS = 32;
const pendingCustomApiRegistrations = [];
function queueCustomApiRegistration(registry, api, streamFn) {
	const existing = pendingCustomApiRegistrations.find((registration) => registration.registry === registry && registration.api === api);
	if (existing) {
		existing.streamFn = streamFn;
		return false;
	}
	if (pendingCustomApiRegistrations.length >= MAX_PENDING_CUSTOM_API_REGISTRATIONS) throw new Error("Too many custom transport APIs were registered before host configuration");
	pendingCustomApiRegistrations.push({
		registry,
		api,
		streamFn
	});
	return false;
}
const inertAiTransportHost = {
	buildModelFetch: () => void 0,
	resolveSecretSentinel: (value) => value,
	redactModelVisibleSecrets: (value) => value,
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
	logDebug: () => {},
	logInfo: () => {},
	logWarn: () => {}
};
let activeAiTransportHost = inertAiTransportHost;
function createAiTransportHostScope() {
	if (typeof process === "undefined") return;
	const asyncHooks = process.getBuiltinModule?.("node:async_hooks");
	return asyncHooks ? new asyncHooks.AsyncLocalStorage() : void 0;
}
const scopedAiTransportHost = createAiTransportHostScope();
let pendingUnscopedHost;
let pendingUnscopedOperations = 0;
function isPromiseLike(value) {
	return value !== null && (typeof value === "object" || typeof value === "function") && typeof Reflect.get(value, "then") === "function";
}
function trackUnscopedOperation(host, result) {
	if (!isPromiseLike(result)) return;
	pendingUnscopedHost = host;
	pendingUnscopedOperations += 1;
	const release = () => {
		pendingUnscopedOperations -= 1;
		if (pendingUnscopedOperations === 0) pendingUnscopedHost = void 0;
	};
	Promise.resolve(result).then(release, release);
}
/** Reports whether distinct host policy can survive asynchronous work. */
function supportsScopedAiTransportHosts() {
	return scopedAiTransportHost !== void 0;
}
/** Resolves an explicit embedding policy without replacing the process default. */
function createAiTransportHost(host = {}) {
	return {
		...inertAiTransportHost,
		...host,
		normalizeAnthropicInlineContentBlocks: host.normalizeAnthropicInlineContentBlocks ?? inertAiTransportHost.normalizeAnthropicInlineContentBlocks,
		plugin: {
			...inertAiTransportHost.plugin,
			...host.plugin
		}
	};
}
/** Provider operations retain their policy across lazy loads and asynchronous I/O. */
function runWithAiTransportHost(host, run) {
	if (!scopedAiTransportHost) {
		if (host !== activeAiTransportHost) throw new Error("Scoped AI transport hosts require Node.js async context support");
		if (pendingUnscopedHost && pendingUnscopedHost !== host) throw new Error("AI transport host changed while browser provider work was still pending");
		const result = run();
		trackUnscopedOperation(host, result);
		return result;
	}
	return scopedAiTransportHost.run(host, run);
}
/** Installers must read the process default, never an unrelated operation's scoped policy. */
function getDefaultAiTransportHost() {
	return activeAiTransportHost;
}
/** Installs host implementations for the transport policy ports. */
function configureAiTransportHost(host) {
	if (!scopedAiTransportHost && pendingUnscopedOperations > 0) throw new Error("Cannot replace the AI transport host while browser provider work is pending");
	activeAiTransportHost = createAiTransportHost(host);
	const transportHost = activeAiTransportHost;
	if (transportHost.registerCustomApi === inertAiTransportHost.registerCustomApi || pendingCustomApiRegistrations.length === 0) return;
	const pending = pendingCustomApiRegistrations.splice(0);
	for (const [index, registration] of pending.entries()) try {
		transportHost.registerCustomApi(registration.registry, registration.api, registration.streamFn);
	} catch (error) {
		pendingCustomApiRegistrations.unshift(...pending.slice(index));
		throw error;
	}
}
/** Returns the active transport host (inert defaults unless configured). */
function getAiTransportHost() {
	return scopedAiTransportHost?.getStore() ?? activeAiTransportHost;
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
//#endregion
export { getSupportedThinkingLevels as A, resolveModelBoundThinkingReplayMode as C, applyProviderReportedUsageCost as D, headersToRecord as E, hasMediaPayload as M, isImageWithMediaPayload as N, calculateCost as O, resolveAnthropicThinkingEffort as S, usesClaudeStreamingRefusalContract as T, buildAnthropicClaudeCodeIdentity as _, resolveAiTransportHeaderSentinels as a, prepareClaudeNoPrefillRequestContext as b, transformMessages as c, hasOnlyAssistantReasoningContent as d, isReasoningOnlyLengthAssistantTurn as f, applyClaudeRequestContract as g, ANTHROPIC_CLAUDE_CODE_VERSION as h, getDefaultAiTransportHost as i, modelsAreEqual as j, clampThinkingLevel as k, FAILED_ASSISTANT_REPLAY_TEXT as l, resolveFailedAssistantReplay as m, createAiTransportHost as n, runWithAiTransportHost as o, isStreamErrorFallbackContent as p, getAiTransportHost as r, supportsScopedAiTransportHosts as s, configureAiTransportHost as t, STREAM_ERROR_FALLBACK_TEXT as u, defaultsClaudeAdaptiveThinking as v, usesClaudeFable5MessagesContract as w, requiresClaudeAdaptiveThinking as x, mapAnthropicStopReason as y };
