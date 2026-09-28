import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { B as isEquivalentTaskRecord, L as filterTasksByRunScope, P as cloneTaskRecordForObserver, V as listTasksFromIndex, z as getTaskRelatedSessionIndexKeys } from "./task-registry.store.kernel-BuNI8UuR.mjs";
//#region src/tasks/task-registry.process-state.ts
const TASK_REGISTRY_PROCESS_STATE_KEY = Symbol.for("openclaw.taskRegistry.state");
/** Returns the singleton in-process task registry state. */
function getTaskRegistryProcessState() {
	const globalState = globalThis;
	globalState[TASK_REGISTRY_PROCESS_STATE_KEY] ??= {
		tasks: /* @__PURE__ */ new Map(),
		taskDeliveryStates: /* @__PURE__ */ new Map(),
		taskIdsByRunId: /* @__PURE__ */ new Map(),
		taskIdsByOwnerKey: /* @__PURE__ */ new Map(),
		taskIdsByParentFlowId: /* @__PURE__ */ new Map(),
		taskIdsByRelatedSessionKey: /* @__PURE__ */ new Map(),
		taskIdsByChildSessionKey: /* @__PURE__ */ new Map(),
		tasksWithPendingDelivery: /* @__PURE__ */ new Map(),
		taskActivityByTaskId: /* @__PURE__ */ new Map(),
		taskProgressBatches: /* @__PURE__ */ new Map(),
		runOwners: /* @__PURE__ */ new Map(),
		changeListeners: /* @__PURE__ */ new Set(),
		observers: null,
		projection: {
			epoch: 0,
			dirty: false,
			mutationDepth: 0,
			pending: /* @__PURE__ */ new Set(),
			dirtyScopes: /* @__PURE__ */ new Set()
		}
	};
	return globalState[TASK_REGISTRY_PROCESS_STATE_KEY];
}
function clearTaskProgressBatches() {
	const batches = getTaskRegistryProcessState().taskProgressBatches;
	for (const batch of batches.values()) {
		clearTimeout(batch.timer);
		batch.abortController.abort();
	}
	batches.clear();
}
const indexState = getTaskRegistryProcessState();
function getTasksByRunId(runId) {
	const ids = indexState.taskIdsByRunId.get(runId.trim());
	if (!ids || ids.size === 0) return [];
	return [...ids].map((taskId) => indexState.tasks.get(taskId)).filter((task) => Boolean(task));
}
function getTasksByRunScope(params) {
	return filterTasksByRunScope(getTasksByRunId(params.runId), params);
}
function addRunIdIndex(taskId, runId) {
	const trimmed = runId?.trim();
	if (!trimmed) return;
	let ids = indexState.taskIdsByRunId.get(trimmed);
	if (!ids) {
		ids = /* @__PURE__ */ new Set();
		indexState.taskIdsByRunId.set(trimmed, ids);
	}
	ids.add(taskId);
}
function deleteRunIdIndex(taskId, runId) {
	if (runId?.trim()) deleteIndexedKey(indexState.taskIdsByRunId, runId.trim(), taskId);
}
function addIndexedKey(index, key, taskId) {
	let ids = index.get(key);
	if (!ids) {
		ids = /* @__PURE__ */ new Set();
		index.set(key, ids);
	}
	ids.add(taskId);
}
function deleteIndexedKey(index, key, taskId) {
	const ids = index.get(key);
	if (!ids) return;
	ids.delete(taskId);
	if (ids.size === 0) index.delete(key);
}
function addOwnerKeyIndex(taskId, task) {
	const key = normalizeOptionalString(task.ownerKey);
	if (!key) return;
	addIndexedKey(indexState.taskIdsByOwnerKey, key, taskId);
}
function deleteOwnerKeyIndex(taskId, task) {
	const key = normalizeOptionalString(task.ownerKey);
	if (!key) return;
	deleteIndexedKey(indexState.taskIdsByOwnerKey, key, taskId);
}
function addParentFlowIdIndex(taskId, task) {
	const key = task.parentFlowId?.trim();
	if (!key) return;
	addIndexedKey(indexState.taskIdsByParentFlowId, key, taskId);
}
function deleteParentFlowIdIndex(taskId, task) {
	const key = task.parentFlowId?.trim();
	if (!key) return;
	deleteIndexedKey(indexState.taskIdsByParentFlowId, key, taskId);
}
function addRelatedSessionKeyIndex(taskId, task) {
	const child = normalizeOptionalString(task.childSessionKey);
	if (child) addIndexedKey(indexState.taskIdsByChildSessionKey, child, taskId);
	for (const sessionKey of getTaskRelatedSessionIndexKeys(task)) addIndexedKey(indexState.taskIdsByRelatedSessionKey, sessionKey, taskId);
}
function deleteRelatedSessionKeyIndex(taskId, task) {
	const child = normalizeOptionalString(task.childSessionKey);
	if (child) deleteIndexedKey(indexState.taskIdsByChildSessionKey, child, taskId);
	for (const sessionKey of getTaskRelatedSessionIndexKeys(task)) deleteIndexedKey(indexState.taskIdsByRelatedSessionKey, sessionKey, taskId);
}
function clearTaskRegistryProjectionRows() {
	indexState.tasks.clear();
	indexState.taskDeliveryStates.clear();
	clearTaskRegistryIndexes();
}
function installRestoredTaskRegistrySnapshot(snapshot, committed = true) {
	clearTaskRegistryProjectionRows();
	for (const [id, task] of snapshot.tasks) {
		indexState.tasks.set(id, task);
		addTaskIndexes(task);
	}
	for (const [id, delivery] of snapshot.deliveryStates) indexState.taskDeliveryStates.set(id, delivery);
	if (committed) recordTaskRegistryProjectionWrite("snapshot");
}
/** Update after installing next; previous is the row replaced at that write. */
function updateRunIdIndex(previous, next) {
	const previousRunId = normalizeOptionalString(previous?.runId);
	const nextRunId = normalizeOptionalString(next.runId);
	if (previous && previousRunId === nextRunId) return;
	if (previous) deleteRunIdIndex(previous.taskId, previousRunId);
	if (!nextRunId) return;
	if (!previous || !indexState.taskIdsByRunId.has(nextRunId)) {
		addRunIdIndex(next.taskId, nextRunId);
		return;
	}
	const ids = /* @__PURE__ */ new Set();
	for (const [taskId, task] of indexState.tasks) if (normalizeOptionalString(task.runId) === nextRunId) ids.add(taskId);
	indexState.taskIdsByRunId.set(nextRunId, ids);
}
function clearTaskRegistryIndexes() {
	indexState.taskIdsByRunId.clear();
	indexState.taskIdsByOwnerKey.clear();
	indexState.taskIdsByParentFlowId.clear();
	indexState.taskIdsByRelatedSessionKey.clear();
	indexState.taskIdsByChildSessionKey.clear();
}
function removeTaskIndexes(task) {
	deleteRunIdIndex(task.taskId, task.runId);
	deleteOwnerKeyIndex(task.taskId, task);
	deleteParentFlowIdIndex(task.taskId, task);
	deleteRelatedSessionKeyIndex(task.taskId, task);
}
function addTaskIndexes(task) {
	addRunIdIndex(task.taskId, task.runId);
	addOwnerKeyIndex(task.taskId, task);
	addParentFlowIdIndex(task.taskId, task);
	addRelatedSessionKeyIndex(task.taskId, task);
}
/** Update a published row without disturbing unchanged index insertion order. */
function updateTaskIndexes(current, next) {
	const taskId = next.taskId;
	updateRunIdIndex(current, next);
	if (current.ownerKey !== next.ownerKey) {
		deleteOwnerKeyIndex(taskId, current);
		addOwnerKeyIndex(taskId, next);
	}
	if (current.parentFlowId !== next.parentFlowId) {
		deleteParentFlowIdIndex(taskId, current);
		addParentFlowIdIndex(taskId, next);
	}
	if (current.ownerKey !== next.ownerKey || current.requesterSessionKey !== next.requesterSessionKey || current.childSessionKey !== next.childSessionKey) {
		deleteRelatedSessionKeyIndex(taskId, current);
		addRelatedSessionKeyIndex(taskId, next);
	}
}
function taskIdsInScope(scope) {
	if (!scope) return indexState.tasks.keys();
	return /* @__PURE__ */ new Set([
		scope.taskId,
		...scope.runId ? indexState.taskIdsByRunId.get(scope.runId) ?? [] : [],
		...scope.childSessionKey ? indexState.taskIdsByRelatedSessionKey.get(scope.childSessionKey) ?? [] : []
	]);
}
function matchesScope(task, scope) {
	return task.taskId === scope.taskId || Boolean(scope.runId && task.runId?.trim() === scope.runId) || Boolean(scope.childSessionKey && task.childSessionKey?.trim() === scope.childSessionKey);
}
function selectTaskRegistryScopes(scopes) {
	if (!scopes) return {
		taskIds: indexState.tasks.keys(),
		matches: () => true
	};
	const single = scopes[0];
	if (scopes.length === 1 && single) return {
		taskIds: taskIdsInScope(single),
		matches: (task) => matchesScope(task, single)
	};
	const taskIds = new Set(scopes.map((scope) => scope.taskId));
	const runIds = new Set(scopes.flatMap((scope) => scope.runId || []));
	const childSessionKeys = new Set(scopes.flatMap((scope) => scope.childSessionKey || []));
	const candidates = new Set(taskIds);
	for (const { keys, index } of [{
		keys: runIds,
		index: indexState.taskIdsByRunId
	}, {
		keys: childSessionKeys,
		index: indexState.taskIdsByRelatedSessionKey
	}]) for (const key of keys) for (const taskId of index.get(key) ?? []) candidates.add(taskId);
	return {
		taskIds: candidates,
		matches: (task) => taskIds.has(task.taskId) || runIds.has(task.runId?.trim() ?? "") || childSessionKeys.has(task.childSessionKey?.trim() ?? "")
	};
}
/** Restore transaction-local publication facts without replacing held witness objects. */
function captureTaskRegistryPublicationRollback() {
	const captured = [...indexState.projection.pending].map((pending) => ({
		pending,
		published: new Map(pending.published),
		witnesses: [pending.readWitness, pending.recoveryWitness].flatMap((witness) => witness ? [{
			witness,
			writtenTaskIds: new Set(witness.writtenTaskIds),
			replaced: witness.replaced
		}] : []),
		publication: pending.publication && {
			owner: pending.publication,
			invalidated: new Set(pending.publication.invalidated)
		}
	}));
	return () => {
		for (const { pending, published, witnesses, publication } of captured) {
			pending.published.clear();
			for (const [taskId, task] of published) pending.published.set(taskId, task);
			for (const { witness, writtenTaskIds, replaced } of witnesses) {
				witness.writtenTaskIds.clear();
				for (const taskId of writtenTaskIds) witness.writtenTaskIds.add(taskId);
				witness.replaced = replaced;
			}
			if (publication) {
				publication.owner.invalidated.clear();
				for (const taskId of publication.invalidated) publication.owner.invalidated.add(taskId);
			}
		}
	};
}
/** A committed projection write supersedes held reads even when its value returns to the original. */
function recordTaskRegistryProjectionWrite(source, taskId, deleted = false) {
	const kind = typeof source === "string" ? source : taskId !== void 0 && source.has(taskId) ? "snapshot" : "refresh";
	for (const pending of indexState.projection.pending) {
		const publication = pending.publication;
		const recovery = pending.recoveryWitness;
		if (recovery && kind !== "delivery" && kind !== "refresh") {
			if (taskId === void 0) {
				recovery.replaced = true;
				for (const id of publication?.records.keys() ?? []) publication?.invalidated.add(id);
			} else if (taskId === pending.scope.taskId) {
				recovery.writtenTaskIds.add(taskId);
				publication?.invalidated.add(taskId);
			}
		}
		const witness = pending.readWitness;
		if (witness) {
			const current = taskId === void 0 ? void 0 : indexState.tasks.get(taskId);
			if (taskId === void 0) witness.replaced = true;
			else if (taskId === pending.scope.taskId || pending.published.has(taskId) || current && matchesScope(current, pending.scope)) witness.writtenTaskIds.add(taskId);
		}
		if (!publication || kind === "delivery") continue;
		for (const id of taskId === void 0 ? publication.records.keys() : [taskId]) {
			const expected = publication.records.get(id);
			if (!expected || (kind === "snapshot" || kind === "refresh") && !witness && !publication.ready.has(id)) continue;
			const current = deleted ? void 0 : indexState.tasks.get(id);
			if (current === void 0 || !isEquivalentTaskRecord(expected, current)) publication.invalidated.add(id);
		}
	}
}
function recordTaskRegistryPublication(event) {
	for (const pending of indexState.projection.pending) if (event.kind === "restored") {
		for (const task of indexState.tasks.values()) if (matchesScope(task, pending.scope)) pending.published.set(task.taskId, cloneTaskRecordForObserver(task));
	} else {
		const task = event.kind === "upserted" ? event.task : event.previous;
		if (pending.published.has(task.taskId) || matchesScope(task, pending.scope)) pending.published.set(task.taskId, event.kind === "upserted" ? cloneTaskRecordForObserver(event.task) : void 0);
	}
}
function selectLiveTaskFlowForSync(taskId) {
	const current = indexState.tasks.get(taskId);
	const flowId = current?.parentFlowId?.trim();
	return current && flowId && listTasksFromIndex(indexState.tasks, indexState.taskIdsByParentFlowId, flowId)[0]?.taskId === taskId ? {
		taskId,
		flowId,
		createdAt: current.createdAt
	} : void 0;
}
//#endregion
export { updateRunIdIndex as C, taskIdsInScope as S, recordTaskRegistryProjectionWrite as _, addTaskIndexes as a, selectLiveTaskFlowForSync as b, clearTaskRegistryProjectionRows as c, deleteRelatedSessionKeyIndex as d, getTaskRegistryProcessState as f, matchesScope as g, installRestoredTaskRegistrySnapshot as h, addRunIdIndex as i, deleteOwnerKeyIndex as l, getTasksByRunScope as m, addParentFlowIdIndex as n, captureTaskRegistryPublicationRollback as o, getTasksByRunId as p, addRelatedSessionKeyIndex as r, clearTaskProgressBatches as s, addOwnerKeyIndex as t, deleteParentFlowIdIndex as u, recordTaskRegistryPublication as v, updateTaskIndexes as w, selectTaskRegistryScopes as x, removeTaskIndexes as y };
