import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { c as removeTempDirectoryAsync, n as adoptPreparedLocation, s as removeTempDirectory, t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { o as prepareSqliteReadOnlyLocationInProcess, s as prepareSqliteReadOnlyLocationSyncInProcess } from "./sqlite-readonly-location-BpMwSm5l.mjs";
import { n as createSqliteSnapshotStagingDirectory, r as createSqliteSnapshotStagingDirectorySync } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { h as hasStateDatabaseSourceExclusion, r as withSqliteSourceHandleAsync, t as assertSqliteSourceReadAllowed, u as assertStateDatabaseSourceReadContext } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { r as prepareSingleFlightSqliteSnapshot, t as prepareSqliteSnapshotFromLiveOwner } from "./sqlite-live-snapshot-6zxwh_L6.mjs";
import { c as resolveSqliteInspectionSignal, l as runSqliteReadOnlyWorker, u as runSqliteReadOnlyWorkerSync } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import fs from "node:fs";
//#region src/infra/sqlite-snapshot-source.ts
async function prepareSqliteReadOnlyLocation(pathname, options = {}) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	try {
		signal?.throwIfAborted();
		if (hasStateDatabaseSourceExclusion(pathname)) {
			const prepared = options.preserveSourceArtifacts ? prepareSqliteReadOnlyLocationSyncInProcess(pathname) : await prepareSqliteReadOnlyLocationInProcess(pathname, void 0, signal);
			try {
				signal?.throwIfAborted();
				return prepared;
			} catch (error) {
				await prepared.cleanupAsync();
				throw error;
			}
		}
		assertSqliteSourceReadAllowed(pathname);
		if (!options.preserveSourceArtifacts) {
			const owned = prepareSqliteSnapshotFromLiveOwner(pathname, signal);
			if (owned) return await owned;
		}
		return prepareWorkerSnapshot(pathname, options, signal, false);
	} catch (error) {
		signal?.throwIfAborted();
		throw error;
	}
}
/** Fixed worker readers hold their own token until their private native reader closes. */
function prepareSqliteReadOnlyLocationAsync(pathname, options = {}) {
	if (hasStateDatabaseSourceExclusion(pathname)) throw new Error("SQLite source requires its existing snapshot owner");
	return prepareWorkerSnapshot(pathname, options, resolveSqliteInspectionSignal(options.signal), true);
}
function prepareWorkerSnapshot(pathname, options, signal, asynchronousCleanup) {
	signal?.throwIfAborted();
	if (asynchronousCleanup) assertStateDatabaseSourceReadContext(pathname);
	return prepareSingleFlightSqliteSnapshot(pathname, `${options.preserveSourceArtifacts ? "worker-sync" : "worker-async"}:${options.signal ? "strict" : "best-effort"}:${asynchronousCleanup ? "async-token" : "sync-token"}`, async (flightSignal, recordCleanupFailure) => {
		let stagingRoot;
		try {
			flightSignal.throwIfAborted();
			stagingRoot = await createSqliteSnapshotStagingDirectory(void 0, false, flightSignal, asynchronousCleanup);
			flightSignal.throwIfAborted();
			const location = await runSqliteReadOnlyWorker(pathname, {
				mode: options.preserveSourceArtifacts ? "sync" : "async",
				signal: flightSignal,
				stagingRoot
			});
			flightSignal.throwIfAborted();
			return adoptPreparedLocation(location, stagingRoot, options.signal !== void 0);
		} catch (error) {
			if (stagingRoot && !await removeTempDirectoryAsync(stagingRoot)) {
				const failure = new SqliteSnapshotCleanupError(`${coerceErrorMessage(error)}; SQLite snapshot cleanup failed: ${stagingRoot}`, { cause: error });
				recordCleanupFailure(failure);
				throw failure;
			}
			if (error instanceof SqliteSnapshotCleanupError || asynchronousCleanup && error instanceof AggregateError) {
				recordCleanupFailure(error);
				throw error;
			}
			flightSignal.throwIfAborted();
			throw error;
		}
	}, signal);
}
function prepareSqliteReadOnlyLocationSync(pathname) {
	if (hasStateDatabaseSourceExclusion(pathname)) return prepareSqliteReadOnlyLocationSyncInProcess(pathname);
	const stagingRoot = createSqliteSnapshotStagingDirectorySync();
	try {
		return adoptPreparedLocation(runSqliteReadOnlyWorkerSync(pathname, stagingRoot), stagingRoot);
	} catch (error) {
		if (!removeTempDirectory(stagingRoot)) throw new SqliteSnapshotCleanupError(`${coerceErrorMessage(error)}; SQLite snapshot cleanup failed: ${stagingRoot}`, { cause: error });
		throw error;
	}
}
async function prepareSqliteSnapshotSource(pathname) {
	const canonicalPath = fs.realpathSync.native(pathname);
	const journalPath = `${canonicalPath}-journal`;
	let journal;
	try {
		journal = fs.lstatSync(journalPath, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	if (!journal.isFile()) throw new Error(`SQLite rollback journal must be a regular file: ${journalPath}`);
	return await prepareSqliteReadOnlyLocation(canonicalPath);
}
async function withSqliteSnapshotSource(pathname, operation) {
	let prepared = await prepareSqliteSnapshotSource(pathname);
	try {
		try {
			return prepared ? await operation(prepared.location) : await withSqliteSourceHandleAsync(pathname, () => operation(pathname));
		} catch (error) {
			if (prepared) throw error;
			prepared = await prepareSqliteSnapshotSource(pathname);
			if (!prepared) throw error;
			return await operation(prepared.location);
		}
	} finally {
		await prepared?.cleanupAsync();
	}
}
//#endregion
export { withSqliteSnapshotSource as i, prepareSqliteReadOnlyLocationAsync as n, prepareSqliteReadOnlyLocationSync as r, prepareSqliteReadOnlyLocation as t };
