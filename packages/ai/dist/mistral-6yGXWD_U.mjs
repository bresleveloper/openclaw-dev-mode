import { n as getEnvApiKey } from "./env-api-keys-DrgeBuva.mjs";
import { r as appendAssistantThinking, t as AssistantMessageEventStream } from "./event-stream-D8PARQfL.mjs";
import { M as calculateCost, N as clampThinkingLevel, _ as isImageWithMediaPayload, d as describeToolResultMediaPlaceholder, h as formatToolResultText, m as extractToolResultText, n as getAiTransportHost, v as sanitizeSurrogates } from "./host-yTvBrYM2.mjs";
import { m as stripSystemPromptCacheBoundary, n as buildBaseOptions, r as clampMaxTokensToModel, v as sortPromptCacheToolsByName } from "./simple-options-np1XPuhm.mjs";
import { E as parseStreamingJson, O as shortHash, c as finalizeTerminalToolCallArguments, n as assignTransportErrorDetails, p as notifyProviderHttpResponse, v as transportAbortError, w as createToolArgumentPreviewSchedule } from "./transport-stream-shared-B5RioB_Q.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-BjtkplhG.mjs";
import { t as createAssistantOutput } from "./assistant-output-DM1JBNs1.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-BTocjCRs.mjs";
import { t as mapOpenAIStopReason } from "./openai-stop-reason-Drnn_6Qj.mjs";
import { t as createSseByteGuard } from "./streaming-byte-guard-CC-HMn_u.mjs";
import { randomUUID } from "node:crypto";
import { HTTPClient } from "@mistralai/mistralai/lib/http";
import { ReasoningEffort$inboundSchema } from "@mistralai/mistralai/models/components/reasoningeffort.js";
import { Chat } from "@mistralai/mistralai/sdk/chat";
//#region packages/ai/src/providers/mistral.ts
const MISTRAL_TOOL_CALL_ID_LENGTH = 9;
const MISTRAL_STREAM_BODY_MAX_BYTES = 16777216;
/**
* Builds a `Fetcher` that wraps the default `fetch` with a 16 MiB byte cap
* on streamed response bodies. The wrapped `Response.body` exposes a
* `ReadableStream` whose chunks flow through `createSseByteGuard`, so the
* SDK's internal SSE parser (`EventStream` in
* `@mistralai/mistralai/lib/event-streams.ts`) reads exactly as it would on
* an unbounded body — but bounded.
*
* Bodyless responses (no `body` or no `getReader`) are returned unchanged so
* the SDK's error-path `res.arrayBuffer()` call still works.
*/
function createBoundedMistralFetcher(maxBytes = MISTRAL_STREAM_BODY_MAX_BYTES, upstreamFetch = fetch) {
	return async (input, init) => {
		const response = init == null ? await upstreamFetch(input) : await upstreamFetch(input, init);
		if (!response.body || typeof response.body.getReader !== "function") return response;
		const reader = response.body.getReader();
		const guard = createSseByteGuard(reader, {
			maxBytes,
			onOverflow: ({ size, maxBytes: cap }) => /* @__PURE__ */ new Error(`mistral: stream body exceeds ${cap} bytes (got ${size})`)
		});
		const guardedStream = new ReadableStream({
			async pull(controller) {
				const { done, value } = await guard.read();
				if (done) {
					controller.close();
					return;
				}
				controller.enqueue(value);
			},
			async cancel(reason) {
				await guard.cancel(reason);
			}
		});
		return new Response(guardedStream, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	};
}
/**
* Stream responses from Mistral using `chat.stream`.
*/
const streamMistral = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const output = createAssistantOutput(model);
		try {
			const apiKey = options?.apiKey || getEnvApiKey(model.provider);
			if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
			const boundedFetcher = createBoundedMistralFetcher(MISTRAL_STREAM_BODY_MAX_BYTES, getAiTransportHost().buildModelFetch(model) ?? fetch);
			let mistralResponse;
			let reportedResponse;
			const httpClient = new HTTPClient({ fetcher: boundedFetcher });
			httpClient.addHook("response", async (response) => {
				mistralResponse = response;
				if (!response.ok) {
					await notifyProviderHttpResponse({
						options,
						response,
						model
					});
					reportedResponse = response;
				}
			});
			const chat = new Chat({
				apiKey,
				serverURL: model.baseUrl,
				httpClient,
				retryConfig: { strategy: "none" }
			});
			const normalizeMistralToolCallId = createMistralToolCallIdNormalizer();
			let payload = buildChatPayload(model, context, transformProviderMessages(context.messages, model, (id) => normalizeMistralToolCallId(id)), options);
			const nextPayload = await options?.onPayload?.(payload, model);
			if (nextPayload !== void 0) payload = nextPayload;
			const headers = {
				...model.headers,
				...options?.headers
			};
			if (resolveMistralPromptCacheKey(options) && options?.sessionId) headers["x-affinity"] ||= options.sessionId;
			const mistralStream = await chat.stream(payload, {
				headers,
				signal: options?.signal
			});
			if (mistralResponse && mistralResponse !== reportedResponse) await notifyProviderHttpResponse({
				options,
				response: mistralResponse,
				model,
				cancelStream: (reason) => mistralStream.cancel(reason)
			});
			stream.push({
				type: "start",
				partial: output
			});
			await consumeChatStream(model, output, stream, mistralStream, options?.signal);
			if (options?.signal?.aborted) throw transportAbortError(options.signal);
			if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			const terminal = assignTransportErrorDetails(output, error, options?.signal);
			output.content = output.content.filter((block) => block.type !== "toolCall");
			stream.push({
				type: "error",
				reason: terminal.stopReason,
				error: output
			});
			stream.end();
		}
	})();
	return stream;
};
/**
* Maps provider-agnostic `SimpleStreamOptions` to Mistral options.
*/
const streamSimpleMistral = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = {
		...buildBaseOptions(model, options, apiKey),
		maxTokens: clampMaxTokensToModel(model, options?.maxTokens)
	};
	const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
	const reasoning = clampedReasoning === "off" ? void 0 : clampedReasoning;
	const shouldUseReasoning = model.reasoning && reasoning !== void 0;
	const supportsReasoningEffort = usesReasoningEffort(model);
	return streamMistral(model, context, {
		...base,
		promptMode: shouldUseReasoning && !supportsReasoningEffort ? "reasoning" : void 0,
		reasoningEffort: shouldUseReasoning && supportsReasoningEffort ? ReasoningEffort$inboundSchema.parse(model.thinkingLevelMap?.[reasoning] ?? (reasoning === "minimal" ? "none" : "high")) : void 0
	});
};
function createMistralToolCallIdNormalizer() {
	const idMap = /* @__PURE__ */ new Map();
	const reverseMap = /* @__PURE__ */ new Map();
	return (id) => {
		const existing = idMap.get(id);
		if (existing) return existing;
		let attempt = 0;
		while (true) {
			const candidate = deriveMistralToolCallId(id, attempt);
			const owner = reverseMap.get(candidate);
			if (!owner || owner === id) {
				idMap.set(id, candidate);
				reverseMap.set(candidate, id);
				return candidate;
			}
			attempt++;
		}
	};
}
function deriveMistralToolCallId(id, attempt) {
	const normalized = id.replace(/[^a-zA-Z0-9]/g, "");
	if (attempt === 0 && normalized.length === MISTRAL_TOOL_CALL_ID_LENGTH) return normalized;
	const seedBase = normalized || id;
	const seed = attempt === 0 ? seedBase : `${seedBase}:${attempt}`;
	return shortHash(seed).replace(/[^a-zA-Z0-9]/g, "").padEnd(MISTRAL_TOOL_CALL_ID_LENGTH, "0").slice(0, MISTRAL_TOOL_CALL_ID_LENGTH);
}
function buildChatPayload(model, context, messages, options) {
	const payload = {
		model: model.id,
		stream: true,
		messages: toChatMessages(messages, model.input.includes("image"))
	};
	let convertedToolNames;
	if (context.tools?.length) {
		const tools = toFunctionTools(context.tools);
		convertedToolNames = new Set(tools.map((tool) => tool.function.name));
		if (tools.length > 0) payload.tools = tools;
	}
	if (options?.temperature !== void 0) payload.temperature = options.temperature;
	if (options?.maxTokens !== void 0) payload.maxTokens = options.maxTokens;
	if (options?.stop !== void 0 && options.stop.length > 0) payload.stop = options.stop;
	if (options?.toolChoice) {
		const toolChoice = mapToolChoice(options.toolChoice, convertedToolNames);
		if (toolChoice) payload.toolChoice = toolChoice;
	}
	if (options?.promptMode) payload.promptMode = options.promptMode;
	if (options?.reasoningEffort) payload.reasoningEffort = options.reasoningEffort;
	const promptCacheKey = resolveMistralPromptCacheKey(options);
	if (promptCacheKey) payload.promptCacheKey = promptCacheKey;
	if (context.systemPrompt) payload.messages.unshift({
		role: "system",
		content: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
	});
	return payload;
}
function resolveMistralPromptCacheKey(options) {
	if (options?.cacheRetention === "none") return;
	return options?.promptCacheKey?.trim() || options?.sessionId?.trim() || void 0;
}
function readMistralCachedPromptTokens(usage, promptTokens) {
	const record = usage;
	const rawCachedTokens = record.promptTokensDetails?.cachedTokens ?? record.prompt_tokens_details?.cached_tokens ?? record.cachedTokens ?? record.cached_tokens;
	return Math.min(promptTokens, Math.max(0, typeof rawCachedTokens === "number" && Number.isFinite(rawCachedTokens) ? rawCachedTokens : 0));
}
async function consumeChatStream(model, output, stream, mistralStream, signal) {
	let currentBlock = null;
	let terminalFinishReason;
	const blocks = output.content;
	const blockIndex = () => blocks.length - 1;
	const toolBlockIdentities = /* @__PURE__ */ new Map();
	const toolArgumentPreviewSchedules = /* @__PURE__ */ new WeakMap();
	const normalizeMissingToolCallId = createMistralToolCallIdNormalizer();
	const missingToolCallIdScope = randomUUID();
	const createMissingToolCallId = (contentIndex) => normalizeMissingToolCallId(`${missingToolCallIdScope}:toolcall:${contentIndex}`);
	const findIdentityCandidates = (matches, excludedContentIndexes) => {
		const candidates = /* @__PURE__ */ new Set();
		for (const [contentIndex, identity] of toolBlockIdentities) if (!excludedContentIndexes?.has(contentIndex) && matches(identity)) candidates.add(contentIndex);
		return candidates;
	};
	const intersectCandidates = (left, right) => new Set([...left].filter((contentIndex) => right.has(contentIndex)));
	const requireSingleCandidate = (candidates) => {
		if (candidates.size > 1) throw new Error("Mistral streamed tool-call continuation is ambiguous; refusing to merge arguments");
		return candidates.values().next().value;
	};
	const requireExistingCandidate = (candidates) => {
		const candidate = requireSingleCandidate(candidates);
		if (candidate === void 0) throw new Error("Mistral streamed tool-call identities conflict; refusing to merge arguments");
		return candidate;
	};
	const resolveToolBlockIndex = (params) => {
		const explicitId = params.explicitId;
		const functionName = params.functionName;
		const toolCallIndex = params.index;
		const idCandidates = explicitId ? findIdentityCandidates((identity) => identity.explicitIds.has(explicitId), params.usedContentIndexes) : /* @__PURE__ */ new Set();
		const nameCandidates = functionName ? findIdentityCandidates((identity) => identity.functionNames.has(functionName), params.usedContentIndexes) : /* @__PURE__ */ new Set();
		if (idCandidates.size > 0) {
			let candidates = idCandidates;
			if (nameCandidates.size > 0) candidates = intersectCandidates(candidates, nameCandidates);
			return requireExistingCandidate(candidates);
		}
		if (nameCandidates.size > 0) {
			const idCompatibleCandidates = new Set([...nameCandidates].filter((contentIndex) => {
				const identity = toolBlockIdentities.get(contentIndex);
				if (!identity) return false;
				return !explicitId || identity.explicitIds.size === 0;
			}));
			if (idCompatibleCandidates.size <= 1 && (toolCallIndex === void 0 || toolCallIndex === 0)) return requireSingleCandidate(idCompatibleCandidates);
			const indexCompatibleCandidates = new Set([...idCompatibleCandidates].filter((contentIndex) => {
				const identity = toolBlockIdentities.get(contentIndex);
				if (!identity) return false;
				return toolCallIndex === void 0 || identity.indexes.size === 0 || identity.indexes.has(toolCallIndex);
			}));
			if (indexCompatibleCandidates.size === 0) return;
			return requireSingleCandidate(indexCompatibleCandidates);
		}
		const indexCandidates = toolCallIndex === void 0 ? /* @__PURE__ */ new Set() : findIdentityCandidates((identity) => identity.indexes.has(toolCallIndex), params.usedContentIndexes);
		if (functionName) {
			const namelessCandidates = new Set([...indexCandidates].filter((contentIndex) => {
				const identity = toolBlockIdentities.get(contentIndex);
				return identity?.functionNames.size === 0 && (!explicitId || identity.explicitIds.size === 0);
			}));
			return requireSingleCandidate(namelessCandidates);
		}
		if (explicitId) {
			const idlessCandidates = new Set([...indexCandidates].filter((contentIndex) => toolBlockIdentities.get(contentIndex)?.explicitIds.size === 0));
			return requireSingleCandidate(idlessCandidates);
		}
		return requireSingleCandidate(indexCandidates);
	};
	const finishCurrentBlock = (block) => {
		if (!block) return;
		if (block.type === "text") {
			stream.push({
				type: "text_end",
				contentIndex: blockIndex(),
				content: block.text,
				partial: output
			});
			return;
		}
		if (block.type === "thinking") stream.push({
			type: "thinking_end",
			contentIndex: blockIndex(),
			content: block.thinking,
			partial: output
		});
	};
	for await (const event of mistralStream) {
		notifyLlmRequestActivity(signal);
		const chunk = event.data;
		output.responseId ||= chunk.id;
		if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) output.responseModel ||= chunk.model;
		if (chunk.usage) {
			const promptTokens = chunk.usage.promptTokens || 0;
			const cachedPromptTokens = readMistralCachedPromptTokens(chunk.usage, promptTokens);
			output.usage.input = Math.max(0, promptTokens - cachedPromptTokens);
			output.usage.output = chunk.usage.completionTokens || 0;
			output.usage.cacheRead = cachedPromptTokens;
			output.usage.cacheWrite = 0;
			output.usage.totalTokens = chunk.usage.totalTokens || output.usage.input + output.usage.output + output.usage.cacheRead;
			calculateCost(model, output.usage);
		}
		const choice = chunk.choices[0];
		if (!choice) continue;
		if (choice.finishReason) {
			terminalFinishReason = choice.finishReason;
			const { stopReason, errorMessage } = mapOpenAIStopReason(choice.finishReason === "model_length" ? "length" : choice.finishReason);
			output.stopReason = stopReason;
			if (errorMessage) output.errorMessage = errorMessage;
		}
		const delta = choice.delta;
		if (delta.content !== null && delta.content !== void 0) {
			const contentItems = typeof delta.content === "string" ? [delta.content] : delta.content;
			for (const item of contentItems) {
				if (typeof item === "string") {
					const textDelta = sanitizeSurrogates(item);
					if (!currentBlock || currentBlock.type !== "text") {
						finishCurrentBlock(currentBlock);
						currentBlock = {
							type: "text",
							text: ""
						};
						output.content.push(currentBlock);
						stream.push({
							type: "text_start",
							contentIndex: blockIndex(),
							partial: output
						});
					}
					currentBlock.text += textDelta;
					stream.push({
						type: "text_delta",
						contentIndex: blockIndex(),
						delta: textDelta,
						partial: output
					});
					continue;
				}
				if (item.type === "thinking") {
					const deltaText = item.thinking.map((part) => "text" in part ? part.text : "").join("");
					const thinkingDelta = sanitizeSurrogates(deltaText);
					if (!thinkingDelta) continue;
					if (!currentBlock || currentBlock.type !== "thinking") {
						finishCurrentBlock(currentBlock);
						currentBlock = {
							type: "thinking",
							thinking: ""
						};
						output.content.push(currentBlock);
						stream.push({
							type: "thinking_start",
							contentIndex: blockIndex(),
							partial: output
						});
					}
					appendAssistantThinking(currentBlock, thinkingDelta);
					stream.push({
						type: "thinking_delta",
						contentIndex: blockIndex(),
						delta: thinkingDelta,
						partial: output
					});
					continue;
				}
				if (item.type === "text") {
					const textDelta = sanitizeSurrogates(item.text);
					if (!currentBlock || currentBlock.type !== "text") {
						finishCurrentBlock(currentBlock);
						currentBlock = {
							type: "text",
							text: ""
						};
						output.content.push(currentBlock);
						stream.push({
							type: "text_start",
							contentIndex: blockIndex(),
							partial: output
						});
					}
					currentBlock.text += textDelta;
					stream.push({
						type: "text_delta",
						contentIndex: blockIndex(),
						delta: textDelta,
						partial: output
					});
				}
			}
		}
		const toolCalls = delta.toolCalls || [];
		const usedToolBlockIndexes = /* @__PURE__ */ new Set();
		for (const toolCall of toolCalls) {
			if (currentBlock) {
				finishCurrentBlock(currentBlock);
				currentBlock = null;
			}
			const toolCallIndex = typeof toolCall.index === "number" && Number.isInteger(toolCall.index) ? toolCall.index : void 0;
			const providedCallId = toolCall.id && toolCall.id !== "null" ? toolCall.id : void 0;
			const functionName = toolCall.function.name.trim() || void 0;
			const existingIndex = resolveToolBlockIndex({
				explicitId: providedCallId,
				functionName,
				index: toolCallIndex,
				usedContentIndexes: usedToolBlockIndexes
			});
			let block;
			if (existingIndex !== void 0) {
				const existing = output.content[existingIndex];
				if (existing?.type === "toolCall") block = existing;
			}
			if (!block) {
				const contentIndex = output.content.length;
				block = {
					type: "toolCall",
					id: providedCallId ?? createMissingToolCallId(contentIndex),
					name: functionName ?? "",
					arguments: {},
					partialArgs: ""
				};
				output.content.push(block);
				toolArgumentPreviewSchedules.set(block, createToolArgumentPreviewSchedule());
				toolBlockIdentities.set(contentIndex, {
					explicitIds: new Set(providedCallId ? [providedCallId] : []),
					functionNames: new Set(functionName ? [functionName] : []),
					indexes: new Set(toolCallIndex === void 0 ? [] : [toolCallIndex])
				});
				stream.push({
					type: "toolcall_start",
					contentIndex,
					partial: output
				});
			}
			const contentIndex = output.content.indexOf(block);
			const identity = toolBlockIdentities.get(contentIndex);
			if (!identity) throw new Error("Mistral streamed tool-call identity is missing");
			usedToolBlockIndexes.add(contentIndex);
			if (providedCallId) {
				block.id = providedCallId;
				identity.explicitIds.add(providedCallId);
			}
			if (functionName) {
				if (identity.functionNames.size > 0 && !identity.functionNames.has(functionName)) throw new Error("Mistral streamed tool-call continuation changed function name; refusing to merge arguments");
				block.name = functionName;
				identity.functionNames.add(functionName);
			}
			if (toolCallIndex !== void 0) identity.indexes.add(toolCallIndex);
			const argsDelta = typeof toolCall.function.arguments === "string" ? toolCall.function.arguments : JSON.stringify(toolCall.function.arguments || {});
			block.partialArgs = (block.partialArgs || "") + argsDelta;
			if (toolArgumentPreviewSchedules.get(block)?.(block.partialArgs.length)) block.arguments = parseStreamingJson(block.partialArgs);
			stream.push({
				type: "toolcall_delta",
				contentIndex,
				delta: argsDelta,
				partial: output
			});
		}
	}
	finishCurrentBlock(currentBlock);
	if (!terminalFinishReason || output.stopReason !== "toolUse") {
		blocks.splice(0, blocks.length, ...blocks.filter((block) => block.type !== "toolCall"));
		if (!terminalFinishReason) throw new Error("Mistral stream ended without a terminal finish reason");
		return;
	}
	const completedToolCalls = [...toolBlockIdentities.keys()].flatMap((contentIndex) => {
		const block = blocks[contentIndex];
		return block?.type === "toolCall" ? [{
			block,
			contentIndex
		}] : [];
	});
	finalizeTerminalToolCallArguments(completedToolCalls.map(({ block }) => block), (block) => block.partialArgs ?? "", "Mistral completed tool call has invalid JSON arguments");
	for (const { block, contentIndex } of completedToolCalls) {
		delete block.partialArgs;
		stream.push({
			type: "toolcall_end",
			contentIndex,
			toolCall: block,
			partial: output
		});
	}
}
function toFunctionTools(tools) {
	const converted = tools.flatMap((tool) => {
		try {
			const name = tool.name;
			const description = tool.description;
			return {
				name,
				description,
				value: {
					type: "function",
					function: {
						name,
						description,
						parameters: stripSymbolKeys(tool.parameters),
						strict: false
					}
				}
			};
		} catch {
			return [];
		}
	});
	return sortPromptCacheToolsByName(converted).map(({ value }) => value);
}
function stripSymbolKeys(value) {
	if (Array.isArray(value)) return value.map((item) => stripSymbolKeys(item));
	if (value && typeof value === "object") {
		const result = {};
		for (const [key, entry] of Object.entries(value)) result[key] = stripSymbolKeys(entry);
		return result;
	}
	return value;
}
function toChatMessages(messages, supportsImages) {
	const result = [];
	for (const msg of messages) {
		if (msg.role === "user") {
			if (typeof msg.content === "string") {
				result.push({
					role: "user",
					content: sanitizeSurrogates(msg.content)
				});
				continue;
			}
			const hadImages = msg.content.some((item) => item.type === "image");
			const content = msg.content.filter((item) => item.type === "text" || supportsImages).map((item) => {
				if (item.type === "text") return {
					type: "text",
					text: sanitizeSurrogates(item.text)
				};
				return {
					type: "image_url",
					imageUrl: `data:${item.mimeType};base64,${item.data}`
				};
			});
			if (content.length > 0) {
				result.push({
					role: "user",
					content
				});
				continue;
			}
			if (hadImages && !supportsImages) result.push({
				role: "user",
				content: "(image omitted: model does not support images)"
			});
			continue;
		}
		if (msg.role === "assistant") {
			const contentParts = [];
			const toolCalls = [];
			for (const block of msg.content) {
				if (block.type === "text") {
					if (block.text.trim().length > 0) contentParts.push({
						type: "text",
						text: sanitizeSurrogates(block.text)
					});
					continue;
				}
				if (block.type === "thinking") {
					if (block.thinking.trim().length > 0) contentParts.push({
						type: "thinking",
						thinking: [{
							type: "text",
							text: sanitizeSurrogates(block.thinking)
						}]
					});
					continue;
				}
				toolCalls.push({
					id: block.id,
					type: "function",
					function: {
						name: block.name,
						arguments: JSON.stringify(block.arguments || {})
					}
				});
			}
			const assistantMessage = { role: "assistant" };
			if (contentParts.length > 0) assistantMessage.content = contentParts;
			if (toolCalls.length > 0) assistantMessage.toolCalls = toolCalls;
			if (contentParts.length > 0 || toolCalls.length > 0) result.push(assistantMessage);
			continue;
		}
		const toolContent = [];
		const textResult = extractToolResultText(msg.content);
		const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
		const omittedMediaPlaceholder = msg.content.some(isImageWithMediaPayload) && !supportsImages ? textResult.trim() ? "[tool image omitted: model does not support images]" : mediaPlaceholder === "(see attached media)" ? "(media omitted: model does not support images)" : "(image omitted: model does not support images)" : void 0;
		const toolText = formatToolResultText({
			text: textResult,
			mediaPlaceholder,
			omittedMediaPlaceholder,
			isError: msg.isError
		});
		toolContent.push({
			type: "text",
			text: toolText
		});
		for (const part of msg.content) {
			if (!supportsImages) continue;
			if (!isImageWithMediaPayload(part)) continue;
			toolContent.push({
				type: "image_url",
				imageUrl: `data:${part.mimeType};base64,${part.data}`
			});
		}
		result.push({
			role: "tool",
			toolCallId: msg.toolCallId,
			name: msg.toolName,
			content: toolContent
		});
	}
	return result;
}
function usesReasoningEffort(model) {
	return model.id === "mistral-small-2603" || model.id === "mistral-small-latest" || model.id === "mistral-medium-3-5";
}
function mapToolChoice(choice, convertedToolNames) {
	if (!choice) return;
	if (convertedToolNames && convertedToolNames.size === 0) {
		if (choice === "none" || choice === "auto") return choice === "none" ? "none" : void 0;
		throw new Error("Mistral tool_choice requires a tool, but no tools survived schema conversion");
	}
	if (choice === "auto" || choice === "none" || choice === "any" || choice === "required") return choice;
	const toolName = choice.function.name;
	if (convertedToolNames && !convertedToolNames.has(toolName)) throw new Error(`Mistral tool_choice requested unavailable tool "${toolName}" after schema conversion`);
	return {
		type: "function",
		function: { name: toolName }
	};
}
//#endregion
export { createBoundedMistralFetcher, streamMistral, streamSimpleMistral };
