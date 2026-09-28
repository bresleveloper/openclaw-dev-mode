import { ut as loadDeliveryQueueEntryInDatabase } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { a as deleteDeliveryQueueEntryInDatabase, d as prepareDeliveryQueueTerminalEntry, h as updateDeliveryQueueEntryInDatabase, i as countPendingDeliveryQueueEntriesInDatabase, l as getDeliveryQueueEntryOwnersInDatabase, m as terminalizePendingDeliveryQueueEntryInDatabase, p as reserveDeliveryQueueEntryAttemptInDatabase, u as loadDeliveryQueueEntriesInDatabase } from "./delivery-queue-sqlite.kernel-Pf7zU9zY.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
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
/** Delete a pending delivery queue entry after successful delivery. */
function deleteDeliveryQueueEntry(queueName, id, stateDir, context) {
	deleteDeliveryQueueEntryInDatabase(openStateDatabase(stateDir, context), queueName, id);
}
/** Load, transform, and persist a pending delivery queue entry. */
function updateDeliveryQueueEntry(queueName, id, stateDir, update, context) {
	updateDeliveryQueueEntryInDatabase(openStateDatabase(stateDir, context), queueName, id, update);
}
/** Atomically reserve one provider-delivery call before executing it. */
function reserveDeliveryQueueEntryAttempt(params, context) {
	if (!Number.isInteger(params.maxAttempts) || params.maxAttempts <= 0) throw new Error(`Invalid delivery attempt budget: ${params.maxAttempts}`);
	return runOpenClawStateWriteTransaction((database) => reserveDeliveryQueueEntryAttemptInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: `reserve ${params.queueName} delivery attempt` });
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
export { getDeliveryQueueEntryStatus as a, pruneExpiredDeliveryQueueTombstones as c, updateDeliveryQueueEntry as d, executeDeliveryQueueOperation as f, deleteDeliveryQueueEntry as i, reserveDeliveryQueueEntryAttempt as l, countPendingDeliveryQueueEntries as n, loadDeliveryQueueEntries as o, countPendingDeliveryQueueEntriesReadOnly as r, loadDeliveryQueueEntry as s, countFailedDeliveryQueueEntries as t, terminalizePendingDeliveryQueueEntry as u };
