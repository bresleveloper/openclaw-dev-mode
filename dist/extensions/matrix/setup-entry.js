import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/matrix/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-YtkxNQTz.mjs", import.meta.url).href),
		exportName: "matrixSetupPlugin"
	},
	secrets: {
		specifier: fileURLToPath(new URL(".setup/secret-contract-api-DMSwMIxd.mjs", import.meta.url).href),
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: fileURLToPath(new URL(".setup/runtime-setter-api-CpwhcBQK.mjs", import.meta.url).href),
		exportName: "setMatrixRuntime"
	}
});
export { setup_entry_default as default };
