import { n as buildStaticOpencodeZenProviderConfig } from "./.setup/provider-catalog-XEhgAiH9.mjs";
//#region extensions/opencode/provider-discovery.ts
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
//#endregion
export { opencodeProviderDiscovery as default };
