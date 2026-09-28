import { r as openclaw_plugin_default, t as CEREBRAS_MODEL_DISCOVERY } from "./.setup/provider-catalog-CjtjKKvK.mjs";
import { applyCerebrasConfig } from "./onboard.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
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
		}
	}
});
//#endregion
export { cerebras_default as default };
