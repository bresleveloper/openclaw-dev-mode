import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { f as shouldRunSessionEntryMaintenance, u as shouldPreserveMaintenanceEntry } from "./store-maintenance-BqMt1Twc.mjs";
import { t as getSessionMaintenanceActivityAt } from "./store-maintenance-activity-ayV6kicm.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { a as resolveSessionMaintenancePreserveKeys, c as collectSessionStateIdsForEntry, o as planSessionEntryMaintenance } from "./transcript-event-media-C4aKs47S.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as readSessionEntryCount } from "./session-accessor.sqlite-entry-inventory-Cl0fNMK8.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { i as prepareExactSessionEntryRowReads } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { c as invalidateSessionEntryMaintenanceAgeFact, d as readSessionEntryMaintenanceAgeFact, m as stageSessionEntryMaintenanceAgeFact, p as recordSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { t as planSessionStateDeleteIfUnreferenced } from "./session-accessor.sqlite-delete-snapshot-C7Nn_aNm.mjs";
import { a as writeSessionEntry, p as captureSessionEntrySnapshot } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { c as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { i as collectProjectedReferencedSessionIds, m as readSessionGenerationIdsForKeys } from "./session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
import { t as SqliteReclamationInputsChangedError } from "./session-accessor.sqlite-reclamation-worker-diagnostics-DR5Udg-Z.mjs";
import { isDeepStrictEqual, toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-maintenance-candidates.ts
const maintenanceFields = [
	"sessionId",
	"updatedAt",
	"archivedAt",
	"lastActivityAt",
	"lastInteractionAt",
	"sessionStartedAt",
	"pinnedAt",
	"sidebarRoot",
	"spawnedBy",
	"parentSessionKey",
	"modelSelectionLocked",
	"mainRestartRecovery",
	"restartRecoveryRuns",
	"restartRecoveryTerminalRunIds",
	"restartRecoveryDeliveryRunId",
	"pendingFinalDelivery",
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
	if (params.overflow <= 0) return {
		store: {},
		durableNoCandidates: false
	};
	const db = getSessionKysely(params.database.db);
	const activeKeys = new Set(params.activeSessionKeys.map(normalizeStoreSessionKey).filter(Boolean));
	const excludedKeys = [...params.excludedKeys].filter((key) => toUSVString(key) === key && !key.includes("\0") && !/[\uFFFE\uFFFF]/u.test(key));
	const selected = [];
	let durableNoCandidates = true;
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom(maintenanceCandidates(params.database).as("candidates")).selectAll().select(sql`CAST(session_key AS BLOB)`.as("key_bytes")).where("archived_at", "is", null).$if(excludedKeys.length > 0, (query) => query.where("session_key", "not in", sqliteStringSet(excludedKeys))).orderBy("updated_at", "asc").orderBy("session_key", "desc"))) {
		const worst = selected.at(-1);
		if (selected.length === params.overflow && worst && (row.updated_at > worst.activityAt || row.updated_at === worst.activityAt && Buffer.compare(row.key_bytes, worst.keyBytes) <= 0)) break;
		if (params.excludedKeys.has(row.session_key)) continue;
		const entry = parseSessionEntryJson(row);
		if (!entry) {
			durableNoCandidates = false;
			continue;
		}
		if (shouldPreserveMaintenanceEntry({
			key: row.session_key,
			entry,
			preserveRecentMs: null
		})) continue;
		durableNoCandidates = false;
		if (activeKeys.has(row.session_key) || shouldPreserveMaintenanceEntry({
			key: row.session_key,
			entry,
			preserveKeys: params.readPreserveKeys(),
			preserveRecentMs: params.preserveRecentMs
		})) continue;
		const candidate = {
			key: row.session_key,
			keyBytes: row.key_bytes,
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
	return {
		store: Object.fromEntries(selected.toSorted((left, right) => Buffer.compare(left.keyBytes, right.keyBytes)).map(({ key, entry }) => [key, entry])),
		durableNoCandidates
	};
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
		archivedEntries: [],
		entryRemovals: [],
		stateDeletePlans: [],
		archived: 0,
		capArchived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
}
/** Inline callers already hold their transaction; workers prepare before the write transaction. */
function applySessionEntryMaintenanceInDatabase(database, params, readPreservation, onArchived, refreshCandidates, postimages) {
	let preservation;
	const prepared = prepareSessionEntryMaintenanceInDatabase(database, params, () => preservation ??= readPreservation(), refreshCandidates);
	return (prepared.kind === "no-op" ? prepared.apply : prepared.captureMutation())(database, onArchived, postimages);
}
/** Prepare before the write transaction; compare selected rows and protection dependencies inside it. */
function prepareSessionEntryMaintenanceInDatabase(reader, params, readPreservation, refreshCandidates) {
	const maintenance = params.maintenance;
	if (maintenance.mode === "warn") return {
		kind: "no-op",
		value: emptySessionEntryMaintenancePlan(),
		apply: emptySessionEntryMaintenancePlan
	};
	const entryCount = readSessionEntryCount(reader, { includeArchived: false });
	const retainedAgeFact = readSessionEntryMaintenanceAgeFact(reader.db, maintenance);
	if (!params.forceMaintenance && retainedAgeFact && Date.now() < retainedAgeFact.next.at && !shouldRunSessionEntryMaintenance({
		entryCount,
		maxEntries: maintenance.maxEntries
	})) return {
		kind: "no-op",
		value: emptySessionEntryMaintenancePlan(),
		apply(database) {
			stageSessionEntryMaintenanceAgeFact(database.db, {
				...retainedAgeFact,
				entryCount
			});
			return emptySessionEntryMaintenancePlan();
		}
	};
	invalidateSessionEntryMaintenanceAgeFact(reader.db);
	const plannedAt = Date.now();
	const activeSessionKeys = uniqueStrings([params.activeSessionKey ?? "", ...params.activeSessionKeys ?? []]);
	const removalReasons = /* @__PURE__ */ new Map();
	const archivedKeys = /* @__PURE__ */ new Set();
	let durableNoCandidates = false;
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
				const candidates = readSessionMaintenanceCapCandidates({
					database: reader,
					activeSessionKeys,
					overflow,
					readPreserveKeys,
					preserveRecentMs: maintenance.preserveRecentMs,
					excludedKeys: /* @__PURE__ */ new Set([...removalReasons.keys(), ...archivedKeys])
				});
				durableNoCandidates = candidates.durableNoCandidates;
				const capStore = candidates.store;
				return {
					store: capStore,
					maxEntries: Object.keys(capStore).length - overflow
				};
			}
		},
		onRemoved: ({ key }, reason) => removalReasons.set(key, reason),
		onArchived: ({ key }) => archivedKeys.add(key)
	});
	const ageFact = recordSessionEntryMaintenanceAgeFact(reader, maintenance, plannedAt, entryCount);
	const selectedKeys = uniqueStrings([...archivedKeys, ...removalReasons.keys()]);
	if (selectedKeys.length === 0) {
		const value = emptySessionEntryMaintenancePlan();
		if (durableNoCandidates) value.durableNoCandidates = true;
		return {
			kind: "no-op",
			value,
			apply(database) {
				stageSessionEntryMaintenanceAgeFact(database.db, ageFact);
				return value;
			}
		};
	}
	invalidateSessionEntryMaintenanceAgeFact(reader.db);
	const readInputs = (database) => {
		const db = getSessionKysely(database.db);
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "in", sqliteStringSet(selectedKeys)).orderBy("session_key")).rows;
		return {
			rows,
			transcripts: uniqueStrings(rows.map((row) => row.current_session_id)).map((sessionId) => readTranscriptContextVersionInTransaction(database, sessionId)),
			parents: executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "parent_session_key"]).where("archived_at", "is", null).where("session_key", "in", sqliteStringSet(baseKeys)).orderBy("session_key")).rows
		};
	};
	const apply = (expected, database, onArchived, postimages) => {
		if (!isDeepStrictEqual(expected, readInputs(database)) || capArchived + capped > 0 && readSessionEntryCount(database, { includeArchived: false }) < entryCount) throw new SqliteReclamationInputsChangedError("SQLite maintenance candidate rows changed before commit");
		const readSelected = prepareExactSessionEntryRowReads(database, selectedKeys, "full", "canonical", postimages ? {
			includeWindowFacts: true,
			includeBoardPresence: true,
			includeMembership: true
		} : { projectParticipants: false });
		const selectedEntries = {};
		const selectedRows = /* @__PURE__ */ new Map();
		for (const key of selectedKeys) {
			const selected = readSelected(key);
			if (selected) {
				selectedEntries[key] = selected.entry;
				selectedRows.set(key, selected);
			}
		}
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
				snapshot: refreshCandidates ? refreshCandidates(selectedKeys) : readPreservation(),
				store: selectedEntries,
				baseKeys: currentBaseKeys
			});
			if (selectedKeys.some((key) => currentPreserveKeys.has(normalizeStoreSessionKey(key)))) throw new SqliteReclamationInputsChangedError("SQLite maintenance candidates became protected before commit");
		}
		const archivedEntries = [];
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
			const selected = selectedRows.get(key);
			const previousFacts = selected && captureSessionEntrySnapshot(selected);
			const written = writeSessionEntry(database, key, entry, {
				canonicalPreviousEntry: previousEntry,
				canonicalPreviousRow: selected?.row,
				canonicalPreviousWindow: previousFacts?.window,
				canonicalPreviousSideTables: previousFacts?.sideTables,
				postimages
			});
			onArchived?.(key, previousEntry, written);
			archivedEntries.push({
				sessionKey: key,
				sessionId: entry.sessionId
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
			archivedEntries,
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
			archivedEntries,
			entryRemovals: removals,
			stateDeletePlans: deletePlans,
			archived,
			capArchived,
			modelRunPruned,
			pruned,
			capped
		};
	};
	return {
		kind: "write",
		captureMutation() {
			const expected = readInputs(reader);
			return (database, onArchived, postimages) => apply(expected, database, onArchived, postimages);
		}
	};
}
//#endregion
export { refreshSessionPlannerStatisticsInDatabase as a, readSessionTranscriptJsonlBytesInDatabase as i, emptySessionEntryMaintenancePlan as n, prepareSessionEntryMaintenanceInDatabase as r, applySessionEntryMaintenanceInDatabase as t };
