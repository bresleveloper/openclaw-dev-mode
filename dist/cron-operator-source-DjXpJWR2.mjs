import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { s as captureCronJobSourceAuthority } from "./active-jobs-CqHAjCGh.mjs";
import { o as decodeGatewayOperatorRecoverySource } from "./operator-run-authority-BcrXDfhQ.mjs";
import { r as restoreGatewayOperatorSource } from "./operator-run-recovery-BF0mZGB3.mjs";
import { u as resolveCronRequesterExecutionRevision } from "./jobs-tool-policy-BlxRC469.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/cron-operator-source.ts
/** Re-admit a captured same-conversation source, never a session owner or ambient scheduler. */
async function restoreCronOperatorSource(params) {
	if (!params.job.operatorSource) return;
	const captured = params.job.operatorSource;
	const source = decodeGatewayOperatorRecoverySource(captured.source);
	if (captured.executionRevision !== resolveCronRequesterExecutionRevision(params.job)) throw new Error("Scheduled operator continuation definition changed; recreate it from an authenticated turn");
	const context = getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext?.();
	const assertOccurrence = captureCronJobSourceAuthority(params.job.id);
	if (!context || !assertOccurrence || !params.deliveryAttemptFence) throw new Error("Scheduled operator continuation requires its live Gateway occurrence");
	const fence = params.deliveryAttemptFence;
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		assertOccurrence();
		fence.assertCurrent();
		const current = context.cron.getJob(params.job.id);
		const policy = current?.scheduledToolPolicy;
		if (context.resolveGatewayContext?.() !== context || !current || current.payload.kind !== "agentTurn" || policy?.mode !== "account" || policy.ownerSessionKey !== source.sessionKey || current.owner?.sessionKey !== source.sessionKey || current.sessionTarget !== `session:${source.sessionKey}` || params.agentId !== source.agentId || params.sessionKey !== source.sessionKey || params.entry.sessionId !== source.sessionId || params.entry.lifecycleRevision !== source.lifecycleRevision || !isDeepStrictEqual(current.operatorSource, captured)) throw new Error("Scheduled operator source no longer owns this conversation");
	};
	assertCurrent();
	return await restoreGatewayOperatorSource({
		snapshot: source.snapshot,
		target: source,
		context,
		assertCurrent
	});
}
//#endregion
export { restoreCronOperatorSource };
