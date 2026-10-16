import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./agent-harness-registration-BC861IyH.mjs";
import OpenAI from "openai";
//#region extensions/agentsapi/agentsapi-errors.ts
/** Customer-safe native failure facts remain available to host result classification. */
var AgentsApiError = class extends Error {
	constructor(message, details = {}) {
		super(message);
		this.name = "AgentsApiError";
		this.code = details.code;
		this.status = details.status;
		this.type = details.type;
		this.param = details.param;
	}
};
function resolveAgentsApiSessionAccessError(error, sessionId) {
	if (!sessionId || !(error instanceof OpenAI.APIError)) return error;
	const nativeMessage = asOptionalRecord(error.error)?.message;
	let userMessage;
	if (error instanceof OpenAI.NotFoundError && nativeMessage === `No managed agent resource found: ${sessionId}`) userMessage = "Agents API could not find the saved session or this API key cannot access it. Check that the key belongs to the session's project and has the required permissions, then retry.";
	else if (error instanceof OpenAI.PermissionDeniedError && nativeMessage === "hosted session input requires the API key that created its CCA thread") userMessage = "Agents API currently requires the original API key to send input to this hosted session. Restore that key, then retry to continue the same session.";
	else return error;
	return new AgentHarnessPreflightError(error.message, {
		cause: error,
		userMessage
	});
}
function isAgentsApiTransportDisconnect(error) {
	if (!(error instanceof Error) || error instanceof AgentsApiError) return false;
	const code = asOptionalRecord(error)?.code;
	if (typeof code === "string" && [
		"ECONNRESET",
		"ECONNREFUSED",
		"ETIMEDOUT",
		"UND_ERR_SOCKET"
	].includes(code) || error instanceof TypeError && ["terminated", "fetch failed"].includes(error.message)) return true;
	return error.cause instanceof Error && isAgentsApiTransportDisconnect(error.cause);
}
function isAgentsApiOptionalHistoryReadFailure(error) {
	return error instanceof OpenAI.APIConnectionError || error instanceof OpenAI.APIError && (error.status === 429 || (error.status ?? 0) >= 500);
}
//#endregion
export { resolveAgentsApiSessionAccessError as i, isAgentsApiOptionalHistoryReadFailure as n, isAgentsApiTransportDisconnect as r, AgentsApiError as t };
