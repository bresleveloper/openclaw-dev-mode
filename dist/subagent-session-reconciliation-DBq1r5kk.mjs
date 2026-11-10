import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { i as readSessionEntryReadOnlyInWorker, l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./config-B3oiWDlr.mjs";
import { r as resolveSubagentChildAgentId } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { f as hasRetainedRequiredCompletionDelivery } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { a as SUBAGENT_ENDED_REASON_ERROR, i as SUBAGENT_ENDED_REASON_COMPLETE, o as SUBAGENT_ENDED_REASON_KILLED } from "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { i as isStaleUnendedSubagentRun } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { t as withSubagentSessionSource } from "./subagent-session-source-b7OOANca.mjs";
//#region src/agents/subagents/registry/subagent-child-session-owner.ts
/** Raw child keys need the agent captured when their run was registered. */
function resolveSubagentChildSessionOwner(entry, cfg) {
	const agentId = resolveSubagentChildAgentId(entry);
	if (!agentId) throw new Error("Subagent owning agent is unresolved; inspect the retained execution record.");
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
async function loadSubagentSessionEntry(params) {
	const key = params.childSessionKey.trim();
	if (!key) return;
	const cfg = params.cfg ?? readRuntimeConfig();
	const { agentId, storePath } = resolveSubagentChildSessionOwner(params, cfg);
	if (isIncognitoSessionKey(key)) return withSubagentSessionEntry({
		...params,
		cfg
	}, (entry) => entry);
	return readSessionEntryReadOnlyInWorker({
		agentId,
		storePath,
		sessionKey: key,
		projection: "list"
	}, params.assertCurrent);
}
function resolveSubagentRunOrphanReason(params) {
	const { entry } = params;
	if (entry.execution.outcome || entry.collectorCompletion || entry.requesterSettleWake || hasRetainedRequiredCompletionDelivery(entry) || entry.pauseReason || entry.killIntent || entry.killReconciliation || entry.execution.restartRecovery || entry.terminalOwner === "interrupted-recovery" || entry.suppressAnnounceReason === "steer-restart" || entry.execution.status === "queued" || getAgentRunContext(entry.runId)) return null;
	const childSessionKey = params.entry.childSessionKey?.trim();
	if (!childSessionKey) return "missing-session-entry";
	return { async read(assertCurrent) {
		const sessionEntry = await loadSubagentSessionEntry({
			childSessionKey,
			childAgentId: entry.childAgentId,
			cfg: params.cfg,
			assertCurrent
		});
		let orphanReason = null;
		if (!sessionEntry) orphanReason = "missing-session-entry";
		else if (typeof sessionEntry.sessionId !== "string" || !sessionEntry.sessionId.trim()) orphanReason = "missing-session-id";
		else if (params.includeStaleUnended === true && sessionEntry.abortedLastRun !== true && entry.execution.status !== "interrupted" && isStaleUnendedSubagentRun(entry, params.now)) orphanReason = "stale-unended-run";
		return {
			orphanReason,
			sessionEntry
		};
	} };
}
function resolveCompletionFromSessionEntry(sessionEntry, fallbackEndedAt, opts) {
	const status = sessionEntry?.status;
	if (status === "interrupted" || !isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
	let outcome;
	let reason = SUBAGENT_ENDED_REASON_COMPLETE;
	switch (status) {
		case "failed":
			outcome = {
				status: "error",
				error: sessionEntry?.lastRunError || "session completed before registry settled"
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
			outcome = {
				status: "timeout",
				error: sessionEntry?.lastRunError
			};
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
	const { agentId, storePath } = resolveSubagentChildSessionOwner(params, params.cfg ?? readRuntimeConfig());
	return withSubagentSessionSource({
		agentId,
		storePath,
		sessionKey: params.childSessionKey,
		assertCurrent: params.assertCurrent
	}, async (source) => {
		if (source) return consume(source.actor.snapshot(source.authority)?.entry);
		if (isIncognitoSessionKey(params.childSessionKey)) return consume(void 0);
		return withSessionEntryReadOnlyInWorker({
			agentId,
			storePath,
			sessionKey: params.childSessionKey,
			projection: "list"
		}, () => params.assertCurrent?.(), async (result) => {
			if (!result.ok) throw result.error;
			return consume(result.value);
		});
	});
}
async function resolveSubagentSessionStartedAt(params) {
	return withSubagentSessionEntry(params, (entry) => isFreshForRun(entry, params.notBeforeMs) ? freshSessionStartedAt(entry, params.notBeforeMs) : void 0);
}
//#endregion
export { resolveSubagentSessionStartedAt as a, resolveSubagentSessionCompletion as i, resolveCompletionFromSessionEntry as n, withSubagentSessionEntry as o, resolveSubagentRunOrphanReason as r, resolveSubagentChildSessionOwner as s, loadSubagentSessionEntry as t };
