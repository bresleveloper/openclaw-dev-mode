import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { l as MEMORY_INDEX_META_TABLE } from "./memory-schema-DY2eOY6N.mjs";
import "./sqlite-worker-runtime-Da3qtgYL.mjs";
import "./memory-core-host-engine-schema-9m2yhquC.mjs";
//#region extensions/memory-core/src/memory/manager-vector-rebuild-state.ts
const VECTOR_REBUILD_META_KEY = "memory_vector_rebuild_v1";
function markMemoryVectorIndexClean(db) {
	db.prepare(`INSERT INTO ${MEMORY_INDEX_META_TABLE} (key, value) VALUES (?, 'clean')
     ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(VECTOR_REBUILD_META_KEY);
}
function markMemoryVectorRebuildRequired(db) {
	db.prepare(`INSERT INTO ${MEMORY_INDEX_META_TABLE} (key, value) VALUES (?, '1')
     ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(VECTOR_REBUILD_META_KEY);
}
function resolvePersistedMemoryVectorIndexState(params) {
	return resolveMemoryVectorIndexState({
		marker: params.db.prepare(`SELECT value FROM ${MEMORY_INDEX_META_TABLE} WHERE key = ?`).get(VECTOR_REBUILD_META_KEY)?.value,
		hasVectorTable: tableExists(params.db, params.vectorTable),
		metaVectorDims: params.metaVectorDims,
		hasSemanticChunks: params.hasSemanticChunks
	});
}
function resolveMemoryVectorIndexState(params) {
	if (params.marker === "1") return { state: "incomplete" };
	if (!params.hasVectorTable) return params.metaVectorDims && params.hasSemanticChunks ? { state: "incomplete" } : { state: "empty" };
	if (params.marker === "clean") return params.hasSemanticChunks ? { state: "complete" } : { state: "empty" };
	if (params.hasSemanticChunks && !params.metaVectorDims) return { state: "incomplete" };
	return { state: "unverified" };
}
//#endregion
export { resolvePersistedMemoryVectorIndexState as a, resolveMemoryVectorIndexState as i, markMemoryVectorIndexClean as n, markMemoryVectorRebuildRequired as r, VECTOR_REBUILD_META_KEY as t };
