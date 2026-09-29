import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-eRv24eIu.mjs";
import { n as readOpenClawAgentDatabaseRegistryRows } from "./openclaw-agent-db-registry.read-CZdmnVd_.mjs";
import { n as assertOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-BskpG3v_.mjs";
import { r as buildBackupArchivePath, t as BACKUP_MAX_DECOMPRESSION_RATIO } from "./backup-shared-CDd4btcJ.mjs";
import { a as isArchivePathWithin, c as recordArchiveSymbolicLink, i as verifyBackupManifestEntries, n as isRootBackupManifestEntry, o as normalizeArchivePath, r as parseBackupManifest, s as normalizeArchiveRoot, t as backupManifestSizeError } from "./backup-verify-manifest-BalkhYkX.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import * as tar from "tar";
//#region src/commands/backup-verify.ts
const MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES = 68719476736;
const SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES = 268435456;
async function listArchiveEntries(archivePath) {
	const entries = [];
	let invalidReason;
	await tar.t({
		file: archivePath,
		gzip: true,
		maxDecompressionRatio: BACKUP_MAX_DECOMPRESSION_RATIO,
		onwarn: (code, message) => {
			if (code === "TAR_BAD_ARCHIVE" || code === "TAR_ENTRY_INVALID") invalidReason ??= formatErrorMessage(message);
		},
		onReadEntry: (entry) => {
			entries.push({
				path: entry.path,
				...entry.linkpath ? { linkpath: entry.linkpath } : {},
				...Number.isSafeInteger(entry.size) && entry.size >= 0 ? { size: entry.size } : {},
				...entry.type ? { type: entry.type } : {}
			});
		}
	});
	return {
		entries,
		invalidReason
	};
}
async function extractManifest(params) {
	let manifestContentPromise;
	await tar.t({
		file: params.archivePath,
		gzip: true,
		maxDecompressionRatio: BACKUP_MAX_DECOMPRESSION_RATIO,
		filter: (entryPath) => entryPath === params.manifestEntryPath,
		onReadEntry: (entry) => {
			manifestContentPromise = Promise.resolve(backupManifestSizeError(entry.size) ?? entry.concat().catch((error) => toStringifiedError(error)));
		}
	});
	if (!manifestContentPromise) throw new Error(`Archive is missing manifest entry: ${params.manifestEntryPath}`);
	const content = await manifestContentPromise;
	if (content instanceof Error) throw content;
	return content.toString("utf8");
}
function formatResult(result) {
	return [
		`Backup archive OK: ${result.archivePath}`,
		`Archive root: ${result.archiveRoot}`,
		`Created at: ${result.createdAt}`,
		`Runtime version: ${result.runtimeVersion}`,
		`Assets verified: ${result.assetCount}`,
		`Archive entries scanned: ${result.entryCount}`,
		`Symbolic links checked: ${result.symlinkCount}`
	].join("\n");
}
function resolvePortableArchivePathKey(value) {
	return value.normalize("NFC").toLowerCase();
}
function findPortableArchiveEntryPathCollision(entries) {
	const seen = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const key = resolvePortableArchivePathKey(entry.normalized);
		const first = seen.get(key);
		if (first && first !== entry.normalized) return {
			first,
			second: entry.normalized
		};
		seen.set(key, entry.normalized);
	}
}
function isRegularArchiveFile(entryType) {
	return entryType === "File" || entryType === "OldFile" || entryType === "ContiguousFile";
}
function resolveCanonicalStateAssetRoot(manifest) {
	const stateAssets = manifest.assets.filter((asset) => asset.kind === "state");
	if (stateAssets.length === 0) return;
	if (stateAssets.length !== 1) throw new Error(`Backup manifest must contain at most one state asset; found ${stateAssets.length}.`);
	const stateAsset = stateAssets[0];
	if (!stateAsset) return;
	const stateAssetRoot = normalizeArchivePath(stateAsset.archivePath, "Backup manifest state asset path");
	if (stateAssetRoot !== buildBackupArchivePath(normalizeArchiveRoot(manifest.archiveRoot), stateAsset.sourcePath)) throw new Error("Backup manifest state asset archivePath does not match its sourcePath.");
	return stateAssetRoot;
}
function listSqliteSnapshotEntries(entries, owners) {
	const ownersByPath = new Map(owners.map((owner) => [resolvePortableArchivePathKey(owner.archivePath), owner]));
	const snapshots = [];
	for (const entry of entries) {
		const portablePath = resolvePortableArchivePathKey(entry.normalized);
		for (const suffix of SQLITE_SIDECAR_SUFFIXES) if (portablePath.endsWith(suffix) && ownersByPath.has(portablePath.slice(0, -suffix.length))) throw new Error(`Backup contains a SQLite snapshot sidecar: ${entry.normalized}`);
		const owner = ownersByPath.get(portablePath);
		if (!owner) continue;
		if (entry.normalized !== owner.archivePath) throw new Error(`Backup contains a case-mangled canonical SQLite path: ${entry.normalized}`);
		if (!isRegularArchiveFile(entry.type)) throw new Error(`SQLite snapshot must be a regular archive file: ${entry.normalized}`);
		snapshots.push({
			...entry,
			...owner
		});
	}
	return snapshots;
}
function readArchivedAgentDatabaseOwners(database, manifest, stateDir) {
	const rows = readOpenClawAgentDatabaseRegistryRows(database, stateDir);
	const sourcePath = manifest.platform === "win32" ? path.win32 : path.posix;
	return rows.map((row) => ({
		archivePath: buildBackupArchivePath(manifest.archiveRoot, sourcePath.isAbsolute(row.path) ? row.path : sourcePath.join(stateDir, row.path)),
		role: "agent",
		agentId: row.agent_id
	}));
}
function resolveSqliteExtractionBytes(entries) {
	let totalBytes = 0;
	for (const entry of entries) {
		if (!Number.isSafeInteger(entry.size) || (entry.size ?? -1) < 0) throw new Error(`SQLite snapshot has an invalid archive size: ${entry.normalized}`);
		if (entry.size === 0) throw new Error(`SQLite snapshot is empty: ${entry.normalized}`);
		totalBytes += entry.size ?? 0;
		if (!Number.isSafeInteger(totalBytes)) throw new Error("SQLite snapshot extraction size exceeds the supported integer range.");
	}
	return totalBytes;
}
function assertSqliteExtractionBudget(params) {
	const totalBytes = resolveSqliteExtractionBytes(params.entries);
	if (totalBytes > MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES) throw new Error(`SQLite snapshots require ${formatDiskSpaceBytes(totalBytes)} of extraction space; the verification limit is ${formatDiskSpaceBytes(MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES)}.`);
	const remainingBytes = totalBytes - (params.extractedBytes ?? 0);
	const diskSpace = tryReadDiskSpace(params.tempRoot);
	if (diskSpace && remainingBytes + SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES > diskSpace.availableBytes) throw new Error(`SQLite snapshots require ${formatDiskSpaceBytes(remainingBytes)} of extraction space, but only ${formatDiskSpaceBytes(diskSpace.availableBytes)} is available near ${params.tempRoot}; verification reserves ${formatDiskSpaceBytes(SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES)} for the host.`);
}
function assertExpectedSqliteRole(database, archivePath, expectedRole) {
	if (database.prepare("SELECT type FROM sqlite_schema WHERE name = 'schema_meta'").get()?.type !== "table") throw new Error(`SQLite snapshot ${archivePath} is missing the expected schema_meta table.`);
	const metadata = database.prepare("SELECT role FROM schema_meta WHERE meta_key = 'primary'").get();
	const actualRole = typeof metadata?.role === "string" ? metadata.role : "missing";
	if (actualRole !== expectedRole) throw new Error(`SQLite snapshot ${archivePath} has role ${actualRole}; expected ${expectedRole}.`);
}
async function assertSqliteSnapshotFileShape(extractedPath, archivePath, expectedSize) {
	const header = Buffer.alloc(100);
	const handle = await fs.open(extractedPath, "r");
	try {
		const { bytesRead } = await handle.read(header, 0, header.byteLength, 0);
		if (bytesRead !== header.byteLength || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") throw new Error(`SQLite snapshot ${archivePath} has an invalid database header.`);
	} finally {
		await handle.close();
	}
	const encodedPageSize = header.readUInt16BE(16);
	const pageSize = encodedPageSize === 1 ? 65536 : encodedPageSize;
	if (!(pageSize >= 512 && pageSize <= 65536 && (pageSize & pageSize - 1) === 0) || expectedSize % pageSize !== 0) throw new Error(`SQLite snapshot ${archivePath} has an invalid page layout.`);
	const changeCounter = header.readUInt32BE(24);
	const declaredPageCount = header.readUInt32BE(28);
	const versionValidFor = header.readUInt32BE(92);
	if (declaredPageCount !== 0 && changeCounter === versionValidFor && declaredPageCount !== expectedSize / pageSize) throw new Error(`SQLite snapshot ${archivePath} has an invalid page layout.`);
}
async function verifySqliteSnapshots(params) {
	const verifiedOwners = [];
	const stateDir = params.manifest.paths?.stateDir ?? params.manifest.assets.find((asset) => asset.kind === "state")?.sourcePath;
	if (!stateDir) return verifiedOwners;
	const stateAssetRoot = buildBackupArchivePath(params.manifest.archiveRoot, stateDir);
	const portableStateRoot = resolvePortableArchivePathKey(stateAssetRoot);
	for (const entry of params.entries) if (isArchivePathWithin(resolvePortableArchivePathKey(entry.normalized), portableStateRoot) && !isArchivePathWithin(entry.normalized, stateAssetRoot)) throw new Error(`Backup contains a case-mangled state asset path: ${entry.normalized}`);
	const globalOwner = {
		archivePath: path.posix.join(stateAssetRoot, "state/openclaw.sqlite"),
		role: "global"
	};
	const globalEntries = listSqliteSnapshotEntries(params.entries, [globalOwner]);
	if (globalEntries.length === 0) return verifiedOwners;
	resolveCanonicalStateAssetRoot(params.manifest);
	const tempRoot = os.tmpdir();
	assertSqliteExtractionBudget({
		entries: globalEntries,
		tempRoot
	});
	const tempDir = await fs.mkdtemp(path.join(tempRoot, "openclaw-backup-verify-sqlite-"));
	try {
		const batches = [globalEntries];
		const extractedEntries = [];
		for (const sqliteEntries of batches) {
			const extractedBytes = resolveSqliteExtractionBytes(extractedEntries);
			extractedEntries.push(...sqliteEntries);
			if (extractedBytes > 0) assertSqliteExtractionBudget({
				entries: extractedEntries,
				tempRoot,
				extractedBytes
			});
			const sqliteEntriesByRawPath = new Map(sqliteEntries.map((entry) => [entry.raw, entry]));
			await tar.x({
				file: params.archivePath,
				gzip: true,
				maxDecompressionRatio: BACKUP_MAX_DECOMPRESSION_RATIO,
				cwd: tempDir,
				strict: true,
				preserveOwner: false,
				filter: (entryPath, archiveEntry) => {
					const expected = sqliteEntriesByRawPath.get(entryPath);
					if (!expected) return false;
					if (archiveEntry.size !== expected.size) throw new Error(`SQLite snapshot size changed during verification: ${entryPath}`);
					return true;
				}
			});
			for (const entry of sqliteEntries) {
				const extractedPath = path.join(tempDir, ...entry.normalized.split("/"));
				const extractedStat = await fs.lstat(extractedPath);
				if (!extractedStat.isFile()) throw new Error(`Extracted SQLite snapshot is not a regular file: ${entry.normalized}`);
				if (extractedStat.size !== entry.size) throw new Error(`Extracted SQLite snapshot size does not match archive: ${entry.normalized}`);
				let database;
				try {
					await assertSqliteSnapshotFileShape(extractedPath, entry.normalized, extractedStat.size);
					database = openNodeSqliteDatabase(extractedPath, {
						allowExtension: true,
						readOnly: true
					});
					database.exec("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;");
					await loadSqliteVecExtension({ db: database });
					assertSqliteIntegrity(database, entry.normalized);
					if (entry.role === "agent") assertOpenClawAgentDatabaseOwner(database, {
						agentId: entry.agentId,
						pathname: entry.normalized
					});
					else assertExpectedSqliteRole(database, entry.normalized, entry.role);
					verifiedOwners.push({
						...entry,
						archivePath: entry.normalized
					});
					if (entry.role === "global") {
						const agentOwners = readArchivedAgentDatabaseOwners(database, params.manifest, stateDir);
						const ownerByPath = /* @__PURE__ */ new Map([[resolvePortableArchivePathKey(globalOwner.archivePath), globalOwner]]);
						for (const owner of agentOwners) {
							const ownerKey = resolvePortableArchivePathKey(owner.archivePath);
							const previous = ownerByPath.get(ownerKey);
							if (previous && (previous.role !== "agent" || owner.role !== "agent" || previous.agentId !== owner.agentId || previous.archivePath !== owner.archivePath)) throw new Error(`SQLite snapshot has conflicting registered owners: ${owner.archivePath}`);
							ownerByPath.set(ownerKey, owner);
						}
						const agentEntries = listSqliteSnapshotEntries(params.entries, agentOwners);
						if (agentEntries.length > 0) batches.push(agentEntries);
					}
				} catch (err) {
					const message = err instanceof Error ? err.message : String(err);
					throw new Error(`Backup SQLite snapshot failed verification: ${entry.normalized}. ${message}`, { cause: err });
				} finally {
					database?.close();
				}
			}
		}
	} finally {
		await fs.rm(tempDir, {
			recursive: true,
			force: true
		});
	}
	return verifiedOwners;
}
async function verifyResolvedBackupArchive(archivePath, requiredSnapshots) {
	let archiveStat;
	try {
		archiveStat = await fs.stat(archivePath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) throw new Error("Archive does not exist. Check the path and run `openclaw backup verify <archive>` again.", { cause: error });
		throw new Error(`Archive could not be inspected. ${formatErrorMessage(error)} Check the path and file permissions, then try again.`, { cause: error });
	}
	if (!archiveStat.isFile()) throw new Error("Archive must be a regular file. Choose a backup archive created by `openclaw backup create` and try again.");
	const listing = await listArchiveEntries(archivePath).catch((error) => {
		throw new Error(`Archive could not be read or parsed. ${formatErrorMessage(error)} Check the file permissions and archive integrity, then try again.`);
	});
	if (listing.invalidReason) throw new Error(`Archive is not a valid OpenClaw backup. ${listing.invalidReason.replace(/[.!?]*$/u, ".")} Choose another archive or create a new one with \`openclaw backup create\`.`);
	const rawEntries = listing.entries;
	const entries = rawEntries.map((entry) => ({
		raw: entry.path,
		normalized: normalizeArchivePath(entry.path, "Archive entry"),
		...entry.size !== void 0 ? { size: entry.size } : {},
		...entry.type ? { type: entry.type } : {}
	}));
	const symbolicLinks = rawEntries.filter((entry) => entry.type === "SymbolicLink").map((entry) => ({
		entryPath: entry.path,
		linkpath: entry.linkpath
	}));
	const rawEntryPaths = /* @__PURE__ */ new Map();
	let duplicateEntryPath;
	for (const entry of entries) {
		if (rawEntryPaths.has(entry.normalized)) duplicateEntryPath ??= entry.normalized;
		rawEntryPaths.set(entry.normalized, entry.raw);
	}
	const normalizedEntrySet = new Set(rawEntryPaths.keys());
	const manifestMatches = entries.filter((entry) => isRootBackupManifestEntry(entry.normalized));
	if (manifestMatches.length !== 1) throw new Error(`Expected exactly one backup manifest entry, found ${manifestMatches.length}.`);
	if (duplicateEntryPath) throw new Error(`Archive contains duplicate entry path: ${duplicateEntryPath}`);
	const portablePathCollision = findPortableArchiveEntryPathCollision(entries);
	if (portablePathCollision) throw new Error(`Archive contains a portable path collision: ${portablePathCollision.first} and ${portablePathCollision.second}`);
	const manifestEntryPath = manifestMatches[0]?.raw;
	if (!manifestEntryPath) throw new Error("Backup archive manifest entry could not be resolved.");
	const manifestRaw = await extractManifest({
		archivePath,
		manifestEntryPath
	});
	const manifest = parseBackupManifest(manifestRaw);
	verifyBackupManifestEntries(manifest, normalizedEntrySet);
	const archiveRoot = normalizeArchiveRoot(manifest.archiveRoot);
	const hardlinkTargets = /* @__PURE__ */ new Map();
	for (const entry of rawEntries) if (entry.type === "Link") {
		const target = normalizeArchivePath(entry.linkpath ?? "", `Archive hardlink target for ${entry.path}`);
		const resolved = isArchivePathWithin(target, archiveRoot) ? target : path.posix.join(archiveRoot, target);
		const rawTarget = rawEntryPaths.get(resolved);
		if (!rawTarget) throw new Error(`Archive hardlink target is missing from archive entries: ${entry.path} -> ${resolved}`);
		hardlinkTargets.set(entry.path, rawTarget);
	}
	const preparedSymbolicLinks = [];
	const externalSymbolicLinks = [];
	const symbolicLinkPaths = new Set(symbolicLinks.map(({ entryPath }) => resolvePortableArchivePathKey(normalizeArchivePath(entryPath, "Archive symbolic link path"))));
	for (const entry of entries) for (let parent = path.posix.dirname(entry.normalized); parent !== "."; parent = path.posix.dirname(parent)) if (symbolicLinkPaths.has(resolvePortableArchivePathKey(parent))) throw new Error(`Archive entry is beneath a symbolic link: ${entry.raw}`);
	const state = manifest.assets.find((asset) => asset.kind === "state") ?? (manifest.paths?.stateDir ? {
		sourcePath: manifest.paths.stateDir,
		archivePath: buildBackupArchivePath(manifest.archiveRoot, manifest.paths.stateDir)
	} : void 0);
	for (const link of symbolicLinks) {
		const { external, ...record } = recordArchiveSymbolicLink({
			...link,
			archiveRoot: manifest.archiveRoot,
			platform: manifest.platform,
			state,
			hasExternalLinkReport: manifest.externalSymbolicLinks !== void 0,
			assets: manifest.assets
		});
		preparedSymbolicLinks.push(record);
		if (external) externalSymbolicLinks.push(record);
	}
	const reportedLinks = new Map((manifest.externalSymbolicLinks ?? []).map(({ entryPath, linkpath }) => [entryPath, linkpath]));
	if (manifest.externalSymbolicLinks !== void 0 && (reportedLinks.size !== externalSymbolicLinks.length || externalSymbolicLinks.some(({ entryPath, linkpath }) => reportedLinks.get(entryPath) !== linkpath))) throw new Error("Backup manifest external symbolic links do not match archive entries.");
	const verifiedSnapshots = await verifySqliteSnapshots({
		archivePath,
		entries,
		manifest
	});
	for (const required of requiredSnapshots) {
		const expectedPath = buildBackupArchivePath(manifest.archiveRoot, required.sourcePath);
		if (!verifiedSnapshots.some((verified) => verified.archivePath === expectedPath && verified.role === required.role && (required.role === "global" || verified.role === "agent" && verified.agentId === required.agentId))) throw new Error(`Backup lacks verified canonical SQLite coverage for ${required.sourcePath}.`);
	}
	return {
		result: {
			ok: true,
			archivePath,
			archiveRoot: manifest.archiveRoot,
			createdAt: manifest.createdAt,
			runtimeVersion: manifest.runtimeVersion,
			assetCount: manifest.assets.length,
			entryCount: rawEntries.length,
			symlinkCount: symbolicLinks.length,
			...externalSymbolicLinks.length ? { externalSymbolicLinks } : {}
		},
		hardlinkTargets,
		symbolicLinks: preparedSymbolicLinks
	};
}
/** Verify an archive and prepare the exact hardlink targets needed by extraction. */
async function prepareBackupArchive(archive, requiredSnapshots = []) {
	const archivePath = resolveUserPath(archive);
	return await verifyResolvedBackupArchive(archivePath, requiredSnapshots).catch((error) => {
		const detail = error instanceof Error ? error.message : formatErrorMessage(error);
		throw new Error(`Backup archive verification failed: ${archivePath}. ${detail}`);
	});
}
/** Verify a backup archive without exposing extraction metadata in CLI output. */
async function verifyBackupArchive(archive, requiredSnapshots = []) {
	return (await prepareBackupArchive(archive, requiredSnapshots)).result;
}
/** Verify a backup archive, including snapshot shape and canonical SQLite integrity checks. */
async function backupVerifyCommand(runtime, opts) {
	const result = await verifyBackupArchive(opts.archive);
	if (opts.json) writeRuntimeJson(runtime, result);
	else runtime.log(formatResult(result));
	return result;
}
//#endregion
export { prepareBackupArchive as n, verifyBackupArchive as r, backupVerifyCommand as t };
