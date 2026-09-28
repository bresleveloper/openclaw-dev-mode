import { n as isWhatsAppNewsletterJid } from "./normalize-target-BGra1ZnM.mjs";
import { _ as resolveWhatsAppDocumentFileName, f as mergeWhatsAppAcceptedSendError, m as rememberWhatsAppAcceptedSend, p as normalizeWhatsAppSendResult, u as combineWhatsAppSendResults } from "./send-C6jDmcL9.mjs";
import "./normalize-DdsROMMa.mjs";
import { c as toWhatsappJid, l as toWhatsappJidWithLid, r as jidToE164 } from "./targets-runtime-RBjx3pg_.mjs";
import "./text-runtime-CHl0iPYe.mjs";
import { i as buildQuotedMessageOptions } from "./group-session-key-D22hYMdE.mjs";
import { k as resolveComparableIdentity } from "./auth-store-Dh8a3cba.mjs";
import { isRecord, normalizeLowercaseStringOrEmpty, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { formatLocationText } from "openclaw/plugin-sdk/channel-inbound";
import { getImageMetadata, resizeToJpeg } from "openclaw/plugin-sdk/media-runtime";
import { extractMessageContent, getContentType, normalizeMessageContent } from "baileys";
//#region extensions/whatsapp/src/vcard.ts
const ALLOWED_VCARD_KEYS = /* @__PURE__ */ new Set([
	"FN",
	"N",
	"TEL"
]);
function parseVcard(vcard) {
	if (!vcard) return { phones: [] };
	const lines = vcard.split(/\r?\n/);
	let nameFromN;
	let nameFromFn;
	const phones = [];
	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line) continue;
		const colonIndex = line.indexOf(":");
		if (colonIndex === -1) continue;
		const key = line.slice(0, colonIndex).toUpperCase();
		const rawValue = line.slice(colonIndex + 1).trim();
		if (!rawValue) continue;
		const baseKey = normalizeVcardKey(key);
		if (!baseKey || !ALLOWED_VCARD_KEYS.has(baseKey)) continue;
		const value = cleanVcardValue(rawValue);
		if (!value) continue;
		if (baseKey === "FN" && !nameFromFn) {
			nameFromFn = normalizeVcardName(value);
			continue;
		}
		if (baseKey === "N" && !nameFromN) {
			nameFromN = normalizeVcardName(value);
			continue;
		}
		if (baseKey === "TEL") {
			const phone = normalizeVcardPhone(value);
			if (phone) phones.push(phone);
		}
	}
	return {
		name: nameFromFn ?? nameFromN,
		phones
	};
}
function normalizeVcardKey(key) {
	const [primary] = key.split(";");
	if (!primary) return;
	const segments = primary.split(".");
	return segments[segments.length - 1] || void 0;
}
function cleanVcardValue(value) {
	return value.replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").trim();
}
function normalizeVcardName(value) {
	return value.replace(/;/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeVcardPhone(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if (normalizeLowercaseStringOrEmpty(trimmed).startsWith("tel:")) return trimmed.slice(4).trim();
	return trimmed;
}
//#endregion
//#region extensions/whatsapp/src/inbound/media-mimetype.ts
/**
* Resolve the MIME type for an inbound media message.
* Falls back to WhatsApp's standard formats when Baileys omits the MIME.
*/
function resolveInboundMediaMimetype(message) {
	const explicit = message.imageMessage?.mimetype ?? message.videoMessage?.mimetype ?? message.ptvMessage?.mimetype ?? message.documentMessage?.mimetype ?? message.audioMessage?.mimetype ?? message.stickerMessage?.mimetype ?? void 0;
	if (explicit) return explicit;
	if (message.audioMessage) return "audio/ogg; codecs=opus";
	if (message.imageMessage) return "image/jpeg";
	if (message.videoMessage || message.ptvMessage) return "video/mp4";
	if (message.stickerMessage) return "image/webp";
}
//#endregion
//#region extensions/whatsapp/src/inbound/extract.ts
function getFutureProofInnerMessage(message) {
	const contentType = getContentType(message);
	const candidate = contentType ? message[contentType] : void 0;
	if (candidate && typeof candidate === "object" && "message" in candidate && candidate.message && typeof candidate.message === "object") {
		const inner = normalizeMessageContent(candidate.message);
		if (inner) {
			const innerType = getContentType(inner);
			if (innerType && innerType !== contentType) return inner;
		}
	}
}
function projectWhatsAppInboundMessage(message) {
	const chain = [];
	let current = normalizeMessageContent(message);
	while (current && chain.length < 4) {
		chain.push(current);
		current = getFutureProofInnerMessage(current);
	}
	return chain;
}
function isWhatsAppInboundMessageProjection(message) {
	return Array.isArray(message);
}
function resolveWhatsAppInboundMessageProjection(message) {
	return isWhatsAppInboundMessageProjection(message) ? message : projectWhatsAppInboundMessage(message);
}
function findMessageSection(rawMessage, sectionNames) {
	const chain = projectWhatsAppInboundMessage(rawMessage);
	for (const name of sectionNames) for (const message of chain) {
		const value = message[name];
		if (isRecord(value)) return {
			name,
			value
		};
	}
}
function unwrapMessage(message) {
	return resolveWhatsAppInboundMessageProjection(message).at(-1);
}
function extractContextInfoFromMessage(message) {
	const contentType = getContentType(message);
	const candidate = contentType ? message[contentType] : void 0;
	const contextInfo = candidate && typeof candidate === "object" && "contextInfo" in candidate ? candidate.contextInfo : void 0;
	if (contextInfo) return contextInfo;
	const fallback = message.extendedTextMessage?.contextInfo ?? message.imageMessage?.contextInfo ?? message.videoMessage?.contextInfo ?? message.documentMessage?.contextInfo ?? message.audioMessage?.contextInfo ?? message.stickerMessage?.contextInfo ?? message.buttonsResponseMessage?.contextInfo ?? message.listResponseMessage?.contextInfo ?? message.templateButtonReplyMessage?.contextInfo ?? message.interactiveResponseMessage?.contextInfo ?? message.buttonsMessage?.contextInfo ?? message.listMessage?.contextInfo;
	if (fallback) return fallback;
	for (const value of Object.values(message)) {
		if (!value || typeof value !== "object") continue;
		if ("contextInfo" in value) {
			const candidateContext = value.contextInfo;
			if (candidateContext) return candidateContext;
		}
		if ("message" in value) {
			const inner = value.message;
			if (inner) {
				const innerCtx = extractContextInfo(inner);
				if (innerCtx) return innerCtx;
			}
		}
	}
}
function extractContextInfo(message) {
	for (const candidate of resolveWhatsAppInboundMessageProjection(message)) {
		const contextInfo = extractContextInfoFromMessage(candidate);
		if (contextInfo) return contextInfo;
	}
}
function extractMentionedJids(message) {
	const mentionedJids = extractContextInfo(message)?.mentionedJid?.filter(Boolean);
	if (!mentionedJids?.length) return;
	return uniqueStrings(mentionedJids);
}
function extractNativeFlowResponseText(response) {
	const paramsJson = response?.nativeFlowResponseMessage?.paramsJson;
	if (!paramsJson) return;
	try {
		const params = JSON.parse(paramsJson);
		if (!isRecord(params)) return;
		return [params.title, params.id].find((value) => typeof value === "string" && Boolean(value.trim()));
	} catch {
		return;
	}
}
function extractText(source) {
	const projection = resolveWhatsAppInboundMessageProjection(source);
	const message = unwrapMessage(projection);
	if (!message) return;
	const extracted = extractMessageContent(message);
	const candidates = [message, extracted && extracted !== message ? extracted : void 0];
	for (const candidate of candidates) {
		if (!candidate) continue;
		if (typeof candidate.conversation === "string" && candidate.conversation.trim()) return candidate.conversation.trim();
		const extended = candidate.extendedTextMessage?.text;
		if (extended?.trim()) return extended.trim();
		const caption = candidate.imageMessage?.caption ?? candidate.videoMessage?.caption ?? candidate.ptvMessage?.caption ?? candidate.documentMessage?.caption;
		if (caption?.trim()) return caption.trim();
		const interactiveSelection = [
			candidate.buttonsResponseMessage?.selectedDisplayText,
			candidate.buttonsResponseMessage?.selectedButtonId,
			candidate.listResponseMessage?.title,
			candidate.listResponseMessage?.singleSelectReply?.selectedRowId,
			candidate.templateButtonReplyMessage?.selectedDisplayText,
			candidate.templateButtonReplyMessage?.selectedId,
			candidate.interactiveResponseMessage?.body?.text,
			extractNativeFlowResponseText(candidate.interactiveResponseMessage)
		].find((value) => Boolean(value?.trim()));
		if (interactiveSelection) return interactiveSelection.trim();
		const poll = candidate.pollCreationMessage ?? candidate.pollCreationMessageV2 ?? candidate.pollCreationMessageV3 ?? candidate.pollCreationMessageV5;
		if (poll) {
			const pollText = [poll.name?.trim(), ...(poll.options ?? []).map((option) => option.optionName?.trim()).filter((option) => Boolean(option)).map((option) => `- ${option}`)].filter(Boolean).join("\n");
			if (pollText) return pollText;
		}
	}
	const contactPlaceholder = extractContactPlaceholder(projection) ?? (extracted && extracted !== message ? extractContactPlaceholder(extracted) : void 0);
	if (contactPlaceholder) return contactPlaceholder;
}
function extractExternalAdReplyContext(source) {
	const message = unwrapMessage(source);
	const adReply = message?.imageMessage?.contextInfo?.externalAdReply ?? message?.videoMessage?.contextInfo?.externalAdReply;
	if (!adReply) return;
	const title = adReply.title?.trim() || void 0;
	const sourceUrl = adReply.sourceUrl?.trim() || void 0;
	const body = adReply.body?.trim() || void 0;
	return title || sourceUrl || body ? {
		title,
		sourceUrl,
		body
	} : void 0;
}
function extractMediaKind(source) {
	const message = unwrapMessage(source);
	if (!message) return;
	if (message.imageMessage) return "image";
	if (message.videoMessage || message.ptvMessage) return "video";
	if (message.audioMessage) return "audio";
	if (message.documentMessage) return "document";
	if (message.stickerMessage) return "sticker";
}
function extractContactPlaceholder(source) {
	const contactContext = extractContactContext(source);
	if (!contactContext) return;
	if (contactContext.kind === "contact") return "<contact>";
	const suffix = contactContext.total === 1 ? "contact" : "contacts";
	return `<contacts: ${contactContext.total} ${suffix}>`;
}
function extractContactContext(source) {
	const message = unwrapMessage(source);
	if (!message) return;
	const contact = message.contactMessage ?? void 0;
	if (contact) {
		const { name, phones } = describeContact({
			displayName: contact.displayName,
			vcard: contact.vcard
		});
		return {
			kind: "contact",
			total: 1,
			contacts: [{
				name,
				phones
			}]
		};
	}
	const contactsArray = message.contactsArrayMessage?.contacts ?? void 0;
	if (!contactsArray || contactsArray.length === 0) return;
	return {
		kind: "contacts",
		total: contactsArray.length,
		contacts: contactsArray.map((entry) => describeContact({
			displayName: entry.displayName,
			vcard: entry.vcard
		}))
	};
}
function describeContact(input) {
	const displayName = (input.displayName ?? "").trim();
	const parsed = parseVcard(input.vcard ?? void 0);
	return {
		name: displayName || parsed.name,
		phones: parsed.phones
	};
}
function extractLocationData(source) {
	const message = unwrapMessage(source);
	if (!message) return null;
	const live = message.liveLocationMessage ?? void 0;
	if (live) {
		const latitudeRaw = live.degreesLatitude;
		const longitudeRaw = live.degreesLongitude;
		if (latitudeRaw != null && longitudeRaw != null) {
			const latitude = latitudeRaw;
			const longitude = longitudeRaw;
			if (Number.isFinite(latitude) && Number.isFinite(longitude)) return {
				latitude,
				longitude,
				accuracy: live.accuracyInMeters ?? void 0,
				caption: live.caption ?? void 0,
				source: "live",
				isLive: true
			};
		}
	}
	const location = message.locationMessage ?? void 0;
	if (location) {
		const latitudeRaw = location.degreesLatitude;
		const longitudeRaw = location.degreesLongitude;
		if (latitudeRaw != null && longitudeRaw != null) {
			const latitude = latitudeRaw;
			const longitude = longitudeRaw;
			if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
				const isLive = Boolean(location.isLive);
				return {
					latitude,
					longitude,
					accuracy: location.accuracyInMeters ?? void 0,
					name: location.name ?? void 0,
					address: location.address ?? void 0,
					caption: location.comment ?? void 0,
					source: isLive ? "live" : location.name || location.address ? "place" : "pin",
					isLive
				};
			}
		}
	}
	return null;
}
function describeReplyContext(source) {
	const projection = resolveWhatsAppInboundMessageProjection(source);
	const message = unwrapMessage(projection);
	if (!message) return null;
	const contextInfo = extractContextInfo(projection.length === 1 && projection[0] === message ? projection : projectWhatsAppInboundMessage(message));
	const quoted = normalizeMessageContent(contextInfo?.quotedMessage);
	if (!quoted && !contextInfo?.stanzaId) return null;
	const senderJid = contextInfo?.participant ?? void 0;
	const sender = resolveComparableIdentity({
		jid: senderJid,
		label: senderJid ? jidToE164(senderJid) ?? senderJid : "unknown sender"
	});
	if (!quoted) return {
		id: contextInfo?.stanzaId || void 0,
		body: "[quoted message unavailable]",
		sender
	};
	const quotedProjection = projectWhatsAppInboundMessage(quoted);
	const location = extractLocationData(quotedProjection);
	const locationText = location ? formatLocationText(location) : void 0;
	const body = [extractText(quotedProjection), locationText].filter(Boolean).join("\n").trim();
	const mediaKind = extractMediaKind(quotedProjection);
	const media = mediaKind ? {
		kind: mediaKind,
		contentType: resolveInboundMediaMimetype(quoted)
	} : void 0;
	if (!body && !media) {
		const quotedType = quoted ? getContentType(quoted) : void 0;
		logVerbose(`Quoted message missing extractable body${quotedType ? ` (type ${quotedType})` : ""}`);
		return null;
	}
	return {
		id: contextInfo?.stanzaId || void 0,
		body: body ?? "",
		media,
		sender
	};
}
function hasInteractiveResponseContent(message) {
	if (!message) return false;
	return Boolean(message.buttonsResponseMessage || message.listResponseMessage || message.templateButtonReplyMessage || message.interactiveResponseMessage);
}
/**
* Fast check that a Baileys message carries user-visible inbound content
* (text, media, contact, location, button/list selection). Returns false for
* protocol/receipt/typing notifications that arrive on the same
* `messages.upsert` stream as real messages but should not trigger pairing
* access-control side effects.
*/
function hasInboundUserContent(source) {
	const projection = resolveWhatsAppInboundMessageProjection(source);
	if (projection.length === 0) return false;
	if (extractText(projection)) return true;
	if (extractMediaKind(projection)) return true;
	if (extractLocationData(projection)) return true;
	for (const candidate of projection) if (hasInteractiveResponseContent(candidate)) return true;
	return false;
}
//#endregion
//#region extensions/whatsapp/src/image-preview.ts
const WHATSAPP_IMAGE_THUMBNAIL_SIDE = 32;
const WHATSAPP_IMAGE_THUMBNAIL_QUALITY = 50;
async function addWhatsAppImagePreviewFields(content) {
	if (!("image" in content) || !Buffer.isBuffer(content.image)) return content;
	const image = content.image;
	const hasDimensions = typeof content.width === "number" && typeof content.height === "number";
	const hasThumbnail = typeof content.jpegThumbnail === "string";
	if (hasDimensions && hasThumbnail) return content;
	const metadata = hasDimensions ? null : await getImageMetadata(image).catch(() => null);
	const jpegThumbnail = hasThumbnail ? content.jpegThumbnail : await resizeToJpeg({
		buffer: image,
		maxSide: WHATSAPP_IMAGE_THUMBNAIL_SIDE,
		quality: WHATSAPP_IMAGE_THUMBNAIL_QUALITY,
		withoutEnlargement: true
	}).then((thumbnail) => thumbnail.toString("base64")).catch(() => "");
	return {
		...content,
		...metadata ? {
			width: metadata.width,
			height: metadata.height
		} : {},
		jpegThumbnail
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/outbound-mentions.ts
const CODE_FENCE_RE = /```[\s\S]*?```/g;
const INLINE_CODE_RE = /(?<=(?:^|[^\\])(?:\\\\)*)(`+)[\s\S]*?(?:(?<!`)\1(?!`)|$)/g;
const OUTBOUND_MENTION_RE = /@(\+?\d+)/g;
const KNOWN_USER_JID_RE = /^(\d+)(?::\d+)?@(s\.whatsapp\.net|hosted|lid|hosted\.lid|c\.us)$/i;
const PHONE_JID_DOMAIN_RE = /^(s\.whatsapp\.net|hosted|c\.us)$/i;
const LID_JID_DOMAIN_RE = /^(lid|hosted\.lid)$/i;
function isWhatsAppGroupJid(jid) {
	return jid.endsWith("@g.us");
}
function mayContainWhatsAppOutboundMention(text) {
	return /@\+?\d/.test(text);
}
function collectCodeRanges(text) {
	const ranges = [];
	for (const match of text.matchAll(CODE_FENCE_RE)) ranges.push({
		start: match.index,
		end: match.index + match[0].length
	});
	for (const match of text.matchAll(INLINE_CODE_RE)) {
		const start = match.index;
		if (ranges.some((range) => start >= range.start && start < range.end)) continue;
		ranges.push({
			start,
			end: start + match[0].length
		});
	}
	return ranges.toSorted((a, b) => a.start - b.start);
}
function isInRange(index, ranges) {
	return ranges.some((range) => index >= range.start && index < range.end);
}
function normalizeKnownUserJid(value) {
	const trimmed = value.replace(/^whatsapp:/i, "").trim();
	const jidMatch = trimmed.match(KNOWN_USER_JID_RE);
	if (jidMatch) {
		const user = jidMatch[1];
		const rawDomain = jidMatch[2];
		if (!user || !rawDomain) return null;
		return `${user}@${rawDomain.toLowerCase() === "c.us" ? "s.whatsapp.net" : rawDomain.toLowerCase()}`;
	}
	const digits = trimmed.startsWith("+") ? trimmed.replace(/\D/g, "") : /^\d+$/.test(trimmed) ? trimmed : "";
	return digits ? `${digits}@s.whatsapp.net` : null;
}
function extractKnownJidParts(value) {
	const normalized = normalizeKnownUserJid(value);
	if (!normalized) return null;
	const match = normalized.match(/^(\d+)@(.+)$/);
	const user = match?.[1];
	const domain = match?.[2];
	return user && domain ? {
		user,
		domain
	} : null;
}
function extractPhoneDigits(value) {
	if (!value) return null;
	const trimmed = value.replace(/^whatsapp:/i, "").trim();
	if (trimmed.startsWith("+") || /^\d+$/.test(trimmed)) return trimmed.replace(/\D/g, "") || null;
	const parts = extractKnownJidParts(trimmed);
	return parts && PHONE_JID_DOMAIN_RE.test(parts.domain) ? parts.user : null;
}
function extractLidDigits(value) {
	if (!value) return null;
	const parts = extractKnownJidParts(value);
	return parts && LID_JID_DOMAIN_RE.test(parts.domain) ? parts.user : null;
}
function isLidJid(jid) {
	const parts = extractKnownJidParts(jid);
	return Boolean(parts && LID_JID_DOMAIN_RE.test(parts.domain));
}
function lidReplacementText(jid) {
	const parts = extractKnownJidParts(jid);
	if (!parts || !LID_JID_DOMAIN_RE.test(parts.domain)) return;
	return `@${parts.user}`;
}
function participantValues(participant) {
	return typeof participant === "string" ? { id: participant } : participant;
}
function chooseMentionJid(participant) {
	const values = participantValues(participant);
	const idJid = normalizeKnownUserJid(values.id ?? "");
	const lidJid = normalizeKnownUserJid(values.lid ?? "");
	return (idJid && isLidJid(idJid) ? idJid : null) ?? (lidJid && isLidJid(lidJid) ? lidJid : null) ?? idJid ?? lidJid ?? normalizeKnownUserJid(values.phoneNumber ?? "") ?? normalizeKnownUserJid(values.e164 ?? "");
}
function buildMentionTargetMaps(participants) {
	const byPhone = /* @__PURE__ */ new Map();
	const byLid = /* @__PURE__ */ new Map();
	for (const participant of participants) {
		const mentionJid = chooseMentionJid(participant);
		if (!mentionJid) continue;
		const target = {
			mentionJid,
			...isLidJid(mentionJid) ? { replacementText: lidReplacementText(mentionJid) } : {}
		};
		const values = participantValues(participant);
		for (const value of [
			values.id,
			values.phoneNumber,
			values.e164
		]) {
			const digits = extractPhoneDigits(value);
			if (digits && !byPhone.has(digits)) byPhone.set(digits, target);
		}
		for (const value of [values.id, values.lid]) {
			const digits = extractLidDigits(value);
			if (digits && !byLid.has(digits)) byLid.set(digits, target);
		}
	}
	return {
		byPhone,
		byLid
	};
}
function shouldSkipMentionAt(text, index, end, codeRanges) {
	if (isInRange(index, codeRanges)) return true;
	const previous = index > 0 ? text[index - 1] : "";
	const next = text[end] ?? "";
	return Boolean(previous && /[\w@]/.test(previous) || next && /[\w@]/.test(next));
}
function resolveWhatsAppOutboundMentions(params) {
	if (!isWhatsAppGroupJid(params.chatJid) || !mayContainWhatsAppOutboundMention(params.text) || !params.participants?.length) return {
		text: params.text,
		mentionedJids: []
	};
	const { byPhone, byLid } = buildMentionTargetMaps(params.participants);
	if (byPhone.size === 0 && byLid.size === 0) return {
		text: params.text,
		mentionedJids: []
	};
	const codeRanges = collectCodeRanges(params.text);
	const replacements = [];
	const mentionedJids = [];
	const seenMentionJids = /* @__PURE__ */ new Set();
	for (const match of params.text.matchAll(OUTBOUND_MENTION_RE)) {
		const start = match.index;
		const token = match[0];
		if (shouldSkipMentionAt(params.text, start, start + token.length, codeRanges)) continue;
		const rawDigits = match[1];
		if (!rawDigits) continue;
		const digits = rawDigits.replace(/\D/g, "");
		const target = token.startsWith("@+") ? byPhone.get(digits) ?? byLid.get(digits) : byLid.get(digits) ?? byPhone.get(digits);
		if (!target) continue;
		if (!seenMentionJids.has(target.mentionJid)) {
			seenMentionJids.add(target.mentionJid);
			mentionedJids.push(target.mentionJid);
		}
		if (target.replacementText && target.replacementText !== token) replacements.push({
			start,
			end: start + token.length,
			text: target.replacementText
		});
	}
	if (replacements.length === 0) return {
		text: params.text,
		mentionedJids
	};
	let text = "";
	let cursor = 0;
	for (const replacement of replacements) {
		text += params.text.slice(cursor, replacement.start);
		text += replacement.text;
		cursor = replacement.end;
	}
	text += params.text.slice(cursor);
	return {
		text,
		mentionedJids
	};
}
function addWhatsAppOutboundMentionsToContent(content, mentionedJids) {
	return mentionedJids.length > 0 ? {
		...content,
		mentions: [...mentionedJids]
	} : content;
}
//#endregion
//#region extensions/whatsapp/src/inbound/send-api.ts
function supportsForcedDocumentMediaType(mediaType) {
	return mediaType.startsWith("image/") || mediaType.startsWith("video/");
}
function createWebSendApi(params) {
	const resolveOutboundJid = (recipient) => params.authDir ? toWhatsappJidWithLid(recipient, { authDir: params.authDir }) : toWhatsappJid(recipient);
	const resolveMentions = async (jid, text) => params.resolveOutboundMentions ? await params.resolveOutboundMentions({
		jid,
		text
	}) : {
		text,
		mentionedJids: []
	};
	const runAcceptedSend = async (kind, accountId, send) => {
		const results = [];
		try {
			await send((result, sendKind) => {
				rememberWhatsAppAcceptedSend({
					accountId,
					result: normalizeWhatsAppSendResult(result, sendKind),
					results
				});
			});
			return combineWhatsAppSendResults(kind, results);
		} catch (error) {
			throw mergeWhatsAppAcceptedSendError({
				error,
				kind,
				results
			});
		}
	};
	const sendStructuredMessage = async (to, content, kind) => {
		const jid = resolveOutboundJid(to);
		return await runAcceptedSend(kind, params.defaultAccountId, async (capture) => {
			capture(await params.sock.sendMessage(jid, content), kind);
		});
	};
	return {
		sendMessage: async (to, text, mediaBuffer, mediaTypeInput, sendOptions) => {
			let mediaType = mediaTypeInput;
			const jid = resolveOutboundJid(to);
			let payload;
			if (mediaBuffer) mediaType ??= "application/octet-stream";
			const shouldSendAudioText = Boolean(mediaBuffer && mediaType?.startsWith("audio/") && text.trim());
			const resolvedPayloadText = shouldSendAudioText ? {
				text,
				mentionedJids: []
			} : await resolveMentions(jid, text);
			if (mediaBuffer && mediaType) {
				if (sendOptions?.asDocument === true && supportsForcedDocumentMediaType(mediaType)) payload = {
					document: mediaBuffer,
					fileName: resolveWhatsAppDocumentFileName({
						fileName: sendOptions?.fileName,
						mimetype: mediaType
					}),
					caption: resolvedPayloadText.text || void 0,
					mimetype: mediaType
				};
				else if (mediaType.startsWith("image/")) payload = await addWhatsAppImagePreviewFields({
					image: mediaBuffer,
					caption: resolvedPayloadText.text || void 0,
					mimetype: mediaType
				});
				else if (mediaType.startsWith("audio/")) payload = {
					audio: mediaBuffer,
					ptt: true,
					mimetype: mediaType
				};
				else if (mediaType.startsWith("video/")) {
					const gifPlayback = sendOptions?.gifPlayback;
					payload = {
						video: mediaBuffer,
						caption: resolvedPayloadText.text || void 0,
						mimetype: mediaType,
						...gifPlayback ? { gifPlayback: true } : {}
					};
				} else payload = {
					document: mediaBuffer,
					fileName: resolveWhatsAppDocumentFileName({
						fileName: sendOptions?.fileName,
						mimetype: mediaType
					}),
					caption: resolvedPayloadText.text || void 0,
					mimetype: mediaType
				};
			} else payload = { text: resolvedPayloadText.text };
			payload = addWhatsAppOutboundMentionsToContent(payload, resolvedPayloadText.mentionedJids);
			const quotedOpts = buildQuotedMessageOptions({
				messageId: sendOptions?.quotedMessageKey?.id,
				remoteJid: sendOptions?.quotedMessageKey?.remoteJid,
				fromMe: sendOptions?.quotedMessageKey?.fromMe,
				participant: sendOptions?.quotedMessageKey?.participant,
				destinationJid: jid,
				requestedJid: toWhatsappJid(to),
				lookupTargetJid: sendOptions?.quotedMessageKey?.lookupTargetJid,
				messageText: sendOptions?.quotedMessageKey?.messageText,
				media: sendOptions?.quotedMessageKey?.media
			});
			const kind = mediaBuffer ? "media" : "text";
			const accountId = sendOptions?.accountId ?? params.defaultAccountId;
			return await runAcceptedSend(kind, accountId, async (capture) => {
				const sendPayload = async (content) => quotedOpts ? await params.sock.sendMessage(jid, content, quotedOpts) : await params.sock.sendMessage(jid, content);
				capture(await sendPayload(payload), kind);
				if (shouldSendAudioText) {
					const resolvedAudioText = await resolveMentions(jid, text);
					capture(await sendPayload(addWhatsAppOutboundMentionsToContent({ text: resolvedAudioText.text }, resolvedAudioText.mentionedJids)), "text");
				}
			});
		},
		sendPoll: async (to, poll) => {
			return await sendStructuredMessage(to, { poll: {
				name: poll.question,
				values: poll.options,
				selectableCount: poll.maxSelections ?? 1
			} }, "poll");
		},
		sendContact: async (to, contact) => {
			return await sendStructuredMessage(to, { contacts: {
				displayName: contact.displayName,
				contacts: [{
					displayName: contact.displayName,
					vcard: contact.vcard
				}]
			} }, "contact");
		},
		sendLocation: async (to, location) => {
			return await sendStructuredMessage(to, { location: {
				degreesLatitude: location.degreesLatitude,
				degreesLongitude: location.degreesLongitude,
				name: location.name,
				address: location.address
			} }, "location");
		},
		sendSticker: async (to, stickerBuffer, options) => {
			return await sendStructuredMessage(to, {
				sticker: stickerBuffer,
				mimetype: options?.mimetype ?? "image/webp"
			}, "sticker");
		},
		sendReaction: async (chatJid, messageId, emoji, fromMe, participant) => {
			const jid = resolveOutboundJid(chatJid);
			const result = await params.sock.sendMessage(jid, { react: {
				text: emoji,
				key: {
					remoteJid: jid,
					id: messageId,
					fromMe,
					participant: participant ? toWhatsappJid(participant) : void 0
				}
			} });
			return normalizeWhatsAppSendResult(result, "reaction");
		},
		sendComposingTo: async (to) => {
			const jid = resolveOutboundJid(to);
			if (isWhatsAppNewsletterJid(jid)) return;
			await params.sock.sendPresenceUpdate("composing", jid);
		}
	};
}
//#endregion
export { resolveInboundMediaMimetype as _, addWhatsAppImagePreviewFields as a, extractContextInfo as c, extractMediaKind as d, extractMentionedJids as f, projectWhatsAppInboundMessage as g, hasInboundUserContent as h, resolveWhatsAppOutboundMentions as i, extractExternalAdReplyContext as l, findMessageSection as m, addWhatsAppOutboundMentionsToContent as n, describeReplyContext as o, extractText as p, mayContainWhatsAppOutboundMention as r, extractContactContext as s, createWebSendApi as t, extractLocationData as u };
