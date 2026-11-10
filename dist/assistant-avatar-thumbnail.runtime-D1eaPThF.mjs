import { a as isAvatarImageMimeType, o as isRenderableAvatarImageDataUrl } from "./avatar-limits-2506OuP3.mjs";
import { c as resolveAvatarMime } from "./avatar-policy-DiIdI6oM.mjs";
import { d as normalizeMimeType } from "./mime-C3j3dfQb.mjs";
import { c as isAnimatedWebpBuffer, h as createImageProcessor } from "./image-ops-DM5GUpDi.mjs";
import { i as createHttpImageRepresentation } from "./http-image-response-W_WEsC5b.mjs";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/assistant-avatar-thumbnail.runtime.ts
const AVATAR_THUMBNAIL_SIDE = 128;
const thumbnails = /* @__PURE__ */ new WeakMap();
async function createAvatarThumbnail(source) {
	let body;
	let contentType;
	if ("file" in source) {
		if (!source.file.body) throw new Error("Avatar bytes were not prepared");
		body = source.file.body;
		contentType = resolveAvatarMime(source.file.path);
	} else {
		if (!isRenderableAvatarImageDataUrl(source.dataUrl)) throw new Error("Unsupported avatar data URL");
		const response = await fetch(source.dataUrl);
		contentType = response.headers.get("content-type") ?? "";
		body = Buffer.from(await response.arrayBuffer());
		if (body.length > 2097152) throw new Error("Avatar data URL exceeds size limit");
	}
	const mime = normalizeMimeType(contentType);
	if (!mime || !isAvatarImageMimeType(mime)) throw new Error("Unsupported avatar image type");
	if ([
		"image/png",
		"image/jpeg",
		"image/webp"
	].includes(mime)) {
		if ((await fileTypeFromBuffer(body))?.mime === "image/apng" || isAnimatedWebpBuffer(body)) return createHttpImageRepresentation(body, contentType);
		body = (await createImageProcessor().encode(body, {
			format: "png",
			resize: {
				maxSide: AVATAR_THUMBNAIL_SIDE,
				enlarge: false
			}
		})).data;
		contentType = "image/png";
	}
	return createHttpImageRepresentation(body, contentType);
}
async function readGatewayAvatarThumbnail(source) {
	let pending = thumbnails.get(source);
	if (!pending) {
		pending = createAvatarThumbnail(source).catch((error) => {
			thumbnails.delete(source);
			throw error;
		});
		thumbnails.set(source, pending);
	}
	return pending;
}
//#endregion
export { readGatewayAvatarThumbnail };
