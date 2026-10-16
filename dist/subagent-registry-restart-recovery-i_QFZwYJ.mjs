import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { a as getGatewayContextResolver, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BSmCVVpP.mjs";
import { m as listAgentRunsForSession } from "./agent-run-registry-BaxMDLZF.mjs";
import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { h as isSessionWorkAdmissionActive, u as getSessionWorkAdmissionRelease } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { S as isSameSubagentRunOwner } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { C as applySessionEntryExactReplacements } from "./session-accessor.reset-DWr6djSD.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { i as getSubagentRunsForChildSession, o as getSubagentRunsForRequesterSession } from "./subagent-registry-memory-guooOkCK.mjs";
import { n as SubagentRegistryMutationRejectedError } from "./subagent-registry-persistence-CNuPNZUt.mjs";
import { s as isRequesterSettleWakeForRun } from "./subagent-requester-settle-identity-Blu5INx9.mjs";
import { s as getLatestSubagentRunForChild } from "./subagent-registry-queries-rT6zMXb5.mjs";
import { r as resolveCompletionFromSessionEntry } from "./subagent-session-reconciliation-CJPnO-ah.mjs";
import { a as ownsSubagentSessionExecution, i as isRetiredSubagentSessionOwner, n as isRestartRecoveryLifecycleCurrent, r as isRetiredSubagentExecution, t as getRestartRecoveryReplayError } from "./subagent-registry-restart-recovery-helpers-Dete4bqJ.mjs";
import { n as captureSessionEntryCurrentRead } from "./session-entry-current-runtime-DVR59qVq.mjs";
//#region src/agents/subagents/registry/subagent-registry-restart-recovery-session.ts
function retainSessionOwner(storePath, sessionKey, sessionId) {
	const isCurrent = () => listAgentRunsForSession({
		sessionKey,
		sessionId
	}).length > 0 || isSessionWorkAdmissionActive(storePath, [sessionKey, sessionId]);
	return isCurrent() ? {
		isCurrent,
		released: getSessionWorkAdmissionRelease({
			scope: storePath,
			identities: [sessionKey, sessionId]
		})
	} : void 0;
}
async function loadSubagentRecoverySession(params) {
	const sessionKey = params.entry.childSessionKey.trim();
	const agentId = resolveAgentIdFromSessionKey(sessionKey);
	const storePath = resolveSessionStorePathCore(getRuntimeConfig().session?.store, { agentId });
	const scope = {
		storePath,
		sessionKey,
		projection: "list"
	};
	const { sessionEntry, currentRead } = await withSessionEntryReadOnlyInWorker(scope, () => {
		if (!params.isOwnerCurrent()) throw new Error("subagent recovery owner changed during session read");
	}, async (read, owner) => {
		if (!read.ok) throw read.error;
		return {
			sessionEntry: read.value,
			currentRead: captureSessionEntryCurrentRead(scope, owner)
		};
	});
	const retained = retainSessionOwner(storePath, sessionKey, sessionEntry?.sessionId);
	if (retained || params.entry.execution.restartRecovery || sessionEntry?.abortedLastRun === true || !isRetiredSubagentSessionOwner(params.entry, sessionEntry)) return {
		agentId,
		storePath,
		sessionEntry,
		currentRead,
		retained
	};
	const { sessionId, lifecycleRevision, updatedAt } = sessionEntry;
	const target = {
		sessionKey,
		sessionId
	};
	const isCurrent = () => params.isOwnerCurrent() && isRetiredSubagentExecution(params.entry) && listAgentRunsForSession(target).length === 0 && !isSessionWorkAdmissionActive(storePath, [sessionKey, sessionId]);
	const interrupted = await applySessionEntryExactReplacements({
		agentId,
		storePath,
		sessionKeys: [sessionKey],
		update: (entries) => {
			const current = entries[0]?.entry;
			if (!isCurrent() || !current || current.sessionId !== sessionId || current.lifecycleRevision !== lifecycleRevision || current.updatedAt !== updatedAt || !isRetiredSubagentSessionOwner(params.entry, current)) return { result: null };
			const interruptedEntry = {
				...current,
				abortedLastRun: true
			};
			return {
				result: interruptedEntry,
				replacements: [{
					sessionKey,
					entry: interruptedEntry
				}]
			};
		},
		assertCommitAllowed: () => {
			currentRead.assertSourceCurrent();
			if (!isCurrent()) throw new Error("subagent orphan ownership changed before interruption commit");
		},
		skipMaintenance: true
	});
	return interrupted ? {
		agentId,
		storePath,
		sessionEntry: interrupted,
		currentRead
	} : null;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-restart-recovery.ts
async function recoverInterruptedSubagentRow(params) {
	const { entry, runId } = params;
	let expectedObservation = entry;
	const childSessionKey = entry.childSessionKey.trim();
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const isGatewayCurrent = () => isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && params.isGatewayCurrent?.() !== false;
	const isCurrent = () => isGatewayCurrent() && params.isCurrent(runId, expectedObservation) && expectedObservation.pauseReason !== "sessions_yield" && expectedObservation.suppressAnnounceReason !== "steer-restart" && !expectedObservation.killIntent && !expectedObservation.killReconciliation && expectedObservation.execution.status !== "queued";
	if (!childSessionKey || !isCurrent()) return { status: "ignored" };
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
		if (!replayTerminal && session?.retained?.isCurrent()) return {
			status: "handled",
			retained: session.retained
		};
		const physicalStorePath = session && !replayTerminal && !entry.execution.restartRecovery ? (await prepareSqliteTargetFromSessionStorePath(session.storePath, { agentId: session.agentId })).path : void 0;
		if (!isCurrent()) return { status: "deferred" };
		const sessionEntry = session?.sessionEntry;
		const sessionId = sessionEntry?.sessionId;
		const lifecycleRevision = sessionEntry?.lifecycleRevision;
		const lifecycleRunId = sessionEntry?.lifecycleRunId;
		const sessionAgentId = session?.agentId;
		const target = {
			sessionKey: childSessionKey,
			sessionId
		};
		const hasPendingRequesterSettleWake = () => {
			if (!sessionAgentId || !sessionId || lifecycleRunId !== runId || entry.execution.restartRecovery || !params.gatewayRuntime) return false;
			const children = new Map([...getSubagentRunsForRequesterSession(childSessionKey)].filter((child) => getLatestSubagentRunForChild(getSubagentRunsForChildSession(child.childSessionKey, child.childAgentId), child) === child).map((child) => [child.runId, child]));
			return [...children.values()].some((child) => {
				const wake = child.requesterSettleWake;
				return wake?.status === "dispatching" && wake.requesterYieldBatch === true && wake.rearmGeneration !== void 0 && isRequesterSettleWakeForRun({
					entry: child,
					runId,
					requesterSessionKey: childSessionKey,
					requesterAgentId: sessionAgentId,
					runsById: children
				}) && wake.batchRunIds?.every((id) => {
					const member = children.get(id);
					return member?.expectsCompletionMessage === true && !member.collect && member.completionRequesterSessionId === sessionId && member.requesterStorePath === physicalStorePath && member.requesterAgentId === sessionAgentId && !member.suppressCompletionDelivery && !member.killReconciliation?.suppressTaskDelivery && member.requesterSettleWake?.status === "dispatching" && member.requesterSettleWake.rearmGeneration === wake.rearmGeneration && member.requesterSettleWake.attemptCount === wake.attemptCount && getGatewayContextResolver(member)?.()?.recoveryRuntime === params.gatewayRuntime;
				});
			});
		};
		if (!replayTerminal && hasPendingRequesterSettleWake()) return { status: "handled" };
		const currentRead = session?.currentRead;
		const storePath = session?.storePath;
		const matches = (current) => current?.sessionId === sessionId && current?.lifecycleRevision === lifecycleRevision && current?.lifecycleRunId === lifecycleRunId && (!replayTerminal || current !== void 0 && ownsSubagentSessionExecution(entry, current));
		const assertLive = () => {
			if (!currentRead || !storePath || !isGatewayCurrent() || listAgentRunsForSession(target).length !== 0 || isSessionWorkAdmissionActive(storePath, [childSessionKey, sessionId])) throw new Error("Subagent child session effects owner changed");
			return currentRead;
		};
		const assertCurrentEntry = (current) => {
			assertLive();
			if (!matches(current)) throw new Error("Subagent child session generation changed");
		};
		const sessionEffects = {
			async isCurrent() {
				try {
					const current = await assertLive().readCurrent();
					assertCurrentEntry(current);
					return true;
				} catch {
					return false;
				}
			},
			assertHostCurrent() {
				const reader = assertLive();
				reader.assertSourceCurrent();
				if (!reader.source) assertCurrentEntry(reader.readCurrent());
			},
			assertCurrentEntry,
			...currentRead?.source ? { nativeCheck: {
				source: currentRead.source,
				assertCurrent(current) {
					currentRead.assertSourceCurrent();
					assertCurrentEntry(current);
				}
			} } : {}
		};
		if (!replayTerminal && !await sessionEffects.isCurrent()) return { status: "handled" };
		if (!isCurrent()) return { status: "deferred" };
		if (!replayTerminal && sessionEntry?.lifecycleRunId && ownsSubagentSessionExecution(entry, sessionEntry) && resolveCompletionFromSessionEntry(sessionEntry, Date.now(), { notBeforeMs: entry.execution.startedAt ?? entry.createdAt })) return { status: "ignored" };
		const receipt = entry.execution.restartRecovery;
		if (!replayTerminal && !receipt && sessionEntry?.abortedLastRun !== true && entry.execution.status !== "interrupted") return { status: "ignored" };
		const suppressSessionEffects = currentRead?.kind === "missing" || receipt !== void 0 && !isRestartRecoveryLifecycleCurrent(receipt) || sessionEntry?.lifecycleRunId !== void 0 && !ownsSubagentSessionExecution(entry, sessionEntry);
		const resolveGatewayContext = params.gatewayRuntime ? getGatewayContextResolver(params.gatewayRuntime) : void 0;
		if (resolveGatewayContext) bindGatewayContextResolver(entry, resolveGatewayContext);
		const isRecoveryHostCurrent = () => {
			if (!isCurrent() || !replayTerminal && hasPendingRequesterSettleWake()) return false;
			if (!replayTerminal) try {
				sessionEffects.assertHostCurrent();
			} catch {
				return false;
			}
			return true;
		};
		return {
			status: "terminal",
			recoveryCurrent: {
				isHostCurrent: isRecoveryHostCurrent,
				prepare: async () => isRecoveryHostCurrent() && (replayTerminal || await sessionEffects.isCurrent()) && isRecoveryHostCurrent(),
				onPublished: (published) => {
					if (!isSameSubagentRunOwner(published, entry) || published.execution.status !== "terminal") throw new SubagentRegistryMutationRejectedError("Subagent recovery publication changed its execution owner");
					expectedObservation = published;
				}
			},
			sessionEffects,
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
