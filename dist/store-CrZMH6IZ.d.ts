import "./fs-safe-DlrPy6P_.js";
/** Restores the caller-facing filename from media-store paths with embedded UUID suffixes. */
declare function extractOriginalFilename(filePath: string): string;
/** Creates the configured media-store root with private directory permissions. */
declare function ensureMediaDir(): Promise<string>;
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
type ReadMediaBufferResult = {
  id: string;
  path: string;
  buffer: Buffer;
  size: number;
};
/** Reads a stored media ID with the same path guards and byte limit used by writers. */
declare function readMediaBuffer(id: string, subdir?: string, maxBytes?: number): Promise<ReadMediaBufferResult>;
/**
 * Deletes a stored attachment through the pinned media root.
 * Errors propagate so the caller owns best-effort cleanup policy.
 */
declare function deleteMediaBuffer(id: string, subdir?: string): Promise<void>;
export { readMediaBuffer as a, saveMediaSource as c, extractOriginalFilename as i, saveMediaStream as l, deleteMediaBuffer as n, resolveMediaBufferPath as o, ensureMediaDir as r, saveMediaBuffer as s, SavedMedia as t };