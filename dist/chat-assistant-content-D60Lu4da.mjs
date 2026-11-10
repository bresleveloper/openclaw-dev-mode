import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { A as stripReplyMediaFailureFallback, T as readPairingQrReplyChannelData, _ as isReplyPayloadStatusNotice, c as getReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { l as trimTextPreservingCode, n as combineNonStreamingReplyParts } from "./text-projection-mdP9TY8k.mjs";
import { l as stripInlineDirectiveTagsForDelivery } from "./directive-tags-DmdxLrNX.mjs";
import { S as isSuppressedControlReplyText } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-B41MzEkm.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { t as createOutboundPayloadPlan } from "./payloads-CZkv8Yff.mjs";
import { n as renderQrPngDataUrl } from "./qr-image-qJPF43DW.mjs";
import { t as renderQrTerminal } from "./qr-terminal-DidBd5mr.mjs";
import { a as createManagedOutgoingMediaBlocks, c as prepareOutgoingMediaFromReplyPayload, r as buildManagedMediaFailureBlock } from "./managed-image-attachments-BH_BBH6I.mjs";
//#region src/gateway/server-methods/chat-assistant-content.ts
const MANAGED_OUTGOING_MEDIA_PATH_PREFIX = "/api/chat/media/outgoing/";
function isMediaBearingPayload(payload) {
	return payload.isReasoning !== true && Boolean(payload.mediaUrl?.trim() || payload.mediaUrls?.some((url) => url.trim()));
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
	const stripped = stripInlineDirectiveTagsForDelivery(value);
	const visible = trimTextPreservingCode(stripped.text);
	return visible ? options?.preserveBoundaries && !stripped.changed ? value : visible : void 0;
}
function prepareAssistantDisplayText(value, options) {
	if (!value) return;
	return value.trim() ? options?.preserveBoundaries ? value : trimTextPreservingCode(value) : void 0;
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
	const mediaBySource = /* @__PURE__ */ new Map();
	const persistSensitiveDisplay = !payloads.some((payload) => payload.sensitiveMedia === true && (isMediaBearingPayload(payload) || Boolean(readPairingQrReplyChannelData(payload))));
	let strippedTextPayloadCount = 0;
	for (const entry of plan) {
		const payload = entry.payload;
		const metadataSource = payloads[entry.sourceIndex] ?? payload;
		const mediaFailures = getReplyPayloadMetadata(payload)?.assistantMediaFailures ?? [];
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
		const sourceMedia = new Map(collectReplyMediaEntries(payload).map((media) => [media.url.trim(), media.sourceUrls]));
		const mediaBlocks = await createManagedOutgoingMediaBlocks({
			assertCurrent: params.assertCurrent,
			abortSignal: params.abortSignal,
			sessionKey: params.sessionKey,
			...params.agentId ? { agentId: params.agentId } : {},
			items: prepareOutgoingMediaFromReplyPayload(payload, metadataSource),
			localRoots: params.managedMediaLocalRoots,
			continueOnPrepareError: true,
			onPrepared: (item, blocks) => {
				for (const url of [item.url, ...sourceMedia.get(item.url.trim()) ?? []]) mediaBySource.set(normalizeMediaReferenceForComparison(url), blocks);
			},
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
		...mediaBySource.size > 0 ? { mediaBySource } : {},
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
function hasManagedOutgoingMediaBlock(block, includeAttachmentBlockUrls = false) {
	const attachment = block?.type === "attachment" ? asOptionalRecord(block.attachment) : void 0;
	return (block?.type === "image" || block?.type === "audio" || block?.type === "video" || includeAttachmentBlockUrls && Boolean(attachment)) && (isManagedOutgoingMediaUrl(block.url) || isManagedOutgoingMediaUrl(block.openUrl)) || isManagedOutgoingMediaUrl(attachment?.url);
}
function stripManagedOutgoingAssistantContentBlocks(content) {
	const filtered = content?.filter((block) => !hasManagedOutgoingMediaBlock(block, true));
	return filtered?.length ? filtered : void 0;
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
	return Boolean(content?.some((block) => hasManagedOutgoingMediaBlock(block)));
}
//#endregion
export { hasManagedOutgoingAssistantContent as a, prepareAssistantDisplayText as c, hasAssistantDisplayMediaContent as i, sanitizeAssistantDisplayText as l, buildAssistantReplyContentFromInputs as n, hasVisibleAssistantFinalMessage as o, extractAssistantDisplayText as r, isMediaBearingPayload as s, buildAssistantReplyContent as t, stripManagedOutgoingAssistantContentBlocks as u };
