import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
//#region src/context-engine/compaction-watchdog.ts
const runtimeCompactionDelegates = resolveGlobalSingleton(Symbol.for("openclaw.runtimeCompactionDelegates"), () => /* @__PURE__ */ new WeakSet());
function markRuntimeCompactionDelegate(compact) {
	runtimeCompactionDelegates.add(compact);
	return compact;
}
function inheritRuntimeCompactionDelegate(source, wrapped) {
	return runtimeCompactionDelegates.has(source) ? markRuntimeCompactionDelegate(wrapped) : wrapped;
}
function bindContextEngineCompaction(owner) {
	const compact = owner.compact;
	return inheritRuntimeCompactionDelegate(compact, compact.bind(owner));
}
function isRuntimeCompactionDelegate(compact) {
	return runtimeCompactionDelegates.has(compact);
}
//#endregion
export { markRuntimeCompactionDelegate as i, inheritRuntimeCompactionDelegate as n, isRuntimeCompactionDelegate as r, bindContextEngineCompaction as t };
