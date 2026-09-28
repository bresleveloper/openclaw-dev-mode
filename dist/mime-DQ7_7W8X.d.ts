import { r as MediaKind } from "./constants-BCpSHoXd.js";
//#region packages/media-core/src/mime.d.ts
/** Normalizes MIME strings by dropping parameters, lowercasing, and folding registered synonyms. */
declare function normalizeMimeType(mime?: string | null): string | undefined;
/** Extracts a lowercase extension from a local path or HTTP URL pathname. */
declare function getFileExtension(filePath?: string | null): string | undefined;
/** Maps a file path or URL extension to the preferred MIME type when known. */
declare function mimeTypeFromFilePath(filePath?: string | null): string | undefined;
/** Detects the best MIME type from bytes, file path, and header metadata. */
declare function detectMime(opts: {
  buffer?: Buffer;
  headerMime?: string | null;
  additionalMimeHints?: readonly (string | null | undefined)[];
  filePath?: string;
}): Promise<string | undefined>;
/** Returns the preferred file extension for a normalized or raw MIME string. */
declare function extensionForMime(mime?: string | null): string | undefined;
/** Returns true when content type or filename identifies GIF media. */
declare function isGifMedia(opts: {
  contentType?: string | null;
  fileName?: string | null;
}): boolean;
/** Normalizes a MIME string before classifying it into a media family. */
declare function kindFromMime(mime?: string | null): MediaKind | undefined;
//#endregion
export { kindFromMime as a, isGifMedia as i, extensionForMime as n, mimeTypeFromFilePath as o, getFileExtension as r, normalizeMimeType as s, detectMime as t };