import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/auto-reply/reply/dispatch-processed-outcome.ts
const dispatchProcessedOutcomeSink = resolveGlobalSingleton(Symbol.for("openclaw.dispatchProcessedOutcomeSink"), () => new AsyncLocalStorage());
/**
* Runs a channel turn's dispatch under a sink so its terminal outcome can attribute
* zero-count warnings without widening the plugin-visible dispatch result contract.
*/
async function withDispatchProcessedOutcomeSink(run) {
	const sink = {};
	return {
		result: await dispatchProcessedOutcomeSink.run(sink, run),
		processedOutcome: sink.current
	};
}
/** Records the dispatch's terminal outcome for the surrounding channel turn, if any. */
function noteDispatchProcessedOutcome(note) {
	const sink = dispatchProcessedOutcomeSink.getStore();
	if (sink) sink.current = note;
}
//#endregion
export { withDispatchProcessedOutcomeSink as n, noteDispatchProcessedOutcome as t };
