import { T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-DeX5XiDx.mjs";
//#region src/infra/outbound/reply-media-entries.ts
function mediaReferenceKeys(urls) {
	return [...new Set(urls.map(normalizeMediaReferenceForComparison).filter(Boolean))];
}
/** Record an accepted modifier decision without retaining a stale media snapshot. */
function recordReplyPayloadMediaSelectionChange(previousMediaUrls, payload) {
	const previous = mediaReferenceKeys(previousMediaUrls);
	const selected = mediaReferenceKeys(collectReplyMediaEntries(payload).map(({ url }) => url));
	return previous.length === selected.length && previous.every((url, index) => url === selected[index]) ? payload : setReplyPayloadMetadata(payload, { replyMediaSelectionChanged: true });
}
/** Recover media without undoing modifiers or duplicating a current prepared reference. */
function preserveReplyPayloadMediaSelectionCore(source, recovered) {
	const selectionChanged = getReplyPayloadMetadata(source)?.replyMediaSelectionChanged === true;
	const current = collectReplyMediaEntries(source);
	if (!selectionChanged && current.length === 0) return recovered;
	const aliases = /* @__PURE__ */ new Set();
	const seen = /* @__PURE__ */ new Set();
	const entries = [];
	const append = (entry) => {
		const key = normalizeMediaReferenceForComparison(entry.url);
		if (key && !seen.has(key)) {
			seen.add(key);
			entries.push(entry);
		}
	};
	for (const entry of current) {
		append(entry);
		for (const alias of entry.sourceUrls ?? []) aliases.add(normalizeMediaReferenceForComparison(alias));
	}
	if (!selectionChanged) {
		for (const entry of collectReplyMediaEntries(recovered)) if (!aliases.has(normalizeMediaReferenceForComparison(entry.url))) append(entry);
	}
	const mediaUrls = entries.map(({ url }) => url);
	const payload = copyReplyPayloadMetadata(recovered, {
		...recovered,
		mediaUrl: mediaUrls.length === 1 ? mediaUrls[0] : void 0,
		mediaUrls: mediaUrls.length ? mediaUrls : void 0,
		attachments: entries.some(({ attachment }) => attachment !== void 0) ? entries.map(({ attachment }) => attachment ?? {}) : void 0
	});
	return selectionChanged ? setReplyPayloadMetadata(payload, { replyMediaSelectionChanged: true }) : payload;
}
/** Preserve attachment associations before media URLs are filtered or deduplicated. */
function collectReplyMediaEntries(payload, projectedMediaUrls) {
	const sourcesByReference = getReplyPayloadMetadata(payload)?.replyMediaSourceUrls;
	const withSourceUrls = (entry) => {
		const sourceUrls = sourcesByReference?.get(normalizeMediaReferenceForComparison(entry.url));
		return sourceUrls?.length ? {
			...entry,
			sourceUrls: [...sourceUrls]
		} : entry;
	};
	const attachmentByReference = /* @__PURE__ */ new Map();
	const positionalAttachments = [];
	for (const attachment of payload.attachments ?? []) {
		const reference = normalizeMediaReferenceForComparison(attachment.path ?? attachment.url ?? attachment.mediaUrl ?? attachment.filePath ?? "");
		if (reference && !attachmentByReference.has(reference)) attachmentByReference.set(reference, attachment);
		positionalAttachments.push(reference ? void 0 : attachment);
	}
	const mediaUrlCount = payload.mediaUrls?.length ?? 0;
	const mediaEntries = [...(payload.mediaUrls ?? []).map((url, index) => ({
		url,
		attachment: attachmentByReference.get(normalizeMediaReferenceForComparison(url)) ?? positionalAttachments[index]
	})), ...typeof payload.mediaUrl === "string" ? [{
		url: payload.mediaUrl,
		attachment: attachmentByReference.get(normalizeMediaReferenceForComparison(payload.mediaUrl)) ?? positionalAttachments[mediaUrlCount]
	}] : []];
	if (!projectedMediaUrls) return mediaEntries.map(withSourceUrls);
	const attachmentByUrl = new Map(attachmentByReference);
	for (const { url, attachment } of mediaEntries) {
		const key = normalizeMediaReferenceForComparison(url);
		if (key && attachment && !attachmentByUrl.has(key)) attachmentByUrl.set(key, attachment);
	}
	return projectedMediaUrls.map((url) => withSourceUrls({
		url,
		attachment: attachmentByUrl.get(normalizeMediaReferenceForComparison(url))
	}));
}
//#endregion
export { preserveReplyPayloadMediaSelectionCore as n, recordReplyPayloadMediaSelectionChange as r, collectReplyMediaEntries as t };
