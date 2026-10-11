import { r as appendAssistantThinking } from "./event-stream-D8PARQfL.mjs";
import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { n as isOpenAIGpt55Model, r as isOpenAIGpt56Model, t as isOpenAIGpt54MiniModel } from "./openai-reasoning-effort-ash8dPrd.mjs";
import { r as uniqueStrings } from "./string-normalization-J9ZiLfGO.mjs";
import { _ as isImageWithMediaPayload, d as describeToolResultMediaPlaceholder, m as extractToolResultText, v as sanitizeSurrogates } from "./host-yTvBrYM2.mjs";
import { t as truncateUtf16Safe } from "./utf16-slice-CvGodqok.mjs";
import { r as resolveOpenAIPromptCacheParams } from "./openai-prompt-cache-CjV_2IRI.mjs";
import { r as emitModelTransportDebug } from "./diagnostics-CH8j2wIG.mjs";
import { i as asNonNegativeFiniteNumber } from "./base64-CPmadnUf.mjs";
import { c as supportsModelTools, r as estimateStringChars } from "./transport-utils-03Qi0CN2.mjs";
import { c as shouldOmitOllamaCompatResponseFormat, n as isNativeOpenAIEndpoint, s as resolveOpenAICompletionsResponseFormat, t as detectOpenAICompletionsCompat } from "./openai-completions-compat-CUollwl6.mjs";
import { i as resolveProviderEndpoint, r as resolveOpenAIStrictToolSetting } from "./host-policy-DZO3oPPk.mjs";
import { t as resolveCacheRetention } from "./cache-retention-0x979a5V.mjs";
import { f as splitSystemPromptCacheBoundary, h as stripSystemPromptRelocatableBoundary, m as stripSystemPromptCacheBoundary, p as splitSystemPromptRelocatableBoundary, v as sortPromptCacheToolsByName } from "./simple-options-np1XPuhm.mjs";
import { A as resolvePromptCacheKey, C as isOpenAICompletionsThinkingEnabled, D as readOpenAICompletionsContentDeltas, E as parseOpenAICompletionsUsage, O as readOpenAICompletionsReasoningBatch, T as measureUtf8AppendBytes, d as prepareOpenAITools, f as projectOpenAITools, g as resolveOpenAISimpleReasoningEffort, h as resolveOpenAIRequestReasoning, j as throwIfModelStreamAborted, p as reconcileOpenAICompletionsToolChoice, s as getCompat, u as resolveOpenAIStrictToolFlagWithDiagnostics, v as GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, w as log, y as createModelStreamCooperativeScheduler } from "./openai-transport-params-DZKOTSfH.mjs";
import { E as parseStreamingJson, c as finalizeTerminalToolCallArguments, w as createToolArgumentPreviewSchedule } from "./transport-stream-shared-B5RioB_Q.mjs";
import { a as tagUnresolvedTextAsCommentary, i as tagPendingCommentaryText, n as rememberPendingCommentaryTags, r as tagInterruptedTextPhases, t as clearPendingCommentaryText } from "./assistant-text-phase-C20rxWwP.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-BjtkplhG.mjs";
import { a as withFirstStreamEventTimeout } from "./stream-first-event-timeout-BeptfRL6.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-BTocjCRs.mjs";
import { f as withPreparedToolSchemaNormalization, r as normalizeOpenAIStrictToolParameters } from "./openai-tool-schema-D4BMcj2D.mjs";
import { isGoogleGemini3FlashModel, isGoogleGemini3ProModel } from "./internal/google-model-family.mjs";
import { t as mapOpenAIStopReason } from "./openai-stop-reason-Drnn_6Qj.mjs";
import { t as createReasoningTagTextPartitioner } from "./reasoning-tag-text-partitioner-BKmeGUBE.mjs";
import { randomUUID } from "node:crypto";
//#region packages/ai/src/transports/deepseek-dsml-grammar.ts
const DEEPSEEK_DSML_MARKERS = [
	"|",
	"｜",
	"｜｜"
].map((bar) => `${bar}DSML${bar}`);
const DEEPSEEK_DSML_MARKER_PATTERN = `(${DEEPSEEK_DSML_MARKERS.map((marker) => marker.replaceAll("|", "\\|")).join("|")})`;
//#endregion
//#region packages/ai/src/transports/deepseek-text-filter.ts
/**
* DeepSeek DSML streaming text filter.
* Removes provider-emitted DSML tool markup while buffering split tag prefixes
* across streamed chunks.
*/
const DSML_KINDS = [
	"tool_use_error",
	"tool_calls",
	"tool_call",
	"function_calls"
];
const DSML_OPEN_TOKENS = DEEPSEEK_DSML_MARKERS.flatMap((marker) => DSML_KINDS.map((kind) => `<${marker}${kind}>`));
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
			const open = findEarliestToken(buffer, DSML_OPEN_TOKENS);
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
			const keep = longestDsmlOpenPrefixSuffixLength(buffer);
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
function findEarliestToken(text, tokens) {
	let best = null;
	for (const token of tokens) {
		const index = text.indexOf(token);
		if (index !== -1 && (!best || index < best.index)) best = {
			index,
			token
		};
	}
	return best;
}
function longestDsmlOpenPrefixSuffixLength(text) {
	const maxLength = Math.min(text.length, MAX_OPEN_TOKEN_LEN - 1);
	for (let length = maxLength; length > 0; length--) {
		const suffix = text.slice(text.length - length);
		if (DSML_OPEN_TOKENS.some((token) => token.startsWith(suffix))) return length;
	}
	return 0;
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
	const withoutToolCalls = (delta) => {
		const ordinaryDelta = { ...delta };
		delete ordinaryDelta.function_call;
		delete ordinaryDelta.tool_calls;
		return ordinaryDelta;
	};
	const hasObservableContent = (value) => {
		if (typeof value === "string") return value.length > 0;
		if (Array.isArray(value)) return value.some(hasObservableContent);
		if (isRecord(value)) return Object.entries(value).some(([field, nestedValue]) => field !== "type" && field !== "id" && field !== "index" && hasObservableContent(nestedValue));
		return false;
	};
	const hasOrdinaryContent = (delta) => Object.entries(delta).some(([field, value]) => field !== "role" && hasObservableContent(value));
	return (delta, finishReason) => {
		const ordinaryDelta = withoutToolCalls(delta);
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
		if (hasOrdinaryContent(ordinaryDelta)) {
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
const EMPTY_TOOL_RESULT_TEXT = "(no output)";
function sanitizeToolResultText(text, fallback) {
	const sanitized = sanitizeSurrogates(text);
	return sanitized.trim().length > 0 ? sanitized : fallback;
}
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
	const transformedMessages = transformProviderMessages(context.messages, model, (id) => normalizeToolCallId(id));
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
		if (msg.role === "user") {
			const isRuntimeContextCarrier = msg.runtimeContextCarrier === true;
			if (typeof msg.content === "string") {
				const userParam = {
					role: "user",
					content: sanitizeSurrogates(msg.content)
				};
				if (isRuntimeContextCarrier) options.cacheOptOutIndexes?.add(params.length);
				params.push(userParam);
			} else {
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
				const userParam = {
					role: "user",
					content
				};
				if (isRuntimeContextCarrier) options.cacheOptOutIndexes?.add(params.length);
				params.push(userParam);
			}
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
					content: sanitizeToolResultText(textResult, mediaPlaceholder ?? EMPTY_TOOL_RESULT_TEXT),
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
	else if (compat.thinkingFormat === "deepseek" && model.reasoning) {
		params.thinking = { type: reasoningEnabled ? "enabled" : "disabled" };
		if (reasoningEnabled && compat.supportsReasoningEffort && nativeEffort !== void 0) params.reasoning_effort = nativeEffort;
	} else if (compat.thinkingFormat === "together" && model.reasoning) {
		params.reasoning = { enabled: reasoningEnabled };
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
function requiresGoogleCompatToolCallThoughtSignature(model) {
	return isGoogleGemini3ProModel(model.id) || isGoogleGemini3FlashModel(model.id);
}
const GOOGLE_COMPAT_THOUGHT_SIGNATURE_ELLIPSIS_RE = /[\u2026]|\.\.\./;
const GOOGLE_COMPAT_THOUGHT_SIGNATURE_BASE64_RE = /^[A-Za-z0-9+/=]+$/;
function hasGoogleCompatThoughtSignatureTruncationFootprint(value) {
	return GOOGLE_COMPAT_THOUGHT_SIGNATURE_ELLIPSIS_RE.test(value) || GOOGLE_COMPAT_THOUGHT_SIGNATURE_BASE64_RE.test(value) && value.length % 4 !== 0;
}
function injectToolCallThoughtSignatures(outgoingMessages, context, model) {
	if (!isGoogleOpenAICompatModel(model)) return;
	const sigById = /* @__PURE__ */ new Map();
	const fallbackSig = requiresGoogleCompatToolCallThoughtSignature(model) ? GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP : void 0;
	for (const msg of context.messages ?? []) {
		if (msg.role !== "assistant") continue;
		const source = msg;
		if (!Array.isArray(source.content)) continue;
		for (const block of source.content) {
			if (block.type !== "toolCall") continue;
			const id = block.id;
			const sig = block.thoughtSignature;
			if (typeof id === "string" && typeof sig === "string" && sig.length > 0) {
				const isSameRoute = source.api === model.api && source.provider === model.provider && source.model === model.id;
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
	for (const field of COMPLETIONS_REASONING_REPLAY_FIELDS) if (field in record) delete record[field];
}
function sanitizeOpenRouterReasoningReplayFields(record) {
	const reasoningDetails = record.reasoning_details;
	if (typeof reasoningDetails === "string") {
		if (reasoningDetails.length > 0 && typeof record.reasoning !== "string") record.reasoning = reasoningDetails;
		delete record.reasoning_details;
	} else if (reasoningDetails !== void 0 && !Array.isArray(reasoningDetails)) delete record.reasoning_details;
	if ("reasoning" in record && (typeof record.reasoning !== "string" || record.reasoning === "")) delete record.reasoning;
	if ("reasoning_content" in record && (typeof record.reasoning_content !== "string" || record.reasoning_content === "")) delete record.reasoning_content;
	const reasoningText = record.reasoning_text;
	if (typeof reasoningText === "string" && reasoningText.length > 0 && typeof record.reasoning !== "string" && typeof record.reasoning_content !== "string") record.reasoning = reasoningText;
	if ("reasoning_text" in record) delete record.reasoning_text;
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
	const baseCount = candidates.length;
	for (let index = 0; index < baseCount; index += 1) {
		const candidate = candidates[index];
		if (typeof candidate !== "string") continue;
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
	try {
		return isAzureOpenAICompatibleHost(new URL(model.baseUrl).hostname.toLowerCase());
	} catch {
		return false;
	}
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
function estimateOpenAICompletionsInputTokens(payload) {
	let adjustedChars = 0;
	adjustedChars += estimateOpenAICompletionsMessagesChars(payload.messages);
	if (Array.isArray(payload.tools) && payload.tools.length > 0) try {
		adjustedChars += estimateStringChars(JSON.stringify(payload.tools));
	} catch {
		adjustedChars += 1024;
	}
	if (payload.response_format !== void 0) try {
		adjustedChars += estimateStringChars(JSON.stringify(payload.response_format));
	} catch {
		adjustedChars += 256;
	}
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
		if (record.tool_calls !== void 0) try {
			adjustedChars += estimateStringChars(JSON.stringify(record.tool_calls));
		} catch {
			adjustedChars += 256;
		}
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
		try {
			adjustedChars += estimateStringChars(JSON.stringify(block));
		} catch {
			adjustedChars += 256;
		}
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
		const strict = mode === "direct" ? compat.supportsStrictMode ? false : void 0 : resolveOpenAIStrictToolFlagWithDiagnostics(projection, resolveOpenAIStrictToolSetting(model, {
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
			const remainingBudget = Math.max(1, effectiveContextTokens - estimatedInputTokens - 1);
			if (clampedMaxTokens > remainingBudget) {
				clampedMaxTokens = remainingBudget;
				emitModelTransportDebug(log, `[completions] clamp_max_tokens provider=${model.provider} api=${model.api} model=${model.id} requested=${effectiveMaxTokens} output=${clampedMaxTokens} effectiveContext=${effectiveContextTokens} estimatedInput=${estimatedInputTokens}`);
				if (remainingBudget < MIN_USEFUL_OUTPUT_TOKENS) log.warn(`[completions] insufficient_output_budget provider=${model.provider} api=${model.api} model=${model.id} output=${clampedMaxTokens} effectiveContext=${effectiveContextTokens} estimatedInput=${estimatedInputTokens}`);
			}
		}
		if (policy.mode === "direct" ? options?.maxTokens : clampedMaxTokens) {
			if (compat.maxTokensField === "max_tokens") params.max_tokens = clampedMaxTokens;
			else params.max_completion_tokens = clampedMaxTokens;
		}
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
const DEEPSEEK_DSML_TOOL_KINDS = [
	"tool_calls",
	"tool_call",
	"function_calls"
];
const DEEPSEEK_DSML_TOOL_OPEN_TOKENS = DEEPSEEK_DSML_MARKERS.flatMap((marker) => DEEPSEEK_DSML_TOOL_KINDS.map((kind) => `<${marker}${kind}>`));
const DEEPSEEK_DSML_INVOKE_OPEN_PREFIXES = DEEPSEEK_DSML_MARKERS.map((marker) => `<${marker}invoke`);
const DEEPSEEK_DSML_INVOKE_OPEN_TAG = new RegExp(`^<${DEEPSEEK_DSML_MARKER_PATTERN}invoke\\b[^<>]*>$`);
const DEEPSEEK_DSML_TOOL_MAX_OPEN_TOKEN_LEN = Math.max(...DEEPSEEK_DSML_TOOL_OPEN_TOKENS.map((token) => token.length));
const DEEPSEEK_DSML_RECOVERY_MAX_BOUNDARY_LEN = Math.max(...DEEPSEEK_DSML_TOOL_OPEN_TOKENS.map((token) => token.length + 1), ...DEEPSEEK_DSML_INVOKE_OPEN_PREFIXES.map((token) => token.length + 2));
const MAX_DSML_RECOVERY_BUFFER_BYTES = 256e3;
const DEEPSEEK_DSML_SCAN_BATCH_CHARS = 65536;
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
			} : findEarliestStringToken(buffer, DEEPSEEK_DSML_TOOL_OPEN_TOKENS);
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
				const keep = longestDeepSeekDsmlToolOpenPrefixSuffixLength(buffer);
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
		const invokeName = parseXmlAttribute(openMatch[2] ?? "", "name");
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
		const name = parseXmlAttribute(parameterMatch[2] ?? "", "name");
		if (!name) continue;
		const rawValue = parameterMatch[3] ?? "";
		if (rawValue.length === 0) continue;
		args[name] = decodeDeepSeekDsmlText(rawValue);
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
const xmlAttributeRegexCache = /* @__PURE__ */ new Map();
function xmlAttributeRegex(name) {
	const cached = xmlAttributeRegexCache.get(name);
	if (cached) return cached;
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const pattern = new RegExp(`\\b${escaped}=("([^"]*)"|'([^']*)'|([^\\s>]+))`);
	xmlAttributeRegexCache.set(name, pattern);
	return pattern;
}
function parseXmlAttribute(attributes, name) {
	const match = xmlAttributeRegex(name).exec(attributes);
	const value = match?.[2] ?? match?.[3] ?? match?.[4];
	return value ? decodeDeepSeekDsmlText(value) : null;
}
function decodeDeepSeekDsmlText(value) {
	return value.replaceAll("&quot;", "\"").replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
}
function findEarliestStringToken(text, tokens, fromIndex = 0) {
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
		const toolOpen = findEarliestStringToken(text, DEEPSEEK_DSML_TOOL_OPEN_TOKENS, state.offset);
		const toolCloseIndex = text.indexOf(closeToken, state.offset);
		const invokeOpen = findEarliestStringToken(text, DEEPSEEK_DSML_INVOKE_OPEN_PREFIXES, state.offset);
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
function longestDeepSeekDsmlToolOpenPrefixSuffixLength(text) {
	const maxLength = Math.min(text.length, DEEPSEEK_DSML_TOOL_MAX_OPEN_TOKEN_LEN - 1);
	for (let length = maxLength; length > 0; length -= 1) {
		const suffix = text.slice(text.length - length);
		if (DEEPSEEK_DSML_TOOL_OPEN_TOKENS.some((token) => token.startsWith(suffix))) return length;
	}
	return 0;
}
//#endregion
//#region packages/ai/src/transports/openai-completions-stream.ts
function extractToolCallThoughtSignature(toolCall) {
	const tc = toolCall;
	if (!tc) return;
	const fromExtra = (tc.extra_content?.google)?.thought_signature;
	if (typeof fromExtra === "string" && fromExtra.length > 0) return fromExtra;
	const fromFunction = tc.function?.thought_signature;
	if (typeof fromFunction === "string" && fromFunction.length > 0) return fromFunction;
	const fromToolCall = tc.thought_signature;
	return typeof fromToolCall === "string" && fromToolCall.length > 0 ? fromToolCall : void 0;
}
async function processCompletionsStream(responseStream, output, model, stream, options) {
	const MAX_POST_TOOL_CALL_BUFFER_BYTES = 256e3;
	const directMode = options?.mode === "direct";
	const emitReasoning = options?.emitReasoning ?? true;
	const compat = getCompat(model);
	const visibleReasoningDetailTypes = new Set(compat.visibleReasoningDetailTypes);
	const shouldFilterDeepSeekDsmlText = !directMode && compat.thinkingFormat === "deepseek";
	const deepSeekTextFilter = shouldFilterDeepSeekDsmlText ? createDeepSeekTextFilter() : null;
	const deepSeekToolCallRecoverer = shouldFilterDeepSeekDsmlText ? createDsmlRecoverer() : null;
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
	const measureUtf8Bytes = (text) => Buffer.byteLength(text, "utf8");
	let chunkPushedEvent = false;
	const pushStreamEvent = (event) => {
		chunkPushedEvent = true;
		stream.push(event);
	};
	const queuePostToolCallDelta = (next) => {
		const nextBytes = measureUtf8Bytes(next.text);
		if (pendingPostToolCallBytes + nextBytes > MAX_POST_TOOL_CALL_BUFFER_BYTES) throw new Error("Exceeded post-tool-call delta buffer limit");
		pendingPostToolCallBytes += nextBytes;
		const previous = pendingPostToolCallDeltas[pendingPostToolCallDeltas.length - 1];
		if (!previous || previous.kind !== next.kind || previous.kind === "text" && next.kind === "text" && previous.source !== next.source) {
			pendingPostToolCallDeltas.push(next);
			return;
		}
		if (next.kind === "thinking" && previous.kind === "thinking") {
			if (previous.signature !== next.signature) {
				pendingPostToolCallDeltas.push(next);
				return;
			}
			previous.text += next.text;
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
	const appendFilteredVisibleTextDelta = (text) => {
		const recoveredParts = deepSeekToolCallRecoverer?.push(text) ?? [{
			kind: "text",
			text
		}];
		for (const recoveredPart of recoveredParts) {
			if (recoveredPart.kind === "toolCall") {
				appendRecoveredToolCall(recoveredPart);
				continue;
			}
			const parts = deepSeekTextFilter?.push(recoveredPart.text) ?? [recoveredPart.text];
			for (const part of parts) appendVisibleTextDelta(part);
		}
	};
	const flushDeepSeekToolCallRecovererAtEnd = () => {
		const recoveredParts = deepSeekToolCallRecoverer?.flush();
		if (!recoveredParts) return;
		for (const recoveredPart of recoveredParts) {
			if (recoveredPart.kind === "toolCall") {
				appendRecoveredToolCall(recoveredPart);
				continue;
			}
			const parts = deepSeekTextFilter?.push(recoveredPart.text) ?? [recoveredPart.text];
			for (const part of parts) appendVisibleTextDelta(part);
		}
	};
	const flushDeepSeekTextFilterAtEnd = () => {
		const parts = deepSeekTextFilter?.flush();
		if (!parts) return;
		for (const part of parts) appendVisibleTextDelta(part);
	};
	const appendRoutedContentDelta = (delta) => {
		if (delta.kind === "text") {
			appendFilteredVisibleTextDelta(delta.text);
			return;
		}
		if (!emitReasoning) return;
		if (currentBlock?.type === "toolCall" && !directMode) queuePostToolCallDelta(delta);
		else appendThinkingDelta(delta);
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
	const cooperativeScheduler = directMode ? void 0 : createModelStreamCooperativeScheduler(options?.signal);
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
	for await (const rawChunk of guardedStream) {
		throwIfModelStreamAborted(options?.signal);
		chunkPushedEvent = false;
		if (!rawChunk || typeof rawChunk !== "object") {
			if (cooperativeScheduler) await cooperativeScheduler.afterEvent();
			continue;
		}
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
			if (cooperativeScheduler) await cooperativeScheduler.afterEvent();
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
			if (cooperativeScheduler) await cooperativeScheduler.afterEvent();
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
				const routedDeltas = hasReasoningThinking ? reasoningTagTextPartitioner.push(contentDelta.text) : reasoningTagTextPartitioner.pushVisible(contentDelta.text);
				for (const routedDelta of routedDeltas) appendPartitionedVisibleDelta(routedDelta);
			} else {
				beginReasoning(contentDeltaIndex < lastVisibleTextIndex);
				appendRoutedContentDelta(contentDelta);
			}
			if (!hasReasoningThinking) appendReasoningDeltas(reasoningDeltas);
			const toolCallDeltas = normalizedDelta.toolCalls;
			if (toolCallDeltas.length > 0) {
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
		if (cooperativeScheduler) await cooperativeScheduler.afterEvent();
	}
	throwIfModelStreamAborted(options?.signal);
	if (!finishReason && (directMode || options?.sawStreamDONE?.() === false)) throw new Error("Stream ended without finish_reason");
	flushReasoningTagTextPartitioner();
	flushDeepSeekToolCallRecovererAtEnd();
	flushDeepSeekTextFilterAtEnd();
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
	if (!effort || !isOpenAICompletionsThinkingEnabled(effort)) return false;
	return true;
}
function hasOpenAICompletionsReasoningUsageActivity(rawUsage) {
	const reasoningTokens = rawUsage.completion_tokens_details?.reasoning_tokens;
	return typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens) && reasoningTokens > 0;
}
//#endregion
export { convertMessages as a, flattenCompletionMessagesToStringContent as c, canonicalizeMaxTokensParam as d, resolveMaxTokensParam as f, buildOpenAICompletionsRequest as i, stripCompletionMessagesToRoleContent as l, shouldEmitOpenAICompletionsReasoning as n, isAzureOpenAICompatibleHost as o, createDeepSeekTextFilter as p, buildOpenAICompletionsParams as r, finalizeOpenAICompletionsToolCalls as s, processCompletionsStream as t, applyCompletionsAnthropicCacheControl as u };
