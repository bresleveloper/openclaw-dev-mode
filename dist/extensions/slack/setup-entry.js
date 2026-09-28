import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/slack/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-dLPkL06L.mjs", import.meta.url).href),
		exportName: "slackSetupPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-D9UfYujm.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: fileURLToPath(new URL(".setup/runtime-setter-api-CMFvhrAr.mjs", import.meta.url).href),
		exportName: "setSlackRuntime"
	}
});
//#endregion
export { setup_entry_default as default };
