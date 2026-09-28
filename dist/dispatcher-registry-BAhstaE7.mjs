import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
//#region src/auto-reply/reply/dispatcher-registry.ts
/**
* Global registry for tracking active reply dispatchers.
* Used to ensure gateway restart waits for all replies to complete.
*/
const activeDispatchers = resolveGlobalSet(Symbol.for("openclaw.activeReplyDispatchers"), "close-only");
/**
* Register a reply dispatcher for global tracking.
* Returns an unregister function to call when the dispatcher is no longer needed.
*/
function registerDispatcher(pending) {
	const tracked = { pending };
	activeDispatchers.add(tracked);
	return () => {
		activeDispatchers.delete(tracked);
	};
}
/**
* Get the total number of pending replies across all dispatchers.
*/
function getTotalPendingReplies() {
	let total = 0;
	for (const dispatcher of activeDispatchers) total += dispatcher.pending();
	return total;
}
//#endregion
export { registerDispatcher as n, getTotalPendingReplies as t };
