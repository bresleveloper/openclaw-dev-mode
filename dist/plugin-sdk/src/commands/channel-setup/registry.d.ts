import type { ChannelSetupWizardAdapter } from "../../channels/plugins/setup-wizard-types.js";
import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
/** Resolve the setup wizard adapter exposed by one channel plugin, caching declarative adapters. */
export declare function resolveChannelSetupWizardAdapterForPlugin(plugin?: ChannelPlugin): ChannelSetupWizardAdapter | undefined;
