import { E as normalizeLowercaseStringOrEmpty } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-session-key-CJdIm256.mjs";
import "./openclaw-state-read-account-id-CsGcZHqp.mjs";
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
function resolveAllowFromAccountId(accountId) {
	if (accountId != null && typeof accountId !== "string") throw invalidPairingKeyError("account id", "expected non-empty string", accountId);
	return normalizeLowercaseStringOrEmpty(accountId) || "default";
}
//#endregion
//#region src/pairing/pairing-store-sqlite.ts
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
const pairingReadOperations = { "pairing.allowFrom": (input, db) => ({
	type: "pairing.allowFrom",
	entries: (readChannelAllowEntries(db, input.channel)[input.accountId] ?? []).slice()
}) };
//#endregion
export { pairingReadOperations };
