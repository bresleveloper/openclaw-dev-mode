import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { p as tryReadJsonSync } from "./json-files-2umMHm0W.js";
import { a as resolveDefaultPluginNpmDir, p as validatePluginId } from "./install-paths-Dx6I5W3l.js";
import { c as resolveOpenClawStateSqlitePath, i as openOpenClawStateDatabase } from "./openclaw-state-db-gblCDNfo.js";
import { r as hasRetainedManagedNpmInstallMarker, s as listManagedPluginNpmProjectRootsSync } from "./managed-npm-retention-C4LuZ0gC.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/installed-plugin-index-record-cache.ts
const installRecordsCache = /* @__PURE__ */ new Map();
let installRecordsCacheGeneration = 0;
/** Returns cached installed plugin records for a store/recovery key. */
function getInstalledPluginIndexInstallRecordsCache(key) {
	return installRecordsCache.get(key);
}
/** Stores cached installed plugin records for a store/recovery key. */
function setInstalledPluginIndexInstallRecordsCache(key, entry) {
	installRecordsCache.set(key, entry);
}
/** Current cache generation used to detect concurrent clears during async loads. */
function getInstalledPluginIndexInstallRecordsCacheGeneration() {
	return installRecordsCacheGeneration;
}
/** Clears cached installed plugin records and advances the cache generation. */
function clearLoadInstalledPluginIndexInstallRecordsCache() {
	installRecordsCacheGeneration += 1;
	installRecordsCache.clear();
}
//#endregion
//#region src/plugins/installed-plugin-index-store-path.ts
const LEGACY_INSTALLED_PLUGIN_INDEX_STORE_PATH = path.join("plugins", "installs.json");
function resolveStoreEnv(options) {
	return options.stateDir ? {
		...options.env ?? process.env,
		OPENCLAW_STATE_DIR: options.stateDir
	} : options.env ?? process.env;
}
/** Resolves the canonical SQLite-backed installed plugin index path. */
function resolveInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	return resolveOpenClawStateSqlitePath(resolveStoreEnv(options));
}
/** Resolves state database options for the installed plugin index store. */
function resolveInstalledPluginIndexStateDatabaseOptions(options = {}) {
	if (options.filePath) return {
		...options.env ? { env: options.env } : {},
		path: options.filePath
	};
	if (options.stateDir) return { env: resolveStoreEnv(options) };
	return options.env ? { env: options.env } : {};
}
/** Resolves the legacy JSON installed plugin index path for migration/doctor use. */
function resolveLegacyInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	const env = options.env ?? process.env;
	const stateDir = options.stateDir ?? resolveStateDir(env);
	return path.join(stateDir, LEGACY_INSTALLED_PLUGIN_INDEX_STORE_PATH);
}
//#endregion
//#region src/plugins/installed-plugin-index-record-reader.ts
/** Reads installed-index records back into manifest registry records. */
function cloneInstallRecords(records) {
	return readRecordMap(records) ?? {};
}
const BLOCKED_RECORD_KEYS = new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function isSafeRecordKey(key) {
	return !BLOCKED_RECORD_KEYS.has(key);
}
function readRecordMap(value) {
	if (!isRecord(value)) return null;
	const records = {};
	for (const [pluginId, record] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (!isSafeRecordKey(pluginId)) continue;
		if (isRecord(record) && typeof record.source === "string") records[pluginId] = structuredClone(record);
	}
	return records;
}
function readJsonObjectFileSync(filePath) {
	const parsed = tryReadJsonSync(filePath);
	return isRecord(parsed) ? parsed : null;
}
function readStringRecord(value) {
	if (!isRecord(value)) return {};
	const record = {};
	for (const [key, raw] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (!isSafeRecordKey(key)) continue;
		if (typeof raw === "string" && raw.trim()) record[key] = raw.trim();
	}
	return record;
}
function hasPackagePluginMetadata(manifest) {
	const openclaw = manifest.openclaw;
	if (!isRecord(openclaw)) return false;
	const extensions = openclaw.extensions;
	return Array.isArray(extensions) && extensions.some((entry) => typeof entry === "string");
}
function readManifestPluginId(packageDir) {
	const manifest = readJsonObjectFileSync(path.join(packageDir, "openclaw.plugin.json"));
	return (typeof manifest?.id === "string" ? manifest.id.trim() : "") || void 0;
}
function resolveRecoveredManagedNpmRoot(options = {}) {
	return path.resolve(options.stateDir ? path.join(options.stateDir, "npm") : resolveDefaultPluginNpmDir(options.env));
}
function resolveRecoveredManagedNpmPluginId(params) {
	const packageManifest = readJsonObjectFileSync(path.join(params.packageDir, "package.json"));
	if (!packageManifest || !hasPackagePluginMetadata(packageManifest)) return;
	const packageName = typeof packageManifest.name === "string" && packageManifest.name.trim() ? packageManifest.name.trim() : params.packageName;
	const pluginId = readManifestPluginId(params.packageDir) ?? packageName;
	return validatePluginId(pluginId) ? void 0 : pluginId;
}
function buildRecoveredManagedNpmInstallRecordsForRoot(npmRoot) {
	const dependencies = readStringRecord(readJsonObjectFileSync(path.join(npmRoot, "package.json"))?.dependencies);
	const records = {};
	for (const [packageName, dependencySpec] of Object.entries(dependencies)) {
		const packageDir = path.join(npmRoot, "node_modules", ...packageName.split("/"));
		let stat;
		try {
			stat = fs.statSync(packageDir);
		} catch {
			continue;
		}
		if (!stat.isDirectory()) continue;
		if (hasRetainedManagedNpmInstallMarker(packageDir)) continue;
		const pluginId = resolveRecoveredManagedNpmPluginId({
			packageName,
			packageDir
		});
		if (!pluginId) continue;
		const packageManifest = readJsonObjectFileSync(path.join(packageDir, "package.json"));
		const version = typeof packageManifest?.version === "string" && packageManifest.version.trim() ? packageManifest.version.trim() : void 0;
		records[pluginId] = {
			source: "npm",
			spec: `${packageName}@${dependencySpec}`,
			installPath: packageDir,
			...version ? {
				version,
				resolvedName: packageName,
				resolvedVersion: version
			} : {},
			...version ? { resolvedSpec: `${packageName}@${version}` } : {}
		};
	}
	return records;
}
function buildRecoveredManagedNpmInstallRecords(options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const legacyRecords = buildRecoveredManagedNpmInstallRecordsForRoot(npmRoot);
	const projectRecords = {};
	for (const projectRoot of listManagedPluginNpmProjectRootsSync(npmRoot)) Object.assign(projectRecords, buildRecoveredManagedNpmInstallRecordsForRoot(projectRoot));
	return {
		...legacyRecords,
		...projectRecords
	};
}
function recordsShareInstallPath(left, right) {
	if (!left?.installPath || !right.installPath) return false;
	return path.resolve(left.installPath) === path.resolve(right.installPath);
}
function readInstallRecordVersion(record) {
	return record?.resolvedVersion ?? record?.version;
}
function mergeRecoveredManagedNpmRecord(params) {
	const persistedVersion = readInstallRecordVersion(params.persisted);
	const recoveredVersion = readInstallRecordVersion(params.recovered);
	if (params.persisted?.source === "npm" && recordsShareInstallPath(params.persisted, params.recovered) && recoveredVersion && persistedVersion !== recoveredVersion) {
		const next = {
			...params.persisted,
			...params.recovered
		};
		delete next.integrity;
		delete next.shasum;
		delete next.resolvedAt;
		delete next.installedAt;
		return next;
	}
	return params.persisted ?? params.recovered;
}
function mergeRecoveredManagedNpmInstallRecords(persisted, options) {
	const recovered = buildRecoveredManagedNpmInstallRecords(options);
	const merged = { ...persisted };
	for (const [pluginId, record] of Object.entries(recovered)) merged[pluginId] = mergeRecoveredManagedNpmRecord({
		persisted: merged[pluginId],
		recovered: record
	});
	return merged;
}
function extractPluginInstallRecordsFromPersistedInstalledPluginIndex(index) {
	if (!isRecord(index)) return null;
	if (Object.hasOwn(index, "installRecords")) return readRecordMap(index.installRecords) ?? {};
	if (Object.hasOwn(index, "records")) return readRecordMap(index.records) ?? {};
	if (!Array.isArray(index.plugins)) return null;
	const records = {};
	for (const entry of index.plugins) {
		if (!isRecord(entry) || typeof entry.pluginId !== "string" || !isRecord(entry.installRecord)) continue;
		if (!isSafeRecordKey(entry.pluginId)) continue;
		records[entry.pluginId] = structuredClone(entry.installRecord);
	}
	return records;
}
function parseJsonColumn(value) {
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
function readPersistedInstalledPluginIndexForRecords(options = {}) {
	const storePath = resolveInstalledPluginIndexStorePath(options);
	if (!fs.existsSync(storePath)) return null;
	if (options.filePath?.endsWith(".json")) return tryReadJsonSync(options.filePath);
	try {
		const row = openOpenClawStateDatabase(resolveInstalledPluginIndexStateDatabaseOptions(options)).db.prepare(`
          SELECT install_records_json, plugins_json
            FROM installed_plugin_index
           WHERE index_key = ?
        `).get("installed-plugin-index");
		if (!row) return null;
		return {
			installRecords: parseJsonColumn(row.install_records_json),
			plugins: parseJsonColumn(row.plugins_json)
		};
	} catch {
		return null;
	}
}
/** Reads install records from the persisted installed plugin index. */
async function readPersistedInstalledPluginIndexInstallRecords(options = {}) {
	return extractPluginInstallRecordsFromPersistedInstalledPluginIndex(readPersistedInstalledPluginIndexForRecords(options));
}
/** Synchronously reads install records from the persisted installed plugin index. */
function readPersistedInstalledPluginIndexInstallRecordsSync(options = {}) {
	return extractPluginInstallRecordsFromPersistedInstalledPluginIndex(readPersistedInstalledPluginIndexForRecords(options));
}
function resolveInstallRecordsCacheKey(options) {
	return [path.resolve(resolveInstalledPluginIndexStorePath(options)), resolveRecoveredManagedNpmRoot(options)].join("\0");
}
/** Loads installed plugin records, recovering managed npm installs and caching the result. */
async function loadInstalledPluginIndexInstallRecords(params = {}) {
	const cacheKey = resolveInstallRecordsCacheKey(params);
	const cached = getInstalledPluginIndexInstallRecordsCache(cacheKey);
	if (cached) return cloneInstallRecords(cached.records);
	const cacheGeneration = getInstalledPluginIndexInstallRecordsCacheGeneration();
	const records = cloneInstallRecords(mergeRecoveredManagedNpmInstallRecords(await readPersistedInstalledPluginIndexInstallRecords(params), params));
	if (cacheGeneration !== getInstalledPluginIndexInstallRecordsCacheGeneration()) return await loadInstalledPluginIndexInstallRecords(params);
	setInstalledPluginIndexInstallRecordsCache(cacheKey, { records });
	return cloneInstallRecords(records);
}
/** Synchronously loads installed plugin records, recovering managed npm installs and caching them. */
function loadInstalledPluginIndexInstallRecordsSync(params = {}) {
	const cacheKey = resolveInstallRecordsCacheKey(params);
	const cached = getInstalledPluginIndexInstallRecordsCache(cacheKey);
	if (cached) return cloneInstallRecords(cached.records);
	const records = cloneInstallRecords(mergeRecoveredManagedNpmInstallRecords(readPersistedInstalledPluginIndexInstallRecordsSync(params), params));
	setInstalledPluginIndexInstallRecordsCache(cacheKey, { records });
	return cloneInstallRecords(records);
}
//#endregion
export { resolveInstalledPluginIndexStateDatabaseOptions as a, clearLoadInstalledPluginIndexInstallRecordsCache as c, readPersistedInstalledPluginIndexInstallRecordsSync as i, loadInstalledPluginIndexInstallRecordsSync as n, resolveInstalledPluginIndexStorePath as o, readPersistedInstalledPluginIndexInstallRecords as r, resolveLegacyInstalledPluginIndexStorePath as s, loadInstalledPluginIndexInstallRecords as t };
