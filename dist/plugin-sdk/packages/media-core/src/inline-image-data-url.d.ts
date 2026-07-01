/** Prefix used to distinguish inline data URLs from remote/local image references. */
export declare const INLINE_IMAGE_DATA_URL_PREFIX = "data:";
/** Sniffs supported inline image formats from decoded bytes. */
export declare function sniffInlineImageMime(buffer: Buffer): string | undefined;
export type SanitizedInlineImageBase64 = {
    mimeType: string;
    base64: string;
};
/** Canonicalizes trusted inline image base64 and rejects malformed or non-image payloads. */
export declare function sanitizeInlineImageBase64(params: {
    mimeType: string;
    base64: string;
}): SanitizedInlineImageBase64 | undefined;
/**
 * Canonicalizes trusted inline image data URLs for persistence.
 * Accepts every image signature supported by `sanitizeInlineImageBase64`.
 */
export declare function sanitizeInlineImageDataUrlForStorage(imageUrl: string): string | undefined;
/** Canonicalizes provider-safe inline image data URLs and rejects unsupported formats. */
export declare function sanitizeInlineImageDataUrl(imageUrl: string): string | undefined;
