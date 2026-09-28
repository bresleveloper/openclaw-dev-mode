import { c as isRecord, r as asNullableRecord } from "../../record-coerce-DItp3I4t.mjs";
import { t as FsSafeError, w as root } from "../../fs-safe-BAPek8At.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../runtime-doctor-migrations-_pMXigSc.mjs";
import { n as legacyStateFileExists, t as archiveLegacyStateSource } from "../../doctor-state-migration-fs-CfVap4xL.mjs";
import "../../security-runtime-HdPo6iAV.mjs";
import { a as resolveMemoryWikiConfig, i as resolveMemoryWikiAgentConfig, o as resolveMemoryWikiConfiguredAgentIds } from "../../config-DtaJXrmb.mjs";
import { S as writeMemoryWikiSourceSyncState, _ as readLegacyMemoryWikiSourceSyncState, a as createMemoryWikiImportRunStateStore, d as MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES, f as MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE, h as createMemoryWikiSourceSyncStateStore, i as countMemoryWikiImportRunStateRows, l as resolveMemoryWikiImportRunsDir, n as MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE, o as listMemoryWikiImportRunRecords, s as readLegacyMemoryWikiImportRunRecords, t as MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES, u as writeMemoryWikiImportRunRecord, y as resolveMemoryWikiSourceSyncStatePath } from "../../import-runs-state-CE1H5GV6.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-wiki/src/config-compat.ts
function hasLegacyBridgeArtifactToggle(value) {
	return Object.hasOwn(asNullableRecord(value) ?? {}, "readMemoryCore");
}
const legacyConfigRules = [{
	path: [
		"plugins",
		"entries",
		"memory-wiki",
		"config",
		"bridge"
	],
	message: "plugins.entries.memory-wiki.config.bridge.readMemoryCore is legacy; use plugins.entries.memory-wiki.config.bridge.readMemoryArtifacts. Run \"openclaw doctor --fix\".",
	match: hasLegacyBridgeArtifactToggle
}];
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
function normalizeCompatibilityConfig({ cfg }) {
	return migrateMemoryWikiLegacyConfig(cfg) ?? {
		config: cfg,
		changes: []
	};
}
//#endregion
//#region extensions/memory-wiki/doctor-contract-api.ts
const LEGACY_MEMORY_WIKI_COMPILED_CACHE_PATHS = [".openclaw-wiki/cache/agent-digest.json", ".openclaw-wiki/cache/claims.jsonl"];
function resolveHomeDir(env) {
	return env.HOME?.trim() || env.USERPROFILE?.trim() || void 0;
}
function isMissingPathError(error) {
	return error instanceof FsSafeError && error.code === "not-found" || isRecord(error) && error.code === "ENOENT";
}
async function safeLegacyCacheFileExists(vaultRoot, relativePath) {
	try {
		return (await vaultRoot.stat(relativePath)).isFile;
	} catch (error) {
		if (isMissingPathError(error) || error instanceof FsSafeError) return false;
		throw error;
	}
}
async function openExistingVaultRoot(vaultRoot) {
	try {
		return await root(vaultRoot);
	} catch (error) {
		if (isMissingPathError(error)) return null;
		throw error;
	}
}
function readConfiguredPluginConfig(config) {
	const entries = config.plugins?.entries;
	const pluginEntry = isRecord(entries) ? entries["memory-wiki"] : void 0;
	if (!isRecord(pluginEntry) || !isRecord(pluginEntry.config)) return;
	return pluginEntry.config;
}
function resolveConfiguredVaultRoots(params) {
	const homeDir = resolveHomeDir(params.env);
	const resolved = resolveMemoryWikiConfig(readConfiguredPluginConfig(params.config), {
		homedir: homeDir,
		env: params.env
	});
	if (resolved.vault.scope === "global") return [resolved.vault.path];
	return resolveMemoryWikiConfiguredAgentIds(params.config).map((agentId) => resolveMemoryWikiAgentConfig({
		config: resolved,
		appConfig: params.config,
		agentId
	}).vault.path);
}
async function archiveLegacyImportRunRecords(params) {
	const importRunsDir = resolveMemoryWikiImportRunsDir(params.vaultRoot);
	const entries = await fs.readdir(importRunsDir, { withFileTypes: true }).catch((error) => {
		if (isRecord(error) && error.code === "ENOENT") return [];
		throw error;
	});
	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
		await archiveLegacyStateSource({
			filePath: path.join(importRunsDir, entry.name),
			label: "Memory Wiki import-run",
			changes: params.changes,
			warnings: params.warnings
		});
	}
}
function countImportRunStateRows(records) {
	return records.reduce((total, record) => total + 1 + record.createdPaths.length + record.updatedPaths.length, 0);
}
const stateMigrations = [
	{
		id: "memory-wiki-compiled-cache-file-cleanup",
		label: "Memory Wiki compiled cache files",
		async detectLegacyState(params) {
			const previews = [];
			for (const vaultRoot of resolveConfiguredVaultRoots({
				config: params.config,
				env: params.env
			})) {
				const root = await openExistingVaultRoot(vaultRoot);
				if (!root) continue;
				const stalePaths = (await Promise.all(LEGACY_MEMORY_WIKI_COMPILED_CACHE_PATHS.map(async (relativePath) => {
					const filePath = path.join(vaultRoot, relativePath);
					return await safeLegacyCacheFileExists(root, relativePath) ? filePath : null;
				}))).filter((filePath) => Boolean(filePath));
				for (const filePath of stalePaths) previews.push(`- Remove rebuildable Memory Wiki compiled cache: ${filePath}`);
			}
			return previews.length > 0 ? { preview: previews } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			for (const vaultRoot of resolveConfiguredVaultRoots({
				config: params.config,
				env: params.env
			})) {
				const root = await openExistingVaultRoot(vaultRoot);
				if (!root) continue;
				for (const relativePath of LEGACY_MEMORY_WIKI_COMPILED_CACHE_PATHS) {
					const filePath = path.join(vaultRoot, relativePath);
					if (!await safeLegacyCacheFileExists(root, relativePath)) continue;
					try {
						await root.remove(relativePath);
						changes.push(`Removed rebuildable Memory Wiki compiled cache: ${filePath}`);
					} catch (error) {
						if (!isMissingPathError(error)) warnings.push(`Skipped rebuildable Memory Wiki compiled cache cleanup. Run openclaw doctor --fix to retry. ${filePath}: ${String(error)}`);
					}
				}
			}
			return {
				changes,
				warnings,
				...warnings.length > 0 ? { warningDisposition: "recoverable" } : {}
			};
		}
	},
	{
		id: "memory-wiki-source-sync-json-to-plugin-state",
		label: "Memory Wiki source sync state",
		async detectLegacyState(params) {
			const previews = [];
			for (const vaultRoot of resolveConfiguredVaultRoots({
				config: params.config,
				env: params.env
			})) {
				const filePath = resolveMemoryWikiSourceSyncStatePath(vaultRoot);
				const state = await readLegacyMemoryWikiSourceSyncState(vaultRoot);
				const count = Object.keys(state.entries).length;
				if (count === 0 || !await legacyStateFileExists(filePath)) continue;
				previews.push(`- Memory Wiki source sync: ${filePath} -> plugin state (${MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE}, ${count} entries)`);
			}
			return previews.length > 0 ? { preview: previews } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const store = createMemoryWikiSourceSyncStateStore(params.context.openPluginStateKeyedStore);
			for (const vaultRoot of resolveConfiguredVaultRoots({
				config: params.config,
				env: params.env
			})) {
				const filePath = resolveMemoryWikiSourceSyncStatePath(vaultRoot);
				if (!await legacyStateFileExists(filePath)) continue;
				const state = await readLegacyMemoryWikiSourceSyncState(vaultRoot);
				if (Object.keys(state.entries).length === 0) continue;
				const existingState = await store.read(vaultRoot);
				const mergedEntries = {
					...state.entries,
					...existingState.entries
				};
				const mergedCount = Object.keys(mergedEntries).length;
				if (mergedCount > 2e4) {
					warnings.push(`Skipped Memory Wiki source-sync import for ${vaultRoot}: ${mergedCount} entries exceeds ${MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES}`);
					continue;
				}
				await writeMemoryWikiSourceSyncState(vaultRoot, {
					version: 1,
					entries: mergedEntries
				}, store);
				const existingCount = Object.keys(existingState.entries).length;
				const importedCount = mergedCount - existingCount;
				changes.push(`Migrated Memory Wiki source sync -> plugin state (${importedCount} imported, ${existingCount} existing)`);
				await archiveLegacyStateSource({
					filePath,
					label: "Memory Wiki source-sync",
					changes,
					warnings
				});
			}
			return {
				changes,
				warnings
			};
		}
	},
	{
		id: "memory-wiki-import-runs-json-to-plugin-state",
		label: "Memory Wiki import run records",
		async detectLegacyState(params) {
			const previews = [];
			for (const vaultRoot of resolveConfiguredVaultRoots({
				config: params.config,
				env: params.env
			})) {
				const records = await readLegacyMemoryWikiImportRunRecords(vaultRoot);
				if (records.length === 0) continue;
				previews.push(`- Memory Wiki import runs: ${resolveMemoryWikiImportRunsDir(vaultRoot)}/*.json -> plugin state (${MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE}, ${records.length} records)`);
			}
			return previews.length > 0 ? { preview: previews } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const store = createMemoryWikiImportRunStateStore(params.context.openPluginStateKeyedStore);
			for (const vaultRoot of resolveConfiguredVaultRoots({
				config: params.config,
				env: params.env
			})) {
				const records = await readLegacyMemoryWikiImportRunRecords(vaultRoot);
				if (records.length === 0) continue;
				const existingRecords = await listMemoryWikiImportRunRecords(vaultRoot, store);
				const existingRunIds = new Set(existingRecords.map((record) => record.runId));
				const importedRecords = records.filter((record) => !existingRunIds.has(record.runId));
				const nextRowCount = await countMemoryWikiImportRunStateRows(store) + countImportRunStateRows(importedRecords);
				if (nextRowCount > 2e4) {
					warnings.push(`Skipped Memory Wiki import-run import for ${vaultRoot}: ${nextRowCount} state rows exceeds ${MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES}`);
					continue;
				}
				let importedCount = 0;
				for (const record of importedRecords) {
					await writeMemoryWikiImportRunRecord(vaultRoot, record, store);
					importedCount += 1;
				}
				changes.push(`Migrated Memory Wiki import runs -> plugin state (${importedCount} imported, ${existingRunIds.size} existing)`);
				await archiveLegacyImportRunRecords({
					vaultRoot,
					changes,
					warnings
				});
			}
			return {
				changes,
				warnings
			};
		}
	}
];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
