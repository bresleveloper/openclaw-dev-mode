import { n as prepareSqliteAuditRecord, t as createSqliteAuditRecordKernel } from "./sqlite-audit-record.kernel-BhQWS5ko.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
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
		upsert(key, value, createdAt = Date.now()) {
			const record = prepare({
				key,
				value,
				createdAt
			});
			runOpenClawStateWriteTransaction(({ db }) => kernel(db).upsert(record), options);
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
