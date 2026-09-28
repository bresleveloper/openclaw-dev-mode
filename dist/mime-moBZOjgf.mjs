import { u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import "./media-mime-D8SxWw0k.mjs";
//#region extensions/file-transfer/src/shared/mime.ts
const IMAGE_MIME_INLINE_SET = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif"
]);
const TEXT_INLINE_MAX_BYTES = 8192;
function mimeFromExtension(filePath) {
	return mimeTypeFromFilePath(filePath) ?? "application/octet-stream";
}
//#endregion
export { TEXT_INLINE_MAX_BYTES as n, mimeFromExtension as r, IMAGE_MIME_INLINE_SET as t };
