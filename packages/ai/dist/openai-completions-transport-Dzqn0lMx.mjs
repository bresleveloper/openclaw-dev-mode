import { m as isRuntimeContextMessage, p as hasRuntimeContextMarker, v as runtimeContextContentToText } from "./types-DIBUKaTM.mjs";
import { i as asOptionalRecord, o as isRecord, r as asOptionalObjectRecord } from "./record-coerce-BgUo6bj4.mjs";
import { s as recordSuppressedReasoning, t as appendAssistantMessageDiagnostic } from "./diagnostics-DP1SXgAW.mjs";
import { r as appendAssistantThinking } from "./event-stream-Bf6cK7-d.mjs";
import { c as readNonEmptyStringPreservingWhitespace, t as hasNonEmptyString } from "./string-coerce-CpcyRbc6.mjs";
import { n as asNonNegativeFiniteNumber, r as asPositiveFiniteNumber } from "./number-coercion-BO6bhGm6.mjs";
import { L as isImageWithMediaPayload, M as calculateCost, r as getAiTransportHost } from "./host-Dm4e6L6R.mjs";
import { C as applyOpenAICompletionsToolReasoning, D as isOpenAIGpt6Model, P as supportsOpenAITemperature, S as nextResponsesServiceTier, b as responsesServiceTierObserver, d as OpenAIResponsesWebSocketPreDispatchError, f as OpenAIResponsesWebSocketSafeRetryError, l as OPENAI_RESPONSES_TOOL_CALL_PROVIDERS, r as OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS, t as AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS, u as OpenAIResponsesWebSocketPostDispatchError, x as isResponsesServiceTierRejection, z as resolveOpenAIThinkingApi } from "./openai-responses-contracts-BTBx9zkC.mjs";
import { c as truncateUtf16Safe } from "./provider-error-B7aKA_dg.mjs";
import { a as claimResponsesCompactRequest, c as estimateStringChars, i as createResponsesV2CompactionCollector, n as withResponsesRequestAcceptance, r as createResponsesPromptEgressObserver, t as responsesRequestLifecycle } from "./openai-responses-request-lifecycle-B21tgmh-.mjs";
import { r as resolveOpenAIPromptCacheParams } from "./openai-prompt-cache-yyba8hsU.mjs";
import { g as applyResponsesCacheWritePricing, p as hasOnlyResponsesFunctionTools, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl, u as DegenerateToolCallArgumentsError, v as mapResponsesTerminalUsage, y as readResponsesReasoningTokens } from "./diagnostics-BNlb1zlT.mjs";
import { o as supportsModelTools } from "./transport-utils-J6TkTVN5.mjs";
import { t as stableStringify } from "./stable-stringify-CGB-o900.mjs";
import "./src-CNWvILd1.mjs";
import { t as createZeroUsage } from "./usage-B8ggJtuG.mjs";
import { a as resolveOpenAICompletionsCompat, c as isAzureOpenAICompatibleHost, d as shouldOmitOllamaCompatResponseFormat, i as isOpenAICodexResponsesModel, l as resolveOpenAICompletionsResponseFormat, n as isKnownOpenAIEndpoint, r as isNativeOpenAIEndpoint, s as usesNativeOpenAICodexResponsesBackend, t as detectOpenAICompletionsCompat, u as resolveOpenAIResponsesTextFormat } from "./openai-completions-compat-DgAJZBJk.mjs";
import { t as buildGuardedModelFetch } from "./host-policy-fDXTduGF.mjs";
import { n as resolveCacheRetention, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-CqLRrd-i.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-B3kUqQ-q.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-oTx0nIsh.mjs";
import { C as splitSystemPromptRelocatableBoundary, S as splitSystemPromptCacheBoundaryForWire, T as stripSystemPromptRelocatableBoundary, a as describeToolResultMediaPlaceholder, c as extractToolResultText, d as measuredRequestPressure, f as preparedRequestSuffix, h as SYSTEM_PROMPT_RELOCATABLE_BOUNDARY, p as reasoningTagTextPolicy, r as clampMaxTokensToModel, u as codeModeToolSurfaceObserver, w as stripSystemPromptCacheBoundary, y as prepareSystemPrompt } from "./simple-options-Bet1Zroc.mjs";
import { A as parseStreamingJson, O as createToolArgumentPreviewSchedule, S as transportAbortError, _ as notifyProviderStreamOpened, d as finalizeTransportStream, f as iterateModelStream, l as failTransportStream, r as awaitProviderLifecycleCallback, s as createWritableTransportEventStream, u as finalizeTerminalToolCallArguments, w as withProviderResponseHook, x as throwIfModelStreamAborted } from "./transport-stream-shared-DPUASGj0.mjs";
import { S as redactIdentifier } from "./tool-schema-json-projection-Do42m3b7.mjs";
import { n as getEnvApiKey } from "./env-api-keys-DlUbTgKq.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-v1liRqNt.mjs";
import { t as shortHash } from "./hash-Cx359qsb.mjs";
import { n as isProviderReplayContext, r as providerReplayContextMatches, t as buildProviderReplayContext } from "./provider-replay-context-BSKkFyU5.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-Ca0a3iL1.mjs";
import { hasMutableModelPayloadHook, prepareModelRequestBody } from "./internal/model-request-body.mjs";
import { PROVIDER_DEFERRED_TOOL_NAMES, PROVIDER_MODEL_INPUT, resolveProviderContext } from "./provider-types.mjs";
import { t as createAssistantOutput } from "./assistant-output-DPK9pdyx.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-Czm9tjAm.mjs";
import { isGoogleGemini3ThinkingLevelModel } from "./internal/google-model-family.mjs";
import "./types.mjs";
import { $t as suppressOpenAIResponsesCompaction, An as withOpenAIErrorResponseHook, At as recordResponsesInputReplay, C as createResponsesStreamWithRecovery, Cn as log, Dn as readOpenAICompletionsReasoningBatch, E as readResponsesRecoveryEvent, En as readOpenAICompletionsContentDeltas, Et as buildResponsesInputMessage, Ft as responsesContinuationPrefixFingerprint, It as responsesContinuationRequestFingerprint, Jt as replayResponsesReasoningUpdates, Mt as claimOpenAIResponsesHttpContinuation, O as resolveNextResponsesEncryptedContentAttempt, On as resolveOpenAIClientBaseUrl, Ot as convertResponsesMessages, S as createResponsesItemConflictRecovery, Sn as isOpenAICompletionsThinkingEnabled, St as recordResponsesContextUsage, T as isResponsesItemConflict, Tn as parseOpenAICompletionsUsage, Ut as sanitizeResponsesImagePayload, Xt as buildOpenAIResponsesReasoningReplayMetadata, Yt as supportsResponsesReasoningUpdate, _n as GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, a as prepareResponsesTools, bn as createResponseModelTracker, bt as safeDebugValue, c as observeResponsesStream, cn as resolveCodeModeResponsesVisibleToolNames, dn as resolveOpenAISimpleReasoningEffort, en as assertCodeModeResponsesToolSurface, fn as prepareOpenAITools, gn as toOpenAIResponsesToolChoice, hn as reconcileOpenAIResponsesToolChoice, in as enforceCodeModeResponsesToolSurface, kn as resolvePromptCacheKey, kt as readResponsesInputReplayState, ln as resolveOpenAIStrictToolFlagWithDiagnostics, mn as reconcileOpenAICompletionsToolChoice, n as applyResponsesServiceTierPricing, nn as buildOpenAISdkClientOptions, on as getCompat, pn as projectOpenAITools, qt as isConfigurationUpdate, rn as buildOpenAISdkRequestOptions, s as processResponsesStream, tn as buildOpenAIClientHeaders, un as resolveOpenAIRequestReasoning, vn as createOpenAIProviderAcceptanceHook, w as isInvalidEncryptedContentError, wn as measureUtf8AppendBytes, wt as takeResponsesContextUsageInput, xn as detachPartialSnapshot, xt as summarizeResponsesPayload, yt as observeResponsesTransportFailure } from "./openai-responses-shared-CZBZVeqY.mjs";
import { t as mapOpenAIStopReason } from "./openai-stop-reason-cA0GUHlU.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-CWiv_y--.mjs";
import { t as boundResponseBody } from "./streaming-byte-guard-gOcUrHJF.mjs";
import { t as requiresReasoningContentReplay } from "./openai-completions-reasoning-replay-DyH5XzNo.mjs";
import { m as withPreparedToolSchemaNormalization, p as normalizeToolSchema, r as normalizeOpenAIStrictToolParameters, x as prepareOpenAIFunctionTool } from "./openai-tool-schema-Cot9HJy7.mjs";
import { n as resolveAzureDeploymentNameFromMap } from "./azure-deployment-map-hwDQc3uL.mjs";
import { E as supportsNativeOpenAIResponsesEndpoint, S as resolveOpenAIResponsesPayloadPolicy, l as isOpenAIResponsesCompactionOutput, o as getOpenAIResponsesCompactionOutputError, t as createBoundedOpenAIResponsesCompactionFetch, v as applyOpenAIResponsesPayloadPolicy, y as enforceOpenAIResponsesCompactionReplayStorage } from "./openai-responses-compaction-window-BwVpFH3V.mjs";
import { n as resolveProviderSimpleCompletionHeaders, r as resolveProviderTransportTurnState, t as filterProviderTurnHeadersForExplicitOpencodeSession } from "./provider-transport-turn-state-CMSrdLfq.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
// packages/ai/src/transports/deepseek-dsml-grammar.ts
const DEEPSEEK_DSML_MARKERS = [
	"|",
	"｜",
	"｜｜"
].flatMap((bar) => [`${bar}DSML${bar}`, `${bar}DSML${bar} `]);
const DEEPSEEK_DSML_TOOL_OPEN_TOKENS = DEEPSEEK_DSML_MARKERS.flatMap((marker) => [
	"calls",
	"tool_calls",
	"tool_call",
	"function_calls"
].map((kind) => `<${marker}${kind}>`));
const DEEPSEEK_DSML_MARKER_PATTERN = `(${DEEPSEEK_DSML_MARKERS.map((marker) => marker.replaceAll("|", "\\|")).join("|")})`;
function findEarliestDsmlToken(text, tokens, fromIndex = 0) {
	let best = null;
	for (const token of tokens) {
		const index = text.indexOf(token, fromIndex);
		if (index !== -1 && (!best || index < best.index)) best = {
			index,
			token
		};
	}
	return best;
}
function longestDsmlTokenPrefixSuffixLength(text, tokens, maxTokenLength) {
	const maxLength = Math.min(text.length, maxTokenLength - 1);
	for (let length = maxLength; length > 0; length--) {
		const suffix = text.slice(text.length - length);
		if (tokens.some((token) => token.startsWith(suffix))) return length;
	}
	return 0;
}
// packages/ai/src/transports/deepseek-text-filter.ts
/**
* DeepSeek DSML streaming text filter.
* Removes provider-emitted DSML tool markup while buffering split tag prefixes
* across streamed chunks.
*/
const DSML_OPEN_TOKENS = [...DEEPSEEK_DSML_TOOL_OPEN_TOKENS, ...DEEPSEEK_DSML_MARKERS.map((marker) => `<${marker}tool_use_error>`)];
const MAX_OPEN_TOKEN_LEN = Math.max(...DSML_OPEN_TOKENS.map((token) => token.length));
/** Create an incremental text filter that strips DeepSeek DSML tool blocks. */
function createDeepSeekTextFilter() {
	let buffer = "";
	let closeToken;
	const consume = (final) => {
		const output = [];
		const emit = (text) => {
			if (text) output.push(text);
		};
		while (buffer) {
			if (closeToken) {
				const closeIndex = buffer.indexOf(closeToken);
				if (closeIndex !== -1) {
					buffer = buffer.slice(closeIndex + closeToken.length);
					closeToken = void 0;
					continue;
				}
				const keep = final ? 0 : Math.min(buffer.length, closeToken.length - 1);
				buffer = buffer.slice(buffer.length - keep);
				if (final) closeToken = void 0;
				return output;
			}
			const open = findEarliestDsmlToken(buffer, DSML_OPEN_TOKENS);
			if (open) {
				emit(buffer.slice(0, open.index));
				buffer = buffer.slice(open.index + open.token.length);
				closeToken = open.token.replace("<", "</");
				continue;
			}
			if (final) {
				emit(buffer);
				buffer = "";
				return output;
			}
			const keep = longestDsmlTokenPrefixSuffixLength(buffer, DSML_OPEN_TOKENS, MAX_OPEN_TOKEN_LEN);
			const emitLength = buffer.length - keep;
			if (emitLength <= 0) return output;
			emit(buffer.slice(0, emitLength));
			buffer = buffer.slice(emitLength);
			return output;
		}
		return output;
	};
	return {
		push(chunk) {
			buffer += chunk;
			return consume(false);
		},
		flush() {
			return consume(true);
		}
	};
}
// packages/ai/src/transports/model-max-tokens-params.ts
/**
* Max-token parameter normalization across provider/native naming variants.
* Callers canonicalize aliases before dispatch so payloads cannot carry
* conflicting limits.
*/
const MAX_TOKENS_PARAM_KEYS = [
	"maxTokens",
	"max_completion_tokens",
	"max_tokens"
];
/** Resolve the first supported max-token parameter present in a params object. */
function resolveMaxTokensParam(params) {
	if (!params) return;
	for (const key of MAX_TOKENS_PARAM_KEYS) {
		const resolved = asNonNegativeFiniteNumber(params[key]);
		if (resolved !== void 0) return resolved;
	}
}
/**
* Canonicalize merged params to `maxTokens`, preserving source precedence from
* left to right across the provided source objects.
*/
function canonicalizeMaxTokensParam(params) {
	let resolved;
	for (const source of params.sources) {
		const sourceValue = resolveMaxTokensParam(source);
		if (sourceValue !== void 0) resolved = sourceValue;
	}
	if (resolved === void 0) return;
	for (const key of MAX_TOKENS_PARAM_KEYS) delete params.merged[key];
	params.merged.maxTokens = resolved;
}
// packages/ai/src/transports/openai-compatible-conversation-turn.ts
function hasNonEmptyMessageContent(content) {
	if (hasNonEmptyString(content)) return true;
	if (!Array.isArray(content)) return false;
	return content.some((part) => {
		if (!part || typeof part !== "object") return false;
		const record = part;
		if (record.type === "text") return hasNonEmptyString(record.text);
		return true;
	});
}
/** Returns whether an OpenAI-compatible messages payload contains a usable turn. */
function hasOpenAICompatibleConversationTurn(messages) {
	if (!Array.isArray(messages)) return false;
	return messages.some((message) => {
		if (!message || typeof message !== "object") return false;
		const record = message;
		if (record.role === "user") return hasNonEmptyMessageContent(record.content);
		if (record.role === "assistant") {
			if (hasNonEmptyMessageContent(record.content)) return true;
			const toolCalls = record.tool_calls;
			return Array.isArray(toolCalls) && toolCalls.some((toolCall) => toolCall && typeof toolCall === "object");
		}
		return false;
	});
}
// packages/ai/src/transports/openai-completions-cache-control.ts
const shapedPayloads = /* @__PURE__ */ new WeakSet();
function resolveCompletionsCacheControl(compat, retention, openRouterRoute) {
	if (compat.cacheControlFormat !== "anthropic" || retention === "none") return;
	return {
		type: "ephemeral",
		...retention === "long" && compat.supportsLongCacheRetention && (openRouterRoute || compat.configuredSupportsLongCacheRetention === true) ? { ttl: "1h" } : {}
	};
}
/** Shared Chat Completions policy; repeated wrapper application preserves existing checkpoints. */
function applyCompletionsAnthropicCacheControl(payload, cacheControl = { type: "ephemeral" }, cacheOptOutIndexes = /* @__PURE__ */ new Set(), markTools = true, markMessages = true, systemOnly = false, sharedSystemCheckpoint = false) {
	if (shapedPayloads.has(payload)) return;
	shapedPayloads.add(payload);
	const messages = Array.isArray(payload.messages) ? payload.messages : [];
	const tools = Array.isArray(payload.tools) ? payload.tools : [];
	let lastToolIndex = -1;
	for (let index = 0; index < tools.length; index++) {
		const tool = tools[index];
		if (isRecord(tool)) {
			lastToolIndex = index;
			if (Object.hasOwn(tool, "cache_control")) {
				const unmarked = { ...tool };
				delete unmarked.cache_control;
				tools[index] = unmarked;
			}
		}
	}
	const blocks = messages.filter(isRecord).flatMap((message) => Array.isArray(message.content) ? message.content.filter(isRecord) : []);
	for (const block of blocks) delete block.cache_control;
	if (!cacheControl) return;
	const markText = (message, splitBoundary) => {
		if (typeof message.content === "string" && message.content) message.content = [{
			type: "text",
			text: message.content
		}];
		const content = message.content;
		if (!Array.isArray(content)) return false;
		for (let i = content.length - 1; i >= 0; i--) {
			const block = content[i];
			if (!isRecord(block) || block.type !== "text" || typeof block.text !== "string" || !block.text) continue;
			const split = splitBoundary ? splitSystemPromptCacheBoundaryForWire(block.text) : void 0;
			if (split) {
				content.splice(i, 1, ...split.stablePrefix ? [{
					type: "text",
					text: split.stablePrefix,
					cache_control: cacheControl
				}] : [], ...split.dynamicSuffix ? [{
					type: "text",
					text: split.dynamicSuffix
				}] : []);
				if (!split.stablePrefix) return false;
			} else block.cache_control = cacheControl;
			return true;
		}
		return false;
	};
	if (!systemOnly && markTools && lastToolIndex >= 0) tools[lastToolIndex] = {
		...tools[lastToolIndex],
		cache_control: cacheControl
	};
	if (!markMessages) return;
	const system = messages.find((message) => isRecord(message) && (message.role === "system" || message.role === "developer"));
	if (isRecord(system)) {
		markText(system, true);
		if (sharedSystemCheckpoint && Array.isArray(system.content)) {
			const openingTurn = !messages.some((message) => isRecord(message) && message.role === "assistant");
			for (let i = 0; i < system.content.length; i++) {
				const block = system.content[i];
				if (!isRecord(block) || block.type !== "text" || typeof block.text !== "string") continue;
				const raw = block.text;
				const wireText = stripSystemPromptRelocatableBoundary(raw);
				const seam = openingTurn ? splitSystemPromptRelocatableBoundary(raw) : void 0;
				const start = raw.indexOf(SYSTEM_PROMPT_RELOCATABLE_BOUNDARY);
				if (!seam?.relocatable || start < 0) {
					block.text = wireText;
					continue;
				}
				const sharedText = raw.slice(0, start);
				const runtimeText = wireText.slice(sharedText.length);
				system.content.splice(i, 1, ...sharedText ? [{
					type: "text",
					text: sharedText,
					cache_control: cacheControl
				}] : [], ...runtimeText ? [{
					type: "text",
					text: runtimeText
				}] : []);
				break;
			}
		}
	}
	if (systemOnly) return;
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (!cacheOptOutIndexes.has(i) && isRecord(message) && (message.role === "user" || message.role === "tool") && markText(message, false)) return;
	}
}
// packages/ai/src/transports/openai-completions-string-content.ts
/**
* OpenAI Chat Completions compatibility helpers. Some providers only accept
* role/content messages with plain string content instead of text block arrays.
*/
/** Flatten string-only text block content arrays into newline-joined strings. */
function flattenCompletionMessagesToStringContent(messages) {
	return messages.map((message) => {
		const record = asOptionalObjectRecord(message);
		const content = record?.content;
		if (!Array.isArray(content)) return message;
		const textParts = [];
		for (const item of content) {
			const part = asOptionalObjectRecord(item);
			if (part?.type !== "text" || typeof part.text !== "string") return message;
			textParts.push(part.text);
		}
		return {
			...record,
			content: textParts.join("\n")
		};
	});
}
/** Strip completion messages to role/content fields for strict providers. */
function stripCompletionMessagesToRoleContent(messages) {
	return messages.map((message) => {
		const record = asOptionalRecord(message);
		if (!record) return message;
		return {
			...Object.hasOwn(record, "role") ? { role: record.role } : {},
			...Object.hasOwn(record, "content") ? { content: record.content } : {}
		};
	});
}
// packages/ai/src/providers/openai-completions-tool-calls.ts
const MAX_BUFFERED_TOOL_CALL_ARGUMENT_BYTES = 256e3;
const MAX_BUFFERED_LEGACY_FOLLOWING_DELTA_BYTES = 256e3;
const MAX_BUFFERED_LEGACY_FOLLOWING_DELTAS = 1024;
/** Keep encrypted provider reasoning attached to the first matching tool call. */
function createOpenAIEncryptedToolCallReasoningTracker() {
	const firstBlocks = /* @__PURE__ */ new Map();
	const pendingDetails = /* @__PURE__ */ new Map();
	return {
		rememberToolCall(id, block, previousId = id) {
			const previous = firstBlocks.get(previousId);
			if (previousId !== id && previous?.block === block) {
				firstBlocks.delete(previousId);
				if (previous.signature && block.thoughtSignature === previous.signature) delete block.thoughtSignature;
			}
			if (!id || firstBlocks.has(id)) return;
			const pendingDetail = pendingDetails.get(id);
			firstBlocks.set(id, {
				block,
				signature: pendingDetail
			});
			if (pendingDetail) {
				block.thoughtSignature = pendingDetail;
				pendingDetails.delete(id);
			}
		},
		consumeDetails(details) {
			if (!Array.isArray(details)) return;
			for (const detail of details) {
				if (!isRecord(detail) || detail.type !== "reasoning.encrypted" || typeof detail.id !== "string" || detail.id.length === 0 || typeof detail.data !== "string" || detail.data.length === 0) continue;
				const serializedDetail = JSON.stringify(detail);
				const matchingBlock = firstBlocks.get(detail.id);
				if (matchingBlock) {
					matchingBlock.signature = serializedDetail;
					matchingBlock.block.thoughtSignature = serializedDetail;
				} else pendingDetails.set(detail.id, serializedDetail);
			}
		}
	};
}
function hasObservableContent(value) {
	if (typeof value === "string") return value.length > 0;
	if (Array.isArray(value)) return value.some(hasObservableContent);
	if (isRecord(value)) return Object.entries(value).some(([field, nestedValue]) => field !== "type" && field !== "id" && field !== "index" && hasObservableContent(nestedValue));
	return false;
}
function hasOpenAICompletionsDeltaContent(delta) {
	return Object.entries(delta).some(([field, value]) => field !== "role" && hasObservableContent(value));
}
/** Normalize the SDK's legacy single-function lane into its modern tool-call shape. */
function createOpenAICompletionsToolCallDeltaNormalizer() {
	let sawModernToolCall = false;
	let pendingLegacyArgumentBytes = 0;
	let pendingFollowingDeltaBytes = 0;
	let pendingLegacyToolCall;
	const modernArguments = /* @__PURE__ */ new Map();
	const pendingFollowingDeltas = [];
	const takePendingFollowingDeltas = () => {
		pendingFollowingDeltaBytes = 0;
		return pendingFollowingDeltas.splice(0).map((delta) => ({
			delta,
			toolCalls: []
		}));
	};
	return (delta, finishReason) => {
		const ordinaryDelta = { ...delta };
		delete ordinaryDelta.function_call;
		delete ordinaryDelta.tool_calls;
		if (delta.tool_calls && delta.tool_calls.length > 0) {
			for (const toolCall of delta.tool_calls) {
				const index = typeof toolCall.index === "number" ? toolCall.index : void 0;
				const state = (index === void 0 ? void 0 : modernArguments.get(index)) ?? (toolCall.id ? modernArguments.get(toolCall.id) : void 0) ?? {
					bytes: 0,
					pendingHighSurrogate: false
				};
				if (index !== void 0) modernArguments.set(index, state);
				if (toolCall.id) modernArguments.set(toolCall.id, state);
				const argumentDelta = toolCall.function?.arguments ?? "";
				const append = measureUtf8AppendBytes(state.pendingHighSurrogate, argumentDelta);
				state.bytes += append.bytes;
				if (state.bytes > MAX_BUFFERED_TOOL_CALL_ARGUMENT_BYTES) throw new Error("Exceeded tool-call argument buffer limit");
				state.pendingHighSurrogate = append.endsWithHighSurrogate;
			}
			const precedingDeltas = takePendingFollowingDeltas();
			sawModernToolCall = true;
			pendingLegacyArgumentBytes = 0;
			pendingLegacyToolCall = void 0;
			return [...precedingDeltas, {
				delta: ordinaryDelta,
				toolCalls: delta.tool_calls
			}];
		}
		const functionCall = delta.function_call;
		if (sawModernToolCall || !functionCall && !pendingLegacyToolCall) return [{
			delta: ordinaryDelta,
			toolCalls: []
		}];
		const hadPendingLegacyCall = pendingLegacyToolCall !== void 0;
		const leadingDeltas = [];
		if (hasOpenAICompletionsDeltaContent(ordinaryDelta)) {
			if (hadPendingLegacyCall) {
				const nextDeltaBytes = Buffer.byteLength(JSON.stringify(ordinaryDelta), "utf8");
				if (pendingFollowingDeltaBytes + nextDeltaBytes > MAX_BUFFERED_LEGACY_FOLLOWING_DELTA_BYTES || pendingFollowingDeltas.length >= MAX_BUFFERED_LEGACY_FOLLOWING_DELTAS) throw new Error("Exceeded legacy tool-call content buffer limit");
				pendingFollowingDeltaBytes += nextDeltaBytes;
				pendingFollowingDeltas.push(ordinaryDelta);
			} else leadingDeltas.push({
				delta: ordinaryDelta,
				toolCalls: []
			});
		}
		if (functionCall && (functionCall.name || functionCall.arguments)) {
			const nextFunctionName = pendingLegacyToolCall?.function?.name ? void 0 : functionCall.name;
			const nextArgumentBytes = Buffer.byteLength(functionCall.arguments ?? "", "utf8") + Buffer.byteLength(nextFunctionName ?? "", "utf8");
			if (pendingLegacyArgumentBytes + nextArgumentBytes > MAX_BUFFERED_TOOL_CALL_ARGUMENT_BYTES) throw new Error("Exceeded tool-call argument buffer limit");
			pendingLegacyArgumentBytes += nextArgumentBytes;
			pendingLegacyToolCall ??= {
				index: 0,
				id: `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`,
				type: "function",
				function: {}
			};
			const pendingFunction = pendingLegacyToolCall.function ??= {};
			if (nextFunctionName) pendingFunction.name = nextFunctionName;
			if (functionCall.arguments) pendingFunction.arguments = (pendingFunction.arguments ?? "") + functionCall.arguments;
		}
		if (!pendingLegacyToolCall) return leadingDeltas.length > 0 ? leadingDeltas : [{
			delta: ordinaryDelta,
			toolCalls: []
		}];
		if (finishReason === "function_call") {
			const confirmedLegacyToolCall = pendingLegacyToolCall;
			pendingLegacyToolCall = void 0;
			pendingLegacyArgumentBytes = 0;
			return [
				...leadingDeltas,
				{
					delta: {},
					toolCalls: [confirmedLegacyToolCall]
				},
				...takePendingFollowingDeltas()
			];
		}
		if (finishReason) {
			pendingLegacyArgumentBytes = 0;
			pendingLegacyToolCall = void 0;
			return [...leadingDeltas, ...takePendingFollowingDeltas()];
		}
		return leadingDeltas;
	};
}
/** Publish only executable calls; streaming scratch state never belongs in replay. */
function finalizeOpenAICompletionsToolCalls(output, options = {}) {
	const isToolCall = (block) => block.type === "toolCall";
	const hasToolCalls = output.content.some(isToolCall);
	if (output.stopReason === "toolUse" && !hasToolCalls) output.stopReason = "stop";
	if (output.stopReason === "stop" && hasToolCalls && options.allowSilentToolCallPromotion !== false && !output.content.some((block) => block.type === "text" && block.text.trim().length > 0)) output.stopReason = "toolUse";
	if (output.stopReason !== "toolUse") {
		if (hasToolCalls) output.content = output.content.filter((block) => !isToolCall(block));
		return;
	}
	const toolCalls = output.content.filter(isToolCall);
	const rejectToolCalls = () => {
		output.stopReason = "error";
		output.errorMessage = "Provider returned an incomplete or malformed tool call";
		output.content = output.content.filter((candidate) => !isToolCall(candidate));
	};
	if (toolCalls.some((call) => typeof call.name !== "string" || call.name.trim().length === 0 || typeof call.partialJson !== "string" || call.partialJson.trim().length === 0)) {
		rejectToolCalls();
		return;
	}
	try {
		finalizeTerminalToolCallArguments(toolCalls, (call) => call.partialJson);
	} catch {
		rejectToolCalls();
		return;
	}
	for (let contentIndex = 0; contentIndex < output.content.length; contentIndex += 1) {
		const block = output.content[contentIndex];
		if (!block || !isToolCall(block)) continue;
		delete block.partialJson;
		options.onConfirmedToolCall?.(block, contentIndex);
	}
}
// packages/ai/src/transports/openai-completions-replay.ts
const GOOGLE_COMPAT_THOUGHT_SIGNATURE_ELLIPSIS_RE = /[\u2026]|\.\.\./;
const GOOGLE_COMPAT_THOUGHT_SIGNATURE_BASE64_RE = /^[A-Za-z0-9+/=]+$/;
function hasGoogleCompatThoughtSignatureTruncationFootprint(value) {
	return GOOGLE_COMPAT_THOUGHT_SIGNATURE_ELLIPSIS_RE.test(value) || GOOGLE_COMPAT_THOUGHT_SIGNATURE_BASE64_RE.test(value) && value.length % 4 !== 0;
}
function toolCallThoughtSignatureReplay(model, message, thoughtSignature) {
	const endpointClass = detectOpenAICompletionsCompat(model).capabilities.endpointClass;
	const google = model.provider === "google" || endpointClass === "google-generative-ai" || endpointClass === "google-vertex";
	const fallback = google && isGoogleGemini3ThinkingLevelModel(model.id) ? GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP : void 0;
	let signature = message.api === model.api && message.provider === model.provider && message.model === model.id ? thoughtSignature : void 0;
	if (!google && signature?.trimStart().startsWith("{")) signature = void 0;
	signature ||= fallback;
	if (signature && hasGoogleCompatThoughtSignatureTruncationFootprint(signature.trim())) signature = fallback;
	if (!signature) return;
	return google ? { extra_content: { google: { thought_signature: signature } } } : { provider_specific_fields: { thought_signature: signature } };
}
const COMPLETIONS_REASONING_REPLAY_FIELDS = [
	"reasoning_details",
	"reasoning_content",
	"reasoning",
	"reasoning_text"
];
function sanitizeOpenRouterReasoningReplayFields(record) {
	const reasoningDetails = record.reasoning_details;
	if (typeof reasoningDetails === "string") {
		if (reasoningDetails.length > 0 && typeof record.reasoning !== "string") record.reasoning = reasoningDetails;
		delete record.reasoning_details;
	} else if (reasoningDetails !== void 0 && !Array.isArray(reasoningDetails)) delete record.reasoning_details;
	for (const field of ["reasoning", "reasoning_content"]) if (field in record && (typeof record[field] !== "string" || record[field] === "")) delete record[field];
	const reasoningText = record.reasoning_text;
	if (typeof reasoningText === "string" && reasoningText.length > 0 && typeof record.reasoning !== "string" && typeof record.reasoning_content !== "string") record.reasoning = reasoningText;
	delete record.reasoning_text;
}
function shouldPreserveOpenRouterReasoningReplay(model) {
	if (model.provider !== "openrouter") return true;
	const normalizedModelId = model.id.trim().toLowerCase();
	return !(normalizedModelId.startsWith("anthropic/") || normalizedModelId.startsWith("x-ai/"));
}
function applyCompletionsReplay(outgoingMessages, model, compat) {
	const preserveOpenRouterReasoning = compat.thinkingFormat === "openrouter" && shouldPreserveOpenRouterReasoningReplay(model);
	const preserveReasoningContent = compat.requiresReasoningContentOnAssistantMessages || compat.thinkingFormat === "deepseek" || compat.thinkingFormat === "zai" || model.reasoning && !isNativeOpenAIEndpoint(model) && shouldPreserveOpenRouterReasoningReplay(model) || requiresReasoningContentReplay(model.id);
	for (const message of outgoingMessages) {
		if (message.role !== "assistant") continue;
		if (preserveOpenRouterReasoning) sanitizeOpenRouterReasoningReplayFields(message);
		else {
			const record = message;
			const requiresReasoningContent = model.compat?.requiresReasoningContentOnAssistantMessages === true;
			if (preserveReasoningContent && requiresReasoningContent) {
				for (const field of [
					"reasoning_content",
					"reasoning",
					"reasoning_text"
				]) if (typeof record[field] === "string" && record[field].length > 0) {
					record.reasoning_content = record[field];
					break;
				}
			}
			for (const field of COMPLETIONS_REASONING_REPLAY_FIELDS) {
				if (preserveReasoningContent && field !== "reasoning_details" && (!requiresReasoningContent || field === "reasoning_content") && typeof record[field] === "string") continue;
				delete record[field];
			}
		}
	}
}
// packages/ai/src/openai-completions-messages.ts
/** Whether replayed messages require a tools marker for proxy compatibility. */
function hasToolCallHistory(messages) {
	return messages.some((message) => message.role === "toolResult" || message.role === "assistant" && Array.isArray(message.content) && message.content.some((block) => block.type === "toolCall"));
}
/** Convert a normalized transcript to OpenAI Chat Completions messages. */
function convertMessages(model, context, compat, options = {}) {
	const params = [];
	const supportsTools = options.supportsTools !== false;
	const declaredToolNames = options.declaredToolNames ?? new Set(context.tools?.map((tool) => tool.name));
	const toolNamesByCallId = /* @__PURE__ */ new Map();
	const normalizeToolCallId = (id) => {
		if (id.includes("|")) return id.slice(0, id.indexOf("|")).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
		if (model.provider === "openai") return id.length > 40 ? truncateUtf16Safe(id, 40) : id;
		return id;
	};
	const transformedMessages = transformProviderMessages(context.messages, model, normalizeToolCallId);
	let relocatableSplit;
	let systemParamIndex;
	if (context.systemPrompt) {
		const role = model.reasoning && compat.supportsDeveloperRole ? "developer" : "system";
		let systemPrompt;
		if (options.preserveSystemPromptCacheBoundary) systemPrompt = compat.cacheControlSharedSystem ? context.systemPrompt : stripSystemPromptRelocatableBoundary(context.systemPrompt);
		else {
			const split = splitSystemPromptRelocatableBoundary(context.systemPrompt);
			if (split && split.relocatable.length > 0) relocatableSplit = split;
			systemPrompt = stripSystemPromptCacheBoundary(context.systemPrompt);
		}
		systemParamIndex = params.length;
		params.push({
			role,
			content: sanitizeSurrogates(systemPrompt)
		});
	}
	let lastRole = null;
	for (let i = 0; i < transformedMessages.length; i++) {
		const msg = transformedMessages[i];
		if (!msg) continue;
		if (compat.requiresAssistantAfterToolResult && lastRole === "toolResult" && msg.role === "user") params.push({
			role: "assistant",
			content: "I have processed the tool results."
		});
		if (isRuntimeContextMessage(msg)) {
			params.push({
				role: compat.supportsDeveloperRole ? "developer" : "user",
				content: sanitizeSurrogates(runtimeContextContentToText(msg.content))
			});
			options.cacheOptOutIndexes?.add(params.length - 1);
		} else if (msg.role === "user") {
			let userParam;
			if (typeof msg.content === "string") userParam = {
				role: "user",
				content: sanitizeSurrogates(msg.content)
			};
			else {
				const content = msg.content.map((item) => {
					if (item.type === "text") return {
						type: "text",
						text: sanitizeSurrogates(item.text)
					};
					if (item.type === "video") return {
						type: "video_url",
						video_url: { url: `data:${item.mimeType};base64,${item.data}` }
					};
					return {
						type: "image_url",
						image_url: { url: `data:${item.mimeType};base64,${item.data}` }
					};
				});
				if (content.length === 0) continue;
				userParam = {
					role: "user",
					content
				};
			}
			if (hasRuntimeContextMarker(msg)) options.cacheOptOutIndexes?.add(params.length);
			params.push(userParam);
		} else if (msg.role === "assistant") {
			const assistantMsg = {
				role: "assistant",
				content: compat.requiresAssistantAfterToolResult ? "" : null
			};
			const assistantTexts = [];
			const nonEmptyThinkingBlocks = [];
			const toolCalls = [];
			msg.content.forEach((block) => {
				if (block.type === "text" && block.text.trim().length > 0) assistantTexts.push(sanitizeSurrogates(block.text));
				else if (block.type === "thinking" && block.thinking.trim().length > 0) nonEmptyThinkingBlocks.push(block);
				else if (block.type === "toolCall") {
					toolNamesByCallId.set(block.id, block.name);
					if (supportsTools && declaredToolNames.has(block.name)) toolCalls.push(block);
					else assistantTexts.push(sanitizeSurrogates(`[tool call id=${block.id} name=${block.name}] ${JSON.stringify(block.arguments)}`));
				}
			});
			if (nonEmptyThinkingBlocks.length > 0 && compat.requiresThinkingAsText) assistantMsg.content = [{
				type: "text",
				text: nonEmptyThinkingBlocks.map((block) => sanitizeSurrogates(block.thinking)).join("\n\n")
			}, ...assistantTexts.map((text) => ({
				type: "text",
				text
			}))];
			else {
				const assistantText = assistantTexts.join("\n");
				if (assistantText.length > 0) assistantMsg.content = assistantText;
				if (nonEmptyThinkingBlocks.length > 0) {
					let signature = nonEmptyThinkingBlocks.at(0)?.thinkingSignature;
					if (model.provider === "opencode-go" && signature === "reasoning") signature = "reasoning_content";
					if (signature && signature.length > 0) assistantMsg[signature] = nonEmptyThinkingBlocks.map((block) => block.thinking).join("\n");
				}
			}
			if (toolCalls.length > 0) {
				assistantMsg.tool_calls = toolCalls.map((toolCall) => ({
					id: toolCall.id,
					type: "function",
					function: {
						name: toolCall.name,
						arguments: JSON.stringify(toolCall.arguments)
					},
					...toolCallThoughtSignatureReplay(model, msg, toolCall.thoughtSignature)
				}));
				const reasoningDetails = toolCalls.flatMap((toolCall) => {
					const signature = toolCall.thoughtSignature;
					if (!signature) return [];
					try {
						const parsed = JSON.parse(signature);
						return parsed ? [parsed] : [];
					} catch {
						return [];
					}
				});
				if (reasoningDetails.length > 0) assistantMsg.reasoning_details = reasoningDetails;
			}
			if (compat.requiresReasoningContentOnAssistantMessages && model.reasoning && assistantMsg.reasoning_content === void 0) assistantMsg.reasoning_content = "";
			const content = assistantMsg.content;
			if (!(content !== null && content !== void 0 && content.length > 0) && !assistantMsg.tool_calls) continue;
			params.push(assistantMsg);
		} else if (msg.role === "toolResult") {
			const imageContentParts = [];
			const textResults = [];
			let j = i;
			while (j < transformedMessages.length) {
				const toolMsg = transformedMessages.at(j);
				if (toolMsg?.role !== "toolResult") break;
				const textResult = extractToolResultText(toolMsg.content);
				const mediaPlaceholder = describeToolResultMediaPlaceholder(toolMsg.content);
				const images = toolMsg.content.filter(isImageWithMediaPayload);
				const content = textResult.trim() ? textResult : mediaPlaceholder ?? "(no output)";
				const normalizedId = normalizeToolCallId(toolMsg.toolCallId);
				const pairedToolName = toolNamesByCallId.get(toolMsg.toolCallId) ?? toolNamesByCallId.get(normalizedId);
				const isNativeResult = pairedToolName !== void 0 ? declaredToolNames.has(pairedToolName) : preparedRequestSuffix.hasToolCall(context, toolMsg.toolCallId) || preparedRequestSuffix.hasToolCall(context, normalizedId);
				if (supportsTools && isNativeResult) {
					const toolResultMsg = {
						role: "tool",
						content,
						tool_call_id: preparedRequestSuffix.has(context) ? preparedRequestSuffix.toolCallId(context, toolMsg.toolCallId, normalizedId) : toolMsg.toolCallId
					};
					if (compat.requiresToolResultName && toolMsg.toolName) toolResultMsg.name = toolMsg.toolName;
					params.push(toolResultMsg);
				} else textResults.push(sanitizeSurrogates(`[tool result id=${toolMsg.toolCallId} name=${toolMsg.toolName}] ${content}`));
				if (images.length > 0 && model.input.includes("image")) {
					const boundedToolName = sanitizeSurrogates(truncateUtf16Safe(toolMsg.toolName ?? "", 64));
					imageContentParts.push({
						type: "text",
						text: `Image(s) from tool result #${j - i + 1}${boundedToolName ? ` (${boundedToolName})` : ""}:`
					});
					for (const block of images) imageContentParts.push({
						type: "image_url",
						image_url: { url: `data:${block.mimeType};base64,${block.data}` }
					});
				}
				j += 1;
			}
			i = j - 1;
			if (textResults.length > 0) {
				const previous = params.at(-1);
				const text = textResults.join("\n");
				if (previous?.role !== "assistant") params.push({
					role: "assistant",
					content: text
				});
				else if (Array.isArray(previous.content)) previous.content.push(...textResults.map((result) => ({
					type: "text",
					text: result
				})));
				else previous.content = previous.content ? `${previous.content}\n${text}` : text;
			}
			if (imageContentParts.length > 0) {
				if (supportsTools && textResults.length === 0 && compat.requiresAssistantAfterToolResult) params.push({
					role: "assistant",
					content: "I have processed the tool results."
				});
				params.push({
					role: "user",
					content: imageContentParts
				});
				lastRole = "user";
			} else lastRole = supportsTools && textResults.length === 0 ? "toolResult" : "assistant";
			continue;
		}
		lastRole = msg.role;
	}
	if (relocatableSplit !== void 0 && systemParamIndex !== void 0) {
		const cacheOptOutIndexes = options.cacheOptOutIndexes;
		const text = sanitizeSurrogates(stripSystemPromptCacheBoundary(relocatableSplit.relocatable));
		for (let index = systemParamIndex + 1; index < params.length; index++) {
			const param = params[index];
			if (!param || param.role !== "user") continue;
			if (typeof param.content === "string") param.content = `${param.content}\n\n${text}`;
			else if (Array.isArray(param.content)) param.content = [...param.content, {
				type: "text",
				text
			}];
			else continue;
			const systemParam = params[systemParamIndex];
			if (systemParam) systemParam.content = sanitizeSurrogates(stripSystemPromptCacheBoundary(relocatableSplit.remainingPrompt));
			cacheOptOutIndexes?.add(index);
			break;
		}
	}
	return params;
}
// packages/ai/src/transports/openai-completions-params.ts
const OPENAI_COMPLETIONS_INPUT_TOKEN_SAFETY_MARGIN = 1.25;
const OPENAI_COMPLETIONS_IMAGE_CHAR_ESTIMATE = 8e3;
const OPENAI_COMPLETIONS_VIDEO_CHAR_ESTIMATE = 96e3;
const MIN_USEFUL_OUTPUT_TOKENS = 16;
function estimateJsonChars(value, fallback) {
	try {
		return estimateStringChars(JSON.stringify(value));
	} catch {
		return fallback;
	}
}
function estimateOpenAICompletionsInputTokens(payload) {
	let adjustedChars = estimateOpenAICompletionsMessagesChars(payload.messages);
	if (payload.tools?.length) adjustedChars += estimateJsonChars(payload.tools, 1024);
	if (payload.response_format !== void 0) adjustedChars += estimateJsonChars(payload.response_format, 256);
	return Math.ceil(adjustedChars / 4 * OPENAI_COMPLETIONS_INPUT_TOKEN_SAFETY_MARGIN);
}
function estimateOpenAICompletionsMessagesChars(messages) {
	let adjustedChars = 0;
	for (const message of messages) {
		if (!message || typeof message !== "object") continue;
		const record = message;
		adjustedChars += estimateOpenAICompletionsContentChars(record.content);
		for (const field of COMPLETIONS_REASONING_REPLAY_FIELDS) adjustedChars += estimateOpenAICompletionsContentChars(record[field]);
		if (record.tool_calls !== void 0) adjustedChars += estimateJsonChars(record.tool_calls, 256);
	}
	return adjustedChars;
}
function estimateOpenAICompletionsContentChars(value) {
	if (typeof value === "string") return estimateStringChars(value);
	if (!Array.isArray(value)) return 0;
	let adjustedChars = 0;
	for (const block of value) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if (record.type === "image_url" || record.type === "input_image") {
			adjustedChars += OPENAI_COMPLETIONS_IMAGE_CHAR_ESTIMATE;
			continue;
		}
		if (record.type === "video_url" || record.type === "input_video") {
			adjustedChars += OPENAI_COMPLETIONS_VIDEO_CHAR_ESTIMATE;
			continue;
		}
		const text = record.text;
		if (typeof text === "string") {
			adjustedChars += estimateStringChars(text);
			continue;
		}
		adjustedChars += estimateJsonChars(block, 256);
	}
	return adjustedChars;
}
function convertTools(tools, compat, model, mode, mutableParameters) {
	const prepared = mode === "managed" ? prepareOpenAITools(tools) : void 0;
	const projection = prepared?.projection ?? projectOpenAITools(tools);
	const convert = () => {
		const strict = mode === "direct" ? compat.supportsStrictMode ? false : void 0 : resolveOpenAIStrictToolFlagWithDiagnostics(projection, getAiTransportHost().resolveOpenAIStrictToolSetting(model, {
			transport: "stream",
			supportsStrictMode: compat?.supportsStrictMode
		}), {
			transport: "completions",
			model
		});
		return {
			projection,
			tools: sortPromptCacheToolsByName(projection.tools).map((tool) => {
				const parameters = compat.requiresTypedUnionBranches ? normalizeToolSchema(tool.parameters, "moonshot") : tool.parameters;
				return prepareOpenAIFunctionTool(tool.name, tool.description, mode === "direct" ? parameters : normalizeOpenAIStrictToolParameters(parameters, strict === true, model.compat), strict, mutableParameters).completions;
			})
		};
	};
	return prepared ? withPreparedToolSchemaNormalization(prepared.schemas, convert) : convert();
}
function buildOpenAICompletionsParams(model, context, options) {
	return buildOpenAICompletionsRequest(model, context, options, { mode: "managed" });
}
const contextOutputBudgets = /* @__PURE__ */ new WeakMap();
function completionsInputHash(payload) {
	return shortHash(JSON.stringify([
		payload.messages,
		payload.tools,
		payload.response_format
	]));
}
function resolveCompletionsContextOutputBudget(request, payload) {
	const budget = contextOutputBudgets.get(request);
	const limits = [payload.max_tokens, payload.max_completion_tokens].filter((value) => value !== void 0);
	if (!budget || payload.model !== budget.model || !Array.isArray(payload.messages) || payload.tools !== void 0 && !Array.isArray(payload.tools) || limits.length === 0 || limits.some((value) => value !== budget.cap) || completionsInputHash(payload) !== budget.inputHash) return;
	return budget.cap;
}
function buildOpenAICompletionsRequest(model, context, options, policy) {
	let contextOutputCap;
	const resolvedPolicy = policy.mode === "direct" ? policy : {
		...policy,
		compat: getCompat(model)
	};
	const compat = resolvedPolicy.compat;
	const managedCompat = resolvedPolicy.mode === "managed" ? resolvedPolicy.compat : void 0;
	const endpointDetection = detectOpenAICompletionsCompat(model);
	const compatDetection = policy.mode === "managed" ? endpointDetection : void 0;
	const { endpointClass } = endpointDetection.capabilities;
	const cacheRetention = policy.mode === "direct" ? policy.cacheRetention : resolveCacheRetention(options?.cacheRetention);
	const cacheControl = resolveCompletionsCacheControl(compat, cacheRetention, endpointClass === "openrouter" || endpointClass === "default" && model.provider === "openrouter");
	const markTools = endpointClass !== "modelstudio-native" && !(endpointClass === "default" && [
		"modelstudio",
		"dashscope",
		"qwen"
	].includes(model.provider));
	const cacheOptOutIndexes = /* @__PURE__ */ new Set();
	const supportsTools = policy.mode === "direct" || supportsModelTools(model);
	const converted = supportsTools && context.tools ? convertTools(context.tools, compat, model, policy.mode, Boolean(options?.onPayload)) : void 0;
	const convertedMessages = convertMessages({
		...model,
		input: options?.[PROVIDER_MODEL_INPUT] ?? model.input,
		compat
	}, context, compat, {
		cacheOptOutIndexes,
		supportsTools,
		declaredToolNames: /* @__PURE__ */ new Set([...converted?.projection.tools.map((tool) => tool.name) ?? [], ...options?.[PROVIDER_DEFERRED_TOOL_NAMES] ?? []]),
		preserveSystemPromptCacheBoundary: cacheControl !== void 0 && !managedCompat?.requiresStringContent && !compat.cacheControlSystemOnly
	});
	applyCompletionsReplay(convertedMessages, model, compat);
	let messages = convertedMessages;
	if (managedCompat) {
		if (managedCompat.strictMessageKeys) messages = stripCompletionMessagesToRoleContent(messages);
		if (managedCompat.requiresStringContent) messages = flattenCompletionMessagesToStringContent(messages);
	}
	const promptCacheKey = resolvePromptCacheKey(options, cacheRetention);
	const params = {
		model: model.id,
		messages,
		stream: (options?.streaming ?? model.params?.streaming) !== false,
		...resolveOpenAIPromptCacheParams(model, cacheRetention, compat)
	};
	if (params.stream && compat.supportsUsageInStreaming) params.stream_options = { include_usage: true };
	if (compat.supportsStore) params.store = false;
	if (policy.mode === "direct" || compat.supportsPromptCacheKey && promptCacheKey) params.prompt_cache_key = compat.supportsPromptCacheKey ? promptCacheKey : void 0;
	if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) params.temperature = options.temperature;
	if (policy.mode === "managed" && options?.topP !== void 0 && !isOpenAIGpt6Model(model)) params.top_p = options.topP;
	const requestedResponseFormat = options?.responseFormat;
	const responseFormat = policy.mode === "direct" && requestedResponseFormat === void 0 ? void 0 : resolveOpenAICompletionsResponseFormat(shouldOmitOllamaCompatResponseFormat({
		provider: model.provider,
		baseUrl: model.baseUrl,
		hasTools: () => Boolean(context.tools?.length)
	}) ? void 0 : requestedResponseFormat, compat.supportsJsonSchemaResponseFormat);
	if (responseFormat !== void 0) params.response_format = responseFormat;
	if (policy.mode === "managed" && options?.frequencyPenalty !== void 0) params.frequency_penalty = options.frequencyPenalty;
	if (policy.mode === "managed" && options?.presencePenalty !== void 0) params.presence_penalty = options.presencePenalty;
	if (policy.mode === "managed" && options?.seed !== void 0) params[compat.seedField ?? "seed"] = options.seed;
	if (options?.stop !== void 0 && options.stop.length > 0) params.stop = options.stop;
	let directToolProjection;
	if (supportsTools) {
		if (converted) {
			if (policy.mode === "direct") directToolProjection = converted.projection;
			if (converted.tools.length > 0 || policy.mode === "managed" && converted.projection.inputToolCount === 0 && converted.projection.diagnostics.length === 0) params.tools = converted.tools;
			else if (hasToolCallHistory(context.messages)) params.tools = [];
			if (policy.mode === "direct" && params.stream && compat.zaiToolStream && converted.tools.length > 0) params.tool_stream = true;
			if (policy.mode === "managed" && options?.toolChoice) {
				const toolChoice = reconcileOpenAICompletionsToolChoice(options.toolChoice, converted.projection);
				if (toolChoice !== void 0) params.tool_choice = toolChoice;
			} else if (compatDetection?.capabilities.usesExplicitProxyLikeEndpoint && params.tools?.length) params.tool_choice = "auto";
		} else if (hasToolCallHistory(context.messages)) params.tools = [];
		if (compatDetection?.capabilities.usesExplicitProxyLikeEndpoint && params.tools?.length === 0) {
			delete params.tools;
			delete params.tool_choice;
		}
	}
	if (policy.mode === "direct" && compat.cacheControlFormat === "anthropic") applyCompletionsAnthropicCacheControl(params, cacheControl ?? null, cacheOptOutIndexes, markTools, true, compat.cacheControlSystemOnly, compat.cacheControlSharedSystem);
	if (policy.mode === "direct" && options?.toolChoice) {
		const toolChoice = reconcileOpenAICompletionsToolChoice(options.toolChoice, directToolProjection ?? projectOpenAITools([]));
		if (toolChoice !== void 0) params.tool_choice = toolChoice;
	}
	const isOpenRouter = compat.thinkingFormat === "openrouter";
	const usesBinaryOpenRouterThinking = isOpenRouter && (model.compat?.supportsReasoningEffort === false || model.compat?.supportedReasoningEfforts?.length === 0);
	const simpleReasoning = options?.reasoning;
	const requestedEffort = policy.mode === "direct" ? options?.reasoningEffort : options?.reasoningEffort ?? (simpleReasoning === "none" ? "none" : resolveOpenAISimpleReasoningEffort({
		...model,
		compat: model.compat ?? void 0
	}, simpleReasoning)) ?? (usesBinaryOpenRouterThinking ? void 0 : "high");
	const thinkingExplicit = options?.openclawThinkingExplicit ?? (options?.reasoningEffort !== void 0 || options?.reasoning !== void 0);
	const { effort, thinkingEnabled } = resolveOpenAIRequestReasoning(model, requestedEffort);
	const direct = policy.mode === "direct";
	{
		let effectiveMaxTokens = options?.maxTokens;
		const clampToModelMaxTokens = direct || Boolean(effectiveMaxTokens);
		if (!direct && !effectiveMaxTokens) effectiveMaxTokens = resolveMaxTokensParam(model.params) || model.maxTokens;
		const effectiveContextTokens = asPositiveFiniteNumber(model.contextTokens) ?? asPositiveFiniteNumber(model.contextWindow);
		let clampedMaxTokens = effectiveMaxTokens;
		const modelOutputLimit = asPositiveFiniteNumber(model.maxTokens);
		const modelMaxTokens = modelOutputLimit === void 0 ? void 0 : Math.floor(modelOutputLimit);
		if (clampToModelMaxTokens && clampedMaxTokens !== void 0 && modelMaxTokens !== void 0 && clampedMaxTokens > modelMaxTokens) {
			clampedMaxTokens = modelMaxTokens;
			if (policy.mode === "managed") emitModelTransportDebug(log, () => `[completions] clamp_max_tokens provider=${model.provider} api=${model.api} model=${model.id} requested=${effectiveMaxTokens} output=${clampedMaxTokens} modelMaxTokens=${modelMaxTokens}`);
		}
		if (compatDetection?.capabilities.usesExplicitProxyLikeEndpoint && clampedMaxTokens !== void 0 && effectiveContextTokens !== void 0) {
			const estimatedInputTokens = (params.response_format === void 0 ? measuredRequestPressure.get(model, context) : void 0) ?? estimateOpenAICompletionsInputTokens(params);
			const remainingBudget = Math.max(0, effectiveContextTokens - estimatedInputTokens - 1);
			if (clampedMaxTokens > remainingBudget) {
				if (remainingBudget < (params.tools?.length && params.tool_choice !== "none" ? Math.max(MIN_USEFUL_OUTPUT_TOKENS, Math.min(2048, Math.ceil((modelMaxTokens ?? 0) / 8))) : MIN_USEFUL_OUTPUT_TOKENS)) throw Object.assign(/* @__PURE__ */ new Error(`Context window exceeded: estimated input ${estimatedInputTokens} leaves only ${remainingBudget} output tokens within the ${effectiveContextTokens}-token context.`), { code: "context_length_exceeded" });
				clampedMaxTokens = remainingBudget;
				contextOutputCap = remainingBudget;
				emitModelTransportDebug(log, () => `[completions] clamp_max_tokens provider=${model.provider} api=${model.api} model=${model.id} requested=${effectiveMaxTokens} output=${clampedMaxTokens} effectiveContext=${effectiveContextTokens} estimatedInput=${estimatedInputTokens}`);
			}
		}
		if (policy.mode === "direct" ? options?.maxTokens : clampedMaxTokens) {
			if (compat.maxTokensField === "max_tokens") params.max_tokens = clampedMaxTokens;
			else params.max_completion_tokens = clampedMaxTokens;
		}
	}
	if (isOpenRouter && model.reasoning) {
		if (usesBinaryOpenRouterThinking && thinkingEnabled !== void 0) params.reasoning = { enabled: thinkingEnabled };
		else if (effort !== void 0) params.reasoning = { effort };
	}
	const nativeEffort = compat.thinkingFormat === "openrouter" ? void 0 : effort;
	const enabled = thinkingEnabled ?? false;
	const useBinaryThinking = direct || thinkingEnabled === false && (nativeEffort === void 0 || !compat.supportsReasoningEffort);
	if (model.reasoning && (!compat.thinkingOffControlUndeclared || thinkingEnabled === true || !thinkingExplicit)) {
		let allowScalarEffort = true;
		if (useBinaryThinking && compat.thinkingFormat === "zai") {
			params.thinking = enabled ? {
				type: "enabled",
				clear_thinking: false
			} : { type: "disabled" };
			allowScalarEffort = false;
		} else if (compat.thinkingFormat === "qwen") {
			params.enable_thinking = enabled;
			allowScalarEffort = false;
		} else if (compat.thinkingFormat === "qwen-chat-template") {
			const chatTemplateReasoningEffort = enabled && thinkingExplicit && model.compat?.supportedReasoningEfforts?.length ? effort : void 0;
			params.chat_template_kwargs = {
				enable_thinking: enabled,
				...direct ? { preserve_thinking: true } : {},
				...chatTemplateReasoningEffort ? { reasoning_effort: chatTemplateReasoningEffort } : {}
			};
			allowScalarEffort = false;
		} else if (compat.thinkingFormat === "together" || useBinaryThinking && compat.thinkingFormat === "deepseek") {
			if (compat.thinkingFormat === "deepseek") params.thinking = { type: enabled ? "enabled" : "disabled" };
			else params.reasoning = { enabled };
			allowScalarEffort = enabled;
		}
		if (allowScalarEffort && compat.supportsReasoningEffort && (direct ? nativeEffort !== void 0 : nativeEffort)) params.reasoning_effort = nativeEffort;
	}
	if (direct) {
		if (compat.openRouterRouting) params.provider = compat.openRouterRouting;
		if (model.baseUrl.includes("ai-gateway.vercel.sh") && model.compat?.vercelGatewayRouting) {
			const routing = model.compat.vercelGatewayRouting;
			if (routing.only || routing.order) {
				const gatewayOptions = {};
				if (routing.only) gatewayOptions.only = routing.only;
				if (routing.order) gatewayOptions.order = routing.order;
				params.providerOptions = { gateway: gatewayOptions };
			}
		}
	}
	if (policy.mode === "managed" && compat.cacheControlFormat === "anthropic") applyCompletionsAnthropicCacheControl(params, cacheControl ?? null, cacheOptOutIndexes, markTools, !managedCompat?.requiresStringContent, compat.cacheControlSystemOnly, compat.cacheControlSharedSystem);
	if (params.tools?.length && isKnownOpenAIEndpoint(model)) applyOpenAICompletionsToolReasoning(params, model);
	if (contextOutputCap !== void 0) contextOutputBudgets.set(params, {
		model: params.model,
		cap: contextOutputCap,
		inputHash: completionsInputHash(params)
	});
	return params;
}
// packages/ai/src/transports/openai-completions-dsml.ts
const DEEPSEEK_DSML_INVOKE_OPEN_PREFIXES = DEEPSEEK_DSML_MARKERS.map((marker) => `<${marker}invoke`);
const DEEPSEEK_DSML_INVOKE_OPEN_TAG = new RegExp(`^<${DEEPSEEK_DSML_MARKER_PATTERN}invoke\\b[^<>]*>$`);
const DEEPSEEK_DSML_TOOL_MAX_OPEN_TOKEN_LEN = Math.max(...DEEPSEEK_DSML_TOOL_OPEN_TOKENS.map((token) => token.length));
const DEEPSEEK_DSML_RECOVERY_MAX_BOUNDARY_LEN = Math.max(...DEEPSEEK_DSML_TOOL_OPEN_TOKENS.map((token) => token.length + 1), ...DEEPSEEK_DSML_INVOKE_OPEN_PREFIXES.map((token) => token.length + 2));
const MAX_DSML_RECOVERY_BUFFER_BYTES = 256e3;
const DEEPSEEK_DSML_SCAN_BATCH_CHARS = 65536;
const DSML_NAME_ATTRIBUTE_RE = /\bname=("([^"]*)"|'([^']*)'|([^\s>]+))/;
function createDsmlRecoverer() {
	let buffer = "";
	let bufferBytes = 0;
	let bufferEndsWithHighSurrogate = false;
	let pendingScanChars = 0;
	let activeOpenToken = null;
	let blockScanState = { offset: 0 };
	const resetBlockScan = () => {
		activeOpenToken = null;
		pendingScanChars = 0;
		blockScanState = { offset: 0 };
	};
	const consume = (final) => {
		const output = [];
		while (buffer) {
			const open = activeOpenToken ? {
				index: 0,
				token: activeOpenToken
			} : findEarliestDsmlToken(buffer, DEEPSEEK_DSML_TOOL_OPEN_TOKENS);
			if (!open) {
				resetBlockScan();
				if (final) {
					output.push({
						kind: "text",
						text: buffer
					});
					buffer = "";
					bufferBytes = 0;
					bufferEndsWithHighSurrogate = false;
					return output;
				}
				const keep = longestDsmlTokenPrefixSuffixLength(buffer, DEEPSEEK_DSML_TOOL_OPEN_TOKENS, DEEPSEEK_DSML_TOOL_MAX_OPEN_TOKEN_LEN);
				const emitLength = buffer.length - keep;
				if (emitLength > 0) {
					const emitted = buffer.slice(0, emitLength);
					output.push({
						kind: "text",
						text: emitted
					});
					bufferBytes -= Buffer.byteLength(emitted, "utf8");
					buffer = buffer.slice(emitted.length);
					if (!buffer) bufferEndsWithHighSurrogate = false;
				}
				return output;
			}
			if (open.index > 0) {
				const prefix = buffer.slice(0, open.index);
				output.push({
					kind: "text",
					text: prefix
				});
				bufferBytes -= Buffer.byteLength(prefix, "utf8");
				buffer = buffer.slice(prefix.length);
				resetBlockScan();
			}
			activeOpenToken = open.token;
			if (blockScanState.offset === 0) blockScanState.offset = open.token.length;
			const blockScan = scanDeepSeekDsmlToolBlock(buffer, open.token.replace("<", "</"), open.token.length, blockScanState);
			if (blockScan.kind === "nested-open") throw new Error("Nested DeepSeek DSML recovery wrappers are not supported");
			const close = blockScan.kind === "close" ? blockScan : null;
			if (!close) {
				if (final) {
					output.push({
						kind: "text",
						text: buffer
					});
					buffer = "";
					bufferBytes = 0;
					bufferEndsWithHighSurrogate = false;
					return output;
				}
				if (bufferBytes > MAX_DSML_RECOVERY_BUFFER_BYTES) throw new Error("Exceeded DeepSeek DSML recovery buffer limit");
				return output;
			}
			resetBlockScan();
			const body = buffer.slice(open.token.length, close.index);
			const blockText = buffer.slice(0, close.index + close.token.length);
			if (Buffer.byteLength(blockText, "utf8") > MAX_DSML_RECOVERY_BUFFER_BYTES) throw new Error("Exceeded DeepSeek DSML recovery buffer limit");
			const recoveredToolCalls = parseDeepSeekDsmlToolCallBlock(body);
			if (recoveredToolCalls.length > 0) output.push(...recoveredToolCalls);
			else output.push({
				kind: "text",
				text: blockText
			});
			bufferBytes -= Buffer.byteLength(blockText, "utf8");
			buffer = buffer.slice(blockText.length);
			if (!buffer) bufferEndsWithHighSurrogate = false;
		}
		return output;
	};
	return {
		push(chunk) {
			const append = measureUtf8AppendBytes(bufferEndsWithHighSurrogate, chunk);
			bufferBytes += append.bytes;
			bufferEndsWithHighSurrogate = append.endsWithHighSurrogate;
			buffer += chunk;
			pendingScanChars += chunk.length;
			if (activeOpenToken && pendingScanChars < DEEPSEEK_DSML_SCAN_BATCH_CHARS && !chunk.includes("<") && !chunk.includes(">") && bufferBytes <= MAX_DSML_RECOVERY_BUFFER_BYTES) return [];
			pendingScanChars = 0;
			return consume(false);
		},
		flush() {
			return consume(true);
		}
	};
}
function parseDeepSeekDsmlToolCallBlock(body) {
	const toolCalls = [];
	const invokeOpenRegex = new RegExp(`<${DEEPSEEK_DSML_MARKER_PATTERN}invoke\\b([^<>]*)>`, "g");
	let openMatch;
	while ((openMatch = invokeOpenRegex.exec(body)) !== null) {
		const invokeBodyStart = openMatch.index + openMatch[0].length;
		const invokeCloseToken = `</${openMatch[1]}invoke>`;
		const invokeCloseIndex = body.indexOf(invokeCloseToken, invokeBodyStart);
		if (invokeCloseIndex === -1) break;
		const invokeBody = body.slice(invokeBodyStart, invokeCloseIndex);
		invokeOpenRegex.lastIndex = invokeCloseIndex + invokeCloseToken.length;
		const invokeName = parseDsmlNameAttribute(openMatch[2] ?? "");
		if (!invokeName) continue;
		const parsedArguments = parseDeepSeekDsmlInvokeArguments(invokeBody);
		if (!parsedArguments) continue;
		toolCalls.push({
			kind: "toolCall",
			name: invokeName,
			arguments: parsedArguments,
			partialJson: JSON.stringify(parsedArguments)
		});
	}
	return toolCalls;
}
function parseDeepSeekDsmlInvokeArguments(body) {
	const args = {};
	const parameterRegex = new RegExp(`<${DEEPSEEK_DSML_MARKER_PATTERN}parameter\\b([^>]*)>([\\s\\S]*?)</\\1parameter>`, "g");
	let parameterMatch;
	while ((parameterMatch = parameterRegex.exec(body)) !== null) {
		const name = parseDsmlNameAttribute(parameterMatch[2] ?? "");
		if (!name) continue;
		const rawValue = parameterMatch[3] ?? "";
		if (rawValue.length === 0) {
			const stringAttribute = Array.from((parameterMatch[2] ?? "").matchAll(/(?:^|\s)([^\s=]+)=(?:"([^"]*)"|'([^']*)'|([^\s"']+))(?=\s|$)/g)).find((attribute) => attribute[1] === "string");
			if ((stringAttribute?.[2] ?? stringAttribute?.[3] ?? stringAttribute?.[4]) !== "true") continue;
		}
		Object.defineProperty(args, name, {
			value: decodeDeepSeekDsmlText(rawValue),
			enumerable: true,
			configurable: true,
			writable: true
		});
	}
	if (Object.keys(args).length > 0) return args;
	const trimmed = body.trim();
	if (!trimmed.startsWith("{")) return null;
	try {
		const parsed = JSON.parse(trimmed);
		if (isRecord(parsed) && Object.keys(parsed).length > 0) return parsed;
	} catch {
		return null;
	}
	return null;
}
function parseDsmlNameAttribute(attributes) {
	const match = DSML_NAME_ATTRIBUTE_RE.exec(attributes);
	const value = match?.[2] ?? match?.[3] ?? match?.[4];
	return value ? decodeDeepSeekDsmlText(value) : null;
}
function decodeDeepSeekDsmlText(value) {
	return value.replaceAll("&quot;", "\"").replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
}
function scanDeepSeekDsmlToolBlock(text, closeToken, contentStartIndex, state) {
	while (state.offset < text.length) {
		if (state.invoke?.kind === "open") {
			const nextOpen = text.indexOf("<", state.offset);
			const nextClose = text.indexOf(">", state.offset);
			if (nextClose === -1 && nextOpen === -1) {
				state.offset = text.length;
				return { kind: "incomplete" };
			}
			if (nextOpen !== -1 && (nextClose === -1 || nextOpen < nextClose)) {
				state.invoke = void 0;
				state.offset = nextOpen;
				continue;
			}
			const invokeOpenTag = text.slice(state.invoke.start, nextClose + 1);
			const open = DEEPSEEK_DSML_INVOKE_OPEN_TAG.exec(invokeOpenTag);
			if (!open) {
				state.offset = state.invoke.start + 1;
				state.invoke = void 0;
				continue;
			}
			state.invoke = {
				kind: "body",
				closeToken: `</${open[1]}invoke>`
			};
			state.offset = nextClose + 1;
			continue;
		}
		if (state.invoke?.kind === "body") {
			const invokeCloseIndex = text.indexOf(state.invoke.closeToken, state.offset);
			if (invokeCloseIndex === -1) {
				state.offset = Math.max(0, text.length - DEEPSEEK_DSML_RECOVERY_MAX_BOUNDARY_LEN + 1);
				return { kind: "incomplete" };
			}
			state.offset = invokeCloseIndex + state.invoke.closeToken.length;
			state.invoke = void 0;
			continue;
		}
		const toolOpen = findEarliestDsmlToken(text, DEEPSEEK_DSML_TOOL_OPEN_TOKENS, state.offset);
		const toolCloseIndex = text.indexOf(closeToken, state.offset);
		const invokeOpen = findEarliestDsmlToken(text, DEEPSEEK_DSML_INVOKE_OPEN_PREFIXES, state.offset);
		const next = [
			toolOpen ? {
				kind: "nested-open",
				...toolOpen
			} : null,
			toolCloseIndex === -1 ? null : {
				kind: "close",
				index: toolCloseIndex,
				token: closeToken
			},
			invokeOpen ? {
				kind: "invoke-open",
				...invokeOpen
			} : null
		].filter((candidate) => candidate !== null).toSorted((left, right) => left.index - right.index)[0];
		if (!next) {
			state.offset = Math.max(contentStartIndex, text.length - DEEPSEEK_DSML_RECOVERY_MAX_BOUNDARY_LEN + 1);
			return { kind: "incomplete" };
		}
		if (next.kind === "invoke-open") {
			state.invoke = {
				kind: "open",
				start: next.index
			};
			state.offset = next.index + next.token.length;
			continue;
		}
		return next;
	}
	return { kind: "incomplete" };
}
// packages/ai/src/transports/openai-completions-gemma.ts
const OPEN = "<|tool_call>";
const CLOSE = "<tool_call|>";
const QUOTE = "<|\"|>";
const MAX_RECOVERY_BYTES = 256e3;
function recoverGemmaCalls(text) {
	const parts = [];
	const opener = /\s*<\|tool_call>\s*call:([\w.-]+)\s*/y;
	const token = /\s*(<\|"\|>[\s\S]*?<\|"\|>|[\w.+-]+|[{}[\],:])\s*/y;
	let offset = 0;
	while (offset < text.length) {
		if (!text.slice(offset).trim()) {
			parts.push({
				kind: "text",
				text: text.slice(offset)
			});
			break;
		}
		opener.lastIndex = offset;
		const head = opener.exec(text);
		const name = head?.[1];
		if (!head || !name) return;
		const leading = /^\s*/.exec(head[0])?.[0] ?? "";
		if (leading) parts.push({
			kind: "text",
			text: leading
		});
		token.lastIndex = opener.lastIndex;
		let depth = 0;
		const json = [];
		do {
			const value = token.exec(text)?.[1];
			if (!value || json.length === 0 && value !== "{") return;
			if (value === "{") depth += 1;
			else if (value === "}") depth -= 1;
			json.push(value.startsWith(QUOTE) ? JSON.stringify(value.slice(5, -5)) : text[token.lastIndex] === ":" && /^[A-Za-z_][\w.-]*$/.test(value) ? JSON.stringify(value) : value);
		} while (depth > 0);
		if (!text.startsWith(CLOSE, token.lastIndex)) return;
		try {
			const argumentsValue = JSON.parse(json.join(" "));
			if (!isRecord(argumentsValue)) return;
			parts.push({
				kind: "toolCall",
				name,
				arguments: argumentsValue,
				partialJson: JSON.stringify(argumentsValue)
			});
		} catch {
			return;
		}
		offset = token.lastIndex + 12;
	}
	return parts;
}
/** Buffer only a possible standalone call batch; prose and examples stay text. */
function createGemmaToolCallRecoverer() {
	let buffer = "";
	let bytes = 0;
	let highSurrogate = false;
	let passthrough = false;
	return {
		push(text) {
			if (passthrough) return [{
				kind: "text",
				text
			}];
			const append = measureUtf8AppendBytes(highSurrogate, text);
			bytes += append.bytes;
			highSurrogate = append.endsWithHighSurrogate;
			buffer += text;
			const candidate = buffer.trimStart();
			if (OPEN.startsWith(candidate) || candidate.startsWith(OPEN)) {
				if (bytes > MAX_RECOVERY_BYTES) throw new Error("Exceeded Gemma tool-call recovery buffer limit");
				return [];
			}
			passthrough = true;
			const result = [{
				kind: "text",
				text: buffer
			}];
			buffer = "";
			return result;
		},
		flush(allowRecovery = true) {
			const text = buffer;
			buffer = "";
			passthrough ||= !allowRecovery;
			const recovered = allowRecovery ? recoverGemmaCalls(text) : void 0;
			return text ? recovered ?? [{
				kind: "text",
				text
			}] : [];
		}
	};
}
// packages/ai/src/transports/openai-completions-stream.ts
let reasoningParserModule;
function extractToolCallThoughtSignature(toolCall) {
	const tc = toolCall;
	if (!tc) return;
	const extra = tc.extra_content?.google;
	return readNonEmptyStringPreservingWhitespace(extra?.thought_signature) ?? readNonEmptyStringPreservingWhitespace(tc.function?.thought_signature) ?? readNonEmptyStringPreservingWhitespace(tc.thought_signature) ?? readNonEmptyStringPreservingWhitespace(asOptionalRecord(tc.provider_specific_fields)?.thought_signature);
}
async function* observeOpenAICompletionsProgress(responseStream, signal) {
	const maxUsageTokens = {
		prompt: 0,
		completion: 0,
		total: 0,
		reasoning: 0
	};
	for await (const rawChunk of responseStream) {
		throwIfModelStreamAborted(signal);
		if (rawChunk && typeof rawChunk === "object") {
			const chunk = rawChunk;
			const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
			const usage = chunk.usage || choice?.usage;
			let hasUsageProgress = false;
			for (const [counter, reported] of [
				["prompt", usage?.prompt_tokens],
				["completion", usage?.completion_tokens],
				["total", usage?.total_tokens],
				["reasoning", usage?.completion_tokens_details?.reasoning_tokens]
			]) {
				const tokens = asPositiveFiniteNumber(reported) ?? 0;
				if (tokens > maxUsageTokens[counter]) {
					maxUsageTokens[counter] = tokens;
					hasUsageProgress = true;
				}
			}
			const rawChoiceDelta = choice?.delta ?? choice?.message;
			notifyLlmRequestActivity(signal, Boolean(hasUsageProgress || choice?.finish_reason || rawChoiceDelta && (rawChoiceDelta.tool_calls?.length || hasOpenAICompletionsDeltaContent(rawChoiceDelta))));
		}
		yield rawChunk;
	}
}
async function processCompletionsStream(responseStream, output, model, stream, options) {
	const { createReasoningTagTextPartitioner } = await (reasoningParserModule ??= import("./internal/reasoning-tag-text-partitioner.mjs"));
	const MAX_POST_TOOL_CALL_BUFFER_BYTES = 256e3;
	const directMode = options?.mode === "direct";
	const emitReasoning = options?.emitReasoning ?? true;
	const openAIModel = model;
	const compat = getCompat(openAIModel);
	const visibleReasoningDetailTypes = new Set(compat.visibleReasoningDetailTypes);
	const deepSeekTextFilter = compat.emitsDsmlToolCalls ? createDeepSeekTextFilter() : null;
	const deepSeekToolCallRecoverer = !directMode && compat.emitsDsmlToolCalls ? createDsmlRecoverer() : null;
	const gemmaToolCallRecoverer = !directMode && /gemma-?4/i.test(model.id) ? createGemmaToolCallRecoverer() : null;
	const reasoningTagTextPartitioner = createReasoningTagTextPartitioner();
	if (options?.strictReasoningTags) reasoningTagTextPartitioner.markStrict();
	let currentBlock = null;
	const directContent = { block: null };
	let currentTextSource;
	let sawReasoning = false;
	let suppressedReasoning = false;
	let pendingPostToolCallDeltas = [];
	let pendingPostToolCallBytes = 0;
	const toolCallBlocksByIndex = /* @__PURE__ */ new Map();
	const toolCallBlocksById = /* @__PURE__ */ new Map();
	const encryptedReasoning = createOpenAIEncryptedToolCallReasoningTracker();
	const toolArgumentPreviewSchedules = /* @__PURE__ */ new WeakMap();
	const blockIndices = /* @__PURE__ */ new WeakMap();
	const normalizeToolCallDeltas = createOpenAICompletionsToolCallDeltaNormalizer();
	let finishReason;
	let sawNativeToolCallDelta = false;
	const blockIndex = () => directMode && currentBlock && currentBlock.type !== "toolCall" ? blockIndices.get(currentBlock) ?? output.content.length - 1 : output.content.length - 1;
	let chunkPushedEvent = false;
	const pushStreamEvent = (event) => {
		chunkPushedEvent = true;
		stream.push(detachPartialSnapshot(event));
	};
	const appendToolCallBlock = (block) => {
		output.content.push(block);
		blockIndices.set(block, output.content.length - 1);
		pushStreamEvent({
			type: "toolcall_start",
			contentIndex: blockIndices.get(block) ?? -1,
			partial: output
		});
	};
	const queuePostToolCallDelta = (next) => {
		const nextBytes = Buffer.byteLength(next.text, "utf8");
		if (pendingPostToolCallBytes + nextBytes > MAX_POST_TOOL_CALL_BUFFER_BYTES) throw new Error("Exceeded post-tool-call delta buffer limit");
		pendingPostToolCallBytes += nextBytes;
		const previous = pendingPostToolCallDeltas[pendingPostToolCallDeltas.length - 1];
		if (!previous || previous.kind !== next.kind || previous.kind === "text" && next.kind === "text" && previous.source !== next.source || previous.kind === "thinking" && next.kind === "thinking" && previous.signature !== next.signature) {
			pendingPostToolCallDeltas.push(next);
			return;
		}
		previous.text += next.text;
	};
	const appendContentDelta = (delta) => {
		flushPendingPostToolCallDeltas();
		if (directMode && directContent.block?.type === delta.kind) currentBlock = directContent.block;
		if (delta.kind === "text" && currentBlock?.type === "text" && currentTextSource !== delta.source) currentBlock = null;
		if (!currentBlock || currentBlock.type !== delta.kind) {
			options?.beforeContentBlock?.(delta.kind);
			if (delta.kind === "text") {
				currentBlock = {
					type: "text",
					text: ""
				};
				currentTextSource = delta.source;
			} else currentBlock = {
				type: "thinking",
				thinking: "",
				...delta.signature ? { thinkingSignature: delta.signature } : {}
			};
			if (directMode) directContent.block = currentBlock;
			output.content.push(currentBlock);
			blockIndices.set(currentBlock, output.content.length - 1);
			pushStreamEvent({
				type: `${delta.kind}_start`,
				contentIndex: blockIndex(),
				partial: output
			});
		}
		if (currentBlock.type === "thinking") appendAssistantThinking(currentBlock, delta.text);
		else currentBlock.text += delta.text;
		const event = {
			contentIndex: blockIndex(),
			delta: delta.text
		};
		if (delta.kind === "thinking") pushStreamEvent({
			type: "thinking_delta",
			...event,
			partial: output
		});
		else pushStreamEvent({
			type: "text_delta",
			...event,
			...directMode ? { partial: output } : {}
		});
	};
	const flushPendingPostToolCallDeltas = () => {
		if (currentBlock?.type === "toolCall" || pendingPostToolCallDeltas.length === 0) return;
		const bufferedDeltas = pendingPostToolCallDeltas;
		pendingPostToolCallDeltas = [];
		pendingPostToolCallBytes = 0;
		for (const delta of bufferedDeltas) if (delta.kind === "text" || emitReasoning) appendContentDelta(delta);
	};
	const appendVisibleTextDelta = (text) => {
		if (!text) return;
		if (currentBlock?.type === "toolCall" && !directMode) queuePostToolCallDelta({
			kind: "text",
			text
		});
		else appendContentDelta({
			kind: "text",
			text
		});
	};
	const appendReasoningDeltas = (reasoningDeltas) => {
		for (const delta of reasoningDeltas) {
			if (delta.kind === "thinking" && !emitReasoning) continue;
			if (currentBlock?.type === "toolCall" && !directMode) {
				queuePostToolCallDelta({ ...delta });
				continue;
			}
			appendContentDelta(delta.kind === "thinking" && directMode && model.provider === "opencode-go" && delta.signature === "reasoning" ? {
				...delta,
				signature: "reasoning_content"
			} : delta);
		}
	};
	const recoveredToolCallBlocks = /* @__PURE__ */ new Set();
	const appendRecoveredToolCall = (toolCall) => {
		if (currentBlock?.type === "toolCall") {
			currentBlock = null;
			flushPendingPostToolCallDeltas();
		}
		const block = {
			type: "toolCall",
			id: `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`,
			name: toolCall.name,
			arguments: toolCall.arguments,
			partialJson: toolCall.partialJson
		};
		recoveredToolCallBlocks.add(block);
		currentBlock = block;
		appendToolCallBlock(block);
		pushStreamEvent({
			type: "toolcall_delta",
			contentIndex: blockIndices.get(block) ?? -1,
			delta: toolCall.partialJson,
			partial: output
		});
	};
	const appendRecoveredParts = (recoveredParts) => {
		for (const recoveredPart of recoveredParts) {
			if (recoveredPart.kind === "toolCall") {
				appendRecoveredToolCall(recoveredPart);
				continue;
			}
			const parts = deepSeekTextFilter?.push(recoveredPart.text) ?? [recoveredPart.text];
			for (const part of parts) appendVisibleTextDelta(part);
		}
	};
	const appendPartitionedVisibleDelta = (delta) => {
		if (delta.kind === "text") appendRecoveredParts(deepSeekToolCallRecoverer?.push(delta.text) ?? [{
			kind: "text",
			text: delta.text
		}]);
	};
	const emitReasoningUsageActivity = (hasReasoningUsageActivity) => {
		if (directMode || !hasReasoningUsageActivity || chunkPushedEvent || !emitReasoning) return;
		const latestBlock = output.content[output.content.length - 1];
		if (currentBlock?.type === "text" || currentBlock?.type === "toolCall") return;
		if (latestBlock?.type === "text" || latestBlock?.type === "toolCall") return;
		appendContentDelta({
			kind: "thinking",
			text: ""
		});
	};
	const flushReasoningTagTextPartitioner = (allowRecovery = true) => {
		const recoverUnclosed = allowRecovery && !sawReasoning && output.stopReason !== "length" && output.stopReason !== "error" && output.stopReason !== "aborted";
		for (const delta of reasoningTagTextPartitioner.flush({ recoverUnclosed })) appendPartitionedVisibleDelta(delta);
	};
	const flushGemmaToolCallRecoverer = (allowRecovery = true) => {
		for (const part of gemmaToolCallRecoverer?.flush(allowRecovery) ?? []) if (part.kind === "toolCall") appendRecoveredToolCall(part);
		else for (const delta of reasoningTagTextPartitioner.pushVisible(part.text)) appendPartitionedVisibleDelta(delta);
	};
	const sealTextBeforeReasoning = () => {
		if (currentBlock?.type !== "text" && !reasoningTagTextPartitioner.hasPending()) return;
		flushReasoningTagTextPartitioner();
		if (currentBlock?.type !== "text") return;
		currentBlock = null;
		if (directMode) directContent.block = null;
		currentTextSource = void 0;
	};
	const beginReasoning = (hasFollowingVisibleText) => {
		sawReasoning = true;
		if (!hasFollowingVisibleText || !reasoningTagTextPartitioner.hasPendingSyntax()) sealTextBeforeReasoning();
	};
	const events = directMode ? responseStream : iterateModelStream(responseStream, options?.signal);
	let maxReasoningTokens = 0;
	let providerProcessingMs;
	for await (const rawChunk of events) {
		throwIfModelStreamAborted(options?.signal);
		chunkPushedEvent = false;
		if (!rawChunk || typeof rawChunk !== "object") continue;
		const chunk = rawChunk;
		const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
		const usage = chunk.usage || choice?.usage;
		const rawChoiceDelta = choice?.delta ?? choice?.message;
		if (Boolean(choice?.finish_reason || rawChoiceDelta && (rawChoiceDelta.tool_calls?.length || hasOpenAICompletionsDeltaContent(rawChoiceDelta)) || asNonNegativeFiniteNumber(usage?.prompt_tokens) !== void 0 || asNonNegativeFiniteNumber(usage?.completion_tokens) !== void 0 || asNonNegativeFiniteNumber(usage?.total_tokens) !== void 0 || asNonNegativeFiniteNumber(usage?.completion_tokens_details?.reasoning_tokens) !== void 0)) {
			output.responseId ||= chunk.id;
			if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) output.responseModel ||= chunk.model;
		}
		if (chunk.timings !== void 0 && (choice?.finish_reason || Array.isArray(chunk.choices) && chunk.choices.length === 0 && chunk.usage)) {
			const promptMs = asNonNegativeFiniteNumber(chunk.timings?.prompt_ms);
			const predictedMs = asNonNegativeFiniteNumber(chunk.timings?.predicted_ms);
			providerProcessingMs = promptMs !== void 0 && predictedMs !== void 0 ? asNonNegativeFiniteNumber(promptMs + predictedMs) : void 0;
		}
		const reasoningTokens = asPositiveFiniteNumber(usage?.completion_tokens_details?.reasoning_tokens) ?? 0;
		const hasReasoningUsageActivity = reasoningTokens > maxReasoningTokens;
		maxReasoningTokens = Math.max(maxReasoningTokens, reasoningTokens);
		if (usage) {
			output.usage = parseOpenAICompletionsUsage(usage, model, { includeReasoningTokens: !directMode });
			const terminalUsage = Boolean(finishReason || choice?.finish_reason || chunk.choices?.length === 0);
			const completeCounts = [usage.prompt_tokens, usage.completion_tokens].every((value) => typeof value === "number" && Number.isFinite(value) && value >= 0);
			output.usage.usageReport = { state: terminalUsage && completeCounts ? "available" : "unavailable" };
		}
		if (!choice) {
			emitReasoningUsageActivity(hasReasoningUsageActivity);
			continue;
		}
		if (choice.finish_reason) {
			const finishReasonResult = mapOpenAIStopReason(choice.finish_reason, { allowSingularToolCall: true });
			output.stopReason = finishReasonResult.stopReason;
			finishReason = finishReasonResult.stopReason;
			if (finishReasonResult.errorMessage) output.errorMessage = finishReasonResult.errorMessage;
		}
		if (!rawChoiceDelta) {
			emitReasoningUsageActivity(hasReasoningUsageActivity);
			continue;
		}
		for (const normalizedDelta of normalizeToolCallDeltas(rawChoiceDelta, choice.finish_reason)) {
			const choiceDelta = normalizedDelta.delta;
			const deltaFields = choiceDelta;
			const reasoningBatch = readOpenAICompletionsReasoningBatch(deltaFields, visibleReasoningDetailTypes);
			const reasoningDeltas = reasoningBatch.deltas;
			const hasReasoningThinking = reasoningBatch.hasThinking;
			if (hasReasoningThinking && !model.reasoning && !emitReasoning && !suppressedReasoning) {
				suppressedReasoning = true;
				recordSuppressedReasoning(output);
			}
			const contentDeltas = readOpenAICompletionsContentDeltas(choiceDelta.content, choiceDelta.refusal, reasoningBatch.mirroredThinking);
			const lastVisibleTextIndex = contentDeltas.findLastIndex((delta) => delta.kind === "text");
			const hasSameChunkVisibleText = reasoningBatch.hasVisibleText || lastVisibleTextIndex !== -1;
			if (hasReasoningThinking) {
				beginReasoning(hasSameChunkVisibleText);
				appendReasoningDeltas(reasoningDeltas);
			}
			for (const [contentDeltaIndex, contentDelta] of contentDeltas.entries()) if (contentDelta.kind === "text") {
				const parts = gemmaToolCallRecoverer?.push(contentDelta.text) ?? [contentDelta];
				for (const part of parts) for (const routedDelta of reasoningTagTextPartitioner.pushVisible(part.text)) appendPartitionedVisibleDelta(routedDelta);
			} else {
				beginReasoning(contentDeltaIndex < lastVisibleTextIndex);
				if (emitReasoning) {
					if (currentBlock?.type === "toolCall" && !directMode) queuePostToolCallDelta(contentDelta);
					else appendContentDelta(contentDelta);
				}
			}
			if (!hasReasoningThinking) appendReasoningDeltas(reasoningDeltas);
			const toolCallDeltas = normalizedDelta.toolCalls;
			if (toolCallDeltas.length > 0) {
				flushGemmaToolCallRecoverer(false);
				sawNativeToolCallDelta = true;
				flushReasoningTagTextPartitioner(false);
				for (const toolCall of toolCallDeltas) {
					const streamIndex = typeof toolCall.index === "number" ? toolCall.index : void 0;
					let block = streamIndex !== void 0 ? toolCallBlocksByIndex.get(streamIndex) : void 0;
					if (!block && toolCall.id) block = toolCallBlocksById.get(toolCall.id);
					if (!block) {
						if (currentBlock?.type === "toolCall") {
							currentBlock = null;
							flushPendingPostToolCallDeltas();
						}
						const initialSig = directMode ? void 0 : extractToolCallThoughtSignature(toolCall);
						options?.beforeContentBlock?.("toolCall");
						if (directMode && directContent.block?.type === "thinking") directContent.block = null;
						block = {
							type: "toolCall",
							id: toolCall.id || "",
							name: toolCall.function?.name || "",
							arguments: {},
							partialJson: "",
							...initialSig ? { thoughtSignature: initialSig } : {}
						};
						encryptedReasoning.rememberToolCall(block.id, block);
						toolArgumentPreviewSchedules.set(block, createToolArgumentPreviewSchedule());
						appendToolCallBlock(block);
					}
					if (streamIndex !== void 0 && !toolCallBlocksByIndex.has(streamIndex)) toolCallBlocksByIndex.set(streamIndex, block);
					if (toolCall.id) {
						const previousId = block.id;
						if (!directMode || !block.id) block.id = toolCall.id;
						toolCallBlocksById.set(toolCall.id, block);
						if (block.id === toolCall.id) encryptedReasoning.rememberToolCall(toolCall.id, block, previousId);
					}
					currentBlock = block;
					const conflictingId = directMode && block.id && toolCall.id && block.id !== toolCall.id;
					if (toolCall.function?.name && !conflictingId) block.name = toolCall.function.name;
					const deltaSig = directMode ? void 0 : extractToolCallThoughtSignature(toolCall);
					if (deltaSig) block.thoughtSignature = deltaSig;
					const toolArgumentsDelta = toolCall.function?.arguments;
					if (toolArgumentsDelta) {
						block.partialJson += toolArgumentsDelta;
						if (toolArgumentPreviewSchedules.get(block)?.(block.partialJson.length)) block.arguments = parseStreamingJson(block.partialJson);
					}
					if (toolArgumentsDelta || directMode) pushStreamEvent({
						type: "toolcall_delta",
						contentIndex: blockIndices.get(block) ?? -1,
						delta: toolArgumentsDelta ?? "",
						partial: output
					});
				}
			}
			encryptedReasoning.consumeDetails(deltaFields.reasoning_details);
		}
		flushPendingPostToolCallDeltas();
		emitReasoningUsageActivity(hasReasoningUsageActivity);
	}
	throwIfModelStreamAborted(options?.signal);
	if (!finishReason && (directMode || options?.sawStreamDONE?.() === false)) throw new Error("Stream ended without finish_reason");
	flushGemmaToolCallRecoverer();
	flushReasoningTagTextPartitioner();
	appendRecoveredParts(deepSeekToolCallRecoverer?.flush() ?? []);
	for (const part of deepSeekTextFilter?.flush() ?? []) appendVisibleTextDelta(part);
	currentBlock = null;
	flushPendingPostToolCallDeltas();
	if (sawNativeToolCallDelta && recoveredToolCallBlocks.size > 0) output.content = output.content.filter((block) => block.type !== "toolCall" || !recoveredToolCallBlocks.has(block));
	finalizeOpenAICompletionsToolCalls(output, {
		allowSilentToolCallPromotion: finishReason === "stop" || sawNativeToolCallDelta && (options?.sawStreamDONE?.() ?? false),
		onConfirmedToolCall(block, contentIndex) {
			if (directMode) return;
			pushStreamEvent({
				type: "toolcall_end",
				contentIndex,
				toolCall: block,
				partial: output
			});
		}
	});
	output.usage.usageReport ??= { state: "unavailable" };
	if ((!output.usage.contextUsage || output.usage.usageReport.state === "unavailable") && !options?.signal?.aborted && output.stopReason !== "error" && output.stopReason !== "aborted") {
		output.usage.contextUsage = { state: "unavailable" };
		if (!compat.supportsUsageInStreaming) warnMissingStreamingUsage(openAIModel);
	}
	if (providerProcessingMs !== void 0) appendAssistantMessageDiagnostic(output, {
		type: "provider_timing",
		timestamp: Date.now(),
		details: { processingMs: providerProcessingMs }
	});
	if (suppressedReasoning) {
		const error = recordSuppressedReasoning(output);
		if (error) throw error;
	}
}
const MAX_MISSING_USAGE_HINT_KEYS = 256;
const missingUsageHintKeys = /* @__PURE__ */ new Set();
function warnMissingStreamingUsage(model) {
	if (detectOpenAICompletionsCompat(model).capabilities.endpointClass !== "custom") return;
	const key = `${model.provider}/${model.id}`;
	if (missingUsageHintKeys.has(key) || missingUsageHintKeys.size >= MAX_MISSING_USAGE_HINT_KEYS) return;
	missingUsageHintKeys.add(key);
	log.warn(`${key} returned no token usage; context size is estimated and token accounting is unavailable. If this endpoint supports stream_options.include_usage, set compat.supportsUsageInStreaming: true on the model in models.providers.${model.provider}.models.`, {
		provider: model.provider,
		model: model.id
	});
}
function shouldEmitOpenAICompletionsReasoning(model, options, mode = "managed") {
	if (model.compat?.requiresReasoningContentOnAssistantMessages || requiresReasoningContentReplay(model.id)) return true;
	if (!model.reasoning) return false;
	const effort = options?.reasoningEffort ?? (mode === "managed" ? options?.reasoning ?? "high" : void 0);
	return Boolean(effort && isOpenAICompletionsThinkingEnabled(effort));
}
// packages/ai/src/providers/openai-web-search-tools.ts
function hasResponsesWebSearchTool(tools) {
	if (!Array.isArray(tools)) return false;
	return tools.some((tool) => {
		if (!isRecord(tool)) return false;
		if (tool.type === "web_search") return true;
		if (tool.type === "function" && tool.name === "web_search") return true;
		const fn = tool.function;
		return isRecord(fn) && fn.name === "web_search";
	});
}
// packages/ai/src/transports/openai-responses-params-internal.ts
const OPENAI_CODEX_RESPONSES_UNSUPPORTED_PARAMS = [
	"max_output_tokens",
	"metadata",
	"prompt_cache_retention",
	"prompt_cache_options",
	"service_tier",
	"temperature",
	"top_p"
];
function stripOpenAICodexResponsesUnsupportedTextFields(params) {
	const text = params.text;
	if (!text || typeof text !== "object" || Array.isArray(text)) return;
	const sanitizedText = { ...text };
	delete sanitizedText.format;
	if (Object.keys(sanitizedText).length > 0) params.text = sanitizedText;
	else delete params.text;
}
function sanitizeOpenAICodexResponsesParams(model, params) {
	if (!usesNativeOpenAICodexResponsesBackend(model)) return params;
	for (const key of OPENAI_CODEX_RESPONSES_UNSUPPORTED_PARAMS) delete params[key];
	Object.assign(params, { store: false });
	stripOpenAICodexResponsesUnsupportedTextFields(params);
	return params;
}
function buildOpenAIResponsesInstructionsText(context) {
	if (!context.systemPrompt) return;
	return prepareSystemPrompt(context.systemPrompt, context.preparedSystemPrompt).instructions;
}
function buildOpenAIResponsesCompactSystemMessage(model, instructions) {
	const compat = getCompat(model);
	const role = model.reasoning && compat.supportsDeveloperRole ? "developer" : "system";
	return buildResponsesInputMessage(role, [{
		type: "input_text",
		text: instructions
	}]);
}
function buildOpenAIResponsesParams(model, context, options, metadata, replayMode = "checkpoint", retainUserProvenance = false, onItemRecovery, nativeCompactEndpoint = false) {
	const payloadPolicy = resolveOpenAIResponsesPayloadPolicy(model, {
		storeMode: "transport-default",
		nativeCompactEndpoint
	});
	const policyAllowsReplayIds = payloadPolicy.explicitStore !== false && !payloadPolicy.shouldStripStore;
	const replayResponsesItemIds = !usesNativeOpenAICodexResponsesBackend(model) && (options?.replayResponsesItemIds ?? policyAllowsReplayIds);
	const conversion = {
		includeSystemPrompt: !payloadPolicy.usesInstructionsField,
		replayResponsesItemIds,
		authProfileId: options?.authProfileId,
		mutableInput: hasMutableModelPayloadHook(options?.onPayload),
		sessionId: options?.sessionId,
		replayMode,
		retainUserProvenance,
		onItemRecovery
	};
	const messages = takeResponsesContextUsageInput(model, context, conversion) ?? convertResponsesMessages(model, context, OPENAI_RESPONSES_TOOL_CALL_PROVIDERS, conversion);
	if (messages.length === 0 && context.systemPrompt) {
		if (!buildOpenAIResponsesInstructionsText(context)) throw new Error("OpenAI Responses requires non-empty input when only systemPrompt is provided.");
		messages.push(buildResponsesInputMessage("user", [{
			type: "input_text",
			text: " "
		}]));
	}
	const cacheRetention = resolveCacheRetention(options?.cacheRetention);
	const compat = getCompat(model);
	const promptCacheKey = compat.supportsPromptCacheKey ? resolvePromptCacheKey(options, cacheRetention) : void 0;
	let instructions = payloadPolicy.usesInstructionsField ? buildOpenAIResponsesInstructionsText(context) : void 0;
	if (payloadPolicy.usesInstructionsField && (!instructions || instructions.trim().length === 0)) instructions = usesNativeOpenAICodexResponsesBackend(model) ? OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS : void 0;
	const params = {
		model: model.id,
		input: messages,
		stream: true,
		prompt_cache_key: promptCacheKey,
		...resolveOpenAIPromptCacheParams(model, cacheRetention, compat, options?.promptCacheTtl),
		...instructions ? { instructions } : {},
		...metadata ? { metadata } : {}
	};
	const effectiveMaxTokens = options?.maxTokens || model.maxTokens;
	if (effectiveMaxTokens) params.max_output_tokens = clampMaxTokensToModel(model, Math.max(effectiveMaxTokens, 16));
	if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) params.temperature = options.temperature;
	if (options?.topP !== void 0 && (!isOpenAIGpt6Model(model) || resolveOpenAIThinkingApi(model.api) === "azure-openai-responses")) params.top_p = options.topP;
	if (options?.responseFormat !== void 0) params.text = {
		...params.text,
		format: resolveOpenAIResponsesTextFormat(options.responseFormat)
	};
	if (options?.serviceTier !== void 0 && payloadPolicy.allowsServiceTier) params.service_tier = options.serviceTier;
	if (context.tools) {
		const tools = context.tools;
		const strict = getAiTransportHost().resolveOpenAIStrictToolSetting(model, {
			transport: "stream",
			supportsStrictMode: compat.supportsStrictMode
		});
		const { projection, tools: converted } = prepareResponsesTools(tools, strict, model, Boolean(options?.onPayload));
		if (converted.length > 0 || projection.inputToolCount === 0 && projection.diagnostics.length === 0) params.tools = converted;
		if (options?.toolChoice) {
			const toolChoice = reconcileOpenAIResponsesToolChoice(options.toolChoice, projection);
			if (toolChoice !== void 0) params.tool_choice = toolChoice;
		}
	}
	if (model.reasoning) {
		const reasoning = options?.reasoning;
		const requestedEffort = options?.reasoningEffort ?? (reasoning === "none" ? "none" : resolveOpenAISimpleReasoningEffort(model, reasoning)) ?? (options?.reasoningSummary ? "high" : payloadPolicy.defaultManagedReasoningEffort);
		const resolvedEffort = requestedEffort === void 0 ? void 0 : resolveOpenAIRequestReasoning(model, requestedEffort).effort;
		if (resolvedEffort !== void 0) {
			let effort = resolvedEffort;
			if (effort === "minimal" && hasResponsesWebSearchTool(params.tools)) for (const candidate of [
				"low",
				"medium",
				"high"
			]) {
				const resolved = resolveOpenAIRequestReasoning(model, candidate).effort;
				if (resolved && resolved !== "none" && resolved !== "minimal") {
					effort = resolved;
					break;
				}
			}
			const summary = effort !== "none" && (options?.reasoningEffort || options?.reasoning || options?.reasoningSummary !== void 0) ? options.reasoningSummary === void 0 ? "auto" : options.reasoningSummary : void 0;
			params.reasoning = {
				effort,
				...summary !== void 0 ? { summary } : {}
			};
			if (summary !== void 0) params.include = ["reasoning.encrypted_content"];
		}
	}
	applyOpenAIResponsesPayloadPolicy(params, payloadPolicy);
	return sanitizeOpenAICodexResponsesParams(model, params);
}
// packages/ai/src/transports/openai-responses-compact-client.ts
async function postOpenAIResponsesCompaction(params) {
	const instructions = typeof params.request.instructions === "string" && params.request.instructions.length > 0 ? params.request.instructions : void 0;
	const body = instructions && !supportsNativeOpenAIResponsesEndpoint(params.model) ? {
		model: params.request.model,
		input: [buildOpenAIResponsesCompactSystemMessage(params.model, instructions), ...params.request.input ?? []]
	} : {
		model: params.request.model,
		input: params.request.input,
		...instructions ? { instructions } : {}
	};
	const response = await params.client.post("/responses/compact", {
		...buildOpenAISdkRequestOptions(params.model, params.options?.signal, { timeoutMs: params.options?.timeoutMs }),
		body
	});
	if (!isRecord(response) || response.object !== "response.compaction") throw new Error("Responses compact endpoint must return a response.compaction object");
	const output = response.output;
	if (!isOpenAIResponsesCompactionOutput(output, params.model)) throw new Error(`Responses compact endpoint: ${getOpenAIResponsesCompactionOutputError(output, params.model)}`);
	const window = output;
	const item = window.at(-1);
	if (window.length > 1 && !supportsNativeOpenAIResponsesEndpoint(params.model)) throw new Error("Responses compact endpoint: retained messages require native OpenAI");
	const usage = isRecord(response.usage) ? response.usage : void 0;
	if (!usage || typeof usage.input_tokens !== "number" || typeof usage.output_tokens !== "number") throw new Error("Responses compact endpoint: usage must include input_tokens and output_tokens");
	const reasoningTokens = readResponsesReasoningTokens(usage);
	const modelUsage = {
		...createZeroUsage(),
		...mapResponsesTerminalUsage(usage),
		...reasoningTokens === void 0 ? {} : { reasoningTokens },
		usageReport: { state: "available" }
	};
	calculateCost(params.model, modelUsage);
	applyResponsesCacheWritePricing(modelUsage, usage);
	return {
		output: window,
		item,
		historyMode: window.length > 1 ? "retained-users" : "compacted-prefix",
		usage,
		modelUsage,
		model: params.model,
		replayMetadata: buildOpenAIResponsesReasoningReplayMetadata(params.model, { sessionId: params.options?.sessionId })
	};
}
// packages/ai/src/transports/openai-responses-reasoning-state.ts
/** Save only admitted settings and hashes, never another copy of the conversation. */
function recordResponsesReasoningState(message, model, identity, request, output) {
	if (!supportsResponsesReasoningUpdate(request) || !isRecord(request.reasoning) || !request.input || request.previous_response_id || message.providerReplay || output.some((item) => isRecord(item) && item.type === "compaction")) return;
	const reasoning = {
		...buildProviderReplayContext(model, identity),
		effort: request.reasoning.effort,
		controls: request.input.reduce((controls, item, index) => {
			if (isConfigurationUpdate(item)) controls.push({
				index,
				item
			});
			return controls;
		}, []),
		inputLength: request.input.length,
		outputLength: output.length,
		prefixHash: responsesContinuationPrefixFingerprint(request.input, output),
		requestHash: responsesContinuationRequestFingerprint(request)
	};
	Object.assign(message, { openclawResponsesInputReplay: {
		...readResponsesInputReplayState(message),
		reasoning
	} });
}
/** A cold transport can replay controls, but cannot resurrect a server response handle. */
function restoreResponsesReasoningState(context, model, identity, request) {
	const latest = context.messages.findLast((message) => message.role === "assistant");
	const state = latest ? readResponsesInputReplayState(latest)?.reasoning : void 0;
	if (!isRecord(state)) return request;
	const { effort, inputLength, outputLength, controls, prefixHash, requestHash } = state;
	if (!isProviderReplayContext(state) || !providerReplayContextMatches(state, buildProviderReplayContext(model, identity)) || latest?.providerReplay || !supportsResponsesReasoningUpdate(request) || !isRecord(request.reasoning) || !request.input || request.previous_response_id || request.input.some(isConfigurationUpdate) || typeof effort !== "string" || typeof inputLength !== "number" || !Number.isSafeInteger(inputLength) || inputLength < 0 || typeof outputLength !== "number" || !Number.isSafeInteger(outputLength) || outputLength < 0 || !Array.isArray(controls) || controls.length > inputLength || inputLength + outputLength > request.input.length + controls.length) return request;
	const previousInput = request.input.slice(0, inputLength - controls.length);
	let lastIndex = -1;
	for (const control of controls) {
		if (!isRecord(control) || typeof control.index !== "number" || !Number.isSafeInteger(control.index) || control.index <= lastIndex || control.index > previousInput.length || !isConfigurationUpdate(control.item)) return request;
		previousInput.splice(control.index, 0, control.item);
		lastIndex = control.index;
	}
	const previous = {
		...request,
		reasoning: {
			...request.reasoning,
			effort
		},
		input: previousInput
	};
	if (responsesContinuationRequestFingerprint(previous) !== requestHash) return request;
	const prepared = replayResponsesReasoningUpdates(previous, request, outputLength);
	if (responsesContinuationPrefixFingerprint((prepared.input ?? []).slice(0, inputLength + outputLength)) !== prefixHash) return request;
	return prepared;
}
// packages/ai/src/transports/openai-responses-request-fetch.ts
function withDefaultResponsesStreamEncoding(fetch) {
	return (input, init) => {
		const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : void 0));
		if (headers.has("accept-encoding")) return fetch(input, init);
		headers.set("accept-encoding", "identity");
		return fetch(input, {
			...init,
			headers
		});
	};
}
/** Preserve the existing fetch policy while binding explicit continuation dispatch to its signal. */
function createResponsesRequestFetch(model, options) {
	const lifecycle = options.lifecycle;
	if (lifecycle && options.compact) throw new Error("Provider review continuation cannot replace its reviewed input with compaction");
	let fetchOverride = options.compact ? createBoundedOpenAIResponsesCompactionFetch(buildGuardedModelFetch(model)) : options.stream ? withDefaultResponsesStreamEncoding(buildGuardedModelFetch(model, void 0, { onSseComment: options.onSseComment })) : void 0;
	if (lifecycle) {
		const dispatchFetch = fetchOverride ?? buildGuardedModelFetch(model);
		fetchOverride = async (input, init) => {
			const signal = init?.signal ?? (input instanceof Request ? input.signal : void 0);
			await lifecycle.beforeDispatch(signal ?? void 0);
			signal?.throwIfAborted();
			lifecycle.assertCurrent();
			return dispatchFetch(input, init);
		};
	}
	return fetchOverride;
}
// packages/ai/src/transports/openai-responses-steering.ts
function cloneWireRequest(request) {
	const serialized = JSON.stringify(request);
	return JSON.parse(serialized);
}
async function projectResponsesSteeringInput(request, project) {
	const { input: activeInput, ...activeSettings } = cloneWireRequest(request);
	if (!Array.isArray(activeInput)) return [];
	const { input, ...settings } = cloneWireRequest(await project());
	if (!Array.isArray(input) || !isDeepStrictEqual(settings, activeSettings) || !isDeepStrictEqual(input.slice(0, activeInput.length), activeInput)) return [];
	const projected = input.slice(activeInput.length);
	return projected.every((item) => isRecord(item) && item.role === "user") ? projected : [];
}
/** One response owns admission; accepted input stays on this connection until continuation. */
function createResponsesSteering(params) {
	const needsContinuation = params.needsContinuation;
	let responseId;
	let active = params;
	let unsubscribe;
	const pending = [];
	const accepted = /* @__PURE__ */ new Map();
	const acknowledged = /* @__PURE__ */ new Set();
	const seal = () => {
		active = void 0;
		const cleanup = unsubscribe;
		unsubscribe = void 0;
		cleanup?.();
	};
	return {
		get responseId() {
			return responseId;
		},
		get pending() {
			return pending.length > 0;
		},
		get acceptedInput() {
			return [...accepted.values()].flat();
		},
		seal,
		close(error) {
			seal();
			for (const submission of pending.splice(0)) submission.reject(error);
		},
		handle(event) {
			if (!isRecord(event)) return false;
			if (event.type === "response.created" && !responseId && active) {
				const response = isRecord(event.response) ? event.response : void 0;
				if (typeof response?.id !== "string" || !response.id.trim()) throw new Error("Responses steering requires a response identity");
				const activeResponseId = response.id;
				responseId = activeResponseId;
				const cleanup = active.onActiveResponse({
					needsContinuation: needsContinuation === void 0 ? void 0 : () => needsContinuation,
					steer(messages) {
						if (!active || messages.length === 0) return Promise.resolve(false);
						active.assertActive();
						const converted = active.toInput(messages);
						const submit = (input) => {
							const callbacks = active;
							if (!callbacks || input.length === 0) return Promise.resolve(false);
							callbacks.assertActive();
							return new Promise((resolve, reject) => {
								pending.push({
									input,
									resolve,
									reject
								});
								callbacks.send({
									type: "response.steer",
									previous_response_id: activeResponseId,
									input
								});
							});
						};
						return Array.isArray(converted) ? submit(converted) : converted.then(submit);
					}
				});
				if (!active) cleanup?.();
				else unsubscribe = cleanup;
				return false;
			}
			if (event.type !== "response.steer.accepted" && event.type !== "response.steer.failed" && event.type !== "response.steer.pending") return false;
			const steer = isRecord(event.steer) ? event.steer : void 0;
			if (!responseId || steer?.previous_response_id !== responseId) throw new Error("Responses steering acknowledgement has an unexpected identity");
			if (event.type === "response.steer.failed" && steer.id === void 0) {
				const index = pending.findIndex((submission) => stableStringify(submission.input) === stableStringify(steer.input));
				const submission = pending[index];
				if (!submission) throw new Error("Responses steering acknowledgement has no pending submission");
				pending.splice(index, 1);
				submission.resolve(false);
				return true;
			}
			if (typeof steer.id !== "string" || !steer.id.trim()) throw new Error("Responses steering acknowledgement has an unexpected identity");
			if (event.type === "response.steer.pending") {
				if (!accepted.has(steer.id)) throw new Error("Responses steering pending event has no accepted submission");
				return true;
			}
			if (event.type === "response.steer.failed" && accepted.has(steer.id)) throw new Error("OpenAI could not apply accepted steering; the queued message remains in the conversation");
			if (acknowledged.has(steer.id)) throw new Error("Responses steering acknowledgement was already applied");
			const submission = pending.shift();
			if (!submission) throw new Error("Responses steering acknowledgement has no pending submission");
			acknowledged.add(steer.id);
			if (event.type === "response.steer.accepted") {
				accepted.set(steer.id, submission.input);
				submission.resolve(true);
			} else submission.resolve(false);
			return true;
		}
	};
}
/** Accepted steering is prepended by the server, so never repeat it in response.create. */
function omitAcceptedSteering(input, accepted) {
	const remaining = [...input];
	for (const message of accepted) {
		const index = remaining.findIndex((item) => stableStringify(item) === stableStringify(message));
		if (index < 0) throw new Error("Responses steering continuation no longer contains the accepted user input");
		remaining.splice(index, 1);
	}
	return remaining;
}
// packages/ai/src/transports/openai-responses-websocket-options.ts
function resolveNativeOpenAIResponsesWebSocketMode(model, transport) {
	if (transport !== "websocket" && transport !== "websocket-cached" && transport !== "auto") return;
	if (getAiTransportHost().requiresManagedTransport(model, "fetch")) return;
	return supportsNativeOpenAIResponsesEndpoint(model) ? transport : void 0;
}
function combineWebSocketTimeoutSignal(signal, model, timeoutMs) {
	const resolvedTimeoutMs = timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : getAiTransportHost().resolveModelRequestTimeoutMs(model);
	if (resolvedTimeoutMs === void 0 || !Number.isFinite(resolvedTimeoutMs)) return signal;
	return AbortSignal.any([signal, AbortSignal.timeout(Math.max(1, resolvedTimeoutMs))]);
}
// packages/ai/src/transports/openai-responses-websocket-recovery.ts
/** Owns safe WebSocket rejection recovery; transport selection and session leases stay with the caller. */
function createRecoverableResponsesWebSocketStream(params) {
	const { trackedWebSocketStream, websocket, websocketSignal, options, output, buildRequest, createSseStream, closeWebSocketForFallback, logWebSocketFallback, startStream } = params;
	return { async *[Symbol.asyncIterator]() {
		let acceptance = "pending";
		let outputObserved = false;
		try {
			for await (const event of trackedWebSocketStream) {
				const { failure, hasResponseOutput } = readResponsesRecoveryEvent(event);
				outputObserved ||= hasResponseOutput;
				if (isResponsesItemConflict(failure) && !outputObserved && output.content.length === 0) throw new OpenAIResponsesWebSocketSafeRetryError("item_conflict", void 0, null, "Stored Responses item conflicts", failure);
				if (isResponsesServiceTierRejection(failure) && !websocket.hasActiveResponse) throw new OpenAIResponsesWebSocketSafeRetryError("invalid_request_error", void 0, "service_tier", "Invalid service_tier argument", failure);
				if (acceptance === "pending") {
					acceptance = "observing";
					await notifyProviderStreamOpened({
						options,
						cancelStream: () => websocket.finish({ keep: false })
					});
					acceptance = "accepted";
				}
				startStream();
				yield event;
			}
		} catch (error) {
			if (error instanceof OpenAIResponsesWebSocketSafeRetryError) {
				if (isResponsesServiceTierRejection(error)) {
					const nextTier = nextResponsesServiceTier(websocket.request.service_tier, error);
					if (!nextTier || outputObserved || acceptance === "observing" || output.content.length || websocketSignal.aborted || websocket.hasActiveResponse) throw error;
					closeWebSocketForFallback("service_tier_rejected");
					const rejectedTier = websocket.request.service_tier;
					if (rejectedTier === "ultrafast" || rejectedTier === "priority") responsesServiceTierObserver.reject(options, rejectedTier);
					yield* await createSseStream({
						...await buildRequest("full-history"),
						service_tier: nextTier
					});
					return;
				}
				const replayRejected = isInvalidEncryptedContentError(error) || isResponsesItemConflict(error);
				if (isResponsesItemConflict(error) && (outputObserved || output.content.length || websocketSignal.aborted)) throw error;
				const recovery = replayRejected ? await resolveNextResponsesEncryptedContentAttempt({
					kind: "initial",
					request: {
						...websocket.request,
						stream: true
					}
				}, error, {
					buildFullHistoryRequest: () => buildRequest("full-history"),
					buildItemConflictRequest: params.buildItemConflictRequest
				}) : void 0;
				if (replayRejected && !recovery) throw error;
				closeWebSocketForFallback(`safe_server_error code=${error.code} status=${safeDebugValue(error.status)} param=${safeDebugValue(error.param)}`);
				yield* await createSseStream(recovery?.request ?? await buildRequest("full-history"), recovery?.kind ?? "continuation-rejected", recovery?.rejectedCompaction);
				return;
			}
			if (websocketSignal.aborted || !(error instanceof OpenAIResponsesWebSocketPreDispatchError)) throw error;
			params.setTransportToSse();
			logWebSocketFallback("before_first_event");
			yield* await createSseStream();
		}
	} };
}
// packages/ai/src/transports/openai-responses-client.ts
function createResponsesTransportExecutor(config) {
	return (model, context, options) => {
		const responsesOptions = options;
		const compactRequest = claimResponsesCompactRequest(responsesOptions);
		const v2Compaction = compactRequest?.mode === "v2" ? createResponsesV2CompactionCollector(compactRequest.replayBudget) : void 0;
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = createAssistantOutput(model, config.outputApi);
			let firstEventAbort;
			let requestSignal = options?.signal;
			let continuationClaim;
			const itemRecovery = createResponsesItemConflictRecovery(output, model, responsesOptions);
			const requestLifecycle = responsesRequestLifecycle.get(options);
			try {
				if (compactRequest && requestLifecycle) throw new Error("Provider review continuation cannot replace its reviewed input with compaction");
				const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
				const websocketMode = resolveNativeOpenAIResponsesWebSocketMode(model, responsesOptions?.transport);
				const encodeBody = prepareModelRequestBody(websocketMode || compactRequest?.mode === "endpoint" ? void 0 : options);
				const turnState = resolveProviderTransportTurnState(model, {
					sessionId: options?.sessionId,
					turnId: randomUUID(),
					attempt: 1,
					transport: websocketMode ? "websocket" : "stream"
				});
				const websocketSessionPolicy = websocketMode ? turnState?.websocket : void 0;
				const httpTurnHeaders = filterProviderTurnHeadersForExplicitOpencodeSession(model, options, turnState?.headers);
				const websocketTurnHeaders = filterProviderTurnHeadersForExplicitOpencodeSession(model, options, websocketSessionPolicy?.headers);
				const websocketHeaders = websocketMode ? buildOpenAIClientHeaders(model, context, options?.headers, websocketTurnHeaders, options?.sessionId, options?.cacheRetention) : void 0;
				const httpHeaders = buildOpenAIClientHeaders(model, context, options?.headers, httpTurnHeaders, options?.sessionId, options?.cacheRetention);
				const fetchOverride = withOpenAIErrorResponseHook(createResponsesRequestFetch(model, {
					compact: compactRequest?.mode === "endpoint",
					stream: config.streamRequest,
					lifecycle: requestLifecycle,
					onSseComment: () => notifyLlmRequestActivity(options?.signal, false, 9e5)
				}) ?? buildGuardedModelFetch(model), options?.onResponse, model);
				const client = await config.createClient(model, apiKey, httpHeaders, fetchOverride);
				const nativeAstra = model.id === "gpt-6-astra" && supportsNativeOpenAIResponsesEndpoint(model);
				const asyncToolExecutionEligible = nativeAstra && options?.asyncToolExecution === true && !responsesOptions?.openclawCodeModeToolSurface;
				const prepareRequest = async (request) => {
					let params = request;
					const preserveUsers = v2Compaction?.preserveUsers(request.input ?? []);
					const nextParams = await awaitProviderLifecycleCallback(options?.onPayload ? () => options.onPayload?.(params, model) : void 0, options?.signal);
					if (nextParams !== void 0) params = nextParams;
					enforceOpenAIResponsesCompactionReplayStorage(params, resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "preserve" }));
					if (preserveUsers) params = {
						...params,
						input: preserveUsers(params.input ?? [])
					};
					params = sanitizeOpenAICodexResponsesParams(model, params);
					params = sanitizeResponsesImagePayload(params);
					if (responsesOptions?.openclawCodeModeToolSurface === true) {
						const visibleToolNames = resolveCodeModeResponsesVisibleToolNames(context);
						const allowedHostedToolTypes = responsesOptions?.openclawCodeModeAllowedHostedToolTypes;
						enforceCodeModeResponsesToolSurface(params, visibleToolNames, allowedHostedToolTypes, codeModeToolSurfaceObserver.get(options));
						assertCodeModeResponsesToolSurface(params, visibleToolNames, allowedHostedToolTypes);
					}
					if (asyncToolExecutionEligible && params.model === "gpt-6-astra" && params.multi_agent?.enabled !== true && params.tools) {
						const synchronousTools = new Set(context.tools?.flatMap((tool) => tool.async === false ? [tool.name] : []));
						params.tools = params.tools.map((tool) => tool.type === "function" && !synchronousTools.has(tool.name) ? {
							...tool,
							async: true
						} : tool);
					}
					if (v2Compaction) {
						params.input = [...params.input ?? [], { type: "compaction_trigger" }];
						v2Compaction.assertReplayFits(params.input, model);
					}
					return params;
				};
				const buildRequest = (replayMode, requestContext = context) => prepareRequest(config.buildRequest(model, requestContext, responsesOptions, turnState?.metadata, replayMode, Boolean(v2Compaction), itemRecovery.applied, compactRequest?.mode === "endpoint" && supportsNativeOpenAIResponsesEndpoint(model)));
				const buildItemConflictRequest = () => itemRecovery.retry(buildRequest);
				let params = await buildRequest("checkpoint");
				const asyncTools = !compactRequest && asyncToolExecutionEligible && params.model === "gpt-6-astra" && params.multi_agent?.enabled !== true;
				if (compactRequest?.mode === "endpoint") {
					const compacted = await postOpenAIResponsesCompaction({
						client,
						model,
						request: params,
						options: responsesOptions
					});
					output.usage = compacted.modelUsage;
					compactRequest.resolve(compacted);
					finalizeTransportStream({
						stream,
						output,
						signal: options?.signal
					});
					return;
				}
				const sessionId = options?.sessionId;
				if (config.httpContinuation && !compactRequest && !websocketMode && !getAiTransportHost().requiresManagedTransport(model) && (supportsNativeOpenAIResponsesEndpoint(model) || resolveOpenAIResponsesPayloadPolicy(model).explicitContinuationOptIn) && sessionId && (params.store === true || supportsResponsesReasoningUpdate(params)) && !params.previous_response_id) {
					const restoreRequest = () => restoreResponsesReasoningState(context, model, responsesOptions, params);
					continuationClaim = claimOpenAIResponsesHttpContinuation({
						sessionId,
						apiKey,
						baseUrl: model.baseUrl,
						headers: httpHeaders,
						request: params,
						restoreRequest
					});
					params = continuationClaim?.fullRequest ?? restoreRequest();
				}
				const observePrompt = createResponsesPromptEgressObserver(responsesOptions, context);
				const requestStartedAt = Date.now();
				let started = false;
				const startStream = () => {
					if (!started) {
						started = true;
						stream.push({
							type: "start",
							partial: output
						});
					}
				};
				const firstEvent = createFirstStreamEventAbortController(options?.signal);
				firstEventAbort = firstEvent;
				const requestOptions = buildOpenAISdkRequestOptions(model, firstEvent.signal, {
					stream: config.streamRequest,
					timeoutMs: options?.timeoutMs
				});
				const websocketSignal = combineWebSocketTimeoutSignal(firstEvent.signal, model, requestOptions?.timeout);
				emitModelTransportDebug(log, () => `[responses] start provider=${model.provider} api=${model.api} model=${model.id} requestIdHash=${redactIdentifier(options?.requestId, { len: 64 })} baseUrl=${formatModelTransportDebugBaseUrl(model.baseUrl)} timeoutMs=${safeDebugValue(requestOptions?.timeout)} apiKey=${apiKey ? "present" : "missing"} ${summarizeResponsesPayload(params)}`);
				const responseModelTracker = createResponseModelTracker(isOpenAICodexResponsesModel(model));
				let continuationBaseline;
				let dispatchedPreviousResponseId;
				let contextUsageEligible = true;
				let requestedTier;
				const createSseStream = async (initialRequest = continuationClaim?.request ?? params, initialAttemptKind = "initial", initialRejectedCompaction) => {
					requestSignal = firstEvent.signal;
					const { stream: responseStream } = await createResponsesStreamWithRecovery({
						client,
						request: initialRequest,
						requestOptions,
						model,
						encodeBody,
						observePrompt,
						initialAttemptKind,
						initialRejectedCompaction,
						buildFullHistoryRequest: () => buildRequest("full-history"),
						buildItemConflictRequest,
						onCompactionRejected: (checkpoint) => suppressOpenAIResponsesCompaction(output, model, responsesOptions, checkpoint),
						canRetryStream: () => output.content.length === 0,
						onServiceTierRejected: (tier) => responsesServiceTierObserver.reject(options, tier),
						wrapStream: ({ stream: rawResponseStream, response, attempt }) => {
							requestedTier = attempt.request.service_tier;
							contextUsageEligible &&= attempt.kind === "initial";
							dispatchedPreviousResponseId = attempt.request.previous_response_id;
							continuationBaseline = attempt.request.previous_response_id ? params : attempt.request;
							const trackedResponseStream = responseModelTracker.track(response, rawResponseStream);
							return withProviderResponseHook({
								stream: observeResponsesStream(v2Compaction ? v2Compaction.observe(trackedResponseStream) : trackedResponseStream, model, requestStartedAt, attempt.request),
								signal: firstEvent.signal,
								abort: firstEvent.abort,
								hook: createOpenAIProviderAcceptanceHook(options, response, model),
								onReady: () => {
									emitModelTransportDebug(log, () => `[responses] headers provider=${model.provider} api=${model.api} model=${model.id} transport=sse elapsedMs=${Date.now() - requestStartedAt}`);
									startStream();
								}
							});
						}
					});
					return responseStream;
				};
				let responseStream;
				let websocketBaseline;
				let finishWebSocket;
				let transport = "sse";
				const logWebSocketFallback = (reason) => emitModelTransportDebug(log, () => `[responses] websocket_fallback provider=${model.provider} api=${model.api} model=${model.id} reason=${reason}`);
				const closeWebSocketForFallback = (reason) => {
					finishWebSocket?.({ keep: false });
					finishWebSocket = void 0;
					transport = "sse";
					logWebSocketFallback(reason);
				};
				if (websocketMode) {
					requestSignal = websocketSignal;
					try {
						const { createOpenAIResponsesWebSocketStream } = await import("./openai-responses-websocket-DRTM_Uwo.mjs");
						if (websocketSignal.aborted) throw transportAbortError(websocketSignal);
						const websocket = createOpenAIResponsesWebSocketStream({
							client,
							request: params,
							restoreRequest: (request) => restoreResponsesReasoningState(context, model, responsesOptions, request),
							mode: websocketMode,
							sessionId: options?.sessionId,
							headers: websocketHeaders,
							signal: websocketSignal,
							callerSignal: options?.signal,
							degradeCooldownMs: websocketSessionPolicy?.degradeCooldownMs,
							onActiveResponse: !compactRequest && nativeAstra && params.model === "gpt-6-astra" ? options?.onActiveResponse : void 0,
							steeringInput: (messages) => {
								contextUsageEligible = false;
								return projectResponsesSteeringInput(params, () => buildRequest("checkpoint", {
									...context,
									messages: [...context.messages, ...messages]
								}));
							}
						});
						finishWebSocket = websocket.finish;
						requestedTier = websocket.request.service_tier;
						websocketBaseline = websocket.fullRequest;
						recordResponsesInputReplay(output, websocket.inputReplay);
						contextUsageEligible &&= websocket.inputReplay === void 0;
						observePrompt?.(websocket.request, {
							egress: "responses-websocket",
							payloadVariant: "initial"
						});
						transport = "websocket";
						emitModelTransportDebug(log, () => `[responses] websocket_selected provider=${model.provider} api=${model.api} model=${model.id} mode=${websocketMode} reused=${websocket.reusedConnection} continuation=${websocket.continuationStatus === "continued"} continuationStatus=${websocket.continuationStatus} sessionIdHash=${redactIdentifier(options?.sessionId)} headersHash=${redactIdentifier(JSON.stringify(Object.entries(websocketHeaders ?? {}).toSorted(([a], [b]) => a.localeCompare(b))))}`);
						responseStream = createRecoverableResponsesWebSocketStream({
							trackedWebSocketStream: observeResponsesStream(v2Compaction ? v2Compaction.observe(responseModelTracker.track(void 0, websocket.stream)) : responseModelTracker.track(void 0, websocket.stream), model, requestStartedAt, websocket.request, "websocket"),
							websocket,
							websocketSignal,
							options,
							output,
							buildRequest,
							buildItemConflictRequest,
							createSseStream,
							closeWebSocketForFallback,
							logWebSocketFallback,
							startStream,
							setTransportToSse: () => {
								transport = "sse";
							}
						});
					} catch (error) {
						if (error instanceof OpenAIResponsesWebSocketPostDispatchError) throw error;
						closeWebSocketForFallback("setup_failure");
						responseStream = await createSseStream();
					}
				} else responseStream = await createSseStream();
				try {
					const acceptedResponseStream = withResponsesRequestAcceptance(responseStream, requestLifecycle, transport === "websocket" ? websocketSignal : firstEvent.signal);
					const terminal = await processResponsesStream(acceptedResponseStream, output, stream, model, {
						canRetryIdentityConflict: () => hasOnlyResponsesFunctionTools(transport === "websocket" ? websocketBaseline : continuationBaseline),
						...config.pricingOptions?.(responsesOptions, model),
						promptCacheTtl: params.prompt_cache_options?.ttl,
						resolveServiceTier: (responseTier, originalTier) => responseTier ?? (requestedTier === "priority" || requestedTier === "default" ? requestedTier : originalTier),
						onServiceTier: (tier, response) => responsesServiceTierObserver.observe(options, requestedTier, tier, response),
						firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options) ?? config.firstEventTimeoutMs,
						abortFirstEventStream: firstEvent.abort,
						onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
						signal: options?.signal,
						reasoningReplayMetadata: buildOpenAIResponsesReasoningReplayMetadata(model, { sessionId: options?.sessionId }),
						asyncToolExecution: asyncTools,
						...responseModelTracker.terminalOptions
					});
					finishWebSocket?.();
					if (options?.signal?.aborted) throw transportAbortError(options.signal);
					if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
					const admitted = transport === "websocket" ? websocketBaseline : continuationBaseline;
					if (v2Compaction && compactRequest) {
						const compacted = v2Compaction.finish({
							terminal,
							input: params.input ?? [],
							model,
							options: responsesOptions
						});
						compactRequest.resolve({
							...compacted,
							modelUsage: output.usage
						});
						finalizeTransportStream({
							stream,
							output,
							signal: options?.signal
						});
						return;
					}
					if (terminal && admitted && supportsNativeOpenAIResponsesEndpoint(model)) recordResponsesReasoningState(output, model, responsesOptions, admitted, terminal.output);
					if (continuationClaim && continuationBaseline && terminal) continuationClaim.commit(continuationBaseline, terminal, dispatchedPreviousResponseId);
					if (terminal && admitted && contextUsageEligible) recordResponsesContextUsage(output, model, responsesOptions, admitted, terminal.output, "transport");
				} catch (error) {
					finishWebSocket?.({ keep: false });
					throw error;
				}
				emitModelTransportDebug(log, () => `[responses] completed provider=${model.provider} api=${model.api} model=${model.id} transport=${transport} elapsedMs=${Date.now() - requestStartedAt}`);
				finalizeTransportStream({
					stream,
					output,
					signal: options?.signal
				});
			} catch (error) {
				itemRecovery.reject(error);
				if (error instanceof DegenerateToolCallArgumentsError) firstEventAbort?.abort(error);
				if (requestLifecycle) await requestLifecycle.settle().catch(() => void 0);
				if (compactRequest) {
					compactRequest.reject(error);
					failTransportStream({
						stream,
						output,
						signal: options?.signal,
						error
					});
					return;
				}
				failTransportStream({
					stream,
					output,
					signal: options?.signal,
					error,
					diagnostic: observeResponsesTransportFailure({
						error,
						model,
						output,
						signal: options?.signal,
						requestSignal
					})
				});
			} finally {
				itemRecovery.finish();
				continuationClaim?.release();
				firstEventAbort?.dispose();
			}
		})();
		return eventStream;
	};
}
function createOpenAIResponsesTransportStreamFn() {
	return createResponsesTransportExecutor({
		streamRequest: true,
		httpContinuation: true,
		createClient: async (...args) => {
			const { createOpenAIResponsesClient } = await import("./openai-provider-client-BsOmrexA.mjs");
			return createOpenAIResponsesClient(...args);
		},
		buildRequest: buildOpenAIResponsesParams,
		pricingOptions: (options, model) => ({
			serviceTier: options?.serviceTier,
			applyServiceTierPricing: (usage, serviceTier) => applyResponsesServiceTierPricing(usage, serviceTier, model)
		})
	});
}
function createAzureOpenAIResponsesTransportStreamFn() {
	return createResponsesTransportExecutor({
		outputApi: "azure-openai-responses",
		firstEventTimeoutMs: AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS,
		createClient: async (...args) => {
			const { createAzureOpenAIClient } = await import("./openai-provider-client-BsOmrexA.mjs");
			return createAzureOpenAIClient(...args);
		},
		buildRequest: (model, context, options, metadata, replayMode, retainUsers, onItemRecovery) => {
			const deploymentName = resolveAzureDeploymentNameFromMap({
				modelId: model.id,
				deploymentMap: process.env.AZURE_OPENAI_DEPLOYMENT_NAME_MAP
			});
			const params = buildOpenAIResponsesParams(model, context, options, metadata, replayMode, retainUsers, onItemRecovery);
			params.model = deploymentName;
			delete params.store;
			return params;
		}
	});
}
// packages/ai/src/transports/openai-completions-transport.ts
function assertOpenAICompletionsPayloadHasConversationTurn(params, model) {
	const messages = params.messages;
	if (!Array.isArray(messages) || hasOpenAICompatibleConversationTurn(messages)) return;
	throw new Error(`OpenAI-compatible chat payload for ${model.provider}/${model.id} contains no non-empty user or assistant messages after compaction and transport transforms; refusing to send a system/tool-only request. Start a new user turn or repair the compacted session history.`);
}
const MAX_CONTEXT_BUDGET_BUFFER_CHUNKS = 8192;
const MAX_CONTEXT_BUDGET_BUFFER_BYTES = 4194304;
const SSE_DONE_LINE_RE = /^data:[ \t]*\[DONE\][ \t]*$/i;
const SSE_DONE_MAX_LINE_CHARS = 1024;
function createSseDoneDetector() {
	const decoder = new TextDecoder();
	let line = "";
	let lineOverflowed = false;
	let sawDone = false;
	const finishLine = () => {
		if (!lineOverflowed && SSE_DONE_LINE_RE.test(line)) sawDone = true;
		line = "";
		lineOverflowed = false;
	};
	const observeText = (text) => {
		for (const [index, segment] of text.split(/[\r\n]/).entries()) {
			if (index > 0) finishLine();
			if (!lineOverflowed && line.length + segment.length <= SSE_DONE_MAX_LINE_CHARS) line += segment;
			else lineOverflowed = true;
		}
	};
	return {
		observe(chunk) {
			if (!sawDone) observeText(decoder.decode(chunk, { stream: true }));
		},
		finish() {
			if (sawDone) return;
			observeText(decoder.decode());
			if (line || lineOverflowed) finishLine();
		},
		sawDone: () => sawDone
	};
}
function createDirectCompletionsEventStream(output, stream) {
	const finishedBlocks = /* @__PURE__ */ new Set();
	const contentIndices = /* @__PURE__ */ new WeakMap();
	let openTextBlock;
	let openThinkingBlock;
	const finishBlock = (block) => {
		const contentIndex = contentIndices.get(block);
		if (contentIndex === void 0 || finishedBlocks.has(block)) return;
		finishedBlocks.add(block);
		if (block.type === "text") {
			openTextBlock = void 0;
			stream.push({
				type: "text_end",
				contentIndex,
				content: block.text,
				partial: output
			});
		} else if (block.type === "thinking") {
			openThinkingBlock = void 0;
			stream.push({
				type: "thinking_end",
				contentIndex,
				content: block.thinking,
				partial: output
			});
		} else if (block.type === "toolCall") stream.push({
			type: "toolcall_end",
			contentIndex,
			toolCall: block,
			partial: output
		});
	};
	return {
		stream: { push(event) {
			if (event.type === "text_start" || event.type === "thinking_start" || event.type === "toolcall_start") {
				const block = output.content[event.contentIndex];
				if (block) {
					contentIndices.set(block, event.contentIndex);
					if (block.type === "text") openTextBlock = block;
					else if (block.type === "thinking") openThinkingBlock = block;
				}
			}
			stream.push(event);
		} },
		beforeContentBlock: (nextType) => {
			if (openThinkingBlock) finishBlock(openThinkingBlock);
			if (openTextBlock && nextType !== "toolCall") finishBlock(openTextBlock);
		},
		finish(includeToolCalls) {
			for (const block of output.content) if (block.type !== "toolCall" || includeToolCalls) finishBlock(block);
		}
	};
}
function createOpenAICompletionsTransportStreamFn() {
	const streamResponses = createOpenAIResponsesTransportStreamFn();
	return (model, context, options) => {
		const completionsOptions = options;
		if (model.reasoning && context.tools?.length && supportsModelTools(model) && isNativeOpenAIEndpoint(model)) {
			const toolChoice = completionsOptions?.toolChoice;
			const responsesOptions = {
				...options,
				...completionsOptions?.reasoning === void 0 && completionsOptions?.reasoningEffort === void 0 ? { reasoningEffort: "high" } : {},
				...toolChoice && typeof toolChoice === "object" ? { toolChoice: toOpenAIResponsesToolChoice(toolChoice) } : {}
			};
			return streamResponses(getAiTransportHost().inheritManagedTransport(model, {
				...model,
				api: "openai-responses"
			}), context, responsesOptions);
		}
		return streamOpenAICompletionsRequest(model, context, completionsOptions, "managed");
	};
}
function streamOpenAICompletionsRequest(model, context, options, mode) {
	const { eventStream, stream } = createWritableTransportEventStream();
	(async () => {
		const output = createAssistantOutput(model);
		let discardCandidate = false;
		let firstEventAbort;
		try {
			const requestContext = await resolveProviderContext(context, options);
			const { default: OpenAI } = await import("./openai-jBu3eumF.mjs");
			const { createOpenAIProviderClient } = await import("./openai-provider-client-BsOmrexA.mjs");
			const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
			const cacheRetention = resolveCacheRetention(options?.cacheRetention);
			const policy = mode === "direct" ? {
				mode,
				compat: resolveOpenAICompletionsCompat(model),
				cacheRetention
			} : { mode };
			const { client, sawStreamDONE } = policy.mode === "direct" ? {
				client: (() => {
					const sessionId = cacheRetention === "none" ? void 0 : options?.sessionId;
					const compat = policy.compat;
					if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
					const headers = { ...model.headers };
					if (model.provider === "github-copilot") Object.assign(headers, buildCopilotDynamicHeaders(context.messages));
					if (sessionId && compat.sessionAffinity !== "none") {
						if (compat.sessionAffinity === "openrouter") headers["x-session-id"] = sessionId;
						else {
							headers.session_id = sessionId;
							headers["x-client-request-id"] = sessionId;
							headers["x-session-affinity"] = sessionId;
						}
					}
					return createOpenAIProviderClient(model, apiKey, headers, resolveProviderSimpleCompletionHeaders(model, options), options?.onResponse);
				})(),
				sawStreamDONE: void 0
			} : (() => {
				const turnState = resolveProviderTransportTurnState(model, {
					sessionId: options?.sessionId,
					turnId: randomUUID(),
					attempt: 1,
					transport: "stream"
				});
				const optionHeaders = resolveOpencodeSessionHeaders(model, options);
				const turnHeaders = filterProviderTurnHeadersForExplicitOpencodeSession(model, options, turnState?.headers);
				const doneDetector = createSseDoneDetector();
				const baseFetch = withOpenAIErrorResponseHook(buildGuardedModelFetch(model, void 0, { onSseComment: () => notifyLlmRequestActivity(options?.signal, false) }), options?.onResponse, model);
				const doneDetectingFetch = async (url, init) => {
					const response = await baseFetch(url, init);
					if (!response.body || !response.ok) return response;
					if (typeof TransformStream === "undefined" || !response.body.pipeThrough) return response;
					const transformed = response.body.pipeThrough(new TransformStream({
						transform(chunk, controller) {
							doneDetector.observe(chunk);
							controller.enqueue(chunk);
						},
						flush() {
							doneDetector.finish();
						}
					}));
					return new Response(transformed, response);
				};
				const headers = buildOpenAIClientHeaders(model, context, {
					...turnHeaders,
					...optionHeaders
				}, void 0, resolvePromptCacheKey(options, cacheRetention), cacheRetention);
				const defaultQuery = {};
				let baseURL = model.baseUrl;
				let isAzureHost = false;
				const parsed = URL.parse(model.baseUrl);
				if (parsed) {
					isAzureHost = isAzureOpenAICompatibleHost(parsed.hostname.toLowerCase());
					parsed.searchParams.forEach((value, key) => {
						if (value) defaultQuery[key] = value;
					});
					parsed.search = "";
					baseURL = parsed.toString().replace(/\/$/, "");
				}
				if (isAzureHost) {
					const apiVersionHeader = Object.keys(headers).find((key) => key.toLowerCase() === "api-version");
					if (apiVersionHeader) {
						const apiVersion = headers[apiVersionHeader]?.trim();
						delete headers[apiVersionHeader];
						if (apiVersion && !defaultQuery["api-version"]) defaultQuery["api-version"] = apiVersion;
					}
				}
				const resolvedBaseURL = resolveOpenAIClientBaseUrl(model, baseURL);
				const resolvedDefaultQuery = Object.keys(defaultQuery).length > 0 ? defaultQuery : void 0;
				return {
					client: new OpenAI({
						apiKey,
						baseURL: resolvedBaseURL,
						dangerouslyAllowBrowser: true,
						defaultHeaders: headers,
						defaultQuery: resolvedDefaultQuery,
						fetch: doneDetectingFetch,
						...buildOpenAISdkClientOptions(model)
					}),
					sawStreamDONE: doneDetector.sawDone
				};
			})();
			const builtParams = buildOpenAICompletionsRequest(model, requestContext, options, policy);
			let params = builtParams;
			const encodeBody = prepareModelRequestBody(options);
			const nextParams = await awaitProviderLifecycleCallback(options?.onPayload ? () => options.onPayload?.(params, model) : void 0, options?.signal);
			if (nextParams !== void 0) params = nextParams;
			if (mode === "managed") {
				if (options?.openclawCodeModeToolSurface === true) {
					const visibleToolNames = resolveCodeModeResponsesVisibleToolNames(context);
					enforceCodeModeResponsesToolSurface(params, visibleToolNames, void 0, codeModeToolSurfaceObserver.get(options));
					assertCodeModeResponsesToolSurface(params, visibleToolNames);
				}
				if (getCompat(model).requiresNonEmptyUserOrAssistantMessage) assertOpenAICompletionsPayloadHasConversationTurn(params, model);
			}
			const contextOutputBudget = resolveCompletionsContextOutputBudget(builtParams, params);
			const emitReasoning = shouldEmitOpenAICompletionsReasoning(model, options, mode);
			firstEventAbort = createFirstStreamEventAbortController(options?.signal);
			const requestOptions = mode === "direct" ? {
				...await encodeBody(params),
				signal: firstEventAbort.signal,
				...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
				maxRetries: 0
			} : {
				...buildOpenAISdkRequestOptions(model, firstEventAbort.signal, { timeoutMs: options?.timeoutMs }),
				...await encodeBody(params)
			};
			const request = client.chat.completions.create(params, requestOptions);
			const response = await request.asResponse();
			const hookedResponseStream = withProviderResponseHook({
				stream: { async *[Symbol.asyncIterator]() {
					if (!params.stream) {
						yield await boundResponseBody(response, {
							maxBytes: 16777216,
							onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Chat Completions JSON response exceeds ${maxBytes} bytes`)
						}).json();
						return;
					}
					const data = await request;
					if (Symbol.asyncIterator in data) yield* data;
					else yield data;
				} },
				signal: firstEventAbort.signal,
				abort: firstEventAbort.abort,
				hook: createOpenAIProviderAcceptanceHook(options, response, model),
				onReady: () => {
					if (contextOutputBudget === void 0) stream.push({
						type: "start",
						partial: output
					});
				}
			});
			const providerStream = observeOpenAICompletionsProgress(withFirstStreamEventTimeout(hookedResponseStream, {
				provider: model.provider,
				api: model.api,
				model: model.id,
				timeoutMs: getFirstStreamEventTimeoutMs(options) ?? 0,
				stage: "completions",
				abort: firstEventAbort.abort,
				onTimeout: getFirstStreamEventTimeoutHandler(options),
				hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
			}), options?.signal);
			const buffered = contextOutputBudget === void 0 ? void 0 : await (async () => {
				const iterator = providerStream[Symbol.asyncIterator]();
				const chunks = [];
				let bufferedBytes = 0;
				let overflow;
				let finished = false;
				let failed = false;
				let sourceError;
				let finishReason;
				try {
					for (;;) {
						const next = await iterator.next();
						if (next.done) {
							finished = true;
							break;
						}
						const chunk = next.value;
						const chunkBytes = Buffer.byteLength(JSON.stringify(chunk) ?? "", "utf8");
						if (chunks.length >= MAX_CONTEXT_BUDGET_BUFFER_CHUNKS || bufferedBytes + chunkBytes > MAX_CONTEXT_BUDGET_BUFFER_BYTES) {
							overflow = next;
							break;
						}
						chunks.push(chunk);
						bufferedBytes += chunkBytes;
						const chunkFinishReason = chunk?.choices?.[0]?.finish_reason;
						if (chunkFinishReason) finishReason = mapOpenAIStopReason(chunkFinishReason).stopReason;
						options?.signal?.throwIfAborted();
					}
				} catch (error) {
					failed = true;
					sourceError = error;
					iterator.return?.(void 0).catch(() => void 0);
				}
				return {
					bounded: overflow === void 0,
					failed,
					finishReason,
					stream: { async *[Symbol.asyncIterator]() {
						try {
							yield* chunks;
							if (failed) throw sourceError;
							if (overflow !== void 0) {
								yield overflow.value;
								for (;;) {
									const next = await iterator.next();
									if (next.done) {
										finished = true;
										return;
									}
									yield next.value;
								}
							}
						} finally {
							chunks.length = 0;
							if (!finished && !failed) iterator.return?.(void 0).catch(() => void 0);
						}
					} }
				};
			})();
			discardCandidate = Boolean(buffered?.bounded && (buffered.failed || buffered.finishReason === "length"));
			if (buffered && !discardCandidate) stream.push({
				type: "start",
				partial: output
			});
			const directEvents = mode === "direct" ? createDirectCompletionsEventStream(output, stream) : void 0;
			try {
				await processCompletionsStream(buffered?.stream ?? providerStream, output, model, discardCandidate ? { push() {} } : directEvents?.stream ?? stream, {
					...directEvents ? {
						mode: "direct",
						beforeContentBlock: directEvents.beforeContentBlock
					} : { mode: "managed" },
					signal: discardCandidate ? void 0 : options?.signal,
					emitReasoning,
					strictReasoningTags: reasoningTagTextPolicy.isStrict(options),
					sawStreamDONE
				});
				if (discardCandidate) throw new Error(`Context length exceeded: automatic output budget of ${contextOutputBudget} tokens exhausted before completion.`);
				if (directEvents) {
					if (options?.signal?.aborted) throw transportAbortError(options.signal);
					if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage || (output.stopReason === "aborted" ? "Request was aborted" : "Provider returned an invalid tool call"));
				}
			} catch (error) {
				directEvents?.finish(false);
				throw error;
			}
			directEvents?.finish(output.stopReason === "toolUse");
			finalizeTransportStream({
				stream,
				output,
				signal: options?.signal
			});
		} catch (error) {
			if (discardCandidate) output.content = [];
			failTransportStream({
				stream,
				output,
				signal: options?.signal,
				error,
				cleanup: () => {
					finalizeOpenAICompletionsToolCalls(output, { allowSilentToolCallPromotion: false });
				}
			});
		} finally {
			firstEventAbort?.dispose();
		}
	})();
	return eventStream;
}
export { createResponsesSteering as a, buildOpenAICompletionsParams as c, stripCompletionMessagesToRoleContent as d, applyCompletionsAnthropicCacheControl as f, createDeepSeekTextFilter as g, resolveMaxTokensParam as h, createOpenAIResponsesTransportStreamFn as i, convertMessages as l, canonicalizeMaxTokensParam as m, streamOpenAICompletionsRequest as n, omitAcceptedSteering as o, hasOpenAICompatibleConversationTurn as p, createAzureOpenAIResponsesTransportStreamFn as r, hasResponsesWebSearchTool as s, createOpenAICompletionsTransportStreamFn as t, flattenCompletionMessagesToStringContent as u };
