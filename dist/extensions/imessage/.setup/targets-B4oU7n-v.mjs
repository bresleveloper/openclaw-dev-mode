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
const IMESSAGE_SERVICE_PREFIXES = [
	"imessage",
	"sms",
	"auto"
].map((service) => ({
	service,
	prefix: `${service}:`
}));
const IMESSAGE_CHAT_TARGET_PREFIXES = {
	chatIdPrefixes: [
		"chat_id:",
		"chatid:",
		"chat:"
	],
	chatGuidPrefixes: [
		"chat_guid:",
		"chatguid:",
		"guid:"
	],
	chatIdentifierPrefixes: [
		"chat_identifier:",
		"chatidentifier:",
		"chatident:"
	]
};
const IMESSAGE_CHAT_TARGET_PREFIX_RE = new RegExp(`^(${Object.values(IMESSAGE_CHAT_TARGET_PREFIXES).flat().join("|")})`, "i");
function normalizeIMessageHandleValue(trimmed) {
	if (trimmed.includes("@")) return normalizeLowercaseStringOrEmpty(trimmed);
	const bareChatIdentifier = normalizeBareIMessageChatIdentifier(trimmed);
	if (bareChatIdentifier) return `chat_identifier:${bareChatIdentifier}`;
	const normalized = isIMessagePhoneLikeHandle(trimmed) ? normalizeE164(trimmed) : "";
	if (normalized) return normalized;
}
function normalizeIMessageHandleInput(raw, mode, allowContactName = false) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	for (const { prefix } of IMESSAGE_SERVICE_PREFIXES) if (lowered.startsWith(prefix)) return normalizeIMessageHandleInput(trimmed.slice(prefix.length), mode);
	const prefix = trimmed.match(IMESSAGE_CHAT_TARGET_PREFIX_RE)?.[0];
	if (prefix) {
		const value = trimmed.slice(prefix.length).trim();
		const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
		const canonicalPrefix = IMESSAGE_CHAT_TARGET_PREFIXES.chatIdPrefixes.includes(normalizedPrefix) ? "chat_id:" : IMESSAGE_CHAT_TARGET_PREFIXES.chatGuidPrefixes.includes(normalizedPrefix) ? "chat_guid:" : "chat_identifier:";
		return `${mode === "sender" ? canonicalPrefix : normalizedPrefix}${value}`;
	}
	return normalizeIMessageHandleValue(trimmed) ?? (mode === "sender" || allowContactName ? trimmed.replace(/\s+/g, "") : "");
}
function normalizeIMessageMessagingTarget(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	for (const { prefix } of IMESSAGE_SERVICE_PREFIXES) if (lower.startsWith(prefix)) {
		const normalizedHandle = normalizeIMessageHandleInput(trimmed.slice(prefix.length).trim(), "target", true);
		if (!normalizedHandle) return;
		if (IMESSAGE_CHAT_TARGET_PREFIX_RE.test(normalizedHandle)) return normalizedHandle;
		return `${prefix}${normalizedHandle}`;
	}
	return normalizeIMessageHandleInput(trimmed, "target") || void 0;
}
function looksLikeIMessageTargetId(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return false;
	if (IMESSAGE_CHAT_TARGET_PREFIX_RE.test(trimmed)) return true;
	if (normalizeBareIMessageChatIdentifier(trimmed)) return true;
	return /^(imessage:|sms:|auto:)/i.test(trimmed) || trimmed.includes("@") || isIMessagePhoneLikeHandle(trimmed) && Boolean(normalizeE164(trimmed));
}
//#endregion
//#region extensions/imessage/src/targets.ts
function parseServicePrefixedBareChatIdentifier(params) {
	for (const { prefix } of IMESSAGE_SERVICE_PREFIXES) {
		if (!params.lower.startsWith(prefix)) continue;
		const chatIdentifier = normalizeBareIMessageChatIdentifier(params.trimmed.slice(prefix.length));
		if (chatIdentifier) return {
			kind: "chat_identifier",
			chatIdentifier
		};
	}
}
function normalizeIMessageHandle(raw) {
	return normalizeIMessageHandleInput(raw, "sender");
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
		servicePrefixes: IMESSAGE_SERVICE_PREFIXES,
		...IMESSAGE_CHAT_TARGET_PREFIXES,
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
		...IMESSAGE_CHAT_TARGET_PREFIXES
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
	return IMESSAGE_CHAT_TARGET_PREFIX_RE.test(lower) || Boolean(normalizeBareIMessageChatIdentifier(trimmed));
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
		servicePrefixes: IMESSAGE_SERVICE_PREFIXES,
		parseAllowTarget: parseIMessageAllowTarget,
		...IMESSAGE_CHAT_TARGET_PREFIXES
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
const isAllowedIMessageReplyContextSender = createAllowedChatSenderMatcher({
	normalizeSender: normalizeIMessageHandle,
	parseAllowTarget: parseIMessageAllowTarget,
	allowConversationTargets: true
});
function formatIMessageChatTarget(chatId) {
	if (!chatId || !Number.isFinite(chatId)) return "";
	return `chat_id:${chatId}`;
}
//#endregion
export { looksLikeIMessageExplicitTargetId as a, parseIMessageTarget as c, normalizeIMessageMessagingTarget as d, isIMessagePhoneLikeHandle as f, isAllowedIMessageSender as i, IMESSAGE_CHAT_TARGET_PREFIX_RE as l, inferIMessageTargetChatType as n, normalizeIMessageHandle as o, isAllowedIMessageReplyContextSender as r, parseIMessageAllowTarget as s, formatIMessageChatTarget as t, looksLikeIMessageTargetId as u };
