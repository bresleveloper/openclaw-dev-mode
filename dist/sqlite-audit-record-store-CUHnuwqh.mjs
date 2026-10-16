import { F as prepareSqliteAuditRecord, P as createSqliteAuditRecordKernel } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
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
export { createSqliteAuditRecordStore as t };
