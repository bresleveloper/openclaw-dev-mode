import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./account-id-B1bfbA5J.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as listChannelPlugins, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
//#region src/channels/plugins/pairing.ts
function listPairingChannels() {
	return listChannelPlugins().filter((plugin) => plugin.pairing).map((plugin) => plugin.id);
}
function getPairingAdapter(channelId) {
	return getChannelPlugin(channelId)?.pairing ?? null;
}
function requirePairingAdapter(channelId) {
	const adapter = getPairingAdapter(channelId);
	if (!adapter) throw new Error(`Channel ${channelId} does not support pairing`);
	return adapter;
}
async function notifyPairingApproved(params) {
	const adapter = params.pairingAdapter ?? requirePairingAdapter(params.channelId);
	if (!adapter.notifyApproval) return;
	await adapter.notifyApproval({
		cfg: params.cfg,
		id: params.id,
		...params.accountId ? { accountId: params.accountId } : {},
		...params.meta ? { meta: params.meta } : {},
		runtime: params.runtime
	});
}
//#endregion
//#region src/pairing/pairing-store-keys.ts
function describePairingKeyInput(value) {
	if (value === null) return "null";
	if (Array.isArray(value)) return "array";
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed ? `string length ${trimmed.length}` : "empty string";
	}
	if (typeof value === "number" && !Number.isFinite(value)) return "non-finite number";
	return typeof value;
}
function invalidPairingKeyError(kind, reason, value) {
	return /* @__PURE__ */ new Error(`invalid pairing ${kind}: ${reason}; got ${describePairingKeyInput(value)}`);
}
function normalizePairingKey(value, kind) {
	if (typeof value !== "string") throw invalidPairingKeyError(kind, "expected non-empty string", value);
	const raw = normalizeLowercaseStringOrEmpty(value);
	if (!raw) throw invalidPairingKeyError(kind, "expected non-empty string", value);
	const safe = raw.replace(/[\\/:*?"<>|]/g, "_").replace(/\.\./g, "_");
	if (!safe || safe === "_") throw invalidPairingKeyError(kind, "sanitized key is empty", value);
	return safe;
}
function safeChannelKey(channel) {
	return normalizePairingKey(channel, "channel");
}
function safeAccountKey(accountId) {
	return normalizePairingKey(accountId, "account id");
}
function dedupePreserveOrder(entries) {
	return normalizeUniqueStringEntries(entries);
}
function resolveAllowFromAccountId(accountId) {
	if (accountId != null && typeof accountId !== "string") throw invalidPairingKeyError("account id", "expected non-empty string", accountId);
	return normalizeLowercaseStringOrEmpty(accountId) || "default";
}
//#endregion
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
function resolvePairingRequestAccountId(entry) {
	return resolveAllowFromAccountId(entry.meta?.accountId) || "default";
}
function sqliteOptionsForEnv(env) {
	return { env };
}
function readChannelPairingStateFromDatabase(database, channel) {
	const db = getNodeSqliteKysely(database.db);
	const channelKey = safeChannelKey(channel);
	const requestRows = executeSqliteQuerySync(database.db, db.selectFrom("channel_pairing_requests").selectAll().where("channel_key", "=", channelKey).orderBy("created_at", "asc").orderBy("account_id", "asc").orderBy("request_id", "asc")).rows;
	const allowRows = executeSqliteQuerySync(database.db, db.selectFrom("channel_pairing_allow_entries").selectAll().where("channel_key", "=", channelKey).orderBy("account_id", "asc").orderBy("sort_order", "asc").orderBy("entry", "asc")).rows;
	const allowFrom = {};
	for (const row of allowRows) {
		const accountId = resolveAllowFromAccountId(row.account_id);
		(allowFrom[accountId] ??= []).push(row.entry);
	}
	return {
		version: 1,
		requests: requestRows.flatMap((row) => {
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
		}),
		allowFrom
	};
}
function readChannelPairingState(channel, env) {
	return readChannelPairingStateFromDatabase(openOpenClawStateDatabase(sqliteOptionsForEnv(env)), channel);
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
		const state = readChannelPairingStateFromDatabase(database, channel);
		const result = update(state);
		writeChannelPairingStateToDatabase(database, channel, state);
		return result;
	}, sqliteOptionsForEnv(env));
}
//#endregion
export { updateChannelPairingStateSnapshot as a, resolveAllowFromAccountId as c, listPairingChannels as d, notifyPairingApproved as f, sqliteOptionsForEnv as i, safeAccountKey as l, readChannelPairingStateFromDatabase as n, writeChannelPairingStateToDatabase as o, resolvePairingRequestAccountId as r, dedupePreserveOrder as s, readChannelPairingState as t, getPairingAdapter as u };
