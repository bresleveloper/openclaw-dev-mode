import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { m as listAgentRunsForSession, p as hasLiveAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { r as captureGatewaySessionWorkAdmissions } from "./session-lifecycle-admission-GoxISURZ.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { C as applySessionEntryExactReplacements } from "./session-accessor.reset-DWr6djSD.mjs";
import { n as listActiveEmbeddedRunSessionIds, r as listActiveEmbeddedRunSessionKeys } from "./active-run-projections-B86tDIo_.mjs";
import { c as transitionMainSessionRecovery, i as isMainRestartRecoveryCandidate, o as isMainSessionRecoveryReconciliationCandidate, r as isMainRestartRecoveryAggregateTerminalOnly, s as normalizeMainSessionRecoveryRunFences } from "./main-session-recovery-state-YrhflDrO.mjs";
import { n as discoverRestartRecoveryStoreTargets, r as mainSessionRecoveryLog } from "./main-session-restart-recovery-shared-C1qwMzcR.mjs";
import { n as recordStartupRecoveryStoreResult, r as restartRecoveryStoreTargetKey } from "./main-session-restart-recovery-diagnostics-B63x0hcM.mjs";
import { t as captureYieldedMainSessionContinuation } from "./main-session-restart-recovery-target-GQI_i4ky.mjs";
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
						const matchingActiveRuns = activeRuns.filter((run) => run.sessionKey === sessionKey && run.sessionId === entry.sessionId && (entry.status === "running" || run.observedAt === void 0 || asFiniteNumber(entry.updatedAt) === void 0 || entry.updatedAt < run.observedAt && run.lifecycleGeneration !== currentLifecycleGeneration) && params.isActiveRun?.(run) !== false);
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
							resetRuntime: entry.status !== "running",
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
	const hasCurrentProcessOwner = createCurrentProcessOwnerLookup(params);
	const updatedBeforeMs = asFiniteNumber(params.updatedBeforeMs);
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
export { createCurrentProcessOwnerLookup as i, markRestartAbortedMainSessions as n, markStartupOrphanedMainSessionsForRecovery as r, markOrphanedMainSessionForRecovery as t };
