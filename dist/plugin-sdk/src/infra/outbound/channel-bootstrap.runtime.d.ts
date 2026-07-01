import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { DeliverableMessageChannel } from "../../utils/message-channel.js";
/** Clears the per-registry channel bootstrap retry guard for isolated tests. */
export declare function resetOutboundChannelBootstrapStateForTests(): void;
/** Loads runtime plugins on demand when a selected outbound channel has only a setup shell. */
export declare function bootstrapOutboundChannelPlugin(params: {
    channel: DeliverableMessageChannel;
    cfg?: OpenClawConfig;
}): void;
