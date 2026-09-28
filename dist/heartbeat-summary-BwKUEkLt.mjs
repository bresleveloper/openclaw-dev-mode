import "./heartbeat-config-BvP-hlUW.mjs";
import { n as enrolledHeartbeatAgentIds, r as isEnrolledHeartbeatAgent, t as buildHeartbeatSummary } from "./heartbeat-summary-projection-Crxlqz_G.mjs";
//#region src/infra/heartbeat-summary.ts
/** Return whether heartbeat scheduling applies to an agent. */
function isHeartbeatEnabledForAgent(cfg, agentId) {
	return isEnrolledHeartbeatAgent(cfg, agentId, enrolledHeartbeatAgentIds(cfg));
}
/** Resolve display-ready heartbeat settings for an agent. */
function resolveHeartbeatSummaryForAgent(cfg, agentId) {
	return buildHeartbeatSummary(cfg, agentId, enrolledHeartbeatAgentIds(cfg));
}
//#endregion
export { resolveHeartbeatSummaryForAgent as n, isHeartbeatEnabledForAgent as t };
