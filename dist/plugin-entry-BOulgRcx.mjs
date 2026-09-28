import { t as createCachedLazyValueGetter } from "./lazy-value-B2wh8onO.mjs";
import { r as emptyPluginConfigSchema } from "./config-schema-c9utjSlx.mjs";
//#region src/plugin-sdk/plugin-entry.ts
/**
* Canonical entry helper for non-channel plugins.
*
* Use this for provider, tool, command, service, memory, and context-engine
* plugins. Channel plugins should use `defineChannelPluginEntry(...)` from
* `openclaw/plugin-sdk/core` so they inherit the channel capability wiring.
*
* @experimental Pin and test OpenClaw host versions; existing compatibility windows still apply.
*/
function definePluginEntry({ id, name, description, kind, configSchema = emptyPluginConfigSchema, reload, nodeHostCommands, securityAuditCollectors, register }) {
	const getConfigSchema = createCachedLazyValueGetter(configSchema);
	return {
		id,
		name,
		description,
		...kind ? { kind } : {},
		...reload ? { reload } : {},
		...nodeHostCommands ? { nodeHostCommands } : {},
		...securityAuditCollectors ? { securityAuditCollectors } : {},
		get configSchema() {
			return getConfigSchema();
		},
		register
	};
}
//#endregion
export { definePluginEntry as t };
