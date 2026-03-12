import { $n as saveMediaBuffer } from "./model-auth-RrhBttaV.js";
import { _ as loadWebMedia } from "./ir-DGWx-OAQ.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-D6JP2MBC.js";
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
