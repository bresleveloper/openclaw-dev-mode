import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as resolveEffectiveHomeDir, r as resolveOsHomeDir, t as normalizeHomeDirValue } from "./home-dir-D0b-ywue.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
//#region src/infra/home-dir.ts
const userPathBaseDirectory = resolveGlobalSingleton(Symbol.for("openclaw.userPathBaseDirectory"), () => new AsyncLocalStorage());
/** Preserve invocation-relative paths while an updater parks its physical cwd. */
function withUserPathBaseDirectory(cwd, operation) {
	return cwd === void 0 ? operation() : userPathBaseDirectory.run(path.resolve(cwd), operation);
}
/** Resolves the effective home or falls back to cwd when no home source exists. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.");
}
/** Resolves the OS home or falls back to cwd when no OS home source exists. */
function resolveRequiredOsHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveOsHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OS home: set HOME or USERPROFILE, or run from an existing directory.");
}
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
function expandHomePrefix(input, opts) {
	if (!input.startsWith("~")) return input;
	const home = normalizeHomeDirValue(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
	if (!home) return input;
	return input.replace(/^~(?=$|[\\/])/, () => home);
}
function resolvePathWithHome(input, opts, resolveHome) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	const expanded = trimmed.startsWith("~") ? expandHomePrefix(trimmed, {
		home: resolveHome(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
		env: opts?.env,
		homedir: opts?.homedir
	}) : trimmed;
	const base = userPathBaseDirectory.getStore();
	return base ? path.resolve(base, expanded) : path.resolve(expanded);
}
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
function resolveHomeRelativePath(input, opts) {
	return resolvePathWithHome(input, opts, resolveRequiredHomeDir);
}
/** Resolves a user path against the effective home, preserving an empty input. */
function resolveUserPath(input, env = process.env, homedir = os.homedir) {
	if (!input) return "";
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
/** Resolves a user-supplied path against the OS home, ignoring OPENCLAW_HOME. */
function resolveOsHomeRelativePath(input, opts) {
	return resolvePathWithHome(input, opts, resolveRequiredOsHomeDir);
}
//#endregion
export { resolveRequiredOsHomeDir as a, resolveRequiredHomeDir as i, resolveHomeRelativePath as n, resolveUserPath as o, resolveOsHomeRelativePath as r, withUserPathBaseDirectory as s, expandHomePrefix as t };
