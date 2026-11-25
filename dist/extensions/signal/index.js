import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
// extensions/signal/index.ts
var signal_default = defineBundledChannelEntry({
	id: "signal",
	name: "Signal",
	description: "Signal channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "signalPlugin"
	},
	runtime: {
		specifier: "./runtime-api.js",
		exportName: "setSignalRuntime"
	}
});
export { signal_default as default };
