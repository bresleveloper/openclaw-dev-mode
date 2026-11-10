import { t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as isAgentDeletionBlocked } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { n as cronSourceIdentity } from "./source-schedule-49zenZxx.mjs";
import { h as updateCronRuntimeRow, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-Cnnqjh5r.mjs";
import { a as hasCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
import { n as repairCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-kOMa-5fA.mjs";
import { a as recordSkippedCronRequestInDatabase } from "./run-history.kernel-BxXbzyDp.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-u-R2z7LI.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { l as isJobEnabled, m as recomputeJobNextRunAtMs } from "./jobs-scheduling-sefIqbJ3.mjs";
import { o as retainManualOneShotOccurrence } from "./one-shot-schedule-DiK2ivJ0.mjs";
import { i as receiptHandle, r as receiptFromRow } from "./run-receipt-read-DF1n0U0f.mjs";
import { a as finishCronRunReceiptInDatabase, n as claimCronRunReceiptInDatabase, t as activateCronRunReceiptInDatabase } from "./run-receipt-store-Bik3uOzB.mjs";
import { d as readChannelIngressClaimSnapshotInDatabase, r as completeChannelIngressInDatabase } from "./ingress-queue.kernel-B2XLFtQU.mjs";
import { t as createCronMutationLogger } from "./runtime-mutation.worker-DYRinBLE.mjs";
import { n as parseCronScheduledRunId } from "./run-request-id-CacI55qK.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/store/event-ingress.ts
/** The existing ingress owner reads the exact row inside cron's admitted worker transaction. */
function readCronEventClaimInDatabase(db, job, event) {
	if (job.schedule.kind !== "event" || !job.enabled || job.state.autoDisabled || job.id !== event.input.jobId || cronSourceIdentity(job) !== event.input.sourceIdentity) return;
	const row = readChannelIngressClaimSnapshotInDatabase(db, {
		queueName: event.claim.queueName,
		candidateIds: [event.claim.id],
		blockedLaneKeys: [],
		deriveLaneKey: false,
		scanLimit: 1
	}).claimed.find((candidate) => candidate.event_id === event.claim.id);
	if (!row || row.claim_token !== event.claim.token || row.channel_id !== job.schedule.source) return;
	let payload;
	try {
		payload = JSON.parse(row.payload_json);
	} catch {
		return;
	}
	return isDeepStrictEqual(payload, event.input) ? row : void 0;
}
/**
* The activation receipt and completed ingress tombstone share one native commit.
* A crash before it leaves the immutable claim retryable; a crash after it uses
* ordinary interrupted-run recovery and must never replay external side effects.
*/
function transferCronEventInDatabase(db, job, event, receipt, now) {
	const row = readCronEventClaimInDatabase(db, job, event);
	if (!row || !completeChannelIngressInDatabase(db, {
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: event.claim.queueName,
		id: event.claim.id,
		token: event.claim.token,
		now,
		metadataJson: JSON.stringify({
			jobId: job.id,
			eventId: event.input.eventId,
			receiptId: receipt.receiptId
		})
	})) throw new Error("cron event ingress claim is no longer current");
}
//#endregion
//#region src/cron/store/run-queue.worker.ts
const ownerStartTime = getFileLockProcessStartTime(process.pid);
function query(db) {
	return getNodeSqliteKysely(db);
}
function loadJobs(db, storeKey) {
	const jobs = loadedCronStoreFromRows(loadCronRows(db, storeKey, void 0, { includeGrantDefinitionProjection: true })).store.jobs;
	const { repairJobIds } = loadCronRuntimeAuthorities({
		db,
		storeKey,
		jobs
	});
	if (repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
		db,
		storeKey,
		jobs,
		jobIds: repairJobIds
	});
	return new Map(jobs.map((job) => [job.id, job]));
}
function matchingExit(job, context) {
	return job.schedule.kind === "on-exit" && context.onExitSchedule?.command === job.schedule.command && context.onExitSchedule.cwd === job.schedule.cwd;
}
function skipRequest(db, receiptSchema, handle, job, nowMs, error, status = "skipped") {
	finishCronRunReceiptInDatabase({
		database: db,
		receiptSchema,
		handle,
		pendingReceiptId: job?.state.runningAtMs === void 0 ? void 0 : job.state.runningReceiptId,
		status,
		finishedAtMs: nowMs,
		error
	});
	if (job) {
		if (job.state.queuedAtMs === handle.startedAtMs) delete job.state.queuedAtMs;
		if (job.state.runningReceiptId === handle.receiptId) {
			delete job.state.runningAtMs;
			delete job.state.runningReceiptId;
			delete job.state.runningScheduleChangeId;
		}
		updateCronRuntimeRow(db, handle.storeKey, job);
	}
	if (status === "skipped") recordSkippedCronRequestInDatabase(db, {
		storeKey: handle.storeKey,
		jobId: handle.jobId,
		receiptId: handle.receiptId,
		agentId: handle.agentId,
		startedAt: handle.startedAtMs,
		endedAt: nowMs,
		error,
		nextRunAtMs: job?.state.nextRunAtMs
	});
	return {
		job,
		runReceipt: handle,
		error
	};
}
function requestCronRunsInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const hasEvents = input.requests.some((request) => request.event !== void 0);
		if (hasEvents) requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = requestCronRunsInDatabase(db, input, loadJobs(db, input.storeKey));
		if (hasEvents) requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.request-runs" });
}
function requestCronRunsInDatabase(db, input, jobs, persistQueuedState = true) {
	const result = {
		accepted: [],
		rejected: []
	};
	for (const request of input.requests) {
		const job = jobs.get(request.jobId);
		const timed = parseCronScheduledRunId(request.receiptId);
		let reason;
		if (request.event && (!job || !readCronEventClaimInDatabase(db, job, request.event))) reason = "event-invalidated";
		else if (!job || job.state.queuedAtMs !== void 0 || job.state.runningAtMs !== void 0) reason = job ? "already-running" : "job-removed";
		else if (resolveCronJobConfigRevision(job) !== request.configRevision || !isJobEnabled(job) && request.mode !== "force" || request.mode === "on-exit" && !matchingExit(job, request) || request.mode === "scheduled" && (!timed || timed.storeKey !== input.storeKey || timed.jobId !== job.id || timed.scheduledSlotMs !== job.state.nextRunAtMs || timed.scheduledSlotMs !== request.scheduledSlotMs)) reason = "job-ineligible";
		let runReceipt;
		if (!reason && job) {
			const agentId = tryResolveCronJobEffectiveAgentId(job, input.defaultAgentId);
			if (!agentId || !hasCanonicalCronDeliveryMode(job.delivery) || isAgentDeletionBlocked(agentId, {}, db)) reason = "owner-unavailable";
			else runReceipt = claimCronRunReceiptInDatabase({
				database: db,
				handle: {
					receiptId: request.receiptId,
					storeKey: input.storeKey,
					jobId: job.id,
					configRevision: request.configRevision,
					agentId,
					ownerPid: process.pid,
					ownerStartTime,
					startedAtMs: input.nowMs
				},
				requestRunId: request.requestRunId
			});
		}
		if (!runReceipt || !job) {
			const existing = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("cron_run_receipts").select("status").where("receipt_id", "=", request.receiptId));
			if (existing && reason !== "event-invalidated") {
				if (existing.status !== "running" && job && timed && request.mode === "scheduled" && timed.scheduledSlotMs === job.state.nextRunAtMs) {
					recomputeJobNextRunAtMs({
						state: { deps: {
							nowMs: () => input.nowMs,
							log: createCronMutationLogger([])
						} },
						job,
						nowMs: input.nowMs,
						deferredNotifications: [],
						skipScheduleErrorHandling: true
					});
					updateCronRuntimeRow(db, input.storeKey, job);
				}
				reason = "already-requested";
			}
			result.rejected.push({
				jobId: request.jobId,
				receiptId: request.receiptId,
				reason: reason ?? "already-running"
			});
			continue;
		}
		const previousEnabled = job.enabled ?? true;
		if (request.mode === "on-exit") {
			job.enabled = false;
			job.updatedAtMs = input.nowMs;
			job.state.scheduleActivatedAtMs = input.nowMs;
			delete job.state.nextRunAtMs;
			delete job.state.startupCatchupAtMs;
			delete job.state.pacedNextRunAtMs;
			delete job.state.forcePreservedNextRunAtMs;
		} else if (request.preserveSchedule) retainManualOneShotOccurrence(job, request.scheduleOwnershipAtMs ?? input.nowMs);
		else delete job.state.forcePreservedNextRunAtMs;
		job.state.queuedAtMs = input.nowMs;
		if (persistQueuedState) updateCronRuntimeRow(db, input.storeKey, job, previousEnabled);
		result.accepted.push({
			job,
			runReceipt
		});
	}
	return result;
}
function drainCronQueueInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const hasEvents = input.requests.some((request) => request.event !== void 0);
		if (hasEvents) requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const receiptSchema = prepareCronRunReceiptWriteSchema(db);
		const result = drainCronQueueInDatabase(db, input, loadJobs(db, input.storeKey), receiptSchema);
		if (hasEvents) requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.drain-queue" });
}
function drainCronQueueInDatabase(db, input, jobs, receiptSchema, freshReceipts) {
	const contexts = new Map(input.requests.map((request) => [request.receiptId, request]));
	const jobOrder = new Map([...jobs.keys()].map((jobId, index) => [jobId, index]));
	const cancelled = input.requests.length === 0 ? [] : executeSqliteQuerySync(db, query(db).selectFrom("cron_run_receipts").selectAll().where("store_key", "=", input.storeKey).where("status", "=", "skipped").where("receipt_id", "in", [...contexts.keys()])).rows.map((row) => ({
		job: jobs.get(row.job_id),
		runReceipt: receiptHandle(receiptFromRow(row)),
		error: row.error_text ?? "cron: queued request was cancelled"
	}));
	const receipts = executeSqliteQuerySync(db, query(db).selectFrom("cron_run_receipts").selectAll().where("store_key", "=", input.storeKey).where("status", "=", "running").orderBy("started_at_ms").orderBy("job_id")).rows.map(receiptFromRow);
	let activeCount = receipts.filter((receipt) => {
		const state = jobs.get(receipt.jobId)?.state;
		return state?.runningReceiptId === receipt.receiptId && state.runningAtMs !== void 0;
	}).length;
	const queued = receipts.filter((receipt) => jobs.get(receipt.jobId)?.state.queuedAtMs === receipt.startedAtMs).toSorted((left, right) => {
		return (parseCronScheduledRunId(left.receiptId)?.scheduledSlotMs ?? left.startedAtMs) - (parseCronScheduledRunId(right.receiptId)?.scheduledSlotMs ?? right.startedAtMs) || jobOrder.get(left.jobId) - jobOrder.get(right.jobId);
	});
	const result = {
		launches: [],
		skipped: cancelled
	};
	for (const receipt of queued) {
		const handle = receiptHandle(receipt);
		const job = jobs.get(receipt.jobId);
		const timed = parseCronScheduledRunId(receipt.receiptId);
		const context = contexts.get(receipt.receiptId) ?? (timed?.storeKey === input.storeKey && timed.jobId === job.id ? {
			receiptId: receipt.receiptId,
			mode: "scheduled"
		} : void 0);
		if (!context) continue;
		if (context.event && !readCronEventClaimInDatabase(db, job, context.event)) {
			result.skipped.push({
				...skipRequest(db, receiptSchema, handle, job, input.nowMs, "cron event claim invalidated"),
				eventInvalidated: true
			});
			continue;
		}
		const fresh = freshReceipts?.has(receipt.receiptId) === true;
		const agentId = fresh ? receipt.agentId : tryResolveCronJobEffectiveAgentId(job, input.defaultAgentId);
		const error = fresh ? void 0 : !isJobEnabled(job) && context.mode !== "force" && context.mode !== "on-exit" || context.mode === "on-exit" && !matchingExit(job, context) ? "cron: queued job is no longer eligible" : !agentId || !hasCanonicalCronDeliveryMode(job.delivery) || isAgentDeletionBlocked(agentId, {}, db) ? "cron: queued job owner is unavailable" : void 0;
		if (error || !agentId) {
			result.skipped.push(skipRequest(db, receiptSchema, handle, job, input.nowMs, error ?? "cron: queued job owner is unavailable"));
			continue;
		}
		if (input.schedulingPaused && context.mode === "scheduled" || activeCount >= Math.max(1, input.maxConcurrentRuns)) continue;
		const currentHandle = {
			...handle,
			ownerPid: process.pid,
			ownerStartTime,
			agentId,
			configRevision: resolveCronJobConfigRevision(job)
		};
		const runReceipt = fresh ? currentHandle : activateCronRunReceiptInDatabase({
			database: db,
			handle: currentHandle,
			startedAtMs: input.nowMs
		});
		if (context.event) transferCronEventInDatabase(db, job, context.event, runReceipt, input.nowMs);
		delete job.state.queuedAtMs;
		job.state.runningAtMs = input.nowMs;
		job.state.runningReceiptId = runReceipt.receiptId;
		delete job.state.runningScheduleChangeId;
		updateCronRuntimeRow(db, input.storeKey, job);
		result.launches.push({
			job,
			runReceipt
		});
		activeCount += 1;
	}
	return result;
}
/** The scheduler owns these postimages until its synchronous command returns. */
function requestAndDrainCronRunsInWorker(database, input, queue, jobs) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const receiptSchema = prepareCronRunReceiptWriteSchema(db);
		const currentJobs = [...jobs.values()];
		const { repairJobIds } = loadCronRuntimeAuthorities({
			db,
			storeKey: input.storeKey,
			jobs: currentJobs
		});
		if (repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
			db,
			storeKey: input.storeKey,
			jobs: currentJobs,
			jobIds: repairJobIds
		});
		const requested = requestCronRunsInDatabase(db, input, jobs, false);
		const drained = drainCronQueueInDatabase(db, {
			...input,
			...queue
		}, jobs, receiptSchema, new Set(requested.accepted.map(({ runReceipt }) => runReceipt.receiptId)));
		for (const { job } of requested.accepted) if (job.state.queuedAtMs !== void 0) updateCronRuntimeRow(db, input.storeKey, job);
		return {
			...requested,
			...drained
		};
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.request-and-drain-runs" });
}
function cancelCronRequestsInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const receiptSchema = prepareCronRunReceiptWriteSchema(db);
		const jobs = loadJobs(db, input.storeKey);
		const skipped = [];
		if (input.receiptIds.length > 0) {
			const rows = executeSqliteQuerySync(db, query(db).selectFrom("cron_run_receipts").selectAll().where("store_key", "=", input.storeKey).where("status", "=", "running").where("receipt_id", "in", input.receiptIds)).rows;
			for (const row of rows) {
				const handle = receiptHandle(receiptFromRow(row));
				skipped.push(skipRequest(db, receiptSchema, handle, jobs.get(row.job_id), input.nowMs, input.reason, input.status));
			}
		}
		return { skipped };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.cancel-requests" });
}
//#endregion
export { requestCronRunsInWorker as i, drainCronQueueInWorker as n, requestAndDrainCronRunsInWorker as r, cancelCronRequestsInWorker as t };
