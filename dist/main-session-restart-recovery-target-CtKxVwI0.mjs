import { l as resolveAgentIdFromSessionKey, o as classifySessionKeyShape } from "./session-key-CBvmC8zz.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-caBszKSJ.mjs";
import { c as resolveUnsuffixedSqliteTargetFromSessionStorePath, s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { p as listSubagentRunsForRequester } from "./subagent-registry-read-C2SIiLpb.mjs";
import { a as normalizeFiniteTimestamp, i as mainSessionRecoveryLog } from "./main-session-restart-recovery-shared-DApJGSxq.mjs";
import { a as resolveGatewaySessionStoreTarget } from "./session-utils-store-lookup-EioWBMfl.mjs";
import path from "node:path";
//#region src/agents/main-session-recovery/main-session-restart-recovery-target.ts
function resolveRestartRecoveryDispatchTarget(params) {
	const storeAgentId = params.agentId ?? (params.storeAgentId && !resolveSqliteTargetFromSessionStorePath(params.storePath, { agentId: params.storeAgentId }).shared ? params.storeAgentId : void 0) ?? (isPerAgentSessionStoreConfig(params.cfg?.session?.store) && classifySessionKeyShape(params.sessionKey) === "legacy_or_alias" ? resolveUnsuffixedSqliteTargetFromSessionStorePath(params.storePath).agentId : void 0);
	if (!params.cfg) return {
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey, storeAgentId ?? "main"),
		sessionKey: params.sessionKey
	};
	try {
		const target = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key: params.sessionKey,
			...storeAgentId ? { agentId: storeAgentId } : {}
		});
		return !params.cfg.session?.store || path.resolve(target.storePath) === path.resolve(params.storePath) ? {
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
	if (params.entry.status !== "running" || params.entry.pendingFinalDelivery !== void 0 || normalizeFiniteTimestamp(params.entry.endedAt) === void 0) return;
	const requester = resolveRestartRecoveryDispatchTarget(params);
	if (!requester) return;
	const listRuns = () => listSubagentRunsForRequester(requester.sessionKey, { requesterAgentId: requester.agentId });
	const owner = listRuns().find((run) => !run.collect && run.expectsCompletionMessage === true && !run.requesterTurnRunId && run.requesterSettleWake?.requesterYieldBatch === true && run.requesterSettleWake.rearmGeneration !== void 0 && run.requesterSettleWake.batchRunIds?.includes(run.runId));
	if (!owner) return;
	const wake = owner.requesterSettleWake;
	const rearmGeneration = wake?.rearmGeneration;
	return () => listRuns().includes(owner) && !owner.requesterTurnRunId && owner.requesterSettleWake === wake && wake?.rearmGeneration === rearmGeneration;
}
//#endregion
export { resolveRestartRecoveryDispatchTarget as n, captureYieldedMainSessionContinuation as t };
