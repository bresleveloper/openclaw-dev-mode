import { n as defineBundledChannelSetupEntry } from "../../channel-entry-contract-Cwo7pmF2.js";
//#region extensions/raft/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./setup-plugin-api.js",
		exportName: "raftSetupPlugin"
	}
});
//#endregion
export { setup_entry_default as default };
