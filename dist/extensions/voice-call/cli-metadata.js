import { VOICE_CALL_CLI_DESCRIPTOR } from "./cli-output-mode.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/voice-call/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "voice-call",
	name: "Voice Call",
	description: "Voice call channel plugin",
	register(api) {
		api.registerCli(() => {}, {
			commands: ["voicecall"],
			descriptors: [VOICE_CALL_CLI_DESCRIPTOR]
		});
	}
});
//#endregion
export { cli_metadata_default as default };
