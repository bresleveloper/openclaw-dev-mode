import { o as classifyGatewayConnectFailure, t as ConnectErrorDetailCodes } from "./connect-error-details-HKRZ1hRc.mjs";
import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
//#region src/commands/gateway-health-auth-diagnostic.ts
/** Gateway health auth diagnostic helpers for reachable-but-unauthenticated probes. */
const GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE = "Gateway is reachable, but this CLI has no token/password or paired device token for read-scope health RPCs.";
const GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE = "Gateway credentials required";
const GATEWAY_HEALTH_REACHABLE_LINE = "Gateway: reachable";
const GATEWAY_HEALTH_RATE_LIMITED_MESSAGE = "Gateway authentication is temporarily rate-limited. Wait for the temporary lockout to expire, then retry.";
const GATEWAY_HEALTH_RATE_LIMITED_TITLE = "Gateway authentication rate-limited";
function gatewayProbeFailureKind(status) {
	return status.connectFailure?.kind ?? classifyGatewayConnectFailure({ message: status.error }).kind;
}
/** Detects the temporary authentication lockout outcome from projected or legacy probe facts. */
function gatewayProbeResultWasRateLimited(status) {
	return gatewayProbeFailureKind(status) === "rate-limited";
}
/** Detects a structured or legacy rate-limit connect error before close projection. */
function gatewayConnectErrorWasRateLimited(error) {
	if (!isGatewayProtocolResponseError(error)) return false;
	return classifyGatewayConnectFailure({
		details: error.details,
		message: error.message
	}).kind === "rate-limited";
}
/**
* Detects when a daemon probe reached the gateway even if read-scope auth failed.
*/
function gatewayProbeResultSawGateway(status) {
	return status.ok || status.gatewayReached === true;
}
/**
* Builds the health diagnostic emitted when the gateway is reachable but credentials are absent.
*/
function buildCredentialsRequiredHealthDiagnostic() {
	return {
		ok: false,
		error: {
			type: "gateway_credentials_required",
			message: GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE
		},
		gateway: { reachable: true }
	};
}
/** Builds the health diagnostic emitted for a temporary Gateway authentication lockout. */
function buildRateLimitedHealthDiagnostic(error) {
	const retryAfterCandidate = error instanceof Error ? error.retryAfterMs : void 0;
	const retryAfterMs = typeof retryAfterCandidate === "number" && Number.isSafeInteger(retryAfterCandidate) && retryAfterCandidate >= 0 ? retryAfterCandidate : void 0;
	return {
		ok: false,
		error: {
			type: "gateway_request_error",
			code: ConnectErrorDetailCodes.AUTH_RATE_LIMITED,
			message: GATEWAY_HEALTH_RATE_LIMITED_MESSAGE,
			retryable: true,
			...retryAfterMs !== void 0 ? { retryAfterMs } : {}
		},
		gateway: { reachable: true }
	};
}
//#endregion
export { GATEWAY_HEALTH_REACHABLE_LINE as a, gatewayConnectErrorWasRateLimited as c, GATEWAY_HEALTH_RATE_LIMITED_TITLE as i, gatewayProbeResultSawGateway as l, GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE as n, buildCredentialsRequiredHealthDiagnostic as o, GATEWAY_HEALTH_RATE_LIMITED_MESSAGE as r, buildRateLimitedHealthDiagnostic as s, GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE as t, gatewayProbeResultWasRateLimited as u };
