import type { ChannelMessageAdapterShape } from "../../channels/message/types.js";
import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type DeliverableMessageChannel } from "../../utils/message-channel.js";
/** Resets outbound channel bootstrap/resolution state for isolated tests. */
export declare function resetOutboundChannelResolutionStateForTest(): void;
/** Normalizes a raw channel id and rejects non-deliverable/internal channels. */
export declare function normalizeDeliverableOutboundChannel(raw?: string | null): DeliverableMessageChannel | undefined;
/** Resolves a deliverable outbound channel plugin, optionally bootstrapping it. */
export declare function resolveOutboundChannelPlugin(params: {
    channel: string;
    cfg?: OpenClawConfig;
    allowBootstrap?: boolean;
}): ChannelPlugin | undefined;
/** Resolves the message adapter for a deliverable outbound channel. */
export declare function resolveOutboundChannelMessageAdapter(params: {
    channel: string;
    cfg?: OpenClawConfig;
    allowBootstrap?: boolean;
}): ChannelMessageAdapterShape | undefined;
