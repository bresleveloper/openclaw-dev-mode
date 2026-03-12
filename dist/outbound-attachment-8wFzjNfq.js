import { Ai as saveMediaBuffer } from "./model-selection-JGO58U_j.js";
import { a as loadWebMedia } from "./ir-BWMK5Aho.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-DzwsFA2D.js";
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
