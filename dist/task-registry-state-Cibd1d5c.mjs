import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { c as runOutsideOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { p as openClawStateDatabaseCache, r as captureOpenClawStateDatabaseReadAdmission, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { a as isSqliteWorkerError } from "./sqlite-worker-contract-DgNznZvn.mjs";
import { x as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { n as restoreAgentSchemaInspectionError } from "./openclaw-agent-schema-inspection-response-q57qjoFT.mjs";
import { B as isEquivalentTaskRecord, M as cloneTaskDeliveryState, N as cloneTaskRecord, P as cloneTaskRecordForObserver, U as normalizeTaskTimestamps, V as listTasksFromIndex } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { A as getTaskFlowRegistryStore, E as syncFlowFromTaskResult, O as createAsyncRegistryRestore, k as createSyncRegistryReader, w as runTaskFlowRegistryWorkerMutation } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { n as restoreTaskExecutionSnapshot } from "./task-execution-owner-CARpGK5P.mjs";
import { S as taskIdsInScope, _ as recordTaskRegistryProjectionWrite, a as addTaskIndexes, b as selectLiveTaskFlowForSync, c as clearTaskRegistryProjectionRows, f as getTaskRegistryProcessState, g as matchesScope, h as installRestoredTaskRegistrySnapshot, o as captureTaskRegistryPublicationRollback, s as clearTaskProgressBatches, v as recordTaskRegistryPublication, w as updateTaskIndexes, x as selectTaskRegistryScopes, y as removeTaskIndexes } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { i as getTaskRegistryStore, n as deliverTaskRegistryObserverEvent } from "./task-registry.store-1Swe_0g5.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/tasks/task-registry-flow-sync.ts
const log = createSubsystemLogger("tasks/registry");
const TASK_FLOW_SYNC_RETRY_DELAYS_MS = [
	1e3,
	5e3,
	25e3,
	12e4,
	6e5
];
const taskFlowSyncRetryTimers = /* @__PURE__ */ new Map();
async function syncLiveTaskFlow(context, store, owner, projectionPrepared = false, onPublicationError) {
	const prepared = projectionPrepared || await owner.prepare(context, store, 1);
	owner.assertCurrent(context, store);
	if (!prepared) return {
		kind: "retry",
		reason: "projection_changed"
	};
	const selected = owner.selectCurrent();
	if (!selected) return { kind: "not-selected" };
	const { taskId, flowId } = selected;
	const flowStore = getTaskFlowRegistryStore();
	const assertCurrent = () => {
		owner.assertCurrent(context, store);
		if (getTaskFlowRegistryStore() !== flowStore) throw new Error("Live task-flow retry store is no longer current");
	};
	const outcome = await runTaskFlowRegistryWorkerMutation({
		flowId,
		admission: context.admission,
		onPublicationError
	}, () => store.syncLiveTaskFlowAsync(context, {
		taskId,
		flowId
	}, {
		assertCurrent,
		isSelected(selection) {
			const latest = owner.selectCurrent();
			return latest?.taskId === selection.taskId && latest.flowId === selection.flowId && latest.createdAt === selection.createdAt;
		}
	}), async () => {
		assertCurrent();
		const flow = await flowStore.readFlowAsync(context, flowId);
		assertCurrent();
		return flow;
	});
	assertCurrent();
	return outcome;
}
function clearTaskFlowSyncRetries(kind) {
	for (const [store, timers] of taskFlowSyncRetryTimers) {
		for (const [key, retry] of timers) if (kind === void 0 || retry.selection.kind === kind) {
			clearTimeout(retry.timer);
			timers.delete(key);
		}
		if (timers.size === 0) taskFlowSyncRetryTimers.delete(store);
	}
}
function scheduleTaskFlowSyncRetry(context, store, taskId, operation, selection, attempt = 0, upgradePending = false) {
	const id = taskId.trim();
	const identityKey = context.admission.identity.key;
	const key = `${identityKey}\u0000${selection.kind}\u0000${id}`;
	const timers = taskFlowSyncRetryTimers.get(store) ?? /* @__PURE__ */ new Map();
	if (!id) return;
	const pending = timers.get(key);
	if (pending) {
		if (selection.kind === "live" && pending.selection.kind === "live") {
			const hasIncomingEffects = selection.afterSync !== void 0;
			const hasPendingEffects = pending.selection.afterSync !== void 0;
			if (hasIncomingEffects && !hasPendingEffects || upgradePending && (hasIncomingEffects || !hasPendingEffects)) pending.selection = selection;
		}
		return;
	}
	const delayMs = TASK_FLOW_SYNC_RETRY_DELAYS_MS[attempt];
	if (delayMs === void 0) {
		log.warn("Exhausted parent flow sync retries from task", {
			operation,
			taskId: id
		});
		return;
	}
	const retry = () => {
		const retrySelection = scheduled.selection;
		timers.delete(key);
		if (timers.size === 0) taskFlowSyncRetryTimers.delete(store);
		runWithGatewayDetachedWorkContinuation(async () => {
			const current = captureOpenClawStateWorkerContext({
				path: context.admission.databasePath,
				env: context.environment
			});
			if (current.admission.identity.key !== identityKey) return;
			if (retrySelection.kind === "live") {
				if (getTaskRegistryStore() !== store) return;
				try {
					const outcome = await syncLiveTaskFlow(current, store, retrySelection.owner);
					const failure = outcome.kind === "result" && !outcome.result.ok ? outcome.result : void 0;
					if (outcome.kind === "retry" || failure) {
						log.warn("Failed to retry parent flow sync from task", {
							operation,
							taskId: id,
							flowId: failure?.current.flowId,
							reason: outcome.kind === "retry" ? outcome.reason : failure?.reason
						});
						scheduleTaskFlowSyncRetry(current, store, id, operation, retrySelection, attempt + 1);
					} else {
						retrySelection.owner.assertCurrent(current, store);
						await retrySelection.afterSync?.(current);
						retrySelection.owner.assertCurrent(current, store);
					}
				} catch (error) {
					if (isSqliteWorkerError(error, "overloaded")) {
						current.admission.assertCurrent();
						if (getTaskRegistryStore() === store) scheduleTaskFlowSyncRetry(current, store, id, operation, retrySelection, attempt + 1);
					}
					throw error;
				}
				return;
			}
			let outcome;
			try {
				outcome = await store.syncTaskFlowAsync(current, { taskId: id });
			} catch (error) {
				if (isSqliteWorkerError(error, "overloaded")) {
					current.admission.assertCurrent();
					if (current.admission.identity.key === identityKey) scheduleTaskFlowSyncRetry(current, store, id, operation, retrySelection, attempt + 1);
				}
				throw error;
			}
			if (outcome.kind === "error") {
				scheduleTaskFlowSyncRetry(current, store, id, operation, retrySelection, attempt + 1);
				throw restoreAgentSchemaInspectionError(outcome.error);
			}
			if (!outcome.result.ok) {
				log.warn("Failed to retry parent flow sync from task", {
					operation,
					taskId: id,
					flowId: outcome.flowId,
					reason: outcome.result.reason
				});
				scheduleTaskFlowSyncRetry(current, store, id, operation, retrySelection, attempt + 1);
			}
		}, "tasks:mutation").catch((error) => {
			log.warn("Failed to admit parent flow sync retry from task", {
				operation,
				taskId: id,
				error
			});
		});
	};
	const timer = runOutsideOpenClawDatabaseMaintenanceScope(() => setTimeout(retry, delayMs));
	timer.unref?.();
	const scheduled = {
		timer,
		selection
	};
	timers.set(key, scheduled);
	taskFlowSyncRetryTimers.set(store, timers);
}
/** Returned settlement remains durable even when its registry projection is superseded. */
function retainTaskRegistryRestoreFlowObligations(context, store, settledTasks) {
	for (const task of settledTasks) if (task.parentFlowId?.trim()) scheduleTaskFlowSyncRetry(context, store, task.taskId, "restore", { kind: "restored" });
}
/** Register durable follow-up before a superseded projection receipt can be discarded. */
function receiveTaskRegistryRestoreResult(result, context, store) {
	let firstError;
	for (const outcome of result.flowSyncs) {
		if (outcome.kind === "error") {
			scheduleTaskFlowSyncRetry(context, store, outcome.taskId, "restore", { kind: "restored" });
			firstError ??= restoreAgentSchemaInspectionError(outcome.error);
			continue;
		}
		if (!outcome.result.ok) {
			log.warn("Failed to sync parent flow from task mutation", {
				operation: "restore",
				taskId: outcome.taskId,
				flowId: outcome.flowId,
				reason: outcome.result.reason
			});
			scheduleTaskFlowSyncRetry(context, store, outcome.taskId, "restore", { kind: "restored" });
		}
	}
	if (firstError) throw firstError;
}
/** Initial synchronous mutation ordering stays intact; retries use the awaited live owner. */
function syncTaskFlowWithLiveRetry(task, operation, owner) {
	const result = syncFlowFromTaskResult(task);
	if (result.ok) return;
	log.warn("Failed to sync parent flow from task mutation", {
		operation,
		taskId: task.taskId,
		flowId: task.parentFlowId,
		reason: result.reason
	});
	try {
		scheduleTaskFlowSyncRetry(captureOpenClawStateWorkerContext(), getTaskRegistryStore(), task.taskId, operation, {
			kind: "live",
			owner
		});
	} catch (error) {
		log.warn("Failed to admit parent flow sync retry from task", {
			operation,
			taskId: task.taskId,
			error
		});
	}
}
/** Report completed flow work while retaining the existing retry when it is deferred. */
async function syncTaskFlowWithLiveRetryAsync(context, store, task, operation, owner) {
	let outcome;
	let publicationSettled = true;
	try {
		outcome = await syncLiveTaskFlow(context, store, owner, true, () => {
			publicationSettled = false;
		});
	} catch (error) {
		if (!isSqliteWorkerError(error, "overloaded")) throw error;
		owner.assertCurrent(context, store);
		scheduleTaskFlowSyncRetry(context, store, task.taskId, operation, {
			kind: "live",
			owner
		});
		return false;
	}
	if (outcome.kind === "retry" || outcome.kind === "result" && !outcome.result.ok) {
		log.warn("Failed to sync parent flow from task mutation", {
			operation,
			taskId: task.taskId,
			flowId: task.parentFlowId
		});
		scheduleTaskFlowSyncRetry(context, store, task.taskId, operation, {
			kind: "live",
			owner
		});
		return false;
	}
	return publicationSettled;
}
/** A known commit whose publication hook never ran still owns its flow follow-up. */
function retainCommittedTaskFlowEffects(context, store, task, operation, owner, afterSync) {
	if (!task.parentFlowId?.trim()) return;
	owner.assertCurrent(context, store);
	scheduleTaskFlowSyncRetry(context, store, task.taskId, operation, {
		kind: "live",
		owner,
		afterSync
	}, 0, true);
}
//#endregion
//#region src/tasks/task-registry-listener-state.ts
const taskRegistryProcessState$1 = getTaskRegistryProcessState();
let listenerStarter = () => {};
function withPendingTaskRegistryEvents(refresh, operation) {
	const lease = taskRegistryProcessState$1.listener?.events.prepare();
	try {
		refresh();
		lease?.consume();
		return operation();
	} finally {
		lease?.release();
	}
}
function hasPendingTaskRegistryEvents(taskId) {
	return taskRegistryProcessState$1.listener?.events.pending(taskId) ?? false;
}
function listPendingTaskRegistryEventTaskIds() {
	return taskRegistryProcessState$1.listener?.events.pendingTaskIds() ?? [];
}
function captureTaskRegistryReadFence(admission) {
	return taskRegistryProcessState$1.listener?.events.captureReadFence(admission) ?? Promise.resolve();
}
function startTaskRegistryListener() {
	listenerStarter();
}
function setTaskRegistryListenerStarter(starter) {
	listenerStarter = starter;
}
function claimTaskRegistryListenerStart(events) {
	if (taskRegistryProcessState$1.listener !== void 0) return false;
	taskRegistryProcessState$1.listener = {
		stop: null,
		events
	};
	return true;
}
function setTaskRegistryListenerStop(stop) {
	if (taskRegistryProcessState$1.listener) taskRegistryProcessState$1.listener.stop = stop;
}
function resetTaskRegistryListenerState() {
	taskRegistryProcessState$1.listener?.stop?.();
	taskRegistryProcessState$1.listener = void 0;
	clearTaskProgressBatches();
}
//#endregion
//#region src/tasks/task-registry-projection-prepare.ts
function createTaskRegistryProjectionPreparation(owner) {
	const { projection } = getTaskRegistryProcessState();
	let pending;
	return async (context, store, maxAttempts = Number.POSITIVE_INFINITY) => {
		owner.assertCurrent(context, store);
		await owner.ensureReady(context);
		owner.assertCurrent(context, store);
		let attempts = 0;
		while (projection.mutationDepth === 0 && (projection.dirty || projection.dirtyScopes.size > 0)) {
			if (attempts++ >= maxAttempts) return false;
			const epoch = projection.epoch;
			const databaseKey = context.admission.identity.key;
			let preparation = pending;
			if (!preparation || preparation.databaseKey !== databaseKey || preparation.store !== store || preparation.epoch !== epoch) {
				const scopes = projection.dirty ? void 0 : [...projection.dirtyScopes];
				preparation = {
					databaseKey,
					store,
					epoch,
					result: store.loadMutationSnapshotAsync(context, scopes).then((snapshot) => {
						owner.assertCurrent(context, store);
						if (epoch !== projection.epoch) return false;
						owner.installSnapshot(snapshot, scopes);
						owner.markRestored();
						return true;
					})
				};
				pending = preparation;
			}
			try {
				const prepared = await preparation.result;
				owner.assertCurrent(context, store);
				if (prepared) return true;
			} finally {
				if (pending === preparation) pending = void 0;
			}
		}
		return true;
	};
}
//#endregion
//#region src/tasks/task-registry-worker-publication.ts
function* currentTasksInScope(scope) {
	const { tasks } = getTaskRegistryProcessState();
	for (const taskId of taskIdsInScope(scope)) {
		const task = tasks.get(taskId);
		if (task && matchesScope(task, scope)) yield task;
	}
}
function captureTaskRegistryWorkerSnapshot(scope) {
	const state = getTaskRegistryProcessState();
	const captured = {
		tasks: /* @__PURE__ */ new Map(),
		deliveryStates: /* @__PURE__ */ new Map()
	};
	for (const task of currentTasksInScope(scope)) {
		const taskId = task.taskId;
		const delivery = state.taskDeliveryStates.get(taskId);
		captured.tasks.set(taskId, cloneTaskRecord(task));
		if (delivery) captured.deliveryStates.set(taskId, cloneTaskDeliveryState(delivery));
	}
	return captured;
}
function createTaskRegistryPublicationRecovery(pending, recover) {
	const witness = {
		writtenTaskIds: /* @__PURE__ */ new Set(),
		replaced: false
	};
	pending.recoveryWitness = witness;
	let expected;
	const superseded = /* @__PURE__ */ new Error("Task publication was superseded by a current write");
	return {
		isSuperseded: (error) => error === superseded,
		begin() {
			witness.writtenTaskIds.clear();
			witness.replaced = false;
		},
		recover: (snapshot) => {
			expected = recover(snapshot);
			return expected;
		},
		assertCurrent() {
			if (!expected) return;
			const current = getTaskRegistryProcessState().tasks.get(expected.taskId);
			if (witness.replaced || witness.writtenTaskIds.has(expected.taskId) || !current || !isEquivalentTaskRecord(current, expected)) throw superseded;
		}
	};
}
/** Preserve committed projection writes, including ABA, without restarting the settled mutation. */
function mergeTaskRegistryWorkerSnapshot(params) {
	const { scope, captured, snapshot, witness } = params;
	const state = getTaskRegistryProcessState();
	let conflicted = false;
	const merged = {
		tasks: new Map(snapshot.tasks),
		deliveryStates: new Map(snapshot.deliveryStates)
	};
	for (const taskId of /* @__PURE__ */ new Set([
		...captured.tasks.keys(),
		...snapshot.tasks.keys(),
		...Array.from(currentTasksInScope(scope), (task) => task.taskId)
	])) {
		const current = state.tasks.get(taskId);
		if (current && !matchesScope(current, scope)) {
			const stored = snapshot.tasks.get(taskId);
			conflicted ||= captured.tasks.has(taskId) || Boolean(stored && matchesScope(stored, scope));
			merged.tasks.delete(taskId);
			merged.deliveryStates.delete(taskId);
			continue;
		}
		const delivery = state.taskDeliveryStates.get(taskId);
		if (!witness.replaced && !witness.writtenTaskIds.has(taskId) && isDeepStrictEqual(captured.tasks.get(taskId), current) && isDeepStrictEqual(captured.deliveryStates.get(taskId), delivery)) continue;
		conflicted = true;
		if (current) merged.tasks.set(taskId, current);
		else merged.tasks.delete(taskId);
		if (delivery) merged.deliveryStates.set(taskId, delivery);
		else merged.deliveryStates.delete(taskId);
	}
	return {
		snapshot: merged,
		conflicted
	};
}
/** Order canonical reads and installs, releasing before effects or observers can await descendants. */
async function reconcileTaskRegistryWorkerSnapshot(params) {
	const { pending, assertCurrent, read, install } = params;
	const projection = getTaskRegistryProcessState().projection;
	const predecessor = projection.readTail;
	const phase = createDeferredCore();
	projection.readTail = phase.promise;
	try {
		await predecessor;
		assertCurrent();
		const captured = captureTaskRegistryWorkerSnapshot(pending.scope);
		const witness = {
			writtenTaskIds: /* @__PURE__ */ new Set(),
			replaced: false
		};
		pending.readWitness = witness;
		const snapshot = await read();
		delete pending.readWitness;
		assertCurrent();
		const merged = mergeTaskRegistryWorkerSnapshot({
			scope: pending.scope,
			captured,
			snapshot,
			witness
		});
		const recovery = pending.recoveryWitness;
		if (params.recoverPublication && recovery && !recovery.replaced && !recovery.writtenTaskIds.has(pending.scope.taskId)) {
			const recovered = params.recoverPublication(merged.snapshot);
			if (recovered) {
				if (recovered.taskId !== pending.scope.taskId) throw new Error("Recovered publication differs from its committed task target");
				claimTaskRegistryPublication(pending, /* @__PURE__ */ new Map([[recovered.taskId, recovered]]));
			}
		}
		delete pending.recoveryWitness;
		try {
			install(merged.snapshot, params.taskRowsWritten === false ? void 0 : pending.publication?.records);
		} finally {
			pending.recoveryWitness = recovery;
		}
		const { tasks } = getTaskRegistryProcessState();
		for (const [taskId, expected] of pending.publication?.records ?? []) {
			const current = tasks.get(taskId);
			if (current !== void 0 && isEquivalentTaskRecord(expected, current)) pending.publication?.ready.add(taskId);
		}
		return { conflicted: merged.conflicted };
	} finally {
		delete pending.readWitness;
		if (projection.readTail === phase.promise) delete projection.readTail;
		phase.resolve();
	}
}
/** Keep the original baseline registered while observers may synchronously publish other rows. */
function publishTaskRegistryWorkerMutation(params) {
	const { pending, forced, emit } = params;
	const publication = pending.publication;
	if (!publication) return;
	const { tasks } = getTaskRegistryProcessState();
	for (const [taskId, expected] of publication.records) {
		if (!publication.ready.has(taskId) || publication.invalidated.has(taskId)) continue;
		const next = tasks.get(taskId);
		if (next === void 0 || !isEquivalentTaskRecord(expected, next)) continue;
		const previous = pending.published.get(taskId);
		if (!isDeepStrictEqual(previous, cloneTaskRecordForObserver(next)) || forced?.taskId === taskId && isEquivalentTaskRecord(forced, next)) {
			emit(() => ({
				kind: "upserted",
				task: cloneTaskRecordForObserver(next),
				...previous ? { previous } : {}
			}));
			const current = tasks.get(taskId);
			if (current && !publication.invalidated.has(taskId) && isEquivalentTaskRecord(expected, current)) params.onPublished?.(current);
		}
	}
}
function inheritPublicationBaseline(pending, taskId) {
	const state = getTaskRegistryProcessState();
	for (const prior of state.projection.pending) if (prior !== pending && (prior.published.has(taskId) || prior.publication?.records.has(taskId))) {
		const previous = prior.published.get(taskId);
		pending.published.set(taskId, previous && cloneTaskRecordForObserver(previous));
		return;
	}
	const current = state.tasks.get(taskId);
	pending.published.set(taskId, current && cloneTaskRecordForObserver(current));
}
/** Receipt rows own publication; broad snapshot selection grants no readiness for sibling rows. */
function claimTaskRegistryPublication(pending, records) {
	for (const taskId of records.keys()) if (!pending.published.has(taskId)) inheritPublicationBaseline(pending, taskId);
	pending.publication = {
		records: new Map(Array.from(records, ([taskId, record]) => [taskId, cloneTaskRecord(record)])),
		ready: /* @__PURE__ */ new Set(),
		invalidated: /* @__PURE__ */ new Set()
	};
	const recovery = pending.recoveryWitness;
	for (const [taskId, record] of pending.publication.records) {
		if (recovery?.replaced || recovery?.writtenTaskIds.has(taskId)) pending.publication.invalidated.add(taskId);
		const previous = pending.published.get(taskId);
		for (const other of getTaskRegistryProcessState().projection.pending) if (other !== pending && !other.published.has(taskId) && (other.scope.taskId === taskId || matchesScope(record, other.scope) || previous && matchesScope(previous, other.scope))) other.published.set(taskId, previous && cloneTaskRecordForObserver(previous));
	}
}
function createPendingTaskRegistryMutation({ scope, admission, readIdentity, recoverPublication }, store, readEventTarget) {
	const readSettlement = readIdentity === "preserved" ? void 0 : createDeferredCore();
	const pending = {
		scope,
		readIdentity,
		...readSettlement && { readSettlement: {
			databaseKey: admission.identity.key,
			store,
			promise: readSettlement.promise
		} },
		published: new Map(Array.from(currentTasksInScope(scope), (task) => [task.taskId, cloneTaskRecordForObserver(task)]))
	};
	const baselineIds = /* @__PURE__ */ new Set([...pending.published.keys(), scope.taskId]);
	for (const prior of getTaskRegistryProcessState().projection.pending) {
		for (const [taskId, published] of prior.published) if (published && matchesScope(published, scope)) baselineIds.add(taskId);
		for (const [taskId, record] of prior.publication?.records ?? []) if (matchesScope(record, scope)) baselineIds.add(taskId);
	}
	for (const taskId of baselineIds) inheritPublicationBaseline(pending, taskId);
	if (readEventTarget) {
		const { tasks } = getTaskRegistryProcessState();
		const residentTargets = new Map([...taskIdsInScope(scope)].map((taskId) => [taskId, tasks.get(taskId)]));
		pending.readEventTarget = () => {
			const target = readEventTarget();
			return target && tasks.get(target.taskId) === residentTargets.get(target.taskId) ? target : void 0;
		};
	}
	return {
		pending,
		recovery: recoverPublication ? createTaskRegistryPublicationRecovery(pending, recoverPublication) : void 0,
		settle: readSettlement?.resolve
	};
}
//#endregion
//#region src/tasks/task-registry-state.ts
const taskRegistryLog = createSubsystemLogger("tasks/registry");
const taskRegistryProcessState = getTaskRegistryProcessState();
const TASK_REGISTRY_REVISION_KEY = Symbol.for("openclaw.taskRegistry.revision");
const taskRegistryRevisionGlobal = globalThis;
const taskRegistryRevisionState = taskRegistryRevisionGlobal[TASK_REGISTRY_REVISION_KEY] ??= { value: 0 };
function readTaskRegistryRevision() {
	return taskRegistryRevisionState.value;
}
function bumpTaskRegistryRevision(invalidateWorkerReads = true, changed = true) {
	if (changed || taskRegistryRestoreState.status !== "ready") taskRegistryRevisionState.value += 1;
	if (invalidateWorkerReads) taskRegistryProcessState.projection.epoch += 1;
}
const tasks = taskRegistryProcessState.tasks;
const taskDeliveryStates = taskRegistryProcessState.taskDeliveryStates;
const taskIdsByOwnerKey = taskRegistryProcessState.taskIdsByOwnerKey;
const taskIdsByParentFlowId = taskRegistryProcessState.taskIdsByParentFlowId;
const taskIdsByRelatedSessionKey = taskRegistryProcessState.taskIdsByRelatedSessionKey;
const tasksWithPendingDelivery = taskRegistryProcessState.tasksWithPendingDelivery;
const taskActivityByTaskId = taskRegistryProcessState.taskActivityByTaskId;
const taskProgressBatches = taskRegistryProcessState.taskProgressBatches;
let taskRegistryRestoreState = { status: "uninitialized" };
function emitTaskRegistryObserverEvent(createEvent) {
	deliverTaskRegistryObserverEvent(createEvent, recordTaskRegistryPublication);
}
function clearTaskRegistryEphemeralState() {
	clearTaskFlowSyncRetries("live");
	clearTaskProgressBatches();
	for (const activity of taskActivityByTaskId.values()) if (activity.flushTimer) clearTimeout(activity.flushTimer);
	taskActivityByTaskId.clear();
	tasksWithPendingDelivery.clear();
}
function clearTaskRegistryMemory() {
	clearTaskRegistryEphemeralState();
	clearTaskRegistryProjectionRows();
	bumpTaskRegistryRevision();
	recordTaskRegistryProjectionWrite("snapshot");
}
function isCurrentTaskRegistryDatabase(admission) {
	return openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(resolveOpenClawStateSqlitePath())?.key === admission.identity.key;
}
function getTaskRegistryRestoreState(admission) {
	let requiresRestore = taskRegistryRestoreState.admission !== void 0 && taskRegistryRestoreState.admission.identity.key !== admission.identity.key;
	if (taskRegistryRestoreState.status === "ready") try {
		taskRegistryRestoreState.admission.assertCurrent();
	} catch {
		requiresRestore = true;
	}
	if (requiresRestore) {
		taskRegistryRestoreState = {
			status: "uninitialized",
			admission
		};
		bumpTaskRegistryRevision();
	}
	return taskRegistryRestoreState;
}
/** Preserve recorded restore failures without starting storage work after admission closes. */
function assertTaskRegistryRestoreNotFailed() {
	const state = taskRegistryRestoreState;
	if (state.status !== "failed" || state.store !== getTaskRegistryStore() || !isCurrentTaskRegistryDatabase(state.admission)) return;
	throw state.error;
}
function taskFlowSyncOwner(taskId, flowStore) {
	return {
		prepare: prepareTaskRegistryProjectionAsync,
		assertCurrent(context, store) {
			assertTaskRegistryOwnerCurrent(context, store);
			if (flowStore !== void 0 && getTaskFlowRegistryStore() !== flowStore) throw new Error("Task flow registry owner is no longer current.");
		},
		selectCurrent: () => selectLiveTaskFlowForSync(taskId)
	};
}
function syncFlowFromTaskAfterTaskMutation(task, operation) {
	syncTaskFlowWithLiveRetry(task, operation, taskFlowSyncOwner(task.taskId));
}
function syncFlowFromTaskAfterTaskMutationAsync(context, store, task, operation, flowStore) {
	return syncTaskFlowWithLiveRetryAsync(context, store, task, operation, taskFlowSyncOwner(task.taskId, flowStore));
}
function restoreTaskRegistryOnce() {
	const databasePath = resolveOpenClawStateSqlitePath();
	const admission = captureOpenClawStateDatabaseReadAdmission(databasePath);
	const state = getTaskRegistryRestoreState(admission);
	if (state.status === "ready") return;
	if (state.status === "failed") throw state.error;
	if (state.status === "restoring") throw new Error("Task registry restore is already in progress.");
	const store = getTaskRegistryStore();
	const workerContext = captureOpenClawStateWorkerContext({ path: databasePath });
	const restoring = taskRegistryRestoreState = {
		status: "restoring",
		admission
	};
	const revision = readTaskRegistryRevision();
	const epoch = taskRegistryProcessState.projection.epoch;
	const ownsRestore = () => taskRegistryRestoreState === restoring && getTaskRegistryStore() === store && resolveOpenClawStateSqlitePath() === databasePath;
	const reader = createSyncRegistryReader({
		admission,
		captureAdmission: () => captureOpenClawStateDatabaseReadAdmission(databasePath),
		isCurrent: () => ownsRestore() && readTaskRegistryRevision() === revision && taskRegistryProcessState.projection.epoch === epoch,
		isCurrentDatabase: isCurrentTaskRegistryDatabase,
		loadSnapshot: () => store.loadSnapshot(),
		changedMessage: "Task registry restore changed before publication."
	});
	let installing = false;
	let restoreResult;
	try {
		restoreResult = restoreTaskExecutionSnapshot(store, reader.loadSnapshot);
		reader.assertCurrent();
		const { snapshot: restored, settledTasks } = restoreResult;
		installing = true;
		if (state.admission) bumpTaskRegistryRevision();
		else clearTaskRegistryMemory();
		installRestoredTaskRegistrySnapshot(restored);
		taskRegistryRestoreState = {
			status: "ready",
			admission: reader.admission
		};
		const installed = taskRegistryRestoreState;
		const database = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(databasePath);
		if (database?.db.isTransaction) stageSqliteTransactionState(database.db, {
			stage() {},
			commit() {},
			rollback() {
				if (taskRegistryRestoreState === installed) {
					taskRegistryRestoreState = {
						status: "uninitialized",
						admission: reader.admission
					};
					projection.dirty = true;
					bumpTaskRegistryRevision();
				}
			}
		});
		markTaskRegistryProjectionRestored();
		for (const task of settledTasks) {
			const flowId = task.parentFlowId?.trim();
			if (flowId && listTasksFromIndex(tasks, taskIdsByParentFlowId, flowId)[0]?.taskId === task.taskId) syncFlowFromTaskAfterTaskMutation(task, "restore");
		}
		if (restored.tasks.size > 0 || restored.deliveryStates.size > 0) emitTaskRegistryObserverEvent(() => ({ kind: "restored" }));
	} catch (error) {
		try {
			if (!installing && (reader.invalidated || !ownsRestore())) {
				if (taskRegistryRestoreState === restoring) taskRegistryRestoreState = state;
				throw error;
			}
			failTaskRegistryRestore(error, reader.admission, Boolean(state.admission));
		} finally {
			if (restoreResult) retainTaskRegistryRestoreFlowObligations({
				...workerContext,
				admission: reader.admission
			}, store, restoreResult.settledTasks);
		}
	}
}
function ensureTaskRegistryReady(options) {
	restoreTaskRegistryOnce();
	startTaskRegistryListener();
	if (options?.refreshProjection !== false) refreshTaskRegistryProjection();
}
const ensureTaskRegistryReadyAsync = createAsyncRegistryRestore({
	isCurrentDatabase: isCurrentTaskRegistryDatabase,
	getState: getTaskRegistryRestoreState,
	getRevision: readTaskRegistryRevision,
	getStore: getTaskRegistryStore,
	onReady: () => startTaskRegistryListener(),
	received: (result, context, store) => receiveTaskRegistryRestoreResult(result, context, store),
	async reconcile(_result, context, store, reconcileFlows) {
		if (getTaskRegistryStore() !== store || !isCurrentTaskRegistryDatabase(context.admission)) return;
		try {
			await reconcileFlows();
		} catch (error) {
			if (taskRegistryRestoreState.status !== "failed") throw error;
			taskRegistryLog.warn("Failed to reconcile parent flows after task restore failure", { error });
		}
	},
	install(result, context) {
		const { admission } = context;
		const restored = result.snapshot;
		installRestoredTaskRegistrySnapshot(restored);
		bumpTaskRegistryRevision();
		taskRegistryRestoreState = {
			status: "ready",
			admission
		};
		markTaskRegistryProjectionRestored();
		const installed = taskRegistryRestoreState;
		const revision = readTaskRegistryRevision();
		const store = getTaskRegistryStore();
		const isCurrent = () => isCurrentTaskRegistryDatabase(admission) && taskRegistryRestoreState === installed && readTaskRegistryRevision() === revision && getTaskRegistryStore() === store;
		return async (reconcile) => {
			try {
				await reconcile();
			} catch (error) {
				try {
					admission.assertCurrent();
				} catch {
					throw error;
				}
				if (isCurrent()) failTaskRegistryRestore(error, admission);
				throw error;
			}
			admission.assertCurrent();
			if (isCurrent() && (restored.tasks.size > 0 || restored.deliveryStates.size > 0)) emitTaskRegistryObserverEvent(() => ({ kind: "restored" }));
		};
	},
	fail: failTaskRegistryRestore
});
function assertTaskRegistryOwnerCurrent(context, store) {
	context.admission.assertCurrent();
	if (getTaskRegistryStore() !== store || !isCurrentTaskRegistryDatabase(context.admission)) throw new Error("Task registry read owner is no longer current.");
}
const prepareTaskRegistryProjectionAsync = createTaskRegistryProjectionPreparation({
	ensureReady: ensureTaskRegistryReadyAsync,
	assertCurrent: assertTaskRegistryOwnerCurrent,
	installSnapshot,
	markRestored: markTaskRegistryProjectionRestored
});
function failTaskRegistryRestore(error, admission, preserveLiveOwners = true) {
	if (preserveLiveOwners) {
		installRestoredTaskRegistrySnapshot({
			tasks: /* @__PURE__ */ new Map(),
			deliveryStates: /* @__PURE__ */ new Map()
		});
		bumpTaskRegistryRevision();
	} else clearTaskRegistryMemory();
	const message = formatErrorMessage(error);
	const restoreError = new Error(`Task registry restore failed: ${message}`, { cause: error });
	taskRegistryRestoreState = {
		status: "failed",
		error: restoreError,
		admission,
		store: getTaskRegistryStore()
	};
	taskRegistryLog.warn("Failed to restore task registry", {
		error: message,
		consoleMessage: `Failed to restore task registry: ${message}`
	});
	throw restoreError;
}
async function reloadTaskRegistryFromStoreAsync(context) {
	context.admission.assertCurrent();
	if (!isCurrentTaskRegistryDatabase(context.admission)) return;
	clearTaskRegistryEphemeralState();
	bumpTaskRegistryRevision();
	taskRegistryRestoreState = {
		status: "uninitialized",
		admission: context.admission
	};
	await ensureTaskRegistryReadyAsync(context);
}
function resetTaskRegistryRestoreState() {
	taskRegistryRestoreState = { status: "uninitialized" };
}
const projection = taskRegistryProcessState.projection;
const { pending: pendingMutations, dirtyScopes } = projection;
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind === "opened") return;
	const admission = taskRegistryRestoreState.admission;
	if (admission && (event.path === admission.databasePath || event.identity?.key === admission.identity.key)) invalidateTaskRegistryProjection();
});
function invalidateTaskRegistryProjection() {
	projection.dirty = true;
	bumpTaskRegistryRevision();
}
function markTaskRegistryProjectionRestored() {
	projection.dirty = false;
	dirtyScopes.clear();
	for (const pending of pendingMutations) dirtyScopes.add(pending.scope);
}
function installSnapshot(snapshot, scope, invalidateWorkerReads = true, recordWrites = "refresh") {
	const scopes = scope && ("taskId" in scope ? [scope] : scope);
	const { matches, taskIds } = selectTaskRegistryScopes(scopes);
	let changed = false;
	for (const taskId of taskIds) {
		const current = tasks.get(taskId);
		if (current && matches(current) && !snapshot.tasks.has(taskId)) {
			if (recordWrites) recordTaskRegistryProjectionWrite(recordWrites, taskId, true);
			removeTaskIndexes(current);
			changed = tasks.delete(taskId) || changed;
			taskDeliveryStates.delete(taskId);
		}
	}
	for (const [taskId, record] of snapshot.tasks) {
		if (!matches(record)) continue;
		const current = tasks.get(taskId);
		const next = normalizeTaskTimestamps(record);
		if (!current || !isEquivalentTaskRecord(current, next)) {
			changed = true;
			tasks.set(taskId, next);
			if (recordWrites) recordTaskRegistryProjectionWrite(recordWrites, taskId);
			if (!current) addTaskIndexes(next);
			else updateTaskIndexes(current, next);
		} else if (recordWrites && recordWrites !== "refresh" && recordWrites.has(taskId)) recordTaskRegistryProjectionWrite(recordWrites, taskId);
		const delivery = snapshot.deliveryStates.get(taskId);
		const deliveryChanged = !isDeepStrictEqual(taskDeliveryStates.get(taskId), delivery);
		changed ||= deliveryChanged;
		if (recordWrites && deliveryChanged) recordTaskRegistryProjectionWrite("delivery", taskId);
		if (delivery) taskDeliveryStates.set(taskId, delivery);
		else taskDeliveryStates.delete(taskId);
	}
	if (!scope) {
		for (const taskId of taskDeliveryStates.keys()) if (!snapshot.deliveryStates.has(taskId)) changed = taskDeliveryStates.delete(taskId) || changed;
		for (const [taskId, delivery] of snapshot.deliveryStates) {
			changed ||= !isDeepStrictEqual(taskDeliveryStates.get(taskId), delivery);
			taskDeliveryStates.set(taskId, delivery);
		}
	}
	if (recordWrites && !scope) recordTaskRegistryProjectionWrite(recordWrites);
	bumpTaskRegistryRevision(invalidateWorkerReads, changed);
}
function refreshUnderCustody() {
	const refresh = projection.dirty || dirtyScopes.size > 0;
	const database = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(resolveOpenClawStateSqlitePath());
	if (!refresh && !database?.db.isTransaction) return;
	const store = getTaskRegistryStore();
	const scopes = projection.dirty || !store.loadMutationSnapshot ? void 0 : [...new Map([...dirtyScopes].map((scope) => [JSON.stringify([
		scope.taskId,
		scope.runId,
		scope.childSessionKey
	]), scope])).values()];
	const snapshot = refresh && (scopes ? store.loadMutationSnapshot(scopes) : store.loadSnapshot());
	const previous = database?.db.isTransaction ? {
		tasks: new Map(tasks),
		deliveryStates: new Map(taskDeliveryStates),
		restorePublication: captureTaskRegistryPublicationRollback()
	} : void 0;
	const publication = {
		stage() {
			if (snapshot) {
				installSnapshot(snapshot, scopes, true, false);
				markTaskRegistryProjectionRestored();
			}
		},
		rollback() {
			if (previous) {
				installRestoredTaskRegistrySnapshot(previous, false);
				previous.restorePublication();
			}
			projection.dirty = true;
			bumpTaskRegistryRevision();
		},
		commit() {
			if (refresh) {
				recordTaskRegistryProjectionWrite("refresh");
				bumpTaskRegistryRevision();
			}
		}
	};
	if (!database || !stageSqliteTransactionState(database.db, publication)) {
		publication.stage();
		if (refresh) recordTaskRegistryProjectionWrite("refresh");
	}
}
/** Keep canonical peer selection and all synchronous writes in one coordinator admission. */
function withTaskRegistryMutation(operation, onAdmissionFailure) {
	if (projection.mutationDepth > 0) return operation();
	ensureTaskRegistryReady({ refreshProjection: false });
	let entered = false;
	const admitted = () => {
		entered = true;
		projection.mutationDepth += 1;
		try {
			return withPendingTaskRegistryEvents(refreshUnderCustody, operation);
		} finally {
			projection.mutationDepth -= 1;
		}
	};
	const store = getTaskRegistryStore();
	try {
		return store.withMutation ? store.withMutation(admitted) : admitted();
	} catch (error) {
		if (entered || !onAdmissionFailure) throw error;
		taskRegistryLog.warn("Failed to admit task registry mutation", { error });
		return onAdmissionFailure(error);
	}
}
function refreshTaskRegistryProjection() {
	if (projection.mutationDepth === 0 && (projection.dirty || dirtyScopes.size > 0 || hasPendingTaskRegistryEvents())) withTaskRegistryMutation(() => {});
}
async function runTaskRegistryWorkerMutation(context, mutate, readCurrent) {
	const { scope, admission, readEventTarget } = context;
	const store = getTaskRegistryStore();
	admission.assertCurrent();
	const { pending, recovery, settle } = createPendingTaskRegistryMutation(context, store, readEventTarget ? () => {
		admission.assertCurrent();
		if (getTaskRegistryStore() !== store || !isCurrentTaskRegistryDatabase(admission)) return;
		return readEventTarget();
	} : void 0);
	pendingMutations.add(pending);
	const assertOwner = () => {
		admission.assertCurrent();
		if (!isCurrentTaskRegistryDatabase(admission) || getTaskRegistryStore() !== store) {
			projection.dirty = true;
			throw new Error("Task registry publication owner is no longer current.");
		}
		recovery?.assertCurrent();
	};
	try {
		if (context.prepare) {
			await context.prepare();
			assertOwner();
		}
		dirtyScopes.add(scope);
		bumpTaskRegistryRevision(true, pending.readIdentity !== "preserved");
		return await mutate(() => recovery?.begin());
	} finally {
		dirtyScopes.add(scope);
		bumpTaskRegistryRevision(true, pending.readIdentity !== "preserved");
		try {
			claimTaskRegistryPublication(pending, context.publicationRecords());
			const { conflicted } = await reconcileTaskRegistryWorkerSnapshot({
				pending,
				assertCurrent: assertOwner,
				read: readCurrent,
				install: (current, records) => installSnapshot(current, scope, false, records),
				recoverPublication: recovery?.recover,
				taskRowsWritten: context.taskRowsWritten?.()
			});
			assertOwner();
			await context.beforeObservers?.(assertOwner);
			assertOwner();
			publishTaskRegistryWorkerMutation({
				pending,
				forced: context.forcePublish?.(),
				emit: emitTaskRegistryObserverEvent,
				onPublished: context.onPublished
			});
			if (!conflicted) dirtyScopes.delete(scope);
		} catch (error) {
			bumpTaskRegistryRevision(false);
			if (!recovery?.isSuperseded(error)) {
				context.onPublicationError?.(error);
				taskRegistryLog.warn("Failed to reconcile managed child task after worker operation", {
					flowId: scope.flowId,
					error
				});
			}
		} finally {
			pendingMutations.delete(pending);
			settle?.();
		}
	}
}
//#endregion
export { listPendingTaskRegistryEventTaskIds as A, taskRegistryLog as C, captureTaskRegistryReadFence as D, withTaskRegistryMutation as E, retainCommittedTaskFlowEffects as F, setTaskRegistryListenerStarter as M, setTaskRegistryListenerStop as N, claimTaskRegistryListenerStart as O, clearTaskFlowSyncRetries as P, taskProgressBatches as S, tasksWithPendingDelivery as T, taskDeliveryStates as _, emitTaskRegistryObserverEvent as a, taskIdsByParentFlowId as b, invalidateTaskRegistryProjection as c, reloadTaskRegistryFromStoreAsync as d, resetTaskRegistryRestoreState as f, taskActivityByTaskId as g, syncFlowFromTaskAfterTaskMutationAsync as h, clearTaskRegistryMemory as i, resetTaskRegistryListenerState as j, hasPendingTaskRegistryEvents as k, prepareTaskRegistryProjectionAsync as l, syncFlowFromTaskAfterTaskMutation as m, assertTaskRegistryRestoreNotFailed as n, ensureTaskRegistryReady as o, runTaskRegistryWorkerMutation as p, bumpTaskRegistryRevision as r, ensureTaskRegistryReadyAsync as s, assertTaskRegistryOwnerCurrent as t, readTaskRegistryRevision as u, taskFlowSyncOwner as v, tasks as w, taskIdsByRelatedSessionKey as x, taskIdsByOwnerKey as y };
