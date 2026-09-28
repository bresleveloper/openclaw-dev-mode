import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./fs-safe-defaults-D3xd3zKO.mjs";
import { f as sanitizeUntrustedFileName } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { c as isPathInside, h as readLocalFileSafely, t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { t as retryAsync } from "./retry-C0DLN1oj.mjs";
import { n as extnameFromAnyPath, r as nameFromAnyPath, t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { d as normalizeMimeType, i as getFileExtension, n as detectMime, r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import { t as writeSiblingTempFile } from "./sibling-temp-file-D3urysex.mjs";
import { n as captureChannelReadScope } from "./channel-read-authority-CLJnqxr1.mjs";
import { t as fileStore } from "./file-store-adUqqkP0.mjs";
import { t as SaveMediaSourceError } from "./store.shared-8ewC3oFm.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region src/media/store.ts
const resolveMediaDir = () => path.join(resolveConfigDir(), "media");
/** Default per-file media-store byte cap used by store and plugin SDK callers. */
const MEDIA_MAX_BYTES = 5242880;
const PLAYBACK_TRANSCODE_SUBDIR = "playback-transcode";
const MANAGED_OUTGOING_SUBDIR = "outgoing";
const OUTBOUND_STAGING_SUBDIR = "outbound";
const OUTBOUND_STAGING_TTL_MS = 864e5;
/** Fixed disk budget for cached playback renditions; oldest outputs are evicted first. */
const PLAYBACK_TRANSCODE_MAX_CACHE_BYTES = 536870912;
/** Playback renditions outlive transient media but are still retired after one week. */
const PLAYBACK_TRANSCODE_TTL_MS = 6048e5;
const MAX_BYTES = MEDIA_MAX_BYTES;
const DEFAULT_TTL_MS = 12e4;
let playbackCacheOperationTail = Promise.resolve();
function resolveMediaSubdir(subdir, caller) {
	if (typeof subdir !== "string") throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	if (!subdir || subdir === ".") return "";
	if (subdir.includes("\0") || path.isAbsolute(subdir) || path.posix.isAbsolute(subdir) || path.win32.isAbsolute(subdir)) throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	const segments = subdir.split(/[\\/]+/u);
	if (segments.some((segment) => !segment || segment === "." || segment === "..")) throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	return path.posix.join(...segments);
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
	return safeSubdir ? path.posix.join(safeSubdir, id) : id;
}
function openMediaStore(maxBytes = MAX_BYTES, rootDir = resolveMediaDir()) {
	return fileStore({
		rootDir,
		dirMode: 448,
		maxBytes,
		mode: 420
	});
}
/**
* Sanitize a filename for cross-platform safety.
* Removes chars unsafe on Windows/SharePoint/all platforms.
* Keeps: alphanumeric, dots, hyphens, underscores, Unicode letters/numbers.
*/
function sanitizeFilename(name) {
	const sanitized = sanitizeUntrustedFileName(name, "_").normalize("NFC").replace(/[^\p{L}\p{N}._-]+/gu, "_");
	return truncateUtf16Safe(sanitized.replace(/_+/g, "_").replace(/^_|_$/g, ""), 60);
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
	await fs.mkdir(mediaDir, {
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
function hasRecoverableMissingMediaDirCause(err) {
	return findErrorWithCode(err, "ENOENT") !== void 0;
}
async function retryAfterRecreatingDir(dir, run, canRetry = () => true) {
	return await retryAsync(async () => {
		try {
			return await run();
		} catch (err) {
			throw findErrorWithCode(err, "ENOSPC") ?? err;
		}
	}, {
		attempts: 2,
		minDelayMs: 0,
		maxDelayMs: 0,
		shouldRetry: (err) => canRetry() && hasRecoverableMissingMediaDirCause(err),
		onRetry: async () => {
			await fs.mkdir(dir, {
				recursive: true,
				mode: 448
			});
		}
	});
}
async function prunePlaybackTranscodeCacheToSize() {
	const dir = resolveMediaScopedDir(PLAYBACK_TRANSCODE_SUBDIR, "prunePlaybackTranscodeCacheToSize");
	const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
	const files = (await Promise.all(entries.map(async (entry) => {
		if (!entry.isFile() || entry.name.startsWith(".")) return null;
		const stat = await fs.lstat(path.join(dir, entry.name)).catch(() => null);
		return stat?.isFile() ? {
			name: entry.name,
			size: stat.size,
			mtimeMs: stat.mtimeMs
		} : null;
	}))).filter((entry) => Boolean(entry)).toSorted((left, right) => left.mtimeMs - right.mtimeMs || left.name.localeCompare(right.name));
	let totalBytes = files.reduce((total, file) => total + file.size, 0);
	for (const file of files) {
		if (totalBytes <= PLAYBACK_TRANSCODE_MAX_CACHE_BYTES) break;
		const relativePath = resolveMediaRelativePath(file.name, PLAYBACK_TRANSCODE_SUBDIR, "prunePlaybackTranscodeCacheToSize");
		if (await openMediaStore().remove(relativePath).then(() => true).catch(() => false)) totalBytes -= file.size;
	}
}
async function pruneNonPlaybackMedia(ttlMs, options) {
	if (options.recursive === false) {
		await openMediaStore().pruneExpired({
			ttlMs,
			recursive: false,
			maxDepth: 0
		});
		return;
	}
	const mediaDir = resolveMediaDir();
	await openMediaStore().pruneExpired({
		ttlMs,
		recursive: false,
		maxDepth: 0
	});
	const entries = await fs.readdir(mediaDir, { withFileTypes: true }).catch(() => []);
	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name === "playback-transcode" || entry.name === MANAGED_OUTGOING_SUBDIR) continue;
		const scopedDir = path.join(mediaDir, entry.name);
		const recursive = options.recursive === true;
		await openMediaStore(MAX_BYTES, scopedDir).pruneExpired({
			ttlMs,
			recursive,
			maxDepth: recursive ? void 0 : 0,
			pruneEmptyDirs: options.pruneEmptyDirs
		});
		if (options.pruneEmptyDirs) await fs.rmdir(scopedDir).catch(() => {});
	}
}
async function queuePlaybackCacheOperation(operation) {
	const run = playbackCacheOperationTail.then(operation);
	playbackCacheOperationTail = run.then(() => {}, () => {});
	return await run;
}
/** Serializes cache publication with quota enforcement and propagates failures to the writer. */
async function writePlaybackTranscodeCache(params) {
	return await queuePlaybackCacheOperation(async () => {
		const relativePath = resolveMediaRelativePath(params.fileName, PLAYBACK_TRANSCODE_SUBDIR, "writePlaybackTranscodeCache");
		const filePath = await openMediaStore(params.maxBytes).write(relativePath, params.buffer, {
			maxBytes: params.maxBytes,
			tempPrefix: params.tempPrefix
		});
		await prunePlaybackTranscodeCacheToSize();
		return filePath;
	});
}
/** Prunes expired playback renditions and reapplies the fixed cache size budget. */
async function prunePlaybackTranscodeCache() {
	await queuePlaybackCacheOperation(async () => {
		const cacheDir = resolveMediaScopedDir(PLAYBACK_TRANSCODE_SUBDIR, "prunePlaybackTranscodeCache");
		await openMediaStore(MAX_BYTES, cacheDir).pruneExpired({
			ttlMs: PLAYBACK_TRANSCODE_TTL_MS,
			recursive: true,
			pruneEmptyDirs: true
		});
		await prunePlaybackTranscodeCacheToSize();
	});
}
/** Prunes stale delivery staging without touching inbound replay or SQLite-owned outgoing media. */
async function pruneOutboundMedia() {
	const outboundDir = resolveMediaScopedDir(OUTBOUND_STAGING_SUBDIR, "pruneOutboundMedia");
	await openMediaStore(MAX_BYTES, outboundDir).pruneExpired({
		ttlMs: OUTBOUND_STAGING_TTL_MS,
		recursive: true,
		pruneEmptyDirs: true
	});
	const { pruneStaleTrustedGeneratedHtmlMarkers } = await import("./web-media-DDoLkIL9.mjs");
	await pruneStaleTrustedGeneratedHtmlMarkers();
}
/** Prunes expired non-playback media, optionally recursing into scoped subdirectories. */
async function cleanOldMedia(ttlMs = DEFAULT_TTL_MS, options = {}) {
	await pruneNonPlaybackMedia(ttlMs, options);
	const { pruneStaleTrustedGeneratedHtmlMarkers } = await import("./web-media-DDoLkIL9.mjs");
	await pruneStaleTrustedGeneratedHtmlMarkers();
}
function looksLikeUrl(src) {
	return hasHttpUrlPrefix(src);
}
function buildSavedMediaId(params) {
	if (!params.originalFilename) return params.ext ? `${params.baseId}${params.ext}` : params.baseId;
	const sanitized = sanitizeFilename(nameFromAnyPath(params.originalFilename));
	return sanitized ? `${sanitized}---${params.baseId}${params.ext}` : `${params.baseId}${params.ext}`;
}
function safeOriginalFilenameExtension(originalFilename) {
	if (!originalFilename) return;
	const ext = extnameFromAnyPath(originalFilename);
	return /^\.[a-z0-9]{1,16}$/i.test(ext) ? ext : void 0;
}
function extensionForAuthoritativeHeaderMime(contentType) {
	const mime = normalizeMimeType(contentType);
	if (!mime || mime === "application/octet-stream" || mime === "binary/octet-stream") return;
	if (mime === "application/zip") return;
	return extensionForMime(mime);
}
function isGenericContainerMime(mime) {
	return mime === "application/zip" || mime === "application/octet-stream";
}
function isImageHeaderMime(contentType) {
	return normalizeMimeType(contentType)?.startsWith("image/") === true;
}
function resolveSavedMediaExtension(params) {
	return (params.headerExt && isGenericContainerMime(params.detectedMime) && isImageHeaderMime(params.contentType) ? void 0 : params.headerExt) ?? extensionForMime(params.detectedMime) ?? safeOriginalFilenameExtension(params.originalFilename) ?? getFileExtension(params.detectionFilePathHint) ?? "";
}
function buildSavedMediaResult(params) {
	return {
		id: params.id,
		path: path.join(params.dir, params.id),
		size: params.size,
		contentType: params.contentType
	};
}
async function writeSavedMediaBuffer(params) {
	const readScope = captureChannelReadScope();
	readScope?.assertCurrent();
	const dir = resolveMediaScopedDir(params.subdir, "writeSavedMediaBuffer");
	const relativePath = resolveMediaRelativePath(params.id, params.subdir, "writeSavedMediaBuffer");
	return await retryAfterRecreatingDir(dir, async () => {
		if (readScope) {
			const { writeReadScopeMedia } = await import("./store.read-scope-N0R87pLh.mjs");
			await writeReadScopeMedia({
				dir,
				tempPrefix: `.${params.id}`,
				scope: readScope,
				durable: true,
				write: async (handle) => {
					readScope.assertCurrent();
					await handle.writeFile(params.buffer);
					return { id: params.id };
				}
			});
			return path.join(dir, params.id);
		}
		return await openMediaStore(params.buffer.byteLength).write(relativePath, params.buffer, { tempPrefix: `.${params.id}` });
	});
}
async function writeMediaStreamToFile(params) {
	const sniffBuffer = Buffer.allocUnsafe(16384);
	let sniffLen = 0;
	let total = 0;
	for await (const chunk of params.stream) {
		params.assertCurrent?.();
		const buffer = Buffer.isBuffer(chunk) ? chunk : typeof chunk === "string" ? Buffer.from(chunk) : chunk instanceof ArrayBuffer ? Buffer.from(chunk) : ArrayBuffer.isView(chunk) ? Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength) : void 0;
		if (!buffer) throw new TypeError(`Unsupported media stream chunk: ${typeof chunk}`);
		if (buffer.byteLength === 0) continue;
		total += buffer.byteLength;
		if (total > params.maxBytes) throw SaveMediaSourceError.tooLarge(params.maxBytes);
		if (sniffLen < sniffBuffer.length) sniffLen += buffer.copy(sniffBuffer, sniffLen);
		await params.handle.writeFile(buffer);
	}
	params.assertCurrent?.();
	return {
		sniffBuffer: sniffBuffer.subarray(0, sniffLen),
		size: total
	};
}
function toSaveMediaSourceError(err, maxBytes = MAX_BYTES) {
	switch (err.code) {
		case "symlink": return new SaveMediaSourceError("invalid-path", "Media path must not be a symlink", { cause: err });
		case "not-file": return new SaveMediaSourceError("not-file", "Media path is not a file", { cause: err });
		case "path-mismatch": return new SaveMediaSourceError("path-mismatch", "Media path changed during read", { cause: err });
		case "too-large": return SaveMediaSourceError.tooLarge(maxBytes, { cause: err });
		case "not-found": return new SaveMediaSourceError("not-found", "Media path does not exist", { cause: err });
		case "outside-workspace": return new SaveMediaSourceError("invalid-path", "Media path is outside workspace root", { cause: err });
		default: return new SaveMediaSourceError("invalid-path", "Media path is not safe to read", { cause: err });
	}
}
/** Saves a local path or HTTP(S) source into the media store after MIME/size validation. */
async function saveMediaSource(source, headers, subdir = "", maxBytes = MAX_BYTES) {
	const dir = resolveMediaScopedDir(subdir, "saveMediaSource");
	await fs.mkdir(dir, {
		recursive: true,
		mode: 448
	});
	if (looksLikeUrl(source)) {
		const { saveRemoteMediaForStore } = await import("./store.remote.runtime.js");
		return await saveRemoteMediaForStore({
			source,
			headers,
			subdir,
			maxBytes
		});
	}
	const baseId = crypto.randomUUID();
	try {
		let buffer;
		if (captureChannelReadScope()) {
			const { readLocalMediaFile } = await import("./local-media-access-CbF-5PRv.mjs");
			buffer = await readLocalMediaFile(source, "any", { maxBytes });
		} else buffer = (await readLocalFileSafely({
			filePath: source,
			maxBytes
		})).buffer;
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
			size: buffer.byteLength,
			contentType: mime
		});
	} catch (err) {
		if (err instanceof FsSafeError) throw toSaveMediaSourceError(err, maxBytes);
		throw err;
	}
}
/** Saves an in-memory media buffer under a UUID-backed media ID. */
async function saveMediaBuffer(buffer, contentType, subdir = "inbound", maxBytes = MAX_BYTES, originalFilename, detectionFilePathHint) {
	if (buffer.byteLength > maxBytes) throw SaveMediaSourceError.tooLarge(maxBytes);
	const dir = resolveMediaScopedDir(subdir, "saveMediaBuffer");
	await fs.mkdir(dir, {
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
			originalFilename,
			detectionFilePathHint
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
	const readScope = captureChannelReadScope();
	readScope?.assertCurrent();
	const dir = resolveMediaScopedDir(subdir, "saveMediaStream");
	await fs.mkdir(dir, {
		recursive: true,
		mode: 448
	});
	const baseId = crypto.randomUUID();
	const headerExt = extensionForAuthoritativeHeaderMime(contentType);
	let consumptionStarted = false;
	const mediaStream = (async function* () {
		consumptionStarted = true;
		yield* stream;
	})();
	const write = async (handle) => {
		readScope?.assertCurrent();
		const { sniffBuffer, size } = await writeMediaStreamToFile({
			stream: mediaStream,
			handle,
			maxBytes,
			assertCurrent: readScope?.assertCurrent
		});
		const mime = await detectMime({
			buffer: sniffBuffer,
			headerMime: contentType,
			filePath: originalFilename ?? detectionFilePathHint
		});
		const ext = resolveSavedMediaExtension({
			detectedMime: mime,
			headerExt,
			contentType,
			originalFilename,
			detectionFilePathHint
		});
		return {
			id: buildSavedMediaId({
				baseId,
				ext,
				originalFilename
			}),
			size,
			contentType: mime
		};
	};
	return buildSavedMediaResult({
		dir,
		...await retryAfterRecreatingDir(dir, async () => {
			if (readScope) {
				const { writeReadScopeMedia } = await import("./store.read-scope-N0R87pLh.mjs");
				return await writeReadScopeMedia({
					dir,
					tempPrefix: `.${baseId}`,
					scope: readScope,
					write
				});
			}
			return (await writeSiblingTempFile({
				dir,
				mode: 420,
				tempPrefix: `.${baseId}`,
				writeTemp: async (tempPath) => {
					const handle = await fs.open(tempPath, "wx", 420);
					try {
						return await write(handle);
					} finally {
						await handle.close().catch(() => void 0);
					}
				},
				resolveFinalPath: (resultLocal) => path.join(dir, resultLocal.id)
			})).result;
		}, () => !consumptionStarted)
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
export { ensureMediaDir as a, pruneOutboundMedia as c, resolveMediaBufferPath as d, saveMediaBuffer as f, writePlaybackTranscodeCache as h, deleteMediaBuffer as i, prunePlaybackTranscodeCache as l, saveMediaStream as m, PLAYBACK_TRANSCODE_SUBDIR as n, extractOriginalFilename as o, saveMediaSource as p, cleanOldMedia as r, getMediaDir as s, MEDIA_MAX_BYTES as t, readMediaBuffer as u };
