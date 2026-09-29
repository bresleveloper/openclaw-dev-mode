import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
//#region src/llm/providers/stream-wrappers/moonshot-thinking.ts
const loadDefaultStream = createLazyRuntimeModule(() => import("./stream-BlGgT506.mjs"));
const MOONSHOT_ALWAYS_THINKING = {
	"kimi-k2.7-code": "low",
	"kimi-k2.7-code-highspeed": "low",
	"kimi-k3": "max"
};
const FIXED_SAMPLING_FIELDS = "temperature top_p n presence_penalty frequency_penalty".split(" ");
function normalizeMoonshotThinkingType(value) {
	const type = asOptionalRecord(value)?.type ?? value;
	if (typeof type === "boolean") return type ? "enabled" : "disabled";
	const normalized = normalizeOptionalLowercaseString(type);
	if ([
		"enabled",
		"enable",
		"on",
		"true"
	].includes(normalized ?? "")) return "enabled";
	if ([
		"disabled",
		"disable",
		"off",
		"false"
	].includes(normalized ?? "")) return "disabled";
}
function isMoonshotToolChoiceCompatible(toolChoice) {
	const type = asOptionalRecord(toolChoice)?.type ?? toolChoice;
	return type == null || type === "auto" || type === "none";
}
function ensureMoonshotToolCallReasoningContent(payload) {
	const messages = Array.isArray(payload.messages) ? payload.messages : [];
	for (const message of messages) {
		const record = asOptionalRecord(message);
		if (record?.role !== "assistant" || !Array.isArray(record.tool_calls)) continue;
		if (record.tool_calls.length > 0 && !("reasoning_content" in record)) record.reasoning_content = "";
	}
}
function resolveAlwaysThinkingEffort(modelId, directMoonshotModel) {
	const effort = MOONSHOT_ALWAYS_THINKING[modelId];
	return effort && (modelId !== "kimi-k3" || directMoonshotModel) ? effort : void 0;
}
function sanitizeAlwaysThinkingPayload(payload, effort) {
	delete payload.thinking;
	delete payload.reasoningEffort;
	FIXED_SAMPLING_FIELDS.forEach((field) => Reflect.deleteProperty(payload, field));
	if (effort === "max") payload.reasoning_effort = effort;
	else {
		delete payload.reasoning_effort;
		if (!isMoonshotToolChoiceCompatible(payload.tool_choice)) payload.tool_choice = "auto";
	}
}
function prepareThinkingPayload(payload, modelId, directMoonshotModel, thinkingType, thinkingKeep) {
	const payloadModelId = typeof payload.model === "string" ? payload.model.trim().toLowerCase() : modelId;
	let effectiveThinkingType = normalizeMoonshotThinkingType(payload.thinking);
	if (thinkingType) {
		payload.thinking = { type: thinkingType };
		effectiveThinkingType = thinkingType;
	}
	const effort = resolveAlwaysThinkingEffort(payloadModelId, directMoonshotModel);
	if (effort) {
		sanitizeAlwaysThinkingPayload(payload, effort);
		return (finalPayload) => {
			sanitizeAlwaysThinkingPayload(finalPayload, effort);
			ensureMoonshotToolCallReasoningContent(finalPayload);
		};
	}
	if (effectiveThinkingType === "enabled" && !isMoonshotToolChoiceCompatible(payload.tool_choice)) {
		const toolChoiceType = asOptionalRecord(payload.tool_choice)?.type;
		if (payload.tool_choice === "required") payload.tool_choice = "auto";
		else if (toolChoiceType === "tool" || toolChoiceType === "function") {
			payload.thinking = { type: "disabled" };
			effectiveThinkingType = "disabled";
		}
	}
	const thinking = asOptionalRecord(payload.thinking);
	const preserveKeep = payloadModelId === "kimi-k2.6" && effectiveThinkingType === "enabled" && thinkingKeep === "all";
	if (thinking) {
		delete thinking.keep;
		Object.assign(thinking, preserveKeep ? { keep: "all" } : {});
	}
	return effectiveThinkingType === "enabled" ? ensureMoonshotToolCallReasoningContent : () => void 0;
}
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
function resolveMoonshotThinkingType(params) {
	return normalizeMoonshotThinkingType(params.configuredThinking) ?? (params.thinkingLevel ? params.thinkingLevel === "off" ? "disabled" : "enabled" : void 0);
}
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
function resolveMoonshotThinkingKeep(params) {
	return normalizeOptionalLowercaseString(asOptionalRecord(params.configuredThinking)?.keep) === "all" ? "all" : void 0;
}
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
function createMoonshotThinkingWrapper(baseStreamFn, thinkingType, thinkingKeep, finalizePayload) {
	const underlying = baseStreamFn ?? (async (...args) => (await loadDefaultStream()).streamSimple(...args));
	return function moonshotThinkingStream(model, context, options) {
		const modelId = model.id.trim().toLowerCase();
		const directMoonshotModel = normalizeOptionalLowercaseString(model.provider) === "moonshot";
		const alwaysThinkingEffort = resolveAlwaysThinkingEffort(modelId, directMoonshotModel);
		const streamModel = alwaysThinkingEffort ? {
			...model,
			reasoning: true
		} : model;
		const streamOptions = alwaysThinkingEffort ? {
			...options,
			reasoning: alwaysThinkingEffort
		} : options;
		return underlying(streamModel, context, {
			...streamOptions,
			onPayload(payload, payloadModel) {
				const record = asOptionalRecord(payload);
				if (!record) return streamOptions?.onPayload?.(payload, payloadModel);
				const postThinking = prepareThinkingPayload(record, modelId, directMoonshotModel, thinkingType, thinkingKeep);
				const finish = (result) => {
					const finalPayload = asOptionalRecord(result) ?? record;
					postThinking(finalPayload);
					return finalizePayload ? finalizePayload(result, finalPayload) : result;
				};
				const result = streamOptions?.onPayload?.(payload, payloadModel);
				return result && typeof result.then === "function" ? Promise.resolve(result).then(finish) : finish(result);
			}
		});
	};
}
//#endregion
export { resolveMoonshotThinkingKeep as n, resolveMoonshotThinkingType as r, createMoonshotThinkingWrapper as t };
