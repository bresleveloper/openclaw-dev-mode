import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { _ as upsertDeliveryQueueEntryInDatabase, a as deleteDeliveryQueueEntryInDatabase, l as getDeliveryQueueEntryOwnersInDatabase, t as completeDeliveryQueueEntryInDatabase } from "./delivery-queue-sqlite.kernel-C5HZlUKw.mjs";
//#region src/infra/delivery-queue-sqlite-namespace.kernel.ts
/** Atomically publishes one staged owner only when retired namespaces do not own its id. */
function commitStagedDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, params) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		const queueDb = getNodeSqliteKysely(database.db);
		if (!loadPendingDeliveryQueueRow(database, params.stagingQueueName, params.stagingId)) return "missing";
		if (!insertDeliveryQueueOwner(database, params)) return "existing";
		if (executeSqliteQuerySync(database.db, queueDb.deleteFrom("delivery_queue_entries").where("queue_name", "=", params.stagingQueueName).where("id", "=", params.stagingId).where("status", "=", "pending")).numAffectedRows !== 1n) throw new Error(`Delivery queue staging row changed during commit: ${params.stagingQueueName}/${params.stagingId}`);
		return "created";
	}, {
		databaseLabel: database.path,
		operationLabel: "commit staged stable delivery queue owner"
	});
}
/** The caller holds the write transaction across admission and publication. */
function insertDeliveryQueueOwner(database, params) {
	return getDeliveryQueueEntryOwnersInDatabase(database, [params.queueName, ...params.conflictQueueNames], params.entry.id).size === 0 && upsertDeliveryQueueEntryInDatabase({
		queueName: params.queueName,
		entry: params.entry,
		insertOnly: true
	}, database);
}
/** Inserts one stable owner only when no current or retired namespace owns its id. */
function upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, params) {
	return runSqliteImmediateTransactionSync(database.db, () => insertDeliveryQueueOwner(database, params), {
		databaseLabel: database.path,
		operationLabel: "insert stable delivery queue owner"
	});
}
function loadPendingDeliveryQueueRow(database, queueName, id) {
	return executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("delivery_queue_entries").select("entry_json").where("queue_name", "=", queueName).where("id", "=", id).where("status", "=", "pending"));
}
function matchesPendingDeliveryQueueEntry(database, queueName, expectedEntry) {
	return loadPendingDeliveryQueueRow(database, queueName, expectedEntry.id)?.entry_json === JSON.stringify(expectedEntry);
}
function pendingEntryMutation(operationLabel, mutation, validate) {
	return (database, params) => {
		validate?.(params);
		return runSqliteImmediateTransactionSync(database.db, () => matchesPendingDeliveryQueueEntry(database, params.queueName, params.expectedEntry) && mutation(database, params), {
			databaseLabel: database.path,
			operationLabel
		});
	};
}
function assertDeliveryQueueReplacement(params) {
	if (params.expectedEntry.id !== params.replacementEntry.id) throw new Error(`Delivery queue replacement id mismatch: ${params.expectedEntry.id} != ${params.replacementEntry.id}`);
}
/** Replaces a pending entry only while its authoritative serialized value is unchanged. */
const replacePendingDeliveryQueueEntryInDatabase = pendingEntryMutation("replace pending delivery queue entry", (database, params) => upsertDeliveryQueueEntryInDatabase({
	queueName: params.queueName,
	entry: params.replacementEntry,
	updatePendingOnly: true
}, database), assertDeliveryQueueReplacement);
/** Completes a pending entry only while its authoritative serialized value is unchanged. */
const completePendingDeliveryQueueEntryInDatabase = pendingEntryMutation("complete pending delivery queue entry", (database, params) => {
	completeDeliveryQueueEntryInDatabase(database, params.queueName, params.expectedEntry.id);
	return true;
});
/**
* Commits an asynchronously prepared replacement only if the authoritative
* source row is unchanged, then removes or terminally fences the old owner.
*/
function movePendingDeliveryQueueEntryNamespaceInDatabase(database, params) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		if (!matchesPendingDeliveryQueueEntry(database, params.sourceQueueName, params.expectedSourceEntry)) return "source-changed";
		if (getDeliveryQueueEntryOwnersInDatabase(database, [params.destinationQueueName, ...params.conflictQueueNames ?? []], params.destinationEntry.id).size > 0) return "destination-exists";
		if (params.stagingId && params.stagingQueueName) {
			if (!loadPendingDeliveryQueueRow(database, params.stagingQueueName, params.stagingId)) return "staging-missing";
		}
		if (!upsertDeliveryQueueEntryInDatabase({
			queueName: params.destinationQueueName,
			entry: params.destinationEntry,
			insertOnly: true
		}, database)) return "destination-exists";
		(params.retainSourceCompletionFence ? completeDeliveryQueueEntryInDatabase : deleteDeliveryQueueEntryInDatabase)(database, params.sourceQueueName, params.expectedSourceEntry.id);
		if (params.stagingId && params.stagingQueueName) deleteDeliveryQueueEntryInDatabase(database, params.stagingQueueName, params.stagingId);
		return "moved";
	}, {
		databaseLabel: database.path,
		operationLabel: "migrate delivery queue namespace"
	});
}
//#endregion
export { replacePendingDeliveryQueueEntryInDatabase as a, movePendingDeliveryQueueEntryNamespaceInDatabase as i, commitStagedDeliveryQueueEntryOnceAcrossNamespacesInDatabase as n, upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase as o, completePendingDeliveryQueueEntryInDatabase as r, assertDeliveryQueueReplacement as t };
