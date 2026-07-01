import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as sanitizeAssistantVisibleTextWithProfile, t as sanitizeAssistantVisibleText } from "./assistant-visible-text-C9MYLVs-.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-CBQ2d2jT.js";
import { t as buildOutboundSessionContext } from "./session-context-BWvkIb6x.js";
import { s as formatReasoningMessage } from "./embedded-agent-utils-B9lC4_IJ.js";
import { r as stripPlainTextToolCallBlocks } from "./tool-payload-DBiw68-o.js";
import "./string-coerce-runtime-BiZzULo_.js";
import "./text-chunking-nijjGL3g.js";
import { n as sendDurableMessageBatch } from "./channel-outbound-BNKGCEf1.js";
import { t as resolveAgentAvatar } from "./identity-avatar-BxrNJNQm.js";
import "./agent-runtime-CZ5Y3DkP.js";
import { i as resolveTimestampMs } from "./format-DZW075F7.js";
import { o as sendVoiceMessageDiscord } from "./send-DY65Iqaj.js";
import { t as sendMessageDiscord } from "./send.outbound-A8o0T42D.js";
import { t as resolveDiscordSenderIdentity } from "./sender-identity-DEWRtvA3.js";
//#region extensions/discord/src/monitor/reply-context.ts
function resolveReplyContext(message, resolveDiscordMessageText) {
	const referenced = message.referencedMessage;
	if (!referenced?.author) return null;
	const referencedText = resolveDiscordMessageText(referenced, { includeForwarded: true });
	if (!referencedText) return null;
	const sender = resolveDiscordSenderIdentity({
		author: referenced.author,
		pluralkitInfo: null
	});
	return {
		id: referenced.id,
		channelId: referenced.channelId,
		sender: sender.tag ?? sender.label ?? "unknown",
		senderId: referenced.author.id,
		senderName: referenced.author.username ?? void 0,
		senderTag: sender.tag ?? void 0,
		memberRoleIds: (() => {
			const roles = referenced.member?.roles;
			return Array.isArray(roles) ? roles.map((roleId) => roleId) : void 0;
		})(),
		body: referencedText,
		timestamp: resolveTimestampMs(referenced.timestamp)
	};
}
function buildDirectLabel(author, tagOverride) {
	return `${(tagOverride?.trim() || resolveDiscordSenderIdentity({
		author,
		pluralkitInfo: null
	}).tag) ?? "unknown"} user id:${author.id}`;
}
function buildGuildLabel(params) {
	const { guild, channelName, channelId } = params;
	return `${guild?.name ?? "Guild"} #${channelName} channel id:${channelId}`;
}
//#endregion
//#region extensions/discord/src/monitor/reply-safety.ts
const DISCORD_INTERNAL_CHANNEL_LINE_RE = /^(?:>\s*)?(?:analysis|commentary|thinking|reasoning)\s*[:=]/i;
function hasNonEmptyRecord(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0);
}
function hasInteractiveOrPresentationBlocks(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const record = value;
	if (typeof record.title === "string" && record.title.trim().length > 0) return true;
	return Array.isArray(record.blocks) && record.blocks.length > 0;
}
function hasNonTextReplyPayloadContent(payload) {
	return payload.audioAsVoice === true || hasNonEmptyRecord(payload.channelData) || hasInteractiveOrPresentationBlocks(payload.interactive) || hasInteractiveOrPresentationBlocks(payload.presentation);
}
function collapseExcessBlankLines(text) {
	return text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}
function stripDiscordInternalChannelLines(text) {
	let inFence = false;
	const kept = [];
	for (const line of text.split(/\r?\n/)) {
		if (/^\s*```/.test(line)) {
			inFence = !inFence;
			kept.push(line);
			continue;
		}
		if (!inFence && DISCORD_INTERNAL_CHANNEL_LINE_RE.test(line.trim())) continue;
		kept.push(line);
	}
	return kept.join("\n");
}
function sanitizeDiscordFrontChannelText(text) {
	return collapseExcessBlankLines(stripDiscordInternalChannelLines(stripPlainTextToolCallBlocks(sanitizeAssistantVisibleText(stripPlainTextToolCallBlocks(text))))).trim();
}
function sanitizeDiscordFrontChannelReplyPayloads(payloads, options = {}) {
	const preserveVerboseToolProgress = options.kind === "tool";
	const safePayloads = [];
	for (const payload of payloads) {
		const safeText = typeof payload.text === "string" ? preserveVerboseToolProgress ? collapseExcessBlankLines(sanitizeAssistantVisibleTextWithProfile(payload.text, "tool-progress")).trim() : sanitizeDiscordFrontChannelText(payload.text) : payload.text;
		const nextPayload = safeText === payload.text ? payload : {
			...payload,
			text: safeText || void 0
		};
		if (!resolveSendableOutboundReplyParts(nextPayload).hasContent && !hasNonTextReplyPayloadContent(nextPayload)) continue;
		safePayloads.push(nextPayload);
	}
	return safePayloads;
}
//#endregion
//#region extensions/discord/src/monitor/reply-delivery.ts
function resolveTargetChannelId(target) {
	if (!target.startsWith("channel:")) return;
	return target.slice(8).trim() || void 0;
}
function resolveBoundThreadBinding(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!params.threadBindings || !sessionKey) return;
	const targetChannelId = resolveTargetChannelId(params.target);
	if (!targetChannelId) return;
	return params.threadBindings.listBySessionKey(sessionKey).find((entry) => entry.threadId === targetChannelId);
}
function resolveBindingIdentity(cfg, binding) {
	if (!binding) return;
	const identity = { name: (`🤖 ${binding.label?.trim() || binding.agentId}`.trim() || "🤖 agent").slice(0, 80) };
	try {
		const avatar = resolveAgentAvatar(cfg, binding.agentId);
		if (avatar.kind === "remote") identity.avatarUrl = avatar.url;
	} catch {}
	return identity;
}
function createDiscordDeliveryDeps(params) {
	return {
		discord: (to, text, opts) => sendMessageDiscord(to, text, {
			...opts,
			cfg: opts?.cfg ?? params.cfg,
			token: params.token,
			rest: params.rest
		}),
		discordVoice: (to, audioPath, opts) => sendVoiceMessageDiscord(to, audioPath, {
			...opts,
			cfg: opts?.cfg ?? params.cfg,
			token: params.token,
			rest: params.rest
		})
	};
}
function resolveDiscordDeliveryOptions(params) {
	const binding = resolveBoundThreadBinding({
		threadBindings: params.threadBindings,
		sessionKey: params.sessionKey,
		target: params.target
	});
	return {
		to: binding ? `channel:${binding.channelId}` : params.target,
		threadId: binding?.threadId,
		agentId: binding?.agentId,
		identity: resolveBindingIdentity(params.cfg, binding),
		mediaAccess: params.mediaLocalRoots?.length ? { localRoots: params.mediaLocalRoots } : void 0,
		replyToMode: params.replyToMode ?? "all",
		formatting: {
			textLimit: params.textLimit,
			maxLinesPerMessage: params.maxLinesPerMessage,
			tableMode: params.tableMode,
			chunkMode: params.chunkMode
		}
	};
}
function formatDiscordReasoningPayload(payload) {
	if (payload.isReasoning !== true) return payload;
	const text = typeof payload.text === "string" ? payload.text.trim() : "";
	const nextPayload = {
		...payload,
		text: formatReasoningMessage(text)
	};
	delete nextPayload.isReasoning;
	return nextPayload;
}
async function deliverDiscordReply(params) {
	params.runtime;
	const delivery = resolveDiscordDeliveryOptions(params);
	const payloads = sanitizeDiscordFrontChannelReplyPayloads(params.replies, { kind: params.kind }).map(formatDiscordReasoningPayload);
	if (payloads.length === 0) return;
	const send = await sendDurableMessageBatch({
		cfg: params.cfg,
		channel: "discord",
		to: delivery.to,
		accountId: params.accountId,
		payloads,
		replyToId: normalizeOptionalString(params.replyToId),
		replyToMode: delivery.replyToMode,
		formatting: delivery.formatting,
		threadId: delivery.threadId,
		identity: delivery.identity,
		deps: createDiscordDeliveryDeps({
			cfg: params.cfg,
			token: params.token,
			rest: params.rest
		}),
		mediaAccess: delivery.mediaAccess,
		session: buildOutboundSessionContext({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: delivery.agentId,
			requesterAccountId: params.accountId
		})
	});
	if (send.status === "failed" || send.status === "partial_failed") throw send.error;
	if ((send.status === "sent" ? send.results : []).length === 0) throw new Error(`discord final reply produced no delivered message for ${delivery.to}`);
}
//#endregion
export { resolveReplyContext as a, buildGuildLabel as i, sanitizeDiscordFrontChannelReplyPayloads as n, buildDirectLabel as r, deliverDiscordReply as t };
