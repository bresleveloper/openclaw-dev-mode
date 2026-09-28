import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
//#region src/gateway/session-reset-notifications.ts
const listeners = resolveGlobalSet(Symbol.for("openclaw.gatewaySessionResetListeners"), "close-and-restart");
/** Subscribes process-local lifecycle services to committed session resets. */
function onGatewaySessionReset(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
/** Notifies lifecycle-owned in-memory services after the session reset commits. */
function notifyGatewaySessionReset(sessionKey, agentId) {
	for (const listener of listeners) try {
		listener(sessionKey, agentId);
	} catch {}
}
//#endregion
export { onGatewaySessionReset as n, notifyGatewaySessionReset as t };
