import { r as registerZalouserRuntimeLifecycle } from "./.setup/session-runtime-DP2xn27T.mjs";
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
// extensions/zalouser/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-8Eqw2PTa.mjs", import.meta.url).href),
		exportName: "zalouserSetupPlugin"
	},
	registerSetupRuntime: registerZalouserRuntimeLifecycle
});
export { setup_entry_default as default };
