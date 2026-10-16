import { n as indexFirstByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { E as setReplyPayloadMetadata, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
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
	const aliases = new Set(current.flatMap((entry) => entry.sourceUrls ?? []).map(normalizeMediaReferenceForComparison));
	const byReference = indexFirstByKey(selectionChanged ? current : [...current, ...collectReplyMediaEntries(recovered).filter(({ url }) => !aliases.has(normalizeMediaReferenceForComparison(url)))], ({ url }) => normalizeMediaReferenceForComparison(url));
	byReference.delete("");
	const entries = [...byReference.values()];
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
	const mediaEntries = [...payload.mediaUrls ?? [], ...typeof payload.mediaUrl === "string" ? [payload.mediaUrl] : []].map((url, index) => ({
		url,
		attachment: attachmentByReference.get(normalizeMediaReferenceForComparison(url)) ?? positionalAttachments[index]
	}));
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
