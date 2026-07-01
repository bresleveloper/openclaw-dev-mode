import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { GatewayMessageChannel } from "../utils/message-channel.js";
/** Resolved heartbeat presentation toggles after defaults/channel/account precedence. */
export type ResolvedHeartbeatVisibility = {
    /** Whether successful heartbeat content should be sent as visible chat text. */
    showOk: boolean;
    /** Whether warning/error heartbeat content should be sent as visible chat text. */
    showAlerts: boolean;
    /** Whether heartbeat status should emit indicator events for UI surfaces. */
    useIndicator: boolean;
};
/** Resolves heartbeat visibility for a channel, applying account > channel > defaults precedence. */
export declare function resolveHeartbeatVisibility(params: {
    cfg: OpenClawConfig;
    channel: GatewayMessageChannel;
    accountId?: string;
}): ResolvedHeartbeatVisibility;
