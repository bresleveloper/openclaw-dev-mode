import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { asNullableRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/memory-wiki/src/config-compat.ts
function hasLegacyBridgeArtifactToggle(value) {
	return Object.hasOwn(asNullableRecord(value) ?? {}, "readMemoryCore");
}
function migrateMemoryWikiLegacyConfig(config) {
	const rawEntry = asNullableRecord(config.plugins?.entries?.["memory-wiki"]);
	const rawPluginConfig = asNullableRecord(rawEntry?.config);
	const rawBridge = asNullableRecord(rawPluginConfig?.bridge);
	if (!rawBridge || !hasLegacyBridgeArtifactToggle(rawBridge)) return null;
	const nextConfig = structuredClone(config);
	const nextPlugins = asNullableRecord(nextConfig.plugins) ?? {};
	nextConfig.plugins = nextPlugins;
	const nextEntries = asNullableRecord(nextPlugins.entries) ?? {};
	nextPlugins.entries = nextEntries;
	const nextEntry = asNullableRecord(nextEntries["memory-wiki"]) ?? {};
	nextEntries["memory-wiki"] = nextEntry;
	const nextPluginConfig = asNullableRecord(nextEntry.config) ?? {};
	nextEntry.config = nextPluginConfig;
	const nextBridge = asNullableRecord(nextPluginConfig.bridge) ?? {};
	nextPluginConfig.bridge = nextBridge;
	const legacyValue = nextBridge.readMemoryCore;
	const hasCanonical = Object.hasOwn(nextBridge, "readMemoryArtifacts");
	if (!hasCanonical) nextBridge.readMemoryArtifacts = legacyValue;
	delete nextBridge.readMemoryCore;
	return {
		config: nextConfig,
		changes: hasCanonical ? ["Removed legacy plugins.entries.memory-wiki.config.bridge.readMemoryCore; kept explicit plugins.entries.memory-wiki.config.bridge.readMemoryArtifacts."] : ["Moved plugins.entries.memory-wiki.config.bridge.readMemoryCore → plugins.entries.memory-wiki.config.bridge.readMemoryArtifacts."]
	};
}
//#endregion
//#region extensions/memory-wiki/setup-api.ts
var setup_api_default = definePluginEntry({
	id: "memory-wiki",
	name: "Memory Wiki Setup",
	description: "Lightweight Memory Wiki setup hooks",
	register(api) {
		api.registerConfigMigration((config) => migrateMemoryWikiLegacyConfig(config));
	}
});
//#endregion
export { setup_api_default as default };
