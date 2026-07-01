import { type OutboundMediaAccess } from "./load-options.js";
/** Loads a remote/local media URL and stages it into the outbound media store. */
export declare function resolveOutboundAttachmentFromUrl(mediaUrl: string, maxBytes: number, options?: {
    mediaAccess?: OutboundMediaAccess;
    localRoots?: readonly string[];
    readFile?: (filePath: string) => Promise<Buffer>;
}): Promise<{
    path: string;
    contentType?: string;
}>;
/** Stages an in-memory attachment buffer into the outbound media store. */
export declare function resolveOutboundAttachmentFromBuffer(buffer: Buffer, maxBytes: number, options?: {
    contentType?: string;
    filename?: string;
}): Promise<{
    path: string;
    contentType?: string;
}>;
