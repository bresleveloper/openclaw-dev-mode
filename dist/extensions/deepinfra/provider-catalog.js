import { DEEPINFRA_BASE_URL } from "./media-models.js";
import { discoverDeepInfraModels } from "./provider-models.js";
import { runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { buildSingleProviderApiKeyCatalog } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/deepinfra/provider-catalog.ts
async function buildDeepInfraProvider(options) {
	const models = await discoverDeepInfraModels({
		...options,
		discoveryMode: options?.discoveryMode ?? "advisory"
	});
	return {
		baseUrl: DEEPINFRA_BASE_URL,
		api: "openai-completions",
		models
	};
}
function buildDeepInfraApiKeyCatalog(ctx) {
	return runLiveProviderCatalog({
		providerId: "deepinfra",
		run: () => buildSingleProviderApiKeyCatalog({
			ctx,
			providerId: "deepinfra",
			buildProvider: () => buildDeepInfraProvider({
				hasApiKey: true,
				discoveryMode: "strict",
				env: ctx.env,
				agentDir: ctx.agentDir
			})
		})
	});
}
//#endregion
export { buildDeepInfraApiKeyCatalog, buildDeepInfraProvider };
