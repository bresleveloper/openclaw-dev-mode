import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/infra/brew.ts
function isExecutable(filePath) {
	try {
		fs.accessSync(filePath, fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function resolveBrewFromPath(pathEnv = process.env.PATH) {
	for (const dir of (pathEnv ?? "").split(path.delimiter)) {
		const trimmed = dir.trim();
		if (!trimmed || !path.isAbsolute(trimmed)) continue;
		const candidate = path.join(trimmed, "brew");
		if (isExecutable(candidate)) return candidate;
	}
}
/** Returns standard Homebrew bin directories suitable for PATH augmentation. */
function resolveBrewPathDirs(opts) {
	const homeDir = opts?.homeDir ?? os.homedir();
	return [
		path.join(homeDir, ".linuxbrew", "bin"),
		path.join(homeDir, ".linuxbrew", "sbin"),
		"/home/linuxbrew/.linuxbrew/bin",
		"/home/linuxbrew/.linuxbrew/sbin",
		"/opt/homebrew/bin",
		"/usr/local/bin"
	];
}
/** Resolves an executable `brew` path from trusted PATH entries or standard install roots. */
function resolveBrewExecutable(opts) {
	const homeDir = opts?.homeDir ?? os.homedir();
	const pathBrew = resolveBrewFromPath();
	if (pathBrew) return pathBrew;
	return [
		path.join(homeDir, ".linuxbrew", "bin", "brew"),
		"/home/linuxbrew/.linuxbrew/bin/brew",
		"/opt/homebrew/bin/brew",
		"/usr/local/bin/brew"
	].find(isExecutable);
}
/** Recognize formula-owned OpenClaw files and keep service paths independent of the keg version. */
async function resolveBrewOpenClawPath(inputPath) {
	const match = /^(.*)\/(?:Cellar\/openclaw-cli\/[^/]+|opt\/openclaw-cli)(\/libexec(?:\/.*)?)$/u.exec(inputPath);
	if (!match || process.platform === "win32") return null;
	const [, prefix, suffix] = match;
	if (![process.env.HOMEBREW_PREFIX, ...resolveBrewPathDirs().map((dir) => path.dirname(dir))].some((value) => value && path.isAbsolute(value) && path.resolve(value) === prefix)) {
		const brew = resolveBrewExecutable();
		if (!brew) return null;
		const { runCommandWithTimeout } = await import("./exec-C89-C-hl.mjs");
		const result = await runCommandWithTimeout([brew, "--prefix"], { timeoutMs: 5e3 }).catch(() => null);
		if (result?.code !== 0 || result.stdout.trim() !== prefix) return null;
	}
	return path.join(prefix, "opt", "openclaw-cli", suffix);
}
//#endregion
export { resolveBrewOpenClawPath as n, resolveBrewPathDirs as r, resolveBrewExecutable as t };
