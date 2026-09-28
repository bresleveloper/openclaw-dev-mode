import { fileURLToPath } from "node:url";
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
//#region extensions/reef/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/channel-plugin-api-zs5EUfgw.mjs", import.meta.url).href),
		exportName: "reefPlugin"
	},
	runtime: {
		specifier: fileURLToPath(new URL(".setup/runtime-api-BSKYB2D7.mjs", import.meta.url).href),
		exportName: "setReefRuntime"
	}
});
//#endregion
export { setup_entry_default as default };
