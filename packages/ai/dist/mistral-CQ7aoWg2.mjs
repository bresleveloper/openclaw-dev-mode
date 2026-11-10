import { r as appendAssistantThinking, t as AssistantMessageEventStream } from "./event-stream-X2gmsUWv.mjs";
import { N as isImageWithMediaPayload, O as calculateCost, k as clampThinkingLevel, r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-CRGuMONI.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-D_MeCQFI.mjs";
import { f as extractToolResultText, l as describeToolResultMediaPlaceholder, n as buildBaseOptions, p as formatToolResultText, r as clampMaxTokensToModel, w as stripSystemPromptCacheBoundary } from "./simple-options-xJkqrG_E.mjs";
import { A as shortHash, E as createToolArgumentPreviewSchedule, O as parseStreamingJson, l as finalizeTerminalToolCallArguments, m as notifyProviderHttpResponse, n as assignTransportErrorDetails, u as finalizeTransportStream } from "./transport-stream-shared-lhgkTOz3.mjs";
import { n as transformProviderMessages, t as createAssistantOutput } from "./assistant-output-BnQm3fov.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-CfMuh5cC.mjs";
import { t as boundResponseBody } from "./streaming-byte-guard-DBXr1XYn.mjs";
import { t as mapOpenAIStopReason } from "./openai-stop-reason-8s70vDXj.mjs";
import { t as requireApiKey } from "./required-api-key-D088S4Cd.mjs";
import { randomUUID } from "node:crypto";
import { HTTPClient } from "@mistralai/mistralai/lib/http";
import { ReasoningEffort$inboundSchema } from "@mistralai/mistralai/models/components/reasoningeffort.js";
import { Chat } from "@mistralai/mistralai/sdk/chat";
//#region packages/ai/src/providers/mistral-usage.ts
function readMistralCachedPromptTokens(usage, promptTokens) {
	const record = usage;
	const rawCachedTokens = record.promptTokensDetails?.cachedTokens ?? record.prompt_tokens_details?.cached_tokens ?? record.cachedTokens ?? record.cached_tokens;
	return Math.min(promptTokens, Math.max(0, typeof rawCachedTokens === "number" && Number.isFinite(rawCachedTokens) ? rawCachedTokens : 0));
}
function applyMistralUsage(output, usage, model, terminal) {
	const promptTokens = usage.promptTokens || 0;
	const cacheRead = readMistralCachedPromptTokens(usage, promptTokens);
	output.input = Math.max(0, promptTokens - cacheRead);
	output.output = usage.completionTokens || 0;
	output.cacheRead = cacheRead;
	output.cacheWrite = 0;
	output.totalTokens = usage.totalTokens || output.input + output.output + cacheRead;
	output.usageReport = { state: terminal ? "available" : "unavailable" };
	calculateCost(model, output);
}
//#endregion
//#region packages/ai/src/providers/mistral.ts
const MISTRAL_TOOL_CALL_ID_LENGTH = 9;
const MISTRAL_STREAM_BODY_MAX_BYTES = 16777216;
/** Cap the SDK's response reader while preserving bodyless error responses. */
function createBoundedMistralFetcher(maxBytes = MISTRAL_STREAM_BODY_MAX_BYTES, upstreamFetch = fetch) {
	return async (input, init) => {
		const response = init == null ? await upstreamFetch(input) : await upstreamFetch(input, init);
		return boundResponseBody(response, {
			maxBytes,
			onOverflow: ({ size, maxBytes: cap }) => /* @__PURE__ */ new Error(`mistral: stream body exceeds ${cap} bytes (got ${size})`)
		});
	};
}
const streamMistral = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const output = createAssistantOutput(model);
		try {
			const apiKey = requireApiKey(model.provider, options?.apiKey);
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
			let payload = buildChatPayload(model, context, transformProviderMessages(context.messages, model, normalizeMistralToolCallId), options);
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
			finalizeTransportStream({
				stream,
				output,
				signal: options?.signal
			});
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
const streamSimpleMistral = (model, context, options) => {
	const apiKey = requireApiKey(model.provider, options?.apiKey);
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
async function consumeChatStream(model, output, stream, mistralStream, signal) {
	let currentBlock = null;
	let terminalFinishReason;
	const blocks = output.content;
	const blockIndex = () => blocks.length - 1;
	const toolBlocks = [];
	const normalizeMissingToolCallId = createMistralToolCallIdNormalizer();
	const missingToolCallIdScope = randomUUID();
	const createMissingToolCallId = (contentIndex) => normalizeMissingToolCallId(`${missingToolCallIdScope}:toolcall:${contentIndex}`);
	const requireSingleCandidate = (candidates) => {
		if (candidates.length > 1) throw new Error("Mistral streamed tool-call continuation is ambiguous; refusing to merge arguments");
		return candidates[0];
	};
	const resolveToolBlock = (params) => {
		const explicitId = params.explicitId;
		const functionName = params.functionName;
		const toolCallIndex = params.index;
		const available = toolBlocks.filter((identity) => !params.usedContentIndexes.has(identity.contentIndex));
		const idCandidates = explicitId ? available.filter((identity) => identity.explicitIds.has(explicitId)) : [];
		const nameCandidates = functionName ? available.filter((identity) => identity.functionNames.has(functionName)) : [];
		if (idCandidates.length > 0) {
			let candidates = idCandidates;
			if (nameCandidates.length > 0) candidates = candidates.filter((identity) => nameCandidates.includes(identity));
			const candidate = requireSingleCandidate(candidates);
			if (!candidate) throw new Error("Mistral streamed tool-call identities conflict; refusing to merge arguments");
			return candidate;
		}
		if (nameCandidates.length > 0) {
			const idCompatibleCandidates = nameCandidates.filter((identity) => !explicitId || identity.explicitIds.size === 0);
			if (idCompatibleCandidates.length <= 1 && (toolCallIndex === void 0 || toolCallIndex === 0)) return requireSingleCandidate(idCompatibleCandidates);
			const indexCompatibleCandidates = idCompatibleCandidates.filter((identity) => toolCallIndex === void 0 || identity.indexes.size === 0 || identity.indexes.has(toolCallIndex));
			return requireSingleCandidate(indexCompatibleCandidates);
		}
		const indexCandidates = toolCallIndex === void 0 ? [] : available.filter((identity) => identity.indexes.has(toolCallIndex));
		return requireSingleCandidate(indexCandidates.filter((identity) => (!functionName || identity.functionNames.size === 0) && (!explicitId || identity.explicitIds.size === 0)));
	};
	const finishCurrentBlock = () => {
		if (!currentBlock) return;
		stream.push({
			type: currentBlock.type === "text" ? "text_end" : "thinking_end",
			contentIndex: blockIndex(),
			content: currentBlock.type === "text" ? currentBlock.text : currentBlock.thinking,
			partial: output
		});
	};
	const appendContentDelta = (type, text) => {
		const delta = sanitizeSurrogates(text);
		if (type === "thinking" && !delta) return;
		if (!currentBlock || currentBlock.type !== type) {
			finishCurrentBlock();
			currentBlock = type === "text" ? {
				type,
				text: ""
			} : {
				type,
				thinking: ""
			};
			output.content.push(currentBlock);
			stream.push({
				type: `${type}_start`,
				contentIndex: blockIndex(),
				partial: output
			});
		}
		if (currentBlock.type === "text") currentBlock.text += delta;
		else appendAssistantThinking(currentBlock, delta);
		stream.push({
			type: `${type}_delta`,
			contentIndex: blockIndex(),
			delta,
			partial: output
		});
	};
	for await (const event of mistralStream) {
		notifyLlmRequestActivity(signal);
		const chunk = event.data;
		output.responseId ||= chunk.id;
		if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) output.responseModel ||= chunk.model;
		if (chunk.usage) applyMistralUsage(output.usage, chunk.usage, model, Boolean(terminalFinishReason || chunk.choices[0]?.finishReason));
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
					appendContentDelta("text", item);
					continue;
				}
				if (item.type === "thinking") appendContentDelta("thinking", item.thinking.map((part) => "text" in part ? part.text : "").join(""));
				else if (item.type === "text") appendContentDelta("text", item.text);
			}
		}
		const toolCalls = delta.toolCalls || [];
		const usedToolBlockIndexes = /* @__PURE__ */ new Set();
		for (const toolCall of toolCalls) {
			if (currentBlock) {
				finishCurrentBlock();
				currentBlock = null;
			}
			const toolCallIndex = typeof toolCall.index === "number" && Number.isInteger(toolCall.index) ? toolCall.index : void 0;
			const providedCallId = toolCall.id && toolCall.id !== "null" ? toolCall.id : void 0;
			const functionName = toolCall.function.name.trim() || void 0;
			let identity = resolveToolBlock({
				explicitId: providedCallId,
				functionName,
				index: toolCallIndex,
				usedContentIndexes: usedToolBlockIndexes
			});
			if (!identity) {
				const contentIndex = output.content.length;
				const block = {
					type: "toolCall",
					id: providedCallId ?? createMissingToolCallId(contentIndex),
					name: functionName ?? "",
					arguments: {},
					partialJson: ""
				};
				output.content.push(block);
				identity = {
					block,
					contentIndex,
					preview: createToolArgumentPreviewSchedule(),
					explicitIds: /* @__PURE__ */ new Set(),
					functionNames: /* @__PURE__ */ new Set(),
					indexes: /* @__PURE__ */ new Set()
				};
				toolBlocks.push(identity);
				stream.push({
					type: "toolcall_start",
					contentIndex,
					partial: output
				});
			}
			const { block, contentIndex } = identity;
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
			block.partialJson = (block.partialJson || "") + argsDelta;
			if (identity.preview(block.partialJson.length)) block.arguments = parseStreamingJson(block.partialJson);
			stream.push({
				type: "toolcall_delta",
				contentIndex,
				delta: argsDelta,
				partial: output
			});
		}
	}
	finishCurrentBlock();
	if (!terminalFinishReason || output.stopReason !== "toolUse") {
		blocks.splice(0, blocks.length, ...blocks.filter((block) => block.type !== "toolCall"));
		if (!terminalFinishReason) throw new Error("Mistral stream ended without a terminal finish reason");
		return;
	}
	finalizeTerminalToolCallArguments(toolBlocks.map(({ block }) => block), (block) => block.partialJson ?? "", "Mistral completed tool call has invalid JSON arguments");
	for (const { block, contentIndex } of toolBlocks) {
		delete block.partialJson;
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
						parameters: structuredClone(tool.parameters),
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
				if (block.type === "text" || block.type === "thinking") {
					const text = block.type === "text" ? block.text : block.thinking;
					if (text.trim().length > 0) {
						const part = {
							type: "text",
							text: sanitizeSurrogates(text)
						};
						contentParts.push(block.type === "text" ? part : {
							type: "thinking",
							thinking: [part]
						});
					}
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
