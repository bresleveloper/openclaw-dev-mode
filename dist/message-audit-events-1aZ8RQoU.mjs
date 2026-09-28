import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/audit/message-audit-events.ts
/** Trusted in-process message lifecycle stream for durable audit projection. */
const listeners = resolveGlobalSet(Symbol.for("openclaw.messageAuditListeners"), "close-and-restart");
/** Emit only closed metadata. This stream is intentionally not part of the plugin SDK. */
function emitTrustedMessageAuditEvent(event) {
	if (listeners.size === 0) return;
	notifyListeners(listeners, event);
}
function onTrustedMessageAuditEvent(listener) {
	return registerListener(listeners, listener);
}
/** Lets hot producers skip attribution work while message audit is disabled. */
function hasTrustedMessageAuditListeners() {
	return listeners.size > 0;
}
//#endregion
export { hasTrustedMessageAuditListeners as n, onTrustedMessageAuditEvent as r, emitTrustedMessageAuditEvent as t };
