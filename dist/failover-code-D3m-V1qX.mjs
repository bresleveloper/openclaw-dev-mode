//#region extensions/openai/failover-code.ts
/** Maps OpenAI error codes to OpenClaw failover reasons. */
function classifyOpenAiFailoverCode(code) {
	switch (code?.trim().toUpperCase()) {
		case "SERVER_ERROR": return "server_error";
		case "INSUFFICIENT_QUOTA":
		case "USAGE_NOT_INCLUDED": return "billing";
		case "USAGE_LIMIT_REACHED": return "rate_limit";
		case "CONTEXT_LENGTH_EXCEEDED": return "context_overflow";
		case "INVALID_PROMPT":
		case "INVALID_REQUEST_ERROR":
		case "CONTENT_POLICY_VIOLATION":
		case "CONTENT_FILTER": return "format";
		default: return;
	}
}
//#endregion
export { classifyOpenAiFailoverCode as t };
