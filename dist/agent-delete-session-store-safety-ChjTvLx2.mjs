import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
//#region src/agents/agent-delete-session-store-safety.ts
var AgentSharedStoreOwnerError = class extends Error {};
function assertAgentSessionStoreDeletionBlocker(agentId, blocker) {
	if (blocker !== void 0) throw new AgentSharedStoreOwnerError(`Agent "${normalizeAgentId(agentId)}" owns the session database still used by agent "${blocker}" and cannot be deleted. Keep this owner configured until shared history can be moved with a supported migration; no such migration is currently available.`);
}
//#endregion
export { assertAgentSessionStoreDeletionBlocker as n, AgentSharedStoreOwnerError as t };
