import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/gateway/transport-error.ts
var GatewayTransportError = class extends Error {
	constructor(params) {
		super(params.message);
		this.name = "GatewayTransportError";
		this.kind = params.kind;
		this.connectionDetails = params.connectionDetails;
		if (params.code !== void 0) this.code = params.code;
		if (params.reason !== void 0) this.reason = params.reason;
		if (params.timeoutMs !== void 0) this.timeoutMs = params.timeoutMs;
	}
};
function isGatewayTransportError(value) {
	if (value instanceof GatewayTransportError) return true;
	if (!(value instanceof Error) || value.name !== "GatewayTransportError") return false;
	return "kind" in value && (value.kind === "closed" || value.kind === "timeout") && "connectionDetails" in value && typeof value.connectionDetails === "object" && value.connectionDetails !== null;
}
const DISPATCHED_REQUEST_OUTCOME_GUIDANCE = "The request was already sent to the gateway, so the operation may have been applied even though no response arrived; its outcome is unknown. Verify the current state (for example, re-run the equivalent read-only command) before retrying, especially for write actions.";
function createGatewayCloseTransportError(params) {
	const { code, connectionDetails, requestDispatched } = params;
	const reason = normalizeOptionalString(params.reason) || "no close reason";
	const hint = code === 1006 ? "abnormal closure (no close frame)" : code === 1e3 ? "normal closure" : "";
	let message = `gateway closed (${code}${hint ? ` ${hint}` : ""}): ${reason}\n${connectionDetails.message}`;
	if (code === 1006) message += `\n\nPossible causes:\n${requestDispatched ? "- Connection dropped without a close frame (check network and gateway load)" : "- Connection dropped without a close frame (retry; check network and gateway load)\n- Gateway not yet ready to accept connections (retry after a moment)\n- TLS mismatch (connecting with ws:// to a wss:// gateway, or vice versa)"}
- Gateway process stopped or became unreachable (confirm it is still running)
Run \`openclaw doctor\` for diagnostics.`;
	return new GatewayTransportError({
		kind: "closed",
		code,
		reason,
		connectionDetails,
		message: requestDispatched ? `${message}\n\n${DISPATCHED_REQUEST_OUTCOME_GUIDANCE}` : message
	});
}
function createGatewayTimeoutTransportError(params) {
	const { timeoutMs, connectionDetails, requestDispatched } = params;
	const message = `gateway timeout after ${timeoutMs}ms\n${connectionDetails.message}`;
	return new GatewayTransportError({
		kind: "timeout",
		timeoutMs,
		connectionDetails,
		message: requestDispatched ? `${message}\n\n${DISPATCHED_REQUEST_OUTCOME_GUIDANCE}` : message
	});
}
/** Transport uncertainty permits read recovery or an exclusively ownership-locked mutation. */
function isGatewayRpcUnavailableError(error) {
	if (isGatewayTransportError(error)) return error.kind === "timeout" || [
		void 0,
		1006,
		1012
	].includes(error.code);
	return error instanceof Error && error.name === "Error" && (/^gateway closed \((?:1006|1012)\): [^\r\n]*$/u.test(error.message) || /^gateway timeout after \d+ms(?:\n[\s\S]*)?$/u.test(error.message));
}
//#endregion
export { isGatewayTransportError as a, isGatewayRpcUnavailableError as i, createGatewayCloseTransportError as n, createGatewayTimeoutTransportError as r, GatewayTransportError as t };
