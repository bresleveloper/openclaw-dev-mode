import { F as prepareSqliteAuditRecord } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
//#region src/infra/sqlite-audit-record-store.async.ts
function createSqliteAuditRecordReader(options) {
	const context = captureOpenClawStateReadWorkerContext(options);
	const source = {
		path: context.admission.databasePath,
		env: context.environment
	};
	const scope = options.scope;
	return { async latest(params) {
		const limit = Math.max(0, Math.floor(params.limit));
		if (limit === 0) return [];
		const result = await executeExistingOpenClawStateRead(source, {
			type: "diagnostic.latest",
			input: {
				scope,
				limit,
				beforeSequence: params.beforeSequence
			}
		}, { context });
		context.admission.assertCurrent();
		if (!result?.ok || result.type !== "diagnostic.latest") return [];
		return result.entries;
	} };
}
/** Serialize the audit record and capture its store before yielding to the shared actor. */
async function registerSqliteAuditRecordAsync(options, record) {
	const input = {
		scope: options.scope,
		maxEntries: Math.max(1, Math.floor(options.maxEntries)),
		record: prepareSqliteAuditRecord(options.scope, record)
	};
	const context = captureOpenClawStateWorkerContext(options);
	await runOpenClawStateWorkerOperation(context, (store) => store.execute({
		type: "diagnostic.register",
		input
	}), { assertCurrent: options.assertCurrent });
}
//#endregion
export { registerSqliteAuditRecordAsync as n, createSqliteAuditRecordReader as t };
