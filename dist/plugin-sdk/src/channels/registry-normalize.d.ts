import type { ChannelId } from "./plugins/channel-id.types.js";
/** Normalizes user/config channel identifiers so aliases resolve to canonical channel ids. */
export declare function normalizeAnyChannelId(raw?: string | null): ChannelId | null;
