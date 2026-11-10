import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import { a as findChatChannelMeta } from "./registry-DqsL4UWB.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DmAdWHmL.mjs";
import { n as resolveChannelGroupRequireMention } from "./group-policy-CBIUperA.mjs";
import { t as normalizeGroupActivation } from "./group-activation-D-hOhHZQ.mjs";
//#region src/auto-reply/reply/groups.ts
/** Group/direct chat prompt context, activation, and silent-reply helpers. */
const groupsRuntimeLoader = createLazyImportLoader(() => import("./groups.runtime.js"));
async function resolveRuntimeChannelId(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return null;
	const { getChannelPlugin, normalizeChannelId } = await groupsRuntimeLoader.load();
	try {
		if (getChannelPlugin(normalized)) return normalized;
	} catch {}
	try {
		return normalizeChannelId(raw) ?? normalized;
	} catch {
		return normalized;
	}
}
/** Resolves whether a group/channel turn requires an explicit mention. */
async function resolveGroupRequireMention(params) {
	const { cfg, group } = params;
	const channel = await resolveRuntimeChannelId(group.channel);
	if (!channel) return true;
	const { groupId, groupChannel, groupSpace, accountId } = group;
	let requireMention;
	const runtime = await groupsRuntimeLoader.load();
	try {
		requireMention = runtime.getChannelPlugin(channel)?.groups?.resolveRequireMention?.({
			cfg,
			groupId,
			groupChannel,
			groupSpace,
			accountId
		});
	} catch {
		requireMention = void 0;
	}
	if (typeof requireMention === "boolean") return requireMention;
	return resolveChannelGroupRequireMention({
		cfg,
		channel,
		groupId,
		accountId
	});
}
/** Converts requireMention into the default prompt activation label. */
function defaultGroupActivation(requireMention) {
	return !requireMention ? "always" : "mention";
}
function resolveProviderLabel(rawProvider) {
	const providerKey = normalizeOptionalLowercaseString(rawProvider) ?? "";
	if (!providerKey) return "chat";
	if (isInternalMessageChannel(providerKey)) return "WebChat";
	const channelId = normalizeChatChannelId(providerKey);
	const label = channelId ? findChatChannelMeta(channelId)?.label : void 0;
	if (label) return label;
	return `${providerKey.at(0)?.toUpperCase() ?? ""}${providerKey.slice(1)}`;
}
/**
* Builds trusted group/channel delivery guidance.
*
* Room names, members, and history are rendered separately as untrusted inbound
* context. Legacy automatic delivery posts text final replies directly, but
* files/images/attachments still need message(action=send).
*/
function buildGroupChatContext(params) {
	const providerLabel = resolveProviderLabel(params.sessionCtx.Provider);
	const provider = normalizeOptionalLowercaseString(params.sessionCtx.Provider);
	const messageToolOnly = params.sourceReplyDeliveryMode === "message_tool_only";
	const sharedChatNoun = normalizeOptionalLowercaseString(params.sessionCtx.ChatType) === "channel" ? "channel" : "group chat";
	const destinationLabel = `this ${sharedChatNoun}`;
	const lines = [`You are in a ${providerLabel} ${sharedChatNoun}.`];
	if (messageToolOnly) lines.push(`Normal final replies are private and are not automatically sent to ${destinationLabel}. To post visible output here, use the message tool with action=send; the target defaults to ${destinationLabel}.`);
	else lines.push(`Your text replies are automatically sent to ${destinationLabel} unless the current-turn context says final replies stay private. For ordinary text, do not use the message tool to send to this same destination unless the current-turn context asks for visible output via message(action=send). Use message(action=send) only when you need to send files, images, or other attachments to this same ${sharedChatNoun === "channel" ? "channel/thread" : "group/topic"}.`);
	lines.push("Be a good group participant: mostly lurk and follow the conversation; reply only when directly addressed or you can add clear value. Emoji reactions are welcome when available.");
	const channelId = normalizeChatChannelId(provider) ?? provider ?? "";
	const tableMode = getLoadedChannelPluginForRead(channelId)?.messaging?.defaultMarkdownTableMode;
	const tableGuidance = tableMode === "block" || tableMode === "off" ? "" : " Avoid Markdown tables.";
	lines.push(`Write like a human.${tableGuidance} Minimize empty lines and use normal chat conventions, not document-style spacing. Don't type literal \\n sequences; use real line breaks sparingly.`);
	lines.push("If addressed to someone else, stay silent unless invited or correcting key facts.");
	if (provider === "discord") lines.push("Discord: wrap bare URLs like <https://example.com> to suppress embeds.");
	lines.push("When subagent or session-spawn tools are available and a directly requested group-chat task will require several tool calls, prefer delegating bounded side investigations early so the channel gets a responsive path forward. Keep the critical path local, avoid subagents for simple one-step work, and only surface concise group-visible updates when they add value.");
	const canUseSilentReply = !messageToolOnly && params.silentToken && params.silentReplyPolicy !== "disallow";
	if (messageToolOnly) lines.push(`If no visible ${sharedChatNoun === "channel" ? "channel" : "group"} response is needed, do not call message(action=send).`);
	if (canUseSilentReply) lines.push(`If no text reply is needed, reply with exactly "${params.silentToken}" as the entire final answer, without commentary, punctuation, or formatting.`);
	return lines.join(" ");
}
/** Builds system prompt context for direct conversations. */
function buildDirectChatContext(params) {
	return [`You are in a ${resolveProviderLabel(params.sessionCtx.Provider)} direct conversation.`, ...params.sourceReplyDeliveryMode === "message_tool_only" ? ["Normal final replies are private and are not automatically sent to this conversation. To post visible output here, use the message tool with action=send; the target defaults to this conversation.", "If no visible direct response is needed, do not call message(action=send). Your normal final answer stays private and will not be posted to the conversation."] : ["Your replies are automatically sent to this conversation unless the current-turn context says final replies stay private."]].join(" ");
}
/** Selects the conversation guidance shared by incoming and continuation turns. */
function buildSourceConversationContext(params) {
	const chatType = normalizeOptionalLowercaseString(params.sessionCtx.ChatType);
	return chatType === "direct" || chatType === "dm" ? buildDirectChatContext(params) : chatType === "group" || chatType === "channel" ? buildGroupChatContext(params) : "";
}
/** Builds the channel-specific group intro injected into the system prompt. */
function buildGroupIntro(params) {
	if ((normalizeGroupActivation(params.activation) ?? params.defaultActivation) === "always") return "Activation: always-on (you receive every group message). You see every message; most need no response. When you do reply, address the specific sender noted in the message context.";
	return "Activation: trigger-only (you are invoked only when explicitly mentioned; recent context may be included). Address the specific sender noted in the message context.";
}
//#endregion
export { resolveGroupRequireMention as i, buildSourceConversationContext as n, defaultGroupActivation as r, buildGroupIntro as t };
