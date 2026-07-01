import { S as writeMemoryWikiSourceSyncState, _ as readLegacyMemoryWikiSourceSyncState, a as createMemoryWikiImportRunStateStore, d as MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES, f as MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE, h as createMemoryWikiSourceSyncStateStore, i as countMemoryWikiImportRunStateRows, l as resolveMemoryWikiImportRunsDir, n as MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE, o as listMemoryWikiImportRunRecords, s as readLegacyMemoryWikiImportRunRecords, t as MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES, u as writeMemoryWikiImportRunRecord, y as resolveMemoryWikiSourceSyncStatePath } from "../../import-runs-state-w-5ZK3Ty.js";
import { d as resolveMemoryWikiConfig } from "../../config-CHDKj8bZ.js";
import { r as normalizeCompatibilityConfig, t as legacyConfigRules } from "../../config-compat-EHJL5WId.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-wiki/doctor-contract-api.ts
function isRecord(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function resolveHomeDir(env) {
	return env.HOME?.trim() || env.USERPROFILE?.trim() || void 0;
}
function readConfiguredPluginConfig(config) {
	const entries = config.plugins?.entries;
	const pluginEntry = isRecord(entries) ? entries["memory-wiki"] : void 0;
	if (!isRecord(pluginEntry) || !isRecord(pluginEntry.config)) return;
	return pluginEntry.config;
}
function resolveConfiguredVaultRoots(params) {
	const homeDir = resolveHomeDir(params.env);
	return [resolveMemoryWikiConfig(readConfiguredPluginConfig(params.config), { homedir: homeDir }).vault.path];
}
async function fileExists(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
async function archiveLegacySource(params) {
	const archivedPath = `${params.filePath}.migrated`;
	if (await fileExists(archivedPath)) {
		params.warnings.push(`Left migrated ${params.label} in place because ${archivedPath} already exists`);
		return;
	}
	try {
		await fs.rename(params.filePath, archivedPath);
		params.changes.push(`Archived ${params.label} -> ${archivedPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving ${params.label}: ${String(err)}`);
	}
}
async function archiveLegacyImportRunRecords(params) {
	const importRunsDir = resolveMemoryWikiImportRunsDir(params.vaultRoot);
	const entries = await fs.readdir(importRunsDir, { withFileTypes: true }).catch((error) => {
		if (isRecord(error) && error.code === "ENOENT") return [];
		throw error;
	});
	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
		await archiveLegacySource({
			filePath: path.join(importRunsDir, entry.name),
			label: "Memory Wiki import-run legacy record",
			changes: params.changes,
			warnings: params.warnings
		});
	}
}
function countImportRunStateRows(records) {
	return records.reduce((total, record) => total + 1 + record.createdPaths.length + record.updatedPaths.length, 0);
}
const stateMigrations = [{
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
			if (count === 0 || !await fileExists(filePath)) continue;
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
			if (!await fileExists(filePath)) continue;
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
			await archiveLegacySource({
				filePath,
				label: "Memory Wiki source-sync legacy source",
				changes,
				warnings
			});
		}
		return {
			changes,
			warnings
		};
	}
}, {
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
}];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
