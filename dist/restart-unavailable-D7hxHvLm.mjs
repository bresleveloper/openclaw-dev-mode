//#region packages/gateway-protocol/src/restart-unavailable.ts
/** Structured error reason used while the gateway drains for a restart. */
const GATEWAY_RESTART_UNAVAILABLE_REASON = "gateway-restarting";
/** Structured error reason used while the gateway drains for a suspension. */
const GATEWAY_SUSPEND_UNAVAILABLE_REASON = "gateway-suspending";
/** Identity reads wait for resume, with a bounded probe if that event is missed. */
const GATEWAY_SUSPEND_IDENTITY_RETRY_AFTER_MS = 6e4;
/** Detects the structured retryable error emitted while a restart drain refuses work. */
function isGatewayRestartUnavailableError(error) {
	return hasUnavailableReason(error, GATEWAY_RESTART_UNAVAILABLE_REASON);
}
/** Detects the structured retryable error emitted while suspension refuses work. */
function isGatewaySuspendUnavailableError(error) {
	return hasUnavailableReason(error, GATEWAY_SUSPEND_UNAVAILABLE_REASON);
}
function hasUnavailableReason(error, reason) {
	if (!error || typeof error !== "object" || !("details" in error)) return false;
	const details = error.details;
	return typeof details === "object" && details !== null && "reason" in details && details.reason === reason;
}
//#endregion
export { isGatewaySuspendUnavailableError as a, isGatewayRestartUnavailableError as i, GATEWAY_SUSPEND_IDENTITY_RETRY_AFTER_MS as n, GATEWAY_SUSPEND_UNAVAILABLE_REASON as r, GATEWAY_RESTART_UNAVAILABLE_REASON as t };
