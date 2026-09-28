import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { n as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-hH2FGen5.mjs";
import "../../provider-entry-Wjr777L1.mjs";
import { t as alibabaVideoGenerationProvider } from "../../video-generation-provider-CTAaeS8I.mjs";
//#region extensions/alibaba/index.ts
/**
* Alibaba Model Studio plugin entry. Registers the DashScope-backed video
* generation provider.
*/
var alibaba_default = definePluginEntry({
	id: "alibaba",
	name: "Alibaba Model Studio Plugin",
	description: "Bundled Alibaba Model Studio video provider plugin",
	register(api) {
		api.registerProvider({
			id: "alibaba",
			label: "Alibaba Model Studio",
			docsPath: "/providers/alibaba",
			envVars: [
				"MODELSTUDIO_API_KEY",
				"DASHSCOPE_API_KEY",
				"QWEN_API_KEY"
			],
			auth: [createProviderApiKeyAuthMethod({
				providerId: "alibaba",
				methodId: "api-key",
				label: "Alibaba Model Studio API key",
				optionKey: "alibabaModelStudioApiKey",
				flagName: "--alibaba-model-studio-api-key",
				envVar: "MODELSTUDIO_API_KEY",
				promptMessage: "Enter Alibaba Model Studio API key",
				wizard: {
					choiceId: "alibaba-model-studio-api-key",
					choiceLabel: "Alibaba Model Studio API key",
					groupId: "alibaba",
					groupLabel: "Alibaba Model Studio",
					groupHint: "DashScope / Model Studio API key",
					onboardingScopes: ["image-generation"]
				}
			})]
		});
		api.registerVideoGenerationProvider(alibabaVideoGenerationProvider);
	}
});
//#endregion
export { alibaba_default as default };
