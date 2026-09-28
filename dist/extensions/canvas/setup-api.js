import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import fs from "node:fs";
import path from "node:path";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { asBoolean, asOptionalRecord, readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/canvas/src/config-migration.ts
/** Canvas config migration to the single surviving route-enable switch. */
const RETIRED_HOST_KEYS = [
	"root",
	"port",
	"liveReload"
];
function readLegacyCanvasRoot(config) {
	const legacyHost = asOptionalRecord(asOptionalRecord(config)?.canvasHost);
	const pluginHost = asOptionalRecord(resolvePluginConfigObject(config, "canvas")?.host);
	return {
		...legacyHost,
		...pluginHost
	}.root;
}
function resolveLegacyCanvasDocumentsDir(params) {
	const configuredRoot = readStringValue(readLegacyCanvasRoot(params.config))?.trim();
	if (!configuredRoot) return null;
	const legacyDir = path.join(path.resolve(resolveUserPath(configuredRoot, params.env)), "documents");
	const coreDir = path.resolve(params.stateDir, "canvas", "documents");
	if (legacyDir === coreDir) return null;
	try {
		if (fs.realpathSync(legacyDir) === fs.realpathSync(coreDir)) return null;
	} catch {}
	return legacyDir;
}
function listLegacyCanvasDocumentIds(documentsDir) {
	try {
		return fs.readdirSync(documentsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).toSorted();
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return [];
		throw new Error(`Cannot read Canvas documents at ${documentsDir}: ${String(error)}. Keep plugins.entries.canvas.config.host.root, fix access, then rerun "openclaw doctor --fix".`, { cause: error });
	}
}
/** Removes retired file-host settings while preserving the route enablement choice. */
function migrateCanvasHostConfig(config) {
	const legacyHost = asOptionalRecord(config.canvasHost);
	const canvasConfig = resolvePluginConfigObject(config, "canvas");
	const existingHost = asOptionalRecord(canvasConfig?.host);
	const configuredRoot = readLegacyCanvasRoot(config);
	let retainRoot = readStringValue(configuredRoot)?.includes("${") === true;
	if (!retainRoot) try {
		const legacyDir = resolveLegacyCanvasDocumentsDir({
			config,
			env: process.env,
			stateDir: resolveStateDir()
		});
		retainRoot = legacyDir !== null && listLegacyCanvasDocumentIds(legacyDir).length > 0;
	} catch {
		retainRoot = true;
	}
	const retiredKeys = RETIRED_HOST_KEYS.filter((key) => Object.hasOwn(existingHost ?? {}, key) && !(key === "root" && retainRoot));
	if (!legacyHost && retiredKeys.length === 0) return null;
	const next = structuredClone(config);
	delete next.canvasHost;
	const enabled = asBoolean(existingHost?.enabled) ?? asBoolean(legacyHost?.enabled);
	const nextPlugins = asOptionalRecord(next.plugins) ?? {};
	const nextEntries = asOptionalRecord(nextPlugins.entries) ?? {};
	const nextEntry = asOptionalRecord(nextEntries.canvas) ?? {};
	const nextPluginConfig = asOptionalRecord(nextEntry.config) ?? {};
	if (existingHost || enabled !== void 0 || retainRoot) {
		if (enabled === void 0 && !retainRoot) delete nextPluginConfig.host;
		else nextPluginConfig.host = {
			...enabled !== void 0 ? { enabled } : {},
			...retainRoot ? { root: configuredRoot } : {}
		};
		nextEntry.config = nextPluginConfig;
		nextEntries.canvas = nextEntry;
		nextPlugins.entries = nextEntries;
		next.plugins = nextPlugins;
	}
	const changes = [];
	if (legacyHost) changes.push(retainRoot ? "Migrated canvasHost to plugins.entries.canvas.config.host; retained root for document migration retry." : enabled === void 0 ? "Removed retired canvasHost configuration." : "Migrated canvasHost.enabled to plugins.entries.canvas.config.host.enabled.");
	if (retiredKeys.length > 0) changes.push(`Removed retired Canvas host config: ${retiredKeys.map((key) => `plugins.entries.canvas.config.host.${key}`).join(", ")}.`);
	return {
		config: next,
		changes
	};
}
//#endregion
//#region extensions/canvas/setup-api.ts
/**
* Canvas setup entrypoint that exposes config migrations.
*/
var setup_api_default = definePluginEntry({
	id: "canvas",
	name: "Canvas Setup",
	description: "Lightweight Canvas setup hooks",
	register(api) {
		api.registerConfigMigration((config) => migrateCanvasHostConfig(config));
	}
});
//#endregion
export { setup_api_default as default };
