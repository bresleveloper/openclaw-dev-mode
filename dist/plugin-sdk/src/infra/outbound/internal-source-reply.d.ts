import type { SourceReplyDeliveryMode } from "../../auto-reply/get-reply-options.types.js";
import type { ChannelThreadingToolContext } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
type InternalSourceReplySinkInput = {
    cfg: OpenClawConfig;
    action: string;
    toolContext?: ChannelThreadingToolContext;
    sessionKey?: string;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
};
/** Return whether this send resolves to the private current-run source-reply sink. */
export declare function shouldUseInternalSourceReplySink(input: InternalSourceReplySinkInput, params: Record<string, unknown>): Promise<boolean>;
export {};
