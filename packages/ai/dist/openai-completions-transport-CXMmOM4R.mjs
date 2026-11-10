import { r as __require, t as __commonJSMin } from "./rolldown-runtime-B4iAMlE-.mjs";
import { _ as runtimeContextContentToText, f as hasRuntimeContextMarker, p as isRuntimeContextMessage } from "./types-BXd0kI8-.mjs";
import { t as appendAssistantMessageDiagnostic } from "./diagnostics-DzrF1h4J.mjs";
import { r as appendAssistantThinking } from "./event-stream-X2gmsUWv.mjs";
import { i as asOptionalRecord, o as isRecord, r as asOptionalObjectRecord } from "./record-coerce-CNDovvft.mjs";
import { c as readNonEmptyStringPreservingWhitespace, t as hasNonEmptyString } from "./string-coerce-Cj8sqWHx.mjs";
import { n as asNonNegativeFiniteNumber, r as asPositiveFiniteNumber } from "./number-coercion-37gmNkuA.mjs";
import { N as isImageWithMediaPayload, a as resolveAiTransportHeaderSentinels, r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { L as resolveOpenAIThinkingApi, _ as responsesServiceTierObserver, b as applyOpenAICompletionsToolReasoning, d as OpenAIResponsesWebSocketSafeRetryError, h as parseOpenAIResponsesWebSocketServerError, j as supportsOpenAITemperature, l as OpenAIResponsesWebSocketPostDispatchError, r as OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS, t as AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS, u as OpenAIResponsesWebSocketPreDispatchError, v as isResponsesServiceTierRejection, w as isOpenAIGpt6Model, y as nextResponsesServiceTier } from "./openai-responses-contracts-B5mGAbR6.mjs";
import { n as getSessionResourceOwnerId, r as registerSessionResourceCleanup } from "./session-resources-vKvGIE3J.mjs";
import { c as stableStringify, s as truncateUtf16Safe } from "./provider-error-qtZD2inE.mjs";
import { r as resolveOpenAIPromptCacheParams } from "./openai-prompt-cache-B9AvdoEo.mjs";
import { i as emitModelTransportError, p as hasOnlyResponsesFunctionTools, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl, u as DegenerateToolCallArgumentsError } from "./diagnostics-v7oVEW59.mjs";
import { c as supportsModelTools, n as estimateStringChars } from "./transport-utils-DwOpuTjL.mjs";
import { c as resolveOpenAIResponsesTextFormat, i as resolveOpenAICompletionsCompat, l as shouldOmitOllamaCompatResponseFormat, n as isNativeOpenAIEndpoint, o as usesNativeOpenAICodexResponsesBackend, r as isOpenAICodexResponsesModel, s as resolveOpenAICompletionsResponseFormat, t as detectOpenAICompletionsCompat } from "./openai-completions-compat-bNQXF1y9.mjs";
import { i as resolveProviderEndpoint, t as buildGuardedModelFetch } from "./host-policy-Dm7PM6AD.mjs";
import { i as resolveCacheRetention, r as buildCopilotDynamicHeaders } from "./cloudflare-Dttf8jKq.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-CRGuMONI.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-D_MeCQFI.mjs";
import { C as splitSystemPromptRelocatableBoundary, S as splitSystemPromptCacheBoundary, T as stripSystemPromptRelocatableBoundary, f as extractToolResultText, g as reasoningTagTextPolicy, h as preparedRequestSuffix, l as describeToolResultMediaPlaceholder, m as codeModeToolSurfaceObserver, r as clampMaxTokensToModel, s as prepareModelRequestBody, w as stripSystemPromptCacheBoundary } from "./simple-options-xJkqrG_E.mjs";
import { A as shortHash, E as createToolArgumentPreviewSchedule, M as racePromiseWithAbortSignal, O as parseStreamingJson, S as withProviderResponseHook, b as transportAbortError, c as failTransportStream, d as iterateModelStream, h as notifyProviderStreamOpened, l as finalizeTerminalToolCallArguments, s as createWritableTransportEventStream, u as finalizeTransportStream, v as sanitizeTransportPayloadText, y as throwIfModelStreamAborted } from "./transport-stream-shared-lhgkTOz3.mjs";
import { C as redactIdentifier, w as sha256Hex } from "./tool-schema-json-projection-B1sTYwfH.mjs";
import { n as getEnvApiKey } from "./env-api-keys-Xd8dm_aV.mjs";
import { n as isProviderReplayContext, r as providerReplayContextMatches, t as buildProviderReplayContext } from "./provider-replay-context-4vxI7p4V.mjs";
import { n as transformProviderMessages, t as createAssistantOutput } from "./assistant-output-BnQm3fov.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-CfMuh5cC.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import { isGoogleGemini3ThinkingLevelModel } from "./internal/google-model-family.mjs";
import { $ as isConfigurationUpdate, A as summarizeResponsesPayload, At as isOpenAICompletionsThinkingEnabled, B as recordResponsesInputReplay, C as readResponsesRecoveryEvent, Ct as reconcileOpenAIResponsesToolChoice, D as logResponsesFailedNoDetails, E as ResponsesStreamFailure, Et as createOpenAIProviderAcceptanceHook, Ft as readOpenAICompletionsReasoningBatch, G as responsesContinuationPrefixFingerprint, H as claimOpenAIResponsesHttpContinuation, I as convertResponsesMessages, It as resolveOpenAIClientBaseUrl, K as responsesContinuationRequestFingerprint, Lt as resolvePromptCacheKey, Mt as measureUtf8AppendBytes, Nt as parseOpenAICompletionsUsage, O as safeDebugValue, Ot as createResponseModelTracker, P as buildResponsesInputMessage, Pt as readOpenAICompletionsContentDeltas, Rt as withOpenAIErrorResponseHook, S as isInvalidEncryptedContentError, St as reconcileOpenAICompletionsToolChoice, T as resolveNextResponsesEncryptedContentAttempt, Tt as GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, U as recordResponsesContinuationState, V as responsesInputFingerprint, W as resolveResponsesContinuationRequest, _t as resolveOpenAIRequestReasoning, a as prepareResponsesTools, bt as prepareOpenAITools, c as observeResponsesStream, ct as buildOpenAIClientHeaders, dt as enforceCodeModeResponsesToolSurface, et as replayResponsesReasoningUpdates, gt as resolveOpenAIStrictToolFlagWithDiagnostics, ht as resolveCodeModeResponsesVisibleToolNames, j as recordResponsesContextUsage, jt as log, k as summarizeOpenAITransportError, kt as detachPartialSnapshot, lt as buildOpenAISdkClientOptions, n as applyResponsesServiceTierPricing, ot as suppressOpenAIResponsesCompaction, pt as getCompat, rt as buildOpenAIResponsesReasoningReplayMetadata, s as processResponsesStream, st as assertCodeModeResponsesToolSurface, tt as supportsResponsesReasoningUpdate, ut as buildOpenAISdkRequestOptions, vt as resolveOpenAISimpleReasoningEffort, w as resolveAzureOpenAIApiVersion, wt as toOpenAIResponsesToolChoice, x as createResponsesStreamWithRecovery, xt as projectOpenAITools, z as readResponsesInputReplayState } from "./openai-responses-shared-XoSAyCHj.mjs";
import { n as OpenAI, r as require_x509_transport_state, t as AzureOpenAI } from "./openai-CMTVUemR.mjs";
import "./types.mjs";
import { i as createOpenAIProviderClient, n as resolveProviderSimpleCompletionHeaders, r as resolveProviderTransportTurnState, t as filterProviderTurnHeadersForExplicitOpencodeSession } from "./provider-transport-turn-state-CmtCL4-i.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-D_TfJHRJ.mjs";
import { t as boundResponseBody } from "./streaming-byte-guard-DBXr1XYn.mjs";
import { b as prepareOpenAIFunctionTool, f as normalizeToolSchema, p as withPreparedToolSchemaNormalization, r as normalizeOpenAIStrictToolParameters } from "./openai-tool-schema-BTEU2xmN.mjs";
import { t as requiresReasoningContentReplay } from "./openai-completions-reasoning-replay-BwT1xwRI.mjs";
import { t as mapOpenAIStopReason } from "./openai-stop-reason-8s70vDXj.mjs";
import { t as createReasoningTagTextPartitioner } from "./reasoning-tag-text-partitioner-CU9A4Lg8.mjs";
import { i as resolveAzureDeploymentNameFromMap, t as isOpenAICompatibleAzureResponsesBaseUrl } from "./azure-openai-responses-client-compat-D0dvJMbZ.mjs";
import { a as isOpenAIResponsesCompactionOutput, c as applyOpenAIResponsesPayloadPolicy, d as resolveOpenAIResponsesPayloadPolicy, i as getOpenAIResponsesCompactionOutputError, n as supportsNativeOpenAIResponsesEndpoint, r as createBoundedOpenAIResponsesCompactionFetch, s as sanitizeResponsesImagePayload, t as isOfficialOpenAIResponsesBaseUrl } from "./openai-responses-endpoint-CfKR6N5f.mjs";
import { a as createResponsesV2CompactionCollector, i as createResponsesPromptEgressObserver, n as responsesRequestLifecycle, o as claimResponsesCompactRequest, r as withResponsesRequestAcceptance, t as independentResponsesRequest } from "./openai-responses-request-lifecycle-B-urkkjk.mjs";
import { randomUUID } from "node:crypto";
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
	if (markTools && lastToolIndex >= 0) tools[lastToolIndex] = {
		...tools[lastToolIndex],
		cache_control: cacheControl
	};
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
	const bufferFollowingDelta = (delta) => {
		const nextDeltaBytes = Buffer.byteLength(JSON.stringify(delta), "utf8");
		if (pendingFollowingDeltaBytes + nextDeltaBytes > MAX_BUFFERED_LEGACY_FOLLOWING_DELTA_BYTES || pendingFollowingDeltas.length >= MAX_BUFFERED_LEGACY_FOLLOWING_DELTAS) throw new Error("Exceeded legacy tool-call content buffer limit");
		pendingFollowingDeltaBytes += nextDeltaBytes;
		pendingFollowingDeltas.push(delta);
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
		delete block.streamIndex;
		options.onConfirmedToolCall?.(block, contentIndex);
	}
}
//#endregion
//#region packages/ai/src/transports/openai-completions-context-budget-buffer.ts
const MAX_CONTEXT_BUDGET_BUFFER_CHUNKS = 8192;
const MAX_CONTEXT_BUDGET_BUFFER_BYTES = 4194304;
async function bufferContextLimitedCompletions(source, signal) {
	const iterator = source[Symbol.asyncIterator]();
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
			if (chunkFinishReason) finishReason = chunkFinishReason;
			signal?.throwIfAborted();
		}
	} catch (error) {
		failed = true;
		sourceError = error;
		iterator.return?.().catch(() => void 0);
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
				if (!finished && !failed) iterator.return?.().catch(() => void 0);
			}
		} }
	};
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
	const supportsTools = options.supportsTools !== false;
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
				else if (block.type === "toolCall") {
					if (supportsTools) toolCalls.push(block);
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
				const content = textResult.trim() ? textResult : mediaPlaceholder ?? "(no output)";
				if (supportsTools) {
					const toolResultMsg = {
						role: "tool",
						content,
						tool_call_id: preparedRequestSuffix.has(context) ? preparedRequestSuffix.toolCallId(context, toolMsg.toolCallId, normalizeToolCallId(toolMsg.toolCallId)) : toolMsg.toolCallId
					};
					if (compat.requiresToolResultName && toolMsg.toolName) toolResultMsg.name = toolMsg.toolName;
					params.push(toolResultMsg);
				} else {
					const text = sanitizeSurrogates(`[tool result id=${toolMsg.toolCallId} name=${toolMsg.toolName}] ${content}`);
					const previous = params.at(-1);
					if (previous?.role !== "assistant") params.push({
						role: "assistant",
						content: text
					});
					else if (Array.isArray(previous.content)) previous.content.push({
						type: "text",
						text
					});
					else previous.content = previous.content ? `${previous.content}\n${text}` : text;
				}
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
				if (supportsTools && compat.requiresAssistantAfterToolResult) params.push({
					role: "assistant",
					content: "I have processed the tool results."
				});
				params.push({
					role: "user",
					content: imageContentParts
				});
				lastRole = "user";
			} else lastRole = supportsTools ? "toolResult" : "assistant";
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
//#region packages/ai/src/transports/openai-completions-policy.ts
function applyCompletionsReasoningAndRouting(params, model, reasoning, compat, mode) {
	const direct = mode === "direct";
	const nativeEffort = compat.thinkingFormat === "openrouter" ? void 0 : reasoning.effort;
	const enabled = reasoning.thinkingEnabled ?? false;
	if (model.reasoning && (!compat.thinkingOffControlUndeclared || reasoning.thinkingEnabled !== void 0 || !reasoning.thinkingExplicit)) {
		let allowScalarEffort = true;
		if (direct && compat.thinkingFormat === "zai") {
			params.thinking = enabled ? {
				type: "enabled",
				clear_thinking: false
			} : { type: "disabled" };
			allowScalarEffort = false;
		} else if (compat.thinkingFormat === "qwen") {
			params.enable_thinking = enabled;
			allowScalarEffort = false;
		} else if (compat.thinkingFormat === "qwen-chat-template") {
			const chatTemplateReasoningEffort = enabled && reasoning.thinkingExplicit && model.compat?.supportedReasoningEfforts?.length ? reasoning.effort : void 0;
			params.chat_template_kwargs = {
				enable_thinking: enabled,
				...direct ? { preserve_thinking: true } : {},
				...chatTemplateReasoningEffort ? { reasoning_effort: chatTemplateReasoningEffort } : {}
			};
			allowScalarEffort = false;
		} else if (compat.thinkingFormat === "together" || direct && compat.thinkingFormat === "deepseek") {
			if (compat.thinkingFormat === "deepseek") params.thinking = { type: enabled ? "enabled" : "disabled" };
			else params.reasoning = { enabled };
			allowScalarEffort = enabled;
		}
		if (allowScalarEffort && compat.supportsReasoningEffort && (direct ? nativeEffort !== void 0 : nativeEffort)) params.reasoning_effort = nativeEffort;
	}
	if (!direct) return;
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
		const toolCalls = "tool_calls" in message ? message.tool_calls : void 0;
		if (!Array.isArray(toolCalls)) continue;
		for (const toolCall of toolCalls) {
			let sig = sigById.get(toolCall.id) ?? fallbackSig;
			if (sig) {
				if (hasGoogleCompatThoughtSignatureTruncationFootprint(sig.trim())) sig = fallbackSig;
			}
			if (!sig) continue;
			Object.assign(toolCall, { extra_content: { google: { thought_signature: sig } } });
		}
	}
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
function shouldPreserveReasoningContentReplay(model, compat) {
	if (compat.requiresReasoningContentOnAssistantMessages || compat.thinkingFormat === "deepseek" || compat.thinkingFormat === "zai" || shouldTrustReasoningContentReplayMetadata(model)) return true;
	return requiresReasoningContentReplay(model.id);
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
function applyCompletionsReplay(outgoingMessages, context, model, compat) {
	injectToolCallThoughtSignatures(outgoingMessages, context, model);
	const preserveOpenRouterReasoning = compat.thinkingFormat === "openrouter" && shouldPreserveOpenRouterReasoningReplay(model);
	const preserveReasoningContent = shouldPreserveReasoningContentReplay(model, compat);
	for (const message of outgoingMessages) {
		if (message.role !== "assistant") continue;
		if (preserveOpenRouterReasoning) sanitizeOpenRouterReasoningReplayFields(message);
		else {
			const record = message;
			for (const field of COMPLETIONS_REASONING_REPLAY_FIELDS) {
				if (preserveReasoningContent && field === "reasoning_content" && typeof record[field] === "string") continue;
				delete record[field];
			}
		}
	}
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
		const text = record.text;
		if (typeof text === "string") {
			adjustedChars += estimateStringChars(text);
			continue;
		}
		adjustedChars += estimateJsonChars(block, 256);
	}
	return adjustedChars;
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
				const parameters = compat.requiresTypedUnionBranches ? normalizeToolSchema(tool.parameters, "moonshot") : tool.parameters;
				return prepareOpenAIFunctionTool(tool.name, tool.description, mode === "direct" ? parameters : normalizeOpenAIStrictToolParameters(parameters, strict === true, model.compat), strict).completions;
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
	const convertedMessages = convertMessages(model, context, compat, {
		cacheOptOutIndexes,
		supportsTools,
		preserveSystemPromptCacheBoundary: cacheControl !== void 0 && !managedCompat?.requiresStringContent
	});
	let messages = convertedMessages;
	if (managedCompat) {
		applyCompletionsReplay(convertedMessages, context, model, managedCompat);
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
	if (supportsTools) {
		if (context.tools) {
			const converted = convertTools(context.tools, compat, model, policy.mode);
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
	const thinkingExplicit = options?.openclawThinkingExplicit ?? (options?.reasoningEffort !== void 0 || options?.reasoning !== void 0);
	const reasoning = {
		...resolveOpenAIRequestReasoning(model, requestedEffort, compat.reasoningEffortForOff),
		thinkingExplicit
	};
	const { effort, thinkingEnabled } = reasoning;
	{
		const maxTokenBudget = policy.mode === "direct" ? {
			maxTokens: options?.maxTokens,
			clampToModelMaxTokens: true
		} : resolveOpenAICompletionsMaxTokens(model, options);
		const effectiveMaxTokens = maxTokenBudget.maxTokens;
		const effectiveContextTokens = asPositiveFiniteNumber(model.contextTokens) ?? asPositiveFiniteNumber(model.contextWindow);
		let clampedMaxTokens = effectiveMaxTokens;
		const modelOutputLimit = asPositiveFiniteNumber(model.maxTokens);
		const modelMaxTokens = modelOutputLimit === void 0 ? void 0 : Math.floor(modelOutputLimit);
		if (maxTokenBudget.clampToModelMaxTokens && clampedMaxTokens !== void 0 && modelMaxTokens !== void 0 && clampedMaxTokens > modelMaxTokens) {
			clampedMaxTokens = modelMaxTokens;
			if (policy.mode === "managed") emitModelTransportDebug(log, `[completions] clamp_max_tokens provider=${model.provider} api=${model.api} model=${model.id} requested=${effectiveMaxTokens} output=${clampedMaxTokens} modelMaxTokens=${modelMaxTokens}`);
		}
		if (compatDetection?.capabilities.usesExplicitProxyLikeEndpoint && clampedMaxTokens !== void 0 && effectiveContextTokens !== void 0) {
			const estimatedInputTokens = estimateOpenAICompletionsInputTokens(params);
			const remainingBudget = Math.max(0, effectiveContextTokens - estimatedInputTokens - 1);
			if (clampedMaxTokens > remainingBudget) {
				if (remainingBudget < (params.tools?.length && params.tool_choice !== "none" ? Math.max(MIN_USEFUL_OUTPUT_TOKENS, Math.min(2048, Math.ceil((modelMaxTokens ?? 0) / 8))) : MIN_USEFUL_OUTPUT_TOKENS)) throw Object.assign(/* @__PURE__ */ new Error(`Context window exceeded: estimated input ${estimatedInputTokens} leaves only ${remainingBudget} output tokens within the ${effectiveContextTokens}-token context.`), { code: "context_length_exceeded" });
				clampedMaxTokens = remainingBudget;
				contextOutputCap = remainingBudget;
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
	applyCompletionsReasoningAndRouting(params, model, reasoning, compat, policy.mode);
	if (policy.mode === "managed" && compat.cacheControlFormat === "anthropic") applyCompletionsAnthropicCacheControl(params, cacheControl ?? null, cacheOptOutIndexes, markTools, !managedCompat?.requiresStringContent);
	if (params.tools?.length && isKnownOpenAICompletionsEndpoint(model)) applyOpenAICompletionsToolReasoning(params, model);
	if (contextOutputCap !== void 0) contextOutputBudgets.set(params, {
		model: params.model,
		cap: contextOutputCap,
		inputHash: completionsInputHash(params)
	});
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
//#endregion
//#region packages/ai/src/transports/openai-completions-stream.ts
function extractToolCallThoughtSignature(toolCall) {
	const tc = toolCall;
	if (!tc) return;
	const extra = tc.extra_content?.google;
	return readNonEmptyStringPreservingWhitespace(extra?.thought_signature) ?? readNonEmptyStringPreservingWhitespace(tc.function?.thought_signature) ?? readNonEmptyStringPreservingWhitespace(tc.thought_signature);
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
		output.responseId ||= chunk.id;
		if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) output.responseModel ||= chunk.model;
		const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
		const usage = chunk.usage || choice?.usage;
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
		const rawChoiceDelta = choice?.delta ?? choice?.message;
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
function shouldEmitOpenAICompletionsReasoning(model, options) {
	if (!model.reasoning) return false;
	const effort = options?.reasoningEffort ?? options?.reasoning ?? "high";
	return Boolean(effort) && isOpenAICompletionsThinkingEnabled(effort);
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
	const role = model.reasoning && compat.supportsDeveloperRole ? "developer" : "system";
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
function buildOpenAIResponsesParams(model, context, options, metadata, replayMode = "checkpoint", retainUserProvenance = false) {
	const payloadPolicy = resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "transport-default" });
	const policyAllowsReplayIds = payloadPolicy.explicitStore !== false && !payloadPolicy.shouldStripStore;
	const replayResponsesItemIds = !usesNativeOpenAICodexResponsesBackend(model) && (options?.replayResponsesItemIds ?? policyAllowsReplayIds);
	const messages = convertResponsesMessages(model, context, OPENAI_RESPONSES_TOOL_CALL_PROVIDERS, {
		includeSystemPrompt: !payloadPolicy.usesInstructionsField,
		replayReasoningItems: true,
		replayResponsesItemIds,
		authProfileId: options?.authProfileId,
		sessionId: options?.sessionId,
		replayMode,
		retainUserProvenance
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
	if (!isRecord(response) || response.object !== "response.compaction") throw new Error("Responses compact endpoint must return a response.compaction object");
	const output = response.output;
	if (!isOpenAIResponsesCompactionOutput(output, params.model)) throw new Error(`Responses compact endpoint: ${getOpenAIResponsesCompactionOutputError(output, params.model)}`);
	const window = output;
	const item = window.at(-1);
	if (window.length > 1 && !supportsNativeOpenAIResponsesEndpoint(params.model)) throw new Error("Responses compact endpoint: retained messages require native OpenAI");
	const usage = isRecord(response.usage) ? response.usage : void 0;
	if (!usage || typeof usage.input_tokens !== "number" || typeof usage.output_tokens !== "number") throw new Error("Responses compact endpoint: usage must include input_tokens and output_tokens");
	return {
		output: window,
		item,
		historyMode: window.length > 1 ? "retained-users" : "compacted-prefix",
		usage,
		model: params.model,
		replayMetadata: buildOpenAIResponsesReasoningReplayMetadata(params.model, {
			authProfileId: params.options?.authProfileId,
			sessionId: params.options?.sessionId
		})
	};
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
//#region packages/ai/src/transports/openai-responses-websocket-recovery.ts
/** Owns safe WebSocket rejection recovery; transport selection and session leases stay with the caller. */
function createRecoverableResponsesWebSocketStream(params) {
	const { trackedWebSocketStream, websocket, websocketSignal, options, output, buildRequest, createSseStream, closeWebSocketForFallback, logWebSocketFallback, startStream } = params;
	return { async *[Symbol.asyncIterator]() {
		let acceptance = "pending";
		let outputObserved = false;
		try {
			for await (const event of trackedWebSocketStream) {
				const { failure, hasResponseOutput, isPrelude } = readResponsesRecoveryEvent(event);
				outputObserved ||= hasResponseOutput;
				if (isResponsesServiceTierRejection(failure) && !websocket.hasActiveResponse) throw new OpenAIResponsesWebSocketSafeRetryError("invalid_request_error", void 0, "service_tier", "Invalid service_tier argument", failure);
				outputObserved ||= !isPrelude;
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
			params.setTransportToSse();
			logWebSocketFallback("before_first_event");
			yield* await createSseStream();
		}
	} };
}
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/tslib.js
var require_tslib = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.__setModuleDefault = exports.__createBinding = void 0;
	exports.__classPrivateFieldSet = __classPrivateFieldSet;
	exports.__classPrivateFieldGet = __classPrivateFieldGet;
	exports.__exportStar = __exportStar;
	exports.__importStar = __importStar;
	exports.__classPrivateFieldIn = __classPrivateFieldIn;
	exports.__importDefault = __importDefault;
	function __classPrivateFieldSet(receiver, state, value, kind, f) {
		if (kind === "m") throw new TypeError("Private method is not writable");
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	}
	function __classPrivateFieldGet(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	}
	var __createBinding = Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	};
	exports.__createBinding = __createBinding;
	function __exportStar(m, o) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
	}
	var __setModuleDefault = Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	};
	exports.__setModuleDefault = __setModuleDefault;
	var ownKeys = function(o) {
		ownKeys = Object.getOwnPropertyNames || function(o2) {
			var ar = [];
			for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
			return ar;
		};
		return ownKeys(o);
	};
	function __importStar(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
		}
		__setModuleDefault(result, mod);
		return result;
	}
	function __classPrivateFieldIn(state, receiver) {
		if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
		return typeof state === "function" ? receiver === state : state.has(receiver);
	}
	function __importDefault(mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	}
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const BINARY_TYPES = [
		"nodebuffer",
		"arraybuffer",
		"fragments"
	];
	const hasBlob = typeof Blob !== "undefined";
	if (hasBlob) BINARY_TYPES.push("blob");
	module.exports = {
		BINARY_TYPES,
		CLOSE_TIMEOUT: 3e4,
		EMPTY_BUFFER: Buffer.alloc(0),
		GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
		hasBlob,
		kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
		kListener: Symbol("kListener"),
		kStatusCode: Symbol("status-code"),
		kWebSocket: Symbol("websocket"),
		NOOP: () => {}
	};
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/buffer-util.js
var require_buffer_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { EMPTY_BUFFER } = require_constants();
	const FastBuffer = Buffer[Symbol.species];
	/**
	* Merges an array of buffers into a new buffer.
	*
	* @param {Buffer[]} list The array of buffers to concat
	* @param {Number} totalLength The total length of buffers in the list
	* @return {Buffer} The resulting buffer
	* @public
	*/
	function concat(list, totalLength) {
		if (list.length === 0) return EMPTY_BUFFER;
		if (list.length === 1) return list[0];
		const target = Buffer.allocUnsafe(totalLength);
		let offset = 0;
		for (let i = 0; i < list.length; i++) {
			const buf = list[i];
			target.set(buf, offset);
			offset += buf.length;
		}
		if (offset < totalLength) return new FastBuffer(target.buffer, target.byteOffset, offset);
		return target;
	}
	/**
	* Masks a buffer using the given mask.
	*
	* @param {Buffer} source The buffer to mask
	* @param {Buffer} mask The mask to use
	* @param {Buffer} output The buffer where to store the result
	* @param {Number} offset The offset at which to start writing
	* @param {Number} length The number of bytes to mask.
	* @public
	*/
	function _mask(source, mask, output, offset, length) {
		for (let i = 0; i < length; i++) output[offset + i] = source[i] ^ mask[i & 3];
	}
	/**
	* Unmasks a buffer using the given mask.
	*
	* @param {Buffer} buffer The buffer to unmask
	* @param {Buffer} mask The mask to use
	* @public
	*/
	function _unmask(buffer, mask) {
		for (let i = 0; i < buffer.length; i++) buffer[i] ^= mask[i & 3];
	}
	/**
	* Converts a buffer to an `ArrayBuffer`.
	*
	* @param {Buffer} buf The buffer to convert
	* @return {ArrayBuffer} Converted buffer
	* @public
	*/
	function toArrayBuffer(buf) {
		if (buf.length === buf.buffer.byteLength) return buf.buffer;
		return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}
	/**
	* Converts `data` to a `Buffer`.
	*
	* @param {*} data The data to convert
	* @return {Buffer} The buffer
	* @throws {TypeError}
	* @public
	*/
	function toBuffer(data) {
		toBuffer.readOnly = true;
		if (Buffer.isBuffer(data)) return data;
		let buf;
		if (data instanceof ArrayBuffer) buf = new FastBuffer(data);
		else if (ArrayBuffer.isView(data)) buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
		else {
			buf = Buffer.from(data);
			toBuffer.readOnly = false;
		}
		return buf;
	}
	module.exports = {
		concat,
		mask: _mask,
		toArrayBuffer,
		toBuffer,
		unmask: _unmask
	};
	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) try {
		const bufferUtil = __require("bufferutil");
		module.exports.mask = function(source, mask, output, offset, length) {
			if (length < 48) _mask(source, mask, output, offset, length);
			else bufferUtil.mask(source, mask, output, offset, length);
		};
		module.exports.unmask = function(buffer, mask) {
			if (buffer.length < 32) _unmask(buffer, mask);
			else bufferUtil.unmask(buffer, mask);
		};
	} catch (e) {}
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/limiter.js
var require_limiter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const kDone = Symbol("kDone");
	const kRun = Symbol("kRun");
	/**
	* A very simple job queue with adjustable concurrency. Adapted from
	* https://github.com/STRML/async-limiter
	*/
	var Limiter = class {
		/**
		* Creates a new `Limiter`.
		*
		* @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
		*     to run concurrently
		*/
		constructor(concurrency) {
			this[kDone] = () => {
				this.pending--;
				this[kRun]();
			};
			this.concurrency = concurrency || Infinity;
			this.jobs = [];
			this.pending = 0;
		}
		/**
		* Adds a job to the queue.
		*
		* @param {Function} job The job to run
		* @public
		*/
		add(job) {
			this.jobs.push(job);
			this[kRun]();
		}
		/**
		* Removes a job from the queue and runs it if possible.
		*
		* @private
		*/
		[kRun]() {
			if (this.pending === this.concurrency) return;
			if (this.jobs.length) {
				const job = this.jobs.shift();
				this.pending++;
				job(this[kDone]);
			}
		}
	};
	module.exports = Limiter;
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const zlib = __require("zlib");
	const bufferUtil = require_buffer_util();
	const Limiter = require_limiter();
	const { kStatusCode } = require_constants();
	const FastBuffer = Buffer[Symbol.species];
	const TRAILER = Buffer.from([
		0,
		0,
		255,
		255
	]);
	const kPerMessageDeflate = Symbol("permessage-deflate");
	const kTotalLength = Symbol("total-length");
	const kCallback = Symbol("callback");
	const kBuffers = Symbol("buffers");
	const kError = Symbol("error");
	let zlibLimiter;
	/**
	* permessage-deflate implementation.
	*/
	var PerMessageDeflate = class {
		/**
		* Creates a PerMessageDeflate instance.
		*
		* @param {Object} [options] Configuration options
		* @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
		*     for, or request, a custom client window size
		* @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
		*     acknowledge disabling of client context takeover
		* @param {Number} [options.concurrencyLimit=10] The number of concurrent
		*     calls to zlib
		* @param {Boolean} [options.isServer=false] Create the instance in either
		*     server or client mode
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
		*     use of a custom server window size
		* @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
		*     disabling of server context takeover
		* @param {Number} [options.threshold=1024] Size (in bytes) below which
		*     messages should not be compressed if context takeover is disabled
		* @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
		*     deflate
		* @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
		*     inflate
		*/
		constructor(options) {
			this._options = options || {};
			this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
			this._maxPayload = this._options.maxPayload | 0;
			this._isServer = !!this._options.isServer;
			this._deflate = null;
			this._inflate = null;
			this.params = null;
			if (!zlibLimiter) {
				const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
				zlibLimiter = new Limiter(concurrency);
			}
		}
		/**
		* @type {String}
		*/
		static get extensionName() {
			return "permessage-deflate";
		}
		/**
		* Create an extension negotiation offer.
		*
		* @return {Object} Extension parameters
		* @public
		*/
		offer() {
			const params = {};
			if (this._options.serverNoContextTakeover) params.server_no_context_takeover = true;
			if (this._options.clientNoContextTakeover) params.client_no_context_takeover = true;
			if (this._options.serverMaxWindowBits) params.server_max_window_bits = this._options.serverMaxWindowBits;
			if (this._options.clientMaxWindowBits) params.client_max_window_bits = this._options.clientMaxWindowBits;
			else if (this._options.clientMaxWindowBits == null) params.client_max_window_bits = true;
			return params;
		}
		/**
		* Accept an extension negotiation offer/response.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Object} Accepted configuration
		* @public
		*/
		accept(configurations) {
			configurations = this.normalizeParams(configurations);
			this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
			return this.params;
		}
		/**
		* Releases all resources used by the extension.
		*
		* @public
		*/
		cleanup() {
			if (this._inflate) {
				this._inflate.close();
				this._inflate = null;
			}
			if (this._deflate) {
				const callback = this._deflate[kCallback];
				this._deflate.close();
				this._deflate = null;
				if (callback) callback(/* @__PURE__ */ new Error("The deflate stream was closed while data was being processed"));
			}
		}
		/**
		*  Accept an extension negotiation offer.
		*
		* @param {Array} offers The extension negotiation offers
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsServer(offers) {
			const opts = this._options;
			const accepted = offers.find((params) => {
				if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) return false;
				return true;
			});
			if (!accepted) throw new Error("None of the extension offers can be accepted");
			if (opts.serverNoContextTakeover) accepted.server_no_context_takeover = true;
			if (opts.clientNoContextTakeover) accepted.client_no_context_takeover = true;
			if (typeof opts.serverMaxWindowBits === "number") accepted.server_max_window_bits = opts.serverMaxWindowBits;
			if (typeof opts.clientMaxWindowBits === "number") accepted.client_max_window_bits = opts.clientMaxWindowBits;
			else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) delete accepted.client_max_window_bits;
			return accepted;
		}
		/**
		* Accept the extension negotiation response.
		*
		* @param {Array} response The extension negotiation response
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsClient(response) {
			const params = response[0];
			if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) throw new Error("Unexpected parameter \"client_no_context_takeover\"");
			if (!params.client_max_window_bits) {
				if (typeof this._options.clientMaxWindowBits === "number") params.client_max_window_bits = this._options.clientMaxWindowBits;
			} else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error("Unexpected or invalid parameter \"client_max_window_bits\"");
			return params;
		}
		/**
		* Normalize parameters.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Array} The offers/response with normalized parameters
		* @private
		*/
		normalizeParams(configurations) {
			configurations.forEach((params) => {
				Object.keys(params).forEach((key) => {
					let value = params[key];
					if (value.length > 1) throw new Error(`Parameter "${key}" must have only a single value`);
					value = value[0];
					if (key === "client_max_window_bits") {
						if (value !== true) {
							const num = +value;
							if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
							value = num;
						} else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else if (key === "server_max_window_bits") {
						const num = +value;
						if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
						value = num;
					} else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
						if (value !== true) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else throw new Error(`Unknown parameter "${key}"`);
					params[key] = value;
				});
			});
			return configurations;
		}
		/**
		* Decompress data. Concurrency limited.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		decompress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._decompress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Compress data. Concurrency limited.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		compress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._compress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Decompress data.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_decompress(data, fin, callback) {
			const endpoint = this._isServer ? "client" : "server";
			if (!this._inflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._inflate = zlib.createInflateRaw({
					...this._options.zlibInflateOptions,
					windowBits
				});
				this._inflate[kPerMessageDeflate] = this;
				this._inflate[kTotalLength] = 0;
				this._inflate[kBuffers] = [];
				this._inflate.on("error", inflateOnError);
				this._inflate.on("data", inflateOnData);
			}
			this._inflate[kCallback] = callback;
			this._inflate.write(data);
			if (fin) this._inflate.write(TRAILER);
			this._inflate.flush(() => {
				const err = this._inflate[kError];
				if (err) {
					this._inflate.close();
					this._inflate = null;
					callback(err);
					return;
				}
				const data = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
				if (this._inflate._readableState.endEmitted) {
					this._inflate.close();
					this._inflate = null;
				} else {
					this._inflate[kTotalLength] = 0;
					this._inflate[kBuffers] = [];
					if (fin && this.params[`${endpoint}_no_context_takeover`]) this._inflate.reset();
				}
				callback(null, data);
			});
		}
		/**
		* Compress data.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_compress(data, fin, callback) {
			const endpoint = this._isServer ? "server" : "client";
			if (!this._deflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._deflate = zlib.createDeflateRaw({
					...this._options.zlibDeflateOptions,
					windowBits
				});
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				this._deflate.on("data", deflateOnData);
			}
			this._deflate[kCallback] = callback;
			this._deflate.write(data);
			this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
				if (!this._deflate) return;
				let data = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
				if (fin) data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
				this._deflate[kCallback] = null;
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				if (fin && this.params[`${endpoint}_no_context_takeover`]) this._deflate.reset();
				callback(null, data);
			});
		}
	};
	module.exports = PerMessageDeflate;
	/**
	* The listener of the `zlib.DeflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function deflateOnData(chunk) {
		this[kBuffers].push(chunk);
		this[kTotalLength] += chunk.length;
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function inflateOnData(chunk) {
		this[kTotalLength] += chunk.length;
		if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
			this[kBuffers].push(chunk);
			return;
		}
		this[kError] = /* @__PURE__ */ new RangeError("Max payload size exceeded");
		this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
		this[kError][kStatusCode] = 1009;
		this.removeListener("data", inflateOnData);
		this.reset();
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'error'` event.
	*
	* @param {Error} err The emitted error
	* @private
	*/
	function inflateOnError(err) {
		this[kPerMessageDeflate]._inflate = null;
		if (this[kError]) {
			this[kCallback](this[kError]);
			return;
		}
		err[kStatusCode] = 1007;
		this[kCallback](err);
	}
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/validation.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { isUtf8 } = __require("buffer");
	const { hasBlob } = require_constants();
	const tokenChars = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		0,
		1,
		0
	];
	/**
	* Checks if a status code is allowed in a close frame.
	*
	* @param {Number} code The status code
	* @return {Boolean} `true` if the status code is valid, else `false`
	* @public
	*/
	function isValidStatusCode(code) {
		return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
	}
	/**
	* Checks if a given buffer contains only correct UTF-8.
	* Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	* Markus Kuhn.
	*
	* @param {Buffer} buf The buffer to check
	* @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	* @public
	*/
	function _isValidUTF8(buf) {
		const len = buf.length;
		let i = 0;
		while (i < len) if ((buf[i] & 128) === 0) i++;
		else if ((buf[i] & 224) === 192) {
			if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) return false;
			i += 2;
		} else if ((buf[i] & 240) === 224) {
			if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) return false;
			i += 3;
		} else if ((buf[i] & 248) === 240) {
			if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) return false;
			i += 4;
		} else return false;
		return true;
	}
	/**
	* Determines whether a value is a `Blob`.
	*
	* @param {*} value The value to be tested
	* @return {Boolean} `true` if `value` is a `Blob`, else `false`
	* @private
	*/
	function isBlob(value) {
		return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
	}
	module.exports = {
		isBlob,
		isValidStatusCode,
		isValidUTF8: _isValidUTF8,
		tokenChars
	};
	if (isUtf8) module.exports.isValidUTF8 = function(buf) {
		return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	};
	else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
		const isValidUTF8 = __require("utf-8-validate");
		module.exports.isValidUTF8 = function(buf) {
			return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
		};
	} catch (e) {}
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/receiver.js
var require_receiver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { Writable } = __require("stream");
	const PerMessageDeflate = require_permessage_deflate();
	const { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } = require_constants();
	const { concat, toArrayBuffer, unmask } = require_buffer_util();
	const { isValidStatusCode, isValidUTF8 } = require_validation();
	const FastBuffer = Buffer[Symbol.species];
	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;
	const DEFER_EVENT = 6;
	/**
	* HyBi Receiver implementation.
	*
	* @extends Writable
	*/
	var Receiver = class extends Writable {
		/**
		* Creates a Receiver instance.
		*
		* @param {Object} [options] Options object
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {String} [options.binaryType=nodebuffer] The type for binary data
		* @param {Object} [options.extensions] An object containing the negotiated
		*     extensions
		* @param {Boolean} [options.isServer=false] Specifies whether to operate in
		*     client or server mode
		* @param {Number} [options.maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=0] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		*/
		constructor(options = {}) {
			super();
			this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
			this._binaryType = options.binaryType || BINARY_TYPES[0];
			this._extensions = options.extensions || {};
			this._isServer = !!options.isServer;
			this._maxBufferedChunks = options.maxBufferedChunks | 0;
			this._maxFragments = options.maxFragments | 0;
			this._maxPayload = options.maxPayload | 0;
			this._skipUTF8Validation = !!options.skipUTF8Validation;
			this[kWebSocket] = void 0;
			this._bufferedBytes = 0;
			this._buffers = [];
			this._compressed = false;
			this._payloadLength = 0;
			this._mask = void 0;
			this._fragmented = 0;
			this._masked = false;
			this._fin = false;
			this._opcode = 0;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._numFragments = 0;
			this._fragments = [];
			this._errored = false;
			this._loop = false;
			this._state = GET_INFO;
		}
		/**
		* Implements `Writable.prototype._write()`.
		*
		* @param {Buffer} chunk The chunk of data to write
		* @param {String} encoding The character encoding of `chunk`
		* @param {Function} cb Callback
		* @private
		*/
		_write(chunk, encoding, cb) {
			if (this._opcode === 8 && this._state == GET_INFO) return cb();
			if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
				cb(this.createError(RangeError, "Too many buffered chunks", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
				return;
			}
			this._bufferedBytes += chunk.length;
			this._buffers.push(chunk);
			this.startLoop(cb);
		}
		/**
		* Consumes `n` bytes from the buffered data.
		*
		* @param {Number} n The number of bytes to consume
		* @return {Buffer} The consumed bytes
		* @private
		*/
		consume(n) {
			this._bufferedBytes -= n;
			if (n === this._buffers[0].length) return this._buffers.shift();
			if (n < this._buffers[0].length) {
				const buf = this._buffers[0];
				this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				return new FastBuffer(buf.buffer, buf.byteOffset, n);
			}
			const dst = Buffer.allocUnsafe(n);
			do {
				const buf = this._buffers[0];
				const offset = dst.length - n;
				if (n >= buf.length) dst.set(this._buffers.shift(), offset);
				else {
					dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
					this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				}
				n -= buf.length;
			} while (n > 0);
			return dst;
		}
		/**
		* Starts the parsing loop.
		*
		* @param {Function} cb Callback
		* @private
		*/
		startLoop(cb) {
			this._loop = true;
			do
				switch (this._state) {
					case GET_INFO:
						this.getInfo(cb);
						break;
					case GET_PAYLOAD_LENGTH_16:
						this.getPayloadLength16(cb);
						break;
					case GET_PAYLOAD_LENGTH_64:
						this.getPayloadLength64(cb);
						break;
					case GET_MASK:
						this.getMask();
						break;
					case GET_DATA:
						this.getData(cb);
						break;
					case INFLATING:
					case DEFER_EVENT:
						this._loop = false;
						return;
				}
			while (this._loop);
			if (!this._errored) cb();
		}
		/**
		* Reads the first two bytes of a frame.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getInfo(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			const buf = this.consume(2);
			if ((buf[0] & 48) !== 0) {
				cb(this.createError(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3"));
				return;
			}
			const compressed = (buf[0] & 64) === 64;
			if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
				cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
				return;
			}
			this._fin = (buf[0] & 128) === 128;
			this._opcode = buf[0] & 15;
			this._payloadLength = buf[1] & 127;
			if (this._opcode === 0) {
				if (compressed) {
					cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
					return;
				}
				if (!this._fragmented) {
					cb(this.createError(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				this._opcode = this._fragmented;
			} else if (this._opcode === 1 || this._opcode === 2) {
				if (this._fragmented) {
					cb(this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				this._compressed = compressed;
			} else if (this._opcode > 7 && this._opcode < 11) {
				if (!this._fin) {
					cb(this.createError(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN"));
					return;
				}
				if (compressed) {
					cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
					return;
				}
				if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
					cb(this.createError(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"));
					return;
				}
			} else {
				cb(this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE"));
				return;
			}
			if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
			this._masked = (buf[1] & 128) === 128;
			if (this._isServer) {
				if (!this._masked) {
					cb(this.createError(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK"));
					return;
				}
			} else if (this._masked) {
				cb(this.createError(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK"));
				return;
			}
			if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
			else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
			else this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+16).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength16(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			this._payloadLength = this.consume(2).readUInt16BE(0);
			this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+64).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength64(cb) {
			if (this._bufferedBytes < 8) {
				this._loop = false;
				return;
			}
			const buf = this.consume(8);
			const num = buf.readUInt32BE(0);
			if (num > Math.pow(2, 21) - 1) {
				cb(this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"));
				return;
			}
			this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
			this.haveLength(cb);
		}
		/**
		* Payload length has been read.
		*
		* @param {Function} cb Callback
		* @private
		*/
		haveLength(cb) {
			if (this._payloadLength && this._opcode < 8) {
				this._totalPayloadLength += this._payloadLength;
				if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
					cb(this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
					return;
				}
			}
			if (this._masked) this._state = GET_MASK;
			else this._state = GET_DATA;
		}
		/**
		* Reads mask bytes.
		*
		* @private
		*/
		getMask() {
			if (this._bufferedBytes < 4) {
				this._loop = false;
				return;
			}
			this._mask = this.consume(4);
			this._state = GET_DATA;
		}
		/**
		* Reads data bytes.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getData(cb) {
			let data = EMPTY_BUFFER;
			if (this._payloadLength) {
				if (this._bufferedBytes < this._payloadLength) {
					this._loop = false;
					return;
				}
				data = this.consume(this._payloadLength);
				if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) unmask(data, this._mask);
			}
			if (this._opcode > 7) {
				this.controlMessage(data, cb);
				return;
			}
			if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
				cb(this.createError(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
				return;
			}
			if (this._compressed) {
				this._state = INFLATING;
				this.decompress(data, cb);
				return;
			}
			if (data.length) {
				this._messageLength = this._totalPayloadLength;
				this._fragments.push(data);
			}
			this.dataMessage(cb);
		}
		/**
		* Decompresses data.
		*
		* @param {Buffer} data Compressed data
		* @param {Function} cb Callback
		* @private
		*/
		decompress(data, cb) {
			this._extensions[PerMessageDeflate.extensionName].decompress(data, this._fin, (err, buf) => {
				if (err) return cb(err);
				if (buf.length) {
					this._messageLength += buf.length;
					if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
						cb(this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
						return;
					}
					this._fragments.push(buf);
				}
				this.dataMessage(cb);
				if (this._state === GET_INFO) this.startLoop(cb);
			});
		}
		/**
		* Handles a data message.
		*
		* @param {Function} cb Callback
		* @private
		*/
		dataMessage(cb) {
			if (!this._fin) {
				this._state = GET_INFO;
				return;
			}
			const messageLength = this._messageLength;
			const fragments = this._fragments;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._fragmented = 0;
			this._numFragments = 0;
			this._fragments = [];
			if (this._opcode === 2) {
				let data;
				if (this._binaryType === "nodebuffer") data = concat(fragments, messageLength);
				else if (this._binaryType === "arraybuffer") data = toArrayBuffer(concat(fragments, messageLength));
				else if (this._binaryType === "blob") data = new Blob(fragments);
				else data = fragments;
				if (this._allowSynchronousEvents) {
					this.emit("message", data, true);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", data, true);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			} else {
				const buf = concat(fragments, messageLength);
				if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
					cb(this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8"));
					return;
				}
				if (this._state === INFLATING || this._allowSynchronousEvents) {
					this.emit("message", buf, false);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", buf, false);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			}
		}
		/**
		* Handles a control message.
		*
		* @param {Buffer} data Data to handle
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		controlMessage(data, cb) {
			if (this._opcode === 8) {
				if (data.length === 0) {
					this._loop = false;
					this.emit("conclude", 1005, EMPTY_BUFFER);
					this.end();
				} else {
					const code = data.readUInt16BE(0);
					if (!isValidStatusCode(code)) {
						cb(this.createError(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE"));
						return;
					}
					const buf = new FastBuffer(data.buffer, data.byteOffset + 2, data.length - 2);
					if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
						cb(this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8"));
						return;
					}
					this._loop = false;
					this.emit("conclude", code, buf);
					this.end();
				}
				this._state = GET_INFO;
				return;
			}
			if (this._allowSynchronousEvents) {
				this.emit(this._opcode === 9 ? "ping" : "pong", data);
				this._state = GET_INFO;
			} else {
				this._state = DEFER_EVENT;
				setImmediate(() => {
					this.emit(this._opcode === 9 ? "ping" : "pong", data);
					this._state = GET_INFO;
					this.startLoop(cb);
				});
			}
		}
		/**
		* Builds an error object.
		*
		* @param {function(new:Error|RangeError)} ErrorCtor The error constructor
		* @param {String} message The error message
		* @param {Boolean} prefix Specifies whether or not to add a default prefix to
		*     `message`
		* @param {Number} statusCode The status code
		* @param {String} errorCode The exposed error code
		* @return {(Error|RangeError)} The error
		* @private
		*/
		createError(ErrorCtor, message, prefix, statusCode, errorCode) {
			this._loop = false;
			this._errored = true;
			const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
			Error.captureStackTrace(err, this.createError);
			err.code = errorCode;
			err[kStatusCode] = statusCode;
			return err;
		}
	};
	module.exports = Receiver;
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/sender.js
var require_sender = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { Duplex: Duplex$3 } = __require("stream");
	const { randomFillSync } = __require("crypto");
	const { types: { isUint8Array } } = __require("util");
	const PerMessageDeflate = require_permessage_deflate();
	const { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
	const { isBlob, isValidStatusCode } = require_validation();
	const { mask: applyMask, toBuffer } = require_buffer_util();
	const kByteLength = Symbol("kByteLength");
	const maskBuffer = Buffer.alloc(4);
	const RANDOM_POOL_SIZE = 8192;
	let randomPool;
	let randomPoolPointer = RANDOM_POOL_SIZE;
	const DEFAULT = 0;
	const DEFLATING = 1;
	const GET_BLOB_DATA = 2;
	module.exports = class Sender {
		/**
		* Creates a Sender instance.
		*
		* @param {Duplex} socket The connection socket
		* @param {Object} [extensions] An object containing the negotiated extensions
		* @param {Function} [generateMask] The function used to generate the masking
		*     key
		*/
		constructor(socket, extensions, generateMask) {
			this._extensions = extensions || {};
			if (generateMask) {
				this._generateMask = generateMask;
				this._maskBuffer = Buffer.alloc(4);
			}
			this._socket = socket;
			this._firstFragment = true;
			this._compress = false;
			this._bufferedBytes = 0;
			this._queue = [];
			this._state = DEFAULT;
			this.onerror = NOOP;
			this[kWebSocket] = void 0;
		}
		/**
		* Frames a piece of data according to the HyBi WebSocket protocol.
		*
		* @param {(Buffer|String)} data The data to frame
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @return {(Buffer|String)[]} The framed data
		* @public
		*/
		static frame(data, options) {
			let mask;
			let merge = false;
			let offset = 2;
			let skipMasking = false;
			if (options.mask) {
				mask = options.maskBuffer || maskBuffer;
				if (options.generateMask) options.generateMask(mask);
				else {
					if (randomPoolPointer === RANDOM_POOL_SIZE) {
						/* istanbul ignore else  */
						if (randomPool === void 0) randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
						randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
						randomPoolPointer = 0;
					}
					mask[0] = randomPool[randomPoolPointer++];
					mask[1] = randomPool[randomPoolPointer++];
					mask[2] = randomPool[randomPoolPointer++];
					mask[3] = randomPool[randomPoolPointer++];
				}
				skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
				offset = 6;
			}
			let dataLength;
			if (typeof data === "string") {
				if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) dataLength = options[kByteLength];
				else {
					data = Buffer.from(data);
					dataLength = data.length;
				}
			} else {
				dataLength = data.length;
				merge = options.mask && options.readOnly && !skipMasking;
			}
			let payloadLength = dataLength;
			if (dataLength >= 65536) {
				offset += 8;
				payloadLength = 127;
			} else if (dataLength > 125) {
				offset += 2;
				payloadLength = 126;
			}
			const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
			target[0] = options.fin ? options.opcode | 128 : options.opcode;
			if (options.rsv1) target[0] |= 64;
			target[1] = payloadLength;
			if (payloadLength === 126) target.writeUInt16BE(dataLength, 2);
			else if (payloadLength === 127) {
				target[2] = target[3] = 0;
				target.writeUIntBE(dataLength, 4, 6);
			}
			if (!options.mask) return [target, data];
			target[1] |= 128;
			target[offset - 4] = mask[0];
			target[offset - 3] = mask[1];
			target[offset - 2] = mask[2];
			target[offset - 1] = mask[3];
			if (skipMasking) return [target, data];
			if (merge) {
				applyMask(data, mask, target, offset, dataLength);
				return [target];
			}
			applyMask(data, mask, data, 0, dataLength);
			return [target, data];
		}
		/**
		* Sends a close message to the other peer.
		*
		* @param {Number} [code] The status code component of the body
		* @param {(String|Buffer)} [data] The message component of the body
		* @param {Boolean} [mask=false] Specifies whether or not to mask the message
		* @param {Function} [cb] Callback
		* @public
		*/
		close(code, data, mask, cb) {
			let buf;
			if (code === void 0) buf = EMPTY_BUFFER;
			else if (typeof code !== "number" || !isValidStatusCode(code)) throw new TypeError("First argument must be a valid error code number");
			else if (data === void 0 || !data.length) {
				buf = Buffer.allocUnsafe(2);
				buf.writeUInt16BE(code, 0);
			} else {
				const length = Buffer.byteLength(data);
				if (length > 123) throw new RangeError("The message must not be greater than 123 bytes");
				buf = Buffer.allocUnsafe(2 + length);
				buf.writeUInt16BE(code, 0);
				if (typeof data === "string") buf.write(data, 2);
				else if (isUint8Array(data)) buf.set(data, 2);
				else throw new TypeError("Second argument must be a string or a Uint8Array");
			}
			const options = {
				[kByteLength]: buf.length,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 8,
				readOnly: false,
				rsv1: false
			};
			if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				buf,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(buf, options), cb);
		}
		/**
		* Sends a ping message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		ping(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 9,
				readOnly,
				rsv1: false
			};
			if (isBlob(data)) {
				if (this._state !== DEFAULT) this.enqueue([
					this.getBlobData,
					data,
					false,
					options,
					cb
				]);
				else this.getBlobData(data, false, options, cb);
			} else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(data, options), cb);
		}
		/**
		* Sends a pong message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		pong(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 10,
				readOnly,
				rsv1: false
			};
			if (isBlob(data)) {
				if (this._state !== DEFAULT) this.enqueue([
					this.getBlobData,
					data,
					false,
					options,
					cb
				]);
				else this.getBlobData(data, false, options, cb);
			} else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(data, options), cb);
		}
		/**
		* Sends a data message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Object} options Options object
		* @param {Boolean} [options.binary=false] Specifies whether `data` is binary
		*     or text
		* @param {Boolean} [options.compress=false] Specifies whether or not to
		*     compress `data`
		* @param {Boolean} [options.fin=false] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		send(data, options, cb) {
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			let opcode = options.binary ? 2 : 1;
			let rsv1 = options.compress;
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (this._firstFragment) {
				this._firstFragment = false;
				if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) rsv1 = byteLength >= perMessageDeflate._threshold;
				this._compress = rsv1;
			} else {
				rsv1 = false;
				opcode = 0;
			}
			if (options.fin) this._firstFragment = true;
			const opts = {
				[kByteLength]: byteLength,
				fin: options.fin,
				generateMask: this._generateMask,
				mask: options.mask,
				maskBuffer: this._maskBuffer,
				opcode,
				readOnly,
				rsv1
			};
			if (isBlob(data)) {
				if (this._state !== DEFAULT) this.enqueue([
					this.getBlobData,
					data,
					this._compress,
					opts,
					cb
				]);
				else this.getBlobData(data, this._compress, opts, cb);
			} else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				this._compress,
				opts,
				cb
			]);
			else this.dispatch(data, this._compress, opts, cb);
		}
		/**
		* Gets the contents of a blob as binary data.
		*
		* @param {Blob} blob The blob
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     the data
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		getBlobData(blob, compress, options, cb) {
			this._bufferedBytes += options[kByteLength];
			this._state = GET_BLOB_DATA;
			blob.arrayBuffer().then((arrayBuffer) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while the blob was being read");
					process.nextTick(callCallbacks, this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				const data = toBuffer(arrayBuffer);
				if (!compress) {
					this._state = DEFAULT;
					this.sendFrame(Sender.frame(data, options), cb);
					this.dequeue();
				} else this.dispatch(data, compress, options, cb);
			}).catch((err) => {
				process.nextTick(onError, this, err, cb);
			});
		}
		/**
		* Dispatches a message.
		*
		* @param {(Buffer|String)} data The message to send
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     `data`
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		dispatch(data, compress, options, cb) {
			if (!compress) {
				this.sendFrame(Sender.frame(data, options), cb);
				return;
			}
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			this._bufferedBytes += options[kByteLength];
			this._state = DEFLATING;
			perMessageDeflate.compress(data, options.fin, (_, buf) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while data was being compressed");
					callCallbacks(this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				this._state = DEFAULT;
				options.readOnly = false;
				this.sendFrame(Sender.frame(buf, options), cb);
				this.dequeue();
			});
		}
		/**
		* Executes queued send operations.
		*
		* @private
		*/
		dequeue() {
			while (this._state === DEFAULT && this._queue.length) {
				const params = this._queue.shift();
				this._bufferedBytes -= params[3][kByteLength];
				Reflect.apply(params[0], this, params.slice(1));
			}
		}
		/**
		* Enqueues a send operation.
		*
		* @param {Array} params Send operation parameters.
		* @private
		*/
		enqueue(params) {
			this._bufferedBytes += params[3][kByteLength];
			this._queue.push(params);
		}
		/**
		* Sends a frame.
		*
		* @param {(Buffer | String)[]} list The frame to send
		* @param {Function} [cb] Callback
		* @private
		*/
		sendFrame(list, cb) {
			if (list.length === 2) {
				this._socket.cork();
				this._socket.write(list[0]);
				this._socket.write(list[1], cb);
				this._socket.uncork();
			} else this._socket.write(list[0], cb);
		}
	};
	/**
	* Calls queued callbacks with an error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error to call the callbacks with
	* @param {Function} [cb] The first callback
	* @private
	*/
	function callCallbacks(sender, err, cb) {
		if (typeof cb === "function") cb(err);
		for (let i = 0; i < sender._queue.length; i++) {
			const params = sender._queue[i];
			const callback = params[params.length - 1];
			if (typeof callback === "function") callback(err);
		}
	}
	/**
	* Handles a `Sender` error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error
	* @param {Function} [cb] The first pending callback
	* @private
	*/
	function onError(sender, err, cb) {
		callCallbacks(sender, err, cb);
		sender.onerror(err);
	}
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/event-target.js
var require_event_target = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { kForOnEventAttribute, kListener } = require_constants();
	const kCode = Symbol("kCode");
	const kData = Symbol("kData");
	const kError = Symbol("kError");
	const kMessage = Symbol("kMessage");
	const kReason = Symbol("kReason");
	const kTarget = Symbol("kTarget");
	const kType = Symbol("kType");
	const kWasClean = Symbol("kWasClean");
	/**
	* Class representing an event.
	*/
	var Event = class {
		/**
		* Create a new `Event`.
		*
		* @param {String} type The name of the event
		* @throws {TypeError} If the `type` argument is not specified
		*/
		constructor(type) {
			this[kTarget] = null;
			this[kType] = type;
		}
		/**
		* @type {*}
		*/
		get target() {
			return this[kTarget];
		}
		/**
		* @type {String}
		*/
		get type() {
			return this[kType];
		}
	};
	Object.defineProperty(Event.prototype, "target", { enumerable: true });
	Object.defineProperty(Event.prototype, "type", { enumerable: true });
	/**
	* Class representing a close event.
	*
	* @extends Event
	*/
	var CloseEvent = class extends Event {
		/**
		* Create a new `CloseEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {Number} [options.code=0] The status code explaining why the
		*     connection was closed
		* @param {String} [options.reason=''] A human-readable string explaining why
		*     the connection was closed
		* @param {Boolean} [options.wasClean=false] Indicates whether or not the
		*     connection was cleanly closed
		*/
		constructor(type, options = {}) {
			super(type);
			this[kCode] = options.code === void 0 ? 0 : options.code;
			this[kReason] = options.reason === void 0 ? "" : options.reason;
			this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
		}
		/**
		* @type {Number}
		*/
		get code() {
			return this[kCode];
		}
		/**
		* @type {String}
		*/
		get reason() {
			return this[kReason];
		}
		/**
		* @type {Boolean}
		*/
		get wasClean() {
			return this[kWasClean];
		}
	};
	Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
	/**
	* Class representing an error event.
	*
	* @extends Event
	*/
	var ErrorEvent = class extends Event {
		/**
		* Create a new `ErrorEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.error=null] The error that generated this event
		* @param {String} [options.message=''] The error message
		*/
		constructor(type, options = {}) {
			super(type);
			this[kError] = options.error === void 0 ? null : options.error;
			this[kMessage] = options.message === void 0 ? "" : options.message;
		}
		/**
		* @type {*}
		*/
		get error() {
			return this[kError];
		}
		/**
		* @type {String}
		*/
		get message() {
			return this[kMessage];
		}
	};
	Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
	/**
	* Class representing a message event.
	*
	* @extends Event
	*/
	var MessageEvent = class extends Event {
		/**
		* Create a new `MessageEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.data=null] The message content
		*/
		constructor(type, options = {}) {
			super(type);
			this[kData] = options.data === void 0 ? null : options.data;
		}
		/**
		* @type {*}
		*/
		get data() {
			return this[kData];
		}
	};
	Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
	module.exports = {
		CloseEvent,
		ErrorEvent,
		Event,
		EventTarget: {
			/**
			* Register an event listener.
			*
			* @param {String} type A string representing the event type to listen for
			* @param {(Function|Object)} handler The listener to add
			* @param {Object} [options] An options object specifies characteristics about
			*     the event listener
			* @param {Boolean} [options.once=false] A `Boolean` indicating that the
			*     listener should be invoked at most once after being added. If `true`,
			*     the listener would be automatically removed when invoked.
			* @public
			*/
			addEventListener(type, handler, options = {}) {
				for (const listener of this.listeners(type)) if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) return;
				let wrapper;
				if (type === "message") wrapper = function onMessage(data, isBinary) {
					const event = new MessageEvent("message", { data: isBinary ? data : data.toString() });
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "close") wrapper = function onClose(code, message) {
					const event = new CloseEvent("close", {
						code,
						reason: message.toString(),
						wasClean: this._closeFrameReceived && this._closeFrameSent
					});
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "error") wrapper = function onError(error) {
					const event = new ErrorEvent("error", {
						error,
						message: error.message
					});
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "open") wrapper = function onOpen() {
					const event = new Event("open");
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else return;
				wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
				wrapper[kListener] = handler;
				if (options.once) this.once(type, wrapper);
				else this.on(type, wrapper);
			},
			/**
			* Remove an event listener.
			*
			* @param {String} type A string representing the event type to remove
			* @param {(Function|Object)} handler The listener to remove
			* @public
			*/
			removeEventListener(type, handler) {
				for (const listener of this.listeners(type)) if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
					this.removeListener(type, listener);
					break;
				}
			}
		},
		MessageEvent
	};
	/**
	* Call an event listener
	*
	* @param {(Function|Object)} listener The listener to call
	* @param {*} thisArg The value to use as `this`` when calling the listener
	* @param {Event} event The event to pass to the listener
	* @private
	*/
	function callListener(listener, thisArg, event) {
		if (typeof listener === "object" && listener.handleEvent) listener.handleEvent.call(listener, event);
		else listener.call(thisArg, event);
	}
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/extension.js
var require_extension = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { tokenChars } = require_validation();
	/**
	* Adds an offer to the map of extension offers or a parameter to the map of
	* parameters.
	*
	* @param {Object} dest The map of extension offers or parameters
	* @param {String} name The extension or parameter name
	* @param {(Object|Boolean|String)} elem The extension parameters or the
	*     parameter value
	* @private
	*/
	function push(dest, name, elem) {
		if (dest[name] === void 0) dest[name] = [elem];
		else dest[name].push(elem);
	}
	/**
	* Parses the `Sec-WebSocket-Extensions` header into an object.
	*
	* @param {String} header The field value of the header
	* @return {Object} The parsed object
	* @public
	*/
	function parse(header) {
		const offers = Object.create(null);
		let params = Object.create(null);
		let mustUnescape = false;
		let isEscaping = false;
		let inQuotes = false;
		let extensionName;
		let paramName;
		let start = -1;
		let code = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			code = header.charCodeAt(i);
			if (extensionName === void 0) {
				if (end === -1 && tokenChars[code] === 1) {
					if (start === -1) start = i;
				} else if (i !== 0 && (code === 32 || code === 9)) {
					if (end === -1 && start !== -1) end = i;
				} else if (code === 59 || code === 44) {
					if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
					if (end === -1) end = i;
					const name = header.slice(start, end);
					if (code === 44) {
						push(offers, name, params);
						params = Object.create(null);
					} else extensionName = name;
					start = end = -1;
				} else throw new SyntaxError(`Unexpected character at index ${i}`);
			} else if (paramName === void 0) {
				if (end === -1 && tokenChars[code] === 1) {
					if (start === -1) start = i;
				} else if (code === 32 || code === 9) {
					if (end === -1 && start !== -1) end = i;
				} else if (code === 59 || code === 44) {
					if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
					if (end === -1) end = i;
					push(params, header.slice(start, end), true);
					if (code === 44) {
						push(offers, extensionName, params);
						params = Object.create(null);
						extensionName = void 0;
					}
					start = end = -1;
				} else if (code === 61 && start !== -1 && end === -1) {
					paramName = header.slice(start, i);
					start = end = -1;
				} else throw new SyntaxError(`Unexpected character at index ${i}`);
			} else if (isEscaping) {
				if (tokenChars[code] !== 1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (start === -1) start = i;
				else if (!mustUnescape) mustUnescape = true;
				isEscaping = false;
			} else if (inQuotes) {
				if (tokenChars[code] === 1) {
					if (start === -1) start = i;
				} else if (code === 34 && start !== -1) {
					inQuotes = false;
					end = i;
				} else if (code === 92) isEscaping = true;
				else throw new SyntaxError(`Unexpected character at index ${i}`);
			} else if (code === 34 && header.charCodeAt(i - 1) === 61) inQuotes = true;
			else if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (start !== -1 && (code === 32 || code === 9)) {
				if (end === -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				let value = header.slice(start, end);
				if (mustUnescape) {
					value = value.replace(/\\/g, "");
					mustUnescape = false;
				}
				push(params, paramName, value);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				paramName = void 0;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || inQuotes || code === 32 || code === 9) throw new SyntaxError("Unexpected end of input");
		if (end === -1) end = i;
		const token = header.slice(start, end);
		if (extensionName === void 0) push(offers, token, params);
		else {
			if (paramName === void 0) push(params, token, true);
			else if (mustUnescape) push(params, paramName, token.replace(/\\/g, ""));
			else push(params, paramName, token);
			push(offers, extensionName, params);
		}
		return offers;
	}
	/**
	* Builds the `Sec-WebSocket-Extensions` header field value.
	*
	* @param {Object} extensions The map of extensions and parameters to format
	* @return {String} A string representing the given object
	* @public
	*/
	function format(extensions) {
		return Object.keys(extensions).map((extension) => {
			let configurations = extensions[extension];
			if (!Array.isArray(configurations)) configurations = [configurations];
			return configurations.map((params) => {
				return [extension].concat(Object.keys(params).map((k) => {
					let values = params[k];
					if (!Array.isArray(values)) values = [values];
					return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
				})).join("; ");
			}).join(", ");
		}).join(", ");
	}
	module.exports = {
		format,
		parse
	};
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/websocket.js
var require_websocket = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const EventEmitter$1 = __require("events");
	const https = __require("https");
	const http$1 = __require("http");
	const net = __require("net");
	const tls = __require("tls");
	const { randomBytes, createHash: createHash$1 } = __require("crypto");
	const { Duplex: Duplex$2, Readable } = __require("stream");
	const { URL: URL$1 } = __require("url");
	const PerMessageDeflate = require_permessage_deflate();
	const Receiver = require_receiver();
	const Sender = require_sender();
	const { isBlob } = require_validation();
	const { BINARY_TYPES, CLOSE_TIMEOUT, EMPTY_BUFFER, GUID, kForOnEventAttribute, kListener, kStatusCode, kWebSocket, NOOP } = require_constants();
	const { EventTarget: { addEventListener, removeEventListener } } = require_event_target();
	const { format, parse } = require_extension();
	const { toBuffer } = require_buffer_util();
	const kAborted = Symbol("kAborted");
	const protocolVersions = [8, 13];
	const readyStates = [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	];
	const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
	/**
	* Class representing a WebSocket.
	*
	* @extends EventEmitter
	*/
	var WebSocket = class WebSocket extends EventEmitter$1 {
		/**
		* Create a new `WebSocket`.
		*
		* @param {(String|URL)} address The URL to which to connect
		* @param {(String|String[])} [protocols] The subprotocols
		* @param {Object} [options] Connection options
		*/
		constructor(address, protocols, options) {
			super();
			this._binaryType = BINARY_TYPES[0];
			this._closeCode = 1006;
			this._closeFrameReceived = false;
			this._closeFrameSent = false;
			this._closeMessage = EMPTY_BUFFER;
			this._closeTimer = null;
			this._errorEmitted = false;
			this._extensions = {};
			this._paused = false;
			this._protocol = "";
			this._readyState = WebSocket.CONNECTING;
			this._receiver = null;
			this._sender = null;
			this._socket = null;
			if (address !== null) {
				this._bufferedAmount = 0;
				this._isServer = false;
				this._redirects = 0;
				if (protocols === void 0) {
					if (!options || options.protocols === void 0) protocols = [];
					else if (Array.isArray(options.protocols)) protocols = options.protocols;
					else protocols = [options.protocols];
				} else if (!Array.isArray(protocols)) {
					if (typeof protocols === "object" && protocols !== null) {
						options = protocols;
						if (options.protocols === void 0) protocols = [];
						else if (Array.isArray(options.protocols)) protocols = options.protocols;
						else protocols = [options.protocols];
					} else protocols = [protocols];
				}
				initAsClient(this, address, protocols, options);
			} else {
				this._autoPong = options.autoPong;
				this._closeTimeout = options.closeTimeout;
				this._isServer = true;
			}
		}
		/**
		* For historical reasons, the custom "nodebuffer" type is used by the default
		* instead of "blob".
		*
		* @type {String}
		*/
		get binaryType() {
			return this._binaryType;
		}
		set binaryType(type) {
			if (!BINARY_TYPES.includes(type)) return;
			this._binaryType = type;
			if (this._receiver) this._receiver._binaryType = type;
		}
		/**
		* @type {Number}
		*/
		get bufferedAmount() {
			if (!this._socket) return this._bufferedAmount;
			return this._socket._writableState.length + this._sender._bufferedBytes;
		}
		/**
		* @type {String}
		*/
		get extensions() {
			return Object.keys(this._extensions).join();
		}
		/**
		* @type {Boolean}
		*/
		get isPaused() {
			return this._paused;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onclose() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onerror() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onopen() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onmessage() {
			return null;
		}
		/**
		* @type {String}
		*/
		get protocol() {
			return this._protocol;
		}
		/**
		* @type {Number}
		*/
		get readyState() {
			return this._readyState;
		}
		/**
		* @type {String}
		*/
		get url() {
			return this._url;
		}
		/**
		* Set up the socket and the internal resources.
		*
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Object} options Options object
		* @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Number} [options.maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=0] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=0] The maximum allowed message size
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @private
		*/
		setSocket(socket, head, options) {
			const receiver = new Receiver({
				allowSynchronousEvents: options.allowSynchronousEvents,
				binaryType: this.binaryType,
				extensions: this._extensions,
				isServer: this._isServer,
				maxBufferedChunks: options.maxBufferedChunks,
				maxFragments: options.maxFragments,
				maxPayload: options.maxPayload,
				skipUTF8Validation: options.skipUTF8Validation
			});
			const sender = new Sender(socket, this._extensions, options.generateMask);
			this._receiver = receiver;
			this._sender = sender;
			this._socket = socket;
			receiver[kWebSocket] = this;
			sender[kWebSocket] = this;
			socket[kWebSocket] = this;
			receiver.on("conclude", receiverOnConclude);
			receiver.on("drain", receiverOnDrain);
			receiver.on("error", receiverOnError);
			receiver.on("message", receiverOnMessage);
			receiver.on("ping", receiverOnPing);
			receiver.on("pong", receiverOnPong);
			sender.onerror = senderOnError;
			if (socket.setTimeout) socket.setTimeout(0);
			if (socket.setNoDelay) socket.setNoDelay();
			if (head.length > 0) socket.unshift(head);
			socket.on("close", socketOnClose);
			socket.on("data", socketOnData);
			socket.on("end", socketOnEnd);
			socket.on("error", socketOnError);
			this._readyState = WebSocket.OPEN;
			this.emit("open");
		}
		/**
		* Emit the `'close'` event.
		*
		* @private
		*/
		emitClose() {
			if (!this._socket) {
				this._readyState = WebSocket.CLOSED;
				this.emit("close", this._closeCode, this._closeMessage);
				return;
			}
			if (this._extensions[PerMessageDeflate.extensionName]) this._extensions[PerMessageDeflate.extensionName].cleanup();
			this._receiver.removeAllListeners();
			this._readyState = WebSocket.CLOSED;
			this.emit("close", this._closeCode, this._closeMessage);
		}
		/**
		* Start a closing handshake.
		*
		*          +----------+   +-----------+   +----------+
		*     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
		*    |     +----------+   +-----------+   +----------+     |
		*          +----------+   +-----------+         |
		* CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
		*          +----------+   +-----------+   |
		*    |           |                        |   +---+        |
		*                +------------------------+-->|fin| - - - -
		*    |         +---+                      |   +---+
		*     - - - - -|fin|<---------------------+
		*              +---+
		*
		* @param {Number} [code] Status code explaining why the connection is closing
		* @param {(String|Buffer)} [data] The reason why the connection is
		*     closing
		* @public
		*/
		close(code, data) {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) {
				abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
				return;
			}
			if (this.readyState === WebSocket.CLOSING) {
				if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
				return;
			}
			this._sender.close(code, data, !this._isServer, (err) => {
				if (err) return;
				this._closeFrameSent = true;
				if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end();
			});
			this._readyState = WebSocket.CLOSING;
			setCloseTimer(this);
		}
		/**
		* Pause the socket.
		*
		* @public
		*/
		pause() {
			if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) return;
			this._paused = true;
			this._socket.pause();
		}
		/**
		* Send a ping.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the ping is sent
		* @public
		*/
		ping(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.ping(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a pong.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the pong is sent
		* @public
		*/
		pong(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.pong(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Resume the socket.
		*
		* @public
		*/
		resume() {
			if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) return;
			this._paused = false;
			if (!this._receiver._writableState.needDrain) this._socket.resume();
		}
		/**
		* Send a data message.
		*
		* @param {*} data The message to send
		* @param {Object} [options] Options object
		* @param {Boolean} [options.binary] Specifies whether `data` is binary or
		*     text
		* @param {Boolean} [options.compress] Specifies whether or not to compress
		*     `data`
		* @param {Boolean} [options.fin=true] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when data is written out
		* @public
		*/
		send(data, options, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof options === "function") {
				cb = options;
				options = {};
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			const opts = {
				binary: typeof data !== "string",
				mask: !this._isServer,
				compress: true,
				fin: true,
				...options
			};
			if (!this._extensions[PerMessageDeflate.extensionName]) opts.compress = false;
			this._sender.send(data || EMPTY_BUFFER, opts, cb);
		}
		/**
		* Forcibly close the connection.
		*
		* @public
		*/
		terminate() {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) {
				abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
				return;
			}
			if (this._socket) {
				this._readyState = WebSocket.CLOSING;
				this._socket.destroy();
			}
		}
	};
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	[
		"binaryType",
		"bufferedAmount",
		"extensions",
		"isPaused",
		"protocol",
		"readyState",
		"url"
	].forEach((property) => {
		Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});
	[
		"open",
		"error",
		"close",
		"message"
	].forEach((method) => {
		Object.defineProperty(WebSocket.prototype, `on${method}`, {
			enumerable: true,
			get() {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) return listener[kListener];
				return null;
			},
			set(handler) {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) {
					this.removeListener(method, listener);
					break;
				}
				if (typeof handler !== "function") return;
				this.addEventListener(method, handler, { [kForOnEventAttribute]: true });
			}
		});
	});
	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;
	module.exports = WebSocket;
	/**
	* Initialize a WebSocket client.
	*
	* @param {WebSocket} websocket The client to initialize
	* @param {(String|URL)} address The URL to which to connect
	* @param {Array} protocols The subprotocols
	* @param {Object} [options] Connection options
	* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
	*     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
	*     times in the same tick
	* @param {Boolean} [options.autoPong=true] Specifies whether or not to
	*     automatically send a pong in response to a ping
	* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to wait
	*     for the closing handshake to finish after `websocket.close()` is called
	* @param {Function} [options.finishRequest] A function which can be used to
	*     customize the headers of each http request before it is sent
	* @param {Boolean} [options.followRedirects=false] Whether or not to follow
	*     redirects
	* @param {Function} [options.generateMask] The function used to generate the
	*     masking key
	* @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	*     handshake request
	* @param {Number} [options.maxBufferedChunks=262144] The maximum number of
	*     buffered data chunks
	* @param {Number} [options.maxFragments=16384] The maximum number of message
	*     fragments
	* @param {Number} [options.maxPayload=104857600] The maximum allowed message
	*     size
	* @param {Number} [options.maxRedirects=10] The maximum number of redirects
	*     allowed
	* @param {String} [options.origin] Value of the `Origin` or
	*     `Sec-WebSocket-Origin` header
	* @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	*     permessage-deflate
	* @param {Number} [options.protocolVersion=13] Value of the
	*     `Sec-WebSocket-Version` header
	* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	*     not to skip UTF-8 validation for text and close messages
	* @private
	*/
	function initAsClient(websocket, address, protocols, options) {
		const opts = {
			allowSynchronousEvents: true,
			autoPong: true,
			closeTimeout: CLOSE_TIMEOUT,
			protocolVersion: protocolVersions[1],
			maxBufferedChunks: 262144,
			maxFragments: 16384,
			maxPayload: 104857600,
			skipUTF8Validation: false,
			perMessageDeflate: true,
			followRedirects: false,
			maxRedirects: 10,
			...options,
			socketPath: void 0,
			hostname: void 0,
			protocol: void 0,
			protocols: void 0,
			timeout: void 0,
			method: "GET",
			host: void 0,
			path: void 0,
			port: void 0
		};
		websocket._autoPong = opts.autoPong;
		websocket._closeTimeout = opts.closeTimeout;
		if (!protocolVersions.includes(opts.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
		let parsedUrl;
		if (address instanceof URL$1) parsedUrl = address;
		else try {
			parsedUrl = new URL$1(address);
		} catch {
			throw new SyntaxError(`Invalid URL: ${address}`);
		}
		if (parsedUrl.protocol === "http:") parsedUrl.protocol = "ws:";
		else if (parsedUrl.protocol === "https:") parsedUrl.protocol = "wss:";
		websocket._url = parsedUrl.href;
		const isSecure = parsedUrl.protocol === "wss:";
		const isIpcUrl = parsedUrl.protocol === "ws+unix:";
		let invalidUrlMessage;
		if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) invalidUrlMessage = "The URL's protocol must be one of \"ws:\", \"wss:\", \"http:\", \"https:\", or \"ws+unix:\"";
		else if (isIpcUrl && !parsedUrl.pathname) invalidUrlMessage = "The URL's pathname is empty";
		else if (parsedUrl.hash) invalidUrlMessage = "The URL contains a fragment identifier";
		if (invalidUrlMessage) {
			const err = new SyntaxError(invalidUrlMessage);
			if (websocket._redirects === 0) throw err;
			else {
				emitErrorAndClose(websocket, err);
				return;
			}
		}
		const defaultPort = isSecure ? 443 : 80;
		const key = randomBytes(16).toString("base64");
		const request = isSecure ? https.request : http$1.request;
		const protocolSet = /* @__PURE__ */ new Set();
		let perMessageDeflate;
		opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
		opts.defaultPort = opts.defaultPort || defaultPort;
		opts.port = parsedUrl.port || defaultPort;
		opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
		opts.headers = {
			...opts.headers,
			"Sec-WebSocket-Version": opts.protocolVersion,
			"Sec-WebSocket-Key": key,
			Connection: "Upgrade",
			Upgrade: "websocket"
		};
		opts.path = parsedUrl.pathname + parsedUrl.search;
		opts.timeout = opts.handshakeTimeout;
		if (opts.perMessageDeflate) {
			perMessageDeflate = new PerMessageDeflate({
				...opts.perMessageDeflate,
				isServer: false,
				maxPayload: opts.maxPayload
			});
			opts.headers["Sec-WebSocket-Extensions"] = format({ [PerMessageDeflate.extensionName]: perMessageDeflate.offer() });
		}
		if (protocols.length) {
			for (const protocol of protocols) {
				if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) throw new SyntaxError("An invalid or duplicated subprotocol was specified");
				protocolSet.add(protocol);
			}
			opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
		}
		if (opts.origin) {
			if (opts.protocolVersion < 13) opts.headers["Sec-WebSocket-Origin"] = opts.origin;
			else opts.headers.Origin = opts.origin;
		}
		if (parsedUrl.username || parsedUrl.password) opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
		if (isIpcUrl) {
			const parts = opts.path.split(":");
			opts.socketPath = parts[0];
			opts.path = parts[1];
		}
		let req;
		if (opts.followRedirects) {
			if (websocket._redirects === 0) {
				websocket._originalIpc = isIpcUrl;
				websocket._originalSecure = isSecure;
				websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
				const headers = options && options.headers;
				options = {
					...options,
					headers: {}
				};
				if (headers) for (const [key, value] of Object.entries(headers)) options.headers[key.toLowerCase()] = value;
			} else if (websocket.listenerCount("redirect") === 0) {
				const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
				if (!isSameHost || websocket._originalSecure && !isSecure) {
					delete opts.headers.authorization;
					delete opts.headers.cookie;
					if (!isSameHost) delete opts.headers.host;
					opts.auth = void 0;
				}
			}
			if (opts.auth && !options.headers.authorization) options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
			req = websocket._req = request(opts);
			if (websocket._redirects) websocket.emit("redirect", websocket.url, req);
		} else req = websocket._req = request(opts);
		if (opts.timeout) req.on("timeout", () => {
			abortHandshake(websocket, req, "Opening handshake has timed out");
		});
		req.on("error", (err) => {
			if (req === null || req[kAborted]) return;
			req = websocket._req = null;
			emitErrorAndClose(websocket, err);
		});
		req.on("response", (res) => {
			const location = res.headers.location;
			const statusCode = res.statusCode;
			if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
				if (++websocket._redirects > opts.maxRedirects) {
					abortHandshake(websocket, req, "Maximum redirects exceeded");
					return;
				}
				req.abort();
				let addr;
				try {
					addr = new URL$1(location, address);
				} catch (e) {
					emitErrorAndClose(websocket, /* @__PURE__ */ new SyntaxError(`Invalid URL: ${location}`));
					return;
				}
				initAsClient(websocket, addr, protocols, options);
			} else if (!websocket.emit("unexpected-response", req, res)) abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
		});
		req.on("upgrade", (res, socket, head) => {
			websocket.emit("upgrade", res);
			if (websocket.readyState !== WebSocket.CONNECTING) return;
			req = websocket._req = null;
			const upgrade = res.headers.upgrade;
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshake(websocket, socket, "Invalid Upgrade header");
				return;
			}
			const digest = createHash$1("sha1").update(key + GUID).digest("base64");
			if (res.headers["sec-websocket-accept"] !== digest) {
				abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
				return;
			}
			const serverProt = res.headers["sec-websocket-protocol"];
			let protError;
			if (serverProt !== void 0) {
				if (!protocolSet.size) protError = "Server sent a subprotocol but none was requested";
				else if (!protocolSet.has(serverProt)) protError = "Server sent an invalid subprotocol";
			} else if (protocolSet.size) protError = "Server sent no subprotocol";
			if (protError) {
				abortHandshake(websocket, socket, protError);
				return;
			}
			if (serverProt) websocket._protocol = serverProt;
			const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
			if (secWebSocketExtensions !== void 0) {
				if (!perMessageDeflate) {
					abortHandshake(websocket, socket, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
					return;
				}
				let extensions;
				try {
					extensions = parse(secWebSocketExtensions);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				const extensionNames = Object.keys(extensions);
				if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
					abortHandshake(websocket, socket, "Server indicated an extension that was not requested");
					return;
				}
				try {
					perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
			}
			websocket.setSocket(socket, head, {
				allowSynchronousEvents: opts.allowSynchronousEvents,
				generateMask: opts.generateMask,
				maxBufferedChunks: opts.maxBufferedChunks,
				maxFragments: opts.maxFragments,
				maxPayload: opts.maxPayload,
				skipUTF8Validation: opts.skipUTF8Validation
			});
		});
		if (opts.finishRequest) opts.finishRequest(req, websocket);
		else req.end();
	}
	/**
	* Emit the `'error'` and `'close'` events.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {Error} The error to emit
	* @private
	*/
	function emitErrorAndClose(websocket, err) {
		websocket._readyState = WebSocket.CLOSING;
		websocket._errorEmitted = true;
		websocket.emit("error", err);
		websocket.emitClose();
	}
	/**
	* Create a `net.Socket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {net.Socket} The newly created socket used to start the connection
	* @private
	*/
	function netConnect(options) {
		options.path = options.socketPath;
		return net.connect(options);
	}
	/**
	* Create a `tls.TLSSocket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {tls.TLSSocket} The newly created socket used to start the connection
	* @private
	*/
	function tlsConnect(options) {
		options.path = void 0;
		if (!options.servername && options.servername !== "") options.servername = net.isIP(options.host) ? "" : options.host;
		return tls.connect(options);
	}
	/**
	* Abort the handshake and emit an error.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	*     abort or the socket to destroy
	* @param {String} message The error message
	* @private
	*/
	function abortHandshake(websocket, stream, message) {
		websocket._readyState = WebSocket.CLOSING;
		const err = new Error(message);
		Error.captureStackTrace(err, abortHandshake);
		if (stream.setHeader) {
			stream[kAborted] = true;
			stream.abort();
			if (stream.socket && !stream.socket.destroyed) stream.socket.destroy();
			process.nextTick(emitErrorAndClose, websocket, err);
		} else {
			stream.destroy(err);
			stream.once("error", websocket.emit.bind(websocket, "error"));
			stream.once("close", websocket.emitClose.bind(websocket));
		}
	}
	/**
	* Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	* when the `readyState` attribute is `CLOSING` or `CLOSED`.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {*} [data] The data to send
	* @param {Function} [cb] Callback
	* @private
	*/
	function sendAfterClose(websocket, data, cb) {
		if (data) {
			const length = isBlob(data) ? data.size : toBuffer(data).length;
			if (websocket._socket) websocket._sender._bufferedBytes += length;
			else websocket._bufferedAmount += length;
		}
		if (cb) {
			const err = /* @__PURE__ */ new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`);
			process.nextTick(cb, err);
		}
	}
	/**
	* The listener of the `Receiver` `'conclude'` event.
	*
	* @param {Number} code The status code
	* @param {Buffer} reason The reason for closing
	* @private
	*/
	function receiverOnConclude(code, reason) {
		const websocket = this[kWebSocket];
		websocket._closeFrameReceived = true;
		websocket._closeMessage = reason;
		websocket._closeCode = code;
		if (websocket._socket[kWebSocket] === void 0) return;
		websocket._socket.removeListener("data", socketOnData);
		process.nextTick(resume, websocket._socket);
		if (code === 1005) websocket.close();
		else websocket.close(code, reason);
	}
	/**
	* The listener of the `Receiver` `'drain'` event.
	*
	* @private
	*/
	function receiverOnDrain() {
		const websocket = this[kWebSocket];
		if (!websocket.isPaused) websocket._socket.resume();
	}
	/**
	* The listener of the `Receiver` `'error'` event.
	*
	* @param {(RangeError|Error)} err The emitted error
	* @private
	*/
	function receiverOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket._socket[kWebSocket] !== void 0) {
			websocket._socket.removeListener("data", socketOnData);
			process.nextTick(resume, websocket._socket);
			websocket.close(err[kStatusCode]);
		}
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* The listener of the `Receiver` `'finish'` event.
	*
	* @private
	*/
	function receiverOnFinish() {
		this[kWebSocket].emitClose();
	}
	/**
	* The listener of the `Receiver` `'message'` event.
	*
	* @param {Buffer|ArrayBuffer|Buffer[])} data The message
	* @param {Boolean} isBinary Specifies whether the message is binary or not
	* @private
	*/
	function receiverOnMessage(data, isBinary) {
		this[kWebSocket].emit("message", data, isBinary);
	}
	/**
	* The listener of the `Receiver` `'ping'` event.
	*
	* @param {Buffer} data The data included in the ping frame
	* @private
	*/
	function receiverOnPing(data) {
		const websocket = this[kWebSocket];
		if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
		websocket.emit("ping", data);
	}
	/**
	* The listener of the `Receiver` `'pong'` event.
	*
	* @param {Buffer} data The data included in the pong frame
	* @private
	*/
	function receiverOnPong(data) {
		this[kWebSocket].emit("pong", data);
	}
	/**
	* Resume a readable stream
	*
	* @param {Readable} stream The readable stream
	* @private
	*/
	function resume(stream) {
		stream.resume();
	}
	/**
	* The `Sender` error event handler.
	*
	* @param {Error} The error
	* @private
	*/
	function senderOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket.readyState === WebSocket.CLOSED) return;
		if (websocket.readyState === WebSocket.OPEN) {
			websocket._readyState = WebSocket.CLOSING;
			setCloseTimer(websocket);
		}
		this._socket.end();
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* Set a timer to destroy the underlying raw socket of a WebSocket.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @private
	*/
	function setCloseTimer(websocket) {
		websocket._closeTimer = setTimeout(websocket._socket.destroy.bind(websocket._socket), websocket._closeTimeout);
	}
	/**
	* The listener of the socket `'close'` event.
	*
	* @private
	*/
	function socketOnClose() {
		const websocket = this[kWebSocket];
		this.removeListener("close", socketOnClose);
		this.removeListener("data", socketOnData);
		this.removeListener("end", socketOnEnd);
		websocket._readyState = WebSocket.CLOSING;
		if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
			const chunk = this.read(this._readableState.length);
			websocket._receiver.write(chunk);
		}
		websocket._receiver.end();
		this[kWebSocket] = void 0;
		clearTimeout(websocket._closeTimer);
		if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) websocket.emitClose();
		else {
			websocket._receiver.on("error", receiverOnFinish);
			websocket._receiver.on("finish", receiverOnFinish);
		}
	}
	/**
	* The listener of the socket `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function socketOnData(chunk) {
		if (!this[kWebSocket]._receiver.write(chunk)) this.pause();
	}
	/**
	* The listener of the socket `'end'` event.
	*
	* @private
	*/
	function socketOnEnd() {
		const websocket = this[kWebSocket];
		websocket._readyState = WebSocket.CLOSING;
		websocket._receiver.end();
		this.end();
	}
	/**
	* The listener of the socket `'error'` event.
	*
	* @private
	*/
	function socketOnError() {
		const websocket = this[kWebSocket];
		this.removeListener("error", socketOnError);
		this.on("error", NOOP);
		if (websocket) {
			websocket._readyState = WebSocket.CLOSING;
			this.destroy();
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	require_websocket();
	const { Duplex: Duplex$1 } = __require("stream");
	/**
	* Emits the `'close'` event on a stream.
	*
	* @param {Duplex} stream The stream.
	* @private
	*/
	function emitClose(stream) {
		stream.emit("close");
	}
	/**
	* The listener of the `'end'` event.
	*
	* @private
	*/
	function duplexOnEnd() {
		if (!this.destroyed && this._writableState.finished) this.destroy();
	}
	/**
	* The listener of the `'error'` event.
	*
	* @param {Error} err The error
	* @private
	*/
	function duplexOnError(err) {
		this.removeListener("error", duplexOnError);
		this.destroy();
		if (this.listenerCount("error") === 0) this.emit("error", err);
	}
	/**
	* Wraps a `WebSocket` in a duplex stream.
	*
	* @param {WebSocket} ws The `WebSocket` to wrap
	* @param {Object} [options] The options for the `Duplex` constructor
	* @return {Duplex} The duplex stream
	* @public
	*/
	function createWebSocketStream(ws, options) {
		let terminateOnDestroy = true;
		const duplex = new Duplex$1({
			...options,
			autoDestroy: false,
			emitClose: false,
			objectMode: false,
			writableObjectMode: false
		});
		ws.on("message", function message(msg, isBinary) {
			const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
			if (!duplex.push(data)) ws.pause();
		});
		ws.once("error", function error(err) {
			if (duplex.destroyed) return;
			terminateOnDestroy = false;
			duplex.destroy(err);
		});
		ws.once("close", function close() {
			if (duplex.destroyed) return;
			duplex.push(null);
		});
		duplex._destroy = function(err, callback) {
			if (ws.readyState === ws.CLOSED) {
				callback(err);
				process.nextTick(emitClose, duplex);
				return;
			}
			let called = false;
			ws.once("error", function error(err) {
				called = true;
				callback(err);
			});
			ws.once("close", function close() {
				if (!called) callback(err);
				process.nextTick(emitClose, duplex);
			});
			if (terminateOnDestroy) ws.terminate();
		};
		duplex._final = function(callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._final(callback);
				});
				return;
			}
			if (ws._socket === null) return;
			if (ws._socket._writableState.finished) {
				callback();
				if (duplex._readableState.endEmitted) duplex.destroy();
			} else {
				ws._socket.once("finish", function finish() {
					callback();
				});
				ws.close();
			}
		};
		duplex._read = function() {
			if (ws.isPaused) ws.resume();
		};
		duplex._write = function(chunk, encoding, callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._write(chunk, encoding, callback);
				});
				return;
			}
			ws.send(chunk, callback);
		};
		duplex.on("end", duplexOnEnd);
		duplex.on("error", duplexOnError);
		return duplex;
	}
	module.exports = createWebSocketStream;
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/subprotocol.js
var require_subprotocol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { tokenChars } = require_validation();
	/**
	* Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	*
	* @param {String} header The field value of the header
	* @return {Set} The subprotocol names
	* @public
	*/
	function parse(header) {
		const protocols = /* @__PURE__ */ new Set();
		let start = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			const code = header.charCodeAt(i);
			if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (i !== 0 && (code === 32 || code === 9)) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const protocol = header.slice(start, end);
				if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
				protocols.add(protocol);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || end !== -1) throw new SyntaxError("Unexpected end of input");
		const protocol = header.slice(start, i);
		if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
		protocols.add(protocol);
		return protocols;
	}
	module.exports = { parse };
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/websocket-server.js
var require_websocket_server = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const EventEmitter = __require("events");
	const http = __require("http");
	const { Duplex } = __require("stream");
	const { createHash } = __require("crypto");
	const extension = require_extension();
	const PerMessageDeflate = require_permessage_deflate();
	const subprotocol = require_subprotocol();
	const WebSocket = require_websocket();
	const { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;
	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;
	/**
	* Class representing a WebSocket server.
	*
	* @extends EventEmitter
	*/
	var WebSocketServer = class extends EventEmitter {
		/**
		* Create a `WebSocketServer` instance.
		*
		* @param {Object} options Configuration options
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Boolean} [options.autoPong=true] Specifies whether or not to
		*     automatically send a pong in response to a ping
		* @param {Number} [options.backlog=511] The maximum length of the queue of
		*     pending connections
		* @param {Boolean} [options.clientTracking=true] Specifies whether or not to
		*     track clients
		* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
		*     wait for the closing handshake to finish after `websocket.close()` is
		*     called
		* @param {Function} [options.handleProtocols] A hook to handle protocols
		* @param {String} [options.host] The hostname where to bind the server
		* @param {Number} [options.maxBufferedChunks=262144] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=16384] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=104857600] The maximum allowed message
		*     size
		* @param {Boolean} [options.noServer=false] Enable no server mode
		* @param {String} [options.path] Accept only connections matching this path
		* @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
		*     permessage-deflate
		* @param {Number} [options.port] The port where to bind the server
		* @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
		*     server to use
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @param {Function} [options.verifyClient] A hook to reject connections
		* @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
		*     class to use. It must be the `WebSocket` class or class that extends it
		* @param {Function} [callback] A listener for the `listening` event
		*/
		constructor(options, callback) {
			super();
			options = {
				allowSynchronousEvents: true,
				autoPong: true,
				maxBufferedChunks: 262144,
				maxFragments: 16384,
				maxPayload: 104857600,
				skipUTF8Validation: false,
				perMessageDeflate: false,
				handleProtocols: null,
				clientTracking: true,
				closeTimeout: CLOSE_TIMEOUT,
				verifyClient: null,
				noServer: false,
				backlog: null,
				server: null,
				host: null,
				path: null,
				port: null,
				WebSocket,
				...options
			};
			if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) throw new TypeError("One and only one of the \"port\", \"server\", or \"noServer\" options must be specified");
			if (options.port != null) {
				this._server = http.createServer((req, res) => {
					const body = http.STATUS_CODES[426];
					res.writeHead(426, {
						"Content-Length": body.length,
						"Content-Type": "text/plain"
					});
					res.end(body);
				});
				this._server.listen(options.port, options.host, options.backlog, callback);
			} else if (options.server) this._server = options.server;
			if (this._server) {
				const emitConnection = this.emit.bind(this, "connection");
				this._removeListeners = addListeners(this._server, {
					listening: this.emit.bind(this, "listening"),
					error: this.emit.bind(this, "error"),
					upgrade: (req, socket, head) => {
						this.handleUpgrade(req, socket, head, emitConnection);
					}
				});
			}
			if (options.perMessageDeflate === true) options.perMessageDeflate = {};
			if (options.clientTracking) {
				this.clients = /* @__PURE__ */ new Set();
				this._shouldEmitClose = false;
			}
			this.options = options;
			this._state = RUNNING;
		}
		/**
		* Returns the bound address, the address family name, and port of the server
		* as reported by the operating system if listening on an IP socket.
		* If the server is listening on a pipe or UNIX domain socket, the name is
		* returned as a string.
		*
		* @return {(Object|String|null)} The address of the server
		* @public
		*/
		address() {
			if (this.options.noServer) throw new Error("The server is operating in \"noServer\" mode");
			if (!this._server) return null;
			return this._server.address();
		}
		/**
		* Stop the server from accepting new connections and emit the `'close'` event
		* when all existing connections are closed.
		*
		* @param {Function} [cb] A one-time listener for the `'close'` event
		* @public
		*/
		close(cb) {
			if (this._state === CLOSED) {
				if (cb) this.once("close", () => {
					cb(/* @__PURE__ */ new Error("The server is not running"));
				});
				process.nextTick(emitClose, this);
				return;
			}
			if (cb) this.once("close", cb);
			if (this._state === CLOSING) return;
			this._state = CLOSING;
			if (this.options.noServer || this.options.server) {
				if (this._server) {
					this._removeListeners();
					this._removeListeners = this._server = null;
				}
				if (this.clients) {
					if (!this.clients.size) process.nextTick(emitClose, this);
					else this._shouldEmitClose = true;
				} else process.nextTick(emitClose, this);
			} else {
				const server = this._server;
				this._removeListeners();
				this._removeListeners = this._server = null;
				server.close(() => {
					emitClose(this);
				});
			}
		}
		/**
		* See if a given request should be handled by this server instance.
		*
		* @param {http.IncomingMessage} req Request object to inspect
		* @return {Boolean} `true` if the request is valid, else `false`
		* @public
		*/
		shouldHandle(req) {
			if (this.options.path) {
				const index = req.url.indexOf("?");
				if ((index !== -1 ? req.url.slice(0, index) : req.url) !== this.options.path) return false;
			}
			return true;
		}
		/**
		* Handle a HTTP Upgrade request.
		*
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @public
		*/
		handleUpgrade(req, socket, head, cb) {
			socket.on("error", socketOnError);
			const key = req.headers["sec-websocket-key"];
			const upgrade = req.headers.upgrade;
			const version = +req.headers["sec-websocket-version"];
			if (req.method !== "GET") {
				abortHandshakeOrEmitwsClientError(this, req, socket, 405, "Invalid HTTP method");
				return;
			}
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid Upgrade header");
				return;
			}
			if (key === void 0 || !keyRegex.test(key)) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Missing or invalid Sec-WebSocket-Key header");
				return;
			}
			if (version !== 13 && version !== 8) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Missing or invalid Sec-WebSocket-Version header", { "Sec-WebSocket-Version": "13, 8" });
				return;
			}
			if (!this.shouldHandle(req)) {
				abortHandshake(socket, 400);
				return;
			}
			const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
			let protocols = /* @__PURE__ */ new Set();
			if (secWebSocketProtocol !== void 0) try {
				protocols = subprotocol.parse(secWebSocketProtocol);
			} catch (err) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid Sec-WebSocket-Protocol header");
				return;
			}
			const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
			const extensions = {};
			if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
				const perMessageDeflate = new PerMessageDeflate({
					...this.options.perMessageDeflate,
					isServer: true,
					maxPayload: this.options.maxPayload
				});
				try {
					const offers = extension.parse(secWebSocketExtensions);
					if (offers[PerMessageDeflate.extensionName]) {
						perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
						extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
					}
				} catch (err) {
					abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
					return;
				}
			}
			if (this.options.verifyClient) {
				const info = {
					origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
					secure: !!(req.socket.authorized || req.socket.encrypted),
					req
				};
				if (this.options.verifyClient.length === 2) {
					this.options.verifyClient(info, (verified, code, message, headers) => {
						if (!verified) return abortHandshake(socket, code || 401, message, headers);
						this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
					});
					return;
				}
				if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
			}
			this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
		}
		/**
		* Upgrade the connection to WebSocket.
		*
		* @param {Object} extensions The accepted extensions
		* @param {String} key The value of the `Sec-WebSocket-Key` header
		* @param {Set} protocols The subprotocols
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @throws {Error} If called more than once with the same socket
		* @private
		*/
		completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
			if (!socket.readable || !socket.writable) return socket.destroy();
			if (socket[kWebSocket]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
			if (this._state > RUNNING) return abortHandshake(socket, 503);
			const headers = [
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-WebSocket-Accept: ${createHash("sha1").update(key + GUID).digest("base64")}`
			];
			const ws = new this.options.WebSocket(null, void 0, this.options);
			if (protocols.size) {
				const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
				if (protocol) {
					headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
					ws._protocol = protocol;
				}
			}
			if (extensions[PerMessageDeflate.extensionName]) {
				const params = extensions[PerMessageDeflate.extensionName].params;
				const value = extension.format({ [PerMessageDeflate.extensionName]: [params] });
				headers.push(`Sec-WebSocket-Extensions: ${value}`);
				ws._extensions = extensions;
			}
			this.emit("headers", headers, req);
			socket.write(headers.concat("\r\n").join("\r\n"));
			socket.removeListener("error", socketOnError);
			ws.setSocket(socket, head, {
				allowSynchronousEvents: this.options.allowSynchronousEvents,
				maxBufferedChunks: this.options.maxBufferedChunks,
				maxFragments: this.options.maxFragments,
				maxPayload: this.options.maxPayload,
				skipUTF8Validation: this.options.skipUTF8Validation
			});
			if (this.clients) {
				this.clients.add(ws);
				ws.on("close", () => {
					this.clients.delete(ws);
					if (this._shouldEmitClose && !this.clients.size) process.nextTick(emitClose, this);
				});
			}
			cb(ws, req);
		}
	};
	module.exports = WebSocketServer;
	/**
	* Add event listeners on an `EventEmitter` using a map of <event, listener>
	* pairs.
	*
	* @param {EventEmitter} server The event emitter
	* @param {Object.<String, Function>} map The listeners to add
	* @return {Function} A function that will remove the added listeners when
	*     called
	* @private
	*/
	function addListeners(server, map) {
		for (const event of Object.keys(map)) server.on(event, map[event]);
		return function removeListeners() {
			for (const event of Object.keys(map)) server.removeListener(event, map[event]);
		};
	}
	/**
	* Emit a `'close'` event on an `EventEmitter`.
	*
	* @param {EventEmitter} server The event emitter
	* @private
	*/
	function emitClose(server) {
		server._state = CLOSED;
		server.emit("close");
	}
	/**
	* Handle socket errors.
	*
	* @private
	*/
	function socketOnError() {
		this.destroy();
	}
	/**
	* Close the connection when preconditions are not fulfilled.
	*
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} [message] The HTTP response body
	* @param {Object} [headers] Additional HTTP response headers
	* @private
	*/
	function abortHandshake(socket, code, message, headers) {
		message = message || http.STATUS_CODES[code];
		headers = {
			Connection: "close",
			"Content-Type": "text/html",
			"Content-Length": Buffer.byteLength(message),
			...headers
		};
		socket.once("finish", socket.destroy);
		socket.end(`HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
	}
	/**
	* Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	* one listener for it, otherwise call `abortHandshake()`.
	*
	* @param {WebSocketServer} server The WebSocket server
	* @param {http.IncomingMessage} req The request object
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} message The HTTP response body
	* @param {Object} [headers] The HTTP response headers
	* @private
	*/
	function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
		if (server.listenerCount("wsClientError")) {
			const err = new Error(message);
			Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
			server.emit("wsClientError", err, socket, req);
		} else abortHandshake(socket, code, message, headers);
	}
}));
//#endregion
//#region node_modules/.pnpm/ws@8.22.0/node_modules/ws/index.js
var require_ws$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const createWebSocketStream = require_stream();
	const extension = require_extension();
	const PerMessageDeflate = require_permessage_deflate();
	const Receiver = require_receiver();
	const Sender = require_sender();
	const subprotocol = require_subprotocol();
	const WebSocket = require_websocket();
	const WebSocketServer = require_websocket_server();
	WebSocket.createWebSocketStream = createWebSocketStream;
	WebSocket.extension = extension;
	WebSocket.PerMessageDeflate = PerMessageDeflate;
	WebSocket.Receiver = Receiver;
	WebSocket.Sender = Sender;
	WebSocket.Server = WebSocketServer;
	WebSocket.subprotocol = subprotocol;
	WebSocket.WebSocket = WebSocket;
	WebSocket.WebSocketServer = WebSocketServer;
	module.exports = WebSocket;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/bytes.js
var require_bytes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concatBytes = concatBytes;
	exports.encodeUTF8 = encodeUTF8;
	exports.decodeUTF8 = decodeUTF8;
	/** Copies byte arrays into one contiguous `Uint8Array` while preserving their order. */
	function concatBytes(buffers) {
		let length = 0;
		for (const buffer of buffers) length += buffer.length;
		const output = new Uint8Array(length);
		let index = 0;
		for (const buffer of buffers) {
			output.set(buffer, index);
			index += buffer.length;
		}
		return output;
	}
	let encodeUTF8_;
	/** Encodes text as UTF-8 bytes, reusing the platform encoder after its first call. */
	function encodeUTF8(str) {
		let encoder;
		return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
	}
	let decodeUTF8_;
	/** Decodes UTF-8 bytes as text, reusing the platform decoder after its first call. */
	function decodeUTF8(bytes) {
		let decoder;
		return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.castToError = void 0;
	exports.isAbortError = isAbortError;
	function isAbortError(err) {
		return typeof err === "object" && err !== null && ("name" in err && err.name === "AbortError" || "message" in err && String(err.message).includes("FetchRequestCanceledException"));
	}
	const castToError = (err) => {
		if (err instanceof Error) return err;
		if (typeof err === "object" && err !== null) {
			try {
				if (Object.prototype.toString.call(err) === "[object Error]") {
					const hasCause = "cause" in err;
					const error = new Error(err.message, hasCause ? { cause: err.cause } : {});
					if (err.stack) error.stack = err.stack;
					if (hasCause && !Object.prototype.hasOwnProperty.call(error, "cause")) error.cause = err.cause;
					if (err.name) error.name = err.name;
					return error;
				}
			} catch {}
			try {
				return new Error(JSON.stringify(err));
			} catch {}
		}
		return new Error(err);
	};
	exports.castToError = castToError;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/core/error.js
var require_error$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SubjectTokenProviderError = exports.OAuthError = exports.InvalidWebhookSignatureError = exports.ContentFilterFinishReasonError = exports.LengthFinishReasonError = exports.InternalServerError = exports.RateLimitError = exports.UnprocessableEntityError = exports.ConflictError = exports.NotFoundError = exports.PermissionDeniedError = exports.AuthenticationError = exports.BadRequestError = exports.APIConnectionTimeoutError = exports.APIConnectionError = exports.APIUserAbortError = exports.APIError = exports.OpenAIError = void 0;
	const errors_1 = require_errors();
	var OpenAIError = class extends Error {};
	exports.OpenAIError = OpenAIError;
	var APIError = class APIError extends OpenAIError {
		constructor(status, error, message, headers) {
			super(`${APIError.makeMessage(status, error, message)}`);
			this.status = status;
			this.headers = headers;
			this.requestID = headers?.get("x-request-id");
			this.error = error;
			const data = error;
			this.code = data?.["code"];
			this.param = data?.["param"];
			this.type = data?.["type"];
		}
		static makeMessage(status, error, message) {
			const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
			if (status && msg) return `${status} ${msg}`;
			if (status) return `${status} status code (no body)`;
			if (msg) return msg;
			return "(no status code or body)";
		}
		static generate(status, errorResponse, message, headers) {
			if (!status || !headers) return new APIConnectionError({
				message,
				cause: (0, errors_1.castToError)(errorResponse)
			});
			const error = errorResponse?.["error"];
			if (status === 400) return new BadRequestError(status, error, message, headers);
			if (status === 401) return new AuthenticationError(status, error, message, headers);
			if (status === 403) return new PermissionDeniedError(status, error, message, headers);
			if (status === 404) return new NotFoundError(status, error, message, headers);
			if (status === 409) return new ConflictError(status, error, message, headers);
			if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
			if (status === 429) return new RateLimitError(status, error, message, headers);
			if (status >= 500) return new InternalServerError(status, error, message, headers);
			return new APIError(status, error, message, headers);
		}
	};
	exports.APIError = APIError;
	var APIUserAbortError = class extends APIError {
		constructor({ message } = {}) {
			super(void 0, void 0, message || "Request was aborted.", void 0);
		}
	};
	exports.APIUserAbortError = APIUserAbortError;
	var APIConnectionError = class extends APIError {
		constructor({ message, cause }) {
			super(void 0, void 0, message || "Connection error.", void 0);
			if (cause) this.cause = cause;
		}
	};
	exports.APIConnectionError = APIConnectionError;
	var APIConnectionTimeoutError = class extends APIConnectionError {
		constructor({ message } = {}) {
			super({ message: message ?? "Request timed out." });
		}
	};
	exports.APIConnectionTimeoutError = APIConnectionTimeoutError;
	var BadRequestError = class extends APIError {};
	exports.BadRequestError = BadRequestError;
	var AuthenticationError = class extends APIError {};
	exports.AuthenticationError = AuthenticationError;
	var PermissionDeniedError = class extends APIError {};
	exports.PermissionDeniedError = PermissionDeniedError;
	var NotFoundError = class extends APIError {};
	exports.NotFoundError = NotFoundError;
	var ConflictError = class extends APIError {};
	exports.ConflictError = ConflictError;
	var UnprocessableEntityError = class extends APIError {};
	exports.UnprocessableEntityError = UnprocessableEntityError;
	var RateLimitError = class extends APIError {};
	exports.RateLimitError = RateLimitError;
	var InternalServerError = class extends APIError {};
	exports.InternalServerError = InternalServerError;
	var LengthFinishReasonError = class extends OpenAIError {
		constructor() {
			super(`Could not parse response content as the length limit was reached`);
		}
	};
	exports.LengthFinishReasonError = LengthFinishReasonError;
	var ContentFilterFinishReasonError = class extends OpenAIError {
		constructor() {
			super(`Could not parse response content as the request was rejected by the content filter`);
		}
	};
	exports.ContentFilterFinishReasonError = ContentFilterFinishReasonError;
	var InvalidWebhookSignatureError = class extends Error {
		constructor(message) {
			super(message);
		}
	};
	exports.InvalidWebhookSignatureError = InvalidWebhookSignatureError;
	/**
	* Error thrown by the API server during OAuth token exchange.
	* Can have status codes 400, 401, or 403.
	* Other status codes from OAuth endpoints are raised as normal APIError types.
	*/
	var OAuthError = class extends APIError {
		constructor(status, error, headers) {
			let finalMessage = "OAuth2 authentication error";
			let error_code = void 0;
			if (error && typeof error === "object") {
				const errorData = error;
				error_code = errorData["error"];
				const description = errorData["error_description"];
				if (description && typeof description === "string") finalMessage = description;
				else if (error_code) finalMessage = error_code;
			}
			super(status, error, finalMessage, headers);
			this.error_code = error_code;
		}
	};
	exports.OAuthError = OAuthError;
	var SubjectTokenProviderError = class extends OpenAIError {
		constructor(message, provider, cause) {
			super(message);
			this.provider = provider;
			this.cause = cause;
		}
	};
	exports.SubjectTokenProviderError = SubjectTokenProviderError;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/ws.js
var require_ws$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SendQueue = exports.webSocketHeaderRemovals = exports.WEBSOCKET_METADATA_HEADERS = void 0;
	exports.recordWebSocketError = recordWebSocketError;
	exports.getWebSocketError = getWebSocketError;
	exports.getMaxBufferedEvents = getMaxBufferedEvents;
	exports.snapshotWebSocketCredentials = snapshotWebSocketCredentials;
	exports.mergeWebSocketAuthHeaders = mergeWebSocketAuthHeaders;
	exports.buildWebSocketOptions = buildWebSocketOptions;
	exports.protectWebSocketOptionsFromCredentialRedirects = protectWebSocketOptionsFromCredentialRedirects;
	exports.flattenRawData = flattenRawData;
	exports.rawByteLength = rawByteLength;
	exports.isRecoverableClose = isRecoverableClose;
	const bytes_1 = require_bytes();
	const error_1 = require_error$1();
	const webSocketErrors = /* @__PURE__ */ new WeakMap();
	/** Records physical failure before transport callbacks notify public observers. @internal */
	function recordWebSocketError(socket, error) {
		webSocketErrors.set(socket, error);
	}
	/** Returns physical failure for this socket instance, never for a replacement. @internal */
	function getWebSocketError(socket) {
		return webSocketErrors.get(socket);
	}
	/** Snapshots and validates the iterator's limit before listeners are attached. */
	function getMaxBufferedEvents(options) {
		const limit = options?.maxBufferedEvents;
		if (limit !== void 0 && (!Number.isSafeInteger(limit) || limit <= 0)) throw new error_1.OpenAIError("maxBufferedEvents must be a positive safe integer");
		return limit;
	}
	const REDIRECT_SAFE_WEBSOCKET_HEADERS = /* @__PURE__ */ new Set([
		"connection",
		"host",
		"openai-beta",
		"origin",
		"sec-websocket-extensions",
		"sec-websocket-key",
		"sec-websocket-version",
		"upgrade",
		"user-agent",
		"x-access-level",
		"x-auth-metadata",
		"x-auth-tokenization",
		"x-authentication-metadata",
		"x-authentication-tokenization",
		"x-security-policy",
		"x-token-budget",
		"x-trace-id"
	]);
	const WEBSOCKET_METADATA_HEADER_NAMES = /* @__PURE__ */ new Set([
		"accept",
		"accept-encoding",
		"accept-language",
		"content-type",
		"x-request-id",
		"x-client-request-id",
		"x-correlation-id",
		"traceparent",
		"tracestate",
		"sentry-trace",
		"x-amzn-trace-id",
		"x-cloud-trace-context",
		"x-datadog-trace-id",
		"x-datadog-parent-id",
		"x-datadog-sampling-priority",
		"x-datadog-origin",
		"x-datadog-tags",
		"baggage",
		"b3"
	]);
	exports.WEBSOCKET_METADATA_HEADERS = { has: (name, values) => WEBSOCKET_METADATA_HEADER_NAMES.has(name) || name.startsWith("x-b3-") || name === "sec-websocket-protocol" && !values.some((value) => typeof value === "string" && value.split(",").some((protocol) => protocol.trim().startsWith("openai-insecure-api-key."))) };
	function isWebSocketCredentialHeader(name) {
		return !REDIRECT_SAFE_WEBSOCKET_HEADERS.has(name.toLowerCase().split("_").join("-"));
	}
	/**
	* Snapshots credential values in final socket options before validation and dispatch.
	* Reports potential caller authentication, excluding additional metadata when requested.
	* The server remains responsible for validating credentials. Noncredential headers are left intact.
	*/
	function snapshotWebSocketCredentials(options, metadataHeaders) {
		if (options.auth !== null && options.auth !== void 0) options.auth = String(options.auth);
		const credentials = /* @__PURE__ */ new Map();
		const headers = options.headers ?? {};
		for (const [name, value] of Object.entries(headers)) {
			const normalizedName = name.toLowerCase().split("_").join("-");
			if (!isWebSocketCredentialHeader(name) || normalizedName === "openai-organization" || normalizedName === "openai-project") continue;
			let snapshot = value;
			if (Array.isArray(value)) snapshot = value.map(String);
			else if (value !== null && value !== void 0) snapshot = String(value);
			headers[name] = snapshot;
			const values = Array.isArray(snapshot) ? snapshot : [snapshot];
			if (!metadataHeaders?.has(normalizedName, values)) credentials.set(name.toLowerCase(), values.some((item) => typeof item === "string" && item.trim().length > 0));
		}
		return [...credentials.values()].some(Boolean) || !credentials.has("authorization") && typeof options.auth === "string" && options.auth.trim().length > 0;
	}
	/** Merge transport authentication before explicit caller overrides and header removals. */
	function mergeWebSocketAuthHeaders(options, authHeaders, removedHeaders) {
		const headers = new Map(Object.entries(authHeaders).map(([name, value]) => [name.toLowerCase(), value]));
		for (const name of removedHeaders) headers.delete(name);
		for (const [name, value] of Object.entries(options.headers ?? {})) headers.set(name, value);
		return {
			...options,
			headers: Object.fromEntries(headers)
		};
	}
	/** Removal sink for one synchronous header-hook call, including legacy one-argument overrides. */
	exports.webSocketHeaderRemovals = /* @__PURE__ */ new WeakMap();
	const preparedWebSocketHeaders = /* @__PURE__ */ new WeakMap();
	/** Build a WebSocket handshake with explicit caller headers applied after the client defaults. */
	function buildWebSocketOptions(client, authHeaders, options, removedHeaders, usePreparedHeaders = false) {
		const previous = exports.webSocketHeaderRemovals.get(client);
		const prepared = usePreparedHeaders && options ? preparedWebSocketHeaders.get(options) : void 0;
		const context = {
			removedHeaders,
			baseHeaders: prepared?.baseHeaders
		};
		exports.webSocketHeaderRemovals.set(client, context);
		let headers;
		try {
			headers = new Map(Object.entries(client._buildWebSocketHeaders(authHeaders, removedHeaders)).map(([name, value]) => [name.toLowerCase(), value]));
		} finally {
			if (previous) exports.webSocketHeaderRemovals.set(client, previous);
			else exports.webSocketHeaderRemovals.delete(client);
		}
		const transportHeaders = /* @__PURE__ */ new Map();
		const currentHeaders = new Map(Object.entries(options?.headers ?? {}));
		const overrides = prepared ? [...prepared.transportHeaders].map(([name, removed]) => [name, removed ? null : currentHeaders.get(name)]) : currentHeaders;
		for (const [name, value] of overrides) {
			const normalizedName = name.toLowerCase();
			if (value === null) {
				headers.delete(normalizedName);
				removedHeaders?.add(normalizedName);
				transportHeaders.set(normalizedName, true);
			} else if (value !== void 0) {
				headers.set(normalizedName, value);
				removedHeaders?.delete(normalizedName);
				transportHeaders.set(normalizedName, false);
			}
		}
		const result = {
			...options,
			headers: Object.fromEntries(headers),
			followRedirects: false
		};
		preparedWebSocketHeaders.set(result, {
			baseHeaders: context.baseHeaders,
			transportHeaders
		});
		return result;
	}
	/** Prevents WebSocket redirects from forwarding caller or SDK credentials to another origin. */
	function protectWebSocketOptionsFromCredentialRedirects(options) {
		const hasSensitiveHeader = Object.keys(options.headers ?? {}).some(isWebSocketCredentialHeader);
		if (!options.auth && !hasSensitiveHeader) return options;
		return {
			...options,
			followRedirects: false
		};
	}
	function toUint8Array(view) {
		if (view instanceof Uint8Array) return view;
		return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
	}
	/**
	* Flatten `ArrayBufferView[]` fragments into a single `Uint8Array` so that
	* `ws.send()` transmits the correct bytes.
	*/
	function flattenRawData(data) {
		if (Array.isArray(data)) return (0, bytes_1.concatBytes)(data.map(toUint8Array));
		return data;
	}
	function snapshotRawData(data) {
		if (typeof data === "string") return data;
		if (Array.isArray(data)) return (0, bytes_1.concatBytes)(data.map(toUint8Array));
		if (ArrayBuffer.isView(data)) {
			const copy = new Uint8Array(data.byteLength);
			copy.set(toUint8Array(data));
			return copy;
		}
		return data.slice(0);
	}
	/** Counts wire bytes without allocating another payload-sized buffer. */
	function rawByteLength(data) {
		if (typeof data === "string") {
			let bytes = 0;
			for (let index = 0; index < data.length; index += 1) {
				const code = data.codePointAt(index);
				if (code < 128) bytes += 1;
				else if (code < 2048) bytes += 2;
				else if (code <= 65535) bytes += 3;
				else {
					bytes += 4;
					index += 1;
				}
			}
			return bytes;
		}
		if (Array.isArray(data)) return data.reduce((sum, buf) => sum + buf.byteLength, 0);
		if ("byteLength" in data) return data.byteLength;
		return 0;
	}
	/**
	* Buffers outgoing WebSocket messages while a connection is unavailable.
	*
	* JSON values are serialized immediately, and raw binary payloads are copied,
	* so later caller mutations cannot change queued messages. A single oversized
	* message is accepted when the queue is empty; further messages are rejected
	* whenever they would exceed the configured byte budget.
	*/
	var SendQueue = class {
		/** Creates a queue with a one-mebibyte default byte budget. */
		constructor(maxBytes = 1048576) {
			this._queue = [];
			this._bytes = 0;
			this._maxBytes = maxBytes;
		}
		/**
		* Serializes and snapshots a JSON message before queueing it.
		*
		* @returns `true` when accepted, including an oversized first message; `false`
		* when adding it to a nonempty queue would exceed the byte budget.
		*/
		enqueue(event) {
			const data = JSON.stringify(event);
			const byteLength = (0, bytes_1.encodeUTF8)(data).byteLength;
			if (this._bytes + byteLength > this._maxBytes && this._queue.length > 0) return false;
			this._queue.push({
				kind: "json",
				data,
				byteLength
			});
			this._bytes += byteLength;
			return true;
		}
		/**
		* Queues a raw string or a defensive copy of a binary WebSocket payload.
		* Fragmented typed-array payloads are flattened before storage.
		*
		* @returns `true` when accepted, including an oversized first frame; `false`
		* when adding it to a nonempty queue would exceed the byte budget.
		*/
		enqueueRaw(data) {
			const snapshot = snapshotRawData(data);
			const byteLength = rawByteLength(snapshot);
			if (this._bytes + byteLength > this._maxBytes && this._queue.length > 0) return false;
			this._queue.push({
				kind: "raw",
				data: snapshot,
				byteLength
			});
			this._bytes += byteLength;
			return true;
		}
		/**
		* Send every queued message via `send`. If `send` throws, the failing
		* message and all subsequent messages are re-queued and the error is
		* re-thrown so the caller can report it. Endpoints that cannot safely replay
		* an attempted write use `requeueFailed: false`. Never-attempted messages
		* remain queued, including messages enqueued during the failed send.
		*/
		flush(send, options) {
			const pending = this._queue.splice(0);
			this._bytes = 0;
			for (let i = 0; i < pending.length; i++) try {
				send(pending[i].data);
			} catch (err) {
				const remaining = pending.slice(options?.requeueFailed === false ? i + 1 : i);
				this._queue = [...remaining, ...this._queue];
				this._bytes = this._queue.reduce((sum, item) => sum + item.byteLength, 0);
				throw err;
			}
		}
		/**
		* Drain the queue and return the unsent messages. JSON messages are
		* deserialized back to their original form. Resets byte tracking to zero.
		*/
		drain() {
			const unsent = this._queue.map((entry) => {
				if (entry.kind === "raw") return {
					type: "raw",
					data: entry.data
				};
				return {
					type: "message",
					message: JSON.parse(entry.data)
				};
			});
			this._queue = [];
			this._bytes = 0;
			return unsent;
		}
	};
	exports.SendQueue = SendQueue;
	/**
	* Reports whether an RFC 6455 close code represents a recoverable interruption.
	*
	* Network failures, service restarts, temporary server errors, and TLS
	* handshake failures can be retried; normal closure, protocol violations,
	* invalid payloads, and unrecognized codes cannot.
	*/
	function isRecoverableClose(code) {
		switch (code) {
			case 1e3: return false;
			case 1001: return true;
			case 1002: return false;
			case 1003: return false;
			case 1005: return true;
			case 1006: return true;
			case 1007: return false;
			case 1008: return false;
			case 1009: return false;
			case 1010: return false;
			case 1011: return true;
			case 1012: return true;
			case 1013: return true;
			case 1015: return true;
			default: return false;
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/error.js
var require_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/** @deprecated Import from ./core/error instead */
	require_tslib().__exportStar(require_error$1(), exports);
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/values.js
var require_values = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.safeJSON = exports.maybeCoerceBoolean = exports.maybeCoerceFloat = exports.maybeCoerceInteger = exports.coerceBoolean = exports.coerceFloat = exports.coerceInteger = exports.validatePositiveInteger = exports.ensurePresent = exports.isReadonlyArray = exports.isArray = exports.isAbsoluteURL = void 0;
	exports.maybeObj = maybeObj;
	exports.isEmptyObj = isEmptyObj;
	exports.hasOwn = hasOwn;
	exports.isObj = isObj;
	const error_1 = require_error$1();
	const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
	const isAbsoluteURL = (url) => {
		return startsWithSchemeRegexp.test(url);
	};
	exports.isAbsoluteURL = isAbsoluteURL;
	let isArray = (val) => (exports.isArray = Array.isArray, (0, exports.isArray)(val));
	exports.isArray = isArray;
	exports.isReadonlyArray = exports.isArray;
	/** Returns an object if the given value isn't an object, otherwise returns as-is */
	function maybeObj(x) {
		if (typeof x !== "object") return {};
		return x ?? {};
	}
	function isEmptyObj(obj) {
		if (!obj) return true;
		for (const _k in obj) return false;
		return true;
	}
	function hasOwn(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	}
	function isObj(obj) {
		return obj != null && typeof obj === "object" && !Array.isArray(obj);
	}
	const ensurePresent = (value) => {
		if (value == null) throw new error_1.OpenAIError(`Expected a value to be given but received ${value} instead.`);
		return value;
	};
	exports.ensurePresent = ensurePresent;
	const validatePositiveInteger = (name, n) => {
		if (typeof n !== "number" || !Number.isInteger(n)) throw new error_1.OpenAIError(`${name} must be an integer`);
		if (n < 0) throw new error_1.OpenAIError(`${name} must be a positive integer`);
		return n;
	};
	exports.validatePositiveInteger = validatePositiveInteger;
	const coerceInteger = (value) => {
		if (typeof value === "number") return Math.round(value);
		if (typeof value === "string") return parseInt(value, 10);
		throw new error_1.OpenAIError(`Could not coerce ${value} (type: ${typeof value}) into a number`);
	};
	exports.coerceInteger = coerceInteger;
	const coerceFloat = (value) => {
		if (typeof value === "number") return value;
		if (typeof value === "string") return parseFloat(value);
		throw new error_1.OpenAIError(`Could not coerce ${value} (type: ${typeof value}) into a number`);
	};
	exports.coerceFloat = coerceFloat;
	const coerceBoolean = (value) => {
		if (typeof value === "boolean") return value;
		if (typeof value === "string") return value === "true";
		return Boolean(value);
	};
	exports.coerceBoolean = coerceBoolean;
	const maybeCoerceInteger = (value) => {
		if (value == null) return;
		return (0, exports.coerceInteger)(value);
	};
	exports.maybeCoerceInteger = maybeCoerceInteger;
	const maybeCoerceFloat = (value) => {
		if (value == null) return;
		return (0, exports.coerceFloat)(value);
	};
	exports.maybeCoerceFloat = maybeCoerceFloat;
	const maybeCoerceBoolean = (value) => {
		if (value == null) return;
		return (0, exports.coerceBoolean)(value);
	};
	exports.maybeCoerceBoolean = maybeCoerceBoolean;
	const safeJSON = (text) => {
		try {
			return JSON.parse(text);
		} catch (err) {
			return;
		}
	};
	exports.safeJSON = safeJSON;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.toFloat32Array = exports.fromBase64 = exports.toBase64 = void 0;
	const error_1 = require_error$1();
	const bytes_1 = require_bytes();
	const toBase64 = (data) => {
		if (!data) return "";
		if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data).toString("base64");
		if (typeof data === "string") data = (0, bytes_1.encodeUTF8)(data);
		if (typeof btoa !== "undefined") return btoa(String.fromCharCode.apply(null, data));
		throw new error_1.OpenAIError("Cannot generate base64 string; Expected `Buffer` or `btoa` to be defined");
	};
	exports.toBase64 = toBase64;
	const fromBase64 = (str) => {
		if (typeof globalThis.Buffer !== "undefined") {
			const buf = globalThis.Buffer.from(str, "base64");
			return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
		}
		if (typeof atob !== "undefined") {
			const bstr = atob(str);
			const buf = new Uint8Array(bstr.length);
			for (let i = 0; i < bstr.length; i++) buf[i] = bstr.charCodeAt(i);
			return buf;
		}
		throw new error_1.OpenAIError("Cannot decode base64 string; Expected `Buffer` or `atob` to be defined");
	};
	exports.fromBase64 = fromBase64;
	/**
	* Converts a Base64 encoded string to a Float32Array.
	* @param base64Str - The Base64 encoded string.
	* @returns An Array of numbers interpreted as Float32 values.
	*/
	const toFloat32Array = (base64Str) => {
		if (typeof Buffer !== "undefined") {
			const buf = Buffer.from(base64Str, "base64");
			if (buf.length % Float32Array.BYTES_PER_ELEMENT !== 0) throw new RangeError("Invalid base64-encoded float32 array: byte length must be a multiple of 4");
			return Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.length / Float32Array.BYTES_PER_ELEMENT));
		} else {
			const binaryStr = atob(base64Str);
			const len = binaryStr.length;
			const bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
			return Array.from(new Float32Array(bytes.buffer));
		}
	};
	exports.toFloat32Array = toFloat32Array;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/env.js
var require_env = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readEnv = void 0;
	/**
	* Read an environment variable.
	*
	* Trims beginning and trailing whitespace.
	*
	* Will return undefined if the environment variable doesn't exist or cannot be accessed.
	*/
	const readEnv = (env) => {
		try {
			if (typeof globalThis.process !== "undefined") return globalThis.process.env?.[env]?.trim() || void 0;
			if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.env?.get?.(env)?.trim() || void 0;
		} catch {
			return;
		}
	};
	exports.readEnv = readEnv;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/log.js
var require_log = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatRequestDetails = exports.parseLogLevel = void 0;
	exports.loggerFor = loggerFor;
	exports.isSensitiveQueryParameter = isSensitiveQueryParameter;
	exports.isSensitiveHeader = isSensitiveHeader;
	exports.redactURL = redactURL;
	const values_1 = require_values();
	const levelNumbers = {
		off: 0,
		error: 200,
		warn: 300,
		info: 400,
		debug: 500
	};
	const parseLogLevel = (maybeLevel, sourceName, client) => {
		if (!maybeLevel) return;
		if ((0, values_1.hasOwn)(levelNumbers, maybeLevel)) return maybeLevel;
		loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
	};
	exports.parseLogLevel = parseLogLevel;
	function noop() {}
	function makeLogFn(fnLevel, logger, logLevel) {
		if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
		else return logger[fnLevel].bind(logger);
	}
	const noopLogger = {
		error: noop,
		warn: noop,
		info: noop,
		debug: noop
	};
	let cachedLoggers = /* @__PURE__ */ new WeakMap();
	function loggerFor(client) {
		const logger = client.logger;
		const logLevel = client.logLevel ?? "off";
		if (!logger) return noopLogger;
		const cachedLogger = cachedLoggers.get(logger);
		if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
		const levelLogger = {
			error: makeLogFn("error", logger, logLevel),
			warn: makeLogFn("warn", logger, logLevel),
			info: makeLogFn("info", logger, logLevel),
			debug: makeLogFn("debug", logger, logLevel)
		};
		cachedLoggers.set(logger, [logLevel, levelLogger]);
		return levelLogger;
	}
	const sensitiveQueryNames = /* @__PURE__ */ new Set([
		"apikey",
		"accesstoken",
		"refreshtoken",
		"sessiontoken",
		"sessionid",
		"idtoken",
		"authtoken",
		"authorization",
		"token",
		"password",
		"clientsecret",
		"signingsecret",
		"xamzsecuritytoken",
		"xamzsignature",
		"xamzcredential"
	]);
	/** Recognizes credential-bearing query names across ordinary and provider authentication. */
	function isSensitiveQueryParameter(name) {
		const normalized = name.toLowerCase().replace(/[-_]/gu, "");
		return sensitiveQueryNames.has(normalized) || sensitiveQueryNames.has(normalized.replace(/^x/u, ""));
	}
	const sensitiveHeaderNames = /* @__PURE__ */ new Set([
		"authorization",
		"proxy-authorization",
		"api-key",
		"x-api-key",
		"x-amz-security-token",
		"cookie",
		"set-cookie",
		"x-session-token",
		"x-session-id",
		"x-auth-token",
		"x-id-token"
	]);
	/** Recognizes credential-bearing request headers across provider and workload authentication. */
	function isSensitiveHeader(name) {
		return sensitiveHeaderNames.has(name.toLowerCase().replace(/_/gu, "-")) || isSensitiveQueryParameter(name);
	}
	/** Removes credential-valued query parameters before a request URL reaches any logger. */
	function redactURL(value) {
		const url = new URL(value);
		url.username = "";
		url.password = "";
		url.hash = "";
		for (const name of url.searchParams.keys()) if (isSensitiveQueryParameter(name)) url.searchParams.set(name, "***");
		return url.href;
	}
	const formatRequestDetails = (details) => {
		if (details.options) {
			details.options = { ...details.options };
			delete details.options["headers"];
			if (details.options.path) {
				const path = details.options.path;
				const redacted = new URL(redactURL(new URL(path, "https://redacted.invalid").href));
				details.options.path = redacted.origin === "https://redacted.invalid" ? `${path.startsWith("/") ? "/" : ""}${redacted.pathname.slice(1)}${redacted.search}` : redacted.href;
			}
			if (details.options.query) details.options.query = Object.fromEntries(Object.entries(details.options.query).map(([name, value]) => [name, isSensitiveQueryParameter(name) ? "***" : value]));
		}
		if (details.url) details.url = redactURL(details.url);
		if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [name, isSensitiveHeader(name) ? "***" : value]));
		if ("retryOfRequestLogID" in details) {
			if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
			delete details.retryOfRequestLogID;
		}
		return details;
	};
	exports.formatRequestDetails = formatRequestDetails;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/uuid.js
var require_uuid = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.uuid4 = void 0;
	/**
	* https://stackoverflow.com/a/2117523
	*/
	let uuid4 = function() {
		const { crypto } = globalThis;
		if (crypto?.randomUUID) {
			exports.uuid4 = crypto.randomUUID.bind(crypto);
			return crypto.randomUUID();
		}
		const u8 = /* @__PURE__ */ new Uint8Array(1);
		const randomByte = crypto ? () => crypto.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
		return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
	};
	exports.uuid4 = uuid4;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/sleep.js
var require_sleep = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sleep = void 0;
	const sleep = (ms, ...signals) => new Promise((resolve, reject) => {
		const activeSignals = [...new Set(signals.filter((signal) => signal != null))];
		let timeout;
		let settled = false;
		const cleanup = () => {
			for (const signal of activeSignals) try {
				signal.removeEventListener("abort", abort);
			} catch {}
		};
		const settle = (callback) => {
			if (settled) return;
			settled = true;
			if (timeout !== void 0) {
				clearTimeout(timeout);
				timeout = void 0;
			}
			cleanup();
			callback();
		};
		const abort = () => {
			settle(() => reject());
		};
		if (activeSignals.some((signal) => signal.aborted)) {
			abort();
			return;
		}
		timeout = setTimeout(() => {
			settle(resolve);
		}, ms);
		for (const signal of activeSignals) {
			if (settled) break;
			try {
				signal.addEventListener("abort", abort, { once: true });
			} catch (error) {
				settle(() => reject(error));
			}
		}
		if (activeSignals.some((signal) => signal.aborted)) abort();
	});
	exports.sleep = sleep;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/qs/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RFC3986 = exports.RFC1738 = exports.formatters = exports.default_formatter = exports.default_format = void 0;
	exports.default_format = "RFC3986";
	exports.default_formatter = String;
	exports.formatters = {
		RFC1738: (v) => String(v).replace(/%20/g, "+"),
		RFC3986: exports.default_formatter
	};
	exports.RFC1738 = "RFC1738";
	exports.RFC3986 = "RFC3986";
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/qs/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.encode = exports.has = void 0;
	exports.merge = merge;
	exports.assign_single_source = assign_single_source;
	exports.decode = decode;
	exports.compact = compact;
	exports.is_regexp = is_regexp;
	exports.is_buffer = is_buffer;
	exports.combine = combine;
	exports.maybe_map = maybe_map;
	const formats_1 = require_formats();
	const values_1 = require_values();
	let cachedHas;
	const has = (obj, key) => {
		const resolvedHas = cachedHas ?? Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty);
		cachedHas = resolvedHas;
		return resolvedHas(obj, key);
	};
	exports.has = has;
	function isUnsafePropertyKey(key) {
		return key === "__proto__" || key === "constructor" || key === "prototype";
	}
	const maxAdoptedRecords = 1e4;
	function isIntrinsicFunctionPrototype(value, key, descriptor) {
		return typeof value === "function" && key === "prototype" && !descriptor.enumerable && !descriptor.configurable;
	}
	function isObjectLike(value) {
		return value !== null && (typeof value === "object" || typeof value === "function");
	}
	function rememberAdoption(state, target, key, value) {
		if (!isObjectLike(value)) return;
		if (state.adopted.length >= maxAdoptedRecords) throw new Error("Adopted record traversal exceeds the supported safety limit.");
		state.adopted.push({
			target,
			key
		});
	}
	function sanitizeAdoptions(state) {
		if (state.adopted.length === 0) return;
		const records = /* @__PURE__ */ new WeakMap();
		const visited = [];
		const locations = [];
		let inspectedProperties = 0;
		function inspect(value) {
			const known = records.get(value);
			if (known) return known;
			if (visited.length >= maxAdoptedRecords) throw new Error("Adopted record traversal exceeds the supported safety limit.");
			const keys = Reflect.ownKeys(value);
			if (keys.length > maxAdoptedRecords - inspectedProperties) throw new Error("Adopted record traversal exceeds the supported safety limit.");
			inspectedProperties += keys.length;
			const descriptors = Object.create(null);
			for (const key of keys) {
				const descriptor = Object.getOwnPropertyDescriptor(value, key);
				if (descriptor) Reflect.set(descriptors, key, descriptor);
			}
			const prototype = Object.getPrototypeOf(value);
			const array = (0, values_1.isArray)(value);
			const extensible = Object.isExtensible(value);
			const ordinary = typeof value !== "function" && (array ? prototype === Array.prototype : prototype === Object.prototype || prototype === null);
			const record = {
				value,
				descriptors,
				keys,
				prototype,
				parents: /* @__PURE__ */ new Set(),
				ordinary,
				array,
				detached: ordinary && (extensible || !Object.isFrozen(value)),
				unsafe: false,
				extensible
			};
			records.set(value, record);
			visited.push(record);
			return record;
		}
		for (const { target, key } of state.adopted) {
			const descriptor = Object.getOwnPropertyDescriptor(target, key);
			if (descriptor && "value" in descriptor && isObjectLike(descriptor.value)) locations.push({
				target,
				key,
				descriptor,
				record: inspect(descriptor.value)
			});
		}
		const detached = [];
		for (const record of visited) {
			for (const key of record.keys) {
				const descriptor = record.descriptors[key];
				if (!descriptor) continue;
				if (isUnsafePropertyKey(key)) {
					if (record.ordinary) {
						record.detached = true;
						record.unsafe = true;
					} else if (!isIntrinsicFunctionPrototype(record.value, key, descriptor)) throw new TypeError("Cannot safely sanitize an adopted callable or unsupported prototype.");
					continue;
				}
				if (!record.ordinary && !descriptor.enumerable) continue;
				if ("value" in descriptor && isObjectLike(descriptor.value)) inspect(descriptor.value).parents.add(record);
			}
			if (record.detached) detached.push(record);
		}
		for (let index = visited.length - 1; index >= 0; index -= 1) {
			const record = visited[index];
			if (record.ordinary) continue;
			for (const key of [
				"__proto__",
				"constructor",
				"prototype"
			]) {
				const descriptor = Object.getOwnPropertyDescriptor(record.value, key);
				if (descriptor && !isIntrinsicFunctionPrototype(record.value, key, descriptor)) throw new TypeError("Cannot safely sanitize an adopted callable or unsupported prototype.");
			}
		}
		const unsafe = visited.filter((record) => record.unsafe);
		for (const record of unsafe) for (const parent of record.parents) {
			if (!parent.ordinary) throw new TypeError("Cannot safely sanitize an adopted callable or unsupported prototype.");
			if (!parent.unsafe) {
				parent.unsafe = true;
				unsafe.push(parent);
			}
		}
		for (const record of detached) for (const parent of record.parents) {
			if (!parent.ordinary) continue;
			if (!parent.detached) {
				parent.detached = true;
				detached.push(parent);
			}
		}
		const copies = /* @__PURE__ */ new WeakMap();
		for (const record of detached) copies.set(record.value, record.array ? [] : Object.create(record.prototype));
		for (const record of detached) {
			const copy = copies.get(record.value);
			for (const key of record.keys) {
				if (isUnsafePropertyKey(key)) continue;
				const descriptor = record.descriptors[key];
				if (!descriptor) continue;
				if ("value" in descriptor && isObjectLike(descriptor.value) && copies.has(descriptor.value)) descriptor.value = copies.get(descriptor.value);
				Object.defineProperty(copy, key, descriptor);
			}
		}
		for (const { target, key, descriptor, record } of locations) {
			const value = copies.get(record.value) ?? record.value;
			if (value !== descriptor.value) Object.defineProperty(copies.get(target) ?? target, key, {
				...descriptor,
				value
			});
		}
		for (const record of detached) if (!record.extensible) Object.preventExtensions(copies.get(record.value));
	}
	function readPreparedTarget(state, target, key) {
		const prepared = state.preparedTargets.get(target);
		if (prepared?.has(key)) {
			const value = prepared.get(key);
			prepared.delete(key);
			return value;
		}
		return target[key];
	}
	function previewTarget(state, target, key) {
		const descriptor = Object.getOwnPropertyDescriptor(target, key);
		if (descriptor && "value" in descriptor) return descriptor.value;
		const value = Reflect.get(target, key, target);
		let prepared = state.preparedTargets.get(target);
		if (!prepared) {
			prepared = /* @__PURE__ */ new Map();
			state.preparedTargets.set(target, prepared);
		}
		prepared.set(key, value);
		return value;
	}
	function prepareMergeSource(target, source, state, assign = false) {
		if (!source || typeof source !== "object" || !target || typeof target !== "object") return source;
		let preparedTargets = state.preparedSources.get(source);
		if (!preparedTargets) {
			preparedTargets = /* @__PURE__ */ new WeakMap();
			state.preparedSources.set(source, preparedTargets);
		}
		const existing = preparedTargets.get(target);
		if (existing) return existing;
		state.inspectedSources += 1;
		if (state.inspectedSources > maxAdoptedRecords) throw new Error("Adopted record traversal exceeds the supported safety limit.");
		const sourceKeys = Reflect.ownKeys(source);
		if (sourceKeys.length > maxAdoptedRecords - state.inspectedSourceProperties) throw new Error("Adopted record traversal exceeds the supported safety limit.");
		state.inspectedSourceProperties += sourceKeys.length;
		const sourceIsArray = (0, values_1.isArray)(source);
		const prepared = sourceIsArray ? [] : Object.create(null);
		preparedTargets.set(target, prepared);
		if ((0, values_1.isArray)(target) && sourceIsArray && !assign) {
			const sourceLength = source.length;
			prepared.length = sourceLength;
			for (let index = 0; index < sourceLength; index += 1) {
				if (!(index in source)) continue;
				const value = source[index];
				if ((0, exports.has)(target, index)) {
					const targetValue = previewTarget(state, target, index);
					prepared[index] = targetValue && typeof targetValue === "object" && value && typeof value === "object" ? prepareMergeSource(targetValue, value, state) : value;
				} else prepared[index] = value;
			}
			return prepared;
		}
		const enumerableKeys = [];
		for (const key of sourceKeys) if (typeof key === "string" && Object.getOwnPropertyDescriptor(source, key)?.enumerable) enumerableKeys.push(key);
		for (const key of enumerableKeys) {
			if (isUnsafePropertyKey(key)) continue;
			const value = source[key];
			prepared[key] = !assign && (0, exports.has)(target, key) && value && typeof value === "object" ? prepareMergeSource(previewTarget(state, target, key), value, state) : value;
		}
		return prepared;
	}
	function prepareSource(target, source, state, assign = false) {
		const holder = { value: prepareMergeSource(target, source, state, assign) };
		rememberAdoption(state, holder, "value", holder.value);
		sanitizeAdoptions(state);
		return holder.value;
	}
	const hex_table = /* @__PURE__ */ (() => {
		const array = [];
		for (let i = 0; i < 256; ++i) array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
		return array;
	})();
	function compact_queue(queue) {
		while (queue.length > 1) {
			const item = queue.pop();
			if (!item) continue;
			const obj = item.obj[item.prop];
			if ((0, values_1.isArray)(obj)) {
				const compacted = [];
				for (const value of obj) if (value !== void 0) compacted.push(value);
				item.obj[item.prop] = compacted;
			}
		}
	}
	function array_to_object(source, options) {
		const obj = options && options.plainObjects ? Object.create(null) : {};
		for (let i = 0; i < source.length; ++i) if (source[i] !== void 0) obj[i] = source[i];
		return obj;
	}
	function mergeWithState(target, source, options, state) {
		if (!source) return target;
		if (typeof source !== "object") {
			if ((0, values_1.isArray)(target)) target.push(source);
			else if (target && typeof target === "object") {
				const propertyKey = typeof source === "string" || typeof source === "symbol" ? source : Reflect.ownKeys({ [source]: true })[0];
				if (!isUnsafePropertyKey(propertyKey) && (options && (options.plainObjects || options.allowPrototypes) || !(0, exports.has)(Object.prototype, propertyKey))) target[propertyKey] = true;
			} else return [target, source];
			return target;
		}
		if (!target || typeof target !== "object") return [target].concat(source);
		let mergeTarget = target;
		if ((0, values_1.isArray)(target) && !(0, values_1.isArray)(source)) mergeTarget = array_to_object(target, options);
		if ((0, values_1.isArray)(target) && (0, values_1.isArray)(source)) {
			const sourceLength = source.length;
			for (let i = 0; i < sourceLength; i += 1) if (i in source) {
				const item = source[i];
				if ((0, exports.has)(target, i)) {
					const targetItem = readPreparedTarget(state, target, i);
					if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
						const merged = mergeWithState(targetItem, item, options, state);
						target[i] = merged;
					} else {
						const adopted = item;
						target.push(adopted);
					}
				} else target[i] = item;
			}
			return target;
		}
		for (const key of Object.keys(source)) {
			if (isUnsafePropertyKey(key)) continue;
			const value = source[key];
			const adopted = (0, exports.has)(mergeTarget, key) ? mergeWithState(readPreparedTarget(state, mergeTarget, key), value, options, state) : value;
			mergeTarget[key] = adopted;
		}
		return mergeTarget;
	}
	function merge(target, source, options = {}) {
		const state = {
			adopted: [],
			preparedTargets: /* @__PURE__ */ new WeakMap(),
			preparedSources: /* @__PURE__ */ new WeakMap(),
			inspectedSources: 0,
			inspectedSourceProperties: 0
		};
		return mergeWithState(target, prepareSource(target, source, state), options, state);
	}
	function assign_single_source(target, source) {
		const prepared = prepareSource(target, source, {
			adopted: [],
			preparedTargets: /* @__PURE__ */ new WeakMap(),
			preparedSources: /* @__PURE__ */ new WeakMap(),
			inspectedSources: 0,
			inspectedSourceProperties: 0
		}, true);
		for (const key of Object.keys(prepared)) {
			if (isUnsafePropertyKey(key)) continue;
			target[key] = prepared[key];
		}
		return target;
	}
	function decode(str, _, charset) {
		const strWithoutPlus = str.replace(/\+/g, " ");
		if (charset === "iso-8859-1") return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
		try {
			return decodeURIComponent(strWithoutPlus);
		} catch {
			return strWithoutPlus;
		}
	}
	const limit = 1024;
	const encode = (str, _defaultEncoder, charset, _kind, format) => {
		if (str.length === 0) return str;
		let string = str;
		if (typeof str === "symbol") string = Symbol.prototype.toString.call(str);
		else if (typeof str !== "string") string = String(str);
		if (charset === "iso-8859-1") return escape(string).replace(/%u[0-9a-f]{4}/gi, ($0) => "%26%23" + Number.parseInt($0.slice(2), 16) + "%3B");
		let out = "";
		for (let j = 0; j < string.length;) {
			let segmentEnd = Math.min((Math.floor(j / limit) + 1) * limit, string.length);
			if (segmentEnd < string.length && string.codePointAt(segmentEnd - 1) > 65535) segmentEnd += 1;
			const segment = string.length >= limit ? string.slice(j, segmentEnd) : string;
			const arr = [];
			for (let i = 0; i < segment.length; ++i) {
				let c = segment.charCodeAt(i);
				if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats_1.RFC1738 && (c === 40 || c === 41)) {
					arr[arr.length] = segment.charAt(i);
					continue;
				}
				if (c < 128) {
					arr[arr.length] = hex_table[c];
					continue;
				}
				if (c < 2048) {
					arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
					continue;
				}
				if (c < 55296 || c >= 57344) {
					arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
					continue;
				}
				i += 1;
				c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
				arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
			}
			out += arr.join("");
			j = segmentEnd;
		}
		return out;
	};
	exports.encode = encode;
	function compact(value) {
		const queue = [{
			obj: { o: value },
			prop: "o"
		}];
		const refs = [];
		for (const item of queue) {
			const obj = item.obj[item.prop];
			const keys = Object.keys(obj);
			for (const key of keys) {
				const val = obj[key];
				if (typeof val === "object" && val !== null && !refs.includes(val)) {
					queue.push({
						obj,
						prop: key
					});
					refs.push(val);
				}
			}
		}
		compact_queue(queue);
		return value;
	}
	function is_regexp(obj) {
		return Object.prototype.toString.call(obj) === "[object RegExp]";
	}
	function is_buffer(obj) {
		if (!obj || typeof obj !== "object") return false;
		return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	}
	function combine(a, b) {
		return [].concat(a, b);
	}
	function maybe_map(val, fn) {
		if ((0, values_1.isArray)(val)) {
			const mapped = [];
			for (const item of val) mapped.push(fn(item));
			return mapped;
		}
		return fn(val);
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/qs/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.stringify = stringify;
	const utils_1 = require_utils$1();
	const formats_1 = require_formats();
	const values_1 = require_values();
	const array_prefix_generators = {
		brackets(prefix) {
			return String(prefix) + "[]";
		},
		comma: "comma",
		indices(prefix, key) {
			return String(prefix) + "[" + key + "]";
		},
		repeat(prefix) {
			return String(prefix);
		}
	};
	const push_to_array = function push_to_array(arr, value_or_array) {
		Array.prototype.push.apply(arr, (0, values_1.isArray)(value_or_array) ? value_or_array : [value_or_array]);
	};
	let toISOString;
	const defaults = {
		addQueryPrefix: false,
		allowDots: false,
		allowEmptyArrays: false,
		arrayFormat: "indices",
		charset: "utf-8",
		charsetSentinel: false,
		delimiter: "&",
		encode: true,
		encodeDotInKeys: false,
		encoder: utils_1.encode,
		encodeValuesOnly: false,
		format: formats_1.default_format,
		formatter: formats_1.default_formatter,
		/** @deprecated */
		indices: false,
		serializeDate(date) {
			return (toISOString ?? (toISOString = Function.prototype.call.bind(Date.prototype.toISOString)))(date);
		},
		skipNulls: false,
		strictNullHandling: false
	};
	function is_non_nullish_primitive(v) {
		return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
	}
	const sentinel = {};
	function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
		let obj = object;
		let tmp_sc = sideChannel;
		let step = 0;
		let find_flag = false;
		while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
			const pos = tmp_sc.get(object);
			step += 1;
			if (pos !== void 0) {
				if (pos === step) throw new RangeError("Cyclic object value");
				else find_flag = true;
			}
			if (tmp_sc.get(sentinel) === void 0) step = 0;
		}
		if (typeof filter === "function") obj = filter(prefix, obj);
		else if (obj instanceof Date) obj = serializeDate?.(obj);
		else if (generateArrayPrefix === "comma" && (0, values_1.isArray)(obj)) obj = (0, utils_1.maybe_map)(obj, (value) => {
			if (value instanceof Date) return serializeDate?.(value);
			return value;
		});
		if (obj === null) {
			if (strictNullHandling) return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
			obj = "";
		}
		if (is_non_nullish_primitive(obj) || (0, utils_1.is_buffer)(obj)) {
			if (encoder) {
				const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
				return [formatter?.(key_value) + "=" + formatter?.(encoder(obj, defaults.encoder, charset, "value", format))];
			}
			return [formatter?.(prefix) + "=" + formatter?.(String(obj))];
		}
		const values = [];
		if (obj === void 0) return values;
		let obj_keys;
		if (generateArrayPrefix === "comma" && (0, values_1.isArray)(obj)) {
			if (encodeValuesOnly && encoder) obj = (0, utils_1.maybe_map)(obj, encoder);
			obj_keys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
		} else if ((0, values_1.isArray)(filter)) obj_keys = filter;
		else {
			const keys = Object.keys(obj);
			if (sort) keys.sort(sort);
			obj_keys = keys;
		}
		const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
		const adjusted_prefix = commaRoundTrip && (0, values_1.isArray)(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
		if (allowEmptyArrays && (0, values_1.isArray)(obj) && obj.length === 0) return adjusted_prefix + "[]";
		for (const key of obj_keys) {
			const value = typeof key === "object" && key.value !== void 0 ? key.value : obj[key];
			if (skipNulls && value === null) continue;
			const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
			let key_prefix;
			if ((0, values_1.isArray)(obj)) key_prefix = typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix;
			else key_prefix = adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
			sideChannel.set(object, step);
			const valueSideChannel = new WeakMap([[sentinel, sideChannel]]);
			push_to_array(values, inner_stringify(value, key_prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && (0, values_1.isArray)(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
		}
		return values;
	}
	function normalize_stringify_options(opts = defaults) {
		if (opts.allowEmptyArrays !== void 0 && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
		if (opts.encodeDotInKeys !== void 0 && typeof opts.encodeDotInKeys !== "boolean") throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
		if (opts.encoder !== null && opts.encoder !== void 0 && typeof opts.encoder !== "function") throw new TypeError("Encoder has to be a function.");
		const charset = opts.charset || defaults.charset;
		if (opts.charset !== void 0 && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
		let format = formats_1.default_format;
		if (opts.format !== void 0) {
			if (!(0, utils_1.has)(formats_1.formatters, opts.format)) throw new TypeError("Unknown format option provided.");
			format = opts.format;
		}
		const formatter = formats_1.formatters[format];
		let filter = defaults.filter;
		if (typeof opts.filter === "function" || (0, values_1.isArray)(opts.filter)) filter = opts.filter;
		let arrayFormat;
		if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) arrayFormat = opts.arrayFormat;
		else if ("indices" in opts) arrayFormat = opts.indices ? "indices" : "repeat";
		else arrayFormat = defaults.arrayFormat;
		if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
		let allowDots;
		if (opts.allowDots === void 0) allowDots = !!opts.encodeDotInKeys === true ? true : defaults.allowDots;
		else allowDots = !!opts.allowDots;
		return {
			addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
			allowDots,
			allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
			arrayFormat,
			charset,
			charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
			commaRoundTrip: !!opts.commaRoundTrip,
			delimiter: opts.delimiter === void 0 ? defaults.delimiter : opts.delimiter,
			encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
			encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
			encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
			encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
			filter,
			format,
			formatter,
			serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
			skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
			sort: typeof opts.sort === "function" ? opts.sort : null,
			strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
		};
	}
	function stringify(object, opts = {}) {
		let obj = object;
		const options = normalize_stringify_options(opts);
		let obj_keys;
		let filter;
		if (typeof options.filter === "function") {
			filter = options.filter;
			obj = filter("", obj);
		} else if ((0, values_1.isArray)(options.filter)) {
			filter = options.filter;
			obj_keys = filter;
		}
		const keys = [];
		if (typeof obj !== "object" || obj === null) return "";
		const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
		const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
		if (!obj_keys) obj_keys = Object.keys(obj);
		if (options.sort) obj_keys.sort(options.sort);
		const sideChannel = /* @__PURE__ */ new WeakMap();
		for (const key of obj_keys) {
			if (options.skipNulls && obj[key] === null) continue;
			push_to_array(keys, inner_stringify(obj[key], key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
		}
		const joined = keys.join(options.delimiter);
		let prefix = options.addQueryPrefix === true ? "?" : "";
		if (options.charsetSentinel) prefix += options.charset === "iso-8859-1" ? "utf8=%26%2310003%3B&" : "utf8=%E2%9C%93&";
		return joined.length > 0 ? prefix + joined : "";
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/query.js
var require_query = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.stringifyQuery = stringifyQuery;
	const qs = require_tslib().__importStar(require_stringify());
	function stringifyQuery(query) {
		return qs.stringify(query, { arrayFormat: "brackets" });
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const tslib_1 = require_tslib();
	tslib_1.__exportStar(require_values(), exports);
	tslib_1.__exportStar(require_base64(), exports);
	tslib_1.__exportStar(require_env(), exports);
	tslib_1.__exportStar(require_log(), exports);
	tslib_1.__exportStar(require_uuid(), exports);
	tslib_1.__exportStar(require_sleep(), exports);
	tslib_1.__exportStar(require_query(), exports);
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/bedrock.js
var require_bedrock = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.brand_privateBedrockClient = void 0;
	exports.errorWithCause = errorWithCause;
	exports.normalizeOptionalString = normalizeOptionalString;
	exports.parseBedrockEndpointHostname = parseBedrockEndpointHostname;
	exports.resolveBedrockEndpoint = resolveBedrockEndpoint;
	exports.assertBedrockRequestOrigin = assertBedrockRequestOrigin;
	exports.assertBedrockWebSocketOrigin = assertBedrockWebSocketOrigin;
	exports.assertProviderOwnsAuthorization = assertProviderOwnsAuthorization;
	exports.assertValidBedrockBearerCredential = assertValidBedrockBearerCredential;
	exports.prepareBedrockAuth = prepareBedrockAuth;
	exports.resolveBedrockBearerAuth = resolveBedrockBearerAuth;
	const Errors = require_tslib().__importStar(require_error());
	const utils_1 = require_utils();
	/** Identifies legacy Bedrock clients without importing the client class into WebSocket modules. */
	exports.brand_privateBedrockClient = Symbol.for("openai.privateBedrockClient");
	/** Wraps a provider failure in an SDK error while preserving its original cause. */
	function errorWithCause(message, cause) {
		const error = new Errors.OpenAIError(message);
		error.cause = cause;
		return error;
	}
	/** Trims a configuration string, treating missing and whitespace-only values as absent. */
	function normalizeOptionalString(value) {
		return (typeof value === "string" ? value.trim() : void 0) || void 0;
	}
	function normalizeBaseURL(baseURL) {
		const url = new URL(baseURL);
		const responsesMatch = url.pathname.match(/\/responses(?:\/.*)?$/);
		if (responsesMatch?.index !== void 0) url.pathname = url.pathname.slice(0, responsesMatch.index) || "/";
		return url.toString().replace(/\/$/, "");
	}
	function resolveRuntimeDnsSuffixes(region) {
		if (region.startsWith("cn-")) return ["amazonaws.com.cn", "api.amazonwebservices.com.cn"];
		if (region.startsWith("eusc-")) return ["amazonaws.eu", "api.amazonwebservices.eu"];
		if (region.startsWith("us-iso-")) return ["c2s.ic.gov", "api.aws.ic.gov"];
		if (region.startsWith("us-isob-")) return ["sc2s.sgov.gov", "api.aws.scloud"];
		if (region.startsWith("eu-isoe-")) return ["cloud.adc-e.uk", "api.cloud-aws.adc-e.uk"];
		if (region.startsWith("us-isof-")) return ["csp.hci.ic.gov", "api.aws.hci.ic.gov"];
		return ["amazonaws.com", "api.aws"];
	}
	/** Identifies a canonical Amazon Bedrock hostname and its embedded AWS region. */
	function parseBedrockEndpointHostname(hostname) {
		const [service, region, ...suffixParts] = (hostname.endsWith(".") ? hostname.slice(0, -1) : hostname).toLowerCase().split(".");
		const suffix = suffixParts.join(".");
		if (service === "bedrock-mantle" && region && /^[a-z0-9-]+$/.test(region) && suffix === "api.aws") return {
			endpoint: "mantle",
			region
		};
		if ((service === "bedrock-runtime" || service === "bedrock-runtime-fips") && region) {
			const [standardSuffix, dualStackSuffix] = resolveRuntimeDnsSuffixes(region);
			if (suffix === standardSuffix || suffix === dualStackSuffix) return {
				endpoint: "runtime",
				region
			};
		}
	}
	/** Rejects insecure or mismatched canonical Amazon Bedrock endpoint overrides. */
	function validateCanonicalBedrockEndpoint(baseURL, endpoint, region) {
		const parsedBaseURL = new URL(baseURL);
		const canonicalEndpoint = parseBedrockEndpointHostname(parsedBaseURL.hostname);
		if (canonicalEndpoint && parsedBaseURL.protocol !== "https:") throw new Errors.OpenAIError("Canonical Amazon Bedrock endpoints require HTTPS.");
		if (canonicalEndpoint && canonicalEndpoint.endpoint !== endpoint) throw new Errors.OpenAIError(`The Bedrock ${canonicalEndpoint.endpoint} hostname does not match the selected \`${endpoint}\` endpoint. Set \`endpoint: '${canonicalEndpoint.endpoint}'\` to use this hostname.`);
		if (canonicalEndpoint && region && canonicalEndpoint.region !== region) throw new Errors.OpenAIError(`The Bedrock endpoint region \`${canonicalEndpoint.region}\` does not match the configured AWS region \`${region}\`.`);
	}
	function validateBedrockEndpointSelection(endpoint) {
		if (endpoint !== void 0 && endpoint !== "mantle" && endpoint !== "runtime") throw new Errors.OpenAIError("The Bedrock `endpoint` must be either `mantle` or `runtime`.");
	}
	/**
	* Resolves the Bedrock endpoint family, region, and API root from configuration.
	*
	* Region precedence is `region`, `AWS_REGION`, then `AWS_DEFAULT_REGION`.
	* Endpoint precedence is `baseURL`, `AWS_BEDROCK_BASE_URL`, then the regional
	* selected endpoint; an explicit `null` base URL skips the environment override.
	* Existing `/responses` suffixes and trailing slashes are removed. Canonical
	* AWS hostnames infer the endpoint family when none is selected explicitly.
	* Other configured URLs and derived endpoints default to Mantle.
	*
	* @throws {Errors.OpenAIError} If an option is invalid, a canonical hostname
	* conflicts with the endpoint family, or the default endpoint needs a region.
	*/
	function resolveBedrockEndpoint(options) {
		validateBedrockEndpointSelection(options.endpoint);
		if (options.region !== void 0 && !normalizeOptionalString(options.region)) throw new Errors.OpenAIError("The Bedrock AWS `region` must not be empty.");
		if (options.baseURL !== void 0 && options.baseURL !== null && !normalizeOptionalString(options.baseURL)) throw new Errors.OpenAIError("The Bedrock `baseURL` must not be empty.");
		const region = normalizeOptionalString(options.region) ?? normalizeOptionalString((0, utils_1.readEnv)("AWS_REGION")) ?? normalizeOptionalString((0, utils_1.readEnv)("AWS_DEFAULT_REGION"));
		if (region && !/^[a-z]{2,8}(?:-[a-z0-9]+)+-\d+$/.test(region)) throw new Errors.OpenAIError("The Bedrock AWS `region` is invalid. Use a standard AWS region such as `us-east-1`.");
		const configuredBaseURL = options.baseURL === void 0 ? normalizeOptionalString((0, utils_1.readEnv)("AWS_BEDROCK_BASE_URL")) : normalizeOptionalString(options.baseURL);
		if (configuredBaseURL) {
			const baseURL = normalizeBaseURL(configuredBaseURL);
			const endpoint = options.endpoint ?? parseBedrockEndpointHostname(new URL(baseURL).hostname)?.endpoint ?? "mantle";
			validateCanonicalBedrockEndpoint(baseURL, endpoint, region);
			return {
				endpoint,
				region,
				baseURL
			};
		}
		const endpoint = options.endpoint ?? "mantle";
		if (!region) throw new Errors.OpenAIError("Bedrock requires an AWS region. Pass `region` to `bedrock(...)`, or set `AWS_REGION` or `AWS_DEFAULT_REGION`.");
		return {
			endpoint,
			region,
			baseURL: `https://${endpoint === "runtime" ? `bedrock-runtime.${region}.${resolveRuntimeDnsSuffixes(region)[0]}` : `bedrock-mantle.${region}.api.aws`}/openai/v1`
		};
	}
	/**
	* Ensures Bedrock credentials are only attached to the configured endpoint origin.
	*
	* @throws {Errors.OpenAIError} If either URL is not HTTP(S) or the request targets a different origin.
	*/
	function assertBedrockRequestOrigin(baseURL, requestURL) {
		const expectedURL = new URL(baseURL);
		const request = new URL(requestURL);
		const expectedOrigin = expectedURL.origin;
		const requestOrigin = request.origin;
		if (expectedURL.protocol !== "http:" && expectedURL.protocol !== "https:" || request.protocol !== "http:" && request.protocol !== "https:" || requestOrigin !== expectedOrigin) throw new Errors.OpenAIError(`Bedrock request origin \`${requestOrigin}\` does not match the configured base URL origin \`${expectedOrigin}\`.`);
	}
	/** Validates a final WebSocket URL before a legacy Bedrock client resolves or attaches credentials. */
	function assertBedrockWebSocketOrigin(client, requestURL) {
		if (typeof client !== "object" || client === null || !(exports.brand_privateBedrockClient in client)) return;
		const normalizedRequestURL = new URL(requestURL);
		if (normalizedRequestURL.protocol === "wss:") normalizedRequestURL.protocol = "https:";
		else if (normalizedRequestURL.protocol === "ws:") normalizedRequestURL.protocol = "http:";
		assertBedrockRequestOrigin(client.baseURL, normalizedRequestURL.toString());
	}
	/**
	* Rejects caller-provided authorization headers that conflict with provider authentication.
	*
	* @throws {Errors.OpenAIError} If an `Authorization` header is already present.
	*/
	function assertProviderOwnsAuthorization(headers) {
		if (headers.has("authorization")) throw new Errors.OpenAIError("Bedrock provider authentication cannot be combined with a custom `Authorization` header.");
	}
	/** Rejects non-HTTP field bytes without retaining or exposing a bearer credential. */
	function assertValidBedrockBearerCredential(credential) {
		if (/^[\t ]|[\t ]$/.test(credential)) throw new TypeError("Bedrock bearer credential contains an invalid HTTP header value.");
		for (const character of credential) {
			const value = character.codePointAt(0) ?? 0;
			if (value < 32 && value !== 9 || value === 127 || value > 255) throw new TypeError("Bedrock bearer credential contains an invalid HTTP header value.");
		}
	}
	function createBedrockUserAbortError(signal) {
		const error = new Errors.APIUserAbortError();
		Object.defineProperty(error, "cause", {
			value: signal.reason,
			writable: true,
			configurable: true
		});
		return error;
	}
	function removeBedrockAbortListener(signal, listener) {
		try {
			signal.removeEventListener("abort", listener);
		} catch {}
	}
	function resolveAbortableBedrockAuth(operation, signals, failure) {
		return new Promise((resolve, reject) => {
			let settled = false;
			const listeners = [];
			const removeListeners = () => {
				while (listeners.length > 0) {
					const registered = listeners.pop();
					if (registered) removeBedrockAbortListener(registered.signal, registered.listener);
				}
			};
			failure.removeListeners = removeListeners;
			const settle = (result) => {
				if (settled) return;
				settled = true;
				if ("value" in result) resolve(result.value);
				else {
					removeListeners();
					reject(result.error);
				}
			};
			const rejectSignalFailure = (error) => {
				if (failure.error) return;
				failure.error = { value: error };
				settle({ error });
			};
			const registerAbortListener = (signal) => {
				const onAbort = () => {
					if (failure.error) return;
					try {
						rejectSignalFailure(createBedrockUserAbortError(signal));
					} catch (error) {
						rejectSignalFailure(error);
					}
				};
				try {
					if (signal.aborted) {
						onAbort();
						return false;
					}
					listeners.push({
						signal,
						listener: onAbort
					});
					signal.addEventListener("abort", onAbort, { once: true });
					if (settled) {
						removeBedrockAbortListener(signal, onAbort);
						return false;
					}
					if (signal.aborted) {
						onAbort();
						return false;
					}
				} catch (error) {
					if (settled) removeBedrockAbortListener(signal, onAbort);
					else rejectSignalFailure(error);
					return false;
				}
				return true;
			};
			for (const signal of signals) if (!registerAbortListener(signal)) return;
			let pending;
			try {
				pending = operation();
			} catch (error) {
				settle({ error });
				return;
			}
			const observeResult = async () => {
				try {
					settle({ value: await pending });
				} catch (error) {
					settle({ error });
				}
			};
			observeResult();
		});
	}
	/**
	* Resolves Bedrock authentication work with caller cancellation, then applies
	* its result synchronously after the final cancellation checks.
	*
	* @internal
	*/
	async function prepareBedrockAuth(request, context, operation) {
		const signals = [];
		for (const signal of [context.options.signal, request.signal]) if (signal != null && !signals.includes(signal)) signals.push(signal);
		const signalFailure = {};
		let value;
		try {
			try {
				value = signals.length > 0 ? await resolveAbortableBedrockAuth(operation.resolve, signals, signalFailure) : await operation.resolve();
			} catch (cause) {
				if (signalFailure.error && Object.is(cause, signalFailure.error.value)) throw cause;
				throw errorWithCause(operation.failureMessage, cause);
			}
			if (signalFailure.error) throw signalFailure.error.value;
			for (const signal of signals) if (signal.aborted) throw createBedrockUserAbortError(signal);
		} finally {
			signalFailure.removeListeners?.();
		}
		operation.apply(value);
	}
	var BedrockBearerAuth = class {
		constructor(tokenProvider) {
			this.tokenProvider = tokenProvider;
		}
		async prepareRequest(request, context) {
			const headers = new Headers(request.headers);
			assertProviderOwnsAuthorization(headers);
			await prepareBedrockAuth(request, context, {
				resolve: () => this.tokenProvider(),
				failureMessage: "Failed to resolve a bearer credential for Bedrock.",
				apply: (token) => {
					if (typeof token !== "string" || !token.trim()) throw new Errors.OpenAIError("The Bedrock bearer credential provider must return a non-empty string.");
					assertValidBedrockBearerCredential(token);
					try {
						headers.set("authorization", `Bearer ${token}`);
					} catch (error) {
						if (error instanceof TypeError) throw new TypeError("Bedrock bearer credential contains an invalid HTTP header value.");
						throw error;
					}
					request.redirect = "manual";
					request.headers = headers;
				}
			});
		}
	};
	/**
	* Resolves a bearer-authentication factory without calling token providers eagerly.
	*
	* Explicit `tokenProvider` and `apiKey` options are mutually exclusive. When
	* neither is set, `AWS_BEARER_TOKEN_BEDROCK` is used unless environment
	* credentials are disabled or `apiKey` is explicitly `null`.
	*
	* @throws {Errors.OpenAIError} If an explicit key is empty or multiple bearer
	* credential sources are configured.
	*/
	function resolveBedrockBearerAuth(options, { allowEnvironment = true } = {}) {
		if (options.apiKey !== void 0 && options.apiKey !== null && (typeof options.apiKey !== "string" || !options.apiKey.trim())) throw new Errors.OpenAIError("The Bedrock bearer credential must not be empty.");
		if (options.apiKey != null && options.tokenProvider) throw new Errors.OpenAIError("The `apiKey` and `tokenProvider` options are mutually exclusive. Configure only one.");
		if (options.tokenProvider) {
			const tokenProvider = options.tokenProvider;
			return {
				factory: () => new BedrockBearerAuth(tokenProvider),
				explicit: true
			};
		}
		if (options.apiKey != null) {
			const apiKey = options.apiKey;
			return {
				factory: () => new BedrockBearerAuth(async () => apiKey),
				explicit: true
			};
		}
		if (allowEnvironment && options.apiKey !== null && (0, utils_1.readEnv)("AWS_BEARER_TOKEN_BEDROCK")) return {
			explicit: false,
			factory: () => new BedrockBearerAuth(async () => {
				const token = (0, utils_1.readEnv)("AWS_BEARER_TOKEN_BEDROCK");
				if (!token) throw new Errors.OpenAIError("Could not find credentials for Bedrock. Set `AWS_BEARER_TOKEN_BEDROCK` or configure AWS credential authentication.");
				return token;
			})
		};
		return {
			factory: void 0,
			explicit: false
		};
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/realtime-credentials.js
var require_realtime_credentials = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.setRealtimeAPIKeyCacheContext = setRealtimeAPIKeyCacheContext;
	exports.getDeferredRealtimeAPIKeyCache = getDeferredRealtimeAPIKeyCache;
	exports.validateCapturedAPIKey = validateCapturedAPIKey;
	exports.getRealtimeAPIKey = getRealtimeAPIKey;
	exports.resolveRealtimeAPIKey = resolveRealtimeAPIKey;
	const bedrock_1 = require_bedrock();
	const realtimeCacheContext = Symbol.for("openai.realtimeAPIKeyCacheContext");
	let cacheContext;
	/** Installs the Node transport's invocation context without loading Node in the base client. @internal */
	function setRealtimeAPIKeyCacheContext(context) {
		cacheContext = context;
	}
	/** Reserves a deferred commit when the base hook is entered for this invocation. @internal */
	function getDeferredRealtimeAPIKeyCache(client) {
		const deferred = client[realtimeCacheContext]?.getStore();
		return deferred?.client === client ? deferred : void 0;
	}
	/** Applies the Bedrock getter's validation when a captured credential does not enter the cache. @internal */
	function validateCapturedAPIKey(client, credential) {
		if (credential !== null && bedrock_1.brand_privateBedrockClient in client) (0, bedrock_1.assertValidBedrockBearerCredential)(credential);
		return credential;
	}
	/** Selects a captured credential without treating an explicit null as absent. @internal */
	function getRealtimeAPIKey(client, captured) {
		return captured === void 0 ? client?.apiKey : captured;
	}
	/**
	* Captures the key belonging to this request or factory invocation while retaining the
	* existing boolean credential-hook contract. Legacy overrides that do not
	* capture a key keep their shared-property behavior and remain responsible for
	* synchronizing concurrent credential updates.
	* @internal
	*/
	async function resolveRealtimeAPIKey(client, deferCache = false) {
		let apiKey;
		const current = {
			client,
			commit: () => apiKey === void 0 ? client.apiKey : apiKey
		};
		const capture = (resolved) => {
			apiKey = resolved;
		};
		const invoke = () => client._callApiKey(capture);
		const context = client[realtimeCacheContext] ?? cacheContext;
		if (deferCache && context && !client[realtimeCacheContext]) Object.defineProperty(client, realtimeCacheContext, { value: context });
		const isProvider = await (context ? context.run(deferCache ? current : void 0, invoke) : invoke());
		return {
			apiKey: apiKey === void 0 ? client.apiKey : apiKey,
			isProvider,
			commit: () => {
				const hookKey = current.providerKey !== void 0 && apiKey !== void 0 && apiKey !== current.providerKey ? validateCapturedAPIKey(client, apiKey) : void 0;
				const cached = current.commit();
				return hookKey === void 0 ? validateCapturedAPIKey(client, cached) : hookKey;
			}
		};
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/ws-adapter-node.js
var require_ws_adapter_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NodeWebSocket = void 0;
	exports.snapshotNodeWebSocketOptions = snapshotNodeWebSocketOptions;
	const node_async_hooks_1 = __require("node:async_hooks");
	const ws_1 = require_ws$1();
	(0, require_realtime_credentials().setRealtimeAPIKeyCacheContext)(new node_async_hooks_1.AsyncLocalStorage());
	function copyTLSMaterial(value) {
		return ArrayBuffer.isView(value) ? Buffer.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)) : value;
	}
	/** Snapshot caller headers and TLS identity before an async reconnect credential refresh. */
	function snapshotNodeWebSocketOptions(options) {
		const captured = {
			...options,
			headers: Object.fromEntries(Object.entries(options?.headers ?? {}).map(([name, value]) => [name, Array.isArray(value) ? [...value] : value]))
		};
		const { ca, cert, crl, key, pfx } = captured;
		if (ca !== void 0) captured.ca = Array.isArray(ca) ? ca.map(copyTLSMaterial) : copyTLSMaterial(ca);
		if (cert !== void 0) captured.cert = Array.isArray(cert) ? cert.map(copyTLSMaterial) : copyTLSMaterial(cert);
		if (crl !== void 0) captured.crl = Array.isArray(crl) ? crl.map(copyTLSMaterial) : copyTLSMaterial(crl);
		if (key !== void 0) captured.key = Array.isArray(key) ? key.map((value) => typeof value === "string" || ArrayBuffer.isView(value) ? copyTLSMaterial(value) : {
			...value,
			pem: copyTLSMaterial(value.pem)
		}) : copyTLSMaterial(key);
		if (pfx !== void 0) captured.pfx = Array.isArray(pfx) ? pfx.map((value) => typeof value === "string" || ArrayBuffer.isView(value) ? copyTLSMaterial(value) : {
			...value,
			buf: copyTLSMaterial(value.buf)
		}) : copyTLSMaterial(pfx);
		if ("session" in captured && Buffer.isBuffer(captured.session)) captured.session = Buffer.from(captured.session);
		if ("ALPNProtocols" in captured) {
			if (Array.isArray(captured.ALPNProtocols)) captured.ALPNProtocols = [...captured.ALPNProtocols];
			else if (ArrayBuffer.isView(captured.ALPNProtocols)) {
				const { buffer, byteOffset, byteLength } = captured.ALPNProtocols;
				captured.ALPNProtocols = Buffer.from(new Uint8Array(buffer, byteOffset, byteLength));
			}
		}
		return captured;
	}
	exports.NodeWebSocket = class NodeWebSocket {
		/** Wraps an existing socket created by the optional `ws` package. */
		constructor(ws) {
			/** Maps `(event, originalListener)` to every wrapped registration in listener order. */
			this._listenerMap = /* @__PURE__ */ new Map();
			this._ws = ws;
			this._ws.on("redirect", (_url, request) => {
				try {
					if ((0, ws_1.protectWebSocketOptionsFromCredentialRedirects)({
						followRedirects: true,
						headers: request.getHeaders()
					}).followRedirects) return;
				} catch {}
				this._ws.terminate();
			});
		}
		/** The underlying `ws` socket; accessing it makes calling code Node.js-specific. */
		get platformSocket() {
			return this._ws;
		}
		/** Current numeric socket connection state, using standard WebSocket values. */
		get readyState() {
			return this._ws.readyState;
		}
		/** Sends a text or binary frame through the underlying `ws` connection. */
		send(data) {
			this._ws.send(data);
		}
		/** Initiates the socket's closing handshake with an optional code and reason. */
		close(code, reason) {
			this._ws.close(code, reason);
		}
		/** Registers a listener with normalized message payloads and close reasons. */
		on(event, listener) {
			const wrapped = NodeWebSocket._wrapListener(event, listener);
			this._registerListener(event, listener, wrapped);
		}
		/** Removes the platform listener associated with the original callback. */
		off(event, listener) {
			const [wrapped] = (this._listenerMap.get(event)?.get(listener))?.slice(-1) ?? [];
			if (!wrapped) return;
			this._removeListener(event, listener, wrapped);
		}
		/** Registers a listener that is removed before it handles its first event. */
		once(event, listener) {
			let fired = false;
			const wrapped = NodeWebSocket._wrapListener(event, (...args) => {
				if (fired) return;
				fired = true;
				this._removeListener(event, listener, wrapped);
				listener(...args);
			});
			this._registerListener(event, listener, wrapped);
		}
		_registerListener(event, listener, wrapped) {
			const byListener = this._listenersFor(event);
			const wrappedListeners = byListener.get(listener);
			if (wrappedListeners) wrappedListeners.push(wrapped);
			else byListener.set(listener, [wrapped]);
			this._ws.on(event, wrapped);
		}
		_removeListener(event, listener, wrapped) {
			const byListener = this._listenerMap.get(event);
			const wrappedListeners = byListener?.get(listener);
			if (!byListener || !wrappedListeners) return;
			const index = wrappedListeners.lastIndexOf(wrapped);
			if (index === -1) return;
			wrappedListeners.splice(index, 1);
			if (wrappedListeners.length === 0) byListener.delete(listener);
			if (byListener.size === 0) this._listenerMap.delete(event);
			this._ws.removeListener(event, wrapped);
		}
		_listenersFor(event) {
			let map = this._listenerMap.get(event);
			if (!map) {
				map = /* @__PURE__ */ new Map();
				this._listenerMap.set(event, map);
			}
			return map;
		}
		/**
		* Normalizes `ws` message payloads: text frames become strings,
		* binary frames stay as `Buffer`, and fragmented frames are merged.
		*/
		static _normalizeMessageData(data, isBinary) {
			if (!isBinary) {
				if (Array.isArray(data)) return Buffer.concat(data).toString();
				if (data instanceof ArrayBuffer) return Buffer.from(data).toString();
				return data.toString();
			}
			if (Array.isArray(data)) return Buffer.concat(data);
			if (data instanceof ArrayBuffer) return Buffer.from(data);
			return data;
		}
		static _wrapListener(event, listener) {
			switch (event) {
				case "message": return (data, isBinary) => {
					listener(NodeWebSocket._normalizeMessageData(data, isBinary), isBinary);
				};
				case "close": return (code, reason) => {
					listener(code, reason.toString());
				};
				default: return listener;
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/core/EventEmitter.js
var require_EventEmitter = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _EventEmitter_instances;
	var _EventEmitter_listeners;
	var _EventEmitter_emittedListenerRegistrations;
	var _EventEmitter_pendingListenerCleanup;
	var _EventEmitter_listenerDispatchDepth;
	var _EventEmitter_onceForEmitted;
	var _EventEmitter_removeEmittedListener;
	var _EventEmitter_cleanupEmittedListeners;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InternalEventEmitter = exports.EventEmitter = void 0;
	const tslib_1 = require_tslib();
	/** Registers strongly typed event listeners and awaits individual emitted events. */
	var EventEmitter = class {
		constructor() {
			_EventEmitter_instances.add(this);
			_EventEmitter_listeners.set(this, Object.create(null));
			_EventEmitter_emittedListenerRegistrations.set(this, /* @__PURE__ */ new WeakMap());
			_EventEmitter_pendingListenerCleanup.set(this, /* @__PURE__ */ new Set());
			_EventEmitter_listenerDispatchDepth.set(this, 0);
		}
		/**
		* Adds the listener function to the end of the listeners array for the event.
		* No checks are made to see if the listener has already been added. Multiple calls passing
		* the same combination of event and listener will result in the listener being added, and
		* called, multiple times.
		* @returns this, so that calls can be chained
		*/
		on(event, listener) {
			var _a;
			((_a = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f"))[event] || (_a[event] = [])).push({ listener });
			return this;
		}
		/**
		* Removes the specified listener from the listener array for the event.
		* off() will remove, at most, one instance of a listener from the listener array. If any single
		* listener has been added multiple times to the listener array for the specified event, then
		* off() must be called multiple times to remove each instance.
		* @returns this, so that calls can be chained
		*/
		off(event, listener) {
			const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
			if (!listeners) return this;
			const emittedRegistration = tslib_1.__classPrivateFieldGet(this, _EventEmitter_emittedListenerRegistrations, "f").get(listener);
			if (emittedRegistration?.event === event && !emittedRegistration.registration.removed && !emittedRegistration.registration.detached) {
				tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_removeEmittedListener).call(this, event, emittedRegistration.registration);
				return this;
			}
			const index = listeners.findIndex((registration) => !registration.removed && registration.listener === listener);
			if (index !== -1) listeners.splice(index, 1);
			return this;
		}
		/**
		* Adds a one-time listener function for the event. The next time the event is triggered,
		* this listener is removed and then invoked.
		* @returns this, so that calls can be chained
		*/
		once(event, listener) {
			var _a;
			((_a = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f"))[event] || (_a[event] = [])).push({
				listener,
				once: true
			});
			return this;
		}
		/**
		* This is similar to `.once()`, but returns a Promise that resolves the next time
		* the event is triggered, instead of calling a listener callback.
		* Events without arguments resolve to `undefined`, single-argument events resolve
		* to that argument, and events with multiple arguments resolve to an argument tuple.
		*
		* @returns A promise for the next event, or a rejection if an error occurs first.
		* Requesting the `error` event resolves with the emitted error instead.
		*
		* Example:
		*
		*   const message = await stream.emitted('message') // rejects if the stream errors
		*/
		emitted(event) {
			return new Promise((resolve, reject) => {
				const listeners = {
					onError: (error) => {
						this.off(event, listeners.onEvent);
						reject(error);
					},
					onEvent: (...values) => {
						if (event !== "error") this.off("error", listeners.onError);
						resolve(values.length > 1 ? values : values[0]);
					}
				};
				if (event !== "error") tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_onceForEmitted).call(this, "error", listeners.onError);
				tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_onceForEmitted).call(this, event, listeners.onEvent);
			});
		}
		_emit(event, ...args) {
			const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
			if (listeners) {
				tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event] = listeners.filter((listener) => {
					if (listener.once) listener.detached = true;
					return !listener.once && !listener.removed;
				});
				let listenerThrew = false;
				let firstListenerError;
				tslib_1.__classPrivateFieldSet(this, _EventEmitter_listenerDispatchDepth, tslib_1.__classPrivateFieldGet(this, _EventEmitter_listenerDispatchDepth, "f") + 1, "f");
				try {
					for (const registration of listeners) if (!registration.removed) try {
						const { listener } = registration;
						listener(...args);
					} catch (error) {
						if (!listenerThrew) {
							listenerThrew = true;
							firstListenerError = error;
						}
					}
				} finally {
					tslib_1.__classPrivateFieldSet(this, _EventEmitter_listenerDispatchDepth, tslib_1.__classPrivateFieldGet(this, _EventEmitter_listenerDispatchDepth, "f") - 1, "f");
					if (tslib_1.__classPrivateFieldGet(this, _EventEmitter_listenerDispatchDepth, "f") === 0) tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_cleanupEmittedListeners).call(this);
				}
				if (listenerThrew) throw firstListenerError;
			}
		}
		_hasListener(event) {
			const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
			return listeners && listeners.some((listener) => !listener.removed);
		}
	};
	exports.EventEmitter = EventEmitter;
	_EventEmitter_listeners = /* @__PURE__ */ new WeakMap(), _EventEmitter_emittedListenerRegistrations = /* @__PURE__ */ new WeakMap(), _EventEmitter_pendingListenerCleanup = /* @__PURE__ */ new WeakMap(), _EventEmitter_listenerDispatchDepth = /* @__PURE__ */ new WeakMap(), _EventEmitter_instances = /* @__PURE__ */ new WeakSet(), _EventEmitter_onceForEmitted = function _EventEmitter_onceForEmitted(event, listener) {
		const previousListeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
		const previousLength = previousListeners?.length ?? 0;
		this.once(event, listener);
		const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
		const [registration] = listeners?.slice(-1) ?? [];
		if ((previousListeners === void 0 || listeners === previousListeners) && listeners?.length === previousLength + 1 && registration?.listener === listener && registration.once) tslib_1.__classPrivateFieldGet(this, _EventEmitter_emittedListenerRegistrations, "f").set(listener, {
			event,
			registration
		});
	}, _EventEmitter_removeEmittedListener = function _EventEmitter_removeEmittedListener(event, registration) {
		if (registration.removed) return;
		registration.removed = true;
		tslib_1.__classPrivateFieldGet(this, _EventEmitter_emittedListenerRegistrations, "f").delete(registration.listener);
		tslib_1.__classPrivateFieldGet(this, _EventEmitter_pendingListenerCleanup, "f").add(event);
		if (tslib_1.__classPrivateFieldGet(this, _EventEmitter_listenerDispatchDepth, "f") === 0) tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_cleanupEmittedListeners).call(this);
	}, _EventEmitter_cleanupEmittedListeners = function _EventEmitter_cleanupEmittedListeners() {
		for (const event of tslib_1.__classPrivateFieldGet(this, _EventEmitter_pendingListenerCleanup, "f")) {
			const eventType = event;
			const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventType];
			if (listeners) tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventType] = listeners.filter((listener) => !listener.removed);
		}
		tslib_1.__classPrivateFieldGet(this, _EventEmitter_pendingListenerCleanup, "f").clear();
	};
	/**
	* An EventEmitter variant that exposes `_emit()` publicly.
	*
	* The base {@link EventEmitter} keeps `_emit` protected so that consumers
	* can only listen, not dispatch. When you need a separate emitter instance
	* that your own code can emit on, without exposing emit on the
	* consumer-facing emitter, use this class.
	*/
	var InternalEventEmitter = class extends EventEmitter {
		/** Dispatches a named event to its currently registered listeners. */
		_emit(event, ...args) {
			super._emit(event, ...args);
		}
	};
	exports.InternalEventEmitter = InternalEventEmitter;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/headers.js
var require_headers = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEmptyHeaders = exports.buildHeaders = void 0;
	const values_1 = require_values();
	const brand_privateNullableHeaders = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
	const httpTokenHeaderName = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
	function* iterateHeaders(headers) {
		if (!headers) return;
		if (brand_privateNullableHeaders in headers) {
			const { values, nulls } = headers;
			yield* values.entries();
			for (const name of nulls) yield [name, null];
			return;
		}
		let shouldClear = false;
		let iter;
		const iterator = Symbol.iterator in headers ? headers[Symbol.iterator] : void 0;
		if (typeof iterator === "function") iter = { [Symbol.iterator]: () => iterator.call(headers) };
		else {
			shouldClear = true;
			iter = Object.entries(headers ?? {});
		}
		for (let row of iter) {
			const name = row[0];
			if (typeof name !== "string") throw new TypeError("expected header name to be a string");
			const values = (0, values_1.isReadonlyArray)(row[1]) ? row[1] : [row[1]];
			let didClear = false;
			for (const value of values) {
				if (value === void 0) continue;
				if (shouldClear && !didClear) {
					didClear = true;
					yield [name, null];
				}
				yield [name, value];
			}
		}
	}
	const buildHeaders = (newHeaders) => {
		const targetHeaders = new Headers();
		const nullHeaders = /* @__PURE__ */ new Set();
		for (const headers of newHeaders) {
			const seenHeaders = /* @__PURE__ */ new Set();
			for (const [name, value] of iterateHeaders(headers)) {
				if (!httpTokenHeaderName.test(name)) throw new TypeError(`Header name must be a valid HTTP token ["${name}"]`);
				const lowerName = name.toLowerCase();
				if (!seenHeaders.has(lowerName)) {
					targetHeaders.delete(lowerName);
					seenHeaders.add(lowerName);
				}
				if (value === null) {
					targetHeaders.delete(lowerName);
					nullHeaders.add(lowerName);
				} else {
					targetHeaders.append(lowerName, value);
					nullHeaders.delete(lowerName);
				}
			}
		}
		return {
			[brand_privateNullableHeaders]: true,
			values: targetHeaders,
			nulls: nullHeaders
		};
	};
	exports.buildHeaders = buildHeaders;
	const isEmptyHeaders = (headers) => {
		for (const _ of iterateHeaders(headers)) return false;
		return true;
	};
	exports.isEmptyHeaders = isEmptyHeaders;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/shims.js
var require_shims = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* This module provides internal shims and utility functions for environments where certain Node.js or global types may not be available.
	*
	* These are used to ensure we can provide a consistent behaviour between different JavaScript environments and good error
	* messages in cases where an environment isn't fully supported.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getDefaultFetch = getDefaultFetch;
	exports.makeReadableStream = makeReadableStream;
	exports.ReadableStreamFrom = ReadableStreamFrom;
	exports.ReadableStreamToAsyncIterable = ReadableStreamToAsyncIterable;
	exports.CancelReadableStream = CancelReadableStream;
	function getDefaultFetch() {
		if (typeof fetch !== "undefined") return fetch;
		throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new OpenAI({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
	}
	function makeReadableStream(...args) {
		const ReadableStream = globalThis.ReadableStream;
		if (typeof ReadableStream === "undefined") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
		return new ReadableStream(...args);
	}
	function ReadableStreamFrom(iterable) {
		let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
		return makeReadableStream({
			start() {},
			async pull(controller) {
				const { done, value } = await iter.next();
				if (done) controller.close();
				else controller.enqueue(value);
			},
			async cancel() {
				await iter.return?.();
			}
		});
	}
	/**
	* Most browsers don't yet have async iterable support for ReadableStream,
	* and Node has a very different way of reading bytes from its "ReadableStream".
	*
	* This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
	*/
	function ReadableStreamToAsyncIterable(stream) {
		if (stream[Symbol.asyncIterator]) return stream;
		const reader = stream.getReader();
		return {
			async next() {
				try {
					const result = await reader.read();
					if (result?.done) reader.releaseLock();
					return result;
				} catch (e) {
					reader.releaseLock();
					throw e;
				}
			},
			async return() {
				const cancelPromise = reader.cancel();
				reader.releaseLock();
				await cancelPromise;
				return {
					done: true,
					value: void 0
				};
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	}
	/**
	* Cancels a ReadableStream we don't need to consume.
	* See https://undici.nodejs.org/#/?id=garbage-collection
	*/
	async function CancelReadableStream(stream) {
		if (stream === null || typeof stream !== "object") return;
		if (stream[Symbol.asyncIterator]) {
			await stream[Symbol.asyncIterator]().return?.();
			return;
		}
		const reader = stream.getReader();
		const cancelPromise = reader.cancel();
		reader.releaseLock();
		await cancelPromise;
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/auth/x509-api-origin.js
var require_x509_api_origin = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.X509_API_BASE_URL = void 0;
	exports.assertX509APIOrigin = assertX509APIOrigin;
	const error_1 = require_error$1();
	const log_1 = require_log();
	/** Sole API authority approved for OpenAI X.509 workload-identity federation. */
	exports.X509_API_BASE_URL = "https://mtls.api.openai.com/v1";
	/** Validates the enrolled API authority and rejects credential-bearing query parameters. */
	function assertX509APIOrigin(value) {
		let target;
		try {
			target = new URL(value);
		} catch {
			throw new error_1.OpenAIError("X.509 workload identity requires the approved global mTLS API origin.");
		}
		if (target.origin !== "https://mtls.api.openai.com" || target.username || target.password) throw new error_1.OpenAIError("X.509 workload identity requires the approved global mTLS API origin.");
		for (const name of target.searchParams.keys()) if ((0, log_1.isSensitiveQueryParameter)(name)) throw new error_1.OpenAIError("X.509 workload identity cannot send conflicting query authentication credentials.");
		return target;
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/auth/x509-transport-registry.js
var require_x509_transport_registry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.x509TransportBrand = void 0;
	exports.isRetryableX509TransportFailure = isRetryableX509TransportFailure;
	exports.resolveX509Transport = resolveX509Transport;
	const error_1 = require_error$1();
	const _x509_transport_state_1 = require_x509_transport_state();
	const transientX509TransportCodes = /* @__PURE__ */ new Set([
		"ECONNRESET",
		"ECONNREFUSED",
		"ENETUNREACH",
		"EHOSTUNREACH",
		"ENETDOWN",
		"EPIPE",
		"ETIMEDOUT",
		"EAI_AGAIN",
		"UND_ERR_CONNECT_TIMEOUT",
		"UND_ERR_HEADERS_TIMEOUT",
		"UND_ERR_BODY_TIMEOUT",
		"UND_ERR_SOCKET"
	]);
	/** Retries only known temporary failures when neither error layer reports a permanent code. */
	function isRetryableX509TransportFailure(failure) {
		const cause = typeof failure === "object" && failure !== null ? Object.getOwnPropertyDescriptor(failure, "cause")?.value : void 0;
		let retryable = false;
		for (const candidate of [failure, cause]) {
			const code = typeof candidate === "object" && candidate !== null ? Object.getOwnPropertyDescriptor(candidate, "code")?.value : void 0;
			if (typeof code === "string") {
				if (!transientX509TransportCodes.has(code)) return false;
				retryable = true;
			}
		}
		return retryable;
	}
	exports.x509TransportBrand = Symbol("X.509 transport capability");
	/** Resolves a previously registered opaque capability without importing an optional transport peer. */
	function resolveX509Transport(value) {
		if (!value || typeof value !== "object") throw new error_1.OpenAIError("X.509 workload identity requires an approved X.509 transport capability.");
		const registered = (0, _x509_transport_state_1.findRegisteredX509Transport)(value);
		if (!registered) throw new error_1.OpenAIError("X.509 workload identity requires an approved X.509 transport capability.");
		return registered;
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/auth/x509-workload-identity-auth.js
var require_x509_workload_identity_auth = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _X509WorkloadIdentityAuth_instances;
	var _a;
	var _X509WorkloadIdentityAuth_identityProviderId;
	var _X509WorkloadIdentityAuth_serviceAccountId;
	var _X509WorkloadIdentityAuth_configuredRefreshBufferMs;
	var _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds;
	var _X509WorkloadIdentityAuth_organization;
	var _X509WorkloadIdentityAuth_project;
	var _X509WorkloadIdentityAuth_transport;
	var _X509WorkloadIdentityAuth_refreshBufferMs;
	var _X509WorkloadIdentityAuth_cachedToken;
	var _X509WorkloadIdentityAuth_refresh;
	var _X509WorkloadIdentityAuth_tokenGeneration;
	var _X509WorkloadIdentityAuth_cancelRequestBody;
	var _X509WorkloadIdentityAuth_assignToken;
	var _X509WorkloadIdentityAuth_recoverRefreshFailure;
	var _X509WorkloadIdentityAuth_fallbackToken;
	var _X509WorkloadIdentityAuth_retireRefresh;
	var _X509WorkloadIdentityAuth_beginRefresh;
	var _X509WorkloadIdentityAuth_refreshToken;
	var _X509WorkloadIdentityAuth_preflight;
	var _X509WorkloadIdentityAuth_scope;
	var _X509WorkloadIdentityAuth_assertTenantHeaders;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.X509WorkloadIdentityAuth = void 0;
	exports.isX509WorkloadIdentity = isX509WorkloadIdentity;
	exports.assertX509WebSocketSupported = assertX509WebSocketSupported;
	exports.assertX509FetchOptions = assertX509FetchOptions;
	exports.assertX509RequestOptions = assertX509RequestOptions;
	exports.snapshotX509RequestOptions = snapshotX509RequestOptions;
	const tslib_1 = require_tslib();
	const error_1 = require_error$1();
	const headers_1 = require_headers();
	const shims_1 = require_shims();
	const log_1 = require_log();
	const values_1 = require_values();
	const x509_api_origin_1 = require_x509_api_origin();
	const x509_transport_registry_1 = require_x509_transport_registry();
	const _x509_transport_state_1 = require_x509_transport_state();
	const FORBIDDEN_TRANSPORT_OPTIONS = [
		"dispatcher",
		"agent",
		"client",
		"tls",
		"proxy"
	];
	const headerValue = (headers, name) => Headers.prototype.get.call(headers, name);
	const DEFAULT_REFRESH_BUFFER_MS = 12e5;
	const FAILED_REFRESH_COOLDOWN_MS = 1e3;
	const userAbortError = (signal) => {
		const error = new error_1.APIUserAbortError();
		Object.defineProperty(error, "cause", {
			value: signal.reason,
			writable: true,
			configurable: true
		});
		return error;
	};
	function assertSafeHeaders(headers) {
		for (const name of Headers.prototype.keys.call(headers)) {
			const canonical = name.toLowerCase().split("_").join("-");
			if (canonical !== "authorization" && (0, log_1.isSensitiveHeader)(canonical) || canonical === "host") throw new error_1.OpenAIError("X.509 workload identity cannot send conflicting authentication credentials.");
		}
	}
	function exchangeDeadline(timeout, callerSignal) {
		const deadline = new AbortController();
		const timer = timeout === void 0 ? void 0 : setTimeout(() => deadline.abort(new error_1.APIConnectionTimeoutError()), timeout);
		const timerHandle = timer;
		if (typeof timerHandle === "object" && timerHandle !== null && "unref" in timerHandle && typeof timerHandle.unref === "function") timerHandle.unref();
		const cancel = () => deadline.abort(callerSignal?.reason);
		callerSignal?.addEventListener("abort", cancel, { once: true });
		if (callerSignal?.aborted) cancel();
		return {
			signal: deadline.signal,
			dispose: () => {
				callerSignal?.removeEventListener("abort", cancel);
				if (timer) clearTimeout(timer);
			}
		};
	}
	function waitForRefresh(attempt, signal) {
		let abort;
		const canceled = new Promise((_resolve, reject) => {
			abort = () => reject(signal.reason);
			signal.addEventListener("abort", abort, { once: true });
			if (signal.aborted) abort();
		});
		return {
			result: Promise.race([attempt.promise, canceled]),
			dispose: () => {
				if (abort) signal.removeEventListener("abort", abort);
			}
		};
	}
	/** Distinguishes true certificate identities from extensible legacy subject-token identities. */
	function isX509WorkloadIdentity(identity) {
		if (!identity || typeof identity !== "object") return false;
		let providerOwner = identity;
		while (providerOwner !== null && providerOwner !== Object.prototype) {
			const provider = Object.getOwnPropertyDescriptor(providerOwner, "provider");
			if (provider) {
				if (!("value" in provider) || provider.value !== void 0) return false;
				break;
			}
			providerOwner = Object.getPrototypeOf(providerOwner);
		}
		let current = identity;
		while (current !== null && current !== Object.prototype) {
			const discriminator = Object.getOwnPropertyDescriptor(current, "type");
			if (discriminator) {
				if (!("value" in discriminator)) throw new error_1.OpenAIError("X.509 workload identity type must be a plain data property.");
				return discriminator.value === "x509";
			}
			current = Object.getPrototypeOf(current);
		}
		return false;
	}
	/** Rejects unsupported WebSocket authentication before any connection or credential side effect. */
	function assertX509WebSocketSupported(client) {
		if (!client || typeof client !== "object") return;
		if ((0, _x509_transport_state_1.isApprovedX509Client)(client)) throw new error_1.OpenAIError("X.509 workload identity does not support WebSocket connections.");
	}
	/** Prevents caller options from replacing the immutable transport selected at construction. */
	function assertX509FetchOptions(options) {
		if (!options) return;
		for (const name of FORBIDDEN_TRANSPORT_OPTIONS) if ((0, values_1.hasOwn)(options, name)) throw new error_1.OpenAIError("X.509 workload identity cannot override its approved transport capability.");
		const redirect = Object.getOwnPropertyDescriptor(options, "redirect")?.value;
		if (redirect !== void 0 && redirect !== "manual") throw new error_1.OpenAIError("X.509 workload identity requests require manual redirects.");
	}
	/** Rejects caller overrides while allowing the SDK-owned fields on the final RequestInit. */
	function assertX509RequestOptions(options) {
		assertX509FetchOptions(options);
		if (options && [
			"body",
			"headers",
			"method",
			"signal"
		].some((name) => (0, values_1.hasOwn)(options, name))) throw new error_1.OpenAIError("X.509 workload identity cannot override its request body, headers, method, or signal through fetch options.");
	}
	/** Validates and snapshots the exact caller options that will reach authenticated dispatch. */
	function snapshotX509RequestOptions(options) {
		assertX509RequestOptions(options);
		const snapshot = { ...options };
		assertX509RequestOptions(snapshot);
		return snapshot;
	}
	/** Bridges certificate authentication into existing OpenAI auth and fetch hooks without optional peers. */
	var X509WorkloadIdentityAuth = class {
		/** Captures one registered, immutable certificate identity and its enrolled selectors. */
		constructor(identity, transport, organization, project) {
			_X509WorkloadIdentityAuth_instances.add(this);
			_X509WorkloadIdentityAuth_identityProviderId.set(this, void 0);
			_X509WorkloadIdentityAuth_serviceAccountId.set(this, void 0);
			_X509WorkloadIdentityAuth_configuredRefreshBufferMs.set(this, void 0);
			_X509WorkloadIdentityAuth_configuredRefreshBufferSeconds.set(this, void 0);
			_X509WorkloadIdentityAuth_organization.set(this, void 0);
			_X509WorkloadIdentityAuth_project.set(this, void 0);
			_X509WorkloadIdentityAuth_transport.set(this, void 0);
			_X509WorkloadIdentityAuth_refreshBufferMs.set(this, void 0);
			_X509WorkloadIdentityAuth_cachedToken.set(this, void 0);
			_X509WorkloadIdentityAuth_refresh.set(this, void 0);
			_X509WorkloadIdentityAuth_tokenGeneration.set(this, 0);
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_transport, (0, x509_transport_registry_1.resolveX509Transport)(transport), "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_identityProviderId, identity.identityProviderId, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_serviceAccountId, identity.serviceAccountId, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, identity.refreshBufferMs, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, identity.refreshBufferSeconds, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_organization, organization, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_project, project, "f");
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") !== void 0 && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") !== void 0) throw new error_1.OpenAIError("X.509 workload identity cannot combine refreshBufferSeconds and refreshBufferMs.");
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") !== void 0 && (!Number.isSafeInteger(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f")) || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") < 0)) throw new error_1.OpenAIError("X.509 workload identity requires a nonnegative integer refreshBufferMs.");
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") !== void 0 && (!Number.isSafeInteger(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f")) || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") < 0 || !Number.isSafeInteger(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") * 1e3))) throw new error_1.OpenAIError("X.509 workload identity requires a nonnegative integer refreshBufferSeconds.");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refreshBufferMs, tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") === void 0 ? tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") ?? DEFAULT_REFRESH_BUFFER_MS : tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") * 1e3, "f");
		}
		/** Reconstructs the immutable selectors captured before caller-owned identity mutation. */
		identitySnapshot() {
			return {
				type: "x509",
				identityProviderId: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_identityProviderId, "f"),
				serviceAccountId: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_serviceAccountId, "f"),
				...tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") === void 0 ? {} : { refreshBufferMs: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") },
				...tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") === void 0 ? {} : { refreshBufferSeconds: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") }
			};
		}
		/** Preserves explicitly headerless requests without presenting a certificate to the issuer. */
		static shouldAuthenticate(options, defaultHeaders, requestHeaders = options.headers) {
			return !(0, headers_1.buildHeaders)([defaultHeaders, requestHeaders]).nulls.has("authorization");
		}
		/** Snapshots each caller-owned header layer once while preserving nulls and precedence. */
		snapshotHeaders(defaultHeaders, requestHeaders) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			scope.defaultHeaders ?? (scope.defaultHeaders = (0, headers_1.buildHeaders)([defaultHeaders]));
			scope.requestHeaders ?? (scope.requestHeaders = (0, headers_1.buildHeaders)([requestHeaders]));
			return this.headerSnapshots();
		}
		/** Returns the already rendered caller headers without touching mutable inputs again. */
		headerSnapshots() {
			const { defaultHeaders, requestHeaders } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (!defaultHeaders || !requestHeaders) throw new error_1.OpenAIError("X.509 workload identity requires snapshotted request headers.");
			return {
				defaultHeaders,
				requestHeaders
			};
		}
		/** Captures enrolled public tenant selectors once before certificate presentation. */
		snapshotTenant(organization, project) {
			if (organization !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") || project !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f")) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			scope.tenant = {
				organization,
				project
			};
			return scope.tenant;
		}
		/** Returns the tenant selectors already approved for this logical request. */
		tenantSnapshot() {
			const { tenant } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (!tenant) throw new error_1.OpenAIError("X.509 workload identity requires snapshotted tenant selectors.");
			return tenant;
		}
		/** Validates and retains the exact destination that authenticated dispatch will use. */
		snapshotAPIURL(value) {
			(0, x509_api_origin_1.assertX509APIOrigin)(value);
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).apiURL = value;
		}
		/** Reads the already-approved destination without rerendering caller-owned request options. */
		requestAPIURL() {
			const { apiURL } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (apiURL === void 0) throw new error_1.OpenAIError("X.509 workload identity requires a snapshotted API destination.");
			return apiURL;
		}
		/** Captures the exact caller settings approved for authenticated dispatch. */
		snapshotRequest(signal, timeout, fetchOptions) {
			var _b;
			(_b = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this)).request ?? (_b.request = {
				signal,
				timeout,
				fetchOptions
			});
		}
		/** Returns immutable request settings without invoking caller-owned accessors again. */
		requestSnapshot() {
			const { request } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (!request) throw new error_1.OpenAIError("X.509 workload identity requires snapshotted request settings.");
			return request;
		}
		/** Suspends an already-running network budget during retry-local asynchronous preparation. */
		beginRequestPreparation() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (scope.deadlineArmed && scope.preparationStartedAt === void 0) {
				scope.preparationStartedAt = performance.now();
				scope.preparationWallStartedAt = Date.now();
			}
		}
		/** Begins local request construction without charging protected hook latency to the network. */
		beginRequestPlanning() {
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).phase = "planning";
		}
		/** Arms one absolute network deadline only after all local request preparation completes. */
		beginRequestNetwork() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (!scope.deadlineArmed) {
				scope.wallStartedAt = Date.now();
				scope.monotonicStartedAt = performance.now();
				scope.deadlineArmed = true;
			} else if (scope.preparationStartedAt !== void 0) {
				scope.monotonicStartedAt += performance.now() - scope.preparationStartedAt;
				scope.wallStartedAt += Date.now() - (scope.preparationWallStartedAt ?? Date.now());
				delete scope.preparationStartedAt;
				delete scope.preparationWallStartedAt;
			}
		}
		/** Keeps certificate authentication outside overridable request construction. */
		isPlanningRequest() {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).phase === "planning";
		}
		/** Approves the final overridden destination and transport before minting a bearer. */
		authorizePlannedRequest(url, request, timeout, allowHookSignal = false) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const headers = Object.getOwnPropertyDescriptor(request, "headers");
			const body = Object.getOwnPropertyDescriptor(request, "body");
			const signal = Object.getOwnPropertyDescriptor(request, "signal");
			const redirect = Object.getOwnPropertyDescriptor(request, "redirect");
			if (scope.phase !== "planning" || !headers || !(headers.value instanceof Headers) || !body && "body" in request || [
				body,
				signal,
				redirect
			].some((descriptor) => descriptor && !("value" in descriptor))) throw new error_1.OpenAIError("X.509 workload identity requires an approved final request.");
			this.snapshotAPIURL(url);
			assertX509FetchOptions(request);
			try {
				assertSafeHeaders(headers.value);
			} catch {
				throw new error_1.OpenAIError("X.509 workload identity cannot use caller-supplied authentication credentials.");
			}
			if (headerValue(headers.value, "Authorization") !== null) throw new error_1.OpenAIError("X.509 workload identity cannot use caller-supplied authorization credentials.");
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_assertTenantHeaders).call(this, headers.value);
			if (!allowHookSignal && (signal?.value ?? void 0) !== (this.requestSnapshot().signal ?? void 0)) throw new error_1.OpenAIError("X.509 workload identity must preserve its approved request signal.");
			const approved = this.requestSnapshot();
			scope.request = {
				...approved,
				timeout: Math.min(approved.timeout, timeout)
			};
			scope.phase = "authorizing";
		}
		/** Owns only SDK-created iterator adapters until authenticated dispatch takes responsibility. */
		ownRequestBody(body, source) {
			if (body instanceof ReadableStream && body !== source) tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).materializedBody = body;
		}
		/** Recognizes every one-shot upload before issuer authentication or request replay. */
		static isStreamingRequestBody(body) {
			return globalThis.ReadableStream !== void 0 && body instanceof globalThis.ReadableStream || typeof body === "object" && body !== null && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function");
		}
		/** Retires abandoned upload adapters without masking or blocking their authentication failure. */
		retireRequestBody() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const body = scope.materializedBody;
			delete scope.materializedBody;
			if (body) tslib_1.__classPrivateFieldGet(_a, _a, "m", _X509WorkloadIdentityAuth_cancelRequestBody).call(_a, body);
		}
		/** Transfers the dispatched upload while retiring any SDK-owned body replaced by a hook. */
		releaseRequestBody(body) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (scope.materializedBody === body) delete scope.materializedBody;
			else this.retireRequestBody();
		}
		/** Retains caller-only cancellation separately from SDK-created deadline controllers. */
		setEffectiveSignal(signal) {
			if (signal) tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).effectiveSignal = signal;
			else delete tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).effectiveSignal;
		}
		/** Uses protected-hook cancellation when an authenticated attempt enters retry backoff. */
		effectiveSignal() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			return scope.effectiveSignal ?? scope.request?.signal;
		}
		/** Establishes an independent scope even when concurrent requests share caller options. */
		runRequest(operation, requestOwner) {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").run(async () => {
				const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
				if (!scope) throw new error_1.OpenAIError("X.509 workload identity requires an active certificate request scope.");
				scope.owner = this;
				scope.requestOwner = requestOwner;
				try {
					return await operation();
				} finally {
					this.retireRequestBody();
					this.releaseRequestCredentials();
					delete scope.requestOwner;
					delete scope.owner;
				}
			});
		}
		/** Reports whether a public request-building call already belongs to an active logical operation. */
		inRequest(requestOwner) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
			return scope?.owner === this && scope.requestOwner === requestOwner && scope.phase !== "authorizing";
		}
		/** Shares a cache only when the complete, privately snapshotted credential identity matches. */
		matches(other) {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_transport, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_identityProviderId, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_identityProviderId, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_serviceAccountId, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_serviceAccountId, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_organization, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_project, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refreshBufferMs, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_refreshBufferMs, "f");
		}
		/** Binds deferred response parsing to the original logical request and its unchanged deadline. */
		continuation() {
			const { wallStartedAt, monotonicStartedAt, deadlineArmed, request, requestOwner, effectiveSignal } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const scope = {
				wallStartedAt,
				monotonicStartedAt,
				owner: this,
				...deadlineArmed ? { deadlineArmed } : {},
				...request ? { request } : {},
				...effectiveSignal ? { effectiveSignal } : {},
				...requestOwner ? { requestOwner } : {}
			};
			return (operation) => tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").resume(scope, async () => {
				try {
					return await operation();
				} finally {
					this.releaseRequestCredentials();
					delete scope.requestOwner;
					delete scope.owner;
				}
			});
		}
		/** Removes dispatched bearer material before settled request promises can retain their scope. */
		releaseRequestCredentials() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			delete scope.request;
			delete scope.phase;
			delete scope.deadlineArmed;
			delete scope.preparationStartedAt;
			delete scope.preparationWallStartedAt;
			delete scope.effectiveSignal;
			delete scope.materializedBody;
			delete scope.apiURL;
			delete scope.tenant;
			delete scope.token;
			delete scope.defaultHeaders;
			delete scope.requestHeaders;
			delete scope.tokenGeneration;
			delete scope.headers;
			delete scope.authorization;
		}
		/** Returns the original authentication start so response consumption shares its request deadline. */
		requestStartedAt(_options) {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current()?.wallStartedAt;
		}
		/** Distinguishes issued workload credentials from independent admin or headerless requests. */
		usedWorkloadToken(_options) {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current()?.token !== void 0;
		}
		/** Returns the budget left after certificate authentication without starting another timeout. */
		remainingTimeout(_options, timeout) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
			if (scope === void 0) return timeout;
			const remaining = timeout - (performance.now() - scope.monotonicStartedAt);
			if (remaining <= 0) throw new error_1.APIConnectionTimeoutError();
			return remaining;
		}
		/** Cancels active retry timers promptly without changing public caller-abort semantics. */
		async waitForRetry(duration, signal) {
			try {
				await tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").sleep(duration, signal);
			} catch (error) {
				if (signal?.aborted) throw userAbortError(signal);
				throw error;
			}
		}
		/** Trusts only issuer or connection failures privately branded by the approved transport. */
		static isRetryableFailure(error) {
			return typeof error === "object" && error !== null && ((0, _x509_transport_state_1.isTransientX509ConnectionError)(error) || (0, _x509_transport_state_1.isRetryableX509IssuerError)(error));
		}
		/** Reads safe retry hints only from a privately branded, sanitized issuer response. */
		static retryHeaders(error) {
			if (!error || typeof error !== "object" || !(0, _x509_transport_state_1.isRetryableX509IssuerError)(error)) return;
			const headers = Object.getOwnPropertyDescriptor(error, "headers")?.value;
			return headers instanceof Headers ? headers : void 0;
		}
		/** Exchanges the exact certificate capability selected for the matching API dispatch. */
		async getToken(options, context) {
			const callerSignal = context ? context.signal : options?.signal;
			if (callerSignal?.aborted) throw userAbortError(callerSignal);
			if (options) assertX509RequestOptions(context ? context.fetchOptions : options.fetchOptions);
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_preflight).call(this, context);
			const scope = options ? tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this) : void 0;
			const cached = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f");
			if (cached && performance.now() < cached.refreshAt && Date.now() < cached.wallRefreshAt) return tslib_1.__classPrivateFieldGet(_a, _a, "m", _X509WorkloadIdentityAuth_assignToken).call(_a, scope, cached);
			const { signal, dispose } = exchangeDeadline(context && options ? this.remainingTimeout(options, context.timeout) : context?.timeout, callerSignal);
			if (callerSignal?.aborted) {
				dispose();
				throw userAbortError(callerSignal);
			}
			const attempt = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f") ?? tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_beginRefresh).call(this);
			attempt.waiters += 1;
			const waiter = waitForRefresh(attempt, signal);
			try {
				const exchanged = await waiter.result;
				const refreshed = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f");
				if (!refreshed || refreshed.accessToken !== exchanged.accessToken) throw new error_1.APIUserAbortError();
				return tslib_1.__classPrivateFieldGet(_a, _a, "m", _X509WorkloadIdentityAuth_assignToken).call(_a, scope, refreshed);
			} catch (error) {
				return await tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_recoverRefreshFailure).call(this, error, attempt, cached, scope, options, context);
			} finally {
				waiter.dispose();
				dispose();
				attempt.waiters -= 1;
				tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_retireRefresh).call(this, attempt);
			}
		}
		/** Invalidates only the workload-token generation actually rejected by the current request. */
		invalidateToken() {
			const rejected = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
			if (!rejected?.token || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f")?.accessToken !== rejected.token || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f").generation !== rejected.tokenGeneration) return;
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_tokenGeneration, tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f") + 1, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_cachedToken, void 0, "f");
			const refresh = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refresh, void 0, "f");
			refresh?.controller.abort(new error_1.APIUserAbortError());
		}
		/** Binds the minted credential to the original headers before protected request hooks run. */
		bindRequest(options, request, adminAPIKey) {
			if (!(request.headers instanceof Headers)) throw new error_1.OpenAIError("X.509 workload identity requires the original workload authorization headers.");
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const { token } = scope;
			const security = options.__security ?? { bearerAuth: true };
			let approvedAuthorization = token ? `Bearer ${token}` : null;
			if (!token && security.adminAPIKeyAuth && adminAPIKey !== null && headerValue(request.headers, "Authorization") !== null) approvedAuthorization = new Headers({ Authorization: `Bearer ${adminAPIKey}` }).get("Authorization");
			scope.headers = request.headers;
			scope.authorization = approvedAuthorization;
			this.assertRequest(request);
		}
		/** Rebinds an equivalent protected-hook container without relaxing final dispatch identity checks. */
		adoptRequestHeaders(request) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const original = scope.headers;
			if (!(original instanceof Headers) || !(request.headers instanceof Headers)) throw new error_1.OpenAIError("X.509 workload identity must preserve its issued workload authorization.");
			scope.headers = request.headers;
			try {
				this.assertRequest(request);
			} catch (error) {
				scope.headers = original;
				throw error;
			}
		}
		/** Rejects request hooks that replace the selected bearer or its approved header identity. */
		assertRequest(request) {
			const { headers } = request;
			if (!(headers instanceof Headers)) throw new error_1.OpenAIError("X.509 workload identity must preserve its issued workload authorization.");
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
			if (!scope || scope.headers !== headers || scope.authorization === void 0 || headerValue(headers, "Authorization") !== scope.authorization) throw new error_1.OpenAIError("X.509 workload identity must preserve its issued workload authorization.");
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_assertTenantHeaders).call(this, headers);
			assertSafeHeaders(headers);
		}
		/** Returns a guarded final dispatcher while preserving all existing request hook object identities. */
		fetch() {
			return async (input, init = {}) => {
				const target = (0, x509_api_origin_1.assertX509APIOrigin)(typeof input === "string" || input instanceof URL ? input : input.url);
				assertX509FetchOptions(init);
				this.assertRequest(init);
				const approved = init.headers;
				if (!(approved instanceof Headers)) throw new error_1.OpenAIError("X.509 workload identity must preserve its issued workload authorization.");
				const headers = new Headers([...Headers.prototype.entries.call(approved)]);
				assertSafeHeaders(headers);
				init.headers = headers;
				init.redirect = "manual";
				return await tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").dispatch(target, init);
			};
		}
	};
	exports.X509WorkloadIdentityAuth = X509WorkloadIdentityAuth;
	_a = X509WorkloadIdentityAuth, _X509WorkloadIdentityAuth_identityProviderId = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_serviceAccountId = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_configuredRefreshBufferMs = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_organization = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_project = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_transport = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_refreshBufferMs = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_cachedToken = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_refresh = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_tokenGeneration = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_instances = /* @__PURE__ */ new WeakSet(), _X509WorkloadIdentityAuth_cancelRequestBody = async function _X509WorkloadIdentityAuth_cancelRequestBody(body) {
		try {
			await (0, shims_1.CancelReadableStream)(body);
		} catch {}
	}, _X509WorkloadIdentityAuth_assignToken = function _X509WorkloadIdentityAuth_assignToken(scope, token) {
		if (scope) {
			scope.token = token.accessToken;
			scope.tokenGeneration = token.generation;
		}
		return token.accessToken;
	}, _X509WorkloadIdentityAuth_recoverRefreshFailure = async function _X509WorkloadIdentityAuth_recoverRefreshFailure(error, attempt, cached, scope, options, context) {
		const callerSignal = context ? context.signal : options?.signal;
		if (callerSignal?.aborted) throw userAbortError(callerSignal);
		if (attempt.controller.signal.aborted && attempt.generation !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f")) return await this.getToken(options, context);
		const fallback = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_fallbackToken).call(this, error, cached, scope);
		if (fallback !== void 0) return fallback;
		if (error && typeof error === "object" && !(error instanceof error_1.OAuthError)) {
			const oauth = (0, _x509_transport_state_1.findX509OAuthError)(error);
			if (oauth) throw new error_1.OAuthError(oauth.status, oauth.error, oauth.headers);
		}
		throw error;
	}, _X509WorkloadIdentityAuth_fallbackToken = function _X509WorkloadIdentityAuth_fallbackToken(error, cached, scope) {
		if (!cached || cached !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f") || performance.now() >= cached.expiresAt || Date.now() >= cached.wallExpiresAt || !_a.isRetryableFailure(error)) return;
		const headers = _a.retryHeaders(error);
		const milliseconds = headers?.get("retry-after-ms");
		let requested = milliseconds ? Number(milliseconds) : void 0;
		const retryAfter = headers?.get("retry-after");
		if (retryAfter && (requested === void 0 || Number.isNaN(requested))) {
			const seconds = Number(retryAfter);
			requested = Number.isNaN(seconds) ? Date.parse(retryAfter) - Date.now() : seconds * 1e3;
		}
		const cooldown = requested !== void 0 && Number.isFinite(requested) && requested >= 0 && requested <= 6e4 ? Math.max(FAILED_REFRESH_COOLDOWN_MS, requested) : FAILED_REFRESH_COOLDOWN_MS;
		cached.refreshAt = Math.min(cached.expiresAt, performance.now() + cooldown);
		cached.wallRefreshAt = Math.min(cached.wallExpiresAt, Date.now() + cooldown);
		return tslib_1.__classPrivateFieldGet(_a, _a, "m", _X509WorkloadIdentityAuth_assignToken).call(_a, scope, cached);
	}, _X509WorkloadIdentityAuth_retireRefresh = function _X509WorkloadIdentityAuth_retireRefresh(attempt) {
		if (attempt.waiters !== 0 || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f") !== attempt) return;
		queueMicrotask(() => {
			if (attempt.waiters === 0 && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f") === attempt) {
				tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refresh, void 0, "f");
				tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_tokenGeneration, tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f") + 1, "f");
				attempt.controller.abort(new error_1.APIUserAbortError());
			}
		});
	}, _X509WorkloadIdentityAuth_beginRefresh = function _X509WorkloadIdentityAuth_beginRefresh() {
		const controller = new AbortController();
		const generation = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f");
		const attempt = {
			controller,
			generation,
			waiters: 0,
			promise: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_refreshToken).call(this, controller, generation)
		};
		tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refresh, attempt, "f");
		return attempt;
	}, _X509WorkloadIdentityAuth_refreshToken = async function _X509WorkloadIdentityAuth_refreshToken(controller, generation) {
		const startedAt = performance.now();
		const wallStartedAt = Date.now();
		try {
			const token = await tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").exchange(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_identityProviderId, "f"), tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_serviceAccountId, "f"), controller.signal);
			const lifetime = token.expiresIn * 1e3;
			const expiresAt = startedAt + lifetime;
			const wallExpiresAt = wallStartedAt + lifetime;
			if (performance.now() >= expiresAt || Date.now() >= wallExpiresAt) throw new error_1.OpenAIError("X.509 workload identity token expired before its exchange completed.");
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f") !== generation || controller.signal.aborted || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f")?.controller !== controller) throw new error_1.APIUserAbortError();
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_tokenGeneration, tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f") + 1, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_cachedToken, {
				accessToken: token.accessToken,
				generation: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f"),
				expiresAt,
				refreshAt: expiresAt - Math.min(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refreshBufferMs, "f"), lifetime / 2),
				wallExpiresAt,
				wallRefreshAt: wallExpiresAt - Math.min(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refreshBufferMs, "f"), lifetime / 2)
			}, "f");
			return token;
		} finally {
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f")?.controller === controller) tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refresh, void 0, "f");
		}
	}, _X509WorkloadIdentityAuth_preflight = function _X509WorkloadIdentityAuth_preflight(context) {
		if (!context) return;
		if (context.organization !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") || context.project !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f")) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
		(0, x509_api_origin_1.assertX509APIOrigin)(context.apiURL);
		const supplied = (0, headers_1.buildHeaders)([context.defaultHeaders, context.requestHeaders]);
		if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") !== null && supplied.nulls.has("openai-organization") || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f") !== null && supplied.nulls.has("openai-project")) throw new error_1.OpenAIError("X.509 workload identity cannot omit its enrolled organization or project.");
		for (const name of supplied.values.keys()) {
			const canonical = name.toLowerCase().split("_").join("-");
			if ((canonical === "openai-organization" || canonical === "openai-project") && (name !== canonical || headerValue(supplied.values, name) !== (canonical === "openai-organization" ? context.organization : context.project))) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
			if ((0, log_1.isSensitiveHeader)(canonical) || canonical === "host") throw new error_1.OpenAIError("X.509 workload identity cannot use caller-supplied authentication credentials.");
		}
	}, _X509WorkloadIdentityAuth_scope = function _X509WorkloadIdentityAuth_scope() {
		const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
		if (!scope || scope.owner !== this) throw new error_1.OpenAIError("X.509 workload identity requires an active certificate request scope.");
		return scope;
	}, _X509WorkloadIdentityAuth_assertTenantHeaders = function _X509WorkloadIdentityAuth_assertTenantHeaders(headers) {
		if (headerValue(headers, "OpenAI-Organization") !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") || headerValue(headers, "OpenAI-Project") !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f")) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
		for (const name of Headers.prototype.keys.call(headers)) {
			const canonical = name.toLowerCase().split("_").join("-");
			if ((canonical === "openai-organization" || canonical === "openai-project") && name !== canonical) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/resources/responses/internal-base.js
var require_internal_base = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResponsesEmitter = exports.WebSocketError = void 0;
	exports.buildURL = buildURL;
	const EventEmitter_1 = require_EventEmitter();
	const error_1 = require_error$1();
	const x509_workload_identity_auth_1 = require_x509_workload_identity_auth();
	var WebSocketError = class extends error_1.OpenAIError {
		constructor(message, event) {
			super(message);
			Object.defineProperty(this, "error", {
				value: event ?? void 0,
				writable: true,
				configurable: true,
				enumerable: false
			});
		}
	};
	exports.WebSocketError = WebSocketError;
	var ResponsesEmitter = class extends EventEmitter_1.EventEmitter {
		_onError(event, message, cause) {
			message = safeWebSocketErrorMessage(event, message) ?? "unknown error";
			if (!this._hasListener("error")) {
				const error = new WebSocketError(message + `\n\nTo resolve these unhandled rejection errors you should bind an \`error\` callback, e.g. \`ws.on('error', (error) => ...)\` `, event);
				error.cause = cause;
				Promise.reject(error);
				return;
			}
			const error = new WebSocketError(message, event);
			error.cause = cause;
			this._emit("error", error);
		}
	};
	exports.ResponsesEmitter = ResponsesEmitter;
	function buildURL(client, parameters) {
		(0, x509_workload_identity_auth_1.assertX509WebSocketSupported)(client);
		const { ...query } = parameters;
		const url = new URL(client.buildURL("/responses", query, void 0));
		url.protocol = url.protocol === "http:" || url.protocol === "ws:" ? "ws:" : "wss:";
		return url;
	}
	function safeWebSocketErrorMessage(event, message) {
		if (typeof message === "string") return message;
		if (typeof event !== "object" || event === null) return void 0;
		try {
			const error = Object.getOwnPropertyDescriptor(event, "error")?.value;
			const nestedMessage = typeof error === "object" && error !== null ? Object.getOwnPropertyDescriptor(error, "message")?.value : void 0;
			const eventMessage = Object.getOwnPropertyDescriptor(event, "message")?.value;
			const candidate = typeof nestedMessage === "string" ? nestedMessage : eventMessage;
			return typeof candidate === "string" ? candidate : void 0;
		} catch {
			return;
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/ws-adapter.js
var require_ws_adapter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReadyState = void 0;
	/** Standard WebSocket readyState values (RFC 6455). */
	exports.ReadyState = {
		/** The connection has been created but is not ready to send messages. */
		CONNECTING: 0,
		/** The connection is established and ready to send messages. */
		OPEN: 1,
		/** The closing handshake has started but is not complete. */
		CLOSING: 2,
		/** The connection is closed or could not be established. */
		CLOSED: 3
	};
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/resources/responses/ws-base.js
var require_ws_base = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResponsesWSBase = void 0;
	exports.getWebSocketEventBytes = getWebSocketEventBytes;
	exports.getWebSocketEventPayload = getWebSocketEventPayload;
	const internal_base_1 = require_internal_base();
	const EventEmitter_1 = require_EventEmitter();
	const sleep_1 = require_sleep();
	const ws_adapter_1 = require_ws_adapter();
	const ws_1 = require_ws$1();
	const error_1 = require_error$1();
	const webSocketEventPayloads = /* @__PURE__ */ new WeakMap();
	const webSocketEventBytes = /* @__PURE__ */ new WeakMap();
	/** Uses immutable wire size, or JSON accounting for a custom emitter. @internal */
	function getWebSocketEventBytes(event) {
		return webSocketEventBytes.get(event) ?? (0, ws_1.rawByteLength)(JSON.stringify(event));
	}
	/** Original JSON, available only during synchronous event notification.
	* @internal
	*/
	function getWebSocketEventPayload(event) {
		return webSocketEventPayloads.get(event);
	}
	var ResponsesWSBase = class extends internal_base_1.ResponsesEmitter {
		constructor(client, options) {
			super();
			this._isReconnecting = false;
			this._intentionallyClosed = false;
			this._closeCode = 1e3;
			this._closeReason = "OK";
			this._lastCloseCode = 1006;
			this._lastCloseReason = "";
			this._internalEvents = new EventEmitter_1.InternalEventEmitter();
			this._client = client;
			this._parameters = void 0;
			this._reconnectOptions = options?.reconnect ?? null;
			this._sendQueue = new ws_1.SendQueue(options?.maxQueueSize);
		}
		/** Establishes the initial WebSocket connection. */
		_connectInitial() {
			this.url = (0, internal_base_1.buildURL)(this._client, {});
			this.socket = this._connect();
		}
		send(event) {
			if (!this.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			if (this._isReconnecting || this.socket.readyState === ws_adapter_1.ReadyState.CONNECTING) {
				if (!this._sendQueue.enqueue(event)) this._onError(null, "send queue is full, message discarded", void 0);
				return;
			}
			if (this.socket.readyState !== ws_adapter_1.ReadyState.OPEN) {
				this._onError(null, "cannot send on a closed WebSocket", void 0);
				return;
			}
			try {
				this.socket.send(JSON.stringify(event));
			} catch (err) {
				this._onError(null, "could not send data", err);
			}
		}
		sendRaw(data) {
			if (!this.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			if (this._isReconnecting || this.socket.readyState === ws_adapter_1.ReadyState.CONNECTING) {
				if (!this._sendQueue.enqueueRaw(data)) this._onError(null, "send queue is full, message discarded", void 0);
				return;
			}
			if (this.socket.readyState !== ws_adapter_1.ReadyState.OPEN) {
				this._onError(null, "cannot send on a closed WebSocket", void 0);
				return;
			}
			try {
				this.socket.send((0, ws_1.flattenRawData)(data));
			} catch (err) {
				this._onError(null, "could not send data", err);
			}
		}
		close(props) {
			if (!this.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			this._intentionallyClosed = true;
			this._closeCode = props?.code ?? 1e3;
			this._closeReason = props?.reason ?? "OK";
			this._cancelRefresh?.();
			try {
				this.socket.close(this._closeCode, this._closeReason);
			} catch (err) {
				this._onError(null, "could not close the connection", err);
			}
		}
		/**
		* Returns an async iterator over WebSocket lifecycle and message events,
		* providing an alternative to the event-based `.on()` API.
		* The iterator will exit if the socket closes but exiting the iterator
		* does not close the socket.
		*
		* Pass `maxBufferedEvents` to limit queued records for this iterator, including
		* lifecycle events. Overflow discards its backlog and rejects `next()` with a
		* WebSocketError; the shared socket and other iterators remain active.
		* Omitted means unlimited. This is an event-count limit, not a byte limit.
		*
		* @example
		* ```ts
		* for await (const event of client.stream()) {
		*   switch (event.type) {
		*     case 'message':
		*       console.log('received:', event.message);
		*       break;
		*     case 'error':
		*       console.error(event.error);
		*       break;
		*     case 'close':
		*       console.log('connection closed');
		*       break;
		*   }
		* }
		* ```
		*/
		stream(options) {
			return options === void 0 ? this[Symbol.asyncIterator]() : this[Symbol.asyncIterator](options);
		}
		[Symbol.asyncIterator](options) {
			if (!this.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			const maxBufferedEvents = (0, ws_1.getMaxBufferedEvents)(options);
			const queue = [];
			const resolvers = [];
			let queueHead = 0;
			let resolverHead = 0;
			let done = false;
			let failure;
			let currentSocket = this.socket;
			const wakeResolver = () => {
				if (resolverHead >= resolvers.length) return;
				const resolver = resolvers[resolverHead];
				resolvers[resolverHead] = void 0;
				resolverHead += 1;
				if (resolverHead >= 64 && resolverHead * 2 >= resolvers.length) {
					resolvers.splice(0, resolverHead);
					resolverHead = 0;
				}
				resolver?.();
			};
			const push = (msg) => {
				if (done) return;
				if (maxBufferedEvents !== void 0 && queue.length - queueHead >= maxBufferedEvents) {
					failure = new internal_base_1.WebSocketError(`WebSocket stream exceeded maxBufferedEvents (${maxBufferedEvents})`, null);
					done = true;
					queue.length = 0;
					queueHead = 0;
					cleanup();
					flushResolvers();
					return;
				}
				queue.push(msg);
				wakeResolver();
			};
			const onEvent = (event) => {
				if (event.type === "error") return;
				push({
					type: "message",
					message: event
				});
			};
			const onRaw = (data) => {
				push({
					type: "raw",
					data
				});
			};
			const onEmitterError = (err) => {
				push({
					type: "error",
					error: err
				});
			};
			const onOpen = () => {
				push({ type: "open" });
			};
			const onReconnecting = (evt) => {
				push({
					type: "reconnecting",
					reconnect: evt
				});
			};
			const onReconnected = () => {
				push({ type: "reconnected" });
			};
			const flushResolvers = () => {
				while (resolverHead < resolvers.length) {
					const resolver = resolvers[resolverHead];
					resolvers[resolverHead] = void 0;
					resolverHead += 1;
					resolver?.();
				}
				resolvers.length = 0;
				resolverHead = 0;
			};
			const onClose = (code, reason, unsent) => {
				push({
					type: "close",
					code,
					reason,
					unsent
				});
				done = true;
				flushResolvers();
				cleanup();
			};
			const onSocketSwap = (_oldSocket, newSocket) => {
				if (currentSocket === newSocket) return;
				currentSocket.off("open", onOpen);
				newSocket.on("open", onOpen);
				currentSocket = newSocket;
			};
			const cleanup = () => {
				this.off("event", onEvent);
				this.off("raw", onRaw);
				this.off("error", onEmitterError);
				currentSocket.off("open", onOpen);
				this._internalEvents.off("close", onClose);
				this._internalEvents.off("socketSwap", onSocketSwap);
				this._internalEvents.off("reconnecting", onReconnecting);
				this._internalEvents.off("reconnected", onReconnected);
			};
			this.on("event", onEvent);
			this.on("raw", onRaw);
			this.on("error", onEmitterError);
			this.socket.on("open", onOpen);
			this._internalEvents.on("close", onClose);
			this._internalEvents.on("socketSwap", onSocketSwap);
			this._internalEvents.on("reconnecting", onReconnecting);
			this._internalEvents.on("reconnected", onReconnected);
			if (this._isReconnecting) push({
				type: "reconnecting",
				reconnect: {
					attempt: 0,
					maxAttempts: 0,
					delay: 0,
					closeCode: 0,
					parameters: void 0
				}
			});
			else switch (this.socket.readyState) {
				case ws_adapter_1.ReadyState.CONNECTING:
					push({ type: "connecting" });
					break;
				case ws_adapter_1.ReadyState.OPEN:
					push({ type: "open" });
					break;
				case ws_adapter_1.ReadyState.CLOSING:
					push({ type: "closing" });
					break;
				case ws_adapter_1.ReadyState.CLOSED:
					push({
						type: "close",
						code: this._lastCloseCode,
						reason: this._lastCloseReason,
						unsent: this._sendQueue.drain()
					});
					done = true;
					cleanup();
			}
			const resolve = (res, reject) => {
				if (failure) reject(failure);
				else if (queueHead < queue.length) {
					const queued = queue[queueHead];
					queue[queueHead] = void 0;
					queueHead += 1;
					if (queueHead >= 64 && queueHead * 2 >= queue.length) {
						queue.splice(0, queueHead);
						queueHead = 0;
					}
					res({
						value: queued,
						done: false
					});
				} else if (done) res({
					value: void 0,
					done: true
				});
				else return false;
				return true;
			};
			const next = () => new Promise((res, reject) => {
				if (resolve(res, reject)) return;
				resolvers.push(() => {
					resolve(res, reject);
				});
			});
			return {
				next,
				return: () => {
					done = true;
					queue.length = 0;
					queueHead = 0;
					cleanup();
					flushResolvers();
					return Promise.resolve({
						value: void 0,
						done: true
					});
				},
				[Symbol.asyncIterator]() {
					return this;
				}
			};
		}
		_connect(createSocket = (url) => this._createSocket(url, this._authHeaders()), url = (0, internal_base_1.buildURL)(this._client, this._parameters ?? {})) {
			this.url = url;
			const socket = createSocket(this.url);
			socket.on("message", (data, isBinary) => {
				if (isBinary) {
					this._emit("raw", data);
					return;
				}
				const text = typeof data === "string" ? data : String(data);
				let event;
				try {
					event = JSON.parse(text);
				} catch {
					this._emit("raw", data);
					return;
				}
				if (event === null || typeof event !== "object" || Array.isArray(event) || !Object.prototype.hasOwnProperty.call(event, "type") || typeof event.type !== "string") {
					this._onError(null, "received invalid WebSocket event: expected an object with an own string type", void 0);
					return;
				}
				const eventType = event.type;
				const errorEvent = event.type === "error" ? event : void 0;
				if ((eventType === "raw" || eventType === "close" || eventType === "event" || eventType === "reconnecting" || eventType === "reconnected" || eventType === "open" || eventType === "error") && eventType !== "error") {
					this._onError(null, "received reserved WebSocket event type", void 0);
					return;
				}
				webSocketEventBytes.set(event, (0, ws_1.rawByteLength)(data));
				webSocketEventPayloads.set(event, text);
				try {
					this._emit("event", event);
				} finally {
					webSocketEventPayloads.delete(event);
				}
				if (errorEvent) this._onError(errorEvent);
				else this._emit(eventType, event);
			});
			socket.on("error", (err) => {
				(0, ws_1.recordWebSocketError)(socket, err);
				if (this._isReconnecting) return;
				this._onError(null, err.message, err);
			});
			socket.on("open", () => {
				this._flushSendQueue();
			});
			socket.on("close", (code, reason) => {
				if (socket !== this.socket) return;
				if (!this._intentionallyClosed && this._canReconnect(code)) this._reconnect(code);
				else if (!this._isReconnecting) this._emitPermanentClose(code, reason);
			});
			return socket;
		}
		_canReconnect(code) {
			if (this._intentionallyClosed) return false;
			if (!this._reconnectOptions) return false;
			if (this._reconnectOptions.maxRetries === 0) return false;
			if (!this._reconnectOptions.onReconnecting) return false;
			return (0, ws_1.isRecoverableClose)(code);
		}
		async _reconnect(closeCode) {
			if (!this.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			if (this._isReconnecting || !this._reconnectOptions) return;
			this._isReconnecting = true;
			const maxRetries = this._reconnectOptions.maxRetries ?? 5;
			const initialDelay = this._reconnectOptions.initialDelay ?? 500;
			const maxDelay = this._reconnectOptions.maxDelay ?? 8e3;
			for (let attempt = 1; attempt <= maxRetries; attempt++) {
				if (!this._canReconnect(closeCode)) {
					this._isReconnecting = false;
					if (!this._intentionallyClosed) this._onError(null, `WebSocket reconnect aborted: non-recoverable close code ${closeCode}`, void 0);
					this._emitPermanentClose(this._intentionallyClosed ? this._closeCode : closeCode, this._intentionallyClosed ? this._closeReason : "reconnect aborted");
					return;
				}
				const baseDelay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
				const jitter = .75 + Math.random() * .25;
				const actualDelay = Math.round(baseDelay * jitter);
				let reconnectingEvent = {
					attempt,
					maxAttempts: maxRetries,
					delay: actualDelay,
					closeCode,
					parameters: this._parameters ? { ...this._parameters } : void 0
				};
				let overrides;
				try {
					overrides = this._reconnectOptions.onReconnecting(reconnectingEvent);
				} catch (err) {
					this._isReconnecting = false;
					this._onError(null, "onReconnecting callback threw", err);
					this._emitPermanentClose(closeCode, "onReconnecting callback threw");
					return;
				}
				if (overrides && "abort" in overrides && overrides.abort) {
					this._isReconnecting = false;
					this._emitPermanentClose(closeCode, "reconnect aborted by handler");
					return;
				}
				if (overrides && "parameters" in overrides) {
					this._parameters = overrides.parameters;
					reconnectingEvent = {
						...reconnectingEvent,
						parameters: this._parameters
					};
				}
				try {
					this._emit("reconnecting", reconnectingEvent);
				} catch (err) {
					this._onError(null, "onReconnecting callback threw", err);
				}
				this._internalEvents._emit("reconnecting", reconnectingEvent);
				if (!this._canReconnect(closeCode)) {
					this._isReconnecting = false;
					if (!this._intentionallyClosed) this._onError(null, `WebSocket reconnect aborted: non-recoverable close code ${closeCode}`, void 0);
					this._emitPermanentClose(this._intentionallyClosed ? this._closeCode : closeCode, this._intentionallyClosed ? this._closeReason : "reconnect aborted");
					return;
				}
				await (0, sleep_1.sleep)(actualDelay);
				if (!this._canReconnect(closeCode)) {
					this._isReconnecting = false;
					if (!this._intentionallyClosed) this._onError(null, `WebSocket reconnect aborted: non-recoverable close code ${closeCode}`, void 0);
					this._emitPermanentClose(this._intentionallyClosed ? this._closeCode : closeCode, this._intentionallyClosed ? this._closeReason : "reconnect aborted");
					return;
				}
				let closeCodePromise;
				try {
					const oldSocket = this.socket;
					const url = (0, internal_base_1.buildURL)(this._client, this._parameters ?? {});
					const canceled = new Promise((resolve) => {
						this._cancelRefresh = () => resolve(void 0);
					});
					let createSocket;
					try {
						createSocket = await Promise.race([this._prepareReconnectSocket(), canceled]);
					} finally {
						this._cancelRefresh = void 0;
					}
					if (!this._canReconnect(closeCode)) {
						this._isReconnecting = false;
						this._emitPermanentClose(this._closeCode, this._closeReason);
						return;
					}
					this.socket = this._connect(createSocket, url);
					closeCodePromise = new Promise((resolve) => {
						this.socket.once("close", resolve);
					});
					await this._awaitOpen(this.socket);
					this._internalEvents._emit("socketSwap", oldSocket, this.socket);
					this._isReconnecting = false;
					this._flushSendQueue();
					this._emit("reconnected");
					this._internalEvents._emit("reconnected");
					return;
				} catch {
					if (this._intentionallyClosed) {
						if (this._isReconnecting) {
							this._isReconnecting = false;
							this._emitPermanentClose(this._closeCode, this._closeReason);
						}
						return;
					}
					if (closeCodePromise) closeCode = await closeCodePromise;
				}
			}
			this._isReconnecting = false;
			this._onError(null, `WebSocket reconnect failed after ${maxRetries} attempts (close code: ${closeCode})`, void 0);
			this._emitPermanentClose(closeCode, `reconnect failed after ${maxRetries} attempts`);
		}
		/**
		* Resolves once the socket is open, rejects if it errors or closes first
		*/
		_awaitOpen(socket) {
			return new Promise((resolve, reject) => {
				const cleanup = () => {
					socket.off("open", onOpen);
					socket.off("error", onError);
					socket.off("close", onFail);
				};
				const onOpen = () => {
					cleanup();
					resolve();
				};
				const onError = (err) => {
					cleanup();
					reject(err);
				};
				const onFail = () => {
					cleanup();
					reject(/* @__PURE__ */ new Error("socket closed before open"));
				};
				socket.once("open", onOpen);
				socket.once("error", onError);
				socket.once("close", onFail);
			});
		}
		_flushSendQueue() {
			if (!this.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			try {
				this._sendQueue.flush((data) => this.socket.send((0, ws_1.flattenRawData)(data)));
			} catch (err) {
				this._onError(null, "could not send queued data", err);
			}
		}
		/**
		* Emits the public `close` event with unsent messages and the internal
		* `close` event used by the async iterator.
		*/
		_emitPermanentClose(code, reason) {
			this._lastCloseCode = code;
			this._lastCloseReason = reason;
			const unsent = this._sendQueue.drain();
			this._internalEvents._emit("close", code, reason, unsent);
			this._emit("close", code, reason, unsent);
		}
		_prepareReconnectSocket() {
			const authHeaders = this._authHeaders();
			return Promise.resolve((url) => this._createSocket(url, authHeaders));
		}
		_authHeaders(apiKey = this._client.apiKey) {
			return typeof apiKey === "string" && apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
		}
	};
	exports.ResponsesWSBase = ResponsesWSBase;
}));
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/responses-ws-credentials.js
var require_responses_ws_credentials = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResponsesWebSocketCredentials = void 0;
	const error_1 = require_error$1();
	const realtime_credentials_1 = require_realtime_credentials();
	const ws_1 = require_ws$1();
	/**
	* Keep caller credential admission distinct from the hook's final provider-key transform.
	* The latter reuses captured base headers so no caller getters are reread after the refresh.
	*/
	function buildResponsesWebSocketOptions(client, authHeaders, options, prepared) {
		if (prepared) return prepared.apiKey === void 0 ? (0, ws_1.mergeWebSocketAuthHeaders)(prepared.options, authHeaders, prepared.removedHeaders) : (0, ws_1.buildWebSocketOptions)(client, authHeaders, prepared.options, prepared.removedHeaders, true);
		if (!client._hasApiKeyProvider()) return (0, ws_1.buildWebSocketOptions)(client, authHeaders, options);
		const removedHeaders = /* @__PURE__ */ new Set();
		const provided = (0, ws_1.buildWebSocketOptions)(client, {}, options, removedHeaders);
		return (0, ws_1.snapshotWebSocketCredentials)(provided, ws_1.WEBSOCKET_METADATA_HEADERS) ? provided : (0, ws_1.buildWebSocketOptions)(client, authHeaders, provided, removedHeaders, true);
	}
	/**
	* Classify reconnect credentials without treating the previous SDK key as a caller override.
	* Capture routing and caller options before any asynchronous key refresh.
	*/
	function prepareResponsesWebSocketReconnect(client, socketOptions, initialAuthUsedAPIKey) {
		const removedHeaders = /* @__PURE__ */ new Set();
		const options = (0, ws_1.buildWebSocketOptions)(client, {}, socketOptions, removedHeaders);
		let authentication;
		if ((0, ws_1.snapshotWebSocketCredentials)(options, ws_1.WEBSOCKET_METADATA_HEADERS)) authentication = "provided";
		else if (removedHeaders.has("authorization") || options.headers?.["authorization"] !== void 0 || !initialAuthUsedAPIKey) authentication = "cached";
		else authentication = "refresh";
		return {
			options,
			removedHeaders,
			authentication
		};
	}
	/** Per-connection Responses credential state shared by the stable and beta Node transports. */
	var ResponsesWebSocketCredentials = class {
		constructor() {
			this.initialAuthUsedAPIKey = false;
		}
		get preparedAPIKey() {
			return this.prepared?.apiKey;
		}
		trackInitialHeaders(client, headers, hasSocket) {
			if (!hasSocket() && client._hasApiKeyProvider()) this.initialAPIKey = headers["Authorization"]?.slice(7);
		}
		usesAPIKey(client, headers) {
			const apiKey = this.initialAPIKey ?? (client._hasApiKeyProvider() ? Object.getOwnPropertyDescriptor(client, "apiKey")?.value : void 0);
			if (!apiKey) return false;
			return (0, ws_1.snapshotWebSocketCredentials)({ headers: Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, value?.includes(apiKey) ? value : ""])) }, ws_1.WEBSOCKET_METADATA_HEADERS);
		}
		build(client, authHeaders, options, initialAuthUsedAPIKey) {
			if (initialAuthUsedAPIKey !== void 0) {
				this.initialAuthUsedAPIKey = initialAuthUsedAPIKey;
				this.initialAPIKey = void 0;
			}
			const socketOptions = buildResponsesWebSocketOptions(client, authHeaders, options, this.prepared);
			if (client._hasApiKeyProvider() && !authHeaders["Authorization"] && !(0, ws_1.snapshotWebSocketCredentials)(socketOptions, ws_1.WEBSOCKET_METADATA_HEADERS)) throw new error_1.OpenAIError("Cannot open a Responses WebSocket with an unresolved function-based apiKey. Resolve it before constructing the WebSocket or provide explicit WebSocket credentials.");
			return socketOptions;
		}
		async prepare(client, socketOptions, authHeaders, createSocket) {
			const { options, removedHeaders, authentication } = prepareResponsesWebSocketReconnect(client, socketOptions, this.initialAuthUsedAPIKey);
			const createPreparedSocket = (url, headers, apiKey) => {
				const previous = this.prepared;
				this.prepared = {
					options,
					removedHeaders,
					apiKey
				};
				try {
					return createSocket(url, apiKey === void 0 ? headers : authHeaders(apiKey));
				} finally {
					this.prepared = previous;
				}
			};
			if (authentication !== "refresh") {
				const headers = authentication === "provided" ? {} : authHeaders();
				return (url) => createPreparedSocket(url, headers);
			}
			const { commit } = await (0, realtime_credentials_1.resolveRealtimeAPIKey)(client, true);
			return (url) => createPreparedSocket(url, {}, commit());
		}
	};
	exports.ResponsesWebSocketCredentials = ResponsesWebSocketCredentials;
}));
//#endregion
//#region packages/ai/src/transports/openai-responses-websocket.ts
var import_ws = (/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResponsesWS = void 0;
	const WS = require_tslib().__importStar(require_ws$2());
	const ws_adapter_node_1 = require_ws_adapter_node();
	const ws_base_1 = require_ws_base();
	const responses_ws_credentials_1 = require_responses_ws_credentials();
	var ResponsesWS = class extends ws_base_1.ResponsesWSBase {
		constructor(client, options) {
			if (!WS?.WebSocket) throw new Error("ResponsesWS from \"openai/resources/responses/ws\" requires the \"ws\" package but it could not be loaded.");
			const { reconnect, maxQueueSize, ...wsOptions } = options ?? {};
			super(client, {
				reconnect,
				maxQueueSize
			});
			this._credentials = new responses_ws_credentials_1.ResponsesWebSocketCredentials();
			this._wsOptions = wsOptions;
			this._connectInitial();
		}
		_authHeaders(apiKey) {
			const headers = super._authHeaders(apiKey === void 0 ? this._credentials.preparedAPIKey : apiKey);
			this._credentials.trackInitialHeaders(this._client, headers, () => !!this.socket);
			return headers;
		}
		/**
		* Whether credentials passed to the Node transport use the SDK key.
		* The SDK recognizes its key, including copies and additions in credential headers.
		* Override and return true if your socket hook signs or otherwise irreversibly transforms it.
		* Explicit caller options and header removals still take precedence on reconnect.
		*/
		_usesSDKAPIKey(authHeaders) {
			return this._credentials.usesAPIKey(this._client, authHeaders);
		}
		_createSocket(url, authHeaders) {
			const capturedAuthHeaders = { ...authHeaders };
			const socketOptions = this._credentials.build(this._client, capturedAuthHeaders, this._wsOptions, !this.socket ? this._usesSDKAPIKey(capturedAuthHeaders) : void 0);
			return new ws_adapter_node_1.NodeWebSocket(new WS.WebSocket(url, socketOptions));
		}
		async _prepareReconnectSocket() {
			if (!this._client._hasApiKeyProvider()) return super._prepareReconnectSocket();
			return this._credentials.prepare(this._client, (0, ws_adapter_node_1.snapshotNodeWebSocketOptions)(this._wsOptions), (...args) => this._authHeaders(...args), (url, headers) => this._createSocket(url, headers));
		}
	};
	exports.ResponsesWS = ResponsesWS;
})))();
const SESSION_WEBSOCKET_CACHE_TTL_MS = 3e5;
const SESSION_WEBSOCKET_MAX_AGE_MS = 33e5;
const WEBSOCKET_OPEN_STATE = 1;
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
	const socket = new import_ws.ResponsesWS(connection.client, {
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
	if (params.mode === "websocket" || !params.sessionId) return createTransientWebSocketLease(connection);
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
		get hasActiveResponse() {
			return Boolean(steering?.responseId || resumedSteering);
		},
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
		const independent = independentResponsesRequest.has(options);
		const compactRequest = claimResponsesCompactRequest(responsesOptions);
		const v2Compaction = compactRequest?.mode === "v2" ? createResponsesV2CompactionCollector(compactRequest.replayBudget) : void 0;
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = createAssistantOutput(model, config.outputApi);
			let firstEventAbort;
			let continuationClaim;
			const requestLifecycle = responsesRequestLifecycle.get(options);
			try {
				if (compactRequest && requestLifecycle) throw new Error("Provider review continuation cannot replace its reviewed input with compaction");
				const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
				const websocketMode = independent ? void 0 : resolveNativeOpenAIResponsesWebSocketMode(model, responsesOptions?.transport);
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
					onSseComment: () => notifyLlmRequestActivity(options?.signal, false)
				}) ?? buildGuardedModelFetch(model), options?.onResponse, model);
				const client = config.createClient(model, apiKey, httpHeaders, fetchOverride);
				const nativeAstra = model.id === "gpt-6-astra" && supportsNativeOpenAIResponsesEndpoint(model);
				const asyncToolExecutionEligible = nativeAstra && options?.asyncToolExecution === true && !responsesOptions?.openclawCodeModeToolSurface;
				const prepareRequest = async (request) => {
					let params = request;
					const preserveUsers = v2Compaction?.preserveUsers(request.input ?? []);
					const nextParams = await options?.onPayload?.(params, model);
					if (nextParams !== void 0) params = nextParams;
					if (preserveUsers) params = {
						...params,
						input: preserveUsers(params.input ?? [])
					};
					params = sanitizeOpenAICodexResponsesParams(model, params);
					params = v2Compaction ? v2Compaction.sanitizeImages(params) : sanitizeResponsesImagePayload(params);
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
				const buildRequest = (replayMode, requestContext = context) => prepareRequest(config.buildRequest(model, requestContext, responsesOptions, turnState?.metadata, replayMode, Boolean(v2Compaction)));
				let params = await buildRequest("checkpoint");
				const asyncTools = !compactRequest && asyncToolExecutionEligible && params.model === "gpt-6-astra" && params.multi_agent?.enabled !== true;
				if (compactRequest?.mode === "endpoint") {
					const compacted = await postOpenAIResponsesCompaction({
						client,
						model,
						request: params,
						options: responsesOptions
					});
					output.usage.input = compacted.usage.input_tokens;
					output.usage.output = compacted.usage.output_tokens;
					output.usage.totalTokens = compacted.usage.input_tokens + compacted.usage.output_tokens;
					output.usage.usageReport = { state: "available" };
					compactRequest.resolve(compacted);
					finalizeTransportStream({
						stream,
						output,
						signal: options?.signal
					});
					return;
				}
				const sessionId = options?.sessionId;
				if (config.httpContinuation && !compactRequest && !independent && !websocketMode && !getAiTransportHost().requiresManagedTransport(model) && (supportsNativeOpenAIResponsesEndpoint(model) || resolveOpenAIResponsesPayloadPolicy(model).explicitContinuationOptIn) && sessionId && (params.store === true || supportsResponsesReasoningUpdate(params)) && !params.previous_response_id) {
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
					emitModelTransportDebug(log, `[responses] websocket_selected provider=${model.provider} api=${model.api} model=${model.id} mode=${websocketMode} reused=${websocket.reusedConnection} continuation=${websocket.continuationStatus === "continued"} continuationStatus=${websocket.continuationStatus} sessionIdHash=${redactIdentifier(options?.sessionId)} headersHash=${redactIdentifier(JSON.stringify(Object.entries(websocketHeaders ?? {}).toSorted(([a], [b]) => a.localeCompare(b))))}`);
					responseStream = createRecoverableResponsesWebSocketStream({
						trackedWebSocketStream: observeResponsesStream(v2Compaction ? v2Compaction.observe(responseModelTracker.track(void 0, websocket.stream)) : responseModelTracker.track(void 0, websocket.stream), model, requestStartedAt, websocket.request, "websocket"),
						websocket,
						websocketSignal,
						options,
						output,
						buildRequest,
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
				else responseStream = await createSseStream();
				try {
					const acceptedResponseStream = withResponsesRequestAcceptance(responseStream, requestLifecycle, transport === "websocket" ? websocketSignal : firstEvent.signal);
					const terminal = await processResponsesStream(acceptedResponseStream, output, stream, model, {
						canRetryIdentityConflict: () => hasOnlyResponsesFunctionTools(transport === "websocket" ? websocketBaseline : continuationBaseline),
						...config.pricingOptions?.(responsesOptions, model),
						resolveServiceTier: (responseTier, originalTier) => responseTier ?? (requestedTier === "priority" || requestedTier === "default" ? requestedTier : originalTier),
						onServiceTier: (tier, response) => responsesServiceTierObserver.observe(options, requestedTier, tier, response),
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
					const admitted = !independent && (transport === "websocket" ? websocketBaseline : continuationBaseline);
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
				emitModelTransportDebug(log, `[responses] completed provider=${model.provider} api=${model.api} model=${model.id} transport=${transport} elapsedMs=${Date.now() - requestStartedAt}`);
				finalizeTransportStream({
					stream,
					output,
					signal: options?.signal
				});
			} catch (error) {
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
				if (error instanceof ResponsesStreamFailure && error.observation) logResponsesFailedNoDetails(error.observation);
				const incompleteReason = output.diagnostics?.find(({ type }) => type === "openai_responses_terminal")?.details?.incompleteReason;
				emitModelTransportError(log, "responses", `provider=${model.provider} api=${model.api} model=${model.id} ` + summarizeOpenAITransportError(error, firstEventAbort?.signal ?? options?.signal) + (typeof incompleteReason === "string" ? ` incompleteReason=${incompleteReason}` : ""), options?.signal);
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
		let discardCandidate = false;
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
				client: createDirectCompletionsClient(model, context, apiKey, options, cacheRetention === "none" ? void 0 : options?.sessionId, policy.compat),
				sawStreamDONE: void 0
			} : createManagedCompletionsClient(model, context, options, apiKey, cacheRetention);
			const builtParams = buildOpenAICompletionsRequest(model, context, options, policy);
			let params = builtParams;
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
			const contextOutputBudget = resolveCompletionsContextOutputBudget(builtParams, params);
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
			const buffered = contextOutputBudget === void 0 ? void 0 : await bufferContextLimitedCompletions(providerStream, options?.signal);
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
					if (mode === "direct") for (const block of output.content) {
						delete block.index;
						if (block.type === "toolCall") delete block.partialJson;
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
function createDirectCompletionsClient(model, context, apiKey, options, sessionId, compat) {
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
export { hasResponsesWebSearchTool as a, flattenCompletionMessagesToStringContent as c, hasOpenAICompatibleConversationTurn as d, canonicalizeMaxTokensParam as f, createOpenAIResponsesTransportStreamFn as i, stripCompletionMessagesToRoleContent as l, createDeepSeekTextFilter as m, streamOpenAICompletionsRequest as n, buildOpenAICompletionsParams as o, resolveMaxTokensParam as p, createAzureOpenAIResponsesTransportStreamFn as r, convertMessages as s, createOpenAICompletionsTransportStreamFn as t, applyCompletionsAnthropicCacheControl as u };
