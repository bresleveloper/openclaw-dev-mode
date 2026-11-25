import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
// extensions/signal/channel-entry.ts
var channel_entry_default = defineBundledChannelEntry({
	id: "signal",
	name: "Signal",
	description: "Signal channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./api.js",
		exportName: "signalPlugin"
	},
	runtime: {
		specifier: "./runtime-api.js",
		exportName: "setSignalRuntime"
	}
});
export { channel_entry_default as default };
