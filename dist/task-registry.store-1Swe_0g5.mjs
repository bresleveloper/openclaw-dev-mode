import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { f as getTaskRegistryProcessState } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { a as loadTaskRegistryMutationStateFromSqlite, d as upsertTaskWithDeliveryStateToSqlite, f as withTaskRegistrySqliteMutation, l as settleTaskRegistrySqliteWrites, n as closeTaskRegistryDatabase, o as loadTaskRegistryStateFromSqlite, r as deleteTaskAndDeliveryStateFromSqlite, u as upsertTaskDeliveryStateToSqlite } from "./task-registry.store.sqlite-nRmuK0pg.mjs";
//#region src/tasks/task-registry.store.ts
const defaultTaskRegistryStore = {
	async runAgentEventMutationAsync(context, input, assertCurrent, onGranted) {
		const { runTaskRegistryWorkerOperation } = await import("./task-registry-worker-operation-DZYDPUQk.mjs");
		return runTaskRegistryWorkerOperation(context, {
			type: "tasks.observeAgentEvent",
			input
		}, assertCurrent, onGranted);
	},
	settleAgentEventWrites: settleTaskRegistrySqliteWrites,
	async runInitialMutationAsync(context, command, assertCurrent, onGranted) {
		const { runTaskRegistryWorkerOperation } = await import("./task-registry-worker-operation-DZYDPUQk.mjs");
		return runTaskRegistryWorkerOperation(context, command, assertCurrent, onGranted);
	},
	async syncLiveTaskFlowAsync(context, params, authority) {
		const { syncLiveTaskFlowWithWorker } = await import("./task-registry-live-flow-sync-CcdJUwwR.mjs");
		return syncLiveTaskFlowWithWorker(context, params, authority);
	},
	async withSnapshotAsync(context, consume) {
		const { runTaskFlowRestoreWorkerOperation } = await import("./task-flow-restore-store-BYi-RGLI.mjs");
		return runTaskFlowRestoreWorkerOperation(context, {
			type: "tasks.restore",
			input: void 0
		}, consume);
	},
	async syncTaskFlowAsync(context, params) {
		const { runTaskFlowRestoreWorkerOperation } = await import("./task-flow-restore-store-BYi-RGLI.mjs");
		return runTaskFlowRestoreWorkerOperation(context, {
			type: "flows.syncMirroredTask",
			input: params
		}, async (result, reconcileFlows) => {
			await reconcileFlows();
			return result;
		});
	},
	loadSnapshot: loadTaskRegistryStateFromSqlite,
	async loadMutationSnapshotAsync(context, scope) {
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "tasks.mutationSnapshot",
			input: scope
		}, { context });
		if (!reply) throw new Error("Task registry snapshot requires an admitted database");
		if (!reply.ok || reply.type !== "tasks.mutationSnapshot") throw new Error("Unexpected task registry snapshot result");
		return reply.snapshot;
	},
	loadMutationSnapshot: loadTaskRegistryMutationStateFromSqlite,
	withMutation: withTaskRegistrySqliteMutation,
	async listTasksForOwnerKey(context, ownerKey, assertCurrent) {
		const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
		assertCurrent();
		const records = await executeOpenClawStateWorker(context, {
			type: "tasks.ownerRecords",
			input: { ownerKey }
		});
		assertCurrent();
		return records;
	},
	upsertTaskWithDeliveryState: upsertTaskWithDeliveryStateToSqlite,
	deleteTaskWithDeliveryState: deleteTaskAndDeliveryStateFromSqlite,
	upsertDeliveryState: upsertTaskDeliveryStateToSqlite,
	close: closeTaskRegistryDatabase
};
let configuredTaskRegistryStore = defaultTaskRegistryStore;
function getTaskRegistryStore() {
	return configuredTaskRegistryStore;
}
function getTaskRegistryObservers() {
	return getTaskRegistryProcessState().observers;
}
/** Subscribe at the publication owner; readers recheck current task authority. */
function onTaskRegistryChange(listener) {
	const listeners = getTaskRegistryProcessState().changeListeners;
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function configureTaskRegistryRuntime(params) {
	if (params.store) configuredTaskRegistryStore = params.store;
	if ("observers" in params) getTaskRegistryProcessState().observers = params.observers ?? null;
}
function resetTaskRegistryRuntimeForTests() {
	configuredTaskRegistryStore.close?.();
	configuredTaskRegistryStore = defaultTaskRegistryStore;
	getTaskRegistryProcessState().observers = null;
}
const storeLog = createSubsystemLogger("tasks/registry");
function deliverTaskRegistryObserverEvent(createEvent, recordPublication) {
	const observers = getTaskRegistryObservers();
	const state = getTaskRegistryProcessState();
	if (!observers?.onEvent && state.projection.pending.size === 0 && state.changeListeners.size === 0) return;
	let event;
	try {
		event = createEvent();
		recordPublication(event);
		observers?.onEvent?.(event);
	} catch (error) {
		storeLog.warn("Task registry observer failed", {
			event: "task-registry",
			error
		});
	} finally {
		for (const listener of state.changeListeners) try {
			listener(event);
		} catch (error) {
			storeLog.warn("Task registry change listener failed", { error });
		}
	}
}
function tryPersistTaskUpsert(task, operation, pendingDeliveryState) {
	try {
		const deliveryState = pendingDeliveryState ?? getTaskRegistryProcessState().taskDeliveryStates.get(task.taskId);
		getTaskRegistryStore().upsertTaskWithDeliveryState({
			task,
			...deliveryState ? { deliveryState } : {}
		});
		return true;
	} catch (error) {
		storeLog.warn("Failed to persist task registry upsert", {
			operation,
			taskId: task.taskId,
			runId: task.runId,
			error
		});
		return false;
	}
}
function tryPersistTaskDelete(taskId) {
	try {
		getTaskRegistryStore().deleteTaskWithDeliveryState(taskId);
		return true;
	} catch (error) {
		storeLog.warn("Failed to persist task registry delete", {
			taskId,
			error
		});
		return false;
	}
}
function tryPersistTaskDeliveryStateUpsert(state) {
	try {
		getTaskRegistryStore().upsertDeliveryState(state);
		return true;
	} catch (error) {
		storeLog.warn("Failed to persist task delivery state", {
			taskId: state.taskId,
			error
		});
		return false;
	}
}
//#endregion
export { onTaskRegistryChange as a, tryPersistTaskDeliveryStateUpsert as c, getTaskRegistryStore as i, tryPersistTaskUpsert as l, deliverTaskRegistryObserverEvent as n, resetTaskRegistryRuntimeForTests as o, getTaskRegistryObservers as r, tryPersistTaskDelete as s, configureTaskRegistryRuntime as t };
