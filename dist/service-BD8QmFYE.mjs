import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { H as cronRunLogEntryToDetail, ct as resolveAdmittedCronCompletionStatus, lt as resolveCronCompletionStatus, ot as STARTUP_INTERRUPTED_ERROR, q as cronRunStorageStatus } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { a as sessionChanges, i as sessionChangeScopeAffectsStoredRows } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey, c as normalizeOptionalAgentId, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { E as runWithGatewayIndependentRootWorkContinuation, r as beginGatewayRootWorkAdmissionWhenOpen, t as GatewayDrainingError, w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { o as readAgentDeletionJournalStatusInWorker } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker, t as createOpenClawStateWorkerLease } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as parseDurationMs } from "./parse-duration-B7MSnEK8.mjs";
import { o as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-C1oCXyXC.mjs";
import { C as noteActiveCronJobRemoval, D as requestActiveCronJobCancellation, E as onCronJobInactive, T as noteActiveCronJobTriggerMutation, b as markCronJobWaitingForHeartbeat, g as isCronSelfRemovalCurrent, h as isCronJobActive, l as clearCronJobActive, m as isCronActiveJobMarkerCurrent, n as bindCronJobAdmittedRun } from "./active-jobs-CqHAjCGh.mjs";
import { l as AgentDeletionCommitUncertainError } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { n as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import { c as resolveCronToolsAllowExecTargetRecoveryError } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { n as createCronRunDiagnosticsFromError } from "./run-diagnostics-DHdTDo8H.mjs";
import { n as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { v as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { n as resolveMaintenanceConfig } from "./store-maintenance-runtime-Z7En5Q4b.mjs";
import { _ as applySessionEntryLifecycleMutation } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { t as readExpiredCronRunEntriesInWorker } from "./session-entry-read-maintenance-B4xDRK3G.mjs";
import "./timeout-BBs3o51w.mjs";
import { x as assertSubagentReadContext } from "./subagent-registry-state-DBdy-FdI.mjs";
import { f as retainGatewayDeviceRevocation } from "./device-revocation-DpGQRUdo.mjs";
import { t as setSafeTimeout } from "./timer-delay-CaN6-bja.mjs";
import "./heartbeat-wake-do575_JN.mjs";
import { n as resolveCronJobEffectiveAgentId, r as tryResolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-C6uS-TyD.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-CWEGpfa5.mjs";
import { r as isInvalidCronSessionTargetIdError } from "./session-target-d98pYOqN.mjs";
import { a as wrapExternalContent } from "./external-content-Bkm4w5qo.mjs";
import { r as publishCronJobNames } from "./job-name-DEpSM-D8.mjs";
import { l as hasPendingGeneratedMediaTaskForSessionKey, n as buildPendingGeneratedMediaSessionKeySet } from "./media-generation-activity-CdYWMYrm.mjs";
import { a as trackActiveCronTaskRunSettlement, r as registerActiveCronTaskRun } from "./active-run-cancellation-BecFApIY.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { n as appendCronPayloadText, t as CronStreamSourceRetirementError } from "./stream-schedule-C4dQJNrH.mjs";
import { a as ownsCronSource, n as cronSourceIdentity, t as createCronSourceIdentity } from "./source-schedule-49zenZxx.mjs";
import { n as getInvalidPersistedCronJobReason, t as assertCronJobStateTimestamps } from "./persisted-shape-CJCxeJAv.mjs";
import { a as systemOwnedDeclarationKeyNamespace, i as isSystemMonitorDeclaration } from "./system-owned-declaration-BdxGzmHz.mjs";
import { y as cronSchedulingInputsEqual } from "./row-codec-Cnnqjh5r.mjs";
import { a as hasCanonicalCronDeliveryMode, n as assertCanonicalCronDeliveryMode, t as CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE } from "./delivery-codec-DMPX9PBc.mjs";
import "./normalize-CgAHjzjT.mjs";
import { n as normalizeCronJobInput } from "./normalize-D_B-pqo1.mjs";
import { i as resolveCronAuthenticatedChannelRequester, r as resolveCronAuthenticatedCallerOrigin } from "./tools-allow-provenance-DDhQ9uVg.mjs";
import { a as normalizeCronRunErrorText, c as setupTimeoutErrorMessage, i as isSetupTimeoutErrorText, l as timeoutErrorMessage, n as cronAbortErrorClassification, o as preExecutionTimeoutErrorMessage, t as abortErrorMessage } from "./execution-errors-MLvRe_c_.mjs";
import { n as runOutsideOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { n as captureCronRunAdmissionTracker, t as captureCronMutationCommit } from "./mutation-completion-QPffi2k4.mjs";
import { r as prepareCronDescendantDeletion } from "./run-subagent-registry.runtime-B8zGvW3W.mjs";
import { f as saveCronJobsStoreWithRevision, g as runCronRuntimeMutation, i as loadCronJobsStoreWithConfigJobs, n as getCronJobsStoreRevision, o as noteCronJobsStoreCommit, s as removeStaleCronJobFamilyRows } from "./store-HF7PvtRl.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as CronJobsStoreChangedError } from "./save-error-BrzBbDk8.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { n as loadCronJobsStoreWithConfigJobsReadOnly } from "./read-only-BTIc_b6f.mjs";
import { n as resolveCronRunAdmissionSource } from "./run-authority-Cj0McdfG.mjs";
import { D as resolveCronNotificationQueueOwner, T as captureCronNotificationRouting, b as resolveJobLastRunStatus, d as needsCronTimerMaintenance, f as nextWakeAtMs, l as isJobEnabled, o as findJobOrThrow, s as hasActiveCronRun } from "./jobs-scheduling-sefIqbJ3.mjs";
import { t as readCronScratchSnapshot } from "./scratch-read-DqUJqnzu.mjs";
import { o as writeCronJobScratch } from "./scratch-store-EDkbope9.mjs";
import { i as registerPendingCronSessionCleanup, r as locked, t as getPendingCronSessionCleanup } from "./locked-BAhN5KaU.mjs";
import { t as CronRunReceiptRevisionError } from "./run-receipt.types-B4cYMMc0.mjs";
import "./run-receipt-store-Bik3uOzB.mjs";
import { n as cronJobMessageActionAuthorityInputsEqual, o as reconcileRuntimeAuthority, r as cronJobMessageToolAuthorityInputsEqual, t as consumeRuntimeAuthorityMutationOptions } from "./jobs-tool-policy-BlxRC469.mjs";
import { a as removeQueuedSystemEventHandle, g as runsDetachedFromMainSession, h as resolveMainSessionCronDeliveryContext, i as normalizeQueuedSystemEventHandle, s as resolveDeliveryState } from "./timer-trigger-DkbJC_Jg.mjs";
import { n as publishCronRunReceiptMutation, t as markServiceCronJobActive } from "./run-receipts-DN1bseg1.mjs";
import { t as toPublicCronJob } from "./public-job-ZZcxPz9P.mjs";
import { n as describeUnavailableCronAgent } from "./agent-availability-BGEhaGyB.mjs";
import { n as isHeartbeatTaskCronJob } from "./heartbeat-task-Ds7Wgs5C.mjs";
import { c as assertSupportedJobSpec, d as cronPatchTouchesDeliveryResolution, f as resolveConfiguredChannelsForValidation, l as assertTimeScheduleSatisfiable, r as assertExternalSourceScheduleSupport } from "./jobs-validation-BM2s83tB.mjs";
import { t as resolveCronDeliveryPlan } from "./delivery-plan-BCh_72BD.mjs";
import { t as failureNotificationDeliveryFromJobState } from "./failure-alerts-Cgi3Ds94.mjs";
import { r as cronRunLogEntryFromEvent, t as cronRunResultEvent } from "./run-result-CSMGrLLI.mjs";
import { n as recordCronRun } from "./run-history-B9OUB_d1.mjs";
import { n as deleteCronSessionViaGateway } from "./session-cleanup-C6JhW0Um.mjs";
import { n as isRunnableJob } from "./timer-runnable-CxUwSYOC.mjs";
import { n as normalizeCronRunJobId } from "./run-history-Dl-K-0P9.mjs";
import { t as declarativeFields } from "./jobs-declarative--tbOnzUv.mjs";
import crypto, { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { BroadcastChannel, isMainThread, threadId } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
var CronEventClaimInvalidatedError = class extends Error {
	constructor() {
		super("automation event claim is no longer current");
	}
};
function cronEventRunId(event) {
	return "event:" + createHash("sha256").update(JSON.stringify([
		event.claim.queueName,
		event.claim.id,
		event.input.jobId,
		event.input.sourceIdentity,
		event.input.eventId
	])).digest("hex");
}
/** Event data cannot replace trusted instructions or change the creator's tool policy. */
function cronEventPayload(job, input) {
	if (job.payload.kind !== "agentTurn") throw new Error("event schedules require an agentTurn payload");
	return {
		...job.payload,
		message: job.payload.message + "\n\n" + wrapExternalContent(JSON.stringify({
			eventId: input.eventId,
			receivedAtMs: input.receivedAtMs,
			payload: input.payload
		}), {
			source: "webhook",
			includeWarning: true
		})
	};
}
//#endregion
//#region src/cron/list-snapshot-revision.ts
function resolveCronListSnapshotRevision(jobs) {
	return `sha256:${sha256Base64Url(stableStringify(jobs))}`;
}
//#endregion
//#region src/cron/service/list-page-sort.ts
function sortCronJobs(jobs, sortBy, sortDir) {
	const dir = sortDir === "desc" ? -1 : 1;
	let compareNames;
	jobs.sort((a, b) => {
		let cmp = 0;
		if (sortBy === "name") {
			const aName = typeof a.name === "string" ? a.name : "";
			const bName = typeof b.name === "string" ? b.name : "";
			compareNames ??= new Intl.Collator(void 0, { sensitivity: "base" }).compare;
			cmp = compareNames(aName, bName);
		} else if (sortBy === "updatedAtMs") cmp = a.updatedAtMs - b.updatedAtMs;
		else {
			const aNext = a.state.nextRunAtMs;
			const bNext = b.state.nextRunAtMs;
			if (typeof aNext === "number" && typeof bNext === "number") cmp = aNext - bNext;
			else if (typeof aNext === "number" || typeof bNext === "number") return typeof aNext === "number" ? -1 : 1;
		}
		if (cmp !== 0) return cmp * dir;
		const aId = typeof a.id === "string" ? a.id : "";
		const bId = typeof b.id === "string" ? b.id : "";
		return aId.localeCompare(bId);
	});
	return jobs;
}
//#endregion
//#region src/cron/service/run-queue-wake.ts
const pendingQueues = /* @__PURE__ */ new Map();
const schedulers = /* @__PURE__ */ new Map();
function registerCronSchedulerRefresh(state, refresh) {
	schedulers.set(state, refresh);
	return () => {
		schedulers.delete(state);
	};
}
/** Only services with pending launch contexts receive same-store wake notifications. */
function registerCronRunQueue(state, drain) {
	pendingQueues.set(state, drain);
}
function releaseCronRunQueue(state) {
	pendingQueues.delete(state);
}
function listCronRunQueueOwners(state) {
	const storeKey = cronStoreKey(state.deps.storePath);
	return [...pendingQueues.keys()].filter((owner) => cronStoreKey(owner.deps.storePath) === storeKey);
}
function wakeCronRunQueues(state) {
	const storeKey = cronStoreKey(state.deps.storePath);
	for (const [owner, refresh] of schedulers) if (cronStoreKey(owner.deps.storePath) === storeKey) refresh();
	for (const [owner, drain] of pendingQueues) if (cronStoreKey(owner.deps.storePath) === storeKey) drain().catch((error) => owner.deps.log.warn({ err: String(error) }, "cron: queue drain delayed"));
}
//#endregion
//#region src/cron/service/state.ts
function cronFailureNotificationEventContext(failureNotificationDetail) {
	return failureNotificationDetail ? { failureNotificationDetail } : void 0;
}
function createCronServiceState(deps) {
	const defaultAgentId = deps.defaultAgentId ?? (deps.resolveDefaultAgentId ? void 0 : "main");
	const nowMs = deps.nowMs ?? (() => deps.scheduler.now());
	return {
		deps: {
			...deps,
			defaultAgentId,
			nowMs
		},
		store: null,
		durableNextRunAtMsByJobId: /* @__PURE__ */ new Map(),
		schedulerScope: deps.scheduler.scope(),
		schedulerDrain: Promise.resolve(),
		stopped: false,
		lifecycleGeneration: 0,
		schedulingPaused: false,
		schedulerStarted: false,
		liveSinceMs: nowMs(),
		activeManualRunJobIds: /* @__PURE__ */ new Set(),
		queuedManualRuns: /* @__PURE__ */ new Map(),
		manualSetupTimeoutNotified: false,
		op: Promise.resolve(),
		warnedDisabled: false,
		warnedInvalidPersistedJobKeys: /* @__PURE__ */ new Set(),
		pendingQuarantineConfigJobs: [],
		lastQuarantineFailureWarnKey: null,
		storeLoadedAtMs: null
	};
}
/** Dispatches a cron event without letting subscriber errors escape scheduler work. */
function emit(state, evt, context) {
	try {
		const publicEvent = evt.job ? {
			...evt,
			job: toPublicCronJob(evt.job)
		} : evt;
		if (context) state.deps.onEvent?.(publicEvent, context);
		else state.deps.onEvent?.(publicEvent);
	} catch {}
}
function isImmediateCronRunMode(mode) {
	return mode === "force" || mode === "if-enabled";
}
//#endregion
//#region src/cron/service/runtime-publication.ts
/** Applies committed target rows locally without copying any unrelated store snapshot. */
function applyCronRuntimeRowsToState(state, jobs, deletedJobIds = [], opts) {
	if (!state.store) return;
	const jobsById = new Map([...jobs].map((job) => [job.id, job]));
	const deleted = new Set(deletedJobIds);
	const residentJobIds = new Set(state.store.jobs.map((job) => job.id));
	const residentJobs = state.store.jobs.filter((job) => !deleted.has(job.id)).map((job) => jobsById.get(job.id) ?? job);
	const importedJobs = [...jobsById.values()].filter((job) => !residentJobIds.has(job.id) && !deleted.has(job.id));
	state.store.jobs = [...residentJobs, ...importedJobs];
	if (opts?.publish !== false) publishDurableNextRunChanges({
		state,
		storeJobs: state.store.jobs
	});
}
function publishDurableNextRunChanges(params) {
	const previous = params.state.durableNextRunAtMsByJobId;
	const next = new Map(params.storeJobs.map((job) => [job.id, job.state.nextRunAtMs]));
	const changedJobs = params.storeJobs.filter((job) => {
		if (!previous.has(job.id) || !next.has(job.id)) return false;
		return previous.get(job.id) !== next.get(job.id);
	});
	params.state.durableNextRunAtMsByJobId = next;
	for (const job of changedJobs) {
		if (job.id === params.suppressScheduledJobId) continue;
		emit(params.state, {
			jobId: job.id,
			action: "scheduled",
			job,
			nextRunAtMs: job.state.nextRunAtMs
		});
	}
}
//#endregion
//#region src/cron/service/wake.ts
/** Manual cron wake helper for queueing system events into sessions. */
/** Keeps safety notices with their creator and limits failure routes to explicit origins. */
async function enqueueCronNotification(state, job, text, kind, routing) {
	const owner = resolveCronNotificationQueueOwner(job, kind);
	const { sessionKey } = owner;
	const agentId = owner.agentId ?? normalizeOptionalAgentId(routing.defaultAgentId);
	if (!agentId) throw new Error(CRON_AGENT_SELECTION_REQUIRED_MESSAGE);
	const deliveryContext = sessionKey || kind === "auto-disabled" && agentId ? await state.deps.resolveOriginDeliveryContext?.({
		agentId,
		sessionKey
	}) : void 0;
	state.deps.enqueueSystemEvent(text, {
		agentId,
		sessionKey,
		contextKey: `cron:${job.id}:${kind}`,
		...deliveryContext ? { deliveryContext } : {}
	});
	if (kind === "auto-disabled" || job.wakeMode === "now" || sessionKey) state.deps.requestHeartbeat({
		source: "notifications-event",
		intent: "immediate",
		reason: "wake",
		agentId,
		sessionKey
	});
}
/** Enqueues a manual cron wake event and optionally pokes the targeted heartbeat loop. */
async function wake(state, opts) {
	const text = opts.text.trim();
	if (!text) return { ok: false };
	const sessionKey = opts.sessionKey?.trim() || void 0;
	const agentId = opts.agentId?.trim() || void 0;
	if (sessionKey && isSubagentSessionKey(sessionKey)) return {
		ok: false,
		reason: "unwakeable-session-key"
	};
	const originDeliveryContext = sessionKey || agentId ? await state.deps.resolveOriginDeliveryContext?.({
		sessionKey,
		agentId
	}) : void 0;
	const enqueueOpts = sessionKey || agentId ? {
		...sessionKey ? { sessionKey } : {},
		...agentId ? { agentId } : {},
		...originDeliveryContext ? { deliveryContext: originDeliveryContext } : {}
	} : void 0;
	opts.commitGuard?.();
	state.deps.enqueueSystemEvent(text, enqueueOpts);
	if (opts.mode === "now" || sessionKey) state.deps.requestHeartbeat({
		source: "manual",
		intent: "immediate",
		reason: "wake",
		...sessionKey ? { sessionKey } : {},
		...agentId ? { agentId } : {}
	});
	return { ok: true };
}
//#endregion
//#region src/cron/service/notification-dispatch.ts
/** Sends committed cron notifications through the live host and records delivery. */
async function dispatchCronNotification(state, notification) {
	if (notification.kind === "failure-repair") {
		await requestFailureRepair(state, notification);
		return;
	}
	let routing = notification.routing ? { ...notification.routing } : void 0;
	if (!routing) routing = (notification.kind === "failure-alert" && state.deps.sendCronFailureAlert ? Boolean(notification.job.agentId?.trim()) : Boolean(resolveCronNotificationQueueOwner(notification.job, notification.kind).agentId)) ? {} : captureCronNotificationRouting(state.deps.resolveDefaultAgentId?.(), state.deps.defaultAgentId);
	if (notification.kind === "auto-disabled") await enqueueCronNotification(state, notification.job, notification.text, notification.kind, routing);
	else await transportFailureAlert(state, notification, routing);
}
/**
* Starts the repair turn in the conversation that owns the job. Request failures are logged;
* terminal one-shots send their fallback alert, while recurring jobs retain the repair deadline.
*/
async function requestFailureRepair(state, notification) {
	const jobId = notification.job.id;
	const job = state.store?.jobs.find((candidate) => candidate.id === jobId);
	const owner = job?.owner;
	const sessionKey = owner?.sessionKey?.trim();
	const repairId = notification.job.state.lastFailureNotificationId;
	const repairAtMs = job?.state.failureAlertIncident?.repair?.atMs;
	const lifecycleGeneration = state.lifecycleGeneration;
	const recordSettlement = async () => {
		if (repairAtMs === void 0 || !repairId) return;
		const settledAtMs = state.deps.nowMs();
		await locked(state, async () => {
			if (state.stopped || state.lifecycleGeneration !== lifecycleGeneration) return;
			const storeKey = cronStoreKey(state.deps.storePath);
			await runCronRuntimeMutation({
				context: captureOpenClawStateWorkerContext(),
				type: "cron.recordFailureRepairSettlement",
				input: {
					storeKey,
					jobId,
					repairId,
					repairAtMs,
					settledAtMs
				},
				snapshot: {},
				assertCurrent() {
					if (state.stopped || state.lifecycleGeneration !== lifecycleGeneration) throw new Error("Cron failure-repair owner retired");
				},
				publish(committed) {
					if (committed.job) {
						noteCronJobsStoreCommit(storeKey);
						applyCronRuntimeRowsToState(state, [committed.job], [], { publish: false });
					}
				}
			});
		});
	};
	const failed = async (err) => {
		state.deps.log.warn({
			jobId,
			err: String(err)
		}, "cron: failure repair request failed");
		if (notification.fallback) await dispatchCronNotification(state, {
			...notification.fallback,
			routing: notification.routing
		});
	};
	if (!sessionKey || !repairId || !state.deps.runCronFailureRepair) {
		await failed(/* @__PURE__ */ new Error("Missing failure repair runner, owner session, or repair ID"));
		return;
	}
	state.deps.runCronFailureRepair({
		jobId,
		repairId,
		timeoutMs: state.deps.failureRepairTimeoutMs ?? 1728e5,
		agentId: owner?.agentId,
		sessionKey,
		message: notification.text
	}).then(recordSettlement).catch(failed).catch((err) => state.deps.log.warn({
		jobId,
		err: String(err)
	}, "cron: failure repair fallback failed"));
}
const FAILURE_ALERT_ERROR_MAX_LENGTH = 1e3;
/** Writes one settled transport fact while the exact alert cycle still owns the row. */
async function recordFailureAlertOutcome(state, cycle, outcome) {
	let ownsCycle;
	try {
		return await locked(state, async () => {
			if (state.stopped || state.lifecycleGeneration !== cycle.lifecycleGeneration) return "stale";
			const context = captureOpenClawStateWorkerContext();
			const storeKey = cronStoreKey(state.deps.storePath);
			let result = "stale";
			await runCronRuntimeMutation({
				context,
				type: "cron.recordFailureAlertOutcome",
				input: {
					storeKey,
					jobId: cycle.jobId,
					runAtMs: cycle.runAtMs,
					alertAtMs: cycle.alertAtMs,
					notificationId: cycle.notificationId,
					outcome: {
						...outcome,
						error: outcome.error ? truncateUtf16Safe(formatErrorMessage(outcome.error), FAILURE_ALERT_ERROR_MAX_LENGTH) : void 0
					}
				},
				assertCurrent() {
					if (state.stopped || state.lifecycleGeneration !== cycle.lifecycleGeneration) {
						ownsCycle = false;
						throw new Error("Cron failure-alert owner retired");
					}
				},
				snapshot: {},
				publish(committed) {
					ownsCycle = committed.job !== void 0;
					if (committed.job) {
						noteCronJobsStoreCommit(storeKey);
						applyCronRuntimeRowsToState(state, [committed.job], [], { publish: false });
						result = "recorded";
					}
				}
			});
			return result;
		});
	} catch (err) {
		state.deps.log.warn({
			jobId: cycle.jobId,
			err: formatErrorMessage(err)
		}, "cron: failed to record failure-alert outcome");
		return ownsCycle === false ? "stale" : "persistence-failed";
	}
}
async function transportFailureAlert(state, params, routing) {
	const jobId = params.job.id;
	const alertAtMs = params.job.state.lastFailureAlertAtMs;
	const lifecycleGeneration = state.lifecycleGeneration;
	const notificationId = params.job.state.lastFailureNotificationId;
	const runAtMs = params.job.state.lastRunAtMs;
	if (!state.deps.sendCronFailureAlert) {
		await enqueueCronNotification(state, params.job, params.payload.text ?? "", "failure-alert", routing);
		return;
	}
	state.deps.sendCronFailureAlert({
		job: params.job,
		routing,
		payload: params.payload,
		runAtMs: params.runAtMs,
		channel: params.route.channel,
		to: params.route.to,
		mode: params.route.mode,
		accountId: params.route.accountId,
		threadId: params.route.threadId,
		...params.route.alternateRoute ? { inheritSessionThread: false } : {},
		onDeliverySettled: async (outcome) => {
			if (await recordFailureAlertOutcome(state, {
				jobId,
				alertAtMs,
				runAtMs,
				lifecycleGeneration,
				notificationId
			}, outcome) !== "stale" && outcome.status === "not-delivered") await enqueueCronNotification(state, params.job, params.payload.text ?? "", "failure-alert", routing);
		}
	}).catch((err) => {
		state.deps.log.warn({
			jobId: params.job.id,
			err: String(err)
		}, "cron: failure alert delivery failed");
	});
}
//#endregion
//#region src/cron/service/store.ts
/** Loads, normalizes, quarantines, and persists cron service store state. */
const loadedCronStoreRevisions = /* @__PURE__ */ new WeakMap();
/** Advance a complete resident store after its committed row postimages are installed. */
function noteLoadedCronStoreCommit(state, observedRevision) {
	const storeKey = cronStoreKey(state.deps.storePath);
	const current = getCronJobsStoreRevision(storeKey);
	const loaded = loadedCronStoreRevisions.get(state)?.revision;
	noteCronJobsStoreCommit(storeKey);
	if (loaded === observedRevision && current === observedRevision) loadedCronStoreRevisions.set(state, { revision: getCronJobsStoreRevision(storeKey) });
}
function warnInvalidPersistedCronJob(params) {
	const jobId = typeof params.raw.id === "string" ? params.raw.id : void 0;
	const dedupeKey = jobId ?? `index:${params.index}`;
	if (params.state.warnedInvalidPersistedJobKeys.has(dedupeKey)) return;
	params.state.warnedInvalidPersistedJobKeys.add(dedupeKey);
	params.state.deps.log.warn({
		storePath: params.state.deps.storePath,
		jobId,
		jobIndex: params.index,
		reason: params.reason
	}, "cron: quarantined invalid persisted job and skipped it from runtime");
}
function isValidatedCronJob(value) {
	return getInvalidPersistedCronJobReason(value) === null;
}
/** Loads and normalizes the cron store, quarantining invalid persisted rows before runtime use. */
async function ensureLoaded(state, opts) {
	if (state.store && !opts?.forceReload) {
		const loadedRevision = loadedCronStoreRevisions.get(state)?.revision;
		if (loadedRevision === void 0 || loadedRevision === getCronJobsStoreRevision(state.deps.storePath)) return;
	}
	const loadedRevision = getCronJobsStoreRevision(state.deps.storePath);
	const loaded = await loadCronJobsStoreWithConfigJobs(state.deps.storePath);
	const loadNowMs = state.deps.nowMs();
	const loadedJobs = (loaded.store.jobs ?? []).filter(isRecord);
	const jobs = [];
	const durableNextRunAtMsByJobId = /* @__PURE__ */ new Map();
	const quarantinedConfigJobs = [...loaded.invalidConfigRows];
	for (const [index, raw] of loadedJobs.entries()) {
		if (!hasCanonicalCronDeliveryMode(raw.delivery)) {
			const warningKey = `delivery:${raw.id}`;
			if (!state.warnedInvalidPersistedJobKeys.has(warningKey)) {
				state.warnedInvalidPersistedJobKeys.add(warningKey);
				state.deps.log.warn({ jobId: raw.id }, `cron: job execution withheld: ${CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE}`);
			}
		}
		const rawConfigJob = loaded.configJobs[index] ?? structuredClone(raw);
		const sourceIndex = loaded.configJobIndexes[index] ?? index;
		const runtimeEntry = loaded.configJobRuntimeEntries[index];
		const rawInvalidReason = getInvalidPersistedCronJobReason(raw);
		let normalized;
		try {
			normalized = normalizeCronJobInput(raw);
			if (normalized && raw.delivery !== void 0) normalized.delivery = raw.delivery;
		} catch (error) {
			if (!isInvalidCronSessionTargetIdError(error)) throw error;
			normalized = null;
			state.deps.log.warn({
				storePath: state.deps.storePath,
				jobId: typeof raw.id === "string" ? raw.id : void 0
			}, "cron: job has invalid persisted sessionTarget; run openclaw doctor --fix to repair");
		}
		const hydratedRaw = normalized ?? raw;
		let invalidReason = rawInvalidReason ?? getInvalidPersistedCronJobReason(hydratedRaw);
		const hydratedSchedule = isRecord(hydratedRaw.schedule) ? hydratedRaw.schedule : {};
		const hydratedIsValid = !invalidReason && isValidatedCronJob(hydratedRaw);
		if (hydratedIsValid && hydratedRaw.enabled && hydratedSchedule.kind === "every") try {
			assertTimeScheduleSatisfiable({
				...hydratedRaw,
				state: {}
			}, loadNowMs);
		} catch {
			invalidReason = "unsatisfiable-schedule";
		}
		if (invalidReason) {
			const quarantineEntry = {
				sourceIndex,
				reason: invalidReason,
				job: rawConfigJob
			};
			const runtimeState = runtimeEntry?.state ?? raw.state;
			if (runtimeState && typeof runtimeState === "object" && !Array.isArray(runtimeState)) quarantineEntry.state = structuredClone(runtimeState);
			const updatedAtMs = runtimeEntry?.updatedAtMs ?? raw.updatedAtMs;
			if (typeof updatedAtMs === "number" && Number.isFinite(updatedAtMs)) quarantineEntry.updatedAtMs = updatedAtMs;
			if (typeof runtimeEntry?.scheduleIdentity === "string") quarantineEntry.scheduleIdentity = runtimeEntry.scheduleIdentity;
			quarantinedConfigJobs.push(quarantineEntry);
			warnInvalidPersistedCronJob({
				state,
				raw,
				index: sourceIndex,
				reason: invalidReason
			});
			continue;
		}
		if (!hydratedIsValid) continue;
		const hydrated = hydratedRaw;
		const loadWarning = state.deps.describeJobLoadWarning?.(hydrated);
		const loadWarningKey = `host:${hydrated.id}`;
		if (loadWarning && !state.warnedInvalidPersistedJobKeys.has(loadWarningKey)) {
			state.warnedInvalidPersistedJobKeys.add(loadWarningKey);
			state.deps.log.warn({
				jobId: hydrated.id,
				name: hydrated.name
			}, loadWarning);
		}
		jobs.push(hydrated);
		durableNextRunAtMsByJobId.set(hydrated.id, hydrated.state.nextRunAtMs);
	}
	state.store = {
		version: 1,
		jobs
	};
	state.durableNextRunAtMsByJobId = durableNextRunAtMsByJobId;
	state.storeLoadedAtMs = loadNowMs;
	loadedCronStoreRevisions.set(state, { revision: loadedRevision });
	if (quarantinedConfigJobs.length > 0 && !opts?.deferQuarantinePersist) {
		quarantinedConfigJobs.sort((left, right) => left.sourceIndex - right.sourceIndex);
		state.pendingQuarantineConfigJobs = quarantinedConfigJobs;
		try {
			if (await persistQuarantinedJobs(state, state.store)) state.deps.log.warn({
				storePath: state.deps.storePath,
				quarantinedJobs: quarantinedConfigJobs.length
			}, "cron: sanitized active cron store after quarantining malformed persisted jobs");
		} catch (error) {
			state.deps.log.warn({
				storePath: state.deps.storePath,
				error: error instanceof Error ? error.message : String(error)
			}, "cron: failed to sanitize malformed persisted jobs after quarantine; continuing with quarantined in-memory view");
		}
	}
}
/** Loads authoritative passive state without discarding enabled-scheduler transients. */
async function ensureLoadedForOperation(state) {
	await ensureLoaded(state, {
		forceReload: !state.deps.cronEnabled,
		deferQuarantinePersist: !state.deps.cronEnabled
	});
	if (!state.deps.cronEnabled) {
		state.pendingQuarantineConfigJobs = [];
		state.lastQuarantineFailureWarnKey = null;
	}
}
/** Emits the cron-disabled warning once per service state. */
function warnIfDisabled(state, action) {
	if (state.deps.cronEnabled) return;
	if (state.warnedDisabled) return;
	state.warnedDisabled = true;
	state.deps.log.warn({
		enabled: false,
		action,
		storePath: state.deps.storePath
	}, "cron: scheduler disabled; jobs will not run automatically");
}
/** Persists quarantine and the surviving rows in one SQLite transaction. */
async function persistQuarantinedJobs(state, store) {
	const quarantine = {
		entries: state.pendingQuarantineConfigJobs,
		nowMs: state.deps.nowMs()
	};
	try {
		const committed = await saveCronJobsStoreWithRevision(state.deps.storePath, store, { quarantine });
		loadedCronStoreRevisions.set(state, committed);
	} catch (error) {
		if (error instanceof CronRunReceiptRevisionError) throw error;
		const errorMessage = error instanceof Error ? error.message : String(error);
		const warnKey = `${state.deps.storePath}\0${errorMessage}`;
		if (state.lastQuarantineFailureWarnKey !== warnKey) {
			state.lastQuarantineFailureWarnKey = warnKey;
			state.deps.log.warn({
				storePath: state.deps.storePath,
				error: errorMessage
			}, "cron: failed to quarantine malformed persisted jobs; skipping active store sanitization");
		}
		return false;
	}
	state.pendingQuarantineConfigJobs = [];
	state.lastQuarantineFailureWarnKey = null;
	publishDurableNextRunChanges({
		state,
		storeJobs: store.jobs
	});
	return true;
}
/**
* Notifications run after the durable commit; one throwing notify (e.g. an
* auto-disable notice for a removed agent) must not drop its siblings or
* masquerade as a store-write failure — at startup that keeps the whole
* scheduler down.
*/
async function runPostPersistCronNotifications(state, notifications) {
	for (const notification of notifications ?? []) try {
		await dispatchCronNotification(state, notification);
	} catch (err) {
		state.deps.log.warn({ error: err instanceof Error ? err.message : String(err) }, "cron: post-persist notification failed");
	}
}
/** Retain the service and physical store before asynchronous mutation planning. */
function captureCronServiceMutationSource(state, context = captureOpenClawStateWorkerContext()) {
	const storeKey = cronStoreKey(state.deps.storePath);
	const generation = state.lifecycleGeneration;
	const assertStorageCurrent = () => {
		context.admission.assertCurrent();
		if (cronStoreKey(state.deps.storePath) !== storeKey || resolveOpenClawStateSqlitePath() !== context.admission.databasePath) throw new Error("Cron mutation source or service changed before commit");
	};
	return {
		context,
		storeKey,
		assertStorageCurrent,
		assertCurrent() {
			assertStorageCurrent();
			if (state.lifecycleGeneration !== generation) throw new Error("Cron mutation source or service changed before commit");
		}
	};
}
function captureCronJobMutationSource(state) {
	const source = captureCronServiceMutationSource(state);
	const resolveDefaultAgentId = () => state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
	const defaultAgentId = resolveDefaultAgentId();
	const effectiveDefaultAgentId = defaultAgentId ?? state.deps.defaultAgentId;
	return {
		...source,
		defaultAgentId: effectiveDefaultAgentId,
		assertCurrent() {
			source.assertCurrent();
			const currentDefaultAgentId = resolveDefaultAgentId();
			if (currentDefaultAgentId !== defaultAgentId || (currentDefaultAgentId ?? state.deps.defaultAgentId) !== effectiveDefaultAgentId) throw new Error("Cron mutation source or service changed before commit");
		}
	};
}
/** Prepare caller checks from a worker-owned job definition before commit admission. */
async function prepareCronJobMutation(_state, source, mutation, snapshot) {
	let plan;
	await runCronRuntimeMutation({
		context: source.context,
		type: "cron.prepareJobMutation",
		input: {
			storeKey: source.storeKey,
			mutation
		},
		snapshot,
		assertCurrent: () => source.assertCurrent(),
		publish: (outcome) => {
			plan = outcome;
		}
	});
	if (!plan) throw new Error("Cron job preparation returned no result");
	return plan;
}
/** Publish a private CRUD draft only after its job and receipt transaction is known committed. */
async function persistCronJobMutation(params) {
	const { state, source } = params;
	const observedRevision = getCronJobsStoreRevision(source.storeKey);
	const markCommitted = captureCronMutationCommit(params.method);
	let published = false;
	let notifications = [];
	const assertCurrent = () => {
		source.assertCurrent();
		params.assertCurrent?.();
		source.assertCurrent();
		if (params.agentId !== void 0 && state.deps.isAgentAvailable?.(params.agentId, { deletionBlocked: false }) === false) throw new Error(describeUnavailableCronAgent(params.agentId));
	};
	await runCronRuntimeMutation({
		context: source.context,
		type: "cron.mutateJobs",
		input: structuredClone({
			storeKey: source.storeKey,
			agentId: params.agentId,
			preconditionJob: params.preconditionJob,
			expectedJob: params.expectedJob,
			receiptMutation: params.receiptMutation,
			jobMutation: params.jobMutation
		}),
		assertCurrent,
		snapshot: params.jobMutationSnapshot,
		publish({ store, names, changed, notifications: committedNotifications, logs }) {
			published = true;
			notifications = committedNotifications;
			for (const entry of logs) state.deps.log[entry.level](entry.fields, entry.message);
			if (changed) markCommitted?.();
			const unchanged = getCronJobsStoreRevision(source.storeKey) === observedRevision;
			noteCronJobsStoreCommit(source.storeKey);
			state.op.then(() => {
				wakeCronRunQueues(state);
			});
			if (unchanged) publishCronJobNames(source.storeKey, source.context, names);
			state.store = store;
			state.storeLoadedAtMs = state.deps.nowMs();
			loadedCronStoreRevisions.set(state, { revision: unchanged ? getCronJobsStoreRevision(source.storeKey) : -1 });
			try {
				params.afterCommit?.();
			} finally {
				try {
					publishDurableNextRunChanges({
						state,
						storeJobs: store.jobs,
						suppressScheduledJobId: params.suppressScheduledJobId
					});
				} finally {
					params.afterPublish?.();
				}
			}
		},
		onSettled(outcome) {
			if (!published && outcome === "unknown") {
				noteCronJobsStoreCommit(source.storeKey);
				loadedCronStoreRevisions.set(state, { revision: -1 });
			}
		},
		onRolledBackMutation() {
			loadedCronStoreRevisions.set(state, { revision: -1 });
			throw new CronJobsStoreChangedError(source.storeKey);
		}
	});
	await runPostPersistCronNotifications(state, notifications);
}
//#endregion
//#region src/cron/service/schedule-maintenance.ts
/** Schedules authoritative rows in the worker without clearing live process ownership. */
async function recomputeUnownedCronSchedules(state, opts) {
	const context = captureOpenClawStateWorkerContext();
	const generation = state.lifecycleGeneration;
	const storeKey = cronStoreKey(state.deps.storePath);
	let outcome;
	await runCronRuntimeMutation({
		context,
		type: "cron.scheduleUnowned",
		input: {
			storeKey,
			options: opts ? { ...opts } : void 0
		},
		assertCurrent() {
			if (state.lifecycleGeneration !== generation) throw new Error("Cron schedule maintenance owner retired");
		},
		snapshot: { nowMs: opts?.nowMs ?? state.deps.nowMs() },
		onSettled(result) {
			if (result === "unknown") noteCronJobsStoreCommit(storeKey);
		},
		publish(committed) {
			outcome = committed;
			if (committed.changed) noteCronJobsStoreCommit(storeKey);
			applyCronRuntimeRowsToState(state, committed.jobs);
			for (const entry of committed.logs) state.deps.log[entry.level](entry.fields, entry.message);
		}
	});
	if (!outcome) throw new Error("Cron schedule maintenance did not publish its committed rows");
	await runPostPersistCronNotifications(state, outcome.notifications);
	wakeCronRunQueues(state);
	return outcome;
}
//#endregion
//#region src/cron/service/timer-notifications.ts
function maybeNotifyIsolatedAgentSetupTimeout(state, result) {
	const signal = result.isolatedAgentSetupTimeout;
	if (!signal) return false;
	const notify = state.deps.onIsolatedAgentSetupTimeout;
	if (!notify) return false;
	const logFailure = (err) => {
		state.deps.log.warn({
			jobId: result.job.id,
			err: String(err)
		}, "cron: isolated setup timeout handler failed");
	};
	try {
		Promise.resolve(notify({
			job: result.job,
			error: signal.error,
			timeoutMs: signal.timeoutMs
		})).catch(logFailure);
		return true;
	} catch (err) {
		logFailure(err);
		return false;
	}
}
//#endregion
//#region src/cron/service/ops-shared.ts
/** Shared cron operation invariants used across lifecycle, CRUD, and manual runs. */
function markManualCronJobActive(state, job, runReceipt) {
	state.activeManualRunJobIds.add(job.id);
	return markServiceCronJobActive(state, job, runReceipt);
}
function clearManualCronJobActive(state, jobId, activeJobMarker) {
	state.activeManualRunJobIds.delete(jobId);
	clearCronJobActive(jobId, activeJobMarker);
	if (state.activeManualRunJobIds.size === 0) state.manualSetupTimeoutNotified = false;
}
function maybeNotifyManualIsolatedSetupTimeout(state, result) {
	if (!result.isolatedAgentSetupTimeout || state.manualSetupTimeoutNotified) return false;
	const notified = maybeNotifyIsolatedAgentSetupTimeout(state, result);
	state.manualSetupTimeoutNotified ||= notified;
	return notified;
}
async function ensureLoadedForRead(state) {
	await ensureLoadedForOperation(state);
	if (!state.store || state.schedulerStarted) return;
	await recomputeUnownedCronSchedules(state);
}
/** Resolves the current configured default agent without caching reloadable state. */
function resolveCurrentDefaultAgentId(state) {
	return state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
}
//#endregion
//#region src/cron/service/ops-read.ts
/** Called under the read lock, after loading passive or newly committed state. */
async function readSnapshot(state) {
	await ensureLoadedForRead(state);
	const storeRevision = getCronJobsStoreRevision(state.deps.storePath);
	const source = state.store?.jobs;
	const cached = state.schedulerStarted ? state.readSnapshot : void 0;
	if (cached?.storeRevision === storeRevision && cached.source === source) return cached;
	const sqlitePath = resolveOpenClawStateSqlitePath();
	return state.readSnapshot = {
		storeRevision,
		source,
		readJobs: /* @__PURE__ */ new WeakMap(),
		status: Object.freeze({
			enabled: state.deps.cronEnabled,
			triggersEnabled: state.deps.cronConfig?.triggers?.enabled !== false,
			storePath: sqlitePath,
			storage: "sqlite",
			sqlitePath,
			jobs: state.store?.jobs.length ?? 0,
			nextWakeAtMs: state.deps.cronEnabled ? nextWakeAtMs(state) ?? null : null
		})
	};
}
/** Returns the current scheduler generation's immutable aggregate status. */
async function status(state) {
	return await locked(state, async () => (await readSnapshot(state)).status, { readOnly: true });
}
/** Lists cron jobs sorted by next run time, excluding disabled jobs unless requested. */
async function list(state, opts) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		const includeDisabled = opts?.includeDisabled === true;
		return sortCronJobs((state.store?.jobs ?? []).filter((j) => includeDisabled || isJobEnabled(j)), "nextRunAtMs", "asc");
	}, { readOnly: true });
}
/** Reads one cron job by id without advancing due schedules. */
async function readJob(state, id) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		return state.store?.jobs.find((job) => job.id === id);
	}, { readOnly: true });
}
/** Reads one job's private scratch state after proving the job exists in this store. */
async function readScratch(state, id, options) {
	const source = captureCronJobMutationSource(state);
	const callerCurrent = options?.assertCurrent;
	const signal = options?.signal;
	const assertCurrent = () => {
		source.assertCurrent();
		signal?.throwIfAborted();
		callerCurrent?.();
		source.assertCurrent();
	};
	return await locked(state, async () => {
		assertCurrent();
		await ensureLoaded(state);
		assertCurrent();
		const job = findJobOrThrow(state, id);
		const revision = resolveCronJobConfigRevision(job);
		const snapshot = await readCronScratchSnapshot(state.deps.storePath, {
			kind: "job",
			jobId: id,
			createdAtMsFallback: job.createdAtMs
		}, {}, {
			context: source.context,
			assertCurrent,
			signal
		});
		assertCurrent();
		if (!snapshot || snapshot.configRevision !== revision) {
			noteCronJobsStoreCommit(source.storeKey);
			throw new CronJobsStoreChangedError(source.storeKey);
		}
		return snapshot.state;
	});
}
/** Writes or clears one job's private scratch under the cron mutation lock. */
async function writeScratch(state, id, params) {
	const source = captureCronJobMutationSource(state);
	return await locked(state, async () => {
		source.assertCurrent();
		await ensureLoaded(state);
		source.assertCurrent();
		const job = findJobOrThrow(state, id);
		const expectedRevision = resolveCronJobConfigRevision(job);
		return await writeCronJobScratch({
			storePath: state.deps.storePath,
			jobId: id,
			content: params.content,
			expectedRevision: params.expectedRevision,
			sourceSha256: params.sourceSha256,
			nowMs: state.deps.nowMs()
		}, {
			context: source.context,
			createdAtMsFallback: job.createdAtMs,
			assertCurrent() {
				source.assertCurrent();
				params.commitGuard?.();
				source.assertCurrent();
			},
			expectedConfigRevision: expectedRevision
		}).catch((error) => {
			if (error instanceof Error && error.name === "CronJobsStoreChangedError") {
				noteCronJobsStoreCommit(source.storeKey);
				throw new CronJobsStoreChangedError(source.storeKey);
			}
			throw error;
		});
	});
}
const SLOW_LIST_PAGE_MS = 1e3;
/** Lists a filtered, sorted, bounded page of cron jobs for CLI/RPC callers. */
async function listPage(state, opts, matchesJob) {
	const startedAt = performance.now();
	let enteredAt;
	let finishedAt;
	let sourceCount;
	let result;
	try {
		return await locked(state, async () => {
			enteredAt = performance.now();
			try {
				const read = await readSnapshot(state);
				const query = normalizeLowercaseStringOrEmpty(opts?.query);
				const enabledFilter = opts?.enabled ?? (opts?.includeDisabled ? "all" : "enabled");
				const scheduleKindFilter = opts?.scheduleKind ?? "all";
				const lastRunStatusFilter = opts?.lastRunStatus ?? "all";
				const triggerFilter = opts?.trigger ?? "all";
				const sortBy = opts?.sortBy ?? "nextRunAtMs";
				const sortDir = opts?.sortDir ?? "asc";
				const requestedAgentId = normalizeOptionalAgentId(opts?.agentId);
				const source = state.store?.jobs ?? [];
				sourceCount = source.length;
				const filtered = source.filter((job) => {
					if (enabledFilter === "enabled" && !isJobEnabled(job)) return false;
					if (enabledFilter === "disabled" && isJobEnabled(job)) return false;
					if (requestedAgentId && tryResolveCronJobEffectiveAgentId(job, resolveCurrentDefaultAgentId(state)) !== requestedAgentId) return false;
					if (scheduleKindFilter !== "all" && job.schedule.kind !== scheduleKindFilter) return false;
					if (lastRunStatusFilter !== "all" && (resolveJobLastRunStatus(job) ?? "unknown") !== lastRunStatusFilter) return false;
					if (triggerFilter === "conditional" && !job.trigger) return false;
					if (triggerFilter === "unconditional" && job.trigger) return false;
					if (query) {
						if (!normalizeLowercaseStringOrEmpty([
							job.id,
							job.name,
							job.description ?? "",
							job.agentId ?? "",
							...job.displayName ? [job.displayName] : []
						].join(" ")).includes(query)) return false;
					}
					return !matchesJob || matchesJob(job);
				});
				let snapshot = read.list;
				if (!snapshot || snapshot.sortBy !== sortBy || snapshot.sortDir !== sortDir || snapshot.filteredJobs.length !== filtered.length || !snapshot.filteredJobs.every((job, index) => job === filtered[index])) {
					const jobs = sortCronJobs([...filtered], sortBy, sortDir);
					snapshot = {
						filteredJobs: filtered,
						sortBy,
						sortDir,
						jobs,
						snapshotRevision: resolveCronListSnapshotRevision(jobs)
					};
					if (jobs.length > 0 || !read.list) read.list = snapshot;
				}
				const { jobs: sortedJobs, snapshotRevision } = snapshot;
				const total = sortedJobs.length;
				const offset = Math.max(0, Math.min(total, Math.floor(opts?.offset ?? 0)));
				const defaultLimit = total === 0 ? 50 : total;
				const limit = Math.max(1, Math.min(200, Math.floor(opts?.limit ?? defaultLimit)));
				const jobs = sortedJobs.slice(offset, offset + limit).map((job) => {
					let frozenJob = read.readJobs.get(job);
					if (!frozenJob) {
						frozenJob = freezeJsonSnapshot(structuredClone(job));
						read.readJobs.set(job, frozenJob);
					}
					return frozenJob;
				});
				const nextOffset = offset + jobs.length;
				return result = {
					jobs,
					snapshotRevision,
					total,
					offset,
					limit,
					hasMore: nextOffset < total,
					nextOffset: nextOffset < total ? nextOffset : null
				};
			} finally {
				finishedAt = performance.now();
			}
		}, { readOnly: true });
	} finally {
		const completedAt = performance.now();
		const elapsedMs = completedAt - startedAt;
		if (elapsedMs >= SLOW_LIST_PAGE_MS) try {
			state.deps.log.warn({
				operation: "cron.listPage",
				pid: process.pid,
				threadId,
				isMainThread,
				elapsedMs: Math.round(elapsedMs),
				waitToCallbackMs: enteredAt === void 0 ? void 0 : Math.round(enteredAt - startedAt),
				callbackMs: enteredAt === void 0 || finishedAt === void 0 ? void 0 : Math.round(finishedAt - enteredAt),
				completionDelayMs: finishedAt === void 0 ? void 0 : Math.round(completedAt - finishedAt),
				sourceCount,
				matchedCount: result?.total,
				returnedCount: result?.jobs.length,
				outcome: result ? "ok" : "error",
				thresholdMs: SLOW_LIST_PAGE_MS
			}, "cron: slow list page");
		} catch {}
	}
}
//#endregion
//#region src/cron/service/run-history.ts
/** Cron receipts own running work; history records only durable outcomes. */
function createCronHistoryRunId(jobId, startedAt, receiptId, publicRunId) {
	const receipt = receiptId?.trim();
	const publicId = publicRunId?.trim();
	const discriminator = receipt || publicId || randomUUID();
	const publicSuffix = publicId && publicId !== discriminator ? `:${publicId}` : "";
	return `${createCronExecutionId(jobId, startedAt)}:${discriminator}${publicSuffix}`;
}
function createCronRunHandle(params) {
	return { runId: createCronHistoryRunId(params.job.id, params.startedAt, params.runReceipt?.receiptId, params.publicRunId) };
}
/** Join history persistence before settlement; a storage failure cannot strand a running receipt. */
async function finishCronRun(state, result) {
	const entry = cronRunLogEntryFromEvent(result.event, state.deps.nowMs(), result.errorClassification);
	const startedAt = entry.runAtMs ?? entry.ts;
	const job = result.job ?? result.event.job;
	const source = result.historySource;
	const storeKey = source?.storeKey ?? cronStoreKey(state.deps.storePath);
	await persistCronOutcome(state, {
		storeKey,
		jobId: entry.jobId,
		runId: result.taskRunId ?? createCronHistoryRunId(entry.jobId, startedAt, void 0, entry.runId),
		agentId: !result.ownerlessRun && job ? tryResolveCronJobEffectiveAgentId(job, source ? source.defaultAgentId : state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId) : void 0,
		startedAt,
		endedAt: entry.ts,
		status: cronRunStorageStatus(entry),
		sessionKey: entry.sessionKey,
		error: entry.error,
		summary: entry.summary,
		detail: cronRunLogEntryToDetail(entry, {
			storeKey,
			scriptResult: result.scriptResult,
			triggerEval: result.triggerEval
		})
	}, source);
}
async function persistCronOutcome(state, input, source) {
	try {
		await recordCronRun(input, source);
	} catch (error) {
		state.deps.log.warn({
			jobId: input.jobId,
			runId: input.runId,
			error
		}, "cron: failed to persist run history");
	}
}
//#endregion
//#region src/cron/service/skipped-runs.ts
/** Publish history and other effects after the worker transaction completes. */
async function recordSkippedCronRuns(params) {
	const { state, source } = params;
	const change = structuredClone(params.change);
	let committed;
	const defaultAgentId = state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
	const historySource = {
		context: source.context,
		storeKey: source.storeKey,
		defaultAgentId: defaultAgentId ?? state.deps.defaultAgentId
	};
	let failure;
	try {
		await runCronRuntimeMutation({
			context: source.context,
			type: "cron.recordSkippedRuns",
			input: {
				storeKey: source.storeKey,
				change
			},
			assertCurrent: () => source.assertCurrent(),
			snapshot: {
				nowMs: params.nowMs,
				defaultAgentId,
				notificationRouting: captureCronNotificationRouting(defaultAgentId, state.deps.defaultAgentId),
				cronConfig: structuredClone(state.deps.cronConfig),
				failureRepairTimeoutMs: state.deps.failureRepairTimeoutMs,
				ownership: (state.store?.jobs ?? []).map((job) => ({
					jobId: job.id,
					active: isCronJobActive(job.id)
				}))
			},
			publish(outcome) {
				committed = outcome;
				if (outcome.jobs.length > 0) noteCronJobsStoreCommit(source.storeKey);
			}
		});
	} catch (error) {
		noteCronJobsStoreCommit(source.storeKey);
		failure = { error };
	}
	if (committed) try {
		await params.afterCommit(committed, historySource);
	} catch (error) {
		failure ??= { error };
	}
	if (failure) throw failure.error;
	if (!committed) throw new Error("Cron skipped run did not publish its committed outcome");
}
//#endregion
//#region src/cron/service/run-owner.ts
/** Records ownerless scheduled attempts before one invalid job can block batch admission. */
async function skipCronJobsWithoutOwners(state, candidates, nowMs, opts) {
	const source = opts?.source ?? captureCronServiceMutationSource(state);
	const resolveOwnerAgentId = (job) => tryResolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId);
	const unresolved = new Map(candidates.filter((job) => !resolveOwnerAgentId(job)).map((job) => [job.id, job]));
	if (unresolved.size === 0) return candidates;
	await recordSkippedCronRuns({
		state,
		source,
		nowMs,
		change: {
			kind: "ownerless",
			proposals: [...unresolved.values()].map((job) => ({
				jobId: job.id,
				enabled: job.enabled,
				configRevision: resolveCronJobConfigRevision(job),
				nextRunAtMs: job.state.nextRunAtMs,
				lastRunAtMs: job.state.lastRunAtMs,
				lastRunStatus: job.state.lastRunStatus
			})),
			scheduleMode: opts?.scheduleMode,
			scheduleOwnershipAtMs: opts?.manualRun?.scheduleOwnershipAtMs
		},
		async afterCommit(skipped, historySource) {
			applyCronRuntimeRowsToState(state, skipped.jobs);
			for (const entry of skipped.logs) state.deps.log[entry.level](entry.fields, entry.message);
			for (const job of skipped.jobs) {
				state.deps.log.warn({
					jobId: job.id,
					error: CRON_AGENT_SELECTION_REQUIRED_MESSAGE
				}, "cron: skipping job with unresolved owner");
				await emitOwnerlessFinished(state, job, nowMs, historySource, opts?.manualRun);
			}
			if (opts?.manualRun) for (const job of skipped.rejected) await emitOwnerlessFinished(state, job, nowMs, historySource, opts.manualRun);
			for (const notification of skipped.notifications) await runPostPersistCronNotifications(state, [notification]);
		}
	});
	return candidates.filter((job) => !unresolved.has(job.id));
}
async function emitOwnerlessFinished(state, job, nowMs, historySource, manualRun) {
	const event = {
		jobId: job.id,
		action: "finished",
		job,
		status: "skipped",
		completionStatus: "failed",
		error: CRON_AGENT_SELECTION_REQUIRED_MESSAGE,
		runId: manualRun?.runId,
		runAtMs: nowMs,
		durationMs: 0,
		nextRunAtMs: job.state.nextRunAtMs,
		deliveryStatus: job.state.lastDeliveryStatus,
		deliveryError: job.state.lastDeliveryError
	};
	await finishCronRun(state, {
		event,
		ownerlessRun: true,
		historySource
	});
	emit(state, event);
	if (manualRun?.terminalTracker) manualRun.terminalTracker.emitted = true;
}
//#endregion
//#region src/cron/service/run-queue-requests.ts
/** Encode worker requests without owning admission, publication, or launch state. */
function createCronRunRequests(candidates, options, nowMs) {
	return candidates.map((job) => {
		const receiptId = (options.event ? void 0 : options.runId) ?? `cron-request.${randomUUID()}`;
		return {
			receiptId,
			jobId: job.id,
			configRevision: resolveCronJobConfigRevision(job),
			mode: options.onExit ? "on-exit" : options.mode === "force" ? "force" : "if-enabled",
			onExitSchedule: options.onExit?.schedule,
			event: options.event,
			preserveSchedule: isImmediateCronRunMode(options.mode),
			scheduleOwnershipAtMs: options.scheduleOwnershipAtMs ?? nowMs,
			requestRunId: options.runId ?? receiptId
		};
	});
}
/** Project only transient fields needed by the worker; launch state stays with the queue owner. */
function projectCronRunQueueRequests(contexts, selection = {}) {
	return [...contexts].filter((pending) => !pending.started && (selection.includePendingEvents || !pending.options.event || pending.eventTransferred)).map(({ receipt, options, eventTransferred }) => ({
		receiptId: receipt.receiptId,
		mode: options.onExit ? "on-exit" : options.source === "manual" || options.source === "event" ? options.mode === "force" ? "force" : "if-enabled" : "scheduled",
		onExitSchedule: options.onExit?.schedule,
		event: eventTransferred ? void 0 : options.event
	}));
}
//#endregion
//#region src/cron/service/agent-watchdog.ts
/** Timeout watchdogs for isolated cron agent setup and execution phases. */
const CRON_TIMEOUT_CLEANUP_GUARD_MS = 2e4;
const CRON_AGENT_SETUP_WATCHDOG_MS = 6e4;
const CRON_AGENT_PRE_EXECUTION_WATCHDOG_MS = 6e4;
const CRON_AGENT_PRE_EXECUTION_MIN_WATCHDOG_MS = 1e3;
const CRON_AGENT_PHASE_WATCHDOG_STAGE = {
	runner_entered: "pre_execution",
	workspace: "pre_execution",
	runtime_plugins: "pre_execution",
	before_agent_reply: "execution",
	model_resolution: "pre_execution",
	auth: "pre_execution",
	context_engine: "pre_execution",
	attempt_dispatch: "execution",
	context_assembled: "execution",
	turn_accepted: "execution",
	process_spawned: "execution",
	tool_execution_started: "execution",
	assistant_output_started: "execution",
	model_call_started: "execution"
};
/** Tracks isolated-agent setup/execution progress and fires the correct cron timeout reason. */
function createCronAgentWatchdog(params) {
	let state = params.deferUntilRunner ? "waiting_for_runner" : "executing";
	let timeoutId;
	let setupTimeoutId;
	let preExecutionTimeoutId;
	let activeExecution;
	let observedLaneWait = false;
	let waitingForLane = false;
	const setTimedOut = (reason) => {
		if (state === "timed_out" || state === "disposed") return;
		state = "timed_out";
		params.triggerTimeout(reason);
	};
	const startTimeout = () => {
		if (timeoutId || state === "disposed") return;
		timeoutId = setTimeout(() => {
			setTimedOut(timeoutErrorMessage(activeExecution));
		}, params.jobTimeoutMs);
	};
	const clearSetupTimeout = () => {
		if (!setupTimeoutId) return;
		clearTimeout(setupTimeoutId);
		setupTimeoutId = void 0;
	};
	const startSetupTimeout = () => {
		if (setupTimeoutId || state !== "waiting_for_runner" || waitingForLane) return;
		setupTimeoutId = setTimeout(() => {
			if (state === "waiting_for_runner" && !waitingForLane) setTimedOut(setupTimeoutErrorMessage(activeExecution));
		}, CRON_AGENT_SETUP_WATCHDOG_MS);
	};
	const clearPreExecutionTimeout = () => {
		if (!preExecutionTimeoutId) return;
		clearTimeout(preExecutionTimeoutId);
		preExecutionTimeoutId = void 0;
	};
	const isWaitingForExecution = () => state === "waiting_for_initial_progress" || state === "waiting_for_fallback_execution";
	const startPreExecutionTimeout = () => {
		if (preExecutionTimeoutId || !isWaitingForExecution()) return;
		preExecutionTimeoutId = setTimeout(() => {
			if (isWaitingForExecution()) setTimedOut(preExecutionTimeoutErrorMessage(activeExecution));
		}, resolveCronAgentPreExecutionWatchdogMs(params.jobTimeoutMs));
	};
	const noteExecutionProgress = (info) => {
		if (!info) return;
		activeExecution = {
			...activeExecution,
			...info
		};
		const stage = info.phase ? CRON_AGENT_PHASE_WATCHDOG_STAGE[info.phase] : void 0;
		if (state === "waiting_for_initial_progress" && info.phase !== void 0 && info.phase !== "runner_entered" || state === "waiting_for_fallback_execution" && stage === "execution") {
			state = "executing";
			clearPreExecutionTimeout();
		}
	};
	return {
		start: () => {
			if (params.deferUntilRunner) {
				startSetupTimeout();
				return;
			}
			startTimeout();
		},
		replaceTimeout: (timeoutMs) => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = timeoutMs !== void 0 && state !== "timed_out" && state !== "disposed" ? setTimeout(() => setTimedOut(timeoutErrorMessage(activeExecution)), timeoutMs) : void 0;
		},
		noteLaneWait: () => {
			if (state === "waiting_for_runner") {
				observedLaneWait = true;
				waitingForLane = true;
				clearSetupTimeout();
			}
		},
		noteLaneAdmitted: () => {
			if (state === "waiting_for_runner") {
				observedLaneWait = false;
				waitingForLane = false;
				startSetupTimeout();
			}
		},
		noteRunnerStarted: (info) => {
			if (state === "disposed" || state === "timed_out") return;
			clearSetupTimeout();
			startTimeout();
			if (info?.isFallback === true) {
				clearPreExecutionTimeout();
				state = "waiting_for_fallback_execution";
			} else if (state === "waiting_for_runner") state = "waiting_for_initial_progress";
			noteExecutionProgress(info);
			startPreExecutionTimeout();
		},
		notePhase: (info) => {
			if (state === "disposed" || state === "timed_out") return;
			noteExecutionProgress(info);
		},
		activeExecution: () => activeExecution,
		observedLaneWait: () => observedLaneWait,
		dispose: () => {
			state = "disposed";
			if (timeoutId) clearTimeout(timeoutId);
			clearSetupTimeout();
			clearPreExecutionTimeout();
		}
	};
}
/** Joins timeout cleanup and command settlement without wedging the cron lane. */
async function settleTimedOutCronRun(state, job, timeoutMs, execution, commandSettlement) {
	const cleanupPromise = state.deps.cleanupTimedOutAgentRun?.({
		job,
		timeoutMs,
		execution
	});
	if (!cleanupPromise && !commandSettlement) return;
	const cleanup = cleanupPromise?.catch((err) => {
		state.deps.log.warn({
			jobId: job.id,
			err: String(err)
		}, "cron: timed-out agent cleanup failed");
	});
	await raceWithTimeout(Promise.allSettled([cleanup, commandSettlement]), CRON_TIMEOUT_CLEANUP_GUARD_MS, () => void 0);
}
function resolveCronAgentPreExecutionWatchdogMs(jobTimeoutMs) {
	return Math.max(CRON_AGENT_PRE_EXECUTION_MIN_WATCHDOG_MS, Math.min(CRON_AGENT_PRE_EXECUTION_WATCHDOG_MS, Math.floor(jobTimeoutMs / 2)));
}
//#endregion
//#region src/cron/service/delivery-attempt-fence.ts
function createCronCompletionDeliveryFence(params) {
	const { state, handle, activeJobMarker, signal } = params;
	const context = captureOpenClawStateWorkerContext();
	const generation = state.lifecycleGeneration;
	const defaultAgentId = () => state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId;
	const admittedDefaultAgentId = defaultAgentId();
	const allowMissingJob = () => activeJobMarker?.jobId === handle.jobId && isCronSelfRemovalCurrent(activeJobMarker);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		signal.throwIfAborted();
		if (state.deps.isAgentAvailable?.(handle.agentId, { deletionBlocked: false }) === false) throw new CronRunReceiptRevisionError(handle.receiptId, describeUnavailableCronAgent(handle.agentId), "owner-unavailable");
		if (state.lifecycleGeneration !== generation || !isCronActiveJobMarkerCurrent(activeJobMarker) || activeJobMarker?.cancellation?.kind === "requested" || activeJobMarker?.jobRemoved && !allowMissingJob() || !params.job.agentId?.trim() && defaultAgentId() !== admittedDefaultAgentId) throw new CronRunReceiptRevisionError(handle.receiptId, "cron delivery owner retired");
	};
	return {
		assertCurrent,
		async beforeAttempt() {
			assertCurrent();
			let committed = false;
			try {
				await runCronRuntimeMutation({
					context,
					type: "cron.markDeliveryStarted",
					input: {
						storeKey: handle.storeKey,
						handle: { ...handle }
					},
					assertCurrent,
					snapshot: {},
					publish() {
						committed = true;
					}
				});
			} catch (error) {
				if (!committed) throw error;
			}
			assertCurrent();
		}
	};
}
//#endregion
//#region src/cron/service/timeout-policy.ts
/** Resolves cron job wall-clock timeout policy. */
/**
* Maximum wall-clock time for a single job execution. Acts as a safety net
* on top of per-provider/per-agent timeouts to prevent one stuck job from
* wedging the entire cron lane.
*/
const DEFAULT_JOB_TIMEOUT_MS = 6e5;
/**
* Agent turns can legitimately run much longer than generic cron jobs.
* Use a larger safety ceiling when no explicit timeout is set.
*/
const AGENT_TURN_SAFETY_TIMEOUT_MS = 36e5;
/** Resolves the wall-clock timeout for a cron job, including explicit detached-run overrides. */
function resolveCronJobTimeoutMs(job) {
	const configuredTimeoutMs = (job.payload.kind === "agentTurn" || job.payload.kind === "command" || job.payload.kind === "script") && typeof job.payload.timeoutSeconds === "number" ? finiteSecondsToTimerSafeMilliseconds(job.payload.timeoutSeconds) ?? 0 : void 0;
	if (configuredTimeoutMs === void 0) return job.payload.kind === "agentTurn" ? AGENT_TURN_SAFETY_TIMEOUT_MS : DEFAULT_JOB_TIMEOUT_MS;
	return configuredTimeoutMs <= 0 ? void 0 : configuredTimeoutMs;
}
//#endregion
//#region src/cron/script-failure.ts
function classifyCronScriptFailure(code) {
	if (code === "timeout") return {
		kind: "reason",
		reason: "timeout"
	};
	if (code === "runtime_unavailable") return {
		kind: "reason",
		reason: "server_error"
	};
	return { kind: "permanent" };
}
/** Authors matched retry policy and safe notification detail from one closed code. */
function cronScriptFailureMetadata(source, code) {
	return {
		errorClassification: classifyCronScriptFailure(code),
		failureNotificationDetail: {
			kind: "script-failure",
			source,
			code
		}
	};
}
//#endregion
//#region src/cron/service/timer-execution.ts
/** Executes a cron job without mutating persisted job state. */
async function executeJobCore(state, job, abortSignal, options) {
	const resolveAbortError = () => ({
		status: "error",
		error: abortErrorMessage(abortSignal),
		errorClassification: cronAbortErrorClassification(abortSignal)
	});
	if (abortSignal?.aborted) return resolveAbortError();
	const execTargetRecoveryError = resolveCronToolsAllowExecTargetRecoveryError({
		jobId: job.id,
		requirement: job.toolsAllowExecTargetRequirement,
		execTarget: job.toolsAllowExecTarget
	});
	if (execTargetRecoveryError) return {
		status: "error",
		error: execTargetRecoveryError,
		diagnostics: createCronRunDiagnosticsFromError("cron-preflight", execTargetRecoveryError, { nowMs: state.deps.nowMs })
	};
	if (options?.streamScheduleKey !== void 0 || options?.streamSourceIdentity !== void 0) {
		if (options.streamScheduleKey === void 0 || options.streamSourceIdentity === void 0 || !ownsCronSource(job, options.streamScheduleKey, options.streamSourceIdentity)) return {
			status: "skipped",
			error: "stream batch source no longer current"
		};
	}
	let effectiveJob = job;
	let triggerEval;
	if (job.trigger) {
		const evaluator = state.deps.evaluateCronTrigger;
		if (!evaluator) return {
			status: "error",
			error: "cron trigger evaluator is unavailable",
			...cronScriptFailureMetadata("trigger", "runtime_unavailable")
		};
		const evaluation = await evaluator({
			deliveryAttemptFence: options?.deliveryAttemptFence ?? null,
			job,
			script: job.trigger.script,
			state: job.state.triggerState,
			streamBatch: options?.streamBatch,
			abortSignal,
			executionIdentity: options?.executionIdentity
		});
		if (abortSignal?.aborted) return resolveAbortError();
		if (evaluation.kind === "busy") {
			state.deps.log.debug({ jobId: job.id }, "cron: trigger evaluation skipped while busy");
			return {
				status: "ok",
				triggerEval: {
					fired: false,
					stateChanged: false,
					busy: true
				}
			};
		}
		if (evaluation.kind === "error") return {
			status: "error",
			error: `cron trigger evaluation failed (${evaluation.code}): ${evaluation.error}`,
			...cronScriptFailureMetadata("trigger", evaluation.code),
			triggerEval: {
				fired: false,
				stateChanged: false
			}
		};
		const stateChanged = Object.hasOwn(evaluation, "state");
		triggerEval = {
			fired: evaluation.fire,
			stateChanged,
			...stateChanged ? { state: evaluation.state } : {}
		};
		if (!evaluation.fire) return {
			status: "ok",
			triggerEval
		};
		if (evaluation.message !== void 0) effectiveJob = {
			...job,
			payload: appendCronPayloadText(job.payload, evaluation.message)
		};
	}
	if (options?.assertRunCurrent) {
		await options.assertRunCurrent();
		if (options.activeJobMarker?.cancellation?.kind === "requested") return {
			status: "error",
			error: options.activeJobMarker.cancellation.reason,
			errorClassification: { kind: "aborted" }
		};
		if (abortSignal?.aborted) return resolveAbortError();
		if (!isCronActiveJobMarkerCurrent(options.activeJobMarker)) return {
			status: "error",
			error: "Gateway restarting.",
			errorClassification: { kind: "aborted" }
		};
	}
	options?.onPayloadExecutionStarted?.();
	if (effectiveJob.payload.kind === "script") {
		const result = await executeScriptCronJob(state, effectiveJob, abortSignal, options);
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	if (options?.streamBatch !== void 0) effectiveJob = {
		...effectiveJob,
		payload: appendCronPayloadText(effectiveJob.payload, options.streamBatch)
	};
	const heartbeatTask = isHeartbeatTaskCronJob(effectiveJob) ? effectiveJob : void 0;
	if (effectiveJob.payload.kind === "heartbeat" || heartbeatTask) {
		const agentId = resolveCronJobEffectiveAgentId(effectiveJob, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId);
		const heartbeatWake = heartbeatTask ? {
			source: "interval",
			intent: "task",
			reason: `heartbeat-task:${heartbeatTask.id}`,
			agentId,
			tasks: [{
				jobId: heartbeatTask.id,
				name: heartbeatTask.name,
				prompt: heartbeatTask.payload.text
			}]
		} : {
			source: "interval",
			intent: "scheduled",
			reason: "interval",
			agentId,
			scheduledEveryMs: effectiveJob.schedule.kind === "every" ? effectiveJob.schedule.everyMs : void 0
		};
		const heartbeatWaitLifecycle = options?.onHeartbeatExecutionStarted?.(heartbeatWake);
		const releaseHeartbeatWait = markCronJobWaitingForHeartbeat(options?.activeJobMarker);
		let heartbeatResult;
		try {
			heartbeatResult = await (state.deps.requestHeartbeatAndWait?.(heartbeatWake, {
				...abortSignal ? { abortSignal } : {},
				...heartbeatWaitLifecycle
			}) ?? {
				status: "failed",
				reason: "heartbeat wake settlement unavailable"
			});
		} finally {
			releaseHeartbeatWait();
		}
		if (abortSignal?.aborted) return resolveAbortError();
		const result = heartbeatResult.status === "ran" ? {
			status: "ok",
			summary: heartbeatTask ? "heartbeat task completed" : "heartbeat completed"
		} : heartbeatResult.status === "failed" ? {
			status: "error",
			error: `heartbeat failed: ${heartbeatResult.reason}`
		} : {
			status: "skipped",
			error: `heartbeat skipped: ${heartbeatResult.reason}`
		};
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	if (effectiveJob.sessionTarget === "main") {
		const result = await executeMainSessionCronJob(state, effectiveJob, abortSignal, options?.onHeartbeatExecutionStarted, options?.activeJobMarker);
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	if (effectiveJob.sessionTarget.startsWith("session:") && effectiveJob.payload.kind === "agentTurn") {
		const result = await executeSharedSessionCronJob(state, effectiveJob, effectiveJob.payload.message, abortSignal, options);
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	const result = await executeDetachedCronJob(state, effectiveJob, abortSignal, options);
	return triggerEval ? {
		...result,
		triggerEval
	} : result;
}
async function executeMainSessionCronJob(state, job, abortSignal, onHeartbeatExecutionStarted, activeJobMarker) {
	const text = job.payload.kind === "systemEvent" && typeof job.payload.text === "string" ? job.payload.text.trim() : void 0;
	if (!text) return {
		status: "skipped",
		error: job.payload.kind === "systemEvent" ? "main job requires non-empty systemEvent text" : "main job requires payload.kind=\"systemEvent\""
	};
	const agentId = resolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId);
	const deliveryContext = await resolveMainSessionCronDeliveryContext(state, job);
	const queuedSystemEvent = normalizeQueuedSystemEventHandle(state.deps.enqueueSystemEvent(text, {
		agentId,
		contextKey: `cron:${job.id}`,
		...deliveryContext ? { deliveryContext } : {}
	}));
	const heartbeatWake = {
		source: "cron",
		intent: job.wakeMode === "now" ? "immediate" : "event",
		reason: `cron:${job.id}`,
		agentId,
		heartbeat: { target: "last" }
	};
	const removeQueuedSystemEvent = () => removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
	if (job.wakeMode === "now" && state.deps.requestHeartbeatAndWait) {
		const heartbeatWaitLifecycle = onHeartbeatExecutionStarted?.(heartbeatWake);
		const waitStartedAt = state.deps.nowMs();
		const releaseHeartbeatWait = markCronJobWaitingForHeartbeat(activeJobMarker);
		let handedOff = false;
		let heartbeatResult;
		try {
			heartbeatResult = await state.deps.requestHeartbeatAndWait(heartbeatWake, {
				abortSignal,
				...heartbeatWaitLifecycle,
				stopWaitingOnRetry: (result, retryAtMs) => {
					const remainingMs = 12e4 - (state.deps.nowMs() - waitStartedAt);
					handedOff = result.reason === "cron-in-progress" || remainingMs <= 0 || retryAtMs - Date.now() > remainingMs;
					return handedOff;
				}
			});
		} catch (error) {
			removeQueuedSystemEvent();
			throw error;
		} finally {
			releaseHeartbeatWait();
		}
		if (abortSignal?.aborted) {
			removeQueuedSystemEvent();
			return {
				status: "error",
				error: abortErrorMessage(abortSignal),
				errorClassification: cronAbortErrorClassification(abortSignal)
			};
		}
		if (handedOff || heartbeatResult.status === "ran") return {
			status: "ok",
			summary: text
		};
		removeQueuedSystemEvent();
		return {
			status: heartbeatResult.status === "skipped" ? "skipped" : "error",
			error: heartbeatResult.reason,
			summary: text
		};
	}
	if (abortSignal?.aborted) {
		removeQueuedSystemEvent();
		return {
			status: "error",
			error: abortErrorMessage(abortSignal),
			errorClassification: cronAbortErrorClassification(abortSignal)
		};
	}
	state.deps.requestHeartbeat(heartbeatWake);
	return {
		status: "ok",
		summary: text
	};
}
async function executeSharedSessionCronJob(state, job, text, abortSignal, options) {
	if (!state.deps.runSessionEvent) return {
		status: "error",
		error: "Session event execution is unavailable; restart the Gateway and retry"
	};
	const assertCurrent = () => {
		abortSignal?.throwIfAborted();
		options?.deliveryAttemptFence?.assertCurrent();
		if (!isCronActiveJobMarkerCurrent(options?.activeJobMarker)) throw new Error("Gateway restarting.");
	};
	assertCurrent();
	return await state.deps.runSessionEvent({
		admissionSource: resolveCronRunAdmissionSource(job),
		deliveryAttemptFence: options?.deliveryAttemptFence ?? null,
		onExecutionStarted: options?.onExecutionStarted,
		onExecutionPhase: options?.onExecutionPhase,
		onLaneWait: options?.onLaneWait,
		executionIdentity: options?.executionIdentity,
		job,
		text,
		abortSignal,
		prepare: options?.assertRunCurrent,
		assertCurrent
	});
}
async function executeDetachedCronJob(state, job, abortSignal, options) {
	const interrupted = () => {
		const error = abortErrorMessage(abortSignal);
		return {
			status: "error",
			error,
			errorClassification: cronAbortErrorClassification(abortSignal),
			diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, { nowMs: state.deps.nowMs })
		};
	};
	if (job.payload.kind === "command") {
		if (!state.deps.runCommandJob) {
			const error = "cron command runner is not configured";
			return {
				status: "skipped",
				error,
				diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error, {
					severity: "warn",
					nowMs: state.deps.nowMs
				})
			};
		}
		const res = await state.deps.runCommandJob({
			deliveryAttemptFence: options?.deliveryAttemptFence ?? null,
			job,
			abortSignal
		});
		if (abortSignal?.aborted && !(abortSignal.reason instanceof Error && abortSignal.reason.name === "TimeoutError" && res.failureNotificationDetail?.kind === "command-timeout" && res.failureNotificationDetail.mode === "wall-clock")) return interrupted();
		return {
			status: res.status,
			error: res.error,
			errorClassification: res.errorClassification,
			deliveryError: res.deliveryError,
			deliverySuppressionReason: res.deliverySuppressionReason,
			deliveryState: res.deliveryState,
			summary: res.summary,
			delivered: res.delivered,
			deliveryAttempted: res.deliveryAttempted,
			delivery: res.delivery,
			diagnostics: res.diagnostics,
			failureNotificationDetail: res.failureNotificationDetail
		};
	}
	if (job.payload.kind !== "agentTurn") {
		const error = "isolated job requires payload.kind=\"agentTurn\" or \"command\"";
		return {
			status: "skipped",
			error,
			diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error, {
				severity: "warn",
				nowMs: state.deps.nowMs
			})
		};
	}
	if (abortSignal?.aborted) return interrupted();
	const res = await state.deps.runIsolatedAgentJob({
		deliveryAttemptFence: options?.deliveryAttemptFence ?? null,
		job,
		admissionSource: resolveCronRunAdmissionSource(job),
		message: job.payload.message,
		abortSignal,
		onExecutionStarted: options?.onExecutionStarted,
		onExecutionPhase: options?.onExecutionPhase,
		onLaneWait: options?.onLaneWait,
		executionIdentity: options?.executionIdentity
	});
	if (abortSignal?.aborted) return interrupted();
	return {
		status: res.status,
		error: res.error,
		errorClassification: res.errorClassification,
		executionStarted: res.executionStarted,
		deliveryError: res.deliveryError,
		deliverySuppressionReason: res.deliverySuppressionReason,
		deliveryState: res.deliveryState,
		nextCheck: res.nextCheck,
		summary: res.summary,
		delivered: res.delivered,
		deliveryAttempted: res.deliveryAttempted,
		delivery: res.delivery,
		sessionId: res.sessionId,
		sessionKey: res.sessionKey,
		diagnostics: res.diagnostics,
		failureNotificationDetail: res.failureNotificationDetail,
		model: res.model,
		provider: res.provider,
		usage: res.usage
	};
}
async function executeScriptCronJob(state, job, abortSignal, options) {
	if (state.deps.cronConfig?.triggers?.enabled === false) return {
		status: "error",
		error: "cron script payload execution is disabled because the operator set cron.triggers.enabled: false; remove it or set it to true to allow unattended scripts"
	};
	if (!state.deps.runScriptJob) return {
		status: "error",
		error: "cron script payload executor is unavailable",
		...cronScriptFailureMetadata("payload", "runtime_unavailable")
	};
	const result = await state.deps.runScriptJob({
		deliveryAttemptFence: options?.deliveryAttemptFence ?? null,
		job,
		streamBatch: options?.streamBatch,
		abortSignal,
		executionIdentity: options?.executionIdentity
	});
	if (!isCronActiveJobMarkerCurrent(options?.activeJobMarker)) return {
		status: "error",
		error: "Gateway restarting.",
		errorClassification: { kind: "aborted" }
	};
	if (abortSignal?.aborted) return {
		status: "error",
		error: abortErrorMessage(abortSignal),
		errorClassification: cronAbortErrorClassification(abortSignal)
	};
	if (options?.assertRunCurrent) {
		await options.assertRunCurrent();
		if (options.activeJobMarker?.cancellation?.kind === "requested") return {
			status: "error",
			error: options.activeJobMarker.cancellation.reason,
			errorClassification: { kind: "aborted" }
		};
		if (!isCronActiveJobMarkerCurrent(options.activeJobMarker)) return {
			status: "error",
			error: "Gateway restarting.",
			errorClassification: { kind: "aborted" }
		};
		if (abortSignal?.aborted) return {
			status: "error",
			error: abortErrorMessage(abortSignal),
			errorClassification: cronAbortErrorClassification(abortSignal)
		};
	}
	if (result.status !== "ok") return result;
	if (result.nextCheck && !job.pacing) return {
		status: "error",
		error: "cron script payload returned nextCheck, but this job has no pacing bounds",
		...cronScriptFailureMetadata("payload", "invalid_input")
	};
	const notify = result.notify?.trim() ? result.notify : void 0;
	if (job.sessionTarget === "main" && notify || result.wake) {
		const agentId = resolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId);
		const deliveryContext = job.sessionTarget === "main" ? await resolveMainSessionCronDeliveryContext(state, job) : void 0;
		const eventOptions = {
			agentId,
			...deliveryContext ? { deliveryContext } : {}
		};
		if (job.sessionTarget === "main" && notify) state.deps.enqueueSystemEvent(notify, {
			...eventOptions,
			contextKey: `cron:${job.id}:script`
		});
		if (result.wake) {
			if (job.sessionTarget !== "main" || !notify) state.deps.enqueueSystemEvent(notify ?? `script job ${job.name} completed`, {
				...eventOptions,
				contextKey: `cron:${job.id}:script-wake`
			});
			state.deps.requestHeartbeat({
				source: result.wake === "now" ? "notifications-event" : "cron",
				intent: result.wake === "now" ? "immediate" : "event",
				reason: result.wake === "now" ? "wake" : `cron:${job.id}:script`,
				agentId
			});
		}
	}
	return {
		status: "ok",
		...notify ? { summary: notify } : {},
		delivered: result.delivered,
		deliveryAttempted: result.deliveryAttempted,
		deliveryError: result.deliveryError,
		deliverySuppressionReason: result.deliverySuppressionReason,
		deliveryState: result.deliveryState,
		delivery: result.delivery,
		diagnostics: result.diagnostics,
		nextCheck: result.nextCheck,
		scriptStateChanged: result.stateChanged === true,
		...result.stateChanged === true ? { scriptState: result.state } : {}
	};
}
//#endregion
//#region src/cron/service/timer-job-runner.interruption.ts
function withPrimaryWebhookTrace(params) {
	const delivered = params.outcome.status === "unknown" ? void 0 : params.outcome.status === "delivered";
	const error = params.outcome.status === "delivered" ? void 0 : params.outcome.error && params.error && params.outcome.error !== params.error ? `${params.outcome.error}; ${params.error}` : params.error ?? params.outcome.error;
	const plan = resolveCronDeliveryPlan(params.job);
	const intended = params.result.delivery?.intended ?? {
		to: plan.to,
		source: "explicit"
	};
	return {
		...params.result,
		deliveryState: {
			status: params.outcome.status,
			delivered,
			error,
			deliverySuppressionReason: params.deliverySuppressionReason,
			failureNotification: { status: "not-requested" }
		},
		delivered,
		deliverySuppressionReason: params.deliverySuppressionReason,
		deliveryAttempted: params.deliverySuppressionReason === void 0,
		deliveryError: error || void 0,
		delivery: {
			...params.result.delivery,
			intended,
			delivered,
			resolved: delivered === void 0 ? void 0 : {
				to: plan.to,
				source: "explicit",
				ok: delivered,
				...error ? { error } : {}
			}
		}
	};
}
function withPrimaryWebhookInterruption(params) {
	if (resolveCronDeliveryPlan(params.job).mode !== "webhook" || params.result.triggerEval?.fired === false) return params.result;
	const result = withPrimaryWebhookTrace({
		...params,
		outcome: params.outcome ?? { status: "not-delivered" }
	});
	return params.outcome?.status !== "delivered" && params.errorClassification ? {
		...result,
		errorClassification: params.errorClassification
	} : result;
}
function resolveInterruptedRunProgress(params) {
	if (params.progress.settledDeliveryResult) return params.progress.settledDeliveryResult;
	if (params.progress.completedCoreResult) return withPrimaryWebhookInterruption({
		job: params.job,
		result: params.progress.completedCoreResult,
		outcome: params.progress.webhookDelivery,
		error: params.error,
		errorClassification: params.errorClassification
	});
}
//#endregion
//#region src/cron/service/timer-job-runner.ts
async function deliverPrimaryWebhook(state, job, result, abortSignal, progress, assertRunCurrent, activeJobMarker, deliveryAttemptFence) {
	const settle = (settledResult) => {
		progress.settledDeliveryResult ??= settledResult;
		return progress.settledDeliveryResult;
	};
	if (resolveCronDeliveryPlan(job).mode !== "webhook" || result.triggerEval?.fired === false) return result;
	const undelivered = (error, deliverySuppressionReason) => withPrimaryWebhookTrace({
		job,
		result,
		outcome: {
			status: "not-delivered",
			error
		},
		deliverySuppressionReason
	});
	if (result.status !== "error" && !(typeof result.summary === "string" && result.summary.trim())) return settle(undelivered(void 0, "empty"));
	if (!state.deps.sendCronWebhook) return undelivered("cron webhook delivery is unavailable");
	const interruptionError = () => {
		const reason = abortErrorMessage(abortSignal);
		return abortSignal.reason instanceof Error && abortSignal.reason.name === "TimeoutError" ? `cron webhook delivery timed out: ${reason}` : `cron webhook delivery cancelled: ${reason}`;
	};
	if (abortSignal.aborted) return withPrimaryWebhookInterruption({
		job,
		result,
		error: interruptionError(),
		errorClassification: cronAbortErrorClassification(abortSignal)
	});
	if (assertRunCurrent) {
		await assertRunCurrent();
		if (activeJobMarker?.cancellation?.kind === "requested") return withPrimaryWebhookInterruption({
			job,
			result,
			error: `cron webhook delivery cancelled: ${activeJobMarker.cancellation.reason}`,
			errorClassification: { kind: "aborted" }
		});
		if (!isCronActiveJobMarkerCurrent(activeJobMarker)) return withPrimaryWebhookInterruption({
			job,
			result,
			error: "Gateway restarting.",
			errorClassification: { kind: "aborted" }
		});
		if (abortSignal.aborted) return withPrimaryWebhookInterruption({
			job,
			result,
			error: interruptionError(),
			errorClassification: cronAbortErrorClassification(abortSignal)
		});
	}
	const startedAt = job.state.runningAtMs;
	const deliveredResult = withPrimaryWebhookTrace({
		job,
		result,
		outcome: { status: "delivered" }
	});
	let webhookAdapterEntered = false;
	try {
		await deliveryAttemptFence?.beforeAttempt();
		deliveryAttemptFence?.assertCurrent();
		webhookAdapterEntered = true;
		const outcome = await state.deps.sendCronWebhook({
			assertCurrent: deliveryAttemptFence?.assertCurrent,
			job,
			abortSignal,
			onDeliveryState: (delivery) => {
				progress.webhookDelivery = delivery;
			},
			event: {
				jobId: job.id,
				action: "finished",
				job,
				...typeof startedAt === "number" ? { runAtMs: startedAt } : {},
				...typeof startedAt === "number" ? { durationMs: Math.max(0, state.deps.nowMs() - startedAt) } : {},
				status: result.status,
				error: result.error,
				summary: result.summary,
				diagnostics: result.diagnostics,
				delivered: true,
				deliveryStatus: "delivered",
				delivery: deliveredResult.delivery,
				sessionId: result.sessionId,
				sessionKey: result.sessionKey,
				model: result.model,
				provider: result.provider,
				usage: result.usage
			}
		});
		if (outcome.error) state.deps.log.warn({
			jobId: job.id,
			err: outcome.error
		}, "cron: webhook delivery failed");
		if (progress.settledDeliveryResult) return progress.settledDeliveryResult;
		if (abortSignal.aborted) return withPrimaryWebhookInterruption({
			job,
			result,
			outcome,
			error: interruptionError(),
			errorClassification: cronAbortErrorClassification(abortSignal)
		});
		return settle(withPrimaryWebhookTrace({
			job,
			result,
			outcome
		}));
	} catch (error) {
		if (progress.settledDeliveryResult) return progress.settledDeliveryResult;
		const deliveryError = abortSignal.aborted ? interruptionError() : formatErrorMessage(error);
		state.deps.log.warn({
			jobId: job.id,
			err: deliveryError
		}, "cron: webhook delivery failed");
		if (abortSignal.aborted) return settle(withPrimaryWebhookInterruption({
			job,
			result,
			outcome: progress.webhookDelivery ?? { status: webhookAdapterEntered ? "unknown" : "not-delivered" },
			error: deliveryError,
			errorClassification: cronAbortErrorClassification(abortSignal)
		}));
		return settle(withPrimaryWebhookTrace({
			job,
			result,
			outcome: progress.webhookDelivery ?? { status: webhookAdapterEntered ? "unknown" : "not-delivered" },
			error: deliveryError
		}));
	}
}
/** Executes cron job core logic with the configured wall-clock timeout and watchdog cleanup. */
async function executeJobCoreWithTimeoutUnfinalized(state, job, opts) {
	const runAbortController = new AbortController();
	const progress = {};
	let commandSettlement;
	const assertRunCurrent = async () => {
		runAbortController.signal.throwIfAborted();
		opts?.runReceiptContext?.admission.assertCurrent();
		if (!isCronActiveJobMarkerCurrent(opts?.activeJobMarker)) throw new Error("Gateway restarting.");
	};
	const deliveryAttemptFence = opts?.runReceipt ? createCronCompletionDeliveryFence({
		state,
		job,
		handle: opts.runReceipt,
		activeJobMarker: opts.activeJobMarker,
		signal: runAbortController.signal
	}) : void 0;
	const operatorCancellationMarker = Symbol("cron-operator-cancelled");
	const operatorCancellation = createDeferredCore();
	const createInterruptionOutcome = async (interruption, execution, watchdog) => {
		const error = interruption === "cancelled" ? abortErrorMessage(runAbortController.signal) : interruption.reason;
		const deliveryError = `cron webhook delivery ${interruption === "cancelled" ? "cancelled" : "timed out"}: ${error}`;
		const errorClassification = interruption === "cancelled" ? { kind: "aborted" } : {
			kind: "reason",
			reason: "timeout"
		};
		const settled = resolveInterruptedRunProgress({
			progress,
			job,
			error: deliveryError,
			errorClassification
		});
		if (settled) return settled;
		if (interruption !== "cancelled") {
			await settleTimedOutCronRun(state, job, interruption.timeoutMs, execution, commandSettlement);
			if (commandSettlement) {
				const settledAfterCleanup = resolveInterruptedRunProgress({
					progress,
					job,
					error: deliveryError,
					errorClassification
				});
				if (settledAfterCleanup) return settledAfterCleanup;
			}
		}
		const isolatedAgentSetupTimeout = interruption !== "cancelled" && job.sessionTarget === "isolated" && isSetupTimeoutErrorText(error) && !watchdog?.observedLaneWait() ? {
			error,
			timeoutMs: CRON_AGENT_SETUP_WATCHDOG_MS,
			otherCronJobsActiveAtTimeout: false
		} : void 0;
		return withPrimaryWebhookInterruption({
			job,
			result: {
				status: "error",
				error,
				errorClassification,
				...execution && {
					provider: execution.provider,
					model: execution.model,
					sessionId: execution.sessionId,
					sessionKey: execution.sessionKey
				},
				...isolatedAgentSetupTimeout ? { isolatedAgentSetupTimeout } : {},
				diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, { nowMs: state.deps.nowMs })
			},
			error: deliveryError
		});
	};
	if (!isCronActiveJobMarkerCurrent(opts?.activeJobMarker)) {
		runAbortController.abort("Gateway restarting.");
		return await createInterruptionOutcome("cancelled");
	}
	const detachedPayload = runsDetachedFromMainSession(job);
	const releaseCronTaskRun = detachedPayload || job.trigger ? registerActiveCronTaskRun({
		runId: opts?.runId ?? `cron-active:${job.id}`,
		controller: runAbortController,
		activeJobMarker: opts?.activeJobMarker,
		onCancel: () => operatorCancellation.resolve(operatorCancellationMarker)
	}) : void 0;
	const jobTimeoutMs = resolveCronJobTimeoutMs(job);
	try {
		const timeout = createDeferredCore();
		const deferTimeoutUntilExecutionStart = job.sessionTarget !== "main" && job.payload.kind === "agentTurn";
		const watchdog = jobTimeoutMs === void 0 ? void 0 : createCronAgentWatchdog({
			deferUntilRunner: deferTimeoutUntilExecutionStart,
			jobTimeoutMs,
			triggerTimeout: (reason) => {
				if (!runAbortController.signal.aborted) {
					const timeoutError = new Error(reason);
					timeoutError.name = "TimeoutError";
					runAbortController.abort(timeoutError);
				}
				timeout.resolve({
					timeoutMs: jobTimeoutMs,
					reason
				});
			}
		});
		let untimedExecution;
		const accumulateExecution = (info) => {
			if (info) untimedExecution = {
				...untimedExecution,
				...info
			};
		};
		const noteLaneState = (info) => {
			if (info?.waiting === false) {
				watchdog?.noteLaneAdmitted();
				return;
			}
			watchdog?.noteLaneWait();
		};
		const noteRunnerStarted = (info) => {
			if (watchdog) watchdog.noteRunnerStarted(info);
			else accumulateExecution(info);
		};
		const trackExecution = !watchdog || deferTimeoutUntilExecutionStart;
		const resolveHeartbeatTimeoutMs = state.deps.resolveHeartbeatTimeoutMs;
		const executionIdentity = opts?.executionIdentity;
		const coreOptions = {
			deliveryAttemptFence,
			activeJobMarker: opts?.activeJobMarker,
			streamBatch: opts?.streamBatch,
			streamScheduleKey: opts?.streamScheduleKey,
			streamSourceIdentity: opts?.streamSourceIdentity,
			onPayloadExecutionStarted: detachedPayload ? void 0 : releaseCronTaskRun,
			onExecutionStarted: trackExecution ? noteRunnerStarted : void 0,
			onExecutionPhase: trackExecution ? watchdog?.notePhase ?? accumulateExecution : void 0,
			onLaneWait: watchdog && deferTimeoutUntilExecutionStart ? noteLaneState : void 0,
			onHeartbeatExecutionStarted: watchdog && resolveHeartbeatTimeoutMs ? (heartbeat) => {
				const heartbeatTimeoutMs = resolveHeartbeatTimeoutMs(heartbeat);
				return {
					onAttemptStarted: () => watchdog.replaceTimeout(heartbeatTimeoutMs),
					onQueued: () => watchdog.replaceTimeout(void 0)
				};
			} : void 0,
			assertRunCurrent,
			executionIdentity: executionIdentity && {
				...executionIdentity,
				onPostAdmission: (context) => {
					bindCronJobAdmittedRun(opts?.activeJobMarker, context, runAbortController.signal);
					return executionIdentity.onPostAdmission?.(context);
				}
			}
		};
		watchdog?.start();
		const corePromise = executeJobCore(state, job, runAbortController.signal, coreOptions);
		commandSettlement = job.payload.kind === "command" ? corePromise : void 0;
		const runPromise = trackAsyncWork(async () => {
			const result = await corePromise;
			progress.completedCoreResult = result;
			return await deliverPrimaryWebhook(state, job, result, runAbortController.signal, progress, assertRunCurrent, opts?.activeJobMarker, deliveryAttemptFence);
		});
		trackActiveCronTaskRunSettlement(runPromise, runAbortController.signal, opts?.runReceipt?.agentId ?? opts?.activeJobMarker?.agentId);
		runPromise.catch((err) => {
			if (runAbortController.signal.aborted) state.deps.log.warn({
				jobId: job.id,
				err: String(err)
			}, `cron: job core rejected after abort: ${abortErrorMessage(runAbortController.signal)}`);
		});
		try {
			const first = await Promise.race([
				runPromise,
				timeout.promise,
				operatorCancellation.promise
			]);
			if (first === operatorCancellationMarker) return await createInterruptionOutcome("cancelled", watchdog?.activeExecution() ?? untimedExecution);
			return "status" in first ? first : await createInterruptionOutcome(first, watchdog?.activeExecution(), watchdog);
		} finally {
			watchdog?.dispose();
		}
	} finally {
		releaseCronTaskRun?.();
	}
}
function authorCronRunCompletion(job, result) {
	const deliveryState = result.deliveryState ?? resolveDeliveryState({
		job,
		runStatus: result.status,
		delivery: result.delivery,
		delivered: result.delivered,
		deliveryAttempted: result.deliveryAttempted,
		error: result.deliveryError ?? result.error,
		deliverySuppressionReason: result.deliverySuppressionReason
	});
	return {
		...result,
		deliveryState,
		completionStatus: resolveAdmittedCronCompletionStatus(job, result.status, deliveryState.status, deliveryState.deliverySuppressionReason)
	};
}
/** Authors completion after execution and primary delivery have both settled. */
async function executeJobCoreWithTimeout(state, job, opts) {
	return authorCronRunCompletion(job, await executeJobCoreWithTimeoutUnfinalized(state, job, opts));
}
//#endregion
//#region src/cron/service/timer-outcome-finalization.ts
/** Sends terminal facts to the worker; the host only publishes committed results. */
async function finalizeCompletedCronRunOutcomes(state, outcomes, opts) {
	if (!outcomes.length) return [];
	const context = outcomes.find((outcome) => outcome.runReceiptContext)?.runReceiptContext ?? captureOpenClawStateWorkerContext();
	const storeKey = cronStoreKey(state.deps.storePath);
	const canPublish = (outcome) => !(state.stopped && opts?.discardWhenStopped) && isCronActiveJobMarkerCurrent(outcome.activeJobMarker);
	const finalized = [];
	let committedSuccessfully = false;
	try {
		runPostPersistCronNotifications(state, (await locked(state, async () => {
			if (!state.store) await ensureLoaded(state);
			const observedRevision = getCronJobsStoreRevision(storeKey);
			const { outcome: result } = await executeOpenClawStateWorker(context, {
				type: "cron.finalizeRuns",
				input: {
					storeKey,
					snapshot: {
						nowMs: state.deps.nowMs(),
						defaultAgentId: state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId,
						cronConfig: state.deps.cronConfig,
						failureRepairTimeoutMs: state.deps.failureRepairTimeoutMs,
						outcomes: outcomes.map(({ activeJobMarker, runReceiptContext: _context, request, ...completed }) => ({
							...completed,
							activeJobMarker: activeJobMarker && {
								jobRemoved: activeJobMarker.jobRemoved,
								scheduleMutated: activeJobMarker.scheduleMutated,
								triggerMutated: activeJobMarker.triggerMutated
							},
							request: request && {
								preserveCadence: request.preserveCadence,
								onExitWatcherCompletion: request.onExitWatcherCompletion,
								scheduleOwnershipAtMs: request.scheduleOwnershipAtMs,
								runId: request.runId
							}
						}))
					}
				}
			});
			committedSuccessfully = true;
			applyCronRuntimeRowsToState(state, result.upsertedJobs, result.removedJobs.map((job) => job.id), { publish: false });
			if (result.changed) noteLoadedCronStoreCommit(state, observedRevision);
			for (const entry of result.logs) state.deps.log[entry.level](entry.fields, entry.message);
			for (const plan of result.eventPlans) {
				const outcome = outcomes[plan.outcomeIndex];
				if (!canPublish(outcome)) continue;
				finalized.push(outcome);
				if (!(outcome.status === "ok" && outcome.triggerEval?.fired === false) || outcome.request?.runId) {
					emit(state, cronRunResultEvent(plan.job, outcome), cronFailureNotificationEventContext(outcome.failureNotificationDetail));
					if (outcome.request?.terminalTracker) outcome.request.terminalTracker.emitted = true;
				}
				if (outcome.request) {
					maybeNotifyManualIsolatedSetupTimeout(state, {
						jobId: outcome.jobId,
						job: outcome.request.executionJob,
						isolatedAgentSetupTimeout: outcome.isolatedAgentSetupTimeout
					});
					opts?.onRequestedRunFinalized?.();
				}
			}
			for (const job of result.removedJobs) if (finalized.some((outcome) => outcome.jobId === job.id)) emit(state, {
				jobId: job.id,
				action: "removed",
				job
			});
			publishDurableNextRunChanges({
				state,
				storeJobs: state.store?.jobs ?? []
			});
			return result;
		})).notifications).catch((error) => {
			state.deps.log.warn({ err: String(error) }, "cron: post-run notification failed");
		});
		if (finalized.length) try {
			const request = finalized.find((outcome) => outcome.request);
			const nowMs = state.deps.nowMs();
			if (request || state.store?.jobs.some((job) => needsCronTimerMaintenance(job, nowMs))) await locked(state, () => recomputeUnownedCronSchedules(state, {
				nowMs,
				repairFutureCronNextRunAtMs: opts?.repairFutureCronNextRunAtMs,
				...request ? {
					recomputeExpired: true,
					...request.request?.preserveCadence ? { preserveExpiredPacedNextRunJobId: request.jobId } : {}
				} : {}
			}));
		} catch (error) {
			state.deps.log.warn({ err: String(error) }, "cron: post-finalization schedule maintenance failed");
		}
		return finalized;
	} finally {
		if (!committedSuccessfully) noteCronJobsStoreCommit(storeKey);
		for (const outcome of outcomes) if (opts?.clearOnFailure !== false || committedSuccessfully) {
			if (outcome.request) clearManualCronJobActive(state, outcome.jobId, outcome.activeJobMarker);
			else clearCronJobActive(outcome.jobId, outcome.activeJobMarker);
		}
	}
}
//#endregion
//#region src/cron/service/run-queue.ts
const launchStates = /* @__PURE__ */ new WeakMap();
function launchState(state) {
	let current = launchStates.get(state);
	if (!current) {
		current = {
			contexts: /* @__PURE__ */ new Map(),
			running: /* @__PURE__ */ new Set()
		};
		launchStates.set(state, current);
	}
	return current;
}
function pumpCronRunQueues(state) {
	const queue = launchState(state);
	if (!queue.contexts.size && !queue.running.size) releaseCronRunQueue(state);
	wakeCronRunQueues(state);
}
function watchCronRunCancellation(state, pending) {
	const signal = pending.options.onExit?.signal;
	if (!signal) return;
	const cancel = () => {
		cancelCronRunRequests(state, [pending.receipt.receiptId], "cron on-exit request cancelled").catch((error) => {
			pending.completion.reject(error);
			state.deps.log.warn({ err: String(error) }, "cron: queued cancellation failed");
		});
	};
	pending.removeCancellation = () => signal.removeEventListener("abort", cancel);
	signal.addEventListener("abort", cancel, { once: true });
	if (signal.aborted) cancel();
}
/** Adopt committed worker requests without taking ownership of queue order or capacity. */
function adoptCronRunRequests(state, accepted, options, context = captureOpenClawStateWorkerContext(), generation = state.lifecycleGeneration) {
	const batch = { notified: false };
	return accepted.map((entry) => {
		const launch = {
			receipt: entry.runReceipt,
			context,
			options: Object.assign({}, options, { scheduleOwnershipAtMs: options.scheduleOwnershipAtMs ?? entry.runReceipt.startedAtMs }),
			generation,
			batch,
			completion: createDeferredCore(),
			activation: createDeferredCore()
		};
		launch.completion.promise.catch(() => {});
		launchState(state).contexts.set(entry.runReceipt.receiptId, launch);
		registerCronRunQueue(state, () => drainCronRunQueue(state));
		watchCronRunCancellation(state, launch);
		return Object.assign({}, entry, {
			completion: launch.completion.promise,
			activation: launch.activation.promise
		});
	});
}
async function commitCronRunRequests(state, jobs, options) {
	if (state.stopped || jobs.length === 0) return [];
	const source = captureCronServiceMutationSource(state);
	const nowMs = state.deps.nowMs();
	const generation = state.lifecycleGeneration;
	const candidates = await skipCronJobsWithoutOwners(state, [...jobs], nowMs, {
		source,
		...isImmediateCronRunMode(options.mode) ? { scheduleMode: "preserve" } : {},
		manualRun: options
	});
	source.assertCurrent();
	options.commitGuard?.();
	const requests = createCronRunRequests(candidates, options, nowMs);
	const markCommitted = captureCronMutationCommit("cron.run");
	const assertRequestCurrent = () => {
		options.commitGuard?.();
		source.assertCurrent();
	};
	const result = await runOpenClawStateWorkerOperation(source.context, (scope) => scope.execute({
		type: "cron.requestRuns",
		input: {
			storeKey: source.storeKey,
			nowMs,
			defaultAgentId: resolveCurrentDefaultAgentId(state),
			requests
		}
	}), {
		assertCurrent: assertRequestCurrent,
		createAdmission: options.event ? createSqliteWorkerWriteAdmission(assertRequestCurrent, [source.context.admission.databasePath]) : void 0
	});
	if (result.rejected.some(({ reason }) => reason === "event-invalidated")) throw new CronEventClaimInvalidatedError();
	const accepted = adoptCronRunRequests(state, result.accepted, options, source.context, generation);
	if (accepted.length > 0) {
		markCommitted?.();
		noteCronJobsStoreCommit(source.storeKey);
		applyCronRuntimeRowsToState(state, accepted.map(({ job }) => job));
		options.onExit?.onReserved();
	}
	return accepted;
}
async function publishSkipped(state, skipped) {
	const pending = launchState(state).contexts.get(skipped.runReceipt.receiptId);
	applyCronRuntimeRowsToState(state, skipped.job ? [skipped.job] : []);
	if (!pending) return;
	pending.removeCancellation?.();
	pending.activation.resolve();
	launchState(state).contexts.delete(skipped.runReceipt.receiptId);
	emit(state, {
		jobId: skipped.runReceipt.jobId,
		job: skipped.job,
		action: "finished",
		status: "skipped",
		error: skipped.error,
		runId: pending.options.runId,
		runAtMs: skipped.runReceipt.startedAtMs,
		durationMs: 0,
		nextRunAtMs: skipped.job?.state.nextRunAtMs
	});
	if (pending.options.terminalTracker) pending.options.terminalTracker.emitted = true;
	if (skipped.eventInvalidated) pending.completion.reject(new CronEventClaimInvalidatedError());
	else pending.completion.resolve({
		ok: true,
		ran: false,
		reason: state.stopped || pending.generation !== state.lifecycleGeneration || pending.options.onExit?.signal.aborted ? "stopped" : "not-due"
	});
	if (!launchState(state).contexts.size && !launchState(state).running.size) releaseCronRunQueue(state);
}
async function cancelCronRunRequests(state, receiptIds, reason) {
	if (receiptIds.length === 0) return;
	const context = launchState(state).contexts.get(receiptIds[0])?.context ?? captureOpenClawStateWorkerContext();
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "cron.cancelRequests",
		input: {
			storeKey: cronStoreKey(state.deps.storePath),
			receiptIds,
			nowMs: state.deps.nowMs(),
			reason
		}
	}));
	noteCronJobsStoreCommit(cronStoreKey(state.deps.storePath));
	for (const skipped of result.skipped) await publishSkipped(state, skipped);
}
function getCronRunQueueRequests(state, selection = {}) {
	return projectCronRunQueueRequests(launchState(state).contexts.values(), selection);
}
/** Consume committed activations. No host semaphore or reservation influences selection. */
async function drainCronRunQueue(state) {
	if (state.stopped || ![...launchState(state).contexts.values()].some((pending) => !pending.started) && !state.store?.jobs.some((job) => job.state.queuedAtMs !== void 0)) return;
	if (launchState(state).drain) {
		await launchState(state).drain;
		return;
	}
	let retryAfterGuardRefusal = false;
	launchState(state).drain = locked(state, async () => {
		const context = captureOpenClawStateWorkerContext();
		const pendingEvents = [...launchState(state).contexts.values()].filter((pending) => pending.options.event && !pending.started && !pending.eventTransferred);
		const guardFailure = {};
		const assertEventSourcesCurrent = () => {
			for (const pending of pendingEvents) try {
				pending.options.commitGuard?.();
			} catch (error) {
				guardFailure.value = {
					pending,
					error
				};
				throw error;
			}
		};
		const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "cron.drainQueue",
			input: {
				storeKey: cronStoreKey(state.deps.storePath),
				nowMs: state.deps.nowMs(),
				defaultAgentId: resolveCurrentDefaultAgentId(state),
				maxConcurrentRuns: 8,
				schedulingPaused: state.schedulingPaused,
				requests: getCronRunQueueRequests(state, { includePendingEvents: true })
			}
		}), {
			assertCurrent: assertEventSourcesCurrent,
			createAdmission: pendingEvents.length > 0 ? createSqliteWorkerWriteAdmission(assertEventSourcesCurrent, [context.admission.databasePath]) : void 0
		}).catch(async (error) => {
			const refused = guardFailure.value;
			if (refused && refused.error === error && !hasSqliteWorkerOutcomeUnknown(error)) {
				refused.pending.completion.reject(error);
				refused.pending.activation.resolve();
				try {
					await cancelCronRunRequests(state, [refused.pending.receipt.receiptId], normalizeCronRunErrorText(error));
				} catch (cleanupError) {
					state.deps.log.warn({ err: String(cleanupError) }, "cron: refused event cleanup left for recovery");
				} finally {
					refused.pending.removeCancellation?.();
					launchState(state).contexts.delete(refused.pending.receipt.receiptId);
				}
				retryAfterGuardRefusal = true;
				return;
			}
			for (const pending of pendingEvents) {
				pending.completion.reject(error);
				pending.activation.resolve();
			}
			if (!hasSqliteWorkerOutcomeUnknown(error)) await cancelCronRunRequests(state, pendingEvents.map(({ receipt }) => receipt.receiptId), normalizeCronRunErrorText(error));
			else {
				for (const pending of pendingEvents) launchState(state).contexts.delete(pending.receipt.receiptId);
				if (!launchState(state).contexts.size && !launchState(state).running.size) releaseCronRunQueue(state);
			}
			throw error;
		});
		if (!result) return;
		await launchCronRunQueueResult(state, result, context);
	}).finally(() => {
		launchState(state).drain = void 0;
		if (retryAfterGuardRefusal) pumpCronRunQueues(state);
	});
	await launchState(state).drain;
}
/** Publish and execute activations already committed by the queue owner. */
async function launchCronRunQueueResult(state, result, context = captureOpenClawStateWorkerContext()) {
	if (result.launches.length || result.skipped.length) noteCronJobsStoreCommit(cronStoreKey(state.deps.storePath));
	for (const skipped of result.skipped) await publishSkipped(state, skipped);
	for (const entry of result.launches) {
		applyCronRuntimeRowsToState(state, [entry.job]);
		let pending = launchState(state).contexts.get(entry.runReceipt.receiptId);
		if (!pending) {
			pending = {
				receipt: entry.runReceipt,
				context,
				options: {},
				generation: state.lifecycleGeneration,
				batch: { notified: false },
				completion: createDeferredCore(),
				activation: createDeferredCore()
			};
			pending.completion.promise.catch(() => {});
			launchState(state).contexts.set(entry.runReceipt.receiptId, pending);
			registerCronRunQueue(state, () => drainCronRunQueue(state));
		}
		pending.receipt = entry.runReceipt;
		if (pending.options.event) {
			pending.eventTransferred = true;
			pending.options.onEventTransferred?.(entry.runReceipt);
			pending.activation.resolve();
		}
		const launch = pending;
		const running = runWithGatewayDetachedWorkContinuation(() => Promise.resolve().then(() => runOutsideOperatorToolGatewayAuthority(() => {
			const run = () => launchCronRun(state, entry, launch);
			return state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(run) : run();
		})), "cron:run").catch(async (error) => {
			state.deps.log.error({
				jobId: entry.job.id,
				err: String(error)
			}, "cron: queued launch failed");
			launch.completion.reject(error);
			try {
				if (!launch.started) await cancelCronRunRequests(state, [entry.runReceipt.receiptId], normalizeCronRunErrorText(error));
			} catch (cleanupError) {
				state.deps.log.warn({ err: String(cleanupError) }, "cron: failed launch left for recovery");
			} finally {
				launch.activation.resolve();
				launch.completion.reject(error);
				launch.removeCancellation?.();
				launchState(state).contexts.delete(entry.runReceipt.receiptId);
			}
		}).finally(() => {
			launchState(state).running.delete(running);
			pumpCronRunQueues(state);
		});
		launchState(state).running.add(running);
	}
}
async function launchCronRun(state, entry, pending) {
	const { options } = pending;
	await ensureLoaded(state, { forceReload: true });
	pending.context.admission.assertCurrent();
	if (!pending.eventTransferred) options.commitGuard?.();
	const current = state.store?.jobs.find((job) => job.id === entry.job.id);
	const force = options.mode === "force" || options.onExit !== void 0;
	const unavailable = state.deps.isAgentAvailable?.(entry.runReceipt.agentId, { deletionBlocked: false }) === false;
	if (state.stopped || pending.generation !== state.lifecycleGeneration || !current || unavailable || current.state.runningReceiptId !== entry.runReceipt.receiptId || options.event && cronSourceIdentity(current) !== options.event.input.sourceIdentity || !force && (!isJobEnabled(current) || current.state.autoDisabled) || options.streamScheduleKey !== void 0 && !ownsCronSource(current, options.streamScheduleKey, options.streamSourceIdentity ?? "")) {
		await cancelCronRunRequests(state, [entry.runReceipt.receiptId], unavailable ? describeUnavailableCronAgent(entry.runReceipt.agentId) : "cron: job became ineligible before launch");
		return;
	}
	const manual = options.source === "manual" || options.source === "event";
	const activeJobMarker = manual ? markManualCronJobActive(state, entry.job, entry.runReceipt) : markServiceCronJobActive(state, entry.job, entry.runReceipt);
	const admittedJob = structuredClone(entry.job);
	if (options.onExit) admittedJob.enabled = false;
	const executionJob = structuredClone(admittedJob);
	executionJob.payload = options.event ? cronEventPayload(entry.job, options.event.input) : options.onExit?.payload?.(structuredClone(entry.job)) ?? options.payload ?? executionJob.payload;
	if (isImmediateCronRunMode(options.mode)) {
		executionJob.state.nextRunAtMs = options.scheduleOwnershipAtMs;
		executionJob.trigger = options.evaluateTrigger ? executionJob.trigger : void 0;
	}
	const taskRunId = createCronRunHandle({
		state,
		job: entry.job,
		startedAt: entry.runReceipt.startedAtMs,
		runReceipt: entry.runReceipt,
		publicRunId: options.runId
	}).runId;
	emit(state, {
		jobId: entry.job.id,
		job: entry.job,
		action: "started",
		runAtMs: entry.runReceipt.startedAtMs
	});
	if (state.stopped || pending.generation !== state.lifecycleGeneration) {
		await cancelCronRunRequests(state, [entry.runReceipt.receiptId], "cron service stopped before execution");
		if (manual) clearManualCronJobActive(state, entry.job.id, activeJobMarker);
		else clearCronJobActive(entry.job.id, activeJobMarker);
		return;
	}
	pending.removeCancellation?.();
	pending.started = true;
	pending.activation.resolve();
	let executionBinding;
	let result;
	try {
		result = await executeJobCoreWithTimeout(state, executionJob, {
			runId: taskRunId,
			activeJobMarker,
			streamBatch: options.streamBatch,
			streamScheduleKey: options.streamScheduleKey,
			streamSourceIdentity: options.streamSourceIdentity,
			runReceipt: entry.runReceipt,
			runReceiptContext: pending.context,
			executionIdentity: {
				ingress: {
					kind: "schedule",
					boundary: "cron.isolated-agent",
					state: "present"
				},
				async onPostAdmission(admitted) {
					const token = admitted.executionIdentityToken;
					if (!token) return;
					executionBinding ??= Promise.resolve().then(async () => {
						const binding = parseExecutionIdentityAdmissionToken(token);
						if (binding.runId !== admitted.operationalRunInstance.runId) throw new Error("Cron execution identity does not match its admitted run");
						if (!await runOpenClawStateWorkerOperation(pending.context, (scope) => scope.execute({
							type: "cron.bindReceiptExecution",
							input: {
								receiptId: entry.runReceipt.receiptId,
								binding: {
									contextId: binding.contextId,
									executionId: binding.executionId
								}
							}
						}))) throw new Error("Cron execution identity binding was not retained");
					}).catch((error) => {
						state.deps.log.warn({
							err: String(error),
							jobId: entry.job.id
						}, "cron: failed to retain execution identity binding");
					});
					await executionBinding;
				}
			}
		});
	} catch (error) {
		result = authorCronRunCompletion(executionJob, {
			status: "error",
			error: normalizeCronRunErrorText(error)
		});
	}
	options.onTriggerDisposition?.(result.triggerEval?.busy ? "busy" : result.status === "error" ? "error" : result.status !== "ok" ? "dropped" : !executionJob.trigger || result.triggerEval?.fired ? "fired" : "dropped");
	const finalized = await finalizeCompletedCronRunOutcomes(state, [{
		...result,
		jobId: entry.job.id,
		job: admittedJob,
		taskRunId,
		activeJobMarker,
		runReceipt: entry.runReceipt,
		runReceiptContext: pending.context,
		startedAt: entry.runReceipt.startedAtMs,
		endedAt: state.deps.nowMs(),
		...manual ? { request: {
			executionJob,
			preserveCadence: isImmediateCronRunMode(options.mode),
			onExitWatcherCompletion: options.onExit !== void 0,
			scheduleOwnershipAtMs: options.scheduleOwnershipAtMs ?? entry.runReceipt.startedAtMs,
			runId: options.runId,
			terminalTracker: options.runId ? options.terminalTracker : void 0
		} } : {}
	}], { discardWhenStopped: true });
	if (!manual && finalized.length && !pending.batch.notified) pending.batch.notified = maybeNotifyIsolatedAgentSetupTimeout(state, {
		...result,
		jobId: entry.job.id,
		job: executionJob
	});
	pending.removeCancellation?.();
	pending.completion.resolve({
		ok: true,
		ran: true
	});
	launchState(state).contexts.delete(entry.runReceipt.receiptId);
}
async function stopCronRunQueue(state) {
	await launchState(state).drain;
	await cancelCronRunRequests(state, [...launchState(state).contexts.values()].filter(({ receipt }) => state.store?.jobs.find((job) => job.id === receipt.jobId)?.state.runningReceiptId !== receipt.receiptId).map(({ receipt }) => receipt.receiptId), "cron service stopped");
}
async function waitForCronRunQueue(state) {
	await launchState(state).drain;
	await Promise.allSettled(launchState(state).running);
}
/** Waits for one job's owned work across facades of the same store. */
async function waitForCronJobRun(state, jobId) {
	const runs = [];
	for (const owner of listCronRunQueueOwners(state)) for (const pending of launchState(owner).contexts.values()) if (pending.receipt.jobId === jobId) runs.push(pending.completion.promise);
	await Promise.allSettled(runs);
	return runs.length > 0;
}
//#endregion
//#region src/cron/service/scheduler-config.ts
let snapshotVersion = 0;
/** Resolve host-only configuration before submitting any worker command. */
async function captureCronSchedulerSnapshot(state, configuredChannels, preparedOwner) {
	const channels = configuredChannels ?? await state.deps.listConfiguredChannels?.();
	const needsDefault = !state.store || state.store.jobs.some((job) => !tryResolveCronJobEffectiveAgentId(job));
	return {
		version: ++snapshotVersion,
		config: structuredClone({
			cronEnabled: state.deps.cronEnabled,
			cronConfig: state.deps.cronConfig,
			defaultAgentId: preparedOwner ? preparedOwner.defaultAgentId : needsDefault && state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId,
			configuredChannels: channels ? [...channels] : void 0,
			maxMissedJobsPerRestart: state.deps.maxMissedJobsPerRestart,
			missedJobStaggerMs: state.deps.missedJobStaggerMs,
			startupDeferredMissedAgentJobDelayMs: state.deps.startupDeferredMissedAgentJobDelayMs
		})
	};
}
//#endregion
//#region src/cron/session-reaper.ts
/** Prunes expired per-run cron sessions and archives unreferenced transcripts. */
const DEFAULT_RETENTION_MS = 864e5;
/** Minimum interval between reaper sweeps (avoid running every timer tick). */
const MIN_SWEEP_INTERVAL_MS = 3e5;
const reaper = resolveGlobalSingleton(Symbol.for("openclaw.cronSessionReaper"), () => ({ targets: /* @__PURE__ */ new Map() }), (state) => {
	state.unsubscribe?.();
	state.unsubscribe = void 0;
	state.targets.clear();
});
function ensureReaperSubscription() {
	reaper.unsubscribe ??= sessionChanges.subscribeFacts((change) => {
		if (!sessionChangeScopeAffectsStoredRows(change)) return;
		if (!("all" in change) && !isCronRunSessionKey(change.sessionKey)) return;
		const agentId = "all" in change ? void 0 : parseAgentSessionKey(change.sessionKey)?.agentId;
		for (const target of reaper.targets.values()) if (!agentId || target.agentId === normalizeAgentId(agentId)) target.nextSweepAtMs = 0;
	});
}
function reaperTargetKey(agentId, storePath) {
	return `${normalizeAgentId(agentId)}\0${path.resolve(storePath)}`;
}
/** Resolves cron run-session retention; `false` disables pruning, bad strings fall back safely. */
function resolveRetentionMs(cronConfig) {
	if (cronConfig?.sessionRetention === false) return null;
	const raw = cronConfig?.sessionRetention;
	if (typeof raw === "string" && raw.trim()) try {
		const ms = parseDurationMs(raw.trim(), { defaultUnit: "h" });
		if (ms <= 0) return null;
		return ms;
	} catch {
		return DEFAULT_RETENTION_MS;
	}
	return DEFAULT_RETENTION_MS;
}
/** Removes the reusable base session whose owning isolated cron job was deleted. */
async function removeCronJobBaseSession(params) {
	const sessionKey = resolveCronAgentSessionKey({
		agentId: params.agentId,
		sessionKey: `cron:${params.jobId}`
	});
	const context = captureOpenClawStateWorkerContext();
	const read = await readSessionEntriesFromStoreInWorker({
		agentId: params.agentId,
		storePath: params.sessionStorePath,
		sessionKeys: [sessionKey],
		env: context.environment
	});
	assertSubagentReadContext(context);
	const existing = read.entries.find((row) => row.sessionKey === sessionKey)?.entry;
	if (!existing) return false;
	const sessionId = existing.sessionId.trim();
	if (sessionId) return await deleteCronSessionViaGateway({
		agentSessionKey: sessionKey,
		sessionId,
		lifecycleRevision: existing.lifecycleRevision,
		sessionUpdatedAt: existing.updatedAt
	});
	return (await applySessionEntryLifecycleMutation({
		agentId: params.agentId,
		env: context.environment,
		commitGuard: () => assertSubagentReadContext(context),
		storePath: params.sessionStorePath,
		removals: [{
			sessionKey,
			archiveRemovedTranscript: true,
			expectedEntry: existing
		}]
	})).removedEntries > 0;
}
/**
* Sweeps completed isolated cron run sessions while preserving base cron sessions.
*
* Run outside the cron service `locked()` section: cleanup acquires session
* lifecycle and writer ownership, so nesting the queues can deadlock timer ticks.
*/
async function sweepCronRunSessions(params) {
	const retentionMs = resolveRetentionMs(params.cronConfig);
	if (retentionMs === null) return {
		swept: false,
		pruned: 0
	};
	const now = params.nowMs ?? Date.now();
	const storePath = params.sessionStorePath;
	const targetKey = reaperTargetKey(params.agentId, storePath);
	const previous = reaper.targets.get(targetKey);
	if (previous?.retentionMs === retentionMs && now >= previous.lastSweepAtMs && (now - previous.lastSweepAtMs < MIN_SWEEP_INTERVAL_MS || now < previous.nextSweepAtMs)) return {
		swept: false,
		pruned: 0
	};
	ensureReaperSubscription();
	const target = {
		agentId: normalizeAgentId(params.agentId),
		retentionMs,
		lastSweepAtMs: now,
		nextSweepAtMs: Infinity
	};
	reaper.targets.set(targetKey, target);
	let pruned = 0;
	let transcriptCleanupError;
	try {
		const context = captureOpenClawStateWorkerContext();
		const assertCurrent = () => assertSubagentReadContext(context);
		if (await readAgentDeletionJournalStatusInWorker(params.agentId, { env: context.environment }) !== "absent" || params.isAgentAvailable?.(params.agentId, { deletionBlocked: false }) === false) {
			params.log.debug({ agentId: params.agentId }, "cron-reaper: skipped unavailable agent");
			target.nextSweepAtMs = 0;
			return {
				swept: false,
				pruned: 0
			};
		}
		const cutoff = now - retentionMs;
		let pendingMediaSessionKeys;
		const removals = [];
		const { entries: expiredEntries, nextCronRunUpdatedAt } = await readExpiredCronRunEntriesInWorker({
			agentId: params.agentId,
			storePath,
			env: context.environment,
			updatedBefore: cutoff
		});
		target.nextSweepAtMs = Math.min(target.nextSweepAtMs, nextCronRunUpdatedAt === null ? Infinity : nextCronRunUpdatedAt === void 0 ? 0 : nextCronRunUpdatedAt + retentionMs + 1);
		const continuationKeys = expiredEntries.flatMap(({ sessionKey, entry }) => entry.cronRunContinuation ? [sessionKey] : []);
		const descendants = continuationKeys.length > 0 ? await prepareCronDescendantDeletion(continuationKeys) : void 0;
		for (const { sessionKey, entry } of expiredEntries) {
			if (entry.cronRunContinuation) {
				pendingMediaSessionKeys ??= buildPendingGeneratedMediaSessionKeySet();
				if (pendingMediaSessionKeys.has(sessionKey) || descendants?.hasUnsettled(sessionKey)) continue;
			}
			if (entry.sessionId && isCompetingSessionWorkAdmissionActive(storePath, [sessionKey, entry.sessionId])) continue;
			removals.push({
				sessionKey,
				expectedEntry: entry,
				...entry.sessionId ? { expectedSessionId: entry.sessionId } : {},
				expectedUpdatedAt: entry.updatedAt,
				archiveRemovedTranscript: true
			});
		}
		if (removals.length > 0) {
			const archiveRetentionMs = resolveMaintenanceConfig().resetArchiveRetentionMs;
			const result = await applySessionEntryLifecycleMutation({
				agentId: params.agentId,
				env: context.environment,
				storePath,
				removals,
				commitGuard: () => {
					assertCurrent();
					for (const removal of removals) if (removal.expectedEntry?.cronRunContinuation && (descendants?.hasUnsettled(removal.sessionKey) || hasPendingGeneratedMediaTaskForSessionKey(removal.sessionKey))) throw new Error(`Cannot prune cron run continuation while subagents await settlement for ${removal.sessionKey}`);
				},
				...archiveRetentionMs == null ? {} : { cleanupArchivedTranscripts: {
					rules: [{
						reason: "deleted",
						olderThanMs: archiveRetentionMs
					}],
					nowMs: now
				} },
				captureArtifactCleanupError: true
			});
			pruned = result.removedEntries;
			transcriptCleanupError = result.artifactCleanupError;
		}
	} catch (err) {
		target.nextSweepAtMs = 0;
		params.log.warn({ err: String(err) }, "cron-reaper: failed to sweep session store");
		return {
			swept: false,
			pruned: 0
		};
	}
	if (transcriptCleanupError) params.log.warn({ err: formatErrorMessage(transcriptCleanupError) }, "cron-reaper: transcript cleanup failed");
	if (pruned > 0) params.log.info({
		pruned,
		retentionMs
	}, `cron-reaper: pruned ${pruned} expired cron run session(s)`);
	return {
		swept: true,
		pruned
	};
}
/** Resets per-target reaper throttles between tests. */
function resetReaperThrottle() {
	reaper.unsubscribe?.();
	reaper.unsubscribe = void 0;
	reaper.targets.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cronSessionReaperTestApi")] = { resetReaperThrottle };
//#endregion
//#region src/cron/service/scheduler-maintenance.ts
/** Reap expired sessions independently of worker-owned run recovery. */
async function runCronSchedulerMaintenance(state) {
	const generation = state.lifecycleGeneration;
	try {
		if (state.lifecycleGeneration === generation && (state.deps.resolveSessionStorePath || state.deps.sessionStorePath)) {
			if (!state.store) try {
				await ensureLoaded(state);
			} catch (err) {
				state.deps.log.warn({ err: String(err) }, "cron: session reaper inventory unavailable");
			}
			const configuredDefaultAgentId = (state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId)?.trim();
			const defaultAgentId = configuredDefaultAgentId ? normalizeAgentId(configuredDefaultAgentId) : void 0;
			const reaperAgentIds = new Set((await state.deps.resolveSessionStoreAgentIds?.() ?? []).map(normalizeAgentId));
			const resolveJobAgentId = (job) => {
				if (typeof job.agentId === "string" && job.agentId.trim()) return normalizeAgentId(job.agentId);
				try {
					return resolveAgentIdFromSessionKey(job.sessionKey, defaultAgentId);
				} catch {
					return;
				}
			};
			for (const job of state.store?.jobs ?? []) {
				const agentId = resolveJobAgentId(job);
				if (agentId) reaperAgentIds.add(agentId);
			}
			if (defaultAgentId) reaperAgentIds.add(defaultAgentId);
			const nowMs = state.deps.nowMs();
			for (const agentId of reaperAgentIds) {
				const storePath = state.deps.resolveSessionStorePath ? state.deps.resolveSessionStorePath(agentId) : state.deps.sessionStorePath;
				if (!storePath) continue;
				try {
					await sweepCronRunSessions({
						agentId,
						cronConfig: state.deps.cronConfig,
						sessionStorePath: storePath,
						isAgentAvailable: state.deps.isAgentAvailable,
						nowMs,
						log: state.deps.log
					});
				} catch (err) {
					state.deps.log.warn({
						err: String(err),
						storePath
					}, "cron: session reaper sweep failed");
				}
			}
		}
	} catch (err) {
		state.deps.log.warn({ err: String(err) }, "cron: session reaper preparation failed");
	}
}
//#endregion
//#region src/cron/service/scheduler-actor.ts
const connections = /* @__PURE__ */ new WeakMap();
async function publish(state, result) {
	if (result.jobs.length > 0) {
		noteCronJobsStoreCommit(cronStoreKey(state.deps.storePath));
		applyCronRuntimeRowsToState(state, result.jobs);
	}
	for (const log of result.logs) state.deps.log[log.level](log.fields, log.message);
	for (const job of result.ownerless) emit(state, {
		jobId: job.id,
		action: "finished",
		job,
		status: "skipped",
		completionStatus: "failed",
		error: CRON_AGENT_SELECTION_REQUIRED_MESSAGE,
		runAtMs: job.state.lastRunAtMs,
		durationMs: 0,
		nextRunAtMs: job.state.nextRunAtMs
	});
	await runPostPersistCronNotifications(state, result.notifications);
}
async function startCronScheduler(state, skipJobIds) {
	if (connections.has(state)) return;
	const channelName = `openclaw.cron.${randomUUID()}`;
	const generation = state.lifecycleGeneration;
	const storeKey = cronStoreKey(state.deps.storePath);
	const channel = new BroadcastChannel(channelName);
	channel.unref();
	const context = captureOpenClawStateWorkerContext();
	const lease = createOpenClawStateWorkerLease(context, async (scope) => {
		await scope.execute({
			type: "cron.schedulerStop",
			input: {
				storeKey,
				channelName
			}
		});
	});
	const connection = {
		lease,
		channel,
		channelName,
		unsubscribe: () => {},
		unregister: () => {},
		releaseRefresh: () => {},
		pending: Promise.resolve()
	};
	connections.set(state, connection);
	connection.releaseRefresh = registerCronSchedulerRefresh(state, () => refreshCronScheduler(state));
	connection.unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
		if (identity && identity.key !== context.admission.identity.key) return;
		state.stopped = true;
		await state.schedulerScope.stop();
		await closeConnection(state, connection, true);
	} });
	channel.addEventListener("message", () => {
		if (connections.get(state) !== connection || state.stopped || state.schedulingPaused) return;
		runInDetachedAsyncContext(async () => {
			const run = () => tickCronScheduler(state);
			await (state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(run) : run());
		}).catch((error) => {
			state.deps.log.warn({ err: String(error) }, "cron: scheduling delayed; worker will retry");
		});
	});
	connection.unsubscribe = sessionChanges.subscribe((change) => {
		if (!("all" in change) || typeof change.scope !== "string" || !change.scope.startsWith("config")) return;
		refreshCronScheduler(state);
	});
	let started = false;
	try {
		await lease.ready;
		const result = await lease.execute({
			type: "cron.schedulerStart",
			input: {
				storeKey,
				channelName,
				snapshot: await captureCronSchedulerSnapshot(state),
				nowMs: state.deps.nowMs(),
				monotonicMs: performance.now(),
				skipJobIds: [...skipJobIds],
				deferAgentWork: true,
				liveSinceMs: state.liveSinceMs,
				paused: state.schedulingPaused,
				requests: getCronRunQueueRequests(state)
			}
		});
		const requests = adoptCronRunRequests(state, result.accepted, { source: "startup" }, context, generation);
		started = true;
		state.schedulerStarted = true;
		await publish(state, result);
		await locked(state, () => launchCronRunQueueResult(state, result, context));
		const failed = (await Promise.allSettled(requests.map((request) => request.completion))).find((completion) => completion.status === "rejected");
		if (failed?.status === "rejected") throw failed.reason;
	} catch (error) {
		if (!started) await stopCronScheduler(state);
		throw error;
	}
}
/** The worker decides which slots are due; the host only launches committed requests. */
function tickCronScheduler(state) {
	const connection = connections.get(state);
	if (!connection || state.stopped || state.schedulingPaused) return Promise.resolve();
	const tick = connection.pending.catch(() => {}).then(() => runCronSchedulerTick(state, connection));
	connection.pending = tick;
	return tick;
}
async function runCronSchedulerTick(state, connection) {
	if (connections.get(state) !== connection || state.stopped || state.schedulingPaused) return;
	const generation = state.lifecycleGeneration;
	let admission;
	try {
		admission = await beginGatewayRootWorkAdmissionWhenOpen("cron:worker-tick", state.schedulerScope.signal);
	} catch (error) {
		if (error instanceof GatewayDrainingError || state.schedulerScope.signal.aborted && isAbortError(error)) return;
		throw error;
	}
	try {
		await admission.run(async () => {
			if (connections.get(state) !== connection || state.stopped || state.schedulingPaused) return;
			await runCronSchedulerMaintenance(state);
			const result = await connection.lease.execute({
				type: "cron.schedulerTick",
				input: {
					storeKey: cronStoreKey(state.deps.storePath),
					channelName: connection.channelName,
					paused: false,
					requests: getCronRunQueueRequests(state),
					snapshot: await captureCronSchedulerSnapshot(state),
					nowMs: state.deps.nowMs(),
					monotonicMs: performance.now()
				}
			});
			adoptCronRunRequests(state, result.accepted, { source: "scheduled" }, void 0, generation);
			await publish(state, result);
			await locked(state, () => launchCronRunQueueResult(state, result));
		});
	} finally {
		admission.release();
	}
}
/** Queue a config/row notification after the current host mutation releases its lock. */
function refreshCronScheduler(state) {
	const connection = connections.get(state);
	if (!connection || state.stopped) return;
	state.op.then(async () => {
		if (connections.get(state) !== connection || state.stopped) return;
		const snapshot = await captureCronSchedulerSnapshot(state);
		await publish(state, await connection.lease.execute({
			type: "cron.schedulerRefresh",
			input: {
				storeKey: cronStoreKey(state.deps.storePath),
				snapshot,
				channelName: connection.channelName,
				paused: state.schedulingPaused,
				nowMs: state.deps.nowMs()
			}
		}));
	}).catch((error) => {
		state.deps.log.warn({ err: String(error) }, "cron: worker refresh delayed");
	});
}
async function stopCronScheduler(state) {
	const connection = connections.get(state);
	if (!connection) return;
	await closeConnection(state, connection, false);
}
async function closeConnection(state, connection, retired) {
	connections.delete(state);
	connection.unsubscribe();
	connection.channel.close();
	connection.releaseRefresh();
	await connection.pending.catch(() => {});
	await (retired ? connection.lease.retire() : connection.lease.release());
	connection.unregister();
}
//#endregion
//#region src/cron/service/timer-outcome-events.ts
async function emitCronRunFinished(state, evt, tracker, taskRunId, details) {
	const event = {
		...evt,
		completionStatus: evt.completionStatus ?? resolveCronCompletionStatus({
			status: evt.status,
			deliveryStatus: evt.deliveryStatus
		})
	};
	await finishCronRun(state, {
		taskRunId,
		job: evt.job,
		event,
		historySource: details?.historySource,
		errorClassification: details?.errorClassification,
		...details?.scriptResult ? { scriptResult: details.scriptResult } : {},
		...details?.triggerEval ? { triggerEval: details.triggerEval } : {}
	});
	emit(state, event, cronFailureNotificationEventContext(details?.failureNotificationDetail));
	if (tracker) tracker.emitted = true;
}
//#endregion
//#region src/cron/service/ops-run-preparation.ts
function admitsStreamSourceRun(job, streamScheduleKey, streamSourceIdentity) {
	if (streamScheduleKey === void 0 && streamSourceIdentity === void 0) return true;
	return streamScheduleKey !== void 0 && streamSourceIdentity !== void 0 && isJobEnabled(job) && ownsCronSource(job, streamScheduleKey, streamSourceIdentity);
}
async function skipInvalidPersistedManualRun(params) {
	const endedAt = params.state.deps.nowMs();
	const errorText = normalizeCronRunErrorText(params.error);
	const diagnostics = createCronRunDiagnosticsFromError("cron-preflight", errorText, {
		severity: "warn",
		nowMs: params.state.deps.nowMs
	});
	await recordSkippedCronRuns({
		state: params.state,
		source: params.source,
		nowMs: endedAt,
		change: {
			kind: "invalid-manual",
			jobId: params.job.id,
			configRevision: resolveCronJobConfigRevision(params.job),
			error: errorText,
			diagnostics,
			scheduleMode: isImmediateCronRunMode(params.mode) ? "preserve" : "advance"
		},
		async afterCommit(outcome, historySource) {
			const job = outcome.jobs[0];
			if (!job) {
				refreshCronScheduler(params.state);
				return;
			}
			applyCronRuntimeRowsToState(params.state, [job]);
			for (const entry of outcome.logs) params.state.deps.log[entry.level](entry.fields, entry.message);
			await emitCronRunFinished(params.state, {
				jobId: job.id,
				action: "finished",
				job,
				status: "skipped",
				error: errorText,
				diagnostics,
				runId: params.runId,
				runAtMs: endedAt,
				durationMs: job.state.lastDurationMs,
				nextRunAtMs: job.state.nextRunAtMs,
				deliveryStatus: job.state.lastDeliveryStatus,
				deliveryError: job.state.lastDeliveryError,
				failureNotificationDelivery: failureNotificationDeliveryFromJobState(job)
			}, params.terminalTracker, void 0, { historySource });
			for (const notification of outcome.notifications) await runPostPersistCronNotifications(params.state, [notification]);
			refreshCronScheduler(params.state);
		}
	});
}
async function recomputeManualRunPreflight(state, id, mode) {
	await recomputeUnownedCronSchedules(state, {
		...isImmediateCronRunMode(mode) ? { preserveExpiredPacedNextRunJobId: id } : {},
		skipScheduleErrorHandling: true
	});
}
async function inspectManualRunPreflight(state, id, source, mode, opts) {
	warnIfDisabled(state, "run");
	if (state.stopped) return {
		ok: true,
		ran: false,
		reason: "stopped"
	};
	opts?.commitGuard?.();
	source.assertCurrent();
	await ensureLoaded(state, { forceReload: true });
	opts?.commitGuard?.();
	source.assertCurrent();
	if (state.stopped) return {
		ok: true,
		ran: false,
		reason: "stopped"
	};
	await recomputeManualRunPreflight(state, id, mode);
	opts?.commitGuard?.();
	if (state.stopped) return {
		ok: true,
		ran: false,
		reason: "stopped"
	};
	const job = opts?.onExit || opts?.event ? state.store?.jobs.find((entry) => entry.id === id) : findJobOrThrow(state, id);
	if (!job || opts?.onExit && (job.schedule.kind !== "on-exit" || job.schedule.command !== opts.onExit.schedule.command || job.schedule.cwd !== opts.onExit.schedule.cwd)) return {
		ok: true,
		ran: false,
		reason: "not-due"
	};
	if (opts?.event && (job.schedule.kind !== "event" || cronSourceIdentity(job) !== opts.event.input.sourceIdentity)) return {
		ok: true,
		ran: false,
		reason: "not-due"
	};
	assertCanonicalCronDeliveryMode(job.delivery);
	if (opts?.onExit && (!isJobEnabled(job) || job.state.autoDisabled)) return {
		ok: true,
		ran: false,
		reason: "disabled"
	};
	if (mode === "if-enabled" && (!isJobEnabled(job) || job.state.autoDisabled)) return {
		ok: true,
		ran: false,
		reason: "disabled"
	};
	if (!admitsStreamSourceRun(job, opts?.streamScheduleKey, opts?.streamSourceIdentity)) return {
		ok: true,
		ran: false,
		reason: "not-due"
	};
	try {
		assertExternalSourceScheduleSupport(job);
		assertSupportedJobSpec(job);
	} catch (error) {
		await skipInvalidPersistedManualRun({
			state,
			job,
			mode,
			source,
			runId: opts?.runId,
			terminalTracker: opts?.terminalTracker,
			error
		});
		return {
			ok: true,
			ran: false,
			reason: "invalid-spec"
		};
	}
	if (hasActiveCronRun(job)) return {
		ok: true,
		ran: false,
		reason: "already-running"
	};
	const now = state.deps.nowMs();
	if (!isRunnableJob({
		job,
		nowMs: now,
		forced: isImmediateCronRunMode(mode)
	})) return {
		ok: true,
		ran: false,
		reason: "not-due"
	};
	return {
		ok: true,
		runnable: true,
		job
	};
}
//#endregion
//#region src/cron/service/ops-run.ts
async function requestManualCronRun(state, id, mode, options = {}) {
	const tracking = {
		...options,
		terminalTracker: options.terminalTracker ?? { emitted: false }
	};
	const result = await locked(state, async () => {
		const preflight = await inspectManualRunPreflight(state, id, captureCronServiceMutationSource(state), mode, tracking);
		if (!preflight.ok || "reason" in preflight) return preflight;
		const [requested] = await commitCronRunRequests(state, [preflight.job], {
			...tracking,
			mode,
			source: "manual"
		});
		return requested ? { requested } : {
			ok: true,
			ran: false,
			reason: tracking.terminalTracker.emitted ? "ownerless" : "already-running"
		};
	});
	await drainCronRunQueue(state);
	return result;
}
async function run(state, id, mode, opts) {
	const execute = async () => {
		const result = await requestManualCronRun(state, id, mode, opts);
		return "requested" in result ? result.requested.completion : result;
	};
	return state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(execute) : execute();
}
/** Consuming an exit and queuing its payload share the receipt commit. */
async function runOnExit(state, id, opts) {
	const generation = state.lifecycleGeneration;
	const execute = async () => {
		const commitGuard = () => {
			if (opts.signal.aborted || state.stopped || generation !== state.lifecycleGeneration) throw createAbortError("cron on-exit admission cancelled");
			opts.commitGuard();
		};
		try {
			while (!opts.signal.aborted && !state.stopped && generation === state.lifecycleGeneration) {
				const waited = await racePromiseWithAbortSignal(waitForCronJobRun(state, id), opts.signal);
				const result = await requestManualCronRun(state, id, "force", {
					onExit: {
						...opts,
						commitGuard
					},
					commitGuard
				});
				if ("requested" in result) return await result.requested.completion;
				if (!waited || !(result.ok && "reason" in result && result.reason === "already-running")) return result;
			}
		} catch (error) {
			if (!isAbortError(error)) throw error;
		}
		return {
			ok: true,
			ran: false,
			reason: "stopped"
		};
	};
	return state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(execute) : execute();
}
/** Acknowledgement follows the durable request; the execution belongs to cron. */
async function enqueueRun(state, id, mode, opts) {
	const runId = opts?.runId ?? `cron-request.${randomUUID()}`;
	const releaseCaller = retainGatewayDeviceRevocation(opts?.commitGuard);
	const trackAdmission = captureCronRunAdmissionTracker();
	return runWithoutOwnedSessionTranscriptWrites(() => runWithGatewayIndependentRootWorkContinuation(async () => {
		let eventTransferred = false;
		const result = await requestManualCronRun(state, id, mode, {
			...opts,
			onEventTransferred: (receipt) => {
				eventTransferred = true;
				opts?.onEventTransferred?.(receipt);
			},
			runId,
			scheduleOwnershipAtMs: state.deps.nowMs(),
			terminalTracker: { emitted: false }
		});
		if (!("requested" in result)) {
			releaseCaller?.();
			return result;
		}
		if (trackAdmission) trackAdmission(() => result.requested.activation).catch((error) => {
			state.deps.log.error({
				jobId: id,
				runId,
				err: String(error)
			}, "cron: queued manual admission tracking failed");
		});
		const completion = result.requested.completion.catch((error) => {
			state.deps.log.error({
				jobId: id,
				runId,
				err: normalizeCronRunErrorText(error)
			}, "cron: queued run failed");
		}).finally(() => {
			releaseCaller?.();
			state.queuedManualRuns.delete(runId);
		});
		state.queuedManualRuns.set(runId, completion);
		if (opts?.event) {
			await result.requested.activation;
			if (!eventTransferred) return result.requested.completion;
		}
		return {
			ok: true,
			enqueued: true,
			runId
		};
	}, "cron:manual-run")).catch((error) => {
		releaseCaller?.();
		throw error;
	});
}
/**
* Resolves true once an accepted manual run has written its terminal history row,
* or false when the timeout or caller signal ends the wait first.
*/
async function waitForManualRun(state, runId, timeoutMs, signal) {
	const settled = state.queuedManualRuns.get(runId);
	if (!settled) return true;
	if (signal?.aborted) return false;
	const { promise, resolve } = createDeferredCore();
	const timer = setSafeTimeout(() => resolve(false), timeoutMs);
	const onAbort = () => resolve(false);
	signal?.addEventListener("abort", onAbort, { once: true });
	settled.then(() => resolve(true), () => resolve(true));
	try {
		return await promise;
	} finally {
		clearTimeout(timer);
		signal?.removeEventListener("abort", onAbort);
	}
}
/** Enqueues manual wake text through the cron wake API. */
function wakeNow(state, opts) {
	return wake(state, opts);
}
//#endregion
//#region src/cron/service/ops-event.ts
/** Detached snapshots only; the service capability fixes source to its own plugin ID. */
async function readEventSources(state, source) {
	return (await list(state, { includeDisabled: true })).flatMap((job) => job.schedule.kind === "event" && job.schedule.source === source && job.state.sourceIdentity ? [{
		jobId: job.id,
		sourceIdentity: job.state.sourceIdentity,
		enabled: isJobEnabled(job) && !job.state.autoDisabled,
		options: structuredClone(job.schedule.options)
	}] : []);
}
/** Transfer one immutable ingress claim, never queue a second copy of its event. */
async function runEvent(state, id, opts) {
	const input = {
		jobId: id,
		sourceIdentity: opts.sourceIdentity,
		eventId: opts.eventId,
		receivedAtMs: opts.receivedAtMs,
		payload: opts.payload
	};
	const json = JSON.stringify(input);
	const payloadJson = JSON.stringify(input.payload);
	const metadataJson = JSON.stringify({
		...input,
		payload: void 0,
		claim: opts.claim
	});
	if (!input.sourceIdentity?.trim() || !input.eventId?.trim() || !Number.isSafeInteger(input.receivedAtMs) || input.receivedAtMs < 0 || payloadJson === void 0 || Buffer.byteLength(payloadJson, "utf8") > 1048576 || Buffer.byteLength(metadataJson, "utf8") > 65536 || !opts.claim.queueName || !opts.claim.id || !opts.claim.token) throw new Error("invalid or oversized automation event input");
	const event = {
		input: JSON.parse(json),
		claim: { ...opts.claim }
	};
	const runId = cronEventRunId(event);
	const generation = state.lifecycleGeneration;
	const transferred = {};
	const paused = /* @__PURE__ */ new Error("automation event source is paused");
	const invalidated = /* @__PURE__ */ new Error("automation event source is no longer current");
	const commitGuard = () => {
		if (state.stopped || state.lifecycleGeneration !== generation || !state.deps.cronEnabled || state.schedulingPaused || state.deps.cronConfig?.triggers?.enabled === false) throw paused;
		const job = state.store?.jobs.find((candidate) => candidate.id === id);
		if (!job || job.schedule.kind !== "event" || !isJobEnabled(job) || job.state.autoDisabled || cronSourceIdentity(job) !== event.input.sourceIdentity) throw invalidated;
		opts.commitGuard();
	};
	try {
		const execute = () => enqueueRun(state, id, "if-enabled", {
			event,
			runId,
			commitGuard,
			onEventTransferred: (receipt) => {
				transferred.receiptId = receipt.receiptId;
			}
		});
		const result = await (state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(execute) : execute());
		if (transferred.receiptId) return {
			kind: "transferred",
			receiptId: transferred.receiptId,
			runId
		};
		if (result.ok && "reason" in result && result.reason === "already-running") return {
			kind: "pending",
			reason: "busy"
		};
		if (result.ok && "reason" in result && result.reason === "stopped") return {
			kind: "pending",
			reason: "stopped"
		};
		return { kind: "invalidated" };
	} catch (error) {
		if (transferred.receiptId) return {
			kind: "transferred",
			receiptId: transferred.receiptId,
			runId
		};
		if (error === paused) return {
			kind: "pending",
			reason: state.stopped || state.lifecycleGeneration !== generation ? "stopped" : "paused"
		};
		if (error === invalidated || error instanceof CronEventClaimInvalidatedError) return { kind: "invalidated" };
		throw error;
	}
}
//#endregion
//#region src/cron/service/run-recovery-events.ts
function emitInterruptedCronRun(state, interrupted) {
	const job = state.store?.jobs.find((entry) => entry.id === interrupted.jobId);
	emit(state, {
		jobId: interrupted.jobId,
		action: "finished",
		job,
		status: "error",
		completionStatus: "failed",
		error: STARTUP_INTERRUPTED_ERROR,
		delivered: false,
		deliveryStatus: "unknown",
		deliveryError: STARTUP_INTERRUPTED_ERROR,
		failureNotificationDelivery: job ? failureNotificationDeliveryFromJobState(job) : void 0,
		runId: interrupted.runId,
		runAtMs: interrupted.runAtMs,
		durationMs: interrupted.durationMs,
		nextRunAtMs: job?.state.nextRunAtMs
	});
}
//#endregion
//#region src/cron/service/run-recovery.ts
async function recoverCronRuns(state) {
	const storeKey = cronStoreKey(state.deps.storePath);
	const outcome = await executeOpenClawStateWorker(captureOpenClawStateWorkerContext(), {
		type: "cron.recoverRuns",
		input: {
			storeKey,
			nowMs: state.deps.nowMs(),
			cronConfig: structuredClone(state.deps.cronConfig),
			failureRepairTimeoutMs: state.deps.failureRepairTimeoutMs
		}
	});
	noteCronJobsStoreCommit(storeKey);
	applyCronRuntimeRowsToState(state, outcome.jobs, outcome.removedJobIds);
	for (const entry of outcome.logs) state.deps.log[entry.level](entry.fields, entry.message);
	for (const interrupted of outcome.interruptedRuns) emitInterruptedCronRun(state, interrupted);
	runPostPersistCronNotifications(state, outcome.notifications).catch((error) => {
		state.deps.log.warn({ err: String(error) }, "cron: recovery notification dispatch failed");
	});
	return new Set(outcome.skipJobIds);
}
//#endregion
//#region src/cron/service/ops-lifecycle.ts
/** Recover committed state before the worker starts dispatching new requests. */
async function start(state) {
	if (state.schedulerStarted) return;
	const generation = state.lifecycleGeneration;
	await state.schedulerDrain;
	if (state.lifecycleGeneration !== generation) return;
	if (state.schedulerScope.signal.aborted) state.schedulerScope = state.deps.scheduler.scope();
	state.stopped = false;
	const skipJobIds = await locked(state, async () => {
		await ensureLoaded(state);
		return await recoverCronRuns(state);
	});
	if (state.stopped || state.lifecycleGeneration !== generation) return;
	await startCronScheduler(state, skipJobIds);
	if (state.stopped || state.lifecycleGeneration !== generation) {
		await stopCronScheduler(state);
		return;
	}
	state.deps.log.info({
		enabled: state.deps.cronEnabled,
		jobs: state.store?.jobs.length ?? 0
	}, "cron: started");
}
/** Close dispatch synchronously, then join execution and the retained worker lease. */
function stop(state) {
	state.lifecycleGeneration += 1;
	state.stopped = true;
	state.schedulerStarted = false;
	state.schedulerDrain = Promise.allSettled([
		state.schedulerDrain,
		stopCronScheduler(state),
		stopCronRunQueue(state),
		waitForCronRunQueue(state),
		state.schedulerScope.stop()
	]).then((outcomes) => {
		const errors = outcomes.filter((outcome) => outcome.status === "rejected").map((outcome) => String(outcome.reason));
		if (errors.length > 0) state.deps.log.warn({ errors }, "cron: shutdown left work for recovery");
	});
}
function pauseScheduling(state) {
	state.schedulingPaused = true;
	refreshCronScheduler(state);
}
function resumeScheduling(state) {
	if (!state.schedulingPaused) return;
	state.schedulingPaused = false;
	if (state.schedulerStarted) {
		refreshCronScheduler(state);
		drainCronRunQueue(state).catch((error) => state.deps.log.warn({ err: String(error) }, "cron: queue drain delayed"));
	}
}
//#endregion
//#region src/cron/service/jobs-mutation-persistence.ts
async function persistUpdatedJob(params) {
	const { state, previousJob, nextJob } = params;
	const defaultAgentId = state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
	resolveCronJobEffectiveAgentId(previousJob, defaultAgentId);
	resolveCronJobEffectiveAgentId(nextJob, defaultAgentId);
	const triggerStateChanged = !isDeepStrictEqual(previousJob.trigger, nextJob.trigger) || !isDeepStrictEqual(previousJob.state.triggerState, nextJob.state.triggerState) || (previousJob.payload.kind === "script" || nextJob.payload.kind === "script") && !isDeepStrictEqual(previousJob.payload, nextJob.payload);
	const scheduleChanged = !cronSchedulingInputsEqual(previousJob, nextJob);
	const messageActionAuthorityChanged = isJobEnabled(previousJob) && !isJobEnabled(nextJob) || !cronJobMessageToolAuthorityInputsEqual(previousJob, nextJob);
	const messageSourceAuthorityChanged = !isDeepStrictEqual(previousJob.operatorSource, nextJob.operatorSource) || !cronJobMessageActionAuthorityInputsEqual(previousJob, nextJob) || triggerStateChanged && Boolean(resolveCronAuthenticatedChannelRequester(previousJob) || resolveCronAuthenticatedChannelRequester(nextJob) || resolveCronAuthenticatedCallerOrigin(previousJob) || resolveCronAuthenticatedCallerOrigin(nextJob));
	await persistCronJobMutation({
		state,
		source: params.source,
		method: params.mutationMethod,
		assertCurrent: () => {
			params.commitGuard?.();
			const currentDefaultAgentId = state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
			resolveCronJobEffectiveAgentId(previousJob, currentDefaultAgentId);
			resolveCronJobEffectiveAgentId(nextJob, currentDefaultAgentId);
		},
		agentId: params.agentId,
		preconditionJob: params.preconditionJob,
		expectedJob: {
			id: previousJob.id,
			configRevision: resolveCronJobConfigRevision(previousJob)
		},
		jobMutation: params.jobMutation,
		jobMutationSnapshot: params.jobMutationSnapshot,
		suppressScheduledJobId: nextJob.id,
		receiptMutation: {
			jobId: nextJob.id,
			triggerStateChanged,
			scheduleChanged
		},
		afterCommit: () => {
			publishCronRunReceiptMutation({
				jobId: nextJob.id,
				messageActionAuthorityChanged,
				messageSourceAuthorityChanged,
				scheduleChanged
			});
			try {
				if (params.jobMutation.kind === "update" ? params.jobMutation.patch.enabled === false : isJobEnabled(previousJob) && !isJobEnabled(nextJob)) requestActiveCronJobCancellation(nextJob.id, "Cron job disabled by operator.");
			} finally {
				if (triggerStateChanged) noteActiveCronJobTriggerMutation(nextJob.id);
			}
		},
		afterPublish: () => {
			const committedJob = findJobOrThrow(state, nextJob.id);
			emit(state, {
				jobId: nextJob.id,
				action: "updated",
				job: committedJob,
				nextRunAtMs: committedJob.state.nextRunAtMs
			});
		}
	});
	return findJobOrThrow(state, nextJob.id);
}
//#endregion
//#region src/cron/service/ops-mutations.ts
const RETRY_ADD_AFTER_SESSION_CLEANUP = /* @__PURE__ */ new Error("retry add after session cleanup");
/** Cancels only caller-corroborated definitions while the durable lifecycle fence holds. */
async function quiesceJobs(state, jobs, commitGuard) {
	await locked(state, async () => {
		await ensureLoadedForOperation(state);
		for (const expected of jobs) {
			const job = state.store?.jobs.find((candidate) => candidate.id === expected.id);
			if (!job || resolveCronJobConfigRevision(job) !== expected.revision) throw new Error(`Cron job ${expected.id} changed before cancellation.`);
		}
		commitGuard();
		for (const job of jobs) requestActiveCronJobCancellation(job.id, "Claw agent removal.");
	});
}
/** Adds or converges a declaration-keyed cron job inside one store lock and write transaction. */
async function add(state, input, opts) {
	const source = captureCronJobMutationSource(state);
	let pendingSessionCleanup;
	return await locked(state, async () => {
		source.assertCurrent();
		warnIfDisabled(state, "add");
		if (input.payload.kind === "heartbeat" && opts?.systemOwned !== true) throw new Error("system-owned payloads cannot be created by cron clients");
		const declarationKey = normalizeOptionalString(input.declarationKey);
		const systemOwnedDeclarationNamespace = systemOwnedDeclarationKeyNamespace(declarationKey);
		if (systemOwnedDeclarationNamespace && opts?.systemOwned !== true) throw new Error(`cron declarationKey namespace "${systemOwnedDeclarationNamespace}" is system-owned; jobs cannot be created with it`);
		await ensureLoadedForOperation(state);
		const agentId = resolveCronJobEffectiveAgentId(input, resolveCurrentDefaultAgentId(state));
		const normalizedId = normalizeOptionalString(input.id);
		if (input.id !== void 0 && !normalizedId) throw new Error("cron job id must not be blank");
		if (normalizedId) {
			normalizeCronRunJobId(normalizedId);
			pendingSessionCleanup = getPendingCronSessionCleanup(state, normalizedId);
			if (pendingSessionCleanup) throw RETRY_ADD_AFTER_SESSION_CLEANUP;
		}
		const normalizedInput = normalizedId ? {
			...input,
			id: normalizedId
		} : input;
		const configuredChannels = await resolveConfiguredChannelsForValidation(state);
		source.assertCurrent();
		const mutation = {
			kind: "add",
			input: {
				...normalizedInput,
				id: normalizedId ?? crypto.randomUUID()
			},
			matchingJobIds: opts?.matchesExisting ? state.store?.jobs.filter(opts.matchesExisting).map((job) => job.id) ?? [] : void 0,
			options: {
				enabledExplicit: opts?.enabledExplicit,
				systemOwned: opts?.systemOwned,
				createdActor: opts?.createdActor,
				inferenceBinding: opts?.inferenceBinding,
				sourceConversation: opts?.sourceConversation,
				operatorSource: opts?.operatorSource,
				skillLibrarySelections: opts?.skillLibrarySelections,
				scheduledToolPolicy: opts?.scheduledToolPolicy,
				toolsAllowProvenance: opts?.toolsAllowProvenance,
				toolsAllowExecTarget: opts?.toolsAllowExecTarget,
				captured: false
			}
		};
		const mutationSnapshot = {
			nowMs: state.deps.nowMs(),
			scheduler: await captureCronSchedulerSnapshot(state, configuredChannels, source)
		};
		const plan = await prepareCronJobMutation(state, source, mutation, mutationSnapshot);
		if (!plan.job) throw new Error("Cron add produced no job");
		const job = plan.job;
		const existing = plan.previous.jobs.find((entry) => entry.id === job.id);
		const captured = consumeRuntimeAuthorityMutationOptions(opts);
		Object.assign(mutation.options, captured);
		reconcileRuntimeAuthority({
			job,
			...captured,
			explicitlyMutatesToolsAllow: normalizedInput.payload.toolsAllow !== void 0
		});
		plan.updated = existing !== void 0 && !isDeepStrictEqual(declarativeFields(existing, opts?.enabledExplicit === true), declarativeFields(job, opts?.enabledExplicit === true));
		if (existing && plan.updated) {
			const committedJob = await persistUpdatedJob({
				state,
				source,
				previousJob: existing,
				nextJob: job,
				commitGuard: opts?.commitGuard,
				agentId,
				mutationMethod: "cron.add",
				jobMutation: mutation,
				jobMutationSnapshot: mutationSnapshot
			});
			return {
				...committedJob,
				created: false,
				updated: true,
				job: committedJob
			};
		}
		await persistCronJobMutation({
			state,
			source,
			method: "cron.add",
			assertCurrent: opts?.commitGuard,
			agentId,
			expectedJob: existing ? {
				id: existing.id,
				configRevision: resolveCronJobConfigRevision(existing)
			} : void 0,
			jobMutation: mutation,
			jobMutationSnapshot: mutationSnapshot,
			suppressScheduledJobId: job.id,
			afterPublish: () => {
				if (!plan.created) return;
				const committedJob = findJobOrThrow(state, job.id);
				state.deps.log.info({
					jobId: job.id,
					jobName: committedJob.name,
					nextRunAtMs: committedJob.state.nextRunAtMs,
					cronEnabled: state.deps.cronEnabled
				}, "cron: job added");
				emit(state, {
					jobId: job.id,
					action: "added",
					job: committedJob,
					nextRunAtMs: committedJob.state.nextRunAtMs
				});
			}
		});
		const committedJob = findJobOrThrow(state, job.id);
		return declarationKey ? {
			...committedJob,
			created: plan.created === true,
			...existing ? { updated: false } : {},
			job: committedJob
		} : committedJob;
	}).catch(async (error) => {
		if (error !== RETRY_ADD_AFTER_SESSION_CLEANUP || !pendingSessionCleanup) throw error;
		await pendingSessionCleanup;
		source.assertCurrent();
		return await add(state, input, opts);
	});
}
/** Prunes an owned job family from obsolete store partitions after active-store convergence. */
async function removeStaleJobFamily(state, family, opts) {
	return await locked(state, async () => {
		await ensureLoadedForOperation(state);
		return await removeStaleCronJobFamilyRows(state.deps.storePath, family, opts);
	});
}
async function updateLoadedJob(params) {
	const { state, source, id, patch, precondition, opts } = params;
	source.assertCurrent();
	warnIfDisabled(state, "update");
	if (patch.payload?.kind === "heartbeat") throw new Error("system-owned payloads cannot be patched by cron clients");
	await ensureLoadedForOperation(state);
	const job = findJobOrThrow(state, id);
	if (isSystemMonitorDeclaration(job.declarationKey)) throw new Error("system-owned monitor jobs cannot be edited by cron clients");
	const now = state.deps.nowMs();
	const configuredChannels = cronPatchTouchesDeliveryResolution(patch) ? await resolveConfiguredChannelsForValidation(state) : void 0;
	await precondition?.(structuredClone(job), now);
	source.assertCurrent();
	const mutation = {
		kind: "update",
		id,
		patch,
		options: {
			inferenceBinding: opts?.inferenceBinding,
			scheduledToolPolicy: opts?.scheduledToolPolicy,
			toolsAllowProvenance: opts?.toolsAllowProvenance,
			toolsAllowExecTarget: opts?.toolsAllowExecTarget,
			captured: false
		}
	};
	const mutationSnapshot = {
		nowMs: now,
		scheduler: await captureCronSchedulerSnapshot(state, configuredChannels, source)
	};
	const plan = await prepareCronJobMutation(state, source, mutation, mutationSnapshot);
	const nextJob = plan.job;
	const previousJob = plan.previous.jobs.find((entry) => entry.id === id);
	if (!nextJob || !previousJob) throw new Error(`unknown cron job id: ${id}`);
	const captured = consumeRuntimeAuthorityMutationOptions(opts);
	Object.assign(mutation.options, captured);
	reconcileRuntimeAuthority({
		job: nextJob,
		...captured,
		explicitlyMutatesToolsAllow: patch.payload !== void 0 && Object.hasOwn(patch.payload, "toolsAllow")
	});
	source.assertCurrent();
	return await persistUpdatedJob({
		state,
		previousJob,
		nextJob,
		source,
		commitGuard: opts?.commitGuard,
		agentId: patch.agentId !== void 0 ? resolveCronJobEffectiveAgentId(nextJob, resolveCurrentDefaultAgentId(state)) : void 0,
		preconditionJob: precondition ? job : void 0,
		mutationMethod: "cron.update",
		jobMutation: mutation,
		jobMutationSnapshot: mutationSnapshot
	});
}
/** Updates a cron job patch in-place, recomputes affected schedule state, and persists it. */
async function update(state, id, patch, opts) {
	const source = captureCronJobMutationSource(state);
	return await locked(state, async () => await updateLoadedJob({
		state,
		source,
		id,
		patch,
		opts
	}));
}
/** Updates a cron job only after a store-locked caller precondition passes. */
async function updateWithPrecondition(state, id, patch, precondition, opts) {
	const source = captureCronJobMutationSource(state);
	return await locked(state, async () => await updateLoadedJob({
		state,
		source,
		id,
		patch,
		precondition,
		opts
	}));
}
/** Removes a cron job through its worker owner before canceling and cleaning up host work. */
async function remove(state, id, opts) {
	const source = captureCronJobMutationSource(state);
	let sessionCleanup;
	const outcome = await locked(state, async () => {
		source.assertCurrent();
		warnIfDisabled(state, "remove");
		await ensureLoadedForOperation(state);
		if (!state.store) return {
			ok: false,
			removed: false
		};
		const removedJob = state.store.jobs.find((j) => j.id === id);
		if (!removedJob) return {
			ok: true,
			removed: false
		};
		if (isSystemMonitorDeclaration(removedJob.declarationKey) && opts?.systemOwned !== true) throw new Error("system-owned monitor jobs cannot be removed by cron clients");
		source.assertCurrent();
		opts?.commitGuard?.();
		const agentId = resolveCronJobEffectiveAgentId(removedJob, resolveCurrentDefaultAgentId(state));
		const sessionStorePath = state.deps.resolveSessionStorePath?.(agentId) ?? state.deps.sessionStorePath;
		let activeRunCancellationRequested = false;
		await persistCronJobMutation({
			state,
			source,
			method: "cron.remove",
			assertCurrent: opts?.commitGuard,
			jobMutation: {
				kind: "remove",
				ids: [id],
				systemOwned: opts?.systemOwned
			},
			jobMutationSnapshot: {
				nowMs: state.deps.nowMs(),
				scheduler: await captureCronSchedulerSnapshot(state)
			},
			suppressScheduledJobId: id,
			afterCommit: () => {
				noteActiveCronJobRemoval(id, opts?.commitGuard, (activeMarker) => {
					activeRunCancellationRequested = activeMarker?.cancellation?.kind === "requested";
					if (sessionStorePath && (removedJob.sessionTarget === "isolated" || removedJob.sessionTarget === "current")) {
						let finish;
						const done = new Promise((resolve) => {
							finish = resolve;
						});
						const release = registerPendingCronSessionCleanup(state, id, done, agentId);
						sessionCleanup = {
							activeMarker,
							agentId,
							sessionStorePath,
							finish,
							release
						};
					}
				});
			},
			afterPublish: () => {
				emit(state, {
					jobId: id,
					action: "removed",
					job: removedJob
				});
			}
		});
		return {
			ok: true,
			removed: true,
			...activeRunCancellationRequested ? { activeRunCancellationRequested: true } : {}
		};
	}).then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error
	}));
	if (!sessionCleanup) {
		if (!outcome.ok) throw outcome.error;
		return outcome.value;
	}
	const { activeMarker, agentId, sessionStorePath, finish, release } = sessionCleanup;
	const cleanup = async () => {
		try {
			if (await locked(state, async () => {
				await ensureLoaded(state);
				return !state.store?.jobs.some((job) => job.id === id);
			})) await removeCronJobBaseSession({
				agentId,
				jobId: id,
				sessionStorePath
			});
			return;
		} catch (error) {
			const message = `Cron job ${id} was removed, but session cleanup failed: ${String(error)}. Use openclaw sessions list --json, then openclaw sessions delete to retry.`;
			state.deps.log.warn({
				jobId: id,
				err: message
			}, "cron: session cleanup failed");
			return message;
		} finally {
			release();
			finish();
		}
	};
	if (activeMarker) {
		onCronJobInactive(activeMarker, () => void trackAsyncWork(cleanup));
		if (!outcome.ok) throw outcome.error;
		return {
			...outcome.value,
			sessionCleanup: "pending"
		};
	}
	const cleanupError = await cleanup();
	if (!outcome.ok) throw outcome.error;
	if (cleanupError) throw new Error(cleanupError);
	return outcome.value;
}
/** The caller retains its agent-deletion fence while the cron lock joins roster and row writes. */
async function removeAgentJobsTransactional(state, agentId, commit) {
	const source = captureCronServiceMutationSource(state);
	return await locked(state, async () => {
		source.assertCurrent();
		warnIfDisabled(state, "remove agent jobs");
		await ensureLoadedForOperation(state);
		source.assertCurrent();
		const id = normalizeOptionalAgentId(agentId);
		if (!id || !state.store) return await commit();
		const defaultAgentId = resolveCurrentDefaultAgentId(state);
		const removedJobs = state.store.jobs.filter((job) => tryResolveCronJobEffectiveAgentId(job, defaultAgentId) === id);
		if (removedJobs.length === 0) return await commit();
		let roster;
		try {
			roster = { value: await commit() };
		} catch (error) {
			if (!(error instanceof AgentDeletionCommitUncertainError)) throw error;
			roster = { error };
		}
		const removedJobIds = new Set(removedJobs.map((job) => job.id));
		try {
			await persistCronJobMutation({
				state,
				source,
				method: "cron.remove",
				jobMutation: {
					kind: "remove",
					ids: [...removedJobIds],
					systemOwned: true
				},
				jobMutationSnapshot: {
					nowMs: state.deps.nowMs(),
					scheduler: await captureCronSchedulerSnapshot(state)
				},
				afterCommit() {
					for (const job of removedJobs) noteActiveCronJobRemoval(job.id);
				},
				afterPublish() {
					for (const job of removedJobs) emit(state, {
						jobId: job.id,
						action: "removed",
						job
					});
				}
			});
		} catch (error) {
			if ("error" in roster) throw new AgentDeletionCommitUncertainError(new AggregateError([roster.error, error], "Cron cleanup failed after an uncertain agent roster commit", { cause: roster.error }));
			throw new Error("Agent roster committed, but cron cleanup did not complete.", { cause: error });
		}
		if ("error" in roster) throw roster.error;
		return roster.value;
	});
}
//#endregion
//#region src/cron/service/ops-stream.ts
async function mutateExternalState(state, jobId, requested) {
	const source = captureCronJobMutationSource(state);
	const change = structuredClone(requested);
	return await locked(state, async () => {
		source.assertCurrent();
		await ensureLoaded(state);
		source.assertCurrent();
		if (change.kind === "failure") {
			const job = findJobOrThrow(state, jobId);
			if (change.source && !ownsCronSource(job, change.source.scheduleKey, change.source.identity)) return;
		}
		if (change.kind === "state" || change.kind === "failure") assertCronJobStateTimestamps(change.statePatch);
		let committed;
		let retiredIdentity;
		let failure;
		try {
			await runCronRuntimeMutation({
				context: source.context,
				type: "cron.mutateExternalState",
				input: {
					storeKey: source.storeKey,
					jobId,
					change
				},
				assertCurrent: () => source.assertCurrent(),
				snapshot: {
					nowMs: state.deps.nowMs(),
					cronConfig: change.kind === "failure" ? structuredClone(state.deps.cronConfig) : void 0
				},
				publish(outcome) {
					committed = outcome;
					if (outcome.job) noteCronJobsStoreCommit(source.storeKey);
				}
			});
		} catch (error) {
			noteCronJobsStoreCommit(source.storeKey);
			failure = { error };
		}
		try {
			if (committed) {
				source.assertCurrent();
				for (const log of committed.logs) state.deps.log[log.level](log.fields, log.message);
				if (committed.job) {
					if (change.kind === "failure") {
						await emitCronRunFinished(state, {
							jobId,
							action: "finished",
							job: committed.job,
							status: "error",
							error: change.error,
							runAtMs: committed.nowMs,
							durationMs: 0,
							failureNotificationDelivery: failureNotificationDeliveryFromJobState(committed.job)
						}, void 0, void 0, { historySource: source });
						source.assertCurrent();
					}
					applyCronRuntimeRowsToState(state, [committed.job]);
					if (change.kind === "retire") retiredIdentity = committed.job.state.streamSourceIdentity;
				}
				if (change.kind === "failure") {
					for (const notification of committed.notifications) {
						source.assertCurrent();
						await runPostPersistCronNotifications(state, [notification]);
					}
					source.assertCurrent();
					refreshCronScheduler(state);
				}
			}
		} catch (error) {
			if (!failure) throw error;
			state.deps.log.warn({
				jobId,
				error
			}, "cron: committed external state publication failed");
		}
		if (failure) {
			if (change.kind === "retire" && retiredIdentity === void 0) try {
				const loaded = await loadCronJobsStoreWithConfigJobsReadOnly(state.deps.storePath, source.context.environment);
				source.assertStorageCurrent();
				const current = loaded.store.jobs.find((job) => job.id === jobId);
				if (current && ownsCronSource(current, change.source.scheduleKey, change.nextIdentity)) {
					retiredIdentity = change.nextIdentity;
					applyCronRuntimeRowsToState(state, [current]);
				}
			} catch (error) {
				state.deps.log.warn({
					jobId,
					error
				}, "cron: stream retirement readback failed");
			}
			if (change.kind === "retire" && retiredIdentity !== void 0) throw new CronStreamSourceRetirementError({
				jobId,
				scheduleKey: change.source.scheduleKey,
				previousIdentity: change.source.identity,
				identity: retiredIdentity
			}, failure.error);
			throw failure.error;
		}
		return committed?.job;
	});
}
async function recordExternalFailure(state, id, error, statePatch, source) {
	await mutateExternalState(state, id, {
		kind: "failure",
		error,
		statePatch,
		source
	});
}
/** Source-qualified state cannot overwrite the identity of its replacement. */
async function updateExternalState(state, id, scheduleKey, identity, statePatch) {
	return await mutateExternalState(state, id, {
		kind: "state",
		source: {
			scheduleKey,
			identity
		},
		statePatch
	}) !== void 0;
}
async function retireExternalStreamSource(state, id, scheduleKey, identity) {
	return (await mutateExternalState(state, id, {
		kind: "retire",
		source: {
			scheduleKey,
			identity
		},
		nextIdentity: createCronSourceIdentity()
	}))?.state.streamSourceIdentity;
}
/** Loss counters remain monotonic across logical source replacement. */
async function updateExternalCounters(state, id, counters) {
	await mutateExternalState(state, id, {
		kind: "counters",
		counters
	});
}
//#endregion
//#region src/cron/service.ts
/** Public cron service facade that owns mutable scheduler state and delegates to locked ops. */
var CronService = class {
	constructor(deps) {
		this.startInProgress = 0;
		this.startState = null;
		this.state = createCronServiceState(deps);
	}
	async start() {
		if (this.state.schedulerStarted && !this.state.stopped) return;
		const generation = this.state.lifecycleGeneration;
		const pending = this.startState;
		if (pending) {
			try {
				await pending.promise;
			} catch (err) {
				if (pending.generation === generation) throw err;
			}
			if (pending.generation === generation) return;
			await this.start();
			return;
		}
		const promise = this.startOnce(generation);
		this.startState = {
			generation,
			promise
		};
		try {
			await promise;
		} finally {
			if (this.startState?.promise === promise) this.startState = null;
		}
	}
	async startOnce(generation) {
		this.startInProgress += 1;
		try {
			const start$1 = () => start(this.state);
			await (this.state.deps.runSchedulerOwned ? this.state.deps.runSchedulerOwned(start$1) : start$1());
			if (generation !== this.state.lifecycleGeneration) {
				stop(this.state);
				return;
			}
			this.state.schedulerStarted = !this.state.stopped;
		} finally {
			this.startInProgress -= 1;
		}
	}
	stop() {
		stop(this.state);
	}
	/** Joins stopped timer generations from outside their callbacks. */
	async waitForIdle() {
		await this.state.schedulerDrain;
	}
	pauseScheduling() {
		pauseScheduling(this.state);
	}
	resumeScheduling() {
		resumeScheduling(this.state);
	}
	getSuspensionBlockerCount() {
		return this.startInProgress;
	}
	async readEventSources(source) {
		return await readEventSources(this.state, source);
	}
	async runEvent(id, opts) {
		return await runEvent(this.state, id, opts);
	}
	async status() {
		return await status(this.state);
	}
	async list(opts) {
		return await list(this.state, opts);
	}
	async listPage(opts, matchesJob) {
		return await listPage(this.state, opts, matchesJob);
	}
	async add(input, opts) {
		return await add(this.state, input, opts);
	}
	async removeStaleJobFamily(family, opts) {
		return await removeStaleJobFamily(this.state, family, opts);
	}
	async update(id, patch, opts) {
		return await update(this.state, id, patch, opts);
	}
	async updateWithPrecondition(id, patch, precondition, opts) {
		return await updateWithPrecondition(this.state, id, patch, precondition, opts);
	}
	async remove(id, opts) {
		return await remove(this.state, id, opts);
	}
	async removeAgentJobsTransactional(agentId, commit) {
		return await removeAgentJobsTransactional(this.state, agentId, commit);
	}
	async quiesceJobs(jobs, commitGuard) {
		await quiesceJobs(this.state, jobs, commitGuard);
	}
	async run(id, mode, opts) {
		return await run(this.state, id, mode, opts);
	}
	async runOnExit(id, opts) {
		return await runOnExit(this.state, id, opts);
	}
	async enqueueRun(id, mode, opts) {
		const result = await enqueueRun(this.state, id, mode, opts);
		if (result.ok && "runnable" in result) throw new Error("cron enqueueRun returned unresolved runnable disposition");
		return result;
	}
	async waitForManualRun(runId, timeoutMs, signal) {
		return await waitForManualRun(this.state, runId, timeoutMs, signal);
	}
	getJob(id) {
		return this.state.store?.jobs.find((job) => job.id === id);
	}
	/** In-memory job snapshot; undefined until the store is loaded. */
	getLoadedJobs() {
		return this.state.store?.jobs;
	}
	async readJob(id) {
		return await readJob(this.state, id);
	}
	async readScratch(id, options) {
		return await readScratch(this.state, id, options);
	}
	async writeScratch(id, params) {
		return await writeScratch(this.state, id, params);
	}
	async recordExternalFailure(id, error, statePatch, source) {
		await recordExternalFailure(this.state, id, error, statePatch, source);
	}
	async updateExternalState(id, streamScheduleKey, streamSourceIdentity, statePatch) {
		return await updateExternalState(this.state, id, streamScheduleKey, streamSourceIdentity, statePatch);
	}
	async retireExternalStreamSource(id, streamScheduleKey, streamSourceIdentity) {
		return await retireExternalStreamSource(this.state, id, streamScheduleKey, streamSourceIdentity);
	}
	async updateExternalCounters(id, counters) {
		await updateExternalCounters(this.state, id, counters);
	}
	getDefaultAgentId() {
		return this.state.deps.resolveDefaultAgentId ? this.state.deps.resolveDefaultAgentId() : this.state.deps.defaultAgentId;
	}
	wake(opts) {
		return wakeNow(this.state, opts);
	}
};
//#endregion
export { cronScriptFailureMetadata as n, CronService as t };
