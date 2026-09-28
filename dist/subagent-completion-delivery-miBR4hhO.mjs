import { n as SILENT_REPLY_TOKEN } from "./tokens-BTKQYTUd.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { j as subagentRuns } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { g as ensureDeliveryState } from "./subagent-registry.store.sqlite-DcyWJbiA.mjs";
import { n as findTaskByRunId, r as getTaskById } from "./task-registry-query-Bd-H3o4L.mjs";
import "./runtime-internal-BF8pXknh.mjs";
import { t as captureOperatorToolGatewayContinuationContext } from "./server-plugin-in-process-dispatch-BpUBEeez.mjs";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DdiIlFMt.mjs";
import { A as safeRemoveAttachmentsDir, C as ANNOUNCE_COMPLETION_HARD_EXPIRY_MS, L as scheduleSessionDelivery, h as loadPendingFinalDeliveryPayload, i as publishCommittedRecords, n as admitSubagentCompletionDelivery, r as blockSubagentCompletionDelivery, s as settleSubagentCompletionDelivery, t as SUSPENDED_RETENTION_MS } from "./subagent-completion-admission.store-C-FTAVQX.mjs";
import { a as SessionDeliveryDeferredError, c as prepareClaimedSessionDelivery, i as SessionDeliveryDeadLetteredError } from "./session-delivery-queue.records-rYJIeHGW.mjs";
import { p as releaseSessionDeliveryClaim } from "./session-delivery-queue-storage-DSTuGS2l.mjs";
//#region src/agents/subagents/completion/subagent-completion-instructions.ts
const SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION = "This completion ends one child run, not necessarily the original user request. Compare the result with the requested outcome before deciding the task is done. Reviews, failed checks, and other in-scope fixable blockers require continued work or a follow-up in the kept child session; report a blocker only when progress needs new user authority or an unavailable external decision.";
const SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION = `Process this result privately. ${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION} Your final reply stays internal. If the original request requires a user-facing update, send it through an available, permitted messaging tool; do not rely on your final reply for delivery. Reply ONLY: ${SILENT_REPLY_TOKEN} when no further work or user-facing update is owed, or after sending that update.`;
//#endregion
//#region src/agents/subagents/completion/subagent-completion-delivery.ts
const CLAIM_LEASE_MS = 125e3;
const MAX_DELIVERY_GENERATION = 10;
const CANONICAL_RESULT_PROMPT = `A completed subagent task is ready for parent review. ${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION} The canonical result follows.`;
function findSubagentForTask(task) {
	for (const entry of subagentRuns.values()) if ((entry.taskRunId ?? entry.runId) === task.runId) return entry;
}
function projectRedrivenTask(task, subagent, deliveryStatus, now) {
	return {
		...task,
		status: "succeeded",
		deliveryStatus,
		terminalOutcome: "succeeded",
		lastEventAt: now,
		progressSummary: resolveSubagentCompletionResultText(subagent) ?? task.progressSummary,
		error: void 0,
		terminalSummary: void 0,
		cleanupAfter: void 0
	};
}
/** Atomically admits a queue generation and publishes process mirrors only after commit. */
function admitCorrelatedSubagentSessionDelivery(params) {
	const current = subagentRuns.get(params.runId);
	if (!current) throw new Error(`subagent completion owner not found: ${params.runId}`);
	const task = findTaskByRunId(current.taskRunId ?? current.runId);
	if (!task || task.runtime !== "subagent") throw new Error(`subagent completion task not found: ${params.runId}`);
	const now = Date.now();
	const subagent = structuredClone(current);
	const delivery = ensureDeliveryState(subagent);
	const generation = delivery.generation ?? 1;
	const windowStartedAt = delivery.windowStartedAt ?? subagent.execution.endedAt ?? now;
	const deadlineAt = delivery.deadlineAt ?? windowStartedAt + 18e5;
	const generationSuffix = generation > 1 ? `:generation:${generation}` : "";
	const queueEntry = prepareClaimedSessionDelivery({
		...params.payload,
		idempotencyKey: `${params.payload.idempotencyKey ?? params.payload.messageId}${generationSuffix}`,
		messageId: `${params.payload.messageId}${generationSuffix}`,
		message: CANONICAL_RESULT_PROMPT,
		maxRetries: Number.MAX_SAFE_INTEGER,
		owner: {
			kind: "subagent_completion",
			runId: subagent.runId,
			taskId: task.taskId,
			generation,
			deadlineAt
		}
	}, CLAIM_LEASE_MS, now);
	Object.assign(delivery, {
		status: "in_progress",
		disposition: "session_queued",
		generation,
		queueId: queueEntry.id,
		windowStartedAt,
		deadlineAt,
		nextAttemptAt: queueEntry.availableAt,
		enqueuedAt: now
	});
	delivery.payload ??= loadPendingFinalDeliveryPayload(subagent);
	const projectedTask = projectRedrivenTask(task, subagent, "session_queued", now);
	const admission = admitSubagentCompletionDelivery({
		queueEntry,
		subagent,
		task: projectedTask
	});
	publishCommittedRecords(subagent, projectedTask);
	return {
		id: queueEntry.id,
		...admission
	};
}
function resolveCorrelatedSubagentDelivery(queued) {
	if (queued.kind !== "agentTurn" || queued.owner?.kind !== "subagent_completion") return queued;
	if (Date.now() >= queued.owner.deadlineAt) throw new SessionDeliveryDeadLetteredError("correlated subagent completion delivery deadline expired");
	const entry = subagentRuns.get(queued.owner.runId);
	if (!entry || entry.delivery?.queueId !== queued.id || entry.delivery.generation !== queued.owner.generation || entry.delivery.deadlineAt !== queued.owner.deadlineAt) throw new SessionDeliveryDeferredError("correlated subagent delivery owner mismatch");
	const result = resolveSubagentCompletionResultText(entry) ?? "(no output)";
	return {
		...queued,
		message: `${CANONICAL_RESULT_PROMPT}\n\n${result}`,
		runtimeContextFragments: [{
			kind: "runtime-instruction",
			text: CANONICAL_RESULT_PROMPT
		}, {
			kind: "conversation-data",
			text: result
		}]
	};
}
async function settleCorrelatedSubagentDelivery(queued, outcome) {
	if (queued.kind !== "agentTurn" || queued.owner?.kind !== "subagent_completion") return;
	const current = subagentRuns.get(queued.owner.runId);
	const task = getTaskById(queued.owner.taskId);
	if (!current || !task || current.delivery?.queueId !== queued.id || current.delivery.generation !== queued.owner.generation) return;
	const now = Date.now();
	const subagent = structuredClone(current);
	const delivery = ensureDeliveryState(subagent);
	const projectedTask = { ...task };
	if (outcome !== "recovered") {
		blockSubagentCompletionDelivery({
			subagent: current,
			taskId: queued.owner.taskId,
			reason: queued.lastError ?? "completion delivery failed",
			suspendedReason: "permanent_failure"
		});
		return;
	}
	Object.assign(delivery, {
		status: "delivered",
		disposition: "delivered",
		deliveredAt: now,
		announcedAt: now,
		lastError: void 0,
		nextAttemptAt: void 0,
		queueId: void 0
	});
	delivery.payload = void 0;
	projectedTask.deliveryStatus = "delivered";
	projectedTask.terminalOutcome = "succeeded";
	projectedTask.error = void 0;
	projectedTask.progressSummary = resolveSubagentCompletionResultText(subagent) ?? projectedTask.progressSummary;
	projectedTask.lastEventAt = now;
	settleSubagentCompletionDelivery({
		subagent,
		task: projectedTask
	});
	publishCommittedRecords(subagent, projectedTask);
	const { resumeSubagentRun } = await import("./subagent-registry-DJ5MZmgl.mjs");
	resumeSubagentRun(subagent.runId);
}
async function retrySubagentCompletionDelivery(taskId, databaseOptions) {
	const task = getTaskById(taskId);
	const current = task ? findSubagentForTask(task) : void 0;
	if (!task || !current || current.expectsCompletionMessage !== true) return {
		ok: false,
		reason: "task has no recoverable subagent completion"
	};
	const delivery = ensureDeliveryState(current);
	if (delivery.status === "in_progress" && delivery.queueId) {
		const queueContext = captureOpenClawStateWorkerContext();
		await releaseSessionDeliveryClaim(delivery.queueId, queueContext);
		await scheduleSessionDelivery(delivery.queueId, queueContext);
		return {
			ok: true,
			task: getTaskById(taskId)
		};
	}
	if (delivery.status !== "suspended") return {
		ok: false,
		reason: "completion delivery is not blocked"
	};
	const generation = (delivery.generation ?? 1) + 1;
	if (generation > MAX_DELIVERY_GENERATION) return {
		ok: false,
		reason: "completion delivery redrive limit reached"
	};
	const now = Date.now();
	const redrive = structuredClone(current);
	Object.assign(ensureDeliveryState(redrive), {
		status: "pending",
		disposition: "retryable",
		generation,
		queueId: void 0,
		windowStartedAt: now,
		deadlineAt: now + ANNOUNCE_COMPLETION_HARD_EXPIRY_MS,
		suspendedAt: void 0,
		suspendedReason: void 0,
		attemptCount: 0,
		lastDropReason: void 0,
		lastError: void 0,
		nextAttemptAt: void 0
	});
	redrive.cleanupHandled = false;
	const projectedTask = projectRedrivenTask(task, redrive, "pending", now);
	const continuation = captureOperatorToolGatewayContinuationContext();
	let transferred = false;
	try {
		settleSubagentCompletionDelivery({
			subagent: redrive,
			task: projectedTask,
			databaseOptions
		});
		if (continuation?.operatorAuthority) {
			subagentRuns.bindCompletionAuthority(current, continuation);
			transferred = true;
		}
		publishCommittedRecords(redrive, projectedTask);
		const { resumeSubagentRun } = await import("./subagent-registry-DJ5MZmgl.mjs");
		resumeSubagentRun(redrive.runId);
		return {
			ok: true,
			task: getTaskById(taskId),
			duplicateRisk: true
		};
	} finally {
		if (!transferred) continuation?.release();
	}
}
async function dismissSubagentCompletionDelivery(taskId, options) {
	const task = getTaskById(taskId);
	const current = task ? findSubagentForTask(task) : void 0;
	if (!task || !current || current.delivery?.status !== "suspended") return {
		ok: false,
		reason: "completion delivery is not blocked"
	};
	const now = Date.now();
	const subagent = structuredClone(current);
	const projectedTask = {
		...task,
		deliveryStatus: "dismissed",
		terminalOutcome: "blocked",
		terminalSummary: "Task completed; result delivery was dismissed by the operator.",
		progressSummary: resolveSubagentCompletionResultText(subagent) ?? task.progressSummary,
		cleanupAfter: Math.max(task.cleanupAfter ?? 0, now + SUSPENDED_RETENTION_MS),
		lastEventAt: now
	};
	settleSubagentCompletionDelivery({
		subagent,
		task: projectedTask,
		databaseOptions: options.databaseOptions,
		mutateSubagent: (entry) => options.discardTerminalDelivery(entry, now)
	});
	publishCommittedRecords(subagent, projectedTask);
	if (subagent.cleanup === "delete" || !subagent.retainAttachmentsOnKeep) await safeRemoveAttachmentsDir(subagent);
	return {
		ok: true,
		task: getTaskById(taskId)
	};
}
//#endregion
export { settleCorrelatedSubagentDelivery as a, retrySubagentCompletionDelivery as i, dismissSubagentCompletionDelivery as n, SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION as o, resolveCorrelatedSubagentDelivery as r, SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION as s, admitCorrelatedSubagentSessionDelivery as t };
