import { createRequire } from "node:module";
//#region src/infra/net/proxyline-runtime.ts
function loadProxyline() {
	return createRequire(import.meta.url)("@openclaw/proxyline");
}
//#endregion
export { loadProxyline as t };
