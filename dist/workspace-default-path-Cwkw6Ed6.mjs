import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-Dc6nN6HB.mjs";
import { r as resolveProfileStateDir } from "./profile-utils-BsmgdpgZ.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import path from "node:path";
import os from "node:os";
//#region src/agents/workspace-default-path.ts
/**
* Default agent workspace resolver.
*
* Derives the process workspace directory from env, profile, and home-directory state.
*/
/** Resolve the default agent workspace directory from env/profile/home state. */
function resolveDefaultAgentWorkspaceDir(env = process.env, homedir = os.homedir) {
	const workspaceDir = env.OPENCLAW_WORKSPACE_DIR?.trim();
	if (workspaceDir) return path.resolve(workspaceDir);
	if (env.OPENCLAW_STATE_DIR?.trim()) return path.join(resolveStateDir(env, homedir), "workspace");
	const home = resolveRequiredHomeDir(env, homedir);
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (profile && normalizeOptionalLowercaseString(profile) !== "default") return path.join(resolveProfileStateDir(profile, env, homedir), "workspace");
	return path.join(home, ".openclaw", "workspace");
}
//#endregion
export { resolveDefaultAgentWorkspaceDir as t };
