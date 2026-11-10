import { s as reloadSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { _ as prepareModelRuntimeSnapshot } from "./prepared-model-runtime-wDlPVSla.mjs";
import { s as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-Dnoq_32U.mjs";
import { t as resolveModelAuthAgentScope } from "./model-auth-agent-scope-CiCE5zUc.mjs";
import { t as clearModelAuthStatusUsageCache } from "./models-auth-status-usage-cache-4i0_JxOF.mjs";
//#region src/gateway/model-auth-refresh.ts
async function refreshModelAuthStateAfterMutation(getRuntimeConfig, agentId) {
	await reloadSharedAuthStoreOwnership();
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
