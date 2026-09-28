import { defineBundledChannelEntry, loadBundledEntryExportSync } from "openclaw/plugin-sdk/channel-entry-contract";
//#region extensions/whatsapp/index.ts
function registerWhatsAppAgentTools(api) {
	loadBundledEntryExportSync(import.meta.url, {
		specifier: "./agent-tools-api.js",
		exportName: "registerWhatsAppAgentTools"
	})(api);
}
var whatsapp_default = defineBundledChannelEntry({
	id: "whatsapp",
	name: "WhatsApp",
	description: "WhatsApp channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "whatsappPlugin"
	},
	runtime: {
		specifier: "./runtime-setter-api.js",
		exportName: "setWhatsAppRuntime"
	},
	registerFull: registerWhatsAppAgentTools
});
//#endregion
export { whatsapp_default as default };
