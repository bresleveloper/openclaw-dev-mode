import { _a as saveMediaBuffer } from "./model-selection-BRhJAUKb.js";
import { a as loadWebMedia } from "./ir-C3NVthTb.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-BvJQ1aas.js";
//#region src/media/outbound-attachment.ts
async function resolveOutboundAttachmentFromUrl(mediaUrl, maxBytes, options) {
	const media = await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes,
		mediaLocalRoots: options?.localRoots
	}));
	const saved = await saveMediaBuffer(media.buffer, media.contentType ?? void 0, "outbound", maxBytes);
	return {
		path: saved.path,
		contentType: saved.contentType
	};
}
//#endregion
export { resolveOutboundAttachmentFromUrl as t };
