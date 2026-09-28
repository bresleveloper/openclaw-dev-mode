import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
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
function countAuditRecords(database, scope) {
	const row = executeSqliteQueryTakeFirstSync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select((eb) => eb.fn.countAll().as("count")).where("scope", "=", scope));
	return typeof row?.count === "bigint" ? coerceRequiredSqliteNumber(row.count) : row?.count ?? 0;
}
function nextAuditSequence(params) {
	const next = (executeSqliteQueryTakeFirstSync(params.database, getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select((eb) => eb.fn.max("sequence").as("sequence")).where("scope", "=", params.scope).where("sequence", params.legacy ? "<" : ">=", 0))?.sequence ?? (params.legacy ? LEGACY_AUDIT_SEQUENCE_BASE : 0)) + 1;
	if (!Number.isSafeInteger(next) || params.legacy && next >= 0) throw new Error(`Audit sequence exhausted for scope ${params.scope}`);
	return next;
}
function pruneAuditRecords(params) {
	const overflow = countAuditRecords(params.database, params.scope) - params.maxEntries;
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
const auditRecordInserts = /* @__PURE__ */ new WeakMap();
/** Connection-bound operations; mutation callers retain the complete transaction. */
function createSqliteAuditRecordKernel(database, options) {
	const scope = options.scope;
	const maxEntries = options.maxEntries;
	function insertRecord(record) {
		let insert = auditRecordInserts.get(database);
		if (!insert) {
			insert = createAuditRecordInsert(database);
			auditRecordInserts.set(database, insert);
		}
		insert({
			...record,
			scope
		});
	}
	function upsertPreparedRecord(record) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).insertInto("diagnostic_events").values({
			scope,
			event_key: record.event_key,
			payload_json: record.payload_json,
			created_at: record.created_at,
			sequence: nextAuditSequence({
				database,
				scope,
				legacy: false
			})
		}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doUpdateSet({
			payload_json: record.payload_json,
			created_at: record.created_at
		})));
		pruneAuditRecords({
			database,
			scope,
			maxEntries,
			protectedKey: record.event_key
		});
	}
	function deleteRecord(key) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).deleteFrom("diagnostic_events").where("scope", "=", scope).where("event_key", "=", key));
	}
	return {
		register(record) {
			insertRecord({
				...record,
				sequence: nextAuditSequence({
					database,
					scope,
					legacy: false
				})
			});
			pruneAuditRecords({
				database,
				scope,
				maxEntries,
				protectedKey: record.event_key
			});
		},
		upsert(record) {
			upsertPreparedRecord(record);
		},
		delete(key) {
			deleteRecord(key);
		},
		compareAndSet(key, expectedPayloadJson, record) {
			if ((executeSqliteQueryTakeFirstSync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select("payload_json").where("scope", "=", scope).where("event_key", "=", key))?.payload_json ?? null) !== expectedPayloadJson) return false;
			if (record) upsertPreparedRecord(record);
			else deleteRecord(key);
			return true;
		},
		registerLegacyMany(records) {
			let sequence = nextAuditSequence({
				database,
				scope,
				legacy: true
			});
			for (const record of records) {
				insertRecord({
					...record,
					sequence
				});
				sequence += 1;
			}
			pruneAuditRecords({
				database,
				scope,
				maxEntries
			});
		},
		size() {
			return countAuditRecords(database, scope);
		},
		entries() {
			return executeSqliteQuerySync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select([
				"event_key",
				"payload_json",
				"created_at",
				"sequence"
			]).where("scope", "=", scope).orderBy("sequence", "asc")).rows.map((row) => {
				const { sequence: _sequence, ...entry } = parseAuditRecord(row);
				return entry;
			});
		},
		latest(params) {
			const baseQuery = getAuditRecordKysely(database).selectFrom("diagnostic_events").select([
				"event_key",
				"payload_json",
				"created_at",
				"sequence"
			]).where("scope", "=", scope);
			const query = params.beforeSequence === void 0 ? baseQuery : baseQuery.where("sequence", "<", params.beforeSequence);
			return executeSqliteQuerySync(database, query.orderBy("sequence", "desc").limit(params.limit)).rows.map((row) => parseAuditRecord(row));
		}
	};
}
//#endregion
//#region src/infra/sqlite-audit-record-store.ts
/** Opens one bounded audit-record scope in the shared state database. */
function createSqliteAuditRecordStore(options) {
	const scope = options.scope;
	const maxEntries = Math.max(1, Math.floor(options.maxEntries));
	const kernel = (database) => createSqliteAuditRecordKernel(database, {
		scope,
		maxEntries
	});
	const prepare = (record) => prepareSqliteAuditRecord(scope, record);
	return {
		register(key, value, createdAt = Date.now()) {
			const record = prepare({
				key,
				value,
				createdAt
			});
			runOpenClawStateWriteTransaction(({ db }) => kernel(db).register(record), options);
		},
		upsert(key, value, createdAt = Date.now()) {
			const record = prepare({
				key,
				value,
				createdAt
			});
			runOpenClawStateWriteTransaction(({ db }) => kernel(db).upsert(record), options);
		},
		delete(key) {
			runOpenClawStateWriteTransaction(({ db }) => kernel(db).delete(key), options);
		},
		compareAndSet(key, expectedValue, value, createdAt = Date.now()) {
			const expectedPayloadJson = expectedValue === null ? null : JSON.stringify(expectedValue);
			const record = value === null ? null : prepare({
				key,
				value,
				createdAt
			});
			return runOpenClawStateWriteTransaction(({ db }) => kernel(db).compareAndSet(key, expectedPayloadJson, record), options);
		},
		registerLegacyMany(records) {
			const prepared = records.map(prepare);
			if (prepared.length === 0) return;
			runOpenClawStateWriteTransaction(({ db }) => kernel(db).registerLegacyMany(prepared), options);
		},
		size() {
			return kernel(openOpenClawStateDatabase(options).db).size();
		},
		entries() {
			return kernel(openOpenClawStateDatabase(options).db).entries();
		},
		latest(params) {
			const limit = Math.max(0, Math.floor(params.limit));
			if (limit === 0) return [];
			return kernel(openOpenClawStateDatabase(options).db).latest({
				...params,
				limit
			});
		}
	};
}
//#endregion
export { createSqliteAuditRecordKernel as n, prepareSqliteAuditRecord as r, createSqliteAuditRecordStore as t };
