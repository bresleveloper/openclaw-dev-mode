import { a as resolveWhatsAppAccount, c as resolveMergedWhatsAppAccountConfig, s as resolveWhatsAppMediaMaxBytes } from "./accounts-D_NGDjCx.mjs";
import { r as resolveDefaultWhatsAppAccountId } from "./account-ids-CB5SOWjc.mjs";
import { n as isWhatsAppNewsletterJid } from "./normalize-target-BGra1ZnM.mjs";
import { r as getWhatsAppConnectionController } from "./connection-controller-runtime-context-hgLJoRc8.mjs";
import "./normalize-DdsROMMa.mjs";
import { a as markdownToWhatsAppChunks, c as toWhatsappJid } from "./targets-runtime-RBjx3pg_.mjs";
import { a as stripToolCallXmlTags, i as sanitizeAssistantVisibleTextWithProfile, r as sanitizeAssistantVisibleText } from "./text-runtime-CHl0iPYe.mjs";
import path from "node:path";
import { normalizeStringEntries, normalizeUniqueStringEntries, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveReactionLevel } from "openclaw/plugin-sdk/status-helpers";
import { createMessageReceiptFromOutboundResults, createReplyToFanout, listMessageReceiptPlatformIds, sanitizeForPlainText } from "openclaw/plugin-sdk/channel-outbound";
import { formatCliCommand } from "openclaw/plugin-sdk/cli-runtime";
import { generateSecureUuid } from "openclaw/plugin-sdk/core";
import { PlatformMessageNotDispatchedError } from "openclaw/plugin-sdk/error-runtime";
import { redactIdentifier } from "openclaw/plugin-sdk/logging-core";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { normalizePollInput } from "openclaw/plugin-sdk/poll-runtime";
import { resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import { createSubsystemLogger as createSubsystemLogger$1, getChildLogger as getChildLogger$1 } from "openclaw/plugin-sdk/runtime-env";
import { extensionForMime, mediaKindFromMime, mimeTypeFromFilePath, normalizeMimeType } from "openclaw/plugin-sdk/media-mime";
import { AsyncLocalStorage } from "node:async_hooks";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { createChannelPartialDeliveryError, isChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS, transcodeAudioBufferToOpus } from "openclaw/plugin-sdk/media-runtime";
import { resolveOutboundMediaUrls } from "openclaw/plugin-sdk/reply-payload";
//#region extensions/whatsapp/src/reaction-level.ts
/** Resolve the effective reaction level and its implications for WhatsApp. */
function resolveWhatsAppReactionLevel(params) {
	const account = resolveMergedWhatsAppAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return resolveReactionLevel({
		value: account.reactionLevel,
		defaultLevel: "minimal",
		invalidFallback: "minimal"
	});
}
//#endregion
//#region extensions/whatsapp/src/document-filename.ts
const WHATSAPP_DEFAULT_DOCUMENT_FILE_NAME = "file";
function resolveWhatsAppDefaultDocumentFileName(mimetype) {
	const extension = extensionForMime(mimetype);
	return extension ? `${WHATSAPP_DEFAULT_DOCUMENT_FILE_NAME}${extension}` : WHATSAPP_DEFAULT_DOCUMENT_FILE_NAME;
}
function resolveWhatsAppDocumentFileName(params) {
	const fallbackName = resolveWhatsAppDefaultDocumentFileName(params.mimetype);
	return stripAsciiControlCharacters(params.fileName ?? "").trim() || fallbackName;
}
function stripAsciiControlCharacters(value) {
	let stripped = "";
	for (const char of value) {
		const code = char.charCodeAt(0);
		if (code > 31 && code !== 127) stripped += char;
	}
	return stripped;
}
//#endregion
//#region extensions/whatsapp/src/inbound/send-result.ts
const activityAccountedWhatsAppSendResults = /* @__PURE__ */ new WeakSet();
const logicalWhatsAppDeliveryActivity = new AsyncLocalStorage();
/** Keep all separately produced platform sends inside one logical reply accounting scope. */
async function withWhatsAppLogicalDeliveryActivity(run) {
	if (logicalWhatsAppDeliveryActivity.getStore()) return await run();
	return await logicalWhatsAppDeliveryActivity.run({ accountedAccountIds: /* @__PURE__ */ new Set() }, run);
}
function resolveWhatsAppReceiptKind(kind) {
	if (kind === "media" || kind === "text") return kind;
	return "unknown";
}
function toReceiptSourceResult(key) {
	return {
		channel: "whatsapp",
		messageId: key.id,
		...key.remoteJid ? { toJid: key.remoteJid } : {},
		meta: {
			fromMe: key.fromMe,
			participant: key.participant
		}
	};
}
function createWhatsAppSendReceipt(kind, keys) {
	return createMessageReceiptFromOutboundResults({
		kind: resolveWhatsAppReceiptKind(kind),
		results: keys.map(toReceiptSourceResult)
	});
}
function mergeWhatsAppReceiptSourceMetadata(sources) {
	const defined = sources.filter((source) => Boolean(source));
	const preferred = defined[0];
	if (!preferred) return;
	const merged = /* @__PURE__ */ new Map();
	const meta = /* @__PURE__ */ new Map();
	for (const source of defined.toReversed()) {
		for (const [key, value] of Object.entries(source)) if (key !== "meta" && value !== void 0) merged.set(key, value);
		for (const [key, value] of Object.entries(source.meta ?? {})) if (value !== void 0) meta.set(key, value);
	}
	const mergedSource = Object.assign({}, preferred, Object.fromEntries(merged));
	if (meta.size > 0) mergedSource.meta = Object.fromEntries(meta);
	else delete mergedSource.meta;
	return mergedSource;
}
function enrichWhatsAppDeliveryReceipt(params) {
	const seenPartIds = /* @__PURE__ */ new Set();
	const parts = params.receipt.parts.flatMap((part) => {
		if (seenPartIds.has(part.platformMessageId)) return [];
		seenPartIds.add(part.platformMessageId);
		const matchingParts = params.sources.flatMap((source) => source.parts.filter((candidate) => candidate.platformMessageId === part.platformMessageId));
		const matchingRawSources = params.sources.flatMap((source) => source.raw?.filter((raw) => raw.messageId === part.platformMessageId) ?? []);
		const raw = mergeWhatsAppReceiptSourceMetadata([
			part.raw,
			...matchingParts.map((candidate) => candidate.raw),
			...matchingRawSources
		]);
		const threadId = part.threadId ?? matchingParts.find((candidate) => candidate.threadId)?.threadId;
		const replyToId = part.replyToId ?? matchingParts.find((candidate) => candidate.replyToId)?.replyToId;
		return [{
			...part,
			...threadId ? { threadId } : {},
			...replyToId ? { replyToId } : {},
			...raw ? { raw } : {}
		}];
	});
	const threadId = params.receipt.threadId ?? params.sources.find((source) => source.threadId)?.threadId;
	const replyToId = params.receipt.replyToId ?? params.sources.find((source) => source.replyToId)?.replyToId;
	const editToken = params.receipt.editToken ?? params.sources.find((source) => source.editToken)?.editToken;
	const deleteToken = params.receipt.deleteToken ?? params.sources.find((source) => source.deleteToken)?.deleteToken;
	return {
		...params.receipt,
		parts,
		raw: parts.map((part) => part.raw ?? {
			channel: "whatsapp",
			messageId: part.platformMessageId
		}),
		...threadId ? { threadId } : {},
		...replyToId ? { replyToId } : {},
		...editToken ? { editToken } : {},
		...deleteToken ? { deleteToken } : {}
	};
}
function normalizeKey(key) {
	const id = typeof key?.id === "string" ? key.id.trim() : "";
	if (!id) return;
	return {
		id,
		remoteJid: key?.remoteJid,
		fromMe: key?.fromMe,
		participant: key?.participant
	};
}
function createWhatsAppProviderNotAcceptedError(kind) {
	const cause = /* @__PURE__ */ new Error("Baileys returned no accepted message key.");
	return new PlatformMessageNotDispatchedError(`WhatsApp ${kind} send was not accepted by the provider: ${cause.message}`, { cause });
}
function normalizeWhatsAppSendResult(result, kind) {
	const key = normalizeKey(result?.key);
	if (!key) throw createWhatsAppProviderNotAcceptedError(kind);
	return {
		kind,
		messageId: key.id,
		receipt: createWhatsAppSendReceipt(kind, [key]),
		keys: [key],
		providerAccepted: true
	};
}
/** Refuse synthetic ids from listener boundaries before callers create durable receipts. */
function requireWhatsAppAcceptedSendResult(result) {
	if (result.providerAccepted && result.messageId !== "unknown" && result.keys.some((key) => key.id === result.messageId) && listWhatsAppSendResultMessageIds(result).includes(result.messageId)) return result;
	throw createWhatsAppProviderNotAcceptedError(result.kind);
}
/** Persist accepted provider facts before account bookkeeping or later platform sends can fail. */
function rememberWhatsAppAcceptedSend(params) {
	const accepted = requireWhatsAppAcceptedSendResult(params.result);
	params.results.push(accepted);
	if (params.results.length === 1) {
		const deliveryActivity = logicalWhatsAppDeliveryActivity.getStore();
		const alreadyAccounted = activityAccountedWhatsAppSendResults.has(accepted) || Boolean(deliveryActivity?.accountedAccountIds.has(params.accountId));
		activityAccountedWhatsAppSendResults.add(accepted);
		if (!alreadyAccounted) {
			deliveryActivity?.accountedAccountIds.add(params.accountId);
			recordChannelActivity({
				channel: "whatsapp",
				accountId: params.accountId,
				direction: "outbound"
			});
		}
	}
	return accepted;
}
/** Nested owners already attempted activity accounting before exposing accepted delivery. */
function rememberWhatsAppPartialSend(params) {
	if (!isChannelPartialDeliveryError(params.error)) return false;
	const delivery = params.error.deliveryResult;
	const messageIds = uniqueStrings([...delivery.receipt ? listMessageReceiptPlatformIds(delivery.receipt) : [], ...normalizeStringEntries(delivery.messageIds ?? [])]).filter((messageId) => messageId !== "unknown");
	const existingIds = new Set(params.results.flatMap(listWhatsAppSendResultMessageIds));
	const acceptedIds = messageIds.filter((messageId) => !existingIds.has(messageId));
	const messageId = acceptedIds[0];
	if (!messageId) return false;
	const receiptSources = [];
	if (delivery.receipt) receiptSources.push({
		channel: "whatsapp",
		messageId,
		receipt: delivery.receipt
	});
	const receiptIds = new Set(delivery.receipt ? listMessageReceiptPlatformIds(delivery.receipt) : []);
	for (const acceptedId of acceptedIds) if (!receiptIds.has(acceptedId)) receiptSources.push({
		channel: "whatsapp",
		messageId: acceptedId
	});
	const receipt = createMessageReceiptFromOutboundResults({
		kind: resolveWhatsAppReceiptKind(params.kind),
		results: receiptSources
	});
	const accepted = requireWhatsAppAcceptedSendResult({
		kind: params.kind,
		messageId,
		receipt,
		keys: acceptedIds.map((id) => ({ id })),
		providerAccepted: true
	});
	activityAccountedWhatsAppSendResults.add(accepted);
	params.results.push(accepted);
	return true;
}
/** Merge accepted local sends with nested partial receipts without inventing provider ids. */
function mergeWhatsAppAcceptedSendError(params) {
	const nested = isChannelPartialDeliveryError(params.error) ? params.error.deliveryResult : void 0;
	const receiptSources = [];
	const recordedIds = /* @__PURE__ */ new Set();
	for (const result of params.results) {
		const resultIds = listWhatsAppSendResultMessageIds(result);
		if (resultIds.every((messageId) => recordedIds.has(messageId))) continue;
		receiptSources.push({
			channel: "whatsapp",
			messageId: result.messageId,
			...result.receipt ? { receipt: result.receipt } : {}
		});
		for (const messageId of resultIds) recordedIds.add(messageId);
	}
	const unrecordedNestedIds = uniqueStrings([...nested?.receipt ? listMessageReceiptPlatformIds(nested.receipt) : [], ...normalizeStringEntries(nested?.messageIds ?? [])]).filter((messageId) => messageId !== "unknown").filter((messageId) => !recordedIds.has(messageId));
	const nestedMessageId = unrecordedNestedIds[0];
	if (nested?.receipt && nestedMessageId) {
		receiptSources.push({
			channel: "whatsapp",
			messageId: nestedMessageId,
			receipt: nested.receipt
		});
		for (const messageId of listMessageReceiptPlatformIds(nested.receipt)) recordedIds.add(messageId);
	}
	for (const messageId of unrecordedNestedIds) if (!recordedIds.has(messageId)) receiptSources.push({
		channel: "whatsapp",
		messageId
	});
	const receipt = enrichWhatsAppDeliveryReceipt({
		receipt: createMessageReceiptFromOutboundResults({
			kind: resolveWhatsAppReceiptKind(params.kind),
			results: receiptSources
		}),
		sources: [...params.results.flatMap((result) => result.receipt ? [result.receipt] : []), ...nested?.receipt ? [nested.receipt] : []]
	});
	const messageIds = listMessageReceiptPlatformIds(receipt);
	if (messageIds.length === 0) return params.error;
	let cause = params.error;
	const visitedPartialErrors = /* @__PURE__ */ new Set();
	while (isChannelPartialDeliveryError(cause) && cause instanceof Error && cause.cause !== void 0 && !visitedPartialErrors.has(cause)) {
		visitedPartialErrors.add(cause);
		cause = cause.cause;
	}
	return createChannelPartialDeliveryError(cause, {
		...nested,
		messageIds,
		receipt,
		visibleReplySent: true
	});
}
function combineWhatsAppSendResults(kind, results) {
	const messageId = uniqueStrings(results.flatMap(listWhatsAppSendResultMessageIds))[0];
	if (!messageId) throw createWhatsAppProviderNotAcceptedError(kind);
	const keys = results.flatMap((result) => result.keys);
	const combined = {
		kind,
		messageId,
		receipt: createWhatsAppSendReceipt(kind, keys),
		keys,
		providerAccepted: results.some((result) => result.providerAccepted)
	};
	if (results.some((result) => activityAccountedWhatsAppSendResults.has(result))) activityAccountedWhatsAppSendResults.add(combined);
	return combined;
}
function listWhatsAppSendResultMessageIds(result) {
	const receiptIds = result.receipt ? listMessageReceiptPlatformIds(result.receipt) : [];
	if (receiptIds.length > 0) return receiptIds;
	const keyIds = normalizeStringEntries(result.keys.map((key) => key.id));
	if (keyIds.length > 0) return uniqueStrings(keyIds);
	return [];
}
//#endregion
//#region extensions/whatsapp/src/outbound-media-contract.ts
const WHATSAPP_VOICE_FILE_NAME = "voice.ogg";
const WHATSAPP_VOICE_SAMPLE_RATE_HZ = 48e3;
const WHATSAPP_VOICE_BITRATE = "64k";
const WHATSAPP_VOICE_MIMETYPE = "audio/ogg; codecs=opus";
function stripWhatsAppPluralToolXml(text) {
	return stripToolCallXmlTags(text, { stripFunctionCallsXmlPayloads: true });
}
function finalizeWhatsAppVisibleText(text) {
	return sanitizeForPlainText(stripWhatsAppPluralToolXml(text));
}
function normalizeWhatsAppPayloadText(text) {
	return finalizeWhatsAppVisibleText(sanitizeAssistantVisibleText(text ?? "")).trimStart();
}
function stripLeadingBlankLines(text) {
	return text.replace(/^(?:[ \t]*\r?\n)+/, "");
}
function normalizeWhatsAppPayloadTextPreservingIndentation(text) {
	const normalized = stripLeadingBlankLines(finalizeWhatsAppVisibleText(sanitizeAssistantVisibleTextWithProfile(stripLeadingBlankLines(text ?? ""), "history")));
	return normalized.trim() ? normalized : "";
}
function resolveAdditiveWhatsAppMediaUrls(payload) {
	return normalizeUniqueStringEntries([...payload.mediaUrl ? [payload.mediaUrl] : [], ...payload.mediaUrls ?? []]);
}
function normalizeWhatsAppOutboundPayload(payload, options) {
	const preferredMediaUrls = normalizeUniqueStringEntries(payload.mediaUrls);
	const mediaUrls = normalizeUniqueStringEntries(resolveOutboundMediaUrls({
		mediaUrl: payload.mediaUrl,
		mediaUrls: preferredMediaUrls
	}));
	const normalizeText = options?.normalizeText ?? normalizeWhatsAppPayloadText;
	return {
		...payload,
		text: normalizeText(payload.text),
		mediaUrl: mediaUrls[0],
		mediaUrls: mediaUrls.length > 0 ? mediaUrls : void 0
	};
}
function inferWhatsAppMediaKind(media, resolvedContentType) {
	const isGenericDocument = media.kind === "document" && normalizeMimeType(media.contentType) === "application/octet-stream";
	if (media.kind === "image" || media.kind === "audio" || media.kind === "video" || media.kind === "document" && !isGenericDocument) return media.kind;
	const inferredKind = mediaKindFromMime(normalizeMimeType(resolvedContentType));
	return !inferredKind || inferredKind === "sticker" || inferredKind === "unknown" ? "document" : inferredKind;
}
function normalizeWhatsAppLoadedMedia(media, mediaUrl) {
	const filenameMimeType = mimeTypeFromFilePath(media.fileName);
	const normalizedContentType = normalizeMimeType(media.contentType);
	const resolvedContentType = !normalizedContentType || normalizedContentType === "application/octet-stream" ? filenameMimeType ?? normalizedContentType : normalizedContentType;
	const kind = inferWhatsAppMediaKind(media, resolvedContentType);
	const mimetype = kind === "audio" && isWhatsAppNativeVoiceAudio({
		contentType: media.contentType,
		fileName: media.fileName,
		mediaUrl
	}) ? WHATSAPP_VOICE_MIMETYPE : resolvedContentType ?? "application/octet-stream";
	const fileName = kind === "document" ? resolveWhatsAppDocumentFileName({
		fileName: media.fileName ?? deriveWhatsAppDocumentFileName(mediaUrl),
		mimetype
	}) : media.fileName;
	return {
		buffer: media.buffer,
		kind,
		mimetype,
		...fileName ? { fileName } : {}
	};
}
async function prepareWhatsAppOutboundMedia(media, mediaUrl) {
	const normalized = normalizeWhatsAppLoadedMedia(media, mediaUrl);
	if (normalized.kind !== "audio") return normalized;
	if (isWhatsAppNativeVoiceAudio({
		contentType: media.contentType,
		fileName: media.fileName,
		mediaUrl
	})) return normalized;
	return {
		buffer: await transcodeToWhatsAppVoiceOpus({
			buffer: media.buffer,
			fileName: media.fileName ?? deriveWhatsAppDocumentFileName(mediaUrl) ?? "audio"
		}),
		kind: "audio",
		mimetype: WHATSAPP_VOICE_MIMETYPE
	};
}
function isWhatsAppNativeVoiceAudio(params) {
	const contentType = normalizeMimeType(params.contentType);
	if (contentType === "audio/ogg" || contentType === "audio/opus") return true;
	const fileName = params.fileName ?? deriveWhatsAppDocumentFileName(params.mediaUrl) ?? "";
	const ext = path.extname(fileName).toLowerCase();
	return ext === ".ogg" || ext === ".opus";
}
async function transcodeToWhatsAppVoiceOpus(params) {
	return await transcodeAudioBufferToOpus({
		audioBuffer: params.buffer,
		inputFileName: params.fileName,
		tempPrefix: "whatsapp-voice-",
		outputFileName: WHATSAPP_VOICE_FILE_NAME,
		maxDurationSeconds: MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS,
		sampleRateHz: WHATSAPP_VOICE_SAMPLE_RATE_HZ,
		channels: 1,
		bitrate: WHATSAPP_VOICE_BITRATE
	});
}
function deriveWhatsAppDocumentFileName(mediaUrl) {
	if (!mediaUrl) return;
	try {
		const parsed = new URL(mediaUrl);
		const fileName = path.posix.basename(parsed.pathname);
		return fileName ? decodeURIComponent(fileName) : void 0;
	} catch {
		return (mediaUrl.split(/[?#]/, 1)[0] ?? "").split(/[\\/]/).pop() || void 0;
	}
}
//#endregion
//#region extensions/whatsapp/src/send.ts
const outboundLog = createSubsystemLogger$1("gateway/channels/whatsapp").child("outbound");
function supportsForcedDocumentDelivery(kind) {
	return kind === "image" || kind === "video";
}
function buildWhatsAppMediaSendState(params) {
	const { media, caption } = params;
	const forceDocumentDelivery = Boolean(params.forceDocument && supportsForcedDocumentDelivery(media.kind)) || media.kind === "document" && (media.mimetype.startsWith("image/") || media.mimetype.startsWith("video/"));
	let text = caption ?? "";
	let documentFileName = media.kind === "document" ? media.fileName : void 0;
	let visibleTextAfterVoice;
	if (media.kind === "audio" && caption) {
		visibleTextAfterVoice = caption;
		text = "";
	}
	if (forceDocumentDelivery) documentFileName ??= resolveWhatsAppDocumentFileName({
		fileName: media.fileName,
		mimetype: media.mimetype
	});
	return {
		mediaBuffer: media.buffer,
		mediaType: media.mimetype,
		text,
		forceDocumentDelivery,
		...documentFileName ? { documentFileName } : {},
		...visibleTextAfterVoice ? { visibleTextAfterVoice } : {}
	};
}
function resolveOutboundWhatsAppAccountId(params) {
	const explicitAccountId = params.accountId?.trim();
	if (explicitAccountId) return explicitAccountId;
	return resolveDefaultWhatsAppAccountId(params.cfg);
}
function requireOutboundActiveWebListener(params) {
	const resolvedAccountId = resolveOutboundWhatsAppAccountId(params) ?? resolveDefaultWhatsAppAccountId(params.cfg);
	const listener = getWhatsAppConnectionController(resolvedAccountId)?.getActiveListener() ?? null;
	if (!listener) {
		const cause = /* @__PURE__ */ new Error(`No active WhatsApp Web listener (account: ${resolvedAccountId}). Start the gateway, then link WhatsApp with: ${formatCliCommand(`openclaw channels login --channel whatsapp --account ${resolvedAccountId}`)}.`);
		throw new PlatformMessageNotDispatchedError(cause.message, { cause });
	}
	return {
		accountId: resolvedAccountId,
		listener
	};
}
function resolveActualSentRemoteJid(result, fallbackJid) {
	if (!result || typeof result !== "object") return fallbackJid;
	const rawKeys = result.keys;
	const keys = Array.isArray(rawKeys) ? rawKeys : [];
	for (const key of keys) if (typeof key?.remoteJid === "string" && key.remoteJid.trim()) return key.remoteJid.trim();
	return fallbackJid;
}
async function sendMessageWhatsApp(to, body, options) {
	return await sendWhatsAppUploadFile(to, body, options);
}
async function sendWhatsAppUploadFile(to, body, options) {
	return await withWhatsAppLogicalDeliveryActivity(() => sendMessageWhatsAppInActivityScope(to, body, options));
}
async function sendMessageWhatsAppInActivityScope(to, body, options) {
	let text = options.preserveLeadingWhitespace ? body : normalizeWhatsAppPayloadText(body);
	const jid = toWhatsappJid(to);
	const mediaUrls = resolveAdditiveWhatsAppMediaUrls(options);
	const mediaPayload = options.mediaPayload;
	const primaryMediaUrl = mediaUrls[0] ?? mediaPayload?.fileName;
	const hasMedia = Boolean(mediaPayload || primaryMediaUrl);
	if (!text && !hasMedia) return {
		messageId: "",
		toJid: jid
	};
	const correlationId = generateSecureUuid();
	const startedAt = Date.now();
	const cfg = requireRuntimeConfig(options.cfg, "WhatsApp send");
	const { listener: active, accountId: resolvedAccountId } = requireOutboundActiveWebListener({
		cfg,
		accountId: options.accountId
	});
	const account = resolveWhatsAppAccount({
		cfg,
		accountId: resolvedAccountId ?? options.accountId
	});
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "whatsapp",
		accountId: resolvedAccountId ?? options.accountId
	});
	const accountIdForFormatting = resolvedAccountId ?? options.accountId;
	const requestedLimit = options.formatting?.textLimit ?? Infinity;
	const textLimit = Math.min(requestedLimit > 0 ? requestedLimit : Infinity, resolveTextChunkLimit(cfg, "whatsapp", accountIdForFormatting, { fallbackLimit: 4e3 }), 4096);
	const textChunks = markdownToWhatsAppChunks(text, textLimit, tableMode, options.formatting?.chunkMode ?? resolveChunkMode(cfg, "whatsapp", accountIdForFormatting));
	text = textChunks.shift() ?? text;
	if (!text && !hasMedia) return {
		messageId: "",
		toJid: jid
	};
	const redactedTo = redactIdentifier(to);
	const logger = getChildLogger$1({
		module: "web-outbound",
		correlationId,
		to: redactedTo
	});
	const acceptedResults = [];
	try {
		const redactedJid = redactIdentifier(jid);
		let mediaBuffer;
		let mediaType;
		let documentFileName;
		let visibleTextAfterVoice;
		let forceDocumentDelivery = false;
		let media;
		if (mediaPayload) media = await prepareWhatsAppOutboundMedia(mediaPayload, primaryMediaUrl);
		else if (primaryMediaUrl) {
			const loadedMedia = await loadOutboundMediaFromUrl(primaryMediaUrl, {
				maxBytes: resolveWhatsAppMediaMaxBytes(account),
				optimizeImages: options.forceDocument ? false : void 0,
				mediaAccess: options.mediaAccess,
				mediaLocalRoots: options.mediaLocalRoots,
				mediaReadFile: options.mediaReadFile
			});
			const mediaWithRequestedType = options.contentType ? {
				...loadedMedia,
				contentType: options.contentType,
				kind: void 0
			} : loadedMedia;
			media = await prepareWhatsAppOutboundMedia(options.fileName ? {
				...mediaWithRequestedType,
				fileName: options.fileName
			} : mediaWithRequestedType, primaryMediaUrl);
		}
		if (media) {
			const mediaSendState = buildWhatsAppMediaSendState({
				media,
				caption: text || void 0,
				forceDocument: options.forceDocument
			});
			mediaBuffer = mediaSendState.mediaBuffer;
			mediaType = mediaSendState.mediaType;
			documentFileName = mediaSendState.documentFileName;
			visibleTextAfterVoice = mediaSendState.visibleTextAfterVoice;
			forceDocumentDelivery = mediaSendState.forceDocumentDelivery;
			text = mediaSendState.text;
		}
		outboundLog.info(`Sending message -> ${redactedJid}${hasMedia ? " (media)" : ""}`);
		logger.info({
			jid: redactedJid,
			hasMedia
		}, "sending message");
		if (!isWhatsAppNewsletterJid(jid)) {
			await active.assertSendReady?.(to);
			try {
				await active.sendComposingTo(to);
			} catch (err) {
				logger.warn({
					err: String(err),
					jid: redactedJid
				}, "failed to send composing presence; continuing message delivery");
			}
		}
		const accountId = Boolean(options.accountId?.trim()) ? resolvedAccountId : void 0;
		const trailingTextChunks = [visibleTextAfterVoice, ...textChunks].filter((chunk) => Boolean(chunk));
		const reportProgress = trailingTextChunks.length > 0 ? options.onDeliveryResult : void 0;
		const sendOptions = options.gifPlayback || forceDocumentDelivery || accountId || documentFileName ? {
			...options.gifPlayback ? { gifPlayback: true } : {},
			...forceDocumentDelivery ? { asDocument: true } : {},
			...documentFileName ? { fileName: documentFileName } : {},
			accountId
		} : void 0;
		const quotedSendOptions = options.quotedMessageKey ? {
			...sendOptions,
			quotedMessageKey: options.quotedMessageKey
		} : sendOptions;
		const nextReplyToId = createReplyToFanout({
			replyToId: options.quotedMessageKey?.id,
			replyToIdSource: options.replyToIdSource,
			replyToMode: options.replyToMode
		});
		const sendPart = async (part, buffer, mime) => {
			await options.onPlatformSendDispatch?.();
			const replyToId = nextReplyToId();
			const partOptions = replyToId ? quotedSendOptions : sendOptions;
			const accepted = requireWhatsAppAcceptedSendResult(partOptions ? await active.sendMessage(to, part, buffer, mime, partOptions) : await active.sendMessage(to, part, buffer, mime));
			acceptedResults.push(accepted);
			const result = {
				messageId: accepted.messageId,
				toJid: resolveActualSentRemoteJid(accepted, jid)
			};
			return {
				...result,
				...reportProgress ? { receipt: createMessageReceiptFromOutboundResults({
					results: [{
						channel: "whatsapp",
						...result
					}],
					kind: buffer ? "media" : "text",
					replyToId
				}) } : {}
			};
		};
		const result = await sendPart(text, mediaBuffer, mediaType);
		const { messageId, toJid: sentRemoteJid } = result;
		if (trailingTextChunks.length > 0) {
			await reportProgress?.(result);
			for (const trailingText of trailingTextChunks) {
				const trailingResult = await sendPart(trailingText);
				await reportProgress?.(trailingResult);
			}
		}
		const durationMs = Date.now() - startedAt;
		outboundLog.info(`Sent message ${messageId} -> ${redactedJid}${hasMedia ? " (media)" : ""} (${durationMs}ms)`);
		logger.info({
			jid: redactedJid,
			messageId
		}, "sent message");
		return {
			messageId,
			toJid: sentRemoteJid
		};
	} catch (err) {
		logger.error({
			err: String(err),
			to: redactedTo,
			hasMedia
		}, "failed to send via web session");
		const firstAccepted = acceptedResults[0];
		throw mergeWhatsAppAcceptedSendError({
			error: err,
			kind: firstAccepted?.kind ?? (hasMedia ? "media" : "text"),
			results: acceptedResults
		});
	}
}
async function sendTypingWhatsApp(to, options) {
	const { listener: active } = requireOutboundActiveWebListener({
		cfg: requireRuntimeConfig(options.cfg, "WhatsApp typing send"),
		accountId: options.accountId
	});
	if (!isWhatsAppNewsletterJid(toWhatsappJid(to))) {
		await active.assertSendReady?.(to);
		await active.sendComposingTo(to);
	}
}
async function sendReactionWhatsApp(chatJid, messageId, emoji, options) {
	const correlationId = generateSecureUuid();
	const { listener: active } = requireOutboundActiveWebListener({
		cfg: requireRuntimeConfig(options.cfg, "WhatsApp reaction"),
		accountId: options.accountId
	});
	const redactedChatJid = redactIdentifier(chatJid);
	const logger = getChildLogger$1({
		module: "web-outbound",
		correlationId,
		chatJid: redactedChatJid,
		messageId
	});
	try {
		const jid = toWhatsappJid(chatJid);
		const redactedJid = redactIdentifier(jid);
		outboundLog.info(`Sending reaction "${emoji}" -> message ${messageId}`);
		logger.info({
			chatJid: redactedJid,
			messageId,
			emoji
		}, "sending reaction");
		await active.sendReaction(chatJid, messageId, emoji, options.fromMe ?? false, options.participant);
		outboundLog.info(`Sent reaction "${emoji}" -> message ${messageId}`);
		logger.info({
			chatJid: redactedJid,
			messageId,
			emoji
		}, "sent reaction");
	} catch (err) {
		logger.error({
			err: String(err),
			chatJid: redactedChatJid,
			messageId,
			emoji
		}, "failed to send reaction via web session");
		throw err;
	}
}
async function sendPollWhatsApp(to, poll, options) {
	const correlationId = generateSecureUuid();
	const startedAt = Date.now();
	const { listener: active } = requireOutboundActiveWebListener({
		cfg: requireRuntimeConfig(options.cfg, "WhatsApp poll"),
		accountId: options.accountId
	});
	const redactedTo = redactIdentifier(to);
	const logger = getChildLogger$1({
		module: "web-outbound",
		correlationId,
		to: redactedTo
	});
	try {
		const jid = toWhatsappJid(to);
		const redactedJid = redactIdentifier(jid);
		const normalized = normalizePollInput(poll, { maxOptions: 12 });
		outboundLog.info(`Sending poll -> ${redactedJid}`);
		logger.info({
			jid: redactedJid,
			optionCount: normalized.options.length,
			maxSelections: normalized.maxSelections
		}, "sending poll");
		if (!isWhatsAppNewsletterJid(jid)) await active.assertSendReady?.(to);
		const result = requireWhatsAppAcceptedSendResult(await active.sendPoll(to, normalized));
		const messageId = result.messageId;
		const durationMs = Date.now() - startedAt;
		outboundLog.info(`Sent poll ${messageId} -> ${redactedJid} (${durationMs}ms)`);
		logger.info({
			jid: redactedJid,
			messageId
		}, "sent poll");
		return {
			messageId,
			toJid: resolveActualSentRemoteJid(result, jid)
		};
	} catch (err) {
		logger.error({
			err: String(err),
			to: redactedTo
		}, "failed to send poll via web session");
		throw err;
	}
}
//#endregion
export { resolveWhatsAppDocumentFileName as _, sendWhatsAppUploadFile as a, normalizeWhatsAppPayloadTextPreservingIndentation as c, listWhatsAppSendResultMessageIds as d, mergeWhatsAppAcceptedSendError as f, withWhatsAppLogicalDeliveryActivity as g, rememberWhatsAppPartialSend as h, sendTypingWhatsApp as i, prepareWhatsAppOutboundMedia as l, rememberWhatsAppAcceptedSend as m, sendPollWhatsApp as n, normalizeWhatsAppOutboundPayload as o, normalizeWhatsAppSendResult as p, sendReactionWhatsApp as r, normalizeWhatsAppPayloadText as s, sendMessageWhatsApp as t, combineWhatsAppSendResults as u, resolveWhatsAppReactionLevel as v };
