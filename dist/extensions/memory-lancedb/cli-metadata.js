import { t as isMemoryMachineOutput } from "./.setup/cli-output-mode-VwoYL2-H.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/core";
// extensions/memory-lancedb/cli-metadata.ts
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
export { cli_metadata_default as default };
