//#region src/infra/deferred-plugin-migration-warnings.ts
/**
* Select deferred plugin migration warnings that no longer describe current state:
* the plugin's obligation left the pending ledger, or a later warning for the same
* plugin superseded it.
* Matches both shipped warning forms without reading retired migration reports.
* Messages are ordered oldest first.
*/
async function readRetiredDeferredPluginMigrationWarnings(messages) {
	const pluginWarnings = /* @__PURE__ */ new Map();
	const latestByPlugin = /* @__PURE__ */ new Map();
	for (const message of messages) {
		const pluginId = message && /^Plugin "([^"]+)" (?:state migration is pending|data\/settings upgrade is unfinished):/u.exec(message)?.[1];
		if (message && pluginId) {
			pluginWarnings.set(message, pluginId);
			latestByPlugin.set(pluginId, message);
		}
	}
	if (!pluginWarnings.size) return /* @__PURE__ */ new Set();
	const { readDeferredPluginMigrationsAsync } = await import("./deferred-plugin-migrations-jxTacP3N.mjs");
	const pending = new Set((await readDeferredPluginMigrationsAsync()).map(({ pluginId }) => pluginId));
	return new Set([...pluginWarnings].filter(([message, pluginId]) => !pending.has(pluginId) || latestByPlugin.get(pluginId) !== message).map(([message]) => message));
}
/**
* Drops warnings a later repair in the same pass settled or superseded, such as
* post-session plugin migrations finishing after config preflight reported them
* pending. The ledger is authoritative; an unreadable ledger keeps every warning.
*/
async function retainCurrentDeferredPluginMigrationWarnings(warnings) {
	const retired = await readRetiredDeferredPluginMigrationWarnings(warnings).catch(() => /* @__PURE__ */ new Set());
	return warnings.filter((warning) => !retired.has(warning));
}
//#endregion
export { retainCurrentDeferredPluginMigrationWarnings as n, readRetiredDeferredPluginMigrationWarnings as t };
