import { createPayloadPatchStreamWrapper, normalizeOpenAICompatibleReasoningReplay } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/venice/stream.ts
function isVeniceDeepSeekV4ModelId(modelId) {
	return modelId === "deepseek-v4-flash" || modelId === "deepseek-v4-pro";
}
function isVeniceGeminiModelId(modelId) {
	return typeof modelId === "string" && modelId.trim().toLowerCase().startsWith("gemini-");
}
function isVeniceGemini3ModelId(modelId) {
	return typeof modelId === "string" && /^gemini-3(?:[.-]|$)/.test(modelId.trim().toLowerCase());
}
function stringifyHistoricalValue(value) {
	if (typeof value === "string") return value;
	if (value === null || value === void 0) return "";
	try {
		return JSON.stringify(value);
	} catch {
		return "[Unserializable historical value]";
	}
}
function describeHistoricalToolCall(toolCall) {
	const fn = toolCall.function && typeof toolCall.function === "object" ? toolCall.function : {};
	const name = typeof fn.name === "string" && fn.name.length > 0 ? fn.name : "unknown_tool";
	const args = stringifyHistoricalValue(fn.arguments) || "{}";
	return {
		...typeof toolCall.id === "string" ? { id: toolCall.id } : {},
		name,
		text: `[Historical tool call: ${name}(${args})]`
	};
}
function applyVeniceGeminiToolHistoryCompatibility(payload, context, model) {
	if (model.provider !== "venice" || !isVeniceGeminiModelId(model.id)) return;
	const historicalToolCallBatches = [];
	let hasHistoricalSignature = false;
	const requiresUnsignedCallFallback = isVeniceGemini3ModelId(model.id);
	for (const message of context.messages ?? []) {
		if (message.role !== "assistant" || message.stopReason === "error" || message.stopReason === "aborted") continue;
		const isExactRoute = message.api === model.api && message.provider === model.provider && message.model === model.id;
		const batch = [];
		for (const block of message.content) {
			if (block.type !== "toolCall" || typeof block.id !== "string") continue;
			const thoughtSignature = isExactRoute && typeof block.thoughtSignature === "string" && block.thoughtSignature.length > 0 ? block.thoughtSignature : void 0;
			hasHistoricalSignature ||= thoughtSignature !== void 0;
			batch.push({
				id: block.id,
				name: block.name,
				...thoughtSignature ? { thoughtSignature } : {}
			});
		}
		if (batch.length > 0) historicalToolCallBatches.push(batch);
	}
	if (!hasHistoricalSignature && !requiresUnsignedCallFallback || !Array.isArray(payload.messages)) return;
	let historicalBatchIndex = 0;
	let pendingDowngradedToolCalls;
	for (const message of payload.messages) {
		if (!message || typeof message !== "object") {
			pendingDowngradedToolCalls = void 0;
			continue;
		}
		const record = message;
		if (record.role === "tool") {
			const toolCallId = typeof record.tool_call_id === "string" ? record.tool_call_id : void 0;
			if (!toolCallId) continue;
			const pendingCalls = pendingDowngradedToolCalls;
			if (!pendingCalls) continue;
			const toolNames = pendingCalls.get(toolCallId);
			if (!toolNames) continue;
			const toolName = toolNames.shift();
			if (!toolName) continue;
			if (toolNames.length === 0) pendingCalls.delete(toolCallId);
			const result = stringifyHistoricalValue(record.content);
			for (const key of Object.keys(record)) delete record[key];
			record.role = "user";
			record.content = `[Historical tool result for ${toolName}:\n${result}]`;
			continue;
		}
		pendingDowngradedToolCalls = void 0;
		if (record.role !== "assistant" || !Array.isArray(record.tool_calls)) continue;
		const historicalBatch = historicalToolCallBatches[historicalBatchIndex++];
		let shouldDowngradeBatch = false;
		const describedCalls = [];
		for (const [toolCallIndex, toolCall] of record.tool_calls.entries()) {
			if (!toolCall || typeof toolCall !== "object") continue;
			const toolCallRecord = toolCall;
			const historicalCall = historicalBatch?.[toolCallIndex];
			const describedCall = describeHistoricalToolCall(toolCallRecord);
			const signature = historicalCall && historicalCall.id === toolCallRecord.id && historicalCall.name === describedCall.name ? historicalCall.thoughtSignature : void 0;
			if (signature) toolCallRecord.thought_signature = signature;
			else if (requiresUnsignedCallFallback) shouldDowngradeBatch = true;
			describedCalls.push(describedCall);
		}
		if (!shouldDowngradeBatch) continue;
		pendingDowngradedToolCalls = /* @__PURE__ */ new Map();
		for (const call of describedCalls) if (call.id) {
			const names = pendingDowngradedToolCalls.get(call.id) ?? [];
			names.push(call.name);
			pendingDowngradedToolCalls.set(call.id, names);
		}
		record.content = [stringifyHistoricalValue(record.content), ...describedCalls.map((call) => call.text)].filter((part) => part.length > 0).join("\n");
		delete record.tool_calls;
	}
}
function createVeniceStreamWrapper(baseStreamFn, thinkingLevel) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, context, model }) => {
		if (model.provider === "venice" && isVeniceDeepSeekV4ModelId(model.id)) {
			delete payload.thinking;
			delete payload.reasoning;
			delete payload.reasoning_effort;
			normalizeOpenAICompatibleReasoningReplay(payload, {
				thinkingEnabled: true,
				replaceNullReasoningContent: true
			});
		}
		applyVeniceGeminiToolHistoryCompatibility(payload, context, model);
	});
}
//#endregion
export { createVeniceStreamWrapper };
