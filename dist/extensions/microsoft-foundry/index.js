import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { t as buildMicrosoftFoundryImageGenerationProvider } from "../../image-generation-provider-BgZkhHwu.mjs";
import { t as buildMicrosoftFoundryProvider } from "../../provider-CRK7POiJ.mjs";
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
