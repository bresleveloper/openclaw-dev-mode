import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { B as isEquivalentTaskRecord, H as matchesTaskPersistenceReceipt, L as filterTasksByRunScope, X as appendTaskEvent, at as shouldApplyRunScopedStatusUpdate, it as resolveTaskTerminalOutcome, k as applyTaskRecordPatch, nt as normalizeTaskSummary, q as sameTaskRunScope, tt as normalizeTaskStatus } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { n as isTerminalTaskFlow } from "./task-flow-registry.types-BidrdCoB.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { n as isTaskFlowCancellationPending } from "./task-cancellation-state-7hPsgm-K.mjs";
import { n as shouldAutoDeliverTaskTerminalUpdate, t as shouldAutoDeliverTaskStateChange } from "./task-notification-policy-7pB-BxLh.mjs";
//#region src/tasks/task-registry-transition.operation.ts
/** This is also the ordinary synchronous update owner's persistence/no-op decision. */
function prepareTaskRecordUpdate(current, patch, now) {
	const task = applyTaskRecordPatch(current, patch, now);
	if (isTerminalTaskStatus(current.status)) {
		const previousEventAt = current.lastEventAt ?? current.endedAt ?? current.startedAt ?? current.createdAt;
		if ((task.lastEventAt ?? task.endedAt ?? task.startedAt ?? task.createdAt) <= previousEventAt) {
			task.lastEventAt = current.lastEventAt;
			if (!isEquivalentTaskRecord(current, {
				...task,
				cleanupAfter: current.cleanupAfter
			})) task.lastEventAt = Math.max(now ?? Date.now(), previousEventAt + 1);
		}
	}
	return {
		previous: current,
		task,
		persisted: !isTerminalTaskStatus(current.status) || !isEquivalentTaskRecord(current, task),
		becomesTerminal: !isTerminalTaskStatus(current.status) && isTerminalTaskStatus(task.status)
	};
}
function prepareStateTransition(current, params, now) {
	const patch = {};
	const nextStatus = params.status ? normalizeTaskStatus(params.status) : current.status;
	if (params.status && !shouldApplyRunScopedStatusUpdate({
		currentStatus: current.status,
		currentRuntime: current.runtime,
		currentChildSessionKey: current.childSessionKey,
		currentError: current.error,
		currentEndedAt: current.endedAt,
		nextStatus,
		nextError: params.error,
		nextEndedAt: params.endedAt
	})) return null;
	const eventAt = params.lastEventAt ?? params.endedAt ?? now;
	if (params.status) patch.status = normalizeTaskStatus(params.status);
	if (params.startedAt != null) patch.startedAt = params.startedAt;
	if (params.endedAt != null) patch.endedAt = params.endedAt;
	if (params.lastEventAt != null) patch.lastEventAt = params.lastEventAt;
	if (params.childSessionKey !== void 0) patch.childSessionKey = params.childSessionKey?.trim() || void 0;
	if (params.clearError) patch.error = void 0;
	else if (current.status === "cancelled" && nextStatus !== "cancelled" && params.error === void 0) patch.error = void 0;
	else if (params.error !== void 0) patch.error = params.error;
	if (params.progressSummary !== void 0) patch.progressSummary = normalizeTaskSummary(params.progressSummary);
	if (params.terminalSummary !== void 0) patch.terminalSummary = params.preserveTerminalSummary ? params.terminalSummary ?? void 0 : normalizeTaskSummary(params.terminalSummary);
	if (params.terminalOutcome !== void 0) patch.terminalOutcome = resolveTaskTerminalOutcome({
		status: nextStatus,
		terminalOutcome: params.terminalOutcome
	});
	if (params.detail !== void 0) patch.detail = params.detail;
	if (params.suppressDelivery) patch.deliveryStatus = "not_applicable";
	const eventSummary = normalizeTaskSummary(params.eventSummary) ?? (nextStatus === "failed" ? normalizeTaskSummary(params.error ?? current.error) : nextStatus === "succeeded" ? normalizeTaskSummary(params.terminalSummary ?? current.terminalSummary) : void 0);
	return {
		patch,
		nextEvent: params.status && params.status !== current.status || Boolean(normalizeTaskSummary(params.eventSummary)) ? appendTaskEvent({
			at: eventAt,
			kind: params.status && normalizeTaskStatus(params.status) !== current.status ? normalizeTaskStatus(params.status) : "progress",
			summary: eventSummary
		}) : void 0
	};
}
function prepareTaskRecordTransition(current, input) {
	if (input.kind === "delivery") return {
		...prepareTaskRecordUpdate(current, {
			deliveryStatus: input.params.deliveryStatus,
			...input.params.error !== void 0 ? { error: input.params.error } : {}
		}, input.now),
		deliver: false
	};
	const prepared = prepareStateTransition(current, input.params, input.now);
	return prepared ? {
		...prepareTaskRecordUpdate(current, prepared.patch, input.now),
		deliver: !input.params.suppressDelivery,
		nextEvent: prepared.nextEvent
	} : null;
}
/** Callers publish each settled row before selecting/admitting the next sibling. */
function runTaskRecordTransitionOperation(input, operations) {
	const prepareCurrent = () => {
		const current = operations.readCurrent();
		if (!current || input.selection && (!matchesTaskPersistenceReceipt(current, input.selection) || current.runId?.trim() !== input.params.runId.trim() || filterTasksByRunScope([current], input.params).length === 0) || input.expectedTask && !matchesTaskPersistenceReceipt(current, input.expectedTask) || !operations.hasAuthoritativeBacking(current)) return null;
		return prepareTaskRecordTransition(current, input);
	};
	return operations.write(() => {
		if (input.expectedTask && !operations.assertCurrent) throw new Error("A task persistence receipt requires live owner admission");
		const prepared = prepareCurrent();
		if (!prepared) return null;
		operations.beforePersist?.(prepared);
		const receipt = operations.beforePersist ? prepareCurrent() : prepared;
		if (!receipt) return null;
		operations.assertCurrent?.(receipt);
		if (receipt.persisted && !operations.upsertTask(receipt.task)) return null;
		operations.deferCommit(() => operations.onCommitted(receipt));
		return receipt;
	});
}
//#endregion
//#region src/tasks/task-notification.operation.ts
function captureTaskNotificationTarget(task) {
	return Object.freeze({
		taskId: task.taskId,
		runtime: task.runtime,
		ownerKey: task.ownerKey,
		scopeKind: task.scopeKind,
		runId: task.runId,
		childSessionKey: task.childSessionKey
	});
}
function matchesTaskNotificationTarget(task, target) {
	return task !== void 0 && task.taskId === target.taskId && sameTaskRunScope(task, target);
}
function writeTaskNotificationStage(operations, stage, mutate) {
	let refused = false;
	const assertCurrent = () => {
		try {
			operations.assertCurrent();
		} catch (error) {
			refused = true;
			throw error;
		}
	};
	try {
		operations.write(() => mutate(assertCurrent));
	} catch (error) {
		if (refused) throw error;
		operations.onFailure(stage, error);
	}
}
/** The watermark and task touch retain their separate best-effort transactions. */
function acknowledgeTaskStateNotification(input, operations) {
	let selected;
	let receipt = null;
	writeTaskNotificationStage(operations, "watermark", (assertCurrent) => {
		const current = operations.readCurrent();
		selected = matchesTaskNotificationTarget(current.task, input.expectedTask);
		if (!selected) return;
		const requesterOrigin = normalizeDeliveryContext(current.deliveryState?.requesterOrigin);
		const deliveryState = {
			taskId: input.taskId,
			...requesterOrigin ? { requesterOrigin } : {},
			lastNotifiedEventAt: Math.max(current.deliveryState?.lastNotifiedEventAt ?? 0, input.eventAt)
		};
		assertCurrent();
		operations.upsertDelivery(deliveryState);
		operations.deferCommit(() => operations.onCommitted(null));
	});
	if (selected === false) return null;
	writeTaskNotificationStage(operations, "task", (assertCurrent) => {
		const current = operations.readCurrent();
		if (!matchesTaskNotificationTarget(current.task, input.expectedTask)) return;
		const now = Date.now();
		const updated = prepareTaskRecordUpdate(current.task, { lastEventAt: now }, now);
		assertCurrent();
		if (updated.persisted) operations.upsertTask(updated.task, current.deliveryState);
		const committed = {
			...updated,
			deliver: false
		};
		operations.deferCommit(() => {
			receipt = committed;
			operations.onCommitted(committed);
		});
	});
	return receipt;
}
/** Reread the selected task's policy and metadata in the same transaction as its status write. */
function updateTaskNotificationDelivery(input, operations) {
	let receipt = null;
	writeTaskNotificationStage(operations, "task", (assertCurrent) => {
		const current = operations.readCurrent();
		if (!matchesTaskNotificationTarget(current.task, input.expectedTask) || !(input.kind === "terminal" ? shouldAutoDeliverTaskTerminalUpdate(current.task) : shouldAutoDeliverTaskStateChange(current.task))) return;
		const now = Date.now();
		const updated = prepareTaskRecordUpdate(current.task, {
			deliveryStatus: input.deliveryStatus,
			lastEventAt: now
		}, now);
		assertCurrent();
		if (updated.persisted) operations.upsertTask(updated.task, current.deliveryState);
		const committed = {
			...updated,
			deliver: false
		};
		operations.deferCommit(() => {
			receipt = committed;
			operations.onCommitted(committed);
		});
	});
	return receipt;
}
//#endregion
//#region src/tasks/task-initial-flow.rules.ts
function isOneTaskFlowEligible(task) {
	if (task.parentFlowId?.trim() || task.scopeKind !== "session") return false;
	if (task.deliveryStatus === "not_applicable") return false;
	return task.runtime === "acp" || task.runtime === "subagent";
}
function buildManagedFlowCancellationPatch(task, flow, readTasks, now) {
	if (!flow || flow.syncMode !== "managed" || flow.cancelRequestedAt == null || isTerminalTaskFlow(flow) || readTasks().some(isTaskFlowCancellationPending)) return;
	const endedAt = task.endedAt ?? task.lastEventAt ?? now;
	return {
		status: "cancelled",
		blockedTaskId: null,
		blockedSummary: null,
		waitJson: null,
		endedAt,
		updatedAt: endedAt
	};
}
//#endregion
export { matchesTaskNotificationTarget as a, runTaskRecordTransitionOperation as c, captureTaskNotificationTarget as i, isOneTaskFlowEligible as n, updateTaskNotificationDelivery as o, acknowledgeTaskStateNotification as r, prepareTaskRecordUpdate as s, buildManagedFlowCancellationPatch as t };
