import { r as registerZalouserRuntimeLifecycle } from "./.setup/session-runtime-DP2xn27T.mjs";
import { defineBundledChannelEntry, loadBundledEntryExportSync } from "openclaw/plugin-sdk/channel-entry-contract";
// extensions/zalouser/index.ts
function createZalouserTool(context) {
	return loadBundledEntryExportSync(import.meta.url, {
		specifier: "./api.js",
		exportName: "createZalouserTool"
	})(context);
}
var zalouser_default = defineBundledChannelEntry({
	id: "zalouser",
	name: "Zalo Personal",
	description: "Zalo personal account messaging via native zca-js integration",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "zalouserPlugin"
	},
	runtime: {
		specifier: "./runtime-api.js",
		exportName: "setZalouserRuntime"
	},
	registerFull(api) {
		api.registerTool((ctx) => createZalouserTool(ctx), { name: "zalouser" });
	},
	registerCapabilities: registerZalouserRuntimeLifecycle
});
export { zalouser_default as default };
