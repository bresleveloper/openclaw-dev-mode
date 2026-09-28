import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { a as normalizeWindowsPathForComparison } from "./path-guards-D5kuI0Tv.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as isWindowsDrivePath } from "./archive-path-Cbi82IZu.mjs";
import path from "node:path";
//#region src/infra/backup-archive-path-policy.ts
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
//#region src/commands/backup-verify-manifest.ts
function backupManifestSizeError(bytes) {
	const maxBytes = 1048576;
	return bytes > maxBytes ? /* @__PURE__ */ new Error(`Backup manifest exceeds ${maxBytes} byte limit.`) : void 0;
}
function parseBackupManifestSourcePath(value, label) {
	if (typeof value !== "string" || value.includes("\0")) throw new Error(`Backup manifest ${label} has an invalid sourcePath.`);
	const windowsPath = /^(?:[A-Za-z]:[\\/]|\\\\(?![?.]\\))/u.test(value);
	const normalized = windowsPath ? path.win32.normalize(value) : path.posix.normalize(value);
	if (!windowsPath && !value.startsWith("/") || normalized !== value) throw new Error(`Backup manifest ${label} sourcePath must be absolute and normalized.`);
	return value;
}
function parseBackupManifestAgentRoots(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error("Backup manifest agentRoots must be an array.");
	const agentRoots = [];
	const seenAgentIds = /* @__PURE__ */ new Set();
	const seenSourcePaths = /* @__PURE__ */ new Set();
	for (const agentRoot of value) {
		if (!isRecord(agentRoot) || Object.keys(agentRoot).length !== 2 || !Object.hasOwn(agentRoot, "agentId") || !Object.hasOwn(agentRoot, "sourcePath")) throw new Error("Backup manifest agent root must contain only agentId and sourcePath.");
		const { agentId, sourcePath } = agentRoot;
		if (typeof agentId !== "string" || !agentId || normalizeAgentId(agentId) !== agentId) throw new Error("Backup manifest agent root has an invalid or noncanonical agentId.");
		const normalizedSourcePath = parseBackupManifestSourcePath(sourcePath, "agent root");
		const sourcePathKey = /^(?:[A-Za-z]:[\\/]|\\\\(?![?.]\\))/u.test(normalizedSourcePath) ? normalizeWindowsPathForComparison(normalizedSourcePath) : normalizedSourcePath;
		if (seenAgentIds.has(agentId) || seenSourcePaths.has(sourcePathKey)) throw new Error("Backup manifest contains duplicate agent root ownership.");
		seenAgentIds.add(agentId);
		seenSourcePaths.add(sourcePathKey);
		agentRoots.push({
			agentId,
			sourcePath: normalizedSourcePath
		});
	}
	return agentRoots;
}
function parseBackupManifest(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new Error("Backup manifest is not valid JSON.", { cause: err });
	}
	if (!isRecord(parsed)) throw new Error("Backup manifest must be an object.");
	if (parsed.schemaVersion !== 1) throw new Error(`Unsupported backup manifest schemaVersion: ${String(parsed.schemaVersion)}`);
	if (typeof parsed.archiveRoot !== "string" || !parsed.archiveRoot.trim()) throw new Error("Backup manifest is missing archiveRoot.");
	if (typeof parsed.createdAt !== "string" || !parsed.createdAt.trim()) throw new Error("Backup manifest is missing createdAt.");
	if (!Array.isArray(parsed.assets)) throw new Error("Backup manifest is missing assets.");
	const assets = [];
	for (const asset of parsed.assets) {
		if (!isRecord(asset)) throw new Error("Backup manifest contains a non-object asset.");
		if (typeof asset.kind !== "string" || !asset.kind.trim()) throw new Error("Backup manifest asset is missing kind.");
		if (typeof asset.sourcePath !== "string" || !asset.sourcePath.trim()) throw new Error("Backup manifest asset is missing sourcePath.");
		if (typeof asset.archivePath !== "string" || !asset.archivePath.trim()) throw new Error("Backup manifest asset is missing archivePath.");
		assets.push({
			kind: asset.kind,
			sourcePath: asset.sourcePath,
			archivePath: asset.archivePath
		});
	}
	const externalSymbolicLinks = [];
	if (parsed.externalSymbolicLinks !== void 0) {
		if (!Array.isArray(parsed.externalSymbolicLinks)) throw new Error("Backup manifest externalSymbolicLinks must be an array.");
		for (const link of parsed.externalSymbolicLinks) {
			if (!isRecord(link) || typeof link.entryPath !== "string" || typeof link.linkpath !== "string") throw new Error("Backup manifest contains an invalid external symbolic link.");
			externalSymbolicLinks.push({
				entryPath: link.entryPath,
				linkpath: link.linkpath
			});
		}
	}
	return {
		schemaVersion: 1,
		archiveRoot: parsed.archiveRoot,
		createdAt: parsed.createdAt,
		runtimeVersion: typeof parsed.runtimeVersion === "string" && parsed.runtimeVersion.trim() ? parsed.runtimeVersion : "unknown",
		platform: typeof parsed.platform === "string" ? parsed.platform : "unknown",
		nodeVersion: typeof parsed.nodeVersion === "string" ? parsed.nodeVersion : "unknown",
		paths: isRecord(parsed.paths) ? {
			...parsed.paths.stateDir === void 0 ? {} : { stateDir: parseBackupManifestSourcePath(parsed.paths.stateDir, "state directory") },
			agentRoots: parseBackupManifestAgentRoots(parsed.paths.agentRoots)
		} : void 0,
		assets,
		...parsed.externalSymbolicLinks === void 0 ? {} : { externalSymbolicLinks }
	};
}
function isRootBackupManifestEntry(entryPath) {
	const parts = entryPath.split("/");
	return parts.length === 2 && parts[0] !== "" && parts[1] === "manifest.json";
}
function verifyBackupManifestEntries(manifest, entries) {
	const archiveRoot = normalizeArchiveRoot(manifest.archiveRoot);
	const manifestEntryPath = path.posix.join(archiveRoot, "manifest.json");
	const normalizedEntries = [...entries];
	if (!entries.has(manifestEntryPath)) throw new Error(`Archive is missing manifest entry: ${manifestEntryPath}`);
	for (const entry of normalizedEntries) if (!isArchivePathWithin(entry, archiveRoot)) throw new Error(`Archive entry is outside the declared archive root: ${entry}`);
	const payloadRoot = path.posix.join(archiveRoot, "payload");
	for (const asset of manifest.assets) {
		const assetArchivePath = normalizeArchivePath(asset.archivePath, "Backup manifest asset path");
		if (!isArchivePathWithin(assetArchivePath, payloadRoot)) throw new Error(`Manifest asset path is outside payload root: ${asset.archivePath}`);
		if (!entries.has(assetArchivePath) && !normalizedEntries.some((entry) => isArchivePathWithin(entry, assetArchivePath))) throw new Error(`Archive is missing payload for manifest asset: ${assetArchivePath}`);
	}
}
//#endregion
export { isArchivePathWithin as a, recordArchiveSymbolicLink as c, verifyBackupManifestEntries as i, isRootBackupManifestEntry as n, normalizeArchivePath as o, parseBackupManifest as r, normalizeArchiveRoot as s, backupManifestSizeError as t };
