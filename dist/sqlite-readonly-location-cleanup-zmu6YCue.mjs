import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { a as registerSignalExitFinalizer } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { o as getSqliteRuntimeCapabilities } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { I as retireSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as mapRetainedOperation, t as createRetainedOperation } from "./retained-operation-cDWsZqBc.mjs";
import { r as acquireSqliteStagingToken, t as SQLITE_STAGING_TOKEN_FILES } from "./sqlite-staging-token-8t4ufSRY.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/sqlite-snapshot-retirement.ts
const SQLITE_SNAPSHOT_PREFIX = "openclaw-sqlite-readonly-v2-";
const suffix = "(?:[A-Za-z0-9]{6}|[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12})$";
const SQLITE_SNAPSHOT_LEGACY_MARKER = new RegExp(`^openclaw-sqlite-readonly-[1-9]\\d*-${suffix}`, "u");
const tokenMarker = new RegExp(`^${SQLITE_SNAPSHOT_PREFIX}${suffix}`, "u");
const SQLITE_SNAPSHOT_LEGACY_AGE_MS = 864e5;
function releaseTokens(tokens) {
	const failures = [];
	for (const token of tokens) try {
		token();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length) throw new AggregateError(failures, "SQLite snapshot retirement token release failed");
}
const isSqliteSnapshotStagingName = (name) => SQLITE_SNAPSHOT_LEGACY_MARKER.test(name) || tokenMarker.test(name);
function acquireSqliteSnapshotToken(directory, mode) {
	return acquireSqliteStagingToken(directory, mode, { allowMissing: SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(directory)) });
}
/** Hold every nested lifetime before selecting payload; a parent lock alone cannot fence children. */
function beginSqliteSnapshotRetirement(directory, options = {}) {
	const tokens = [];
	const payload = [];
	const release = () => releaseTokens(tokens.filter((token) => token !== options.token));
	if (!fs.existsSync(directory)) {
		options.token?.();
		return {
			bytes: 0,
			payload,
			release,
			retire: () => {}
		};
	}
	function inspect(current, inheritedCutoff, layout = "", lock = true) {
		const stat = fs.lstatSync(current);
		if (!stat.isDirectory() || process.getuid && stat.uid !== process.getuid()) throw new Error("Snapshot directory ownership is unknown");
		const legacy = !layout && SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(current));
		const cutoff = options.cutoff !== void 0 && legacy ? Math.min(inheritedCutoff, Date.now() - SQLITE_SNAPSHOT_LEGACY_AGE_MS) : inheritedCutoff;
		if (legacy && lock && options.cutoff !== void 0) inspect(current, cutoff, layout, false);
		if (!layout && lock) tokens.push(current === directory && options.token ? options.token.beginRetirement() : acquireSqliteSnapshotToken(current, "reclaim"));
		let bytes = 0;
		let newest = stat.mtimeMs;
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			const location = path.join(current, entry.name);
			const item = fs.lstatSync(location);
			if (process.getuid && item.uid !== process.getuid()) throw new Error("Snapshot file ownership is unknown");
			if ((!layout || options.cutoff === void 0) && item.isFile() && SQLITE_STAGING_TOKEN_FILES.some((file) => file === entry.name)) continue;
			newest = Math.max(newest, item.mtimeMs);
			if (item.isDirectory()) {
				const nested = isSqliteSnapshotStagingName(entry.name);
				const childLayout = nested ? "" : [layout, entry.name].filter(Boolean).join("/");
				if (options.cutoff !== void 0 && (!nested && ![
					"openclaw",
					"openclaw-state",
					"openclaw-state/state"
				].includes(childLayout) || nested && layout !== "" && layout !== "openclaw")) throw new Error("Unrecognized snapshot directory");
				const child = inspect(location, cutoff, childLayout, lock);
				bytes += child.bytes;
				newest = Math.max(newest, child.newest);
			} else if (options.cutoff === void 0 || item.isFile() && (layout === "openclaw-state/state" ? /^openclaw\.sqlite(?:-wal|-shm|-journal)?$/u.test(entry.name) : !layout && /^(?:first|database\.sqlite(?:\.partial)?(?:-wal|-shm|-journal)?)$/u.test(entry.name))) {
				bytes += item.size;
				if (lock) payload.push(location);
			} else throw new Error("Unrecognized snapshot artifact");
		}
		if (newest >= cutoff) throw new Error(legacy ? "Legacy snapshot contains activity newer than 24 hours" : "Snapshot contains activity within the reclamation grace period");
		return {
			bytes,
			newest
		};
	}
	try {
		const { bytes } = inspect(directory, options.cutoff ?? Number.POSITIVE_INFINITY);
		return {
			bytes,
			payload,
			release,
			retire: () => {
				for (const token of tokens) token(true);
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-readonly-location-cleanup.ts
var SqliteSnapshotCleanupError = class extends Error {};
/**
* Runtimes without qualified native close (stock Bun, every Windows Bun) can
* keep a private snapshot open after logical close. Call only after the read
* succeeded: EBUSY then leaves the directory registered for later cleanup.
*/
function deferSqliteSnapshotCleanupAfterRead(error, cleanupRoot) {
	if (getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources || !(error instanceof SqliteSnapshotCleanupError) || !hasErrnoCode(error.cause, "EBUSY")) return false;
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: cleanupRoot,
			errorCode: "EBUSY"
		}, "SQLite snapshot cleanup deferred until native SQLite resources are released.");
	} catch {}
	return true;
}
/** A failed result does not discharge the original request's native cleanup custody. */
function settleSqliteSnapshotRequest(request) {
	return request.result.catch(async (error) => {
		try {
			await request.startClose().result;
		} catch (cleanupError) {
			if (cleanupError === error) throw error;
			const combined = createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot allocation and cleanup failed", error);
			throw error instanceof SqliteSnapshotCleanupError ? new SqliteSnapshotCleanupError(error.message, { cause: combined }) : combined;
		}
		throw error;
	});
}
const cleanupState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotCleanup"), () => ({
	directories: /* @__PURE__ */ new Map(),
	activeWork: /* @__PURE__ */ new Map(),
	exitHandlerInstalled: false,
	pendingSignalCleanup: void 0,
	signalCleanup: cleanupSnapshotOperations
}));
const snapshotDirectories = cleanupState.directories;
const activeSnapshotWork = cleanupState.activeWork;
function snapshotDirectory(directory) {
	let owner = snapshotDirectories.get(directory);
	if (!owner) {
		owner = { readers: /* @__PURE__ */ new Set() };
		snapshotDirectories.set(directory, owner);
	}
	return owner;
}
function completeSnapshotDirectoryRemoval(directory) {
	snapshotDirectories.delete(directory);
	return true;
}
function cleanupSnapshotOperations() {
	cleanupState.pendingSignalCleanup ??= (async () => {
		const directories = snapshotDirectories.entries();
		while (true) {
			while (activeSnapshotWork.size > 0) {
				for (const stop of activeSnapshotWork.values()) stop();
				await Promise.allSettled(activeSnapshotWork.keys());
			}
			const next = directories.next();
			if (next.done) break;
			const [directory] = next.value;
			await removeTempDirectoryAsync(directory, (error) => emitSnapshotCleanupFailure({
				cleanupRoot: directory,
				operation: "rm",
				code: extractErrorCode(error)
			}));
		}
	})().finally(() => {
		cleanupState.pendingSignalCleanup = void 0;
	});
	return cleanupState.pendingSignalCleanup;
}
/** Join native backup work or a terminated child before removing its private bytes. */
function retainSnapshotWork(work, stop = () => {}) {
	registerSnapshotCleanup();
	activeSnapshotWork.set(work, stop);
	const release = () => activeSnapshotWork.delete(work);
	work.then(release, release);
	return work;
}
/** Keep signal cleanup behind the consumer, including private transforms and publication. */
async function withPreparedSqliteSnapshot(snapshot, read) {
	let outcome;
	try {
		outcome = { value: await retainSnapshotWork(Promise.resolve().then(() => read(snapshot.location))) };
	} catch (cause) {
		outcome = { cause };
	}
	if (!await snapshot.cleanupAsync().catch(() => false)) {
		const readFailure = "cause" in outcome ? `${outcome.cause instanceof Error ? outcome.cause.message : String(outcome.cause)}; ` : "";
		throw new Error(`${readFailure}SQLite snapshot cleanup failed: ${snapshot.cleanupRoot ?? path.dirname(snapshot.location)}. Check directory permissions and available storage before retrying.`, "cause" in outcome ? outcome : void 0);
	}
	if ("cause" in outcome) throw outcome.cause;
	return outcome.value;
}
function registerSnapshotTempDirectory(directory, release) {
	const owner = snapshotDirectory(directory);
	owner.release = release ?? owner.release;
	registerSnapshotCleanup();
}
function registerSnapshotCleanup() {
	if (!cleanupState.exitHandlerInstalled) {
		cleanupState.exitHandlerInstalled = true;
		process.once("exit", () => {
			for (const stop of activeSnapshotWork.values()) stop();
			if (activeSnapshotWork.size === 0) for (const pendingDir of snapshotDirectories.keys()) removeTempDirectory(pendingDir);
		});
	}
	registerSignalExitFinalizer(cleanupState.signalCleanup);
}
/** This owner joins token retirement and directory removal in its worker. */
function registerRetainedSnapshotTempDirectory(directory, release) {
	snapshotDirectory(directory).releaseRetained = release;
	registerSnapshotCleanup();
}
/** Rejection is not retirement: only the reader's successful close releases custody. */
function retainSnapshotTempDirectory(directory) {
	registerSnapshotTempDirectory(directory);
	const owner = snapshotDirectory(directory);
	if (owner.retirementStarted) throw new SqliteSnapshotCleanupError("SQLite snapshot retirement has started");
	const reader = Symbol("sqlite.snapshot.reader");
	owner.readers.add(reader);
	return () => owner.readers.delete(reader);
}
/** A successful child hands its files to the caller's enclosing staging owner. */
function releaseSnapshotTempDirectory(directory) {
	const owner = snapshotDirectories.get(directory);
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	owner?.release?.(false);
	snapshotDirectories.delete(directory);
}
const tempDirectoryRemovalOptions = {
	force: true,
	maxRetries: 3,
	recursive: true,
	retryDelay: 20
};
function emitSnapshotCleanupFailure(report, onCleanupFailure) {
	if (onCleanupFailure) try {
		onCleanupFailure(report);
		return;
	} catch {}
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: report.cleanupRoot,
			operation: report.operation,
			errorCode: report.code
		}, "SQLite read-only snapshot cleanup failed. Check directory permissions and available storage before retrying.");
	} catch {}
}
function assertSnapshotReadersRetired(owner) {
	if (owner?.readers.size) throw new SqliteSnapshotCleanupError("SQLite snapshot still belongs to an active reader");
}
function prepareSnapshotRetirement(directory, owner) {
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	if (owner?.retired || !owner?.release && !fs.existsSync(path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]))) return;
	if (owner) owner.retirementStarted = true;
	return beginSqliteSnapshotRetirement(directory, { token: owner?.release });
}
/** Delete in the token process: owner death must stop unlinking when its locks disappear. */
function retireSqliteSnapshotPayload(retirement) {
	for (const file of retirement.payload) {
		retireSqliteDatabaseAdmissionForPath(file);
		fs.rmSync(file, tempDirectoryRemovalOptions);
	}
	retirement.retire();
}
function removeTempDirectory(tempDir, onFailure) {
	let owner = snapshotDirectories.get(tempDir);
	try {
		const retirement = prepareSnapshotRetirement(tempDir, owner);
		try {
			if (retirement) {
				retireSqliteSnapshotPayload(retirement);
				owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			fs.rmSync(tempDir, tempDirectoryRemovalOptions);
		} finally {
			retirement?.release();
		}
		return completeSnapshotDirectoryRemoval(tempDir);
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
async function removeTempDirectoryAsync(tempDir, onFailure) {
	let owner = snapshotDirectories.get(tempDir);
	if (owner?.releaseRetained) {
		const removed = await startRemoveTempDirectory(tempDir, onFailure, owner).result;
		if (removed) snapshotDirectories.delete(tempDir);
		return removed;
	}
	try {
		assertSnapshotReadersRetired(owner);
		const retirement = prepareSnapshotRetirement(tempDir, owner);
		try {
			for (const file of retirement?.payload ?? []) {
				retireSqliteDatabaseAdmissionForPath(file);
				await retainSnapshotWork(fs.promises.rm(file, tempDirectoryRemovalOptions));
			}
			if (retirement) {
				retirement.retire();
				owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			await retainSnapshotWork(fs.promises.rm(tempDir, tempDirectoryRemovalOptions));
		} finally {
			retirement?.release();
		}
		return completeSnapshotDirectoryRemoval(tempDir);
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
function startRemoveTempDirectory(directory, onFailure, owner = snapshotDirectories.get(directory)) {
	if (owner?.retiringRetained) return owner.retiringRetained;
	let release;
	const retained = createRetainedOperation(() => {
		if (!release || retained.operation.read().status !== "pending") return;
		release.service();
		const outcome = release.read();
		if (outcome.status === "pending") return;
		if (owner) owner.retiringRetained = void 0;
		if (outcome.status === "rejected") {
			onFailure?.(outcome.error);
			retained.resolve(false);
		} else retained.resolve(completeSnapshotDirectoryRemoval(directory));
	});
	try {
		sealRetainedSnapshotTempDirectory(directory);
		if (!owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot has no retained cleanup owner");
		owner.retiringRetained = retained.operation;
		release = owner.releaseRetained();
		release.result.then(() => retained.operation.service(), () => retained.operation.service());
		retained.operation.service();
	} catch (error) {
		if (owner) owner.retiringRetained = void 0;
		onFailure?.(error);
		retained.resolve(false);
	}
	return retained.operation;
}
/** A surviving native owner may retire bytes only after their original host readers leave. */
function sealRetainedSnapshotTempDirectory(directory, options) {
	const owner = snapshotDirectories.get(directory);
	if (!owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot has no retained cleanup owner");
	if (options?.requireRequested && !owner.retirementStarted) throw new SqliteSnapshotCleanupError("SQLite snapshot is still owned; cleanup has not been requested");
	assertSnapshotReadersRetired(owner);
	owner.retirementStarted = true;
}
function adoptPreparedLocation(location, ownedRoot, requireCleanup = false, onCleanupFailure) {
	const tempDir = ownedRoot ?? path.dirname(location);
	registerSnapshotTempDirectory(tempDir);
	let active = true;
	let pending;
	let retainedCleanup;
	let reported = false;
	let cleanupFailure;
	const reportFailure = (error) => {
		cleanupFailure = error;
		if (!requireCleanup && !reported) {
			reported = true;
			emitSnapshotCleanupFailure({
				cleanupRoot: tempDir,
				operation: "rm",
				code: extractErrorCode(error)
			}, onCleanupFailure);
		}
	};
	const complete = (removed) => {
		if (removed) {
			active = false;
			snapshotDirectories.delete(tempDir);
		} else if (requireCleanup) throw new SqliteSnapshotCleanupError(`SQLite read-only worker snapshot cleanup failed: ${tempDir}`, { cause: cleanupFailure });
		return removed;
	};
	const startCleanup = () => {
		if (retainedCleanup?.read().status === "pending") return retainedCleanup;
		if (!active) {
			const retained = createRetainedOperation(() => {});
			retained.resolve(complete(true));
			return retainedCleanup = retained.operation;
		}
		return retainedCleanup = mapRetainedOperation(startRemoveTempDirectory(tempDir, reportFailure), complete);
	};
	return {
		location,
		cleanupRoot: tempDir,
		cleanup: () => {
			if (pending || retainedCleanup?.read().status === "pending") return requireCleanup ? complete(false) : false;
			if (!active) return complete(true);
			return complete(removeTempDirectory(tempDir, reportFailure));
		},
		cleanupAsync: () => {
			if (snapshotDirectories.get(tempDir)?.releaseRetained || retainedCleanup) return startCleanup().result;
			if (pending) return pending;
			if (!active) return Promise.resolve(complete(true));
			pending = Promise.resolve().then(() => removeTempDirectoryAsync(tempDir, reportFailure)).then(complete).finally(() => {
				pending = void 0;
			});
			return pending;
		},
		startCleanup
	};
}
//#endregion
export { acquireSqliteSnapshotToken as _, registerRetainedSnapshotTempDirectory as a, removeTempDirectory as c, retainSnapshotWork as d, sealRetainedSnapshotTempDirectory as f, SQLITE_SNAPSHOT_PREFIX as g, withPreparedSqliteSnapshot as h, deferSqliteSnapshotCleanupAfterRead as i, removeTempDirectoryAsync as l, startRemoveTempDirectory as m, adoptPreparedLocation as n, registerSnapshotTempDirectory as o, settleSqliteSnapshotRequest as p, cleanupSnapshotOperations as r, releaseSnapshotTempDirectory as s, SqliteSnapshotCleanupError as t, retainSnapshotTempDirectory as u, isSqliteSnapshotStagingName as v };
