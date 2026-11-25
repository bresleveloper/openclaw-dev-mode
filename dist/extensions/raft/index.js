import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
// extensions/raft/index.ts
var raft_default = defineBundledChannelEntry({
	id: "raft",
	name: "Raft",
	description: "Raft CLI wake bridge channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "raftPlugin"
	}
});
export { raft_default as default };
