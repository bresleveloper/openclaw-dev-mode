import { ji as saveMediaBuffer } from "./model-selection-BpzcW6do.js";
import { a as loadWebMedia } from "./ir-DfvJx2qw.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-C-AlrR3n.js";
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
