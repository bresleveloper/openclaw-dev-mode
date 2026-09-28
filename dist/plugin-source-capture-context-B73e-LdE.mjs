import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-source-capture-context.ts
const runInPluginSourceCaptureContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureContext"), () => AsyncLocalStorage.snapshot());
//#endregion
export { runInPluginSourceCaptureContext as t };
