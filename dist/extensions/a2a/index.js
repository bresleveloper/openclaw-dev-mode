import { t as defineBundledChannelEntry } from "../../channel-entry-contract-DDxZbSmZ.mjs";
//#region extensions/a2a/index.ts
var a2a_default = defineBundledChannelEntry({
	id: "a2a",
	name: "A2A",
	description: "A2A v1.0 Agent-to-Agent protocol channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "a2aChannelPlugin"
	},
	runtime: {
		specifier: "./api.js",
		exportName: "setA2aChannelRuntime"
	}
});
//#endregion
export { a2a_default as default };
