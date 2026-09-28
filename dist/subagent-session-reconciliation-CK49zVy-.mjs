import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { c as getAgentRunContext, m as listAgentRunsForSession } from "./agent-run-registry-DO6Dg2r0.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { o as hasTaskSessionOwnerInDatabase } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { f as getTaskRegistryProcessState } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { a as SUBAGENT_ENDED_REASON_ERROR, i as SUBAGENT_ENDED_REASON_COMPLETE, o as SUBAGENT_ENDED_REASON_KILLED } from "./subagent-lifecycle-events-CDQCTuLB.mjs";
import { i as isStaleUnendedSubagentRun, j as subagentRuns } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { t as hasSubagentSessionOwnerInDatabase, y as hasRetainedRequiredCompletionDelivery } from "./subagent-registry.store.sqlite-DcyWJbiA.mjs";
import "./sessions-Cesa3L0p.mjs";
//#region src/agents/subagents/registry/subagent-session-reconciliation.ts
/**
* Subagent session-store reconciliation.
*
* Infers child completion from persisted session entries when registry updates arrive late.
*/
function finiteTimestamp(value) {
	return asFiniteNumber(value);
}
function terminalSessionTimestamp(sessionEntry) {
	return finiteTimestamp(sessionEntry?.endedAt) ?? finiteTimestamp(sessionEntry?.updatedAt);
}
function isFreshForRun(sessionEntry, notBeforeMs) {
	if (notBeforeMs === void 0) return true;
	const terminalAt = terminalSessionTimestamp(sessionEntry);
	return terminalAt !== void 0 && terminalAt >= notBeforeMs;
}
function freshSessionStartedAt(sessionEntry, notBeforeMs) {
	const startedAt = finiteTimestamp(sessionEntry?.startedAt);
	if (startedAt === void 0) return;
	return notBeforeMs === void 0 || startedAt >= notBeforeMs ? startedAt : void 0;
}
/** Read the current child entry; session-key scope also selects incognito storage. */
function loadSubagentSessionEntry(params) {
	const key = params.childSessionKey.trim();
	if (!key) return;
	const agentId = resolveAgentIdFromSessionKey(key);
	const cfg = params.cfg ?? getRuntimeConfig();
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	return loadSessionEntryReadOnly({
		agentId,
		storePath,
		sessionKey: key,
		clone: false
	});
}
/** Resolves whether a registry row is orphaned from its child session entry. */
function resolveSubagentRunOrphanReason(params) {
	const { entry } = params;
	if (entry.execution.outcome || entry.collectorCompletion || entry.requesterSettleWake || hasRetainedRequiredCompletionDelivery(entry) || entry.pauseReason || entry.killIntent || entry.killReconciliation || entry.execution.restartRecovery || entry.terminalOwner === "interrupted-recovery" || entry.suppressAnnounceReason === "steer-restart" || entry.execution.status === "queued" || getAgentRunContext(entry.runId)) return null;
	const childSessionKey = params.entry.childSessionKey?.trim();
	if (!childSessionKey) return "missing-session-entry";
	try {
		const sessionEntry = loadSubagentSessionEntry({
			childSessionKey,
			cfg: params.cfg
		});
		if (!sessionEntry) return "missing-session-entry";
		if (typeof sessionEntry.sessionId !== "string" || !sessionEntry.sessionId.trim()) return "missing-session-id";
		if (params.includeStaleUnended === true && sessionEntry.abortedLastRun !== true && params.entry.execution.status !== "interrupted" && isStaleUnendedSubagentRun(params.entry, params.now)) return "stale-unended-run";
		return null;
	} catch {
		return null;
	}
}
/** Convert persisted session status into a subagent completion outcome. */
function resolveCompletionFromSessionEntry(sessionEntry, fallbackEndedAt, opts) {
	const status = sessionEntry?.status;
	const startedAt = freshSessionStartedAt(sessionEntry, opts?.notBeforeMs);
	const endedAt = finiteTimestamp(sessionEntry?.endedAt) ?? finiteTimestamp(sessionEntry?.updatedAt) ?? fallbackEndedAt;
	if (status === "done") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: { status: "ok" },
			reason: SUBAGENT_ENDED_REASON_COMPLETE
		};
	}
	if (status === "timeout") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: { status: "timeout" },
			reason: SUBAGENT_ENDED_REASON_COMPLETE
		};
	}
	if (status === "failed") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: {
				status: "error",
				error: "session completed before registry settled"
			},
			reason: SUBAGENT_ENDED_REASON_ERROR
		};
	}
	if (status === "interrupted") return null;
	if (status === "killed") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: {
				status: "error",
				error: "subagent run terminated"
			},
			reason: SUBAGENT_ENDED_REASON_KILLED
		};
	}
	if (status !== "running" && typeof sessionEntry?.endedAt === "number") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: { status: "ok" },
			reason: SUBAGENT_ENDED_REASON_COMPLETE
		};
	}
	return null;
}
/** Resolve child completion by reading its persisted session entry. */
function resolveSubagentSessionCompletion(params) {
	return resolveCompletionFromSessionEntry(loadSubagentSessionEntry({
		childSessionKey: params.childSessionKey,
		cfg: params.cfg
	}), params.fallbackEndedAt, { notBeforeMs: params.notBeforeMs });
}
/** Resolve a fresh child session start time for lifecycle reconciliation. */
function resolveSubagentSessionStartedAt(params) {
	const sessionEntry = loadSubagentSessionEntry({
		childSessionKey: params.childSessionKey,
		cfg: params.cfg
	});
	return isFreshForRun(sessionEntry, params.notBeforeMs) ? freshSessionStartedAt(sessionEntry, params.notBeforeMs) : void 0;
}
/** Startup may only settle session-only rows; any run/task generation retains ownership. */
function hasSubagentSessionRecoveryOwner(params) {
	const key = params.sessionKey;
	if (listAgentRunsForSession(params).length > 0) return true;
	for (const run of subagentRuns.values()) if (run.childSessionKey === key || run.requesterSessionKey === key || run.controllerSessionKey === key) return true;
	const tasks = getTaskRegistryProcessState();
	if (tasks.projection.pending.size > 0) return true;
	for (const owner of tasks.runOwners.values()) if (owner.task.childSessionKey === key || owner.task.ownerKey === key) return true;
	for (const task of tasks.tasks.values()) if (task.childSessionKey === key || task.requesterSessionKey === key || task.ownerKey === key) return true;
	return withExistingOpenClawStateDatabaseCurrentReadOnly((database) => hasSubagentSessionOwnerInDatabase(database, key) || hasTaskSessionOwnerInDatabase(database.db, key), { env: params.env }) ?? false;
}
//#endregion
export { resolveSubagentSessionCompletion as a, resolveSubagentRunOrphanReason as i, loadSubagentSessionEntry as n, resolveSubagentSessionStartedAt as o, resolveCompletionFromSessionEntry as r, hasSubagentSessionRecoveryOwner as t };
