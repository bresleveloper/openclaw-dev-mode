import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { t as restoreCronLoadError } from "./load-error-DymNKrHv.mjs";
import { l as readCronJobsFingerprint, t as assertCronStoreCanPersist, u as readCronStoreFingerprints } from "./row-codec-DgIrj0Uv.mjs";
import { t as resolveCronJobsStorePath } from "./paths-C7ju4So0.mjs";
import { r as publishCronJobNames, t as invalidateCronJobNames } from "./job-name-96dek-P6.mjs";
import { t as runCronRuntimeMutation } from "./runtime-mutation-CPS1DVrM.mjs";
import { t as readCronJobNamesInDatabase } from "./job-name.kernel-Cdg79CvF.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-BU6jc44f.mjs";
import { a as saveCronStoreInDatabase, c as CronJobsStoreChangedError, i as saveCronStoreChangesInDatabase, l as restoreCronSaveError, n as isCronRuntimeOnlySave, o as prepareCronQuarantineRegistration, r as prepareCronStoreChanges } from "./save.kernel-DXaa8SoK.mjs";
import "./read-only-BnZqzQN0.mjs";
import path from "node:path";
//#region src/cron/store/quarantine.ts
/** Durable malformed-cron recovery records stored in the shared SQLite database. */
/** Reads quarantined cron rows without creating or migrating a state database. */
async function loadCronQuarantinedJobs(storePath, env = process.env) {
	const reply = await executeExistingOpenClawStateRead({ env }, {
		type: "cron.quarantine",
		storeKey: cronStoreKey(storePath)
	});
	if (reply && (!reply.ok || reply.type !== "cron.quarantine")) throw new Error("Unexpected cron quarantine observation result");
	return reply?.entries ?? [];
}
/** Await durable registration before callers archive their legacy recovery source. */
async function saveCronQuarantinedJobs(params) {
	if (params.entries.length === 0) return;
	const context = captureOpenClawStateWorkerContext();
	const input = prepareCronQuarantineRegistration(params);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
	};
	await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "cron.registerQuarantine",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
	assertCurrent();
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
	invalidateCronJobNames(storeKey);
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
function assertCronJobsStoreUnchanged(db, storePath, expectedJobsFingerprint) {
	const resolvedStorePath = path.resolve(storePath);
	if (readCronJobsFingerprint(db, cronStoreKey(resolvedStorePath)) !== expectedJobsFingerprint) throw new CronJobsStoreChangedError(resolvedStorePath);
}
/** Removes an owned declarative job family left under obsolete absolute store keys. */
async function removeStaleCronJobFamilyRows(storePath, family, opts) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	const context = captureOpenClawStateWorkerContext();
	let removed = 0;
	await runCronRuntimeMutation({
		context,
		type: "cron.removeStaleFamily",
		input: {
			storeKey,
			family: { ...family }
		},
		assertCurrent: () => opts?.commitGuard?.(),
		prepare: () => ({
			value: {},
			assertCurrent() {}
		}),
		publish: (outcome) => {
			removed = outcome.removed;
			if (removed > 0) invalidateCronJobNames();
		},
		onSettled(outcome) {
			if (outcome === "unknown") invalidateCronJobNames();
		}
	});
	return removed;
}
/** Loads only the persisted cron job store payload. */
async function loadCronJobsStore(storePath) {
	return (await loadCronJobsStoreWithConfigJobs(storePath)).store;
}
function publishCronStoreSaveRevision(storeKey, observedRevision) {
	const unchanged = getCronJobsStoreRevision(storeKey) === observedRevision;
	noteCronJobsStoreCommit(storeKey);
	return unchanged ? nextCronStoreRevision : STALE_CRON_STORE_REVISION;
}
function commitCronStoreNative(storeKey, operation, hooks, operationLabel) {
	const context = captureOpenClawStateWorkerContext();
	const observedRevision = getCronJobsStoreRevision(storeKey);
	let committed = false;
	try {
		const result = runOpenClawStateWriteTransaction((database) => {
			const value = operation(database, hooks ? {
				hooks,
				receiptSchema: prepareCronRunReceiptWriteSchema(database.db)
			} : void 0);
			deferSqlitePostCommitPublication(database.db, () => {
				committed = true;
			});
			return {
				value,
				names: readCronJobNamesInDatabase(database.db, void 0, storeKey),
				...readCronStoreFingerprints(database.db, storeKey)
			};
		}, {}, operationLabel ? { operationLabel } : void 0);
		const revision = publishCronStoreSaveRevision(storeKey, observedRevision);
		if (committed && revision !== STALE_CRON_STORE_REVISION) publishCronJobNames(storeKey, context, result.names);
		hooks?.afterCommit?.();
		return {
			...result,
			revision
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
			if (revision !== STALE_CRON_STORE_REVISION) publishCronJobNames(storeKey, context, result.names);
			return {
				value: result.value,
				revision,
				jobsFingerprint: result.jobsFingerprint,
				runtimeFingerprint: result.runtimeFingerprint
			};
		});
	} catch (error) {
		if (!received) noteCronJobsStoreCommit(storeKey);
		throw error;
	}
}
/** Maintenance hooks retain their owning synchronous database transaction. */
function saveCronJobsStoreChangesNative(storePath, previous, next, opts) {
	assertCronStoreCanPersist(next);
	const storeKey = cronStoreKey(path.resolve(storePath));
	const prepared = prepareCronStoreChanges(previous, next);
	if (prepared.changedIds.size === 0) return previous;
	const { transactionHooks, ...options } = opts ?? {};
	return commitCronStoreNative(storeKey, ({ db }, admittedHooks) => saveCronStoreChangesInDatabase(db, storeKey, storeKey, prepared, options, admittedHooks), transactionHooks, "cron.config-mutation").value;
}
/** Commits maintenance changes against authoritative SQLite state. */
async function saveCronJobsStoreChanges(storePath, previous, next, opts) {
	if (opts?.transactionHooks) return saveCronJobsStoreChangesNative(storePath, previous, next, opts);
	assertCronStoreCanPersist(next);
	const storeKey = cronStoreKey(path.resolve(storePath));
	const prepared = prepareCronStoreChanges(previous, next);
	if (prepared.changedIds.size === 0) return previous;
	const { transactionHooks: _hooks, ...options } = opts ?? {};
	const input = structuredClone({
		storeKey,
		changes: prepared,
		options
	});
	return (await saveCronStoreWithWorker(storeKey, (scope) => scope.execute({
		type: "cron.saveChanges",
		input
	}))).value;
}
/** Doctor fingerprint hooks retain their owning synchronous database transaction. */
function saveCronJobsStoreWithRevisionNative(storePath, store, opts) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	if (!isCronRuntimeOnlySave(opts)) assertCronStoreCanPersist(store);
	const { transactionHooks, ...options } = opts ?? {};
	return commitCronStoreNative(storeKey, (database, admittedHooks) => {
		saveCronStoreInDatabase(database, storeKey, store, options, admittedHooks);
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
export { loadCronStore as a, resolveCronStorePath as c, saveCronJobsStoreWithRevision as d, saveCronStore as f, loadCronJobsStoreWithConfigJobs as i, saveCronJobsStore as l, saveCronQuarantinedJobs as m, getCronJobsStoreRevision as n, noteCronJobsStoreCommit as o, loadCronQuarantinedJobs as p, loadCronJobsStore as r, removeStaleCronJobFamilyRows as s, assertCronJobsStoreUnchanged as t, saveCronJobsStoreChanges as u };
