import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { m as listAgentRunsForSession, p as hasLiveAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { r as captureGatewaySessionWorkAdmissions } from "./session-lifecycle-admission-Pys9TN37.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { y as applySessionEntryReplacements } from "./session-accessor.reset-0gTJAhVB.mjs";
import { n as listActiveEmbeddedRunSessionIds, r as listActiveEmbeddedRunSessionKeys } from "./active-run-projections-BHX_SDCX.mjs";
import { a as normalizeFiniteTimestamp, i as mainSessionRecoveryLog, n as discoverRestartRecoveryStoreTargets, o as normalizeStringSet, r as hasCurrentProcessOwner } from "./main-session-restart-recovery-shared-DApJGSxq.mjs";
import { c as transitionMainSessionRecovery, i as isMainRestartRecoveryCandidate, o as isMainSessionRecoveryReconciliationCandidate, r as isMainRestartRecoveryAggregateTerminalOnly, s as normalizeMainSessionRecoveryRunFences } from "./main-session-recovery-state-BUCSyc7s.mjs";
import { n as recordStartupRecoveryStoreResult, r as restartRecoveryStoreTargetKey } from "./main-session-restart-recovery-diagnostics-B9UBxyC6.mjs";
import { t as captureYieldedMainSessionContinuation } from "./main-session-restart-recovery-target-CtKxVwI0.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/main-session-recovery/main-session-restart-recovery-marking.ts
async function markRecoveryStore(params) {
	const yieldOwners = [];
	return await applySessionEntryReplacements({
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKeys: params.sessionKey ? [params.sessionKey] : void 0,
		statuses: params.statuses,
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
				if (plan.action === "restore_yielded") {
					yieldOwners.push(plan.isCurrent);
					transitionMainSessionRecovery(entry, { kind: "clear" });
					replacements.push({
						sessionKey,
						entry
					});
					counts.skipped++;
					continue;
				}
				if (plan.action === "retire_terminal") {
					transitionMainSessionRecovery(entry, {
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
	const activeAdmissions = captureGatewaySessionWorkAdmissions(params.resolveGatewayContext);
	if (activeRuns.length === 0 && activeAdmissions.targets.size === 0) return result;
	const storeTargets = /* @__PURE__ */ new Map();
	const addStoreTarget = (target) => {
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId });
		const key = JSON.stringify([target.storePath, resolved.path]);
		if (!storeTargets.has(key)) storeTargets.set(key, target);
	};
	const stateDir = params.stateDir ?? resolveStateDir(process.env);
	const configs = [params.cfg, ...params.additionalCfgs ?? []].filter(Boolean);
	for (const cfg of configs.length > 0 ? configs : [void 0]) try {
		for (const target of await discoverRestartRecoveryStoreTargets({
			cfg,
			stateDir
		})) addStoreTarget(target);
	} catch (err) {
		if (!cfg) throw err;
		mainSessionRecoveryLog.warn(`failed to resolve configured session stores for restart marker: ${String(err)}`);
	}
	for (const storePath of activeAdmissions.targets.keys()) addStoreTarget({ storePath });
	for (const target of storeTargets.values()) {
		const { storePath } = target;
		const sessionKeys = listSessionEntriesReadOnly({
			...target,
			projection: "list",
			clone: false
		}).filter(({ sessionKey, entry }) => activeRuns.some((run) => run.sessionKey === sessionKey && run.sessionId === entry.sessionId) || activeAdmissions.isActive({
			scope: storePath,
			sessionKey,
			sessionId: entry.sessionId
		})).map(({ sessionKey }) => sessionKey);
		for (const selectedSessionKey of sessionKeys) {
			let isCurrent;
			try {
				const storeResult = await markRecoveryStore({
					...target,
					sessionKey: selectedSessionKey,
					assertCommitAllowed: () => {
						if (isCurrent && !isCurrent()) throw new Error("Restart recovery owner changed before commit");
					},
					plan: (entry, sessionKey) => {
						const matchingActiveRuns = activeRuns.filter((run) => run.sessionKey === sessionKey && run.sessionId === entry.sessionId && (entry.status === "running" || run.observedAt === void 0 || normalizeFiniteTimestamp(entry.updatedAt) === void 0 || entry.updatedAt < run.observedAt && run.lifecycleGeneration !== currentLifecycleGeneration) && params.isActiveRun?.(run) !== false);
						const matchedActiveAdmission = activeAdmissions.isActive({
							scope: storePath,
							sessionKey,
							sessionId: entry.sessionId
						});
						if (matchingActiveRuns.length === 0 && !matchedActiveAdmission) return;
						if (captureYieldedMainSessionContinuation({
							storeAgentId: target.agentId,
							cfg: params.cfg,
							entry,
							sessionKey,
							storePath
						})) return;
						const wasRunning = entry.status === "running";
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
							resetRuntime: !wasRunning,
							runs
						};
					}
				});
				result.marked += storeResult.marked;
				result.skipped += storeResult.skipped;
			} catch (error) {
				assertAgentRunLifecycleGenerationCurrent(currentLifecycleGeneration);
				if (!isCurrent || isCurrent()) throw error;
				result.skipped++;
			}
		}
	}
	if (result.marked > 0) mainSessionRecoveryLog.warn(`marked ${result.marked} interrupted main session(s) for restart recovery${params.reason ? ` (${params.reason})` : ""}`);
	return result;
}
async function markOrphanedMainSessionStore(params) {
	const providedActiveSessionIds = params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
	const providedActiveSessionKeys = params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
	const updatedBeforeMs = normalizeFiniteTimestamp(params.updatedBeforeMs);
	const resolveActiveSessionIds = () => providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
	const resolveActiveSessionKeys = () => providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
	const orphanChecks = [];
	return await markRecoveryStore({
		...params.target,
		statuses: params.target.sessionKey ? void 0 : ["running"],
		assertCommitAllowed: () => {
			assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
			params.assertCommitAllowed?.();
			if (orphanChecks.some((hasLiveOwner) => hasLiveOwner())) throw new Error("Startup orphan acquired a live owner before recovery commit");
		},
		plan: (entry, sessionKey) => {
			params.assertCommitAllowed?.();
			if (entry.status !== "running" && !isMainSessionRecoveryReconciliationCandidate(entry) || params.expectedSessionId !== void 0 && entry.sessionId !== params.expectedSessionId || params.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== params.expectedLifecycleRevision) return;
			const updatedAt = normalizeFiniteTimestamp(entry.updatedAt);
			if (updatedBeforeMs !== void 0 && updatedAt !== void 0 && updatedAt > updatedBeforeMs) return;
			const writerRunIds = [
				entry.activeWriterRunId,
				entry.lifecycleRunId,
				...(entry.restartRecoveryRuns ?? []).map((run) => run.runId)
			];
			const hasLiveOwner = () => writerRunIds.some((runId) => runId && hasLiveAgentRunContext(runId)) || listAgentRunsForSession({
				sessionKey,
				sessionId: entry.sessionId
			}).some(({ runId }) => hasLiveAgentRunContext(runId)) || hasCurrentProcessOwner({
				activeSessionIds: resolveActiveSessionIds(),
				activeSessionKeys: resolveActiveSessionKeys(),
				entry,
				sessionKey
			});
			if (hasLiveOwner()) return;
			const continuation = captureYieldedMainSessionContinuation({
				storeAgentId: params.target.agentId,
				cfg: params.cfg,
				entry,
				sessionKey,
				storePath: params.target.storePath
			});
			if (continuation) {
				const state = entry.mainRestartRecovery;
				if (entry.abortedLastRun === true && !state?.reservation && !state?.foregroundClaims && !state?.tombstone && !entry.restartRecoveryDeliveryRunId) return {
					action: "restore_yielded",
					isCurrent: () => continuation() && !hasLiveOwner()
				};
				return;
			}
			if (entry.abortedLastRun === true) return;
			orphanChecks.push(hasLiveOwner);
			return isMainRestartRecoveryAggregateTerminalOnly(entry) ? { action: "retire_terminal" } : {
				action: "mark",
				resetRuntime: entry.status !== "running"
			};
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
	const storeTargets = await discoverRestartRecoveryStoreTargets({
		...params,
		statuses: ["running"]
	});
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
export { markRestartAbortedMainSessions as n, markStartupOrphanedMainSessionsForRecovery as r, markOrphanedMainSessionForRecovery as t };
