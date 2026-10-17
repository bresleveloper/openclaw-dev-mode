import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { l as getAgentRunContext, m as listAgentRunsForSession } from "./agent-run-registry-BaxMDLZF.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { B as hasRetainedRequiredCompletionDelivery, t as hasSubagentSessionOwnerInDatabase } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import "./sessions-D_sxp1B4.mjs";
import { u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { a as SUBAGENT_ENDED_REASON_ERROR, i as SUBAGENT_ENDED_REASON_COMPLETE, o as SUBAGENT_ENDED_REASON_KILLED } from "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { i as isStaleUnendedSubagentRun } from "./subagent-run-liveness-C7bJPLJU.mjs";
//#region src/agents/subagents/registry/subagent-child-session-owner.ts
/** Raw child keys need the agent captured when their run was registered. */
function resolveSubagentChildSessionOwner(entry, cfg) {
	const agentId = entry.childAgentId ?? resolveSessionAgentId({
		config: cfg,
		sessionKey: entry.childSessionKey
	});
	return {
		agentId,
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId })
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-session-reconciliation.ts
function terminalSessionTimestamp(sessionEntry) {
	return asFiniteNumber(sessionEntry?.endedAt) ?? asFiniteNumber(sessionEntry?.updatedAt);
}
function isFreshForRun(sessionEntry, notBeforeMs) {
	if (notBeforeMs === void 0) return true;
	const terminalAt = terminalSessionTimestamp(sessionEntry);
	return terminalAt !== void 0 && terminalAt >= notBeforeMs;
}
function freshSessionStartedAt(sessionEntry, notBeforeMs) {
	const startedAt = asFiniteNumber(sessionEntry?.startedAt);
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
		projection: "list"
	});
}
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
function resolveCompletionFromSessionEntry(sessionEntry, fallbackEndedAt, opts) {
	const status = sessionEntry?.status;
	if (status === "running" || status === "interrupted" || !isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
	let outcome;
	let reason = SUBAGENT_ENDED_REASON_COMPLETE;
	switch (status) {
		case "failed":
			outcome = {
				status: "error",
				error: "session completed before registry settled"
			};
			reason = SUBAGENT_ENDED_REASON_ERROR;
			break;
		case "killed":
			outcome = {
				status: "error",
				error: "subagent run terminated"
			};
			reason = SUBAGENT_ENDED_REASON_KILLED;
			break;
		case "timeout":
			outcome = { status: "timeout" };
			break;
		default:
			if (status !== "done" && typeof sessionEntry?.endedAt !== "number") return null;
			outcome = { status: "ok" };
	}
	return {
		startedAt: freshSessionStartedAt(sessionEntry, opts?.notBeforeMs),
		endedAt: terminalSessionTimestamp(sessionEntry) ?? fallbackEndedAt,
		outcome,
		reason
	};
}
async function resolveSubagentSessionCompletion(params) {
	return withSubagentSessionEntry(params, (entry) => resolveCompletionFromSessionEntry(entry, params.fallbackEndedAt, { notBeforeMs: params.notBeforeMs }));
}
async function withSubagentSessionEntry(params, consume) {
	const { agentId, storePath } = resolveSubagentChildSessionOwner(params, params.cfg ?? getRuntimeConfig());
	return withSessionEntryReadOnlyInWorker({
		agentId,
		storePath,
		sessionKey: params.childSessionKey,
		projection: "list"
	}, () => params.assertCurrent?.(), async (read) => {
		if (!read.ok) throw read.error;
		return consume(read.value);
	});
}
async function resolveSubagentSessionStartedAt(params) {
	return withSubagentSessionEntry(params, (entry) => isFreshForRun(entry, params.notBeforeMs) ? freshSessionStartedAt(entry, params.notBeforeMs) : void 0);
}
/** Startup may only settle session-only rows; any run/task generation retains ownership. */
function hasSubagentSessionRecoveryOwner(params) {
	const key = params.sessionKey;
	if (listAgentRunsForSession(params).length > 0) return true;
	for (const run of subagentRuns.values()) if (run.childSessionKey === key || run.requesterSessionKey === key || run.controllerSessionKey === key) return true;
	return withExistingOpenClawStateDatabaseCurrentReadOnly((database) => hasSubagentSessionOwnerInDatabase(database, key), { env: params.env }) ?? false;
}
//#endregion
export { resolveSubagentSessionCompletion as a, resolveSubagentRunOrphanReason as i, loadSubagentSessionEntry as n, resolveSubagentSessionStartedAt as o, resolveCompletionFromSessionEntry as r, resolveSubagentChildSessionOwner as s, hasSubagentSessionRecoveryOwner as t };
