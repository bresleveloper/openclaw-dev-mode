import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
//#region src/agents/model-fallback-stop.ts
const modelFallbackStops = resolveGlobalSingleton(Symbol.for("openclaw.modelFallbackStops"), () => /* @__PURE__ */ new WeakSet());
function recordModelFallbackStop(error) {
	modelFallbackStops.add(error);
}
function isRecordedModelFallbackStop(error) {
	return error instanceof Error && modelFallbackStops.has(error);
}
//#endregion
export { recordModelFallbackStop as n, isRecordedModelFallbackStop as t };
