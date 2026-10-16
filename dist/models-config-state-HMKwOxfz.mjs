import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
//#region src/agents/models-config-state.ts
const MODELS_JSON_STATE = resolveGlobalSingleton(Symbol.for("openclaw.modelsJsonState"), () => ({
	writeQueue: new KeyedAsyncQueue(),
	readyCache: /* @__PURE__ */ new Map(),
	costCache: /* @__PURE__ */ new Map()
}));
//#endregion
export { MODELS_JSON_STATE as t };
