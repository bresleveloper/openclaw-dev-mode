import { r as loadBundledEntryExportSync, t as defineBundledChannelEntry } from "../../channel-entry-contract-TASNXkep.js";
//#region extensions/whatsapp/index.ts
function registerWhatsAppCallTool(api) {
	loadBundledEntryExportSync(import.meta.url, {
		specifier: "./call-tool-api.js",
		exportName: "registerWhatsAppCallTool"
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
	registerFull: registerWhatsAppCallTool
});
//#endregion
export { whatsapp_default as default };
