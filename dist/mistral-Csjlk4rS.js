import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { l as calculateCost, n as transformMessages, s as buildBaseOptions, t as sanitizeSurrogates, u as clampThinkingLevel } from "./sanitize-unicode-DcA7E1vi.js";
import { n as getEnvApiKey } from "./env-api-keys-8q9bEA0v.js";
import { n as parseStreamingJson } from "./json-parse-CydVzlvP.js";
import { a as stripSystemPromptCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
import { t as shortHash } from "./hash-mbqDyGo7.js";
import { Mistral } from "@mistralai/mistralai";
//#region src/llm/providers/mistral.ts
const MISTRAL_TOOL_CALL_ID_LENGTH = 9;
const MAX_MISTRAL_ERROR_BODY_CHARS = 4e3;
/**
* Stream responses from Mistral using `chat.stream`.
*/
const streamMistral = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const output = createOutput(model);
		try {
			const apiKey = options?.apiKey || getEnvApiKey(model.provider);
			if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
			const mistral = new Mistral({
				apiKey,
				serverURL: model.baseUrl
			});
			const normalizeMistralToolCallId = createMistralToolCallIdNormalizer();
			let payload = buildChatPayload(model, context, transformMessages(context.messages, model, (id) => normalizeMistralToolCallId(id)), options);
			const nextPayload = await options?.onPayload?.(payload, model);
			if (nextPayload !== void 0) payload = nextPayload;
			const mistralStream = await mistral.chat.stream(payload, buildRequestOptions(model, options));
			stream.push({
				type: "start",
				partial: output
			});
			await consumeChatStream(model, output, stream, mistralStream);
			if (options?.signal?.aborted) throw new Error("Request was aborted");
			if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error("An unknown error occurred");
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			for (const block of output.content) delete block.partialArgs;
			output.stopReason = options?.signal?.aborted ? "aborted" : "error";
			output.errorMessage = formatMistralError(error);
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
/**
* Maps provider-agnostic `SimpleStreamOptions` to Mistral options.
*/
const streamSimpleMistral = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
	const reasoning = clampedReasoning === "off" ? void 0 : clampedReasoning;
	const shouldUseReasoning = model.reasoning && reasoning !== void 0;
	return streamMistral(model, context, {
		...base,
		promptMode: shouldUseReasoning && usesPromptModeReasoning(model) ? "reasoning" : void 0,
		reasoningEffort: shouldUseReasoning && usesReasoningEffort(model) ? mapReasoningEffort(model, reasoning) : void 0
	});
};
function createOutput(model) {
	return {
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
}
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
	return shortHash(attempt === 0 ? seedBase : `${seedBase}:${attempt}`).replace(/[^a-zA-Z0-9]/g, "").slice(0, MISTRAL_TOOL_CALL_ID_LENGTH);
}
function formatMistralError(error) {
	if (error instanceof Error) {
		const sdkError = error;
		const statusCode = typeof sdkError.statusCode === "number" ? sdkError.statusCode : void 0;
		const bodyText = typeof sdkError.body === "string" ? sdkError.body.trim() : void 0;
		if (statusCode !== void 0 && bodyText) return `Mistral API error (${statusCode}): ${truncateErrorText(bodyText, MAX_MISTRAL_ERROR_BODY_CHARS)}`;
		if (statusCode !== void 0) return `Mistral API error (${statusCode}): ${error.message}`;
		return error.message;
	}
	return safeJsonStringify(error);
}
function truncateErrorText(text, maxChars) {
	if (text.length <= maxChars) return text;
	return `${text.slice(0, maxChars)}... [truncated ${text.length - maxChars} chars]`;
}
function safeJsonStringify(value) {
	try {
		const serialized = JSON.stringify(value);
		return serialized === void 0 ? String(value) : serialized;
	} catch {
		return String(value);
	}
}
function buildRequestOptions(model, options) {
	const requestOptions = { retries: { strategy: "none" } };
	if (options?.signal) requestOptions.signal = options.signal;
	const headers = {};
	if (model.headers) Object.assign(headers, model.headers);
	if (options?.headers) Object.assign(headers, options.headers);
	if (options?.sessionId && !headers["x-affinity"]) headers["x-affinity"] = options.sessionId;
	if (Object.keys(headers).length > 0) requestOptions.headers = headers;
	return requestOptions;
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
	if (context.systemPrompt) payload.messages.unshift({
		role: "system",
		content: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
	});
	return payload;
}
async function consumeChatStream(model, output, stream, mistralStream) {
	let currentBlock = null;
	const blocks = output.content;
	const blockIndex = () => blocks.length - 1;
	const toolBlocksByKey = /* @__PURE__ */ new Map();
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
		const chunk = event.data;
		output.responseId ||= chunk.id;
		if (chunk.usage) {
			output.usage.input = chunk.usage.promptTokens || 0;
			output.usage.output = chunk.usage.completionTokens || 0;
			output.usage.cacheRead = 0;
			output.usage.cacheWrite = 0;
			output.usage.totalTokens = chunk.usage.totalTokens || output.usage.input + output.usage.output;
			calculateCost(model, output.usage);
		}
		const choice = chunk.choices[0];
		if (!choice) continue;
		if (choice.finishReason) output.stopReason = mapChatStopReason(choice.finishReason);
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
					const thinkingDelta = sanitizeSurrogates(item.thinking.map((part) => "text" in part ? part.text : "").filter((text) => text.length > 0).join(""));
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
					currentBlock.thinking += thinkingDelta;
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
		for (const toolCall of toolCalls) {
			if (currentBlock) {
				finishCurrentBlock(currentBlock);
				currentBlock = null;
			}
			const callId = toolCall.id && toolCall.id !== "null" ? toolCall.id : deriveMistralToolCallId(`toolcall:${toolCall.index ?? 0}`, 0);
			const key = `${callId}:${toolCall.index || 0}`;
			const existingIndex = toolBlocksByKey.get(key);
			let block;
			if (existingIndex !== void 0) {
				const existing = output.content[existingIndex];
				if (existing?.type === "toolCall") block = existing;
			}
			if (!block) {
				block = {
					type: "toolCall",
					id: callId,
					name: toolCall.function.name,
					arguments: {},
					partialArgs: ""
				};
				output.content.push(block);
				toolBlocksByKey.set(key, output.content.length - 1);
				stream.push({
					type: "toolcall_start",
					contentIndex: output.content.length - 1,
					partial: output
				});
			}
			const argsDelta = typeof toolCall.function.arguments === "string" ? toolCall.function.arguments : JSON.stringify(toolCall.function.arguments || {});
			block.partialArgs = (block.partialArgs || "") + argsDelta;
			block.arguments = parseStreamingJson(block.partialArgs);
			stream.push({
				type: "toolcall_delta",
				contentIndex: toolBlocksByKey.get(key),
				delta: argsDelta,
				partial: output
			});
		}
	}
	finishCurrentBlock(currentBlock);
	for (const index of toolBlocksByKey.values()) {
		const block = output.content[index];
		if (block.type !== "toolCall") continue;
		const toolBlock = block;
		toolBlock.arguments = parseStreamingJson(toolBlock.partialArgs);
		delete toolBlock.partialArgs;
		stream.push({
			type: "toolcall_end",
			contentIndex: index,
			toolCall: toolBlock,
			partial: output
		});
	}
}
function toFunctionTools(tools) {
	return tools.flatMap((tool) => {
		try {
			return {
				type: "function",
				function: {
					name: tool.name,
					description: tool.description,
					parameters: stripSymbolKeys(tool.parameters),
					strict: false
				}
			};
		} catch {
			return [];
		}
	});
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
		const toolText = buildToolResultText(msg.content.filter((part) => part.type === "text").map((part) => part.type === "text" ? sanitizeSurrogates(part.text) : "").join("\n"), msg.content.some((part) => part.type === "image"), supportsImages, msg.isError);
		toolContent.push({
			type: "text",
			text: toolText
		});
		for (const part of msg.content) {
			if (!supportsImages) continue;
			if (part.type !== "image") continue;
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
function buildToolResultText(text, hasImages, supportsImages, isError) {
	const trimmed = text.trim();
	const errorPrefix = isError ? "[tool error] " : "";
	if (trimmed.length > 0) return `${errorPrefix}${trimmed}${hasImages && !supportsImages ? "\n[tool image omitted: model does not support images]" : ""}`;
	if (hasImages) {
		if (supportsImages) return isError ? "[tool error] (see attached image)" : "(see attached image)";
		return isError ? "[tool error] (image omitted: model does not support images)" : "(image omitted: model does not support images)";
	}
	return isError ? "[tool error] (no tool output)" : "(no tool output)";
}
function usesReasoningEffort(model) {
	return model.id === "mistral-small-2603" || model.id === "mistral-small-latest" || model.id === "mistral-medium-3.5";
}
function usesPromptModeReasoning(model) {
	return model.reasoning && !usesReasoningEffort(model);
}
function mapReasoningEffort(model, level) {
	return model.thinkingLevelMap?.[level] ?? "high";
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
function mapChatStopReason(reason) {
	if (reason === null) return "stop";
	switch (reason) {
		case "stop": return "stop";
		case "length":
		case "model_length": return "length";
		case "tool_calls": return "toolUse";
		case "error": return "error";
		default: return "stop";
	}
}
//#endregion
export { streamMistral, streamSimpleMistral };
