import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
//#region extensions/canvas/cli-metadata.ts
/**
* Canvas CLI metadata entrypoint used for lightweight command discovery.
*/
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
