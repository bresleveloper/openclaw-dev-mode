import { i as reloadSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { f as prepareModelRuntimeSnapshot } from "./prepared-model-runtime-DwKkPNoF.mjs";
import { l as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-DEo-RVto.mjs";
import { n as resolveModelAuthAgentScope, t as modelAuthAgentScopeError } from "./model-auth-agent-scope-EqqePUcC.mjs";
import { t as clearModelAuthStatusUsageCache } from "./models-auth-status-usage-cache-DPcy04ws.mjs";
//#region src/gateway/model-auth-refresh.ts
async function refreshModelAuthStateAfterMutation(getRuntimeConfig, agentId) {
	reloadSharedAuthStoreOwnership();
	clearModelAuthStatusUsageCache();
	await refreshActiveProviderAuthRuntimeSnapshot();
	const config = getRuntimeConfig();
	const scope = resolveModelAuthAgentScope(config, agentId);
	if (!scope.ok) throw new Error(modelAuthAgentScopeError(scope).message);
	await prepareModelRuntimeSnapshot({
		config,
		agentId,
		agentDir: scope.agentDir
	});
}
//#endregion
export { refreshModelAuthStateAfterMutation as t };
