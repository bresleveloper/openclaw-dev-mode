import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as redactToolPayloadText } from "./redact-BcXJu5HP.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
//#region src/agents/mcp-error.ts
/** MCP lifecycle errors use the protocol code, including serialized SDK errors. */
function isMcpRequestTimeoutError(error) {
	return isRecord(error) && error.code === ErrorCode.RequestTimeout;
}
function isMcpMethodNotFoundError(error) {
	if (isRecord(error) && error.code === ErrorCode.MethodNotFound) return true;
	const message = String(error);
	return message.includes("-32601") || /\b(?:method not found|unknown method)\b/i.test(message);
}
/** Redacts MCP diagnostics, including response bodies the SDK includes in thrown errors. */
function redactMcpDiagnosticError(error) {
	const message = error instanceof StreamableHTTPError && error.code === 401 ? "authentication refused (401); check this MCP server's credentials or sign in again" : formatErrorMessage(error).replace(/(Error POSTing to endpoint(?: \(HTTP \d+\))?:)[\s\S]*/, "$1 [redacted response body]");
	return redactToolPayloadText(redactSensitiveUrlLikeString(message));
}
//#endregion
export { isMcpRequestTimeoutError as n, redactMcpDiagnosticError as r, isMcpMethodNotFoundError as t };
