import { buildLiquidDecisionProvider } from "./decision-provider.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
// extensions/liquid-ai/index.ts
var liquid_ai_default = definePluginEntry({
	id: "liquid-ai",
	name: "Liquid AI Provider",
	description: "Liquid AI native Decision provider",
	register(api) {
		api.registerProvider({
			id: "liquid-ai",
			label: "Liquid AI",
			docsPath: "/providers/liquid-ai",
			envVars: ["LIQUIDAI_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: "liquid-ai",
				methodId: "api-key",
				label: "Liquid AI API key",
				optionKey: "liquidAiApiKey",
				flagName: "--liquid-ai-api-key",
				envVar: "LIQUIDAI_API_KEY",
				promptMessage: "Enter Liquid AI API key"
			})]
		});
		api.registerDecisionProvider(buildLiquidDecisionProvider({ getImageMetadata: (buffer) => api.runtime.media.getImageMetadata(buffer) }));
	}
});
export { liquid_ai_default as default };
