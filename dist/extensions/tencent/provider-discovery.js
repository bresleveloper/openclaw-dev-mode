import { buildTokenHubProvider, buildTokenPlanProvider } from "./provider-catalog.js";
//#region extensions/tencent/provider-discovery.ts
const tencentProviderDiscovery = [{
	id: "tencent-tokenhub",
	label: "Tencent TokenHub",
	docsPath: "/providers/tencent",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildTokenHubProvider() })
	}
}, {
	id: "tencent-tokenplan",
	label: "Tencent TokenPlan",
	docsPath: "/providers/tencent",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildTokenPlanProvider() })
	}
}];
//#endregion
export { tencentProviderDiscovery as default };
