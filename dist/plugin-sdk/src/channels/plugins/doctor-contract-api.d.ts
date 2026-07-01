/**
 * Bundled channel doctor contract loader.
 *
 * Loads public doctor hooks for channel-owned legacy config rules and compatibility repairs.
 */
import type { LegacyConfigRule } from "../../config/legacy.shared.js";
import type { OpenClawConfig } from "../../config/types.js";
/**
 * Config returned after a bundled channel normalizes legacy compatibility state.
 */
type BundledChannelDoctorCompatibilityMutation = {
    config: OpenClawConfig;
    changes: string[];
};
/**
 * Public doctor hooks exported by bundled channel plugins.
 *
 * Doctor keeps these hooks channel-owned so core can run config repair without
 * importing plugin internals.
 */
type BundledChannelDoctorContractApi = {
    legacyConfigRules?: readonly LegacyConfigRule[];
    normalizeCompatibilityConfig?: (params: {
        cfg: OpenClawConfig;
    }) => BundledChannelDoctorCompatibilityMutation;
};
/**
 * Loads a bundled channel's public doctor contract.
 */
export declare function loadBundledChannelDoctorContractApi(channelId: string): BundledChannelDoctorContractApi | undefined;
export {};
