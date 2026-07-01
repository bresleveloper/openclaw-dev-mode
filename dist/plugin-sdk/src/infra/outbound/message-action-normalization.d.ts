import type { ChannelMessageActionName, ChannelThreadingToolContext } from "../../channels/plugins/types.public.js";
/** Normalizes message-action args before target validation and dispatch. */
export declare function normalizeMessageActionInput(params: {
    action: ChannelMessageActionName;
    args: Record<string, unknown>;
    toolContext?: ChannelThreadingToolContext;
}): Record<string, unknown>;
