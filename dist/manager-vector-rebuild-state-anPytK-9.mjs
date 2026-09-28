import { c as MEMORY_INDEX_META_TABLE } from "./memory-schema-CkxujvZk.mjs";
import "./memory-core-host-engine-schema-emU_afev.mjs";
//#region extensions/memory-core/src/memory/manager-vector-rebuild-state.ts
const VECTOR_REBUILD_META_KEY = "memory_vector_rebuild_v1";
function memoryTableExists(db, tableName) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName));
}
function markMemoryVectorIndexClean(db) {
	db.prepare(`INSERT INTO ${MEMORY_INDEX_META_TABLE} (key, value) VALUES (?, 'clean')
     ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(VECTOR_REBUILD_META_KEY);
}
function markMemoryVectorRebuildRequired(db) {
	db.prepare(`INSERT INTO ${MEMORY_INDEX_META_TABLE} (key, value) VALUES (?, '1')
     ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(VECTOR_REBUILD_META_KEY);
}
function requiresMemoryVectorRebuild(params) {
	const state = resolvePersistedMemoryVectorIndexState(params).state;
	return state === "incomplete" || state === "unverified";
}
function resolvePersistedMemoryVectorIndexState(params) {
	const row = params.db.prepare(`SELECT value FROM ${MEMORY_INDEX_META_TABLE} WHERE key = ?`).get(VECTOR_REBUILD_META_KEY);
	if (row?.value === "1") return { state: "incomplete" };
	if (!memoryTableExists(params.db, params.vectorTable)) return params.metaVectorDims && params.hasSemanticChunks ? { state: "incomplete" } : { state: "empty" };
	if (row?.value === "clean") return params.hasSemanticChunks ? { state: "complete" } : { state: "empty" };
	if (params.hasSemanticChunks && !params.metaVectorDims) return { state: "incomplete" };
	return { state: "unverified" };
}
//#endregion
export { resolvePersistedMemoryVectorIndexState as a, requiresMemoryVectorRebuild as i, markMemoryVectorRebuildRequired as n, memoryTableExists as r, markMemoryVectorIndexClean as t };
