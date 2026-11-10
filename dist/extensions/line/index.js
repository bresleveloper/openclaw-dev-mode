import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
//#region extensions/line/index.ts
var line_default = defineBundledChannelEntry({
	id: "line",
	name: "LINE",
	description: "LINE Messaging API channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "linePlugin"
	},
	runtime: {
		specifier: "./runtime-api.js",
		exportName: "setLineRuntime"
	},
	registerFull(api) {
		api.registerCommand({
			name: "card",
			description: "Send a rich card message.",
			channels: ["line"],
			acceptsArgs: true,
			requireAuth: false,
			async handler(ctx) {
				const { handleLineCardCommand } = await import("./.setup/card-command-Dnkl21vg.mjs");
				return await handleLineCardCommand(ctx.args);
			}
		});
	}
});
//#endregion
export { line_default as default };
