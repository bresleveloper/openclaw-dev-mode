import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as SqliteCoordinatorError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { r as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { h as runSqliteReadOnlyWorkerSync } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { t as beginSqliteConnectionExclusion } from "./sqlite-native-exclusion-BfIgwBu6.mjs";
import { a as truncateSqliteWal } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { u as readSqliteSchemaCookie } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import fs from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/update-doctor-migration-attribution.ts
const captures = new AsyncLocalStorage();
function runWithUpdateDoctorMigrationCapture(capture, operation) {
	return captures.getStore() ? operation() : captures.run(capture, operation);
}
/** Raw descriptors stay in the child even while our native writer holds exclusion. */
function readUpdateDoctorGeneration(pathname) {
	const value = JSON.parse(runSqliteReadOnlyWorkerSync(pathname, void 0, "update-generation"));
	if (!value || typeof value !== "object" || !("generation" in value)) throw new Error("Database generation child returned an invalid observation.");
	const generation = value.generation;
	const emptyReaderAlternate = "emptyReaderAlternate" in value ? value.emptyReaderAlternate : void 0;
	if (generation !== null && (typeof generation !== "string" || !/^[a-f0-9]{64}$/u.test(generation)) || emptyReaderAlternate !== void 0 && (typeof emptyReaderAlternate !== "string" || !/^[a-f0-9]{64}$/u.test(emptyReaderAlternate))) throw new Error("Database generation child returned an invalid observation.");
	return {
		generation,
		...emptyReaderAlternate !== void 0 ? { emptyReaderAlternate } : {}
	};
}
/** Only a one-shot existing ledger writer opts in. Ordinary Doctor writes remain unknown. */
function runUpdateDoctorAttributedStateWrite(db, pathname, operation, close) {
	const capture = captures.getStore();
	if (!capture) throw new Error("Attributed update write requires its original Doctor capture.");
	try {
		const maintenance = getOpenClawDatabaseMaintenanceScope();
		if (!maintenance?.ownsSchemaMaintenance) throw new Error("Attributed update write requires schema maintenance custody.");
		const assertCurrent = () => {
			maintenance.assertAdmission();
			assertStateDatabaseAccessAllowed(pathname);
			capture.assertCurrent();
		};
		assertCurrent();
		const expected = capture.expected(pathname);
		if (typeof expected !== "string" || db.isTransaction) throw new Error("Attributed update write requires an existing captured source and settled writer.");
		const identity = fs.lstatSync(pathname);
		const before = readUpdateDoctorGeneration(pathname);
		assertCurrent();
		if (before.generation !== expected && before.emptyReaderAlternate !== expected) throw new Error("SQLite receipt source changed after update capture.");
		readSqliteSchemaCookie(db);
		beginSqliteConnectionExclusion(db);
		db.exec("ROLLBACK");
		const locked = readUpdateDoctorGeneration(pathname);
		assertCurrent();
		if (locked.generation !== before.generation && locked.emptyReaderAlternate !== before.generation) throw new Error("SQLite receipt source changed before native exclusion.");
		const value = operation();
		if (isPromiseLike(value) || db.isTransaction) throw new Error("Attributed update write must commit synchronously.");
		assertCurrent();
		truncateSqliteWal(db, pathname);
		try {
			close();
		} catch (error) {
			throw new SqliteCoordinatorError("Receipt writer cleanup failed", error);
		}
		const after = readUpdateDoctorGeneration(pathname);
		assertCurrent();
		const currentIdentity = fs.lstatSync(pathname);
		if (after.generation === null || identity.dev !== currentIdentity.dev || identity.ino !== currentIdentity.ino) throw new Error("Receipt source was replaced during publication.");
		capture.accept(pathname, expected, after.generation);
		return value;
	} catch (error) {
		capture.refuse("Predecessor stop receipt publication could not be verified.");
		throw error;
	}
}
//#endregion
export { runUpdateDoctorAttributedStateWrite as n, runWithUpdateDoctorMigrationCapture as r, readUpdateDoctorGeneration as t };
