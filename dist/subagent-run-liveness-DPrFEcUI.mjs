import { o as asDateTimestampMs, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { m as hasLiveAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { u as ownsSwarmRunReservation } from "./swarm-scheduler-CocpuN_N.mjs";
import { E as getSubagentRunRuntimeKey, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-BBs3o51w.mjs";
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
function resolveCompletionAfterHardRunDeadline(params) {
	const deadlineMs = resolveSubagentRunDeadlineMs(params.entry, params.observedStartedAt);
	if (deadlineMs === void 0) return;
	return (asFiniteNumber(params.observedEndedAt) ?? params.now) > deadlineMs ? deadlineMs : void 0;
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
function shouldPreservePublishedExplicitRunTimeout(entry) {
	if (entry.execution.outcome?.status !== "timeout" || typeof entry.execution.endedAt !== "number") return false;
	const deadlineMs = resolveSubagentRunDeadlineMs(entry);
	if (deadlineMs === void 0 || entry.execution.endedAt < deadlineMs) return false;
	return entry.cleanupHandled === true || typeof entry.cleanupCompletedAt === "number" || typeof entry.endedHookEmittedAt === "number" || entry.delivery?.status === "delivered" || typeof entry.delivery?.announcedAt === "number";
}
//#endregion
//#region src/agents/subagents/registry/subagent-session-metrics.ts
/** Returns a recorded execution start, never the earlier admission time. */
function getSubagentSessionStartedAt(entry) {
	return asFiniteNumber(entry?.sessionStartedAt) ?? asFiniteNumber(entry?.execution.startedAt);
}
function getSubagentSessionRuntimeMs(entry, now = Date.now()) {
	if (!entry) return;
	const accumulatedRuntimeMs = Math.max(0, asFiniteNumber(entry.accumulatedRuntimeMs) ?? 0);
	const startedAt = asFiniteNumber(entry.execution.startedAt);
	if (startedAt === void 0) return accumulatedRuntimeMs > 0 ? accumulatedRuntimeMs : void 0;
	const currentRunEndedAt = asFiniteNumber(entry.execution.endedAt) ?? now;
	return Math.max(0, accumulatedRuntimeMs + Math.max(0, currentRunEndedAt - startedAt));
}
function resolveSubagentSessionStatus(entry) {
	if (!entry) return;
	if (!entry.execution.endedAt) {
		if (entry.execution.status === "interrupted") return "interrupted";
		return entry.execution.status === "queued" ? "queued" : "running";
	}
	if (entry.endedReason === "subagent-killed") return "killed";
	const status = entry.execution.outcome?.status;
	if (status === "error" && entry.execution.interruptionReason === "gateway-restart") {
		const delivery = entry.delivery;
		return delivery && delivery.disposition !== "intentional_non_delivery" && (delivery.status === "failed" || delivery.status === "suspended" || delivery.status === "discarded") ? "failed" : "interrupted";
	}
	if (status === "error") return "failed";
	if (status === "timeout") return "timeout";
	return "done";
}
/** Formats the authoritative run status while preserving unfinished descendants. */
function resolveSubagentDisplayStatus(entry, pendingDescendants = 0) {
	const status = resolveSubagentSessionStatus(entry) ?? "done";
	const pending = Math.max(0, pendingDescendants);
	const waiting = `waiting on ${pending} ${pending === 1 ? "child" : "children"}`;
	if (entry.pauseReason === "sessions_yield" && status !== "killed" && status !== "failed" && status !== "timeout") return pending > 0 ? waiting : "waiting for external continuation";
	if (pending > 0) return status === "running" || status === "done" ? `active (${waiting})` : `${status} (${waiting})`;
	return status;
}
//#endregion
//#region src/agents/subagents/registry/subagent-run-liveness.ts
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
function hasSubagentRunEnded(entry) {
	return typeof entry.execution.endedAt === "number" && Number.isFinite(entry.execution.endedAt);
}
function isYieldedSubagentRun(entry) {
	return entry.pauseReason === "sessions_yield" && !entry.killIntent && !entry.killReconciliation && entry.suppressAnnounceReason !== "killed" && entry.endedReason !== "subagent-killed";
}
function isStaleUnendedSubagentRun(entry, now = Date.now()) {
	if (hasSubagentRunEnded(entry)) return false;
	const startedAt = getSubagentSessionStartedAt(entry) ?? entry.createdAt;
	if (typeof startedAt !== "number" || !Number.isFinite(startedAt) || startedAt < MIN_REALISTIC_RUN_TIMESTAMP_MS) return false;
	const durationMs = resolveSubagentRunDurationMs(entry.runTimeoutSeconds);
	const cutoffMs = durationMs === void 0 ? STALE_UNENDED_SUBAGENT_RUN_MS : Math.max(STALE_UNENDED_SUBAGENT_RUN_MS, durationMs + EXPLICIT_TIMEOUT_STALE_GRACE_MS);
	return now - startedAt > cutoffMs;
}
/** Admission/display retention includes current owners and a bounded registration grace.
* This is not an executor-liveness assertion; use isSubagentRunLive for that.
*/
function isRetainedUnendedSubagentRun(entry, now = Date.now()) {
	return !hasSubagentRunEnded(entry) && (isSubagentRunLive(entry) || isSubagentRunQueued(entry) || !isStaleUnendedSubagentRun(entry, now));
}
function shouldKeepSubagentRunChildLink(entry, options) {
	const now = options?.now ?? Date.now();
	return isRetainedUnendedSubagentRun(entry, now) || (options?.activeDescendants ?? 0) > 0 || hasSubagentRunEnded(entry) && now - entry.execution.endedAt <= 18e5;
}
//#endregion
export { shouldPreservePublishedExplicitRunTimeout as _, isSubagentRunLive as a, shouldKeepSubagentRunChildLink as c, resolveSubagentDisplayStatus as d, resolveSubagentSessionStatus as f, resolveSubagentWaitTimeoutMs as g, resolveSubagentRunEffectiveEndedAt as h, isStaleUnendedSubagentRun as i, getSubagentSessionRuntimeMs as l, resolveSubagentRunDeadlineMs as m, hasSubagentRunEnded as n, isSubagentRunQueued as o, resolveCompletionAfterHardRunDeadline as p, isRetainedUnendedSubagentRun as r, isYieldedSubagentRun as s, RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS as t, getSubagentSessionStartedAt as u };
