import { resolveGlobalSingleton } from "./global-singleton.js";

// Initialize the context-free async root before managed work can begin; async-work-scope
// resolves the same singleton for runInDetachedAsyncContext. Shared queue owners also run
// in the browser, which has no Node async context.
const asyncHooks =
  typeof process === "undefined" ? undefined : process.getBuiltinModule("node:async_hooks");
if (asyncHooks) {
  resolveGlobalSingleton(
    Symbol.for("openclaw.detachedAsyncContext"),
    () => new asyncHooks.AsyncResource("openclaw.detached-async-context"),
  );
}
