import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { z as resolveProviderReasoningOutputModeWithPlugin } from "./provider-runtime-BMdc4CgR.mjs";
//#region src/utils/provider-utils.ts
/**
* Provider behavior helpers shared by reply runners, embedded agents, and provider plugins.
* Keep policy here generic; provider-specific reasoning rules belong in provider runtime hooks.
*/
/**
* Returns true if the provider requires reasoning to be wrapped in tags
* (e.g. <think> and <final>) in the text stream, rather than using native
* API fields for reasoning/thinking.
*/
function isReasoningTagProvider(provider, options) {
	const normalizedProvider = normalizeOptionalString(provider);
	if (!normalizedProvider) return false;
	const { config, workspaceDir, env, runtimeHandle, modelId, modelApi, model } = options ?? {};
	return resolveProviderReasoningOutputModeWithPlugin({
		provider: normalizedProvider,
		config,
		workspaceDir,
		env,
		runtimeHandle,
		context: {
			config,
			workspaceDir,
			env,
			provider: normalizedProvider,
			modelId,
			modelApi,
			model
		}
	}) === "tagged";
}
//#endregion
export { isReasoningTagProvider as t };
