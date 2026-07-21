import { t as definePluginEntry } from "../../plugin-entry-CM_XK0Yw.js";
import { t as buildMicrosoftFoundryImageGenerationProvider } from "../../image-generation-provider-CFYRckAO.js";
import { t as buildMicrosoftFoundryProvider } from "../../provider-Cc1KEkZd.js";
//#region extensions/microsoft-foundry/index.ts
var microsoft_foundry_default = definePluginEntry({
	id: "microsoft-foundry",
	name: "Microsoft Foundry Provider",
	description: "Microsoft Foundry provider with Entra ID and API key auth",
	register(api) {
		api.registerProvider(buildMicrosoftFoundryProvider());
		api.registerImageGenerationProvider(buildMicrosoftFoundryImageGenerationProvider());
	}
});
//#endregion
export { microsoft_foundry_default as default };
