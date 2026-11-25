import { n as buildStaticOpencodeZenProviderConfig } from "./.setup/provider-catalog-7CVtc4r7.mjs";
// extensions/opencode/provider-discovery.ts
const opencodeProviderDiscovery = {
	id: "opencode",
	label: "OpenCode Zen",
	docsPath: "/providers/models",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildStaticOpencodeZenProviderConfig() })
	}
};
export { opencodeProviderDiscovery as default };
