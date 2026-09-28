//#region src/shared/sandbox-workspace-paths.ts
/** Reserved runtime projection, not project-owned .openclaw content. */
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS = [".openclaw", "sandbox-skills"];
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS.join("/");
function isManagedSandboxSkillsPath(relativePath) {
	return relativePath === MATERIALIZED_SANDBOX_SKILLS_WORKSPACE || relativePath.startsWith(`${MATERIALIZED_SANDBOX_SKILLS_WORKSPACE}/`);
}
//#endregion
export { MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS as n, isManagedSandboxSkillsPath as r, MATERIALIZED_SANDBOX_SKILLS_WORKSPACE as t };
