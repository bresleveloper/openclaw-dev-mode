import "./fs-safe-D1a5zN4L.js";
//#region src/media/store.d.ts
/** Restores the caller-facing filename from media-store paths with embedded UUID suffixes. */
declare function extractOriginalFilename(filePath: string): string;
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
declare function saveMediaBuffer(buffer: Buffer, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string, options?: {
  assertCommitAllowed?: () => void;
}): Promise<SavedMedia>;
/** Streams media into a sibling temp file before atomically publishing the final media ID. */
declare function saveMediaStream(stream: AsyncIterable<unknown>, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string, options?: {
  assertCommitAllowed?: () => void;
  durable?: boolean;
}): Promise<SavedMedia>;
/**
 * Returns a validated store path for channels that require local attachments.
 * Prefer readMediaBuffer when the caller needs bytes bound to the opened file.
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