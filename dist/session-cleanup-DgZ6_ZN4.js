import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
import { i as isCronSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-runtime-BkUYqKo5.js";
import "./agent-bundle-mcp-tools-CJT5lUbs.js";
//#region src/cron/isolated-agent/session-cleanup.ts
const gatewayCallRuntimeLoader = createLazyImportLoader(() => import("./call.runtime.js"));
async function loadGatewayCallRuntime() {
	return await gatewayCallRuntimeLoader.load();
}
async function cleanupCronRunSessionAfterRun(params) {
	if (!params.job.deleteAfterRun) return false;
	if (!isCronSessionKey(params.agentSessionKey)) return false;
	try {
		const { callGateway } = await loadGatewayCallRuntime();
		await callGateway({
			method: "sessions.delete",
			params: {
				key: params.agentSessionKey,
				deleteTranscript: true,
				emitLifecycleHooks: false
			},
			timeoutMs: 1e4
		});
	} catch {
		await retireSessionMcpRuntime({
			sessionId: params.sessionId,
			reason: params.reason
		});
	}
	return true;
}
//#endregion
export { cleanupCronRunSessionAfterRun as t };
