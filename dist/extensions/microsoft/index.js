import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { t as buildMicrosoftSpeechProvider } from "../../speech-provider-BR8_G5ZW.mjs";
//#region extensions/microsoft/index.ts
var microsoft_default = definePluginEntry({
	id: "microsoft",
	name: "Microsoft Speech",
	description: "Bundled Microsoft speech provider",
	register(api) {
		api.registerSpeechProvider(buildMicrosoftSpeechProvider());
	}
});
//#endregion
export { microsoft_default as default };
