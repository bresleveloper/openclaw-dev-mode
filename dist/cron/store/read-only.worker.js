import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { t as openNodeSqliteDatabase } from "../../node-sqlite-XIcwmOrl.mjs";
import { i as tableExists } from "../../openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { m as runSqliteReadOnlyWorkerSync } from "../../sqlite-readonly-worker-TSy0m8v6.mjs";
import { B as cronRunRecordStoreKey } from "../../openclaw-state-db-fast-path-CPAamWzU.mjs";
import { r as openOpenClawStateReadConnection, t as assertStateReadSchema } from "../../openclaw-state-db-read-connection-C62_-Nv8.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-BC_7U18u.mjs";
import { n as inspectCronRowsForDoctor } from "../../store-inventory-BNU8BqxX.mjs";
import { n as serializeCronLoadError } from "../../load-error-DymNKrHv.mjs";
import { t as loadCronStoreFromDatabase } from "../../load.kernel-Dy8tLTqI.mjs";
import { n as readCronRunRecordsInDatabase } from "../../run-history.kernel-DBs5pEGz.mjs";
//#region src/cron/store/read-only.worker.ts
serveWorkerTasks(async (input, _channel, control) => {
	try {
		if (!isRecord(input) || typeof input.location !== "string" || input.storeKey !== void 0 && typeof input.storeKey !== "string" || input.stagingRoot !== void 0 && typeof input.stagingRoot !== "string" || input.history !== void 0 && (typeof input.storeKey !== "string" || !isRecord(input.history) || input.history.jobId !== void 0 && typeof input.history.jobId !== "string")) throw new Error("Cron read-only worker requires a database location and an optional store key");
		const { location, storeKey, stagingRoot } = input;
		return await control.runNativeSection(() => {
			const connection = stagingRoot ? openOpenClawStateReadConnection(location, runSqliteReadOnlyWorkerSync(location, stagingRoot), void 0, stagingRoot) : void 0;
			const db = connection?.database.db ?? openNodeSqliteDatabase(location, { readOnly: true });
			try {
				if (isRecord(input.history)) {
					assertStateReadSchema(db, location);
					return {
						ok: true,
						history: readCronRunRecordsInDatabase(db, typeof input.history.jobId === "string" ? input.history.jobId : void 0).filter((row) => cronRunRecordStoreKey(row) === storeKey)
					};
				}
				return {
					ok: true,
					inventory: storeKey === void 0 ? inspectCronRowsForDoctor(db) : void 0,
					loaded: storeKey !== void 0 && tableExists(db, "cron_jobs") ? loadCronStoreFromDatabase(db, storeKey) : void 0
				};
			} finally {
				if (connection) connection.close();
				else db.close();
			}
		});
	} catch (error) {
		return {
			ok: false,
			error: serializeCronLoadError(error)
		};
	}
});
//#endregion
export {};
