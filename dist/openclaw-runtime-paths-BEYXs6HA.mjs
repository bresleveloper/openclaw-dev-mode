import { i as resolveRequiredHomeDir, o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { i as resolveStateDirFromHome } from "./state-dir-C8s3cOPX.mjs";
import "./agent-roster-gkYP38su.mjs";
import { t as resolveDefaultAgentWorkspaceDir$1 } from "./workspace-default-path-BccyWLRI.mjs";
import "./root-memory-files-B07diPtM.mjs";
import path from "node:path";
//#region packages/memory-host-sdk/src/host/openclaw-runtime-paths.ts
/** Keep effective-home expansion at the memory-host boundary, before state selection. */
function resolveStateDir(env = process.env) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveUserPath(override, env);
	const home = resolveRequiredHomeDir(env);
	return resolveStateDirFromHome(env, () => home);
}
/** Preserve memory-host override expansion without re-expanding an effective home. */
function resolveDefaultAgentWorkspaceDir(env) {
	const workspaceDir = env.OPENCLAW_WORKSPACE_DIR?.trim();
	if (workspaceDir) return resolveUserPath(workspaceDir, env);
	if (env.OPENCLAW_STATE_DIR?.trim()) return path.join(resolveStateDir(env), "workspace");
	return resolveDefaultAgentWorkspaceDir$1(env);
}
//#endregion
export { resolveStateDir as n, resolveDefaultAgentWorkspaceDir as t };
