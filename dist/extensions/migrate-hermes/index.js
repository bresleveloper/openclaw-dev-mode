import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { t as buildHermesMigrationProvider } from "../../provider-Op4dvJ33.mjs";
//#region extensions/migrate-hermes/index.ts
var migrate_hermes_default = definePluginEntry({
	id: "migrate-hermes",
	name: "Hermes Migration",
	description: "Imports Hermes state into OpenClaw.",
	register(api) {
		api.registerMigrationProvider(buildHermesMigrationProvider({ runtime: api.runtime }));
	}
});
//#endregion
export { migrate_hermes_default as default };
