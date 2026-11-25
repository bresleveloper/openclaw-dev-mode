import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { T as createThread, k as getChannelMessage, t as discord_exports } from "./discord-cXPUdHQi.mjs";
import { d as resolveDiscordReplyDeliveryPlan, f as resolveDiscordReplyTarget, g as sanitizeDiscordThreadName, h as resolveDiscordThreadStarter, j as resolveDiscordMessageChannelId, m as resolveDiscordThreadParentInfo, p as resolveDiscordThreadChannel } from "./transcripts-source-C3F_ErM1.mjs";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { buildAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Routes } from "discord-api-types/v10";
import { truncateWithMarker } from "openclaw/plugin-sdk/string-normalization-runtime";
import { resolveChannelModelOverride } from "openclaw/plugin-sdk/model-session-runtime";
import { generateConversationLabel } from "openclaw/plugin-sdk/reply-dispatch-runtime";
// extensions/discord/src/monitor/threading.auto-thread.ts
const DEFAULT_THREAD_TITLE_TIMEOUT_MS = 6e4;
const MAX_THREAD_TITLE_SOURCE_CHARS = 600;
const MAX_THREAD_TITLE_CHANNEL_NAME_CHARS = 120;
const MAX_THREAD_TITLE_CHANNEL_DESCRIPTION_CHARS = 320;
const DISCORD_THREAD_TITLE_SYSTEM_PROMPT = "Generate a concise Discord thread title (3-6 words) in sentence case: capitalize only the first word and words that are always capitalized. Return only the title. Use channel context when provided and avoid redundant channel-name words unless needed for clarity.";
function truncateThreadTitleText(text, maxChars) {
	return truncateWithMarker(text, maxChars, {
		marker: "...",
		reserve: 0,
		trimEnd: false
	});
}
function normalizeGeneratedThreadTitle(raw) {
	return stripThreadTitleWrappers(raw.replace(/\r/g, "").split("\n").find((line) => line.trim() && !line.trim().startsWith("```")) ?? "");
}
function stripThreadTitleWrappers(raw) {
	let current = raw.trim();
	let previous = "";
	while (current && current !== previous) {
		previous = current;
		current = current.replace(/^["'`]+|["'`]+$/g, "").trim();
		for (const marker of [
			"**",
			"__",
			"*",
			"_",
			"~~"
		]) current = stripBalancedWrapper(current, marker);
	}
	return current;
}
function stripBalancedWrapper(text, marker) {
	if (text.length < marker.length * 2 + 1 || !text.startsWith(marker) || !text.endsWith(marker)) return text;
	const inner = text.slice(marker.length, text.length - marker.length);
	return inner.includes(marker) ? text : inner;
}
function normalizeTitleContextField(raw, maxChars) {
	const value = raw?.trim();
	if (!value) return;
	return truncateThreadTitleText(value.replace(/\s+/g, " "), maxChars);
}
function resolveTrimmedDiscordMessageChannelId(params) {
	return (params.messageChannelId || resolveDiscordMessageChannelId({ message: params.message })).trim();
}
function resolveDiscordAutoThreadContext(params) {
	const createdThreadId = normalizeOptionalStringifiedId(params.createdThreadId) ?? "";
	if (!createdThreadId) return null;
	const parentSessionKey = normalizeOptionalString(params.parentSessionKey) ?? "";
	if (!parentSessionKey) return null;
	const threadSessionKey = params.groupScope === "main" ? parentSessionKey : buildAgentSessionKey({
		agentId: params.agentId,
		channel: params.channel,
		peer: {
			kind: "channel",
			id: createdThreadId
		}
	});
	const inheritsDistinctParent = threadSessionKey !== parentSessionKey;
	return {
		createdThreadId,
		From: `${params.channel}:channel:${createdThreadId}`,
		To: `channel:${createdThreadId}`,
		OriginatingTo: `channel:${createdThreadId}`,
		SessionKey: threadSessionKey,
		...inheritsDistinctParent ? { ModelParentSessionKey: parentSessionKey } : {},
		...inheritsDistinctParent && params.parentInheritanceEnabled === true ? { ParentSessionKey: parentSessionKey } : {}
	};
}
async function resolveDiscordAutoThreadReplyPlan(params) {
	const messageChannelId = resolveTrimmedDiscordMessageChannelId(params);
	const originalReplyTarget = `channel:${params.threadChannel?.id ?? (messageChannelId || "unknown")}`;
	const createdThreadId = await maybeCreateDiscordAutoThread({
		...params,
		messageChannelId: messageChannelId || void 0
	});
	const deliveryPlan = resolveDiscordReplyDeliveryPlan({
		replyTarget: originalReplyTarget,
		replyToMode: params.replyToMode,
		messageId: params.message.id,
		threadChannel: params.threadChannel,
		createdThreadId
	});
	const autoThreadContext = params.isGuildMessage ? resolveDiscordAutoThreadContext({
		...params,
		createdThreadId,
		parentInheritanceEnabled: params.threadParentInheritanceEnabled
	}) : null;
	return {
		...deliveryPlan,
		autoThreadContext
	};
}
async function maybeCreateDiscordAutoThread(params) {
	if (!params.isGuildMessage || !params.channelConfig?.autoThread || params.threadChannel) return;
	if (params.channelType === discord_exports.ChannelType.GuildForum || params.channelType === discord_exports.ChannelType.GuildMedia || params.channelType === discord_exports.ChannelType.GuildVoice || params.channelType === discord_exports.ChannelType.GuildStageVoice) return;
	const messageChannelId = resolveTrimmedDiscordMessageChannelId(params);
	if (!messageChannelId) return;
	const findExistingThread = async () => {
		try {
			const existingThreadId = (await getChannelMessage(params.client.rest, messageChannelId, params.message.id))?.thread?.id;
			if (existingThreadId) return existingThreadId;
		} catch {}
	};
	try {
		const existingThreadId = await findExistingThread();
		if (existingThreadId) return existingThreadId;
		if (params.message.author?.bot) {
			logVerbose(`discord: autoThread skipped for bot-authored message ${messageChannelId}/${params.message.id}`);
			return;
		}
		const rawThreadSource = params.baseText || params.combinedBody || "Thread";
		const threadName = sanitizeDiscordThreadName(rawThreadSource, params.message.id);
		const archiveDuration = params.channelConfig?.autoArchiveDuration ? Number(params.channelConfig.autoArchiveDuration) : 60;
		const createdId = (await createThread(params.client.rest, messageChannelId, { body: {
			name: threadName,
			auto_archive_duration: archiveDuration
		} }, params.message.id))?.id || "";
		if (createdId && params.channelConfig?.autoThreadName === "generated") {
			const { client, channelName, channelDescription, cfg, agentId, channel } = params;
			const parentSessionKey = buildAgentSessionKey({
				agentId,
				channel,
				peer: {
					kind: "channel",
					id: messageChannelId
				}
			});
			const channelLabel = channelName?.trim();
			const groupChannel = channelLabel ? `#${channelLabel}` : void 0;
			const modelRef = resolveChannelModelOverride({
				cfg,
				channel,
				groupId: createdId,
				groupChatType: "channel",
				groupChannel,
				groupSubject: groupChannel,
				parentSessionKey
			})?.model;
			const fallbackId = params.message.id;
			(async () => {
				try {
					const fallbackName = sanitizeDiscordThreadName("", fallbackId);
					const sourceText = rawThreadSource.trim();
					const rawChannelName = channelName;
					const rawChannelDescription = channelDescription;
					let generated = null;
					if (sourceText) try {
						const titleSourceText = truncateThreadTitleText(sourceText, MAX_THREAD_TITLE_SOURCE_CHARS);
						const titleChannelName = normalizeTitleContextField(rawChannelName, MAX_THREAD_TITLE_CHANNEL_NAME_CHARS);
						const titleChannelDescription = normalizeTitleContextField(rawChannelDescription, MAX_THREAD_TITLE_CHANNEL_DESCRIPTION_CHARS);
						const userMessage = [
							titleChannelName ? `Channel: ${titleChannelName}` : void 0,
							titleChannelDescription ? `Channel description: ${titleChannelDescription}` : void 0,
							`Message:\n${titleSourceText}`
						].filter(Boolean).join("\n\n");
						const label = await generateConversationLabel({
							cfg,
							agentId,
							userMessage,
							prompt: DISCORD_THREAD_TITLE_SYSTEM_PROMPT,
							...modelRef ? { modelRef } : {},
							timeoutMs: DEFAULT_THREAD_TITLE_TIMEOUT_MS,
							maxLength: MAX_THREAD_TITLE_SOURCE_CHARS
						});
						generated = label ? normalizeGeneratedThreadTitle(label) : null;
					} catch (err) {
						logVerbose(`thread-title: title generation failed for agent ${agentId}: ${String(err)}`);
					}
					if (!generated) return;
					const nextName = sanitizeDiscordThreadName(generated, fallbackId);
					if (!nextName || nextName === threadName || nextName === fallbackName) return;
					await client.rest.patch(Routes.channel(createdId), { body: { name: nextName } });
				} catch (err) {
					logVerbose(`discord: autoThread rename failed for ${createdId}: ${String(err)}`);
				}
			})();
		}
		return createdId || void 0;
	} catch (err) {
		logVerbose(`discord: autoThread creation failed for ${messageChannelId}/${params.message.id}: ${String(err)}`);
		return findExistingThread();
	}
}
// extensions/discord/src/monitor/threading.ts
var threading_exports = /* @__PURE__ */ __exportAll({
	maybeCreateDiscordAutoThread: () => maybeCreateDiscordAutoThread,
	resolveDiscordAutoThreadContext: () => resolveDiscordAutoThreadContext,
	resolveDiscordAutoThreadReplyPlan: () => resolveDiscordAutoThreadReplyPlan,
	resolveDiscordReplyDeliveryPlan: () => resolveDiscordReplyDeliveryPlan,
	resolveDiscordReplyTarget: () => resolveDiscordReplyTarget,
	resolveDiscordThreadChannel: () => resolveDiscordThreadChannel,
	resolveDiscordThreadParentInfo: () => resolveDiscordThreadParentInfo,
	resolveDiscordThreadStarter: () => resolveDiscordThreadStarter,
	sanitizeDiscordThreadName: () => sanitizeDiscordThreadName
});
export { resolveDiscordAutoThreadReplyPlan as n, threading_exports as t };
