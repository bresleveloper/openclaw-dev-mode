import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as resolveActivePluginInstallDir } from "./install-root-context-DEOzYnOP.mjs";
import { a as safePathSegmentHashed, i as safeDirName, o as unscopedPackageName, r as resolveSafeInstallDir } from "./install-safe-path-Nbwl6YSJ.mjs";
import { lstatSync, realpathSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/plugins/install-paths.ts
/** Encodes arbitrary input as a safe plugin install filename. */
function safePluginInstallFileName(input) {
	return safeDirName(input);
}
/** Encodes a plugin id for use as an install directory name. */
function encodePluginInstallDirName(pluginId) {
	const trimmed = pluginId.trim();
	if (!trimmed.includes("/")) return safeDirName(trimmed);
	return `@${safePathSegmentHashed(trimmed)}`;
}
/** Validates a plugin id for install path safety. */
function validatePluginId(pluginId) {
	const trimmed = pluginId.trim();
	if (!trimmed) return "invalid plugin name: missing";
	if (trimmed.includes("\\")) return "invalid plugin name: path separators not allowed";
	const segments = trimmed.split("/");
	if (segments.some((segment) => !segment)) return "invalid plugin name: malformed scope";
	if (segments.some((segment) => segment === "." || segment === "..")) return "invalid plugin name: reserved path segment";
	if (segments.length === 1) {
		if (trimmed.startsWith("@")) return "invalid plugin name: scoped ids must use @scope/name format";
		return null;
	}
	if (segments.length !== 2) return "invalid plugin name: path separators not allowed";
	if (!segments[0]?.startsWith("@") || segments[0].length < 2) return "invalid plugin name: scoped ids must use @scope/name format";
	return null;
}
/** Checks whether an installed plugin id matches the expected id, including old npm keying. */
function matchesExpectedPluginId(params) {
	if (!params.expectedPluginId) return true;
	if (params.expectedPluginId === params.pluginId) return true;
	return !params.manifestPluginId && params.pluginId === params.npmPluginId && params.expectedPluginId === unscopedPackageName(params.npmPluginId);
}
/** Resolves the default directory for path-installed plugin extensions. */
function resolveDefaultPluginExtensionsDir(env = process.env, homedir) {
	return resolveActivePluginInstallDir("extensions", env, homedir);
}
/** Resolves the default directory for managed npm plugin installs. */
function resolveDefaultPluginNpmDir(env = process.env, homedir) {
	return resolveActivePluginInstallDir("npm", env, homedir);
}
/** Encodes an npm package name into a managed npm project directory name. */
function encodePluginNpmProjectDirName(packageName) {
	const trimmed = packageName.trim();
	if (!trimmed) throw new Error("invalid npm package name: missing");
	return safePathSegmentHashed(trimmed);
}
/** Resolves the directory containing managed npm plugin projects. */
function resolvePluginNpmProjectsDir(npmDir) {
	const npmBase = npmDir ? resolveUserPath(npmDir) : resolveDefaultPluginNpmDir();
	return path.join(npmBase, "projects");
}
/** Resolves the managed npm project directory for a package name. */
function resolvePluginNpmProjectDir(params) {
	return path.join(resolvePluginNpmProjectsDir(params.npmDir), encodePluginNpmProjectDirName(params.packageName));
}
const PLUGIN_NPM_GENERATION_PROJECT_SEPARATOR = "__openclaw-generation__";
const PLUGIN_NPM_GENERATION_KEY_HASH_CHARS = 16;
const PLUGIN_NPM_GENERATION_KEY_DIR_NAME_PATTERN = new RegExp(`^g-[a-f0-9]{${PLUGIN_NPM_GENERATION_KEY_HASH_CHARS}}$`, "u");
/** Resolves the managed npm artifact-generation project directory prefix for a package. */
function resolvePluginNpmGenerationProjectDirPrefix(packageName) {
	return `${encodePluginNpmProjectDirName(packageName)}${PLUGIN_NPM_GENERATION_PROJECT_SEPARATOR}`;
}
/** Checks that a managed path preserves its npm-root-relative real path. */
function isPluginNpmManagedPath(params) {
	const npmDir = path.resolve(params.npmDir ?? resolveDefaultPluginNpmDir());
	const managedPath = path.resolve(params.managedPath);
	try {
		return lstatSync(npmDir).isDirectory() && path.relative(npmDir, managedPath) === path.relative(realpathSync(npmDir), params.allowMissing ? resolvePathViaExistingAncestorSync(managedPath) : realpathSync(managedPath));
	} catch {
		return false;
	}
}
/** Checks whether a project directory has the exact managed shape owned by a package. */
function isPluginNpmProjectDir(params) {
	const npmDir = path.resolve(params.npmDir ?? resolveDefaultPluginNpmDir());
	const projectDir = path.resolve(params.projectDir);
	if (path.dirname(projectDir) !== path.resolve(resolvePluginNpmProjectsDir(npmDir))) return false;
	if (!isPluginNpmManagedPath({
		managedPath: projectDir,
		npmDir
	})) return false;
	if (!isPluginNpmManagedPath({
		managedPath: path.join(projectDir, "node_modules", ...params.packageName.split("/")),
		npmDir,
		allowMissing: true
	})) return false;
	if (projectDir === path.resolve(resolvePluginNpmProjectDir(params))) return true;
	const projectName = path.basename(projectDir);
	const generationPrefix = resolvePluginNpmGenerationProjectDirPrefix(params.packageName);
	return projectName.startsWith(generationPrefix) && PLUGIN_NPM_GENERATION_KEY_DIR_NAME_PATTERN.test(projectName.slice(generationPrefix.length));
}
/** Encodes a package generation fingerprint into a compact project directory suffix. */
function encodePluginNpmGenerationKeyDirName(generationKey) {
	return `g-${createHash("sha256").update(generationKey).digest("hex").slice(0, PLUGIN_NPM_GENERATION_KEY_HASH_CHARS)}`;
}
/** Resolves an artifact-generation-specific managed npm project directory. */
function resolvePluginNpmGenerationProjectDir(params) {
	return path.join(resolvePluginNpmProjectsDir(params.npmDir), `${resolvePluginNpmGenerationProjectDirPrefix(params.packageName)}${encodePluginNpmGenerationKeyDirName(params.generationKey)}`);
}
/** Resolves the installed node_modules package directory for a managed npm plugin. */
function resolvePluginNpmPackageDir(params) {
	return path.join(resolvePluginNpmProjectDir(params), "node_modules", ...params.packageName.split("/"));
}
/** Resolves the default directory for git-installed plugins. */
function resolveDefaultPluginGitDir(env = process.env, homedir) {
	return resolveActivePluginInstallDir("git", env, homedir);
}
/** Resolves the safe install directory for one plugin id. */
function resolvePluginInstallDir(pluginId, extensionsDir) {
	const extensionsBase = extensionsDir ? resolveUserPath(extensionsDir) : resolveDefaultPluginExtensionsDir();
	const pluginIdError = validatePluginId(pluginId);
	if (pluginIdError) throw new Error(pluginIdError);
	const targetDirResult = resolveSafeInstallDir({
		baseDir: extensionsBase,
		id: pluginId,
		invalidNameMessage: "invalid plugin name: path traversal detected",
		nameEncoder: encodePluginInstallDirName
	});
	if (!targetDirResult.ok) throw new Error(targetDirResult.error);
	return targetDirResult.path;
}
//#endregion
export { resolveDefaultPluginExtensionsDir as a, resolvePluginInstallDir as c, resolvePluginNpmPackageDir as d, resolvePluginNpmProjectDir as f, validatePluginId as h, matchesExpectedPluginId as i, resolvePluginNpmGenerationProjectDir as l, safePluginInstallFileName as m, isPluginNpmManagedPath as n, resolveDefaultPluginGitDir as o, resolvePluginNpmProjectsDir as p, isPluginNpmProjectDir as r, resolveDefaultPluginNpmDir as s, encodePluginInstallDirName as t, resolvePluginNpmGenerationProjectDirPrefix as u };
