import { l as resolveDiscordAccount, o as listEnabledDiscordAccounts, u as resolveDiscordAccountAllowFrom } from "./accounts-ljrzXBJi.mjs";
import { A as isDiscordThreadChannelType, D as getDiscordEndpointRuntime, f as resolveDiscordGuildEntry, i as normalizeDiscordAllowList, k as resolveDiscordEndpointMediaGuard, l as resolveDiscordChannelConfigWithFallback, n as hasConfiguredDiscordChannels, o as normalizeDiscordSlug, p as resolveDiscordMemberAccessState, r as isDiscordGroupAllowedByPolicy, t as allowListMatches } from "./allow-list-BKqOldGy.mjs";
import { L as DiscordError, pt as getChannelMessage, t as discord_exports } from "./discord-BMD-JiVS.mjs";
import { l as withAbortTimeout } from "./timeouts-CuNARfyw.mjs";
import { t as resolveDiscordCommandOwnerAllowFrom } from "./command-owners-C7rUdqUX.mjs";
import { a as resolveDiscordChannelParentSafe, i as resolveDiscordChannelParentIdSafe, n as resolveDiscordChannelInfoSafe, r as resolveDiscordChannelNameSafe, t as resolveDiscordChannelIdSafe } from "./channel-access-DasWY_OV.mjs";
import { createSubsystemLogger, getChildLogger, logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId, summarizeStringEntries, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ComponentType, StickerFormatType } from "discord-api-types/v10";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { saveRemoteMedia } from "openclaw/plugin-sdk/media-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/ssrf-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { createReplyReferencePlanner } from "openclaw/plugin-sdk/reply-reference";
import { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { getFileExtension, normalizeMimeType } from "openclaw/plugin-sdk/media-mime";
import { formatMediaPlaceholderText } from "openclaw/plugin-sdk/channel-inbound";
import { resolveCommandAuthorizedFromAuthorizers } from "openclaw/plugin-sdk/command-auth-native";
//#region extensions/discord/src/monitor/message-channel-info-state.ts
const discordChannelInfoCacheState = { entries: /* @__PURE__ */ new Map() };
//#endregion
//#region extensions/discord/src/monitor/message-channel-info.ts
const DISCORD_CHANNEL_INFO_CACHE_TTL_MS = 3e5;
const DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS = 3e4;
const DISCORD_CHANNEL_INFO_CACHE_MAX_ENTRIES = 1e3;
function cacheDiscordChannelInfo(channelId, value, ttlMs, nowMs) {
	discordChannelInfoCacheState.entries.set(channelId, {
		value,
		expiresAt: nowMs + ttlMs
	});
	pruneMapToMaxSize(discordChannelInfoCacheState.entries, DISCORD_CHANNEL_INFO_CACHE_MAX_ENTRIES);
}
function normalizeDiscordChannelId(value) {
	return normalizeOptionalStringifiedId(value) ?? "";
}
function resolveDiscordMessageChannelId(params) {
	const message = params.message;
	return normalizeDiscordChannelId(message.channelId) || normalizeDiscordChannelId(message.channel_id) || normalizeDiscordChannelId(message.rawData?.channel_id) || normalizeDiscordChannelId(params.eventChannelId);
}
function buildDiscordChannelInfo(channel, options) {
	const info = resolveDiscordChannelInfoSafe(channel);
	const type = info.type ?? (options?.rawTypeFallback ? channel.type : void 0);
	return type === void 0 ? null : {
		type,
		name: info.name,
		topic: info.topic,
		parentId: info.parentId,
		ownerId: info.ownerId
	};
}
async function resolveDiscordChannelInfo(client, channelId) {
	const now = Date.now();
	const cached = discordChannelInfoCacheState.entries.get(channelId);
	if (cached) {
		if (cached.expiresAt > now) return cached.value;
		discordChannelInfoCacheState.entries.delete(channelId);
	}
	try {
		const channel = await client.fetchChannel(channelId);
		if (!channel) {
			cacheDiscordChannelInfo(channelId, null, DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS, now);
			return null;
		}
		const payload = buildDiscordChannelInfo(channel, { rawTypeFallback: true });
		if (!payload) return null;
		cacheDiscordChannelInfo(channelId, payload, DISCORD_CHANNEL_INFO_CACHE_TTL_MS, now);
		return payload;
	} catch (err) {
		logVerbose(`discord: failed to fetch channel ${channelId}: ${String(err)}`);
		cacheDiscordChannelInfo(channelId, null, DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS, now);
		return null;
	}
}
//#endregion
//#region extensions/discord/src/monitor/message-forwarded.ts
const FORWARD_MESSAGE_REFERENCE_TYPE = 1;
function normalizeDiscordStickerItems(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => Boolean(entry) && typeof entry === "object" && typeof entry.id === "string" && typeof entry.name === "string");
}
function resolveDiscordMessageStickers(message) {
	const stickers = message.stickers;
	const normalized = normalizeDiscordStickerItems(stickers);
	if (normalized.length > 0) return normalized;
	const rawData = message.rawData;
	return normalizeDiscordStickerItems(rawData?.sticker_items ?? rawData?.stickers);
}
function resolveDiscordSnapshotStickers(snapshot) {
	const stickers = normalizeDiscordStickerItems(snapshot.stickers);
	return stickers.length > 0 ? stickers : normalizeDiscordStickerItems(snapshot.sticker_items);
}
function hasDiscordMessageStickers(message) {
	return resolveDiscordMessageStickers(message).length > 0;
}
function resolveDiscordMessageSnapshots(message) {
	const rawData = message.rawData;
	return normalizeDiscordMessageSnapshots(rawData?.message_snapshots ?? message.message_snapshots ?? message.messageSnapshots);
}
function normalizeDiscordMessageSnapshots(snapshots) {
	if (!Array.isArray(snapshots)) return [];
	return snapshots.filter((entry) => Boolean(entry) && typeof entry === "object");
}
function resolveDiscordReferencedForwardMessage(message) {
	const referenceType = message.messageReference?.type;
	return Number(referenceType) === FORWARD_MESSAGE_REFERENCE_TYPE ? message.referencedMessage : null;
}
function resolveDiscordReferencedReplyMessage(message) {
	const referenceType = message.messageReference?.type;
	return Number(referenceType) === FORWARD_MESSAGE_REFERENCE_TYPE ? null : message.referencedMessage ?? null;
}
function resolveDiscordReferencedReplyMessageId(message) {
	const referenceType = message.messageReference?.type;
	if (Number(referenceType) === FORWARD_MESSAGE_REFERENCE_TYPE) return null;
	return normalizeOptionalString(message.messageReference?.message_id) ?? normalizeOptionalString(message.referencedMessage?.id) ?? null;
}
function formatDiscordSnapshotAuthor(author) {
	if (!author) return;
	const globalName = normalizeOptionalString(author.global_name) ?? void 0;
	const username = normalizeOptionalString(author.username) ?? void 0;
	const name = normalizeOptionalString(author.name) ?? void 0;
	const discriminator = normalizeOptionalString(author.discriminator) ?? void 0;
	const base = globalName || username || name || author.id;
	if (username && discriminator && discriminator !== "0") return `@${username}#${discriminator}`;
	return base ? `@${base}` : void 0;
}
//#endregion
//#region extensions/discord/src/monitor/media-ssrf-policy.ts
const DISCORD_MEDIA_SSRF_POLICY = {
	hostnameAllowlist: [
		"cdn.discordapp.com",
		"media.discordapp.net",
		"*.discordapp.com",
		"*.discordapp.net"
	],
	allowRfc2544BenchmarkRange: true
};
function mergeHostnameList(...lists) {
	const merged = lists.flatMap((list) => list ?? []).map((value) => value.trim()).filter((value) => value.length > 0);
	return merged.length > 0 ? uniqueStrings(merged) : void 0;
}
/** Inherit explicit host/proxy exceptions, never browser-wide private-network access. */
function resolveDiscordCdnPolicy(policy) {
	if (!policy) return DISCORD_MEDIA_SSRF_POLICY;
	return {
		...DISCORD_MEDIA_SSRF_POLICY,
		hostnameAllowlist: mergeHostnameList(DISCORD_MEDIA_SSRF_POLICY.hostnameAllowlist, policy.hostnameAllowlist),
		allowedHostnames: mergeHostnameList(policy.allowedHostnames),
		allowedOrigins: policy.allowedOrigins,
		blockedHostnames: policy.blockedHostnames,
		allowIpv6UniqueLocalRange: policy.allowIpv6UniqueLocalRange
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-media.ts
const AUDIO_ATTACHMENT_EXTENSIONS = /* @__PURE__ */ new Set([
	".aac",
	".caf",
	".flac",
	".m4a",
	".mp3",
	".oga",
	".ogg",
	".opus",
	".wav"
]);
const DISCORD_STICKER_ASSET_BASE_URL = "https://media.discordapp.net/stickers";
function createDiscordMediaOperation(maxBytes, options) {
	return {
		...options,
		ssrfPolicy: resolveDiscordCdnPolicy(options?.ssrfPolicy),
		endpointRuntime: getDiscordEndpointRuntime() ?? null,
		maxBytes,
		out: []
	};
}
const NON_DEFINITIVE_MEDIA_TYPES = /* @__PURE__ */ new Set([
	"application/octet-stream",
	"binary/octet-stream",
	"application/ogg"
]);
function isDefinitiveMediaType(contentType) {
	const normalized = normalizeMimeType(contentType);
	return Boolean(normalized && !NON_DEFINITIVE_MEDIA_TYPES.has(normalized));
}
function resolveDiscordMediaClassification(params) {
	const contentType = [params.fetchedContentType, params.attachment.content_type].find(isDefinitiveMediaType) ?? params.fetchedContentType ?? params.attachment.content_type ?? void 0;
	const mime = normalizeMimeType(contentType);
	const definitive = isDefinitiveMediaType(contentType);
	const definitiveVisual = mime?.startsWith("video/") === true || mime?.startsWith("image/") === true;
	const audioKind = mime?.startsWith("audio/") || typeof params.attachment.waveform === "string" || !definitiveVisual && (typeof params.attachment.duration_secs === "number" || AUDIO_ATTACHMENT_EXTENSIONS.has(getFileExtension(params.attachment.filename ?? params.attachment.url) ?? "") && !definitive) ? "audio" : void 0;
	const kind = audioKind ?? (!definitive ? isImageAttachment(params.attachment) ? "image" : "document" : void 0);
	return {
		contentType: audioKind && !mime?.startsWith("audio/") || kind && !definitive ? void 0 : contentType,
		...kind ? { kind } : {}
	};
}
async function resolveMessageMedia(message, operation, errorPrefix) {
	await appendResolvedMediaFromAttachments({
		...operation,
		attachments: message.attachments ?? [],
		errorPrefix: `${errorPrefix} attachment`
	});
	await appendResolvedMediaFromStickers({
		...operation,
		stickers: resolveDiscordMessageStickers(message),
		errorPrefix: `${errorPrefix} sticker`
	});
	return operation.out;
}
async function resolveMediaList(message, maxBytes, options) {
	return resolveMessageMedia(message, createDiscordMediaOperation(maxBytes, options), "discord: failed to download");
}
async function resolveForwardedMediaList(message, maxBytes, options) {
	const snapshots = resolveDiscordMessageSnapshots(message);
	const operation = createDiscordMediaOperation(maxBytes, options);
	if (snapshots.length > 0) {
		for (const snapshot of snapshots) {
			await appendResolvedMediaFromAttachments({
				...operation,
				attachments: snapshot.message?.attachments,
				errorPrefix: "discord: failed to download forwarded attachment"
			});
			await appendResolvedMediaFromStickers({
				...operation,
				stickers: snapshot.message ? resolveDiscordSnapshotStickers(snapshot.message) : [],
				errorPrefix: "discord: failed to download forwarded sticker"
			});
		}
		return operation.out;
	}
	const referencedForward = resolveDiscordReferencedForwardMessage(message);
	return referencedForward ? resolveMessageMedia(referencedForward, operation, "discord: failed to download forwarded") : operation.out;
}
async function resolveReferencedReplyMediaList(message, maxBytes, options) {
	const referencedReply = resolveDiscordReferencedReplyMessage(message);
	return referencedReply ? resolveMessageMedia(referencedReply, createDiscordMediaOperation(maxBytes, options), "discord: failed to download referenced reply") : [];
}
async function fetchDiscordMedia(operation, params) {
	const endpointGuard = resolveDiscordEndpointMediaGuard(params.url, operation.endpointRuntime);
	const save = (signal) => saveRemoteMedia({
		...params,
		maxBytes: operation.maxBytes,
		fetchImpl: endpointGuard ? void 0 : operation.fetchImpl,
		ssrfPolicy: endpointGuard?.ssrfPolicy ?? operation.ssrfPolicy,
		...endpointGuard ? { maxRedirects: endpointGuard.maxRedirects } : {},
		readIdleTimeoutMs: operation.readIdleTimeoutMs,
		...signal ? { requestInit: { signal } } : {}
	});
	return operation.totalTimeoutMs ? withAbortTimeout({
		timeoutMs: operation.totalTimeoutMs,
		createTimeoutError: () => /* @__PURE__ */ new Error(`discord media download timed out after ${operation.totalTimeoutMs}ms`),
		run: (signal) => save(operation.abortSignal ? AbortSignal.any([operation.abortSignal, signal]) : signal)
	}) : save(operation.abortSignal);
}
async function appendResolvedMediaFromAttachments(params) {
	for (const attachment of params.attachments ?? []) {
		const attachmentUrl = normalizeOptionalString(attachment.url);
		if (!attachmentUrl) {
			logVerbose(`${params.errorPrefix} ${attachment.id ?? attachment.filename ?? "attachment"}: missing url`);
			params.out.push(resolveDiscordMediaClassification({ attachment }));
			continue;
		}
		try {
			const saved = await fetchDiscordMedia(params, {
				url: attachmentUrl,
				filePathHint: attachment.filename ?? attachmentUrl,
				fallbackContentType: attachment.content_type,
				originalFilename: attachment.filename
			});
			const classification = resolveDiscordMediaClassification({
				attachment,
				fetchedContentType: saved.contentType
			});
			params.out.push({
				path: saved.path,
				fileName: attachment.filename,
				...classification
			});
		} catch (err) {
			const id = attachment.id ?? attachmentUrl;
			getChildLogger({ module: "discord-media" }).warn(`${params.errorPrefix} ${id}: ${String(err)}`);
			params.out.push(resolveDiscordMediaClassification({ attachment }));
		}
	}
}
function resolveStickerAssetCandidates(sticker) {
	const baseName = sticker.name?.trim() || `sticker-${sticker.id}`;
	const isLottie = sticker.format_type === StickerFormatType.Lottie;
	return (isLottie ? ["png", "json"] : [sticker.format_type === StickerFormatType.GIF ? "gif" : "png"]).map((extension) => ({
		url: `${DISCORD_STICKER_ASSET_BASE_URL}/${sticker.id}.${extension}${isLottie && extension === "png" ? "?size=160" : ""}`,
		fileName: `${baseName}.${extension}`
	}));
}
function formatStickerError(err) {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	try {
		return JSON.stringify(err) ?? "unknown error";
	} catch {
		return "unknown error";
	}
}
function inferStickerContentType(sticker) {
	switch (sticker.format_type) {
		case StickerFormatType.GIF: return "image/gif";
		case StickerFormatType.APNG:
		case StickerFormatType.Lottie:
		case StickerFormatType.PNG: return "image/png";
		default: return;
	}
}
async function appendResolvedMediaFromStickers(params) {
	for (const sticker of params.stickers ?? []) {
		const candidates = resolveStickerAssetCandidates(sticker);
		let lastError;
		for (const candidate of candidates) try {
			const saved = await fetchDiscordMedia(params, {
				url: candidate.url,
				filePathHint: candidate.fileName,
				fallbackContentType: inferStickerContentType(sticker),
				originalFilename: candidate.fileName
			});
			params.out.push({
				path: saved.path,
				contentType: saved.contentType,
				fileName: candidate.fileName,
				kind: "sticker"
			});
			lastError = null;
			break;
		} catch (err) {
			lastError = err;
		}
		if (lastError) {
			getChildLogger({ module: "discord-media" }).warn(`${params.errorPrefix} ${sticker.id}: ${formatStickerError(lastError)}`);
			params.out.push({
				contentType: inferStickerContentType(sticker),
				kind: "sticker"
			});
		}
	}
}
function isImageAttachment(attachment) {
	if ((attachment.content_type ?? "").startsWith("image/")) return true;
	const name = normalizeLowercaseStringOrEmpty(attachment.filename);
	if (!name) return false;
	return /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/.test(name);
}
/** Renders native Discord media only for transcript surfaces that cannot carry facts. */
function formatDiscordMediaText(params) {
	return formatMediaPlaceholderText([...(params.attachments ?? []).map((attachment) => resolveDiscordMediaClassification({ attachment })), ...(params.stickers ?? []).map(() => ({ kind: "sticker" }))]);
}
//#endregion
//#region extensions/discord/src/monitor/message-text.ts
function resolveDiscordEmbedText(embeds) {
	return (embeds ?? []).flatMap(({ title, description }) => [normalizeOptionalString(title), normalizeOptionalString(description)]).filter(Boolean).join("\n");
}
function resolveDiscordMessageText(message, options) {
	const baseText = resolveDiscordMentions(resolveDiscordMessageMentionDocuments(message).map((text) => text.trim()).join("\n") || normalizeOptionalString(options?.fallbackText) || "", message);
	if (!options?.includeForwarded) return baseText;
	return [baseText, resolveDiscordForwardedMessagesText(message)].filter(Boolean).join("\n");
}
function resolveDiscordMessageMentionDocuments(message) {
	const content = typeof message.content === "string" ? message.content : "";
	if (content.trim()) return [content];
	const embedDocuments = (message.embeds ?? []).flatMap(({ title, description }) => [title, description].filter((value) => typeof value === "string" && Boolean(value.trim())));
	if (embedDocuments.length > 0) return embedDocuments;
	const componentDocuments = [];
	collectDiscordTextDisplayDocuments(resolveDiscordMessageComponents(message), componentDocuments);
	return componentDocuments;
}
function resolveDiscordMessageBatch(last, preceding) {
	if (preceding.length === 0) return last;
	const content = [...preceding, last].map((message) => resolveDiscordMessageText(message, { includeForwarded: false })).filter(Boolean).join("\n");
	return Object.create(Object.getPrototypeOf(last), {
		...Object.getOwnPropertyDescriptors(last),
		content: {
			value: content,
			enumerable: true,
			configurable: true
		},
		attachments: {
			value: [],
			enumerable: true,
			configurable: true
		},
		message_snapshots: {
			value: last.message_snapshots,
			enumerable: true,
			configurable: true
		},
		messageSnapshots: {
			value: last.messageSnapshots,
			enumerable: true,
			configurable: true
		},
		rawData: {
			value: { ...last.rawData },
			enumerable: true,
			configurable: true
		}
	});
}
/** Adds native media text only for history surfaces that cannot carry structured facts. */
function resolveDiscordMessageHistoryText(message, options) {
	return [resolveDiscordMessageText(message, options), formatDiscordMediaText({
		attachments: message.attachments ?? void 0,
		stickers: resolveDiscordMessageStickers(message)
	})].filter(Boolean).join("\n");
}
function resolveDiscordMentions(text, message) {
	if (!text.includes("<")) return text;
	const mentions = message.mentionedUsers ?? [];
	if (!Array.isArray(mentions) || mentions.length === 0) return text;
	let out = text;
	for (const user of mentions) {
		const label = user.globalName || user.username || user.id;
		out = out.replace(new RegExp(`<@!?${user.id}>`, "g"), () => `@${label}`);
	}
	return out;
}
function resolveDiscordForwardedMessagesText(message) {
	const snapshots = resolveDiscordMessageSnapshots(message);
	if (snapshots.length > 0) return resolveDiscordForwardedMessagesTextFromSnapshots(snapshots);
	const referencedForward = resolveDiscordReferencedForwardMessage(message);
	if (!referencedForward) return "";
	return formatDiscordForwardedMessageBlock(resolveDiscordMessageHistoryText(referencedForward), referencedForward.author);
}
function resolveDiscordMessageComponents(message) {
	const components = message.components;
	if (components !== void 0) return components;
	try {
		return message.rawData?.components;
	} catch {
		return;
	}
}
function extractDiscordComponentsV2Text(components) {
	const parts = [];
	collectDiscordTextDisplayDocuments(components, parts);
	return parts.map((part) => part.trim()).join("\n");
}
function collectDiscordTextDisplayDocuments(value, parts) {
	if (Array.isArray(value)) {
		for (const entry of value) collectDiscordTextDisplayDocuments(entry, parts);
		return;
	}
	if (!value || typeof value !== "object") return;
	const component = value;
	if (component.type === ComponentType.TextDisplay && typeof component.content === "string" && component.content.trim()) parts.push(component.content);
	collectDiscordTextDisplayDocuments(component.components, parts);
	collectDiscordTextDisplayDocuments(component.component, parts);
}
function resolveDiscordForwardedMessagesTextFromSnapshots(snapshots) {
	return snapshots.map(({ message }) => message ? formatDiscordForwardedMessageBlock(resolveDiscordRawMessageText(message), message.author) : "").filter(Boolean).join("\n\n");
}
function formatDiscordForwardedMessageBlock(text, author) {
	if (!text) return "";
	const authorLabel = formatDiscordSnapshotAuthor(author);
	return `${authorLabel ? `[Forwarded message from ${authorLabel}]` : "[Forwarded message]"}\n${text}`;
}
/** Single owner for raw Discord message payloads (REST fetches and forwarded snapshots). */
function resolveDiscordRawMessageText(message) {
	const content = normalizeOptionalString(message.content) ?? "";
	const mediaText = formatDiscordMediaText({
		attachments: message.attachments ?? void 0,
		stickers: resolveDiscordSnapshotStickers(message)
	});
	return [content || resolveDiscordEmbedText(message.embeds) || extractDiscordComponentsV2Text(message.components) || resolveDiscordForwardedMessagesTextFromSnapshots(normalizeDiscordMessageSnapshots(message.message_snapshots)), mediaText].filter(Boolean).join("\n");
}
//#endregion
//#region extensions/discord/src/monitor/threading.cache.ts
const DISCORD_THREAD_STARTER_CACHE_TTL_MS = 3e5;
const DISCORD_THREAD_STARTER_NEGATIVE_CACHE_TTL_MS = 3e4;
const DISCORD_THREAD_STARTER_CACHE_MAX = 500;
const DISCORD_THREAD_STARTER_CACHE = /* @__PURE__ */ new Map();
function getCachedThreadStarter(key, now) {
	const entry = DISCORD_THREAD_STARTER_CACHE.get(key);
	if (!entry) return;
	const ttlMs = entry.value.kind === "miss" ? DISCORD_THREAD_STARTER_NEGATIVE_CACHE_TTL_MS : DISCORD_THREAD_STARTER_CACHE_TTL_MS;
	if (now < entry.updatedAt || now - entry.updatedAt >= ttlMs) {
		DISCORD_THREAD_STARTER_CACHE.delete(key);
		return;
	}
	DISCORD_THREAD_STARTER_CACHE.delete(key);
	DISCORD_THREAD_STARTER_CACHE.set(key, entry);
	return entry.value;
}
function setCachedThreadStarter(key, value, now) {
	DISCORD_THREAD_STARTER_CACHE.delete(key);
	DISCORD_THREAD_STARTER_CACHE.set(key, {
		value,
		updatedAt: now
	});
	pruneMapToMaxSize(DISCORD_THREAD_STARTER_CACHE, DISCORD_THREAD_STARTER_CACHE_MAX);
}
//#endregion
//#region extensions/discord/src/monitor/threading.starter.ts
const IN_FLIGHT_DISCORD_THREAD_STARTERS = /* @__PURE__ */ new Map();
function resolveDiscordThreadChannel(params) {
	if (!params.isGuildMessage) return null;
	const { message, channelInfo } = params;
	const channel = "channel" in message ? message.channel : void 0;
	if (channel && typeof channel === "object" && "isThread" in channel && typeof channel.isThread === "function" && channel.isThread()) return channel;
	if (!isDiscordThreadChannelType(channelInfo?.type)) return null;
	const messageChannelId = params.messageChannelId || resolveDiscordMessageChannelId({ message });
	if (!messageChannelId) return null;
	return {
		id: messageChannelId,
		name: channelInfo?.name ?? void 0,
		parentId: channelInfo?.parentId ?? void 0,
		parent: void 0,
		ownerId: channelInfo?.ownerId ?? void 0
	};
}
async function resolveDiscordThreadParentInfo(params) {
	const { threadChannel, channelInfo, client } = params;
	const parent = resolveDiscordChannelParentSafe(threadChannel);
	let parentId = resolveDiscordChannelParentIdSafe(threadChannel) ?? resolveDiscordChannelIdSafe(parent) ?? channelInfo?.parentId ?? void 0;
	if (!parentId && threadChannel.id) parentId = (await resolveDiscordChannelInfo(client, threadChannel.id))?.parentId ?? void 0;
	if (!parentId) return {};
	let parentName = resolveDiscordChannelNameSafe(parent);
	const parentInfo = await resolveDiscordChannelInfo(client, parentId);
	parentName = parentName ?? parentInfo?.name;
	const parentType = parentInfo?.type;
	return {
		id: parentId,
		name: parentName,
		type: parentType
	};
}
async function resolveDiscordThreadStarter(params) {
	const messageChannelId = params.parentType === discord_exports.ChannelType.GuildForum || params.parentType === discord_exports.ChannelType.GuildMedia ? params.channel.id : params.parentId;
	if (!messageChannelId) return null;
	const cacheKey = `${params.accountId}:${params.channel.id}:${messageChannelId}`;
	const cached = getCachedThreadStarter(cacheKey, Date.now());
	if (cached) return cached.kind === "hit" ? cached.starter : null;
	const inFlight = IN_FLIGHT_DISCORD_THREAD_STARTERS.get(cacheKey);
	if (inFlight) return inFlight;
	const pending = resolveDiscordThreadStarterUncached(params, cacheKey, messageChannelId);
	IN_FLIGHT_DISCORD_THREAD_STARTERS.set(cacheKey, pending);
	try {
		return await pending;
	} finally {
		if (IN_FLIGHT_DISCORD_THREAD_STARTERS.get(cacheKey) === pending) IN_FLIGHT_DISCORD_THREAD_STARTERS.delete(cacheKey);
	}
}
async function resolveDiscordThreadStarterUncached(params, cacheKey, messageChannelId) {
	const cacheMiss = () => {
		setCachedThreadStarter(cacheKey, { kind: "miss" }, Date.now());
	};
	try {
		const starter = await getChannelMessage(params.client.rest, messageChannelId, params.channel.id);
		const payload = starter ? buildDiscordThreadStarterPayload({
			starter,
			resolveTimestampMs: params.resolveTimestampMs
		}) : null;
		if (!payload) {
			cacheMiss();
			return null;
		}
		setCachedThreadStarter(cacheKey, {
			kind: "hit",
			starter: payload
		}, Date.now());
		return payload;
	} catch (error) {
		if (error instanceof DiscordError && (error.status === 403 || error.status === 404)) cacheMiss();
		return null;
	}
}
function buildDiscordThreadStarterPayload(params) {
	const text = resolveDiscordRawMessageText(params.starter);
	if (!text) return null;
	const starter = params.starter;
	const authorTag = resolveDiscordThreadStarterAuthorTag(starter.author);
	return {
		text,
		author: starter.member?.nick ?? starter.member?.displayName ?? authorTag ?? starter.author?.username ?? starter.author?.id ?? "Unknown",
		authorId: starter.author?.id ?? void 0,
		authorName: starter.author?.username ?? void 0,
		authorTag,
		memberRoleIds: Array.isArray(starter.member?.roles) ? starter.member.roles : void 0,
		timestamp: params.resolveTimestampMs(starter.timestamp) ?? void 0
	};
}
function resolveDiscordThreadStarterAuthorTag(author) {
	if (!author?.username || !author.discriminator) return;
	if (author.discriminator !== "0") return `${author.username}#${author.discriminator}`;
	return author.username;
}
function resolveDiscordReplyTarget(opts) {
	return createReplyReferencePlanner({
		replyToMode: opts.replyToMode,
		startId: opts.replyToId,
		hasReplied: opts.hasReplied
	}).peek();
}
function sanitizeDiscordThreadName(rawName, fallbackId) {
	const baseSource = rawName.replace(/<@!?\d+>/g, "").replace(/<@&\d+>/g, "").replace(/<#\d+>/g, "").replace(/\s+/g, " ").trim() || `Thread ${fallbackId}`;
	return truncateUtf16Safe(baseSource, 80);
}
function resolveDiscordReplyDeliveryPlan(params) {
	const deliverTarget = params.createdThreadId ? `channel:${params.createdThreadId}` : params.replyTarget;
	const allowReference = deliverTarget === params.replyTarget;
	return {
		deliverTarget,
		replyTarget: deliverTarget,
		replyReference: createReplyReferencePlanner({
			replyToMode: allowReference ? params.replyToMode : "off",
			existingId: params.threadChannel ? params.messageId : void 0,
			startId: params.messageId,
			allowReference
		})
	};
}
//#endregion
//#region extensions/discord/src/monitor/thread-channel-context.ts
async function resolveDiscordThreadLikeChannelContext(params) {
	const safeChannelInfo = resolveDiscordChannelInfoSafe(params.channel);
	const channelId = resolveDiscordChannelIdSafe(params.channel) ?? params.channelIdFallback ?? "";
	const channelInfo = params.channelInfo !== void 0 ? params.channelInfo : channelId ? await resolveDiscordChannelInfo(params.client, channelId) : null;
	const channelType = safeChannelInfo.type ?? channelInfo?.type;
	const channelName = safeChannelInfo.name ?? channelInfo?.name;
	const channelSlug = channelName ? normalizeDiscordSlug(channelName) : "";
	const parentId = resolveDiscordChannelParentIdSafe(params.channel) ?? channelInfo?.parentId;
	const isThreadChannel = isDiscordThreadChannelType(channelType);
	let threadParentId;
	let threadParentName;
	let threadParentSlug = "";
	if (channelId && isThreadChannel) {
		const parentInfo = await resolveDiscordThreadParentInfo({
			client: params.client,
			threadChannel: {
				id: channelId,
				name: channelName,
				parentId,
				parent: void 0
			},
			channelInfo
		});
		threadParentId = parentInfo.id;
		threadParentName = parentInfo.name;
		threadParentSlug = threadParentName ? normalizeDiscordSlug(threadParentName) : "";
	}
	return {
		channelType,
		isThreadChannel,
		channelId,
		channelName,
		channelSlug,
		parentId,
		threadParentId,
		threadParentName,
		threadParentSlug,
		channelInfo
	};
}
async function resolveFetchedDiscordThreadLikeChannelContext(params) {
	return await resolveDiscordThreadLikeChannelContext({
		...params,
		channelInfo: buildDiscordChannelInfo(params.channel)
	});
}
//#endregion
//#region extensions/discord/src/voice/config.ts
function resolveDiscordVoiceEnabled(voice) {
	if (voice?.enabled !== void 0) return voice.enabled;
	return voice !== void 0;
}
//#endregion
//#region extensions/discord/src/voice/owner-access.ts
async function resolveDiscordVoiceAccessTarget(params) {
	const [guild, channel] = await Promise.all([params.client.fetchGuild(params.guildId).catch(() => null), params.client.fetchChannel(params.channelId).catch(() => null)]);
	if (!guild || !channel) return;
	const context = await resolveFetchedDiscordThreadLikeChannelContext({
		client: params.client,
		channel,
		channelIdFallback: params.channelId
	});
	return {
		guild,
		...context.channelName ? { channelName: context.channelName } : {},
		channelSlug: context.channelSlug,
		...context.parentId ? { parentId: context.parentId } : {},
		...context.threadParentName ? { parentName: context.threadParentName } : {},
		...context.threadParentSlug ? { parentSlug: context.threadParentSlug } : {},
		scope: context.isThreadChannel ? "thread" : "channel"
	};
}
function resolveDiscordVoiceAccess(params) {
	const commandOwnerAllowFrom = resolveDiscordCommandOwnerAllowFrom(params.cfg);
	return {
		admissionAllowFrom: commandOwnerAllowFrom ?? resolveDiscordAccountAllowFrom({
			cfg: params.cfg,
			accountId: params.accountId
		}) ?? params.discordConfig.allowFrom ?? [],
		ownerAllowFrom: commandOwnerAllowFrom ?? []
	};
}
//#endregion
//#region extensions/discord/src/voice/access.ts
async function authorizeDiscordVoiceIngress(initialParams) {
	const policy = await initialParams.readPolicy?.();
	if (policy?.isCurrent() === false) return {
		ok: false,
		message: "Access policy changed. Try this interaction again."
	};
	const params = policy ? {
		...initialParams,
		...policy,
		admissionAllowFrom: resolveDiscordVoiceAccess(policy).admissionAllowFrom
	} : initialParams;
	const groupPolicy = params.groupPolicy ?? resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.discord !== void 0,
		groupPolicy: params.discordConfig.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	}).groupPolicy;
	const guild = params.guild ?? {
		id: params.guildId,
		...params.guildName ? { name: params.guildName } : {}
	};
	const guildInfo = resolveDiscordGuildEntry({
		guild,
		guildId: params.guildId,
		guildEntries: params.discordConfig.guilds
	});
	const channelConfig = params.channelId ? resolveDiscordChannelConfigWithFallback({
		...params,
		guildInfo
	}) : null;
	if (channelConfig?.enabled === false) return {
		ok: false,
		message: "This channel is disabled."
	};
	const channelAllowlistConfigured = hasConfiguredDiscordChannels(guildInfo?.channels);
	const channelAllowed = channelConfig ? channelConfig.allowed : !channelAllowlistConfigured;
	if (!params.channelId && groupPolicy === "allowlist" && channelAllowlistConfigured || !isDiscordGroupAllowedByPolicy({
		groupPolicy,
		guildAllowlisted: Boolean(guildInfo),
		channelAllowlistConfigured,
		channelAllowed
	}) || channelConfig?.allowed === false) return {
		ok: false,
		message: `${params.channelLabel ?? "This channel"} is not allowlisted for voice commands.`
	};
	const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig,
		guildInfo,
		memberRoleIds: params.memberRoleIds,
		sender: params.sender,
		allowNameMatching: false
	});
	const admissionAllowList = normalizeDiscordAllowList(params.admissionAllowFrom ?? params.discordConfig.allowFrom, [
		"discord:",
		"user:",
		"pk:"
	]);
	const admissionAllowed = admissionAllowList ? allowListMatches(admissionAllowList, params.sender, { allowNameMatching: false }) : false;
	return resolveCommandAuthorizedFromAuthorizers({
		useAccessGroups: true,
		authorizers: [{
			configured: admissionAllowList != null,
			allowed: admissionAllowed
		}, {
			configured: hasAccessRestrictions,
			allowed: memberAllowed
		}],
		modeWhenAccessGroupsOff: "configured"
	}) ? {
		ok: true,
		channelConfig,
		...policy ? { isCurrent: policy.isCurrent } : {}
	} : {
		ok: false,
		message: "You are not authorized to use this command."
	};
}
//#endregion
//#region extensions/discord/src/voice/transcripts-source.ts
const TRANSCRIPTS_STATE = resolveGlobalSingleton(Symbol.for("openclaw.discordTranscriptsState"), () => ({
	managersByAccountId: /* @__PURE__ */ new Map(),
	captures: /* @__PURE__ */ new Map(),
	managerWaiters: /* @__PURE__ */ new Set(),
	captureEpochReaders: /* @__PURE__ */ new Map(),
	nextRecordingEpoch: 0n
}));
const managersByAccountId = TRANSCRIPTS_STATE.managersByAccountId;
const captures = TRANSCRIPTS_STATE.captures;
const managerWaiters = TRANSCRIPTS_STATE.managerWaiters;
const logger = createSubsystemLogger("discord/voice");
function captureKey(source) {
	return JSON.stringify([
		source.accountId,
		source.guildId,
		source.channelId
	]);
}
function publishCaptureEpoch(key) {
	const capture = captures.get(key);
	for (const reader of TRANSCRIPTS_STATE.captureEpochReaders.get(key) ?? []) {
		const currentManager = managersByAccountId.get(reader.source.accountId) === reader.manager;
		Atomics.store(reader.clock, 0, currentManager ? capture?.recordingEpoch ?? 0n : 0n);
	}
}
function publishAccountCaptureEpochs(accountId) {
	for (const [key, readers] of TRANSCRIPTS_STATE.captureEpochReaders) if ([...readers].some((reader) => reader.source.accountId === accountId)) publishCaptureEpoch(key);
}
/** Registration changes publish synchronously, before callbacks or transport awaits.
* A worker stamps each raw packet; delayed decode can resolve only that same lease. */
function bindDiscordCaptureReceipts(source, manager) {
	const key = captureKey(source);
	const state = new SharedArrayBuffer(8);
	const reader = {
		source,
		manager,
		clock: new BigInt64Array(state)
	};
	const readers = TRANSCRIPTS_STATE.captureEpochReaders.get(key) ?? /* @__PURE__ */ new Set();
	readers.add(reader);
	TRANSCRIPTS_STATE.captureEpochReaders.set(key, readers);
	publishCaptureEpoch(key);
	let closed = false;
	return {
		state,
		resolve(epoch) {
			if (closed || epoch === 0n) return;
			const capture = captures.get(key);
			return capture?.recordingEpoch === epoch ? capture : void 0;
		},
		close() {
			if (closed) return;
			closed = true;
			Atomics.store(reader.clock, 0, 0n);
			readers.delete(reader);
			if (readers.size === 0) TRANSCRIPTS_STATE.captureEpochReaders.delete(key);
		}
	};
}
function notifyCaptureRetired(capture) {
	if (!capture?.onStatus) return;
	const warn = (error) => logger.warn(`discord voice: transcripts terminal notification failed: ${formatErrorMessage(error)}`);
	try {
		Promise.resolve(capture.onStatus({
			active: false,
			sessionId: capture.sessionId,
			source: {
				providerId: "discord-voice",
				...capture.source
			}
		})).catch(warn);
	} catch (error) {
		warn(error);
	}
}
function resolveDiscordTranscriptsCapture(source, manager) {
	return managersByAccountId.get(source.accountId) === manager ? captures.get(captureKey(source)) : void 0;
}
const ACCOUNT_ID_ERROR_MAX_CHARS = 64;
const ACCOUNT_ID_ERROR_MAX_ENTRIES = 4;
function formatAccountIdForError(accountId) {
	return JSON.stringify(truncateUtf16Safe(accountId, ACCOUNT_ID_ERROR_MAX_CHARS));
}
function summarizeAccountIdsForError(accountIds) {
	return summarizeStringEntries({
		entries: accountIds.map(formatAccountIdForError),
		limit: ACCOUNT_ID_ERROR_MAX_ENTRIES
	});
}
function setDiscordTranscriptsVoiceManager(params) {
	if (managersByAccountId.get(params.accountId) === params.manager) return;
	if (params.manager) {
		const manager = params.manager;
		managersByAccountId.set(params.accountId, manager);
		publishAccountCaptureEpochs(params.accountId);
		for (const capture of captures.values()) if (capture.started && capture.source.accountId === params.accountId) manager.startTranscriptsCapture(capture.source).then((result) => {
			if (!result.ok && resolveDiscordTranscriptsCapture(capture.source, manager)?.subscriptionToken === capture.subscriptionToken) logger.warn(`discord voice: transcripts reattach failed: ${result.message}`);
		}).catch((error) => logger.warn(`discord voice: transcripts reattach failed: ${formatErrorMessage(error)}`));
	} else if (managersByAccountId.get(params.accountId) === params.expectedManager) {
		managersByAccountId.delete(params.accountId);
		publishAccountCaptureEpochs(params.accountId);
	} else return;
	for (const waiter of managerWaiters) if (!waiter.accountId || waiter.accountId === params.accountId) waiter.resolve();
}
const resolveDiscordTranscriptsAccountId = ({ cfg, source }) => {
	const requestedAccountId = source.accountId?.trim();
	const configuredVoiceAccounts = cfg ? listEnabledDiscordAccounts(cfg).filter((account) => resolveDiscordVoiceEnabled(account.config.voice)) : [];
	const capableAccountIds = (cfg ? configuredVoiceAccounts.filter((account) => account.tokenStatus === "available").map((account) => account.accountId) : [...managersByAccountId.keys()]).toSorted();
	if (requestedAccountId) {
		if (!cfg || capableAccountIds.includes(requestedAccountId)) return {
			ok: true,
			value: requestedAccountId
		};
		if (resolveDiscordAccount({
			cfg,
			accountId: requestedAccountId
		}).tokenStatus === "configured_unavailable") return {
			ok: false,
			error: `Discord account ${formatAccountIdForError(requestedAccountId)} has configured credentials that are unavailable in this runtime; resolve its SecretRef before using this account.`
		};
		return {
			ok: false,
			error: `Discord account ${formatAccountIdForError(requestedAccountId)} is not enabled for voice.`
		};
	}
	if (capableAccountIds.length === 1) return {
		ok: true,
		value: capableAccountIds[0]
	};
	if (capableAccountIds.length === 0) return {
		ok: false,
		error: "No Discord account has available credentials and voice enabled; configure credentials and enable voice for an account."
	};
	const configuredDefaultAccountId = cfg?.channels?.discord?.defaultAccount?.trim();
	if (configuredDefaultAccountId) {
		const normalizedDefaultAccountId = normalizeAccountId(configuredDefaultAccountId);
		if (capableAccountIds.includes(normalizedDefaultAccountId)) return {
			ok: true,
			value: normalizedDefaultAccountId
		};
	}
	if (capableAccountIds.includes(DEFAULT_ACCOUNT_ID)) return {
		ok: true,
		value: DEFAULT_ACCOUNT_ID
	};
	return {
		ok: false,
		error: `Multiple Discord accounts are enabled for voice (${summarizeAccountIdsForError(capableAccountIds)}); specify accountId.`
	};
};
async function waitForManager(request) {
	const accountResolution = resolveDiscordTranscriptsAccountId({
		cfg: request.cfg,
		source: request.source
	});
	if (!accountResolution.ok) return accountResolution;
	const accountId = accountResolution.value;
	const existing = accountId ? managersByAccountId.get(accountId) : void 0;
	if (existing && accountId) return {
		ok: true,
		value: {
			accountId,
			manager: existing
		}
	};
	if (request.abortSignal?.aborted) return {
		ok: true,
		value: void 0
	};
	const startupWaitMs = request.startupWaitMs ?? 0;
	if (startupWaitMs <= 0) return {
		ok: true,
		value: void 0
	};
	await new Promise((resolve) => {
		const waiter = {
			accountId,
			resolve: () => {
				clearTimeout(timer);
				request.abortSignal?.removeEventListener("abort", waiter.resolve);
				managerWaiters.delete(waiter);
				resolve();
			}
		};
		const timer = setTimeout(waiter.resolve, startupWaitMs);
		timer.unref?.();
		request.abortSignal?.addEventListener("abort", waiter.resolve, { once: true });
		managerWaiters.add(waiter);
	});
	if (request.abortSignal?.aborted) return {
		ok: true,
		value: void 0
	};
	const manager = accountId ? managersByAccountId.get(accountId) : void 0;
	return {
		ok: true,
		value: accountId && manager ? {
			accountId,
			manager
		} : void 0
	};
}
const discordVoiceTranscriptsSourceProvider = {
	id: "discord-voice",
	aliases: ["discord"],
	accessControl: {
		channelId: "discord",
		resolveAccountId: resolveDiscordTranscriptsAccountId,
		async authorize({ caller, cfg, source }) {
			if (caller.kind === "operator") return {
				ok: true,
				value: void 0
			};
			const guildId = source.guildId?.trim();
			const channelId = source.channelId?.trim();
			const callerAccountId = caller.accountId?.trim();
			const sourceAccountId = source.accountId?.trim();
			if (caller.channel !== "discord" || !cfg || !callerAccountId || sourceAccountId !== callerAccountId || !guildId || !channelId || caller.groupSpace !== guildId) return {
				ok: false,
				error: "You are not authorized to use this command."
			};
			const manager = managersByAccountId.get(callerAccountId);
			const target = await manager?.resolveAccessTarget({
				guildId,
				channelId
			});
			if (!target) return {
				ok: false,
				error: "Discord voice access target is unavailable."
			};
			const account = resolveDiscordAccount({
				cfg,
				accountId: callerAccountId
			});
			const access = await authorizeDiscordVoiceIngress({
				...target,
				readPolicy: manager?.readPolicy,
				cfg,
				discordConfig: account.config,
				accountId: account.accountId,
				guildId,
				channelId,
				memberRoleIds: [...caller.roleIds],
				admissionAllowFrom: resolveDiscordVoiceAccess({
					cfg,
					discordConfig: account.config,
					accountId: account.accountId
				}).admissionAllowFrom,
				sender: { id: caller.senderId }
			});
			return access.ok ? {
				ok: true,
				value: void 0
			} : {
				ok: false,
				error: access.message
			};
		}
	},
	name: "Discord Voice",
	sourceKinds: ["live-audio"],
	async watchOccupancy(request) {
		const managerResolution = await waitForManager(request);
		if (!managerResolution.ok) return managerResolution;
		const binding = managerResolution.value;
		if (!binding) return {
			ok: false,
			error: "Discord voice manager is not available."
		};
		if (request.abortSignal?.aborted) return {
			ok: false,
			error: "Discord transcripts occupancy watch aborted."
		};
		const guildId = request.source.guildId?.trim();
		const channelId = request.source.channelId?.trim();
		if (!guildId || !channelId) return {
			ok: false,
			error: "Discord transcripts require guildId and channelId."
		};
		const { accountId } = binding;
		let stopped = false;
		let wasOccupied = false;
		let currentManager;
		let unsubscribe;
		const watcher = {
			accountId,
			resolve: () => {
				const manager = managersByAccountId.get(accountId);
				if (stopped || currentManager === manager) return;
				currentManager = manager;
				unsubscribe?.();
				unsubscribe = void 0;
				const release = manager?.watchChannelOccupancy({
					guildId,
					channelId
				}, ({ occupied }) => {
					if (stopped || request.abortSignal?.aborted || managersByAccountId.get(accountId) !== manager) return;
					if (occupied === wasOccupied) return;
					wasOccupied = occupied;
					if (occupied) request.onOccupied();
					else request.onEmpty();
				});
				if (stopped || currentManager !== manager) release?.();
				else unsubscribe = release;
			}
		};
		const stop = () => {
			stopped = true;
			managerWaiters.delete(watcher);
			unsubscribe?.();
			unsubscribe = void 0;
			request.abortSignal?.removeEventListener("abort", stop);
		};
		managerWaiters.add(watcher);
		request.abortSignal?.addEventListener("abort", stop, { once: true });
		if (request.abortSignal?.aborted) stop();
		else watcher.resolve();
		return {
			ok: true,
			value: { stop }
		};
	},
	async start(request) {
		const managerResolution = await waitForManager({
			...request,
			source: request.session.source
		});
		if (!managerResolution.ok) return managerResolution;
		const binding = managerResolution.value;
		if (!binding) return {
			ok: false,
			error: "Discord voice manager is not available."
		};
		if (request.abortSignal?.aborted) return {
			ok: false,
			error: "Discord transcripts start aborted."
		};
		const guildId = request.session.source.guildId?.trim();
		const channelId = request.session.source.channelId?.trim();
		if (!guildId || !channelId) return {
			ok: false,
			error: "Discord transcripts require guildId and channelId."
		};
		const { accountId, manager } = binding;
		if (managersByAccountId.get(accountId) !== manager) return {
			ok: false,
			error: "Discord voice manager changed before capture could start."
		};
		const source = {
			accountId,
			guildId,
			channelId
		};
		if (request.cfg?.tools?.media?.audio?.enabled === false && !manager.hasRealtimeCapture(source)) return {
			ok: false,
			error: "Discord transcripts require batch audio understanding when no realtime conversation is active; enable tools.media.audio.enabled."
		};
		const key = captureKey(source);
		const previous = captures.get(key);
		const capture = {
			source,
			recordingEpoch: ++TRANSCRIPTS_STATE.nextRecordingEpoch,
			subscriptionToken: previous?.started ? previous.subscriptionToken : Symbol("discord-transcripts-subscription"),
			started: false,
			onStatus: request.onStatus,
			sessionId: request.session.sessionId,
			isCurrent: () => captures.get(key) === capture,
			onBatchUnavailable: () => {
				if (!capture.isCurrent() || capture.warning) return;
				capture.warning = "Independent batch transcription is unavailable; only safely bound realtime finals can be recorded. Configure audio transcription for full recording coverage.";
				logger.warn(`discord voice: ${capture.warning}`);
			},
			onUtterance: (utterance) => {
				if (capture.isCurrent()) return request.onUtterance(utterance);
			}
		};
		captures.set(key, capture);
		publishCaptureEpoch(key);
		notifyCaptureRetired(previous);
		try {
			let channelName = previous?.channelName;
			if (!previous?.started) {
				const joined = await manager.startTranscriptsCapture(source);
				if (!joined.ok) return {
					ok: false,
					error: joined.message
				};
				channelName = joined.channelName;
			}
			if (request.abortSignal?.aborted || resolveDiscordTranscriptsCapture(source, manager) !== capture) return {
				ok: false,
				error: "Discord transcripts start was cancelled."
			};
			capture.started = true;
			capture.channelName = channelName;
			if (request.cfg?.tools?.media?.audio?.enabled === false) capture.onBatchUnavailable?.();
			return {
				ok: true,
				session: {
					...request.session,
					...!request.session.title && channelName?.trim() ? { title: channelName.trim() } : {},
					source: {
						...request.session.source,
						accountId,
						guildId,
						channelId
					}
				}
			};
		} finally {
			if (!capture.started && captures.get(key) === capture) {
				captures.delete(key);
				publishCaptureEpoch(key);
				notifyCaptureRetired(capture);
				await manager.stopTranscriptsCapture(source);
			}
		}
	},
	async stop(request) {
		const accountId = request.source.accountId?.trim();
		if (!accountId) return {
			ok: false,
			error: "Discord transcripts require accountId to stop a voice session."
		};
		const guildId = request.source.guildId?.trim();
		const channelId = request.source.channelId?.trim();
		if (!guildId || !channelId) return {
			ok: false,
			error: "Discord transcripts require guildId and channelId."
		};
		const source = {
			accountId,
			guildId,
			channelId
		};
		const key = captureKey(source);
		const capture = captures.get(key);
		if (capture?.sessionId !== request.sessionId) return {
			ok: false,
			error: "Transcripts session is not active in this voice channel."
		};
		captures.delete(key);
		publishCaptureEpoch(key);
		notifyCaptureRetired(capture);
		await managersByAccountId.get(accountId)?.stopTranscriptsCapture(source);
		return {
			ok: true,
			sessionId: request.sessionId,
			stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	},
	async status(source) {
		const accountId = source.accountId?.trim();
		if (!accountId) return [];
		return [...captures.values()].filter((capture) => capture.source.accountId === accountId && (!source.guildId || capture.source.guildId === source.guildId.trim()) && (!source.channelId || capture.source.channelId === source.channelId.trim())).map((capture) => ({
			active: capture.started,
			sessionId: capture.sessionId,
			message: capture.warning ?? "Capture registered; recording while connected to the selected channel.",
			source: {
				providerId: "discord-voice",
				...capture.source
			}
		}));
	}
};
//#endregion
export { resolveDiscordChannelInfo as A, resolveMediaList as C, resolveDiscordMessageStickers as D, hasDiscordMessageStickers as E, resolveDiscordReferencedReplyMessage as O, resolveForwardedMediaList as S, resolveDiscordCdnPolicy as T, resolveDiscordMessageBatch as _, authorizeDiscordVoiceIngress as a, resolveDiscordMessageText as b, resolveDiscordVoiceEnabled as c, resolveDiscordReplyDeliveryPlan as d, resolveDiscordReplyTarget as f, sanitizeDiscordThreadName as g, resolveDiscordThreadStarter as h, setDiscordTranscriptsVoiceManager as i, resolveDiscordMessageChannelId as j, resolveDiscordReferencedReplyMessageId as k, resolveDiscordThreadLikeChannelContext as l, resolveDiscordThreadParentInfo as m, discordVoiceTranscriptsSourceProvider as n, resolveDiscordVoiceAccess as o, resolveDiscordThreadChannel as p, resolveDiscordTranscriptsCapture as r, resolveDiscordVoiceAccessTarget as s, bindDiscordCaptureReceipts as t, resolveFetchedDiscordThreadLikeChannelContext as u, resolveDiscordMessageHistoryText as v, resolveReferencedReplyMediaList as w, formatDiscordMediaText as x, resolveDiscordMessageMentionDocuments as y };
