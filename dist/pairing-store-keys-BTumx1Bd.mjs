import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import "./session-key-CSDERtm3.mjs";
import "./account-id-ifCOO7_9.mjs";
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
function resolvePairingRequestAccountId(entry) {
	return resolveAllowFromAccountId(entry.meta?.accountId);
}
//#endregion
export { safeChannelKey as a, safeAccountKey as i, resolveAllowFromAccountId as n, resolvePairingRequestAccountId as r, dedupePreserveOrder as t };
