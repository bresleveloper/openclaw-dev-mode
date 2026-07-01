import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as resolveOsHomeDir } from "./home-dir-BjcCg_IW.js";
import { _ as uniqueStrings, d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { i as isPathInside } from "./path-BlG8lhgR.js";
import { o as walkDirectorySync } from "./fs-safe-aqmM_n6V.js";
import { i as openRootFileSync } from "./root-file-jRMCpJW4.js";
import { f as resolveConfigDir, m as resolveUserPath, t as CONFIG_DIR } from "./utils-BApvfmPs.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import "./boundary-file-read-CBe_wA_B.js";
import "./path-guards-CBe_wA_B.js";
import { i as normalizeSkillFilter, n as resolveEffectiveAgentSkillsLimits, t as resolveEffectiveAgentSkillFilter } from "./agent-filter-vKovqx_z.js";
import { a as resolveSandboxPath } from "./sandbox-paths-_3aaGW_c.js";
import { i as createSyntheticSourceInfo, n as formatSkillsForPrompt, t as computeSkillPromptVersion } from "./skill-version-C02E2GyH.js";
import { t as resolveSkillSource } from "./source-9Jdpd6BI.js";
import { c as resolveOpenClawMetadata, l as resolveSkillInvocationPolicy, o as shouldIncludeSkill, r as resolveBundledAllowlist, s as parseFrontmatter, u as resolveSkillKey } from "./config-CUiL6xlQ.js";
import { t as resolveBundledSkillsDir } from "./bundled-dir-BCWH7qz6.js";
import { i as resolvePluginSkillDirs, n as resolveAllowedSkillSymlinkTargetRealPaths, r as tryRealpath } from "./symlink-targets-D2Goh3S5.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/skills/discovery/skill-index.ts
/** Normalizes a skill name to the comparable key used by filters and commands. */
function normalizeSkillIndexName(value) {
	return value.trim().toLowerCase().replace(/[\s_/]+/g, "-").replace(/[^a-z0-9-]+/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
function isSkillRuntimeVisible(entry) {
	return entry.exposure?.includeInRuntimeRegistry ?? true;
}
function isSkillPromptVisible(entry) {
	if (entry.exposure) return entry.exposure.includeInAvailableSkillsPrompt ?? true;
	if (entry.invocation) return !entry.invocation.disableModelInvocation;
	return !entry.skill.disableModelInvocation;
}
function isSkillUserInvocable(entry) {
	if (entry.exposure) return entry.exposure.userInvocable ?? true;
	if (entry.invocation) return entry.invocation.userInvocable ?? true;
	return true;
}
function filterPromptVisibleSkillEntries(entries) {
	return entries.filter(isSkillPromptVisible);
}
function filterUserInvocableSkillEntries(entries) {
	return entries.filter(isSkillUserInvocable);
}
function buildSkillIndexEntries(entries, opts) {
	const agentSkillSet = opts?.agentSkillFilter === void 0 ? void 0 : new Set(opts.agentSkillFilter);
	return entries.map((entry) => createSkillIndexEntry(entry, opts, agentSkillSet));
}
function createSkillIndexEntry(entry, opts, agentSkillSet) {
	const name = entry.skill.name;
	const skillKey = resolveSkillKey(entry.skill, entry);
	const source = resolveSkillSource(entry.skill);
	return {
		entry,
		name,
		normalizedName: normalizeSkillIndexName(name),
		skillKey,
		normalizedSkillKey: normalizeSkillIndexName(skillKey),
		source,
		bundled: source === "openclaw-bundled" || source === "unknown" && opts?.bundledNames?.has(name) === true,
		agentAllowed: agentSkillSet === void 0 || agentSkillSet.has(name),
		runtimeVisible: isSkillRuntimeVisible(entry),
		promptVisible: isSkillPromptVisible(entry),
		userInvocable: isSkillUserInvocable(entry)
	};
}
//#endregion
//#region src/skills/loading/local-loader.ts
function readSkillFileSync(params) {
	const opened = openRootFileSync({
		absolutePath: params.filePath,
		rootPath: params.rootRealPath,
		rootRealPath: params.rootRealPath,
		boundaryLabel: "skill root",
		maxBytes: params.maxBytes
	});
	if (!opened.ok) return null;
	try {
		return fs.readFileSync(opened.fd, "utf8");
	} finally {
		fs.closeSync(opened.fd);
	}
}
function loadSingleSkillDirectory(params) {
	const skillFilePath = path.join(params.skillDir, "SKILL.md");
	const raw = readSkillFileSync({
		rootRealPath: params.rootRealPath,
		filePath: skillFilePath,
		maxBytes: params.maxBytes
	});
	if (!raw) return null;
	let frontmatter;
	try {
		frontmatter = parseFrontmatter(raw);
	} catch {
		return null;
	}
	const fallbackName = path.basename(params.skillDir).trim();
	const name = frontmatter.name?.trim() || fallbackName;
	const description = frontmatter.description?.trim();
	if (!name || !description) return null;
	const invocation = resolveSkillInvocationPolicy(frontmatter);
	const filePath = path.resolve(skillFilePath);
	const baseDir = path.resolve(params.skillDir);
	return {
		skill: {
			name,
			description,
			filePath,
			baseDir,
			promptVersion: computeSkillPromptVersion(raw),
			source: params.source,
			sourceInfo: createSyntheticSourceInfo(filePath, {
				source: params.source,
				baseDir,
				scope: "project",
				origin: "top-level"
			}),
			disableModelInvocation: invocation.disableModelInvocation
		},
		frontmatter
	};
}
function listCandidateSkillDirs(dir) {
	try {
		return fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules").map((entry) => path.join(dir, entry.name)).toSorted((left, right) => left.localeCompare(right));
	} catch {
		return [];
	}
}
/** Loads skills from a local directory while turning read/parse failures into diagnostics. */
function loadSkillsFromDirSafe(params) {
	const rootDir = path.resolve(params.dir);
	let rootRealPath;
	try {
		rootRealPath = fs.realpathSync(rootDir);
	} catch {
		return {
			skills: [],
			frontmatterByFilePath: /* @__PURE__ */ new Map()
		};
	}
	const rootSkill = loadSingleSkillDirectory({
		skillDir: rootDir,
		source: params.source,
		rootRealPath,
		maxBytes: params.maxBytes
	});
	if (rootSkill) return {
		skills: [rootSkill.skill],
		frontmatterByFilePath: new Map([[rootSkill.skill.filePath, rootSkill.frontmatter]])
	};
	const loadedSkills = listCandidateSkillDirs(rootDir).map((skillDir) => loadSingleSkillDirectory({
		skillDir,
		source: params.source,
		rootRealPath,
		maxBytes: params.maxBytes
	})).filter((skill) => skill !== null);
	const frontmatterByFilePath = /* @__PURE__ */ new Map();
	for (const loaded of loadedSkills) frontmatterByFilePath.set(loaded.skill.filePath, loaded.frontmatter);
	return {
		skills: loadedSkills.map((loaded) => loaded.skill),
		frontmatterByFilePath
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
		maxBytes: params.maxBytes
	});
	if (!raw) return null;
	try {
		return parseFrontmatter(raw);
	} catch {
		return null;
	}
}
//#endregion
//#region src/skills/loading/serialize.ts
const SKILLS_SYNC_QUEUE = /* @__PURE__ */ new Map();
/** Serializes async work by key so repeated skill loads do not race on shared files. */
async function serializeByKey(key, task) {
	const next = (SKILLS_SYNC_QUEUE.get(key) ?? Promise.resolve()).then(task, task);
	SKILLS_SYNC_QUEUE.set(key, next);
	try {
		return await next;
	} finally {
		if (SKILLS_SYNC_QUEUE.get(key) === next) SKILLS_SYNC_QUEUE.delete(key);
	}
}
//#endregion
//#region src/skills/loading/workspace.ts
const fsp = fs.promises;
const skillsLogger = createSubsystemLogger("skills");
const SKILL_SOURCE_ORIGIN_RELATIVE_PATH = path.join(".openclaw", "source-origin.json");
const MAX_SKILL_SOURCE_ORIGIN_BYTES = 16 * 1024;
/**
* Replace OS home directory prefixes with `~` in skill file paths to
* reduce system prompt token usage while matching host file-tool expansion.
*
* Example: `/Users/alice/.bun/.../skills/github/SKILL.md`
* → `~/.bun/.../skills/github/SKILL.md`
*
* Saves ~5–6 tokens per skill path × N skills ≈ 400–600 tokens total.
*/
function resolveUserHomeDir() {
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
	const resolvedHomes = [resolveUserHomeDir(), resolveNativeUserHomeDir()].filter((home) => Boolean(home)).map((home) => path.resolve(home));
	const realHomes = resolvedHomes.map((home) => tryRealpath(home)).filter((home) => Boolean(home));
	return uniqueStrings([...resolvedHomes, ...realHomes]).toSorted((a, b) => b.length - a.length);
}
function compactSkillPaths(skills) {
	const homes = resolveCompactHomePrefixes();
	if (homes.length === 0) return skills;
	const preservedRoots = resolvePreservedPromptSkillPathRoots();
	const tildeRoots = resolvePromptTildeRoots();
	return skills.map((s) => ({
		...s,
		filePath: shouldPreservePromptSkillPath(s.filePath, preservedRoots, tildeRoots) ? s.filePath : compactHomePath(s.filePath, homes)
	}));
}
function resolvePreservedPromptSkillPathRoots() {
	const configDir = resolveConfigDir();
	const promptSkillDirs = [path.resolve(configDir, "skills"), path.resolve(configDir, "plugin-skills")];
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
function compactHomePath(filePath, homes) {
	for (const home of homes) for (const prefix of compactHomePrefixesForHome(home)) if (filePath.startsWith(prefix)) return "~/" + normalizeCompactedSkillPath(filePath.slice(prefix.length), prefix);
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
function compactPathForConsoleMessage(filePath) {
	return compactHomePath(filePath, resolveCompactHomePrefixes());
}
function filterSkillEntries(entries, config, skillFilter, eligibility) {
	const bundledAllowlist = resolveBundledAllowlist(config);
	let filtered = entries.filter((entry) => shouldIncludeSkill({
		entry,
		config,
		bundledAllowlist,
		eligibility
	}));
	if (skillFilter !== void 0) {
		const normalized = normalizeSkillFilter(skillFilter) ?? [];
		const label = normalized.length > 0 ? normalized.join(", ") : "(none)";
		skillsLogger.debug(`Applying skill filter: ${label}`);
		if (normalized.length > 0) {
			const allowed = new Set(normalized);
			filtered = filtered.filter((entry) => allowed.has(entry.skill.name));
		} else filtered = [];
		skillsLogger.debug(`After skill filter: ${filtered.map((entry) => entry.skill.name).join(", ") || "(none)"}`);
	}
	return filtered;
}
const DEFAULT_MAX_CANDIDATES_PER_ROOT = 300;
const DEFAULT_MAX_SKILLS_LOADED_PER_SOURCE = 200;
const DEFAULT_MAX_SKILLS_IN_PROMPT = 150;
const DEFAULT_MAX_SKILLS_PROMPT_CHARS = 18e3;
const DEFAULT_MAX_SKILL_FILE_BYTES = 256e3;
const DEFAULT_MIN_RAW_ENTRIES_PER_DIRECTORY_SCAN = 1e3;
const DEFAULT_MAX_RAW_ENTRIES_PER_DIRECTORY_SCAN = 1e4;
const MAX_GROUPED_SKILL_SCAN_DEPTH = 6;
const MAX_CONFIGURED_ROOT_GROUPED_SKILL_SCAN_DEPTH = 2;
function resolveSkillsLimits(config, agentId) {
	const limits = config?.skills?.limits;
	const agentSkillsLimits = resolveEffectiveAgentSkillsLimits(config, agentId);
	return {
		maxCandidatesPerRoot: limits?.maxCandidatesPerRoot ?? DEFAULT_MAX_CANDIDATES_PER_ROOT,
		maxSkillsLoadedPerSource: limits?.maxSkillsLoadedPerSource ?? DEFAULT_MAX_SKILLS_LOADED_PER_SOURCE,
		maxSkillsInPrompt: limits?.maxSkillsInPrompt ?? DEFAULT_MAX_SKILLS_IN_PROMPT,
		maxSkillsPromptChars: agentSkillsLimits?.maxSkillsPromptChars ?? limits?.maxSkillsPromptChars ?? DEFAULT_MAX_SKILLS_PROMPT_CHARS,
		maxSkillFileBytes: limits?.maxSkillFileBytes ?? DEFAULT_MAX_SKILL_FILE_BYTES
	};
}
function listChildDirectories(dir, opts) {
	const scan = walkDirectorySync(dir, {
		maxDepth: 1,
		maxEntries: opts?.maxRawEntriesToScan === void 0 ? resolveRawEntryScanLimit(opts?.maxCandidateDirs) : Math.max(0, opts.maxRawEntriesToScan),
		symlinks: opts?.followSymlinks === false ? "skip" : "follow",
		include: (entry) => entry.kind === "directory" && !entry.name.startsWith(".") && entry.name !== "node_modules"
	});
	if (scan.scannedEntryCount === 0 && scan.entries.length === 0) return {
		dirs: [],
		scannedEntryCount: 0,
		truncated: false
	};
	return {
		dirs: scan.entries.map((entry) => entry.name),
		scannedEntryCount: scan.scannedEntryCount,
		truncated: scan.truncated
	};
}
function resolveRawEntryScanLimit(maxCandidateDirs) {
	if (maxCandidateDirs === void 0) return Number.POSITIVE_INFINITY;
	const normalized = Math.max(0, maxCandidateDirs);
	if (normalized === 0) return 0;
	return Math.min(DEFAULT_MAX_RAW_ENTRIES_PER_DIRECTORY_SCAN, Math.max(DEFAULT_MIN_RAW_ENTRIES_PER_DIRECTORY_SCAN, normalized * 10));
}
function createSkillDiscoveryBudget(maxCandidateDirs) {
	const normalized = Math.max(0, maxCandidateDirs);
	return {
		remainingDirectoryScans: normalized * MAX_GROUPED_SKILL_SCAN_DEPTH,
		remainingRawEntries: resolveRawEntryScanLimit(normalized) * (normalized + 1),
		truncated: false
	};
}
function listBudgetedChildDirectories(dir, budget, opts) {
	if (budget.remainingDirectoryScans <= 0 || budget.remainingRawEntries <= 0) {
		budget.truncated = true;
		return {
			dirs: [],
			scannedEntryCount: 0,
			truncated: false
		};
	}
	budget.remainingDirectoryScans -= 1;
	const maxRawEntriesToScan = Math.min(resolveRawEntryScanLimit(opts.maxCandidateDirs), budget.remainingRawEntries);
	const scan = listChildDirectories(dir, {
		followSymlinks: opts.followSymlinks,
		maxCandidateDirs: opts.maxCandidateDirs,
		maxRawEntriesToScan
	});
	budget.remainingRawEntries = Math.max(0, budget.remainingRawEntries - scan.scannedEntryCount);
	budget.truncated ||= scan.truncated;
	return scan;
}
function containsDiscoverableSkill(dir, opts) {
	const discoveryBudget = createSkillDiscoveryBudget(opts.maxCandidateDirs);
	const queue = [{
		dir,
		depth: 0
	}];
	for (const candidate of queue) {
		if (!candidate) continue;
		if (candidate.depth > 0 && fs.existsSync(path.join(candidate.dir, "SKILL.md"))) {
			if (hasLoadableSkillFrontmatter(dir, candidate.dir, opts.maxSkillFileBytes)) return true;
			continue;
		}
		if (candidate.depth >= MAX_GROUPED_SKILL_SCAN_DEPTH) continue;
		if (hasCandidateSymlinkChild(candidate.dir, candidate.depth === 0 ? opts.skipTopLevelDirName : void 0, resolveRawEntryScanLimit(opts.maxCandidateDirs))) return true;
		const childDirs = listBudgetedChildDirectories(candidate.dir, discoveryBudget, {
			followSymlinks: false,
			maxCandidateDirs: opts.maxCandidateDirs
		}).dirs;
		for (const childDir of childDirs.toSorted().slice(0, opts.maxCandidateDirs)) {
			if (candidate.depth === 0 && childDir === opts.skipTopLevelDirName) continue;
			queue.push({
				dir: path.join(candidate.dir, childDir),
				depth: candidate.depth + 1
			});
		}
	}
	return false;
}
function hasCandidateSymlinkChild(dir, skipName, maxEntriesToScan) {
	const maxEntries = Math.max(0, maxEntriesToScan);
	if (maxEntries === 0) return false;
	let handle;
	try {
		handle = fs.opendirSync(dir);
		for (let scanned = 0; scanned < maxEntries; scanned += 1) {
			const entry = handle.readSync();
			if (!entry) break;
			if (entry.name === skipName || entry.name.startsWith(".") || entry.name === "node_modules") continue;
			if (entry.isSymbolicLink()) return true;
		}
	} catch {
		return false;
	} finally {
		handle?.closeSync();
	}
	return false;
}
function hasLoadableSkillFrontmatter(rootDir, skillDir, maxSkillFileBytes) {
	const frontmatter = readSkillFrontmatterSafe({
		rootDir,
		filePath: path.join(skillDir, "SKILL.md"),
		maxBytes: maxSkillFileBytes ?? DEFAULT_MAX_SKILL_FILE_BYTES
	});
	const fallbackName = path.basename(skillDir).trim();
	const name = frontmatter?.name?.trim() || fallbackName;
	return Boolean(name) && Boolean(frontmatter?.description?.trim());
}
function isSymlinkPath(filePath) {
	try {
		return fs.lstatSync(filePath).isSymbolicLink();
	} catch {
		return false;
	}
}
function buildEscapedSkillPathReason(params) {
	const candidateIsSymlink = isSymlinkPath(params.candidatePath);
	if (params.source === "openclaw-bundled" && candidateIsSymlink) return {
		reason: "bundled-symlink-escape",
		consoleHint: "reason=bundled-symlink-escape hint=likely-stray-local-symlink-or-checkout-mutation"
	};
	if (candidateIsSymlink) return {
		reason: "symlink-escape",
		consoleHint: "reason=symlink-escape"
	};
	if (params.source === "openclaw-bundled") return {
		reason: "bundled-root-escape",
		consoleHint: "reason=bundled-root-escape hint=likely-stray-local-symlink-or-checkout-mutation"
	};
	return {
		reason: "path-escape",
		consoleHint: "reason=path-escape"
	};
}
function warnEscapedSkillPath(params) {
	const compactRootDir = compactPathForConsoleMessage(params.rootDir);
	const compactRootRealPath = compactPathForConsoleMessage(params.rootRealPath);
	const compactCandidatePath = compactPathForConsoleMessage(params.candidatePath);
	const compactCandidateRealPath = compactPathForConsoleMessage(params.candidateRealPath);
	const rootResolved = path.resolve(params.rootDir) === params.rootRealPath ? "" : ` rootResolved=${compactRootRealPath}`;
	const escapeReason = buildEscapedSkillPathReason({
		source: params.source,
		candidatePath: params.candidatePath
	});
	skillsLogger.warn("Skipping escaped skill path outside its configured root.", {
		source: params.source,
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		path: params.candidatePath,
		realPath: params.candidateRealPath,
		reason: escapeReason.reason,
		consoleMessage: `Skipping escaped skill path outside its configured root: source=${params.source} root=${compactRootDir}${rootResolved} ${escapeReason.consoleHint} requested=${compactCandidatePath} resolved=${compactCandidateRealPath}`
	});
}
function resolveContainedSkillPath(params) {
	const candidateRealPath = tryRealpath(params.candidatePath);
	if (!candidateRealPath) return null;
	if (isPathInside(params.rootRealPath, candidateRealPath) || isPathInsideAnyRoot(params.allowedSymlinkTargetRealPaths ?? [], candidateRealPath)) return candidateRealPath;
	warnEscapedSkillPath({
		source: params.source,
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		candidatePath: path.resolve(params.candidatePath),
		candidateRealPath
	});
	return null;
}
function resolveNestedSkillsRoot(dir, opts) {
	if (hasLoadableSkillFrontmatter(dir, dir, opts?.maxSkillFileBytes)) return { baseDir: dir };
	const rootSkillMdExists = fs.existsSync(path.join(dir, "SKILL.md"));
	const nested = path.join(dir, "skills");
	try {
		if (!fs.existsSync(nested) || !fs.statSync(nested).isDirectory()) return { baseDir: dir };
	} catch {
		return { baseDir: dir };
	}
	const scanLimit = Math.max(0, opts?.maxEntriesToScan ?? 100);
	if (!rootSkillMdExists && containsDiscoverableSkill(dir, {
		maxCandidateDirs: scanLimit,
		maxSkillFileBytes: opts?.maxSkillFileBytes,
		skipTopLevelDirName: "skills"
	})) return { baseDir: dir };
	const discoveryBudget = createSkillDiscoveryBudget(scanLimit);
	const queue = [{
		dir: nested,
		depth: 0
	}];
	for (const candidate of queue) {
		if (!candidate) continue;
		if (hasLoadableSkillFrontmatter(nested, candidate.dir, opts?.maxSkillFileBytes)) return {
			baseDir: nested,
			note: `Detected nested skills root at ${nested}`
		};
		if (candidate.depth >= MAX_GROUPED_SKILL_SCAN_DEPTH) continue;
		const childDirs = listBudgetedChildDirectories(candidate.dir, discoveryBudget, {
			followSymlinks: false,
			maxCandidateDirs: scanLimit
		}).dirs;
		for (const childDir of childDirs.toSorted().slice(0, scanLimit)) queue.push({
			dir: path.join(candidate.dir, childDir),
			depth: candidate.depth + 1
		});
	}
	return { baseDir: dir };
}
function unwrapLoadedSkillRecords(loaded) {
	if (Array.isArray(loaded)) return loaded.map((skill) => ({ skill }));
	if (loaded && typeof loaded === "object" && "skills" in loaded) {
		const skills = loaded.skills;
		if (Array.isArray(skills)) {
			const loadedResult = loaded;
			const frontmatterByFilePath = loadedResult.frontmatterByFilePath instanceof Map ? loadedResult.frontmatterByFilePath : void 0;
			return skills.map((skill) => ({
				skill,
				frontmatter: frontmatterByFilePath?.get(skill.filePath)
			}));
		}
	}
	return [];
}
function loadContainedSkillRecords(params) {
	const expectedBaseDir = path.resolve(params.skillDir);
	const records = unwrapLoadedSkillRecords(loadSkillsFromDirSafe({
		dir: params.skillDir,
		source: params.source,
		maxBytes: params.maxSkillFileBytes
	})).filter((record) => path.resolve(record.skill.baseDir) === expectedBaseDir);
	const canonicalSkillDir = params.canonicalSkillDir;
	return canonicalSkillDir ? records.map((record) => canonicalizeLoadedSkillRecord(record, canonicalSkillDir)) : records;
}
function readSourceInstallSkillKey(skillDir) {
	try {
		const sourceOriginPath = path.join(skillDir, SKILL_SOURCE_ORIGIN_RELATIVE_PATH);
		const stat = fs.lstatSync(sourceOriginPath);
		if (!stat.isFile() || stat.isSymbolicLink() || stat.size > MAX_SKILL_SOURCE_ORIGIN_BYTES) return;
		const skillDirRealPath = tryRealpath(skillDir);
		const sourceOriginRealPath = tryRealpath(sourceOriginPath);
		if (!skillDirRealPath || !sourceOriginRealPath || !isPathInside(skillDirRealPath, sourceOriginRealPath)) return;
		const raw = fs.readFileSync(sourceOriginPath, "utf8");
		return normalizeOptionalString(JSON.parse(raw).slug);
	} catch {
		return;
	}
}
function resolveSkillEntryMetadata(params) {
	const metadata = resolveOpenClawMetadata(params.frontmatter);
	if (metadata?.skillKey) return metadata;
	const sourceInstallSkillKey = readSourceInstallSkillKey(params.skillDir);
	if (!sourceInstallSkillKey) return metadata;
	return {
		...metadata,
		skillKey: sourceInstallSkillKey
	};
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
/**
* Sets only the sync source directory for a skill record, without modifying
* the baseDir or filePath. This is used for plugin skills where the symlink
* path should be preserved for display purposes, but the real path is needed
* for syncing to the sandbox workspace.
*/
function setSyncSourceForPluginSkill(record, syncSourceDir) {
	return {
		...record,
		syncSourceDir,
		syncDirName: path.basename(record.skill.baseDir)
	};
}
function isPathInsideAnyRoot(rootRealPaths, candidateRealPath) {
	return rootRealPaths.some((rootRealPath) => isPathInside(rootRealPath, candidateRealPath));
}
function shouldEnforceConfiguredSkillRootContainment(source) {
	return source !== "openclaw-managed" && source !== "agents-skills-personal";
}
function shouldUseConfiguredSymlinkTargets(source) {
	return source === "openclaw-workspace" || source === "openclaw-extra" || source === "agents-skills-project";
}
function resolveSkillRootCandidatePath(params) {
	if (!shouldEnforceConfiguredSkillRootContainment(params.source)) return tryRealpath(params.candidatePath);
	return resolveContainedSkillPath({
		source: params.source,
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		candidatePath: params.candidatePath,
		allowedSymlinkTargetRealPaths: shouldUseConfiguredSymlinkTargets(params.source) ? params.allowedSymlinkTargetRealPaths : []
	});
}
function canonicalSkillDirForSource(source, skillDirRealPath) {
	return shouldEnforceConfiguredSkillRootContainment(source) ? void 0 : skillDirRealPath;
}
function resolveSkillFilePath(params) {
	return resolveContainedSkillPath({
		source: params.source,
		rootDir: params.skillDir,
		rootRealPath: params.skillDirRealPath,
		candidatePath: params.candidatePath
	});
}
function resolvePluginSkillRootRealPaths(pluginSkillDirs) {
	return uniqueStrings(pluginSkillDirs.map((dir) => tryRealpath(dir)).filter((dir) => Boolean(dir)));
}
function loadGeneratedPluginSkillRecords(params) {
	const allowedRootRealPaths = resolvePluginSkillRootRealPaths(params.pluginSkillDirs);
	if (allowedRootRealPaths.length === 0) return [];
	const rootDir = path.resolve(params.pluginSkillsDir);
	if (!fs.existsSync(rootDir)) return [];
	const rootRealPath = tryRealpath(rootDir) ?? rootDir;
	const maxCandidatesPerRoot = Math.max(0, params.limits.maxCandidatesPerRoot);
	const maxSkillsLoadedPerSource = Math.max(0, params.limits.maxSkillsLoadedPerSource);
	const childDirScan = listChildDirectories(rootDir, { maxCandidateDirs: maxCandidatesPerRoot });
	const childDirs = maxSkillsLoadedPerSource === 0 ? [] : childDirScan.dirs.toSorted().slice(0, maxCandidatesPerRoot);
	const loadedSkills = [];
	for (const name of childDirs) {
		const skillDir = path.join(rootDir, name);
		if (!isSymlinkPath(skillDir)) continue;
		const skillDirRealPath = tryRealpath(skillDir);
		if (!skillDirRealPath || !isPathInsideAnyRoot(allowedRootRealPaths, skillDirRealPath)) {
			if (skillDirRealPath) warnEscapedSkillPath({
				source: params.source,
				rootDir,
				rootRealPath,
				candidatePath: path.resolve(skillDir),
				candidateRealPath: skillDirRealPath
			});
			continue;
		}
		const skillMd = path.join(skillDir, "SKILL.md");
		let skillMdStat;
		try {
			skillMdStat = fs.lstatSync(skillMd);
		} catch {
			continue;
		}
		if (!skillMdStat.isFile() || skillMdStat.isSymbolicLink()) continue;
		const skillMdRealPath = tryRealpath(skillMd);
		if (!skillMdRealPath || !isPathInside(skillDirRealPath, skillMdRealPath)) continue;
		if (skillMdStat.size > params.limits.maxSkillFileBytes) {
			skillsLogger.warn("Skipping skill due to oversized SKILL.md.", {
				skill: name,
				filePath: skillMd,
				size: skillMdStat.size,
				maxSkillFileBytes: params.limits.maxSkillFileBytes
			});
			continue;
		}
		const loadedRecords = loadContainedSkillRecords({
			skillDir,
			source: params.source,
			maxSkillFileBytes: params.limits.maxSkillFileBytes
		});
		loadedSkills.push(...loadedRecords.map((record) => setSyncSourceForPluginSkill(record, skillDirRealPath)));
		if (loadedSkills.length >= maxSkillsLoadedPerSource) break;
	}
	if (loadedSkills.length > maxSkillsLoadedPerSource) return loadedSkills.toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en")).slice(0, maxSkillsLoadedPerSource);
	return loadedSkills;
}
function loadSkillEntries(workspaceDir, opts) {
	const limits = resolveSkillsLimits(opts?.config, opts?.agentId);
	const allowedSymlinkTargetRealPaths = resolveAllowedSkillSymlinkTargetRealPaths(opts?.config);
	const loadSkills = (params) => {
		const rootDir = path.resolve(params.dir);
		if (!fs.existsSync(rootDir)) return [];
		const rootRealPath = tryRealpath(rootDir) ?? rootDir;
		const baseDir = resolveNestedSkillsRoot(params.dir, {
			maxEntriesToScan: limits.maxCandidatesPerRoot,
			maxSkillFileBytes: limits.maxSkillFileBytes
		}).baseDir;
		const baseDirRealPath = resolveSkillRootCandidatePath({
			source: params.source,
			rootDir,
			rootRealPath,
			candidatePath: baseDir,
			allowedSymlinkTargetRealPaths
		});
		if (!baseDirRealPath) return [];
		const rootSkillMd = path.join(baseDir, "SKILL.md");
		if (fs.existsSync(rootSkillMd)) {
			const rootSkillRealPath = resolveSkillFilePath({
				source: params.source,
				skillDir: baseDir,
				skillDirRealPath: baseDirRealPath,
				candidatePath: rootSkillMd
			});
			if (!rootSkillRealPath) return [];
			try {
				const size = fs.statSync(rootSkillRealPath).size;
				if (size > limits.maxSkillFileBytes) {
					skillsLogger.warn("Skipping skills root due to oversized SKILL.md.", {
						dir: baseDir,
						filePath: rootSkillMd,
						size,
						maxSkillFileBytes: limits.maxSkillFileBytes
					});
					return [];
				}
			} catch {
				return [];
			}
			return loadContainedSkillRecords({
				skillDir: baseDir,
				source: params.source,
				maxSkillFileBytes: limits.maxSkillFileBytes,
				canonicalSkillDir: canonicalSkillDirForSource(params.source, baseDirRealPath)
			});
		}
		const maxCandidatesPerRoot = Math.max(0, limits.maxCandidatesPerRoot);
		const maxSkillsLoadedPerSource = Math.max(0, limits.maxSkillsLoadedPerSource);
		const nestedSkillsRootPath = path.resolve(baseDir, "skills");
		const baseDirIsNestedSkillsRoot = path.resolve(baseDir) === path.resolve(rootDir, "skills");
		const baseDirLooksLikeSkillsRoot = path.basename(baseDir) === "skills";
		const discoveryBudget = createSkillDiscoveryBudget(maxCandidatesPerRoot);
		const childDirScan = listBudgetedChildDirectories(baseDir, discoveryBudget, { maxCandidateDirs: maxCandidatesPerRoot });
		const childDirs = childDirScan.dirs;
		const suspicious = childDirScan.truncated;
		const sortedChildDirs = childDirs.toSorted();
		const limitedChildren = maxSkillsLoadedPerSource === 0 ? [] : sortedChildDirs.slice(0, maxCandidatesPerRoot);
		if (maxSkillsLoadedPerSource > 0 && sortedChildDirs.includes("skills") && !limitedChildren.includes("skills")) limitedChildren.push("skills");
		if (suspicious) skillsLogger.warn("Skills root looks suspiciously large, truncating discovery.", {
			dir: params.dir,
			baseDir,
			childDirCount: childDirs.length,
			scannedEntryCount: childDirScan.scannedEntryCount,
			maxEntriesToScan: resolveRawEntryScanLimit(maxCandidatesPerRoot),
			maxCandidatesPerRoot: limits.maxCandidatesPerRoot,
			maxSkillsLoadedPerSource: limits.maxSkillsLoadedPerSource
		});
		else if (childDirs.length > maxCandidatesPerRoot) skillsLogger.warn("Skills root has many entries, truncating discovery.", {
			dir: params.dir,
			baseDir,
			childDirCount: childDirs.length,
			maxCandidatesPerRoot: limits.maxCandidatesPerRoot,
			maxSkillsLoadedPerSource: limits.maxSkillsLoadedPerSource
		});
		const loadedSkills = [];
		const loadCandidateSkill = ({ skillDir, skillDirRealPath, name, skillMdRealPath }) => {
			try {
				const size = fs.statSync(skillMdRealPath).size;
				if (size > limits.maxSkillFileBytes) {
					skillsLogger.warn("Skipping skill due to oversized SKILL.md.", {
						skill: name,
						filePath: path.join(skillDir, "SKILL.md"),
						size,
						maxSkillFileBytes: limits.maxSkillFileBytes
					});
					return;
				}
			} catch {
				return;
			}
			loadedSkills.push(...loadContainedSkillRecords({
				skillDir,
				source: params.source,
				maxSkillFileBytes: limits.maxSkillFileBytes,
				canonicalSkillDir: canonicalSkillDirForSource(params.source, skillDirRealPath)
			}));
		};
		const skillCandidates = [];
		const scanQueue = limitedChildren.map((name) => ({
			skillDir: path.join(baseDir, name),
			name,
			depth: name === "skills" && !fs.existsSync(path.join(baseDir, name, "SKILL.md")) ? 0 : 1
		}));
		for (const candidate of scanQueue) {
			if (!candidate) continue;
			const skillDirRealPath = resolveSkillRootCandidatePath({
				source: params.source,
				rootDir,
				rootRealPath: baseDirRealPath,
				candidatePath: candidate.skillDir,
				allowedSymlinkTargetRealPaths
			});
			if (!skillDirRealPath) continue;
			const skillMd = path.join(candidate.skillDir, "SKILL.md");
			if (fs.existsSync(skillMd)) {
				const skillMdRealPath = resolveSkillFilePath({
					source: params.source,
					skillDir: candidate.skillDir,
					skillDirRealPath,
					candidatePath: skillMd
				});
				if (skillMdRealPath) skillCandidates.push({
					skillDir: candidate.skillDir,
					skillDirRealPath,
					name: candidate.name,
					skillMdRealPath
				});
				continue;
			}
			const candidatePath = path.resolve(candidate.skillDir);
			const maxGroupedDepth = params.source === "openclaw-extra" && !baseDirIsNestedSkillsRoot && !baseDirLooksLikeSkillsRoot && candidatePath !== nestedSkillsRootPath && !isPathInside(nestedSkillsRootPath, candidatePath) ? MAX_CONFIGURED_ROOT_GROUPED_SKILL_SCAN_DEPTH : MAX_GROUPED_SKILL_SCAN_DEPTH;
			if (candidate.depth >= maxGroupedDepth) continue;
			const nestedChildScan = listBudgetedChildDirectories(candidate.skillDir, discoveryBudget, { maxCandidateDirs: maxCandidatesPerRoot });
			const nestedChildren = nestedChildScan.dirs;
			if (nestedChildScan.truncated) skillsLogger.warn("Nested skills directory looks suspiciously large, truncating discovery.", {
				dir: params.dir,
				baseDir,
				nestedDir: candidate.skillDir,
				nestedChildDirCount: nestedChildren.length,
				scannedEntryCount: nestedChildScan.scannedEntryCount,
				maxEntriesToScan: resolveRawEntryScanLimit(maxCandidatesPerRoot),
				maxCandidatesPerRoot: limits.maxCandidatesPerRoot,
				maxSkillsLoadedPerSource: limits.maxSkillsLoadedPerSource,
				maxGroupedSkillScanDepth: MAX_GROUPED_SKILL_SCAN_DEPTH
			});
			else if (nestedChildren.length > maxCandidatesPerRoot) skillsLogger.warn("Nested skills directory has many entries, truncating discovery.", {
				dir: params.dir,
				baseDir,
				nestedDir: candidate.skillDir,
				nestedChildDirCount: nestedChildren.length,
				maxCandidatesPerRoot: limits.maxCandidatesPerRoot,
				maxSkillsLoadedPerSource: limits.maxSkillsLoadedPerSource,
				maxGroupedSkillScanDepth: MAX_GROUPED_SKILL_SCAN_DEPTH
			});
			for (const nestedName of nestedChildren.toSorted().slice(0, maxCandidatesPerRoot)) scanQueue.push({
				skillDir: path.join(candidate.skillDir, nestedName),
				name: `${candidate.name}/${nestedName}`,
				depth: candidate.depth + 1
			});
		}
		for (const candidate of skillCandidates.toSorted((a, b) => a.name.localeCompare(b.name))) {
			if (loadedSkills.length >= maxSkillsLoadedPerSource) break;
			loadCandidateSkill(candidate);
		}
		if (discoveryBudget.truncated) skillsLogger.warn("Skills root hit recursive discovery budget, truncating discovery.", {
			dir: params.dir,
			baseDir,
			maxCandidatesPerRoot: limits.maxCandidatesPerRoot,
			maxSkillsLoadedPerSource: limits.maxSkillsLoadedPerSource,
			maxGroupedSkillScanDepth: MAX_GROUPED_SKILL_SCAN_DEPTH
		});
		if (loadedSkills.length > maxSkillsLoadedPerSource) return loadedSkills.toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en")).slice(0, maxSkillsLoadedPerSource);
		return loadedSkills;
	};
	const workspaceOnly = opts?.workspaceOnly === true;
	const managedSkillsDir = opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills");
	const workspaceSkillsDir = path.resolve(workspaceDir, "skills");
	const bundledSkillsDir = workspaceOnly ? void 0 : opts?.bundledSkillsDir ?? resolveBundledSkillsDir();
	const pluginSkillsDir = opts?.pluginSkillsDir ?? path.join(CONFIG_DIR, "plugin-skills");
	const extraDirs = normalizeTrimmedStringList(workspaceOnly ? [] : opts?.config?.skills?.load?.extraDirs ?? []);
	const pluginSkillDirs = workspaceOnly ? [] : resolvePluginSkillDirs({
		workspaceDir,
		config: opts?.config,
		pluginSkillsDir
	});
	const mergedExtraDirs = [...extraDirs, ...pluginSkillDirs];
	const bundledSkills = bundledSkillsDir ? loadSkills({
		dir: bundledSkillsDir,
		source: "openclaw-bundled"
	}) : [];
	const extraSkills = [...mergedExtraDirs.flatMap((dir) => {
		return loadSkills({
			dir: resolveUserPath(dir),
			source: "openclaw-extra"
		});
	}), ...loadGeneratedPluginSkillRecords({
		pluginSkillsDir,
		pluginSkillDirs,
		source: "openclaw-extra",
		limits
	})];
	const managedSkills = workspaceOnly ? [] : loadSkills({
		dir: managedSkillsDir,
		source: "openclaw-managed"
	});
	const osHomeDir = resolveUserHomeDir();
	const personalAgentsSkillsDir = osHomeDir ? path.resolve(osHomeDir, ".agents", "skills") : path.resolve(".agents", "skills");
	const personalAgentsSkills = workspaceOnly ? [] : loadSkills({
		dir: personalAgentsSkillsDir,
		source: "agents-skills-personal"
	});
	const projectAgentsSkillsDir = path.resolve(workspaceDir, ".agents", "skills");
	const projectAgentsSkills = workspaceOnly ? [] : loadSkills({
		dir: projectAgentsSkillsDir,
		source: "agents-skills-project"
	});
	const workspaceSkills = loadSkills({
		dir: workspaceSkillsDir,
		source: "openclaw-workspace"
	});
	const merged = /* @__PURE__ */ new Map();
	for (const record of extraSkills) merged.set(record.skill.name, record);
	for (const record of bundledSkills) merged.set(record.skill.name, record);
	for (const record of managedSkills) merged.set(record.skill.name, record);
	for (const record of personalAgentsSkills) merged.set(record.skill.name, record);
	for (const record of projectAgentsSkills) merged.set(record.skill.name, record);
	for (const record of workspaceSkills) merged.set(record.skill.name, record);
	return Array.from(merged.values()).toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en")).map((record) => {
		const skill = record.skill;
		const frontmatter = record.frontmatter ?? readSkillFrontmatterSafe({
			rootDir: skill.baseDir,
			filePath: skill.filePath,
			maxBytes: limits.maxSkillFileBytes
		}) ?? {};
		const invocation = resolveSkillInvocationPolicy(frontmatter);
		const entry = {
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
	});
}
function escapeXml(str) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
/**
* Compact skill catalog: name + location only (no description).
* Used as a fallback when the full format exceeds the char budget,
* preserving awareness of all skills before resorting to dropping.
*/
function formatSkillsCompact(skills) {
	if (skills.length === 0) return "";
	const lines = [
		"\n\nThe following skills provide specialized instructions for specific tasks.",
		"Use the read tool to load a skill's file when the task matches its name.",
		"If a skill's <version> differs from a previous turn, re-read its SKILL.md before using it.",
		"When a skill file references a relative path, resolve it against the skill directory (parent of SKILL.md / dirname of the path) and use that absolute path in tool commands.",
		"",
		"<available_skills>"
	];
	for (const skill of skills) {
		lines.push("  <skill>");
		lines.push(`    <name>${escapeXml(skill.name)}</name>`);
		lines.push(`    <location>${escapeXml(skill.filePath)}</location>`);
		if (skill.promptVersion) lines.push(`    <version>${escapeXml(skill.promptVersion)}</version>`);
		lines.push("  </skill>");
	}
	lines.push("</available_skills>");
	return lines.join("\n");
}
function buildSkillsLimitNote(params) {
	if (params.truncated) return `⚠️ Skills truncated: included ${params.included} of ${params.total}${params.compact ? " (compact format, descriptions omitted)" : ""}. Run \`openclaw skills check\` to audit.`;
	if (params.compact) return `⚠️ Skills catalog using compact format (descriptions omitted). Run \`openclaw skills check\` to audit.`;
	return "";
}
function buildRenderedSkillsPrompt(params) {
	const limitNote = buildSkillsLimitNote({
		truncated: params.skills.length < params.total,
		compact: params.compact,
		included: params.skills.length,
		total: params.total
	});
	const catalog = params.compact ? formatSkillsCompact(params.skills) : formatSkillsForPrompt(params.skills);
	return [
		params.remoteNote,
		limitNote,
		catalog
	].filter(Boolean).join("\n");
}
function applySkillsPromptLimits(params) {
	const limits = resolveSkillsLimits(params.config, params.agentId);
	const total = params.skills.length;
	let skillsForPrompt = params.skills.slice(0, Math.max(0, limits.maxSkillsInPrompt));
	let compact = false;
	const fitsFull = (skills) => buildRenderedSkillsPrompt({
		remoteNote: params.remoteNote,
		skills,
		total,
		compact: false
	}).length <= limits.maxSkillsPromptChars;
	const fitsCompact = (skills) => buildRenderedSkillsPrompt({
		remoteNote: params.remoteNote,
		skills,
		total,
		compact: true
	}).length <= limits.maxSkillsPromptChars;
	if (!fitsFull(skillsForPrompt)) if (fitsCompact(skillsForPrompt)) compact = true;
	else {
		compact = true;
		let lo = 0;
		let hi = skillsForPrompt.length;
		while (lo < hi) {
			const mid = Math.ceil((lo + hi) / 2);
			if (fitsCompact(skillsForPrompt.slice(0, mid))) lo = mid;
			else hi = mid - 1;
		}
		skillsForPrompt = skillsForPrompt.slice(0, lo);
	}
	return {
		skillsForPrompt,
		compact
	};
}
function buildWorkspaceSkillSnapshot(workspaceDir, opts) {
	const { eligible, prompt, resolvedSkills } = resolveWorkspaceSkillPromptState(workspaceDir, opts);
	const skillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	return {
		prompt,
		skills: eligible.map((entry) => ({
			name: entry.skill.name,
			primaryEnv: entry.metadata?.primaryEnv,
			requiredEnv: entry.metadata?.requires?.env?.slice()
		})),
		...skillFilter === void 0 ? {} : { skillFilter },
		resolvedSkills,
		version: opts?.snapshotVersion,
		promptFormatVersion: 1
	};
}
function buildWorkspaceSkillsPrompt(workspaceDir, opts) {
	return resolveWorkspaceSkillPromptState(workspaceDir, opts).prompt;
}
const testing = { compactHomePath };
function resolveEffectiveWorkspaceSkillFilter(opts) {
	if (opts?.skillFilter !== void 0) return normalizeSkillFilter(opts.skillFilter);
	if (!opts?.config || !opts.agentId) return;
	return resolveEffectiveAgentSkillFilter(opts.config, opts.agentId);
}
function resolveWorkspaceSkillPromptState(workspaceDir, opts) {
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	if (effectiveSkillFilter !== void 0 && effectiveSkillFilter.length === 0) return {
		eligible: [],
		prompt: "",
		resolvedSkills: []
	};
	const eligible = filterSkillEntries(opts?.entries ?? loadSkillEntries(workspaceDir, opts), opts?.config, effectiveSkillFilter, opts?.eligibility);
	const promptEntries = filterPromptVisibleSkillEntries(eligible);
	const remoteNote = opts?.eligibility?.remote?.note?.trim();
	const resolvedSkills = promptEntries.map((entry) => entry.skill);
	const { skillsForPrompt, compact } = applySkillsPromptLimits({
		skills: compactSkillPaths(resolvedSkills).toSorted((a, b) => a.name.localeCompare(b.name, "en")),
		config: opts?.config,
		agentId: opts?.agentId,
		remoteNote
	});
	return {
		eligible,
		prompt: buildRenderedSkillsPrompt({
			remoteNote,
			skills: skillsForPrompt,
			total: resolvedSkills.length,
			compact
		}),
		resolvedSkills
	};
}
function resolveSkillsPromptForRun(params) {
	const snapshotPrompt = params.skillsSnapshot?.prompt?.trim();
	if (snapshotPrompt) return snapshotPrompt;
	if (params.entries && params.entries.length > 0) {
		const prompt = buildWorkspaceSkillsPrompt(params.workspaceDir, {
			entries: params.entries,
			config: params.config,
			agentId: params.agentId,
			eligibility: params.eligibility
		});
		return prompt.trim() ? prompt : "";
	}
	return "";
}
function loadWorkspaceSkillEntries(workspaceDir, opts) {
	const entries = loadSkillEntries(workspaceDir, opts);
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	if (effectiveSkillFilter === void 0 && opts?.eligibility === void 0) return entries;
	return filterSkillEntries(entries, opts?.config, effectiveSkillFilter, opts?.eligibility);
}
function loadVisibleWorkspaceSkillEntries(workspaceDir, opts) {
	const entries = loadSkillEntries(workspaceDir, opts);
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	return filterSkillEntries(entries, opts?.config, effectiveSkillFilter, opts?.eligibility);
}
function resolveUniqueSyncedSkillDirName(base, used) {
	if (!used.has(base)) {
		used.add(base);
		return base;
	}
	for (let index = 2; index < 1e4; index += 1) {
		const candidate = `${base}-${index}`;
		if (!used.has(candidate)) {
			used.add(candidate);
			return candidate;
		}
	}
	let fallbackIndex = 1e4;
	let fallback = `${base}-${fallbackIndex}`;
	while (used.has(fallback)) {
		fallbackIndex += 1;
		fallback = `${base}-${fallbackIndex}`;
	}
	used.add(fallback);
	return fallback;
}
function resolveSyncedSkillDestinationPath(params) {
	const sourceDirName = (params.entry.syncDirName ?? path.basename(params.entry.skill.baseDir)).trim();
	if (!sourceDirName || sourceDirName === "." || sourceDirName === "..") return null;
	return resolveSandboxPath({
		filePath: resolveUniqueSyncedSkillDirName(sourceDirName, params.usedDirNames),
		cwd: params.targetSkillsDir,
		root: params.targetSkillsDir
	}).resolved;
}
async function prepareSyncedSkillsDirectory(targetSkillsDir) {
	let stats;
	try {
		stats = await fsp.lstat(targetSkillsDir);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		await fsp.mkdir(targetSkillsDir, { recursive: true });
		return;
	}
	if (!stats.isDirectory() || stats.isSymbolicLink()) {
		await fsp.rm(targetSkillsDir, {
			recursive: true,
			force: true
		});
		await fsp.mkdir(targetSkillsDir, { recursive: true });
		return;
	}
	for (const entry of await fsp.readdir(targetSkillsDir)) await fsp.rm(path.join(targetSkillsDir, entry), {
		recursive: true,
		force: true
	});
}
async function syncSkillsToWorkspace(params) {
	const sourceDir = resolveUserPath(params.sourceWorkspaceDir);
	const targetDir = resolveUserPath(params.targetWorkspaceDir);
	if (sourceDir === targetDir) return;
	await serializeByKey(`syncSkills:${targetDir}`, async () => {
		const targetSkillsDir = path.join(targetDir, "skills");
		const entries = loadWorkspaceSkillEntries(sourceDir, {
			config: params.config,
			skillFilter: params.skillFilter,
			agentId: params.agentId,
			eligibility: params.eligibility,
			managedSkillsDir: params.managedSkillsDir,
			bundledSkillsDir: params.bundledSkillsDir,
			pluginSkillsDir: params.pluginSkillsDir
		});
		await prepareSyncedSkillsDirectory(targetSkillsDir);
		const usedDirNames = /* @__PURE__ */ new Set();
		for (const entry of entries) {
			let dest;
			try {
				dest = resolveSyncedSkillDestinationPath({
					targetSkillsDir,
					entry,
					usedDirNames
				});
			} catch (error) {
				const message = error instanceof Error ? error.message : JSON.stringify(error);
				skillsLogger.warn(`Failed to resolve safe destination for ${entry.skill.name}: ${message}`);
				continue;
			}
			if (!dest) {
				skillsLogger.warn(`Failed to resolve safe destination for ${entry.skill.name}: invalid source directory name`);
				continue;
			}
			try {
				await fsp.cp(entry.syncSourceDir ?? entry.skill.baseDir, dest, {
					recursive: true,
					force: true,
					filter: (src) => {
						const name = path.basename(src);
						return !(name === ".git" || name === "node_modules");
					}
				});
			} catch (error) {
				const message = error instanceof Error ? error.message : JSON.stringify(error);
				skillsLogger.warn(`Failed to copy ${entry.skill.name} to sandbox: ${message}`);
			}
		}
	});
}
function filterWorkspaceSkillEntriesWithOptions(entries, opts) {
	return filterSkillEntries(entries, opts?.config, opts?.skillFilter, opts?.eligibility);
}
//#endregion
export { loadVisibleWorkspaceSkillEntries as a, resolveSkillsPromptForRun as c, loadSkillsFromDirSafe as d, buildSkillIndexEntries as f, formatSkillsCompact as i, syncSkillsToWorkspace as l, normalizeSkillIndexName as m, buildWorkspaceSkillsPrompt as n, loadWorkspaceSkillEntries as o, filterUserInvocableSkillEntries as p, filterWorkspaceSkillEntriesWithOptions as r, resolveNestedSkillsRoot as s, buildWorkspaceSkillSnapshot as t, testing as u };
