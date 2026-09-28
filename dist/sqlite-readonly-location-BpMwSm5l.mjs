import { d as sameFileIdentity$1, u as sameFileContentsSync } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as requireNodeSqlite, s as resolveSqliteFilesystemPath, t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { f as withSqliteInspectionOperation } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { i as runWithSqliteCoordinator, n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { c as removeTempDirectoryAsync, n as adoptPreparedLocation, s as removeTempDirectory, u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { n as createSqliteSnapshotStagingDirectory, o as sqliteSnapshotStagingError, r as createSqliteSnapshotStagingDirectorySync, u as resolvePrivateSqliteSnapshotStagingRoot } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-CUXsFwAM.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { r as configureSqliteReadOnlyPragmas } from "./sqlite-wal-BzoPsBh0.mjs";
import { i as withSqliteSourceReadDatabase, n as withSqliteSourceHandle, r as withSqliteSourceHandleAsync } from "./sqlite-source-handle-C0wvRR5v.mjs";
import fs from "node:fs";
import path from "node:path";
import { copyFileDescriptorSync, readFileWindowFullySync } from "@openclaw/fs-safe/advanced";
//#region src/infra/sqlite-backup.ts
async function backupNodeSqliteDatabase(source, targetPath) {
	const checkpoint = setInterval(() => {}, 100);
	try {
		return await requireNodeSqlite().backup(source, resolveSqliteFilesystemPath(targetPath));
	} finally {
		clearInterval(checkpoint);
	}
}
//#endregion
//#region src/infra/sqlite-schema-header.ts
function readSqliteWriterAppVersion(database) {
	try {
		const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").select("app_version").where("meta_key", "=", "primary").limit(1));
		return typeof row?.app_version === "string" && row.app_version.length > 0 ? row.app_version : void 0;
	} catch {
		return;
	}
}
/** Read version and requested ownership facts from one fresh transaction, including WAL. */
function readSqliteSchemaHeader(database, agentSchemaVersionForOwnership) {
	configureSqliteReadOnlyPragmas(database);
	return runSqliteDeferredTransactionSync(database, () => {
		const userVersion = readSqliteUserVersion(database);
		const writerAppVersion = readSqliteWriterAppVersion(database);
		return {
			userVersion,
			...writerAppVersion ? { writerAppVersion } : {},
			...agentSchemaVersionForOwnership !== void 0 && userVersion <= agentSchemaVersionForOwnership ? { agentSchemaMeta: readExistingAgentSchemaMeta(database) } : {}
		};
	});
}
function readSqliteSchemaHeaderSnapshot(location, signal, agentSchemaVersionForOwnership) {
	signal?.throwIfAborted();
	const database = openNodeSqliteDatabase(location, { readOnly: true });
	return runWithSqliteCoordinator({ release: () => database.close() }, "SQLite schema header read", () => {
		setSqliteBusyTimeout(database, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		return readSqliteSchemaHeader(database, agentSchemaVersionForOwnership);
	});
}
/** Consume a private snapshot and retain both read and cleanup failures. */
function readSqliteSchemaHeaderFromSnapshot(prepared, signal, agentSchemaVersionForOwnership) {
	return runWithSqliteCoordinator({ release: () => {
		if (!prepared.cleanup()) throw new Error(`SQLite read-only worker snapshot cleanup failed: ${prepared.location}`);
	} }, "SQLite schema header snapshot", () => readSqliteSchemaHeaderSnapshot(prepared.location, signal, agentSchemaVersionForOwnership));
}
const SNAPSHOT_RETRY_BASE_MS = 10;
const SNAPSHOT_RETRY_MAX_MS = 80;
function sourceFileSize(pathname) {
	try {
		const stat = fs.statSync(pathname);
		return stat.isFile() ? stat.size : 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function abortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("SQLite snapshot aborted");
}
async function sleepForSnapshot(ms, signal) {
	signal?.throwIfAborted();
	await new Promise((resolve, reject) => {
		const timer = setTimeout(finish, ms);
		const abort = () => finish(signal ? abortReason(signal) : void 0);
		function finish(error) {
			clearTimeout(timer);
			signal?.removeEventListener("abort", abort);
			if (error) reject(error);
			else resolve();
		}
		signal?.addEventListener("abort", abort, { once: true });
		if (signal?.aborted) abort();
	});
}
function snapshotRetryDelayMs(attempt) {
	if (attempt + 1 >= 10) return 0;
	return Math.min(SNAPSHOT_RETRY_MAX_MS, SNAPSHOT_RETRY_BASE_MS * 2 ** attempt);
}
function waitForSnapshotRetrySync(attempt) {
	const delayMs = snapshotRetryDelayMs(attempt);
	if (delayMs > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
}
async function waitForSnapshotRetry(attempt, signal) {
	signal?.throwIfAborted();
	const delayMs = snapshotRetryDelayMs(attempt);
	if (delayMs > 0) await sleepForSnapshot(delayMs, signal);
}
function createSnapshotAttemptReporter(pathname, attempt, started) {
	return (operation, outcome, prepared, error) => {
		try {
			getChildLogger({ subsystem: "infra/sqlite-snapshot" }).debug({
				attempt: attempt + 1,
				copiedBytes: prepared ? fs.statSync(prepared.location).size : 0,
				durationMs: Math.max(0, performance.now() - started),
				operation,
				outcome,
				sourceMainBytes: sourceFileSize(pathname),
				sourceWalBytes: sourceFileSize(`${pathname}-wal`),
				owner: "path-reader",
				errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : void 0
			}, "SQLite snapshot operation completed.");
		} catch {}
	};
}
//#endregion
//#region src/infra/sqlite-snapshot-wal-prefix.ts
const WAL_HEADER_BYTES = 32;
const COPY_BUFFER_BYTES = 1048576;
function readWalGeneration(descriptor) {
	const header = Buffer.alloc(WAL_HEADER_BYTES);
	if (readFileWindowFullySync(descriptor, header, 0) !== header.length) return;
	const magic = header.readUInt32BE(0);
	return magic === 931071618 || magic === 931071619 ? header : void 0;
}
function matchesCapturedWalPrefix(source, destination, bytes) {
	const copy = fs.openSync(destination, "r");
	try {
		const stat = fs.fstatSync(copy);
		if (!stat.isFile() || stat.size !== bytes) return false;
		const sourceBuffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, bytes));
		const copyBuffer = Buffer.allocUnsafe(sourceBuffer.length);
		for (let position = 0; position < bytes; position += sourceBuffer.length) {
			const length = Math.min(sourceBuffer.length, bytes - position);
			const sourceWindow = sourceBuffer.subarray(0, length);
			const copyWindow = copyBuffer.subarray(0, length);
			if (readFileWindowFullySync(source, sourceWindow, position) !== length || readFileWindowFullySync(copy, copyWindow, position) !== length || !sourceWindow.equals(copyWindow)) return false;
		}
		return true;
	} finally {
		fs.closeSync(copy);
	}
}
/** Preserve source coordination bytes while SQLite interprets a bounded private WAL. */
function copySqliteWalPrefixSync(source, destination, copyMain, verifyMainCopy) {
	const generation = readWalGeneration(source);
	if (!generation) return;
	copyMain();
	const walBytes = fs.fstatSync(source).size;
	if (!Number.isSafeInteger(walBytes) || walBytes < generation.length) return false;
	const target = fs.openSync(destination, "wx", 384);
	try {
		const buffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, walBytes));
		for (let position = 0; position < walBytes;) {
			const window = buffer.subarray(0, Math.min(buffer.length, walBytes - position));
			if (readFileWindowFullySync(source, window, position) !== window.length) return false;
			if (position === 0 && !window.subarray(0, generation.length).equals(generation)) return false;
			for (let offset = 0; offset < window.length;) {
				const written = fs.writeSync(target, window, offset, window.length - offset, position + offset);
				if (written <= 0) throw new Error("SQLite WAL snapshot write made no progress");
				offset += written;
			}
			position += window.length;
		}
		fs.fsyncSync(target);
	} finally {
		fs.closeSync(target);
	}
	return verifyMainCopy() && matchesCapturedWalPrefix(source, destination, walBytes) && readWalGeneration(source)?.equals(generation) === true;
}
//#endregion
//#region src/infra/sqlite-readonly-location.ts
const SQLITE_HEADER_BYTES = 20;
const SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS = 3e4;
const SQLITE_READONLY_RESULT_CODE = 8;
const SQLITE_RESULT_CODE_MASK = 255;
const SQLITE_JOURNAL_MAGIC = Buffer.from([
	217,
	213,
	5,
	249,
	32,
	161,
	99,
	215
]);
var SqliteSourceChangedError = class extends Error {};
function statIfPresent(pathname) {
	try {
		return fs.statSync(pathname, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readSourceSidecars(pathname) {
	return {
		journal: Boolean(statIfPresent(`${pathname}-journal`)),
		shm: Boolean(statIfPresent(`${pathname}-shm`)),
		wal: Boolean(statIfPresent(`${pathname}-wal`))
	};
}
function sameSidecars(left, right) {
	return left.journal === right.journal && left.shm === right.shm && left.wal === right.wal;
}
function openPinnedFile(pathname) {
	let descriptor;
	try {
		descriptor = fs.openSync(pathname, "r");
	} catch (error) {
		if (error.code === "ENOENT") throw new SqliteSourceChangedError(`SQLite source disappeared: ${pathname}`);
		throw error;
	}
	try {
		const identity = fs.fstatSync(descriptor, { bigint: true });
		const current = statIfPresent(pathname);
		if (!identity.isFile() || !current?.isFile() || !sameFileIdentity$1(identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while opening: ${pathname}`);
		return {
			descriptor,
			identity,
			pathname
		};
	} catch (error) {
		fs.closeSync(descriptor);
		throw error;
	}
}
function readSourceJournalMode(pathname) {
	const source = openPinnedFile(pathname);
	try {
		const header = Buffer.alloc(SQLITE_HEADER_BYTES);
		const bytesRead = fs.readSync(source.descriptor, header, 0, header.length, 0);
		const confirmedHeader = Buffer.alloc(SQLITE_HEADER_BYTES);
		const confirmedBytesRead = fs.readSync(source.descriptor, confirmedHeader, 0, confirmedHeader.length, 0);
		assertPinnedIdentityUnchanged(source);
		if (bytesRead === 0 && confirmedBytesRead === 0) return "empty";
		if (bytesRead !== header.length || confirmedBytesRead !== confirmedHeader.length || !header.equals(confirmedHeader) || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") return "unknown";
		return header[18] === 2 || header[19] === 2 ? "wal" : "rollback";
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function assertPinnedIdentityUnchanged(file) {
	const opened = fs.fstatSync(file.descriptor, { bigint: true });
	const current = statIfPresent(file.pathname);
	if (!opened.isFile() || !current?.isFile() || !sameFileIdentity$1(file.identity, opened) || !sameFileIdentity$1(file.identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while copying: ${file.pathname}`);
}
function copyPinnedFile(source, targetPath) {
	let target;
	try {
		target = fs.openSync(targetPath, "wx", 384);
		copyFileDescriptorSync(source.descriptor, target);
		fs.fsyncSync(target);
		assertPinnedIdentityUnchanged(source);
	} finally {
		if (target !== void 0) fs.closeSync(target);
	}
}
function copySourceFile(sourcePath, targetPath) {
	const source = openPinnedFile(sourcePath);
	try {
		copyPinnedFile(source, targetPath);
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function sourceMatchesCopy(sourcePath, copyPath) {
	const source = openPinnedFile(sourcePath);
	let copy;
	try {
		copy = fs.openSync(copyPath, "r");
		if (!fs.fstatSync(copy).isFile()) return false;
		const equal = sameFileContentsSync(source.descriptor, copy);
		assertPinnedIdentityUnchanged(source);
		return equal;
	} finally {
		try {
			if (copy !== void 0) fs.closeSync(copy);
		} finally {
			fs.closeSync(source.descriptor);
		}
	}
}
function assertExpectedSidecars(pathname, expected) {
	if (!sameSidecars(readSourceSidecars(pathname), expected)) throw new SqliteSourceChangedError(`SQLite journal state changed while copying: ${pathname}`);
}
function replaceFile(sourcePath, targetPath) {
	fs.rmSync(targetPath, { force: true });
	fs.renameSync(sourcePath, targetPath);
}
function isSqliteReadOnlyError(error) {
	let current = error;
	for (let depth = 0; depth < 8 && current && typeof current === "object"; depth += 1) {
		const details = current;
		if (typeof details.errcode === "number" && (details.errcode & SQLITE_RESULT_CODE_MASK) === SQLITE_READONLY_RESULT_CODE) return true;
		current = details.cause;
	}
	return false;
}
function rollbackJournalReferencesSuperJournal(journalPath) {
	const descriptor = fs.openSync(journalPath, "r");
	try {
		const size = fs.fstatSync(descriptor).size;
		if (size < 16) return false;
		const trailer = Buffer.allocUnsafe(16);
		if (fs.readSync(descriptor, trailer, 0, trailer.length, size - trailer.length) !== trailer.length) return false;
		const nameBytes = trailer.readUInt32BE(0);
		return nameBytes > 0 && nameBytes <= size - 20 && trailer.subarray(8).equals(SQLITE_JOURNAL_MAGIC);
	} finally {
		fs.closeSync(descriptor);
	}
}
function recoverPrivateJournalCopy(snapshotPath) {
	if (rollbackJournalReferencesSuperJournal(`${snapshotPath}-journal`)) throw new Error(`SQLite hot rollback journal references a super-journal and cannot be recovered privately: ${snapshotPath}`);
	const snapshot = openNodeSqliteDatabase(snapshotPath);
	try {
		snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
		snapshot.prepare("PRAGMA schema_version;").get();
	} finally {
		snapshot.close();
	}
	fs.rmSync(`${snapshotPath}-journal`, { force: true });
	const descriptor = fs.openSync(snapshotPath, "r+");
	try {
		fs.fsyncSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
}
function publishPreparedCopy(directory) {
	const location = path.join(directory, "database.sqlite");
	for (const suffix of [
		"-wal",
		"-shm",
		"-journal",
		""
	]) {
		const staged = `${location}.partial${suffix}`;
		if (fs.existsSync(staged)) fs.renameSync(staged, `${location}${suffix}`);
	}
	return adoptPreparedLocation(location, directory);
}
function createStableReadOnlyCopyInTempDirectory(pathname, journalMode, existingTempDir, stagingRoot = existingTempDir ? path.dirname(existingTempDir) : resolvePrivateSqliteSnapshotStagingRoot()) {
	let tempDir = existingTempDir;
	try {
		tempDir ??= createSqliteSnapshotStagingDirectorySync(stagingRoot);
		const snapshotPath = path.join(tempDir, "database.sqlite.partial");
		const firstPath = path.join(tempDir, "first");
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed before copying: ${pathname}`);
		const sidecars = readSourceSidecars(pathname);
		let copiedWalPrefix = false;
		if (journalMode === "wal" && sidecars.wal && !sidecars.journal) {
			const wal = openPinnedFile(`${pathname}-wal`);
			try {
				const copied = copySqliteWalPrefixSync(wal.descriptor, `${snapshotPath}-wal`, () => copySourceFile(pathname, snapshotPath), () => sourceMatchesCopy(pathname, snapshotPath));
				assertPinnedIdentityUnchanged(wal);
				if (copied === false) throw new SqliteSourceChangedError(`SQLite WAL generation changed while copying: ${pathname}`);
				copiedWalPrefix = copied === true;
			} finally {
				fs.closeSync(wal.descriptor);
			}
		}
		const sidecarSuffixes = [...sidecars.journal ? ["-journal"] : [], ...sidecars.wal ? ["-wal"] : []];
		if (copiedWalPrefix) assertExpectedSidecars(pathname, sidecars);
		else if (sidecarSuffixes.length > 0) {
			for (const suffix of sidecarSuffixes) copySourceFile(`${pathname}${suffix}`, `${snapshotPath}${suffix}`);
			copySourceFile(pathname, snapshotPath);
			for (const suffix of sidecarSuffixes) if (!sourceMatchesCopy(`${pathname}${suffix}`, `${snapshotPath}${suffix}`)) throw new SqliteSourceChangedError(`SQLite ${suffix === "-wal" ? "WAL" : "rollback journal"} changed while copying: ${pathname}`);
			assertExpectedSidecars(pathname, sidecars);
		} else {
			copySourceFile(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			const mainUnchanged = sourceMatchesCopy(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			if (!mainUnchanged) throw new SqliteSourceChangedError(`SQLite main database changed while copying: ${pathname}`);
			replaceFile(firstPath, snapshotPath);
		}
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed while copying: ${pathname}`);
		if (sidecars.journal) recoverPrivateJournalCopy(snapshotPath);
		return publishPreparedCopy(tempDir);
	} catch (error) {
		if (tempDir && existingTempDir === void 0) removeTempDirectory(tempDir);
		throw sqliteSnapshotStagingError(tempDir ?? stagingRoot, error, !tempDir);
	}
}
async function createStableReadOnlyCopy(pathname, journalMode, stagingRoot, signal) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	try {
		return createStableReadOnlyCopyInTempDirectory(pathname, journalMode, tempDir);
	} catch (error) {
		await removeTempDirectoryAsync(tempDir);
		throw error;
	}
}
/** Native reads may create WAL-index files; callers need an isolated child or a private source. */
async function createOnlineReadOnlyBackup(pathname, stagingRoot, signal) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	const snapshotPath = path.join(tempDir, "database.sqlite.partial");
	try {
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		const source = withSqliteInspectionOperation("source", () => openNodeSqliteDatabase(pathname, { readOnly: true }));
		try {
			source.exec(`PRAGMA busy_timeout = ${SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS}; PRAGMA trusted_schema = OFF; BEGIN;`);
			source.prepare("PRAGMA schema_version;").get();
			await retainSnapshotWork(backupNodeSqliteDatabase(source, snapshotPath));
			source.exec("ROLLBACK;");
		} finally {
			if (source.isOpen) source.close();
		}
		const snapshot = openNodeSqliteDatabase(snapshotPath);
		try {
			snapshot.exec("PRAGMA journal_mode = DELETE;");
		} finally {
			snapshot.close();
		}
		const descriptor = fs.openSync(snapshotPath, "r+");
		try {
			fs.fsyncSync(descriptor);
		} finally {
			fs.closeSync(descriptor);
		}
		return publishPreparedCopy(tempDir);
	} catch (error) {
		await removeTempDirectoryAsync(tempDir);
		throw sqliteSnapshotStagingError(tempDir, error);
	}
}
/**
* Active rollback and WAL state use SQLite's locking and backup protocol.
* Crash residue that cannot be opened read-only is copied and recovered
* privately so inspection never mutates coordination files beside the source.
* In-process reads require drained source handles or a separate child: source
* close() must not release another live SQLite owner's POSIX locks.
*/
async function prepareReadOnlySourceInProcess(pathname, stagingRoot, signal) {
	signal?.throwIfAborted();
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const started = performance.now();
		const report = createSnapshotAttemptReporter(canonicalPath, attempt, started);
		let journalMode;
		try {
			journalMode = readSourceJournalMode(canonicalPath);
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		if (journalMode === "empty") try {
			const prepared = await createStableReadOnlyCopy(canonicalPath, journalMode, stagingRoot, signal);
			report("raw-copy", "success", prepared);
			return prepared;
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) {
				report("raw-copy", "error", void 0, error);
				throw error;
			}
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		const sidecars = readSourceSidecars(canonicalPath);
		if (journalMode !== "wal" || sidecars.wal && sidecars.shm) try {
			const prepared = await createOnlineReadOnlyBackup(canonicalPath, stagingRoot, signal);
			report("online-backup", "success", prepared);
			return prepared;
		} catch (error) {
			signal?.throwIfAborted();
			let currentMode;
			try {
				currentMode = readSourceJournalMode(canonicalPath);
			} catch (inspectionError) {
				if (!(inspectionError instanceof SqliteSourceChangedError)) throw inspectionError;
				lastChange = inspectionError;
				continue;
			}
			const currentSidecars = readSourceSidecars(canonicalPath);
			if (currentMode === "rollback" && currentSidecars.journal) {
				if (!isSqliteReadOnlyError(error)) throw error;
				try {
					const prepared = await createStableReadOnlyCopy(canonicalPath, "rollback", stagingRoot, signal);
					report("raw-copy", "success", prepared);
					return prepared;
				} catch (copyError) {
					if (!(copyError instanceof SqliteSourceChangedError)) throw copyError;
					lastChange = copyError;
					await waitForSnapshotRetry(attempt, signal);
					continue;
				}
			}
			if (currentMode !== "wal" || currentSidecars.wal && currentSidecars.shm) throw error;
			lastChange = error instanceof Error ? error : new Error(String(error));
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		try {
			const prepared = await createStableReadOnlyCopy(canonicalPath, "wal", stagingRoot, signal);
			report("raw-copy", "success", prepared);
			return prepared;
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
		}
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
function prepareReadOnlySourceSyncInProcess(pathname, stagingRoot) {
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) try {
		return createStableReadOnlyCopyInTempDirectory(canonicalPath, readSourceJournalMode(canonicalPath), void 0, stagingRoot);
	} catch (error) {
		if (!(error instanceof SqliteSourceChangedError)) throw error;
		lastChange = error;
		waitForSnapshotRetrySync(attempt);
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
/** Fixed metadata inspection in the read-only child; no payload scan or backup
* unless source journal state requires private recovery/artifact preservation. */
function inspectSqliteSchemaHeaderInProcess(pathname, stagingRoot, agentSchemaVersionForOwnership) {
	return withSqliteSourceHandleAsync(pathname, async () => {
		const canonicalPath = fs.realpathSync.native(pathname);
		const mode = readSourceJournalMode(canonicalPath);
		const sidecars = readSourceSidecars(canonicalPath);
		if (mode !== "wal" || sidecars.wal && sidecars.shm) {
			let readError;
			try {
				return withSqliteSourceReadDatabase(canonicalPath, "source", (database) => {
					try {
						setSqliteBusyTimeout(database, SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS);
						return readSqliteSchemaHeader(database, agentSchemaVersionForOwnership);
					} catch (error) {
						readError = error;
						throw error;
					}
				});
			} catch (error) {
				if (error !== readError || !isSqliteReadOnlyError(error) || !statIfPresent(`${canonicalPath}-journal`) || readSourceJournalMode(canonicalPath) !== "rollback") throw error;
			}
		}
		return readSqliteSchemaHeaderFromSnapshot(await prepareReadOnlySourceInProcess(canonicalPath, stagingRoot), void 0, agentSchemaVersionForOwnership);
	});
}
function prepareSqliteReadOnlyLocationInProcess(pathname, stagingRoot, signal) {
	signal?.throwIfAborted();
	return withSqliteSourceHandleAsync(pathname, () => prepareReadOnlySourceInProcess(pathname, stagingRoot, signal));
}
function prepareSqliteReadOnlyLocationSyncInProcess(pathname, stagingRoot) {
	return withSqliteSourceHandle(pathname, () => prepareReadOnlySourceSyncInProcess(pathname, stagingRoot));
}
async function prepareSqliteReadOnlyLocationFromOwnedDatabase(database, assertCurrent, signal, cleanupMode) {
	signal?.throwIfAborted();
	assertCurrent();
	if (!database.isOpen || database.isTransaction) throw new Error("SQLite inspection requires an open owner outside a transaction");
	const directory = await createSqliteSnapshotStagingDirectory(void 0, false, signal, cleanupMode === "async");
	try {
		signal?.throwIfAborted();
		assertCurrent();
		if (!database.isOpen || database.isTransaction) throw new Error("SQLite inspection requires an open owner outside a transaction");
		const location = path.join(directory, "database.sqlite.partial");
		await retainSnapshotWork(backupNodeSqliteDatabase(database, location));
		signal?.throwIfAborted();
		assertCurrent();
		return publishPreparedCopy(directory);
	} catch (error) {
		const errors = [error];
		if (!await removeTempDirectoryAsync(directory, (cleanupError) => errors.push(cleanupError)) && cleanupMode === "async") throw createSqliteLifecycleAggregateError(errors, "Owned SQLite snapshot preparation and cleanup failed", error);
		throw error;
	}
}
//#endregion
export { prepareSqliteReadOnlyLocationFromOwnedDatabase as a, readSourceJournalMode as c, readSqliteWriterAppVersion as d, backupNodeSqliteDatabase as f, isSqliteReadOnlyError as i, readSourceSidecars as l, createOnlineReadOnlyBackup as n, prepareSqliteReadOnlyLocationInProcess as o, inspectSqliteSchemaHeaderInProcess as r, prepareSqliteReadOnlyLocationSyncInProcess as s, SqliteSourceChangedError as t, readSqliteSchemaHeader as u };
