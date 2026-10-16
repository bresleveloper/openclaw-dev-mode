import { S as resolveGlobalSingleton, x as resolveGlobalSet } from "./number-coercion-CmpLVzZ6.mjs";
resolveGlobalSingleton(Symbol.for("openclaw.signalExitOwner"), () => ({}));
const activeBarriers = resolveGlobalSet(Symbol.for("openclaw.signalExitBarriers"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.signalExitGates"), "close-and-restart");
const activeFinalizers = resolveGlobalSet(Symbol.for("openclaw.signalExitFinalizers"), "close-and-restart");
function registerSignalExitBarrier(barrier) {
	activeBarriers.add(barrier);
	return () => activeBarriers.delete(barrier);
}
/** Temporary artifacts remain available until other shutdown owners have drained. */
function registerSignalExitFinalizer(finalizer) {
	activeFinalizers.add(finalizer);
	return () => activeFinalizers.delete(finalizer);
}
//#endregion
export { registerSignalExitFinalizer as n, registerSignalExitBarrier as t };
