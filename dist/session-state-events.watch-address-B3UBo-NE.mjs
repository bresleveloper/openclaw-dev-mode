import { t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as parseAgentSessionKeyParts } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
//#region src/sessions/session-state-events.watch-address.ts
function sessionStateWatchAgentId(sessionKey) {
	const parsed = parseAgentSessionKeyParts(sessionKey);
	return parsed && isValidAgentId(parsed.agentId) ? parsed.agentId.toLowerCase() : void 0;
}
function isSessionStateWatchAddress(params) {
	const targetAgentId = sessionStateWatchAgentId(params.targetSessionKey);
	return Boolean(sessionStateWatchAgentId(params.watcherSessionKey) && targetAgentId && (params.targetAgentId === void 0 || isValidAgentId(params.targetAgentId) && params.targetAgentId.trim().toLowerCase() === targetAgentId));
}
//#endregion
export { sessionStateWatchAgentId as n, isSessionStateWatchAddress as t };
