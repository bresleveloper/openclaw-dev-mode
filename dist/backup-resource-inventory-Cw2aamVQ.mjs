import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { O as walkDirectory } from "./fs-safe-6Z4UiMS4.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { r as isVolatileBackupPath, t as isTransientBackupPath } from "./backup-volatile-filter-60qK_QQY.mjs";
import { n as isUpdateCapturePath } from "./update-capture-paths-KB4ru3JI.mjs";
import { realpathSync, statSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
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
function normalizeArchivePath(entryPath, label) {
	const filename = entryPath.replace(/\/+$/u, "");
	if (!filename) throw new Error(`${label} is empty.`);
	assertPortableRelativePathSyntax(filename, label, entryPath);
	if (filename.split("/").some((segment) => segment === "." || segment === "..")) throw new Error(`${label} contains path traversal segments: ${entryPath}`);
	return path.posix.normalize(filename);
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
		for (const directory of [...params.oauthDirs, ...params.workspaceDirs]) protectedPathSet.add(path.resolve(directory));
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
	const isIncludedByOwner = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		const exclusion = excludedPaths.find((excludedPath) => isPathInside(excludedPath, candidate));
		if (!exclusion) return true;
		return protectedPaths.some((protectedPath) => isPathInside(protectedPath, candidate) && isPathInside(exclusion, protectedPath));
	};
	const isIncluded = (sourcePath) => isIncludedByOwner(sourcePath) && !isUpdateCapturePath(path.resolve(sourcePath), stateDir);
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
		isIncludedByOwner,
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
			current = statSync(candidate, {
				bigint: true,
				throwIfNoEntry: false
			});
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
export { normalizeArchivePath as a, recordArchiveSymbolicLink as c, isArchivePathWithin as i, describeCapturedBackupSqliteSnapshots as n, normalizeArchiveRoot as o, sealBackupResourceInventory as r, normalizeWindowsNamespaceAlias as s, createBackupResourcePlan as t };
