import { i as resolveRequiredHomeDir, n as resolveHomeRelativePath } from "./home-dir-Dc6nN6HB.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
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
function resolveStateDirFromHome(env, effectiveHomedir) {
	const newDir = resolveNewStateDir(effectiveHomedir);
	if (isFastTestRuntimeEnv(env) || fs.existsSync(newDir)) return newDir;
	return resolveLegacyStateDirs(effectiveHomedir).find((dir) => fs.existsSync(dir)) ?? newDir;
}
//#endregion
export { resolveStateDirFromHome as i, resolveNewStateDir as n, resolveStateDir as r, resolveLegacyStateDirs as t };
