import { n as defineBundledChannelSetupEntry } from "../../channel-entry-contract-Cwo7pmF2.js";
//#region extensions/feishu/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	features: { legacyStateMigrations: true },
	plugin: {
		specifier: "./setup-api.js",
		exportName: "feishuPlugin"
	},
	legacyStateMigrations: {
		specifier: "./legacy-state-migrations-api.js",
		exportName: "detectFeishuLegacyStateMigrations"
	},
	secrets: {
		specifier: "./secret-contract-api.js",
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: "./runtime-setter-api.js",
		exportName: "setFeishuRuntime"
	}
});
//#endregion
export { setup_entry_default as default };
