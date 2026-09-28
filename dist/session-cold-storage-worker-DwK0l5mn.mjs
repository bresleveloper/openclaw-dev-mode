import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-BKe2aOQN.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { i as prepareTranscriptPayload, s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { n as deleteSessionTranscriptFtsRowsInTransaction, r as selectSessionTranscriptFtsRows, t as createSessionTranscriptFtsInserter } from "./session-transcript-fts-Bc63bcGQ.mjs";
import { r as readSessionColdTranscript } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { r as publishEncodedSessionTranscriptArchive } from "./session-accessor.sqlite-archive-artifact-UkVgkxpH.mjs";
import { n as sqliteSessionStateDeleteSnapshotsEqual, t as readSessionStateDeleteSnapshot } from "./session-accessor.sqlite-delete-snapshot-CZiiDjVP.mjs";
import { t as readSessionColdStorageProtection } from "./session-cold-storage-eligibility-YrRWQ_wC.mjs";
import { n as resolveSessionColdArchivePath, r as sessionColdRecordSchema, t as readVerifiedSessionColdArchive } from "./session-cold-storage-codec-C00cSklo.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import zlib from "node:zlib";
import { pipeline } from "node:stream/promises";
//#region src/config/sessions/session-cold-storage-worker.ts
const MAX_COLD_ARCHIVE_BYTES = 67108864;
async function prepareSessionColdArchiveInWorker(plan, maxBytes) {
	if (!plan.snapshot.generation) throw new Error("Cannot archive a transcript without its generation");
	const directory = path.dirname(resolveSessionColdArchivePath(plan.databaseOptions.path, `${"0".repeat(64)}.jsonl.zst`));
	fs.mkdirSync(directory, {
		recursive: true,
		mode: 448
	});
	const stagePath = path.join(directory, `${randomUUID()}.tmp`);
	const compressedPath = `${stagePath}.zst`;
	let eventCount = 0;
	let rawBytes = 0;
	let stagedBytes = 0;
	try {
		const fd = fs.openSync(stagePath, "wx", 384);
		try {
			let pending = "";
			const write = (record) => {
				const line = `${JSON.stringify(record)}\n`;
				stagedBytes += Buffer.byteLength(line);
				if (stagedBytes > maxBytes) throw new ColdArchiveLimitError();
				pending += line;
				if (pending.length >= 65536) {
					fs.writeSync(fd, pending);
					pending = "";
				}
			};
			if (!withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
				if (!sqliteSessionStateDeleteSnapshotsEqual(readSessionStateDeleteSnapshot(database.db, plan.sessionId), plan.snapshot)) throw new Error("Transcript changed before cold archive preparation");
				const db = getNodeSqliteKysely(database.db);
				write({
					kind: "header",
					version: 1,
					sessionId: plan.sessionId,
					generation: plan.snapshot.generation
				});
				for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select("seq").select(transcriptEventJsonSql(database.db).as("event_json")).select("created_at").where("session_id", "=", plan.sessionId).orderBy("seq"))) {
					eventCount++;
					rawBytes += Buffer.byteLength(row.event_json);
					write({
						kind: "event",
						row
					});
				}
				for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities").select([
					"event_id",
					"seq",
					"event_type",
					"parent_id",
					"message_idempotency_key",
					"created_at"
				]).where("session_id", "=", plan.sessionId).orderBy("seq").orderBy("event_id"))) write({
					kind: "identity",
					row
				});
				for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_transcript_active_events").select([
					"active_position",
					"event_seq",
					"message_position",
					"context_eligible"
				]).where("session_id", "=", plan.sessionId).orderBy("active_position"))) write({
					kind: "active",
					row
				});
				for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_transcript_index_state").select([
					"indexed_seq",
					"leaf_event_id",
					"needs_rebuild",
					"active_event_count",
					"active_message_count",
					"updated_at"
				]).where("session_id", "=", plan.sessionId))) write({
					kind: "index",
					row
				});
				for (const row of iterateSqliteQuerySync(database.db, selectSessionTranscriptFtsRows(database.db, plan.sessionId))) write(sessionColdRecordSchema.parse({
					kind: "fts",
					row
				}));
			}, {
				databaseLabel: database.path,
				operationLabel: "cold transcript snapshot"
			}), plan.databaseOptions).found || eventCount === 0) throw new Error("Cannot archive a missing or empty transcript");
			if (pending) fs.writeSync(fd, pending);
		} finally {
			fs.closeSync(fd);
		}
		await pipeline(fs.createReadStream(stagePath), zlib.createZstdCompress(), fs.createWriteStream(compressedPath, {
			flags: "wx",
			mode: 384
		}));
		const bytes = fs.readFileSync(compressedPath);
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		const archiveName = `${sha256}.jsonl.zst`;
		publishEncodedSessionTranscriptArchive({
			archiveDirectory: directory,
			archiveName,
			bytes,
			sha256
		});
		requireDirectorySync(syncDirectorySync(directory), "Cold archive directory");
		requireDirectorySync(syncDirectorySync(path.dirname(directory)), "Session artifact directory");
		const archive = {
			session_id: plan.sessionId,
			generation: plan.snapshot.generation,
			archive_name: archiveName,
			archive_sha256: sha256,
			archive_bytes: bytes.length,
			event_count: eventCount,
			raw_bytes: rawBytes + eventCount - 1,
			last_seq: plan.snapshot.lastSeq,
			archived_at: Date.now(),
			storage: "file",
			archive_blob: null
		};
		decodeSessionColdRecords(bytes, archive);
		return {
			plan,
			archive,
			envelopeBytes: stagedBytes
		};
	} finally {
		fs.rmSync(stagePath, { force: true });
		fs.rmSync(compressedPath, { force: true });
	}
}
var ColdArchiveLimitError = class extends Error {};
async function prepareExternalization(input, expected, maxBytes) {
	const opened = withOpenClawAgentDatabaseReadOnly((database) => executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_cold_archives").selectAll().where("session_id", "=", expected.session_id)).rows[0], input.databaseOptions);
	const archive = opened.found ? opened.value : void 0;
	if (!archive || archive.storage !== "sqlite" || archive.generation !== expected.generation || archive.archive_sha256 !== expected.archive_sha256) return;
	const bytes = await readVerifiedSessionColdArchive({
		storePath: input.databaseOptions.path,
		archive
	});
	let envelopeBytes;
	try {
		envelopeBytes = zlib.zstdDecompressSync(bytes, { maxOutputLength: maxBytes }).byteLength;
	} catch (error) {
		if (hasErrnoCode(error, "ERR_BUFFER_TOO_LARGE")) throw new ColdArchiveLimitError();
		throw error;
	}
	const directory = path.dirname(resolveSessionColdArchivePath(input.databaseOptions.path, archive.archive_name));
	publishEncodedSessionTranscriptArchive({
		archiveDirectory: directory,
		archiveName: archive.archive_name,
		bytes,
		sha256: archive.archive_sha256
	});
	requireDirectorySync(syncDirectorySync(directory), "Cold archive directory");
	requireDirectorySync(syncDirectorySync(path.dirname(directory)), "Session artifact directory");
	return {
		archive: expected,
		envelopeBytes
	};
}
async function prepareSessionColdBatchInWorker(input) {
	const result = {
		prepared: [],
		externalizations: [],
		oversizedSessionIds: [],
		envelopeBytes: 0
	};
	const maxBytes = Math.min(input.maxBytes, MAX_COLD_ARCHIVE_BYTES);
	const candidates = [...input.externalizations.map((archive) => ({
		kind: "externalize",
		archive
	})), ...input.plans.map((plan) => ({
		kind: "archive",
		plan
	}))];
	for (const candidate of candidates.slice(0, 128)) {
		const remaining = maxBytes - result.envelopeBytes;
		if (remaining <= 0) break;
		try {
			if (candidate.kind === "archive") {
				const prepared = await prepareSessionColdArchiveInWorker(candidate.plan, remaining);
				result.prepared.push(prepared);
				result.envelopeBytes += prepared.envelopeBytes;
			} else {
				const prepared = await prepareExternalization(input, candidate.archive, remaining);
				if (prepared) {
					result.externalizations.push(prepared);
					result.envelopeBytes += prepared.envelopeBytes;
				}
			}
		} catch (error) {
			if (!(error instanceof ColdArchiveLimitError)) throw error;
			if (remaining === MAX_COLD_ARCHIVE_BYTES) result.oversizedSessionIds.push(candidate.kind === "archive" ? candidate.plan.sessionId : candidate.archive.session_id);
			result.envelopeBytes = maxBytes;
			break;
		}
	}
	return result;
}
function decodeSessionColdRecords(bytes, archive) {
	const records = zlib.zstdDecompressSync(bytes, { maxOutputLength: MAX_COLD_ARCHIVE_BYTES }).toString("utf8").trimEnd().split("\n").map((line) => sessionColdRecordSchema.parse(JSON.parse(line)));
	const header = records[0];
	const events = records.filter((record) => record.kind === "event");
	if (header?.kind !== "header" || header.sessionId !== archive.session_id || header.generation !== archive.generation || records.slice(1).some((record) => record.kind === "header") || events.length !== archive.event_count || events.at(-1)?.row.seq !== archive.last_seq || events.reduce((sum, event) => sum + Buffer.byteLength(event.row.event_json), 0) + events.length - 1 !== archive.raw_bytes) throw new Error("Cold transcript archive metadata does not match its contents");
	return records;
}
async function prepareSessionColdRestoreInWorker(plan) {
	const opened = withOpenClawAgentDatabaseReadOnly((database) => executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_cold_archives").selectAll().where("session_id", "=", plan.sessionId)).rows[0], plan.databaseOptions);
	if (!opened.found || !opened.value || opened.value.archive_sha256 !== plan.archive.archive_sha256) throw new Error("Cold transcript changed before restoration");
	const archive = opened.value;
	return decodeSessionColdRecords(await readVerifiedSessionColdArchive({
		storePath: plan.databaseOptions.path,
		archive
	}), archive);
}
function verifyPublishedArchive(storePath, archive) {
	const published = fs.readFileSync(resolveSessionColdArchivePath(storePath, archive.archive_name));
	if (published.length !== archive.archive_bytes || createHash("sha256").update(published).digest("hex") !== archive.archive_sha256) throw new Error("Cold archive changed before publication; its SQLite copy was retained");
}
function mutateSessionColdTranscriptInWorker(plan, records, onCommit) {
	return runOpenClawAgentWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const result = {
			archivedTranscripts: 0,
			externalizedTranscripts: 0,
			restored: false
		};
		if (plan.kind === "cold-maintain") {
			onCommit(database);
			return result;
		}
		if (plan.kind === "cold-batch") {
			const protectedIds = readSessionColdStorageProtection(database, plan.beforeMs);
			const archivedIds = [];
			for (const prepared of plan.prepared) {
				const { sessionId, snapshot } = prepared.plan;
				const fresh = readSessionStateDeleteSnapshot(database.db, sessionId);
				if (readSessionColdTranscript(database.db, sessionId) || protectedIds.has(sessionId) || !sqliteSessionStateDeleteSnapshotsEqual(fresh, snapshot) || fresh.transcriptUpdatedAt === null || fresh.transcriptUpdatedAt >= plan.beforeMs) continue;
				verifyPublishedArchive(plan.databaseOptions.path, prepared.archive);
				executeSqliteQuerySync(database.db, db.insertInto("session_transcript_cold_archives").values(prepared.archive));
				executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", sessionId));
				archivedIds.push(sessionId);
				executeSqliteQuerySync(database.db, db.deleteFrom("session_transcript_index_state").where("session_id", "=", sessionId));
				result.archivedTranscripts++;
			}
			if (archivedIds.length > 0) deleteSessionTranscriptFtsRowsInTransaction(database.db, archivedIds);
			for (const { archive } of plan.externalizations) {
				const current = readSessionColdTranscript(database.db, archive.session_id);
				if (!current || current.storage !== "sqlite" || current.generation !== archive.generation || current.archive_sha256 !== archive.archive_sha256 || current.archive_name !== archive.archive_name) continue;
				verifyPublishedArchive(plan.databaseOptions.path, archive);
				executeSqliteQuerySync(database.db, db.updateTable("session_transcript_cold_archives").set({
					storage: "file",
					archive_blob: null
				}).where("session_id", "=", archive.session_id));
				result.externalizedTranscripts++;
			}
		} else {
			const current = readSessionColdTranscript(database.db, plan.sessionId);
			if (!current) return result;
			if (current.generation !== plan.archive.generation || current.archive_sha256 !== plan.archive.archive_sha256 || !records) throw new Error("Cold transcript changed during restoration");
			const session_id = plan.sessionId;
			const insertFts = createSessionTranscriptFtsInserter(database.db, session_id);
			for (const record of records) switch (record.kind) {
				case "header": break;
				case "event":
					executeSqliteQuerySync(database.db, db.insertInto("transcript_events").values({
						session_id,
						seq: record.row.seq,
						created_at: record.row.created_at,
						...prepareTranscriptPayload(database.db, record.row.event_json)
					}));
					break;
				case "identity":
					executeSqliteQuerySync(database.db, db.insertInto("transcript_event_identities").values({
						session_id,
						...record.row
					}));
					break;
				case "active":
					executeSqliteQuerySync(database.db, db.insertInto("session_transcript_active_events").values({
						session_id,
						...record.row
					}));
					break;
				case "index":
					executeSqliteQuerySync(database.db, db.insertInto("session_transcript_index_state").values({
						session_id,
						...record.row
					}));
					break;
				case "fts": insertFts({
					messageId: record.row.message_id,
					text: record.row.text,
					role: record.row.role,
					timestamp: record.row.timestamp
				});
			}
			executeSqliteQuerySync(database.db, db.deleteFrom("session_transcript_cold_archives").where("session_id", "=", session_id));
			result.restored = true;
		}
		onCommit(database);
		return result;
	}, plan.databaseOptions, { operationLabel: "session cold storage" });
}
//#endregion
export { mutateSessionColdTranscriptInWorker, prepareSessionColdBatchInWorker, prepareSessionColdRestoreInWorker };
