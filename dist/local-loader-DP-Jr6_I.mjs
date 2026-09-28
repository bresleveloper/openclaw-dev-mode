import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as resolveOsHomeDir } from "./home-dir-D0b-ywue.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { o as safeRealpathSync } from "./boundary-path-BzetEUdq.mjs";
import { _ as resolveConfigDir, t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync, r as isRootFileMissingFailure } from "./boundary-file-read-D-Aa04On.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { r as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-DEOzYnOP.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-2H_F0IFB.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { t as materializeSkill } from "./skill-materializer-CO_mTDvv.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/skills/loading/symlink-targets.ts
function resolveAllowedSkillSymlinkTargetRealPaths(config) {
	const targetPaths = (config?.skills?.load?.allowSymlinkTargets ?? []).map((dir) => normalizeOptionalString(dir) ?? "").filter(Boolean).map((dir) => safeRealpathSync(resolveUserPath(dir))).filter((dir) => Boolean(dir));
	return uniqueStrings(targetPaths);
}
function findContainingAllowedSkillSymlinkTarget(rootRealPaths, candidateRealPath) {
	const resolvedCandidate = path.resolve(candidateRealPath);
	for (const rootRealPath of rootRealPaths) {
		const resolvedRoot = path.resolve(rootRealPath);
		if (isPathInside(resolvedRoot, resolvedCandidate)) return resolvedRoot;
	}
	return null;
}
const tryRealpath = safeRealpathSync;
//#endregion
//#region src/skills/loading/skill-paths.ts
function resolvePluginSkillsDir() {
	const stateDir = hasActivePluginInstallRoots() ? resolveActivePluginInstallRoots().stateDir : CONFIG_DIR;
	return path.join(stateDir, "plugin-skills");
}
/** Workspace sync excludes repository internals and installed dependencies at every depth. */
function shouldSyncSkillPath(filePath) {
	const name = path.basename(filePath);
	return name !== ".git" && name !== "node_modules";
}
/** Resolve the effective user home used by skill discovery. */
function resolveSkillsUserHomeDir() {
	return resolveOsHomeDir(process.env, os.homedir);
}
function resolveNativeUserHomeDir() {
	try {
		return path.resolve(os.homedir());
	} catch {
		return;
	}
}
function resolveCompactHomePrefixes() {
	const resolvedHomes = [resolveSkillsUserHomeDir(), resolveNativeUserHomeDir()].filter((home) => Boolean(home)).map((home) => path.resolve(home));
	const realHomes = resolvedHomes.map((home) => tryRealpath(home)).filter((home) => Boolean(home));
	return uniqueStrings([...resolvedHomes, ...realHomes]).toSorted((a, b) => b.length - a.length).flatMap(compactHomePrefixesForHome);
}
/** Compact prompt-facing skill paths while preserving managed paths that `~` cannot reach. */
function compactPromptSkills(skills, options = {}) {
	const prefixes = resolveCompactHomePrefixes();
	if (prefixes.length === 0) return skills;
	const preservedRoots = resolvePreservedPromptSkillPathRoots(options);
	const tildeRoots = resolvePromptTildeRoots();
	return skills.map((skill) => ({
		...skill,
		filePath: shouldPreservePromptSkillPath(skill.filePath, preservedRoots, tildeRoots) ? skill.filePath : compactHomePath(skill.filePath, prefixes)
	}));
}
function resolvePreservedPromptSkillPathRoots(options) {
	const configDir = resolveConfigDir();
	const promptSkillDirs = [
		...options.config && options.agentId ? [resolveWorkshopSkillsDir(options.config, options.agentId)] : [],
		path.resolve(configDir, "skills"),
		path.resolve(configDir, "plugin-skills")
	];
	const realPromptSkillDirs = promptSkillDirs.map((dir) => tryRealpath(dir)).filter((dir) => Boolean(dir));
	return uniqueStrings([...promptSkillDirs, ...realPromptSkillDirs]);
}
function resolvePromptTildeRoots() {
	const nativeHome = resolveNativeUserHomeDir();
	if (!nativeHome) return [];
	const resolvedNativeHome = path.resolve(nativeHome);
	if (isContainerStateHomeWherePromptTildeEscapes(resolvedNativeHome)) return [];
	const realNativeHome = tryRealpath(resolvedNativeHome);
	return uniqueStrings([resolvedNativeHome, ...realNativeHome ? [realNativeHome] : []]);
}
function isContainerStateHomeWherePromptTildeEscapes(home) {
	const configDir = path.resolve(resolveConfigDir());
	return home === "/data" && (configDir === "/data/.openclaw" || isPathInside("/data/.openclaw", configDir));
}
function shouldPreservePromptSkillPath(filePath, roots, tildeRoots) {
	const resolvedFilePath = path.resolve(filePath);
	if (!roots.some((root) => resolvedFilePath === root || isPathInside(root, resolvedFilePath))) return false;
	return !tildeRoots.some((root) => resolvedFilePath === root || isPathInside(root, resolvedFilePath));
}
function compactHomePath(filePath, prefixes) {
	for (const prefix of prefixes) if (filePath.startsWith(prefix)) return "~/" + normalizeCompactedSkillPath(filePath.slice(prefix.length), prefix);
	return filePath;
}
function compactHomePrefixesForHome(home) {
	const prefixes = [home.endsWith(path.sep) ? home : home + path.sep];
	if (home.includes("\\") && !home.endsWith("\\")) prefixes.push(home + "\\");
	return prefixes;
}
function normalizeCompactedSkillPath(filePath, matchedHomePrefix) {
	return matchedHomePrefix.includes("\\") ? filePath.replace(/\\/g, "/") : filePath;
}
/** Compact a skill path for console diagnostics. */
function compactSkillPath(filePath) {
	return compactHomePath(filePath, resolveCompactHomePrefixes());
}
//#endregion
//#region src/skills/loading/local-loader.ts
const MAX_CACHED_SKILL_CONTENT_CHARS = 16384;
const MAX_CACHED_SKILL_CONTENTS = 256;
const localSkillContentCache = /* @__PURE__ */ new Map();
function readSkillFileSync(params) {
	const opened = openRootFileSync({
		absolutePath: params.filePath,
		rootPath: params.rootRealPath,
		rootRealPath: params.rootRealPath,
		boundaryLabel: "skill root",
		rejectSymlinks: false,
		rejectHardlinks: params.rejectHardlinks !== false
	});
	if (!opened.ok) {
		if (!isRootFileMissingFailure(opened)) {
			const message = opened.error instanceof Error ? opened.error.message : `failed to open skill file (${opened.reason})`;
			params.onDiagnostic?.({
				kind: opened.reason === "validation" ? "invalid" : "read",
				path: params.filePath,
				message
			});
		}
		return null;
	}
	try {
		return params.maxBytes === void 0 ? fs.readFileSync(opened.fd, "utf8") : readFileDescriptorBoundedSync(opened.fd, params.maxBytes).toString("utf8");
	} catch (error) {
		const message = error instanceof Error ? error.message : "failed to read skill file";
		params.onDiagnostic?.({
			kind: error instanceof RangeError ? "invalid" : "read",
			path: params.filePath,
			message
		});
		return null;
	} finally {
		fs.closeSync(opened.fd);
	}
}
function loadSingleSkillDirectory(params) {
	const skillFilePath = path.join(params.skillDir, "SKILL.md");
	const raw = readSkillFileSync({
		rootRealPath: params.rootRealPath,
		filePath: skillFilePath,
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks,
		onDiagnostic: params.onDiagnostic
	});
	if (raw === null) return null;
	const fallbackName = path.basename(params.skillDir).trim();
	const filePath = path.resolve(skillFilePath);
	const baseDir = path.resolve(params.skillDir);
	let loaded = localSkillContentCache.get(raw);
	if (loaded && !loaded.frontmatter.name?.trim() && loaded.skill.name !== fallbackName) loaded = void 0;
	if (!loaded) {
		let frontmatter;
		try {
			frontmatter = parseSkillFrontmatter(raw);
		} catch (error) {
			const message = error instanceof Error ? error.message : "failed to parse skill frontmatter";
			params.onDiagnostic?.({
				kind: "invalid",
				path: skillFilePath,
				message
			});
			return null;
		}
		const name = frontmatter.name?.trim() || fallbackName;
		const description = frontmatter.description?.trim();
		if (!name || !description) {
			params.onDiagnostic?.({
				kind: "invalid",
				path: skillFilePath,
				message: !name ? "name is required" : "description is required"
			});
			return null;
		}
		loaded = {
			skill: materializeSkill({
				content: raw,
				frontmatter,
				name,
				description,
				filePath,
				baseDir,
				source: params.source,
				sourceOptions: {
					source: params.source,
					scope: "project",
					origin: "top-level"
				}
			}),
			frontmatter
		};
	}
	if (raw.length <= MAX_CACHED_SKILL_CONTENT_CHARS) {
		localSkillContentCache.delete(raw);
		localSkillContentCache.set(raw, loaded);
		pruneMapToMaxSize(localSkillContentCache, MAX_CACHED_SKILL_CONTENTS);
	}
	return {
		skill: {
			...loaded.skill,
			filePath,
			baseDir,
			source: params.source,
			sourceInfo: {
				...loaded.skill.sourceInfo,
				path: filePath,
				baseDir,
				source: params.source
			}
		},
		frontmatter: { ...loaded.frontmatter },
		content: raw
	};
}
function readSkillFrontmatterSafe(params) {
	let rootRealPath;
	try {
		rootRealPath = fs.realpathSync(path.resolve(params.rootDir));
	} catch {
		return null;
	}
	const raw = readSkillFileSync({
		rootRealPath,
		filePath: path.resolve(params.filePath),
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks
	});
	if (raw === null) return null;
	try {
		return parseSkillFrontmatter(raw);
	} catch {
		return null;
	}
}
//#endregion
export { resolvePluginSkillsDir as a, findContainingAllowedSkillSymlinkTarget as c, compactSkillPath as i, resolveAllowedSkillSymlinkTargetRealPaths as l, readSkillFrontmatterSafe as n, resolveSkillsUserHomeDir as o, compactPromptSkills as r, shouldSyncSkillPath as s, loadSingleSkillDirectory as t, tryRealpath as u };
