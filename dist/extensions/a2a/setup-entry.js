import { fileURLToPath } from "node:url";
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
//#region extensions/a2a/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-5_---baP.mjs", import.meta.url).href),
		exportName: "a2aChannelSetupPlugin"
	},
	runtime: {
		specifier: fileURLToPath(new URL(".setup/api-BT2Bpa3D.mjs", import.meta.url).href),
		exportName: "setA2aChannelRuntime"
	}
});
//#endregion
export { setup_entry_default as default };
