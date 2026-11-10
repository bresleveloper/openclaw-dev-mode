import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
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
