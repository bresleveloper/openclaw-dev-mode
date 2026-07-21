import { V as resolveCronMaxConcurrentRuns } from "./io-DxnOT4sF.js";
import { n as resolveSubagentMaxConcurrent, t as resolveAgentMaxConcurrent } from "./agent-limits-DGV0ALs8.js";
import { g as setCommandLaneConcurrency } from "./command-queue-DqzpsN4m.js";
//#region src/gateway/server-lanes.ts
function applyGatewayLaneConcurrency(cfg) {
	const cronMaxConcurrentRuns = resolveCronMaxConcurrentRuns(cfg.cron);
	setCommandLaneConcurrency("cron", cronMaxConcurrentRuns);
	setCommandLaneConcurrency("cron-nested", cronMaxConcurrentRuns);
	setCommandLaneConcurrency("main", resolveAgentMaxConcurrent(cfg));
	setCommandLaneConcurrency("subagent", resolveSubagentMaxConcurrent(cfg));
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
export { applyGatewayLaneConcurrency as n, resolveHookClientIpConfig as t };
