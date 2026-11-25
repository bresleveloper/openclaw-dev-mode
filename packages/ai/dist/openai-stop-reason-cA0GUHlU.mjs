// packages/ai/src/providers/openai-stop-reason.ts
function mapOpenAIStopReason(reason, options) {
	switch (reason) {
		case null:
		case "stop":
		case "STOP":
		case "end": return { stopReason: "stop" };
		case "length":
		case "MAX_TOKENS": return { stopReason: "length" };
		case "function_call":
		case "tool_calls": return { stopReason: "toolUse" };
		case "tool_call": if (options?.allowSingularToolCall) return { stopReason: "toolUse" };
	}
	return {
		stopReason: "error",
		errorMessage: `Provider finish_reason: ${reason}`
	};
}
export { mapOpenAIStopReason as t };
