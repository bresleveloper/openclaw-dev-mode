import { buildStaticDeepInfraProvider } from "./provider-static-catalog.js";
//#region extensions/deepinfra/provider-discovery.ts
const deepinfraProviderDiscovery = {
	id: "deepinfra",
	label: "DeepInfra",
	docsPath: "/providers/deepinfra",
	auth: [],
	catalog: {
		order: "simple",
		run: async (ctx) => {
			const { buildDeepInfraApiKeyCatalog } = await import("./provider-catalog.js");
			return await buildDeepInfraApiKeyCatalog(ctx);
		}
	},
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildStaticDeepInfraProvider() })
	}
};
//#endregion
export { deepinfraProviderDiscovery as default };
