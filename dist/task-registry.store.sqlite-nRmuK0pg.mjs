import { n as readSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { a as closeOpenClawStateDatabase } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { I as withSharedStateWriteCoordinator, c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as executionOwnerBindingFromAdmission } from "./execution-owner-binding-C2u1SaeA.mjs";
import { _ as upsertTaskDeliveryStateInDatabase, c as listTaskRecordsByRuntimeSourceIdInDatabase, f as readTaskRegistryMutationSnapshotInDatabase, m as readTaskRegistrySnapshotIfReady, p as readTaskRegistrySnapshot, r as deleteTaskRowsWithDeliveryState, y as upsertTaskWithDeliveryStateInDatabase } from "./task-registry.store.kernel-BuNI8UuR.mjs";
//#region src/tasks/task-registry.store.sqlite.ts
let cachedDatabase = null;
function openTaskRegistryDatabase() {
	const database = openOpenClawStateDatabase();
	const pathname = database.path;
	if (cachedDatabase && cachedDatabase.path === pathname && cachedDatabase.db.isOpen) return cachedDatabase;
	if (cachedDatabase && !cachedDatabase.db.isOpen) cachedDatabase = null;
	cachedDatabase = {
		db: database.db,
		path: pathname
	};
	return cachedDatabase;
}
function withWriteTransaction(write) {
	openTaskRegistryDatabase();
	runOpenClawStateWriteTransaction((database) => write(database));
}
function loadTaskRegistryStateFromSqlite() {
	return readTaskRegistrySnapshot(openTaskRegistryDatabase());
}
function withTaskRegistrySqliteMutation(operation) {
	const database = openTaskRegistryDatabase();
	return withSharedStateWriteCoordinator({
		databasePath: database.path,
		existing: database.db,
		operationLabel: "task.mutation"
	}, operation);
}
/** A native compatibility caller joins already-granted worker writes before selecting rows. */
function settleTaskRegistrySqliteWrites(join) {
	const deadlineMs = performance.now() + readSqliteBusyTimeout(openTaskRegistryDatabase().db);
	runOpenClawStateWriteTransaction(() => {}, void 0, { operationLabel: "task.event.settle" });
	join(deadlineMs);
}
function loadTaskRegistryMutationStateFromSqlite(scopes) {
	return readTaskRegistryMutationSnapshotInDatabase(openTaskRegistryDatabase().db, scopes);
}
/** Loads task records without creating or migrating shared state. */
function loadTaskRegistryStateFromSqliteReadOnly() {
	return loadTaskRegistryStateFromSqliteReadOnlyResult().snapshot;
}
/** Reads task state only when the existing database already has the canonical task shape. */
function loadTaskRegistryStateFromSqliteReadOnlyResult() {
	return withExistingOpenClawStateDatabaseReadOnly(readTaskRegistrySnapshotIfReady) ?? {
		state: "ready",
		snapshot: {
			tasks: /* @__PURE__ */ new Map(),
			deliveryStates: /* @__PURE__ */ new Map()
		}
	};
}
/** Reads task rows for one runtime/source without restoring the process registry snapshot. */
function listTaskRegistryRecordsByRuntimeSourceIdFromSqlite(params) {
	const sourceId = params.sourceId?.trim();
	if (params.sourceId !== void 0 && !sourceId) return [];
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => listTaskRecordsByRuntimeSourceIdInDatabase(db, params.runtime, sourceId)) ?? [];
}
/** Binds only the exact task row selected before admission; runId is never a join key. */
async function bindTaskRunExecution(params) {
	const binding = executionOwnerBindingFromAdmission(params.admitted);
	if (!binding) return "disabled";
	const context = params.context ?? captureOpenClawStateWorkerContext(params.options);
	const input = {
		taskId: params.taskId,
		binding
	};
	const assertOwnerCurrent = params.assertCurrent;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertOwnerCurrent?.();
	};
	const [{ runOpenClawStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./openclaw-state-worker-store-BgU7tLf5.mjs"), import("./sqlite-worker-store-ID7IGMTW.mjs")]);
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "tasks.bindExecution",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
function upsertTaskWithDeliveryStateToSqlite(params) {
	withWriteTransaction((database) => upsertTaskWithDeliveryStateInDatabase(database, params));
}
function deleteTaskAndDeliveryStateFromSqlite(taskId) {
	withWriteTransaction(({ db }) => {
		deleteTaskRowsWithDeliveryState(db, taskId);
	});
}
function upsertTaskDeliveryStateToSqlite(state) {
	withWriteTransaction(({ db }) => upsertTaskDeliveryStateInDatabase(db, state));
}
function closeTaskRegistryDatabase() {
	cachedDatabase = null;
	closeOpenClawStateDatabase();
}
//#endregion
export { loadTaskRegistryMutationStateFromSqlite as a, loadTaskRegistryStateFromSqliteReadOnlyResult as c, upsertTaskWithDeliveryStateToSqlite as d, withTaskRegistrySqliteMutation as f, listTaskRegistryRecordsByRuntimeSourceIdFromSqlite as i, settleTaskRegistrySqliteWrites as l, closeTaskRegistryDatabase as n, loadTaskRegistryStateFromSqlite as o, deleteTaskAndDeliveryStateFromSqlite as r, loadTaskRegistryStateFromSqliteReadOnly as s, bindTaskRunExecution as t, upsertTaskDeliveryStateToSqlite as u };
