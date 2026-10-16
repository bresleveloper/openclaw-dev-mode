import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region extensions/browser/src/browser/extension-relay.runtime.ts
const getGatewayExtensionRelayModule = createLazyRuntimeModule(() => import("./gateway-relay-route-ByAedxoP.mjs"));
const getExtensionRelayModule = createLazyRuntimeModule(() => import("./relay-lifecycle-D5mHp0Is.mjs"));
//#endregion
export { getGatewayExtensionRelayModule as n, getExtensionRelayModule as t };
