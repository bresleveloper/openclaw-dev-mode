import { c as isZipContainerMime, d as normalizeMimeType, n as detectMime, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
//#region packages/media-core/src/attachment-classify.ts
const TEXT_APPLICATION_MIME = /^application\/(?:json|javascript|xml|yaml|x-yaml)$/;
const DOCUMENT_MIME = /^application\/(?:pdf|msword|x-cfb|vnd\.(?:apple\.(?:keynote|numbers|pages)|ms-.+|oasis\.opendocument\..+|openxmlformats-officedocument\..+))$/;
const ARCHIVE_MIME = /^application\/(?:gzip|vnd\.rar|x-7z-compressed|x-gzip|x-rar-compressed|x-tar|x-zip-compressed|zip)$/;
const WORDISH_CHAR = /[\p{L}\p{N}]/u;
function attachmentClassFromMime(mime) {
	const normalized = normalizeMimeType(mime);
	if (!normalized) return "binary";
	if (normalized.startsWith("text/") || TEXT_APPLICATION_MIME.test(normalized) || normalized.endsWith("+json") || normalized.endsWith("+xml")) return "text";
	if (normalized.startsWith("image/")) return "image";
	if (normalized.startsWith("audio/")) return "audio";
	if (normalized.startsWith("video/")) return "video";
	if (DOCUMENT_MIME.test(normalized)) return "document";
	return ARCHIVE_MIME.test(normalized) || isZipContainerMime(normalized) ? "archive" : "binary";
}
function resolveUtf16Charset(buffer) {
	if (buffer.length < 2) return;
	const bom = buffer.readUInt16LE(0);
	if (bom === 65279) return "utf-16le";
	if (bom === 65534) return "utf-16be";
	const sampleLength = Math.min(buffer.length, 2048);
	let zeroEven = 0;
	let zeroOdd = 0;
	for (let index = 0; index < sampleLength; index += 1) if (buffer[index] === 0) {
		if (index % 2 === 0) zeroEven += 1;
		else zeroOdd += 1;
	}
	if ((zeroEven + zeroOdd) / sampleLength <= .2) return;
	return zeroOdd >= zeroEven ? "utf-16le" : "utf-16be";
}
function textRatios(text, includeWordish) {
	let printable = 0;
	let wordish = 0;
	let total = 0;
	for (const char of text) {
		const code = char.codePointAt(0) ?? 0;
		const whitespace = code === 9 || code === 10 || code === 13 || code === 32;
		const isControl = !whitespace && (code < 32 || code >= 127 && code <= 159);
		total += 1;
		printable += Number(!isControl);
		wordish += Number(whitespace || !isControl && includeWordish && WORDISH_CHAR.test(char));
	}
	return total === 0 ? [0, 0] : [printable / total, wordish / total];
}
function sniffTextCharset(buffer) {
	const sample = buffer.subarray(0, 4096);
	const tail = sample.subarray(-4);
	const leadIndex = tail.findLastIndex((byte) => (byte & 192) !== 128);
	const lead = tail[leadIndex] ?? 0;
	const width = lead >= 240 ? 4 : lead >= 224 ? 3 : lead >= 194 ? 2 : 1;
	const end = sample.length + Math.max(0, leadIndex + width - tail.length);
	try {
		return textRatios(new TextDecoder("utf-8", { fatal: true }).decode(buffer.subarray(0, end)), false)[0] > .85 ? "utf-8" : void 0;
	} catch {
		const [printable, wordish] = textRatios(new TextDecoder("windows-1252").decode(sample), true);
		return printable > .95 && wordish > .3 ? "windows-1252" : void 0;
	}
}
async function classifyAttachmentBytes(params) {
	const mime = await detectMime({
		buffer: params.buffer,
		headerMime: params.declaredMime,
		additionalMimeHints: params.additionalMimeHints,
		filePath: params.name ?? void 0
	});
	const detectedClass = attachmentClassFromMime(mime);
	const hasUtf16Bom = params.buffer.length >= 2 && (params.buffer.readUInt16LE(0) === 65279 || params.buffer.readUInt16LE(0) === 65534);
	if (mime === "application/octet-stream" || mime?.startsWith("application/vnd.") || detectedClass !== "binary" && !hasUtf16Bom) {
		const charset = detectedClass === "text" ? resolveUtf16Charset(params.buffer) : void 0;
		return charset ? {
			mime,
			class: detectedClass,
			charset
		} : {
			mime,
			class: detectedClass
		};
	}
	const signature = params.buffer.length >= 4 ? params.buffer.readUInt32BE(0) : 0;
	if (signature === 1347093252 || signature === 1347092738 || signature === 1347093766) return {
		mime,
		class: "archive"
	};
	const charset = resolveUtf16Charset(params.buffer) ?? sniffTextCharset(params.buffer);
	if (!charset) return {
		mime,
		class: "binary"
	};
	const extensionMime = mimeTypeFromFilePath(params.name);
	const firstLine = new TextDecoder(charset).decode(params.buffer.subarray(0, Math.min(params.buffer.length, 8192))).split(/\r?\n/, 1)[0];
	return {
		mime: (attachmentClassFromMime(extensionMime) === "text" ? extensionMime : void 0) ?? (firstLine?.includes(",") ? "text/csv" : firstLine?.includes("	") ? "text/tab-separated-values" : "text/plain"),
		class: "text",
		...charset !== "utf-8" ? { charset } : {}
	};
}
//#endregion
export { classifyAttachmentBytes as n, attachmentClassFromMime as t };
