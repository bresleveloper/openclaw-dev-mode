import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./backoff-CszdOMiF.mjs";
import { t as retryAsync } from "./retry-C0DLN1oj.mjs";
import { t as readChunkWithIdleTimeout } from "./http-response-body-timeout-QllykGBC.mjs";
import { i as readResponseWithLimit, r as readResponseTextSnippet } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { n as MAX_DOCUMENT_BYTES } from "./constants-DUxuqQz8.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import { i as fetchWithSsrFGuard, l as withTrustedExplicitProxyGuardedFetchMode, s as withStrictGuardedFetchMode } from "./fetch-guard-EFfAF2PS.mjs";
import { n as extnameFromAnyPath, t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { n as detectMime, r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import { n as isTransientNetworkError } from "./retryable-network-errors-D2gJmBqw.mjs";
import { i as withChannelReadAuthority, n as captureChannelReadScope } from "./channel-read-authority-CLJnqxr1.mjs";
import { t as SaveMediaSourceError } from "./store.shared-8ewC3oFm.mjs";
import { m as saveMediaStream } from "./store-BrX2xbJz.mjs";
import { t as parseMediaContentLength } from "./content-length-CHOuQ9D3.mjs";
//#region src/media/fetch.read-scope.ts
async function withMediaReadScope(options, run) {
	if (!captureChannelReadScope() && !options.assertCurrent) return await run(options);
	return await withChannelReadAuthority(options.assertCurrent ?? (() => {}), async () => {
		const scope = captureChannelReadScope();
		const beforeRequest = options.beforeRequest;
		return await run({
			...options,
			beforeRequest: options.assertCurrent ? () => {
				scope.assertCurrent();
				return beforeRequest?.();
			} : beforeRequest,
			requestInit: {
				...options.requestInit,
				signal: scope.signal
			}
		});
	}, options.requestInit?.signal ?? void 0);
}
//#endregion
//#region src/media/fetch.ts
/** Default remote media fetch cap shared by buffer reads and store writes. */
const DEFAULT_FETCH_MEDIA_MAX_BYTES = MAX_DOCUMENT_BYTES;
const DEFAULT_MEDIA_RESPONSE_HEADER_TIMEOUT_MS = 9e5;
/** Structured fetch error used for retry decisions and caller-facing diagnostics. */
var MediaFetchError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.status = options?.status;
		this.name = "MediaFetchError";
	}
};
function stripQuotes(value) {
	return value.replace(/^["']|["']$/g, "");
}
function decodeRemoteFileNameComponent(value) {
	try {
		return decodeURIComponent(value).replace(/[\\/]/g, "_");
	} catch {
		return value;
	}
}
function decodeExtendedRemoteFileName(value) {
	const match = /^([^']*)'[^']*'(.*)$/u.exec(value);
	if (!match) return;
	const charset = match[1]?.toLowerCase();
	const encoded = match[2] ?? "";
	try {
		if (charset === "utf-8") return decodeURIComponent(encoded).replace(/[\\/]/g, "_");
		if (charset === "iso-8859-1") {
			if (/%(?![\da-f]{2})/iu.test(encoded)) return;
			return encoded.replace(/%([\da-f]{2})/giu, (_match, hex) => String.fromCharCode(Number.parseInt(hex, 16))).replace(/[\\/]/g, "_");
		}
	} catch {
		return;
	}
}
function* parseContentDispositionParameters(header) {
	let start = 0;
	let quoted = false;
	let escaped = false;
	for (let index = 0; index <= header.length; index += 1) {
		const character = header[index];
		if (escaped || quoted && character === "\\") {
			escaped = !escaped;
			continue;
		}
		if (character === "\"") {
			quoted = !quoted;
			continue;
		}
		if (index !== header.length && (quoted || character !== ";")) continue;
		const parameter = header.slice(start, index).trim();
		start = index + 1;
		const separator = parameter.indexOf("=");
		if (separator > 0) yield {
			name: parameter.slice(0, separator).trim().toLowerCase(),
			value: stripQuotes(parameter.slice(separator + 1).trim())
		};
	}
}
function decodeQuotedRemoteFileName(value) {
	const windowsDrivePath = /^[a-z]:[\\/]/iu.test(value);
	const windowsNetworkPath = value.startsWith("\\\\");
	const mixedWindowsPath = value.includes("/") && value.includes("\\");
	const relativeWindowsPath = /\\[\p{L}\p{N}]/u.test(value) && /^[^\\/:]+(?:\\[^\\]+)+$/u.test(value);
	if (!windowsDrivePath && !windowsNetworkPath && !mixedWindowsPath && !relativeWindowsPath) return value.replace(/\\(.)/gu, "$1");
	const lastForwardSeparator = value.lastIndexOf("/");
	if (lastForwardSeparator >= 0) return `${value.slice(0, lastForwardSeparator + 1)}${value.slice(lastForwardSeparator + 1).replace(/\\([^\p{L}\p{N}])/gu, "$1")}`;
	const firstBackslash = value.indexOf("\\");
	if (!windowsDrivePath && !windowsNetworkPath && firstBackslash === value.lastIndexOf("\\") && /\\[^\p{L}\p{N}]/u.test(value)) return value.replace(/\\(.)/gu, "$1");
	return value.replace(/\\"/gu, "\"");
}
function parseContentDispositionFileName(header) {
	if (!header) return;
	let fallbackFileName;
	for (const parameter of parseContentDispositionParameters(header)) {
		if (parameter.name === "filename") {
			fallbackFileName ??= basenameFromAnyPath(decodeQuotedRemoteFileName(parameter.value)) || void 0;
			continue;
		}
		if (parameter.name !== "filename*") continue;
		const fileName = basenameFromAnyPath(decodeExtendedRemoteFileName(parameter.value) ?? "");
		if (fileName) return fileName;
	}
	return fallbackFileName;
}
function basenameFromUrlPathname(pathname) {
	const base = basenameFromAnyPath(pathname);
	if (!base) return "";
	return decodeRemoteFileNameComponent(base);
}
async function readErrorBodySnippet(res, opts) {
	try {
		return await readResponseTextSnippet(res, {
			maxBytes: 8192,
			maxChars: opts?.maxChars,
			chunkTimeoutMs: opts?.chunkTimeoutMs
		});
	} catch {
		return;
	}
}
function redactMediaUrl(url) {
	return redactSensitiveText(url);
}
function createMediaFetchFailure(sourceUrl, cause) {
	return new MediaFetchError("fetch_failed", `Failed to fetch media from ${sourceUrl}: ${formatErrorMessage(cause)}`, { cause });
}
async function fetchGuardedMediaResponse(options) {
	const { url, fetchImpl, beforeRequest, requestInit, maxRedirects, requireHttps, timeoutMs, responseHeaderTimeoutMs = DEFAULT_MEDIA_RESPONSE_HEADER_TIMEOUT_MS, ssrfPolicy, lookupFn, dispatcherPolicy, dispatcherAttempts, shouldRetryFetchError, trustExplicitProxyDns } = options;
	const sourceUrl = redactMediaUrl(url);
	const attempts = dispatcherAttempts && dispatcherAttempts.length > 0 ? dispatcherAttempts : [{
		dispatcherPolicy,
		lookupFn
	}];
	const responseHeaderDeadline = buildTimeoutAbortSignal({
		timeoutMs: responseHeaderTimeoutMs,
		signal: requestInit?.signal ?? void 0,
		operation: "media response headers",
		url
	});
	const requestSignal = responseHeaderDeadline.signal;
	const runGuardedFetch = async (attempt) => await fetchWithSsrFGuard((trustExplicitProxyDns && attempt.dispatcherPolicy?.mode === "explicit-proxy" ? withTrustedExplicitProxyGuardedFetchMode : withStrictGuardedFetchMode)({
		url,
		fetchImpl,
		...beforeRequest ? { beforeRequest } : {},
		init: requestInit,
		maxRedirects,
		...requireHttps !== void 0 ? { requireHttps } : {},
		...timeoutMs !== void 0 ? { timeoutMs } : {},
		...requestSignal ? { signal: requestSignal } : {},
		policy: ssrfPolicy,
		lookupFn: attempt.lookupFn ?? lookupFn,
		dispatcherPolicy: attempt.dispatcherPolicy
	}));
	try {
		let result;
		const attemptErrors = [];
		for (let i = 0; i < attempts.length; i += 1) try {
			result = await runGuardedFetch(expectDefined(attempts[i], "attempts entry at i"));
			break;
		} catch (err) {
			if (typeof shouldRetryFetchError !== "function" || !shouldRetryFetchError(err) || i === attempts.length - 1) {
				if (attemptErrors.length > 0) {
					const combined = new Error(`Primary fetch failed and fallback fetch also failed for ${sourceUrl}`, { cause: err });
					combined.primaryError = attemptErrors[0];
					combined.attemptErrors = [...attemptErrors, err];
					throw combined;
				}
				throw err;
			}
			attemptErrors.push(err);
		}
		responseHeaderDeadline.cleanup();
		return {
			response: result.response,
			finalUrl: result.finalUrl,
			release: result.release,
			sourceUrl
		};
	} catch (err) {
		responseHeaderDeadline.cleanup();
		throw createMediaFetchFailure(sourceUrl, err);
	}
}
async function assertMediaResponseOk(params) {
	const { res, url, finalUrl, sourceUrl, readIdleTimeoutMs } = params;
	if (res.ok && res.body) return;
	const statusText = res.statusText ? ` ${res.statusText}` : "";
	const redirected = finalUrl !== url ? ` (redirected to ${redactMediaUrl(finalUrl)})` : "";
	let detail = `HTTP ${res.status}${statusText}`;
	if (res.ok) detail += "; empty response body";
	else if (res.body) {
		const snippet = await readErrorBodySnippet(res, { chunkTimeoutMs: readIdleTimeoutMs });
		if (snippet) detail += `; body: ${snippet}`;
	}
	throw new MediaFetchError("http_error", `Failed to fetch media from ${sourceUrl}${redirected}: ${redactSensitiveText(detail)}`, { status: res.status });
}
function assertMediaContentLength(params) {
	let length;
	try {
		length = parseMediaContentLength(params.res.headers.get("content-length"));
	} catch (err) {
		params.res.body?.cancel().catch(() => void 0);
		throw new MediaFetchError("http_error", `Failed to fetch media from ${params.sourceUrl}: ${formatErrorMessage(err)}`, { cause: err });
	}
	if (length === null) return;
	if (length > params.maxBytes) {
		params.res.body?.cancel().catch(() => void 0);
		throw new MediaFetchError("max_bytes", `Failed to fetch media from ${params.sourceUrl}: content length ${length} exceeds maxBytes ${params.maxBytes}`);
	}
}
function resolveRemoteFileName(params) {
	const fileName = parseContentDispositionFileName(params.res.headers.get("content-disposition")) || (params.filePathHint ? basenameFromAnyPath(params.filePathHint) : void 0);
	if (fileName) return fileName;
	try {
		return basenameFromUrlPathname(new URL(params.finalUrl).pathname) || void 0;
	} catch {
		return;
	}
}
function isGenericResponseContentType(value) {
	const normalized = value?.split(";")[0]?.trim().toLowerCase();
	return !normalized || normalized === "application/octet-stream" || normalized === "binary/octet-stream" || normalized === "application/zip";
}
function resolveResponseContentType(params) {
	if (!params.fallbackContentType) return params.headerContentType ?? void 0;
	if (isGenericResponseContentType(params.headerContentType)) return params.fallbackContentType;
	const headerContentType = params.headerContentType?.split(";")[0]?.trim().toLowerCase();
	const fallbackContentType = params.fallbackContentType.split(";")[0]?.trim().toLowerCase();
	if (headerContentType?.startsWith("video/") && fallbackContentType?.startsWith("audio/") && headerContentType.slice(6) === fallbackContentType.slice(6)) return params.fallbackContentType;
	return params.headerContentType ?? params.fallbackContentType;
}
async function* responseBodyChunks(body, readIdleTimeoutMs) {
	const readScope = captureChannelReadScope();
	const reader = body.getReader();
	let completed = false;
	try {
		while (true) {
			readScope?.assertCurrent();
			const { done, value } = readIdleTimeoutMs ? await readChunkWithIdleTimeout(reader, readIdleTimeoutMs) : await reader.read();
			readScope?.assertCurrent();
			if (done) {
				completed = true;
				return;
			}
			if (value?.byteLength) yield value;
		}
	} finally {
		if (!completed) reader.cancel().catch(() => void 0);
		try {
			reader.releaseLock();
		} catch {}
	}
}
async function saveOkMediaResponse(params) {
	assertMediaContentLength({
		res: params.res,
		sourceUrl: params.sourceUrl,
		maxBytes: params.maxBytes
	});
	const fileName = resolveRemoteFileName({
		res: params.res,
		finalUrl: params.finalUrl,
		filePathHint: params.filePathHint
	});
	const contentType = resolveResponseContentType({
		headerContentType: params.res.headers.get("content-type"),
		fallbackContentType: params.fallbackContentType
	});
	const detectionFilePathHint = isGenericResponseContentType(contentType) ? params.filePathHint ?? fileName : void 0;
	try {
		const body = expectDefined(params.res.body, "media response body");
		return {
			...await saveMediaStream(responseBodyChunks(body, params.readIdleTimeoutMs), contentType ?? void 0, params.subdir ?? "inbound", params.maxBytes, params.originalFilename, detectionFilePathHint),
			...fileName ? { fileName } : {}
		};
	} catch (err) {
		if (err instanceof MediaFetchError) throw err;
		if (err instanceof SaveMediaSourceError && err.code === "too-large") throw new MediaFetchError("max_bytes", `Failed to fetch media from ${params.sourceUrl}: payload exceeds maxBytes ${params.maxBytes}`, { cause: err });
		throw createMediaFetchFailure(params.sourceUrl, err);
	}
}
function shouldRetryMediaFetch(err) {
	if (err instanceof MediaFetchError) {
		if (err.code === "max_bytes") return false;
		if (err.code === "http_error") return typeof err.status === "number" && (err.status === 408 || err.status >= 500);
		if (err.code === "fetch_failed") {
			if (isAbortError(err) || isAbortError(err.cause)) return false;
			return isTransientNetworkError(err.cause ?? err);
		}
		return false;
	}
	return isTransientNetworkError(err);
}
async function withMediaFetchRetry(options, fn) {
	const retry = options.retry;
	if (!retry) return await fn();
	return await retryAsync(fn, {
		label: "media:fetch",
		...retry,
		shouldRetry: (err, attempt) => retry.shouldRetry ? retry.shouldRetry(err, attempt) : shouldRetryMediaFetch(err),
		sleep: retry.sleep ?? ((delay) => sleepWithAbort(delay, options.requestInit?.signal ?? void 0).catch((cause) => {
			throw createMediaFetchFailure(redactMediaUrl(options.url), cause);
		}))
	});
}
/** Validates and saves a caller-provided response without performing a new fetch. */
async function saveResponseMedia(res, options = {}) {
	const sourceUrl = redactMediaUrl((options.sourceUrl ?? res.url) || "response");
	const finalUrl = options.sourceUrl ?? res.url;
	await assertMediaResponseOk({
		res,
		url: options.sourceUrl ?? finalUrl,
		finalUrl,
		sourceUrl,
		readIdleTimeoutMs: options.readIdleTimeoutMs
	});
	return await saveOkMediaResponse({
		res,
		finalUrl,
		sourceUrl,
		filePathHint: options.filePathHint,
		maxBytes: options.maxBytes ?? DEFAULT_FETCH_MEDIA_MAX_BYTES,
		readIdleTimeoutMs: options.readIdleTimeoutMs,
		fallbackContentType: options.fallbackContentType,
		subdir: options.subdir,
		originalFilename: options.originalFilename
	});
}
/** Fetches media through SSRF guards and saves the body into the media store. */
async function saveRemoteMedia(options) {
	return await withMediaReadScope(options, (scopedOptions) => withMediaFetchRetry(scopedOptions, () => saveRemoteMediaOnce(scopedOptions)));
}
async function saveRemoteMediaOnce(options) {
	const { response: res, finalUrl, release, sourceUrl } = await fetchGuardedMediaResponse(options);
	try {
		await assertMediaResponseOk({
			res,
			url: options.url,
			finalUrl,
			sourceUrl,
			readIdleTimeoutMs: options.readIdleTimeoutMs
		});
		return await saveOkMediaResponse({
			res,
			finalUrl,
			sourceUrl,
			filePathHint: options.filePathHint,
			maxBytes: options.maxBytes ?? DEFAULT_FETCH_MEDIA_MAX_BYTES,
			readIdleTimeoutMs: options.readIdleTimeoutMs,
			fallbackContentType: options.fallbackContentType,
			subdir: options.subdir,
			originalFilename: options.originalFilename
		});
	} finally {
		await release();
	}
}
/** Fetches media through SSRF guards and returns the bounded response body as a buffer. */
async function readRemoteMediaBuffer(options) {
	return await withMediaFetchRetry(options, () => readRemoteMediaBufferOnce(options));
}
/** @deprecated Use `readRemoteMediaBuffer` for buffer reads or `saveRemoteMedia` for URL-to-store. */
const fetchRemoteMedia = readRemoteMediaBuffer;
async function readRemoteMediaBufferOnce(options) {
	const { response: res, finalUrl, release, sourceUrl } = await fetchGuardedMediaResponse(options);
	try {
		await assertMediaResponseOk({
			res,
			url: options.url,
			finalUrl,
			sourceUrl,
			readIdleTimeoutMs: options.readIdleTimeoutMs
		});
		const effectiveMaxBytes = options.maxBytes ?? DEFAULT_FETCH_MEDIA_MAX_BYTES;
		assertMediaContentLength({
			res,
			sourceUrl,
			maxBytes: effectiveMaxBytes
		});
		let buffer;
		try {
			buffer = await readResponseWithLimit(res, effectiveMaxBytes, {
				onOverflow: ({ maxBytes, res: resLocal }) => new MediaFetchError("max_bytes", `Failed to fetch media from ${redactMediaUrl(resLocal.url || options.url)}: payload exceeds maxBytes ${maxBytes}`),
				chunkTimeoutMs: options.readIdleTimeoutMs
			});
		} catch (err) {
			if (err instanceof MediaFetchError) throw err;
			throw createMediaFetchFailure(redactMediaUrl(res.url || options.url), err);
		}
		let fileName = resolveRemoteFileName({
			res,
			finalUrl,
			filePathHint: options.filePathHint
		});
		const fileNameExt = fileName ? extnameFromAnyPath(fileName) : void 0;
		const filePathForMime = fileNameExt ? fileName : options.filePathHint ?? finalUrl;
		const contentType = await detectMime({
			buffer,
			headerMime: res.headers.get("content-type"),
			filePath: filePathForMime
		});
		if (fileName && !fileNameExt && contentType) {
			const ext = extensionForMime(contentType);
			if (ext) fileName = `${fileName}${ext}`;
		}
		return {
			buffer,
			contentType: contentType ?? void 0,
			fileName
		};
	} finally {
		await release();
	}
}
//#endregion
export { saveResponseMedia as a, saveRemoteMedia as i, fetchRemoteMedia as n, readRemoteMediaBuffer as r, MediaFetchError as t };
