import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { o as resolveExplicitIncognitoAgentSqliteTarget } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { I as listAgentRunsForSession, m as hasLiveAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { S as isRetryableUnadoptedChatClaim, T as normalizeMainSessionRecoveryRunFences, b as hasRestartRecoveryTerminalRun, v as hasMainSessionRecoveryClaim, x as isMainRestartRecoveryCandidate } from "./store-maintenance-BqMt1Twc.mjs";
import { a as readSessionEntrySummariesInWorker, i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { r as captureGatewaySessionWorkAdmissions } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { x as applySessionEntryExactReplacements } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { i as listActiveEmbeddedRunSessionKeys, r as listActiveEmbeddedRunSessionIds } from "./active-run-projections-Crpg2l0z.mjs";
import { i as isMainRestartRecoveryTerminalOnly, n as hasCompletedMainSessionRecoveryOutcome, s as transitionMainSessionRecovery } from "./main-session-recovery-state-sCZeKFHp.mjs";
import { i as mainSessionRecoveryLog, n as discoverRestartRecoveryStoreTargets, r as isKilledMainSessionRecoveryFenceOnly } from "./main-session-restart-recovery-shared-Bt471B3R.mjs";
import { r as resolveRestartRecoveryDispatchTarget, t as captureYieldedMainSessionContinuation } from "./main-session-restart-recovery-target-DZzCceAs.mjs";
import { n as recordStartupRecoveryStoreResult, r as restartRecoveryStoreTargetKey } from "./main-session-restart-recovery-diagnostics-CCDcnsT7.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/main-session-recovery/main-session-recovery-live-owners.ts
function normalizeStringSet(values) {
	return new Set(normalizeStringEntries(values ? [...values] : void 0));
}
function createCurrentProcessOwnerLookup(params) {
	const providedIds = params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
	const providedKeys = params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
	return (entry, sessionKey) => {
		const ids = providedIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
		const keys = providedKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
		return ids.has(entry.sessionId) || ids.size === 0 && keys.has(sessionKey);
	};
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-marking.ts
async function markRecoveryStore(params) {
	const yieldOwners = [];
	return await applySessionEntryExactReplacements({
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKeys: params.sessionKeys,
		requireWriteSuccess: true,
		assertCommitAllowed: () => {
			params.assertCommitAllowed?.();
			if (yieldOwners.some((isCurrent) => !isCurrent())) throw new Error("Yielded requester continuation changed before recovery handoff");
		},
		update: (entries) => {
			const replacements = [];
			const counts = {
				marked: 0,
				skipped: 0
			};
			for (const { sessionKey, entry } of entries) {
				const plan = params.plan(entry, sessionKey);
				if (!plan) continue;
				if (!isMainRestartRecoveryCandidate(entry, sessionKey)) {
					counts.skipped++;
					continue;
				}
				if (plan.action !== "mark") {
					if (plan.action === "restore_yielded") yieldOwners.push(plan.isCurrent);
					transitionMainSessionRecovery(entry, plan.action === "restore_yielded" || plan.action === "release_killed" ? { kind: "clear" } : {
						kind: "observe",
						cycleId: randomUUID(),
						lifecycleGeneration: getAgentEventLifecycleGeneration(),
						sessionKey
					});
					replacements.push({
						sessionKey,
						entry
					});
					counts.skipped++;
					continue;
				}
				if (plan.replaceRuns) entry.restartRecoveryRuns = plan.runs;
				if (plan.forceRestartSafeTools) entry.restartRecoveryForceSafeTools = true;
				transitionMainSessionRecovery(entry, {
					kind: "mark_interrupted",
					cycleId: randomUUID(),
					now: Date.now(),
					...plan
				});
				replacements.push({
					sessionKey,
					entry
				});
				counts.marked++;
			}
			return {
				result: counts,
				replacements
			};
		}
	});
}
async function markRestartAbortedMainSessions(params) {
	const activeRuns = [...params.activeRuns];
	const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
	const result = {
		marked: 0,
		skipped: 0
	};
	const skipReasons = /* @__PURE__ */ new Map();
	const skippedSessions = /* @__PURE__ */ new Set();
	const markedSessions = /* @__PURE__ */ new Set();
	const recordSkip = (reason, sessionKey) => {
		skipReasons.set(reason, (skipReasons.get(reason) ?? 0) + 1);
		if (skippedSessions.has(sessionKey)) return;
		skippedSessions.add(sessionKey);
		if (skippedSessions.size <= 100) mainSessionRecoveryLog.warn(`skipped restart recovery session: ${JSON.stringify({
			sessionKey: sessionKey.slice(0, 256),
			reason
		})}`);
	};
	const activeAdmissions = captureGatewaySessionWorkAdmissions(params.resolveGatewayContext);
	if (activeRuns.length === 0 && activeAdmissions.targets.size === 0) return result;
	const storeTargets = /* @__PURE__ */ new Map();
	const addStoreTarget = (target) => {
		if (resolveExplicitIncognitoAgentSqliteTarget(target.storePath, target)) return;
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId });
		const key = JSON.stringify([target.storePath, resolved.path]);
		if (!storeTargets.has(key)) storeTargets.set(key, target);
	};
	const stateDir = params.stateDir ?? resolveStateDir(process.env);
	try {
		for (const target of await discoverRestartRecoveryStoreTargets({
			cfg: params.cfg,
			stateDir
		})) addStoreTarget(target);
	} catch (err) {
		if (!params.cfg) throw err;
		mainSessionRecoveryLog.warn(`failed to resolve configured session stores for restart marker: ${String(err)}`);
	}
	for (const storePath of activeAdmissions.targets.keys()) addStoreTarget({ storePath });
	for (const target of storeTargets.values()) {
		const { storePath } = target;
		const sessionKeys = (await readSessionEntrySummariesInWorker(target)).filter(({ sessionKey, entry }) => activeRuns.some((run) => run.sessionKey === sessionKey && run.sessionId === entry.sessionId) || activeAdmissions.isActive({
			scope: storePath,
			sessionKey,
			sessionId: entry.sessionId
		})).map(({ sessionKey }) => sessionKey);
		for (const selectedSessionKey of sessionKeys) {
			let isCurrent;
			try {
				const requester = await resolveRestartRecoveryDispatchTarget({
					storeAgentId: target.agentId,
					cfg: params.cfg,
					sessionKey: selectedSessionKey,
					storePath
				});
				const storeResult = await markRecoveryStore({
					...target,
					sessionKeys: [selectedSessionKey],
					assertCommitAllowed: () => {
						if (isCurrent && !isCurrent()) throw new Error("Restart recovery owner changed before commit");
					},
					plan: (entry, sessionKey) => {
						const matchingActiveRuns = activeRuns.filter((run) => run.sessionKey === sessionKey && run.sessionId === entry.sessionId && (entry.lifecycleRunId === run.runId || entry.restartRecoveryDeliveryRunId === run.runId || entry.status === "interrupted" && entry.abortedLastRun === true && entry.lastRunId === run.runId && entry.restartRecoveryRuns?.some((fence) => fence.runId === (run.sourceRunId ?? run.runId) && fence.lifecycleGeneration === run.lifecycleGeneration) || run.observedAt === void 0 || asFiniteNumber(entry.updatedAt) === void 0 || entry.updatedAt < run.observedAt && run.lifecycleGeneration !== currentLifecycleGeneration) && params.isActiveRun?.(run) !== false);
						const matchedActiveAdmission = activeAdmissions.isActive({
							scope: storePath,
							sessionKey,
							sessionId: entry.sessionId
						});
						if (matchingActiveRuns.length === 0 && !matchedActiveAdmission) {
							recordSkip("owner_changed", sessionKey);
							return;
						}
						if (captureYieldedMainSessionContinuation({
							entry,
							requester
						})) {
							recordSkip("yielded_continuation", sessionKey);
							return;
						}
						if (!isMainRestartRecoveryCandidate(entry, sessionKey)) recordSkip("not_main_session", sessionKey);
						const runs = normalizeMainSessionRecoveryRunFences([
							...(entry.restartRecoveryRuns ?? []).filter((run) => run.lifecycleGeneration === currentLifecycleGeneration),
							...listAgentRunsForSession({
								sessionKey,
								sessionId: entry.sessionId
							}),
							...matchingActiveRuns.map(({ runId, lifecycleGeneration }) => ({
								runId,
								lifecycleGeneration
							}))
						]);
						isCurrent = () => isAgentEventLifecycleGenerationCurrent(currentLifecycleGeneration) && (matchedActiveAdmission && activeAdmissions.isActive({
							scope: storePath,
							sessionKey,
							sessionId: entry.sessionId
						}) || matchingActiveRuns.some((run) => params.isActiveRun?.(run) !== false));
						return {
							action: "mark",
							forceRestartSafeTools: matchedActiveAdmission,
							replaceRuns: true,
							runs
						};
					}
				});
				result.marked += storeResult.marked;
				result.skipped += storeResult.skipped;
				if (storeResult.marked > 0) markedSessions.add(selectedSessionKey);
			} catch (error) {
				assertAgentRunLifecycleGenerationCurrent(currentLifecycleGeneration);
				if (!isCurrent || isCurrent()) throw error;
				result.skipped++;
				recordSkip("owner_changed", selectedSessionKey);
			}
		}
	}
	for (const run of activeRuns) if (!markedSessions.has(run.sessionKey) && !skippedSessions.has(run.sessionKey)) recordSkip("no_matching_session", run.sessionKey);
	if (skippedSessions.size > 100) mainSessionRecoveryLog.warn(`restart recovery skip diagnostics omitted ${skippedSessions.size - 100} additional session(s)`);
	if (result.marked > 0) mainSessionRecoveryLog.warn(`marked ${result.marked} interrupted main session(s) for restart recovery${params.reason ? ` (${params.reason})` : ""}`);
	else if (activeRuns.length > 0) {
		const dominantSkipReason = [...skipReasons].toSorted((a, b) => b[1] - a[1])[0]?.[0];
		mainSessionRecoveryLog.warn(`marked 0 interrupted main session(s) for restart recovery: activeRuns=${activeRuns.length} skipped=${result.skipped} skipReason=${dominantSkipReason ?? "no_matching_session"}${params.reason ? ` (${params.reason})` : ""}`);
	}
	return result;
}
function hasOrphanedMainSessionWork(entry, sessionKey) {
	return isMainRestartRecoveryCandidate(entry, sessionKey) && (hasMainSessionRecoveryClaim(entry) || entry.abortedLastRun === true || entry.status === "interrupted");
}
async function markOrphanedMainSessionStore(params) {
	const hasCurrentProcessOwner = createCurrentProcessOwnerLookup(params);
	const updatedBeforeMs = asFiniteNumber(params.updatedBeforeMs);
	const key = params.target.sessionKey;
	let sessionKeys;
	if (key) {
		const entry = await readSessionEntryReadOnlyInWorker({
			...params.target,
			sessionKey: key
		});
		sessionKeys = entry && hasOrphanedMainSessionWork(entry, key) ? [key] : [];
	} else sessionKeys = (await readSessionEntrySummariesInWorker(params.target)).filter(({ entry, sessionKey }) => hasOrphanedMainSessionWork(entry, sessionKey)).map(({ sessionKey }) => sessionKey);
	if (sessionKeys.length === 0) return {
		marked: 0,
		skipped: 0
	};
	const requesters = /* @__PURE__ */ new Map();
	for (const sessionKey of sessionKeys) requesters.set(sessionKey, await resolveRestartRecoveryDispatchTarget({
		storeAgentId: params.target.agentId,
		cfg: params.cfg,
		sessionKey,
		storePath: params.target.storePath
	}));
	const orphanChecks = [];
	return await markRecoveryStore({
		...params.target,
		sessionKeys,
		assertCommitAllowed: () => {
			assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
			params.assertCommitAllowed?.();
			if (orphanChecks.some((hasLiveOwner) => hasLiveOwner())) throw new Error("Startup orphan acquired a live owner before recovery commit");
		},
		plan: (entry, sessionKey) => {
			params.assertCommitAllowed?.();
			if (!hasOrphanedMainSessionWork(entry, sessionKey) || entry.archivedAt !== void 0 || isRetryableUnadoptedChatClaim(entry) || entry.mainRestartRecovery?.tombstone || params.expectedSessionId !== void 0 && entry.sessionId !== params.expectedSessionId || params.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== params.expectedLifecycleRevision) return;
			const updatedAt = asFiniteNumber(entry.updatedAt);
			if (updatedBeforeMs !== void 0 && updatedAt !== void 0 && updatedAt > updatedBeforeMs) return;
			const writerRunIds = [
				entry.activeWriterRunId,
				entry.lifecycleRunId,
				...(entry.restartRecoveryRuns ?? []).map((run) => run.runId)
			];
			const hasLiveOwner = () => writerRunIds.some((runId) => runId && hasLiveAgentRunContext(runId)) || listAgentRunsForSession({
				sessionKey,
				sessionId: entry.sessionId
			}).some(({ runId }) => hasLiveAgentRunContext(runId)) || hasCurrentProcessOwner(entry, sessionKey);
			if (hasLiveOwner()) return;
			const continuation = captureYieldedMainSessionContinuation({
				entry,
				requester: requesters.get(sessionKey)
			});
			if (continuation) {
				const state = entry.mainRestartRecovery;
				if (entry.abortedLastRun === true && !state?.reservation && !state?.foregroundClaims && !state?.tombstone && !entry.restartRecoveryDeliveryRunId) return {
					action: "restore_yielded",
					isCurrent: () => continuation() && !hasLiveOwner()
				};
				return;
			}
			if (isKilledMainSessionRecoveryFenceOnly(entry)) {
				orphanChecks.push(hasLiveOwner);
				return { action: "release_killed" };
			}
			const hasClaim = hasMainSessionRecoveryClaim(entry);
			const completed = hasCompletedMainSessionRecoveryOutcome(entry);
			if (!hasClaim && (completed || [
				entry.lifecycleRunId,
				entry.activeWriterRunId,
				entry.restartRecoveryDeliverySourceRunId
			].some((runId) => runId !== void 0 && hasRestartRecoveryTerminalRun(entry, runId)))) return;
			if (hasClaim && !completed && (entry.abortedLastRun === true || !entry.pendingFinalDelivery && entry.status !== void 0 && entry.status !== "failed" && entry.status !== "interrupted")) return;
			orphanChecks.push(hasLiveOwner);
			return completed || isMainRestartRecoveryTerminalOnly(entry) ? { action: "retire_terminal" } : { action: "mark" };
		}
	});
}
/** Reconcile one exact session through the same owner used by startup. */
async function markOrphanedMainSessionForRecovery(params) {
	return await markOrphanedMainSessionStore({
		...params,
		lifecycleGeneration: getAgentEventLifecycleGeneration()
	});
}
async function markStartupOrphanedMainSessionsForRecovery(params) {
	const result = {
		marked: 0,
		skipped: 0
	};
	const failedTargets = [];
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const storeTargets = await discoverRestartRecoveryStoreTargets(params);
	for (const target of storeTargets) {
		const key = restartRecoveryStoreTargetKey(target);
		if (params.startupCheckedStorePaths?.has(key)) continue;
		try {
			const storeResult = await markOrphanedMainSessionStore({
				...params,
				target,
				lifecycleGeneration
			});
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			result.marked += storeResult.marked;
			result.skipped += storeResult.skipped;
			params.startupCheckedStorePaths?.add(key);
			recordStartupRecoveryStoreResult({
				target,
				lifecycleGeneration,
				outcome: { ok: true }
			});
		} catch (error) {
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			failedTargets.push(target);
			recordStartupRecoveryStoreResult({
				target,
				lifecycleGeneration,
				outcome: {
					ok: false,
					error
				}
			});
			mainSessionRecoveryLog.warn(`failed to mark startup-orphaned main sessions for ${target.agentId}: ${String(error)}`);
		}
	}
	if (result.marked > 0) mainSessionRecoveryLog.warn(`marked ${result.marked} startup-orphaned main session(s) for restart recovery`);
	return {
		...result,
		...failedTargets.length > 0 ? { failedTargets } : {}
	};
}
//#endregion
export { createCurrentProcessOwnerLookup as i, markRestartAbortedMainSessions as n, markStartupOrphanedMainSessionsForRecovery as r, markOrphanedMainSessionForRecovery as t };
