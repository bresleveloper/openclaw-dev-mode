import { buildMoonshotProvider } from "./provider-catalog.js";
// extensions/moonshot/provider-discovery.ts
const moonshotProviderDiscovery = {
	id: "moonshot",
	label: "Moonshot",
	docsPath: "/providers/moonshot",
	aliases: ["moonshotai", "moonshot-ai"],
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildMoonshotProvider() })
	}
};
export { moonshotProviderDiscovery as default };
