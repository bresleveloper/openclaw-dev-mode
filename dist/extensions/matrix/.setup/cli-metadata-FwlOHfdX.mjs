import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/matrix/src/cli-metadata.ts
function registerMatrixCliMetadata(api) {
	api.registerCli(async ({ program }) => {
		const { registerMatrixCli } = await import("./cli-CChA7Tf5.mjs");
		registerMatrixCli({ program });
	}, { descriptors: [{
		name: "matrix",
		description: "Manage Matrix accounts, verification, devices, and profile state",
		hasSubcommands: true
	}] });
}
// extensions/matrix/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "matrix",
	name: "Matrix",
	description: "Matrix channel plugin (matrix-js-sdk)",
	register: registerMatrixCliMetadata
});
export { registerMatrixCliMetadata as n, cli_metadata_default as t };
