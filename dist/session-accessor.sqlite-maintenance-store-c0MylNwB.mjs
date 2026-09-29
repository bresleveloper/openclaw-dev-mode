import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { a as iterateSqliteQuerySync, l as sqliteStringSet, n as executeSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely, n as cloneSessionEntry } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { r as parseSessionEntryJson, s as sessionEntryMetadataJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { n as readSessionEntryCount, r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-BGtMQ0LB.mjs";
import { U as recordSessionEntryMaintenanceAgeFact, V as readSessionEntryMaintenanceAgeFact, f as writeSessionEntry, z as invalidateSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { h as shouldRunSessionEntryMaintenance } from "./store-maintenance-C5xEVYop.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-BKdpL7km.mjs";
import { d as readSessionGenerationIdsForKeys, n as collectProjectedReferencedSessionIds, s as planSessionStateDeleteIfUnreferenced } from "./session-accessor.sqlite-lifecycle-state-DdmXgBkg.mjs";
import { n as resolveSessionMaintenancePreserveKeys, r as planSessionEntryMaintenance } from "./store-maintenance-preserve-snapshot-BwwMxezL.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-maintenance-candidates.ts
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
function readSessionMaintenanceKeyProjection(database) {
	const db = getSessionKysely(database.db);
	const store = {};
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		"parent_session_key",
		"session_key",
		"updated_at"
	]).where("archived_at", "is", null).orderBy("session_key", "asc"))) store[row.session_key] = {
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
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select([
		sessionEntryMetadataJson,
		"current_session_id",
		"session_key",
		"updated_at"
	]).where("updated_at", "<", Date.now() - params.minimumAgeMs).where("archived_at", "is", null).orderBy("updated_at", "asc"))) {
		const entry = parseSessionEntryJson(row);
		if (entry) store[row.session_key] = entry;
	}
	return store;
}
function readSessionMaintenanceCapCandidates(params) {
	const db = getSessionKysely(params.database.db);
	const excludedKeys = [...params.excludedKeys].filter((key) => toUSVString(key) === key && !key.includes("\0") && !/[\uFFFE\uFFFF]/u.test(key));
	const store = {};
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select([
		sessionEntryMetadataJson,
		"current_session_id",
		"session_key",
		"updated_at"
	]).where("archived_at", "is", null).$if(excludedKeys.length > 0, (query) => query.where("session_key", "not in", sqliteStringSet(excludedKeys))).orderBy("session_key", "asc"))) {
		if (params.excludedKeys.has(row.session_key)) continue;
		const entry = parseSessionEntryJson(row);
		if (!entry) continue;
		store[row.session_key] = entry;
	}
	return store;
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
	if (params.maintenance.mode === "warn") return true;
	if (params.forceMaintenance) return false;
	const ageFact = readSessionEntryMaintenanceAgeFact(database.db, params.maintenance);
	return ageFact !== void 0 && Date.now() < ageFact.next.at && !shouldRunSessionEntryMaintenance({
		entryCount: entryCount ?? readSessionEntryCount(database, { includeArchived: false }),
		maxEntries: params.maintenance.maxEntries,
		force: params.forceMaintenance
	});
}
/** Planning and archive metadata writes share the caller's admitted transaction. */
function applySessionEntryMaintenanceInDatabase(database, params, readPreservation) {
	const maintenance = params.maintenance;
	if (maintenance.mode === "warn") return emptySessionEntryMaintenancePlan();
	const entryCount = readSessionEntryCount(database, { includeArchived: false });
	if (canSkipSessionEntryMaintenanceInDatabase(database, params, entryCount)) return emptySessionEntryMaintenancePlan();
	invalidateSessionEntryMaintenanceAgeFact(database.db);
	const plannedAt = Date.now();
	const activeSessionKeys = uniqueStrings([params.activeSessionKey ?? "", ...params.activeSessionKeys ?? []]);
	const removalReasons = /* @__PURE__ */ new Map();
	const archivedKeys = /* @__PURE__ */ new Set();
	const { store, archived, capArchived, modelRunPruned, pruned, capped } = planSessionEntryMaintenance({
		profile: "write",
		maintenance,
		initialUnarchivedCount: entryCount,
		forceMaintenance: params.forceMaintenance,
		readPreserveKeys: () => {
			const snapshot = readPreservation();
			const keyProjection = readSessionMaintenanceKeyProjection(database);
			return resolveSessionMaintenancePreserveKeys({
				snapshot,
				store: keyProjection,
				baseKeys: collectSqliteSessionMaintenanceBaseKeys(keyProjection, activeSessionKeys)
			});
		},
		log: false,
		readAgeCandidates: (minimumAgeMs) => readSessionMaintenanceAgeCandidates({
			database,
			minimumAgeMs
		}),
		readCapCandidates: (remainingEntryCount) => {
			const overflow = Math.max(0, remainingEntryCount - maintenance.maxEntries);
			if (overflow > 0) {
				const capStore = readSessionMaintenanceCapCandidates({
					database,
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
	const selectedKeys = uniqueStrings([...archivedKeys, ...removalReasons.keys()]);
	const selectedEntries = readSessionEntryStore(database, { sessionKeys: selectedKeys });
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
		archivedSessionKeys.push(key);
		if (entry.worktree) archivedWorktrees.push({
			entry: cloneSessionEntry(entry),
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
	recordSessionEntryMaintenanceAgeFact(database, maintenance, plannedAt);
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
		projectedStore: {}
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
}
//#endregion
export { refreshSessionPlannerStatisticsInDatabase as a, readSessionTranscriptJsonlBytesInDatabase as i, canSkipSessionEntryMaintenanceInDatabase as n, emptySessionEntryMaintenancePlan as r, applySessionEntryMaintenanceInDatabase as t };
