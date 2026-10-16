import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { d as sql, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-Ugk-kDyr.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { D as invalidateSessionEntryMaintenanceAgeFact, M as stageSessionEntryMaintenanceAgeFact, j as recordSessionEntryMaintenanceAgeFact, k as readSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { f as shouldPreserveMaintenanceEntry, i as getSessionMaintenanceActivityAt, m as shouldRunSessionEntryMaintenance } from "./store-maintenance-CGOlSbiV.mjs";
import { n as readSessionEntryCount, r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { s as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { c as planSessionStateDeleteIfUnreferenced, p as readSessionGenerationIdsForKeys, r as collectProjectedReferencedSessionIds } from "./session-accessor.sqlite-lifecycle-state-CQczfYh9.mjs";
import { t as SqliteReclamationInputsChangedError } from "./session-accessor.sqlite-reclamation-worker-diagnostics-hJYsjFvr.mjs";
import { i as planSessionEntryMaintenance, r as resolveSessionMaintenancePreserveKeys } from "./store-maintenance-preserve-snapshot-Bc3JacvP.mjs";
import { isDeepStrictEqual, toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-maintenance-candidates.ts
const maintenanceFields = [
	"sessionId",
	"updatedAt",
	"archivedAt",
	"lastActivityAt",
	"lastInteractionAt",
	"sessionStartedAt",
	"status",
	"pinnedAt",
	"spawnedBy",
	"parentSessionKey",
	"modelSelectionLocked",
	"chatType",
	"delivery"
];
function maintenanceCandidates(database) {
	const projection = sql`CASE WHEN entry_valid = 1 AND json_valid(entry_json)
    THEN (SELECT json_group_object(key, CASE type
      WHEN 'object' THEN json(value) WHEN 'array' THEN json(value)
      WHEN 'true' THEN json('true') WHEN 'false' THEN json('false')
      ELSE value END) FROM json_each(entry_json) WHERE key IN (${sql.join(maintenanceFields)}))
    ELSE entry_json END`.as("entry_json");
	return getSessionKysely(database.db).selectFrom("session_nodes").select([
		projection,
		"current_session_id",
		"session_key",
		"updated_at",
		"archived_at"
	]).modifyEnd(sql`INDEXED BY idx_agent_session_nodes_updated_at`);
}
function collectSqliteSessionMaintenanceBaseKeys(store, activeSessionKeys) {
	const keys = [];
	const seen = /* @__PURE__ */ new Set();
	for (const activeSessionKey of activeSessionKeys) {
		let currentKey = normalizeStoreSessionKey(activeSessionKey);
		while (currentKey && !seen.has(currentKey)) {
			seen.add(currentKey);
			keys.push(currentKey);
			currentKey = normalizeStoreSessionKey(store[currentKey]?.parentSessionKey ?? "");
		}
	}
	return keys;
}
function readSessionMaintenanceKeyProjection(database, sessionKeys) {
	const db = getSessionKysely(database.db);
	const store = {};
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		"parent_session_key",
		"session_key",
		"updated_at"
	]).$if(sessionKeys !== void 0, (query) => query.where("session_key", "in", sqliteStringSet(sessionKeys ?? []))).where("archived_at", "is", null).orderBy("session_key", "asc"))) store[row.session_key] = {
		sessionId: row.current_session_id,
		updatedAt: row.updated_at,
		...row.parent_session_key ? { parentSessionKey: row.parent_session_key } : {}
	};
	return store;
}
function readSessionMaintenanceAgeCandidates(params) {
	if (params.minimumAgeMs == null || params.minimumAgeMs <= 0) return {};
	const db = getSessionKysely(params.database.db);
	const store = {};
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom(maintenanceCandidates(params.database).as("candidates")).selectAll().where("updated_at", "<", Date.now() - params.minimumAgeMs).where("archived_at", "is", null).where((eb) => eb.or([
		...params.pruneAfterMs > 0 ? [eb("updated_at", "<", Date.now() - params.pruneAfterMs)] : [],
		eb("session_key", "like", "%dashboard:%"),
		eb("session_key", "like", "%model-run-%")
	])).orderBy("updated_at", "asc"))) {
		const entry = parseSessionEntryJson(row);
		if (entry) store[row.session_key] = entry;
	}
	return store;
}
function readSessionMaintenanceCapCandidates(params) {
	if (params.overflow <= 0) return {};
	const db = getSessionKysely(params.database.db);
	const excludedKeys = [...params.excludedKeys].filter((key) => toUSVString(key) === key && !key.includes("\0") && !/[\uFFFE\uFFFF]/u.test(key));
	const selected = [];
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom(maintenanceCandidates(params.database).as("candidates")).selectAll().select(sql`CAST(session_key AS BLOB)`.as("key_bytes")).where("archived_at", "is", null).$if(excludedKeys.length > 0, (query) => query.where("session_key", "not in", sqliteStringSet(excludedKeys))).orderBy("updated_at", "asc").orderBy("session_key", "desc"))) {
		const keyBytes = Buffer.from(row.key_bytes);
		const worst = selected.at(-1);
		if (selected.length === params.overflow && worst && (row.updated_at > worst.activityAt || row.updated_at === worst.activityAt && Buffer.compare(keyBytes, worst.keyBytes) <= 0)) break;
		if (params.excludedKeys.has(row.session_key)) continue;
		const entry = parseSessionEntryJson(row);
		if (!entry || shouldPreserveMaintenanceEntry({
			...params,
			key: row.session_key,
			entry
		})) continue;
		const candidate = {
			key: row.session_key,
			keyBytes,
			entry,
			activityAt: getSessionMaintenanceActivityAt(entry)
		};
		let left = 0;
		let right = selected.length;
		while (left < right) {
			const middle = left + right >>> 1;
			const current = selected[middle];
			if ((candidate.activityAt - current.activityAt || Buffer.compare(current.keyBytes, candidate.keyBytes)) < 0) right = middle;
			else left = middle + 1;
		}
		if (left < params.overflow) {
			selected.splice(left, 0, candidate);
			if (selected.length > params.overflow) selected.pop();
		}
	}
	return Object.fromEntries(selected.toSorted((left, right) => Buffer.compare(left.keyBytes, right.keyBytes)).map(({ key, entry }) => [key, entry]));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-store.ts
function readSessionTranscriptJsonlBytesInDatabase(database, sessionIds) {
	const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(["session_id", sql`SUM(${transcriptEventReadBytesSql()} + 1)`.as("jsonl_bytes")]).where("session_id", "in", sessionIds).groupBy("session_id")).rows;
	return new Map(rows.map((row) => [row.session_id, coerceRequiredSqliteNumber(row.jsonl_bytes)]));
}
function refreshSessionPlannerStatisticsInDatabase(database) {
	const row = database.db.prepare("PRAGMA analysis_limit").get();
	const previousLimit = Number(row?.analysis_limit ?? 0);
	try {
		database.db.exec("PRAGMA analysis_limit = 1000; ANALYZE main;");
	} finally {
		database.db.exec(`PRAGMA analysis_limit = ${previousLimit};`);
	}
}
function emptySessionEntryMaintenancePlan() {
	return {
		archivedSessionKeys: [],
		entryRemovals: [],
		stateDeletePlans: [],
		archived: 0,
		capArchived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
}
/** Only a current age fact can avoid planning; pressure and force still require a pass. */
function canSkipSessionEntryMaintenanceInDatabase(database, params, entryCount) {
	if (params.forceMaintenance) return false;
	const ageFact = readSessionEntryMaintenanceAgeFact(database.db, params.maintenance);
	return ageFact !== void 0 && Date.now() < ageFact.next.at && !shouldRunSessionEntryMaintenance({
		entryCount,
		maxEntries: params.maintenance.maxEntries,
		force: params.forceMaintenance
	});
}
/** Inline callers already hold their transaction; workers prepare before the write transaction. */
function applySessionEntryMaintenanceInDatabase(database, params, readPreservation, onArchived) {
	let preservation;
	return prepareSessionEntryMaintenanceInDatabase(database, params, () => preservation ??= readPreservation())(database, onArchived);
}
/** Prepare before the write transaction; compare selected rows and protection dependencies inside it. */
function prepareSessionEntryMaintenanceInDatabase(reader, params, readPreservation) {
	const maintenance = params.maintenance;
	if (maintenance.mode === "warn") return emptySessionEntryMaintenancePlan;
	const entryCount = readSessionEntryCount(reader, { includeArchived: false });
	if (canSkipSessionEntryMaintenanceInDatabase(reader, params, entryCount)) return emptySessionEntryMaintenancePlan;
	invalidateSessionEntryMaintenanceAgeFact(reader.db);
	const plannedAt = Date.now();
	const activeSessionKeys = uniqueStrings([params.activeSessionKey ?? "", ...params.activeSessionKeys ?? []]);
	const removalReasons = /* @__PURE__ */ new Map();
	const archivedKeys = /* @__PURE__ */ new Set();
	let preserveKeys;
	let baseKeys = [];
	const readPreserveKeys = () => {
		if (!preserveKeys) {
			const snapshot = readPreservation();
			const keyProjection = readSessionMaintenanceKeyProjection(reader);
			baseKeys = collectSqliteSessionMaintenanceBaseKeys(keyProjection, activeSessionKeys);
			preserveKeys = resolveSessionMaintenancePreserveKeys({
				snapshot,
				store: keyProjection,
				baseKeys
			});
		}
		return preserveKeys;
	};
	const { store, archived, capArchived, modelRunPruned, pruned, capped } = planSessionEntryMaintenance({
		maintenance,
		initialUnarchivedCount: entryCount,
		forceMaintenance: params.forceMaintenance,
		readPreserveKeys,
		log: false,
		readAgeCandidates: (minimumAgeMs) => readSessionMaintenanceAgeCandidates({
			database: reader,
			minimumAgeMs,
			pruneAfterMs: maintenance.pruneAfterMs
		}),
		readCapCandidates: (remainingEntryCount) => {
			const overflow = Math.max(0, remainingEntryCount - maintenance.maxEntries);
			if (overflow > 0) {
				const capStore = readSessionMaintenanceCapCandidates({
					database: reader,
					overflow,
					preserveKeys: readPreserveKeys(),
					preserveRecentMs: maintenance.preserveRecentMs,
					excludedKeys: /* @__PURE__ */ new Set([...removalReasons.keys(), ...archivedKeys])
				});
				return {
					store: capStore,
					maxEntries: Object.keys(capStore).length - overflow
				};
			}
		},
		onRemoved: ({ key }, reason) => removalReasons.set(key, reason),
		onArchived: ({ key }) => archivedKeys.add(key)
	});
	const ageFact = recordSessionEntryMaintenanceAgeFact(reader, maintenance, plannedAt);
	const selectedKeys = uniqueStrings([...archivedKeys, ...removalReasons.keys()]);
	const readInputs = (database) => {
		const db = getSessionKysely(database.db);
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "in", sqliteStringSet(selectedKeys)).orderBy("session_key")).rows;
		return {
			rows,
			transcripts: uniqueStrings(rows.map((row) => row.current_session_id)).map((sessionId) => readTranscriptContextVersionInTransaction(database, sessionId)),
			parents: executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "parent_session_key"]).where("archived_at", "is", null).where("session_key", "in", sqliteStringSet(baseKeys)).orderBy("session_key")).rows
		};
	};
	const expected = selectedKeys.length > 0 ? readInputs(reader) : void 0;
	return (database, onArchived) => {
		if (expected && (!isDeepStrictEqual(expected, readInputs(database)) || capArchived + capped > 0 && readSessionEntryCount(database, { includeArchived: false }) < entryCount)) throw new SqliteReclamationInputsChangedError("SQLite maintenance candidate rows changed before commit");
		const selectedEntries = readSessionEntryStore(database, { sessionKeys: selectedKeys });
		if (selectedKeys.length > 0) {
			const currentBaseKeys = new Set(baseKeys);
			let pending = uniqueStrings([params.activeSessionKey ?? "", ...params.activeSessionKeys ?? []]);
			while (pending.length > 0) {
				pending = pending.map(normalizeStoreSessionKey).filter((key) => key && !currentBaseKeys.has(key));
				if (pending.length === 0) break;
				pending.forEach((key) => currentBaseKeys.add(key));
				pending = Object.values(readSessionMaintenanceKeyProjection(database, pending)).flatMap((entry) => entry.parentSessionKey ? [entry.parentSessionKey] : []);
			}
			const currentPreserveKeys = resolveSessionMaintenancePreserveKeys({
				snapshot: readPreservation(),
				store: selectedEntries,
				baseKeys: currentBaseKeys
			});
			if (selectedKeys.some((key) => currentPreserveKeys.has(normalizeStoreSessionKey(key)))) throw new SqliteReclamationInputsChangedError("SQLite maintenance candidates became protected before commit");
		}
		const archivedSessionKeys = [];
		const archivedWorktrees = [];
		for (const key of archivedKeys) {
			const previousEntry = selectedEntries[key];
			const planned = store[key];
			if (!previousEntry || !planned?.archivedAt) continue;
			const entry = {
				...previousEntry,
				archivedAt: planned.archivedAt,
				archiveReason: planned.archiveReason
			};
			delete entry.archivedBy;
			writeSessionEntry(database, key, entry, { canonicalPreviousEntry: previousEntry });
			onArchived?.(key, previousEntry, entry);
			archivedSessionKeys.push(key);
			if (entry.worktree) archivedWorktrees.push({
				entry: structuredClone(entry),
				sessionKey: key,
				storePath: params.storePath
			});
		}
		const removals = [...removalReasons].flatMap(([sessionKey, maintenanceReason]) => {
			const expectedEntry = selectedEntries[sessionKey];
			return expectedEntry ? [{
				expectedEntry,
				maintenanceReason,
				sessionKey
			}] : [];
		});
		stageSessionEntryMaintenanceAgeFact(database.db, ageFact);
		if (removals.length === 0) return {
			archivedSessionKeys,
			...archivedWorktrees.length ? { archivedWorktrees } : {},
			entryRemovals: [],
			stateDeletePlans: [],
			archived,
			capArchived,
			modelRunPruned: 0,
			pruned: 0,
			capped: capArchived
		};
		const removedSessionIds = /* @__PURE__ */ new Set();
		for (const removal of removals) for (const sessionId of collectSessionStateIdsForEntry(removal.expectedEntry)) removedSessionIds.add(sessionId);
		for (const sessionId of readSessionGenerationIdsForKeys(database, removals.map((removal) => removal.sessionKey))) removedSessionIds.add(sessionId);
		const referencedSessionIds = collectProjectedReferencedSessionIds({
			database,
			excludedSessionKeys: removals.map((removal) => removal.sessionKey),
			projectedStore: {},
			candidateSessionIds: [...removedSessionIds]
		});
		const deletePlans = [];
		for (const sessionId of removedSessionIds) {
			const plan = planSessionStateDeleteIfUnreferenced({
				archiveTranscript: true,
				archiveDirectory: params.archiveDirectory,
				database,
				referencedSessionIds,
				sessionId
			});
			if (plan) deletePlans.push(plan);
		}
		return {
			archivedSessionKeys,
			...archivedWorktrees.length ? { archivedWorktrees } : {},
			entryRemovals: removals,
			stateDeletePlans: deletePlans,
			archived,
			capArchived,
			modelRunPruned,
			pruned,
			capped
		};
	};
}
//#endregion
export { refreshSessionPlannerStatisticsInDatabase as a, readSessionTranscriptJsonlBytesInDatabase as i, emptySessionEntryMaintenancePlan as n, prepareSessionEntryMaintenanceInDatabase as r, applySessionEntryMaintenanceInDatabase as t };
