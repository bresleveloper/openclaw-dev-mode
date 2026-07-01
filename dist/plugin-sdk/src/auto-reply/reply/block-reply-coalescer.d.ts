import type { ReplyPayload } from "../types.js";
import type { BlockStreamingCoalescing } from "./block-streaming.js";
/** Coalesces many streaming reply fragments into fewer outbound payloads. */
type BlockReplyCoalescer = {
    enqueue: (payload: ReplyPayload) => void;
    flush: (options?: {
        force?: boolean;
    }) => Promise<void>;
    hasBuffered: () => boolean;
    stop: () => void;
};
/** Creates a text coalescer with idle and size-based flush behavior. */
export declare function createBlockReplyCoalescer(params: {
    config: BlockStreamingCoalescing;
    shouldAbort: () => boolean;
    onFlush: (payload: ReplyPayload) => Promise<void> | void;
}): BlockReplyCoalescer;
export {};
