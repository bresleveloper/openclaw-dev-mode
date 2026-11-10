import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { lt as createThread, pt as getChannelMessage, t as discord_exports } from "./discord-BMD-JiVS.mjs";
import { d as resolveDiscordReplyDeliveryPlan, f as resolveDiscordReplyTarget, g as sanitizeDiscordThreadName, h as resolveDiscordThreadStarter, j as resolveDiscordMessageChannelId, m as resolveDiscordThreadParentInfo, p as resolveDiscordThreadChannel } from "./transcripts-source-8RDQrSVb.mjs";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { buildAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Routes } from "discord-api-types/v10";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveChannelModelOverride } from "openclaw/plugin-sdk/model-session-runtime";
import { generateConversationLabel } from "openclaw/plugin-sdk/reply-dispatch-runtime";
//#region extensions/discord/src/monitor/thread-title.ts
const DEFAULT_THREAD_TITLE_TIMEOUT_MS = 6e4;
const MAX_THREAD_TITLE_SOURCE_CHARS = 600;
const MAX_THREAD_TITLE_CHANNEL_NAME_CHARS = 120;
const MAX_THREAD_TITLE_CHANNEL_DESCRIPTION_CHARS = 320;
const DISCORD_THREAD_TITLE_SYSTEM_PROMPT = "Generate a concise Discord thread title (3-6 words) in sentence case: capitalize only the first word and words that are always capitalized. Return only the title. Use channel context when provided and avoid redundant channel-name words unless needed for clarity.";
async function generateThreadTitle(params) {
	const sourceText = params.messageText.trim();
	if (!sourceText) return null;
	try {
		const userMessage = buildThreadTitleCompletionUserMessage({
			sourceText,
			channelName: params.channelName,
			channelDescription: params.channelDescription
		});
		const generated = await generateConversationLabel({
			cfg: params.cfg,
			agentId: params.agentId,
			userMessage,
			prompt: DISCORD_THREAD_TITLE_SYSTEM_PROMPT,
			...params.modelRef ? { modelRef: params.modelRef } : {},
			timeoutMs: Math.max(100, Math.floor(params.timeoutMs ?? DEFAULT_THREAD_TITLE_TIMEOUT_MS)),
			maxLength: MAX_THREAD_TITLE_SOURCE_CHARS
		});
		return generated ? normalizeGeneratedThreadTitle(generated) : null;
	} catch (err) {
		logVerbose(`thread-title: title generation failed for agent ${params.agentId}: ${String(err)}`);
		return null;
	}
}
function buildThreadTitleCompletionUserMessage(params) {
	const sourceText = truncateThreadTitleText(params.sourceText, MAX_THREAD_TITLE_SOURCE_CHARS);
	const channelName = normalizeTitleContextField(params.channelName, MAX_THREAD_TITLE_CHANNEL_NAME_CHARS);
	const channelDescription = normalizeTitleContextField(params.channelDescription, MAX_THREAD_TITLE_CHANNEL_DESCRIPTION_CHARS);
	return [
		channelName ? `Channel: ${channelName}` : void 0,
		channelDescription ? `Channel description: ${channelDescription}` : void 0,
		`Message:\n${sourceText}`
	].filter(Boolean).join("\n\n");
}
function truncateThreadTitleText(text, maxChars) {
	if (text.length <= maxChars) return text;
	return `${truncateUtf16Safe(text, maxChars)}...`;
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
//#endregion
//#region extensions/discord/src/monitor/threading.auto-thread.ts
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
		createdThreadId,
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
			if (existingThreadId) {
				logVerbose(`discord: autoThread reusing existing thread ${existingThreadId} on ${messageChannelId}/${params.message.id}`);
				return existingThreadId;
			}
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
		if (createdId && params.channelConfig?.autoThreadName === "generated" && params.cfg && params.agentId) {
			const modelRef = resolveDiscordThreadTitleModelRef({
				cfg: params.cfg,
				channel: params.channel,
				agentId: params.agentId,
				threadId: createdId,
				messageChannelId,
				channelName: params.channelName
			});
			maybeRenameDiscordAutoThread({
				client: params.client,
				threadId: createdId,
				currentName: threadName,
				fallbackId: params.message.id,
				sourceText: rawThreadSource,
				modelRef,
				channelName: params.channelName,
				channelDescription: params.channelDescription,
				cfg: params.cfg,
				agentId: params.agentId
			});
		}
		return createdId || void 0;
	} catch (err) {
		logVerbose(`discord: autoThread creation failed for ${messageChannelId}/${params.message.id}: ${String(err)}`);
		return findExistingThread();
	}
}
function resolveDiscordThreadTitleModelRef(params) {
	const channel = params.channel?.trim();
	if (!channel) return;
	const parentSessionKey = buildAgentSessionKey({
		agentId: params.agentId,
		channel,
		peer: {
			kind: "channel",
			id: params.messageChannelId
		}
	});
	const channelLabel = params.channelName?.trim();
	const groupChannel = channelLabel ? `#${channelLabel}` : void 0;
	return resolveChannelModelOverride({
		cfg: params.cfg,
		channel,
		groupId: params.threadId,
		groupChatType: "channel",
		groupChannel,
		groupSubject: groupChannel,
		parentSessionKey
	})?.model;
}
async function maybeRenameDiscordAutoThread(params) {
	try {
		const fallbackName = sanitizeDiscordThreadName("", params.fallbackId);
		const generated = await generateThreadTitle({
			...params,
			messageText: params.sourceText
		});
		if (!generated) return;
		const nextName = sanitizeDiscordThreadName(generated, params.fallbackId);
		if (!nextName || nextName === params.currentName || nextName === fallbackName) return;
		await params.client.rest.patch(Routes.channel(params.threadId), { body: { name: nextName } });
	} catch (err) {
		logVerbose(`discord: autoThread rename failed for ${params.threadId}: ${String(err)}`);
	}
}
//#endregion
//#region extensions/discord/src/monitor/threading.ts
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
//#endregion
export { resolveDiscordAutoThreadReplyPlan as n, threading_exports as t };
