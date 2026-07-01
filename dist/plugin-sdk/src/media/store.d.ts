import "../infra/fs-safe-defaults.js";
import { request as httpRequest } from "node:http";
import { resolvePinnedHostname } from "../infra/net/ssrf.js";
/** Default per-file media-store byte cap used by inbound staging and plugin SDK callers. */
export declare const MEDIA_MAX_BYTES: number;
type CleanOldMediaOptions = {
    recursive?: boolean;
    pruneEmptyDirs?: boolean;
};
type RequestImpl = typeof httpRequest;
type ResolvePinnedHostnameImpl = typeof resolvePinnedHostname;
/** Overrides network dependencies for media-store tests and restores defaults when omitted. */
export declare function setMediaStoreNetworkDepsForTest(deps?: {
    httpRequest?: RequestImpl;
    httpsRequest?: RequestImpl;
    resolvePinnedHostname?: ResolvePinnedHostnameImpl;
}): void;
/** Restores the caller-facing filename from media-store paths with embedded UUID suffixes. */
export declare function extractOriginalFilename(filePath: string): string;
/** Returns the configured absolute media-store root without creating it. */
export declare function getMediaDir(): string;
/** Creates the configured media-store root with private directory permissions. */
export declare function ensureMediaDir(): Promise<string>;
/** Prunes expired media files, optionally recursing into scoped media subdirectories. */
export declare function cleanOldMedia(ttlMs?: number, options?: CleanOldMediaOptions): Promise<void>;
/** Media-store file metadata returned after bytes are persisted under a safe media ID. */
export type SavedMedia = {
    id: string;
    path: string;
    size: number;
    contentType?: string;
};
/** Stable error categories for unsafe or failed source-file ingestion. */
export type SaveMediaSourceErrorCode = "invalid-path" | "not-found" | "not-file" | "path-mismatch" | "too-large";
/** Error raised when saveMediaSource cannot safely read or persist a source path. */
export declare class SaveMediaSourceError extends Error {
    code: SaveMediaSourceErrorCode;
    constructor(code: SaveMediaSourceErrorCode, message: string, options?: ErrorOptions);
}
/** Saves a local path or HTTP(S) source into the media store after MIME/size validation. */
export declare function saveMediaSource(source: string, headers?: Record<string, string>, subdir?: string, maxBytes?: number): Promise<SavedMedia>;
/** Saves an in-memory media buffer under a UUID-backed media ID. */
export declare function saveMediaBuffer(buffer: Buffer, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string): Promise<SavedMedia>;
/** Streams media into a sibling temp file before atomically publishing the final media ID. */
export declare function saveMediaStream(stream: AsyncIterable<unknown>, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string): Promise<SavedMedia>;
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
export declare function resolveMediaBufferPath(id: string, subdir?: string): Promise<string>;
/** Read result for callers that need media bytes plus the resolved file path. */
export type ReadMediaBufferResult = {
    id: string;
    path: string;
    buffer: Buffer;
    size: number;
};
/** Reads a stored media ID with the same path guards and byte limit used by writers. */
export declare function readMediaBuffer(id: string, subdir?: string, maxBytes?: number): Promise<ReadMediaBufferResult>;
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
export declare function deleteMediaBuffer(id: string, subdir?: string): Promise<void>;
export {};
