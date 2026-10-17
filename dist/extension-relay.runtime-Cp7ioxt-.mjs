import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region extensions/browser/src/browser/extension-relay.runtime.ts
const getGatewayExtensionRelayModule = createLazyRuntimeModule(() => import("./gateway-relay-route-BapgHTDl.mjs"));
const getExtensionRelayModule = createLazyRuntimeModule(() => import("./relay-lifecycle-BoKWJYGf.mjs"));
//#endregion
export { getGatewayExtensionRelayModule as n, getExtensionRelayModule as t };
