import { l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as assertAuthProfileStoreAgentOwner } from "./sqlite-BlFpr2YD.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./config-B3oiWDlr.mjs";
//#region src/cli/capability-cli/local-account-secrets.ts
/**
* Prepare the selected agent's account-owned SecretRefs for one standalone local
* capability run. Every agent-scoped local runner calls this before provider auth.
*/
async function prepareLocalCapabilityAccountSecrets(params) {
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	assertAuthProfileStoreAgentOwner(agentDir, params.agentId);
	if (getActiveSecretsRuntimeConfigSnapshot()) return;
	const secretsRuntime = await import("./runtime-B_N0bpgX.mjs");
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
