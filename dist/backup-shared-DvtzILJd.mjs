import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { D as walkDirectory, u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { l as pathExists, p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { a as hashConfigIncludeRaw } from "./includes-CaaCq-XN.mjs";
import { O as listAgentIds, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { C as resolveOAuthDir, E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { f as withOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-DnOgVB7K.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { n as containsConfigIncludeDirective } from "./io.read-helpers-N26RjV2V.mjs";
import { t as createConfigIO } from "./io.factory-BWiVTxfI.mjs";
import "./config-DryArA1l.mjs";
import { n as isUpdateCapturePath, t as assertNotUpdateCapturePath } from "./update-capture-paths-CSUVJC6v.mjs";
import { t as loadSingleSkillDirectory, u as tryRealpath } from "./local-loader-DP-Jr6_I.mjs";
import { a as resolveSkillDiscoveryLimits, i as isSymlinkPath, r as discoverSkillCandidates } from "./skill-root-discovery-DZF8sfp6.mjs";
import { n as isPathWithin, t as buildCleanupPlan } from "./cleanup-utils-MkYk5me2.mjs";
import { a as resolveStartupConfigSnapshot } from "./automatic-startup-config-repair-BYJPaT3C.mjs";
import { r as recordBackupRunOutcome } from "./backup-run-records-CBOO28UK.mjs";
import fs, { realpathSync, statSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/infra/backup-audit-paths.ts
const LEGACY_AUDIT_PATHS = [
	{
		directory: "logs",
		basename: "config-audit.jsonl"
	},
	{
		directory: "audit",
		basename: "system-agent.jsonl"
	},
	{
		directory: "audit",
		basename: "crestodian.jsonl"
	}
].map(({ directory, basename }) => {
	const escaped = basename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	return {
		directory,
		pattern: new RegExp(`^(?:${escaped}|\\.${escaped}\\.doctor-importing(?:\\.(?:[2-9]|[1-9][0-9]+))?|${escaped}\\.migrated(?:\\.(?:[2-9]|[1-9][0-9]+))?\\.raw(?:\\.doctor-scrub-(?:progress|restore|staging))?)$`, "u")
	};
});
/** Raw audit artifacts inherit their export exclusion after quarantine. */
function isLegacyAuditMigrationBackupPath(sourcePath, stateDir) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(sourcePath));
	if (!relativePath || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return false;
	const directory = path.dirname(relativePath);
	const basename = path.basename(relativePath);
	const quarantineIndex = basename.indexOf(".quarantined-");
	const originalBasename = quarantineIndex < 0 ? basename : basename.slice(0, quarantineIndex);
	return LEGACY_AUDIT_PATHS.some((logical) => directory === logical.directory && logical.pattern.test(originalBasename));
}
async function hasLegacyAuditBackupSources(stateDir) {
	for (const { directory } of LEGACY_AUDIT_PATHS) {
		let entries;
		const directoryPath = path.join(stateDir, directory);
		try {
			entries = await fs$1.readdir(directoryPath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		if (entries.some((entry) => isLegacyAuditMigrationBackupPath(path.join(directoryPath, entry), stateDir))) return true;
	}
	return false;
}
//#endregion
//#region src/infra/backup-volatile-filter.ts
/**
* Paths that are known to change during a live backup and commonly trigger
* tar EOF errors. These files are actively appended to (logs, sockets, pid
* markers) while `tar.c()` is reading them, which races with the size recorded
* at `lstat()` time.
*
* Skipping them is safe: they are either recreated on startup, are transient
* by nature, or have durable equivalents elsewhere in state. Snapshotting a
* partial tail of a live log has no restoration value.
*/
const CHROMIUM_SINGLETON_FILES = /* @__PURE__ */ new Set([
	"SingletonCookie",
	"SingletonLock",
	"SingletonSocket"
]);
const SQLITE_MEMORY_TRANSIENT_PATH_PATTERN = /(?:^|\/)(?:[^/]+\.sqlite\.(?:generation-(?:lock|writer)|reindex-lock)\.sqlite|[^/]+\.sqlite\.(?:backup|memory-reindex|tmp)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:-wal|-shm|-journal)?$/iu;
function normalizePosix(input) {
	if (!input) return input;
	return path.posix.normalize(input.replaceAll("\\", "/"));
}
function isUnder(childPosix, parentPosix) {
	if (!parentPosix) return false;
	const p = parentPosix.endsWith("/") ? parentPosix : `${parentPosix}/`;
	return childPosix === parentPosix || childPosix.startsWith(p);
}
function hasExtension(filePosix, extensions) {
	const ext = path.posix.extname(filePosix).toLowerCase();
	return extensions.includes(ext);
}
/** Transient names apply to every selected backup root, not just OpenClaw state. */
function isTransientBackupPath(filePath) {
	return /.+\.(?:sock$|pid$|tmp(?:\.|$))/iu.test(path.posix.basename(normalizePosix(filePath)));
}
function isTransientSqliteBackupPath(filePath) {
	const normalizedPath = normalizePosix(filePath);
	return SQLITE_MEMORY_TRANSIENT_PATH_PATTERN.test(normalizedPath);
}
function isAgentSessionTranscriptPath(filePosix, stateDirPosix) {
	const agentsRoot = path.posix.join(stateDirPosix, "agents");
	if (!isUnder(filePosix, agentsRoot)) return false;
	const parts = path.posix.relative(agentsRoot, filePosix).split("/").filter(Boolean);
	return parts.length >= 3 && parts[1] === "sessions";
}
function isManagedBrowserSingletonPath(filePosix, stateDirPosix) {
	const browserRoot = path.posix.join(stateDirPosix, "browser");
	if (!isUnder(filePosix, browserRoot)) return false;
	const parts = path.posix.relative(browserRoot, filePosix).split("/").filter(Boolean);
	return parts.length === 3 && parts[1] === "user-data" && CHROMIUM_SINGLETON_FILES.has(parts[2] ?? "");
}
function filePathCandidates(input) {
	const normalized = normalizePosix(input);
	if (normalized.startsWith("/") || /^[A-Za-z]:\//u.test(normalized)) return [normalized];
	return [normalized, normalizePosix(`/${normalized}`)];
}
/**
* Returns true if the given absolute path should be skipped during backup
* because it is a live-mutation target.
*
* Rules:
*   - `{stateDir}/sessions/**`/`*.{jsonl,log}` (legacy)
*   - `{stateDir}/agents/<agentId>/sessions/**`/`*.{jsonl,log}`
*   - `{stateDir}/cron/runs/**`/`*.{jsonl,log}`
*   - `{stateDir}/logs/**`/`*.{jsonl,log}`
*   - `{stateDir}/{delivery-queue,session-delivery-queue}/**`/`*.{json,delivered,tmp}`
*   - `{stateDir}/browser/<profile>/user-data/Singleton{Cookie,Lock,Socket}`
*   - `{stateDir}/sandbox/skills-workspaces/**`
*   - `{stateDir}/**`/`*.{sock,pid,tmp}`
*/
function isVolatileBackupPath(absolutePath, plan) {
	if (!absolutePath) return false;
	const candidates = filePathCandidates(absolutePath);
	for (const stateDir of plan.stateDirs) {
		if (!stateDir) continue;
		const stateDirPosix = normalizePosix(stateDir);
		for (const filePosix of candidates) {
			if (isUnder(filePosix, stateDirPosix) && isLegacyAuditMigrationBackupPath(filePosix, stateDirPosix)) return true;
			if (isManagedBrowserSingletonPath(filePosix, stateDirPosix)) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "sandbox", "skills-workspaces"))) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "cache", "control-ui-assets"))) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "tmp", "plugin-captures"))) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "sessions")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isAgentSessionTranscriptPath(filePosix, stateDirPosix) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "cron", "runs")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "logs")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			for (const queueDir of ["delivery-queue", "session-delivery-queue"]) if (isUnder(filePosix, path.posix.join(stateDirPosix, queueDir)) && hasExtension(filePosix, [
				".json",
				".delivered",
				".tmp"
			])) return true;
			if (isUnder(filePosix, stateDirPosix) && isTransientBackupPath(filePosix)) return true;
		}
	}
	return false;
}
//#endregion
//#region src/commands/backup-resource-inventory.ts
/** Frozen backup ownership and resource policy shared by archive traversal and SQLite discovery. */
const MANAGED_STATE_ROOTS = [
	"dev",
	"git",
	"npm",
	"npm-runtime",
	"tmp",
	"tools"
];
async function listDefaultAgentTemporaryRoots(stateDir, agentRoots) {
	const customAgentRoots = agentRoots.filter(({ agentId, sourcePath }) => sourcePath !== path.join(stateDir, "agents", agentId, "agent"));
	const isCustomAgentPath = (candidate) => customAgentRoots.some(({ sourcePath }) => isPathWithin(candidate, sourcePath));
	const temporaryRoots = [];
	let agentDirectories;
	try {
		agentDirectories = await fs$1.readdir(path.join(stateDir, "agents"), { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return temporaryRoots;
		throw error;
	}
	for (const directory of agentDirectories) {
		const agentRoot = path.join(stateDir, "agents", directory.name, "agent");
		if (!directory.isDirectory() || isCustomAgentPath(agentRoot)) continue;
		const scan = await walkDirectory(agentRoot, {
			symlinks: "skip",
			include: (entry) => entry.kind === "directory" && (entry.name === "tmp" || entry.name === ".tmp") && !isCustomAgentPath(entry.path),
			descend: (entry) => entry.name !== "tmp" && entry.name !== ".tmp" && !isCustomAgentPath(entry.path)
		});
		const failure = scan.failedDirs.find(({ error }) => !hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR"));
		if (failure) throw failure.error;
		temporaryRoots.push(...scan.entries.map((entry) => entry.path));
	}
	return temporaryRoots;
}
/** Prepare declared backup resources without opening live SQLite databases. */
async function createBackupResourcePlan(params) {
	const stateDir = path.resolve(params.stateDir);
	const pluginResourceRoots = [];
	const configPaths = new Set(params.configPaths.map((configPath) => path.resolve(configPath)));
	const agentRoots = Object.freeze(params.agentRoots.map((root) => Object.freeze({
		agentId: root.agentId,
		sourcePath: path.resolve(root.sourcePath),
		databasePath: path.resolve(root.databasePath)
	})));
	const protectedPathSet = /* @__PURE__ */ new Set([...configPaths, resolveOpenClawStateSqlitePath({
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	})]);
	const regenerableRoots = [];
	const exclude = (kind, sourcePath) => {
		regenerableRoots.push({
			kind,
			sourcePath: path.resolve(sourcePath)
		});
	};
	if (!params.onlyConfig) {
		for (const oauthDir of params.oauthDirs) protectedPathSet.add(path.resolve(oauthDir));
		for (const workspaceDir of params.workspaceDirs) protectedPathSet.add(path.resolve(workspaceDir));
		for (const root of agentRoots) {
			protectedPathSet.add(root.sourcePath);
			protectedPathSet.add(root.databasePath);
		}
		for (const root of MANAGED_STATE_ROOTS) exclude("managed state", path.join(stateDir, root));
		for (const temporaryRoot of await listDefaultAgentTemporaryRoots(stateDir, agentRoots)) exclude("agent temporary files", temporaryRoot);
		exclude("plugin skills", path.join(stateDir, "plugin-skills"));
		for (const resource of params.pluginResources) {
			const anchors = resource.scope === "state" ? [{ sourcePath: stateDir }] : agentRoots;
			for (const anchor of anchors) {
				const sourcePath = path.resolve(anchor.sourcePath, ...resource.relativePath.split("/"));
				if (!isPathWithin(sourcePath, anchor.sourcePath)) throw new Error(`Plugin ${resource.pluginId} backup resource escapes its ${resource.scope} root: ${resource.relativePath}`);
				if (resource.disposition === "include") {
					protectedPathSet.add(sourcePath);
					pluginResourceRoots.push(sourcePath);
				} else exclude("plugin resource", sourcePath);
			}
		}
		for (const pluginRoot of params.pluginRoots) exclude("plugin dependencies", path.join(pluginRoot, "node_modules"));
	}
	const seenRegenerableRoots = /* @__PURE__ */ new Set();
	const uniqueRegenerableRoots = Object.freeze(regenerableRoots.toSorted((left, right) => left.sourcePath.localeCompare(right.sourcePath) || left.kind.localeCompare(right.kind)).filter((resource) => {
		const key = `${resource.kind}\0${resource.sourcePath}`;
		if (seenRegenerableRoots.has(key)) return false;
		seenRegenerableRoots.add(key);
		return true;
	}));
	const resources = {
		stateDir,
		agentRoots,
		regenerableRoots: uniqueRegenerableRoots,
		protectedPaths: Object.freeze([...protectedPathSet].toSorted()),
		excludedPaths: Object.freeze([...uniqueRegenerableRoots.map((resource) => resource.sourcePath), ...new Set(params.excludedWorkspaceDirs.map((dir) => path.resolve(dir)))].toSorted((left, right) => right.length - left.length || left.localeCompare(right))),
		pluginResourceRoots: Object.freeze(pluginResourceRoots)
	};
	return Object.freeze({
		...resources,
		...createBackupPathPolicy(resources)
	});
}
function createBackupPathPolicy({ stateDir, agentRoots, regenerableRoots, protectedPaths, excludedPaths }) {
	const isIncluded = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		if (isUpdateCapturePath(candidate, stateDir)) return false;
		const exclusion = excludedPaths.find((excludedPath) => isPathWithin(candidate, excludedPath));
		if (!exclusion) return true;
		return protectedPaths.some((protectedPath) => isPathWithin(candidate, protectedPath) && isPathWithin(protectedPath, exclusion));
	};
	const isTraversable = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		if (isUpdateCapturePath(candidate, stateDir)) return false;
		return isIncluded(candidate) || protectedPaths.some((protectedPath) => isPathWithin(protectedPath, candidate));
	};
	const isPackageContent = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		if (protectedPaths.some((protectedPath) => isPathWithin(candidate, protectedPath) || isPathWithin(protectedPath, candidate))) return false;
		if (!isPathWithin(candidate, stateDir)) return false;
		const segments = path.relative(stateDir, candidate).split(path.sep);
		if (segments[0] === "agents" && segments[1] && (segments.length === 2 || segments[2] === "agent" && (segments.length === 3 || segments.length === 4 && /^openclaw-agent\.sqlite(?:-wal|-shm|-journal)?$/u.test(segments[3] ?? "")))) return false;
		return segments.includes("node_modules");
	};
	const volatilePlan = { stateDirs: [stateDir] };
	const isVolatile = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		const ownedPath = protectedPaths.some((protectedPath) => isPathWithin(candidate, protectedPath));
		return candidate !== stateDir && !protectedPaths.some((protectedPath) => isPathWithin(protectedPath, candidate)) && isTransientBackupPath(candidate) || !ownedPath && isVolatileBackupPath(candidate, volatilePlan);
	};
	return {
		stateDir,
		agentRoots,
		regenerableRoots,
		isIncluded,
		isTraversable,
		isPackageContent,
		isVolatile
	};
}
/** Bind archive ownership to the registrations captured in its online root snapshot. */
function sealBackupResourceInventory(resources, coreDatabases) {
	const owners = [];
	const ownersByPath = /* @__PURE__ */ new Map();
	const ownersByRealpath = /* @__PURE__ */ new Map();
	for (const database of coreDatabases) {
		const sourcePath = path.resolve(database.sourcePath);
		const realPath = database.identity ? realpathSync(database.sourcePath) : sourcePath;
		const previous = ownersByRealpath.get(realPath) ?? owners.find((owner) => owner.identity && database.identity && sameFileIdentity(owner.identity, database.identity));
		if (previous && (previous.role !== database.role || previous.role === "agent" && database.role === "agent" && previous.agentId !== database.agentId)) throw new Error(`SQLite path aliases multiple core database owners: ${sourcePath}`);
		const owner = previous ?? Object.freeze({
			...database,
			sourcePath
		});
		const archiveOwner = ownersByPath.get(sourcePath);
		if (archiveOwner && archiveOwner !== owner) throw new Error(`SQLite path aliases multiple core database owners: ${sourcePath}`);
		if (!previous) owners.push(owner);
		ownersByPath.set(sourcePath, owner);
		ownersByRealpath.set(realPath, owner);
	}
	const protectedPaths = Object.freeze([.../* @__PURE__ */ new Set([...resources.protectedPaths, ...ownersByPath.keys()])].toSorted());
	const resolveSqliteSource = (sourcePath, identity) => {
		const candidate = path.resolve(sourcePath);
		const exact = ownersByPath.get(candidate);
		let current = identity;
		let unresolvableLink = false;
		if (!exact && !current) try {
			current = statSync(candidate, { throwIfNoEntry: false });
		} catch (error) {
			if (!hasErrnoCode(error, "ELOOP")) throw error;
			unresolvableLink = true;
		}
		return exact ?? (current ? owners.find((database) => database.identity && sameFileIdentity(database.identity, current)) : void 0) ?? (resources.pluginResourceRoots.some((root) => isPathWithin(candidate, root)) ? { role: "plugin" } : unresolvableLink ? { role: "unresolvable-link" } : void 0);
	};
	return Object.freeze({
		...createBackupPathPolicy({
			...resources,
			protectedPaths
		}),
		coreDatabases: Object.freeze(owners),
		coreDatabaseSourcePaths: Object.freeze([...ownersByPath].filter(([, owner]) => owner.identity).map(([sourcePath]) => sourcePath)),
		resolveSqliteSource
	});
}
/** Report only canonical sources present in the completed snapshot generation. */
function describeCapturedBackupSqliteSnapshots(inventory, capturedSourcePaths) {
	const capturedPaths = new Set(capturedSourcePaths);
	return Object.freeze(inventory.coreDatabases.flatMap((owner) => owner.role !== "quarantine" && owner.identity && capturedPaths.has(owner.sourcePath) ? [Object.freeze({
		sourcePath: owner.sourcePath,
		dev: owner.identity.dev,
		ino: owner.identity.ino,
		...owner.role === "agent" ? {
			role: "agent",
			agentId: owner.agentId
		} : { role: "global" }
	})] : []));
}
//#endregion
//#region src/infra/backup-config-capture.ts
function captureError(sourcePath, detail, cause) {
	return new Error(`Cannot capture required config file ${sourcePath}: ${detail}. Fix the include graph or stop concurrent edits, then retry backup.`, { cause });
}
async function resolveBackupConfigCapture({ snapshot, writeOptions }) {
	if ((containsConfigIncludeDirective(snapshot.parsed) || Boolean(snapshot.includedPaths?.length)) && snapshot.includeProvenance === void 0 || snapshot.exists && snapshot.raw === null) throw captureError(snapshot.path, "include graph could not be resolved");
	const hashes = writeOptions.includeFileHashesForWrite ?? {};
	const targets = writeOptions.includeFileTargetsForWrite ?? {};
	const files = new Map(snapshot.exists ? [[snapshot.path, hashConfigIncludeRaw(snapshot.raw)], ...Object.entries(hashes)] : []);
	const capture = [];
	let assertRootAlias;
	const canonicalConfigDir = files.size ? await fs$1.realpath(path.dirname(snapshot.path)).catch((error) => {
		throw captureError(snapshot.path, "config directory became unavailable", error);
	}) : path.dirname(snapshot.path);
	for (const [sourcePath, hash] of files) try {
		const canonicalPath = await fs$1.realpath(sourcePath);
		const linkStat = await fs$1.lstat(sourcePath);
		const rootAlias = sourcePath === snapshot.path && linkStat.isSymbolicLink();
		const stat = rootAlias ? await fs$1.stat(sourcePath) : linkStat;
		if (rootAlias) assertRootAlias = async () => {
			const current = await fs$1.lstat(sourcePath);
			if (current.dev !== linkStat.dev || current.ino !== linkStat.ino || current.ctimeMs !== linkStat.ctimeMs || await fs$1.realpath(sourcePath) !== canonicalPath) throw captureError(sourcePath, "config alias changed during capture");
		};
		const projectedPath = path.resolve(canonicalConfigDir, path.relative(path.dirname(snapshot.path), sourcePath));
		if (!stat.isFile() || !rootAlias && canonicalPath !== sourcePath && canonicalPath !== projectedPath) throw captureError(sourcePath, "include alias cannot be represented in this archive");
		if (sourcePath !== snapshot.path && targets[sourcePath] !== canonicalPath) throw captureError(sourcePath, "include target changed or is unavailable");
		capture.push({
			sourcePath: rootAlias ? canonicalPath : sourcePath,
			canonicalPath,
			hash,
			dev: stat.dev,
			ino: stat.ino
		});
	} catch (error) {
		throw captureError(sourcePath, "file identity could not be pinned", error);
	}
	for (const includePath of snapshot.includedPaths ?? []) if (!capture.some((file) => file.sourcePath === includePath || file.canonicalPath === includePath)) throw captureError(includePath, "include inventory is incomplete");
	return {
		files: capture,
		assertRootAlias,
		revalidate: async () => {
			await assertRootAlias?.();
			const current = await withOpenClawStateDatabaseReadSnapshot(() => createConfigIO({
				configPath: snapshot.path,
				observe: false
			}).readConfigFileSnapshotForWrite());
			if (current.snapshot.exists !== snapshot.exists || current.snapshot.raw !== snapshot.raw || current.snapshot.valid !== snapshot.valid || !isDeepStrictEqual(current.snapshot.sourceConfig, snapshot.sourceConfig) || !isDeepStrictEqual(current.snapshot.includedPaths, snapshot.includedPaths) || !isDeepStrictEqual(current.snapshot.includeProvenance, snapshot.includeProvenance) || !isDeepStrictEqual(current.writeOptions.includeFileHashesForWrite ?? {}, hashes) || !isDeepStrictEqual(current.writeOptions.includeFileTargetsForWrite ?? {}, targets)) throw captureError(snapshot.path, "include graph changed during capture");
		}
	};
}
async function readCapturedConfig(file) {
	try {
		const opened = await openLocalFileSafely({ filePath: file.sourcePath });
		const { handle, stat } = opened;
		try {
			if (stat.dev !== file.dev || stat.ino !== file.ino || opened.realPath !== file.canonicalPath) throw new Error("file identity changed");
			const bytes = await handle.readFile();
			const raw = bytes.toString("utf8");
			if (!bytes.equals(Buffer.from(raw)) || hashConfigIncludeRaw(raw) !== file.hash) throw new Error("file contents changed");
			const current = await fs$1.lstat(file.sourcePath);
			if (!current.isFile() || current.dev !== file.dev || current.ino !== file.ino || await fs$1.realpath(file.sourcePath) !== file.canonicalPath) throw new Error("file identity changed during read");
			return bytes;
		} finally {
			await handle.close();
		}
	} catch (error) {
		throw captureError(file.sourcePath, "source changed or became unreadable", error);
	}
}
async function stageBackupConfigCapture(capture, tempDir) {
	const remaps = /* @__PURE__ */ new Map();
	for (const [index, file] of (capture?.files ?? []).entries()) {
		const bytes = await readCapturedConfig(file);
		const stagedPath = path.join(tempDir, `config-${index}`);
		await fs$1.writeFile(stagedPath, bytes, {
			flag: "wx",
			mode: 384
		});
		remaps.set(stagedPath, file.canonicalPath);
	}
	await capture?.revalidate();
	for (const file of capture?.files ?? []) await readCapturedConfig(file);
	return remaps;
}
//#endregion
//#region src/plugins/manifest-backup-resources.ts
function listPluginInstallRoots(env) {
	const extensionsDir = resolveDefaultPluginExtensionsDir(env);
	try {
		return fs.readdirSync(extensionsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(extensionsDir, entry.name));
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return [];
		throw error;
	}
}
/** Resolves effective plugin-owned backup policy without importing or activating plugin runtime. */
function resolveActivatedPluginBackupInventory(params) {
	const normalizedConfig = normalizePluginsConfig(params.config.plugins);
	const workspaceScopes = params.workspaceDirs?.length ? [...new Set(params.workspaceDirs)] : [void 0];
	const backupRoots = [params.stateDir, ...params.workspaceDirs ?? []].filter((root) => Boolean(root)).map((root) => path.resolve(root));
	const pluginRoots = /* @__PURE__ */ new Set();
	const addPluginRoot = (pluginRoot) => {
		const resolvedRoot = path.resolve(pluginRoot);
		if (backupRoots.some((backupRoot) => resolvedRoot === backupRoot || isPathInside(backupRoot, resolvedRoot))) pluginRoots.add(resolvedRoot);
	};
	for (const pluginRoot of listPluginInstallRoots(params.env)) addPluginRoot(pluginRoot);
	const resources = /* @__PURE__ */ new Map();
	for (const workspaceDir of workspaceScopes) {
		const snapshot = resolvePluginMetadataSnapshot({
			config: params.config,
			env: params.env,
			...params.stateDir ? { stateDir: params.stateDir } : {},
			...workspaceDir ? { workspaceDir } : {}
		});
		for (const candidate of snapshot.discovery?.candidates ?? []) addPluginRoot(candidate.rootDir);
		const invalidDeclaration = normalizedConfig.enabled ? snapshot.diagnostics.find((diagnostic) => {
			if (diagnostic.code !== "backup-resource-declaration-invalid") return false;
			if (!diagnostic.pluginId) return true;
			const indexedOwner = snapshot.index.plugins.find((owner) => owner.pluginId === diagnostic.pluginId);
			const discoveredOwner = snapshot.discovery?.candidates.find((owner) => (owner.diagnosticIdHint ?? owner.idHint) === diagnostic.pluginId);
			const owner = indexedOwner ?? discoveredOwner;
			if (!owner) return true;
			const plugin = {
				id: diagnostic.pluginId,
				origin: owner.origin,
				enabledByDefault: indexedOwner?.enabledByDefault,
				enabledByDefaultOnPlatforms: indexedOwner?.enabledByDefaultOnPlatforms?.slice()
			};
			return isActivatedManifestOwner({
				plugin,
				normalizedConfig,
				rootConfig: params.config
			}) && (!indexedOwner || isManifestPluginAvailableForControlPlane({
				snapshot,
				plugin,
				config: params.config
			}));
		}) : void 0;
		if (invalidDeclaration) throw new Error(invalidDeclaration.message);
		for (const plugin of snapshot.plugins) {
			if (!normalizedConfig.enabled || !plugin.backupResources?.length || !isActivatedManifestOwner({
				plugin,
				normalizedConfig,
				rootConfig: params.config
			}) || !isManifestPluginAvailableForControlPlane({
				snapshot,
				plugin,
				config: params.config
			})) continue;
			for (const resource of plugin.backupResources) {
				const key = `${plugin.id}\0${resource.scope}\0${resource.relativePath}\0${resource.disposition}`;
				if (!resources.has(key)) resources.set(key, {
					pluginId: plugin.id,
					...resource
				});
			}
		}
	}
	return {
		pluginRoots: [...pluginRoots].toSorted(),
		resources: [...resources.entries()].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, resource]) => resource)
	};
}
//#endregion
//#region src/commands/backup-shared.ts
const BACKUP_MAX_DECOMPRESSION_RATIO = 1100;
async function recordBackupOutcomeBestEffort(runtime, params) {
	try {
		assertNotUpdateCapturePath(resolveOpenClawStateSqlitePath(), resolveStateDir());
		await recordBackupRunOutcome(params);
	} catch (error) {
		const label = params.kind === "git" ? "Git backup" : "backup";
		runtime.error(`Warning: the ${label} outcome could not be recorded: ${formatErrorMessage(error)}`);
	}
}
function resolveRequiredBackupPath(value, label) {
	const trimmed = value?.trim();
	if (!trimmed) throw new Error(`Missing required ${label} value.`);
	return resolveUserPath(trimmed);
}
function backupAssetPriority(kind) {
	switch (kind) {
		case "state": return 0;
		case "config": return 1;
		case "credentials": return 2;
		case "workspace": return 3;
		case "agent": return 4;
		case "managed skill": return 5;
	}
	throw new Error("Unsupported backup asset kind");
}
/** Format a filesystem-safe local timestamp with explicit UTC offset for backup names. */
function formatBackupArchiveTimestamp(nowMs = Date.now(), offsetMinutes = -new Date(nowMs).getTimezoneOffset()) {
	const shifted = nowMs + offsetMinutes * 6e4;
	const local = new Date(shifted);
	const sign = offsetMinutes >= 0 ? "+" : "-";
	const absOffsetMinutes = Math.abs(offsetMinutes);
	const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, "0");
	const offsetMins = String(absOffsetMinutes % 60).padStart(2, "0");
	return `${String(local.getUTCFullYear()).padStart(4, "0")}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}T${String(local.getUTCHours()).padStart(2, "0")}-${String(local.getUTCMinutes()).padStart(2, "0")}-${String(local.getUTCSeconds()).padStart(2, "0")}.${String(local.getUTCMilliseconds()).padStart(3, "0")}${sign}${offsetHours}-${offsetMins}`;
}
/** Build the root directory name stored inside a backup tarball. */
function buildBackupArchiveRoot(nowMs = Date.now()) {
	return `${formatBackupArchiveTimestamp(nowMs)}-openclaw-backup`;
}
/** Build the default `.tar.gz` filename for a backup archive. */
function buildBackupArchiveBasename(nowMs = Date.now()) {
	return `${buildBackupArchiveRoot(nowMs)}.tar.gz`;
}
/** Encode an absolute or relative source path into a traversal-safe archive payload path. */
function encodeAbsolutePathForBackupArchive(sourcePath) {
	const normalized = sourcePath.replaceAll("\\", "/");
	const windowsMatch = normalized.match(/^([A-Za-z]):\/(.*)$/);
	if (windowsMatch) {
		const drive = windowsMatch[1]?.toUpperCase() ?? "UNKNOWN";
		const rest = windowsMatch[2] ?? "";
		return path.posix.join("windows", drive, rest);
	}
	if (normalized.startsWith("/")) return path.posix.join("posix", normalized.slice(1));
	return path.posix.join("relative", normalized);
}
/** Build the archive-relative payload path for one source path. */
function buildBackupArchivePath(archiveRoot, sourcePath) {
	return path.posix.join(archiveRoot, "payload", encodeAbsolutePathForBackupArchive(sourcePath));
}
/** Resolve a backup plan from explicit paths, deduplicating assets already covered by parents. */
async function resolveBackupPlanFromPaths(params) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = params.stateDir;
	const configPath = params.configPath;
	for (const sourcePath of [configPath, ...(params.configCapture?.files ?? []).map((file) => file.canonicalPath)]) assertNotUpdateCapturePath(sourcePath, stateDir);
	const oauthDir = params.oauthDir;
	const archiveRoot = buildBackupArchiveRoot(params.nowMs);
	const requestedWorkspaceDirs = params.workspaceDirs ?? [];
	const workspaceDirs = includeWorkspace ? requestedWorkspaceDirs : [];
	const excludedWorkspaceDirs = includeWorkspace ? [] : requestedWorkspaceDirs;
	const agentRoots = onlyConfig ? [] : params.agentRoots ?? [];
	const canonicalStateDir = await canonicalizePathForContainment(stateDir);
	const configSourcePath = await canonicalizePathForContainment(configPath);
	const oauthSourcePath = await canonicalizePathForContainment(oauthDir);
	const resources = await createBackupResourcePlan({
		stateDir: canonicalStateDir,
		configPaths: [
			configPath,
			configSourcePath,
			...(params.configCapture?.files ?? []).map((file) => file.canonicalPath)
		],
		oauthDirs: [oauthDir, oauthSourcePath],
		workspaceDirs: await Promise.all(workspaceDirs.map((workspaceDir) => canonicalizePathForContainment(workspaceDir))),
		excludedWorkspaceDirs: (await Promise.all(excludedWorkspaceDirs.map(async (workspaceDir) => [path.resolve(workspaceDir), await canonicalizePathForContainment(workspaceDir)].filter((dir) => dir !== canonicalStateDir && !isPathWithin(canonicalStateDir, dir))))).flat(),
		agentRoots,
		pluginResources: params.pluginInventory?.resources ?? [],
		pluginRoots: params.pluginInventory?.pluginRoots ?? [],
		onlyConfig
	});
	if (onlyConfig) {
		const resolvedConfigPath = path.resolve(configPath);
		if (!await pathExists(resolvedConfigPath)) return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
			resources,
			included: [],
			skipped: [{
				kind: "config",
				sourcePath: resolvedConfigPath,
				displayPath: shortenHomePath(resolvedConfigPath),
				reason: "missing"
			}]
		};
		const canonicalConfigPath = await canonicalizeExistingPath(resolvedConfigPath);
		return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
			resources,
			included: [{
				kind: "config",
				sourcePath: canonicalConfigPath,
				displayPath: shortenHomePath(canonicalConfigPath),
				archivePath: buildBackupArchivePath(archiveRoot, canonicalConfigPath)
			}],
			skipped: []
		};
	}
	const isOwnedPathCoveredBy = (sourcePath, sourceRoot) => {
		let ancestor = sourcePath;
		while (isPathWithin(ancestor, sourceRoot)) {
			if (resources.isVolatile(ancestor)) return false;
			if (ancestor === sourceRoot) return true;
			ancestor = path.dirname(ancestor);
		}
		return false;
	};
	const rawCandidates = [
		{
			kind: "state",
			sourcePath: path.resolve(stateDir)
		},
		...isOwnedPathCoveredBy(configSourcePath, canonicalStateDir) ? [] : [{
			kind: "config",
			sourcePath: path.resolve(configPath)
		}],
		...isOwnedPathCoveredBy(oauthSourcePath, canonicalStateDir) ? [] : [{
			kind: "credentials",
			sourcePath: path.resolve(oauthDir)
		}],
		...(params.configCapture?.files ?? []).filter((file) => file.canonicalPath !== configSourcePath).map((file) => ({
			kind: "config",
			sourcePath: file.canonicalPath
		})),
		...workspaceDirs.map((workspaceDir) => ({
			kind: "workspace",
			sourcePath: path.resolve(workspaceDir)
		})),
		...agentRoots.map((root) => ({
			kind: "agent",
			sourcePath: root.sourcePath
		}))
	];
	const candidates = await Promise.all(rawCandidates.map(async (candidate) => {
		const exists = await pathExists(candidate.sourcePath);
		return Object.assign({}, candidate, {
			exists,
			canonicalPath: exists ? await canonicalizeExistingPath(candidate.sourcePath) : path.resolve(candidate.sourcePath)
		});
	}));
	for (const configuredPath of [{
		kind: "config",
		sourcePath: path.resolve(configPath)
	}, {
		kind: "credentials",
		sourcePath: path.resolve(oauthDir)
	}]) if (isSymlinkPath(configuredPath.sourcePath)) candidates.push({
		...configuredPath,
		canonicalPath: configuredPath.sourcePath,
		exists: true
	});
	for (const sourcePath of resolveManagedSkillSymlinkTargetCandidates({
		stateDir,
		ownerRoots: candidates.map((candidate) => candidate.canonicalPath),
		limits: params.skillDiscoveryLimits ?? resolveSkillDiscoveryLimits()
	})) candidates.push({
		kind: "managed skill",
		sourcePath,
		canonicalPath: sourcePath,
		exists: true
	});
	const uniqueCandidates = [];
	const skipped = [];
	const seenCanonicalPaths = /* @__PURE__ */ new Set();
	for (const candidate of [...candidates].toSorted(compareCandidates)) {
		const privateSelection = isUpdateCapturePath(candidate.sourcePath, stateDir);
		const privateTarget = candidate.canonicalPath !== candidate.sourcePath && isUpdateCapturePath(candidate.canonicalPath, stateDir);
		if (privateSelection || privateTarget) {
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.sourcePath,
				displayPath: shortenHomePath(candidate.sourcePath),
				reason: "private"
			});
			continue;
		}
		if (seenCanonicalPaths.has(candidate.canonicalPath)) continue;
		seenCanonicalPaths.add(candidate.canonicalPath);
		uniqueCandidates.push(candidate);
	}
	const included = [];
	for (const candidate of uniqueCandidates) {
		if (!candidate.exists) {
			if (candidate.kind === "agent" && agentRoots.some((root) => root.sourcePath === candidate.canonicalPath && root.sourcePath === path.join(canonicalStateDir, "agents", root.agentId, "agent"))) continue;
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.sourcePath,
				displayPath: shortenHomePath(candidate.sourcePath),
				reason: "missing"
			});
			continue;
		}
		const coveredBy = included.find((asset) => candidate.kind === "config" || candidate.kind === "credentials" ? isOwnedPathCoveredBy(candidate.canonicalPath, asset.sourcePath) : isPathWithin(candidate.canonicalPath, asset.sourcePath));
		if (coveredBy) {
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.canonicalPath,
				displayPath: shortenHomePath(candidate.canonicalPath),
				reason: "covered",
				coveredBy: coveredBy.displayPath
			});
			continue;
		}
		included.push({
			kind: candidate.kind,
			sourcePath: candidate.canonicalPath,
			displayPath: shortenHomePath(candidate.canonicalPath),
			archivePath: buildBackupArchivePath(archiveRoot, candidate.canonicalPath)
		});
	}
	const regenerableRoots = resources.regenerableRoots.filter((resource) => !resources.isIncluded(resource.sourcePath) && included.some((asset) => isPathWithin(resource.sourcePath, asset.sourcePath)));
	const regenerableResourceExists = await Promise.all(regenerableRoots.map((resource) => pathExists(resource.sourcePath)));
	for (const [index, resource] of regenerableRoots.entries()) {
		if (!regenerableResourceExists[index]) continue;
		skipped.push({
			kind: resource.kind,
			sourcePath: resource.sourcePath,
			displayPath: shortenHomePath(resource.sourcePath),
			reason: "regenerable"
		});
	}
	return {
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: workspaceDirs.map((entry) => path.resolve(entry)),
		configCapture: params.configCapture,
		resources,
		included,
		skipped
	};
}
function compareCandidates(left, right) {
	const depthDelta = left.canonicalPath.length - right.canonicalPath.length;
	if (depthDelta !== 0) return depthDelta;
	const priorityDelta = backupAssetPriority(left.kind) - backupAssetPriority(right.kind);
	if (priorityDelta !== 0) return priorityDelta;
	return left.canonicalPath.localeCompare(right.canonicalPath);
}
function resolveManagedSkillSymlinkTargetCandidates(params) {
	const managedSkillsDir = path.join(params.stateDir, "skills");
	const targets = /* @__PURE__ */ new Set();
	const discovered = discoverSkillCandidates({
		dir: managedSkillsDir,
		source: "openclaw-managed",
		limits: params.limits,
		allowedSymlinkTargetRealPaths: []
	});
	for (const candidate of discovered.candidates) {
		if (isUpdateCapturePath(candidate.skillDir, params.stateDir)) continue;
		if (!loadSingleSkillDirectory({
			skillDir: candidate.skillDir,
			source: "openclaw-managed",
			rootRealPath: candidate.skillDirRealPath,
			maxBytes: params.limits.maxSkillFileBytes
		})) continue;
		const relativeSkillDir = path.relative(managedSkillsDir, candidate.skillDir);
		if (path.isAbsolute(relativeSkillDir) || relativeSkillDir === ".." || relativeSkillDir.startsWith(`..${path.sep}`)) continue;
		const components = [managedSkillsDir];
		for (const segment of relativeSkillDir.split(path.sep).filter(Boolean)) components.push(path.join(components.at(-1) ?? managedSkillsDir, segment));
		for (const component of components) {
			if (!isSymlinkPath(component)) continue;
			const targetPath = tryRealpath(component);
			if (!targetPath || params.ownerRoots.some((ownerRoot) => isPathWithin(targetPath, ownerRoot) || isPathWithin(ownerRoot, targetPath))) continue;
			targets.add(targetPath);
		}
	}
	return [...targets];
}
async function canonicalizeExistingPath(targetPath) {
	try {
		return await fs$1.realpath(targetPath);
	} catch {
		return path.resolve(targetPath);
	}
}
/** Resolve symlinks in the existing prefix while retaining a not-yet-created suffix. */
async function canonicalizePathForContainment(targetPath) {
	const resolved = path.resolve(targetPath);
	const suffix = [];
	let probe = resolved;
	while (true) try {
		const realProbe = await fs$1.realpath(probe);
		return suffix.length === 0 ? realProbe : path.join(realProbe, ...suffix.toReversed());
	} catch {
		const parent = path.dirname(probe);
		if (parent === probe) return resolved;
		suffix.push(path.basename(probe));
		probe = parent;
	}
}
/** Resolve one configured agent's canonical backup root and owner database path. */
async function resolveBackupAgentRoot(config, agentId) {
	const selectedPath = resolveAgentDir(config, agentId);
	assertNotUpdateCapturePath(selectedPath, resolveStateDir());
	const sourcePath = await canonicalizePathForContainment(selectedPath);
	return {
		agentId,
		sourcePath,
		databasePath: path.join(sourcePath, "openclaw-agent.sqlite")
	};
}
/** Resolve configured agent storage roots and their canonical database paths for backup ownership. */
async function resolveBackupAgentRoots(config) {
	return await Promise.all(listAgentIds(config).map((agentId) => resolveBackupAgentRoot(config, agentId)));
}
/** Resolve the backup plan from the current OpenClaw state/config/workspace paths on disk. */
async function resolveBackupPlanFromDisk(params = {}) {
	if (params.onlyConfig) return await resolveBackupPlanFromState(params);
	assertNotUpdateCapturePath(resolveOpenClawStateSqlitePath(), resolveStateDir());
	return await withOpenClawStateDatabaseReadSnapshot(() => resolveBackupPlanFromState(params));
}
async function resolveBackupPlanFromState(params) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = resolveStateDir();
	const configPath = resolveConfigPath();
	const oauthDir = resolveOAuthDir();
	if (onlyConfig) return await resolveBackupPlanFromPaths({
		stateDir,
		configPath,
		oauthDir,
		includeWorkspace: false,
		onlyConfig: true,
		nowMs: params.nowMs
	});
	const configRead = await createConfigIO({ observe: false }).readConfigFileSnapshotForWrite();
	const configSnapshot = configRead.snapshot;
	const discoverySnapshot = resolveStartupConfigSnapshot(configSnapshot) ?? configSnapshot;
	const configCapture = await resolveBackupConfigCapture(configRead);
	if (discoverySnapshot.exists && !discoverySnapshot.valid) throw new Error(`Backup discovery failed at ${shortenHomePath(discoverySnapshot.path)}: ${discoverySnapshot.issues.map((issue) => issue.message).join("; ")}. Agent and plugin ownership could not be resolved. Resolve the reported error and retry backup, or use --only-config to save the config alone.`);
	const discoveredWorkspaceDirs = buildCleanupPlan({
		cfg: discoverySnapshot.config,
		stateDir,
		configPath,
		oauthDir
	}).workspaceDirs;
	const agentRoots = await resolveBackupAgentRoots(discoverySnapshot.config);
	const pluginInventory = resolveActivatedPluginBackupInventory({
		config: discoverySnapshot.config,
		env: process.env,
		stateDir,
		workspaceDirs: discoveredWorkspaceDirs
	});
	if (!includeWorkspace && discoverySnapshot.valid) {
		const sharedWorkspaceBase = discoverySnapshot.config.agents?.defaults?.workspace?.trim();
		if (sharedWorkspaceBase) discoveredWorkspaceDirs.push(resolveUserPath(sharedWorkspaceBase));
	}
	return await resolveBackupPlanFromPaths({
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: discoveredWorkspaceDirs,
		agentRoots,
		pluginInventory,
		configCapture,
		includeWorkspace,
		onlyConfig,
		skillDiscoveryLimits: resolveSkillDiscoveryLimits(discoverySnapshot.config),
		nowMs: params.nowMs
	});
}
//#endregion
export { canonicalizePathForContainment as a, resolveBackupAgentRoots as c, stageBackupConfigCapture as d, describeCapturedBackupSqliteSnapshots as f, isLegacyAuditMigrationBackupPath as g, hasLegacyAuditBackupSources as h, buildBackupArchiveRoot as i, resolveBackupPlanFromDisk as l, isTransientSqliteBackupPath as m, buildBackupArchiveBasename as n, recordBackupOutcomeBestEffort as o, sealBackupResourceInventory as p, buildBackupArchivePath as r, resolveBackupAgentRoot as s, BACKUP_MAX_DECOMPRESSION_RATIO as t, resolveRequiredBackupPath as u };
