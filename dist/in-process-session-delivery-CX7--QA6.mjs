import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
//#region src/gateway/in-process-session-delivery.ts
const generations = resolveGlobalSingleton(Symbol.for("openclaw.inProcessSessionDeliveryGenerations"), () => /* @__PURE__ */ new WeakMap());
function bindInProcessSessionDeliveryGeneration(params, generation) {
	if (generation) generations.set(params, Object.freeze({ ...generation }));
	return params;
}
function readInProcessSessionDeliveryGeneration(params) {
	return typeof params === "object" && params !== null ? generations.get(params) : void 0;
}
//#endregion
export { readInProcessSessionDeliveryGeneration as n, bindInProcessSessionDeliveryGeneration as t };
