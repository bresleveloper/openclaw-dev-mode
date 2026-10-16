import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { t as FsSafeError, w as root } from "../../fs-safe-BUXBSN-4.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import "../../security-runtime-CpTHQYW2.mjs";
import { a as resolveMemoryWikiConfig, i as resolveMemoryWikiAgentConfig, o as resolveMemoryWikiConfiguredAgentIds } from "../../config-BATWLWdx.mjs";
import { F as walkMemoryWikiDirectory, d as createMemoryWikiSourceSyncStateStore, i as createMemoryWikiImportRunStateStore, s as resolveMemoryWikiImportRunsDir } from "../../import-runs-state-DGOSREgh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
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
function unsupportedJsonWarning(filePath, emptySourceSync = false) {
	return `Memory Wiki: upgrades from pre-July-2026 JSON state are no longer migrated (${filePath}). ${emptySourceSync ? "No canonical SQLite source-sync state was found; an empty store cannot be distinguished from unmigrated state. " : "No canonical SQLite import-run record was found. "}Restore a backup produced by a July 2026 or newer release, or back up and move this retired file aside after verifying the SQLite state, then rerun openclaw doctor --fix. The file was left unchanged.`;
}
async function unsupportedSourceSyncFiles(params) {
	const warnings = [];
	const store = createMemoryWikiSourceSyncStateStore(params.context.openPluginStateKeyedStore);
	for (const vaultRoot of resolveConfiguredVaultRoots(params)) {
		const filePath = path.join(vaultRoot, ".openclaw-wiki", "source-sync.json");
		try {
			await fs.lstat(filePath);
		} catch (error) {
			if (isMissingPathError(error)) continue;
			throw error;
		}
		const state = await store.read(vaultRoot);
		if (Object.keys(state.entries).length === 0) warnings.push(unsupportedJsonWarning(filePath, true));
	}
	return warnings;
}
async function unsupportedImportRunFiles(params) {
	const warnings = [];
	const store = createMemoryWikiImportRunStateStore(params.context.openPluginStateKeyedStore);
	for (const vaultRoot of resolveConfiguredVaultRoots(params)) {
		const importRunsDir = resolveMemoryWikiImportRunsDir(vaultRoot);
		const files = await walkMemoryWikiDirectory(importRunsDir, "", {
			maxDepth: 1,
			entryFilter: (entry) => entry.kind === "directory" ? "skip-subtree" : entry.kind === "file" && entry.relativePath.endsWith(".json") ? "include" : "skip"
		}).catch((error) => {
			if (isMissingPathError(error)) return [];
			throw error;
		});
		if (files.length === 0) continue;
		const runIds = new Set((await store.list(vaultRoot)).map((record) => record.runId));
		for (const file of files) if (!runIds.has(file.relativePath.slice(0, -5))) warnings.push(unsupportedJsonWarning(path.join(importRunsDir, file.relativePath)));
	}
	return warnings;
}
const stateMigrations = [
	{
		id: "memory-wiki-compiled-cache-file-cleanup",
		label: "Memory Wiki compiled cache files",
		collectBackupResources(params) {
			return resolveConfiguredVaultRoots(params).flatMap((vaultRoot) => LEGACY_MEMORY_WIKI_COMPILED_CACHE_PATHS.map((relativePath) => ({
				path: path.join(vaultRoot, relativePath),
				kind: "file"
			})));
		},
		async detectLegacyState(params) {
			const previews = [];
			for (const vaultRoot of resolveConfiguredVaultRoots(params)) {
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
			for (const vaultRoot of resolveConfiguredVaultRoots(params)) {
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
		label: "Memory Wiki unsupported source-sync JSON",
		collectBackupResources: () => [],
		async detectLegacyState(params) {
			const warnings = await unsupportedSourceSyncFiles(params);
			return warnings.length > 0 ? { preview: warnings.map((warning) => `- ${warning}`) } : null;
		},
		async migrateLegacyState(params) {
			return {
				changes: [],
				warnings: await unsupportedSourceSyncFiles(params)
			};
		}
	},
	{
		id: "memory-wiki-import-runs-json-to-plugin-state",
		label: "Memory Wiki unsupported import-run JSON",
		collectBackupResources: () => [],
		async detectLegacyState(params) {
			const warnings = await unsupportedImportRunFiles(params);
			return warnings.length > 0 ? { preview: warnings.map((warning) => `- ${warning}`) } : null;
		},
		async migrateLegacyState(params) {
			return {
				changes: [],
				warnings: await unsupportedImportRunFiles(params)
			};
		}
	}
];
//#endregion
export { stateMigrations };
