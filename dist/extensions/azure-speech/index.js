import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { t as buildAzureSpeechProvider } from "../../speech-provider-DDy23Uv5.mjs";
//#region extensions/azure-speech/index.ts
var azure_speech_default = definePluginEntry({
	id: "azure-speech",
	name: "Azure Speech",
	description: "Bundled Azure Speech provider",
	register(api) {
		api.registerSpeechProvider(buildAzureSpeechProvider());
	}
});
//#endregion
export { azure_speech_default as default };
