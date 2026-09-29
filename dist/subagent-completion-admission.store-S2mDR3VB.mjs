import { c as readErrorName } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { a as getGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { n as computeBackoff } from "./src-D4OikzaT.mjs";
import { l as resolveAgentIdFromSessionKey, u as resolveEventSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { mt as upsertBoundDeliveryQueueEntryInDatabase, ot as bindDeliveryQueueEntry, ut as loadDeliveryQueueEntryInDatabase } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import "./backoff-CszdOMiF.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { T as resolveSessionStorePathForScope, d as patchSessionEntryCore, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { d as readTaskRecord, i as findTaskRecordByRunIdForViewInDatabase, ot as SUBAGENT_KILL_TASK_ERROR, t as bindTaskRecord, v as upsertTaskRunRowInDatabase } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { d as resolveTaskCleanupAfter } from "./task-registry.summary-BJx95J9k.mjs";
import { m as syncFlowFromTaskAfterTaskMutation } from "./task-registry-state-Cibd1d5c.mjs";
import { r as SUBAGENT_ENDED_OUTCOME_TIMEOUT, s as SUBAGENT_TARGET_KIND_SUBAGENT, t as SUBAGENT_ENDED_OUTCOME_ERROR } from "./subagent-lifecycle-events-CDQCTuLB.mjs";
import { c as getSubagentSessionRuntimeMs, d as resolveSubagentSessionStatus, j as subagentRuns, l as getSubagentSessionStartedAt, n as hasSubagentRunEnded } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { _ as getDeliveryAttemptCount, b as isCompletedRequesterDeliveryBlocked, g as ensureDeliveryState, h as ensureCompletionState, i as loadSubagentRunsForChildSessionFromSqlite, m as clearDeliveryState, p as bindSubagentRunRecord, s as readSubagentRun, v as getDeliveryLastError } from "./subagent-registry.store.sqlite-DcyWJbiA.mjs";
import { F as publishSubagentRunsAfterAtomicStore } from "./subagent-registry-read-C2SIiLpb.mjs";
import { r as upsertSubagentRunRowInDatabase, t as deleteSubagentRunRowInDatabase } from "./subagent-registry.store.kernel-BoNquCdf.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import { f as formatTaskBlockedFollowupMessage } from "./task-notification-routing-D910r5az.mjs";
import { t as publishTaskRecordAfterAtomicStore } from "./task-registry-J6rCfMnh.mjs";
import { t as compareSubagentRunGeneration } from "./subagent-run-generation-BpwN1g73.mjs";
import "./runtime-internal-BQjc0KPP.mjs";
import { i as failTaskRunByRunId, t as completeTaskRunByRunId, u as setDetachedTaskDeliveryStatusByRunId } from "./detached-task-runtime-DG7veuVf.mjs";
import { n as resolveRequiredCompletionTerminalResult, t as resolveRequiredCompletionDeliveryFailureTerminalResult } from "./task-completion-contract-bB2v-uXg.mjs";
import "./sessions-DE4llkPV.mjs";
import { a as getErrnoCode, d as resolveDeliveryRecoveryDeadlineMs, n as createDeliveryRecoveryCoordinator, r as createEmptyDeliveryRecoverySummary, s as isDeliveryRecoveryRetryEligible, t as computeBackoffMs } from "./delivery-recovery.shared-f5deCrTJ.mjs";
import { l as getDeliveryQueueEntryOwnersInDatabase } from "./delivery-queue-sqlite.kernel-Pf7zU9zY.mjs";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DdiIlFMt.mjs";
import { a as SessionDeliveryDeferredError, c as prepareClaimedSessionDelivery, i as SessionDeliveryDeadLetteredError, n as SessionDeliveryAcknowledgementFinalizeError, o as SessionDeliveryRetryChargedError, r as SessionDeliveryAttemptStartError, s as SessionDeliverySafeRetryError, t as SESSION_DELIVERY_QUEUE_NAME } from "./session-delivery-queue.records-rYJIeHGW.mjs";
import { c as loadPendingSessionDelivery, f as moveSessionDeliveryToFailed, n as completeSessionDelivery, o as failSessionDelivery, s as loadPendingSessionDeliveries, u as markSessionDeliverySettlement } from "./session-delivery-queue-storage-DSTuGS2l.mjs";
import { c as isSilentAgentReplyText } from "./message-visibility-yTJ46I8l.mjs";
import { n as resolveSessionRunError, t as recordGatewaySessionRunFailure } from "./session-run-error-HnadOxy-.mjs";
import { r as resolveSubagentSessionAttachmentRootDir } from "./subagent-attachment-paths-B8LC7Y0L.mjs";
import { r as resolveCompletionFromSessionEntry } from "./subagent-session-reconciliation-CvTPAhOj.mjs";
//#region src/agents/subagents/registry/subagent-registry-completion.ts
/**
* Subagent run completion helpers.
* Compares outcomes, maps them to lifecycle events, and emits completion hooks
* exactly once per completed child run.
*/
const log$1 = createSubsystemLogger("agents/subagent-registry-completion");
/** Classify execution independently of reply capture, including cancelled yielded runs. */
function resolveSubagentTaskTerminalStatus(entry) {
	const outcome = entry.execution.outcome;
	if (typeof entry.execution.endedAt !== "number" || !outcome || entry.pauseReason === "sessions_yield") return;
	if (entry.endedReason === "subagent-killed" && entry.suppressAnnounceReason !== "steer-restart") return "cancelled";
	return outcome.status === "ok" ? "succeeded" : outcome.status === "timeout" ? "timed_out" : "failed";
}
/** Returns the complete task projection only after completion capture has settled. */
function resolveFinalizedSubagentTaskState(entry) {
	const endedAt = entry.execution.endedAt;
	const outcome = entry.execution.outcome;
	const completion = entry.completion;
	const status = resolveSubagentTaskTerminalStatus(entry);
	if (typeof endedAt !== "number" || status === void 0 || completion?.resultText === void 0 && typeof completion?.capturedAt !== "number") return;
	const progressSummary = resolveSubagentCompletionResultText(entry);
	if (status === "cancelled") return {
		status: "cancelled",
		endedAt,
		lastEventAt: endedAt,
		error: SUBAGENT_KILL_TASK_ERROR,
		progressSummary,
		terminalSummary: null
	};
	if (status === "succeeded") {
		const terminal = entry.expectsCompletionMessage !== true ? {} : entry.delivery?.disposition === "intentional_non_delivery" ? {
			terminalOutcome: "succeeded",
			terminalSummary: null
		} : resolveRequiredCompletionTerminalResult(progressSummary);
		return {
			status: "succeeded",
			endedAt,
			lastEventAt: endedAt,
			progressSummary,
			terminalSummary: terminal.terminalSummary ?? null,
			terminalOutcome: terminal.terminalOutcome
		};
	}
	return {
		status,
		endedAt,
		lastEventAt: endedAt,
		error: outcome?.status === "error" ? outcome.error : void 0,
		progressSummary,
		terminalSummary: null
	};
}
/** Preserves execution end time, except when a paused run was killed after its yield. */
function resolveKilledSubagentTaskEndedAt(entry) {
	if (entry.killReconciliation) return entry.killReconciliation.killedAt;
	const endedAt = entry.execution.endedAt;
	const cleanupCompletedAt = entry.cleanupCompletedAt;
	return entry.suppressAnnounceReason === "killed" && typeof endedAt === "number" && typeof cleanupCompletedAt === "number" && cleanupCompletedAt > endedAt ? cleanupCompletedAt : endedAt;
}
/** Maps registry run outcome to lifecycle event outcome. */
function resolveLifecycleOutcomeFromRunOutcome(outcome) {
	if (outcome?.status === "error") return SUBAGENT_ENDED_OUTCOME_ERROR;
	if (outcome?.status === "timeout") return SUBAGENT_ENDED_OUTCOME_TIMEOUT;
	return "ok";
}
/** Emits the transient presentation event for a newly terminal child run. */
async function emitSubagentProgressEndedHook(entry) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("subagent_progress")) return;
	const outcome = entry.endedReason === "subagent-killed" ? "killed" : entry.execution.outcome ? resolveLifecycleOutcomeFromRunOutcome(entry.execution.outcome) : "unknown";
	try {
		await hookRunner.runSubagentProgress({
			phase: "ended",
			runId: entry.runId,
			childSessionKey: entry.childSessionKey,
			outcome,
			requester: entry.progressOrigin
		}, {
			runId: entry.runId,
			childSessionKey: entry.childSessionKey,
			requesterSessionKey: entry.requesterSessionKey
		});
	} catch (err) {
		log$1.warn(`failed to emit subagent progress for run ${entry.runId}: ${err instanceof Error ? err.message : String(err)}`);
	}
}
/** Emits the subagent_ended hook once per completed run. */
async function emitSubagentEndedHookOnce(params) {
	const runId = params.entry.runId.trim();
	if (!runId) return false;
	if (params.entry.endedHookEmittedAt) return false;
	if (params.inFlightRunIds.has(runId)) return false;
	params.inFlightRunIds.add(runId);
	try {
		const hookRunner = getGlobalHookRunner();
		if (!hookRunner) return false;
		if (hookRunner?.hasHooks("subagent_ended")) await hookRunner.runSubagentEnded({
			targetSessionKey: params.entry.childSessionKey,
			targetKind: SUBAGENT_TARGET_KIND_SUBAGENT,
			reason: params.reason,
			sendFarewell: params.sendFarewell,
			accountId: params.accountId,
			runId: params.entry.runId,
			endedAt: params.entry.execution.endedAt,
			outcome: params.outcome,
			error: params.error
		}, {
			runId: params.entry.runId,
			childSessionKey: params.entry.childSessionKey,
			requesterSessionKey: params.entry.requesterSessionKey
		});
		params.entry.endedHookEmittedAt = Date.now();
		params.persist(runId);
		return true;
	} catch (err) {
		log$1.warn(`failed to emit subagent_ended hook for run ${runId}: ${err instanceof Error ? err.message : String(err)}`);
		return false;
	} finally {
		params.inFlightRunIds.delete(runId);
	}
}
//#endregion
//#region src/infra/session-delivery-queue-recovery.ts
const MAX_SESSION_DELIVERY_RETRIES = 5;
const recoveryCoordinator = createDeliveryRecoveryCoordinator();
async function notifySessionDeliverySettled(params) {
	try {
		params.queueContext.admission.assertCurrent();
		await params.onSettled?.(params.entry, params.outcome, params.queueContext);
		return true;
	} catch (error) {
		params.log.error(`session delivery: settled callback failed for ${params.entry.id}: ${String(error)}`);
		return false;
	}
}
async function finalizeSessionDeliverySettlement(params) {
	if (!await notifySessionDeliverySettled(params)) return false;
	try {
		if (params.outcome === "recovered") await completeSessionDelivery(params.entry.id, params.queueContext);
		else await moveSessionDeliveryToFailed(params.entry.id, params.queueContext);
		return true;
	} catch (error) {
		params.log.error(`session delivery: ${params.outcome} finalization failed for ${params.entry.id}: ${String(error)}`);
		return false;
	}
}
function resolvePendingSettlementOutcome(entry) {
	return entry.settlementOutcome ?? (entry.acknowledgedAt !== void 0 ? "recovered" : void 0);
}
function resolveSessionDeliveryMaxRetries(entry) {
	return entry.maxRetries ?? MAX_SESSION_DELIVERY_RETRIES;
}
function canReconcileStartedAgentAttemptAtRetryLimit(entry) {
	return entry.kind === "agentTurn" && entry.deliveryStartedAt !== void 0 && entry.retryCount === resolveSessionDeliveryMaxRetries(entry);
}
function resolveSessionRetryEligibility(entry, now) {
	if (entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion") {
		if (now >= entry.owner.deadlineAt) return { eligible: true };
		const remainingBackoffMs = Math.max(0, (entry.availableAt ?? 0) - now);
		return remainingBackoffMs > 0 ? {
			eligible: false,
			remainingBackoffMs
		} : { eligible: true };
	}
	return isDeliveryRecoveryRetryEligible(entry, now);
}
async function processPendingSessionDelivery(opts) {
	const { entry, context } = opts;
	const pendingSettlementOutcome = resolvePendingSettlementOutcome(entry);
	if (pendingSettlementOutcome) return {
		status: pendingSettlementOutcome,
		finalized: await finalizeSessionDeliverySettlement({
			entry,
			log: context.log,
			onSettled: context.onSettled,
			outcome: pendingSettlementOutcome,
			queueContext: context.queueContext
		})
	};
	if (!canReconcileStartedAgentAttemptAtRetryLimit(entry) && entry.retryCount >= resolveSessionDeliveryMaxRetries(entry)) {
		await markSessionDeliverySettlement(entry, "moved-to-failed", context.queueContext);
		return {
			status: "max-retries",
			finalized: await finalizeSessionDeliverySettlement({
				entry,
				log: context.log,
				onSettled: context.onSettled,
				outcome: "moved-to-failed",
				queueContext: context.queueContext
			})
		};
	}
	if (!opts.bypassBackoff) {
		const retryEligibility = resolveSessionRetryEligibility(entry, Date.now());
		if (!retryEligibility.eligible) return {
			status: "backoff",
			remainingMs: retryEligibility.remainingBackoffMs
		};
	}
	if (await opts.beforeDelivery?.() === "stop") return { status: "stop" };
	let result;
	try {
		context.queueContext.admission.assertCurrent();
		await context.deliver(entry, { queueContext: context.queueContext });
		await markSessionDeliverySettlement(entry, "recovered", context.queueContext);
		result = "recovered";
	} catch (err) {
		if (err instanceof SessionDeliveryDeadLetteredError) {
			try {
				await markSessionDeliverySettlement(entry, "moved-to-failed", context.queueContext);
			} catch (markError) {
				if (markError instanceof SessionDeliveryAcknowledgementFinalizeError) return { status: "deferred" };
				throw markError;
			}
			result = "moved-to-failed";
		} else if (err instanceof SessionDeliveryDeferredError || err instanceof SessionDeliveryAcknowledgementFinalizeError || err instanceof SessionDeliveryAttemptStartError) return { status: "deferred" };
		else {
			const errMsg = formatErrorMessage(err);
			opts.onFailed?.(entry, errMsg);
			if (err instanceof SessionDeliveryRetryChargedError) return { status: "failed" };
			try {
				await failSessionDelivery(entry.id, errMsg, context.queueContext, { releaseAttemptOwnership: err instanceof SessionDeliverySafeRetryError });
			} catch (failErr) {
				if (getErrnoCode(failErr) === "ENOENT") return { status: "already-gone" };
				throw failErr;
			}
			return { status: "failed" };
		}
	}
	const finalized = await finalizeSessionDeliverySettlement({
		entry,
		log: context.log,
		onSettled: context.onSettled,
		outcome: result,
		queueContext: context.queueContext
	});
	return {
		status: result,
		finalized
	};
}
async function processDrainedSessionDelivery(entry, context, bypassBackoff) {
	const result = await processPendingSessionDelivery({
		entry,
		context,
		bypassBackoff,
		onFailed: (failedEntry, errMsg) => {
			context.log.warn(`${context.logLabel}: retry failed for entry ${failedEntry.id}: ${errMsg}`);
		}
	});
	if (result.status === "max-retries" && result.finalized) context.log.warn(`${context.logLabel}: entry ${entry.id} exceeded max retries and was moved to failed`);
	else if (result.status === "backoff") context.log.info(`${context.logLabel}: entry ${entry.id} not ready for retry yet — backoff ${result.remainingMs}ms remaining`);
	return result;
}
/** Drain one exact queued session delivery and return its final pending state. */
async function drainPendingSessionDelivery(opts) {
	const claim = await recoveryCoordinator.withClaim(opts.id, async () => {
		const entry = await loadPendingSessionDelivery(opts.id, opts.queueContext);
		if (!entry) return null;
		const result = await processDrainedSessionDelivery(entry, opts, opts.bypassBackoff);
		if (result.status === "already-gone" || "finalized" in result && result.finalized) return null;
		return result.status === "backoff" ? entry : loadPendingSessionDelivery(opts.id, opts.queueContext);
	});
	if (claim.status === "claimed-by-other-owner") {
		opts.log.info(`${opts.logLabel}: entry ${opts.id} is already being recovered`);
		return loadPendingSessionDelivery(opts.id, opts.queueContext);
	}
	return claim.value;
}
/** Replay pending session deliveries until the recovery budget is exhausted. */
async function recoverPendingSessionDeliveries(opts) {
	const pending = (await loadPendingSessionDeliveries(opts.queueContext)).filter((entry) => opts.maxEnqueuedAt == null || entry.enqueuedAt <= opts.maxEnqueuedAt);
	if (pending.length === 0) return createEmptyDeliveryRecoverySummary();
	const summary = createEmptyDeliveryRecoverySummary();
	const deadline = resolveDeliveryRecoveryDeadlineMs(opts.maxRecoveryMs);
	const onDeadlineExceeded = () => {
		opts.log.warn("Session delivery recovery time budget exceeded — remaining entries deferred");
	};
	const context = {
		...opts,
		logLabel: "Session delivery"
	};
	const beforeDelivery = async () => {
		if (await recoveryCoordinator.waitForReplay(deadline) === "deadline-exceeded") {
			onDeadlineExceeded();
			return "stop";
		}
		return "continue";
	};
	const onFailed = (_failedEntry, errMsg) => {
		summary.failed += 1;
		opts.log.warn(`Session delivery retry failed: ${errMsg}`);
	};
	await recoveryCoordinator.scan({
		entries: pending,
		loadEntry: (id) => loadPendingSessionDelivery(id, opts.queueContext),
		deadlineMs: deadline,
		onDeadlineExceeded,
		onEntry: async (currentEntry) => {
			if (opts.maxEnqueuedAt != null && currentEntry.enqueuedAt > opts.maxEnqueuedAt) return "continue";
			const result = await processPendingSessionDelivery({
				entry: currentEntry,
				context,
				beforeDelivery,
				onFailed
			});
			if (result.status === "max-retries") {
				summary.skippedMaxRetries += 1;
				return "continue";
			}
			if (result.status === "backoff") {
				summary.deferredBackoff += 1;
				return "continue";
			}
			if (result.status === "stop") return "stop";
			if (result.status === "recovered" && result.finalized) {
				summary.recovered += 1;
				opts.log.info(`Recovered session delivery ${currentEntry.id}`);
			}
			return "continue";
		}
	});
	return summary;
}
//#endregion
//#region src/infra/session-delivery-queue-runtime.ts
const RUNTIME_RELOAD_RETRY_MS = 1e3;
let runtime;
let runtimeGeneration = 0;
const scheduledEntries = /* @__PURE__ */ new Map();
let pendingScanTimer;
function clearScheduledEntries() {
	for (const scheduled of scheduledEntries.values()) clearTimeout(scheduled.timer);
	scheduledEntries.clear();
	if (pendingScanTimer) {
		clearTimeout(pendingScanTimer);
		pendingScanTimer = void 0;
	}
}
function armPendingScan(generation) {
	if (!runtime || generation !== runtimeGeneration || pendingScanTimer) return;
	pendingScanTimer = setTimeout(() => {
		pendingScanTimer = void 0;
		schedulePendingSessionDeliveries();
	}, RUNTIME_RELOAD_RETRY_MS);
	pendingScanTimer.unref?.();
}
function resolveRetryDelayMs(entry) {
	const claimDelayMs = Math.max(0, (entry.availableAt ?? 0) - Date.now());
	const deadlineDelayMs = entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion" ? Math.max(0, entry.owner.deadlineAt - Date.now()) : Number.POSITIVE_INFINITY;
	if (entry.retryCount <= 0) return Math.min(claimDelayMs, deadlineDelayMs);
	if (entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion") return Math.min(deadlineDelayMs, claimDelayMs);
	const attemptedAt = entry.lastAttemptAt ?? entry.enqueuedAt;
	return Math.min(deadlineDelayMs, Math.max(claimDelayMs, attemptedAt + computeBackoffMs(entry.retryCount) - Date.now()));
}
function armSessionDeliveryId(id, delayMs, generation) {
	if (!runtime || generation !== runtimeGeneration) return;
	const dueAt = performance.now() + delayMs;
	const existing = scheduledEntries.get(id);
	if (existing && existing.dueAt <= dueAt) return;
	if (existing) clearTimeout(existing.timer);
	const timer = setTimeout(() => {
		scheduledEntries.delete(id);
		runScheduledSessionDelivery(id, generation);
	}, delayMs);
	timer.unref?.();
	scheduledEntries.set(id, {
		timer,
		dueAt
	});
}
function armSessionDelivery(entry, generation, minimumDelayMs = 0) {
	if (runtime?.runningEntries.has(entry.id)) return;
	armSessionDeliveryId(entry.id, Math.max(minimumDelayMs, resolveRetryDelayMs(entry)), generation);
}
async function runScheduledSessionDelivery(id, generation) {
	const activeRuntime = runtime;
	if (!activeRuntime || generation !== runtimeGeneration) return;
	if (activeRuntime.runningEntries.has(id)) return;
	const settled = createDeferredCore();
	activeRuntime.runningEntries.set(id, settled.promise);
	let pending = null;
	try {
		pending = await (activeRuntime.drain ?? drainPendingSessionDelivery)({
			id,
			queueContext: activeRuntime.queueContext,
			logLabel: "session delivery",
			log: activeRuntime.log,
			deliver: activeRuntime.deliver,
			onSettled: activeRuntime.onSettled
		});
	} catch (error) {
		activeRuntime.log.error(`session delivery: runtime drain failed for ${id}: ${String(error)}`);
		if (runtime && generation === runtimeGeneration) armSessionDeliveryId(id, RUNTIME_RELOAD_RETRY_MS, generation);
	} finally {
		activeRuntime.runningEntries.delete(id);
		settled.resolve();
	}
	if (!runtime || generation !== runtimeGeneration) return;
	if (pending) armSessionDelivery(pending, generation, RUNTIME_RELOAD_RETRY_MS);
}
/** Register callbacks; stop fences scheduling and joins admitted reads and drains. */
function startSessionDeliveryRuntime(params) {
	runtimeGeneration += 1;
	const generation = runtimeGeneration;
	clearScheduledEntries();
	const activeRuntime = {
		...params,
		runningEntries: /* @__PURE__ */ new Map(),
		pendingSchedules: /* @__PURE__ */ new Set()
	};
	runtime = activeRuntime;
	let stopPromise;
	return () => {
		if (runtimeGeneration === generation) {
			runtimeGeneration += 1;
			runtime = void 0;
			clearScheduledEntries();
		}
		stopPromise ??= Promise.all([...activeRuntime.runningEntries.values(), ...activeRuntime.pendingSchedules]).then(() => {});
		return stopPromise;
	};
}
/** Schedule one durable entry when a gateway runtime is available. */
async function scheduleSessionDelivery(id, queueContext) {
	const generation = runtimeGeneration;
	const activeRuntime = runtime;
	if (!activeRuntime) return false;
	try {
		queueContext.admission.assertCurrent();
		activeRuntime.queueContext.admission.assertCurrent();
		if (queueContext.admission.identity.key !== activeRuntime.queueContext.admission.identity.key) {
			activeRuntime.log.error(`session delivery: ${id} belongs to another state database`);
			return false;
		}
	} catch (error) {
		activeRuntime.log.error(`session delivery: cannot schedule ${id} for a retired state owner: ${String(error)}`);
		return false;
	}
	const settled = createDeferredCore();
	activeRuntime.pendingSchedules.add(settled.promise);
	try {
		let entry;
		try {
			entry = await (activeRuntime.reloadPending ?? loadPendingSessionDelivery)(id, activeRuntime.queueContext);
		} catch (error) {
			activeRuntime.log.error(`session delivery: failed to load ${id}: ${String(error)}`);
			armSessionDeliveryId(id, RUNTIME_RELOAD_RETRY_MS, generation);
			return true;
		}
		if (!entry || !runtime || generation !== runtimeGeneration) return !entry;
		armSessionDelivery(entry, generation);
		return true;
	} finally {
		activeRuntime.pendingSchedules.delete(settled.promise);
		settled.resolve();
	}
}
/** Schedule every pending entry after startup recovery installs the runtime owner. */
async function schedulePendingSessionDeliveries() {
	const generation = runtimeGeneration;
	const activeRuntime = runtime;
	if (!activeRuntime) return;
	const settled = createDeferredCore();
	activeRuntime.pendingSchedules.add(settled.promise);
	try {
		let entries;
		try {
			entries = await (activeRuntime.listPending ?? loadPendingSessionDeliveries)(activeRuntime.queueContext);
		} catch (error) {
			activeRuntime.log.error(`session delivery: failed to scan pending entries: ${String(error)}`);
			armPendingScan(generation);
			return;
		}
		if (!runtime || generation !== runtimeGeneration) return;
		for (const entry of entries) armSessionDelivery(entry, generation);
	} finally {
		activeRuntime.pendingSchedules.delete(settled.promise);
		settled.resolve();
	}
}
//#endregion
//#region src/agents/announce-idempotency.ts
const ANNOUNCE_IDEMPOTENCY_KEY_PREFIX = "announce:";
/** Build the persisted announce id for a child session/run pair. */
function buildAnnounceIdFromChildRun(params) {
	return `v1:${params.childSessionKey}:${params.childRunId}`;
}
/** Build the idempotency key used by announce delivery storage. */
function buildAnnounceIdempotencyKey(announceId) {
	return `${ANNOUNCE_IDEMPOTENCY_KEY_PREFIX}${announceId}`;
}
//#endregion
//#region src/agents/subagents/subagent-attachment-cleanup.ts
/** Removes host-owned subagent attachment artifacts by generated identity. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function removeSubagentAttachmentTree(rootDir, attachmentId, assertBeforeMutation) {
	if (!UUID_RE.test(attachmentId)) throw new Error("invalid subagent attachment identity");
	assertBeforeMutation?.();
	try {
		await (await root(rootDir)).remove(attachmentId, {
			recursive: true,
			force: true,
			...assertBeforeMutation ? { assertBeforeMutation } : {}
		});
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "not-found")) throw error;
	}
}
async function cleanupMaterializedSubagentAttachments(params) {
	const rootDir = resolveSubagentSessionAttachmentRootDir({
		agentId: resolveAgentIdFromSessionKey(params.childSessionKey),
		childSessionKey: params.childSessionKey
	});
	const isCurrent = params.isCurrent;
	await removeSubagentAttachmentTree(rootDir, params.attachmentId, isCurrent ? () => {
		if (!isCurrent()) throw new Error("subagent attachment cleanup owner is no longer current");
	} : void 0);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-helpers.ts
/**
* Subagent registry persistence and recovery helpers.
*
* Handles frozen results, attachment cleanup, timing persistence, and announce retry logging.
*/
const PROVISIONAL_KILL_RECONCILIATION_MS = 3e5;
const MIN_ANNOUNCE_RETRY_DELAY_MS = 15e3;
const MAX_ANNOUNCE_RETRY_DELAY_MS = 3e5;
const ANNOUNCE_RETRY_JITTER = .2;
const ANNOUNCE_EXPIRY_MS = 3e5;
const ANNOUNCE_COMPLETION_HARD_EXPIRY_MS = 18e5;
const ANNOUNCE_RETRY_BACKOFF = {
	initialMs: MIN_ANNOUNCE_RETRY_DELAY_MS,
	maxMs: MAX_ANNOUNCE_RETRY_DELAY_MS,
	factor: 2,
	jitter: ANNOUNCE_RETRY_JITTER
};
const FROZEN_RESULT_TEXT_MAX_BYTES = 102400;
/** Caps frozen completion text stored for later announce/recovery delivery. */
function capFrozenResultText(resultText) {
	const trimmed = resultText.trim();
	if (!trimmed) return "";
	const totalBytes = Buffer.byteLength(trimmed, "utf8");
	if (totalBytes <= FROZEN_RESULT_TEXT_MAX_BYTES) return trimmed;
	const notice = `\n\n[truncated: frozen completion output exceeded ${Math.round(FROZEN_RESULT_TEXT_MAX_BYTES / 1024)}KB (${Math.round(totalBytes / 1024)}KB)]`;
	const maxPayloadBytes = Math.max(0, FROZEN_RESULT_TEXT_MAX_BYTES - Buffer.byteLength(notice, "utf8"));
	return `${truncateUtf8Prefix(trimmed, maxPayloadBytes)}${notice}`;
}
/** Computes bounded exponential backoff for subagent announce retries. */
function resolveAnnounceRetryDelayMs(retryCount) {
	return computeBackoff(ANNOUNCE_RETRY_BACKOFF, Math.max(1, retryCount));
}
function formatAnnounceGiveUpLogField(value) {
	const normalized = value.replace(/\s+/g, " ").trim();
	return JSON.stringify(normalized.length > 2e3 ? `${truncateUtf16Safe(normalized, 2e3)}…` : normalized);
}
/** Logs a sanitized final give-up line for failed subagent announce delivery. */
function logAnnounceGiveUp(entry, reason) {
	const retryCount = getDeliveryAttemptCount(entry);
	const endedAt = entry.execution.endedAt;
	const endedAgoMs = typeof endedAt === "number" ? Math.max(0, Date.now() - endedAt) : void 0;
	const endedAgoLabel = endedAgoMs != null ? `${Math.round(endedAgoMs / 1e3)}s` : "n/a";
	const lastDeliveryError = getDeliveryLastError(entry);
	const deliveryError = lastDeliveryError ? ` deliveryError=${formatAnnounceGiveUpLogField(lastDeliveryError)}` : "";
	defaultRuntime.log(`[warn] Subagent announce give up (${reason}) run=${entry.runId} child=${entry.childSessionKey} requester=${entry.requesterSessionKey} retries=${retryCount} endedAgo=${endedAgoLabel}${deliveryError}`);
}
/** Persists child session timing/status derived from the subagent registry row. */
async function persistSubagentSessionTiming(entry, options) {
	const childSessionKey = entry.childSessionKey?.trim();
	if (!childSessionKey) return;
	const cfg = getRuntimeConfig();
	const agentId = resolveAgentIdFromSessionKey(childSessionKey);
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const startedAt = getSubagentSessionStartedAt(entry);
	const endedAt = typeof entry.execution.endedAt === "number" && Number.isFinite(entry.execution.endedAt) ? entry.execution.endedAt : void 0;
	const runtimeMs = endedAt !== void 0 ? getSubagentSessionRuntimeMs(entry, endedAt) : getSubagentSessionRuntimeMs(entry);
	const status = resolveSubagentSessionStatus(entry);
	const lastRunError = status ? resolveSessionRunError(entry.execution.outcome ?? {}, status) : void 0;
	const persisted = await patchSessionEntryCore({
		storePath,
		sessionKey: childSessionKey
	}, (sessionEntry) => {
		if (options?.isCurrentGeneration && !options.isCurrentGeneration()) return null;
		if (status === "killed") {
			const existingCompletion = resolveCompletionFromSessionEntry(sessionEntry, Date.now(), { notBeforeMs: entry.execution.startedAt ?? entry.createdAt });
			if (existingCompletion && existingCompletion.reason !== "subagent-killed") {
				if (sessionEntry.abortedLastRun !== true) return null;
				const completedEntry = { ...sessionEntry };
				delete completedEntry.abortedLastRun;
				return completedEntry;
			}
		}
		const next = { ...sessionEntry };
		if (typeof startedAt === "number" && Number.isFinite(startedAt)) next.startedAt = startedAt;
		else delete next.startedAt;
		if (typeof endedAt === "number" && Number.isFinite(endedAt)) next.endedAt = endedAt;
		else delete next.endedAt;
		if (typeof runtimeMs === "number" && Number.isFinite(runtimeMs)) next.runtimeMs = runtimeMs;
		else delete next.runtimeMs;
		if (status) next.status = status;
		else delete next.status;
		if (lastRunError) next.lastRunError = lastRunError;
		else if (status === "done") delete next.lastRunError;
		if (status && status !== "killed") delete next.abortedLastRun;
		return next;
	}, {
		shouldCommit: options?.isCurrentGeneration,
		assertCommitAllowed: options?.assertCommitAllowed,
		replaceEntry: true
	});
	if (persisted && lastRunError) await recordGatewaySessionRunFailure({
		target: {
			agentId,
			storePath,
			sessionKey: childSessionKey,
			sessionId: persisted.sessionId,
			expectedLifecycleRevision: persisted.lifecycleRevision
		},
		runId: entry.runId,
		error: entry.execution.outcome?.error,
		assertCommitAllowed: options?.assertCommitAllowed
	});
}
/** Best-effort async removal for a subagent attachment directory. */
async function safeRemoveAttachmentsDir(entry) {
	if (!entry.attachmentId) return true;
	try {
		await cleanupMaterializedSubagentAttachments({
			childSessionKey: entry.childSessionKey,
			attachmentId: entry.attachmentId
		});
		return true;
	} catch {
		return false;
	}
}
/** Resolves the completed subagent archive delay from config. */
function resolveArchiveAfterMs(cfg) {
	const minutes = (cfg ?? getRuntimeConfig()).agents?.defaults?.subagents?.archiveAfterMinutes ?? 60;
	if (!Number.isFinite(minutes) || minutes < 0) return;
	if (minutes === 0) return;
	return Math.max(1, Math.floor(minutes)) * 6e4;
}
/** Arms retention only after the run or its waitable collector result has completed. */
function updateSubagentArchiveAtMs(entry, cfg) {
	const endedAt = typeof entry.execution.endedAt === "number" && Number.isFinite(entry.execution.endedAt) ? entry.execution.endedAt : void 0;
	const completedAt = entry.collect ? endedAt === void 0 && !entry.collectorCompletion ? void 0 : typeof entry.completion?.capturedAt === "number" && Number.isFinite(entry.completion.capturedAt) ? entry.completion.capturedAt : endedAt : entry.cleanup === "delete" && entry.pauseReason !== "sessions_yield" ? endedAt : void 0;
	const archiveAfterMs = entry.spawnMode === "session" || completedAt === void 0 ? void 0 : resolveArchiveAfterMs(cfg);
	const expectedArchiveAt = completedAt !== void 0 && archiveAfterMs !== void 0 ? completedAt + archiveAfterMs : void 0;
	if (entry.archiveAtMs === expectedArchiveAt) return false;
	if (expectedArchiveAt === void 0) delete entry.archiveAtMs;
	else entry.archiveAtMs = expectedArchiveAt;
	return true;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-lifecycle-delivery.ts
const DELIVERY_MIRROR_HISTORY_MAX_CHARS = 131072;
function buildSafeLifecycleErrorMeta(error) {
	const message = formatErrorMessage(error);
	const name = readErrorName(error);
	return name ? {
		name,
		message
	} : { message };
}
function maskLifecycleIdentifier(value, kind) {
	const trimmed = value.trim();
	if (!trimmed) return "unknown";
	return kind === "session" ? `${trimmed.split(":").slice(0, 2).join(":") || "session"}:…` : trimmed.length <= 8 ? "***" : `${sliceUtf16Safe(trimmed, 0, 4)}…${sliceUtf16Safe(trimmed, -4)}`;
}
const formatAnnounceDeliveryError = (delivery) => {
	const errors = [
		delivery.error,
		delivery.reason,
		...(delivery.phases ?? []).map((phase) => phase.error ? `${phase.phase}: ${phase.error}` : void 0)
	].map((value) => value?.trim()).filter((value) => Boolean(value));
	return errors.length > 0 ? uniqueStrings(errors).join("; ") : `delivery path ${delivery.path} did not complete`;
};
const recordAnnounceDeliveryResult = (entry, delivery, runs) => {
	const deliveryState = ensureDeliveryState(entry);
	if (typeof delivery.enqueuedAt === "number") deliveryState.enqueuedAt ??= delivery.enqueuedAt;
	if (!delivery.delivered && delivery.disposition !== "intentional_non_delivery") {
		if (delivery.reason === "message_tool_delivery_missing") deliveryState.lastDropReason = "message_tool_delivery_missing";
		else if (delivery.reason === "steer_dropped" || delivery.phases?.some((phase) => phase.reason === "steer_dropped")) deliveryState.lastDropReason = "steer_dropped";
		else if (delivery.path === "none") deliveryState.lastDropReason = "sink_unavailable";
	}
	if (delivery.delivered) {
		deliveryState.deliveredAt = typeof delivery.deliveredAt === "number" ? delivery.deliveredAt : Date.now();
		deliveryState.lastDropReason = void 0;
		const requesterTurnRunId = entry.requesterTurnRunId?.trim();
		if (delivery.path === "direct" && delivery.requesterVisibleFinalDelivered && requesterTurnRunId) {
			const siblings = [...runs?.values() ?? []].filter((sibling) => sibling.requesterSessionKey === entry.requesterSessionKey && sibling.requesterTurnRunId === requesterTurnRunId && sibling.expectsCompletionMessage === true);
			if (siblings.some((sibling) => sibling === entry) && siblings.every((sibling) => sibling.execution.status === "terminal" && hasSubagentRunEnded(sibling) && (sibling === entry || sibling.delivery?.status === "delivered"))) deliveryState.requesterVisibleFinal = {
				requesterTurnRunId,
				batchRunIds: siblings.map((sibling) => sibling.runId).toSorted()
			};
		}
	}
	deliveryState.disposition = delivery.disposition ?? (delivery.delivered ? "delivered" : "retryable");
};
const markRequesterSettleWakePending = (entry, options) => {
	const existing = entry.requesterSettleWake;
	entry.requesterSettleWake = {
		...structuredClone(existing),
		status: existing?.status ?? "pending",
		attemptCount: existing?.attemptCount ?? 0,
		...existing?.retireAfterSettle === true || options?.retireAfterSettle === true ? { retireAfterSettle: true } : {}
	};
};
const hasPriorRequesterDeliveryMirror = async (params, entry) => {
	const completion = ensureCompletionState(entry);
	const expectedText = extractTextFromChatContent(completion.resultText, { joinWith: "" });
	if (entry.completionTarget === "parent" || entry.expectsCompletionMessage !== true || expectedText == null) return false;
	const mirrorNotBefore = entry.execution.startedAt ?? entry.createdAt;
	const mirrorNotAfter = Date.now() + 3e4;
	const expectedIdempotencyKey = buildAnnounceIdempotencyKey(buildAnnounceIdFromChildRun({
		childSessionKey: entry.childSessionKey,
		childRunId: entry.runId
	}));
	const isExpectedMirrorIdempotencyKey = (value) => typeof value === "string" && (value === expectedIdempotencyKey || value.startsWith(`${expectedIdempotencyKey}:internal-source-reply:`) || value.startsWith(`${expectedIdempotencyKey}:message-tool:internal-source-reply:`) || value.startsWith(`${entry.runId}:message-tool:`) || value.startsWith(`${entry.runId}:internal-source-reply:`));
	try {
		const mirror = (await withPluginRuntimeGatewayContextResolver(getGatewayContextResolver(entry), () => params.callGateway({
			method: "chat.history",
			params: {
				sessionKey: entry.requesterSessionKey,
				limit: 25,
				maxChars: DELIVERY_MIRROR_HISTORY_MAX_CHARS
			},
			timeoutMs: 5e3
		}))).messages?.find((message) => {
			if (!message || typeof message !== "object") return false;
			const record = message;
			const timestamp = record.timestamp;
			if (typeof timestamp !== "number" || !Number.isFinite(timestamp) || timestamp < mirrorNotBefore || timestamp > mirrorNotAfter || !isExpectedMirrorIdempotencyKey(record.idempotencyKey)) return false;
			const text = extractTextFromChatContent(record.content, { joinWith: "" });
			return record.role === "assistant" && record.provider === "openclaw" && record.model === "delivery-mirror" && text === expectedText;
		});
		if (mirror && entry.delivery?.status !== "delivered") ensureDeliveryState(entry).deliveredAt = mirror.timestamp;
		return Boolean(mirror);
	} catch {
		return false;
	}
};
const resolveSubagentTaskTarget = (params, entry, resolution = params.resolveSubagentTask(entry)) => {
	const durableTaskRunId = entry.taskRunId ?? entry.runId;
	return {
		runId: resolution.lookup === "available" ? resolution.task?.runId ?? durableTaskRunId : durableTaskRunId,
		sessionKey: resolution.lookup === "available" ? resolution.task?.childSessionKey ?? entry.childSessionKey : entry.childSessionKey
	};
};
const safeSetSubagentTaskDeliveryStatus = (params, args) => {
	const target = resolveSubagentTaskTarget(params, args.entry);
	try {
		setDetachedTaskDeliveryStatusByRunId({
			runId: target.runId,
			runtime: "subagent",
			sessionKey: target.sessionKey,
			deliveryStatus: args.deliveryStatus,
			error: args.deliveryStatus === "failed" ? args.deliveryError : void 0
		});
	} catch (err) {
		params.warn("failed to update subagent background task delivery state", {
			error: buildSafeLifecycleErrorMeta(err),
			runId: maskLifecycleIdentifier(target.runId, "run"),
			childSessionKey: maskLifecycleIdentifier(target.sessionKey, "session"),
			deliveryStatus: args.deliveryStatus
		});
	}
};
const finalizeSubagentTaskRun = (params, args) => {
	const terminal = resolveFinalizedSubagentTaskState(args.entry);
	if (!terminal) return [];
	const taskResolution = args.taskResolution ?? params.resolveSubagentTask(args.entry);
	const pendingTask = taskResolution.lookup === "available" && taskResolution.task && !isTerminalTaskStatus(taskResolution.task.status) ? taskResolution.task : void 0;
	const target = resolveSubagentTaskTarget(params, args.entry, taskResolution);
	const { status, error, terminalOutcome, ...details } = terminal;
	const suppressDelivery = args.entry.suppressCompletionDelivery === true;
	let finalized;
	try {
		if (status === "succeeded") finalized = completeTaskRunByRunId({
			runId: target.runId,
			runtime: "subagent",
			sessionKey: target.sessionKey,
			...details,
			terminalOutcome,
			suppressDelivery
		});
		else finalized = failTaskRunByRunId({
			runId: target.runId,
			runtime: "subagent",
			sessionKey: target.sessionKey,
			...details,
			status,
			error,
			suppressDelivery
		});
	} catch (err) {
		params.warn("failed to finalize subagent background task state", {
			error: buildSafeLifecycleErrorMeta(err),
			runId: maskLifecycleIdentifier(args.entry.runId, "run"),
			childSessionKey: maskLifecycleIdentifier(args.entry.childSessionKey, "session"),
			outcomeStatus: args.outcome.status
		});
		if (pendingTask) throw err;
		return [];
	}
	if (pendingTask && !finalized?.some((task) => task.taskId === pendingTask.taskId && isTerminalTaskStatus(task.status))) throw new Error("subagent task projection did not finalize");
	return finalized;
};
const freezeRunResultAtCompletion = async (context, entry, outcome) => {
	const params = context.options;
	if (ensureCompletionState(entry).resultText !== void 0) return false;
	if (outcome.status === "error") {
		const completion = ensureCompletionState(entry);
		completion.resultText = null;
		completion.capturedAt = Date.now();
		return true;
	}
	let resultText;
	try {
		const transcriptTarget = entry.execution.transcriptTarget;
		const agentId = transcriptTarget?.agentId ?? resolveAgentIdFromSessionKey(entry.childSessionKey);
		const sessionKey = transcriptTarget?.sessionKey ?? entry.childSessionKey;
		const configuredStorePath = agentId ? transcriptTarget?.storePath ?? resolveSessionStorePathCore(params.getRuntimeConfig().session?.store, { agentId }) : void 0;
		const storePath = configuredStorePath ? resolveSessionStorePathForScope({
			agentId,
			sessionKey,
			storePath: configuredStorePath
		}) : void 0;
		const sessionId = transcriptTarget?.sessionId ?? (agentId && storePath ? loadSessionEntryReadOnly({
			agentId,
			sessionKey,
			storePath
		})?.sessionId : void 0);
		const sessionTarget = agentId && sessionId && storePath ? {
			agentId,
			sessionId,
			sessionKey,
			storePath
		} : void 0;
		const captured = await withPluginRuntimeGatewayContextResolver(getGatewayContextResolver(entry), () => params.captureSubagentCompletionReply(entry.childSessionKey, {
			waitForReply: entry.expectsCompletionMessage === true,
			outcome,
			...sessionTarget ? { sessionTarget } : {}
		}));
		resultText = captured?.trim() ? capFrozenResultText(captured) : null;
	} catch {
		resultText = null;
	}
	const liveEntry = params.runs.get(entry.runId);
	if (entry.pauseReason === "sessions_yield" || liveEntry?.pauseReason === "sessions_yield" || context.newerGenerationOwnsSession(entry)) return false;
	const completion = ensureCompletionState(entry);
	if (completion.resultText !== void 0) return false;
	completion.resultText = resultText;
	completion.capturedAt = Date.now();
	return true;
};
const refreshFrozenResultFromSession = async (context, sessionKey) => {
	const params = context.options;
	const key = sessionKey.trim();
	if (!key) return false;
	const candidates = [];
	for (const entry of params.runs.values()) if (entry.childSessionKey === key && entry.expectsCompletionMessage === true && typeof entry.execution.endedAt === "number" && typeof entry.cleanupCompletedAt !== "number" && entry.pauseReason !== "sessions_yield" && entry.execution.outcome?.status !== "error") candidates.push(entry);
	const entry = candidates.toSorted(compareSubagentRunGeneration).at(-1);
	if (!entry || context.newerGenerationOwnsSession(entry)) return false;
	const generation = entry.generation;
	let captured;
	try {
		captured = await withPluginRuntimeGatewayContextResolver(getGatewayContextResolver(entry), () => params.captureSubagentCompletionReply(sessionKey));
	} catch {
		return false;
	}
	const trimmed = captured?.trim();
	if (!trimmed || isSilentAgentReplyText(trimmed)) return false;
	if (params.runs.get(entry.runId) !== entry || entry.generation !== generation || context.newerGenerationOwnsSession(entry)) return false;
	const nextFrozen = capFrozenResultText(trimmed);
	const completion = ensureCompletionState(entry);
	if (completion.resultText === nextFrozen) return false;
	completion.resultText = nextFrozen;
	completion.capturedAt = Date.now();
	params.persist(entry.runId);
	return true;
};
const emitCompletionEndedHookIfNeeded = async (params, entry, reason, isCurrent) => {
	if (params.shouldEmitEndedHookForRun({
		entry,
		reason
	})) await params.emitSubagentEndedHookForRun({
		entry,
		reason,
		sendFarewell: true,
		isCurrent
	});
};
const clearSubagentPendingDelivery = (entry) => {
	const delivery = ensureDeliveryState(entry);
	delivery.payload = void 0;
	delivery.createdAt = void 0;
	delivery.lastAttemptAt = void 0;
	delivery.nextAttemptAt = void 0;
	delivery.attemptCount = void 0;
	delivery.lastError = void 0;
	delivery.suspendedAt = void 0;
	delivery.suspendedReason = void 0;
	if (delivery.status !== "delivered" && delivery.status !== "failed") clearDeliveryState(entry);
};
const loadPendingFinalDeliveryPayload = (entry) => {
	return {
		requesterSessionKey: entry.delivery?.payload?.requesterSessionKey ?? entry.requesterSessionKey,
		requesterOrigin: entry.delivery?.payload?.requesterOrigin ?? entry.requesterOrigin,
		requesterDisplayKey: entry.delivery?.payload?.requesterDisplayKey ?? entry.requesterDisplayKey,
		childSessionKey: entry.delivery?.payload?.childSessionKey ?? entry.childSessionKey,
		childRunId: entry.delivery?.payload?.childRunId ?? entry.runId,
		task: entry.delivery?.payload?.task ?? entry.task,
		label: entry.delivery?.payload?.label ?? entry.label,
		startedAt: entry.delivery?.payload?.startedAt ?? entry.execution.startedAt,
		endedAt: entry.delivery?.payload?.endedAt ?? entry.execution.endedAt,
		outcome: entry.delivery?.payload?.outcome ?? entry.execution.outcome,
		expectsCompletionMessage: entry.delivery?.payload?.expectsCompletionMessage ?? entry.expectsCompletionMessage,
		completionTarget: entry.completionTarget,
		completionRequesterSessionId: entry.completionRequesterSessionId,
		spawnMode: entry.delivery?.payload?.spawnMode ?? entry.spawnMode,
		wakeOnDescendantSettle: entry.delivery?.payload?.wakeOnDescendantSettle ?? entry.wakeOnDescendantSettle,
		terminalReply: entry.completion?.terminalReply ?? entry.delivery?.payload?.terminalReply
	};
};
const markPendingFinalDelivery = (args) => {
	const now = Date.now();
	const payload = loadPendingFinalDeliveryPayload(args.entry);
	const delivery = ensureDeliveryState(args.entry);
	delivery.status = "pending";
	delivery.createdAt ??= now;
	delivery.lastAttemptAt = now;
	delivery.attemptCount = (delivery.attemptCount ?? 0) + 1;
	delivery.lastError = args.error ?? null;
	delivery.payload = payload;
};
const refreshPendingFinalDeliveryPayload = (entry) => {
	const delivery = entry.delivery;
	if (!delivery?.payload || delivery.status === "delivered" || typeof delivery.announcedAt === "number") return false;
	delivery.payload = {
		...delivery.payload,
		startedAt: entry.execution.startedAt,
		endedAt: entry.execution.endedAt,
		outcome: entry.execution.outcome,
		terminalReply: entry.completion?.terminalReply
	};
	return true;
};
//#endregion
//#region src/agents/subagents/completion/subagent-completion-admission.store.ts
const log = createSubsystemLogger("subagents/completion");
const SUSPENDED_RETENTION_MS = 6048e5;
function invokeSynchronousHook(hook) {
	const result = hook?.();
	if (result && typeof result.then === "function") throw new Error("subagent completion admission transaction hooks must be synchronous");
}
function replaceCommittedSubagent(subagent) {
	const live = subagentRuns.get(subagent.runId);
	if (live) {
		for (const key of Object.keys(live)) Reflect.deleteProperty(live, key);
		Object.assign(live, subagent);
	} else subagentRuns.set(subagent.runId, subagent);
}
function publishCommittedSubagent(subagent, deferredObserverEvents = []) {
	replaceCommittedSubagent(subagent);
	publishSubagentRunsAfterAtomicStore(subagentRuns, [subagent.runId], deferredObserverEvents);
	return deferredObserverEvents;
}
function publishCommittedRecords(subagent, task) {
	const deferredObserverEvents = [];
	publishCommittedSubagent(subagent, deferredObserverEvents);
	const published = publishTaskRecordAfterAtomicStore(task, { deferredObserverEvents });
	syncFlowFromTaskAfterTaskMutation(published, "atomic completion admission");
	for (const emitObserverEvent of deferredObserverEvents) emitObserverEvent();
}
function assertCorrelatedEntry(params) {
	const owner = params.queueEntry.kind === "agentTurn" ? params.queueEntry.owner : void 0;
	const delivery = params.subagent.delivery;
	if (!owner || owner.kind !== "subagent_completion" || owner.runId !== params.subagent.runId || owner.taskId !== params.task.taskId || owner.generation !== delivery?.generation || owner.deadlineAt !== delivery.deadlineAt || params.queueEntry.id !== delivery.queueId || params.task.deliveryStatus !== "session_queued") throw new Error("subagent completion admission records do not share one owner generation");
}
/**
* Commits the physical queue generation, logical completion owner, and task
* projection as one database-only transaction on one exact shared-state handle.
*/
function admitSubagentCompletionDelivery(params) {
	assertCorrelatedEntry(params);
	const boundQueue = bindDeliveryQueueEntry({
		queueName: SESSION_DELIVERY_QUEUE_NAME,
		entry: params.queueEntry,
		insertOnly: true
	});
	const boundSubagent = bindSubagentRunRecord(params.subagent);
	const boundTask = bindTaskRecord(params.task);
	invokeSynchronousHook(params.testHooks?.afterBind);
	return runOpenClawStateWriteTransaction((database) => {
		const claimed = upsertBoundDeliveryQueueEntryInDatabase(boundQueue, database);
		invokeSynchronousHook(() => params.testHooks?.afterMutation?.("queue", database));
		if (!claimed) {
			const existing = loadDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, params.queueEntry.id);
			const expectedOwner = params.queueEntry.kind === "agentTurn" ? params.queueEntry.owner : void 0;
			const existingOwner = existing?.kind === "agentTurn" ? existing.owner : void 0;
			if (!existingOwner || !expectedOwner || existingOwner.kind !== expectedOwner.kind || existingOwner.runId !== expectedOwner.runId || existingOwner.taskId !== expectedOwner.taskId || existingOwner.generation !== expectedOwner.generation || existingOwner.deadlineAt !== expectedOwner.deadlineAt) throw new Error(`session delivery queue conflict for ${params.queueEntry.id}`);
		}
		upsertSubagentRunRowInDatabase(database, boundSubagent);
		invokeSynchronousHook(() => params.testHooks?.afterMutation?.("subagent", database));
		upsertTaskRunRowInDatabase(database, boundTask);
		invokeSynchronousHook(() => params.testHooks?.afterMutation?.("task", database));
		return {
			claimed,
			status: getDeliveryQueueEntryOwnersInDatabase(database, ["session"], params.queueEntry.id).get("session")?.status ?? "pending"
		};
	}, params.databaseOptions, { operationLabel: "subagent completion delivery admission" });
}
/** Atomically consumes a correlated queue settlement into registry and task projections. */
function settleSubagentCompletionDelivery(params) {
	const boundTask = bindTaskRecord(params.task);
	runOpenClawStateWriteTransaction((database) => {
		invokeSynchronousHook(() => params.mutateSubagent?.(params.subagent));
		upsertSubagentRunRowInDatabase(database, bindSubagentRunRecord(params.subagent));
		upsertTaskRunRowInDatabase(database, boundTask);
	}, params.databaseOptions, { operationLabel: "subagent completion delivery settlement" });
}
function retiredCancellationEndedAt(subagent, now) {
	const endedAt = subagent.execution.endedAt;
	if (subagent.execution.status !== "terminal" || subagent.execution.outcome?.status !== "error" || subagent.endedReason !== "subagent-killed" || typeof endedAt !== "number" || !Number.isFinite(endedAt) || typeof subagent.cleanupCompletedAt !== "number" || !Number.isFinite(subagent.cleanupCompletedAt) || subagent.cleanupCompletedAt < endedAt || subagent.pauseReason || subagent.killIntent || subagent.terminalOwner || subagent.execution.restartRecovery || subagent.suppressAnnounceReason === "steer-restart" || subagent.expectsCompletionMessage !== true || subagent.completion?.required !== true || !subagent.requesterSettleWake || subagent.delivery?.status !== "pending" || subagent.delivery.queueId || resolveTaskCleanupAfter({
		status: "cancelled",
		endedAt,
		createdAt: subagent.createdAt
	}) > now) return;
	return endedAt;
}
function ownsRetiredCancellation(database, subagent, expected) {
	const newerSibling = (candidate) => candidate.childSessionKey === subagent.childSessionKey && compareSubagentRunGeneration(candidate, subagent) > 0;
	return subagentRuns.get(subagent.runId) === expected && bindSubagentRunRecord(subagent).payload_json === bindSubagentRunRecord(expected).payload_json && !findTaskRecordByRunIdForViewInDatabase(database.db, subagent.taskRunId ?? subagent.runId) && ![...subagentRuns.values()].some(newerSibling) && !loadSubagentRunsForChildSessionFromSqlite(subagent.childSessionKey, database).some(newerSibling);
}
/** A changed historical owner stays deferred instead of falling through to repeat cleanup. */
function reconcileRetiredSubagentCancellation(expected, now) {
	const endedAt = retiredCancellationEndedAt(expected, now);
	const marker = expected.killReconciliation;
	if (endedAt === void 0 || !marker || !Number.isFinite(marker.killedAt) || marker.killedAt > endedAt) return;
	return runOpenClawStateWriteTransaction((database) => {
		const subagent = readSubagentRun(database, expected.runId);
		if (!subagent || retiredCancellationEndedAt(subagent, now) !== endedAt) return false;
		if (findTaskRecordByRunIdForViewInDatabase(database.db, subagent.taskRunId ?? subagent.runId)) return;
		if (!ownsRetiredCancellation(database, subagent, expected)) return false;
		subagent.killReconciliation = void 0;
		upsertSubagentRunRowInDatabase(database, bindSubagentRunRecord(subagent));
		deferSqlitePostCommitPublication(database.db, () => {
			publishCommittedSubagent(subagent).forEach((emit) => emit());
		});
		return true;
	});
}
function prepareBlockedSubagentCompletion(database, params, now, subagent) {
	const generation = params.subagent.delivery?.generation ?? 1;
	const task = readTaskRecord(database.db, params.taskId);
	if (subagent && !task && !params.taskId && params.suspendedReason === void 0) {
		const endedAt = retiredCancellationEndedAt(subagent, now);
		if (endedAt === void 0 || subagent.killReconciliation || !ownsRetiredCancellation(database, subagent, params.subagent)) return;
		const completion = ensureCompletionState(subagent);
		const delivery = ensureDeliveryState(subagent);
		completion.resultText ??= null;
		completion.capturedAt ??= endedAt;
		Object.assign(delivery, {
			status: "failed",
			disposition: params.disposition ?? delivery.disposition,
			lastError: params.reason,
			nextAttemptAt: void 0
		});
		subagent.suppressCompletionDelivery = true;
		return { subagent };
	}
	if (!subagent || !task || task.runtime !== "subagent" || subagent.execution.status !== "terminal" || subagent.expectsCompletionMessage !== true || (subagent.taskRunId ?? subagent.runId) !== task.runId || (subagent.delivery?.generation ?? 1) !== generation) return;
	const successful = task.status === "succeeded" && subagent.execution.outcome?.status === "ok";
	if (!successful && (params.suspendedReason !== void 0 && !params.storeReplaced || ![
		"cancelled",
		"failed",
		"timed_out"
	].includes(task.status) || resolveSubagentTaskTerminalStatus(subagent) !== task.status || ![
		"pending",
		"in_progress",
		"failed"
	].includes(subagent.delivery?.status ?? "pending"))) return;
	const delivery = ensureDeliveryState(subagent);
	if (params.storeReplaced && (delivery.status === "delivered" || delivery.announcedAt !== void 0 || delivery.deliveredAt !== void 0)) return;
	delivery.payload ??= loadPendingFinalDeliveryPayload(subagent);
	Object.assign(delivery, {
		status: params.suspendedReason ? "suspended" : "failed",
		disposition: params.storeReplaced ? "intentional_non_delivery" : params.suspendedReason ? "permanent_failure" : params.disposition ?? delivery.disposition,
		lastError: params.reason,
		deliveredAt: void 0,
		announcedAt: void 0,
		suspendedAt: params.suspendedReason ? delivery.suspendedAt ?? now : delivery.suspendedAt,
		suspendedReason: params.suspendedReason ?? delivery.suspendedReason,
		lastDropReason: params.lastDropReason ?? delivery.lastDropReason,
		nextAttemptAt: void 0,
		queueId: void 0
	});
	Object.assign(subagent, {
		cleanupHandled: false,
		wakeOnDescendantSettle: void 0
	});
	if (params.storeReplaced) subagent.requesterSettleWake = void 0;
	else if (params.suspendedReason) {
		if (isCompletedRequesterDeliveryBlocked(subagent)) {
			if (subagent.requesterSettleWake?.requesterYieldBatch !== true) subagent.requesterSettleWake = void 0;
		} else markRequesterSettleWakePending(subagent);
	} else subagent.suppressCompletionDelivery = true;
	if (successful && !params.storeReplaced) {
		const terminal = resolveRequiredCompletionDeliveryFailureTerminalResult(params.reason);
		Object.assign(task, {
			...terminal,
			error: params.reason,
			cleanupAfter: Math.max(task.cleanupAfter ?? 0, now + SUSPENDED_RETENTION_MS)
		});
	}
	Object.assign(task, {
		deliveryStatus: "failed",
		lastEventAt: now
	});
	const text = successful && !params.storeReplaced && task.notifyPolicy !== "silent" ? formatTaskBlockedFollowupMessage(task) : null;
	return {
		subagent,
		task,
		queued: text ? prepareClaimedSessionDelivery({
			kind: "systemEvent",
			sessionKey: resolveEventSessionKey(task.requesterSessionKey),
			...task.requesterAgentId ? { agentId: task.requesterAgentId } : {},
			text,
			...subagent.requesterOrigin ? { deliveryContext: subagent.requesterOrigin } : {},
			idempotencyKey: `subagent-completion-blocked:${task.taskId}:generation:${generation}`
		}, 0, now) : void 0
	};
}
function commitCompletionMutations(database, mutations, options) {
	for (const { subagent, task, queued, retire } of mutations) {
		if (queued) upsertBoundDeliveryQueueEntryInDatabase(bindDeliveryQueueEntry({
			queueName: SESSION_DELIVERY_QUEUE_NAME,
			entry: queued,
			insertOnly: true
		}), database);
		if (task) upsertTaskRunRowInDatabase(database, bindTaskRecord(task));
		if (retire) deleteSubagentRunRowInDatabase(database, subagent.runId);
		else upsertSubagentRunRowInDatabase(database, bindSubagentRunRecord(subagent));
	}
	deferSqlitePostCommitPublication(database.db, () => {
		const events = [];
		for (const { subagent, retire } of mutations) if (retire) subagentRuns.delete(subagent.runId);
		else replaceCommittedSubagent(subagent);
		publishSubagentRunsAfterAtomicStore(subagentRuns, mutations.map(({ subagent }) => subagent.runId), events);
		const tasks = mutations.flatMap(({ task }) => task ? [publishTaskRecordAfterAtomicStore(task, { deferredObserverEvents: events })] : []);
		for (const task of tasks) syncFlowFromTaskAfterTaskMutation(task, "atomic completion settlement");
		for (const emit of events) emit();
		for (const { queued } of mutations) if (queued) (async () => {
			const queueContext = captureOpenClawStateWorkerContext({
				path: database.path,
				env: options?.env
			});
			await scheduleSessionDelivery(queued.id, queueContext);
		})().catch((error) => {
			log.warn("Subagent completion remains queued after scheduling failed", {
				queueId: queued.id,
				error
			});
		});
	});
}
function blockSubagentCompletionDelivery(params) {
	return runOpenClawStateWriteTransaction((database) => {
		const mutation = prepareBlockedSubagentCompletion(database, params, Date.now(), readSubagentRun(database, params.subagent.runId));
		if (!mutation) return false;
		commitCompletionMutations(database, [mutation], params.databaseOptions);
		return true;
	}, params.databaseOptions);
}
/** Commits delivery, task, blocked alert, wake consumption, and retirement as one exact batch. */
function settleRequesterCompletionBatch(params) {
	runOpenClawStateWriteTransaction((database) => {
		if (!params.isCurrent()) throw new Error("subagent completion owner changed before settlement");
		const now = Date.now();
		const entries = params.entries;
		const ids = new Set(entries.map(({ subagent }) => subagent.runId));
		const first = entries[0]?.subagent;
		const cohort = first?.requesterSettleWake?.batchRunIds?.toSorted().join("\0");
		const checkedOmittedIds = /* @__PURE__ */ new Set();
		commitCompletionMutations(database, entries.map(({ subagent: expected, taskId }) => {
			const changedOwner = () => /* @__PURE__ */ new Error("subagent completion owner changed before settlement: " + expected.runId);
			const subagent = readSubagentRun(database, expected.runId);
			if (!subagent || !subagent.requesterSettleWake || subagent.requesterSessionKey !== first?.requesterSessionKey || subagent.requesterAgentId !== first?.requesterAgentId || subagent.requesterSettleWake.rearmGeneration !== first?.requesterSettleWake?.rearmGeneration || subagent.requesterSettleWake.batchRunIds?.toSorted().join("\0") !== cohort || subagentRuns.get(expected.runId) !== expected || bindSubagentRunRecord(subagent).payload_json !== bindSubagentRunRecord(expected).payload_json) throw changedOwner();
			for (const id of subagent.requesterSettleWake?.batchRunIds ?? []) if (!ids.has(id) && !checkedOmittedIds.has(id)) {
				const member = readSubagentRun(database, id);
				if (member?.requesterSettleWake && member.requesterSettleWake.rearmGeneration === subagent.requesterSettleWake?.rearmGeneration) throw changedOwner();
				checkedOmittedIds.add(id);
			}
			subagent.cleanupHandled = expected.cleanupHandled;
			const acknowledgeExpiredDelivery = params.outcome.delivered && subagent.delivery?.status === "suspended" && subagent.delivery.suspendedReason === "expiry";
			let mutation = { subagent };
			if (subagent.pauseReason !== "sessions_yield" && subagent.expectsCompletionMessage === true && (["pending", "in_progress"].includes(subagent.delivery?.status ?? "pending") || acknowledgeExpiredDelivery)) {
				if (params.outcome.delivered) {
					const task = readTaskRecord(database.db, taskId ?? "");
					if (!task || task.runtime !== "subagent" || task.runId !== (subagent.taskRunId ?? subagent.runId)) throw changedOwner();
					const delivery = ensureDeliveryState(subagent);
					const deliveredAt = params.outcome.deliveredAt ?? now;
					Object.assign(delivery, {
						status: "delivered",
						disposition: "delivered",
						deliveredAt,
						announcedAt: deliveredAt,
						lastDropReason: void 0
					});
					clearSubagentPendingDelivery(subagent);
					if (acknowledgeExpiredDelivery) {
						const finalized = resolveFinalizedSubagentTaskState(subagent);
						if (!finalized || finalized.status !== task.status) throw changedOwner();
						Object.assign(task, {
							error: finalized.error,
							terminalOutcome: finalized.terminalOutcome ?? void 0,
							terminalSummary: finalized.terminalSummary ?? void 0
						});
					}
					Object.assign(task, {
						deliveryStatus: "delivered",
						lastEventAt: now
					});
					mutation.task = task;
				} else {
					const blocked = prepareBlockedSubagentCompletion(database, {
						subagent: expected,
						taskId: taskId ?? "",
						reason: params.outcome.error ?? params.outcome.reason ?? "requester settle wake failed",
						disposition: params.outcome.disposition,
						storeReplaced: params.outcome.storeReplaced,
						suspendedReason: params.outcome.storeReplaced ? "permanent_failure" : void 0
					}, now, subagent);
					if (!blocked) throw changedOwner();
					mutation = blocked;
				}
			}
			const settled = mutation.subagent;
			if (settled.pauseReason !== "sessions_yield") {
				if (settled.requesterTurnRunId && settled.expectsCompletionMessage === true) settled.retireAfterRequesterTurn = settled.retireAfterRequesterTurn === true || settled.requesterSettleWake?.retireAfterSettle === true ? true : void 0;
				else mutation.retire = settled.requesterSettleWake?.retireAfterSettle === true;
			}
			settled.requesterSettleWake = void 0;
			return mutation;
		}), params.databaseOptions);
	}, params.databaseOptions, { operationLabel: "requester completion batch settlement" });
}
//#endregion
export { safeRemoveAttachmentsDir as A, recoverPendingSessionDeliveries as B, ANNOUNCE_COMPLETION_HARD_EXPIRY_MS as C, logAnnounceGiveUp as D, PROVISIONAL_KILL_RECONCILIATION_MS as E, buildAnnounceIdempotencyKey as F, resolveLifecycleOutcomeFromRunOutcome as G, emitSubagentProgressEndedHook as H, schedulePendingSessionDeliveries as I, scheduleSessionDelivery as L, cleanupMaterializedSubagentAttachments as M, removeSubagentAttachmentTree as N, persistSubagentSessionTiming as O, buildAnnounceIdFromChildRun as P, startSessionDeliveryRuntime as R, safeSetSubagentTaskDeliveryStatus as S, MIN_ANNOUNCE_RETRY_DELAY_MS as T, resolveFinalizedSubagentTaskState as U, emitSubagentEndedHookOnce as V, resolveKilledSubagentTaskEndedAt as W, markRequesterSettleWakePending as _, reconcileRetiredSubagentCancellation as a, refreshFrozenResultFromSession as b, buildSafeLifecycleErrorMeta as c, finalizeSubagentTaskRun as d, formatAnnounceDeliveryError as f, markPendingFinalDelivery as g, loadPendingFinalDeliveryPayload as h, publishCommittedRecords as i, updateSubagentArchiveAtMs as j, resolveAnnounceRetryDelayMs as k, clearSubagentPendingDelivery as l, hasPriorRequesterDeliveryMirror as m, admitSubagentCompletionDelivery as n, settleRequesterCompletionBatch as o, freezeRunResultAtCompletion as p, blockSubagentCompletionDelivery as r, settleSubagentCompletionDelivery as s, SUSPENDED_RETENTION_MS as t, emitCompletionEndedHookIfNeeded as u, maskLifecycleIdentifier as v, ANNOUNCE_EXPIRY_MS as w, refreshPendingFinalDeliveryPayload as x, recordAnnounceDeliveryResult as y, drainPendingSessionDelivery as z };
