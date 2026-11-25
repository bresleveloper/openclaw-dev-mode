import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
// extensions/twitch/index.ts
var twitch_default = defineBundledChannelEntry({
	id: "twitch",
	name: "Twitch",
	description: "Twitch IRC chat channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "twitchPlugin"
	},
	runtime: {
		specifier: "./api.js",
		exportName: "setTwitchRuntime"
	}
});
export { twitch_default as default };
