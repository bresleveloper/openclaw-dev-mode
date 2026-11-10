import { h as onAgentEventForRun } from "./agent-events-Bf3Js0D3.mjs";
import { j as latestSubagentRun } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { b as subscribeSubagentRunChanges, s as getSubagentRunsForChildSession } from "./subagent-registry-memory-DE7WJHOr.mjs";
//#region src/agents/subagents/registry/subagent-progress-draft.ts
const liveByTask = /* @__PURE__ */ new Map();
const liveByWake = /* @__PURE__ */ new Map();
const taskId = (entry) => entry.taskRunId ?? entry.runId;
/**
* The requester settle wake still owes this task's result to its requester. A
* kill intent can still roll back, so only accepted cancellation ends the debt.
*/
function owesCompletion(entry) {
	return entry?.requesterSettleWake !== void 0 && entry.suppressCompletionDelivery !== true && entry.killReconciliation?.suppressTaskDelivery !== true;
}
/** Steering and resumed yields replace a task's execution under the same task id. */
function currentRow(id, childSessionKey, childAgentId) {
	return latestSubagentRun(getSubagentRunsForChildSession(childSessionKey, childAgentId), (entry) => taskId(entry) === id);
}
/** Only prepared operation names and outcomes cross a private child's audience boundary. */
function projectActivity(event, itemId) {
	const { data } = event;
	if (event.stream !== "item" || data.kind !== "tool" || data.hideFromChannelProgress === true || data.suppressChannelProgress === true || typeof data.name !== "string" || !/^[\w.:-]{1,120}$/.test(data.name) || typeof data.status !== "string" || ![
		"running",
		"completed",
		"failed",
		"blocked",
		"skipped"
	].includes(data.status)) return;
	const status = data.status;
	return {
		itemId,
		kind: "tool",
		name: data.name,
		phase: status === "running" ? "update" : "end",
		status
	};
}
function projectChild(entry) {
	const paused = entry.pauseReason === "sessions_yield";
	const ended = entry.execution.status === "terminal" && !paused;
	const outcome = ended ? entry.execution.outcome?.status : void 0;
	return {
		itemId: taskId(entry),
		kind: "subagent",
		title: (entry.label ?? entry.taskName ?? "Delegated work").slice(0, 120),
		phase: ended ? "end" : "update",
		status: outcome === "ok" ? "completed" : outcome === "error" || outcome === "timeout" ? "failed" : ended || paused ? void 0 : "running",
		summary: paused ? "waiting" : ended && !outcome ? "outcome unknown" : void 0
	};
}
function follow(live, runId, itemId) {
	return onAgentEventForRun(runId, (event) => {
		const item = projectActivity(event, itemId);
		if (item) live.draft.push(item);
	});
}
function track(live, entries) {
	for (const entry of entries) {
		const id = taskId(entry);
		if (live.members.has(id) || !owesCompletion(entry)) continue;
		live.members.set(id, {
			childSessionKey: entry.childSessionKey,
			childAgentId: entry.childAgentId,
			row: entry,
			stopEvents: follow(live, entry.runId, `${id}:tool`)
		});
		liveByTask.set(id, live);
		live.draft.push(projectChild(entry));
	}
}
function drop(live, id) {
	live.members.get(id)?.stopEvents();
	live.members.delete(id);
	liveByTask.delete(id);
}
function retire(live) {
	live.stopChanges();
	for (const id of live.members.keys()) drop(live, id);
	live.draft.retire();
}
/**
* Settlement, retries, stop, reset and replacement all commit through registry
* publications, so the draft follows committed task state rather than callers.
*/
function reconcile(live) {
	for (const [id, member] of live.members) {
		const row = currentRow(id, member.childSessionKey, member.childAgentId);
		if (row === member.row) continue;
		if (!owesCompletion(row)) {
			drop(live, id);
			continue;
		}
		if (row.runId !== member.row.runId) {
			member.stopEvents();
			member.stopEvents = follow(live, row.runId, `${id}:tool`);
		}
		member.row = row;
		live.draft.push(projectChild(row));
	}
	if (live.members.size === 0) retire(live);
}
/**
* Keep the yielding turn's confirmed draft for its announcing children. The
* requester settle wake remains the only final-delivery owner; the draft is
* retired once no tracked task is owed to the requester anymore.
*/
function adoptSubagentProgressDraft(spawns, draft) {
	const entries = spawns.filter((spawn) => spawn.expectsCompletionMessage === true).map((spawn) => currentRow(spawn.runId, spawn.childSessionKey));
	if (entries.length === 0 || !entries.every(owesCompletion) || entries.some((entry) => liveByTask.has(taskId(entry)) || entry.killIntent || entry.killReconciliation || entry.requesterSettleWake?.status === "dispatching")) return false;
	const live = {
		draft,
		members: /* @__PURE__ */ new Map(),
		stopChanges: () => void 0
	};
	live.stopChanges = subscribeSubagentRunChanges("projection", () => reconcile(live));
	track(live, entries);
	return true;
}
/** Show the resumed requester's work on the same draft while its settle wake runs. */
async function withSubagentProgressDraft(batch, wakeRunId, run) {
	const live = batch.map((entry) => liveByTask.get(taskId(entry))).find(Boolean);
	if (!live) return await run();
	liveByWake.set(wakeRunId, live);
	const stopEvents = follow(live, wakeRunId, "requester:tool");
	try {
		return await run();
	} finally {
		stopEvents();
		liveByWake.delete(wakeRunId);
	}
}
/** A resumed requester that yields again hands its committed cohort to the same card. */
function trackSubagentProgressYield(requesterTurnRunId, entries) {
	const live = liveByWake.get(requesterTurnRunId);
	if (live && live.members.size > 0) track(live, entries);
}
//#endregion
export { trackSubagentProgressYield as n, withSubagentProgressDraft as r, adoptSubagentProgressDraft as t };
