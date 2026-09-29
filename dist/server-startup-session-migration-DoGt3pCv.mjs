import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { S as isSubagentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { m as hasGatewayLifecycleCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { o as readGatewayOwnerLease } from "./windows-port-pids-Bid_Huck.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-CYjRlApN.mjs";
import { l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { c as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { i as readSessionEntriesByStatus, t as hasSessionEntriesByStatus } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { h as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { g as replaceSessionEntrySync } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { t as recordGatewaySessionRunFailure } from "./session-run-error-HnadOxy-.mjs";
import { t as hasSubagentSessionRecoveryOwner } from "./subagent-session-reconciliation-CvTPAhOj.mjs";
import { n as runSessionStartupMigration } from "./startup-migration-CVykc3-X.mjs";
//#region src/gateway/server-startup-session-migration.ts
function isUnsettledPredecessor(entry) {
	return entry.status === "running" && !entry.incognito && !entry.abortedLastRun && typeof entry.startedAt === "number" && Number.isFinite(entry.startedAt) && entry.startedAt < performance.timeOrigin && Number.isFinite(entry.updatedAt) && entry.updatedAt < performance.timeOrigin && !entry.restartRecoveryRuns?.length && !entry.restartRecoveryForceSafeTools && !entry.subagentRecovery && !entry.mainRestartRecovery && !entry.pendingFinalDelivery && !entry.pendingDeliveryNotice && !entry.initializationPending && !entry.restartRecoveryBeforeAgentReplyState && !entry.restartRecoveryDeliveryReceiptState && !entry.restartRecoveryDeliveryRunId && !entry.restartRecoveryDeliverySourceRunId;
}
async function reconcileStartupOrphans(database, log, assertCurrent) {
	const env = database.env ?? process.env;
	const statePath = resolveOpenClawStateSqlitePath(env);
	if (!hasGatewayLifecycleCoordinator({ databasePath: statePath })) return;
	try {
		const running = withOpenClawAgentDatabaseReadOnly((connection) => hasSessionEntriesByStatus(connection, ["running"]), database);
		if (running.found && !running.value) return;
	} catch {}
	const lock = await readActiveGatewayLockIdentity({
		env,
		requireInspection: true
	});
	if (lock?.pid !== process.pid || !lock.ownerId) return;
	const assertGatewayOwner = () => {
		assertCurrent?.();
		const lease = readGatewayOwnerLease({
			env,
			current: true
		});
		if (!hasGatewayLifecycleCoordinator({ databasePath: statePath }) || lease?.state !== "live" || lease.pid !== process.pid || lease.owner !== lock.ownerId) throw new Error("startup Gateway ownership changed or could not be verified");
	};
	assertGatewayOwner();
	const connection = openOpenClawAgentDatabase(database);
	const selected = readSessionEntriesByStatus(connection, ["running"]);
	let count = 0;
	for (const { entry, sessionKey } of selected) {
		if (!isSubagentSessionKey(sessionKey) || isIncognitoSessionKey(sessionKey) || !isUnsettledPredecessor(entry)) continue;
		const identity = {
			sessionKey,
			sessionId: entry.sessionId,
			env
		};
		const target = {
			agentId: resolveAgentIdFromSessionKey(sessionKey),
			env,
			sessionKey,
			storePath: connection.path
		};
		const matchesPredecessor = (current) => current !== void 0 && current.sessionId === entry.sessionId && current.lifecycleRevision === entry.lifecycleRevision && current.lifecycleRunId === entry.lifecycleRunId && current.updatedAt === entry.updatedAt && current.startedAt === entry.startedAt && isUnsettledPredecessor(current);
		const assertOwnerless = () => {
			assertGatewayOwner();
			if (hasSubagentSessionRecoveryOwner(identity) || isSessionWorkAdmissionActive(connection.path, [sessionKey, entry.sessionId])) throw new Error("a current or retained run/task owns this session");
		};
		try {
			assertOwnerless();
			const outcome = buildAgentRunTerminalOutcome({
				status: "error",
				error: "subagent run was interrupted before a terminal lifecycle event was persisted",
				startedAt: entry.startedAt,
				endedAt: Date.now()
			});
			await recordGatewaySessionRunFailure({
				target: {
					...target,
					sessionId: entry.sessionId,
					expectedLifecycleRevision: entry.lifecycleRevision
				},
				runId: `startup-orphan:${entry.sessionId}:${entry.lifecycleRunId ?? entry.startedAt}`,
				error: outcome.error,
				assertCommitAllowed: assertOwnerless,
				settleSession: () => {
					const current = readSessionEntryRow(connection, sessionKey)?.entry;
					if (!current || !matchesPredecessor(current)) throw new Error("startup subagent session changed before interruption receipt");
					replaceSessionEntrySync(target, {
						...current,
						status: "interrupted",
						abortedLastRun: true,
						endedAt: outcome.endedAt,
						lastRunError: outcome.error
					});
				}
			});
			count++;
		} catch (error) {
			log.warn(`session: retained startup subagent ${sessionKey}: ${String(error)}`);
		}
	}
	if (count > 0) log.info(`session: marked ${count} prior-process subagent run(s) interrupted`);
}
/** Await SQLite maintenance and projection repair before serving session history. */
async function runStartupSessionMigration(params) {
	let reconcile = params.deps?.reconcileSessionTranscriptIndexes;
	let reconciledSessions = 0;
	await runSessionStartupMigration({
		...params,
		handoffDatabase: async (database) => {
			try {
				await reconcileStartupOrphans(database, params.log, params.assertCurrent);
			} catch (error) {
				params.assertCurrent?.();
				params.log.warn(`session: retained startup orphans because ownership could not be verified: ${String(error)}`);
			}
			reconcile ??= (await import("./config/sessions/session-transcript-reconcile.js")).reconcileSessionTranscriptIndexes;
			params.assertCurrent?.();
			const result = await reconcile(database);
			params.assertCurrent?.();
			reconciledSessions += result.reconciledSessions;
		}
	});
	if (reconciledSessions > 0) params.log.info(`session: rebuilt ${reconciledSessions} transcript projection(s) before serving history`);
}
//#endregion
export { runStartupSessionMigration };
