import { f as bindGatewayContextResolver, g as getGatewayContextResolver, l as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { I as listAgentRunsForSession } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { M as buildRestartRecoveryExpectedState } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { i as readSessionEntryReadOnlyInWorker, l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { b as isSessionWorkAdmissionActive, m as getSessionWorkAdmissionRelease } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./config-B3oiWDlr.mjs";
import { x as applySessionEntryExactReplacements } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import { i as resolveSubagentChildAuthority } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { E as getSubagentRunRuntimeKey, j as latestSubagentRun, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns, i as getCurrentSubagentRunOwner, l as getSubagentRunsForRequesterSession, s as getSubagentRunsForChildSession } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { o as decodeGatewayOperatorRecoverySource } from "./operator-run-authority-BcrXDfhQ.mjs";
import { n as captureSessionEntryCurrentRead } from "./session-entry-current-runtime-Dwzq8LTI.mjs";
import { t as captureOperatorToolGatewayContinuationContext } from "./server-plugin-in-process-authority-CiYjs5MA.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { a as assertSubagentRegistryWriteSourceCurrent } from "./subagent-registry-persistence-DE7WA4wN.mjs";
import { a as isRequesterCompletionCohortCurrent, f as sameRequesterSettleRunIdentity, i as hasRequesterCompletionCohort, s as isRequesterSettleWakeForRun } from "./subagent-requester-settle-identity-BXTgIS3Y.mjs";
import { r as isQuietSubagentRestartContinuation } from "./subagent-recovery-state-2yE_iEv1.mjs";
import { n as resolveCompletionFromSessionEntry, s as resolveSubagentChildSessionOwner } from "./subagent-session-reconciliation-DBq1r5kk.mjs";
import { r as restoreGatewayOperatorSource } from "./operator-run-recovery-BF0mZGB3.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/registry/subagent-registry-requester-source.ts
const deniedSources = /* @__PURE__ */ new WeakMap();
var RequesterSourceDeniedError = class extends Error {};
function isSourceDenial(error) {
	return error instanceof RequesterSourceDeniedError || error instanceof Error && /^Restart recovery (operator (authority|source|identity|profile)|authentication owner) /.test(error.message);
}
/** A denied source is terminal for this exact owner, not a new grant on the next sweep. */
function getUnrestorableSubagentCompletionSourceReason(entry) {
	return deniedSources.get(getSubagentRunRuntimeKey(entry));
}
/** Capture from the admitted source, never from delivery routing or display attribution. */
async function captureSubagentRequesterSource(params) {
	const { authority } = params;
	if (!authority?.recoverySnapshot || !params.requesterAgentId || !params.requesterTurnRunId) return;
	params.assertCurrent();
	authority.assertCurrent();
	const entry = await readSessionEntryReadOnlyInWorker({
		agentId: params.requesterAgentId,
		sessionKey: params.requesterSessionKey
	}, params.assertCurrent);
	params.assertCurrent();
	authority.assertCurrent();
	if (entry?.incognito) return;
	if (!entry || entry.archivedAt !== void 0) throw new Error("Original requester session is unavailable for child custody");
	return decodeGatewayOperatorRecoverySource({
		version: 1,
		agentId: params.requesterAgentId,
		sessionKey: params.requesterSessionKey,
		sessionId: entry.sessionId,
		...entry.lifecycleRevision ? { lifecycleRevision: entry.lifecycleRevision } : {},
		sourceRunId: params.requesterTurnRunId,
		snapshot: {
			...authority.recoverySnapshot,
			scopes: intersectOperatorScopes(authority.recoverySnapshot.scopes, authority.scopes)
		}
	});
}
/** Cold restoration reauthorizes the saved principal under current policy and exact session custody. */
async function restoreSubagentRequesterSource(entry, resolver, isGatewayCurrent) {
	if (!entry.completionAuthorityRequired && !entry.operatorRecoverySource) return;
	if (subagentRuns.hasCompletionAuthority(entry)) return;
	subagentRuns.requireCompletionAuthority(entry);
	const key = getSubagentRunRuntimeKey(entry);
	if (deniedSources.has(key) || subagentRuns.isCompletionAuthorityRetired(entry)) return;
	const gateway = resolver();
	const stateContext = captureOpenClawStateWorkerContext();
	const generation = getAgentEventLifecycleGeneration();
	const revoked = new AbortController();
	let retained = false;
	let releaseRestored;
	let continuation;
	const stop = onSessionIdentityMutation((mutation) => {
		if (mutation.agentId === entry.requesterAgentId && (mutation.previous.sessionId === entry.operatorRecoverySource?.sessionId || mutation.previous.sessionKeys.includes(entry.requesterSessionKey))) revoked.abort(new RequesterSourceDeniedError("Original requester session changed during restoration"));
	});
	const assertHostCurrent = () => {
		assertSubagentRegistryWriteSourceCurrent(stateContext);
		const current = getCurrentSubagentRunOwner(subagentRuns, entry);
		if (!gateway || !isGatewayCurrent() || resolver() !== gateway || !isAgentEventLifecycleGenerationCurrent(generation) || !current || getGatewayContextResolver(current) !== resolver) throw new Error("Child custody restoration lost its exact runtime owner");
	};
	const assertCurrent = () => {
		assertHostCurrent();
		revoked.signal.throwIfAborted();
		if (subagentRuns.isCompletionAuthorityRetired(entry)) throw new RequesterSourceDeniedError("Original requester custody was retired");
	};
	try {
		assertCurrent();
		if (!entry.operatorRecoverySource) {
			deniedSources.set(key, "The original requester has no restorable authentication source");
			return;
		}
		let source;
		try {
			source = decodeGatewayOperatorRecoverySource(entry.operatorRecoverySource);
		} catch (cause) {
			throw new RequesterSourceDeniedError("Original requester source is malformed", { cause });
		}
		if (source.agentId !== entry.requesterAgentId || source.sessionKey !== entry.requesterSessionKey || entry.requesterTurnRunId !== void 0 && source.sourceRunId !== entry.requesterTurnRunId || !entry.requesterStorePath || entry.completionRequesterSessionId !== void 0 && source.sessionId !== entry.completionRequesterSessionId || entry.completionRequesterLifecycleRevision !== void 0 && source.lifecycleRevision !== entry.completionRequesterLifecycleRevision) {
			deniedSources.set(key, "The saved source does not own this exact requester continuation");
			return;
		}
		const prepareCurrent = async () => {
			assertCurrent();
			const current = getCurrentSubagentRunOwner(subagentRuns, entry);
			if (!isDeepStrictEqual(current?.operatorRecoverySource, source)) throw new RequesterSourceDeniedError("Original requester source was replaced");
			const requester = await readSessionEntryReadOnlyInWorker({
				agentId: source.agentId,
				sessionKey: source.sessionKey,
				storePath: entry.requesterStorePath
			}, assertCurrent);
			assertCurrent();
			if (!requester || requester.sessionId !== source.sessionId || requester.lifecycleRevision !== source.lifecycleRevision || requester.archivedAt !== void 0) throw new RequesterSourceDeniedError("Original requester session was reset, replaced, or archived");
		};
		await prepareCurrent();
		const restored = await restoreGatewayOperatorSource({
			snapshot: source.snapshot,
			target: source,
			context: gateway,
			assertCurrent,
			prepareCurrent
		});
		releaseRestored = restored.release;
		assertCurrent();
		const client = createSyntheticPluginRuntimeClient({
			authenticatedUserProfile: restored.authenticatedUserProfile,
			operatorRoleActor: {
				kind: "operator",
				profileId: source.snapshot.profileId
			},
			operatorRunAuthority: restored.authority,
			scopes: source.snapshot.scopes
		});
		continuation = await withPluginRuntimeGatewayRequestScope({
			client,
			context: gateway,
			resolveGatewayContext: resolver,
			isWebchatConnect: () => false
		}, () => captureOperatorToolGatewayContinuationContext());
		await prepareCurrent();
		if (!continuation?.operatorAuthority) throw new RequesterSourceDeniedError("The exact requester source could not be reauthorized");
		const captured = continuation;
		subagentRuns.bindCompletionAuthority(entry, {
			...captured,
			signal: AbortSignal.any([captured.signal, revoked.signal]),
			assertCurrent() {
				assertCurrent();
				captured.assertCurrent();
			},
			run(run) {
				assertCurrent();
				return captured.run(run);
			},
			release() {
				stop();
				captured.release();
				restored.release();
			}
		});
		retained = true;
	} catch (error) {
		assertHostCurrent();
		if (!isSourceDenial(error)) throw error;
		deniedSources.set(key, "The original requester source is no longer authorized");
	} finally {
		if (!retained) {
			stop();
			continuation?.release();
			releaseRestored?.();
		}
	}
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-recovery-notice.ts
/** Local outcome only: denied original authority must never deliver to another requester. */
async function appendDeniedSubagentRecoveryNotice(params) {
	const { entry } = params;
	if (!params.reason || params.suppressSessionEffects || !entry || entry.status !== "interrupted" || entry.lastRunId !== params.runId || entry.lifecycleRunId !== void 0 && entry.lifecycleRunId !== params.runId || !params.agentId || !params.storePath) return;
	params.assertCurrent();
	const notice = await appendAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		expectedSessionId: entry.sessionId,
		expectedLifecycleRevision: entry.lifecycleRevision ?? null,
		expectedSessionState: buildRestartRecoveryExpectedState(entry),
		assertCurrent: params.assertCurrent,
		idempotencyKey: "subagent-restart:" + params.runId + ":interrupted",
		text: "This interrupted turn could not resume after the Gateway restarted: " + params.reason + ". Your session and transcript are preserved. Send a new authenticated message to continue."
	});
	params.assertCurrent();
	if (!notice.ok) throw new Error("Subagent recovery interruption notice was not saved: " + notice.reason);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-restart-recovery-helpers.ts
function isRestartRecoveryLifecycleCurrent(receipt) {
	return !receipt.lifecycleGeneration || isAgentEventLifecycleGenerationCurrent(receipt.lifecycleGeneration);
}
function isRetiredSubagentExecution(entry) {
	return (entry.execution.status === "running" || entry.execution.status === "interrupted") && typeof entry.execution.lifecycleGeneration === "string" && !isAgentEventLifecycleGenerationCurrent(entry.execution.lifecycleGeneration);
}
function isRetiredSubagentSessionOwner(entry, session) {
	return session !== void 0 && (session.status === void 0 || session.status === "interrupted") && isRetiredSubagentExecution(entry) && (session.lifecycleRunId === void 0 && session.lastRunId === void 0 || ownsSubagentSessionExecution(entry, session));
}
function ownsSubagentSessionExecution(entry, session) {
	return session.lifecycleRunId === entry.runId || entry.execution.transcriptTarget !== void 0 && entry.taskRunId !== void 0 && session.lifecycleRunId === (session.subagentRecovery?.sessionLifecycleRunId ?? entry.taskRunId) && session.subagentRecovery?.lastRunId === entry.runId;
}
//#endregion
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
	if (resolveSubagentChildAuthority(params.entry).status === "mismatch") return null;
	const { agentId, storePath } = resolveSubagentChildSessionOwner(params.entry, readRuntimeConfig());
	const scope = {
		agentId,
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
	const authority = resolveSubagentChildAuthority(params.entry, sessionEntry);
	if (authority.status === "mismatch") return {
		agentId,
		storePath,
		sessionEntry,
		currentRead,
		replacementReason: authority.error
	};
	const retained = retainSessionOwner(storePath, sessionKey, sessionEntry?.sessionId);
	if (authority.status === "legacy-unverified" || retained || params.entry.execution.restartRecovery || sessionEntry?.abortedLastRun === true || !isRetiredSubagentSessionOwner(params.entry, sessionEntry)) return {
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
//#region src/agents/subagents/registry/subagent-restored-wake-readiness.ts
/** A retained receipt is not a runnable foreground input until its whole cohort is ready. */
function isRestoredRequesterWakeRunnable(entry, rows, pauseNotice) {
	const wake = entry.requesterSettleWake;
	if (!wake || wake.status === "pending" && wake.attemptCount === 0 || entry.collect || entry.killIntent || entry.killReconciliation || entry.suppressCompletionDelivery || entry.execution.restartRecovery || entry.terminalOwner === "interrupted-recovery") return false;
	if (pauseNotice) return entry.pauseReason === "sessions_yield" && Boolean(wake.pauseNotice);
	if (entry.pauseReason === "sessions_yield" || entry.execution.status !== "terminal" || entry.execution.endedAt === void 0) return false;
	const inventory = [...rows];
	const visited = /* @__PURE__ */ new Set();
	const settled = (parent) => {
		const key = JSON.stringify([parent.childAgentId, parent.childSessionKey]);
		if (visited.has(key)) return false;
		visited.add(key);
		return inventory.filter((child) => child.requesterSessionKey === parent.childSessionKey && child.requesterAgentId === parent.childAgentId && child.cleanupCompletedAt === void 0).every((child) => child.execution.status === "terminal" && child.execution.endedAt !== void 0 && child.pauseReason !== "sessions_yield" && !child.execution.restartRecovery && child.terminalOwner !== "interrupted-recovery" && settled(child));
	};
	return settled(entry);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-restart-recovery.ts
/** The dispatched frozen cohort owns this exact requester input across a restart. */
function findRequesterSettleWakeRecoveryBatch(params, requireGatewayCurrent = true, allowPending = false, requireRunnable = true) {
	const children = new Map([...getSubagentRunsForRequesterSession(params.requesterSessionKey)].map((child) => [child.runId, child]));
	for (const child of children.values()) {
		const wake = child.requesterSettleWake;
		if (!(wake?.status === "dispatching" || allowPending && wake?.status === "pending") || !(hasRequesterCompletionCohort(child) || isQuietSubagentRestartContinuation(child)) || !isRequesterSettleWakeForRun({
			entry: child,
			runId: params.runId,
			requesterSessionKey: params.requesterSessionKey,
			requesterAgentId: params.requesterAgentId,
			runsById: children
		})) continue;
		const batchRunIds = child.pauseReason === "sessions_yield" && wake.pauseNotice ? [child.runId] : wake.batchRunIds ?? [];
		const batch = batchRunIds.flatMap((id) => {
			const member = children.get(id);
			return member?.requesterSettleWake !== void 0 && member.requesterSettleWake.rearmGeneration === wake.rearmGeneration ? [member] : [];
		});
		if (batch.length > 0 && new Set(batchRunIds).size === batchRunIds.length && batch.every((member) => (!requireRunnable || isRestoredRequesterWakeRunnable(member, subagentRuns.values(), Boolean(wake.pauseNotice))) && isRequesterCompletionCohortCurrent(member, (key, matches, agentId) => latestSubagentRun(getSubagentRunsForChildSession(key, agentId), matches) ?? null) && (member.expectsCompletionMessage === true || isQuietSubagentRestartContinuation(member)) && !member.collect && member.completionRequesterSessionId === params.sessionId && (member.completionTarget !== "parent" || member.completionRequesterLifecycleRevision === params.lifecycleRevision) && member.requesterStorePath === params.storePath && member.requesterAgentId === params.requesterAgentId && !member.suppressCompletionDelivery && !member.killReconciliation?.suppressTaskDelivery && (member.requesterSettleWake?.status === "dispatching" || allowPending && member.requesterSettleWake?.status === "pending") && member.requesterSettleWake.rearmGeneration === wake.rearmGeneration && member.requesterSettleWake.attemptCount === wake.attemptCount && (!requireGatewayCurrent || getGatewayContextResolver(member)?.()?.recoveryRuntime === params.gatewayRuntime))) return batch;
	}
}
function captureRequesterSettleWakeRecoverySource(params) {
	assertSubagentRegistryWriteSourceCurrent(params.context);
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const batch = findRequesterSettleWakeRecoveryBatch(params, true, true);
	if (!batch) {
		if (findRequesterSettleWakeRecoveryBatch(params, false, true)) throw new Error("Requester settle recovery awaits its current Gateway binding");
		return;
	}
	const assertCurrent = () => {
		assertSubagentRegistryWriteSourceCurrent(params.context);
		const current = findRequesterSettleWakeRecoveryBatch(params, true, true);
		if (!isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) || !current || current.length !== batch.length || !batch.every((observed) => current.some((member) => isSameSubagentRunOwner(member, observed) && sameRequesterSettleRunIdentity(member, observed) && member.requesterSettleWake?.attemptCount === observed.requesterSettleWake?.attemptCount && member.requesterSettleWake?.yieldedFinalDeliverable === observed.requesterSettleWake?.yieldedFinalDeliverable))) throw new Error("Requester settle recovery lost its exact dispatched cohort");
		subagentRuns.runWithCompletionBatchAuthority(current, () => {});
	};
	assertCurrent();
	return Object.assign(assertCurrent, {
		nativeSource: true,
		async prepareSessionSource() {
			assertCurrent();
			return {
				nativeSource: true,
				checks: [],
				assertCurrent
			};
		}
	});
}
async function recoverInterruptedSubagentRow(params) {
	const { entry, runId } = params;
	const authority = resolveSubagentChildAuthority(entry);
	if (authority.status === "mismatch") {
		params.warn("retained subagent record cannot be recovered", {
			runId,
			childSessionKey: entry.childSessionKey,
			error: new Error(authority.error)
		});
		return { status: "deferred" };
	}
	let expectedObservation = entry;
	const childSessionKey = entry.childSessionKey.trim();
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const isGatewayCurrent = () => isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && params.isGatewayCurrent?.() !== false;
	const isCurrent = () => isGatewayCurrent() && params.isCurrent(runId, expectedObservation) && expectedObservation.pauseReason !== "sessions_yield" && expectedObservation.suppressAnnounceReason !== "steer-restart" && !expectedObservation.killIntent && !expectedObservation.killReconciliation && expectedObservation.execution.status !== "queued";
	if (!childSessionKey || !isCurrent()) return { status: "ignored" };
	const terminalError = entry.terminalOwner === "interrupted-recovery" && entry.pauseReason !== "sessions_yield" && entry.execution.status === "terminal" && typeof entry.execution.endedAt === "number" && entry.execution.outcome?.status === "error" && entry.endedReason === "subagent-error" ? entry.execution.outcome.error ?? "subagent run interrupted by gateway restart" : void 0;
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
		if (session?.replacementReason) return {
			status: "terminal",
			recoveryCurrent: {
				isHostCurrent: isCurrent,
				prepare: async () => isCurrent(),
				onPublished: (published) => {
					expectedObservation = published;
				}
			},
			error: terminalError ?? session.replacementReason,
			endedAt: replayTerminal ? entry.execution.endedAt : void 0,
			suppressSessionEffects: true
		};
		const legacy = authority.status === "legacy-unverified";
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
			return Boolean(physicalStorePath && findRequesterSettleWakeRecoveryBatch({
				runId,
				requesterSessionKey: childSessionKey,
				requesterAgentId: sessionAgentId,
				sessionId,
				lifecycleRevision,
				storePath: physicalStorePath,
				gatewayRuntime: params.gatewayRuntime
			}, true, false, false));
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
		if (!legacy && !replayTerminal && !await sessionEffects.isCurrent()) return { status: "handled" };
		if (!isCurrent()) return { status: "deferred" };
		if (!replayTerminal && sessionEntry?.lifecycleRunId && (legacy ? sessionEntry.lifecycleRunId === runId : ownsSubagentSessionExecution(entry, sessionEntry)) && resolveCompletionFromSessionEntry(sessionEntry, Date.now(), { notBeforeMs: entry.execution.startedAt ?? entry.createdAt })) return { status: "ignored" };
		const receipt = entry.execution.restartRecovery;
		if (!legacy && !replayTerminal && !receipt && sessionEntry?.abortedLastRun !== true && entry.execution.status !== "interrupted") return { status: "ignored" };
		const suppressSessionEffects = legacy || currentRead?.kind === "missing" || receipt !== void 0 && !isRestartRecoveryLifecycleCurrent(receipt) || sessionEntry?.lifecycleRunId !== void 0 && !ownsSubagentSessionExecution(entry, sessionEntry);
		const resolveGatewayContext = params.gatewayRuntime ? getGatewayContextResolver(params.gatewayRuntime) : void 0;
		if (resolveGatewayContext) bindGatewayContextResolver(entry, resolveGatewayContext);
		const isRecoveryHostCurrent = () => {
			if (!isCurrent() || !replayTerminal && hasPendingRequesterSettleWake()) return false;
			if (!legacy && !replayTerminal) try {
				sessionEffects.assertHostCurrent();
			} catch {
				return false;
			}
			return true;
		};
		await appendDeniedSubagentRecoveryNotice({
			runId,
			reason: getUnrestorableSubagentCompletionSourceReason(entry),
			agentId: sessionAgentId,
			sessionKey: childSessionKey,
			storePath,
			entry: sessionEntry,
			suppressSessionEffects,
			assertCurrent: () => {
				if (!isRecoveryHostCurrent()) throw new Error("Subagent recovery notice owner changed");
			}
		});
		return {
			status: "terminal",
			recoveryCurrent: {
				isHostCurrent: isRecoveryHostCurrent,
				prepare: async () => isRecoveryHostCurrent() && (legacy || replayTerminal || await sessionEffects.isCurrent()) && isRecoveryHostCurrent(),
				onPublished: (published) => {
					expectedObservation = published;
				}
			},
			sessionEffects: legacy ? void 0 : sessionEffects,
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
export { restoreSubagentRequesterSource as a, captureSubagentRequesterSource as i, recoverInterruptedSubagentRow as n, isRetiredSubagentSessionOwner as r, captureRequesterSettleWakeRecoverySource as t };
