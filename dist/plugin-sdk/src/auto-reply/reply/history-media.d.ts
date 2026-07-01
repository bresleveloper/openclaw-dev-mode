import type { MsgContext } from "../templating.js";
export type RecentInboundHistoryImage = {
    path: string;
    contentType: string;
    sender: string;
    messageId?: string;
};
export declare function resolveRecentInboundHistoryImages(params: {
    ctx: MsgContext;
    nowMs?: number;
    ttlMs?: number;
    limit?: number;
}): RecentInboundHistoryImage[];
export declare function appendRecentHistoryImageContext(params: {
    promptText: string;
    images: RecentInboundHistoryImage[];
}): string;
