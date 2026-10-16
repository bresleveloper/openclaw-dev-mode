import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
import { o as classifyGatewayConnectFailure, t as ConnectErrorDetailCodes } from "./connect-error-details-q_NaMExM.mjs";
//#region src/commands/gateway-health-auth-diagnostic.ts
const GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE = "Gateway is reachable, but this CLI has no token/password or paired device token for read-scope health RPCs.";
const GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE = "Gateway credentials required";
const GATEWAY_HEALTH_REACHABLE_LINE = "Gateway: reachable";
const GATEWAY_HEALTH_RATE_LIMITED_MESSAGE = "Gateway authentication is temporarily rate-limited. Wait for the temporary lockout to expire, then retry.";
const GATEWAY_HEALTH_RATE_LIMITED_TITLE = "Gateway authentication rate-limited";
function gatewayProbeFailureKind(status) {
	return status.connectFailure?.kind ?? classifyGatewayConnectFailure({ message: status.error }).kind;
}
function gatewayProbeResultWasRateLimited(status) {
	return gatewayProbeFailureKind(status) === "rate-limited";
}
function gatewayConnectErrorWasRateLimited(error) {
	if (!isGatewayProtocolResponseError(error)) return false;
	return classifyGatewayConnectFailure({
		details: error.details,
		message: error.message
	}).kind === "rate-limited";
}
function gatewayProbeResultSawGateway(status) {
	return status.ok || status.gatewayReached === true;
}
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
