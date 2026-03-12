import { $ as maxBytesForKind, D as SafeOpenError, F as closeDispatcher, G as optimizeImageToPng, I as createPinnedDispatcher, J as extensionForMime, K as resizeToJpeg, L as resolvePinnedHostnameWithPolicy, O as readLocalFileSafely, P as SsrFBlockedError, U as convertHeicToJpeg, W as hasAlphaChannel, Z as kindFromMime, c as normalizeChannelId, j as formatErrorMessage, o as resolveRetryConfig, q as detectMime, s as retryAsync } from "./config-PNq54kcT.js";
import { a as normalizeAccountId } from "./secret-file-Cr5SygBE.js";
import { t as resolveAccountEntry } from "./account-lookup-y3UdfCFv.js";
import { L as resolvePreferredOpenClawTmpDir, P as resolveStateDir, h as shouldLogVerbose, o as resolveUserPath, p as logVerbose } from "./utils-dNeyb1Bh.js";
import { c as createSubsystemLogger, n as hasProxyEnvConfigured, s as logWarn } from "./proxy-env-CyeMyCNO.js";
import { n as bindAbortRelay } from "./fetch-BDoq8YLo.js";
import fs from "node:fs/promises";
import path from "node:path";
import { RateLimitError } from "@buape/carbon";
import { fileURLToPath } from "node:url";
import { EnvHttpProxyAgent } from "undici";
import MarkdownIt from "markdown-it";
//#region src/media/load-options.ts
function resolveOutboundMediaLocalRoots(mediaLocalRoots) {
	return mediaLocalRoots && mediaLocalRoots.length > 0 ? mediaLocalRoots : void 0;
}
function buildOutboundMediaLoadOptions(params = {}) {
	const localRoots = resolveOutboundMediaLocalRoots(params.mediaLocalRoots);
	return {
		...params.maxBytes !== void 0 ? { maxBytes: params.maxBytes } : {},
		...localRoots ? { localRoots } : {}
	};
}
//#endregion
//#region src/polls.ts
function resolvePollMaxSelections(optionCount, allowMultiselect) {
	return allowMultiselect ? Math.max(2, optionCount) : 1;
}
function normalizePollInput(input, options = {}) {
	const question = input.question.trim();
	if (!question) throw new Error("Poll question is required");
	const cleaned = (input.options ?? []).map((option) => option.trim()).filter(Boolean);
	if (cleaned.length < 2) throw new Error("Poll requires at least 2 options");
	if (options.maxOptions !== void 0 && cleaned.length > options.maxOptions) throw new Error(`Poll supports at most ${options.maxOptions} options`);
	const maxSelectionsRaw = input.maxSelections;
	const maxSelections = typeof maxSelectionsRaw === "number" && Number.isFinite(maxSelectionsRaw) ? Math.floor(maxSelectionsRaw) : 1;
	if (maxSelections < 1) throw new Error("maxSelections must be at least 1");
	if (maxSelections > cleaned.length) throw new Error("maxSelections cannot exceed option count");
	const durationSecondsRaw = input.durationSeconds;
	const durationSeconds = typeof durationSecondsRaw === "number" && Number.isFinite(durationSecondsRaw) ? Math.floor(durationSecondsRaw) : void 0;
	if (durationSeconds !== void 0 && durationSeconds < 1) throw new Error("durationSeconds must be at least 1");
	const durationRaw = input.durationHours;
	const durationHours = typeof durationRaw === "number" && Number.isFinite(durationRaw) ? Math.floor(durationRaw) : void 0;
	if (durationHours !== void 0 && durationHours < 1) throw new Error("durationHours must be at least 1");
	if (durationSeconds !== void 0 && durationHours !== void 0) throw new Error("durationSeconds and durationHours are mutually exclusive");
	return {
		question,
		options: cleaned,
		maxSelections,
		durationSeconds,
		durationHours
	};
}
function normalizePollDurationHours(value, options) {
	const base = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : options.defaultHours;
	return Math.min(Math.max(base, 1), options.maxHours);
}
//#endregion
//#region src/infra/net/fetch-guard.ts
const GUARDED_FETCH_MODE = {
	STRICT: "strict",
	TRUSTED_ENV_PROXY: "trusted_env_proxy"
};
const DEFAULT_MAX_REDIRECTS = 3;
const CROSS_ORIGIN_REDIRECT_SAFE_HEADERS = new Set([
	"accept",
	"accept-encoding",
	"accept-language",
	"cache-control",
	"content-language",
	"content-type",
	"if-match",
	"if-modified-since",
	"if-none-match",
	"if-unmodified-since",
	"pragma",
	"range",
	"user-agent"
]);
function withStrictGuardedFetchMode(params) {
	return {
		...params,
		mode: GUARDED_FETCH_MODE.STRICT
	};
}
function resolveGuardedFetchMode(params) {
	if (params.mode) return params.mode;
	if (params.proxy === "env" && params.dangerouslyAllowEnvProxyWithoutPinnedDns === true) return GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY;
	return GUARDED_FETCH_MODE.STRICT;
}
function isRedirectStatus(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function retainSafeHeadersForCrossOriginRedirect(init) {
	if (!init?.headers) return init;
	const incoming = new Headers(init.headers);
	const headers = new Headers();
	for (const [key, value] of incoming.entries()) if (CROSS_ORIGIN_REDIRECT_SAFE_HEADERS.has(key.toLowerCase())) headers.set(key, value);
	return {
		...init,
		headers
	};
}
function buildAbortSignal(params) {
	const { timeoutMs, signal } = params;
	if (!timeoutMs && !signal) return {
		signal: void 0,
		cleanup: () => {}
	};
	if (!timeoutMs) return {
		signal,
		cleanup: () => {}
	};
	const controller = new AbortController();
	const timeoutId = setTimeout(controller.abort.bind(controller), timeoutMs);
	const onAbort = bindAbortRelay(controller);
	if (signal) if (signal.aborted) controller.abort();
	else signal.addEventListener("abort", onAbort, { once: true });
	const cleanup = () => {
		clearTimeout(timeoutId);
		if (signal) signal.removeEventListener("abort", onAbort);
	};
	return {
		signal: controller.signal,
		cleanup
	};
}
async function fetchWithSsrFGuard(params) {
	const fetcher = params.fetchImpl ?? globalThis.fetch;
	if (!fetcher) throw new Error("fetch is not available");
	const maxRedirects = typeof params.maxRedirects === "number" && Number.isFinite(params.maxRedirects) ? Math.max(0, Math.floor(params.maxRedirects)) : DEFAULT_MAX_REDIRECTS;
	const mode = resolveGuardedFetchMode(params);
	const { signal, cleanup } = buildAbortSignal({
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	let released = false;
	const release = async (dispatcher) => {
		if (released) return;
		released = true;
		cleanup();
		await closeDispatcher(dispatcher ?? void 0);
	};
	const visited = /* @__PURE__ */ new Set();
	let currentUrl = params.url;
	let currentInit = params.init ? { ...params.init } : void 0;
	let redirectCount = 0;
	while (true) {
		let parsedUrl;
		try {
			parsedUrl = new URL(currentUrl);
		} catch {
			await release();
			throw new Error("Invalid URL: must be http or https");
		}
		if (!["http:", "https:"].includes(parsedUrl.protocol)) {
			await release();
			throw new Error("Invalid URL: must be http or https");
		}
		let dispatcher = null;
		try {
			const pinned = await resolvePinnedHostnameWithPolicy(parsedUrl.hostname, {
				lookupFn: params.lookupFn,
				policy: params.policy
			});
			if (mode === GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY && hasProxyEnvConfigured()) dispatcher = new EnvHttpProxyAgent();
			else if (params.pinDns !== false) dispatcher = createPinnedDispatcher(pinned);
			const init = {
				...currentInit ? { ...currentInit } : {},
				redirect: "manual",
				...dispatcher ? { dispatcher } : {},
				...signal ? { signal } : {}
			};
			const response = await fetcher(parsedUrl.toString(), init);
			if (isRedirectStatus(response.status)) {
				const location = response.headers.get("location");
				if (!location) {
					await release(dispatcher);
					throw new Error(`Redirect missing location header (${response.status})`);
				}
				redirectCount += 1;
				if (redirectCount > maxRedirects) {
					await release(dispatcher);
					throw new Error(`Too many redirects (limit: ${maxRedirects})`);
				}
				const nextParsedUrl = new URL(location, parsedUrl);
				const nextUrl = nextParsedUrl.toString();
				if (visited.has(nextUrl)) {
					await release(dispatcher);
					throw new Error("Redirect loop detected");
				}
				if (nextParsedUrl.origin !== parsedUrl.origin) currentInit = retainSafeHeadersForCrossOriginRedirect(currentInit);
				visited.add(nextUrl);
				response.body?.cancel();
				await closeDispatcher(dispatcher);
				currentUrl = nextUrl;
				continue;
			}
			return {
				response,
				finalUrl: currentUrl,
				release: async () => release(dispatcher)
			};
		} catch (err) {
			if (err instanceof SsrFBlockedError) logWarn(`security: blocked URL fetch (${params.auditContext ?? "url-fetch"}) target=${parsedUrl.origin}${parsedUrl.pathname} reason=${err.message}`);
			await release(dispatcher);
			throw err;
		}
	}
}
//#endregion
//#region src/media/read-response-with-limit.ts
async function readChunkWithIdleTimeout(reader, chunkTimeoutMs) {
	let timeoutId;
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const clear = () => {
			if (timeoutId !== void 0) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		timeoutId = setTimeout(() => {
			timedOut = true;
			clear();
			reader.cancel().catch(() => void 0);
			reject(/* @__PURE__ */ new Error(`Media download stalled: no data received for ${chunkTimeoutMs}ms`));
		}, chunkTimeoutMs);
		reader.read().then((result) => {
			clear();
			if (!timedOut) resolve(result);
		}, (err) => {
			clear();
			if (!timedOut) reject(err);
		});
	});
}
async function readResponseWithLimit(res, maxBytes, opts) {
	const onOverflow = opts?.onOverflow ?? ((params) => /* @__PURE__ */ new Error(`Content too large: ${params.size} bytes (limit: ${params.maxBytes} bytes)`));
	const chunkTimeoutMs = opts?.chunkTimeoutMs;
	const body = res.body;
	if (!body || typeof body.getReader !== "function") {
		const fallback = Buffer.from(await res.arrayBuffer());
		if (fallback.length > maxBytes) throw onOverflow({
			size: fallback.length,
			maxBytes,
			res
		});
		return fallback;
	}
	const reader = body.getReader();
	const chunks = [];
	let total = 0;
	try {
		while (true) {
			const { done, value } = chunkTimeoutMs ? await readChunkWithIdleTimeout(reader, chunkTimeoutMs) : await reader.read();
			if (done) break;
			if (value?.length) {
				total += value.length;
				if (total > maxBytes) {
					try {
						await reader.cancel();
					} catch {}
					throw onOverflow({
						size: total,
						maxBytes,
						res
					});
				}
				chunks.push(value);
			}
		}
	} finally {
		try {
			reader.releaseLock();
		} catch {}
	}
	return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total);
}
//#endregion
//#region src/media/fetch.ts
var MediaFetchError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "MediaFetchError";
	}
};
function stripQuotes(value) {
	return value.replace(/^["']|["']$/g, "");
}
function parseContentDispositionFileName(header) {
	if (!header) return;
	const starMatch = /filename\*\s*=\s*([^;]+)/i.exec(header);
	if (starMatch?.[1]) {
		const cleaned = stripQuotes(starMatch[1].trim());
		const encoded = cleaned.split("''").slice(1).join("''") || cleaned;
		try {
			return path.basename(decodeURIComponent(encoded));
		} catch {
			return path.basename(encoded);
		}
	}
	const match = /filename\s*=\s*([^;]+)/i.exec(header);
	if (match?.[1]) return path.basename(stripQuotes(match[1].trim()));
}
async function readErrorBodySnippet(res, maxChars = 200) {
	try {
		const text = await res.text();
		if (!text) return;
		const collapsed = text.replace(/\s+/g, " ").trim();
		if (!collapsed) return;
		if (collapsed.length <= maxChars) return collapsed;
		return `${collapsed.slice(0, maxChars)}…`;
	} catch {
		return;
	}
}
async function fetchRemoteMedia(options) {
	const { url, fetchImpl, requestInit, filePathHint, maxBytes, maxRedirects, readIdleTimeoutMs, ssrfPolicy, lookupFn } = options;
	let res;
	let finalUrl = url;
	let release = null;
	try {
		const result = await fetchWithSsrFGuard(withStrictGuardedFetchMode({
			url,
			fetchImpl,
			init: requestInit,
			maxRedirects,
			policy: ssrfPolicy,
			lookupFn
		}));
		res = result.response;
		finalUrl = result.finalUrl;
		release = result.release;
	} catch (err) {
		throw new MediaFetchError("fetch_failed", `Failed to fetch media from ${url}: ${String(err)}`);
	}
	try {
		if (!res.ok) {
			const statusText = res.statusText ? ` ${res.statusText}` : "";
			const redirected = finalUrl !== url ? ` (redirected to ${finalUrl})` : "";
			let detail = `HTTP ${res.status}${statusText}`;
			if (!res.body) detail = `HTTP ${res.status}${statusText}; empty response body`;
			else {
				const snippet = await readErrorBodySnippet(res);
				if (snippet) detail += `; body: ${snippet}`;
			}
			throw new MediaFetchError("http_error", `Failed to fetch media from ${url}${redirected}: ${detail}`);
		}
		const contentLength = res.headers.get("content-length");
		if (maxBytes && contentLength) {
			const length = Number(contentLength);
			if (Number.isFinite(length) && length > maxBytes) throw new MediaFetchError("max_bytes", `Failed to fetch media from ${url}: content length ${length} exceeds maxBytes ${maxBytes}`);
		}
		let buffer;
		try {
			buffer = maxBytes ? await readResponseWithLimit(res, maxBytes, {
				onOverflow: ({ maxBytes, res }) => new MediaFetchError("max_bytes", `Failed to fetch media from ${res.url || url}: payload exceeds maxBytes ${maxBytes}`),
				chunkTimeoutMs: readIdleTimeoutMs
			}) : Buffer.from(await res.arrayBuffer());
		} catch (err) {
			if (err instanceof MediaFetchError) throw err;
			throw new MediaFetchError("fetch_failed", `Failed to fetch media from ${res.url || url}: ${String(err)}`);
		}
		let fileNameFromUrl;
		try {
			const parsed = new URL(finalUrl);
			fileNameFromUrl = path.basename(parsed.pathname) || void 0;
		} catch {}
		const headerFileName = parseContentDispositionFileName(res.headers.get("content-disposition"));
		let fileName = headerFileName || fileNameFromUrl || (filePathHint ? path.basename(filePathHint) : void 0);
		const filePathForMime = headerFileName && path.extname(headerFileName) ? headerFileName : filePathHint ?? finalUrl;
		const contentType = await detectMime({
			buffer,
			headerMime: res.headers.get("content-type"),
			filePath: filePathForMime
		});
		if (fileName && !path.extname(fileName) && contentType) {
			const ext = extensionForMime(contentType);
			if (ext) fileName = `${fileName}${ext}`;
		}
		return {
			buffer,
			contentType: contentType ?? void 0,
			fileName
		};
	} finally {
		if (release) await release();
	}
}
//#endregion
//#region src/media/local-roots.ts
let cachedPreferredTmpDir;
function resolveCachedPreferredTmpDir() {
	if (!cachedPreferredTmpDir) cachedPreferredTmpDir = resolvePreferredOpenClawTmpDir();
	return cachedPreferredTmpDir;
}
function buildMediaLocalRoots(stateDir, options = {}) {
	const resolvedStateDir = path.resolve(stateDir);
	return [
		options.preferredTmpDir ?? resolveCachedPreferredTmpDir(),
		path.join(resolvedStateDir, "media"),
		path.join(resolvedStateDir, "agents"),
		path.join(resolvedStateDir, "workspace"),
		path.join(resolvedStateDir, "sandboxes")
	];
}
function getDefaultMediaLocalRoots() {
	return buildMediaLocalRoots(resolveStateDir());
}
//#endregion
//#region src/web/media.ts
function resolveWebMediaOptions(params) {
	if (typeof params.maxBytesOrOptions === "number" || params.maxBytesOrOptions === void 0) return {
		maxBytes: params.maxBytesOrOptions,
		optimizeImages: params.optimizeImages,
		ssrfPolicy: params.options?.ssrfPolicy,
		localRoots: params.options?.localRoots
	};
	return {
		...params.maxBytesOrOptions,
		optimizeImages: params.optimizeImages ? params.maxBytesOrOptions.optimizeImages ?? true : false
	};
}
var LocalMediaAccessError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "LocalMediaAccessError";
	}
};
function getDefaultLocalRoots() {
	return getDefaultMediaLocalRoots();
}
async function assertLocalMediaAllowed(mediaPath, localRoots) {
	if (localRoots === "any") return;
	const roots = localRoots ?? getDefaultLocalRoots();
	let resolved;
	try {
		resolved = await fs.realpath(mediaPath);
	} catch {
		resolved = path.resolve(mediaPath);
	}
	if (localRoots === void 0) {
		const workspaceRoot = roots.find((root) => path.basename(root) === "workspace");
		if (workspaceRoot) {
			const stateDir = path.dirname(workspaceRoot);
			const rel = path.relative(stateDir, resolved);
			if (rel && !rel.startsWith("..") && !path.isAbsolute(rel)) {
				if ((rel.split(path.sep)[0] ?? "").startsWith("workspace-")) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
			}
		}
	}
	for (const root of roots) {
		let resolvedRoot;
		try {
			resolvedRoot = await fs.realpath(root);
		} catch {
			resolvedRoot = path.resolve(root);
		}
		if (resolvedRoot === path.parse(resolvedRoot).root) throw new LocalMediaAccessError("invalid-root", `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`);
		if (resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep)) return;
	}
	throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
}
const HEIC_MIME_RE = /^image\/hei[cf]$/i;
const HEIC_EXT_RE = /\.(heic|heif)$/i;
const MB = 1024 * 1024;
function formatMb(bytes, digits = 2) {
	return (bytes / MB).toFixed(digits);
}
function formatCapLimit(label, cap, size) {
	return `${label} exceeds ${formatMb(cap, 0)}MB limit (got ${formatMb(size)}MB)`;
}
function formatCapReduce(label, cap, size) {
	return `${label} could not be reduced below ${formatMb(cap, 0)}MB (got ${formatMb(size)}MB)`;
}
function isHeicSource(opts) {
	if (opts.contentType && HEIC_MIME_RE.test(opts.contentType.trim())) return true;
	if (opts.fileName && HEIC_EXT_RE.test(opts.fileName.trim())) return true;
	return false;
}
function toJpegFileName(fileName) {
	if (!fileName) return;
	const trimmed = fileName.trim();
	if (!trimmed) return fileName;
	const parsed = path.parse(trimmed);
	if (!parsed.ext || HEIC_EXT_RE.test(parsed.ext)) return path.format({
		dir: parsed.dir,
		name: parsed.name || trimmed,
		ext: ".jpg"
	});
	return path.format({
		dir: parsed.dir,
		name: parsed.name,
		ext: ".jpg"
	});
}
function logOptimizedImage(params) {
	if (!shouldLogVerbose()) return;
	if (params.optimized.optimizedSize >= params.originalSize) return;
	if (params.optimized.format === "png") {
		logVerbose(`Optimized PNG (preserving alpha) from ${formatMb(params.originalSize)}MB to ${formatMb(params.optimized.optimizedSize)}MB (side≤${params.optimized.resizeSide}px)`);
		return;
	}
	logVerbose(`Optimized media from ${formatMb(params.originalSize)}MB to ${formatMb(params.optimized.optimizedSize)}MB (side≤${params.optimized.resizeSide}px, q=${params.optimized.quality})`);
}
async function optimizeImageWithFallback(params) {
	const { buffer, cap, meta } = params;
	if ((meta?.contentType === "image/png" || meta?.fileName?.toLowerCase().endsWith(".png")) && await hasAlphaChannel(buffer)) {
		const optimized = await optimizeImageToPng(buffer, cap);
		if (optimized.buffer.length <= cap) return {
			...optimized,
			format: "png"
		};
		if (shouldLogVerbose()) logVerbose(`PNG with alpha still exceeds ${formatMb(cap, 0)}MB after optimization; falling back to JPEG`);
	}
	return {
		...await optimizeImageToJpeg(buffer, cap, meta),
		format: "jpeg"
	};
}
async function loadWebMediaInternal(mediaUrl, options = {}) {
	const { maxBytes, optimizeImages = true, ssrfPolicy, localRoots, sandboxValidated = false, readFile: readFileOverride } = options;
	mediaUrl = mediaUrl.replace(/^\s*MEDIA\s*:\s*/i, "");
	if (mediaUrl.startsWith("file://")) try {
		mediaUrl = fileURLToPath(mediaUrl);
	} catch {
		throw new LocalMediaAccessError("invalid-file-url", `Invalid file:// URL: ${mediaUrl}`);
	}
	const optimizeAndClampImage = async (buffer, cap, meta) => {
		const originalSize = buffer.length;
		const optimized = await optimizeImageWithFallback({
			buffer,
			cap,
			meta
		});
		logOptimizedImage({
			originalSize,
			optimized
		});
		if (optimized.buffer.length > cap) throw new Error(formatCapReduce("Media", cap, optimized.buffer.length));
		const contentType = optimized.format === "png" ? "image/png" : "image/jpeg";
		const fileName = optimized.format === "jpeg" && meta && isHeicSource(meta) ? toJpegFileName(meta.fileName) : meta?.fileName;
		return {
			buffer: optimized.buffer,
			contentType,
			kind: "image",
			fileName
		};
	};
	const clampAndFinalize = async (params) => {
		const cap = maxBytes !== void 0 ? maxBytes : maxBytesForKind(params.kind ?? "document");
		if (params.kind === "image") {
			const isGif = params.contentType === "image/gif";
			if (isGif || !optimizeImages) {
				if (params.buffer.length > cap) throw new Error(formatCapLimit(isGif ? "GIF" : "Media", cap, params.buffer.length));
				return {
					buffer: params.buffer,
					contentType: params.contentType,
					kind: params.kind,
					fileName: params.fileName
				};
			}
			return { ...await optimizeAndClampImage(params.buffer, cap, {
				contentType: params.contentType,
				fileName: params.fileName
			}) };
		}
		if (params.buffer.length > cap) throw new Error(formatCapLimit("Media", cap, params.buffer.length));
		return {
			buffer: params.buffer,
			contentType: params.contentType ?? void 0,
			kind: params.kind,
			fileName: params.fileName
		};
	};
	if (/^https?:\/\//i.test(mediaUrl)) {
		const defaultFetchCap = maxBytesForKind("document");
		const { buffer, contentType, fileName } = await fetchRemoteMedia({
			url: mediaUrl,
			maxBytes: maxBytes === void 0 ? defaultFetchCap : optimizeImages ? Math.max(maxBytes, defaultFetchCap) : maxBytes,
			ssrfPolicy
		});
		return await clampAndFinalize({
			buffer,
			contentType,
			kind: kindFromMime(contentType),
			fileName
		});
	}
	if (mediaUrl.startsWith("~")) mediaUrl = resolveUserPath(mediaUrl);
	if ((sandboxValidated || localRoots === "any") && !readFileOverride) throw new LocalMediaAccessError("unsafe-bypass", "Refusing localRoots bypass without readFile override. Use sandboxValidated with readFile, or pass explicit localRoots.");
	if (!(sandboxValidated || localRoots === "any")) await assertLocalMediaAllowed(mediaUrl, localRoots);
	let data;
	if (readFileOverride) data = await readFileOverride(mediaUrl);
	else try {
		data = (await readLocalFileSafely({ filePath: mediaUrl })).buffer;
	} catch (err) {
		if (err instanceof SafeOpenError) {
			if (err.code === "not-found") throw new LocalMediaAccessError("not-found", `Local media file not found: ${mediaUrl}`, { cause: err });
			if (err.code === "not-file") throw new LocalMediaAccessError("not-file", `Local media path is not a file: ${mediaUrl}`, { cause: err });
			throw new LocalMediaAccessError("invalid-path", `Local media path is not safe to read: ${mediaUrl}`, { cause: err });
		}
		throw err;
	}
	const mime = await detectMime({
		buffer: data,
		filePath: mediaUrl
	});
	const kind = kindFromMime(mime);
	let fileName = path.basename(mediaUrl) || void 0;
	if (fileName && !path.extname(fileName) && mime) {
		const ext = extensionForMime(mime);
		if (ext) fileName = `${fileName}${ext}`;
	}
	return await clampAndFinalize({
		buffer: data,
		contentType: mime,
		kind,
		fileName
	});
}
async function loadWebMedia(mediaUrl, maxBytesOrOptions, options) {
	return await loadWebMediaInternal(mediaUrl, resolveWebMediaOptions({
		maxBytesOrOptions,
		options,
		optimizeImages: true
	}));
}
async function loadWebMediaRaw(mediaUrl, maxBytesOrOptions, options) {
	return await loadWebMediaInternal(mediaUrl, resolveWebMediaOptions({
		maxBytesOrOptions,
		options,
		optimizeImages: false
	}));
}
async function optimizeImageToJpeg(buffer, maxBytes, opts = {}) {
	let source = buffer;
	if (isHeicSource(opts)) try {
		source = await convertHeicToJpeg(buffer);
	} catch (err) {
		throw new Error(`HEIC image conversion failed: ${String(err)}`, { cause: err });
	}
	const sides = [
		2048,
		1536,
		1280,
		1024,
		800
	];
	const qualities = [
		80,
		70,
		60,
		50,
		40
	];
	let smallest = null;
	for (const side of sides) for (const quality of qualities) try {
		const out = await resizeToJpeg({
			buffer: source,
			maxSide: side,
			quality,
			withoutEnlargement: true
		});
		const size = out.length;
		if (!smallest || size < smallest.size) smallest = {
			buffer: out,
			size,
			resizeSide: side,
			quality
		};
		if (size <= maxBytes) return {
			buffer: out,
			optimizedSize: size,
			resizeSide: side,
			quality
		};
	} catch {}
	if (smallest) return {
		buffer: smallest.buffer,
		optimizedSize: smallest.size,
		resizeSide: smallest.resizeSide,
		quality: smallest.quality
	};
	throw new Error("Failed to optimize image");
}
//#endregion
//#region src/markdown/fences.ts
function parseFenceSpans(buffer) {
	const spans = [];
	let open;
	let offset = 0;
	while (offset <= buffer.length) {
		const nextNewline = buffer.indexOf("\n", offset);
		const lineEnd = nextNewline === -1 ? buffer.length : nextNewline;
		const line = buffer.slice(offset, lineEnd);
		const match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
		if (match) {
			const indent = match[1];
			const marker = match[2];
			const markerChar = marker[0];
			const markerLen = marker.length;
			if (!open) open = {
				start: offset,
				markerChar,
				markerLen,
				openLine: line,
				marker,
				indent
			};
			else if (open.markerChar === markerChar && markerLen >= open.markerLen) {
				const end = lineEnd;
				spans.push({
					start: open.start,
					end,
					openLine: open.openLine,
					marker: open.marker,
					indent: open.indent
				});
				open = void 0;
			}
		}
		if (nextNewline === -1) break;
		offset = nextNewline + 1;
	}
	if (open) spans.push({
		start: open.start,
		end: buffer.length,
		openLine: open.openLine,
		marker: open.marker,
		indent: open.indent
	});
	return spans;
}
function findFenceSpanAt(spans, index) {
	let low = 0;
	let high = spans.length - 1;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const span = spans[mid];
		if (!span) break;
		if (index <= span.start) {
			high = mid - 1;
			continue;
		}
		if (index >= span.end) {
			low = mid + 1;
			continue;
		}
		return span;
	}
}
function isSafeFenceBreak(spans, index) {
	return !findFenceSpanAt(spans, index);
}
//#endregion
//#region src/shared/text-chunking.ts
function chunkTextByBreakResolver(text, limit, resolveBreakIndex) {
	if (!text) return [];
	if (limit <= 0 || text.length <= limit) return [text];
	const chunks = [];
	let remaining = text;
	while (remaining.length > limit) {
		const candidateBreak = resolveBreakIndex(remaining.slice(0, limit));
		const breakIdx = Number.isFinite(candidateBreak) && candidateBreak > 0 && candidateBreak <= limit ? candidateBreak : limit;
		const chunk = remaining.slice(0, breakIdx).trimEnd();
		if (chunk.length > 0) chunks.push(chunk);
		const brokeOnSeparator = breakIdx < remaining.length && /\s/.test(remaining[breakIdx]);
		const nextStart = Math.min(remaining.length, breakIdx + (brokeOnSeparator ? 1 : 0));
		remaining = remaining.slice(nextStart).trimStart();
	}
	if (remaining.length) chunks.push(remaining);
	return chunks;
}
//#endregion
//#region src/auto-reply/chunk.ts
const DEFAULT_CHUNK_MODE = "length";
function resolveChunkModeForProvider(cfgSection, accountId) {
	if (!cfgSection) return;
	const normalizedAccountId = normalizeAccountId(accountId);
	const accounts = cfgSection.accounts;
	if (accounts && typeof accounts === "object") {
		const direct = resolveAccountEntry(accounts, normalizedAccountId);
		if (direct?.chunkMode) return direct.chunkMode;
	}
	return cfgSection.chunkMode;
}
function resolveChunkMode(cfg, provider, accountId) {
	if (!provider || provider === "webchat") return DEFAULT_CHUNK_MODE;
	return resolveChunkModeForProvider((cfg?.channels)?.[provider] ?? cfg?.[provider], accountId) ?? DEFAULT_CHUNK_MODE;
}
/**
* Split text into chunks on paragraph boundaries (blank lines), preserving lists and
* single-newline line wraps inside paragraphs.
*
* - Only breaks at paragraph separators ("\n\n" or more, allowing whitespace on blank lines)
* - Packs multiple paragraphs into a single chunk up to `limit`
* - Falls back to length-based splitting when a single paragraph exceeds `limit`
*   (unless `splitLongParagraphs` is disabled)
*/
function chunkByParagraph(text, limit, opts) {
	if (!text) return [];
	if (limit <= 0) return [text];
	const splitLongParagraphs = opts?.splitLongParagraphs !== false;
	const normalized = text.replace(/\r\n?/g, "\n");
	if (!/\n[\t ]*\n+/.test(normalized)) {
		if (normalized.length <= limit) return [normalized];
		if (!splitLongParagraphs) return [normalized];
		return chunkText(normalized, limit);
	}
	const spans = parseFenceSpans(normalized);
	const parts = [];
	const re = /\n[\t ]*\n+/g;
	let lastIndex = 0;
	for (const match of normalized.matchAll(re)) {
		const idx = match.index ?? 0;
		if (!isSafeFenceBreak(spans, idx)) continue;
		parts.push(normalized.slice(lastIndex, idx));
		lastIndex = idx + match[0].length;
	}
	parts.push(normalized.slice(lastIndex));
	const chunks = [];
	for (const part of parts) {
		const paragraph = part.replace(/\s+$/g, "");
		if (!paragraph.trim()) continue;
		if (paragraph.length <= limit) chunks.push(paragraph);
		else if (!splitLongParagraphs) chunks.push(paragraph);
		else chunks.push(...chunkText(paragraph, limit));
	}
	return chunks;
}
function chunkMarkdownTextWithMode(text, limit, mode) {
	if (mode === "newline") {
		const paragraphChunks = chunkByParagraph(text, limit, { splitLongParagraphs: false });
		const out = [];
		for (const chunk of paragraphChunks) {
			const nested = chunkMarkdownText(chunk, limit);
			if (!nested.length && chunk) out.push(chunk);
			else out.push(...nested);
		}
		return out;
	}
	return chunkMarkdownText(text, limit);
}
function resolveChunkEarlyReturn(text, limit) {
	if (!text) return [];
	if (limit <= 0) return [text];
	if (text.length <= limit) return [text];
}
function chunkText(text, limit) {
	const early = resolveChunkEarlyReturn(text, limit);
	if (early) return early;
	return chunkTextByBreakResolver(text, limit, (window) => {
		const { lastNewline, lastWhitespace } = scanParenAwareBreakpoints(window, 0, window.length);
		return lastNewline > 0 ? lastNewline : lastWhitespace;
	});
}
function chunkMarkdownText(text, limit) {
	const early = resolveChunkEarlyReturn(text, limit);
	if (early) return early;
	const chunks = [];
	const spans = parseFenceSpans(text);
	let start = 0;
	let reopenFence;
	while (start < text.length) {
		const reopenPrefix = reopenFence ? `${reopenFence.openLine}\n` : "";
		const contentLimit = Math.max(1, limit - reopenPrefix.length);
		if (text.length - start <= contentLimit) {
			const finalChunk = `${reopenPrefix}${text.slice(start)}`;
			if (finalChunk.length > 0) chunks.push(finalChunk);
			break;
		}
		const windowEnd = Math.min(text.length, start + contentLimit);
		const softBreak = pickSafeBreakIndex(text, start, windowEnd, spans);
		let breakIdx = softBreak > start ? softBreak : windowEnd;
		const initialFence = isSafeFenceBreak(spans, breakIdx) ? void 0 : findFenceSpanAt(spans, breakIdx);
		let fenceToSplit = initialFence;
		if (initialFence) {
			const closeLine = `${initialFence.indent}${initialFence.marker}`;
			const maxIdxIfNeedNewline = start + (contentLimit - (closeLine.length + 1));
			if (maxIdxIfNeedNewline <= start) {
				fenceToSplit = void 0;
				breakIdx = windowEnd;
			} else {
				const minProgressIdx = Math.min(text.length, Math.max(start + 1, initialFence.start + initialFence.openLine.length + 2));
				const maxIdxIfAlreadyNewline = start + (contentLimit - closeLine.length);
				let pickedNewline = false;
				let lastNewline = text.lastIndexOf("\n", Math.max(start, maxIdxIfAlreadyNewline - 1));
				while (lastNewline >= start) {
					const candidateBreak = lastNewline + 1;
					if (candidateBreak < minProgressIdx) break;
					const candidateFence = findFenceSpanAt(spans, candidateBreak);
					if (candidateFence && candidateFence.start === initialFence.start) {
						breakIdx = candidateBreak;
						pickedNewline = true;
						break;
					}
					lastNewline = text.lastIndexOf("\n", lastNewline - 1);
				}
				if (!pickedNewline) if (minProgressIdx > maxIdxIfAlreadyNewline) {
					fenceToSplit = void 0;
					breakIdx = windowEnd;
				} else breakIdx = Math.max(minProgressIdx, maxIdxIfNeedNewline);
			}
			const fenceAtBreak = findFenceSpanAt(spans, breakIdx);
			fenceToSplit = fenceAtBreak && fenceAtBreak.start === initialFence.start ? fenceAtBreak : void 0;
		}
		const rawContent = text.slice(start, breakIdx);
		if (!rawContent) break;
		let rawChunk = `${reopenPrefix}${rawContent}`;
		const brokeOnSeparator = breakIdx < text.length && /\s/.test(text[breakIdx]);
		let nextStart = Math.min(text.length, breakIdx + (brokeOnSeparator ? 1 : 0));
		if (fenceToSplit) {
			const closeLine = `${fenceToSplit.indent}${fenceToSplit.marker}`;
			rawChunk = rawChunk.endsWith("\n") ? `${rawChunk}${closeLine}` : `${rawChunk}\n${closeLine}`;
			reopenFence = fenceToSplit;
		} else {
			nextStart = skipLeadingNewlines(text, nextStart);
			reopenFence = void 0;
		}
		chunks.push(rawChunk);
		start = nextStart;
	}
	return chunks;
}
function skipLeadingNewlines(value, start = 0) {
	let i = start;
	while (i < value.length && value[i] === "\n") i++;
	return i;
}
function pickSafeBreakIndex(text, start, end, spans) {
	const { lastNewline, lastWhitespace } = scanParenAwareBreakpoints(text, start, end, (index) => isSafeFenceBreak(spans, index));
	if (lastNewline > start) return lastNewline;
	if (lastWhitespace > start) return lastWhitespace;
	return -1;
}
function scanParenAwareBreakpoints(text, start, end, isAllowed = () => true) {
	let lastNewline = -1;
	let lastWhitespace = -1;
	let depth = 0;
	for (let i = start; i < end; i++) {
		if (!isAllowed(i)) continue;
		const char = text[i];
		if (char === "(") {
			depth += 1;
			continue;
		}
		if (char === ")" && depth > 0) {
			depth -= 1;
			continue;
		}
		if (depth !== 0) continue;
		if (char === "\n") lastNewline = i;
		else if (/\s/.test(char)) lastWhitespace = i;
	}
	return {
		lastNewline,
		lastWhitespace
	};
}
//#endregion
//#region src/infra/retry-policy.ts
const DISCORD_RETRY_DEFAULTS = {
	attempts: 3,
	minDelayMs: 500,
	maxDelayMs: 3e4,
	jitter: .1
};
const TELEGRAM_RETRY_DEFAULTS = {
	attempts: 3,
	minDelayMs: 400,
	maxDelayMs: 3e4,
	jitter: .1
};
const TELEGRAM_RETRY_RE = /429|timeout|connect|reset|closed|unavailable|temporarily/i;
const log = createSubsystemLogger("retry-policy");
function resolveTelegramShouldRetry(params) {
	if (!params.shouldRetry) return (err) => TELEGRAM_RETRY_RE.test(formatErrorMessage(err));
	if (params.strictShouldRetry) return params.shouldRetry;
	return (err) => params.shouldRetry?.(err) || TELEGRAM_RETRY_RE.test(formatErrorMessage(err));
}
function getTelegramRetryAfterMs(err) {
	if (!err || typeof err !== "object") return;
	const candidate = "parameters" in err && err.parameters && typeof err.parameters === "object" ? err.parameters.retry_after : "response" in err && err.response && typeof err.response === "object" && "parameters" in err.response ? err.response.parameters?.retry_after : "error" in err && err.error && typeof err.error === "object" && "parameters" in err.error ? err.error.parameters?.retry_after : void 0;
	return typeof candidate === "number" && Number.isFinite(candidate) ? candidate * 1e3 : void 0;
}
function createDiscordRetryRunner(params) {
	const retryConfig = resolveRetryConfig(DISCORD_RETRY_DEFAULTS, {
		...params.configRetry,
		...params.retry
	});
	return (fn, label) => retryAsync(fn, {
		...retryConfig,
		label,
		shouldRetry: (err) => err instanceof RateLimitError,
		retryAfterMs: (err) => err instanceof RateLimitError ? err.retryAfter * 1e3 : void 0,
		onRetry: params.verbose ? (info) => {
			const labelText = info.label ?? "request";
			const maxRetries = Math.max(1, info.maxAttempts - 1);
			log.warn(`discord ${labelText} rate limited, retry ${info.attempt}/${maxRetries} in ${info.delayMs}ms`);
		} : void 0
	});
}
function createTelegramRetryRunner(params) {
	const retryConfig = resolveRetryConfig(TELEGRAM_RETRY_DEFAULTS, {
		...params.configRetry,
		...params.retry
	});
	const shouldRetry = resolveTelegramShouldRetry(params);
	return (fn, label) => retryAsync(fn, {
		...retryConfig,
		label,
		shouldRetry,
		retryAfterMs: getTelegramRetryAfterMs,
		onRetry: params.verbose ? (info) => {
			const maxRetries = Math.max(1, info.maxAttempts - 1);
			log.warn(`telegram send retry ${info.attempt}/${maxRetries} for ${info.label ?? label ?? "request"} in ${info.delayMs}ms: ${formatErrorMessage(info.err)}`);
		} : void 0
	});
}
//#endregion
//#region src/config/markdown-tables.ts
const DEFAULT_TABLE_MODES = new Map([
	["signal", "bullets"],
	["whatsapp", "bullets"],
	["mattermost", "off"]
]);
const isMarkdownTableMode = (value) => value === "off" || value === "bullets" || value === "code";
function resolveMarkdownModeFromSection(section, accountId) {
	if (!section) return;
	const normalizedAccountId = normalizeAccountId(accountId);
	const accounts = section.accounts;
	if (accounts && typeof accounts === "object") {
		const matchMode = resolveAccountEntry(accounts, normalizedAccountId)?.markdown?.tables;
		if (isMarkdownTableMode(matchMode)) return matchMode;
	}
	const sectionMode = section.markdown?.tables;
	return isMarkdownTableMode(sectionMode) ? sectionMode : void 0;
}
function resolveMarkdownTableMode(params) {
	const channel = normalizeChannelId(params.channel);
	const defaultMode = channel ? DEFAULT_TABLE_MODES.get(channel) ?? "code" : "code";
	if (!channel || !params.cfg) return defaultMode;
	return resolveMarkdownModeFromSection(params.cfg.channels?.[channel] ?? params.cfg?.[channel], params.accountId) ?? defaultMode;
}
//#endregion
//#region src/markdown/ir.ts
function createMarkdownIt(options) {
	const md = new MarkdownIt({
		html: false,
		linkify: options.linkify ?? true,
		breaks: false,
		typographer: false
	});
	md.enable("strikethrough");
	if (options.tableMode && options.tableMode !== "off") md.enable("table");
	else md.disable("table");
	if (options.autolink === false) md.disable("autolink");
	return md;
}
function getAttr(token, name) {
	if (token.attrGet) return token.attrGet(name);
	if (token.attrs) {
		for (const [key, value] of token.attrs) if (key === name) return value;
	}
	return null;
}
function createTextToken(base, content) {
	return {
		...base,
		type: "text",
		content,
		children: void 0
	};
}
function applySpoilerTokens(tokens) {
	for (const token of tokens) if (token.children && token.children.length > 0) token.children = injectSpoilersIntoInline(token.children);
}
function injectSpoilersIntoInline(tokens) {
	let totalDelims = 0;
	for (const token of tokens) {
		if (token.type !== "text") continue;
		const content = token.content ?? "";
		let i = 0;
		while (i < content.length) {
			const next = content.indexOf("||", i);
			if (next === -1) break;
			totalDelims += 1;
			i = next + 2;
		}
	}
	if (totalDelims < 2) return tokens;
	const usableDelims = totalDelims - totalDelims % 2;
	const result = [];
	const state = { spoilerOpen: false };
	let consumedDelims = 0;
	for (const token of tokens) {
		if (token.type !== "text") {
			result.push(token);
			continue;
		}
		const content = token.content ?? "";
		if (!content.includes("||")) {
			result.push(token);
			continue;
		}
		let index = 0;
		while (index < content.length) {
			const next = content.indexOf("||", index);
			if (next === -1) {
				if (index < content.length) result.push(createTextToken(token, content.slice(index)));
				break;
			}
			if (consumedDelims >= usableDelims) {
				result.push(createTextToken(token, content.slice(index)));
				break;
			}
			if (next > index) result.push(createTextToken(token, content.slice(index, next)));
			consumedDelims += 1;
			state.spoilerOpen = !state.spoilerOpen;
			result.push({ type: state.spoilerOpen ? "spoiler_open" : "spoiler_close" });
			index = next + 2;
		}
	}
	return result;
}
function initRenderTarget() {
	return {
		text: "",
		styles: [],
		openStyles: [],
		links: [],
		linkStack: []
	};
}
function resolveRenderTarget(state) {
	return state.table?.currentCell ?? state;
}
function appendText(state, value) {
	if (!value) return;
	const target = resolveRenderTarget(state);
	target.text += value;
}
function openStyle(state, style) {
	const target = resolveRenderTarget(state);
	target.openStyles.push({
		style,
		start: target.text.length
	});
}
function closeStyle(state, style) {
	const target = resolveRenderTarget(state);
	for (let i = target.openStyles.length - 1; i >= 0; i -= 1) if (target.openStyles[i]?.style === style) {
		const start = target.openStyles[i].start;
		target.openStyles.splice(i, 1);
		const end = target.text.length;
		if (end > start) target.styles.push({
			start,
			end,
			style
		});
		return;
	}
}
function appendParagraphSeparator(state) {
	if (state.env.listStack.length > 0) return;
	if (state.table) return;
	state.text += "\n\n";
}
function appendListPrefix(state) {
	const stack = state.env.listStack;
	const top = stack[stack.length - 1];
	if (!top) return;
	top.index += 1;
	const indent = "  ".repeat(Math.max(0, stack.length - 1));
	const prefix = top.type === "ordered" ? `${top.index}. ` : "• ";
	state.text += `${indent}${prefix}`;
}
function renderInlineCode(state, content) {
	if (!content) return;
	const target = resolveRenderTarget(state);
	const start = target.text.length;
	target.text += content;
	target.styles.push({
		start,
		end: start + content.length,
		style: "code"
	});
}
function renderCodeBlock(state, content) {
	let code = content ?? "";
	if (!code.endsWith("\n")) code = `${code}\n`;
	const target = resolveRenderTarget(state);
	const start = target.text.length;
	target.text += code;
	target.styles.push({
		start,
		end: start + code.length,
		style: "code_block"
	});
	if (state.env.listStack.length === 0) target.text += "\n";
}
function handleLinkClose(state) {
	const target = resolveRenderTarget(state);
	const link = target.linkStack.pop();
	if (!link?.href) return;
	const href = link.href.trim();
	if (!href) return;
	const start = link.labelStart;
	const end = target.text.length;
	if (end <= start) {
		target.links.push({
			start,
			end,
			href
		});
		return;
	}
	target.links.push({
		start,
		end,
		href
	});
}
function initTableState() {
	return {
		headers: [],
		rows: [],
		currentRow: [],
		currentCell: null,
		inHeader: false
	};
}
function finishTableCell(cell) {
	closeRemainingStyles(cell);
	return {
		text: cell.text,
		styles: cell.styles,
		links: cell.links
	};
}
function trimCell(cell) {
	const text = cell.text;
	let start = 0;
	let end = text.length;
	while (start < end && /\s/.test(text[start] ?? "")) start += 1;
	while (end > start && /\s/.test(text[end - 1] ?? "")) end -= 1;
	if (start === 0 && end === text.length) return cell;
	const trimmedText = text.slice(start, end);
	const trimmedLength = trimmedText.length;
	const trimmedStyles = [];
	for (const span of cell.styles) {
		const sliceStart = Math.max(0, span.start - start);
		const sliceEnd = Math.min(trimmedLength, span.end - start);
		if (sliceEnd > sliceStart) trimmedStyles.push({
			start: sliceStart,
			end: sliceEnd,
			style: span.style
		});
	}
	const trimmedLinks = [];
	for (const span of cell.links) {
		const sliceStart = Math.max(0, span.start - start);
		const sliceEnd = Math.min(trimmedLength, span.end - start);
		if (sliceEnd > sliceStart) trimmedLinks.push({
			start: sliceStart,
			end: sliceEnd,
			href: span.href
		});
	}
	return {
		text: trimmedText,
		styles: trimmedStyles,
		links: trimmedLinks
	};
}
function appendCell(state, cell) {
	if (!cell.text) return;
	const start = state.text.length;
	state.text += cell.text;
	for (const span of cell.styles) state.styles.push({
		start: start + span.start,
		end: start + span.end,
		style: span.style
	});
	for (const link of cell.links) state.links.push({
		start: start + link.start,
		end: start + link.end,
		href: link.href
	});
}
function appendCellTextOnly(state, cell) {
	if (!cell.text) return;
	state.text += cell.text;
}
function appendTableBulletValue(state, params) {
	const { header, value, columnIndex, includeColumnFallback } = params;
	if (!value?.text) return;
	state.text += "• ";
	if (header?.text) {
		appendCell(state, header);
		state.text += ": ";
	} else if (includeColumnFallback) state.text += `Column ${columnIndex}: `;
	appendCell(state, value);
	state.text += "\n";
}
function renderTableAsBullets(state) {
	if (!state.table) return;
	const headers = state.table.headers.map(trimCell);
	const rows = state.table.rows.map((row) => row.map(trimCell));
	if (headers.length === 0 && rows.length === 0) return;
	if (headers.length > 1 && rows.length > 0) for (const row of rows) {
		if (row.length === 0) continue;
		const rowLabel = row[0];
		if (rowLabel?.text) {
			const labelStart = state.text.length;
			appendCell(state, rowLabel);
			const labelEnd = state.text.length;
			if (labelEnd > labelStart) state.styles.push({
				start: labelStart,
				end: labelEnd,
				style: "bold"
			});
			state.text += "\n";
		}
		for (let i = 1; i < row.length; i++) appendTableBulletValue(state, {
			header: headers[i],
			value: row[i],
			columnIndex: i,
			includeColumnFallback: true
		});
		state.text += "\n";
	}
	else for (const row of rows) {
		for (let i = 0; i < row.length; i++) appendTableBulletValue(state, {
			header: headers[i],
			value: row[i],
			columnIndex: i,
			includeColumnFallback: false
		});
		state.text += "\n";
	}
}
function renderTableAsCode(state) {
	if (!state.table) return;
	const headers = state.table.headers.map(trimCell);
	const rows = state.table.rows.map((row) => row.map(trimCell));
	const columnCount = Math.max(headers.length, ...rows.map((row) => row.length));
	if (columnCount === 0) return;
	const widths = Array.from({ length: columnCount }, () => 0);
	const updateWidths = (cells) => {
		for (let i = 0; i < columnCount; i += 1) {
			const width = cells[i]?.text.length ?? 0;
			if (widths[i] < width) widths[i] = width;
		}
	};
	updateWidths(headers);
	for (const row of rows) updateWidths(row);
	const codeStart = state.text.length;
	const appendRow = (cells) => {
		state.text += "|";
		for (let i = 0; i < columnCount; i += 1) {
			state.text += " ";
			const cell = cells[i];
			if (cell) appendCellTextOnly(state, cell);
			const pad = widths[i] - (cell?.text.length ?? 0);
			if (pad > 0) state.text += " ".repeat(pad);
			state.text += " |";
		}
		state.text += "\n";
	};
	const appendDivider = () => {
		state.text += "|";
		for (let i = 0; i < columnCount; i += 1) {
			const dashCount = Math.max(3, widths[i]);
			state.text += ` ${"-".repeat(dashCount)} |`;
		}
		state.text += "\n";
	};
	appendRow(headers);
	appendDivider();
	for (const row of rows) appendRow(row);
	const codeEnd = state.text.length;
	if (codeEnd > codeStart) state.styles.push({
		start: codeStart,
		end: codeEnd,
		style: "code_block"
	});
	if (state.env.listStack.length === 0) state.text += "\n";
}
function renderTokens(tokens, state) {
	for (const token of tokens) switch (token.type) {
		case "inline":
			if (token.children) renderTokens(token.children, state);
			break;
		case "text":
			appendText(state, token.content ?? "");
			break;
		case "em_open":
			openStyle(state, "italic");
			break;
		case "em_close":
			closeStyle(state, "italic");
			break;
		case "strong_open":
			openStyle(state, "bold");
			break;
		case "strong_close":
			closeStyle(state, "bold");
			break;
		case "s_open":
			openStyle(state, "strikethrough");
			break;
		case "s_close":
			closeStyle(state, "strikethrough");
			break;
		case "code_inline":
			renderInlineCode(state, token.content ?? "");
			break;
		case "spoiler_open":
			if (state.enableSpoilers) openStyle(state, "spoiler");
			break;
		case "spoiler_close":
			if (state.enableSpoilers) closeStyle(state, "spoiler");
			break;
		case "link_open": {
			const href = getAttr(token, "href") ?? "";
			const target = resolveRenderTarget(state);
			target.linkStack.push({
				href,
				labelStart: target.text.length
			});
			break;
		}
		case "link_close":
			handleLinkClose(state);
			break;
		case "image":
			appendText(state, token.content ?? "");
			break;
		case "softbreak":
		case "hardbreak":
			appendText(state, "\n");
			break;
		case "paragraph_close":
			appendParagraphSeparator(state);
			break;
		case "heading_open":
			if (state.headingStyle === "bold") openStyle(state, "bold");
			break;
		case "heading_close":
			if (state.headingStyle === "bold") closeStyle(state, "bold");
			appendParagraphSeparator(state);
			break;
		case "blockquote_open":
			if (state.blockquotePrefix) state.text += state.blockquotePrefix;
			openStyle(state, "blockquote");
			break;
		case "blockquote_close":
			closeStyle(state, "blockquote");
			break;
		case "bullet_list_open":
			if (state.env.listStack.length > 0) state.text += "\n";
			state.env.listStack.push({
				type: "bullet",
				index: 0
			});
			break;
		case "bullet_list_close":
			state.env.listStack.pop();
			if (state.env.listStack.length === 0) state.text += "\n";
			break;
		case "ordered_list_open": {
			if (state.env.listStack.length > 0) state.text += "\n";
			const start = Number(getAttr(token, "start") ?? "1");
			state.env.listStack.push({
				type: "ordered",
				index: start - 1
			});
			break;
		}
		case "ordered_list_close":
			state.env.listStack.pop();
			if (state.env.listStack.length === 0) state.text += "\n";
			break;
		case "list_item_open":
			appendListPrefix(state);
			break;
		case "list_item_close":
			if (!state.text.endsWith("\n")) state.text += "\n";
			break;
		case "code_block":
		case "fence":
			renderCodeBlock(state, token.content ?? "");
			break;
		case "html_block":
		case "html_inline":
			appendText(state, token.content ?? "");
			break;
		case "table_open":
			if (state.tableMode !== "off") {
				state.table = initTableState();
				state.hasTables = true;
			}
			break;
		case "table_close":
			if (state.table) {
				if (state.tableMode === "bullets") renderTableAsBullets(state);
				else if (state.tableMode === "code") renderTableAsCode(state);
			}
			state.table = null;
			break;
		case "thead_open":
			if (state.table) state.table.inHeader = true;
			break;
		case "thead_close":
			if (state.table) state.table.inHeader = false;
			break;
		case "tbody_open":
		case "tbody_close": break;
		case "tr_open":
			if (state.table) state.table.currentRow = [];
			break;
		case "tr_close":
			if (state.table) {
				if (state.table.inHeader) state.table.headers = state.table.currentRow;
				else state.table.rows.push(state.table.currentRow);
				state.table.currentRow = [];
			}
			break;
		case "th_open":
		case "td_open":
			if (state.table) state.table.currentCell = initRenderTarget();
			break;
		case "th_close":
		case "td_close":
			if (state.table?.currentCell) {
				state.table.currentRow.push(finishTableCell(state.table.currentCell));
				state.table.currentCell = null;
			}
			break;
		case "hr":
			state.text += "───\n\n";
			break;
		default:
			if (token.children) renderTokens(token.children, state);
			break;
	}
}
function closeRemainingStyles(target) {
	for (let i = target.openStyles.length - 1; i >= 0; i -= 1) {
		const open = target.openStyles[i];
		const end = target.text.length;
		if (end > open.start) target.styles.push({
			start: open.start,
			end,
			style: open.style
		});
	}
	target.openStyles = [];
}
function clampStyleSpans(spans, maxLength) {
	const clamped = [];
	for (const span of spans) {
		const start = Math.max(0, Math.min(span.start, maxLength));
		const end = Math.max(start, Math.min(span.end, maxLength));
		if (end > start) clamped.push({
			start,
			end,
			style: span.style
		});
	}
	return clamped;
}
function clampLinkSpans(spans, maxLength) {
	const clamped = [];
	for (const span of spans) {
		const start = Math.max(0, Math.min(span.start, maxLength));
		const end = Math.max(start, Math.min(span.end, maxLength));
		if (end > start) clamped.push({
			start,
			end,
			href: span.href
		});
	}
	return clamped;
}
function mergeStyleSpans(spans) {
	const sorted = [...spans].toSorted((a, b) => {
		if (a.start !== b.start) return a.start - b.start;
		if (a.end !== b.end) return a.end - b.end;
		return a.style.localeCompare(b.style);
	});
	const merged = [];
	for (const span of sorted) {
		const prev = merged[merged.length - 1];
		if (prev && prev.style === span.style && (span.start < prev.end || span.start === prev.end && span.style !== "blockquote")) {
			prev.end = Math.max(prev.end, span.end);
			continue;
		}
		merged.push({ ...span });
	}
	return merged;
}
function markdownToIR(markdown, options = {}) {
	return markdownToIRWithMeta(markdown, options).ir;
}
function markdownToIRWithMeta(markdown, options = {}) {
	const env = { listStack: [] };
	const tokens = createMarkdownIt(options).parse(markdown ?? "", env);
	if (options.enableSpoilers) applySpoilerTokens(tokens);
	const tableMode = options.tableMode ?? "off";
	const state = {
		text: "",
		styles: [],
		openStyles: [],
		links: [],
		linkStack: [],
		env,
		headingStyle: options.headingStyle ?? "none",
		blockquotePrefix: options.blockquotePrefix ?? "",
		enableSpoilers: options.enableSpoilers ?? false,
		tableMode,
		table: null,
		hasTables: false
	};
	renderTokens(tokens, state);
	closeRemainingStyles(state);
	const trimmedLength = state.text.trimEnd().length;
	let codeBlockEnd = 0;
	for (const span of state.styles) {
		if (span.style !== "code_block") continue;
		if (span.end > codeBlockEnd) codeBlockEnd = span.end;
	}
	const finalLength = Math.max(trimmedLength, codeBlockEnd);
	return {
		ir: {
			text: finalLength === state.text.length ? state.text : state.text.slice(0, finalLength),
			styles: mergeStyleSpans(clampStyleSpans(state.styles, finalLength)),
			links: clampLinkSpans(state.links, finalLength)
		},
		hasTables: state.hasTables
	};
}
//#endregion
//#region src/markdown/render.ts
const STYLE_RANK = new Map([
	"blockquote",
	"code_block",
	"code",
	"bold",
	"italic",
	"strikethrough",
	"spoiler"
].map((style, index) => [style, index]));
function sortStyleSpans(spans) {
	return [...spans].toSorted((a, b) => {
		if (a.start !== b.start) return a.start - b.start;
		if (a.end !== b.end) return b.end - a.end;
		return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
	});
}
function renderMarkdownWithMarkers(ir, options) {
	const text = ir.text ?? "";
	if (!text) return "";
	const styleMarkers = options.styleMarkers;
	const styled = sortStyleSpans(ir.styles.filter((span) => Boolean(styleMarkers[span.style])));
	const boundaries = /* @__PURE__ */ new Set();
	boundaries.add(0);
	boundaries.add(text.length);
	const startsAt = /* @__PURE__ */ new Map();
	for (const span of styled) {
		if (span.start === span.end) continue;
		boundaries.add(span.start);
		boundaries.add(span.end);
		const bucket = startsAt.get(span.start);
		if (bucket) bucket.push(span);
		else startsAt.set(span.start, [span]);
	}
	for (const spans of startsAt.values()) spans.sort((a, b) => {
		if (a.end !== b.end) return b.end - a.end;
		return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
	});
	const linkStarts = /* @__PURE__ */ new Map();
	if (options.buildLink) for (const link of ir.links) {
		if (link.start === link.end) continue;
		const rendered = options.buildLink(link, text);
		if (!rendered) continue;
		boundaries.add(rendered.start);
		boundaries.add(rendered.end);
		const openBucket = linkStarts.get(rendered.start);
		if (openBucket) openBucket.push(rendered);
		else linkStarts.set(rendered.start, [rendered]);
	}
	const points = [...boundaries].toSorted((a, b) => a - b);
	const stack = [];
	let out = "";
	for (let i = 0; i < points.length; i += 1) {
		const pos = points[i];
		while (stack.length && stack[stack.length - 1]?.end === pos) {
			const item = stack.pop();
			if (item) out += item.close;
		}
		const openingItems = [];
		const openingLinks = linkStarts.get(pos);
		if (openingLinks && openingLinks.length > 0) for (const [index, link] of openingLinks.entries()) openingItems.push({
			end: link.end,
			open: link.open,
			close: link.close,
			kind: "link",
			index
		});
		const openingStyles = startsAt.get(pos);
		if (openingStyles) for (const [index, span] of openingStyles.entries()) {
			const marker = styleMarkers[span.style];
			if (!marker) continue;
			openingItems.push({
				end: span.end,
				open: marker.open,
				close: marker.close,
				kind: "style",
				style: span.style,
				index
			});
		}
		if (openingItems.length > 0) {
			openingItems.sort((a, b) => {
				if (a.end !== b.end) return b.end - a.end;
				if (a.kind !== b.kind) return a.kind === "link" ? -1 : 1;
				if (a.kind === "style" && b.kind === "style") return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
				return a.index - b.index;
			});
			for (const item of openingItems) {
				out += item.open;
				stack.push({
					close: item.close,
					end: item.end
				});
			}
		}
		const next = points[i + 1];
		if (next === void 0) break;
		if (next > pos) out += options.escapeText(text.slice(pos, next));
	}
	return out;
}
//#endregion
//#region src/plugin-sdk/boolean-param.ts
function readBooleanParam(params, key) {
	const raw = params[key];
	if (typeof raw === "boolean") return raw;
	if (typeof raw === "string") {
		const trimmed = raw.trim().toLowerCase();
		if (trimmed === "true") return true;
		if (trimmed === "false") return false;
	}
}
//#endregion
//#region src/channels/plugins/actions/shared.ts
function listTokenSourcedAccounts(accounts) {
	return accounts.filter((account) => account.tokenSource !== "none");
}
function createUnionActionGate(accounts, createGate) {
	const gates = accounts.map((account) => createGate(account));
	return (key, defaultValue = true) => gates.some((gate) => gate(key, defaultValue));
}
//#endregion
export { resolvePollMaxSelections as _, markdownToIR as a, createDiscordRetryRunner as c, resolveChunkMode as d, loadWebMedia as f, normalizePollInput as g, normalizePollDurationHours as h, renderMarkdownWithMarkers as i, createTelegramRetryRunner as l, getDefaultMediaLocalRoots as m, listTokenSourcedAccounts as n, markdownToIRWithMeta as o, loadWebMediaRaw as p, readBooleanParam as r, resolveMarkdownTableMode as s, createUnionActionGate as t, chunkMarkdownTextWithMode as u, buildOutboundMediaLoadOptions as v };
