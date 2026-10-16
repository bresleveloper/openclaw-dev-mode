import { isMemoryMachineOutput } from "./cli-output-mode.js";
import { definePluginEntry } from "openclaw/plugin-sdk/core";
//#region extensions/memory-lancedb/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "memory-lancedb",
	name: "Memory LanceDB",
	description: "LanceDB-backed memory provider",
	register(api) {
		api.registerCli(() => {}, { descriptors: [{
			name: "ltm",
			description: "Inspect and query LanceDB-backed memory",
			hasSubcommands: true,
			machineOutput: isMemoryMachineOutput
		}] });
	}
});
//#endregion
export { cli_metadata_default as default };
