import { migrateTencentTokenHubModelDefaults } from "./config-compat.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/tencent/setup-api.ts
var setup_api_default = definePluginEntry({
	id: "tencent",
	name: "Tencent Cloud Provider Setup",
	description: "Lightweight Tencent Cloud provider setup hooks",
	register(api) {
		api.registerConfigMigration(migrateTencentTokenHubModelDefaults);
	}
});
export { setup_api_default as default };
