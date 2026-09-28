import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/approval-gateway-runtime-context.ts
const approvalGatewayRuntimeScope = resolveGlobalSingleton(Symbol.for("openclaw.approvalGatewayRuntimeScope"), () => new AsyncLocalStorage());
/** Runs one channel account task with its owning Gateway approval principal. */
function withGatewayNativeApprovalRuntime(runtime, run) {
	return runtime ? approvalGatewayRuntimeScope.run(runtime, run) : run();
}
/** Returns the Gateway approval principal for the current channel account task. */
function getGatewayNativeApprovalRuntime() {
	return approvalGatewayRuntimeScope.getStore();
}
//#endregion
export { withGatewayNativeApprovalRuntime as n, getGatewayNativeApprovalRuntime as t };
