import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as withPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-BABafcXD.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { p as isPathInside } from "./includes-BkzfmxST.mjs";
import { r as isPathInside$1 } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { c as readRootJsonObjectSync } from "./json-files-C5mNTScg.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-BSDrXrxO.mjs";
import { c as pluginCacheLstatSync, d as readPluginCacheDirectory, l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-CEbdS_C4.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-C9pW4xqI.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import "./skill-library-Bgib5R_8.mjs";
import { r as resolveSkillTelemetrySourceValue } from "./source-DbWOnpPI.mjs";
import { t as canonicalizePath } from "./paths-DqLuHi-X.mjs";
import { i as resolveSkillManifestMetadata, n as resolveSkillInvocationPolicy } from "./frontmatter-CrckYGsg.mjs";
import { t as SKILL_LIBRARY_MAX_TREE_ENTRIES } from "./bundle-Cu4zt9nj.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-Hy3UfoZt.mjs";
import { r as resolveWorkspaceSkillDirectories } from "./workspace-skill-roots-CL28VeX5.mjs";
import { c as loadSingleSkillDirectory, n as compactSkillPath, o as resolveAllowedSkillSymlinkTargetRealPaths, r as resolvePluginSkillsDir, s as tryRealpath } from "./skill-paths-BxFt63--.mjs";
import { a as resolveSkillDiscoveryLimits, n as discoverPluginSkills, r as discoverSkillCandidates, t as canonicalSkillDirForSource } from "./skill-root-discovery-Br--9LSl.mjs";
import { t as iteratePluginRootContributions } from "./plugin-root-contributions-DmkAOBDy.mjs";
import fs from "node:fs";
import path from "node:path";
import { TextDecoder } from "node:util";
//#region src/skills/loading/skill-entry-metadata-path.ts
const SKILL_SOURCE_ORIGIN_FILENAME = "source-origin.json";
const SKILL_SOURCE_ORIGIN_RELATIVE_PATH = `.openclaw/${SKILL_SOURCE_ORIGIN_FILENAME}`;
//#endregion
//#region src/skills/loading/skill-entry-metadata.ts
const MAX_SKILL_SOURCE_ORIGIN_BYTES = 16384;
function readSourceInstallSkillKey(skillDir) {
	try {
		const sourceOriginPath = path.join(skillDir, SKILL_SOURCE_ORIGIN_RELATIVE_PATH);
		const parentRealPath = tryRealpath(path.dirname(sourceOriginPath));
		if (!parentRealPath) return;
		const skillDirRealPath = tryRealpath(skillDir);
		if (!skillDirRealPath) return;
		const result = readRootJsonObjectSync({
			rootDir: skillDirRealPath,
			rootRealPath: skillDirRealPath,
			relativePath: path.relative(skillDirRealPath, path.join(parentRealPath, path.basename(sourceOriginPath))),
			boundaryLabel: "skill directory",
			rejectHardlinks: false,
			maxBytes: MAX_SKILL_SOURCE_ORIGIN_BYTES
		});
		return result.ok ? normalizeOptionalString(result.value.slug) : void 0;
	} catch {
		return;
	}
}
function resolveSkillEntryMetadata(params) {
	const metadata = resolveSkillManifestMetadata(params.frontmatter);
	if (metadata?.skillKey) return metadata;
	const sourceInstallSkillKey = readSourceInstallSkillKey(params.skillDir);
	if (!sourceInstallSkillKey) return metadata;
	return {
		...metadata,
		skillKey: sourceInstallSkillKey
	};
}
function createSkillEntry(record) {
	const { skill, frontmatter } = record;
	const invocation = resolveSkillInvocationPolicy(frontmatter);
	const entry = {
		...record.sourceOrder !== void 0 ? { sourceOrder: record.sourceOrder } : {},
		skill,
		frontmatter,
		metadata: resolveSkillEntryMetadata({
			frontmatter,
			skillDir: skill.baseDir
		}),
		invocation,
		exposure: {
			includeInRuntimeRegistry: true,
			includeInAvailableSkillsPrompt: !invocation.disableModelInvocation,
			userInvocable: invocation.userInvocable ?? true
		}
	};
	if (record.syncSourceDir !== void 0) entry.syncSourceDir = record.syncSourceDir;
	if (record.syncDirName !== void 0) entry.syncDirName = record.syncDirName;
	return entry;
}
//#endregion
//#region src/skills/loading/skill-precedence.ts
const skillsLogger$1 = createSubsystemLogger("skills");
const reportedSkillCollisions = /* @__PURE__ */ new Map();
const reportedGroupsBySource = /* @__PURE__ */ new Map();
function reportSkillPrecedenceCollisions(collisions, sourceKey) {
	const groups = /* @__PURE__ */ new Map();
	for (const { winner, loser } of collisions) {
		if (winner.contentHash && winner.contentHash === loser.contentHash && winner.name === loser.name && winner.description === loser.description && winner.disableModelInvocation === loser.disableModelInvocation) continue;
		const winnerRoot = winner.discoveryRoot?.path ?? winner.baseDir;
		const loserRoot = loser.discoveryRoot?.path ?? loser.baseDir;
		const key = JSON.stringify([
			winnerRoot,
			loserRoot,
			winner.source,
			loser.source
		]);
		const group = groups.get(key) ?? {
			winner,
			loser,
			winnerRoot,
			loserRoot,
			names: /* @__PURE__ */ new Set(),
			contents: /* @__PURE__ */ new Set()
		};
		group.names.add(winner.name);
		group.contents.add(JSON.stringify([winner, loser].map((skill) => [
			skill.name,
			skill.contentHash ?? skill.filePath,
			skill.description,
			skill.disableModelInvocation,
			skill.discoveryRoot?.worktree
		])));
		groups.set(key, group);
	}
	for (const key of reportedGroupsBySource.get(sourceKey) ?? []) if (!groups.has(key)) reportedSkillCollisions.delete(key);
	if (groups.size > 0) reportedGroupsBySource.set(sourceKey, new Set(groups.keys()));
	else reportedGroupsBySource.delete(sourceKey);
	for (const [key, group] of groups) {
		const digest = sha256Hex(JSON.stringify([...group.contents].toSorted()));
		if (reportedSkillCollisions.get(key) === digest) continue;
		reportedSkillCollisions.set(key, digest);
		const names = [...group.names].toSorted();
		const sample = names.slice(0, 3).map((name) => name.slice(0, 128));
		if (names.length > sample.length) sample.push(`+${names.length - sample.length} more`);
		const { winner, loser, winnerRoot, loserRoot } = group;
		const isWorkspaceSource = (source) => source === "openclaw-workspace" || source === "agents-skills-project";
		const lowerTrust = isWorkspaceSource(winner.source) && (loser.source === "openclaw-bundled" || loser.source === "openclaw-custodian") || winner.discoveryRoot?.worktree && !loser.discoveryRoot?.worktree && isWorkspaceSource(loser.source);
		skillsLogger$1[lowerTrust ? "warn" : "info"]("Skill precedence collisions resolved.", {
			winnerSource: winner.source,
			loserSource: loser.source,
			winnerRoot,
			loserRoot,
			skillCount: names.length,
			skills: sample,
			consoleMessage: `${compactSkillPath(winnerRoot)} shadows ${names.length} skills from ${compactSkillPath(loserRoot)} (${sample.join(", ")})`
		});
	}
}
function mergeSkillRecords(records, sourceKey, collisions) {
	const discoveredCollisions = collisions ?? [];
	const merged = /* @__PURE__ */ new Map();
	for (const record of records) {
		const replaced = merged.get(record.skill.name);
		if (replaced && canonicalizePath(record.skill.filePath) !== canonicalizePath(replaced.skill.filePath)) discoveredCollisions.push({
			winner: record.skill,
			loser: replaced.skill
		});
		merged.set(record.skill.name, record);
	}
	if (!collisions) reportSkillPrecedenceCollisions(discoveredCollisions, sourceKey);
	return [...merged.values()].toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en"));
}
/** Append lower-precedence names without changing the order of either tier. */
function appendLowerPrecedenceSkillRecords(entries, lower, onCollision) {
	if (lower.length === 0) return entries;
	const winners = new Map(entries.map((entry) => [entry.skill.name, entry]));
	for (const entry of lower) {
		const winner = winners.get(entry.skill.name);
		if (winner) onCollision(winner, entry);
		else {
			winners.set(entry.skill.name, entry);
			entries.push(entry);
		}
	}
	return entries;
}
//#endregion
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
	if (!params.canonicalSkillDir) return record;
	const originalBaseDir = path.resolve(record.skill.baseDir);
	const canonicalBaseDir = path.resolve(params.canonicalSkillDir);
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
/** Loads one skill root under the configured discovery limits and symlink/hardlink policy. */
function loadSkillRootRecords(params) {
	const discoveryRoot = {
		path: path.resolve(params.dir),
		worktree: params.worktree ?? isPathInside$1(params.config?.worktreeRoot ?? path.join(resolveStateDir(), "worktrees"), params.dir)
	};
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
	const loadCandidate = (candidate) => {
		const record = loadContainedSkillRecord({
			skillDir: candidate.skillDir,
			skillDirRealPath: candidate.skillDirRealPath,
			source: params.source,
			maxSkillFileBytes: limits.maxSkillFileBytes,
			canonicalSkillDir: params.mode === "audit" ? candidate.skillDirRealPath : canonicalSkillDirForSource(params.source, candidate.skillDirRealPath),
			rejectHardlinks,
			onDiagnostic: params.onDiagnostic
		});
		if (record) record.skill.discoveryRoot = discoveryRoot;
		return record;
	};
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
		if (record) {
			record.skill.discoveryRoot = {
				path: path.resolve(params.pluginSkillsDir),
				worktree: false
			};
			loadedSkills.push({
				...record,
				syncSourceDir: candidate.skillDirRealPath,
				syncDirName: path.basename(record.skill.baseDir)
			});
		}
		if (loadedSkills.length >= maxSkillsLoadedPerSource) break;
	}
	return loadedSkills;
}
/** Scan selected roots on their owning host, retaining native precedence and file rules. */
function loadWorkspaceSkillSourceEntries(plan, config, collisions) {
	const grouped = /* @__PURE__ */ new Map();
	for (const root of plan.roots) {
		const records = grouped.get(root.tier) ?? [];
		for (const record of loadSkillRootRecords({
			...root,
			config
		})) records.push({
			...record,
			sourceOrder: root.order
		});
		grouped.set(root.tier, records);
	}
	const extra = grouped.get("extra") ?? [];
	if (plan.pluginSkillsDir) for (const record of loadGeneratedPluginSkillRecords({
		pluginSkillsDir: plan.pluginSkillsDir,
		pluginSkillRoots: plan.pluginSkillRoots,
		source: "openclaw-extra",
		limits: resolveSkillDiscoveryLimits(config)
	})) extra.push({
		...record,
		sourceOrder: (plan.roots.find((root) => root.tier !== "extra")?.order ?? Math.max(-1, ...plan.roots.map((root) => root.order ?? -1)) + 1) - .5
	});
	grouped.set("extra", extra);
	grouped.get("bundled")?.sort((left, right) => left.skill.name.localeCompare(right.skill.name, "en") || left.skill.source.localeCompare(right.skill.source, "en"));
	return mergeSkillRecords([
		"extra",
		"bundled",
		"workshop",
		"managed",
		"personal",
		"workspace"
	].flatMap((tier) => grouped.get(tier) ?? []), JSON.stringify(["sources", plan.workspaceDir]), collisions).map(createSkillEntry);
}
function loadExecutionSkillEntries(executionWorkspaceDir, config, collisions) {
	return mergeSkillRecords(resolveWorkspaceSkillDirectories(executionWorkspaceDir).flatMap((root) => loadSkillRootRecords({
		...root,
		config
	})), JSON.stringify(["execution", executionWorkspaceDir]), collisions).map(createSkillEntry);
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
	const workspaceDir = (params.workspaceDir ?? "").trim();
	const metadataSnapshot = params.metadataSnapshot;
	if (!workspaceDir || metadataSnapshot.manifestRegistry.plugins.length === 0) {
		publishPluginSkills([], params.pluginSkillsDir);
		return [];
	}
	const config = params.config ?? {};
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
export { pluginSkillFileFromBytes as a, loadSkillRootRecords as c, appendLowerPrecedenceSkillRecords as d, mergeSkillRecords as f, SKILL_SOURCE_ORIGIN_FILENAME as h, resolvePluginSkillRootsFromMetadata as i, loadWorkspaceSkillSourceEntries as l, createSkillEntry as m, resolvePluginSkillDetails as n, validatePluginSkillPath as o, reportSkillPrecedenceCollisions as p, resolvePluginSkillRoots as r, loadExecutionSkillEntries as s, readPluginSkill as t, warnInvalidSkill as u };
