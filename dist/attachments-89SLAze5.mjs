import { s as readFileHandleBounded } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError, u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-QODkv80i.mjs";
import { t as buildRandomTempFilePath } from "./temp-download-CsPRoMV8.mjs";
import { r as mergeInboundPathRoots, t as isInboundPathAllowed } from "./inbound-path-policy-DQ5Rksw7.mjs";
import { a as getSessionSafeDefaultMediaLocalRoots } from "./local-roots-CfRBR4Iu.mjs";
import { i as normalizeMediaReferenceSource, o as resolveInboundMediaReference, r as classifyMediaReferenceSource } from "./media-reference-CtGDBk0x.mjs";
import { r as readRemoteMediaBuffer, t as MediaFetchError } from "./fetch-BtTl3cm9.mjs";
import { i as normalizeAttachmentPath, n as isImageAttachment, r as isVideoAttachment, t as isAudioAttachment } from "./attachments.normalize-Bc-RMc93.mjs";
import { n as classifyAttachmentBytes } from "./attachment-classify-BJQ0y7ye.mjs";
import { realpathSync, statSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/media-understanding/attachments.select.ts
const DEFAULT_MAX_ATTACHMENTS = 1;
function orderAttachments(attachments, prefer) {
	if (prefer === "last") return attachments.toReversed();
	if (prefer === "path" || prefer === "url") {
		const preferred = [];
		const remaining = [];
		for (const item of attachments) (item[prefer] ? preferred : remaining).push(item);
		return [...preferred, ...remaining];
	}
	return attachments;
}
function isAttachmentRecord(value) {
	if (!value || typeof value !== "object") return false;
	const entry = value;
	if (typeof entry.index !== "number") return false;
	if (entry.path !== void 0 && typeof entry.path !== "string") return false;
	if (entry.url !== void 0 && typeof entry.url !== "string") return false;
	if (entry.mime !== void 0 && typeof entry.mime !== "string") return false;
	if (entry.alreadyTranscribed !== void 0 && typeof entry.alreadyTranscribed !== "boolean") return false;
	return true;
}
/** Selects attachments for a media-understanding capability under configured ordering limits. */
function selectAttachments(params) {
	const { capability, attachments, policy } = params;
	const matches = (Array.isArray(attachments) ? attachments : []).filter((item) => {
		if (!isAttachmentRecord(item)) return false;
		if (capability === "audio" && item.alreadyTranscribed) return false;
		if (capability === "image") return isImageAttachment(item);
		if (capability === "audio") return isAudioAttachment(item);
		return isVideoAttachment(item);
	});
	if (matches.length === 0) return {
		selected: [],
		droppedAttachmentIndexes: []
	};
	const ordered = orderAttachments(matches, policy?.prefer);
	const mode = policy?.mode ?? "first";
	const maxAttachments = policy?.maxAttachments ?? DEFAULT_MAX_ATTACHMENTS;
	const limit = mode === "all" ? Math.max(1, maxAttachments) : 1;
	return {
		selected: ordered.slice(0, limit),
		droppedAttachmentIndexes: ordered.slice(limit).map((attachment) => attachment.index)
	};
}
//#endregion
//#region packages/media-understanding-common/src/errors.ts
/** Error used when a media attachment should be skipped without failing the whole request. */
var MediaUnderstandingSkipError = class extends Error {
	constructor(reason, message) {
		super(message);
		this.reason = reason;
		this.name = "MediaUnderstandingSkipError";
	}
};
/** Narrow unknown errors to media-understanding skip errors. */
function isMediaUnderstandingSkipError(err) {
	return err instanceof MediaUnderstandingSkipError;
}
//#endregion
//#region src/media-understanding/attachments.cache.ts
const REMOTE_MEDIA_FETCH_RETRY = {
	attempts: 3,
	minDelayMs: 500,
	maxDelayMs: 3e3,
	jitter: .2
};
let defaultLocalPathRoots;
function inboundStoreRef(url) {
	const value = normalizeMediaReferenceSource(url ?? "");
	return value && classifyMediaReferenceSource(value).isMediaStoreUrl ? value : void 0;
}
/** Returns the attachment URL only when it is an HTTP(S) remote source. */
function remoteFetchUrl(url) {
	const value = normalizeMediaReferenceSource(url ?? "");
	return value && classifyMediaReferenceSource(value).isHttpUrl ? value : void 0;
}
function concreteMime(mime) {
	const normalized = mime?.trim();
	if (!normalized || normalized.endsWith("/*") || normalized === "application/octet-stream") return;
	return normalized;
}
function getDefaultLocalPathRoots() {
	defaultLocalPathRoots ??= mergeInboundPathRoots(getSessionSafeDefaultMediaLocalRoots());
	return defaultLocalPathRoots;
}
function resolveUsableLocalCandidate(candidate, roots) {
	try {
		const realPath = realpathSync(candidate);
		const canonicalRoots = roots.map((root) => {
			if (root.includes("*")) return root;
			try {
				return realpathSync(root);
			} catch {
				return root;
			}
		});
		return statSync(realPath).isFile() && isInboundPathAllowed({
			filePath: realPath,
			roots: canonicalRoots
		}) ? candidate : void 0;
	} catch {
		return;
	}
}
/**
* Lazy resolver for media-understanding attachments.
*
* The cache prefers allowed local paths, falls back to remote URLs when a local path is blocked
* or missing, and owns any temporary files created for providers that require a filesystem path.
*/
var MediaAttachmentCache = class {
	constructor(attachments, options) {
		this.entries = /* @__PURE__ */ new Map();
		this.stagedPaths = /* @__PURE__ */ new Set();
		this.attachments = attachments;
		this.ssrfPolicy = options?.ssrfPolicy;
		this.localPathRoots = options?.includeDefaultLocalPathRoots === false ? mergeInboundPathRoots(options.localPathRoots) : mergeInboundPathRoots(options?.localPathRoots, getDefaultLocalPathRoots());
		this.fallbackWorkspaceDir = options?.workspaceDir;
		for (const attachment of attachments) this.entries.set(attachment.index, { attachment });
	}
	/** Returns attachment bytes, MIME hint, filename, and size within the requested byte limit. */
	async getBuffer(params) {
		const entry = await this.ensureEntry(params.attachmentIndex);
		const url = remoteFetchUrl(entry.attachment.url);
		if (entry.bufferResult) {
			if (entry.bufferResult.size > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			return entry.bufferResult;
		}
		do {
			if (!entry.resolvedPath) continue;
			try {
				const local = await this.readEntryLocalBuffer(entry, params);
				if (local) return local;
			} catch (err) {
				if (!this.recordRecoverableLocalError(entry, err)) throw err;
			}
		} while (await this.activateStoreAlias(entry));
		if (!url) throw entry.lastLocalError ?? new MediaUnderstandingSkipError("empty", `Attachment ${params.attachmentIndex + 1} has no path or URL.`);
		try {
			const fetched = await readRemoteMediaBuffer({
				url,
				timeoutMs: params.timeoutMs,
				maxBytes: params.maxBytes,
				ssrfPolicy: this.ssrfPolicy,
				retry: REMOTE_MEDIA_FETCH_RETRY
			});
			const classification = await classifyAttachmentBytes({
				buffer: fetched.buffer,
				name: fetched.fileName ?? url,
				declaredMime: concreteMime(entry.attachment.mime),
				additionalMimeHints: [fetched.contentType]
			});
			entry.bufferResult = {
				buffer: fetched.buffer,
				classification,
				mime: classification.mime,
				fileName: fetched.fileName ?? `media-${params.attachmentIndex + 1}`,
				size: fetched.buffer.length
			};
			return entry.bufferResult;
		} catch (err) {
			if (err instanceof MediaFetchError && err.code === "max_bytes") throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			if (isAbortError(err)) throw new MediaUnderstandingSkipError("timeout", `Attachment ${params.attachmentIndex + 1} timed out while fetching.`);
			throw err;
		}
	}
	/** Reads the entry's currently resolved local file, or undefined once it is ruled out. */
	async readEntryLocalBuffer(entry, params) {
		let opened = await this.prepareLocalFile(entry);
		let buffer;
		try {
			if (!entry.resolvedPath) return;
			if (entry.statSize !== void 0 && entry.statSize > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			opened ??= await openLocalFileSafely({ filePath: entry.resolvedPath });
			if (opened.stat.size > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			const canonicalRoots = await this.getCanonicalLocalPathRoots();
			if (!isInboundPathAllowed({
				filePath: opened.realPath,
				roots: canonicalRoots
			})) throw new MediaUnderstandingSkipError("blocked", `Attachment ${params.attachmentIndex + 1} path is outside allowed roots.`);
			buffer = await readFileHandleBounded(opened.handle, params.maxBytes);
		} catch (err) {
			if (err instanceof FsSafeError) {
				if (err.code === "too-large") throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
				if (err.code === "not-file" || err.code === "not-found") throw new MediaUnderstandingSkipError("empty", `Attachment ${params.attachmentIndex + 1} path is not a regular file.`);
				throw new MediaUnderstandingSkipError("blocked", `Attachment ${params.attachmentIndex + 1} path is outside allowed roots.`);
			}
			throw err;
		} finally {
			await opened?.handle.close().catch(() => {});
		}
		const filePath = opened.realPath;
		entry.resolvedPath = filePath;
		const classification = await classifyAttachmentBytes({
			buffer,
			name: filePath,
			declaredMime: concreteMime(entry.attachment.mime)
		});
		entry.bufferResult = {
			buffer,
			classification,
			mime: classification.mime,
			fileName: path.basename(filePath) || `media-${params.attachmentIndex + 1}`,
			size: buffer.length,
			localPath: filePath
		};
		return entry.bufferResult;
	}
	recordRecoverableLocalError(entry, err) {
		if (!(err instanceof MediaUnderstandingSkipError) || err.reason !== "blocked" && err.reason !== "empty") return false;
		entry.lastLocalError = err;
		return true;
	}
	async activateStoreAlias(entry) {
		if (entry.storeAliasAttempted) return false;
		entry.storeAliasAttempted = true;
		const storeRef = inboundStoreRef(entry.attachment.url);
		if (!storeRef) return false;
		const inboundReference = await resolveInboundMediaReference(storeRef).catch(() => null);
		if (!inboundReference || inboundReference.physicalPath === entry.resolvedPath) return false;
		entry.resolvedPath = inboundReference.physicalPath;
		entry.statSize = void 0;
		return true;
	}
	/** Returns a local path for providers that cannot accept buffers, creating a temp file if needed. */
	async getPath(params) {
		const entry = await this.ensureEntry(params.attachmentIndex);
		do {
			if (!entry.resolvedPath) continue;
			try {
				await (await this.prepareLocalFile(entry))?.handle.close().catch(() => {});
				const size = entry.statSize;
				if (entry.resolvedPath) {
					if (size !== void 0 && size > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
					return entry.resolvedPath;
				}
			} catch (err) {
				if (!this.recordRecoverableLocalError(entry, err)) throw err;
			}
		} while (await this.activateStoreAlias(entry));
		if (entry.tempPath) {
			if (entry.bufferResult && entry.bufferResult.size > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			return entry.tempPath;
		}
		const bufferResult = await this.getBuffer(params);
		const extension = path.extname(bufferResult.fileName || "") || "";
		const tmpPath = buildRandomTempFilePath({
			prefix: "openclaw-media",
			extension
		});
		this.stagedPaths.add(tmpPath);
		await fs$1.writeFile(tmpPath, bufferResult.buffer).catch(async (error) => {
			await this.removeStagedPath(tmpPath);
			throw error;
		});
		entry.tempPath = tmpPath;
		return tmpPath;
	}
	/** Removes temporary files created by `getPath`; callers should run this after provider use. */
	async cleanup() {
		const paths = [...this.stagedPaths];
		for (const entry of this.entries.values()) entry.tempPath = void 0;
		await Promise.all(paths.map((tmpPath) => this.removeStagedPath(tmpPath)));
	}
	async removeStagedPath(tmpPath) {
		try {
			await fs$1.unlink(tmpPath);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) return;
		}
		this.stagedPaths.delete(tmpPath);
	}
	/** Drops this cache's bytes after terminal file processing; earlier borrowers keep ownership. */
	releaseBuffer(attachmentIndex) {
		const entry = this.entries.get(attachmentIndex);
		if (entry) entry.bufferResult = void 0;
	}
	async ensureEntry(attachmentIndex) {
		const existing = this.entries.get(attachmentIndex);
		if (existing) {
			if (!existing.localResolutionAttempted) {
				existing.resolvedPath = await this.resolveLocalPath(existing.attachment);
				existing.localResolutionAttempted = true;
			}
			return existing;
		}
		const attachment = this.attachments.find((item) => item.index === attachmentIndex) ?? { index: attachmentIndex };
		const entry = {
			attachment,
			resolvedPath: await this.resolveLocalPath(attachment),
			localResolutionAttempted: true
		};
		this.entries.set(attachmentIndex, entry);
		return entry;
	}
	async resolveLocalPath(attachment) {
		const rawPath = normalizeAttachmentPath(attachment.path);
		if (!rawPath) return;
		const inboundReference = await resolveInboundMediaReference(rawPath).catch(() => null);
		if (inboundReference) return inboundReference.physicalPath;
		const workspaceDir = attachment.workspaceDir ?? this.fallbackWorkspaceDir;
		if (workspaceDir) return path.resolve(workspaceDir, rawPath);
		if (!path.isAbsolute(rawPath)) {
			const usableCwdCandidate = resolveUsableLocalCandidate(path.resolve(rawPath), this.localPathRoots);
			if (usableCwdCandidate) return usableCwdCandidate;
			const usableStateCandidate = resolveUsableLocalCandidate(path.resolve(resolveStateDir(), rawPath), this.localPathRoots);
			if (usableStateCandidate) return usableStateCandidate;
		}
		return path.resolve(rawPath);
	}
	/** Transfers a newly validated handle to the caller; cached path metadata needs no open. */
	async prepareLocalFile(entry) {
		if (!entry.resolvedPath) return;
		if (!isInboundPathAllowed({
			filePath: entry.resolvedPath,
			roots: this.localPathRoots
		})) {
			const canonicalRoots = await this.getCanonicalLocalPathRoots();
			const candidatePath = entry.resolvedPath;
			const canonicalPath = await fs$1.realpath(candidatePath).catch(() => candidatePath);
			if (!isInboundPathAllowed({
				filePath: canonicalPath,
				roots: canonicalRoots
			})) {
				entry.resolvedPath = void 0;
				if (shouldLogVerbose()) logVerbose(`Blocked attachment path outside allowed roots: ${entry.attachment.path ?? entry.attachment.url ?? "(unknown)"}`);
				throw new MediaUnderstandingSkipError("blocked", `Attachment ${entry.attachment.index + 1} path is outside allowed roots.`);
			}
		}
		if (entry.statSize !== void 0) return;
		let opened;
		try {
			opened = await openLocalFileSafely({ filePath: entry.resolvedPath });
			const canonicalRoots = await this.getCanonicalLocalPathRoots();
			if (!isInboundPathAllowed({
				filePath: opened.realPath,
				roots: canonicalRoots
			})) {
				entry.resolvedPath = void 0;
				if (shouldLogVerbose()) logVerbose(`Blocked canonicalized attachment path outside allowed roots: ${opened.realPath}`);
				throw new MediaUnderstandingSkipError("blocked", `Attachment ${entry.attachment.index + 1} path is outside allowed roots.`);
			}
			entry.resolvedPath = opened.realPath;
			entry.statSize = opened.stat.size;
			return opened;
		} catch (err) {
			await opened?.handle.close().catch(() => {});
			if (err instanceof MediaUnderstandingSkipError) throw err;
			if (err instanceof FsSafeError) {
				entry.resolvedPath = void 0;
				if (err.code === "not-file") throw new MediaUnderstandingSkipError("empty", `Attachment ${entry.attachment.index + 1} path is not a regular file.`);
				if (err.code !== "not-found") throw new MediaUnderstandingSkipError("blocked", `Attachment ${entry.attachment.index + 1} path is outside allowed roots.`);
			} else throw new MediaUnderstandingSkipError("blocked", `Attachment ${entry.attachment.index + 1} could not be canonicalized.`);
			entry.resolvedPath = void 0;
			if (shouldLogVerbose()) logVerbose(`Failed to read attachment ${entry.attachment.index + 1}: ${String(err)}`);
			return;
		}
	}
	async getCanonicalLocalPathRoots() {
		if (this.canonicalLocalPathRoots) return await this.canonicalLocalPathRoots;
		this.canonicalLocalPathRoots = (async () => mergeInboundPathRoots(this.localPathRoots, await Promise.all(this.localPathRoots.map(async (root) => {
			if (root.includes("*")) return root;
			return await fs$1.realpath(root).catch(() => root);
		}))))();
		return await this.canonicalLocalPathRoots;
	}
};
//#endregion
export { selectAttachments as i, MediaUnderstandingSkipError as n, isMediaUnderstandingSkipError as r, MediaAttachmentCache as t };
