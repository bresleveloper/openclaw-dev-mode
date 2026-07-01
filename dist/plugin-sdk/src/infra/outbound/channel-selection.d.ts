import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type DeliverableMessageChannel } from "../../utils/message-channel.js";
/** Deliverable message channel id that can be selected for message actions. */
export type MessageChannelId = DeliverableMessageChannel;
/** Source that explains how message channel selection chose its result. */
export type MessageChannelSelectionSource = "explicit" | "tool-context-fallback" | "single-configured";
/** Checks whether a channel has a non-disabled config entry. */
export declare function isConfiguredChannel(cfg: OpenClawConfig, channelId: string): boolean;
/** Lists deliverable channels with at least one enabled, configured account. */
export declare function listConfiguredMessageChannels(cfg: OpenClawConfig): Promise<MessageChannelId[]>;
/** Resolves the message action channel from explicit input, context fallback, or config. */
export declare function resolveMessageChannelSelection(params: {
    cfg: OpenClawConfig;
    channel?: string | null;
    fallbackChannel?: string | null;
}): Promise<{
    channel: MessageChannelId;
    configured: MessageChannelId[];
    source: MessageChannelSelectionSource;
}>;
export declare const testing: {
    resetLoggedChannelSelectionErrors(): void;
};
export { testing as __testing };
