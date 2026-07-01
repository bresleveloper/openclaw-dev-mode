/** Dependency-light ownership metadata for channel-contributed agent tools. */
import type { ChannelAgentTool } from "../channels/plugins/types.public.js";
type ChannelAgentToolMeta = {
    channelId: string;
};
/** Read channel metadata attached to a channel-owned agent tool. */
export declare function getChannelAgentToolMeta(tool: ChannelAgentTool): ChannelAgentToolMeta | undefined;
/** Attach channel ownership metadata to a concrete agent tool. */
export declare function setChannelAgentToolMeta(tool: ChannelAgentTool, meta: ChannelAgentToolMeta): void;
/** Copy channel metadata when wrapping or replacing a channel-owned tool. */
export declare function copyChannelAgentToolMeta(source: ChannelAgentTool, target: ChannelAgentTool): void;
export {};
