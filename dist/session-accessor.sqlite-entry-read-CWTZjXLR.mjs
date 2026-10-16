import { a as getNodeSqliteKysely, d as sql, i as executeSqliteQueryTakeFirstSync, l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { o as runSqliteReadOperationSync } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as parseSqliteSessionEntryRecord } from "./session-entry-json-CtwFM7Hi.mjs";
import { n as sessionEntrySnapshotColumns } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-Bb_svqyv.mjs";
import { t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-EwCluh1i.mjs";
import { a as projectSqliteSessionParticipants, i as prepareSqliteSessionParticipantProjection, o as projectSqliteSessionParticipantsBatch, t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { a as selectSessionEntryRows, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { g as canonicalSessionKeyMigrationRequiredError, o as canonicalSessionValidationQuery, r as assertCanonicalSqliteSessionKeysCurrent, u as readWithCanonicalSessionAdmission, v as validateCanonicalSessionRowEntry } from "./session-canonical-key-D1TSJMmX.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-entry-read.ts
function prepareExactSessionEntryQueries(database) {
	const db = getNodeSqliteKysely(database);
	const metadataQueries = /* @__PURE__ */ new Map();
	const canonicalQueries = /* @__PURE__ */ new Map();
	return {
		row: prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("session_nodes").selectAll().select(sessionEntrySnapshotColumns).where("session_key", "=", parameter((key) => key))),
		metadata: (key) => {
			const ownerColumns = hasSqliteSessionOwnerColumns(database);
			let query = metadataQueries.get(ownerColumns);
			if (!query) {
				query = prepareSqliteQueryTakeFirstSync(database, (parameter) => selectSessionEntryRows({ db: database }, "list", [], ownerColumns).select(["current_session_id", "updated_at"]).select(sql`CAST(session_nodes.rowid AS TEXT)`.as("rowid")).where("session_key", "=", parameter((value) => value)));
				metadataQueries.set(ownerColumns, query);
			}
			return query(key);
		},
		canonical: (key, projection) => {
			const shape = `${projection}:${hasSqliteSessionOwnerColumns(database)}`;
			let query = canonicalQueries.get(shape);
			if (!query) {
				query = prepareSqliteQueryTakeFirstSync(database, (parameter) => canonicalSessionValidationQuery({ db: database }, { metadata: true }).$if(projection === "full", (selection) => selection.select(sessionEntrySnapshotColumns)).where("session_nodes.session_key", "=", parameter((value) => value)));
				canonicalQueries.set(shape, query);
			}
			return query(key);
		}
	};
}
const getExactSessionEntryQueries = createSqliteQueryCache(prepareExactSessionEntryQueries);
function parseReadableSessionEntryData(database, row, projection) {
	const parsed = projection === "delivery" ? parseSqliteSessionEntryRecord(row) : parseSessionEntryJson(row, projection);
	if (parsed) {
		if (projection === "delivery") {
			const { sessionId, updatedAt, delivery, groupId } = parsed;
			return {
				sessionId,
				updatedAt,
				delivery,
				groupId
			};
		}
		return parsed;
	}
	if (row.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_windows").select("session_id").where("session_id", "=", row.current_session_id).where("session_key", "=", row.session_key)) : void 0) return null;
	throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
}
function validateDeliveryCanonicalSessionEntry(sessionKey, entry) {
	if (resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry) !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${sessionKey}`);
	return entry;
}
/** Decodes a fresh owned entry, including its nested JSON, owner and participant values. */
function parseReadableSqliteSessionEntryRow(database, row, projection = "full") {
	const parsed = parseReadableSessionEntryData(database, row, projection);
	return parsed ? validateDeliveryCanonicalSessionEntry(row.session_key, projectSqliteSessionParticipants(database.db, row.session_key, parsed)) : null;
}
/** Decode supplied rows in caller order while sharing their lazy participant acquisition. */
function prepareSqliteSessionEntryRowDecoder(database, rows, projection = "full") {
	const projectParticipants = projection === "delivery" ? (_key, entry) => entry : prepareSqliteSessionParticipantProjection(database.db, rows.filter((row) => row.entry_json !== "{}").map((row) => row.session_key));
	return (row) => {
		const parsed = parseReadableSessionEntryData(database, row, projection);
		return parsed ? validateDeliveryCanonicalSessionEntry(row.session_key, projectParticipants(row.session_key, parsed)) : null;
	};
}
/** Projects one selected row set without repeating participant reads for each entry. */
function parseReadableSqliteSessionEntryRows(database, rows, projection = "full") {
	const parsedEntries = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const entry = parseReadableSessionEntryData(database, row, projection);
		if (entry) parsedEntries.set(row.session_key, entry);
	}
	if (parsedEntries.size === 0) return [];
	return [...projectSqliteSessionParticipantsBatch(database.db, parsedEntries)].map(([sessionKey, entry]) => ({
		sessionKey,
		entry: validateDeliveryCanonicalSessionEntry(sessionKey, entry)
	}));
}
function readSessionEntryRow(database, sessionKey, projection = "full") {
	return scanSessionEntryRows(database, sessionKey, projection)?.selected;
}
/**
* Reads the selected row plus every raw row the lookup scanned. A write transaction that must
* prove this logical row is unchanged can re-read and compare the raw rows instead of decoding
* the entry JSON again.
*/
function readSessionEntryRowScan(database, sessionKey) {
	return scanSessionEntryRows(database, sessionKey, "full");
}
function selectReadableSessionEntryRows(database, projection) {
	if (projection === "delivery") {
		const deliveryJson = sql`
      CASE WHEN json_valid(entry_json)
        AND json_type(entry_json, '$.sessionId') = 'text'
        AND json_type(entry_json, '$.updatedAt') IN ('integer', 'real')
        AND length(CAST(entry_json AS BLOB)) = length(CAST(printf('%s', entry_json) AS BLOB))
      THEN (SELECT CASE WHEN count(*) = count(DISTINCT key)
        THEN json_group_object(key, json(entry_json -> fullkey)) ELSE entry_json END
        FROM json_each(entry_json) WHERE key IN ('sessionId', 'updatedAt', 'delivery', 'groupId'))
      ELSE entry_json END`.as("entry_json");
		return getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
			"session_key",
			"current_session_id",
			"updated_at",
			deliveryJson
		]);
	}
	return projection === "list" ? selectSessionEntryRows(database, projection).select(["current_session_id", "updated_at"]) : getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll().select(sessionEntrySnapshotColumns);
}
function scanSessionEntryRows(database, sessionKey, projection) {
	return runSqliteReadOperationSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const lookupKeys = collectSessionEntryLookupKeys(sessionKey);
		const firstLookupKey = lookupKeys[0];
		if (firstLookupKey === void 0) return;
		let rows;
		if (lookupKeys.length === 1) {
			const queries = getExactSessionEntryQueries(database.db);
			const row = projection === "list" ? queries.metadata(firstLookupKey) : queries.row(firstLookupKey);
			rows = row ? [row] : [];
		} else rows = executeSqliteQuerySync(database.db, selectReadableSessionEntryRows(database, projection).where("session_key", "in", lookupKeys).orderBy("session_key", "asc")).rows;
		let selected;
		for (const row of rows) {
			const entry = parseReadableSqliteSessionEntryRow(database, row, projection);
			if (!entry || row.session_key !== sessionKey.trim()) continue;
			selected = {
				entry,
				row
			};
		}
		return {
			lookupKeys,
			rows,
			selected
		};
	});
}
function readExactSessionEntryRow(database, sessionKey, projection = "full", validation) {
	return runSqliteReadOperationSync(database.db, () => {
		const queries = getExactSessionEntryQueries(database.db);
		const canonicalRow = validation === "canonical" ? queries.canonical(sessionKey, projection) : void 0;
		const row = validation === "canonical" ? canonicalRow : projection === "list" ? queries.metadata(sessionKey) : queries.row(sessionKey);
		if (!row) return;
		const entry = parseReadableSqliteSessionEntryRow(database, row, projection);
		if (canonicalRow) validateCanonicalSessionRowEntry(canonicalRow, entry, "read");
		return entry ? {
			entry,
			row
		} : void 0;
	});
}
/** Capture exact rows once; failed cohort acquisition retains single-key error isolation. */
function prepareExactSessionEntryRowReads(database, sessionKeys, projection = "full") {
	return runSqliteReadOperationSync(database.db, () => {
		let rows;
		try {
			rows = executeSqliteQuerySync(database.db, selectReadableSessionEntryRows(database, projection).where("session_key", "in", sqliteStringSet(sessionKeys))).rows;
		} catch {
			return (sessionKey) => readExactSessionEntryRow(database, sessionKey, projection === "delivery" ? "list" : projection);
		}
		const byKey = new Map(rows.map((row) => [row.session_key, row]));
		const decodeRow = prepareSqliteSessionEntryRowDecoder(database, rows, projection);
		return (sessionKey) => runSqliteReadOperationSync(database.db, () => {
			const row = byKey.get(toUSVString(sessionKey));
			if (!row) return;
			const entry = decodeRow(row);
			return entry ? {
				entry,
				row
			} : void 0;
		});
	});
}
function readExactSessionEntryRowValidated(database, sessionKey, projection = "full") {
	return runSqliteReadOperationSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		return readExactSessionEntryRow(database, sessionKey, projection);
	});
}
/** Select a physical row while refusing any other admitted spelling. */
function readSessionEntryTargetRow(database, target, options = {}) {
	return runSqliteReadOperationSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const queries = getExactSessionEntryQueries(database.db);
		const rows = target.storeKeys.flatMap((key) => {
			const row = options.projection === "list" ? queries.metadata(key.trim()) : queries.row(key.trim());
			if (!row) return [];
			const entry = parseReadableSqliteSessionEntryRow(database, row, options.projection);
			return entry || options.guardRetainedWindows ? [{
				entry,
				row
			}] : [];
		});
		if (rows.length > 1) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${target.canonicalKey}`);
		const selected = rows[0];
		if (selected && selected.row.session_key !== target.canonicalKey && !options.allowCanonicalMove) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${target.canonicalKey}`);
		return selected;
	});
}
/** Only sentinel aliases share a logical identity with a different physical key. */
function readQualifiedSessionEntryRow(database, agentId, sessionKey, options = {}) {
	const parsed = parseAgentSessionKey(sessionKey);
	const sentinel = parsed?.rest ?? sessionKey;
	if (agentId !== database.agentId || parsed && parsed.agentId !== agentId || sentinel !== "global" && sentinel !== "unknown") return readSessionEntryRow(database, sessionKey, options.projection);
	return readSessionEntryTargetRow(database, {
		canonicalKey: sessionKey,
		storeKeys: [sentinel, `agent:${agentId}:${sentinel}`]
	}, {
		...options,
		guardRetainedWindows: true
	});
}
const SESSION_ID_TRIM_CHARACTERS = "	\n\v\f\r \xA0            \u2028\u2029  　﻿";
/** Uses the native current-ID and trimmed legacy-ID winner order inside the reader owner. */
function readSessionEntryByIdInDatabase(database, selection) {
	return readWithCanonicalSessionAdmission(database, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const query = getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key").orderBy("session_key");
		for (const trimLegacyId of [false, true]) {
			const matches = iterateSqliteQuerySync(database.db, trimLegacyId ? query.where((eb) => eb(eb.fn("trim", ["current_session_id", eb.val(SESSION_ID_TRIM_CHARACTERS)]), "=", selection.sessionId)) : query.where("current_session_id", "=", selection.sessionId));
			for (const { session_key: sessionKey } of matches) {
				if (isInternalSessionEffectsKey(sessionKey)) continue;
				const selected = readExactSessionEntryRowValidated(database, sessionKey, selection.projection);
				if (selected) return {
					sessionKey,
					entry: selected.entry
				};
			}
		}
	});
}
//#endregion
export { readExactSessionEntryRow as a, readSessionEntryByIdInDatabase as c, readSessionEntryTargetRow as d, validateDeliveryCanonicalSessionEntry as f, prepareSqliteSessionEntryRowDecoder as i, readSessionEntryRow as l, parseReadableSqliteSessionEntryRows as n, readExactSessionEntryRowValidated as o, prepareExactSessionEntryRowReads as r, readQualifiedSessionEntryRow as s, parseReadableSqliteSessionEntryRow as t, readSessionEntryRowScan as u };
