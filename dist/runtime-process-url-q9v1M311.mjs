import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
export { resolveRuntimeProcessEntrypointUrl as t };
