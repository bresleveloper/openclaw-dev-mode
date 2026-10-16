import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as resolveAgentWorkspaceDir, x as toAgentEntriesRecord } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
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
	return {
		config: {
			...targetConfig,
			agents: {
				...targetAgents,
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
