import { E as resolveDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { d as resolveHomeDir, h as sleep } from "./utils-aKqR_F_U.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { _ as resolveGatewayLockDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-BkM1aB4w.mjs";
import { i as sameFileMutationFingerprint } from "./file-descriptor-C_0BsNDD.mjs";
import { i as resolveOpenClawRegisteredAgentDatabasePath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { u as resolveQuarantineStorePath } from "./openclaw-quarantine-store-BBmdpwTz.mjs";
import { D as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { i as resolveSqliteDatabaseFilePaths, n as isAppleDoubleMetadataFile, t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-eRv24eIu.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { a as publishFileExclusive, f as syncDirectoryIfSupported, n as getPublishFileExclusiveFailureDetails, r as isHardlinkFallbackError, s as requireDirectorySync } from "./directory-durability-BKe2aOQN.mjs";
import { n as CONFIG_AUDIT_SCOPE } from "./io.audit-CcH6Zt2-.mjs";
import { n as readOpenClawAgentDatabaseRegistryRows } from "./openclaw-agent-db-registry.read-CZdmnVd_.mjs";
import { n as assertOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { n as isUpdateCapturePath, t as assertNotUpdateCapturePath } from "./update-capture-paths-CSUVJC6v.mjs";
import { n as SYSTEM_AGENT_AUDIT_SCOPE } from "./audit-Dw5g9WOB.mjs";
import { n as isPathWithin } from "./cleanup-utils-MkYk5me2.mjs";
import { a as canonicalizePathForContainment, d as stageBackupConfigCapture, f as describeCapturedBackupSqliteSnapshots, g as isLegacyAuditMigrationBackupPath, h as hasLegacyAuditBackupSources, i as buildBackupArchiveRoot, l as resolveBackupPlanFromDisk, m as isTransientSqliteBackupPath, n as buildBackupArchiveBasename, p as sealBackupResourceInventory, r as buildBackupArchivePath } from "./backup-shared-CDd4btcJ.mjs";
import { c as recordArchiveSymbolicLink, t as backupManifestSizeError } from "./backup-verify-manifest-BalkhYkX.mjs";
import { n as finishBackupScratch, r as maintainBackupScratch, t as createBackupScratchDirectory } from "./backup-scratch-htr1ZX-I.mjs";
import { t as embedSessionColdArchivesInSnapshot } from "./session-cold-storage-backup-BXvIimnw.mjs";
import { n as sanitizeOpenClawStateLeaseRows, t as sanitizeOpenClawGlobalStateSnapshot } from "./openclaw-state-snapshot-sanitizer-ClAnumPE.mjs";
import { t as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-BtH-P5bb.mjs";
import { a as readLegacyAuditRecoverySourceForBackup, d as prepareLegacyAuditRecords, f as serializePreparedAuditRecords, g as legacyAuditSourceGenerationKey, h as legacyAuditRawCheckpointKey, i as findPreviousLegacyAuditRawCheckpoint, o as readLegacyAuditSourcePrefixSnapshotForBackup, p as detectLegacyAuditLogs, t as withLegacyAuditMigrationLease } from "./state-migrations.audit-coordination-MRV0x_ps.mjs";
import fs, { constants, createWriteStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { Transform, compose } from "node:stream";
import { createHash, randomUUID } from "node:crypto";
import { createGzip } from "node:zlib";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/infra/backup-create-stream.ts
const BACKUP_ARCHIVE_IDLE_TIMEOUT_MS = 3e5;
/** Seal the manifest from observed entries after the single payload traversal. */
function appendBackupManifest(payload, createManifest) {
	return compose(payload, async function* (source) {
		let tail = Buffer.alloc(0);
		for await (const chunk of source) {
			const length = Math.max(0, tail.length - Math.max(0, 1024 - chunk.length));
			if (length) yield tail.subarray(0, length);
			tail = length < tail.length ? Buffer.concat([tail.subarray(length), chunk]) : chunk;
		}
		if (tail.length > 1024) yield tail.subarray(0, -1024);
		yield createManifest();
	}, createGzip());
}
function removePreparedBackupArchive(prepared) {
	let currentIdentity;
	try {
		currentIdentity = fs.lstatSync(prepared.archivePath);
	} catch {
		return false;
	}
	if (!currentIdentity.isFile() || !sameFileIdentity(prepared.identity, currentIdentity)) return false;
	try {
		fs.unlinkSync(prepared.archivePath);
		return true;
	} catch {
		return false;
	}
}
async function writeArchiveStreamToFile(params) {
	const controller = new AbortController();
	let archiveStream;
	let openedIdentity;
	let idleTimer;
	let idleTimeoutError;
	let lastEntryPath;
	let lastProgress;
	let outputBytes = 0;
	let producerBytes = 0;
	let settled = false;
	const reportProgress = (progress) => {
		if (settled) return;
		if (progress) {
			lastProgress = progress;
			if (progress.entryPath) lastEntryPath = progress.entryPath;
			if (progress.bytes) {
				if (progress.phase === "output") outputBytes += progress.bytes;
				else if (progress.phase === "raw") producerBytes += progress.bytes;
			}
		}
		idleTimer = idleTimer?.refresh() ?? setTimeout(() => {
			const entrySuffix = lastEntryPath ? `, entry=${JSON.stringify(sliceUtf16Safe(lastEntryPath, -512))}` : "";
			idleTimeoutError = /* @__PURE__ */ new Error(`Backup archive write stalled: no progress observed for ${BACKUP_ARCHIVE_IDLE_TIMEOUT_MS}ms (phase=${lastProgress?.phase ?? "starting"}${entrySuffix}, rawBytes=${producerBytes}, outputBytes=${outputBytes})`);
			archiveStream?.destroy(idleTimeoutError);
			controller.abort(idleTimeoutError);
		}, BACKUP_ARCHIVE_IDLE_TIMEOUT_MS);
	};
	const progress = new Transform({ transform(chunk, _encoding, callback) {
		reportProgress({
			phase: "output",
			bytes: chunk.length
		});
		callback(null, chunk);
	} });
	const archiveWriteStream = createWriteStream(params.archivePath, {
		flags: "wx",
		flush: true,
		mode: 384
	});
	archiveWriteStream.once("open", (fileDescriptor) => {
		try {
			openedIdentity = fs.fstatSync(fileDescriptor);
		} catch (error) {
			archiveWriteStream.destroy(error);
		}
	});
	try {
		archiveStream = params.createArchiveStream(reportProgress);
		const pipelinePromise = pipeline$1(archiveStream, progress, archiveWriteStream, { signal: controller.signal });
		reportProgress();
		await pipelinePromise;
		const currentIdentity = await fs$1.lstat(params.archivePath);
		if (!openedIdentity?.isFile() || !currentIdentity.isFile() || !sameFileIdentity(openedIdentity, currentIdentity)) throw new Error(`Backup archive path changed while writing: ${params.archivePath}`);
		return {
			archivePath: params.archivePath,
			identity: currentIdentity
		};
	} catch (err) {
		archiveWriteStream.destroy();
		let cleanupReceipt = openedIdentity ? {
			archivePath: params.archivePath,
			identity: openedIdentity
		} : void 0;
		if (!cleanupReceipt) try {
			const currentIdentity = fs.lstatSync(params.archivePath);
			cleanupReceipt = currentIdentity.isFile() ? {
				archivePath: params.archivePath,
				identity: currentIdentity
			} : { archivePath: params.archivePath };
		} catch (cleanupError) {
			if (cleanupError.code !== "ENOENT") cleanupReceipt = { archivePath: params.archivePath };
		}
		if (cleanupReceipt && (!cleanupReceipt.identity || !removePreparedBackupArchive(cleanupReceipt))) params.onPartialArchive(cleanupReceipt);
		throw idleTimeoutError ?? err;
	} finally {
		settled = true;
		if (idleTimer) clearTimeout(idleTimer);
	}
}
//#endregion
//#region src/infra/backup-archive-publication.ts
function pathsEqual(left, right) {
	const resolvedLeft = path.resolve(left);
	const resolvedRight = path.resolve(right);
	return process.platform === "win32" ? resolvedLeft.toLowerCase() === resolvedRight.toLowerCase() : resolvedLeft === resolvedRight;
}
async function assertTargetAbsent(targetPath) {
	try {
		await fs$1.lstat(targetPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	throw new Error(`Refusing to overwrite existing backup archive: ${targetPath}`);
}
async function removeDirectoryIfOwned(directoryPath, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(directoryPath).catch(() => void 0);
	if (!currentIdentity || !currentIdentity.isDirectory() || !sameFileIdentity(expectedIdentity, currentIdentity)) return false;
	try {
		await fs$1.rmdir(directoryPath);
		return true;
	} catch {
		return false;
	}
}
async function removeStagingDirectoryIfOwned(plan) {
	return await removeDirectoryIfOwned(plan.stagingDir, plan.stagingIdentity);
}
async function createBackupArchivePublication(outputPath) {
	const requestedOutputPath = path.resolve(outputPath);
	const requestedParentPath = path.dirname(requestedOutputPath);
	const canonicalParentPath = await fs$1.realpath(requestedParentPath);
	const parentIdentity = await fs$1.lstat(canonicalParentPath, { bigint: true });
	if (!parentIdentity.isDirectory()) throw new Error(`Backup output parent is not a directory: ${requestedParentPath}`);
	const canonicalOutputPath = path.join(canonicalParentPath, path.basename(requestedOutputPath));
	await assertTargetAbsent(canonicalOutputPath);
	const stagingDir = await fs$1.mkdtemp(path.join(canonicalParentPath, `.openclaw-backup-publish-${randomUUID()}-`));
	let stagingIdentity;
	try {
		stagingIdentity = await fs$1.lstat(stagingDir);
		await fs$1.chmod(stagingDir, 448);
		return {
			canonicalOutputPath,
			canonicalParentPath,
			parentReceipt: {
				path: canonicalParentPath,
				realPath: canonicalParentPath,
				identity: parentIdentity
			},
			pendingCleanupArchives: [],
			requestedOutputPath,
			requestedParentPath,
			stagingDir,
			stagingIdentity,
			tempArchivePath: path.join(stagingDir, "archive.tar.gz.tmp")
		};
	} catch (error) {
		if (stagingIdentity) await removeDirectoryIfOwned(stagingDir, stagingIdentity);
		throw error;
	}
}
function retainArchiveForCleanup(plan, receipt) {
	for (const [index, candidate] of plan.pendingCleanupArchives.entries()) {
		if (!pathsEqual(candidate.archivePath, receipt.archivePath)) continue;
		if (!candidate.identity || !receipt.identity) {
			if (!candidate.identity && receipt.identity) plan.pendingCleanupArchives[index] = receipt;
			return;
		}
		if (sameFileIdentity(candidate.identity, receipt.identity)) return;
	}
	plan.pendingCleanupArchives.push(receipt);
}
async function removePendingBackupArchive(plan, receipt) {
	if (!pathsEqual(path.dirname(receipt.archivePath), plan.stagingDir)) return false;
	if (receipt.identity) return removePreparedBackupArchive(receipt);
	let currentIdentity;
	try {
		currentIdentity = await fs$1.lstat(receipt.archivePath);
	} catch (error) {
		return error.code === "ENOENT";
	}
	if (!currentIdentity.isFile()) return false;
	return removePreparedBackupArchive({
		archivePath: receipt.archivePath,
		identity: currentIdentity
	});
}
async function cleanupBackupArchivePublication(plan, log) {
	const retainedArchives = plan.pendingCleanupArchives.splice(0);
	for (const receipt of retainedArchives) if (!await removePendingBackupArchive(plan, receipt)) retainArchiveForCleanup(plan, receipt);
	if (await removeStagingDirectoryIfOwned(plan)) {
		await syncDirectoryIfSupported(plan.canonicalParentPath).catch(() => void 0);
		return;
	}
	if (await fs$1.lstat(plan.stagingDir).catch(() => void 0)) log?.(`Backup archiver preserved changed or non-empty staging directory ${plan.stagingDir}.`);
}
async function publishPreparedBackupArchive(params) {
	const { plan, prepared } = params;
	let publicationPreserved = false;
	let committed = false;
	try {
		try {
			const publication = await publishFileExclusive({
				sourcePath: prepared.archivePath,
				targetPath: plan.canonicalOutputPath,
				expectedSourceIdentity: prepared.identity,
				parentReceipt: plan.parentReceipt,
				strategy: "link-required",
				onSyncFailure: "preserve"
			});
			publicationPreserved = true;
			requireDirectorySync(publication.directorySync, "Backup publication directory");
			committed = true;
		} catch (error) {
			const details = getPublishFileExclusiveFailureDetails(error);
			publicationPreserved ||= details?.cleanup === "preserved";
			if (error.code === "EEXIST") throw new Error(`Refusing to overwrite existing backup archive: ${plan.requestedOutputPath}`, { cause: error });
			if (isHardlinkFallbackError(error)) throw new Error(`Atomic backup publication requires hard-link support in ${plan.requestedParentPath}.`, { cause: error });
			if (error.code === "path-mismatch") throw new Error(`Backup archive changed during publication: ${plan.requestedOutputPath}`, { cause: error });
			throw error;
		}
		if (!removePreparedBackupArchive(prepared)) {
			retainArchiveForCleanup(plan, prepared);
			params.log?.(`Backup archiver preserved changed staging file ${prepared.archivePath}.`);
		}
		if (!await removeStagingDirectoryIfOwned(plan)) params.log?.(`Backup archiver preserved changed or non-empty staging directory ${plan.stagingDir}.`);
		await syncDirectoryIfSupported(plan.canonicalParentPath).catch((error) => {
			params.log?.(`Backup archiver could not sync cleanup in ${plan.canonicalParentPath}: ${error.code ?? String(error)}.`);
		});
	} catch (error) {
		if (!committed) {
			if (publicationPreserved) params.log?.(`Backup archiver preserved the final archive after publication failed: ${plan.requestedOutputPath}.`);
			if (!removePreparedBackupArchive(prepared)) retainArchiveForCleanup(plan, prepared);
			await removeStagingDirectoryIfOwned(plan);
		}
		throw error;
	}
}
//#endregion
//#region src/infra/backup-sqlite-source-groups.ts
function hasKnownIdentity(identity) {
	return process.platform !== "win32" || identity.dev !== 0 && identity.ino !== 0;
}
async function readRegularSidecar(pathname) {
	let identity;
	try {
		identity = await fs$1.lstat(pathname);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	}
	if (!identity.isFile()) throw new Error(`SQLite hardlink sidecar must be a regular file: ${pathname}`);
	return identity;
}
async function assertGroupPaths(group) {
	for (const source of group.sources) {
		const current = await fs$1.lstat(source.path);
		if (!current.isFile() || !sameFileIdentity(source.identity, current) || group.sources.length > 1 && !hasKnownIdentity(current) || await fs$1.realpath(source.path) !== source.path) throw new Error(`SQLite backup source identity changed: ${source.path}`);
		if (current.nlink !== group.sources.length) throw new Error(`SQLite hardlink journal owner may be outside the backup inventory: ${source.path} has ${current.nlink} links, but ${group.sources.length} paths were admitted. Include every database hardlink before retrying.`);
	}
}
async function readGroupWalOwners(group) {
	const owners = [];
	for (const source of group.sources) {
		const wal = await readRegularSidecar(`${source.path}-wal`);
		const journal = await readRegularSidecar(`${source.path}-journal`);
		await readRegularSidecar(`${source.path}-shm`);
		if (journal && journal.size > 0) throw new Error(`SQLite hardlink journal ownership cannot be established safely while a rollback journal is present: ${source.path}. Close the database cleanly before retrying.`);
		if (wal && wal.size > 0) {
			if (!hasKnownIdentity(wal)) throw new Error(`SQLite hardlink WAL identity cannot be verified: ${source.path}-wal`);
			owners.push({
				path: source.path,
				identity: wal
			});
		}
	}
	if (owners.length > 1) throw new Error(`Ambiguous SQLite hardlink journal ownership: multiple non-empty WAL files for ${group.sources.map((source) => source.path).join(", ")}. Close the database writers before retrying.`);
	return owners;
}
async function assertBackupSqliteSourceGroup(group) {
	await assertGroupPaths(group);
	if (group.sources.length === 1) return;
	const [owner] = await readGroupWalOwners(group);
	if (group.walIdentity ? !owner || owner.path !== group.sourcePath || !sameFileIdentity(group.walIdentity, owner.identity) : owner !== void 0) throw new Error(`SQLite hardlink journal ownership changed during backup: ${group.sourcePath}`);
	if (!sameFileMutationFingerprint(group.databaseFingerprint, await fs$1.stat(group.sourcePath, { bigint: true }))) throw new Error(`SQLite hardlink database changed during backup: ${group.sourcePath}. Close database writers cleanly before retrying.`);
}
/** Resolve journal ownership after canonical role validation and physical path resolution. */
async function planBackupSqliteSourceGroups(sources) {
	const groups = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const knownIdentity = hasKnownIdentity(source.identity);
		if (!knownIdentity && source.identity.nlink > 1) throw new Error(`SQLite hardlink identity cannot be verified: ${source.path}`);
		const key = knownIdentity ? `${source.identity.dev}:${source.identity.ino}` : source.path;
		const group = groups.get(key);
		if (group) {
			if (!group.sources.some((entry) => entry.path === source.path)) group.sources.push(source);
		} else groups.set(key, {
			sources: [source],
			sourcePath: source.path,
			walIdentity: null,
			databaseFingerprint: await fs$1.stat(source.path, { bigint: true })
		});
	}
	const byPath = /* @__PURE__ */ new Map();
	for (const group of groups.values()) {
		await assertGroupPaths(group);
		if (group.sources.length > 1) {
			const [owner] = await readGroupWalOwners(group);
			if (owner) {
				group.sourcePath = owner.path;
				group.walIdentity = owner.identity;
			}
		}
		for (const source of group.sources) byPath.set(source.path, group);
	}
	return byPath;
}
async function captureBackupSqliteSourceGroup(group, capture) {
	await assertBackupSqliteSourceGroup(group);
	await capture();
	await assertBackupSqliteSourceGroup(group);
}
//#endregion
//#region src/infra/state-migrations.audit-backup.ts
var LegacyAuditBackupStateChangedError = class extends Error {
	constructor(message = "Legacy audit state changed while backup was capturing it") {
		super(message);
		this.name = "LegacyAuditBackupStateChangedError";
	}
};
const LEGACY_AUDIT_RAW_CHECKPOINT_SCOPE = "migration.legacy-audit-raw";
function createLegacyAuditDatabaseWitness(database) {
	const rows = database.prepare(`SELECT scope, event_key, payload_json, created_at, sequence
       FROM diagnostic_events
       WHERE (scope IN (?, ?) AND event_key GLOB 'legacy:*') OR scope = ?
       ORDER BY scope, event_key, sequence`).all(CONFIG_AUDIT_SCOPE, SYSTEM_AGENT_AUDIT_SCOPE, LEGACY_AUDIT_RAW_CHECKPOINT_SCOPE);
	return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}
async function readLegacyAuditDatabaseWitness(stateDir) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => createLegacyAuditDatabaseWitness(db), { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} }) ?? createHash("sha256").digest("hex");
}
function legacyAuditBackupCapturesMatch(left, right) {
	return left.filesystemWitness === right.filesystemWitness && left.databaseWitness === right.databaseWitness;
}
/** Replaces live raw checkpoints with metadata for the transformed backup files. */
function rewriteLegacyAuditBackupCheckpoints(database, snapshots) {
	if (database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get("diagnostic_events")?.ok !== 1) return;
	const scope = "migration.legacy-audit-raw";
	database.prepare("DELETE FROM diagnostic_events WHERE scope = ?").run(scope);
	const insert = database.prepare(`INSERT INTO diagnostic_events (
        scope, event_key, payload_json, created_at, sequence
      ) VALUES (?, ?, ?, ?, ?)`);
	let sequence = 1;
	for (const snapshot of snapshots) {
		if (!snapshot.checkpoint) continue;
		insert.run(scope, snapshot.checkpoint.key, JSON.stringify(snapshot.checkpoint.value), 0, sequence);
		sequence += 1;
	}
}
async function createLegacyAuditBackupSnapshotsOnce(params) {
	const detected = detectLegacyAuditLogs({
		stateDir: params.stateDir,
		doctorOnlyStateMigrations: true
	});
	if (detected.sources.length === 0) return {
		snapshots: [],
		filesystemWitness: createHash("sha256").digest("hex")
	};
	const root$1 = await root(params.stateDir, {
		hardlinks: "reject",
		maxBytes: Number.MAX_SAFE_INTEGER,
		mkdir: false,
		mode: 384,
		symlinks: "reject"
	});
	const snapshots = [];
	const filesystemWitness = createHash("sha256");
	for (const [index, source] of detected.sources.entries()) {
		const sourceRelativePath = path.relative(path.resolve(params.stateDir), source.sourcePath);
		const snapshot = source.storage === "raw-archive" ? await readLegacyAuditRecoverySourceForBackup(root$1, sourceRelativePath) : await readLegacyAuditSourcePrefixSnapshotForBackup(root$1, sourceRelativePath);
		const sourceGeneration = legacyAuditSourceGenerationKey(sourceRelativePath);
		const previousCheckpoint = source.storage === "raw-archive" ? findPreviousLegacyAuditRawCheckpoint(params.stateDir, sourceRelativePath) : void 0;
		const prepared = prepareLegacyAuditRecords(source, snapshot.raw, sourceGeneration, previousCheckpoint?.recordOrdinalBase ?? 0);
		if (!prepared.ok) throw new Error(`Legacy ${source.label} append archive cannot be sanitized for backup: ${prepared.warnings.join("; ")}`);
		const sourcePath = path.join(params.tempDir, `legacy-audit-raw-${index}.jsonl`);
		await fs$1.writeFile(sourcePath, prepared.sanitizedJsonl, { mode: 384 });
		let checkpoint;
		if (previousCheckpoint) {
			if (previousCheckpoint.recordCount > prepared.records.length) throw new Error(`Legacy ${source.label} append archive is shorter than its durable checkpoint`);
			const transformedPrefix = Buffer.from(serializePreparedAuditRecords(prepared.records.slice(0, previousCheckpoint.recordCount)), "utf8");
			const value = {
				...previousCheckpoint,
				dev: 0,
				ino: 0,
				mtimeMs: 0,
				size: transformedPrefix.length,
				contentHash: createHash("sha256").update(transformedPrefix).digest("hex")
			};
			checkpoint = {
				key: legacyAuditRawCheckpointKey(value),
				value
			};
		}
		const backupSnapshot = {
			sourcePath,
			archiveSourcePath: source.sourcePath,
			...checkpoint ? { checkpoint } : {},
			skippedSourcePaths: /* @__PURE__ */ new Set([
				path.resolve(source.sourcePath),
				path.resolve(`${source.sourcePath}.doctor-scrub-progress`),
				path.resolve(`${source.sourcePath}.doctor-scrub-restore`),
				path.resolve(`${source.sourcePath}.doctor-scrub-staging`)
			])
		};
		const witnessMetadata = JSON.stringify([
			backupSnapshot.archiveSourcePath,
			snapshot.dev,
			snapshot.ino,
			snapshot.mtimeMs,
			snapshot.size,
			backupSnapshot.checkpoint
		]);
		for (const value of [witnessMetadata, prepared.sanitizedJsonl]) filesystemWitness.update(String(Buffer.byteLength(value))).update(":").update(value);
		snapshots.push(backupSnapshot);
	}
	return {
		snapshots,
		filesystemWitness: filesystemWitness.digest("hex")
	};
}
async function createLegacyAuditBackupCapture(params) {
	const capture = await createLegacyAuditBackupSnapshots(params);
	const databaseWitness = await readLegacyAuditDatabaseWitness(params.stateDir);
	return {
		...capture,
		databaseWitness
	};
}
async function createLegacyAuditBackupSnapshots(params) {
	let lastError;
	for (let attempt = 0; attempt < 3; attempt += 1) try {
		return await createLegacyAuditBackupSnapshotsOnce(params);
	} catch (error) {
		lastError = error;
		if (attempt < 2) await new Promise((resolve) => {
			setTimeout(resolve, 25);
		});
	}
	throw lastError;
}
//#endregion
//#region src/infra/backup-sqlite-snapshot.ts
function findLegacyAuditBackupStateChange(error) {
	return collectErrorGraphCandidates(error, (candidate) => candidate instanceof Error ? [candidate.cause] : []).find((candidate) => candidate instanceof LegacyAuditBackupStateChangedError);
}
function resolveSqliteBackupDatabasePath(sourcePath) {
	for (const suffix of SQLITE_SIDECAR_SUFFIXES) if (sourcePath.endsWith(suffix)) {
		const databasePath = sourcePath.slice(0, -suffix.length);
		return databasePath.endsWith(".sqlite") ? databasePath : void 0;
	}
	return sourcePath.endsWith(".sqlite") ? sourcePath : void 0;
}
function classifyBackupSqliteSource(sourcePath, inventory) {
	const resolvedSourcePath = path.resolve(sourcePath);
	const transient = isTransientSqliteBackupPath(resolvedSourcePath);
	const databasePath = resolveSqliteBackupDatabasePath(resolvedSourcePath);
	if (!transient && !databasePath) return;
	if (!(isPathWithin(resolvedSourcePath, inventory.stateDir) || inventory.agentRoots.some(({ sourcePath: agentRoot }) => isPathWithin(resolvedSourcePath, agentRoot))) || inventory.isPackageContent(resolvedSourcePath)) return;
	if (transient || !inventory.isIncluded(resolvedSourcePath)) return "excluded";
	if (isAppleDoubleMetadataFile(resolvedSourcePath)) return "excluded";
	const source = databasePath && inventory.resolveSqliteSource(databasePath);
	if (source && source.role === "unresolvable-link") return resolvedSourcePath === databasePath ? "opaque-skip" : "opaque";
	return source ? "sqlite" : "opaque";
}
async function discoverBackupSqliteSources(params) {
	const snapshotPaths = /* @__PURE__ */ new Set();
	const discoveredSourcePaths = /* @__PURE__ */ new Set();
	const visitedDirectories = /* @__PURE__ */ new Set();
	const gatewayLockDir = resolveGatewayLockDir(params.inventory.stateDir);
	async function visit(directoryPath) {
		const resolvedDirectoryPath = path.resolve(directoryPath);
		if (visitedDirectories.has(resolvedDirectoryPath)) return;
		visitedDirectories.add(resolvedDirectoryPath);
		let entries;
		try {
			entries = await fs$1.readdir(resolvedDirectoryPath, { withFileTypes: true });
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return;
			throw error;
		}
		for (const entry of entries) {
			const entryPath = path.join(resolvedDirectoryPath, entry.name);
			if (isPathWithin(entryPath, gatewayLockDir) || params.inventory.isVolatile(entryPath)) continue;
			if (entry.isDirectory()) {
				if (params.inventory.isTraversable(entryPath) && !params.inventory.isPackageContent(entryPath)) await visit(entryPath);
				continue;
			}
			if (!params.inventory.isIncluded(entryPath)) continue;
			if (!entry.isFile() && !entry.isSymbolicLink() || classifyBackupSqliteSource(entryPath, params.inventory) !== "sqlite") continue;
			discoveredSourcePaths.add(entryPath);
			if (entry.name.endsWith(".sqlite")) snapshotPaths.add(entryPath);
		}
	}
	await visit(params.inventory.stateDir);
	for (const { sourcePath } of params.inventory.agentRoots) await visit(sourcePath);
	for (const sourcePath of params.inventory.coreDatabaseSourcePaths) if (params.inventory.isIncluded(sourcePath)) {
		snapshotPaths.add(sourcePath);
		discoveredSourcePaths.add(sourcePath);
	}
	return {
		snapshotPaths: [...snapshotPaths].toSorted((left, right) => left.localeCompare(right)),
		discoveredSourcePaths
	};
}
async function planBackupSqliteSources(inventory, snapshotPaths) {
	const sources = [];
	for (const archiveSourcePath of snapshotPaths) {
		const identity = await fs$1.stat(archiveSourcePath);
		const owner = inventory.resolveSqliteSource(archiveSourcePath, identity);
		if (!owner || owner.role === "unresolvable-link") throw new Error(`SQLite ownership changed after discovery: ${archiveSourcePath}`);
		let canonicalSource;
		if (owner.role !== "plugin") {
			if (!owner.identity || !sameFileIdentity(owner.identity, identity)) throw new Error(`Canonical SQLite path changed after discovery: ${archiveSourcePath}`);
			canonicalSource = {
				...owner,
				archiveSourcePath: owner.sourcePath,
				sourcePath: await fs$1.realpath(owner.sourcePath),
				identity: owner.identity
			};
			assertNotUpdateCapturePath(canonicalSource.sourcePath, inventory.stateDir);
		}
		sources.push({
			archiveSourcePath,
			path: canonicalSource ? await fs$1.realpath(archiveSourcePath) : archiveSourcePath,
			identity,
			canonicalSource
		});
	}
	return {
		sources,
		groups: await planBackupSqliteSourceGroups(sources)
	};
}
async function createBackupSqliteSnapshotPlan(params) {
	const capturedSnapshots = /* @__PURE__ */ new Map();
	const snapshots = [];
	let capturedAgents = [];
	async function captureSource(archiveSourcePath, sourceGroup, canonicalSource) {
		if (!sourceGroup) throw new Error(`SQLite ownership changed after discovery: ${archiveSourcePath}`);
		if (canonicalSource && !sameFileIdentity(canonicalSource.identity, await fs$1.stat(archiveSourcePath))) throw new Error(`Canonical SQLite path changed after discovery: ${archiveSourcePath}`);
		const sourceDatabasePath = sourceGroup.sourcePath;
		assertNotUpdateCapturePath(archiveSourcePath, params.resources.stateDir);
		assertNotUpdateCapturePath(sourceDatabasePath, params.resources.stateDir);
		const sourcePath = path.join(params.tempDir, `openclaw-state-db-${snapshots.length}.sqlite`);
		try {
			const capture = () => createVerifiedSqliteSnapshot({
				sourcePath: sourceDatabasePath,
				targetPath: sourcePath,
				requireNonEmptySource: Boolean(canonicalSource),
				validate: canonicalSource?.role === "global" ? (database, pathname) => assertOpenClawStateDatabaseOwner(database, { pathname }) : canonicalSource?.role === "agent" ? (database, pathname) => assertOpenClawAgentDatabaseOwner(database, {
					agentId: canonicalSource.agentId,
					pathname
				}) : void 0,
				transform: async (database) => {
					if (canonicalSource?.role === "global") {
						capturedAgents = readOpenClawAgentDatabaseRegistryRows(database, canonicalSource.archiveSourcePath).map((row) => ({
							role: "agent",
							agentId: normalizeAgentId(row.agent_id),
							sourcePath: resolveOpenClawRegisteredAgentDatabasePath(canonicalSource.archiveSourcePath, row.path)
						}));
						if (params.legacyAuditDatabaseWitness !== void 0 && createLegacyAuditDatabaseWitness(database) !== params.legacyAuditDatabaseWitness) throw new LegacyAuditBackupStateChangedError("Legacy audit database rows changed during SQLite backup");
						sanitizeOpenClawGlobalStateSnapshot(database);
						rewriteLegacyAuditBackupCheckpoints(database, params.legacyAuditSnapshots);
					} else if (canonicalSource?.role === "agent") sanitizeOpenClawStateLeaseRows(database);
					await embedSessionColdArchivesInSnapshot({
						database,
						sourceStorePath: canonicalSource?.archiveSourcePath ?? sourceDatabasePath
					});
				}
			});
			const capturedPath = capturedSnapshots.get(sourceGroup);
			await captureBackupSqliteSourceGroup(sourceGroup, () => capturedPath ? fs$1.copyFile(capturedPath, sourcePath, fs$1.constants.COPYFILE_EXCL) : capture());
			capturedSnapshots.set(sourceGroup, sourcePath);
		} catch (error) {
			const stateChange = findLegacyAuditBackupStateChange(error);
			if (stateChange) throw stateChange;
			throw new Error(`SQLite database cannot be compacted safely for backup: ${archiveSourcePath}. ${formatErrorMessage(error)}. The source must pass full integrity checks, online SQLite backup, and offline compaction with its required SQLite capabilities; a direct file copy was refused because it can retain deleted data.`, { cause: error });
		}
		snapshots.push({
			sourcePath,
			archiveSourcePath,
			skippedSourcePaths: new Set([archiveSourcePath, sourceDatabasePath].flatMap((databasePath) => resolveSqliteDatabaseFilePaths(databasePath).map((pathname) => path.resolve(pathname))))
		});
	}
	const globalPath = resolveOpenClawStateSqlitePath({
		...process.env,
		OPENCLAW_STATE_DIR: params.resources.stateDir
	});
	const globalEntry = await fs$1.lstat(globalPath).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	});
	let globalIdentity;
	let globalGroup;
	if (globalEntry) {
		globalIdentity = globalEntry.isSymbolicLink() ? await fs$1.stat(globalPath) : globalEntry;
		if (!globalIdentity.isFile()) throw new Error(`Canonical global SQLite path must be a regular file or symlink to one: ${globalPath}`);
		const globalSource = {
			role: "global",
			archiveSourcePath: globalPath,
			sourcePath: await fs$1.realpath(globalPath),
			identity: globalIdentity
		};
		const globalInventory = sealBackupResourceInventory(params.resources, [{
			role: "global",
			sourcePath: globalPath,
			identity: globalIdentity
		}]);
		const { snapshotPaths } = await discoverBackupSqliteSources({ inventory: globalInventory });
		const { groups } = await planBackupSqliteSources(globalInventory, snapshotPaths.filter((sourcePath) => globalInventory.resolveSqliteSource(sourcePath)?.role === "global"));
		globalGroup = groups.get(globalSource.sourcePath);
		await captureSource(globalPath, globalGroup, globalSource);
	} else for (const sidecar of resolveSqliteDatabaseFilePaths(globalPath).slice(1)) if (await fs$1.lstat(sidecar).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	})) throw new Error(`Canonical global SQLite database is missing but a sidecar remains: ${sidecar}`);
	const coreDatabases = [{
		role: "global",
		sourcePath: globalPath,
		identity: globalIdentity
	}];
	for (const database of [{
		role: "quarantine",
		sourcePath: resolveQuarantineStorePath({
			...process.env,
			OPENCLAW_STATE_DIR: params.resources.stateDir
		})
	}, ...capturedAgents]) {
		const identity = await fs$1.stat(database.sourcePath).catch((error) => {
			if (hasErrnoCode(error, "ENOENT")) return;
			throw error;
		});
		if (identity && !identity.isFile()) throw new Error(`Core SQLite path must resolve to a regular file: ${database.sourcePath}`);
		coreDatabases.push(Object.freeze({
			...database,
			identity
		}));
	}
	const inventory = sealBackupResourceInventory(params.resources, coreDatabases);
	const discovery = await discoverBackupSqliteSources({ inventory });
	const { sources, groups } = await planBackupSqliteSources(inventory, discovery.snapshotPaths);
	for (const source of sources) if (source.archiveSourcePath !== globalPath) await captureSource(source.archiveSourcePath, source.canonicalSource?.role === "global" ? globalGroup : groups.get(source.path), source.canonicalSource);
	if (globalGroup) await assertBackupSqliteSourceGroup(globalGroup);
	for (const source of coreDatabases) if (source.identity && !sameFileIdentity(source.identity, await fs$1.stat(source.sourcePath))) throw new Error(`Canonical SQLite path changed after discovery: ${source.sourcePath}`);
	return {
		inventory,
		snapshots,
		discoveredSourcePaths: discovery.discoveredSourcePaths
	};
}
//#endregion
//#region src/infra/backup-tar-retry.ts
const BACKUP_TAR_MAX_ATTEMPTS = 3;
const BACKUP_TAR_BACKOFF_MS = [1e4, 2e4];
function resolveBackupTarAttemptTempPath(tempArchivePath, attempt) {
	return attempt === 1 ? tempArchivePath : `${tempArchivePath}.retry-${attempt}`;
}
async function writeTarArchiveWithRetry(params) {
	const sleepFn = params.sleepMs ?? sleep;
	let lastErr;
	let attempts = 0;
	for (let attempt = 1; attempt <= BACKUP_TAR_MAX_ATTEMPTS; attempt += 1) {
		attempts = attempt;
		const attemptTempArchivePath = resolveBackupTarAttemptTempPath(params.tempArchivePath, attempt);
		try {
			return await params.runTar(attemptTempArchivePath);
		} catch (err) {
			lastErr = err;
			if (!hasErrnoCode(err, "EOF") || attempt === BACKUP_TAR_MAX_ATTEMPTS) break;
			const backoff = BACKUP_TAR_BACKOFF_MS[attempt - 1] ?? 0;
			const offendingPath = err.path;
			params.log?.(`Backup archiver hit a live-write race${offendingPath ? ` on ${offendingPath}` : ""} (attempt ${attempt}/${BACKUP_TAR_MAX_ATTEMPTS}); retrying in ${Math.round(backoff / 1e3)}s.`);
			await sleepFn(backoff);
		}
	}
	const final = lastErr instanceof Error ? lastErr : new Error(String(lastErr));
	const offendingPath = lastErr?.path;
	const attemptSuffix = `after ${attempts} attempt${attempts === 1 ? "" : "s"}`;
	const suffix = offendingPath ? ` (last offending path: ${offendingPath}, ${attemptSuffix})` : ` (${attemptSuffix})`;
	throw new Error(`Backup archive write failed: ${final.message}${suffix}`, { cause: final });
}
//#endregion
//#region src/infra/backup-tar-walk.ts
/** Open sources before emitting headers so a vanished name cannot leave a partial entry. */
async function* walkBackupTar(params) {
	const noFollow = process.platform === "win32" ? 0 : constants.O_NOFOLLOW;
	const assertDirectory = async ({ sourcePath, stat }) => {
		const current = await fs$1.lstat(sourcePath);
		if (!current.isDirectory() || !sameFileIdentity(stat, current)) throw new Error(`Backup directory changed during traversal: ${sourcePath}`);
	};
	async function* visit(sourcePath, parent) {
		params.onProgress(sourcePath);
		if (params.skip(sourcePath)) return;
		let handle;
		let stat;
		let names;
		let linkpath;
		try {
			try {
				stat = await fs$1.lstat(sourcePath);
				if (parent) await assertDirectory(parent);
				if (!params.filter(sourcePath, stat)) return;
				if (stat.isDirectory()) {
					names = await fs$1.readdir(sourcePath);
					await assertDirectory({
						sourcePath,
						stat
					});
				} else if (stat.isSymbolicLink()) {
					linkpath = await fs$1.readlink(sourcePath);
					if (process.platform === "win32") linkpath = linkpath.replaceAll("\\", "/");
				} else if (stat.isFile()) {
					handle = await fs$1.open(sourcePath, constants.O_RDONLY | noFollow);
					const opened = await handle.stat();
					if (!opened.isFile()) throw new Error(`Backup source changed while opening: ${sourcePath}`);
					if (!noFollow) {
						const current = await fs$1.lstat(sourcePath).catch((error) => {
							if (hasErrnoCode(error, "ENOENT")) return;
							throw error;
						});
						if (current?.isSymbolicLink()) throw new Error(`Backup source became a symbolic link while opening: ${sourcePath}`);
						if (!sameFileIdentity(stat, opened) && (!current?.isFile() || !sameFileIdentity(current, opened))) throw new Error(`Backup source identity changed while opening: ${sourcePath}`);
					}
					stat = opened;
				} else return;
				if (parent) await assertDirectory(parent);
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
				params.onVanished(sourcePath);
				return;
			}
			const directory = stat.isDirectory();
			let mode = (stat.mode & 4095 | 384) & -19;
			if (directory) mode |= (mode & 292) >> 2;
			const header = {
				path: sourcePath,
				type: directory ? "Directory" : stat.isSymbolicLink() ? "SymbolicLink" : "File",
				mode,
				size: handle ? stat.size : 0,
				mtime: directory ? void 0 : stat.mtime,
				linkpath
			};
			params.onEntry(sourcePath, header);
			if (directory) header.path += "/";
			const block = Buffer.alloc(512);
			if (new params.tar.Header(header).encode(block)) yield new params.tar.Pax(header).encode();
			yield block;
			if (handle) {
				let position = 0;
				while (position < stat.size) {
					const buffer = Buffer.allocUnsafe(Math.min(1048576, stat.size - position));
					const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);
					if (!bytesRead) throw Object.assign(/* @__PURE__ */ new Error("encountered unexpected EOF"), {
						code: "EOF",
						path: sourcePath
					});
					position += bytesRead;
					params.onProgress(sourcePath, bytesRead);
					yield buffer.subarray(0, bytesRead);
				}
				const padding = (512 - stat.size % 512) % 512;
				if (padding) yield Buffer.alloc(padding);
			}
		} finally {
			await handle?.close();
		}
		for (const name of names ?? []) yield* visit(path.join(sourcePath, name), {
			sourcePath,
			stat
		});
		if (names && !parent) await assertDirectory({
			sourcePath,
			stat
		});
	}
	for (const sourcePath of params.paths) yield* visit(sourcePath);
	yield Buffer.alloc(1024);
}
//#endregion
//#region src/infra/backup-create.ts
const loadTarRuntime = createLazyRuntimeModule(() => import("tar"));
async function resolveOutputPath(params) {
	const basename = buildBackupArchiveBasename(params.nowMs);
	const rawOutput = params.output?.trim();
	if (!rawOutput) {
		const cwd = path.resolve(process.cwd());
		const canonicalCwd = await fs$1.realpath(cwd).catch(() => cwd);
		const defaultDir = params.includedAssets.some((asset) => isPathWithin(canonicalCwd, asset.sourcePath)) ? resolveHomeDir() ?? path.dirname(params.stateDir) : cwd;
		return path.resolve(defaultDir, basename);
	}
	const resolved = resolveUserPath(rawOutput);
	if (rawOutput.endsWith("/") || rawOutput.endsWith("\\")) return path.join(resolved, basename);
	try {
		if ((await fs$1.stat(resolved)).isDirectory()) return path.join(resolved, basename);
	} catch {}
	return resolved;
}
function formatBackupOutputFailure(error, outputPath, phase, ownedRoot) {
	const cause = phase === "write" && error instanceof Error ? error.cause : void 0;
	const filesystemError = isErrno(error) ? error : isErrno(cause) ? cause : null;
	if (!filesystemError) return error;
	if (ownedRoot) {
		const failedPath = filesystemError.path;
		if (typeof failedPath !== "string" || !isPathWithin(path.resolve(failedPath), ownedRoot)) return error;
	}
	const outputParent = path.dirname(outputPath);
	const retry = "run `openclaw backup create --output <archive>` again.";
	let detail;
	switch (filesystemError.code) {
		case "ENOENT":
			detail = `Backup output directory could not be created: ${outputParent}. Check the path and ${retry}`;
			break;
		case "EACCES":
		case "EPERM":
		case "EROFS":
			detail = `Backup output directory is not writable: ${outputParent}. Check the path and directory permissions, then ${retry}`;
			break;
		case "EEXIST":
		case "ENOTDIR":
			if (phase !== "parent") return error;
			detail = `Backup output parent is not a directory: ${outputParent}. Choose a directory path and ${retry}`;
			break;
		case "ENOSPC":
			detail = `The destination does not have enough free space: ${outputParent}. Free up disk space and ${retry}`;
			break;
		case "EDQUOT":
			detail = `The destination storage quota is exhausted: ${outputParent}. Free up space or choose another path, then ${retry}`;
			break;
		default: detail = `The output path could not be prepared: ${outputParent}. Check the path and filesystem, then ${retry}`;
	}
	return new Error(`Backup archive creation failed: ${outputPath}. ${detail}`, { cause: error });
}
async function assertOutputPathReady(outputPath) {
	try {
		await fs$1.access(outputPath);
		throw new Error(`Refusing to overwrite existing backup archive: ${outputPath}`);
	} catch (error) {
		const code = error?.code;
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw formatBackupOutputFailure(error, outputPath, "parent");
	}
}
async function prepareBackupOutputParent(outputPath) {
	try {
		await fs$1.mkdir(path.dirname(outputPath), { recursive: true });
	} catch (error) {
		throw formatBackupOutputFailure(error, outputPath, "parent");
	}
}
async function chooseBackupTempRoot(params) {
	const systemTmp = os.tmpdir();
	const canonicalSystemTmp = await canonicalizePathForContainment(systemTmp);
	if (!params.assets.some((asset) => isPathWithin(canonicalSystemTmp, asset.sourcePath))) return systemTmp;
	const fallback = path.dirname(params.outputPath);
	const canonicalFallback = await canonicalizePathForContainment(fallback);
	const fallbackInsideAsset = params.assets.find((asset) => isPathWithin(canonicalFallback, asset.sourcePath));
	if (fallbackInsideAsset) throw new Error(`Backup temp root cannot be placed outside every source path: ${systemTmp} and ${fallback} both overlap ${fallbackInsideAsset.sourcePath}.`);
	return fallback;
}
function buildManifest(result, plan) {
	return {
		schemaVersion: 1,
		createdAt: result.createdAt,
		archiveRoot: result.archiveRoot,
		runtimeVersion: resolveRuntimeServiceVersion(),
		platform: process.platform,
		nodeVersion: process.version,
		options: {
			includeWorkspace: result.includeWorkspace,
			onlyConfig: result.onlyConfig
		},
		paths: {
			stateDir: plan.resources.stateDir,
			configPath: plan.configPath,
			oauthDir: plan.oauthDir,
			workspaceDirs: plan.workspaceDirs,
			...result.agentRoots ? { agentRoots: [...result.agentRoots] } : {}
		},
		assets: result.assets.map((asset) => ({
			kind: asset.kind,
			sourcePath: asset.sourcePath,
			archivePath: asset.archivePath
		})),
		skipped: result.skipped.map((entry) => ({
			kind: entry.kind,
			sourcePath: entry.sourcePath,
			reason: entry.reason,
			coveredBy: entry.coveredBy
		}))
	};
}
const MAX_LEGACY_AUDIT_CAPTURE_ATTEMPTS = 3;
async function createConsistentStateSnapshotPlan(params) {
	if (params.onlyConfig) return {
		legacyAuditSnapshots: [],
		stateSqliteBackup: {
			inventory: sealBackupResourceInventory(params.resources, []),
			snapshots: [],
			discoveredSourcePaths: /* @__PURE__ */ new Set()
		}
	};
	if (!params.stateDir) return {
		legacyAuditSnapshots: [],
		stateSqliteBackup: await createBackupSqliteSnapshotPlan({
			resources: params.resources,
			tempDir: params.tempDir,
			legacyAuditSnapshots: []
		})
	};
	const stateDir = params.stateDir;
	if (!await hasLegacyAuditBackupSources(stateDir)) {
		const fastAttemptDir = path.join(params.tempDir, "state-snapshot-no-legacy");
		await fs$1.mkdir(fastAttemptDir, { recursive: true });
		const stateSqliteBackup = await createBackupSqliteSnapshotPlan({
			resources: params.resources,
			tempDir: fastAttemptDir,
			legacyAuditSnapshots: []
		});
		if (!await hasLegacyAuditBackupSources(stateDir)) return {
			legacyAuditSnapshots: [],
			stateSqliteBackup
		};
		await fs$1.rm(fastAttemptDir, {
			recursive: true,
			force: true
		});
	}
	let lastStateChangeMessage;
	for (let attempt = 0; attempt < MAX_LEGACY_AUDIT_CAPTURE_ATTEMPTS; attempt += 1) {
		const attemptDir = path.join(params.tempDir, `state-snapshot-attempt-${attempt + 1}`);
		const verificationDir = path.join(attemptDir, "legacy-verification");
		await fs$1.mkdir(attemptDir, { recursive: true });
		try {
			const firstCapture = await withLegacyAuditMigrationLease(stateDir, () => createLegacyAuditBackupCapture({
				stateDir,
				tempDir: attemptDir
			}));
			const stateSqliteBackup = await createBackupSqliteSnapshotPlan({
				resources: params.resources,
				tempDir: attemptDir,
				legacyAuditSnapshots: firstCapture.snapshots,
				legacyAuditDatabaseWitness: firstCapture.databaseWitness
			});
			await fs$1.mkdir(verificationDir, { recursive: true });
			if (!legacyAuditBackupCapturesMatch(firstCapture, await withLegacyAuditMigrationLease(stateDir, () => createLegacyAuditBackupCapture({
				stateDir,
				tempDir: verificationDir
			})))) throw new LegacyAuditBackupStateChangedError();
			await fs$1.rm(verificationDir, {
				recursive: true,
				force: true
			});
			return {
				legacyAuditSnapshots: firstCapture.snapshots,
				stateSqliteBackup
			};
		} catch (error) {
			await fs$1.rm(attemptDir, {
				recursive: true,
				force: true
			});
			if (!(error instanceof LegacyAuditBackupStateChangedError)) throw error;
			lastStateChangeMessage = error.message;
		}
	}
	throw new LegacyAuditBackupStateChangedError(`${lastStateChangeMessage ?? "Legacy audit state changed while backup was capturing it"}; retry backup after legacy audit migration settles`);
}
async function createBackupArchive(opts = {}) {
	const nowMs = resolveDateTimestampMs(opts.nowMs);
	const archiveRoot = buildBackupArchiveRoot(nowMs);
	const onlyConfig = Boolean(opts.onlyConfig);
	const includeWorkspace = onlyConfig ? false : opts.includeWorkspace ?? true;
	const plan = await resolveBackupPlanFromDisk({
		includeWorkspace,
		onlyConfig,
		nowMs
	});
	const outputPath = await resolveOutputPath({
		output: opts.output,
		nowMs,
		includedAssets: plan.included,
		stateDir: plan.stateDir
	});
	if (plan.included.length === 0) throw new Error(onlyConfig ? "No OpenClaw config file was found to back up." : "No local OpenClaw state was found to back up.");
	const canonicalOutputPath = await canonicalizePathForContainment(outputPath);
	const overlappingAsset = plan.included.find((asset) => isPathWithin(canonicalOutputPath, asset.sourcePath));
	if (overlappingAsset) throw new Error(`Backup output must not be written inside a source path: ${outputPath} is inside ${overlappingAsset.sourcePath}`);
	if (!opts.dryRun) await assertOutputPathReady(outputPath);
	const createdAt = new Date(nowMs).toISOString();
	const stateAsset = plan.included.find((asset) => asset.kind === "state");
	const stateDir = plan.resources.stateDir;
	const result = {
		createdAt,
		archiveRoot,
		archivePath: outputPath,
		dryRun: Boolean(opts.dryRun),
		includeWorkspace,
		onlyConfig,
		verified: false,
		assets: plan.included,
		...onlyConfig ? {} : { agentRoots: plan.resources.agentRoots.map(({ agentId, sourcePath }) => ({
			agentId,
			sourcePath
		})) },
		skipped: plan.skipped,
		skippedVolatileCount: 0
	};
	if (opts.dryRun) return result;
	await prepareBackupOutputParent(outputPath);
	const tempRoot = await chooseBackupTempRoot({
		assets: result.assets,
		outputPath
	});
	await fs$1.mkdir(tempRoot, { recursive: true });
	const maintenance = await maintainBackupScratch({
		roots: [tempRoot],
		repair: true,
		log: opts.log
	});
	if (maintenance.warnings.length) result.warnings = maintenance.warnings;
	for (const directory of maintenance.reclaimed) opts.log?.(`Removed abandoned backup scratch: ${directory}`);
	const scratch = await createBackupScratchDirectory(tempRoot);
	const tempDir = scratch.directory;
	let publication;
	try {
		publication = await createBackupArchivePublication(outputPath);
	} catch (error) {
		await finishBackupScratch(scratch, opts.log);
		throw formatBackupOutputFailure(error, outputPath, "publication");
	}
	const tempArchivePath = publication.tempArchivePath;
	let snapshotFacts = [];
	try {
		const configRemaps = await stageBackupConfigCapture(plan.configCapture, tempDir);
		const { legacyAuditSnapshots, stateSqliteBackup } = await createConsistentStateSnapshotPlan({
			resources: plan.resources,
			stateDir: stateAsset?.sourcePath,
			tempDir,
			onlyConfig
		});
		const inventory = stateSqliteBackup.inventory;
		snapshotFacts = describeCapturedBackupSqliteSnapshots(inventory, stateSqliteBackup.snapshots.map((snapshot) => snapshot.archiveSourcePath));
		const sourcePathRemaps = new Map(configRemaps);
		const skippedStateSourcePaths = new Set(configRemaps.values());
		if (plan.configCapture?.files.length === 0) {
			skippedStateSourcePaths.add(path.resolve(plan.configPath));
			skippedStateSourcePaths.add(await canonicalizePathForContainment(plan.configPath));
		}
		for (const snapshot of stateSqliteBackup.snapshots) {
			sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
			for (const skippedSourcePath of snapshot.skippedSourcePaths) skippedStateSourcePaths.add(skippedSourcePath);
		}
		for (const snapshot of legacyAuditSnapshots) {
			sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
			for (const skippedSourcePath of snapshot.skippedSourcePaths) skippedStateSourcePaths.add(skippedSourcePath);
		}
		const requiredSourcePaths = /* @__PURE__ */ new Set([...sourcePathRemaps.keys(), ...result.assets.map((asset) => asset.sourcePath)]);
		const externalSymbolicLinks = [];
		const tar = await loadTarRuntime();
		const gatewayLockDir = resolveGatewayLockDir(plan.stateDir);
		const skippedEntries = /* @__PURE__ */ new Map();
		const opaqueSqliteSourcePaths = /* @__PURE__ */ new Map();
		const tarFilter = (entryPath, entryStat) => {
			const resolvedEntryPath = path.resolve(entryPath);
			if (isUpdateCapturePath(sourcePathRemaps.get(resolvedEntryPath) ?? resolvedEntryPath, plan.stateDir)) return false;
			const isDirectory = entryStat.isDirectory();
			if (!onlyConfig && !(isDirectory ? inventory.isTraversable(resolvedEntryPath) : inventory.isIncluded(resolvedEntryPath))) return false;
			if (isPathWithin(resolvedEntryPath, gatewayLockDir)) return false;
			if (stateAsset && isLegacyAuditMigrationBackupPath(resolvedEntryPath, stateAsset.sourcePath)) return false;
			const sqliteSourceKind = onlyConfig ? void 0 : classifyBackupSqliteSource(resolvedEntryPath, inventory);
			if (sqliteSourceKind === "opaque-skip") {
				opaqueSqliteSourcePaths.set(resolvedEntryPath, "skipped");
				return false;
			}
			if (sqliteSourceKind === "excluded") return false;
			if (sqliteSourceKind === "sqlite" && (entryStat.isFile() || entryStat.isSymbolicLink())) throw new Error(`SQLite state appeared after snapshot discovery: ${entryPath}. Retry backup so it can be snapshotted.`);
			if (sqliteSourceKind === "opaque" && entryStat.isFile()) opaqueSqliteSourcePaths.set(resolvedEntryPath, "archived");
			return true;
		};
		const completedArchive = await writeTarArchiveWithRetry({
			tempArchivePath,
			log: opts.log,
			runTar: async (attemptTempArchivePath) => {
				for (const [sourcePath, reason] of skippedEntries) if (reason === "volatile") skippedEntries.delete(sourcePath);
				externalSymbolicLinks.length = 0;
				opaqueSqliteSourcePaths.clear();
				const prepared = await writeArchiveStreamToFile({
					archivePath: attemptTempArchivePath,
					createArchiveStream: (reportProgress) => appendBackupManifest(walkBackupTar({
						tar,
						paths: [...requiredSourcePaths],
						skip: (sourcePath) => {
							if (!requiredSourcePaths.has(sourcePath) && inventory.isVolatile(sourcePath)) {
								skippedEntries.set(sourcePath, "volatile");
								return true;
							}
							return skippedStateSourcePaths.has(sourcePath) || stateSqliteBackup.discoveredSourcePaths.has(sourcePath);
						},
						filter: tarFilter,
						onVanished: (sourcePath) => {
							if (requiredSourcePaths.has(sourcePath)) throw new Error(`Required backup source disappeared: ${sourcePath}`);
							opaqueSqliteSourcePaths.delete(sourcePath);
							skippedEntries.set(sourcePath, "vanished");
						},
						onProgress: (entryPath, bytes) => reportProgress({
							phase: bytes === void 0 ? "traversal" : "raw",
							entryPath,
							bytes
						}),
						onEntry: (sourcePath, header) => {
							skippedEntries.delete(sourcePath);
							const archiveEntryPath = buildBackupArchivePath(archiveRoot, sourcePathRemaps.get(sourcePath) ?? sourcePath);
							if (header.type === "SymbolicLink") {
								const { external, ...link } = recordArchiveSymbolicLink({
									archiveRoot,
									entryPath: archiveEntryPath,
									linkpath: header.linkpath,
									platform: process.platform,
									state: {
										sourcePath: stateDir,
										archivePath: buildBackupArchivePath(archiveRoot, stateDir)
									},
									hasExternalLinkReport: true,
									assets: result.assets
								});
								if (external) externalSymbolicLinks.push(link);
							}
							header.path = archiveEntryPath;
						}
					}), () => {
						result.skipped = [...plan.skipped, ...[...skippedEntries].map(([sourcePath, reason]) => ({
							kind: "entry",
							sourcePath,
							displayPath: sourcePath,
							reason
						}))];
						const manifest = buildManifest({
							...result,
							skipped: plan.skipped
						}, plan);
						manifest.externalSymbolicLinks = externalSymbolicLinks;
						const contents = Buffer.from(JSON.stringify(manifest, null, 2) + "\n");
						const sizeError = backupManifestSizeError(contents.length);
						if (sizeError) throw sizeError;
						const header = Buffer.alloc(512);
						new tar.Header({
							path: archiveRoot + "/manifest.json",
							type: "File",
							mode: 420,
							size: contents.length
						}).encode(header);
						return Buffer.concat([
							header,
							contents,
							Buffer.alloc((512 - contents.length % 512) % 512 + 1024)
						]);
					}),
					onPartialArchive: (partialArchive) => {
						publication.pendingCleanupArchives.push(partialArchive);
					}
				});
				try {
					await plan.configCapture?.assertRootAlias?.();
				} catch (error) {
					if (!removePreparedBackupArchive(prepared)) publication.pendingCleanupArchives.push(prepared);
					throw error;
				}
				return prepared;
			}
		}).catch((error) => {
			throw formatBackupOutputFailure(error, outputPath, "write", publication.stagingDir);
		});
		const skippedVolatileCount = [...skippedEntries.values()].filter((reason) => reason === "volatile").length;
		result.skippedVolatileCount = skippedVolatileCount;
		const vanishedWarnings = [...skippedEntries].filter(([, reason]) => reason === "vanished").map(([sourcePath]) => `Skipped vanished entry (ENOENT): ${sourcePath}`);
		if (opaqueSqliteSourcePaths.size) result.warnings = [...result.warnings ?? [], ...[...opaqueSqliteSourcePaths].toSorted(([left], [right]) => left.localeCompare(right)).map(([sourcePath, action]) => action === "skipped" ? `Skipped unresolvable opaque SQLite link: ${sourcePath}` : `SQLite file archived as opaque bytes without a live snapshot or integrity checks: ${sourcePath}`)];
		if (vanishedWarnings.length) result.warnings = [...result.warnings ?? [], ...vanishedWarnings];
		if (externalSymbolicLinks.length) result.externalSymbolicLinks = externalSymbolicLinks;
		if (skippedVolatileCount > 0) opts.log?.(`Backup skipped ${skippedVolatileCount} volatile file${skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, managed runtime paths, sockets, pid/tmp).`);
		try {
			await publishPreparedBackupArchive({
				plan: publication,
				prepared: completedArchive,
				log: opts.log
			});
		} catch (error) {
			throw formatBackupOutputFailure(error, outputPath, "publication");
		}
	} finally {
		try {
			await cleanupBackupArchivePublication(publication, opts.log);
		} finally {
			const warning = await finishBackupScratch(scratch, opts.log);
			if (warning) result.warnings = [...result.warnings ?? [], warning];
		}
	}
	opts.onSqliteSnapshots?.(snapshotFacts);
	return result;
}
//#endregion
export { createBackupArchive as t };
