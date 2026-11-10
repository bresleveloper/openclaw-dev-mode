import path from "node:path";
//#region src/config/sessions/legacy-sqlite-marker.ts
/** Legacy marker codec retained only for artifacts, migration, and plugin SDK compatibility. */
const SQLITE_SESSION_FILE_MARKER_RE = /^sqlite:([^:]+):([^:]+):(.*)$/;
const SQLITE_POSIX_SESSION_FILE_MARKER_RE = /^sqlite:([^:]+):(.+?):(\/.*)$/;
const SQLITE_WINDOWS_SESSION_FILE_MARKER_RE = /^sqlite:([^:]+):(.+):([a-zA-Z]:[/\\].*|\\\\.*)$/;
function formatSqliteSessionFileMarker(marker) {
	return `sqlite:${marker.agentId}:${marker.sessionId}:${path.resolve(marker.storePath)}`;
}
function parseSqliteSessionFileMarker(sessionFile) {
	const marker = sessionFile?.trim();
	if (!marker?.startsWith("sqlite:")) return;
	const match = (process.platform === "win32" ? SQLITE_WINDOWS_SESSION_FILE_MARKER_RE : SQLITE_POSIX_SESSION_FILE_MARKER_RE).exec(marker) ?? SQLITE_SESSION_FILE_MARKER_RE.exec(marker);
	if (!match?.[1] || !match[2] || !match[3]) return;
	return {
		agentId: match[1],
		sessionId: match[2],
		storePath: match[3]
	};
}
function sqliteSessionFileMarkerMatchesSession(sessionFile, sessionId) {
	return parseSqliteSessionFileMarker(sessionFile)?.sessionId === sessionId;
}
function sqliteSessionFileMarkerMatchesTarget(sessionFile, target) {
	const marker = parseSqliteSessionFileMarker(sessionFile);
	return marker?.agentId === target.agentId && marker.sessionId === target.sessionId && path.resolve(marker.storePath) === path.resolve(target.storePath);
}
//#endregion
export { sqliteSessionFileMarkerMatchesTarget as i, parseSqliteSessionFileMarker as n, sqliteSessionFileMarkerMatchesSession as r, formatSqliteSessionFileMarker as t };
