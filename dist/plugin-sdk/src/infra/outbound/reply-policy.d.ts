import type { ReplyPayload } from "../../auto-reply/types.js";
import type { ReplyToMode } from "../../config/types.js";
/** Per-payload reply target override passed to outbound channel adapters. */
export type ReplyToOverride = {
    replyToId?: string | null | undefined;
    replyToIdSource?: ReplyToResolution["source"] | undefined;
};
/** Resolved reply target plus whether it came from payload or ambient context. */
export type ReplyToResolution = {
    replyToId?: string;
    source?: "explicit" | "implicit";
};
/** Creates a reply-to supplier that consumes implicit single-use reply ids once. */
export declare function createReplyToFanout(params: {
    replyToId?: string | null;
    replyToMode?: ReplyToMode;
    replyToIdSource?: ReplyToResolution["source"];
}): () => string | undefined;
/** Builds per-payload reply routing policy for outbound delivery batches. */
export declare function createReplyToDeliveryPolicy(params: {
    replyToId?: string | null;
    replyToMode?: ReplyToMode;
}): {
    resolveCurrentReplyTo: (payload: ReplyPayload) => ReplyToResolution;
    applyReplyToConsumption: <T extends ReplyToOverride>(overrides: T, options?: {
        consumeImplicitReply?: boolean;
    }) => T;
};
