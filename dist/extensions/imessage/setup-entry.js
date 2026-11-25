import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/imessage/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-CGekk3M6.mjs", import.meta.url).href),
		exportName: "imessageSetupPlugin"
	}
});
export { setup_entry_default as default };
