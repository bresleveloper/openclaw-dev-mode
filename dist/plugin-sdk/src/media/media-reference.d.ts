type MediaReferenceErrorCode = "invalid-path" | "path-not-allowed";
/** Error raised when a media reference cannot be mapped to an allowed local media file. */
export declare class MediaReferenceError extends Error {
    code: MediaReferenceErrorCode;
    constructor(code: MediaReferenceErrorCode, message: string, options?: ErrorOptions);
}
type InboundMediaReference = {
    id: string;
    normalizedSource: string;
    physicalPath: string;
    sourceType: "uri" | "path";
};
type InboundMediaUri = {
    id: string;
    normalizedSource: string;
};
/** Strips legacy MEDIA: prefixes while preserving canonical media:// references. */
export declare function normalizeMediaReferenceSource(source: string): string;
type MediaReferenceSourceInfo = {
    hasScheme: boolean;
    hasUnsupportedScheme: boolean;
    isDataUrl: boolean;
    isFileUrl: boolean;
    isHttpUrl: boolean;
    isMediaStoreUrl: boolean;
    looksLikeWindowsDrivePath: boolean;
};
/** Classifies media reference schemes before local resolution or sandbox rewriting. */
export declare function classifyMediaReferenceSource(source: string, options?: {
    allowDataUrl?: boolean;
}): MediaReferenceSourceInfo;
/** Parses canonical inbound media-store URIs and rejects nested or cross-bucket references. */
export declare function parseInboundMediaUri(source: string): InboundMediaUri | null;
/** Rewrites inbound media-store URIs to sandbox-relative paths for staged agent inputs. */
export declare function resolveMediaReferenceSandboxPath(source: string, inboundDir?: string): {
    resolved: string;
    rewrittenFrom?: string;
};
/** Resolves inbound media:// URIs or first-level inbound file paths to concrete store files. */
export declare function resolveInboundMediaReference(source: string): Promise<InboundMediaReference | null>;
/** Converts inbound media references for callers that need a direct local file path. */
export declare function resolveMediaReferenceLocalPath(source: string): Promise<string>;
export {};
