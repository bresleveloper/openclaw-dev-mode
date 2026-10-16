import { u as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { b as loadDeliveryQueueEntryInDatabase } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { d as prepareDeliveryQueueTerminalEntry, i as countPendingDeliveryQueueEntriesInDatabase, l as getDeliveryQueueEntryOwnersInDatabase, m as terminalizePendingDeliveryQueueEntryInDatabase, u as loadDeliveryQueueEntriesInDatabase } from "./delivery-queue-sqlite.kernel-NKJp0qk2.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
//#region src/infra/delivery-queue-worker-store.ts
async function executeDeliveryQueueOperation(context, stateDir, command, options) {
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	return await runOpenClawStateWorkerOperation(captured.workerContext, (scope) => scope.execute(command), options);
}
//#endregion
//#region src/infra/delivery-queue-sqlite.ts
function openStateDatabase(stateDir, context) {
	return openOpenClawStateDatabase({ env: resolveDeliveryQueueStateEnv(stateDir, context) });
}
/** Load a single pending delivery queue entry. */
function loadDeliveryQueueEntry(queueName, id, stateDir, mode = "pending", context) {
	return loadDeliveryQueueEntryInDatabase(openStateDatabase(stateDir, context), queueName, id, mode);
}
/** Read row status without hiding dead-lettered entries. */
function getDeliveryQueueEntryStatus(queueName, id, stateDir) {
	return getDeliveryQueueEntryOwnersInDatabase(openStateDatabase(stateDir), [queueName], id).get(queueName)?.status;
}
/** Load all pending entries for a queue namespace in database order. */
function loadDeliveryQueueEntries(queueName, stateDir, mode = "pending", context) {
	return loadDeliveryQueueEntriesInDatabase(openStateDatabase(stateDir, context), queueName, mode);
}
/** Count dead-lettered entries per queue namespace for coarse health reporting. */
async function countFailedDeliveryQueueEntries(stateDir, context) {
	return executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.countFailed",
		input: void 0
	});
}
/** Count pending entries across an exact set of queue namespaces. */
function countPendingDeliveryQueueEntries(queueNames, stateDir, context) {
	if (queueNames.length === 0) return 0;
	return countPendingDeliveryQueueEntriesInDatabase(openStateDatabase(stateDir, context), queueNames);
}
/** Inventory retired custody without opening a writer or creating state. */
async function countPendingDeliveryQueueEntriesReadOnly(queueNames, env = process.env) {
	return await withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync((database) => countPendingDeliveryQueueEntriesInDatabase(database, queueNames), { env }) ?? 0;
}
/** Physically expire age-bounded delivery queue tombstones. */
async function pruneExpiredDeliveryQueueTombstones(stateDir, context) {
	await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.pruneTombstones",
		input: void 0
	});
}
/** Atomically delete or tombstone a pending row only while its value is unchanged. */
function terminalizePendingDeliveryQueueEntry(params, context) {
	const prepared = prepareDeliveryQueueTerminalEntry(params);
	return terminalizePendingDeliveryQueueEntryInDatabase(openStateDatabase(params.stateDir, context), prepared);
}
//#endregion
export { loadDeliveryQueueEntries as a, terminalizePendingDeliveryQueueEntry as c, getDeliveryQueueEntryStatus as i, executeDeliveryQueueOperation as l, countPendingDeliveryQueueEntries as n, loadDeliveryQueueEntry as o, countPendingDeliveryQueueEntriesReadOnly as r, pruneExpiredDeliveryQueueTombstones as s, countFailedDeliveryQueueEntries as t };
