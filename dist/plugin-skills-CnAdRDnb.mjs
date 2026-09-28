import { D as withPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-_gRhJUDw.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { n as isPathInside } from "./path-safety-0BfxAYBQ.mjs";
import "./includes-CaaCq-XN.mjs";
import { c as pluginCacheLstatSync, d as readPluginCacheDirectory, l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DtesR9-z.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import "./skill-library-C7RO5Y8q.mjs";
import { r as resolveSkillTelemetrySourceValue } from "./source-BwY_Vy9W.mjs";
import { a as resolvePluginSkillsDir, i as compactSkillPath, l as resolveAllowedSkillSymlinkTargetRealPaths, t as loadSingleSkillDirectory } from "./local-loader-DP-Jr6_I.mjs";
import { t as SKILL_LIBRARY_MAX_TREE_ENTRIES } from "./bundle-rcLpsHEc.mjs";
import { a as resolveSkillDiscoveryLimits, n as discoverPluginSkills, r as discoverSkillCandidates, t as canonicalSkillDirForSource } from "./skill-root-discovery-DZF8sfp6.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-DLM4e556.mjs";
import { t as iteratePluginRootContributions } from "./plugin-root-contributions-ESP9k-MN.mjs";
import fs from "node:fs";
import { TextDecoder } from "node:util";
import path from "node:path";
//#region src/skills/loading/skill-root-loader.ts
const skillsLogger = createSubsystemLogger("skills");
function warnInvalidSkill(source, diagnostic) {
	skillsLogger.warn("Skipping invalid skill.", {
		source,
		filePath: diagnostic.path,
		error: diagnostic.message,
		consoleMessage: `Skipping invalid skill: file=${compactSkillPath(diagnostic.path)} error=${diagnostic.message}`
	});
}
function loadContainedSkillRecord(params) {
	const loaded = loadSingleSkillDirectory({
		skillDir: params.skillDir,
		rootRealPath: params.skillDirRealPath,
		source: params.source,
		maxBytes: params.maxSkillFileBytes,
		rejectHardlinks: params.rejectHardlinks,
		onDiagnostic: params.onDiagnostic ?? ((diagnostic) => warnInvalidSkill(params.source, diagnostic))
	});
	if (!loaded) return null;
	const record = {
		skill: loaded.skill,
		frontmatter: loaded.frontmatter
	};
	const canonicalSkillDir = params.canonicalSkillDir;
	return canonicalSkillDir ? canonicalizeLoadedSkillRecord(record, canonicalSkillDir) : record;
}
function canonicalizeLoadedSkillRecord(record, canonicalSkillDir) {
	const originalBaseDir = path.resolve(record.skill.baseDir);
	const canonicalBaseDir = path.resolve(canonicalSkillDir);
	if (originalBaseDir === canonicalBaseDir) return record;
	const filePath = path.join(canonicalBaseDir, path.relative(originalBaseDir, record.skill.filePath));
	return {
		...record,
		syncSourceDir: canonicalBaseDir,
		syncDirName: path.basename(originalBaseDir),
		skill: {
			...record.skill,
			filePath,
			baseDir: canonicalBaseDir,
			sourceInfo: record.skill.sourceInfo ? {
				...record.skill.sourceInfo,
				path: filePath,
				baseDir: canonicalBaseDir
			} : record.skill.sourceInfo
		}
	};
}
function setSyncSourceForPluginSkill(record, syncSourceDir) {
	return {
		...record,
		syncSourceDir,
		syncDirName: path.basename(record.skill.baseDir)
	};
}
/** Loads one skill root under the configured discovery limits and symlink/hardlink policy. */
function loadSkillRootRecords(params) {
	const limits = resolveSkillDiscoveryLimits(params.config);
	if (params.mode === "audit") {
		const defaults = resolveSkillDiscoveryLimits();
		limits.maxCandidatesPerRoot = Math.max(limits.maxCandidatesPerRoot, defaults.maxCandidatesPerRoot);
		limits.maxSkillsLoadedPerSource = Math.max(limits.maxSkillsLoadedPerSource, defaults.maxSkillsLoadedPerSource);
		limits.maxSkillFileBytes = defaults.maxSkillFileBytes;
	}
	const rejectHardlinks = params.rejectHardlinks ?? shouldRejectHardlinkedPluginFiles({
		origin: resolveSkillTelemetrySourceValue(params.source) === "bundled" ? "bundled" : "workspace",
		rootDir: params.dir
	});
	const discovered = discoverSkillCandidates({
		dir: params.dir,
		source: params.source,
		limits,
		allowedSymlinkTargetRealPaths: resolveAllowedSkillSymlinkTargetRealPaths(params.config),
		onDiagnostic: params.onDiagnostic
	});
	const maxSkillsLoadedPerSource = Math.max(0, limits.maxSkillsLoadedPerSource);
	const loadCandidate = (candidate) => loadContainedSkillRecord({
		skillDir: candidate.skillDir,
		skillDirRealPath: candidate.skillDirRealPath,
		source: params.source,
		maxSkillFileBytes: limits.maxSkillFileBytes,
		canonicalSkillDir: params.mode === "audit" ? candidate.skillDirRealPath : canonicalSkillDirForSource(params.source, candidate.skillDirRealPath),
		rejectHardlinks,
		onDiagnostic: params.onDiagnostic
	});
	if (discovered.configuredRootCandidate) {
		const rootRecord = loadCandidate(discovered.configuredRootCandidate);
		if (rootRecord) return [rootRecord];
	}
	const loadedSkills = [];
	for (const candidate of discovered.candidates) {
		if (params.mode !== "audit" && !discovered.rootIsSkill && loadedSkills.length >= maxSkillsLoadedPerSource) break;
		const record = loadCandidate(candidate);
		if (record) loadedSkills.push(record);
	}
	return loadedSkills;
}
function loadGeneratedPluginSkillRecords(params) {
	const candidates = discoverPluginSkills(params);
	const maxSkillsLoadedPerSource = Math.max(0, params.limits.maxSkillsLoadedPerSource);
	const loadedSkills = [];
	for (const candidate of candidates) {
		const record = loadContainedSkillRecord({
			skillDir: candidate.skillDir,
			skillDirRealPath: candidate.skillDirRealPath,
			source: params.source,
			maxSkillFileBytes: params.limits.maxSkillFileBytes,
			rejectHardlinks: candidate.rejectHardlinks
		});
		if (record) loadedSkills.push(setSyncSourceForPluginSkill(record, candidate.skillDirRealPath));
		if (loadedSkills.length >= maxSkillsLoadedPerSource) break;
	}
	return loadedSkills;
}
//#endregion
//#region src/skills/loading/plugin-skill-bundle.ts
/** Portable relative paths keep catalog paths and installed reads on the same boundary. */
function validatePluginSkillPath(value) {
	const parts = value.split("/");
	if (!value || value.length > 512 || parts.length > 16 || parts.some((part) => !part || part === "." || part === "..") || containsAsciiControlCharacter(value) || /[\\:]/u.test(value)) throw new Error("Invalid plugin skill bundle path.");
}
function pluginSkillFileFromBytes(filePath, buffer) {
	try {
		const content = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
		if (buffer.some((byte) => byte < 32 && byte !== 9 && byte !== 10 && byte !== 13)) throw new Error("Binary content");
		return {
			path: filePath,
			sizeBytes: buffer.length,
			status: "ready",
			content
		};
	} catch {
		return {
			path: filePath,
			sizeBytes: buffer.length,
			status: "binary"
		};
	}
}
/** Inventory and reads share one pinned plugin root; links are represented but never followed. */
async function readPluginSkillBundle(params) {
	if (params.rootPath !== ".") validatePluginSkillPath(params.rootPath);
	const selectedPath = params.path ?? "SKILL.md";
	validatePluginSkillPath(selectedPath);
	const owner = await root(params.pluginRoot);
	const result = {
		name: params.name,
		rootPath: params.rootPath,
		entryPath: "SKILL.md",
		files: [],
		directories: [],
		inventoryComplete: true
	};
	let entries = 0;
	let bytes = 0;
	async function visit(directory, depth) {
		if (depth > 16) throw new Error("Skill bundle exceeds directory depth limit.");
		const relative = directory ? `${params.rootPath}/${directory}` : params.rootPath;
		for await (const entry of owner.entries(relative, {
			order: "sorted",
			maxEntries: SKILL_LIBRARY_MAX_TREE_ENTRIES - entries,
			symlinks: "reject"
		})) {
			if (++entries > SKILL_LIBRARY_MAX_TREE_ENTRIES) throw new Error("Skill bundle exceeds inventory limits.");
			const filePath = directory ? `${directory}/${entry.name}` : entry.name;
			validatePluginSkillPath(filePath);
			if (entry.isDirectory && !entry.isSymbolicLink) {
				result.directories.push(filePath);
				await visit(filePath, depth + 1);
				continue;
			}
			if (result.files.length >= 256) throw new Error("Skill bundle exceeds file count limit.");
			const file = {
				path: filePath,
				sizeBytes: entry.size,
				status: "unavailable"
			};
			result.files.push(file);
			if (!entry.isFile || entry.isSymbolicLink) continue;
			if (entry.size > 1048576 || bytes + entry.size > 8388608) {
				file.status = "too-large";
				continue;
			}
			bytes += entry.size;
			file.status = "deferred";
		}
	}
	await visit("", 0);
	if (params.path !== void 0 && !result.files.some((file) => file.path === selectedPath)) throw new Error("Plugin skill file not found.");
	result.files.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
	const selected = result.files.find((file) => file.path === selectedPath);
	if (selected?.status === "deferred") {
		selected.status = "unavailable";
		try {
			const read = await owner.read(`${params.rootPath}/${selectedPath}`, {
				symlinks: "reject",
				hardlinks: params.rejectHardlinks ? "reject" : "allow",
				maxBytes: selected.sizeBytes
			});
			Object.assign(selected, pluginSkillFileFromBytes(selectedPath, read.buffer));
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "too-large") selected.status = "too-large";
		}
	}
	return result;
}
//#endregion
//#region src/skills/loading/plugin-skills.ts
const log = createSubsystemLogger("skills");
let lastDefaultPluginSkillsPublication = null;
registerPluginMetadataProcessMemoLifecycleClear(() => {
	lastDefaultPluginSkillsPublication = null;
});
function resolvePluginSkillRoots(params) {
	const workspaceDir = (params.workspaceDir ?? "").trim();
	if (!workspaceDir || params.config?.plugins?.enabled === false) {
		publishPluginSkills([], { pluginSkillsDir: params.pluginSkillsDir });
		return [];
	}
	const metadataSnapshot = resolvePluginMetadataSnapshot({
		workspaceDir,
		config: params.config,
		env: process.env
	});
	return resolvePluginSkillRootsFromMetadata({
		...params,
		metadataSnapshot
	});
}
function resolvePluginSkillRootsFromMetadata(params) {
	return withPluginCache(getPluginMetadataSnapshotCache(params.metadataSnapshot), () => resolvePluginSkillRootsInOwner(params));
}
function resolvePluginSkillRootsInOwner(params) {
	if (!(params.workspaceDir ?? "").trim()) {
		publishPluginSkills([], { pluginSkillsDir: params.pluginSkillsDir });
		return [];
	}
	const config = params.config ?? {};
	const metadataSnapshot = params.metadataSnapshot;
	if (metadataSnapshot.manifestRegistry.plugins.length === 0) {
		publishPluginSkills([], { pluginSkillsDir: params.pluginSkillsDir });
		return [];
	}
	const acpRuntimeAvailable = isAcpRuntimeSpawnAvailable({ config });
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	for (const { record, roots } of iteratePluginRootContributions({
		metadataSnapshot,
		config,
		contribution: "skills",
		isAvailable: (candidate) => acpRuntimeAvailable || candidate.id !== "acpx"
	})) {
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: record.rootDir
		});
		for (const raw of roots) {
			const trimmed = raw.trim();
			if (!trimmed) continue;
			const candidate = path.resolve(record.rootDir, trimmed);
			if (!pluginCacheExistsSync(candidate)) {
				log.warn(`plugin skill path not found (${record.id}): ${candidate}`);
				continue;
			}
			if (!isPluginSkillPathInside(record.rootDir, candidate)) {
				log.warn(`plugin skill path escapes plugin root (${record.id}): ${candidate}`);
				continue;
			}
			const candidates = record.bundleFormat === "agent" ? collectAgentSkillTargets(candidate) : [candidate];
			for (const resolvedCandidate of candidates) {
				if (seen.has(resolvedCandidate)) continue;
				seen.add(resolvedCandidate);
				resolved.push({
					dir: resolvedCandidate,
					rejectHardlinks
				});
			}
		}
	}
	publishPluginSkills(resolved.map((root) => root.dir), { pluginSkillsDir: params.pluginSkillsDir });
	return resolved;
}
function isPluginSkillPathInside(rootDir, candidate) {
	if (!isPathInside(rootDir, candidate)) return false;
	const rootRealPath = pluginCacheRealpathSync(rootDir);
	const candidateRealPath = pluginCacheRealpathSync(candidate);
	return Boolean(rootRealPath && candidateRealPath && isPathInside(rootRealPath, candidateRealPath));
}
/** Resolve manifest skill roots to the names users and agents actually see. */
function resolvePluginSkillRecords(record) {
	const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
		origin: record.origin,
		rootDir: record.rootDir
	});
	const records = /* @__PURE__ */ new Map();
	for (const raw of record.skills) {
		const candidate = path.resolve(record.rootDir, raw.trim());
		if (!raw.trim() || !pluginCacheExistsSync(candidate)) continue;
		if (!isPluginSkillPathInside(record.rootDir, candidate)) {
			log.warn(`plugin skill path escapes plugin root (${record.id}): ${candidate}`);
			continue;
		}
		for (const loaded of loadSkillRootRecords({
			dir: candidate,
			source: record.origin === "bundled" ? "bundled" : "plugin",
			mode: "audit",
			rejectHardlinks
		})) records.set(loaded.skill.filePath, loaded);
	}
	return [...records.values()];
}
function resolvePluginSkillDetails(record) {
	return [...new Map(resolvePluginSkillRecords(record).map(({ skill }) => [skill.name, {
		name: skill.name,
		...skill.description ? { description: skill.description } : {}
	}])).values()].toSorted((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
}
async function readPluginSkill(record, name, selection) {
	if (selection?.version !== void 0 && selection.version !== record.version) throw new Error("Installed plugin version changed. Reopen the skill preview.");
	const matches = resolvePluginSkillRecords(record).filter(({ skill }) => skill.name === name);
	if (matches.length !== 1) throw new Error(matches.length ? "Plugin skill name is ambiguous." : "Plugin skill not found.");
	const pluginRoot = pluginCacheRealpathSync(record.rootDir);
	if (!pluginRoot) throw new Error("Installed plugin root not found.");
	return {
		...await readPluginSkillBundle({
			pluginRoot,
			rootPath: path.relative(pluginRoot, matches[0].skill.baseDir).split(path.sep).join("/") || ".",
			name,
			rejectHardlinks: shouldRejectHardlinkedPluginFiles(record),
			path: selection?.path
		}),
		...record.version ? { version: record.version } : {}
	};
}
function listSkillChildDirectories(dir) {
	try {
		return readPluginCacheDirectory(dir).filter((entry) => entry.isDirectory()).map((entry) => ({
			name: entry.name,
			path: path.join(dir, entry.name)
		}));
	} catch {
		return [];
	}
}
function collectAgentSkillTargets(skillsRoot) {
	const targets = [];
	for (const entry of listSkillChildDirectories(skillsRoot)) {
		if (hasPublishableSkillFile({
			skillDir: entry.path,
			rootDir: skillsRoot
		})) {
			targets.push(entry.path);
			continue;
		}
		log.warn(`agent plugin skill skipped because SKILL.md is missing or invalid: ${entry.path}`);
	}
	return targets;
}
function resolvePluginSkillLinkType(platform = process.platform) {
	return platform === "win32" ? "junction" : "dir";
}
/**
* Collect skill dir targets from a resolved directory.
* If the directory contains a direct SKILL.md it is published as-is.
* Otherwise child subdirectories that contain SKILL.md are expanded.
*/
function collectSkillTargets(dir, targets) {
	if (hasPublishableSkillFile({
		skillDir: dir,
		rootDir: dir
	})) {
		const basename = path.basename(dir);
		const existing = targets.get(basename);
		if (existing) {
			log.warn(`plugin skill name collision: "${basename}" resolves to both ${existing} and ${dir}; only the first will be published`);
			return;
		}
		targets.set(basename, dir);
		return;
	}
	for (const entry of listSkillChildDirectories(dir)) {
		const childPath = entry.path;
		if (!hasPublishableSkillFile({
			skillDir: childPath,
			rootDir: dir
		})) continue;
		const basename = entry.name;
		const existing = targets.get(basename);
		if (existing) {
			log.warn(`plugin skill name collision: "${basename}" resolves to both ${existing} and ${childPath}; only the first will be published`);
			continue;
		}
		targets.set(basename, childPath);
	}
}
function hasPublishableSkillFile(params) {
	const skillMd = path.join(params.skillDir, "SKILL.md");
	const skillMdStat = pluginCacheLstatSync(skillMd);
	if (!skillMdStat) return false;
	if (!skillMdStat.isFile() || skillMdStat.isSymbolicLink()) {
		log.warn(`plugin skill SKILL.md is not a regular file: ${skillMd}`);
		return false;
	}
	if (!isPluginSkillPathInside(params.rootDir, skillMd)) {
		log.warn(`plugin skill SKILL.md escapes declared skill root: ${skillMd}`);
		return false;
	}
	return true;
}
/**
* Creates symlinks from each resolved plugin skill directory into the
* plugin skills directory (~/.openclaw/plugin-skills/) so the agent SDK can
* discover them at the conventional file-system path.
*
* The plugin-skills directory is fully owned by OpenClaw — every entry is
* a generated symlink. Cleanup of stale links is therefore safe.
*/
function publishPluginSkills(skillDirs, opts) {
	const pluginSkillsDir = opts?.pluginSkillsDir ?? resolvePluginSkillsDir();
	const managedTargets = /* @__PURE__ */ new Map();
	for (const dir of skillDirs) collectSkillTargets(dir, managedTargets);
	if (opts?.pluginSkillsDir === void 0 && lastDefaultPluginSkillsPublication?.directory === pluginSkillsDir && lastDefaultPluginSkillsPublication.targets.size === managedTargets.size && [...managedTargets].every(([name, target]) => lastDefaultPluginSkillsPublication?.targets.get(name) === target)) return;
	for (const [name, target] of managedTargets) {
		const linkPath = path.join(pluginSkillsDir, name);
		try {
			fs.mkdirSync(pluginSkillsDir, { recursive: true });
		} catch {}
		try {
			const existingEntry = fs.lstatSync(linkPath);
			if (existingEntry.isSymbolicLink()) {
				if (fs.readlinkSync(linkPath) === target) continue;
				removeGeneratedPluginSkillEntry(linkPath);
			} else if (isGeneratedPluginSkillEntry(existingEntry)) removeGeneratedPluginSkillEntry(linkPath);
			else {
				log.warn(`plugin skill entry is not a generated symlink: ${linkPath}`);
				continue;
			}
		} catch (err) {
			if (!isMissingPathError(err)) {
				log.warn(`failed to inspect plugin skill symlink "${linkPath}": ${String(err)}`);
				continue;
			}
		}
		try {
			fs.symlinkSync(target, linkPath, resolvePluginSkillLinkType());
		} catch (err) {
			log.warn(`failed to create plugin skill symlink "${linkPath}" → "${target}": ${String(err)}`);
		}
	}
	let existingEntries;
	try {
		existingEntries = fs.readdirSync(pluginSkillsDir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of existingEntries) {
		if (!isGeneratedPluginSkillEntry(entry)) continue;
		if (managedTargets.has(entry.name)) continue;
		removeGeneratedPluginSkillEntry(path.join(pluginSkillsDir, entry.name));
	}
	if (opts?.pluginSkillsDir === void 0) lastDefaultPluginSkillsPublication = {
		directory: pluginSkillsDir,
		targets: managedTargets
	};
}
function isGeneratedPluginSkillEntry(entry) {
	return entry.isSymbolicLink() || process.platform === "win32" && entry.isDirectory();
}
function removeGeneratedPluginSkillEntry(linkPath) {
	try {
		if (fs.lstatSync(linkPath).isSymbolicLink()) {
			fs.unlinkSync(linkPath);
			return;
		}
	} catch (err) {
		if (isMissingPathError(err)) return;
	}
	try {
		fs.rmSync(linkPath, {
			recursive: true,
			force: true
		});
	} catch {}
}
//#endregion
export { pluginSkillFileFromBytes as a, loadSkillRootRecords as c, resolvePluginSkillRootsFromMetadata as i, warnInvalidSkill as l, resolvePluginSkillDetails as n, validatePluginSkillPath as o, resolvePluginSkillRoots as r, loadGeneratedPluginSkillRecords as s, readPluginSkill as t };
