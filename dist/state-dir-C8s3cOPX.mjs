import { i as resolveRequiredHomeDir, n as resolveHomeRelativePath } from "./home-dir-CtsdYvX3.mjs";
import os from "node:os";
import path from "node:path";
//#region src/config/state-dir.ts
function resolveLegacyStateDirs(homedir = resolveRequiredHomeDir) {
	return [path.join(homedir(), ".clawdbot")];
}
function resolveNewStateDir(homedir = resolveRequiredHomeDir) {
	return path.join(homedir(), ".openclaw");
}
/**
* State directory for mutable data (sessions, logs, caches).
* Can be overridden via OPENCLAW_STATE_DIR.
* Default: ~/.openclaw
*/
function resolveStateDir(env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveHomeRelativePath(override, {
		env,
		homedir: effectiveHomedir
	});
	return resolveStateDirFromHome(env, effectiveHomedir);
}
/** Select a default state directory from the caller's already resolved home. */
function resolveStateDirFromHome(_env, effectiveHomedir) {
	return resolveNewStateDir(effectiveHomedir);
}
//#endregion
export { resolveStateDirFromHome as i, resolveNewStateDir as n, resolveStateDir as r, resolveLegacyStateDirs as t };
