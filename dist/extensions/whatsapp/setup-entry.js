import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { fileURLToPath } from "node:url";
//#region extensions/whatsapp/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	features: { legacySessionSurfaces: true },
	plugin: {
		specifier: fileURLToPath(new URL(".setup/setup-plugin-api-BRfgWQwe.mjs", import.meta.url).href),
		exportName: "whatsappSetupPlugin"
	},
	legacySessionSurface: {
		specifier: fileURLToPath(new URL(".setup/legacy-session-surface-api-B2szjq4r.mjs", import.meta.url).href),
		exportName: "whatsappLegacySessionSurface"
	}
});
//#endregion
export { setup_entry_default as default };
