import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { E as parseRawSessionConversationRef, O as parseThreadSessionSuffix } from "./session-key-CSDERtm3.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { a as resolveChannelEntryMatchWithFallback, n as buildChannelKeyCandidates, r as normalizeChannelSlug } from "./channel-config-B_ubM5Go.mjs";
import { n as resolveSessionConversationRef, t as resolveSessionConversation } from "./session-conversation-DnUQmZJM.mjs";
//#region src/channels/model-overrides.ts
function resolveProviderEntry(modelByChannel, channel) {
	const normalized = normalizeMessageChannel(channel) ?? normalizeOptionalLowercaseString(channel) ?? "";
	return modelByChannel?.[normalized] ?? modelByChannel?.[Object.keys(modelByChannel ?? {}).find((key) => {
		return (normalizeMessageChannel(key) ?? normalizeOptionalLowercaseString(key) ?? "") === normalized;
	}) ?? ""];
}
function buildChannelCandidates(params) {
	const normalizedChannel = normalizeMessageChannel(params.channel ?? "") ?? normalizeOptionalLowercaseString(params.channel);
	const groupId = normalizeOptionalString(params.groupId);
	const rawParentConversation = parseRawSessionConversationRef(params.parentSessionKey);
	const parentOverrideFallbacks = (normalizedChannel ? getChannelPlugin(normalizedChannel) : void 0)?.conversationBindings?.buildModelOverrideParentCandidates?.({ parentConversationId: rawParentConversation?.rawId }) ?? [];
	const sessionConversation = resolveSessionConversationRef(params.parentSessionKey, { bundledFallback: parentOverrideFallbacks.length === 0 });
	const groupConversationKind = normalizeChatType(params.groupChatType ?? void 0) === "channel" || sessionConversation?.kind === "channel" ? "channel" : "group";
	const groupConversation = resolveSessionConversation({
		channel: normalizedChannel ?? "",
		kind: groupConversationKind,
		rawId: groupId ?? ""
	});
	const groupChannel = normalizeOptionalString(params.groupChannel);
	const groupSubject = normalizeOptionalString(params.groupSubject);
	const channelBare = groupChannel ? groupChannel.replace(/^#/, "") : void 0;
	const subjectBare = groupSubject ? groupSubject.replace(/^#/, "") : void 0;
	const channelSlug = channelBare ? normalizeChannelSlug(channelBare) : void 0;
	const subjectSlug = subjectBare ? normalizeChannelSlug(subjectBare) : void 0;
	return {
		keys: buildChannelKeyCandidates(groupId, sessionConversation?.rawId, ...groupConversation?.parentConversationCandidates ?? [], ...sessionConversation?.parentConversationCandidates ?? [], ...parentOverrideFallbacks),
		parentKeys: buildChannelKeyCandidates(groupChannel, channelBare, channelSlug, groupSubject, subjectBare, subjectSlug)
	};
}
function buildGenericParentOverrideCandidates(sessionKey) {
	const raw = parseRawSessionConversationRef(sessionKey);
	if (!raw) return [];
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(raw.rawId);
	return buildChannelKeyCandidates(threadId ? baseSessionKey : raw.rawId);
}
function expandPeerIds(ids, channel) {
	const channelPrefix = channel.toLowerCase() + ":";
	const expanded = [];
	for (const id of ids) if (id != null) {
		expanded.push(id);
		if (id.toLowerCase().startsWith(channelPrefix)) expanded.push(id.slice(channelPrefix.length));
	}
	return expanded;
}
function resolveChannelModelOverride(params) {
	const channel = normalizeOptionalString(params.channel);
	if (!channel) return null;
	const modelByChannel = params.cfg.channels?.modelByChannel;
	if (!modelByChannel) return null;
	const providerEntries = resolveProviderEntry(modelByChannel, channel);
	if (!providerEntries) return null;
	const resolveMatch = (keys, parentKeys = []) => {
		const match = resolveChannelEntryMatchWithFallback({
			entries: providerEntries,
			keys,
			parentKeys,
			wildcardKey: "*",
			normalizeKey: (value) => normalizeOptionalLowercaseString(value) ?? ""
		});
		const model = normalizeOptionalString(match.entry ?? match.wildcardEntry);
		return model ? {
			channel: normalizeMessageChannel(channel) ?? normalizeOptionalLowercaseString(channel) ?? "",
			model,
			matchKey: match.matchKey,
			matchSource: match.matchSource
		} : null;
	};
	if (normalizeChatType(params.groupChatType ?? void 0) === "direct") {
		const directKeys = buildChannelKeyCandidates(params.groupId, ...expandPeerIds(params.directUserIds ?? [], channel), ...buildGenericParentOverrideCandidates(params.parentSessionKey));
		const directMatch = directKeys.length > 0 ? resolveMatch(directKeys) : null;
		if (directMatch) return directMatch;
	}
	const { keys, parentKeys } = buildChannelCandidates(params);
	return resolveMatch(keys, parentKeys);
}
//#endregion
export { resolveChannelModelOverride as t };
