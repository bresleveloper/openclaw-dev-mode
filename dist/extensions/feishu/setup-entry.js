import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/feishu/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-api-VAUkwtTi.mjs", import.meta.url).href),
		exportName: "feishuPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-jmCkqVLc.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: fileURLToPath(new URL(".setup/runtime-setter-api-CG-RC4_r.mjs", import.meta.url).href),
		exportName: "setFeishuRuntime"
	}
});
//#endregion
export { setup_entry_default as default };
