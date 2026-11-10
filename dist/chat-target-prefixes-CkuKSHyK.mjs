import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { S as parseStrictInteger } from "./number-coercion-CkhMiRw8.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { i as resolveAllowlistMatchByCandidates } from "./allowlist-match-B-I22vbT.mjs";
//#region src/channels/plugins/chat-target-prefixes.ts
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
function resolveServicePrefixedChatTarget(params) {
	const chatPrefixes = [
		...params.chatIdPrefixes,
		...params.chatGuidPrefixes,
		...params.chatIdentifierPrefixes,
		...params.extraChatPrefixes ?? []
	];
	return resolveServicePrefixedTarget({
		...params,
		isChatTarget: (remainderLower) => chatPrefixes.some((prefix) => remainderLower.startsWith(prefix))
	});
}
/** Reject malformed prefixed values instead of treating them as sender handles. */
function parseChatTargetPrefixesOrThrow(params) {
	return parseChatTargetPrefixes(params, true);
}
function parseChatTargetPrefixes(params, throwOnInvalid) {
	for (const [kind, prefixes] of [
		["chat_id", params.chatIdPrefixes],
		["chat_guid", params.chatGuidPrefixes],
		["chat_identifier", params.chatIdentifierPrefixes]
	]) for (const prefix of prefixes) {
		if (!params.lower.startsWith(prefix)) continue;
		const value = stripPrefix(params.trimmed, prefix);
		if (kind === "chat_id") {
			const chatId = parseStrictInteger(value);
			if (chatId !== void 0) return {
				kind,
				chatId
			};
		} else if (value) return kind === "chat_guid" ? {
			kind,
			chatGuid: value
		} : {
			kind,
			chatIdentifier: value
		};
		if (throwOnInvalid) throw new Error(kind === "chat_id" ? `Invalid chat_id: ${value}` : `${kind} is required`);
	}
	return null;
}
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
function resolveServicePrefixedOrChatAllowTarget(params) {
	const servicePrefixed = resolveServicePrefixedAllowTarget(params);
	if (servicePrefixed) return servicePrefixed;
	return parseChatAllowTargetPrefixes(params);
}
function createAllowedChatSenderMatcher(params) {
	return (input) => isAllowedParsedChatSender({
		...input,
		allowConversationTargets: input.allowConversationTargets ?? params.allowConversationTargets ?? false,
		normalizeSender: params.normalizeSender,
		parseAllowTarget: params.parseAllowTarget
	});
}
/** Ignore malformed prefixes while checking allowlist entries. */
function parseChatAllowTargetPrefixes(params) {
	return parseChatTargetPrefixes(params, false);
}
/** Remove one of the known provider prefixes from a free-form target string. */
function stripChannelTargetPrefix(raw, ...providers) {
	const trimmed = raw.trim();
	for (const provider of providers) {
		const prefix = `${normalizeLowercaseStringOrEmpty(provider)}:`;
		if (normalizeLowercaseStringOrEmpty(trimmed).startsWith(prefix)) return trimmed.slice(prefix.length).trim();
	}
	return trimmed;
}
/** Remove generic target-kind prefixes such as `user:` or `group:`. */
function stripTargetKindPrefix(raw) {
	return raw.replace(/^(user|channel|group|conversation|room|dm):/i, "").trim();
}
//#endregion
export { resolveServicePrefixedAllowTarget as a, resolveServicePrefixedTarget as c, parseChatTargetPrefixesOrThrow as i, stripChannelTargetPrefix as l, isAllowedParsedChatSender as n, resolveServicePrefixedChatTarget as o, parseChatAllowTargetPrefixes as r, resolveServicePrefixedOrChatAllowTarget as s, createAllowedChatSenderMatcher as t, stripTargetKindPrefix as u };
