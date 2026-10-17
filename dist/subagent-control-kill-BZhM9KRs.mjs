import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { a as getGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BSmCVVpP.mjs";
import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { _ as startSessionWorkAdmissionInterruption, g as runExclusiveSessionLifecycleMutation, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, v as waitForSessionWorkAdmissionRelease } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { S as isSameSubagentRunOwner, h as compareSubagentRunGeneration } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-DGv2EKii.mjs";
import { d as isEmbeddedAgentRunActive, n as abortEmbeddedAgentRun } from "./runs-CzCPh-gu.mjs";
import { t as isSessionDeliveryGenerationRevokedError } from "./session-delivery-generation-DbcbeEMM.mjs";
import { o as holdQueuedSwarmRun } from "./swarm-scheduler-BnTRUM_W.mjs";
import { i as isCurrentChatAbortExecution } from "./chat-abort-lifecycle-internal-t_mR3jTJ.mjs";
import { r as getCurrentSubagentRunOwner, u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { I as captureSubagentExecution, L as getSubagentExecutionCleanup, N as persistSubagentAbortedLastRun, P as prepareSubagentKillSession, R as resolveSubagentKillTargetState, T as releaseSubagentRunKillClaim, o as cancelSubagentRequesterSettleWake, s as claimSubagentRunKill, y as markSubagentRunTerminated } from "./subagent-registry-CbljYI1R.mjs";
import { s as persistSubagentSessionTiming } from "./subagent-registry-helpers-BFDhUyy1.mjs";
import { y as withSubagentRunReadSnapshot } from "./subagent-registry-state-CVSclnHX.mjs";
import { a as assertSubagentRegistryWriteOutcomeKnown, i as SubagentRegistryWriteError, o as assertSubagentRegistryWriteSourceCurrent } from "./subagent-registry-persistence-7pBNp1rN.mjs";
import { d as listRunsForControllerFromRuns } from "./subagent-registry-queries-rT6zMXb5.mjs";
import { c as listSubagentRunsForController, l as listSubagentRunsForRequester } from "./subagent-registry-read-BE_xWkJl.mjs";
import { s as resolveSubagentChildSessionOwner } from "./subagent-session-reconciliation-CtdzcsHV.mjs";
import { t as resolveSubagentRequesterAgentId } from "./subagent-requester-owner-DUxJU45s.mjs";
import { n as resolveSubagentLabel } from "./subagents-utils-DtuM-aOJ.mjs";
import { a as getLatestOwnedSubagentRun, i as ensureSubagentControllerOwnsRun, o as isCurrentSubagentRun } from "./subagent-control-scope-BUbMQYni.mjs";
import { n as clearSessionLifecycleQueues } from "./cleanup-BpxFFEMQ.mjs";
import "./subagent-control.runtime-Dsu-J2AF.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/registry/subagent-control-kill-runtime.ts
async function markSubagentRunTerminatedBestEffort(params) {
	try {
		return await markSubagentRunTerminated(params);
	} catch (error) {
		if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
		logVerbose(`subagents control kill: failed to persist ${params.runId ?? params.childSessionKey ?? "unknown"}: ${formatErrorMessage(error)}`);
		return 0;
	}
}
async function mutateSubagentRunForKill(params, captureExecution, stopAcceptance) {
	const { stateContext } = params;
	const currentEntry = () => getCurrentSubagentRunOwner(subagentRuns, params.entry);
	const assertKnownOutcome = () => {
		const current = currentEntry();
		assertSubagentRegistryWriteOutcomeKnown([current?.runId ?? params.entry.runId], stateContext.admission);
	};
	const assertState = () => {
		stateContext.admission.assertCurrent();
		assertKnownOutcome();
		params.session.assertCurrent();
	};
	assertState();
	const targetState = () => {
		const current = currentEntry();
		return current ? resolveSubagentKillTargetState(current) : void 0;
	};
	const isCurrent = (requirePreparedSession = true) => {
		const current = currentEntry();
		return current !== void 0 && params.isCurrent(current, requirePreparedSession);
	};
	const assertSelectedNativeRun = () => {
		assertSubagentRegistryWriteSourceCurrent(stateContext);
		assertKnownOutcome();
		if (!isCurrent(false)) throw new Error("Subagent kill settlement lost its original run");
	};
	const assertSelectedRun = () => {
		assertSelectedNativeRun();
		params.session.assertCurrent();
	};
	const markKilledBestEffort = () => {
		const selected = currentEntry();
		return selected ? markSubagentRunTerminatedBestEffort({
			runId: selected.runId,
			session: params.session,
			withdrawQueuedReservation: params.withdrawQueuedReservation,
			reason: "killed",
			suppressTaskDelivery: params.suppressTaskDelivery,
			context: stateContext,
			assertCurrent: assertSelectedRun
		}) : Promise.resolve(0);
	};
	const initial = currentEntry();
	if (!initial || !isCurrent()) return {
		killed: false,
		superseded: true
	};
	if (resolveSubagentKillTargetState(initial)) {
		if (params.suppressTaskDelivery && initial.requesterSettleWake) await cancelSubagentRequesterSettleWake(initial, () => {
			params.cancellationControl.assertCurrent();
			if (!isCurrent()) throw new Error("Subagent ownership changed during cancellation; retry.");
		});
		if (currentEntry()?.endedReason === "subagent-killed" && currentEntry()?.suppressAnnounceReason !== "steer-restart") await markKilledBestEffort();
		if (!isCurrent()) return {
			killed: false,
			superseded: true
		};
		return {
			killed: false,
			targetState: targetState()
		};
	}
	if (initial.execution.endedAt && initial.pauseReason !== "sessions_yield") return { killed: false };
	const childSessionKey = params.entry.childSessionKey;
	const resolved = params.session;
	const sessionId = resolved.entry?.sessionId;
	const sessionLifecycleRevision = resolved.entry?.lifecycleRevision;
	let admission = "ready";
	let killClaim;
	const claimSelectedRunKill = async () => {
		try {
			let selected = currentEntry();
			for (let attempt = 0; selected && attempt < 2; attempt++) {
				const claim = await claimSubagentRunKill({
					runId: selected.runId,
					expected: params.entry,
					sessionId,
					sessionLifecycleRevision,
					suppressTaskDelivery: params.suppressTaskDelivery,
					context: stateContext,
					assertCurrent: () => {
						assertState();
						params.cancellationControl.assertCurrent();
					},
					assertPublicationCurrent: assertSelectedNativeRun
				});
				if (claim) return { claim };
				const accepted = currentEntry();
				if (!accepted || accepted.runId === selected.runId) return { claim: void 0 };
				selected = accepted;
			}
			return { claim: void 0 };
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			return { failure: {
				killed: false,
				error: `Failed to persist subagent kill intent: ${formatErrorMessage(error instanceof SubagentRegistryWriteError ? error.cause : error)}`
			} };
		}
	};
	let preparationResult;
	const releaseKillClaim = (claim) => {
		const selected = currentEntry();
		return selected ? releaseSubagentRunKillClaim({
			runId: selected.runId,
			expected: params.entry,
			claim,
			context: stateContext
		}) : Promise.resolve(false);
	};
	const stillActive = async () => {
		try {
			if (killClaim && !stopAcceptance.accepted) await releaseKillClaim(killClaim);
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			return {
				killed: false,
				error: `Subagent remained active and its kill intent could not be released: ${formatErrorMessage(error)}`
			};
		}
		return {
			killed: false,
			error: stopAcceptance.accepted ? "Subagent accepted cancellation but is still active; cleanup is pending." : "Subagent is still active; try the kill again in a moment."
		};
	};
	const cancellationFailure = async (error, declined) => {
		let reason = formatErrorMessage(error);
		if (killClaim && !stopAcceptance.accepted) try {
			await releaseKillClaim(killClaim);
		} catch (releaseError) {
			if (hasSqliteWorkerOutcomeUnknown(releaseError)) throw releaseError;
			reason += ` Kill intent could not be released: ${formatErrorMessage(releaseError)}`;
		}
		return {
			killed: false,
			...declined ? { declined } : {},
			error: reason
		};
	};
	const declineRevokedCancellation = () => {
		try {
			params.cancellationControl.assertCurrent();
			return;
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			return cancellationFailure(error, true);
		}
	};
	const isKilledTarget = (target) => target.state === "terminal" && target.task.status === "cancelled" && target.task.error === "Subagent run killed.";
	const ownsKillIntent = (current, claim) => {
		const intent = current?.killIntent;
		return intent !== void 0 && intent.requestedAt === claim.requestedAt && intent.reason === claim.reason && intent.lifecycleGeneration === claim.lifecycleGeneration && intent.sessionId === claim.sessionId && intent.sessionLifecycleRevision === claim.sessionLifecycleRevision && intent.suppressTaskDelivery === claim.suppressTaskDelivery;
	};
	const killOwnerCurrent = () => {
		const current = currentEntry();
		return current !== void 0 && isCurrent() && (!killClaim || (ownsKillIntent(current, killClaim) || !current.killIntent && current.endedReason === "subagent-killed" && current.killReconciliation?.killedAt === killClaim.requestedAt && current.killReconciliation.taskCancellationAccepted === true && current.execution.lifecycleGeneration === killClaim.lifecycleGeneration) && (killClaim.lifecycleGeneration === void 0 || isAgentEventLifecycleGenerationCurrent(killClaim.lifecycleGeneration)));
	};
	const ownsSessionIncarnation = () => {
		try {
			assertState();
			return true;
		} catch (error) {
			if (isSessionDeliveryGenerationRevokedError(error)) return false;
			throw error;
		}
	};
	const releaseChangedSessionKill = async (claim) => {
		try {
			await releaseKillClaim(claim);
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			return {
				killed: false,
				error: `Subagent session changed and its kill intent could not be released: ${formatErrorMessage(error)}`
			};
		}
		return {
			killed: false,
			error: "Subagent session changed while the kill was pending; retry."
		};
	};
	return await runExclusiveSessionLifecycleMutation("subagent-kill", {
		scope: resolved.storePath,
		identities: [childSessionKey, sessionId],
		prepare: async () => {
			for (let pending = params.cancellationControl.prepareRead?.(); pending; pending = params.cancellationControl.prepareRead?.()) await pending;
			if (!isCurrent()) return;
			{
				const declined = declineRevokedCancellation();
				if (declined) {
					preparationResult = await declined;
					return;
				}
			}
			await params.refreshDescendants();
			assertState();
			const execution = captureExecution()?.execution;
			const alreadyAborted = execution?.controller.signal.aborted;
			try {
				if (params.beforeSessionKill?.() === false) {
					admission = "declined";
					return;
				}
			} finally {
				stopAcceptance.accepted ||= !alreadyAborted && execution?.controller.signal.aborted === true;
			}
			if (!isCurrent()) return;
			{
				const declined = declineRevokedCancellation();
				if (declined) {
					preparationResult = await declined;
					return;
				}
			}
			const beforeInterruption = currentEntry();
			if (!beforeInterruption) return;
			if (beforeInterruption.swarmLaunchPending !== true && beforeInterruption.execution.restartRecovery === void 0 && !resolveSubagentKillTargetState(beforeInterruption)) {
				const claimed = await claimSelectedRunKill();
				if (claimed.failure) {
					preparationResult = claimed.failure;
					return;
				}
				killClaim = claimed.claim;
				if (killClaim) {
					if (!ownsSessionIncarnation()) {
						preparationResult = await releaseChangedSessionKill(killClaim);
						return;
					}
					if (!killOwnerCurrent()) {
						preparationResult = {
							killed: false,
							superseded: true
						};
						return;
					}
				}
			}
			{
				const declined = declineRevokedCancellation();
				if (declined) {
					preparationResult = await declined;
					return;
				}
			}
			assertState();
			if (!killOwnerCurrent()) {
				preparationResult = {
					killed: false,
					superseded: true
				};
				return;
			}
			captureExecution();
			const interruption = startSessionWorkAdmissionInterruption({
				scope: resolved.storePath,
				identities: [childSessionKey, sessionId],
				reason: createAgentRunDirectAbortError()
			});
			const interruptedSelectedRun = () => {
				const selected = currentEntry();
				return selected !== void 0 && killOwnerCurrent() && (interruption.interruptedRunIds.has(params.entry.runId) || interruption.interruptedRunIds.has(selected.runId));
			};
			stopAcceptance.accepted ||= interruptedSelectedRun();
			const released = await waitForSessionWorkAdmissionRelease(interruption.released, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS);
			admission = released ? "ready" : "busy";
			stopAcceptance.accepted ||= interruptedSelectedRun();
			const afterInterruption = currentEntry();
			if (released && params.beforeSessionKill && afterInterruption?.swarmLaunchPending === true && afterInterruption.execution.restartRecovery === void 0 && !resolveSubagentKillTargetState(afterInterruption) && isCurrent()) {
				const claimed = await claimSelectedRunKill();
				if (claimed.failure) preparationResult = claimed.failure;
				else killClaim = claimed.claim;
			}
		},
		run: async () => {
			if (preparationResult) return preparationResult;
			if (admission === "declined") return {
				killed: false,
				declined: true
			};
			if (admission === "busy") return stillActive();
			let readFailure;
			try {
				for (let pending = params.cancellationControl.prepareRead?.(); pending; pending = params.cancellationControl.prepareRead?.()) await pending;
			} catch (error) {
				if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
				if (!stopAcceptance.accepted) return cancellationFailure(error);
				readFailure = { error };
			}
			if (!isCurrent()) return {
				killed: false,
				superseded: true
			};
			if (killClaim && !ownsSessionIncarnation()) return releaseChangedSessionKill(killClaim);
			if (!readFailure) await params.refreshDescendants();
			if (!isCurrent()) return {
				killed: false,
				superseded: true
			};
			const targetStateAfterAdmission = targetState();
			if (targetStateAfterAdmission) {
				const killedTarget = isKilledTarget(targetStateAfterAdmission);
				const claimedCurrentKill = killClaim !== void 0 && killOwnerCurrent();
				if (killedTarget && (!killClaim || claimedCurrentKill)) await markKilledBestEffort();
				return {
					killed: killedTarget && claimedCurrentKill,
					targetState: targetStateAfterAdmission,
					...readFailure ? { error: formatErrorMessage(readFailure.error) } : {}
				};
			}
			const declined = readFailure ? void 0 : declineRevokedCancellation();
			if (declined && !stopAcceptance.accepted) return declined;
			if (!killClaim) {
				const claimed = await claimSelectedRunKill();
				if (claimed.failure) return claimed.failure;
				killClaim = claimed.claim;
			}
			if (!killClaim) return {
				killed: false,
				superseded: true
			};
			const claimedKill = killClaim;
			const settleTargetCancellation = async () => {
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				if (!killOwnerCurrent()) return {
					killed: false,
					superseded: true
				};
				const selected = currentEntry();
				if (!selected) return {
					killed: false,
					superseded: true
				};
				let marked = 0;
				try {
					marked = await markSubagentRunTerminated({
						runId: selected.runId,
						session: params.session,
						withdrawQueuedReservation: params.withdrawQueuedReservation,
						reason: "killed",
						suppressTaskDelivery: params.suppressTaskDelivery,
						context: stateContext,
						assertCurrent: () => {
							assertState();
							if (!stopAcceptance.accepted) params.cancellationControl.assertCurrent();
							if (!killOwnerCurrent()) throw new Error("Subagent kill settlement lost its original claim.");
						},
						assertPublicationCurrent: () => {
							assertState();
							if (!killOwnerCurrent()) throw new Error("Subagent kill publication lost its original claim");
						},
						onPublished: (count) => {
							marked = count;
						}
					});
				} catch (error) {
					if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
					return {
						killed: marked > 0,
						error: `Failed to ${marked > 0 ? "finish subagent kill cleanup" : "persist subagent kill tombstone"}: ${formatErrorMessage(error)}`
					};
				}
				if (marked === 0) {
					assertState();
					if (!isCurrent()) return {
						killed: false,
						superseded: true
					};
					return {
						killed: false,
						targetState: targetState()
					};
				}
				return { killed: marked > 0 };
			};
			try {
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				if (!killOwnerCurrent()) return {
					killed: false,
					superseded: true
				};
				if (readFailure || declined) {
					const settled = await settleTargetCancellation();
					return readFailure ? {
						...settled,
						error: [settled.error, formatErrorMessage(readFailure.error)].filter(Boolean).join(" ")
					} : settled;
				}
				const active = sessionId ? isEmbeddedAgentRunActive(sessionId) : false;
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				const declinedBeforeAbort = declineRevokedCancellation();
				if (declinedBeforeAbort) return stopAcceptance.accepted ? await settleTargetCancellation() : declinedBeforeAbort;
				if (!killOwnerCurrent()) return {
					killed: false,
					superseded: true
				};
				const aborted = sessionId ? abortEmbeddedAgentRun(sessionId) : false;
				stopAcceptance.accepted ||= aborted;
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				const declinedBeforeQueueClear = declineRevokedCancellation();
				if (declinedBeforeQueueClear) return stopAcceptance.accepted ? await settleTargetCancellation() : declinedBeforeQueueClear;
				if (!killOwnerCurrent()) return {
					killed: false,
					superseded: true
				};
				const cleared = clearSessionLifecycleQueues({
					keys: [childSessionKey, sessionId],
					agentId: resolved.agentId,
					sessionKey: childSessionKey,
					sessionId,
					assertCurrent: () => {
						assertState();
						params.cancellationControl.assertCurrent();
						if (!killOwnerCurrent()) throw new Error("Subagent queue cleanup lost its original kill claim.");
					}
				});
				if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`subagents control kill: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
				if (active && !stopAcceptance.accepted) return stillActive();
				const settledTarget = targetState();
				if (settledTarget) {
					const killedTarget = isKilledTarget(settledTarget);
					if (killedTarget) await markKilledBestEffort();
					else try {
						await releaseKillClaim(killClaim);
					} catch (error) {
						if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
						return {
							killed: false,
							targetState: settledTarget,
							error: `Completed subagent kill intent could not be released: ${formatErrorMessage(error)}`
						};
					}
					return {
						killed: killedTarget,
						targetState: settledTarget
					};
				}
				return await settleTargetCancellation();
			} catch (error) {
				if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
				return {
					killed: false,
					error: formatErrorMessage(error)
				};
			}
		},
		finalize: async () => {
			if (killClaim && ownsKillIntent(currentEntry(), killClaim)) params.withdrawQueuedReservation();
		}
	});
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill-scope.ts
/** Retains cancellation selection, session facts, and exact dispatch ownership. */
async function withSubagentKillScope(params, run, captureResult, preparePublication, finishResult) {
	const runInScope = AsyncLocalStorage.snapshot();
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const stateContext = captureOpenClawStateWorkerContext();
	const assertCurrent = () => {
		assertSubagentRegistryWriteSourceCurrent(stateContext);
		params.assertCurrent?.();
	};
	const cancellationControl = {
		prepareRead: params.prepareRead,
		assertCurrent
	};
	const selected = /* @__PURE__ */ new Map();
	let selectedCount = 0;
	const releaseSessions = [];
	const releaseRetirements = [];
	const completeRetirementPublications = [];
	const holds = [];
	const hold = (tree) => {
		if (!tree.dispatchHold) {
			tree.dispatchHold = holdQueuedSwarmRun(tree.entry.schedulerSlotId ?? tree.entry.runId);
			if (tree.dispatchHold) holds.push(tree.dispatchHold);
		}
	};
	const capture = (pending, runs, trees, owner, parent, ownsRoot) => {
		const controller = owner ? { ...owner } : void 0;
		for (const snapshot of runs) {
			assertCurrent();
			const childOwner = parseAgentSessionKey(snapshot.childSessionKey) ? void 0 : snapshot.childAgentId ?? resolveSubagentRequesterAgentId(params.cfg, snapshot);
			const entry = getLatestOwnedSubagentRun(snapshot.childSessionKey, childOwner, params.cfg);
			const selectedForChild = selected.get(snapshot.childSessionKey) ?? /* @__PURE__ */ new Set();
			if (!entry || !isSameSubagentRunOwner(entry, snapshot) || selectedForChild.has(childOwner)) continue;
			const ownerCurrent = (candidate, requirePreparedSession = true) => isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && parent?.canTraverse(requirePreparedSession) !== false && ownsRoot?.(candidate) !== false && (!controller || !ensureSubagentControllerOwnsRun({
				cfg: params.cfg,
				controller,
				entry: candidate
			}));
			if (!ownerCurrent(entry, false) || !isCurrentSubagentRun(entry, params.cfg)) continue;
			selectedForChild.add(childOwner);
			selected.set(entry.childSessionKey, selectedForChild);
			selectedCount += 1;
			const errors = /* @__PURE__ */ new Set();
			let session;
			const ownsSessionIncarnation = () => {
				if (!session) return false;
				try {
					session.assertCurrent();
					return true;
				} catch (error) {
					if (isSessionDeliveryGenerationRevokedError(error)) return false;
					throw error;
				}
			};
			const { childSessionKey } = entry;
			const latest = () => getLatestOwnedSubagentRun(childSessionKey, childOwner, params.cfg);
			const retirement = subagentRuns.captureRetirement(entry, (candidate) => isSameSubagentRunOwner(latest(), candidate));
			completeRetirementPublications.push(retirement.completePublication);
			releaseRetirements.push(retirement.release);
			const selectedEntry = () => retirement.observation.entry;
			const ownsRun = () => {
				const observed = retirement.observation;
				const current = observed.entry;
				return current !== void 0 && isSameSubagentRunOwner(current, entry) && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && (isSameSubagentRunOwner(getCurrentSubagentRunOwner(subagentRuns, current), current) || observed.state === "retired");
			};
			const isCurrent = (candidate, requirePreparedSession = true) => {
				const current = getCurrentSubagentRunOwner(subagentRuns, entry);
				return current !== void 0 && isSameSubagentRunOwner(candidate, entry) && isSameSubagentRunOwner(current, entry) && ownsRun() && ownerCurrent(current, requirePreparedSession) && isCurrentSubagentRun(current, params.cfg) && (!requirePreparedSession || ownsSessionIncarnation());
			};
			const canTraverse = (requirePreparedSession = true) => {
				const current = selectedEntry();
				if (!current || !ownerCurrent(current, requirePreparedSession) || !ownsRun()) return false;
				const replacement = latest();
				return (isSameSubagentRunOwner(replacement, current) || retirement.observation.state === "retired" && (!replacement || compareSubagentRunGeneration(replacement, current) < 0)) && (!requirePreparedSession || ownsSessionIncarnation());
			};
			const prepareRead = () => {
				const failures = [];
				const publications = [parent?.prepareRead, session?.prepareRead].flatMap((prepare) => {
					try {
						const publication = prepare?.();
						return publication ? [publication] : [];
					} catch (error) {
						if (!isSessionDeliveryGenerationRevokedError(error)) failures.push(error);
						return [];
					}
				});
				const throwFailures = () => {
					if (failures.length === 1) throw failures[0];
					if (failures.length > 1) throw new AggregateError(failures, "Subagent publication readiness failed");
				};
				if (publications.length === 0) {
					throwFailures();
					return;
				}
				return Promise.allSettled(publications).then((results) => {
					try {
						assertSubagentRegistryWriteSourceCurrent(stateContext);
					} catch (error) {
						failures.push(error);
					}
					for (const result of results) if (result.status === "rejected" && !isSessionDeliveryGenerationRevokedError(result.reason)) failures.push(result.reason);
					throwFailures();
				});
			};
			const tree = {
				get entry() {
					return selectedEntry() ?? entry;
				},
				isCurrent,
				ownsRun,
				canTraverse,
				prepareRead,
				session,
				children: [],
				errors,
				discoveryFailed: errors.size > 0
			};
			hold(tree);
			trees.push(tree);
			pending.push({
				tree,
				prepare: async () => {
					try {
						const selectedRun = tree.entry;
						session = await prepareSubagentKillSession(params.cfg, selectedRun.childSessionKey, () => assertSubagentRegistryWriteSourceCurrent(stateContext), selectedRun.execution.transcriptTarget, selectedRun.childAgentId);
						releaseSessions.push(session.release);
						if (!tree.canTraverse(false)) return;
						tree.session = session;
					} catch (error) {
						if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
						errors.add(formatErrorMessage(error));
						tree.discoveryFailed = true;
					}
				}
			});
		}
	};
	const select = async (runs, trees, owner, parent, ownsRoot) => {
		const pending = [];
		capture(pending, runs, trees, owner, parent, ownsRoot);
		const resident = new Map(subagentRuns);
		for (const { tree } of pending) {
			const controller = {
				controllerSessionKey: tree.entry.childSessionKey,
				controllerAgentId: resolveSubagentChildSessionOwner(tree.entry, params.cfg).agentId
			};
			capture(pending, listRunsForControllerFromRuns(resident, controller.controllerSessionKey), tree.children, controller, tree);
		}
		for (const item of pending) await item.prepare();
	};
	const refreshTree = async (tree) => {
		if (tree.discoveryFailed) return;
		try {
			for (let pending = tree.prepareRead(); pending; pending = tree.prepareRead()) await pending;
			assertSubagentRegistryWriteSourceCurrent(stateContext);
			try {
				params.assertCurrent?.();
			} catch (error) {
				if (!hasSqliteWorkerOutcomeUnknown(error) && tree.entry.execution.status === "terminal" && tree.entry.endedReason === "subagent-killed" && tree.entry.killReconciliation?.taskCancellationAccepted === true && tree.canTraverse()) {
					for (const child of tree.children) await refreshTree(child);
					return;
				}
				throw error;
			}
			if (!tree.canTraverse()) return;
			if (tree.isCurrent(tree.entry)) {
				hold(tree);
				const controller = {
					controllerSessionKey: tree.entry.childSessionKey,
					controllerAgentId: resolveSubagentChildSessionOwner(tree.entry, params.cfg).agentId
				};
				const candidates = await withSubagentRunReadSnapshot(subagentRuns, (snapshot) => ({
					runIds: [...snapshot.values()].filter((candidate) => (candidate.controllerSessionKey?.trim() || candidate.requesterSessionKey) === controller.controllerSessionKey).map((candidate) => candidate.runId),
					sessionKeys: [controller.controllerSessionKey]
				}), (_selection, runs) => listRunsForControllerFromRuns(new Map(runs), controller.controllerSessionKey), {
					sessionKeys: [controller.controllerSessionKey],
					descendants: false
				});
				assertCurrent();
				for (let pending = tree.prepareRead(); pending; pending = tree.prepareRead()) {
					await pending;
					assertCurrent();
				}
				await select(candidates, tree.children, controller, tree);
			}
			for (const child of tree.children) await refreshTree(child);
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			tree.discoveryFailed = true;
			tree.errors.add(formatErrorMessage(error));
		}
	};
	const trees = [];
	let queuedRefresh;
	let refreshWork;
	let refreshing = false;
	let refreshClosed = false;
	let refreshFailure;
	const refresh = () => {
		if (refreshClosed) return Promise.reject(/* @__PURE__ */ new Error("Subagent cancellation refresh scope is no longer active"));
		if (refreshFailure) return refreshFailure.promise;
		const batch = queuedRefresh ??= createDeferredCore();
		batch.promise.catch(() => {});
		if (!refreshing) {
			refreshing = true;
			refreshWork = runInScope(async () => {
				try {
					while (queuedRefresh) {
						const current = queuedRefresh;
						queuedRefresh = void 0;
						try {
							for (const tree of trees) await refreshTree(tree);
							current.resolve(selectedCount);
						} catch (error) {
							refreshFailure = {
								error,
								promise: current.promise
							};
							current.reject(error);
							throw error;
						}
					}
				} finally {
					refreshing = false;
				}
			}).catch((error) => {
				queuedRefresh?.reject(error);
				queuedRefresh = void 0;
			});
		}
		return batch.promise;
	};
	const withPublication = async (publish) => {
		let publicationActive = true;
		let publicationConsumed = false;
		const publishResult = () => {
			if (!publicationActive) throw new Error("Subagent cancellation publication scope is no longer active");
			if (publicationConsumed) throw new Error("Subagent cancellation result was already published");
			publicationConsumed = true;
			publish();
		};
		const publicationSession = captureResult ? trees[0]?.session : void 0;
		const publishPrepared = async (prepareRows) => {
			const prepareResult = async () => {
				if (prepareRows) await prepareRows(publishResult);
				else publishResult();
			};
			if (publicationSession) await publicationSession.withPublication(prepareResult);
			else await prepareResult();
		};
		try {
			if (preparePublication) await preparePublication.prepare(publishPrepared);
			else await publishPrepared();
			if (!publicationConsumed) throw new Error("Subagent cancellation publication did not consume its prepared scope");
		} finally {
			publicationActive = false;
		}
	};
	let outcome;
	try {
		assertCurrent();
		await select(params.runs, trees, params.controller, void 0, params.ownsRoot);
		const scope = {
			cancellationControl,
			stateContext,
			refresh
		};
		await scope.refresh();
		const result = await run(scope, trees);
		refreshClosed = true;
		await refreshWork;
		if (refreshFailure) throw refreshFailure.error;
		let snapshot = result;
		await withPublication(() => {
			if (captureResult) assertCurrent();
			snapshot = captureResult ? captureResult(result, trees) : result;
			if (preparePublication?.publishSnapshot?.(snapshot) !== void 0) throw new TypeError("Subagent cancellation snapshot publication must be synchronous.");
		});
		outcome = {
			ok: true,
			rawResult: result,
			value: snapshot
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	refreshClosed = true;
	await refreshWork;
	if (refreshFailure && !outcome.ok && outcome.error !== refreshFailure.error) outcome = {
		ok: false,
		error: new AggregateError([outcome.error, refreshFailure.error], "Subagent cancellation and discovery failed")
	};
	completeRetirementPublications.forEach((complete) => complete());
	const settleQueued = async (tree) => {
		const { entry, session, dispatchHold } = tree;
		const executionTail = session && (captureSubagentExecution({
			entry,
			session
		})?.execution.executionSettlement ?? getSubagentExecutionCleanup(entry, session.entry)?.settlement);
		if (executionTail && !executionTail.cleanupSettled) return;
		if (tree.errors.size !== 0 || !dispatchHold || !session?.entry?.sessionId || entry.collect !== true || entry.execution.status !== "terminal" || entry.execution.startedAt !== void 0 || entry.endedReason !== "subagent-killed" || !entry.killReconciliation || !await dispatchHold.settleCancellation()) return;
		for (let pending = tree.prepareRead(); pending; pending = tree.prepareRead()) await pending;
		const { execution, killReconciliation } = tree.entry;
		const isCurrent = () => {
			const current = tree.entry;
			return tree.isCurrent(entry) && isDeepStrictEqual(current.execution, execution) && isDeepStrictEqual(current.killReconciliation, killReconciliation);
		};
		if (outcome.ok && isCurrent()) {
			const assertQueuedPublicationCurrent = () => {
				cancellationControl.assertCurrent();
				if (!isCurrent()) throw new Error("Queued cancellation no longer owns its terminal publication");
			};
			assertQueuedPublicationCurrent();
			await persistSubagentSessionTiming(tree.entry, {
				session,
				isCurrentGeneration: isCurrent,
				assertCommitAllowed: assertQueuedPublicationCurrent,
				settledQueuedCancellation: {
					storePath: session.storePath,
					sessionId: session.entry.sessionId,
					lifecycleRevision: session.entry.lifecycleRevision
				}
			});
			assertQueuedPublicationCurrent();
		}
	};
	const selectedSettlements = (selectedTrees) => selectedTrees.flatMap((tree) => [settleQueued(tree), ...selectedSettlements(tree.children)]);
	const settlementErrors = (await Promise.allSettled(selectedSettlements(trees))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (settlementErrors.length > 0) {
		const errors = outcome.ok ? settlementErrors : [outcome.error, ...settlementErrors];
		outcome = {
			ok: false,
			error: errors.length === 1 ? errors[0] : new AggregateError(errors, "Subagent cancellation publication and cleanup failed")
		};
	}
	if (outcome.ok) try {
		const rawResult = outcome.rawResult;
		let published = outcome.value;
		await withPublication(() => {
			if (captureResult) assertCurrent();
			const result = captureResult ? captureResult(rawResult, trees) : rawResult;
			published = finishResult ? finishResult(result) : result;
		});
		outcome = {
			ok: true,
			rawResult,
			value: published
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	const released = await Promise.allSettled(holds.map((reservation) => reservation.release()));
	const retired = await Promise.allSettled(releaseRetirements.map(async (release) => release()));
	const releasedSessions = await Promise.allSettled(releaseSessions.map(async (release) => release()));
	if (!outcome.ok) throw outcome.error;
	for (const result of [
		...released,
		...retired,
		...releasedSessions
	]) if (result.status === "rejected") throw result.reason;
	return outcome.value;
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill.ts
async function killSubagentRun(params) {
	let captured = captureSubagentExecution(params);
	let retiredCleanup = captured ? void 0 : getSubagentExecutionCleanup(params.entry, params.session.entry);
	const stopAcceptance = { accepted: false };
	let result = {
		killed: false,
		targetState: resolveSubagentKillTargetState(params.entry)
	};
	let settlementFailure;
	try {
		result = await mutateSubagentRunForKill(params, () => {
			captured ??= captureSubagentExecution(params);
			return captured;
		}, stopAcceptance);
	} finally {
		const execution = captured?.execution;
		retiredCleanup ??= captured ? void 0 : getSubagentExecutionCleanup(params.entry, params.session.entry);
		const settlement = execution?.executionSettlement ?? retiredCleanup?.settlement;
		if (settlement && !(execution ? isCurrentChatAbortExecution(execution) : retiredCleanup?.isSelf()) && (result.killed || result.targetState || stopAcceptance.accepted || settlement.status === "rejected" || !result.declined && (retiredCleanup || execution?.controller.signal.aborted || execution?.registrationCleanupRequested))) try {
			await settlement.completion;
		} catch (error) {
			settlementFailure = {
				error,
				settlement
			};
		}
	}
	if (!stopAcceptance.accepted) params.cancellationControl.assertCurrent();
	if (captured) {
		const entry = getCurrentSubagentRunOwner(subagentRuns, params.entry) ?? captured.entry;
		const resolver = getGatewayContextResolver(entry);
		const cleanup = resolver === void 0 ? getSubagentExecutionCleanup(entry, params.session.entry) : void 0;
		const releasedToSelfCleanup = cleanup !== void 0 && cleanup.settlement === captured.execution.executionSettlement && cleanup.isCurrent() && cleanup.isSelf();
		if (releasedToSelfCleanup) params.session.assertCurrent();
		const releasedBinding = resolver === void 0 && (captured.execution.executionSettlement?.cleanupSettled === true || releasedToSelfCleanup);
		if (entry.runId !== captured.runId || resolver !== captured.resolver && !releasedBinding || captured.resolver?.() !== captured.context || captured.context.chatAbortControllers.has(captured.runId) && captured.context.chatAbortControllers.get(captured.runId) !== captured.execution) throw new Error("Subagent execution owner changed during cancellation");
	} else if (retiredCleanup) {
		params.session.assertCurrent();
		if (!retiredCleanup.isCurrent() || !retiredCleanup.isSelf() && !retiredCleanup.settlement.cleanupSettled) throw new Error("Subagent execution owner changed during cancellation");
	}
	if (settlementFailure) {
		const message = `Subagent execution settlement failed: ${formatErrorMessage(settlementFailure.error)}`;
		const { settlement } = settlementFailure;
		if ((captured?.execution.executionSettlement ?? retiredCleanup?.settlement) === settlement && settlement.status === "rejected" && settlement.cleanupSettled) result = {
			...result,
			completedCleanupError: message
		};
		else result = {
			...result,
			error: [result.error, message].filter(Boolean).join(" ")
		};
	}
	return result;
}
async function killLatestSubagentRun(params) {
	const { tree, scope } = params;
	const cancellationControl = {
		assertCurrent: scope.cancellationControl.assertCurrent,
		prepareRead: () => {
			const pending = [scope.cancellationControl.prepareRead?.(), tree.prepareRead()].filter((publication) => publication !== void 0);
			return pending.length > 0 ? Promise.all(pending).then(() => {}) : void 0;
		}
	};
	for (let pending = cancellationControl.prepareRead(); pending; pending = cancellationControl.prepareRead()) {
		await pending;
		cancellationControl.assertCurrent();
	}
	const matchesExpected = (entry) => (params.expectedGeneration === void 0 || entry.generation === params.expectedGeneration) && (!params.expectedOwnerKey || entry.requesterSessionKey === params.expectedOwnerKey);
	scope.cancellationControl.assertCurrent();
	const entry = tree.entry;
	const session = tree.session;
	if (!session) return {
		entry,
		result: { killed: false }
	};
	if (!matchesExpected(entry)) return {
		entry,
		session,
		result: {
			killed: false,
			superseded: true
		}
	};
	const result = tree.isCurrent(entry) ? await killSubagentRun({
		...params,
		entry,
		session,
		stateContext: scope.stateContext,
		cancellationControl,
		isCurrent: (candidate, requirePreparedSession) => tree.isCurrent(candidate, requirePreparedSession) && matchesExpected(candidate),
		withdrawQueuedReservation: () => tree.dispatchHold?.withdraw(),
		refreshDescendants: scope.refresh
	}) : {
		killed: false,
		superseded: true
	};
	tree.completedCleanupError = result.completedCleanupError;
	if (result.superseded && !tree.isCurrent(entry) && tree.canTraverse() && matchesExpected(entry)) return {
		entry: tree.entry,
		session,
		result: {
			killed: false,
			targetState: resolveSubagentKillTargetState(tree.entry),
			...result.error !== void 0 ? { error: result.error } : {},
			...result.completedCleanupError !== void 0 ? { completedCleanupError: result.completedCleanupError } : {}
		}
	};
	return {
		entry: tree.entry,
		session,
		result
	};
}
function collectKillErrors(trees, unlabeledRoot) {
	let failed = 0;
	const errors = [];
	const collect = (tree) => {
		const diagnostics = [...tree.errors];
		if (tree.completedCleanupError) diagnostics.push(tree.completedCleanupError);
		if (diagnostics.length > 0) {
			failed += 1;
			for (const error of diagnostics) errors.push(tree === unlabeledRoot ? error : `${resolveSubagentLabel(tree.entry)}: ${error}`);
		}
		tree.children.forEach(collect);
	};
	trees.forEach(collect);
	return {
		errors,
		failed
	};
}
async function visitAll(work) {
	const results = await Promise.allSettled(work);
	for (const result of results) if (result.status === "rejected") throw result.reason;
}
async function killSubagentRunTree(params) {
	const visits = /* @__PURE__ */ new Map();
	const visit = async (tree, suppressCompletedWakes) => {
		let result = visits.get(tree);
		try {
			if (!result) {
				result = {
					descendants: false,
					suppressCompletedWakes
				};
				visits.set(tree, result);
				if (!tree.entry.execution.endedAt || tree.session && (captureSubagentExecution({
					entry: tree.entry,
					session: tree.session
				})?.execution.executionSettlement || getSubagentExecutionCleanup(tree.entry, tree.session.entry)) || tree.entry.pauseReason === "sessions_yield" || params.suppressTaskDelivery && suppressCompletedWakes && tree.entry.requesterSettleWake) {
					const stopped = await killLatestSubagentRun({
						...params,
						tree
					});
					if (stopped.result.error) tree.errors.add(stopped.result.error);
					if (stopped.result.error || stopped.result.completedCleanupError || stopped.result.declined) result.suppressCompletedWakes = false;
					if (stopped.result.killed) result.label = resolveSubagentLabel(stopped.entry);
					if (stopped.result.superseded) return;
				}
				result.descendants = true;
			}
			for (let pending = tree.prepareRead(); pending; pending = tree.prepareRead()) await pending;
			if (result.descendants && tree.canTraverse()) {
				const suppressDescendantWakes = result.suppressCompletedWakes;
				await visitAll(tree.children.map((child) => visit(child, suppressDescendantWakes)));
			}
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			tree.errors.add(formatErrorMessage(error));
			if (result) result.descendants = false;
		}
	};
	let selected;
	do {
		selected = await params.scope.refresh();
		await visitAll(params.trees.map((tree) => visit(tree, params.suppressCompletedWakes !== false)));
	} while (await params.scope.refresh() !== selected);
	const collectLabels = (trees) => trees.flatMap((tree) => {
		const label = visits.get(tree)?.label;
		return [...label === void 0 ? [] : [label], ...collectLabels(tree.children)];
	});
	const labels = collectLabels(params.trees);
	return {
		killed: labels.length,
		labels
	};
}
async function killSubagentRoot(params) {
	let stopped = {
		entry: params.tree.entry,
		result: { killed: false }
	};
	let cascade = {
		killed: 0,
		labels: []
	};
	try {
		stopped = await killLatestSubagentRun(params);
		if (stopped.result.error) params.tree.errors.add(stopped.result.error);
		for (let pending = params.tree.prepareRead(); pending; pending = params.tree.prepareRead()) await pending;
		if (!stopped.result.superseded && !stopped.result.declined && params.tree.canTraverse()) cascade = await killSubagentRunTree({
			cfg: params.cfg,
			suppressTaskDelivery: params.suppressTaskDelivery,
			suppressCompletedWakes: !stopped.result.error && !stopped.result.completedCleanupError,
			scope: params.scope,
			trees: params.tree.children
		});
	} catch (error) {
		if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
		params.tree.errors.add(formatErrorMessage(error));
	}
	return {
		...stopped,
		cascade
	};
}
/** Kills every currently controlled child run and its descendants. */
async function killAllControlledSubagentRuns(params) {
	if (params.controller.controlScope !== "children") {
		await params.beforeKill?.();
		return {
			status: "forbidden",
			error: "Leaf subagents cannot control other sessions.",
			killed: 0,
			labels: []
		};
	}
	return killSelectedSubagentRuns(params);
}
/** Lifecycle cleanup owns both the completion requester and its separately scoped controller. */
async function killSessionSubagentRuns(params) {
	const controller = {
		controllerSessionKey: params.sessionKey,
		controllerAgentId: params.agentId
	};
	return killSelectedSubagentRuns({
		cfg: params.cfg,
		assertCurrent: params.assertCurrent,
		runs: [...listSubagentRunsForRequester(params.sessionKey, { requesterAgentId: params.agentId }), ...listSubagentRunsForController(params.sessionKey, params.agentId)],
		ownsRoot: (entry) => !ensureSubagentControllerOwnsRun({
			cfg: params.cfg,
			controller,
			entry
		}) || entry.requesterSessionKey === params.sessionKey && resolveSubagentRequesterAgentId(params.cfg, entry) === params.agentId,
		suppressTaskDelivery: true
	});
}
async function killSelectedSubagentRuns(params) {
	const result = await withSubagentKillScope(params, async (scope, trees) => {
		const accepted = params.beforeKill ? await params.beforeKill() : true;
		if (accepted) await scope.refresh();
		const acceptedTrees = accepted ? trees : [];
		return {
			...await killSubagentRunTree({
				cfg: params.cfg,
				suppressTaskDelivery: params.suppressTaskDelivery,
				trees: acceptedTrees,
				scope
			}),
			...collectKillErrors(acceptedTrees)
		};
	});
	if (result.errors.length > 0) return {
		status: "error",
		error: result.errors.join("; "),
		failed: result.failed,
		killed: result.killed,
		labels: result.labels
	};
	return {
		status: "ok",
		killed: result.killed,
		labels: result.labels
	};
}
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
async function killSubagentRunAdmin(params, control) {
	const publish = (result) => {
		if (params.onResult?.(result) !== void 0) throw new TypeError("Subagent cancellation publication must be synchronous.");
		return result;
	};
	const targetSessionKey = params.sessionKey.trim();
	if (!targetSessionKey) return publish({
		found: false,
		killed: false
	});
	const entry = getLatestOwnedSubagentRun(targetSessionKey, params.agentId, params.cfg);
	if (!entry) return publish({
		found: false,
		killed: false
	});
	const expectedRunId = params.expectedRunId?.trim();
	const expectedTaskRunId = params.expectedTaskRunId?.trim();
	if (expectedRunId && entry.runId !== expectedRunId || expectedTaskRunId && (entry.taskRunId ?? entry.runId) !== expectedTaskRunId) return publish({
		found: false,
		killed: false
	});
	if (params.expectedGeneration !== void 0 && entry.generation !== params.expectedGeneration || params.expectedOwnerKey?.trim() && entry.requesterSessionKey !== params.expectedOwnerKey.trim()) return publish({
		found: false,
		killed: false
	});
	let rootStopSuperseded = false;
	return withSubagentKillScope({
		cfg: params.cfg,
		runs: [entry],
		assertCurrent: control?.assertCurrent,
		prepareRead: control?.prepareRead
	}, async (scope, [tree]) => {
		if (!tree) return {
			found: false,
			killed: false
		};
		const stopped = await killSubagentRoot({
			cfg: params.cfg,
			tree,
			scope,
			beforeSessionKill: control?.beforeSessionKill,
			expectedGeneration: params.expectedGeneration,
			expectedOwnerKey: params.expectedOwnerKey?.trim() || void 0
		});
		const { result: stopResult, cascade } = stopped;
		rootStopSuperseded = stopResult.superseded === true;
		const targetState = resolveSubagentKillTargetState(tree.entry) ?? stopResult.targetState;
		const killedTarget = targetState?.state === "terminal" && targetState.task.status === "cancelled" && targetState.task.error === "Subagent run killed.";
		const stopResultAlreadyClearedAbort = stopResult.targetState !== void 0 && !(stopResult.targetState.state === "terminal" && stopResult.targetState.task.status === "cancelled" && stopResult.targetState.task.error === "Subagent run killed.");
		const resolved = stopped.session;
		if (targetState && !killedTarget && !stopResultAlreadyClearedAbort && resolved) await persistSubagentAbortedLastRun({
			childSessionKey: targetSessionKey,
			storePath: resolved.storePath,
			hasSessionEntry: resolved.entry !== void 0,
			expectedSessionId: resolved.entry?.sessionId,
			expectedLifecycleRevision: resolved.entry?.lifecycleRevision,
			abortedLastRun: false,
			isCurrent: () => tree.isCurrent(stopped.entry)
		});
		return {
			found: true,
			killed: stopResult.killed || cascade.killed > 0,
			runId: stopped.entry.runId,
			sessionKey: stopped.entry.childSessionKey,
			cascadeKilled: cascade.killed,
			cascadeLabels: cascade.killed > 0 ? cascade.labels : void 0
		};
	}, (result, [tree]) => {
		if (!result.found || !tree) return result;
		const ownsOutcome = !rootStopSuperseded && tree.ownsRun() && tree.canTraverse();
		if (!ownsOutcome) tree.errors.add("Subagent ownership changed during cancellation; retry.");
		const targetState = ownsOutcome ? resolveSubagentKillTargetState(tree.entry) : void 0;
		const { errors } = collectKillErrors([tree], tree);
		return {
			...result,
			...targetState ? { targetState } : {},
			...errors.length > 0 ? { error: errors.join("; ") } : {}
		};
	}, control?.preparePublication, publish);
}
//#endregion
export { killSessionSubagentRuns as n, killSubagentRunAdmin as r, killAllControlledSubagentRuns as t };
