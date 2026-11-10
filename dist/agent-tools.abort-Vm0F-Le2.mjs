import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { o as isCodeModeControlTool } from "./code-mode-control-tools-ktsLOa_a.mjs";
import { i as copyAgentToolMetadata } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { a as attachInternalToolExecutionPreparer, m as getInternalToolExecutionPreparer } from "./internal-hooks-CSjTREUl.mjs";
import { r as markToolExecutionNotStarted } from "./tool-effect-receipt-BHVAm8DM.mjs";
import "./tool-result-error-IpvGgAny.mjs";
//#region src/agents/agent-tools.abort.ts
/**
* Abort-signal wrapping for agent tools.
* Combines per-call cancellation with run-level aborts while preserving
* identity-backed metadata on wrapped tools.
*/
function throwAbortError() {
	throw markToolExecutionNotStarted(createAbortError("Aborted"));
}
/**
* Races a tool execute promise against the combined abort signal so an abort
* settles the wrapped call immediately instead of awaiting the tool forever.
* JavaScript cannot cancel a running promise: a tool that never observes the
* signal keeps executing in the background and may settle later, but its late
* settlement is detached here so the result never lands in an aborted run.
* Tool settlements pass through untouched to preserve tool error semantics,
* including non-Error rejections.
*/
function raceWithAbortSignal(promise, signal, yieldRunSignal) {
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			const reason = yieldRunSignal?.reason;
			if (yieldRunSignal?.aborted && signal.reason === reason && reason?.code === "sessions_yield" && reason.turnHandoff === true) return;
			reject(createAbortError("Aborted"));
		};
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error);
		});
		if (signal.aborted) onAbort();
	});
}
function isTurnYieldCall(tool, args) {
	return tool.name === "sessions_yield" || tool.name === "plugins" && asOptionalObjectRecord(args)?.action === "reloadAndResume";
}
/** Wrap a tool so every execute call observes the supplied run abort signal. */
function wrapToolWithAbortSignal(tool, abortSignal) {
	if (!abortSignal) return tool;
	const execute = tool.execute;
	if (!execute) return tool;
	const ownsCancellationOutcome = isCodeModeControlTool(tool);
	const wrappedTool = {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const combinedSignal = signal ? AbortSignal.any([signal, abortSignal]) : abortSignal;
			if (combinedSignal.aborted) throwAbortError();
			const execution = execute(toolCallId, params, combinedSignal, onUpdate);
			return ownsCancellationOutcome ? await execution : await raceWithAbortSignal(execution, combinedSignal, isTurnYieldCall(tool, params) ? abortSignal : void 0);
		}
	};
	copyAgentToolMetadata(tool, wrappedTool, (source) => wrapToolWithAbortSignal(source, abortSignal));
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (sourcePreparer) attachInternalToolExecutionPreparer(wrappedTool, async (params) => {
		const combinedSignal = params.signal ? AbortSignal.any([params.signal, abortSignal]) : abortSignal;
		if (combinedSignal.aborted) throwAbortError();
		const yieldRunSignal = tool.name === "sessions_yield" ? abortSignal : void 0;
		const sourcePreparation = sourcePreparer({
			...params,
			signal: combinedSignal
		});
		let prepared;
		try {
			prepared = await raceWithAbortSignal(sourcePreparation, combinedSignal, yieldRunSignal);
		} catch (error) {
			sourcePreparation.then((latePreparation) => latePreparation.dispose(), () => void 0);
			throw error;
		}
		if (prepared.kind === "immediate") return prepared;
		return {
			kind: "ready",
			args: prepared.args,
			execute: (onImplementationStart) => {
				if (combinedSignal.aborted) throwAbortError();
				const execution = prepared.execute(onImplementationStart);
				return ownsCancellationOutcome ? execution : raceWithAbortSignal(execution, combinedSignal, isTurnYieldCall(tool, prepared.args) ? abortSignal : void 0);
			},
			dispose: prepared.dispose
		};
	});
	return wrappedTool;
}
//#endregion
export { wrapToolWithAbortSignal as n, raceWithAbortSignal as t };
