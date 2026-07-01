/** Default outbound image payload cap shared by media loaders and adapters. */
export declare const MAX_IMAGE_BYTES: number;
/** Default outbound audio payload cap shared by media loaders and adapters. */
export declare const MAX_AUDIO_BYTES: number;
/** Default outbound video payload cap shared by media loaders and adapters. */
export declare const MAX_VIDEO_BYTES: number;
/** Default outbound document payload cap shared by media loaders and adapters. */
export declare const MAX_DOCUMENT_BYTES: number;
/** Media families that share size-policy and MIME-classification behavior. */
export type MediaKind = "image" | "audio" | "video" | "document";
/** Maps a MIME type to the media family used for size limits and routing. */
export declare function mediaKindFromMime(mime?: string | null): MediaKind | undefined;
/** Returns the default byte cap for a classified media family. */
export declare function maxBytesForKind(kind: MediaKind): number;
