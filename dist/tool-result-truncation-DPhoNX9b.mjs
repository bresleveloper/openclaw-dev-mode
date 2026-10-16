import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { n as captureAsyncWorkTracker } from "./async-work-scope-BYeX3gh6.mjs";
import { n as estimateStringChars, r as estimateStringCharsWithMinimumRawWeight } from "./cjk-chars-6ld30jSx.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { H as copyPreparedModelVisibleToolText } from "./redact-DJ8j6ADa.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { Fn as object, Jn as string, Nt as array, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as createDedupeCache } from "./dedupe-qhwfyIea.mjs";
import { f as runPluginStreamConsumer } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DrwZe41_.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { n as emitSessionTranscriptUpdate } from "./transcript-events-DUHAZLVw.mjs";
import { t as createStreamIteratorWrapper } from "./stream-iterator-wrapper-BKsGhmOL.mjs";
import { n as iterateSessionContextEntries } from "./session-DitLEF2L.mjs";
import { c as isToolResultTextBlock, d as sliceToolResultTextTailToBudget, f as sliceToolResultTextToBudget, i as resolveLiveToolResultMaxChars, n as calculateMaxToolResultCharsWithCap, r as resolveAutoLiveToolResultMaxChars, u as readPreparedToolResultTextChars } from "./tool-result-limits-B-fhY8wF.mjs";
import { t as formatFullOutputFooter } from "./tool-contracts-DS9i4t9j.mjs";
import { t as event_stream_exports } from "./event-stream-xGBL9CyU.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { f as recordToolResultPromptProjection, o as hashToolResultProjectionSnapshot } from "./session-prompt-state-DQdMeWc6.mjs";
import { n as isThinkingBlock, t as isAssistantMessageWithContent } from "./thinking-signatures-Oj5tPFAb.mjs";
import { t as rewriteTranscriptEntriesInSessionManager } from "./transcript-rewrite-CgS3Ob1g.mjs";
import { existsSync } from "node:fs";
import { getEventStreamCompletion } from "@openclaw/ai/internal/runtime";
//#region src/agents/embedded-agent-runner/context-truncation-notice.ts
/** Formats a compact notice that preserves the approximate number of omitted characters. */
function formatContextLimitTruncationNotice(truncatedChars) {
	return `[... ${Math.max(1, Math.floor(truncatedChars))} more characters truncated; rerun with narrower args if needed]`;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/stream-wrapper.ts
const eventTransforms = /* @__PURE__ */ new WeakMap();
/** Keep consumer completion behind repair work without changing producer identity. */
function wrapStreamObjectSettlement(stream, settle, beforeEvent = () => true, close = settle) {
	const originalResult = stream.result.bind(stream);
	stream.result = async () => {
		try {
			return await originalResult();
		} finally {
			await settle();
		}
	};
	const originalIterator = stream[Symbol.asyncIterator].bind(stream);
	stream[Symbol.asyncIterator] = () => createStreamIteratorWrapper({
		iterator: originalIterator(),
		next: async (iterator) => {
			let next;
			try {
				next = await iterator.next();
			} catch (error) {
				await close();
				throw error;
			}
			if (next.done || beforeEvent(next.value)) await settle();
			return next;
		},
		onReturn: async (iterator, value) => {
			try {
				return await iterator.return?.(value) ?? {
					done: true,
					value: void 0
				};
			} finally {
				await close();
			}
		},
		onThrow: async (iterator, error) => {
			try {
				if (iterator.throw) return await iterator.throw(error);
				throw error;
			} finally {
				await close();
			}
		}
	});
	return stream;
}
/**
* Mutates a stream so every object event passes through `onEvent` before the
* consumer receives it. Used by stream adapters that need to normalize partial
* and final message snapshots without replacing the stream object.
*/
function wrapStreamObjectEvents(stream, onEvent) {
	const previous = eventTransforms.get(stream);
	if (previous?.iterator === stream[Symbol.asyncIterator]) {
		previous.transforms.push(onEvent);
		return stream;
	}
	const transforms = [onEvent];
	const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
	const iterator = function() {
		const activeTransforms = transforms.slice();
		return createStreamIteratorWrapper({
			iterator: originalAsyncIterator(),
			next: async (streamIterator) => {
				const result = await streamIterator.next();
				if (!result.done && result.value && typeof result.value === "object") for (const transform of activeTransforms) {
					const pending = transform(result.value);
					if (pending) await pending;
				}
				return result;
			}
		});
	};
	stream[Symbol.asyncIterator] = iterator;
	eventTransforms.set(stream, {
		iterator,
		transforms
	});
	return stream;
}
/** Preserve synchronous streams while adapting promise-returning provider implementations. */
function mapAssistantMessageStream(stream, wrap) {
	return stream && typeof stream === "object" && "then" in stream ? Promise.resolve(stream).then(wrap) : wrap(stream);
}
//#endregion
//#region src/agents/embedded-agent-runner/thinking.ts
const THINKING_BLOCK_ERROR_PATTERN = /(?:thinking|redacted_thinking).*?\b(?:cannot be modified|signature|invalid|missing|empty|blank)\b|\b(?:signature|invalid|missing|empty|blank)\b.*?(?:thinking|redacted_thinking)/i;
const OMITTED_ASSISTANT_REASONING_TEXT = "[assistant reasoning omitted]";
function isToolCallBlock(block) {
	if (!block || typeof block !== "object") return false;
	const type = block.type;
	return type === "toolCall" || type === "tool_use" || type === "function_call";
}
function isSignedThinkingBlock(block) {
	const record = block;
	return record.type === "redacted_thinking" || record.signature != null || record.thinkingSignature != null || record.thought_signature != null;
}
function mapAssistantMessages(messages, transform) {
	let touched = false;
	const out = [];
	for (const [index, message] of messages.entries()) {
		const next = isAssistantMessageWithContent(message) ? transform(message, index) : message;
		touched ||= next !== message;
		out.push(next);
	}
	return touched ? out : messages;
}
function filterAssistantContent(message, keepBlock) {
	const content = message.content.filter(keepBlock);
	return content.length === message.content.length ? message : {
		...message,
		content: content.length > 0 ? content : [{
			type: "text",
			text: OMITTED_ASSISTANT_REASONING_TEXT
		}]
	};
}
function hasReplayableThinkingSignature(block) {
	const record = block;
	return (block.type === "redacted_thinking" ? [
		record.data,
		record.signature,
		record.thinkingSignature,
		record.thought_signature
	] : [
		record.signature,
		record.thinkingSignature,
		record.thought_signature
	]).some((signature) => typeof signature === "string" && signature.trim().length > 0);
}
/**
* Providers decide opaque signature validity; only missing or blank signatures are stripped.
* Preserve the latest assistant turn for provider recovery unless the caller appends a user turn.
*/
function stripInvalidThinkingSignatures(messages, options = {}) {
	const latestAssistantIndex = options.preserveLatestAssistant ?? true ? messages.findLastIndex(isAssistantMessageWithContent) : -1;
	return mapAssistantMessages(messages, (message, index) => index === latestAssistantIndex ? message : filterAssistantContent(message, (block) => !isThinkingBlock(block) || hasReplayableThinkingSignature(block)));
}
/**
* Keep the latest turn's replay signatures and preserve empty turns with placeholder text.
* Unchanged history retains its original array identity.
*/
function dropThinkingBlocks(messages) {
	const latestAssistantIndex = messages.findLastIndex(isAssistantMessageWithContent);
	return mapAssistantMessages(messages, (message, index) => index === latestAssistantIndex ? message : stripThinkingBlocksFromMessage(message));
}
function shouldPreserveCurrentToolTurnReasoning(messages, index, latestUserIndex) {
	const message = messages.at(index);
	if (!message || index < latestUserIndex || !isAssistantMessageWithContent(message) || !message.content.some(isToolCallBlock)) return false;
	for (let i = index - 1; i >= 0; i -= 1) {
		const role = messages.at(i)?.role;
		if (role === "user") break;
		if (role === "assistant") return false;
	}
	for (let i = index + 1; i < messages.length; i += 1) {
		const next = messages.at(i);
		const role = next?.role;
		if (next && typeof next === "object" && role === "toolResult") return true;
		if (role === "user") return false;
	}
	return false;
}
function shouldPreserveLatestAssistantThinking(messages) {
	const latestAssistantIndex = messages.findLastIndex(isAssistantMessageWithContent);
	if (latestAssistantIndex < 0) return false;
	if (latestAssistantIndex === messages.length - 1) return true;
	return shouldPreserveCurrentToolTurnReasoning(messages, latestAssistantIndex, messages.findLastIndex((message) => message?.role === "user"));
}
function stripThinkingBlocksFromMessage(message) {
	if (!isAssistantMessageWithContent(message)) return message;
	return filterAssistantContent(message, (block) => !isThinkingBlock(block));
}
function stripAllThinkingBlocks(messages) {
	return mapAssistantMessages(messages, stripThinkingBlocksFromMessage);
}
function dropReasoningFromHistory(messages) {
	const latestUserIndex = messages.findLastIndex((message) => message?.role === "user");
	return mapAssistantMessages(messages, (message, index) => shouldPreserveCurrentToolTurnReasoning(messages, index, latestUserIndex) ? message : stripThinkingBlocksFromMessage(message));
}
function assessLastAssistantMessage(message) {
	if (!isAssistantMessageWithContent(message)) return "valid";
	if (message.content.length === 0) return "incomplete-thinking";
	let hasSignedThinking = false;
	let hasUnsignedThinking = false;
	let hasNonThinkingContent = false;
	let hasEmptyTextBlock = false;
	for (const block of message.content) {
		if (!block || typeof block !== "object") return "incomplete-thinking";
		if (isThinkingBlock(block)) {
			if (isSignedThinkingBlock(block)) hasSignedThinking = true;
			else hasUnsignedThinking = true;
			continue;
		}
		hasNonThinkingContent = true;
		if (block.type === "text" && (typeof block.text !== "string" || !block.text.trim())) hasEmptyTextBlock = true;
	}
	if (hasUnsignedThinking) return "incomplete-thinking";
	if (hasSignedThinking && (!hasNonThinkingContent || hasEmptyTextBlock)) return "incomplete-text";
	return "valid";
}
function shouldRecoverAnthropicThinkingError(error, sessionMeta) {
	return collectErrorGraphCandidates(error, (current) => [
		current.cause,
		current.error,
		current.rawError,
		current.errorMessage,
		current.errorBody,
		current.message
	]).some((candidate) => typeof candidate === "string" && shouldRecoverAnthropicThinkingErrorMessage(candidate, sessionMeta));
}
function shouldRecoverAnthropicThinkingErrorMessage(message, sessionMeta) {
	if (!THINKING_BLOCK_ERROR_PATTERN.test(message)) return false;
	if (sessionMeta.recoveredAnthropicThinking) {
		log.warn(`[session-recovery] Anthropic thinking recovery already attempted: sessionId=${sessionMeta.id}`);
		return false;
	}
	return true;
}
function isAssistantMessageErrorEvent(event) {
	return Boolean(event) && typeof event === "object" && event.type === "error";
}
async function notifyRecoveredAnthropicThinking(sessionMeta, recovery) {
	try {
		await sessionMeta.onRecoveredAnthropicThinking?.(recovery);
	} catch (error) {
		log.warn(`[session-recovery] Anthropic thinking transcript repair hook failed: sessionId=${sessionMeta.id} error=${formatErrorMessage(error)}`);
	}
}
function isSuccessfulRecoveryRetryResult(message) {
	if (!message) return false;
	return message.stopReason !== "error" && message.stopReason !== "aborted";
}
function wrapRetryStreamWithRecoveryNotification(retryStream, notify, trackRecovery, readNotification) {
	if (retryStream instanceof Promise) return retryStream.then((resolved) => wrapRetryStreamWithRecoveryNotification(resolved, notify, trackRecovery, readNotification));
	const resultMethod = Reflect.get(retryStream, "result");
	if (typeof resultMethod !== "function") return retryStream;
	const result = resultMethod.bind(retryStream);
	let completion;
	const finish = () => {
		completion ??= trackRecovery(() => Promise.resolve().then(async () => {
			const message = await result();
			if (isSuccessfulRecoveryRetryResult(message)) await notify();
			return message;
		}));
		completion.catch(() => {});
		return completion;
	};
	retryStream.result = finish;
	const settle = () => finish().then(() => void 0, () => void 0);
	return wrapStreamObjectSettlement(retryStream, settle, isTerminalAssistantEvent, createRecoveryCloseSettlement(retryStream, settle, readNotification));
}
function createRecoveryCloseSettlement(stream, settle, readNotification) {
	let producerCompleted = false;
	getEventStreamCompletion(stream)?.then(() => {
		producerCompleted = true;
	}, () => {
		producerCompleted = true;
	});
	return () => readNotification() ?? (producerCompleted ? settle() : Promise.resolve());
}
function isTerminalAssistantEvent(event) {
	return event.type === "done" || event.type === "error";
}
async function retryStreamWithoutThinking(outer, retry, notify) {
	const retryStream = retry();
	return await runPluginStreamConsumer(retryStream, async () => {
		const resolvedRetry = await retryStream;
		for await (const chunk of resolvedRetry) outer.push(chunk);
		const result = await resolvedRetry.result?.();
		if (isSuccessfulRecoveryRetryResult(result)) await notify();
		return result;
	});
}
async function pumpStreamWithRecovery(outer, stream, sessionMeta, retry, notify) {
	let yieldedOutput = false;
	try {
		return await runPluginStreamConsumer(stream, async () => {
			const resolved = await stream;
			for await (const chunk of resolved) {
				if (isAssistantMessageErrorEvent(chunk)) {
					if (shouldRecoverAnthropicThinkingError(chunk.error, sessionMeta)) {
						if (yieldedOutput) log.warn(`[session-recovery] Anthropic thinking error occurred after streaming began; skipping retry to avoid duplicate chunks: sessionId=${sessionMeta.id}`);
						else {
							sessionMeta.recoveredAnthropicThinking = true;
							log.warn(`[session-recovery] Anthropic thinking stream error; retrying once without thinking blocks: sessionId=${sessionMeta.id}`);
							return retryStreamWithoutThinking(outer, retry, notify);
						}
					}
				} else yieldedOutput = true;
				outer.push(chunk);
			}
			return await resolved.result?.();
		});
	} catch (error) {
		if (!shouldRecoverAnthropicThinkingError(error, sessionMeta)) throw error;
		if (yieldedOutput) {
			log.warn(`[session-recovery] Anthropic thinking error occurred after streaming began; skipping retry to avoid duplicate chunks: sessionId=${sessionMeta.id}`);
			throw error;
		}
		sessionMeta.recoveredAnthropicThinking = true;
		log.warn(`[session-recovery] Anthropic thinking error during stream; retrying once without thinking blocks: sessionId=${sessionMeta.id}`);
		return retryStreamWithoutThinking(outer, retry, notify);
	}
}
function createRecoveryStream(stream, sessionMeta, retry, notify, trackRecovery, readNotification) {
	const outer = (0, event_stream_exports.createAssistantMessageEventStream)();
	const finalResultPromise = trackRecovery(() => pumpStreamWithRecovery(outer, stream, sessionMeta, retry, notify).finally(() => outer.end()));
	finalResultPromise.catch(() => {});
	outer.result = () => finalResultPromise;
	const settle = () => finalResultPromise.then(() => void 0, () => void 0);
	return wrapStreamObjectSettlement(outer, settle, isTerminalAssistantEvent, createRecoveryCloseSettlement(outer, settle, readNotification));
}
function wrapAnthropicStreamWithRecovery(innerStreamFn, sessionMeta) {
	return (model, context, options) => {
		const trackRecovery = captureAsyncWorkTracker();
		const requestMeta = {
			id: sessionMeta.id,
			onRecoveredAnthropicThinking: sessionMeta.onRecoveredAnthropicThinking
		};
		const originalMessages = Array.isArray(context.messages) ? context.messages : [];
		const retry = () => {
			const cleanedMessages = stripAllThinkingBlocks(originalMessages);
			return innerStreamFn(model, {
				...context,
				messages: cleanedMessages
			}, options);
		};
		let notification;
		const readNotification = () => notification;
		const notify = () => {
			notification ??= trackRecovery(() => Promise.resolve().then(() => notifyRecoveredAnthropicThinking(requestMeta, {
				originalMessages,
				cleanedMessages: stripAllThinkingBlocks(originalMessages)
			})));
			return notification;
		};
		const stream = innerStreamFn(model, context, options);
		if (stream instanceof Promise) return runPluginStreamConsumer(stream, () => stream.then((resolved) => createRecoveryStream(resolved, requestMeta, retry, notify, trackRecovery, readNotification), (error) => {
			if (!shouldRecoverAnthropicThinkingError(error, requestMeta)) throw error;
			requestMeta.recoveredAnthropicThinking = true;
			log.warn(`[session-recovery] Anthropic thinking request rejected; retrying once without thinking blocks: sessionId=${requestMeta.id}`);
			return wrapRetryStreamWithRecoveryNotification(retry(), notify, trackRecovery, readNotification);
		}));
		return createRecoveryStream(stream, requestMeta, retry, notify, trackRecovery, readNotification);
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/tool-result-projection-key.ts
const TOOL_RESULT_PROJECTION_KEY = Symbol("toolResultProjectionKey");
function getToolResultProjectionBaseKey(message) {
	if (message.role !== "toolResult") return;
	const toolCallId = message.toolCallId;
	const timestamp = message.timestamp;
	const timestampKey = typeof timestamp === "number" ? `:${timestamp}` : "";
	if (typeof toolCallId === "string" && toolCallId.length > 0) return `tool:${toolCallId}${timestampKey}`;
	return typeof timestamp === "number" ? `timestamp:${timestamp}` : void 0;
}
function getToolResultProjectionKeys(messages, projectionState) {
	const baseKeys = messages.map((message) => getToolResultProjectionBaseKey(message));
	const baseKeyCounts = /* @__PURE__ */ new Map();
	for (const baseKey of baseKeys) if (baseKey) {
		const count = (baseKeyCounts.get(baseKey) ?? 0) + 1;
		baseKeyCounts.set(baseKey, count);
		if (count > 1) projectionState.ambiguousBaseKeys.add(baseKey);
	}
	const occurrences = /* @__PURE__ */ new Map();
	return baseKeys.map((baseKey, index) => {
		const message = messages[index];
		if (message && TOOL_RESULT_PROJECTION_KEY in message && typeof message[TOOL_RESULT_PROJECTION_KEY] === "string") return message[TOOL_RESULT_PROJECTION_KEY];
		if (baseKey && !projectionState.ambiguousBaseKeys.has(baseKey)) return baseKey;
		if (!message || message.role !== "toolResult") return;
		const messageId = message.id;
		const sourceIdentity = typeof messageId === "string" && messageId.length > 0 ? `id:${messageId}` : `text:${hashToolResultText(getToolResultTextBlocks(message))}`;
		const fallbackBase = `fallback:${baseKey ?? "tool"}:${sourceIdentity}`;
		const occurrence = occurrences.get(fallbackBase) ?? 0;
		occurrences.set(fallbackBase, occurrence + 1);
		const key = `${fallbackBase}:${occurrence}`;
		const previousSource = baseKey ? projectionState.sourceHashByKey.get(baseKey) : void 0;
		if (baseKey && previousSource && previousSource === hashToolResultText(getToolResultTextBlocks(message))) {
			const replacement = projectionState.replacements.get(baseKey);
			if (replacement) {
				projectionState.replacements.set(key, replacement);
				projectionState.replacements.delete(baseKey);
			}
			projectionState.sourceHashByKey.set(key, previousSource);
			projectionState.sourceHashByKey.delete(baseKey);
			if (projectionState.frozen.delete(baseKey)) projectionState.frozen.add(key);
		}
		return key;
	});
}
/** Keep canonical transcript identity when provider replay rewrites tool-call ids. */
function bindToolResultPromptProjectionKeys(messages, projectionState) {
	const keys = getToolResultProjectionKeys(messages, projectionState);
	return messages.map((message, index) => {
		const key = keys[index];
		return key ? Object.assign({}, message, { [TOOL_RESULT_PROJECTION_KEY]: key }) : message;
	});
}
function getToolResultTextBlocks(message) {
	if (message.role !== "toolResult") return [];
	const content = message.content;
	return Array.isArray(content) ? content.flatMap((block) => isRecord(block) && block.type === "text" ? [typeof block.text === "string" ? block.text : ""] : []) : [];
}
function hashToolResultText(texts) {
	return sha256Base64Url(JSON.stringify(texts));
}
//#endregion
//#region src/agents/embedded-agent-runner/tool-result-truncation.ts
const PROMPT_TOOL_RESULT_AGGREGATE_CAP_MULTIPLIER = 4;
const AGGREGATE_TOOL_RESULT_CONTEXT_SHARE = .5;
const CACHE_TTL_IMAGE_CHARS = 8e3;
const CACHE_TTL_IMAGE_MARKER = "[image removed during context pruning]";
const CACHE_TTL_DEFAULT_PLACEHOLDER = "[Old tool result content cleared]";
function resolveCacheTtlPruningSettings(config) {
	if (config?.mode !== "cache-ttl") return;
	let ttlMs = 3e5;
	try {
		ttlMs = config.ttl ? parseDurationMs(config.ttl, { defaultUnit: "m" }) : ttlMs;
	} catch {}
	const normalize = normalizeLowercaseStringOrEmpty;
	const deny = compileGlobPatterns({
		raw: config.tools?.deny,
		normalize
	});
	const allow = compileGlobPatterns({
		raw: config.tools?.allow,
		normalize
	});
	return {
		ttlMs,
		hardClear: config.hardClear?.enabled ?? true,
		placeholder: config.hardClear?.placeholder?.trim() || CACHE_TTL_DEFAULT_PLACEHOLDER,
		isToolPrunable: (toolName) => {
			const normalized = normalize(toolName);
			return !matchesAnyGlobPattern(normalized, deny) && (allow.length === 0 || matchesAnyGlobPattern(normalized, allow));
		}
	};
}
function cacheTtlText(block, serializeMalformed = true) {
	if (!isRecord(block) || block.type !== "text") return;
	if (typeof block.text === "string") return block.text;
	if (!serializeMalformed) return;
	try {
		return JSON.stringify(block) ?? "[malformed text block]";
	} catch {
		return "[malformed text block]";
	}
}
function cacheTtlMessageChars(message) {
	if (message.role === "user" && typeof message.content === "string") return estimateStringChars(message.content);
	if (message.role !== "user" && message.role !== "assistant" && message.role !== "toolResult") return 256;
	return (Array.isArray(message.content) ? message.content : []).reduce((chars, block) => {
		if (!isRecord(block)) return chars;
		const text = cacheTtlText(block, message.role !== "assistant");
		if (text !== void 0) return chars + estimateStringChars(text);
		if (block.type === "image") return chars + CACHE_TTL_IMAGE_CHARS;
		if (message.role !== "assistant") return chars;
		if (block.type === "thinking" || block.type === "redacted_thinking") return [
			block.thinking,
			block.thinkingSignature,
			...block.type === "redacted_thinking" ? [block.data] : []
		].reduce((sum, value) => sum + (typeof value === "string" ? estimateStringChars(value) : 0), chars);
		if (block.type !== "toolCall") return chars;
		try {
			return chars + JSON.stringify(block.arguments ?? {}).length;
		} catch {
			return chars + 128;
		}
	}, 0);
}
function softPruneCacheTtlToolResult(message) {
	const content = Array.isArray(message.content) ? message.content : [];
	const hasImage = content.some((block) => isRecord(block) && block.type === "image");
	const text = content.flatMap((block) => cacheTtlText(block) ?? (isRecord(block) && block.type === "image" ? CACHE_TTL_IMAGE_MARKER : [])).join("\n");
	if (!hasImage && text.length <= 4e3) return message;
	const projected = text.length <= 4e3 ? text : `${sliceUtf16Safe(text, 0, 1500)}\n...\n${sliceUtf16Safe(text, -1500)}\n\n[Tool result trimmed: kept first 1500 chars and last 1500 chars of ${text.length} chars.]`;
	return {
		...message,
		content: [{
			type: "text",
			text: projected
		}]
	};
}
/** Projects expired cache-TTL history without mutating the transcript. */
function pruneExpiredCacheTtlToolResults(params) {
	const { settings, projectionState } = params;
	const projection = projectToolResultBranch({
		branch: buildToolResultPlanningBranch(params.messages),
		projectionState,
		recordSources: true
	});
	const messages = params.messages.map((message, index) => projection.branch[index]?.message ?? message);
	const unchanged = messages.some((message, index) => message !== params.messages[index]) ? messages : params.messages;
	let next;
	const recordProjection = (index, message, mode) => {
		const key = projection.keys[index];
		const replacement = key ? Object.assign({}, message, { [TOOL_RESULT_PROJECTION_KEY]: key }) : message;
		if (key) {
			recordToolResultPromptProjection(projectionState, key, replacement, mode);
			projectionState.frozen.add(key);
		}
		(next ??= messages.slice())[index] = replacement;
	};
	if (!params.pruneNewRounds || !params.lastCacheTouchAt || settings.ttlMs <= 0 || params.now - params.lastCacheTouchAt < settings.ttlMs) return unchanged;
	const cutoff = messages.flatMap((message, index) => message.role === "assistant" ? [index] : []).at(-3) ?? -1;
	const start = messages.findIndex((message) => message.role === "user");
	if (cutoff < 0 || start < 0) return unchanged;
	const messageChars = (params.dropThinkingBlocksForEstimate ? dropThinkingBlocks(messages) : messages).map(cacheTtlMessageChars);
	let totalChars = messageChars.reduce((sum, chars) => sum + chars, 0);
	const charWindow = params.contextWindowTokens * 4;
	if (totalChars / charWindow < .3) return unchanged;
	let pruned = false;
	const eligible = [];
	for (let index = start; index < cutoff; index++) {
		const message = messages[index];
		if (message?.role !== "toolResult" || !settings.isToolPrunable(typeof message.toolName === "string" ? message.toolName : "")) continue;
		const key = projection.keys[index];
		const previousMode = key ? projectionState.replacements.get(key)?.cacheTtl : void 0;
		if (previousMode === "hard") continue;
		const candidate = {
			index,
			chars: messageChars[index]
		};
		eligible.push(candidate);
		if (previousMode === "soft") continue;
		const source = params.messages[index];
		const projected = source?.role === "toolResult" ? softPruneCacheTtlToolResult(source) : source;
		if (projected && projected !== source && projected.role === "toolResult") {
			const projectedChars = cacheTtlMessageChars(projected);
			totalChars += projectedChars - candidate.chars;
			candidate.chars = projectedChars;
			recordProjection(index, projected, "soft");
			pruned = true;
		}
	}
	if (totalChars / charWindow >= .5 && settings.hardClear && eligible.reduce((sum, candidate) => sum + candidate.chars, 0) >= 5e4) for (const { index, chars } of eligible) {
		if (totalChars / charWindow < .5) break;
		const message = (next ?? messages)[index];
		if (message?.role !== "toolResult") continue;
		const cleared = {
			...message,
			content: [{
				type: "text",
				text: settings.placeholder
			}]
		};
		totalChars += cacheTtlMessageChars(cleared) - chars;
		recordProjection(index, cleared, "hard");
		pruned = true;
	}
	if (pruned) params.onPruned?.();
	return next ?? unchanged;
}
const MIN_KEEP_CHARS = 2e3;
const RECOVERY_MIN_KEEP_CHARS = 0;
const TOOL_RESULT_WARNING_DEDUPE_LIMIT = 1024;
const toolResultWarningDedupe = {
	promptPressure: createDedupeCache({
		ttlMs: 0,
		maxSize: TOOL_RESULT_WARNING_DEDUPE_LIMIT
	}),
	sessionRecovery: createDedupeCache({
		ttlMs: 0,
		maxSize: TOOL_RESULT_WARNING_DEDUPE_LIMIT
	})
};
const DEFAULT_SUFFIX = formatContextLimitTruncationNotice;
const COMPACT_RECOVERY_SUFFIX = (truncatedChars) => `[... ${Math.max(1, Math.floor(truncatedChars))} chars truncated; narrow args]`;
const AGGREGATE_ELISION_MARKER = "[tool result elided: aggregate tool-result budget exceeded; rerun the command if the output is needed]";
function logToolResultSessionTruncation(params) {
	const sessionLogKey = params.sessionKey ?? params.sessionId ?? "unknown";
	const message = `[tool-result-truncation] Truncated ${params.rewrittenEntries} tool result(s) in session (contextWindow=${params.contextWindowTokens} maxChars=${params.maxChars} aggregateBudgetChars=${params.aggregateBudgetChars} oversized=${params.oversizedReplacementCount} aggregate=${params.aggregateReplacementCount}) sessionKey=${sessionLogKey}`;
	if (params.aggregateReplacementCount <= 0 || toolResultWarningDedupe.sessionRecovery.check(sessionLogKey)) {
		log.info(message);
		return;
	}
	log.warn(`${message}; aggregate tool-result pressure detected; consider /compact or /new if pressure persists`);
}
function resolveSuffixFactory(suffix) {
	return typeof suffix === "function" ? suffix : typeof suffix === "string" ? () => suffix : DEFAULT_SUFFIX;
}
function resolveEffectiveMinKeepChars(params) {
	const suffixFloor = estimateStringCharsWithMinimumRawWeight(params.suffixFactory(1), { minimumRawWeight: params.minimumRawWeight });
	return Math.max(0, Math.min(params.minKeepChars, Math.max(0, params.maxChars - suffixFloor)));
}
function appendBoundedTruncationSuffix(params) {
	let keptText = params.keptText;
	const budgetOptions = { minimumRawWeight: params.minimumRawWeight };
	while (true) {
		const suffix = params.suffixFactory(Math.max(1, params.originalTextLength - keptText.length));
		const suffixChars = estimateStringCharsWithMinimumRawWeight(suffix, budgetOptions);
		if (suffixChars >= params.maxChars) {
			const fullOmissionSuffix = params.suffixFactory(Math.max(1, params.originalTextLength));
			return sliceToolResultTextToBudget(fullOmissionSuffix, params.maxChars, budgetOptions);
		}
		const nextKeptText = sliceToolResultTextToBudget(keptText, params.maxChars - suffixChars, budgetOptions);
		const finalText = nextKeptText + suffix;
		if (nextKeptText.length === keptText.length && estimateStringCharsWithMinimumRawWeight(finalText, budgetOptions) <= params.maxChars) return finalText;
		if (nextKeptText.length === 0 && keptText.length === 0) return sliceToolResultTextToBudget(finalText, params.maxChars, budgetOptions);
		keptText = nextKeptText;
	}
}
const MIDDLE_OMISSION_MARKER = "\n\n⚠️ [... middle content omitted — showing head and tail ...]\n\n";
function hasImportantTail(text) {
	const tail = normalizeLowercaseStringOrEmpty(sliceUtf16Safe(text, -2e3));
	return /\b(error|exception|failed|fatal|traceback|panic|stack trace|errno|exit code)\b/.test(tail) || /\}\s*$/.test(tail.trim()) || /\b(total|summary|result|complete|finished|done)\b/.test(tail);
}
/** Truncates text while preserving an important diagnostic tail when present. */
function truncateToolResultText(text, maxChars, options = {}) {
	const suffixFactory = resolveSuffixFactory(options.suffix);
	const budgetOptions = { minimumRawWeight: options.minimumRawWeight };
	const minKeepChars = resolveEffectiveMinKeepChars({
		maxChars,
		minKeepChars: options.minKeepChars ?? MIN_KEEP_CHARS,
		suffixFactory,
		minimumRawWeight: options.minimumRawWeight
	});
	if (text.length <= maxChars && estimateStringCharsWithMinimumRawWeight(text, budgetOptions) <= maxChars) return text;
	const initialKeptText = sliceToolResultTextToBudget(text, maxChars, budgetOptions);
	const defaultSuffix = suffixFactory(Math.max(1, text.length - initialKeptText.length));
	const budget = Math.max(minKeepChars, maxChars - estimateStringCharsWithMinimumRawWeight(defaultSuffix, budgetOptions));
	if (hasImportantTail(text) && budget > minKeepChars * 2) {
		const tailBudget = Math.min(Math.floor(budget * .3), 4e3);
		const headBudget = budget - tailBudget - estimateStringCharsWithMinimumRawWeight(MIDDLE_OMISSION_MARKER, budgetOptions);
		if (headBudget > minKeepChars) {
			let headText = sliceToolResultTextToBudget(text, headBudget, budgetOptions);
			const headNewline = headText.lastIndexOf("\n");
			if (headNewline > headText.length * .8) headText = sliceUtf16Safe(headText, 0, headNewline);
			let tailText = sliceToolResultTextTailToBudget(text, tailBudget, budgetOptions);
			const tailNewline = tailText.indexOf("\n");
			if (tailNewline !== -1 && tailNewline < tailText.length * .2) tailText = sliceUtf16Safe(tailText, tailNewline + 1);
			if (headText.length + tailText.length < text.length) return appendBoundedTruncationSuffix({
				keptText: headText + MIDDLE_OMISSION_MARKER + tailText,
				originalTextLength: text.length,
				maxChars,
				suffixFactory,
				minimumRawWeight: options.minimumRawWeight
			});
		}
	}
	let keptText = sliceToolResultTextToBudget(text, budget, budgetOptions);
	const lastNewline = keptText.lastIndexOf("\n");
	if (lastNewline > keptText.length * .8) keptText = sliceUtf16Safe(keptText, 0, lastNewline);
	return appendBoundedTruncationSuffix({
		keptText,
		originalTextLength: text.length,
		maxChars,
		suffixFactory,
		minimumRawWeight: options.minimumRawWeight
	});
}
function resolveLiveToolResultAggregateMaxChars(params) {
	const perResultMaxChars = Math.max(1, Math.floor(params.perResultMaxChars ?? resolveLiveToolResultMaxChars({ contextWindowTokens: params.contextWindowTokens })));
	const contextWindowTokens = Number.isFinite(params.contextWindowTokens) ? Math.max(1, Math.floor(params.contextWindowTokens)) : 1;
	const contextShareChars = Math.floor(contextWindowTokens * 4 * AGGREGATE_TOOL_RESULT_CONTEXT_SHARE);
	return Math.max(perResultMaxChars * PROMPT_TOOL_RESULT_AGGREGATE_CAP_MULTIPLIER, contextShareChars);
}
function getToolResultTextBudget(msg) {
	if (!msg || msg.role !== "toolResult") return 0;
	const content = msg.content;
	return Array.isArray(content) ? content.reduce((total, block) => total + (isToolResultTextBlock(block) ? estimateStringCharsWithMinimumRawWeight(block.text) : 0), 0) : 0;
}
function truncateToolResultMessage(msg, maxChars, options = {}) {
	const suffixFactory = resolveSuffixFactory(options.suffix);
	const budgetOptions = { minimumRawWeight: options.minimumRawWeight };
	const minKeepChars = resolveEffectiveMinKeepChars({
		maxChars,
		minKeepChars: options.minKeepChars ?? MIN_KEEP_CHARS,
		suffixFactory,
		minimumRawWeight: options.minimumRawWeight
	});
	const content = msg.content;
	if (!Array.isArray(content)) return msg;
	const blockTextChars = content.map((block) => isToolResultTextBlock(block) ? readPreparedToolResultTextChars(block, block.text, budgetOptions.minimumRawWeight ?? 1) ?? estimateStringCharsWithMinimumRawWeight(block.text, budgetOptions) : 0);
	const totalTextChars = blockTextChars.reduce((sum, chars) => sum + chars, 0);
	if (totalTextChars <= maxChars) return msg;
	let smallBlockChars = 0;
	let largeBlockNoticeChars = 0;
	let totalNoticeChars = 0;
	const blocks = content.map((block, index) => {
		const textChars = blockTextChars[index] ?? 0;
		const text = textChars > 0 && isToolResultTextBlock(block) ? block.text : void 0;
		const small = text !== void 0 && text.length <= minKeepChars && estimateStringCharsWithMinimumRawWeight(text) <= minKeepChars;
		const noticeChars = text === void 0 ? 0 : estimateStringCharsWithMinimumRawWeight(suffixFactory(Math.max(1, text.length)), budgetOptions);
		smallBlockChars += small ? textChars : 0;
		largeBlockNoticeChars += small ? 0 : noticeChars;
		totalNoticeChars += noticeChars;
		return {
			block,
			textChars,
			small,
			noticeChars
		};
	});
	const preserveSmallBlocks = smallBlockChars + largeBlockNoticeChars <= maxChars;
	const preservedChars = preserveSmallBlocks ? smallBlockChars : 0;
	const remainingBudget = Math.max(0, maxChars - preservedChars);
	const reducibleChars = totalTextChars - preservedChars;
	const reducibleNoticeChars = preserveSmallBlocks ? largeBlockNoticeChars : totalNoticeChars;
	const noticeScale = reducibleNoticeChars > 0 ? Math.min(1, remainingBudget / reducibleNoticeChars) : 0;
	const distributableBudget = Math.max(0, remainingBudget - reducibleNoticeChars);
	const newContent = blocks.map(({ block, textChars, small, noticeChars }) => {
		if (!isToolResultTextBlock(block)) return block;
		const preserveBlock = preserveSmallBlocks && small;
		const blockShare = reducibleChars > 0 ? textChars / reducibleChars : 0;
		const noticeBudget = noticeChars * noticeScale;
		const blockBudget = preserveBlock ? textChars : Math.floor(noticeBudget + distributableBudget * blockShare);
		const blockMinKeepChars = preserveBlock ? textChars : Math.floor(minKeepChars * blockShare);
		const truncatedText = truncateToolResultText(block.text, blockBudget, {
			suffix: suffixFactory,
			minKeepChars: blockMinKeepChars,
			minimumRawWeight: options.minimumRawWeight
		});
		const nextBlock = Object.assign({}, block, { text: truncatedText });
		if (typeof block.content === "string") nextBlock.content = truncatedText;
		copyPreparedModelVisibleToolText(block, nextBlock);
		return nextBlock;
	});
	return {
		...msg,
		content: newContent
	};
}
function getToolResultSpillDetails(message) {
	const details = message.details;
	if (!isRecord(details)) return;
	const nestedSpill = isRecord(details.spill) ? details.spill : void 0;
	const path = nestedSpill?.path ?? details.fullOutputPath;
	if (typeof path !== "string" || path.length === 0) return;
	const chars = nestedSpill?.chars ?? details.spilledChars;
	return {
		path,
		truncated: nestedSpill?.truncated === true || details.spillTruncated === true,
		...typeof chars === "number" && Number.isFinite(chars) ? { chars: Math.max(0, Math.floor(chars)) } : {}
	};
}
function resolveAggregateElisionMarkers(message) {
	const spill = getToolResultSpillDetails(message);
	if (!spill) return;
	const content = message.content;
	const footer = formatFullOutputFooter(spill.path);
	const escapedFooter = JSON.stringify(footer).slice(1, -1);
	if (!Array.isArray(content) || !content.some((block) => isToolResultTextBlock(block) && (block.text.includes(footer) || block.text.includes(escapedFooter)))) return;
	if (!existsSync(spill.path)) return;
	const kind = spill.truncated ? "partial" : "full";
	const count = spill.truncated ? ` (${spill.chars === void 0 ? "capped content" : `first ${spill.chars} chars`})` : "";
	const output = `${kind} output`;
	return {
		full: `[tool result elided: ${output} preserved at ${spill.path}${count}; read it if the output is needed]`,
		compact: spill.truncated ? `[partial: ${spill.path}]` : `[read ${spill.path}]`,
		truncationSuffix: (truncatedChars) => `[... ${Math.max(1, Math.floor(truncatedChars))} chars truncated; ${output} at ${spill.path}]`
	};
}
/** Projects bounded tool-result history without mutating the transcript. */
function truncateOversizedToolResultsInMessages(messages, contextWindowTokens, maxCharsOverride, aggregateMaxCharsOverride, projectionState) {
	const { maxChars, aggregateBudgetChars } = resolveToolResultBudgets({
		contextWindowTokens,
		maxCharsOverride,
		aggregateMaxCharsOverride
	});
	const sourceBranch = buildToolResultPlanningBranch(messages);
	const projection = projectionState ? projectToolResultBranch({
		branch: sourceBranch,
		projectionState,
		recordSources: true
	}) : void 0;
	const plan = buildToolResultReplacementPlan({
		branch: projection?.branch ?? sourceBranch,
		maxChars,
		aggregateBudgetChars,
		protectTrailingToolResults: Boolean(projectionState)
	});
	const replacedBranch = plan.branch;
	if (projectionState) for (const [index, { message: originalMessage }] of sourceBranch.entries()) {
		const projectedMessage = replacedBranch[index]?.message;
		const projectionKey = projection?.keys[index];
		if (projectionKey) {
			projectionState.frozen.add(projectionKey);
			if (plan.replacements.length > 0 && projectedMessage?.role === "toolResult" && projectedMessage !== originalMessage) recordToolResultPromptProjection(projectionState, projectionKey, projectedMessage);
		}
	}
	const output = replacedBranch.map((entry) => entry.message);
	return {
		messages: output.some((message, index) => message !== messages[index]) ? output : messages,
		truncatedCount: new Set(plan.replacements.map((replacement) => replacement.entryId)).size,
		aggregateTruncatedCount: plan.aggregateReplacementCount,
		aggregatePressureEngaged: plan.aggregatePressureExceeded,
		aggregateBudgetChars
	};
}
function resolveToolResultBudgets(params) {
	const maxChars = Math.max(1, params.maxCharsOverride ?? calculateMaxToolResultCharsWithCap(params.contextWindowTokens, resolveAutoLiveToolResultMaxChars(params.contextWindowTokens)));
	return {
		maxChars,
		aggregateBudgetChars: Math.max(1, params.aggregateMaxCharsOverride ?? resolveLiveToolResultAggregateMaxChars({
			contextWindowTokens: params.contextWindowTokens,
			perResultMaxChars: maxChars
		}))
	};
}
function buildToolResultPlanningBranch(messages) {
	return (messages.some((message) => message.role === "toolResult") ? messages : []).map((message, index) => ({
		id: `message-${index}`,
		type: "message",
		message
	}));
}
const cacheTtlProjectionSnapshotSchema = object({
	prunedToolResults: array(union([object({
		key: string(),
		mode: literal("soft")
	}), object({
		key: string(),
		mode: literal("hard"),
		placeholder: string()
	})])),
	ambiguousToolResultBaseKeys: array(string()).optional(),
	frozenToolResults: array(object({
		key: string(),
		sourceHash: string(),
		texts: array(string()).optional()
	})).optional()
});
/** Reads pruned keys from the active transcript branch, never from a sibling branch. */
function restoreCacheTtlToolResultProjections(projectionState, entries) {
	projectionState.lastWrittenSnapshotHash = void 0;
	for (let index = entries.length - 1; index >= 0; index--) {
		const entry = entries[index];
		if (entry?.type === "reset") return;
		if (entry?.type !== "custom" || entry.customType !== "openclaw.cache-ttl") continue;
		const parsed = cacheTtlProjectionSnapshotSchema.safeParse(entry.data);
		if (!parsed.success) continue;
		projectionState.lastWrittenSnapshotHash = hashToolResultProjectionSnapshot({
			prunedToolResults: parsed.data.prunedToolResults,
			ambiguousToolResultBaseKeys: parsed.data.ambiguousToolResultBaseKeys ?? [],
			frozenToolResults: parsed.data.frozenToolResults ?? []
		});
		for (const key of parsed.data.ambiguousToolResultBaseKeys ?? []) projectionState.ambiguousBaseKeys.add(key);
		for (const { key, sourceHash, texts } of parsed.data.frozenToolResults ?? []) {
			if (projectionState.sourceHashByKey.has(key)) continue;
			projectionState.sourceHashByKey.set(key, sourceHash);
			projectionState.frozen.add(key);
			if (texts) projectionState.replacements.set(key, { content: texts.map((text) => ({
				type: "text",
				text
			})) });
		}
		for (const { key, ...mark } of parsed.data.prunedToolResults) if (!projectionState.replacements.get(key)?.cacheTtl) projectionState.restoredCacheTtl.set(key, mark);
		return;
	}
}
/** Drops projections whose source messages were removed or rewritten in canonical history. */
function reconcileToolResultPromptProjectionState(messages, projectionState) {
	const keys = getToolResultProjectionKeys(messages, projectionState);
	const canonicalKeys = new Set(messages.flatMap((message, index) => {
		const key = keys[index];
		const source = key ? projectionState.sourceHashByKey.get(key) : void 0;
		return key && (!source || source === hashToolResultText(getToolResultTextBlocks(message))) ? [key] : [];
	}));
	for (const key of [
		...projectionState.frozen,
		...projectionState.replacements.keys(),
		...projectionState.sourceHashByKey.keys()
	]) if (!canonicalKeys.has(key)) {
		projectionState.frozen.delete(key);
		projectionState.replacements.delete(key);
		projectionState.sourceHashByKey.delete(key);
	}
	const representedBaseKeys = new Set(messages.map(getToolResultProjectionBaseKey));
	for (const baseKey of projectionState.ambiguousBaseKeys) if (!representedBaseKeys.has(baseKey)) projectionState.ambiguousBaseKeys.delete(baseKey);
}
function mergeProjectedToolResultMessage(message, projectedContent, sourceHash, cacheTtl) {
	if (message.role !== "toolResult") return message;
	const currentContent = message.content;
	if (!Array.isArray(currentContent) || !Array.isArray(projectedContent)) return {
		...message,
		content: projectedContent
	};
	const projectedText = projectedContent.flatMap((block) => isRecord(block) && block.type === "text" && typeof block.text === "string" ? [block.text] : []);
	const currentText = getToolResultTextBlocks(message);
	if (sourceHash && hashToolResultText(currentText) !== sourceHash) return message;
	if (cacheTtl) return {
		...message,
		content: projectedContent
	};
	if (currentText.length !== projectedText.length) return message;
	let textIndex = 0;
	const mergedContent = currentContent.map((block) => {
		if (!isRecord(block) || block.type !== "text") return block;
		return Object.assign({}, block, { text: projectedText[textIndex++] });
	});
	return {
		...message,
		content: mergedContent
	};
}
function projectToolResultBranch(params) {
	const messages = params.branch.filter((entry) => entry.type === "message" && entry.message !== void 0).map((entry) => entry.message);
	const keys = getToolResultProjectionKeys(messages, params.projectionState);
	materializeRestoredCacheTtl(messages, keys, params.projectionState);
	let messageIndex = 0;
	return {
		keys,
		branch: params.branch.map((entry) => {
			if (entry.type !== "message" || !entry.message) return entry;
			const key = keys[messageIndex++];
			const frozen = key !== void 0 && params.projectionState.frozen.has(key);
			const projected = key && (!params.frozenOnly || frozen) ? params.projectionState.replacements.get(key) : void 0;
			if (key && params.recordSources && !params.projectionState.sourceHashByKey.has(key)) params.projectionState.sourceHashByKey.set(key, hashToolResultText(getToolResultTextBlocks(entry.message)));
			let message = projected ? mergeProjectedToolResultMessage(entry.message, projected.content, key ? params.projectionState.sourceHashByKey.get(key) : void 0, projected.cacheTtl) : entry.message;
			if (key && projected?.cacheTtl && message !== entry.message) message = Object.assign({}, message, { [TOOL_RESULT_PROJECTION_KEY]: key });
			return {
				...entry,
				message,
				aggregateEligible: params.frozenOnly || !key || !frozen
			};
		})
	};
}
/**
* Restored marker keys become replacements here, at the owner every replay path
* uses, so the pruned bytes are sent whether or not cache-TTL pruning is still on.
*/
function materializeRestoredCacheTtl(messages, keys, state) {
	if (state.restoredCacheTtl.size === 0) return;
	for (const [index, message] of messages.entries()) {
		const key = keys[index];
		if (!key || message.role !== "toolResult" || state.replacements.get(key)?.cacheTtl) continue;
		const baseKey = getToolResultProjectionBaseKey(message);
		const exact = state.restoredCacheTtl.get(key);
		const mark = exact ?? (baseKey ? state.restoredCacheTtl.get(baseKey) : void 0);
		if (!mark) continue;
		if (!exact && baseKey) state.restoredCacheTtl.delete(baseKey);
		const projected = mark.mode === "hard" ? {
			...message,
			content: [{
				type: "text",
				text: mark.placeholder
			}]
		} : softPruneCacheTtlToolResult(message);
		recordToolResultPromptProjection(state, key, projected, mark.mode);
		state.frozen.add(key);
		if (!state.sourceHashByKey.has(key)) state.sourceHashByKey.set(key, hashToolResultText(getToolResultTextBlocks(message)));
	}
	state.restoredCacheTtl.clear();
}
function buildAggregateToolResultReplacements(params) {
	const candidates = params.branch.flatMap(({ entry, textLength }, index) => {
		const message = entry.message;
		return entry.type === "message" && message?.role === "toolResult" ? [{
			entryId: entry.id,
			message,
			spillSourceMessage: params.spillSourceBranch[index]?.message ?? message,
			textLength,
			aggregateEligible: entry.aggregateEligible !== false,
			protectedByTrailingBatch: params.protectedEntryIds?.has(entry.id) ?? false
		}] : [];
	}).filter((item) => item.textLength > 0);
	if (candidates.length < 2) return {
		replacements: [],
		pressureExceeded: false
	};
	const suffixFactory = params.aggregateBudgetChars < candidates.length * estimateStringCharsWithMinimumRawWeight(DEFAULT_SUFFIX(1)) ? COMPACT_RECOVERY_SUFFIX : DEFAULT_SUFFIX;
	const minTruncatedTextChars = estimateStringCharsWithMinimumRawWeight(suffixFactory(1));
	const totalChars = candidates.reduce((sum, item) => sum + item.textLength, 0);
	if (totalChars <= params.aggregateBudgetChars) return {
		replacements: [],
		pressureExceeded: false
	};
	let remainingReduction = totalChars - params.aggregateBudgetChars;
	const replacements = /* @__PURE__ */ new Map();
	const recoveryCandidates = candidates.filter((candidate) => candidate.aggregateEligible && !candidate.protectedByTrailingBatch);
	for (const clear of [false, true]) for (const candidate of recoveryCandidates) {
		if (remainingReduction <= 0) break;
		const baseTextLength = replacements.get(candidate.entryId)?.textLength ?? candidate.textLength;
		if (!clear && baseTextLength <= minTruncatedTextChars) continue;
		const spillMarkers = resolveAggregateElisionMarkers(candidate.spillSourceMessage);
		let message;
		if (clear) {
			const noticeFloor = params.protectedEntryIds ? estimateStringCharsWithMinimumRawWeight(spillMarkers?.compact ?? AGGREGATE_ELISION_MARKER) : 0;
			message = clearToolResultText(candidate.message, Math.max(noticeFloor, baseTextLength - remainingReduction), spillMarkers);
		} else {
			const suffix = spillMarkers?.truncationSuffix ?? suffixFactory;
			const targetChars = Math.max(minTruncatedTextChars, baseTextLength - remainingReduction, estimateStringCharsWithMinimumRawWeight(suffix(1)));
			message = truncateToolResultMessage(candidate.message, targetChars, {
				minKeepChars: RECOVERY_MIN_KEEP_CHARS,
				suffix
			});
		}
		const textLength = message === candidate.message ? candidate.textLength : getToolResultTextBudget(message);
		const actualReduction = Math.max(0, baseTextLength - textLength);
		if (actualReduction <= 0 && (!clear || !spillMarkers)) continue;
		replacements.set(candidate.entryId, {
			entryId: candidate.entryId,
			message,
			textLength
		});
		remainingReduction -= actualReduction;
	}
	return {
		replacements: [...replacements.values()],
		pressureExceeded: true
	};
}
function getTrailingToolResultEntryIds(branch) {
	const ids = /* @__PURE__ */ new Set();
	for (let index = branch.length - 1; index >= 0; index--) {
		const entry = branch[index];
		if (entry?.type === "message" && entry.message?.role === "assistant") break;
		if (entry?.type === "message" && entry.message?.role === "toolResult") ids.add(entry.id);
	}
	return ids;
}
function clearToolResultText(message, maxTextChars, resolvedSpillMarkers) {
	const content = message.content;
	if (!Array.isArray(content)) return message;
	let remainingTextBudget = Math.max(0, Math.floor(maxTextChars));
	const spillMarkers = resolvedSpillMarkers ?? resolveAggregateElisionMarkers(message);
	if (spillMarkers) remainingTextBudget = Math.max(remainingTextBudget, estimateStringCharsWithMinimumRawWeight(spillMarkers.compact));
	return {
		...message,
		content: content.map((block) => {
			if (!isToolResultTextBlock(block)) return block;
			const replacementText = [spillMarkers?.full, spillMarkers?.compact].find((marker) => typeof marker === "string" && estimateStringCharsWithMinimumRawWeight(marker) <= remainingTextBudget) ?? sliceToolResultTextToBudget(AGGREGATE_ELISION_MARKER, remainingTextBudget);
			remainingTextBudget = Math.max(0, remainingTextBudget - estimateStringCharsWithMinimumRawWeight(replacementText));
			return Object.assign({}, block, {
				text: replacementText,
				...typeof block.content === "string" ? { content: replacementText } : {}
			});
		})
	};
}
function applyToolResultReplacementsToBranch(branch, replacements) {
	if (replacements.length === 0) return {
		branch,
		reducedChars: 0
	};
	const replacementsById = new Map(replacements.map((item) => [item.entryId, item]));
	let reducedChars = 0;
	return {
		branch: branch.map((measured) => {
			const { entry, textLength } = measured;
			const replacement = replacementsById.get(entry.id);
			if (!replacement || entry.type !== "message" || !entry.message) return measured;
			reducedChars += Math.max(0, textLength - replacement.textLength);
			return {
				entry: {
					...entry,
					message: replacement.message
				},
				textLength: replacement.textLength
			};
		}),
		reducedChars
	};
}
function buildToolResultReplacementPlan(params) {
	const protectedEntryIds = params.protectTrailingToolResults ? getTrailingToolResultEntryIds(params.branch) : void 0;
	let toolResultCount = 0;
	let totalToolResultChars = 0;
	const measuredBranch = params.branch.map((entry) => {
		const textLength = entry.type === "message" && entry.message ? getToolResultTextBudget(entry.message) : 0;
		if (textLength > 0) {
			toolResultCount += 1;
			totalToolResultChars += textLength;
		}
		return {
			entry,
			textLength
		};
	});
	const oversizedReplacements = measuredBranch.flatMap(({ entry, textLength }) => {
		const message = entry.message;
		if (entry.type !== "message" || message?.role !== "toolResult" || textLength <= params.maxChars) return [];
		const suffix = resolveAggregateElisionMarkers(message)?.truncationSuffix;
		const replacementMessage = truncateToolResultMessage(message, Math.max(params.maxChars, suffix ? estimateStringCharsWithMinimumRawWeight(suffix(1)) : 0), {
			minKeepChars: protectedEntryIds?.has(entry.id) ? MIN_KEEP_CHARS : RECOVERY_MIN_KEEP_CHARS,
			...suffix ? { suffix } : {}
		});
		return [{
			entryId: entry.id,
			message: replacementMessage,
			textLength: replacementMessage === message ? textLength : getToolResultTextBudget(replacementMessage)
		}];
	});
	const oversizedPhase = applyToolResultReplacementsToBranch(measuredBranch, oversizedReplacements);
	const aggregatePlan = buildAggregateToolResultReplacements({
		branch: oversizedPhase.branch,
		spillSourceBranch: params.branch,
		aggregateBudgetChars: params.aggregateBudgetChars,
		protectedEntryIds
	});
	const aggregatePhase = applyToolResultReplacementsToBranch(oversizedPhase.branch, aggregatePlan.replacements);
	return {
		branch: aggregatePhase.branch === measuredBranch ? params.branch : aggregatePhase.branch.map(({ entry }) => entry),
		replacements: [...oversizedReplacements, ...aggregatePlan.replacements].map(({ entryId, message }) => ({
			entryId,
			message
		})),
		oversizedReplacementCount: oversizedReplacements.length,
		aggregateReplacementCount: aggregatePlan.replacements.length,
		aggregatePressureExceeded: aggregatePlan.pressureExceeded,
		oversizedReducibleChars: oversizedPhase.reducedChars,
		aggregateReducibleChars: aggregatePhase.reducedChars,
		toolResultCount,
		totalToolResultChars
	};
}
function buildRecoveryToolResultReplacementPlan(params) {
	const { maxChars, aggregateBudgetChars } = resolveToolResultBudgets(params);
	const plan = buildToolResultReplacementPlan({
		branch: params.projectionState ? projectToolResultBranch({
			branch: params.branch,
			projectionState: params.projectionState,
			frozenOnly: true
		}).branch : params.branch,
		maxChars,
		aggregateBudgetChars,
		protectTrailingToolResults: params.protectTrailingToolResults
	});
	const replacements = params.branch.flatMap((entry, index) => {
		const finalEntry = plan.branch[index];
		if (entry.type !== "message" || !entry.message || !finalEntry?.message || entry.message === finalEntry.message || JSON.stringify(entry.message) === JSON.stringify(finalEntry.message)) return [];
		return [{
			entryId: entry.id,
			message: finalEntry.message
		}];
	});
	return {
		maxChars,
		aggregateBudgetChars,
		plan: {
			...plan,
			replacements
		}
	};
}
function estimateToolResultReductionPotential(params) {
	const { maxChars, aggregateBudgetChars } = resolveToolResultBudgets(params);
	const plan = buildToolResultReplacementPlan({
		branch: buildToolResultPlanningBranch(params.messages),
		maxChars,
		aggregateBudgetChars
	});
	const maxReducibleChars = plan.oversizedReducibleChars + plan.aggregateReducibleChars;
	return {
		maxChars,
		aggregateBudgetChars,
		toolResultCount: plan.toolResultCount,
		totalToolResultChars: plan.totalToolResultChars,
		oversizedCount: plan.oversizedReplacementCount,
		oversizedReducibleChars: plan.oversizedReducibleChars,
		aggregateReducibleChars: plan.aggregateReducibleChars,
		maxReducibleChars
	};
}
async function truncateOversizedToolResultsInSessionManager(params) {
	try {
		const { sessionManager, contextWindowTokens } = params;
		const branch = Array.from(iterateSessionContextEntries(sessionManager.getBranch()), ({ entry }) => entry);
		if (branch.length === 0) return {
			truncated: false,
			truncatedCount: 0,
			reason: "empty session"
		};
		const { maxChars, aggregateBudgetChars, plan } = buildRecoveryToolResultReplacementPlan({
			branch,
			contextWindowTokens,
			maxCharsOverride: params.maxCharsOverride,
			aggregateMaxCharsOverride: params.aggregateMaxCharsOverride,
			protectTrailingToolResults: params.protectTrailingToolResults,
			projectionState: params.projectionState
		});
		if (plan.replacements.length === 0) return {
			truncated: false,
			truncatedCount: 0,
			reason: "no oversized or aggregate tool results"
		};
		const rewriteResult = await rewriteTranscriptEntriesInSessionManager({
			sessionManager,
			replacements: plan.replacements
		});
		if (rewriteResult.changed && params.projectionState) reconcileToolResultPromptProjectionState(sessionManager.buildSessionContext().messages, params.projectionState);
		const target = sessionManager.getSessionTarget() ?? (params.sessionId && params.sessionKey && params.agentId && params.storePath ? {
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		} : void 0);
		if (rewriteResult.changed && (params.sessionFile || target)) emitSessionTranscriptUpdate({
			...params.sessionFile ? { sessionFile: params.sessionFile } : {},
			...target ? { target } : {
				sessionKey: params.sessionKey,
				...params.agentId ? { agentId: params.agentId } : {}
			}
		});
		logToolResultSessionTruncation({
			rewrittenEntries: rewriteResult.rewrittenEntries,
			contextWindowTokens,
			maxChars,
			aggregateBudgetChars,
			oversizedReplacementCount: plan.oversizedReplacementCount,
			aggregateReplacementCount: plan.aggregateReplacementCount,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		return {
			truncated: rewriteResult.changed,
			truncatedCount: rewriteResult.rewrittenEntries,
			reason: rewriteResult.reason
		};
	} catch (err) {
		const errMsg = formatErrorMessage(err);
		log.warn(`[tool-result-truncation] Failed to truncate: ${errMsg}`);
		return {
			truncated: false,
			truncatedCount: 0,
			reason: errMsg
		};
	}
}
function sessionLikelyHasOversizedToolResults(params) {
	const estimate = estimateToolResultReductionPotential(params);
	return estimate.oversizedCount > 0 || estimate.aggregateReducibleChars > 0;
}
//#endregion
export { wrapStreamObjectSettlement as C, wrapStreamObjectEvents as S, shouldPreserveLatestAssistantThinking as _, resolveLiveToolResultAggregateMaxChars as a, wrapAnthropicStreamWithRecovery as b, toolResultWarningDedupe as c, truncateToolResultMessage as d, truncateToolResultText as f, dropThinkingBlocks as g, dropReasoningFromHistory as h, resolveCacheTtlPruningSettings as i, truncateOversizedToolResultsInMessages as l, assessLastAssistantMessage as m, pruneExpiredCacheTtlToolResults as n, restoreCacheTtlToolResultProjections as o, bindToolResultPromptProjectionKeys as p, reconcileToolResultPromptProjectionState as r, sessionLikelyHasOversizedToolResults as s, estimateToolResultReductionPotential as t, truncateOversizedToolResultsInSessionManager as u, stripInvalidThinkingSignatures as v, formatContextLimitTruncationNotice as w, mapAssistantMessageStream as x, stripThinkingBlocksFromMessage as y };
