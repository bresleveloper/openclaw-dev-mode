import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-BOuHXXbo.mjs";
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
