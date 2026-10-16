import path from "node:path";
//#region src/skills/loading/workspace-skill-roots.ts
function resolveSessionSkillExecutionWorkspace(canonicalWorkspaceDir, executionWorkspaceDir) {
	return canonicalWorkspaceDir ? {
		executionWorkspaceDir: canonicalWorkspaceDir,
		executionWorkspaceFileHost: "gateway"
	} : { executionWorkspaceDir };
}
function normalizeWorkspaceSkillRoots(roots) {
	const agentWorkspaceDir = path.resolve(roots.agentWorkspaceDir);
	const executionWorkspaceDir = roots.executionWorkspaceDir ? path.resolve(roots.executionWorkspaceDir) : void 0;
	return executionWorkspaceDir && (executionWorkspaceDir !== agentWorkspaceDir || roots.executionWorkspaceFileHost) ? {
		agentWorkspaceDir,
		executionWorkspaceDir,
		...roots.executionWorkspaceFileHost ? { executionWorkspaceFileHost: roots.executionWorkspaceFileHost } : {}
	} : { agentWorkspaceDir };
}
function resolveWorkspaceSkillDirectories(workspaceDir, workspaceOnly = false) {
	const workspace = {
		dir: path.resolve(workspaceDir, "skills"),
		source: "openclaw-workspace"
	};
	return workspaceOnly ? [workspace] : [{
		dir: path.resolve(workspaceDir, ".agents", "skills"),
		source: "agents-skills-project"
	}, workspace];
}
//#endregion
export { resolveSessionSkillExecutionWorkspace as n, resolveWorkspaceSkillDirectories as r, normalizeWorkspaceSkillRoots as t };
