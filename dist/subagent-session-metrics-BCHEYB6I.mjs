import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
//#region src/agents/subagents/registry/subagent-session-metrics.ts
/** Returns a recorded execution start, never the earlier admission time. */
function getSubagentSessionStartedAt(entry) {
	return asFiniteNumber(entry?.sessionStartedAt) ?? asFiniteNumber(entry?.execution.startedAt);
}
/** Computes accumulated runtime including the current live run when still active. */
function getSubagentSessionRuntimeMs(entry, now = Date.now()) {
	if (!entry) return;
	const accumulatedRuntimeMs = Math.max(0, asFiniteNumber(entry.accumulatedRuntimeMs) ?? 0);
	const startedAt = asFiniteNumber(entry.execution.startedAt);
	if (startedAt === void 0) return accumulatedRuntimeMs > 0 ? accumulatedRuntimeMs : void 0;
	const currentRunEndedAt = asFiniteNumber(entry.execution.endedAt) ?? now;
	return Math.max(0, accumulatedRuntimeMs + Math.max(0, currentRunEndedAt - startedAt));
}
/** Maps persisted run outcome fields to the compact session status shown in tools/UI. */
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
	if (entry.pauseReason === "sessions_yield" && status !== "killed" && status !== "failed" && status !== "timeout") return pending > 0 ? `waiting on ${pending} ${pending === 1 ? "child" : "children"}` : "waiting for external continuation";
	if (pending > 0) {
		const waiting = `waiting on ${pending} ${pending === 1 ? "child" : "children"}`;
		return status === "running" || status === "done" ? `active (${waiting})` : `${status} (${waiting})`;
	}
	return status;
}
//#endregion
export { resolveSubagentSessionStatus as i, getSubagentSessionStartedAt as n, resolveSubagentDisplayStatus as r, getSubagentSessionRuntimeMs as t };
