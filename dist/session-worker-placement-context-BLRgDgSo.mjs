import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as createWorkerSessionPlacementStore } from "./placement-store-Cit_yNZd.mjs";
//#region src/gateway/session-worker-placement-context.ts
const localPlacementState = resolveGlobalSingleton(Symbol.for("openclaw.localSessionWorkerPlacementContext"), () => ({}), (state) => {
	state.store = void 0;
});
/** Uses the live Gateway owner when present; embedded runtimes share the same lightweight DB. */
function resolveSessionWorkerPlacementContext(owner) {
	const gatewayContext = getPluginRuntimeGatewayRequestScope()?.context ?? owner;
	if (gatewayContext?.workerSessionPlacementService) return gatewayContext;
	localPlacementState.store ??= createWorkerSessionPlacementStore();
	return { workerSessionPlacementService: localPlacementState.store };
}
//#endregion
export { resolveSessionWorkerPlacementContext as t };
