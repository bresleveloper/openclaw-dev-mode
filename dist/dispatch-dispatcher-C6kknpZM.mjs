import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
//#region src/auto-reply/dispatch-dispatcher.ts
const settledTasksByDispatcher = resolveGlobalSingleton(Symbol.for("openclaw.replyDispatcherSettledTasks"), () => /* @__PURE__ */ new WeakMap());
/** Register post-delivery work owned by the dispatcher's settle lifecycle. */
function registerReplyDispatcherSettledTask(dispatcher, task) {
	const tasks = settledTasksByDispatcher.get(dispatcher) ?? /* @__PURE__ */ new Set();
	tasks.add(task);
	settledTasksByDispatcher.set(dispatcher, tasks);
}
/** Mark a dispatcher complete, wait for pending work, then run optional cleanup. */
async function settleReplyDispatcher(params) {
	params.dispatcher.markComplete();
	let receipt = void 0;
	const failures = [];
	try {
		receipt = await params.dispatcher.waitForIdle();
	} catch (error) {
		failures.push(error);
	}
	const tasks = settledTasksByDispatcher.get(params.dispatcher) ?? [];
	settledTasksByDispatcher.delete(params.dispatcher);
	for (const task of [...tasks, params.onSettled]) try {
		await task?.();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length > 0) throw failures[0];
	return receipt || void 0;
}
/** Run work with a dispatcher and always drain it before returning or throwing. */
async function withReplyDispatcher(params) {
	let run;
	try {
		run = { value: await params.run() };
	} catch (error) {
		run = { error };
	}
	try {
		const receipt = await settleReplyDispatcher(params);
		params.onSettledReceipt?.(receipt);
	} catch (error) {
		if ("value" in run) throw error;
	}
	if ("error" in run) throw run.error;
	return run.value;
}
//#endregion
export { settleReplyDispatcher as n, withReplyDispatcher as r, registerReplyDispatcherSettledTask as t };
