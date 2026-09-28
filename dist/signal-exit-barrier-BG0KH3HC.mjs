import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
//#region src/cli/signal-exit-barrier.ts
const activeBarriers = resolveGlobalSet(Symbol.for("openclaw.signalExitBarriers"), "close-and-restart");
const activeGates = resolveGlobalSet(Symbol.for("openclaw.signalExitGates"), "close-and-restart");
const activeFinalizers = resolveGlobalSet(Symbol.for("openclaw.signalExitFinalizers"), "close-and-restart");
function registerSignalExitGate(gate) {
	activeGates.add(gate);
	return () => activeGates.delete(gate);
}
function registerSignalExitBarrier(barrier) {
	activeBarriers.add(barrier);
	return () => activeBarriers.delete(barrier);
}
/** Temporary artifacts remain available until other shutdown owners have drained. */
function registerSignalExitFinalizer(finalizer) {
	activeFinalizers.add(finalizer);
}
let pendingSignalExitDrain;
function waitForSignalExitBarriers() {
	pendingSignalExitDrain ??= drainSignalExitBarriers().finally(() => {
		pendingSignalExitDrain = void 0;
	});
	return pendingSignalExitDrain;
}
async function drainSignalExitBarriers() {
	const gateResults = await Promise.allSettled(activeGates);
	const barrierResults = await Promise.allSettled([...activeBarriers].map((barrier) => Promise.resolve().then(barrier)));
	const finalizerResults = await Promise.allSettled([...activeFinalizers].map((finalizer) => Promise.resolve().then(finalizer)));
	const failures = [
		...gateResults,
		...barrierResults,
		...finalizerResults
	].filter((result) => result.status === "rejected").map((result) => result.reason);
	if (failures.length > 0) throw new AggregateError(failures, "Signal exit cleanup failed");
}
let cliSignalExit;
let cliSignalOwners = 0;
function handleCliSignal(signal) {
	if (cliSignalExit) return;
	const listener = signal === "SIGINT" ? onCliSigint : onCliSigterm;
	if (process.listeners(signal).some((existing) => existing !== listener)) {
		detachCliSignalExitHandlers();
		return;
	}
	cliSignalExit = waitForSignalExitBarriers().catch(() => {
		process.stderr.write("CLI signal cleanup did not complete. Retry the command to reclaim interrupted snapshots.\n");
	}).finally(() => process.exit(signal === "SIGINT" ? 130 : 143));
}
const onCliSigint = () => handleCliSignal("SIGINT");
const onCliSigterm = () => handleCliSignal("SIGTERM");
function detachCliSignalExitHandlers() {
	process.off("SIGINT", onCliSigint);
	process.off("SIGTERM", onCliSigterm);
}
/** Executable CLI commands share one signal owner; Gateway and update handlers
* keep their specialized lifecycle and use these same barriers. */
function installCliSignalExitHandlers() {
	if (cliSignalOwners++ === 0) {
		process.prependListener("SIGINT", onCliSigint);
		process.prependListener("SIGTERM", onCliSigterm);
	}
	let active = true;
	return () => {
		if (!active) return;
		active = false;
		if (--cliSignalOwners === 0) detachCliSignalExitHandlers();
	};
}
/** Command error/output finalization cannot race an accepted signal's cleanup. */
async function waitForCliSignalExit() {
	await cliSignalExit;
}
//#endregion
export { waitForCliSignalExit as a, registerSignalExitGate as i, registerSignalExitBarrier as n, waitForSignalExitBarriers as o, registerSignalExitFinalizer as r, installCliSignalExitHandlers as t };
