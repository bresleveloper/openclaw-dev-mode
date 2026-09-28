import { a as GATEWAY_SUPERVISOR_EXIT_MARGIN_MS, r as GATEWAY_SHUTDOWN_RESERVE_MS } from "./gateway-shutdown-budget-E5oPIr_h.mjs";
//#region src/infra/restart-budget.ts
const DEFAULT_RESTART_DEFERRAL_TIMEOUT_MS = 3e5;
function resolveGatewayRestartDeferralTimeoutMs(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) return DEFAULT_RESTART_DEFERRAL_TIMEOUT_MS;
	return timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function resolveGatewayRestartDrainTimeoutMs(intent) {
	const reserveMs = GATEWAY_SHUTDOWN_RESERVE_MS + GATEWAY_SUPERVISOR_EXIT_MARGIN_MS;
	const waitMs = intent?.waitMs ?? (intent?.force ? 6e4 - reserveMs : void 0);
	return intent?.drainBudgetExhausted || intent?.force && waitMs === 0 ? 0 : resolveGatewayRestartDeferralTimeoutMs(waitMs);
}
//#endregion
export { resolveGatewayRestartDrainTimeoutMs as n, resolveGatewayRestartDeferralTimeoutMs as t };
