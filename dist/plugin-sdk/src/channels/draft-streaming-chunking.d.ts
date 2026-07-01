import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ChannelId } from "./plugins/types.core.js";
export type ChannelDraftStreamingChunking = {
    minChars: number;
    maxChars: number;
    breakPreference: "paragraph" | "newline" | "sentence";
};
export declare function resolveChannelDraftStreamingChunking(cfg: OpenClawConfig | undefined, channelId: ChannelId, accountId: string | null | undefined, opts: {
    fallbackLimit: number;
}): ChannelDraftStreamingChunking;
