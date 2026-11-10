import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { S as toAgentEntriesRecord, f as resolveAgentWorkspaceDir, v as resolveEffectiveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { o as readAgentDeletionJournalStatusInWorker } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
//#region src/config/agent-workspace-roster-transition.ts
var AgentDeletionTargetsPendingError = class extends Error {};
/** Gateway deletion captures its targets under the same lock as config writers. */
async function assertAgentDeletionTargetsUnchanged(sourceConfig, targetConfig, env = process.env) {
	const existing = new Set(listAgentIds(sourceConfig));
	const candidates = new Set(listAgentIds(targetConfig));
	if (sourceConfig.session?.store !== targetConfig.session?.store) {
		const { listPendingAgentDeletionJournalsAsync } = await import("./agent-deletion-journal-hMj5AtN7.mjs");
		const { entries, manualClawAgentIds } = await listPendingAgentDeletionJournalsAsync({ env });
		for (const agentId of [...entries.map((entry) => entry.agentId), ...manualClawAgentIds]) if (resolveSessionStorePathCore(sourceConfig.session?.store, {
			agentId,
			env
		}) !== resolveSessionStorePathCore(targetConfig.session?.store, {
			agentId,
			env
		})) candidates.add(agentId);
	}
	for (const agentId of candidates) {
		if (existing.has(agentId) && resolveAgentWorkspaceDir(sourceConfig, agentId, env) === resolveAgentWorkspaceDir(targetConfig, agentId, env) && resolveEffectiveAgentDir(sourceConfig, agentId, { env }) === resolveEffectiveAgentDir(targetConfig, agentId, { env }) && resolveSessionStorePathCore(sourceConfig.session?.store, {
			agentId,
			env
		}) === resolveSessionStorePathCore(targetConfig.session?.store, {
			agentId,
			env
		})) continue;
		if (await readAgentDeletionJournalStatusInWorker(agentId, { env }) === "pending") throw new AgentDeletionTargetsPendingError(`Agent "${agentId}" deletion cleanup is still pending; finish or retry its deletion before changing its workspace, agent directory, or session store.`);
	}
}
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
export { assertAgentDeletionTargetsUnchanged as n, pinSurvivorWorkspaceForRosterCollapse as r, AgentDeletionTargetsPendingError as t };
