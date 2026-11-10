import { L as timestampMsToIsoFileStamp } from "./number-coercion-CkhMiRw8.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { a as isTrajectoryRuntimeArtifactName, n as hasArchiveSuffix, o as parseUsageCountedSessionIdFromFileName, s as readSessionArchiveTimestamp } from "./transcript-file-names-BZ8jA63H.mjs";
//#region src/config/sessions/artifacts.ts
const LEGACY_STORE_BACKUP_RE = /^sessions\.json\.bak\.\d+$/;
const PRE_DOCTOR_REPAIR_RE = /\.jsonl\.pre-doctor-(?:branch|openai-codex)-repair-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.bak$/u;
const MIGRATION_ARCHIVE_RE = /\.migrated(?:\.\d+)?$/u;
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
function resolveTrajectoryPath(transcriptPath) {
	return transcriptPath.endsWith(".jsonl") ? `${transcriptPath.slice(0, -6)}.trajectory.jsonl` : void 0;
}
function resolveTrajectoryPointerPath(transcriptPath) {
	return transcriptPath.endsWith(".jsonl") ? `${transcriptPath.slice(0, -6)}.trajectory-path.json` : void 0;
}
function isTrajectorySessionArtifactName(fileName) {
	return isTrajectoryRuntimeArtifactName(fileName) || fileName.endsWith(".trajectory-path.json");
}
/** Returns true for transcript files counted in usage, including reset/deleted archives. */
function isUsageCountedSessionTranscriptFileName(fileName) {
	return parseUsageCountedSessionIdFromFileName(fileName) !== null;
}
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
export { isSessionArchiveArtifactName as a, isUsageCountedSessionTranscriptFileName as c, resolveTrajectoryPointerPath as d, isRetainedSessionTranscriptArchiveName as i, parseSessionArchiveTimestamp as l, formatSessionArchiveTimestamp as n, isSessionStoreTempArtifactName as o, isMigrationArchiveArtifactName as r, isTrajectorySessionArtifactName as s, SESSION_STORE_TEMP_STALE_MS as t, resolveTrajectoryPath as u };
