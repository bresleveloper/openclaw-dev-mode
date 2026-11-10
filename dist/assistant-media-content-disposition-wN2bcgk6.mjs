import { t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { l as kindFromMime } from "./mime-C3j3dfQb.mjs";
import { toUSVString } from "node:util";
//#region src/gateway/assistant-media-content-disposition.ts
function resolveAssistantMediaFilename(fallback, filenameHint) {
	return basenameFromAnyPath(filenameHint ?? "") || fallback;
}
function buildAssistantMediaContentDisposition(filename, mime) {
	const sanitizedInput = truncateFilenamePreservingExtension(toUSVString(filename.replace(/[\r\n]/g, "_")));
	const fallback = sanitizedInput.replace(/[^\x20-\x7e]|[%"\\]/g, "_").trim() || "download";
	const extended = encodeURIComponent(sanitizedInput).replace(/[\x27()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
	const kind = kindFromMime(mime);
	return `${kind === "image" || kind === "audio" || kind === "video" ? "inline" : "attachment"}; filename="${fallback}"; filename*=UTF-8''${extended}`;
}
function buildManagedMediaContentDisposition(value, contentType) {
	const fallback = contentType.startsWith("image/") ? "generated-image" : "generated-media";
	return buildAssistantMediaContentDisposition(value?.trim() || fallback, contentType);
}
function truncateFilenamePreservingExtension(value) {
	const maxCodePoints = 200;
	const chars = Array.from(value);
	if (chars.length <= maxCodePoints) return value;
	const lastDot = chars.lastIndexOf(".");
	const extension = lastDot > 0 && lastDot < chars.length - 1 && chars.length - lastDot <= 32 ? chars.slice(lastDot) : [];
	if (extension.length === 0) return chars.slice(0, maxCodePoints).join("");
	return `${chars.slice(0, maxCodePoints - extension.length).join("")}${extension.join("")}`;
}
//#endregion
export { buildManagedMediaContentDisposition as n, resolveAssistantMediaFilename as r, buildAssistantMediaContentDisposition as t };
