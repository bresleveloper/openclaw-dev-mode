import { registerDiscordSubagentHooks } from "./subagent-hooks-api.js";
import { defineBundledChannelEntry, loadBundledEntryExportSync } from "openclaw/plugin-sdk/channel-entry-contract";
//#region extensions/discord/index.ts
var discord_default = defineBundledChannelEntry({
	id: "discord",
	name: "Discord",
	description: "Discord channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "discordPlugin"
	},
	runtime: {
		specifier: "./runtime-setter-api.js",
		exportName: "setDiscordRuntime"
	},
	accountInspect: {
		specifier: "./account-inspect-api.js",
		exportName: "inspectDiscordReadOnlyAccount"
	},
	registerFull(api) {
		loadBundledEntryExportSync(import.meta.url, {
			specifier: "./activities-api.js",
			exportName: "registerDiscordActivities"
		})(api);
		registerDiscordSubagentHooks(api);
	},
	registerCapabilities(api) {
		loadBundledEntryExportSync(import.meta.url, {
			specifier: "./transcripts-source-api.js",
			exportName: "registerDiscordTranscriptSourceProvider"
		})(api);
	}
});
//#endregion
export { discord_default as default };
