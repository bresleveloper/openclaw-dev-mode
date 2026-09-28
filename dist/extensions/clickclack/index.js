import { t as registerClickClackDiscussions } from "./.setup/runtime-api-A9r1b12d.mjs";
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
//#region extensions/clickclack/index.ts
/**
* Bundled channel entry metadata for the ClickClack plugin.
*/
var clickclack_default = defineBundledChannelEntry({
	id: "clickclack",
	name: "ClickClack",
	description: "ClickClack channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "clickClackPlugin"
	},
	runtime: {
		specifier: "./api.js",
		exportName: "setClickClackRuntime"
	},
	registerFull: registerClickClackDiscussions
});
//#endregion
export { clickclack_default as default };
