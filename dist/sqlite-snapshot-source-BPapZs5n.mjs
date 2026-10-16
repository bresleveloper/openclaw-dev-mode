import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { s as readDatabaseFileIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createRetainedOperation } from "./retained-operation-CODoIe4t.mjs";
import { m as resolvePrivateSqliteSnapshotStagingRoot, n as createSqliteSnapshotStagingDirectory, r as createSqliteSnapshotStagingDirectorySync } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { c as removeTempDirectory, l as removeTempDirectoryAsync, n as adoptPreparedLocation, r as adoptRetainedPreparedLocation, t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { i as startSingleFlightSqliteSnapshot, r as prepareSingleFlightSqliteSnapshot, t as prepareSqliteSnapshotFromLiveOwner } from "./sqlite-live-snapshot-yZ74F32m.mjs";
import { c as resolveSqliteInspectionSignal, f as runSqliteReadOnlyWorker, i as isSqliteInspectionDeadlineOwnedByCaller, m as runSqliteReadOnlyWorkerSync, t as captureSqliteReadOnlyWorkerLaunch } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { n as captureSqliteSnapshotStagingOwner } from "./sqlite-snapshot-staging-owner-hwIZF_n9.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-snapshot-source.ts
async function prepareSqliteReadOnlyLocation(pathname, options = {}) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	try {
		signal?.throwIfAborted();
		if (!options.preserveSourceArtifacts && options.allowLiveOwner !== false) {
			const owned = prepareSqliteSnapshotFromLiveOwner(pathname, signal);
			if (owned) return await owned;
		}
		return prepareWorkerSnapshot(pathname, options, signal);
	} catch (error) {
		signal?.throwIfAborted();
		throw error;
	}
}
function startSqliteReadOnlyLocationAsync(inputPathname, options = {}) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	signal?.throwIfAborted();
	const pathname = path.resolve(inputPathname);
	const preserveSourceArtifacts = options.preserveSourceArtifacts === true;
	const expectedSourceIdentity = options.expectedSourceIdentity === void 0 ? void 0 : readDatabaseFileIdentity(options.expectedSourceIdentity);
	if (expectedSourceIdentity && !preserveSourceArtifacts) throw new Error("SQLite source identity requires artifact-preserving preparation");
	const requireCleanup = options.signal !== void 0;
	const { env, cwd } = captureSqliteReadOnlyWorkerLaunch();
	const root = resolvePrivateSqliteSnapshotStagingRoot();
	const deadlineOwnedByCaller = isSqliteInspectionDeadlineOwnedByCaller();
	const staging = captureSqliteSnapshotStagingOwner();
	const runInContext = AsyncLocalStorage.snapshot();
	return startSingleFlightSqliteSnapshot(pathname, `${preserveSourceArtifacts ? "worker-sync" : "worker-async"}:${requireCleanup ? "strict" : "best-effort"}:async-token${expectedSourceIdentity ? `:${JSON.stringify(expectedSourceIdentity)}` : ""}`, (flightSignal, recordCleanupFailure) => runInContext(() => {
		let task;
		let prepared;
		let cleanup;
		const retained = createRetainedOperation(() => runInContext(() => {
			if (retained.operation.read().status !== "pending") return;
			if (!task) return;
			try {
				task.service();
				const outcome = task.read();
				if (outcome.status === "pending") return;
				if (outcome.status === "rejected") {
					if (outcome.error instanceof SqliteSnapshotCleanupError || outcome.error instanceof AggregateError) {
						recordCleanupFailure(outcome.error);
						throw outcome.error;
					}
					flightSignal.throwIfAborted();
					throw outcome.error;
				}
				if (outcome.value.type !== "prepared") throw new Error("SQLite snapshot producer returned an allocation without its prepared location");
				prepared ??= adoptRetainedPreparedLocation(outcome.value.location, outcome.value.directory, requireCleanup);
				if (flightSignal.aborted) {
					if (!cleanup) {
						cleanup = prepared.startCleanup();
						cleanup.result.then(() => retained.operation.service(), () => retained.operation.service());
					}
					cleanup.service();
					const removed = cleanup.read();
					if (removed.status === "pending") return;
					if (removed.status === "rejected" || !removed.value) {
						const error = removed.status === "rejected" ? removed.error : new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${prepared.cleanupRoot}`);
						recordCleanupFailure(error);
						throw error;
					}
					flightSignal.throwIfAborted();
				}
				retained.resolve(prepared);
			} catch (error) {
				retained.reject(error);
			}
		}));
		try {
			task = staging.start({
				type: "prepare",
				root,
				pathname,
				allowLegacyWorker: false,
				preserveSourceArtifacts,
				expectedSourceIdentity,
				deadlineOwnedByCaller,
				launch: {
					env,
					cwd,
					transport: { kind: "native" }
				}
			}, flightSignal);
			task.result.then(() => retained.operation.service(), () => retained.operation.service());
		} catch (error) {
			retained.reject(error);
		}
		return {
			...retained.operation,
			startClose() {
				const original = task;
				if (original) return runInContext(() => original.startClose());
				const closed = createRetainedOperation(() => {});
				closed.resolve(void 0);
				return closed.operation;
			}
		};
	}), signal, { scope: staging });
}
function prepareWorkerSnapshot(pathname, options, signal) {
	signal?.throwIfAborted();
	return prepareSingleFlightSqliteSnapshot(pathname, `${options.preserveSourceArtifacts ? "worker-sync" : "worker-async"}:${options.signal ? "strict" : "best-effort"}:sync-token`, async (flightSignal, recordCleanupFailure) => {
		let stagingRoot;
		try {
			flightSignal.throwIfAborted();
			stagingRoot = await createSqliteSnapshotStagingDirectory(void 0, false, flightSignal);
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
			if (error instanceof SqliteSnapshotCleanupError) {
				recordCleanupFailure(error);
				throw error;
			}
			flightSignal.throwIfAborted();
			throw error;
		}
	}, signal);
}
function prepareSqliteReadOnlyLocationSync(pathname) {
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
			return prepared ? await operation(prepared.location) : await operation(pathname);
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
/** Fresh bytes without opening SQLite or making another durable private copy. */
function readSqliteSourceContentVersionSync(pathname) {
	return runSqliteReadOnlyWorkerSync(pathname, void 0, "content-version") || void 0;
}
//#endregion
export { withSqliteSnapshotSource as a, startSqliteReadOnlyLocationAsync as i, prepareSqliteReadOnlyLocationSync as n, readSqliteSourceContentVersionSync as r, prepareSqliteReadOnlyLocation as t };
