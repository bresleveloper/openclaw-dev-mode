import { f as getProcessPluginCache, o as getPluginCache, v as preparePluginCacheFact } from "./plugin-cache-BABafcXD.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { a as normalizeWindowsPathForComparison$1, n as isNotFoundPathError$1 } from "./path-guards-CH7noY0Z.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { u as tryReadJsonSync } from "./json-files-C5mNTScg.mjs";
import { i as isPrereleaseResolutionAllowed, o as parseRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { n as readPluginMetadataStateRowSync, r as readPluginMetadataStateRowsSync, t as INSTALLED_PLUGIN_INDEX_STATE_KEY } from "./installed-plugin-index-row-CeyMwv4w.mjs";
import { a as readPluginMetadataStateRow, i as readBundledDiscoveryModeMemoized, r as readBundledDiscoveryMode } from "./bundled-discovery-state-C2EXzdGy.mjs";
import { a as groupPluginRecords } from "./discovery-Dma3bVNk.mjs";
import { m as validatePluginId, p as resolvePluginNpmProjectsDir, r as isPluginNpmProjectDir, s as resolveDefaultPluginNpmDir } from "./install-paths-R7__5hE9.mjs";
import { a as getPluginInstallRecordMapEntry, i as createPluginInstallRecordMap, o as inspectPluginInstallRecordMap, r as copyPluginInstallRecordMap, u as setPluginInstallRecordMapEntry } from "./installed-plugin-record-match-DMViKhkx.mjs";
import { n as resolveInstalledPluginIndexStateDatabaseOptions, r as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-store-path-vGDuKHrq.mjs";
import { c as listManagedPluginNpmProjectsSync, o as resolveRetainedManagedNpmInstallPackageInfo, r as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-BPamOGs_.mjs";
import fs from "node:fs";
import path from "node:path";
import { safeStatSync } from "@openclaw/fs-safe/path";
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
/** Await one shared row, retaining its cache generation until publication completes. */
async function preparePersistedInstalledPluginIndexCacheEntry(options = {}) {
	const owner = getPluginCache();
	const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
	const databaseOptions = resolveInstalledPluginIndexStateDatabaseOptions(options);
	const prepared = await preparePluginCacheFact(owner, owner.persistedInstalledIndex, key, async () => {
		const row = options.filePath?.endsWith(".json") ? void 0 : await readPluginMetadataStateRow("installed-index", databaseOptions, options.artifactPreservingReadOnly);
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
//#region src/plugins/installed-plugin-index-record-cache.ts
/** Explicit ledger writes/reloads leave the Gateway's embedded boot snapshot unchanged. */
function clearLoadInstalledPluginIndexInstallRecordsCache() {
	for (const cache of /* @__PURE__ */ new Set([getPluginCache(), getProcessPluginCache()])) {
		cache.installRecords.clear();
		cache.persistedInstalledIndex.clear();
	}
}
//#endregion
//#region src/plugins/installed-plugin-index-record-reader.ts
/** Reads installed-index records back into manifest registry records. */
function readJsonObjectFileSync(filePath) {
	const parsed = tryReadJsonSync(filePath);
	return isRecord(parsed) ? parsed : null;
}
function readStringRecord(value) {
	if (!isRecord(value)) return {};
	const record = {};
	for (const [key, raw] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (isBlockedObjectKey(key)) continue;
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
	const { packageManifest } = params;
	if (!packageManifest || !hasPackagePluginMetadata(packageManifest)) return;
	const packageName = typeof packageManifest.name === "string" && packageManifest.name.trim() ? packageManifest.name.trim() : params.packageName;
	const pluginId = readManifestPluginId(params.packageDir) ?? packageName;
	return validatePluginId(pluginId) ? void 0 : pluginId;
}
function readManagedNpmInstallTimestampMs(params) {
	const timestampPaths = params.sharedLegacyRoot ? [params.packageDir] : [path.join(params.projectRoot, "package.json"), params.projectRoot];
	for (const filePath of timestampPaths) try {
		return fs.statSync(filePath).mtimeMs;
	} catch {}
	return 0;
}
function buildRecoveredManagedNpmInstallCandidatesForRoot(params) {
	const dependencies = readStringRecord(params.rootManifest?.dependencies);
	const candidates = [];
	for (const [packageName, dependencySpec] of Object.entries(dependencies)) {
		const packageDir = path.join(params.projectRoot, "node_modules", ...packageName.split("/"));
		if (!safeStatSync(packageDir)?.isDirectory()) continue;
		if (hasRetainedManagedNpmInstallMarker(packageDir)) continue;
		const packageManifest = readJsonObjectFileSync(path.join(packageDir, "package.json"));
		const pluginId = resolveRecoveredManagedNpmPluginId({
			packageName,
			packageDir,
			packageManifest
		});
		if (!pluginId) continue;
		const version = typeof packageManifest?.version === "string" && packageManifest.version.trim() ? packageManifest.version.trim() : void 0;
		candidates.push({
			pluginId,
			installTimestampMs: readManagedNpmInstallTimestampMs({
				packageDir,
				projectRoot: params.projectRoot,
				sharedLegacyRoot: params.sharedLegacyRoot
			}),
			installRecord: {
				source: "npm",
				spec: `${packageName}@${dependencySpec}`,
				installPath: packageDir,
				...version ? {
					version,
					resolvedName: packageName,
					resolvedVersion: version
				} : {},
				...version ? { resolvedSpec: `${packageName}@${version}` } : {}
			}
		});
	}
	return candidates;
}
/** Lists recoverable managed npm installs without assigning active precedence. */
function listRecoveredManagedNpmInstallCandidates(options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	return [...buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot: npmRoot,
		rootManifest: readJsonObjectFileSync(path.join(npmRoot, "package.json")),
		sharedLegacyRoot: true
	}), ...listManagedPluginNpmProjectsSync(npmRoot).flatMap(({ projectRoot, manifest }) => buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot,
		rootManifest: manifest,
		sharedLegacyRoot: false
	}))];
}
function recordsShareInstallPath(left, right) {
	if (!left?.installPath || !right.installPath) return false;
	return normalizeInstallPathForComparison(left.installPath) === normalizeInstallPathForComparison(right.installPath);
}
function normalizeInstallPathForComparison(filePath) {
	const resolved = path.resolve(filePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison$1(resolved) : resolved;
}
function pickMostRecentRecoveredManagedNpmCandidate(candidates) {
	return candidates.toSorted((left, right) => {
		const byTimestamp = right.installTimestampMs - left.installTimestampMs;
		if (byTimestamp !== 0) return byTimestamp;
		return (right.installRecord.installPath ?? "").localeCompare(left.installRecord.installPath ?? "");
	})[0];
}
function emitManagedNpmRecoveryFallbackWarning(params) {
	process.emitWarning(`Managed npm recovery found ${params.candidates.length} installs for plugin "${params.pluginId}" without an authoritative active path; selected the most recently installed candidate. Run \`openclaw doctor --fix\` to persist and retire stale generations.`, {
		code: "OPENCLAW_PLUGIN_INSTALL_RECOVERY_FALLBACK",
		type: "OpenClawPluginRecoveryWarning",
		detail: JSON.stringify({
			pluginId: params.pluginId,
			selectedInstallPath: params.selected.installRecord.installPath,
			candidates: params.candidates.map((candidate) => ({
				installPath: candidate.installRecord.installPath,
				installTimestampMs: candidate.installTimestampMs
			}))
		})
	});
}
function buildRecoveredManagedNpmInstallRecords(persisted, options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const records = createPluginInstallRecordMap();
	const candidatesByPluginId = groupPluginRecords(listRecoveredManagedNpmInstallCandidates(options), (candidate) => candidate.pluginId);
	for (const [pluginId, candidates] of candidatesByPluginId) {
		const persistedRecord = getPluginInstallRecordMapEntry(persisted ?? void 0, pluginId);
		const authoritative = candidates.find((candidate) => recordsShareInstallPath(persistedRecord, candidate.installRecord));
		const selected = authoritative ?? pickMostRecentRecoveredManagedNpmCandidate(candidates);
		setPluginInstallRecordMapEntry(records, pluginId, selected.installRecord);
		const recoversUnavailableManagedPath = isUnavailableManagedNpmInstallRecord({
			npmRoot,
			persisted: persistedRecord,
			recovered: selected.installRecord
		});
		if (!authoritative && candidates.length > 1 && (!persistedRecord || recoversUnavailableManagedPath)) emitManagedNpmRecoveryFallbackWarning({
			pluginId,
			selected,
			candidates
		});
	}
	return records;
}
function readInstallRecordVersion(record) {
	return record?.resolvedVersion ?? record?.version;
}
function isUnavailableManagedNpmInstallRecord(params) {
	const installPath = params.persisted?.installPath;
	if (params.persisted?.source !== "npm" || !installPath) return false;
	try {
		if (fs.statSync(installPath).isDirectory()) return false;
	} catch (error) {
		if (!isNotFoundPathError$1(error)) return false;
	}
	const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(installPath);
	if (!packageInfo || packageInfo.packageName !== params.recovered.resolvedName) return false;
	const npmRoot = normalizeInstallPathForComparison(params.npmRoot);
	return normalizeInstallPathForComparison(packageInfo.projectRoot) === npmRoot || normalizeInstallPathForComparison(path.dirname(packageInfo.projectRoot)) === normalizeInstallPathForComparison(resolvePluginNpmProjectsDir(params.npmRoot));
}
function mergeRecoveredManagedNpmMetadata(persisted, recovered, options = {}) {
	const next = {
		...persisted,
		...recovered
	};
	if (options.preservePersistedSpec) {
		const persistedSpec = persisted.spec ? parseRegistryNpmSpec(persisted.spec) : null;
		const selectorIsCompatible = persistedSpec !== null && isPrereleaseResolutionAllowed({
			spec: persistedSpec,
			resolvedVersion: recovered.resolvedVersion
		}) && (persistedSpec.selectorKind !== "exact-version" || persistedSpec.selector !== void 0 && recovered.resolvedVersion !== void 0 && compareValidSemver(persistedSpec.selector, recovered.resolvedVersion) === 0);
		if (persistedSpec?.name === recovered.resolvedName && selectorIsCompatible) next.spec = persisted.spec;
	}
	delete next.integrity;
	delete next.shasum;
	delete next.resolvedAt;
	delete next.installedAt;
	return next;
}
function isForeignManagedNpmInstallRecord(params) {
	if (params.record?.source !== "npm") return false;
	const installPath = params.record.installPath;
	if (!installPath) return false;
	const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(installPath);
	if (!packageInfo) return false;
	const projectsDir = path.dirname(packageInfo.projectRoot);
	if (path.basename(projectsDir) !== "projects") return false;
	const previousNpmRoot = path.dirname(projectsDir);
	if (normalizeInstallPathForComparison(previousNpmRoot) === normalizeInstallPathForComparison(params.npmRoot)) return false;
	return isPluginNpmProjectDir({
		packageName: packageInfo.packageName,
		projectDir: packageInfo.projectRoot,
		npmDir: previousNpmRoot
	});
}
/** Lists existing npm projects that could be copied managed state or external installs. */
function findForeignManagedNpmInstallRecordPluginIds(persisted, options) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	return Object.entries(persisted ?? {}).flatMap(([pluginId, record]) => isForeignManagedNpmInstallRecord({
		npmRoot,
		record
	}) ? [pluginId] : []);
}
function mergeRecoveredManagedNpmRecord(params) {
	if (params.persisted && isUnavailableManagedNpmInstallRecord(params)) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered, { preservePersistedSpec: true });
	const persistedVersion = readInstallRecordVersion(params.persisted);
	const recoveredVersion = readInstallRecordVersion(params.recovered);
	if (params.persisted?.source === "npm" && recordsShareInstallPath(params.persisted, params.recovered) && recoveredVersion && persistedVersion !== recoveredVersion) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered);
	return params.persisted ?? params.recovered;
}
/** Merges persisted records with managed npm installs recovered from the current root. */
function mergeRecoveredManagedNpmInstallRecords(persisted, options) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const recovered = buildRecoveredManagedNpmInstallRecords(persisted, options);
	const merged = copyPluginInstallRecordMap(persisted ?? void 0);
	for (const [pluginId, record] of Object.entries(recovered)) setPluginInstallRecordMapEntry(merged, pluginId, mergeRecoveredManagedNpmRecord({
		npmRoot,
		persisted: getPluginInstallRecordMapEntry(merged, pluginId),
		recovered: record
	}));
	return merged;
}
/** Reads install records from the persisted installed plugin index. */
function readPersistedInstalledPluginIndexInstallRecords(options = {}) {
	const state = inspectPersistedInstalledPluginIndexInstallRecordsSync(options);
	return state.status === "valid" ? copyPluginInstallRecordMap(state.records) : null;
}
function requireLoadablePluginInstallRecordState(state) {
	if (state.status === "invalid") throw new Error("Persisted plugin install records are invalid. Run openclaw doctor to inspect and repair plugin installation state.");
	return state.status === "valid" ? state.records : null;
}
function resolveInstallRecordsCacheKey(options) {
	return [path.resolve(resolveInstalledPluginIndexStorePath(options)), resolveRecoveredManagedNpmRoot(options)].join("\0");
}
/** Loads installed plugin records, recovering managed npm installs and caching the result. */
async function loadInstalledPluginIndexInstallRecords(params = {}) {
	const captured = {
		...params,
		env: cloneEnvWithPlatformSemantics(params.env ?? process.env)
	};
	const cacheKey = resolveInstallRecordsCacheKey(captured);
	const cache = getPluginCache().installRecords;
	const cached = cache.get(cacheKey);
	if (cached) return copyPluginInstallRecordMap(cached);
	const prepared = await preparePersistedInstalledPluginIndexCacheEntry(captured);
	prepared.assertCurrent();
	const records = mergeRecoveredManagedNpmInstallRecords(requireLoadablePluginInstallRecordState(inspectPersistedInstalledPluginIndexInstallRecords(prepared.entry)), captured);
	prepared.assertCurrent();
	cache.set(cacheKey, records);
	return copyPluginInstallRecordMap(records);
}
/** Synchronously loads installed plugin records, recovering managed npm installs and caching them. */
function loadInstalledPluginIndexInstallRecordsSync(params = {}) {
	const cacheKey = resolveInstallRecordsCacheKey(params);
	const cache = getPluginCache().installRecords;
	const cached = cache.get(cacheKey);
	if (cached) return copyPluginInstallRecordMap(cached);
	const records = mergeRecoveredManagedNpmInstallRecords(requireLoadablePluginInstallRecordState(inspectPersistedInstalledPluginIndexInstallRecordsSync(params)), params);
	cache.set(cacheKey, records);
	return copyPluginInstallRecordMap(records);
}
//#endregion
export { readPersistedInstalledPluginIndexInstallRecords as a, inspectPersistedInstalledPluginIndexInstallRecordsSync as c, loadInstalledPluginIndexInstallRecordsSync as i, preparePersistedInstalledPluginIndexCacheEntry as l, listRecoveredManagedNpmInstallCandidates as n, clearLoadInstalledPluginIndexInstallRecordsCache as o, loadInstalledPluginIndexInstallRecords as r, getPersistedInstalledPluginIndexCacheEntry as s, findForeignManagedNpmInstallRecordPluginIds as t, preparePluginMetadataMachineState as u };
