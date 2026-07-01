/**
 * Lazy channel outbound adapter loader.
 *
 * Loads only outbound send primitives from the channel registry for cheap delivery paths.
 */
import type { ChannelId } from "../channel-id.types.js";
import type { ChannelOutboundAdapter } from "../outbound.types.js";
import type { LoadChannelOutboundAdapter } from "./load.types.js";
export declare function loadChannelOutboundAdapter(id: ChannelId): Promise<ChannelOutboundAdapter | undefined>;
export type { LoadChannelOutboundAdapter };
