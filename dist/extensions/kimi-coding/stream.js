import { isKimiK3ModelId } from "./provider-policy-api.js";
import { isRecord, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { streamSimple } from "openclaw/plugin-sdk/llm";
import { normalizeOpenAICompatibleReasoningReplay, streamWithPayloadPatch } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/kimi-coding/stream.ts
const TOOL_CALLS_SECTION_BEGIN = "<|tool_calls_section_begin|>";
const TOOL_CALLS_SECTION_END = "<|tool_calls_section_end|>";
const TOOL_CALL_BEGIN = "<|tool_call_begin|>";
const TOOL_CALL_ARGUMENT_BEGIN = "<|tool_call_argument_begin|>";
const TOOL_CALL_END = "<|tool_call_end|>";
const KIMI_ANTHROPIC_THINKING_BUDGETS = {
	minimal: 1024,
	low: 1024,
	medium: 4096,
	high: 8192,
	adaptive: 8192,
	xhigh: 8192,
	max: 8192
};
const KIMI_ANTHROPIC_VISIBLE_OUTPUT_RESERVE_TOKENS = 1024;
const KIMI_ANTHROPIC_MIN_OUTPUT_TOKENS = 16e3;
const KIMI_K3_THINKING_EFFORTS = {
	minimal: "low",
	low: "low",
	medium: "high",
	high: "high",
	adaptive: "high",
	xhigh: "max",
	max: "max"
};
function normalizeKimiThinkingBudgetTokens(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const normalized = Math.floor(value);
	return normalized >= 1024 ? normalized : void 0;
}
function normalizeKimiAnthropicMaxTokens(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const normalized = Math.floor(value);
	return normalized > 0 ? normalized : void 0;
}
function ensureKimiAnthropicMaxTokens(payloadObj, thinkingConfig) {
	if (thinkingConfig.type !== "enabled" || thinkingConfig.budget_tokens === void 0) return;
	const required = Math.max(KIMI_ANTHROPIC_MIN_OUTPUT_TOKENS, thinkingConfig.budget_tokens + KIMI_ANTHROPIC_VISIBLE_OUTPUT_RESERVE_TOKENS);
	const current = normalizeKimiAnthropicMaxTokens(payloadObj.max_tokens);
	payloadObj.max_tokens = current === void 0 ? required : Math.max(current, required);
}
function normalizeKimiThinkingType(value) {
	if (typeof value === "boolean") return value ? "enabled" : "disabled";
	if (typeof value === "string") {
		const normalized = normalizeOptionalLowercaseString(value);
		if (!normalized) return;
		if ([
			"enabled",
			"enable",
			"on",
			"true"
		].includes(normalized)) return "enabled";
		if ([
			"disabled",
			"disable",
			"off",
			"false"
		].includes(normalized)) return "disabled";
		return;
	}
	if (isRecord(value)) return normalizeKimiThinkingType(value.type);
}
function normalizeKimiThinkingConfig(value) {
	const type = normalizeKimiThinkingType(value);
	if (!type) return;
	if (type === "disabled") return { type: "disabled" };
	if (!isRecord(value)) return { type: "enabled" };
	const budgetTokens = normalizeKimiThinkingBudgetTokens(value.budget_tokens ?? value.budgetTokens);
	return budgetTokens === void 0 ? { type: "enabled" } : {
		type: "enabled",
		budget_tokens: budgetTokens
	};
}
function resolveKimiThinkingConfig(configured, thinkingLevel) {
	const levelBudgetTokens = thinkingLevel && thinkingLevel !== "off" ? KIMI_ANTHROPIC_THINKING_BUDGETS[thinkingLevel] : void 0;
	if (configured) return configured.type === "enabled" && configured.budget_tokens === void 0 ? {
		type: "enabled",
		budget_tokens: levelBudgetTokens ?? 1024
	} : configured;
	if (!thinkingLevel || thinkingLevel === "off") return { type: "disabled" };
	return levelBudgetTokens === void 0 ? { type: "enabled" } : {
		type: "enabled",
		budget_tokens: levelBudgetTokens
	};
}
function stripTaggedToolCallCounter(value) {
	return value.trim().replace(/:\d+$/, "");
}
function parseKimiTaggedToolCalls(text) {
	const trimmed = text.trim();
	if (!trimmed.startsWith(TOOL_CALLS_SECTION_BEGIN) || !trimmed.endsWith(TOOL_CALLS_SECTION_END)) return null;
	let cursor = 28;
	const sectionEndIndex = trimmed.length - 26;
	const toolCalls = [];
	while (cursor < sectionEndIndex) {
		while (cursor < sectionEndIndex && /\s/.test(trimmed[cursor] ?? "")) cursor += 1;
		if (cursor >= sectionEndIndex) break;
		if (!trimmed.startsWith(TOOL_CALL_BEGIN, cursor)) return null;
		const nameStart = cursor + 19;
		const argMarkerIndex = trimmed.indexOf(TOOL_CALL_ARGUMENT_BEGIN, nameStart);
		if (argMarkerIndex < 0 || argMarkerIndex >= sectionEndIndex) return null;
		const rawId = trimmed.slice(nameStart, argMarkerIndex).trim();
		if (!rawId) return null;
		const argsStart = argMarkerIndex + 28;
		const callEndIndex = trimmed.indexOf(TOOL_CALL_END, argsStart);
		if (callEndIndex < 0 || callEndIndex > sectionEndIndex) return null;
		const rawArgs = trimmed.slice(argsStart, callEndIndex).trim();
		let parsedArgs;
		try {
			parsedArgs = JSON.parse(rawArgs);
		} catch {
			return null;
		}
		if (!isRecord(parsedArgs)) return null;
		const name = stripTaggedToolCallCounter(rawId);
		if (!name) return null;
		toolCalls.push({
			type: "toolCall",
			id: rawId,
			name,
			arguments: parsedArgs
		});
		cursor = callEndIndex + 17;
	}
	return toolCalls.length > 0 ? toolCalls : null;
}
function rewriteKimiTaggedToolCallsInMessage(message) {
	if (!message || typeof message !== "object") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	let changed = false;
	const nextContent = [];
	for (const block of content) {
		if (!block || typeof block !== "object") {
			nextContent.push(block);
			continue;
		}
		const typedBlock = block;
		if (typedBlock.type !== "text" || typeof typedBlock.text !== "string") {
			nextContent.push(block);
			continue;
		}
		const parsed = parseKimiTaggedToolCalls(typedBlock.text);
		if (!parsed) {
			nextContent.push(block);
			continue;
		}
		nextContent.push(...parsed);
		changed = true;
	}
	if (!changed) return;
	message.content = nextContent;
	const typedMessage = message;
	if (typedMessage.stopReason === "stop") typedMessage.stopReason = "toolUse";
}
function transformKimiStreamEvent(value, transformMessage) {
	const event = value && typeof value === "object" ? value : void 0;
	if (!event) return;
	for (const message of [event.partial, event.message]) transformMessage(message);
}
function wrapStreamMessageObjects(stream, transformMessage) {
	const readFinalMessage = stream.result.bind(stream);
	Object.assign(stream, { async result() {
		const message = await readFinalMessage();
		transformMessage(message);
		return message;
	} });
	const createIterator = stream[Symbol.asyncIterator].bind(stream);
	stream[Symbol.asyncIterator] = () => {
		const iterator = createIterator();
		return {
			async next() {
				const step = await iterator.next();
				if (!step.done) transformKimiStreamEvent(step.value, transformMessage);
				return step;
			},
			async return(value) {
				return iterator.return?.(value) ?? {
					done: true,
					value: void 0
				};
			},
			async throw(error) {
				return iterator.throw?.(error) ?? {
					done: true,
					value: void 0
				};
			}
		};
	};
	return stream;
}
function createKimiToolCallMarkupWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const maybeStream = underlying(model, context, options);
		if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) return Promise.resolve(maybeStream).then((stream) => wrapStreamMessageObjects(stream, rewriteKimiTaggedToolCallsInMessage));
		return wrapStreamMessageObjects(maybeStream, rewriteKimiTaggedToolCallsInMessage);
	};
}
function wrapKimiProviderStream(ctx) {
	const configured = normalizeKimiThinkingConfig(ctx.extraParams?.thinking);
	const underlying = ctx.streamFn ?? streamSimple;
	return createKimiToolCallMarkupWrapper((model, context, options) => {
		const anthropic = (ctx.sourceApi ?? model.api) === "anthropic-messages";
		const k3 = anthropic && isKimiK3ModelId(model.id);
		const thinkingLevel = options?.reasoning ?? ctx.thinkingLevel ?? (k3 ? "high" : void 0);
		const thinkingConfig = resolveKimiThinkingConfig(configured, thinkingLevel);
		const enabledLevel = thinkingLevel && thinkingLevel !== "off" ? thinkingLevel : k3 ? "high" : "low";
		const nativeLevel = enabledLevel === "adaptive" ? "high" : enabledLevel;
		const reasoning = thinkingConfig.type === "disabled" ? "off" : k3 ? KIMI_K3_THINKING_EFFORTS[nativeLevel] : nativeLevel;
		const runtimeModel = k3 ? {
			...model,
			compat: {
				...model.compat,
				allowEmptySignature: true
			}
		} : model;
		return streamWithPayloadPatch(underlying, runtimeModel, context, {
			...options,
			reasoning
		}, (payloadObj) => {
			delete payloadObj.reasoning;
			delete payloadObj.reasoning_effort;
			delete payloadObj.reasoningEffort;
			stripAnthropicCacheControlMarkers(payloadObj);
			if (k3) {
				const outputConfig = isRecord(payloadObj.output_config) ? { ...payloadObj.output_config } : {};
				if (thinkingConfig.type === "disabled") {
					payloadObj.thinking = { type: "disabled" };
					delete outputConfig.effort;
				} else {
					payloadObj.thinking = {
						type: "adaptive",
						display: "summarized"
					};
					outputConfig.effort = reasoning;
				}
				if (Object.keys(outputConfig).length > 0) payloadObj.output_config = outputConfig;
				else delete payloadObj.output_config;
				return;
			}
			payloadObj.thinking = anthropic ? { ...thinkingConfig } : { type: thinkingConfig.type };
			if (anthropic) ensureKimiAnthropicMaxTokens(payloadObj, thinkingConfig);
			else normalizeOpenAICompatibleReasoningReplay(payloadObj, {
				thinkingEnabled: thinkingConfig.type === "enabled",
				shouldBackfillAssistantMessage: (message) => Array.isArray(message.tool_calls) && message.tool_calls.length > 0
			});
		});
	});
}
function stripContentBlockCacheControl(block) {
	if (!block || typeof block !== "object") return;
	const record = block;
	delete record.cache_control;
	if (record.type === "tool_result" && Array.isArray(record.content)) for (const nestedBlock of record.content) stripContentBlockCacheControl(nestedBlock);
}
function stripContentArrayCacheControl(value) {
	if (!Array.isArray(value)) return;
	for (const block of value) stripContentBlockCacheControl(block);
}
function stripAnthropicCacheControlMarkers(payloadObj) {
	stripContentArrayCacheControl(payloadObj.system);
	if (!Array.isArray(payloadObj.messages)) return;
	for (const message of payloadObj.messages) {
		if (!message || typeof message !== "object") continue;
		stripContentArrayCacheControl(message.content);
	}
}
//#endregion
export { wrapKimiProviderStream };
