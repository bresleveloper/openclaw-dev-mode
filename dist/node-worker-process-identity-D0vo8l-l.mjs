import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
//#region src/node-host/node-worker-process-identity.ts
function requireNodeWorkerProcessIdentity(pid) {
	const startTime = getFileLockProcessStartTime(pid);
	if (startTime === null) throw new Error(`cannot establish PID-reuse-safe identity for process ${pid}`);
	return {
		pid,
		startTime
	};
}
function inspectNodeWorkerProcessIdentity(identity) {
	const observedStartTime = getFileLockProcessStartTime(identity.pid);
	if (observedStartTime !== null) {
		if (observedStartTime !== identity.startTime) return "reused";
		return isPidDefinitelyDead(identity.pid) ? "dead" : "live";
	}
	return isPidDefinitelyDead(identity.pid) ? "dead" : "unknown";
}
//#endregion
export { requireNodeWorkerProcessIdentity as n, inspectNodeWorkerProcessIdentity as t };
