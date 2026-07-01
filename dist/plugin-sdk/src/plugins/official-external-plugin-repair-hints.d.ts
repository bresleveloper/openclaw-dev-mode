/** Builds doctor/install repair hints for missing official external plugin owners. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Repair hint for installing an official external plugin that owns a missing surface. */
export type OfficialExternalPluginRepairHint = {
    pluginId: string;
    channelId?: string;
    label: string;
    installSpec: string;
    installCommand: string;
    doctorFixCommand: string;
    repairHint: string;
};
/** Resolves install/doctor commands for an official external plugin or channel id. */
export declare function resolveOfficialExternalPluginRepairHint(pluginIdOrChannelId: string): OfficialExternalPluginRepairHint | null;
/** Resolves a repair hint only when a missing configured channel is blocked by no plugin owner. */
export declare function resolveMissingOfficialExternalChannelPluginRepairHint(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    channelId: string;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): OfficialExternalPluginRepairHint | null;
