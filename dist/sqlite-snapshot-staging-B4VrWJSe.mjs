import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveRequiredOsHomeDir } from "./home-dir-CtsdYvX3.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { s as markSqliteInspectionOperation } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { _ as acquireSqliteSnapshotToken, c as removeTempDirectory, d as retainSnapshotWork, g as SQLITE_SNAPSHOT_PREFIX, l as removeTempDirectoryAsync, o as registerSnapshotTempDirectory, t as SqliteSnapshotCleanupError, v as isSqliteSnapshotStagingName } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { n as markPrivateDirectoryCreationRefused, t as isPrivateDirectoryCreationRefused } from "./private-directory-creation-DNydTBRE.mjs";
import { t as createPrivateWindowsDirectory } from "./windows-private-directory-MPEowKNX.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/infra/sqlite-private-directory.ts
const SQLITE_DIRECTORY_MODE = 448;
async function createPrivateSqliteDirectory(directoryPath) {
	if (process.platform !== "win32") {
		await fs$1.mkdir(directoryPath, { mode: SQLITE_DIRECTORY_MODE });
		return;
	}
	createPrivateWindowsDirectory(directoryPath);
}
function resolvePrivateSqliteSnapshotStagingRoot(env = process.env) {
	const updateTmp = env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? env.TMPDIR?.trim() : void 0;
	if (updateTmp && path.isAbsolute(updateTmp)) return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(updateTmp, "openclaw"),
		tmpdir: () => updateTmp
	});
	const appData = process.platform === "win32" ? env.LOCALAPPDATA?.trim() : void 0;
	const defaultRoot = process.platform === "win32" ? "AppData/Local" : ".cache";
	const platformRoot = process.platform === "darwin" ? "Library/Caches" : defaultRoot;
	const cacheRoot = [env.XDG_CACHE_HOME?.trim(), appData].find((root) => root && path.isAbsolute(root)) ?? path.join(resolveRequiredOsHomeDir(env), platformRoot);
	return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(cacheRoot, "openclaw"),
		tmpdir: () => cacheRoot
	});
}
async function createPrivateSqliteTempDirectory(rootPath, prefix) {
	if (process.platform !== "win32") return await fs$1.mkdtemp(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	await createPrivateSqliteDirectory(directoryPath);
	return directoryPath;
}
function createPrivateSqliteTempDirectorySync(rootPath, prefix) {
	if (process.platform !== "win32") try {
		return fs.mkdtempSync(path.join(rootPath, prefix));
	} catch (error) {
		throw markPrivateDirectoryCreationRefused(error);
	}
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
const SNAPSHOT_RETRY_BASE_MS = 10;
const SNAPSHOT_RETRY_MAX_MS = 80;
function sqliteSnapshotSourceFileSize(pathname) {
	try {
		const stat = fs.statSync(pathname);
		return stat.isFile() ? stat.size : 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function emitSqliteSnapshotTelemetry(fields, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).debug({
			...fields,
			errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : void 0
		}, "SQLite snapshot operation completed.");
	} catch {}
}
function waitForSnapshotRetrySync(attempt) {
	if (attempt + 1 >= 10) return;
	const delayMs = Math.min(SNAPSHOT_RETRY_MAX_MS, SNAPSHOT_RETRY_BASE_MS * 2 ** attempt);
	if (delayMs > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
}
function createSnapshotAttemptReporter(pathname) {
	const started = performance.now();
	return (operation, outcome, prepared, error) => {
		try {
			emitSqliteSnapshotTelemetry({
				attempt: 1,
				copiedBytes: prepared ? fs.statSync(prepared.location).size : 0,
				durationMs: Math.max(0, performance.now() - started),
				operation,
				outcome,
				sourceMainBytes: sqliteSnapshotSourceFileSize(pathname),
				sourceWalBytes: sqliteSnapshotSourceFileSize(`${pathname}-wal`),
				owner: "path-reader"
			}, error);
		} catch {}
	};
}
//#endregion
//#region src/infra/sqlite-snapshot-staging.ts
function sqliteSnapshotStagingParent(root) {
	const parent = path.basename(root) === "openclaw" ? path.dirname(root) : root;
	return isSqliteSnapshotStagingName(path.basename(parent)) ? parent : void 0;
}
function warnSqliteSnapshotReclamation(message, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({ errorCode: extractErrorCode(error) }, message);
	} catch {}
}
/** A private reader protects its bytes independently of the staging child. */
function acquireSqliteSnapshotReadToken(directory) {
	return acquireSqliteSnapshotToken(directory, "read");
}
function sqliteSnapshotStagingError(tempDir, cause, allocation = false, sourcePath) {
	markSqliteInspectionOperation(cause, "snapshot");
	let destination = allocation;
	let capacity = false;
	let sqliteErrcode;
	for (let depth = 0, error = cause; depth < 8 && error instanceof Error; depth += 1) {
		const { code, errcode, path: errorPath } = error;
		capacity ||= ["ENOSPC", "EDQUOT"].includes(code ?? "") || errcode === 13;
		if (capacity || typeof errcode === "number" && [
			13,
			778,
			1034,
			1290
		].includes(errcode) || `${errorPath ?? ""}${path.sep}`.startsWith(`${tempDir}${path.sep}`)) {
			destination = true;
			if (typeof errcode === "number") sqliteErrcode = errcode;
		}
		error = error.cause;
	}
	if (!destination) return cause;
	const guidance = capacity ? "free disk space/quota" : "check filesystem health and write permissions";
	let capacityDetail = "";
	if (capacity && sourcePath) try {
		const estimatedBytes = sqliteSnapshotSourceFileSize(sourcePath) + sqliteSnapshotSourceFileSize(`${sourcePath}-wal`) + sqliteSnapshotSourceFileSize(`${sourcePath}-journal`);
		const availableBytes = tryReadDiskSpace(tempDir)?.availableBytes;
		const liveWal = fs.existsSync(`${sourcePath}-wal`) && fs.existsSync(`${sourcePath}-shm`);
		capacityDetail = `; estimated ${estimatedBytes} bytes needed; ${availableBytes === void 0 ? "available bytes unknown" : `${availableBytes} bytes available`}; source ${liveWal ? "has live WAL sidecars" : "has no live WAL sidecars"}`;
	} catch {}
	const selector = process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? "TMPDIR" : "XDG_CACHE_HOME";
	const message = `${cause instanceof Error ? cause.message : String(cause)}${sqliteErrcode !== void 0 ? ` (SQLite errcode=${sqliteErrcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}${capacityDetail}: ${guidance} or set ${selector} to a writable filesystem`;
	const error = new Error(message, { cause });
	return isPrivateDirectoryCreationRefused(cause) ? markPrivateDirectoryCreationRefused(error) : error;
}
async function createSqliteSnapshotStagingDirectory(stagingRoot = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	try {
		return await allocateSqliteSnapshotStagingDirectory(stagingRoot, allowLegacyWorker, signal, asynchronousCleanup);
	} catch (error) {
		if (error instanceof SqliteSnapshotCleanupError || asynchronousCleanup && error instanceof AggregateError) throw error;
		signal?.throwIfAborted();
		markSqliteInspectionOperation(error, "snapshot");
		throw error;
	}
}
async function allocateSqliteSnapshotStagingDirectory(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	if (asynchronousCleanup) {
		const controller = new AbortController();
		return retainSnapshotWork((async () => {
			const { allocateWorkerOwnedSqliteSnapshotDirectory } = await import("./sqlite-snapshot-staging-allocation-BiySEeQq.mjs");
			signal?.throwIfAborted();
			controller.signal.throwIfAborted();
			const owned = await allocateWorkerOwnedSqliteSnapshotDirectory(root, allowLegacyWorker, signal ? AbortSignal.any([signal, controller.signal]) : controller.signal);
			registerSnapshotTempDirectory(owned.directory);
			if (signal?.aborted || controller.signal.aborted) {
				if (!await removeTempDirectoryAsync(owned.directory)) throw new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${owned.directory}`);
				signal?.throwIfAborted();
				controller.signal.throwIfAborted();
			}
			return owned.directory;
		})(), () => controller.abort(/* @__PURE__ */ new Error("SQLite snapshot allocation stopped")));
	}
	return createSqliteSnapshotStagingDirectorySync(root, allowLegacyWorker);
}
function createSqliteSnapshotStagingDirectorySync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const owned = createSqliteSnapshotStagingTokenSync(root, allowLegacyWorker);
	registerSnapshotTempDirectory(owned.directory, owned.release);
	return owned.directory;
}
/** Token workers remove disposable payload under their own native retirement fences. */
function createSqliteSnapshotStagingTokenSync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	let directory;
	try {
		try {
			directory = createPrivateSqliteTempDirectorySync(root, allowLegacyWorker ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX);
		} catch (error) {
			throw sqliteSnapshotStagingError(root, error, true);
		}
		return {
			directory,
			release: acquireSqliteSnapshotToken(directory, "create")
		};
	} catch (error) {
		if (directory) removeTempDirectory(directory);
		throw error;
	}
}
//#endregion
export { sqliteSnapshotStagingParent as a, emitSqliteSnapshotTelemetry as c, createPrivateSqliteDirectory as d, createPrivateSqliteTempDirectory as f, sqliteSnapshotStagingError as i, sqliteSnapshotSourceFileSize as l, resolvePrivateSqliteSnapshotStagingRoot as m, createSqliteSnapshotStagingDirectory as n, warnSqliteSnapshotReclamation as o, createPrivateSqliteTempDirectorySync as p, createSqliteSnapshotStagingDirectorySync as r, createSnapshotAttemptReporter as s, acquireSqliteSnapshotReadToken as t, waitForSnapshotRetrySync as u };
