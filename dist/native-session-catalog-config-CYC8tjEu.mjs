import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
//#endregion
//#region src/plugins/native-session-catalog-config.ts
const shippedNativeSessionCatalogs = [{
	"pluginId": "anthropic",
	"label": "Claude Code",
	"legacyDefaultEnabled": true,
	"description": "Existing native Claude Code conversations on this Gateway and eligible paired nodes.",
	"nodeCommands": [
		"anthropic.claude.sessions.list.v1",
		"anthropic.claude.sessions.read.v1",
		"anthropic.claude.terminal.resume.v1"
	]
}, {
	"pluginId": "codex",
	"label": "Codex",
	"legacyDefaultEnabled": true,
	"description": "Existing native Codex conversations on this Gateway and eligible paired nodes.",
	"nodeCommands": [
		"codex.appServer.threads.list.v1",
		"codex.appServer.thread.turns.list.v1",
		"codex.sessionCatalog.transcript.read.v1",
		"codex.terminal.resume.v1",
		"codex.cli.sessions.list"
	]
}];
/** Only host-generated declarations can carry a shipped implicit-on upgrade contract. */
function hasLegacyNativeSessionCatalogDefault(pluginId) {
	return shippedNativeSessionCatalogs.some((catalog) => catalog.pluginId === pluginId && catalog.legacyDefaultEnabled === true);
}
function readNativeSessionCatalogPreference(config, pluginId) {
	const entry = config.plugins?.entries?.[pluginId]?.config;
	const catalog = isRecord(entry) && isRecord(entry.sessionCatalog) ? entry.sessionCatalog : void 0;
	return typeof catalog?.enabled === "boolean" ? catalog.enabled : void 0;
}
/** A first-write privacy preference alone does not request plugin installation. */
function isNativeSessionCatalogOptOutOnly(pluginId, entry) {
	if (!shippedNativeSessionCatalogs.some((catalog) => catalog.pluginId === pluginId) || !isRecord(entry) || Object.keys(entry).length !== 1 || !isRecord(entry.config) || Object.keys(entry.config).length !== 1) return false;
	const catalog = entry.config.sessionCatalog;
	return isRecord(catalog) && Object.keys(catalog).length === 1 && catalog.enabled === false;
}
function applyNativeSessionCatalogPreference(config, pluginIds, enabled, onlyUnset = false) {
	const entries = { ...config.plugins?.entries };
	let changed = false;
	for (const pluginId of pluginIds) {
		const entry = entries[pluginId] ?? {};
		const pluginConfig = isRecord(entry.config) ? entry.config : {};
		const sessionCatalog = isRecord(pluginConfig.sessionCatalog) ? pluginConfig.sessionCatalog : {};
		if (sessionCatalog.enabled === enabled || onlyUnset && Object.hasOwn(sessionCatalog, "enabled")) continue;
		entries[pluginId] = {
			...entry,
			config: {
				...pluginConfig,
				sessionCatalog: {
					...sessionCatalog,
					enabled
				}
			}
		};
		changed = true;
	}
	return changed ? {
		...config,
		plugins: {
			...config.plugins,
			entries
		}
	} : config;
}
/** Called only by the config writer after its snapshot proves the file is absent. */
function initializeNativeSessionCatalogPreferences(config) {
	return applyNativeSessionCatalogPreference(config, shippedNativeSessionCatalogs.map(({ pluginId }) => pluginId), false, true);
}
//#endregion
export { readNativeSessionCatalogPreference as a, isNativeSessionCatalogOptOutOnly as i, hasLegacyNativeSessionCatalogDefault as n, shippedNativeSessionCatalogs as o, initializeNativeSessionCatalogPreferences as r, applyNativeSessionCatalogPreference as t };
