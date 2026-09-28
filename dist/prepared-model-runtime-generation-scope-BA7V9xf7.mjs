import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/prepared-model-runtime-generation-scope.ts
const preparedModelRuntimePluginGenerationScope = resolveGlobalSingleton(Symbol.for("openclaw.preparedModelRuntimePluginGenerationScope"), () => new AsyncLocalStorage());
/** Keeps the exact admitted generation available to nested embedded agent runs. */
function withPreparedModelRuntimePluginGenerationScope(generation, run, borrowSnapshot) {
	const inherited = preparedModelRuntimePluginGenerationScope.getStore();
	const borrow = borrowSnapshot ?? (inherited?.generation === generation ? inherited.borrowSnapshot : void 0);
	return preparedModelRuntimePluginGenerationScope.run({
		generation,
		...borrow ? { borrowSnapshot: borrow } : {}
	}, run);
}
/** Detached queue drains re-admit on the current generation, never a predecessor's scope. */
function runOutsidePreparedModelRuntimePluginGenerationScope(run) {
	return preparedModelRuntimePluginGenerationScope.exit(run);
}
/** Exact admitted generation active for nested prepared model-runtime acquisition. */
function getPreparedModelRuntimePluginGeneration() {
	return preparedModelRuntimePluginGenerationScope.getStore()?.generation;
}
/** Borrows the exact parent snapshot only while its owning turn lease remains open. */
function getPreparedModelRuntimeBorrowedSnapshot(generation) {
	const current = preparedModelRuntimePluginGenerationScope.getStore();
	return current?.generation === generation ? current.borrowSnapshot?.() : void 0;
}
//#endregion
export { withPreparedModelRuntimePluginGenerationScope as i, getPreparedModelRuntimePluginGeneration as n, runOutsidePreparedModelRuntimePluginGenerationScope as r, getPreparedModelRuntimeBorrowedSnapshot as t };
