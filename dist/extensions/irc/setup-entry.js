import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/irc/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/channel-plugin-api-BVh8x-TZ.mjs", import.meta.url).href),
		exportName: "ircPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-ClCcrDAz.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	}
});
//#endregion
export { setup_entry_default as default };
