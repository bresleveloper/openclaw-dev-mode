import { At as getGuild, Bt as removeGuildMember, C as withDiscordRequestAuthority, Ct as addGuildMemberRole, Dt as createGuildScheduledEvent, Et as createGuildEmoji, Ft as listGuildEmojis, Ht as timeoutGuildMember, It as listGuildRoles, Lt as listGuildScheduledEvents, Mt as getGuildVoiceState, Nt as listGuildActiveThreads, Ot as createGuildSticker, Pt as listGuildChannels, Rt as moveGuildChannels, S as readRetryAfter, St as unpinChannelMessage, Tt as createGuildChannel, Ut as __exportAll, Vt as removeGuildMemberRole, _ as DiscordError, _t as listChannelMessages, at as deleteOwnMessageReaction, b as readDiscordCode, bt as searchGuildMessages, ct as createThread, dt as editChannel, ft as editChannelMessage, gt as listChannelArchivedThreads, it as createOwnMessageReaction, jt as getGuildMember, kt as deleteChannelPermission, lt as deleteChannel, mt as getChannelMessage, ot as listMessageReactionUsers, pt as getChannel, ut as deleteChannelMessage, v as RateLimitError, vt as listChannelPins, wt as createGuildBan, x as readDiscordMessage, xt as sendChannelTyping, y as isUnknownDiscordVoiceStateError, yt as pinChannelMessage, zt as putChannelPermission } from "./discord-BXpHW-cu.mjs";
import { D as resolveDiscordEndpointAttachmentGuard, E as getDiscordEndpointRuntime, w as parseDiscordRetryAfterBodySeconds } from "./channel-type-DKnjV1XW.mjs";
import { a as recordDiscordMessageCreateAmbiguity, c as createDiscordSendReceiptFromResults, d as createReusableDiscordReplyReference, f as resolveDiscordReplyMessageId, l as createDiscordSendResult, n as classifyDiscordDeliveryFailure, o as chunkDiscordTextWithMode, r as createDiscordRetryRunner } from "./retry-BEYkDy0P.mjs";
import { C as hasAllGuildPermissionsDiscord, I as resolveDiscordClientAccountContext, K as parseAndResolveChannelRecipient, L as resolveDiscordRest, M as resolveDiscordSuppressEmbeds, N as createDiscordClient, O as createDiscordMessageNonce, R as DISCORD_REST_TIMEOUT_MS, S as fetchMemberGuildPermissionsDiscord, T as hasAnyGuildPermissionDiscord, _ as DiscordSendError, b as canViewDiscordGuildChannel, g as DISCORD_MAX_STICKER_BYTES, h as DISCORD_MAX_EVENT_COVER_BYTES, i as formatReactionEmoji, k as resolveDiscordMessageFlags, l as resolveChannelId, m as DISCORD_MAX_EMOJI_BYTES, n as buildDiscordTextChunks, o as normalizeEmojiName, p as sendDiscordText, r as buildReactionIdentifier, s as normalizeReactionEmoji, t as buildDiscordSendError, v as canManageGuildMemberRoleDiscord, w as hasAnyChannelPermissionDiscord, x as fetchChannelPermissionsDiscord, y as canManageGuildRoleDiscord } from "./send.shared-VNvWfX2T.mjs";
import { i as prepareDiscordOutboundText, n as sendPollDiscord, r as sendStickerDiscord, t as sendMessageDiscord } from "./send.outbound-QTyuFupn.mjs";
import { n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS } from "./timeouts-D86uWLt_.mjs";
import fs from "node:fs/promises";
import { ChannelType } from "discord-api-types/v10";
import crypto from "node:crypto";
import { parseStrictFiniteNumber, resolveExpiresAtMsFromDurationMs, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { formatErrorMessage as formatErrorMessage$1 } from "openclaw/plugin-sdk/error-runtime";
import { readProviderJsonResponse, readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { recordOutboundMessageIdentity } from "openclaw/plugin-sdk/channel-outbound";
import { MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS, buildOutboundMediaLoadOptions, extensionForMime, maxBytesForKind, parseFfprobeCodecAndSampleRate, runFfmpeg, runFfprobe, unlinkIfExists } from "openclaw/plugin-sdk/media-runtime";
import { loadWebMediaRaw } from "openclaw/plugin-sdk/web-media";
import { resolvePreferredOpenClawTmpDir, withTempWorkspace } from "openclaw/plugin-sdk/temp-path";
import { buildTimeoutAbortSignal } from "openclaw/plugin-sdk/extension-shared";
import path from "node:path";
import { writeExternalFileWithinRoot } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/discord/src/send.channels.ts
async function createChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = { name: payload.name };
	if (payload.type !== void 0) body.type = payload.type;
	if (payload.parentId) body.parent_id = payload.parentId;
	if (payload.topic) body.topic = payload.topic;
	if (payload.position !== void 0) body.position = payload.position;
	if (payload.nsfw !== void 0) body.nsfw = payload.nsfw;
	return await createGuildChannel(rest, payload.guildId, { body });
}
async function editChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = {};
	if (payload.name !== void 0) body.name = payload.name;
	if (payload.topic !== void 0) body.topic = payload.topic;
	if (payload.position !== void 0) body.position = payload.position;
	if (payload.parentId !== void 0) body.parent_id = payload.parentId;
	if (payload.nsfw !== void 0) body.nsfw = payload.nsfw;
	if (payload.rateLimitPerUser !== void 0) body.rate_limit_per_user = payload.rateLimitPerUser;
	if (payload.archived !== void 0) body.archived = payload.archived;
	if (payload.locked !== void 0) body.locked = payload.locked;
	if (payload.autoArchiveDuration !== void 0) body.auto_archive_duration = payload.autoArchiveDuration;
	if (payload.availableTags !== void 0) body.available_tags = payload.availableTags.map((t) => ({
		...t.id !== void 0 && { id: t.id },
		name: t.name,
		...t.moderated !== void 0 && { moderated: t.moderated },
		...t.emoji_id !== void 0 && { emoji_id: t.emoji_id },
		...t.emoji_name !== void 0 && { emoji_name: t.emoji_name }
	}));
	return await editChannel(rest, payload.channelId, { body });
}
async function deleteChannelDiscord(channelId, opts) {
	const rest = resolveDiscordRest(opts);
	await deleteChannel(rest, channelId);
	return {
		ok: true,
		channelId
	};
}
async function moveChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = [{
		id: payload.channelId,
		...payload.parentId !== void 0 && { parent_id: payload.parentId },
		...payload.position !== void 0 && { position: payload.position }
	}];
	await moveGuildChannels(rest, payload.guildId, { body });
	return { ok: true };
}
async function setChannelPermissionDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = { type: payload.targetType };
	if (payload.allow !== void 0) body.allow = payload.allow;
	if (payload.deny !== void 0) body.deny = payload.deny;
	await putChannelPermission(rest, payload.channelId, payload.targetId, { body });
	return { ok: true };
}
async function removeChannelPermissionDiscord(channelId, targetId, opts) {
	const rest = resolveDiscordRest(opts);
	await deleteChannelPermission(rest, channelId, targetId);
	return { ok: true };
}
//#endregion
//#region extensions/discord/src/send.emojis-stickers.ts
async function listGuildEmojisDiscord(guildId, opts) {
	const rest = resolveDiscordRest(opts);
	return await listGuildEmojis(rest, guildId);
}
async function uploadEmojiDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const media = await loadWebMediaRaw(payload.mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes: DISCORD_MAX_EMOJI_BYTES,
		mediaAccess: opts.mediaAccess,
		mediaLocalRoots: opts.mediaLocalRoots,
		mediaReadFile: opts.mediaReadFile
	}));
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || ![
		"image/png",
		"image/jpeg",
		"image/jpg",
		"image/gif"
	].includes(contentType)) throw new Error("Discord emoji uploads require a PNG, JPG, or GIF image");
	const image = `data:${contentType};base64,${media.buffer.toString("base64")}`;
	const roleIds = normalizeStringEntries(payload.roleIds ?? []);
	return await createGuildEmoji(rest, payload.guildId, { body: {
		name: normalizeEmojiName(payload.name, "Emoji name"),
		image,
		roles: roleIds.length ? roleIds : void 0
	} });
}
async function uploadStickerDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const media = await loadWebMediaRaw(payload.mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes: DISCORD_MAX_STICKER_BYTES,
		mediaAccess: opts.mediaAccess,
		mediaLocalRoots: opts.mediaLocalRoots,
		mediaReadFile: opts.mediaReadFile
	}));
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || ![
		"image/png",
		"image/apng",
		"application/json"
	].includes(contentType)) throw new Error("Discord sticker uploads require a PNG, APNG, or Lottie JSON file");
	return await createGuildSticker(rest, payload.guildId, {
		multipartStyle: "form",
		body: {
			name: normalizeEmojiName(payload.name, "Sticker name"),
			description: normalizeEmojiName(payload.description, "Sticker description"),
			tags: normalizeEmojiName(payload.tags, "Sticker tags"),
			files: [{
				data: media.buffer,
				fieldName: "file",
				name: media.fileName ?? "sticker",
				contentType
			}]
		}
	});
}
//#endregion
//#region extensions/discord/src/send.guild.ts
async function fetchMemberInfoDiscord(guildId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	return await getGuildMember(rest, guildId, userId);
}
async function fetchRoleInfoDiscord(guildId, opts) {
	const rest = resolveDiscordRest(opts);
	return await listGuildRoles(rest, guildId);
}
async function addRoleDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	await addGuildMemberRole(rest, payload.guildId, payload.userId, payload.roleId);
	return { ok: true };
}
async function removeRoleDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	await removeGuildMemberRole(rest, payload.guildId, payload.userId, payload.roleId);
	return { ok: true };
}
async function fetchChannelInfoDiscord(channelId, opts) {
	const rest = resolveDiscordRest(opts);
	return await getChannel(rest, channelId);
}
async function fetchGuildInfoDiscord(guildId, opts) {
	const rest = resolveDiscordRest(opts);
	return await getGuild(rest, guildId);
}
async function listGuildChannelsDiscord(guildId, opts) {
	const rest = resolveDiscordRest(opts);
	return await listGuildChannels(rest, guildId);
}
async function fetchVoiceStatusDiscord(guildId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		return await getGuildVoiceState(rest, guildId, userId);
	} catch (err) {
		if (!isUnknownDiscordVoiceStateError(err)) throw err;
		return {
			guild_id: guildId,
			user_id: userId,
			channel_id: null,
			connected: false,
			absent: true,
			reason: "unknown_voice_state"
		};
	}
}
async function listScheduledEventsDiscord(guildId, opts) {
	const rest = resolveDiscordRest(opts);
	return await listGuildScheduledEvents(rest, guildId);
}
const ALLOWED_EVENT_COVER_TYPES = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/gif"
]);
async function resolveEventCoverImage(imageUrl, opts) {
	const media = await loadWebMediaRaw(imageUrl, buildOutboundMediaLoadOptions({
		maxBytes: DISCORD_MAX_EVENT_COVER_BYTES,
		mediaAccess: opts?.mediaAccess,
		mediaLocalRoots: opts?.mediaLocalRoots,
		mediaReadFile: opts?.mediaReadFile
	}));
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || !ALLOWED_EVENT_COVER_TYPES.has(contentType)) throw new Error(`Discord event cover images must be PNG, JPG, or GIF (got ${contentType ?? "unknown"})`);
	return `data:${contentType};base64,${media.buffer.toString("base64")}`;
}
async function createScheduledEventDiscord(guildId, payload, opts) {
	const rest = resolveDiscordRest(opts);
	return await createGuildScheduledEvent(rest, guildId, payload);
}
async function timeoutMemberDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	let until = payload.until;
	if (!until && payload.durationMinutes) {
		const ms = payload.durationMinutes * 60 * 1e3;
		until = timestampMsToIsoString(resolveExpiresAtMsFromDurationMs(ms));
		if (!until) throw new Error("Discord timeout duration is outside the supported Date range");
	}
	return await timeoutGuildMember(rest, payload.guildId, payload.userId, {
		body: { communication_disabled_until: until ?? null },
		headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0
	});
}
async function kickMemberDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	await removeGuildMember(rest, payload.guildId, payload.userId, { headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0 });
	return { ok: true };
}
async function banMemberDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const deleteMessageDays = typeof payload.deleteMessageDays === "number" && Number.isFinite(payload.deleteMessageDays) ? Math.min(Math.max(Math.floor(payload.deleteMessageDays), 0), 7) : void 0;
	await createGuildBan(rest, payload.guildId, payload.userId, {
		body: deleteMessageDays !== void 0 ? { delete_message_days: deleteMessageDays } : void 0,
		headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0
	});
	return { ok: true };
}
//#endregion
//#region extensions/discord/src/send.messages.ts
const DISCORD_THREAD_TRANSPORT_ONLY_MAX_LINES = Number.MAX_SAFE_INTEGER;
function resolveDiscordThreadStarterMessageId(thread) {
	const starterMessage = "message" in thread ? thread.message : void 0;
	if (starterMessage && typeof starterMessage === "object" && "id" in starterMessage && typeof starterMessage.id === "string") return starterMessage.id;
	return thread.id;
}
function assertDiscordResponseArray(value, label) {
	if (!Array.isArray(value)) throw new Error(`Unexpected Discord response for ${label}: expected array.`);
	return value;
}
function assertDiscordResponseObject(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Unexpected Discord response for ${label}: expected object.`);
	return value;
}
function resolveDefaultThreadAutoArchiveDuration(channel) {
	if (!channel || !("default_auto_archive_duration" in channel)) return;
	return channel.default_auto_archive_duration;
}
function describeDiscordThreadInitialMessageFailure(delivery) {
	if (delivery?.failedChunkDelivery === "unknown") return delivery.deliveredChunkCount > 0 ? "Discord thread was created, but delivery of the remaining initial content could not be confirmed" : "Discord thread was created, but initial message delivery could not be confirmed";
	return delivery && delivery.deliveredChunkCount > 0 ? "Discord thread was created, but its initial content was only partially delivered" : "Discord thread was created, but sending the initial message failed";
}
var DiscordThreadInitialMessageError = class extends Error {
	constructor(thread, error, initialMessageDelivery) {
		const initialMessageError = formatErrorMessage$1(error);
		const initialMessageWarning = describeDiscordThreadInitialMessageFailure(initialMessageDelivery);
		super(`${initialMessageWarning}: ${initialMessageError}`, { cause: error });
		this.name = "DiscordThreadInitialMessageError";
		this.initialMessageDelivery = initialMessageDelivery ? {
			...initialMessageDelivery,
			deliveredMessageIds: [...initialMessageDelivery.deliveredMessageIds]
		} : void 0;
		this.initialMessageError = initialMessageError;
		this.initialMessageWarning = initialMessageWarning;
		this.thread = thread;
	}
};
async function readMessagesDiscord(channelId, query, opts) {
	const messageQuery = query ?? {};
	const rest = resolveDiscordRest(opts);
	const limit = typeof messageQuery.limit === "number" && Number.isFinite(messageQuery.limit) ? Math.min(Math.max(Math.floor(messageQuery.limit), 1), 100) : void 0;
	const params = {};
	if (limit) params.limit = limit;
	if (messageQuery.before) params.before = messageQuery.before;
	if (messageQuery.after) params.after = messageQuery.after;
	if (messageQuery.around) params.around = messageQuery.around;
	return assertDiscordResponseArray(await listChannelMessages(rest, channelId, params), "message read");
}
async function fetchMessageDiscord(channelId, messageId, opts) {
	const rest = resolveDiscordRest(opts);
	return await getChannelMessage(rest, channelId, messageId);
}
async function editMessageDiscord(channelId, messageId, payload, opts) {
	const rest = resolveDiscordRest(opts);
	return await editChannelMessage(rest, channelId, messageId, { body: {
		content: payload.content,
		...payload.flags !== void 0 ? { flags: payload.flags } : {},
		...payload.allowedMentions ? { allowed_mentions: payload.allowedMentions } : {}
	} });
}
async function deleteMessageDiscord(channelId, messageId, opts) {
	const rest = resolveDiscordRest(opts);
	await deleteChannelMessage(rest, channelId, messageId);
	return { ok: true };
}
async function pinMessageDiscord(channelId, messageId, opts) {
	const rest = resolveDiscordRest(opts);
	await pinChannelMessage(rest, channelId, messageId);
	return { ok: true };
}
async function unpinMessageDiscord(channelId, messageId, opts) {
	const rest = resolveDiscordRest(opts);
	await unpinChannelMessage(rest, channelId, messageId);
	return { ok: true };
}
async function listPinsDiscord(channelId, opts) {
	const rest = resolveDiscordRest(opts);
	return await listChannelPins(rest, channelId);
}
async function createThreadDiscord(channelId, payload, opts) {
	const assertCreateAllowed = opts.assertCreateAllowed;
	const { rest, request } = createDiscordClient(opts);
	const body = { name: payload.name };
	if (!payload.messageId && payload.type !== void 0) body.type = payload.type;
	let channel;
	if (!payload.messageId) try {
		channel = await getChannel(rest, channelId);
	} catch {}
	const archiveDuration = payload.autoArchiveMinutes ?? resolveDefaultThreadAutoArchiveDuration(channel);
	if (archiveDuration !== void 0) body.auto_archive_duration = archiveDuration;
	const isForumLike = channel?.type === ChannelType.GuildForum || channel?.type === ChannelType.GuildMedia;
	const initialMessageContent = isForumLike ? payload.content?.trim() ? payload.content : payload.name : payload.content?.trim() ? payload.content : "";
	const initialMessageChunks = buildDiscordTextChunks(initialMessageContent, { maxLinesPerMessage: DISCORD_THREAD_TRANSPORT_ONLY_MAX_LINES });
	if (isForumLike) {
		body.message = { content: initialMessageChunks[0] ?? payload.name };
		if (payload.appliedTags?.length) body.applied_tags = payload.appliedTags;
	}
	if (!payload.messageId && !isForumLike && body.type === void 0) body.type = ChannelType.PublicThread;
	const thread = await withDiscordRequestAuthority(assertCreateAllowed, () => {
		assertCreateAllowed?.();
		return createThread(rest, channelId, { body }, payload.messageId);
	});
	const followupChunks = isForumLike ? initialMessageChunks.slice(1) : initialMessageChunks;
	const deliveredMessageIds = isForumLike ? [resolveDiscordThreadStarterMessageId(thread)] : [];
	let deliveredChunkCount = isForumLike ? 1 : 0;
	if (followupChunks.length && "id" in thread) {
		const firstFollowupChunkIndex = isForumLike ? 1 : 0;
		for (const [followupIndex, content] of followupChunks.entries()) {
			let chunkMayHaveDelivered = false;
			const trackedRequest = (fn, label, options) => request(async () => {
				try {
					return await fn();
				} catch (error) {
					chunkMayHaveDelivered ||= classifyDiscordDeliveryFailure(error) === "ambiguous";
					throw error;
				}
			}, label, options);
			try {
				const result = await sendDiscordText({
					rest,
					request: trackedRequest,
					channelId: thread.id,
					text: content,
					maxLinesPerMessage: DISCORD_THREAD_TRANSPORT_ONLY_MAX_LINES
				});
				deliveredMessageIds.push(...result.platformMessageIds);
				deliveredChunkCount += 1;
			} catch (error) {
				const finalFailure = classifyDiscordDeliveryFailure(error);
				const failedChunkDelivery = chunkMayHaveDelivered || finalFailure === "ambiguous" || finalFailure === "unknown" ? "unknown" : "not_delivered";
				if (failedChunkDelivery === "unknown") recordDiscordMessageCreateAmbiguity(error);
				throw new DiscordThreadInitialMessageError(thread, error, {
					starterMessageDelivered: isForumLike,
					deliveredChunkCount,
					deliveredMessageIds,
					failedChunkDelivery,
					failedChunkIndex: firstFollowupChunkIndex + followupIndex,
					totalChunkCount: initialMessageChunks.length
				});
			}
		}
	}
	return deliveredChunkCount > 0 ? {
		...thread,
		initialMessageDelivery: {
			status: "delivered",
			starterMessageDelivered: isForumLike,
			deliveredChunkCount,
			deliveredMessageIds,
			totalChunkCount: initialMessageChunks.length
		}
	} : thread;
}
async function listThreadsDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	if (payload.includeArchived) {
		if (!payload.channelId) throw new Error("channelId required to list archived threads");
		const params = {};
		if (payload.before) params.before = payload.before;
		if (payload.limit) params.limit = payload.limit;
		return await listChannelArchivedThreads(rest, payload.channelId, params);
	}
	return await listGuildActiveThreads(rest, payload.guildId);
}
async function searchMessagesDiscord(query, opts) {
	const rest = resolveDiscordRest(opts);
	const params = new URLSearchParams();
	params.set("content", query.content);
	if (query.channelIds?.length) for (const channelId of query.channelIds) params.append("channel_id", channelId);
	if (query.authorIds?.length) for (const authorId of query.authorIds) params.append("author_id", authorId);
	if (query.limit) {
		const limit = Math.min(Math.max(Math.floor(query.limit), 1), 25);
		params.set("limit", String(limit));
	}
	const result = assertDiscordResponseObject(await searchGuildMessages(rest, query.guildId, params), "message search");
	if (result.code === 11e4) {
		const message = typeof result.message === "string" && result.message.trim() ? result.message.trim() : "Discord search index is not yet available";
		const retryAfter = parseDiscordRetryAfterBodySeconds(result.retry_after);
		const retryHint = retryAfter === void 0 ? "" : ` (retry after ${retryAfter}s)`;
		throw new Error(`Discord message search unavailable: ${message}${retryHint}`);
	}
	if (!Array.isArray(result.messages)) throw new Error("Unexpected Discord response for message search: expected messages array.");
	return result;
}
//#endregion
//#region extensions/discord/src/send.webhook.ts
const DISCORD_WEBHOOK_ERROR_BODY_LIMIT_BYTES = 8192;
const DISCORD_WEBHOOK_TIMEOUT_MS = DISCORD_REST_TIMEOUT_MS;
function coerceWebhookErrorBody(raw) {
	if (!raw) return;
	try {
		return JSON.parse(raw);
	} catch {
		return { message: truncateUtf16Safe(raw, 200) };
	}
}
function throwIfWebhookDeadlineExpired(signal) {
	if (!signal?.aborted) return;
	throw signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Discord webhook send timed out");
}
async function throwWebhookResponseError(response, signal) {
	const parsed = coerceWebhookErrorBody(await readResponseTextLimited(response, DISCORD_WEBHOOK_ERROR_BODY_LIMIT_BYTES, { chunkTimeoutMs: DISCORD_WEBHOOK_TIMEOUT_MS }).catch(() => {
		throwIfWebhookDeadlineExpired(signal);
		return "";
	}));
	if (response.status === 429) throw new RateLimitError(response, {
		message: readDiscordMessage(parsed, "Rate limited"),
		retry_after: readRetryAfter(parsed, response, 1),
		code: readDiscordCode(parsed),
		global: parsed && typeof parsed === "object" && "global" in parsed ? Boolean(parsed.global) : false
	});
	throw new DiscordError(response, parsed);
}
async function sendWebhookMessageDiscord(text, opts) {
	const webhookId = normalizeOptionalString(opts.webhookId) ?? "";
	const webhookToken = normalizeOptionalString(opts.webhookToken) ?? "";
	if (!webhookId || !webhookToken) throw new Error("Discord webhook id/token are required");
	const reply = typeof opts.replyTo === "string" ? createReusableDiscordReplyReference(normalizeOptionalString(opts.replyTo)) : opts.replyTo;
	const { account, proxyFetch } = resolveDiscordClientAccountContext({
		cfg: opts.cfg,
		accountId: opts.accountId
	});
	const { textWithMentions, textLimit } = prepareDiscordOutboundText(text, {
		cfg: opts.cfg,
		account,
		tableMode: opts.tableMode,
		textLimit: opts.chunking?.maxChars
	});
	const flags = resolveDiscordMessageFlags({ suppressEmbeds: resolveDiscordSuppressEmbeds({ configured: account.config.suppressEmbeds }) });
	const threadConversationId = opts.threadId == null ? "" : String(opts.threadId).trim();
	if (threadConversationId) recordOutboundMessageIdentity({
		channel: "discord",
		accountId: account.accountId,
		conversationId: threadConversationId,
		sourceId: webhookId
	});
	const endpoint = getDiscordEndpointRuntime();
	const restApiBaseUrl = endpoint?.descriptor.restApiBaseUrl ?? "https://discord.com/api/v10";
	const url = new URL(`${restApiBaseUrl}/webhooks/${encodeURIComponent(webhookId)}/${encodeURIComponent(webhookToken)}`);
	url.searchParams.set("wait", opts.wait === false ? "false" : "true");
	if (opts.threadId != null && opts.threadId !== "") url.searchParams.set("thread_id", String(opts.threadId));
	const deadline = buildTimeoutAbortSignal({
		timeoutMs: DISCORD_WEBHOOK_TIMEOUT_MS,
		operation: "discord.webhook.send"
	});
	const request = createDiscordRetryRunner({ signal: deadline.signal });
	const chunks = chunkDiscordTextWithMode(textWithMentions, {
		maxChars: textLimit,
		maxLines: opts.chunking ? opts.chunking.maxLines ?? account.config.maxLinesPerMessage : Number.MAX_SAFE_INTEGER
	});
	const results = [];
	try {
		for (const content of chunks.length ? chunks : [""]) {
			const replyTo = resolveDiscordReplyMessageId(reply, results.length === 0);
			const messageReference = replyTo ? {
				message_id: replyTo,
				fail_if_not_exists: false
			} : void 0;
			const response = await request(async () => {
				await opts.onPlatformSendDispatch?.();
				opts.assertPlatformSendAuthorized?.();
				const attemptResponse = await (endpoint?.fetch ?? proxyFetch ?? fetch)(url.toString(), {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						content,
						username: normalizeOptionalString(opts.username),
						avatar_url: normalizeOptionalString(opts.avatarUrl),
						...flags ? { flags } : {},
						...messageReference ? { message_reference: messageReference } : {}
					}),
					signal: deadline.signal
				});
				if (!attemptResponse.ok) await throwWebhookResponseError(attemptResponse, deadline.signal);
				return attemptResponse;
			}, "webhook", { safety: "non-idempotent-create" });
			const payload = response.status === 204 ? {} : await readProviderJsonResponse(response, "Discord webhook send").catch(() => {
				throwIfWebhookDeadlineExpired(deadline.signal);
				return {};
			});
			try {
				recordChannelActivity({
					channel: "discord",
					accountId: account.accountId,
					direction: "outbound"
				});
			} catch {}
			const result = createDiscordSendResult({
				result: payload,
				fallbackChannelId: opts.threadId ? String(opts.threadId) : "",
				kind: "text",
				...opts.threadId != null ? { threadId: opts.threadId } : {},
				reply: createReusableDiscordReplyReference(replyTo)
			});
			const resultConversationId = result.channelId.trim();
			if (result.messageId && resultConversationId) recordOutboundMessageIdentity({
				channel: "discord",
				accountId: account.accountId,
				conversationId: resultConversationId,
				messageId: result.messageId,
				sourceId: webhookId
			});
			results.push(result);
			await opts.onDeliveryResult?.(result);
		}
		const last = expectDefined(results.at(-1), "Discord webhook delivery result");
		return results.length === 1 ? last : {
			...last,
			receipt: createDiscordSendReceiptFromResults({ results })
		};
	} catch (error) {
		if (results.length) recordDiscordMessageCreateAmbiguity(error);
		throw error;
	} finally {
		deadline.cleanup();
	}
}
//#endregion
//#region extensions/discord/src/voice-message.ts
/**
* Discord Voice Message Support
*
* Implements sending voice messages via Discord's API.
* Voice messages require:
* - OGG/Opus format audio
* - Waveform data (base64 encoded, up to 256 samples, 0-255 values)
* - Duration in seconds
* - Message flag 8192 (IS_VOICE_MESSAGE)
* - No other content (text, embeds, etc.)
*/
const DISCORD_VOICE_MESSAGE_FLAG = 8192;
const WAVEFORM_SAMPLES = 256;
const DISCORD_OPUS_SAMPLE_RATE_HZ = 48e3;
const DISCORD_VOICE_ERROR_BODY_LIMIT_BYTES = 8192;
const DISCORD_VOICE_UPLOAD_SSRF_POLICY = {
	allowRfc2544BenchmarkRange: true,
	allowIpv6UniqueLocalRange: true
};
async function runFfmpegToOutput(params) {
	const rootDir = path.dirname(params.outputPath);
	await fs.mkdir(rootDir, { recursive: true });
	await writeExternalFileWithinRoot({
		rootDir,
		path: path.basename(params.outputPath),
		write: async (tempPath) => {
			await runFfmpeg(params.buildArgs(tempPath));
		}
	});
}
function createRateLimitError(response, body) {
	return new RateLimitError(response, body);
}
/**
* Get audio duration using ffprobe
*/
async function getAudioDuration(filePath) {
	try {
		const stdout = await runFfprobe([
			"-v",
			"error",
			"-show_entries",
			"format=duration",
			"-of",
			"csv=p=0",
			filePath
		]);
		const duration = parseStrictFiniteNumber(stdout);
		if (duration === void 0) throw new Error("Could not parse duration");
		return Math.round(duration * 100) / 100;
	} catch (err) {
		const errMessage = formatErrorMessage$1(err);
		throw new Error(`Failed to get audio duration: ${errMessage}`, { cause: err });
	}
}
/**
* Generate waveform data from audio file using ffmpeg
* Returns base64 encoded byte array of amplitude samples (0-255)
*/
async function generateWaveform(filePath) {
	try {
		return await generateWaveformFromPcm(filePath);
	} catch {
		return generatePlaceholderWaveform();
	}
}
/**
* Generate waveform by extracting raw PCM data and sampling amplitudes
*/
async function generateWaveformFromPcm(filePath) {
	const tempDir = resolvePreferredOpenClawTmpDir();
	const tempPcm = path.join(tempDir, `waveform-${crypto.randomUUID()}.raw`);
	try {
		await runFfmpegToOutput({
			outputPath: tempPcm,
			buildArgs: (outputPath) => [
				"-y",
				"-i",
				filePath,
				"-vn",
				"-sn",
				"-dn",
				"-t",
				String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
				"-f",
				"s16le",
				"-acodec",
				"pcm_s16le",
				"-ac",
				"1",
				"-ar",
				"8000",
				outputPath
			]
		});
		const pcmData = await fs.readFile(tempPcm);
		const samples = new Int16Array(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength / 2);
		const step = Math.max(1, Math.floor(samples.length / WAVEFORM_SAMPLES));
		const waveform = [];
		for (let i = 0; i < WAVEFORM_SAMPLES && i * step < samples.length; i++) {
			let sum = 0;
			let count = 0;
			for (let j = 0; j < step && i * step + j < samples.length; j++) {
				sum += Math.abs(expectDefined(samples.at(i * step + j), "bounded PCM waveform sample"));
				count++;
			}
			const avg = count > 0 ? sum / count : 0;
			const normalized = Math.min(255, Math.round(avg / 32767 * 255));
			waveform.push(normalized);
		}
		while (waveform.length < WAVEFORM_SAMPLES) waveform.push(0);
		return Buffer.from(waveform).toString("base64");
	} finally {
		await unlinkIfExists(tempPcm);
	}
}
/**
* Generate a placeholder waveform (for when audio processing fails)
*/
function generatePlaceholderWaveform() {
	const waveform = [];
	for (let i = 0; i < WAVEFORM_SAMPLES; i++) {
		const value = Math.round(128 + 64 * Math.sin(i / WAVEFORM_SAMPLES * Math.PI * 8));
		waveform.push(Math.min(255, Math.max(0, value)));
	}
	return Buffer.from(waveform).toString("base64");
}
/**
* Convert audio file to OGG/Opus format if needed
* Returns path to the OGG file (may be same as input if already OGG/Opus)
*/
async function ensureOggOpus(filePath) {
	const trimmed = filePath.trim();
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) throw new Error(`Voice message conversion requires a local file path; received a URL/protocol source: ${trimmed}`);
	if (normalizeLowercaseStringOrEmpty(path.extname(filePath)) === ".ogg") try {
		const stdout = await runFfprobe([
			"-v",
			"error",
			"-select_streams",
			"a:0",
			"-show_entries",
			"stream=codec_name,sample_rate",
			"-of",
			"csv=p=0",
			filePath
		]);
		const { codec, sampleRateHz } = parseFfprobeCodecAndSampleRate(stdout);
		if (codec === "opus" && sampleRateHz === DISCORD_OPUS_SAMPLE_RATE_HZ) return {
			path: filePath,
			cleanup: false
		};
	} catch {}
	const tempDir = resolvePreferredOpenClawTmpDir();
	const outputPath = path.join(tempDir, `voice-${crypto.randomUUID()}.ogg`);
	await runFfmpegToOutput({
		outputPath,
		buildArgs: (tempPath) => [
			"-y",
			"-i",
			filePath,
			"-vn",
			"-sn",
			"-dn",
			"-t",
			String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
			"-ar",
			String(DISCORD_OPUS_SAMPLE_RATE_HZ),
			"-c:a",
			"libopus",
			"-b:a",
			"64k",
			"-f",
			"ogg",
			tempPath
		]
	});
	return {
		path: outputPath,
		cleanup: true
	};
}
/**
* Wait for waveform cleanup before callers can release the audio input.
*/
async function getVoiceMessageMetadata(filePath) {
	const waveform = generateWaveform(filePath);
	try {
		return {
			durationSecs: await getAudioDuration(filePath),
			waveform: await waveform
		};
	} finally {
		await waveform;
	}
}
function coerceDiscordErrorBody(raw) {
	if (!raw) return;
	try {
		return JSON.parse(raw);
	} catch {
		return { message: truncateUtf16Safe(raw, 200) };
	}
}
async function createVoiceRequestError(response, fallbackMessage) {
	const parsed = coerceDiscordErrorBody(await readResponseTextLimited(response, DISCORD_VOICE_ERROR_BODY_LIMIT_BYTES).catch(() => ""));
	if (response.status === 429) throw createRateLimitError(response, {
		message: readDiscordMessage(parsed, "You are being rate limited."),
		retry_after: readRetryAfter(parsed, response, 1),
		global: parsed && typeof parsed === "object" && "global" in parsed ? Boolean(parsed.global) : false
	});
	return new DiscordError(response, parsed ?? { message: fallbackMessage });
}
async function requestVoiceUploadUrl(params) {
	const endpoint = params.endpointRuntime;
	const url = `${endpoint?.descriptor.restApiBaseUrl ?? params.rest.options?.baseUrl ?? "https://discord.com/api"}/channels/${params.channelId}/attachments`;
	const uploadUrlInit = {
		method: "POST",
		headers: {
			Authorization: `Bot ${params.botToken}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ files: [{
			filename: params.filename,
			file_size: params.fileSize,
			id: "0"
		}] })
	};
	const { response: res, release } = endpoint ? {
		response: await endpoint.fetch(url, {
			...uploadUrlInit,
			signal: AbortSignal.timeout(params.rest.options.timeout)
		}),
		release: async () => {}
	} : await fetchWithSsrFGuard({
		url,
		init: uploadUrlInit,
		timeoutMs: params.rest.options.timeout,
		policy: DISCORD_VOICE_UPLOAD_SSRF_POLICY,
		auditContext: "discord.voice.upload-url"
	});
	try {
		if (!res.ok) throw await createVoiceRequestError(res, "Upload URL request failed");
		return await readProviderJsonResponse(res, "discord.voice.upload-url");
	} finally {
		await release();
	}
}
async function uploadVoiceAttachment(params) {
	const endpointGuard = resolveDiscordEndpointAttachmentGuard(params.uploadUrl, params.endpointRuntime);
	const { response: uploadResponse, release } = await fetchWithSsrFGuard({
		url: params.uploadUrl,
		init: {
			method: "PUT",
			headers: { "Content-Type": "audio/ogg" },
			body: new Uint8Array(params.audioBuffer)
		},
		timeoutMs: DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
		policy: endpointGuard?.policy ?? DISCORD_VOICE_UPLOAD_SSRF_POLICY,
		...endpointGuard ? {
			maxRedirects: endpointGuard.maxRedirects,
			requireHttps: endpointGuard.requireHttps
		} : {},
		auditContext: "discord.voice.attachment-upload"
	});
	try {
		if (!uploadResponse.ok) throw await createVoiceRequestError(uploadResponse, "Failed to upload voice message");
		await uploadResponse.body?.cancel().catch(() => void 0);
	} finally {
		await release();
	}
}
/**
* Send a voice message to Discord
*
* This follows Discord's voice message protocol:
* 1. Request upload URL from Discord
* 2. Upload the OGG file to the provided URL
* 3. Send the message with flag 8192 and attachment metadata
*/
async function sendDiscordVoiceMessage(rest, channelId, audioBuffer, metadata, replyTo, request, silent, token, onPlatformSendDispatch, assertPlatformSendAuthorized) {
	const filename = "voice-message.ogg";
	const fileSize = audioBuffer.byteLength;
	const endpointRuntime = getDiscordEndpointRuntime() ?? null;
	const botToken = token;
	if (!botToken) throw new Error("Discord bot token is required for voice message upload");
	const { upload_filename } = await request(async () => {
		const uploadUrlResponse = await requestVoiceUploadUrl({
			rest,
			endpointRuntime,
			channelId,
			botToken,
			filename,
			fileSize
		});
		if (!uploadUrlResponse.attachments?.[0]) throw new Error("Failed to get upload URL for voice message");
		const attachment = uploadUrlResponse.attachments[0];
		await uploadVoiceAttachment({
			uploadUrl: attachment.upload_url,
			audioBuffer,
			endpointRuntime
		});
		return attachment;
	}, "voice-upload");
	const messagePayload = {
		flags: silent ? 12288 : DISCORD_VOICE_MESSAGE_FLAG,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true,
		attachments: [{
			id: "0",
			filename,
			uploaded_filename: upload_filename,
			duration_secs: metadata.durationSecs,
			waveform: metadata.waveform
		}]
	};
	if (replyTo) messagePayload.message_reference = {
		message_id: replyTo,
		fail_if_not_exists: false
	};
	let messageCreateMayHaveCommitted = false;
	try {
		return await request(async () => {
			await onPlatformSendDispatch?.();
			assertPlatformSendAuthorized?.();
			try {
				return await rest.post(`/channels/${channelId}/messages`, { body: messagePayload });
			} catch (error) {
				messageCreateMayHaveCommitted ||= classifyDiscordDeliveryFailure(error) === "ambiguous";
				throw error;
			}
		}, "voice-message", { safety: "nonce-protected-create" });
	} catch (error) {
		if (messageCreateMayHaveCommitted) recordDiscordMessageCreateAmbiguity(error);
		throw error;
	}
}
//#endregion
//#region extensions/discord/src/send.voice.ts
function toDiscordSendResult(result, fallbackChannelId, reply) {
	return createDiscordSendResult({
		result,
		fallbackChannelId,
		kind: "voice",
		reply
	});
}
async function withMaterializedVoiceMessageInput(mediaUrl, opts, run) {
	const media = await loadWebMediaRaw(mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes: maxBytesForKind("audio"),
		mediaAccess: opts.mediaAccess,
		mediaLocalRoots: opts.mediaLocalRoots,
		mediaReadFile: opts.mediaReadFile
	}));
	const extFromName = media.fileName ? path.extname(media.fileName) : "";
	const extFromMime = media.contentType ? extensionForMime(media.contentType) : "";
	const ext = extFromName || extFromMime || ".bin";
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "voice-src-"
	}, async (workspace) => await run(await workspace.write(`input${ext}`, media.buffer)));
}
/**
* Send a voice message to Discord.
*
* Voice messages are a special Discord feature that displays audio with a waveform
* visualization. They require OGG/Opus format and cannot include text content.
*
* @param to - Recipient (user ID for DM or channel ID)
* @param audioPath - Path to local audio file (will be converted to OGG/Opus if needed)
* @param opts - Send options
*/
async function sendVoiceMessageDiscord(to, audioPath, opts) {
	return await withDiscordRequestAuthority(opts.assertPlatformSendAuthorized, () => sendVoiceMessageDiscordInternal(to, audioPath, opts));
}
async function sendVoiceMessageDiscordInternal(to, audioPath, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Discord voice send");
	return await withMaterializedVoiceMessageInput(audioPath, opts, async (localInputPath) => {
		let oggPath = null;
		let oggCleanup = false;
		let token;
		let rest;
		let channelId;
		try {
			const client = createDiscordClient({
				...opts,
				cfg
			});
			token = client.token;
			rest = client.rest;
			const request = client.request;
			const accountInfo = client.account;
			const recipient = await parseAndResolveChannelRecipient(to, cfg, accountInfo.accountId);
			channelId = (await resolveChannelId(rest, recipient, request)).channelId;
			const ogg = await ensureOggOpus(localInputPath);
			oggPath = ogg.path;
			oggCleanup = ogg.cleanup;
			const metadata = await getVoiceMessageMetadata(oggPath);
			const audioBuffer = await fs.readFile(oggPath);
			const result = await sendDiscordVoiceMessage(rest, channelId, audioBuffer, metadata, opts.reply?.messageId, request, opts.silent, token, opts.onPlatformSendDispatch, opts.assertPlatformSendAuthorized);
			recordChannelActivity({
				channel: "discord",
				accountId: accountInfo.accountId,
				direction: "outbound"
			});
			return toDiscordSendResult(result, channelId, opts.reply);
		} catch (err) {
			if (channelId && rest && token) throw await buildDiscordSendError(err, {
				channelId,
				cfg,
				rest,
				token,
				hasMedia: true
			});
			throw err;
		} finally {
			await unlinkIfExists(oggCleanup ? oggPath : null);
		}
	});
}
//#endregion
//#region extensions/discord/src/send.typing.ts
async function sendTypingDiscord(channelId, opts) {
	const rest = resolveDiscordRest(opts);
	await sendChannelTyping(rest, channelId);
	return {
		ok: true,
		channelId
	};
}
//#endregion
//#region extensions/discord/src/send.reactions.ts
function resolveDiscordReactionClient(opts) {
	if (opts.rest && opts.cfg && opts.accountId) return createDiscordClient(opts);
	if (!opts.cfg) throw new Error("Discord reactions requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Discord reactions");
	return createDiscordClient({
		...opts,
		cfg
	});
}
async function reactMessageDiscord(channelId, messageId, emoji, opts) {
	const { rest, request } = resolveDiscordReactionClient(opts);
	const encoded = normalizeReactionEmoji(emoji);
	await request(() => createOwnMessageReaction(rest, channelId, messageId, encoded), "react");
	return { ok: true };
}
async function removeReactionDiscord(channelId, messageId, emoji, opts) {
	const { rest, request } = resolveDiscordReactionClient(opts);
	const encoded = normalizeReactionEmoji(emoji);
	await request(() => deleteOwnMessageReaction(rest, channelId, messageId, encoded), "reaction-remove");
	return { ok: true };
}
async function removeOwnReactionsDiscord(channelId, messageId, opts) {
	const { rest, request } = resolveDiscordReactionClient(opts);
	const message = await request(() => getChannelMessage(rest, channelId, messageId), "reaction-list");
	const identifiers = /* @__PURE__ */ new Set();
	for (const reaction of message.reactions ?? []) {
		const identifier = reaction.me ? buildReactionIdentifier(reaction.emoji) : void 0;
		if (identifier) identifiers.add(identifier);
	}
	if (identifiers.size === 0) return {
		ok: true,
		removed: []
	};
	const removed = Array.from(identifiers);
	await Promise.all(removed.map((identifier) => request(() => deleteOwnMessageReaction(rest, channelId, messageId, normalizeReactionEmoji(identifier)), "reaction-remove")));
	return {
		ok: true,
		removed
	};
}
async function fetchReactionsDiscord(channelId, messageId, opts) {
	const { rest, request } = resolveDiscordReactionClient(opts);
	const reactions = (await request(() => getChannelMessage(rest, channelId, messageId), "reaction-list")).reactions ?? [];
	if (reactions.length === 0) return [];
	const limit = typeof opts.limit === "number" && Number.isFinite(opts.limit) ? Math.min(Math.max(Math.floor(opts.limit), 1), 100) : 100;
	const summaries = [];
	for (const reaction of reactions) {
		const identifier = buildReactionIdentifier(reaction.emoji);
		if (!identifier) continue;
		const encoded = encodeURIComponent(identifier);
		const users = await request(() => listMessageReactionUsers(rest, channelId, messageId, encoded, { limit }), "reaction-users");
		summaries.push({
			emoji: {
				id: reaction.emoji.id ?? null,
				name: reaction.emoji.name ?? null,
				raw: formatReactionEmoji(reaction.emoji)
			},
			count: reaction.count,
			users: users.map((user) => ({
				id: user.id,
				username: user.username,
				tag: user.username && user.discriminator ? `${user.username}#${user.discriminator}` : user.username
			}))
		});
	}
	return summaries;
}
//#endregion
//#region extensions/discord/src/send.ts
var send_exports = /* @__PURE__ */ __exportAll({
	DiscordSendError: () => DiscordSendError,
	DiscordThreadInitialMessageError: () => DiscordThreadInitialMessageError,
	addRoleDiscord: () => addRoleDiscord,
	banMemberDiscord: () => banMemberDiscord,
	canManageGuildMemberRoleDiscord: () => canManageGuildMemberRoleDiscord,
	canManageGuildRoleDiscord: () => canManageGuildRoleDiscord,
	canViewDiscordGuildChannel: () => canViewDiscordGuildChannel,
	createChannelDiscord: () => createChannelDiscord,
	createScheduledEventDiscord: () => createScheduledEventDiscord,
	createThreadDiscord: () => createThreadDiscord,
	deleteChannelDiscord: () => deleteChannelDiscord,
	deleteMessageDiscord: () => deleteMessageDiscord,
	editChannelDiscord: () => editChannelDiscord,
	editMessageDiscord: () => editMessageDiscord,
	fetchChannelInfoDiscord: () => fetchChannelInfoDiscord,
	fetchChannelPermissionsDiscord: () => fetchChannelPermissionsDiscord,
	fetchGuildInfoDiscord: () => fetchGuildInfoDiscord,
	fetchMemberGuildPermissionsDiscord: () => fetchMemberGuildPermissionsDiscord,
	fetchMemberInfoDiscord: () => fetchMemberInfoDiscord,
	fetchMessageDiscord: () => fetchMessageDiscord,
	fetchReactionsDiscord: () => fetchReactionsDiscord,
	fetchRoleInfoDiscord: () => fetchRoleInfoDiscord,
	fetchVoiceStatusDiscord: () => fetchVoiceStatusDiscord,
	hasAllGuildPermissionsDiscord: () => hasAllGuildPermissionsDiscord,
	hasAnyChannelPermissionDiscord: () => hasAnyChannelPermissionDiscord,
	hasAnyGuildPermissionDiscord: () => hasAnyGuildPermissionDiscord,
	kickMemberDiscord: () => kickMemberDiscord,
	listGuildChannelsDiscord: () => listGuildChannelsDiscord,
	listGuildEmojisDiscord: () => listGuildEmojisDiscord,
	listPinsDiscord: () => listPinsDiscord,
	listScheduledEventsDiscord: () => listScheduledEventsDiscord,
	listThreadsDiscord: () => listThreadsDiscord,
	moveChannelDiscord: () => moveChannelDiscord,
	pinMessageDiscord: () => pinMessageDiscord,
	reactMessageDiscord: () => reactMessageDiscord,
	readMessagesDiscord: () => readMessagesDiscord,
	removeChannelPermissionDiscord: () => removeChannelPermissionDiscord,
	removeOwnReactionsDiscord: () => removeOwnReactionsDiscord,
	removeReactionDiscord: () => removeReactionDiscord,
	removeRoleDiscord: () => removeRoleDiscord,
	resolveEventCoverImage: () => resolveEventCoverImage,
	searchMessagesDiscord: () => searchMessagesDiscord,
	sendMessageDiscord: () => sendMessageDiscord,
	sendPollDiscord: () => sendPollDiscord,
	sendStickerDiscord: () => sendStickerDiscord,
	sendTypingDiscord: () => sendTypingDiscord,
	sendVoiceMessageDiscord: () => sendVoiceMessageDiscord,
	sendWebhookMessageDiscord: () => sendWebhookMessageDiscord,
	setChannelPermissionDiscord: () => setChannelPermissionDiscord,
	timeoutMemberDiscord: () => timeoutMemberDiscord,
	unpinMessageDiscord: () => unpinMessageDiscord,
	uploadEmojiDiscord: () => uploadEmojiDiscord,
	uploadStickerDiscord: () => uploadStickerDiscord
});
//#endregion
export { listScheduledEventsDiscord as A, moveChannelDiscord as B, fetchChannelInfoDiscord as C, fetchVoiceStatusDiscord as D, fetchRoleInfoDiscord as E, uploadEmojiDiscord as F, setChannelPermissionDiscord as H, uploadStickerDiscord as I, createChannelDiscord as L, resolveEventCoverImage as M, timeoutMemberDiscord as N, kickMemberDiscord as O, listGuildEmojisDiscord as P, deleteChannelDiscord as R, createScheduledEventDiscord as S, fetchMemberInfoDiscord as T, removeChannelPermissionDiscord as V, readMessagesDiscord as _, removeReactionDiscord as a, addRoleDiscord as b, sendWebhookMessageDiscord as c, deleteMessageDiscord as d, editMessageDiscord as f, pinMessageDiscord as g, listThreadsDiscord as h, removeOwnReactionsDiscord as i, removeRoleDiscord as j, listGuildChannelsDiscord as k, DiscordThreadInitialMessageError as l, listPinsDiscord as m, fetchReactionsDiscord as n, sendTypingDiscord as o, fetchMessageDiscord as p, reactMessageDiscord as r, sendVoiceMessageDiscord as s, send_exports as t, createThreadDiscord as u, searchMessagesDiscord as v, fetchGuildInfoDiscord as w, banMemberDiscord as x, unpinMessageDiscord as y, editChannelDiscord as z };
