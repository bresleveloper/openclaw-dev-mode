import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/zalo/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-BtMPrEUe.mjs", import.meta.url).href),
		exportName: "zaloPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-C24CjDFQ.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	}
});
export { setup_entry_default as default };
