import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./config-DryArA1l.mjs";
import { t as assertAuthProfileStoreAgentOwner } from "./sqlite-BIg_k8qE.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-CtZtwiOt.mjs";
//#region src/cli/capability-cli/local-account-secrets.ts
/**
* Prepare the selected agent's account-owned SecretRefs for one standalone local
* capability run. Every agent-scoped local runner calls this before provider auth.
*/
async function prepareLocalCapabilityAccountSecrets(params) {
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	assertAuthProfileStoreAgentOwner(agentDir, params.agentId);
	if (getActiveSecretsRuntimeConfigSnapshot()) return;
	const secretsRuntime = await import("./runtime-BvcILptz.mjs");
	const snapshot = await secretsRuntime.prepareSecretsRuntimeSnapshot({
		config: getRuntimeConfigSourceSnapshot() ?? params.cfg,
		assignmentConfig: params.cfg,
		agentDirs: [agentDir],
		includeConfigRefs: false,
		allowUnavailableSecretOwners: true
	});
	secretsRuntime.activateSecretsRuntimeSnapshot(snapshot);
}
//#endregion
export { prepareLocalCapabilityAccountSecrets as t };
