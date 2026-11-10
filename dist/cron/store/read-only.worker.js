import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { r as openNodeSqliteDatabase } from "../../node-sqlite-CYaq-2Hb.mjs";
import { h as runSqliteReadOnlyWorkerSync } from "../../sqlite-readonly-worker-C2DDLw_y.mjs";
import { a as tableExists } from "../../openclaw-state-db-schema-helpers-C7eId980.mjs";
import { U as cronRunRecordStoreKey, W as cronRunRecordToRunLogEntry } from "../../openclaw-state-db-fast-path-D43QiPc4.mjs";
import { n as openOpenClawStateReadConnection, t as assertStateReadSchema } from "../../openclaw-state-db-read-connection-D53a_-IZ.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-sMsYUF1K.mjs";
import { n as inspectCronRowsForDoctor } from "../../store-inventory-Cc78yu3r.mjs";
import { n as serializeCronLoadError } from "../../load-error-CO2Pg-SG.mjs";
import { t as loadCronStoreFromDatabase } from "../../load.kernel-DOA7lYMT.mjs";
import { r as readCronRunRecordsInDatabase } from "../../run-history.kernel-BxXbzyDp.mjs";
import { createHash } from "node:crypto";
//#region src/cron/store/read-only.worker.ts
function selectTranscriptBinding(records, storeKey, selector) {
	let selected;
	for (const record of records) {
		const entry = cronRunRecordToRunLogEntry(record);
		if (!entry || selector.runId && entry.runId !== selector.runId || selector.runAtMs !== void 0 && entry.runAtMs !== selector.runAtMs) continue;
		if (selected) return;
		selected = {
			record,
			entry
		};
	}
	if (!selected) return;
	const { record, entry } = selected;
	if (!entry.sessionKey || !entry.sessionId) return;
	return {
		binding: createHash("sha256").update(JSON.stringify([
			storeKey,
			record.id,
			record.runId,
			entry.jobId,
			entry.runId,
			entry.runAtMs,
			entry.sessionKey,
			entry.sessionId,
			record.agentId
		])).digest("base64url"),
		sessionKey: entry.sessionKey,
		sessionId: entry.sessionId,
		agentId: record.agentId
	};
}
serveWorkerTasks(async (input, _channel, control) => {
	try {
		if (!isRecord(input) || typeof input.location !== "string" || input.storeKey !== void 0 && typeof input.storeKey !== "string" || input.stagingRoot !== void 0 && typeof input.stagingRoot !== "string" || input.history !== void 0 && (typeof input.storeKey !== "string" || !isRecord(input.history) || input.history.jobId !== void 0 && typeof input.history.jobId !== "string" || input.history.transcript !== void 0 && (typeof input.history.jobId !== "string" || !isRecord(input.history.transcript) || input.history.transcript.runId !== void 0 && typeof input.history.transcript.runId !== "string" || input.history.transcript.runAtMs !== void 0 && typeof input.history.transcript.runAtMs !== "number"))) throw new Error("Cron read-only worker requires a database location and an optional store key");
		const { location, storeKey, stagingRoot } = input;
		return await control.runNativeSection(() => {
			const connection = stagingRoot ? openOpenClawStateReadConnection(location, runSqliteReadOnlyWorkerSync(location, stagingRoot), void 0, stagingRoot) : void 0;
			const db = connection?.database.db ?? openNodeSqliteDatabase(location, { readOnly: true });
			try {
				if (isRecord(input.history)) {
					assertStateReadSchema(db, location);
					const history = readCronRunRecordsInDatabase(db, typeof input.history.jobId === "string" ? input.history.jobId : void 0).filter((row) => cronRunRecordStoreKey(row) === storeKey);
					if (isRecord(input.history.transcript) && typeof storeKey === "string") return {
						ok: true,
						binding: selectTranscriptBinding(history, storeKey, {
							runId: typeof input.history.transcript.runId === "string" ? input.history.transcript.runId : void 0,
							runAtMs: typeof input.history.transcript.runAtMs === "number" ? input.history.transcript.runAtMs : void 0
						})
					};
					return {
						ok: true,
						history
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
