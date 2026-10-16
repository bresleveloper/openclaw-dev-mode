//#region packages/media-core/src/constants.d.ts
/** Default outbound image payload cap shared by media loaders and adapters. */
declare const MAX_IMAGE_BYTES: number;
/** Default outbound audio payload cap shared by media loaders and adapters. */
declare const MAX_AUDIO_BYTES: number;
/** Canonical media families used by attachment facts, routing, and MIME classification. */
type MediaKind = "image" | "audio" | "video" | "document" | "sticker" | "unknown";
/** Maps a MIME type to the media family used for size limits and routing. */
declare function mediaKindFromMime(mime?: string | null): MediaKind | undefined;
/** Returns the default byte cap for a classified media family. */
declare function maxBytesForKind(kind: MediaKind): number;
//#endregion
export { mediaKindFromMime as a, maxBytesForKind as i, MAX_IMAGE_BYTES as n, MediaKind as r, MAX_AUDIO_BYTES as t };