import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/tlon/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-B4gizkqE.mjs", import.meta.url).href),
		exportName: "tlonPlugin"
	}
});
export { setup_entry_default as default };
