import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { c as normalizeOptionalAgentId } from "./session-key-CBvmC8zz.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-BohvVKP0.mjs";
//#region src/commands/doctor/shared/stale-subagent-allowlist.ts
function collectConfiguredSubagentTargetIds(cfg) {
	const ids = new Set(listAgentIds(cfg));
	for (const agent of listAgentEntries(cfg)) {
		if (agent.runtime?.type !== "acp") continue;
		const acpAgent = normalizeOptionalAgentId(agent.runtime.acp?.agent);
		if (acpAgent) ids.add(acpAgent);
	}
	const defaultAcpAgent = normalizeOptionalAgentId(cfg.acp?.defaultAgent);
	if (defaultAcpAgent) ids.add(defaultAcpAgent);
	for (const entry of cfg.acp?.allowedAgents ?? []) {
		if (entry.trim() === "*") continue;
		const acpAgent = normalizeOptionalAgentId(entry);
		if (acpAgent) ids.add(acpAgent);
	}
	return ids;
}
function collectStaleAllowlistEntries(params) {
	if (!Array.isArray(params.allowAgents)) return [];
	const hits = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of params.allowAgents) {
		if (typeof entry !== "string") continue;
		const trimmed = entry.trim();
		if (!trimmed || trimmed === "*") continue;
		const normalizedAgentId = normalizeAgentId(trimmed);
		if (params.configuredTargetIds.has(normalizedAgentId)) continue;
		const key = `${params.pathLabel}:${normalizedAgentId}`;
		if (seen.has(key)) continue;
		seen.add(key);
		hits.push({
			pathLabel: params.pathLabel,
			agentId: trimmed,
			normalizedAgentId
		});
	}
	return hits;
}
/** Find subagent allowlist entries not backed by configured agent or ACP targets. */
function scanStaleSubagentAllowlistReferences(cfg) {
	const configuredTargetIds = collectConfiguredSubagentTargetIds(cfg);
	const hits = [];
	hits.push(...collectStaleAllowlistEntries({
		allowAgents: cfg.agents?.defaults?.subagents?.allowAgents,
		pathLabel: "agents.defaults.subagents.allowAgents",
		configuredTargetIds
	}));
	for (const { agent, path } of listMutableCodexRouteAgentEntries(cfg)) hits.push(...collectStaleAllowlistEntries({
		allowAgents: agent.subagents && typeof agent.subagents === "object" ? agent.subagents.allowAgents : void 0,
		pathLabel: `${path}.subagents.allowAgents`,
		configuredTargetIds
	}));
	return hits;
}
/** Format warnings for stale subagent allowlist entries. */
function collectStaleSubagentAllowlistWarnings(params) {
	if (params.hits.length === 0) return [];
	return [...params.hits.map((hit) => `- ${hit.pathLabel}: stale subagent target "${hit.agentId}" is not in the configured agent registry.`), `- Run "${params.doctorFixCommand}" to remove stale subagent target ids, or add a configured agent or ACP target for each intended target.`];
}
function filterAllowAgents(params) {
	return params.allowAgents.filter((entry) => {
		const trimmed = entry.trim();
		return !trimmed || trimmed === "*" || !params.staleTargetIds.has(normalizeAgentId(trimmed));
	});
}
/** Remove stale subagent allowlist entries while preserving valid targets and wildcards. */
function maybeRepairStaleSubagentAllowlists(cfg) {
	const hits = scanStaleSubagentAllowlistReferences(cfg);
	if (hits.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const hitsByPath = /* @__PURE__ */ new Map();
	for (const hit of hits) hitsByPath.set(hit.pathLabel, [...hitsByPath.get(hit.pathLabel) ?? [], hit]);
	const defaultsHits = hitsByPath.get("agents.defaults.subagents.allowAgents") ?? [];
	if (defaultsHits.length > 0 && Array.isArray(next.agents?.defaults?.subagents?.allowAgents)) {
		const staleTargetIds = new Set(defaultsHits.map((hit) => hit.normalizedAgentId));
		next.agents.defaults.subagents.allowAgents = filterAllowAgents({
			allowAgents: next.agents.defaults.subagents.allowAgents,
			staleTargetIds
		});
	}
	for (const { agent, path } of listMutableCodexRouteAgentEntries(next)) {
		const pathLabel = `${path}.subagents.allowAgents`;
		const agentHits = hitsByPath.get(pathLabel) ?? [];
		const subagents = agent.subagents && typeof agent.subagents === "object" ? agent.subagents : void 0;
		if (agentHits.length === 0 || !Array.isArray(subagents?.allowAgents)) continue;
		const staleTargetIds = new Set(agentHits.map((hit) => hit.normalizedAgentId));
		subagents.allowAgents = filterAllowAgents({
			allowAgents: subagents.allowAgents,
			staleTargetIds
		});
	}
	return {
		config: next,
		changes: [...hitsByPath.entries()].map(([pathLabel, pathHits]) => {
			const ids = pathHits.map((hit) => hit.agentId).join(", ");
			return `- ${pathLabel}: removed ${pathHits.length} stale subagent target id${pathHits.length === 1 ? "" : "s"} (${ids})`;
		})
	};
}
//#endregion
export { maybeRepairStaleSubagentAllowlists as n, scanStaleSubagentAllowlistReferences as r, collectStaleSubagentAllowlistWarnings as t };
