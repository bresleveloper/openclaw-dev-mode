import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { g as getGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { l as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { E as waitForSessionWorkAdmissionRelease, S as runExclusiveSessionLifecycleMutation, T as startSessionWorkAdmissionInterruption, i as captureSessionWorkRunInterruptions, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { o as holdQueuedSwarmRun } from "./swarm-scheduler-CocpuN_N.mjs";
import { i as resolveSubagentChildAuthority, r as resolveSubagentChildAgentId } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { S as compareSubagentRunGeneration, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { b as subscribeSubagentRunChanges, h as subagentRuns, i as getCurrentSubagentRunOwner } from "./subagent-registry-memory-DE7WJHOr.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { N as listRunsForControllerFromRuns, b as withSubagentRunReadSnapshot } from "./subagent-registry-state-DBdy-FdI.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as isEmbeddedAgentRunActive } from "./active-run-projections-Crpg2l0z.mjs";
import { n as abortEmbeddedAgentRun } from "./runs-Czr-I6_B.mjs";
import { i as isSessionDeliveryGenerationRevokedError, r as prepareSessionGenerationFacts } from "./session-delivery-generation-NkiiEowi.mjs";
import { a as isCurrentChatAbortExecution } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
import { E as releaseSubagentRunKillClaim, F as persistSubagentAbortedLastRun, I as prepareSubagentKillSession, L as prepareSubagentKillSessionReads, N as matchesSubagentKillIntent, o as cancelSubagentRequesterSettleWake, s as claimSubagentRunKill, y as markSubagentRunTerminated, z as resolveSubagentKillTargetState } from "./subagent-registry-CfK3_UcO.mjs";
import { a as assertSubagentRegistryWriteSourceCurrent, i as assertSubagentRegistryWriteOutcomeKnown, r as SubagentRegistryWriteError } from "./subagent-registry-persistence-DE7WA4wN.mjs";
import { s as persistSubagentSessionTiming } from "./subagent-registry-helpers-VSGp2TQD.mjs";
import { s as resolveSubagentChildSessionOwner } from "./subagent-session-reconciliation-DBq1r5kk.mjs";
import { n as captureExecRequestCancellation } from "./bash-process-control-D15pjJye.mjs";
import { a as captureSubagentReplyExecution, i as captureSubagentExecution, o as captureSubagentRetainedWork, r as captureSubagentEmbeddedExecution, s as getSubagentExecutionCleanup } from "./subagent-exec-request-ownership-C-0uyQ3B.mjs";
import { n as resolveSubagentLabel } from "./subagents-utils-DV33DlwQ.mjs";
import { a as getLatestOwnedSubagentRun, i as ensureSubagentControllerOwnsRun, l as prepareSessionSubagentKillSelection, o as isCurrentSubagentRun } from "./subagent-control-scope-DL-koOaU.mjs";
import { a as retireAcceptedSessionSpawnCompletionForRun } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { n as clearSessionLifecycleQueues } from "./cleanup-CjvcBZOl.mjs";
import "./subagent-control.runtime--Esmetmw.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/registry/subagent-control-commands.ts
/** Native admission may create its request owner after the initial Stop selection. */
function captureSubagentCommands(entry, session) {
	const sessionId = session?.entry?.sessionId ?? (session ? captureSubagentExecution({
		entry,
		session
	})?.execution.sessionId : void 0) ?? captureSubagentEmbeddedExecution(entry)?.sessionId ?? entry.childSessionIdentity?.sessionId;
	if (!session || !sessionId) return;
	const agentId = session.agentId;
	const observations = [];
	const observe = (current) => {
		if (!current || !isSameSubagentRunOwner(current, entry)) return;
		observations.push(captureExecRequestCancellation({
			runId: current.runId,
			sessionKey: current.childSessionKey,
			sessionId,
			agentId
		}));
	};
	observe(entry);
	return {
		observe,
		get owners() {
			return [...new Set(observations.flatMap((observation) => observation.owners))];
		},
		cancel(assertCurrent) {
			let aborted = false;
			for (const observation of observations) {
				if (observation.owners.some((owner) => !owner.signal.aborted)) assertCurrent();
				aborted = observation.cancel() || aborted;
			}
			return aborted;
		},
		async settle() {
			const errors = (await Promise.allSettled(observations.map((observation) => observation.settle()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "Captured native command cleanup was incomplete");
		}
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill-errors.ts
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
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill-acceptance.ts
/** One native Stop retains acceptance, caller failure, and its cleanup observations. */
function createSubagentKillAcceptance(params) {
	let acceptedCallerFailure;
	const accept = (accepted) => {
		params.stopAcceptance.accepted ||= accepted;
		if (accepted && params.commands?.owners.length && !acceptedCallerFailure && params.ownsSessionIncarnation() && params.isKillOwnerCurrent()) try {
			params.assertCallerCurrent();
			params.commands.cancel(() => {
				params.assertCallerCurrent();
				params.assertNativeCurrent();
				if (!params.ownsSessionIncarnation() || !params.isKillOwnerCurrent()) throw new Error("Subagent command cancellation lost its native owner.");
			});
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			try {
				params.assertNativeCurrent();
			} catch (nativeError) {
				throw new AggregateError([error, nativeError], "Subagent cancellation authority and native ownership changed", { cause: nativeError });
			}
			acceptedCallerFailure = { error };
		}
	};
	const drain = async (release, isInterrupted) => {
		let acceptanceFailure;
		try {
			accept(isInterrupted());
		} catch (error) {
			acceptanceFailure = { error };
		}
		let released;
		try {
			released = await waitForSessionWorkAdmissionRelease(release, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS);
		} catch (error) {
			throw acceptanceFailure ? new AggregateError([acceptanceFailure.error, error], "Subagent cancellation and admission cleanup failed", { cause: error }) : error;
		}
		if (!acceptanceFailure) try {
			accept(isInterrupted());
		} catch (error) {
			acceptanceFailure = { error };
		}
		if (acceptanceFailure) {
			if (!released) throw new AggregateError([acceptanceFailure.error, /* @__PURE__ */ new Error("Subagent admission cleanup is still pending.")], "Subagent cancellation and admission cleanup failed", { cause: acceptanceFailure.error });
			throw acceptanceFailure.error;
		}
		return released;
	};
	const finish = async (operation, options) => {
		const cancellation = operation.then((result) => acceptedCallerFailure ? {
			...result,
			error: [result.error, formatErrorMessage(acceptedCallerFailure.error)].filter(Boolean).join(" ")
		} : result, (error) => {
			throw acceptedCallerFailure ? new AggregateError([acceptedCallerFailure.error, error], "Subagent cancellation and accepted claim settlement failed", { cause: error }) : error;
		});
		if (!options.settleCommands) return await cancellation;
		return await cancellation.then(async (result) => {
			try {
				await params.commands?.settle();
			} catch (error) {
				return {
					...result,
					error: [result.error, `Subagent command cleanup failed: ${formatErrorMessage(error)}`].filter(Boolean).join(" ")
				};
			}
			return result;
		}, async (error) => {
			try {
				await params.commands?.settle();
			} catch (cleanupError) {
				throw new AggregateError([error, cleanupError], "Subagent cancellation and command cleanup failed", { cause: cleanupError });
			}
			throw error;
		});
	};
	return {
		accept,
		drain,
		finish,
		get callerFailure() {
			return acceptedCallerFailure;
		}
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-legacy-interruption.ts
/** Legacy-unverified runs capture their exact embedded and reply executions before Stop. */
async function prepareLegacySubagentKill(entry) {
	const legacy = resolveSubagentChildAuthority(entry).status === "legacy-unverified";
	return {
		legacy,
		embeddedExecution: legacy ? captureSubagentEmbeddedExecution(entry) : void 0,
		replyExecution: legacy ? await captureSubagentReplyExecution(entry) : void 0
	};
}
async function interruptLegacySubagentRun(params) {
	const { entry, session, embeddedExecution, replyExecution, acceptance, stopAcceptance } = params;
	const reason = createAgentRunDirectAbortError();
	const ownedAdmissions = captureSessionWorkRunInterruptions({
		scope: session.storePath,
		identities: [
			entry.childSessionKey,
			embeddedExecution?.sessionId,
			replyExecution?.sessionId
		],
		accept: (run) => run.runId === entry.runId && run.sessionKey === entry.childSessionKey && run.agentId === session.agentId && (!entry.childSessionIdentity?.sessionId || run.sessionId === entry.childSessionIdentity.sessionId)
	});
	const captured = params.captureExecution();
	let refusedRuntimeStillCurrent;
	if (captured) {
		if (captureSubagentExecution({
			entry,
			session
		})?.execution !== captured.execution) return "superseded";
		const alreadyAborted = captured.execution.controller.signal.aborted;
		captured.execution.controller.abort(reason);
		acceptance.accept(!alreadyAborted && captured.execution.controller.signal.aborted);
	} else if (embeddedExecution) {
		const aborted = embeddedExecution.abort();
		acceptance.accept(aborted);
		if (!aborted) refusedRuntimeStillCurrent = () => {
			return captureSubagentEmbeddedExecution(entry)?.sessionId === embeddedExecution.sessionId;
		};
	} else if (replyExecution) {
		const aborted = replyExecution.abort();
		acceptance.accept(aborted);
		if (!aborted) refusedRuntimeStillCurrent = replyExecution.isCurrent;
	}
	if (!stopAcceptance.accepted && params.commands) acceptance.accept(params.commands.cancel(() => {
		params.assertCallerCurrent();
		params.assertSelectedRun();
	}));
	const interrupted = ownedAdmissions.map((owned) => owned.released);
	if (replyExecution?.settlement && stopAcceptance.accepted) interrupted.push(replyExecution.settlement);
	for (const owned of ownedAdmissions) {
		if (acceptance.callerFailure) break;
		params.assertCallerCurrent();
		params.assertSelectedRun();
		acceptance.accept(owned.interrupt(reason));
	}
	return !(interrupted.length === 0 || await acceptance.drain(Promise.all(interrupted).then(() => {}), () => stopAcceptance.accepted)) || refusedRuntimeStillCurrent?.() ? "busy" : "ready";
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill-runtime.ts
function killFailure(error, prefix = "", format = formatErrorMessage) {
	if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
	return {
		killed: false,
		error: `${prefix}${format(error)}`
	};
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
	const markKilledBestEffort = async () => {
		const selected = currentEntry();
		if (!selected) return 0;
		const { runId } = selected;
		try {
			return await markSubagentRunTerminated({
				runId,
				session: params.session,
				withdrawQueuedReservation: params.withdrawQueuedReservation,
				reason: "killed",
				suppressTaskDelivery: params.suppressTaskDelivery,
				context: stateContext,
				assertCurrent: assertSelectedRun
			});
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			logVerbose(`subagents control kill: failed to persist ${runId}: ${formatErrorMessage(error)}`);
			return 0;
		}
	};
	const initial = currentEntry();
	if (!initial || !isCurrent()) return {
		killed: false,
		superseded: true
	};
	if (resolveSubagentKillTargetState(initial)) {
		let continuationRetired = false;
		if (params.suppressTaskDelivery && initial.requesterSettleWake) {
			await cancelSubagentRequesterSettleWake(initial, () => {
				params.cancellationControl.assertCurrent();
				if (!isCurrent()) throw new Error("Subagent ownership changed during cancellation; retry.");
			});
			continuationRetired = initial.execution.status === "terminal" && initial.pauseReason !== "sessions_yield";
		}
		if (currentEntry()?.endedReason === "subagent-killed" && currentEntry()?.suppressAnnounceReason !== "steer-restart") await markKilledBestEffort();
		if (!isCurrent()) return {
			killed: false,
			superseded: true
		};
		return {
			killed: false,
			targetState: targetState(),
			...continuationRetired ? { continuationRetired: true } : {}
		};
	}
	if (initial.execution.endedAt && initial.pauseReason !== "sessions_yield") return { killed: false };
	const childSessionKey = params.entry.childSessionKey;
	const resolved = params.session;
	const { legacy, embeddedExecution, replyExecution } = await prepareLegacySubagentKill(initial);
	assertSelectedRun();
	const sessionId = resolved.entry?.sessionId;
	const commands = params.commands ?? captureSubagentCommands(initial, resolved);
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
					}
				});
				if (claim) return { claim };
				const accepted = currentEntry();
				if (!accepted || accepted.runId === selected.runId) return { claim: void 0 };
				selected = accepted;
			}
			return { claim: void 0 };
		} catch (error) {
			return { failure: killFailure(error, "Failed to persist subagent kill intent: ", (candidate) => formatErrorMessage(candidate instanceof SubagentRegistryWriteError ? candidate.cause : candidate)) };
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
			return killFailure(error, "Subagent remained active and its kill intent could not be released: ");
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
		if (acceptance.callerFailure) return cancellationFailure(acceptance.callerFailure.error, true);
		try {
			params.cancellationControl.assertCurrent();
			return;
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			return cancellationFailure(error, true);
		}
	};
	const isKilledTarget = (target) => target.state === "terminal" && target.task.status === "cancelled";
	const killOwnerCurrent = () => {
		const current = currentEntry();
		return current !== void 0 && isCurrent() && (!killClaim || (matchesSubagentKillIntent(current.killIntent, killClaim) || !current.killIntent && current.endedReason === "subagent-killed" && current.killReconciliation?.killedAt === killClaim.requestedAt && current.killReconciliation.taskCancellationAccepted === true && current.execution.lifecycleGeneration === killClaim.lifecycleGeneration) && (killClaim.lifecycleGeneration === void 0 || isAgentEventLifecycleGenerationCurrent(killClaim.lifecycleGeneration)));
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
	const acceptance = createSubagentKillAcceptance({
		stopAcceptance,
		assertCallerCurrent: params.cancellationControl.assertCurrent,
		assertNativeCurrent: assertSelectedRun,
		ownsSessionIncarnation,
		isKillOwnerCurrent: killOwnerCurrent,
		commands
	});
	const releaseChangedSessionKill = async (claim) => {
		try {
			await releaseKillClaim(claim);
		} catch (error) {
			return killFailure(error, "Subagent session changed and its kill intent could not be released: ");
		}
		return {
			killed: false,
			error: "Subagent session changed while the kill was pending; retry."
		};
	};
	const cancellation = runExclusiveSessionLifecycleMutation("subagent-kill", {
		scope: resolved.storePath,
		identities: [childSessionKey, sessionId],
		prepare: async () => {
			for (let pending = params.cancellationControl.prepareRead?.(); pending; pending = params.cancellationControl.prepareRead?.()) await pending;
			if (!isCurrent()) return;
			let declined = declineRevokedCancellation();
			if (declined) {
				preparationResult = await declined;
				return;
			}
			await params.refreshDescendants();
			assertState();
			if (!legacy && params.beforeSessionKill) commands?.observe(currentEntry());
			const execution = captureExecution()?.execution;
			const alreadyAborted = execution?.controller.signal.aborted;
			try {
				if (!legacy && await params.beforeSessionKill?.() === false) {
					admission = "declined";
					return;
				}
			} finally {
				acceptance.accept(!alreadyAborted && execution?.controller.signal.aborted === true);
			}
			if (!isCurrent()) return;
			declined = declineRevokedCancellation();
			if (declined) {
				preparationResult = await declined;
				return;
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
			declined = declineRevokedCancellation();
			if (declined) {
				preparationResult = await declined;
				return;
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
			commands?.observe(currentEntry());
			if (legacy) {
				const interrupted = await interruptLegacySubagentRun({
					entry: params.entry,
					session: resolved,
					embeddedExecution,
					replyExecution,
					captureExecution,
					commands,
					acceptance,
					stopAcceptance,
					assertCallerCurrent: params.cancellationControl.assertCurrent,
					assertSelectedRun
				});
				if (interrupted === "superseded") preparationResult = killClaim ? await releaseChangedSessionKill(killClaim) : {
					killed: false,
					superseded: true
				};
				else admission = interrupted;
				return;
			}
			const interruption = startSessionWorkAdmissionInterruption({
				scope: resolved.storePath,
				identities: [childSessionKey, sessionId],
				reason: createAgentRunDirectAbortError()
			});
			const interruptedSelectedRun = () => {
				const selected = currentEntry();
				return selected !== void 0 && killOwnerCurrent() && (interruption.interruptedRunIds.has(params.entry.runId) || interruption.interruptedRunIds.has(selected.runId));
			};
			const released = await acceptance.drain(interruption.released, interruptedSelectedRun);
			admission = released ? "ready" : "busy";
			const afterInterruption = currentEntry();
			if (released && !acceptance.callerFailure && params.beforeSessionKill && afterInterruption?.swarmLaunchPending === true && afterInterruption.execution.restartRecovery === void 0 && !resolveSubagentKillTargetState(afterInterruption) && isCurrent()) {
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
			if (!readFailure && !acceptance.callerFailure) await params.refreshDescendants();
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
			const declined = readFailure || acceptance.callerFailure ? void 0 : declineRevokedCancellation();
			if (declined && !stopAcceptance.accepted) return declined;
			if (!killClaim) {
				if (acceptance.callerFailure) return { killed: false };
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
					return {
						...killFailure(error, `Failed to ${marked > 0 ? "finish subagent kill cleanup" : "persist subagent kill tombstone"}: `),
						killed: marked > 0
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
			if (legacy) {
				if (!stopAcceptance.accepted) params.cancellationControl.assertCurrent();
				assertSelectedRun();
				return await settleTargetCancellation();
			}
			try {
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				if (!killOwnerCurrent()) return {
					killed: false,
					superseded: true
				};
				if (readFailure || declined || acceptance.callerFailure) {
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
				commands?.observe(currentEntry());
				const aborted = sessionId ? abortEmbeddedAgentRun(sessionId) : false;
				acceptance.accept(aborted);
				if (acceptance.callerFailure) return await settleTargetCancellation();
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
				return killFailure(error);
			}
		},
		finalize: async () => {
			if (killClaim && matchesSubagentKillIntent(currentEntry()?.killIntent, killClaim)) params.withdrawQueuedReservation();
		}
	});
	return await acceptance.finish(cancellation, { settleCommands: params.commands === void 0 });
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
	const unresolvedRunIds = /* @__PURE__ */ new Set();
	let selectedCount = 0;
	const releaseSessions = [];
	const retirements = [];
	const holds = [];
	const hold = (tree) => {
		if (!tree.dispatchHold) {
			tree.dispatchHold = holdQueuedSwarmRun(tree.entry.schedulerSlotId ?? tree.entry.runId);
			if (tree.dispatchHold) holds.push(tree.dispatchHold);
		}
	};
	const controllerFor = (tree) => ({
		controllerSessionKey: tree.entry.childSessionKey,
		controllerAgentId: resolveSubagentChildSessionOwner(tree.entry, params.cfg).agentId
	});
	const capture = (pending, runs, trees, owner, parent, ownsRoot) => {
		const controller = owner ? { ...owner } : void 0;
		for (const snapshot of runs) {
			assertCurrent();
			if (parent && resolveSubagentChildAuthority(parent.entry).status === "legacy-unverified" && !isCurrentSubagentRun(parent.entry, params.cfg) && snapshot.requesterTurnRunId !== parent.entry.runId) continue;
			const authority = resolveSubagentChildAuthority(snapshot);
			if (authority.status === "mismatch") {
				if (!unresolvedRunIds.has(snapshot.runId) && (!controller || !ensureSubagentControllerOwnsRun({
					cfg: params.cfg,
					controller,
					entry: snapshot
				})) && ownsRoot?.(snapshot) !== false && parent?.canTraverse(false) !== false) {
					unresolvedRunIds.add(snapshot.runId);
					trees.push({
						entry: snapshot,
						isCurrent: () => false,
						ownsRun: () => isSameSubagentRunOwner(subagentRuns.get(snapshot.runId), snapshot),
						canTraverse: () => false,
						prepareRead: () => void 0,
						children: [],
						errors: /* @__PURE__ */ new Set([authority.error]),
						discoveryFailed: true
					});
				}
				continue;
			}
			const childOwner = resolveSubagentChildAgentId(snapshot);
			const legacy = authority.status === "legacy-unverified";
			const entry = legacy ? subagentRuns.get(snapshot.runId) : getLatestOwnedSubagentRun(snapshot.childSessionKey, childOwner, params.cfg);
			const selectedForChild = selected.get(snapshot.childSessionKey) ?? /* @__PURE__ */ new Set();
			const selectedOwner = legacy ? `${childOwner}\0${snapshot.runId}` : childOwner;
			if (!entry || !isSameSubagentRunOwner(entry, snapshot) || selectedForChild.has(selectedOwner)) continue;
			const ownerCurrent = (candidate, requirePreparedSession = true) => isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && parent?.canTraverse(requirePreparedSession) !== false && ownsRoot?.(candidate) !== false && (!controller || !ensureSubagentControllerOwnsRun({
				cfg: params.cfg,
				controller,
				entry: candidate
			}));
			if (!ownerCurrent(entry, false) || !legacy && !isCurrentSubagentRun(entry, params.cfg)) continue;
			selectedForChild.add(selectedOwner);
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
			const retirement = subagentRuns.captureRetirement(entry, (candidate) => isSameSubagentRunOwner(legacy ? subagentRuns.get(candidate.runId) : latest(), candidate));
			retirements.push(retirement);
			const selectedEntry = () => retirement.observation.entry;
			const ownsRun = () => {
				const observed = retirement.observation;
				const current = observed.entry;
				return current !== void 0 && isSameSubagentRunOwner(current, entry) && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && (isSameSubagentRunOwner(getCurrentSubagentRunOwner(subagentRuns, current), current) || observed.state === "retired");
			};
			const isCurrent = (candidate, requirePreparedSession = true) => {
				const current = getCurrentSubagentRunOwner(subagentRuns, entry);
				return current !== void 0 && isSameSubagentRunOwner(candidate, entry) && isSameSubagentRunOwner(current, entry) && ownsRun() && ownerCurrent(current, requirePreparedSession) && (legacy || isCurrentSubagentRun(current, params.cfg)) && (!requirePreparedSession || ownsSessionIncarnation());
			};
			const canTraverse = (requirePreparedSession = true) => {
				const current = selectedEntry();
				if (!current || !ownerCurrent(current, requirePreparedSession) || !ownsRun()) return false;
				const replacement = latest();
				return (legacy || isSameSubagentRunOwner(replacement, current) || retirement.observation.state === "retired" && (!replacement || compareSubagentRunGeneration(replacement, current) < 0)) && (!requirePreparedSession || ownsSessionIncarnation());
			};
			const prepareRead = () => prepareSubagentKillSessionReads([parent?.prepareRead, session?.prepareRead], () => assertSubagentRegistryWriteSourceCurrent(stateContext));
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
						session = await prepareSubagentKillSession(params.cfg, selectedRun.childSessionKey, () => assertSubagentRegistryWriteSourceCurrent(stateContext), selectedRun.execution.transcriptTarget, selectedRun.childAgentId, selectedRun.childSessionIdentity, selectedRun);
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
	const captureResidentDescendants = (pending) => {
		const resident = new Map(subagentRuns);
		const hasRetainedWork = captureSubagentRetainedWork();
		for (const { tree } of pending) {
			const controller = controllerFor(tree);
			capture(pending, listRunsForControllerFromRuns(resident, controller.controllerSessionKey, controller.controllerAgentId).filter(hasRetainedWork), tree.children, controller, tree);
		}
	};
	const select = async (runs, trees, owner, parent, ownsRoot) => {
		const pending = [];
		capture(pending, runs, trees, owner, parent, ownsRoot);
		captureResidentDescendants(pending);
		const preparation = params.prepareRead?.();
		if (preparation) await preparation;
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
				const controller = controllerFor(tree);
				const candidates = await withSubagentRunReadSnapshot(subagentRuns, (snapshot) => ({
					runIds: [...snapshot.values()].filter((candidate) => (candidate.controllerSessionKey?.trim() || candidate.requesterSessionKey) === controller.controllerSessionKey).map((candidate) => candidate.runId),
					sessionKeys: [controller.controllerSessionKey]
				}), (_selection, runs) => listRunsForControllerFromRuns(new Map(runs), controller.controllerSessionKey, controller.controllerAgentId), {
					sessionKeys: [controller.controllerSessionKey],
					descendants: false
				});
				assertCurrent();
				for (let pending = tree.prepareRead(); pending; pending = tree.prepareRead()) {
					await pending;
					assertCurrent();
				}
				await select(candidates.filter(captureSubagentRetainedWork()), tree.children, controller, tree);
			}
			for (const child of tree.children) await refreshTree(child);
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			tree.discoveryFailed = true;
			tree.errors.add(formatErrorMessage(error));
		}
	};
	const trees = [];
	const publishedRoots = [];
	let rootObservationFailure;
	let disposeRootObservation;
	const sealRootSelection = () => {
		disposeRootObservation?.();
		if (rootObservationFailure) throw rootObservationFailure.error;
	};
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
							if (rootObservationFailure) throw rootObservationFailure.error;
							for (const pending of publishedRoots.splice(0)) await pending.prepare();
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
		const selectPublishedRoot = params.selectPublishedRoot;
		if (selectPublishedRoot) disposeRootObservation = subscribeSubagentRunChanges("persistence", ({ runIds }) => {
			try {
				runInScope(() => {
					const pending = [];
					for (const runId of runIds ?? []) {
						const entry = subagentRuns.get(runId);
						if (entry && selectPublishedRoot(entry)) capture(pending, [entry], trees, params.controller, void 0, params.ownsRoot);
					}
					if (pending.length > 0) {
						captureResidentDescendants(pending);
						publishedRoots.push(...pending);
					}
				});
			} catch (error) {
				rootObservationFailure = { error };
				disposeRootObservation?.();
			}
		});
		await select(params.runs, trees, params.controller, void 0, params.ownsRoot);
		const scope = {
			cancellationControl,
			stateContext,
			refresh,
			sealRootSelection
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
	disposeRootObservation?.();
	if (rootObservationFailure && !outcome.ok && outcome.error !== rootObservationFailure.error) outcome = {
		ok: false,
		error: new AggregateError([outcome.error, rootObservationFailure.error], "Subagent cancellation and root observation failed")
	};
	refreshClosed = true;
	await refreshWork;
	if (refreshFailure && !outcome.ok && outcome.error !== refreshFailure.error) outcome = {
		ok: false,
		error: new AggregateError([outcome.error, refreshFailure.error], "Subagent cancellation and discovery failed")
	};
	retirements.forEach(({ completePublication }) => completePublication());
	const withdrawRetainedKills = (selectedTrees) => {
		for (const tree of selectedTrees) {
			if (tree.entry.killIntent && tree.ownsRun()) tree.dispatchHold?.withdraw();
			withdrawRetainedKills(tree.children);
		}
	};
	withdrawRetainedKills(trees);
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
	const retired = await Promise.allSettled(retirements.map(async ({ release }) => release()));
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
	const commands = params.commands;
	let result = tree.isCurrent(entry) ? await killSubagentRun({
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
	if (result.superseded && !tree.isCurrent(entry) && tree.canTraverse() && matchesExpected(entry)) result = {
		killed: false,
		targetState: resolveSubagentKillTargetState(tree.entry),
		...result.error !== void 0 ? { error: result.error } : {},
		...result.completedCleanupError !== void 0 ? { completedCleanupError: result.completedCleanupError } : {}
	};
	if (result.continuationRetired) params.onContinuationRetired?.();
	if (result.killed) params.onKilled?.(tree.entry);
	if (commands && !result.superseded && !result.declined && !result.error) {
		for (let pending = cancellationControl.prepareRead(); pending; pending = cancellationControl.prepareRead()) {
			await pending;
			cancellationControl.assertCurrent();
		}
		cancellationControl.assertCurrent();
		if (!tree.canTraverse() || !matchesExpected(tree.entry)) return {
			entry: tree.entry,
			session,
			result: {
				...result,
				superseded: true
			}
		};
		commands.observe(tree.entry);
		commands.cancel(() => {
			cancellationControl.assertCurrent();
			if (!tree.canTraverse() || !matchesExpected(tree.entry)) throw new Error("Subagent ownership changed during command cancellation.");
		});
	}
	return {
		entry: tree.entry,
		session,
		result
	};
}
async function visitAll(work) {
	const results = await Promise.allSettled(work);
	for (const result of results) if (result.status === "rejected") throw result.reason;
}
async function killSubagentRunTree(params) {
	let continuationRetired = false;
	const visits = /* @__PURE__ */ new Map();
	const visit = async (tree, suppressCompletedWakes) => {
		let result = visits.get(tree);
		try {
			if (!result) {
				result = {
					descendants: false,
					suppressCompletedWakes,
					execAborted: false
				};
				visits.set(tree, result);
				const commands = params.stopRequestCommands ? captureSubagentCommands(tree.entry, tree.session) : void 0;
				if (!tree.entry.execution.endedAt || tree.session && (captureSubagentExecution({
					entry: tree.entry,
					session: tree.session
				})?.execution.executionSettlement || getSubagentExecutionCleanup(tree.entry, tree.session.entry)) || tree.entry.pauseReason === "sessions_yield" || params.suppressTaskDelivery && suppressCompletedWakes && tree.entry.requesterSettleWake || commands?.owners.length) {
					let stopped;
					let failure;
					const visitResult = result;
					try {
						stopped = await killLatestSubagentRun({
							...params,
							tree,
							commands,
							onContinuationRetired: () => {
								continuationRetired = true;
							},
							onKilled: (entry) => {
								visitResult.label = resolveSubagentLabel(entry);
							}
						});
					} catch (error) {
						failure = { error };
					}
					result.execAborted = commands?.owners.some((owner) => owner.signal.aborted) === true;
					try {
						await commands?.settle();
					} catch (error) {
						const message = `Subagent command cleanup failed: ${formatErrorMessage(error)}`;
						if (failure) failure = { error: new AggregateError([failure.error, error], message) };
						else if (stopped) stopped.result = {
							...stopped.result,
							error: [stopped.result.error, message].filter(Boolean).join(" ")
						};
					}
					if (failure) throw failure.error;
					if (!stopped) return;
					if (stopped.result.error) tree.errors.add(stopped.result.error);
					if (stopped.result.error || stopped.result.completedCleanupError || stopped.result.declined) result.suppressCompletedWakes = false;
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
		labels,
		execAborted: [...visits.values()].some((result) => result.execAborted),
		...continuationRetired ? { continuationRetired: true } : {}
	};
}
async function killSubagentRoot(params) {
	let stopped = {
		entry: params.tree.entry,
		result: { killed: false }
	};
	let cascade = {
		killed: 0,
		labels: [],
		execAborted: false
	};
	try {
		stopped = await killLatestSubagentRun(params);
		if (stopped.result.error) params.tree.errors.add(stopped.result.error);
		for (let pending = params.tree.prepareRead(); pending; pending = params.tree.prepareRead()) await pending;
		if (!stopped.result.superseded && !stopped.result.declined && params.tree.canTraverse()) cascade = await killSubagentRunTree({
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
		if (params.requestSelection?.prepare) await params.requestSelection.prepare();
		await params.beforeKill?.(() => {});
		return {
			status: "forbidden",
			error: "Leaf subagents cannot control other sessions.",
			killed: 0,
			labels: []
		};
	}
	const selection = params.requestSelection ? {
		...params,
		runs: params.requestSelection.runs,
		controller: void 0,
		ownsRoot: params.requestSelection.ownsRoot,
		selectPublishedRoot: params.requestSelection.selectPublishedRoot
	} : params;
	if (!params.requestSelection?.sessionGeneration && !params.requestSelection?.prepare) return killSelectedSubagentRuns(selection);
	let generation;
	const assertCurrent = () => {
		params.assertCurrent?.();
		generation?.assertCurrent();
	};
	let prepared = false;
	let preparation;
	const prepareRead = () => {
		if (prepared) return generation?.prepareRead();
		return preparation ??= (async () => {
			if (params.requestSelection?.prepare) await params.requestSelection.prepare();
			const origin = params.requestSelection?.sessionGeneration;
			if (origin) generation = await prepareSessionGenerationFacts(origin);
			prepared = true;
		})();
	};
	try {
		return await killSelectedSubagentRuns({
			...selection,
			assertCurrent,
			prepareRead,
			beforeKill: async (sealRootSelection) => {
				assertCurrent();
				return params.beforeKill ? await params.beforeKill(sealRootSelection) : true;
			}
		});
	} finally {
		generation?.release();
	}
}
/** Lifecycle cleanup owns both the completion requester and its separately scoped controller. */
async function killSessionSubagentRuns(params) {
	return killSelectedSubagentRuns(await prepareSessionSubagentKillSelection(params));
}
async function killSelectedSubagentRuns(params) {
	const result = await withSubagentKillScope(params, async (scope, trees) => {
		const accepted = params.beforeKill ? await params.beforeKill(scope.sealRootSelection) : true;
		scope.sealRootSelection();
		if (accepted) await scope.refresh();
		const acceptedTrees = accepted ? trees : [];
		return {
			...await killSubagentRunTree({
				suppressTaskDelivery: params.suppressTaskDelivery,
				stopRequestCommands: true,
				trees: acceptedTrees,
				scope
			}),
			...collectKillErrors(acceptedTrees)
		};
	});
	result.errors.unshift(...params.preparationErrors ?? []);
	result.failed += params.preparationErrors?.length ?? 0;
	if (result.errors.length > 0) return {
		status: "error",
		error: result.errors.join("; "),
		failed: result.failed,
		killed: result.killed,
		labels: result.labels,
		...result.execAborted ? { execAborted: true } : {},
		...result.continuationRetired ? { continuationRetired: true } : {}
	};
	return {
		status: "ok",
		killed: result.killed,
		labels: result.labels,
		...result.execAborted ? { execAborted: true } : {},
		...result.continuationRetired ? { continuationRetired: true } : {}
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
	const expectedRunId = params.expectedRunId?.trim();
	const selected = expectedRunId ? subagentRuns.get(expectedRunId) : void 0;
	const entry = selected && selected.childSessionKey === targetSessionKey && resolveSubagentChildAuthority(selected).status !== "verified" ? selected : getLatestOwnedSubagentRun(targetSessionKey, params.agentId, params.cfg);
	if (!entry) return publish({
		found: false,
		killed: false
	});
	const expectedTaskRunId = params.expectedTaskRunId?.trim();
	if (expectedRunId && entry.runId !== expectedRunId || expectedTaskRunId && (entry.taskRunId ?? entry.runId) !== expectedTaskRunId || params.expectedGeneration !== void 0 && entry.generation !== params.expectedGeneration || params.expectedOwnerKey?.trim() && entry.requesterSessionKey !== params.expectedOwnerKey.trim()) return publish({
		found: false,
		killed: false
	});
	const authority = resolveSubagentChildAuthority(entry);
	if (authority.status === "mismatch") return publish({
		found: true,
		killed: false,
		cascadeKilled: 0,
		runId: entry.runId,
		sessionKey: entry.childSessionKey,
		error: authority.error
	});
	let rootStopSuperseded = false;
	return withSubagentKillScope({
		cfg: params.cfg,
		runs: [entry],
		assertCurrent: control?.assertCurrent,
		prepareRead: control?.prepareRead,
		ownsRoot: params.expectedGeneration === void 0 ? void 0 : (candidate) => {
			const current = getLatestOwnedSubagentRun(candidate.childSessionKey, authority.childAgentId, params.cfg);
			return !current || isSameSubagentRunOwner(current, candidate);
		}
	}, async (scope, [tree]) => {
		if (!tree) return {
			found: false,
			killed: false
		};
		const stopped = await killSubagentRoot({
			tree,
			scope,
			beforeSessionKill: control?.beforeSessionKill,
			expectedGeneration: params.expectedGeneration,
			expectedOwnerKey: params.expectedOwnerKey?.trim() || void 0
		});
		const { result: stopResult, cascade } = stopped;
		rootStopSuperseded = stopResult.superseded === true;
		const targetState = resolveSubagentKillTargetState(tree.entry) ?? stopResult.targetState;
		const killedTarget = targetState?.state === "terminal" && targetState.task.status === "cancelled";
		const stopResultAlreadyClearedAbort = stopResult.targetState !== void 0 && !(stopResult.targetState.state === "terminal" && stopResult.targetState.task.status === "cancelled");
		const resolved = stopped.session;
		if (targetState && !killedTarget && !stopResultAlreadyClearedAbort && resolved) await persistSubagentAbortedLastRun({
			childSessionKey: targetSessionKey,
			session: resolved,
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
	}, control?.preparePublication, (result) => {
		const caller = getGatewayToolCallerIdentity();
		const instance = caller?.operationalRunInstance;
		if (result.found && !result.error && result.targetState?.state === "terminal" && result.targetState.task.status === "cancelled" && caller && instance && instance.runId === entry.requesterTurnRunId && caller.sessionKey === entry.requesterSessionKey && caller.agentId === authority.requesterAgentId && getActiveAgentRunDelegatedAuthority(instance)?.operationalRunInstance === instance) retireAcceptedSessionSpawnCompletionForRun(instance, {
			runId: entry.taskRunId ?? entry.runId,
			childSessionKey: entry.childSessionKey
		});
		return publish(result);
	});
}
//#endregion
export { killSessionSubagentRuns as n, killSubagentRunAdmin as r, killAllControlledSubagentRuns as t };
