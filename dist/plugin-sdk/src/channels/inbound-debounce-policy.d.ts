import type { CommandNormalizeOptions } from "../auto-reply/commands-registry.js";
import { createInboundDebouncer, type InboundDebounceCreateParams } from "../auto-reply/inbound-debounce.js";
import type { OpenClawConfig } from "../config/types.js";
/** Returns true when an inbound text event is safe to debounce before dispatch. */
export declare function shouldDebounceTextInbound(params: {
    text: string | null | undefined;
    cfg: OpenClawConfig;
    hasMedia?: boolean;
    commandOptions?: CommandNormalizeOptions;
    allowDebounce?: boolean;
}): boolean;
/** Creates a channel-scoped inbound debouncer using config/default debounce timing. */
export declare function createChannelInboundDebouncer<T>(params: Omit<InboundDebounceCreateParams<T>, "debounceMs"> & {
    cfg: OpenClawConfig;
    channel: string;
    debounceMsOverride?: number;
}): {
    debounceMs: number;
    debouncer: ReturnType<typeof createInboundDebouncer<T>>;
};
