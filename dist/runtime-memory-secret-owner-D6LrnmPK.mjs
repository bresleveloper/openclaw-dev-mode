import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
//#region src/secrets/runtime-memory-secret-owner.ts
/** Runtime owner for one agent's configured memory embedding provider. */
function runtimeMemorySecretOwnerId(agentId) {
	return `memory-provider:${normalizeAgentId(agentId)}`;
}
//#endregion
export { runtimeMemorySecretOwnerId as t };
