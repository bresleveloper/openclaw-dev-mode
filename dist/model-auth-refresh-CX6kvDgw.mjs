import { i as reloadSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { f as prepareModelRuntimeSnapshot } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { l as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-D0xqf4F1.mjs";
import { n as resolveModelAuthAgentScope, t as modelAuthAgentScopeError } from "./model-auth-agent-scope-EqqePUcC.mjs";
import { t as clearModelAuthStatusUsageCache } from "./models-auth-status-usage-cache-kbmU8zR4.mjs";
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
