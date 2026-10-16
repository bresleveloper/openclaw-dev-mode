import { i as reloadSharedAuthStoreOwnership } from "./path-resolve-CIRhdX6A.mjs";
import { g as prepareModelRuntimeSnapshot } from "./prepared-model-runtime-B8unFFC9.mjs";
import { u as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-I_zJ4x-o.mjs";
import { t as resolveModelAuthAgentScope } from "./model-auth-agent-scope-0oXdPDH7.mjs";
import { t as clearModelAuthStatusUsageCache } from "./models-auth-status-usage-cache-Bo64DSVw.mjs";
//#region src/gateway/model-auth-refresh.ts
async function refreshModelAuthStateAfterMutation(getRuntimeConfig, agentId) {
	reloadSharedAuthStoreOwnership();
	clearModelAuthStatusUsageCache();
	await refreshActiveProviderAuthRuntimeSnapshot();
	const config = getRuntimeConfig();
	const scope = resolveModelAuthAgentScope(config, agentId);
	if (!scope.ok) throw new Error(scope.error.message);
	await prepareModelRuntimeSnapshot({
		config,
		agentId,
		agentDir: scope.agentDir
	});
}
//#endregion
export { refreshModelAuthStateAfterMutation as t };
