import { t as resolveNodeHostExecutable } from "./node-host-BLmevr7Y.mjs";
import { t as resolveClaudeCatalogHomeDir } from "./session-catalog-home-DC4c4SgQ.mjs";
import fs from "node:fs";
import path from "node:path";
//#region extensions/anthropic/session-catalog-executable.ts
const BROKEN_NPM_SHIM_MARKER = "Error: claude native binary not installed.";
const BROKEN_NPM_INSTALL_HINT = "node_modules/@anthropic-ai/claude-code/install.cjs";
const CLAUDE_PACKAGE_SHIM_TARGET = /(?:\$basedir|%dp0%)\/([^"'\r\n]*?node_modules\/@anthropic-ai\/claude-code\/bin\/claude\.exe)/giu;
const MAX_SHIM_PROBE_BYTES = 4096;
let cachedNativeReplacement;
function readSmallExecutableSource(executable) {
	try {
		const realPath = fs.realpathSync(executable);
		if (fs.statSync(realPath).size > MAX_SHIM_PROBE_BYTES) return;
		return {
			realPath,
			source: fs.readFileSync(realPath, "utf8")
		};
	} catch {
		return;
	}
}
function isFailedClaudeNpmPlaceholder(source) {
	return source.includes(BROKEN_NPM_SHIM_MARKER) && source.includes(BROKEN_NPM_INSTALL_HINT);
}
function isBrokenClaudeNpmShim(executable) {
	const shim = readSmallExecutableSource(executable);
	if (!shim) return false;
	if (isFailedClaudeNpmPlaceholder(shim.source)) return true;
	const normalizedSource = shim.source.replaceAll("\\", "/");
	const baseDirectories = /* @__PURE__ */ new Set([path.dirname(executable), path.dirname(shim.realPath)]);
	for (const match of normalizedSource.matchAll(CLAUDE_PACKAGE_SHIM_TARGET)) {
		const relativeTarget = match[1];
		if (!relativeTarget) continue;
		for (const baseDirectory of baseDirectories) {
			const target = readSmallExecutableSource(path.resolve(baseDirectory, relativeTarget));
			if (target && isFailedClaudeNpmPlaceholder(target.source)) return true;
		}
	}
	return false;
}
function resolveExecutableFromDirectory(directory, env) {
	const resolution = resolveNodeHostExecutable("claude", {
		env,
		pathEnv: directory,
		strategy: "direct"
	});
	return resolution && !isBrokenClaudeNpmShim(resolution.executable) ? resolution.executable : void 0;
}
function resolveClaudeDesktopExecutable(homeDir, env) {
	if (process.platform !== "darwin") return;
	const versionsRoot = path.join(homeDir, "Library", "Application Support", "Claude", "claude-code");
	let versions;
	try {
		versions = fs.readdirSync(versionsRoot, { withFileTypes: true });
	} catch {
		return;
	}
	versions.sort((left, right) => right.name.localeCompare(left.name, void 0, {
		numeric: true,
		sensitivity: "base"
	}));
	for (const version of versions) {
		if (!version.isDirectory()) continue;
		const executable = resolveExecutableFromDirectory(path.join(versionsRoot, version.name, "claude.app", "Contents", "MacOS"), env);
		if (executable) return executable;
	}
}
function resolveNativeReplacement(env) {
	const homeDir = resolveClaudeCatalogHomeDir(env);
	const cacheKey = `${process.platform}\0${homeDir}`;
	if (cachedNativeReplacement?.key === cacheKey) return cachedNativeReplacement.executable ?? void 0;
	const executable = resolveExecutableFromDirectory(path.join(homeDir, ".local", "bin"), env) ?? resolveClaudeDesktopExecutable(homeDir, env);
	cachedNativeReplacement = {
		key: cacheKey,
		executable: executable ?? null
	};
	return executable;
}
function resolveClaudeTerminalExecutable(env = process.env, options = {}) {
	const shellResolution = resolveNodeHostExecutable("claude", {
		env,
		pathEnv: env.PATH ?? env.Path ?? "",
		strategy: options.pathStrategy ?? "prefer"
	});
	if (shellResolution && !isBrokenClaudeNpmShim(shellResolution.executable)) return shellResolution;
	const nativeExecutable = resolveNativeReplacement(env);
	if (!nativeExecutable) return;
	return {
		executable: nativeExecutable,
		...shellResolution?.pathEnv ? { pathEnv: shellResolution.pathEnv } : {}
	};
}
//#endregion
export { resolveClaudeTerminalExecutable as t };
