import { L as timestampMsToIsoFileStamp } from "./number-coercion-CuVhdCBs.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { walkDirectorySync } from "@openclaw/fs-safe/walk";
//#region src/config/sessions/archive-compression.ts
const SESSION_ARCHIVE_ZSTD_SUFFIX = ".zst";
const zstdCodec = resolveZstdCodec();
/** Strips the optional zstd suffix so archive name parsers see one shape. */
function stripSessionArchiveCompressionSuffix(fileName) {
	return fileName.endsWith(".zst") ? fileName.slice(0, -4) : fileName;
}
/** Compresses archive content when the runtime supports zstd. */
function encodeSessionArchiveContent(content) {
	const plain = Buffer.from(content, "utf8");
	if (!zstdCodec || plain.length === 0) return {
		bytes: plain,
		suffix: ""
	};
	return {
		bytes: zstdCodec.compress(plain),
		suffix: SESSION_ARCHIVE_ZSTD_SUFFIX
	};
}
/** Reads an archived transcript, transparently decompressing zstd artifacts. */
function readSessionArchiveContentSync(filePath) {
	if (!filePath.endsWith(".zst")) return fs.readFileSync(filePath, "utf8");
	if (!zstdCodec) throw new Error(`Cannot read compressed transcript archive ${filePath}: this runtime lacks node:zlib zstd support`);
	return zstdCodec.decompress(fs.readFileSync(filePath)).toString("utf8");
}
/** Decodes staged archive bytes using the source archive's codec. */
function decodeSessionArchiveBytes(bytes, compressed) {
	if (!compressed) return Buffer.from(bytes).toString("utf8");
	if (!zstdCodec) throw new Error("Cannot decode compressed transcript archive: this runtime lacks zstd support");
	return zstdCodec.decompress(Buffer.from(bytes)).toString("utf8");
}
/**
* Materializes a compressed archive as a plain JSONL cache file and returns
* the readable path; plain archives pass through untouched. Source identity
* validates cached bytes so downstream readers need not handle compression.
*/
function materializeSessionArchiveForRead(filePath) {
	if (!filePath.endsWith(".zst")) return filePath;
	const cacheDir = path.join(resolvePreferredOpenClawTmpDir(), "session-archive-read-cache");
	const pathKey = createHash("sha256").update(filePath).digest("hex").slice(0, 32);
	let sourceStat;
	try {
		sourceStat = fs.statSync(filePath);
	} catch (error) {
		removeMaterializedArchiveCacheEntries(cacheDir, pathKey);
		throw error;
	}
	const cachePath = path.join(cacheDir, `${pathKey}-${sourceStat.size}-${Math.trunc(sourceStat.mtimeMs)}.jsonl`);
	sweepMaterializedArchiveCache(cacheDir);
	if (fs.existsSync(cachePath)) return cachePath;
	const content = readSessionArchiveContentSync(filePath);
	removeMaterializedArchiveCacheEntries(cacheDir, pathKey, path.basename(cachePath));
	fs.mkdirSync(cacheDir, {
		recursive: true,
		mode: 448
	});
	const tempPath = `${cachePath}.${process.pid}.${randomUUID()}.tmp`;
	fs.writeFileSync(tempPath, content, {
		encoding: "utf8",
		mode: 384
	});
	fs.renameSync(tempPath, cachePath);
	return cachePath;
}
const MATERIALIZED_ARCHIVE_CACHE_TTL_MS = 864e5;
let lastMaterializedArchiveCacheSweepMs = 0;
function sweepMaterializedArchiveCache(cacheDir) {
	const now = Date.now();
	if (now - lastMaterializedArchiveCacheSweepMs < MATERIALIZED_ARCHIVE_CACHE_TTL_MS / 24) return;
	lastMaterializedArchiveCacheSweepMs = now;
	for (const entry of walkDirectorySync(cacheDir, {
		maxDepth: 1,
		symlinks: "include"
	}).entries) try {
		if (now - fs.statSync(entry.path).mtimeMs > MATERIALIZED_ARCHIVE_CACHE_TTL_MS) fs.rmSync(entry.path, { force: true });
	} catch {}
}
function removeMaterializedArchiveCacheEntries(cacheDir, pathKey, keepName) {
	for (const entry of walkDirectorySync(cacheDir, {
		maxDepth: 1,
		symlinks: "include"
	}).entries) {
		if (!entry.name.startsWith(`${pathKey}-`) || entry.name === keepName || entry.name.endsWith(".tmp")) continue;
		fs.rmSync(entry.path, { force: true });
	}
}
//#endregion
//#region src/config/sessions/artifacts.ts
const ARCHIVE_SUFFIX_RE = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}(?:\.\d{3})?Z)(?:\.([0-9a-f]{32}))?$/;
const LEGACY_STORE_BACKUP_RE = /^sessions\.json\.bak\.\d+$/;
const PRE_DOCTOR_REPAIR_RE = /\.jsonl\.pre-doctor-(?:branch|openai-codex)-repair-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.bak$/u;
const MIGRATION_ARCHIVE_RE = /\.migrated(?:\.\d+)?$/u;
const COMPACTION_CHECKPOINT_TRANSCRIPT_RE = /^(.+)\.checkpoint\.([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.jsonl$/i;
function readSessionArchiveTimestamp(fileName, reason) {
	const marker = `.${reason}.`;
	const normalized = stripSessionArchiveCompressionSuffix(fileName);
	const index = normalized.lastIndexOf(marker);
	if (index < 0) return;
	return ARCHIVE_SUFFIX_RE.exec(normalized.slice(index + marker.length))?.[1];
}
function hasArchiveSuffix(fileName, reason) {
	return readSessionArchiveTimestamp(fileName, reason) !== void 0;
}
/** Returns true for archived session artifacts and legacy store backup names. */
function isSessionArchiveArtifactName(fileName) {
	return LEGACY_STORE_BACKUP_RE.test(fileName) || isRetainedSessionTranscriptArchiveName(fileName);
}
/** Returns true for retained archives and disposable legacy compact backups pruned at high water. */
function isRetainedSessionTranscriptArchiveName(fileName) {
	return hasArchiveSuffix(fileName, "deleted") || hasArchiveSuffix(fileName, "reset") || hasArchiveSuffix(fileName, "bak");
}
/** Returns true for migration rollback archives retained beside their legacy source. */
function isMigrationArchiveArtifactName(fileName) {
	return MIGRATION_ARCHIVE_RE.test(fileName) || PRE_DOCTOR_REPAIR_RE.test(fileName);
}
const SESSION_STORE_TEMP_RE_CACHE = /* @__PURE__ */ new Map();
const SESSION_STORE_TEMP_STALE_MS = 3e5;
function sessionStoreTempPattern(storeBasename) {
	let pattern = SESSION_STORE_TEMP_RE_CACHE.get(storeBasename);
	if (!pattern) {
		pattern = new RegExp(`^${escapeRegExp(storeBasename)}\\.(?:\\d+\\.)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.tmp$`, "i");
		SESSION_STORE_TEMP_RE_CACHE.set(storeBasename, pattern);
	}
	return pattern;
}
function isSessionStoreTempArtifactName(fileName, storeBasename) {
	if (!storeBasename) return false;
	return sessionStoreTempPattern(storeBasename).test(fileName);
}
/** Returns true when a filename is a compaction checkpoint transcript. */
function isCompactionCheckpointTranscriptFileName(fileName) {
	return COMPACTION_CHECKPOINT_TRANSCRIPT_RE.test(fileName);
}
/** Returns true for trajectory runtime jsonl artifacts. */
function isTrajectoryRuntimeArtifactName(fileName) {
	return fileName.endsWith(".trajectory.jsonl");
}
function resolveTrajectoryPath(transcriptPath) {
	return transcriptPath.endsWith(".jsonl") ? `${transcriptPath.slice(0, -6)}.trajectory.jsonl` : void 0;
}
function resolveTrajectoryPointerPath(transcriptPath) {
	return transcriptPath.endsWith(".jsonl") ? `${transcriptPath.slice(0, -6)}.trajectory-path.json` : void 0;
}
/** Returns true for any trajectory-related session artifact. */
function isTrajectorySessionArtifactName(fileName) {
	return isTrajectoryRuntimeArtifactName(fileName) || fileName.endsWith(".trajectory-path.json");
}
/** Returns true for primary session transcript files that represent live session history. */
function isPrimarySessionTranscriptFileName(fileName) {
	return fileName.endsWith(".jsonl") && !isTrajectoryRuntimeArtifactName(fileName) && !isCompactionCheckpointTranscriptFileName(fileName);
}
/** Returns true for transcript files counted in usage, including reset/deleted archives. */
function isUsageCountedSessionTranscriptFileName(fileName) {
	return parseUsageCountedSessionIdFromFileName(fileName) !== null;
}
/** Extracts the session id from a usage-counted transcript filename. */
function parseUsageCountedSessionIdFromFileName(fileName) {
	if (isPrimarySessionTranscriptFileName(fileName)) return fileName.slice(0, -6);
	const normalized = stripSessionArchiveCompressionSuffix(fileName);
	for (const reason of ["reset", "deleted"]) {
		const marker = `.jsonl.${reason}.`;
		const index = normalized.lastIndexOf(marker);
		if (index > 0 && hasArchiveSuffix(normalized, reason)) {
			const sessionId = normalized.slice(0, index);
			return isPrimarySessionTranscriptFileName(`${sessionId}.jsonl`) ? sessionId : null;
		}
	}
	return null;
}
/** Formats an archive timestamp that is safe for filenames. */
function formatSessionArchiveTimestamp(nowMs = Date.now()) {
	return timestampMsToIsoFileStamp(nowMs);
}
function parseSessionArchiveTimestamp(fileName, reason) {
	const timestampRaw = readSessionArchiveTimestamp(fileName, reason);
	if (!timestampRaw) return null;
	const timestamp = Date.parse(timestampRaw.slice(0, 11) + timestampRaw.slice(11).replace(/-/g, ":"));
	return Number.isNaN(timestamp) ? null : timestamp;
}
//#endregion
export { encodeSessionArchiveContent as _, isPrimarySessionTranscriptFileName as a, isSessionStoreTempArtifactName as c, parseSessionArchiveTimestamp as d, parseUsageCountedSessionIdFromFileName as f, decodeSessionArchiveBytes as g, SESSION_ARCHIVE_ZSTD_SUFFIX as h, isMigrationArchiveArtifactName as i, isTrajectorySessionArtifactName as l, resolveTrajectoryPointerPath as m, formatSessionArchiveTimestamp as n, isRetainedSessionTranscriptArchiveName as o, resolveTrajectoryPath as p, isCompactionCheckpointTranscriptFileName as r, isSessionArchiveArtifactName as s, SESSION_STORE_TEMP_STALE_MS as t, isUsageCountedSessionTranscriptFileName as u, materializeSessionArchiveForRead as v, readSessionArchiveContentSync as y };
