import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
//#region src/secrets/runtime-memory-secret-owner.ts
/** Runtime owner for one agent's configured memory embedding provider. */
function runtimeMemorySecretOwnerId(agentId) {
	return `memory-provider:${normalizeAgentId(agentId)}`;
}
//#endregion
export { runtimeMemorySecretOwnerId as t };
