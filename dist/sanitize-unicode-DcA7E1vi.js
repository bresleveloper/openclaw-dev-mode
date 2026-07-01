import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { c as resolveClaudeModelIdentity, l as resolveClaudeNativeThinkingLevelMap, s as resolveClaudeFable5ModelIdentity } from "./src-M7TBQdDX.js";
//#region src/llm/model-utils.ts
/** Calculates and stores model cost fields from token usage and per-million pricing. */
function calculateCost(model, usage) {
	usage.cost.input = model.cost.input / 1e6 * usage.input;
	usage.cost.output = model.cost.output / 1e6 * usage.output;
	usage.cost.cacheRead = model.cost.cacheRead / 1e6 * usage.cacheRead;
	usage.cost.cacheWrite = model.cost.cacheWrite / 1e6 * usage.cacheWrite;
	usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
	return usage.cost;
}
const EXTENDED_THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
function resolveThinkingLevelMap(model) {
	return model.api === "anthropic-messages" ? resolveClaudeNativeThinkingLevelMap(model) ?? model.thinkingLevelMap : model.thinkingLevelMap;
}
/** Returns thinking levels exposed by a reasoning-capable model. */
function getSupportedThinkingLevels(model) {
	const fableContract = model.api === "anthropic-messages" && resolveClaudeFable5ModelIdentity(model) !== void 0;
	if (!model.reasoning && !fableContract) return ["off"];
	const thinkingLevelMap = resolveThinkingLevelMap(model);
	return EXTENDED_THINKING_LEVELS.filter((level) => {
		const mapped = thinkingLevelMap?.[level];
		if (mapped === null) return false;
		if (level === "xhigh" || level === "max") return mapped !== void 0;
		return true;
	});
}
/** Clamps a requested thinking level to the closest supported level for a model. */
function clampThinkingLevel(model, level) {
	const availableLevels = getSupportedThinkingLevels(model);
	if (availableLevels.includes(level)) return level;
	const requestedIndex = EXTENDED_THINKING_LEVELS.indexOf(level);
	if (requestedIndex === -1) return availableLevels[0] ?? "off";
	const thinkingLevelMap = resolveThinkingLevelMap(model);
	if ((level === "xhigh" || level === "max") && thinkingLevelMap?.[level] === null) for (let i = requestedIndex - 1; i >= 0; i--) {
		const candidate = EXTENDED_THINKING_LEVELS[i];
		if (availableLevels.includes(candidate)) return candidate;
	}
	for (let i = requestedIndex; i < EXTENDED_THINKING_LEVELS.length; i++) {
		const candidate = EXTENDED_THINKING_LEVELS[i];
		if (availableLevels.includes(candidate)) return candidate;
	}
	for (let i = requestedIndex - 1; i >= 0; i--) {
		const candidate = EXTENDED_THINKING_LEVELS[i];
		if (availableLevels.includes(candidate)) return candidate;
	}
	return availableLevels[0] ?? "off";
}
/** Compares model identity by provider and id. */
function modelsAreEqual(a, b) {
	if (!a || !b) return false;
	return a.id === b.id && a.provider === b.provider;
}
//#endregion
//#region src/llm/providers/simple-options.ts
function buildBaseOptions(model, options, apiKey) {
	return {
		temperature: options?.temperature,
		maxTokens: options?.maxTokens,
		stop: options?.stop,
		signal: options?.signal,
		apiKey: apiKey || options?.apiKey,
		transport: options?.transport,
		cacheRetention: options?.cacheRetention,
		sessionId: options?.sessionId,
		promptCacheKey: options?.promptCacheKey,
		headers: options?.headers,
		onPayload: options?.onPayload,
		onResponse: options?.onResponse,
		timeoutMs: options?.timeoutMs,
		maxRetries: options?.maxRetries,
		maxRetryDelayMs: options?.maxRetryDelayMs,
		metadata: options?.metadata
	};
}
function clampReasoning(effort) {
	return effort === "xhigh" ? "high" : effort;
}
function adjustMaxTokensForThinking(baseMaxTokens, modelMaxTokens, reasoningLevel, customBudgets) {
	const budgets = {
		minimal: 1024,
		low: 2048,
		medium: 8192,
		high: 16384,
		max: 32768,
		...customBudgets
	};
	const minOutputTokens = 1024;
	let thinkingBudget = budgets[clampReasoning(reasoningLevel)];
	const maxTokens = baseMaxTokens === void 0 ? modelMaxTokens : Math.min(baseMaxTokens + thinkingBudget, modelMaxTokens);
	if (maxTokens <= thinkingBudget) thinkingBudget = Math.max(0, maxTokens - minOutputTokens);
	return {
		maxTokens,
		thinkingBudget
	};
}
//#endregion
//#region src/shared/anthropic-model-contract.ts
function normalizeModelId(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
function normalizeApi(api) {
	const normalized = normalizeLowercaseStringOrEmpty(api);
	return normalized === "openclaw-anthropic-messages-transport" ? "anthropic-messages" : normalized;
}
function hasConcreteResponseModel(ref) {
	const responseModelId = normalizeModelId(ref.responseModelId);
	return responseModelId.length > 0 && responseModelId !== normalizeModelId(ref.modelId);
}
function usesClaudeFable5MessagesContract(model) {
	return normalizeApi(model.api) === "anthropic-messages" && resolveClaudeFable5ModelIdentity(model) !== void 0;
}
function requiresClaudeAdaptiveThinking(model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return false;
	const modelId = resolveClaudeModelIdentity(model);
	return resolveClaudeFable5ModelIdentity(model) !== void 0 || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
function resolveReplayFableIdentity(ref) {
	if (normalizeApi(ref.api) !== "anthropic-messages") return;
	if (hasConcreteResponseModel(ref)) return resolveClaudeFable5ModelIdentity({ id: ref.responseModelId });
	return resolveClaudeFable5ModelIdentity({
		id: ref.modelId,
		params: ref.modelParams
	});
}
function resolveModelBoundThinkingReplayMode(params) {
	const sourceApi = normalizeApi(params.source.api);
	const targetApi = normalizeApi(params.target.api);
	const sourceIdentity = resolveReplayFableIdentity(params.source);
	const targetIdentity = resolveReplayFableIdentity(params.target);
	const sameRoute = normalizeLowercaseStringOrEmpty(params.source.provider) === normalizeLowercaseStringOrEmpty(params.target.provider) && sourceApi === targetApi && normalizeModelId(params.source.modelId) === normalizeModelId(params.target.modelId);
	if (!sourceIdentity && !targetIdentity) return "default";
	if (!sourceIdentity && !hasConcreteResponseModel(params.source) && targetIdentity && sameRoute) return "preserve";
	return sourceApi === targetApi && sourceIdentity === targetIdentity ? "preserve" : "drop";
}
//#endregion
//#region src/llm/providers/transform-messages.ts
const NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
const NON_VISION_TOOL_IMAGE_PLACEHOLDER = "(tool image omitted: model does not support images)";
function replaceImagesWithPlaceholder(content, placeholder) {
	const result = [];
	let previousWasPlaceholder = false;
	for (const block of content) {
		if (block.type === "image") {
			if (!previousWasPlaceholder) result.push({
				type: "text",
				text: placeholder
			});
			previousWasPlaceholder = true;
			continue;
		}
		result.push(block);
		previousWasPlaceholder = block.text === placeholder;
	}
	return result;
}
function downgradeUnsupportedImages(messages, model) {
	if (model.input.includes("image")) return messages;
	return messages.map((msg) => {
		if (msg.role === "user" && Array.isArray(msg.content)) return {
			...msg,
			content: replaceImagesWithPlaceholder(msg.content, NON_VISION_USER_IMAGE_PLACEHOLDER)
		};
		if (msg.role === "toolResult") return {
			...msg,
			content: replaceImagesWithPlaceholder(msg.content, NON_VISION_TOOL_IMAGE_PLACEHOLDER)
		};
		return msg;
	});
}
/**
* Normalize tool call ID for cross-provider compatibility.
* OpenAI Responses API generates IDs that are 450+ chars with special characters like `|`.
* Anthropic APIs require IDs matching ^[a-zA-Z0-9_-]+$ (max 64 chars).
*/
function transformMessages(messages, model, normalizeToolCallId) {
	const toolCallIdMap = /* @__PURE__ */ new Map();
	const transformed = downgradeUnsupportedImages(messages, model).map((msg) => {
		if (msg.role === "user") return msg;
		if (msg.role === "toolResult") {
			const normalizedId = toolCallIdMap.get(msg.toolCallId);
			if (normalizedId && normalizedId !== msg.toolCallId) return Object.assign({}, msg, { toolCallId: normalizedId });
			return msg;
		}
		if (msg.role === "assistant") {
			const assistantMsg = msg;
			const modelBoundThinkingReplayMode = resolveModelBoundThinkingReplayMode({
				source: {
					provider: assistantMsg.provider,
					api: assistantMsg.api,
					modelId: assistantMsg.model,
					responseModelId: assistantMsg.responseModel
				},
				target: {
					provider: model.provider,
					api: model.api,
					modelId: model.id,
					modelParams: model.params
				}
			});
			const isSameModel = modelBoundThinkingReplayMode === "preserve" || assistantMsg.provider === model.provider && assistantMsg.api === model.api && assistantMsg.model === model.id;
			const transformedContent = (Array.isArray(assistantMsg.content) ? assistantMsg.content : [{
				type: "text",
				text: assistantMsg.content
			}]).flatMap((block) => {
				if (block.type === "thinking") {
					if (modelBoundThinkingReplayMode === "drop") return [];
					if (block.redacted) return isSameModel ? block : [];
					if (isSameModel && block.thinkingSignature) return block;
					if (!block.thinking || block.thinking.trim() === "") return [];
					if (isSameModel) return block;
					return {
						type: "text",
						text: block.thinking
					};
				}
				if (block.type === "text") {
					if (isSameModel) return block;
					return {
						type: "text",
						text: block.text
					};
				}
				if (block.type === "toolCall") {
					const toolCall = block;
					let normalizedToolCall = toolCall;
					if (!isSameModel && toolCall.thoughtSignature) {
						normalizedToolCall = Object.assign({}, toolCall);
						delete normalizedToolCall.thoughtSignature;
					}
					if (!isSameModel && normalizeToolCallId) {
						const normalizedId = normalizeToolCallId(toolCall.id, model, assistantMsg);
						if (normalizedId !== toolCall.id) {
							toolCallIdMap.set(toolCall.id, normalizedId);
							normalizedToolCall = Object.assign({}, normalizedToolCall, { id: normalizedId });
						}
					}
					return normalizedToolCall;
				}
				return block;
			});
			return Object.assign({}, assistantMsg, { content: transformedContent });
		}
		return msg;
	});
	const result = [];
	let pendingToolCalls = [];
	let existingToolResultIds = /* @__PURE__ */ new Set();
	const insertSyntheticToolResults = () => {
		if (pendingToolCalls.length > 0) {
			for (const tc of pendingToolCalls) if (!existingToolResultIds.has(tc.id)) result.push({
				role: "toolResult",
				toolCallId: tc.id,
				toolName: tc.name,
				content: [{
					type: "text",
					text: "No result provided"
				}],
				isError: true,
				timestamp: Date.now()
			});
			pendingToolCalls = [];
			existingToolResultIds = /* @__PURE__ */ new Set();
		}
	};
	for (const msg of transformed) if (msg.role === "assistant") {
		insertSyntheticToolResults();
		const assistantMsg = msg;
		if (assistantMsg.stopReason === "error" || assistantMsg.stopReason === "aborted") continue;
		const toolCalls = assistantMsg.content.filter((b) => b.type === "toolCall");
		if (toolCalls.length > 0) {
			pendingToolCalls = toolCalls;
			existingToolResultIds = /* @__PURE__ */ new Set();
		}
		result.push(msg);
	} else if (msg.role === "toolResult") {
		existingToolResultIds.add(msg.toolCallId);
		result.push(msg);
	} else if (msg.role === "user") {
		insertSyntheticToolResults();
		result.push(msg);
	} else result.push(msg);
	insertSyntheticToolResults();
	return result;
}
//#endregion
//#region src/llm/utils/sanitize-unicode.ts
/**
* Removes unpaired Unicode surrogate characters from a string.
*
* Unpaired surrogates (high surrogates 0xD800-0xDBFF without matching low surrogates 0xDC00-0xDFFF,
* or vice versa) cause JSON serialization errors in many API providers.
*
* Valid emoji and other characters outside the Basic Multilingual Plane use properly paired
* surrogates and will NOT be affected by this function.
*
* @param text - The text to sanitize
* @returns The sanitized text with unpaired surrogates removed
*
* @example
* // Valid emoji (properly paired surrogates) are preserved
* sanitizeSurrogates("Hello 🙈 World") // => "Hello 🙈 World"
*
* // Unpaired high surrogate is removed
* const unpaired = String.fromCharCode(0xD83D); // high surrogate without low
* sanitizeSurrogates(`Text ${unpaired} here`) // => "Text  here"
*/
function sanitizeSurrogates(text) {
	return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
}
//#endregion
export { usesClaudeFable5MessagesContract as a, clampReasoning as c, getSupportedThinkingLevels as d, modelsAreEqual as f, resolveModelBoundThinkingReplayMode as i, calculateCost as l, transformMessages as n, adjustMaxTokensForThinking as o, requiresClaudeAdaptiveThinking as r, buildBaseOptions as s, sanitizeSurrogates as t, clampThinkingLevel as u };
