import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { $ as isActiveTaskStatus, C as filterCurrentTaskRunBackings, I as compareTasksNewestFirst, J as selectTaskRecordsForOwnerTree, N as cloneTaskRecord, P as cloneTaskRecordForObserver, U as normalizeTaskTimestamps, V as listTasksFromIndex, W as pickPreferredRunIdTask } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { a as ensureTaskFlowRegistryReady, d as getTaskFlowById, p as getTaskMirroredFlowIds } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { _ as recordTaskRegistryProjectionWrite, f as getTaskRegistryProcessState, p as getTasksByRunId, y as removeTaskIndexes } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { i as getTaskRegistryStore, o as resetTaskRegistryRuntimeForTests, s as tryPersistTaskDelete } from "./task-registry.store-1Swe_0g5.mjs";
import { C as taskRegistryLog, E as withTaskRegistryMutation, P as clearTaskFlowSyncRetries, _ as taskDeliveryStates, a as emitTaskRegistryObserverEvent, b as taskIdsByParentFlowId, f as resetTaskRegistryRestoreState, i as clearTaskRegistryMemory, j as resetTaskRegistryListenerState, o as ensureTaskRegistryReady, r as bumpTaskRegistryRevision, u as readTaskRegistryRevision, w as tasks, x as taskIdsByRelatedSessionKey, y as taskIdsByOwnerKey } from "./task-registry-state-Cibd1d5c.mjs";
import { i as resolveTaskSessionAgentId, n as prepareTaskRegistryRead, o as taskMatchesRelatedSession, r as prepareTaskRegistryReadOwner, t as createTaskRegistryReadPreparation } from "./task-registry-read-BpKCOEEj.mjs";
import { t as clearTaskActivity } from "./task-registry-activity-qvAA4Okp.mjs";
import { t as assertParentFlowRecordLinkAllowed } from "./task-registry-parent-flow-rules-DMtL_vOT.mjs";
import { n as deliveryRuntimeLoader, t as controlRuntimeLoader } from "./task-registry-runtime-loaders-DtafDo1W.mjs";
import { setImmediate } from "node:timers/promises";
//#region src/tasks/task-registry-flow-link.ts
function assertParentFlowLinkAllowed(params) {
	const flowId = params.parentFlowId?.trim();
	assertParentFlowRecordLinkAllowed(params, flowId && params.scopeKind === "session" ? getTaskFlowById(flowId) : void 0);
}
function ensureLinkedTaskFlowRegistryReady(task) {
	if (task.parentFlowId?.trim()) ensureTaskFlowRegistryReady();
}
//#endregion
//#region src/tasks/task-registry-query.ts
/** Cleanup reads session activity without copying retained task payloads. */
function listTaskSessionActivity() {
	ensureTaskRegistryReady();
	return Array.from(tasks.values(), (task) => ({
		taskKind: task.taskKind,
		status: task.status,
		requesterSessionKey: task.requesterSessionKey,
		ownerKey: task.ownerKey
	}));
}
/** Coarse tree candidates; callers still enforce agent identity and current control authority. */
function listTaskRecordsForOwnerTree(rootOwnerKeys) {
	ensureTaskRegistryReady();
	return selectTaskRecordsForOwnerTree(tasks, taskIdsByOwnerKey, rootOwnerKeys).map((task) => cloneTaskRecord(task));
}
function taskMatchesAgent(task, agentId, cfg) {
	if (!agentId) return true;
	const knownAgentId = normalizeOptionalString(task.agentId) ?? normalizeOptionalString(task.requesterAgentId);
	if (knownAgentId) return knownAgentId === agentId;
	return [
		task.requesterSessionKey,
		task.childSessionKey,
		task.ownerKey
	].some((candidate) => resolveTaskSessionAgentId(candidate, void 0, cfg) === agentId);
}
function taskUpdatedAt(task) {
	return task.lastEventAt ?? task.endedAt ?? task.startedAt ?? task.createdAt;
}
function compareTaskPageOrder(left, right, sortBy) {
	const leftAt = sortBy === "endedAt" ? left.endedAt ?? -1 : taskUpdatedAt(left);
	const rightAt = sortBy === "endedAt" ? right.endedAt ?? -1 : taskUpdatedAt(right);
	if (leftAt !== rightAt) return rightAt - leftAt;
	return left.taskId < right.taskId ? -1 : left.taskId > right.taskId ? 1 : 0;
}
function siftWorstTaskDown(heap, startIndex, compare) {
	let index = startIndex;
	while (true) {
		const leftIndex = index * 2 + 1;
		if (leftIndex >= heap.length) return;
		const left = heap[leftIndex];
		const current = heap[index];
		if (!left || !current) return;
		const rightIndex = leftIndex + 1;
		let worstIndex = leftIndex;
		const right = heap[rightIndex];
		if (right && compare(right, left) > 0) worstIndex = rightIndex;
		const worst = heap[worstIndex];
		if (!worst || compare(worst, current) <= 0) return;
		heap[index] = worst;
		heap[worstIndex] = current;
		index = worstIndex;
	}
}
function heapifyWorstTaskFirst(heap, compare) {
	for (let index = Math.floor(heap.length / 2) - 1; index >= 0; index -= 1) siftWorstTaskDown(heap, index, compare);
}
const TASK_PAGE_MAX_ATTEMPTS = 3;
const TASK_PAGE_YIELD_INTERVAL_MS = 12;
async function listTaskRecordPage(params) {
	const prepareRead = params.prepareRead ?? createTaskRegistryReadPreparation();
	let read = await prepareRead();
	if (!read) return err("registry_changed");
	const statuses = params.statuses ? new Set(params.statuses) : null;
	const agentId = normalizeOptionalString(params.agentId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const compare = (left, right) => compareTaskPageOrder(left, right, params.sortBy ?? "updatedAt");
	const windowSize = params.offset + params.limit;
	let workStartedAt = performance.now();
	for (let attempt = 0; attempt < TASK_PAGE_MAX_ATTEMPTS; attempt += 1) {
		if (attempt > 0) {
			const preparationStartedAt = performance.now();
			read = await prepareRead();
			if (!read) return err("registry_changed");
			workStartedAt += performance.now() - preparationStartedAt;
		}
		const revision = readTaskRegistryRevision();
		if (params.expectedRevision !== void 0 && params.expectedRevision !== revision) return err("cursor_stale");
		const source = sessionKey ? taskIdsByRelatedSessionKey.get(sessionKey) : tasks;
		const scanLimit = source?.size ?? 0;
		const window = [];
		let matchingCount = 0;
		let heapReady = false;
		let scannedCount = 0;
		const iterator = source?.keys() ?? [].values();
		let current = iterator.next();
		while (!current.done && scannedCount < scanLimit) {
			if (scannedCount > 0 && performance.now() - workStartedAt >= TASK_PAGE_YIELD_INTERVAL_MS) {
				await setImmediate();
				workStartedAt = performance.now();
				if (params.expectedRevision !== void 0 && revision !== readTaskRegistryRevision()) return err("cursor_stale");
				if (revision === readTaskRegistryRevision()) read.assertCurrent();
			}
			const batch = [];
			const batchEnd = Math.min(scannedCount + 32, scanLimit);
			while (!current.done && scannedCount < batchEnd) {
				const task = tasks.get(current.value);
				if (task) batch.push(task);
				scannedCount += 1;
				current = iterator.next();
			}
			if (revision === readTaskRegistryRevision()) {
				for (const task of batch) if (!read.isTaskCurrent(task.taskId)) return err("registry_changed");
			}
			const candidates = batch.filter((task) => (!statuses || statuses.has(task.status)) && taskMatchesAgent(task, agentId, params.cfg) && taskMatchesRelatedSession(task, sessionKey, params.sessionAgentId, params.cfg));
			const filter = params.prepareFilter?.(candidates);
			for (const task of candidates) {
				if (filter && !filter(task)) continue;
				matchingCount += 1;
				if (windowSize <= 0) continue;
				if (window.length < windowSize) {
					window.push(task);
					continue;
				}
				if (!heapReady) {
					heapifyWorstTaskFirst(window, compare);
					heapReady = true;
				}
				const cutoff = window[0];
				if (cutoff && compare(task, cutoff) < 0) {
					window[0] = task;
					siftWorstTaskDown(window, 0, compare);
				}
			}
		}
		if (revision !== readTaskRegistryRevision()) {
			if (params.expectedRevision !== void 0) return err("cursor_stale");
			continue;
		}
		read.assertCurrent();
		const selected = params.offset >= matchingCount ? [] : window.toSorted(compare).slice(params.offset);
		for (const task of selected) if (!read.isTaskCurrent(task.taskId)) return err("registry_changed");
		const prepared = read;
		return ok({
			tasks: selected.map((task) => cloneTaskRecord(task)),
			hasMore: params.offset + selected.length < matchingCount,
			revision,
			isCurrent: () => {
				if (revision !== readTaskRegistryRevision()) return false;
				try {
					prepared.assertCurrent();
					return selected.every((task) => tasks.get(task.taskId) === task && prepared.isTaskCurrent(task.taskId));
				} catch {
					return false;
				}
			}
		});
	}
	return err("registry_changed");
}
function listTaskRecords(filter) {
	ensureTaskRegistryReady();
	const records = [...tasks.values()];
	return (filter ? records.filter(filter) : records).map((task, insertionIndex) => Object.assign({}, cloneTaskRecord(task), { insertionIndex })).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _insertionIndex, ...task }) => task);
}
function hasActiveTaskForChildSessionKey(params) {
	ensureTaskRegistryReady();
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return false;
	const ids = taskIdsByRelatedSessionKey.get(sessionKey);
	if (!ids) return false;
	for (const taskId of ids) {
		if (taskId === params.excludeTaskId) continue;
		const task = tasks.get(taskId);
		if (task && isActiveTaskStatus(task.status) && normalizeOptionalString(task.childSessionKey) === sessionKey && (!params.agentId || resolveTaskSessionAgentId(task.childSessionKey, task.agentId) === params.agentId)) return true;
	}
	return false;
}
function getTaskById(taskId) {
	ensureTaskRegistryReady();
	const task = tasks.get(taskId.trim());
	return task ? cloneTaskRecord(task) : void 0;
}
function findTaskByRunId(runId) {
	ensureTaskRegistryReady();
	const matches = getTasksByRunId(runId);
	let mirroredFlowIds;
	const task = pickPreferredRunIdTask(filterCurrentTaskRunBackings(matches, (flowId) => {
		mirroredFlowIds ??= getTaskMirroredFlowIds(matches.flatMap((candidate) => candidate.parentFlowId ? [candidate.parentFlowId.trim()] : []));
		return mirroredFlowIds.has(flowId);
	}));
	return task ? cloneTaskRecord(task) : void 0;
}
function listTasksForOwnerKey(ownerKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(ownerKey);
	if (!key) return [];
	return listTasksFromIndex(tasks, taskIdsByOwnerKey, key);
}
async function listFreshTasksForOwnerKey(ownerKey) {
	const key = normalizeOptionalString(ownerKey);
	if (!key) return [];
	const owner = await prepareTaskRegistryReadOwner();
	const { store } = owner;
	if (store.listTasksForOwnerKey) try {
		const merged = /* @__PURE__ */ new Map();
		const records = await store.listTasksForOwnerKey(owner.context, key, owner.assertCurrent);
		owner.assertCurrent();
		for (const task of records) merged.set(task.taskId, cloneTaskRecord(normalizeTaskTimestamps(task)));
		return [...merged.values()].map((task, insertionIndex) => Object.assign({}, task, { insertionIndex })).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _insertionIndex, ...task }) => task);
	} catch (error) {
		owner.assertCurrent();
		taskRegistryLog.warn("Failed to read fresh owner task registry records", {
			ownerKey: key,
			error
		});
	}
	const read = await prepareTaskRegistryRead(owner);
	if (!read) throw new Error("Task activity did not stabilize. Retry the owner lookup.");
	read.assertCurrent();
	return listTasksFromIndex(tasks, taskIdsByOwnerKey, key);
}
function listTasksForFlowId(flowId) {
	ensureTaskRegistryReady();
	const key = flowId.trim();
	if (!key) return [];
	return listTasksFromIndex(tasks, taskIdsByParentFlowId, key);
}
/** Snapshot linked task states in one read without cloning retained task payloads. */
function listTaskStatesForFlowIds(flowIds) {
	ensureTaskRegistryReady();
	const states = /* @__PURE__ */ new Map();
	for (const flowId of flowIds) {
		const key = flowId.trim();
		if (!key || states.has(key)) continue;
		const linked = [];
		for (const taskId of taskIdsByParentFlowId.get(key) ?? []) {
			const task = tasks.get(taskId);
			if (task) linked.push({
				taskId: task.taskId,
				runtime: task.runtime,
				status: task.status,
				error: task.error
			});
		}
		states.set(key, linked);
	}
	return states;
}
function findLatestTaskForRelatedSessionKey(sessionKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	const selected = [...taskIdsByRelatedSessionKey.get(key) ?? []].flatMap((taskId, insertionIndex) => {
		const task = tasks.get(taskId);
		return task ? [{
			task,
			createdAt: task.createdAt,
			insertionIndex
		}] : [];
	}).toSorted(compareTasksNewestFirst).find(({ task }) => taskMatchesRelatedSession(task, key))?.task;
	return selected ? cloneTaskRecord(selected) : void 0;
}
function listTasksForRelatedSessionKey(sessionKey, sessionAgentId) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(sessionKey);
	if (!key) return [];
	return listTasksFromIndex(tasks, taskIdsByRelatedSessionKey, key).filter((task) => taskMatchesRelatedSession(task, key, sessionAgentId));
}
function resolveTaskForLookupToken(token) {
	const lookup = token.trim();
	if (!lookup) return;
	return getTaskById(lookup) ?? findTaskByRunId(lookup) ?? findLatestTaskForRelatedSessionKey(lookup);
}
function deleteTaskRecordById(taskId) {
	return withTaskRegistryMutation(() => {
		ensureTaskRegistryReady();
		const current = tasks.get(taskId);
		if (!current) return false;
		ensureLinkedTaskFlowRegistryReady(current);
		if (!tryPersistTaskDelete(taskId)) return false;
		const indexedCurrent = tasks.get(taskId);
		if (indexedCurrent) removeTaskIndexes(indexedCurrent);
		clearTaskActivity(taskId);
		recordTaskRegistryProjectionWrite("task", taskId, true);
		tasks.delete(taskId);
		bumpTaskRegistryRevision();
		taskDeliveryStates.delete(taskId);
		emitTaskRegistryObserverEvent(() => ({
			kind: "deleted",
			taskId: current.taskId,
			previous: cloneTaskRecordForObserver(current)
		}));
		return true;
	}, () => false);
}
function resetTaskRegistryForTests() {
	clearTaskFlowSyncRetries();
	getTaskRegistryProcessState().runOwners.clear();
	clearTaskRegistryMemory();
	resetTaskRegistryRestoreState();
	resetTaskRegistryRuntimeForTests();
	resetTaskRegistryListenerState();
	deliveryRuntimeLoader.clear();
	controlRuntimeLoader.clear();
	getTaskRegistryStore().close?.();
}
//#endregion
export { ensureLinkedTaskFlowRegistryReady as _, listFreshTasksForOwnerKey as a, listTaskRecordsForOwnerTree as c, listTasksForFlowId as d, listTasksForOwnerKey as f, assertParentFlowLinkAllowed as g, resolveTaskForLookupToken as h, hasActiveTaskForChildSessionKey as i, listTaskSessionActivity as l, resetTaskRegistryForTests as m, findTaskByRunId as n, listTaskRecordPage as o, listTasksForRelatedSessionKey as p, getTaskById as r, listTaskRecords as s, deleteTaskRecordById as t, listTaskStatesForFlowIds as u };
