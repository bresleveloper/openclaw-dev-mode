import { i as resolveGlobalSet } from "./global-singleton-DrXvEBww.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/sessions/session-lifecycle-events.ts
const SESSION_LIFECYCLE_LISTENERS = resolveGlobalSet(Symbol.for("openclaw.sessionLifecycleEventListeners"), "close-and-restart");
const SESSION_IDENTITY_MUTATION_LISTENERS = resolveGlobalSet(Symbol.for("openclaw.sessionIdentityMutationListeners"), "close-and-restart");
function onSessionLifecycleEvent(listener) {
	return registerListener(SESSION_LIFECYCLE_LISTENERS, listener);
}
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
