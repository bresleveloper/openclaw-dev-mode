import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { c as isPathInside, t as FsSafeError } from "./fs-safe-BUXBSN-4.mjs";
import { _ as resolveConfigDir } from "./utils-DgZn2dLu.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import { n as extnameFromAnyPath, r as nameFromAnyPath, t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { d as normalizeMimeType, i as getFileExtension, n as detectMime, r as extensionForMime } from "./mime-CGDYrRzL.mjs";
import { t as writeSiblingTempFile$1 } from "./sibling-temp-file-Dq7F6WhU.mjs";
import { n as captureChannelReadScope } from "./channel-read-authority-CyorchNP.mjs";
import { t as SaveMediaSourceError } from "./store.shared-B3dvmzL9.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { createAsyncLock, sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
import { fileStore } from "@openclaw/fs-safe/store";
//#region src/media/store.ts
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
const DEFAULT_TTL_MS = 12e4;
const queuePlaybackCacheOperation = createAsyncLock();
function resolveMediaSubdir(subdir, caller) {
	if (typeof subdir !== "string") throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	if (!subdir || subdir === ".") return "";
	if (subdir.includes("\0") || path.isAbsolute(subdir) || path.posix.isAbsolute(subdir) || path.win32.isAbsolute(subdir)) throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	const segments = subdir.split(/[\\/]+/u);
	if (segments.some((segment) => !segment || segment === "." || segment === "..")) throw new Error(`${caller}: unsafe media subdir: ${JSON.stringify(subdir)}`);
	return path.posix.join(...segments);
}
function resolveMediaScopedDir(subdir, caller) {
	const mediaDir = getMediaDir();
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
function openMediaStore(maxBytes = MEDIA_MAX_BYTES, rootDir = getMediaDir()) {
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
function getMediaDir() {
	return path.join(resolveConfigDir(), "media");
}
/** Creates the configured media-store root with private directory permissions. */
async function ensureMediaDir() {
	const mediaDir = getMediaDir();
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
		shouldRetry: (err) => canRetry() && findErrorWithCode(err, "ENOENT") !== void 0,
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
	const mediaDir = getMediaDir();
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
		await openMediaStore(MEDIA_MAX_BYTES, scopedDir).pruneExpired({
			ttlMs,
			recursive,
			maxDepth: recursive ? void 0 : 0,
			pruneEmptyDirs: options.pruneEmptyDirs
		});
		if (options.pruneEmptyDirs) await fs.rmdir(scopedDir).catch(() => {});
	}
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
		await openMediaStore(MEDIA_MAX_BYTES, cacheDir).pruneExpired({
			ttlMs: PLAYBACK_TRANSCODE_TTL_MS,
			recursive: true,
			pruneEmptyDirs: true
		});
		await prunePlaybackTranscodeCacheToSize();
	});
}
/** Prunes stale delivery staging without touching inbound replay or SQLite-owned outgoing media. */
async function pruneOutboundMedia() {
	const context = captureOpenClawStateWorkerContext();
	const outboundDir = resolveMediaScopedDir(OUTBOUND_STAGING_SUBDIR, "pruneOutboundMedia");
	await openMediaStore(MEDIA_MAX_BYTES, outboundDir).pruneExpired({
		ttlMs: OUTBOUND_STAGING_TTL_MS,
		recursive: true,
		pruneEmptyDirs: true
	});
	const { pruneGeneratedHtmlProvenance } = await import("./generated-html-provenance-_Wp1U_Os.mjs");
	await pruneGeneratedHtmlProvenance(context);
}
/** Prunes expired non-playback media, optionally recursing into scoped subdirectories. */
async function cleanOldMedia(ttlMs = DEFAULT_TTL_MS, options = {}) {
	const context = captureOpenClawStateWorkerContext();
	await pruneNonPlaybackMedia(ttlMs, options);
	const { pruneGeneratedHtmlProvenance } = await import("./generated-html-provenance-_Wp1U_Os.mjs");
	await pruneGeneratedHtmlProvenance(context);
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
async function writeSavedMediaBuffer(params) {
	params.assertCommitAllowed?.();
	const readScope = captureChannelReadScope();
	readScope?.assertCurrent();
	const dir = resolveMediaScopedDir(params.subdir, "writeSavedMediaBuffer");
	const relativePath = resolveMediaRelativePath(params.id, params.subdir, "writeSavedMediaBuffer");
	return await retryAfterRecreatingDir(dir, async () => {
		if (readScope || params.assertCommitAllowed) {
			const { writeReadScopeMedia } = await import("./store.read-scope-BzExmtmj.mjs");
			await writeReadScopeMedia({
				dir,
				tempPrefix: `.${params.id}`,
				scope: readScope,
				assertCommitAllowed: params.assertCommitAllowed,
				durable: true,
				write: async (handle) => {
					readScope?.assertCurrent();
					params.assertCommitAllowed?.();
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
function toSaveMediaSourceError(err, maxBytes = MEDIA_MAX_BYTES) {
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
async function saveMediaSource(source, headers, subdir = "", maxBytes = MEDIA_MAX_BYTES) {
	const dir = resolveMediaScopedDir(subdir, "saveMediaSource");
	await fs.mkdir(dir, {
		recursive: true,
		mode: 448
	});
	if (hasHttpUrlPrefix(source)) {
		const { saveRemoteMediaForStore } = await import("./store.remote.runtime.js");
		return await saveRemoteMediaForStore({
			source,
			headers,
			subdir,
			maxBytes
		});
	}
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const { openLocalMediaFile } = await import("./local-media-access-tUCzW-JB.mjs");
			return await saveMediaFile(_usingCtx$1.a(await openLocalMediaFile(source, "any", { maxBytes })), subdir, maxBytes);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (err) {
		if (err instanceof FsSafeError) throw toSaveMediaSourceError(err, maxBytes);
		throw err;
	}
}
/** Copies a validated native descriptor into managed storage with bounded memory. */
async function saveMediaFile(opened, subdir, maxBytes, originalFilename, prefix) {
	if (opened.stat.size > maxBytes) throw SaveMediaSourceError.tooLarge(maxBytes);
	const stream = opened.handle.createReadStream({
		autoClose: false,
		start: prefix?.byteLength ?? 0
	});
	const source = (async function* () {
		if (prefix) yield prefix;
		yield* stream;
	})();
	try {
		return await saveMediaStream(source, void 0, subdir, maxBytes, originalFilename, opened.realPath, { durable: true });
	} finally {
		stream.destroy();
	}
}
/** Saves an in-memory media buffer under a UUID-backed media ID. */
async function saveMediaBuffer(buffer, contentType, subdir = "inbound", maxBytes = MEDIA_MAX_BYTES, originalFilename, detectionFilePathHint, options) {
	options?.assertCommitAllowed?.();
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
		buffer,
		assertCommitAllowed: options?.assertCommitAllowed
	});
	return {
		id,
		path: path.join(dir, id),
		size: buffer.byteLength,
		contentType: mime
	};
}
/** Streams media into a sibling temp file before atomically publishing the final media ID. */
async function saveMediaStream(stream, contentType, subdir = "inbound", maxBytes = MEDIA_MAX_BYTES, originalFilename, detectionFilePathHint, options) {
	options?.assertCommitAllowed?.();
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
		options?.assertCommitAllowed?.();
		const { sniffBuffer, size } = await writeMediaStreamToFile({
			stream: mediaStream,
			handle,
			maxBytes,
			assertCurrent: () => {
				readScope?.assertCurrent();
				options?.assertCommitAllowed?.();
			}
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
	const result = await retryAfterRecreatingDir(dir, async () => {
		if (readScope || options?.assertCommitAllowed) {
			const { writeReadScopeMedia } = await import("./store.read-scope-BzExmtmj.mjs");
			return await writeReadScopeMedia({
				dir,
				tempPrefix: `.${baseId}`,
				scope: readScope,
				assertCommitAllowed: options?.assertCommitAllowed,
				durable: options?.durable,
				write
			});
		}
		return (await writeSiblingTempFile$1({
			dir,
			mode: 420,
			syncTempFile: options?.durable,
			syncParentDir: options?.durable,
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
	}, () => !consumptionStarted);
	return {
		id: result.id,
		path: path.join(dir, result.id),
		size: result.size,
		contentType: result.contentType
	};
}
/**
* Returns a validated store path for channels that require local attachments.
* Prefer readMediaBuffer when the caller needs bytes bound to the opened file.
*/
async function resolveMediaBufferPath(id, subdir = "inbound") {
	try {
		var _usingCtx3 = _usingCtx();
		const relativePath = resolveMediaRelativePath(id, subdir, "resolveMediaBufferPath");
		const opened = _usingCtx3.a(await openMediaStore().open(relativePath).catch(() => null));
		if (!opened?.stat.isFile()) throw new Error(`resolveMediaBufferPath: media ID does not resolve to a file: ${JSON.stringify(id)}`);
		return opened.realPath;
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		await _usingCtx3.d();
	}
}
/** Reads a stored media ID with the same path guards and byte limit used by writers. */
async function readMediaBuffer(id, subdir = "inbound", maxBytes = MEDIA_MAX_BYTES) {
	try {
		var _usingCtx4 = _usingCtx();
		const relativePath = resolveMediaRelativePath(id, subdir, "readMediaBuffer");
		const opened = _usingCtx4.a(await openMediaStore(maxBytes).open(relativePath).catch(() => null));
		if (!opened?.stat.isFile()) throw new Error(`readMediaBuffer: media ID does not resolve to a file: ${JSON.stringify(id)}`);
		if (opened.stat.size > maxBytes) throw new FsSafeError("too-large", `readMediaBuffer: media ID ${JSON.stringify(id)} is ${opened.stat.size} bytes; maximum is ${maxBytes} bytes`);
		const buffer = await opened.handle.readFile();
		if (buffer.byteLength > maxBytes) throw new FsSafeError("too-large", `readMediaBuffer: media ID ${JSON.stringify(id)} read ${buffer.byteLength} bytes; maximum is ${maxBytes} bytes`);
		return {
			id,
			path: opened.realPath,
			buffer,
			size: buffer.byteLength
		};
	} catch (_) {
		_usingCtx4.e = _;
	} finally {
		await _usingCtx4.d();
	}
}
/**
* Deletes a stored attachment through the pinned media root.
* Errors propagate so the caller owns best-effort cleanup policy.
*/
async function deleteMediaBuffer(id, subdir = "inbound") {
	const relativePath = resolveMediaRelativePath(id, subdir, "deleteMediaBuffer");
	await openMediaStore().remove(relativePath);
}
//#endregion
export { ensureMediaDir as a, pruneOutboundMedia as c, resolveMediaBufferPath as d, saveMediaBuffer as f, writePlaybackTranscodeCache as g, saveMediaStream as h, deleteMediaBuffer as i, prunePlaybackTranscodeCache as l, saveMediaSource as m, PLAYBACK_TRANSCODE_SUBDIR as n, extractOriginalFilename as o, saveMediaFile as p, cleanOldMedia as r, getMediaDir as s, MEDIA_MAX_BYTES as t, readMediaBuffer as u };
