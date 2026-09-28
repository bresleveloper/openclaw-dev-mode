import { n as resolveHomeRelativePath } from "./home-dir-BKwhAL2c.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import path from "node:path";
//#region src/trajectory/paths.ts
const TRAJECTORY_RUNTIME_CAPTURE_MAX_BYTES = 10485760;
const TRAJECTORY_RUNTIME_FILE_MAX_BYTES = 52428800;
const TRAJECTORY_RUNTIME_EVENT_MAX_BYTES = 262144;
const TRAJECTORY_POINTER_FILE_MAX_BYTES = 65536;
function safeTrajectorySessionFileName(sessionId) {
	const safe = sessionId.replaceAll(/[^A-Za-z0-9_-]/g, "_").slice(0, 120);
	return /[A-Za-z0-9]/u.test(safe) ? safe : "session";
}
function resolveContainedPath(baseDir, fileName) {
	const resolvedBase = path.resolve(baseDir);
	const resolvedFile = path.resolve(resolvedBase, fileName);
	if (resolvedFile === resolvedBase || !isPathInside(resolvedBase, resolvedFile)) throw new Error("Trajectory file path escaped its configured directory");
	return resolvedFile;
}
function resolveTrajectoryFilePath(params) {
	const dirOverride = (params.env ?? process.env).OPENCLAW_TRAJECTORY_DIR?.trim();
	if (dirOverride) return resolveContainedPath(resolveHomeRelativePath(dirOverride), `${safeTrajectorySessionFileName(params.sessionId)}.jsonl`);
	if (!params.sessionFile) return path.join(process.cwd(), `${safeTrajectorySessionFileName(params.sessionId)}.trajectory.jsonl`);
	const sqliteMarker = parseSqliteSessionFileMarker(params.sessionFile);
	if (sqliteMarker) return path.join(path.dirname(path.resolve(sqliteMarker.storePath)), "trajectory", `${safeTrajectorySessionFileName(sqliteMarker.sessionId)}.jsonl`);
	return params.sessionFile.endsWith(".jsonl") ? `${params.sessionFile.slice(0, -6)}.trajectory.jsonl` : `${params.sessionFile}.trajectory.jsonl`;
}
function resolveTrajectoryPointerFilePath(sessionFile) {
	return sessionFile.endsWith(".jsonl") ? `${sessionFile.slice(0, -6)}.trajectory-path.json` : `${sessionFile}.trajectory-path.json`;
}
//#endregion
export { resolveTrajectoryFilePath as a, TRAJECTORY_RUNTIME_FILE_MAX_BYTES as i, TRAJECTORY_RUNTIME_CAPTURE_MAX_BYTES as n, resolveTrajectoryPointerFilePath as o, TRAJECTORY_RUNTIME_EVENT_MAX_BYTES as r, safeTrajectorySessionFileName as s, TRAJECTORY_POINTER_FILE_MAX_BYTES as t };
