import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as copyReplyPayloadMetadata, m as setReplyPayloadMetadata } from "./reply-payload-HLWc9ssO.js";
import { t as parseInlineDirectives } from "./directive-tags-B64FytPi.js";
import { a as hasReplyPayloadContent } from "./payload-BCsfdv86.js";
import { i as resolveImplicitCurrentMessageReplyAllowance, n as createReplyToModeFilterForChannel } from "./reply-threading-J9AZHHNY.js";
import "./reply-payloads-dedupe-DmZd8WwZ.js";
//#region src/auto-reply/reply/reply-tags.ts
/** Extracts inline reply-target tags from outbound reply text. */
function extractReplyToTag(text, currentMessageId) {
	const result = parseInlineDirectives(text, {
		currentMessageId,
		stripAudioTag: false
	});
	return {
		cleaned: result.text,
		replyToId: result.replyToId,
		replyToCurrent: result.replyToCurrent,
		hasTag: result.hasReplyTag
	};
}
//#endregion
//#region src/auto-reply/reply/reply-payloads-base.ts
/** Adds the BTW question banner for channels that only accept plain text bodies. */
function formatBtwTextForExternalDelivery(payload) {
	const text = normalizeOptionalString(payload.text);
	if (!text) return payload.text;
	const question = normalizeOptionalString(payload.btw?.question);
	if (!question) return payload.text;
	const formatted = `BTW\nQuestion: ${question}\n\n${text}`;
	return text === formatted || text.startsWith("BTW\nQuestion:") ? text : formatted;
}
function resolveReplyThreadingForPayload(params) {
	const payload = normalizeOptionalString(params.payload.replyToId) ? setReplyPayloadMetadata(copyReplyPayloadMetadata(params.payload, { ...params.payload }), { replyToIdExplicit: true }) : params.payload;
	const implicitReplyToId = normalizeOptionalString(params.implicitReplyToId);
	const currentMessageId = normalizeOptionalString(params.currentMessageId);
	const allowImplicitReplyToCurrentMessage = resolveImplicitCurrentMessageReplyAllowance(params.replyToMode, params.replyThreading);
	let resolved = payload.replyToId || payload.replyToCurrent === false || !implicitReplyToId || !allowImplicitReplyToCurrentMessage ? payload : copyReplyPayloadMetadata(payload, {
		...payload,
		replyToId: implicitReplyToId
	});
	if (typeof resolved.text === "string" && resolved.text.includes("[[")) {
		const { cleaned, replyToId, replyToCurrent, hasTag } = extractReplyToTag(resolved.text, currentMessageId);
		resolved = copyReplyPayloadMetadata(resolved, {
			...resolved,
			text: cleaned ? cleaned : void 0,
			replyToId: replyToId ?? resolved.replyToId,
			replyToTag: hasTag || resolved.replyToTag,
			replyToCurrent: replyToCurrent || resolved.replyToCurrent
		});
	}
	if (resolved.replyToCurrent && !resolved.replyToId && currentMessageId) resolved = copyReplyPayloadMetadata(resolved, {
		...resolved,
		replyToId: currentMessageId
	});
	return resolved;
}
/** Applies inline reply tags to a single payload. */
function applyReplyTagsToPayload(payload, currentMessageId) {
	return resolveReplyThreadingForPayload({
		payload,
		currentMessageId
	});
}
/** True when a payload has visible or playable content for delivery. */
function isRenderablePayload(payload) {
	return hasReplyPayloadContent(payload, { extraContent: payload.audioAsVoice });
}
/** True when a payload should stay internal as reasoning-only output. */
function shouldSuppressReasoningPayload(payload) {
	return payload.isReasoning === true;
}
/** Applies threading policy and filters empty payloads before channel delivery. */
function applyReplyThreading(params) {
	const { payloads, replyToMode, replyToChannel, currentMessageId, replyThreading } = params;
	const applyReplyToMode = createReplyToModeFilterForChannel(replyToMode, replyToChannel);
	const implicitReplyToId = normalizeOptionalString(currentMessageId);
	return payloads.map((payload) => resolveReplyThreadingForPayload({
		payload,
		replyToMode,
		implicitReplyToId,
		currentMessageId,
		replyThreading
	})).filter(isRenderablePayload).map(applyReplyToMode);
}
//#endregion
export { shouldSuppressReasoningPayload as a, isRenderablePayload as i, applyReplyThreading as n, formatBtwTextForExternalDelivery as r, applyReplyTagsToPayload as t };
