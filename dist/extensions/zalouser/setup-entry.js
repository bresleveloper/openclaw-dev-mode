import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/zalouser/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-C2yvhrvW.mjs", import.meta.url).href),
		exportName: "zalouserSetupPlugin"
	}
});
//#endregion
export { setup_entry_default as default };
