import { n as resolveAgentMaxConcurrent, r as resolveSubagentMaxConcurrent } from "./agent-limits-D-OOBnZ7.mjs";
import "./lanes-D7a4ntDu.mjs";
import { f as publishLaneConfiguration, h as setCommandLaneConcurrency, o as getCommandLaneSnapshot } from "./command-queue-CFE60Avj.mjs";
import { t as enableSessionSuspensionWritesForGatewayStart } from "./session-suspension-DVRz0I9V.mjs";
import { t as resolveCronMaxConcurrentRuns } from "./cron-limits-txevLFpr.mjs";
//#region src/gateway/server-lanes.ts
/** Capacity held inside the cron budget so hook dispatch cannot be starved. */
const HOOK_DISPATCH_LANE_RESERVATION = 1;
/** Group bounding cron inner work and hook dispatch to one shared budget. */
const CRON_HOOK_LANE_GROUP = "cron-hooks";
function resolveGatewayLaneConcurrency(cfg) {
	const cron = resolveCronMaxConcurrentRuns();
	return {
		cron,
		hookDispatch: cfg.hooks?.enabled === true ? cron : 0,
		main: resolveAgentMaxConcurrent(cfg),
		subagent: resolveSubagentMaxConcurrent(cfg)
	};
}
function applyGatewayLaneConcurrency(concurrency, opts = {}) {
	if (opts.gatewayStart) enableSessionSuspensionWritesForGatewayStart();
	setCommandLaneConcurrency("cron", concurrency.cron);
	const hooksEnabled = concurrency.hookDispatch > 0;
	const hookSnapshot = getCommandLaneSnapshot("hook-dispatch");
	const retainInFlightHookBudget = !hooksEnabled && hookSnapshot.activeCount > 0;
	publishLaneConfiguration({
		lanes: {
			["cron-nested"]: concurrency.cron,
			["hook-dispatch"]: concurrency.hookDispatch
		},
		groups: hooksEnabled || retainInFlightHookBudget ? { [CRON_HOOK_LANE_GROUP]: {
			budget: concurrency.cron,
			members: ["cron-nested", "hook-dispatch"],
			reservations: hooksEnabled ? { ["hook-dispatch"]: HOOK_DISPATCH_LANE_RESERVATION } : void 0
		} } : void 0,
		clearGroups: hooksEnabled || retainInFlightHookBudget ? void 0 : [CRON_HOOK_LANE_GROUP]
	});
	setCommandLaneConcurrency("main", concurrency.main);
	if (opts.gatewayStart) setCommandLaneConcurrency("nested", 1);
	setCommandLaneConcurrency("subagent", concurrency.subagent);
	setCommandLaneConcurrency("active-memory", concurrency.subagent);
}
//#endregion
//#region src/gateway/server/hook-client-ip-config.ts
/**
* Adapts gateway network trust config to the hooks HTTP request handler.
*/
function resolveHookClientIpConfig(cfg) {
	return {
		trustedProxies: cfg.gateway?.trustedProxies,
		allowRealIpFallback: cfg.gateway?.allowRealIpFallback === true
	};
}
//#endregion
export { applyGatewayLaneConcurrency as n, resolveGatewayLaneConcurrency as r, resolveHookClientIpConfig as t };
