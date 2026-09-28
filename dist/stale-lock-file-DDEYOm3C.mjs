import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
//#region src/infra/stale-lock-file.ts
function readLockFileOwnerPayload(payload) {
	if (!payload) return null;
	return {
		pid: typeof payload.pid === "number" && Number.isInteger(payload.pid) && payload.pid > 0 ? payload.pid : void 0,
		createdAt: typeof payload.createdAt === "string" ? payload.createdAt : void 0,
		starttime: typeof payload.starttime === "number" && Number.isInteger(payload.starttime) && payload.starttime >= 0 ? payload.starttime : void 0
	};
}
/** Capture only the bounded facts used by this exact stale decision. Never
* resample the owner after failure or copy arbitrary sidecar payload fields. */
function inspectStaleLockOwner(params) {
	const payload = readLockFileOwnerPayload(params.payload);
	if (!payload?.pid) return null;
	const observedStarttime = payload.starttime === void 0 ? null : (params.getProcessStartTime ?? getFileLockProcessStartTime)(payload.pid);
	const identity = {
		pid: payload.pid,
		recordedStarttime: payload.starttime ?? null,
		observedStarttime
	};
	const normalizedStored = process.platform === "darwin" && payload.starttime !== void 0 && payload.starttime > 1e10 ? Math.floor(payload.starttime / 1e6) : payload.starttime;
	if (observedStarttime !== null && observedStarttime !== normalizedStored) return {
		reason: "owner-starttime-changed",
		...identity
	};
	return (params.isPidDefinitelyDead ?? isPidDefinitelyDead)(payload.pid) ? {
		reason: "owner-process-exited",
		...identity
	} : null;
}
function isLockOwnerDefinitelyStale(params) {
	return inspectStaleLockOwner(params) !== null;
}
function shouldRemoveDeadOwnerOrExpiredLock(params) {
	const payload = readLockFileOwnerPayload(params.payload);
	if (payload?.pid) return isLockOwnerDefinitelyStale({
		payload: params.payload,
		isPidDefinitelyDead: params.isPidDefinitelyDead,
		getProcessStartTime: params.getProcessStartTime
	});
	if (!payload?.createdAt) return false;
	const createdAt = Date.parse(payload.createdAt);
	return !Number.isFinite(createdAt) || (params.nowMs ?? Date.now()) - createdAt > params.staleMs;
}
//#endregion
export { isLockOwnerDefinitelyStale as n, shouldRemoveDeadOwnerOrExpiredLock as r, inspectStaleLockOwner as t };
