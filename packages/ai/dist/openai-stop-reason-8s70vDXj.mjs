//#region packages/ai/src/providers/openai-stop-reason.ts
function mapOpenAIStopReason(reason, options) {
	switch (reason) {
		case null:
		case "stop":
		case "end": return { stopReason: "stop" };
		case "length": return { stopReason: "length" };
		case "function_call":
		case "tool_calls": return { stopReason: "toolUse" };
		case "tool_call": if (options?.allowSingularToolCall) return { stopReason: "toolUse" };
	}
	return {
		stopReason: "error",
		errorMessage: `Provider finish_reason: ${reason}`
	};
}
//#endregion
export { mapOpenAIStopReason as t };
