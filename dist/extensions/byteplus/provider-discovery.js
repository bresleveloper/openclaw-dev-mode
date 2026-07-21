import { t as BYTEPLUS_PROVIDER_CATALOG_ENTRIES } from "../../provider-catalog-BGlbrSQF.js";
//#region extensions/byteplus/provider-discovery.ts
const bytePlusProviderDiscovery = BYTEPLUS_PROVIDER_CATALOG_ENTRIES.map(({ id, label, buildProvider }) => ({
	id,
	label,
	docsPath: "/providers/models",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildProvider() })
	}
}));
//#endregion
export { bytePlusProviderDiscovery as default };
