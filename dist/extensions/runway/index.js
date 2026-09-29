import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { n as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-Chp7QFG3.mjs";
import "../../provider-entry-D3wDLM3X.mjs";
import { t as buildRunwayVideoGenerationProvider } from "../../video-generation-provider-BMBAA-CY.mjs";
//#region extensions/runway/index.ts
var runway_default = definePluginEntry({
	id: "runway",
	name: "Runway Provider",
	description: "Bundled Runway video provider plugin",
	register(api) {
		api.registerProvider({
			id: "runway",
			label: "Runway",
			docsPath: "/providers/runway",
			envVars: ["RUNWAYML_API_SECRET", "RUNWAY_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: "runway",
				methodId: "api-key",
				label: "Runway API key",
				optionKey: "runwayApiKey",
				flagName: "--runway-api-key",
				envVar: "RUNWAYML_API_SECRET",
				promptMessage: "Enter Runway API key",
				wizard: {
					choiceId: "runway-api-key",
					choiceLabel: "Runway API key",
					groupId: "runway",
					groupLabel: "Runway",
					groupHint: "API key",
					onboardingScopes: ["image-generation"]
				}
			})]
		});
		api.registerVideoGenerationProvider(buildRunwayVideoGenerationProvider());
	}
});
//#endregion
export { runway_default as default };
