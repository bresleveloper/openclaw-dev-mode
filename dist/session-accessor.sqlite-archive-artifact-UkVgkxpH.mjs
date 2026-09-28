import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { _ as encodeSessionArchiveContent, h as SESSION_ARCHIVE_ZSTD_SUFFIX, n as formatSessionArchiveTimestamp, s as isSessionArchiveArtifactName, y as readSessionArchiveContentSync } from "./artifacts-C9weQ_MG.mjs";
import { d as syncDirectoryBestEffortSync } from "./directory-durability-BKe2aOQN.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-archive-artifact.ts
const MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES = 268435456;
const MAX_REGISTERED_ARCHIVE_SESSION_ID_BYTES = 96;
function resolveRegisteredArchiveSessionIdComponent(sessionId) {
	if (Buffer.byteLength(sessionId, "utf8") <= MAX_REGISTERED_ARCHIVE_SESSION_ID_BYTES) return sessionId;
	return `session-${createHash("sha256").update(sessionId).digest("hex")}`;
}
function resolveSqliteTranscriptArchivePath(params) {
	const archiveDirectory = path.resolve(params.archiveDirectory);
	const generationSuffix = params.generation ? `.${params.generation}` : "";
	const sessionIdComponent = params.identityOwner === "registry" ? resolveRegisteredArchiveSessionIdComponent(params.sessionId) : params.sessionId;
	const archivePath = path.resolve(archiveDirectory, `${sessionIdComponent}.jsonl.${params.reason}.${formatSessionArchiveTimestamp(params.nowMs)}${generationSuffix}`);
	if (path.dirname(archivePath) !== archiveDirectory) throw new Error(`Cannot archive SQLite transcript outside ${archiveDirectory}`);
	return archivePath;
}
function resolveRegisteredSqliteTranscriptArchiveName(params) {
	return path.basename(`${resolveSqliteTranscriptArchivePath({
		archiveDirectory: ".",
		generation: params.generation,
		identityOwner: "registry",
		reason: params.reason,
		sessionId: params.sessionId,
		nowMs: params.createdAt
	})}${params.encoding === "zstd" ? SESSION_ARCHIVE_ZSTD_SUFFIX : ""}`);
}
function findMatchingSqliteTranscriptArchive(params) {
	let entries;
	try {
		entries = fs.readdirSync(params.archiveDirectory);
	} catch {
		return null;
	}
	const prefix = `${params.sessionId}.jsonl.${params.reason}.`;
	for (const entry of entries) {
		if (!entry.startsWith(prefix) || !isSessionArchiveArtifactName(entry)) continue;
		const archivePath = path.join(params.archiveDirectory, entry);
		const compressed = entry.endsWith(SESSION_ARCHIVE_ZSTD_SUFFIX);
		try {
			const stat = fs.statSync(archivePath);
			if (!stat.isFile()) continue;
			if (!compressed && stat.size !== Buffer.byteLength(params.content, "utf8")) continue;
			if (readSessionArchiveContentSync(archivePath) === params.content) return archivePath;
		} catch {
			continue;
		}
	}
	return null;
}
/** Writes or reuses a transcript archive and returns its durable path. */
function writeTranscriptArchive(params) {
	fs.mkdirSync(params.archiveDirectory, { recursive: true });
	const existing = findMatchingSqliteTranscriptArchive(params);
	if (existing) return existing;
	const encoded = encodeSessionArchiveContent(params.content);
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const archivePath = `${resolveSqliteTranscriptArchivePath({
			archiveDirectory: params.archiveDirectory,
			identityOwner: "filename",
			reason: params.reason,
			sessionId: params.sessionId,
			nowMs: Date.now() + attempt
		})}${encoded.suffix}`;
		if (fs.existsSync(archivePath)) continue;
		const tempPath = `${archivePath}.${randomUUID()}.tmp`;
		try {
			writeDurableFileExclusive(tempPath, encoded.bytes);
			fs.renameSync(tempPath, archivePath);
			syncDirectoryBestEffortSync(params.archiveDirectory);
			if (readSessionArchiveContentSync(archivePath) !== params.content) {
				fs.rmSync(archivePath, { force: true });
				throw new Error(`SQLite transcript archive verification failed for ${params.sessionId}`);
			}
			return archivePath;
		} catch (error) {
			fs.rmSync(tempPath, { force: true });
			if (hasErrnoCode(error, "EEXIST")) continue;
			throw error;
		}
	}
	throw new Error(`Could not create SQLite transcript archive for ${params.sessionId}`);
}
function writeDurableFileExclusive(filePath, content) {
	const fd = fs.openSync(filePath, "wx", 384);
	try {
		fs.writeFileSync(fd, content);
		fs.fsyncSync(fd);
	} finally {
		fs.closeSync(fd);
	}
}
function hashSessionArchiveBytes(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}
/** Publishes one exact canonical archive without directory scans or replacement. */
function publishEncodedSessionTranscriptArchive(params) {
	const archiveDirectory = path.resolve(params.archiveDirectory);
	const archivePath = path.resolve(archiveDirectory, params.archiveName);
	if (path.dirname(archivePath) !== archiveDirectory || path.basename(archivePath) !== params.archiveName) throw new Error(`Cannot publish SQLite transcript archive outside ${archiveDirectory}`);
	fs.mkdirSync(archiveDirectory, {
		recursive: true,
		mode: 448
	});
	if (fs.existsSync(archivePath)) {
		if (hashSessionArchiveBytes(fs.readFileSync(archivePath)) !== params.sha256) throw new Error(`SQLite transcript archive collision for ${params.archiveName}`);
		return archivePath;
	}
	const tempPath = `${archivePath}.${randomUUID()}.tmp`;
	writeDurableFileExclusive(tempPath, Buffer.from(params.bytes));
	try {
		fs.linkSync(tempPath, archivePath);
	} catch (error) {
		if (!hasErrnoCode(error, "EEXIST")) throw error;
	} finally {
		fs.rmSync(tempPath, { force: true });
	}
	syncDirectoryBestEffortSync(archiveDirectory);
	if (hashSessionArchiveBytes(fs.readFileSync(archivePath)) !== params.sha256) throw new Error(`SQLite transcript archive verification failed for ${params.archiveName}`);
	return archivePath;
}
//#endregion
export { resolveSqliteTranscriptArchivePath as a, resolveRegisteredSqliteTranscriptArchiveName as i, hashSessionArchiveBytes as n, writeTranscriptArchive as o, publishEncodedSessionTranscriptArchive as r, MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES as t };
