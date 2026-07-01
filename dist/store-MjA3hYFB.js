import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { u as toErrorObject } from "./errors-DCRXIYSQ.js";
import "./fs-safe-defaults-B7hUN42l.js";
import { i as isPathInside, m as FsSafeError } from "./path-BlG8lhgR.js";
import "./fs-safe-aqmM_n6V.js";
import { r as sanitizeUntrustedFileName, t as writeSiblingTempFile } from "./sibling-temp-CLpkwDtX.js";
import { i as readLocalFileSafely$1 } from "./secure-temp-dir-XAWcZnE2.js";
import { f as resolveConfigDir } from "./utils-BApvfmPs.js";
import { t as fileStore } from "./file-store-BEyTvXOr.js";
import "./fs-safe-advanced-CBe_wA_B.js";
import { g as resolvePinnedHostname } from "./ssrf-DmSIVBht.js";
import { t as retainSafeHeadersForCrossOriginRedirect } from "./redirect-headers-W1BVi3dl.js";
import { n as detectMime, r as extensionForMime } from "./mime-C8mVE2Bw.js";
import { n as extnameFromAnyPath, r as nameFromAnyPath, t as basenameFromAnyPath } from "./file-name-D1nUHSBH.js";
import "./sibling-temp-file-CBe_wA_B.js";
import { createWriteStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import crypto from "node:crypto";
import { pipeline } from "node:stream/promises";
import { request } from "node:http";
import { request as request$1 } from "node:https";
//#region src/media/store.runtime.ts
/** fs-safe local file reader re-exported for media-store test/runtime injection. */
const readLocalFileSafely = readLocalFileSafely$1;
/** Narrows fs-safe failures without exposing the full infra error class to store callers. */
function isFsSafeError(error) {
	return error instanceof FsSafeError;
}
//#endregion
//#region src/media/store.ts
const resolveMediaDir = () => path.join(resolveConfigDir(), "media");
/** Default per-file media-store byte cap used by inbound staging and plugin SDK callers. */
const MEDIA_MAX_BYTES = 5 * 1024 * 1024;
const MAX_BYTES = MEDIA_MAX_BYTES;
const DEFAULT_TTL_MS = 120 * 1e3;
const MEDIA_FILE_MODE = 420;
const defaultHttpRequestImpl = request;
const defaultHttpsRequestImpl = request$1;
const defaultResolvePinnedHostnameImpl = resolvePinnedHostname;
function formatMediaLimitMb(maxBytes) {
	return `${(maxBytes / (1024 * 1024)).toFixed(0)}MB`;
}
function resolveMediaSubdir(subdir, caller) {
	if (typeof subdir !== "string") throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	if (!subdir || subdir === ".") return "";
	if (subdir.includes("\0") || path.isAbsolute(subdir) || path.posix.isAbsolute(subdir) || path.win32.isAbsolute(subdir)) throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	const segments = subdir.split(/[\\/]+/u);
	if (segments.some((segment) => !segment || segment === "." || segment === "..")) throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	return path.join(...segments);
}
function resolveMediaScopedDir(subdir, caller) {
	const mediaDir = resolveMediaDir();
	const safeSubdir = resolveMediaSubdir(subdir, caller);
	const dir = safeSubdir ? path.join(mediaDir, safeSubdir) : mediaDir;
	if (!isPathInside(mediaDir, dir)) throw new Error(`${caller}: media subdir escapes media directory: ${JSON.stringify(subdir)}`);
	return dir;
}
function resolveMediaRelativePath(id, subdir, caller) {
	if (!id || id.includes("/") || id.includes("\\") || id.includes("\0") || id === "..") throw new Error(`${caller}: unsafe media ID: ${JSON.stringify(id)}`);
	const safeSubdir = resolveMediaSubdir(subdir, caller);
	return safeSubdir ? path.join(safeSubdir, id) : id;
}
function openMediaStore(maxBytes = MAX_BYTES) {
	return fileStore({
		rootDir: resolveMediaDir(),
		dirMode: 448,
		maxBytes,
		mode: MEDIA_FILE_MODE
	});
}
let httpRequestImpl = defaultHttpRequestImpl;
let httpsRequestImpl = defaultHttpsRequestImpl;
let resolvePinnedHostnameImpl = defaultResolvePinnedHostnameImpl;
/** Overrides network dependencies for media-store tests and restores defaults when omitted. */
function setMediaStoreNetworkDepsForTest(deps) {
	httpRequestImpl = deps?.httpRequest ?? defaultHttpRequestImpl;
	httpsRequestImpl = deps?.httpsRequest ?? defaultHttpsRequestImpl;
	resolvePinnedHostnameImpl = deps?.resolvePinnedHostname ?? defaultResolvePinnedHostnameImpl;
}
/**
* Sanitize a filename for cross-platform safety.
* Removes chars unsafe on Windows/SharePoint/all platforms.
* Keeps: alphanumeric, dots, hyphens, underscores, Unicode letters/numbers.
*/
function sanitizeFilename(name) {
	const base = sanitizeUntrustedFileName(name, "");
	if (!base) return "";
	return base.replace(/[^\p{L}\p{N}._-]+/gu, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 60);
}
/** Restores the caller-facing filename from media-store paths with embedded UUID suffixes. */
function extractOriginalFilename(filePath) {
	const basename = basenameFromAnyPath(filePath);
	if (!basename) return "file.bin";
	const ext = extnameFromAnyPath(basename);
	const match = path.basename(basename, ext).match(/^(.+)---[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i);
	if (match?.[1]) return `${match[1]}${ext}`;
	return basename;
}
/** Returns the configured absolute media-store root without creating it. */
function getMediaDir() {
	return resolveMediaDir();
}
/** Creates the configured media-store root with private directory permissions. */
async function ensureMediaDir() {
	const mediaDir = resolveMediaDir();
	await fs$1.mkdir(mediaDir, {
		recursive: true,
		mode: 448
	});
	return mediaDir;
}
function findErrorWithCode(err, code) {
	if (!(err instanceof Error)) return;
	if ("code" in err && err.code === code) return err;
	return findErrorWithCode(err.cause, code);
}
function isMissingPathError(err) {
	return findErrorWithCode(err, "ENOENT") !== void 0;
}
async function retryAfterRecreatingDir(dir, run) {
	try {
		return await run();
	} catch (err) {
		const noSpaceError = findErrorWithCode(err, "ENOSPC");
		if (noSpaceError) throw noSpaceError;
		if (!isMissingPathError(err)) throw err;
		await fs$1.mkdir(dir, {
			recursive: true,
			mode: 448
		});
		return await run();
	}
}
function resolveCleanupMaxDepth(recursive) {
	if (recursive === true) return;
	if (recursive === false) return 0;
	return 1;
}
/** Prunes expired media files, optionally recursing into scoped media subdirectories. */
async function cleanOldMedia(ttlMs = DEFAULT_TTL_MS, options = {}) {
	await openMediaStore().pruneExpired({
		maxDepth: resolveCleanupMaxDepth(options.recursive),
		ttlMs,
		recursive: options.recursive ?? true,
		pruneEmptyDirs: options.pruneEmptyDirs
	});
}
function looksLikeUrl(src) {
	return /^https?:\/\//i.test(src);
}
function discardIgnoredHttpResponse(res) {
	res.resume();
}
/**
* Download media to disk while capturing the first few KB for mime sniffing.
*/
async function downloadToFile(url, dest, headers, maxRedirects = 5, maxBytes = MAX_BYTES) {
	return await new Promise((resolve, reject) => {
		let parsedUrl;
		try {
			parsedUrl = new URL(url);
		} catch {
			reject(/* @__PURE__ */ new Error("Invalid URL"));
			return;
		}
		if (!["http:", "https:"].includes(parsedUrl.protocol)) {
			reject(/* @__PURE__ */ new Error(`Invalid URL protocol: ${parsedUrl.protocol}. Only HTTP/HTTPS allowed.`));
			return;
		}
		const requestImpl = parsedUrl.protocol === "https:" ? httpsRequestImpl : httpRequestImpl;
		resolvePinnedHostnameImpl(parsedUrl.hostname).then((pinned) => {
			const req = requestImpl(parsedUrl, {
				headers,
				lookup: pinned.lookup
			}, (res) => {
				if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
					const location = res.headers.location;
					if (!location || maxRedirects <= 0) {
						discardIgnoredHttpResponse(res);
						reject(/* @__PURE__ */ new Error(`Redirect loop or missing Location header`));
						return;
					}
					let redirectUrl;
					try {
						redirectUrl = new URL(location, url);
					} catch {
						discardIgnoredHttpResponse(res);
						reject(/* @__PURE__ */ new Error("Invalid redirect Location header"));
						return;
					}
					const redirectHeaders = redirectUrl.origin === parsedUrl.origin ? headers : retainSafeHeadersForCrossOriginRedirect(headers);
					discardIgnoredHttpResponse(res);
					resolve(downloadToFile(redirectUrl.href, dest, redirectHeaders, maxRedirects - 1, maxBytes));
					return;
				}
				if (!res.statusCode || res.statusCode >= 400) {
					discardIgnoredHttpResponse(res);
					reject(/* @__PURE__ */ new Error(`HTTP ${res.statusCode ?? "?"} downloading media`));
					return;
				}
				let total = 0;
				const sniffChunks = [];
				let sniffLen = 0;
				const out = createWriteStream(dest, { mode: MEDIA_FILE_MODE });
				res.on("data", (chunk) => {
					total += chunk.length;
					if (sniffLen < 16384) {
						sniffChunks.push(chunk);
						sniffLen += chunk.length;
					}
					if (total > maxBytes) req.destroy(/* @__PURE__ */ new Error(`Media exceeds ${formatMediaLimitMb(maxBytes)} limit`));
				});
				pipeline(res, out).then(() => {
					const sniffBuffer = Buffer.concat(sniffChunks, Math.min(sniffLen, 16384));
					const rawHeader = res.headers["content-type"];
					resolve({
						headerMime: Array.isArray(rawHeader) ? rawHeader[0] : rawHeader,
						sniffBuffer,
						size: total
					});
				}).catch(async (err) => {
					await fs$1.rm(dest, { force: true }).catch(() => {});
					reject(toErrorObject(err, "Non-Error rejection"));
				});
			});
			req.on("error", reject);
			req.end();
		}).catch(reject);
	});
}
function buildSavedMediaId(params) {
	if (!params.originalFilename) return params.ext ? `${params.baseId}${params.ext}` : params.baseId;
	const sanitized = sanitizeFilename(nameFromAnyPath(params.originalFilename));
	return sanitized ? `${sanitized}---${params.baseId}${params.ext}` : `${params.baseId}${params.ext}`;
}
function safeOriginalFilenameExtension(originalFilename) {
	if (!originalFilename) return;
	const ext = extnameFromAnyPath(originalFilename).toLowerCase();
	return /^\.[a-z0-9]{1,16}$/.test(ext) ? ext : void 0;
}
function extensionForAuthoritativeHeaderMime(contentType) {
	const mime = normalizeOptionalString(contentType?.split(";")[0]);
	if (!mime || mime === "application/octet-stream" || mime === "binary/octet-stream") return;
	if (mime === "application/zip") return;
	return extensionForMime(mime);
}
function isGenericContainerMime(mime) {
	return mime === "application/zip" || mime === "application/octet-stream";
}
function isImageHeaderMime(contentType) {
	return normalizeOptionalString(contentType?.split(";")[0])?.startsWith("image/") === true;
}
function resolveSavedMediaExtension(params) {
	return (params.headerExt && isGenericContainerMime(params.detectedMime) && isImageHeaderMime(params.contentType) ? void 0 : params.headerExt) ?? extensionForMime(params.detectedMime) ?? safeOriginalFilenameExtension(params.originalFilename) ?? "";
}
function buildSavedMediaResult(params) {
	return {
		id: params.id,
		path: path.join(params.dir, params.id),
		size: params.size,
		contentType: params.contentType
	};
}
async function saveMediaSiblingTempFile(params) {
	const { result } = await retryAfterRecreatingDir(params.dir, () => writeSiblingTempFile({
		dir: params.dir,
		mode: MEDIA_FILE_MODE,
		tempPrefix: params.tempPrefix,
		writeTemp: params.writeTemp,
		resolveFinalPath: (resultLocal) => path.join(params.dir, resultLocal.id)
	}));
	return buildSavedMediaResult({
		dir: params.dir,
		...result
	});
}
async function writeSavedMediaBuffer(params) {
	const dir = resolveMediaScopedDir(params.subdir, "writeSavedMediaBuffer");
	const relativePath = resolveMediaRelativePath(params.id, params.subdir, "writeSavedMediaBuffer");
	return await retryAfterRecreatingDir(dir, async () => await openMediaStore(params.buffer.byteLength).write(relativePath, params.buffer, { tempPrefix: `.${params.id}` }));
}
async function writeMediaStreamToFile(params) {
	const handle = await fs$1.open(params.tempPath, "wx", MEDIA_FILE_MODE);
	const sniffChunks = [];
	let sniffLen = 0;
	let total = 0;
	try {
		for await (const chunk of params.stream) {
			const buffer = Buffer.isBuffer(chunk) ? chunk : typeof chunk === "string" ? Buffer.from(chunk) : chunk instanceof ArrayBuffer ? Buffer.from(chunk) : ArrayBuffer.isView(chunk) ? Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength) : void 0;
			if (!buffer) throw new TypeError(`Unsupported media stream chunk: ${typeof chunk}`);
			if (buffer.byteLength === 0) continue;
			total += buffer.byteLength;
			if (total > params.maxBytes) throw new Error(`Media exceeds ${formatMediaLimitMb(params.maxBytes)} limit`);
			if (sniffLen < 16384) {
				const remaining = 16384 - sniffLen;
				sniffChunks.push(buffer.byteLength > remaining ? buffer.subarray(0, remaining) : buffer);
				sniffLen += Math.min(buffer.byteLength, remaining);
			}
			await handle.write(buffer);
		}
		return {
			sniffBuffer: Buffer.concat(sniffChunks, sniffLen),
			size: total
		};
	} finally {
		await handle.close().catch(() => void 0);
	}
}
/** Error raised when saveMediaSource cannot safely read or persist a source path. */
var SaveMediaSourceError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "SaveMediaSourceError";
	}
};
function toSaveMediaSourceError(err, maxBytes = MAX_BYTES) {
	switch (err.code) {
		case "symlink": return new SaveMediaSourceError("invalid-path", "Media path must not be a symlink", { cause: err });
		case "not-file": return new SaveMediaSourceError("not-file", "Media path is not a file", { cause: err });
		case "path-mismatch": return new SaveMediaSourceError("path-mismatch", "Media path changed during read", { cause: err });
		case "too-large": return new SaveMediaSourceError("too-large", `Media exceeds ${formatMediaLimitMb(maxBytes)} limit`, { cause: err });
		case "not-found": return new SaveMediaSourceError("not-found", "Media path does not exist", { cause: err });
		case "outside-workspace": return new SaveMediaSourceError("invalid-path", "Media path is outside workspace root", { cause: err });
		default: return new SaveMediaSourceError("invalid-path", "Media path is not safe to read", { cause: err });
	}
}
/** Saves a local path or HTTP(S) source into the media store after MIME/size validation. */
async function saveMediaSource(source, headers, subdir = "", maxBytes = MAX_BYTES) {
	const dir = resolveMediaScopedDir(subdir, "saveMediaSource");
	await fs$1.mkdir(dir, {
		recursive: true,
		mode: 448
	});
	const baseId = crypto.randomUUID();
	if (looksLikeUrl(source)) return await saveMediaSiblingTempFile({
		dir,
		tempPrefix: `.${baseId}`,
		writeTemp: async (tempPath) => {
			const { headerMime, sniffBuffer, size } = await downloadToFile(source, tempPath, headers, 5, maxBytes);
			const mime = await detectMime({
				buffer: sniffBuffer,
				headerMime,
				filePath: source
			});
			return {
				id: buildSavedMediaId({
					baseId,
					ext: extensionForMime(mime) ?? path.extname(new URL(source).pathname)
				}),
				size,
				contentType: mime
			};
		}
	});
	try {
		const { buffer, stat } = await readLocalFileSafely({
			filePath: source,
			maxBytes
		});
		const mime = await detectMime({
			buffer,
			filePath: source
		});
		const id = buildSavedMediaId({
			baseId,
			ext: extensionForMime(mime) ?? path.extname(source)
		});
		await writeSavedMediaBuffer({
			subdir,
			id,
			buffer
		});
		return buildSavedMediaResult({
			dir,
			id,
			size: stat.size,
			contentType: mime
		});
	} catch (err) {
		if (isFsSafeError(err)) throw toSaveMediaSourceError(err, maxBytes);
		throw err;
	}
}
/** Saves an in-memory media buffer under a UUID-backed media ID. */
async function saveMediaBuffer(buffer, contentType, subdir = "inbound", maxBytes = MAX_BYTES, originalFilename, detectionFilePathHint) {
	if (buffer.byteLength > maxBytes) throw new Error(`Media exceeds ${formatMediaLimitMb(maxBytes)} limit`);
	const dir = resolveMediaScopedDir(subdir, "saveMediaBuffer");
	await fs$1.mkdir(dir, {
		recursive: true,
		mode: 448
	});
	const uuid = crypto.randomUUID();
	const headerExt = extensionForAuthoritativeHeaderMime(contentType);
	const mime = await detectMime({
		buffer,
		headerMime: contentType,
		filePath: originalFilename ?? detectionFilePathHint
	});
	const id = buildSavedMediaId({
		baseId: uuid,
		ext: resolveSavedMediaExtension({
			detectedMime: mime,
			headerExt,
			contentType,
			originalFilename
		}),
		originalFilename
	});
	await writeSavedMediaBuffer({
		subdir,
		id,
		buffer
	});
	return buildSavedMediaResult({
		dir,
		id,
		size: buffer.byteLength,
		contentType: mime
	});
}
/** Streams media into a sibling temp file before atomically publishing the final media ID. */
async function saveMediaStream(stream, contentType, subdir = "inbound", maxBytes = MAX_BYTES, originalFilename, detectionFilePathHint) {
	const dir = resolveMediaScopedDir(subdir, "saveMediaStream");
	await fs$1.mkdir(dir, {
		recursive: true,
		mode: 448
	});
	const baseId = crypto.randomUUID();
	const headerExt = extensionForAuthoritativeHeaderMime(contentType);
	return await saveMediaSiblingTempFile({
		dir,
		tempPrefix: `.${baseId}`,
		writeTemp: async (tempPath) => {
			const { sniffBuffer, size } = await writeMediaStreamToFile({
				stream,
				tempPath,
				maxBytes
			});
			const mime = await detectMime({
				buffer: sniffBuffer,
				headerMime: contentType,
				filePath: originalFilename ?? detectionFilePathHint
			});
			return {
				id: buildSavedMediaId({
					baseId,
					ext: resolveSavedMediaExtension({
						detectedMime: mime,
						headerExt,
						contentType,
						originalFilename
					}),
					originalFilename
				}),
				size,
				contentType: mime
			};
		}
	});
}
/**
* Resolves a media ID saved by saveMediaBuffer to its absolute physical path.
*
* This is the read-side counterpart to saveMediaBuffer and is used by the
* agent runner to hydrate opaque `media://inbound/<id>` URIs written by the
* Gateway's claim-check offload path.
*
* Security:
* - Rejects IDs and subdirs containing path traversal, absolute paths, empty
*   segments, or null bytes to prevent path injection outside the media root.
* - Verifies the resolved path is a regular file (not a symlink or directory)
*   before returning it, matching the write-side MEDIA_FILE_MODE policy.
*
* @param id      The media ID as returned by SavedMedia.id (may include
*                extension and original-filename prefix,
*                e.g. "photo---<uuid>.png" or "图片---<uuid>.png").
* @param subdir  The subdirectory the file was saved into (default "inbound").
* @returns       Absolute path to the file on disk.
* @throws        If the ID is unsafe, the file does not exist, or is not a
*                regular file.
*
* Prefer readMediaBuffer when the caller needs the bytes; this path-returning
* helper is for channel surfaces that need a stable local attachment path.
*/
async function resolveMediaBufferPath(id, subdir = "inbound") {
	const relativePath = resolveMediaRelativePath(id, subdir, "resolveMediaBufferPath");
	const opened = await openMediaStore().open(relativePath).catch(() => null);
	if (!opened?.stat.isFile()) throw new Error(`resolveMediaBufferPath: media ID does not resolve to a file: ${JSON.stringify(id)}`);
	try {
		return opened.realPath;
	} finally {
		await opened.handle.close().catch(() => void 0);
	}
}
/** Reads a stored media ID with the same path guards and byte limit used by writers. */
async function readMediaBuffer(id, subdir = "inbound", maxBytes = MAX_BYTES) {
	const relativePath = resolveMediaRelativePath(id, subdir, "readMediaBuffer");
	const opened = await openMediaStore(maxBytes).open(relativePath).catch(() => null);
	if (!opened?.stat.isFile()) throw new Error(`readMediaBuffer: media ID does not resolve to a file: ${JSON.stringify(id)}`);
	try {
		if (opened.stat.size > maxBytes) throw new Error(`readMediaBuffer: media ID ${JSON.stringify(id)} is ${opened.stat.size} bytes; maximum is ${maxBytes} bytes`);
		const buffer = await opened.handle.readFile();
		if (buffer.byteLength > maxBytes) throw new Error(`readMediaBuffer: media ID ${JSON.stringify(id)} read ${buffer.byteLength} bytes; maximum is ${maxBytes} bytes`);
		return {
			id,
			path: opened.realPath,
			buffer,
			size: buffer.byteLength
		};
	} finally {
		await opened.handle.close().catch(() => void 0);
	}
}
/**
* Deletes a file previously saved by saveMediaBuffer.
*
* This is used by parseMessageWithAttachments to clean up files that were
* successfully offloaded earlier in the same request when a later attachment
* fails validation and the entire parse is aborted, preventing orphaned files
* from accumulating on disk ahead of the periodic TTL sweep.
*
* Uses a media-root handle to apply the same path-safety guards as the read
* path while removing the file under the pinned media root.
*
* Errors are intentionally not suppressed — callers that want best-effort
* cleanup should catch and discard exceptions themselves (e.g. via
* Promise.allSettled).
*
* @param id     The media ID as returned by SavedMedia.id.
* @param subdir The subdirectory the file was saved into (default "inbound").
*/
async function deleteMediaBuffer(id, subdir = "inbound") {
	const relativePath = resolveMediaRelativePath(id, subdir, "deleteMediaBuffer");
	await openMediaStore().remove(relativePath);
}
//#endregion
export { ensureMediaDir as a, readMediaBuffer as c, saveMediaSource as d, saveMediaStream as f, deleteMediaBuffer as i, resolveMediaBufferPath as l, SaveMediaSourceError as n, extractOriginalFilename as o, setMediaStoreNetworkDepsForTest as p, cleanOldMedia as r, getMediaDir as s, MEDIA_MAX_BYTES as t, saveMediaBuffer as u };
