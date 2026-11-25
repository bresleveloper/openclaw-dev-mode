import { asOptionalObjectRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createPayloadPatchStreamWrapper, normalizeOpenAICompatibleReasoningReplay } from "openclaw/plugin-sdk/provider-stream-shared";
// extensions/venice/stream.ts
function stringifyHistoricalValue(value) {
	if (typeof value === "string") return value;
	if (value === null || value === void 0) return "";
	try {
		return JSON.stringify(value);
	} catch {
		return "[Unserializable historical value]";
	}
}
function createVeniceStreamWrapper(baseStreamFn) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, context, model }) => {
		if (model.provider === "venice" && (model.id === "deepseek-v4-flash" || model.id === "deepseek-v4-pro")) {
			delete payload.thinking;
			delete payload.reasoning;
			delete payload.reasoning_effort;
			normalizeOpenAICompatibleReasoningReplay(payload, {
				thinkingEnabled: true,
				replaceNullReasoningContent: true
			});
		}
		if (model.provider !== "venice" || !model.id.trim().toLowerCase().startsWith("gemini-")) return;
		const historicalToolCallBatches = [];
		let hasHistoricalSignature = false;
		const requiresUnsignedCallFallback = /^gemini-3(?:[.-]|$)/.test(model.id.trim().toLowerCase());
		for (const message of context.messages) {
			if (message.role !== "assistant" || message.stopReason === "error" || message.stopReason === "aborted") continue;
			const isExactRoute = message.api === model.api && message.provider === model.provider && message.model === model.id;
			const batch = [];
			for (const block of message.content) {
				if (block.type !== "toolCall") continue;
				const thoughtSignature = isExactRoute ? block.thoughtSignature || void 0 : void 0;
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
			const record = asOptionalObjectRecord(message);
			if (!record) {
				pendingDowngradedToolCalls = void 0;
				continue;
			}
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
				const toolCallRecord = asOptionalObjectRecord(toolCall);
				if (!toolCallRecord) continue;
				const historicalCall = historicalBatch?.[toolCallIndex];
				const fn = asOptionalObjectRecord(toolCallRecord.function);
				const name = typeof fn?.name === "string" && fn.name.length > 0 ? fn.name : "unknown_tool";
				const args = stringifyHistoricalValue(fn?.arguments) || "{}";
				const describedCall = {
					...typeof toolCallRecord.id === "string" ? { id: toolCallRecord.id } : {},
					name,
					text: `[Historical tool call: ${name}(${args})]`
				};
				const signature = historicalCall && historicalCall.id === toolCallRecord.id && historicalCall.name === describedCall.name ? historicalCall.thoughtSignature : void 0;
				delete toolCallRecord.provider_specific_fields;
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
	});
}
export { createVeniceStreamWrapper };
