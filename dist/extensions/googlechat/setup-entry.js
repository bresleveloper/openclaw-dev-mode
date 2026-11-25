import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/googlechat/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-Bz3mVqQ5.mjs", import.meta.url).href),
		exportName: "googlechatSetupPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-CLRweErW.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	}
});
export { setup_entry_default as default };
