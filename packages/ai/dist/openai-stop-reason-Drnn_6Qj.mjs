//#region packages/ai/src/providers/openai-stop-reason.ts
function mapOpenAIStopReason(reason, options) {
	if (reason === null) return { stopReason: "stop" };
	switch (reason) {
		case "stop":
		case "end": return { stopReason: "stop" };
		case "length": return { stopReason: "length" };
		case "function_call":
		case "tool_calls": return { stopReason: "toolUse" };
		case "tool_call":
			if (options?.allowSingularToolCall) return { stopReason: "toolUse" };
			break;
		case "content_filter": return {
			stopReason: "error",
			errorMessage: "Provider finish_reason: content_filter"
		};
		case "network_error": return {
			stopReason: "error",
			errorMessage: "Provider finish_reason: network_error"
		};
	}
	return {
		stopReason: "error",
		errorMessage: `Provider finish_reason: ${reason}`
	};
}
//#endregion
export { mapOpenAIStopReason as t };
