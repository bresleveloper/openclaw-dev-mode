import { f as saveMediaBuffer } from "./store-CqRcb7T5.mjs";
import { t as buildOutboundMediaLoadOptions } from "./load-options-gEuoEu4c.mjs";
import { rm } from "node:fs/promises";
//#region src/media/outbound-attachment.ts
/** Loads a remote/local media URL and stages it into the outbound media store. */
async function resolveOutboundAttachmentFromUrl(mediaUrl, maxBytes, options) {
	const { loadWebMedia, markTrustedGeneratedHtmlPath } = await import("./web-media-DukAiZvY.mjs");
	const media = await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes,
		mediaAccess: options?.mediaAccess,
		mediaLocalRoots: options?.localRoots,
		mediaReadFile: options?.readFile
	}));
	const saved = await saveMediaBuffer(media.buffer, media.contentType ?? void 0, "outbound", maxBytes, media.fileName);
	if (media.trustedGeneratedHtmlSource) try {
		await markTrustedGeneratedHtmlPath(saved.path, media.buffer);
	} catch (error) {
		await rm(saved.path, { force: true }).catch(() => {});
		throw error;
	}
	return {
		path: saved.path,
		contentType: saved.contentType
	};
}
/** Stages an in-memory attachment buffer into the outbound media store. */
async function resolveOutboundAttachmentFromBuffer(buffer, maxBytes, options) {
	const saved = await saveMediaBuffer(buffer, options?.contentType, "outbound", maxBytes, options?.filename);
	return {
		path: saved.path,
		contentType: saved.contentType
	};
}
//#endregion
export { resolveOutboundAttachmentFromUrl as n, resolveOutboundAttachmentFromBuffer as t };
