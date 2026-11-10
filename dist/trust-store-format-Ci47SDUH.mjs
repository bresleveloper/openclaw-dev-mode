import { Fn as object, Jn as string, Pn as number, Un as record, lr as uuid, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as normalizeReefTarget } from "./config-schema-D8RBnmHo.mjs";
import { i as matchesReefPeerIdentity, n as ReefPeerIdentitySchema, o as sameReefPeerIdentity, r as ReefPeerTrustSchema } from "./friend-types-DKK2gCV4.mjs";
import { createHash } from "node:crypto";
//#region extensions/reef/src/trust-store-format.ts
const REEF_TRUST_STORE_MAX_ENTRIES = 4096;
const REEF_TRUST_STORE_NAMESPACE = "peer-state";
const REEF_OUTBOUND_DELIVERY_STORE_NAMESPACE = "outbound-deliveries";
const REEF_OUTBOUND_DELIVERY_MAX_ENTRIES = 32768;
const REEF_OUTBOUND_DELIVERY_TTL_MS = 52704e5;
const REEF_TRUST_STORE_OPTIONS = {
	namespace: REEF_TRUST_STORE_NAMESPACE,
	maxEntries: REEF_TRUST_STORE_MAX_ENTRIES,
	overflowPolicy: "reject-new"
};
const REEF_DELIVERY_STORE_OPTIONS = {
	namespace: REEF_OUTBOUND_DELIVERY_STORE_NAMESPACE,
	maxEntries: REEF_OUTBOUND_DELIVERY_MAX_ENTRIES,
	overflowPolicy: "reject-new",
	defaultTtlMs: REEF_OUTBOUND_DELIVERY_TTL_MS
};
const REEF_PAIRING_APPROVAL_PREFIX = "reef-approval-v1:";
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
const MESSAGE_ID_PATTERN = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const ReefOutboundRequestSchema = record(uuid(), number().int().nonnegative());
const ReefRejectionNoticeStateSchema = object({
	lastRejectionAt: number().int().nonnegative(),
	lastResendAt: number().int().nonnegative().optional()
}).strict();
const ReefOutboundRejectionSchema = object({
	category: string().min(1).max(64).optional(),
	notice: ReefRejectionNoticeStateSchema.optional()
}).strict();
const ReefOutboundDeliveryBindingSchema = object({
	bodyHash: string().regex(SHA256_HEX_PATTERN),
	textHash: string().regex(SHA256_HEX_PATTERN).optional(),
	recipient: ReefPeerIdentitySchema
}).strict();
const ReefOutboundDeliverySchema = ReefOutboundDeliveryBindingSchema.extend({
	resendDisabled: literal(true).optional(),
	rejection: ReefOutboundRejectionSchema.optional(),
	sentAt: number().int().positive().optional(),
	overdueNotifiedAt: number().int().positive().optional()
}).strict();
const ReefPeerStateSchema = object({
	revision: number().int().nonnegative(),
	trust: ReefPeerTrustSchema.optional(),
	outboundRequests: ReefOutboundRequestSchema.optional(),
	rejectionNotice: ReefRejectionNoticeStateSchema.optional()
}).strict();
function parseReefPeerState(value) {
	return value === void 0 ? { revision: 0 } : ReefPeerStateSchema.parse(value);
}
function listReefPeerTrust(entries, prefix) {
	return entries.filter((entry) => entry.key.startsWith(prefix)).flatMap((entry) => {
		const { trust } = ReefPeerStateSchema.parse(entry.value);
		return trust ? [{
			peer: requirePeer(entry.key.slice(prefix.length)),
			trust
		}] : [];
	}).toSorted((left, right) => left.peer < right.peer ? -1 : left.peer > right.peer ? 1 : 0);
}
function currentReefDeliveries(entries, prefix, getTrust, requireValid = false) {
	return entries.filter((entry) => entry.key.startsWith(prefix)).flatMap((entry) => {
		const parsed = ReefOutboundDeliverySchema.safeParse(entry.value);
		if (!parsed.success) {
			if (requireValid) throw parsed.error;
			return [];
		}
		const separator = entry.key.lastIndexOf(":");
		const peer = requirePeer(entry.key.slice(prefix.length, separator));
		const id = entry.key.slice(separator + 1);
		return MESSAGE_ID_PATTERN.test(id) && matchesReefPeerIdentity(getTrust(peer), parsed.data.recipient) ? [{
			peer,
			id,
			delivery: parsed.data
		}] : [];
	});
}
function matchesReefDeliveryBinding(current, expected) {
	return current.bodyHash === expected.bodyHash && current.textHash === expected.textHash && sameReefPeerIdentity(current.recipient, expected.recipient);
}
function mergeReefRejectionNotice(current, persisted) {
	const hasResendAt = current?.lastResendAt !== void 0 || persisted.lastResendAt !== void 0;
	return {
		lastRejectionAt: Math.max(current?.lastRejectionAt ?? 0, persisted.lastRejectionAt),
		...hasResendAt ? { lastResendAt: Math.max(current?.lastResendAt ?? 0, persisted.lastResendAt ?? 0) } : {}
	};
}
function requirePeer(raw) {
	const peer = normalizeReefTarget(raw);
	if (!peer) throw new Error(`Invalid Reef peer handle: ${raw}`);
	return peer;
}
var ReefPeerTrustChangedError = class extends Error {
	constructor(peer) {
		super(`Reef peer @${requirePeer(peer)} changed trust before dispatch`);
		this.name = "ReefPeerTrustChangedError";
	}
};
function resolveReefIdentityScope(config) {
	if (!config.handle) throw new Error("Reef handle is required before opening peer trust state");
	return createHash("sha256").update(`${new URL(config.relayUrl).origin}\n${config.handle}`).digest("hex");
}
function resolveReefTrustStoreKey(config, peer) {
	return `${resolveReefIdentityScope(config)}:${requirePeer(peer)}`;
}
function resolvePairingKeyDigest(friend, trustRevision) {
	return createHash("sha256").update(`${friend.peer}\n${friend.key_epoch}\n${trustRevision}\n${friend.ed25519_pub}\n${friend.x25519_pub}`).digest("hex");
}
function isReefPairingApprovalToken(raw) {
	return raw.trim().startsWith(REEF_PAIRING_APPROVAL_PREFIX);
}
function createReefPairingApproval(identityScope, friend, trustRevision) {
	return `${REEF_PAIRING_APPROVAL_PREFIX}${identityScope}:${requirePeer(friend.peer)}:${friend.key_epoch}:${trustRevision}:${resolvePairingKeyDigest(friend, trustRevision)}`;
}
function parseReefPairingApproval(expectedIdentityScope, raw) {
	const parts = raw.trim().split(":");
	if (parts.length !== 6 || `${parts[0]}:` !== REEF_PAIRING_APPROVAL_PREFIX) return;
	const [, identityScope, rawPeer, rawKeyEpoch, rawTrustRevision, keyDigest] = parts;
	const peer = rawPeer ? normalizeReefTarget(rawPeer) : void 0;
	const keyEpoch = Number(rawKeyEpoch);
	const trustRevision = Number(rawTrustRevision);
	if (identityScope !== expectedIdentityScope || !peer || peer !== rawPeer || !Number.isSafeInteger(keyEpoch) || keyEpoch < 1 || String(keyEpoch) !== rawKeyEpoch || !Number.isSafeInteger(trustRevision) || trustRevision < 0 || String(trustRevision) !== rawTrustRevision || !keyDigest || !SHA256_HEX_PATTERN.test(keyDigest)) return;
	return {
		peer,
		keyEpoch,
		trustRevision
	};
}
function reefOutboundRequestStatus(current, requestId) {
	if (current.outboundRequests?.[requestId] !== void 0) return "current";
	return current.trust || Object.keys(current.outboundRequests ?? {}).length > 0 ? "superseded" : "revoked";
}
function withoutReefOutboundRequest(current, requestId) {
	const requests = current.outboundRequests;
	if (!requests || Object.keys(requests).length === 0 || requestId !== void 0 && requests[requestId] === void 0) return;
	const { outboundRequests: _requests, ...next } = current;
	if (requestId === void 0) return next;
	const { [requestId]: _removed, ...remaining } = requests;
	return Object.keys(remaining).length === 0 ? next : {
		...next,
		outboundRequests: remaining
	};
}
//#endregion
export { resolveReefTrustStoreKey as C, resolveReefIdentityScope as S, mergeReefRejectionNotice as _, REEF_TRUST_STORE_OPTIONS as a, reefOutboundRequestStatus as b, ReefOutboundRejectionSchema as c, ReefRejectionNoticeStateSchema as d, createReefPairingApproval as f, matchesReefDeliveryBinding as g, listReefPeerTrust as h, REEF_TRUST_STORE_NAMESPACE as i, ReefPeerStateSchema as l, isReefPairingApprovalToken as m, REEF_DELIVERY_STORE_OPTIONS as n, ReefOutboundDeliveryBindingSchema as o, currentReefDeliveries as p, REEF_TRUST_STORE_MAX_ENTRIES as r, ReefOutboundDeliverySchema as s, MESSAGE_ID_PATTERN as t, ReefPeerTrustChangedError as u, parseReefPairingApproval as v, withoutReefOutboundRequest as w, requirePeer as x, parseReefPeerState as y };
