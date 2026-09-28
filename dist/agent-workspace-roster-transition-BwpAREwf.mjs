import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, l as resolveAgentWorkspaceDir, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
//#region src/config/agent-workspace-roster-transition.ts
function pinSurvivorWorkspaceForRosterCollapse(sourceConfig, targetConfig, env = process.env) {
	const sourceEntries = listAgentEntries(sourceConfig);
	const targetEntries = listAgentEntries(targetConfig);
	if (sourceEntries.length <= 1 || targetEntries.length !== 1) return {
		config: targetConfig,
		insertedPaths: []
	};
	const survivorId = normalizeAgentId(targetEntries[0].id);
	if (!sourceEntries.some((entry) => normalizeAgentId(entry.id) === survivorId)) return {
		config: targetConfig,
		insertedPaths: []
	};
	const targetAgents = targetConfig.agents ?? {};
	const entries = targetAgents.entries ? { ...targetAgents.entries } : toAgentEntriesRecord(targetEntries);
	const entryKey = Object.keys(entries).find((candidate) => normalizeAgentId(candidate) === survivorId);
	const entry = entryKey ? entries[entryKey] : void 0;
	const workspaceNeedsPin = entry !== void 0 && (!Object.hasOwn(entry, "workspace") || typeof entry.workspace === "string" && entry.workspace.trim().length === 0);
	if (!entryKey || !entry || !workspaceNeedsPin) return {
		config: targetConfig,
		insertedPaths: []
	};
	entries[entryKey] = {
		...entry,
		workspace: resolveAgentWorkspaceDir(sourceConfig, survivorId, env)
	};
	const { list: _legacyList, ...canonicalAgents } = targetAgents;
	return {
		config: {
			...targetConfig,
			agents: {
				...canonicalAgents,
				entries
			}
		},
		insertedPaths: [[
			"agents",
			"entries",
			entryKey,
			"workspace"
		]]
	};
}
//#endregion
export { pinSurvivorWorkspaceForRosterCollapse as t };
