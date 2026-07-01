import type { ChannelDmAllowFromMode } from "../../channels/plugins/dm-access.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
type DoctorGroupModel = "sender" | "route" | "hybrid";
type DoctorChannelCapabilities = {
    dmAllowFromMode: ChannelDmAllowFromMode;
    groupModel: DoctorGroupModel;
    groupAllowFromFallbackToAllowFrom: boolean;
    warnOnEmptyGroupSenderAllowlist: boolean;
};
/** Resolve doctor behavior capabilities from channel metadata, plugin runtime, or defaults. */
export declare function getDoctorChannelCapabilities(channelName?: string): DoctorChannelCapabilities;
type DoctorChannelAccountIds = {
    configured: string[];
    runtime: string[];
};
/** Resolve configured and runtime account ids through the channel plugin's own semantics. */
export declare function resolveDoctorChannelAccountIds(channelName: string, cfg: OpenClawConfig, configuredAccountIds: string[]): DoctorChannelAccountIds | undefined;
export {};
