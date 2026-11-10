import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
//#region src/context-engine/compaction-watchdog.ts
const compactionWatchdogs = resolveGlobalSingleton(Symbol.for("openclaw.compactionWatchdogs"), () => /* @__PURE__ */ new WeakMap());
//#endregion
export { compactionWatchdogs as t };
