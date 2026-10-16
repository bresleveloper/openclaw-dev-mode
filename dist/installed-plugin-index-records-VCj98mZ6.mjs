import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import "./utils-DgZn2dLu.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { a as getPluginInstallRecordMapEntry, r as copyPluginInstallRecordMap, u as setPluginInstallRecordMapEntry } from "./installed-plugin-record-match-DMViKhkx.mjs";
import "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { r as refreshPersistedInstalledPluginIndexWithLeaseSync } from "./installed-plugin-index-store-write-5ACUs2E_.mjs";
import "./install-source-utils-CQUKARYZ.mjs";
//#region src/plugins/installs.ts
function configReferencesNpmInstallPath(params) {
	const installPath = params.install?.installPath;
	if (params.install?.source !== "npm" || !installPath) return false;
	const resolvedInstallPath = resolveUserPath(installPath, params.env);
	return Boolean(params.config.plugins?.load?.paths?.some((entry) => resolveUserPath(entry, params.env) === resolvedInstallPath));
}
function reconcileNpmPluginLoadPath(params) {
	const previousPath = params.previousInstall?.installPath;
	const nextPath = params.nextInstall.installPath;
	if (params.previousInstall?.source !== "npm" || params.nextInstall.source !== "npm" || !previousPath || !nextPath) return params.config;
	const previousResolved = resolveUserPath(previousPath, params.env);
	const nextResolved = resolveUserPath(nextPath, params.env);
	const existing = params.config.plugins?.load?.paths;
	if (previousResolved === nextResolved || !existing?.length) return params.config;
	const replaceAt = existing.findIndex((entry) => resolveUserPath(entry, params.env) === previousResolved);
	if (replaceAt < 0) return params.config;
	const existingNextAt = existing.findIndex((entry) => resolveUserPath(entry, params.env) === nextResolved);
	const paths = existing.flatMap((entry, index) => {
		const resolved = resolveUserPath(entry, params.env);
		if (existingNextAt >= 0) {
			if (resolved === previousResolved || resolved === nextResolved && index !== existingNextAt) return [];
			return [entry];
		}
		if (index === replaceAt) return [nextPath];
		return resolved === previousResolved ? [] : [entry];
	});
	return {
		...params.config,
		plugins: {
			...params.config.plugins,
			load: {
				...params.config.plugins?.load,
				paths
			}
		}
	};
}
function isExactRegistryNpmSpec(spec) {
	return (spec ? parseRegistryNpmSpec(spec) : null)?.selectorKind === "exact-version";
}
function resolveNpmInstallRecordSpec(params) {
	const resolvedSpec = params.resolution?.resolvedSpec;
	if (!params.pinResolvedRegistrySpec || !isExactRegistryNpmSpec(resolvedSpec)) return params.requestedSpec;
	return resolvedSpec;
}
function recordPluginInstallInRecords(records, update) {
	const { pluginId, ...record } = update;
	const installs = copyPluginInstallRecordMap(records);
	setPluginInstallRecordMapEntry(installs, pluginId, {
		...record,
		installedAt: record.installedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	});
	return installs;
}
/** Replaces a plugin install record with the authoritative completed install. */
function recordPluginInstall(cfg, update) {
	return reconcileNpmPluginLoadPath({
		config: {
			...cfg,
			plugins: {
				...cfg.plugins,
				installs: recordPluginInstallInRecords(cfg.plugins?.installs, update)
			}
		},
		previousInstall: getPluginInstallRecordMapEntry(cfg.plugins?.installs, update.pluginId),
		nextInstall: update
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-records.ts
/** Builds and compares installed plugin index records for refresh decisions. */
/** Config path for legacy plugin install records kept for migration/doctor flows. */
const PLUGIN_INSTALLS_CONFIG_PATH = ["plugins", "installs"];
/** Refresh persisted install records while holding the plugin lifecycle lease. */
async function writePersistedInstalledPluginIndexInstallRecordsWithLease(records, options) {
	return refreshPersistedInstalledPluginIndexWithLeaseSync({
		...options,
		reason: "source-changed",
		installRecords: records
	});
}
/** Returns config with plugin install records attached at the canonical config path. */
function withPluginInstallRecords(config, records) {
	return {
		...config,
		plugins: {
			...config.plugins,
			installs: records
		}
	};
}
/** Returns config with legacy plugin install records removed. */
function withoutPluginInstallRecords(config, options = {}) {
	if (!config.plugins?.installs) return config;
	const { installs: _installs, ...plugins } = config.plugins;
	if (Object.keys(plugins).length === 0) {
		if (options.preserveEmptyPlugins) return {
			...config,
			plugins: {}
		};
		const { plugins: _plugins, ...rest } = config;
		return rest;
	}
	return {
		...config,
		plugins
	};
}
/** Removes one plugin install record from an in-memory record map. */
function removePluginInstallRecordFromRecords(records, pluginId) {
	const remaining = copyPluginInstallRecordMap(records);
	delete remaining[pluginId];
	return remaining;
}
//#endregion
export { writePersistedInstalledPluginIndexInstallRecordsWithLease as a, recordPluginInstall as c, withoutPluginInstallRecords as i, recordPluginInstallInRecords as l, removePluginInstallRecordFromRecords as n, configReferencesNpmInstallPath as o, withPluginInstallRecords as r, reconcileNpmPluginLoadPath as s, PLUGIN_INSTALLS_CONFIG_PATH as t, resolveNpmInstallRecordSpec as u };
