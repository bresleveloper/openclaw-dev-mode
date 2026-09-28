import { r as appendAssistantThinking } from "./event-stream-D8PARQfL.mjs";
import { M as calculateCost, _ as isImageWithMediaPayload, d as describeToolResultMediaPlaceholder, m as extractToolResultText, v as sanitizeSurrogates } from "./host-yTvBrYM2.mjs";
import { v as sortPromptCacheToolsByName } from "./simple-options-np1XPuhm.mjs";
import { _ as sanitizeTransportPayloadText, r as coerceTransportToolCallArguments, v as transportAbortError } from "./transport-stream-shared-B5RioB_Q.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-BjtkplhG.mjs";
//#region packages/ai/src/transports/google-thinking-level.ts
/** Returns whether a Gemini Flash model accepts the MINIMAL thinking level. */
function googleFlashSupportsMinimalThinking(modelId) {
	const match = modelId.toLowerCase().match(/(?:^|\/)gemini-3\.(\d+)-flash(?:-|$)/);
	if (!match) return true;
	return Number.parseInt(match[1] ?? "0", 10) < 7;
}
//#endregion
//#region packages/ai/src/providers/google-stream.ts
const GOOGLE_MODEL_RESOURCE_PREFIX = /^(?:(?:projects\/[^/]+\/locations\/[^/]+\/)?publishers\/google\/models\/|google\/|models\/)/u;
function retainThoughtSignature(existing, incoming) {
	if (typeof incoming === "string" && incoming.length > 0) return incoming;
	return existing;
}
const stopReasons = new Map(Object.entries({
	STOP: "stop",
	MAX_TOKENS: "length",
	BLOCKLIST: "error",
	PROHIBITED_CONTENT: "error",
	SPII: "error",
	SAFETY: "error",
	IMAGE_SAFETY: "error",
	IMAGE_PROHIBITED_CONTENT: "error",
	IMAGE_RECITATION: "error",
	IMAGE_OTHER: "error",
	RECITATION: "error",
	FINISH_REASON_UNSPECIFIED: "error",
	OTHER: "error",
	LANGUAGE: "error",
	MALFORMED_FUNCTION_CALL: "error",
	TOO_MANY_TOOL_CALLS: "error",
	UNEXPECTED_TOOL_CALL: "error",
	NO_IMAGE: "error"
}));
function mapStopReason(reason) {
	const mapped = stopReasons.get(reason);
	if (!mapped) throw new Error(`Unhandled stop reason: ${reason}`);
	return mapped;
}
/** @internal Directly tested provider implementation detail. */
async function consumeGoogleGenerateContentStream(params) {
	const preserveParts = params.profile !== "managed";
	const normalizeModelId = params.normalizeModelId ?? ((id) => id.replace(GOOGLE_MODEL_RESOURCE_PREFIX, ""));
	params.stream.push({
		type: "start",
		partial: params.output
	});
	let currentBlock = null;
	const blocks = params.output.content;
	let sawTerminalReason = false;
	let terminalGenerationError;
	const knownUsage = {
		promptTokenCount: 0,
		cachedContentTokenCount: 0,
		toolUsePromptTokenCount: 0,
		candidatesTokenCount: 0,
		thoughtsTokenCount: 0
	};
	const toolCallIds = /* @__PURE__ */ new Set();
	for (const block of blocks) if (block.type === "toolCall") toolCallIds.add(block.id);
	const blockIndex = () => blocks.length - 1;
	const endCurrentBlock = () => {
		if (!currentBlock) return;
		if (currentBlock.type === "text") params.stream.push({
			type: "text_end",
			contentIndex: blockIndex(),
			content: currentBlock.text,
			partial: params.output
		});
		else params.stream.push({
			type: "thinking_end",
			contentIndex: blockIndex(),
			content: currentBlock.thinking,
			partial: params.output
		});
		currentBlock = null;
	};
	for await (const chunk of params.chunks) {
		notifyLlmRequestActivity(params.signal);
		params.output.responseId ||= chunk.responseId;
		const responseModel = chunk.modelVersion?.trim();
		if (responseModel && normalizeModelId(params.model.id) !== normalizeModelId(responseModel)) params.output.responseModel ||= responseModel;
		if (chunk.usageMetadata) {
			for (const field of [
				"promptTokenCount",
				"cachedContentTokenCount",
				"toolUsePromptTokenCount",
				"candidatesTokenCount",
				"thoughtsTokenCount"
			]) {
				const value = chunk.usageMetadata[field];
				if (typeof value === "number") knownUsage[field] = value;
			}
			const promptTokens = knownUsage.promptTokenCount;
			const cacheRead = knownUsage.cachedContentTokenCount;
			const toolUsePromptTokens = knownUsage.toolUsePromptTokenCount;
			const outputTokens = knownUsage.candidatesTokenCount + knownUsage.thoughtsTokenCount;
			params.output.usage = {
				input: Math.max(0, promptTokens - cacheRead) + toolUsePromptTokens,
				output: outputTokens,
				cacheRead,
				cacheWrite: 0,
				totalTokens: chunk.usageMetadata.totalTokenCount ?? promptTokens + outputTokens + toolUsePromptTokens,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			};
			calculateCost(params.model, params.output.usage);
		}
		const candidate = chunk.candidates?.[0];
		const promptFeedback = chunk.promptFeedback;
		if (!candidate && promptFeedback) {
			const blockReason = (preserveParts ? promptFeedback.blockReason : promptFeedback.blockReason?.trim() || void 0) ?? "PROMPT_BLOCKED";
			const blockMessage = promptFeedback.blockReasonMessage?.trim();
			if (preserveParts) {
				params.output.errorCode = blockReason;
				params.output.errorType = "google_prompt_blocked";
			}
			throw Object.assign(/* @__PURE__ */ new Error(`Google prompt blocked (${blockReason})${blockMessage ? `: ${blockMessage}` : ""}`), {
				code: blockReason,
				type: "google_prompt_blocked"
			});
		}
		if (candidate?.content?.parts) for (const [partIndex, part] of candidate.content.parts.entries()) {
			const text = part.text;
			const hasText = typeof text === "string";
			const hasThoughtSignature = typeof part.thoughtSignature === "string" && part.thoughtSignature.length > 0;
			const signatureOnly = preserveParts && hasThoughtSignature && (!hasText || text.length === 0) && Object.keys(part).every((key) => key === "thought" || key === "thoughtSignature" || key === "text");
			if (signatureOnly || !preserveParts && hasThoughtSignature && !part.functionCall) {
				if (!hasText && part.thought !== true) {
					const latestBlock = blocks.at(-1);
					if (latestBlock?.type === "toolCall" && (!preserveParts || partIndex === 0 && !latestBlock.thoughtSignature)) {
						latestBlock.thoughtSignature = retainThoughtSignature(latestBlock.thoughtSignature, part.thoughtSignature);
						continue;
					}
				}
				if (preserveParts) endCurrentBlock();
			}
			if (hasText || signatureOnly || !preserveParts && hasThoughtSignature && !part.functionCall) {
				if (preserveParts && currentBlock && (hasThoughtSignature || partIndex > 0)) {
					const currentSignature = currentBlock.type === "thinking" ? currentBlock.thinkingSignature : currentBlock.textSignature;
					if ((currentBlock.type === "thinking" ? currentBlock.thinking : currentBlock.text).length > 0 && (currentSignature !== part.thoughtSignature || partIndex > 0 && (currentSignature || hasThoughtSignature))) endCurrentBlock();
				}
				const isThinking = part.thought === true || !preserveParts && !hasText;
				if (!currentBlock || isThinking && currentBlock.type !== "thinking" || !isThinking && currentBlock.type !== "text") {
					endCurrentBlock();
					if (isThinking) {
						currentBlock = {
							type: "thinking",
							thinking: "",
							...preserveParts ? { thinkingSignature: void 0 } : {}
						};
						params.output.content.push(currentBlock);
						params.stream.push({
							type: "thinking_start",
							contentIndex: blockIndex(),
							partial: params.output
						});
					} else {
						currentBlock = {
							type: "text",
							text: ""
						};
						params.output.content.push(currentBlock);
						params.stream.push({
							type: "text_start",
							contentIndex: blockIndex(),
							partial: params.output
						});
					}
				}
				const delta = hasText ? text : "";
				if (currentBlock.type === "thinking") {
					appendAssistantThinking(currentBlock, delta);
					currentBlock.thinkingSignature = retainThoughtSignature(currentBlock.thinkingSignature, part.thoughtSignature);
					params.stream.push({
						type: "thinking_delta",
						contentIndex: blockIndex(),
						delta,
						partial: params.output
					});
				} else {
					currentBlock.text += delta;
					currentBlock.textSignature = retainThoughtSignature(currentBlock.textSignature, part.thoughtSignature);
					params.stream.push({
						type: "text_delta",
						contentIndex: blockIndex(),
						delta,
						partial: params.output
					});
				}
				if (signatureOnly) endCurrentBlock();
			}
			if (part.functionCall) {
				endCurrentBlock();
				const providedId = part.functionCall.id;
				const toolCall = {
					type: "toolCall",
					id: !providedId || toolCallIds.has(providedId) ? params.nextToolCallId(part.functionCall.name) : providedId,
					name: part.functionCall.name || "",
					arguments: part.functionCall.args ?? {},
					...part.thoughtSignature && { thoughtSignature: part.thoughtSignature }
				};
				params.output.content.push(toolCall);
				toolCallIds.add(toolCall.id);
				params.stream.push({
					type: "toolcall_start",
					contentIndex: blockIndex(),
					partial: params.output
				});
				params.stream.push({
					type: "toolcall_delta",
					contentIndex: blockIndex(),
					delta: JSON.stringify(toolCall.arguments),
					partial: params.output
				});
				params.stream.push({
					type: "toolcall_end",
					contentIndex: blockIndex(),
					toolCall,
					partial: params.output
				});
			}
		}
		if (candidate?.finishReason && candidate.finishReason !== "FINISH_REASON_UNSPECIFIED") {
			sawTerminalReason = true;
			params.output.stopReason = (params.resolveStopReason ?? mapStopReason)(candidate.finishReason);
			if (params.output.stopReason === "error") {
				const finishMessage = candidate.finishMessage?.trim();
				terminalGenerationError = Object.assign(/* @__PURE__ */ new Error(`Google generation stopped (${candidate.finishReason})${finishMessage ? `: ${finishMessage}` : ""}`), {
					code: candidate.finishReason,
					type: "google_generation_failed"
				});
			}
			if (params.output.stopReason === "stop" && params.output.content.some((block) => block.type === "toolCall")) params.output.stopReason = "toolUse";
		}
	}
	endCurrentBlock();
	if (params.signal?.aborted) throw transportAbortError(params.signal);
	if (terminalGenerationError) {
		if (preserveParts) {
			params.output.errorCode = terminalGenerationError.code;
			params.output.errorType = terminalGenerationError.type;
		}
		throw terminalGenerationError;
	}
	if (!sawTerminalReason) {
		if (preserveParts) {
			params.output.errorCode = "STREAM_INCOMPLETE";
			params.output.errorType = "google_incomplete_stream";
		}
		throw Object.assign(/* @__PURE__ */ new Error("Google stream ended before a terminal finish reason"), {
			code: "STREAM_INCOMPLETE",
			type: "google_incomplete_stream"
		});
	}
	if (params.output.stopReason === "aborted" || params.output.stopReason === "error") throw new Error("An unknown error occurred");
	params.stream.push({
		type: "done",
		reason: params.output.stopReason,
		message: params.output
	});
	params.stream.end();
}
//#endregion
//#region packages/ai/src/providers/google-messages.ts
const GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP = "skip_thought_signature_validator";
function resolveThoughtSignature(value) {
	return value && value.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(value) ? value : void 0;
}
function stableStringifyGoogleToolCallValue(value) {
	if (Array.isArray(value)) return `[${value.map((item) => stableStringifyGoogleToolCallValue(item)).join(",")}]`;
	if (value && typeof value === "object") return `{${Object.keys(value).toSorted().map((key) => `${JSON.stringify(key)}:${stableStringifyGoogleToolCallValue(Reflect.get(value, key))}`).join(",")}}`;
	return JSON.stringify(value);
}
function sanitizeGeminiThoughtSignature(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(trimmed) ? trimmed : void 0;
}
function toolCallThoughtSignatureReplayKey(id, name, args) {
	return [
		id,
		name,
		stableStringifyGoogleToolCallValue(args)
	].join("\0");
}
function requiresGoogleToolCallId(modelId) {
	return modelId.startsWith("claude-") || modelId.startsWith("gpt-oss-");
}
function getGeminiMajorVersion(modelId) {
	const match = modelId.toLowerCase().match(/(?:^|\/)gemini(?:-live)?-(\d+)/);
	if (!match) return;
	const majorVersion = match.at(1);
	return majorVersion === void 0 ? void 0 : Number.parseInt(majorVersion, 10);
}
function supportsMultimodalFunctionResponse(modelId) {
	const geminiMajorVersion = getGeminiMajorVersion(modelId);
	if (geminiMajorVersion !== void 0) return geminiMajorVersion >= 3;
	return true;
}
/** Project a prepared transcript; route repair and trusted video admission remain caller-owned. */
function projectGoogleMessages(params) {
	const { model, messages: transformedMessages } = params;
	const managed = params.replay === "managed";
	const sanitizeText = managed ? sanitizeTransportPayloadText : sanitizeSurrogates;
	const signature = managed ? sanitizeGeminiThoughtSignature : resolveThoughtSignature;
	const replaySignatures = /* @__PURE__ */ new Map();
	const contents = [];
	const pendingToolResultImageTurns = [];
	const sameRouteToolCallIds = /* @__PURE__ */ new Set();
	let activeToolResultParts;
	const flushToolResultRun = () => {
		contents.push(...pendingToolResultImageTurns);
		pendingToolResultImageTurns.length = 0;
		activeToolResultParts = void 0;
	};
	for (const msg of transformedMessages) {
		if (msg.role !== "toolResult") flushToolResultRun();
		if (msg.role === "user") {
			if (typeof msg.content === "string") contents.push({
				role: "user",
				parts: [{ text: sanitizeText(msg.content) || " " }]
			});
			else {
				const parts = msg.content.map((item) => {
					if (item.type === "text") return { text: sanitizeText(item.text) || " " };
					if (managed && item.type === "video") return params.videoPart?.(item) ?? { text: "(video omitted: native video slot unavailable)" };
					return { inlineData: {
						mimeType: item.mimeType,
						data: item.data
					} };
				});
				const visibleParts = managed && !model.input.includes("image") ? parts.filter((part) => !part.inlineData) : parts;
				if (visibleParts.length === 0) visibleParts.push({ text: " " });
				contents.push({
					role: "user",
					parts: visibleParts
				});
			}
		} else if (msg.role === "assistant") {
			const parts = [];
			let sawFunctionCall = false;
			const nextReplaySignatures = /* @__PURE__ */ new Map();
			const isSameProviderAndModel = msg.provider === model.provider && msg.api === model.api && msg.model === model.id;
			for (const block of msg.content) if (block.type === "text") {
				const thoughtSignature = isSameProviderAndModel ? signature(block.textSignature) : void 0;
				if ((!block.text || block.text.trim() === "") && (managed || !thoughtSignature)) continue;
				parts.push({
					text: sanitizeText(block.text),
					...thoughtSignature && { thoughtSignature }
				});
			} else if (block.type === "thinking") {
				const thoughtSignature = isSameProviderAndModel ? signature(block.thinkingSignature) : void 0;
				if ((!block.thinking || block.thinking.trim() === "") && (managed || !thoughtSignature)) continue;
				if (isSameProviderAndModel) parts.push({
					thought: true,
					text: sanitizeText(block.thinking),
					...thoughtSignature && { thoughtSignature }
				});
				else parts.push({ text: sanitizeText(block.thinking) });
			} else if (block.type === "toolCall") {
				if (isSameProviderAndModel && (managed || model.provider !== "google-gemini-cli")) sameRouteToolCallIds.add(block.id);
				const args = coerceTransportToolCallArguments(block.arguments);
				const ownSignature = isSameProviderAndModel ? signature(block.thoughtSignature) : void 0;
				const replayKey = managed && (ownSignature || params.requiresToolCallSignature && isSameProviderAndModel && replaySignatures.size > 0) ? toolCallThoughtSignatureReplayKey(block.id, block.name, args) : "";
				if (managed && ownSignature) nextReplaySignatures.set(replayKey, ownSignature);
				const thoughtSignature = ownSignature ?? (managed && params.requiresToolCallSignature && isSameProviderAndModel ? replaySignatures.get(replayKey) : void 0) ?? (params.requiresToolCallSignature && (managed || !sawFunctionCall) ? GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP : void 0);
				sawFunctionCall = true;
				const part = {
					functionCall: {
						name: block.name,
						args,
						...(managed ? isSameProviderAndModel : sameRouteToolCallIds.has(block.id)) || requiresGoogleToolCallId(model.id) ? { id: block.id } : {}
					},
					...thoughtSignature && { thoughtSignature }
				};
				parts.push(part);
			}
			for (const [key, value] of nextReplaySignatures) replaySignatures.set(key, value);
			if (parts.length === 0) continue;
			contents.push({
				role: "model",
				parts
			});
		} else if (msg.role === "toolResult") {
			const textResult = extractToolResultText(msg.content);
			const imageContent = model.input.includes("image") ? msg.content.filter((item) => managed ? item.type === "image" && describeToolResultMediaPlaceholder([item]) !== void 0 : isImageWithMediaPayload(item)) : [];
			const hasText = textResult.length > 0;
			const hasImages = imageContent.length > 0;
			const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
			const modelSupportsMultimodalFunctionResponse = supportsMultimodalFunctionResponse(model.id);
			const responseValue = hasText ? sanitizeText(textResult) : mediaPlaceholder ?? "";
			const imageParts = imageContent.map((imageBlock) => ({ inlineData: {
				mimeType: imageBlock.mimeType,
				data: imageBlock.data
			} }));
			const includeId = sameRouteToolCallIds.has(msg.toolCallId) || requiresGoogleToolCallId(model.id);
			const functionResponsePart = { functionResponse: {
				name: msg.toolName,
				response: msg.isError ? { error: responseValue } : { output: responseValue },
				...hasImages && modelSupportsMultimodalFunctionResponse && { parts: imageParts },
				...includeId ? { id: msg.toolCallId } : {}
			} };
			if (activeToolResultParts) activeToolResultParts.push(functionResponsePart);
			else {
				activeToolResultParts = [functionResponsePart];
				contents.push({
					role: "user",
					parts: activeToolResultParts
				});
			}
			if (hasImages && !modelSupportsMultimodalFunctionResponse) pendingToolResultImageTurns.push({
				role: "user",
				parts: [{ text: "Tool result image:" }, ...imageParts]
			});
		}
	}
	flushToolResultRun();
	if (contents.length === 0) contents.push({
		role: "user",
		parts: [{ text: " " }]
	});
	return contents;
}
/**
* Convert tools to Gemini function declarations format.
* @internal Directly tested provider implementation detail.
*/
function convertGoogleTools(tools) {
	if (tools.length === 0) return;
	return [{ functionDeclarations: sortPromptCacheToolsByName(tools).map((tool) => ({
		name: tool.name,
		description: tool.description,
		parametersJsonSchema: tool.parameters
	})) }];
}
//#endregion
export { googleFlashSupportsMinimalThinking as a, consumeGoogleGenerateContentStream as i, projectGoogleMessages as n, requiresGoogleToolCallId as r, convertGoogleTools as t };
