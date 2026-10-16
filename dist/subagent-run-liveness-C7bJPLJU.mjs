import { o as asDateTimestampMs, s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { p as hasLiveAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { S as isSameSubagentRunOwner, y as getSubagentRunRuntimeKey } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Q2p-0uCf.mjs";
import { l as ownsSwarmRunReservation } from "./swarm-scheduler-BnTRUM_W.mjs";
import { u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { n as getSubagentSessionStartedAt } from "./subagent-session-metrics-BCHEYB6I.mjs";
//#region src/agents/subagents/registry/subagent-run-timeout.ts
/**
* Subagent run timeout math.
*
* Separates timer-safe delays from duration/deadline values because setTimeout has stricter bounds.
*/
function resolveSubagentRunDurationMs(timeoutSeconds) {
	if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0) return;
	const durationMs = Math.floor(timeoutSeconds) * 1e3;
	return Number.isSafeInteger(durationMs) && durationMs > 0 ? durationMs : void 0;
}
function resolveSubagentRunDeadlineMs(entry, observedStartedAt) {
	const durationMs = resolveSubagentRunDurationMs(entry.runTimeoutSeconds);
	if (durationMs === void 0) return;
	const startedAt = asFiniteNumber(observedStartedAt) ?? asFiniteNumber(entry.execution.startedAt) ?? (entry.collect ? void 0 : entry.createdAt);
	const safeStartedAt = asDateTimestampMs(startedAt);
	if (safeStartedAt === void 0) return;
	const deadlineMs = safeStartedAt + durationMs;
	return Number.isSafeInteger(deadlineMs) && asDateTimestampMs(deadlineMs) !== void 0 ? deadlineMs : void 0;
}
function resolveSubagentRunEffectiveEndedAt(entry, endedAt, observedStartedAt) {
	const deadlineMs = resolveSubagentRunDeadlineMs(entry, observedStartedAt);
	return deadlineMs !== void 0 && endedAt > deadlineMs ? deadlineMs : endedAt;
}
function resolveSubagentWaitTimeoutMs(cfg, runTimeoutSeconds) {
	return resolveAgentTimeoutMs({
		cfg,
		overrideSeconds: runTimeoutSeconds ?? 0
	});
}
//#endregion
//#region src/agents/subagents/registry/subagent-run-liveness.ts
/**
* Subagent run liveness policy.
*
* Ages out stale unended runs while keeping recent/composed child links visible.
*/
/** Routing metadata alone does not own an execution. */
function isSubagentRunLive(entry) {
	if (!entry || typeof entry.execution.endedAt === "number") return false;
	const current = subagentRuns.get(entry.runId);
	return Boolean(current && typeof current.execution.endedAt !== "number" && isSameSubagentRunOwner(current, entry) && hasLiveAgentRunContext(entry.runId));
}
/** Queued admission belongs to the exact current registration and scheduler reservation. */
function isSubagentRunQueued(entry) {
	const current = entry ? subagentRuns.get(entry.runId) : void 0;
	return Boolean(current && isSameSubagentRunOwner(current, entry) && current.collect && current.execution.status === "queued" && ownsSwarmRunReservation(current.schedulerSlotId ?? current.runId, getSubagentRunRuntimeKey(current)));
}
const STALE_UNENDED_SUBAGENT_RUN_MS = 72e5;
const RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS = 18e5;
const EXPLICIT_TIMEOUT_STALE_GRACE_MS = 6e4;
const MIN_REALISTIC_RUN_TIMESTAMP_MS = Date.UTC(2020, 0, 1);
/** Return whether a subagent run has a finite execution end timestamp. */
function hasSubagentRunEnded(entry) {
	return typeof entry.execution.endedAt === "number" && Number.isFinite(entry.execution.endedAt);
}
function resolveStaleCutoffMs(entry) {
	const durationMs = resolveSubagentRunDurationMs(entry.runTimeoutSeconds);
	if (durationMs !== void 0) return Math.max(STALE_UNENDED_SUBAGENT_RUN_MS, durationMs + EXPLICIT_TIMEOUT_STALE_GRACE_MS);
	return STALE_UNENDED_SUBAGENT_RUN_MS;
}
/** Return whether an unended subagent run is stale enough to hide as inactive. */
function isStaleUnendedSubagentRun(entry, now = Date.now()) {
	if (hasSubagentRunEnded(entry)) return false;
	const startedAt = getSubagentSessionStartedAt(entry) ?? entry.createdAt;
	if (typeof startedAt !== "number" || !Number.isFinite(startedAt) || startedAt < MIN_REALISTIC_RUN_TIMESTAMP_MS) return false;
	return now - startedAt > resolveStaleCutoffMs(entry);
}
/** Admission/display retention includes current owners and a bounded registration grace.
* This is not an executor-liveness assertion; use isSubagentRunLive for that.
*/
function isRetainedUnendedSubagentRun(entry, now = Date.now()) {
	return !hasSubagentRunEnded(entry) && (isSubagentRunLive(entry) || isSubagentRunQueued(entry) || !isStaleUnendedSubagentRun(entry, now));
}
/** Return whether a child-session link should still appear in subagent listings. */
function shouldKeepSubagentRunChildLink(entry, options) {
	const now = options?.now ?? Date.now();
	return isRetainedUnendedSubagentRun(entry, now) || (options?.activeDescendants ?? 0) > 0 || hasSubagentRunEnded(entry) && now - entry.execution.endedAt <= 18e5;
}
//#endregion
export { isSubagentRunLive as a, resolveSubagentRunDeadlineMs as c, isStaleUnendedSubagentRun as i, resolveSubagentRunEffectiveEndedAt as l, hasSubagentRunEnded as n, isSubagentRunQueued as o, isRetainedUnendedSubagentRun as r, shouldKeepSubagentRunChildLink as s, RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS as t, resolveSubagentWaitTimeoutMs as u };
