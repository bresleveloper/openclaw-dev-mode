import { t as inspectUpdateRunDriver } from "./update-run-driver-k0LVIIq0.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { n as LEGACY_UPDATE_RUN_EXPIRED_REASON, r as isExpiredLegacyUpdateRun } from "./update-run-legacy-expiry-BU1v4N5g.mjs";
import { n as isAbandonedUpdateRun, r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-Cu3LgwJt.mjs";
import { i as inspectSelfAndAncestorPidsSync } from "./restart-stale-pids-BSJ5Iyx5.mjs";
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
const verifiedAncestorDrivers = /* @__PURE__ */ new Set();
function updateRunDriverKey(driver) {
	return `${driver.host}\n${driver.pid}\n${driver.startIdentity}`;
}
/** Correlation alone cannot let another process continue a live update. */
function inspectCurrentUpdateRunContinuation(record, inheritedRunId) {
	if (record.runId !== inheritedRunId?.trim() || hasUnrecordedUpdateRunDriver(record)) return "not-continuation";
	let ancestry;
	let ownsDriver = false;
	for (const driver of recordedUpdateRunDrivers(record)) {
		const liveness = inspectUpdateRunDriver(driver);
		if (liveness === "dead") continue;
		if (liveness !== "alive") return "not-continuation";
		const key = updateRunDriverKey(driver);
		if (!verifiedAncestorDrivers.has(key)) {
			ancestry ??= inspectSelfAndAncestorPidsSync(void 0, { requireVerifiedParent: true });
			if (!ancestry.pids.has(driver.pid)) return ancestry.complete ? "not-continuation" : "ancestry-unverified";
			verifiedAncestorDrivers.add(key);
		}
		ownsDriver = true;
	}
	return ownsDriver ? "continuation" : "not-continuation";
}
function formatUnverifiedUpdateRunAncestry(record) {
	const pids = recordedUpdateRunDrivers(record).map((driver) => driver.pid).join(", ");
	return `Update ${record.runId} was inherited by this process, but this host could not read this process's ancestry to verify that its live driver (PID ${pids}) started it, so it was not treated as a continuation. This is a process-inspection failure, not evidence of another update. Retry when the host is less busy; if it persists, let the update finish, then run \`openclaw update repair\`.`;
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
	return `Update ${record.runId} remains recorded as running (${record.phase}); ${owners}${unrecorded}; started ${new Date(record.createdAtMs).toISOString()} (age ${age(record.createdAtMs)}), last activity ${new Date(activity).toISOString()} (age ${age(activity)}). Repair could not verify that the recorded update work stopped; it did not assume the update resumed. Check each named host or supervisor: this host cannot safely determine liveness when a driver is shown as "not observed". If a driver is active, wait for it or stop it through its owning host or supervisor. If this is the same machine after a rename, restore its recorded hostname before retrying \`openclaw update repair\`; otherwise contact support.`;
}
function inspectUpdateRepairDriverAdmission(runs, inheritedRunId) {
	let continuation;
	for (const run of runs) {
		const check = inspectCurrentUpdateRunContinuation(run, inheritedRunId);
		if (check === "continuation") continuation = run;
		else if (!inspectUpdateRunDriverAbandonment(run, { explicit: true })) return {
			kind: "conflict",
			message: check === "ancestry-unverified" ? formatUnverifiedUpdateRunAncestry(run) : formatUpdateRunOwnership(run)
		};
	}
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
const POST_CORE_PHASES = /* @__PURE__ */ new Set([
	"activating",
	"restarting",
	"verifying"
]);
function needsPostCoreRepair(run) {
	return POST_CORE_PHASES.has(run.phase) || run.steps.some((step) => POST_CORE_PHASES.has(step.step) || step.step === "post-update verification" || step.step.startsWith("finalize:"));
}
function inspectNewerRecoveryHistory(oldestRecovery, history) {
	if (oldestRecovery === void 0) return {
		postCoreRuns: [],
		incomplete: false
	};
	return {
		postCoreRuns: history.filter((run) => run.createdAtMs >= oldestRecovery && run.status === "failed" && !isAcknowledgedAbandonedUpdateRun(run) && needsPostCoreRepair(run)),
		incomplete: history.length === 100 && (history.at(-1)?.createdAtMs ?? 0) >= oldestRecovery
	};
}
//#endregion
export { isFreshUnacknowledgedAbandonedUpdateRun as a, recordedUpdateRunDrivers as c, inspectUpdateRunAbandonment as i, staleUpdateRunGuidance as l, inspectNewerRecoveryHistory as n, isStaleIdentitylessUpdateRun as o, inspectUpdateRepairDriverAdmission as r, needsPostCoreRepair as s, formatUpdateRunOwnership as t };
