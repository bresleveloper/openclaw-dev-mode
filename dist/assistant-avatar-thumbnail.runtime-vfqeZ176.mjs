import { s as readFileDescriptorBounded } from "./boundary-file-read-D-Aa04On.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { a as isAvatarImageMimeType, o as isRenderableAvatarImageDataUrl, t as AVATAR_MAX_BYTES } from "./avatar-limits-2506OuP3.mjs";
import { c as resolveAvatarMime } from "./avatar-policy-I2uW2Cs8.mjs";
import { d as normalizeMimeType } from "./mime-1zBUMwu6.mjs";
import { p as createImageProcessor, s as isAnimatedWebpBuffer } from "./image-ops-CU4vxSlO.mjs";
import { n as gatewayAvatarImageRevision } from "./assistant-avatar-cache-bW5LAJaD.mjs";
import { i as createHttpImageRepresentation } from "./http-image-response-DQqwbtvS.mjs";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/assistant-avatar-thumbnail.runtime.ts
const AVATAR_THUMBNAIL_SIDE = 128;
const thumbnailCache = /* @__PURE__ */ new Map();
async function createAvatarThumbnail(source) {
	let body;
	let contentType;
	if ("file" in source) {
		body = await readFileDescriptorBounded(source.file.fd, AVATAR_MAX_BYTES);
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
/** Caller retains descriptor ownership until this shared read has settled. */
async function readGatewayAvatarThumbnail(source) {
	const revision = gatewayAvatarImageRevision(source);
	const pending = thumbnailCache.get(revision) ?? createAvatarThumbnail(source);
	thumbnailCache.delete(revision);
	thumbnailCache.set(revision, pending);
	pruneMapToMaxSize(thumbnailCache, 4);
	try {
		return await pending;
	} catch (error) {
		if (thumbnailCache.get(revision) === pending) thumbnailCache.delete(revision);
		throw error;
	}
}
//#endregion
export { readGatewayAvatarThumbnail };
