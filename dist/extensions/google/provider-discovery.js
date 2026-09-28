import { i as buildGoogleVertexStaticCatalogProvider, r as buildGoogleStaticCatalogProvider, t as resolveGoogleVertexConfigApiKey } from "./.setup/vertex-adc-config-CBXIiVjc.mjs";
//#region extensions/google/provider-discovery.ts
const googleProviderDiscovery = {
	id: "google",
	label: "Google AI Studio",
	docsPath: "/providers/models",
	auth: [],
	resolveConfigApiKey: ({ provider, env }) => provider === "google-vertex" ? resolveGoogleVertexConfigApiKey(env) : void 0,
	staticCatalog: {
		order: "simple",
		run: async () => ({ providers: {
			google: buildGoogleStaticCatalogProvider(),
			"google-vertex": buildGoogleVertexStaticCatalogProvider()
		} })
	}
};
//#endregion
export { googleProviderDiscovery as default };
