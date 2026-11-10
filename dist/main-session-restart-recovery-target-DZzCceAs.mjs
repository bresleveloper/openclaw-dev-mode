import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { l as resolveAgentIdFromSessionKey, o as classifySessionKeyShape } from "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { l as listSubagentRunsForRequester } from "./subagent-registry-read-DY0g8fGW.mjs";
import { i as mainSessionRecoveryLog } from "./main-session-restart-recovery-shared-Bt471B3R.mjs";
import path from "node:path";
//#region src/agents/main-session-recovery/main-session-restart-recovery-target.ts
function resolveRestartRecoveryStoreAgentId(params) {
	return params.agentId ?? (params.storeAgentId && !resolveSqliteTargetFromSessionStorePath(params.storePath, { agentId: params.storeAgentId }).shared ? params.storeAgentId : void 0) ?? (isPerAgentSessionStoreConfig(params.cfg?.session?.store) && classifySessionKeyShape(params.sessionKey) === "legacy_or_alias" ? resolveUnsuffixedSqliteTargetFromSessionStorePath(params.storePath).agentId : void 0);
}
/** An unconfigured writer already owns its physical store and only needs the logical route. */
function resolveRestartRecoveryDispatchIdentity(params) {
	return {
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey, resolveRestartRecoveryStoreAgentId(params) ?? "main"),
		sessionKey: params.sessionKey
	};
}
async function resolveRestartRecoveryDispatchTarget(params) {
	if (!params.cfg) return resolveRestartRecoveryDispatchIdentity(params);
	const storeAgentId = resolveRestartRecoveryStoreAgentId(params);
	try {
		const target = resolveSessionStoreIdentity({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			...storeAgentId ? { agentId: storeAgentId } : {}
		});
		return !params.cfg.session?.store || path.resolve(resolveSessionStorePathCore(params.cfg.session.store, { agentId: target.agentId })) === path.resolve(params.storePath) ? {
			agentId: target.agentId,
			sessionKey: target.canonicalKey
		} : void 0;
	} catch (err) {
		mainSessionRecoveryLog.warn(`failed to resolve recovery store for ${params.sessionKey}: ${String(err)}`);
		return;
	}
}
/** Captures the durable continuation that a completed requester turn yielded to. */
function captureYieldedMainSessionContinuation(params) {
	if (params.entry.status !== void 0 || params.entry.pendingFinalDelivery !== void 0 || asFiniteNumber(params.entry.endedAt) === void 0) return;
	const requester = params.requester;
	if (!requester) return;
	const listRuns = () => listSubagentRunsForRequester(requester.sessionKey, { requesterAgentId: requester.agentId });
	const owner = listRuns().find((run) => !run.collect && run.expectsCompletionMessage === true && !run.requesterTurnRunId && run.requesterSettleWake?.requesterYieldBatch === true && run.requesterSettleWake.rearmGeneration !== void 0 && run.requesterSettleWake.batchRunIds?.includes(run.runId));
	if (!owner) return;
	const wake = owner.requesterSettleWake;
	const rearmGeneration = wake?.rearmGeneration;
	return () => listRuns().includes(owner) && !owner.requesterTurnRunId && owner.requesterSettleWake === wake && wake?.rearmGeneration === rearmGeneration;
}
//#endregion
export { resolveRestartRecoveryDispatchIdentity as n, resolveRestartRecoveryDispatchTarget as r, captureYieldedMainSessionContinuation as t };
