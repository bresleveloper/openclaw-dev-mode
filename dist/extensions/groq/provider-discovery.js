import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-D8U6uSHC.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-model-metadata";
//#region extensions/groq/provider-discovery.ts
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
//#endregion
export { groqProviderDiscovery as default };
