import { i as fetchChannelPermissionsDiscord, u as createDiscordClient } from "./send.permissions-BvH_Dr8p.mjs";
import { O as getChannel, d as hasDiscordV2Components, f as serializePayload, p as Embed, w as createChannelMessage, y as createUserDmChannel, z as DiscordError } from "./discord-cXPUdHQi.mjs";
import { w as isDiscordThreadChannelType } from "./allow-list-CkqpzPvP.mjs";
import { S as chunkDiscordTextWithMode, h as resolveDiscordReplyMessageId } from "./send.receipt-CZ7ks6g7.mjs";
import { t as parseAndResolveDiscordTarget } from "./target-resolver-48znkzky.mjs";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { MessageFlags } from "discord-api-types/v10";
import { PollLayoutType } from "discord-api-types/payloads/v10";
import { extensionForMime, normalizePollDurationHours, normalizePollInput } from "openclaw/plugin-sdk/media-runtime";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveTextChunksWithFallback } from "openclaw/plugin-sdk/reply-payload";
import { randomBytes } from "node:crypto";
// extensions/discord/src/send.message-request.ts
const SUPPRESS_EMBEDS_FLAG = MessageFlags.SuppressEmbeds;
const SUPPRESS_NOTIFICATIONS_FLAG = MessageFlags.SuppressNotifications;
function createDiscordMessageNonce() {
	return randomBytes(12).toString("hex");
}
function resolveDiscordSendComponents(params) {
	if (!params.components || !params.isFirst) return;
	return typeof params.components === "function" ? params.components(params.text) : params.components;
}
function resolveDiscordSendEmbeds(params) {
	if (!params.embeds?.length || !params.isFirst) return;
	return params.embeds.map((embed) => embed instanceof Embed ? embed : new Embed(embed));
}
function resolveDiscordMessageFlags(params) {
	return (params.suppressEmbeds ? SUPPRESS_EMBEDS_FLAG : 0) | (params.silent ? SUPPRESS_NOTIFICATIONS_FLAG : 0) || void 0;
}
function resolveDiscordSuppressEmbeds(params) {
	return params.override ?? params.configured ?? true;
}
function buildDiscordMessageRequest(params) {
	const hasV2 = hasDiscordV2Components(params.components);
	const trimmed = params.text.trim();
	const payload = {
		content: !hasV2 && trimmed ? params.text : void 0,
		components: params.components?.length ? params.components : void 0,
		embeds: !hasV2 && params.embeds?.length ? params.embeds : void 0,
		allowed_mentions: params.allowedMentions || void 0,
		flags: params.flags,
		files: params.files?.length ? params.files : void 0
	};
	const nonce = params.endpoint === "create-message" ? params.nonce ?? createDiscordMessageNonce() : void 0;
	return {
		...serializePayload(payload),
		...params.replyTo ? { message_reference: {
			message_id: params.replyTo,
			fail_if_not_exists: false
		} } : {},
		...nonce !== void 0 ? { nonce } : {},
		...nonce ? { enforce_nonce: true } : {}
	};
}
// extensions/discord/src/send.types.ts
var DiscordSendError = class extends Error {
	constructor(message, opts) {
		super(message);
		this.name = "DiscordSendError";
		Object.assign(this, opts);
	}
	toString() {
		return this.message;
	}
};
const DISCORD_MAX_EMOJI_BYTES = 262144;
const DISCORD_MAX_STICKER_BYTES = 524288;
const DISCORD_MAX_EVENT_COVER_BYTES = 8388608;
// extensions/discord/src/send.shared.ts
const DISCORD_TEXT_LIMIT = 2e3;
const DISCORD_MAX_STICKERS = 3;
const DISCORD_POLL_MAX_ANSWERS = 10;
const DISCORD_POLL_MAX_DURATION_HOURS = 768;
const DISCORD_MISSING_PERMISSIONS = 50013;
const DISCORD_CANNOT_DM = 50007;
const DISCORD_UPLOAD_TOO_LARGE = 40005;
const DISCORD_UPLOAD_TOO_LARGE_STATUS = 413;
const DISCORD_UPLOAD_TOO_LARGE_NOTICE = "Attachment skipped: Discord rejected the file as too large.";
function resolveRequiredDiscordSendPermissions(channelType, hasMedia) {
	const permissions = isDiscordThreadChannelType(channelType) ? ["ViewChannel", "SendMessagesInThreads"] : ["ViewChannel", "SendMessages"];
	if (hasMedia) permissions.push("AttachFiles");
	return permissions;
}
function normalizeReactionEmoji(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("emoji required");
	const customMatch = trimmed.match(/^<a?:([^:>]+):(\d+)>$/);
	const identifier = customMatch ? `${customMatch[1]}:${customMatch[2]}` : trimmed.replace(/[\uFE0E\uFE0F]/g, "");
	return encodeURIComponent(identifier);
}
function normalizeStickerIds(raw) {
	const ids = normalizeStringEntries(raw);
	if (ids.length === 0) throw new Error("At least one sticker id is required");
	if (ids.length > DISCORD_MAX_STICKERS) throw new Error("Discord supports up to 3 stickers per message");
	return ids;
}
function normalizeEmojiName(raw, label) {
	const name = raw.trim();
	if (!name) throw new Error(`${label} is required`);
	return name;
}
function normalizeDiscordPollInput(input) {
	const poll = normalizePollInput(input, { maxOptions: DISCORD_POLL_MAX_ANSWERS });
	const duration = normalizePollDurationHours(poll.durationHours, {
		defaultHours: 24,
		maxHours: DISCORD_POLL_MAX_DURATION_HOURS
	});
	return {
		question: { text: poll.question },
		answers: poll.options.map((answer) => ({ poll_media: { text: answer } })),
		duration,
		allow_multiselect: poll.maxSelections > 1,
		layout_type: PollLayoutType.Default
	};
}
function isDiscordUploadTooLargeError(err) {
	return err instanceof DiscordError && (err.discordCode === DISCORD_UPLOAD_TOO_LARGE || err.status === DISCORD_UPLOAD_TOO_LARGE_STATUS);
}
function buildDiscordUploadTooLargeFallbackText(text) {
	return text.trim() ? `${text}\n\n[${DISCORD_UPLOAD_TOO_LARGE_NOTICE}]` : DISCORD_UPLOAD_TOO_LARGE_NOTICE;
}
async function buildDiscordSendError(err, ctx) {
	if (!(err instanceof DiscordError)) return err;
	const code = err.discordCode;
	if (code === DISCORD_CANNOT_DM) return new DiscordSendError(`discord dm failed: user blocks dms or privacy settings disallow it (code=${code})`, { status: err.status });
	if (code !== DISCORD_MISSING_PERMISSIONS) return err;
	let missing = [];
	let probedChannelType;
	try {
		const permissions = await fetchChannelPermissionsDiscord(ctx.channelId, {
			rest: ctx.rest,
			token: ctx.token,
			cfg: ctx.cfg
		});
		probedChannelType = permissions.channelType;
		const current = new Set(permissions.permissions);
		missing = resolveRequiredDiscordSendPermissions(probedChannelType, ctx.hasMedia).filter((permission) => !current.has(permission));
	} catch {}
	const status = err.status;
	const apiDetails = `code=${code} status=${status}`;
	const probeSummary = resolveRequiredDiscordSendPermissions(probedChannelType, ctx.hasMedia).join("/");
	return new DiscordSendError(`${missing.length ? `discord missing permissions in channel ${ctx.channelId}: ${missing.join(", ")}` : `discord missing permissions in channel ${ctx.channelId}; permission check did not identify missing ${probeSummary}`} (${apiDetails}). bot might be blocked by channel/thread overrides, archived thread state, reply target visibility, or app-role position`, { status });
}
async function resolveChannelId(rest, recipient, request) {
	if (recipient.kind === "channel") return { channelId: recipient.id };
	const dmChannel = await request(() => createUserDmChannel(rest, recipient.id), "dm-channel");
	if (!dmChannel?.id) throw new Error("Failed to create Discord DM channel");
	return {
		channelId: dmChannel.id,
		dm: true
	};
}
async function resolveDiscordTargetChannelId(raw, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Discord target channel resolution");
	const recipient = await parseAndResolveDiscordTarget(raw, {
		cfg,
		accountId: opts.accountId
	}, { defaultKind: "channel" });
	const { rest, request } = createDiscordClient(opts);
	return await resolveChannelId(rest, recipient, request);
}
async function resolveDiscordChannel(rest, channelId) {
	return getChannel(rest, channelId).catch(() => void 0);
}
function buildDiscordTextChunks(text, opts = {}) {
	if (!text) return [];
	const chunks = chunkDiscordTextWithMode(text, {
		maxChars: opts.maxChars ?? DISCORD_TEXT_LIMIT,
		maxLines: opts.maxLinesPerMessage,
		chunkMode: opts.chunkMode
	});
	return resolveTextChunksWithFallback(text, chunks);
}
async function sendDiscordChunks(params, upload) {
	const chunks = buildDiscordTextChunks(params.text, params);
	if (!chunks.length) chunks.push("");
	const platformMessageIds = [];
	let primary;
	for (const [index, chunk] of chunks.entries()) {
		const isFirst = index === 0;
		if (upload && !isFirst && !chunk.trim()) continue;
		const files = isFirst ? upload?.files : void 0;
		const components = resolveDiscordSendComponents({
			...params,
			text: chunk,
			isFirst
		});
		const embeds = resolveDiscordSendEmbeds({
			...params,
			isFirst
		});
		if (!chunk.trim() && !components?.length && !embeds?.length && !files?.length) throw new Error("Message must be non-empty for Discord sends");
		const replyToId = resolveDiscordReplyMessageId(params.reply, isFirst);
		const kind = files ? "media" : components?.length || embeds?.length ? "card" : "text";
		const body = buildDiscordMessageRequest({
			endpoint: "create-message",
			text: chunk,
			components,
			embeds,
			files,
			allowedMentions: params.allowedMentions,
			flags: resolveDiscordMessageFlags({
				silent: params.silent,
				suppressEmbeds: params.suppressEmbeds && !embeds?.length
			}),
			replyTo: replyToId
		});
		let result;
		try {
			result = await params.request(async () => {
				await params.onPlatformSendDispatch?.();
				params.assertPlatformSendAuthorized?.();
				return createChannelMessage(params.rest, params.channelId, { body });
			}, files ? "media" : "text", { safety: "nonce-protected-create" });
		} catch (error) {
			if (files && upload) return upload.onRejected(error);
			throw error;
		}
		await params.onResult?.(result, kind, replyToId);
		if (result.id) platformMessageIds.push(result.id);
		primary = upload ? primary ?? result : result;
	}
	if (!primary) throw new Error("Discord send failed (empty chunk result)");
	return {
		...primary,
		platformMessageIds
	};
}
async function sendDiscordMedia(params) {
	const media = await loadOutboundMediaFromUrl(params.mediaUrl, {
		maxBytes: params.maxBytes,
		mediaAccess: params.mediaAccess,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaReadFile: params.mediaReadFile
	});
	const resolvedFileName = params.filename?.trim() || media.fileName || (media.contentType ? `upload${extensionForMime(media.contentType) ?? ""}` : "") || "upload";
	return sendDiscordChunks(params, {
		files: [{
			data: media.buffer,
			name: resolvedFileName,
			contentType: media.contentType
		}],
		onRejected(error) {
			if (!isDiscordUploadTooLargeError(error)) throw error;
			return sendDiscordChunks({
				...params,
				text: buildDiscordUploadTooLargeFallbackText(params.text),
				components: void 0,
				embeds: void 0
			});
		}
	});
}
function buildReactionIdentifier(emoji) {
	if (emoji.id && emoji.name) return `${emoji.name}:${emoji.id}`;
	return emoji.name ?? "";
}
export { resolveDiscordSuppressEmbeds as C, resolveDiscordSendEmbeds as S, SUPPRESS_NOTIFICATIONS_FLAG as _, normalizeEmojiName as a, resolveDiscordMessageFlags as b, resolveChannelId as c, sendDiscordChunks as d, sendDiscordMedia as f, DiscordSendError as g, DISCORD_MAX_STICKER_BYTES as h, normalizeDiscordPollInput as i, resolveDiscordChannel as l, DISCORD_MAX_EVENT_COVER_BYTES as m, buildDiscordTextChunks as n, normalizeReactionEmoji as o, DISCORD_MAX_EMOJI_BYTES as p, buildReactionIdentifier as r, normalizeStickerIds as s, buildDiscordSendError as t, resolveDiscordTargetChannelId as u, buildDiscordMessageRequest as v, resolveDiscordSendComponents as x, createDiscordMessageNonce as y };
