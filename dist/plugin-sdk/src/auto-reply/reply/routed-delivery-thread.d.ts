import type { MsgContext } from "../templating.js";
/** Prefers current inbound thread ids, falling back to persisted session thread metadata. */
export declare function resolveRoutedDeliveryThreadId(params: {
    ctx: MsgContext;
    sessionKey?: string;
}): string | number | undefined;
