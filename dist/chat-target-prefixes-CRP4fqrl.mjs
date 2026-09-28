import { S as parseStrictInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { i as resolveAllowlistMatchByCandidates } from "./allowlist-match-Bt3uncl2.mjs";
//#region src/channels/plugins/chat-target-prefixes.ts
/**
* Chat target prefix parsers.
*
* Parses service-qualified chat ids, guids, identifiers, and sender allowlist targets.
*/
/**
* Checks whether a sender or current conversation matches an allowlist entry.
*/
function isAllowedParsedChatSender(params) {
	const allowFrom = normalizeStringEntries(params.allowFrom);
	const senderNormalized = params.normalizeSender(params.sender);
	const allowConversationTargets = params.allowConversationTargets === true;
	const chatId = allowConversationTargets ? params.chatId ?? void 0 : void 0;
	const chatGuid = allowConversationTargets ? normalizeOptionalString(params.chatGuid) : void 0;
	const chatIdentifier = allowConversationTargets ? normalizeOptionalString(params.chatIdentifier) : void 0;
	const normalizedAllowFrom = allowFrom.map((entry) => {
		if (entry === "*") return entry;
		const parsed = params.parseAllowTarget(entry);
		if (parsed.kind === "chat_id") return `chat_id:${parsed.chatId}`;
		if (parsed.kind === "chat_guid") return `chat_guid:${parsed.chatGuid}`;
		if (parsed.kind === "chat_identifier") return `chat_identifier:${parsed.chatIdentifier}`;
		return `handle:${parsed.handle}`;
	});
	return resolveAllowlistMatchByCandidates({
		allowList: normalizedAllowFrom,
		candidates: [
			{
				value: senderNormalized ? `handle:${senderNormalized}` : void 0,
				source: "handle"
			},
			{
				value: chatId !== void 0 ? `chat_id:${chatId}` : void 0,
				source: "chat_id"
			},
			{
				value: chatGuid ? `chat_guid:${chatGuid}` : void 0,
				source: "chat_guid"
			},
			{
				value: chatIdentifier ? `chat_identifier:${chatIdentifier}` : void 0,
				source: "chat_identifier"
			}
		]
	}).allowed;
}
function stripPrefix(value, prefix) {
	return value.slice(prefix.length).trim();
}
function startsWithAnyPrefix(value, prefixes) {
	return prefixes.some((prefix) => value.startsWith(prefix));
}
/**
* Resolves service-prefixed handle targets, delegating chat-shaped remainders.
*/
function resolveServicePrefixedTarget(params) {
	for (const { prefix, service } of params.servicePrefixes) {
		if (!params.lower.startsWith(prefix)) continue;
		const remainder = stripPrefix(params.trimmed, prefix);
		if (!remainder) throw new Error(`${prefix} target is required`);
		const remainderLower = normalizeLowercaseStringOrEmpty(remainder);
		if (params.isChatTarget(remainderLower)) return params.parseTarget(remainder);
		return {
			kind: "handle",
			to: remainder,
			service
		};
	}
	return null;
}
/**
* Resolves service-prefixed targets where chat ids should bypass handle parsing.
*/
function resolveServicePrefixedChatTarget(params) {
	const chatPrefixes = [
		...params.chatIdPrefixes,
		...params.chatGuidPrefixes,
		...params.chatIdentifierPrefixes,
		...params.extraChatPrefixes ?? []
	];
	return resolveServicePrefixedTarget({
		trimmed: params.trimmed,
		lower: params.lower,
		servicePrefixes: params.servicePrefixes,
		isChatTarget: (remainderLower) => startsWithAnyPrefix(remainderLower, chatPrefixes),
		parseTarget: params.parseTarget
	});
}
/**
* Parses chat target prefixes and throws for malformed prefixed values.
*/
function parseChatTargetPrefixesOrThrow(params) {
	for (const prefix of params.chatIdPrefixes) if (params.lower.startsWith(prefix)) {
		const value = stripPrefix(params.trimmed, prefix);
		const chatId = parseStrictInteger(value);
		if (chatId === void 0) throw new Error(`Invalid chat_id: ${value}`);
		return {
			kind: "chat_id",
			chatId
		};
	}
	for (const prefix of params.chatGuidPrefixes) if (params.lower.startsWith(prefix)) {
		const value = stripPrefix(params.trimmed, prefix);
		if (!value) throw new Error("chat_guid is required");
		return {
			kind: "chat_guid",
			chatGuid: value
		};
	}
	for (const prefix of params.chatIdentifierPrefixes) if (params.lower.startsWith(prefix)) {
		const value = stripPrefix(params.trimmed, prefix);
		if (!value) throw new Error("chat_identifier is required");
		return {
			kind: "chat_identifier",
			chatIdentifier: value
		};
	}
	return null;
}
/**
* Resolves service-prefixed allowlist targets.
*/
function resolveServicePrefixedAllowTarget(params) {
	for (const { prefix } of params.servicePrefixes) {
		if (!params.lower.startsWith(prefix)) continue;
		const remainder = stripPrefix(params.trimmed, prefix);
		if (!remainder) return {
			kind: "handle",
			handle: ""
		};
		return params.parseAllowTarget(remainder);
	}
	return null;
}
/**
* Resolves service-prefixed allow targets before falling back to chat prefixes.
*/
function resolveServicePrefixedOrChatAllowTarget(params) {
	const servicePrefixed = resolveServicePrefixedAllowTarget({
		trimmed: params.trimmed,
		lower: params.lower,
		servicePrefixes: params.servicePrefixes,
		parseAllowTarget: params.parseAllowTarget
	});
	if (servicePrefixed) return servicePrefixed;
	const chatTarget = parseChatAllowTargetPrefixes({
		trimmed: params.trimmed,
		lower: params.lower,
		chatIdPrefixes: params.chatIdPrefixes,
		chatGuidPrefixes: params.chatGuidPrefixes,
		chatIdentifierPrefixes: params.chatIdentifierPrefixes
	});
	if (chatTarget) return chatTarget;
	return null;
}
/**
* Creates a reusable sender matcher for chat-aware channel allowlists.
*/
function createAllowedChatSenderMatcher(params) {
	return (input) => isAllowedParsedChatSender({
		allowFrom: input.allowFrom,
		sender: input.sender,
		chatId: input.chatId,
		chatGuid: input.chatGuid,
		chatIdentifier: input.chatIdentifier,
		allowConversationTargets: input.allowConversationTargets ?? params.allowConversationTargets ?? false,
		normalizeSender: params.normalizeSender,
		parseAllowTarget: params.parseAllowTarget
	});
}
/**
* Parses chat target prefixes for allowlist entries, ignoring malformed values.
*/
function parseChatAllowTargetPrefixes(params) {
	for (const prefix of params.chatIdPrefixes) if (params.lower.startsWith(prefix)) {
		const value = stripPrefix(params.trimmed, prefix);
		const chatId = parseStrictInteger(value);
		if (chatId !== void 0) return {
			kind: "chat_id",
			chatId
		};
	}
	for (const prefix of params.chatGuidPrefixes) if (params.lower.startsWith(prefix)) {
		const value = stripPrefix(params.trimmed, prefix);
		if (value) return {
			kind: "chat_guid",
			chatGuid: value
		};
	}
	for (const prefix of params.chatIdentifierPrefixes) if (params.lower.startsWith(prefix)) {
		const value = stripPrefix(params.trimmed, prefix);
		if (value) return {
			kind: "chat_identifier",
			chatIdentifier: value
		};
	}
	return null;
}
//#endregion
export { resolveServicePrefixedAllowTarget as a, resolveServicePrefixedTarget as c, parseChatTargetPrefixesOrThrow as i, isAllowedParsedChatSender as n, resolveServicePrefixedChatTarget as o, parseChatAllowTargetPrefixes as r, resolveServicePrefixedOrChatAllowTarget as s, createAllowedChatSenderMatcher as t };
