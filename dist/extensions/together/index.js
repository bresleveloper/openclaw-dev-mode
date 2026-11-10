import { t as applyModelCompatPatch } from "../../provider-model-compat-JoOGepWg.mjs";
import "../../provider-model-shared-B_4afNJ5.mjs";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-CKUq_-Jy.mjs";
import { t as openclaw_plugin_default } from "../../openclaw.plugin-D5sHRK8Y.mjs";
import { r as applyTogetherConnectionConfig } from "../../onboard-EIIthM2K.mjs";
import { t as buildTogetherVideoGenerationProvider } from "../../video-generation-provider-CT58Jmyl.mjs";
var together_default = defineSingleProviderPluginEntry({
	id: "together",
	name: "Together Provider",
	description: "Bundled Together provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Together",
		docsPath: "/providers/together",
		manifestAuth: { applyConfig: applyTogetherConnectionConfig },
		catalog: {
			liveModelDiscovery: true,
			discoveryMode: "strict"
		},
		normalizeResolvedModel: ({ model }) => model.api === "openai-completions" && ["https://api.together.xyz/v1", "https://api.together.ai/v1"].includes(model.baseUrl.trim().replace(/\/+$/u, "")) ? applyModelCompatPatch(model, {
			supportsPromptCacheKey: model.compat?.supportsPromptCacheKey ?? true,
			supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? false
		}) : model,
		classifyFailoverReason: ({ errorMessage }) => /\bconcurrency limit\b.*\b(?:breached|reached)\b/i.test(errorMessage) ? "rate_limit" : void 0
	},
	register(api) {
		api.registerVideoGenerationProvider(buildTogetherVideoGenerationProvider());
	}
});
//#endregion
export { together_default as default };
