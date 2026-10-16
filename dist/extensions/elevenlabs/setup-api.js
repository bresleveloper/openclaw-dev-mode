import { t as migrateElevenLabsLegacyTalkConfig } from "./.setup/config-compat-ClsSqmpW.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/elevenlabs/setup-api.ts
var setup_api_default = definePluginEntry({
	id: "elevenlabs",
	name: "ElevenLabs Setup",
	description: "Lightweight ElevenLabs setup hooks",
	register(api) {
		api.registerConfigMigration((config) => migrateElevenLabsLegacyTalkConfig(config));
	}
});
//#endregion
export { setup_api_default as default };
