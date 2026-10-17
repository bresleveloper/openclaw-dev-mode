import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import "./config-9720xhC5.mjs";
import { t as assertAuthProfileStoreAgentOwner } from "./sqlite-CW8wNN4G.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
//#region src/cli/capability-cli/local-account-secrets.ts
/**
* Prepare the selected agent's account-owned SecretRefs for one standalone local
* capability run. Every agent-scoped local runner calls this before provider auth.
*/
async function prepareLocalCapabilityAccountSecrets(params) {
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	assertAuthProfileStoreAgentOwner(agentDir, params.agentId);
	if (getActiveSecretsRuntimeConfigSnapshot()) return;
	const secretsRuntime = await import("./runtime-Bhd5Dlbh.mjs");
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
export { prepareLocalCapabilityAccountSecrets };
