import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { i as registerSignalExitBarrier, l as waitForSignalExitBarriers, o as registerSignalExitGate } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DaL1xmcH.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { i as finishInterruptedUpdateBeforeActivation } from "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
//#region src/cli/update-cli/update-command-mutable-signals.ts
const admissions = /* @__PURE__ */ new WeakMap();
/** Exit must retain recovery through executor settlement and the bounded failure report. */
async function withMutableUpdateTerminalSettlement(operation) {
	const completion = createDeferredCore();
	try {
		return await operation((run) => {
			const admission = admissions.get(run);
			if (admission) admission.terminal = completion.promise;
		});
	} finally {
		completion.resolve();
	}
}
function recordMutableUpdateSignalPhase(run, phase) {
	const admission = run && admissions.get(run);
	if (admission) admission.phase = phase;
}
/** Only forward commands inherit interruption; rollback retains its original live fence. */
async function withMutableUpdateForwardScope(opts, work) {
	const admission = opts.run && admissions.get(opts.run);
	if (!admission) return await work();
	if (admission.interruption) throw admission.interruption.error;
	return await withCommandProcessScope(async (stop) => {
		admission.forward.add(stop);
		try {
			return await work();
		} finally {
			admission.forward.delete(stop);
		}
	});
}
function recordMutableUpdateInterruption(opts, result) {
	const interruption = opts.run && admissions.get(opts.run)?.interruption;
	if (!interruption || result.steps.some((step) => step.name === interruption.phase && step.termination === "signal" && step.signal === interruption.signal && step.stderrTail === interruption.error.message)) return result;
	const step = {
		name: interruption.phase,
		command: "openclaw update",
		cwd: result.root ?? "",
		durationMs: 0,
		exitCode: 1,
		termination: "signal",
		signal: interruption.signal,
		stderrTail: interruption.error.message
	};
	return {
		...result,
		status: "error",
		reason: "interrupted",
		failedStep: step,
		steps: [...result.steps, step]
	};
}
function trackSignalSettlement(admission, completion) {
	const retained = completion.catch((error) => {
		if (!hasCommandProcessCleanupError(error)) return;
		if (admission) admission.unconfirmedWrite ??= { error };
		throw error;
	});
	if (admission) {
		admission.settlements.add(retained);
		const release = () => admission.settlements.delete(retained);
		retained.then(release, release);
	}
	return retained;
}
/** Record uncertainty before signal gates release the original admission to its finalizer. */
function retainMutableUpdateSignalWrite(run, completion) {
	const retained = trackSignalSettlement(run ? admissions.get(run) : void 0, completion);
	const release = registerSignalExitGate(retained);
	retained.then(release, release);
}
/** Retain rollback work without retaining a potentially unbounded forward command. */
function captureMutableUpdateCompensation(opts) {
	const run = opts.run;
	const admission = run ? admissions.get(run) : void 0;
	return async (operation) => {
		if (!admission) return await operation();
		if (!admission.active || admission.sealed) throw new Error("Update compensation admission is no longer current.");
		const completion = createDeferredCore();
		trackSignalSettlement(admission, completion.promise);
		try {
			const result = await operation();
			completion.resolve();
			return result;
		} catch (error) {
			completion.reject(error);
			throw error;
		}
	};
}
function admitMutableUpdateSignalRun(run, record) {
	const env = { ...run.env };
	admissions.set(run, {
		env,
		settlements: /* @__PURE__ */ new Set(),
		phase: record.phase,
		forward: /* @__PURE__ */ new Set()
	});
}
function retireMutableUpdateSignalLedgerRecording(run) {
	const admission = admissions.get(run);
	if (admission) admission.ledgerRecordingRetired = true;
}
function retireMutableUpdateSignalRun(run) {
	admissions.delete(run);
}
async function withMutableUpdateSignals(opts, operation) {
	const run = opts.run;
	const admission = !opts.dryRun && run ? admissions.get(run) : void 0;
	if (!run || !admission || admission.active) return await operation();
	admission.active = true;
	const { env } = admission;
	const prepareSettlement = () => {
		const { executorFence, runId } = run;
		if (process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" || process.env.OPENCLAW_UPDATE_POST_CORE === "1" || !executorFence) return;
		const assertCurrent = () => {
			executorFence.assertCurrent();
		};
		return () => {
			if (admission.ledgerRecordingRetired) return;
			assertCurrent();
			if (admission.unconfirmedWrite) throw admission.unconfirmedWrite.error;
			const expected = getUpdateRun(runId, { env });
			if (!expected || expected.status !== "running" || ![
				"requested",
				"staging",
				"validating"
			].includes(expected.phase)) return;
			assertCurrent();
			finishInterruptedUpdateBeforeActivation(expected, assertCurrent, { env });
		};
	};
	let settle;
	let shutdown;
	let cleanup;
	const finishOwnedCleanup = () => {
		admission.sealed = true;
		return cleanup ??= (async () => {
			while (admission.settlements.size > 0) await Promise.allSettled(admission.settlements);
			try {
				settle?.();
			} catch {
				defaultRuntime.error("Update interruption could not be recorded; history remains pending.");
			}
			if (admission.unconfirmedWrite) throw admission.unconfirmedWrite.error;
		})();
	};
	const unregister = registerSignalExitBarrier(finishOwnedCleanup);
	const onSignal = (signal, code) => {
		if (shutdown) return;
		if (admission.terminal && [
			"activating",
			"restarting",
			"verifying"
		].includes(admission.phase)) {
			admission.recovering = true;
			admission.interruption = {
				signal,
				phase: admission.phase,
				error: /* @__PURE__ */ new Error(`Update interrupted by ${signal} during ${admission.phase}.`)
			};
			defaultRuntime.error(`${admission.interruption.error.message} Recovering the Gateway before exit. Check openclaw update status; use openclaw update repair if recovery remains pending.`);
			const deadline = performance.now() + (run.activationTimeoutMs ?? run.defaultStepTimeoutMs ?? 18e5);
			const settled = awaitWithinDeadline(() => admission.terminal, deadline, () => performance.now()).then((result) => {
				if (result === ABSOLUTE_DEADLINE_EXPIRED) defaultRuntime.error("Update interruption cleanup exceeded its recovery budget. Run openclaw update status, then openclaw update repair to inspect retained recovery.");
			});
			const release = registerSignalExitGate(settled);
			settled.then(release, release);
		} else admission.sealed = true;
		run.interrupted = true;
		for (const stop of admission.forward) stop();
		try {
			if (!admission.recovering) settle = prepareSettlement();
		} catch {
			defaultRuntime.error("Update interruption could not be recorded; history remains pending.");
		}
		shutdown = waitForSignalExitBarriers(signal).catch(() => {
			defaultRuntime.error("Update signal cleanup did not complete.");
		}).finally(() => {
			process.exitCode = code;
		});
	};
	const onSigint = () => onSignal("SIGINT", 130);
	const onSigterm = () => onSignal("SIGTERM", 143);
	const onSighup = () => onSignal("SIGHUP", 129);
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigterm);
	process.on("SIGHUP", onSighup);
	let outcome;
	try {
		outcome = { result: await operation() };
	} catch (error) {
		outcome = { error };
	}
	try {
		await finishOwnedCleanup();
	} catch (error) {
		defaultRuntime.error("Update signal cleanup did not complete.");
		outcome = { error: "error" in outcome && outcome.error !== error ? new AggregateError([outcome.error, error], "Update cleanup failed", { cause: outcome.error }) : error };
	} finally {
		if (admission.recovering && admission.terminal) admission.terminal.then(() => retireMutableUpdateSignalRun(run));
		else retireMutableUpdateSignalRun(run);
		const removeSignalHandlers = () => {
			process.off("SIGINT", onSigint);
			process.off("SIGTERM", onSigterm);
			process.off("SIGHUP", onSighup);
		};
		if (shutdown) shutdown.then(removeSignalHandlers, removeSignalHandlers);
		else removeSignalHandlers();
		unregister();
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.result;
}
//#endregion
export { retainMutableUpdateSignalWrite as a, withMutableUpdateSignals as c, recordMutableUpdateSignalPhase as i, withMutableUpdateTerminalSettlement as l, captureMutableUpdateCompensation as n, retireMutableUpdateSignalLedgerRecording as o, recordMutableUpdateInterruption as r, withMutableUpdateForwardScope as s, admitMutableUpdateSignalRun as t };
