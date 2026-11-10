import { r as DEFAULT_UPDATE_STEP_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
//#region src/commands/gateway-startup-timing.ts
function resolveGatewayStartupTiming(platform = process.platform, update) {
	const windows = platform === "win32";
	const timing = {
		deadlineMs: windows ? 3 * DEFAULT_UPDATE_STEP_TIMEOUT_MS : 45e3,
		probeTimeoutMs: windows ? 15e3 : 1e4
	};
	if (!update) return timing;
	const floorMs = Math.max(update.migrationLeaseMs, windows ? timing.deadlineMs : 0);
	const capMs = Math.max(floorMs, windows ? 4 * DEFAULT_UPDATE_STEP_TIMEOUT_MS : update.previousGateway ? 2 * DEFAULT_UPDATE_STEP_TIMEOUT_MS : Infinity);
	const observedStartupMs = update.observedStartupMs ?? 0;
	const observedBudget = `max(${floorMs}ms, canary startup ${observedStartupMs}ms × 10)`;
	return {
		...timing,
		deadlineMs: update.timeoutMs ?? Math.min(capMs, Math.max(floorMs, observedStartupMs * 10)),
		derivation: update.timeoutMs !== void 0 ? "explicit --timeout" : Number.isFinite(capMs) ? `min(${capMs}ms, ${observedBudget})` : observedBudget
	};
}
//#endregion
export { resolveGatewayStartupTiming as t };
