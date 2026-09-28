import { t as installProcessWarningFilter } from "./warning-filter-BGYPTRmo.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as configureSqliteWalMaintenance, t as configureSqliteConnectionPragmas } from "./sqlite-wal-BzoPsBh0.mjs";
import { t as formatErrorMessage } from "./error-utils-6idLpSHC.mjs";
import "./memory-schema-CkxujvZk.mjs";
import "./sqlite-vec-BskpG3v_.mjs";
import "./internal-CDL7w83q.mjs";
import "./fs-utils-BVDi6fm8.mjs";
import "./read-retry-B-bw--uT.mjs";
import "./curated-annotations-DM9mz8Th.mjs";
import "./read-file-BDVpCgFA.mjs";
import { createRequire } from "node:module";
//#region packages/memory-host-sdk/src/host/memory-recall-metadata.ts
const MEMORY_ORIGIN_CLASSES = /* @__PURE__ */ new Set([
	"owner",
	"agent",
	"untrusted",
	"system"
]);
const MEMORY_SESSION_KINDS = /* @__PURE__ */ new Set([
	"interactive",
	"cron",
	"heartbeat",
	"subagent",
	"unknown"
]);
function decodeChunkProvenance(row) {
	if (typeof row.origin_class !== "string" || !MEMORY_ORIGIN_CLASSES.has(row.origin_class) || typeof row.session_kind !== "string" || !MEMORY_SESSION_KINDS.has(row.session_kind) || typeof row.observed_at !== "number") return;
	return {
		originClass: row.origin_class,
		sessionKind: row.session_kind,
		observedAt: row.observed_at,
		...typeof row.supersedes_key === "string" && row.supersedes_key.trim() ? { supersedesKey: row.supersedes_key } : {}
	};
}
function readMemoryRecallMetadata(db, ids) {
	if (ids.length === 0) return /* @__PURE__ */ new Map();
	const query = getNodeSqliteKysely(db).selectFrom("memory_index_chunks as chunk").leftJoin("memory_index_chunk_recall_metadata as metadata", "metadata.chunk_id", "chunk.id").leftJoin("memory_index_chunk_provenance as provenance", "provenance.chunk_id", "chunk.id").select([
		"chunk.id as id",
		"metadata.importance as importance",
		"metadata.triggers as triggers",
		"metadata.project_key as project_key",
		"provenance.origin_class as origin_class",
		"provenance.session_kind as session_kind",
		"provenance.observed_at as observed_at",
		"provenance.supersedes_key as supersedes_key"
	]).where("chunk.id", "in", [...ids]);
	return new Map(executeSqliteQuerySync(db, query).rows.map((row) => {
		const provenance = decodeChunkProvenance(row);
		return [row.id, {
			id: row.id,
			importance: row.importance,
			triggers: row.triggers,
			project_key: row.project_key,
			...provenance ? { provenance } : {}
		}];
	}));
}
function readCuratedMemoryTriggerCandidates(db, limit, activeProjectKeys) {
	return readCuratedMemoryCandidates({
		db,
		limit,
		activeProjectKeys,
		requireProject: false,
		requireTriggers: true
	});
}
function readCuratedProjectMemoryCandidates(db, limit, activeProjectKeys) {
	if (activeProjectKeys.length === 0) return [];
	return readCuratedMemoryCandidates({
		db,
		limit,
		activeProjectKeys,
		requireProject: true,
		requireTriggers: false
	});
}
function readCuratedMemoryCandidates(params) {
	const { db, limit } = params;
	const active = params.activeProjectKeys ? new Set(params.activeProjectKeys.map((key) => key.trim()).filter(Boolean)) : void 0;
	const projectKeyPrefilter = active && active.size <= 64 ? [...active] : void 0;
	const results = [];
	let cursor;
	const batchSize = Math.max(64, limit);
	while (results.length < limit) {
		const rows = readCuratedCandidateBatch({
			db,
			limit: batchSize,
			cursor,
			requireProject: params.requireProject,
			requireTriggers: params.requireTriggers,
			projectKeyPrefilter
		});
		if (rows.length === 0) break;
		for (const row of rows) {
			const storedKeys = row.project_key?.split(";").map((key) => key.trim()).filter(Boolean);
			if (storedKeys?.includes("!invalid-project-annotation")) continue;
			if (active === void 0 && !params.requireProject || row.project_key === null && !params.requireProject || storedKeys && storedKeys.length > 0 && storedKeys.every((key) => active?.has(key) === true)) {
				results.push(row);
				if (results.length === limit) break;
			}
		}
		const last = rows.at(-1);
		if (!last || rows.length < batchSize) break;
		cursor = {
			importance: last.importance,
			path: last.path,
			id: last.id
		};
	}
	return results;
}
function readCuratedCandidateBatch(params) {
	let query = getNodeSqliteKysely(params.db).selectFrom("memory_index_chunks as chunk").leftJoin("memory_index_chunk_recall_metadata as metadata", "metadata.chunk_id", "chunk.id").innerJoin("memory_index_chunk_provenance as provenance", "provenance.chunk_id", "chunk.id").select([
		"chunk.id as id",
		"chunk.path as path",
		"chunk.source as source",
		"chunk.start_line as start_line",
		"chunk.end_line as end_line",
		"chunk.text as text",
		"metadata.importance as importance",
		"metadata.triggers as triggers",
		"metadata.project_key as project_key",
		"provenance.origin_class as origin_class",
		"provenance.session_kind as session_kind",
		"provenance.observed_at as observed_at",
		"provenance.supersedes_key as supersedes_key"
	]).where("chunk.source", "=", "memory").where("chunk.path", "in", ["MEMORY.md", "USER.md"]).where("provenance.origin_class", "in", ["owner", "agent"]);
	if (params.requireProject) query = query.where("metadata.project_key", "is not", null);
	if (params.requireTriggers) query = query.where("metadata.triggers", "is not", null);
	const projectKeyPrefilter = params.projectKeyPrefilter;
	if (projectKeyPrefilter && (params.cursor || projectKeyPrefilter.length === 0)) query = query.where((eb) => eb.or([eb("metadata.project_key", "is", null), ...projectKeyPrefilter.map((key) => eb(eb.fn("instr", [eb.ref("metadata.project_key"), eb.val(key)]), ">", 0))]));
	if (params.cursor) {
		const cursor = params.cursor;
		query = query.where((eb) => {
			const importance = eb.fn.coalesce("metadata.importance", eb.val(0));
			const cursorImportance = cursor.importance ?? 0;
			return eb.or([eb(importance, "<", cursorImportance), eb.and([eb(importance, "=", cursorImportance), eb.or([eb("chunk.path", ">", cursor.path), eb.and([eb("chunk.path", "=", cursor.path), eb("chunk.id", ">", cursor.id)])])])]);
		});
	}
	query = query.orderBy((eb) => eb.fn.coalesce("metadata.importance", eb.val(0)), "desc").orderBy("chunk.path").orderBy("chunk.id").limit(params.limit);
	return executeSqliteQuerySync(params.db, query).rows;
}
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite.ts
const require = createRequire(import.meta.url);
const sqliteWalMaintenanceByDb = /* @__PURE__ */ new WeakMap();
function requireMemoryHostNodeSqlite() {
	installProcessWarningFilter();
	try {
		return require("node:sqlite");
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable in this Node runtime (missing node:sqlite). ${message}`, { cause: err });
	}
}
function configureMemorySqliteWalMaintenance(db, options) {
	const existing = sqliteWalMaintenanceByDb.get(db);
	if (existing) return existing;
	const maintenance = options?.busyTimeoutMs === void 0 ? configureSqliteWalMaintenance(db, options) : configureSqliteConnectionPragmas(db, options);
	sqliteWalMaintenanceByDb.set(db, maintenance);
	return maintenance;
}
function closeMemorySqliteWalMaintenance(db) {
	const maintenance = sqliteWalMaintenanceByDb.get(db);
	if (!maintenance) return true;
	sqliteWalMaintenanceByDb.delete(db);
	return maintenance.close();
}
//#endregion
export { readCuratedProjectMemoryCandidates as a, readCuratedMemoryTriggerCandidates as i, configureMemorySqliteWalMaintenance as n, readMemoryRecallMetadata as o, requireMemoryHostNodeSqlite as r, closeMemorySqliteWalMaintenance as t };
