import { a as getGatewayContextResolver, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BLBH-Gpf.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { m as listAgentRunsForSession } from "./agent-run-registry-DO6Dg2r0.mjs";
import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { h as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { d as patchSessionEntryCore, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import "./sessions-Cesa3L0p.mjs";
import { r as resolveCompletionFromSessionEntry } from "./subagent-session-reconciliation-CK49zVy-.mjs";
import { a as ownsSubagentSessionExecution, i as isRetiredSubagentSessionOwner, n as isRestartRecoveryLifecycleCurrent, r as isRetiredSubagentExecution, t as getRestartRecoveryReplayError } from "./subagent-registry-restart-recovery-helpers-CzcrQcsF.mjs";
//#region src/agents/subagents/registry/subagent-registry-restart-recovery-session.ts
async function loadSubagentRecoverySession(params) {
	const sessionKey = params.entry.childSessionKey.trim();
	const agentId = resolveAgentIdFromSessionKey(sessionKey);
	const storePath = resolveSessionStorePathCore(getRuntimeConfig().session?.store, { agentId });
	const sessionEntry = loadSessionEntry({
		storePath,
		sessionKey,
		clone: false
	});
	if (params.entry.execution.restartRecovery || sessionEntry?.abortedLastRun === true || !isRetiredSubagentSessionOwner(params.entry, sessionEntry)) return {
		agentId,
		storePath,
		sessionEntry
	};
	const { sessionId, lifecycleRevision, updatedAt } = sessionEntry;
	const target = {
		sessionKey,
		sessionId
	};
	const isCurrent = () => params.isOwnerCurrent() && isRetiredSubagentExecution(params.entry) && listAgentRunsForSession(target).length === 0 && !isSessionWorkAdmissionActive(storePath, [sessionKey, sessionId]);
	const interrupted = await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (current) => {
		if (!isCurrent() || current.sessionId !== sessionId || current.lifecycleRevision !== lifecycleRevision || current.updatedAt !== updatedAt || !isRetiredSubagentSessionOwner(params.entry, current)) return null;
		return {
			...current,
			abortedLastRun: true
		};
	}, {
		assertCommitAllowed: () => {
			if (!isCurrent()) throw new Error("subagent orphan ownership changed before interruption commit");
		},
		replaceEntry: true,
		skipMaintenance: true
	});
	return interrupted ? {
		agentId,
		storePath,
		sessionEntry: interrupted
	} : null;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-restart-recovery.ts
async function recoverInterruptedSubagentRow(params) {
	const { entry, runId } = params;
	const childSessionKey = entry.childSessionKey.trim();
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const isGatewayCurrent = () => isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && params.isGatewayCurrent?.() !== false;
	const isCurrent = () => isGatewayCurrent() && params.isCurrent(runId, entry);
	if (!childSessionKey || !isCurrent() || entry.pauseReason === "sessions_yield" || entry.suppressAnnounceReason === "steer-restart" || entry.killIntent || entry.killReconciliation || entry.execution.status === "queued") return { status: "ignored" };
	const terminalError = getRestartRecoveryReplayError(entry);
	const replayTerminal = terminalError !== void 0;
	if (!replayTerminal && typeof entry.execution.endedAt === "number") return { status: "ignored" };
	try {
		const session = await loadSubagentRecoverySession({
			entry,
			isOwnerCurrent: isCurrent
		}).catch((error) => {
			if (!replayTerminal) throw error;
			params.warn("could not verify child session effects for saved terminal result", {
				runId,
				childSessionKey,
				error
			});
			return null;
		});
		if (!session && !replayTerminal || !isCurrent()) return { status: "deferred" };
		const sessionEntry = session?.sessionEntry;
		const sessionId = sessionEntry?.sessionId;
		const lifecycleRevision = sessionEntry?.lifecycleRevision;
		const lifecycleRunId = sessionEntry?.lifecycleRunId;
		const target = {
			sessionKey: childSessionKey,
			sessionId
		};
		const isChildSessionEffectsCurrent = () => {
			if (!session || !isGatewayCurrent()) return false;
			try {
				const current = loadSessionEntry({
					storePath: session.storePath,
					sessionKey: childSessionKey,
					clone: false
				});
				return current?.sessionId === sessionId && current?.lifecycleRevision === lifecycleRevision && current?.lifecycleRunId === lifecycleRunId && (!replayTerminal || current !== void 0 && ownsSubagentSessionExecution(entry, current)) && listAgentRunsForSession(target).length === 0 && !isSessionWorkAdmissionActive(session.storePath, [childSessionKey, sessionId]);
			} catch {
				return false;
			}
		};
		if (!replayTerminal && !isChildSessionEffectsCurrent()) return { status: "handled" };
		if (!replayTerminal && sessionEntry?.lifecycleRunId && ownsSubagentSessionExecution(entry, sessionEntry) && resolveCompletionFromSessionEntry(sessionEntry, Date.now(), { notBeforeMs: entry.execution.startedAt ?? entry.createdAt })) return { status: "ignored" };
		const receipt = entry.execution.restartRecovery;
		if (!replayTerminal && !receipt && sessionEntry?.abortedLastRun !== true && entry.execution.status !== "interrupted") return { status: "ignored" };
		const suppressSessionEffects = receipt !== void 0 && !isRestartRecoveryLifecycleCurrent(receipt) || sessionEntry?.lifecycleRunId !== void 0 && !ownsSubagentSessionExecution(entry, sessionEntry);
		const resolveGatewayContext = params.gatewayRuntime ? getGatewayContextResolver(params.gatewayRuntime) : void 0;
		if (resolveGatewayContext) bindGatewayContextResolver(entry, resolveGatewayContext);
		return {
			status: "terminal",
			isRecoveryCurrent: () => isCurrent() && (replayTerminal || isChildSessionEffectsCurrent()),
			isChildSessionEffectsCurrent,
			error: terminalError ?? "Subagent execution was interrupted by a Gateway restart. Inspect retained session history and uncertain tool outcomes, then continue the child with a follow-up or assign replacement work.",
			endedAt: replayTerminal ? entry.execution.endedAt : void 0,
			suppressSessionEffects: suppressSessionEffects || void 0
		};
	} catch (error) {
		params.warn("failed to reconcile interrupted subagent execution", {
			runId,
			childSessionKey,
			error
		});
		return { status: "deferred" };
	}
}
//#endregion
export { recoverInterruptedSubagentRow };
