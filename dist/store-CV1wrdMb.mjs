import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-GOquVAYK.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { c as removeTempDirectoryAsync, l as retainSnapshotTempDirectory, u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { n as createSqliteSnapshotStagingDirectory } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { g as prepareStateDatabaseSourceExclusion, h as hasStateDatabaseSourceExclusion, l as acquireStateDatabaseHandleLease, p as captureStateDatabaseCoordinatorRuntime } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { n as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { r as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { n as restoreCronLoadError, t as loadCronStoreFromDatabase } from "./load.kernel-bWRpwlYl.mjs";
import { l as readCronJobsFingerprint, r as deleteStaleCronJobFamilyRows, t as assertCronStoreCanPersist } from "./row-codec-mXerryYi.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobsStorePath } from "./paths-Bz2goYfd.mjs";
import { a as saveCronStoreInDatabase, d as saveCronQuarantinedJobs, i as saveCronStoreChangesInDatabase, l as deleteCronQuarantinedJobsFromDatabase, n as prepareCronStoreChanges, o as CronJobsStoreChangedError, r as replaceCronStoreRowsInDatabase, s as restoreCronSaveError, t as isCronRuntimeOnlySave } from "./save.kernel-BmIaenr0.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/cron/store/read-only.ts
function emptyLoadedCronStore() {
	return {
		store: {
			version: 1,
			jobs: []
		},
		configJobs: [],
		configJobIndexes: [],
		configJobRuntimeEntries: [],
		invalidConfigRows: []
	};
}
/** Loads cron jobs from existing SQLite state without creating or migrating it. */
async function loadCronJobsStoreWithConfigJobsReadOnly(storePath, env = process.env) {
	const statePath = resolveOpenClawStateSqlitePath(env);
	if (!fs.existsSync(statePath)) return emptyLoadedCronStore();
	const storeKey = cronStoreKey(storePath);
	const preserveArtifacts = isArtifactPreservingStateRead();
	const assertExcluded = hasStateDatabaseSourceExclusion(statePath) ? prepareStateDatabaseSourceExclusion(statePath) : void 0;
	const coordinatorRuntime = captureStateDatabaseCoordinatorRuntime();
	const admission = !assertExcluded ? captureOpenClawStateDatabaseReadAdmission(statePath) : void 0;
	const identity = admission?.identity ?? inspectDatabasePathIdentitySync(statePath);
	const canonicalPath = identity?.canonicalPath ?? path.resolve(statePath);
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	ensureSqliteLibrarySelected();
	const environment = { ...process.env };
	const environmentBytes = Object.entries(environment).reduce((bytes, [key, value]) => bytes + Buffer.byteLength(key) + Buffer.byteLength(value ?? ""), 0);
	const pool = new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("cronReadOnly"),
		workerOptions: { env: environment },
		maxWorkers: 1,
		sharedCompute: true
	});
	const controller = new AbortController();
	const producerSettled = createDeferredCore();
	let sourcePin;
	let prepared;
	let stagingRoot;
	let releaseSnapshot;
	let workerStopped = false;
	let cleaned = false;
	let cleanupPending;
	const cleanup = () => {
		if (cleaned) return Promise.resolve();
		return cleanupPending ??= (async () => {
			if (!workerStopped) {
				await pool.close();
				workerStopped = true;
			}
			await producerSettled.promise;
			releaseSnapshot?.();
			releaseSnapshot = void 0;
			if (prepared) {
				if (!await prepared.cleanupAsync()) throw new Error("Cron read-only state snapshot cleanup failed.");
				prepared = void 0;
			}
			if (stagingRoot) {
				if (!await removeTempDirectoryAsync(stagingRoot)) throw new Error("Cron read-only state snapshot cleanup failed.");
				stagingRoot = void 0;
			}
			sourcePin?.release();
			sourcePin = void 0;
			cleaned = true;
			unregister();
		})().finally(() => {
			cleanupPending = void 0;
		});
	};
	const resource = { async close(target) {
		if (!target || target.key === identity?.key || target.canonicalPath === canonicalPath) {
			controller.abort(/* @__PURE__ */ new Error("Cron read-only load closed"));
			await cleanup();
		}
	} };
	const unregister = registerOpenClawStateDatabaseAsyncResource(resource);
	const run = async () => {
		let loaded = emptyLoadedCronStore();
		try {
			maintenance?.own(resource, "shared-resources", () => resource.close());
			sourcePin = assertExcluded ? acquireStateDatabaseHandleLease({ databasePath: statePath }) : void 0;
			if (assertExcluded && preserveArtifacts) {
				prepared = prepareSqliteReadOnlyLocationSync(statePath);
				releaseSnapshot = retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
			}
			if (preserveArtifacts && !assertExcluded) {
				stagingRoot = await createSqliteSnapshotStagingDirectory(void 0, false, controller.signal, true);
				releaseSnapshot = retainSnapshotTempDirectory(stagingRoot);
			}
			const location = prepared?.location ?? statePath;
			controller.signal.throwIfAborted();
			assertExcluded?.();
			admission?.assertCurrent();
			const result = await pool.run({
				location,
				storeKey,
				stagingRoot,
				coordinatorRuntime
			}, {
				signal: controller.signal,
				inputBytes: Buffer.byteLength(location) + Buffer.byteLength(storeKey) + Buffer.byteLength(stagingRoot ?? "") + Buffer.byteLength(coordinatorRuntime.directory) + environmentBytes
			});
			if (!result.ok) throw restoreCronLoadError(result.error);
			loaded = result.loaded ?? loaded;
		} finally {
			producerSettled.resolve();
			await cleanup();
		}
		controller.signal.throwIfAborted();
		assertExcluded?.();
		admission?.assertCurrent();
		return loaded;
	};
	return await retainSnapshotWork(run(), () => controller.abort(/* @__PURE__ */ new Error("Cron read-only load closed")));
}
//#endregion
//#region src/cron/store.ts
/** Public cron store load/save API backed entirely by shared SQLite state. */
const MAX_TRACKED_CRON_STORE_REVISIONS = 64;
const STALE_CRON_STORE_REVISION = -1;
const cronStoreRevisions = /* @__PURE__ */ new Map();
let nextCronStoreRevision = 0;
/** Reads the process-local committed revision for one canonical SQLite partition. */
function getCronJobsStoreRevision(storePath) {
	return cronStoreRevisions.get(cronStoreKey(storePath)) ?? nextCronStoreRevision;
}
function noteCronJobsStoreCommit(storeKey) {
	cronStoreRevisions.delete(storeKey);
	cronStoreRevisions.set(storeKey, ++nextCronStoreRevision);
	pruneMapToMaxSize(cronStoreRevisions, MAX_TRACKED_CRON_STORE_REVISIONS);
}
/** Loads cron jobs plus config/runtime sidecars from the SQLite-backed store. */
async function loadCronJobsStoreWithConfigJobs(storePath) {
	const storeKey = cronStoreKey(storePath);
	const context = captureOpenClawStateWorkerContext();
	let received = false;
	try {
		return await runOpenClawStateWorkerOperation(context, async (scope) => {
			const result = await scope.execute({
				type: "cron.loadMutable",
				input: { storeKey }
			});
			received = true;
			for (let index = 0; index < result.repairCommits; index += 1) noteCronJobsStoreCommit(storeKey);
			if (!result.ok) {
				if (result.repairCommits === 0) noteCronJobsStoreCommit(storeKey);
				throw restoreCronLoadError(result.error);
			}
			return result.loaded;
		});
	} catch (error) {
		if (!received) noteCronJobsStoreCommit(storeKey);
		throw error;
	}
}
function loadMutableCronStore(storePath) {
	const database = openOpenClawStateDatabase();
	const storeKey = cronStoreKey(path.resolve(storePath));
	return loadCronStoreFromDatabase(database.db, storeKey, {
		write: (operation, operationLabel) => runOpenClawStateWriteTransaction(({ db }) => operation(db), { database }, { operationLabel }),
		committed: () => noteCronJobsStoreCommit(storeKey)
	});
}
function assertCronJobsStoreUnchanged(db, storePath, expectedJobsFingerprint) {
	const resolvedStorePath = path.resolve(storePath);
	if (readCronJobsFingerprint(db, cronStoreKey(resolvedStorePath)) !== expectedJobsFingerprint) throw new CronJobsStoreChangedError(resolvedStorePath);
}
/** Removes an owned declarative job family left under obsolete absolute store keys. */
function removeStaleCronJobFamilyRows(storePath, family) {
	const activeStoreKey = cronStoreKey(path.resolve(storePath));
	return runOpenClawStateWriteTransaction(({ db }) => deleteStaleCronJobFamilyRows(db, activeStoreKey, family), {}, { operationLabel: "cron.job-family-adoption" });
}
/** Loads only the persisted cron job store payload. */
async function loadCronJobsStore(storePath) {
	return (await loadCronJobsStoreWithConfigJobs(storePath)).store;
}
/** Synchronously loads only the persisted cron job store payload. */
function loadCronJobsStoreSync(storePath) {
	return loadMutableCronStore(storePath).store;
}
function publishCronStoreSaveRevision(storeKey, observedRevision) {
	const unchanged = getCronJobsStoreRevision(storeKey) === observedRevision;
	noteCronJobsStoreCommit(storeKey);
	return unchanged ? nextCronStoreRevision : STALE_CRON_STORE_REVISION;
}
function commitCronStoreNative(storeKey, operation, hooks, operationLabel) {
	const observedRevision = getCronJobsStoreRevision(storeKey);
	let committed = false;
	try {
		const value = runOpenClawStateWriteTransaction((database) => {
			const result = operation(database);
			deferSqlitePostCommitPublication(database.db, () => {
				committed = true;
			});
			return result;
		}, {}, operationLabel ? { operationLabel } : void 0);
		hooks?.afterCommit?.();
		return {
			value,
			revision: publishCronStoreSaveRevision(storeKey, observedRevision)
		};
	} catch (error) {
		if (committed) noteCronJobsStoreCommit(storeKey);
		throw error;
	}
}
async function saveCronStoreWithWorker(storeKey, operation) {
	const observedRevision = getCronJobsStoreRevision(storeKey);
	const context = captureOpenClawStateWorkerContext();
	let received = false;
	try {
		return await runOpenClawStateWorkerOperation(context, async (scope) => {
			const result = await operation(scope);
			received = true;
			const revision = result.committed || !result.ok ? publishCronStoreSaveRevision(storeKey, observedRevision) : observedRevision;
			if (!result.ok) throw restoreCronSaveError(result.error);
			return {
				value: result.value,
				revision
			};
		});
	} catch (error) {
		if (!received) noteCronJobsStoreCommit(storeKey);
		throw error;
	}
}
/** Internal synchronous entry for callers whose authority callbacks must not yield before commit. */
function saveCronJobsStoreChangesWithRevisionNative(storePath, previous, next, opts) {
	assertCronStoreCanPersist(next);
	const storeKey = cronStoreKey(path.resolve(storePath));
	const prepared = prepareCronStoreChanges(previous, next);
	if (prepared.changedIds.size === 0) return {
		value: previous,
		revision: getCronJobsStoreRevision(storeKey)
	};
	const { transactionHooks, ...options } = opts ?? {};
	return commitCronStoreNative(storeKey, ({ db }) => saveCronStoreChangesInDatabase(db, storeKey, storeKey, prepared, options, transactionHooks), transactionHooks, "cron.config-mutation");
}
/** Commits scheduler-disabled CRUD rows and retains this operation's revision fact. */
async function saveCronJobsStoreChangesWithRevision(storePath, previous, next, opts) {
	if (opts?.transactionHooks) return saveCronJobsStoreChangesWithRevisionNative(storePath, previous, next, opts);
	assertCronStoreCanPersist(next);
	const storeKey = cronStoreKey(path.resolve(storePath));
	const prepared = prepareCronStoreChanges(previous, next);
	if (prepared.changedIds.size === 0) return {
		value: previous,
		revision: getCronJobsStoreRevision(storeKey)
	};
	const { transactionHooks: _hooks, ...options } = opts ?? {};
	const input = structuredClone({
		storeKey,
		changes: prepared,
		options
	});
	return await saveCronStoreWithWorker(storeKey, (scope) => scope.execute({
		type: "cron.saveChanges",
		input
	}));
}
/** Commits only scheduler-disabled CRUD rows against authoritative SQLite state. */
async function saveCronJobsStoreChanges(storePath, previous, next, opts) {
	return (await saveCronJobsStoreChangesWithRevision(storePath, previous, next, opts)).value;
}
/** Internal synchronous entry preserving the caller's consumed guard/capture window. */
function saveCronJobsStoreWithRevisionNative(storePath, store, opts) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	if (!isCronRuntimeOnlySave(opts)) assertCronStoreCanPersist(store);
	const { transactionHooks, ...options } = opts ?? {};
	return commitCronStoreNative(storeKey, (database) => {
		saveCronStoreInDatabase(database, storeKey, store, options, transactionHooks);
	}, transactionHooks);
}
/** Persist cron data and return only this operation's publication revision. */
async function saveCronJobsStoreWithRevision(storePath, store, opts) {
	if (opts?.transactionHooks) return saveCronJobsStoreWithRevisionNative(storePath, store, opts);
	const storeKey = cronStoreKey(path.resolve(storePath));
	if (!isCronRuntimeOnlySave(opts)) assertCronStoreCanPersist(store);
	const { transactionHooks: _hooks, ...options } = opts ?? {};
	const input = structuredClone({
		storeKey,
		store,
		options
	});
	return await saveCronStoreWithWorker(storeKey, (scope) => scope.execute({
		type: "cron.save",
		input
	}));
}
/** Persists cron jobs, or only mutable runtime state when stateOnly is set. */
async function saveCronJobsStore(storePath, store, opts) {
	await saveCronJobsStoreWithRevision(storePath, store, opts);
}
/** Atomically acquire doctor migration metadata and replace cron rows only for the winner. */
async function saveCronJobsStoreWithMetadata(storePath, store, acquireMetadata, opts) {
	const resolvedStorePath = path.resolve(storePath);
	const storeKey = cronStoreKey(resolvedStorePath);
	assertCronStoreCanPersist(store);
	const committed = runOpenClawStateWriteTransaction((database) => {
		if (!acquireMetadata(database.db)) return false;
		if (opts?.quarantine?.entries.length) saveCronQuarantinedJobs({
			storePath: resolvedStorePath,
			entries: opts.quarantine.entries,
			nowMs: opts.quarantine.nowMs,
			database
		});
		if (opts?.deleteQuarantineEntries?.length) deleteCronQuarantinedJobsFromDatabase({
			database: database.db,
			storePath: resolvedStorePath,
			entries: opts.deleteQuarantineEntries
		});
		replaceCronStoreRowsInDatabase(database.db, storeKey, store, opts?.preserveRuntimeState === true);
		return true;
	});
	if (committed) noteCronJobsStoreCommit(storeKey);
	return committed;
}
/** Resolves the public plugin-SDK cron store path. */
function resolveCronStorePath(storePath) {
	return resolveCronJobsStorePath(storePath);
}
/** Plugin-SDK alias for loading the cron store. */
async function loadCronStore(storePath) {
	return await loadCronJobsStore(storePath);
}
/** Plugin-SDK alias for saving the cron store. */
async function saveCronStore(storePath, store, opts) {
	await saveCronJobsStore(storePath, store, opts);
}
//#endregion
export { saveCronStore as _, loadCronJobsStoreWithConfigJobs as a, removeStaleCronJobFamilyRows as c, saveCronJobsStoreChanges as d, saveCronJobsStoreChangesWithRevision as f, saveCronJobsStoreWithRevisionNative as g, saveCronJobsStoreWithRevision as h, loadCronJobsStoreSync as i, resolveCronStorePath as l, saveCronJobsStoreWithMetadata as m, getCronJobsStoreRevision as n, loadCronStore as o, saveCronJobsStoreChangesWithRevisionNative as p, loadCronJobsStore as r, noteCronJobsStoreCommit as s, assertCronJobsStoreUnchanged as t, saveCronJobsStore as u, loadCronJobsStoreWithConfigJobsReadOnly as v };
