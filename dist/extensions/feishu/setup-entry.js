import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/feishu/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-api-BE8HN15W.mjs", import.meta.url).href),
		exportName: "feishuPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-DR5mIHhJ.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: fileURLToPath(new URL(".setup/runtime-setter-api-DSLLnejl.mjs", import.meta.url).href),
		exportName: "setFeishuRuntime"
	}
});
export { setup_entry_default as default };
