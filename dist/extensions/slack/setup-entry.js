import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/slack/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-UWUSCOAK.mjs", import.meta.url).href),
		exportName: "slackSetupPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-DaCXZ47j.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: fileURLToPath(new URL(".setup/runtime-setter-api-DrXr965r.mjs", import.meta.url).href),
		exportName: "setSlackRuntime"
	}
});
export { setup_entry_default as default };
