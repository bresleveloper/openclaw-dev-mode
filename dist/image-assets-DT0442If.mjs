import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import { t as canonicalizeBase64 } from "./base64-CU53EX1R.mjs";
//#region src/image-generation/image-assets.ts
/** Converts image provider base64/data-url payloads into generated or source image assets. */
const DEFAULT_IMAGE_MIME_TYPE = "image/png";
const DEFAULT_IMAGE_FILE_PREFIX = "image";
const INLINE_IMAGE_JSON_RESPONSE_ENVELOPE_BYTES = 1048576;
function resolveInlineImageJsonResponseMaxBytes(maxImages, maxImageBytes) {
	const imageCount = Number.isFinite(maxImages) ? Math.max(1, Math.trunc(maxImages)) : 1;
	return Math.ceil((Number.isFinite(maxImageBytes) && maxImageBytes > 0 ? Math.max(1, Math.trunc(maxImageBytes)) : MAX_IMAGE_BYTES) * imageCount * 4 / 3) + INLINE_IMAGE_JSON_RESPONSE_ENVELOPE_BYTES;
}
function throwMalformedImageResponse(message) {
	if (message) throw new Error(message);
}
/** Maps an image MIME type to a stable filename extension. */
function imageFileExtensionForMimeType(mimeType, fallback = "png") {
	const normalized = normalizeOptionalLowercaseString(mimeType)?.split(";")[0]?.trim();
	if (!normalized) return fallback;
	if (normalized.includes("jpeg") || normalized.includes("jpg")) return "jpg";
	if (normalized.includes("svg")) return "svg";
	const slashIndex = normalized.indexOf("/");
	return slashIndex >= 0 ? normalized.slice(slashIndex + 1) || fallback : fallback;
}
function sniffImageMimeType(buffer, fallbackMimeType = DEFAULT_IMAGE_MIME_TYPE) {
	if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return {
		mimeType: "image/jpeg",
		extension: "jpg"
	};
	if (buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) return {
		mimeType: "image/png",
		extension: "png"
	};
	if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return {
		mimeType: "image/webp",
		extension: "webp"
	};
	return {
		mimeType: fallbackMimeType,
		extension: imageFileExtensionForMimeType(fallbackMimeType)
	};
}
function toImageDataUrl(params) {
	return `data:${normalizeOptionalString(params.mimeType) ?? normalizeOptionalString(params.defaultMimeType) ?? DEFAULT_IMAGE_MIME_TYPE};base64,${params.buffer.toString("base64")}`;
}
function parseImageDataUrl(dataUrl) {
	const match = dataUrl.match(/^data:(image\/[^;,]+)(?:;[^,]*)?;base64,(.+)$/is);
	if (!match) return;
	const mimeType = normalizeOptionalString(match[1]);
	const base64 = normalizeOptionalString(match[2]);
	if (!mimeType || !base64) return;
	const canonicalBase64 = canonicalizeBase64(base64);
	if (!canonicalBase64) return;
	return {
		mimeType,
		base64: canonicalBase64
	};
}
function generatedImageAssetFromBase64(params) {
	const base64 = normalizeOptionalString(params.base64);
	const canonicalBase64 = base64 ? canonicalizeBase64(base64) : void 0;
	if (!canonicalBase64) return;
	const buffer = Buffer.from(canonicalBase64, "base64");
	const explicitMimeType = normalizeOptionalString(params.mimeType);
	const defaultMimeType = normalizeOptionalString(params.defaultMimeType) ?? DEFAULT_IMAGE_MIME_TYPE;
	const detected = params.sniffMimeType && !explicitMimeType ? sniffImageMimeType(buffer, defaultMimeType) : void 0;
	const mimeType = explicitMimeType ?? detected?.mimeType ?? defaultMimeType;
	const image = {
		buffer,
		mimeType,
		fileName: `${normalizeOptionalString(params.fileNamePrefix) ?? DEFAULT_IMAGE_FILE_PREFIX}-${params.index + 1}.${detected?.extension ?? imageFileExtensionForMimeType(mimeType)}`
	};
	const revisedPrompt = normalizeOptionalString(params.revisedPrompt);
	if (revisedPrompt) image.revisedPrompt = revisedPrompt;
	return image;
}
function generatedImageAssetFromDataUrl(params) {
	const parsed = parseImageDataUrl(params.dataUrl);
	if (!parsed) return;
	return generatedImageAssetFromBase64({
		base64: parsed.base64,
		index: params.index,
		mimeType: parsed.mimeType,
		fileNamePrefix: params.fileNamePrefix
	});
}
function generatedImageAssetFromOpenAiCompatibleEntry(entry, index, options = {}) {
	return generatedImageAssetFromBase64({
		base64: normalizeOptionalString(entry.b64_json),
		index,
		mimeType: normalizeOptionalString(entry.mime_type),
		revisedPrompt: normalizeOptionalString(entry.revised_prompt),
		defaultMimeType: options.defaultMimeType,
		fileNamePrefix: options.fileNamePrefix,
		sniffMimeType: options.sniffMimeType
	});
}
function parseOpenAiCompatibleImageResponse(payload, options = {}) {
	if (!isRecord(payload)) {
		throwMalformedImageResponse(options.malformedResponseError);
		return [];
	}
	const data = payload.data;
	if (data === void 0 || data === null) return [];
	if (!Array.isArray(data)) {
		throwMalformedImageResponse(options.malformedResponseError);
		return [];
	}
	const images = [];
	for (const [index, entry] of data.entries()) {
		if (!isRecord(entry)) {
			throwMalformedImageResponse(options.malformedResponseError);
			continue;
		}
		const image = generatedImageAssetFromOpenAiCompatibleEntry(entry, index, options);
		if (!image) {
			throwMalformedImageResponse(options.malformedResponseError);
			continue;
		}
		images.push(image);
	}
	return images;
}
function imageSourceUploadFileName(params) {
	const fileName = normalizeOptionalString(params.image.fileName);
	if (fileName) return fileName;
	const mimeType = normalizeOptionalString(params.image.mimeType) ?? normalizeOptionalString(params.defaultMimeType) ?? DEFAULT_IMAGE_MIME_TYPE;
	return `${normalizeOptionalString(params.fileNamePrefix) ?? DEFAULT_IMAGE_FILE_PREFIX}-${params.index + 1}.${imageFileExtensionForMimeType(mimeType)}`;
}
//#endregion
export { imageSourceUploadFileName as a, resolveInlineImageJsonResponseMaxBytes as c, imageFileExtensionForMimeType as i, sniffImageMimeType as l, generatedImageAssetFromDataUrl as n, parseImageDataUrl as o, generatedImageAssetFromOpenAiCompatibleEntry as r, parseOpenAiCompatibleImageResponse as s, generatedImageAssetFromBase64 as t, toImageDataUrl as u };
