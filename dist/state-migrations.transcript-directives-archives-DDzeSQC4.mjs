import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { r as replaceFileAtomicSync } from "./replace-file-DJtj9VLX.mjs";
import { _ as encodeSessionArchiveContent, g as decodeSessionArchiveBytes } from "./artifacts-C9weQ_MG.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { r as assertAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
import { f as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { k as applyAssistantDeliveryDirectives } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { i as replaceOutsideCodeRegions } from "./directive-tags-D9uZSb5h.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/infra/state-migrations.transcript-directives-transform.ts
const LEGACY_REACTION_DIRECTIVE_RE = /\[\[\s*(?:react|react_to_current)\s*:\s*([^\]\n]+?)\s*\]\]/giu;
function stripLegacyReactionDirectives(message) {
	if (!Array.isArray(message.content)) return;
	for (const part of message.content) {
		if (!isRecord(part) || part.type !== "text" || typeof part.text !== "string") continue;
		let changed = false;
		const stripped = replaceOutsideCodeRegions(part.text, LEGACY_REACTION_DIRECTIVE_RE, () => {
			changed = true;
			return "";
		});
		if (changed) part.text = stripped.trimStart();
	}
}
function transformHistoricalTranscriptEvent(event) {
	if (!isRecord(event) || event.type !== "message" || !isRecord(event.message) || event.message.role !== "assistant" || !Array.isArray(event.message.content)) return {
		changed: false,
		event
	};
	const before = JSON.stringify(event.message);
	stripLegacyReactionDirectives(event.message);
	applyAssistantDeliveryDirectives(event.message);
	return {
		changed: JSON.stringify(event.message) !== before,
		event
	};
}
function parseTranscriptEvent(raw, owner) {
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw new Error(`${owner} contains invalid transcript JSON`, { cause: error });
	}
}
function transformArchiveContent(content, owner) {
	if (!content) return {
		changed: false,
		content
	};
	const trailingNewline = content.endsWith("\n");
	const lines = trailingNewline ? content.slice(0, -1).split("\n") : content.split("\n");
	let changed = false;
	const rewritten = lines.map((line, index) => {
		if (!line) throw new Error(`${owner} contains a blank JSONL record at line ${index + 1}`);
		const transformed = transformHistoricalTranscriptEvent(parseTranscriptEvent(line, `${owner}:${index + 1}`));
		changed ||= transformed.changed;
		return transformed.changed ? JSON.stringify(transformed.event) : line;
	});
	return {
		changed,
		content: `${rewritten.join("\n")}${trailingNewline ? "\n" : ""}`
	};
}
function encodeArchiveContent(content, encoding, owner) {
	if (encoding === "identity") return Buffer.from(content, "utf8");
	const encoded = encodeSessionArchiveContent(content);
	if (encoded.suffix !== ".zst") throw new Error(`${owner} could not be re-encoded with its zstd codec`);
	return encoded.bytes;
}
function readArchiveEncoding(value, owner) {
	if (value === "identity" || value === "zstd") return value;
	throw new Error(`${owner} has unsupported transcript archive encoding ${value}`);
}
function listArchiveBatch(database, cursor, transformContent = transformArchiveContent) {
	if (!database.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get("session_transcript_archives")) return [];
	let query = getNodeSqliteKysely(database).selectFrom("session_transcript_archives").select([
		"archive_blob",
		"archive_name",
		"archive_sha256",
		"encoding",
		"generation",
		"published_at",
		"session_id"
	]).orderBy("session_id", "asc").orderBy("generation", "asc").limit(32);
	if (cursor.sessionId) query = query.where((eb) => eb(eb.refTuple("session_id", "generation"), ">", eb.tuple(cursor.sessionId, cursor.generation)));
	return executeSqliteQuerySync(database, query).rows.map((row) => {
		const owner = `${row.session_id}:${row.generation}`;
		const encoding = readArchiveEncoding(row.encoding, owner);
		const bytes = Buffer.from(row.archive_blob);
		if (createHash("sha256").update(bytes).digest("hex") !== row.archive_sha256) throw new Error(`Canonical SQLite transcript archive is corrupt for ${row.session_id}`);
		const transformed = transformContent(decodeSessionArchiveBytes(bytes, encoding === "zstd"), owner);
		const nextBytes = transformed.changed ? encodeArchiveContent(transformed.content, encoding, owner) : bytes;
		return {
			archiveName: row.archive_name,
			archiveSha256: row.archive_sha256,
			bytes,
			changed: transformed.changed,
			encoding,
			generation: row.generation,
			nextBytes,
			nextSha256: createHash("sha256").update(nextBytes).digest("hex"),
			publishedAt: row.published_at,
			sessionId: row.session_id
		};
	});
}
function transcriptDirectiveArchivesNeedMigration(database, start) {
	let cursor = start;
	while (true) {
		const batch = listArchiveBatch(database, cursor);
		if (batch.length === 0) return false;
		if (batch.some((planned) => planned.changed)) return true;
		const last = batch.at(-1);
		if (!last) return false;
		cursor = {
			generation: last.generation,
			sessionId: last.sessionId
		};
	}
}
function assertArchiveSourceUnchanged(database, planned) {
	const db = getNodeSqliteKysely(database);
	const current = executeSqliteQueryTakeFirstSync(database, db.selectFrom("session_transcript_archives").select([
		"archive_blob",
		"archive_name",
		"archive_sha256",
		"encoding"
	]).where("session_id", "=", planned.sessionId).where("generation", "=", planned.generation));
	if (!current) return false;
	if (current.archive_name !== planned.archiveName || current.archive_sha256 !== planned.archiveSha256 || current.encoding !== planned.encoding || !Buffer.from(current.archive_blob).equals(planned.bytes)) throw new Error(`Transcript archive source changed before migration commit for ${planned.sessionId}`);
	return true;
}
function rewriteArchiveRow(database, planned) {
	if (!assertArchiveSourceUnchanged(database, planned)) return false;
	if (!planned.changed) return true;
	const db = getNodeSqliteKysely(database);
	if (executeSqliteQuerySync(database, db.updateTable("session_transcript_archives").set({
		archive_blob: planned.nextBytes,
		archive_sha256: planned.nextSha256,
		published_at: null
	}).where("session_id", "=", planned.sessionId).where("generation", "=", planned.generation).where("archive_sha256", "=", planned.archiveSha256)).numAffectedRows !== 1n) throw new Error(`Transcript archive changed before rewrite for ${planned.sessionId}`);
	return true;
}
function repairPublishedArchiveFile(params) {
	const archiveDirectory = path.resolve(params.archiveDirectory);
	const archivePath = path.resolve(archiveDirectory, params.planned.archiveName);
	if (path.dirname(archivePath) !== archiveDirectory || path.basename(archivePath) !== params.planned.archiveName) throw new Error(`Cannot migrate transcript archive outside ${archiveDirectory}`);
	if (!fs.existsSync(archivePath)) return false;
	if (createHash("sha256").update(fs.readFileSync(archivePath)).digest("hex") === params.planned.nextSha256) return true;
	assertAgentDatabaseMaintenanceAuthority();
	replaceFileAtomicSync({
		beforeRename: ({ tempPath }) => {
			if (createHash("sha256").update(fs.readFileSync(tempPath)).digest("hex") !== params.planned.nextSha256) throw new Error(`Transcript archive staging verification failed for ${archivePath}`);
			assertAgentDatabaseMaintenanceAuthority();
		},
		content: params.planned.nextBytes,
		filePath: archivePath,
		preserveExistingMode: true,
		syncParentDir: true,
		syncTempFile: true,
		tempPrefix: `${path.basename(archivePath)}.directive-migration`
	});
	if (createHash("sha256").update(fs.readFileSync(archivePath)).digest("hex") !== params.planned.nextSha256) throw new Error(`Transcript archive verification failed for ${archivePath}`);
	return true;
}
function finalizeArchiveCursor(params) {
	const db = getNodeSqliteKysely(params.database);
	const current = executeSqliteQueryTakeFirstSync(params.database, db.selectFrom("session_transcript_archives").select(["archive_blob", "archive_sha256"]).where("session_id", "=", params.planned.sessionId).where("generation", "=", params.planned.generation));
	if (current) {
		if (current.archive_sha256 !== params.planned.nextSha256 || !Buffer.from(current.archive_blob).equals(params.planned.nextBytes)) throw new Error(`Transcript archive changed before migration commit for ${params.planned.sessionId}`);
		if (params.planned.changed && params.planned.publishedAt !== null && params.fileCurrent) executeSqliteQuerySync(params.database, db.updateTable("session_transcript_archives").set({ published_at: params.planned.publishedAt }).where("session_id", "=", params.planned.sessionId).where("generation", "=", params.planned.generation).where("archive_sha256", "=", params.planned.nextSha256));
	}
	params.writeCursor({
		generation: params.planned.generation,
		sessionId: params.planned.sessionId
	});
}
/** Repairs canonical blobs before their reconstructible files under maintenance authority. */
async function migrateCanonicalTranscriptArchives(params) {
	let rewrittenArchives = 0;
	let cursor = params.start;
	const archiveDirectory = resolveSqliteTranscriptArchiveDirectory({
		agentId: params.agentId,
		path: params.pathname
	});
	while (true) {
		const batch = listArchiveBatch(params.database, cursor, params.transformContent);
		if (batch.length === 0) {
			runSqliteImmediateTransactionSync(params.database, () => {
				assertAgentDatabaseMaintenanceAuthority();
				params.writeCursor({ phase: "complete" });
				assertAgentDatabaseMaintenanceAuthority();
			});
			return rewrittenArchives;
		}
		for (const planned of batch) {
			params.onArchive?.(path.resolve(archiveDirectory, planned.archiveName));
			const rowPresent = runSqliteImmediateTransactionSync(params.database, () => {
				assertAgentDatabaseMaintenanceAuthority();
				const currentRowPresent = rewriteArchiveRow(params.database, planned);
				assertAgentDatabaseMaintenanceAuthority();
				return currentRowPresent;
			}, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: params.pathname,
				operationLabel: "historical-transcript-archive-directives"
			});
			const fileCurrent = rowPresent ? repairPublishedArchiveFile({
				archiveDirectory,
				planned
			}) : false;
			runSqliteImmediateTransactionSync(params.database, () => {
				assertAgentDatabaseMaintenanceAuthority();
				finalizeArchiveCursor({
					database: params.database,
					fileCurrent,
					planned,
					writeCursor: params.writeCursor
				});
				assertAgentDatabaseMaintenanceAuthority();
			}, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: params.pathname,
				operationLabel: "historical-transcript-archive-cursor"
			});
			rewrittenArchives += planned.changed && rowPresent ? 1 : 0;
			cursor = {
				generation: planned.generation,
				sessionId: planned.sessionId
			};
		}
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
	}
}
function migrateTranscriptDirectiveArchives(params) {
	return migrateCanonicalTranscriptArchives({
		...params,
		transformContent: transformArchiveContent
	});
}
//#endregion
export { transformHistoricalTranscriptEvent as i, migrateTranscriptDirectiveArchives as n, transcriptDirectiveArchivesNeedMigration as r, migrateCanonicalTranscriptArchives as t };
