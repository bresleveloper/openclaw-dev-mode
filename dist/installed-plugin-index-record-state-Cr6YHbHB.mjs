import { c as getPluginCache, y as preparePluginCacheFact } from "./plugin-cache-BbahpD-b.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { a as readPluginMetadataStateRow, i as readBundledDiscoveryModeMemoized, n as prepareBundledDiscoveryMode, o as readPluginMetadataStateRows, r as readBundledDiscoveryMode } from "./bundled-discovery-state-Bb6gGYEi.mjs";
import { n as readPluginMetadataStateRowsSync, r as INSTALLED_PLUGIN_INDEX_STATE_KEY, s as inspectPluginInstallRecordMap, t as readPluginMetadataStateRowSync } from "./installed-plugin-index-row-B-2QiBMA.mjs";
import { n as resolveInstalledPluginIndexStateDatabaseOptions, r as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-store-path-SeqhMDBO.mjs";
import path from "node:path";
//#region src/plugins/installed-plugin-index-record-state.ts
/** Read failures must escape before either projection can authorize recovery or rebuilding. */
function readPersistedInstalledPluginIndexRowSync(options) {
	if (options.filePath?.endsWith(".json")) return;
	return readPluginMetadataStateRowSync("installed-index", resolveInstalledPluginIndexStateDatabaseOptions(options), options.artifactPreservingReadOnly);
}
/** Share the SQLite row while validating install records independently from index metadata. */
function getPersistedInstalledPluginIndexCacheEntry(options, readRow = () => readPersistedInstalledPluginIndexRowSync(options)) {
	const cache = getPluginCache().persistedInstalledIndex;
	const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
	const current = cache.get(key);
	if (current && "value" in current) return current.value;
	const row = readRow();
	const entry = { state: row ? {
		status: "present",
		value: safeParseJson(row.value_json)
	} : { status: "missing" } };
	cache.set(key, { value: entry });
	return entry;
}
/** Prepare missing policy and inventory facts without replacing their lifecycle owners. */
function preparePluginMetadataMachineState(options) {
	const env = options.env ?? process.env;
	readBundledDiscoveryModeMemoized(env, options, (databasePath) => {
		const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
		const current = getPluginCache().persistedInstalledIndex.get(key);
		if (path.resolve(databasePath) !== key || options.filePath?.endsWith(".json") || current && "value" in current) return readBundledDiscoveryMode({ env }, options);
		const rows = readPluginMetadataStateRowsSync(["plugins.bundledDiscovery", INSTALLED_PLUGIN_INDEX_STATE_KEY], resolveInstalledPluginIndexStateDatabaseOptions(options), options.artifactPreservingReadOnly);
		const mode = rows.find((row) => row.state_key === "plugins.bundledDiscovery");
		const value = mode ? JSON.parse(mode.value_json) : void 0;
		getPersistedInstalledPluginIndexCacheEntry(options, () => rows.find((row) => row.state_key === INSTALLED_PLUGIN_INDEX_STATE_KEY));
		return value;
	});
}
/** Coalesce cold policy and inventory reads without refreshing lifecycle-owned warm facts. */
async function preparePluginMetadataMachineStateAsync(options) {
	const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
	const databaseOptions = resolveInstalledPluginIndexStateDatabaseOptions(options);
	let rows;
	const readRows = () => rows ??= readPluginMetadataStateRows(["plugins.bundledDiscovery", INSTALLED_PLUGIN_INDEX_STATE_KEY], databaseOptions, options.artifactPreservingReadOnly);
	const activateDiscovery = await prepareBundledDiscoveryMode(options.env, async (databasePath) => {
		const current = getPluginCache().persistedInstalledIndex.get(key);
		if (path.resolve(databasePath) !== key || options.filePath?.endsWith(".json") || current) return readPluginMetadataStateRow("bundled-discovery", {
			path: databasePath,
			env: options.env
		}, options.artifactPreservingReadOnly);
		return (await readRows()).find((row) => row.state_key === "plugins.bundledDiscovery");
	});
	activateDiscovery();
	const installed = await preparePersistedInstalledPluginIndexCacheEntry(options, rows ? async () => (await readRows()).find((row) => row.state_key === INSTALLED_PLUGIN_INDEX_STATE_KEY) : void 0);
	activateDiscovery();
	installed.assertCurrent();
	return () => {
		activateDiscovery();
		installed.assertCurrent();
	};
}
/** Await one shared row, retaining its cache generation until publication completes. */
async function preparePersistedInstalledPluginIndexCacheEntry(options = {}, readPreparedRow) {
	const owner = getPluginCache();
	const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
	const databaseOptions = resolveInstalledPluginIndexStateDatabaseOptions(options);
	const prepared = await preparePluginCacheFact(owner, owner.persistedInstalledIndex, key, async () => {
		const row = options.filePath?.endsWith(".json") ? void 0 : readPreparedRow ? await readPreparedRow() : await readPluginMetadataStateRow("installed-index", databaseOptions, options.artifactPreservingReadOnly);
		return { state: row ? {
			status: "present",
			value: safeParseJson(row.value_json)
		} : { status: "missing" } };
	});
	return {
		entry: prepared.value,
		assertCurrent: prepared.assertCurrent
	};
}
function inspectPersistedInstalledPluginIndexInstallRecords(entry) {
	if (!entry.records) {
		const state = entry.state;
		const records = (state.status === "present" ? state.value : void 0)?.index?.installRecords;
		entry.records = state.status === "missing" ? { status: "missing" } : records === void 0 ? { status: "invalid" } : inspectPluginInstallRecordMap(records);
	}
	return entry.records;
}
function inspectPersistedInstalledPluginIndexInstallRecordsSync(options = {}) {
	return inspectPersistedInstalledPluginIndexInstallRecords(getPersistedInstalledPluginIndexCacheEntry(options));
}
//#endregion
export { preparePluginMetadataMachineState as a, preparePersistedInstalledPluginIndexCacheEntry as i, inspectPersistedInstalledPluginIndexInstallRecords as n, preparePluginMetadataMachineStateAsync as o, inspectPersistedInstalledPluginIndexInstallRecordsSync as r, getPersistedInstalledPluginIndexCacheEntry as t };
