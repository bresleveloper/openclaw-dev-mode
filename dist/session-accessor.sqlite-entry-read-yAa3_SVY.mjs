import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { r as SessionParticipantIdentitySchema } from "./session-participant-Cj8YyLga.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { n as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-DuM7NmYY.mjs";
import { a as selectSessionEntryRows, c as hasSqliteSessionOwnerColumns, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { h as canonicalSessionKeyMigrationRequiredError, i as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-BBylVEaq.mjs";
import { toUSVString } from "node:util";
import { Compile } from "typebox/schema";
//#region src/config/sessions/session-participant-identity.ts
let identityValidator;
function participantIdentityNamespace(identity) {
	if (identity.type === "profile" || identity.type === "agent") return JSON.stringify({ type: identity.type });
	if (identity.type === "remote") return JSON.stringify({
		type: identity.type,
		pluginId: identity.pluginId,
		domain: identity.domain,
		idKind: identity.idKind
	});
	if (identity.type === "observation") return JSON.stringify({
		type: identity.type,
		pluginId: identity.pluginId,
		accountId: identity.accountId,
		senderKind: identity.senderKind
	});
	return JSON.stringify({
		type: identity.type,
		actorType: identity.actorType,
		source: identity.source
	});
}
function readParticipantIdentity(namespace, id) {
	const parsed = JSON.parse(namespace);
	if (isRecord(parsed)) {
		const identity = {
			...parsed,
			id
		};
		if ((identityValidator ??= Compile(SessionParticipantIdentitySchema)).Check(identity)) return identity;
	}
	throw new Error("Session participant identity is invalid; run openclaw doctor --fix.");
}
/** Inputs/aliases sum; retried cross-store copies retain the largest recorded aggregate. */
function mergeParticipantAggregate(current, incoming, mode) {
	if (!current) return incoming;
	return {
		contribution_count: mode === "sum" ? current.contribution_count + incoming.contribution_count : Math.max(current.contribution_count, incoming.contribution_count),
		first_prompted_at: current.first_prompted_at === null || incoming.first_prompted_at === null ? null : Math.min(current.first_prompted_at, incoming.first_prompted_at),
		last_prompted_at: current.last_prompted_at === null ? incoming.last_prompted_at : incoming.last_prompted_at === null ? current.last_prompted_at : Math.max(current.last_prompted_at, incoming.last_prompted_at)
	};
}
//#endregion
//#region src/config/sessions/session-participant-prepared-read.ts
let preparedRead;
/** Only synchronous materialization borrows facts; transaction authority always reads its owner. */
function withPreparedSessionParticipants(read, consume) {
	const previous = preparedRead;
	preparedRead = read;
	try {
		const value = consume();
		if (isPromiseLike(value)) {
			Promise.resolve(value).catch(() => {});
			throw new Error("Prepared participant consumers must remain synchronous");
		}
		return value;
	} finally {
		preparedRead = previous;
	}
}
function readPreparedSessionParticipants(database, sessionKey) {
	if (!preparedRead || database.isTransaction) return;
	const identity = findOpenClawAgentDatabaseIdentity({ db: database })?.identity;
	if (identity === void 0) return;
	const projection = preparedRead(identity, sessionKey);
	return projection && {
		...projection.participants ? { participants: projection.participants.map(({ identity: participantIdentity }) => ({ identity: { ...participantIdentity } })) } : {},
		...projection.participantCount === void 0 ? {} : { participantCount: projection.participantCount }
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-participant-projection.ts
function selectParticipantRows(database) {
	return getNodeSqliteKysely(database).selectFrom("session_participants").selectAll().orderBy("session_key").orderBy("first_prompted_at").orderBy("actor_id").orderBy("identity_namespace");
}
function prepareSingleSessionParticipantQuery(database) {
	return prepareSqliteQuerySync(database, (parameter) => selectParticipantRows(database).where("session_key", "=", parameter((sessionKey) => sessionKey)));
}
const singleSessionParticipantQueries = /* @__PURE__ */ new WeakMap();
function readParticipantRows(database, sessionKeys) {
	const sessionKey = sessionKeys?.length === 1 ? sessionKeys[0] : void 0;
	if (sessionKey !== void 0) {
		let query = singleSessionParticipantQueries.get(database);
		if (!query) {
			query = prepareSingleSessionParticipantQuery(database);
			singleSessionParticipantQueries.set(database, query);
		}
		return query(sessionKey).rows;
	}
	let query = selectParticipantRows(database);
	if (sessionKeys) query = query.where("session_key", "in", sqliteStringSet(sessionKeys));
	return executeSqliteQuerySync(database, query).rows;
}
function readParticipantRecord(row) {
	return {
		identity: readParticipantIdentity(row.identity_namespace, row.actor_id),
		contributionCount: row.contribution_count,
		firstPromptedAt: row.first_prompted_at,
		lastPromptedAt: row.last_prompted_at
	};
}
function participantRecordsBySessionKey(database, sessionKeys) {
	const records = /* @__PURE__ */ new Map();
	if (!tableExists(database, "session_participants")) return records;
	for (const row of readParticipantRows(database, sessionKeys)) {
		const participants = records.get(row.session_key) ?? [];
		participants.push(readParticipantRecord(row));
		records.set(row.session_key, participants);
	}
	return records;
}
function participantProjection(records) {
	if (records.length === 0) return {};
	return {
		participants: records.map(({ identity }) => ({ identity })),
		participantCount: records.length
	};
}
function withProjectedParticipants(entry, records) {
	return records.length ? {
		...entry,
		...participantProjection(records)
	} : entry;
}
function readSqliteSessionParticipantProjection(database, sessionKey) {
	return readPreparedSessionParticipants(database, sessionKey) ?? participantProjection(participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
function projectSqliteSessionParticipants(database, sessionKey, entry) {
	const prepared = readPreparedSessionParticipants(database, sessionKey);
	if (prepared) return prepared.participants ? {
		...entry,
		...prepared
	} : entry;
	return withProjectedParticipants(entry, participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
/** Acquire one fresh cohort lazily, then decode only the requested session's participants. */
function prepareSqliteSessionParticipantProjection(database, sessionKeys) {
	let rowsByKey;
	let acquisitionFailed = false;
	return (sessionKey, entry) => {
		const prepared = readPreparedSessionParticipants(database, sessionKey);
		if (prepared) return prepared.participants ? {
			...entry,
			...prepared
		} : entry;
		if (!rowsByKey && !acquisitionFailed) try {
			const rows = tableExists(database, "session_participants") ? readParticipantRows(database, sessionKeys) : [];
			rowsByKey = /* @__PURE__ */ new Map();
			for (const row of rows) {
				const participants = rowsByKey.get(row.session_key) ?? [];
				participants.push(row);
				rowsByKey.set(row.session_key, participants);
			}
		} catch {
			acquisitionFailed = true;
		}
		if (acquisitionFailed) return projectSqliteSessionParticipants(database, sessionKey, entry);
		return withProjectedParticipants(entry, (rowsByKey?.get(sessionKey) ?? []).map(readParticipantRecord));
	};
}
function projectSqliteSessionParticipantsBatch(database, entries) {
	const prepared = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of entries) {
		const projection = readPreparedSessionParticipants(database, sessionKey);
		if (!projection) break;
		prepared.set(sessionKey, projection.participants ? {
			...entry,
			...projection
		} : entry);
	}
	if (prepared.size === entries.size) return prepared;
	const records = participantRecordsBySessionKey(database, [...entries.keys()]);
	const projected = new Map(entries);
	for (const [sessionKey, participants] of records) {
		const entry = entries.get(sessionKey);
		if (entry) projected.set(sessionKey, withProjectedParticipants(entry, participants));
	}
	return projected;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-read.ts
function prepareExactSessionEntryQueries(database) {
	const db = getNodeSqliteKysely(database);
	const metadataQueries = /* @__PURE__ */ new Map();
	return {
		row: prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("session_nodes").selectAll().where("session_key", "=", parameter((key) => key))),
		json: prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("session_nodes").select("entry_json").where("session_key", "=", parameter((key) => key))),
		metadata: (key) => {
			const ownerColumns = hasSqliteSessionOwnerColumns(database);
			let query = metadataQueries.get(ownerColumns);
			if (!query) {
				query = prepareSqliteQueryTakeFirstSync(database, (parameter) => selectSessionEntryRows({ db: database }, "list", [], ownerColumns).select(["current_session_id", "updated_at"]).select((eb) => eb.cast("session_nodes.rowid", "text").as("rowid")).where("session_key", "=", parameter((value) => value)));
				metadataQueries.set(ownerColumns, query);
			}
			return query(key);
		}
	};
}
const exactSessionEntryQueries = /* @__PURE__ */ new WeakMap();
function getExactSessionEntryQueries(database) {
	let queries = exactSessionEntryQueries.get(database);
	if (!queries) {
		queries = prepareExactSessionEntryQueries(database);
		exactSessionEntryQueries.set(database, queries);
	}
	return queries;
}
function parseReadableSessionEntryData(database, row, projection) {
	const parsed = parseSessionEntryJson(row, projection);
	if (parsed) return parsed;
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
	const projectParticipants = prepareSqliteSessionParticipantProjection(database.db, rows.filter((row) => row.entry_json !== "{}").map((row) => row.session_key));
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
function scanSessionEntryRows(database, sessionKey, projection) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const lookupKeys = collectSessionEntryLookupKeys(database, sessionKey);
	const firstLookupKey = lookupKeys[0];
	if (firstLookupKey === void 0) return;
	let rows;
	if (lookupKeys.length === 1) {
		const queries = getExactSessionEntryQueries(database.db);
		const row = projection === "list" ? queries.metadata(firstLookupKey) : queries.row(firstLookupKey);
		rows = row ? [row] : [];
	} else {
		const query = projection === "list" ? selectSessionEntryRows(database, projection).select(["current_session_id", "updated_at"]) : getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll();
		rows = executeSqliteQuerySync(database.db, query.where("session_key", "in", lookupKeys).orderBy("session_key", "asc")).rows;
	}
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
}
function readExactSessionEntryRow(database, sessionKey, projection = "full") {
	const row = projection === "list" ? getExactSessionEntryQueries(database.db).metadata(sessionKey) : getExactSessionEntryQueries(database.db).row(sessionKey);
	if (!row) return;
	const entry = parseReadableSqliteSessionEntryRow(database, row, projection);
	return entry ? {
		entry,
		row
	} : void 0;
}
/** Capture exact rows once; failed cohort acquisition retains single-key error isolation. */
function prepareExactSessionEntryRowReads(database, sessionKeys, projection = "full") {
	let rows;
	try {
		const query = projection === "list" ? selectSessionEntryRows(database, projection).select(["current_session_id", "updated_at"]) : getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll();
		rows = executeSqliteQuerySync(database.db, query.where("session_key", "in", sqliteStringSet(sessionKeys))).rows;
	} catch {
		return (sessionKey) => readExactSessionEntryRow(database, sessionKey, projection);
	}
	const byKey = new Map(rows.map((row) => [row.session_key, row]));
	const decodeRow = prepareSqliteSessionEntryRowDecoder(database, rows, projection);
	return (sessionKey) => {
		const row = byKey.get(toUSVString(sessionKey));
		if (!row) return;
		const entry = decodeRow(row);
		return entry ? {
			entry,
			row
		} : void 0;
	};
}
function readExactSessionEntryJson(database, sessionKey) {
	return getExactSessionEntryQueries(database.db).json(sessionKey)?.entry_json;
}
function readExactSessionEntryRowValidated(database, sessionKey, projection = "full") {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return readExactSessionEntryRow(database, sessionKey, projection);
}
//#endregion
export { participantIdentityNamespace as _, readExactSessionEntryJson as a, readSessionEntryRow as c, participantRecordsBySessionKey as d, projectSqliteSessionParticipants as f, mergeParticipantAggregate as g, withPreparedSessionParticipants as h, prepareSqliteSessionEntryRowDecoder as i, readSessionEntryRowScan as l, readSqliteSessionParticipantProjection as m, parseReadableSqliteSessionEntryRows as n, readExactSessionEntryRow as o, projectSqliteSessionParticipantsBatch as p, prepareExactSessionEntryRowReads as r, readExactSessionEntryRowValidated as s, parseReadableSqliteSessionEntryRow as t, validateDeliveryCanonicalSessionEntry as u };
