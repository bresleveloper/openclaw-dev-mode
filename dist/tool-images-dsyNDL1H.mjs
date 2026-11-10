import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import "./src-Djeo9OvP.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-CU53EX1R.mjs";
import "./media-services-B_p88lUH.mjs";
import "./image-processor-config-CTWMbAtc.mjs";
import { f as readImageMetadataFromHeader, l as isImageProcessorUnavailableError, m as resizeToJpeg, n as buildImageResizeSideGrid, s as getImageMetadata, t as IMAGE_REDUCE_QUALITY_STEPS } from "./image-ops-DM5GUpDi.mjs";
import { n as isTextContentBlock } from "./content-blocks-DDtxq3Ff.mjs";
import { n as DEFAULT_IMAGE_MAX_DIMENSION_PX, t as DEFAULT_IMAGE_MAX_BYTES } from "./image-sanitization-DhkMOJXD.mjs";
import { createHash } from "node:crypto";
//#region src/agents/tool-images.ts
const MAX_IMAGE_INPUT_BYTES = 10485760;
const log = createSubsystemLogger("agents/tool-images");
const verifiedImageOutcomes = new LruCache(4096, {
	maxBytes: 16777216,
	sizeOf: (replacement) => 128 + (replacement?.length ?? 0)
});
function isImageTypeBlock(block) {
	return Boolean(block) && typeof block === "object" && block.type === "image";
}
function isImageBlock(block) {
	if (!isImageTypeBlock(block)) return false;
	return typeof block.data === "string" && typeof block.mimeType === "string";
}
function inferMimeTypeFromBase64(base64) {
	if (base64.startsWith("/9j/")) return "image/jpeg";
	if (base64.startsWith("iVBOR")) return "image/png";
	if (base64.startsWith("R0lGOD")) return "image/gif";
}
function imageWithinLimits(buffer, metadata, maxDimensionPx, maxBytes) {
	const width = metadata?.width;
	const height = metadata?.height;
	return typeof width === "number" && typeof height === "number" && width > 0 && height > 0 && buffer.byteLength <= maxBytes && width <= maxDimensionPx && height <= maxDimensionPx && width * height <= 25e6;
}
function formatBytesShort(bytes) {
	return formatByteSize(bytes, {
		style: "legacy-binary",
		maxUnit: "mega",
		separator: "",
		fractionDigits: (_value, unit) => unit === "mega" ? 2 : unit === "kilo" ? 1 : 0
	});
}
function fileNameFromPathLike(pathLike) {
	const value = pathLike.trim();
	if (!value) return;
	const url = URL.parse(value);
	if (url) return url.pathname.split("/").findLast(Boolean);
	return value.replaceAll("\\", "/").split("/").findLast(Boolean);
}
function inferImageFileName(params) {
	for (const key of [
		"fileName",
		"filename",
		"path",
		"url"
	]) {
		const raw = Reflect.get(params.block, key);
		if (typeof raw !== "string") continue;
		const candidate = fileNameFromPathLike(raw);
		if (candidate) return candidate;
	}
	const name = Reflect.get(params.block, "name");
	if (typeof name === "string" && name.trim().length > 0) return name.trim();
	if (typeof params.label === "string" && params.label.startsWith("read:")) return fileNameFromPathLike(params.label.slice(5));
}
async function verifyImageDecodability(buffer) {
	try {
		await resizeToJpeg({
			buffer,
			maxSide: 1,
			quality: 1,
			withoutEnlargement: true
		});
		return true;
	} catch (err) {
		if (!isImageProcessorUnavailableError(err)) throw err;
		return false;
	}
}
async function resizeImageBase64IfNeeded(params) {
	const cacheKey = params.verifyDecodability ? `${createHash("sha256").update(params.base64).digest("base64url")}:${params.maxDimensionPx}:${params.maxBytes}` : void 0;
	const cached = cacheKey === void 0 ? void 0 : verifiedImageOutcomes.get(cacheKey);
	if (cached !== void 0) return cached === null ? {
		base64: params.base64,
		mimeType: params.mimeType
	} : {
		base64: cached,
		mimeType: "image/jpeg"
	};
	const buf = Buffer.from(params.base64, "base64");
	const meta = readImageMetadataFromHeader(buf) ?? await getImageMetadata(buf);
	const width = meta?.width;
	const height = meta?.height;
	const overBytes = buf.byteLength > params.maxBytes;
	const hasDimensions = typeof width === "number" && typeof height === "number";
	const overDimensions = hasDimensions && (width > params.maxDimensionPx || height > params.maxDimensionPx);
	if (imageWithinLimits(buf, meta, params.maxDimensionPx, params.maxBytes)) {
		if (cacheKey !== void 0 && await verifyImageDecodability(buf)) verifiedImageOutcomes.set(cacheKey, null);
		return {
			base64: params.base64,
			mimeType: params.mimeType
		};
	}
	const maxDim = hasDimensions ? Math.max(width ?? 0, height ?? 0) : params.maxDimensionPx;
	const sideStart = maxDim > 0 ? Math.min(params.maxDimensionPx, maxDim) : params.maxDimensionPx;
	const sideGrid = buildImageResizeSideGrid(params.maxDimensionPx, sideStart);
	const sourcePixels = hasDimensions ? `${width}x${height}px` : "unknown";
	const sourceWithFile = params.fileName ? `${params.fileName} ${sourcePixels}` : sourcePixels;
	const sourceDetails = {
		label: params.label,
		fileName: params.fileName,
		sourceMimeType: params.mimeType,
		sourceWidth: width,
		sourceHeight: height,
		sourceBytes: buf.byteLength
	};
	let smallestSize;
	for (const side of sideGrid) for (const quality of IMAGE_REDUCE_QUALITY_STEPS) {
		let out;
		try {
			out = await resizeToJpeg({
				buffer: buf,
				maxSide: side,
				quality,
				withoutEnlargement: true
			});
		} catch (err) {
			if (isImageProcessorUnavailableError(err)) throw toErrorObject(err, "Non-Error thrown");
			throw err;
		}
		if (smallestSize === void 0 || out.byteLength < smallestSize) smallestSize = out.byteLength;
		if (out.byteLength <= params.maxBytes) {
			const byteReductionPct = buf.byteLength > 0 ? Number(((buf.byteLength - out.byteLength) / buf.byteLength * 100).toFixed(1)) : 0;
			log.info(`Image resized to fit limits: ${sourceWithFile} ${formatBytesShort(buf.byteLength)} -> ${formatBytesShort(out.byteLength)} (${byteReductionPct < 0 ? "+" : ""}${-byteReductionPct}%)`, {
				...sourceDetails,
				maxBytes: params.maxBytes,
				maxDimensionPx: params.maxDimensionPx,
				triggerOverBytes: overBytes,
				triggerOverDimensions: overDimensions,
				outputMimeType: "image/jpeg",
				outputBytes: out.byteLength,
				outputQuality: quality,
				outputMaxSide: side,
				byteReductionPct
			});
			const base64 = out.toString("base64");
			if (cacheKey !== void 0) verifiedImageOutcomes.set(cacheKey, base64);
			return {
				base64,
				mimeType: "image/jpeg"
			};
		}
	}
	const bestSize = smallestSize ?? buf.byteLength;
	log.warn(`Image resize failed to fit limits: ${sourceWithFile} best=${formatBytesShort(bestSize)} limit=${formatBytesShort(params.maxBytes)}`, {
		...sourceDetails,
		maxDimensionPx: params.maxDimensionPx,
		maxBytes: params.maxBytes,
		smallestCandidateBytes: bestSize,
		triggerOverBytes: overBytes,
		triggerOverDimensions: overDimensions
	});
	throw new Error(`Image could not be reduced below ${formatBytesShort(params.maxBytes)} (got ${formatBytesShort(bestSize)})`);
}
async function sanitizeContentBlocksImages(blocks, label, opts = {}) {
	const maxDimensionPx = resolveIntegerOption(opts.maxDimensionPx, DEFAULT_IMAGE_MAX_DIMENSION_PX, { min: 1 });
	const maxBytes = resolveIntegerOption(opts.maxBytes, DEFAULT_IMAGE_MAX_BYTES, { min: 1 });
	const out = [];
	const omit = (reason) => out.push({
		type: "text",
		text: `[${label}] ${reason}`
	});
	for (const block of blocks) {
		if (!isImageBlock(block)) {
			if (isImageTypeBlock(block)) {
				omit("omitted image payload: missing data or mimeType");
				continue;
			}
			out.push(block);
			continue;
		}
		if (estimateBase64DecodedBytes(block.data) > MAX_IMAGE_INPUT_BYTES) {
			omit(`omitted image payload: image exceeds input size limit (${formatBytesShort(MAX_IMAGE_INPUT_BYTES)})`);
			continue;
		}
		const data = block.data.trim();
		if (!data) {
			omit("omitted empty image payload");
			continue;
		}
		const canonicalData = canonicalizeBase64(data);
		if (!canonicalData) {
			omit("omitted image payload: invalid base64");
			continue;
		}
		try {
			const resized = await resizeImageBase64IfNeeded({
				base64: canonicalData,
				mimeType: inferMimeTypeFromBase64(canonicalData) ?? block.mimeType,
				maxDimensionPx,
				maxBytes,
				label,
				fileName: inferImageFileName({
					block,
					label
				}),
				verifyDecodability: opts.verifyDecodability
			});
			out.push({
				...block,
				data: resized.base64,
				mimeType: resized.mimeType
			});
		} catch (err) {
			omit(`omitted image payload: ${String(err)}`);
		}
	}
	return out;
}
async function sanitizeImageBlocks(images, label, opts = {}) {
	if (images.length === 0) return {
		images,
		dropped: 0
	};
	const next = (await sanitizeContentBlocksImages(images, label, opts)).filter(isImageBlock);
	return {
		images: next,
		dropped: Math.max(0, images.length - next.length)
	};
}
async function sanitizeToolResultImages(result, label, opts = {}) {
	const content = Array.isArray(result.content) ? result.content : [];
	if (!content.some((block) => isImageTypeBlock(block) || isTextContentBlock(block))) return result;
	const next = await sanitizeContentBlocksImages(content, label, opts);
	return {
		...result,
		content: next
	};
}
//#endregion
export { sanitizeImageBlocks as n, sanitizeToolResultImages as r, sanitizeContentBlocksImages as t };
