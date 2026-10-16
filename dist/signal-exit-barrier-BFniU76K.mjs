import { a as resolveGlobalSingleton, i as resolveGlobalSet } from "./global-singleton-0m-JziJW.mjs";
//#region src/cli/signal-exit-barrier.ts
const processExitOwner = resolveGlobalSingleton(Symbol.for("openclaw.signalExitOwner"), () => ({}));
/** An exclusive process owner handles output failure through its normal shutdown. */
function registerSignalExitOwner(owner) {
	if (processExitOwner.current) throw new Error("A process signal exit owner is already registered");
	processExitOwner.current = owner;
	let active = true;
	return () => {
		if (!active) return;
		active = false;
		if (processExitOwner.current === owner) processExitOwner.current = void 0;
	};
}
const activeBarriers = resolveGlobalSet(Symbol.for("openclaw.signalExitBarriers"), "close-and-restart");
const activeGates = resolveGlobalSet(Symbol.for("openclaw.signalExitGates"), "close-and-restart");
const activeFinalizers = resolveGlobalSet(Symbol.for("openclaw.signalExitFinalizers"), "close-and-restart");
function registerSignalExitGate(finished, interrupt) {
	const gate = {
		finished,
		interrupt
	};
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
	return () => activeFinalizers.delete(finalizer);
}
let pendingSignalExitDrain;
let pendingProcessExit;
/** Broken output must not bypass a maintenance owner's asynchronous recovery. */
function exitAfterSignalExitBarriers(code) {
	if (processExitOwner.current) {
		processExitOwner.current(code);
		return;
	}
	if (pendingProcessExit) return;
	if (activeGates.size === 0 && activeBarriers.size === 0 && activeFinalizers.size === 0) {
		process.exit(code);
		return;
	}
	pendingProcessExit = waitForSignalExitBarriers().then(() => code).catch(() => code === 0 || code === "0" ? 1 : code).then((exitCode) => {
		pendingProcessExit = void 0;
		const outcome = process.exitCode;
		const finalCode = (exitCode === 0 || exitCode === "0") && outcome != null ? outcome : exitCode;
		if (processExitOwner.current) processExitOwner.current(finalCode);
		else process.exit(finalCode);
	});
}
function waitForSignalExitBarriers(signal) {
	pendingSignalExitDrain ??= drainSignalExitBarriers(signal).finally(() => {
		pendingSignalExitDrain = void 0;
	});
	return pendingSignalExitDrain;
}
async function drainSignalExitBarriers(signal) {
	const gates = [...activeGates];
	for (const gate of gates) gate.interrupt?.(signal);
	const gateResults = await Promise.allSettled(gates.map((gate) => gate.finished));
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
let cliDoctorSignalOwner = false;
function handleCliSignal(signal) {
	if (cliSignalExit) return;
	const listener = signal === "SIGINT" ? onCliSigint : onCliSigterm;
	if (!cliDoctorSignalOwner && process.listeners(signal).some((existing) => existing !== listener)) {
		detachCliSignalExitHandlers();
		return;
	}
	cliSignalExit = waitForSignalExitBarriers(signal).catch(() => {
		process.stderr.write("CLI signal cleanup did not complete. Retry the command to reclaim interrupted snapshots.\n");
	}).finally(() => process.exit(signal === "SIGINT" ? 130 : 143));
}
const onCliSigint = () => handleCliSignal("SIGINT");
const onCliSigterm = () => handleCliSignal("SIGTERM");
const onCliSigpipe = () => {
	if (cliSignalOwners > 0) exitAfterSignalExitBarriers(141);
};
/** Doctor keeps termination custody when progress spinners observe signals.
* Retain SIGPIPE until exit: removing its last listener restores SIG_DFL, not SIG_IGN. */
function installCliDoctorSignalExitHandlers() {
	if (cliSignalOwners === 0) return;
	cliDoctorSignalOwner = true;
	if (!process.listeners("SIGPIPE").includes(onCliSigpipe)) process.on("SIGPIPE", onCliSigpipe);
}
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
		if (--cliSignalOwners === 0) {
			cliDoctorSignalOwner = false;
			detachCliSignalExitHandlers();
		}
	};
}
/** Command error/output finalization cannot race an accepted signal's cleanup. */
async function waitForCliSignalExit() {
	await Promise.all([cliSignalExit, pendingProcessExit]);
}
//#endregion
export { registerSignalExitFinalizer as a, waitForCliSignalExit as c, registerSignalExitBarrier as i, waitForSignalExitBarriers as l, installCliDoctorSignalExitHandlers as n, registerSignalExitGate as o, installCliSignalExitHandlers as r, registerSignalExitOwner as s, exitAfterSignalExitBarriers as t };
