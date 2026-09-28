import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/synology-chat/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-j67wWZz4.mjs", import.meta.url).href),
		exportName: "synologyChatPlugin"
	}
});
//#endregion
export { setup_entry_default as default };
