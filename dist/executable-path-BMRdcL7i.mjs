import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/executable-path.ts
function isDriveLessWindowsRootedPath(value) {
	return process.platform === "win32" && /^:[\\/]/.test(value);
}
function resolveExecutablePathCandidate(rawExecutable, options) {
	const expanded = rawExecutable.startsWith("~") ? expandHomePrefix(rawExecutable, { env: options?.env }) : rawExecutable;
	if (isDriveLessWindowsRootedPath(expanded)) return;
	const hasPathSeparator = expanded.includes("/") || expanded.includes("\\");
	if (options?.requirePathSeparator && !hasPathSeparator) return;
	if (!hasPathSeparator) return expanded;
	if (path.isAbsolute(expanded)) return path.resolve(expanded);
	const base = options?.cwd && options.cwd.trim() ? options.cwd.trim() : process.cwd();
	return path.resolve(base, expanded);
}
function resolveWindowsExecutableExtensions(executable, env, includeExtensionless = true) {
	if (process.platform !== "win32") return [""];
	if (path.extname(executable).length > 0) return [""];
	const extensions = [...resolveWindowsExecutableExtSet(env)];
	return includeExtensionless ? ["", ...extensions] : extensions;
}
function resolveWindowsExecutableExtSet(env) {
	return new Set((resolveEnvironmentValue(env, "PATHEXT") ?? resolveEnvironmentValue(process.env, "PATHEXT") ?? ".EXE;.CMD;.BAT;.COM").split(";").map((ext) => normalizeLowercaseStringOrEmpty(ext)).filter(Boolean));
}
function isRegularFile(filePath) {
	try {
		return fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
const WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS = /* @__PURE__ */ new Set([
	".com",
	".exe",
	".bat",
	".cmd"
]);
/** Checks a supplied path without PATH lookup or lexical normalization. */
function isExecutableFile(filePath, options) {
	if (!isRegularFile(filePath)) return false;
	try {
		if (process.platform === "win32") {
			const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
			if (!ext || WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS.has(ext)) return true;
			return resolveWindowsExecutableExtSet(options?.env).has(ext);
		}
		fs.accessSync(filePath, fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
const EXECUTABLE_PATH_CACHE_TTL_MS = 6e4;
const EXECUTABLE_PATH_CACHE_MAX_ENTRIES = 128;
const executablePathCache = /* @__PURE__ */ new Map();
function cacheExecutablePath(key, resolved) {
	executablePathCache.set(key, {
		expiresAt: Date.now() + EXECUTABLE_PATH_CACHE_TTL_MS,
		resolved: resolved ?? null
	});
	pruneMapToMaxSize(executablePathCache, EXECUTABLE_PATH_CACHE_MAX_ENTRIES);
}
function executablePathCacheKey(executable, pathEnv, env, includeExtensionless, requestedCwd) {
	const pathExt = resolveEnvironmentValue(env, "PATHEXT") ?? resolveEnvironmentValue(process.env, "PATHEXT") ?? "";
	let cwd = "";
	try {
		cwd = requestedCwd ?? process.cwd();
	} catch {}
	return `${process.platform}\0${executable}\0${pathEnv}\0${pathExt}\0${includeExtensionless !== false}\0${cwd}\0${requestedCwd !== void 0}`;
}
/** Clears process-local PATH probe results after the runtime environment changes. */
function clearExecutablePathCache() {
	executablePathCache.clear();
}
function resolveExecutableFromPathEnv(executable, pathEnv, env, options) {
	const cwd = options?.cwd?.trim() ? path.resolve(options.cwd.trim()) : void 0;
	const useCache = options?.useCache !== false;
	const cacheKey = executablePathCacheKey(executable, pathEnv, env, options?.includeExtensionless, cwd);
	const cached = useCache ? executablePathCache.get(cacheKey) : void 0;
	const now = Date.now();
	if (cached && cached.expiresAt > now) {
		cached.expiresAt = now + EXECUTABLE_PATH_CACHE_TTL_MS;
		executablePathCache.delete(cacheKey);
		executablePathCache.set(cacheKey, cached);
		return cached.resolved ?? void 0;
	}
	if (cached) executablePathCache.delete(cacheKey);
	const delimiter = process.platform === "win32" ? ";" : path.delimiter;
	const entries = pathEnv.split(delimiter).filter((entry) => Boolean(entry) || cwd !== void 0 && process.platform !== "win32");
	const extensions = resolveWindowsExecutableExtensions(executable, env, options?.includeExtensionless);
	for (const entry of entries) {
		const hasParentTraversal = process.platform !== "win32" && entry.split("/").includes("..");
		const rawDirectory = cwd !== void 0 && !path.isAbsolute(entry) ? `${cwd}${path.sep}${entry}` : entry;
		for (const ext of extensions) {
			const candidate = hasParentTraversal ? `${rawDirectory}${path.sep}${executable}${ext}` : path.join(cwd === void 0 ? entry : path.resolve(cwd, entry), executable + ext);
			if (isExecutableFile(candidate, { env })) {
				if (useCache) cacheExecutablePath(cacheKey, candidate);
				return candidate;
			}
		}
	}
	if (useCache) cacheExecutablePath(cacheKey, void 0);
}
function resolveExecutablePath(rawExecutable, options) {
	const candidate = resolveExecutablePathCandidate(rawExecutable, options);
	if (!candidate) return;
	if (candidate.includes("/") || candidate.includes("\\")) return isExecutableFile(candidate, options) ? candidate : void 0;
	return resolveExecutableFromPathEnv(candidate, resolveEnvironmentValue(options?.env, "PATH") ?? resolveEnvironmentValue(process.env, "PATH") ?? "", options?.env, {
		cwd: options?.cwd,
		useCache: options?.useCache
	});
}
/**
* On Windows, resolves a bare command name to its full .cmd or .exe path by
* probing PATH/PATHEXT without executing another resolver. On non-Windows this
* is a no-op.
*/
function resolveExecutable(cmd) {
	if (process.platform !== "win32") return cmd;
	if (WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS.has(normalizeLowercaseStringOrEmpty(path.extname(cmd)))) return cmd;
	const entries = (resolveEnvironmentValue(process.env, "PATH") ?? "").split(";").filter(Boolean);
	const extensions = resolveWindowsExecutableExtensions(cmd, process.env);
	const matches = [];
	for (const entry of entries) for (const ext of extensions) {
		const candidate = path.join(entry, cmd + ext);
		if (isExecutableFile(candidate, { env: process.env })) matches.push(candidate);
	}
	const cmdMatch = matches.find((match) => normalizeLowercaseStringOrEmpty(path.extname(match)) === ".cmd");
	if (cmdMatch) return cmdMatch;
	const exeMatch = matches.find((match) => normalizeLowercaseStringOrEmpty(path.extname(match)) === ".exe");
	if (exeMatch) return exeMatch;
	if (matches[0]) return matches[0];
	return cmd;
}
//#endregion
export { resolveExecutableFromPathEnv as a, resolveExecutable as i, isExecutableFile as n, resolveExecutablePath as o, isRegularFile as r, resolveExecutablePathCandidate as s, clearExecutablePathCache as t };
