import { t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as fingerprintCronRuntimeRows, i as fingerprintCronJobRows, n as deleteCronJobRowInDatabase, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-DgIrj0Uv.mjs";
import { t as loadCronRuntimeAuthorities } from "./runtime-authority-store-Dhn3MVqB.mjs";
import { o as isAgentDeletionBlocked } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { t as readCronJobNamesInDatabase } from "./job-name.kernel-Cdg79CvF.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-BU6jc44f.mjs";
import { a as saveCronStoreInDatabase, c as CronJobsStoreChangedError, i as saveCronStoreChangesInDatabase, t as assertCronStoreChangesCurrent } from "./save.kernel-DXaa8SoK.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { a as adjudicateActiveCronRunReceiptInDatabase, m as findActiveCronRunReceiptInDatabase, n as CronRunReceiptConflictError } from "./run-receipt-store-BI8RC7qi.mjs";
import { n as prepareCronRuntimeMutation, r as retainCronRuntimeMutationOutcome } from "./runtime-mutation.worker-Cxvhz87W.mjs";
import { t as findCronRunRecoveryInDatabase } from "./run-history-recovery-Gkd5DHMF.mjs";
import { n as retireCronRunTriggerStateInDatabase } from "./run-receipt-trigger-state-CWhPzp_b.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/cron/store/guarded-mutation.worker.ts
function loadCronMutationStore(db, storeKey) {
	const rows = loadCronRows(db, storeKey);
	const store = loadedCronStoreFromRows(rows).store;
	loadCronRuntimeAuthorities({
		db,
		storeKey,
		jobs: store.jobs
	});
	return {
		store,
		jobsFingerprint: fingerprintCronJobRows(rows),
		runtimeFingerprint: fingerprintCronRuntimeRows(rows)
	};
}
function retireCronMutationTriggerState(db, storeKey, jobId) {
	const active = findActiveCronRunReceiptInDatabase({
		database: db,
		storePath: storeKey,
		jobId
	});
	if (active) {
		retireCronRunTriggerStateInDatabase({
			database: db,
			handle: active
		});
		return;
	}
	const job = loadedCronStoreFromRows(loadCronRows(db, storeKey, /* @__PURE__ */ new Set([jobId]))).store.jobs[0];
	const startedAtMs = job?.state.runningAtMs;
	if (!job || startedAtMs === void 0) return;
	const receiptId = job.state.runningReceiptId ?? findCronRunRecoveryInDatabase({
		database: db,
		jobId,
		storeKey,
		startedAt: startedAtMs
	}).receiptId;
	if (receiptId) retireCronRunTriggerStateInDatabase({
		database: db,
		handle: {
			receiptId,
			storeKey,
			jobId,
			startedAtMs
		}
	});
}
function applyCronReceiptMutation(db, input, nowMs) {
	const mutation = input.receiptMutation;
	if (!mutation) return;
	if (mutation.scheduleChanged) {
		const nextJob = input.replacement ? input.replacement.store.jobs.find((job) => job.id === mutation.jobId) : input.changes.nextById.get(mutation.jobId);
		if (!nextJob) throw new Error("Cron schedule mutation has no target job");
		if (loadedCronStoreFromRows(loadCronRows(db, input.storeKey, /* @__PURE__ */ new Set([mutation.jobId]))).store.jobs[0]?.state.runningAtMs !== void 0) nextJob.state.runningScheduleChangeId = randomUUID();
		else delete nextJob.state.runningScheduleChangeId;
	}
	if (mutation.triggerStateChanged) retireCronMutationTriggerState(db, input.storeKey, mutation.jobId);
	if (mutation.owner) adjudicateActiveCronRunReceiptInDatabase({
		database: db,
		jobId: mutation.jobId,
		prepared: mutation.owner,
		finishedAtMs: nowMs
	});
}
function mutateCronJobsInWorker(database, input) {
	let transactionRefusal;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			try {
				const receiptSchema = prepareCronRunReceiptWriteSchema(db);
				const preparation = prepareCronRuntimeMutation("cron.mutateJobs", input.nonce, { deletionBlocked: input.agentId !== void 0 && isAgentDeletionBlocked(input.agentId, {}, db) });
				if (input.preconditionJob || input.expectedJob || input.replacement) {
					const current = loadCronMutationStore(db, input.storeKey);
					if (input.replacement && (current.jobsFingerprint !== input.replacement.jobsFingerprint || current.runtimeFingerprint !== input.replacement.runtimeFingerprint)) throw new CronJobsStoreChangedError(input.storeKey);
					const currentById = new Map(current.store.jobs.map((job) => [job.id, job]));
					const expected = input.expectedJob;
					const expectedCurrent = expected ? currentById.get(expected.id) : void 0;
					if (expected && (!expectedCurrent || resolveCronJobConfigRevision(expectedCurrent) !== expected.configRevision)) throw new CronJobsStoreChangedError(input.storeKey);
					if (input.preconditionJob && !isDeepStrictEqual(structuredClone(currentById.get(input.preconditionJob.id)), input.preconditionJob)) throw new CronJobsStoreChangedError(input.storeKey);
					if (input.replacement) {
						for (const [jobId, previous] of input.changes.previousById) {
							const currentJob = currentById.get(jobId);
							if (!isDeepStrictEqual(structuredClone(currentJob?.runtimeAuthority), previous.runtimeAuthority) || currentJob?.runtimeAuthorityRecoveryRequired === true !== (previous.runtimeAuthorityRecoveryRequired === true)) throw new CronJobsStoreChangedError(input.storeKey);
						}
						assertCronStoreChangesCurrent(input.changes, currentById, input.storeKey);
					}
				}
				const hooks = {
					receiptSchema,
					hooks: { beforeWrite: () => {
						applyCronReceiptMutation(db, input, preparation.nowMs);
					} }
				};
				if (input.replacement) {
					for (const jobId of input.changes.changedIds) if (!input.changes.nextById.has(jobId)) deleteCronJobRowInDatabase(db, input.storeKey, jobId);
					saveCronStoreInDatabase(database, input.storeKey, input.replacement.store, input.replacement.options, hooks);
				} else saveCronStoreChangesInDatabase(db, input.storeKey, input.storeKey, input.changes, void 0, hooks);
				const outcome = {
					...loadCronMutationStore(db, input.storeKey),
					names: readCronJobNamesInDatabase(db, void 0, input.storeKey)
				};
				return retainCronRuntimeMutationOutcome("cron.mutateJobs", db, input.nonce, outcome);
			} catch (error) {
				if (error instanceof CronJobsStoreChangedError || error instanceof CronRunReceiptConflictError) transactionRefusal = error;
				throw error;
			}
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "cron.config-mutation" });
	} catch (error) {
		if (!transactionRefusal || error !== transactionRefusal) throw error;
		assertTransactionUsable(database.db);
		if (!database.db.isOpen || database.db.isTransaction) throw error;
		return {
			nonce: input.nonce,
			mutationRefusal: transactionRefusal instanceof CronRunReceiptConflictError ? {
				kind: "receipt-conflict",
				receipt: transactionRefusal.receipt
			} : { kind: "store-changed" }
		};
	}
}
//#endregion
export { mutateCronJobsInWorker };
