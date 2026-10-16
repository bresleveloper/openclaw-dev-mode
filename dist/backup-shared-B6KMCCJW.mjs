import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { O as walkDirectory } from "./fs-safe-BUXBSN-4.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { l as pathExists$1, p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as isPathInside$1, t as hasNodeErrorCode$1 } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { T as resolveOAuthDir, m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { m as withOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-R7__5hE9.mjs";
import { t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import "./config-CzeZu5J_.mjs";
import { r as resolveBackupConfigCapture } from "./backup-config-capture-BOahK9f8.mjs";
import { r as isVolatileBackupPath, t as isTransientBackupPath } from "./backup-volatile-filter-I3J38C_Z.mjs";
import { n as isUpdateCapturePath, t as assertNotUpdateCapturePath } from "./update-capture-paths-BuDS3zdN.mjs";
import { c as loadSingleSkillDirectory, s as tryRealpath } from "./skill-paths-BxFt63--.mjs";
import { a as resolveSkillDiscoveryLimits, i as isSymlinkPath, r as discoverSkillCandidates } from "./skill-root-discovery-Br--9LSl.mjs";
import { t as buildCleanupPlan } from "./cleanup-utils-C6bTLaSl.mjs";
import { i as recordBackupRunOutcome } from "./backup-run-records-BXl2ZzeJ.mjs";
import { i as resolveLegacyConfigSnapshotForBackup } from "./automatic-config-repair-DyG5q8Ux.mjs";
import fs, { realpathSync, statSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { isNotFoundPathError, isPathInside } from "@openclaw/fs-safe/path";
import { isWindowsDrivePath } from "@openclaw/fs-safe/archive";
//#region src/infra/backup-archive-path-policy.ts
/**
* Collapse drive and UNC spellings of `\\?\`, `\\.\`, `//?/`, and `//./` to the
* archive name those paths already use. Volume GUIDs and POSIX absolutes stay unchanged.
*/
function normalizeWindowsNamespaceAlias(sourcePath) {
	const device = sourcePath.replaceAll("\\", "/").match(/^\/\/[?.]\/(.*)$/i);
	if (!device) return sourcePath;
	const rest = device[1] ?? "";
	const unc = /^UNC\/(.*)$/i.exec(rest);
	const portable = unc ? `//${unc[1] ?? ""}` : /^[A-Za-z]:\//.test(rest) ? rest : void 0;
	if (!portable) return sourcePath;
	return sourcePath.includes("\\") ? portable.replaceAll("/", "\\") : portable;
}
function assertPortableRelativePathSyntax(value, label, reportedValue = value) {
	if (value.startsWith("/") || isWindowsDrivePath(value)) throw new Error(`${label} must be relative: ${reportedValue}`);
	if (value.includes("\\")) throw new Error(`${label} must use forward slashes: ${reportedValue}`);
}
function stripTrailingSlashes(value) {
	return value.replace(/\/+$/u, "");
}
function normalizeArchivePath(entryPath, label) {
	const filename = stripTrailingSlashes(entryPath);
	if (!filename) throw new Error(`${label} is empty.`);
	assertPortableRelativePathSyntax(filename, label, entryPath);
	if (filename.split("/").some((segment) => segment === "." || segment === "..")) throw new Error(`${label} contains path traversal segments: ${entryPath}`);
	const normalized = stripTrailingSlashes(path.posix.normalize(filename));
	if (!normalized || normalized === "." || normalized === ".." || normalized.startsWith("../")) throw new Error(`${label} resolves outside the archive root: ${entryPath}`);
	return normalized;
}
function normalizeArchiveRoot(rootName) {
	const normalized = normalizeArchivePath(rootName, "Backup manifest archiveRoot");
	if (normalized.includes("/")) throw new Error(`Backup manifest archiveRoot must be a single path segment: ${rootName}`);
	return normalized;
}
function isArchivePathWithin(child, parent) {
	const relative = path.posix.relative(parent, child);
	return relative === "" || !relative.startsWith("../") && relative !== "..";
}
function recordArchiveSymbolicLink(params) {
	if (!params.linkpath || params.linkpath.includes("\0")) throw new Error(`Archive symbolic link is missing its target: ${params.entryPath}`);
	const entryPath = normalizeArchivePath(params.entryPath, "Archive symbolic link path");
	if (!params.assets.find(({ archivePath }) => isArchivePathWithin(entryPath, archivePath)) || !isArchivePathWithin(entryPath, normalizeArchiveRoot(params.archiveRoot))) throw new Error(`Archive symbolic link is outside the declared backup assets: ${params.entryPath} -> ${params.linkpath}`);
	if (!params.hasExternalLinkReport) {
		assertPortableRelativePathSyntax(params.linkpath, "Archive symbolic link target");
		const target = path.posix.join(path.posix.dirname(entryPath), params.linkpath);
		if (!params.assets.some(({ archivePath }) => isArchivePathWithin(target, archivePath))) throw new Error("Backup manifest external symbolic links do not match archive entries.");
	} else if (!params.state) throw new Error("Backup manifest is missing the symbolic-link state boundary.");
	const sourcePaths = params.platform === "win32" ? path.win32 : path.posix;
	const absolute = sourcePaths.isAbsolute(params.linkpath);
	const targetPaths = absolute ? sourcePaths : path.posix;
	const target = absolute ? sourcePaths.normalize(params.linkpath) : path.posix.join(path.posix.dirname(entryPath), params.platform === "win32" ? params.linkpath.replaceAll("\\", "/") : params.linkpath);
	const relative = params.state ? targetPaths.relative(absolute ? params.state.sourcePath : params.state.archivePath, target) : void 0;
	const external = relative === void 0 ? void 0 : targetPaths.isAbsolute(relative) || relative === ".." || relative.startsWith(`..${targetPaths.sep}`);
	return {
		entryPath: params.entryPath,
		linkpath: params.linkpath,
		external
	};
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
	const isCustomAgentPath = (candidate) => customAgentRoots.some(({ sourcePath }) => isPathInside(sourcePath, candidate));
	const temporaryRoots = [];
	let agentDirectories;
	try {
		agentDirectories = await fs$1.readdir(path.join(stateDir, "agents"), { withFileTypes: true });
	} catch (error) {
		if (isNotFoundPathError(error)) return temporaryRoots;
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
		const failure = scan.failedDirs.find(({ error }) => !isNotFoundPathError(error));
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
				if (!isPathInside(anchor.sourcePath, sourcePath)) throw new Error(`Plugin ${resource.pluginId} backup resource escapes its ${resource.scope} root: ${resource.relativePath}`);
				if (resource.disposition === "include") {
					protectedPathSet.add(sourcePath);
					pluginResourceRoots.push(sourcePath);
				} else exclude("plugin resource", sourcePath);
			}
		}
		for (const pluginRoot of params.pluginRoots) exclude("plugin dependencies", path.join(pluginRoot, "node_modules"));
	}
	const uniqueRegenerableRoots = Object.freeze(dedupeByKey(regenerableRoots.toSorted((left, right) => left.sourcePath.localeCompare(right.sourcePath) || left.kind.localeCompare(right.kind)), (resource) => `${resource.kind}\0${resource.sourcePath}`));
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
		const exclusion = excludedPaths.find((excludedPath) => isPathInside(excludedPath, candidate));
		if (!exclusion) return true;
		return protectedPaths.some((protectedPath) => isPathInside(protectedPath, candidate) && isPathInside(exclusion, protectedPath));
	};
	const isTraversable = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		if (isUpdateCapturePath(candidate, stateDir)) return false;
		return isIncluded(candidate) || protectedPaths.some((protectedPath) => isPathInside(candidate, protectedPath));
	};
	const isPackageContent = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		if (protectedPaths.some((protectedPath) => isPathInside(protectedPath, candidate) || isPathInside(candidate, protectedPath))) return false;
		if (!isPathInside(stateDir, candidate)) return false;
		const segments = path.relative(stateDir, candidate).split(path.sep);
		if (segments[0] === "agents" && segments[1] && (segments.length === 2 || segments[2] === "agent" && (segments.length === 3 || segments.length === 4 && /^openclaw-agent\.sqlite(?:-wal|-shm|-journal)?$/u.test(segments[3] ?? "")))) return false;
		return segments.includes("node_modules");
	};
	const volatilePlan = { stateDirs: [stateDir] };
	const isVolatile = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		const ownedPath = protectedPaths.some((protectedPath) => isPathInside(protectedPath, candidate));
		return candidate !== stateDir && !protectedPaths.some((protectedPath) => isPathInside(candidate, protectedPath)) && isTransientBackupPath(candidate) || !ownedPath && isVolatileBackupPath(candidate, volatilePlan);
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
		const sourcePath = path.resolve(normalizeWindowsNamespaceAlias(database.sourcePath));
		const realPath = database.identity ? realpathSync(sourcePath) : sourcePath;
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
		const candidate = path.resolve(normalizeWindowsNamespaceAlias(sourcePath));
		const exact = ownersByPath.get(candidate);
		let current = identity;
		let unresolvableLink = false;
		if (!exact && !current) try {
			current = statSync(candidate, { throwIfNoEntry: false });
		} catch (error) {
			if (!hasErrnoCode(error, "ELOOP")) throw error;
			unresolvableLink = true;
		}
		return exact ?? (current ? owners.find((database) => database.identity && sameFileIdentity(database.identity, current)) : void 0) ?? (resources.pluginResourceRoots.some((root) => isPathInside(root, candidate)) ? { role: "plugin" } : unresolvableLink ? { role: "unresolvable-link" } : void 0);
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
//#region src/plugins/manifest-backup-resources.ts
function listPluginInstallRoots(env) {
	const extensionsDir = resolveDefaultPluginExtensionsDir(env);
	try {
		return fs.readdirSync(extensionsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(extensionsDir, entry.name));
	} catch (error) {
		if (hasNodeErrorCode$1(error, "ENOENT")) return [];
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
		if (backupRoots.some((backupRoot) => resolvedRoot === backupRoot || isPathInside$1(backupRoot, resolvedRoot))) pluginRoots.add(resolvedRoot);
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
const BACKUP_ASSET_PRIORITY = {
	state: 0,
	config: 1,
	credentials: 2,
	workspace: 3,
	agent: 4,
	"managed skill": 5
};
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
function buildBackupArchiveRoot(nowMs = Date.now()) {
	return `${formatBackupArchiveTimestamp(nowMs)}-openclaw-backup`;
}
function buildBackupArchiveBasename(nowMs = Date.now()) {
	return `${buildBackupArchiveRoot(nowMs)}.tar.gz`;
}
/** Encode an absolute or relative source path into a traversal-safe archive payload path. */
function encodeAbsolutePathForBackupArchive(sourcePath) {
	const normalized = normalizeWindowsNamespaceAlias(sourcePath).replaceAll("\\", "/");
	const windowsMatch = normalized.match(/^([A-Za-z]):\/(.*)$/);
	if (windowsMatch) {
		const drive = windowsMatch[1]?.toUpperCase() ?? "UNKNOWN";
		const rest = windowsMatch[2] ?? "";
		return path.posix.join("windows", drive, rest);
	}
	if (normalized.startsWith("/")) return path.posix.join("posix", normalized.slice(1));
	return path.posix.join("relative", normalized);
}
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
		excludedWorkspaceDirs: (await Promise.all(excludedWorkspaceDirs.map(async (workspaceDir) => [path.resolve(workspaceDir), await canonicalizePathForContainment(workspaceDir)].filter((dir) => dir !== canonicalStateDir && !isPathInside(dir, canonicalStateDir))))).flat(),
		agentRoots,
		pluginResources: params.pluginInventory?.resources ?? [],
		pluginRoots: params.pluginInventory?.pluginRoots ?? [],
		onlyConfig
	});
	if (onlyConfig) {
		const resolvedConfigPath = path.resolve(configPath);
		const exists = await pathExists$1(resolvedConfigPath);
		const sourcePath = exists ? await canonicalizeExistingPath(resolvedConfigPath) : resolvedConfigPath;
		const asset = {
			kind: "config",
			sourcePath,
			displayPath: shortenHomePath(sourcePath)
		};
		return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
			resources,
			included: exists ? [{
				...asset,
				archivePath: buildBackupArchivePath(archiveRoot, sourcePath)
			}] : [],
			skipped: exists ? [] : [{
				...asset,
				reason: "missing"
			}]
		};
	}
	const isOwnedPathCoveredBy = (sourcePath, sourceRoot) => {
		let ancestor = sourcePath;
		while (isPathInside(sourceRoot, ancestor)) {
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
		const exists = await pathExists$1(candidate.sourcePath);
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
		const coveredBy = included.find((asset) => candidate.kind === "config" || candidate.kind === "credentials" ? isOwnedPathCoveredBy(candidate.canonicalPath, asset.sourcePath) : isPathInside(asset.sourcePath, candidate.canonicalPath));
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
	const regenerableRoots = resources.regenerableRoots.filter((resource) => !resources.isIncluded(resource.sourcePath) && included.some((asset) => isPathInside(asset.sourcePath, resource.sourcePath)));
	const regenerableResourceExists = await Promise.all(regenerableRoots.map((resource) => pathExists$1(resource.sourcePath)));
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
	const priorityDelta = BACKUP_ASSET_PRIORITY[left.kind] - BACKUP_ASSET_PRIORITY[right.kind];
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
			if (!targetPath || params.ownerRoots.some((ownerRoot) => isPathInside(ownerRoot, targetPath) || isPathInside(targetPath, ownerRoot))) continue;
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
async function resolveBackupAgentRoots(config) {
	return await Promise.all(listAgentIds(config).map((agentId) => resolveBackupAgentRoot(config, agentId)));
}
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
	const discoverySnapshot = resolveLegacyConfigSnapshotForBackup(configSnapshot) ?? configSnapshot;
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
export { canonicalizePathForContainment as a, resolveBackupAgentRoots as c, describeCapturedBackupSqliteSnapshots as d, sealBackupResourceInventory as f, recordArchiveSymbolicLink as g, normalizeArchiveRoot as h, buildBackupArchiveRoot as i, resolveBackupPlanFromDisk as l, normalizeArchivePath as m, buildBackupArchiveBasename as n, recordBackupOutcomeBestEffort as o, isArchivePathWithin as p, buildBackupArchivePath as r, resolveBackupAgentRoot as s, BACKUP_MAX_DECOMPRESSION_RATIO as t, resolveRequiredBackupPath as u };
