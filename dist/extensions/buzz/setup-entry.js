import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/buzz/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-ebTNvTyI.mjs", import.meta.url).href),
		exportName: "buzzSetupPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-CfJYRXZf.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	}
});
//#endregion
export { setup_entry_default as default };
