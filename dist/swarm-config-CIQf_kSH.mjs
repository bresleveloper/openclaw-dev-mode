import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
//#region src/agents/subagents/swarm/swarm-config.ts
const DEFAULT_SWARM_CONFIG = {
	enabled: true,
	maxConcurrent: 32,
	maxChildrenPerGroup: 50,
	maxTotalPerGroup: 200,
	waitTimeoutSecondsMax: 600,
	defaultAgentId: ""
};
function normalizeRawConfig(value) {
	if (typeof value === "boolean") return { enabled: value };
	return isRecord(value) ? value : void 0;
}
function readSwarmLimit(raw, key, max) {
	const value = raw[key];
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? Math.min(value, max) : DEFAULT_SWARM_CONFIG[key];
}
/** Resolve global and per-agent Swarm configuration into bounded runtime values. */
function resolveSwarmConfig(config, agentId) {
	const globalRaw = normalizeRawConfig(config?.tools?.swarm) ?? {};
	const agentRaw = config && agentId ? normalizeRawConfig(resolveAgentConfig(config, agentId)?.tools?.swarm) : void 0;
	const raw = agentRaw ? {
		...globalRaw,
		...agentRaw
	} : globalRaw;
	return {
		enabled: typeof raw.enabled === "boolean" ? raw.enabled : DEFAULT_SWARM_CONFIG.enabled,
		maxConcurrent: readSwarmLimit(raw, "maxConcurrent", 1e3),
		maxChildrenPerGroup: readSwarmLimit(raw, "maxChildrenPerGroup", 1e4),
		maxTotalPerGroup: readSwarmLimit(raw, "maxTotalPerGroup", 1e5),
		waitTimeoutSecondsMax: readSwarmLimit(raw, "waitTimeoutSecondsMax", 86400),
		defaultAgentId: typeof raw.defaultAgentId === "string" ? raw.defaultAgentId.trim() : ""
	};
}
//#endregion
export { resolveSwarmConfig as t };
