/**
 * Channel message action dispatcher.
 *
 * Runs plugin-owned message actions from the shared agent tool with sender trust checks.
 */
import type { AgentToolResult } from "../../agents/runtime/index.js";
import type { ChannelMessageActionContext } from "./types.public.js";
/**
 * Runs a channel message action if the target plugin supports it.
 */
export declare function dispatchChannelMessageAction(ctx: ChannelMessageActionContext): Promise<AgentToolResult<unknown> | null>;
