import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as safeChannelKey, n as resolveAllowFromAccountId, r as resolvePairingRequestAccountId, t as dedupePreserveOrder } from "./pairing-store-keys-BTumx1Bd.mjs";
//#region src/pairing/pairing-store-sqlite.ts
function normalizePersistedPairingMeta(value) {
	if (!isRecord(value)) return;
	const out = {};
	for (const [key, entry] of Object.entries(value)) {
		const normalized = normalizeOptionalString(entry);
		if (normalized) out[key] = normalized;
	}
	return Object.keys(out).length > 0 ? out : void 0;
}
function normalizePersistedPairingRequest(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id);
	const code = normalizeOptionalString(value.code);
	const createdAt = normalizeOptionalString(value.createdAt);
	const lastSeenAt = normalizeOptionalString(value.lastSeenAt) ?? createdAt;
	if (!id || !code || !createdAt || !lastSeenAt || parseDateStringTimestampMs(createdAt) === void 0 || parseDateStringTimestampMs(lastSeenAt) === void 0) return;
	const meta = normalizePersistedPairingMeta(value.meta);
	return {
		id,
		code,
		createdAt,
		lastSeenAt,
		...meta ? { meta } : {}
	};
}
function readChannelAllowRows(database, channel) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("channel_pairing_allow_entries").selectAll().where("channel_key", "=", safeChannelKey(channel)).orderBy("account_id", "asc").orderBy("sort_order", "asc").orderBy("entry", "asc")).rows;
}
function readChannelAllowEntries(database, channel) {
	const rows = readChannelAllowRows(database, channel);
	const allowFrom = {};
	for (const row of rows) {
		const accountId = resolveAllowFromAccountId(row.account_id);
		(allowFrom[accountId] ??= []).push(row.entry);
	}
	return allowFrom;
}
function normalizePairingRequestRows(rows) {
	return rows.flatMap((row) => {
		let meta;
		if (row.meta_json) try {
			meta = normalizePersistedPairingMeta(JSON.parse(row.meta_json));
		} catch {
			meta = void 0;
		}
		meta = {
			...meta,
			accountId: resolveAllowFromAccountId(row.account_id)
		};
		const request = normalizePersistedPairingRequest({
			id: row.request_id,
			code: row.code,
			createdAt: row.created_at,
			lastSeenAt: row.last_seen_at,
			meta
		});
		return request ? [request] : [];
	});
}
function readChannelPairingRequests(database, channel) {
	const db = getNodeSqliteKysely(database);
	const rows = executeSqliteQuerySync(database, db.selectFrom("channel_pairing_requests").selectAll().where("channel_key", "=", safeChannelKey(channel)).orderBy("created_at", "asc").orderBy("account_id", "asc").orderBy("request_id", "asc")).rows;
	return normalizePairingRequestRows(rows);
}
function readChannelPairingSnapshotFromDatabase(database, channel) {
	const db = getNodeSqliteKysely(database.db);
	const channelKey = safeChannelKey(channel);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("channel_pairing_requests").select((eb) => [
		"channel_key",
		"account_id",
		"request_id as record_id",
		"code",
		"created_at",
		"last_seen_at",
		"meta_json",
		eb.val(0).as("sort_order"),
		eb.val(0).as("updated_at"),
		eb.val("request").as("kind")
	]).where("channel_key", "=", channelKey).unionAll(db.selectFrom("channel_pairing_allow_entries").select((eb) => [
		"channel_key",
		"account_id",
		"entry as record_id",
		eb.val("").as("code"),
		eb.val("").as("created_at"),
		eb.val("").as("last_seen_at"),
		eb.val(null).as("meta_json"),
		"sort_order",
		"updated_at",
		eb.val("allow").as("kind")
	]).where("channel_key", "=", channelKey)).orderBy("kind", "asc").orderBy("created_at", "asc").orderBy("account_id", "asc").orderBy("sort_order", "asc").orderBy("record_id", "asc")).rows;
	const requestRows = [];
	const allowRows = [];
	for (const row of rows) if (row.kind === "request") requestRows.push({
		channel_key: row.channel_key,
		account_id: row.account_id,
		request_id: row.record_id,
		code: row.code,
		created_at: row.created_at,
		last_seen_at: row.last_seen_at,
		meta_json: row.meta_json
	});
	else allowRows.push({
		channel_key: row.channel_key,
		account_id: row.account_id,
		entry: row.record_id,
		sort_order: row.sort_order,
		updated_at: row.updated_at
	});
	const requests = normalizePairingRequestRows(requestRows);
	const allowFrom = {};
	for (const row of allowRows) (allowFrom[resolveAllowFromAccountId(row.account_id)] ??= []).push(row.entry);
	return {
		state: {
			version: 1,
			requests,
			allowFrom
		},
		requestRows,
		allowRows
	};
}
function writeChannelPairingStateToDatabase(database, channel, state) {
	const db = getNodeSqliteKysely(database.db);
	const channelKey = safeChannelKey(channel);
	executeSqliteQuerySync(database.db, db.deleteFrom("channel_pairing_requests").where("channel_key", "=", channelKey));
	executeSqliteQuerySync(database.db, db.deleteFrom("channel_pairing_allow_entries").where("channel_key", "=", channelKey));
	for (const request of state.requests) {
		const normalized = normalizePersistedPairingRequest(request);
		if (!normalized) continue;
		executeSqliteQuerySync(database.db, db.insertInto("channel_pairing_requests").values({
			channel_key: channelKey,
			account_id: resolvePairingRequestAccountId(normalized),
			request_id: normalized.id,
			code: normalized.code,
			created_at: normalized.createdAt,
			last_seen_at: normalized.lastSeenAt,
			meta_json: normalized.meta ? JSON.stringify(normalized.meta) : null
		}));
	}
	const updatedAt = Date.now();
	for (const [accountId, entries] of Object.entries(state.allowFrom ?? {})) {
		const normalizedEntries = dedupePreserveOrder(entries.map((entry) => normalizeOptionalString(entry) ?? "").filter((entry) => entry && entry !== "*"));
		for (const [sortOrder, entry] of normalizedEntries.entries()) executeSqliteQuerySync(database.db, db.insertInto("channel_pairing_allow_entries").values({
			channel_key: channelKey,
			account_id: resolveAllowFromAccountId(accountId),
			entry,
			sort_order: sortOrder,
			updated_at: updatedAt
		}));
	}
}
function updateChannelPairingStateSnapshot(channel, env, update) {
	return runOpenClawStateWriteTransaction((database) => {
		const state = readChannelPairingSnapshotFromDatabase(database, channel).state;
		const result = update(state);
		writeChannelPairingStateToDatabase(database, channel, state);
		return result;
	}, { env });
}
//#endregion
export { updateChannelPairingStateSnapshot as a, readChannelPairingSnapshotFromDatabase as i, readChannelAllowEntries as n, readChannelPairingRequests as r, normalizePersistedPairingRequest as t };
