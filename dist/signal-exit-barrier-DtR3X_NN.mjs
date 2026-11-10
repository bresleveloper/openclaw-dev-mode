import { a as resolveGlobalSingleton, i as resolveGlobalSet } from "./global-singleton-DrXvEBww.mjs";
//#region src/cli/signal-exit-barrier.ts
const cliSignalExitCodes = {
	SIGINT: 130,
	SIGTERM: 143,
	SIGHUP: 129
};
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
function exitAfterSignalExitBarriers(code, reason) {
	if (processExitOwner.current) {
		processExitOwner.current(code, reason);
		return;
	}
	if (pendingProcessExit) return;
	if (activeGates.size === 0 && activeBarriers.size === 0 && activeFinalizers.size === 0) {
		process.exitCode = code;
		pendingProcessExit = Promise.resolve(code);
		return;
	}
	pendingProcessExit = waitForSignalExitBarriers().then(() => code).catch(() => code === 0 || code === "0" ? 1 : code).then((exitCode) => {
		const outcome = process.exitCode;
		const finalCode = (exitCode === 0 || exitCode === "0") && outcome != null ? outcome : exitCode;
		if (processExitOwner.current) processExitOwner.current(finalCode, reason);
		else process.exitCode = finalCode;
		return finalCode;
	});
}
function waitForSignalExitBarriers(signal) {
	pendingSignalExitDrain ??= drainSignalExitBarriers(signal).finally(() => {
		pendingSignalExitDrain = void 0;
	});
	if (signal && !cliSignalExit) {
		const code = cliSignalExitCodes[signal];
		cliSignalExit = pendingSignalExitDrain.then(() => code, () => code);
	}
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
	if (!cliDoctorSignalOwner && process.listeners(signal).some((existing) => existing !== cliSignalListeners[signal])) {
		detachCliSignalExitHandlers();
		return;
	}
	cliSignalExit = waitForSignalExitBarriers(signal).catch(() => {
		process.stderr.write("CLI signal cleanup did not complete. Retry the command to reclaim interrupted snapshots.\n");
	}).then(() => {
		const code = cliSignalExitCodes[signal];
		process.exitCode = code;
		return code;
	});
}
const cliSignalListeners = {
	SIGINT: () => handleCliSignal("SIGINT"),
	SIGTERM: () => handleCliSignal("SIGTERM"),
	SIGHUP: () => handleCliSignal("SIGHUP")
};
const onCliSigpipe = () => {};
const onCliOutputError = (error) => {
	if (error.code === "EPIPE" && cliSignalOwners > 0) exitAfterSignalExitBarriers(141);
};
/** Doctor keeps termination custody when progress spinners observe signals.
* Retain SIGPIPE until exit: removing its last listener restores SIG_DFL, not SIG_IGN. */
function installCliDoctorSignalExitHandlers() {
	if (cliSignalOwners === 0 || cliDoctorSignalOwner) return;
	cliDoctorSignalOwner = true;
	process.prependListener("SIGHUP", cliSignalListeners.SIGHUP);
	if (!process.listeners("SIGPIPE").includes(onCliSigpipe)) {
		process.on("SIGPIPE", onCliSigpipe);
		process.stdout.prependListener("error", onCliOutputError);
		process.stderr.prependListener("error", onCliOutputError);
	}
}
function detachCliSignalExitHandlers() {
	for (const [signal, listener] of Object.entries(cliSignalListeners)) process.off(signal, listener);
}
/** Executable CLI commands share one signal owner; Gateway and update handlers
* keep their specialized lifecycle and use these same barriers. */
function installCliSignalExitHandlers() {
	if (cliSignalOwners++ === 0) {
		process.prependListener("SIGINT", cliSignalListeners.SIGINT);
		process.prependListener("SIGTERM", cliSignalListeners.SIGTERM);
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
	const signalExit = cliSignalExit;
	const requestedExit = pendingProcessExit;
	const [signalCode, requestedCode] = await Promise.all([signalExit, requestedExit]);
	if (cliSignalExit === signalExit) cliSignalExit = void 0;
	if (pendingProcessExit === requestedExit) pendingProcessExit = void 0;
	if ((requestedCode === 0 || requestedCode === "0") && signalCode !== void 0) return signalCode;
	return requestedCode ?? signalCode;
}
//#endregion
export { registerSignalExitFinalizer as a, waitForCliSignalExit as c, registerSignalExitBarrier as i, waitForSignalExitBarriers as l, installCliDoctorSignalExitHandlers as n, registerSignalExitGate as o, installCliSignalExitHandlers as r, registerSignalExitOwner as s, exitAfterSignalExitBarriers as t };
