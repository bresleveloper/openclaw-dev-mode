import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { d as readReferencedSessionIds } from "./session-accessor.sqlite-lifecycle-state-BBji5bes.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/session-history-archive-pruning.worker.ts
function readSessionArchivePruningInDatabase(database, limit = 1) {
	if (!tableExists(database.db, "session_transcript_archives")) return [];
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select([
		"archive_name",
		"archive_sha256",
		"created_at",
		"encoding",
		"generation",
		"published_at",
		"reason",
		"session_id",
		"session_key"
	]).where("published_at", "is not", null).orderBy("created_at", "asc").orderBy("session_id", "asc").orderBy("generation", "asc").limit(limit)).rows.flatMap((row) => row.published_at === null ? [] : [{
		...row,
		published_at: row.published_at
	}]);
}
function readSessionArchivePruningInWorker(request) {
	const identity = `file:${request.expectedIdentity.physicalIdentity}`;
	assertExistingDatabaseIdentity(request.database.path, identity);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const current = readOpenClawAgentDatabaseIdentity(database);
		if (current.identity !== request.expectedIdentity.physicalIdentity || current.filename !== request.expectedIdentity.nativeLocation) throw new Error("SQLite archive pruning database owner changed");
		const value = readSessionArchivePruningInDatabase(database, request.limit);
		assertExistingDatabaseIdentity(request.database.path, identity);
		return value;
	}, {
		...request.database,
		env: request.env
	});
	if (!result.found) throw new Error(`SQLite archive pruning cannot read its database: ${result.reason}`);
	return result.value;
}
function pruneSessionArchivesByRetentionInDatabase(database, options, input, admit) {
	return runOpenClawAgentWriteTransaction((transactionDb) => {
		if (transactionDb.db !== database.db) throw new Error("SQLite archive pruning lost its database owner");
		admit("transaction");
		const referenced = readReferencedSessionIds(transactionDb, void 0, input.candidates.map((row) => row.session_id));
		const db = getSessionKysely(transactionDb.db);
		const directory = path.resolve(input.archiveDirectory);
		let removed = 0;
		for (const row of input.candidates) {
			const archivePath = path.resolve(directory, row.archive_name);
			if (referenced.has(row.session_id) || path.dirname(archivePath) !== directory || path.basename(archivePath) !== row.archive_name || fs.existsSync(archivePath)) continue;
			const result = executeSqliteQuerySync(transactionDb.db, db.deleteFrom("session_transcript_archives").where("session_id", "=", row.session_id).where("generation", "=", row.generation).where("archive_name", "=", row.archive_name).where("created_at", "=", row.created_at).where("published_at", "=", row.published_at));
			removed += Number(result.numAffectedRows ?? 0n);
		}
		admit("commit");
		return removed;
	}, options, { operationLabel: "session.archive.prune-retention" });
}
function removeLegacyArchiveFile(filePath, admitCommit) {
	let stat;
	try {
		stat = fs.statSync(filePath);
	} catch {
		admitCommit();
		return "failed";
	}
	if (!stat.isFile()) {
		admitCommit();
		return "failed";
	}
	admitCommit();
	try {
		fs.unlinkSync(filePath);
		return "removed";
	} catch {
		return "failed";
	}
}
function removeLegacySessionArchiveInDatabase(database, options, filePath, admit) {
	return runOpenClawAgentWriteTransaction((transactionDb) => {
		if (transactionDb.db !== database.db) throw new Error("SQLite archive pruning lost its database owner");
		admit("transaction");
		const db = getSessionKysely(transactionDb.db);
		if (tableExists(transactionDb.db, "session_transcript_archives") && executeSqliteQuerySync(transactionDb.db, db.selectFrom("session_transcript_archives").select("archive_name").where("archive_name", "=", path.basename(filePath)).limit(1)).rows.length > 0) {
			admit("commit");
			return "preserved";
		}
		return removeLegacyArchiveFile(filePath, () => admit("commit"));
	}, options, { operationLabel: "session.archive.remove-legacy" });
}
function deletePublishedSessionArchiveInDatabase(database, options, row, admit) {
	runOpenClawAgentWriteTransaction((transactionDb) => {
		if (transactionDb.db !== database.db) throw new Error("SQLite archive pruning lost its database owner");
		admit("transaction");
		const db = getSessionKysely(transactionDb.db);
		if (executeSqliteQuerySync(transactionDb.db, db.deleteFrom("session_transcript_archives").where("session_id", "=", row.session_id).where("generation", "=", row.generation).where("archive_name", "=", row.archive_name).where("archive_sha256", "=", row.archive_sha256).where("created_at", "=", row.created_at).where("encoding", "=", row.encoding).where("reason", "=", row.reason).where("session_key", "=", row.session_key).where("published_at", "=", row.published_at)).numAffectedRows !== 1n) throw new Error("SQLite session archive changed during pruning; retry cleanup.");
		admit("commit");
	}, options, { operationLabel: "session.archive.delete-published" });
}
//#endregion
export { deletePublishedSessionArchiveInDatabase, pruneSessionArchivesByRetentionInDatabase, readSessionArchivePruningInDatabase, readSessionArchivePruningInWorker, removeLegacySessionArchiveInDatabase };
