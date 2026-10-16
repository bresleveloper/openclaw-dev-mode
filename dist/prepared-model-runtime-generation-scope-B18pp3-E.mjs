import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { d as withRemoteModelCatalogSnapshot, u as runOutsideRemoteModelCatalogSnapshot } from "./remote-overlay-C3A-3o4_.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/prepared-model-runtime-generation-scope.ts
const preparedModelRuntimePluginGenerationScope = resolveGlobalSingleton(Symbol.for("openclaw.preparedModelRuntimePluginGenerationScope"), () => new AsyncLocalStorage());
/** Borrow authority closes before the retained generation begins asynchronous disposal. */
function scopePreparedModelRuntimeLease(lease) {
	let open = true;
	let disposal;
	return {
		...lease,
		[Symbol.asyncDispose]() {
			open = false;
			return disposal ??= lease[Symbol.asyncDispose]();
		},
		run(run) {
			if (!open) throw new Error("Captured reply runtime lease is closed");
			return withPreparedModelRuntimePluginGenerationScope(lease.pluginGeneration, run, () => open ? lease.snapshot : void 0);
		}
	};
}
/** Keeps the exact admitted generation available to nested embedded agent runs. */
function withPreparedModelRuntimePluginGenerationScope(generation, run, borrowSnapshot) {
	const inherited = preparedModelRuntimePluginGenerationScope.getStore();
	const borrow = borrowSnapshot ?? (inherited?.generation === generation ? inherited.borrowSnapshot : void 0);
	return withRemoteModelCatalogSnapshot(generation.remoteCatalog, () => preparedModelRuntimePluginGenerationScope.run({
		generation,
		...borrow ? { borrowSnapshot: borrow } : {}
	}, run));
}
/** Detached queue drains re-admit on the current generation, never a predecessor's scope. */
function runOutsidePreparedModelRuntimePluginGenerationScope(run) {
	return runOutsideRemoteModelCatalogSnapshot(() => preparedModelRuntimePluginGenerationScope.exit(run));
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
export { withPreparedModelRuntimePluginGenerationScope as a, scopePreparedModelRuntimeLease as i, getPreparedModelRuntimePluginGeneration as n, runOutsidePreparedModelRuntimePluginGenerationScope as r, getPreparedModelRuntimeBorrowedSnapshot as t };
