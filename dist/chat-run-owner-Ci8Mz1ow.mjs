import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
//#region src/gateway/chat-run-owner.ts
function resolveChatRunOwnerAgentId(params) {
	const ownerAgentId = normalizeOptionalString(params.agentId) ?? parseAgentSessionKey(params.sessionKey)?.agentId ?? normalizeOptionalString(params.defaultAgentId);
	return ownerAgentId ? normalizeAgentId(ownerAgentId) : void 0;
}
function chatRunBelongsToAgent(params, agentId) {
	return resolveChatRunOwnerAgentId(params) === normalizeAgentId(agentId);
}
function chatRunBelongsToSelectedAgent(params) {
	const selectedAgentId = normalizeOptionalString(params.selectedAgentId);
	return selectedAgentId ? chatRunBelongsToAgent(params, selectedAgentId) : false;
}
//#endregion
export { chatRunBelongsToSelectedAgent as n, resolveChatRunOwnerAgentId as r, chatRunBelongsToAgent as t };
