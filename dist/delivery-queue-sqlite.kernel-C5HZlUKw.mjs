import "./src-Djeo9OvP.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { C as upsertBoundDeliveryQueueEntryInDatabase, S as terminalizeBoundDeliveryQueueEntry, _ as deliveryQueueEntriesQuery, b as pruneDeliveryQueueTombstoneAges, d as hasLiveDeliveryQueueClaim, f as inferDeliveryQueueFailureRetention, g as bindDeliveryQueueEntry, h as resolveDeliveryQueueAttemptCount, m as projectDeliveryQueueTerminalEntry, p as parseDeliveryQueueCompletionRetention, v as inflateDeliveryQueueRows, x as pruneDeliveryQueueTombstones, y as loadDeliveryQueueEntryInDatabase } from "./openclaw-state-db-legacy-backfills-DGJSWaXR.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
//#region src/infra/delivery-queue-sqlite.kernel.ts
function deliveryQueueEntryNotFoundError(queueName, id) {
	return Object.assign(/* @__PURE__ */ new Error(`No pending ${queueName} delivery queue entry ${id}`), { code: "ENOENT" });
}
function upsertDeliveryQueueEntryInDatabase(params, database) {
	return upsertBoundDeliveryQueueEntryInDatabase(bindDeliveryQueueEntry(params), database);
}
function expireStagingAndLoadDeliveryQueueEntriesInDatabase(database, params) {
	const snapshot = runSqliteImmediateTransactionSync(database.db, () => {
		executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).deleteFrom("delivery_queue_entries").where("queue_name", "=", params.stagingQueueName).where("status", "=", "pending").where("enqueued_at", "<=", params.expireBeforeMs));
		const read = (queueNames) => executeSqliteQuerySync(database.db, deliveryQueueEntriesQuery(database, queueNames, "unfinished").orderBy("enqueued_at", "asc").orderBy("id", "asc")).rows;
		return {
			entryRows: read(params.queueNames),
			stagingRows: read([params.stagingQueueName])
		};
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "expire delivery queue staging entries"
	});
	return {
		entries: inflateDeliveryQueueRows(snapshot.entryRows),
		stagingEntries: inflateDeliveryQueueRows(snapshot.stagingRows)
	};
}
/** Keeps namespace reads and receipt pruning on the caller's exact transaction handle. */
function getDeliveryQueueEntryOwnersInDatabase(database, queueNames, id) {
	return getDeliveryQueueEntriesOwnersInDatabase(database, queueNames, [id]).get(id) ?? /* @__PURE__ */ new Map();
}
function getDeliveryQueueEntriesOwnersInDatabase(database, queueNames, ids) {
	if (queueNames.length === 0 || ids.length === 0) return /* @__PURE__ */ new Map();
	return runSqliteImmediateTransactionSync(database.db, () => selectDeliveryQueueEntryOwners(database, queueNames, ids), {
		databaseLabel: "openclaw-state",
		operationLabel: "read delivery queue status"
	});
}
/** Read receipt and live custody within the same pruning transaction. */
function inspectDeliveryQueueReceiptInDatabase(database, input) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		const status = selectDeliveryQueueEntryOwners(database, [input.queueName], [input.id]).get(input.id)?.get(input.queueName)?.status;
		return {
			status,
			pendingEntry: input.includePending && status === "pending" ? loadDeliveryQueueEntryInDatabase(database, input.queueName, input.id, "pending") : null
		};
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "read delivery queue receipt"
	});
}
function selectDeliveryQueueEntryOwners(database, queueNames, ids) {
	const queueDb = getNodeSqliteKysely(database.db);
	const uniqueIds = [...new Set(ids)];
	const readExact = () => {
		const query = queueDb.selectFrom("delivery_queue_entries").select([
			"id",
			"queue_name",
			"status",
			"recovery_state"
		]).select((eb) => eb.case("recovery_state").when("completed_bounded").then(eb.ref("entry_json")).else(null).end().as("entry_json")).where("queue_name", "in", queueNames);
		const readChunk = (chunk) => {
			const id = chunk.length === 1 ? chunk[0] : void 0;
			return executeSqliteQuerySync(database.db, id === void 0 ? query.where("id", "in", chunk) : query.where("id", "=", id)).rows;
		};
		return chunkItems(uniqueIds, 500).flatMap(readChunk);
	};
	let rows = readExact();
	let pruned = false;
	const prunedPrefixes = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (row.entry_json === null) continue;
		const entry = safeParseJsonRecord(row.entry_json);
		const retention = parseDeliveryQueueCompletionRetention(entry?.completionRetention, row.id);
		if (typeof retention === "object") {
			const prefixes = prunedPrefixes.get(row.queue_name) ?? /* @__PURE__ */ new Set();
			if (prefixes.has(retention.idPrefix)) continue;
			prefixes.add(retention.idPrefix);
			prunedPrefixes.set(row.queue_name, prefixes);
			pruned = pruneDeliveryQueueTombstones(database.db, Date.now(), {
				queueName: row.queue_name,
				idPrefix: retention.idPrefix
			}) || pruned;
		}
	}
	if (pruned) rows = readExact();
	const owners = /* @__PURE__ */ new Map();
	for (const row of rows) if (row.status) {
		const namespaces = owners.get(row.id) ?? /* @__PURE__ */ new Map();
		namespaces.set(row.queue_name, {
			status: row.status,
			...row.status === "failed" && row.recovery_state === "settlement_pending" ? { settlementPending: true } : {}
		});
		owners.set(row.id, namespaces);
	}
	return owners;
}
function loadDeliveryQueueEntriesInDatabase(database, queueName, mode = "pending") {
	const rows = executeSqliteQuerySync(database.db, deliveryQueueEntriesQuery(database, [queueName], mode).orderBy("enqueued_at", "asc").orderBy("id", "asc")).rows;
	return inflateDeliveryQueueRows(rows);
}
function deleteDeliveryQueueEntryInDatabase(database, queueName, id) {
	const queueDb = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, queueDb.deleteFrom("delivery_queue_entries").where("queue_name", "=", queueName).where("id", "=", id).where("status", "=", "pending"));
}
function completeDeliveryQueueEntryInDatabase(database, queueName, id) {
	const now = Date.now();
	completeLoadedDeliveryQueueEntryInDatabase(database, queueName, id, loadDeliveryQueueEntryInDatabase(database, queueName, id, "pending"), now);
}
/** Shared completion policy; reuse a prior read only while its write transaction remains held. */
function completeLoadedDeliveryQueueEntryInDatabase(database, queueName, id, current, now = Date.now()) {
	const requestedRetention = current?.completionRetention;
	const retention = parseDeliveryQueueCompletionRetention(requestedRetention, id);
	if (requestedRetention && !retention) throw new Error(`Invalid bounded delivery completion retention: ${queueName}/${id}`);
	if (!upsertDeliveryQueueEntryInDatabase({
		queueName,
		entry: projectDeliveryQueueTerminalEntry({
			id,
			retryCount: 0
		}, now, "completed", retention),
		metadata: {},
		status: "completed",
		completeExisting: true
	}, database)) {
		if (getDeliveryQueueEntryOwnersInDatabase(database, [queueName], id).get(queueName)?.status === "completed") return;
		throw deliveryQueueEntryNotFoundError(queueName, id);
	}
	if (typeof retention === "object") getDeliveryQueueEntryOwnersInDatabase(database, [queueName], id);
}
function updateDeliveryQueueEntryInDatabase(database, queueName, id, update) {
	const current = loadDeliveryQueueEntryInDatabase(database, queueName, id, "pending");
	if (!current) throw deliveryQueueEntryNotFoundError(queueName, id);
	upsertDeliveryQueueEntryInDatabase({
		queueName,
		entry: update(current)
	}, database);
}
function reserveDeliveryQueueEntryAttemptInDatabase(database, params) {
	if (!Number.isInteger(params.maxAttempts) || params.maxAttempts <= 0) throw new Error(`Invalid delivery attempt budget: ${params.maxAttempts}`);
	const current = loadDeliveryQueueEntryInDatabase(database, params.queueName, params.id, "pending");
	if (!current) throw deliveryQueueEntryNotFoundError(params.queueName, params.id);
	if (params.expectedPlatformSendAttemptId && !hasLiveDeliveryQueueClaim(current, params.expectedPlatformSendAttemptId, Date.now())) throw new Error(`Delivery platform claim was lost: ${params.id}`);
	const attemptCount = resolveDeliveryQueueAttemptCount(current);
	if (attemptCount >= params.maxAttempts) return {
		status: "exhausted",
		attemptCount
	};
	const reservedAttemptCount = attemptCount + 1;
	if (!upsertDeliveryQueueEntryInDatabase({
		queueName: params.queueName,
		entry: {
			...current,
			attemptCount: reservedAttemptCount
		},
		updatePendingOnly: true
	}, database)) throw deliveryQueueEntryNotFoundError(params.queueName, params.id);
	return {
		status: "reserved",
		attemptCount: reservedAttemptCount
	};
}
function countFailedDeliveryQueueEntriesInDatabase(database) {
	const queueDb = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, queueDb.selectFrom("delivery_queue_entries").select((eb) => [
		"queue_name as queueName",
		eb.fn.countAll().as("count"),
		eb.fn.min("failed_at").as("oldestFailedAt")
	]).where("status", "=", "failed").groupBy("queue_name").orderBy("queue_name", "asc")).rows.map(({ oldestFailedAt, ...row }) => oldestFailedAt == null ? row : Object.assign(row, { oldestFailedAt }));
}
function countPendingDeliveryQueueEntriesInDatabase(database, queueNames) {
	const queueDb = getNodeSqliteKysely(database.db);
	const [row] = executeSqliteQuerySync(database.db, queueDb.selectFrom("delivery_queue_entries").select((eb) => eb.fn.countAll().as("count")).where("queue_name", "in", queueNames).where("status", "=", "pending")).rows;
	return row?.count ?? 0;
}
function pruneExpiredDeliveryQueueTombstonesInDatabase(database) {
	runSqliteImmediateTransactionSync(database.db, () => pruneDeliveryQueueTombstoneAges(database.db, Date.now()), {
		databaseLabel: "openclaw-state",
		operationLabel: "expire delivery queue tombstones"
	});
}
/** Validate and serialize terminal custody before a standalone call opens its database. */
function prepareDeliveryQueueTerminalEntry(params) {
	if (params.entry.id !== params.id) throw new Error(`Delivery queue entry id mismatch: ${params.entry.id} != ${params.id}`);
	const now = Date.now();
	const expectedJson = JSON.stringify(params.entry);
	const retention = inferDeliveryQueueFailureRetention(params.entry, params.id, params.queueName);
	const failedEntry = retention ? projectDeliveryQueueTerminalEntry(params.entry, now, "failed", retention) : void 0;
	return {
		queueName: params.queueName,
		id: params.id,
		expectedStatus: params.expectedStatus,
		now,
		expectedJson,
		retention,
		failedEntry
	};
}
function terminalizePendingDeliveryQueueEntryInDatabase(database, prepared) {
	const { queueName, id, expectedJson, failedEntry, now, expectedStatus, retention } = prepared;
	if (!terminalizeBoundDeliveryQueueEntry(database.db, queueName, id, expectedJson, failedEntry, now, expectedStatus)) return { status: "not_pending" };
	if (typeof retention === "object") getDeliveryQueueEntryOwnersInDatabase(database, [queueName], id);
	return {
		status: "terminalized",
		retained: retention !== void 0
	};
}
//#endregion
export { upsertDeliveryQueueEntryInDatabase as _, deleteDeliveryQueueEntryInDatabase as a, getDeliveryQueueEntriesOwnersInDatabase as c, loadDeliveryQueueEntriesInDatabase as d, prepareDeliveryQueueTerminalEntry as f, updateDeliveryQueueEntryInDatabase as g, terminalizePendingDeliveryQueueEntryInDatabase as h, countPendingDeliveryQueueEntriesInDatabase as i, getDeliveryQueueEntryOwnersInDatabase as l, reserveDeliveryQueueEntryAttemptInDatabase as m, completeLoadedDeliveryQueueEntryInDatabase as n, deliveryQueueEntryNotFoundError as o, pruneExpiredDeliveryQueueTombstonesInDatabase as p, countFailedDeliveryQueueEntriesInDatabase as r, expireStagingAndLoadDeliveryQueueEntriesInDatabase as s, completeDeliveryQueueEntryInDatabase as t, inspectDeliveryQueueReceiptInDatabase as u };
