import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { d as normalizeMimeType, n as detectMime } from "./mime-C3j3dfQb.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-CU53EX1R.mjs";
import "./http-body-DZQjJc2J.mjs";
import { i as readResponseWithLimit, t as cancelUnreadResponseBody } from "./http-response-body-B70cE6fn.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DRapCKeS.mjs";
import "./media-services-B_p88lUH.mjs";
import { r as convertHeicToJpeg } from "./image-ops-DM5GUpDi.mjs";
import { n as classifyAttachmentBytes } from "./attachment-classify-C6ki8r7-.mjs";
import { t as parseMediaContentLength } from "./content-length-ODSyBCex.mjs";
import { t as extractPdfContent } from "./pdf-extract-W2yVZ9zJ.mjs";
import { MIMEType } from "node:util";
//#region src/media/input-files.ts
const DEFAULT_INPUT_IMAGE_MIMES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/heic",
	"image/heif"
];
const DEFAULT_INPUT_FILE_MIMES = [
	"text/plain",
	"text/markdown",
	"text/html",
	"text/csv",
	"application/json",
	"application/pdf"
];
const DEFAULT_INPUT_IMAGE_MAX_BYTES = 10485760;
const DEFAULT_INPUT_FILE_MAX_BYTES = 5242880;
const DEFAULT_INPUT_FILE_MAX_CHARS = 6e4;
const DEFAULT_INPUT_TIMEOUT_MS = 1e4;
const DEFAULT_INPUT_PDF_MAX_PAGES = 4;
const DEFAULT_INPUT_PDF_MAX_PIXELS = 4e6;
/** Default text threshold before PDF extraction keeps text-only output. */
const DEFAULT_INPUT_PDF_MIN_TEXT_CHARS = 200;
const NORMALIZED_INPUT_IMAGE_MIME = "image/jpeg";
const HEIC_INPUT_IMAGE_MIMES = /* @__PURE__ */ new Set(["image/heic", "image/heif"]);
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
async function readInputSource(source, limits, kind, signal) {
	if (source.type === "base64") {
		const estimated = estimateBase64DecodedBytes(source.data);
		if (estimated > limits.maxBytes) throw new Error(`${kind === "input_image" ? "Image" : "File"} too large: ${estimated} bytes (limit: ${limits.maxBytes} bytes)`);
		const canonicalData = canonicalizeBase64(source.data);
		if (!canonicalData) throw new Error(`${kind} base64 source has invalid 'data' field`);
		return {
			buffer: Buffer.from(canonicalData, "base64"),
			contentType: source.mediaType,
			canonicalData
		};
	}
	if (kind === "input_image" && source.type !== "url") throw new Error(`Unsupported input_image source type: ${source.type}`);
	if (!limits.allowUrl) throw new Error(`${kind} URL sources are disabled by config`);
	const { response, release } = await fetchWithSsrFGuard({
		url: source.url,
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
		for (let offset = 0; offset < buffer.length && text.length <= limit; offset += 16384) {
			const end = Math.min(offset + 16384, buffer.length);
			text += decoder.decode(buffer.subarray(offset, end), { stream: end < buffer.length });
		}
		const prefix = truncateUtf16Safe(text, limit);
		return {
			text: prefix,
			...prefix.length < text.length ? { metadata: {
				textTruncated: true,
				imagesTruncated: false
			} } : {}
		};
	};
	try {
		return decode(encoding);
	} catch {
		return decode("utf-8");
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
async function extractImageContentFromSource(source, limits, signal) {
	signal?.throwIfAborted();
	const { buffer, contentType, canonicalData } = await readInputSource(source, limits, "input_image", signal);
	const image = await normalizeInputImageBuffer({
		buffer,
		mimeType: source.type === "base64" ? normalizeMimeType(contentType) ?? "image/png" : parseContentType(contentType).mimeType,
		limits
	});
	signal?.throwIfAborted();
	return {
		type: "image",
		data: image.buffer === buffer && canonicalData ? canonicalData : image.buffer.toString("base64"),
		mimeType: image.mimeType
	};
}
async function extractFileContentFromSource(params) {
	const { source, limits, signal } = params;
	signal?.throwIfAborted();
	const filename = source.filename || "file";
	const { buffer, contentType } = await readInputSource(source, limits, "input_file", signal);
	const extracted = await extractFileContentFromBuffer({
		buffer,
		filename,
		mimeType: contentType,
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
	const charset = classification.charset ?? params.charset ?? parseContentType(params.mimeType).charset;
	if (!mimeType) throw new Error("input_file missing media type");
	if (!limits.allowedMimes.has(mimeType)) throw new Error(`Unsupported file MIME type: ${mimeType}`);
	if (mimeType === "application/pdf") {
		const timeoutMs = resolveTimerTimeoutMs(limits.timeoutMs, 1);
		const controller = new AbortController();
		const signal = params.signal ? AbortSignal.any([params.signal, controller.signal]) : controller.signal;
		signal.throwIfAborted();
		const timeout = setTimeout(() => controller.abort(/* @__PURE__ */ new Error(`PDF extraction timed out after ${timeoutMs}ms`)), timeoutMs);
		let extracted;
		try {
			extracted = await racePromiseWithAbortSignal(() => extractPdfContent({
				buffer,
				signal,
				maxPages: limits.pdf.maxPages,
				maxPixels: limits.pdf.maxPixels,
				minTextChars: limits.pdf.minTextChars,
				...params.config ? { config: params.config } : {},
				onImageExtractionError: (err) => {
					logWarn(`media: PDF image extraction skipped, ${String(err)}`);
				}
			}), signal, (abortedSignal) => toErrorObject(abortedSignal.reason, "Input file extraction aborted"));
		} finally {
			clearTimeout(timeout);
		}
		const text = truncateUtf16Safe(extracted.text, limits.maxChars);
		const metadata = {
			...extracted.metadata,
			textTruncated: extracted.metadata?.textTruncated === true || text.length < extracted.text.length,
			imagesTruncated: extracted.metadata?.imagesTruncated === true
		};
		return {
			filename,
			text,
			images: extracted.images.length > 0 ? extracted.images : void 0,
			metadata
		};
	}
	return {
		filename,
		...decodeTextContent(buffer, charset, limits.maxChars)
	};
}
//#endregion
export { extractFileContentFromSource as a, normalizeMimeList as c, extractFileContentFromBuffer as i, resolveInputFileLimits as l, DEFAULT_INPUT_IMAGE_MIMES as n, extractImageContentFromSource as o, DEFAULT_INPUT_TIMEOUT_MS as r, normalizeInputImageBuffer as s, DEFAULT_INPUT_IMAGE_MAX_BYTES as t };
