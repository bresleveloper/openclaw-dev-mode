import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { h as withPreparedSqliteSnapshot } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { c as resolveSqliteInspectionSignal } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-BPapZs5n.mjs";
import { t as SESSION_TRANSCRIPT_ARCHIVES_TABLE } from "./openclaw-agent-session-transcript-archive-schema-DeVxJLCy.mjs";
import { _ as encodeSessionArchiveContent, g as decodeSessionArchiveBytes } from "./artifacts-BvSTVPj-.mjs";
import "./openclaw-state-db-D1jWDzK3.mjs";
import { _ as renewAgentDatabaseMaintenanceAuthorityIfPresent, r as assertAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { r as canonicalizePersistedUserMessageMedia } from "./media-facts-CJdQ4R61.mjs";
import { l as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as replaceOutsideCodeRegions } from "./directive-tags-CHfxUaYi.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { t as formatMigrationWarningSummary } from "./migration-warning-summary-BEnlm-gl.mjs";
import fs from "node:fs";
import path from "node:path";
import { replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
//#region src/infra/state-migrations.media-persistence-transform.ts
function transformTranscriptEvent(event) {
	if (!isRecord(event) || event.type !== "message" || !isRecord(event.message)) return {
		changed: false,
		event
	};
	const canonical = canonicalizePersistedUserMessageMedia(event.message);
	return canonical.changed ? {
		changed: true,
		event: {
			...event,
			message: canonical.message
		}
	} : {
		changed: false,
		event
	};
}
function parseTranscriptEvent(raw, owner) {
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw new Error(`${owner} contains invalid transcript JSON: ${String(error)}`, { cause: error });
	}
}
function parseArchiveContent(content, filePath) {
	if (content === "") return [];
	return (content.endsWith("\n") ? content.slice(0, -1).split("\n") : content.split("\n")).map((line, index) => {
		if (!line) throw new Error(`${filePath} contains a blank JSONL record at line ${index + 1}`);
		return parseTranscriptEvent(line, `${filePath}:${index + 1}`);
	});
}
function serializeArchiveEvents(events, trailingNewline) {
	return `${events.map((event) => JSON.stringify(event)).join("\n")}${trailingNewline ? "\n" : ""}`;
}
function transformMediaArchiveContent(content, filePath) {
	let nulTailStart = content.length;
	while (nulTailStart > 0 && content.charCodeAt(nulTailStart - 1) === 0) nulTailStart -= 1;
	const hasTerminalNulSuffix = nulTailStart < content.length;
	if (hasTerminalNulSuffix && nulTailStart === 0) throw new Error(`${filePath} contains no JSONL records before its terminal NUL suffix`);
	const recoveredContent = hasTerminalNulSuffix ? content.slice(0, nulTailStart) : content;
	const events = parseArchiveContent(recoveredContent, filePath);
	let mediaChanged = false;
	const transformed = events.map((event) => {
		const result = transformTranscriptEvent(event);
		mediaChanged ||= result.changed;
		return result.event;
	});
	if (!hasTerminalNulSuffix && !mediaChanged) return {
		changed: false,
		content
	};
	return {
		changed: true,
		content: mediaChanged ? serializeArchiveEvents(transformed, recoveredContent.endsWith("\n")) : recoveredContent
	};
}
//#endregion
//#region src/infra/state-migrations.transcript-archive-publication.ts
const TRANSCRIPT_ARCHIVE_RECOVERY_KEY = "historical-canonical-transcript-archive-recovery-v1";
function transcriptArchivePathFor(archiveDirectory, archiveName) {
	const archivePath = path.resolve(archiveDirectory, archiveName);
	if (path.dirname(archivePath) !== path.resolve(archiveDirectory) || path.basename(archivePath) !== archiveName) throw new Error(`Cannot migrate transcript archive outside ${archiveDirectory}`);
	return archivePath;
}
function transcriptArchiveFingerprint(archivePath, sha256, encoding) {
	let stat;
	try {
		stat = fs.statSync(archivePath, {
			bigint: true,
			throwIfNoEntry: false
		});
	} catch {
		return;
	}
	return sha256Hex(JSON.stringify([
		VERSION,
		archivePath,
		sha256,
		encoding,
		stat ? [
			stat.dev,
			stat.ino,
			stat.size,
			stat.mtimeNs,
			stat.ctimeNs
		].map(String) : null
	]));
}
function transcriptArchiveRecoveryRowKey(row) {
	return `${row.sessionId}\u0000${row.generation}`;
}
function readTranscriptArchiveRecoveryJournal(database) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("schema_meta").select("app_version").where("meta_key", "=", TRANSCRIPT_ARCHIVE_RECOVERY_KEY));
	if (!row) return;
	let parsed;
	try {
		parsed = JSON.parse(row.app_version ?? "");
	} catch {
		throw new Error("Invalid transcript archive recovery journal");
	}
	if (!isRecord(parsed) || !Array.isArray(parsed.rows) || parsed.rows.length === 0 || !parsed.rows.every((entry) => isRecord(entry) && typeof entry.sessionId === "string" && typeof entry.generation === "string" && typeof entry.nextSha256 === "string" && typeof entry.publishedAt === "number")) throw new Error("Invalid transcript archive recovery journal");
	return { rows: parsed.rows.map((entry) => ({
		sessionId: entry.sessionId,
		generation: entry.generation,
		nextSha256: entry.nextSha256,
		publishedAt: entry.publishedAt
	})) };
}
function writeTranscriptArchiveRecoveryJournal(database, agentId, rows) {
	const now = Date.now();
	const appVersion = JSON.stringify({ rows });
	const db = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, db.insertInto("schema_meta").values({
		agent_id: agentId,
		app_version: appVersion,
		created_at: now,
		meta_key: TRANSCRIPT_ARCHIVE_RECOVERY_KEY,
		role: "agent",
		schema_version: 1,
		updated_at: now
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
		agent_id: agentId,
		app_version: appVersion,
		updated_at: now
	})));
}
function clearTranscriptArchiveRecoveryJournal(database) {
	const db = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, db.deleteFrom("schema_meta").where("meta_key", "=", TRANSCRIPT_ARCHIVE_RECOVERY_KEY));
}
function repairPublishedTranscriptArchive(params) {
	params.signal?.throwIfAborted();
	const archivePath = transcriptArchivePathFor(path.resolve(params.archiveDirectory), params.planned.archiveName);
	const fingerprint = () => params.planned.encoding ? transcriptArchiveFingerprint(archivePath, params.planned.nextSha256, params.planned.encoding) : void 0;
	const before = fingerprint();
	if (!fs.existsSync(archivePath)) {
		params.planned.fingerprint = before;
		return false;
	}
	if (before !== void 0 && params.planned.fingerprint === before) return true;
	if (sha256Hex(fs.readFileSync(archivePath)) === params.planned.nextSha256) {
		params.planned.fingerprint = fingerprint() === before ? before : void 0;
		return true;
	}
	if (params.verifyOnly) {
		params.planned.fingerprint = void 0;
		return false;
	}
	params.signal?.throwIfAborted();
	assertAgentDatabaseMaintenanceAuthority();
	replaceFileAtomicSync({
		beforeRename: ({ tempPath }) => {
			if (sha256Hex(fs.readFileSync(tempPath)) !== params.planned.nextSha256) throw new Error(`Transcript archive staging verification failed for ${archivePath}`);
			params.signal?.throwIfAborted();
			assertAgentDatabaseMaintenanceAuthority();
		},
		content: params.planned.nextBytes,
		filePath: archivePath,
		preserveExistingMode: true,
		syncParentDir: true,
		syncTempFile: true,
		tempPrefix: `${path.basename(archivePath)}.directive-migration`
	});
	const published = fingerprint();
	if (sha256Hex(fs.readFileSync(archivePath)) !== params.planned.nextSha256) throw new Error(`Transcript archive verification failed for ${archivePath}`);
	params.planned.fingerprint = fingerprint() === published ? published : void 0;
	params.signal?.throwIfAborted();
	return true;
}
async function recoverTranscriptArchivePublication(params) {
	const journal = readTranscriptArchiveRecoveryJournal(params.database);
	if (!journal) return [];
	const db = getNodeSqliteKysely(params.database);
	const unresolved = [];
	const missingCopyExamples = [];
	for (let offset = 0; offset < journal.rows.length; offset += 32) {
		const batch = journal.rows.slice(offset, offset + 32);
		const ready = [];
		const batchUnresolved = [];
		for (const recorded of batch) {
			params.signal?.throwIfAborted();
			const row = executeSqliteQueryTakeFirstSync(params.database, db.selectFrom("session_transcript_archives").select([
				"archive_blob",
				"archive_name",
				"archive_sha256",
				"published_at"
			]).where("session_id", "=", recorded.sessionId).where("generation", "=", recorded.generation));
			if (!row || row.archive_sha256 !== recorded.nextSha256 || row.published_at !== null) continue;
			const nextBytes = Buffer.from(row.archive_blob);
			const archivePath = transcriptArchivePathFor(params.archiveDirectory, row.archive_name);
			if (sha256Hex(nextBytes) !== recorded.nextSha256) throw new Error(`Canonical SQLite transcript archive is corrupt: ${archivePath} (${recorded.sessionId}:${recorded.generation})`);
			params.onArchive?.(archivePath);
			if (repairPublishedTranscriptArchive({
				archiveDirectory: params.archiveDirectory,
				planned: {
					archiveName: row.archive_name,
					nextBytes,
					nextSha256: recorded.nextSha256
				},
				signal: params.signal
			})) ready.push(recorded);
			else {
				batchUnresolved.push(recorded);
				if (missingCopyExamples.length < 5) missingCopyExamples.push(`Missing canonical transcript archive copy: ${archivePath}`);
			}
		}
		const remaining = journal.rows.slice(offset + batch.length);
		runSqliteImmediateTransactionSync(params.database, () => {
			params.signal?.throwIfAborted();
			assertAgentDatabaseMaintenanceAuthority();
			for (const recorded of ready) executeSqliteQuerySync(params.database, db.updateTable("session_transcript_archives").set({ published_at: recorded.publishedAt }).where("session_id", "=", recorded.sessionId).where("generation", "=", recorded.generation).where("archive_sha256", "=", recorded.nextSha256).where("published_at", "is", null));
			const pending = [
				...unresolved,
				...batchUnresolved,
				...remaining
			];
			if (pending.length > 0) writeTranscriptArchiveRecoveryJournal(params.database, params.agentId, pending);
			else clearTranscriptArchiveRecoveryJournal(params.database);
			params.signal?.throwIfAborted();
			assertAgentDatabaseMaintenanceAuthority();
		}, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: params.pathname,
			operationLabel: "historical-transcript-archive-recovery"
		});
		unresolved.push(...batchUnresolved);
		if (remaining.length > 0) await new Promise((resolve) => {
			setImmediate(resolve);
		});
	}
	return unresolved.length > 0 ? [formatMigrationWarningSummary({
		summary: `${params.pathname}: Missing ${unresolved.length} canonical transcript archive file(s)`,
		count: unresolved.length,
		detail: "Canonical SQLite archive blobs remain retained. Migration completed without recreating the missing copies."
	}), ...missingCopyExamples] : [];
}
async function recoverPendingTranscriptArchivePublication(params) {
	return recoverTranscriptArchivePublication({
		...params,
		archiveDirectory: resolveSqliteTranscriptArchiveDirectory({
			agentId: params.agentId,
			path: params.pathname
		})
	});
}
//#endregion
//#region src/infra/state-migrations.transcript-directives-transform.ts
const LEGACY_REACTION_DIRECTIVE_RE = /\[\[\s*(?:react|react_to_current)\s*:\s*([^\]\n]+?)\s*\]\]/giu;
function parseDirectiveMigrationTranscriptEvent(raw, owner) {
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw new Error(`${owner} contains invalid transcript JSON`, { cause: error });
	}
}
function transformHistoricalTranscriptEvent(event) {
	if (!isRecord(event) || event.type !== "message" || !isRecord(event.message) || event.message.role !== "assistant" || !Array.isArray(event.message.content)) return {
		changed: false,
		event
	};
	const before = JSON.stringify(event.message);
	for (const part of event.message.content) {
		if (!isRecord(part) || part.type !== "text" || typeof part.text !== "string") continue;
		let changed = false;
		const stripped = replaceOutsideCodeRegions(part.text, LEGACY_REACTION_DIRECTIVE_RE, () => {
			changed = true;
			return "";
		});
		if (changed) part.text = stripped.trimStart();
	}
	applyAssistantDeliveryDirectives(event.message);
	return {
		changed: JSON.stringify(event.message) !== before,
		event
	};
}
//#endregion
//#region src/infra/state-migrations.transcript-directives-archives.ts
const TRANSCRIPT_DIRECTIVE_MIGRATION_BATCH_SIZE = 32;
const MEDIA_ARCHIVE_VERIFICATION_KEY = "media-transcript-archive-verification-v1";
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
		const transformed = transformHistoricalTranscriptEvent(parseDirectiveMigrationTranscriptEvent(line, `${owner}:${index + 1}`));
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
function hasArchiveTable(database) {
	return Boolean(database.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get(SESSION_TRANSCRIPT_ARCHIVES_TABLE));
}
function listArchiveBatch(database, cursor, transformContent = transformArchiveContent, options) {
	let query = getNodeSqliteKysely(database).selectFrom("session_transcript_archives").select([
		"archive_blob",
		"archive_name",
		"archive_sha256",
		"encoding",
		"generation",
		"published_at",
		"session_id"
	]).orderBy("session_id", "asc").orderBy("generation", "asc").limit(TRANSCRIPT_DIRECTIVE_MIGRATION_BATCH_SIZE);
	if (cursor) query = query.where((eb) => eb(eb.refTuple("session_id", "generation"), ">", eb.tuple(cursor.sessionId, cursor.generation)));
	return executeSqliteQuerySync(database, query).rows.map((row) => {
		const owner = `${row.session_id}:${row.generation}`;
		const archivePath = options ? transcriptArchivePathFor(options.archiveDirectory, row.archive_name) : row.archive_name;
		try {
			options?.signal?.throwIfAborted();
			const encoding = readArchiveEncoding(row.encoding, owner);
			const bytes = Buffer.from(row.archive_blob);
			if (sha256Hex(bytes) !== row.archive_sha256) throw new Error("Canonical SQLite transcript archive is corrupt");
			const fingerprint = options ? transcriptArchiveFingerprint(archivePath, row.archive_sha256, encoding) : void 0;
			const verified = fingerprint !== void 0 && options?.verified?.has(fingerprint) === true;
			const transformed = verified ? void 0 : transformContent(decodeSessionArchiveBytes(bytes, encoding === "zstd"), owner);
			options?.signal?.throwIfAborted();
			const nextBytes = transformed?.changed ? encodeArchiveContent(transformed.content, encoding, owner) : bytes;
			return {
				archiveName: row.archive_name,
				archiveSha256: row.archive_sha256,
				bytes,
				changed: transformed?.changed === true,
				encoding,
				generation: row.generation,
				nextBytes,
				nextSha256: sha256Hex(nextBytes),
				publishedAt: row.published_at,
				sessionId: row.session_id,
				fingerprint: verified ? fingerprint : void 0
			};
		} catch (error) {
			if (options?.signal?.aborted && error === options.signal.reason) throw error;
			const detail = error instanceof Error ? error.message : String(error);
			throw new Error(`Failed migrating transcript archive ${archivePath} (${owner}): ${detail}`, { cause: error });
		}
	});
}
async function transcriptDirectiveArchivesNeedMigration(database, start) {
	const signal = resolveSqliteInspectionSignal();
	signal?.throwIfAborted();
	if (!hasArchiveTable(database)) return false;
	if (readTranscriptArchiveRecoveryJournal(database)) return true;
	let cursor = start.sessionId || start.generation ? start : void 0;
	while (true) {
		signal?.throwIfAborted();
		const batch = listArchiveBatch(database, cursor);
		const last = batch.at(-1);
		if (!last) return false;
		if (batch.some((planned) => planned.changed)) return true;
		cursor = {
			generation: last.generation,
			sessionId: last.sessionId
		};
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
	}
}
function transcriptDirectiveArchiveRecoveryPending(database) {
	return readTranscriptArchiveRecoveryJournal(database) !== void 0;
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
function finalizeArchiveCursor(params) {
	const db = getNodeSqliteKysely(params.database);
	const current = executeSqliteQueryTakeFirstSync(params.database, db.selectFrom("session_transcript_archives").select(["archive_blob", "archive_sha256"]).where("session_id", "=", params.planned.sessionId).where("generation", "=", params.planned.generation));
	if (current) {
		if (current.archive_sha256 !== params.planned.nextSha256 || !Buffer.from(current.archive_blob).equals(params.planned.nextBytes)) throw new Error(`Transcript archive changed before migration commit for ${params.planned.sessionId}`);
		const publishedAt = params.planned.publishedAt ?? params.recoveredPublishedAt;
		if ((params.planned.changed || params.recoveredPublishedAt !== void 0) && publishedAt !== void 0 && params.fileCurrent) executeSqliteQuerySync(params.database, db.updateTable("session_transcript_archives").set({ published_at: publishedAt }).where("session_id", "=", params.planned.sessionId).where("generation", "=", params.planned.generation).where("archive_sha256", "=", params.planned.nextSha256));
	}
	params.writeCursor?.({
		generation: params.planned.generation,
		sessionId: params.planned.sessionId
	});
}
/** Repairs canonical blobs before their reconstructible files under maintenance authority. */
async function migrateCanonicalTranscriptArchives(params) {
	const signal = resolveSqliteInspectionSignal(params.signal);
	signal?.throwIfAborted();
	let rewrittenArchives = 0;
	let cursor = params.start.sessionId || params.start.generation ? params.start : void 0;
	const archivesPresent = hasArchiveTable(params.database);
	const db = getNodeSqliteKysely(params.database);
	const verificationKey = params.verification?.key;
	const previousVerification = verificationKey ? executeSqliteQueryTakeFirstSync(params.database, db.selectFrom("schema_meta").select("app_version").where("meta_key", "=", verificationKey))?.app_version ?? "" : "";
	const verified = /* @__PURE__ */ new Set([...previousVerification.split("\n"), ...params.verification?.prepared ?? []]);
	const observed = /* @__PURE__ */ new Set();
	const archiveDirectory = resolveSqliteTranscriptArchiveDirectory({
		agentId: params.agentId,
		path: params.pathname
	});
	const recoveryWarnings = params.verifyOnly ? [] : await recoverTranscriptArchivePublication({
		agentId: params.agentId,
		archiveDirectory,
		database: params.database,
		onArchive: params.onArchive,
		pathname: params.pathname,
		signal
	});
	const write = (operationLabel, operation) => runSqliteImmediateTransactionSync(params.database, () => {
		signal?.throwIfAborted();
		assertAgentDatabaseMaintenanceAuthority();
		const result = operation();
		signal?.throwIfAborted();
		assertAgentDatabaseMaintenanceAuthority();
		return result;
	}, {
		busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
		databaseLabel: params.pathname,
		operationLabel
	});
	const checkpoint = params.verifyOnly ? void 0 : params.writeCursor;
	let missingCopies = 0;
	const missingCopyExamples = [];
	while (true) {
		signal?.throwIfAborted();
		if (!params.verifyOnly) renewAgentDatabaseMaintenanceAuthorityIfPresent();
		const batch = archivesPresent ? listArchiveBatch(params.database, cursor, params.transformContent, {
			archiveDirectory,
			signal,
			verified
		}) : [];
		if (batch.length === 0) {
			if (checkpoint) write("historical-transcript-archive.complete", () => checkpoint({ phase: "complete" }));
			const verificationReceipt = [...observed].toSorted().join("\n");
			if (verificationKey && !params.verifyOnly && verificationReceipt !== previousVerification) write("transcript-archive-verification.record", () => {
				const now = Date.now();
				executeSqliteQuerySync(params.database, db.insertInto("schema_meta").values({
					meta_key: verificationKey,
					role: "agent",
					agent_id: params.agentId,
					schema_version: 1,
					app_version: verificationReceipt,
					created_at: now,
					updated_at: now
				}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
					app_version: verificationReceipt,
					updated_at: now
				})));
			});
			return {
				rewrittenArchives,
				warnings: [.../* @__PURE__ */ new Set([...recoveryWarnings, ...missingCopies > 0 ? [formatMigrationWarningSummary({
					summary: `${params.pathname}: Missing ${missingCopies} canonical transcript archive file(s)`,
					count: missingCopies,
					detail: "Canonical SQLite archive blobs remain retained. Migration completed without recreating the missing copies."
				}), ...missingCopyExamples] : []])]
			};
		}
		let current = batch[0];
		try {
			for (const planned of batch) {
				current = planned;
				params.onArchive?.(transcriptArchivePathFor(archiveDirectory, planned.archiveName));
			}
			signal?.throwIfAborted();
			const needsRewrite = batch.some((planned) => planned.changed);
			const rowsPresent = params.verifyOnly || !needsRewrite ? batch.map((planned) => {
				current = planned;
				return !planned.changed && assertArchiveSourceUnchanged(params.database, planned);
			}) : write("historical-transcript-archive-directives", () => {
				const pending = new Map((readTranscriptArchiveRecoveryJournal(params.database)?.rows ?? []).map((row) => [transcriptArchiveRecoveryRowKey(row), row]));
				const result = batch.map((planned) => {
					current = planned;
					return rewriteArchiveRow(params.database, planned);
				});
				let receiptsChanged = false;
				for (const [index, planned] of batch.entries()) {
					if (!result[index] || !planned.changed) continue;
					const key = transcriptArchiveRecoveryRowKey(planned);
					const prior = pending.get(key);
					const publishedAt = planned.publishedAt ?? (prior?.nextSha256 === planned.archiveSha256 ? prior.publishedAt : null);
					if (publishedAt === null) continue;
					pending.set(key, {
						generation: planned.generation,
						nextSha256: planned.nextSha256,
						publishedAt,
						sessionId: planned.sessionId
					});
					receiptsChanged = true;
				}
				if (receiptsChanged) writeTranscriptArchiveRecoveryJournal(params.database, params.agentId, [...pending.values()]);
				return result;
			});
			const filesCurrent = batch.map((planned, index) => {
				current = planned;
				const archivePath = transcriptArchivePathFor(archiveDirectory, planned.archiveName);
				let fileCurrent;
				try {
					fileCurrent = rowsPresent[index] ? repairPublishedTranscriptArchive({
						archiveDirectory,
						planned,
						signal,
						verifyOnly: params.verifyOnly
					}) : false;
				} catch (error) {
					if (signal?.aborted && error === signal.reason) throw error;
					const detail = error instanceof Error ? error.message : String(error);
					throw new Error(`Failed publishing transcript archive ${archivePath}: ${detail}`, { cause: error });
				}
				if (rowsPresent[index] && !planned.changed) assertArchiveSourceUnchanged(params.database, planned);
				if (rowsPresent[index] && !fileCurrent) {
					missingCopies += 1;
					if (missingCopyExamples.length < 5) missingCopyExamples.push(`Missing canonical transcript archive copy: ${archivePath}`);
				}
				if (rowsPresent[index] && planned.fingerprint) {
					observed.add(planned.fingerprint);
					params.verification?.collect?.add(planned.fingerprint);
				}
				return fileCurrent;
			});
			if (!params.verifyOnly && (needsRewrite || checkpoint)) write("historical-transcript-archive-cursor", () => {
				const journal = readTranscriptArchiveRecoveryJournal(params.database);
				const pending = new Map((journal?.rows ?? []).map((row) => [transcriptArchiveRecoveryRowKey(row), row]));
				for (const [index, planned] of batch.entries()) {
					current = planned;
					const key = transcriptArchiveRecoveryRowKey(planned);
					const recorded = pending.get(key);
					const fileCurrent = filesCurrent[index] === true;
					finalizeArchiveCursor({
						database: params.database,
						fileCurrent,
						planned,
						recoveredPublishedAt: recorded?.nextSha256 === planned.nextSha256 ? recorded.publishedAt : void 0,
						writeCursor: checkpoint
					});
					if (!rowsPresent[index] || fileCurrent && recorded?.nextSha256 === planned.nextSha256) pending.delete(key);
				}
				if (pending.size > 0) writeTranscriptArchiveRecoveryJournal(params.database, params.agentId, [...pending.values()]);
				else if (journal) clearTranscriptArchiveRecoveryJournal(params.database);
			});
			rewrittenArchives += batch.filter((planned, index) => planned.changed && rowsPresent[index]).length;
			const last = batch.at(-1);
			cursor = {
				generation: last.generation,
				sessionId: last.sessionId
			};
		} catch (error) {
			if (signal?.aborted && error === signal.reason) throw error;
			throw new Error(`Transcript archive migration failed for ${params.pathname} at ${current.sessionId}:${current.generation}: ${String(error)}`, { cause: error });
		}
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		signal?.throwIfAborted();
	}
}
/** Read and transform retained archives before Doctor stops the managed writer. */
async function prepareCanonicalTranscriptArchiveMigrations(discovery) {
	const prepared = /* @__PURE__ */ new Set();
	discovery.preparedTranscriptArchives = prepared;
	for (const target of discovery.discovery.targets) {
		const snapshot = await prepareSqliteReadOnlyLocation(target.realPath, {
			preserveSourceArtifacts: true,
			allowLiveOwner: true
		});
		await withPreparedSqliteSnapshot(snapshot, async (location) => {
			const database = openNodeSqliteDatabase(location, { readOnly: true });
			try {
				await migrateCanonicalTranscriptArchives({
					agentId: target.agentId,
					pathname: target.path,
					database,
					start: {
						generation: "",
						sessionId: ""
					},
					verifyOnly: true,
					verification: {
						key: MEDIA_ARCHIVE_VERIFICATION_KEY,
						collect: prepared
					},
					transformContent: transformMediaArchiveContent
				});
			} finally {
				clearNodeSqliteKyselyCacheForDatabase(database);
				database.close();
			}
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
export { prepareCanonicalTranscriptArchiveMigrations as a, parseDirectiveMigrationTranscriptEvent as c, parseTranscriptEvent as d, transformMediaArchiveContent as f, migrateTranscriptDirectiveArchives as i, transformHistoricalTranscriptEvent as l, TRANSCRIPT_DIRECTIVE_MIGRATION_BATCH_SIZE as n, transcriptDirectiveArchiveRecoveryPending as o, transformTranscriptEvent as p, migrateCanonicalTranscriptArchives as r, transcriptDirectiveArchivesNeedMigration as s, MEDIA_ARCHIVE_VERIFICATION_KEY as t, recoverPendingTranscriptArchivePublication as u };
