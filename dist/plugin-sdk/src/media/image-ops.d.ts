import { type ImageProbe, type ImageMetadata } from "rastermill";
export type { ImageMetadata, ImageProbe };
/** OpenClaw-facing image backend availability error, preserving the failed operation and causes. */
export declare class ImageProcessorUnavailableError extends Error {
    readonly code = "IMAGE_PROCESSOR_UNAVAILABLE";
    readonly operation: string;
    readonly causes: unknown[];
    constructor(operation: string, message?: string, causes?: unknown[]);
}
/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
export type ResizeToJpegParams = {
    buffer: Buffer;
    maxSide: number;
    quality: number;
    withoutEnlargement?: boolean;
};
/** PNG resize request passed through the media-runtime/plugin SDK surface. */
export type ResizeToPngParams = {
    buffer: Buffer;
    maxSide: number;
    compressionLevel?: number;
    withoutEnlargement?: boolean;
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
export declare const IMAGE_REDUCE_QUALITY_STEPS: readonly [85, 75, 65, 55, 45, 35];
/** Shared input/output pixel cap for Rastermill-backed image operations. */
export declare const MAX_IMAGE_INPUT_PIXELS = 25000000;
/** Creates a Rastermill processor with OpenClaw temp-dir, pixel-limit, and command trust policy. */
export declare function createImageProcessor(): import("rastermill").Rastermill;
/** Detects either OpenClaw's wrapper error or Rastermill's native unavailable error. */
export declare function isImageProcessorUnavailableError(err: unknown): boolean;
/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
export declare function buildImageResizeSideGrid(maxSide: number, sideStart: number): number[];
/** Reads dimensions from image header bytes without invoking a full image decode. */
export declare function readImageMetadataFromHeader(buffer: Buffer): ImageMetadata | null;
/** Reads image probe data from header bytes without invoking a full image decode. */
export declare function readImageProbeFromHeader(buffer: Buffer): ImageProbe | null;
/** Fully probes image dimensions through Rastermill when header-only metadata is insufficient. */
export declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Normalizes EXIF orientation when possible while leaving bytes unchanged if the backend is unavailable. */
export declare function normalizeExifOrientation(buffer: Buffer): Promise<Buffer>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
export declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
/** Converts HEIC/HEIF-like image bytes into JPEG through the shared image processor. */
export declare function convertHeicToJpeg(buffer: Buffer): Promise<Buffer>;
/** Detects alpha support using a full transparency probe, falling back to trusted header metadata. */
export declare function hasAlphaChannel(buffer: Buffer): Promise<boolean>;
/** Resizes or encodes image bytes as PNG through the shared image processor. */
export declare function resizeToPng(params: ResizeToPngParams): Promise<Buffer>;
/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
export declare function optimizeImageToPng(buffer: Buffer, maxBytes: number, options?: {
    sides?: readonly number[];
}): Promise<{
    buffer: Buffer;
    optimizedSize: number;
    resizeSide: number;
    compressionLevel: number;
}>;
