import { t as definePluginEntry } from "../../plugin-entry-BZpzqykQ.js";
import { t as buildMicrosoftFoundryImageGenerationProvider } from "../../image-generation-provider-DJk2kNKB.js";
import { t as buildMicrosoftFoundryProvider } from "../../provider-Dtnocmvg.js";
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
