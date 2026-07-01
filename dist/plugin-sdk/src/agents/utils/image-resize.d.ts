/**
 * Agent image resize helpers.
 *
 * Downscales base64 image content for provider payload limits using the configured image processor.
 */
import type { ImageContent } from "../../llm/types.js";
interface ImageResizeOptions {
    maxWidth?: number;
    maxHeight?: number;
    maxBytes?: number;
    jpegQuality?: number;
}
interface ResizedImage {
    data: string;
    mimeType: string;
    originalWidth: number;
    originalHeight: number;
    width: number;
    height: number;
    wasResized: boolean;
}
/**
 * Resize an image to fit within the specified max dimensions and encoded file size.
 * Returns null if the image cannot be resized below maxBytes.
 *
 * Uses Rastermill for image processing. If no Rastermill backend is available,
 * returns null.
 *
 * Strategy for staying under maxBytes:
 * 1. First resize to maxWidth/maxHeight
 * 2. Let Rastermill choose JPEG or PNG for the image transparency profile
 * 3. If still too large, search decreasing quality/compression settings
 * 4. If still too large, progressively reduce dimensions
 */
export declare function resizeImage(img: ImageContent, options?: ImageResizeOptions): Promise<ResizedImage | null>;
/**
 * Format a dimension note for resized images.
 * This helps the model understand the coordinate mapping.
 */
export declare function formatDimensionNote(result: ResizedImage): string | undefined;
export {};
