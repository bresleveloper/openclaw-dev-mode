import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-N7cAUo3f.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-model-metadata";
// extensions/groq/provider-discovery.ts
const PROVIDER_ID = "groq";
const groqProviderDiscovery = {
	id: PROVIDER_ID,
	label: "Groq",
	docsPath: "/providers/groq",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildManifestModelProviderConfig({
			providerId: PROVIDER_ID,
			catalog: openclaw_plugin_default.modelCatalog.providers.groq
		}) })
	}
};
export { groqProviderDiscovery as default };
