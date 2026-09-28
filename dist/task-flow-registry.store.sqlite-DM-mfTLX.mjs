import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { a as closeOpenClawStateDatabase } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as executionOwnerBindingFromAdmission } from "./execution-owner-binding-C2u1SaeA.mjs";
import { _t as updateTaskFlowRecordInDatabase, ct as bindTaskFlowRecord, ht as syncTaskMirroredFlowRecordInDatabase, lt as deleteTaskFlowRowInDatabase, pt as readTaskFlowRegistrySnapshot, vt as upsertTaskFlowRowInDatabase } from "./task-registry.store.kernel-BuNI8UuR.mjs";
//#region src/tasks/task-flow-registry.store.sqlite.ts
const log = createSubsystemLogger("tasks/task-flow-registry");
let cachedDatabase = null;
function openFlowRegistryDatabase() {
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
	const database = openFlowRegistryDatabase();
	runOpenClawStateWriteTransaction(() => {
		write(database);
	});
}
function loadTaskFlowRegistryStateFromSqlite(flowIds) {
	return readTaskFlowRegistrySnapshot(openFlowRegistryDatabase().db, flowIds);
}
/** Loads task flows without creating or migrating shared state. */
function loadTaskFlowRegistryStateFromSqliteReadOnly() {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readTaskFlowRegistrySnapshot(db)) ?? { flows: /* @__PURE__ */ new Map() };
}
function upsertTaskFlowRegistryRecordToSqlite(flow) {
	withWriteTransaction(({ db }) => {
		upsertTaskFlowRowInDatabase(db, bindTaskFlowRecord(flow));
	});
}
function syncTaskMirroredFlowInSqlite(task, preparePublication) {
	let committed;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const result = syncTaskMirroredFlowRecordInDatabase(db, task);
			const publication = preparePublication(result);
			stageSqliteTransactionState(db, {
				stage: publication.stage,
				rollback: publication.rollback,
				commit: () => {
					committed = result;
					publication.commit();
				}
			});
			return result;
		});
	} catch (error) {
		if (!committed) throw error;
		log.warn("Task-mirrored flow committed before cleanup failed", {
			taskId: task.taskId,
			flowId: task.parentFlowId,
			error
		});
		return committed;
	}
}
function updateTaskFlowRegistryRecordInSqlite(params, preparePublication) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const result = updateTaskFlowRecordInDatabase(db, params);
		if (result.applied || result.reason !== "invalid_patch") {
			const publication = preparePublication(result);
			stageSqliteTransactionState(db, {
				stage: publication.stage,
				rollback: publication.rollback,
				commit: publication.commit
			});
		}
		return result;
	});
}
/** Binds only the exact flow selected before admission; lifecycle settlement stays owner-native. */
async function bindTaskFlowExecution(params) {
	const binding = executionOwnerBindingFromAdmission(params.admitted);
	if (!binding) return "disabled";
	const context = params.context ?? captureOpenClawStateWorkerContext(params.options);
	const input = {
		flowId: params.flowId,
		binding
	};
	const assertOwnerCurrent = params.assertCurrent;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertOwnerCurrent?.();
	};
	const [{ runOpenClawStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./openclaw-state-worker-store-BgU7tLf5.mjs"), import("./sqlite-worker-store-ID7IGMTW.mjs")]);
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "flows.bindExecution",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
function deleteTaskFlowRegistryRecordFromSqlite(flowId) {
	withWriteTransaction(({ db }) => deleteTaskFlowRowInDatabase(db, flowId));
}
function closeTaskFlowRegistryDatabase() {
	cachedDatabase = null;
	closeOpenClawStateDatabase();
}
//#endregion
export { loadTaskFlowRegistryStateFromSqliteReadOnly as a, upsertTaskFlowRegistryRecordToSqlite as c, loadTaskFlowRegistryStateFromSqlite as i, closeTaskFlowRegistryDatabase as n, syncTaskMirroredFlowInSqlite as o, deleteTaskFlowRegistryRecordFromSqlite as r, updateTaskFlowRegistryRecordInSqlite as s, bindTaskFlowExecution as t };
