import { createAllowedChatSenderMatcher, parseChatTargetPrefixesOrThrow, resolveServicePrefixedChatTarget, resolveServicePrefixedOrChatAllowTarget } from "openclaw/plugin-sdk/channel-targets";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
//#region extensions/imessage/src/target-identifiers.ts
const BARE_CHAT_IDENTIFIER_RE = /^[0-9a-f]{32}$/i;
function isIMessagePhoneLikeHandle(raw) {
	return /^(?:tel:)?[+\d\s().-]+$/i.test(raw.trim());
}
function normalizeBareIMessageChatIdentifier(raw) {
	const trimmed = raw.trim();
	if (!BARE_CHAT_IDENTIFIER_RE.test(trimmed)) return;
	return trimmed.toLowerCase();
}
//#endregion
//#region extensions/imessage/src/normalize.ts
const SERVICE_PREFIXES$1 = [
	"imessage:",
	"sms:",
	"auto:"
];
const CHAT_TARGET_PREFIX_RE = /^(chat_id:|chatid:|chat:|chat_guid:|chatguid:|guid:|chat_identifier:|chatidentifier:|chatident:)/i;
function normalizeIMessageHandleValue(trimmed) {
	if (trimmed.includes("@")) return normalizeLowercaseStringOrEmpty(trimmed);
	const bareChatIdentifier = normalizeBareIMessageChatIdentifier(trimmed);
	if (bareChatIdentifier) return `chat_identifier:${bareChatIdentifier}`;
	const normalized = isIMessagePhoneLikeHandle(trimmed) ? normalizeE164(trimmed) : "";
	if (normalized) return normalized;
}
function normalizeIMessageHandle$1(raw, allowContactName = false) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered.startsWith("imessage:")) return normalizeIMessageHandle$1(trimmed.slice(9));
	if (lowered.startsWith("sms:")) return normalizeIMessageHandle$1(trimmed.slice(4));
	if (lowered.startsWith("auto:")) return normalizeIMessageHandle$1(trimmed.slice(5));
	if (CHAT_TARGET_PREFIX_RE.test(trimmed)) {
		const prefix = trimmed.match(CHAT_TARGET_PREFIX_RE)?.[0];
		if (!prefix) return "";
		const value = trimmed.slice(prefix.length).trim();
		return `${normalizeLowercaseStringOrEmpty(prefix)}${value}`;
	}
	return normalizeIMessageHandleValue(trimmed) ?? (allowContactName ? trimmed.replace(/\s+/g, "") : "");
}
function normalizeIMessageMessagingTarget(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	for (const prefix of SERVICE_PREFIXES$1) if (lower.startsWith(prefix)) {
		const normalizedHandle = normalizeIMessageHandle$1(trimmed.slice(prefix.length).trim(), true);
		if (!normalizedHandle) return;
		if (CHAT_TARGET_PREFIX_RE.test(normalizedHandle)) return normalizedHandle;
		return `${prefix}${normalizedHandle}`;
	}
	return normalizeIMessageHandle$1(trimmed) || void 0;
}
function looksLikeIMessageTargetId(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return false;
	if (CHAT_TARGET_PREFIX_RE.test(trimmed)) return true;
	if (normalizeBareIMessageChatIdentifier(trimmed)) return true;
	return /^(imessage:|sms:|auto:)/i.test(trimmed) || trimmed.includes("@") || isIMessagePhoneLikeHandle(trimmed) && Boolean(normalizeE164(trimmed));
}
//#endregion
//#region extensions/imessage/src/targets.ts
const CHAT_ID_PREFIXES = [
	"chat_id:",
	"chatid:",
	"chat:"
];
const CHAT_GUID_PREFIXES = [
	"chat_guid:",
	"chatguid:",
	"guid:"
];
const CHAT_IDENTIFIER_PREFIXES = [
	"chat_identifier:",
	"chatidentifier:",
	"chatident:"
];
const SERVICE_PREFIXES = [
	{
		prefix: "imessage:",
		service: "imessage"
	},
	{
		prefix: "sms:",
		service: "sms"
	},
	{
		prefix: "auto:",
		service: "auto"
	}
];
function parseServicePrefixedBareChatIdentifier(params) {
	for (const { prefix } of SERVICE_PREFIXES) {
		if (!params.lower.startsWith(prefix)) continue;
		const chatIdentifier = normalizeBareIMessageChatIdentifier(params.trimmed.slice(prefix.length));
		if (chatIdentifier) return {
			kind: "chat_identifier",
			chatIdentifier
		};
	}
}
function normalizeIMessageHandle(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered.startsWith("imessage:")) return normalizeIMessageHandle(trimmed.slice(9));
	if (lowered.startsWith("sms:")) return normalizeIMessageHandle(trimmed.slice(4));
	if (lowered.startsWith("auto:")) return normalizeIMessageHandle(trimmed.slice(5));
	for (const prefix of CHAT_ID_PREFIXES) if (lowered.startsWith(prefix)) return `chat_id:${trimmed.slice(prefix.length).trim()}`;
	for (const prefix of CHAT_GUID_PREFIXES) if (lowered.startsWith(prefix)) return `chat_guid:${trimmed.slice(prefix.length).trim()}`;
	for (const prefix of CHAT_IDENTIFIER_PREFIXES) if (lowered.startsWith(prefix)) return `chat_identifier:${trimmed.slice(prefix.length).trim()}`;
	return normalizeIMessageHandleValue(trimmed) ?? trimmed.replace(/\s+/g, "");
}
function parseIMessageTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("iMessage target is required");
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	const servicePrefixedBareChatIdentifier = parseServicePrefixedBareChatIdentifier({
		trimmed,
		lower
	});
	if (servicePrefixedBareChatIdentifier) return servicePrefixedBareChatIdentifier;
	const servicePrefixed = resolveServicePrefixedChatTarget({
		trimmed,
		lower,
		servicePrefixes: SERVICE_PREFIXES,
		chatIdPrefixes: CHAT_ID_PREFIXES,
		chatGuidPrefixes: CHAT_GUID_PREFIXES,
		chatIdentifierPrefixes: CHAT_IDENTIFIER_PREFIXES,
		parseTarget: parseIMessageTarget
	});
	if (servicePrefixed) {
		if (servicePrefixed.kind === "handle") return {
			...servicePrefixed,
			serviceExplicit: true
		};
		return servicePrefixed;
	}
	const chatTarget = parseChatTargetPrefixesOrThrow({
		trimmed,
		lower,
		chatIdPrefixes: CHAT_ID_PREFIXES,
		chatGuidPrefixes: CHAT_GUID_PREFIXES,
		chatIdentifierPrefixes: CHAT_IDENTIFIER_PREFIXES
	});
	if (chatTarget) return chatTarget;
	const bareChatIdentifier = normalizeBareIMessageChatIdentifier(trimmed);
	if (bareChatIdentifier) return {
		kind: "chat_identifier",
		chatIdentifier: bareChatIdentifier
	};
	return {
		kind: "handle",
		to: trimmed,
		service: "auto"
	};
}
function looksLikeIMessageExplicitTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (/^(imessage:|sms:|auto:)/.test(lower)) return true;
	return CHAT_ID_PREFIXES.some((prefix) => lower.startsWith(prefix)) || CHAT_GUID_PREFIXES.some((prefix) => lower.startsWith(prefix)) || CHAT_IDENTIFIER_PREFIXES.some((prefix) => lower.startsWith(prefix)) || Boolean(normalizeBareIMessageChatIdentifier(trimmed));
}
function inferIMessageTargetChatType(raw) {
	try {
		if (parseIMessageTarget(raw).kind === "handle") return "direct";
		return "group";
	} catch {
		return;
	}
}
function parseIMessageAllowTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {
		kind: "handle",
		handle: ""
	};
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	const servicePrefixed = resolveServicePrefixedOrChatAllowTarget({
		trimmed,
		lower,
		servicePrefixes: SERVICE_PREFIXES,
		parseAllowTarget: parseIMessageAllowTarget,
		chatIdPrefixes: CHAT_ID_PREFIXES,
		chatGuidPrefixes: CHAT_GUID_PREFIXES,
		chatIdentifierPrefixes: CHAT_IDENTIFIER_PREFIXES
	});
	if (servicePrefixed) return servicePrefixed;
	return {
		kind: "handle",
		handle: normalizeIMessageHandle(trimmed)
	};
}
const isAllowedIMessageSenderMatcher = createAllowedChatSenderMatcher({
	normalizeSender: normalizeIMessageHandle,
	parseAllowTarget: parseIMessageAllowTarget,
	allowConversationTargets: false
});
function isAllowedIMessageSender(params) {
	return isAllowedIMessageSenderMatcher({
		...params,
		allowConversationTargets: false
	});
}
const isAllowedIMessageReplyContextSenderMatcher = createAllowedChatSenderMatcher({
	normalizeSender: normalizeIMessageHandle,
	parseAllowTarget: parseIMessageAllowTarget,
	allowConversationTargets: true
});
function isAllowedIMessageReplyContextSender(params) {
	return isAllowedIMessageReplyContextSenderMatcher(params);
}
function formatIMessageChatTarget(chatId) {
	if (!chatId || !Number.isFinite(chatId)) return "";
	return `chat_id:${chatId}`;
}
//#endregion
export { looksLikeIMessageExplicitTargetId as a, parseIMessageTarget as c, isIMessagePhoneLikeHandle as d, isAllowedIMessageSender as i, looksLikeIMessageTargetId as l, inferIMessageTargetChatType as n, normalizeIMessageHandle as o, isAllowedIMessageReplyContextSender as r, parseIMessageAllowTarget as s, formatIMessageChatTarget as t, normalizeIMessageMessagingTarget as u };
