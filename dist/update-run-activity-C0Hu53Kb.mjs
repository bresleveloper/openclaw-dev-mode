import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { r as getSelfAndAncestorPidsSync } from "./restart-stale-pids-DjtzhbID.mjs";
import { c as LEGACY_UPDATE_RUN_EXPIRED_REASON, l as isExpiredLegacyUpdateRun, n as isAbandonedUpdateRun, r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-B5xSBZMw.mjs";
import { hostname } from "node:os";
//#region src/infra/update-run-driver.ts
function sameUpdateRunDriver(left, right) {
	return left.host === right.host && left.pid === right.pid && left.startIdentity === right.startIdentity;
}
function readUpdateRunDriver() {
	const host = hostname();
	const startedAt = getFileLockProcessStartTime(process.pid);
	if (!host || host.length > 255 || startedAt === null || !Number.isSafeInteger(startedAt) || startedAt < 0) return;
	return {
		host,
		pid: process.pid,
		startIdentity: String(startedAt)
	};
}
function inspectUpdateRunDriver(driver) {
	if (driver.host !== hostname()) return "unknown";
	if (isPidDefinitelyDead(driver.pid)) return "dead";
	const startedAt = getFileLockProcessStartTime(driver.pid);
	if (startedAt === null) return "unknown";
	return String(startedAt) === driver.startIdentity ? "alive" : "dead";
}
//#endregion
//#region src/infra/update-run-activity.ts
function updateRunLastActivity(record) {
	return Math.max(record.updatedAtMs, ...record.steps.flatMap((step) => [step.startedAtMs ?? 0, step.endedAtMs ?? 0]));
}
function hasUnrecordedUpdateRunDriver(record) {
	return record.steps.some((step) => step.step === "driver:identity-unavailable");
}
function isStaleIdentitylessUpdateRun(record) {
	return record.status === "running" && !record.origin.driver && !record.origin.previousDrivers?.length && Date.now() - updateRunLastActivity(record) > 18e5;
}
function recordedUpdateRunDrivers(record) {
	return [...record.origin.driver ? [record.origin.driver] : [], ...record.origin.previousDrivers ?? []];
}
/** Correlation alone cannot let another process continue a live update. */
function isCurrentUpdateRunContinuation(record, inheritedRunId) {
	if (record.runId !== inheritedRunId?.trim() || hasUnrecordedUpdateRunDriver(record)) return false;
	const drivers = recordedUpdateRunDrivers(record);
	const ancestors = getSelfAndAncestorPidsSync(void 0, { requireVerifiedParent: true });
	let ownsDriver = false;
	for (const driver of drivers) {
		const liveness = inspectUpdateRunDriver(driver);
		if (liveness === "dead") continue;
		if (liveness !== "alive" || !ancestors.has(driver.pid)) return false;
		ownsDriver = true;
	}
	return ownsDriver;
}
function formatUpdateRunOwnership(record) {
	const now = Date.now();
	const age = (at) => `${Math.max(0, Math.floor((now - at) / 1e3))}s`;
	const drivers = recordedUpdateRunDrivers(record);
	const owners = drivers.length ? drivers.map((driver) => {
		const observed = inspectUpdateRunDriver(driver);
		return `driver PID ${driver.pid} on ${driver.host}, liveness: ${observed === "unknown" ? "not observed" : observed}`;
	}).join("; ") : "driver PID and host not recorded, liveness: not observed";
	const activity = updateRunLastActivity(record);
	const unrecorded = hasUnrecordedUpdateRunDriver(record) ? "; unrecorded adopter: PID and host not recorded, liveness: not observed" : "";
	return `Update ${record.runId} is still in progress (${record.phase}); ${owners}${unrecorded}; started ${new Date(record.createdAtMs).toISOString()} (age ${age(record.createdAtMs)}), last activity ${new Date(activity).toISOString()} (age ${age(activity)}). Wait for that update, or stop that driver through its owning host or supervisor and re-run \`openclaw update repair\`.`;
}
function inspectUpdateRepairDriverAdmission(runs, inheritedRunId) {
	let continuation;
	for (const run of runs) if (isCurrentUpdateRunContinuation(run, inheritedRunId)) continuation = run;
	else if (!inspectUpdateRunDriverAbandonment(run, { explicit: true })) return {
		kind: "conflict",
		message: formatUpdateRunOwnership(run)
	};
	return continuation ? {
		kind: "continuation",
		run: continuation
	} : {
		kind: "recovery",
		runs
	};
}
/** Only a fresh, unacknowledged recovery may substitute for a full repair invocation. */
function isFreshUnacknowledgedAbandonedUpdateRun(record) {
	return isAbandonedUpdateRun(record) && record.finishedAtMs !== null && record.finishedAtMs <= Date.now() && Date.now() - record.finishedAtMs <= 18e5 && !isAcknowledgedAbandonedUpdateRun(record);
}
/** Recorded drivers require positive death evidence; untouched legacy admissions have a fixed expiry. */
function inspectUpdateRunAbandonment(record, input = {}) {
	return record.status === "running" ? inspectUpdateRunDriverAbandonment(record, input) : void 0;
}
function inspectUpdateRunDriverAbandonment(record, input) {
	if (isExpiredLegacyUpdateRun(record)) return LEGACY_UPDATE_RUN_EXPIRED_REASON;
	const identityUnavailable = hasUnrecordedUpdateRunDriver(record);
	if (!input.explicit && identityUnavailable) return;
	const drivers = recordedUpdateRunDrivers(record);
	if ((!input.explicit || !drivers.length || identityUnavailable) && Date.now() - updateRunLastActivity(record) <= 18e5) return;
	if (drivers.length) return drivers.every((driver) => inspectUpdateRunDriver(driver) === "dead") ? "inactive-driver-dead" : void 0;
	return input.explicit ? "operator-reconciled-inactive-run" : void 0;
}
/** Legacy activity cannot prove death; reporting must leave recovery to the operator. */
function staleUpdateRunGuidance(record) {
	return isStaleIdentitylessUpdateRun(record) ? `no activity since ${new Date(updateRunLastActivity(record)).toISOString()}; if no update is running, run \`openclaw update repair\` or start a new \`openclaw update\`` : void 0;
}
//#endregion
export { recordedUpdateRunDrivers as a, readUpdateRunDriver as c, isStaleIdentitylessUpdateRun as i, sameUpdateRunDriver as l, inspectUpdateRunAbandonment as n, staleUpdateRunGuidance as o, isFreshUnacknowledgedAbandonedUpdateRun as r, inspectUpdateRunDriver as s, inspectUpdateRepairDriverAdmission as t };
