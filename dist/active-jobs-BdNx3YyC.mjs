import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
//#region src/cron/active-jobs.ts
/** Tracks in-process cron executions so schedulers and wake paths avoid duplicate runs. */
const CRON_ACTIVE_JOB_STATE_KEY = Symbol.for("openclaw.cron.activeJobs");
function bindCronJobAdmittedRun(marker, context, signal) {
	const assertActive = resolveAdmittedRunActiveAssertion(context, signal);
	if (marker && assertActive && isCronActiveJobMarkerCurrent(marker)) getCronActiveJobState().admittedJobRuns.set(marker, {
		context,
		assertActive
	});
}
/** Captures one occurrence before admission without granting another prompt its authority. */
function captureCronJobMessageAuthority(params, sourceSensitive) {
	const { jobId } = params;
	const marker = getCurrentCronActiveJobMarker(jobId);
	const isAuthorityCurrent = sourceSensitive ? marker?.isMessageSourceAuthorityCurrent : marker?.isMessageActionAuthorityCurrent;
	if (!marker || !isAuthorityCurrent) return;
	const { instanceId, runId } = params.operationalRunInstance;
	const { admittedJobRuns } = getCronActiveJobState();
	let owner;
	const isMarkerCurrent = () => getCurrentCronActiveJobMarker(jobId) === marker && !marker.messageActionAuthorityRevoked && (!sourceSensitive || !marker.messageSourceAuthorityRevoked) && !marker.jobRemoved && marker.cancellation?.kind !== "requested";
	const inactive = () => /* @__PURE__ */ new Error("cron message action authority is no longer active");
	return () => {
		const admitted = admittedJobRuns.get(marker);
		if (!isMarkerCurrent() || !admitted || admitted.context.operationalRunInstance.instanceId !== instanceId || admitted.context.operationalRunInstance.runId !== runId || owner !== void 0 && admitted !== owner) throw inactive();
		owner ??= admitted;
		owner.assertActive();
		if (!isAuthorityCurrent()) {
			if (sourceSensitive) marker.messageSourceAuthorityRevoked = true;
			else marker.messageActionAuthorityRevoked = true;
			throw inactive();
		}
		owner.assertActive();
		if (!isMarkerCurrent() || admittedJobRuns.get(marker) !== owner) throw inactive();
	};
}
function captureCronJobMessageActionAuthority(params) {
	return captureCronJobMessageAuthority(params, false);
}
function captureCronJobMessageSourceAuthority(params) {
	return captureCronJobMessageAuthority(params, true);
}
/** Captures host-owned admission; neither a copied token nor a same-id run can redeem it. */
function bindCronSelfRemovalCommitGuard(jobId, instance, commitGuard, assertCallerActive) {
	const { admittedJobRuns, selfRemovalOwners } = getCronActiveJobState();
	const marker = getCurrentCronActiveJobMarker(jobId);
	const owner = marker && admittedJobRuns.get(marker);
	if (!marker || !owner || owner.context.operationalRunInstance.instanceId !== instance.instanceId || owner.context.operationalRunInstance.runId !== instance.runId) return;
	selfRemovalOwners.set(commitGuard, () => {
		try {
			assertCallerActive();
			owner.assertActive();
			return getCurrentCronActiveJobMarker(jobId) === marker && admittedJobRuns.get(marker) === owner ? marker : void 0;
		} catch {
			return;
		}
	});
}
function getCronActiveJobState() {
	const state = resolveGlobalSingleton(CRON_ACTIVE_JOB_STATE_KEY, () => ({
		activeJobs: /* @__PURE__ */ new Map(),
		selfRemovalOwners: /* @__PURE__ */ new WeakMap(),
		admittedJobRuns: /* @__PURE__ */ new WeakMap(),
		generation: 0,
		nextToken: 1,
		emptyWaiters: /* @__PURE__ */ new Set()
	}));
	state.generation ??= 0;
	state.nextToken ??= 1;
	state.activeJobs ??= /* @__PURE__ */ new Map();
	state.selfRemovalOwners ??= /* @__PURE__ */ new WeakMap();
	state.admittedJobRuns ??= /* @__PURE__ */ new WeakMap();
	state.emptyWaiters ??= /* @__PURE__ */ new Set();
	return state;
}
function getActiveCronJobCountForGeneration(state) {
	let active = 0;
	for (const marker of state.activeJobs.values()) if (isMarkerActiveInGeneration(marker, state.generation)) active += 1;
	return active;
}
function isMarkerActiveInGeneration(marker, generation) {
	return marker.generation === generation || marker.preserveAcrossGenerationAdvance === true;
}
function getCurrentCronActiveJobMarker(jobId) {
	if (!jobId) return;
	const state = getCronActiveJobState();
	const marker = state.activeJobs.get(jobId);
	return marker && isMarkerActiveInGeneration(marker, state.generation) ? marker : void 0;
}
function notifyActiveCronJobWaitersIfEmpty(state) {
	if (getActiveCronJobCountForGeneration(state) > 0) return;
	for (const resolve of state.emptyWaiters) resolve();
	state.emptyWaiters.clear();
}
function notifyCronJobInactive(marker) {
	if (marker.inactiveNotified) return;
	marker.inactiveNotified = true;
	for (const callback of marker.onInactive ?? []) callback();
	marker.onInactive?.clear();
}
/** Marks a cron job id as currently executing for duplicate-run suppression. */
function markCronJobActive(jobId, opts) {
	if (!jobId) return;
	const state = getCronActiveJobState();
	const token = state.nextToken;
	state.nextToken += 1;
	const marker = {
		jobId,
		...opts?.agentId ? { agentId: opts.agentId } : {},
		...opts?.declarationKey ? { declarationKey: opts.declarationKey } : {},
		...opts?.isMessageActionAuthorityCurrent ? { isMessageActionAuthorityCurrent: opts.isMessageActionAuthorityCurrent } : {},
		...opts?.isMessageSourceAuthorityCurrent ? { isMessageSourceAuthorityCurrent: opts.isMessageSourceAuthorityCurrent } : {},
		generation: state.generation,
		token,
		...opts?.preserveAcrossGenerationAdvance ? { preserveAcrossGenerationAdvance: true } : {}
	};
	state.activeJobs.set(jobId, marker);
	return marker;
}
/** Clears the active marker when a cron run exits or is abandoned. */
function clearCronJobActive(jobId, marker) {
	if (!jobId) return;
	const state = getCronActiveJobState();
	const activeMarker = state.activeJobs.get(jobId);
	if (activeMarker && (!marker || marker.jobId === jobId && marker.token === activeMarker.token)) {
		state.activeJobs.delete(jobId);
		notifyCronJobInactive(activeMarker);
	} else if (marker?.jobId === jobId) notifyCronJobInactive(marker);
	notifyActiveCronJobWaitersIfEmpty(state);
}
/** Records a durable schedule edit against the exact run that was active for it. */
function noteActiveCronJobScheduleMutation(jobId) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (marker) marker.scheduleMutated = true;
}
/** Records a durable trigger edit against the exact run that evaluated it. */
function noteActiveCronJobTriggerMutation(jobId) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (marker) marker.triggerMutated = true;
}
/** A committed permission change cannot be undone by a retry or an A-to-B-to-A edit. */
function noteActiveCronJobMessageActionAuthorityMutation(jobId) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (marker) marker.messageActionAuthorityRevoked = true;
}
/** Revokes source-scoped reads and writes after their authenticated executable source changes. */
function noteActiveCronJobMessageSourceAuthorityMutation(jobId) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (marker) marker.messageSourceAuthorityRevoked = true;
}
/** Retires the admitted job identity after its deletion becomes durable. */
function noteActiveCronJobRemoval(jobId, commitGuard) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (!marker) return;
	marker.scheduleMutated = true;
	marker.jobRemoved = true;
	if (!commitGuard || getCronActiveJobState().selfRemovalOwners.get(commitGuard)?.() !== marker) requestCronActiveJobMarkerCancellation(marker, "Cron job removed by operator.");
	else marker.selfRemovalAccepted = true;
	return marker;
}
/** Completion retains its live receipt after self-removal; closed tools gain no new authority. */
function isCronSelfRemovalCurrent(marker) {
	return marker?.selfRemovalAccepted === true && marker.cancellation?.kind !== "requested" && getCurrentCronActiveJobMarker(marker.jobId) === marker;
}
function requestCronActiveJobMarkerCancellation(marker, reason) {
	const cancellation = marker.cancellation;
	if (cancellation?.kind === "requested") return;
	marker.cancellation = {
		kind: "requested",
		reason
	};
	cancellation?.cancel(reason);
}
/** Requests cancellation now or when the exact active run binds its controller. */
function requestActiveCronJobCancellation(jobId, reason) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (marker) requestCronActiveJobMarkerCancellation(marker, reason);
}
/** Revokes every active run admitted from a declaration-key namespace. */
function requestActiveCronJobCancellationByDeclarationKeyPrefix(declarationKeyPrefix, reason) {
	const state = getCronActiveJobState();
	for (const marker of state.activeJobs.values()) {
		if (!marker.declarationKey?.startsWith(declarationKeyPrefix) || !isMarkerActiveInGeneration(marker, state.generation)) continue;
		requestCronActiveJobMarkerCancellation(marker, reason);
	}
}
/** Returns whether the given cron job id is currently executing in this process. */
function isCronJobActive(jobId) {
	return getCurrentCronActiveJobMarker(jobId) !== void 0;
}
/** Includes admitted runs that have not entered their executing core yet. */
function hasActiveCronJobsForAgent(agentId) {
	for (const marker of getCronActiveJobState().activeJobs.values()) if (!marker.inactiveNotified && (!marker.agentId || marker.agentId === agentId)) return true;
	return false;
}
/** Runs a callback when the exact cron job no longer has an active in-process run. */
function onCronJobInactive(marker, callback) {
	if (!marker || marker.inactiveNotified) {
		callback();
		return;
	}
	marker.onInactive ??= /* @__PURE__ */ new Set();
	marker.onInactive.add(callback);
}
function isCronActiveJobMarkerCurrent(marker) {
	if (!marker) return true;
	const state = getCronActiveJobState();
	return state.activeJobs.get(marker.jobId)?.token === marker.token && isMarkerActiveInGeneration(marker, state.generation);
}
/** Returns whether any cron run is active in this process. */
function hasActiveCronJobs() {
	return getActiveCronJobCountForGeneration(getCronActiveJobState()) > 0;
}
/** Ignores only the exact cron executions represented by one coalesced heartbeat wake. */
function hasActiveCronJobsExceptMarkers(markersToIgnore) {
	const state = getCronActiveJobState();
	const ignoredMarkers = new Set(markersToIgnore);
	for (const marker of state.activeJobs.values()) if (!ignoredMarkers.has(marker) && isMarkerActiveInGeneration(marker, state.generation)) return true;
	return false;
}
/** Records that an exact cron execution is idle until its heartbeat wake settles. */
function markCronJobWaitingForHeartbeat(marker, owningCronLaneTaskMarker) {
	if (!marker || !isCronActiveJobMarkerCurrent(marker)) return () => {};
	const heartbeatWait = owningCronLaneTaskMarker ? { owningCronLaneTaskMarker } : {};
	marker.heartbeatWait = heartbeatWait;
	return () => {
		if (marker.heartbeatWait === heartbeatWait) delete marker.heartbeatWait;
	};
}
/** Returns exact live cron and lane owners currently waiting on heartbeat settlement. */
function listCronHeartbeatWaitOwners() {
	const state = getCronActiveJobState();
	const activeJobMarkers = [];
	const owningCronLaneTaskMarkers = [];
	for (const marker of state.activeJobs.values()) {
		if (!marker.heartbeatWait || !isMarkerActiveInGeneration(marker, state.generation)) continue;
		activeJobMarkers.push(marker);
		if (marker.heartbeatWait.owningCronLaneTaskMarker) owningCronLaneTaskMarkers.push(marker.heartbeatWait.owningCronLaneTaskMarker);
	}
	return {
		activeJobMarkers,
		owningCronLaneTaskMarkers
	};
}
/** Returns the number of active cron runs in this process. */
function getActiveCronJobCount() {
	return getActiveCronJobCountForGeneration(getCronActiveJobState());
}
async function waitForActiveCronJobs(timeoutMs) {
	const state = getCronActiveJobState();
	if (getActiveCronJobCountForGeneration(state) === 0) return {
		drained: true,
		active: 0
	};
	await new Promise((resolve) => {
		const waiter = () => {
			clearTimeout(timeout);
			resolve();
		};
		const timeout = setTimeout(() => {
			state.emptyWaiters.delete(waiter);
			resolve();
		}, Math.max(0, Math.floor(timeoutMs)));
		state.emptyWaiters.add(waiter);
	});
	const active = getActiveCronJobCountForGeneration(state);
	return {
		drained: active === 0,
		active
	};
}
/** Starts a new process-lifecycle generation without clearing still-finalizing old runs. */
function advanceCronActiveJobGeneration() {
	const state = getCronActiveJobState();
	state.generation += 1;
	for (const [jobId, marker] of state.activeJobs) {
		if (marker.preserveAcrossGenerationAdvance === true) continue;
		if (marker.generation < state.generation - 1) {
			state.activeJobs.delete(jobId);
			notifyCronJobInactive(marker);
		}
	}
	notifyActiveCronJobWaitersIfEmpty(state);
}
/** Clears process-global cron active-job state at process-lifecycle boundaries. */
function resetCronActiveJobs() {
	const state = getCronActiveJobState();
	state.generation += 1;
	for (const marker of state.activeJobs.values()) notifyCronJobInactive(marker);
	state.activeJobs.clear();
	notifyActiveCronJobWaitersIfEmpty(state);
}
//#endregion
export { requestActiveCronJobCancellation as C, waitForActiveCronJobs as E, onCronJobInactive as S, resetCronActiveJobs as T, noteActiveCronJobMessageActionAuthorityMutation as _, captureCronJobMessageSourceAuthority as a, noteActiveCronJobScheduleMutation as b, hasActiveCronJobs as c, isCronActiveJobMarkerCurrent as d, isCronJobActive as f, markCronJobWaitingForHeartbeat as g, markCronJobActive as h, captureCronJobMessageActionAuthority as i, hasActiveCronJobsExceptMarkers as l, listCronHeartbeatWaitOwners as m, bindCronJobAdmittedRun as n, clearCronJobActive as o, isCronSelfRemovalCurrent as p, bindCronSelfRemovalCommitGuard as r, getActiveCronJobCount as s, advanceCronActiveJobGeneration as t, hasActiveCronJobsForAgent as u, noteActiveCronJobMessageSourceAuthorityMutation as v, requestActiveCronJobCancellationByDeclarationKeyPrefix as w, noteActiveCronJobTriggerMutation as x, noteActiveCronJobRemoval as y };
