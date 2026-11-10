import { c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as openOpenClawStateDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { d as loadDeliveryQueueEntriesInDatabase, f as prepareDeliveryQueueTerminalEntry, h as terminalizePendingDeliveryQueueEntryInDatabase, i as countPendingDeliveryQueueEntriesInDatabase } from "./delivery-queue-sqlite.kernel-C5HZlUKw.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
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
/** Select receipt and pending custody together, preserving bounded receipt expiry. */
async function inspectDeliveryQueueReceipt(queueName, id, includePending, context) {
	const result = await executeDeliveryQueueOperation(context, void 0, {
		type: "deliveryQueue.inspectReceipt",
		input: {
			queueName,
			id,
			includePending
		}
	});
	context.workerContext.admission.assertCurrent();
	return result;
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
async function countPendingDeliveryQueueEntries(queueNames, stateDir, context) {
	if (queueNames.length === 0) return 0;
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const count = await executeDeliveryQueueOperation(captured, void 0, {
		type: "deliveryQueue.countPending",
		input: { queueNames: [...queueNames] }
	});
	captured.workerContext.admission.assertCurrent();
	return count;
}
/** Doctor's offline migration retains its admitted native database owner. */
function countPendingDeliveryQueueEntriesForMaintenance(queueNames, stateDir, context) {
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
export { inspectDeliveryQueueReceipt as a, terminalizePendingDeliveryQueueEntry as c, countPendingDeliveryQueueEntriesReadOnly as i, executeDeliveryQueueOperation as l, countPendingDeliveryQueueEntries as n, loadDeliveryQueueEntries as o, countPendingDeliveryQueueEntriesForMaintenance as r, pruneExpiredDeliveryQueueTombstones as s, countFailedDeliveryQueueEntries as t };
