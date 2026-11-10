import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-CtsdYvX3.mjs";
import { r as resolveProfileStateDir } from "./profile-utils-Bt5nN5dt.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import os from "node:os";
import path from "node:path";
//#region src/agents/workspace-default-path.ts
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
