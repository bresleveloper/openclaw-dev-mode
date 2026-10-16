import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-QXcu2VO1.mjs";
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function registerSealedRuntimeProcessEntrypoint(name, url) {
	sealedEntrypoints.set(name, url);
}
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
export { resolveRuntimeProcessEntrypointUrl as n, registerSealedRuntimeProcessEntrypoint as t };
