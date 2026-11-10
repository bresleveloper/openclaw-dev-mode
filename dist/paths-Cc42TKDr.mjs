//#region src/trajectory/paths.ts
const TRAJECTORY_RUNTIME_CAPTURE_MAX_BYTES = 10485760;
const TRAJECTORY_RUNTIME_FILE_MAX_BYTES = 52428800;
const TRAJECTORY_RUNTIME_EVENT_MAX_BYTES = 262144;
function safeTrajectorySessionFileName(sessionId) {
	const safe = sessionId.replaceAll(/[^A-Za-z0-9_-]/g, "_").slice(0, 120);
	return /[A-Za-z0-9]/u.test(safe) ? safe : "session";
}
//#endregion
export { safeTrajectorySessionFileName as i, TRAJECTORY_RUNTIME_EVENT_MAX_BYTES as n, TRAJECTORY_RUNTIME_FILE_MAX_BYTES as r, TRAJECTORY_RUNTIME_CAPTURE_MAX_BYTES as t };
