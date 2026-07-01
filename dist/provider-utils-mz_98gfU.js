import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { D as resolveProviderReasoningOutputModeWithPlugin } from "./provider-runtime-D4NEMgBr.js";
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
export { isReasoningTagProvider as t };
