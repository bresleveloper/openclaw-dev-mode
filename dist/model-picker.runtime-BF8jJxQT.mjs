import { r as resolvePluginProvidersCore } from "./providers.runtime-CGIaZ9Jy.mjs";
import { i as runProviderPluginAuthMethod } from "./provider-auth-choice-vpsZqaxh.mjs";
import { n as resolveProviderPluginChoiceCore, r as runProviderModelSelectedHookCore, t as resolveProviderModelPickerEntries } from "./provider-wizard-DFpC4MOf.mjs";
//#region src/commands/model-picker.runtime.ts
/** Runtime dependency bundle for provider/model picker flows. */
/** Lazy runtime methods consumed by model picker command flows. */
const modelPickerRuntime = {
	resolveProviderModelPickerEntries,
	resolveProviderPluginChoice: resolveProviderPluginChoiceCore,
	runProviderModelSelectedHook: runProviderModelSelectedHookCore,
	resolvePluginProviders: resolvePluginProvidersCore,
	runProviderPluginAuthMethod
};
//#endregion
export { modelPickerRuntime };
