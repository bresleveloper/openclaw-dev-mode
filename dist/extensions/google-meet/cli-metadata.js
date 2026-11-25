import { t as GOOGLE_MEET_CLI_DESCRIPTOR } from "./.setup/cli-output-mode-DztqqVeZ.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/google-meet/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "google-meet",
	name: "Google Meet",
	description: "Google Meet CLI metadata",
	register(api) {
		api.registerCli(() => {}, { descriptors: [GOOGLE_MEET_CLI_DESCRIPTOR] });
	}
});
export { cli_metadata_default as default };
