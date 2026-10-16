import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
//#region src/context-engine/compaction-watchdog.ts
const compactionWatchdogResets = resolveGlobalSingleton(Symbol.for("openclaw.compactionWatchdogResets"), () => /* @__PURE__ */ new WeakMap());
//#endregion
export { compactionWatchdogResets as t };
