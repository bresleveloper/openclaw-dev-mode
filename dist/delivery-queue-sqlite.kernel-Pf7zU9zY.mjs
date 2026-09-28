import "./src-CZ2wJvNB.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { at as projectDeliveryQueueTerminalEntry, dt as pruneDeliveryQueueTombstoneAges, ft as pruneDeliveryQueueTombstones, it as parseDeliveryQueueCompletionRetention, lt as inflateDeliveryQueueRow, mt as upsertBoundDeliveryQueueEntryInDatabase, nt as hasLiveDeliveryQueueClaim, ot as bindDeliveryQueueEntry, pt as terminalizeBoundDeliveryQueueEntry, rt as inferDeliveryQueueFailureRetention, st as deliveryQueueEntriesQuery, ut as loadDeliveryQueueEntryInDatabase } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
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
		entries: snapshot.entryRows.map(inflateDeliveryQueueRow).filter((entry) => entry != null),
		stagingEntries: snapshot.stagingRows.map(inflateDeliveryQueueRow).filter((entry) => entry != null)
	};
}
/** Keeps namespace reads and receipt pruning on the caller's exact transaction handle. */
function getDeliveryQueueEntryOwnersInDatabase(database, queueNames, id) {
	return getDeliveryQueueEntriesOwnersInDatabase(database, queueNames, [id]).get(id) ?? /* @__PURE__ */ new Map();
}
function getDeliveryQueueEntriesOwnersInDatabase(database, queueNames, ids) {
	if (queueNames.length === 0 || ids.length === 0) return /* @__PURE__ */ new Map();
	const queueDb = getNodeSqliteKysely(database.db);
	const uniqueIds = [...new Set(ids)];
	return runSqliteImmediateTransactionSync(database.db, () => {
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
			const rows = readChunk(uniqueIds.slice(0, 500));
			for (let offset = 500; offset < uniqueIds.length; offset += 500) rows.push(...readChunk(uniqueIds.slice(offset, offset + 500)));
			return rows;
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
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "read delivery queue status"
	});
}
function loadDeliveryQueueEntriesInDatabase(database, queueName, mode = "pending") {
	return executeSqliteQuerySync(database.db, deliveryQueueEntriesQuery(database, [queueName], mode).orderBy("enqueued_at", "asc").orderBy("id", "asc")).rows.map(inflateDeliveryQueueRow).filter((entry) => entry != null);
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
	const current = loadDeliveryQueueEntryInDatabase(database, params.queueName, params.id, "pending");
	if (!current) throw deliveryQueueEntryNotFoundError(params.queueName, params.id);
	if (params.expectedPlatformSendAttemptId && !hasLiveDeliveryQueueClaim(current, params.expectedPlatformSendAttemptId, Date.now())) throw new Error(`Delivery platform claim was lost: ${params.id}`);
	const persistedAttemptCount = typeof current.attemptCount === "number" && Number.isInteger(current.attemptCount) && current.attemptCount >= 0 ? current.attemptCount : 0;
	const attemptCount = Math.max(persistedAttemptCount, current.retryCount);
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
export { deleteDeliveryQueueEntryInDatabase as a, getDeliveryQueueEntriesOwnersInDatabase as c, prepareDeliveryQueueTerminalEntry as d, pruneExpiredDeliveryQueueTombstonesInDatabase as f, upsertDeliveryQueueEntryInDatabase as g, updateDeliveryQueueEntryInDatabase as h, countPendingDeliveryQueueEntriesInDatabase as i, getDeliveryQueueEntryOwnersInDatabase as l, terminalizePendingDeliveryQueueEntryInDatabase as m, completeLoadedDeliveryQueueEntryInDatabase as n, deliveryQueueEntryNotFoundError as o, reserveDeliveryQueueEntryAttemptInDatabase as p, countFailedDeliveryQueueEntriesInDatabase as r, expireStagingAndLoadDeliveryQueueEntriesInDatabase as s, completeDeliveryQueueEntryInDatabase as t, loadDeliveryQueueEntriesInDatabase as u };
