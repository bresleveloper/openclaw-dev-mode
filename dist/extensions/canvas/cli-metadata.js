import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
//#region extensions/canvas/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "canvas",
	name: "Canvas",
	description: "Presents hosted widget documents on paired macOS panels.",
	register(api) {
		api.registerNodeCliFeature(() => {}, { descriptors: [{
			name: "canvas",
			description: "Present widget documents on a paired macOS panel",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { cli_metadata_default as default };
