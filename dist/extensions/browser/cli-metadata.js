import { t as definePluginEntry } from "../../plugin-entry-BZpzqykQ.js";
//#region extensions/browser/cli-metadata.ts
/**
* Browser CLI metadata entry. It registers the `openclaw browser` command lazily
* so command discovery does not load the full browser runtime.
*/
/** Plugin entry that contributes Browser CLI commands. */
var cli_metadata_default = definePluginEntry({
	id: "browser",
	name: "Browser",
	description: "Default browser tool plugin",
	register(api) {
		api.registerCli(async ({ program }) => {
			const { registerBrowserCli } = await import("../../browser-cli-Dhh9v96N.js");
			registerBrowserCli(program);
		}, { commands: ["browser"] });
	}
});
//#endregion
export { cli_metadata_default as default };
