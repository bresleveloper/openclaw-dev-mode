import { normalizeLowercaseStringOrEmpty, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import { formatNormalizedAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
//#region extensions/whatsapp/src/normalize-target.ts
const WHATSAPP_USER_JID_RE = /^(\d+)(?::\d+)?@s\.whatsapp\.net$/i;
const WHATSAPP_LEGACY_USER_JID_RE = /^(\d+)@c\.us$/i;
const WHATSAPP_LID_RE = /^(\d+)@lid$/i;
const NON_WHATSAPP_PROVIDER_PREFIX_RE = /^[a-z][a-z0-9-]*:/i;
const WHATSAPP_NEWSLETTER_JID_RE = /^([0-9]+)@newsletter$/i;
function stripWhatsAppTargetPrefixes(value) {
	let candidate = value.trim();
	for (;;) {
		const before = candidate;
		candidate = candidate.replace(/^whatsapp:/i, "").trim();
		if (candidate === before) return candidate;
	}
}
function normalizeWhatsAppGroupJid(value) {
	const candidate = stripWhatsAppTargetPrefixes(value).replace(/^group:/i, "").trim();
	if (!normalizeLowercaseStringOrEmpty(candidate).endsWith("@g.us")) return null;
	const localPart = candidate.slice(0, candidate.length - 5);
	if (!localPart || localPart.includes("@")) return null;
	return /^[0-9]+(-[0-9]+)*$/.test(localPart) ? `${localPart}@g.us` : null;
}
function isWhatsAppGroupJid(value) {
	return normalizeWhatsAppGroupJid(value) !== null;
}
function isWhatsAppNewsletterJid(value) {
	const candidate = stripWhatsAppTargetPrefixes(value);
	return WHATSAPP_NEWSLETTER_JID_RE.test(candidate);
}
function isWhatsAppUserTarget(value) {
	return extractUserJidPhone(stripWhatsAppTargetPrefixes(value)) !== null;
}
function extractUserJidPhone(jid) {
	return (jid.match(WHATSAPP_USER_JID_RE) ?? jid.match(WHATSAPP_LEGACY_USER_JID_RE) ?? jid.match(WHATSAPP_LID_RE))?.[1] ?? null;
}
function normalizeWhatsAppTarget(value) {
	const candidate = stripWhatsAppTargetPrefixes(value);
	if (!candidate) return null;
	const groupJid = normalizeWhatsAppGroupJid(candidate);
	if (groupJid) return groupJid;
	const newsletterMatch = candidate.match(WHATSAPP_NEWSLETTER_JID_RE);
	if (newsletterMatch) return `${newsletterMatch[1]}@newsletter`;
	const phone = extractUserJidPhone(candidate);
	if (phone) {
		const normalized = normalizeE164(phone);
		return normalized.length > 1 ? normalized : null;
	}
	if (candidate.includes("@")) return null;
	if (NON_WHATSAPP_PROVIDER_PREFIX_RE.test(candidate)) return null;
	const normalized = normalizeE164(candidate);
	return normalized.length > 1 ? normalized : null;
}
function normalizeWhatsAppMessagingTarget(raw) {
	return normalizeWhatsAppTarget(raw) ?? void 0;
}
function normalizeWhatsAppAllowFromEntries(allowFrom) {
	return uniqueStrings(formatNormalizedAllowFromEntries({
		allowFrom,
		normalizeEntry: normalizeWhatsAppAllowFromEntry
	}));
}
function normalizeWhatsAppAllowFromEntry(entry) {
	if (entry === "*") return entry;
	const normalized = normalizeWhatsAppTarget(entry);
	if (!normalized) return null;
	return normalized.startsWith("+") ? normalized.slice(1) : normalized;
}
function looksLikeWhatsAppTargetId(raw) {
	const trimmed = raw.trim();
	return /^whatsapp:/i.test(trimmed) || normalizeWhatsAppTarget(trimmed) !== null;
}
//#endregion
export { normalizeWhatsAppAllowFromEntries as a, normalizeWhatsAppTarget as c, looksLikeWhatsAppTargetId as i, isWhatsAppNewsletterJid as n, normalizeWhatsAppAllowFromEntry as o, isWhatsAppUserTarget as r, normalizeWhatsAppMessagingTarget as s, isWhatsAppGroupJid as t };
