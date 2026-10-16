import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/skill-workshop-workspace-context.ts
const canonicalSkillWorkspace = new AsyncLocalStorage();
function runWithCanonicalSkillWorkspace(canonicalWorkspaceDir, run) {
	return canonicalWorkspaceDir ? canonicalSkillWorkspace.run(canonicalWorkspaceDir, run) : run();
}
function getCanonicalSkillWorkspace() {
	return canonicalSkillWorkspace.getStore();
}
//#endregion
export { runWithCanonicalSkillWorkspace as n, getCanonicalSkillWorkspace as t };
