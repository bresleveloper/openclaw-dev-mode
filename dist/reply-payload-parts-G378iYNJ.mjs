import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
//#region src/infra/outbound/reply-payload-parts.ts
/** Prefer multi-attachment payloads, then fall back to the legacy single-media field. */
function resolveOutboundMediaUrls(payload) {
	if (payload.mediaUrls?.some((mediaUrl) => mediaUrl.trim())) return payload.mediaUrls;
	return payload.mediaUrl ? [payload.mediaUrl] : [];
}
/** Count outbound media items after legacy single-media fallback normalization. */
function countOutboundMedia(payload) {
	return resolveOutboundMediaUrls(payload).length;
}
/** Check whether an outbound payload includes any media after normalization. */
function hasOutboundMedia(payload) {
	return countOutboundMedia(payload) > 0;
}
/** Check whether an outbound payload includes text, optionally trimming whitespace first. */
function hasOutboundText(payload, options) {
	const text = options?.trim ? payload.text?.trim() : payload.text;
	return Boolean(text);
}
/** Normalize reply payload text/media into a trimmed, sendable shape for delivery paths. */
function resolveSendableOutboundReplyParts(payload, options) {
	const text = options?.text ?? payload.text ?? "";
	const trimmedText = text.trim();
	const mediaUrls = normalizeStringEntries(resolveOutboundMediaUrls(payload));
	const mediaCount = mediaUrls.length;
	const hasText = Boolean(trimmedText);
	const hasMedia = mediaCount > 0;
	return {
		text,
		trimmedText,
		mediaUrls,
		mediaCount,
		hasText,
		hasMedia,
		hasContent: hasText || hasMedia
	};
}
//#endregion
export { resolveSendableOutboundReplyParts as a, resolveOutboundMediaUrls as i, hasOutboundMedia as n, hasOutboundText as r, countOutboundMedia as t };
