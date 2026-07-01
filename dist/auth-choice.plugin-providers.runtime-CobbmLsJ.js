import { f as resolveOwningPluginIdsForProviderRef } from "./providers-B4CBCfED.js";
import { n as resolvePluginProviders } from "./providers.runtime-CNuUkESm.js";
import { n as resolveProviderPluginChoice } from "./provider-wizard-gfVMpSjR.js";
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
	resolveProviderPluginChoice,
	resolvePluginProviders
};
//#endregion
export { authChoicePluginProvidersRuntime };
