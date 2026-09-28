import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-_lavN1YB.mjs";
import { n as hashSessionArchiveBytes } from "./session-accessor.sqlite-archive-artifact-UkVgkxpH.mjs";
import { Readable } from "node:stream";
import zlib from "node:zlib";
import { pipeline as pipeline$1 } from "node:stream/promises";
import { createInterface } from "node:readline";
//#region src/config/sessions/session-accessor.sqlite-archive-read.ts
function listTranscriptArchivesFromDatabase({ db, agentId }, logicalAgentId, selectors, archiveNames) {
	if (!tableExists(db, "session_transcript_archives")) return [];
	let query = getNodeSqliteKysely(db).selectFrom("session_transcript_archives").select([
		"archive_name as archiveName",
		"session_id as sessionId",
		"session_key as sessionKey",
		"created_at as createdAt"
	]).orderBy("created_at").orderBy("session_id");
	query = query.where((expression) => expression.or([...selectors.length > 0 ? [expression("session_id", "in", selectors), expression("session_key", "in", selectors)] : [], ...archiveNames.length > 0 ? [expression("archive_name", "in", archiveNames)] : []]));
	return executeSqliteQuerySync(db, query).rows.map((row) => Object.assign(row, { agentId: resolveAgentIdFromSessionKey(row.sessionKey, agentId) })).filter((row) => logicalAgentId === void 0 || row.agentId === logicalAgentId);
}
/** Scan one canonical read snapshot without constructing the decoded history. */
async function readTranscriptArchiveFinalInWorker(plan, env) {
	const opened = openOpenClawAgentDatabaseReadOnly({
		agentId: plan.agentId,
		path: plan.databasePath,
		env
	});
	if (!opened.found) return {};
	const database = opened.database;
	let transactionOpen = false;
	try {
		database.db.exec("BEGIN");
		transactionOpen = true;
		const archives = listTranscriptArchivesFromDatabase(database, plan.logicalAgentId, [plan.sessionId ?? plan.sessionKey], []).toReversed();
		let result = {};
		for (const archive of archives) {
			if (plan.sessionId ? archive.sessionId !== plan.sessionId : archive.sessionKey !== plan.sessionKey) continue;
			const row = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_archives").select([
				"archive_blob",
				"archive_sha256",
				"encoding"
			]).where("archive_name", "=", archive.archiveName).where("session_id", "=", archive.sessionId).where("session_key", "=", archive.sessionKey));
			if (!row) continue;
			if (hashSessionArchiveBytes(row.archive_blob) !== row.archive_sha256) throw new Error("Archived transcript bytes do not match their registered hash.");
			result = await findArchivedFinal(row.archive_blob, row.encoding === "zstd", archive.sessionId, plan.runId);
			if (result.event !== void 0) break;
		}
		database.db.exec("COMMIT");
		transactionOpen = false;
		return result;
	} finally {
		try {
			if (transactionOpen) database.db.exec("ROLLBACK");
		} finally {
			database.close();
		}
	}
}
async function findArchivedFinal(bytes, compressed, sessionId, runId) {
	const { isVisibleSubagentResultEventForRun } = await import("./subagent-announce-result-PH5gnjJW.mjs");
	const input = Readable.from((function* () {
		for (let offset = 0; offset < bytes.byteLength; offset += 65536) yield bytes.subarray(offset, offset + 65536);
	})());
	const createZstdDecompress = zlib.createZstdDecompress;
	if (compressed && !createZstdDecompress) throw new Error("Cannot decode compressed transcript archive: this runtime lacks zstd support");
	let headerRead = false;
	const result = {};
	const scan = async (source) => {
		const lines = createInterface({
			input: source,
			crlfDelay: Infinity
		});
		const fragments = [];
		let depth = 0;
		try {
			for await (const line of lines) {
				let event;
				if (fragments.length === 0) {
					if (!line.trim()) continue;
					try {
						event = JSON.parse(line);
					} catch {
						fragments.push(line);
					}
				} else fragments.push(line);
				if (fragments.length > 0) {
					let quoted = false;
					let escaped = false;
					for (const character of line) if (escaped) escaped = false;
					else if (quoted && character === "\\") escaped = true;
					else if (character === "\"") quoted = !quoted;
					else if (!quoted) {
						if (character === "{" || character === "[") depth += 1;
						else if (character === "}" || character === "]") depth -= 1;
					}
					if (!quoted && depth > 0) continue;
					event = JSON.parse(fragments.join("\n"));
					fragments.length = 0;
				}
				if (!headerRead) {
					if (!isRecord(event) || event.type !== "session" || event.id !== sessionId) throw new Error("Archived transcript header does not match its registered session.");
					headerRead = true;
				} else if (isVisibleSubagentResultEventForRun(event, runId)) result.event = event;
			}
			if (fragments.length > 0) throw new SyntaxError("Unterminated archived transcript JSON.");
		} finally {
			lines.close();
		}
	};
	if (compressed && createZstdDecompress) await pipeline$1(input, createZstdDecompress.call(zlib), scan);
	else await pipeline$1(input, scan);
	if (!headerRead) throw new Error("Archived transcript header does not match its registered session.");
	return result;
}
//#endregion
export { readTranscriptArchiveFinalInWorker as n, listTranscriptArchivesFromDatabase as t };
