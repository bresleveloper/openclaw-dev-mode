import { l as normalizeE164 } from "./utils-BApvfmPs.js";
import { r as jidToE164 } from "./text-runtime-DshxRpTA.js";
//#region extensions/whatsapp/src/identity.ts
const WHATSAPP_LID_RE = /@(lid|hosted\.lid)$/i;
function normalizeDeviceScopedJid(jid) {
	return jid ? jid.replace(/:\d+/, "") : null;
}
function isLidJid(jid) {
	return Boolean(jid && WHATSAPP_LID_RE.test(jid));
}
function resolveComparableIdentity(identity, authDir) {
	const rawJid = normalizeDeviceScopedJid(identity?.jid);
	const lid = normalizeDeviceScopedJid(identity?.lid) ?? (isLidJid(rawJid) ? rawJid : null);
	const jid = rawJid && !isLidJid(rawJid) ? rawJid : null;
	const e164 = identity?.e164 != null ? normalizeE164(identity.e164) : (jid ? jidToE164(jid, authDir ? { authDir } : void 0) : null) ?? (lid ? jidToE164(lid, authDir ? { authDir } : void 0) : null);
	return {
		...identity,
		jid,
		lid,
		e164
	};
}
function getComparableIdentityValues(identity) {
	const resolved = resolveComparableIdentity(identity);
	return [
		resolved.e164,
		resolved.jid,
		resolved.lid
	].filter((value) => Boolean(value));
}
function identitiesOverlap(left, right) {
	const leftValues = new Set(getComparableIdentityValues(left));
	if (leftValues.size === 0) return false;
	return getComparableIdentityValues(right).some((value) => leftValues.has(value));
}
function getSenderIdentity(msg, authDir) {
	return resolveComparableIdentity(msg.platform.sender ?? {
		jid: msg.platform.senderJid ?? null,
		e164: msg.platform.senderE164 ?? null,
		name: msg.platform.senderName ?? null
	}, authDir);
}
function getSelfIdentity(msg, authDir) {
	return resolveComparableIdentity(msg.platform.self ?? {
		jid: msg.platform.selfJid ?? null,
		lid: msg.platform.selfLid ?? null,
		e164: msg.platform.selfE164 ?? null
	}, authDir);
}
function getReplyContext(msg, authDir) {
	if (msg.quote?.context) return {
		...msg.quote.context,
		sender: resolveComparableIdentity(msg.quote.context.sender, authDir)
	};
	if (!msg.quote?.body) return null;
	return {
		id: msg.quote.id,
		body: msg.quote.body,
		sender: resolveComparableIdentity({
			jid: msg.quote.sender?.jid ?? null,
			e164: msg.quote.sender?.e164 ?? null,
			label: msg.quote.sender?.displayName ?? null
		}, authDir)
	};
}
function getMentionJids(msg) {
	return msg.group?.mentions?.jids ?? [];
}
function getMentionIdentities(msg, authDir) {
	return getMentionJids(msg).map((jid) => resolveComparableIdentity({ jid }, authDir));
}
function getPrimaryIdentityId(identity) {
	return identity?.e164 || identity?.jid?.trim() || identity?.lid || null;
}
//#endregion
export { getSelfIdentity as a, resolveComparableIdentity as c, getReplyContext as i, getMentionIdentities as n, getSenderIdentity as o, getPrimaryIdentityId as r, identitiesOverlap as s, getComparableIdentityValues as t };
