import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./node-resolve-CiEFPm1c.mjs";
//#region src/plugin-sdk/node-selection-runtime.ts
const loadNodeExecRuntime = createLazyRuntimeModule(() => import("./node-exec-availability-NaMM1AwD.mjs"));
/** Loads current exec eligibility only when a harness is building its tool catalog. */
async function loadNodeExecAvailability(signal) {
	return (await loadNodeExecRuntime()).loadNodeExecAvailability(signal);
}
//#endregion
export { loadNodeExecAvailability as t };
