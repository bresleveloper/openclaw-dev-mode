import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { A as buildTaskRecordForCreate, B as isEquivalentTaskRecord, E as readTaskBackingInstance, F as compareTasksForRunIdLookup, H as matchesTaskPersistenceReceipt, K as resolveTaskCreateIdentity, Q as ensureNotifyPolicy, S as createSubagentTaskBackingDetail, X as appendTaskEvent, Z as assertTaskOwner, b as createAcpTaskBackingDetail, et as mapAgentRunTerminalOutcomeToTaskStatus, j as captureTaskPersistenceReceipt, k as applyTaskRecordPatch, rt as resolveTaskLifecycleTerminalError, t as bindTaskRecord } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { c as parseTaskRuntime, l as parseTaskScopeKind, r as isTerminalTaskStatus, u as parseTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { s as prepareTaskRecordUpdate } from "./task-initial-flow.rules-DO4-fPbE.mjs";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
//#region src/tasks/task-registry-agent-event-target.ts
function captureTaskAgentEventTarget(task) {
	return {
		...captureTaskPersistenceReceipt(task),
		status: task.status,
		startedAt: task.startedAt,
		lastEventAt: task.lastEventAt,
		backing: readTaskBackingInstance(task.detail)
	};
}
/** A creation receipt carries its selected identity, not task prose or a projected row. */
function captureTaskCreationEventTarget(task, operation, requestedTaskId) {
	const target = captureTaskAgentEventTarget(task);
	const backing = target.backing;
	return {
		kind: "task-creation-event-target",
		operation,
		requestedTaskId,
		target: {
			...target,
			backing: backing?.runtime === "acp" ? createAcpTaskBackingDetail(backing.instanceId, backing.generation) : backing ? createSubagentTaskBackingDetail(backing.generation) : void 0
		}
	};
}
function readTaskCreationEventTarget(facts, operation, requestedTaskId) {
	if (facts === void 0) return;
	if (!isRecord(facts) || facts.kind !== "task-creation-event-target" || facts.operation !== operation || facts.requestedTaskId !== requestedTaskId || !isRecord(facts.target)) throw new Error("Task creation event target differs from its retained producer");
	const target = facts.target;
	const backing = readTaskBackingInstance(target.backing);
	if (typeof target.taskId !== "string" || !target.taskId || typeof target.ownerKey !== "string" || typeof target.runId !== "string" || !target.runId || typeof target.createdAt !== "number" || !Number.isFinite(target.createdAt) || target.childSessionKey !== void 0 && typeof target.childSessionKey !== "string" || target.taskKind !== void 0 && typeof target.taskKind !== "string" || target.startedAt !== void 0 && (typeof target.startedAt !== "number" || !Number.isFinite(target.startedAt)) || target.lastEventAt !== void 0 && (typeof target.lastEventAt !== "number" || !Number.isFinite(target.lastEventAt)) || target.backing !== void 0 && !backing) throw new Error("Task creation event target is invalid");
	return {
		taskId: target.taskId,
		ownerKey: target.ownerKey,
		runId: target.runId,
		createdAt: target.createdAt,
		childSessionKey: target.childSessionKey,
		taskKind: target.taskKind,
		startedAt: target.startedAt,
		lastEventAt: target.lastEventAt,
		runtime: parseTaskRuntime(target.runtime),
		scopeKind: parseTaskScopeKind(target.scopeKind),
		status: parseTaskStatus(target.status),
		backing
	};
}
//#endregion
//#region src/tasks/task-registry-agent-event.operation.ts
const TASK_ACTIVITY_LIVENESS_WRITE_MS = 6e4;
/** Reduce accepted events to durable fields; tool arguments and streamed prose never enter the queue. */
function captureTaskAgentEventChange(task, event, projectTerminal) {
	const change = {
		kind: "progress",
		at: event.ts,
		toolStarts: 0,
		patch: {}
	};
	if (event.stream === "lifecycle") {
		const { phase, startedAt } = event.data;
		if ((phase === "end" || phase === "error") && !projectTerminal) return;
		if (typeof startedAt === "number" && Number.isFinite(startedAt)) change.patch.startedAt = startedAt;
		if (phase === "start") {
			change.kind = "start";
			change.patch.status = "running";
		} else if (phase === "end" || phase === "error") {
			const terminal = buildAgentRunTerminalOutcomeFromLifecycleEvent({
				phase,
				data: event.data,
				endedAt: event.data.endedAt ?? event.ts
			});
			change.kind = "terminal";
			change.patch.status = mapAgentRunTerminalOutcomeToTaskStatus(terminal);
			change.patch.endedAt = terminal.endedAt ?? event.ts;
			const error = resolveTaskLifecycleTerminalError({
				runtime: task.runtime,
				status: change.patch.status,
				terminalReason: terminal.reason,
				error: terminal.error
			});
			if (error) change.patch.error = error;
		}
	} else if (event.stream === "error") {
		change.refreshError = true;
		if (typeof event.data.error === "string") change.patch.error = event.data.error;
	} else if (event.stream === "tool" && event.data.phase === "start") {
		const name = typeof event.data.name === "string" ? event.data.name.trim() : "";
		if (name) {
			change.toolStarts = 1;
			change.patch.lastToolName = name;
		}
	}
	return change;
}
function matchesTaskAgentEventTarget(task, input) {
	return matchesTaskPersistenceReceipt(task, input.expectedTask) && isDeepStrictEqual(readTaskBackingInstance(task.detail), input.backing);
}
/** Native compatibility consumption and worker persistence share this event decision. */
function prepareTaskAgentEventUpdate(current, input) {
	if (isTerminalTaskStatus(current.status) || !matchesTaskAgentEventTarget(current, input)) return null;
	const { change } = input;
	const patch = { ...change.patch };
	if (patch.startedAt === current.startedAt) delete patch.startedAt;
	if (change.refreshError && patch.error === void 0) patch.error = current.error;
	if (change.toolStarts) patch.toolUseCount = (current.toolUseCount ?? 0) + change.toolStarts;
	const lastEventAt = current.lastEventAt ?? current.startedAt ?? current.createdAt;
	if (Object.keys(patch).length === 0 && change.at - lastEventAt < 6e4) return null;
	patch.lastEventAt = change.at;
	const update = prepareTaskRecordUpdate(current, patch);
	return {
		...update,
		patch,
		nextEvent: createTaskAgentEventPublication(update.task, current.status, change).nextEvent
	};
}
function createTaskAgentEventPublication(task, previousStatus, change) {
	const nextEvent = change.patch.status && change.patch.status !== previousStatus ? appendTaskEvent({
		at: change.at,
		kind: change.patch.status,
		summary: task.status === "failed" ? task.error : task.status === "succeeded" ? task.terminalSummary : void 0
	}) : void 0;
	return {
		task,
		becomesTerminal: !isTerminalTaskStatus(previousStatus) && isTerminalTaskStatus(task.status),
		nextEvent
	};
}
function captureTaskAgentEventLineage(receipt) {
	return {
		kind: "task-agent-event-commit",
		taskId: receipt.task.taskId,
		backing: readTaskBackingInstance(receipt.previous.detail),
		previous: captureTaskPersistenceReceipt(receipt.previous),
		next: captureTaskPersistenceReceipt(receipt.task)
	};
}
/** Only this operation's settled commit may advance its queued timestamp normalization. */
function readTaskAgentEventCommittedTarget(facts, input) {
	if (!isRecord(facts) || facts.kind !== "task-agent-event-commit" || facts.taskId !== input.taskId || !isDeepStrictEqual(facts.backing, input.backing) || !isRecord(facts.previous) || !isRecord(facts.next)) throw new Error("Task event commit receipt differs from its retained owner");
	const previous = facts.previous;
	const next = facts.next;
	for (const [key, value] of Object.entries(input.expectedTask)) if (previous[key] !== value || key !== "createdAt" && next[key] !== value) throw new Error("Task event commit receipt changed its fixed task identity");
	const createdAt = next.createdAt;
	if (typeof createdAt !== "number" || !Number.isFinite(createdAt) || createdAt > input.expectedTask.createdAt) throw new Error("Task event commit receipt has an invalid timestamp lineage");
	return {
		...input.expectedTask,
		createdAt
	};
}
//#endregion
//#region src/tasks/task-registry-agent-event-commit.ts
function hashBoundTaskRecord(bound) {
	return createHash("sha256").update(JSON.stringify(bound)).digest("hex");
}
/** Large task detail stays on the framed result/readback path, never this private receipt. */
function captureTaskAgentEventCommit(receipt, bound) {
	return {
		...captureTaskAgentEventLineage(receipt),
		rowHash: hashBoundTaskRecord(bound),
		previousStatus: receipt.previous.status
	};
}
function recoverTaskAgentEventPublication(facts, input, task) {
	const expectedTask = readTaskAgentEventCommittedTarget(facts, input);
	if (!isRecord(facts) || typeof facts.previousStatus !== "string" || !task || !matchesTaskAgentEventTarget(task, {
		...input,
		expectedTask
	}) || facts.rowHash !== hashBoundTaskRecord(bindTaskRecord(task))) return;
	return createTaskAgentEventPublication(task, parseTaskStatus(facts.previousStatus), input.change);
}
//#endregion
//#region src/tasks/task-registry-create-rules.ts
function selectExistingTaskForCreate(params) {
	const runId = params.runId?.trim();
	const requestedBacking = params.runtime === "acp" ? readTaskBackingInstance(params.detail) : void 0;
	const runScopeMatches = runId ? params.candidates.filter((task) => {
		if (task.runId?.trim() !== runId || task.runtime !== params.runtime || task.scopeKind !== params.scopeKind || (normalizeOptionalString(task.ownerKey) ?? "") !== (normalizeOptionalString(params.ownerKey) ?? "") || (normalizeOptionalString(task.childSessionKey) ?? "") !== (normalizeOptionalString(params.childSessionKey) ?? "")) return false;
		if (requestedBacking?.runtime === "acp") {
			const backing = readTaskBackingInstance(task.detail);
			if (backing?.runtime !== "acp" || backing.instanceId !== requestedBacking.instanceId) return false;
		}
		if (params.runtime === "acp" && !params.parentFlowId?.trim()) {
			const existingFlowId = task.parentFlowId?.trim();
			return !existingFlowId || params.isTaskMirroredFlow(existingFlowId);
		}
		return (normalizeOptionalString(task.parentFlowId) ?? "") === (normalizeOptionalString(params.parentFlowId) ?? "");
	}) : [];
	const exact = runId ? runScopeMatches.find((task) => (normalizeOptionalString(task.label) ?? "") === (normalizeOptionalString(params.label) ?? "") && (normalizeOptionalString(task.task) ?? "") === (normalizeOptionalString(params.task) ?? "")) : void 0;
	if (exact) return exact;
	if (!runId || params.runtime !== "acp") return;
	if (runScopeMatches.length === 0) return;
	return runScopeMatches.toSorted(compareTasksForRunIdLookup)[0];
}
function buildTaskCreateMergePatch(existing, params) {
	const patch = {};
	if (params.sourceId?.trim() && !existing.sourceId?.trim()) patch.sourceId = params.sourceId.trim();
	if (params.taskKind?.trim() && !existing.taskKind?.trim()) patch.taskKind = params.taskKind.trim();
	if (params.parentFlowId?.trim() && !existing.parentFlowId?.trim()) patch.parentFlowId = params.parentFlowId.trim();
	if (params.parentTaskId?.trim() && !existing.parentTaskId?.trim()) patch.parentTaskId = params.parentTaskId.trim();
	if (params.agentId?.trim() && !existing.agentId?.trim()) patch.agentId = params.agentId.trim();
	if (params.requesterAgentId?.trim() && !existing.requesterAgentId?.trim()) patch.requesterAgentId = params.requesterAgentId.trim();
	const nextLabel = params.label?.trim();
	if (params.preferMetadata) {
		if (nextLabel && (normalizeOptionalString(existing.label) ?? "") !== nextLabel) patch.label = nextLabel;
		const nextTask = params.task.trim();
		if (nextTask && (normalizeOptionalString(existing.task) ?? "") !== nextTask) patch.task = nextTask;
	} else if (nextLabel && !existing.label?.trim()) patch.label = nextLabel;
	if (params.deliveryStatus === "pending" && existing.deliveryStatus !== "delivered") patch.deliveryStatus = "pending";
	const notifyPolicy = ensureNotifyPolicy({
		notifyPolicy: params.notifyPolicy,
		deliveryStatus: params.deliveryStatus,
		ownerKey: existing.ownerKey,
		scopeKind: existing.scopeKind
	});
	if (notifyPolicy !== existing.notifyPolicy && existing.notifyPolicy === "silent") patch.notifyPolicy = notifyPolicy;
	if (params.detail !== void 0) {
		const currentBacking = readTaskBackingInstance(existing.detail);
		const nextBacking = readTaskBackingInstance(params.detail);
		if (currentBacking?.runtime !== "acp" || nextBacking?.runtime !== "acp" || currentBacking.instanceId !== nextBacking.instanceId || nextBacking.generation >= currentBacking.generation) patch.detail = params.detail;
	}
	return patch;
}
//#endregion
//#region src/tasks/task-registry-create.operation.ts
/** Adapters retain writer custody and their existing separate commit boundaries. */
function runTaskCreateOperation(input, operations) {
	const { params } = input;
	const identity = resolveTaskCreateIdentity(params);
	assertTaskOwner(identity);
	const publishResult = (result) => {
		operations.retainTaskCommit?.(result.task.taskId);
		operations.deferCommit(() => operations.onCommitted({
			kind: "task",
			result
		}));
		return result;
	};
	const mergeExisting = (existing, deliveryState) => {
		const patch = buildTaskCreateMergePatch(existing, {
			...params,
			agentId: identity.agentId
		});
		const hasPatch = Object.keys(patch).length > 0;
		const task = hasPatch ? applyTaskRecordPatch(existing, patch, input.now) : existing;
		const persisted = hasPatch && (!isTerminalTaskStatus(existing.status) || !isEquivalentTaskRecord(existing, task));
		operations.assertCurrent?.(existing);
		if (persisted) operations.upsertTask(task, deliveryState);
		return publishResult(hasPatch ? {
			task,
			deliveryState,
			mutation: "updated",
			previous: existing,
			persisted
		} : {
			task,
			deliveryState,
			mutation: "reused",
			persisted: false
		});
	};
	const initial = operations.write(() => {
		const { existing, deliveryState: existingDeliveryState } = operations.readSelection(identity);
		if (existing) {
			const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
			if (requesterOrigin && !existingDeliveryState?.requesterOrigin) {
				const nextDeliveryState = {
					taskId: existing.taskId,
					requesterOrigin,
					lastNotifiedEventAt: existingDeliveryState?.lastNotifiedEventAt
				};
				operations.assertCurrent?.(existing);
				operations.upsertDelivery(nextDeliveryState);
				operations.retainTaskCommit?.(existing.taskId);
				operations.deferCommit(() => operations.onCommitted({
					kind: "delivery",
					task: existing,
					deliveryState: nextDeliveryState
				}));
				return { existingTaskId: existing.taskId };
			}
			return { result: mergeExisting(existing, existingDeliveryState) };
		}
		const { record: task, deliveryState } = buildTaskRecordForCreate(params, identity, input);
		operations.assertCurrent?.(void 0);
		operations.upsertTask(task, deliveryState);
		return { result: publishResult({
			task,
			deliveryState,
			mutation: "created",
			persisted: true
		}) };
	});
	if (initial.result) return initial.result;
	return operations.write(() => {
		const { existing, deliveryState } = operations.readSelection(identity);
		if (!existing || existing.taskId !== initial.existingTaskId) throw new Error("Task creation selection changed before metadata reuse.");
		return mergeExisting(existing, deliveryState);
	});
}
//#endregion
export { TASK_ACTIVITY_LIVENESS_WRITE_MS as a, matchesTaskAgentEventTarget as c, captureTaskAgentEventTarget as d, captureTaskCreationEventTarget as f, recoverTaskAgentEventPublication as i, prepareTaskAgentEventUpdate as l, selectExistingTaskForCreate as n, captureTaskAgentEventChange as o, readTaskCreationEventTarget as p, captureTaskAgentEventCommit as r, captureTaskAgentEventLineage as s, runTaskCreateOperation as t, readTaskAgentEventCommittedTarget as u };
