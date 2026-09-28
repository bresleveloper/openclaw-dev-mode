import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/line/index.ts
const loadLineCardCommand = createLazyRuntimeModule(() => import("./.setup/card-command-710u8FBH.mjs"));
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
				const { handleLineCardCommand } = await loadLineCardCommand();
				return await handleLineCardCommand(ctx.args);
			}
		});
	}
});
//#endregion
export { line_default as default };
