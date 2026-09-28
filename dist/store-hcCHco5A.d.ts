import "./fs-safe-defaults-ypw0M2Xi.js";
//#region src/media/store.d.ts
/** Restores the caller-facing filename from media-store paths with embedded UUID suffixes. */
declare function extractOriginalFilename(filePath: string): string;
/** Returns the configured absolute media-store root without creating it. */
declare function getMediaDir(): string;
/** Creates the configured media-store root with private directory permissions. */
declare function ensureMediaDir(): Promise<string>;
/** Media-store file metadata returned after bytes are persisted under a safe media ID. */
type SavedMedia = {
  id: string;
  path: string;
  size: number;
  contentType?: string;
};
/** Saves a local path or HTTP(S) source into the media store after MIME/size validation. */
declare function saveMediaSource(source: string, headers?: Record<string, string>, subdir?: string, maxBytes?: number): Promise<SavedMedia>;
/** Saves an in-memory media buffer under a UUID-backed media ID. */
declare function saveMediaBuffer(buffer: Buffer, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string): Promise<SavedMedia>;
/** Streams media into a sibling temp file before atomically publishing the final media ID. */
declare function saveMediaStream(stream: AsyncIterable<unknown>, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string): Promise<SavedMedia>;
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
declare function resolveMediaBufferPath(id: string, subdir?: string): Promise<string>;
/** Read result for callers that need media bytes plus the resolved file path. */
type ReadMediaBufferResult = {
  id: string;
  path: string;
  buffer: Buffer;
  size: number;
};
/** Reads a stored media ID with the same path guards and byte limit used by writers. */
declare function readMediaBuffer(id: string, subdir?: string, maxBytes?: number): Promise<ReadMediaBufferResult>;
//#endregion
export { readMediaBuffer as a, saveMediaSource as c, getMediaDir as i, saveMediaStream as l, ensureMediaDir as n, resolveMediaBufferPath as o, extractOriginalFilename as r, saveMediaBuffer as s, SavedMedia as t };