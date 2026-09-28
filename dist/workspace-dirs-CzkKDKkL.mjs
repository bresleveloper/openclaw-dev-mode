import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { E as listAgentEntries, O as listAgentIds, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
//#region src/agents/workspace-dirs.ts
/** Lists unique workspace directories for configured agents and the default agent. */
function listAgentWorkspaceDirs(cfg, env = process.env) {
	const dirs = /* @__PURE__ */ new Set();
	for (const agentId of listAgentIds(cfg)) dirs.add(resolveAgentWorkspaceDir(cfg, agentId, env));
	return [...dirs];
}
/** Lists only entry-authored workspace paths without requiring a valid default marker. */
function listExplicitAgentWorkspaceDirs(cfg) {
	const dirs = /* @__PURE__ */ new Set();
	for (const entry of listAgentEntries(cfg)) {
		const workspace = typeof entry.workspace === "string" ? entry.workspace.trim() : "";
		if (workspace) dirs.add(resolveUserPath(workspace));
	}
	return [...dirs];
}
//#endregion
export { listExplicitAgentWorkspaceDirs as n, listAgentWorkspaceDirs as t };
