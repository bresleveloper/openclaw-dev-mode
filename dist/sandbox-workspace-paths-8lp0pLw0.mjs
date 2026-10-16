import { compileFunction } from "node:vm";
//#region src/shared/sandbox-workspace-paths.ts
/** Reserved runtime projection, not project-owned .openclaw content. */
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS = [".openclaw", "sandbox-skills"];
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS.join("/");
const MANAGED_SANDBOX_SKILLS_PATH_JS = `
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = ${JSON.stringify(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE)};
function isManagedSandboxSkillsPath(relativePath) {
  return (
    relativePath === MATERIALIZED_SANDBOX_SKILLS_WORKSPACE ||
    relativePath.startsWith(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE + "/")
  );
}`;
const isManagedSandboxSkillsPath = compileFunction(`${MANAGED_SANDBOX_SKILLS_PATH_JS}\nreturn isManagedSandboxSkillsPath;`)();
//#endregion
export { isManagedSandboxSkillsPath as i, MATERIALIZED_SANDBOX_SKILLS_WORKSPACE as n, MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS as r, MANAGED_SANDBOX_SKILLS_PATH_JS as t };
