import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString, s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import "./session-key-C09ow4h0.mjs";
import "./account-id-DbRsdayc.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as writeChannelPairingStateToDatabase, l as getPairingAdapter, n as readChannelPairingStateFromDatabase, r as resolvePairingRequestAccountId, s as resolveAllowFromAccountId, t as readChannelPairingState } from "./pairing-store-sqlite-Bo6V-Kb1.mjs";
import crypto from "node:crypto";
//#region src/pairing/pairing-store.ts
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
function resolvePairingAdapter(channel, pairingAdapter) {
	return pairingAdapter ?? getPairingAdapter(channel) ?? void 0;
}
function normalizeAllowFromInput(channel, entry, pairingAdapter) {
	const trimmed = normalizeStringifiedOptionalString(entry) ?? "";
	if (!trimmed || trimmed === "*") return "";
	const adapter = resolvePairingAdapter(channel, pairingAdapter);
	const normalized = adapter?.normalizeAllowEntry ? adapter.normalizeAllowEntry(trimmed) : trimmed;
	const normalizedEntry = normalizeOptionalString(normalized) ?? "";
	return normalizedEntry === "*" ? "" : normalizedEntry;
}
async function updateAllowFromStoreEntry(params) {
	const assertCurrent = params.assertCurrent;
	const env = params.env ?? process.env;
	const accountId = resolveAllowFromAccountId(params.accountId);
	const normalized = normalizeAllowFromInput(params.channel, params.entry, params.pairingAdapter);
	return runOpenClawStateWriteTransaction((database) => {
		const state = readChannelPairingStateFromDatabase(database, params.channel);
		const current = (state.allowFrom?.[accountId] ?? []).slice();
		if (!normalized) return {
			changed: false,
			allowFrom: current
		};
		const next = params.apply(current, normalized);
		if (!next) return {
			changed: false,
			allowFrom: current
		};
		state.allowFrom ??= {};
		state.allowFrom[accountId] = next;
		assertCurrent?.();
		writeChannelPairingStateToDatabase(database, params.channel, state);
		return {
			changed: true,
			allowFrom: next
		};
	}, { env });
}
async function readChannelAllowFromStore(channel, env = process.env, accountId) {
	return readChannelAllowFromStoreSync(channel, env, accountId);
}
function readChannelAllowFromStoreSync(channel, env = process.env, accountId) {
	const resolvedAccountId = resolveAllowFromAccountId(accountId);
	return (readChannelPairingState(channel, env).allowFrom?.[resolvedAccountId] ?? []).slice();
}
async function addChannelAllowFromStoreEntry(params) {
	return updateAllowFromStoreEntry({
		...params,
		apply: (current, normalized) => current.includes(normalized) ? null : [...current, normalized]
	});
}
async function removeChannelAllowFromStoreEntry(params) {
	return updateAllowFromStoreEntry({
		...params,
		apply: (current, normalized) => {
			const next = current.filter((entry) => entry !== normalized);
			return next.length === current.length ? null : next;
		}
	});
}
async function listChannelPairingRequests(channel, env = process.env, accountId, assertCurrent) {
	assertCurrent?.();
	return runOpenClawStateWriteTransaction((database) => {
		assertCurrent?.();
		const state = readChannelPairingStateFromDatabase(database, channel);
		const expired = pruneExpiredRequests(state.requests, Date.now());
		const capped = pruneExcessRequestsByAccount(expired.requests);
		if (expired.removed || capped.removed) {
			state.requests = capped.requests;
			writeChannelPairingStateToDatabase(database, channel, state);
		}
		const normalizedAccountId = normalizeLowercaseStringOrEmpty(accountId);
		const requests = capped.requests.filter((entry) => requestMatchesAccountId(entry, normalizedAccountId)).toSorted((left, right) => {
			const createdOrder = left.createdAt.localeCompare(right.createdAt);
			if (createdOrder !== 0) return createdOrder;
			return resolvePairingRequestAccountId(left).localeCompare(resolvePairingRequestAccountId(right)) || left.id.localeCompare(right.id);
		});
		assertCurrent?.();
		return requests;
	}, { env });
}
async function upsertChannelPairingRequest(params) {
	const env = params.env ?? process.env;
	return runOpenClawStateWriteTransaction((database) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const id = normalizeStringifiedOptionalString(params.id) ?? "";
		const accountId = normalizeLowercaseStringOrEmpty(params.accountId) || "default";
		const meta = {
			...params.meta ? Object.fromEntries(Object.entries(params.meta).map(([key, value]) => [key, normalizeOptionalString(value) ?? ""]).filter(([, value]) => Boolean(value))) : void 0,
			accountId
		};
		const state = readChannelPairingStateFromDatabase(database, params.channel);
		const expired = pruneExpiredRequests(state.requests, Date.now());
		let requests = expired.requests;
		const existingIndex = requests.findIndex((request) => request.id === id && requestMatchesAccountId(request, accountId));
		const existingCodes = new Set(requests.map((request) => (normalizeOptionalString(request.code) ?? "").toUpperCase()));
		if (existingIndex >= 0) {
			const existing = requests[existingIndex];
			const code = normalizeOptionalString(existing?.code) || generateUniqueCode(existingCodes);
			requests[existingIndex] = {
				id,
				code,
				createdAt: existing?.createdAt ?? now,
				lastSeenAt: now,
				meta
			};
			state.requests = pruneExcessRequestsByAccount(requests).requests;
			writeChannelPairingStateToDatabase(database, params.channel, state);
			return {
				code,
				created: false
			};
		}
		const capped = pruneExcessRequestsByAccount(requests);
		requests = capped.requests;
		if (requests.filter((request) => requestMatchesAccountId(request, accountId)).length >= 3) {
			if (expired.removed || capped.removed) {
				state.requests = requests;
				writeChannelPairingStateToDatabase(database, params.channel, state);
			}
			return {
				code: "",
				created: false
			};
		}
		const code = generateUniqueCode(existingCodes);
		state.requests = [...requests, {
			id,
			code,
			createdAt: now,
			lastSeenAt: now,
			meta
		}];
		writeChannelPairingStateToDatabase(database, params.channel, state);
		return {
			code,
			created: true
		};
	}, { env });
}
async function resolveChannelPairingRequest(params) {
	const env = params.env ?? process.env;
	params.assertCurrent?.();
	return runOpenClawStateWriteTransaction((database) => {
		params.assertCurrent?.();
		const state = readChannelPairingStateFromDatabase(database, params.channel);
		const pruned = pruneExpiredRequests(state.requests, Date.now());
		const accountId = normalizeLowercaseStringOrEmpty(params.accountId);
		const index = pruned.requests.findIndex((request) => requestMatchesAccountId(request, accountId) && params.matches(request));
		if (index < 0) {
			if (pruned.removed) {
				state.requests = pruned.requests;
				writeChannelPairingStateToDatabase(database, params.channel, state);
			}
			params.assertCurrent?.();
			return null;
		}
		const entry = pruned.requests[index];
		if (!entry) return null;
		pruned.requests.splice(index, 1);
		state.requests = pruned.requests;
		if (params.approve) {
			const allowAccountId = resolveAllowFromAccountId(normalizeOptionalString(params.accountId) ?? normalizeOptionalString(entry.meta?.accountId));
			const currentAllow = state.allowFrom?.[allowAccountId] ?? [];
			const adapter = resolvePairingAdapter(params.channel, params.pairingAdapter);
			const approvalEntry = adapter?.resolveApprovalStoreEntry ? adapter.resolveApprovalStoreEntry({
				id: entry.id,
				...entry.meta ? { meta: entry.meta } : {}
			}) : entry.id;
			const normalizedAllow = approvalEntry == null ? "" : normalizeAllowFromInput(params.channel, approvalEntry, adapter);
			if (normalizedAllow && !currentAllow.includes(normalizedAllow)) {
				state.allowFrom ??= {};
				state.allowFrom[allowAccountId] = [...currentAllow, normalizedAllow];
			}
		}
		writeChannelPairingStateToDatabase(database, params.channel, state);
		params.assertCurrent?.();
		return {
			id: entry.id,
			entry
		};
	}, { env });
}
async function approveChannelPairingCode(params) {
	const code = (normalizeNullableString(params.code) ?? "").toUpperCase();
	if (!code) return null;
	return resolveChannelPairingRequest({
		...params,
		matches: (request) => request.code.toUpperCase() === code,
		approve: true
	});
}
/** Approves a pending request by opaque id without exposing its pairing code. */
async function approveChannelPairingRequest(params) {
	const requestId = normalizeOptionalString(params.requestId);
	if (!requestId) return null;
	return resolveChannelPairingRequest({
		...params,
		matches: (request) => resolveChannelPairingRequestId(params.channel, request) === requestId,
		approve: true
	});
}
/** Dismisses a pending request without blocking the sender from requesting again. */
async function dismissChannelPairingRequest(params) {
	const requestId = normalizeOptionalString(params.requestId);
	if (!requestId) return null;
	return resolveChannelPairingRequest({
		...params,
		matches: (request) => resolveChannelPairingRequestId(params.channel, request) === requestId,
		approve: false
	});
}
//#endregion
export { dismissChannelPairingRequest as a, readChannelAllowFromStoreSync as c, upsertChannelPairingRequest as d, approveChannelPairingRequest as i, removeChannelAllowFromStoreEntry as l, addChannelAllowFromStoreEntry as n, listChannelPairingRequests as o, approveChannelPairingCode as r, readChannelAllowFromStore as s, CHANNEL_PAIRING_PENDING_TTL_MS as t, resolveChannelPairingRequestId as u };
