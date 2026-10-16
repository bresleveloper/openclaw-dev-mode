import { _ as runtimeContextContentToText, f as hasRuntimeContextMarker, p as isRuntimeContextMessage } from "./types-CQc6JNG4.mjs";
import { r as appendAssistantThinking } from "./event-stream-C5AbCAaZ.mjs";
import { o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { s as readNonEmptyStringPreservingWhitespace, t as hasNonEmptyString } from "./string-coerce-CtgOVOSv.mjs";
import { n as asNonNegativeFiniteNumber } from "./number-coercion-V8-BhME4.mjs";
import { N as isImageWithMediaPayload, a as resolveAiTransportHeaderSentinels, r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { A as resolveOpenAIThinkingApi, D as supportsOpenAITemperature, _ as isOpenAIGpt54MiniModel, b as isOpenAIGpt6Model, d as OpenAIResponsesWebSocketSafeRetryError, g as responsesServiceTierObserver, l as OpenAIResponsesWebSocketPostDispatchError, m as parseOpenAIResponsesWebSocketServerError, r as OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS, t as AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS, u as OpenAIResponsesWebSocketPreDispatchError, v as isOpenAIGpt55Model, y as isOpenAIGpt56Model } from "./openai-responses-contracts-BKu8O7l4.mjs";
import { r as uniqueStrings } from "./string-normalization-PN10hf6d.mjs";
import { n as getSessionResourceOwnerId, r as registerSessionResourceCleanup } from "./session-resources-D1wgDQ8C.mjs";
import { o as truncateUtf16Safe, s as stableStringify } from "./provider-error-DQBE1bUQ.mjs";
import { r as resolveOpenAIPromptCacheParams } from "./openai-prompt-cache-BK6E2g4Q.mjs";
import { r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl, u as hasOnlyResponsesFunctionTools } from "./diagnostics-Caj-4RBA.mjs";
import { d as supportsModelTools, i as providerReplayContextMatches, n as buildProviderReplayContext, o as estimateStringChars, r as isProviderReplayContext } from "./text-signature-CbqxIB8B.mjs";
import { c as resolveOpenAIResponsesTextFormat, i as resolveOpenAICompletionsCompat, l as shouldOmitOllamaCompatResponseFormat, n as isNativeOpenAIEndpoint, o as usesNativeOpenAICodexResponsesBackend, r as isOpenAICodexResponsesModel, s as resolveOpenAICompletionsResponseFormat, t as detectOpenAICompletionsCompat } from "./openai-completions-compat-GMN8A0fm.mjs";
import { i as resolveProviderEndpoint, t as buildGuardedModelFetch } from "./host-policy-BwhNNGQR.mjs";
import { i as resolveCacheRetention, r as buildCopilotDynamicHeaders } from "./cloudflare-5qSGvIUH.mjs";
import { E as createToolArgumentPreviewSchedule, M as racePromiseWithAbortSignal, O as parseStreamingJson, P as sanitizeSurrogates, S as withProviderResponseHook, _ as sanitizeNonEmptyTransportPayloadText, b as transportAbortError, c as failTransportStream, d as iterateModelStream, h as notifyProviderStreamOpened, l as finalizeTerminalToolCallArguments, s as createWritableTransportEventStream, u as finalizeTransportStream, v as sanitizeTransportPayloadText, y as throwIfModelStreamAborted } from "./transport-stream-shared-CCR7hSW0.mjs";
import { C as stripSystemPromptCacheBoundary, D as sortPromptCacheToolsByName, S as splitSystemPromptRelocatableBoundary, d as describeToolResultMediaPlaceholder, l as codeModeToolSurfaceObserver, m as extractToolResultText, s as prepareModelRequestBody, u as reasoningTagTextPolicy, w as stripSystemPromptRelocatableBoundary, x as splitSystemPromptCacheBoundary } from "./simple-options-7QuSKriJ.mjs";
import { $ as supportsResponsesReasoningUpdate, A as recordResponsesContextUsage, At as parseOpenAICompletionsUsage, B as claimOpenAIResponsesHttpContinuation, C as resolveAzureOpenAIApiVersion, Ct as GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, D as safeDebugValue, Dt as isOpenAICompletionsThinkingEnabled, E as logResponsesFailedNoDetails, Et as createResponseModelTracker, F as convertResponsesMessages, Ft as redactIdentifier, H as resolveResponsesContinuationRequest, It as sha256Hex, L as readResponsesInputReplayState, Mt as readOpenAICompletionsReasoningBatch, N as buildResponsesInputMessage, Nt as resolveOpenAIClientBaseUrl, O as summarizeOpenAITransportError, Ot as log, Pt as resolvePromptCacheKey, Q as replayResponsesReasoningUpdates, R as recordResponsesInputReplay, S as isInvalidEncryptedContentError, St as toOpenAIResponsesToolChoice, T as ResponsesStreamFailure, U as responsesContinuationPrefixFingerprint, V as recordResponsesContinuationState, W as responsesContinuationRequestFingerprint, Z as isConfigurationUpdate, a as prepareResponsesTools, at as assertCodeModeResponsesToolSurface, bt as reconcileOpenAICompletionsToolChoice, c as observeResponsesStream, ct as buildOpenAISdkRequestOptions, dt as getCompat, gt as resolveOpenAISimpleReasoningEffort, ht as resolveOpenAIRequestReasoning, it as suppressOpenAIResponsesCompaction, jt as readOpenAICompletionsContentDeltas, k as summarizeResponsesPayload, kt as measureUtf8AppendBytes, lt as enforceCodeModeResponsesToolSurface, mt as resolveOpenAIStrictToolFlagWithDiagnostics, n as applyResponsesServiceTierPricing, ot as buildOpenAIClientHeaders, pt as resolveCodeModeResponsesVisibleToolNames, s as processResponsesStream, st as buildOpenAISdkClientOptions, tt as buildOpenAIResponsesReasoningReplayMetadata, vt as prepareOpenAITools, w as resolveNextResponsesEncryptedContentAttempt, wt as createOpenAIProviderAcceptanceHook, x as createResponsesStreamWithEncryptedContentRetry, xt as reconcileOpenAIResponsesToolChoice, yt as projectOpenAITools, z as responsesInputFingerprint } from "./openai-responses-shared-BMx2NAS-.mjs";
import { n as getEnvApiKey } from "./env-api-keys-CyX4VKGO.mjs";
import { n as transformProviderMessages, t as createAssistantOutput } from "./assistant-output-D5762GPH.mjs";
import { a as tagUnresolvedTextAsCommentary, i as tagPendingCommentaryText, n as rememberPendingCommentaryTags, r as tagInterruptedTextPhases, t as clearPendingCommentaryText } from "./assistant-text-phase-DzvV7Oso.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-D8f_oxHj.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import "./types.mjs";
import { i as createOpenAIProviderClient, n as resolveProviderSimpleCompletionHeaders, r as resolveProviderTransportTurnState, t as filterProviderTurnHeadersForExplicitOpencodeSession } from "./provider-transport-turn-state-1T3vwTvn.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-D9ZmL_s9.mjs";
import { f as withPreparedToolSchemaNormalization, r as normalizeOpenAIStrictToolParameters } from "./openai-tool-schema-BIrI0mrA.mjs";
import { isGoogleGemini3ThinkingLevelModel } from "./internal/google-model-family.mjs";
import { t as mapOpenAIStopReason } from "./openai-stop-reason-8s70vDXj.mjs";
import { t as createReasoningTagTextPartitioner } from "./reasoning-tag-text-partitioner-Ju9VpUGl.mjs";
import { i as resolveAzureDeploymentNameFromMap, t as isOpenAICompatibleAzureResponsesBaseUrl } from "./azure-openai-responses-client-compat-D0dvJMbZ.mjs";
import { a as applyOpenAIResponsesPayloadPolicy, i as sanitizeResponsesImagePayload, n as isOpenAIResponsesCompactionOutput, s as resolveOpenAIResponsesPayloadPolicy, t as createBoundedOpenAIResponsesCompactionFetch } from "./openai-responses-compaction-window-tA4QkU0o.mjs";
import { n as supportsNativeOpenAIResponsesEndpoint, t as isOfficialOpenAIResponsesBaseUrl } from "./openai-responses-endpoint-TV0y50fb.mjs";
import { n as withResponsesRequestAcceptance, r as createResponsesPromptEgressObserver, t as responsesRequestLifecycle } from "./openai-responses-request-lifecycle-Dskvtz_Z.mjs";
import { randomUUID } from "node:crypto";
import OpenAI, { AzureOpenAI } from "openai";
import { ResponsesWS } from "openai/resources/responses/ws.js";
//#region packages/ai/src/transports/deepseek-dsml-grammar.ts
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
//#endregion
//#region packages/ai/src/transports/deepseek-text-filter.ts
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
//#endregion
//#region packages/ai/src/transports/model-max-tokens-params.ts
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
//#endregion
//#region packages/ai/src/transports/openai-compatible-conversation-turn.ts
function hasNonEmptyContentPart(part) {
	if (!part || typeof part !== "object") return false;
	const record = part;
	if (record.type === "text") return hasNonEmptyString(record.text);
	return true;
}
function hasNonEmptyMessageContent(content) {
	if (hasNonEmptyString(content)) return true;
	if (!Array.isArray(content)) return false;
	return content.some(hasNonEmptyContentPart);
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
//#endregion
//#region packages/ai/src/transports/openai-completions-cache-control.ts
const shapedPayloads = /* @__PURE__ */ new WeakSet();
function resolveCompletionsCacheControl(compat, retention, openRouterRoute) {
	if (compat.cacheControlFormat !== "anthropic" || retention === "none") return;
	return {
		type: "ephemeral",
		...retention === "long" && compat.supportsLongCacheRetention && (openRouterRoute || compat.configuredSupportsLongCacheRetention === true) ? { ttl: "1h" } : {}
	};
}
/** Shared Chat Completions policy; repeated wrapper application preserves existing checkpoints. */
function applyCompletionsAnthropicCacheControl(payload, cacheControl = { type: "ephemeral" }, cacheOptOutIndexes = /* @__PURE__ */ new Set(), markTools = true, markMessages = true) {
	if (shapedPayloads.has(payload)) return;
	shapedPayloads.add(payload);
	const messages = Array.isArray(payload.messages) ? payload.messages : [];
	const tools = Array.isArray(payload.tools) ? payload.tools.filter(isRecord) : [];
	const blocks = messages.filter(isRecord).flatMap((message) => Array.isArray(message.content) ? message.content.filter(isRecord) : []);
	for (const block of [...tools, ...blocks]) delete block.cache_control;
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
			const split = splitBoundary ? splitSystemPromptCacheBoundary(block.text) : void 0;
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
	const lastTool = tools.at(-1);
	if (markTools && lastTool) lastTool.cache_control = cacheControl;
	if (!markMessages) return;
	const system = messages.find((message) => isRecord(message) && (message.role === "system" || message.role === "developer"));
	if (isRecord(system)) markText(system, true);
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (!cacheOptOutIndexes.has(i) && isRecord(message) && (message.role === "user" || message.role === "tool") && markText(message, false)) return;
	}
}
//#endregion
//#region packages/ai/src/transports/openai-completions-string-content.ts
/**
* OpenAI Chat Completions compatibility helpers. Some providers only accept
* role/content messages with plain string content instead of text block arrays.
*/
function flattenStringOnlyCompletionContent(content) {
	if (!Array.isArray(content)) return content;
	const textParts = [];
	for (const item of content) {
		if (!item || typeof item !== "object" || item.type !== "text" || typeof item.text !== "string") return content;
		textParts.push(item.text);
	}
	return textParts.join("\n");
}
/** Flatten string-only text block content arrays into newline-joined strings. */
function flattenCompletionMessagesToStringContent(messages) {
	return messages.map((message) => {
		if (!message || typeof message !== "object") return message;
		const content = message.content;
		const flattenedContent = flattenStringOnlyCompletionContent(content);
		if (flattenedContent === content) return message;
		return {
			...message,
			content: flattenedContent
		};
	});
}
/** Strip completion messages to role/content fields for strict providers. */
function stripCompletionMessagesToRoleContent(messages) {
	return messages.map((message) => {
		if (!message || typeof message !== "object" || Array.isArray(message)) return message;
		const record = message;
		const stripped = {};
		if (Object.hasOwn(record, "role")) stripped.role = record.role;
		if (Object.hasOwn(record, "content")) stripped.content = record.content;
		return stripped;
	});
}
//#endregion
//#region packages/ai/src/providers/openai-completions-tool-calls.ts
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
	const bufferFollowingDelta = (delta) => {
		const nextDeltaBytes = Buffer.byteLength(JSON.stringify(delta), "utf8");
		if (pendingFollowingDeltaBytes + nextDeltaBytes > MAX_BUFFERED_LEGACY_FOLLOWING_DELTA_BYTES || pendingFollowingDeltas.length >= MAX_BUFFERED_LEGACY_FOLLOWING_DELTAS) throw new Error("Exceeded legacy tool-call content buffer limit");
		pendingFollowingDeltaBytes += nextDeltaBytes;
		pendingFollowingDeltas.push(delta);
	};
	const hasObservableContent = (value) => {
		if (typeof value === "string") return value.length > 0;
		if (Array.isArray(value)) return value.some(hasObservableContent);
		if (isRecord(value)) return Object.entries(value).some(([field, nestedValue]) => field !== "type" && field !== "id" && field !== "index" && hasObservableContent(nestedValue));
		return false;
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
		if (Object.entries(ordinaryDelta).some(([field, value]) => field !== "role" && hasObservableContent(value))) {
			if (hadPendingLegacyCall) bufferFollowingDelta(ordinaryDelta);
			else leadingDeltas.push({
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
	if (output.stopReason === "stop" && hasToolCalls && options.allowSilentToolCallPromotion !== false && !output.content.some((block) => {
		const candidate = block;
		return candidate.type === "text" && typeof candidate.text === "string" && candidate.text.trim().length > 0;
	})) output.stopReason = "toolUse";
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
	if (toolCalls.some((call) => typeof call.name !== "string" || call.name.trim().length === 0 || typeof call.partialArgs !== "string" || call.partialArgs.trim().length === 0)) {
		rejectToolCalls();
		return;
	}
	try {
		finalizeTerminalToolCallArguments(toolCalls, (call) => call.partialArgs);
	} catch {
		rejectToolCalls();
		return;
	}
	for (let contentIndex = 0; contentIndex < output.content.length; contentIndex += 1) {
		const block = output.content[contentIndex];
		if (!block || !isToolCall(block)) continue;
		delete block.partialArgs;
		delete block.streamIndex;
		options.onConfirmedToolCall?.(block, contentIndex);
	}
}
//#endregion
//#region packages/ai/src/transports/openai-completions-host.ts
/**
* Chat Completions accepts Azure AI Foundry hosts in addition to traditional
* Azure OpenAI hosts. Do not replace this with isTraditionalAzureOpenAIHost,
* which intentionally excludes the .services.ai.azure.com Foundry suffix.
*/
function isAzureOpenAICompatibleHost(hostname) {
	return hostname.endsWith(".openai.azure.com") || hostname.endsWith(".services.ai.azure.com") || hostname.endsWith(".cognitiveservices.azure.com");
}
//#endregion
//#region packages/ai/src/openai-completions-messages.ts
/** Whether replayed messages require a tools marker for proxy compatibility. */
function hasToolCallHistory(messages) {
	return messages.some((message) => message.role === "toolResult" || message.role === "assistant" && Array.isArray(message.content) && message.content.some((block) => block.type === "toolCall"));
}
/** Convert a normalized transcript to OpenAI Chat Completions messages. */
function convertMessages(model, context, compat, options = {}) {
	const params = [];
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
		if (options.preserveSystemPromptCacheBoundary) systemPrompt = stripSystemPromptRelocatableBoundary(context.systemPrompt);
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
				else if (block.type === "toolCall") toolCalls.push(block);
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
					}
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
			let j = i;
			while (j < transformedMessages.length) {
				const toolMsg = transformedMessages.at(j);
				if (toolMsg?.role !== "toolResult") break;
				const textResult = extractToolResultText(toolMsg.content);
				const mediaPlaceholder = describeToolResultMediaPlaceholder(toolMsg.content);
				const images = toolMsg.content.filter(isImageWithMediaPayload);
				const toolResultMsg = {
					role: "tool",
					content: sanitizeNonEmptyTransportPayloadText(textResult, mediaPlaceholder),
					tool_call_id: toolMsg.toolCallId
				};
				if (compat.requiresToolResultName && toolMsg.toolName) toolResultMsg.name = toolMsg.toolName;
				params.push(toolResultMsg);
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
			if (imageContentParts.length > 0) {
				if (compat.requiresAssistantAfterToolResult) params.push({
					role: "assistant",
					content: "I have processed the tool results."
				});
				params.push({
					role: "user",
					content: imageContentParts
				});
				lastRole = "user";
			} else lastRole = "toolResult";
			continue;
		}
		lastRole = msg.role;
	}
	if (relocatableSplit !== void 0 && systemParamIndex !== void 0) relocateNonBehavioralRegion({
		params,
		systemParamIndex,
		split: relocatableSplit,
		cacheOptOutIndexes: options.cacheOptOutIndexes
	});
	return params;
}
/** Commit relocation only after finding an emitted carrier. */
function relocateNonBehavioralRegion(args) {
	const text = sanitizeSurrogates(stripSystemPromptCacheBoundary(args.split.relocatable));
	for (let index = args.systemParamIndex + 1; index < args.params.length; index++) {
		const param = args.params[index];
		if (!param || param.role !== "user") continue;
		if (typeof param.content === "string") param.content = `${param.content}\n\n${text}`;
		else if (Array.isArray(param.content)) param.content = [...param.content, {
			type: "text",
			text
		}];
		else continue;
		const systemParam = args.params[args.systemParamIndex];
		if (systemParam) systemParam.content = sanitizeSurrogates(stripSystemPromptCacheBoundary(args.split.remainingPrompt));
		args.cacheOptOutIndexes?.add(index);
		return;
	}
}
//#endregion
//#region packages/ai/src/transports/openai-completions-direct-policy.ts
function applyDirectCompletionsReasoningAndRouting(params, model, reasoning, compat) {
	const nativeEffort = compat.thinkingFormat === "openrouter" ? void 0 : reasoning.effort;
	const reasoningEnabled = reasoning.thinkingEnabled ?? false;
	if (compat.thinkingFormat === "zai" && model.reasoning) params.thinking = reasoningEnabled ? {
		type: "enabled",
		clear_thinking: false
	} : { type: "disabled" };
	else if (compat.thinkingFormat === "qwen" && model.reasoning) params.enable_thinking = reasoningEnabled;
	else if (compat.thinkingFormat === "qwen-chat-template" && model.reasoning) params.chat_template_kwargs = {
		enable_thinking: reasoningEnabled,
		preserve_thinking: true
	};
	else if ((compat.thinkingFormat === "deepseek" || compat.thinkingFormat === "together") && model.reasoning) {
		if (compat.thinkingFormat === "deepseek") params.thinking = { type: reasoningEnabled ? "enabled" : "disabled" };
		else params.reasoning = { enabled: reasoningEnabled };
		if (reasoningEnabled && compat.supportsReasoningEffort && nativeEffort !== void 0) params.reasoning_effort = nativeEffort;
	} else if (model.reasoning && compat.supportsReasoningEffort && nativeEffort !== void 0) params.reasoning_effort = nativeEffort;
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
//#endregion
//#region packages/ai/src/transports/openai-completions-replay.ts
function isGoogleOpenAICompatModel(model) {
	const endpointClass = detectOpenAICompletionsCompat(model).capabilities.endpointClass;
	return model.provider === "google" || endpointClass === "google-generative-ai" || endpointClass === "google-vertex";
}
const GOOGLE_COMPAT_THOUGHT_SIGNATURE_ELLIPSIS_RE = /[\u2026]|\.\.\./;
const GOOGLE_COMPAT_THOUGHT_SIGNATURE_BASE64_RE = /^[A-Za-z0-9+/=]+$/;
function hasGoogleCompatThoughtSignatureTruncationFootprint(value) {
	return GOOGLE_COMPAT_THOUGHT_SIGNATURE_ELLIPSIS_RE.test(value) || GOOGLE_COMPAT_THOUGHT_SIGNATURE_BASE64_RE.test(value) && value.length % 4 !== 0;
}
function injectToolCallThoughtSignatures(outgoingMessages, context, model) {
	if (!isGoogleOpenAICompatModel(model)) return;
	const sigById = /* @__PURE__ */ new Map();
	const fallbackSig = isGoogleGemini3ThinkingLevelModel(model.id) ? GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP : void 0;
	for (const msg of context.messages ?? []) {
		if (msg.role !== "assistant") continue;
		if (!Array.isArray(msg.content)) continue;
		for (const block of msg.content) {
			if (block.type !== "toolCall") continue;
			const id = block.id;
			const sig = block.thoughtSignature;
			if (typeof id === "string" && typeof sig === "string" && sig.length > 0) {
				const isSameRoute = msg.api === model.api && msg.provider === model.provider && msg.model === model.id;
				if (!isSameRoute && !fallbackSig) continue;
				sigById.set(id, isSameRoute ? sig : fallbackSig ?? sig);
			}
		}
	}
	if (sigById.size === 0 && !fallbackSig) return;
	for (const message of outgoingMessages) {
		const toolCalls = message.tool_calls;
		if (!Array.isArray(toolCalls)) continue;
		for (const toolCall of toolCalls) {
			const id = toolCall.id;
			if (typeof id !== "string") continue;
			let sig = sigById.get(id) ?? fallbackSig;
			if (typeof sig === "string" && sig.length > 0) {
				if (hasGoogleCompatThoughtSignatureTruncationFootprint(sig.trim())) sig = fallbackSig;
			}
			if (typeof sig !== "string" || sig.length === 0) continue;
			const extra = toolCall.extra_content && typeof toolCall.extra_content === "object" ? toolCall.extra_content : {};
			toolCall.extra_content = extra;
			const google = extra.google && typeof extra.google === "object" ? extra.google : {};
			extra.google = google;
			google.thought_signature = sig;
		}
	}
}
const COMPLETIONS_REASONING_REPLAY_FIELDS = [
	"reasoning_details",
	"reasoning_content",
	"reasoning",
	"reasoning_text"
];
function stripCompletionsReasoningReplayFields(record) {
	for (const field of COMPLETIONS_REASONING_REPLAY_FIELDS) delete record[field];
}
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
function sanitizeReasoningContentReplayFields(record) {
	if ("reasoning_content" in record && typeof record.reasoning_content !== "string") delete record.reasoning_content;
	delete record.reasoning_details;
	delete record.reasoning;
	delete record.reasoning_text;
}
const REASONING_CONTENT_REPLAY_MODEL_IDS = /* @__PURE__ */ new Set([
	"deepseek-v4-flash",
	"deepseek-v4-pro",
	"kimi-for-coding",
	"kimi-k2.5",
	"kimi-k2.6",
	"kimi-k2.7-code",
	"kimi-k2.7-code-highspeed",
	"kimi-k3",
	"kimi-k2-thinking",
	"kimi-k2-thinking-turbo",
	"mimo-v2-pro",
	"mimo-v2-omni",
	"mimo-v2.5",
	"mimo-v2.5-pro",
	"mimo-v2.6-flash",
	"mimo-v2.6-pro",
	"mimo-v2.6-pro-ultraspeed"
]);
const REASONING_CONTENT_REPLAY_TIER_SUFFIXES = [
	"-free",
	"-paid",
	"-trial"
];
function stripReasoningContentReplayTierSuffix(modelId) {
	for (const suffix of REASONING_CONTENT_REPLAY_TIER_SUFFIXES) if (modelId.length > suffix.length && modelId.endsWith(suffix)) return modelId.slice(0, -suffix.length);
	return modelId;
}
function getReasoningContentReplayModelIdCandidates(modelId) {
	if (typeof modelId !== "string") return [];
	const normalized = modelId.trim().toLowerCase();
	if (!normalized) return [];
	const parts = normalized.split("/").filter(Boolean);
	const finalPart = parts[parts.length - 1] ?? normalized;
	const candidates = [finalPart];
	const colonParts = finalPart.split(":").filter(Boolean);
	if (colonParts.length > 1) candidates.push(colonParts[0] ?? "", colonParts[colonParts.length - 1] ?? "");
	for (const candidate of candidates.slice()) {
		const stripped = stripReasoningContentReplayTierSuffix(candidate);
		if (stripped !== candidate) candidates.push(stripped);
	}
	return uniqueStrings(candidates.filter(Boolean));
}
function shouldPreserveReasoningContentReplay(model, compat) {
	if (compat.requiresReasoningContentOnAssistantMessages || compat.thinkingFormat === "deepseek" || compat.thinkingFormat === "zai" || shouldTrustReasoningContentReplayMetadata(model)) return true;
	return getReasoningContentReplayModelIdCandidates(model.id).some((modelId) => REASONING_CONTENT_REPLAY_MODEL_IDS.has(modelId));
}
function shouldPreserveOpenRouterReasoningReplay(model) {
	if (model.provider !== "openrouter") return true;
	const normalizedModelId = model.id.trim().toLowerCase();
	return !(normalizedModelId.startsWith("anthropic/") || normalizedModelId.startsWith("x-ai/"));
}
function shouldTrustReasoningContentReplayMetadata(model) {
	if (!model.reasoning) return false;
	if (model.provider.trim().toLowerCase() === "openai") return false;
	return shouldPreserveOpenRouterReasoningReplay(model);
}
function sanitizeCompletionsReasoningReplayFields(messages, options) {
	if (!Array.isArray(messages)) return;
	for (const msg of messages) {
		if (!msg || typeof msg !== "object") continue;
		const record = msg;
		if (record.role !== "assistant") continue;
		if (options.preserveOpenRouterReasoning) sanitizeOpenRouterReasoningReplayFields(record);
		else if (options.preserveReasoningContent) sanitizeReasoningContentReplayFields(record);
		else stripCompletionsReasoningReplayFields(record);
	}
}
function applyCompletionsReplay(outgoingMessages, context, model, compat) {
	injectToolCallThoughtSignatures(outgoingMessages, context, model);
	sanitizeCompletionsReasoningReplayFields(outgoingMessages, {
		preserveOpenRouterReasoning: compat.thinkingFormat === "openrouter" && shouldPreserveOpenRouterReasoningReplay(model),
		preserveReasoningContent: shouldPreserveReasoningContentReplay(model, compat)
	});
}
//#endregion
//#region packages/ai/src/transports/openai-completions-params.ts
function isKnownOpenAICompletionsEndpoint(model) {
	if (!model.baseUrl.trim() || isNativeOpenAIEndpoint(model)) return true;
	const endpointClass = resolveProviderEndpoint(model).endpointClass;
	if (endpointClass === "openai-public" || endpointClass === "azure-openai") return true;
	const endpoint = URL.parse(model.baseUrl);
	return endpoint !== null && isAzureOpenAICompatibleHost(endpoint.hostname.toLowerCase());
}
function resolveOpenAICompletionsMaxTokens(model, options) {
	if (options?.maxTokens) return {
		maxTokens: options.maxTokens,
		clampToModelMaxTokens: true
	};
	const paramsMaxTokens = resolveMaxTokensParam(model.params);
	if (paramsMaxTokens) return {
		maxTokens: paramsMaxTokens,
		clampToModelMaxTokens: false
	};
	return {
		maxTokens: model.maxTokens,
		clampToModelMaxTokens: false
	};
}
function resolveOpenAICompletionsModelMaxTokens(model) {
	return typeof model.maxTokens === "number" && Number.isFinite(model.maxTokens) && model.maxTokens > 0 ? Math.floor(model.maxTokens) : void 0;
}
const OPENAI_COMPLETIONS_INPUT_TOKEN_SAFETY_MARGIN = 1.25;
const OPENAI_COMPLETIONS_IMAGE_CHAR_ESTIMATE = 8e3;
const MIN_USEFUL_OUTPUT_TOKENS = 16;
function estimateJsonChars(value, fallback) {
	try {
		return estimateStringChars(JSON.stringify(value));
	} catch {
		return fallback;
	}
}
function estimateOpenAICompletionsInputTokens(payload) {
	let adjustedChars = 0;
	adjustedChars += estimateOpenAICompletionsMessagesChars(payload.messages);
	if (Array.isArray(payload.tools) && payload.tools.length > 0) adjustedChars += estimateJsonChars(payload.tools, 1024);
	if (payload.response_format !== void 0) adjustedChars += estimateJsonChars(payload.response_format, 256);
	return Math.ceil(adjustedChars / 4 * OPENAI_COMPLETIONS_INPUT_TOKEN_SAFETY_MARGIN);
}
function estimateOpenAICompletionsMessagesChars(messages) {
	if (!Array.isArray(messages)) return 0;
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
		const text = record.text;
		if (typeof text === "string") {
			adjustedChars += estimateStringChars(text);
			continue;
		}
		adjustedChars += estimateJsonChars(block, 256);
	}
	return adjustedChars;
}
function resolveOpenAICompletionsEffectiveContextTokens(model) {
	const contextTokens = model.contextTokens;
	if (typeof contextTokens === "number" && Number.isFinite(contextTokens) && contextTokens > 0) return contextTokens;
	return typeof model.contextWindow === "number" && Number.isFinite(model.contextWindow) && model.contextWindow > 0 ? model.contextWindow : void 0;
}
function setQwenChatTemplateThinking(params, enabled) {
	const existing = params.chat_template_kwargs;
	params.chat_template_kwargs = existing && typeof existing === "object" && !Array.isArray(existing) ? {
		...existing,
		enable_thinking: enabled
	} : { enable_thinking: enabled };
}
/** Return whether the binary control replaces scalar reasoning effort. */
function applyBinaryCompletionsThinkingParams(params) {
	if (!params.modelReasoning) return false;
	const enabled = params.thinkingEnabled;
	switch (params.compatThinkingFormat) {
		case "qwen-chat-template":
			setQwenChatTemplateThinking(params.payload, enabled);
			return true;
		case "qwen":
			params.payload.enable_thinking = enabled;
			return true;
		case "together":
			params.payload.reasoning = { enabled };
			return !enabled;
		default: return false;
	}
}
function convertTools(tools, compat, model, mode) {
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
				const functionTool = {
					name: tool.name,
					description: tool.description,
					parameters: mode === "direct" ? tool.parameters : normalizeOpenAIStrictToolParameters(tool.parameters, strict === true, model.compat)
				};
				if (strict !== void 0) functionTool.strict = strict;
				return {
					type: "function",
					function: functionTool
				};
			})
		};
	};
	return prepared ? withPreparedToolSchemaNormalization(prepared.schemas, convert) : convert();
}
function buildOpenAICompletionsParams(model, context, options) {
	return buildOpenAICompletionsRequest(model, context, options, { mode: "managed" });
}
function buildOpenAICompletionsRequest(model, context, options, policy) {
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
	let messages = convertMessages(model, context, compat, {
		cacheOptOutIndexes,
		preserveSystemPromptCacheBoundary: cacheControl !== void 0 && !managedCompat?.requiresStringContent
	});
	if (managedCompat) {
		applyCompletionsReplay(messages, context, model, managedCompat);
		if (managedCompat.strictMessageKeys) messages = stripCompletionMessagesToRoleContent(messages);
		if (managedCompat.requiresStringContent) messages = flattenCompletionMessagesToStringContent(messages);
	}
	const promptCacheKey = resolvePromptCacheKey(options, cacheRetention);
	const params = {
		model: model.id,
		messages,
		stream: true,
		...resolveOpenAIPromptCacheParams(model, cacheRetention, compat)
	};
	if (compat.supportsUsageInStreaming) params.stream_options = { include_usage: true };
	if (compat.supportsStore) params.store = false;
	if (policy.mode === "direct" || compat.supportsPromptCacheKey && promptCacheKey) params.prompt_cache_key = compat.supportsPromptCacheKey ? promptCacheKey : void 0;
	if (options?.temperature !== void 0) params.temperature = options.temperature;
	if (policy.mode === "managed" && options?.topP !== void 0) params.top_p = options.topP;
	const requestedResponseFormat = options?.responseFormat;
	const responseFormat = policy.mode === "direct" && requestedResponseFormat === void 0 ? void 0 : resolveOpenAICompletionsResponseFormat(shouldOmitOllamaCompatResponseFormat({
		provider: model.provider,
		baseUrl: model.baseUrl,
		hasTools: () => Boolean(context.tools?.length)
	}) ? void 0 : requestedResponseFormat, compat.supportsJsonSchemaResponseFormat);
	if (responseFormat !== void 0) params.response_format = responseFormat;
	if (policy.mode === "managed" && options?.frequencyPenalty !== void 0) params.frequency_penalty = options.frequencyPenalty;
	if (policy.mode === "managed" && options?.presencePenalty !== void 0) params.presence_penalty = options.presencePenalty;
	if (policy.mode === "managed" && options?.seed !== void 0) params.seed = options.seed;
	if (options?.stop !== void 0 && options.stop.length > 0) params.stop = options.stop;
	let directToolProjection;
	if (policy.mode === "direct" || supportsModelTools(model)) {
		if (context.tools) {
			const converted = convertTools(context.tools, compat, model, policy.mode);
			if (policy.mode === "direct") directToolProjection = converted.projection;
			if (converted.tools.length > 0 || policy.mode === "managed" && converted.projection.inputToolCount === 0 && converted.projection.diagnostics.length === 0) params.tools = converted.tools;
			else if (hasToolCallHistory(context.messages)) params.tools = [];
			if (policy.mode === "direct" && compat.zaiToolStream && converted.tools.length > 0) params.tool_stream = true;
			if (policy.mode === "managed" && options?.toolChoice) {
				const toolChoice = reconcileOpenAICompletionsToolChoice(options.toolChoice, converted.projection);
				if (toolChoice !== void 0) params.tool_choice = toolChoice;
			} else if (compatDetection?.capabilities.usesExplicitProxyLikeEndpoint && Array.isArray(params.tools) && params.tools.length > 0) params.tool_choice = "auto";
		} else if (hasToolCallHistory(context.messages)) params.tools = [];
		if (compatDetection?.capabilities.usesExplicitProxyLikeEndpoint && Array.isArray(params.tools) && params.tools.length === 0) {
			delete params.tools;
			delete params.tool_choice;
		}
	}
	if (policy.mode === "direct" && compat.cacheControlFormat === "anthropic") applyCompletionsAnthropicCacheControl(params, cacheControl ?? null, cacheOptOutIndexes, markTools);
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
	const reasoning = resolveOpenAIRequestReasoning(model, requestedEffort);
	const { effort, thinkingEnabled } = reasoning;
	{
		const maxTokenBudget = policy.mode === "direct" ? {
			maxTokens: options?.maxTokens,
			clampToModelMaxTokens: true
		} : resolveOpenAICompletionsMaxTokens(model, options);
		const effectiveMaxTokens = maxTokenBudget.maxTokens;
		const effectiveContextTokens = resolveOpenAICompletionsEffectiveContextTokens(model);
		let clampedMaxTokens = effectiveMaxTokens;
		const modelMaxTokens = resolveOpenAICompletionsModelMaxTokens(model);
		if (maxTokenBudget.clampToModelMaxTokens && clampedMaxTokens !== void 0 && modelMaxTokens !== void 0 && clampedMaxTokens > modelMaxTokens) {
			clampedMaxTokens = modelMaxTokens;
			if (policy.mode === "managed") emitModelTransportDebug(log, `[completions] clamp_max_tokens provider=${model.provider} api=${model.api} model=${model.id} requested=${effectiveMaxTokens} output=${clampedMaxTokens} modelMaxTokens=${modelMaxTokens}`);
		}
		if (compatDetection?.capabilities.usesExplicitProxyLikeEndpoint && clampedMaxTokens !== void 0 && effectiveContextTokens !== void 0) {
			const estimatedInputTokens = estimateOpenAICompletionsInputTokens(params);
			const remainingBudget = Math.max(0, effectiveContextTokens - estimatedInputTokens - 1);
			if (clampedMaxTokens > remainingBudget) {
				if (remainingBudget < MIN_USEFUL_OUTPUT_TOKENS) throw Object.assign(/* @__PURE__ */ new Error(`Context window exceeded: estimated input ${estimatedInputTokens} leaves only ${remainingBudget} output tokens within the ${effectiveContextTokens}-token context.`), { code: "context_length_exceeded" });
				clampedMaxTokens = remainingBudget;
				emitModelTransportDebug(log, `[completions] clamp_max_tokens provider=${model.provider} api=${model.api} model=${model.id} requested=${effectiveMaxTokens} output=${clampedMaxTokens} effectiveContext=${effectiveContextTokens} estimatedInput=${estimatedInputTokens}`);
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
	if (policy.mode === "direct") applyDirectCompletionsReasoningAndRouting(params, model, reasoning, compat);
	else {
		const suppressScalarEffort = applyBinaryCompletionsThinkingParams({
			compatThinkingFormat: compat.thinkingFormat,
			modelReasoning: model.reasoning,
			payload: params,
			thinkingEnabled: thinkingEnabled ?? false
		});
		if (!isOpenRouter && effort && model.reasoning && compat.supportsReasoningEffort && !suppressScalarEffort) params.reasoning_effort = effort;
		if (compat.cacheControlFormat === "anthropic") applyCompletionsAnthropicCacheControl(params, cacheControl ?? null, cacheOptOutIndexes, markTools, !managedCompat?.requiresStringContent);
	}
	if (params.tools?.length && isKnownOpenAICompletionsEndpoint(model)) {
		if (isOpenAIGpt56Model(model)) params.reasoning_effort = "none";
		else if (isOpenAIGpt54MiniModel(model) || isOpenAIGpt55Model(model)) delete params.reasoning_effort;
	}
	return params;
}
//#endregion
//#region packages/ai/src/transports/openai-completions-dsml.ts
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
			partialArgs: JSON.stringify(parsedArguments)
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
//#endregion
//#region packages/ai/src/transports/openai-completions-gemma.ts
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
				partialArgs: JSON.stringify(argumentsValue)
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
//#endregion
//#region packages/ai/src/transports/openai-completions-stream.ts
function extractToolCallThoughtSignature(toolCall) {
	const tc = toolCall;
	if (!tc) return;
	const extra = tc.extra_content?.google;
	return readNonEmptyStringPreservingWhitespace(extra?.thought_signature) ?? readNonEmptyStringPreservingWhitespace(tc.function?.thought_signature) ?? readNonEmptyStringPreservingWhitespace(tc.thought_signature);
}
async function processCompletionsStream(responseStream, output, model, stream, options) {
	const MAX_POST_TOOL_CALL_BUFFER_BYTES = 256e3;
	const directMode = options?.mode === "direct";
	const emitReasoning = options?.emitReasoning ?? true;
	const compat = getCompat(model);
	const visibleReasoningDetailTypes = new Set(compat.visibleReasoningDetailTypes);
	const shouldFilterDeepSeekDsmlText = compat.thinkingFormat === "deepseek";
	const deepSeekTextFilter = shouldFilterDeepSeekDsmlText ? createDeepSeekTextFilter() : null;
	const deepSeekToolCallRecoverer = !directMode && shouldFilterDeepSeekDsmlText ? createDsmlRecoverer() : null;
	const gemmaToolCallRecoverer = !directMode && /gemma-?4/i.test(model.id) ? createGemmaToolCallRecoverer() : null;
	const reasoningTagTextPartitioner = createReasoningTagTextPartitioner();
	if (options?.strictReasoningTags) reasoningTagTextPartitioner.markStrict();
	let currentBlock = null;
	let directTextBlock = null;
	let directThinkingBlock = null;
	let currentTextSource;
	let pendingInterruptedTextBlock = null;
	let confirmedInterruptedTextBlock = null;
	let pendingPostToolCallDeltas = [];
	let pendingPostToolCallBytes = 0;
	let isFlushingPendingPostToolCallDeltas = false;
	const toolCallBlocksByIndex = /* @__PURE__ */ new Map();
	const toolCallBlocksById = /* @__PURE__ */ new Map();
	const encryptedReasoning = createOpenAIEncryptedToolCallReasoningTracker();
	const toolArgumentPreviewSchedules = /* @__PURE__ */ new WeakMap();
	const provisionalCommentaryTags = directMode ? options.provisionalCommentaryTags : /* @__PURE__ */ new Map();
	const contentBlockIndices = /* @__PURE__ */ new WeakMap();
	const toolCallBlockIndices = /* @__PURE__ */ new WeakMap();
	let explicitVisibleTextBlocks;
	const normalizeToolCallDeltas = createOpenAICompletionsToolCallDeltaNormalizer();
	let finishReason;
	let sawNativeToolCallDelta = false;
	const blockIndex = () => directMode && currentBlock && currentBlock.type !== "toolCall" ? contentBlockIndices.get(currentBlock) ?? output.content.length - 1 : output.content.length - 1;
	let chunkPushedEvent = false;
	const pushStreamEvent = (event) => {
		chunkPushedEvent = true;
		stream.push(event);
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
	const appendThinkingDeltaInternal = (reasoningDelta) => {
		if (directMode && directThinkingBlock) currentBlock = directThinkingBlock;
		if (!currentBlock || currentBlock.type !== "thinking") {
			options?.beforeContentBlock?.("thinking");
			const thinkingSignature = reasoningDelta.signature;
			currentBlock = {
				type: "thinking",
				thinking: "",
				...thinkingSignature ? { thinkingSignature } : {}
			};
			if (directMode) {
				directTextBlock = null;
				directThinkingBlock = currentBlock;
			}
			output.content.push(currentBlock);
			contentBlockIndices.set(currentBlock, output.content.length - 1);
			pushStreamEvent({
				type: "thinking_start",
				contentIndex: blockIndex(),
				partial: output
			});
		}
		appendAssistantThinking(currentBlock, reasoningDelta.text);
		pushStreamEvent({
			type: "thinking_delta",
			contentIndex: blockIndex(),
			delta: reasoningDelta.text,
			partial: output
		});
	};
	const appendTextDeltaInternal = (text, source) => {
		if (directMode && directTextBlock) currentBlock = directTextBlock;
		if (currentBlock?.type === "text" && currentTextSource !== source) currentBlock = null;
		if (!currentBlock || currentBlock.type !== "text") {
			options?.beforeContentBlock?.("text");
			currentBlock = {
				type: "text",
				text: ""
			};
			currentTextSource = source;
			if (directMode) {
				directTextBlock = currentBlock;
				directThinkingBlock = null;
			}
			if (source === "reasoning_detail") (explicitVisibleTextBlocks ??= /* @__PURE__ */ new Set()).add(currentBlock);
			output.content.push(currentBlock);
			contentBlockIndices.set(currentBlock, output.content.length - 1);
			pushStreamEvent({
				type: "text_start",
				contentIndex: blockIndex(),
				partial: output
			});
		}
		currentBlock.text += text;
		if (pendingInterruptedTextBlock && text.trim()) {
			confirmedInterruptedTextBlock = pendingInterruptedTextBlock;
			pendingInterruptedTextBlock = null;
		}
		pushStreamEvent({
			type: "text_delta",
			contentIndex: blockIndex(),
			delta: text,
			...directMode ? { partial: output } : {}
		});
	};
	const flushPendingPostToolCallDeltas = () => {
		if (isFlushingPendingPostToolCallDeltas || currentBlock?.type === "toolCall" || pendingPostToolCallDeltas.length === 0) return;
		isFlushingPendingPostToolCallDeltas = true;
		const bufferedDeltas = pendingPostToolCallDeltas;
		pendingPostToolCallDeltas = [];
		pendingPostToolCallBytes = 0;
		for (const delta of bufferedDeltas) if (delta.kind === "text") appendTextDeltaInternal(delta.text, delta.source);
		else if (emitReasoning) appendThinkingDeltaInternal(delta);
		isFlushingPendingPostToolCallDeltas = false;
	};
	const appendThinkingDelta = (reasoningDelta) => {
		flushPendingPostToolCallDeltas();
		appendThinkingDeltaInternal(reasoningDelta);
	};
	const appendTextDelta = (text, source) => {
		flushPendingPostToolCallDeltas();
		appendTextDeltaInternal(text, source);
	};
	const appendVisibleTextDelta = (text) => {
		if (!text) return;
		if (currentBlock?.type === "toolCall" && !directMode) queuePostToolCallDelta({
			kind: "text",
			text
		});
		else appendTextDelta(text);
	};
	const appendReasoningDeltas = (reasoningDeltas) => {
		for (const reasoningDelta of reasoningDeltas) {
			if (reasoningDelta.kind === "thinking" && !emitReasoning) continue;
			if (currentBlock?.type === "toolCall" && !directMode) {
				queuePostToolCallDelta({ ...reasoningDelta });
				continue;
			}
			if (reasoningDelta.kind === "text") appendTextDelta(reasoningDelta.text, reasoningDelta.source);
			else if (emitReasoning) appendThinkingDelta(directMode && model.provider === "opencode-go" && reasoningDelta.signature === "reasoning" ? {
				...reasoningDelta,
				signature: "reasoning_content"
			} : reasoningDelta);
		}
	};
	const appendRecoveredToolCall = (toolCall) => {
		if (currentBlock?.type === "toolCall") {
			currentBlock = null;
			flushPendingPostToolCallDeltas();
		}
		rememberPendingCommentaryTags(provisionalCommentaryTags, tagPendingCommentaryText(output.content));
		const block = {
			type: "toolCall",
			id: `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`,
			name: toolCall.name,
			arguments: toolCall.arguments,
			partialArgs: toolCall.partialArgs
		};
		toolArgumentPreviewSchedules.set(block, createToolArgumentPreviewSchedule());
		currentBlock = block;
		output.content.push(block);
		toolCallBlockIndices.set(block, output.content.length - 1);
		pushStreamEvent({
			type: "toolcall_start",
			contentIndex: toolCallBlockIndices.get(block) ?? -1,
			partial: output
		});
		pushStreamEvent({
			type: "toolcall_delta",
			contentIndex: toolCallBlockIndices.get(block) ?? -1,
			delta: toolCall.partialArgs,
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
	const appendFilteredVisibleTextDelta = (text) => {
		appendRecoveredParts(deepSeekToolCallRecoverer?.push(text) ?? [{
			kind: "text",
			text
		}]);
	};
	const appendPartitionedVisibleDelta = (delta) => {
		if (delta.kind === "text") appendFilteredVisibleTextDelta(delta.text);
	};
	const emitReasoningUsageActivity = (hasReasoningUsageActivity) => {
		if (directMode || !hasReasoningUsageActivity || chunkPushedEvent || !emitReasoning) return;
		const latestBlock = output.content[output.content.length - 1];
		if (currentBlock?.type === "text" || currentBlock?.type === "toolCall") return;
		if (latestBlock?.type === "text" || latestBlock?.type === "toolCall") return;
		appendThinkingDelta({ text: "" });
	};
	const flushReasoningTagTextPartitioner = () => {
		for (const delta of reasoningTagTextPartitioner.flush()) appendPartitionedVisibleDelta(delta);
	};
	const flushGemmaToolCallRecoverer = (allowRecovery = true) => {
		for (const part of gemmaToolCallRecoverer?.flush(allowRecovery) ?? []) if (part.kind === "toolCall") appendRecoveredToolCall(part);
		else for (const delta of reasoningTagTextPartitioner.pushVisible(part.text)) appendPartitionedVisibleDelta(delta);
	};
	const sealTextBeforeReasoning = () => {
		if (currentBlock?.type !== "text" && !reasoningTagTextPartitioner.hasPending()) return;
		flushReasoningTagTextPartitioner();
		if (currentBlock?.type !== "text") return;
		if (currentTextSource !== "reasoning_detail" && currentBlock.text.trim()) pendingInterruptedTextBlock = currentBlock;
		currentBlock = null;
		if (directMode) directTextBlock = null;
		currentTextSource = void 0;
	};
	const beginReasoning = (hasFollowingVisibleText, forceStrict = false) => {
		if (!output.openclawDelivery?.textPhaseRequiresTerminal) output.openclawDelivery = {
			...output.openclawDelivery,
			textPhaseRequiresTerminal: true
		};
		if (forceStrict || reasoningTagTextPartitioner.hasPending()) reasoningTagTextPartitioner.markStrict();
		if (!hasFollowingVisibleText || !reasoningTagTextPartitioner.hasPendingSyntax()) sealTextBeforeReasoning();
	};
	const guardedStream = withFirstStreamEventTimeout(responseStream, {
		provider: model.provider,
		api: model.api,
		model: model.id,
		timeoutMs: options?.firstEventTimeoutMs ?? 0,
		stage: "completions",
		abort: options?.abortFirstEventStream,
		onTimeout: options?.onFirstEventTimeout,
		hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
	});
	const events = directMode ? guardedStream : iterateModelStream(guardedStream, options?.signal);
	for await (const rawChunk of events) {
		throwIfModelStreamAborted(options?.signal);
		chunkPushedEvent = false;
		if (!rawChunk || typeof rawChunk !== "object") continue;
		notifyLlmRequestActivity(options?.signal);
		const chunk = rawChunk;
		output.responseId ||= chunk.id;
		if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) output.responseModel ||= chunk.model;
		let hasReasoningUsageActivity = false;
		if (chunk.usage) {
			output.usage = parseOpenAICompletionsUsage(chunk.usage, model, { includeReasoningTokens: !directMode });
			hasReasoningUsageActivity = hasOpenAICompletionsReasoningUsageActivity(chunk.usage);
		}
		const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
		if (!choice) {
			emitReasoningUsageActivity(hasReasoningUsageActivity);
			continue;
		}
		const choiceUsage = choice.usage;
		if (!chunk.usage && choiceUsage) {
			output.usage = parseOpenAICompletionsUsage(choiceUsage, model, { includeReasoningTokens: !directMode });
			hasReasoningUsageActivity = hasOpenAICompletionsReasoningUsageActivity(choiceUsage);
		}
		if (choice.finish_reason) {
			const finishReasonResult = mapOpenAIStopReason(choice.finish_reason, { allowSingularToolCall: true });
			output.stopReason = finishReasonResult.stopReason;
			finishReason = finishReasonResult.stopReason;
			if (finishReasonResult.errorMessage) output.errorMessage = finishReasonResult.errorMessage;
		}
		const rawChoiceDelta = choice.delta ?? choice.message;
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
			const contentDeltas = readOpenAICompletionsContentDeltas(choiceDelta.content, choiceDelta.refusal, reasoningBatch.mirroredThinking);
			const lastVisibleTextIndex = contentDeltas.findLastIndex((delta) => delta.kind === "text");
			const hasSameChunkVisibleText = reasoningBatch.hasVisibleText || lastVisibleTextIndex !== -1;
			if (hasReasoningThinking) {
				beginReasoning(hasSameChunkVisibleText, true);
				appendReasoningDeltas(reasoningDeltas);
			}
			for (const [contentDeltaIndex, contentDelta] of contentDeltas.entries()) if (contentDelta.kind === "text") {
				const parts = gemmaToolCallRecoverer?.push(contentDelta.text) ?? [contentDelta];
				for (const part of parts) {
					const routedDeltas = hasReasoningThinking ? reasoningTagTextPartitioner.push(part.text) : reasoningTagTextPartitioner.pushVisible(part.text);
					for (const routedDelta of routedDeltas) appendPartitionedVisibleDelta(routedDelta);
				}
			} else {
				beginReasoning(contentDeltaIndex < lastVisibleTextIndex);
				if (emitReasoning) {
					if (currentBlock?.type === "toolCall" && !directMode) queuePostToolCallDelta(contentDelta);
					else appendThinkingDelta(contentDelta);
				}
			}
			if (!hasReasoningThinking) appendReasoningDeltas(reasoningDeltas);
			const toolCallDeltas = normalizedDelta.toolCalls;
			if (toolCallDeltas.length > 0) {
				flushGemmaToolCallRecoverer(false);
				sawNativeToolCallDelta = true;
				flushReasoningTagTextPartitioner();
				rememberPendingCommentaryTags(provisionalCommentaryTags, tagPendingCommentaryText(output.content));
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
						if (directMode) directThinkingBlock = null;
						block = {
							type: "toolCall",
							id: toolCall.id || "",
							name: toolCall.function?.name || "",
							arguments: {},
							partialArgs: "",
							...initialSig ? { thoughtSignature: initialSig } : {}
						};
						encryptedReasoning.rememberToolCall(block.id, block);
						toolArgumentPreviewSchedules.set(block, createToolArgumentPreviewSchedule());
						output.content.push(block);
						toolCallBlockIndices.set(block, output.content.length - 1);
						pushStreamEvent({
							type: "toolcall_start",
							contentIndex: toolCallBlockIndices.get(block) ?? -1,
							partial: output
						});
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
						block.partialArgs += toolArgumentsDelta;
						if (toolArgumentPreviewSchedules.get(block)?.(block.partialArgs.length)) block.arguments = parseStreamingJson(block.partialArgs);
					}
					if (toolArgumentsDelta || directMode) pushStreamEvent({
						type: "toolcall_delta",
						contentIndex: toolCallBlockIndices.get(block) ?? -1,
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
	finalizeOpenAICompletionsToolCalls(output, {
		allowSilentToolCallPromotion: finishReason === "stop" || sawNativeToolCallDelta && (options?.sawStreamDONE?.() ?? false),
		onConfirmedToolCall(block, contentIndex) {
			if (directMode || block.type !== "toolCall") return;
			pushStreamEvent({
				type: "toolcall_end",
				contentIndex,
				toolCall: block,
				partial: output
			});
		}
	});
	if (confirmedInterruptedTextBlock && output.stopReason !== "toolUse" && output.stopReason !== "error" && output.stopReason !== "aborted") tagInterruptedTextPhases(output.content, confirmedInterruptedTextBlock, explicitVisibleTextBlocks);
	if (output.stopReason !== "toolUse") clearPendingCommentaryText(provisionalCommentaryTags);
	if (output.stopReason === "error" || output.stopReason === "aborted") tagUnresolvedTextAsCommentary(output);
	if (output.stopReason === "toolUse") tagPendingCommentaryText(output.content);
}
function shouldEmitOpenAICompletionsReasoning(model, options) {
	if (!model.reasoning) return false;
	const effort = options?.reasoningEffort ?? options?.reasoning ?? "high";
	return Boolean(effort) && isOpenAICompletionsThinkingEnabled(effort);
}
function hasOpenAICompletionsReasoningUsageActivity(rawUsage) {
	const reasoningTokens = rawUsage.completion_tokens_details?.reasoning_tokens;
	return typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens) && reasoningTokens > 0;
}
//#endregion
//#region packages/ai/src/providers/openai-web-search-tools.ts
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
//#endregion
//#region packages/ai/src/transports/openai-responses-params-internal.ts
const OPENAI_RESPONSES_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"opencode",
	"azure-openai-responses",
	"github-copilot"
]);
function raiseMinimalReasoningForResponsesWebSearch(params) {
	if (params.effort !== "minimal" || !hasResponsesWebSearchTool(params.tools)) return params.effort;
	for (const effort of [
		"low",
		"medium",
		"high"
	]) {
		const resolved = resolveOpenAIRequestReasoning(params.model, effort).effort;
		if (resolved && resolved !== "none" && resolved !== "minimal") return resolved;
	}
	return params.effort;
}
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
	return sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(context.systemPrompt));
}
function resolveOpenAIResponsesInstructions(model, context, usesInstructionsField) {
	if (!usesInstructionsField) return;
	const instructions = buildOpenAIResponsesInstructionsText(context);
	if (instructions && instructions.trim().length > 0) return instructions;
	return usesNativeOpenAICodexResponsesBackend(model) ? OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS : void 0;
}
function buildOpenAIResponsesCompactSystemMessage(model, instructions) {
	const compat = getCompat(model);
	const supportsDeveloperRole = typeof compat.supportsDeveloperRole === "boolean" ? compat.supportsDeveloperRole : void 0;
	const role = model.reasoning && supportsDeveloperRole !== false ? "developer" : "system";
	return buildResponsesInputMessage(role, [{
		type: "input_text",
		text: instructions
	}]);
}
function ensureOpenAIResponsesNonEmptyInput(messages, context) {
	if (messages.length > 0 || !context.systemPrompt) return;
	if (!buildOpenAIResponsesInstructionsText(context)) throw new Error("OpenAI Responses requires non-empty input when only systemPrompt is provided.");
	messages.push(buildResponsesInputMessage("user", [{
		type: "input_text",
		text: " "
	}]));
}
function buildOpenAIResponsesParams(model, context, options, metadata, replayMode = "checkpoint") {
	const payloadPolicy = resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "transport-default" });
	const policyAllowsReplayIds = payloadPolicy.explicitStore !== false && !payloadPolicy.shouldStripStore;
	const replayResponsesItemIds = !usesNativeOpenAICodexResponsesBackend(model) && (options?.replayResponsesItemIds ?? policyAllowsReplayIds);
	const messages = convertResponsesMessages(model, context, OPENAI_RESPONSES_TOOL_CALL_PROVIDERS, {
		includeSystemPrompt: !payloadPolicy.usesInstructionsField,
		replayReasoningItems: true,
		replayResponsesItemIds,
		authProfileId: options?.authProfileId,
		sessionId: options?.sessionId,
		replayMode
	});
	ensureOpenAIResponsesNonEmptyInput(messages, context);
	const cacheRetention = resolveCacheRetention(options?.cacheRetention);
	const compat = getCompat(model);
	const promptCacheKey = compat.supportsPromptCacheKey ? resolvePromptCacheKey(options, cacheRetention) : void 0;
	const instructions = resolveOpenAIResponsesInstructions(model, context, payloadPolicy.usesInstructionsField);
	const params = {
		model: model.id,
		input: messages,
		stream: true,
		prompt_cache_key: promptCacheKey,
		...resolveOpenAIPromptCacheParams(model, cacheRetention, compat),
		...instructions ? { instructions } : {},
		...metadata ? { metadata } : {}
	};
	const effectiveMaxTokens = options?.maxTokens || model.maxTokens;
	if (effectiveMaxTokens) params.max_output_tokens = Math.max(effectiveMaxTokens, 16);
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
		const { projection, tools: converted } = prepareResponsesTools(tools, strict, model);
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
			const effort = raiseMinimalReasoningForResponsesWebSearch({
				model,
				effort: resolvedEffort,
				tools: params.tools
			});
			const summary = effort !== "none" && (options?.reasoningEffort || options?.reasoning || options?.reasoningSummary) ? options.reasoningSummary || "auto" : void 0;
			params.reasoning = {
				effort,
				...summary ? { summary } : {}
			};
			if (summary) params.include = ["reasoning.encrypted_content"];
		}
	}
	applyOpenAIResponsesPayloadPolicy(params, payloadPolicy);
	return sanitizeOpenAICodexResponsesParams(model, params);
}
//#endregion
//#region packages/ai/src/transports/openai-responses-compact-client.ts
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
	const output = isRecord(response) && Array.isArray(response.output) ? response.output : [];
	const item = output.at(-1);
	const retainedItems = output.slice(0, -1);
	const retainedUserMessageCount = retainedItems.filter((candidate) => isRecord(candidate) && candidate.type === "message" && candidate.role === "user" && Array.isArray(candidate.content)).length;
	const inputUserMessageCount = Array.isArray(params.request.input) ? params.request.input.filter((candidate) => isRecord(candidate) && candidate.type === "message" && candidate.role === "user").length : 0;
	const retainedMessagePrefixSupported = supportsNativeOpenAIResponsesEndpoint(params.model);
	const usage = isRecord(response) && isRecord(response.usage) ? response.usage : void 0;
	if (!isRecord(response) || response.object !== "response.compaction" || !isOpenAIResponsesCompactionOutput(output, params.model) || retainedItems.length > 0 && (!retainedMessagePrefixSupported || retainedUserMessageCount !== inputUserMessageCount) || !isRecord(item) || item.type !== "compaction" || typeof item.encrypted_content !== "string" || item.encrypted_content.length === 0 || !usage || typeof usage.input_tokens !== "number" || typeof usage.output_tokens !== "number") throw new Error("Responses compact endpoint did not return one trailing compaction item");
	return {
		output,
		item,
		historyMode: retainedUserMessageCount > 0 ? "retained-users" : "compacted-prefix",
		usage,
		model: params.model,
		replayMetadata: buildOpenAIResponsesReasoningReplayMetadata(params.model, {
			authProfileId: params.options?.authProfileId,
			sessionId: params.options?.sessionId
		})
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-compact-request.ts
const COMPACT_REQUEST = Symbol("openaiResponsesCompactRequest");
function claimResponsesCompactRequest(options) {
	const controller = options ? Reflect.get(options, COMPACT_REQUEST) : void 0;
	if (controller?.claimed === false) {
		controller.claimed = true;
		return controller;
	}
}
/** Run a compact-endpoint request through the session's prepared stream stack. */
async function requestPreparedOpenAIResponsesCompaction(streamFn, model, context, options) {
	const preparedOptions = { ...options };
	let resolveResult;
	let rejectResult;
	const result = new Promise((resolve, reject) => {
		resolveResult = resolve;
		rejectResult = reject;
	});
	const controller = {
		claimed: false,
		resolve: resolveResult,
		reject: rejectResult
	};
	Reflect.set(preparedOptions, COMPACT_REQUEST, controller);
	const stream = await Promise.resolve(streamFn(model, context, preparedOptions));
	if (!controller.claimed) throw new Error("Prepared stream did not reach an OpenAI Responses transport");
	try {
		return await result;
	} finally {
		await stream.result().catch(() => void 0);
	}
}
//#endregion
//#region packages/ai/src/transports/openai-responses-reasoning-state.ts
/** Save only admitted settings and hashes, never another copy of the conversation. */
function recordResponsesReasoningState(message, model, identity, request, output) {
	if (!supportsResponsesReasoningUpdate(request) || !isRecord(request.reasoning) || !request.input || request.previous_response_id || message.providerReplay || output.some((item) => isRecord(item) && item.type === "compaction")) return;
	const reasoning = {
		...buildProviderReplayContext(model, identity),
		effort: request.reasoning.effort,
		controls: request.input.flatMap((item, index) => isConfigurationUpdate(item) ? [{
			index,
			item
		}] : []),
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
//#endregion
//#region packages/ai/src/transports/openai-responses-request-fetch.ts
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
	let fetchOverride = options.compact ? createBoundedOpenAIResponsesCompactionFetch(buildGuardedModelFetch(model)) : options.stream ? withDefaultResponsesStreamEncoding(buildGuardedModelFetch(model)) : void 0;
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
//#endregion
//#region packages/ai/src/transports/openai-responses-steering.ts
function cloneWireRequest(request) {
	const serialized = JSON.stringify(request);
	return JSON.parse(serialized);
}
async function projectResponsesSteeringInput(request, project) {
	const { input: activeInput, ...activeSettings } = cloneWireRequest(request);
	if (!Array.isArray(activeInput)) return [];
	const { input, ...settings } = cloneWireRequest(await project());
	if (!Array.isArray(input) || stableStringify(settings) !== stableStringify(activeSettings) || stableStringify(input.slice(0, activeInput.length)) !== stableStringify(activeInput)) return [];
	const projected = input.slice(activeInput.length);
	return projected.every((item) => isRecord(item) && item.role === "user") ? projected : [];
}
/** One response owns admission; accepted input stays on this connection until continuation. */
function createResponsesSteering(params) {
	let responseId;
	let sealed = false;
	let unsubscribe;
	const pending = [];
	const accepted = /* @__PURE__ */ new Map();
	const acknowledged = /* @__PURE__ */ new Set();
	const seal = () => {
		sealed = true;
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
			if (event.type === "response.created" && !responseId && !sealed) {
				const response = isRecord(event.response) ? event.response : void 0;
				if (typeof response?.id !== "string" || !response.id.trim()) throw new Error("Responses steering requires a response identity");
				const activeResponseId = response.id;
				responseId = activeResponseId;
				const cleanup = params.onActiveResponse({
					needsContinuation: params.needsContinuation,
					steer(messages) {
						if (sealed || messages.length === 0) return Promise.resolve(false);
						params.assertActive();
						const converted = params.toInput(messages);
						const submit = (input) => {
							if (sealed || input.length === 0) return Promise.resolve(false);
							params.assertActive();
							return new Promise((resolve, reject) => {
								pending.push({
									input,
									resolve,
									reject
								});
								params.send({
									type: "response.steer",
									previous_response_id: activeResponseId,
									input
								});
							});
						};
						return Array.isArray(converted) ? submit(converted) : converted.then(submit);
					}
				});
				if (sealed) cleanup?.();
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
//#endregion
//#region packages/ai/src/transports/openai-responses-websocket.ts
const SESSION_WEBSOCKET_CACHE_TTL_MS = 3e5;
const SESSION_WEBSOCKET_MAX_AGE_MS = 33e5;
const WEBSOCKET_OPEN_STATE = 1;
const websocketSessionCache = /* @__PURE__ */ new Map();
const degradedWebSocketConnections = /* @__PURE__ */ new Map();
function closeWebSocketSilently(socket, reason = "done") {
	try {
		socket.close({
			code: 1e3,
			reason
		});
	} catch {}
}
function invalidateOwnedWebSocketSession(cacheKey, entry, reason = "done") {
	if (entry.idleTimer) {
		clearTimeout(entry.idleTimer);
		entry.idleTimer = void 0;
	}
	closeWebSocketSilently(entry.socket, reason);
	entry.steeringContinuation?.steering.close(/* @__PURE__ */ new Error("Responses steering connection closed"));
	entry.steeringContinuation?.iterator.return?.().catch(() => void 0);
	entry.steeringContinuation = void 0;
	if (websocketSessionCache.get(cacheKey) === entry) websocketSessionCache.delete(cacheKey);
}
function scheduleSessionWebSocketExpiry(cacheKey, entry) {
	if (entry.idleTimer) clearTimeout(entry.idleTimer);
	entry.idleTimer = setTimeout(() => {
		if (entry.busy) return;
		invalidateOwnedWebSocketSession(cacheKey, entry, "idle_timeout");
	}, SESSION_WEBSOCKET_CACHE_TTL_MS);
	entry.idleTimer.unref?.();
}
function prepareWebSocketConnection(client, headers) {
	if (!isOfficialOpenAIResponsesBaseUrl(client.baseURL)) throw new Error("OpenAI Responses WebSocket requires the official API endpoint");
	if (typeof client.apiKey !== "string" || client.apiKey.length === 0) throw new Error("OpenAI Responses WebSocket requires an API key");
	const owner = getAiTransportHost();
	const resolvedApiKey = owner.resolveSecretSentinel(client.apiKey);
	const resolvedHeaders = { ...resolveAiTransportHeaderSentinels(headers) };
	for (const key of Object.keys(resolvedHeaders)) {
		const normalizedKey = key.toLowerCase();
		if (normalizedKey === "authorization" || normalizedKey === "traceparent") delete resolvedHeaders[key];
	}
	if (!resolvedApiKey) throw new Error("OpenAI Responses WebSocket requires a resolved API key");
	return {
		client: client.withOptions({ apiKey: resolvedApiKey }),
		headers: resolvedHeaders,
		owner,
		ownerId: getSessionResourceOwnerId(owner),
		identity: sha256Hex(JSON.stringify([
			resolvedApiKey,
			client.baseURL,
			Object.entries(resolvedHeaders).toSorted(([a], [b]) => a.localeCompare(b))
		]))
	};
}
function createWebSocket(connection, onError) {
	const socket = new ResponsesWS(connection.client, {
		headers: connection.headers,
		maxQueueSize: 1
	});
	socket.on("error", () => onError(socket));
	return socket;
}
function createTransientWebSocketLease(connection) {
	const socket = createWebSocket(connection, (failedSocket) => closeWebSocketSilently(failedSocket, "transport_error"));
	return {
		socket,
		iterator: socket.stream(),
		reusedConnection: false,
		release: () => closeWebSocketSilently(socket)
	};
}
function createCachedWebSocketLease(cacheKey, entry, reusedConnection) {
	entry.busy = true;
	const steeringContinuation = entry.steeringContinuation;
	entry.steeringContinuation = void 0;
	return {
		socket: entry.socket,
		iterator: steeringContinuation?.iterator ?? entry.socket.stream(),
		entry,
		reusedConnection,
		steeringContinuation,
		release: ({ keep } = {}) => {
			if (!keep || entry.socket.socket.readyState !== WEBSOCKET_OPEN_STATE) {
				invalidateOwnedWebSocketSession(cacheKey, entry);
				return;
			}
			entry.busy = false;
			scheduleSessionWebSocketExpiry(cacheKey, entry);
		}
	};
}
function acquireWebSocket(params, connection) {
	if (!(params.mode !== "websocket" && Boolean(params.sessionId)) || !params.sessionId) return createTransientWebSocketLease(connection);
	const cacheKey = `${connection.ownerId}\0${params.sessionId}\0${connection.identity}`;
	const cached = websocketSessionCache.get(cacheKey);
	if (cached) {
		if (cached.idleTimer) {
			clearTimeout(cached.idleTimer);
			cached.idleTimer = void 0;
		}
		if (cached.busy) return createTransientWebSocketLease(connection);
		const expired = Date.now() - cached.createdAt >= SESSION_WEBSOCKET_MAX_AGE_MS;
		if (!expired && cached.socket.socket.readyState === WEBSOCKET_OPEN_STATE) return createCachedWebSocketLease(cacheKey, cached, true);
		invalidateOwnedWebSocketSession(cacheKey, cached, expired ? "connection_age_limit" : "done");
	}
	const entry = {
		socket: createWebSocket(connection, (failedSocket) => {
			const failedEntry = websocketSessionCache.get(cacheKey);
			if (failedEntry?.socket === failedSocket) invalidateOwnedWebSocketSession(cacheKey, failedEntry, "transport_error");
			else closeWebSocketSilently(failedSocket, "transport_error");
		}),
		sessionId: params.sessionId,
		owner: connection.owner,
		busy: true,
		createdAt: Date.now()
	};
	websocketSessionCache.set(cacheKey, entry);
	return createCachedWebSocketLease(cacheKey, entry, false);
}
function sanitizeWebSocketRequest(request) {
	const { stream: _stream, background: _background, ...websocketRequest } = request;
	return websocketRequest;
}
async function nextWebSocketMessage(iterator, signal) {
	if (signal?.aborted) throw transportAbortError(signal);
	return await racePromiseWithAbortSignal(iterator.next(), signal, transportAbortError);
}
function readServerEvent(message) {
	if (message.type === "message") return message.message;
	if (message.type === "error") throw parseOpenAIResponsesWebSocketServerError(message.error) ?? new Error("OpenAI Responses WebSocket transport failed", { cause: message.error });
	if (message.type === "close") throw new Error(`OpenAI Responses WebSocket closed before completion (code ${message.code})`);
}
function createOpenAIResponsesWebSocketStream(params) {
	const connection = prepareWebSocketConnection(params.client, params.headers);
	let fullRequest = sanitizeWebSocketRequest(params.request);
	const requestModel = typeof fullRequest.model === "string" ? fullRequest.model : "";
	const degradationKey = `${connection.ownerId}\0${params.sessionId ?? ""}\0${connection.identity}\0${requestModel}`;
	const degraded = degradedWebSocketConnections.get(degradationKey);
	if (degraded && degraded.retryAt > Date.now()) throw new OpenAIResponsesWebSocketPreDispatchError(/* @__PURE__ */ new Error("OpenAI Responses WebSocket is cooling down after a transport failure"));
	if (degraded) clearTimeout(degraded.expiryTimer);
	degradedWebSocketConnections.delete(degradationKey);
	const markDegraded = () => {
		const cooldownMs = params.degradeCooldownMs;
		if (cooldownMs === void 0 || !Number.isFinite(cooldownMs) || cooldownMs <= 0) return;
		const entry = {
			sessionId: params.sessionId,
			owner: connection.owner,
			retryAt: Date.now() + cooldownMs,
			expiryTimer: setTimeout(() => {
				if (degradedWebSocketConnections.get(degradationKey) === entry) degradedWebSocketConnections.delete(degradationKey);
			}, cooldownMs)
		};
		entry.expiryTimer.unref?.();
		degradedWebSocketConnections.set(degradationKey, entry);
	};
	let lease;
	try {
		lease = acquireWebSocket(params, connection);
	} catch (error) {
		markDegraded();
		throw new OpenAIResponsesWebSocketPreDispatchError(error);
	}
	let prepared;
	let previousContinuation;
	const resumedSteering = lease.steeringContinuation;
	const steeringMode = resumedSteering ? resumedSteering.requiresInput ? "required-input" : "automatic" : void 0;
	try {
		const continuation = previousContinuation = lease.entry?.continuation;
		if (continuation && lease.entry) {
			lease.entry.continuation = void 0;
			prepared = resolveResponsesContinuationRequest(continuation, fullRequest, steeringMode);
		} else {
			fullRequest = params.restoreRequest?.(fullRequest) ?? fullRequest;
			prepared = {
				request: fullRequest,
				continuationStatus: lease.entry ? "no_previous_response" : "socket_not_cached"
			};
		}
	} catch (error) {
		lease.iterator.return?.().catch(() => void 0);
		lease.release({ keep: false });
		throw error;
	}
	let streamStarted = false;
	let terminalResponse;
	let terminalReceived = false;
	let released = false;
	let retainIterator = false;
	let deferredInput = false;
	let inputReplay;
	if (resumedSteering) try {
		if (prepared.continuationStatus !== "continued" || !prepared.request.previous_response_id) throw new Error("Responses steering continuation changed its request or history");
		const input = omitAcceptedSteering(prepared.request.input ?? [], resumedSteering.acceptedInput);
		if (!resumedSteering.requiresInput && (stableStringify(fullRequest.instructions) !== stableStringify(resumedSteering.instructions) || stableStringify(fullRequest.tools) !== stableStringify(resumedSteering.tools))) throw new Error("Responses automatic steering continuation cannot change instructions or tools");
		const baseline = prepared.fullRequest ?? fullRequest;
		const priorLength = (baseline.input?.length ?? 0) - (prepared.request.input?.length ?? 0);
		const fingerprints = input.map(responsesInputFingerprint);
		if (fingerprints.length > 0) inputReplay = {
			afterResponseId: prepared.request.previous_response_id,
			before: resumedSteering.requiresInput ? fingerprints : [],
			after: resumedSteering.requiresInput ? [] : fingerprints
		};
		const delivered = resumedSteering.requiresInput ? input : [];
		prepared.fullRequest = {
			...baseline,
			input: [
				...(baseline.input ?? []).slice(0, priorLength),
				...resumedSteering.acceptedInput,
				...delivered
			]
		};
		prepared.request = {
			...prepared.request,
			input: delivered
		};
		deferredInput = !resumedSteering.requiresInput && input.length > 0;
	} catch (error) {
		lease.iterator.return?.().catch(() => void 0);
		lease.release({ keep: false });
		throw new OpenAIResponsesWebSocketPostDispatchError(error);
	}
	const steering = lease.entry && params.onActiveResponse && params.steeringInput ? createResponsesSteering({
		onActiveResponse: params.onActiveResponse,
		toInput: params.steeringInput,
		send: (event) => lease.socket.sendRaw(JSON.stringify(event)),
		needsContinuation: () => deferredInput,
		assertActive: () => {
			if (released || terminalReceived || params.signal?.aborted) throw new Error("Responses steering is no longer active");
		}
	}) : void 0;
	const finish = ({ keep = true } = {}) => {
		if (released) return;
		released = true;
		if (keep && lease.entry && terminalResponse) lease.entry.continuation = recordResponsesContinuationState(previousContinuation, prepared.fullRequest ?? fullRequest, terminalResponse, previousContinuation?.lastResponseId === prepared.request.previous_response_id);
		lease.release({ keep });
	};
	return {
		stream: { async *[Symbol.asyncIterator]() {
			if (streamStarted) throw new Error("OpenAI Responses WebSocket stream can only be consumed once");
			streamStarted = true;
			const iterator = lease.iterator;
			let requestDispatched = false;
			try {
				if (params.signal?.aborted) throw transportAbortError(params.signal);
				if (resumedSteering) {
					requestDispatched = true;
					if (resumedSteering.requiresInput) lease.socket.send({
						...prepared.request,
						type: "response.create"
					});
				}
				for (;;) {
					const buffered = resumedSteering?.buffered.shift();
					const next = buffered ? {
						value: buffered,
						done: false
					} : await nextWebSocketMessage(iterator, params.signal);
					if (next.done) throw new Error("OpenAI Responses WebSocket closed before a terminal response event");
					if (next.value.type === "open") {
						if (!requestDispatched) {
							requestDispatched = true;
							lease.socket.send({
								...prepared.request,
								type: "response.create"
							});
						}
						continue;
					}
					const event = readServerEvent(next.value);
					if (!event) continue;
					if (isRecord(event) && typeof event.type === "string" && event.type.startsWith("response.steer.")) {
						if ((isRecord(event.steer) && event.steer.previous_response_id === steering?.responseId ? steering : resumedSteering?.steering ?? steering)?.handle(event)) continue;
					}
					steering?.handle(event);
					if (event.type === "response.completed") terminalResponse = event.response;
					terminalReceived = event.type === "response.completed" || event.type === "response.incomplete" || event.type === "response.failed";
					if (terminalReceived) {
						steering?.seal();
						if (event.type === "response.failed") steering?.close(/* @__PURE__ */ new Error("Responses failed before steering could be applied"));
						const continuationBuffer = [];
						for (;;) {
							if (!steering?.pending) break;
							const acknowledgement = await nextWebSocketMessage(iterator, params.signal);
							if (acknowledgement.done) throw new Error("Responses closed before acknowledging steering");
							const acknowledgedEvent = readServerEvent(acknowledgement.value);
							if (!steering.handle(acknowledgedEvent)) continuationBuffer.push(acknowledgement.value);
						}
						const acceptedInput = steering?.acceptedInput ?? [];
						const isSteered = event.type === "response.incomplete" && isRecord(event.response.incomplete_details) && event.response.incomplete_details.reason === "steered";
						if (lease.entry && steering && acceptedInput.length > 0 && (event.type === "response.completed" || isSteered)) {
							if (event.type === "response.incomplete") terminalResponse = event.response;
							lease.entry.steeringContinuation = {
								iterator,
								buffered: continuationBuffer,
								acceptedInput,
								requiresInput: (terminalResponse?.output ?? []).some((item) => (item.type === "function_call" || item.type === "custom_tool_call") && !(isRecord(item) && item.async === true) || item.type === "mcp_approval_request"),
								steering,
								instructions: fullRequest.instructions,
								tools: fullRequest.tools
							};
							retainIterator = true;
							if (isSteered) {
								yield {
									...event,
									type: "response.completed",
									response: {
										...event.response,
										status: "completed",
										incomplete_details: null
									}
								};
								return;
							}
						}
					}
					yield event;
					if (terminalReceived) {
						degradedWebSocketConnections.delete(degradationKey);
						return;
					}
				}
			} catch (error) {
				const steeringDispatched = Boolean(steering?.pending || steering?.acceptedInput.length || resumedSteering);
				steering?.close(error instanceof Error ? error : /* @__PURE__ */ new Error("Responses steering failed"));
				if (lease.entry) lease.entry.continuation = void 0;
				const safeRetry = error instanceof OpenAIResponsesWebSocketSafeRetryError && !steeringDispatched;
				if (!params.callerSignal?.aborted && !safeRetry) markDegraded();
				if (!requestDispatched && !params.signal?.aborted) throw new OpenAIResponsesWebSocketPreDispatchError(error);
				if (!requestDispatched || params.callerSignal?.aborted || safeRetry) throw error;
				throw new OpenAIResponsesWebSocketPostDispatchError(error);
			} finally {
				steering?.seal();
				if (!retainIterator) {
					steering?.close(/* @__PURE__ */ new Error("Responses stream ended before steering was confirmed"));
					await iterator.return?.().catch(() => void 0);
				}
				if (!terminalReceived) finish({ keep: false });
			}
		} },
		request: prepared.request,
		fullRequest: prepared.fullRequest ?? fullRequest,
		reusedConnection: lease.reusedConnection,
		continuationStatus: prepared.continuationStatus,
		inputReplay,
		finish
	};
}
function closeOpenAIResponsesWebSocketSessions(sessionId, owner) {
	for (const [cacheKey, entry] of websocketSessionCache) {
		if (owner && entry.owner !== owner || sessionId && entry.sessionId !== sessionId) continue;
		invalidateOwnedWebSocketSession(cacheKey, entry, "session_cleanup");
	}
	for (const [key, entry] of degradedWebSocketConnections) if ((!owner || entry.owner === owner) && (!sessionId || entry.sessionId === sessionId)) {
		clearTimeout(entry.expiryTimer);
		degradedWebSocketConnections.delete(key);
	}
}
registerSessionResourceCleanup(closeOpenAIResponsesWebSocketSessions);
//#endregion
//#region packages/ai/src/transports/openai-responses-client.ts
function resolveNativeOpenAIResponsesWebSocketMode(model, transport) {
	if (transport !== "websocket" && transport !== "websocket-cached" && transport !== "auto") return;
	if (getAiTransportHost().requiresManagedTransport(model)) return;
	return supportsNativeOpenAIResponsesEndpoint(model) ? transport : void 0;
}
function combineWebSocketTimeoutSignal(signal, model, timeoutMs) {
	const resolvedTimeoutMs = timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : getAiTransportHost().resolveModelRequestTimeoutMs(model);
	if (resolvedTimeoutMs === void 0 || !Number.isFinite(resolvedTimeoutMs)) return signal;
	return AbortSignal.any([signal, AbortSignal.timeout(Math.max(1, resolvedTimeoutMs))]);
}
function createOpenAIResponsesClient(model, apiKey, defaultHeaders, fetchOverride) {
	return new OpenAI({
		apiKey,
		baseURL: resolveOpenAIClientBaseUrl(model),
		dangerouslyAllowBrowser: true,
		defaultHeaders,
		fetch: fetchOverride ?? buildGuardedModelFetch(model),
		...buildOpenAISdkClientOptions(model)
	});
}
function createResponsesTransportExecutor(config) {
	return (model, context, options) => {
		const responsesOptions = options;
		const compactRequest = claimResponsesCompactRequest(responsesOptions);
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = createAssistantOutput(model, config.outputApi);
			let firstEventAbort;
			let continuationClaim;
			const requestLifecycle = responsesRequestLifecycle.get(options);
			try {
				const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
				const websocketMode = resolveNativeOpenAIResponsesWebSocketMode(model, responsesOptions?.transport);
				const encodeBody = prepareModelRequestBody(websocketMode || compactRequest ? void 0 : options);
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
				const fetchOverride = createResponsesRequestFetch(model, {
					compact: Boolean(compactRequest),
					stream: config.streamRequest,
					lifecycle: requestLifecycle
				});
				const client = config.createClient(model, apiKey, httpHeaders, fetchOverride);
				const nativeAstra = model.id === "gpt-6-astra" && supportsNativeOpenAIResponsesEndpoint(model);
				const asyncToolExecutionEligible = nativeAstra && options?.asyncToolExecution === true && !responsesOptions?.openclawCodeModeToolSurface;
				const prepareRequest = async (request) => {
					let params = request;
					const nextParams = await options?.onPayload?.(params, model);
					if (nextParams !== void 0) params = nextParams;
					params = sanitizeOpenAICodexResponsesParams(model, params);
					params = sanitizeResponsesImagePayload(params);
					if (responsesOptions?.openclawCodeModeToolSurface === true) {
						const visibleToolNames = resolveCodeModeResponsesVisibleToolNames(context);
						const allowedHostedToolTypes = responsesOptions?.openclawCodeModeAllowedHostedToolTypes;
						enforceCodeModeResponsesToolSurface(params, visibleToolNames, allowedHostedToolTypes, codeModeToolSurfaceObserver.get(options));
						assertCodeModeResponsesToolSurface(params, visibleToolNames, allowedHostedToolTypes);
					}
					if (asyncToolExecutionEligible && params.model === "gpt-6-astra" && params.multi_agent?.enabled !== true && params.tools) params.tools = params.tools.map((tool) => tool.type === "function" ? {
						...tool,
						async: true
					} : tool);
					return params;
				};
				const buildRequest = (replayMode, requestContext = context) => prepareRequest(config.buildRequest(model, requestContext, responsesOptions, turnState?.metadata, replayMode));
				let params = await buildRequest("checkpoint");
				const asyncTools = asyncToolExecutionEligible && params.model === "gpt-6-astra" && params.multi_agent?.enabled !== true;
				if (compactRequest) {
					const compacted = await postOpenAIResponsesCompaction({
						client,
						model,
						request: params,
						options: responsesOptions
					});
					output.usage.input = compacted.usage.input_tokens;
					output.usage.output = compacted.usage.output_tokens;
					output.usage.totalTokens = compacted.usage.input_tokens + compacted.usage.output_tokens;
					compactRequest.resolve(compacted);
					finalizeTransportStream({
						stream,
						output,
						signal: options?.signal
					});
					return;
				}
				const sessionId = options?.sessionId;
				if (config.httpContinuation && !websocketMode && !getAiTransportHost().requiresManagedTransport(model) && (supportsNativeOpenAIResponsesEndpoint(model) || resolveOpenAIResponsesPayloadPolicy(model).explicitContinuationOptIn) && sessionId && (params.store === true || supportsResponsesReasoningUpdate(params)) && !params.previous_response_id) {
					continuationClaim = claimOpenAIResponsesHttpContinuation({
						sessionId,
						apiKey,
						baseUrl: model.baseUrl,
						headers: httpHeaders,
						request: params,
						restoreRequest: () => restoreResponsesReasoningState(context, model, responsesOptions, params)
					});
					if (continuationClaim) params = continuationClaim.fullRequest;
				}
				const observePrompt = createResponsesPromptEgressObserver(responsesOptions, context.systemPrompt);
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
				emitModelTransportDebug(log, `[responses] start provider=${model.provider} api=${model.api} model=${model.id} requestIdHash=${redactIdentifier(options?.requestId, { len: 64 })} baseUrl=${formatModelTransportDebugBaseUrl(model.baseUrl)} timeoutMs=${safeDebugValue(requestOptions?.timeout)} apiKey=${apiKey ? "present" : "missing"} ${summarizeResponsesPayload(params)}`);
				const responseModelTracker = createResponseModelTracker(isOpenAICodexResponsesModel(model));
				let continuationBaseline;
				let dispatchedPreviousResponseId;
				let contextUsageEligible = true;
				let requestedTier;
				const createSseStream = async (initialRequest = continuationClaim?.request ?? params, initialAttemptKind = "initial", initialRejectedCompaction) => {
					const { stream: responseStream } = await createResponsesStreamWithEncryptedContentRetry({
						client,
						request: initialRequest,
						requestOptions,
						model,
						encodeBody,
						observePrompt,
						initialAttemptKind,
						initialRejectedCompaction,
						buildFullHistoryRequest: () => buildRequest("full-history"),
						onCompactionRejected: (checkpoint) => suppressOpenAIResponsesCompaction(output, model, responsesOptions, checkpoint),
						canRetryStream: () => output.content.length === 0,
						wrapStream: ({ stream: rawResponseStream, response, attempt }) => {
							requestedTier = attempt.request.service_tier;
							contextUsageEligible &&= attempt.kind === "initial";
							dispatchedPreviousResponseId = attempt.request.previous_response_id;
							continuationBaseline = attempt.request.previous_response_id ? params : attempt.request;
							const trackedResponseStream = responseModelTracker.track(response, rawResponseStream);
							return withProviderResponseHook({
								stream: observeResponsesStream(trackedResponseStream, model, requestStartedAt),
								signal: firstEvent.signal,
								abort: firstEvent.abort,
								hook: createOpenAIProviderAcceptanceHook(options, response, model),
								onReady: () => {
									emitModelTransportDebug(log, `[responses] headers provider=${model.provider} api=${model.api} model=${model.id} transport=sse elapsedMs=${Date.now() - requestStartedAt}`);
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
				const logWebSocketFallback = (reason) => emitModelTransportDebug(log, `[responses] websocket_fallback provider=${model.provider} api=${model.api} model=${model.id} reason=${reason}`);
				const closeWebSocketForFallback = (reason) => {
					finishWebSocket?.({ keep: false });
					finishWebSocket = void 0;
					transport = "sse";
					logWebSocketFallback(reason);
				};
				if (websocketMode) try {
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
						onActiveResponse: nativeAstra && params.model === "gpt-6-astra" ? options?.onActiveResponse : void 0,
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
					emitModelTransportDebug(log, `[responses] websocket_selected provider=${model.provider} api=${model.api} model=${model.id} mode=${websocketMode} reused=${websocket.reusedConnection} continuation=${websocket.continuationStatus === "continued"} continuationStatus=${websocket.continuationStatus} sessionIdHash=${redactIdentifier(options?.sessionId)} headersHash=${redactIdentifier(JSON.stringify(Object.entries(websocketHeaders ?? {}).toSorted(([a], [b]) => a.localeCompare(b))))}`);
					const trackedWebSocketStream = responseModelTracker.track(void 0, websocket.stream);
					responseStream = { async *[Symbol.asyncIterator]() {
						let providerAccepted = false;
						try {
							for await (const event of trackedWebSocketStream) {
								if (!providerAccepted) {
									providerAccepted = true;
									await notifyProviderStreamOpened({
										options,
										cancelStream: () => websocket.finish({ keep: false })
									});
								}
								startStream();
								yield event;
							}
						} catch (error) {
							if (error instanceof OpenAIResponsesWebSocketSafeRetryError) {
								const encryptedContentRejected = isInvalidEncryptedContentError(error);
								const recovery = encryptedContentRejected ? await resolveNextResponsesEncryptedContentAttempt({
									kind: "initial",
									request: {
										...websocket.request,
										stream: true
									}
								}, error, { buildFullHistoryRequest: () => buildRequest("full-history") }) : void 0;
								if (encryptedContentRejected && !recovery) throw error;
								closeWebSocketForFallback(`safe_server_error code=${error.code} status=${safeDebugValue(error.status)} param=${safeDebugValue(error.param)}`);
								yield* await createSseStream(recovery?.request ?? await buildRequest("full-history"), recovery?.kind ?? "continuation-rejected", recovery?.rejectedCompaction);
								return;
							}
							if (websocketSignal.aborted || !(error instanceof OpenAIResponsesWebSocketPreDispatchError)) throw error;
							transport = "sse";
							logWebSocketFallback("before_first_event");
							yield* await createSseStream();
						}
					} };
				} catch (error) {
					if (error instanceof OpenAIResponsesWebSocketPostDispatchError) throw error;
					closeWebSocketForFallback("setup_failure");
					responseStream = await createSseStream();
				}
				else responseStream = await createSseStream();
				try {
					const acceptedResponseStream = withResponsesRequestAcceptance(responseStream, requestLifecycle, transport === "websocket" ? websocketSignal : firstEvent.signal);
					const terminal = await processResponsesStream(acceptedResponseStream, output, stream, model, {
						canRetryIdentityConflict: () => hasOnlyResponsesFunctionTools(transport === "websocket" ? websocketBaseline : continuationBaseline),
						...config.pricingOptions?.(responsesOptions, model),
						onServiceTier: (responseTier) => responsesServiceTierObserver.observe(options, requestedTier, responseTier),
						firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options) ?? config.firstEventTimeoutMs,
						abortFirstEventStream: firstEvent.abort,
						onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
						signal: options?.signal,
						reasoningReplayMetadata: buildOpenAIResponsesReasoningReplayMetadata(model, {
							authProfileId: responsesOptions?.authProfileId,
							sessionId: options?.sessionId
						}),
						asyncToolExecution: asyncTools,
						...responseModelTracker.terminalOptions
					});
					finishWebSocket?.();
					if (options?.signal?.aborted) throw transportAbortError(options.signal);
					if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
					const admitted = transport === "websocket" ? websocketBaseline : continuationBaseline;
					if (terminal && admitted && supportsNativeOpenAIResponsesEndpoint(model)) recordResponsesReasoningState(output, model, responsesOptions, admitted, terminal.output);
					if (continuationClaim && continuationBaseline && terminal) continuationClaim.commit(continuationBaseline, terminal, dispatchedPreviousResponseId);
					if (terminal && admitted && contextUsageEligible) recordResponsesContextUsage(output, model, responsesOptions, admitted, terminal.output, "transport");
				} catch (error) {
					finishWebSocket?.({ keep: false });
					throw error;
				}
				emitModelTransportDebug(log, `[responses] completed provider=${model.provider} api=${model.api} model=${model.id} transport=${transport} elapsedMs=${Date.now() - requestStartedAt}`);
				finalizeTransportStream({
					stream,
					output,
					signal: options?.signal
				});
			} catch (error) {
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
				if (error instanceof ResponsesStreamFailure && error.observation) logResponsesFailedNoDetails(error.observation);
				const incompleteReason = output.diagnostics?.find(({ type }) => type === "openai_responses_terminal")?.details?.incompleteReason;
				log.warn(`[responses] error provider=${model.provider} api=${model.api} model=${model.id} ` + summarizeOpenAITransportError(error) + (typeof incompleteReason === "string" ? ` incompleteReason=${incompleteReason}` : ""));
				failTransportStream({
					stream,
					output,
					signal: options?.signal,
					error
				});
			} finally {
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
		createClient: createOpenAIResponsesClient,
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
		createClient: createAzureOpenAIClient,
		buildRequest: (model, context, options, metadata, replayMode) => {
			const deploymentName = resolveAzureDeploymentNameFromMap({
				modelId: model.id,
				deploymentMap: process.env.AZURE_OPENAI_DEPLOYMENT_NAME_MAP
			});
			const params = buildOpenAIResponsesParams(model, context, options, metadata, replayMode);
			params.model = deploymentName;
			delete params.store;
			return params;
		}
	});
}
function createAzureOpenAIClient(model, apiKey, defaultHeaders, fetchOverride) {
	const baseURL = model.baseUrl.replace(/\/+$/, "");
	const clientOptions = {
		apiKey,
		dangerouslyAllowBrowser: true,
		defaultHeaders,
		baseURL,
		fetch: fetchOverride ?? buildGuardedModelFetch(model),
		...buildOpenAISdkClientOptions(model)
	};
	if (isOpenAICompatibleAzureResponsesBaseUrl(baseURL)) return new OpenAI(clientOptions);
	return new AzureOpenAI({
		...clientOptions,
		apiVersion: resolveAzureOpenAIApiVersion()
	});
}
//#endregion
//#region packages/ai/src/transports/openai-completions-transport.ts
function assertOpenAICompletionsPayloadHasConversationTurn(params, model) {
	const messages = params.messages;
	if (!Array.isArray(messages) || hasOpenAICompatibleConversationTurn(messages)) return;
	throw new Error(`OpenAI-compatible chat payload for ${model.provider}/${model.id} contains no non-empty user or assistant messages after compaction and transport transforms; refusing to send a system/tool-only request. Start a new user turn or repair the compacted session history.`);
}
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
		for (const char of text) {
			if (char === "\n" || char === "\r") {
				finishLine();
				continue;
			}
			if (!lineOverflowed && line.length < SSE_DONE_MAX_LINE_CHARS) line += char;
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
function buildOpenAICompletionsClientConfig(model, headers) {
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
	return {
		baseURL: resolveOpenAIClientBaseUrl(model, baseURL),
		defaultHeaders: headers,
		defaultQuery: Object.keys(defaultQuery).length > 0 ? defaultQuery : void 0
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
		const provisionalCommentaryTags = /* @__PURE__ */ new Map();
		let firstEventAbort;
		try {
			const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
			const directEmitReasoning = Boolean(mode === "direct" && model.reasoning && options?.reasoningEffort && isOpenAICompletionsThinkingEnabled(options.reasoningEffort));
			const cacheRetention = resolveCacheRetention(options?.cacheRetention);
			const policy = mode === "direct" ? {
				mode,
				compat: resolveOpenAICompletionsCompat(model),
				cacheRetention
			} : { mode };
			const { client, sawStreamDONE } = policy.mode === "direct" ? {
				client: createDirectCompletionsClient(model, context, apiKey, resolveProviderSimpleCompletionHeaders(model, options), cacheRetention === "none" ? void 0 : options?.sessionId, policy.compat),
				sawStreamDONE: void 0
			} : createManagedCompletionsClient(model, context, options, apiKey, cacheRetention);
			let params = buildOpenAICompletionsRequest(model, context, options, policy);
			const encodeBody = prepareModelRequestBody(options);
			const nextParams = await options?.onPayload?.(params, model);
			if (nextParams !== void 0) params = nextParams;
			if (mode === "managed") {
				if (options?.openclawCodeModeToolSurface === true) {
					const visibleToolNames = resolveCodeModeResponsesVisibleToolNames(context);
					enforceCodeModeResponsesToolSurface(params, visibleToolNames, void 0, codeModeToolSurfaceObserver.get(options));
					assertCodeModeResponsesToolSurface(params, visibleToolNames);
				}
				if (getCompat(model).requiresNonEmptyUserOrAssistantMessage) assertOpenAICompletionsPayloadHasConversationTurn(params, model);
			}
			const emitReasoning = mode === "direct" ? directEmitReasoning : shouldEmitOpenAICompletionsReasoning(model, options);
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
			const { data: responseStream, response } = await client.chat.completions.create(params, requestOptions).withResponse();
			const hookedResponseStream = withProviderResponseHook({
				stream: responseStream,
				signal: firstEventAbort.signal,
				abort: firstEventAbort.abort,
				hook: createOpenAIProviderAcceptanceHook(options, response, model),
				onReady: () => stream.push({
					type: "start",
					partial: output
				})
			});
			const directEvents = mode === "direct" ? createDirectCompletionsEventStream(output, stream) : void 0;
			try {
				await processCompletionsStream(hookedResponseStream, output, model, directEvents?.stream ?? stream, {
					...directEvents ? {
						mode: "direct",
						beforeContentBlock: directEvents.beforeContentBlock,
						provisionalCommentaryTags
					} : { mode: "managed" },
					signal: options?.signal,
					emitReasoning,
					strictReasoningTags: reasoningTagTextPolicy.isStrict(options),
					firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
					abortFirstEventStream: firstEventAbort.abort,
					onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
					sawStreamDONE
				});
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
			failTransportStream({
				stream,
				output,
				signal: options?.signal,
				error,
				cleanup: () => {
					if (mode === "managed") output.stopReason = options?.signal?.aborted ? "aborted" : "error";
					finalizeOpenAICompletionsToolCalls(output, { allowSilentToolCallPromotion: false });
					clearPendingCommentaryText(provisionalCommentaryTags);
					tagUnresolvedTextAsCommentary(output);
					if (mode === "direct") for (const block of output.content) {
						delete block.index;
						delete block.partialArgs;
						delete block.streamIndex;
					}
				}
			});
		} finally {
			firstEventAbort?.dispose();
		}
	})();
	return eventStream;
}
function createDirectCompletionsClient(model, context, apiKey, optionsHeaders, sessionId, compat) {
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
	return createOpenAIProviderClient(model, apiKey, headers, optionsHeaders);
}
function createManagedCompletionsClient(model, context, options, apiKey, cacheRetention) {
	const turnState = resolveProviderTransportTurnState(model, {
		sessionId: options?.sessionId,
		turnId: randomUUID(),
		attempt: 1,
		transport: "stream"
	});
	const optionHeaders = resolveOpencodeSessionHeaders(model, options);
	const turnHeaders = filterProviderTurnHeadersForExplicitOpencodeSession(model, options, turnState?.headers);
	const doneDetector = createSseDoneDetector();
	const baseFetch = buildGuardedModelFetch(model);
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
		return new Response(transformed, {
			headers: response.headers,
			status: response.status,
			statusText: response.statusText
		});
	};
	const clientConfig = buildOpenAICompletionsClientConfig(model, buildOpenAIClientHeaders(model, context, {
		...turnHeaders,
		...optionHeaders
	}, void 0, resolvePromptCacheKey(options, cacheRetention), cacheRetention));
	return {
		client: new OpenAI({
			apiKey,
			baseURL: clientConfig.baseURL,
			dangerouslyAllowBrowser: true,
			defaultHeaders: clientConfig.defaultHeaders,
			defaultQuery: clientConfig.defaultQuery,
			fetch: doneDetectingFetch,
			...buildOpenAISdkClientOptions(model)
		}),
		sawStreamDONE: doneDetector.sawDone
	};
}
//#endregion
export { requestPreparedOpenAIResponsesCompaction as a, convertMessages as c, applyCompletionsAnthropicCacheControl as d, hasOpenAICompatibleConversationTurn as f, createDeepSeekTextFilter as h, createOpenAIResponsesTransportStreamFn as i, flattenCompletionMessagesToStringContent as l, resolveMaxTokensParam as m, streamOpenAICompletionsRequest as n, hasResponsesWebSearchTool as o, canonicalizeMaxTokensParam as p, createAzureOpenAIResponsesTransportStreamFn as r, buildOpenAICompletionsParams as s, createOpenAICompletionsTransportStreamFn as t, stripCompletionMessagesToRoleContent as u };
