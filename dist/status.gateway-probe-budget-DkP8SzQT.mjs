import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-BnbTHsGr.mjs";
//#region src/commands/status.gateway-probe-budget.ts
function createStatusGatewayProbeBudget(timeoutMs) {
	return {
		timeoutMs,
		gatewayProbeDeadlineMs: performance.now() + (timeoutMs ?? DEFAULT_RESTART_HEALTH_TIMEOUT_MS)
	};
}
function resolveStatusGatewayProbeTimeoutMs(opts) {
	const remainingMs = Math.max(0, Math.ceil(opts.gatewayProbeDeadlineMs - performance.now()));
	return opts.timeoutMs === void 0 ? remainingMs : Math.min(opts.timeoutMs, remainingMs);
}
//#endregion
export { resolveStatusGatewayProbeTimeoutMs as n, createStatusGatewayProbeBudget as t };
