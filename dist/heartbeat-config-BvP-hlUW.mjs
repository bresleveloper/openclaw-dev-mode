import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, O as listAgentIds, b as tryResolveAmbientOwnerAgentId, r as resolveAgentConfig, w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import "./heartbeat-vWflpIwS.mjs";
//#region src/infra/heartbeat-agent-resolution.ts
function tryResolveAmbientHeartbeatAgentId(cfg) {
	return tryResolveAmbientOwnerAgentId(cfg, cfg.agents?.defaults?.heartbeat?.agentId);
}
//#endregion
//#region src/infra/heartbeat-config.ts
/** Pure heartbeat enrollment and configuration shared by scheduling, health, and Doctor. */
const DEFAULT_HEARTBEAT_TIMEOUT_SECONDS = 600;
function resolveHeartbeatConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.heartbeat;
	if (!agentId) return defaults;
	const overrides = resolveAgentConfig(cfg, agentId)?.heartbeat;
	return defaults || overrides ? {
		...defaults,
		...overrides
	} : void 0;
}
function omitExplicitHeartbeatDestination(heartbeat) {
	if (!heartbeat) return;
	const next = { ...heartbeat };
	delete next.to;
	delete next.accountId;
	return next;
}
function resolveHeartbeatForWake(params) {
	const configuredHeartbeat = params.configuredHeartbeat ?? resolveHeartbeatConfig(params.cfg, params.agentId);
	const heartbeat = params.requestedHeartbeat ? {
		...configuredHeartbeat,
		...params.requestedHeartbeat
	} : configuredHeartbeat;
	return params.source === "cron" && params.requestedHeartbeat?.target === "last" ? omitExplicitHeartbeatDestination(heartbeat) : heartbeat;
}
/** Resolve the cadence owned by the effective heartbeat configuration. */
function resolveHeartbeatIntervalMs(cfg, overrideEvery, heartbeat) {
	const raw = overrideEvery ?? heartbeat?.every ?? cfg.agents?.defaults?.heartbeat?.every ?? "30m";
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return null;
	try {
		const intervalMs = parseDurationMs(trimmed, { defaultUnit: "m" });
		return intervalMs > 0 ? intervalMs : null;
	} catch {
		return null;
	}
}
function resolveHeartbeatTimeoutOverrideSeconds(cfg, heartbeat) {
	if (typeof heartbeat?.timeoutSeconds === "number") return heartbeat.timeoutSeconds;
	const agentDefaultTimeoutSeconds = cfg.agents?.defaults?.timeoutSeconds;
	if (typeof agentDefaultTimeoutSeconds === "number" && Number.isFinite(agentDefaultTimeoutSeconds)) return agentDefaultTimeoutSeconds === 0 ? 0 : Math.max(1, Math.floor(agentDefaultTimeoutSeconds));
	const intervalMs = resolveHeartbeatIntervalMs(cfg, void 0, heartbeat);
	if (!intervalMs) return DEFAULT_HEARTBEAT_TIMEOUT_SECONDS;
	return Math.max(1, Math.min(DEFAULT_HEARTBEAT_TIMEOUT_SECONDS, Math.ceil(intervalMs / 1e3)));
}
function resolveHeartbeatAgentIds(cfg) {
	const explicitAgents = listAgentEntries(cfg).filter((entry) => entry.heartbeat);
	if (explicitAgents.length > 0) return explicitAgents.map((entry) => normalizeAgentId(entry.id)).filter(Boolean);
	const configuredAgentId = normalizeOptionalString(cfg.agents?.defaults?.heartbeat?.agentId);
	if (configuredAgentId) return [normalizeAgentId(configuredAgentId)];
	if (cfg.agents?.defaults?.heartbeat) return listAgentIds(cfg);
	const agentId = tryResolveAmbientHeartbeatAgentId(cfg);
	return agentId ? [agentId] : [];
}
function resolveHeartbeatAgents(cfg) {
	return withAgentRosterFactsBatch(cfg, () => resolveHeartbeatAgentIds(cfg).map((agentId) => ({
		agentId,
		heartbeat: resolveHeartbeatConfig(cfg, agentId)
	})));
}
function isHeartbeatOwnerUnresolved(cfg) {
	return listAgentIds(cfg).length > 1 && resolveHeartbeatAgentIds(cfg).length === 0;
}
//#endregion
export { resolveHeartbeatForWake as a, tryResolveAmbientHeartbeatAgentId as c, resolveHeartbeatConfig as i, resolveHeartbeatAgentIds as n, resolveHeartbeatIntervalMs as o, resolveHeartbeatAgents as r, resolveHeartbeatTimeoutOverrideSeconds as s, isHeartbeatOwnerUnresolved as t };
