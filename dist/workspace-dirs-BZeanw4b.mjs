import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
//#region src/agents/workspace-dirs.ts
function listAgentWorkspaceDirs(cfg, env = process.env) {
	return [...new Set(listAgentIds(cfg).map((agentId) => resolveAgentWorkspaceDir(cfg, agentId, env)))];
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
