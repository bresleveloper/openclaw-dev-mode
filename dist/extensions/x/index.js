import { r as loadBundledEntryExportSync, t as defineBundledChannelEntry } from "../../channel-entry-contract-Bm5cj8Vj.mjs";
//#region extensions/x/index.ts
var x_default = defineBundledChannelEntry({
	id: "x",
	name: "X (Twitter)",
	description: "Allowlisted X mentions and public replies",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "xPlugin"
	},
	secrets: {
		specifier: "./secret-contract-api.js",
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: "./runtime-api.js",
		exportName: "setXRuntime"
	},
	registerFull(api) {
		loadBundledEntryExportSync(import.meta.url, {
			specifier: "./work-origin-api.js",
			exportName: "registerXWorkOriginGuidance"
		})(api);
		loadBundledEntryExportSync(import.meta.url, {
			specifier: "./admin-api.js",
			exportName: "registerXAllowlistMethods"
		})(api);
		api.registerService(loadBundledEntryExportSync(import.meta.url, {
			specifier: "./verified-github-api.js",
			exportName: "createXGitHubService"
		})(api));
	}
});
//#endregion
export { x_default as default };
