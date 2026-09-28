import { o as mediaKindFromMime } from "./constants-DUxuqQz8.mjs";
import { n as extnameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import path from "node:path";
//#region packages/media-core/src/mime.ts
/** Maximum byte prefix passed to dependency MIME sniffers for bounded memory/CPU work. */
const FILE_TYPE_SNIFF_MAX_BYTES = 1048576;
const EXT_BY_MIME = {
	"image/avif": ".avif",
	"image/heic": ".heic",
	"image/heic-sequence": ".heic",
	"image/heif": ".heif",
	"image/heif-sequence": ".heif",
	"image/bmp": ".bmp",
	"image/jpg": ".jpg",
	"image/jpeg": ".jpg",
	"image/png": ".png",
	"image/svg+xml": ".svg",
	"image/webp": ".webp",
	"image/gif": ".gif",
	"audio/aiff": ".aiff",
	"audio/x-aiff": ".aiff",
	"audio/ogg": ".ogg",
	"audio/mpeg": ".mp3",
	"audio/mp3": ".mp3",
	"audio/wav": ".wav",
	"audio/wave": ".wav",
	"audio/x-wav": ".wav",
	"audio/flac": ".flac",
	"audio/aac": ".aac",
	"audio/amr": ".amr",
	"audio/opus": ".opus",
	"audio/webm": ".webm",
	"audio/x-m4a": ".m4a",
	"audio/m4a": ".m4a",
	"audio/mp4": ".m4a",
	"audio/x-caf": ".caf",
	"video/x-msvideo": ".avi",
	"video/x-m4v": ".m4v",
	"video/mp4": ".mp4",
	"video/x-matroska": ".mkv",
	"video/webm": ".webm",
	"video/x-flv": ".flv",
	"video/x-ms-wmv": ".wmv",
	"video/quicktime": ".mov",
	"application/pdf": ".pdf",
	"application/json": ".json",
	"application/yaml": ".yaml",
	"application/zip": ".zip",
	"application/gzip": ".gz",
	"application/x-tar": ".tar",
	"application/x-7z-compressed": ".7z",
	"application/vnd.rar": ".rar",
	"application/msword": ".doc",
	"application/vnd.ms-excel": ".xls",
	"application/vnd.ms-powerpoint": ".ppt",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
	"text/csv": ".csv",
	"text/plain": ".txt",
	"text/markdown": ".md",
	"text/html": ".html",
	"text/xml": ".xml",
	"text/css": ".css",
	"application/xml": ".xml"
};
function buildMimeByExt() {
	const byExt = {};
	for (const [mime, ext] of Object.entries(EXT_BY_MIME)) byExt[ext] ??= mime;
	return byExt;
}
const MIME_BY_EXT = {
	...buildMimeByExt(),
	".jpg": "image/jpeg",
	".m2a": "audio/mpeg",
	".m4b": "audio/mp4",
	".mp3": "audio/mpeg",
	".oga": "audio/ogg",
	".wav": "audio/wav",
	".webm": "video/webm",
	".aif": "audio/aiff",
	".aifc": "audio/aiff",
	".jpeg": "image/jpeg",
	".cfg": "text/plain",
	".conf": "text/plain",
	".env": "text/plain",
	".ini": "text/plain",
	".js": "text/javascript",
	".log": "text/plain",
	".htm": "text/html",
	".tsv": "text/tab-separated-values",
	".xml": "text/xml",
	".yml": "application/yaml"
};
const AMBIGUOUS_VIDEO_MIME_BY_AUDIO_MIME = {
	"audio/mp4": "video/mp4",
	"audio/x-m4a": "video/mp4",
	"audio/m4a": "video/mp4",
	"audio/webm": "video/webm"
};
const ZIP_CONTAINER_MIMES = /* @__PURE__ */ new Set([
	"application/java-archive",
	"application/vnd.android.package-archive",
	"application/vnd.apple.keynote",
	"application/vnd.apple.numbers",
	"application/vnd.apple.pages",
	"application/vnd.google-earth.kmz",
	"application/vnd.ms-excel.sheet.macroenabled.12",
	"application/vnd.ms-excel.template.macroenabled.12",
	"application/vnd.ms-powerpoint.presentation.macroenabled.12",
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12",
	"application/vnd.ms-powerpoint.template.macroenabled.12",
	"application/vnd.ms-visio.drawing",
	"application/vnd.ms-visio.drawing.macroenabled.12",
	"application/vnd.ms-visio.stencil",
	"application/vnd.ms-visio.stencil.macroenabled.12",
	"application/vnd.ms-visio.template",
	"application/vnd.ms-visio.template.macroenabled.12",
	"application/vnd.ms-word.document.macroenabled.12",
	"application/vnd.ms-word.template.macroenabled.12",
	"application/vnd.oasis.opendocument.graphics",
	"application/vnd.oasis.opendocument.graphics-template",
	"application/vnd.oasis.opendocument.presentation",
	"application/vnd.oasis.opendocument.presentation-template",
	"application/vnd.oasis.opendocument.spreadsheet",
	"application/vnd.oasis.opendocument.spreadsheet-template",
	"application/vnd.oasis.opendocument.text",
	"application/vnd.oasis.opendocument.text-template",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow",
	"application/vnd.openxmlformats-officedocument.presentationml.template",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template",
	"application/x-xpinstall",
	"model/3mf"
]);
function isZipContainerMime(mime) {
	return mime.endsWith("+zip") || ZIP_CONTAINER_MIMES.has(mime);
}
const MIME_SYNONYMS = {
	"image/apng": "image/png",
	"text/yaml": "application/yaml",
	"application/x-yaml": "application/yaml",
	"application/xml": "text/xml",
	"video/vnd.avi": "video/x-msvideo",
	"video/matroska": "video/x-matroska"
};
/** Normalizes MIME strings by dropping parameters, lowercasing, and folding registered synonyms. */
function normalizeMimeType(mime) {
	if (!mime) return;
	const cleaned = mime.split(";")[0]?.trim().toLowerCase();
	if (!cleaned) return;
	return Object.hasOwn(MIME_SYNONYMS, cleaned) ? MIME_SYNONYMS[cleaned] : cleaned;
}
/** Returns the bounded buffer prefix used for dependency MIME sniffing. */
function sliceMimeSniffBuffer(buffer) {
	if (buffer.byteLength <= 1048576) return buffer;
	return buffer.subarray(0, FILE_TYPE_SNIFF_MAX_BYTES);
}
async function sniffMime(buffer) {
	if (!buffer) return;
	try {
		const { fileTypeFromBuffer } = await import("file-type");
		const type = await fileTypeFromBuffer(sliceMimeSniffBuffer(buffer));
		if (type?.mime) return normalizeMimeType(type.mime);
	} catch {}
	return buffer.toString("ascii", 0, 4) === "caff" ? "audio/x-caf" : void 0;
}
/** Extracts a lowercase extension from a local path or HTTP URL pathname. */
function getFileExtension(filePath) {
	if (!filePath) return;
	try {
		if (/^https?:\/\//i.test(filePath)) {
			const url = new URL(filePath);
			let filename = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);
			try {
				const decodable = filename.replace(/%2f/gi, "%252F").replace(/%5c/gi, "%255C");
				filename = decodeURIComponent(decodable);
			} catch {}
			return path.posix.extname(filename).toLowerCase() || void 0;
		}
	} catch {}
	return extnameFromAnyPath(filePath).toLowerCase() || void 0;
}
/** Maps a file path or URL extension to the preferred MIME type when known. */
function mimeTypeFromFilePath(filePath) {
	const ext = getFileExtension(filePath);
	if (!ext) return;
	return MIME_BY_EXT[ext];
}
/** Returns true when a filename extension is a supported audio container. */
function isAudioFileName(fileName) {
	return mediaKindFromMime(mimeTypeFromFilePath(fileName)) === "audio";
}
/** Detects the best MIME type from bytes, file path, and header metadata. */
async function detectMime(opts) {
	const extMime = MIME_BY_EXT[getFileExtension(opts.filePath) ?? ""];
	const mimeHints = [opts.headerMime, ...opts.additionalMimeHints ?? []].map((mime) => normalizeMimeType(mime)).filter((mime) => Boolean(mime));
	const headerMime = mimeHints[0];
	const sniffed = await sniffMime(opts.buffer);
	const sniffedGenericContainer = sniffed === "application/octet-stream" || sniffed === "application/zip";
	const specificExtMime = extMime && extMime !== sniffed && !extMime.startsWith("image/") ? extMime : void 0;
	const genericContainerMime = sniffed === "application/zip" ? [extMime, ...mimeHints].find((mime) => mime && isZipContainerMime(mime)) : sniffed === "application/octet-stream" ? specificExtMime ?? mimeHints.find((mime) => mime !== "application/octet-stream") : void 0;
	const inferred = sniffedGenericContainer ? genericContainerMime ?? sniffed : sniffed ?? extMime;
	const audioContainerHint = inferred && [...mimeHints, extMime].find((mime) => mime && AMBIGUOUS_VIDEO_MIME_BY_AUDIO_MIME[mime] === inferred);
	if (audioContainerHint) return audioContainerHint;
	return inferred ?? headerMime;
}
/** Returns the preferred file extension for a normalized or raw MIME string. */
function extensionForMime(mime) {
	const normalized = normalizeMimeType(mime);
	if (!normalized) return;
	return Object.hasOwn(EXT_BY_MIME, normalized) ? EXT_BY_MIME[normalized] : void 0;
}
/** Returns true when content type or filename identifies GIF media. */
function isGifMedia(opts) {
	if (normalizeMimeType(opts.contentType) === "image/gif") return true;
	return getFileExtension(opts.fileName) === ".gif";
}
/** Maps image format labels from encoders/probes to MIME types. */
function imageMimeFromFormat(format) {
	if (!format) return;
	switch (format.toLowerCase()) {
		case "avif": return "image/avif";
		case "jpg":
		case "jpeg": return "image/jpeg";
		case "heic": return "image/heic";
		case "heif": return "image/heif";
		case "png": return "image/png";
		case "webp": return "image/webp";
		case "gif": return "image/gif";
		default: return;
	}
}
/** Normalizes a MIME string before classifying it into a media family. */
function kindFromMime(mime) {
	return mediaKindFromMime(normalizeMimeType(mime));
}
//#endregion
export { imageMimeFromFormat as a, isZipContainerMime as c, normalizeMimeType as d, sliceMimeSniffBuffer as f, getFileExtension as i, kindFromMime as l, detectMime as n, isAudioFileName as o, extensionForMime as r, isGifMedia as s, FILE_TYPE_SNIFF_MAX_BYTES as t, mimeTypeFromFilePath as u };
