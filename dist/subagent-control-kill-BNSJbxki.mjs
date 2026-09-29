import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { _ as startSessionWorkAdmissionInterruption, g as runExclusiveSessionLifecycleMutation, v as waitForSessionWorkAdmissionRelease } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { ot as SUBAGENT_KILL_TASK_ERROR } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Cd1iJzC7.mjs";
import "./subagent-lifecycle-events-CDQCTuLB.mjs";
import { j as subagentRuns, y as holdQueuedSwarmRun } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { f as listSubagentRunsForController, p as listSubagentRunsForRequester } from "./subagent-registry-read-C2SIiLpb.mjs";
import { m as captureTaskCancellationControl } from "./task-registry-J6rCfMnh.mjs";
import { t as compareSubagentRunGeneration } from "./subagent-run-generation-BpwN1g73.mjs";
import { n as resolveSubagentLabel } from "./subagents-utils-uco3tjYq.mjs";
import { n as resolveSubagentRequesterAgentId } from "./subagent-requester-owner-CrNX9EIS.mjs";
import { a as getLatestOwnedSubagentRun, i as ensureSubagentControllerOwnsRun, o as isCurrentSubagentRun, s as isSameSubagentRunGeneration } from "./subagent-control-scope-BhAfxMhw.mjs";
import { U as resolveFinalizedSubagentTaskState, W as resolveKilledSubagentTaskEndedAt } from "./subagent-completion-admission.store-S2mDR3VB.mjs";
import { S as releaseSubagentRunKillClaim, a as claimSubagentRunKill, g as markSubagentRunTerminated } from "./subagent-registry-B499cgI4.mjs";
//#region src/agents/subagents/registry/subagent-control-kill-runtime.ts
/** Session-lifecycle mutation and persistence for subagent kills. */
const subagentKillRuntimeLoader = createLazyImportLoader(() => import("./subagent-control.runtime.js"));
function resolveSubagentKillTargetState(entry) {
	if (entry.endedReason === "subagent-killed" && entry.suppressAnnounceReason !== "steer-restart") {
		const taskEndedAt = resolveKilledSubagentTaskEndedAt(entry);
		return typeof taskEndedAt === "number" ? {
			state: "terminal",
			task: {
				status: "cancelled",
				endedAt: taskEndedAt,
				lastEventAt: taskEndedAt,
				error: SUBAGENT_KILL_TASK_ERROR,
				progressSummary: entry.completion?.resultText ?? void 0,
				terminalSummary: null
			}
		} : void 0;
	}
	const terminal = resolveFinalizedSubagentTaskState(entry);
	if (terminal) return {
		state: "terminal",
		task: terminal
	};
	return typeof entry.execution.endedAt === "number" && entry.pauseReason !== "sessions_yield" && (entry.endedReason !== "subagent-killed" || entry.suppressAnnounceReason === "steer-restart") ? { state: "finalizing" } : void 0;
}
async function persistSubagentAbortedLastRun(params) {
	if (!params.hasSessionEntry) return true;
	try {
		await patchSessionEntryCore({
			storePath: params.storePath,
			sessionKey: params.childSessionKey
		}, (current) => current.sessionId !== params.expectedSessionId || current.lifecycleRevision !== params.expectedLifecycleRevision || params.isCurrent?.(current) === false ? null : {
			...current,
			abortedLastRun: params.abortedLastRun,
			updatedAt: Date.now()
		}, {
			assertCommitAllowed: params.assertCommitAllowed,
			replaceEntry: true
		});
		return true;
	} catch (error) {
		if (params.strict) throw error;
		logVerbose(`subagents control kill: failed to persist abortedLastRun=${params.abortedLastRun} for ${params.childSessionKey}: ${formatErrorMessage(error)}`);
		return false;
	}
}
function markSubagentRunTerminatedBestEffort(params) {
	try {
		return markSubagentRunTerminated(params);
	} catch (error) {
		logVerbose(`subagents control kill: failed to persist ${params.runId ?? params.childSessionKey ?? "unknown"}: ${formatErrorMessage(error)}`);
		return 0;
	}
}
function resolveSubagentKillSession(cfg, sessionKey) {
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: parseAgentSessionKey(sessionKey)?.agentId });
	return {
		storePath,
		entry: loadExactSessionEntryReadOnly({
			storePath,
			sessionKey,
			clone: false
		})?.entry
	};
}
async function killSubagentRun(params) {
	const isCurrent = () => isCurrentSubagentRun(params.entry, params.cfg) && params.isCurrent?.(params.entry) !== false;
	const markKilledBestEffort = () => markSubagentRunTerminatedBestEffort({
		runId: params.entry.runId,
		reason: "killed",
		suppressTaskDelivery: params.suppressTaskDelivery
	});
	const initialTargetState = resolveSubagentKillTargetState(params.entry);
	if (initialTargetState) {
		if (params.entry.endedReason === "subagent-killed" && params.entry.suppressAnnounceReason !== "steer-restart") markKilledBestEffort();
		return {
			killed: false,
			targetState: initialTargetState
		};
	}
	if (params.entry.execution.endedAt && params.entry.pauseReason !== "sessions_yield") return { killed: false };
	const childSessionKey = params.entry.childSessionKey;
	const resolved = params.session;
	const sessionId = resolved.entry?.sessionId;
	const sessionLifecycleRevision = resolved.entry?.lifecycleRevision;
	const runtime = await subagentKillRuntimeLoader.load();
	let admission = "ready";
	let killClaim;
	let stopAccepted = false;
	let preparationResult;
	const cancellationFailure = (error, declined) => {
		let reason = formatErrorMessage(error);
		if (killClaim && !stopAccepted) try {
			releaseSubagentRunKillClaim({
				runId: params.entry.runId,
				expected: params.entry,
				claim: killClaim
			});
		} catch (releaseError) {
			reason += ` Kill intent could not be released: ${formatErrorMessage(releaseError)}`;
		}
		return {
			killed: false,
			sessionId,
			...declined ? { declined } : {},
			error: reason
		};
	};
	const declineRevokedCancellation = () => {
		try {
			params.cancellationControl?.assertCurrent();
			return;
		} catch (error) {
			return cancellationFailure(error, true);
		}
	};
	const killOwnerCurrent = () => isCurrent() && (!killClaim || (params.entry.killIntent === killClaim || params.entry.endedReason === "subagent-killed" && params.entry.killReconciliation !== void 0 && params.entry.execution.lifecycleGeneration === killClaim.lifecycleGeneration) && (killClaim.lifecycleGeneration === void 0 || isAgentEventLifecycleGenerationCurrent(killClaim.lifecycleGeneration)));
	const ownsSessionIncarnation = () => {
		const currentSessionEntry = loadExactSessionEntryReadOnly({
			storePath: resolved.storePath,
			sessionKey: childSessionKey,
			clone: false
		})?.entry;
		return currentSessionEntry !== void 0 === (resolved.entry !== void 0) && currentSessionEntry?.sessionId === sessionId && currentSessionEntry?.lifecycleRevision === sessionLifecycleRevision;
	};
	const releaseChangedSessionKill = (claim) => {
		try {
			releaseSubagentRunKillClaim({
				runId: params.entry.runId,
				expected: params.entry,
				claim
			});
		} catch (error) {
			return {
				killed: false,
				sessionId,
				error: `Subagent session changed and its kill intent could not be released: ${formatErrorMessage(error)}`
			};
		}
		return {
			killed: false,
			sessionId,
			error: "Subagent session changed while the kill was pending; retry."
		};
	};
	return await runExclusiveSessionLifecycleMutation({
		scope: resolved.storePath,
		identities: [childSessionKey, sessionId],
		prepare: async () => {
			for (let pending = params.cancellationControl?.prepareRead?.(); pending; pending = params.cancellationControl?.prepareRead?.()) await pending;
			if (!isCurrent()) return;
			preparationResult = declineRevokedCancellation();
			if (preparationResult) return;
			params.refreshDescendants();
			if (params.beforeSessionKill?.() === false) {
				admission = "declined";
				return;
			}
			if (!isCurrent()) return;
			preparationResult = declineRevokedCancellation();
			if (preparationResult) return;
			if (params.entry.swarmLaunchPending !== true && params.entry.execution.restartRecovery === void 0 && !resolveSubagentKillTargetState(params.entry)) {
				try {
					killClaim = claimSubagentRunKill({
						runId: params.entry.runId,
						expected: params.entry,
						sessionId,
						sessionLifecycleRevision,
						suppressTaskDelivery: params.suppressTaskDelivery
					});
				} catch (error) {
					preparationResult = {
						killed: false,
						sessionId,
						error: `Failed to persist subagent kill intent: ${formatErrorMessage(error)}`
					};
					return;
				}
				if (killClaim) {
					if (!ownsSessionIncarnation()) {
						preparationResult = releaseChangedSessionKill(killClaim);
						return;
					}
					if (!killOwnerCurrent()) {
						preparationResult = {
							killed: false,
							sessionId,
							superseded: true
						};
						return;
					}
				}
			}
			preparationResult = declineRevokedCancellation();
			if (preparationResult) return;
			const interruption = startSessionWorkAdmissionInterruption({
				scope: resolved.storePath,
				identities: [childSessionKey, sessionId],
				reason: createAgentRunDirectAbortError()
			});
			stopAccepted = interruption.interruptedRunIds.has(params.entry.runId) && killOwnerCurrent();
			admission = await waitForSessionWorkAdmissionRelease(interruption.released, 15e3) ? "ready" : "busy";
		},
		run: async () => {
			if (preparationResult) return preparationResult;
			if (admission === "declined") return {
				killed: false,
				sessionId,
				declined: true
			};
			if (admission === "busy") {
				try {
					if (killClaim && !stopAccepted) releaseSubagentRunKillClaim({
						runId: params.entry.runId,
						expected: params.entry,
						claim: killClaim
					});
				} catch (error) {
					return {
						killed: false,
						sessionId,
						error: `Subagent remained active and its kill intent could not be released: ${formatErrorMessage(error)}`
					};
				}
				return {
					killed: false,
					sessionId,
					error: stopAccepted ? "Subagent accepted cancellation but is still active; cleanup is pending." : "Subagent is still active; try the kill again in a moment."
				};
			}
			let readFailure;
			try {
				for (let pending = params.cancellationControl?.prepareRead?.(); pending; pending = params.cancellationControl?.prepareRead?.()) await pending;
			} catch (error) {
				if (!stopAccepted) return cancellationFailure(error);
				readFailure = { error };
			}
			if (!isCurrent()) return {
				killed: false,
				sessionId,
				superseded: true
			};
			if (killClaim && !ownsSessionIncarnation()) return releaseChangedSessionKill(killClaim);
			if (!readFailure) params.refreshDescendants();
			const targetStateAfterRuntimeLoad = resolveSubagentKillTargetState(params.entry);
			if (targetStateAfterRuntimeLoad) {
				const killedTarget = params.entry.endedReason === "subagent-killed" && params.entry.suppressAnnounceReason !== "steer-restart";
				const claimedCurrentKill = killClaim !== void 0 && killOwnerCurrent();
				if (killedTarget && (!killClaim || claimedCurrentKill)) markKilledBestEffort();
				return {
					killed: killedTarget && claimedCurrentKill,
					sessionId,
					targetState: targetStateAfterRuntimeLoad,
					...readFailure ? { error: formatErrorMessage(readFailure.error) } : {}
				};
			}
			const declined = readFailure ? void 0 : declineRevokedCancellation();
			if (declined && !stopAccepted) return declined;
			const persistAbortedLastRun = (abortedLastRun, strict = false) => persistSubagentAbortedLastRun({
				childSessionKey,
				storePath: resolved.storePath,
				hasSessionEntry: resolved.entry !== void 0,
				expectedSessionId: sessionId,
				expectedLifecycleRevision: sessionLifecycleRevision,
				abortedLastRun,
				isCurrent: () => killOwnerCurrent(),
				assertCommitAllowed: () => {
					if (!killOwnerCurrent()) throw new Error("subagent kill lifecycle retired before abort-marker commit");
				},
				strict
			});
			if (!killClaim) try {
				killClaim = claimSubagentRunKill({
					runId: params.entry.runId,
					expected: params.entry,
					sessionId,
					sessionLifecycleRevision,
					suppressTaskDelivery: params.suppressTaskDelivery
				});
			} catch (error) {
				return {
					killed: false,
					sessionId,
					error: `Failed to persist subagent kill intent: ${formatErrorMessage(error)}`
				};
			}
			if (!killClaim) return {
				killed: false,
				sessionId,
				superseded: true
			};
			const claimedKill = killClaim;
			const settleTargetCancellation = async () => {
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				if (!killOwnerCurrent()) return {
					killed: false,
					sessionId,
					superseded: true
				};
				let marked;
				try {
					marked = markSubagentRunTerminated({
						runId: params.entry.runId,
						reason: "killed",
						suppressTaskDelivery: params.suppressTaskDelivery
					});
				} catch (error) {
					return {
						killed: false,
						sessionId,
						error: `Failed to persist subagent kill tombstone: ${formatErrorMessage(error)}`
					};
				}
				await persistAbortedLastRun(true);
				return {
					killed: marked > 0,
					sessionId
				};
			};
			try {
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				if (!killOwnerCurrent()) return {
					killed: false,
					sessionId,
					superseded: true
				};
				if (readFailure || declined) {
					const settled = await settleTargetCancellation();
					return readFailure ? {
						...settled,
						error: [settled.error, formatErrorMessage(readFailure.error)].filter(Boolean).join(" ")
					} : settled;
				}
				const active = sessionId ? runtime.isEmbeddedAgentRunActive(sessionId) : false;
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				const declinedBeforeAbort = declineRevokedCancellation();
				if (declinedBeforeAbort) return stopAccepted ? await settleTargetCancellation() : declinedBeforeAbort;
				const aborted = sessionId ? runtime.abortEmbeddedAgentRun(sessionId) : false;
				stopAccepted ||= aborted;
				if (!ownsSessionIncarnation()) return releaseChangedSessionKill(claimedKill);
				const declinedBeforeQueueClear = declineRevokedCancellation();
				if (declinedBeforeQueueClear) return stopAccepted ? await settleTargetCancellation() : declinedBeforeQueueClear;
				const cleared = runtime.clearSessionQueues([childSessionKey, sessionId]);
				if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`subagents control kill: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
				if (active && !stopAccepted) {
					try {
						releaseSubagentRunKillClaim({
							runId: params.entry.runId,
							expected: params.entry,
							claim: killClaim
						});
					} catch (error) {
						return {
							killed: false,
							sessionId,
							error: `Subagent remained active and its kill intent could not be released: ${formatErrorMessage(error)}`
						};
					}
					return {
						killed: false,
						sessionId,
						error: "Subagent is still active; try the kill again in a moment."
					};
				}
				const targetState = resolveSubagentKillTargetState(params.entry);
				if (targetState) {
					const killedTarget = targetState.state === "terminal" && targetState.task.status === "cancelled" && targetState.task.error === "Subagent run killed.";
					if (killedTarget) markKilledBestEffort();
					else try {
						releaseSubagentRunKillClaim({
							runId: params.entry.runId,
							expected: params.entry,
							claim: killClaim
						});
					} catch (error) {
						return {
							killed: false,
							sessionId,
							targetState,
							error: `Completed subagent kill intent could not be released: ${formatErrorMessage(error)}`
						};
					}
					return {
						killed: killedTarget,
						sessionId,
						targetState
					};
				}
				return await settleTargetCancellation();
			} catch (error) {
				return {
					killed: false,
					sessionId,
					error: formatErrorMessage(error)
				};
			}
		},
		finalize: async () => {
			if (killClaim && subagentRuns.get(params.entry.runId) === params.entry && params.entry.killIntent === killClaim) params.withdrawQueuedReservation();
		}
	});
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill.ts
/** Authorized tree and admin subagent kill orchestration. */
async function withSubagentKillScope(params, run, publish, preparePublication) {
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const taskControl = captureTaskCancellationControl();
	const cancellationControl = params.assertCurrent ? {
		prepareRead: taskControl?.prepareRead,
		assertCurrent: () => {
			taskControl?.assertCurrent();
			params.assertCurrent?.();
		}
	} : taskControl;
	const selected = /* @__PURE__ */ new Set();
	const releaseRetirements = [];
	const holds = [];
	const hold = (tree) => {
		if (!tree.dispatchHold) {
			tree.dispatchHold = holdQueuedSwarmRun(tree.entry.schedulerSlotId ?? tree.entry.runId);
			if (tree.dispatchHold) holds.push(tree.dispatchHold);
		}
	};
	const select = (runs, trees, owner, isParentCurrent, ownsRoot) => {
		const controller = owner ? { ...owner } : void 0;
		for (const snapshot of runs) {
			params.assertCurrent?.();
			const entry = getLatestOwnedSubagentRun(snapshot.childSessionKey, snapshot.requesterAgentId, params.cfg);
			if (!entry || !isSameSubagentRunGeneration(entry, snapshot) || selected.has(entry.childSessionKey)) continue;
			const ownerCurrent = (candidate) => isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && isParentCurrent?.() !== false && ownsRoot?.(candidate) !== false && (!controller || !ensureSubagentControllerOwnsRun({
				cfg: params.cfg,
				controller,
				entry: candidate
			}));
			if (!ownerCurrent(entry) || !isCurrentSubagentRun(entry, params.cfg)) continue;
			selected.add(entry.childSessionKey);
			const errors = /* @__PURE__ */ new Set();
			let session;
			let ownsSessionIncarnation;
			try {
				session = resolveSubagentKillSession(params.cfg, entry.childSessionKey);
				const { storePath } = session;
				const sessionId = session.entry?.sessionId;
				const lifecycleRevision = session.entry?.lifecycleRevision;
				const present = session.entry !== void 0;
				const { childSessionKey } = entry;
				ownsSessionIncarnation = () => {
					const stored = loadExactSessionEntryReadOnly({
						storePath,
						sessionKey: childSessionKey,
						clone: false
					})?.entry;
					return stored !== void 0 === present && stored?.sessionId === sessionId && stored?.lifecycleRevision === lifecycleRevision;
				};
			} catch (error) {
				errors.add(formatErrorMessage(error));
				ownsSessionIncarnation = () => false;
			}
			const { childSessionKey, requesterAgentId } = entry;
			const latest = () => getLatestOwnedSubagentRun(childSessionKey, requesterAgentId, params.cfg);
			const retirement = subagentRuns.captureRetirement(entry, (candidate) => latest() === candidate);
			releaseRetirements.push(retirement.release);
			const bind = (current) => {
				const { generation, createdAt } = retirement.observation;
				const ownsRun = () => retirement.observation.entry === current && current.generation === generation && current.createdAt === createdAt && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && (subagentRuns.get(current.runId) === current || retirement.observation.state === "retired");
				const isCurrent = (candidate) => retirement.observation.entry === candidate && ownerCurrent(candidate) && isCurrentSubagentRun(candidate, params.cfg) && (candidate !== current || ownsRun()) && ownsSessionIncarnation();
				const canTraverse = () => {
					if (!ownerCurrent(current) || !ownsRun()) return false;
					const replacement = latest();
					return (replacement === current || retirement.observation.state === "retired" && (!replacement || compareSubagentRunGeneration(replacement, current) < 0)) && ownsSessionIncarnation();
				};
				return {
					entry: current,
					isCurrent,
					ownsRun,
					canTraverse
				};
			};
			const tree = {
				...bind(entry),
				session,
				children: [],
				errors,
				discoveryFailed: errors.size > 0
			};
			hold(tree);
			trees.push(tree);
		}
	};
	const refreshTree = (tree) => {
		if (tree.discoveryFailed) return;
		try {
			params.assertCurrent?.();
			if (!tree.canTraverse()) return;
			if (tree.isCurrent(tree.entry)) {
				hold(tree);
				const controller = {
					controllerSessionKey: tree.entry.childSessionKey,
					controllerAgentId: resolveSessionAgentId({
						config: params.cfg,
						sessionKey: tree.entry.childSessionKey
					})
				};
				select(listSubagentRunsForController(controller.controllerSessionKey), tree.children, controller, () => tree.canTraverse());
			}
			tree.children.forEach(refreshTree);
		} catch (error) {
			tree.discoveryFailed = true;
			tree.errors.add(formatErrorMessage(error));
		}
	};
	let outcome;
	try {
		params.assertCurrent?.();
		const trees = [];
		select(params.runs, trees, params.controller, void 0, params.ownsRoot);
		const scope = {
			cancellationControl,
			refresh: () => {
				trees.forEach(refreshTree);
				return selected.size;
			}
		};
		scope.refresh();
		const result = await run(scope, trees);
		if (preparePublication) do
			await preparePublication.prepare();
		while (preparePublication.needsPreparation());
		if (publish) params.assertCurrent?.();
		outcome = {
			ok: true,
			value: publish ? publish(result, trees) : result
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	const released = await Promise.allSettled(holds.map((reservation) => reservation.release()));
	const retired = await Promise.allSettled(releaseRetirements.map(async (release) => release()));
	if (!outcome.ok) throw outcome.error;
	for (const result of [...released, ...retired]) if (result.status === "rejected") throw result.reason;
	return outcome.value;
}
async function killLatestSubagentRun(params) {
	const { tree, scope } = params;
	for (let pending = scope.cancellationControl?.prepareRead?.(); pending; pending = scope.cancellationControl?.prepareRead?.()) await pending;
	const matchesExpected = (entry) => (params.expectedGeneration === void 0 || entry.generation === params.expectedGeneration) && (!params.expectedOwnerKey || entry.requesterSessionKey === params.expectedOwnerKey);
	scope.cancellationControl?.assertCurrent();
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
		cancellationControl: scope.cancellationControl,
		isCurrent: (candidate) => tree.isCurrent(candidate) && matchesExpected(candidate),
		withdrawQueuedReservation: () => tree.dispatchHold?.withdraw(),
		refreshDescendants: scope.refresh
	}) : {
		killed: false,
		superseded: true
	};
	if (result.superseded && !tree.isCurrent(entry) && tree.canTraverse() && matchesExpected(entry)) return {
		entry,
		session,
		result: {
			killed: false,
			targetState: resolveSubagentKillTargetState(entry)
		}
	};
	return {
		entry,
		session,
		result
	};
}
function collectKillErrors(trees, unlabeledRoot) {
	let failed = 0;
	const errors = [];
	const collect = (tree) => {
		if (tree.errors.size > 0) {
			failed += 1;
			for (const error of tree.errors) errors.push(tree === unlabeledRoot ? error : `${resolveSubagentLabel(tree.entry)}: ${error}`);
		}
		tree.children.forEach(collect);
	};
	trees.forEach(collect);
	return {
		errors,
		failed
	};
}
async function killSubagentRunTree(params) {
	const visits = /* @__PURE__ */ new Map();
	const visit = async (tree) => {
		let result = visits.get(tree);
		try {
			if (!result) {
				result = { descendants: false };
				visits.set(tree, result);
				if (!tree.entry.execution.endedAt || tree.entry.pauseReason === "sessions_yield") {
					const stopped = await killLatestSubagentRun({
						...params,
						tree
					});
					if (stopped.result.error) tree.errors.add(stopped.result.error);
					if (stopped.result.killed) result.label = resolveSubagentLabel(stopped.entry);
					if (stopped.result.superseded) return;
				}
				result.descendants = true;
			}
			if (result.descendants && tree.canTraverse()) await Promise.all(tree.children.map(visit));
		} catch (error) {
			tree.errors.add(formatErrorMessage(error));
			if (result) result.descendants = false;
		}
	};
	let selected;
	do {
		selected = params.scope.refresh();
		await Promise.all(params.trees.map(visit));
	} while (params.scope.refresh() !== selected);
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
		if (!stopped.result.superseded && !stopped.result.declined && params.tree.canTraverse()) cascade = await killSubagentRunTree({
			cfg: params.cfg,
			suppressTaskDelivery: params.suppressTaskDelivery,
			scope: params.scope,
			trees: params.tree.children
		});
	} catch (error) {
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
		if (accepted) scope.refresh();
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
		assertCurrent: control?.assertCurrent
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
			expectedRunId: expectedRunId || (expectedTaskRunId ? entry.runId : void 0),
			expectedGeneration: params.expectedGeneration,
			expectedOwnerKey: params.expectedOwnerKey?.trim() || void 0
		});
		const { result: stopResult, cascade } = stopped;
		rootStopSuperseded = stopResult.superseded === true;
		const targetState = resolveSubagentKillTargetState(stopped.entry) ?? stopResult.targetState;
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
		if (!result.found || !tree) return publish(result);
		const ownsOutcome = !rootStopSuperseded && tree.ownsRun() && tree.canTraverse();
		if (!ownsOutcome) tree.errors.add("Subagent ownership changed during cancellation; retry.");
		const targetState = ownsOutcome ? resolveSubagentKillTargetState(tree.entry) : void 0;
		const { errors } = collectKillErrors([tree], tree);
		return publish({
			...result,
			...targetState ? { targetState } : {},
			...errors.length > 0 ? { error: errors.join("; ") } : {}
		});
	}, control?.preparePublication);
}
//#endregion
export { killSessionSubagentRuns as n, killSubagentRunAdmin as r, killAllControlledSubagentRuns as t };
