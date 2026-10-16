import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/operator-tool-gateway-authority.ts
const authority = new AsyncLocalStorage();
function readOperatorToolGatewayAuthority() {
	return authority.getStore();
}
function runWithOperatorToolGatewayAuthority(value, run) {
	return authority.run(value, run);
}
/** Accepted work and bounded cleanup no longer admit this request's input. */
function runOutsideOperatorToolGatewayAuthority(run) {
	return authority.exit(run);
}
//#endregion
export { runOutsideOperatorToolGatewayAuthority as n, runWithOperatorToolGatewayAuthority as r, readOperatorToolGatewayAuthority as t };
