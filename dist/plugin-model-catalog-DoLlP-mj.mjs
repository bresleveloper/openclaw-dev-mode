import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as isProviderCatalogSourceAllowed } from "./provider-config-owner-CewfXQTW.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { h as resolveAuthProfileDatabasePath, m as resolveAuthProfileDatabaseOwnerId } from "./sqlite-BIg_k8qE.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { linkSync, readFileSync, readdirSync, renameSync, unlinkSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/agents/plugin-model-catalog-repair.ts
/** Pure repair rules for OpenClaw-generated plugin model catalogs. */
const PLUGIN_MODEL_CATALOG_GENERATED_BY = "openclaw-plugin-model-catalog-v1";
function hasCatalogApi(value) {
	return typeof value === "string" && value.length > 0;
}
/** Detects the existing generated-catalog marker without admitting arrays or null. */
function isGeneratedPluginModelCatalog(value) {
	return isRecord(value) && value.generatedBy === "openclaw-plugin-model-catalog-v1";
}
/** Removes model rows whose transport API cannot be derived without inventing semantics. */
function repairPluginModelCatalogTransportMetadata(contents) {
	let parsed;
	try {
		parsed = JSON.parse(contents);
	} catch {
		return {
			contents,
			removedModelCount: 0
		};
	}
	if (!isGeneratedPluginModelCatalog(parsed) || !isRecord(parsed.providers)) return {
		contents,
		removedModelCount: 0
	};
	let removedModelCount = 0;
	const providers = {};
	for (const [providerId, provider] of Object.entries(parsed.providers)) {
		if (!isRecord(provider) || !Array.isArray(provider.models) || hasCatalogApi(provider.api)) {
			providers[providerId] = provider;
			continue;
		}
		const models = provider.models.filter((model) => isRecord(model) && hasCatalogApi(model.api));
		removedModelCount += provider.models.length - models.length;
		providers[providerId] = models.length === provider.models.length ? provider : {
			...provider,
			models
		};
	}
	if (removedModelCount === 0) return {
		contents,
		removedModelCount
	};
	const trailingNewline = contents.endsWith("\n") ? "\n" : "";
	return {
		contents: `${JSON.stringify({
			...parsed,
			providers
		}, null, 2)}${trailingNewline}`,
		removedModelCount
	};
}
//#endregion
//#region src/agents/plugin-model-catalog.ts
/**
* Generated plugin model catalog discovery.
*
* The existing agent SQLite cache lets provider discovery reuse plugin-owned
* catalogs without loading runtimes or creating parallel state files.
*/
const PLUGIN_MODEL_CATALOG_FILE = "catalog.json";
const PLUGIN_MODEL_CATALOG_CACHE_SCOPE = "plugin-model-catalog-v1";
const PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE = "plugin-model-catalog-migration-v1";
/** Recognizes canonical catalogs and recoverable atomic migration claims. */
function isPluginModelCatalogMigrationFile(filename) {
	return filename === PLUGIN_MODEL_CATALOG_FILE || filename.startsWith(`${PLUGIN_MODEL_CATALOG_FILE}.doctor-importing-`);
}
function pluginModelCatalogDatabaseOptions(agentDir) {
	return {
		agentId: resolveAuthProfileDatabaseOwnerId(agentDir),
		path: resolveAuthProfileDatabasePath(agentDir)
	};
}
function readPersistedPluginModelCatalogEntries(agentDir, scope) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const kysely = getNodeSqliteKysely(database.db);
		return executeSqliteQuerySync(database.db, kysely.selectFrom("cache_entries").select(["key", "value_json"]).where("scope", "=", scope).orderBy("key")).rows.flatMap((row) => row.value_json === null ? [] : [{
			pluginId: row.key,
			contents: row.value_json
		}]);
	}, pluginModelCatalogDatabaseOptions(agentDir));
	return result.found ? result.value : [];
}
function readPersistedPluginModelCatalogs(agentDir) {
	return readPersistedPluginModelCatalogEntries(agentDir, PLUGIN_MODEL_CATALOG_CACHE_SCOPE);
}
/**
* Reads an exact plugin-catalog generation without migration or repair writes.
* Lifecycle preparation uses this for configured providers before atomic publication.
*/
function loadPersistedPluginModelCatalogsReadOnly(agentDir, pluginIds) {
	if (pluginIds?.length === 0) return [];
	const catalogs = readPersistedPluginModelCatalogs(agentDir);
	if (!pluginIds) return catalogs;
	const allowed = new Set(pluginIds);
	return catalogs.filter(({ pluginId }) => allowed.has(pluginId));
}
/** Applies Doctor's repair to unchanged persisted catalog bytes. */
function repairPersistedPluginModelCatalogs(params) {
	const repairs = params.catalogs.flatMap((catalog) => {
		const repaired = repairPluginModelCatalogTransportMetadata(catalog.contents);
		return repaired.removedModelCount > 0 ? [{
			...catalog,
			repairedContents: repaired.contents,
			removedModelCount: repaired.removedModelCount
		}] : [];
	});
	if (repairs.length === 0) return [];
	const updatedAt = Date.now();
	return runOpenClawAgentWriteTransaction((database) => {
		const kysely = getNodeSqliteKysely(database.db);
		return repairs.flatMap((repair) => {
			return executeSqliteQuerySync(database.db, kysely.updateTable("cache_entries").set({
				value_json: repair.repairedContents,
				updated_at: updatedAt
			}).where("scope", "=", PLUGIN_MODEL_CATALOG_CACHE_SCOPE).where("key", "=", repair.pluginId).where("value_json", "=", repair.contents)).numAffectedRows === 1n ? [repair] : [];
		});
	}, pluginModelCatalogDatabaseOptions(params.agentDir), { operationLabel: "plugin-model-catalog.repair" }).map(({ pluginId, removedModelCount }) => ({
		pluginId,
		removedModelCount
	}));
}
function readPersistedPluginModelCatalogMigrationPayloads(agentDir) {
	return new Map(readPersistedPluginModelCatalogEntries(agentDir, PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE).map((catalog) => [catalog.pluginId, catalog.contents]));
}
function replacePersistedPluginModelCatalogEntries(params) {
	if (params.planned.size === 0 && (params.deleteMissing === false || readPersistedPluginModelCatalogs(params.agentDir).length === 0)) return false;
	const updatedAt = Date.now();
	return runOpenClawAgentWriteTransaction((database) => {
		const kysely = getNodeSqliteKysely(database.db);
		const existing = executeSqliteQuerySync(database.db, kysely.selectFrom("cache_entries").select(["key", "value_json"]).where("scope", "=", PLUGIN_MODEL_CATALOG_CACHE_SCOPE)).rows;
		const existingByPluginId = new Map(existing.map((row) => [row.key, row.value_json]));
		const existingMigrationPayloads = params.migrationPayloads ? new Map(executeSqliteQuerySync(database.db, kysely.selectFrom("cache_entries").select(["key", "value_json"]).where("scope", "=", PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE)).rows.map((row) => [row.key, row.value_json])) : void 0;
		const upsertCacheEntry = (scope, pluginId, contents) => {
			executeSqliteQuerySync(database.db, kysely.insertInto("cache_entries").values({
				scope,
				key: pluginId,
				value_json: contents,
				blob: null,
				expires_at: null,
				updated_at: updatedAt
			}).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet({
				value_json: contents,
				blob: null,
				expires_at: null,
				updated_at: updatedAt
			})));
		};
		let changed = false;
		for (const [pluginId, contents] of params.planned) {
			const migrationPayload = params.migrationPayloads?.get(pluginId);
			if (migrationPayload && existingMigrationPayloads?.get(pluginId) === migrationPayload) continue;
			if (existingByPluginId.get(pluginId) !== contents) {
				upsertCacheEntry(PLUGIN_MODEL_CATALOG_CACHE_SCOPE, pluginId, contents);
				changed = true;
			}
			if (migrationPayload) {
				upsertCacheEntry(PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE, pluginId, migrationPayload);
				changed = true;
			}
		}
		if (params.deleteMissing !== false) for (const pluginId of existingByPluginId.keys()) {
			if (params.planned.has(pluginId)) continue;
			executeSqliteQuerySync(database.db, kysely.deleteFrom("cache_entries").where("scope", "=", PLUGIN_MODEL_CATALOG_CACHE_SCOPE).where("key", "=", pluginId));
			changed = true;
		}
		return changed;
	}, pluginModelCatalogDatabaseOptions(params.agentDir), { operationLabel: params.deleteMissing === false ? "plugin-model-catalog.migrate" : "plugin-model-catalog.replace" });
}
function readLegacyPluginModelCatalog(pathname) {
	try {
		return readFileSync(pathname, "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
function hasCommittedExpectedPluginModelCatalogs(agentDir, expectedContents) {
	const committed = new Map(readPersistedPluginModelCatalogs(agentDir).map((catalog) => [catalog.pluginId, catalog.contents]));
	const migrationPayloads = readPersistedPluginModelCatalogMigrationPayloads(agentDir);
	for (const [pluginId, contents] of expectedContents) if (committed.get(pluginId) !== contents && migrationPayloads.get(pluginId) !== contents) return false;
	return true;
}
function hasCommittedMigratedPluginModelCatalog(agentDir, pluginId, contents) {
	return readPersistedPluginModelCatalogs(agentDir).find((catalog) => catalog.pluginId === pluginId)?.contents === contents && readPersistedPluginModelCatalogMigrationPayloads(agentDir).get(pluginId) === contents;
}
function retireCommittedPluginModelCatalogMigration(params) {
	return runOpenClawAgentWriteTransaction((database) => {
		const kysely = getNodeSqliteKysely(database.db);
		const committed = executeSqliteQuerySync(database.db, kysely.selectFrom("cache_entries").select(["scope", "value_json"]).where("key", "=", params.pluginId).where("scope", "in", [PLUGIN_MODEL_CATALOG_CACHE_SCOPE, PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE])).rows;
		const contentsByScope = new Map(committed.map((row) => [row.scope, row.value_json]));
		if (contentsByScope.get(PLUGIN_MODEL_CATALOG_CACHE_SCOPE) !== params.contents || contentsByScope.get(PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE) !== params.contents) return false;
		executeSqliteQuerySync(database.db, kysely.deleteFrom("cache_entries").where("scope", "=", PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE).where("key", "=", params.pluginId));
		return true;
	}, pluginModelCatalogDatabaseOptions(params.agentDir), { operationLabel: "plugin-model-catalog.retire-migration" });
}
function retireOrphanedPluginModelCatalogMigrations(params) {
	for (const [pluginId, contents] of readPersistedPluginModelCatalogMigrationPayloads(params.agentDir)) {
		if (params.protectedPluginIds?.has(pluginId)) continue;
		retireCommittedPluginModelCatalogMigration({
			agentDir: params.agentDir,
			pluginId,
			contents
		});
	}
}
/** Inspects released sidecars without creating, repairing, claiming, or removing state. */
function inspectLegacyPluginModelCatalogs(agentDir) {
	const pluginsDir = path.join(agentDir, "plugins");
	let pluginDirs;
	try {
		pluginDirs = readdirSync(pluginsDir, { withFileTypes: true });
	} catch (error) {
		return {
			catalogs: [],
			warnings: error.code === "ENOENT" ? [] : [`Could not inspect legacy provider catalogs: ${pluginsDir}`],
			protectedPluginIds: /* @__PURE__ */ new Set(),
			directoryError: error
		};
	}
	const warnings = [];
	const legacyCatalogs = [];
	const protectedMigrationPluginIds = /* @__PURE__ */ new Set();
	for (const pluginDir of pluginDirs) {
		if (!pluginDir.isDirectory()) continue;
		const pluginId = decodePluginModelCatalogRelativePathPluginId(path.join("plugins", pluginDir.name, PLUGIN_MODEL_CATALOG_FILE));
		if (!pluginId) continue;
		const pluginPath = path.join(agentDir, "plugins", pluginDir.name);
		let catalogFiles;
		try {
			catalogFiles = readdirSync(pluginPath, { withFileTypes: true });
		} catch {
			protectedMigrationPluginIds.add(pluginId);
			warnings.push(`Could not inspect legacy provider catalogs: ${pluginPath}`);
			continue;
		}
		const sourceFiles = catalogFiles.filter((entry) => entry.isFile() && isPluginModelCatalogMigrationFile(entry.name)).toSorted((left, right) => {
			if (left.name === PLUGIN_MODEL_CATALOG_FILE) return 1;
			if (right.name === PLUGIN_MODEL_CATALOG_FILE) return -1;
			return left.name.localeCompare(right.name);
		});
		if (sourceFiles.length > 0) protectedMigrationPluginIds.add(pluginId);
		const pluginLegacyCatalogs = [];
		let hasUnreadableCatalog = false;
		for (const sourceFile of sourceFiles) {
			const pathname = path.join(pluginPath, sourceFile.name);
			let contents;
			try {
				contents = readLegacyPluginModelCatalog(pathname);
			} catch {
				hasUnreadableCatalog = true;
				warnings.push(`Could not read legacy provider catalog: ${pathname}`);
				continue;
			}
			if (contents === null) {
				warnings.push(`Legacy provider catalog disappeared before migration: ${pathname}`);
				continue;
			}
			let parsed;
			try {
				parsed = JSON.parse(contents);
			} catch {
				continue;
			}
			if (isGeneratedPluginModelCatalog(parsed)) pluginLegacyCatalogs.push({
				pluginId,
				pathname,
				contents
			});
		}
		if (hasUnreadableCatalog) continue;
		if (!pluginLegacyCatalogs.some((catalog) => path.basename(catalog.pathname) === PLUGIN_MODEL_CATALOG_FILE) && new Set(pluginLegacyCatalogs.map((catalog) => catalog.contents)).size > 1) {
			warnings.push(`Conflicting retained legacy provider catalogs: ${pluginPath}`);
			continue;
		}
		legacyCatalogs.push(...pluginLegacyCatalogs);
	}
	return {
		catalogs: legacyCatalogs,
		warnings,
		protectedPluginIds: protectedMigrationPluginIds
	};
}
/** Doctor-owned import of released sidecars into canonical agent SQLite state. */
function migrateLegacyPluginModelCatalogs(params) {
	const agentDir = path.resolve(params.agentDir);
	const { catalogs: legacyCatalogs, warnings, protectedPluginIds: protectedMigrationPluginIds, directoryError } = inspectLegacyPluginModelCatalogs(agentDir);
	if (directoryError) {
		if (!hasErrnoCode(directoryError, "ENOENT")) {
			if (params.expectedContents && !hasCommittedExpectedPluginModelCatalogs(agentDir, params.expectedContents)) throw new Error("Could not inspect expected legacy provider catalogs", { cause: directoryError });
			return {
				detected: 0,
				migrated: 0,
				warnings
			};
		}
		if (params.expectedContents && params.expectedContents.size > 0 && !hasCommittedExpectedPluginModelCatalogs(agentDir, params.expectedContents)) throw new Error("Legacy provider catalogs disappeared before migration", { cause: directoryError });
		retireOrphanedPluginModelCatalogMigrations({ agentDir });
		return {
			detected: 0,
			migrated: 0,
			warnings: []
		};
	}
	retireOrphanedPluginModelCatalogMigrations({
		agentDir,
		protectedPluginIds: protectedMigrationPluginIds
	});
	if (params.expectedContents) {
		const observed = new Map(legacyCatalogs.map((catalog) => [catalog.pluginId, catalog.contents]));
		for (const [pluginId, contents] of params.expectedContents) {
			const observedContents = observed.get(pluginId);
			if (observedContents === contents) continue;
			if (observedContents === void 0 && hasCommittedExpectedPluginModelCatalogs(agentDir, /* @__PURE__ */ new Map([[pluginId, contents]]))) continue;
			if (observedContents !== contents) throw new Error(`Legacy provider catalog changed before migration: ${pluginId}`);
		}
	}
	if (legacyCatalogs.length === 0) return {
		detected: 0,
		migrated: 0,
		warnings
	};
	let migrated = 0;
	for (const catalog of legacyCatalogs) {
		if (readPersistedPluginModelCatalogMigrationPayloads(agentDir).get(catalog.pluginId) === catalog.contents && !hasCommittedMigratedPluginModelCatalog(agentDir, catalog.pluginId, catalog.contents)) {
			warnings.push(`Left superseded legacy provider catalog in place: ${catalog.pathname}`);
			continue;
		}
		params.beforeLegacyCatalogClaim?.(catalog.pathname);
		const claimPath = `${catalog.pathname}.doctor-importing-${process.pid}-${randomUUID()}`;
		try {
			renameSync(catalog.pathname, claimPath);
		} catch (error) {
			if (error.code === "ENOENT") {
				if (hasCommittedExpectedPluginModelCatalogs(agentDir, /* @__PURE__ */ new Map([[catalog.pluginId, catalog.contents]]))) migrated += 1;
				else warnings.push(`Legacy provider catalog was claimed before its migration was committed: ${catalog.pathname}`);
			} else {
				try {
					if (readLegacyPluginModelCatalog(catalog.pathname) === catalog.contents) {
						const migrationPayloads = /* @__PURE__ */ new Map([[catalog.pluginId, catalog.contents]]);
						replacePersistedPluginModelCatalogEntries({
							agentDir,
							planned: migrationPayloads,
							migrationPayloads,
							deleteMissing: false
						});
					}
				} catch {}
				warnings.push(`Could not remove migrated legacy provider catalog: ${catalog.pathname}`);
			}
			continue;
		}
		try {
			if (readLegacyPluginModelCatalog(claimPath) !== catalog.contents) throw new Error("legacy provider catalog changed before migration could claim it");
			const migrationPayloads = /* @__PURE__ */ new Map([[catalog.pluginId, catalog.contents]]);
			replacePersistedPluginModelCatalogEntries({
				agentDir,
				planned: migrationPayloads,
				migrationPayloads,
				deleteMissing: false
			});
			if (!hasCommittedMigratedPluginModelCatalog(agentDir, catalog.pluginId, catalog.contents)) throw new Error("committed provider catalog changed before migration could remove it");
			unlinkSync(claimPath);
		} catch {
			let retainedPath = claimPath;
			try {
				linkSync(claimPath, catalog.pathname);
				retainedPath = catalog.pathname;
				unlinkSync(claimPath);
			} catch {}
			warnings.push(`Left changed legacy provider catalog in place: ${retainedPath}`);
			continue;
		}
		retireCommittedPluginModelCatalogMigration({
			agentDir,
			pluginId: catalog.pluginId,
			contents: catalog.contents
		});
		migrated += 1;
	}
	return {
		detected: legacyCatalogs.length,
		migrated,
		warnings
	};
}
/** Replaces rebuildable provider catalogs in the existing per-agent SQLite cache. */
function replacePersistedPluginModelCatalogs(params) {
	const planned = /* @__PURE__ */ new Map();
	for (const [relativePath, contents] of Object.entries(params.pluginCatalogWrites)) {
		const pluginId = decodePluginModelCatalogRelativePathPluginId(relativePath);
		if (!pluginId) throw new Error(`Invalid generated plugin model catalog key: ${relativePath}`);
		planned.set(pluginId, repairPluginModelCatalogTransportMetadata(contents).contents);
	}
	return replacePersistedPluginModelCatalogEntries({
		agentDir: params.agentDir,
		planned
	});
}
/** Encodes the profile-relative path for a plugin-owned generated model catalog. */
function encodePluginModelCatalogRelativePath(pluginId) {
	return `plugins/${encodeURIComponent(pluginId)}/${PLUGIN_MODEL_CATALOG_FILE}`;
}
/** Returns true only for canonical profile-relative generated catalog paths. */
function isPluginModelCatalogRelativePath(relativePath) {
	const parts = relativePath.split(/[\\/]/);
	return !path.isAbsolute(relativePath) && parts.length === 3 && parts[0] === "plugins" && parts[1] !== "" && parts[1] !== "." && parts[1] !== ".." && parts[2] === PLUGIN_MODEL_CATALOG_FILE;
}
/** Decodes the plugin id from a canonical generated catalog path. */
function decodePluginModelCatalogRelativePathPluginId(relativePath) {
	if (!isPluginModelCatalogRelativePath(relativePath)) return;
	const encodedPluginId = relativePath.split(/[\\/]/)[1];
	if (!encodedPluginId) return;
	try {
		return decodeURIComponent(encodedPluginId);
	} catch {
		return;
	}
}
/** Resolves the sole enabled plugin that owns a provider's model catalog. */
function resolvePluginModelCatalogOwnerPluginId(params) {
	const snapshot = params.pluginMetadataSnapshot;
	const owners = snapshot?.owners;
	if (!owners) return;
	const providerId = normalizeProviderId(params.providerId);
	const candidates = [
		owners.modelCatalogProviders.get(providerId),
		owners.providers.get(providerId),
		owners.setupProviders.get(providerId)
	].find((entry) => Array.isArray(entry) && entry.length > 0);
	const pluginId = candidates?.length === 1 ? candidates[0] : void 0;
	if (!pluginId) return;
	if (!snapshot?.index) return pluginId;
	const normalizedPluginId = snapshot.normalizePluginId?.(pluginId) ?? pluginId;
	return snapshot.index.plugins.some((plugin) => plugin.pluginId === normalizedPluginId && plugin.enabled) ? normalizedPluginId : void 0;
}
/** Keeps generated catalog providers only when the catalog plugin still owns them. */
function filterGeneratedPluginModelCatalogProviders(params) {
	if (!params.catalogPluginId || !params.pluginMetadataSnapshot || params.parsedCatalog !== void 0 && !isGeneratedPluginModelCatalog(params.parsedCatalog)) return {};
	const plugin = params.pluginMetadataSnapshot.manifestRegistry?.plugins.find((candidate) => candidate.id === params.catalogPluginId);
	const providers = Object.fromEntries(Object.entries(params.providers).filter(([providerId]) => resolvePluginModelCatalogOwnerPluginId({
		providerId,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot
	}) === params.catalogPluginId && isProviderCatalogSourceAllowed({
		provider: providerId,
		config: params.config,
		plugin
	})));
	if (plugin?.activation?.onStartup === false && params.isProviderAvailable && !Object.keys(providers).some(params.isProviderAvailable)) return {};
	return providers;
}
//#endregion
export { loadPersistedPluginModelCatalogsReadOnly as a, replacePersistedPluginModelCatalogs as c, isGeneratedPluginModelCatalog as d, repairPluginModelCatalogTransportMetadata as f, inspectLegacyPluginModelCatalogs as i, resolvePluginModelCatalogOwnerPluginId as l, encodePluginModelCatalogRelativePath as n, migrateLegacyPluginModelCatalogs as o, filterGeneratedPluginModelCatalogProviders as r, repairPersistedPluginModelCatalogs as s, decodePluginModelCatalogRelativePathPluginId as t, PLUGIN_MODEL_CATALOG_GENERATED_BY as u };
