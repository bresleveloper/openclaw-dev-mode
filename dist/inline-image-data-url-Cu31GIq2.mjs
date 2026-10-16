import { t as canonicalizeBase64 } from "./base64-CU53EX1R.mjs";
//#region packages/media-core/src/inline-image-data-url.ts
/** Prefix used to distinguish inline data URLs from remote/local image references. */
const INLINE_IMAGE_DATA_URL_PREFIX = "data:";
const HEIC_BRANDS = /* @__PURE__ */ new Set([
	"heic",
	"heix",
	"hevc",
	"hevx",
	"heis",
	"heim",
	"hevm",
	"hevs"
]);
const HEIF_BRANDS = /* @__PURE__ */ new Set(["mif1", "msf1"]);
const IMAGE_SIGNATURE_PREFIX_BASE64_CHARS = 128;
const INLINE_IMAGE_DATA_URL_MIMES = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif"
]);
/** Sniffs supported inline image formats from decoded bytes. */
function sniffInlineImageMime(buffer) {
	if (buffer.length >= 8 && buffer.readBigUInt64BE(0) === 9894494448401390090n) return "image/png";
	if (buffer.length >= 3 && buffer.readUIntBE(0, 3) === 16767231) return "image/jpeg";
	if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
	if (buffer.length >= 6 && /^GIF8[79]a$/.test(buffer.toString("ascii", 0, 6))) return "image/gif";
	if (buffer.length >= 2 && buffer.readUInt16BE(0) === 16973) return "image/bmp";
	if (buffer.length < 12 || buffer.subarray(4, 8).toString("ascii") !== "ftyp") return;
	const brands = [buffer.subarray(8, 12).toString("ascii")];
	for (let offset = 16; offset + 4 <= buffer.length; offset += 4) brands.push(buffer.subarray(offset, offset + 4).toString("ascii"));
	if (brands.some((brand) => HEIC_BRANDS.has(brand))) return "image/heic";
	if (brands.some((brand) => HEIF_BRANDS.has(brand))) return "image/heif";
}
/** Canonicalizes trusted inline image base64 and rejects malformed or non-image payloads. */
function sanitizeInlineImageBase64(params) {
	if (!params.mimeType.trim().toLowerCase().startsWith("image/")) return;
	const canonicalPayload = canonicalizeBase64(params.base64);
	if (!canonicalPayload) return;
	const sniffedMimeType = sniffInlineImageMime(Buffer.from(canonicalPayload.slice(0, IMAGE_SIGNATURE_PREFIX_BASE64_CHARS), "base64"));
	if (!sniffedMimeType) return;
	return {
		mimeType: sniffedMimeType,
		base64: canonicalPayload
	};
}
function sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, allowedMimes) {
	if (imageUrl.slice(0, 5).toLowerCase() !== "data:") return imageUrl;
	const commaIndex = imageUrl.indexOf(",");
	if (commaIndex < 0) return;
	const [mimeType, ...options] = imageUrl.slice(5, commaIndex).split(";").map((part) => part.trim());
	if (!mimeType || !options.some((part) => part.toLowerCase() === "base64")) return;
	const sanitized = sanitizeInlineImageBase64({
		mimeType,
		base64: imageUrl.slice(commaIndex + 1)
	});
	if (!sanitized) return;
	if (allowedMimes && !allowedMimes.has(sanitized.mimeType)) return;
	return `data:${sanitized.mimeType};base64,${sanitized.base64}`;
}
/**
* Canonicalizes trusted inline image data URLs for persistence.
* Accepts every image signature supported by `sanitizeInlineImageBase64`.
*/
function sanitizeInlineImageDataUrlForStorage(imageUrl) {
	return sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl);
}
/** Canonicalizes provider-safe inline image data URLs and rejects unsupported formats. */
function sanitizeInlineImageDataUrl(imageUrl) {
	return sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, INLINE_IMAGE_DATA_URL_MIMES);
}
//#endregion
export { sniffInlineImageMime as a, sanitizeInlineImageDataUrlForStorage as i, sanitizeInlineImageBase64 as n, sanitizeInlineImageDataUrl as r, INLINE_IMAGE_DATA_URL_PREFIX as t };
