import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/line/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-RdEuQgW-.mjs", import.meta.url).href),
		exportName: "lineSetupPlugin"
	}
});
//#endregion
export { setup_entry_default as default };
