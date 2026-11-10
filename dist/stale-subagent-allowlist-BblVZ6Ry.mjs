import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as normalizeOptionalAgentId } from "./session-key-CSDERtm3.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-FIsucmo1.mjs";
//#region src/commands/doctor/shared/stale-subagent-allowlist.ts
function collectConfiguredSubagentTargetIds(cfg) {
	const ids = new Set(listAgentIds(cfg));
	const targets = [
		...listAgentEntries(cfg).flatMap((agent) => agent.runtime?.type === "acp" ? [agent.runtime.acp?.agent] : []),
		cfg.acp?.defaultAgent,
		...(cfg.acp?.allowedAgents ?? []).filter((entry) => entry.trim() !== "*")
	];
	for (const target of targets) {
		const acpAgent = normalizeOptionalAgentId(target);
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
		if (params.configuredTargetIds.has(normalizedAgentId) || seen.has(normalizedAgentId)) continue;
		seen.add(normalizedAgentId);
		hits.push({
			pathLabel: params.pathLabel,
			agentId: trimmed,
			normalizedAgentId
		});
	}
	return hits;
}
function listSubagentAllowlists(cfg) {
	return [{
		agent: cfg.agents?.defaults,
		path: "agents.defaults"
	}, ...listMutableCodexRouteAgentEntries(cfg)].flatMap(({ agent, path }) => {
		const subagents = agent?.subagents;
		return subagents && typeof subagents === "object" && "allowAgents" in subagents ? [{
			subagents,
			pathLabel: `${path}.subagents.allowAgents`
		}] : [];
	});
}
function scanStaleSubagentAllowlistReferences(cfg) {
	const configuredTargetIds = collectConfiguredSubagentTargetIds(cfg);
	return listSubagentAllowlists(cfg).flatMap(({ subagents, pathLabel }) => collectStaleAllowlistEntries({
		allowAgents: subagents.allowAgents,
		pathLabel,
		configuredTargetIds
	}));
}
function collectStaleSubagentAllowlistWarnings(params) {
	if (params.hits.length === 0) return [];
	return [...params.hits.map((hit) => `- ${hit.pathLabel}: stale subagent target "${hit.agentId}" is not in the configured agent registry.`), `- Run "${params.doctorFixCommand}" to remove stale subagent target ids, or add a configured agent or ACP target for each intended target.`];
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
	for (const { subagents, pathLabel } of listSubagentAllowlists(next)) {
		const pathHits = hitsByPath.get(pathLabel);
		if (!pathHits || !Array.isArray(subagents.allowAgents)) continue;
		const staleTargetIds = new Set(pathHits.map((hit) => hit.normalizedAgentId));
		subagents.allowAgents = subagents.allowAgents.filter((entry) => {
			if (typeof entry !== "string") return true;
			const trimmed = entry.trim();
			return !trimmed || trimmed === "*" || !staleTargetIds.has(normalizeAgentId(trimmed));
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
