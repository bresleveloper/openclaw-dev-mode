import { buildInworldSpeechProvider } from "./speech-provider.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/inworld/index.ts
var inworld_default = definePluginEntry({
	id: "inworld",
	name: "Inworld Speech",
	description: "Bundled Inworld speech provider",
	register(api) {
		api.registerSpeechProvider(buildInworldSpeechProvider());
	}
});
export { inworld_default as default };
