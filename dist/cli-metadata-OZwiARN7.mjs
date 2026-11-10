import { t as definePluginEntry } from "./plugin-entry-D4OPnFRH.mjs";
import "./core-BxoR6yel.mjs";
//#region extensions/reef/cli-metadata.ts
function registerReefCliMetadata(api) {
	api.registerCli(async ({ program }) => {
		const { registerReefCli } = await import("./cli-BFiYTzlH.mjs");
		registerReefCli({ program });
	}, { descriptors: [{
		name: "reef",
		description: "Register on a Reef relay and manage guarded claw-to-claw friendships",
		hasSubcommands: true
	}] });
}
var cli_metadata_default = definePluginEntry({
	id: "reef",
	name: "Reef",
	description: "Guarded end-to-end encrypted claw channel",
	register: registerReefCliMetadata
});
//#endregion
export { registerReefCliMetadata as n, cli_metadata_default as t };
