import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { c as resolveHeartbeatPromptCore } from "./heartbeat-vWflpIwS.mjs";
import { c as tryResolveAmbientHeartbeatAgentId, i as resolveHeartbeatConfig, n as resolveHeartbeatAgentIds, o as resolveHeartbeatIntervalMs } from "./heartbeat-config-BvP-hlUW.mjs";
//#region src/infra/heartbeat-summary-projection.ts
/**
* Heartbeat enrollment and summary projection shared by the public
* heartbeat-summary module and the health/status snapshot builders. Lives
* outside heartbeat-summary.ts because that module is wildcard re-exported by
* the plugin SDK: the fleet-wide resolver is an internal snapshot helper, not
* public API, and must not widen the SDK surface.
*/
const DEFAULT_HEARTBEAT_TARGET = "owner";
function enrolledHeartbeatAgentIds(cfg) {
	return new Set(resolveHeartbeatAgentIds(cfg));
}
function isEnrolledHeartbeatAgent(cfg, agentId, enrolled) {
	const resolvedAgentId = agentId ?? tryResolveAmbientHeartbeatAgentId(cfg);
	return resolvedAgentId !== void 0 && enrolled.has(normalizeAgentId(resolvedAgentId));
}
function buildHeartbeatSummary(cfg, agentId, enrolled) {
	const merged = resolveHeartbeatConfig(cfg, agentId);
	const everyMs = resolveHeartbeatIntervalMs(cfg, void 0, merged);
	const enabled = isEnrolledHeartbeatAgent(cfg, agentId, enrolled) && everyMs !== null;
	return {
		enabled,
		every: enabled ? merged?.every ?? "30m" : "disabled",
		everyMs: enabled ? everyMs : null,
		prompt: resolveHeartbeatPromptCore(merged?.prompt),
		target: merged?.target ?? DEFAULT_HEARTBEAT_TARGET,
		model: merged?.model,
		session: merged?.session,
		ackMaxChars: 300
	};
}
/**
* Display-ready heartbeat settings for many agents from one roster pass, in
* input order. Health and status project every configured agent; resolving
* enrollment per agent re-walks the roster each time, so a large fleet blocked
* the Gateway event loop for tens of seconds per refresh (#137570).
*/
function resolveHeartbeatSummariesForAgents(cfg, agentIds) {
	return withAgentRosterFactsBatch(cfg, () => {
		const enrolled = enrolledHeartbeatAgentIds(cfg);
		return agentIds.map((agentId) => buildHeartbeatSummary(cfg, agentId, enrolled));
	});
}
//#endregion
export { resolveHeartbeatSummariesForAgents as i, enrolledHeartbeatAgentIds as n, isEnrolledHeartbeatAgent as r, buildHeartbeatSummary as t };
