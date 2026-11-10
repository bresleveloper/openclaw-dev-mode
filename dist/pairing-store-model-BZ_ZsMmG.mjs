import { y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as resolvePairingRequestAccountId } from "./pairing-store-keys-BTumx1Bd.mjs";
import crypto from "node:crypto";
//#region src/pairing/pairing-store-model.ts
const PAIRING_CODE_LENGTH = 8;
const PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PAIRING_CODE_MAX_ATTEMPTS = 500;
const CHANNEL_PAIRING_PENDING_TTL_MS = 36e5;
/** Stable opaque id for approving a request without exposing its human pairing code. */
function resolveChannelPairingRequestId(channel, request) {
	const accountId = resolvePairingRequestAccountId(request);
	return crypto.createHash("sha256").update(`${channel}\0${accountId}\0${request.id}\0${request.createdAt}`).digest("base64url").slice(0, 32);
}
function isExpired(entry, nowMs) {
	const createdAt = parseDateStringTimestampMs(entry.createdAt);
	return createdAt === void 0 || nowMs - createdAt > 36e5;
}
function pruneExpiredRequests(reqs, nowMs) {
	const requests = reqs.filter((req) => !isExpired(req, nowMs));
	return {
		requests,
		removed: requests.length !== reqs.length
	};
}
function resolveLastSeenAt(entry) {
	return parseDateStringTimestampMs(entry.lastSeenAt) ?? parseDateStringTimestampMs(entry.createdAt) ?? 0;
}
function requestMatchesAccountId(entry, normalizedAccountId) {
	return !normalizedAccountId || resolvePairingRequestAccountId(entry) === normalizedAccountId;
}
function pruneExcessRequestsByAccount(reqs) {
	const grouped = /* @__PURE__ */ new Map();
	for (const [index, entry] of reqs.entries()) {
		const accountId = resolvePairingRequestAccountId(entry);
		const entries = grouped.get(accountId) ?? [];
		entries.push([index, entry]);
		grouped.set(accountId, entries);
	}
	const droppedIndexes = /* @__PURE__ */ new Set();
	for (const entries of grouped.values()) {
		const sorted = entries.toSorted(([, left], [, right]) => resolveLastSeenAt(left) - resolveLastSeenAt(right));
		for (const [index] of sorted.slice(0, -3)) droppedIndexes.add(index);
	}
	return droppedIndexes.size === 0 ? {
		requests: reqs,
		removed: false
	} : {
		requests: reqs.filter((_, index) => !droppedIndexes.has(index)),
		removed: true
	};
}
function randomCode() {
	let out = "";
	for (let i = 0; i < PAIRING_CODE_LENGTH; i++) out += PAIRING_CODE_ALPHABET[crypto.randomInt(0, 32)];
	return out;
}
function generateUniqueCode(existing) {
	for (let attempt = 0; attempt < PAIRING_CODE_MAX_ATTEMPTS; attempt += 1) {
		const code = randomCode();
		if (!existing.has(code)) return code;
	}
	throw new Error(`failed to generate unique pairing code after ${PAIRING_CODE_MAX_ATTEMPTS} attempts; existing code count: ${existing.size}`);
}
//#endregion
export { requestMatchesAccountId as a, pruneExpiredRequests as i, generateUniqueCode as n, resolveChannelPairingRequestId as o, pruneExcessRequestsByAccount as r, CHANNEL_PAIRING_PENDING_TTL_MS as t };
