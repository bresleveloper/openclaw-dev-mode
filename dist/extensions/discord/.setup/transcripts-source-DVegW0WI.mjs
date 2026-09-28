import { Ut as __exportAll, _ as DiscordError, ct as createThread, dt as editChannel, mt as getChannelMessage, t as discord_exports } from "./discord-BXpHW-cu.mjs";
import { E as getDiscordEndpointRuntime, O as resolveDiscordEndpointMediaGuard, f as resolveDiscordGuildEntry, i as normalizeDiscordAllowList, l as resolveDiscordChannelConfigWithFallback, n as allowListMatches, o as normalizeDiscordSlug, p as resolveDiscordMemberAccessState, r as isDiscordGroupAllowedByPolicy, t as isDiscordThreadChannelType } from "./channel-type-DKnjV1XW.mjs";
import { a as listEnabledDiscordAccounts, c as resolveDiscordAccount, l as resolveDiscordAccountAllowFrom } from "./accounts-CwJQoLjM.mjs";
import { t as resolveDiscordCommandOwnerAllowFrom } from "./command-owners-D78sAoOz.mjs";
import { a as resolveDiscordChannelParentSafe, i as resolveDiscordChannelParentIdSafe, n as resolveDiscordChannelInfoSafe, r as resolveDiscordChannelNameSafe, t as resolveDiscordChannelIdSafe } from "./channel-access-C12aDZ0p.mjs";
import { ComponentType, StickerFormatType } from "discord-api-types/v10";
import { asDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/ssrf-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { buildAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId, summarizeStringEntries, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getFileExtension, normalizeMimeType } from "openclaw/plugin-sdk/media-mime";
import { createSubsystemLogger, getChildLogger, logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { createReplyReferencePlanner } from "openclaw/plugin-sdk/reply-reference";
import { saveRemoteMedia } from "openclaw/plugin-sdk/media-runtime";
import { resolveCommandAuthorizedFromAuthorizers } from "openclaw/plugin-sdk/command-auth-native";
import { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { resolveChannelModelOverride } from "openclaw/plugin-sdk/model-session-runtime";
import { generateConversationLabel } from "openclaw/plugin-sdk/reply-dispatch-runtime";
import { formatMediaPlaceholderText } from "openclaw/plugin-sdk/channel-inbound";
//#region extensions/discord/src/monitor/message-channel-info-state.ts
const discordChannelInfoCacheState = { entries: /* @__PURE__ */ new Map() };
//#endregion
//#region extensions/discord/src/monitor/message-channel-info.ts
const DISCORD_CHANNEL_INFO_CACHE_TTL_MS = 3e5;
const DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS = 3e4;
const DISCORD_CHANNEL_INFO_CACHE_MAX_ENTRIES = 1e3;
function resolveDiscordChannelInfoCacheExpiresAt(ttlMs, nowMs) {
	return resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs });
}
function cacheDiscordChannelInfo(channelId, value, ttlMs, nowMs) {
	const expiresAt = resolveDiscordChannelInfoCacheExpiresAt(ttlMs, nowMs);
	if (expiresAt !== void 0) {
		discordChannelInfoCacheState.entries.set(channelId, {
			value,
			expiresAt
		});
		pruneMapToMaxSize(discordChannelInfoCacheState.entries, DISCORD_CHANNEL_INFO_CACHE_MAX_ENTRIES);
	}
}
function normalizeDiscordChannelId(value) {
	return normalizeOptionalStringifiedId(value) ?? "";
}
function resolveDiscordMessageChannelId(params) {
	const message = params.message;
	return normalizeDiscordChannelId(message.channelId) || normalizeDiscordChannelId(message.channel_id) || normalizeDiscordChannelId(message.rawData?.channel_id) || normalizeDiscordChannelId(params.eventChannelId);
}
async function resolveDiscordChannelInfo(client, channelId) {
	const rawNow = Date.now();
	const now = asDateTimestampMs(rawNow);
	const cached = discordChannelInfoCacheState.entries.get(channelId);
	if (cached) {
		if (now !== void 0 && cached.expiresAt > now) return cached.value;
		discordChannelInfoCacheState.entries.delete(channelId);
	}
	try {
		const channel = await client.fetchChannel(channelId);
		if (!channel) {
			cacheDiscordChannelInfo(channelId, null, DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS, rawNow);
			return null;
		}
		const channelInfo = resolveDiscordChannelInfoSafe(channel);
		const rawChannel = channel;
		const type = channelInfo.type ?? rawChannel.type;
		if (type === void 0) return null;
		const payload = {
			type,
			name: channelInfo.name,
			topic: channelInfo.topic,
			parentId: channelInfo.parentId,
			ownerId: channelInfo.ownerId
		};
		cacheDiscordChannelInfo(channelId, payload, DISCORD_CHANNEL_INFO_CACHE_TTL_MS, rawNow);
		return payload;
	} catch (err) {
		logVerbose(`discord: failed to fetch channel ${channelId}: ${String(err)}`);
		cacheDiscordChannelInfo(channelId, null, DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS, rawNow);
		return null;
	}
}
//#endregion
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
		const timeoutMs = resolveThreadTitleTimeoutMs(params.timeoutMs);
		const generated = await generateConversationLabel({
			cfg: params.cfg,
			agentId: params.agentId,
			userMessage,
			prompt: DISCORD_THREAD_TITLE_SYSTEM_PROMPT,
			...params.modelRef ? { modelRef: params.modelRef } : {},
			timeoutMs,
			maxLength: MAX_THREAD_TITLE_SOURCE_CHARS
		});
		return generated ? normalizeGeneratedThreadTitle(generated) : null;
	} catch (err) {
		logVerbose(`thread-title: title generation failed for agent ${params.agentId}: ${String(err)}`);
		return null;
	}
}
function buildThreadTitleCompletionUserMessage(params) {
	const sourceText = truncateThreadTitleSourceText(params.sourceText);
	const channelName = normalizeTitleContextField(params.channelName, MAX_THREAD_TITLE_CHANNEL_NAME_CHARS);
	const channelDescription = normalizeTitleContextField(params.channelDescription, MAX_THREAD_TITLE_CHANNEL_DESCRIPTION_CHARS);
	const messageLines = [];
	if (channelName) messageLines.push(`Channel: ${channelName}`);
	if (channelDescription) messageLines.push(`Channel description: ${channelDescription}`);
	messageLines.push(`Message:\n${sourceText}`);
	return messageLines.join("\n\n");
}
function truncateThreadTitleSourceText(sourceText) {
	if (sourceText.length <= MAX_THREAD_TITLE_SOURCE_CHARS) return sourceText;
	return `${truncateUtf16Safe(sourceText, MAX_THREAD_TITLE_SOURCE_CHARS)}...`;
}
function resolveThreadTitleTimeoutMs(timeoutMs) {
	return Math.max(100, Math.floor(timeoutMs ?? DEFAULT_THREAD_TITLE_TIMEOUT_MS));
}
function normalizeGeneratedThreadTitle(raw) {
	const lines = raw.replace(/\r/g, "").split("\n");
	let firstLine = "";
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		if (!firstLine && trimmed.startsWith("```")) continue;
		firstLine = trimmed;
		break;
	}
	return stripThreadTitleWrappers(firstLine);
}
function stripThreadTitleWrappers(raw) {
	let current = raw.trim();
	let previous = "";
	while (current && current !== previous) {
		previous = current;
		current = current.replace(/^["'`]+|["'`]+$/g, "").trim();
		current = stripBalancedWrapper(current, "**");
		current = stripBalancedWrapper(current, "__");
		current = stripBalancedWrapper(current, "*");
		current = stripBalancedWrapper(current, "_");
		current = stripBalancedWrapper(current, "~~");
	}
	return current;
}
function stripBalancedWrapper(text, marker) {
	if (text.length < marker.length * 2 + 1) return text;
	if (!text.startsWith(marker) || !text.endsWith(marker)) return text;
	const inner = text.slice(marker.length, text.length - marker.length);
	if (!inner || inner.includes(marker)) return text;
	return inner;
}
function normalizeTitleContextField(raw, maxChars) {
	const value = raw?.trim();
	if (!value) return;
	const singleLine = value.replace(/\s+/g, " ");
	if (singleLine.length <= maxChars) return singleLine;
	return `${truncateUtf16Safe(singleLine, maxChars)}...`;
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
	const base = globalName || username || name;
	if (username && discriminator && discriminator !== "0") return `@${username}#${discriminator}`;
	if (base) return `@${base}`;
	if (author.id) return `@${author.id}`;
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
/** Merges caller network policy with the Discord-owned CDN allowlist. */
function resolveDiscordCdnPolicy(policy) {
	if (!policy) return DISCORD_MEDIA_SSRF_POLICY;
	const hostnameAllowlist = mergeHostnameList(DISCORD_MEDIA_SSRF_POLICY.hostnameAllowlist, policy.hostnameAllowlist);
	const allowedHostnames = mergeHostnameList(DISCORD_MEDIA_SSRF_POLICY.allowedHostnames, policy.allowedHostnames);
	return {
		...DISCORD_MEDIA_SSRF_POLICY,
		...policy,
		...allowedHostnames ? { allowedHostnames } : {},
		...hostnameAllowlist ? { hostnameAllowlist } : {},
		allowRfc2544BenchmarkRange: Boolean(DISCORD_MEDIA_SSRF_POLICY.allowRfc2544BenchmarkRange) || Boolean(policy.allowRfc2544BenchmarkRange)
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
function createDiscordMediaOperation(abortSignal) {
	return {
		endpointRuntime: getDiscordEndpointRuntime() ?? null,
		abortSignal
	};
}
function isDiscordAudioAttachmentFileName(fileName) {
	const ext = getFileExtension(fileName);
	return Boolean(ext && AUDIO_ATTACHMENT_EXTENSIONS.has(ext));
}
function isDiscordVoiceWaveform(attachment) {
	return typeof attachment.waveform === "string";
}
function isDiscordVoiceDurationOnly(attachment) {
	return typeof attachment.duration_secs === "number" && !isDiscordVoiceWaveform(attachment);
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
function resolveEffectiveMediaType(params) {
	if (isDefinitiveMediaType(params.fetchedContentType)) return params.fetchedContentType ?? void 0;
	if (isDefinitiveMediaType(params.declaredContentType)) return params.declaredContentType ?? void 0;
	return params.fetchedContentType ?? params.declaredContentType ?? void 0;
}
function resolveDiscordMediaClassification(params) {
	const contentType = resolveEffectiveMediaType({
		declaredContentType: params.attachment.content_type,
		fetchedContentType: params.fetchedContentType
	});
	const mime = normalizeMimeType(contentType);
	const definitiveVisual = mime?.startsWith("video/") === true || mime?.startsWith("image/") === true;
	const audioKind = mime?.startsWith("audio/") || isDiscordVoiceWaveform(params.attachment) || !definitiveVisual && (isDiscordVoiceDurationOnly(params.attachment) || isDiscordAudioAttachmentFileName(params.attachment.filename ?? params.attachment.url) && !isDefinitiveMediaType(contentType)) ? "audio" : void 0;
	const kind = audioKind ?? (!isDefinitiveMediaType(contentType) ? isImageAttachment(params.attachment) ? "image" : "document" : void 0);
	return {
		contentType: audioKind && !mime?.startsWith("audio/") || kind && !isDefinitiveMediaType(contentType) ? void 0 : contentType,
		...kind ? { kind } : {}
	};
}
async function resolveMediaList(message, maxBytes, options) {
	const out = [];
	const resolvedSsrFPolicy = resolveDiscordCdnPolicy(options?.ssrfPolicy);
	const operation = createDiscordMediaOperation(options?.abortSignal);
	await appendResolvedMediaFromAttachments({
		attachments: message.attachments ?? [],
		maxBytes,
		out,
		errorPrefix: "discord: failed to download attachment",
		fetchImpl: options?.fetchImpl,
		ssrfPolicy: resolvedSsrFPolicy,
		readIdleTimeoutMs: options?.readIdleTimeoutMs,
		totalTimeoutMs: options?.totalTimeoutMs,
		...operation
	});
	await appendResolvedMediaFromStickers({
		stickers: resolveDiscordMessageStickers(message),
		maxBytes,
		out,
		errorPrefix: "discord: failed to download sticker",
		fetchImpl: options?.fetchImpl,
		ssrfPolicy: resolvedSsrFPolicy,
		readIdleTimeoutMs: options?.readIdleTimeoutMs,
		totalTimeoutMs: options?.totalTimeoutMs,
		...operation
	});
	return out;
}
async function resolveForwardedMediaList(message, maxBytes, options) {
	const snapshots = resolveDiscordMessageSnapshots(message);
	const out = [];
	const resolvedSsrFPolicy = resolveDiscordCdnPolicy(options?.ssrfPolicy);
	const operation = createDiscordMediaOperation(options?.abortSignal);
	if (snapshots.length > 0) {
		for (const snapshot of snapshots) {
			await appendResolvedMediaFromAttachments({
				attachments: snapshot.message?.attachments,
				maxBytes,
				out,
				errorPrefix: "discord: failed to download forwarded attachment",
				fetchImpl: options?.fetchImpl,
				ssrfPolicy: resolvedSsrFPolicy,
				readIdleTimeoutMs: options?.readIdleTimeoutMs,
				totalTimeoutMs: options?.totalTimeoutMs,
				...operation
			});
			await appendResolvedMediaFromStickers({
				stickers: snapshot.message ? resolveDiscordSnapshotStickers(snapshot.message) : [],
				maxBytes,
				out,
				errorPrefix: "discord: failed to download forwarded sticker",
				fetchImpl: options?.fetchImpl,
				ssrfPolicy: resolvedSsrFPolicy,
				readIdleTimeoutMs: options?.readIdleTimeoutMs,
				totalTimeoutMs: options?.totalTimeoutMs,
				...operation
			});
		}
		return out;
	}
	const referencedForward = resolveDiscordReferencedForwardMessage(message);
	if (!referencedForward) return out;
	await appendResolvedMediaFromAttachments({
		attachments: referencedForward.attachments,
		maxBytes,
		out,
		errorPrefix: "discord: failed to download forwarded attachment",
		fetchImpl: options?.fetchImpl,
		ssrfPolicy: resolvedSsrFPolicy,
		readIdleTimeoutMs: options?.readIdleTimeoutMs,
		totalTimeoutMs: options?.totalTimeoutMs,
		...operation
	});
	await appendResolvedMediaFromStickers({
		stickers: resolveDiscordMessageStickers(referencedForward),
		maxBytes,
		out,
		errorPrefix: "discord: failed to download forwarded sticker",
		fetchImpl: options?.fetchImpl,
		ssrfPolicy: resolvedSsrFPolicy,
		readIdleTimeoutMs: options?.readIdleTimeoutMs,
		totalTimeoutMs: options?.totalTimeoutMs,
		...operation
	});
	return out;
}
async function resolveReferencedReplyMediaList(message, maxBytes, options) {
	const referencedReply = resolveDiscordReferencedReplyMessage(message);
	const out = [];
	if (!referencedReply) return out;
	const resolvedSsrFPolicy = resolveDiscordCdnPolicy(options?.ssrfPolicy);
	const operation = createDiscordMediaOperation(options?.abortSignal);
	await appendResolvedMediaFromAttachments({
		attachments: referencedReply.attachments,
		maxBytes,
		out,
		errorPrefix: "discord: failed to download referenced reply attachment",
		fetchImpl: options?.fetchImpl,
		ssrfPolicy: resolvedSsrFPolicy,
		readIdleTimeoutMs: options?.readIdleTimeoutMs,
		totalTimeoutMs: options?.totalTimeoutMs,
		...operation
	});
	await appendResolvedMediaFromStickers({
		stickers: resolveDiscordMessageStickers(referencedReply),
		maxBytes,
		out,
		errorPrefix: "discord: failed to download referenced reply sticker",
		fetchImpl: options?.fetchImpl,
		ssrfPolicy: resolvedSsrFPolicy,
		readIdleTimeoutMs: options?.readIdleTimeoutMs,
		totalTimeoutMs: options?.totalTimeoutMs,
		...operation
	});
	return out;
}
async function fetchDiscordMedia(params) {
	const endpointGuard = resolveDiscordEndpointMediaGuard(params.url, params.endpointRuntime);
	const timeoutAbortController = params.totalTimeoutMs ? new AbortController() : void 0;
	const signal = params.abortSignal && timeoutAbortController ? AbortSignal.any([params.abortSignal, timeoutAbortController.signal]) : params.abortSignal ?? timeoutAbortController?.signal;
	let timedOut = false;
	let timeoutHandle = null;
	const savePromise = saveRemoteMedia({
		url: params.url,
		filePathHint: params.filePathHint,
		maxBytes: params.maxBytes,
		fetchImpl: endpointGuard ? void 0 : params.fetchImpl,
		ssrfPolicy: endpointGuard?.ssrfPolicy ?? params.ssrfPolicy,
		...endpointGuard ? { maxRedirects: endpointGuard.maxRedirects } : {},
		readIdleTimeoutMs: params.readIdleTimeoutMs,
		fallbackContentType: params.fallbackContentType,
		originalFilename: params.originalFilename,
		...signal ? { requestInit: { signal } } : {}
	}).catch((error) => {
		if (timedOut) return new Promise(() => {});
		throw error;
	});
	try {
		if (!params.totalTimeoutMs) return await savePromise;
		const timeoutPromise = new Promise((_, reject) => {
			timeoutHandle = setTimeout(() => {
				timedOut = true;
				timeoutAbortController?.abort();
				reject(/* @__PURE__ */ new Error(`discord media download timed out after ${params.totalTimeoutMs}ms`));
			}, params.totalTimeoutMs);
			timeoutHandle.unref?.();
		});
		return await Promise.race([savePromise, timeoutPromise]);
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
	}
}
async function appendResolvedMediaFromAttachments(params) {
	const attachments = params.attachments;
	if (!attachments || attachments.length === 0) return;
	for (const attachment of attachments) {
		const attachmentUrl = normalizeOptionalString(attachment.url);
		if (!attachmentUrl) {
			logVerbose(`${params.errorPrefix} ${attachment.id ?? attachment.filename ?? "attachment"}: missing url`);
			params.out.push(resolveDiscordMediaClassification({ attachment }));
			continue;
		}
		try {
			const saved = await fetchDiscordMedia({
				url: attachmentUrl,
				filePathHint: attachment.filename ?? attachmentUrl,
				maxBytes: params.maxBytes,
				fetchImpl: params.fetchImpl,
				ssrfPolicy: params.ssrfPolicy,
				readIdleTimeoutMs: params.readIdleTimeoutMs,
				totalTimeoutMs: params.totalTimeoutMs,
				abortSignal: params.abortSignal,
				endpointRuntime: params.endpointRuntime,
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
			const classification = resolveDiscordMediaClassification({ attachment });
			params.out.push({ ...classification });
		}
	}
}
function resolveStickerAssetCandidates(sticker) {
	const baseName = sticker.name?.trim() || `sticker-${sticker.id}`;
	switch (sticker.format_type) {
		case StickerFormatType.GIF: return [{
			url: `${DISCORD_STICKER_ASSET_BASE_URL}/${sticker.id}.gif`,
			fileName: `${baseName}.gif`
		}];
		case StickerFormatType.Lottie: return [{
			url: `${DISCORD_STICKER_ASSET_BASE_URL}/${sticker.id}.png?size=160`,
			fileName: `${baseName}.png`
		}, {
			url: `${DISCORD_STICKER_ASSET_BASE_URL}/${sticker.id}.json`,
			fileName: `${baseName}.json`
		}];
		default: return [{
			url: `${DISCORD_STICKER_ASSET_BASE_URL}/${sticker.id}.png`,
			fileName: `${baseName}.png`
		}];
	}
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
	const stickers = params.stickers;
	if (!stickers || stickers.length === 0) return;
	for (const sticker of stickers) {
		const candidates = resolveStickerAssetCandidates(sticker);
		let lastError;
		for (const candidate of candidates) try {
			const saved = await fetchDiscordMedia({
				url: candidate.url,
				filePathHint: candidate.fileName,
				maxBytes: params.maxBytes,
				fetchImpl: params.fetchImpl,
				ssrfPolicy: params.ssrfPolicy,
				readIdleTimeoutMs: params.readIdleTimeoutMs,
				totalTimeoutMs: params.totalTimeoutMs,
				abortSignal: params.abortSignal,
				endpointRuntime: params.endpointRuntime,
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
			if (candidates[0]) params.out.push({
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
function resolveDiscordTextMediaFacts(params) {
	return [...(params.attachments ?? []).map((attachment) => {
		return resolveDiscordMediaClassification({ attachment });
	}), ...(params.stickers ?? []).map(() => ({ kind: "sticker" }))];
}
/** Renders native Discord media only for transcript surfaces that cannot carry facts. */
function formatDiscordMediaText(params) {
	return formatMediaPlaceholderText(resolveDiscordTextMediaFacts(params));
}
//#endregion
//#region extensions/discord/src/monitor/message-text.ts
function resolveDiscordEmbedText(embeds) {
	return (embeds ?? []).flatMap(({ title, description }) => [normalizeOptionalString(title), normalizeOptionalString(description)]).filter(Boolean).join("\n");
}
function resolveDiscordMessageText(message, options) {
	const baseText = resolveDiscordMentions(resolveDiscordMessageMentionDocuments(message).map((text) => normalizeOptionalString(text)).filter(Boolean).join("\n") || normalizeOptionalString(options?.fallbackText) || "", message);
	if (!options?.includeForwarded) return baseText;
	const forwardedText = resolveDiscordForwardedMessagesText(message);
	if (!forwardedText) return baseText;
	if (!baseText) return forwardedText;
	return `${baseText}\n${forwardedText}`;
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
	const referencedText = resolveDiscordMessageHistoryText(referencedForward);
	if (!referencedText) return "";
	const authorLabel = formatDiscordSnapshotAuthor(referencedForward.author);
	return `${authorLabel ? `[Forwarded message from ${authorLabel}]` : "[Forwarded message]"}\n${referencedText}`;
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
	return parts.map((part) => normalizeOptionalString(part)).filter((part) => Boolean(part)).join("\n");
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
	const forwardedBlocks = normalizeDiscordMessageSnapshots(snapshots).map((snapshot) => buildDiscordForwardedMessageBlock(snapshot.message)).filter((entry) => Boolean(entry));
	if (forwardedBlocks.length === 0) return "";
	return forwardedBlocks.join("\n\n");
}
function buildDiscordForwardedMessageBlock(snapshotMessage) {
	if (!snapshotMessage) return null;
	const text = resolveDiscordRawMessageText(snapshotMessage);
	if (!text) return null;
	const authorLabel = formatDiscordSnapshotAuthor(snapshotMessage.author);
	return `${authorLabel ? `[Forwarded message from ${authorLabel}]` : "[Forwarded message]"}\n${text}`;
}
/** Single owner for raw Discord message payloads (REST fetches and forwarded snapshots). */
function resolveDiscordRawMessageText(message) {
	const content = normalizeOptionalString(message.content) ?? "";
	const mediaText = formatDiscordMediaText({
		attachments: message.attachments ?? void 0,
		stickers: resolveDiscordSnapshotStickers(message)
	});
	return [content || resolveDiscordEmbedText(message.embeds) || extractDiscordComponentsV2Text(message.components) || resolveDiscordForwardedMessagesTextFromSnapshots(message.message_snapshots), mediaText].filter(Boolean).join("\n");
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
function isDiscordForumParentType(parentType) {
	return parentType === discord_exports.ChannelType.GuildForum || parentType === discord_exports.ChannelType.GuildMedia;
}
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
	const messageChannelId = resolveDiscordThreadStarterMessageChannelId(params);
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
		const starter = await fetchDiscordThreadStarterMessage({
			client: params.client,
			messageChannelId,
			threadId: params.channel.id
		});
		if (!starter) {
			cacheMiss();
			return null;
		}
		const payload = buildDiscordThreadStarterPayload({
			starter,
			resolveTimestampMs: params.resolveTimestampMs
		});
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
		if (isDiscordThreadStarterNegativeCacheError(error)) cacheMiss();
		return null;
	}
}
function isDiscordThreadStarterNegativeCacheError(error) {
	return error instanceof DiscordError && (error.status === 403 || error.status === 404);
}
function resolveDiscordThreadStarterMessageChannelId(params) {
	return isDiscordForumParentType(params.parentType) ? params.channel.id : params.parentId;
}
async function fetchDiscordThreadStarterMessage(params) {
	const starter = await getChannelMessage(params.client.rest, params.messageChannelId, params.threadId);
	return starter ? starter : null;
}
function buildDiscordThreadStarterPayload(params) {
	const text = resolveDiscordRawMessageText(params.starter);
	if (!text) return null;
	return {
		text,
		...resolveDiscordThreadStarterIdentity(params.starter),
		timestamp: params.resolveTimestampMs(params.starter.timestamp) ?? void 0
	};
}
function resolveDiscordThreadStarterIdentity(starter) {
	return {
		author: resolveDiscordThreadStarterAuthor(starter),
		authorId: starter.author?.id ?? void 0,
		authorName: starter.author?.username ?? void 0,
		authorTag: resolveDiscordThreadStarterAuthorTag(starter.author),
		memberRoleIds: resolveDiscordThreadStarterRoleIds(starter.member)
	};
}
function resolveDiscordThreadStarterAuthor(starter) {
	return starter.member?.nick ?? starter.member?.displayName ?? resolveDiscordThreadStarterAuthorTag(starter.author) ?? starter.author?.username ?? starter.author?.id ?? "Unknown";
}
function resolveDiscordThreadStarterAuthorTag(author) {
	if (!author?.username || !author.discriminator) return;
	if (author.discriminator !== "0") return `${author.username}#${author.discriminator}`;
	return author.username;
}
function resolveDiscordThreadStarterRoleIds(member) {
	return Array.isArray(member?.roles) ? member.roles : void 0;
}
function resolveDiscordReplyTarget(opts) {
	if (opts.replyToMode === "off") return;
	const replyToId = normalizeOptionalString(opts.replyToId);
	if (!replyToId) return;
	if (opts.replyToMode === "all") return replyToId;
	return opts.hasReplied ? void 0 : replyToId;
}
function sanitizeDiscordThreadName(rawName, fallbackId) {
	const baseSource = rawName.replace(/<@!?\d+>/g, "").replace(/<@&\d+>/g, "").replace(/<#\d+>/g, "").replace(/\s+/g, " ").trim() || `Thread ${fallbackId}`;
	const base = truncateUtf16Safe(baseSource, 80);
	return truncateUtf16Safe(base, 100) || `Thread ${fallbackId}`;
}
function resolveDiscordReplyDeliveryPlan(params) {
	const originalReplyTarget = params.replyTarget;
	let deliverTarget = originalReplyTarget;
	let replyTarget = originalReplyTarget;
	if (params.createdThreadId) {
		deliverTarget = `channel:${params.createdThreadId}`;
		replyTarget = deliverTarget;
	}
	const allowReference = deliverTarget === originalReplyTarget;
	const replyReference = createReplyReferencePlanner({
		replyToMode: allowReference ? params.replyToMode : "off",
		existingId: params.threadChannel ? params.messageId : void 0,
		startId: params.messageId,
		allowReference
	});
	return {
		deliverTarget,
		replyTarget,
		replyReference
	};
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
		client: params.client,
		message: params.message,
		messageChannelId: messageChannelId || void 0,
		channel: params.channel,
		isGuildMessage: params.isGuildMessage,
		channelConfig: params.channelConfig,
		threadChannel: params.threadChannel,
		channelType: params.channelType,
		channelName: params.channelName,
		channelDescription: params.channelDescription,
		baseText: params.baseText,
		combinedBody: params.combinedBody,
		cfg: params.cfg,
		agentId: params.agentId
	});
	const deliveryPlan = resolveDiscordReplyDeliveryPlan({
		replyTarget: originalReplyTarget,
		replyToMode: params.replyToMode,
		messageId: params.message.id,
		threadChannel: params.threadChannel,
		createdThreadId
	});
	const autoThreadContext = params.isGuildMessage ? resolveDiscordAutoThreadContext({
		agentId: params.agentId,
		channel: params.channel,
		parentSessionKey: params.parentSessionKey,
		createdThreadId,
		groupScope: params.groupScope,
		parentInheritanceEnabled: params.threadParentInheritanceEnabled
	}) : null;
	return {
		...deliveryPlan,
		createdThreadId,
		autoThreadContext
	};
}
async function maybeCreateDiscordAutoThread(params) {
	if (!params.isGuildMessage) return;
	if (!params.channelConfig?.autoThread) return;
	if (params.threadChannel) return;
	if (params.channelType === discord_exports.ChannelType.GuildForum || params.channelType === discord_exports.ChannelType.GuildMedia || params.channelType === discord_exports.ChannelType.GuildVoice || params.channelType === discord_exports.ChannelType.GuildStageVoice) return;
	const messageChannelId = resolveTrimmedDiscordMessageChannelId(params);
	if (!messageChannelId) return;
	try {
		try {
			const existingThreadId = (await getChannelMessage(params.client.rest, messageChannelId, params.message.id))?.thread?.id;
			if (existingThreadId) {
				logVerbose(`discord: autoThread reusing existing thread ${existingThreadId} on ${messageChannelId}/${params.message.id}`);
				return existingThreadId;
			}
		} catch {}
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
		try {
			const existingThreadId = (await getChannelMessage(params.client.rest, messageChannelId, params.message.id))?.thread?.id || "";
			if (existingThreadId) {
				logVerbose(`discord: autoThread reusing existing thread ${existingThreadId} on ${messageChannelId}/${params.message.id}`);
				return existingThreadId;
			}
		} catch {}
		return;
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
			cfg: params.cfg,
			agentId: params.agentId,
			messageText: params.sourceText,
			modelRef: params.modelRef,
			channelName: params.channelName,
			channelDescription: params.channelDescription
		});
		if (!generated) return;
		const nextName = sanitizeDiscordThreadName(generated, params.fallbackId);
		if (!nextName || nextName === params.currentName || nextName === fallbackName) return;
		await editChannel(params.client.rest, params.threadId, { body: { name: nextName } });
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
//#region extensions/discord/src/monitor/thread-channel-context.ts
function buildFetchedChannelInfo(channel) {
	const channelInfo = resolveDiscordChannelInfoSafe(channel);
	if (channelInfo.type === void 0) return null;
	return {
		type: channelInfo.type,
		name: channelInfo.name,
		topic: channelInfo.topic,
		parentId: channelInfo.parentId,
		ownerId: channelInfo.ownerId
	};
}
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
		channelInfo: buildFetchedChannelInfo(params.channel)
	});
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
	if (commandOwnerAllowFrom) return {
		admissionAllowFrom: commandOwnerAllowFrom,
		ownerAllowFrom: commandOwnerAllowFrom
	};
	return {
		admissionAllowFrom: resolveDiscordAccountAllowFrom({
			cfg: params.cfg,
			accountId: params.accountId
		}) ?? params.discordConfig.allowFrom ?? [],
		ownerAllowFrom: []
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
		guildInfo,
		channelId: params.channelId,
		channelName: params.channelName,
		channelSlug: params.channelSlug,
		parentId: params.parentId,
		parentName: params.parentName,
		parentSlug: params.parentSlug,
		scope: params.scope
	}) : null;
	if (channelConfig?.enabled === false) return {
		ok: false,
		message: "This channel is disabled."
	};
	const channelAllowlistConfigured = Boolean(guildInfo?.channels) && Object.keys(guildInfo?.channels ?? {}).length > 0;
	if (!params.channelId && groupPolicy === "allowlist" && channelAllowlistConfigured) return {
		ok: false,
		message: `${params.channelLabel ?? "This channel"} is not allowlisted for voice commands.`
	};
	const channelAllowed = channelConfig ? channelConfig.allowed : !channelAllowlistConfigured;
	if (!isDiscordGroupAllowedByPolicy({
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
	const useAccessGroups = params.useAccessGroups ?? true;
	return resolveCommandAuthorizedFromAuthorizers({
		useAccessGroups,
		authorizers: useAccessGroups ? [{
			configured: admissionAllowList != null,
			allowed: admissionAllowed
		}, {
			configured: hasAccessRestrictions,
			allowed: memberAllowed
		}] : [{
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
//#region extensions/discord/src/voice/config.ts
function resolveDiscordVoiceEnabled(voice) {
	if (voice?.enabled !== void 0) return voice.enabled;
	return voice !== void 0;
}
function buildProviderConfigs(realtimeConfig) {
	const configs = realtimeConfig?.providers;
	return configs && Object.keys(configs).length > 0 ? { ...configs } : void 0;
}
function buildProviderConfigOverrides(realtimeConfig) {
	const overrides = {
		...realtimeConfig?.model ? { model: realtimeConfig.model } : {},
		...realtimeConfig?.speakerVoice ? { voice: realtimeConfig.speakerVoice } : realtimeConfig?.speakerVoiceId ? { voice: realtimeConfig.speakerVoiceId } : {},
		...typeof realtimeConfig?.minBargeInAudioEndMs === "number" ? { minBargeInAudioEndMs: realtimeConfig.minBargeInAudioEndMs } : {}
	};
	return Object.keys(overrides).length > 0 ? overrides : void 0;
}
//#endregion
//#region extensions/discord/src/voice/transcripts-source.ts
const DISCORD_TRANSCRIPTS_STATE_KEY = Symbol.for("openclaw.discordTranscriptsState");
let discordTranscriptsState;
function resolveDiscordTranscriptsGlobalState() {
	if (!discordTranscriptsState) {
		const globalStore = globalThis;
		discordTranscriptsState = globalStore[DISCORD_TRANSCRIPTS_STATE_KEY] ?? {
			managersByAccountId: /* @__PURE__ */ new Map(),
			captures: /* @__PURE__ */ new Map(),
			managerWaiters: /* @__PURE__ */ new Set(),
			captureEpochReaders: /* @__PURE__ */ new Map(),
			nextRecordingEpoch: 0n
		};
		globalStore[DISCORD_TRANSCRIPTS_STATE_KEY] = discordTranscriptsState;
	}
	return discordTranscriptsState;
}
const TRANSCRIPTS_STATE = resolveDiscordTranscriptsGlobalState();
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
	try {
		Promise.resolve(capture.onStatus({
			active: false,
			sessionId: capture.sessionId,
			source: {
				providerId: "discord-voice",
				...capture.source
			}
		})).catch((error) => logger.warn(`discord voice: transcripts terminal notification failed: ${formatErrorMessage(error)}`));
	} catch (error) {
		logger.warn(`discord voice: transcripts terminal notification failed: ${formatErrorMessage(error)}`);
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
				readPolicy: manager?.readPolicy,
				cfg,
				discordConfig: account.config,
				accountId: account.accountId,
				guild: target.guild,
				guildId,
				channelId,
				...target.channelName ? { channelName: target.channelName } : {},
				channelSlug: target.channelSlug,
				...target.parentId ? { parentId: target.parentId } : {},
				...target.parentName ? { parentName: target.parentName } : {},
				...target.parentSlug ? { parentSlug: target.parentSlug } : {},
				scope: target.scope,
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
export { resolveDiscordReferencedReplyMessageId as A, resolveForwardedMediaList as C, hasDiscordMessageStickers as D, resolveDiscordCdnPolicy as E, resolveDiscordMessageChannelId as M, resolveDiscordMessageStickers as O, formatDiscordMediaText as S, resolveReferencedReplyMediaList as T, sanitizeDiscordThreadName as _, buildProviderConfigOverrides as a, resolveDiscordMessageMentionDocuments as b, authorizeDiscordVoiceIngress as c, resolveDiscordThreadLikeChannelContext as d, resolveFetchedDiscordThreadLikeChannelContext as f, resolveDiscordThreadStarter as g, resolveDiscordReplyTarget as h, setDiscordTranscriptsVoiceManager as i, resolveDiscordChannelInfo as j, resolveDiscordReferencedReplyMessage as k, resolveDiscordVoiceAccess as l, resolveDiscordAutoThreadReplyPlan as m, discordVoiceTranscriptsSourceProvider as n, buildProviderConfigs as o, threading_exports as p, resolveDiscordTranscriptsCapture as r, resolveDiscordVoiceEnabled as s, bindDiscordCaptureReceipts as t, resolveDiscordVoiceAccessTarget as u, resolveDiscordMessageBatch as v, resolveMediaList as w, resolveDiscordMessageText as x, resolveDiscordMessageHistoryText as y };
