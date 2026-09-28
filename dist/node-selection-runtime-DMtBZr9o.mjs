import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./node-resolve-Cy3jnd18.mjs";
//#region src/plugin-sdk/node-selection-runtime.ts
const loadNodeExecRuntime = createLazyRuntimeModule(() => import("./node-exec-availability--Em1HSf_.mjs"));
/** Loads current exec eligibility only when a harness is building its tool catalog. */
async function loadNodeExecAvailability(signal) {
	return (await loadNodeExecRuntime()).loadNodeExecAvailability(signal);
}
//#endregion
export { loadNodeExecAvailability as t };
