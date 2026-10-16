import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as assertDatabaseFileIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { n as requireNodeSqlite, o as resolveSqliteFilesystemPath, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { f as withSqliteInspectionOperation } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as createFileCopyWithCloneFallback } from "./fs-safe-file-copy-BgC-YGR-.mjs";
import { a as createSqliteLifecycleAggregateError, o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { m as resolvePrivateSqliteSnapshotStagingRoot, n as createSqliteSnapshotStagingDirectory, o as sqliteSnapshotStagingError, r as createSqliteSnapshotStagingDirectorySync, s as createSnapshotAttemptReporter, u as waitForSnapshotRetrySync } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { c as removeTempDirectory, d as retainSnapshotWork, l as removeTempDirectoryAsync, n as adoptPreparedLocation } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-r_rNkHrE.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { r as configureSqliteReadOnlyPragmas } from "./sqlite-wal-DUSYRhyv.mjs";
import { t as withSqliteSourceReadDatabase } from "./sqlite-source-handle-CLpCZnZK.mjs";
import fs from "node:fs";
import path from "node:path";
import { copyFileDescriptorSync, readFileWindowFullySync, sameFileContentsSync, sameFileIdentity } from "@openclaw/fs-safe/advanced";
//#region src/infra/sqlite-backup.ts
async function backupNodeSqliteDatabase(source, targetPath, onProgress) {
	const checkpoint = setInterval(() => {}, 100);
	try {
		const totalPages = await requireNodeSqlite().backup(source, resolveSqliteFilesystemPath(targetPath), { progress: onProgress });
		onProgress?.({
			totalPages,
			remainingPages: 0
		});
		return totalPages;
	} finally {
		clearInterval(checkpoint);
	}
}
//#endregion
//#region src/infra/sqlite-file-copy.ts
/** Copy a physical SQLite file, not a coherent family. Its caller owns coherence and byte checks. */
async function copySqliteFile(sourcePath, targetPath, expectedIdentity, beforeByteCopy) {
	const sourceRoot = await root(path.dirname(sourcePath));
	const targetRoot = await root(path.dirname(targetPath));
	let published;
	await createFileCopyWithCloneFallback()(targetRoot, path.basename(targetPath), {
		relativePath: path.basename(sourcePath),
		root: {
			stat: (relativePath) => sourceRoot.stat(relativePath),
			open: async (relativePath, options) => {
				const opened = await sourceRoot.open(relativePath, options);
				try {
					if (!sameFileIdentity(expectedIdentity, await opened.handle.stat({ bigint: true }))) throw new Error(`SQLite copy source changed: ${sourcePath}`);
					return opened;
				} catch (error) {
					await opened.handle.close();
					throw error;
				}
			}
		}
	}, {
		...beforeByteCopy ? { maxBytes: Number(expectedIdentity.size) } : {},
		sourceHardlinks: "allow",
		overwrite: false,
		mode: 384,
		durable: true,
		onDestinationPublished: (receipt) => {
			published = receipt;
		}
	}, beforeByteCopy ? () => beforeByteCopy(Number(expectedIdentity.size)) : void 0);
	if (!published) throw new Error(`SQLite copy was not published: ${targetPath}`);
	return published;
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
	return runWithSqliteCleanup({ release: () => database.close() }, "SQLite schema header read", () => {
		setSqliteBusyTimeout(database, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		return readSqliteSchemaHeader(database, agentSchemaVersionForOwnership);
	});
}
/** Consume a private snapshot and retain both read and cleanup failures. */
function readSqliteSchemaHeaderFromSnapshot(prepared, signal, agentSchemaVersionForOwnership) {
	return runWithSqliteCleanup({ release: () => {
		if (!prepared.cleanup()) throw new Error(`SQLite read-only worker snapshot cleanup failed: ${prepared.location}`);
	} }, "SQLite schema header snapshot", () => readSqliteSchemaHeaderSnapshot(prepared.location, signal, agentSchemaVersionForOwnership));
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
function prepareSqliteWalPrefixCopy(source, destination, verifyMainCopy) {
	const generation = readWalGeneration(source);
	if (!generation) return;
	return () => {
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
	};
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
function openPinnedFile(pathname, expectedSourceIdentity) {
	let descriptor;
	try {
		descriptor = fs.openSync(pathname, "r");
	} catch (error) {
		if (error.code === "ENOENT") throw new SqliteSourceChangedError(`SQLite source disappeared: ${pathname}`);
		throw error;
	}
	try {
		const identity = fs.fstatSync(descriptor, { bigint: true });
		if (expectedSourceIdentity) assertDatabaseFileIdentity(identity, expectedSourceIdentity);
		const current = statIfPresent(pathname);
		if (!identity.isFile() || !current?.isFile() || !sameFileIdentity(identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while opening: ${pathname}`);
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
function readSourceJournalMode(pathname, expectedSourceIdentity) {
	const source = openPinnedFile(pathname, expectedSourceIdentity);
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
	if (!opened.isFile() || !current?.isFile() || !sameFileIdentity(file.identity, opened) || !sameFileIdentity(file.identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while copying: ${file.pathname}`);
}
function copySourceFile(sourcePath, targetPath, expectedSourceIdentity) {
	const source = openPinnedFile(sourcePath, expectedSourceIdentity);
	try {
		const target = fs.openSync(targetPath, "wx", 384);
		try {
			copyFileDescriptorSync(source.descriptor, target);
			fs.fsyncSync(target);
			assertPinnedIdentityUnchanged(source);
		} finally {
			fs.closeSync(target);
		}
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function sourceMatchesCopy(sourcePath, copyPath, expectedSourceIdentity) {
	const source = openPinnedFile(sourcePath, expectedSourceIdentity);
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
function* createStableReadOnlyCopyInTempDirectory(pathname, journalMode, existingTempDir, stagingRoot = existingTempDir ? path.dirname(existingTempDir) : resolvePrivateSqliteSnapshotStagingRoot(), expectedSourceIdentity) {
	let tempDir = existingTempDir;
	try {
		tempDir ??= createSqliteSnapshotStagingDirectorySync(stagingRoot);
		const snapshotPath = path.join(tempDir, "database.sqlite.partial");
		const firstPath = path.join(tempDir, "first");
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		if (readSourceJournalMode(pathname, expectedSourceIdentity) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed before copying: ${pathname}`);
		const sidecars = readSourceSidecars(pathname);
		let copiedWalPrefix = false;
		if (journalMode === "wal" && sidecars.wal && !sidecars.journal) {
			const wal = openPinnedFile(`${pathname}-wal`);
			try {
				const copyPrefix = prepareSqliteWalPrefixCopy(wal.descriptor, `${snapshotPath}-wal`, () => sourceMatchesCopy(pathname, snapshotPath, expectedSourceIdentity));
				if (copyPrefix) yield {
					sourcePath: pathname,
					targetPath: snapshotPath,
					expectedSourceIdentity
				};
				const copied = copyPrefix?.();
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
			for (const suffix of sidecarSuffixes) yield {
				sourcePath: `${pathname}${suffix}`,
				targetPath: `${snapshotPath}${suffix}`
			};
			yield {
				sourcePath: pathname,
				targetPath: snapshotPath,
				expectedSourceIdentity
			};
			for (const suffix of sidecarSuffixes) if (!sourceMatchesCopy(`${pathname}${suffix}`, `${snapshotPath}${suffix}`)) throw new SqliteSourceChangedError(`SQLite ${suffix === "-wal" ? "WAL" : "rollback journal"} changed while copying: ${pathname}`);
			assertExpectedSidecars(pathname, sidecars);
		} else {
			yield {
				sourcePath: pathname,
				targetPath: firstPath,
				expectedSourceIdentity
			};
			assertExpectedSidecars(pathname, sidecars);
			const mainUnchanged = sourceMatchesCopy(pathname, firstPath, expectedSourceIdentity);
			assertExpectedSidecars(pathname, sidecars);
			if (!mainUnchanged) throw new SqliteSourceChangedError(`SQLite main database changed while copying: ${pathname}`);
			fs.rmSync(snapshotPath, { force: true });
			fs.renameSync(firstPath, snapshotPath);
		}
		if (readSourceJournalMode(pathname, expectedSourceIdentity) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed while copying: ${pathname}`);
		if (sidecars.journal) recoverPrivateJournalCopy(snapshotPath);
		return publishPreparedCopy(tempDir);
	} catch (error) {
		const stagingError = tempDir ? sqliteSnapshotStagingError(tempDir, error, false, pathname) : error;
		if (tempDir && existingTempDir === void 0) removeTempDirectory(tempDir);
		throw stagingError;
	}
}
function copyPreparedLocationSync(steps) {
	let step = steps.next();
	while (!step.done) {
		try {
			const { sourcePath, targetPath, expectedSourceIdentity } = step.value;
			copySourceFile(sourcePath, targetPath, expectedSourceIdentity);
		} catch (error) {
			step = steps.throw(error);
			continue;
		}
		step = steps.next();
	}
	return step.value;
}
async function copyPreparedLocation(steps) {
	let step = steps.next();
	while (!step.done) {
		try {
			const { sourcePath, targetPath, expectedSourceIdentity } = step.value;
			const source = openPinnedFile(sourcePath, expectedSourceIdentity);
			try {
				try {
					await copySqliteFile(sourcePath, targetPath, source.identity);
				} catch (error) {
					assertPinnedIdentityUnchanged(source);
					throw error;
				}
				assertPinnedIdentityUnchanged(source);
			} finally {
				fs.closeSync(source.descriptor);
			}
		} catch (error) {
			step = steps.throw(error);
			continue;
		}
		step = steps.next();
	}
	return step.value;
}
async function createStableReadOnlyCopy(pathname, journalMode, stagingRoot, signal) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	try {
		return await copyPreparedLocation(createStableReadOnlyCopyInTempDirectory(pathname, journalMode, tempDir));
	} catch (error) {
		const errors = [error];
		if (!await removeTempDirectoryAsync(tempDir, (cleanupError) => errors.push(cleanupError))) throw createSqliteLifecycleAggregateError(errors, `SQLite snapshot preparation and cleanup failed: ${coerceErrorMessage(error)}`, error);
		throw error;
	}
}
/** Native reads may create WAL-index files; callers need an isolated child or a private source. */
async function createOnlineReadOnlyBackup(pathname, stagingRoot, signal, onProgress) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	const snapshotPath = path.join(tempDir, "database.sqlite.partial");
	try {
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		const source = withSqliteInspectionOperation("source", () => openNodeSqliteDatabase(pathname, { readOnly: true }));
		try {
			source.exec(`PRAGMA busy_timeout = ${SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS}; PRAGMA trusted_schema = OFF; BEGIN;`);
			source.prepare("PRAGMA schema_version;").get();
			await retainSnapshotWork(backupNodeSqliteDatabase(source, snapshotPath, onProgress));
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
		const stagingError = sqliteSnapshotStagingError(tempDir, error, false, pathname);
		const errors = [stagingError];
		if (!await removeTempDirectoryAsync(tempDir, (cleanupError) => errors.push(cleanupError))) throw createSqliteLifecycleAggregateError(errors, `SQLite online backup and cleanup failed: ${coerceErrorMessage(stagingError)}`, stagingError);
		throw stagingError;
	}
}
/**
* Active rollback and WAL state use SQLite's locking and backup protocol.
* Crash residue that cannot be opened read-only is copied and recovered
* privately so inspection never mutates coordination files beside the source.
* In-process reads require drained source handles or a separate child: source
* close() must not release another live SQLite owner's POSIX locks.
*/
async function prepareReadOnlySourceInProcess(pathname, stagingRoot, signal, onProgress) {
	signal?.throwIfAborted();
	const canonicalPath = fs.realpathSync.native(pathname);
	const report = createSnapshotAttemptReporter(canonicalPath);
	for (let attempt = 0;; attempt += 1) {
		signal?.throwIfAborted();
		let operation = "online-backup";
		try {
			const journalMode = readSourceJournalMode(canonicalPath);
			const sidecars = readSourceSidecars(canonicalPath);
			let prepared;
			if (journalMode === "empty" || journalMode === "wal" && (!sidecars.wal || !sidecars.shm)) {
				operation = "raw-copy";
				prepared = await createStableReadOnlyCopy(canonicalPath, journalMode, stagingRoot, signal);
			} else try {
				prepared = await createOnlineReadOnlyBackup(canonicalPath, stagingRoot, signal, onProgress);
			} catch (error) {
				signal?.throwIfAborted();
				if (error instanceof AggregateError || !isSqliteReadOnlyError(error) || readSourceJournalMode(canonicalPath) !== "rollback" || !readSourceSidecars(canonicalPath).journal) throw error;
				operation = "raw-copy";
				prepared = await createStableReadOnlyCopy(canonicalPath, "rollback", stagingRoot, signal);
			}
			report(operation, "success", prepared);
			return prepared;
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError) || attempt + 1 >= 10) {
				report(operation, "error", void 0, error);
				throw error;
			}
		}
	}
}
function* prepareArtifactPreservingCopy(pathname, stagingRoot, expectedSourceIdentity) {
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) try {
		return yield* createStableReadOnlyCopyInTempDirectory(canonicalPath, readSourceJournalMode(canonicalPath, expectedSourceIdentity), void 0, stagingRoot, expectedSourceIdentity);
	} catch (error) {
		if (!(error instanceof SqliteSourceChangedError)) throw error;
		lastChange = error;
		waitForSnapshotRetrySync(attempt);
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
function prepareSqliteReadOnlyLocationSyncInProcess(pathname, stagingRoot, expectedSourceIdentity) {
	return copyPreparedLocationSync(prepareArtifactPreservingCopy(pathname, stagingRoot, expectedSourceIdentity));
}
/** Artifact-preserving acquisition with native CoW where supported, in the isolated child. */
function prepareSqliteReadOnlyCopyInProcess(pathname, stagingRoot, expectedSourceIdentity) {
	return copyPreparedLocation(prepareArtifactPreservingCopy(pathname, stagingRoot, expectedSourceIdentity));
}
/** Fixed metadata inspection in the read-only child; no payload scan or backup
* unless source journal state requires private recovery/artifact preservation. */
async function inspectSqliteSchemaHeaderInProcess(pathname, stagingRoot, agentSchemaVersionForOwnership) {
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
}
function prepareSqliteReadOnlyLocationInProcess(pathname, stagingRoot, signal, onProgress) {
	signal?.throwIfAborted();
	return prepareReadOnlySourceInProcess(pathname, stagingRoot, signal, onProgress);
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
		if (!await removeTempDirectoryAsync(directory, (cleanupError) => errors.push(cleanupError)) && cleanupMode === "async") throw createSqliteLifecycleAggregateError(errors, `Owned SQLite snapshot preparation and cleanup failed: ${coerceErrorMessage(error)}`, error);
		throw error;
	}
}
//#endregion
export { prepareSqliteReadOnlyLocationFromOwnedDatabase as a, readSourceJournalMode as c, readSqliteWriterAppVersion as d, copySqliteFile as f, prepareSqliteReadOnlyCopyInProcess as i, readSourceSidecars as l, inspectSqliteSchemaHeaderInProcess as n, prepareSqliteReadOnlyLocationInProcess as o, backupNodeSqliteDatabase as p, isSqliteReadOnlyError as r, prepareSqliteReadOnlyLocationSyncInProcess as s, SqliteSourceChangedError as t, readSqliteSchemaHeader as u };
