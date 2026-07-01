/** Minimal inbound media fields used by media/audio detection. */
export type InboundMediaContext = {
    Body?: unknown;
    BodyForCommands?: unknown;
    CommandBody?: unknown;
    MediaType?: unknown;
    StickerMediaIncluded?: unknown;
    SkipStickerMediaUnderstanding?: unknown;
    Sticker?: unknown;
    MediaPath?: unknown;
    MediaUrl?: unknown;
    MediaPaths?: readonly unknown[];
    MediaUrls?: readonly unknown[];
    MediaTypes?: readonly unknown[];
    RawBody?: unknown;
};
/** Returns true when the context carries current-turn media or sticker data. */
export declare function hasInboundMedia(ctx: InboundMediaContext): boolean;
/** Returns true when current-turn media still needs automatic understanding. */
export declare function hasInboundMediaForUnderstanding(ctx: InboundMediaContext): boolean;
/** Returns true when media fields or body placeholders indicate inbound audio. */
export declare function hasInboundAudio(ctx: InboundMediaContext): boolean;
