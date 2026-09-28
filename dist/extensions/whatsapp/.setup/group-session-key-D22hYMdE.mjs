import { a as resolveWhatsAppAccount } from "./accounts-D_NGDjCx.mjs";
import { c as normalizeWhatsAppTarget } from "./normalize-target-BGra1ZnM.mjs";
import "./normalize-DdsROMMa.mjs";
import { r as jidToE164 } from "./targets-runtime-RBjx3pg_.mjs";
import "./text-runtime-CHl0iPYe.mjs";
import { formatMediaPlaceholderText } from "openclaw/plugin-sdk/channel-inbound";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import { isHostedLidUser, isHostedPnUser, isLidUser, isPnUser } from "baileys";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
//#region extensions/whatsapp/src/approval-auth.ts
function normalizeWhatsAppApproverId(value) {
	const normalized = normalizeWhatsAppTarget(String(value));
	if (!normalized || normalized.endsWith("@g.us")) return;
	return normalized;
}
function normalizeWhatsAppApproverEntry(value) {
	return String(value).trim() === "*" ? "*" : normalizeWhatsAppApproverId(value);
}
const whatsappApproval = createChannelApprovalAuth({
	channelLabel: "WhatsApp",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveWhatsAppAccount({
			cfg,
			accountId
		}).allowFrom };
	},
	normalizeApprover: normalizeWhatsAppApproverEntry,
	normalizeSenderId: normalizeWhatsAppApproverId,
	isWildcardAuthorized: ({ purpose, approvers }) => purpose === "action" && approvers.includes("*")
});
const getWhatsAppApprovalApprovers = whatsappApproval.resolveApprovers;
const whatsappApprovalAuth = whatsappApproval.approvalAuth;
//#endregion
//#region extensions/whatsapp/src/quoted-message.ts
const CACHE_TTL_MS = 6e5;
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
		media: entry.media,
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
		media: exact.media,
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
			media: entry.media,
			fromMe: entry.fromMe
		};
		if (!matchesQuotedConversationTarget(targetJid, candidate)) continue;
		if (matched) return;
		matched = candidate;
	}
	return matched;
}
function resolveQuotedRemoteJid(params) {
	const destinationJid = params.destinationJid?.trim();
	const requestedJid = params.requestedJid?.trim();
	const lookupTargetJid = params.lookupTargetJid?.trim();
	if (!destinationJid || !requestedJid) return params.quotedRemoteJid;
	if (params.quotedRemoteJid !== requestedJid && (!lookupTargetJid || lookupTargetJid !== requestedJid)) return params.quotedRemoteJid;
	const destinationIsPn = isPnUser(destinationJid) || isHostedPnUser(destinationJid);
	const destinationIsLid = isLidUser(destinationJid) || isHostedLidUser(destinationJid);
	const quotedIsPn = isPnUser(params.quotedRemoteJid) || isHostedPnUser(params.quotedRemoteJid);
	const quotedIsLid = isLidUser(params.quotedRemoteJid) || isHostedLidUser(params.quotedRemoteJid);
	return destinationIsPn && quotedIsLid || destinationIsLid && quotedIsPn ? destinationJid : params.quotedRemoteJid;
}
function buildQuotedMessageOptions(params) {
	const id = params.messageId?.trim();
	const quotedRemoteJid = params.remoteJid?.trim();
	const previewText = [params.messageText, formatMediaPlaceholderText(params.media ? [params.media] : [])].filter(Boolean).join("\n");
	if (!id || !quotedRemoteJid || !previewText) return;
	return { quoted: {
		key: {
			remoteJid: resolveQuotedRemoteJid({
				destinationJid: params.destinationJid,
				lookupTargetJid: params.lookupTargetJid,
				quotedRemoteJid,
				requestedJid: params.requestedJid
			}),
			id,
			fromMe: params.fromMe ?? false,
			participant: params.participant
		},
		message: { conversation: previewText }
	} };
}
//#endregion
//#region extensions/whatsapp/src/group-session-key.ts
function resolveWhatsAppGroupAccountThreadId(accountId) {
	return `whatsapp-account-${normalizeAccountId(accountId)}`;
}
function resolveWhatsAppGroupSessionKey(params) {
	const accountId = normalizeAccountId(params.accountId);
	if (accountId === DEFAULT_ACCOUNT_ID || !params.sessionKey.includes(":group:")) return params.sessionKey;
	return resolveThreadSessionKeys({
		baseSessionKey: params.sessionKey,
		threadId: resolveWhatsAppGroupAccountThreadId(accountId)
	}).sessionKey;
}
function resolveWhatsAppLegacyGroupSessionKey(params) {
	const accountId = normalizeAccountId(params.accountId);
	if (!accountId || accountId === DEFAULT_ACCOUNT_ID || !params.sessionKey.includes(":group:")) return null;
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
export { cacheInboundMessageMeta as a, getWhatsAppApprovalApprovers as c, buildQuotedMessageOptions as i, whatsappApprovalAuth as l, resolveWhatsAppGroupSessionRoute as n, lookupInboundMessageMeta as o, resolveWhatsAppLegacyGroupSessionKey as r, lookupInboundMessageMetaForTarget as s, resolveWhatsAppGroupSessionKey as t };
