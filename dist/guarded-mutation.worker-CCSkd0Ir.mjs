import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as isAgentDeletionBlocked } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { h as updateCronRuntimeRow, o as loadCronRows, s as loadedCronStoreFromRows, v as projectCronJobStateThroughStorageCodec, y as cronSchedulingInputsEqual } from "./row-codec-Cnnqjh5r.mjs";
import { t as loadCronRuntimeAuthorities } from "./runtime-authority-store-kOMa-5fA.mjs";
import { a as recordSkippedCronRequestInDatabase } from "./run-history.kernel-BxXbzyDp.mjs";
import { t as readCronJobNamesInDatabase } from "./job-name.kernel-A6aOQAeD.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-u-R2z7LI.mjs";
import { t as CronJobsStoreChangedError } from "./save-error-BrzBbDk8.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { n as prepareCronStoreChanges, r as saveCronStoreChangesInDatabase } from "./save.kernel-Cq5V3z2e.mjs";
import { a as finishCronRunReceiptInDatabase, i as findActiveCronRunReceiptInDatabase } from "./run-receipt-store-Bik3uOzB.mjs";
import { t as CronAgentDeletionBlockedError } from "./agent-availability-BGEhaGyB.mjs";
import { t as findCronRunRecoveryInDatabase } from "./run-history-recovery-BhC_KZut.mjs";
import { r as resolveCronJobMutationSnapshot, t as planCronJobMutation } from "./job-mutations.worker-C9WEEUT7.mjs";
import { n as retireCronRunTriggerStateInDatabase } from "./run-receipt-trigger-state-EpH_d8bo.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/store/guarded-mutation.worker.ts
function loadCronMutationStore(db, storeKey) {
	const rows = loadCronRows(db, storeKey);
	const store = loadedCronStoreFromRows(rows).store;
	loadCronRuntimeAuthorities({
		db,
		storeKey,
		jobs: store.jobs
	});
	return store;
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
function applyCronReceiptMutation(db, input, changes) {
	const mutation = input.receiptMutation;
	if (!mutation) return;
	if (mutation.scheduleChanged) {
		const nextJob = changes.nextById.get(mutation.jobId);
		if (!nextJob) throw new Error("Cron schedule mutation has no target job");
		if (loadedCronStoreFromRows(loadCronRows(db, input.storeKey, /* @__PURE__ */ new Set([mutation.jobId]))).store.jobs[0]?.state.runningAtMs !== void 0) nextJob.state.runningScheduleChangeId = randomUUID();
		else delete nextJob.state.runningScheduleChangeId;
	}
	if (mutation.triggerStateChanged) retireCronMutationTriggerState(db, input.storeKey, mutation.jobId);
}
function cancelChangedQueuedRuns(db, input, changes, previousJobs, currentStore, receiptSchema) {
	const currentJobs = new Map(currentStore.jobs.map((job) => [job.id, job]));
	for (const previous of previousJobs) {
		if (previous.state.queuedAtMs === void 0 || !changes.changedIds.has(previous.id)) continue;
		const current = currentJobs.get(previous.id);
		const rearmedExit = current && previous.schedule.kind === "on-exit" && !previous.enabled && current.enabled && cronSchedulingInputsEqual({
			...previous,
			enabled: true
		}, current);
		if (current && (cronSchedulingInputsEqual(previous, current) || rearmedExit)) continue;
		const receipt = findActiveCronRunReceiptInDatabase({
			database: db,
			storePath: input.storeKey,
			jobId: previous.id
		});
		const error = current ? "cron: queued job schedule changed or was disabled" : "cron: queued job was removed";
		if (receipt && receipt.startedAtMs === previous.state.queuedAtMs) {
			finishCronRunReceiptInDatabase({
				database: db,
				receiptSchema,
				handle: receipt,
				pendingReceiptId: current?.state.runningAtMs === void 0 ? void 0 : current.state.runningReceiptId,
				status: "skipped",
				finishedAtMs: input.snapshot.nowMs,
				error
			});
			recordSkippedCronRequestInDatabase(db, {
				storeKey: input.storeKey,
				jobId: receipt.jobId,
				receiptId: receipt.receiptId,
				agentId: receipt.agentId,
				startedAt: receipt.startedAtMs,
				endedAt: input.snapshot.nowMs,
				error,
				nextRunAtMs: current?.state.nextRunAtMs
			});
		}
		if (current?.state.queuedAtMs === previous.state.queuedAtMs) {
			delete current.state.queuedAtMs;
			updateCronRuntimeRow(db, input.storeKey, current);
		}
	}
}
function mutateCronJobsInWorker(database, input) {
	const mutationSnapshot = resolveCronJobMutationSnapshot(input.storeKey, input.snapshot, database.path);
	const preconditionJob = input.preconditionJob ? {
		...input.preconditionJob,
		state: projectCronJobStateThroughStorageCodec(input.preconditionJob.state)
	} : void 0;
	let transactionRefusal;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			try {
				const receiptSchema = prepareCronRunReceiptWriteSchema(db);
				const previous = loadCronMutationStore(db, input.storeKey);
				if (input.agentId !== void 0 && isAgentDeletionBlocked(input.agentId, {}, db)) throw new CronAgentDeletionBlockedError(input.agentId);
				const expected = input.expectedJob;
				const expectedCurrent = expected ? previous.jobs.find((job) => job.id === expected.id) : void 0;
				if (expected && (!expectedCurrent || resolveCronJobConfigRevision(expectedCurrent) !== expected.configRevision)) throw new CronJobsStoreChangedError(input.storeKey);
				if (preconditionJob) {
					const current = previous.jobs.find((job) => job.id === preconditionJob.id);
					if (!current || !isDeepStrictEqual({
						...structuredClone(current),
						state: projectCronJobStateThroughStorageCodec(current.state)
					}, preconditionJob)) throw new CronJobsStoreChangedError(input.storeKey);
				}
				const plan = planCronJobMutation(previous, input.jobMutation, mutationSnapshot);
				const changes = prepareCronStoreChanges(previous, plan.next);
				const hooks = {
					receiptSchema,
					hooks: { beforeWrite: () => {
						applyCronReceiptMutation(db, input, changes);
					} }
				};
				const store = saveCronStoreChangesInDatabase(db, input.storeKey, input.storeKey, changes, void 0, hooks);
				cancelChangedQueuedRuns(db, input, changes, previous.jobs, store, receiptSchema);
				return { outcome: {
					store,
					names: readCronJobNamesInDatabase(db, void 0, input.storeKey),
					changed: changes.changedIds.size > 0,
					notifications: plan.notifications,
					logs: plan.logs
				} };
			} catch (error) {
				if (error instanceof CronJobsStoreChangedError) transactionRefusal = error;
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
		return { mutationRefusal: { kind: "store-changed" } };
	}
}
//#endregion
export { mutateCronJobsInWorker };
