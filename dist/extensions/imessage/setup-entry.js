import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/imessage/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-oq_MryN7.mjs", import.meta.url).href),
		exportName: "imessageSetupPlugin"
	}
});
//#endregion
export { setup_entry_default as default };
