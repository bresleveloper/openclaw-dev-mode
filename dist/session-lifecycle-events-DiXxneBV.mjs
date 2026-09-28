import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/sessions/session-lifecycle-events.ts
/** Session lifecycle event broadcast to observers when a session is created or linked. */
const SESSION_LIFECYCLE_LISTENERS = resolveGlobalSet(Symbol.for("openclaw.sessionLifecycleEventListeners"), "close-and-restart");
const SESSION_IDENTITY_MUTATION_LISTENERS = resolveGlobalSet(Symbol.for("openclaw.sessionIdentityMutationListeners"), "close-and-restart");
/** Registers a session lifecycle listener. */
function onSessionLifecycleEvent(listener) {
	return registerListener(SESSION_LIFECYCLE_LISTENERS, listener);
}
/** Emits a best-effort session lifecycle event to all listeners. */
function emitSessionLifecycleEvent(event) {
	notifyListeners(SESSION_LIFECYCLE_LISTENERS, event);
}
function onSessionIdentityMutation(listener) {
	return registerListener(SESSION_IDENTITY_MUTATION_LISTENERS, listener);
}
function emitSessionIdentityMutation(mutation) {
	notifyListeners(SESSION_IDENTITY_MUTATION_LISTENERS, mutation);
}
//#endregion
export { onSessionLifecycleEvent as i, emitSessionLifecycleEvent as n, onSessionIdentityMutation as r, emitSessionIdentityMutation as t };
