import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as readVerifiedSessionColdArchive } from "./session-cold-storage-codec-PYYgyI9l.mjs";
//#region src/config/sessions/session-cold-storage-backup.ts
/** Embed cold files into a private snapshot before its integrity check and publication. */
async function embedSessionColdArchivesInSnapshot(params) {
	const db = getNodeSqliteKysely(params.database);
	if (!executeSqliteQueryTakeFirstSync(params.database, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "=", "session_transcript_cold_archives"))) return;
	let previousSessionId;
	while (true) {
		let query = db.selectFrom("session_transcript_cold_archives").selectAll().orderBy("session_id").limit(1);
		if (previousSessionId !== void 0) query = query.where("session_id", ">", previousSessionId);
		const archive = executeSqliteQueryTakeFirstSync(params.database, query);
		if (!archive) return;
		const bytes = await readVerifiedSessionColdArchive({
			storePath: params.sourceStorePath,
			archive
		});
		if (archive.storage === "file") executeSqliteQuerySync(params.database, db.updateTable("session_transcript_cold_archives").set({
			storage: "sqlite",
			archive_blob: bytes
		}).where("session_id", "=", archive.session_id));
		previousSessionId = archive.session_id;
	}
}
//#endregion
export { embedSessionColdArchivesInSnapshot as t };
