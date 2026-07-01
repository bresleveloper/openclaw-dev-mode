import type { SsrFPolicy } from "../infra/net/ssrf.js";
import type { MediaAttachment } from "./types.js";
type MediaBufferResult = {
    buffer: Buffer;
    mime?: string;
    fileName: string;
    size: number;
};
type MediaPathResult = {
    path: string;
    cleanup?: () => Promise<void> | void;
};
/** Local/remote access policy used by the lazy media-understanding attachment cache. */
export type MediaAttachmentCacheOptions = {
    localPathRoots?: readonly string[];
    includeDefaultLocalPathRoots?: boolean;
    ssrfPolicy?: SsrFPolicy;
    workspaceDir?: string;
};
/**
 * Lazy resolver for media-understanding attachments.
 *
 * The cache prefers allowed local paths, falls back to remote URLs when a local path is blocked
 * or missing, and owns any temporary files created for providers that require a filesystem path.
 */
export declare class MediaAttachmentCache {
    private readonly entries;
    private readonly attachments;
    private readonly localPathRoots;
    private readonly ssrfPolicy;
    private readonly workspaceDir?;
    private canonicalLocalPathRoots?;
    constructor(attachments: MediaAttachment[], options?: MediaAttachmentCacheOptions);
    /** Returns attachment bytes, MIME hint, filename, and size within the requested byte limit. */
    getBuffer(params: {
        attachmentIndex: number;
        maxBytes: number;
        timeoutMs: number;
    }): Promise<MediaBufferResult>;
    /** Returns a local path for providers that cannot accept buffers, creating a temp file if needed. */
    getPath(params: {
        attachmentIndex: number;
        maxBytes?: number;
        timeoutMs: number;
    }): Promise<MediaPathResult>;
    /** Removes temporary files created by `getPath`; callers should run this after provider use. */
    cleanup(): Promise<void>;
    private ensureEntry;
    private resolveLocalPath;
    private ensureLocalStat;
    private getCanonicalLocalPathRoots;
    private readLocalBuffer;
}
export {};
