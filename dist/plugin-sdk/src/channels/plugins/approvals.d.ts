/**
 * Channel approval capability adapters.
 *
 * Projects plugin approval metadata into runtime approval delivery adapters.
 */
import type { ChannelApprovalAdapter, ChannelApprovalCapability } from "./types.adapters.js";
import type { ChannelPlugin } from "./types.plugin.js";
/**
 * Returns the approval capability exposed by a channel plugin.
 */
export declare function resolveChannelApprovalCapability(plugin?: Pick<ChannelPlugin, "approvalCapability"> | null): ChannelApprovalCapability | undefined;
/**
 * Projects a channel approval capability into the runtime approval adapter shape.
 */
export declare function resolveChannelApprovalAdapter(plugin?: Pick<ChannelPlugin, "approvalCapability"> | null): ChannelApprovalAdapter | undefined;
