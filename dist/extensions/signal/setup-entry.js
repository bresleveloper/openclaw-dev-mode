import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/signal/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: fileURLToPath(new URL(".setup/api-CGh4eWR8.mjs", import.meta.url).href),
		exportName: "signalSetupPlugin"
	}
});
//#endregion
export { setup_entry_default as default };
