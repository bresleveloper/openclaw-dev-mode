let openclaw_plugin_sdk_channel_entry_contract = require("openclaw/plugin-sdk/channel-entry-contract");
let node_url = require("node:url");
//#region extensions/msteams/setup-entry.ts
var setup_entry_default = (0, openclaw_plugin_sdk_channel_entry_contract.defineBundledChannelSetupEntry)({
	importMetaUrl: require("url").pathToFileURL(__filename).href,
	plugin: {
		specifier: (0, node_url.fileURLToPath)(new URL(".setup/setup-plugin-api-DpiaA8z1.cjs", require("url").pathToFileURL(__filename).href).href),
		exportName: "msteamsSetupPlugin"
	},
	secrets: {
		specifier: (0, node_url.fileURLToPath)(new URL(".setup/secret-contract-api-ChQdBeU1.cjs", require("url").pathToFileURL(__filename).href).href),
		exportName: "channelSecrets"
	}
});
//#endregion
module.exports = setup_entry_default;
