import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { n as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-Cg1OHhgW.mjs";
import "../../provider-auth-api-key-uE6qOqkQ.mjs";
import { t as buildKieVideoGenerationProvider } from "../../video-generation-provider-DC_PoQZD.mjs";
//#region extensions/kie/index.ts
var kie_default = definePluginEntry({
	id: "kie",
	name: "Kie AI Provider",
	description: "Bundled Kie AI video provider plugin",
	register(api) {
		api.registerProvider({
			id: "kie",
			label: "Kie AI",
			docsPath: "/providers/kie",
			envVars: ["KIE_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: "kie",
				methodId: "api-key",
				label: "Kie AI API key",
				optionKey: "kieApiKey",
				flagName: "--kie-api-key",
				envVar: "KIE_API_KEY",
				promptMessage: "Enter Kie AI API key",
				wizard: {
					choiceId: "kie-api-key",
					choiceLabel: "Kie AI API key",
					groupId: "kie",
					groupLabel: "Kie AI",
					groupHint: "Video generation",
					onboardingScopes: ["image-generation"]
				}
			})]
		});
		api.registerVideoGenerationProvider(buildKieVideoGenerationProvider());
	}
});
//#endregion
export { kie_default as default };
