import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../core-QF0Tm5Oy.mjs";
//#region extensions/memory-core/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "memory-core",
	name: "OpenClaw Memory",
	description: "File-backed memory search tools and CLI",
	register(api) {
		api.registerCli(async ({ program }) => {
			const { registerMemoryCli } = await import("./cli.js");
			registerMemoryCli(program, {
				acquireLocalService: api.runtime.llm?.acquireLocalService,
				openKeyedStore: (options) => api.runtime.state.openKeyedStore(options)
			});
		}, { descriptors: [{
			name: "memory",
			description: "Search, inspect, and reindex memory files",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { cli_metadata_default as default };
