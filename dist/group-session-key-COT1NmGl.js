import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { h as resolveThreadSessionKeys } from "./session-key-VWT_xzM9.js";
import "./routing-D2F-kIi9.js";
import { r as jidToE164 } from "./targets-runtime-C-jSLN54.js";
import "./text-runtime-CEV-_K9a.js";
//#region extensions/whatsapp/src/quoted-message.ts
const CACHE_TTL_MS = 600 * 1e3;
const MAX_ENTRIES = 500;
const cache = /* @__PURE__ */ new Map();
function makeCacheKey(accountId, remoteJid, messageId) {
	return `${accountId}:${remoteJid}:${messageId}`;
}
function cacheInboundMessageMeta(accountId, remoteJid, messageId, meta) {
	if (!accountId || !messageId || !remoteJid) return;
	if (cache.size >= MAX_ENTRIES) {
		const oldest = cache.keys().next().value;
		if (oldest) cache.delete(oldest);
	}
	cache.set(makeCacheKey(accountId, remoteJid, messageId), {
		...meta,
		ts: Date.now()
	});
}
function lookupInboundMessageMeta(accountId, remoteJid, messageId) {
	const cacheKey = makeCacheKey(accountId, remoteJid, messageId);
	const entry = cache.get(cacheKey);
	if (!entry) return;
	if (Date.now() - entry.ts > CACHE_TTL_MS) {
		cache.delete(cacheKey);
		return;
	}
	return {
		participant: entry.participant,
		participantE164: entry.participantE164,
		body: entry.body,
		fromMe: entry.fromMe
	};
}
function normalizeComparableJid(jid) {
	return jid?.trim().replace(/:\d+/, "").toLowerCase() || void 0;
}
function isGroupJid(jid) {
	return Boolean(jid && jid.endsWith("@g.us"));
}
function areComparableE164sEqual(left, right) {
	const normalizedLeft = left?.trim();
	const normalizedRight = right?.trim();
	if (!normalizedLeft || !normalizedRight) return false;
	return normalizedLeft === normalizedRight;
}
function areComparableJidsEqual(left, right) {
	const normalizedLeft = normalizeComparableJid(left);
	const normalizedRight = normalizeComparableJid(right);
	if (!normalizedLeft || !normalizedRight) return false;
	if (normalizedLeft === normalizedRight) return true;
	const leftE164 = jidToE164(normalizedLeft);
	const rightE164 = jidToE164(normalizedRight);
	return Boolean(leftE164 && rightE164 && leftE164 === rightE164);
}
function matchesQuotedConversationTarget(targetJid, candidate) {
	if (areComparableJidsEqual(targetJid, candidate.remoteJid)) return true;
	if (isGroupJid(targetJid) || isGroupJid(candidate.remoteJid)) return false;
	return areComparableJidsEqual(targetJid, candidate.participant) || areComparableE164sEqual(jidToE164(targetJid) ?? void 0, candidate.participantE164);
}
function lookupInboundMessageMetaForTarget(accountId, targetJid, messageId) {
	if (!accountId || !messageId || !targetJid) return;
	const exact = lookupInboundMessageMeta(accountId, targetJid, messageId);
	if (exact) return {
		remoteJid: targetJid,
		participant: exact.participant,
		participantE164: exact.participantE164,
		body: exact.body,
		fromMe: exact.fromMe
	};
	const prefix = `${accountId}:`;
	const suffix = `:${messageId}`;
	let matched;
	for (const [cacheKey, entry] of cache.entries()) {
		if (!cacheKey.startsWith(prefix) || !cacheKey.endsWith(suffix)) continue;
		if (Date.now() - entry.ts > CACHE_TTL_MS) {
			cache.delete(cacheKey);
			continue;
		}
		const candidate = {
			remoteJid: cacheKey.slice(prefix.length, cacheKey.length - suffix.length),
			participant: entry.participant,
			participantE164: entry.participantE164,
			body: entry.body,
			fromMe: entry.fromMe
		};
		if (!matchesQuotedConversationTarget(targetJid, candidate)) continue;
		if (matched) return;
		matched = candidate;
	}
	return matched;
}
function buildQuotedMessageOptions(params) {
	const id = params.messageId?.trim();
	const remoteJid = params.remoteJid?.trim();
	if (!id || !remoteJid) return;
	return { quoted: {
		key: {
			remoteJid,
			id,
			fromMe: params.fromMe ?? false,
			participant: params.participant
		},
		message: { conversation: params.messageText ?? "" }
	} };
}
//#endregion
//#region extensions/whatsapp/src/group-session-key.ts
function resolveWhatsAppGroupAccountThreadId(accountId) {
	return `whatsapp-account-${normalizeAccountId(accountId)}`;
}
function resolveWhatsAppGroupSessionKey(params) {
	const accountId = normalizeAccountId(params.accountId);
	if (accountId === "default" || !params.sessionKey.includes(":group:")) return params.sessionKey;
	return resolveThreadSessionKeys({
		baseSessionKey: params.sessionKey,
		threadId: resolveWhatsAppGroupAccountThreadId(accountId)
	}).sessionKey;
}
function resolveWhatsAppLegacyGroupSessionKey(params) {
	const accountId = normalizeAccountId(params.accountId);
	if (!accountId || accountId === "default" || !params.sessionKey.includes(":group:")) return null;
	const suffix = `:thread:${resolveWhatsAppGroupAccountThreadId(accountId)}`;
	return params.sessionKey.endsWith(suffix) ? params.sessionKey.slice(0, -suffix.length) : null;
}
function resolveWhatsAppGroupSessionRoute(route) {
	const sessionKey = resolveWhatsAppGroupSessionKey(route);
	if (sessionKey === route.sessionKey) return route;
	return {
		...route,
		sessionKey
	};
}
//#endregion
export { cacheInboundMessageMeta as a, buildQuotedMessageOptions as i, resolveWhatsAppGroupSessionRoute as n, lookupInboundMessageMeta as o, resolveWhatsAppLegacyGroupSessionKey as r, lookupInboundMessageMetaForTarget as s, resolveWhatsAppGroupSessionKey as t };
