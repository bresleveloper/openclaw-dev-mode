import { u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { o as hasReplyPayloadContent } from "./payload-COvcWceu.mjs";
//#region src/auto-reply/reply-payload.ts
/** Adds the BTW question banner for channels that only accept plain text bodies. */
function formatBtwTextForExternalDelivery(payload) {
	const text = normalizeOptionalString(payload.text);
	if (!text) return payload.text;
	const question = normalizeOptionalString(payload.btw?.question);
	if (!question) return payload.text;
	const formatted = `BTW\nQuestion: ${question}\n\n${text}`;
	return text === formatted || text.startsWith("BTW\nQuestion:") ? text : formatted;
}
/** True when a payload has visible or playable content for delivery. */
function isRenderablePayload(payload) {
	return hasReplyPayloadContent(payload, { extraContent: payload.audioAsVoice || payload.location != null || hasReplyPayloadSpeechContent(payload) });
}
/** True when a payload should stay internal as reasoning-only output. */
function shouldSuppressReasoningPayload(payload) {
	return payload.isReasoning === true;
}
function readAskUserQuestionId(payload) {
	const askUser = payload.channelData?.askUser;
	if (!askUser || typeof askUser !== "object" || Array.isArray(askUser)) return;
	const questionId = askUser.questionId;
	return typeof questionId === "string" && questionId ? questionId : void 0;
}
const PAIRING_QR_REPLY_CHANNEL_DATA_KEY = "openclawPairingQr";
function readPairingQrReplyChannelData(payload) {
	const raw = payload.channelData?.[PAIRING_QR_REPLY_CHANNEL_DATA_KEY];
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
	const record = raw;
	const setupCode = readNonBlankString(record.setupCode);
	const expiresAtMs = asPositiveFiniteNumber(record.expiresAtMs);
	return setupCode && expiresAtMs ? {
		setupCode,
		expiresAtMs
	} : void 0;
}
/** Metadata for fast-auto progress notices. */
const FAST_MODE_AUTO_PROGRESS_KIND = "fast-mode-auto";
function isFastModeAutoProgressPayload(payload) {
	return payload.channelData?.openclawProgressKind === FAST_MODE_AUTO_PROGRESS_KIND;
}
const REPLY_MEDIA_FAILURE_MESSAGES = {
	"file-not-found": "File not found. Check the path and try again.",
	"unsupported-format": "Rejected by the local attachment allowlist. Send a supported file type.",
	"delivery-failed": "Delivery failed. Try sending this file again."
};
function formatReplyMediaFailures(failures) {
	return failures.map((failure) => `⚠️ ${failure.label}: ${REPLY_MEDIA_FAILURE_MESSAGES[failure.code]}`).join("\n");
}
/** Appends one named, actionable fallback receipt per failed attachment. */
function appendReplyMediaFailures(text, failures) {
	if (failures.length === 0) return text;
	const receipt = formatReplyMediaFailures(failures);
	return text?.trim() ? `${text}\n${receipt}` : receipt;
}
/** Removes producer-authored fallback receipts when structured display cards supersede them. */
function stripReplyMediaFailureFallback(text, failures) {
	if (!text || failures.length === 0) return text;
	const receipt = formatReplyMediaFailures(failures);
	if (text === receipt) return;
	const suffix = `\n${receipt}`;
	return text.endsWith(suffix) ? text.slice(0, -suffix.length) : text;
}
function hasReplyPayloadMedia(payload) {
	return Boolean(readNonBlankString(payload.mediaUrl) || Array.isArray(payload.mediaUrls) && payload.mediaUrls.some(readNonBlankString));
}
/** Returns normalized TTS supplement metadata only when the payload has media to carry it. */
function getReplyPayloadTtsSupplement(payload) {
	const spokenText = readNonBlankString(payload.ttsSupplement?.spokenText);
	if (!spokenText || !hasReplyPayloadMedia(payload)) return;
	return {
		spokenText,
		...payload.ttsSupplement?.visibleTextAlreadyDelivered === true ? { visibleTextAlreadyDelivered: true } : {}
	};
}
/** Returns true when the payload is a valid TTS supplement media payload. */
function isReplyPayloadTtsSupplement(payload) {
	return Boolean(getReplyPayloadTtsSupplement(payload));
}
/** Marks a reply payload as supplemental TTS media while preserving the original shape. */
function markReplyPayloadAsTtsSupplement(payload, spokenText = payload.spokenText ?? payload.text ?? "", options) {
	const normalizedSpokenText = readNonBlankString(spokenText);
	if (!normalizedSpokenText) return payload;
	return {
		...payload,
		spokenText: normalizedSpokenText,
		ttsSupplement: {
			spokenText: normalizedSpokenText,
			...options?.visibleTextAlreadyDelivered === true ? { visibleTextAlreadyDelivered: true } : {}
		}
	};
}
/** Removes visible-only fields from a payload that should be delivered as TTS supplement media. */
function buildTtsSupplementMediaPayload(payload) {
	const supplement = getReplyPayloadTtsSupplement(payload);
	if (!supplement) return payload;
	const { text: _text, presentation: _presentation, interactive: _interactive, btw: _btw, ...mediaPayload } = payload;
	return copyReplyPayloadMetadata(payload, {
		...mediaPayload,
		spokenText: supplement.spokenText,
		ttsSupplement: supplement
	});
}
const replyPayloadMetadata = resolveGlobalSingleton(Symbol.for("openclaw.replyPayloadMetadata"), () => /* @__PURE__ */ new WeakMap());
/** Adds internal metadata to a reply payload object. */
function setReplyPayloadMetadata(payload, metadata) {
	const previous = replyPayloadMetadata.get(payload);
	replyPayloadMetadata.set(payload, {
		...previous,
		...metadata
	});
	return payload;
}
/** Reads internal metadata attached to a reply payload object. */
function getReplyPayloadMetadata(payload) {
	return replyPayloadMetadata.get(payload);
}
/** Reads a complete, internally consistent source occurrence from reply metadata. */
function readReplyPayloadSourceOccurrence(payload) {
	const metadata = getReplyPayloadMetadata(payload);
	const assistantMessageIndex = metadata?.assistantMessageIndex;
	const sourceText = metadata?.blockSourceText;
	const sourceRange = metadata?.blockSourceRange;
	if (typeof assistantMessageIndex !== "number" || !Number.isSafeInteger(assistantMessageIndex) || assistantMessageIndex < 0 || typeof sourceText !== "string" || !Array.isArray(sourceRange) || sourceRange.length !== 2) return;
	const [start, end] = sourceRange;
	if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start || end - start !== sourceText.length) return;
	return {
		assistantMessageIndex,
		sourceText,
		sourceRange: [start, end]
	};
}
/** Explicit speech remains content while the payload waits for TTS admission. */
function hasReplyPayloadSpeechContent(payload) {
	return Boolean(readNonBlankString(getReplyPayloadMetadata(payload)?.tts?.text));
}
function isReplyPayloadTargetSuppressed(payload) {
	return getReplyPayloadMetadata(payload)?.replyTargetSuppressed === true;
}
/** Keep derived reply fields consistent with the host's recorded target decision. */
function applyReplyPayloadTargetPolicy(payload) {
	if (!isReplyPayloadTargetSuppressed(payload)) return payload;
	return copyReplyPayloadMetadata(payload, {
		...payload,
		replyToId: void 0,
		replyToCurrent: false,
		replyToTag: false
	});
}
/** Revalidates an authority-bearing payload against a freshly loaded session row. */
function isReplyPayloadSessionWriterDeliveryAuthorized(payload, entry) {
	const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
	if (!authority) return true;
	return Boolean(entry && entry.sessionId === authority.expectedSessionId && (authority.expectedLifecycleRevision === void 0 || entry.lifecycleRevision === authority.expectedLifecycleRevision) && (authority.expectedWriterRunId === void 0 || entry.activeWriterRunId === authority.expectedWriterRunId));
}
/** Returns true when a payload is the synthesized warning for a non-terminal tool error. */
function isReplyPayloadNonTerminalToolErrorWarning(payload) {
	return getReplyPayloadMetadata(payload)?.nonTerminalToolErrorWarning === true;
}
/** Copies internal payload metadata when cloning or transforming payload objects. */
function copyReplyPayloadMetadata(source, payload) {
	const metadata = getReplyPayloadMetadata(source);
	return metadata ? setReplyPayloadMetadata(payload, metadata) : payload;
}
/** Marks a host-owned payload as deliverable even when normal source replies are suppressed. */
function markReplyPayloadForSourceSuppressionDelivery(payload) {
	return setReplyPayloadMetadata(payload, { deliverDespiteSourceReplySuppression: true });
}
function markCommandReplyForDelivery(reply) {
	const markPayload = (payload) => setReplyPayloadMetadata(markReplyPayloadForSourceSuppressionDelivery(payload), { commandReply: true });
	if (!reply) return reply;
	if (Array.isArray(reply)) return reply.map(markPayload);
	return markPayload(reply);
}
/** Returns true only when a command owner produced every payload in a non-empty reply. */
function isCommandReplyForDelivery(reply) {
	const payloads = Array.isArray(reply) ? reply : reply ? [reply] : [];
	return payloads.length > 0 && payloads.every((payload) => getReplyPayloadMetadata(payload)?.commandReply === true);
}
/** Returns true for internal status/notice payloads, not assistant answer content. */
function isReplyPayloadStatusNotice(payload) {
	return Boolean(payload.isCompactionNotice || payload.isFallbackNotice || payload.isStatusNotice);
}
/** Classifies terminal vs. supplemental reply lanes, not content, sendability, or authority. */
const isReplyPayloadTerminalContent = (payload) => {
	const supplement = getReplyPayloadTtsSupplement(payload);
	return payload.isReasoning !== true && payload.isCommentary !== true && (!isReplyPayloadStatusNotice(payload) || getReplyPayloadMetadata(payload)?.commandReply === true) && (!supplement || supplement.visibleTextAlreadyDelivered !== true && Boolean(readNonBlankString(payload.text)));
};
//#endregion
export { readPairingQrReplyChannelData as C, stripReplyMediaFailureFallback as D, shouldSuppressReasoningPayload as E, readAskUserQuestionId as S, setReplyPayloadMetadata as T, isReplyPayloadTerminalContent as _, copyReplyPayloadMetadata as a, markReplyPayloadAsTtsSupplement as b, getReplyPayloadTtsSupplement as c, isFastModeAutoProgressPayload as d, isRenderablePayload as f, isReplyPayloadTargetSuppressed as g, isReplyPayloadStatusNotice as h, buildTtsSupplementMediaPayload as i, hasReplyPayloadSpeechContent as l, isReplyPayloadSessionWriterDeliveryAuthorized as m, appendReplyMediaFailures as n, formatBtwTextForExternalDelivery as o, isReplyPayloadNonTerminalToolErrorWarning as p, applyReplyPayloadTargetPolicy as r, getReplyPayloadMetadata as s, FAST_MODE_AUTO_PROGRESS_KIND as t, isCommandReplyForDelivery as u, isReplyPayloadTtsSupplement as v, readReplyPayloadSourceOccurrence as w, markReplyPayloadForSourceSuppressionDelivery as x, markCommandReplyForDelivery as y };
