import { type MediaKind } from "./constants.js";
/** Maximum byte prefix passed to dependency MIME sniffers for bounded memory/CPU work. */
export declare const FILE_TYPE_SNIFF_MAX_BYTES: number;
/** Normalizes MIME strings by dropping parameters, lowercasing, and folding APNG to PNG. */
export declare function normalizeMimeType(mime?: string | null): string | undefined;
/** Returns the bounded buffer prefix used for dependency MIME sniffing. */
export declare function sliceMimeSniffBuffer(buffer: Buffer): Buffer;
/** Extracts a lowercase extension from a local path or HTTP URL pathname. */
export declare function getFileExtension(filePath?: string | null): string | undefined;
/** Maps a file path or URL extension to the preferred MIME type when known. */
export declare function mimeTypeFromFilePath(filePath?: string | null): string | undefined;
/** Returns true when a filename extension is a supported audio container. */
export declare function isAudioFileName(fileName?: string | null): boolean;
/** Detects the best MIME type from bytes, file path, and header metadata. */
export declare function detectMime(opts: {
    buffer?: Buffer;
    headerMime?: string | null;
    filePath?: string;
}): Promise<string | undefined>;
/** Returns the preferred file extension for a normalized or raw MIME string. */
export declare function extensionForMime(mime?: string | null): string | undefined;
/** Returns true when content type or filename identifies GIF media. */
export declare function isGifMedia(opts: {
    contentType?: string | null;
    fileName?: string | null;
}): boolean;
/** Maps image format labels from encoders/probes to MIME types. */
export declare function imageMimeFromFormat(format?: string | null): string | undefined;
/** Normalizes a MIME string before classifying it into a media family. */
export declare function kindFromMime(mime?: string | null): MediaKind | undefined;
