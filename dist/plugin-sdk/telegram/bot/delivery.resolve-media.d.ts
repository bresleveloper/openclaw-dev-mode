import type { StickerMetadata, TelegramContext } from "./types.js";
export declare function resolveMedia(ctx: TelegramContext, maxBytes: number, token: string, fetchImpl?: typeof fetch): Promise<{
    path: string;
    contentType?: string;
    placeholder: string;
    stickerMetadata?: StickerMetadata;
} | null>;
