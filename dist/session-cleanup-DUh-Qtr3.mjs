import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { x as isCronSessionKey } from "./session-key-CBvmC8zz.mjs";
import { d as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-jXc1RW7-.mjs";
import "./lifecycle-WWQJH57y.mjs";
import "./agent-bundle-mcp-tools-sYSmxaoq.mjs";
//#region src/cron/isolated-agent/session-cleanup.ts
const gatewayCallRuntimeLoader = createLazyImportLoader(() => import("./in-process-gateway-CSMvBDM8.mjs"));
async function deleteCronSessionViaGateway(params) {
	const { bindAgentToolGatewayRequest } = await gatewayCallRuntimeLoader.load();
	return (await bindAgentToolGatewayRequest({ hostedOnly: true })({
		method: "sessions.delete",
		params: {
			key: params.agentSessionKey,
			deleteTranscript: true,
			emitLifecycleHooks: false,
			expectedSessionId: params.sessionId,
			expectedLifecycleRevision: params.lifecycleRevision,
			expectedSessionUpdatedAt: params.sessionUpdatedAt
		},
		timeoutMs: 1e4
	})).deleted === true;
}
async function cleanupCronRunSessionAfterRun(params) {
	if (!shouldDeleteCronRunSessionAfterRun(params)) return "not-requested";
	params.beforeDelete?.();
	try {
		return await deleteCronSessionViaGateway(params) ? "deleted" : "changed";
	} catch (error) {
		if (isSessionChangedGatewayError(error)) return "changed";
		if (params.job.sessionTarget === "isolated") {
			await retireSessionMcpRuntime({
				sessionId: params.sessionId,
				reason: params.reason
			});
			return "retired";
		}
		return "survived";
	}
}
function shouldDeleteCronRunSessionAfterRun(params) {
	return params.job.deleteAfterRun === true && isCronSessionKey(params.agentSessionKey);
}
function isSessionChangedGatewayError(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	const requestError = error;
	const details = requestError.details;
	return requestError.gatewayCode === "INVALID_REQUEST" && typeof details === "object" && details !== null && details.reason === "session-changed";
}
//#endregion
export { deleteCronSessionViaGateway as n, cleanupCronRunSessionAfterRun as t };
