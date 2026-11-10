//#region extensions/ollama/src/stream-contract.ts
const OLLAMA_INCOMPLETE_STREAM_ERROR = "Ollama API stream ended without a final response";
function resolveOllamaStopReason(response) {
	if (response.done_reason === "length") return "length";
	if (response.message.tool_calls?.length) return "toolUse";
	return "stop";
}
//#endregion
export { resolveOllamaStopReason as n, OLLAMA_INCOMPLETE_STREAM_ERROR as t };
