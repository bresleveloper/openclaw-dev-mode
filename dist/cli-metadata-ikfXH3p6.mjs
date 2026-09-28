import { t as definePluginEntry } from "./plugin-entry-BOulgRcx.mjs";
import "./core-QF0Tm5Oy.mjs";
//#region extensions/reef/src/cli-metadata.ts
function registerReefCliMetadata(api) {
	api.registerCli(async ({ program }) => {
		const { registerReefCli } = await import("./cli-ukkcWuWl.mjs");
		registerReefCli({ program });
	}, { descriptors: [{
		name: "reef",
		description: "Register on a Reef relay and manage guarded claw-to-claw friendships",
		hasSubcommands: true
	}] });
}
//#endregion
//#region extensions/reef/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "reef",
	name: "Reef",
	description: "Guarded end-to-end encrypted claw channel",
	register: registerReefCliMetadata
});
//#endregion
export { registerReefCliMetadata as n, cli_metadata_default as t };
