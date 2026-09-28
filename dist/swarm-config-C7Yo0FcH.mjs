import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
//#region src/agents/subagents/swarm/swarm-config.ts
const DEFAULT_SWARM_CONFIG = {
	enabled: true,
	maxConcurrent: 8,
	maxChildrenPerGroup: 50,
	maxTotalPerGroup: 200,
	waitTimeoutSecondsMax: 600,
	defaultAgentId: ""
};
function normalizeRawConfig(value) {
	if (typeof value === "boolean") return { enabled: value };
	return isRecord(value) ? value : void 0;
}
function readBoundedPositiveInteger(value, fallback, max) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? Math.min(value, max) : fallback;
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
		maxConcurrent: readBoundedPositiveInteger(raw.maxConcurrent, DEFAULT_SWARM_CONFIG.maxConcurrent, 1e3),
		maxChildrenPerGroup: readBoundedPositiveInteger(raw.maxChildrenPerGroup, DEFAULT_SWARM_CONFIG.maxChildrenPerGroup, 1e4),
		maxTotalPerGroup: readBoundedPositiveInteger(raw.maxTotalPerGroup, DEFAULT_SWARM_CONFIG.maxTotalPerGroup, 1e5),
		waitTimeoutSecondsMax: readBoundedPositiveInteger(raw.waitTimeoutSecondsMax, DEFAULT_SWARM_CONFIG.waitTimeoutSecondsMax, 86400),
		defaultAgentId: typeof raw.defaultAgentId === "string" ? raw.defaultAgentId.trim() : ""
	};
}
//#endregion
export { resolveSwarmConfig as t };
