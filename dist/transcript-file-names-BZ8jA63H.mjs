//#region src/config/sessions/transcript-file-names.ts
const SESSION_ARCHIVE_ZSTD_SUFFIX = ".zst";
/** Strips the optional zstd suffix so archive name parsers see one shape. */
function stripSessionArchiveCompressionSuffix(fileName) {
	return fileName.endsWith(".zst") ? fileName.slice(0, -4) : fileName;
}
const ARCHIVE_SUFFIX_RE = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}(?:\.\d{3})?Z)(?:\.([0-9a-f]{32}))?$/;
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
function isCompactionCheckpointTranscriptFileName(fileName) {
	return COMPACTION_CHECKPOINT_TRANSCRIPT_RE.test(fileName);
}
function isTrajectoryRuntimeArtifactName(fileName) {
	return fileName.endsWith(".trajectory.jsonl");
}
/** Returns true for primary session transcript files that represent live session history. */
function isPrimarySessionTranscriptFileName(fileName) {
	return fileName.endsWith(".jsonl") && !isTrajectoryRuntimeArtifactName(fileName) && !isCompactionCheckpointTranscriptFileName(fileName);
}
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
//#endregion
export { isTrajectoryRuntimeArtifactName as a, isPrimarySessionTranscriptFileName as i, hasArchiveSuffix as n, parseUsageCountedSessionIdFromFileName as o, isCompactionCheckpointTranscriptFileName as r, readSessionArchiveTimestamp as s, SESSION_ARCHIVE_ZSTD_SUFFIX as t };
