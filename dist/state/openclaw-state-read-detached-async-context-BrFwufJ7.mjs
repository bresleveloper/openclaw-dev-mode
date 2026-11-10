import { s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
//#region src/shared/detached-async-context.ts
const asyncHooks = typeof process === "undefined" ? void 0 : process.getBuiltinModule("node:async_hooks");
const detachedAsyncContext = asyncHooks ? resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new asyncHooks.AsyncResource("openclaw.detached-async-context")) : void 0;
/** Runs under the context-free async root initialized before managed work can begin. */
function runInDetachedAsyncContext(run) {
	return detachedAsyncContext ? detachedAsyncContext.runInAsyncScope(run) : run();
}
//#endregion
export { runInDetachedAsyncContext as t };
