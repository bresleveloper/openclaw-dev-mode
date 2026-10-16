import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { r as isPathInside, s as safeStatSync } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveBrewPathDirs } from "./brew-BMTI2ldy.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/infra/path-env.ts
function isExecutable(filePath) {
	try {
		fs.accessSync(filePath, fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function isKnownPathDir(existingPathParts, dirPath) {
	return existingPathParts.has(dirPath) || safeStatSync(dirPath)?.isDirectory() === true;
}
function realpathExistingPath(candidate) {
	const suffix = [];
	let current = candidate;
	while (true) try {
		return path.resolve(fs.realpathSync.native(current), ...suffix.toReversed());
	} catch {
		const parent = path.dirname(current);
		if (parent === current) return;
		suffix.push(path.basename(current));
		current = parent;
	}
}
function isFilesystemRoot(dirPath) {
	return path.dirname(dirPath) === dirPath;
}
function normalizeTrustedPackageManagerRoot(params) {
	const trimmed = params.value?.trim();
	if (!trimmed || !path.isAbsolute(trimmed)) return;
	const normalized = path.normalize(trimmed);
	if (normalized === "/proc" || normalized.startsWith(`/proc${path.sep}`)) return;
	if (!params.cwd) return normalized;
	const cwd = path.resolve(params.cwd);
	const homeDir = path.resolve(params.homeDir);
	if (cwd === homeDir || isFilesystemRoot(cwd)) return normalized;
	if (isPathInside(cwd, normalized)) return;
	const realCandidate = realpathExistingPath(normalized);
	const realCwd = realpathExistingPath(cwd);
	const realHome = realpathExistingPath(homeDir);
	if (realCwd && realCwd !== realHome && !isFilesystemRoot(realCwd) && realCandidate && isPathInside(realCwd, realCandidate)) return;
	return normalized;
}
function resolveMiseDataDir(params) {
	const miseDataDir = process.env.MISE_DATA_DIR;
	if (miseDataDir !== void 0) return miseDataDir;
	const xdgDataHome = process.env.XDG_DATA_HOME;
	if (xdgDataHome !== void 0) return path.join(xdgDataHome, "mise");
	if (params.platform === "win32") {
		const localAppData = process.env.LOCALAPPDATA ?? path.join(params.homeDir, "AppData", "Local");
		return path.join(localAppData, "mise");
	}
	return path.join(params.homeDir, ".local", "share", "mise");
}
function candidateBinDirs(opts, existingPathParts) {
	const execPath = opts.execPath ?? process.execPath;
	const cwd = opts.cwd ?? tryProcessCwd();
	const homeDir = opts.homeDir ?? os.homedir();
	const platform = opts.platform ?? process.platform;
	const prepend = [];
	const append = [];
	const execDir = path.dirname(execPath);
	if (isExecutable(execPath)) prepend.push(execDir);
	if (isExecutable(path.join(execDir, "openclaw"))) prepend.push(execDir);
	if ((opts.allowProjectLocalBin === true || isTruthyEnvValue(process.env.OPENCLAW_ALLOW_PROJECT_LOCAL_BIN)) && cwd) {
		const localBinDir = path.join(cwd, "node_modules", ".bin");
		if (isExecutable(path.join(localBinDir, "openclaw"))) append.push(localBinDir);
	}
	prepend.push("/usr/bin", "/bin");
	append.push(...resolveBrewPathDirs({ homeDir }).filter((candidate) => platform !== "darwin" || !candidate.split(path.sep).includes(".linuxbrew") || existingPathParts.has(candidate)));
	const pnpmHome = normalizeTrustedPackageManagerRoot({
		value: process.env.PNPM_HOME,
		cwd,
		homeDir
	});
	if (pnpmHome) append.push(pnpmHome, path.join(pnpmHome, "bin"));
	const npmPrefix = normalizeTrustedPackageManagerRoot({
		value: process.env.NPM_CONFIG_PREFIX,
		cwd,
		homeDir
	});
	if (npmPrefix) append.push(path.join(npmPrefix, "bin"));
	const miseDataDir = resolveMiseDataDir({
		homeDir,
		platform
	});
	const miseShims = path.join(miseDataDir, "shims");
	if (isKnownPathDir(existingPathParts, miseShims)) append.push(miseShims);
	if (platform === "darwin") append.push(path.join(homeDir, "Library", "pnpm", "bin"), path.join(homeDir, "Library", "pnpm"));
	if (process.env.XDG_BIN_HOME) append.push(process.env.XDG_BIN_HOME);
	append.push(path.join(homeDir, ".local", "bin"));
	append.push(path.join(homeDir, ".npm-global", "bin"));
	append.push(path.join(homeDir, ".local", "share", "pnpm", "bin"));
	append.push(path.join(homeDir, ".local", "share", "pnpm"));
	append.push(path.join(homeDir, ".bun", "bin"));
	append.push(path.join(homeDir, ".yarn", "bin"));
	return {
		prepend: prepend.filter((candidate) => isKnownPathDir(existingPathParts, candidate)),
		append: append.filter((candidate) => isKnownPathDir(existingPathParts, candidate))
	};
}
/**
* Best-effort PATH bootstrap so skills that require the `openclaw` CLI can run
* under launchd/minimal environments (and inside the macOS app bundle).
*/
function ensureOpenClawCliOnPath(opts = {}) {
	if (isTruthyEnvValue(process.env.OPENCLAW_PATH_BOOTSTRAPPED)) return;
	process.env.OPENCLAW_PATH_BOOTSTRAPPED = "1";
	const existing = opts.pathEnv ?? process.env.PATH ?? "";
	const { prepend, append } = candidateBinDirs(opts, new Set(normalizeStringEntries(existing.split(path.delimiter))));
	if (prepend.length === 0 && append.length === 0) return;
	const merged = normalizeUniqueStringEntries([
		...prepend,
		...existing.split(path.delimiter),
		...append
	]).join(path.delimiter);
	if (merged) process.env.PATH = merged;
}
//#endregion
export { ensureOpenClawCliOnPath as t };
