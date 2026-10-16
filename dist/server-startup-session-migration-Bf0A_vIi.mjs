import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { l as hasActiveGatewayStateOwner } from "./gateway-state-owner-DmHycK5o.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-0RgOZO_d.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-B6mKYs2x.mjs";
import { f as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as readSessionEntriesByStatus, t as hasSessionEntriesByStatus } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { h as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { f as replaceSessionEntrySync } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { t as recordGatewaySessionRunFailure } from "./session-run-error-D6x6GLBv.mjs";
import { t as hasSubagentSessionRecoveryOwner } from "./subagent-session-reconciliation-CJPnO-ah.mjs";
import { n as runSessionStartupMigration } from "./startup-migration-_y0dnRcZ.mjs";
//#region src/gateway/server-startup-session-migration.ts
function isUnsettledPredecessor(entry) {
	return entry.status === "running" && !entry.incognito && !entry.abortedLastRun && typeof entry.startedAt === "number" && Number.isFinite(entry.startedAt) && entry.startedAt < performance.timeOrigin && Number.isFinite(entry.updatedAt) && entry.updatedAt < performance.timeOrigin && !entry.restartRecoveryRuns?.length && !entry.restartRecoveryForceSafeTools && !entry.subagentRecovery && !entry.mainRestartRecovery && !entry.pendingFinalDelivery && !entry.pendingDeliveryNotice && !entry.initializationPending && !entry.restartRecoveryBeforeAgentReplyState && !entry.restartRecoveryDeliveryReceiptState && !entry.restartRecoveryDeliveryRunId && !entry.restartRecoveryDeliverySourceRunId;
}
async function reconcileStartupOrphans(database, log, assertCurrent) {
	const env = database.env ?? process.env;
	const statePath = resolveOpenClawStateSqlitePath(env);
	if (!hasActiveGatewayStateOwner(statePath)) return;
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
		if (!hasActiveGatewayStateOwner(statePath) || lease?.state !== "live" || lease.pid !== process.pid || lease.owner !== lock.ownerId) throw new Error("startup Gateway ownership changed or could not be verified");
	};
	return withOpenClawAgentDatabaseAsync(database, async (connection) => {
		const selected = readSessionEntriesByStatus(connection, ["running"]);
		let interrupted = 0;
		let retained = 0;
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
			const hasOwner = () => hasSubagentSessionRecoveryOwner(identity) || isSessionWorkAdmissionActive(connection.path, [sessionKey, entry.sessionId]);
			const assertOwnerless = () => {
				assertGatewayOwner();
				if (hasOwner()) throw new Error("a current or retained run/task owns this session");
			};
			try {
				assertGatewayOwner();
				if (hasOwner()) {
					retained++;
					continue;
				}
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
					settleStartupSession: () => {
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
				interrupted++;
			} catch (error) {
				log.warn(`session: retained startup subagent ${sessionKey}: ${String(error)}`);
			}
		}
		return {
			interrupted,
			retained
		};
	}, assertGatewayOwner);
}
/** Await SQLite maintenance and projection repair before serving session history. */
async function runStartupSessionMigration(params) {
	let reconcile = params.deps?.reconcileSessionTranscriptIndexes;
	let reconciledSessions = 0;
	let interruptedSubagents = 0;
	let retainedSubagents = 0;
	await runSessionStartupMigration({
		...params,
		handoffDatabase: async (database) => {
			try {
				const result = await reconcileStartupOrphans(database, params.log, params.assertCurrent);
				interruptedSubagents += result?.interrupted ?? 0;
				retainedSubagents += result?.retained ?? 0;
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
	if (interruptedSubagents > 0 || retainedSubagents > 0) params.log.info(`session: startup subagents: ${interruptedSubagents} interrupted, ${retainedSubagents} retained by run/task owners`);
	if (reconciledSessions > 0) params.log.info(`session: rebuilt ${reconciledSessions} transcript projection(s) before serving history`);
}
//#endregion
export { runStartupSessionMigration };
