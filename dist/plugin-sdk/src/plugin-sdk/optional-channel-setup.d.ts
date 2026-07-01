import type { ChannelSetupWizard } from "../channels/plugins/setup-wizard-types.js";
import type { ChannelSetupAdapter } from "../channels/plugins/types.adapters.js";
type OptionalChannelSetupParams = {
    /** Channel id used by setup wizard status and routing. */
    channel: string;
    /** Human-readable plugin label shown in operator-facing install guidance. */
    label: string;
    /** Package spec operators should install before running real channel setup. */
    npmSpec?: string;
    /** Docs path linked from validation and wizard status messages. */
    docsPath?: string;
};
/**
 * Creates a setup adapter for optional channel plugins that are not installed.
 * Validation returns install guidance, while config mutation fails with the same
 * message so setup flows cannot silently create partial channel config.
 */
export declare function createOptionalChannelSetupAdapter(
/** Optional plugin metadata used to build setup validation guidance. */
params: OptionalChannelSetupParams): ChannelSetupAdapter;
/**
 * Creates a wizard surface for optional channel plugins that are not installed.
 * The wizard is always unconfigured and stops finalize with install guidance.
 */
export declare function createOptionalChannelSetupWizard(
/** Optional plugin metadata used to build setup wizard status guidance. */
params: OptionalChannelSetupParams): ChannelSetupWizard;
export {};
