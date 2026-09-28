import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { i as readResponseWithLimit, t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { d as normalizeMimeType, n as detectMime } from "./mime-1zBUMwu6.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import "./media-services-VTwDQdlk.mjs";
import { r as convertHeicToJpeg } from "./image-ops-CU4vxSlO.mjs";
import { t as parseMediaContentLength } from "./content-length-CHOuQ9D3.mjs";
import { n as classifyAttachmentBytes } from "./attachment-classify-BJQ0y7ye.mjs";
import { t as extractPdfContent } from "./pdf-extract-DqcpR22x.mjs";
import { MIMEType } from "node:util";
//#region src/media/input-files.ts
/** Default MIME allowlist for input_image sources. */
const DEFAULT_INPUT_IMAGE_MIMES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/heic",
	"image/heif"
];
/** Default MIME allowlist for input_file text/PDF extraction. */
const DEFAULT_INPUT_FILE_MIMES = [
	"text/plain",
	"text/markdown",
	"text/html",
	"text/csv",
	"application/json",
	"application/pdf"
];
/** Default decoded-byte cap for input_image payloads. */
const DEFAULT_INPUT_IMAGE_MAX_BYTES = 10485760;
/** Default decoded-byte cap for input_file payloads. */
const DEFAULT_INPUT_FILE_MAX_BYTES = 5242880;
/** Default maximum model-visible characters emitted from input_file text. */
const DEFAULT_INPUT_FILE_MAX_CHARS = 6e4;
/** Default timeout for guarded input source URL fetches. */
const DEFAULT_INPUT_TIMEOUT_MS = 1e4;
/** Default PDF page cap for input_file extraction. */
const DEFAULT_INPUT_PDF_MAX_PAGES = 4;
/** Default PDF raster pixel cap for extracted input_file images. */
const DEFAULT_INPUT_PDF_MAX_PIXELS = 4e6;
/** Default text threshold before PDF extraction keeps text-only output. */
const DEFAULT_INPUT_PDF_MIN_TEXT_CHARS = 200;
const NORMALIZED_INPUT_IMAGE_MIME = "image/jpeg";
const HEIC_INPUT_IMAGE_MIMES = /* @__PURE__ */ new Set(["image/heic", "image/heif"]);
function rejectOversizedBase64Payload(params) {
	const estimated = estimateBase64DecodedBytes(params.data);
	if (estimated > params.maxBytes) throw new Error(`${params.label} too large: ${estimated} bytes (limit: ${params.maxBytes} bytes)`);
}
/** Parses a Content-Type header into normalized MIME and optional charset values. */
function parseContentType(value) {
	if (!value) return {};
	const mimeType = normalizeMimeType(value);
	try {
		return {
			mimeType,
			charset: new MIMEType(value).params.get("charset") ?? void 0
		};
	} catch {
		return { mimeType };
	}
}
/** Converts configured MIME lists into a normalized allowlist, using fallback defaults when empty. */
function normalizeMimeList(values, fallback) {
	const input = values && values.length > 0 ? values : fallback;
	return new Set(input.flatMap((value) => normalizeMimeType(value) ?? []));
}
/** Resolves input_file extraction limits from partial config and stable defaults. */
function resolveInputFileLimits(config) {
	return {
		allowUrl: config?.allowUrl ?? true,
		allowedMimes: normalizeMimeList(config?.allowedMimes, DEFAULT_INPUT_FILE_MIMES),
		maxBytes: config?.maxBytes ?? DEFAULT_INPUT_FILE_MAX_BYTES,
		maxChars: config?.maxChars ?? DEFAULT_INPUT_FILE_MAX_CHARS,
		maxRedirects: config?.maxRedirects ?? 3,
		timeoutMs: config?.timeoutMs ?? 1e4,
		pdf: {
			maxPages: config?.pdf?.maxPages ?? DEFAULT_INPUT_PDF_MAX_PAGES,
			maxPixels: config?.pdf?.maxPixels ?? DEFAULT_INPUT_PDF_MAX_PIXELS,
			minTextChars: config?.pdf?.minTextChars ?? DEFAULT_INPUT_PDF_MIN_TEXT_CHARS
		}
	};
}
/** Fetches an input source URL through SSRF, redirect, timeout, and byte-limit guards. */
async function fetchWithGuard(url, limits, kind, signal) {
	if (!limits.allowUrl) throw new Error(`${kind} URL sources are disabled by config`);
	const { response, release } = await fetchWithSsrFGuard({
		url,
		maxRedirects: limits.maxRedirects,
		timeoutMs: limits.timeoutMs,
		signal,
		policy: {
			allowPrivateNetwork: false,
			hostnameAllowlist: limits.urlAllowlist
		},
		auditContext: `openresponses.${kind}`,
		init: { headers: { "User-Agent": "OpenClaw-Gateway/1.0" } }
	});
	let result;
	try {
		if (!response.ok) {
			await cancelUnreadResponseBody(response);
			throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
		}
		let contentLength;
		try {
			contentLength = parseMediaContentLength(response.headers.get("content-length"));
		} catch (err) {
			await cancelUnreadResponseBody(response);
			throw err;
		}
		if (contentLength !== null && contentLength > limits.maxBytes) {
			await cancelUnreadResponseBody(response);
			throw new Error(`Content too large: ${contentLength} bytes (limit: ${limits.maxBytes} bytes)`);
		}
		result = {
			buffer: await readResponseWithLimit(response, limits.maxBytes),
			contentType: response.headers.get("content-type") ?? void 0
		};
	} finally {
		await release();
	}
	signal?.throwIfAborted();
	return result;
}
function decodeTextContent(buffer, charset, maxChars) {
	const encoding = normalizeOptionalLowercaseString(charset) || "utf-8";
	const limit = Math.max(0, Math.floor(maxChars));
	const decode = (label) => {
		const decoder = new TextDecoder(label);
		let text = "";
		for (let offset = 0; offset < buffer.length && text.length < limit; offset += 16384) {
			const end = Math.min(offset + 16384, buffer.length);
			text += decoder.decode(buffer.subarray(offset, end), { stream: end < buffer.length });
		}
		return truncateUtf16Safe(text, limit);
	};
	try {
		return decode(encoding);
	} catch {
		return decode("utf-8");
	}
}
async function withInputFileTimeout(params) {
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	const controller = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, controller.signal]) : controller.signal;
	signal.throwIfAborted();
	let onAbort;
	const cancelled = new Promise((_, reject) => {
		onAbort = () => reject(toErrorObject(signal.reason, "Input file extraction aborted"));
		signal.addEventListener("abort", onAbort, { once: true });
	});
	const timeout = setTimeout(() => controller.abort(/* @__PURE__ */ new Error(`${params.label} timed out after ${timeoutMs}ms`)), timeoutMs);
	try {
		return await Promise.race([params.task(signal), cancelled]);
	} finally {
		clearTimeout(timeout);
		signal.removeEventListener("abort", onAbort);
	}
}
/** Validates image bytes and converts HEIC/HEIF to JPEG, keeping the original Buffer otherwise. */
async function normalizeInputImageBuffer(params) {
	if (params.buffer.byteLength > params.limits.maxBytes) throw new Error(`Image too large: ${params.buffer.byteLength} bytes (limit: ${params.limits.maxBytes} bytes)`);
	const declaredMime = normalizeMimeType(params.mimeType) ?? "application/octet-stream";
	const detectedMime = normalizeMimeType(await detectMime({
		buffer: params.buffer,
		headerMime: params.mimeType
	}));
	if (declaredMime.startsWith("image/") && detectedMime && !detectedMime.startsWith("image/")) throw new Error(`Unsupported image MIME type: ${detectedMime}`);
	const sourceMime = (detectedMime?.startsWith("image/") ? detectedMime : declaredMime).replace(/^(image\/hei[cf])-sequence$/, "$1");
	if (!params.limits.allowedMimes.has(sourceMime)) throw new Error(`Unsupported image MIME type: ${sourceMime}`);
	if (!HEIC_INPUT_IMAGE_MIMES.has(sourceMime)) return {
		buffer: params.buffer,
		mimeType: sourceMime
	};
	const normalizedBuffer = await convertHeicToJpeg(params.buffer);
	if (normalizedBuffer.byteLength > params.limits.maxBytes) throw new Error(`Image too large after HEIC conversion: ${normalizedBuffer.byteLength} bytes (limit: ${params.limits.maxBytes} bytes)`);
	return {
		buffer: normalizedBuffer,
		mimeType: NORMALIZED_INPUT_IMAGE_MIME
	};
}
/** Extracts and normalizes an input_image source from base64 or guarded URL input. */
async function extractImageContentFromSource(source, limits, signal) {
	signal?.throwIfAborted();
	let buffer;
	let mimeType;
	let canonicalData;
	if (source.type === "base64") {
		rejectOversizedBase64Payload({
			data: source.data,
			maxBytes: limits.maxBytes,
			label: "Image"
		});
		canonicalData = canonicalizeBase64(source.data);
		if (!canonicalData) throw new Error("input_image base64 source has invalid 'data' field");
		buffer = Buffer.from(canonicalData, "base64");
		mimeType = normalizeMimeType(source.mediaType) ?? "image/png";
	} else if (source.type === "url") {
		const result = await fetchWithGuard(source.url, limits, "input_image", signal);
		buffer = result.buffer;
		mimeType = parseContentType(result.contentType).mimeType;
	} else throw new Error(`Unsupported input_image source type: ${source.type}`);
	const image = await normalizeInputImageBuffer({
		buffer,
		mimeType,
		limits
	});
	signal?.throwIfAborted();
	return {
		type: "image",
		data: image.buffer === buffer && canonicalData ? canonicalData : image.buffer.toString("base64"),
		mimeType: image.mimeType
	};
}
/** Extracts model-visible text and images from an input_file source after MIME validation. */
async function extractFileContentFromSource(params) {
	const { source, limits, signal } = params;
	signal?.throwIfAborted();
	const filename = source.filename || "file";
	let buffer;
	let mimeType;
	let charset;
	if (source.type === "base64") {
		rejectOversizedBase64Payload({
			data: source.data,
			maxBytes: limits.maxBytes,
			label: "File"
		});
		const canonicalData = canonicalizeBase64(source.data);
		if (!canonicalData) throw new Error("input_file base64 source has invalid 'data' field");
		const parsed = parseContentType(source.mediaType);
		mimeType = parsed.mimeType;
		charset = parsed.charset;
		buffer = Buffer.from(canonicalData, "base64");
	} else {
		const result = await fetchWithGuard(source.url, limits, "input_file", signal);
		const parsed = parseContentType(result.contentType);
		mimeType = parsed.mimeType;
		charset = parsed.charset;
		buffer = result.buffer;
	}
	const extracted = await extractFileContentFromBuffer({
		buffer,
		filename,
		mimeType,
		charset,
		limits,
		config: params.config,
		...signal ? { signal } : {}
	});
	signal?.throwIfAborted();
	return extracted;
}
/** Extracts text from borrowed bytes or PDFs from owned bytes after shared size and MIME checks. */
async function extractFileContentFromBuffer(params) {
	const { buffer, limits } = params;
	params.signal?.throwIfAborted();
	const filename = params.filename || "file";
	if (buffer.byteLength > limits.maxBytes) throw new Error(`File too large: ${buffer.byteLength} bytes (limit: ${limits.maxBytes} bytes)`);
	const classification = params.classification ?? await classifyAttachmentBytes({
		buffer,
		declaredMime: params.mimeType
	});
	params.signal?.throwIfAborted();
	const mimeType = classification.mime;
	const charset = classification.charset ?? params.charset;
	if (!mimeType) throw new Error("input_file missing media type");
	if (!limits.allowedMimes.has(mimeType)) throw new Error(`Unsupported file MIME type: ${mimeType}`);
	if (mimeType === "application/pdf") {
		const extracted = await withInputFileTimeout({
			label: "PDF extraction",
			timeoutMs: limits.timeoutMs,
			signal: params.signal,
			task: (signal) => extractPdfContent({
				buffer,
				signal,
				maxPages: limits.pdf.maxPages,
				maxPixels: limits.pdf.maxPixels,
				minTextChars: limits.pdf.minTextChars,
				...params.config ? { config: params.config } : {},
				onImageExtractionError: (err) => {
					logWarn(`media: PDF image extraction skipped, ${String(err)}`);
				}
			})
		});
		return {
			filename,
			text: extracted.text ? truncateUtf16Safe(extracted.text, limits.maxChars) : "",
			images: extracted.images.length > 0 ? extracted.images : void 0
		};
	}
	return {
		filename,
		text: decodeTextContent(buffer, charset, limits.maxChars)
	};
}
//#endregion
export { extractFileContentFromSource as a, normalizeMimeList as c, extractFileContentFromBuffer as i, resolveInputFileLimits as l, DEFAULT_INPUT_IMAGE_MIMES as n, extractImageContentFromSource as o, DEFAULT_INPUT_TIMEOUT_MS as r, normalizeInputImageBuffer as s, DEFAULT_INPUT_IMAGE_MAX_BYTES as t };
