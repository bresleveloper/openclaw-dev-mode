import { k as withPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { p as isPathInside } from "./includes-rygJQufe.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C2eV0eNq.mjs";
import { a as pluginCacheRealpathSync, i as pluginCacheLstatSync, r as pluginCacheExistsSync, s as readPluginCacheDirectory } from "./plugin-cache-files-VxWaav6j.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import "./skill-library-Bgib5R_8.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-DM73_v1a.mjs";
import { t as iteratePluginRootContributions } from "./plugin-root-contributions-CDn1HjjT.mjs";
import { t as SKILL_LIBRARY_MAX_TREE_ENTRIES } from "./bundle-CsGYNL0a.mjs";
import { i as resolvePluginSkillsDir } from "./local-loader-DuDhVnOL.mjs";
import { n as loadSkillRootRecords } from "./skill-root-loader-BM6lBNhg.mjs";
import fs from "node:fs";
import path from "node:path";
import { TextDecoder } from "node:util";
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
		publishPluginSkills([], params.pluginSkillsDir);
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
		publishPluginSkills([], params.pluginSkillsDir);
		return [];
	}
	return resolvePluginSkillRootsFromContributions({
		contributions: capturePluginSkillContributions(params),
		pluginSkillsDir: params.pluginSkillsDir
	});
}
/** Select activation and ACP policy without reading plugin directories. */
function capturePluginSkillContributions(params) {
	const config = params.config ?? {};
	const acpRuntimeAvailable = params.acpRuntimeAvailable ?? isAcpRuntimeSpawnAvailable({ config });
	return [...iteratePluginRootContributions({
		metadataSnapshot: params.metadataSnapshot,
		config,
		contribution: "skills",
		isAvailable: (candidate) => acpRuntimeAvailable || candidate.id !== "acpx"
	})].map(({ record, roots }) => ({
		id: record.id,
		origin: record.origin,
		rootDir: record.rootDir,
		bundleFormat: record.bundleFormat,
		roots
	}));
}
/** Validate and publish selected roots on the filesystem-owning thread. */
function resolvePluginSkillRootsFromContributions(params) {
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	for (const record of params.contributions) {
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: record.rootDir
		});
		for (const raw of record.roots) {
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
	publishPluginSkills(resolved.map((root) => root.dir), params.pluginSkillsDir);
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
function collectSkillTargets(dir, targets) {
	const candidates = hasPublishableSkillFile({
		skillDir: dir,
		rootDir: dir
	}) ? [{
		name: path.basename(dir),
		path: dir
	}] : listSkillChildDirectories(dir).filter((entry) => hasPublishableSkillFile({
		skillDir: entry.path,
		rootDir: dir
	}));
	for (const entry of candidates) {
		const existing = targets.get(entry.name);
		if (existing) {
			log.warn(`plugin skill name collision: "${entry.name}" resolves to both ${existing} and ${entry.path}; only the first will be published`);
			continue;
		}
		targets.set(entry.name, entry.path);
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
function publishPluginSkills(skillDirs, directory) {
	const pluginSkillsDir = directory ?? resolvePluginSkillsDir();
	const managedTargets = /* @__PURE__ */ new Map();
	for (const dir of skillDirs) collectSkillTargets(dir, managedTargets);
	if (directory === void 0 && lastDefaultPluginSkillsPublication?.directory === pluginSkillsDir && lastDefaultPluginSkillsPublication.targets.size === managedTargets.size && [...managedTargets].every(([name, target]) => lastDefaultPluginSkillsPublication?.targets.get(name) === target)) return;
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
			fs.symlinkSync(target, linkPath, process.platform === "win32" ? "junction" : "dir");
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
	if (directory === void 0) lastDefaultPluginSkillsPublication = {
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
export { resolvePluginSkillRootsFromContributions as a, validatePluginSkillPath as c, resolvePluginSkillRoots as i, readPluginSkill as n, resolvePluginSkillRootsFromMetadata as o, resolvePluginSkillDetails as r, pluginSkillFileFromBytes as s, capturePluginSkillContributions as t };
