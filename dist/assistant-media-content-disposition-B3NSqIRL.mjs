import { t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { l as kindFromMime } from "./mime-CGDYrRzL.mjs";
//#region src/gateway/assistant-media-content-disposition.ts
function resolveAssistantMediaFilename(fallback, filenameHint) {
	return basenameFromAnyPath(filenameHint ?? "") || fallback;
}
function buildAssistantMediaContentDisposition(filename, mime) {
	const sanitizedInput = truncateFilenamePreservingExtension(toWellFormedFilename(filename.replace(/[\r\n]/g, "_")), 200);
	const fallback = sanitizedInput.replace(/[^\x20-\x7e]|[%"\\]/g, "_").trim() || "download";
	const extended = encodeURIComponent(sanitizedInput).replace(/[\x27()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
	const kind = kindFromMime(mime);
	return `${kind === "image" || kind === "audio" || kind === "video" ? "inline" : "attachment"}; filename="${fallback}"; filename*=UTF-8''${extended}`;
}
function buildManagedMediaContentDisposition(value, contentType) {
	const fallback = contentType.startsWith("image/") ? "generated-image" : "generated-media";
	return buildAssistantMediaContentDisposition(value?.trim() || fallback, contentType);
}
function toWellFormedFilename(value) {
	let result = "";
	for (const char of value) {
		const code = char.charCodeAt(0);
		result += char.length === 1 && code >= 55296 && code <= 57343 ? "�" : char;
	}
	return result;
}
function truncateFilenamePreservingExtension(value, maxCodePoints) {
	const chars = Array.from(value);
	if (chars.length <= maxCodePoints) return value;
	const extension = shortFilenameExtension(chars);
	if (extension.length === 0 || extension.length >= maxCodePoints - 1) return chars.slice(0, maxCodePoints).join("");
	return `${chars.slice(0, maxCodePoints - extension.length).join("")}${extension.join("")}`;
}
function shortFilenameExtension(chars) {
	const lastDot = chars.lastIndexOf(".");
	if (lastDot <= 0 || lastDot === chars.length - 1) return [];
	const extension = chars.slice(lastDot);
	return extension.length <= 32 ? extension : [];
}
//#endregion
export { buildManagedMediaContentDisposition as n, resolveAssistantMediaFilename as r, buildAssistantMediaContentDisposition as t };
