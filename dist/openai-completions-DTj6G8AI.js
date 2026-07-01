import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { l as calculateCost, n as transformMessages, s as buildBaseOptions, t as sanitizeSurrogates, u as clampThinkingLevel } from "./sanitize-unicode-DcA7E1vi.js";
import { n as getEnvApiKey } from "./env-api-keys-8q9bEA0v.js";
import { n as parseStreamingJson } from "./json-parse-CydVzlvP.js";
import { n as projectOpenAITools, r as reconcileOpenAICompletionsToolChoice, t as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-Ki7_LdG-.js";
import { a as stripSystemPromptCacheBoundary, i as splitSystemPromptCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
import { i as scanFenceSpans } from "./fences-DSvtxlT8.js";
import { t as headersToRecord } from "./headers-CaXpIDsu.js";
import { a as resolveCacheRetention, i as resolveCloudflareBaseUrl, n as hasCopilotVisionInput, r as isCloudflareProvider, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-YQWBLrLa.js";
import OpenAI from "openai";
//#region packages/markdown-core/src/code-spans.ts
/** Creates the carry-forward state used when scanning inline code across chunks. */
function createInlineCodeState() {
	return {
		open: false,
		ticks: 0
	};
}
/** Builds a lookup for fenced and inline code spans while preserving scanner state. */
function buildCodeSpanIndex(text, inlineState, fenceState) {
	const { spans: fenceSpans, state: nextFenceState } = scanFenceSpans(text, fenceState);
	const { spans: inlineSpans, state: nextInlineState } = parseInlineCodeSpans(text, fenceSpans, inlineState ? {
		open: inlineState.open,
		ticks: inlineState.ticks
	} : createInlineCodeState());
	return {
		inlineState: nextInlineState,
		fenceState: nextFenceState,
		isInside: (index) => isInsideFenceSpan(index, fenceSpans) || isInsideInlineSpan(index, inlineSpans)
	};
}
function parseInlineCodeSpans(text, fenceSpans, initialState) {
	const spans = [];
	let open = initialState.open;
	let ticks = initialState.ticks;
	let openStart = open ? 0 : -1;
	let i = 0;
	while (i < text.length) {
		const fence = findFenceSpanAtInclusive(fenceSpans, i);
		if (fence) {
			i = fence.end;
			continue;
		}
		if (text[i] !== "`") {
			i += 1;
			continue;
		}
		const runStart = i;
		let runLength = 0;
		while (i < text.length && text[i] === "`") {
			runLength += 1;
			i += 1;
		}
		if (!open) {
			open = true;
			ticks = runLength;
			openStart = runStart;
			continue;
		}
		if (runLength === ticks) {
			spans.push([openStart, i]);
			open = false;
			ticks = 0;
			openStart = -1;
		}
	}
	if (open) spans.push([openStart, text.length]);
	return {
		spans,
		state: {
			open,
			ticks
		}
	};
}
function findFenceSpanAtInclusive(spans, index) {
	return spans.find((span) => index >= span.start && index < span.end);
}
function isInsideFenceSpan(index, spans) {
	return spans.some((span) => index >= span.start && index < span.end);
}
function isInsideInlineSpan(index, spans) {
	return spans.some(([start, end]) => index >= start && index < end);
}
//#endregion
//#region src/shared/text/reasoning-tag-text-partitioner.ts
const REASONING_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought|reasoning)|antthinking)\b[^<>]*>/gi;
const REASONING_TAG_NAMES = [
	"think",
	"thinking",
	"thought",
	"reasoning",
	"antthinking",
	"antml:think",
	"antml:thinking",
	"antml:thought",
	"antml:reasoning",
	"mm:think",
	"mm:thinking",
	"mm:thought",
	"mm:reasoning"
];
function createReasoningTagTextPartitioner() {
	let buffer = "";
	let reasoningDepth = 0;
	let strictMode = false;
	let emittedVisibleText = false;
	let inlineCodeState = createInlineCodeState();
	let fenceState;
	let hiddenInlineCodeState = createInlineCodeState();
	let hiddenFenceState;
	let recoverableOpenTagText;
	const consume = (final, recoverFullUnclosed) => {
		const output = [];
		const emit = (kind, text) => {
			if (!text) return;
			if (kind === "text" && text.trim().length > 0) emittedVisibleText = true;
			if (kind === "text") {
				const nextCode = buildCodeSpanIndex(text, inlineCodeState, fenceState);
				inlineCodeState = nextCode.inlineState;
				fenceState = nextCode.fenceState;
			} else {
				const nextCode = buildCodeSpanIndex(text, hiddenInlineCodeState, hiddenFenceState);
				hiddenInlineCodeState = nextCode.inlineState;
				hiddenFenceState = nextCode.fenceState;
			}
			const previous = output[output.length - 1];
			if (previous?.kind === kind) {
				previous.text += text;
				return;
			}
			output.push({
				kind,
				text
			});
		};
		while (buffer) {
			const activeInlineCodeState = reasoningDepth === 0 ? inlineCodeState : hiddenInlineCodeState;
			const activeFenceState = reasoningDepth === 0 ? fenceState : hiddenFenceState;
			const codeSpans = buildCodeSpanIndex(buffer, activeInlineCodeState, activeFenceState);
			const hasUnclosedCode = reasoningDepth === 0 && Boolean(codeSpans.inlineState.open || codeSpans.fenceState.open);
			const hasRawReasoning = hasRawReasoningTag(buffer);
			const tag = findNextReasoningTag(buffer, (index) => final && hasUnclosedCode && hasRawReasoning ? false : codeSpans.isInside(index));
			if (!tag) {
				if (final) {
					const recoverAsText = reasoningDepth > 0 && recoverFullUnclosed && !hasRawReasoningCloseTag(buffer);
					const recoveredText = recoverAsText && recoverableOpenTagText ? recoverableOpenTagText + buffer : buffer;
					emit(reasoningDepth > 0 && !recoverAsText ? "thinking" : "text", recoveredText);
					buffer = "";
					reasoningDepth = 0;
					recoverableOpenTagText = void 0;
					return output;
				}
				if (reasoningDepth > 0 && recoverFullUnclosed && (!emittedVisibleText || recoverableOpenTagText)) return output;
				if (hasUnclosedCode && hasRawReasoning) {
					const openCodeIndex = inlineCodeState.open || fenceState?.open ? 0 : findOpenCodeContextStart(buffer);
					if (openCodeIndex !== -1) {
						emit("text", buffer.slice(0, openCodeIndex));
						buffer = buffer.slice(openCodeIndex);
						return output;
					}
				}
				const trailingFenceStart = findTrailingFenceFragmentStart(buffer, activeInlineCodeState, activeFenceState);
				if (trailingFenceStart !== -1) {
					emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, trailingFenceStart));
					buffer = buffer.slice(trailingFenceStart);
					return output;
				}
				const keepFrom = reasoningTagPrefixSuffixIndex(buffer, (index) => codeSpans.isInside(index));
				if (keepFrom === -1) {
					emit(reasoningDepth > 0 ? "thinking" : "text", buffer);
					buffer = "";
					return output;
				}
				if (reasoningDepth === 0 && keepFrom > 0 && buffer.slice(0, keepFrom).trim().length > 0 && isReasoningCloseTagPrefix(buffer.slice(keepFrom))) return output;
				if (keepFrom > 0) {
					emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, keepFrom));
					buffer = buffer.slice(keepFrom);
				}
				return output;
			}
			const beforeTag = buffer.slice(0, tag.index);
			const afterTag = buffer.slice(tag.index + tag.text.length);
			if (tag.isClose && reasoningDepth === 0) {
				if (recoverFullUnclosed && beforeTag.trim().length > 0 && afterTag.trim().length > 0) {
					emit("text", beforeTag + tag.text);
					buffer = afterTag;
					continue;
				}
				if (beforeTag.trim().length > 0 && afterTag.trim().length === 0 && !final) return output;
				if (beforeTag.trim().length === 0 || afterTag.trim().length === 0) emit("text", beforeTag);
				buffer = afterTag;
				continue;
			}
			emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, tag.index));
			buffer = afterTag;
			if (tag.isClose) {
				reasoningDepth = Math.max(0, reasoningDepth - 1);
				if (reasoningDepth === 0) {
					recoverableOpenTagText = void 0;
					hiddenInlineCodeState = createInlineCodeState();
					hiddenFenceState = void 0;
				}
			} else {
				if (reasoningDepth === 0) {
					recoverableOpenTagText = recoverFullUnclosed && emittedVisibleText ? tag.text : void 0;
					hiddenInlineCodeState = createInlineCodeState();
					hiddenFenceState = void 0;
				}
				reasoningDepth += 1;
			}
		}
		return output;
	};
	return {
		markStrict() {
			strictMode = true;
		},
		push(chunk) {
			strictMode = true;
			buffer += chunk;
			return consume(false, false);
		},
		pushVisible(chunk) {
			buffer += chunk;
			return consume(false, true);
		},
		flush() {
			return consume(true, !strictMode);
		},
		hasPending() {
			return buffer.length > 0 || reasoningDepth > 0;
		},
		isInsideReasoning() {
			return reasoningDepth > 0;
		}
	};
}
function hasRawReasoningTag(text) {
	REASONING_TAG_RE.lastIndex = 0;
	return REASONING_TAG_RE.test(text);
}
function hasRawReasoningCloseTag(text) {
	REASONING_TAG_RE.lastIndex = 0;
	for (;;) {
		const match = REASONING_TAG_RE.exec(text);
		if (!match) return false;
		if (match[1] === "/") return true;
	}
}
function findNextReasoningTag(text, isIndexInsideCode) {
	REASONING_TAG_RE.lastIndex = 0;
	for (;;) {
		const match = REASONING_TAG_RE.exec(text);
		if (!match) return null;
		if (!isIndexInsideCode(match.index)) return {
			index: match.index,
			text: match[0],
			isClose: match[1] === "/"
		};
	}
}
function reasoningTagPrefixSuffixIndex(text, isIndexInsideCode) {
	for (let index = text.lastIndexOf("<"); index >= 0;) {
		if (!isIndexInsideCode(index) && isReasoningTagPrefix(text.slice(index))) return index;
		if (index === 0) break;
		index = text.lastIndexOf("<", index - 1);
	}
	return -1;
}
function isReasoningTagPrefix(text) {
	const name = normalizeReasoningTagPrefixName(text);
	return REASONING_TAG_NAMES.some((tagName) => {
		if (tagName.startsWith(name)) return true;
		if (!name.startsWith(tagName)) return false;
		const rest = name.slice(tagName.length);
		return rest.length === 0 || /^[\s/>]/.test(rest);
	});
}
function isReasoningCloseTagPrefix(text) {
	return text.replace(/^<\s*/, "<").replace(/^<\s*\//, "</").replace(/^<\/\s*/, "</").toLowerCase().startsWith("</") && isReasoningTagPrefix(text);
}
function normalizeReasoningTagPrefixName(text) {
	const normalized = text.replace(/^<\s*/, "<").replace(/^<\s*\//, "</").replace(/^<\/\s*/, "</").toLowerCase();
	return (normalized.startsWith("</") ? normalized.slice(2) : normalized.slice(1)).trimStart();
}
function findOpenCodeContextStart(text) {
	const fence = findOpenFenceStart(text);
	const inline = findOpenInlineCodeStart(text);
	if (fence === -1) return inline;
	if (inline === -1) return fence;
	return Math.min(fence, inline);
}
function findOpenInlineCodeStart(text) {
	let openStart = -1;
	let openTicks = 0;
	let index = 0;
	while (index < text.length) {
		if (text[index] !== "`") {
			index += 1;
			continue;
		}
		const runStart = index;
		let runLength = 0;
		while (index < text.length && text[index] === "`") {
			runLength += 1;
			index += 1;
		}
		if (openStart === -1) {
			openStart = runStart;
			openTicks = runLength;
		} else if (runLength === openTicks) {
			openStart = -1;
			openTicks = 0;
		}
	}
	return openStart;
}
function findOpenFenceStart(text) {
	const fenceRe = /(^|\n)(```|~~~)[^\n]*(?:\n|$)/g;
	let open = null;
	for (const match of text.matchAll(fenceRe)) {
		const index = (match.index ?? 0) + match[1].length;
		const marker = match[2] ?? "";
		if (open !== null && open.marker === marker) open = null;
		else if (!open) open = {
			marker,
			index
		};
	}
	return open?.index ?? -1;
}
function findTrailingFenceFragmentStart(text, inlineState, fenceState) {
	if (inlineState.open || fenceState?.open) return -1;
	const lineStart = Math.max(text.lastIndexOf("\n") + 1, 0);
	return text.slice(lineStart).match(/^( {0,3})(`{1,2}|~{1,2})$/) ? lineStart : -1;
}
//#endregion
//#region src/llm/providers/openai-stop-reason.ts
function mapOpenAIStopReason(reason, options) {
	if (reason === null) return { stopReason: "stop" };
	switch (reason) {
		case "stop":
		case "end": return { stopReason: "stop" };
		case "length": return { stopReason: "length" };
		case "function_call":
		case "tool_calls": return { stopReason: "toolUse" };
		case "tool_call":
			if (options?.allowSingularToolCall) return { stopReason: "toolUse" };
			break;
		case "content_filter": return {
			stopReason: "error",
			errorMessage: "Provider finish_reason: content_filter"
		};
		case "network_error": return {
			stopReason: "error",
			errorMessage: "Provider finish_reason: network_error"
		};
	}
	return {
		stopReason: "error",
		errorMessage: `Provider finish_reason: ${reason}`
	};
}
//#endregion
//#region src/llm/providers/openai-completions.ts
/**
* Check if conversation messages contain tool calls or tool results.
* This is needed because Anthropic (via proxy) requires the tools param
* to be present when messages include tool_calls or tool role messages.
*/
function hasToolHistory(messages) {
	for (const msg of messages) {
		if (msg.role === "toolResult") return true;
		if (msg.role === "assistant") {
			if (Array.isArray(msg.content) && msg.content.some((block) => block.type === "toolCall")) return true;
		}
	}
	return false;
}
function isTextContentBlock(block) {
	return block.type === "text";
}
function isThinkingContentBlock(block) {
	return block.type === "thinking";
}
function isToolCallBlock(block) {
	return block.type === "toolCall";
}
function isImageContentBlock(block) {
	return block.type === "image";
}
const streamOpenAICompletions = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const output = {
			role: "assistant",
			content: [],
			api: model.api,
			provider: model.provider,
			model: model.id,
			usage: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				totalTokens: 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			},
			stopReason: "stop",
			timestamp: Date.now()
		};
		try {
			const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
			const compat = getCompat(model);
			const cacheRetention = resolveCacheRetention(options?.cacheRetention);
			const cacheSessionId = cacheRetention === "none" ? void 0 : options?.sessionId;
			const client = createClient(model, context, apiKey, options?.headers, cacheSessionId, compat);
			let params = buildParams(model, context, options, compat, cacheRetention);
			const nextParams = await options?.onPayload?.(params, model);
			if (nextParams !== void 0) params = nextParams;
			const requestOptions = {
				...options?.signal ? { signal: options.signal } : {},
				...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
				...options?.maxRetries !== void 0 ? { maxRetries: options.maxRetries } : {}
			};
			const { data: openaiStream, response } = await client.chat.completions.create(params, requestOptions).withResponse();
			await options?.onResponse?.({
				status: response.status,
				headers: headersToRecord(response.headers)
			}, model);
			stream.push({
				type: "start",
				partial: output
			});
			let textBlock = null;
			let thinkingBlock = null;
			let hasFinishReason = false;
			const toolCallBlocksByIndex = /* @__PURE__ */ new Map();
			const toolCallBlocksById = /* @__PURE__ */ new Map();
			const toolCallBlocksByFirstId = /* @__PURE__ */ new Map();
			const blocks = output.content;
			const finishedBlocks = /* @__PURE__ */ new Set();
			const contentIndices = /* @__PURE__ */ new WeakMap();
			const appendBlock = (block) => {
				contentIndices.set(block, blocks.length);
				blocks.push(block);
			};
			const getContentIndex = (block) => contentIndices.get(block) ?? -1;
			const rememberFirstToolCallById = (id, block) => {
				if (!toolCallBlocksByFirstId.has(id)) toolCallBlocksByFirstId.set(id, block);
			};
			const finishBlock = (block) => {
				const contentIndex = getContentIndex(block);
				if (contentIndex === -1 || finishedBlocks.has(block)) return;
				finishedBlocks.add(block);
				if (block.type === "text") stream.push({
					type: "text_end",
					contentIndex,
					content: block.text,
					partial: output
				});
				else if (block.type === "thinking") stream.push({
					type: "thinking_end",
					contentIndex,
					content: block.thinking,
					partial: output
				});
				else if (block.type === "toolCall") {
					block.arguments = parseStreamingJson(block.partialArgs);
					delete block.partialArgs;
					delete block.streamIndex;
					stream.push({
						type: "toolcall_end",
						contentIndex,
						toolCall: block,
						partial: output
					});
				}
			};
			const ensureTextBlock = () => {
				if (!textBlock) {
					textBlock = {
						type: "text",
						text: ""
					};
					appendBlock(textBlock);
					stream.push({
						type: "text_start",
						contentIndex: getContentIndex(textBlock),
						partial: output
					});
				}
				return textBlock;
			};
			const ensureThinkingBlock = (thinkingSignature) => {
				if (!thinkingBlock) {
					thinkingBlock = {
						type: "thinking",
						thinking: "",
						thinkingSignature
					};
					appendBlock(thinkingBlock);
					stream.push({
						type: "thinking_start",
						contentIndex: getContentIndex(thinkingBlock),
						partial: output
					});
				}
				return thinkingBlock;
			};
			const sealNativeReasoningBeforeText = () => {
				if (thinkingBlock && !reasoningTagTextPartitioner.isInsideReasoning()) {
					finishBlock(thinkingBlock);
					thinkingBlock = null;
				}
			};
			const appendTextDelta = (delta) => {
				sealNativeReasoningBeforeText();
				const block = ensureTextBlock();
				block.text += delta;
				stream.push({
					type: "text_delta",
					contentIndex: getContentIndex(block),
					delta,
					partial: output
				});
			};
			const appendThinkingDelta = (thinkingSignature, delta) => {
				const block = ensureThinkingBlock(thinkingSignature);
				block.thinking += delta;
				stream.push({
					type: "thinking_delta",
					contentIndex: getContentIndex(block),
					delta,
					partial: output
				});
			};
			const ensureToolCallBlock = (toolCall) => {
				const streamIndex = typeof toolCall.index === "number" ? toolCall.index : void 0;
				let block = streamIndex !== void 0 ? toolCallBlocksByIndex.get(streamIndex) : void 0;
				if (!block && toolCall.id) block = toolCallBlocksById.get(toolCall.id);
				if (!block) {
					block = {
						type: "toolCall",
						id: toolCall.id || "",
						name: toolCall.function?.name || "",
						arguments: {},
						partialArgs: "",
						streamIndex
					};
					if (streamIndex !== void 0) toolCallBlocksByIndex.set(streamIndex, block);
					if (toolCall.id) {
						toolCallBlocksById.set(toolCall.id, block);
						rememberFirstToolCallById(toolCall.id, block);
					}
					appendBlock(block);
					stream.push({
						type: "toolcall_start",
						contentIndex: getContentIndex(block),
						partial: output
					});
				}
				if (streamIndex !== void 0 && block.streamIndex === void 0) {
					block.streamIndex = streamIndex;
					toolCallBlocksByIndex.set(streamIndex, block);
				}
				if (toolCall.id) toolCallBlocksById.set(toolCall.id, block);
				return block;
			};
			const reasoningTagTextPartitioner = createReasoningTagTextPartitioner();
			const appendPartitionedContent = (text, hasMirroredReasoning) => {
				const routedDeltas = hasMirroredReasoning ? reasoningTagTextPartitioner.push(text) : reasoningTagTextPartitioner.pushVisible(text);
				for (const delta of routedDeltas) if (delta.kind === "text") appendTextDelta(delta.text);
			};
			const flushPartitionedContent = () => {
				for (const delta of reasoningTagTextPartitioner.flush()) if (delta.kind === "text") appendTextDelta(delta.text);
			};
			for await (const chunk of openaiStream) {
				if (!chunk || typeof chunk !== "object") continue;
				output.responseId ||= chunk.id;
				if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) output.responseModel ||= chunk.model;
				if (chunk.usage) output.usage = parseChunkUsage(chunk.usage, model);
				const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
				if (!choice) continue;
				const choiceUsage = choice.usage;
				if (!chunk.usage && choiceUsage) output.usage = parseChunkUsage(choiceUsage, model);
				if (choice.finish_reason) {
					const finishReasonResult = mapOpenAIStopReason(choice.finish_reason);
					output.stopReason = finishReasonResult.stopReason;
					if (finishReasonResult.errorMessage) output.errorMessage = finishReasonResult.errorMessage;
					hasFinishReason = true;
				}
				if (choice.delta) {
					const reasoningFields = [
						"reasoning_content",
						"reasoning",
						"reasoning_text"
					];
					const deltaFields = choice.delta;
					const shouldEmitReasoning = Boolean(model.reasoning && options?.reasoningEffort);
					let foundReasoningField = null;
					for (const field of reasoningFields) {
						const value = deltaFields[field];
						if (typeof value === "string" && value.length > 0) {
							foundReasoningField = field;
							break;
						}
					}
					if (foundReasoningField) reasoningTagTextPartitioner.markStrict();
					if (shouldEmitReasoning && foundReasoningField) {
						const delta = deltaFields[foundReasoningField];
						if (typeof delta === "string" && delta.length > 0) appendThinkingDelta(model.provider === "opencode-go" && foundReasoningField === "reasoning" ? "reasoning_content" : foundReasoningField, delta);
					}
					if (choice.delta.content !== null && choice.delta.content !== void 0 && choice.delta.content.length > 0) appendPartitionedContent(choice.delta.content, Boolean(foundReasoningField));
					if (choice?.delta?.tool_calls) {
						flushPartitionedContent();
						sealNativeReasoningBeforeText();
						for (const toolCall of choice.delta.tool_calls) {
							const block = ensureToolCallBlock(toolCall);
							if (!block.id && toolCall.id) {
								block.id = toolCall.id;
								toolCallBlocksById.set(toolCall.id, block);
								rememberFirstToolCallById(toolCall.id, block);
							}
							if (!block.name && toolCall.function?.name) block.name = toolCall.function.name;
							let delta = "";
							if (toolCall.function?.arguments) {
								delta = toolCall.function.arguments;
								block.partialArgs = (block.partialArgs ?? "") + toolCall.function.arguments;
								block.arguments = parseStreamingJson(block.partialArgs);
							}
							stream.push({
								type: "toolcall_delta",
								contentIndex: getContentIndex(block),
								delta,
								partial: output
							});
						}
					}
					const reasoningDetails = choice.delta.reasoning_details;
					if (reasoningDetails && Array.isArray(reasoningDetails)) {
						for (const detail of reasoningDetails) if (detail.type === "reasoning.encrypted" && detail.id && detail.data) {
							const matchingToolCall = toolCallBlocksByFirstId.get(detail.id);
							if (matchingToolCall) matchingToolCall.thoughtSignature = JSON.stringify(detail);
						}
					}
				}
			}
			flushPartitionedContent();
			for (const block of blocks) finishBlock(block);
			if (options?.signal?.aborted) throw new Error("Request was aborted");
			if (output.stopReason === "aborted") throw new Error("Request was aborted");
			if (output.stopReason === "error") throw new Error(output.errorMessage || "Provider returned an error stop reason");
			if (!hasFinishReason) throw new Error("Stream ended without finish_reason");
			const hasToolCalls = output.content.some((block) => block.type === "toolCall");
			const hasVisibleText = output.content.some((block) => block.type === "text" && block.text.trim().length > 0);
			if (output.stopReason === "toolUse" && !hasToolCalls) output.stopReason = "stop";
			if (output.stopReason === "stop" && hasToolCalls && !hasVisibleText) output.stopReason = "toolUse";
			if (hasToolCalls && output.stopReason !== "toolUse") output.content = output.content.filter((block) => block.type !== "toolCall");
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			for (const block of output.content) {
				delete block.index;
				delete block.partialArgs;
				delete block.streamIndex;
			}
			output.stopReason = options?.signal?.aborted ? "aborted" : "error";
			output.errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			const rawMetadata = error?.error?.metadata?.raw;
			if (rawMetadata) output.errorMessage += `\n${rawMetadata}`;
			stream.push({
				type: "error",
				reason: output.stopReason,
				error: output
			});
			stream.end();
		}
	})();
	return stream;
};
const streamSimpleOpenAICompletions = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
	const reasoningEffort = clampedReasoning === "off" ? void 0 : clampedReasoning === "max" ? "xhigh" : clampedReasoning;
	const toolChoice = options?.toolChoice;
	return streamOpenAICompletions(model, context, {
		...base,
		reasoningEffort,
		toolChoice
	});
};
function createClient(model, context, apiKey, optionsHeaders, sessionId, compat = getCompat(model)) {
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const headers = { ...model.headers };
	if (model.provider === "github-copilot") {
		const hasImages = hasCopilotVisionInput(context.messages);
		const copilotHeaders = buildCopilotDynamicHeaders({
			messages: context.messages,
			hasImages
		});
		Object.assign(headers, copilotHeaders);
	}
	if (sessionId && compat.sendSessionAffinityHeaders) {
		headers.session_id = sessionId;
		headers["x-client-request-id"] = sessionId;
		headers["x-session-affinity"] = sessionId;
	}
	if (optionsHeaders) Object.assign(headers, optionsHeaders);
	const defaultHeaders = model.provider === "cloudflare-ai-gateway" ? {
		...headers,
		Authorization: headers.Authorization ?? null,
		"cf-aig-authorization": `Bearer ${apiKey}`
	} : headers;
	return new OpenAI({
		apiKey,
		baseURL: isCloudflareProvider(model.provider) ? resolveCloudflareBaseUrl(model) : model.baseUrl,
		dangerouslyAllowBrowser: true,
		defaultHeaders
	});
}
function buildParams(model, context, options, compat = getCompat(model), cacheRetention = resolveCacheRetention(options?.cacheRetention)) {
	const cacheControl = getCompatCacheControl(compat, cacheRetention);
	const messages = convertMessages(model, context, compat, { preserveSystemPromptCacheBoundary: cacheControl !== void 0 });
	const supportsPromptCacheKey = model.baseUrl.includes("api.openai.com") || compat.supportsPromptCacheKey;
	const promptCacheKey = supportsPromptCacheKey && cacheRetention !== "none" ? clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId) : void 0;
	const params = {
		model: model.id,
		messages,
		stream: true,
		prompt_cache_key: promptCacheKey,
		prompt_cache_retention: supportsPromptCacheKey && cacheRetention === "long" && compat.supportsLongCacheRetention ? "24h" : void 0
	};
	if (compat.supportsUsageInStreaming) params.stream_options = { include_usage: true };
	if (compat.supportsStore) params.store = false;
	if (options?.maxTokens) {
		const maxTokens = clampOpenAICompletionsMaxTokens(model, options.maxTokens);
		if (compat.maxTokensField === "max_tokens") params.max_tokens = maxTokens;
		else params.max_completion_tokens = maxTokens;
	}
	if (options?.temperature !== void 0) params.temperature = options.temperature;
	if (options?.stop !== void 0 && options.stop.length > 0) params.stop = options.stop;
	let toolProjection;
	if (context.tools) {
		const converted = convertTools(context.tools, compat);
		toolProjection = converted.projection;
		if (converted.tools.length > 0) params.tools = converted.tools;
		else if (hasToolHistory(context.messages)) params.tools = [];
		if (compat.zaiToolStream && converted.tools.length > 0) params.tool_stream = true;
	} else if (hasToolHistory(context.messages)) params.tools = [];
	if (cacheControl) applyAnthropicCacheControl(messages, params.tools, cacheControl);
	if (options?.toolChoice) {
		const toolChoice = reconcileOpenAICompletionsToolChoice(options.toolChoice, toolProjection ?? projectOpenAITools([]));
		if (toolChoice !== void 0) params.tool_choice = toolChoice;
	}
	if (compat.thinkingFormat === "zai" && model.reasoning) params.enable_thinking = Boolean(options?.reasoningEffort);
	else if (compat.thinkingFormat === "qwen" && model.reasoning) params.enable_thinking = Boolean(options?.reasoningEffort);
	else if (compat.thinkingFormat === "qwen-chat-template" && model.reasoning) params.chat_template_kwargs = {
		enable_thinking: Boolean(options?.reasoningEffort),
		preserve_thinking: true
	};
	else if (compat.thinkingFormat === "deepseek" && model.reasoning) {
		params.thinking = { type: options?.reasoningEffort ? "enabled" : "disabled" };
		if (options?.reasoningEffort) params.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
	} else if (compat.thinkingFormat === "openrouter" && model.reasoning) {
		const openRouterParams = params;
		if (options?.reasoningEffort) openRouterParams.reasoning = { effort: model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort };
		else if (model.thinkingLevelMap?.off !== null) openRouterParams.reasoning = { effort: model.thinkingLevelMap?.off ?? "none" };
	} else if (compat.thinkingFormat === "together" && model.reasoning) {
		const togetherParams = params;
		togetherParams.reasoning = { enabled: Boolean(options?.reasoningEffort) };
		if (options?.reasoningEffort && compat.supportsReasoningEffort) togetherParams.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
	} else if (options?.reasoningEffort && model.reasoning && compat.supportsReasoningEffort) params.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
	else if (!options?.reasoningEffort && model.reasoning && compat.supportsReasoningEffort) {
		const offValue = model.thinkingLevelMap?.off;
		if (typeof offValue === "string") params.reasoning_effort = offValue;
	}
	if (model.baseUrl.includes("openrouter.ai") && model.compat?.openRouterRouting) params.provider = model.compat.openRouterRouting;
	if (model.baseUrl.includes("ai-gateway.vercel.sh") && model.compat?.vercelGatewayRouting) {
		const routing = model.compat.vercelGatewayRouting;
		if (routing.only || routing.order) {
			const gatewayOptions = {};
			if (routing.only) gatewayOptions.only = routing.only;
			if (routing.order) gatewayOptions.order = routing.order;
			params.providerOptions = { gateway: gatewayOptions };
		}
	}
	return params;
}
function clampOpenAICompletionsMaxTokens(model, requestedMaxTokens) {
	const modelMaxTokens = typeof model.maxTokens === "number" && Number.isFinite(model.maxTokens) && model.maxTokens > 0 ? Math.floor(model.maxTokens) : void 0;
	return modelMaxTokens === void 0 || requestedMaxTokens <= modelMaxTokens ? requestedMaxTokens : modelMaxTokens;
}
function getCompatCacheControl(compat, cacheRetention) {
	if (compat.cacheControlFormat !== "anthropic" || cacheRetention === "none") return;
	const ttl = cacheRetention === "long" && compat.supportsLongCacheRetention ? "1h" : void 0;
	return {
		type: "ephemeral",
		...ttl ? { ttl } : {}
	};
}
function applyAnthropicCacheControl(messages, tools, cacheControl) {
	addCacheControlToSystemPrompt(messages, cacheControl);
	addCacheControlToLastTool(tools, cacheControl);
	addCacheControlToLastConversationMessage(messages, cacheControl);
}
function addCacheControlToSystemPrompt(messages, cacheControl) {
	for (const message of messages) if (message.role === "system" || message.role === "developer") {
		addCacheControlToInstructionMessage(message, cacheControl);
		return;
	}
}
function addCacheControlToLastConversationMessage(messages, cacheControl) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (message.role === "user" || message.role === "assistant") {
			if (addCacheControlToMessage(message, cacheControl)) return;
		}
	}
}
function addCacheControlToLastTool(tools, cacheControl) {
	if (!tools || tools.length === 0) return;
	const lastTool = tools[tools.length - 1];
	lastTool.cache_control = cacheControl;
}
function addCacheControlToInstructionMessage(message, cacheControl) {
	return addCacheControlToTextContent(message, cacheControl);
}
function addCacheControlToMessage(message, cacheControl) {
	if (message.role === "user" || message.role === "assistant") return addCacheControlToTextContent(message, cacheControl);
	return false;
}
function addCacheControlToTextContent(message, cacheControl) {
	const content = message.content;
	if (typeof content === "string") {
		if (content.length === 0) return false;
		message.content = buildCacheControlledTextParts(content, cacheControl);
		return true;
	}
	if (!Array.isArray(content)) return false;
	for (let i = content.length - 1; i >= 0; i--) {
		const part = content[i];
		if (part?.type === "text") {
			const text = part.text;
			content.splice(i, 1, ...buildCacheControlledTextParts(text, cacheControl));
			return true;
		}
	}
	return false;
}
function buildCacheControlledTextParts(text, cacheControl) {
	const split = splitSystemPromptCacheBoundary(text);
	if (!split) return [{
		type: "text",
		text,
		cache_control: cacheControl
	}];
	const parts = [];
	if (split.stablePrefix) parts.push({
		type: "text",
		text: split.stablePrefix,
		cache_control: cacheControl
	});
	if (split.dynamicSuffix) parts.push({
		type: "text",
		text: split.dynamicSuffix
	});
	return parts.length > 0 ? parts : [{
		type: "text",
		text: ""
	}];
}
function convertMessages(model, context, compat, options = {}) {
	const params = [];
	const normalizeToolCallId = (id) => {
		if (id.includes("|")) {
			const [callId] = id.split("|");
			return callId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
		}
		if (model.provider === "openai") return id.length > 40 ? id.slice(0, 40) : id;
		return id;
	};
	const transformedMessages = transformMessages(context.messages, model, (id) => normalizeToolCallId(id));
	if (context.systemPrompt) {
		const role = model.reasoning && compat.supportsDeveloperRole ? "developer" : "system";
		const systemPrompt = options.preserveSystemPromptCacheBoundary ? context.systemPrompt : stripSystemPromptCacheBoundary(context.systemPrompt);
		params.push({
			role,
			content: sanitizeSurrogates(systemPrompt)
		});
	}
	let lastRole = null;
	for (let i = 0; i < transformedMessages.length; i++) {
		const msg = transformedMessages[i];
		if (compat.requiresAssistantAfterToolResult && lastRole === "toolResult" && msg.role === "user") params.push({
			role: "assistant",
			content: "I have processed the tool results."
		});
		if (msg.role === "user") if (typeof msg.content === "string") params.push({
			role: "user",
			content: sanitizeSurrogates(msg.content)
		});
		else {
			const content = msg.content.map((item) => {
				if (item.type === "text") return {
					type: "text",
					text: sanitizeSurrogates(item.text)
				};
				return {
					type: "image_url",
					image_url: { url: `data:${item.mimeType};base64,${item.data}` }
				};
			});
			if (content.length === 0) continue;
			params.push({
				role: "user",
				content
			});
		}
		else if (msg.role === "assistant") {
			const assistantMsg = {
				role: "assistant",
				content: compat.requiresAssistantAfterToolResult ? "" : null
			};
			const assistantTextParts = msg.content.filter(isTextContentBlock).filter((block) => block.text.trim().length > 0).map((block) => ({
				type: "text",
				text: sanitizeSurrogates(block.text)
			}));
			const assistantText = assistantTextParts.map((part) => part.text).join("");
			const nonEmptyThinkingBlocks = msg.content.filter(isThinkingContentBlock).filter((block) => block.thinking.trim().length > 0);
			if (nonEmptyThinkingBlocks.length > 0) if (compat.requiresThinkingAsText) assistantMsg.content = [{
				type: "text",
				text: nonEmptyThinkingBlocks.map((block) => sanitizeSurrogates(block.thinking)).join("\n\n")
			}, ...assistantTextParts];
			else {
				if (assistantText.length > 0) assistantMsg.content = assistantText;
				let signature = nonEmptyThinkingBlocks[0].thinkingSignature;
				if (model.provider === "opencode-go" && signature === "reasoning") signature = "reasoning_content";
				if (signature && signature.length > 0) assistantMsg[signature] = nonEmptyThinkingBlocks.map((block) => block.thinking).join("\n");
			}
			else if (assistantText.length > 0) assistantMsg.content = assistantText;
			const toolCalls = msg.content.filter(isToolCallBlock);
			if (toolCalls.length > 0) {
				assistantMsg.tool_calls = toolCalls.map((tc) => ({
					id: tc.id,
					type: "function",
					function: {
						name: tc.name,
						arguments: JSON.stringify(tc.arguments)
					}
				}));
				const reasoningDetails = toolCalls.filter((tc) => tc.thoughtSignature).map((tc) => {
					try {
						return JSON.parse(tc.thoughtSignature);
					} catch {
						return null;
					}
				}).filter(Boolean);
				if (reasoningDetails.length > 0) assistantMsg.reasoning_details = reasoningDetails;
			}
			if (compat.requiresReasoningContentOnAssistantMessages && model.reasoning && assistantMsg.reasoning_content === void 0) assistantMsg.reasoning_content = "";
			const content = assistantMsg.content;
			if (!(content !== null && content !== void 0 && (typeof content === "string" ? content.length > 0 : content.length > 0)) && !assistantMsg.tool_calls) continue;
			params.push(assistantMsg);
		} else if (msg.role === "toolResult") {
			const imageBlocks = [];
			let j = i;
			for (; j < transformedMessages.length && transformedMessages[j].role === "toolResult"; j++) {
				const toolMsg = transformedMessages[j];
				const textResult = toolMsg.content.filter(isTextContentBlock).map((block) => block.text).join("\n");
				const hasImages = toolMsg.content.some((c) => c.type === "image");
				const toolResultMsg = {
					role: "tool",
					content: sanitizeSurrogates(textResult.length > 0 ? textResult : "(see attached image)"),
					tool_call_id: toolMsg.toolCallId
				};
				if (compat.requiresToolResultName && toolMsg.toolName) toolResultMsg.name = toolMsg.toolName;
				params.push(toolResultMsg);
				if (hasImages && model.input.includes("image")) {
					for (const block of toolMsg.content) if (isImageContentBlock(block)) imageBlocks.push({
						type: "image_url",
						image_url: { url: `data:${block.mimeType};base64,${block.data}` }
					});
				}
			}
			i = j - 1;
			if (imageBlocks.length > 0) {
				if (compat.requiresAssistantAfterToolResult) params.push({
					role: "assistant",
					content: "I have processed the tool results."
				});
				params.push({
					role: "user",
					content: [{
						type: "text",
						text: "Attached image(s) from tool result:"
					}, ...imageBlocks]
				});
				lastRole = "user";
			} else lastRole = "toolResult";
			continue;
		}
		lastRole = msg.role;
	}
	return params;
}
function convertTools(tools, compat) {
	const projection = projectOpenAITools(tools);
	return {
		projection,
		tools: projection.tools.map((tool) => ({
			type: "function",
			function: {
				name: tool.name,
				description: tool.description,
				parameters: tool.parameters,
				...compat.supportsStrictMode && { strict: false }
			}
		}))
	};
}
function parseChunkUsage(rawUsage, model) {
	const promptTokens = rawUsage.prompt_tokens || 0;
	const cacheReadTokens = rawUsage.prompt_tokens_details?.cached_tokens ?? rawUsage.prompt_cache_hit_tokens ?? 0;
	const cacheWriteTokens = rawUsage.prompt_tokens_details?.cache_write_tokens || 0;
	const input = Math.max(0, promptTokens - cacheReadTokens - cacheWriteTokens);
	const outputTokens = rawUsage.completion_tokens || 0;
	const usage = {
		input,
		output: outputTokens,
		cacheRead: cacheReadTokens,
		cacheWrite: cacheWriteTokens,
		totalTokens: input + outputTokens + cacheReadTokens + cacheWriteTokens,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
	calculateCost(model, usage);
	return usage;
}
/**
* Detect compatibility settings from provider and baseUrl for known providers.
* Provider takes precedence over URL-based detection since it's explicitly configured.
* Returns a fully resolved OpenAICompletionsCompat object with all fields set.
*/
function detectCompat(model) {
	const provider = model.provider;
	const baseUrl = model.baseUrl;
	const isZai = provider === "zai" || baseUrl.includes("api.z.ai");
	const isTogether = provider === "together" || baseUrl.includes("api.together.ai") || baseUrl.includes("api.together.xyz");
	const isMoonshot = provider === "moonshotai" || provider === "moonshotai-cn" || baseUrl.includes("api.moonshot.");
	const isCloudflareWorkersAI = provider === "cloudflare-workers-ai" || baseUrl.includes("api.cloudflare.com");
	const isCloudflareAiGateway = provider === "cloudflare-ai-gateway" || baseUrl.includes("gateway.ai.cloudflare.com");
	const isNonStandard = provider === "cerebras" || baseUrl.includes("cerebras.ai") || provider === "xai" || baseUrl.includes("api.x.ai") || isTogether || baseUrl.includes("chutes.ai") || baseUrl.includes("deepseek.com") || isZai || isMoonshot || provider === "opencode" || baseUrl.includes("opencode.ai") || isCloudflareWorkersAI || isCloudflareAiGateway;
	const useMaxTokens = baseUrl.includes("chutes.ai") || isMoonshot || isCloudflareAiGateway || isTogether;
	const isGrok = provider === "xai" || baseUrl.includes("api.x.ai");
	const isDeepSeek = provider === "deepseek" || baseUrl.includes("deepseek.com");
	const isXiaomi = provider === "xiaomi" || baseUrl.includes("xiaomimimo.com");
	const cacheControlFormat = provider === "openrouter" && model.id.startsWith("anthropic/") ? "anthropic" : void 0;
	return {
		supportsStore: !isNonStandard,
		supportsDeveloperRole: !isNonStandard,
		supportsReasoningEffort: !isGrok && !isZai && !isMoonshot && !isTogether && !isCloudflareAiGateway,
		supportsUsageInStreaming: true,
		maxTokensField: useMaxTokens ? "max_tokens" : "max_completion_tokens",
		requiresToolResultName: false,
		requiresAssistantAfterToolResult: false,
		requiresThinkingAsText: false,
		requiresReasoningContentOnAssistantMessages: isDeepSeek || isXiaomi,
		thinkingFormat: isDeepSeek ? "deepseek" : isXiaomi ? "deepseek" : isZai ? "zai" : isTogether ? "together" : provider === "openrouter" || baseUrl.includes("openrouter.ai") ? "openrouter" : "openai",
		openRouterRouting: {},
		vercelGatewayRouting: {},
		zaiToolStream: false,
		supportsStrictMode: !isMoonshot && !isTogether && !isCloudflareAiGateway,
		cacheControlFormat,
		sendSessionAffinityHeaders: false,
		supportsPromptCacheKey: false,
		supportsLongCacheRetention: !(isTogether || isCloudflareWorkersAI || isCloudflareAiGateway)
	};
}
/**
* Get resolved compatibility settings for a model.
* Uses explicit model.compat if provided, otherwise auto-detects from provider/URL.
*/
function getCompat(model) {
	const detected = detectCompat(model);
	if (!model.compat) return detected;
	return {
		supportsStore: model.compat.supportsStore ?? detected.supportsStore,
		supportsDeveloperRole: model.compat.supportsDeveloperRole ?? detected.supportsDeveloperRole,
		supportsReasoningEffort: model.compat.supportsReasoningEffort ?? detected.supportsReasoningEffort,
		supportsUsageInStreaming: model.compat.supportsUsageInStreaming ?? detected.supportsUsageInStreaming,
		maxTokensField: model.compat.maxTokensField ?? detected.maxTokensField,
		requiresToolResultName: model.compat.requiresToolResultName ?? detected.requiresToolResultName,
		requiresAssistantAfterToolResult: model.compat.requiresAssistantAfterToolResult ?? detected.requiresAssistantAfterToolResult,
		requiresThinkingAsText: model.compat.requiresThinkingAsText ?? detected.requiresThinkingAsText,
		requiresReasoningContentOnAssistantMessages: model.compat.requiresReasoningContentOnAssistantMessages ?? detected.requiresReasoningContentOnAssistantMessages,
		thinkingFormat: model.compat.thinkingFormat ?? detected.thinkingFormat,
		openRouterRouting: model.compat.openRouterRouting ?? {},
		vercelGatewayRouting: model.compat.vercelGatewayRouting ?? detected.vercelGatewayRouting,
		zaiToolStream: model.compat.zaiToolStream ?? detected.zaiToolStream,
		supportsStrictMode: model.compat.supportsStrictMode ?? detected.supportsStrictMode,
		cacheControlFormat: model.compat.cacheControlFormat ?? detected.cacheControlFormat,
		sendSessionAffinityHeaders: model.compat.sendSessionAffinityHeaders ?? detected.sendSessionAffinityHeaders,
		supportsPromptCacheKey: model.compat.supportsPromptCacheKey ?? detected.supportsPromptCacheKey,
		supportsLongCacheRetention: model.compat.supportsLongCacheRetention ?? detected.supportsLongCacheRetention
	};
}
//#endregion
export { createReasoningTagTextPartitioner as a, mapOpenAIStopReason as i, streamOpenAICompletions as n, buildCodeSpanIndex as o, streamSimpleOpenAICompletions as r, createInlineCodeState as s, convertMessages as t };
