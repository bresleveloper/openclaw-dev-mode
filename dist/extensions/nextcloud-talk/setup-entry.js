import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/nextcloud-talk/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-DNtfdfUV.mjs", import.meta.url).href),
		exportName: "nextcloudTalkPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-QMihLdr1.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	}
});
export { setup_entry_default as default };
