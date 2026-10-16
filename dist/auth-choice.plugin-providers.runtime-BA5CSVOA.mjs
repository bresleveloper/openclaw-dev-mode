import { f as resolveOwningPluginIdsForProviderRef } from "./providers-DQUFJKZx.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-C5DbrVTq.mjs";
import { n as resolveProviderPluginChoiceCore } from "./provider-wizard-DSSehHF1.mjs";
//#region src/commands/onboard-non-interactive/local/auth-choice.plugin-providers.runtime.ts
/**
* Runtime-only provider plugin helpers for non-interactive onboarding.
*
* Kept behind a lazy boundary so ordinary local setup can infer core auth
* choices without loading plugin provider discovery.
*/
/** Provider discovery surface used by non-interactive auth-choice handling. */
const authChoicePluginProvidersRuntime = {
	resolveOwningPluginIdsForProviderRef,
	resolveProviderPluginChoice: resolveProviderPluginChoiceCore,
	resolvePluginProviders: resolvePluginProvidersCore
};
//#endregion
export { authChoicePluginProvidersRuntime };
