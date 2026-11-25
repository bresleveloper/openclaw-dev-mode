import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/buzz/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-D1ClHZhd.mjs", import.meta.url).href),
		exportName: "buzzSetupPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-C4rlB4DR.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	}
});
export { setup_entry_default as default };
