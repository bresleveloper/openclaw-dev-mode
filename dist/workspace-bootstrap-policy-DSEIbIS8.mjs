import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as CANONICAL_ROOT_MEMORY_FILENAME } from "./root-memory-files-DBHovRYF.mjs";
import { t as resolveHookConfig } from "./policy-D4HXkRoG.mjs";
import path from "node:path";
import { Minimatch } from "minimatch";
//#region src/agents/workspace-bootstrap-policy.ts
const DEFAULT_AGENTS_FILENAME = "AGENTS.md";
const DEFAULT_SOUL_FILENAME = "SOUL.md";
const DEFAULT_TOOLS_FILENAME = "TOOLS.md";
const DEFAULT_IDENTITY_FILENAME = "IDENTITY.md";
const DEFAULT_USER_FILENAME = "USER.md";
const DEFAULT_BOOTSTRAP_FILENAME = "BOOTSTRAP.md";
const DEFAULT_MEMORY_FILENAME = CANONICAL_ROOT_MEMORY_FILENAME;
const GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES = [
	DEFAULT_AGENTS_FILENAME,
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME
];
/**
* Canonical bootstrap filenames in prompt order. Single source for the runtime
* validation set, the name union, and the Control UI core-files list; a private
* copy anywhere else silently drifts when a file is retired.
*/
const WORKSPACE_BOOTSTRAP_FILENAMES = [
	DEFAULT_AGENTS_FILENAME,
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME,
	DEFAULT_BOOTSTRAP_FILENAME,
	DEFAULT_MEMORY_FILENAME
];
function hasGlobPattern(pattern) {
	return /[?*{}]/u.test(pattern);
}
function normalizeWorkspacePatternPath(value) {
	return value.replaceAll(path.sep, "/").replaceAll("\\", "/").replace(/^\.\/+/u, "");
}
function resolveGlobWalkRoot(pattern) {
	const normalized = normalizeWorkspacePatternPath(pattern);
	const globIndex = normalized.search(/[?*{}]/u);
	if (globIndex === -1) return normalized;
	const slashIndex = normalized.lastIndexOf("/", globIndex);
	return slashIndex === -1 ? "." : normalized.slice(0, slashIndex) || ".";
}
function createBootstrapPatternMatcher(pattern) {
	return new Minimatch(normalizeWorkspacePatternPath(pattern), {
		nocomment: true,
		nonegate: true,
		windowsPathsNoEscape: true
	});
}
/** Resolve the hook's existing paths, patterns, and files keys in precedence order. */
function resolveExtraBootstrapPatterns(cfg) {
	const hookConfig = resolveHookConfig(cfg, "bootstrap-extra-files");
	if (!hookConfig || hookConfig.enabled === false) return [];
	for (const value of [
		hookConfig.paths,
		hookConfig.patterns,
		hookConfig.files
	]) {
		const patterns = normalizeTrimmedStringList(value);
		if (patterns.length > 0) return patterns;
	}
	return [];
}
/** Restrict a workspace adapter to native bootstrap reads and owner-document writes. */
function createWorkspaceBootstrapFilePolicy(params) {
	const workspaceDir = path.resolve(params.workspaceDir);
	const names = new Set(WORKSPACE_BOOTSTRAP_FILENAMES);
	const ownerNames = new Set(GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES);
	const patterns = params.config?.hooks?.internal?.enabled === false ? [] : resolveExtraBootstrapPatterns(params.config);
	const literals = /* @__PURE__ */ new Set();
	const globs = [];
	for (const pattern of patterns) {
		const walkRoot = path.resolve(workspaceDir, resolveGlobWalkRoot(pattern));
		if (pattern.includes("\0") || !isPathInside(workspaceDir, walkRoot)) continue;
		if (hasGlobPattern(pattern)) globs.push({
			walkRoot,
			matcher: createBootstrapPatternMatcher(pattern)
		});
		else literals.add(path.relative(workspaceDir, path.resolve(workspaceDir, pattern)).split(path.sep).join("/"));
	}
	const isRelativePath = (value) => value.length > 0 && !path.isAbsolute(value) && !value.includes("\\") && !value.includes("\0") && value.split("/").every((part) => part !== "" && part !== "." && part !== "..");
	return {
		canRead(relativePath) {
			if (!isRelativePath(relativePath) || !names.has(path.basename(relativePath))) return false;
			return names.has(relativePath) || literals.has(relativePath) || globs.some(({ matcher }) => matcher.match(normalizeWorkspacePatternPath(relativePath)));
		},
		canList(relativePath) {
			if (relativePath !== "." && !isRelativePath(relativePath)) return false;
			const directory = path.resolve(workspaceDir, relativePath);
			return globs.some(({ walkRoot, matcher }) => isPathInside(walkRoot, directory) && (directory === walkRoot || matcher.match(normalizeWorkspacePatternPath(relativePath), true)));
		},
		canWrite: (relativePath) => ownerNames.has(relativePath)
	};
}
//#endregion
export { DEFAULT_SOUL_FILENAME as a, GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES as c, createWorkspaceBootstrapFilePolicy as d, hasGlobPattern as f, resolveGlobWalkRoot as h, DEFAULT_MEMORY_FILENAME as i, WORKSPACE_BOOTSTRAP_FILENAMES as l, resolveExtraBootstrapPatterns as m, DEFAULT_BOOTSTRAP_FILENAME as n, DEFAULT_TOOLS_FILENAME as o, normalizeWorkspacePatternPath as p, DEFAULT_IDENTITY_FILENAME as r, DEFAULT_USER_FILENAME as s, DEFAULT_AGENTS_FILENAME as t, createBootstrapPatternMatcher as u };
