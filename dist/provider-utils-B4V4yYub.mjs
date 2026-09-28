import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { D as resolveProviderReasoningOutputModeWithPlugin } from "./provider-runtime-DTb_RnE4.mjs";
import { d as readPersistedMediaFacts, s as isMeaningfulMediaFact } from "./media-facts-BEHTU0wM.mjs";
//#region src/sessions/user-turn-media.ts
const MEDIA_ONLY_USER_TEXT = "[User sent media without caption]";
function hasPersistedMedia(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return false;
	return (readPersistedMediaFacts(message) ?? []).some(isMeaningfulMediaFact);
}
//#endregion
//#region src/utils/provider-utils.ts
/**
* Provider behavior helpers shared by reply runners, embedded agents, and provider plugins.
* Keep policy here generic; provider-specific reasoning rules belong in provider runtime hooks.
*/
/**
* Resolves whether a provider should emit reasoning via native fields or tagged text,
* using provider runtime hooks when available and defaulting to native output.
*/
function resolveReasoningOutputMode(params) {
	const provider = normalizeOptionalString(params.provider);
	if (!provider) return "native";
	const pluginMode = resolveProviderReasoningOutputModeWithPlugin({
		provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		runtimeHandle: params.runtimeHandle,
		context: {
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			provider,
			modelId: params.modelId,
			modelApi: params.modelApi,
			model: params.model
		}
	});
	if (pluginMode) return pluginMode;
	return "native";
}
/**
* Returns true if the provider requires reasoning to be wrapped in tags
* (e.g. <think> and <final>) in the text stream, rather than using native
* API fields for reasoning/thinking.
*/
function isReasoningTagProvider(provider, options) {
	return resolveReasoningOutputMode({
		provider,
		config: options?.config,
		workspaceDir: options?.workspaceDir,
		env: options?.env,
		modelId: options?.modelId,
		modelApi: options?.modelApi,
		model: options?.model,
		runtimeHandle: options?.runtimeHandle
	}) === "tagged";
}
//#endregion
export { MEDIA_ONLY_USER_TEXT as n, hasPersistedMedia as r, isReasoningTagProvider as t };
