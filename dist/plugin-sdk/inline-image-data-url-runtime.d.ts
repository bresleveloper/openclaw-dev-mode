//#region packages/media-core/src/inline-image-data-url.d.ts
/** Prefix used to distinguish inline data URLs from remote/local image references. */
declare const INLINE_IMAGE_DATA_URL_PREFIX = "data:";
/** Sniffs supported inline image formats from decoded bytes. */
declare function sniffInlineImageMime(buffer: Buffer): string | undefined;
/** Canonicalizes provider-safe inline image data URLs and rejects unsupported formats. */
declare function sanitizeInlineImageDataUrl(imageUrl: string): string | undefined;
//#endregion
export { INLINE_IMAGE_DATA_URL_PREFIX, sanitizeInlineImageDataUrl, sniffInlineImageMime };