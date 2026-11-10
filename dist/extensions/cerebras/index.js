import { o as openclaw_plugin_default, r as CEREBRAS_MODEL_DISCOVERY } from "./.setup/provider-catalog-BiNR-qKR.mjs";
import { applyCerebrasConfig } from "./onboard.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { applyModelCompatPatch } from "openclaw/plugin-sdk/provider-model-shared";
var cerebras_default = defineSingleProviderPluginEntry({
	id: "cerebras",
	name: "Cerebras Provider",
	description: "Bundled Cerebras provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Cerebras",
		docsPath: "/providers/cerebras",
		manifestAuth: {
			preserveExistingPrimary: true,
			applyConfig: applyCerebrasConfig,
			noteMessage: ["Cerebras provides high-speed OpenAI-compatible inference for GPT OSS and GLM models.", "Get your API key at: https://cloud.cerebras.ai"].join("\n"),
			noteTitle: "Cerebras"
		},
		catalog: {
			discoveryMode: "strict",
			allowExplicitBaseUrl: true,
			liveModelDiscovery: CEREBRAS_MODEL_DISCOVERY
		},
		normalizeResolvedModel: ({ model }) => model.api === "openai-completions" && model.baseUrl.trim().replace(/\/+$/u, "") === "https://api.cerebras.ai/v1" ? applyModelCompatPatch(model, {
			supportsPromptCacheKey: model.compat?.supportsPromptCacheKey ?? true,
			supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? false
		}) : model
	}
});
//#endregion
export { cerebras_default as default };
