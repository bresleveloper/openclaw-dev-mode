import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
//#region src/secrets/runtime-sandbox-secret-owner.ts
/** Runtime owner for one agent's SSH sandbox credentials. */
function runtimeSandboxSecretOwnerId(agentId) {
	return `agent-sandbox:${normalizeAgentId(agentId)}`;
}
/** Rejects one agent's SSH sandbox when its runtime credentials are cold. */
function assertRuntimeSandboxSecretOwnerAvailable(agentId) {
	assertSecretOwnerAvailable("capability", runtimeSandboxSecretOwnerId(agentId));
}
//#endregion
export { runtimeSandboxSecretOwnerId as n, assertRuntimeSandboxSecretOwnerAvailable as t };
