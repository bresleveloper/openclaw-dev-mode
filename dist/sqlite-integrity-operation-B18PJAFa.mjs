import { M as recordSqliteDatabaseIntegrity } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { c as resolveSqliteInspectionSignal } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { t as assertSqliteIntegrityInWorker } from "./sqlite-integrity-worker-DyRlMgGE.mjs";
//#region src/infra/sqlite-integrity-operation.ts
/** Keep the caller's connection and authority until every native reader closes. */
async function runSqliteIntegrityOperationInWorker(operation, options) {
	const signal = resolveSqliteInspectionSignal(options.signal) ?? options.signal;
	const beforeResume = () => {
		signal.throwIfAborted();
		options.beforeResume();
	};
	try {
		beforeResume();
		let step = operation.next();
		while (!step.done) {
			let failure;
			try {
				await assertSqliteIntegrityInWorker(step.value.databaseLabel, options.busyTimeoutMs, signal, void 0, step.value.timing);
			} catch (error) {
				failure = { error };
			}
			beforeResume();
			if (!failure) recordSqliteDatabaseIntegrity(step.value.database);
			step = failure && !options.repairIntegrityError?.() ? operation.throw(failure.error) : operation.next();
		}
	} finally {
		operation.return();
	}
}
//#endregion
export { runSqliteIntegrityOperationInWorker as t };
