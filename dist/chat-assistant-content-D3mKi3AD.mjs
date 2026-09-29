import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { C as readPairingQrReplyChannelData, D as stripReplyMediaFailureFallback, h as isReplyPayloadStatusNotice, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { o as trimTextPreservingCode } from "./text-projection-DLGaFuGQ.mjs";
import { s as stripInlineDirectiveTagsForDelivery } from "./directive-tags-D9uZSb5h.mjs";
import { t as createOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { n as isSuppressedControlReplyText } from "./control-reply-text-CDvIm13S.mjs";
import { t as stripEnvelopeFromMessage } from "./chat-sanitize-DJLXxv7H.mjs";
import { n as renderQrPngDataUrl } from "./qr-image-BrIEup0G.mjs";
import { t as renderQrTerminal } from "./qr-terminal-D9I7Hp6E.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { a as buildManagedMediaFailureBlock, d as prepareOutgoingMediaFromReplyPayload, s as createManagedOutgoingMediaBlocks } from "./managed-image-attachments-esuKWCel.mjs";
//#region src/gateway/server-methods/chat-assistant-content.ts
const MANAGED_OUTGOING_MEDIA_PATH_PREFIX = "/api/chat/media/outgoing/";
/** Recombine non-streamed text without destroying Markdown's meaningful indentation. */
function combineNonStreamingReplyParts(parts) {
	let combined = "";
	for (const part of parts) {
		if (!part.trim()) continue;
		if (!combined) {
			combined = part;
			continue;
		}
		const separator = /[\r\n]$/.test(combined) || /^[\r\n]/.test(part) ? "" : /^[\t ]+\S/.test(part) ? "\n" : "\n\n";
		combined += separator + part;
	}
	return trimTextPreservingCode(combined);
}
function isMediaBearingPayload(payload) {
	if (payload.isReasoning === true) return false;
	if (payload.mediaUrl?.trim()) return true;
	return Boolean(payload.mediaUrls?.some((url) => url.trim()));
}
function hasSensitiveMediaPayload(payloads) {
	return payloads.some((payload) => payload.sensitiveMedia === true && (isMediaBearingPayload(payload) || Boolean(readPairingQrReplyChannelData(payload))));
}
async function buildPairingQrAssistantContentBlock(payload) {
	const qr = readPairingQrReplyChannelData(payload);
	if (!qr) return;
	const [imageUrl, terminalText] = await Promise.all([renderQrPngDataUrl(qr.setupCode), renderQrTerminal(qr.setupCode, { small: true })]);
	return {
		type: "openclaw_pairing_qr",
		image_url: imageUrl,
		terminalText,
		alt: "OpenClaw pairing QR code",
		expiresAtMs: qr.expiresAtMs,
		sensitive: true
	};
}
function sanitizeAssistantDisplayText(value, options) {
	if (!value) return;
	const withoutEnvelope = stripEnvelopeFromMessage(value);
	const normalized = typeof withoutEnvelope === "string" ? withoutEnvelope : value;
	const stripped = stripInlineDirectiveTagsForDelivery(normalized);
	const visible = trimTextPreservingCode(stripped.text);
	return visible ? options?.preserveBoundaries && !stripped.changed ? normalized : visible : void 0;
}
function prepareAssistantDisplayText(value, options) {
	if (!value) return;
	const withoutEnvelope = stripEnvelopeFromMessage(value);
	const normalized = typeof withoutEnvelope === "string" ? withoutEnvelope : value;
	return normalized.trim() ? options?.preserveBoundaries ? normalized : trimTextPreservingCode(normalized) : void 0;
}
function extractAssistantDisplayText(content) {
	if (!Array.isArray(content) || content.length === 0) return;
	const parts = [];
	for (const block of content) if (block?.type === "text" && typeof block.text === "string" && block.text) parts.push(block.text);
	return combineNonStreamingReplyParts(parts) || void 0;
}
function buildAssistantReplyContent(params) {
	return buildAssistantReplyContentFromInputs({
		...params,
		inputs: params.payloads.map((payload) => ({
			kind: "raw",
			payload
		}))
	});
}
async function buildAssistantReplyContentFromInputs(params) {
	const payloads = params.inputs.map((input) => input.kind === "raw" ? input.payload : input.plan.payload);
	const rawTextPayloadCount = payloads.filter((payload) => payload.isReasoning !== true && typeof payload.text === "string" && payload.text.trim().length > 0).length;
	const plan = params.inputs.flatMap((input, sourceIndex) => {
		if (payloads[sourceIndex]?.isReasoning === true) return [];
		return (input.kind === "raw" ? createOutboundPayloadPlan([input.payload]) : [input.plan]).map((entry) => Object.assign({}, entry, { sourceIndex }));
	});
	if (plan.length === 0) {
		const failureBlocks = payloads.flatMap((payload) => payload.isReasoning === true ? [] : (getReplyPayloadMetadata(payload)?.assistantMediaFailures ?? []).map(buildManagedMediaFailureBlock));
		const assistantContent = failureBlocks.length > 0 ? failureBlocks : rawTextPayloadCount > 0 ? [{
			type: "text",
			text: ""
		}] : void 0;
		return {
			assistantContent,
			persistedAssistantContent: assistantContent
		};
	}
	const preserveTextBoundaries = plan.filter(({ payload }) => typeof payload.text === "string" && payload.text.trim()).length > 1;
	const content = [];
	const persistedContent = [];
	const persistSensitiveDisplay = !hasSensitiveMediaPayload(payloads);
	let strippedTextPayloadCount = 0;
	for (const entry of plan) {
		const payload = entry.payload;
		const metadataSource = payloads[entry.sourceIndex] ?? payload;
		const mediaFailures = getReplyPayloadMetadata(metadataSource)?.assistantMediaFailures ?? [];
		const isPrepared = params.inputs[entry.sourceIndex]?.kind === "prepared";
		const statusNotice = isReplyPayloadStatusNotice(payload);
		const text = (isPrepared ? prepareAssistantDisplayText : sanitizeAssistantDisplayText)(stripReplyMediaFailureFallback(payload.text, mediaFailures), { preserveBoundaries: preserveTextBoundaries });
		if (text && (isPrepared || !isSuppressedControlReplyText(text))) {
			if (statusNotice) content.push({
				type: "text",
				text,
				openclawStatusNotice: true
			});
			else {
				const previousBlock = content.at(-1);
				if (Array.isArray(previousBlock)) previousBlock.push(text);
				else content.push([text]);
			}
		} else if (typeof payload.text === "string" && payload.text.trim().length > 0) strippedTextPayloadCount += 1;
		const transcriptText = params.transcriptMediaMessage?.payloadTexts[entry.sourceIndex] ?? text;
		if (transcriptText && (isPrepared || !isSuppressedControlReplyText(transcriptText))) persistedContent.push({
			type: "text",
			text: transcriptText,
			...statusNotice ? { openclawStatusNotice: true } : {}
		});
		if (params.includeSensitiveDisplay === true) try {
			const pairingQrBlock = await buildPairingQrAssistantContentBlock(payload);
			if (pairingQrBlock) {
				content.push(pairingQrBlock);
				if (persistSensitiveDisplay) persistedContent.push(pairingQrBlock);
			}
		} catch (err) {
			params.onSensitiveDisplayPrepareError?.(formatForLog(err));
		}
		if (params.includeSensitiveMedia === false && payload.sensitiveMedia === true) continue;
		const mediaBlocks = await createManagedOutgoingMediaBlocks({
			assertCurrent: params.assertCurrent,
			abortSignal: params.abortSignal,
			sessionKey: params.sessionKey,
			...params.agentId ? { agentId: params.agentId } : {},
			items: prepareOutgoingMediaFromReplyPayload(payload, metadataSource),
			localRoots: params.managedMediaLocalRoots,
			continueOnPrepareError: true,
			onPrepareError: (error) => {
				params.onManagedMediaPrepareError?.(error.message);
			}
		});
		if (payload.audioAsVoice === true) {
			for (const block of mediaBlocks) if (block.type === "audio") block.isVoiceNote = true;
		}
		const mediaContent = [...mediaBlocks, ...mediaFailures.map(buildManagedMediaFailureBlock)];
		content.push(...mediaContent);
		persistedContent.push(...mediaContent);
	}
	return {
		assistantContent: content.length > 0 ? content.map((block) => Array.isArray(block) ? {
			type: "text",
			text: block.length === 1 ? block[0] : combineNonStreamingReplyParts(block)
		} : block) : strippedTextPayloadCount > 0 ? [{
			type: "text",
			text: ""
		}] : void 0,
		persistedAssistantContent: persistedContent.length > 0 ? persistedContent : strippedTextPayloadCount > 0 ? [{
			type: "text",
			text: ""
		}] : void 0
	};
}
function isManagedOutgoingMediaUrl(value) {
	if (typeof value !== "string" || !value.trim()) return false;
	try {
		return new URL(value, "http://localhost").pathname.startsWith(MANAGED_OUTGOING_MEDIA_PATH_PREFIX);
	} catch {
		return false;
	}
}
function stripManagedOutgoingAssistantContentBlocks(content) {
	if (!content || content.length === 0) return;
	const filtered = content.filter((block) => {
		const attachment = block?.type === "attachment" ? asOptionalRecord(block.attachment) : void 0;
		if (block?.type !== "image" && block?.type !== "audio" && block?.type !== "video" && !attachment) return true;
		return !(isManagedOutgoingMediaUrl(block.url) || isManagedOutgoingMediaUrl(block.openUrl) || isManagedOutgoingMediaUrl(attachment?.url));
	});
	return filtered.length > 0 ? filtered : void 0;
}
function hasAssistantDisplayMediaContent(content) {
	return Boolean(content?.some((block) => block?.type !== "text"));
}
function hasVisibleAssistantFinalMessage(message) {
	if (!message) return false;
	if (typeof message.text === "string" && message.text.trim()) return true;
	return (Array.isArray(message.content) ? message.content : []).some((block) => {
		if (!block || typeof block !== "object") return false;
		const record = block;
		if (record.type === "text") return typeof record.text === "string" && record.text.trim().length > 0;
		return true;
	});
}
function hasManagedOutgoingAssistantContent(content) {
	return Boolean(content?.some((block) => (block?.type === "image" || block?.type === "audio" || block?.type === "video") && (isManagedOutgoingMediaUrl(block.url) || isManagedOutgoingMediaUrl(block.openUrl)) || block?.type === "attachment" && isManagedOutgoingMediaUrl(asOptionalRecord(block.attachment)?.url)));
}
//#endregion
export { hasAssistantDisplayMediaContent as a, isMediaBearingPayload as c, stripManagedOutgoingAssistantContentBlocks as d, extractAssistantDisplayText as i, prepareAssistantDisplayText as l, buildAssistantReplyContentFromInputs as n, hasManagedOutgoingAssistantContent as o, combineNonStreamingReplyParts as r, hasVisibleAssistantFinalMessage as s, buildAssistantReplyContent as t, sanitizeAssistantDisplayText as u };
