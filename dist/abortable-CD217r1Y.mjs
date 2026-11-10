import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import "./errors-DPfGDWk1.mjs";
//#region src/agents/embedded-agent-runner/run/abortable.ts
/** Marks AbortErrors produced by abortable() so provider aborts stay retryable. */
const OPENCLAW_ABORTABLE_WRAPPER = Symbol.for("openclaw.abortable.wrapper");
function isOpenClawAbortableWrapper(err) {
	return err !== null && typeof err === "object" && OPENCLAW_ABORTABLE_WRAPPER in err;
}
function createAbortableError(signal) {
	const reason = signal.reason;
	const err = new Error(reason instanceof Error ? reason.message : "aborted", reason ? { cause: reason } : void 0);
	return Object.assign(err, {
		name: "AbortError",
		[OPENCLAW_ABORTABLE_WRAPPER]: true
	});
}
const RUN_LIVENESS_JOIN_TIMEOUT_MS = 12e4;
function finishRunLivenessJoin(completion) {
	completion.finish?.();
}
/**
* Awaits post-turn work that must never dead-end the run: races the joined
* promise against the run-abort signal and a liveness deadline. Timeout and
* abort RESOLVE (timeout after `onTimeout`) instead of rejecting so settlement
* still produces a visible terminal outcome; rejections also resolve because
* the joined chains own their error logging.
*/
function joinWithRunLivenessDeadline(input) {
	return new Promise((resolve) => {
		const finish = (reason) => {
			if (!completion.finish) return;
			completion.finish = void 0;
			clearTimeout(timer);
			input.runAbortSignal?.removeEventListener("abort", onAbort);
			if (reason === "timeout") input.onTimeout();
			resolve();
		};
		const completion = { finish: () => finish("settled") };
		const onSettled = finishRunLivenessJoin.bind(void 0, completion);
		const onAbort = () => finish("abort");
		const timer = setTimeout(() => finish("timeout"), input.timeoutMs ?? 12e4);
		timer.unref?.();
		if (input.runAbortSignal?.aborted) {
			finish("abort");
			return;
		}
		input.runAbortSignal?.addEventListener("abort", onAbort, { once: true });
		Promise.resolve().then(() => input.joinWork()).then(onSettled, onSettled);
	});
}
/**
* Races a promise against an AbortSignal while preserving normal promise
* settlement. Abort wins immediately and rejected non-Error payloads are
* normalized so callers can safely log/inspect them as Error objects.
*/
function abortable(signal, promise) {
	if (signal.aborted) {
		promise.catch(() => {});
		return Promise.reject(createAbortableError(signal));
	}
	return withAbortListener(signal, () => promise, createAbortableError);
}
/** Start work under an already-checked signal, preserving the caller's abort error contract. */
function withAbortListener(signal, start, createError) {
	return new Promise((resolve, reject) => {
		const settle = (complete) => {
			signal.removeEventListener("abort", onAbort);
			complete();
		};
		const onAbort = () => settle(() => reject(createError(signal)));
		signal.addEventListener("abort", onAbort, { once: true });
		start().then((value) => settle(() => resolve(value)), (err) => settle(() => reject(toErrorObject(err, "Non-Error rejection"))));
	});
}
//#endregion
export { joinWithRunLivenessDeadline as a, isOpenClawAbortableWrapper as i, abortable as n, withAbortListener as o, createAbortableError as r, RUN_LIVENESS_JOIN_TIMEOUT_MS as t };
