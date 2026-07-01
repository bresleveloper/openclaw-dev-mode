import type { ChannelDoctorConfigMutation, ChannelDoctorEmptyAllowlistAccountContext, ChannelDoctorSequenceResult } from "../../../channels/plugins/types.adapters.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
type ChannelDoctorLookupContext = {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
};
type ChannelDoctorEmptyAllowlistLookupParams = ChannelDoctorEmptyAllowlistAccountContext & {
    cfg?: OpenClawConfig;
};
export type ChannelDoctorEmptyAllowlistPolicyHooks = {
    /** Collect plugin-specific warning lines for a configured channel/account allowlist. */
    extraWarningsForAccount: (params: ChannelDoctorEmptyAllowlistAccountContext) => string[];
    /** Let a channel doctor suppress the generic empty group-allowlist warning. */
    shouldSkipDefaultEmptyGroupAllowlistWarning: (params: ChannelDoctorEmptyAllowlistAccountContext) => boolean;
};
/** Build cached empty-allowlist hooks backed by channel doctor adapters. */
export declare function createChannelDoctorEmptyAllowlistPolicyHooks(context: ChannelDoctorLookupContext): ChannelDoctorEmptyAllowlistPolicyHooks;
/** Run interactive/non-interactive channel setup repair sequences and collect notes. */
export declare function runChannelDoctorConfigSequences(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    shouldRepair: boolean;
}): Promise<ChannelDoctorSequenceResult>;
/** Collect compatibility migrations from configured channel doctor adapters in order. */
export declare function collectChannelDoctorCompatibilityMutations(cfg: OpenClawConfig, options?: {
    env?: NodeJS.ProcessEnv;
}): ChannelDoctorConfigMutation[];
/** Collect stale channel config cleanup mutations from configured channel doctor adapters. */
export declare function collectChannelDoctorStaleConfigMutations(cfg: OpenClawConfig, options?: {
    env?: NodeJS.ProcessEnv;
    channelIds?: readonly string[];
}): Promise<ChannelDoctorConfigMutation[]>;
/** Collect channel-specific doctor preview warnings for configured channels. */
export declare function collectChannelDoctorPreviewWarnings(params: {
    cfg: OpenClawConfig;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
}): Promise<string[]>;
/** Collect warnings for mutable channel allowlists that doctor cannot safely edit. */
export declare function collectChannelDoctorMutableAllowlistWarnings(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<string[]>;
/** Collect channel repair mutations and warning-only repair results from doctor adapters. */
export declare function collectChannelDoctorRepairMutations(params: {
    cfg: OpenClawConfig;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
}): Promise<ChannelDoctorConfigMutation[]>;
/** Collect plugin-provided empty allowlist warning lines for one channel/account context. */
export declare function collectChannelDoctorEmptyAllowlistExtraWarnings(params: ChannelDoctorEmptyAllowlistLookupParams): string[];
/** Return true when a channel doctor owns empty group-allowlist warning behavior. */
export declare function shouldSkipChannelDoctorDefaultEmptyGroupAllowlistWarning(params: ChannelDoctorEmptyAllowlistLookupParams): boolean;
export {};
