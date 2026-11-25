import { t as registerClickClackDiscussions } from "./.setup/runtime-api-Ci45IlXP.mjs";
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
// extensions/clickclack/index.ts
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
export { clickclack_default as default };
