import { t as registerSlackPluginHttpRoutes } from "./.setup/plugin-routes-C3X0eVaK.mjs";
import "./http-routes-api.js";
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
//#region extensions/slack/index.ts
var slack_default = defineBundledChannelEntry({
	id: "slack",
	name: "Slack",
	description: "Slack channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "slackPlugin"
	},
	secrets: {
		specifier: "./secret-contract-api.js",
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: "./runtime-setter-api.js",
		exportName: "setSlackRuntime"
	},
	accountInspect: {
		specifier: "./account-inspect-api.js",
		exportName: "inspectSlackReadOnlyAccount"
	},
	registerFull: (api) => {
		if (api.registrationMode !== "full") return;
		registerSlackPluginHttpRoutes(api);
	}
});
//#endregion
export { slack_default as default };
