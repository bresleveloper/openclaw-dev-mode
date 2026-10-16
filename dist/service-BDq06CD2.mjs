import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { t as isAbortError } from "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as formatTimestamp } from "./timestamps-tLN31L4a.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { it as resolveAdmittedCronCompletionStatus } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { t as setSafeTimeout } from "./timer-delay-D19PisE-.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { c as normalizeOptionalAgentId, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { l as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-m7NE2aEm.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation, r as beginGatewayRootWorkAdmissionWhenOpen, t as GatewayDrainingError } from "./gateway-work-admission-rc4ZgKq_.mjs";
import "./heartbeat-wake-ba6LAy2M.mjs";
import { d as retainGatewayDeviceRevocation } from "./device-revocation-DeateGFe.mjs";
import "./normalize-BnyTRpHq.mjs";
import { n as getInvalidPersistedCronJobReason, t as assertCronJobStateTimestamps } from "./persisted-shape-wTzSQpQE.mjs";
import { t as assertCronStoreCanPersist, v as cronSchedulingInputsEqual, y as tryCronScheduleIdentity } from "./row-codec-DgIrj0Uv.mjs";
import { c as resolveCronToolsAllowExecTargetRecoveryError } from "./scheduled-tool-policy-CYthJ0r4.mjs";
import { a as appendCronPayloadText, i as CronStreamSourceRetirementError, l as ownsStreamSource, n as normalizeCronJobInput, o as createCronStreamSourceIdentity, s as cronStreamScheduleKey } from "./normalize-Lu86QQtC.mjs";
import { i as resolveCronAuthenticatedChannelRequester, r as resolveCronAuthenticatedCallerOrigin } from "./tools-allow-provenance-Dh4Ut701.mjs";
import { r as isInvalidCronSessionTargetIdError } from "./session-target-DJsUULzX.mjs";
import { a as hasCanonicalCronDeliveryMode, n as assertCanonicalCronDeliveryMode, t as CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE } from "./delivery-codec-DMPX9PBc.mjs";
import { C as onCronJobInactive, S as noteActiveCronJobTriggerMutation, _ as markCronJobWaitingForHeartbeat, b as noteActiveCronJobRemoval, f as isCronActiveJobMarkerCurrent, m as isCronSelfRemovalCurrent, n as bindCronJobAdmittedRun, p as isCronJobActive, s as clearCronJobActive, w as requestActiveCronJobCancellation } from "./active-jobs-BS2UT6i2.mjs";
import { n as AgentDeletionCommitUncertainError } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { n as resolveMaintenanceConfig } from "./store-maintenance-runtime-CXttvsi9.mjs";
import { i as readSessionEntriesFromStoreInWorker, r as readExpiredCronRunEntriesInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { g as applySessionEntryLifecycleMutation } from "./session-accessor.reset-DWr6djSD.mjs";
import { r as publishCronJobNames } from "./job-name-96dek-P6.mjs";
import { c as hasPendingGeneratedMediaTaskForSessionKey, t as buildPendingGeneratedMediaSessionKeySet } from "./media-generation-activity-JkwDNUkC.mjs";
import { a as trackActiveCronTaskRunSettlement, r as registerActiveCronTaskRun } from "./active-run-cancellation-CKD08Yo7.mjs";
import "./lanes-D7a4ntDu.mjs";
import { i as enqueueCommandInLane } from "./command-queue-CFE60Avj.mjs";
import { a as preExecutionTimeoutErrorMessage, c as timeoutErrorMessage, i as normalizeCronRunErrorText, r as isSetupTimeoutErrorText, s as setupTimeoutErrorMessage, t as abortErrorMessage } from "./execution-errors-3rfzndmK.mjs";
import { n as runOutsideOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { n as captureCronRunAdmissionTracker, t as captureCronMutationCommit } from "./mutation-completion-DRIubopj.mjs";
import { b as assertSubagentReadContext } from "./subagent-registry-state-CVSclnHX.mjs";
import { n as resolveCronJobEffectiveAgentId, r as tryResolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-uYw1RFJQ.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-C18RZBZJ.mjs";
import { r as prepareCronDescendantDeletion } from "./run-subagent-registry.runtime-DUauyftb.mjs";
import { t as runCronRuntimeMutation } from "./runtime-mutation-CPS1DVrM.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { c as CronJobsStoreChangedError, r as prepareCronStoreChanges } from "./save.kernel-DXaa8SoK.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { d as saveCronJobsStoreWithRevision, i as loadCronJobsStoreWithConfigJobs, n as getCronJobsStoreRevision, o as noteCronJobsStoreCommit, s as removeStaleCronJobFamilyRows } from "./store-ChPMJI5O.mjs";
import { C as retainCronRunReceiptSettlement, E as describeUnavailableCronAgent, S as releaseLocalCronRunReceiptOwnership, _ as isCronRunReceiptOwnerStale, b as prepareCronRunReceiptClaim, d as claimLocalCronRunReceiptOwnership, h as finishCronRunReceiptAsync, n as CronRunReceiptConflictError, p as exactCronRunReceiptMatches, r as CronRunReceiptRevisionError } from "./run-receipt-store-BI8RC7qi.mjs";
import { C as summarizeCronJobSchedule, M as resolveCronNotificationQueueOwner, T as resolveForcePreservedOneShotAtMs, c as hasScheduledNextRunAtMs, f as needsCronTimerMaintenance, g as recomputeNextRunsForMaintenance, j as prepareCronNotificationRouting, k as captureCronNotificationRouting, l as isJobEnabled, o as findJobOrThrow, p as nextWakeAtMs, r as computeJobNextRunAtMs, s as hasActiveCronRun, u as isStaleFutureCronSlot, x as resolveJobLastRunStatus } from "./jobs-scheduling-CBskypsm.mjs";
import { a as systemOwnedDeclarationKeyNamespace, i as isSystemMonitorDeclaration } from "./system-owned-declaration-CIFRO5mv.mjs";
import { i as registerPendingCronSessionCleanup, r as locked, t as getPendingCronSessionCleanup } from "./locked-CyUkMHfL.mjs";
import { n as createCronRunDiagnosticsFromError } from "./run-diagnostics-D1nl-AS_.mjs";
import { C as finishCronRun, D as isImmediateCronRunMode, E as emit, S as createCronRunHandle, T as createCronServiceState, _ as MAX_CRON_TIMER_DELAY_MS, b as runsDetachedFromMainSession, c as emitCronRunFinished, f as normalizeQueuedSystemEventHandle, l as emitMissingRequestedCronRunTerminal, m as resolveDeliveryState, n as applyOutcomeToAuthoritativeJob, o as emitCronOutcomeEventForJob, p as removeQueuedSystemEventHandle, r as applyOutcomeToStoredJob, s as emitCronOutcomeForJob, u as recordCronOutcomeForJob, v as MIN_REFIRE_GAP_MS, w as recordQuietCronEvaluation, x as createCronOwnerExecutionIdentityAdmission, y as resolveMainSessionCronDeliveryContext } from "./timer-outcomes-BqDgA2oM.mjs";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-1uq0obi_.mjs";
import { c as assertSupportedJobSpec, d as resolveConfiguredChannelsForValidation, i as declarativeFields, l as assertTimeScheduleSatisfiable, n as applyJobPatch, o as normalizeCronRunJobId, r as createJob, t as applyDeclarativeJobSpec, u as cronPatchTouchesDeliveryResolution } from "./jobs-CYR_Cvky.mjs";
import { i as resolveFailureAlert, t as failureNotificationDeliveryFromJobState } from "./failure-alerts-DGUv78dt.mjs";
import { a as reconcileRuntimeAuthority, i as reconcileCronChannelRequesterAuthority, n as cronJobMessageActionAuthorityInputsEqual, r as cronJobMessageToolAuthorityInputsEqual, t as consumeRuntimeAuthorityMutationOptions } from "./jobs-tool-policy-8ixPr7vE.mjs";
import { a as markServiceCronJobActive, c as resolveCronRunReceiptTerminalStatus, i as assertServiceCronRunReceiptCurrent, l as trackServiceCronRunReceiptSettlement, o as prepareCronRunReceiptOwnerMutation, s as publishCronRunReceiptMutation, t as STARTUP_INTERRUPTED_ERROR } from "./startup-run-repair--Bve7Kik.mjs";
import { n as isHeartbeatTaskCronJob } from "./heartbeat-task-BGANU0wH.mjs";
import { r as isRunnableJob, t as collectRunnableJobs } from "./timer-runnable-BUn4x3Nq.mjs";
import { n as deleteCronSessionViaGateway } from "./session-cleanup-DC7AU9rh.mjs";
import { t as readCronScratchSnapshot } from "./scratch-read-D5KvLJ0l.mjs";
import { o as writeCronJobScratch } from "./scratch-store-CQLK4z6q.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { isMainThread, threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";
import pMap, { pMapSkip } from "p-map";
//#region src/cron/service/foreign-receipt-monitor.ts
const CRON_FOREIGN_RECEIPT_RECHECK_MS = 2e3;
const monitors = /* @__PURE__ */ new WeakMap();
function monitor(state) {
	let current = monitors.get(state);
	if (!current) {
		current = {
			byJobId: /* @__PURE__ */ new Map(),
			waiters: /* @__PURE__ */ new Map(),
			timer: null
		};
		monitors.set(state, current);
	}
	return current;
}
function arm(state) {
	const current = monitor(state);
	const reconcile = current.reconcile;
	if (state.stopped || current.timer || current.byJobId.size === 0 || !reconcile) return;
	current.timer = state.schedulerScope.schedule({
		id: `cron:${state.deps.storePath}:foreign-receipts`,
		atMs: state.schedulerScope.now() + CRON_FOREIGN_RECEIPT_RECHECK_MS,
		everyMs: CRON_FOREIGN_RECEIPT_RECHECK_MS,
		run: () => runInDetachedAsyncContext(() => {
			return (state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(reconcile) : reconcile()).catch((error) => {
				state.deps.log.warn({ err: String(error) }, "cron: foreign receipt reconciliation failed");
			});
		})
	});
}
function configureForeignReceiptMonitor(state, reconcile) {
	monitor(state).reconcile = reconcile;
	arm(state);
}
function enrollForeignReceipt(state, receipt) {
	monitor(state).byJobId.set(receipt.jobId, receipt);
	arm(state);
}
function listForeignReceipts(state) {
	return [...monitor(state).byJobId.values()].toSorted((left, right) => left.jobId.localeCompare(right.jobId));
}
function waitForForeignReceipt(state, jobId, signal) {
	if (state.stopped || signal.aborted) return Promise.resolve(false);
	const current = monitor(state);
	if (!current.byJobId.has(jobId)) return Promise.resolve(true);
	return new Promise((resolve) => {
		const waiters = current.waiters.get(jobId) ?? /* @__PURE__ */ new Set();
		const finish = (settled) => {
			signal.removeEventListener("abort", abort);
			waiters.delete(finish);
			if (waiters.size === 0) current.waiters.delete(jobId);
			resolve(settled);
		};
		const abort = () => finish(false);
		waiters.add(finish);
		current.waiters.set(jobId, waiters);
		signal.addEventListener("abort", abort, { once: true });
		if (signal.aborted) abort();
	});
}
function removeForeignReceipt(state, jobId) {
	const current = monitor(state);
	current.byJobId.delete(jobId);
	if (current.byJobId.size === 0) {
		current.timer?.cancel();
		current.timer = null;
	}
	for (const finish of current.waiters.get(jobId) ?? []) finish(true);
}
function stopForeignReceiptMonitor(state) {
	const current = monitor(state);
	if (current.timer) {
		current.timer.cancel();
		current.timer = null;
	}
	current.byJobId.clear();
	current.reconcile = void 0;
	for (const waiters of current.waiters.values()) for (const finish of waiters) finish(false);
}
function resumeForeignReceiptMonitor(state) {
	arm(state);
}
//#endregion
//#region src/cron/service/run-admission-capacity.ts
function acquireCronRunSlot(state) {
	state.runAdmission.active += 1;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		state.runAdmission.active -= 1;
		dispatchWaiters(state);
	};
}
function dispatchWaiters(state) {
	const admission = state.runAdmission;
	if (state.stopped) {
		cancelCronRunAdmissionWaiters(state);
		return;
	}
	const maxConcurrentRuns = 8;
	while (admission.active < maxConcurrentRuns) {
		const waiter = admission.waiters.shift();
		if (!waiter) break;
		waiter(acquireCronRunSlot(state));
	}
	if (admission.active < maxConcurrentRuns && admission.waiters.length === 0) {
		const listener = admission.capacityListener;
		admission.capacityListener = null;
		if (listener) queueMicrotask(listener);
	}
}
/**
* Acquire only the slots currently available to scheduled work. Unlike the
* waiter-based path used by direct runs, this never retains a timer batch while
* the pool is saturated.
*/
function tryAcquireCronRunSlots(state, requested) {
	if (state.stopped || requested <= 0 || state.runAdmission.waiters.length > 0) return [];
	const available = Math.max(0, 8 - state.runAdmission.active);
	return Array.from({ length: Math.min(requested, available) }, () => acquireCronRunSlot(state));
}
/** Keep the first wake-up until capacity release consumes or cancellation clears it. */
function setCronRunCapacityListener(state, listener) {
	state.runAdmission.capacityListener ??= listener;
}
async function acquireCronRunAdmission(state, signal) {
	const admission = state.runAdmission;
	if (state.stopped || signal?.aborted) return null;
	if (admission.waiters.length === 0 && admission.active < 8) return acquireCronRunSlot(state);
	return await new Promise((resolve) => {
		const settle = (release) => {
			signal?.removeEventListener("abort", cancel);
			resolve(release);
		};
		const cancel = () => {
			const index = admission.waiters.indexOf(settle);
			if (index < 0) return;
			admission.waiters.splice(index, 1);
			settle(null);
			dispatchWaiters(state);
		};
		admission.waiters.push(settle);
		signal?.addEventListener("abort", cancel, { once: true });
		if (signal?.aborted) cancel();
	});
}
/** Wake queued work on stop so each caller can release its durable reservation. */
function cancelCronRunAdmissionWaiters(state) {
	state.runAdmission.capacityListener = null;
	const waiters = state.runAdmission.waiters.splice(0);
	for (const waiter of waiters) waiter(null);
}
/** Apply one service-level cap to every cron execution source. Queue waiters
* keep their job reservation, then recheck scheduler state before execution.
*/
async function runWithCronAdmission(state, execute, acquiredRelease, signal) {
	const release = acquiredRelease ?? await acquireCronRunAdmission(state, signal);
	if (!release) return { kind: "stopped" };
	try {
		return {
			kind: "admitted",
			value: await execute()
		};
	} finally {
		release();
	}
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
	if (opts?.publish !== false) publishCronRuntimeRows(state);
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
/** Publishes scheduled-row changes after a targeted runtime transaction commits. */
function publishCronRuntimeRows(state) {
	if (!state.store) return;
	publishDurableNextRunChanges({
		state,
		storeJobs: state.store.jobs
	});
}
//#endregion
//#region src/cron/service/wake.ts
/** Manual cron wake helper for queueing system events into sessions. */
/** Keeps safety notices with their creator and limits failure routes to explicit origins. */
function enqueueCronNotification(state, job, text, kind, routing) {
	const owner = resolveCronNotificationQueueOwner(job, kind);
	const { sessionKey } = owner;
	const agentId = owner.agentId ?? normalizeOptionalAgentId(routing.defaultAgentId);
	if (!agentId) throw new Error(CRON_AGENT_SELECTION_REQUIRED_MESSAGE);
	const deliveryContext = sessionKey || kind === "auto-disabled" && agentId ? state.deps.resolveOriginDeliveryContext?.({
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
function wake(state, opts) {
	const text = opts.text.trim();
	if (!text) return { ok: false };
	const sessionKey = opts.sessionKey?.trim() || void 0;
	const agentId = opts.agentId?.trim() || void 0;
	if (sessionKey && isSubagentSessionKey(sessionKey)) return {
		ok: false,
		reason: "unwakeable-session-key"
	};
	const originDeliveryContext = sessionKey || agentId ? state.deps.resolveOriginDeliveryContext?.({
		sessionKey,
		agentId
	}) : void 0;
	const enqueueOpts = sessionKey || agentId ? {
		...sessionKey ? { sessionKey } : {},
		...agentId ? { agentId } : {},
		...originDeliveryContext ? { deliveryContext: originDeliveryContext } : {}
	} : void 0;
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
function dispatchCronNotification(state, notification) {
	if (notification.kind === "failure-repair") {
		requestFailureRepair(state, notification);
		return;
	}
	let routing = notification.routing ? { ...notification.routing } : void 0;
	if (!routing) routing = (notification.kind === "failure-alert" && state.deps.sendCronFailureAlert ? Boolean(notification.job.agentId?.trim()) : Boolean(resolveCronNotificationQueueOwner(notification.job, notification.kind).agentId)) ? {} : captureCronNotificationRouting(state.deps.resolveDefaultAgentId?.(), state.deps.defaultAgentId);
	if (notification.kind === "auto-disabled") enqueueCronNotification(state, notification.job, notification.text, notification.kind, routing);
	else transportFailureAlert(state, notification, routing);
}
/**
* Starts the repair turn in the conversation that owns the job. A lost request needs no
* fallback here: the incident records it, so the job's next failure sends the normal alert.
*/
function requestFailureRepair(state, notification) {
	const jobId = notification.job.id;
	const owner = state.store?.jobs.find((job) => job.id === jobId)?.owner;
	const sessionKey = owner?.sessionKey?.trim();
	const repairId = notification.job.state.lastFailureNotificationId;
	if (!sessionKey || !repairId || !state.deps.runCronFailureRepair) return;
	state.deps.runCronFailureRepair({
		jobId,
		repairId,
		agentId: owner?.agentId,
		sessionKey,
		message: notification.text
	}).catch((err) => {
		state.deps.log.warn({
			jobId,
			err: String(err)
		}, "cron: failure repair request failed");
	});
}
const FAILURE_ALERT_ERROR_MAX_LENGTH = 1e3;
/** Writes one settled transport fact while the exact alert cycle still owns the row. */
async function recordFailureAlertOutcome(state, cycle, outcome) {
	let ownsCycle = false;
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
				prepare(facts) {
					ownsCycle = facts.ownsCycle;
					return {
						value: {},
						assertCurrent() {}
					};
				},
				publish(committed) {
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
		return ownsCycle ? "persistence-failed" : "stale";
	}
}
function transportFailureAlert(state, params, routing) {
	const jobId = params.job.id;
	const alertAtMs = params.job.state.lastFailureAlertAtMs;
	const lifecycleGeneration = state.lifecycleGeneration;
	const notificationId = params.job.state.lastFailureNotificationId;
	const runAtMs = params.job.state.lastRunAtMs;
	if (!state.deps.sendCronFailureAlert) {
		enqueueCronNotification(state, params.job, params.payload.text ?? "", "failure-alert", routing);
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
			}, outcome) !== "stale" && outcome.status === "not-delivered") enqueueCronNotification(state, params.job, params.payload.text ?? "", "failure-alert", routing);
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
function invalidateStaleNextRunOnScheduleChange(params) {
	const previousJob = params.previousJobsById.get(params.hydrated.id);
	if (!previousJob || cronSchedulingInputsEqual(previousJob, params.hydrated)) return;
	params.hydrated.state ??= {};
	params.hydrated.state.nextRunAtMs = void 0;
	params.hydrated.state.startupCatchupAtMs = void 0;
	params.hydrated.state.pacedNextRunAtMs = void 0;
	params.hydrated.state.forcePreservedNextRunAtMs = cronSchedulingInputsEqual({
		...previousJob,
		enabled: params.hydrated.enabled
	}, params.hydrated) ? resolveForcePreservedOneShotAtMs(params.hydrated) : void 0;
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
	const previousJobsById = /* @__PURE__ */ new Map();
	for (const job of state.store?.jobs ?? []) previousJobsById.set(job.id, job);
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
		jobs.push(hydrated);
		durableNextRunAtMsByJobId.set(hydrated.id, hydrated.state.nextRunAtMs);
		invalidateStaleNextRunOnScheduleChange({
			previousJobsById,
			hydrated
		});
	}
	state.store = {
		version: 1,
		jobs
	};
	state.durableNextRunAtMsByJobId = durableNextRunAtMsByJobId;
	state.storeLoadedAtMs = loadNowMs;
	loadedCronStoreRevisions.set(state, {
		revision: loadedRevision,
		jobsFingerprint: loaded.jobsFingerprint,
		runtimeFingerprint: loaded.runtimeFingerprint
	});
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
		if (error instanceof CronRunReceiptConflictError || error instanceof CronRunReceiptRevisionError) throw error;
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
function runPostPersistCronNotifications(state, notifications) {
	for (const notification of notifications ?? []) try {
		dispatchCronNotification(state, notification);
	} catch (err) {
		state.deps.log.warn({ error: err instanceof Error ? err.message : String(err) }, "cron: post-persist notification failed");
	}
}
/** Captures the live cron state that must stay aligned with the durable store. */
function snapshotStoreForRollback(state) {
	return {
		store: state.store ? structuredClone(state.store) : null,
		durableNextRunAtMsByJobId: new Map(state.durableNextRunAtMsByJobId)
	};
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
/** Publish a private CRUD draft only after its job and receipt transaction is known committed. */
async function persistCronJobMutation(params) {
	const { state, source } = params;
	assertCronStoreCanPersist(params.next);
	const changes = prepareCronStoreChanges(params.previous, params.next);
	const jobsFingerprint = loadedCronStoreRevisions.get(state)?.jobsFingerprint;
	const runtimeFingerprint = loadedCronStoreRevisions.get(state)?.runtimeFingerprint;
	if (state.deps.cronEnabled && changes.changedIds.size > 0 && (!jobsFingerprint || !runtimeFingerprint)) {
		loadedCronStoreRevisions.set(state, { revision: -1 });
		throw new CronJobsStoreChangedError(source.storeKey);
	}
	const observedRevision = getCronJobsStoreRevision(source.storeKey);
	const markCommitted = captureCronMutationCommit(params.method);
	const quarantine = state.deps.cronEnabled && changes.changedIds.size > 0 && state.pendingQuarantineConfigJobs.length > 0 ? {
		entries: state.pendingQuarantineConfigJobs,
		nowMs: state.deps.nowMs()
	} : void 0;
	let published = false;
	const assertCurrent = () => {
		source.assertCurrent();
		params.assertCurrent?.();
		source.assertCurrent();
	};
	await runCronRuntimeMutation({
		context: source.context,
		type: "cron.mutateJobs",
		input: structuredClone({
			storeKey: source.storeKey,
			changes,
			agentId: params.agentId,
			preconditionJob: params.preconditionJob,
			expectedJob: params.expectedJob,
			receiptMutation: params.receiptMutation,
			replacement: state.deps.cronEnabled && changes.changedIds.size > 0 && jobsFingerprint && runtimeFingerprint ? {
				store: params.next,
				jobsFingerprint,
				runtimeFingerprint,
				options: { quarantine }
			} : void 0
		}),
		assertCurrent,
		prepare(facts) {
			const assertAvailable = () => {
				assertCurrent();
				if (params.agentId !== void 0 && (facts.deletionBlocked || state.deps.isAgentAvailable?.(params.agentId, void 0, facts) === false)) throw new Error(describeUnavailableCronAgent(params.agentId));
			};
			assertAvailable();
			return {
				value: { nowMs: state.deps.nowMs() },
				assertCurrent: assertAvailable
			};
		},
		publish({ store, names, jobsFingerprint: committedJobs, runtimeFingerprint: committedRuntime }) {
			published = true;
			if (changes.changedIds.size > 0) markCommitted?.();
			const unchanged = getCronJobsStoreRevision(source.storeKey) === observedRevision;
			noteCronJobsStoreCommit(source.storeKey);
			if (unchanged) publishCronJobNames(source.storeKey, source.context, names);
			state.store = store;
			state.storeLoadedAtMs = state.deps.nowMs();
			if (quarantine) {
				state.pendingQuarantineConfigJobs = [];
				state.lastQuarantineFailureWarnKey = null;
			}
			loadedCronStoreRevisions.set(state, {
				revision: unchanged ? getCronJobsStoreRevision(source.storeKey) : -1,
				jobsFingerprint: committedJobs,
				runtimeFingerprint: committedRuntime
			});
			try {
				params.afterCommit?.();
			} finally {
				try {
					publishDurableNextRunChanges({
						state,
						storeJobs: store.jobs,
						suppressScheduledJobId: params.suppressScheduledJobId
					});
					runPostPersistCronNotifications(state, params.postPersistNotifications);
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
		onRolledBackMutation(refusal) {
			loadedCronStoreRevisions.set(state, { revision: -1 });
			throw refusal.kind === "receipt-conflict" ? new CronRunReceiptConflictError(refusal.receipt) : new CronJobsStoreChangedError(source.storeKey);
		}
	});
}
//#endregion
//#region src/cron/service/run-admission-mutation.ts
function currentDefaultAgentId(state) {
	return state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
}
async function reserveCronRuns(params) {
	const { state } = params;
	const prospective = [];
	let committed = false;
	let conflict;
	try {
		await runCronRuntimeMutation({
			context: params.context,
			type: "cron.reserveRuns",
			input: {
				storeKey: cronStoreKey(state.deps.storePath),
				proposals: [...params.candidates.values()].map((job) => ({
					jobId: job.id,
					enabled: job.enabled,
					configRevision: resolveCronJobConfigRevision(job),
					nextRunAtMs: job.state.nextRunAtMs,
					lastRunAtMs: job.state.lastRunAtMs,
					lastRunStatus: job.state.lastRunStatus,
					immediate: params.immediateJobIds?.has(job.id) === true
				})),
				reservedAtMs: params.reservedAtMs,
				preserveSchedule: params.preserveSchedule,
				scheduleOwnershipAtMs: params.scheduleOwnershipAtMs,
				onExit: params.onExit
			},
			assertCurrent: params.assertCurrent,
			prepare(facts) {
				const defaultAgentId = currentDefaultAgentId(state);
				const observed = new Map(facts.receipts.map((receipt) => [receipt.jobId, receipt]));
				const owners = new Map([...params.candidates.keys()].map((jobId) => {
					const owner = state.queuedRunReservationsByJobId.get(jobId);
					return [jobId, {
						owner,
						markerAtMs: owner?.markerAtMs,
						lifecycleGeneration: owner?.lifecycleGeneration,
						handle: owner ? { ...owner.runReceipt } : void 0
					}];
				}));
				const claims = [...params.candidates.values()].map((job) => prepareCronRunReceiptClaim({
					storePath: state.deps.storePath,
					job: params.onExit ? {
						...job,
						enabled: false
					} : job,
					agentId: resolveCronJobEffectiveAgentId(job, currentDefaultAgentId(state)),
					startedAtMs: params.reservedAtMs,
					requestRunId: params.requestRunId,
					observed: observed.get(job.id)
				}));
				for (const claim of claims) {
					claimLocalCronRunReceiptOwnership(claim.handle);
					prospective.push(claim.handle);
				}
				return {
					value: {
						defaultAgentId,
						claims,
						replacements: [...owners.values()].flatMap(({ handle }) => handle ? [handle] : [])
					},
					assertCurrent() {
						const currentDefault = currentDefaultAgentId(state);
						for (const claim of claims) if (tryResolveCronJobEffectiveAgentId(params.candidates.get(claim.handle.jobId), currentDefault) !== claim.handle.agentId) throw new Error("Cron job owner changed before reservation");
						for (const [jobId, { owner, markerAtMs, lifecycleGeneration, handle }] of owners) if (state.queuedRunReservationsByJobId.get(jobId) !== owner || owner?.markerAtMs !== markerAtMs || owner?.lifecycleGeneration !== lifecycleGeneration || handle && !exactCronRunReceiptMatches(owner?.runReceipt, handle)) throw new Error("Cron local reservation changed before commit");
						for (const claim of claims) if (claim.observed && claim.observedStale !== isCronRunReceiptOwnerStale(claim.observed, params.reservedAtMs)) throw new Error("Cron receipt liveness changed before reservation commit");
					}
				};
			},
			publish(outcome) {
				committed = true;
				const claimed = new Set(outcome.reservations.map(({ runReceipt }) => runReceipt.receiptId));
				for (const handle of prospective) if (!claimed.has(handle.receiptId)) releaseLocalCronRunReceiptOwnership(handle);
				params.onCommitted(outcome);
				if (outcome.reservations.length > 0) noteCronJobsStoreCommit(cronStoreKey(state.deps.storePath));
			},
			onRolledBackConflict(receipt) {
				conflict = receipt;
			}
		});
		return conflict;
	} finally {
		if (!committed) for (const handle of prospective) releaseLocalCronRunReceiptOwnership(handle);
	}
}
/** Callers hold the partition lock through committed publication and execution handoff. */
async function activateReservedCronRun(params) {
	const { state } = params;
	const reservation = state.queuedRunReservationsByJobId.get(params.job.id);
	if (!reservation || reservation.identity !== params.reservationIdentity) return;
	const markerAtMs = reservation.markerAtMs;
	const runReceipt = reservation.runReceipt;
	const storeKey = cronStoreKey(state.deps.storePath);
	const context = reservation.runReceiptContext;
	let activation;
	await runCronRuntimeMutation({
		context,
		type: "cron.activateRun",
		input: {
			storeKey,
			handle: { ...runReceipt },
			startedAtMs: params.startedAtMs,
			onExitSchedule: params.onExitSchedule ? { ...params.onExitSchedule } : void 0
		},
		assertCurrent() {
			params.commitGuard?.();
			if (state.queuedRunReservationsByJobId.get(params.job.id) !== reservation || reservation.markerAtMs !== markerAtMs || reservation.runReceipt !== runReceipt) throw new CronRunReceiptRevisionError(runReceipt.receiptId, "cron reservation changed before activation");
		},
		prepare() {
			const defaultAgentId = currentDefaultAgentId(state);
			return {
				value: {
					markerAtMs,
					defaultAgentId
				},
				assertCurrent() {
					if (currentDefaultAgentId(state) !== defaultAgentId) throw new CronRunReceiptRevisionError(runReceipt.receiptId);
				}
			};
		},
		publish(committed) {
			activation = committed.activation;
			if (!activation) return;
			noteCronJobsStoreCommit(storeKey);
			applyCronRuntimeRowsToState(state, [activation.job]);
			reservation.markerAtMs = params.startedAtMs;
			reservation.runReceipt = activation.receipt;
			reservation.activationPreviousLastError = { value: activation.previousLastError };
		}
	});
	return activation;
}
async function releaseReservedCronRuns(params) {
	const { state, context } = params;
	const storeKey = params.storeKey ?? cronStoreKey(state.deps.storePath);
	const selections = params.reservations.map(({ jobId, reservationIdentity }) => ({
		jobId,
		reservationIdentity
	}));
	const policy = params.policy ? structuredClone(params.policy) : {
		kind: "general",
		restoreLastError: params.restoreLastError !== false,
		recompute: params.recompute === true,
		terminal: params.terminal ? structuredClone(params.terminal) : void 0,
		requireCurrentReceipt: params.requireCurrentReceipt
	};
	const terminal = policy.kind === "general" ? policy.terminal : void 0;
	const requireCurrentReceipt = policy.kind === "general" && policy.requireCurrentReceipt;
	const retained = terminal ? retainCronRunReceiptSettlement(terminal.handle) : void 0;
	try {
		await runCronRuntimeMutation({
			context,
			type: "cron.releaseReservations",
			input: {
				storeKey,
				jobIds: selections.map(({ jobId }) => jobId),
				policy
			},
			assertCurrent() {
				params.assertCurrent?.();
				if (cronStoreKey(state.deps.storePath) !== storeKey) throw new Error("Cron reservation store changed before cleanup");
				retained?.assertCurrent();
				for (const { jobId, reservationIdentity } of selections) {
					const owner = state.queuedRunReservationsByJobId.get(jobId);
					if (owner?.identity !== reservationIdentity) continue;
					const admission = owner.runReceiptContext.admission;
					admission.assertCurrent();
					if (owner.runReceipt.storeKey !== storeKey || admission.identity.key !== context.admission.identity.key || admission.identity.birthtime !== context.admission.identity.birthtime) throw new Error("Cron reservation cleanup spans different database owners");
				}
			},
			prepare(facts) {
				const defaultAgentId = policy.kind === "general" ? currentDefaultAgentId(state) : void 0;
				const notifications = prepareCronNotificationRouting(state.deps, facts.notificationNeedsDefault);
				const owners = selections.map((reservation) => ({
					...reservation,
					owner: state.queuedRunReservationsByJobId.get(reservation.jobId)
				})).filter(({ owner, reservationIdentity }) => owner?.identity === reservationIdentity);
				const reservations = owners.map(({ jobId, owner }) => ({
					jobId,
					markerAtMs: owner.markerAtMs,
					runReceipt: { ...owner.runReceipt },
					activationPreviousLastError: owner.activationPreviousLastError ? { ...owner.activationPreviousLastError } : void 0
				}));
				const assertAvailable = () => {
					if (requireCurrentReceipt && terminal && (facts.deletionBlocked || state.deps.isAgentAvailable?.(terminal.handle.agentId, void 0, facts) === false)) throw new CronRunReceiptRevisionError(terminal.handle.receiptId, describeUnavailableCronAgent(terminal.handle.agentId), "owner-unavailable");
				};
				assertAvailable();
				return {
					value: {
						nowMs: params.nowMs ?? state.deps.nowMs(),
						defaultAgentId,
						notificationRouting: notifications.routing,
						reservations,
						deferTerminal: retained?.pending === true
					},
					assertCurrent() {
						assertAvailable();
						notifications.assertCurrent();
						if (policy.kind === "general" && currentDefaultAgentId(state) !== defaultAgentId) throw new Error("Cron default owner changed before cleanup");
						for (const [index, { jobId, owner }] of owners.entries()) {
							const prepared = reservations[index];
							if (state.queuedRunReservationsByJobId.get(jobId) !== owner || owner?.markerAtMs !== prepared.markerAtMs || !exactCronRunReceiptMatches(owner.runReceipt, prepared.runReceipt)) throw new Error("Cron reservation ownership changed before cleanup");
						}
					}
				};
			},
			publish(committed) {
				if (terminal && retained?.pending) retained.deferFinish(terminal, context);
				if (committed.jobs.length > 0) noteCronJobsStoreCommit(storeKey);
				try {
					runPostPersistCronNotifications(state, committed.notifications);
					applyCronRuntimeRowsToState(state, committed.jobs);
					for (const entry of committed.logs) state.deps.log[entry.level](entry.fields, entry.message);
				} finally {
					releaseReservationOwnership(state, selections);
				}
			},
			onSettled(outcome) {
				if (outcome === "unknown") releaseReservationOwnership(state, selections);
				params.onSettled(outcome);
			}
		});
	} finally {
		retained?.release();
	}
}
/** Release exact local identities only after accepted work has settled. */
function releaseReservationOwnership(state, reservations) {
	for (const reservation of reservations) {
		const ownership = state.queuedRunReservationsByJobId.get(reservation.jobId);
		if (ownership?.identity !== reservation.reservationIdentity) continue;
		releaseLocalCronRunReceiptOwnership(ownership.runReceipt);
		state.queuedRunReservationsByJobId.delete(reservation.jobId);
	}
}
//#endregion
//#region src/cron/service/schedule-maintenance.ts
/** Keep host activity and exact local reservations current while a worker owns its rows. */
function prepareCronScheduleOwnership(state, jobIds) {
	const owners = jobIds.map((jobId) => ({
		jobId,
		active: isCronJobActive(jobId),
		reservation: state.queuedRunReservationsByJobId.get(jobId)
	}));
	const ownership = owners.map(({ jobId, active, reservation }) => ({
		jobId,
		active,
		reservation: reservation ? {
			markerAtMs: reservation.markerAtMs,
			preserveWhenDisabled: reservation.preserveWhenDisabled
		} : void 0
	}));
	return {
		ownership,
		assertCurrent() {
			for (let index = 0; index < owners.length; index += 1) {
				const owner = owners[index];
				const prepared = ownership[index];
				const current = state.queuedRunReservationsByJobId.get(owner.jobId);
				if (owner.active !== isCronJobActive(owner.jobId) || current !== owner.reservation || current?.markerAtMs !== prepared.reservation?.markerAtMs || current?.preserveWhenDisabled !== prepared.reservation?.preserveWhenDisabled) throw new Error("Cron schedule ownership changed before commit");
			}
		}
	};
}
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
		prepare({ jobIds }) {
			const prepared = prepareCronScheduleOwnership(state, jobIds);
			return {
				value: {
					nowMs: opts?.nowMs ?? state.deps.nowMs(),
					ownership: prepared.ownership
				},
				assertCurrent: () => prepared.assertCurrent()
			};
		},
		publish(committed) {
			outcome = committed;
			if (committed.changed) noteCronJobsStoreCommit(storeKey);
			applyCronRuntimeRowsToState(state, committed.jobs);
			runPostPersistCronNotifications(state, committed.notifications);
			for (const entry of committed.logs) state.deps.log[entry.level](entry.fields, entry.message);
		}
	});
	if (!outcome) throw new Error("Cron schedule maintenance did not publish its committed rows");
	return outcome;
}
//#endregion
//#region src/cron/service/scheduler-mutations.ts
/** History and other effects run after the native scope joins, including a lost committed reply. */
async function recordSkippedCronRuns(params) {
	const { state, source } = params;
	const change = structuredClone(params.change);
	let committed;
	let historySource;
	let failure;
	try {
		await runCronRuntimeMutation({
			context: source.context,
			type: "cron.recordSkippedRuns",
			input: {
				storeKey: source.storeKey,
				change
			},
			assertCurrent() {
				source.assertCurrent();
				params.assertCurrent?.();
			},
			prepare({ jobs }) {
				const prepared = prepareCronScheduleOwnership(state, jobs.map(({ id }) => id));
				const defaultAgentId = state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
				const effectiveDefaultAgentId = defaultAgentId ?? state.deps.defaultAgentId;
				const notificationRouting = captureCronNotificationRouting(defaultAgentId, state.deps.defaultAgentId);
				const assertRoutingCurrent = () => {
					source.assertStorageCurrent();
					const currentDefault = state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
					if (currentDefault !== defaultAgentId || (currentDefault ?? state.deps.defaultAgentId) !== effectiveDefaultAgentId || captureCronNotificationRouting(currentDefault, state.deps.defaultAgentId).defaultAgentId !== notificationRouting.defaultAgentId) throw new Error("Cron skipped-run owner changed before completion");
				};
				historySource = {
					...source,
					defaultAgentId: effectiveDefaultAgentId,
					assertCurrent: () => source.assertStorageCurrent()
				};
				const cronConfig = structuredClone(state.deps.cronConfig);
				const failureAlerts = jobs.map((job) => ({
					jobId: job.id,
					value: resolveFailureAlert({ deps: { cronConfig } }, job)
				}));
				return {
					value: {
						nowMs: params.nowMs,
						defaultAgentId,
						notificationRouting,
						cronConfig,
						ownership: prepared.ownership,
						failureAlerts
					},
					assertCurrent() {
						assertRoutingCurrent();
						prepared.assertCurrent();
						if (!isDeepStrictEqual(cronConfig, state.deps.cronConfig) || jobs.some((job, index) => !isDeepStrictEqual(failureAlerts[index]?.value, resolveFailureAlert(state, job)))) throw new Error("Cron skipped-run policy changed before commit");
					}
				};
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
		if (!historySource) throw new Error("Cron skipped run lost its original history source");
		historySource.assertCurrent();
		await params.afterCommit(committed, historySource);
	} catch (error) {
		failure ??= { error };
	}
	if (failure) throw failure.error;
	if (!committed) throw new Error("Cron skipped run did not publish its committed outcome");
}
async function planCronStartup(params) {
	const { state, source } = params;
	let committed;
	let failure;
	try {
		await runCronRuntimeMutation({
			context: source.context,
			type: "cron.planStartup",
			input: {
				storeKey: source.storeKey,
				jobIds: [...params.jobIds],
				skipJobIds: params.skipJobIds ? [...params.skipJobIds] : void 0
			},
			assertCurrent: () => source.assertCurrent(),
			prepare({ jobIds, notificationNeedsDefault }) {
				const prepared = prepareCronScheduleOwnership(state, jobIds);
				const skipMissedJobs = state.deps.cronConfig?.skipMissedJobs === true;
				const notifications = prepareCronNotificationRouting(state.deps, skipMissedJobs && notificationNeedsDefault);
				return {
					value: {
						nowMs: params.nowMs,
						skipMissedJobs,
						ownership: prepared.ownership,
						notificationRouting: notifications.routing
					},
					assertCurrent() {
						source.assertCurrent();
						prepared.assertCurrent();
						notifications.assertCurrent();
						if (state.deps.cronConfig?.skipMissedJobs === true !== skipMissedJobs) throw new Error("Cron missed-job policy changed before commit");
					}
				};
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
		source.assertStorageCurrent();
		for (const notification of committed.notifications) {
			source.assertStorageCurrent();
			runPostPersistCronNotifications(state, [notification]);
		}
		source.assertStorageCurrent();
		applyCronRuntimeRowsToState(state, committed.jobs);
		for (const entry of committed.logs) state.deps.log[entry.level](entry.fields, entry.message);
		if (committed.skippedJobIds.length > 0) state.deps.log.info({
			count: committed.skippedJobIds.length,
			jobIds: committed.skippedJobIds
		}, "cron: skipped missed recurring jobs after restart");
	} catch (error) {
		failure ??= { error };
	}
	if (failure) throw failure.error;
	if (!committed) throw new Error("Cron startup planning did not publish its committed outcome");
	return committed.missed;
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
		assertCurrent: () => (opts?.manualRun?.commitGuard ?? opts?.manualRun?.onExit?.commitGuard)?.(),
		async afterCommit(skipped, historySource) {
			applyCronRuntimeRowsToState(state, skipped.jobs);
			for (const entry of skipped.logs) state.deps.log[entry.level](entry.fields, entry.message);
			for (const job of skipped.jobs) {
				historySource.assertCurrent();
				state.deps.log.warn({
					jobId: job.id,
					error: CRON_AGENT_SELECTION_REQUIRED_MESSAGE
				}, "cron: skipping job with unresolved owner");
				await emitOwnerlessFinished(state, job, nowMs, historySource, opts?.manualRun);
			}
			if (opts?.manualRun) for (const job of skipped.rejected) {
				historySource.assertCurrent();
				await emitOwnerlessFinished(state, job, nowMs, historySource, opts.manualRun);
			}
			for (const notification of skipped.notifications) {
				historySource.assertCurrent();
				runPostPersistCronNotifications(state, [notification]);
			}
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
	historySource.assertCurrent();
	emit(state, event);
	if (manualRun?.terminalTracker) manualRun.terminalTracker.emitted = true;
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
	const reservation = state.queuedRunReservationsByJobId.get(handle.jobId);
	const defaultAgentId = () => state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId;
	const admittedDefaultAgentId = defaultAgentId();
	let preparedAgentFacts;
	const allowMissingJob = () => activeJobMarker?.jobId === handle.jobId && isCronSelfRemovalCurrent(activeJobMarker);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		signal.throwIfAborted();
		if (preparedAgentFacts && state.deps.isAgentAvailable?.(handle.agentId, void 0, preparedAgentFacts) === false) throw new CronRunReceiptRevisionError(handle.receiptId, describeUnavailableCronAgent(handle.agentId), "owner-unavailable");
		if (state.lifecycleGeneration !== generation || !reservation || state.queuedRunReservationsByJobId.get(handle.jobId) !== reservation || reservation.runReceipt.receiptId !== handle.receiptId || !isCronActiveJobMarkerCurrent(activeJobMarker) || activeJobMarker?.cancellation?.kind === "requested" || activeJobMarker?.jobRemoved && !allowMissingJob() || !params.job.agentId?.trim() && defaultAgentId() !== admittedDefaultAgentId) throw new CronRunReceiptRevisionError(handle.receiptId, "cron delivery owner retired");
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
					prepare(facts) {
						preparedAgentFacts = facts;
						const missingJobAllowed = allowMissingJob();
						const assertPreparedCurrent = () => {
							assertCurrent();
							if (facts.deletionBlocked || state.deps.isAgentAvailable?.(handle.agentId, void 0, facts) === false) throw new CronRunReceiptRevisionError(handle.receiptId, describeUnavailableCronAgent(handle.agentId), "owner-unavailable");
							if (allowMissingJob() !== missingJobAllowed) throw new CronRunReceiptRevisionError(handle.receiptId);
						};
						assertPreparedCurrent();
						return {
							value: {
								allowMissingJob: missingJobAllowed,
								defaultAgentId: admittedDefaultAgentId
							},
							assertCurrent: assertPreparedCurrent
						};
					},
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
		error: abortErrorMessage(abortSignal)
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
		const currentKey = job.schedule.kind === "stream" ? cronStreamScheduleKey(job.schedule) : void 0;
		if (options.streamScheduleKey === void 0 || options.streamSourceIdentity === void 0 || currentKey !== options.streamScheduleKey || job.state.streamSourceIdentity !== options.streamSourceIdentity) return {
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
			error: options.activeJobMarker.cancellation.reason
		};
		if (abortSignal?.aborted) return resolveAbortError();
		if (!isCronActiveJobMarkerCurrent(options.activeJobMarker)) return {
			status: "error",
			error: "Gateway restarting."
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
		const releaseHeartbeatWait = markCronJobWaitingForHeartbeat(options?.activeJobMarker, options?.owningCronLaneTaskMarker);
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
		const result = await executeMainSessionCronJob(state, effectiveJob, abortSignal, options?.onHeartbeatExecutionStarted, options?.activeJobMarker, options?.owningCronLaneTaskMarker);
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
async function executeMainSessionCronJob(state, job, abortSignal, onHeartbeatExecutionStarted, activeJobMarker, owningCronLaneTaskMarker) {
	const text = job.payload.kind === "systemEvent" && typeof job.payload.text === "string" ? job.payload.text.trim() : void 0;
	if (!text) return {
		status: "skipped",
		error: job.payload.kind === "systemEvent" ? "main job requires non-empty systemEvent text" : "main job requires payload.kind=\"systemEvent\""
	};
	const agentId = resolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId);
	const deliveryContext = resolveMainSessionCronDeliveryContext(state, job);
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
		const releaseHeartbeatWait = markCronJobWaitingForHeartbeat(activeJobMarker, owningCronLaneTaskMarker);
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
				error: timeoutErrorMessage()
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
			error: timeoutErrorMessage()
		};
	}
	state.deps.requestHeartbeat(heartbeatWake);
	return {
		status: "ok",
		summary: text
	};
}
async function executeDetachedCronJob(state, job, abortSignal, options) {
	const interrupted = () => {
		const error = abortErrorMessage(abortSignal);
		return {
			status: "error",
			error,
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
		admissionSource: job.owner?.sessionKey || job.owner?.accountId || job.scheduledToolPolicy?.mode === "account" || job.payload.externalContentSource || job.toolsAllowProvenance?.channelRequester || job.toolsAllowProvenance && job.toolsAllowProvenance.callerOrigin?.kind !== "local" ? "requester-schedule" : "operator-schedule",
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
		error: "Gateway restarting."
	};
	if (abortSignal?.aborted) return {
		status: "error",
		error: abortErrorMessage(abortSignal)
	};
	if (options?.assertRunCurrent) {
		await options.assertRunCurrent();
		if (options.activeJobMarker?.cancellation?.kind === "requested") return {
			status: "error",
			error: options.activeJobMarker.cancellation.reason
		};
		if (!isCronActiveJobMarkerCurrent(options.activeJobMarker)) return {
			status: "error",
			error: "Gateway restarting."
		};
		if (abortSignal?.aborted) return {
			status: "error",
			error: abortErrorMessage(abortSignal)
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
		const deliveryContext = job.sessionTarget === "main" ? resolveMainSessionCronDeliveryContext(state, job) : void 0;
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
	return resolveCronDeliveryPlan(params.job).mode === "webhook" && params.result.triggerEval?.fired !== false ? withPrimaryWebhookTrace({
		...params,
		outcome: params.outcome ?? { status: "not-delivered" }
	}) : params.result;
}
function resolveInterruptedRunProgress(params) {
	if (params.progress.settledDeliveryResult) return params.progress.settledDeliveryResult;
	if (params.progress.completedCoreResult) return withPrimaryWebhookInterruption({
		job: params.job,
		result: params.progress.completedCoreResult,
		outcome: params.progress.webhookDelivery,
		error: params.error
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
	if (abortSignal.aborted) return undelivered(interruptionError());
	if (assertRunCurrent) {
		await assertRunCurrent();
		if (activeJobMarker?.cancellation?.kind === "requested") return undelivered(`cron webhook delivery cancelled: ${activeJobMarker.cancellation.reason}`);
		if (!isCronActiveJobMarkerCurrent(activeJobMarker)) return undelivered("Gateway restarting.");
		if (abortSignal.aborted) return undelivered(interruptionError());
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
			error: interruptionError()
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
	const receiptSource = opts?.runReceipt ? {
		handle: opts.runReceipt,
		context: opts.runReceiptContext
	} : void 0;
	const assertRunCurrent = receiptSource ? () => assertServiceCronRunReceiptCurrent(state, receiptSource.handle, opts?.activeJobMarker, receiptSource.context, runAbortController.signal) : void 0;
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
		const settled = resolveInterruptedRunProgress({
			progress,
			job,
			error: deliveryError
		});
		if (settled) return settled;
		if (interruption !== "cancelled") {
			await settleTimedOutCronRun(state, job, interruption.timeoutMs, execution, commandSettlement);
			if (commandSettlement) {
				const settledAfterCleanup = resolveInterruptedRunProgress({
					progress,
					job,
					error: deliveryError
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
	const reservation = opts?.runReceipt ? state.queuedRunReservationsByJobId.get(job.id) : void 0;
	if (!isCronActiveJobMarkerCurrent(opts?.activeJobMarker) || opts?.runReceipt && (reservation?.runReceipt.receiptId !== opts.runReceipt.receiptId || reservation.lifecycleGeneration !== state.lifecycleGeneration)) {
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
			owningCronLaneTaskMarker: opts?.owningCronLaneTaskMarker,
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
		const runPromise = corePromise.then(async (result) => {
			progress.completedCoreResult = result;
			return await deliverPrimaryWebhook(state, job, result, runAbortController.signal, progress, assertRunCurrent, opts?.activeJobMarker, deliveryAttemptFence);
		});
		if (opts?.runReceipt) trackServiceCronRunReceiptSettlement({
			state,
			handle: opts.runReceipt,
			settlement: runPromise
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
//#region src/cron/service/run-admission.ts
function matchesOnExitSchedule(job, schedule) {
	return job.schedule.kind === "on-exit" && job.schedule.command === schedule.command && job.schedule.cwd === schedule.cwd;
}
/** Track a persisted marker through shared admission and payload execution. */
function reserveQueuedCronRun(state, jobId, reservationAt, opts) {
	const identity = {};
	state.queuedRunReservationsByJobId.set(jobId, {
		identity,
		lifecycleGeneration: opts.lifecycleGeneration ?? state.lifecycleGeneration,
		markerAtMs: reservationAt,
		runReceipt: opts.runReceipt,
		runReceiptContext: opts.runReceiptContext,
		preserveWhenDisabled: opts?.preserveWhenDisabled === true,
		...opts.onExit ? { onExit: true } : {}
	});
	return identity;
}
function releaseQueuedCronRun(state, jobId, identity) {
	if (state.queuedRunReservationsByJobId.get(jobId)?.identity !== identity) return false;
	state.queuedRunReservationsByJobId.delete(jobId);
	return true;
}
function isQueuedCronRunReservationCurrent(state, jobId, identity) {
	const reservation = state.queuedRunReservationsByJobId.get(jobId);
	return reservation?.identity === identity && reservation.lifecycleGeneration === state.lifecycleGeneration;
}
/** Clears exact reservations through the worker, retrying only a known non-commit. */
async function cleanupQueuedCronRunReservations(params) {
	const { state, reservations } = params;
	const context = params.context ?? reservations.map(({ jobId, reservationIdentity }) => {
		const owner = state.queuedRunReservationsByJobId.get(jobId);
		return owner?.identity === reservationIdentity ? owner.runReceiptContext : void 0;
	}).find((candidate) => candidate !== void 0);
	if (!context) {
		if (params.terminal) throw new Error("Cron reservation terminalization lost its original receipt context");
		return;
	}
	let retrySafe = false;
	const attempt = () => locked(state, async () => {
		retrySafe = false;
		await releaseReservedCronRuns({
			...params,
			context,
			recompute: params.recompute !== void 0,
			onSettled: (outcome) => {
				retrySafe = outcome === "not-committed";
			}
		});
	});
	try {
		await attempt();
	} catch (error) {
		try {
			if (!retrySafe) throw error;
			await attempt();
		} catch (failure) {
			releaseReservationOwnership(state, reservations);
			throw failure;
		}
	}
}
/** Supersedes one activated run and releases only its exact durable marker.
* Receipt terminalization shares the marker transaction, so no successor can
* enter between dropping the fence and repairing scheduling state. */
async function supersedeActivatedCronRun(params) {
	try {
		await cleanupQueuedCronRunReservations({
			state: params.state,
			context: params.runReceiptContext,
			reservations: [params],
			recompute: "maintenance",
			terminal: {
				handle: params.runReceipt,
				status: "superseded",
				finishedAtMs: params.state.deps.nowMs(),
				error: params.reason
			}
		});
	} finally {
		releaseLocalCronRunReceiptOwnership(params.runReceipt);
	}
}
/** Persists queued markers only while no gateway owns an active run receipt.
* Each retry re-reads and updates only pending rows, so excluded foreign jobs
* can advance without a stale full-store snapshot overwriting their state.
*/
async function persistQueuedCronRunReservations(params) {
	const generation = params.state.lifecycleGeneration;
	if (params.state.stopped) return [];
	const source = params.source ?? captureCronServiceMutationSource(params.state);
	const candidates = await skipCronJobsWithoutOwners(params.state, [...params.candidates], params.reservedAtMs, {
		source,
		...params.scheduleMode ? { scheduleMode: params.scheduleMode } : {},
		...params.manualRun ? { manualRun: params.manualRun } : {}
	});
	if (params.state.stopped || params.state.lifecycleGeneration !== generation) return [];
	source.assertCurrent();
	const pendingJobs = new Map(candidates.map((job) => [job.id, structuredClone(job)]));
	if (pendingJobs.size === 0) {
		await ensureLoaded(params.state, { forceReload: true });
		return [];
	}
	const context = source.context;
	const storeKey = source.storeKey;
	const retired = () => params.state.stopped || params.state.lifecycleGeneration !== generation;
	const retiredError = /* @__PURE__ */ new Error("Cron service stopped before run reservation");
	const assertCurrent = () => {
		context.admission.assertCurrent();
		if (cronStoreKey(params.state.deps.storePath) !== storeKey) throw new Error("Cron reservation store changed before commit");
		if (retired()) throw retiredError;
		(params.manualRun?.commitGuard ?? params.manualRun?.onExit?.commitGuard)?.();
		if (retired()) throw retiredError;
	};
	const cleanupUnhandedReservations = async (committed) => {
		const reservations = committed.map(({ job, runReceipt }) => {
			const existing = params.state.queuedRunReservationsByJobId.get(job.id);
			return {
				jobId: job.id,
				reservationIdentity: existing?.runReceipt.receiptId === runReceipt.receiptId ? existing.identity : reserveQueuedCronRun(params.state, job.id, params.reservedAtMs, {
					runReceipt,
					runReceiptContext: context,
					lifecycleGeneration: generation
				})
			};
		});
		if (reservations.length === 0) return;
		try {
			await releaseReservedCronRuns({
				state: params.state,
				context,
				reservations,
				recompute: true,
				onSettled() {}
			});
		} finally {
			releaseReservationOwnership(params.state, reservations);
		}
	};
	const markCommitted = params.manualRun ? captureCronMutationCommit("cron.run") : void 0;
	while (pendingJobs.size > 0) {
		let reservationCommitted = false;
		let committedReservations = [];
		try {
			const conflict = await reserveCronRuns({
				state: params.state,
				context,
				candidates: pendingJobs,
				immediateJobIds: params.immediateJobIds,
				reservedAtMs: params.reservedAtMs,
				requestRunId: params.manualRun?.runId,
				preserveSchedule: params.scheduleMode === "preserve",
				scheduleOwnershipAtMs: params.manualRun?.scheduleOwnershipAtMs ?? params.reservedAtMs,
				onExit: params.manualRun?.onExit !== void 0,
				assertCurrent,
				onCommitted(outcome) {
					reservationCommitted = true;
					committedReservations = outcome.reservations.map((reservation) => ({
						...reservation,
						runReceiptContext: context
					}));
					if (committedReservations.length > 0) markCommitted?.();
					for (const receipt of outcome.replacedReceipts) releaseLocalCronRunReceiptOwnership(receipt);
					const first = committedReservations[0];
					if (params.manualRun?.onExit && first) params.manualRun.onExit.onReserved(first.job, first.runReceipt, first.runReceiptContext);
				}
			});
			if (conflict) {
				enrollForeignReceipt(params.state, conflict);
				pendingJobs.delete(conflict.jobId);
				continue;
			}
			const firstReservation = committedReservations[0];
			if (params.manualRun?.onExit && firstReservation) {
				const { job } = firstReservation;
				applyCronRuntimeRowsToState(params.state, [job]);
				emit(params.state, {
					jobId: job.id,
					action: "updated",
					job,
					nextRunAtMs: job.state.nextRunAtMs
				});
				return committedReservations;
			}
			const committedJobs = committedReservations.map(({ job }) => job);
			if (retired()) {
				applyCronRuntimeRowsToState(params.state, committedJobs);
				return committedReservations;
			}
			await ensureLoaded(params.state, { forceReload: true }).catch(() => applyCronRuntimeRowsToState(params.state, committedJobs));
			const receiptByJobId = new Map(committedReservations.map(({ job, runReceipt }) => [job.id, runReceipt]));
			const reloadedReservations = (params.state.store?.jobs ?? []).filter((job) => receiptByJobId.has(job.id)).map((job) => ({
				job,
				runReceipt: receiptByJobId.get(job.id),
				runReceiptContext: context
			}));
			const reloadedJobIds = new Set(reloadedReservations.map(({ job }) => job.id));
			for (const reservation of committedReservations) {
				if (reloadedJobIds.has(reservation.job.id)) continue;
				await finishCronRunReceiptAsync({
					handle: reservation.runReceipt,
					status: "skipped",
					finishedAtMs: params.state.deps.nowMs(),
					error: "cron reservation job disappeared before local handoff"
				}, context);
			}
			context.admission.assertCurrent();
			return reloadedReservations;
		} catch (error) {
			if (reservationCommitted) try {
				await cleanupUnhandedReservations(committedReservations);
			} catch (cleanupError) {
				throw new AggregateError([error, cleanupError], "Cron reservation handoff and cleanup failed", { cause: cleanupError });
			}
			if (error === retiredError) return [];
			throw error;
		}
	}
	await ensureLoaded(params.state, { forceReload: true });
	return [];
}
async function activateQueuedCronRun(params) {
	const { state, job, reservationIdentity } = params;
	const startedAt = state.deps.nowMs();
	const reservation = state.queuedRunReservationsByJobId.get(job.id);
	const runReceipt = reservation?.runReceipt;
	if (!reservation || reservation.identity !== reservationIdentity || !runReceipt) return { kind: "fenced" };
	let activation;
	try {
		activation = await activateReservedCronRun({
			...params,
			startedAtMs: startedAt
		});
	} catch (error) {
		if (!(error instanceof CronRunReceiptRevisionError)) throw error;
	}
	if (!activation) return { kind: "fenced" };
	const { job: activatedJob, receipt: activatedReceipt } = activation;
	if (!state.stopped && reservation.lifecycleGeneration === state.lifecycleGeneration) return {
		kind: "activated",
		job: activatedJob,
		startedAt,
		runReceipt: activatedReceipt,
		runReceiptContext: reservation.runReceiptContext
	};
	params.onUnavailable?.();
	try {
		await releaseReservedCronRuns({
			state,
			context: reservation.runReceiptContext,
			reservations: [{
				jobId: job.id,
				reservationIdentity
			}],
			onSettled() {},
			terminal: {
				handle: activatedReceipt,
				status: "skipped",
				finishedAtMs: state.deps.nowMs(),
				error: "cron service stopped"
			},
			requireCurrentReceipt: true
		});
	} catch (error) {
		await params.onUnavailableRollbackError?.();
		throw error;
	} finally {
		releaseLocalCronRunReceiptOwnership(activatedReceipt);
	}
	releaseQueuedCronRun(state, job.id, reservationIdentity);
	return {
		kind: "unavailable",
		reason: "stopped"
	};
}
async function executeQueuedCronRun(params) {
	const { state } = params;
	const executeAdmitted = async () => {
		const started = await locked(state, async () => {
			await ensureLoaded(state, { forceReload: true });
			if (params.isUnavailable?.() || state.stopped) {
				params.onUnavailable?.();
				return;
			}
			const job = state.store?.jobs.find((entry) => entry.id === params.jobId);
			if (!job || !isQueuedCronRunReservationCurrent(state, params.jobId, params.reservationIdentity) || job.state.queuedAtMs !== params.reservedAtMs) {
				const ownership = state.queuedRunReservationsByJobId.get(params.jobId);
				if (job && ownership?.identity === params.reservationIdentity && job.state.queuedAtMs === params.reservedAtMs) {
					await params.onNotRunnable(job);
					return;
				}
				if (ownership?.identity === params.reservationIdentity) try {
					await finishCronRunReceiptAsync({
						handle: ownership.runReceipt,
						status: "skipped",
						finishedAtMs: state.deps.nowMs(),
						error: "cron reservation fenced by concurrent mutation"
					}, ownership.runReceiptContext);
				} catch {}
				releaseQueuedCronRun(state, params.jobId, params.reservationIdentity);
				return;
			}
			const runnableJob = structuredClone(job);
			delete runnableJob.state.queuedAtMs;
			if (!isRunnableJob({
				job: runnableJob,
				nowMs: state.deps.nowMs(),
				...params.runnableOptions
			})) {
				await params.onNotRunnable(job);
				return;
			}
			const activation = await activateQueuedCronRun({
				state,
				job,
				reservationIdentity: params.reservationIdentity,
				onUnavailable: params.onUnavailable
			});
			if (activation.kind !== "activated") return;
			params.onActivated?.();
			const executionJob = structuredClone(activation.job);
			executionJob.state.runningAtMs = activation.startedAt;
			executionJob.state.lastError = void 0;
			return {
				executionJob,
				taskRun: createCronRunHandle({
					state,
					job: executionJob,
					startedAt: activation.startedAt,
					runReceipt: activation.runReceipt
				}),
				startedAt: activation.startedAt,
				runReceipt: activation.runReceipt,
				runReceiptContext: activation.runReceiptContext,
				activeJobMarker: markServiceCronJobActive(state, activation.job, activation.runReceipt)
			};
		});
		if (!started) return;
		const { executionJob, taskRun, activeJobMarker } = started;
		const taskRunId = taskRun?.runId;
		emit(state, {
			jobId: executionJob.id,
			action: "started",
			job: executionJob,
			runAtMs: started.startedAt
		});
		const base = {
			jobId: params.jobId,
			job: executionJob,
			taskRunId,
			activeJobMarker,
			reservationIdentity: params.reservationIdentity,
			startedAt: started.startedAt,
			runReceipt: started.runReceipt,
			runReceiptContext: started.runReceiptContext
		};
		let outcome;
		try {
			const result = await executeJobCoreWithTimeout(state, executionJob, {
				runId: taskRunId,
				activeJobMarker,
				runReceipt: started.runReceipt,
				runReceiptContext: started.runReceiptContext,
				executionIdentity: createCronOwnerExecutionIdentityAdmission({
					state,
					runReceipt: started.runReceipt
				})
			});
			outcome = {
				...base,
				...result,
				endedAt: state.deps.nowMs()
			};
		} catch (error) {
			const receiptSettlementDisposition = error instanceof CronRunReceiptRevisionError && error.reason === "owner-unavailable" ? "owner-unavailable" : void 0;
			const errorText = error instanceof CronRunReceiptRevisionError ? error.message : normalizeCronRunErrorText(error);
			params.onSetupError?.(executionJob, errorText);
			outcome = {
				...base,
				...authorCronRunCompletion(executionJob, {
					status: "error",
					error: errorText,
					diagnostics: createCronRunDiagnosticsFromError("cron-setup", errorText, { nowMs: state.deps.nowMs })
				}),
				...receiptSettlementDisposition ? { receiptSettlementDisposition } : {},
				endedAt: state.deps.nowMs()
			};
		}
		return {
			outcome,
			handled: await params.onCompleted?.(outcome) === true
		};
	};
	const admission = await runWithCronAdmission(state, executeAdmitted, params.admissionRelease).catch(async (error) => {
		await cleanupQueuedCronRunReservations({
			state,
			reservations: [{
				jobId: params.jobId,
				reservationIdentity: params.reservationIdentity
			}],
			recompute: "maintenance"
		});
		throw error;
	});
	if (admission.kind === "stopped") return { kind: "stopped" };
	if (!admission.value) return { kind: "skipped" };
	return {
		kind: "completed",
		...admission.value
	};
}
//#endregion
//#region src/cron/service/run-recovery-events.ts
async function emitInterruptedCronRun(state, interrupted) {
	const job = state.store?.jobs.find((entry) => entry.id === interrupted.jobId);
	const event = {
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
		runAtMs: interrupted.runAtMs,
		durationMs: interrupted.durationMs,
		nextRunAtMs: job?.state.nextRunAtMs
	};
	await finishCronRun(state, {
		taskRunId: interrupted.taskRunId,
		job,
		event
	});
	emit(state, event);
}
//#endregion
//#region src/cron/service/run-recovery.ts
var RetiredCronRecoveryError = class extends Error {
	constructor() {
		super("Cron recovery owner retired");
	}
};
function recoveryAuthority(state, context, signal, isCurrent) {
	const generation = state.lifecycleGeneration;
	return () => {
		context.admission.assertCurrent();
		if (state.stopped || state.lifecycleGeneration !== generation || signal?.aborted || isCurrent?.() === false) throw new RetiredCronRecoveryError();
	};
}
async function observeRecoveryProposals(state, context, proposals, assertCurrent) {
	if (proposals.length === 0) return [];
	const command = {
		type: "cron.observeRunRecovery",
		storeKey: cronStoreKey(state.deps.storePath),
		proposals
	};
	assertCurrent();
	let result = await executeExistingOpenClawStateRead({}, command);
	assertCurrent();
	if (!result || result.ok && result.type === command.type && result.observation.kind === "schema-uninitialized") {
		const assertSchemaCurrent = () => {
			context.admission.assertCurrent();
			assertCurrent();
		};
		const { createSqliteWorkerWriteAdmission } = await import("./sqlite-worker-store-d0f4y8qR.mjs");
		await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "cron.initializeRunReceipts",
			input: {}
		}), {
			assertCurrent: assertSchemaCurrent,
			createAdmission: createSqliteWorkerWriteAdmission(assertSchemaCurrent, [context.admission.databasePath])
		});
		assertCurrent();
		result = await executeExistingOpenClawStateRead({}, command);
		assertCurrent();
	}
	if (!result?.ok || result.type !== command.type || result.observation.kind !== "observed") throw new Error("Cron recovery observation did not return its admitted receipt snapshot");
	return result.observation.proposals;
}
function observedRecoveryResult(state, proposal, observed) {
	const receipt = observed.receipt;
	if (!receipt) return;
	if (!proposal.receipt || !exactCronRunReceiptMatches(receipt, proposal.receipt)) return {
		kind: "superseded",
		receipt
	};
	return isCronRunReceiptOwnerStale(receipt, state.deps.nowMs()) ? void 0 : {
		kind: "live",
		receipt
	};
}
async function repairRecoveryProposal(state, context, proposal, mode, assertOwnerCurrent, publish) {
	const input = {
		storeKey: cronStoreKey(state.deps.storePath),
		proposal: structuredClone(proposal),
		mode
	};
	let retired = false;
	try {
		await runCronRuntimeMutation({
			context,
			type: "cron.repairRun",
			input,
			assertCurrent() {
				try {
					assertOwnerCurrent();
				} catch (error) {
					retired = error instanceof RetiredCronRecoveryError;
					throw error;
				}
			},
			prepare(routing) {
				if (routing.id !== proposal.jobId) throw new Error("Cron recovery policy differs from its admitted job");
				const receiptIsStale = () => proposal.receipt ? isCronRunReceiptOwnerStale(proposal.receipt, state.deps.nowMs()) : true;
				const cronConfig = structuredClone(state.deps.cronConfig);
				const value = {
					proposedReceiptIsStale: receiptIsStale(),
					nowMs: state.deps.nowMs(),
					cronConfig,
					failureAlert: resolveFailureAlert({ deps: { cronConfig } }, routing)
				};
				return {
					value,
					assertCurrent() {
						if (value.proposedReceiptIsStale !== receiptIsStale() || !isDeepStrictEqual(value.cronConfig, state.deps.cronConfig) || !isDeepStrictEqual(value.failureAlert, resolveFailureAlert(state, routing))) throw new Error("Cron recovery policy or receipt ownership changed before commit");
					}
				};
			},
			publish(outcome) {
				if (outcome.result.kind === "repaired") noteCronJobsStoreCommit(input.storeKey);
				publish(outcome.result);
				for (const entry of outcome.logs) state.deps.log[entry.level](entry.fields, entry.message);
			}
		});
	} catch (error) {
		if (retired) throw new RetiredCronRecoveryError();
		throw error;
	}
}
/** Observe the whole batch before any repair; committed candidates publish before a later await fails. */
async function recoverCronRunProposals(state, targets, options) {
	const context = captureOpenClawStateWorkerContext();
	const assertCurrent = recoveryAuthority(state, context, options.signal, options.isCurrent);
	try {
		const observed = await observeRecoveryProposals(state, context, targets, assertCurrent);
		const repairs = [];
		for (let index = 0; index < observed.length; index += 1) {
			const current = observed[index];
			const target = targets[index];
			const proposal = target.receipt ? target : current;
			const result = observedRecoveryResult(state, proposal, current);
			if (result) options.onRecovery(proposal, result);
			else repairs.push(proposal);
		}
		for (const proposal of repairs) {
			assertCurrent();
			await repairRecoveryProposal(state, context, proposal, options.mode ?? "reclaim", assertCurrent, (result) => options.onRecovery(proposal, result));
		}
	} catch (error) {
		if (!(error instanceof RetiredCronRecoveryError)) throw error;
	}
}
//#endregion
//#region src/cron/session-reaper.ts
/** Prunes expired per-run cron sessions and archives unreferenced transcripts. */
const DEFAULT_RETENTION_MS = 864e5;
/** Minimum interval between reaper sweeps (avoid running every timer tick). */
const MIN_SWEEP_INTERVAL_MS = 3e5;
const lastSweepAtMsByTarget = /* @__PURE__ */ new Map();
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
	const lastSweepAtMs = lastSweepAtMsByTarget.get(targetKey) ?? 0;
	if (now >= lastSweepAtMs && now - lastSweepAtMs < MIN_SWEEP_INTERVAL_MS) return {
		swept: false,
		pruned: 0
	};
	lastSweepAtMsByTarget.set(targetKey, now);
	let pruned = 0;
	let transcriptCleanupError;
	try {
		const context = captureOpenClawStateWorkerContext();
		const assertCurrent = () => assertSubagentReadContext(context);
		if (params.isAgentAvailable?.(params.agentId) === false) {
			params.log.debug({ agentId: params.agentId }, "cron-reaper: skipped unavailable agent");
			return {
				swept: false,
				pruned: 0
			};
		}
		const cutoff = now - retentionMs;
		let pendingMediaSessionKeys;
		const removals = [];
		const expiredEntries = await readExpiredCronRunEntriesInWorker({
			agentId: params.agentId,
			storePath,
			env: context.environment,
			updatedBefore: cutoff
		});
		assertCurrent();
		const continuationKeys = expiredEntries.flatMap(({ sessionKey, entry }) => entry.cronRunContinuation ? [sessionKey] : []);
		const descendants = continuationKeys.length > 0 ? await prepareCronDescendantDeletion(continuationKeys) : void 0;
		try {
			assertCurrent();
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
					descendantRunBasis: descendants?.basis,
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
		} finally {
			descendants?.dispose();
		}
	} catch (err) {
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
	lastSweepAtMsByTarget.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cronSessionReaperTestApi")] = { resetReaperThrottle };
//#endregion
//#region src/cron/service/timer-capacity-recheck.ts
/** Defers a capacity wake until the current batch settles its initial reservations. */
function createCronCapacityRecheckGate(requestRecheck) {
	let pendingActivations = 0;
	let activationsAllowRecheck = true;
	let allowRecheck;
	let requested = false;
	const resolveActivationGate = (allowed) => {
		if (allowRecheck !== void 0) return;
		allowRecheck = allowed;
		if (requested && allowed) requestRecheck();
		requested = false;
	};
	return {
		initializeActivations(count, allowRecheckWhenEmpty = false) {
			pendingActivations = count;
			if (count === 0) resolveActivationGate(allowRecheckWhenEmpty);
		},
		settleActivation(allowed) {
			if (allowRecheck !== void 0) return;
			activationsAllowRecheck &&= allowed;
			pendingActivations -= 1;
			if (pendingActivations === 0) resolveActivationGate(activationsAllowRecheck);
		},
		request() {
			if (allowRecheck === true) requestRecheck();
			else if (allowRecheck === void 0) requested = true;
		},
		abort() {
			resolveActivationGate(false);
		}
	};
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
//#region src/cron/service/run-finalization.ts
/** Parent policy consumes transaction-held rows; the worker commits rows and receipts together. */
async function finalizeCronRuntimeRows(params) {
	const storeKey = cronStoreKey(params.state.deps.storePath);
	const retained = params.receipts.map((receipt) => ({
		receipt,
		settlement: retainCronRunReceiptSettlement(receipt.terminal.handle)
	}));
	const resolveDefaultAgentId = () => params.state.deps.resolveDefaultAgentId ? params.state.deps.resolveDefaultAgentId() : params.state.deps.defaultAgentId;
	let result;
	let committed = false;
	let settlementOutcome;
	const assertSourceCurrent = () => {
		params.context.admission.assertCurrent();
		if (cronStoreKey(params.state.deps.storePath) !== storeKey) throw new Error("Cron finalization store partition changed");
		for (const { receipt, settlement } of retained) {
			receipt.context.admission.assertCurrent();
			if (receipt.context.admission.databasePath !== params.context.admission.databasePath) throw new Error("Cron finalization receipts belong to different physical stores");
			settlement.assertCurrent();
		}
	};
	try {
		await runCronRuntimeMutation({
			context: params.context,
			type: "cron.finalizeRuns",
			input: {
				storeKey,
				jobIds: [...params.jobIds],
				receipts: retained.map(({ receipt }) => ({
					terminal: structuredClone(receipt.terminal),
					allowMissingJob: receipt.allowMissingJob
				}))
			},
			assertCurrent: assertSourceCurrent,
			prepare(facts) {
				const defaultAgentId = resolveDefaultAgentId();
				const receiptFacts = new Map(facts.receipts.map((fact) => [fact.receiptId, fact]));
				const markers = params.markers.map((marker) => ({
					marker,
					jobRemoved: marker?.jobRemoved,
					scheduleMutated: marker?.scheduleMutated,
					triggerMutated: marker?.triggerMutated
				}));
				const assertCurrent = () => {
					assertSourceCurrent();
					if (resolveDefaultAgentId() !== defaultAgentId) throw new Error("Cron finalization default agent changed");
					for (const captured of markers) if (captured.marker?.jobRemoved !== captured.jobRemoved || captured.marker?.scheduleMutated !== captured.scheduleMutated || captured.marker?.triggerMutated !== captured.triggerMutated) throw new Error("Cron finalization policy changed before commit");
					for (const { receipt } of retained) {
						const { handle } = receipt.terminal;
						const fact = receiptFacts.get(handle.receiptId);
						if (!fact) throw new Error("Cron finalization omitted a receipt's authority facts");
						const recordsUnavailableGuard = receipt.terminal.status === "error" && receipt.disposition === "owner-unavailable";
						if ((fact.deletionBlocked || params.state.deps.isAgentAvailable?.(handle.agentId, void 0, fact) === false) && !recordsUnavailableGuard) throw new CronRunReceiptRevisionError(handle.receiptId, describeUnavailableCronAgent(handle.agentId), "owner-unavailable");
					}
					assertSourceCurrent();
				};
				assertCurrent();
				const mutation = params.mutate({
					jobs: new Map(facts.jobs.map((job) => [job.id, job])),
					retiredTriggerReceiptIds: new Set(facts.receipts.filter((fact) => fact.triggerStateRetired).map((fact) => fact.receiptId))
				});
				assertCurrent();
				result = { value: mutation.value };
				return {
					value: {
						defaultAgentId,
						jobs: mutation.jobs,
						deletedJobIds: mutation.deletedJobIds,
						deferredReceiptIds: retained.filter(({ settlement }) => settlement.pending).map(({ receipt }) => receipt.terminal.handle.receiptId)
					},
					assertCurrent
				};
			},
			publish(outcome) {
				committed = true;
				if (outcome.changed) noteCronJobsStoreCommit(storeKey);
				for (const { receipt, settlement } of retained) if (settlement.pending) settlement.deferFinish(receipt.terminal, receipt.context);
			},
			onSettled(outcome) {
				settlementOutcome = outcome;
			},
			onRolledBackReceiptRevision(refusal) {
				if (!retained.some(({ receipt }) => receipt.terminal.handle.receiptId === refusal.receiptId)) throw new Error("Cron finalization refused an unrelated receipt");
				throw new CronRunReceiptRevisionError(refusal.receiptId, refusal.message, refusal.reason);
			}
		});
		if (!committed || !result) throw new Error("Cron finalization did not retain its committed policy result");
		return result.value;
	} catch (error) {
		if (error instanceof CronRunReceiptRevisionError && settlementOutcome !== "not-committed") throw new Error("Cron finalization could not certify an uncommitted receipt refusal", { cause: error });
		throw error;
	} finally {
		for (const { settlement } of retained) settlement.release();
	}
}
//#endregion
//#region src/cron/service/timer-outcome-finalization.ts
/** Finalizes receipts, runtime rows, and active markers for every cron execution. */
/** Coalesces terminal cron writes without holding an execution admission slot. */
function createCompletedCronRunOutcomeDrain(state, opts) {
	const pendingOutcomes = [];
	const finalizedOutcomes = [];
	let drainPromise;
	let drainFailure;
	const startDrain = () => {
		if (drainPromise || pendingOutcomes.length === 0) return;
		drainPromise = Promise.resolve().then(async () => {
			while (pendingOutcomes.length > 0) {
				const completed = pendingOutcomes.splice(0);
				try {
					finalizedOutcomes.push(...await finalizeCompletedCronRunOutcomes(state, completed, opts));
				} catch (error) {
					drainFailure ??= { error };
				}
			}
		}).catch((error) => {
			drainFailure ??= { error };
		}).finally(() => {
			drainPromise = void 0;
			if (pendingOutcomes.length > 0) startDrain();
		});
	};
	return {
		enqueue(outcome) {
			pendingOutcomes.push(outcome);
			startDrain();
		},
		async flush() {
			for (;;) {
				const pendingDrain = drainPromise;
				if (!pendingDrain) break;
				await pendingDrain;
			}
			if (drainFailure) throw drainFailure.error;
			return finalizedOutcomes.splice(0);
		}
	};
}
/** Durably finalizes finished work without waiting for unrelated cron runs. */
async function finalizeCompletedCronRunOutcomes(state, outcomes, opts) {
	if (outcomes.length === 0) return [];
	for (const outcome of outcomes) if (outcome.runReceipt && !outcome.runReceiptContext) throw new Error("Cron finalization lost its original receipt context");
	const context = outcomes.find((outcome) => outcome.runReceiptContext)?.runReceiptContext ?? captureOpenClawStateWorkerContext();
	let finalizedOutcomes = [];
	let finalizationSucceeded = false;
	const emittedRequests = /* @__PURE__ */ new Set();
	const missingRequestedJobs = /* @__PURE__ */ new Set();
	const canPublish = (outcome) => !(state.stopped && opts?.discardWhenStopped) && isCronActiveJobMarkerCurrent(outcome.activeJobMarker);
	try {
		await locked(state, async () => {
			await ensureLoaded(state, { forceReload: true });
			for (const outcome of outcomes) {
				if (outcome.request && (outcome.activeJobMarker?.jobRemoved === true || !state.store?.jobs.some((job) => job.id === outcome.jobId))) {
					missingRequestedJobs.add(outcome);
					continue;
				}
				if (outcome.status !== "ok" || outcome.triggerEval?.fired !== false) {
					const taskJob = structuredClone(state.store?.jobs.find((job) => job.id === outcome.jobId) ?? outcome.job);
					applyOutcomeToAuthoritativeJob(state, taskJob, outcome, {
						request: outcome.request,
						deferredNotifications: []
					});
					await recordCronOutcomeForJob(state, taskJob, outcome);
				}
			}
			finalizedOutcomes = outcomes.filter((outcome) => outcome.runReceipt || canPublish(outcome));
			if (finalizedOutcomes.length === 0) {
				finalizationSucceeded = true;
				return;
			}
			const postPersistNotifications = [];
			const receipts = finalizedOutcomes.flatMap((outcome) => outcome.runReceipt && outcome.runReceiptContext ? [{
				context: outcome.runReceiptContext,
				allowMissingJob: outcome.activeJobMarker?.jobRemoved === true || !state.store?.jobs.some((job) => job.id === outcome.jobId),
				disposition: outcome.receiptSettlementDisposition,
				terminal: {
					handle: outcome.runReceipt,
					status: resolveCronRunReceiptTerminalStatus(outcome.status, outcome.triggerEval?.fired),
					finishedAtMs: outcome.endedAt,
					error: outcome.error
				}
			}] : []);
			const committed = await finalizeCronRuntimeRows({
				state,
				context,
				jobIds: finalizedOutcomes.map((outcome) => outcome.jobId),
				receipts,
				markers: finalizedOutcomes.map((outcome) => outcome.activeJobMarker),
				mutate: ({ jobs, retiredTriggerReceiptIds }) => {
					const upsertedJobs = [];
					const removedJobs = [];
					const eventPlans = [];
					for (const outcome of finalizedOutcomes) {
						const job = jobs.get(outcome.jobId);
						if (!job || outcome.activeJobMarker?.jobRemoved === true) {
							eventPlans.push({ outcome });
							continue;
						}
						if (applyOutcomeToAuthoritativeJob(state, job, outcome, {
							request: outcome.request,
							deferredNotifications: postPersistNotifications,
							triggerStateRetired: outcome.runReceipt && retiredTriggerReceiptIds.has(outcome.runReceipt.receiptId)
						})) removedJobs.push(job);
						else upsertedJobs.push(job);
						eventPlans.push({
							outcome,
							job: structuredClone(job)
						});
					}
					return {
						deletedJobIds: removedJobs.map((job) => job.id),
						jobs: upsertedJobs,
						value: {
							eventPlans,
							removedJobs,
							upsertedJobs
						}
					};
				}
			});
			applyCronRuntimeRowsToState(state, committed.upsertedJobs, committed.removedJobs.map((job) => job.id), { publish: false });
			for (const outcome of finalizedOutcomes) {
				if (outcome.status === "ok" && outcome.triggerEval?.fired === false) await recordQuietCronEvaluation(state, {
					...outcome,
					job: outcome.request?.executionJob ?? outcome.job
				});
				if (!canPublish(outcome)) state.durableNextRunAtMsByJobId.set(outcome.jobId, state.store?.jobs.find((job) => job.id === outcome.jobId)?.state.nextRunAtMs);
			}
			finalizedOutcomes = finalizedOutcomes.filter(canPublish);
			finalizationSucceeded = true;
			if (finalizedOutcomes.length === 0) {
				runPostPersistCronNotifications(state, postPersistNotifications);
				return;
			}
			const publishedJobIds = new Set(finalizedOutcomes.map((outcome) => outcome.jobId));
			for (const plan of committed.eventPlans) {
				if (!publishedJobIds.has(plan.outcome.jobId)) continue;
				if (plan.outcome.request) {
					if (plan.job && !(plan.outcome.status === "ok" && plan.outcome.triggerEval?.fired === false)) {
						await emitCronOutcomeForJob(state, plan.job, plan.outcome);
						emittedRequests.add(plan.outcome);
					}
				} else if (plan.job) emitCronOutcomeEventForJob(state, plan.job, plan.outcome);
				else await applyOutcomeToStoredJob(state, plan.outcome, { deferredNotifications: postPersistNotifications });
			}
			runPostPersistCronNotifications(state, postPersistNotifications);
			for (const removedJob of committed.removedJobs) if (publishedJobIds.has(removedJob.id)) emit(state, {
				jobId: removedJob.id,
				action: "removed",
				job: removedJob
			});
			publishCronRuntimeRows(state);
			try {
				const requestOutcome = finalizedOutcomes.find((outcome) => outcome.request);
				await recomputeUnownedCronSchedules(state, {
					...opts?.repairFutureCronNextRunAtMs === false ? { repairFutureCronNextRunAtMs: false } : {},
					...requestOutcome ? {
						recomputeExpired: true,
						...requestOutcome.request?.preserveCadence ? { preserveExpiredPacedNextRunJobId: requestOutcome.jobId } : {}
					} : {}
				});
			} catch (error) {
				state.deps.log.warn({ err: String(error) }, "cron: post-finalization schedule maintenance failed");
			}
		});
		finalizationSucceeded ||= finalizedOutcomes.length > 0;
		for (const outcome of outcomes) {
			if (!outcome.request) continue;
			const missingJob = outcome.activeJobMarker?.jobRemoved === true || missingRequestedJobs.has(outcome);
			if (finalizedOutcomes.includes(outcome) && canPublish(outcome)) {
				if (!missingJob) maybeNotifyManualIsolatedSetupTimeout(state, {
					jobId: outcome.jobId,
					job: outcome.request.executionJob,
					isolatedAgentSetupTimeout: outcome.isolatedAgentSetupTimeout
				});
				opts?.onRequestedRunFinalized?.();
			}
			if (!emittedRequests.has(outcome)) await emitMissingRequestedCronRunTerminal(state, outcome, missingJob);
		}
		return finalizedOutcomes;
	} catch (error) {
		if (error instanceof CronRunReceiptRevisionError) {
			const stale = outcomes.find((outcome) => outcome.runReceipt?.receiptId === error.receiptId);
			if (stale?.runReceipt) {
				if (!stale.runReceiptContext) throw new Error("Cron supersession lost its original receipt context", { cause: error });
				if (isCronActiveJobMarkerCurrent(stale.activeJobMarker)) {
					if (stale.reservationIdentity) await supersedeActivatedCronRun({
						state,
						jobId: stale.jobId,
						reservationIdentity: stale.reservationIdentity,
						runReceipt: stale.runReceipt,
						runReceiptContext: stale.runReceiptContext,
						reason: error.message
					});
					else await finishCronRunReceiptAsync({
						handle: stale.runReceipt,
						status: "superseded",
						finishedAtMs: state.deps.nowMs(),
						error: error.message
					}, stale.runReceiptContext);
				}
				await emitMissingRequestedCronRunTerminal(state, stale);
				return await finalizeCompletedCronRunOutcomes(state, outcomes.filter((outcome) => outcome !== stale), opts);
			}
		}
		throw error;
	} finally {
		for (const outcome of outcomes) {
			if (outcome.reservationIdentity) releaseQueuedCronRun(state, outcome.jobId, outcome.reservationIdentity);
			if (opts?.clearOnFailure !== false || finalizationSucceeded) {
				if (outcome.request) clearManualCronJobActive(state, outcome.jobId, outcome.activeJobMarker);
				else clearCronJobActive(outcome.jobId, outcome.activeJobMarker);
			}
			if (outcome.runReceipt) releaseLocalCronRunReceiptOwnership(outcome.runReceipt);
		}
	}
}
//#endregion
//#region src/cron/service/timer-scheduler.ts
/** Arms the cron timer for the next wake or a maintenance recheck. */
function armTimer(state) {
	stopTimer(state);
	if (state.stopped || state.schedulingPaused || state.startupCatchup) {
		state.deps.log.debug({}, "cron: armTimer skipped - scheduler stopped");
		return;
	}
	if (!state.deps.cronEnabled) {
		state.deps.log.debug({}, "cron: armTimer skipped - scheduler disabled");
		return;
	}
	const { nextWakeAtMs: nextAt, jobCount, enabledCount } = summarizeCronJobSchedule(state);
	if (!nextAt) {
		const withNextRun = 0;
		if (enabledCount > 0) {
			armRunningRecheckTimer(state);
			state.deps.log.debug({
				jobCount,
				enabledCount,
				withNextRun,
				delayMs: MAX_CRON_TIMER_DELAY_MS
			}, "cron: timer armed for maintenance recheck");
			return;
		}
		state.deps.log.debug({
			jobCount,
			enabledCount,
			withNextRun
		}, "cron: armTimer skipped - no jobs with nextRunAtMs");
		return;
	}
	const now = state.deps.nowMs();
	const delay = Math.max(nextAt - now, 0);
	const clampedDelay = Math.min(delay === 0 ? MIN_REFIRE_GAP_MS : delay, MAX_CRON_TIMER_DELAY_MS);
	setCronTimer(state, clampedDelay);
	state.deps.log.debug({
		nextAt,
		nextAtIso: formatTimestamp(new Date(nextAt), { style: "long" }),
		delayMs: clampedDelay,
		clamped: delay > MAX_CRON_TIMER_DELAY_MS
	}, "cron: timer armed");
}
function armRunningRecheckTimer(state) {
	if (state.stopped || state.schedulingPaused) return;
	setCronTimer(state, MAX_CRON_TIMER_DELAY_MS);
}
function stopTimer(state) {
	state.timer?.cancel();
	state.timer = null;
}
function setCronTimer(state, delayMs) {
	const scheduler = state.schedulerScope;
	state.timer = scheduler.schedule({
		id: `cron:${state.deps.storePath}:due`,
		delayMs,
		run: () => {
			state.timer = null;
			return runInDetachedAsyncContext(() => onTimer(state, scheduler)).catch((err) => {
				state.deps.log.error({ err: String(err) }, "cron: timer tick failed");
			});
		}
	});
}
/** Capacity wakes have their own scoped registration, independent of the current batch. */
function requestImmediateCronRecheck(state, scheduler) {
	if (state.stopped || state.schedulingPaused || !state.deps.cronEnabled || scheduler !== state.schedulerScope || scheduler.signal.aborted) return;
	scheduler.schedule({
		id: `cron:${state.deps.storePath}:capacity`,
		delayMs: 0,
		run: () => runInDetachedAsyncContext(() => onTimer(state, scheduler)).catch((err) => {
			state.deps.log.error({ err: String(err) }, "cron: immediate capacity recheck failed");
		})
	});
}
/** Handles one cron timer tick under the process-wide root work admission. */
async function onTimer(state, scheduler = state.schedulerScope) {
	if (scheduler !== state.schedulerScope || scheduler.signal.aborted) return;
	const lifecycleGeneration = state.lifecycleGeneration;
	let admission;
	try {
		admission = await beginGatewayRootWorkAdmissionWhenOpen("cron:timer-tick", scheduler.signal);
	} catch (err) {
		if (err instanceof GatewayDrainingError || scheduler.signal.aborted && isAbortError(err)) return;
		throw err;
	}
	try {
		if (state.lifecycleGeneration === lifecycleGeneration) {
			const run = () => onAdmittedTimer(state, scheduler);
			await admission.run(() => state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(run) : run());
		}
	} finally {
		admission.release();
	}
}
/** Loads due jobs, reserves them, executes, persists, and re-arms. */
async function onAdmittedTimer(state, scheduler) {
	if (state.stopped || state.schedulingPaused || state.startupCatchup) return;
	const source = captureCronServiceMutationSource(state);
	const generation = state.lifecycleGeneration;
	state.running = true;
	state.activeTimerTicks += 1;
	armRunningRecheckTimer(state);
	const capacityRechecks = createCronCapacityRecheckGate(() => requestImmediateCronRecheck(state, scheduler));
	let allowEmptyCapacityRecheck = false;
	try {
		const dueJobs = await locked(state, async () => {
			await ensureLoaded(state, { forceReload: true });
			if (state.stopped || state.startupCatchup || state.lifecycleGeneration !== generation) {
				state.deps.log.warn({}, "cron: due job reservation skipped - scheduler unavailable");
				return [];
			}
			const proposals = (state.store?.jobs ?? []).filter((job) => job.state.queuedAtMs !== void 0 || job.state.runningAtMs !== void 0).map((job) => ({
				jobId: job.id,
				queuedAtMs: job.state.queuedAtMs,
				runningAtMs: job.state.runningAtMs
			}));
			let repaired = false;
			const interruptedRuns = [];
			try {
				await recoverCronRunProposals(state, proposals, {
					isCurrent: () => !state.startupCatchup && state.lifecycleGeneration === generation,
					onRecovery(_proposal, result) {
						if (result.kind === "repaired") {
							repaired = true;
							runPostPersistCronNotifications(state, result.notifications);
							if (result.interrupted) interruptedRuns.push(result.interrupted);
						} else if (result.receipt && result.receipt.ownerPid !== process.pid) enrollForeignReceipt(state, result.receipt);
					}
				});
			} finally {
				if (repaired) await ensureLoaded(state, { forceReload: true });
				for (const interrupted of interruptedRuns) await emitInterruptedCronRun(state, interrupted);
			}
			if (state.stopped || state.startupCatchup || state.lifecycleGeneration !== generation) return [];
			const dueCheckNow = state.deps.nowMs();
			const due = await skipCronJobsWithoutOwners(state, collectRunnableJobs(state, dueCheckNow), dueCheckNow, { source });
			if (state.stopped || state.startupCatchup || state.lifecycleGeneration !== generation) return [];
			if (due.length === 0) {
				if (!state.store?.jobs.some((job) => needsCronTimerMaintenance(job, dueCheckNow))) return [];
				await recomputeUnownedCronSchedules(state, {
					recomputeExpired: true,
					nowMs: dueCheckNow,
					repairFutureCronNextRunAtMs: state.store.jobs.some((job) => isStaleFutureCronSlot(job, dueCheckNow))
				});
				return [];
			}
			const admissionReleases = tryAcquireCronRunSlots(state, due.length);
			const admittedDue = due.slice(0, admissionReleases.length);
			if (admittedDue.length < due.length) {
				setCronRunCapacityListener(state, admittedDue.length > 0 ? () => capacityRechecks.request() : () => requestImmediateCronRecheck(state, scheduler));
				allowEmptyCapacityRecheck = admittedDue.length > 0;
			}
			if (admittedDue.length === 0) return [];
			const now = state.deps.nowMs();
			try {
				const reservedDue = (await persistQueuedCronRunReservations({
					state,
					source,
					candidates: admittedDue,
					reservedAtMs: now
				})).map(({ job, runReceipt, runReceiptContext }, index) => ({
					id: job.id,
					job,
					reservedAtMs: now,
					reservationIdentity: reserveQueuedCronRun(state, job.id, now, {
						runReceipt,
						runReceiptContext,
						lifecycleGeneration: generation
					}),
					releaseAdmission: admissionReleases[index]
				}));
				if (reservedDue.length === 0 && allowEmptyCapacityRecheck) {
					const stillDue = new Set(collectRunnableJobs(state, state.deps.nowMs()).map((job) => job.id));
					allowEmptyCapacityRecheck = admittedDue.some((job) => !stillDue.has(job.id));
				}
				for (const releaseAdmission of admissionReleases.slice(reservedDue.length)) releaseAdmission();
				return reservedDue;
			} catch (error) {
				for (const releaseAdmission of admissionReleases) releaseAdmission();
				throw error;
			}
		});
		if (state.lifecycleGeneration === generation) {
			if (state.runAdmission.capacityListener) armRunningRecheckTimer(state);
			else armTimer(state);
		}
		const concurrency = Math.min(8, Math.max(1, dueJobs.length));
		capacityRechecks.initializeActivations(dueJobs.length, allowEmptyCapacityRecheck);
		const completedOutcomeDrain = createCompletedCronRunOutcomeDrain(state);
		const claimedIndexes = /* @__PURE__ */ new Set();
		let reservationReleaseError;
		let setupTimeoutNotified = false;
		let stopAdmittingDueJobs = false;
		const releaseUnclaimedDueJobReservationsWithRetry = async () => {
			const unclaimed = dueJobs.filter((_, index) => !claimedIndexes.has(index));
			const reservations = unclaimed.map((due) => ({
				jobId: due.id,
				reservationIdentity: due.reservationIdentity
			}));
			try {
				await cleanupQueuedCronRunReservations({
					state,
					reservations,
					recompute: "maintenance"
				});
			} finally {
				for (const due of unclaimed) due.releaseAdmission();
			}
		};
		if (state.stopped || state.lifecycleGeneration !== generation) {
			capacityRechecks.abort();
			if (dueJobs.length > 0) await releaseUnclaimedDueJobReservationsWithRetry();
			return;
		}
		let completedResults;
		let batchExecutionError;
		try {
			completedResults = await pMap(dueJobs, async (due, index) => {
				let initialActivationSettled = false;
				const settleThisInitialActivation = (allowRecheck) => {
					if (initialActivationSettled) return;
					initialActivationSettled = true;
					capacityRechecks.settleActivation(allowRecheck);
				};
				if (stopAdmittingDueJobs || state.stopped) {
					stopAdmittingDueJobs = true;
					settleThisInitialActivation(false);
					return pMapSkip;
				}
				try {
					const execution = await executeQueuedCronRun({
						state,
						jobId: due.id,
						reservedAtMs: due.reservedAtMs,
						reservationIdentity: due.reservationIdentity,
						admissionRelease: due.releaseAdmission,
						isUnavailable: () => stopAdmittingDueJobs,
						onUnavailable: () => {
							stopAdmittingDueJobs = true;
						},
						onActivated: () => {
							claimedIndexes.add(index);
							settleThisInitialActivation(true);
						},
						onNotRunnable: async () => {
							const owner = state.queuedRunReservationsByJobId.get(due.id);
							if (owner?.identity !== due.reservationIdentity) return;
							await releaseReservedCronRuns({
								state,
								context: owner.runReceiptContext,
								storeKey: owner.runReceipt.storeKey,
								reservations: [{
									jobId: due.id,
									reservationIdentity: due.reservationIdentity
								}],
								policy: { kind: "scheduled-ineligible" },
								onSettled() {}
							});
						},
						onSetupError: (job, errorText) => {
							state.deps.log.warn({
								jobId: due.id,
								jobName: job.name,
								timeoutMs: resolveCronJobTimeoutMs(job) ?? null
							}, `cron: job failed: ${errorText}`);
						},
						onCompleted: async (result) => {
							if (!result.isolatedAgentSetupTimeout) {
								completedOutcomeDrain.enqueue(result);
								return true;
							}
							let finalizedResults;
							try {
								finalizedResults = await finalizeCompletedCronRunOutcomes(state, [result], { clearOnFailure: false });
							} catch {
								return false;
							}
							if (finalizedResults.length > 0 && !setupTimeoutNotified && maybeNotifyIsolatedAgentSetupTimeout(state, result)) {
								setupTimeoutNotified = true;
								stopAdmittingDueJobs = true;
								try {
									await releaseUnclaimedDueJobReservationsWithRetry();
								} catch (err) {
									reservationReleaseError = err;
								}
							}
							return true;
						}
					});
					if (execution.kind === "stopped") {
						stopAdmittingDueJobs = true;
						return pMapSkip;
					}
					if (execution.kind === "skipped") {
						settleThisInitialActivation(!stopAdmittingDueJobs && !state.stopped);
						return pMapSkip;
					}
					if (execution.handled) return pMapSkip;
					return execution.outcome;
				} catch (error) {
					stopAdmittingDueJobs = true;
					batchExecutionError ??= error;
					return pMapSkip;
				} finally {
					settleThisInitialActivation(false);
				}
			}, {
				concurrency,
				stopOnError: false
			});
		} catch (error) {
			let finalizationError;
			try {
				await completedOutcomeDrain.flush();
			} catch (drainError) {
				finalizationError = drainError;
			}
			await releaseUnclaimedDueJobReservationsWithRetry();
			if (finalizationError) throw finalizationError instanceof Error ? finalizationError : new Error(formatErrorMessage(finalizationError));
			throw error instanceof AggregateError && error.errors.length > 0 ? error.errors[0] : error;
		}
		let postBatchError = reservationReleaseError;
		try {
			await completedOutcomeDrain.flush();
		} catch (error) {
			postBatchError ??= error;
			stopAdmittingDueJobs = true;
		}
		if (stopAdmittingDueJobs) try {
			await releaseUnclaimedDueJobReservationsWithRetry();
		} catch (error) {
			postBatchError ??= error;
		}
		if (completedResults.length > 0) {
			const finalizedResults = await finalizeCompletedCronRunOutcomes(state, completedResults);
			for (const result of finalizedResults) if (!setupTimeoutNotified && result.isolatedAgentSetupTimeout && maybeNotifyIsolatedAgentSetupTimeout(state, result)) {
				setupTimeoutNotified = true;
				break;
			}
		}
		if (postBatchError) throw postBatchError instanceof Error ? postBatchError : new Error(formatErrorMessage(postBatchError));
		if (batchExecutionError) throw batchExecutionError instanceof Error ? batchExecutionError : new Error(formatErrorMessage(batchExecutionError));
	} finally {
		capacityRechecks.abort();
		try {
			if (state.lifecycleGeneration === generation && (state.deps.resolveSessionStorePath || state.deps.sessionStorePath)) {
				const configuredDefaultAgentId = (state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId)?.trim();
				const defaultAgentId = configuredDefaultAgentId ? normalizeAgentId(configuredDefaultAgentId) : void 0;
				const reaperAgentIds = new Set((state.deps.resolveSessionStoreAgentIds?.() ?? []).map(normalizeAgentId));
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
				if (reaperAgentIds.size > 0) {
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
			}
		} catch (err) {
			state.deps.log.warn({ err: String(err) }, "cron: session reaper preparation failed");
		} finally {
			state.activeTimerTicks = Math.max(0, state.activeTimerTicks - 1);
			state.running = state.activeTimerTicks > 0;
			if (!state.running && state.lifecycleGeneration === generation) armTimer(state);
		}
	}
}
//#endregion
//#region src/cron/service/timer-catchup.ts
async function commitStartupCatchupRows(params, mutation) {
	const reservations = params.reservations.filter((reservation) => !mutation.nonRetryableReservations.has(reservation.reservationIdentity));
	const deferredJobs = params.deferredJobs ?? [];
	if (reservations.length === 0 && deferredJobs.length === 0) return;
	const receiptContext = reservations.map(({ jobId, reservationIdentity }) => {
		const owner = params.state.queuedRunReservationsByJobId.get(jobId);
		return owner?.identity === reservationIdentity ? owner.runReceiptContext : void 0;
	}).find((context) => context !== void 0);
	await releaseReservedCronRuns({
		state: params.state,
		context: receiptContext ?? mutation.source.context,
		storeKey: mutation.source.storeKey,
		reservations,
		nowMs: params.state.deps.nowMs(),
		policy: {
			kind: "startup-settlement",
			deferredJobs: [...deferredJobs],
			staggerMs: params.staggerMs ?? 0
		},
		assertCurrent: () => {
			mutation.source.assertStorageCurrent();
			if (deferredJobs.length > 0) mutation.source.assertCurrent();
		},
		onSettled(outcome) {
			if (outcome !== "not-committed") for (const reservation of reservations) mutation.nonRetryableReservations.add(reservation.reservationIdentity);
		}
	});
}
async function releaseStartupCatchupReservationsAfterFailure(state, plan, outcomes, mutation) {
	const startedJobIds = new Set(outcomes.map((outcome) => outcome.jobId));
	await cleanupQueuedCronRunReservations({
		state,
		reservations: plan.candidates.filter((candidate) => !startedJobIds.has(candidate.jobId) && !mutation.nonRetryableReservations.has(candidate.reservationIdentity)),
		recompute: "startup-overflow"
	});
}
/** Runs or defers missed startup jobs using restart catch-up limits. */
async function runMissedJobs(state, opts) {
	if (state.stopped) return;
	const mutation = {
		source: captureCronServiceMutationSource(state),
		nonRetryableReservations: /* @__PURE__ */ new Set()
	};
	const catchup = {};
	state.startupCatchup = catchup;
	try {
		const plan = await planStartupCatchup(state, mutation, opts);
		if (plan.candidates.length === 0 && plan.deferredJobs.length === 0) return;
		const completedOutcomeDrain = createCompletedCronRunOutcomeDrain(state, {
			discardWhenStopped: true,
			repairFutureCronNextRunAtMs: false
		});
		const execution = await executeStartupCatchupPlan(state, plan, completedOutcomeDrain, mutation);
		let finalizedOutcomes;
		try {
			let completedOutcomes;
			try {
				completedOutcomes = await completedOutcomeDrain.flush();
			} catch (drainError) {
				await applyStartupCatchupOutcomes(state, plan, execution.outcomes, mutation);
				throw drainError;
			}
			finalizedOutcomes = await applyStartupCatchupOutcomes(state, plan, completedOutcomes, mutation);
		} catch (finalizationError) {
			try {
				await releaseStartupCatchupReservationsAfterFailure(state, plan, execution.outcomes, mutation);
			} catch (cleanupError) {
				state.deps.log.warn({ err: String(cleanupError) }, execution.ok ? "cron: failed to release startup catch-up reservations after finalization error" : "cron: failed to release startup catch-up reservations after execution error");
			}
			throw execution.ok ? finalizationError : execution.error;
		}
		for (const outcome of finalizedOutcomes) maybeNotifyIsolatedAgentSetupTimeout(state, outcome);
		if (!execution.ok) throw execution.error;
	} finally {
		if (state.startupCatchup === catchup) state.startupCatchup = void 0;
	}
}
async function planStartupCatchup(state, mutation, opts) {
	const lifecycleGeneration = state.lifecycleGeneration;
	const maxImmediate = Math.max(0, state.deps.maxMissedJobsPerRestart ?? 5);
	return locked(state, async () => {
		await ensureLoaded(state);
		if (state.stopped || state.lifecycleGeneration !== lifecycleGeneration || !state.store) return {
			lifecycleGeneration,
			candidates: [],
			deferredJobs: []
		};
		const now = state.deps.nowMs();
		const candidates = await planCronStartup({
			state,
			source: mutation.source,
			jobIds: state.store.jobs.map((job) => job.id),
			skipJobIds: opts?.skipJobIds,
			nowMs: now
		});
		if (state.stopped || state.lifecycleGeneration !== lifecycleGeneration) return {
			lifecycleGeneration,
			candidates: [],
			deferredJobs: []
		};
		const missed = await skipCronJobsWithoutOwners(state, candidates, now, { source: mutation.source });
		if (missed.length === 0 || state.stopped || state.lifecycleGeneration !== lifecycleGeneration) return {
			lifecycleGeneration,
			candidates: [],
			deferredJobs: []
		};
		const sorted = missed.toSorted((a, b) => (a.state.nextRunAtMs ?? 0) - (b.state.nextRunAtMs ?? 0));
		const deferredAgentJobs = [];
		const startupEligible = [];
		for (const job of sorted) {
			const waitsForAgent = job.payload.kind === "agentTurn" || job.payload.kind === "heartbeat" || isHeartbeatTaskCronJob(job) || job.sessionTarget === "main" && job.payload.kind === "systemEvent" && job.wakeMode === "now";
			(opts?.deferAgentWork && waitsForAgent ? deferredAgentJobs : startupEligible).push(job);
		}
		const startupCandidates = startupEligible.slice(0, maxImmediate);
		const deferredOverflow = startupEligible.slice(maxImmediate);
		const deferredAgentDelayMs = Math.max(0, state.deps.startupDeferredMissedAgentJobDelayMs ?? 12e4);
		const deferredJob = (job, delayMs) => ({
			jobId: job.id,
			...delayMs === void 0 ? {} : { delayMs },
			scheduleIdentity: tryCronScheduleIdentity(job),
			createdAtMs: job.createdAtMs,
			payloadKind: job.payload.kind,
			scheduleActivatedAtMs: job.state.scheduleActivatedAtMs,
			nextRunAtMs: job.state.nextRunAtMs,
			lastRunAtMs: job.state.lastRunAtMs,
			lastRunStatus: job.state.lastRunStatus
		});
		const deferred = [...deferredOverflow.map((job) => deferredJob(job)), ...deferredAgentJobs.map((job) => deferredJob(job, deferredAgentDelayMs))];
		if (deferred.length > 0) state.deps.log.info({
			immediateCount: startupCandidates.length,
			deferredCount: deferred.length,
			totalMissed: missed.length
		}, "cron: staggering missed jobs to prevent gateway overload");
		if (deferredAgentJobs.length > 0) state.deps.log.info({
			count: deferredAgentJobs.length,
			jobIds: deferredAgentJobs.map((job) => job.id),
			delayMs: deferredAgentDelayMs
		}, "cron: deferring missed agent jobs until after gateway startup");
		if (startupCandidates.length > 0) state.deps.log.info({
			count: startupCandidates.length,
			jobIds: startupCandidates.map((j) => j.id)
		}, "cron: running missed jobs after restart");
		const reservedStartupCandidates = await persistQueuedCronRunReservations({
			state,
			candidates: startupCandidates,
			source: mutation.source,
			reservedAtMs: now
		});
		return {
			lifecycleGeneration,
			candidates: reservedStartupCandidates.map(({ job, runReceipt, runReceiptContext }) => ({
				jobId: job.id,
				job,
				reservedAtMs: now,
				reservationIdentity: reserveQueuedCronRun(state, job.id, now, {
					runReceipt,
					runReceiptContext,
					lifecycleGeneration
				})
			})),
			deferredJobs: deferred
		};
	});
}
async function executeStartupCatchupPlan(state, plan, completedOutcomeDrain, mutation) {
	const outcomes = [];
	try {
		for (const candidate of plan.candidates) {
			if (state.stopped || state.lifecycleGeneration !== plan.lifecycleGeneration) break;
			const execution = await executeQueuedCronRun({
				state,
				jobId: candidate.jobId,
				reservedAtMs: candidate.reservedAtMs,
				reservationIdentity: candidate.reservationIdentity,
				runnableOptions: {
					skipAtIfAlreadyRan: true,
					allowCronMissedRunByLastRun: true
				},
				onNotRunnable: async () => {
					await commitStartupCatchupRows({
						state,
						reservations: [candidate]
					}, mutation);
				}
			});
			if (execution.kind === "stopped") break;
			if (execution.kind === "completed") {
				outcomes.push(execution.outcome);
				completedOutcomeDrain.enqueue(execution.outcome);
			}
		}
	} catch (error) {
		return {
			ok: false,
			outcomes,
			error
		};
	}
	return {
		ok: true,
		outcomes
	};
}
async function applyStartupCatchupOutcomes(state, plan, outcomes, mutation) {
	const staggerMs = Math.max(0, state.deps.missedJobStaggerMs ?? 5e3);
	await locked(state, async () => {
		await ensureLoaded(state, { forceReload: true });
		if (!state.store) return;
		const startedJobIds = new Set(outcomes.map((outcome) => outcome.jobId));
		const pendingReleases = plan.candidates.filter((candidate) => !startedJobIds.has(candidate.jobId) && !mutation.nonRetryableReservations.has(candidate.reservationIdentity));
		if (state.stopped || state.lifecycleGeneration !== plan.lifecycleGeneration || outcomes.length === 0 && plan.deferredJobs.length === 0) {
			if (pendingReleases.length > 0) await commitStartupCatchupRows({
				state,
				reservations: pendingReleases
			}, mutation);
			return;
		}
		await commitStartupCatchupRows({
			state,
			reservations: pendingReleases,
			deferredJobs: plan.deferredJobs,
			staggerMs
		}, mutation);
		await recomputeUnownedCronSchedules(state, { repairFutureCronNextRunAtMs: false });
	});
	return outcomes;
}
//#endregion
//#region src/cron/service/timer.ts
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cronTimerTestApi")] = { onTimer };
//#endregion
//#region src/cron/service/ops-lifecycle.ts
function applyRecoveryResult(params) {
	const { state, proposal, result } = params;
	if (result.kind === "live") {
		enrollForeignReceipt(state, result.receipt);
		params.skipJobIds?.add(proposal.jobId);
		return false;
	}
	if (result.kind === "superseded") {
		if (result.receipt) {
			enrollForeignReceipt(state, result.receipt);
			params.skipJobIds?.add(proposal.jobId);
		} else removeForeignReceipt(state, proposal.jobId);
		return true;
	}
	removeForeignReceipt(state, proposal.jobId);
	runPostPersistCronNotifications(state, result.notifications);
	if (result.interrupted) params.interruptedRuns.push(result.interrupted);
	if (result.skipStartupCatchup) params.skipJobIds?.add(proposal.jobId);
	return true;
}
async function reconcileForeignRunReceipts(state) {
	let schedulingChanged = false;
	const interruptedRuns = [];
	await locked(state, async () => {
		if (state.stopped) return;
		const proposals = listForeignReceipts(state).map((receipt) => {
			const job = state.store?.jobs.find((entry) => entry.id === receipt.jobId);
			return {
				jobId: receipt.jobId,
				queuedAtMs: job?.state.queuedAtMs,
				runningAtMs: job?.state.runningAtMs,
				runningReceiptId: job?.state.runningReceiptId,
				receipt
			};
		});
		try {
			await recoverCronRunProposals(state, proposals, { onRecovery(proposal, result) {
				schedulingChanged = applyRecoveryResult({
					state,
					proposal,
					result,
					interruptedRuns
				}) || schedulingChanged;
			} });
		} finally {
			if (schedulingChanged) {
				await ensureLoaded(state, { forceReload: true });
				for (const interrupted of interruptedRuns) await emitInterruptedCronRun(state, interrupted);
			}
		}
	});
	if (schedulingChanged && state.schedulerStarted) armTimer(state);
}
/** Waits for receipt retirement without reserving a run or extending its timeout response. */
async function waitForRunSettlement(state, jobId, signal) {
	const generation = state.lifecycleGeneration;
	while (true) {
		const result = await racePromiseWithAbortSignal(locked(state, async () => {
			if (signal.aborted || state.stopped || state.lifecycleGeneration !== generation) return { settled: false };
			await ensureLoaded(state);
			if (signal.aborted || state.stopped || state.lifecycleGeneration !== generation) return { settled: false };
			const job = state.store?.jobs.find((entry) => entry.id === jobId);
			const proposal = {
				jobId,
				queuedAtMs: job?.state.queuedAtMs,
				runningAtMs: job?.state.runningAtMs
			};
			let recovery;
			let changed = false;
			const interruptedRuns = [];
			try {
				await recoverCronRunProposals(state, [proposal], {
					signal,
					onRecovery(observed, recovered) {
						recovery = recovered;
						changed = applyRecoveryResult({
							state,
							proposal: observed,
							result: recovered,
							interruptedRuns
						});
					}
				});
			} finally {
				if (changed) {
					await ensureLoaded(state, { forceReload: true });
					for (const interrupted of interruptedRuns) await emitInterruptedCronRun(state, interrupted);
					if (state.schedulerStarted) armTimer(state);
				}
			}
			if (!recovery || signal.aborted || state.stopped || state.lifecycleGeneration !== generation) return { settled: false };
			if (recovery.kind === "repaired" || !recovery.receipt) return { settled: true };
			configureForeignReceiptMonitor(state, async () => await reconcileForeignRunReceipts(state));
			return { waiting: waitForForeignReceipt(state, jobId, signal) };
		}), signal).catch((error) => {
			if (signal.aborted && isAbortError(error)) return { settled: false };
			throw error;
		});
		if ("settled" in result) return result.settled;
		if (!await result.waiting) return false;
	}
}
/** Starts the cron service, atomically repairs abandoned runs, and arms scheduling. */
async function start(state) {
	if (state.schedulerScope.signal.aborted) state.schedulerScope = state.deps.scheduler.scope();
	state.stopped = false;
	const generation = state.lifecycleGeneration;
	stopForeignReceiptMonitor(state);
	configureForeignReceiptMonitor(state, async () => await reconcileForeignRunReceipts(state));
	if (!state.deps.cronEnabled) {
		state.deps.log.info({ enabled: false }, "cron: disabled");
		return;
	}
	const skipJobIds = /* @__PURE__ */ new Set();
	await locked(state, async () => {
		const interruptedRuns = [];
		await ensureLoaded(state);
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		const proposals = [];
		for (const job of state.store?.jobs ?? []) {
			job.state ??= {};
			if (typeof job.state.queuedAtMs === "number") proposals.push({
				jobId: job.id,
				queuedAtMs: job.state.queuedAtMs
			});
			if (typeof job.state.runningAtMs === "number") proposals.push({
				jobId: job.id,
				runningAtMs: job.state.runningAtMs
			});
		}
		try {
			await recoverCronRunProposals(state, proposals, {
				mode: "startup",
				onRecovery(proposal, result) {
					applyRecoveryResult({
						state,
						proposal,
						result,
						interruptedRuns,
						skipJobIds
					});
				}
			});
		} finally {
			if (proposals.length > 0) await ensureLoaded(state, { forceReload: true });
			for (const interrupted of interruptedRuns) await emitInterruptedCronRun(state, interrupted);
		}
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		if (listForeignReceipts(state).length > 0) await recomputeUnownedCronSchedules(state);
	});
	if (state.stopped || state.lifecycleGeneration !== generation) return;
	try {
		await runMissedJobs(state, {
			skipJobIds: skipJobIds.size > 0 ? skipJobIds : void 0,
			deferAgentWork: true
		});
	} catch (err) {
		if (!state.stopped && state.lifecycleGeneration === generation) {
			state.schedulerStarted = true;
			try {
				armTimer(state);
				resumeForeignReceiptMonitor(state);
			} catch (armError) {
				state.deps.log.warn({ err: String(armError) }, "cron: failed to arm scheduling after startup catch-up failed");
			}
		}
		throw err;
	}
	await locked(state, async () => {
		await ensureLoaded(state, { forceReload: true });
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		if (listForeignReceipts(state).length === 0) await recomputeUnownedCronSchedules(state, { recomputeExpired: true });
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		armTimer(state);
		resumeForeignReceiptMonitor(state);
		state.deps.log.info({
			enabled: true,
			jobs: state.store?.jobs.length ?? 0,
			nextWakeAtMs: nextWakeAtMs(state) ?? null
		}, "cron: started");
	});
}
/** Stops the cron service timer without mutating persisted job state. */
function stop(state) {
	state.lifecycleGeneration += 1;
	state.stopped = true;
	state.schedulerDrain = Promise.all([state.schedulerDrain, state.schedulerScope.stop()]).then(() => void 0);
	cancelCronRunAdmissionWaiters(state);
	state.schedulerStarted = false;
	stopForeignReceiptMonitor(state);
	stopTimer(state);
}
/** Temporarily stops automatic ticks without running startup recovery on resume. */
function pauseScheduling(state) {
	state.schedulingPaused = true;
	stopTimer(state);
}
function resumeScheduling(state) {
	if (!state.schedulingPaused) return;
	state.schedulingPaused = false;
	if (!state.schedulerStarted) return;
	try {
		armTimer(state);
		resumeForeignReceiptMonitor(state);
	} catch (err) {
		state.schedulingPaused = true;
		stopTimer(state);
		throw err;
	}
}
//#endregion
//#region src/cron/service/jobs-mutation-persistence.ts
async function persistUpdatedJob(params) {
	const { state, snapshot, previousJob, nextJob } = params;
	if (!snapshot.store) throw new Error("Cron update has no loaded store");
	const defaultAgentId = state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
	resolveCronJobEffectiveAgentId(previousJob, defaultAgentId);
	resolveCronJobEffectiveAgentId(nextJob, defaultAgentId);
	const reservation = state.queuedRunReservationsByJobId.get(nextJob.id);
	const preservesOnExitRearm = reservation?.onExit === true && reservation.lifecycleGeneration === state.lifecycleGeneration && reservation.markerAtMs === previousJob.state.queuedAtMs && previousJob.schedule.kind === "on-exit" && !previousJob.enabled && nextJob.enabled && resolveCronJobConfigRevision(previousJob) === resolveCronJobConfigRevision({
		...nextJob,
		enabled: false
	});
	if (nextJob.state.queuedAtMs !== void 0 && !preservesOnExitRearm && resolveCronJobConfigRevision(previousJob) !== resolveCronJobConfigRevision(nextJob)) delete nextJob.state.queuedAtMs;
	const nextStore = structuredClone(snapshot.store);
	nextStore.jobs = nextStore.jobs.map((entry) => entry.id === nextJob.id ? nextJob : entry);
	const triggerStateChanged = !isDeepStrictEqual(previousJob.trigger, nextJob.trigger) || !isDeepStrictEqual(previousJob.state.triggerState, nextJob.state.triggerState) || (previousJob.payload.kind === "script" || nextJob.payload.kind === "script") && !isDeepStrictEqual(previousJob.payload, nextJob.payload);
	const scheduleChanged = !cronSchedulingInputsEqual(previousJob, nextJob);
	const messageActionAuthorityChanged = isJobEnabled(previousJob) && !isJobEnabled(nextJob) || !cronJobMessageToolAuthorityInputsEqual(previousJob, nextJob);
	const messageSourceAuthorityChanged = !cronJobMessageActionAuthorityInputsEqual(previousJob, nextJob) || triggerStateChanged && Boolean(resolveCronAuthenticatedChannelRequester(previousJob) || resolveCronAuthenticatedChannelRequester(nextJob) || resolveCronAuthenticatedCallerOrigin(previousJob) || resolveCronAuthenticatedCallerOrigin(nextJob));
	await persistCronJobMutation({
		state,
		source: params.source,
		previous: snapshot.store,
		next: nextStore,
		method: params.mutationMethod,
		assertCurrent: () => {
			params.commitGuard?.();
			params.ownerMutation?.assertCurrent();
			const currentDefaultAgentId = state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
			resolveCronJobEffectiveAgentId(previousJob, currentDefaultAgentId);
			resolveCronJobEffectiveAgentId(nextJob, currentDefaultAgentId);
		},
		agentId: params.agentId,
		preconditionJob: params.preconditionJob,
		suppressScheduledJobId: nextJob.id,
		receiptMutation: {
			jobId: nextJob.id,
			owner: params.ownerMutation?.prepared,
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
				if (isJobEnabled(previousJob) && !isJobEnabled(nextJob)) requestActiveCronJobCancellation(nextJob.id, "Cron job disabled by operator.");
			} finally {
				if (triggerStateChanged) noteActiveCronJobTriggerMutation(nextJob.id);
			}
		},
		afterPublish: () => {
			const committedJob = findJobOrThrow(state, nextJob.id);
			armTimer(state);
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
//#region src/cron/service/jobs-mutation.ts
/** Completes a canonical job edit before authority rebinding and persistence. */
/** Keep the harness-owned immutable envelope intact when copying mutable job fields. */
function cloneCronJobForMutation(job) {
	const { runtimeAuthority, ...mutableJob } = job;
	return {
		...structuredClone(mutableJob),
		...runtimeAuthority ? { runtimeAuthority } : {}
	};
}
function reconcileStreamSourceIdentity(job, nextJob) {
	if (nextJob.schedule.kind !== "stream") {
		nextJob.state.streamSourceIdentity = void 0;
		return;
	}
	const sourceChanged = job.schedule.kind !== "stream" || cronStreamScheduleKey(job.schedule) !== cronStreamScheduleKey(nextJob.schedule) || isJobEnabled(job) !== isJobEnabled(nextJob);
	const currentIdentity = job.schedule.kind === "stream" ? job.state.streamSourceIdentity : void 0;
	nextJob.state.streamSourceIdentity = sourceChanged || !currentIdentity ? createCronStreamSourceIdentity() : currentIdentity;
}
function finalizeUpdatedJob(params) {
	const { job, nextJob, now } = params;
	if (params.scheduleChanged && nextJob.schedule.kind === "every") {
		const anchor = nextJob.schedule.anchorMs;
		if (typeof anchor !== "number" || !Number.isFinite(anchor)) {
			const fallbackAnchorMs = (job.schedule.kind === "every" && job.schedule.everyMs === nextJob.schedule.everyMs && typeof job.schedule.anchorMs === "number" && Number.isFinite(job.schedule.anchorMs) ? job.schedule.anchorMs : void 0) ?? now;
			nextJob.schedule = {
				...nextJob.schedule,
				anchorMs: Math.max(0, Math.floor(fallbackAnchorMs))
			};
		}
	}
	reconcileStreamSourceIdentity(job, nextJob);
	const previousScript = job.payload.kind === "script" ? job.payload.script : void 0;
	const nextScript = nextJob.payload.kind === "script" ? nextJob.payload.script : void 0;
	if (!isDeepStrictEqual(job.trigger, nextJob.trigger) || previousScript !== nextScript) for (const field of [
		"triggerState",
		"triggerEvalCount",
		"lastTriggerEvalAtMs",
		"lastTriggerFireAtMs"
	]) if (params.explicitTriggerState && Object.hasOwn(params.explicitTriggerState, field)) Object.assign(nextJob.state, { [field]: params.explicitTriggerState[field] });
	else delete nextJob.state[field];
	const schedulingInputsChanged = params.schedulingInputsRequested && !cronSchedulingInputsEqual(job, nextJob);
	if (params.scheduleChanged && nextJob.schedule.kind === "cron" && !isJobEnabled(nextJob)) computeJobNextRunAtMs({
		...nextJob,
		enabled: true
	}, now);
	nextJob.updatedAtMs = now;
	if (schedulingInputsChanged) {
		nextJob.state.scheduleActivatedAtMs = now;
		nextJob.state.startupCatchupAtMs = void 0;
		nextJob.state.pacedNextRunAtMs = void 0;
		nextJob.state.forcePreservedNextRunAtMs = cronSchedulingInputsEqual({
			...job,
			enabled: nextJob.enabled
		}, nextJob) ? resolveForcePreservedOneShotAtMs(job) : void 0;
		if (isJobEnabled(nextJob)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
		else {
			nextJob.state.nextRunAtMs = void 0;
			nextJob.state.queuedAtMs = void 0;
			if (!isCronJobActive(nextJob.id)) {
				Object.assign(nextJob.state, {
					runningAtMs: void 0,
					runningReceiptId: void 0
				});
				delete nextJob.state.runningScheduleChangeId;
			}
		}
	} else if (isJobEnabled(nextJob) && !hasScheduledNextRunAtMs(nextJob.state.nextRunAtMs)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
	if (nextJob.state.runningAtMs !== job.state.runningAtMs) delete nextJob.state.runningReceiptId;
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
		const matches = declarationKey ? state.store?.jobs.filter((job) => job.declarationKey === declarationKey && (opts?.matchesExisting?.(job) ?? true)) ?? [] : [];
		if (matches.length > 1) throw new Error(`cron declarationKey is ambiguous within caller scope: ${declarationKey}`);
		const existing = matches[0];
		const configuredChannels = await resolveConfiguredChannelsForValidation(state);
		source.assertCurrent();
		if (existing) {
			const now = state.deps.nowMs();
			const nextJob = cloneCronJobForMutation(existing);
			applyDeclarativeJobSpec(nextJob, normalizedInput, {
				defaultAgentId: state.deps.defaultAgentId,
				enabledExplicit: opts?.enabledExplicit === true,
				nowMs: now,
				cronConfig: state.deps.cronConfig,
				scheduledToolPolicy: opts?.scheduledToolPolicy,
				toolsAllowProvenance: opts?.toolsAllowProvenance,
				toolsAllowExecTarget: opts?.toolsAllowExecTarget,
				configuredChannels
			});
			finalizeUpdatedJob({
				job: existing,
				nextJob,
				now,
				schedulingInputsRequested: true,
				scheduleChanged: !isDeepStrictEqual(existing.schedule, nextJob.schedule),
				explicitTriggerState: normalizedInput.state
			});
			const runtimeAuthorityMutation = consumeRuntimeAuthorityMutationOptions(opts);
			reconcileRuntimeAuthority({
				job: nextJob,
				...runtimeAuthorityMutation,
				explicitlyMutatesToolsAllow: normalizedInput.payload.toolsAllow !== void 0
			});
			reconcileCronChannelRequesterAuthority({
				job: nextJob,
				previousJob: existing,
				toolsAllowProvenance: opts?.toolsAllowProvenance,
				reauthorize: true
			});
			const includeEnabled = opts?.enabledExplicit === true;
			if (isDeepStrictEqual(declarativeFields(existing, includeEnabled), declarativeFields(nextJob, includeEnabled))) {
				if (!state.store) throw new Error("Cron declaration has no loaded store");
				await persistCronJobMutation({
					state,
					source,
					previous: state.store,
					next: state.store,
					method: "cron.add",
					assertCurrent: opts?.commitGuard,
					agentId,
					expectedJob: {
						id: existing.id,
						configRevision: resolveCronJobConfigRevision(existing)
					}
				});
				const committedJob = findJobOrThrow(state, existing.id);
				return {
					...committedJob,
					created: false,
					updated: false,
					job: committedJob
				};
			}
			const committedJob = await persistUpdatedJob({
				state,
				snapshot: snapshotStoreForRollback(state),
				previousJob: existing,
				nextJob,
				source,
				commitGuard: opts?.commitGuard,
				agentId,
				mutationMethod: "cron.add"
			});
			return {
				...committedJob,
				created: false,
				updated: true,
				job: committedJob
			};
		}
		if (normalizedId && state.store?.jobs.some((job) => job.id === normalizedId)) throw new Error(`cron job already exists: ${normalizedId}`);
		const snapshot = snapshotStoreForRollback(state);
		const job = createJob(state, normalizedInput, {
			scheduledToolPolicy: opts?.scheduledToolPolicy,
			toolsAllowProvenance: opts?.toolsAllowProvenance,
			toolsAllowExecTarget: opts?.toolsAllowExecTarget,
			configuredChannels
		});
		if (opts?.createdActor) job.createdActor = structuredClone(opts.createdActor);
		if (opts?.skillLibrarySelections) job.skillLibrarySelections = structuredClone(opts.skillLibrarySelections);
		const runtimeAuthorityMutation = consumeRuntimeAuthorityMutationOptions(opts);
		reconcileRuntimeAuthority({
			job,
			...runtimeAuthorityMutation,
			explicitlyMutatesToolsAllow: normalizedInput.payload.toolsAllow !== void 0
		});
		reconcileCronChannelRequesterAuthority({
			job,
			toolsAllowProvenance: opts?.toolsAllowProvenance
		});
		if (!snapshot.store) throw new Error("Cron add has no loaded store");
		const nextStore = {
			...snapshot.store,
			jobs: [...structuredClone(snapshot.store.jobs), job]
		};
		const postPersistNotifications = [];
		recomputeNextRunsForMaintenance({
			...state,
			store: nextStore
		}, { deferredNotifications: postPersistNotifications });
		await persistCronJobMutation({
			state,
			source,
			previous: snapshot.store,
			next: nextStore,
			method: "cron.add",
			assertCurrent: opts?.commitGuard,
			agentId,
			postPersistNotifications,
			suppressScheduledJobId: job.id,
			afterPublish: () => {
				armTimer(state);
				const committedJob = findJobOrThrow(state, job.id);
				state.deps.log.info({
					jobId: committedJob.id,
					jobName: committedJob.name,
					nextRunAtMs: committedJob.state.nextRunAtMs,
					schedulerNextWakeAtMs: nextWakeAtMs(state) ?? null,
					timerArmed: state.timer !== null,
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
			created: true,
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
	const nextJob = cloneCronJobForMutation(job);
	applyJobPatch(nextJob, patch, {
		defaultAgentId: resolveCurrentDefaultAgentId(state),
		scheduleValidationNowMs: now,
		cronConfig: state.deps.cronConfig,
		scheduledToolPolicy: opts?.scheduledToolPolicy,
		toolsAllowProvenance: opts?.toolsAllowProvenance,
		toolsAllowExecTarget: opts?.toolsAllowExecTarget,
		configuredChannels
	});
	finalizeUpdatedJob({
		job,
		nextJob,
		now,
		schedulingInputsRequested: patch.schedule !== void 0 || patch.enabled !== void 0 || "trigger" in patch || "pacing" in patch,
		scheduleChanged: patch.schedule !== void 0,
		explicitTriggerState: patch.state
	});
	const ownerPreparation = prepareCronRunReceiptOwnerMutation({
		state,
		previousJob: job,
		nextJob
	});
	const ownerMutation = ownerPreparation ? await ownerPreparation : void 0;
	source.assertCurrent();
	const runtimeAuthorityMutation = consumeRuntimeAuthorityMutationOptions(opts);
	reconcileRuntimeAuthority({
		job: nextJob,
		...runtimeAuthorityMutation,
		explicitlyMutatesToolsAllow: patch.payload !== void 0 && Object.hasOwn(patch.payload, "toolsAllow")
	});
	reconcileCronChannelRequesterAuthority({
		job: nextJob,
		previousJob: job,
		toolsAllowProvenance: opts?.toolsAllowProvenance,
		reauthorize: patch.payload !== void 0 && Object.hasOwn(patch.payload, "toolsAllow"),
		reauthorizeCallerOrigin: patch.payload !== void 0 && Object.hasOwn(patch.payload, "toolsAllow")
	});
	return await persistUpdatedJob({
		state,
		snapshot: snapshotStoreForRollback(state),
		previousJob: job,
		nextJob,
		source,
		commitGuard: opts?.commitGuard,
		agentId: patch.agentId !== void 0 ? resolveCronJobEffectiveAgentId(nextJob, resolveCurrentDefaultAgentId(state)) : void 0,
		preconditionJob: precondition ? job : void 0,
		mutationMethod: "cron.update",
		ownerMutation
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
/** Removes a cron job by id and re-arms the timer when the in-memory store changes. */
async function remove(state, id, opts) {
	const source = captureCronJobMutationSource(state);
	let sessionCleanup;
	const outcome = await locked(state, async () => {
		source.assertCurrent();
		warnIfDisabled(state, "remove");
		const previousStore = state.store;
		await ensureLoadedForOperation(state);
		if (!state.store) return {
			ok: false,
			removed: false
		};
		const removedJob = state.store.jobs.find((j) => j.id === id);
		if (!removedJob) {
			if (state.store !== previousStore) armTimer(state);
			return {
				ok: true,
				removed: false
			};
		}
		if (isSystemMonitorDeclaration(removedJob.declarationKey) && opts?.systemOwned !== true) throw new Error("system-owned monitor jobs cannot be removed by cron clients");
		source.assertCurrent();
		opts?.commitGuard?.();
		const snapshot = snapshotStoreForRollback(state);
		const previous = structuredClone(state.store);
		const nextStore = {
			...previous,
			jobs: previous.jobs.filter((j) => j.id !== id)
		};
		const postPersistNotifications = [];
		recomputeNextRunsForMaintenance({
			...state,
			store: nextStore
		}, { deferredNotifications: postPersistNotifications });
		const agentId = resolveCronJobEffectiveAgentId(removedJob, resolveCurrentDefaultAgentId(state));
		const sessionStorePath = state.deps.resolveSessionStorePath?.(agentId) ?? state.deps.sessionStorePath;
		let activeRunCancellationRequested = false;
		await persistCronJobMutation({
			state,
			source,
			previous: snapshot.store ?? previous,
			next: nextStore,
			method: "cron.remove",
			assertCurrent: opts?.commitGuard,
			postPersistNotifications,
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
				armTimer(state);
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
		onCronJobInactive(activeMarker, () => void cleanup());
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
		const previous = structuredClone(state.store);
		const removedJobs = previous.jobs.filter((job) => tryResolveCronJobEffectiveAgentId(job, defaultAgentId) === id);
		if (removedJobs.length === 0) return await commit();
		let roster;
		try {
			roster = { value: await commit() };
		} catch (error) {
			if (!(error instanceof AgentDeletionCommitUncertainError)) throw error;
			roster = { error };
		}
		const next = structuredClone(previous);
		const removedJobIds = new Set(removedJobs.map((job) => job.id));
		next.jobs = next.jobs.filter((job) => !removedJobIds.has(job.id));
		const postPersistNotifications = [];
		recomputeNextRunsForMaintenance({
			...state,
			store: next
		}, { deferredNotifications: postPersistNotifications });
		try {
			await persistCronJobMutation({
				state,
				source,
				previous,
				next,
				method: "cron.remove",
				postPersistNotifications,
				afterCommit() {
					for (const job of removedJobs) noteActiveCronJobRemoval(job.id);
				},
				afterPublish() {
					armTimer(state);
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
//#region src/cron/service/ops-read.ts
/** Returns cron service status after a read-only maintenance pass. */
async function status(state) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		const sqlitePath = resolveOpenClawStateSqlitePath();
		return {
			enabled: state.deps.cronEnabled,
			triggersEnabled: state.deps.cronConfig?.triggers?.enabled !== false,
			storePath: sqlitePath,
			storage: "sqlite",
			sqlitePath,
			jobs: state.store?.jobs.length ?? 0,
			nextWakeAtMs: state.deps.cronEnabled ? nextWakeAtMs(state) ?? null : null
		};
	}, { readOnly: true });
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
			assertJobCurrent(configRevision) {
				if (configRevision !== expectedRevision) {
					noteCronJobsStoreCommit(source.storeKey);
					throw new CronJobsStoreChangedError(source.storeKey);
				}
			}
		});
	});
}
/** Record a terminal failure from a scheduler-owned event source. */
function resolveEnabledFilter(opts) {
	if (opts?.enabled === "all" || opts?.enabled === "enabled" || opts?.enabled === "disabled") return opts.enabled;
	return opts?.includeDisabled ? "all" : "enabled";
}
function resolveScheduleKindFilter(opts) {
	const kind = opts?.scheduleKind;
	return kind && [
		"all",
		"at",
		"every",
		"cron",
		"on-exit",
		"stream"
	].includes(kind) ? kind : "all";
}
function resolveLastRunStatusFilter(opts) {
	const lastRunStatus = opts?.lastRunStatus;
	return lastRunStatus && [
		"all",
		"ok",
		"error",
		"skipped",
		"unknown"
	].includes(lastRunStatus) ? lastRunStatus : "all";
}
function resolveTriggerFilter(opts) {
	const trigger = opts?.trigger;
	return trigger && [
		"all",
		"conditional",
		"unconditional"
	].includes(trigger) ? trigger : "all";
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
				await ensureLoadedForRead(state);
				const query = normalizeLowercaseStringOrEmpty(opts?.query);
				const enabledFilter = resolveEnabledFilter(opts);
				const scheduleKindFilter = resolveScheduleKindFilter(opts);
				const lastRunStatusFilter = resolveLastRunStatusFilter(opts);
				const triggerFilter = resolveTriggerFilter(opts);
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
				const revision = getCronJobsStoreRevision(state.deps.storePath);
				const cached = state.schedulerStarted ? state.listPageSnapshot : void 0;
				let snapshot = cached;
				if (!snapshot || snapshot.storeRevision !== revision || snapshot.sortBy !== sortBy || snapshot.sortDir !== sortDir || snapshot.filteredJobs.length !== filtered.length || !snapshot.filteredJobs.every((job, index) => job === filtered[index])) {
					const jobs = sortCronJobs([...filtered], sortBy, sortDir);
					snapshot = {
						storeRevision: revision,
						filteredJobs: filtered,
						sortBy,
						sortDir,
						jobs,
						readJobs: cached?.storeRevision === revision ? cached.readJobs : /* @__PURE__ */ new WeakMap(),
						snapshotRevision: resolveCronListSnapshotRevision(jobs)
					};
					if (state.schedulerStarted && (jobs.length > 0 || cached?.storeRevision !== revision)) state.listPageSnapshot = snapshot;
				}
				const { jobs: sortedJobs, readJobs, snapshotRevision } = snapshot;
				const total = sortedJobs.length;
				const offset = Math.max(0, Math.min(total, Math.floor(opts?.offset ?? 0)));
				const defaultLimit = total === 0 ? 50 : total;
				const limit = Math.max(1, Math.min(200, Math.floor(opts?.limit ?? defaultLimit)));
				const jobs = sortedJobs.slice(offset, offset + limit).map((job) => {
					let frozenJob = readJobs.get(job);
					if (!frozenJob) {
						frozenJob = freezeJsonSnapshot(structuredClone(job));
						readJobs.set(job, frozenJob);
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
//#region src/cron/service/ops-run-preparation.ts
function admitsStreamSourceRun(job, streamScheduleKey, streamSourceIdentity) {
	if (streamScheduleKey === void 0 && streamSourceIdentity === void 0) return true;
	return streamScheduleKey !== void 0 && streamSourceIdentity !== void 0 && isJobEnabled(job) && ownsStreamSource(job, streamScheduleKey, streamSourceIdentity);
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
		assertCurrent: params.commitGuard,
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
				armTimer(params.state);
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
			for (const notification of outcome.notifications) {
				historySource.assertCurrent();
				runPostPersistCronNotifications(params.state, [notification]);
			}
			historySource.assertCurrent();
			armTimer(params.state);
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
	source.assertCurrent();
	await ensureLoaded(state);
	source.assertCurrent();
	opts?.commitGuard?.();
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
	const job = opts?.onExit ? state.store?.jobs.find((entry) => entry.id === id) : findJobOrThrow(state, id);
	if (!job || opts?.onExit && !matchesOnExitSchedule(job, opts.onExit.schedule)) return {
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
		assertSupportedJobSpec(job);
	} catch (error) {
		await skipInvalidPersistedManualRun({
			state,
			job,
			mode,
			source,
			runId: opts?.runId,
			commitGuard: opts?.commitGuard ?? opts?.onExit?.commitGuard,
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
async function inspectManualRunDisposition(state, id, mode, opts) {
	const source = captureCronServiceMutationSource(state);
	const result = await locked(state, () => inspectManualRunPreflight(state, id, source, mode, opts));
	if (!result.ok) return result;
	if ("reason" in result) return result;
	return {
		ok: true,
		runnable: true
	};
}
async function prepareManualRun(state, id, mode, opts) {
	const source = captureCronServiceMutationSource(state);
	return await locked(state, async () => {
		const generation = state.lifecycleGeneration;
		const preflight = await inspectManualRunPreflight(state, id, source, mode, opts);
		if (!preflight.ok || "reason" in preflight) return preflight;
		if (state.lifecycleGeneration !== generation) return {
			ok: true,
			ran: false,
			reason: "stopped"
		};
		const { job } = preflight;
		opts?.commitGuard?.();
		const reservationAt = state.deps.nowMs();
		if (!isRunnableJob({
			job,
			nowMs: reservationAt,
			forced: isImmediateCronRunMode(mode)
		})) return {
			ok: true,
			ran: false,
			reason: "not-due"
		};
		const internalTracker = opts?.terminalTracker ?? { emitted: false };
		const onExit = opts?.onExit;
		let reservationIdentity;
		let reserved;
		try {
			[reserved] = await persistQueuedCronRunReservations({
				state,
				candidates: [job],
				source,
				...isImmediateCronRunMode(mode) ? { immediateJobIds: /* @__PURE__ */ new Set([job.id]) } : {},
				reservedAtMs: reservationAt,
				...isImmediateCronRunMode(mode) ? { scheduleMode: "preserve" } : {},
				manualRun: {
					runId: opts?.runId,
					commitGuard: opts?.commitGuard,
					terminalTracker: internalTracker,
					scheduleOwnershipAtMs: opts?.scheduleOwnershipAtMs,
					...onExit ? { onExit: {
						commitGuard: onExit.commitGuard,
						onReserved: (reservedJob, runReceipt, runReceiptContext) => {
							reservationIdentity = reserveQueuedCronRun(state, reservedJob.id, reservationAt, {
								runReceipt,
								runReceiptContext,
								preserveWhenDisabled: true,
								onExit: true,
								lifecycleGeneration: generation
							});
							onExit.onReserved();
						}
					} } : {}
				}
			});
		} catch (error) {
			if (reservationIdentity) await releasePreparedManualReservationWithRetry(state, {
				jobId: job.id,
				reservationIdentity
			});
			throw error;
		}
		if (!reserved) {
			if (state.stopped || state.lifecycleGeneration !== generation) return {
				ok: true,
				ran: false,
				reason: "stopped"
			};
			if (internalTracker.emitted) return {
				ok: true,
				ran: false,
				reason: "ownerless"
			};
			return {
				ok: true,
				ran: false,
				reason: "already-running"
			};
		}
		const reservedJob = reserved.job;
		reservationIdentity ??= reserveQueuedCronRun(state, reservedJob.id, reservationAt, {
			runReceipt: reserved.runReceipt,
			runReceiptContext: reserved.runReceiptContext,
			preserveWhenDisabled: mode === "force" && !isJobEnabled(job),
			lifecycleGeneration: generation
		});
		if (state.stopped || state.lifecycleGeneration !== generation) {
			try {
				await releasePreparedManualReservationWithRetry(state, {
					jobId: reservedJob.id,
					reservationIdentity
				});
			} catch (error) {
				releaseQueuedCronRun(state, job.id, reservationIdentity);
				throw error;
			}
			return {
				ok: true,
				ran: false,
				reason: "stopped"
			};
		}
		return {
			ok: true,
			ran: true,
			jobId: reservedJob.id,
			runId: opts?.runId,
			terminalTracker: opts?.terminalTracker,
			owningCronLaneTaskMarker: opts?.owningCronLaneTaskMarker,
			commitGuard: opts?.commitGuard,
			reservationAt,
			scheduleOwnershipAtMs: opts?.scheduleOwnershipAtMs ?? reservationAt,
			reservationIdentity,
			wasEnabled: opts?.onExit ? false : isJobEnabled(job),
			...onExit ? { onExit } : {},
			...opts?.payload ? { payload: structuredClone(opts.payload) } : {},
			...opts?.evaluateTrigger ? { evaluateTrigger: true } : {},
			...opts?.streamBatch !== void 0 ? { streamBatch: opts.streamBatch } : {},
			...opts?.streamScheduleKey !== void 0 ? { streamScheduleKey: opts.streamScheduleKey } : {},
			...opts?.streamSourceIdentity !== void 0 ? { streamSourceIdentity: opts.streamSourceIdentity } : {},
			...opts?.onTriggerDisposition ? { onTriggerDisposition: opts.onTriggerDisposition } : {}
		};
	});
}
async function activatePreparedManualRun(state, prepared, mode) {
	const source = captureCronServiceMutationSource(state, state.queuedRunReservationsByJobId.get(prepared.jobId)?.runReceiptContext);
	return await locked(state, async () => {
		await ensureLoaded(state, { forceReload: true });
		prepared.commitGuard?.();
		prepared.onExit?.commitGuard();
		if (state.stopped) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "stopped"
			};
		}
		const job = state.store?.jobs.find((entry) => entry.id === prepared.jobId);
		if (!job) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		if (mode === "if-enabled" && (!isJobEnabled(job) || job.state.autoDisabled)) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "disabled"
			};
		}
		if (!isQueuedCronRunReservationCurrent(state, prepared.jobId, prepared.reservationIdentity) || job.state.queuedAtMs !== prepared.reservationAt) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		if (prepared.onExit && !matchesOnExitSchedule(job, prepared.onExit.schedule)) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		if (!admitsStreamSourceRun(job, prepared.streamScheduleKey, prepared.streamSourceIdentity)) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		const dueProbe = structuredClone(job);
		delete dueProbe.state.queuedAtMs;
		if (prepared.wasEnabled && !isJobEnabled(job) || !isRunnableJob({
			job: dueProbe,
			nowMs: state.deps.nowMs(),
			forced: isImmediateCronRunMode(mode)
		})) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		try {
			assertSupportedJobSpec(job);
		} catch (error) {
			await skipInvalidPersistedManualRun({
				state,
				job,
				mode,
				source,
				runId: prepared.runId,
				commitGuard: prepared.commitGuard ?? prepared.onExit?.commitGuard,
				terminalTracker: prepared.terminalTracker,
				error
			});
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "invalid-spec"
			};
		}
		const activation = await activateQueuedCronRun({
			state,
			job,
			reservationIdentity: prepared.reservationIdentity,
			commitGuard: prepared.commitGuard ?? prepared.onExit?.commitGuard,
			onExitSchedule: prepared.onExit?.schedule,
			onUnavailableRollbackError: async () => {
				await releasePreparedManualReservationWithRetry(state, prepared);
			}
		});
		if (activation.kind === "unavailable") return {
			ok: true,
			ran: false,
			reason: activation.reason
		};
		if (activation.kind === "fenced") {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "already-running"
			};
		}
		prepared.onExit?.commitGuard();
		const { job: activatedJob, startedAt } = activation;
		const payload = prepared.onExit?.payload?.(structuredClone(activatedJob)) ?? prepared.payload;
		emit(state, {
			jobId: activatedJob.id,
			action: "started",
			job: activatedJob,
			runAtMs: startedAt
		});
		const taskRunId = createCronRunHandle({
			state,
			job: activatedJob,
			startedAt,
			runReceipt: activation.runReceipt,
			publicRunId: prepared.runId
		})?.runId;
		const activeJobMarker = markManualCronJobActive(state, activatedJob, activation.runReceipt);
		const admittedJob = structuredClone(activatedJob);
		if (prepared.onExit) admittedJob.enabled = false;
		const executionJob = structuredClone({
			...activatedJob,
			payload: payload ?? activatedJob.payload
		});
		if (isImmediateCronRunMode(mode)) {
			executionJob.state.nextRunAtMs = prepared.scheduleOwnershipAtMs;
			executionJob.trigger = prepared.evaluateTrigger ? executionJob.trigger : void 0;
		}
		return {
			...prepared,
			startedAt,
			runId: prepared.runId ?? taskRunId,
			taskRunId,
			activeJobMarker,
			admittedJob,
			executionJob,
			runReceipt: activation.runReceipt,
			runReceiptContext: activation.runReceiptContext
		};
	});
}
async function releasePreparedManualReservation(state, prepared, onSettled) {
	const owner = state.queuedRunReservationsByJobId.get(prepared.jobId);
	if (owner?.identity !== prepared.reservationIdentity) {
		onSettled("not-committed");
		return;
	}
	await releaseReservedCronRuns({
		state,
		context: owner.runReceiptContext,
		storeKey: owner.runReceipt.storeKey,
		reservations: [prepared],
		policy: { kind: "manual-abandon" },
		onSettled
	});
}
async function releasePreparedManualReservationWithRetry(state, prepared) {
	let retrySafe = false;
	const attempt = async () => {
		retrySafe = false;
		await releasePreparedManualReservation(state, prepared, (outcome) => {
			retrySafe = outcome === "not-committed";
		});
	};
	try {
		await attempt();
	} catch (error) {
		try {
			if (!retrySafe) throw error;
			await attempt();
		} catch (failure) {
			releaseReservationOwnership(state, [prepared]);
			throw failure;
		}
	}
}
async function releasePreparedManualReservationAfterReloadWithRetry(state, prepared) {
	await cleanupQueuedCronRunReservations({
		state,
		reservations: [prepared],
		restoreLastError: false
	});
}
//#endregion
//#region src/cron/service/ops-run.ts
let nextManualRunId = 1;
async function finishPreparedManualRun(state, prepared, mode) {
	const executionJob = prepared.executionJob;
	const startedAt = prepared.startedAt;
	const jobId = prepared.jobId;
	const taskRunId = prepared.taskRunId;
	let finalizationStarted = false;
	let receiptSettlementDisposition;
	try {
		let coreResult;
		try {
			coreResult = await executeJobCoreWithTimeout(state, executionJob, {
				runId: taskRunId,
				activeJobMarker: prepared.activeJobMarker,
				owningCronLaneTaskMarker: prepared.owningCronLaneTaskMarker,
				streamBatch: prepared.streamBatch,
				streamScheduleKey: prepared.streamScheduleKey,
				streamSourceIdentity: prepared.streamSourceIdentity,
				runReceipt: prepared.runReceipt,
				runReceiptContext: prepared.runReceiptContext,
				executionIdentity: createCronOwnerExecutionIdentityAdmission({
					state,
					runReceipt: prepared.runReceipt
				})
			});
		} catch (err) {
			if (err instanceof CronRunReceiptRevisionError && err.reason === "owner-unavailable") receiptSettlementDisposition = "owner-unavailable";
			coreResult = authorCronRunCompletion(executionJob, {
				status: "error",
				error: err instanceof CronRunReceiptRevisionError ? err.message : normalizeCronRunErrorText(err)
			});
		}
		if (prepared.onTriggerDisposition) {
			const disposition = coreResult.triggerEval?.busy ? "busy" : coreResult.status === "error" ? "error" : coreResult.status !== "ok" ? "dropped" : !executionJob.trigger ? "fired" : coreResult.triggerEval?.fired ? "fired" : "dropped";
			prepared.onTriggerDisposition(disposition);
		}
		finalizationStarted = true;
		await finalizeCompletedCronRunOutcomes(state, [{
			...coreResult,
			jobId,
			job: prepared.admittedJob,
			taskRunId,
			activeJobMarker: prepared.activeJobMarker,
			reservationIdentity: prepared.reservationIdentity,
			runReceipt: prepared.runReceipt,
			runReceiptContext: prepared.runReceiptContext,
			receiptSettlementDisposition,
			startedAt,
			endedAt: state.deps.nowMs(),
			request: {
				executionJob,
				preserveCadence: isImmediateCronRunMode(mode),
				scheduleOwnershipAtMs: prepared.scheduleOwnershipAtMs,
				runId: prepared.runId,
				terminalTracker: prepared.terminalTracker
			}
		}], { onRequestedRunFinalized: () => armTimer(state) });
	} finally {
		if (!finalizationStarted) {
			releaseLocalCronRunReceiptOwnership(prepared.runReceipt);
			try {
				releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
			} finally {
				clearManualCronJobActive(state, jobId, prepared.activeJobMarker);
			}
		}
	}
}
/** Runs a cron job manually, reserving it under lock before executing outside the lock. */
async function run(state, id, mode, opts) {
	const execute = async () => {
		const prepared = await prepareManualRun(state, id, mode, opts);
		if (!prepared.ok || !prepared.ran) return prepared;
		return await executePreparedManualRun(state, prepared, mode);
	};
	return await (opts?.streamBatch !== void 0 && state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(execute) : execute());
}
/** Consumes an observed exit only when its payload owns the durable reservation. */
async function runOnExit(state, id, opts) {
	const generation = state.lifecycleGeneration;
	const execute = async () => {
		const commitGuard = () => {
			if (opts.signal.aborted || state.stopped || generation !== state.lifecycleGeneration) throw createAbortError("cron on-exit admission cancelled");
			opts.commitGuard();
		};
		try {
			while (await waitForRunSettlement(state, id, opts.signal)) {
				commitGuard();
				const prepared = await prepareManualRun(state, id, "force", {
					onExit: {
						...opts,
						commitGuard
					},
					commitGuard
				});
				if (!prepared.ok || !prepared.ran) {
					if (prepared.ok && prepared.reason === "already-running") continue;
					return prepared;
				}
				return await executePreparedManualRun(state, prepared, "force");
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
	return await (state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(execute) : execute());
}
async function executePreparedManualRun(state, prepared, mode, onActivationSettled) {
	const admission = await runWithCronAdmission(state, async () => {
		let activeRun;
		try {
			activeRun = await activatePreparedManualRun(state, prepared, mode);
		} catch (error) {
			try {
				await locked(state, async () => {
					await releasePreparedManualReservationWithRetry(state, prepared);
				});
			} catch (cleanupError) {
				state.deps.log.warn({
					jobId: prepared.jobId,
					err: String(cleanupError)
				}, "cron: failed to release manual run reservation after activation error");
			}
			throw error;
		} finally {
			onActivationSettled?.();
		}
		if (!activeRun.ran) return activeRun;
		const execute = () => finishPreparedManualRun(state, activeRun, mode);
		await runOutsideOperatorToolGatewayAuthority(() => state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(execute) : execute());
		return {
			ok: true,
			ran: true
		};
	}, void 0, prepared.onExit?.signal);
	if (admission.kind === "stopped") {
		await releasePreparedManualReservationAfterReloadWithRetry(state, prepared);
		return {
			ok: true,
			ran: false,
			reason: "stopped"
		};
	}
	return admission.value;
}
/** Acknowledges queued manual work only after its durable reservation exists. */
async function enqueueRun(state, id, mode, opts) {
	const disposition = await inspectManualRunDisposition(state, id, mode, opts);
	if (!disposition.ok || !("runnable" in disposition && disposition.runnable)) return disposition;
	const scheduleOwnershipAtMs = state.deps.nowMs();
	const runId = `manual:${id}:${scheduleOwnershipAtMs}:${nextManualRunId++}`;
	const terminalTracker = { emitted: false };
	const releaseCallerAuthority = retainGatewayDeviceRevocation(opts?.commitGuard);
	const acceptance = createDeferredCore();
	const trackCallerWork = captureCronRunAdmissionTracker();
	const activationSettled = createDeferredCore();
	let accepted = false;
	const acceptQueue = () => {
		if (!accepted && trackCallerWork) trackCallerWork(() => activationSettled.promise).catch((error) => {
			state.deps.log.error({
				jobId: id,
				runId,
				err: String(error)
			}, "cron: queued manual admission tracking failed");
		});
		accepted = true;
		acceptance.resolve({
			ok: true,
			enqueued: true,
			runId
		});
	};
	let queuedRun;
	try {
		queuedRun = runWithoutOwnedSessionTranscriptWrites(() => runWithGatewayIndependentRootWorkContinuation(async () => {
			opts?.commitGuard?.();
			const prepared = await prepareManualRun(state, id, mode, {
				runId,
				scheduleOwnershipAtMs,
				terminalTracker,
				commitGuard: opts?.commitGuard
			});
			if (!prepared.ok || !prepared.ran) {
				acceptance.resolve(prepared);
				return prepared;
			}
			let dispatched = false;
			try {
				opts?.commitGuard?.();
				return await enqueueCommandInLane("cron", async (owningCronLaneTaskMarker) => {
					acceptQueue();
					dispatched = true;
					const result = await executePreparedManualRun(state, {
						...prepared,
						owningCronLaneTaskMarker
					}, mode, activationSettled.resolve);
					if (result.ok && "ran" in result && !result.ran) {
						if (result.reason !== "invalid-spec" && result.reason !== "ownerless") {
							const finishedAt = state.deps.nowMs();
							const job = state.store?.jobs.find((entry) => entry.id === id);
							await emitCronRunFinished(state, {
								jobId: id,
								action: "finished",
								job,
								status: "skipped",
								error: `queued manual run skipped before execution: ${result.reason}`,
								runId,
								runAtMs: finishedAt,
								durationMs: 0,
								nextRunAtMs: job?.state.nextRunAtMs
							}, terminalTracker);
						}
						state.deps.log.info({
							jobId: id,
							runId,
							reason: result.reason
						}, "cron: queued manual run skipped before execution");
					}
					return result;
				}, {
					onQueued: acceptQueue,
					taskIdentity: {
						taskKind: "cron",
						runId
					},
					warnAfterMs: 5e3,
					onWait: (waitMs, queuedAhead) => {
						state.deps.log.warn({
							jobId: id,
							runId,
							waitMs,
							queuedAhead
						}, "cron: queued manual run waiting for an execution slot");
					}
				});
			} finally {
				if (!dispatched) try {
					await releasePreparedManualReservationAfterReloadWithRetry(state, prepared);
				} catch (cleanupError) {
					state.deps.log.warn({
						jobId: id,
						err: String(cleanupError)
					}, "cron: failed to release manual reservation after queue rejection");
				}
			}
		}, "cron:manual-run"));
	} catch (error) {
		activationSettled.resolve();
		releaseCallerAuthority?.();
		throw error;
	}
	const settled = queuedRun.catch(async (err) => {
		if (!accepted) {
			acceptance.reject(err);
			return;
		}
		if (terminalTracker.emitted) {
			state.deps.log.error({
				jobId: id,
				runId,
				err: String(err)
			}, "cron: queued manual run failed after emitting its terminal event");
			return;
		}
		const finishedAt = state.deps.nowMs();
		const job = state.store?.jobs.find((entry) => entry.id === id);
		await emitCronRunFinished(state, {
			jobId: id,
			action: "finished",
			job,
			status: "error",
			error: normalizeCronRunErrorText(err),
			runId,
			runAtMs: finishedAt,
			durationMs: 0,
			nextRunAtMs: job?.state.nextRunAtMs
		}, terminalTracker);
		state.deps.log.error({
			jobId: id,
			runId,
			err: String(err)
		}, "cron: queued manual run background execution failed");
	}).finally(() => {
		activationSettled.resolve();
		releaseCallerAuthority?.();
		state.queuedManualRuns.delete(runId);
	});
	state.queuedManualRuns.set(runId, settled);
	return await acceptance.promise;
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
			if (change.source && !ownsStreamSource(job, change.source.scheduleKey, change.source.identity)) return;
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
				prepare(routing) {
					if (routing.id !== jobId) throw new Error("Cron external policy differs from its admitted job");
					const cronConfig = change.kind === "failure" ? structuredClone(state.deps.cronConfig) : void 0;
					const value = {
						nowMs: state.deps.nowMs(),
						cronConfig,
						failureAlert: change.kind === "failure" ? resolveFailureAlert({ deps: { cronConfig } }, routing) : null
					};
					return {
						value,
						assertCurrent() {
							source.assertCurrent();
							if (change.kind === "failure" && (!isDeepStrictEqual(cronConfig, state.deps.cronConfig) || !isDeepStrictEqual(value.failureAlert, resolveFailureAlert(state, routing)))) throw new Error("Cron external failure policy changed before commit");
						}
					};
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
						runPostPersistCronNotifications(state, [notification]);
					}
					source.assertCurrent();
					armTimer(state);
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
		nextIdentity: createCronStreamSourceIdentity()
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
		this.state.schedulerStarted = false;
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
