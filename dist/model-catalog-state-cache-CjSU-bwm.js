import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, i as openOpenClawStateDatabase, o as runOpenClawStateWriteTransaction } from "./openclaw-state-db-gblCDNfo.js";
import { createHash } from "node:crypto";
//#region src/agents/model-catalog-state-cache.ts
const AGENT_MODEL_CATALOG_CACHE_VERSION = 1;
const AGENT_MODEL_CATALOG_CACHE_TTL_MS = 1800 * 1e3;
function stableJson(value) {
	if (Array.isArray(value)) return `[${value.map((entry) => stableJson(entry)).join(",")}]`;
	if (value && typeof value === "object") {
		const record = value;
		return `{${Object.keys(record).toSorted().filter((key) => record[key] !== void 0 && typeof record[key] !== "function").map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
	}
	return JSON.stringify(value);
}
function metadataSnapshotCacheShape(snapshot) {
	if (!snapshot) return;
	return {
		configFingerprint: snapshot.configFingerprint,
		policyHash: snapshot.policyHash,
		indexPolicyHash: snapshot.index?.policyHash,
		indexPlugins: snapshot.index?.plugins?.map((plugin) => ({
			enabled: plugin.enabled,
			id: plugin.pluginId,
			origin: plugin.origin
		})),
		modelCatalogPlugins: snapshot.plugins.map((plugin) => ({
			id: plugin.id,
			modelCatalog: plugin.modelCatalog,
			origin: plugin.origin,
			version: plugin.version
		}))
	};
}
function buildAgentModelCatalogCacheKey(input) {
	const payload = stableJson({
		version: AGENT_MODEL_CATALOG_CACHE_VERSION,
		agentDir: input.agentDir,
		cacheScope: input.cacheScope,
		workspaceDir: input.workspaceDir,
		config: input.config,
		metadataSnapshot: metadataSnapshotCacheShape(input.metadataSnapshot)
	});
	return `agent-model-catalog:v${AGENT_MODEL_CATALOG_CACHE_VERSION}:${createHash("sha256").update(payload).digest("hex")}`;
}
function parseCachedAgentModelCatalog(rawJson) {
	const parsed = JSON.parse(rawJson);
	if (parsed?.version !== AGENT_MODEL_CATALOG_CACHE_VERSION || !Array.isArray(parsed.entries)) return;
	return parsed.entries;
}
function readCachedAgentModelCatalog(params) {
	try {
		const database = openOpenClawStateDatabase();
		const db = getNodeSqliteKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_model_catalogs").select(["raw_json", "updated_at"]).where("catalog_key", "=", params.catalogKey).where("agent_dir", "=", params.agentDir));
		if (!row || (params.nowMs ?? Date.now()) - row.updated_at > AGENT_MODEL_CATALOG_CACHE_TTL_MS) return;
		return parseCachedAgentModelCatalog(row.raw_json);
	} catch {
		return;
	}
}
function writeCachedAgentModelCatalog(params) {
	if (params.entries.length === 0) return;
	try {
		const updatedAt = params.nowMs ?? Date.now();
		const rawJson = JSON.stringify({
			version: AGENT_MODEL_CATALOG_CACHE_VERSION,
			entries: params.entries
		});
		runOpenClawStateWriteTransaction((database) => {
			const db = getNodeSqliteKysely(database.db);
			executeSqliteQuerySync(database.db, db.deleteFrom("agent_model_catalogs").where("updated_at", "<", updatedAt - AGENT_MODEL_CATALOG_CACHE_TTL_MS));
			executeSqliteQuerySync(database.db, db.insertInto("agent_model_catalogs").values({
				catalog_key: params.catalogKey,
				agent_dir: params.agentDir,
				raw_json: rawJson,
				updated_at: updatedAt
			}).onConflict((conflict) => conflict.column("catalog_key").doUpdateSet({
				agent_dir: params.agentDir,
				raw_json: rawJson,
				updated_at: updatedAt
			})));
		});
	} catch {}
}
//#endregion
export { readCachedAgentModelCatalog as n, writeCachedAgentModelCatalog as r, buildAgentModelCatalogCacheKey as t };
