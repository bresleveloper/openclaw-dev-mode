import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/synology-chat/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-DQlUZLvz.mjs", import.meta.url).href),
		exportName: "synologyChatPlugin"
	}
});
export { setup_entry_default as default };
