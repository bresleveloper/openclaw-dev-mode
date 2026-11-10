import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
//#region src/infra/sqlite-audit-record.kernel.ts
const LEGACY_AUDIT_SEQUENCE_BASE = Number.MIN_SAFE_INTEGER;
function getAuditRecordKysely(database) {
	return getNodeSqliteKysely(database);
}
function parseAuditRecord(row) {
	return {
		key: row.event_key,
		value: JSON.parse(row.payload_json),
		createdAt: row.created_at,
		sequence: row.sequence
	};
}
function readAuditWriteState(params) {
	const row = executeSqliteQueryTakeFirstSync(params.database, getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select((eb) => [
		eb.fn.max("sequence").filterWhere("sequence", params.legacy ? "<" : ">=", 0).as("sequence"),
		eb.fn.countAll().as("count"),
		eb.fn.countAll().filterWhere("event_key", "=", params.key ?? "").as("keyCount")
	]).where("scope", "=", params.scope));
	const next = (row?.sequence ?? (params.legacy ? LEGACY_AUDIT_SEQUENCE_BASE : 0)) + 1;
	if (!Number.isSafeInteger(next) || params.legacy && next >= 0) throw new Error(`Audit sequence exhausted for scope ${params.scope}`);
	return {
		nextSequence: next,
		count: coerceRequiredSqliteNumber(row?.count ?? 0),
		keyExists: coerceRequiredSqliteNumber(row?.keyCount ?? 0) > 0
	};
}
function pruneAuditRecords(params) {
	const overflow = params.count - params.maxEntries;
	if (overflow <= 0) return;
	const protectedKey = params.protectedKey;
	const baseCandidates = getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select("event_key").where("scope", "=", params.scope);
	const candidates = (protectedKey === void 0 ? baseCandidates : baseCandidates.where("event_key", "!=", protectedKey)).orderBy("sequence", "asc").limit(overflow);
	executeSqliteQuerySync(params.database, getAuditRecordKysely(params.database).deleteFrom("diagnostic_events").where("scope", "=", params.scope).where("event_key", "in", candidates));
}
function prepareSqliteAuditRecord(scope, record) {
	const payloadJson = JSON.stringify(record.value);
	if (payloadJson === void 0) throw new Error(`Audit record ${scope}/${record.key} is not JSON-serializable`);
	return {
		event_key: record.key,
		payload_json: payloadJson,
		created_at: record.createdAt
	};
}
function createAuditRecordInsert(database) {
	return prepareSqliteQuerySync(database, (parameter) => getAuditRecordKysely(database).insertInto("diagnostic_events").values({
		scope: parameter((record) => record.scope),
		event_key: parameter((record) => record.event_key),
		payload_json: parameter((record) => record.payload_json),
		created_at: parameter((record) => record.created_at),
		sequence: parameter((record) => record.sequence)
	}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doNothing()));
}
const auditRecordInsert = createSqliteQueryCache(createAuditRecordInsert);
/** Connection-bound operations; mutation callers retain the complete transaction. */
function createSqliteAuditRecordKernel(database, options) {
	const scope = options.scope;
	const maxEntries = options.maxEntries;
	const prune = (count, protectedKey) => pruneAuditRecords({
		database,
		scope,
		maxEntries,
		count,
		protectedKey
	});
	const selectEntries = () => getAuditRecordKysely(database).selectFrom("diagnostic_events").select([
		"event_key",
		"payload_json",
		"created_at",
		"sequence"
	]).where("scope", "=", scope);
	function insertRecord(record) {
		return Number(auditRecordInsert(database)({
			...record,
			scope
		}).numAffectedRows ?? 0);
	}
	function upsertPreparedRecord(record) {
		const state = readAuditWriteState({
			database,
			scope,
			legacy: false,
			key: record.event_key
		});
		executeSqliteQuerySync(database, getAuditRecordKysely(database).insertInto("diagnostic_events").values({
			scope,
			event_key: record.event_key,
			payload_json: record.payload_json,
			created_at: record.created_at,
			sequence: state.nextSequence
		}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doUpdateSet({
			payload_json: record.payload_json,
			created_at: record.created_at
		})));
		prune(state.count + (state.keyExists ? 0 : 1), record.event_key);
	}
	function deleteRecord(key) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).deleteFrom("diagnostic_events").where("scope", "=", scope).where("event_key", "=", key));
	}
	return {
		register(record) {
			const state = readAuditWriteState({
				database,
				scope,
				legacy: false
			});
			const inserted = insertRecord({
				...record,
				sequence: state.nextSequence
			});
			prune(state.count + inserted, record.event_key);
		},
		upsert: upsertPreparedRecord,
		delete: deleteRecord,
		compareAndSet(key, expectedPayloadJson, record) {
			if ((executeSqliteQueryTakeFirstSync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select("payload_json").where("scope", "=", scope).where("event_key", "=", key))?.payload_json ?? null) !== expectedPayloadJson) return false;
			if (record) upsertPreparedRecord(record);
			else deleteRecord(key);
			return true;
		},
		registerLegacyMany(records) {
			const state = readAuditWriteState({
				database,
				scope,
				legacy: true
			});
			let sequence = state.nextSequence;
			let count = state.count;
			for (const record of records) {
				count += insertRecord({
					...record,
					sequence
				});
				sequence += 1;
			}
			prune(count);
		},
		entries() {
			return executeSqliteQuerySync(database, selectEntries().orderBy("sequence", "asc")).rows.map((row) => {
				const { sequence: _sequence, ...entry } = parseAuditRecord(row);
				return entry;
			});
		},
		latest(params) {
			const baseQuery = selectEntries();
			const query = params.beforeSequence === void 0 ? baseQuery : baseQuery.where("sequence", "<", params.beforeSequence);
			return executeSqliteQuerySync(database, query.orderBy("sequence", "desc").limit(params.limit)).rows.map((row) => parseAuditRecord(row));
		}
	};
}
//#endregion
export { prepareSqliteAuditRecord as n, createSqliteAuditRecordKernel as t };
