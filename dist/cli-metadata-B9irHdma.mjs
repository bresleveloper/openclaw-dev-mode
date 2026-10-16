import { t as definePluginEntry } from "./plugin-entry-2l_2QeB2.mjs";
import { t as isBrowserMachineOutput } from "./cli-output-mode-DViuKRjY.mjs";
//#region extensions/browser/cli-metadata.ts
/**
* Browser CLI metadata entry. It registers the `openclaw browser` command lazily
* so command discovery does not load the full browser runtime.
*/
function registerBrowserCliMetadata(api) {
	api.registerCli(async ({ program }) => {
		const { registerBrowserCli } = await import("./browser-cli-xM-N1qMI.mjs");
		registerBrowserCli(program, process.argv, api.rootDir);
	}, {
		commands: ["browser"],
		descriptors: [{
			name: "browser",
			description: "Manage OpenClaw's dedicated browser (Chrome/Chromium)",
			hasSubcommands: true,
			machineOutput: isBrowserMachineOutput
		}]
	});
}
var cli_metadata_default = definePluginEntry({
	id: "browser",
	name: "Browser",
	description: "Default browser tool plugin",
	register: registerBrowserCliMetadata
});
//#endregion
export { registerBrowserCliMetadata as n, cli_metadata_default as t };
