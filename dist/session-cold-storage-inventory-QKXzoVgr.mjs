import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
//#region src/config/sessions/session-cold-storage-inventory.ts
function readSessionColdStorageInventory(database) {
	if (!database) return {
		hotTranscripts: 0,
		coldTranscripts: 0,
		embeddedArchiveBytes: 0
	};
	return runSqliteDeferredTransactionSync(database.db, () => {
		const db = getNodeSqliteKysely(database.db);
		const cold = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_cold_archives").select((eb) => [eb.fn.countAll().as("count"), eb.fn.sum("archive_bytes").filterWhere("storage", "=", "sqlite").as("bytes")]));
		return {
			hotTranscripts: executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows as window").leftJoin("session_transcript_cold_archives as cold", "cold.session_id", "window.session_id").select((eb) => eb.fn.countAll().as("count")).where("cold.session_id", "is", null).where((eb) => eb.exists(eb.selectFrom("transcript_events as event").select("event.seq").whereRef("event.session_id", "=", "window.session_id"))))?.count ?? 0,
			embeddedArchiveBytes: cold?.bytes ?? 0,
			coldTranscripts: cold?.count ?? 0
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "session cold storage inventory"
	});
}
//#endregion
export { readSessionColdStorageInventory as t };
