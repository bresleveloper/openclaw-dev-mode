/**
 * Input media item used by channel outbound payload builders.
 */
export type MediaPayloadInput = {
    path: string;
    contentType?: string;
};
/**
 * Legacy-compatible media payload shape consumed by plugin send helpers.
 */
export type MediaPayload = {
    MediaPath?: string;
    MediaType?: string;
    MediaUrl?: string;
    MediaPaths?: string[];
    MediaUrls?: string[];
    MediaTypes?: string[];
};
/**
 * Builds single-item and list media fields for channel outbound helpers.
 */
export declare function buildMediaPayload(mediaList: MediaPayloadInput[], opts?: {
    preserveMediaTypeCardinality?: boolean;
}): MediaPayload;
